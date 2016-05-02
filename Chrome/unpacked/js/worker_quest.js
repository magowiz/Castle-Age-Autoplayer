/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,$,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,gm,hiddenVar,
devVersion,caapVersion,caapjQuery,caapjQueryUI,caapjQueryDataTables,
battle,feed,festival,spreadsheet,town,FB,conquest,
image64:true,offline:true,profiles:true,
session:true,state:true,css:true,gm:true,ss:true,db:true,sort:true,schedule:true,
general:true,monster:true,guild_monster:true,gifting:true,army:true,caap:true,con:true,
schedule,gifting,state,army, general,session,monster,quest,worker,questLand,page,
stats,statsFunc,throwError,configOld,configDefault,hyper,stateOld,ignoreJSLintError,
gb,essence,gift,chores */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          Quest Worker
// All things quest related
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

	worker.add({name: 'questLand', recordIndex: 'link'});
	
	questLand.record = function(link) {
		this.data = {	
			link: link,
			name: '',
			review: 0, // Time of last review
			status: 'Opening'  // Opening, Opened, Complete
		};
	};
	
	questLand.init = function() {
		worker.addPageCheck({page : 'symbolquests', level : 8, type : 'quest', func : 'questLand.scan'});
		worker.addPageCheck({page : 'quests', type : 'quest', func : 'questLand.scan'});
		worker.addPageCheck({page : 'monster_quests', type : 'quest', func : 'questLand.scan'});
		questLand.records.flatten('link').forEach( function(l) {
			worker.addPageCheck({page: l, type : 'quest', func : 'questLand.scan'});
		});
	};
	
	questLand.scan = function() {
		return config.getItem('WhenQuest', 'Never') != 'Never';
	};
	
    questLand.checkResults = function(page) {
        try {
			var lR = {};
			
			// in results text The excavation quest timer has expired. Collect your reward now!
			//quests.php?excavation=10010&do_collect=10010&bqh=414986b7dd2bd6e69a24adc401aa2023&ajax=1
			
			switch (page) {
			case 'symbolquests' :
				lR = questLand.getRecord('symbolquests');
				lR.name = 'Demi Quests';
				lR.status = caap.hasImage('demi_quest_locked.jpg') ? 'Opening' : 
					$u.hasContent($j('tr:contains("INFLUENCE:")').not(':contains("INFLUENCE: 100%")')) ? 'Opened' : 'Complete';
				lR.review = Date.now();
				questLand.setRecord(lR);
				questLand.current = 'symbolquests';
				break;
			case 'quests' :
			case 'monster_quests' :
				$j('a[href*="' + page + '.php?land="]').each( function() {
					var link = $j(this).attr('href').replace(/.*\//, ''),
						num = link.regex(/(\d+)/),
						name = questLand[page].length > num ? questLand[page][num] : questLand[page][0] + num;
					
					questLand.setRecordVal(link, 'name', name);
					worker.addPageCheck({page : link, type : 'quest'});					
				});
				questLand.current = $j('div.title_tab_selected a[href*="' + page + '.php?land="]').attr('href').replace(/.*\//, '');
				break;
			}
		} catch (err) {
            con.error("ERROR in questLand.checkResults: " + err.stack);
            return false;
        }
    };

    questLand.quests = [
			'Land ', // Spacer to make index 1 based and prefix for unlisted lands
			'Land of Fire',
			'Land of Earth',
			'Land of Mist',
			'Land of Water',
			'Demon Realm',
			'Undead Realm',
			'Underworld',
			'Kingdom of Heaven',
			'Ivory City',
			'Earth II',
			'Water II',
			'Mist II',
			'Mist III',
			'Fire II',
			'Pangaea',
			'Perdition',
			'Land of Fire III',
			'Land of Earth III',
			'Land of Mist IV',
			'Land of Water III',
			'Undead II',
			'Outer Realms'
		];
		
	questLand.monster_quests = [
			'Atlantis ', // Spacer to make index 1 based and prefix for unlisted lands
			'Atlantis I',
			'Atlantis II',
			'Atlantis III'
		];
		
	questLand.dashboard = {
		name: 'Quest Lands',
		inst: 'Display your quest lands status and completion levels',
		records: 'questLand',
		buttons: ['clear'],
		tableEntries: [
			{name: 'Land', color: 'blue', format: 'text',
				valueF: function(r) {
					return '<a href="' + caap.domain.altered + '/' + r.link +
						'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.link +
						'\'); return false;" style="text-decoration:none;font-size:9px;color:blue;">' +
						r.name + '</a>';
			}},
			{name: 'Status'}
		]
	};
	
    /////////////////////////////////////////////////////////////////////
    //                          QUESTING
    // Worker function does action, Checkresults gathers info
    /////////////////////////////////////////////////////////////////////

	worker.add({name: 'quest', recordIndex: 'link'});

    quest.record = function (link) {
        this.data = {
			link : link,
            name : '',
			land : '',
			type: '',
			lastTry : 0,
            energy : 0,
			gold : 0,
			level : 0,
			influence : -1,
            general : '',
            experience : 0,
			cost: 0,
			buyLink : '',
			groupEne : 0,
			groupExp : 0
        };
    };

	quest.init = function() {
		quest.select();
	};
	
	quest.unpause = function() {
		quest.init();
	};
	
    quest.checkResults = function (page) {
        try {
        	page = page == 'earlyQuest' ? 'quests' : page;
			if (!['quests', 'monster_quests', 'symbolquests'].hasIndexOf(page)) {
				return;
			}
			
			// Reveal quests hidden by the map GUI
            if ($u.hasContent($j('#globalContainer #quest_map_container'))) {
                $j("#app_body div[id*='meta_quest_']").each(function () {
                    var row = $j(this);
                    if (!($u.hasContent($j("img[src*='_completed']", row)) || $u.hasContent($j("img[src*='_locked']", row)))) {
                        $j("#globalContainer div[id*='quest_wrapper_" + row.attr("id").replace("meta_quest_", '') + "']").show();
                    }
                });
            }

            var div = $j(),
				firstb,
                text,
				titleDiv = $j('div .title_tab_selected a'),
				land = page + (page == 'symbolquests' ? '' : '.php?land=' + ($u.hasContent(titleDiv) ? titleDiv.attr('href').regex(/land=(\d+)/) : '')),
				landStatus = 'Opening',
                qO = {},
                group = [],
				groupExpF = function() {
					var list = quest.records.filter( function(q) {
							return group.hasIndexOf(q.link);
						}),
						ene = list.flatten('energy').sum() / list.length,
						exp = list.flatten('experience').sum() / list.flatten('energy').sum();
						
					list.flatten('link').forEach( function(l) {
						quest.setRecordVal(l, 'groupExp', exp.dp(2));
						quest.setRecordVal(l, 'groupEne', ene.dp(2));
					});
					group = [];
				};
					
			if (!$u.hasContent(titleDiv) && page !== 'symbolquests') {
				return; // Locked land
			}

            $j("#globalContainer div[class^='quests_background']").each(function () {
                div = $j(this);

				var item_title = $j(".quest_desc,.quest_sub_title", div);

				if (!$u.hasContent(item_title)) {
					con.log(2, "Can't find quest description or sub-title");
					return true;
				}

				text = item_title.html().trim().innerTrim();
				if (/LOCK/.test(text) || /boss_locked/.test(text)) {
					con.log(2, "Quest locked", text);
					return true;
				}

				firstb = $j("b", item_title).eq(0);
				if (!$u.hasContent(firstb)) {
					con.warn("Can't get bolded member out of", text);
					return true;
				}

				qO = quest.getRecord(caap.linkMatch('quest=', div).replace(/&(bqh|ajax)=\w*/g, ''));
				qO.name = firstb.text().trim().innerTrim();
				qO.name = qO.name.hasIndexOf('<br>') ? qO.name.substring(0, qO.name.indexOf('<br>')) : qO.name;
				qO.land = land;

				text = div.text().trim().innerTrim();
				caap.bulkRegex(text, /\+(\d+) Exp .* \$([\d,]+)(?:mil)? ?- ?\$([\d,]+)(mil)? (\d+) Energy/,
					qO, ['experience', 'gold', 'maxGold', 'mil', 'energy'], 'silent');
				
				qO.gold = (qO.gold.numberOnly() * ($u.hasContent(qO.mil) ? 1000000 : 1) + 
					qO.maxGold.numberOnly() * ($u.hasContent(qO.mil) ? 1000000 : 1)) / 2;
				delete qO.mil;
				delete qO.maxGold;

				if (qO.land == 'monster_quests.php?land=1') { // Atlantis I
					qO.type = 'Primary';
					qO.influence = text.regexd(/INFLUENCE: (\d+)%/, 0);
				} else if (!caap.bulkRegex(text, /INFLUENCE: (\d+)%/, qO, ['influence'], 'silent')) {
					qO.type = 'Boss';
					qO.influence = $u.hasContent($j(".quests_background_sub")) ? 100 : 0;
				} else {
					qO.level = text.regexd(/LEVEL (\d) INFLUENCE: \d+%/, 1);
					qO.type = $u.hasContent($j('input[name="excavation"]', div)) ? 'Excavation' :
						div.attr('class') == 'quests_background_sub' ? 'Subquest' : 'Primary';
					// Calc for quest group average exp/energy return
				}
				
				if (qO.type == 'Subquest' || qO.land == 'monster_quests.php?land=1') {
					landStatus = qO.influence < 100 || landStatus == 'Opened' ? 'Opened' : 'Complete';
				}
				
				if (qO.type != 'Subquest') {
					groupExpF();
				}
				group.push(qO.link);
				qO.cost = text.regexd(/Buy ([\w ]*?) for \$([\d,]+)/g, [[0,0]]).map( function(arr) {
					return $u.isNumber(arr[0]) || !general.hasRecord(arr[0]) ? arr[1].numberOnly() : 0;
				}).sum();
				qO.buyLink = qO.cost === 0 ? '' : caap.scrapeLinks(div, 'silent').filter( function(l) {
					return l.hasIndexOf('action=buy_');
				}).pop();
				quest.setRecord(qO);
            });
			questLand.setRecordVal(land, 'status', landStatus);
			groupExpF();
			quest.select();
			
        } catch (err) {
            con.error("ERROR in checkResults_quests: " + err.stack);
            return false;
        }
    };

    quest.select = function () {
        try {
			var questFor = config.getItem('questFor', 'Never'),
				validQuests = [],
				opening = questLand.records.filterByField('status', 'Opening').some( function(l) {
					return quest.records.filterByField('land',l).some(function(q) {
						return q.influence < 100 && q.type != 'Excavation';
					});
				}),
				f = {
					'Burst Leveling' : function(a, b) {
						return (a.experience / a.energy) - (b.experience / b.energy);
					},
					'Lazy Leveling' : function(a, b) {
						return (b.experience / b.energy) - (a.experience / a.energy);
					},
					'Fast Leveling' : function(a, b) {
						return a.groupExp - b.groupExp;
					},
					'Slow Leveling' : function(a, b) {
						return b.groupExp - a.groupExp;
					},
					'Advancement' : function(a, b) {
						return f['Skill Points'](a, b);
					},
					'Skill Points' : function(a, b) {
						return b.groupEne - a.groupEne;
					},
					'Gold' : function(a, b) {
						return (a.gold / a.energy) - (b.gold / b.energy);
					}
				};
				
			if (questFor == 'Manual') {
				return;
			}
			
			validQuests = quest.records.filter( function(q) {
				return stats.gold.total >= q.cost && q.influence < 100 && q.type != 'Excavation' &&
					(questFor != 'Advancement' || !opening || questLand.getRecordVal(q.land, 'status') == 'Opening');
			});
				
			state.setItem('nextQuest', validQuests.length ? validQuests.sort(f[questFor]).pop() : false);
			
        } catch (err) {
            con.error("ERROR in quest.select: " + err.stack);
            return false;
        }
    };
   	
	worker.addAction({worker : 'quest', priority : 600, description : 'Questing'});
	
    quest.worker = function () {
        try {
			
            var whenQuest = config.getItem('WhenQuest', 'Never'),
                energyCheck,
                result,
                qO = state.getItem('nextQuest', false);

            if (whenQuest === 'Never') {
                return {action: false, mess: ''};
            }

			if (chores.checkPages('type', 'quest', 'new only')) {
				return {mlog: 'Reviewing quest lands'};
			}

            if (whenQuest === 'Not Fortifying' && state.getItem('targetFromfortify', false)) {
				return {action: false, mess: 'Waiting for Monster Fortify to finish'};
            }
			
			result = conquest.engineer();
			if (caap.passThrough(result)) {
				return result;
			}

            if (qO === false) {
				return config.getItem('questFor', 'Manual') === 'Manual' ? {mess: 'Pick quest on Quest Dashboard'} 
					: {mess: 'Unable to find quest'};
			}
			
			energyCheck = caap.checkEnergy('Quest', whenQuest, qO.energy);
			if (!energyCheck) {
				return false;
			}

			if (qO.cost > 0) {
				if (chores.getMoney(qO.cost)) {
					return {mlog : 'Withdrawing money'};
				}
				result = caap.navigate3(qO.land, qO.buyLink + '&bqh=' + caap.bqh, 'BuyGeneral');
				return result ? {mlog : 'Buying quest requirements'} : {mess : 'Unable to buy quest requirements'};
			}
			
			if (qO.land == questLand.current) {
				page.ajax(qO.link, 'QuestGeneral', 'bqh');
			} else {
				page.ajax(qO.land);
			}
			return {mlog : 'Doing quest ' + qO.name};

		} catch (err) {
            con.error("ERROR in quest.worker: " + err.stack);
            return false;
        }
    };

    /*------------------------------------------------------------------------------------\
    quest.checkEnergy gets passed the default energy requirement plus the condition text from
    quest.the 'Whenxxxxx' setting and the message div name. If energy is not defined, returns
	the total amount of energy available.
    \------------------------------------------------------------------------------------*/
    quest.checkEnergy = function (which, condition, energyRequired) {
        try {
            if (!stats.energy) {
                return false;
            }

            if (!which) {
				con.warn('Check Energy not passed an argument to specify quest or fortify');
                return false;
            }

            var whichEnergy,
                maxIdleEnergy = caap.maxStatCheck('energy'),
				energyMin,
				msgdiv = which.toLowerCase() + '_mess';
				
			energyRequired = $u.setContent(energyRequired, 0);
			
			if (condition == 'Never') {
				caap.setDivContent(msgdiv, which + ': Never');
				return 0;
			}

			if (caap.inLevelUpMode() && stats.energy.num >= energyRequired) {
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Burning all energy to ' + (caap.inLevelUpMode() ? 'level up' : ' get below max'));
				return stats.energy.num;
			}

            if (['Energy Available', 'Not Fortifying', 'Not Covering My Damage'].indexOf(condition) >=0) {
				energyMin = Math.max(0, stats.energy.num - (condition == 'Not Covering My Damage' ? Math.max( 20, stats.stamina.num * config.getItem('HealPercStam', 20) / 100) : 0));
                if (energyMin >= energyRequired) {
                    return energyMin;
                }
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
                }
				caap.setDivContent(msgdiv, which + ': Waiting for more energy: ' + stats.energy.num + "/" + energyRequired);
            } else if (condition === 'At X Energy') {

                whichEnergy = config.getItem('X' + which + 'Energy', 1);

                if (stats.energy.num >= whichEnergy) {
                    state.setItem('X' + which + 'Energy', true);
                }
                if (stats.energy.num >= energyRequired) {
                    if (state.getItem('X' + which + 'Energy', false) && stats.energy.num >= config.getItem('XMin' + which + 'Energy', 0)) {
						if (msgdiv === "quest_mess") {
							window.clearTimeout(caap.qtom);
						}
						caap.setDivContent(msgdiv, which + ': At X energy. Burning to ' + config.getItem('XMin' + which + 'Energy', 0));
                        return stats.energy.num - config.getItem('XMin' + which + 'Energy', 0);
                    }
                    state.setItem('X' + which + 'Energy', false);
                }
				whichEnergy = energyRequired > whichEnergy ? energyRequired : whichEnergy;
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Waiting for X energy: ' + stats.energy.num + "/" + whichEnergy);
            } else if (condition === 'At Max Energy') {
                if (stats.energy.num >= maxIdleEnergy) {
                    return stats.energy.num;
                }
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Waiting for max energy: ' + stats.energy.num + "/" + maxIdleEnergy);
            }
            return false;
        } catch (err) {
            con.error("ERROR in checkEnergy: " + err.stack);
            return false;
        }
    };

	quest.dashboard = {
		name: 'Quests',
		inst: 'Display your quest status and completion levels',
		records: 'quest',
		buttons: ['clear'],
		tableTemplate: {
			colorF: function(q) {
				return q.link === state.getItem('nextQuest', {}).link ? 'green' : q.influence == 100 ? 'grey' : 'black';
		}},
		headerF: function() {
			var r = state.getItem('nextQuest', false);
			return !r ? 'No quest' : 'Current Quest: ' + '<a href="' + caap.domain.altered + '/' + r.link +
					'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.link + '&ajax=1&bqh=' + caap.bqh +
					'\'); return false;" style="text-decoration:none;font-size:11px;color:blue;">' +
					$u.setContent(r.name, 'N/A') + '</a>' +
				' Land: <a href="' + caap.domain.altered + '/' + r.land +
					'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.land +
					'\'); return false;" style="text-decoration:none;font-size:11px;color:blue;">' +
					questLand.getRecordVal(r.land, 'name') + '</a>' +
				' Level: ' + r.level + ' Influence: ' + r.influence + ' Energy: ' + r.energy + ' Exp: ' + r.experience +
				' (' + (r.experience/r.energy).dp(2) + ')';
		},
		tableEntries: [
			{name: 'Quest', color: 'blue', format: 'text',
				valueF: function(r) {
					return '<a href="' + caap.domain.altered + '/' + r.link +
						'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.link + '&ajax=1&bqh=' + caap.bqh +
						'\'); return false;" style="text-decoration:none;font-size:9px;color:blue;">' +
						$u.setContent(r.name, 'N/A') + '</a>';
			}},
			{name: 'Land', color: 'blue', format: 'text',
				valueF: function(r) {
					return '<a href="' + caap.domain.altered + '/' + r.land +
						'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.land +
						'\'); return false;" style="text-decoration:none;font-size:9px;color:blue;">' +
						questLand.getRecordVal(r.land, 'name') + '</a>';
			}},
			{name: 'Type'},
			{name: 'Level'},
			{name: 'Influence'},
			{name: 'Energy'},
			{name: 'Exp', value: 'experience'},
			{name: 'Exp/Ene',
				valueF: function(r) {
					return (r.experience / r.energy).dp(2);
			}},
			{name: 'Grp Exp/Ene', value: 'groupExp'},
			{name: 'Grp Ene', value: 'groupEne'},
			{name: 'Gold/Ene',
				valueF: function(r) {
					return (r.gold / r.energy).dp();
			}},
			{name: '&nbsp;', format: 'unsortable',
				valueF: function(r) {
					return '<span title="Clicking this link will set ' + r.name +
					' as the manual quest" class="caap_quest_manual ui-icon ui-icon-play" rlink="' +
					r.link + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';"></span>';
			}}
		],
		handlers: [{
			hClass: 'quest_manual',
			handleF: function(e) {
				$j.makeArray(e.target.attributes).some( function(n) {
					if (n.nodeName === 'rlink') {
						state.setItem('nextQuest', quest.getRecord(n.value));
						caap.selectDropOption('questFor', 'Manual');
						quest.save('update');
						return true;
					}
				});
			}
		}]
	};
	
    quest.menu = function () {
        try {
            var XQuestInstructions = "Start questing when energy is at or above this value.",
                XMinQuestInstructions = "Stop quest when energy is at or below this value.",
                questWhenList = ['Energy Available', 'At Max Energy', 'At X Energy', 'Not Fortifying', 'Not Covering My Damage', 'Never'],
                questWhenInst = [
                    'Energy Available - will quest whenever you have enough energy.',
                    'At Max Energy - will quest when energy is at max and will burn down all energy when able to level up.',
                    'At X Energy - allows you to set maximum and minimum energy values to start and stop questing. Will burn down all energy when able to level up.',
                    'Not Fortifying - will quest only when your fortify settings are matched.',
                    'Not Covering My Damage - will keep enough to cover your current stamina, and quest with the rest.',
                    'Never - disables questing.'],
                questForList = ['Advancement', 'Skill Points', 'Fast Leveling', 'Slow Leveling', 'Burst Leveling', 'Lazy Leveling', 'Gold', 'Manual'],
                questForListInstructions = [
                    'Advancement performs all the incomplete main quests and boss quests and then quests by the lowest Skill Points',
                    'Skill Points performs the incomplete quests with the lowest energy cost available first to gain skill points',
                    'Fast Leveling performs the incomplete group of quests that yields the highest experience',
                    'Slow Leveling performs the incomplete group of quests that yields the lowest experience',
                    'Fast Leveling performs the incomplete quests that yields the highest experience. Not sustainable since eventually the ' + 
						'high experience quests will reach 100% influence until other lower experience quests are completed',
                    'Lazy Leveling performs the incomplete quests that yields the lowest experience. Not sustainable since eventually the ' + 
						'low experience quests will reach 100% influence until other higher experience quests are completed',
                    'Gold performs incomplete quests that provide the most gold',
                    'Manual performs the specific quest that you have chosen from the Quest Dashboard'],
                htmlCode = caap.startToggle('Quests', 'QUEST');

            htmlCode += caap.makeDropDownTR("Quest When", 'WhenQuest', questWhenList, questWhenInst, '', 'Never', false, false, 62);
            htmlCode += caap.display.start('WhenQuest', 'isnot', 'Never');
            htmlCode += caap.display.start('WhenQuest', 'is', 'At X Energy');
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XQuestEnergy', XQuestInstructions, 1, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinQuestEnergy', XMinQuestInstructions, 0, '', '', true, false);
            htmlCode += caap.display.end('WhenQuest', 'is', 'At X Energy');
            htmlCode += caap.makeDropDownTR("Quest For", 'questFor', questForList, questForListInstructions, '', '', false, false, 62);
            htmlCode += caap.display.end('WhenQuest', 'isnot', 'Never');
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in quest.menu: " + err.stack);
            return '';
        }
    };

}());
