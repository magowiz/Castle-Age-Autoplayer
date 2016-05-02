/*jslint white: true, browser: true, devel: true, 
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,chores,$j,rison,utility,
$u,town,statsFunc,self,caap,config,con,gm,
schedule,gifting,state,stats,general,session,monster,worker,guild_monster */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          general OBJECT
// this is the main object for dealing with Generals
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

	worker.add({ name: 'general', recordIndex: 'name'});

    general.record = function () {
        this.data = {
            name : '',
            img : '',
            lvl : 0,
            lvlmax : 0,
            pct : 0,
            last : 0,
            special : '',
            atk : -1,
            def : -1,
            api : -1,
            dpi : -1,
            mpi : -1,
            eatk : -1,
            edef : -1,
            eapi : -1,
            edpi : -1,
            empi : -1,
            energy : 0,
            stamina : 0,
            attackItemBonus : 0,
            defenseItemBonus : 0,
            health : 0,
            item : 0,
            itype : 0,
            coolDown : false,
            charge : 0,
            general : 'Use Current',
            value :0,
			loadoutReview : 0,
			nameBeforeReset: '', // For recording loadout name
			items: '', // For recording loadout equipment
			mClass: '', // For recording loadout class
			powersText: '', // Powers loading string
			// player_loadouts.php?item_id=25&item_category=0&action=select_loadout_general&selection=1&loadout=1&ajax=1
			// player_loadouts.php?class_id=1&action=select_loadout_class&selection=2&loadout=1&ajax=1  wmrc
			// player_loadouts.php?selection=3&loadout=1&action=select_loadout_class_item_equipment&item_500=1_1511&item_600=1_1509&item_700=1_1508&item_800=1_1193&item_900=1_1247&item_1000=1_1150&item_1100=1_1248&item_1200=1_1249
			powers : ''
        };
    };

    general.quickSwitch = false;
    general.clickedLoadout = false;

    general.lists = {};
    general.usedGenerals = [];
    general.GeneralsList = [];
    general.LoadoutsList = [];
	general.zinLike = [];
	
    general.coolList = [
        'Monster',
        'Fortify',
        'GuildMonster',
        'Invade',
        'Duel',
        'War'];

    general.menuList = [
        'Idle',
        'Monster',
        'Fortify',
        'Guild Monster',
        'Invade',
        'Duel',
        'War',
        //'Arena',
        'Buy',
        'Income',
        'Banking',
        'Collect',
        'Quest',
        'Classic Class',
        '10v10 Class',
        '100v100 Class',
        'GB Idle',
        'Level Up'];

	worker.addPageCheck({page : 'generals', hours : 3});

    general.init = function() {
		try {
			var loadoutVals,
				result = ['gb100', 'gb10', 'gbClassic'].some( function(label) {
					return config.getItem(label + 'whenTokens') != 'Never';
				});
			
			if (!result) {
				return;
			}
			
			loadoutVals = general.records.flatten('value').filter( function(v) {
				return v;
			});
			
			general.zinLike = general.records.filter( function(r) {
				return r.special.match(/(Invigorating Spirit|Sword Dance)/);
			}).flatten('name');
			
			loadoutVals.forEach( function(v) {
				worker.addPageCheck({page : 'player_loadouts.php?loadout=' + v + '&selection=4', hours : 5});
			});
			
			['Quest', 'Monster', 'Buy', 'Idle', 'Collect', 'Fortify', 'Invade', 'Duel', 'War', 'GuildMonster'].forEach( function(g) {
				config.deleteItem(g + 'LevelUpGeneral');
			});
				
			return true;
		} catch (err) {
			con.error("ERROR in general.init: " + err.stack);
			return false;
		}
	};
	
    general.checkResults = function (page) {
        try {
			// Shrink the general box
            var name = '',
				generalBox = $j('div[style*="persistent_main_widget"]'),
				loadoutsDiv = $j('#hot_swap_loadouts_div select[name="choose_loadout"] option'),
                loadoutsList = loadoutsDiv.map(function() {
                    return this.text;
                }).get(),
                generalDiv = $j(),
				tempDiv,
	         	tNum,
				text,
				gR = {}, // A general record
				update = false;

            if (generalBox[0]) {
                generalBox[0].style.zIndex = 1;
                generalBox.mouseover(function () {
                    this.style.zIndex = 100;
                });

                generalBox.mouseout(function () {
                    this.style.zIndex = 1;
                });
            }

            // Record current loadouts
            loadoutsList.forEach( function(l, i) {
				name = 'Loadout ' + l;
				if (general.records.length < i + 1) {
					general.records.push(new general.record().data);
				}
				
				gR = general.records[i];
				if (name !== gR.name) {
					gR = general.isLoadout(gR.name) ? gR : new general.record().data;
					con.log(1, "Renaming Loadout " + gR.name + ' to ' + name);
					gR.name = name;
					gR.value = i + 1;
					state.setItem('wsave_general', true);
				}
				gR.nameBeforeReset = l.match(/Set\d+/i) ? gR.nameBeforeReset : l;
				general.records[i] = gR;
			});
			stats.records.total = general.records.length;
			
			//Get current general and loadout
			general.worker('force', generalBox, loadoutsDiv);
			
			// Check to make sure we have records for generals, and if not flag
            if ($u.hasContent(general.List) && general.List.length <= 2) {
                schedule.setItem("generals", 0);
                schedule.setItem("allGenerals", 0);
                caap.checkGenerals();
            }
			
			switch (page) {

			// On generals page, this records the basic information of all generals
			case 'generals' :
				generalDiv = $j("#app_body div.generalSmallContainer2");

			   if ($u.hasContent(generalDiv)) {
					generalDiv.each(function (index) {
						var generalData = {},
							img = '',
							item = 0,
							itype = 0,
							level = 0,
							levelmax = 0,
							percent = 0,
							atk = 0,
							def = 0,
							special = '',
							coolDown = false,
							charge = 0,
							container = $j(this),
							tempObj = $j("div.general_name_div3_padding", container);

						if ($u.hasContent(tempObj)) {
							name = tempObj.text().trim(); // save all generals with complete name (eg Corvintheus**) // 2011-09-27 d11
						} else {
							con.warn("Unable to find 'name' container", index);
						}

						tempObj = $j(".imgButton", container);
						if ($u.hasContent(tempObj)) {
							img = $u.setContent(tempObj.attr("src"), '').basename();
						} else {
							con.warn("Unable to find 'image' container", index);
						}

						tempObj = $j("input[name='item']", container);
						if ($u.hasContent(tempObj)) {
							item = $u.setContent(tempObj.attr("value"), '').parseInt();
						} else {
							con.warn("Unable to find 'item' container", index);
						}

						tempObj = $j("input[name='itype']", container);
						if ($u.hasContent(tempObj)) {
							itype = $u.setContent(tempObj.attr("value"), '').parseInt();
						} else {
							con.warn("Unable to find 'itype' container", index);
						}

						tempObj = container.find('div:contains("Level"):last');
						if ($u.hasContent(tempObj)) {
							level = $u.setContent(tempObj.text(), '0').regex(/Level (\d+)\/\d+/i, '');
							levelmax = $u.setContent(tempObj.text(), '0').regex(/Level \d+\/(\d+)/i, '');
						} else {
							con.warn("Unable to find 'level' container", index);
						}

						tempObj = $j("div[style*='graphics/bar_img.jpg']", container);
						if ($u.hasContent(tempObj)) {
							percent = tempObj.getPercent('width');
						} else {
							con.warn("Unable to find 'level percent' container", index);
						}

						tempObj = container.children('div:last').children('div');
						if ($u.hasContent(tempObj)) {
							special = $u.setContent(tempObj.html(tempObj.html().replace(/<br>/g, ' ')).text().trim());
						} else {
							con.warn("Unable to find 'special' container", index);
						}

						tempObj = $j("div[style*='graphics/gen_chargebarsmall.gif']", container);
						coolDown = $u.setContent(special.regex(/(\d+) Hour Cooldown:/), false);
						if (coolDown && ($u.hasContent(tempObj) || container.text().indexOf('Charged!') !== -1)) {
							charge = $u.setContent(tempObj.getPercent("width"), 0);
							charge = Date.now() + (1 - charge / 100) * coolDown * 3600000;
							con.log(3, name + ' charged after ' + $u.makeTime(charge, caap.timeStr(true)));
						} else {
							con.log(4, "Not a cool down general", index);
						}

						tempObj = $j(".general_pic_div3", container);
						if ($u.hasContent(tempObj)) {
							atk = $u.setContent(tempObj.next('div:first').children('div:eq(0)').text(), '0').parseInt();
							def = $u.setContent(tempObj.next('div:first').children('div:eq(1)').text(), '0').parseInt();
						} else {
							con.warn("Unable to find 'attack and defence' containers", index);
						}

						if ($u.hasContent(name) && $u.hasContent(img) && $u.hasContent(level) && $u.hasContent(percent) && !$u.isNaN(atk) && !$u.isNaN(def) && $u.hasContent(special)) {
							generalData = general.getRecord(name);
							if (generalData.newRecord) {
								con.log(1, "Adding new 'General'", name);
								generalData = general.records[general.records.push(new general.record().data) - 1];
								update = true;
							}

							// If we've reviewed before and general level hasn't changed, assume we don't need to review
							if (generalData.lvl == level && generalData.eatk !== 0) {
								generalData.last = Date.now();
							}

							generalData.name = name;
							generalData.img = img;
							generalData.item = item;
							generalData.itype = itype;
							generalData.coolDown = coolDown;
							generalData.charge = charge;
							generalData.lvl = level;
							generalData.lvlmax = levelmax;
							generalData.pct = percent;
							generalData.atk = atk;
							generalData.def = def;
							generalData.api = (atk + (def * 0.7)).dp(2);
							generalData.dpi = (def + (atk * 0.7)).dp(2);
							generalData.mpi = ((generalData.api + generalData.dpi) / 2).dp(2);
							generalData.special = special;

							general.setRecord(generalData);
							container = null;
							tempObj = null;
						} else {
							con.warn("Missing required 'General' attribute", index);
						}
					});

					if (state.getItem('wsave_general', true)) {
						statsFunc.setRecord(stats);
						if (update) {
							general.UpdateDropDowns();
						}
					}
				}

				break;
			case 'keep' : // I think this is here as a high priority part of the finder check on keep items
				if (!$u.hasContent($j('#equipmentItemsSection img[src*="keep_plus.jpg"][onclick*="Items"]:visible'))) {
					state.setItem('generalKeep', false);
					$j('#equipmentItemsSection div[id^="equipmentItems_hover_info_"]').each( function() {
						var pic = $j(this).prev().find('img').attr('src').regex(/(\w+\.\w+)$/),
							item = $j(this).attr('id').regexd(/(\d+_\d+)/, '');
						town.setRecordVal(pic, 'item', item);
					});
				}
				break;
			case 'player_loadouts' :
				tNum = $j('#loadout_selection_section select[name="choose_loadout"] option:selected').attr('value');
				
				if (!tNum) {
					return false;
				}
				
				gR = general.getRecordByField('value', tNum.numberOnly());
				
				text = $j('#loadout_general img').attr('src');
				gR.general = $u.hasContent(text) ? general.getRecordByField('img', text.regex(/.*\/(\w+\.\w+)/)).name :
					$u.setContent(gR.general, 'Use Current');
				
				gR.powers = $j.makeArray($j('#loadout_powers').find('img').map(function() {
					return $j(this).attr('src').regex(/(\w+\.\w+)$/); 
				})).join(' ') + ' attack wall_move_icon';
				
				gR.items = $u.setContent($j.makeArray($j('#loadout_equipment img').map(function(i) {
					return 'item_' + (i * 100 + 500) + '=' + town.getRecordVal($j(this).attr('src').replace(/.*\//, ''), 'item', '') + '&';
				})).join(''), gR.items);
				
				if (gR.items.regex(/item_(\d+)=&/)) {
					con.log(2, 'Need to check keep to confirm loadout item codes');
					state.deleteItem('generalKeep');
				}
				
				tNum = ['No', 'Warrior', 'Rogue', 'Mage', 'Cleric'].indexOf($j('#loadout_class').text().trim().innerTrim().regexd(/CLASS (\w+)/, 'No'));
				gR.mClass = tNum == 0 ? gR.mClass : tNum;
				
				tempDiv = $j('#app_body div[id^="open_power_slot_"]');
				if ($u.hasContent(tempDiv)) {
					gR.powersText = $j.makeArray($j('#app_body div[id^="open_power_slot_"]').find('div[onclick^="unpickPower"]').map(function() {
						return $j(this).attr('onclick').regexd(/unpickPower\((\d),(\d+),(\d+)/, []).join('_');
					})).join('%3B');
				}
				
				general.setRecord(gR);
				
				stats.guild.powers = [];
				general.records.flatten('powers').forEach( function(p) {
					p.split(' ').forEach( function(e) {
						stats.guild.powers = stats.guild.powers.addToList(e);
					});
				});
				stats.guild.powers = stats.guild.powers.join(' ');
				con.log(2, 'GB powers available: ' + stats.guild.powers);

				break;
			default :
				break;
			}
        } catch (err) {
            con.error("ERROR in general.checkResults: " + err.stack);
            return false;
        }
    };
	
	worker.addAction({worker : 'general', priority : 100000, description : 'Checking current general'});
	general.worker = function(newpage, generalBox, loadoutsDiv) {
		try {
    		if (!newpage && !general.quickSwitch) {
				return false;
			}

			general.quickSwitch = false;
			generalBox = $u.setContent(generalBox, $j('div[style*="persistent_main_widget"]'));
			loadoutsDiv = $u.setContent(loadoutsDiv, $j('#hot_swap_loadouts_div select[name="choose_loadout"] option'));
			
			var loadoutRecord = {},
                generalRecord = {},
                success = false,
                defaultLoadout = config.getItem("DefaultLoadout", 'Use Current'),
				eatk, edef,
                temptext = '',
				generalDiv,
				generalName = $j('div:first > div:first > div:nth-child(2), #equippedGeneralContainer div.general_name_div3', generalBox).text().trim(),loadoutName = loadoutsDiv.filter(':selected').text().trim();
				
			// Get the current general
            
            if (!generalName) {
                con.warn("Couldn't get current 'General'. Using 'Use Current'");
                general.current = 'Use Current';
            } else {
				general.current = generalName;
			}

			// Get the current loadout
            if (!loadoutName) {
				if (stats.level >= 101) {
					con.warn("Couldn't get current 'loadout'. Using 'Use Current'");
				}
                general.loadout = 'Use Current';
            }

            general.loadout = "Loadout " + loadoutName;
			loadoutRecord = general.getRecord(general.loadout);
			generalRecord = general.getRecord(general.current);
			
			// Record the general information if a loadout has been clicked or none if loadout is not defined
			if (general.clickedLoadout !== false) {
				if (session.getItem('page','None') === 'player_loadouts') {
					general.records[general.clickedLoadout].last = Date.now();
					con.log(2, general.records[general.clickedLoadout].name + " is not configured.");
				} else if (general.clickedLoadout == loadoutRecord.value - 1) {
					general.records[general.clickedLoadout].last = Date.now();
					if (general.loadout == general.records[general.clickedLoadout].name && general.records[general.clickedLoadout].general !== general.current) {
						con.log(2,"Updated general for " + general.records[general.clickedLoadout].name + " is " + general.current, general.records);
						general.records[general.clickedLoadout].general = general.current;
					}
				}
			}
			general.clickedLoadout = false;

			// If exp changed, check for general gain level pop up to add a level to the general
			if (general.exp != stats.exp.num && $u.hasContent($j('#single_popup_event div[style*="popup_hero_level_up.jpg"]')) && schedule.check('generalLeveledUp')) {
				con.log(2, 'General ' + general.current + ' has gained a level!', generalRecord);
				generalRecord.lvl += 1;
				schedule.setItem('generalLeveledUp', 60);
			}
			general.exp = stats.exp.num;
				
            if (general.current === 'Use Current' || !generalRecord) {
                con.warn("Get Equipped Stats: Unable to find 'General' record", general.current);
                return false;
            }

            generalDiv = $j("#globalContainer div[style*='persistent_main_widget'] div[style*='width:25px;']");
            if ($u.hasContent(generalDiv) && generalDiv.length === 2) {
                temptext = $u.setContent(generalDiv.text(), '');
                if ($u.hasContent(temptext)) {
                    eatk = $u.setContent(temptext.regex(/\s+(\d+)\s+\d+/i), 0);
                    edef = $u.setContent(temptext.regex(/\s+\d+\s+(\d+)/i), 0);
                    if ($u.isNumber(eatk) && $u.isNumber(edef)) {
                        //con.log(2, "General equipped atk/def", eatk, edef);
                        success = true;
                    } else {
                        con.warn("Unable to get 'General' attack or defense", temptext);
                    }
                } else {
                    con.warn("Unable to get 'General' equipped status");
                }

                if (success) {
                    if (general.loadout === defaultLoadout || defaultLoadout == 'Use Current') {
                        general.assignStats(generalRecord, eatk, edef);
                    }
                    if (loadoutRecord.general === general.current) {
                        general.assignStats(loadoutRecord, eatk, edef);
                    }

                } else {
                    con.warn("Unable to get 'General' stats");
                }
            } else {
                con.warn("Unable to get equipped 'General' div");
            }

			return false;
        } catch (err) {
            con.error("ERROR in general.worker: " + err.stack);
            return false;
        }
    };

    general.filters = {
        Buy : [
            'Darius',
            'Lucius',
            'Garlan',
            'Penelope'],
        Income : [
            'Scarlett',
            'Mercedes',
            'Cid'],
        Banking : [
            'Aeris'],
        Collect : [
            'Angelica',
            'Morrigan',
            'Valiant'],
        Quest : [
            'Under Level',
            'Sano',
            'Titania']
    };

    general.parseTime = function (timeString) {
        if (timeString == '') {
			return null;
		}

        var time = timeString.match(/(\d+)(:(\d\d))?\s*(a|p)?/i),
			hours,
			d = new Date(),
			ampm = '';
			
        if (time == null) {
			return null;
		}

		ampm = $u.setContent(time[4], '');
		
        hours = parseInt(time[1],10);
		if (hours == 12 && ampm.match(/a/i)) {
          hours = 0;
		} else {
			hours += hours < 12 && ampm.match(/p/i) ? 12 : 0;
		}
        d.setHours(hours);
        d.setMinutes(parseInt(time[3],10) || 0);
        d.setSeconds(0, 0);
        return d;
    };

    // Parse the menu item too see if a loadout override should be equipped.  If time is during a general override time,
    // the according general will be equipped, and a value of True will be returned continually to the main loop, so no
    // other action will be taken until the time is up.
    // Returns false if not timed set, "change" if a timed loadout was changed, and "set" if done setting a timed loadout
    general.timedLoadout = function () {
        try {
            var timedLoadoutsList = config.getList('timed_loadouts', ''),
                begin = 0,
                end = 0,
                match = false,
                targetGeneral = false,
                timeStrings = '',
                now = new Date();
            // Priority generals, such as Guild Battle class generals, outrank timed generals.
            if (stats.priorityGeneral != 'Use Current') {
                timeStrings = now.toLocaleTimeString().replace(/:\d+ /,' ') + '@' + stats.priorityGeneral;
                timedLoadoutsList.unshift(timeStrings);
                con.log(2,'Priority gen set', timeStrings, timedLoadoutsList);
            }
            con.log(5, 'timedLoadoutsList', timedLoadoutsList);
            // Next we step through the users list getting the name and conditions
            timedLoadoutsList.some( function(l) {
                if (!l.toString().trim()) {
                    return false;
                }
                timeStrings = l.toString().split('-');
                con.log(4,'timeStrings',timeStrings);
                if (timeStrings.length === 1) {
                    begin = general.parseTime(timeStrings[0]) - 2 * 60 * 1000;
                    end = begin + 4 * 60 * 1000;
                } else {
                    begin = general.parseTime(timeStrings[0]);
                    end = general.parseTime(timeStrings[1]);
                    end = end > begin ? end : end.setHours(end.getHours() +  24);
                    // Need to add a check here in case going over midnight hour
                }
                con.log(4,'begin ' + $u.makeTime(begin, caap.timeStr(true)) + ' end ' + $u.makeTime(end, caap.timeStr(true)) + ' time ' + $u.makeTime(now, caap.timeStr(true)), begin, end, now);

                if (begin < now && now < end) {
                    match = true;
                    con.log(4, 'valid time of ',timeStrings);
                }
                // Now we check the other elements to look for a general name to load, prefixed with '@'
                if (match && l.toString().split('@').length > 1) {
                    targetGeneral = l.toString().split('@')[1].trim();
                    con.log(2, 'Timed general set:', targetGeneral);
                    return true;
                }
            });
            return targetGeneral;
        } catch (err) {
            con.error("ERROR in general.timedLoadout: " + err.stack);
            return false;
        }
    };

	general.resetCharge = function() {
        try {
			var genObj = general.getRecord(general.current);
			if (genObj.coolDown > 0 && schedule.since(genObj.charge, 0)) {
				genObj.charge = Date.now() + genObj.coolDown * 3600000;
				con.log(2, 'Reset general charge for ' + genObj.name + ' to be ready ' + $u.makeTime(genObj.charge, caap.timeStr(true)), genObj);
				general.setRecord(genObj);
			}
        } catch (err) {
            con.error("ERROR in general.resetCharge: " + err.stack);
            return false;
        }
    };
	
    general.isLoadout = function (name) {
		if (!$u.isString(name) || name.indexOf('Loadout ') < 0) {
			return false;
		}
		return name.replace('Loadout ','');
    };

    general.BuildLists = function () {
        try {
            var fullList = [],
                generalList = [],
				CoolDownNames = [],
				defaultLoadout = config.getItem('Default Loadout', 'Use Current'),
                usedGen = '',
				uGR = {},
				generalNames = [],
                crossList = function (checkItem) {
                    return generalList.hasIndexOf(checkItem) >= 0;
                };

            con.log(2, 'Building Generals Lists');
			
			['energy', 'stamina', 'health'].forEach(function(stat) {
				stats[stat].min = 0;
			});
			
			CoolDownNames = general.records.filter( function(r) {
				return r.coolDown;
			}).flatten('name').sort();
			
			generalNames = general.records.flatten('name');

			generalNames.forEach( function(n) {
			    if (!general.isLoadout(n)) {
                    general.GeneralsList.addToList(n);
                } else {
                    general.LoadoutsList.addToList(n);
                }
            });
            general.GeneralsList = general.GeneralsList.sort();
            fullList = general.LoadoutsList.concat(general.GeneralsList);
            generalList = ['Under Level'].concat(fullList);

            general.menuList.forEach(function(item) {
                usedGen = config.getItem(item + 'General', 'Use Current');
                if (['Use Current', 'Under Level', ''].indexOf(usedGen) == -1 && general.usedGenerals.indexOf(usedGen) == -1) {
                    general.usedGenerals.addToList(usedGen);
					uGR = general.getRecord(usedGen);
					['energy', 'stamina', 'health'].forEach(function(stat) {
						if (general.isLoadout(usedGen)) {
							stats[stat].min = Math.min(stats[stat].min, $u.setContent(uGR[stat], 0));
						} else if (defaultLoadout == 'Use Current') {
							stats[stat].min = Math.min(stats[stat].min, $u.setContent(uGR[stat], 0));
						} else {
							stats[stat].min = Math.min(stats[stat].min, $u.setContent(uGR[stat] + general.getRecord(defaultLoadout)[stat], 0));
						}
						//con.log(2, 'Min loadout/general en/sta adjustment calc', uGR, stats[stat].min, stats[stat]);
					});
                }
                general.lists[item] = ($u.isArray(general.filters[item]) && config.getItem("filterGeneral", true)) ? general.filters[item].filter(crossList) : generalList;
            });

            general.coolDownList = [''].concat(CoolDownNames);

            con.log(2, 'Built lists', general.LoadoutsList, general.lists, general.usedGenerals);

            return true;
        } catch (err) {
            con.error("ERROR in general.BuildLists: " + err.stack);
            return false;
        }
    };

    general.assignStats = function (generalRecord, eatk, edef) {
        try {
            generalRecord.eatk = eatk;
            generalRecord.edef = edef;
            generalRecord.eapi = (generalRecord.eatk + (generalRecord.edef * 0.7)).dp(2);
            generalRecord.edpi = (generalRecord.edef + (generalRecord.eatk * 0.7)).dp(2);
            generalRecord.empi = ((generalRecord.eapi + generalRecord.edpi) / 2).dp(2);
			['energy', 'stamina', 'health'].forEach(function(stat) {
				if (stats[stat].norm && stats[stat].max) {
					generalRecord[stat] = stats[stat].max - stats[stat].norm;
					//con.log(2, 'Updated ' + stat + ' adjustement for ' + generalRecord.name + ' to ' + generalRecord[stat], generalRecord, stats[stat]);
					if (general.usedGenerals.indexOf(generalRecord.name) > 0) {
						stats[stat].min = Math.min(stats[stat].min, generalRecord[stat]);
					}
				}
			});
            generalRecord.last = Date.now();
            general.setRecord(generalRecord);
            //con.log(2, "Got general stats for " + generalRecord.name, generalRecord);
            return true;
        } catch (err) {
            con.error("ERROR in general.assignStats: " + err.stack);
            return false;
        }
    };

    general.UpdateDropDowns = function () {
        try {
            if (!caap.oneMinuteUpdate('generalUpdateDropDowns')) {
                return false;
            }
			
            var coolDown = '';

            general.BuildLists();
            con.log(3, "Updating 'General' Drop Down Lists");
            caap.changeDropDownList('DefaultLoadout', ['Use Current'].concat(general.LoadoutsList), config.getItem('DefaultLoadout', 'Use Current'));
            general.menuList.forEach( function(g) {
                caap.changeDropDownList(g.replace(/ /g,'_') + 'General', ['Use Current'].concat(general.lists[g]), config.getItem(g + 'General', 'Use Current'));
                coolDown = general.getCoolDownType(g);
                if (coolDown) {
					caap.changeDropDownList(coolDown, general.coolDownList, config.getItem(coolDown, ''));
				}
            });

            if (coolDown && general.coolDownList.length > 1) {
                $j("div[id*='_cool_row']", caap.caapDivObject).css("display", "block");
                if (general.zinLike.length) {
                    $j("div[id*='_zin_row']", caap.caapDivObject).css("display", "block");
                }
            }
            return true;
        } catch (err) {
            con.error("ERROR in general.UpdateDropDowns: " + err.stack, err);
            return false;
        }
    };

    general.getCoolDownType = function (whichGeneral) {
        try {
            var generalType = whichGeneral ? whichGeneral.replace(/General/i, '').trim() : '';

           if (general.coolList.indexOf(generalType) >= 0) {
                con.log(5,'Cool General',generalType, whichGeneral);
                return generalType + "CoolGeneral";
            }
            con.log(5,'NO Cool General',generalType, whichGeneral);

            return '';
        } catch (err) {
            con.error("ERROR in general.getCoolDownType: " + err.stack);
            return undefined;
        }
    };

	// Provides lookup of a general equipped to a loadout. If general submitted, returns that general. If "Use Current," returns current general
    general.getLoadoutGeneral = function (name) {
		name = general.isLoadout(name) ? general.getRecordVal(name, 'general') : name;
		return name == 'Use Current' ? general.current : name;
    };

	// Provides lookup of a general equipped to a menu general setting. If general submitted, returns that general. If "Use Current," returns current general
    general.getConfigMenuGeneral = function (configLabel) {
		var name = general.getLoadoutGeneral(general.Select(configLabel , 'name only'));
		return general.getLoadoutGeneral(name);
    };

	general.charged = function(name) {
		var go = $u.isObject(name) ? name : general.getRecord($u.isString(name) ? name : general.current);
		return  !go.newRecord && go.coolDown ? schedule.since(go.charge, 0) : false;
	};

	// Checks to see if Zin-like general will be equipped and if fully charged
    general.ZinMisaCheck = function (configLabel) {
		var name = general.getConfigMenuGeneral(configLabel);
		return general.zinLike.hasIndexOf(name) && general.charged(name);
    };
	
    // Convert from a role like "IdleGeneral" to a specific general required, and then calls a function to select that general
	// If returnNametf is true, it returns the name of the general it would select, but doesn't actually change
    general.Select = function (whichGeneralwExp, returnNametf) {
        try {
            var targetGeneral = '',
				expGain = whichGeneralwExp.regexd(/:(\d+)/, 0),
				whichGeneral = whichGeneralwExp.replace(/:.*/, ''),
				underLevelGenerals = [],
				useStaminaAction = !['arena.doArenaBattle', 'conquest.worker'].hasIndexOf(session.getItem('ThisAction', 'none'))
					&& !caap.inLevelUpMode() && ['InvadeGeneral', 'DuelGeneral'].hasIndexOf(whichGeneral)
					&& config.getItem("useZinMisaFirst", false),
				useZinLike = useStaminaAction && general.zinLike.filter( function(g) {
					var special = general.getRecordVal(g, 'special'),
						stat = special.regexd(/(Energy|Stamina)/, 'Energy').toLowerCase(),
						amount = special.regex(/(?:Spirit|Dance) \+(\d+)/);
					return stats[stat].max - stats[stat].num > amount && general.charged(g);
				}),
                coolType = general.getCoolDownType(whichGeneral),
                coolName = useZinLike.length ? useZinLike.shift() : coolType ? config.getItem(coolType, '') : '';

            if (general.records.length <= (stats.level >= 100 ? 20 : 1)) {
                con.log(1, "Generals count of " + general.records.length + " <= " + (stats.level >= 100 ? 20 : 2) + ', checking Generals page');
                return caap.navigateTo('generals');
            }
			
            if (expGain >= stats.exp.dif && config.getItem('Level_UpGeneral', 'Use Current') != 'Use Current') {
                whichGeneral = 'Level_UpGeneral';
				coolType = general.getCoolDownType(whichGeneral);
                con.log(2, 'Level Up! Action could give up to ' + expGain + ' exp and only ' + stats.exp.dif + ' exp to next level');
            }

            //Check what target general should be
            targetGeneral = general.charged(coolName) && session.getItem('ThisAction', 'none') != 'feed.worker' ? coolName : whichGeneral.indexOf('General') > 0 ? config.getItem(whichGeneral, whichGeneral) : whichGeneral;
            //con.log(2, 'Select General ', whichGeneral, targetGeneral, coolName, config.getItem(whichGeneral, whichGeneral));

            if (targetGeneral == 'Use Current') {
                return returnNametf ? 'Use Current' : false;
            }
			
            if (/under level/i.test(targetGeneral)) {
				underLevelGenerals = general.records.filter( function(g) {
					return !general.isLoadout(g.name) && g.pct < 100;
				});
				
                if (!underLevelGenerals.length) {
                    return returnNametf ? 'Use Current' : false;
                }
                targetGeneral = (config.getItem('generalLevelLowestFirst') ? underLevelGenerals.sort($u.sortBy(true, 'lvl')).pop() : underLevelGenerals.sort($u.sortBy(false, 'lvl')).pop()).name;
            }

            return general.selectSpecific(targetGeneral, returnNametf);
        } catch (err) {
            con.error("ERROR in general.Select: " + err.stack);
            return false;
        }
    };
	
	// If not ok to switch general due to stat loss, returns true
	general.changeStatCheck = function(g) { //target general, current general
		return ['stamina', 'energy'].reduce( function(p, s) {
			var nextGenS = general.getRecordVal(g, s),
				curGenS = general.getRecordVal(general.current, s);
			if (nextGenS < curGenS && stats[s].num > stats[s].norm + nextGenS) {
				con.warn('Overrode general change to ' + g + ' because ' + stats[s].num + ' ' + s + ' greater than max ' + stats[s].norm + ' plus general mod of  ' + nextGenS);
				return true;
			}
			return p;
		}, false);
	};
		
	// Log player set general, to return to that general after doing work in passive general
	general.logGeneral = function(isLoadout) { //general or Loadout
		if (config.getItem('IdleGeneral', 'Use Current') != 'Use Current') {
			if (isLoadout && state.getItem('lastLoadout', 'Use Current') == 'Use Current') {
				state.setItem('lastLoadout', general.current);
			}
			if (state.getItem('lastGeneral', 'Use Current') == 'Use Current') {
				state.setItem('lastGeneral', general.loadout);
			}
		}
	};
		
    // Load a specific general or loadout by name.  'Use Current' is used for no preference.
	// If returnNametf is true, then returns the name of general to be equipped instead of doing so
    general.selectSpecific = function(targetGeneral, returnNametf) {
        try {
            var	targetLoadout = '',
				text = '',
				gR = {},
				click = false,
                timedGeneral = general.timedLoadout(),
				resultTrue = returnNametf ? targetGeneral : true,
				resultFalse = returnNametf ? targetGeneral : false,
				freezeTf = resultFalse,
                lRecord = {},
	            defaultLoadout = config.getItem("DefaultLoadout", 'Use Current');
			
			targetGeneral = $u.setContent(targetGeneral, 'Use Current');
			if (!general.hasRecord(general.current) && !returnNametf) {
				con.warn('Current general unknown. Going to generals page to get general records.');
				if (caap.navigateTo('generals')) {
					return true;
				}
				return caap.navigateTo('keep');
			}

            if (timedGeneral && timedGeneral != targetGeneral && (targetGeneral != 'Use Current' || general.current != timedGeneral)) {
				freezeTf = config.getItem('timedFreeze', true);
                if (!returnNametf) {
					caap.passThrough({action:false, mlog: 'Change to ' + targetGeneral + (freezeTf ? ' paused' : ' ignored') + ' for timed general ' + timedGeneral}, 'general');
				}
                targetGeneral = timedGeneral;
				resultTrue = returnNametf ? targetGeneral : true;
				resultFalse = returnNametf ? targetGeneral : freezeTf;
            } else {
				caap.passThrough({action: false, mess: ''}, 'general');
			}

			if (defaultLoadout != 'Use Current' && !general.hasRecord(defaultLoadout)) {
				// Unable to equip, but remember setting in case it was a loadouts reset
				defaultLoadout = 'Use Current';
            }

            if (targetGeneral == 'Use Current') {
                return resultFalse;
            }

            // Confirm loadout is ok
			if (stats.level > 100) {
				
				// I think this is part of the finder logic to check keep items
				if (state.getItem('generalKeep', true) && !returnNametf) {
					if (caap.navigateTo('keep')) {
						return true;
					}
					$j('#equipmentItemsSection img[src*="keep_plus.jpg"][onclick*="Items"]:visible').click();
					caap.setDomWaiting('keep.php');
					caap.clearDomWaiting();
					caap.checkResultsTop();
					return true;
				}
				
				/*-------------------------------------------------------------------------------------\
												Rebuild reset loadouts
				\-------------------------------------------------------------------------------------*/
				general.records.some( function(g) {
					if (!general.isLoadout(g.name) || returnNametf) {
						return true;
					}
					
					if (!g.name.match(/Set\d+/) || g.general == 'Use Current' || !$u.hasContent(g.mClass) || !$u.hasContent(g.items) || !$u.hasContent(g.powersText)) {
						return false;
					}
					
					con.log(2, 'Loadout ' + g.nameBeforeReset + ' appears to be reset. Attempting to rebuild');
					if (caap.page != 'player_loadouts' || !caap.clickUrl.hasIndexOf('loadout=' + g.value)) {
						caap.ajaxLink('player_loadouts.php?item_id=' + general.getRecordVal(g.general, 'item', false) + '&item_category=' +
						general.getRecordVal(g.general, 'itype', false) + '&action=select_loadout_general&selection=1&loadout=' + g.value);
						click = true;
						return true;
					}
					text = $j('#loadout_items').text().trim().innerTrim();
					//GENERAL No General Selected! CLASS No Class Selected! EQUIPMENT ATK: 0 DEF: 0 GUILD POWERS No Guild Powers Selected! LOADOUT ICON No Icon Powers Selected!
					if (text.match(/CLASS No Class Selected/)) {
						caap.ajaxLink('player_loadouts.php?class_id=' + g.mClass + '&action=select_loadout_class&selection=2&loadout=' + g.value);
						click = true;
						return true;
					}
					if (text.match(/EQUIPMENT ATK: 0 DEF: 0/)) {
						// player_loadouts.php?selection=3&loadout=1&action=select_loadout_class_item_equipment&item_500=1_1511&item_600=1_1509&item_700=1_1508&item_800=1_1193&item_900=1_1247&item_1000=1_1150&item_1100=1_1248&item_1200=1_1249
						text = g.items;
						['5', '6', '7', '8', '9', '10', '11', '12', '13'].forEach( function(n) {
							text = text + (text.hasIndexOf('item_' + n + '00=') ? '' : 'item_' + n + '00=unset&');
						});
						caap.ajaxLink('player_loadouts.php?selection=3&action=select_loadout_class_item_equipment&' + text +
							'loadout=' + g.value);
						click = true;
						return true;
					}
					if (text.match(/GUILD POWERS No Guild Powers Selected/)) {
			//player_loadouts.php?selection=4&loadout=1&action=select_loadout_class_power_equipment&equipment=4_1_1%3B4_40_1%3B4_40_8&class_id=4
			//player_loadouts.php?selection=4&loadout=6&action=select_loadout_class_item_equipment&equipment=4_1_1%3B4_40_1%3B4_40_5&class_id=4
						caap.ajaxLink('player_loadouts.php?selection=4&loadout=' + g.value + '&action=select_loadout_class_power_equipment&equipment=' + g.powersText + '&class_id=' + g.mClass);
						click = true;
						return true;
					}
					//player_loadouts.php?loadout_name=&action=set_loadout_name&loadout=1&ajax=1
					caap.ajaxLink('player_loadouts.php?loadout_name=' + encodeURIComponent(g.nameBeforeReset) + '&action=set_loadout_name&loadout=' + g.value);
					click = true;
					return true;
				});
				
				if (click) {
					return true;
				}

				targetLoadout = general.isLoadout(targetGeneral) ? targetGeneral : defaultLoadout;
				targetLoadout = (targetLoadout === "Use Current") ? general.loadout : targetLoadout;
				lRecord = general.getRecord(targetLoadout);
				if (lRecord.newRecord) {
					con.error('Unable to find loadout. Reset and unable to rebuild? Ignoring');
					return resultFalse;
				}
				targetGeneral = general.isLoadout(targetGeneral) ? lRecord.general : targetGeneral;
				if (general.changeStatCheck(targetLoadout)) {
					con.log(1, 'Overriding loadout change to ' + targetLoadout + ' since it would cause stat loss');
				} else if (targetLoadout !== general.loadout || (targetLoadout == general.loadout && lRecord.general == targetGeneral
					&& general.current !== targetGeneral && targetGeneral !== 'Use Current')) {
					if (returnNametf) {
						return targetLoadout;
					}
					con.log(2,'Loading ' + targetLoadout + ' loadout #' + lRecord.value, lRecord);
					
					general.logGeneral(true);
					general.quickSwitch = true;
					general.clickedLoadout = lRecord.value - 1;
					caap.click($j('div[id*="hot_swap_loadouts_content_div"] > div:nth-child(' + lRecord.value + ') > div:first'));
					return resultTrue;
				}
			}
			
            // Confirm if necessary to load a different general
            if (targetGeneral === general.current || targetGeneral === 'Use Current') {
                return resultFalse;
            }

			if (general.changeStatCheck(targetGeneral)) {
				con.log(1, 'Overriding general change to ' + targetGeneral + ' since it would cause stat loss');
				return returnNametf ? general.current : freezeTf;
			}
			if (returnNametf) {
				return targetGeneral;
			}
			
            con.log(2, 'Quickswitch from ' + general.current + ' to ' + targetGeneral);
			general.quickSwitch = true;

			gR = general.getRecord(targetGeneral);
            if (gR.newRecord) {
				con.warn('Could not find item value for ' + targetGeneral);
				return resultFalse;
			}
			
            window.location.href = caap.jss + ":void(doHotSwapGeneral('" + gR.item + "', '" + gR.itype + "', false))";
			return resultTrue;
        } catch (err) {
            con.error("ERROR in general.selectSpecific: " + err.stack);
            return false;
        }
    };

    general.menu = function () {
        try {
			general.BuildLists();
			
			// Should be ok to remove update step after June 2015 -- Artifice
			if (!config.getItem('QuestGeneral') && config.getItem('SubQuestGeneral')) {
				config.setItem('QuestGeneral', config.getItem('SubQuestGeneral'));
				config.deleteItem('SubQuestGeneral');
			}
			
            // Add General Comboboxes
            var LevelLowestFirstInst = "This will make the script level lowest level generals first. If unchecked, it will level up the highest generals first.",
                LevelUpGenInstructions9 = "Ignore Banking until level up energy and stamina gains have been used.",
                LevelUpGenInstructions10 = "Ignore Income until level up energy and stamina gains have been used.",
                timedLoadoutsList = "List of specific loadouts and time that loadout should loaded, such as '1 PM@Loadout Guild, 7 PM@Loadout Guild, 3@Loadout LoM, 14:30 - 18:30@Use Current",
                timedFreezeInstructions = "If CAAP tries to equip a different general during a timed loadout or Guild Battle, freeze CAAP until time is up.  If not checked, CAAP will continue but without changing the general.",
                coolDown = '',
                htmlCode = '',
				gen = '';

            htmlCode += caap.startToggle('Generals', 'GENERALS');
            htmlCode += caap.makeCheckTR("Filter Generals", 'filterGeneral', true, "Filter General lists for most useable in category.");
            htmlCode += caap.makeDropDownTR("Default Loadout", 'DefaultLoadout', ['Use Current'].concat(general.LoadoutsList), '', '', 'Use Current', false, false, 62);
            general.menuList.forEach( function(g) {
				gen = g.replace(/ /g,'_') + 'General';
                htmlCode += caap.makeDropDownTR(g, gen, ['Use Current'].concat(general.lists[g]), '', '', config.getItem(gen, 'Use Current'), false, false, 62);
                coolDown = general.getCoolDownType(g);
                htmlCode += coolDown ? caap.makeDropDownTR("Cool", coolDown, general.coolDownList, '', '', '', true, false, 62, '', '_cool_row', general.coolDownList.length > 1 ? "display: block;" : "display: none;") : '';
            });
            htmlCode += caap.display.start('Level_UpGeneral', 'isnot', 'Use Current');
            htmlCode += caap.makeCheckTR("Do not Bank After", 'NoBankAfterLvl', true, LevelUpGenInstructions9, true, false);
            htmlCode += caap.makeCheckTR("Do not Income After", 'NoIncomeAfterLvl', true, LevelUpGenInstructions10, true, false);
            htmlCode += caap.display.end('Level_UpGeneral', 'isnot', 'Use Current');
            htmlCode += caap.makeCheckTR("Level Lowest General First", 'generalLevelLowestFirst', true, LevelLowestFirstInst);
            htmlCode += caap.makeTD("Use timed Loadouts at these times <a href='http://caaplayer.freeforums.org/viewtopic.php?f=9&t=828' target='_blank' style='color: blue'>(INFO)</a>");
            htmlCode += caap.makeTextBox('timed_loadouts', timedLoadoutsList, '', '');
            htmlCode += caap.makeCheckTR("Freeze for timed Loadouts or Guild Battles", 'timedFreeze', true, timedFreezeInstructions);
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in general.menu: " + err.stack);
            return '';
        }
    };

	general.dashboard = {
		name: 'Generals',
		inst: 'Display information about your Generals',
		records: 'general',
		buttons: ['clear'],
		tableTemplate: { width: '5.5%', format: 'nonnegative' },
		
		tableEntries: [ 
			{name: 'General', value: 'name', color: 'blue', width: '13%', format: 'text',
				valueF: function(r) {
					return '<div class="hotSwapGenName" onclick="doHotSwapGeneral(\'' + r.item + '\', \'' + r.itype + '\', false);">' + 
						r.name + '</div>';
			}},
			{name: 'Lvl',
				valueF: function(r) {
					return r.lvl + '/' + r.lvlmax;
			}},
			{name: 'Atk'},
			{name: 'Def'},
			{name: 'EAPI'},
			{name: 'EDPI'},
			{name: 'EMPI'},
			{name: 'Special', width: '46.5%'}
		]
	};

}());
