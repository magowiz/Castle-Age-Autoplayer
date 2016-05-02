/*jslint white: true, browser: true, devel: true, 
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,stats,$j,battle,$u,worker,feed,caap,statsFunc,ignoreJSLintError,quest,
config,con,gm,schedule,state,general,session,conquest,monster:true */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          monster OBJECT
// this is the main object for dealing with Monsters
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

	worker.add({name: 'monster', recordIndex: 'link'});

	monster.record = function(link) {
        this.data = {
            link: link,
            name: '',
            userName: '',
            monster: '',
            attacked: -1,
            defended: 0,
            damage: -1,
            life: 100,
			lpage: '',
            fortify: -1,
            time: 168,
            t2k: 168,
            etf: 0, // Estimated time of fleeing
            phase: -1,
            miss: 0,
            rix: -1,
            over: '',
            color: '',
            review: -1,
            conditions: '',
            joinConditions: '',
			fullC: '',
			jFullC: '',
			join: false,
            charClass: '', // init value, false if class not found, otherwise class name with first letter in caps
			listStamina: '10',
			listEnergy: '',
			multiNode: false,
			score: 0, // Used to score monster finder targets to pick one to join
			siegeLevel: 0,
			spentEnergy: 0,
			spentStamina: 0,
			debtStamina: 0,
			debtStart: -1,
			canPub : false, // Can make monster public
			canPri : false, // Can make monster a guild priority
            strength: -1,
            stun: -1,
            stunTime: -1,
            stunDo: false,
			stunSetting: 0,
			stunTarget: 0,
            state: '',
            stunType: '',
			targetPart: 0, // 1 based index. Zero for invalid
			mainOnly: false,
			listReviewed: 0,
			lMissing: 0,
            save: true,
            select: false
        };
    };
	
    monster.checkResults = function (page, resultsText, ajax, slice) {
        try {
			var lastClick = $u.setContent(monster.lastClick, caap.clickUrl);

			monster.lastClick = '';
			slice = ajax ? $j(slice) : $j("#app_body");

			switch (page) {
			case 'raid':
				if (caap.clickUrl.hasIndexOf('casuser=')) {
					monster.checkResults_monster(page, resultsText, ajax, slice, lastClick);
					break;
				}
				monster.checkResults_list(page, resultsText, ajax, slice);									
				break;
			case 'player_monster_list':
			case 'public_monster_list':
			case 'guild_priority_mlist':	monster.checkResults_list(page, resultsText, ajax, slice, lastClick);					break;
			case 'battle_monster': 
			case 'guildv2_battle_monster': 
			case 'battle_expansion_monster': 
			case 'festival_battle_monster': monster.checkResults_monster(page, resultsText, ajax, slice, lastClick);	break;
			default :  break;
			}
			monster.spent = null;
			monster.amount = null;

		} catch (err) {
            con.error("ERROR in checkResults_onMonster: " + err.stack);
        }
    };
	
	/*jslint unparam: false */
    monster.checkResults_list = function (page, resultsText, ajax, slice, lastClick) {
	/*jslint unparam: true */
        try {
			ignoreJSLintError(resultsText, ajax);
				
			var pageURL = session.getItem('clickUrl', ''),
				mR = {},
				it = 0,
				now = Date.now(),
				link = lastClick,
				lpage = '', // page where monster list is
				publicList = ['public_monster_list', 'guild_priority_mlist'].hasIndexOf(page),
				tempDiv = $j(),
				isRaid = page == 'raid',
				w = {guild_priority_mlist : {
						rows : "div[style*='pri_listframe.jpg']",
						button : "img[src*='pri_btn_joinmonster.gif']",
						monster : 'span[style*="font-size:16px;"]',
						name :  'div[style*="height:30px;"]',
						link : "a[href*='battle_monster']",
						attr : 'href'},
					player_monster_list : {
						rows : "div[style*='monsterlist_container2.gif']",
						button : "img[src*='list_btn_']",
						monster : "div[style*='bold']",
						name :  "div[style*='20px']",
						link : "input[id^='share_link_']",
						attr : 'value'},
					public_monster_list : {
						button : "input[src*='list_btn_']",
						rows : "div[style*='pubmonster_middlef.gif']"},
					raid : {
						button : "img[src*='list_btn_']",
						rows : "div[style*='dragon_list_gray.jpg']",
						link : "a[href*='raid']",
						name :  "span",
						attr : 'href'}
					},
				which = $j.extend({}, w.player_monster_list, w[page]);
			
			//con.log(2, "Checking monster list page results", page, pageURL, monsterRow);
			if (publicList) {
				lpage = page;
			} else {
				if (page === 'guildv2_monster_list') {
					lpage = 'ajax:' + session.getItem('clickUrl', '').replace(/http.*\//,'');
				} else if (isRaid) {
					lpage = 'ajax:raid.php';
				} else if (page === 'player_monster_list') {
					if (pageURL.indexOf('monster_filter=2') >=0) {
						lpage = 'ajax:player_monster_list.php?monster_filter=2';
					} else if (pageURL.indexOf('monster_filter=3') >=0) {
						lpage = 'ajax:player_monster_list.php?monster_filter=3';
					} else {
						lpage = 'player_monster_list';
					}
				} else {
					con.log(2,'caap.checkResults_monsterList Unexpected page ' + page);
					return false;
				}
				monster.setrPage(lpage,'review',now);
			}
			
			// Review monsters and find attack and fortify button
			tempDiv = isRaid ? $j(which.rows, slice).parent() : $j(which.rows, slice);
			tempDiv.each( function() {
				link = $u.setContent($j(which.link, this).attr(which.attr), '').replace(/http.*\//,'');
				if (!$u.hasContent(link)) {
					con.log(2, "No URL found", link);
					return true;
				}
				mR = monster.getRecord(monster.cleanLink(link));
				mR.monster = isRaid ? $u.setContent(mR.monster, 'Deathrune Siege I') :
					$u.setContent(mR.monster, $j(which.monster, this).text().trim().replace(/,.*/,'').toLowerCase().ucWords());
				mR.monster = monster.getInfo(mR.monster, 'alias', mR.monster);
				mR.name = $u.setContent(mR.name, $j(which.name, this).text().trim() + ' ' + mR.monster).replace(' The Deathrune Siege', '');
				mR.lpage = lpage;
				mR.listReviewed = now;
				
				switch ($u.setContent($j(which.button, this).attr("src"), '').regex(/_btn_(\w*)/)) {
				case 2:				feed.checkDeath(mR);		mR.state = 'Collect';		 		break;
				case 3:				mR.state = 'Attack';											break;
				case 'atk':			mR.state = mR.state == 'Join' ? 'Join' : 'Attack';				break;
				case 'join':	
				case 'joinmonster':	mR.state = $u.setContent(mR.state, 'Join');						break;
				case 4:
				case 'view':
				case 'collect':		feed.checkDeath(mR);
									mR.state = mR.state == 'Attack' ? 'Dead or fled' : $u.setContent(mR.state, 'Dead or fled');
									break;
				default:			con.warn("Unknown engageButtonName state for " + mR.name);		break;
				}
				
				if (['Done', 'Collect', 'Dead or fled'].hasIndexOf(mR.state)) {
					mR.color = 'grey';
				}
				monster.checkReset(mR);

				if (publicList && !feed.joinable(mR)) {
					return true;
				}
				con.log(2, "Monster " + mR.name, link, mR.state, mR);
				monster.setRecord(mR);
			});

			for (it = monster.records.length - 1; it >= 0; it -= 1) {
				mR = monster.records[it];
				if (mR.lpage === lpage && !publicList && mR.state !== 'Join') {
					if (mR.listReviewed < now) {
						mR.lMissing += 1;
						con.warn('Did not see monster ' + mR.name + ' on monster list ' + mR.lMissing + ' times.', mR);
					} else {
						mR.lMissing = 0;
					}
					monster.setRecord(mR);
				}
			}
        } catch (err) {
            con.error("ERROR in monster.checkResults_list: " + err.stack);
        }
    };
	
    monster.checkResults_monster = function (page, resultsText, ajax, slice, lastClick) {
        try {
			var tempText = '',
				link = lastClick,
				visiblePageChangetf = !ajax && !feed.isScan,
				cM = {}, // current
				time = [],
				tempDiv = $j(),
				stunStart = 0,
				tempArr = [],
				monsterDiv = $j(),
				damageDiv = $j(),
				partsDiv = $j(),
				partsElem = $j(),
				armsList = [],
				tStr = '',
				partsHealth = [],
				arms = [],
				isRaid = page == 'raid',
				mains = [],
				minions = [],
				tNum = 0,
				style,
				defImage = '',
				id = 0,
				mpool = 0,
				deleteMon = false;
				
			if ($u.hasContent($j("#app_body div[style*='no_monster_back.jpg']"))) {
				if (monster.hasRecord(lastClick)) {
					monster.deleteRecord(lastClick);
					con.log(1, "Deleting monster that has expired",lastClick);
				}
				return false;
			}
			
			if (resultsText.match(/You already have a monster in the Guild Priority Monster List/)) {
				con.log(2, 'Monster: already have a priority monster, setting one hour wait to try again');
				schedule.setItem('monsterPriorityWait', 3600);
			}
			
			monsterDiv = $j(monster.onMonsterHeader, slice);

			if (visiblePageChangetf) {
				caap.chatLink(slice, "#chat_log div[style*='hidden'] div[style*='320px']");
			}
			
			tempText = monsterDiv.text().trim();
			//con.log(2, 'Header text', tempText);
			if (monsterDiv.text().regex(/Monster Codes?: \w+:\d+/i)) {
				id = parseInt(tempText.regex(/Monster Codes?: (\w+):\d+/), 36);
				mpool = tempText.regex(/Monster Codes?: \w+:(\d+)/);
				link = caap.page + '.php?casuser=' + id + '&mpool=' + mpool;
				//con.log(2, 'Header text2 ', id, mpool, link, tempText);
			} else {

				mpool = $j("input[name*='mpool']").eq(0).attr("value");
				mpool = $u.setContent(mpool, lastClick ? lastClick.regex(/mpool=(\d+)/) : '');
					
				id = $u.setContent($j("input[name*='casuser']").eq(0).attr("value"),
					$u.setContent($j("img[src*='profile.ak.fbcdn.net']", monsterDiv).attr("uid"), '').regex(/(\d+)/),
					$u.setContent($j(".fb_link[href*='profile.php']", monsterDiv).attr("href"), '').regex(/id=(\d+)/),
					$u.setContent($j("img[src*='graph.facebook.com']", monsterDiv).attr("src"), '').regex(/\/(\d+)\//));
				if ($j("input[name*='guild_creator_id']").length > 0) {
					id = $u.setContent(id, $j("input[name*='guild_creator_id']")[0].value + '_' + $j("input[name='slot']")[0].value + '_' + $j("input[name*='monster_slot']")[0].value);
				}
				tStr = $u.setContent($j("#app_body #chat_log button[onclick*='ajaxSectionUpdate']").attr("onclick"), '');
				id = $u.setContent(id,
					tStr.regex(/guild_id=(\d+)/) ?
						tStr.regex(/guild_id=(\d+)/) + '_' + tStr.regex(/&slot=(\d+)/) +	'_' + tStr.regex(/monster_slot=(\d+)/) : '',
					tStr.regex(/user=(\d+)/),
					$u.setContent($j("#app_body #monsterChatLogs img[src*='ldr_btn_chatoff.jpg']").attr("onclick"), '').regex(/user=(\d+)/));
			}
			
			id = $u.setContent(id, lastClick ? monster.getRecord(lastClick).id : 0);
			if (id === 0 || !$u.hasContent(id)) {
				con.warn("Unable to get id from monster page");
				slice = null;
				tempDiv = null;
				monsterDiv = null;
				damageDiv = null;
				return;
			}

			// With id, we look for the monster record
			link = monster.cleanLink(link, id, mpool);
			cM = monster.getRecord(link); // current monster record
			cM.rix = isRaid ? '&rix=' + $u.setContent(cM.link.regex(/rix=(\d+)/), 2) : '';
			if (resultsText.match(/\d/) && $u.hasContent(monster.spent)) {
				cM[monster.spent] += monster.amount;
			}

			// Get the user name
			if (id == stats.FBID) {
				cM.userName = 'Your';
				cM.name = 'Your ' + $u.setContent(cM.monster, 'Unknown Monster');
			} else {
				if ($u.hasContent(monsterDiv)) {
					cM.userName = monsterDiv.text().trim().innerTrim().regex(isRaid ? /(.+)'s The Deathrune/i : /(?:Monster Codes?: \w+:\d+ )?(.+?)(?:'s)? summoned/i);
					if (!cM.userName) {
						con.warn('Unable to find summoner name in monster div', monsterDiv.text(), monsterDiv);
					}
				} else {
					con.warn('Unable to find monster div to determine summoner name');
				}
			}
			
			// Find health bar, label it, and use it to find monster name
			monsterDiv = $j("img[src*='monster_health_background.jpg'],img[src*='nm_red.jpg']", slice).parent();
			if ($u.hasContent(monsterDiv)) {
				cM.life = monsterDiv.getPercent('width').dp(2);
				tempDiv = monsterDiv.siblings().eq(0).children().eq(0);
				if (!$u.hasContent(tempDiv)) {
					tempDiv = monsterDiv.parent().parent().siblings().eq(0);
					if ($u.hasContent(tempDiv.children())) {
						tempDiv = tempDiv.children().eq(0);
					}
				}
			} else {
				tempDiv = $j("div[style*='monster_health_back.jpg']", slice);
			}
			tempText = tempDiv.text().trim().innerTrim();
			if (tempText.toLowerCase().hasIndexOf('life') || tempText.toLowerCase().hasIndexOf('soldiers')) {
				cM.monster = tempText.regex(/(?:^The )?([^']+)'s \w+/i).replace(/,.*/,'').toLowerCase().ucWords();
				cM.monster = monster.getInfo(cM.monster, 'alias', cM.monster);
				if (visiblePageChangetf && config.getItem("monsterEnableLabels", true)) {
					tempDiv.text(tempText + " (" + cM.life + "%)");
				}
			} else {
				con.warn('Unable to find monster name', tempText, $j("img[src*='monster_health_background.jpg'],img[src*='nm_red.jpg']", slice).parent(), $j("div[style*='monster_health_back.jpg']", slice));
			}
			cM.name = (cM.userName == 'Your' ? 'Your ' : $u.setContent(cM.userName, 'Someone') + "'s ") + $u.setContent(cM.monster, 'Unknown Monster');
			
			cM.review = Date.now();
			// Extract info
			
			// #monsterticker is the most reliable indicator of a living monster
			tempDiv = $j("#monsterTicker", slice);
			if ($u.hasContent(tempDiv)) {
				time = $u.setContent(tempDiv.text(), '').regex(/(\d+):(\d+):(\d+)/);
			} else if (!caap.hasImage("dead.jpg")) {
				con.warn("Could not locate Monster ticker.");
			}

			// Check for fortify stuff
			style = monster.getInfo(cM.monster, 'style');
			if (style != 'stamina') {
				defImage = monster.getInfo(cM.monster, 'defense_img');
				switch (defImage) {
					case 'bar_dispel.gif':
						tempDiv = $j("img[src*='" + defImage + "']", slice).parent();
						if ($u.hasContent(tempDiv)) {
							cM.fortify = (100 - tempDiv.getPercent('width')).dp(2);
							tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
						} else {
							cM.fortify = 100;
							con.warn("Unable to find defence bar", defImage);
						}

						break;
					case 'seamonster_ship_health.jpg':
						tempDiv = $j("img[src*='" + defImage + "']", slice).parent();
						if ($u.hasContent(tempDiv)) {
							cM.fortify = tempDiv.getPercent('width').dp(2);
							defImage = monster.getInfo(cM.monster, 'repair_img');
							if (defImage) {
								tempDiv = $j("img[src*='" + defImage + "']", slice).parent();
								if ($u.hasContent(tempDiv)) {
									cM.fortify = (cM.fortify * (100 / (100 - tempDiv.getPercent('width')))).dp(2);
									tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
								} else {
									cM.fortify = 100;
									con.warn("Unable to find repair bar", defImage);
								}
							}
						} else {
							con.warn("Unable to find defense bar", defImage);
						}
						tempDiv = $j("img[src*='repair_bar_grey.jpg']", slice).parent();
						if ($u.hasContent(tempDiv)) {
							cM.strength = 100 - tempDiv.getPercent('width').dp(2);
						}

						break;
					case 'repair_bar_grey.jpg':
						tempDiv = $j("img[src*='" + defImage + "']", slice).parent();
						if ($u.hasContent(tempDiv)) {
							cM.fortify = tempDiv.getPercent('width').dp(2);
							tempDiv = tempDiv.parent();
							if ($u.hasContent(tempDiv)) {
								cM.strength = tempDiv.getPercent('width').dp(2);
								tempDiv = tempDiv.parent().siblings().eq(0).children().eq(0);
							} else {
								cM.strength = 100;
								con.warn("Unable to find defense bar strength");
							}
						} else {
							con.warn("Unable to find defense bar fortify");
						}

						break;
					case 'nm_green.jpg':
						tempDiv = $j("img[src*='" + defImage + "']", slice).parent();
						if ($u.hasContent(tempDiv)) {
							cM.fortify = tempDiv.getPercent('width').dp(2);
							tempDiv = tempDiv.parent();
							if ($u.hasContent(tempDiv)) {
								cM.strength = tempDiv.getPercent('width').dp(2);
								tempDiv = tempDiv.parent().siblings().eq(0).children().eq(0);
							} else {
								cM.strength = 100;
								con.warn("Unable to find defense bar strength");
							}
						} else {
							con.warn("Unable to find defense bar fortify");
						}

						break;
					default:
						con.warn("No match for defense_img", defImage);
				}

				// See if healing debt is paid
				if (config.getItem('HealPercStam', 20) > 0 && cM.debtStart > 0 && (cM.debtStamina <= 0 ||  cM.fortify > cM.debtStart)) {
					cM.debtStart = -1;
					cM.debtStamina = 0;
					session.setItem('ReleaseControl', false);
				}
			}
			

			if (visiblePageChangetf && $u.hasContent(tempDiv) && config.getItem("monsterEnableLabels", true)) {
				tempText = tempDiv.text().trim();
				if (!$u.hasContent(tempDiv.children()) && (tempText.toLowerCase().hasIndexOf('health') || tempText.toLowerCase().hasIndexOf('defense') || tempText.toLowerCase().hasIndexOf('armor'))) {
					tempDiv.text(tempText + " (" + (defImage === 'bar_dispel.gif' ? (100 - cM.fortify).dp(2) : cM.fortify) + "%" +
						(defImage === 'nm_green.jpg' ? '/' + cM.strength + '%' : '') + ")");
				}
			}

			// Get damage done to monster
			damageDiv = $j("#action_logs td[class='dragonContainer']:first tr", slice);
			if ($u.hasContent(damageDiv)) {
				damageDiv = $j(damageDiv).find("a[href$='keep.php?casuser=" + stats.FBID + "']").last().closest('tr');
				if ($u.hasContent(damageDiv)) { // Make sure player has done damage.
					tempText = damageDiv.text().trim().innerTrim();
					tempArr = tempText.regex(/([\d,]+) dmg \/ ([\d,]+) def/);
					if ($u.isArray(tempArr) && tempArr.length > 1) {
						cM.defended =  $u.setContent(tempArr.pop(), '0').numberOnly();
					} else {
						tempArr = tempText.regex(/([\d,]+)/g);
					}
					if ($u.isArray(tempArr) && tempArr.length) {
						cM.attacked = $u.setContent(tempArr.pop(), '0').numberOnly();
						// Even if did 0 damage (joined a monster with zero health or not enough stamina), set to 1 point of damage
						cM.damage = Math.max(1, cM.attacked + cM.defended);
					} else {
						con.warn("Unable to get attacked and defended damage from #dragonContainer");
					}

					if (visiblePageChangetf) {
						damageDiv.parents("tr").eq(0).css('background-color', (gm ? gm.getItem("HighlightColor", '#C6A56F') : '#C6A56F'));
					}
					//cM.hide = true;
				} else {
					cM.damage = 0;
				}
			} else {
				damageDiv = $j("div[id*='leaderboard_0']");
				if ($u.hasContent(damageDiv)) {
					damageDiv = $j("a[href*='user=" + stats.FBID + "']", damageDiv[0].children);
					if ($u.hasContent(damageDiv)) {
						tempArr = $u.setContent(damageDiv.parent().parent()[0].children[4].innerHTML).trim().innerTrim().match(/([\d,]+)/g);
						if ($u.hasContent(tempArr) && tempArr.length > 0) {
							cM.attacked = tempArr[0].numberOnly();
							// Even if did 0 damage (joined a monster with zero health or not enough stamina), set to 1 point of damage
							cM.damage = Math.max(1, cM.attacked);
							if (tempArr.length === 2) {
								cM.defended = tempArr[1].numberOnly();
								cM.damage = cM.attacked + cM.defended;
							}
						} else {
							con.warn("Unable to get attacked and defended damage from Leaderboard", tempArr, (damageDiv.parent().parent()[0].children[4].innerHTML).trim().innerTrim());
						}
						if (visiblePageChangetf) {
							damageDiv.parent().parent().eq(0).css('background-color', (gm ? gm.getItem("HighlightColor", '#C6A56F') : '#C6A56F'));
						}
					} else {
						cM.damage = 0;
					}
				} else {
					con.log(2, "Unable to find a damage table");
				}
			}
			
			// Is it alive?
			if ($u.hasContent(time)) {
				if ((time[0] + (time[1] + 1) / 60).dp(2) > cM.time) {
					monster.checkReset(cM, 'force');
				}
				cM.time = (time[0] + (time[1] + 1) / 60).dp(2);

				// new siege style
				tempDiv = $j("#objective_list_section div[style*='mobjective_container']", slice);
				if ($u.hasContent(tempDiv)) {
					cM.phase = tempDiv.length;
				} else { // old style
					tempDiv = $j("div[style*='monster_layout_2.jpg'] div[style*='alpha']", slice);
					if (tempDiv.length) {
						cM.phase = tempDiv.length + 1;
					}
				}
				if (cM.phase > 0) {
					cM.miss = $u.setContent($u.setContent($j("div[style*='monster_layout'],div[style*='nm_bottom'],div[style*='raid_back'],div[style*='stance_plate_bottom.jpg']", slice).text(), '').trim().innerTrim().regex(/Need (\d+) more/i), 0);
				}
				
				if (style == 'class') {
					monsterDiv = $j("div[style*='nm_bottom'],div[style*='stance_plate_bottom']", slice);
					if ($u.hasContent(monsterDiv)) {
						tempText = $u.setContent(monsterDiv.children().eq(0).children().text(), '').trim().innerTrim();
						if (tempText) {
							con.log(4, "Character class text", tempText);
							tStr = tempText.regex(/Class: (\S+) /);
							if ($u.hasContent(tStr)) {
								cM.charClass = tStr;
								con.log(4, "character", cM.charClass);
							} else if (tempText.hasIndexOf('TARGET NUMBER')) {
								cM.charClass = false;
							} else {
								con.warn("Can't get character", tempText);
							}
						} else {
							con.warn("Missing tempText");
						}
					} else {
						con.warn("Missing nm_bottom to find class");
						cM.charClass = false;
					}
				} else {
					cM.charClass = false;
				}

				// if the monster has parts, hit the weakest minion first, and then hit the part with the least health next
				partsDiv = $j("#app_body div[id^='monster_target_']");
				if ($u.hasContent(partsDiv)) {
					cM.mainOnly = true;
					partsHealth = [];
					//con.log(2, "The monster has " + partsDiv.length + " parts");

					// Click first order parts which have health
					partsDiv.each( function(index) {
						partsElem = $j(this).find('div[style*="multi_smallhealth.jpg"]');
						if ($u.hasContent(partsElem)) {
							//partsElem2 = partsElem.children[1].children[0];
							tNum = $u.setContent($j(partsElem).getPercent("width"), 0);
							tempDiv =  $j("#app_body span[id^='target_monster_info_" + (index + 1) + "']");
							//con.log(2, 'desciptor text: ' + tempDiv.text());
							if ($u.hasContent(tempDiv)) {
								partsHealth.push(tNum);
								if (tempDiv.text().regex(/reduce/)) {
									if (tNum < 75) {
										cM.mainOnly = false;
									}
									arms.push(tNum);
									armsList.push((index + 1).toString());
								} else if (tempDiv.text().regex(/hinder/)) {
									minions.push(tNum);
								} else {
									mains.push(tNum);
								}
							} else {
								con.warn('No info for body part ' + (index + 1) + ", assuming it's a minion", $j(this));
								minions.push(tNum);
							}
						} else {
							con.warn('No children of body part for health width');
						}
					});
					//con.log(2, 'parts list', minions, arms, mains);
					
					// Vargulis or Samael three main, no arm type
					if (mains.length == 3 && arms.length == 0) {
						// if current target is within 5% health of healthiest part, keep attacking, otherwise 
						// switch to healthiest part    80 60 77
						cM.targetPart = cM.targetPart == 0 ? 1 : cM.targetPart;
						cM.targetPart = (mains[cM.targetPart - 1] >= caap.minMaxArray(mains, 'max', 0, 101) - 5 
							&& mains[cM.targetPart - 1] > 0) ? cM.targetPart 
							: mains.lastIndexOf(caap.minMaxArray(mains, 'max', 0, 101)) + 1;
					} else {
						cM.targetPart = partsHealth.lastIndexOf(minions.length ? caap.minMaxArray(minions, 'min', 0)
							: Math.min((arms.length ? caap.minMaxArray(arms, 'min', 0) : 100), caap.minMaxArray(mains, 'min', 0))) + 1;
					}
						
					cM.mainOnly = armsList.hasIndexOf(cM.targetPart) ? false : cM.mainOnly;
					// Define if use user or default order parts
					if (/:po/i.test(cM.conditions)) {
						tempArr = cM.conditions.substring(cM.conditions.indexOf('[') + 1, cM.conditions.lastIndexOf(']')).split(".");
						tempArr.some( function(part) {
							if ($u.setContent(partsHealth[part - 1], 0) > 0 && (!cM.mainOnly || !armsList.hasIndexOf(part))) {
								cM.targetPart = part;
								return true;
							}
						});
					} 
					
					// If one of the mains is more damaged that most damaged hinderer and arms > 80% health, assume headless
					if (arms.length && caap.minMaxArray(mains, 'min', 0) < caap.minMaxArray(arms, 'min', 0) &&
						caap.minMaxArray(arms, 'min', 0) > 80) {
						cM.life = (mains.reduce(function(a, b) { return a + b; }, 0) / mains.length).dp(2);
					} else {
						cM.life = ((mains.reduce(function(a, b) { return a + b; }, 0) + arms.reduce(function(a, b) { return a + b; }, 0) / 5)	/ (mains.length + arms.length / 5)).dp(2);
					}
				}
				cM.t2k = ((cM.life * monster.getInfo(cM, 'duration', cM.page === 'festival_battle_monster' ? 192 : 168) - cM.time) /
					(100 - cM.life)).dp(2);
					
				// Check public and priority monster.parseCondition("s", cM.conditions)
				cM.canPri = !cM.link.hasIndexOf(stats.FBID) ? false : $u.hasContent(caap.checkForImage('pri_btn_priority.gif'));
				cM.canPub = !cM.link.hasIndexOf(stats.FBID) ? false : $u.hasContent(caap.checkForImage('pri_btn_public.gif'));

				// If it's alive and I've hit it, then check character class stuff and sieges
				if (monster.damaged(cM)) {
					if (cM.state == 'Join') {
						con.log(1, 'Joined a feed monster with ' + cM.damage, cM);
					}

					cM.state = 'Attack';
					monster.checkReset(cM);
					cM.etf = Date.now() + cM.time * 3600 * 1000;
					
					if (style == 'class') {
						// Character type stuff
						if (cM.charClass) {

							tStr = tempText.regex(/Tip: ([\w ]+) Status/);
							if (!tStr) {
								cM.stunType = 'fortify';
								con.warn("Can't get tip", tempText);
							} else {
								cM.stunType = tStr.split(" ").pop().toLowerCase().replace('ion', '');
								//con.log(2, 'Stun type: ' + cM.stunType);
							}
							
							if (!["strengthen", "cripple", "heal", "deflect", "fortify"].hasIndexOf(cM.stunType)) {
								con.warn("Unknown monster stun attack", cM.stunType);
							}

							tempArr = tempText.regex(/Status Time Remaining: (\d+):(\d+):(\d+)\s*/);
							if ($u.hasContent(tempArr) && tempArr.length === 3) {
								cM.stunTime = Date.now() + (tempArr[0] * 60 * 60 * 1000) + (tempArr[1] * 60 * 1000) + (tempArr[2] * 1000);
								
							} else {
								cM.stunTime = Date.now() + cM.time * 60 * 60 * 1000;
								con.warn("Can't get statusTime", tempText);
							}

							tempDiv = $j("img[src*='nm_stun_bar']", monsterDiv);
							if ($u.hasContent(tempDiv)) {
								tempText = tempDiv.getPercent('width').dp(2);
								con.log(4, "Stun bar percent text", tempText);
								if (tempText >= 0) {
									cM.stun = tempText;
									con.log(4, "stun", cM.stun);

									// If we haven't set a target time for stunning yet, or the target time was for the phase before this one,
									// or the WhenStun setting has changed, set a new stun target time.
									tNum = monster.parseCondition("cd", cM.conditions);
									tNum = $u.isNumber(tNum) ? tNum.toString() : config.getItem('WhenStun','Immediately');
									tNum = tNum == 'Immediately' ? 6 : tNum == 'Never' ? 0 : tNum.parseFloat();
									stunStart = cM.stunTime - 6 * 60 * 60 * 1000;
									con.log(5,'Checking stuntarget',tNum, $u.makeTime(stunStart, caap.timeStr(true)),$u.makeTime(cM.stunTime, caap.timeStr(true)));
									
									if (!cM.stunTarget || cM.stunTarget < stunStart || cM.stunSetting !== tNum) {
										cM.stunSetting = tNum;

										// Add +/- 30 min so multiple CAAPs don't all stun at the same time
										cM.stunTarget = cM.stunSetting == 6 ? stunStart : cM.stunSetting === 0 ? cM.stunTime
												: cM.stunTime - (tNum - 0.5 + Math.random()) * 60 * 60 * 1000;
										con.log(5,'New stun target', $u.makeTime(cM.stunTarget, caap.timeStr(true)));
									}

									cM.stunDo = cM.charClass === '?' ? '' : new RegExp(cM.charClass).test(tStr) && cM.stun < 100;
									if (cM.stunDo) {
										con.log(2,"Cripple/Deflect after " + $u.makeTime(cM.stunTarget, caap.timeStr(true)), cM.stunTime, cM.stunTarget, tNum, cM.stunSetting, stunStart, Date.now() > cM.stunTarget);
									}
									cM.stunDo = cM.stunDo && Date.now() > cM.stunTarget;

								} else {
									con.warn("Can't get stun bar width");
								}
							} else if (["strengthen", "heal", "fortify"].hasIndexOf(cM.stunType)) {
								cM.stun = cM.stunType == "strengthen" ? cM.strength : cM.health;
							}	else {
								con.warn('No bar and stun type is not strengthen, heal, or fortify');
							}

						}
					}

					// Find the lowest and highest stamina/energy buttons
					if (isRaid) {
						cM.listStamina = [1, 5];
					} else {
						tempDiv = $j("div[style*='button_cost_stamina_']", slice);
						cM.siegeLevel = tempDiv.length ? tempDiv.attr('style').match(/button_cost_stamina_(\d+)/)[1] : 0;
						
						tempDiv = $j("img[src*='button_cost_stamina_']", slice);
						if ($u.hasContent(tempDiv)) {
							cM.listStamina = [];
							cM.listEnergy = [];
							cM.multiNode = true;
							tempDiv.each( function() {
								tNum = $j(this).attr('src').regex(/button_cost_stamina_(\d+)/);
								if (cM.listStamina.indexOf(tNum) == -1) {
									cM.listStamina.push(tNum);
								}
							});
							tempDiv = $j("img[src*='button_cost_energy_']", slice);
							if ($u.hasContent(tempDiv)) {
								tempDiv.each( function() {
									tNum = $j(this).attr('src').regex(/button_cost_energy_(\d+)/);
									if (cM.listEnergy.indexOf(tNum) == -1) {
										cM.listEnergy.push(tNum);
									}
								});
							}
							cM.listStamina = cM.listStamina.join(',');
							cM.listEnergy = cM.listEnergy.join(',');
						} else {
							if (!cM.listStamina.length) {
								con.log(2, 'Unable to find stamina/energy attack buttons, so using default configuration');
							}
							cM.listStamina = monster.getInfo(cM, 'listStamina');
							cM.listEnergy = cM.fortify >= 0 ? monster.getInfo(cM, 'listEnergy') : '';
						}
					}

						
				// It's alive and I haven't hit it
				} else {
					if (!cM.charClass || caap.hasImage('battle_enter_battle.gif', slice)) {
						cM.state = 'Join';
						if (!feed.joinable(cM)) {
							con.log(2, "Ignoring " + cM.name + " as per Finder settings", cM);
							deleteMon = true;
						}
					} else if (cM.spentStamina > 0 && cM.etf > 0 && Date.now() < cM.etf) {
						con.error('Unable to find monster damage, and yet I spent stamina on this monster.'
							+ ' Leaving update for next visit to see if damage appears');
					} else { // I haven't hit it, but I can't join it, so delete
						con.log(2, "Deleting unjoinable monster " + cM.name + " off Feed", cM);
						deleteMon = true;
					}
				}
			// It's dead
			} else {
				// And I haven't hit it and it's not conquest
				if (!monster.damaged(cM) && !monster.isConq(cM) && !cM.link.hasIndexOf('=' + stats.FBID)) {
					//and it's dead and not a conquest monster, so delete
					if (monster.hasRecord(cM.link)) {
						monster.deleteRecord(cM.link);
						con.log(2, "Deleting dead monster " + cM.name + " off Feed", cM);
						deleteMon = true;
					}
				} else {
					feed.checkDeath(cM);
					cM.state = (caap.hasImage('collect_reward', slice) || caap.hasImage('collectreward', slice)) ? 'Collect' : 'Done';
					cM.color = 'grey';
				}
			}
			
			// Set staminaSpent to a minimum value to make Hunter collect algorithms work
			cM.spentStamina = cM.spentStamina > 0 || !monster.damaged(cM) ? cM.spentStamina : cM.listStamina.split(',').shift() * 
				general.getRecordVal(general.current, 'special').regexd(/(\d)x power attacks/i, 1);
			
			if (deleteMon) {
				monster.deleteRecord(cM.link);
			} else {
				monster.setRecord(cM);
			}
			monster.select(true);
			if (schedule.check('battleTimer')) {
				window.setTimeout(function () {
					caap.setDivContent('monster_mess', '');
				}, 2000);
			}
			con.log(2, "On Monster info: " + cM.name, link, cM, stats.reviewPages);

			slice = null;
			tempDiv = null;
			partsDiv = null;
			monsterDiv = null;
			damageDiv = null;
			
        } catch (err) {
            con.error("ERROR in checkResults_onMonster: " + err.stack);
        }
    };

	monster.isConq = function(cM) {
		return cM.link.hasIndexOf("guildv2_battle_monster.php");
	};
	
	monster.checkReset = function(mR, force) {
		if (force || (mR.state == 'Attack' && (mR.color == 'grey' || (mR.etf > 0 && Date.now() > mR.etf)))) {
			mR.color = mR.color == 'grey' ? 'black' : mR.color;
			mR.staminaSpent = 0;
			mR.energySpent = 0;
			mR.charClass = '';
		}
	};
	
    caap.inLevelUpMode = function () {
        try {
            if (!config.getItem('EnableLevelUpMode', true)) {
                //if levelup mode is false then new level up mode is also false (kob)
                state.setItem("newLevelUpMode", false);
                return false;
            }

            if (!stats.indicators.enl) {
                //if levelup mode is false then new level up mode is also false (kob)
                state.setItem("newLevelUpMode", false);
                return false;
            }

            // minutesBeforeLevelToUseUpStaEnergy : 5, = 30000
            if (((stats.indicators.enl - Date.now()) < 30000) || (stats.exp.dif <= config.getItem('LevelUpGeneralExp', 20))) {
                //detect if we are entering level up mode for the very first time (kob)
                if (!state.getItem("newLevelUpMode", false)) {
                    //set the current level up mode flag so that we don't call refresh monster routine more than once (kob)
                    state.setItem("newLevelUpMode", true);
                }

                return true;
            }

            //if levelup mode is false then new level up mode is also false (kob)
            state.setItem("newLevelUpMode", false);
            return false;
        } catch (err) {
            con.error("ERROR in inLevelUpMode: " + err.stack);
            return false;
        }
    };

	// Check health ok and return amount of stamina available.
    caap.checkStamina = function (battleOrMonster, attackMinStamina) {
        try {
            con.log(4, "checkStamina", battleOrMonster, attackMinStamina);
            attackMinStamina = $u.setContent(attackMinStamina, 0);

            var when = config.getItem('When' + battleOrMonster, 'Never'),
                maxIdleStamina = 0,
                staminaMF = '',
                messDiv = (battleOrMonster == 'battleOverride' ? 'battle' : battleOrMonster.toLowerCase()) + "_mess";

            if (when === 'Never') {
                return false;
            }

            if (!stats.stamina || !stats.health) {
                caap.setDivContent(messDiv, 'Health or stamina not known yet.');
                return false;
            }

            if (stats.health.num < 10) {
                caap.setDivContent(messDiv, "Need health to fight: " + stats.health.num + "/10");
                return false;
            }

            if (((battleOrMonster === "Battle" && config.getItem("waitSafeHealth", false)) || (battleOrMonster === "Conquest" && config.getItem("conquestWaitSafeHealth", false))) && stats.health.num < 13) {
                if (battleOrMonster === "Conquest") {
                    schedule.setItem("conquest_delay_stats", (13 - stats.health.num) *  180, 120);
                }

                caap.setDivContent(messDiv, "Unsafe. Need health to fight: " + stats.health.num + "/13");
                return false;
            }

            if (when === 'At X Stamina') {
                if (caap.inLevelUpMode() && stats.stamina.num >= attackMinStamina) {
                    caap.setDivContent(messDiv, 'Burning stamina to ' + (caap.inLevelUpMode() ? 'level up' : ' get below max'));
                    return stats.stamina.num;
                }

                staminaMF = battleOrMonster + 'Stamina';
                if (state.getItem('BurnMode_' + staminaMF, false) || stats.stamina.num >= config.getItem('X' + staminaMF, 1)) {
                    if (stats.stamina.num < attackMinStamina || stats.stamina.num <= config.getItem('XMin' + staminaMF, 0)) {
                        state.setItem('BurnMode_' + staminaMF, false);
                        return false;
                    }

                    state.setItem('BurnMode_' + staminaMF, true);
                    return stats.stamina.num - config.getItem('XMin' + staminaMF, 0);
                }

                state.setItem('BurnMode_' + staminaMF, false);

                caap.setDivContent(messDiv, 'Waiting for stamina: ' + stats.stamina.num + "/" + config.getItem('X' + staminaMF, 1));
                return false;
            }

            if (when === 'At Max Stamina') {
                maxIdleStamina = caap.maxStatCheck('stamina');

                if (stats.stamina.num >= maxIdleStamina) {
                    caap.setDivContent(messDiv, 'Using max stamina');
                    return stats.stamina.num; 
                }

                if (caap.inLevelUpMode()) {
					if (stats.stamina.num >= attackMinStamina) {
						caap.setDivContent(messDiv, 'Burning all stamina to ' + (caap.inLevelUpMode() ? 'level up' : ' get below max'));
						return stats.stamina.num;
					}
					caap.setDivContent(messDiv, 'Waiting for stamina: ' + stats.stamina.num + "/" + attackMinStamina);
					return false;
                }

                caap.setDivContent(messDiv, 'Waiting for max stamina: ' + stats.stamina.num + "/" + maxIdleStamina);
                return false;
            }

            if (stats.stamina.num >= attackMinStamina) {
                return stats.stamina.num;
            }

            caap.setDivContent(messDiv, "Waiting for more stamina: " + stats.stamina.num + "/" + attackMinStamina);
            return false;
        } catch (err) {
            con.error("ERROR in checkStamina: " + err.stack);
            return false;
        }
    };

    /*-------------------------------------------------------------------------------------\
    needToHide will return true if the current stamina and health indicate we need to bring
    our health down through battles (hiding).  It also returns true if there is no other outlet
    for our stamina (currently this just means Monsters, but will eventually incorporate
    other stamina uses).
    \-------------------------------------------------------------------------------------*/
    caap.needToHide = function () {
        try {
            if (config.getItem('WhenMonster', 'Never') === 'Never') {
                con.log(1, 'Stay Hidden Mode: Monster battle not enabled');
                return true;
            }

            if (!state.getItem('targetFromMonster', '')) {
                con.log(1, 'Stay Hidden Mode: No monster to battle');
                return true;
            }

            if (config.getItem('delayStayHidden', true) === false) {
                con.log(2, 'Stay Hidden Mode: Delay hide if "safe" not enabled');
                return true;
            }

            /*-------------------------------------------------------------------------------------\
             The riskConstant helps us determine how much we stay in hiding and how much we are willing
             to risk coming out of hiding.  The lower the riskConstant, the more we spend stamina to
             stay in hiding. The higher the risk constant, the more we attempt to use our stamina for
             non-hiding activities.  The below matrix shows the default riskConstant of 1.7

             S   T   A   M   I   N   A
             1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
             H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
             E   11  -   -   +   +   +   +   +   +   +
             A   12  -   -   +   +   +   +   +   +   +
             L   13  -   -   +   +   +   +   +   +   +
             T   14  -   -   -   +   +   +   +   +   +
             H   15  -   -   -   +   +   +   +   +   +
             16  -   -   -   -   +   +   +   +   +
             17  -   -   -   -   -   +   +   +   +
             18  -   -   -   -   -   +   +   +   +

             Setting our riskConstant down to 1 will result in us spending out stamina to hide much
             more often:

             S   T   A   M   I   N   A
             1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
             H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
             E   11  -   -   +   +   +   +   +   +   +
             A   12  -   -   -   +   +   +   +   +   +
             L   13  -   -   -   -   +   +   +   +   +
             T   14  -   -   -   -   -   +   +   +   +
             H   15  -   -   -   -   -   -   +   +   +
             16  -   -   -   -   -   -   -   +   +
             17  -   -   -   -   -   -   -   -   +
             18  -   -   -   -   -   -   -   -   -

            \-------------------------------------------------------------------------------------*/

            var riskConstant = gm ? gm.getItem('HidingRiskConstant', 1.7) : 1.7;

            /*-------------------------------------------------------------------------------------\
            The formula for determining if we should hide goes something like this:

            If  (health - (estimated dmg from next attacks) puts us below 10)  AND
            (current stamina will be at least 5 using staminatime/healthtime ratio)
            Then stamina can be used/saved for normal process
            Else stamina is used for us to hide

            \-------------------------------------------------------------------------------------*/
            //if ((stats.health.num - ((stats.stamina.num - 1) * riskConstant) < 10) && (stats.stamina.num * (5 / 3) >= 5)) {
            if ((stats.health.num - ((stats.stamina.num - 1) * riskConstant) < 10) && ((stats.stamina.num + (gm ? gm.getItem('HideStaminaRisk', 1) : 1)) >= state.getItem('MonsterStaminaReq', 1))) {
                return false;
            }

            return true;
        } catch (err) {
            con.error("ERROR in needToHide: " + err.stack);
            return undefined;
        }
    };

    /*-------------------------------------------------------------------------------------\
    MonsterReview is a primary action subroutine to manage the monster and raid list
    on the dashboard
    \-------------------------------------------------------------------------------------*/
	worker.addAction({fName : 'monster.review', priority : 1000, description : 'Reviewing Monsters'});

    monster.review = function () {
        try {
            /*-------------------------------------------------------------------------------------\
            We do monster review once an hour.  Some routines may reset this timer to drive
            MonsterReview immediately.
            \-------------------------------------------------------------------------------------*/
            if (config.getItem('WhenMonster', 'Never') === 'Never' && ['No Monster', 'Demi Points Only'].indexOf(config.getItem('WhenBattle', 'Never')) < 0 &&  config.getItem('TargetType', 'Freshmeat') != 'Raid') {
                return false;
            }

            var link = '',
				i = 0,
				time = 60,
				hunterPts = config.getItem('WhenHunter','Never'),
				conquestCollect = false,
				result = false,
				click = false,
				message = 'Reviewing ',
				doSiege = false,
				siegeLimit = 0;

            for (i = 0; i < stats.reviewPages.length; i++) {
                if (schedule.since(stats.reviewPages[i].review, 60 * 60)) {
                    con.log(2,'Reviewing monster list page',stats.reviewPages[i].path, stats.reviewPages,stats.reviewPages[i].review);
                    return caap.navigateTo(stats.reviewPages[i].path);
                }
            }

            if (monster.records.length === 0) {
                return false;
            }

            monster.records.some( function(cM, i) {
				
				// Skip monsters we haven't joined, unless in conquest lands
                if (cM.state == 'Join' && cM.lpage != "ajax:player_monster_list.php?monster_filter=2") {
                    return false;
                }
				// Skipping raids until fixed
                if (cM.link.hasIndexOf('raid.php')) {
                    return false;
                }
                if (cM.color === 'grey' && cM.life == 100) {
                    cM.life = 0;
                    cM.fortify = -1;
                    cM.strength = -1;
                    cM.time = 0;
                    cM.t2k = -1;
                    cM.phase = '';
                    monster.setRecord(cM);
                }

				time = (['Attack', 'Dead or fled'].hasIndexOf(cM.state) ? (monster.parseCondition('mnt', cM.conditions) || 60) : 12 * 60) * 60;

				link = cM.link;

				if (['Collect', 'Dead or fled'].hasIndexOf(cM.state)) {
					conquestCollect = !monster.isConq(cM) || hunterPts == 'Never' || stats.conquest.Hunter < hunterPts;
					if (conquestCollect && (/:collect\b/.test(cM.conditions) ||
						(/:collectsmall\b/.test(cM.conditions) && cM.damage < 400000) ||
						(/:collectold\b/.test(cM.conditions) && cM.lMissing > 3) ||
						(!/:!collect\b/.test(cM.conditions) && config.getItem('monsterCollectReward', false)))) {
						message = 'Collecting ';
						if (general.Select('CollectGeneral')) {
							result = {mlog: message + (i + 1) + '/' + monster.records.length + ' ' + cM.name};
							return true;
						}

						link += '&action=collectReward' + cM.rix;
					}

				} else if (cM.state == 'Done') {
					if (cM.lpage == "player_monster_list" && !cM.link.match(/mpool=2/) && (/:clear\b/.test(cM.conditions) || (!/:!clear\b/.test(cM.conditions) && config.getItem('clearCompleteMonsters', false)))) {
						link = link.replace("battle_monster.php?casuser=", "player_monster_list.php?remove_list=").concat("&monster_filter=1");
						message = 'Clearing ';
						monster.deleteRecord(cM.link);
					}

				} else if (cM.state == 'Attack') {
					if (cM.siegeLevel > 0 && stats.stamina.num >= cM.siegeLevel && cM.monster.indexOf('Deathrune Siege') < 0) {
						siegeLimit = cM.conditions.regex(/:!s\b/) ? 0 : !cM.conditions.regex(/:fs\b/) ?
							monster.parseCondition("s", cM.conditions) : (stats.stamina.num >= caap.maxStatCheck('stamina') && cM.phase > 2) ?
							50 : 1;
						siegeLimit = siegeLimit !== false ? siegeLimit : config.getItem('siegeUpTo','Never') === 'Never' ? 0 : config.getItem('siegeUpTo','Never');
						
						doSiege = Number(cM.siegeLevel) <= Number(siegeLimit) && cM.damage > 0 &&
							(cM.phase > 1 || (cM.conditions && cM.conditions.regex(/:fs\b/)));
					}

					if (doSiege) {
						click = caap.linkMatch(/assist/i) || link;
						message = 'Sieging ';
					} else if (cM.canPri && monster.parseCondition("pri", cM.conditions) &&
						monster.parseCondition("pri", cM.conditions) > cM.time && schedule.check('monsterPriorityWait')) {
						link += '&action=commitPriorityMonster';
						message = 'Making Priority ';
					} else if (cM.canPub && monster.parseCondition("pub", cM.conditions) &&
						monster.parseCondition("pub", cM.conditions) > cM.time) {
						link += '&action=makeMonsterPublic';
						message = 'Making Public ';
					}
				}
				
                if (message === 'Reviewing ' && !schedule.since(cM.review, time)) {
                    return false;
                }

				if (click) {
					caap.navigate3(link, click);
				} else {
					caap.ajaxLink(link);
				}
				monster.lastClick = cM.link;
				result = {mlog: message + (i + 1) + '/' + monster.records.length + ' ' + cM.name};
				return true;
            });

            return result;
        } catch (err) {
            con.error("ERROR in monster.review: " + err.stack);
            return false;
        }
    };

	worker.addAction({fName : 'monster.worker', priority : 800, description : 'Fighting Monsters'});

    monster.worker = function () {
        try {
			var whenMonster = config.getItem('WhenMonster', 'Never'),
				fightMode = '',
                cM = {},  // current monster
                attackButton = null,
                buttonList = [],
                tacticsValue = 0,
                useTactics = false,
                attackMess = '',
				gMult = 1, // General multiplier, like Orc King = 5
				minMax = 'min',
				menuGeneral = 'Use Current',
				specificGeneral = 'Use Current',
				temp,
				nodeNum = 0,
				xpPerPt = 1,
				statRequire = 0,
				statRequireBig = 0,
				statAvailable = 0,
				goBig = false,
				debtcM = {},
				whichStat = 'listEnergy',
				levelUpGen = config.getItem('Level_UpGeneral','Use Current') == 'Use Current' ? 'MonsterGeneral' : 'Level_UpGeneral',
				statList = [],
				blankRecord = new monster.record().data,
				result = false,
				burning = false,
				charged = false,
				cQ = state.getItem('nextQuest', {energy: 0, experience: 0}), // current Quest
				healPercStam = config.getItem('HealPercStam', 20) / 100,
				energyAvailable = caap.checkEnergy('Fortify', config.getItem('WhenFortify', 'Energy Available')),
				maxEnergy = caap.checkEnergy('Fortify', 'Energy Available'),
				gMultFunc = function(gen) { 
					return general.getRecordVal(general.getConfigMenuGeneral(gen), 'special').regexd(/(\d)x power attacks/i, 1);
				},
				setGeneralVarsFunc = function(generalMenuSetting, stat) { 
					burning = /:burn\b/i.test(cM.conditions);
					menuGeneral = generalMenuSetting;
					specificGeneral = general.getConfigMenuGeneral(generalMenuSetting);
					charged = general.charged(specificGeneral);
					gMult = gMultFunc(generalMenuSetting);
					goBig = !general.ZinMisaCheck(generalMenuSetting) && (burning || charged);
					statAvailable = stat == 'cover' || (stat == 'energy' && cM.stunDo) ? maxEnergy : whichStat == 'listEnergy' ?
						energyAvailable : goBig ?
						Math.min(stats.stamina.num - (caap.inLevelUpMode() ? 0 : 20), burning && !charged ? 100 : 1000) :
						Math.min(caap.checkStamina('Monster'), healPercStam > 0 && !caap.inLevelUpMode() ?
							(stats.energy.num / healPercStam) : stats.stamina.num);
					minMax = whichStat == 'listStamina' && (goBig || config.getItem('PowerAttackMax', false))	? 'max' : 'min';
				};


			if (whenMonster === 'Never' || whenMonster == 'Review Only') {
				return {action: false, mess: whenMonster == 'Never' ? '' : 'No current review'};
			}
				
			monster.select(false);
			
            if (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && caap.needToHide() && caap.checkStamina('Monster', 1)) {
                return {action: false, mess: "Stay Hidden Mode: We're not safe. Go battle."};
            }

            if (!schedule.check('NotargetFrombattle_monster')) {
                return false;
            }

            ///////////////// Individual Monster Page \\\\\\\\\\\\\\\\\\\\\\

			debtcM = healPercStam ? (monster.records.reduce(function(previous, redR) {
				return redR.debtStamina > previous.debtStamina ? redR : previous;
			}, blankRecord)) : blankRecord;
			
            // Check to see if we should fortify or attack monster
			['energy', 'stamina', 'cover'].some( function(stat) {
				fightMode = stat == 'stamina' ? 'Monster' : 'Fortify';
				temp = state.getItem('targetFrom' + fightMode, '');
				cM = stat == 'cover' ? debtcM :  temp ? monster.getRecord(temp) : blankRecord;
				
				if (!cM.link) {
					return false;
				}
				
				whichStat = stat == 'stamina' ? 'listStamina' : 'listEnergy';
				statList = cM[whichStat].split(',');

				setGeneralVarsFunc(fightMode + 'General', stat);

				if (debtcM.debtStamina > 0 && stat !== 'cover') { // We have a debt
				
					// If trying to hit or heal anyone other than the monster we need to cover, then don't, unless hitting and levelling up
					if (cM.link !== debtcM.link && (stat == 'energy' || !caap.inLevelUpMode())) {
						return false;
					}
					// If done enough damage to fort and have energy to heal and debt is at least one heal, then wait for cover
					if (stat == 'stamina' && debtcM.debtStamina >= debtcM.listEnergy.split(',')[0] * gMult / healPercStam && maxEnergy >= debtcM.listEnergy.split(',')[0]) {
						return false;
					}
				}
				xpPerPt = whichStat == 'listEnergy' ? 3.6 : 5.5;
				//con.log(2, fightMode + ' ', state.getItem('targetFrom' + fightMode, ''));
				
				//con.log(2, cM.name + ' ', whichStat, cM, cM[whichStat]);

				if (caap.inLevelUpMode()) {  
					// Check for the biggest hit we can make with our remaining stats
					statRequireBig = caap.minMaxArray(statList, 'max', 1, (stats.stamina.num + 1) / gMultFunc(levelUpGen)) * gMultFunc(levelUpGen);
					statRequireBig = $u.isNaN(statRequireBig) ? 0 : statRequireBig;
					statRequireBig = $u.hasContent(cQ) && cQ.experience > statRequireBig * 2.2 && stats.energy.num >= cQ.energy ? 
						0 : statRequireBig;
					
					// Is there a smaller power attack that will work?
					statRequire = caap.minMaxArray(statList, 'min', 1, (stats.stamina.num + 1 - statRequireBig) / gMult) * gMult;
					
					if (!statRequire || statRequire * xpPerPt >= stats.exp.dif) { // Small power hit no go
						if (statList[0] == 1 && gMult * xpPerPt < stats.exp.dif) { // Small single hit ok?
							statRequire = gMult;
						} else {
							// If just about to do big hit, do any quests to use energy first.
							if (stats.energy.num > cQ.energy && cQ.experience < stats.exp.dif) {
								result = quest.worker();
								if (caap.passThrough(result, 'quest')) { 
									return result;
								}
							}
							// Next see if we can use any of the remaining stamina in battle
							if (stats.exp.dif > 5 && stats.stamina.num - statRequireBig > 0) {
								result = battle.worker(stats.stamina.num - statRequireBig);
								if (caap.passThrough(result, 'battle')) { 
									return result;
								}
							}
							// Last do a big quest if that's the biggest we've got
							if (stats.energy.num > cQ.energy && cQ.experience > statRequireBig * 2.2) {
								result = quest.worker();
								if (caap.passThrough(result, 'quest')) { // If just about to do big hit, do any quests to use energy first.
									return result;
								}
							}
						}
						// If too close to levelling for a power attack, do max attack to carry over xp
						setGeneralVarsFunc(levelUpGen, stat);
						statRequire = statRequireBig;
						statAvailable = statRequire;
					}
					if (statRequire > 0) {
						con.log(2, 'Hitting for ' + statRequire + ' Big ' + statRequireBig + ' Stamina ' + stats.stamina.num + ' with ' +
							statRequire + ' available. xp ' + stats.exp.dif, cM);
					}
				} else if (statList[0] == 1 && (/:sa\b/i.test(cM.conditions) || (!config.getItem('PowerAttack', false) &&  !/:pa\b/i.test(cM.conditions)))) {
					statRequire = gMult;
				} else {
					statRequire = caap.minMaxArray(statList, minMax, 1, (statAvailable + 1) / gMult) * gMult ;
				}
				if (statRequire && statRequire <= statAvailable) {
					nodeNum = !cM.multiNode ? 0 : statList.indexOf((statRequire / gMult).toString());
					return true;
				}
				statAvailable = 0;

			});
			
			if (caap.passThrough(result)) { 
				return result;
			}

			if (!statAvailable) {
				return {action: false, mess: 'Waiting for stamina/energy'};
			}

            // Set general and go to monster page
			result = caap.navigate2('@' + menuGeneral + ',ajax:' + cM.link + (cM.targetPart > 0 ? (",clickjq:#app_body #monster_target_" +
				cM.targetPart + " img[src*='multi_selectbtn.jpg'],jq:#app_body #expanded_monster_target_" + cM.targetPart + ":visible") : ''));
			
			monster.lastClick = cM.link;
            if (result !== false) {
                if (result == 'fail') {
					temp = state.getItem('monsterNaviFail', 0) + 1;
					if (temp >= 5) {
						monster.deleteRecord(cM.link);
						state.setItem('monsterNaviFail', 0);
						return {action: false, mlog: 'Unable to navigate to ' + cM.name + ' ' + ' times. Deleting monster.'};
					}
					state.setItem('monsterNaviFail', temp);
					return {action: false, mlog: 'Unable to navigate to ' + cM.name + ' ' + ' times'};
				}
				state.setItem('monsterNaviFail', 0);
                return {mlog: 'Going to ' + cM.name};
            }

            // Check if on engage monster page
            if ($u.hasContent($j("#app_body " + monster.onMonsterHeader))) {
                
                // Find the attack or fortify button
                if (fightMode === 'Fortify') {
                    buttonList = ['seamonster_fortify.gif', 'button_dispel.gif', 'attack_monster_button3.jpg'];

                    if (monster.getInfo(cM, 'fortify_img')) {
                        buttonList.unshift(monster.getInfo(cM, 'fortify_img')[0]);
                    }
                    if (!cM.stunTarget) {
                        con.log(1, "No stun target time set");
                    }
                    
					// Only stun if we have no debt
                    if (cM.stunDo && cM.stunType !== '' && !$u.hasContent(debtcM.link)) {
                        buttonList.unshift("button_nm_s_" + cM.stunType);
                    } else {
                        buttonList.unshift("button_nm_s_");
                    }
                } else if (statRequire === 1) {
                    // not power attack only normal attacks
                    buttonList = monster.singleButtons;
                } else {
					if (!cM.conditions.match(/:!dr\b/) && caap.ifClick('darkrage_button1.gif')) {
						return {mlog: 'Engaging Dark RAAAAAGE on ' + cM.name};
					}
                    if (/:tac/i.test(cM.conditions) && stats.level >= 50) {
                        useTactics = true;
                        tacticsValue = monster.parseCondition("tac%", cM.conditions);
                    } else if (config.getItem('UseTactics', false) && stats.level >= 50) {
                        useTactics = true;
                        tacticsValue = config.getItem('TacticsThreshold', false);
                    }

                    if (tacticsValue !== false && cM.fortify && cM.fortify < tacticsValue) {
                        con.log(2, "Party health is below threshold value", cM.fortify, tacticsValue);
                        useTactics = false;
                    }

                    if (useTactics && caap.hasImage('nm_button_tactics.gif')) {
                        con.log(2, "Attacking monster using tactics buttons");
                        buttonList = ['nm_button_tactics.gif'].concat(monster.powerButtons);
                    } else {
                        useTactics = false;
                        // power attack or if not seamonster power attack or if not regular attack -
                        // need case for seamonster regular attack?
                        buttonList = monster.powerButtons;

                        if (monster.getInfo(cM, 'attack_img')) {
                            if (!caap.inLevelUpMode() && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false)) {
                                buttonList.unshift(monster.getInfo(cM, 'attack_img')[1]);
                            } else {
                                buttonList.unshift(monster.getInfo(cM, 'attack_img')[0]);
                            }
                        }
                    }
                }

                buttonList.some( function(button) {
                    attackButton = caap.checkForImage(button, null, null, nodeNum);
                    return $u.hasContent(attackButton);
                });

                if ($u.hasContent(attackButton)) {
                    if (fightMode === 'Fortify') {
                        attackMess = (cM.stunDo ? cM.stunType + 'ing ': 'Fortifying ') + cM.name;
                    } else {
						general.resetCharge();
						if (useTactics) {
							attackMess = 'Tactic Attacking ' + cM.name;
						} else {
							attackMess = (statRequire >= 5 ? 'Power' : 'Single') + ' Attacking ' + cM.name;
						}
                    }

                    caap.click(attackButton);
					monster.spent = 'spent' + (fightMode === 'Fortify' ? 'Energy' : 'Stamina');
					monster.amount = statRequire;
					
					// Record healing debt or repayments
					if (cM.fortify >= 0 && healPercStam > 0 && (!cM.charClass || ['Mage','Rogue'].indexOf(cM.charClass) == -1)) {
						cM.debtStamina = Math.max(0, cM.debtStamina + (fightMode === 'Fortify' ? -statRequire / healPercStam : statRequire));
						cM.debtStart = cM.debtStart == -1 && fightMode === 'Monster' ? Math.min(cM.fortify, 97) 
							: cM.debtStamina ? cM.debtStart : -1;
					}
                    // dashboard autorefresh fix
                    localStorage.AFrecentAction = true;

                    attackButton = null;
                    buttonList = null;
					state.setItem('fightMode', fightMode);
					monster.setRecord(cM);
                    return {mlog: attackMess};
                }

                schedule.setItem('NotargetFrombattle_monster', 60);
                attackButton = null;
                buttonList = null;
                return {action: false, mwarn: 'No button to attack/fortify for ' + cM.name};
            }

            schedule.setItem('NotargetFrombattle_monster', 60);
            attackButton = null;
            buttonList = null;
            return {action: false, mwarn: 'Unable to find top banner for ' + cM.name};
        } catch (err) {
            con.error("ERROR in monster.worker: " + err.stack);
            return false;
        }
    };

    monster.engageButtons = {};
	
	monster.singleButtons = ['button_nm_p_attack.gif', 'attack_monster_button.jpg', 'event_attack1.gif', 'seamonster_attack.gif'];
	
	monster.powerButtons = ['button_nm_p_', 'power_button_', 'attack_monster_button2.jpg', 'event_attack2.gif', 'seamonster_power.gif', 'serpent_10stam_attack.gif'];
	
	monster.onMonsterHeader = "div[style*='dragon_title_owner'],div[style*='monster_header_'],div[style*='monster_'][style*='_title']" +
		",div[style*='monster_'][style*='_header'],div[style*='boss_'][style*='_header'],div[style*='boss_header_']" +
		",div[style*='newmonsterbanner_'],div[style*='festival_monsters_']";

    monster.completeButton = {
        'battle_monster': {
            'name': undefined,
            'button': undefined
        },
        'raid': {
            'name': undefined,
            'button': undefined
        }
    };

    // Keep object names short, and remove the ", the World Hydra" parts. Players should know what they're fighting
    // No commas allowed in Object names
    monster.info = {
         'Default Monster': {
            ach: 1000000,
            listStamina: '1,5',
			listEnergy: '10',
			siege: 5,
			achNum : 5,
			style : 'class',
            defense_img: 'nm_green.jpg'
        },
       'Skaar Deathrune': {
			style : 'fort',
            duration: 96,
            defButton: 'button_dispel.gif',
            defense_img: 'bar_dispel.gif',
			achNum : 25
        },
        'Ragnarok': {
			style : 'fort',
            defButton: 'button_dispel.gif',
            defense_img: 'bar_dispel.gif'
        },
        'Genesis': {
			style : 'fort',
            defButton: 'attack_monster_button3.jpg',
            defense_img: 'seamonster_ship_health.jpg',
			achNum : 25,
            repair_img: 'repair_bar_grey.jpg'
        },
        'Cronus': {
			style : 'fort',
            ach: 500000,
			achNum : 25,
			achTitle : "Hydra Knight"
		},
        'Invading Force': {
			alias: 'Dark Legion'
		},
        'Battle Of The Dark L...': {
			alias: 'Dark Legion'
		},
        'Dark Legion': {
			style : 'fort',
            duration: 168,
            ach: 1000,
			achNum : 25,
            defense_img: 'seamonster_ship_health.jpg',
            repair_img: 'repair_bar_grey.jpg'
		},
        'Emerald Dragon': {
			style : 'stamina',
            duration: 72,
            ach: 100000,
            listStamina: '5,10',
			achNum : 25,
			achTitle : "Dragon Knight",
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif']
        },
        'Frost Dragon': {
			style : 'stamina',
            duration: 72,
            ach: 100000,
            listStamina: '5,10',
			achNum : 25,
			achTitle : "Dragon Knight",
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif']
        },
        'Gold Dragon': {
			style : 'stamina',
            duration: 72,
            ach: 100000,
            listStamina: '5,10',
			achNum : 25,
			achTitle : "Dragon Knight",
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif']
        },
        'Ancient Red Dragon': {
			style : 'stamina',
            duration: 72,
            ach: 100000,
            listStamina: '5,10',
			achNum : 25,
			achTitle : "Dragon Knight",
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif']
        },
        'Karn': {
			style : 'stamina',
            duration: 120,
            ach: 15000
        },
        'Gildamesh': {
			style : 'stamina',
            duration: 72,
            ach: 15000,
			summonAlias : 'Orc King'
        },
        'Colossus Of Terra': {
			style : 'stamina',
            duration: 72,
            ach: 20000
        },
        'Sylvanas': {
			style : 'stamina',
            duration: 48,
            ach: 50000
        },
        'Mephistopheles': {
			style : 'stamina',
            duration: 48,
            ach: 50000
        },
        'Lotus Ravenmoore': {
			style : 'stamina',
            duration: 48,
            ach: 500000,
			achTitle : "Lotus Hunter"
        },
        'Keira': {
			style : 'stamina',
            duration: 72,
            ach: 30000
        },
        'Amethyst Sea Serpent': {
			style : 'fort',
            duration: 72,
            ach: 250000,
            listStamina: '10,20',
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg'
        },
        'Ancient Sea Serpent': {
			style : 'fort',
            duration: 72,
            ach: 250000,
            listStamina: '10,20',
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg'
        },
        'Emerald Sea Serpent': {
			style : 'fort',
            duration: 72,
            ach: 250000,
            listStamina: '10,20',
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg'
        },
        'Sapphire Sea Serpent': {
			style : 'fort',
            duration: 72,
            ach: 250000,
            listStamina: '10,20',
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg'
        },
        'Deathrune Siege I': {
			style : 'stamina',
			duration: 88,
			ach: 50,
			staUse: 1
		},
        'Death Gates': {
			alias: 'Deathrune Siege II'
		},
        'Deathrune Siege II': {
			style : 'stamina',
			duration: 144,
			ach: 100,
			staUse: 1
        },
        'War Of The Red Plains': {
			style : 'fort',
            tactics: true,
            duration: 168,
            ach: 10000
        },
        'Bahamut': {
            ach: 4000000
        },
        'Alpha Bahamut': {
            ach: 8000000
        },
        'Azriel': {
            ach: 8000000
        },
        'Kraken': {
            achTitle : "Kraken"
        },
        'Agamemnon The Overseer': {
            achTitle : "Agamemnon the Overseer"
        },
        'Alpha Mephistopheles': {
            ach: 12000000
        },
        "Aurelius": {
			style : 'fort',
            tactics: true,
			achTitle : "Aurelius, Lion's Rebellion",
            ach: 1000
        },
        'Cronus Astaroth': {
            ach: 1000000
        }
    };

	// Cleans a link to put it in a standard order. If no argument passed, uses the last clicked URL
	monster.cleanLink = function(link, casuser, mpool) {
		var temp;
		if (!$u.isString(link) || link.length === 0) {
			link = session.getItem('clickUrl', '');
		}
		//con.log(2, 'CleanLink', link, casuser, mpool);
		temp = link.replace(/http.*\//,'').replace('battle_expansion_monster.php','guildv2_battle_monster.php');
		link = temp.replace(/\?.*/,'') + '?';
		['casuser=', 'mpool=', 'guild_creator_id=', 'guild_created_at=', 'slot=', 'monster_slot=', 'mid=', 'tower='].forEach( function(piece) {
			if (piece == 'casuser=' && temp.indexOf(piece) >= 0 && $u.setContent(casuser, 0) > 0) {
				//con.log(2, 'Cleaning link', piece, link);
				link += '&casuser=' + casuser;
			} else if (piece == 'mpool=' && temp.indexOf(piece) >= 0 && $u.setContent(mpool, 0) > 0) {
				//con.log(2, 'Cleaning link', piece, link);
				link += '&mpool=' + mpool;
			} else if (temp.indexOf(piece) >= 0) {
				//con.log(2, 'Cleaning link', piece, link);
				link += '&' + temp.match(new RegExp('(' + piece +  '\\w+)'))[1];
			}
		});
		return (link.indexOf('=') >= 0 ? link.replace('?&', '?') : monster.lastClick).replace('battle_expansion_monster.php','guildv2_battle_monster.php');
	};

    monster.which = function(img, entity) {
        try {
            if (!$u.hasContent(img) || !$u.isString(img)) {
                con.warn("img", img);
                throw "Invalid identifying img!";
            }

            if (!$u.hasContent(entity) || !$u.isString(entity)) {
                con.warn("entity", entity);
                throw "Invalid entity name!";
            }

            var i = '',
                k = 0,
                r = {},
                name = '';

            // current thinking is that continue should not be used as it can cause reader confusion
            // therefore when linting, it throws a warning
            /*jslint continue: true */
            for (i in monster.info) {
                if (monster.info.hasOwnProperty(i)) {
                    if ($u.hasContent(name)) {
                        break;
                    }

                    r = monster.info[i];
                    if (!$u.hasContent(r) || !$u.hasContent(r[entity]) || !$j.isArray(r[entity])) {
                        continue;
                    }

                    for (k = 0; k < r[entity].length; k += 1) {
                        if (img === r[entity][k]) {
                            name = i;
                            break;
                        }
                    }
                }
            }
            /*jslint continue: true */

            return name;
        } catch (err) {
            con.error("ERROR in monster.which: " + err.stack);
            return undefined;
        }
    };

    monster.getInfo = function(mName, value, defValue) {
        try {
			mName = $u.setContent(mName.monster, mName);
            if (!$u.isString(mName) || mName.length === 0) {
				con.warn('monster.getInfo not passed a monster name', mName);
            }
			mName = mName.replace(/^The /i,'');
			defValue = !$u.isDefined(defValue) ? monster.info['Default Monster'][value] : defValue;
            return $u.setContent(monster.info[mName],false) ? $u.setContent(monster.info[mName][value], defValue): defValue;
        } catch (err) {
            con.error("ERROR in monster.getInfo: " + err + ' stack ' + err.stack);
            return undefined;
        }
    };

    // Add a review page with path, and set 'entry' key to value, if wanted
    monster.setrPage = function(path, entry, value) {
        try {
            var rPage = {
					'path' : path,
					'review' : 0,
					'page' : false},
				result = false;

            if (!$u.hasContent(path) || !$u.isString(path)) {
                con.warn("path", path);
                throw "Invalid identifying path!";
            }

            result = stats.reviewPages.some( function(p) {
                if (p.path === path) {
                    if ($u.hasContent(entry)) {
                        p[entry] = value;
                    }
					statsFunc.setRecord(stats);
                    return true;
                }
            });
			if (result) {
				return true;
			}
            if ($u.hasContent(entry)) {
                rPage[entry] = value;
            }

            stats.reviewPages.push(rPage);
			statsFunc.setRecord(stats);
            //con.log(2,'setrPage',path, entry, value, stats.reviewPages,rPage);
            return false;
        } catch (err) {
            con.error("ERROR in monster.setrPage: " + err.stack);
            return false;
        }
    };

    // Delete all review pages where 'entry' = value
    monster.deleterPage = function(entry, value) {
        try {
            if (!$u.hasContent(entry) || !$u.isString(entry)) {
                con.warn("Delete entry invalid", entry, value);
                throw "Invalid identifying entry!";
            }
            var deleted = 0, i;

            for (i = stats.reviewPages.length - 1; i >= 0; i += -1) {
                if (stats.reviewPages[i][entry] === value) {
                    deleted += 1;
                    con.log(2,'Monster review pages before',stats.reviewPages, entry, i);
                    stats.reviewPages.splice(i,1);
                    con.log(2,'Monster review pages after',stats.reviewPages, entry, i, deleted);
                }
            }
			statsFunc.setRecord(stats);
            return deleted;

        } catch (err) {
            con.error("ERROR in monster.deleterPage: " + err.stack);
            return false;
        }
    };

    // Delete or add review page based on if 'tf' is true or false
    monster.togglerPage = function(path, tf, entry, value) {
        try {
            if (tf) {
                return monster.setrPage(path, entry, value);
            }
            return monster.deleterPage('path', path);
        } catch (err) {
            con.error("ERROR in monster.togglerPage: " + err.stack);
            return false;
        }
    };

    monster.init = function() {
        try {
			var pageList = [
				'player_monster_list',
				'ajax:player_monster_list.php?monster_filter=2',
				'ajax:player_monster_list.php?monster_filter=3',
				'ajax:raid.php'];
				
			stats.reviewPages.forEach( function(page) {
				if (pageList.indexOf(page.path) < 0) {
					con.log(1, 'Deleted path ' + page.path + ' from monster pages review', stats.reviewPages);
					monster.deleterPage('path', page.path);
				}
            });
			
			monster.togglerPage(pageList[0], stats.level > 6 || stats.level === 0);
			monster.togglerPage(pageList[1], stats.level > 6 || stats.level === 0);
			monster.togglerPage(pageList[2], stats.level > 6 || stats.level === 0);
			monster.togglerPage(pageList[3], stats.level > 7 || stats.level === 0);

            return true;
        } catch (err) {
            con.error("ERROR in monster.init: " + err.stack);
            return false;
        }
    };

	monster.damaged = function(cM) {
		if (!$u.isObject(cM)) {
			con.warn('Invalid monster record passed to scan.joined.', cM);
		}
		return $u.setContent(cM.damage, 0) > 0;
	};

    monster.parseCondition = function(type, conditions) {
        try {
			
            if (!$u.isString(type) || !$u.isString(conditions)) {
				con.warn('Invalid data passed to monster.parseCondition', type, conditions);
				return false;
            }

            var str = conditions.match(new RegExp(':' + type + '([\\d\\.]*)(\\w?)')),
				value,
                first = false,
                second = false;
				
			if (!str) {
				return false;
			}
			
			value = $u.setContent(str[1], 0);

            if ((/k/i.test(str[2]) || /m/i.test(str[2]))) {
                first = /k/i.test(str[2]);
                second = /m/i.test(str[2]);
                value = value * 1000 * (first + second * 1000);
            }

            return value;
        } catch (err) {
            con.error("ERROR in monster.parseCondition: " + err, type, conditions);
            return false;
        }
    };

	// Do KOB parsing and achievement/max damage levels plus colorization
	monster.setLimits = function(cM) {
        try {
			// Start of Keep On Budget (KOB) code Part 1 -- required variables
			//con.log(2, 'Start of Keep On Budget (KOB) Code');
               var KOBenable = false,
                KOBbiasHours = 0,
                KOBach = false,
                KOBmax = false,
                KOBminFort = false,
                KOBtmp = 0,
                KOBbiasedTF = 0,
                KOBPercentTimeRemaining = 0,
                KOBtotalMonsterTime = 0,
				achLevel = monster.parseCondition('ach', cM.conditions),
				maxDamage = monster.parseCondition('max', cM.conditions),
				main = monster.parseCondition('main', cM.conditions),
				maxToFortify = monster.parseCondition('f%', cM.conditions),
				maxSta = monster.parseCondition('sta', cM.conditions),
				maxHunt = cM.conditions.regex(/:hunt\b/) && monster.isConq(cM) ? session.getItem('hunterMaxed', []).hasIndexOf(cM.link) : false;

			cM.color = '';
			cM.over = '';
			maxToFortify = maxToFortify !== false ? maxToFortify : config.getItem('MaxToFortify', 0);
			achLevel = achLevel === 0 ? 1 : achLevel; // Added to prevent ach === 0 defaulting to false 
			if (achLevel === false) {
				achLevel = monster.getInfo(cM, 'ach');
			}
			maxDamage = maxDamage === 0 ? 1 : maxDamage;  // Added to prevent max === 0 defaulting to false 

			//default is disabled for everything
			KOBenable = false;

			//default is zero bias hours for everything
			KOBbiasHours = 0;

			//KOB needs to follow achievement mode for this monster so that KOB can be skipped.
			KOBach = false;

			//KOB needs to follow max mode for this monster so that KOB can be skipped.
			KOBmax = false;

			//KOB needs to follow minimum fortification state for this monster so that KOB can be skipped.
			KOBminFort = false;

			//create a temp variable so we don't need to call parseCondition more than once for each if statement
			KOBtmp = monster.parseCondition('kob', cM.conditions);
			if (KOBtmp !== false && $u.isNaN(KOBtmp)) {
				con.log(2, 'KOB NaN branch');
				KOBenable = true;
				KOBbiasHours = 0;
			} else if (KOBtmp === false) {
				con.log(5, 'KOB false branch');
				KOBenable = false;
				KOBbiasHours = 0;
			} else {
				con.log(2, 'KOB passed value branch');
				KOBenable = true;
				KOBbiasHours = KOBtmp;
			}

			//test if user wants kob active globally
			if (!KOBenable && (gm ? gm.getItem('KOBAllMonters', false) : false)) {
				KOBenable = true;
			}

			//disable kob if in level up mode or if we are within 5 stamina of max potential stamina
			if (caap.inLevelUpMode() || stats.stamina.num >= stats.stamina.max - 5) {
				KOBenable = false;
			}

			if (KOBenable) {
				con.log(2, 'Level Up Mode: ', caap.inLevelUpMode());
				con.log(2, 'Stamina Avail: ', stats.stamina.num);
				con.log(2, 'Stamina Max: ', stats.stamina.max);

				//log results of previous two tests
				con.log(2, 'KOBenable: ', KOBenable);
				con.log(2, 'KOB Bias Hours: ', KOBbiasHours);
			}

			//Total Time alotted for monster
			KOBtotalMonsterTime = monster.getInfo(cM.monster, 'duration', cM.page === 'festival_battle_monster' ? 192 : 168);
			if (KOBenable) {
				con.log(2, 'Total Time for Monster: ', KOBtotalMonsterTime);

				//Total Damage remaining
				con.log(2, 'HP left: ', cM.life);
			}

			//Time Left Remaining
			if (KOBenable) {
				con.log(2, 'TimeLeft: ', cM.time);
			}

			//calculate the bias offset for time remaining
			KOBbiasedTF = cM.time - KOBbiasHours;

			//for 7 day monsters we want kob to not permit attacks (beyond achievement level) for the first 24 to 48 hours
			// -- i.e. reach achievement and then wait for more players and siege assist clicks to catch up
			if (KOBtotalMonsterTime >= 168) {
				KOBtotalMonsterTime = KOBtotalMonsterTime - (gm ? gm.getItem('KOBDelayStart', 48) : 48);
			}

			//Percentage of time remaining for the currently selected monster
			KOBPercentTimeRemaining = Math.round(KOBbiasedTF / KOBtotalMonsterTime * 1000) / 10;
			if (KOBenable) {
				con.log(2, 'Percent Time Remaining: ', KOBPercentTimeRemaining);
			}

			// End of Keep On Budget (KOB) code Part 1 -- required variables

			//con.log(2, 'MAX DAMAGE', maxDamage, cM.damage);
			if ((((maxDamage && cM.damage >= maxDamage) || (maxSta && cM.spentStamina >= maxSta)) && (!cM.mainOnly || !main)) ||
					(cM.mainOnly && main && cM.damage >= main) || maxHunt) {

				cM.color = 'red';
				cM.over = 'max';
				//used with KOB code
				KOBmax = true;
				//used with kob debugging
				if (KOBenable) {
					con.log(2, 'KOB - max activated');
				}

			} else if (cM.fortify !== -1 && cM.fortify < config.getItem('MinFortToAttack', 1)) {
				cM.color = 'purple';
				//used with KOB code
				KOBminFort = true;
				//used with kob debugging
				if (KOBenable) {
					con.log(2, 'KOB - MinFort activated');
				}

			} else if (cM.damage >= achLevel && (config.getItem('AchievementMode', false) || monster.parseCondition('ach', cM.conditions) !== false)) {
				cM.color = 'darkorange';
				cM.over = 'ach';
				//used with KOB code
				KOBach = true;
				//used with kob debugging
				if (KOBenable) {
					con.log(2, 'KOB - achievement reached');
				}

			}

			//Start of KOB code Part 2 begins here
			if (KOBenable && !KOBmax && !KOBminFort && KOBach && cM.life < KOBPercentTimeRemaining) {
				//kob color
				cM.color = 'magenta';
				// this line is required or we attack anyway.
				cM.over = 'max';
				//used with kob debugging
				if (KOBenable) {
					con.log(2, 'KOB - budget reached');
				}

			} else {
				if (!KOBmax && !KOBminFort && !KOBach) {
					//the way that the if statements got stacked, if it wasn't kob it was painted black anyway
					//had to jump out the black paint if max, ach or fort needed to paint the entry.
					cM.color = $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
				}
			}
			//End of KOB code Part 2 stops here.
        } catch (err) {
            con.error("ERROR in monster.KOB: " + err, cM);
            return false;
        }
    };
	
    monster.characterClass = {
        'Warrior': ['Strengthen', 'Heal'],
        'Rogue': ['Cripple'],
        'Mage': ['Deflect'],
        'Cleric': ['Heal'],
        'Warlock': ['Heal', 'Deflect'],
        'Ranger': ['Strengthen', 'Heal', 'Cripple']
    };

    monster.fullReview = function(which) {
        try {

			monster.records = monster.records.filter( function(mR) {
				var joinable = (mR.state == 'Join'),
					isFeed = (which == 'Feed');
					
				return isFeed !== joinable;
			});
			
			if (which != 'Feed') {
				stats.reviewPages.forEach( function(page) {
					monster.setrPage(page.path,'review',0);
				});
				schedule.setItem('NotargetFrombattle_monster', 0);
			}
			monster.save('update');
            localStorage.AFrecentAction = false;

            return true;
        } catch (err) {
            con.error("ERROR in monster.fullReview: " + err.stack);
            return false;
        }
    };

    monster.select = function(force) {
        try {
            if (!caap.oneMinuteUpdate('selectMonster', force) || stats.level < 7) {
                return false;
            }

            var monsterList = {
					'battle_monster': [],
					'raid': [],
					'any': []
				},
				it = 0,
				cM = {},
				whichStat = 'any',
				conditions = '',
				monString = '',
                selectTypes = [],
				maxToFortify = 0,
                firstOverAch = '',
                firstUnderMax = '',
                firstFortOverAch = '',
                firstFortUnderMax = '',
                firstStunOverAch = '',
                firstStunUnderMax = '',
                firstStrengthOverAch = '',
                firstStrengthUnderMax = '',
                strengthTarget = '',
                fortifyTarget = '',
                stunTarget = '',
                target = {
                    'battle_monster': '',
                    'raid': '',
                    'fortify': ''
                },
				feedCheck = caap.oneMinuteUpdate('feedCheck'),
                monsterlink = '',
                attackOrderList = [];
				
			conquest.hunterCombos('maxed');

            // Next we get our monster objects from the repository and break them into separate lists
            // for monster or raid.  If we are serializing then we make one list only.

            for (it = monster.records.length - 1; it >= 0; it -= 1) {
				cM = monster.records[it];
				if (!$u.hasContent(cM.link)) {
					con.warn('Deleting monster record without link', cM);
					monster.deleteRecord(cM.link);
				} else if (cM.lMissing > 3 && (!monster.isConq(cM) || cM.state == 'Done')) {
					con.log(2, 'Deleting monster ' + cM.name + ' since not seen on monster list ' + cM.lMissing + ' times', cM);
					monster.deleteRecord(cM.link);
				} else if (monster.damaged(cM)) {
					//con.log(2,'Review timer check', cM.name, cM.lMissing, typeof cM.lpage, typeof cM.lpage == 'undefined', schedule.since($u.setContent(cM.listReviewed, 0), 3 * 3600));
					if (cM.charClass.length) {
						if (cM.color !== 'grey' && schedule.since(cM.stunTime, 0)) {
							con.log(2, "Review monster due to class timer", cM.name);
							cM.review = -1;
						}
					}
					cM.conditions = 'none';
					whichStat = config.getItem('SerializeRaidsAndMonsters', false) ? 'any' : cM.link.indexOf('raid') >=0 ? 'raid' : 'battle_monster';
					monsterList[whichStat].push(cM.link);
				} else if (cM.state == 'Join' && feedCheck) {
					feed.scoring(cM);
				}
				
				if (cM.state !== 'Attack'){
					cM.debtStart = -1;
					cM.debtStamina = 0;
				}
            }

            state.setItem('wsave_monster', true);

            if (whichStat === 'any') {
                selectTypes = ['any'];
            } else {
                selectTypes = ['battle_monster', 'raid'];
            }

            // We loop through for each selection type (only once if serialized between the two)
            // We then read in the users attack order list

            selectTypes.forEach(function(type) {
                if (!$u.hasContent(monsterList[type])) {
					return;
                }

                firstOverAch = '';
                firstUnderMax = '';
                firstFortOverAch = '';
                firstFortUnderMax = '';
                firstStunOverAch = '';
                firstStunUnderMax = '';
                firstStrengthOverAch = '';
                firstStrengthUnderMax = '';
                strengthTarget = '';
                fortifyTarget = '';
                stunTarget = '';

                // The extra apostrophe at the end of attack order makes it match any "soandos's monster" so it always selects a monster if available
                if (type === 'any') {
                    attackOrderList = config.getList('orderbattle_monster', '');
                    $j.merge(attackOrderList, config.getList('orderraid', '').concat('your', "'"));
                } else {
                    attackOrderList = config.getList('order' + type, '').concat('your', "'");
                }

                //con.log(2, 'attackOrderList', attackOrderList);
                // Next we step through the users list getting the name and conditions
                attackOrderList.forEach( function(aoItem) {
                    if (!aoItem.trim()) {
                        return;
                    }
                    // Now we try to match the users name against our list of monsters
                    monsterList[type].forEach(function(thisMon) {
						cM = monster.getRecord(thisMon);
                        // If we set conditions on this monster already then we do not reprocess
                        if (cM.conditions !== 'none') {
                            return;
                        }
						conditions = aoItem.replace(new RegExp("^[^:]+"), '').toString().trim();
						monString = aoItem.match(new RegExp("^[^:]+")).toString().trim().toLowerCase();
                        // If this monster does not match, skip to next one
                        if ((monString !== 'all' && !monster.getRecord(thisMon).name.toLowerCase().hasIndexOf(monString)) ||
							(conditions.regex(/(:conq)\b/) && !cM.link.hasIndexOf("guildv2_battle_monster.php")) ||
							(conditions.regex(/(:!conq)\b/) && cM.link.hasIndexOf("guildv2_battle_monster.php")) ||
							(conditions.regex(/(:old)\b/) && cM.time > 144) ||
							(conditions.regex(/(:!old)\b/) && cM.time < 144)) {
                            return;
                        }

                        //Monster is a match so we set the conditions
                        cM.conditions = conditions;
						cM.fullC = aoItem;

						cM.select = true;

                        state.setItem('wsave_monster', true);
                        // If it's complete or collect rewards, no need to process further
                        if (cM.color === 'grey') {
							monster.setRecord(cM);
                            return;
                        }
						
						monster.setLimits(cM);
						
                        // monster.setLimits set our 'color' and 'over' values. Check these to see if this is the monster we should select
                        if (!firstUnderMax && cM.color !== 'purple') {
                            if (cM.over === 'ach') {
                                if (!firstOverAch) {
                                    firstOverAch = thisMon;
                                    con.log(3, 'firstOverAch', firstOverAch, cM.name);
                                }
                            } else if (cM.over !== 'max') {
                                firstUnderMax = thisMon;
                                con.log(3, 'firstUnderMax', firstUnderMax, cM.name);
                            }
                        }

						if (!cM.charClass.length || (cM.charClass.length && monster.characterClass[cM.charClass] && monster.characterClass[cM.charClass].hasIndexOf('Heal'))) {
							maxToFortify = (monster.parseCondition('f%', cM.conditions) !== false) ? monster.parseCondition('f%', cM.conditions) : config.getItem('MaxToFortify', 0);
							if (cM.fortify >= 0 && !firstFortUnderMax && cM.fortify < maxToFortify) {
								if (cM.over === 'ach') {
									if (!firstFortOverAch) {
										firstFortOverAch = thisMon;
										con.log(3, 'firstFortOverAch', firstFortOverAch, cM.name);
									}
								} else if (cM.over !== 'max') {
									firstFortUnderMax = thisMon;
									con.log(3, 'firstFortUnderMax', firstFortUnderMax, cM.name);
								}
							}
						}

						if (cM.charClass.length) {
							if (monster.characterClass[cM.charClass] && monster.characterClass[cM.charClass].hasIndexOf('Strengthen') && (config.getItem("StrengthenTo100", true) || cM.stunType == 'strengthen')) {
								if (!firstStrengthUnderMax && cM.strength < 100) {
									if (cM.over === 'ach') {
										if (!firstStrengthOverAch) {
											firstStrengthOverAch = thisMon;
											con.log(3, 'firstStrengthOverAch', firstStrengthOverAch, cM.name);
										}
									} else if (cM.over !== 'max') {
										firstStrengthUnderMax = thisMon;
										con.log(3, 'firstStrengthUnderMax', firstStrengthUnderMax, cM.name);
									}
								}
							}

							if (!firstStunUnderMax && cM.stunDo) {
								if (cM.over === 'ach') {
									if (!firstStunOverAch) {
										firstStunOverAch = thisMon;
										con.log(3, 'firstStunOverAch', firstStunOverAch, cM.name);
									}
//                                    } else if (cM.over !== 'max') {
								} else {
									firstStunUnderMax = thisMon;
									con.log(3, 'firstStunUnderMax', firstStunUnderMax, cM.name);
								}
							}
                        }
						monster.setRecord(cM);
                    });
                });

                // Now we use the first under max/under achievement that we found. If we didn't find any under
                // achievement then we use the first over achievement
                if (type !== 'raid') {
                    stunTarget = $u.setContent(firstStunUnderMax, firstStunOverAch);
                    strengthTarget = $u.setContent(firstStrengthUnderMax, firstStrengthOverAch);
                    fortifyTarget = $u.setContent(firstFortUnderMax, firstFortOverAch);
					target.fortify = stunTarget || strengthTarget || fortifyTarget;
                }

                // If we've got a monster for this selection type then we set the GM variables for the name
                // and stamina requirements
                monsterlink = $u.setContent(firstUnderMax, firstOverAch);
                if (monsterlink) {
					whichStat = monsterlink.indexOf('raid') >=0 ? 'raid' : 'battle_monster';
                    target[whichStat] = monsterlink;
                }
            });

            state.setItem('targetFromMonster', target.battle_monster);
            state.setItem('targetFromraid', target.raid);
            state.setItem('targetFromFortify', target.fortify);
			
            return true;
        } catch (err) {
            con.error("ERROR in monster.select: " + err.stack);
            return false;
        }
    };

    monster.menu = function() {
        try {
            var XMonsterInstructions = "Start attacking if stamina is above this point",
                XMinMonsterInstructions = "Do not attack if stamina is below this point",
                attackOrderInstructions = "List of search words that decide which monster to attack first. " + "Use words in player name or in monster name. To specify max damage follow keyword with " +
                    ":max token and specifiy max damage values. Use 'k' and 'm' suffixes for thousand and million. " + "To override achievement use the ach: token and specify damage values.",
                fortifyInstructions = "Fortify if ship health is below this % (leave blank to disable)",
                questFortifyInstructions = "Do quests if ship health is above this % and quest mode is set to Not Fortify (leave blank to disable)",
                stopAttackInstructions = "Do not attack if ship health is below this % (leave blank to disable)",
                monsterachieveInstructions = "Check if monsters have reached achievement damage level first. Switch when achievement met.",
                powerattackInstructions = "Use power attacks. Only do normal attacks if power attack not possible",
                powerattackMaxInstructions = "Use maximum power attacks globally on Skaar, Genesis, Ragnarok, and Bahamut types. Only do normal power attacks if maximum power attack not possible",
                useTacticsInstructions = "Use the Tactics attack method, on monsters that support it, instead of the normal attack. You must be level 50 or above.",
                useTacticsThresholdInstructions = "If monster health falls below this percentage then use the regular attack buttons instead of tactics.",
                collectRewardInstructions = "Automatically collect monster rewards.",
                strengthenTo100Instructions = "Do not wait until the character class gets a bonus for strengthening but perform strengthening as soon as the energy is available.",
                healPercStamInst = "After I hit a monster, heal my damage until the health is at least as high as when I started, or up to this percent of my stamina spent. If energy is not available to heal, monsters will not be hit.",
                mbattleList = ['Stamina Available', 'At Max Stamina', 'At X Stamina', 'Stay Hidden', 'Review Only', 'Never'],
                mbattleInst = [
                    'Stamina Available will attack whenever you have enough stamina',
                    'At Max Stamina will attack when stamina is at max and will burn down all stamina when able to level up',
                    'At X Stamina you can set maximum and minimum stamina to battle',
                    'Stay Hidden uses stamina to try to keep you under 10 health so you cannot be attacked, while also attempting to maximize your stamina use for Monster attacks. YOU MUST SET BATTLE WHEN TO "STAY HIDDEN" TO USE THIS FEATURE.',
                    'Reviews Only will only review, siege, collect, clear etc. according to settings',
                    'Never - disables attacking monsters'],
                fortifyList = ['Energy Available', 'At Max Energy', 'At X Energy', 'Never'],
                fortifyInst = [
                    'Energy Available will fortify whenever you have enough energy',
                    'At Max Energy will fortify when energy is at max and will burn down all energy when able to level up',
                    'At X Energy you can set maximum and minimum energy to fortify',
                    'Never - disables fortifying monsters'],
                stunList = ['Immediately', '5', '4', '3', '2', '1', 'Never'],
                stunInst = [
                    'Cripple/Deflect will be as soon as possible',
                    'Cripple/Deflect will be when 5 hours are left, plus or minus up to 30 min',
                    'Cripple/Deflect will be when 4 hours are left, plus or minus up to 30 min',
                    'Cripple/Deflect will be when 3 hours are left, plus or minus up to 30 min',
                    'Cripple/Deflect will be when 2 hours are left, plus or minus up to 30 min',
                    'Cripple/Deflect will be when 1 hours are left, plus or minus up to 30 min',
                    'Cripple/Deflect is disabled'],
                siegeList = ['Never', '1', '50', '250'],
                siegeInst = [
                    'Never siege monsters',
                    'Siege monsters only for one point of stamina, will not siege unless 1st siege has been launched',
                    'Siege monsters for up to 50 stamina, will not siege unless 1st siege has been launched',
                    'Siege monsters for up to 250 stamina, will not siege unless 1st siege has been launched'],
                delayStayHiddenInstructions = "Delay staying hidden if \"safe\" to wait for enough stamina to attack monster.",
                htmlCode = '';

            htmlCode += caap.startToggle('Monster', 'MONSTER');
            htmlCode += caap.makeDropDownTR("Attack When", 'WhenMonster', mbattleList, mbattleInst, '', 'Never', false, false, 62);
            htmlCode += caap.display.start('WhenMonster', 'isnot', 'Never');
            htmlCode += "<div id='caap_WhenMonsterStayHidden_hide' style='color: red; font-weight: bold; display: ";
            htmlCode += (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden' ? 'block' : 'none') + "'>";
            htmlCode += "Warning: Battle Not Set To 'Stay Hidden'";
            htmlCode += "</div>";
            htmlCode += caap.display.start('WhenMonster', 'is', 'At X Stamina');
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XMonsterStamina', XMonsterInstructions.replace('stamina','energy'), 1, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinMonsterStamina', XMinMonsterInstructions.replace('stamina','energy'), 0, '', '', true, false);
            htmlCode += caap.display.end('WhenMonster', 'is', 'At X Stamina');
            htmlCode += caap.display.start('WhenMonster', 'is', 'Stay Hidden');
            htmlCode += caap.makeCheckTR("Delay hide if \"safe\"", 'delayStayHidden', true, delayStayHiddenInstructions, true);
            htmlCode += caap.display.end('WhenMonster', 'is', 'Stay Hidden');
            //htmlCode += caap.makeNumberFormTR("Monster delay secs", 'seedTime', monsterDelayInstructions, 300, '', '');
            htmlCode += caap.makeCheckTR("Use Tactics", 'UseTactics', false, useTacticsInstructions);
            htmlCode += caap.display.start('UseTactics', 'is', true);
            htmlCode += caap.makeNumberFormTR("Health threshold", 'TacticsThreshold', useTacticsThresholdInstructions, 75, '', '', true, false);
            htmlCode += caap.display.end('UseTactics', 'is', true);
            htmlCode += caap.makeCheckTR("Power Attack Only", 'PowerAttack', true, powerattackInstructions);
            htmlCode += caap.display.start('PowerAttack', 'is', true);
            htmlCode += caap.makeCheckTR("Power Attack Max", 'PowerAttackMax', false, powerattackMaxInstructions, true);
            htmlCode += caap.display.end('PowerAttack', 'is', true);
            htmlCode += caap.makeDropDownTR("Siege up to", 'siegeUpTo', siegeList, siegeInst, '', 'Never', false, false, 62);
            htmlCode += caap.makeCheckTR("Collect Monster Rewards", 'monsterCollectReward', false, collectRewardInstructions);
            htmlCode += caap.makeCheckTR("Clear Complete Monsters", 'clearCompleteMonsters', false, '');
            //htmlCode += caap.makeCheckTR("Battle Conquest Monsters", 'conquestMonsters', false, '');
            htmlCode += caap.makeCheckTR("Achievement Mode", 'AchievementMode', true, monsterachieveInstructions);
            htmlCode += caap.makeNumberFormTR("Heal My Damage Up to % of Stamina Used", 'HealPercStam', healPercStamInst, 20, '', '');
            htmlCode += caap.makeDropDownTR("Fortify for Others When", 'WhenFortify', fortifyList, fortifyInst, '', 'Never', false, false, 62);
            htmlCode += caap.display.start('WhenFortify', 'isnot', 'Never');
            htmlCode += caap.display.start('WhenFortify', 'is', 'At X Energy');
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XFortifyEnergy', XMonsterInstructions, 1, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinFortifyEnergy', XMinMonsterInstructions, 0, '', '', true, false);
            htmlCode += caap.makeCheckTR("Do not wait for Strengthen phase", 'StrengthenTo100', true, strengthenTo100Instructions);
            htmlCode += caap.display.end('WhenFortify', 'is', 'At X Energy');
            htmlCode += caap.makeNumberFormTR("Fortify If % Under", 'MaxToFortify', fortifyInstructions, 50, '', '');
            htmlCode += caap.makeNumberFormTR("Quest If % Over", 'MaxHealthtoQuest', questFortifyInstructions, 60, '', '');
            htmlCode += caap.display.end('WhenFortify', 'isnot', 'Never');
            htmlCode += caap.makeNumberFormTR("No Attack If % Under", 'MinFortToAttack', stopAttackInstructions, 10, '', '');
            htmlCode += caap.makeDropDownTR("Cripple/Deflect when", 'WhenStun', stunList, stunInst, '', 'Immediately', false, false, 62);
            htmlCode += caap.makeTD("Attack Monsters in this order <a href='http://caaplayer.freeforums.org/attack-monsters-in-this-order-clarified-t408.html' target='_blank' style='color: blue'>(INFO)</a>");
            htmlCode += caap.makeTextBox('orderbattle_monster', attackOrderInstructions, '', '');
            htmlCode += caap.display.end('WhenMonster', 'isnot', 'Never');
            htmlCode += caap.makeCheckTR("Enable Labels", 'monsterEnableLabels', true, "When enabled then the damage and fortify bars will display percentage labels.");
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in monster.menu: " + err.stack);
            return '';
        }
    };

	monster.dashboard = {
		name: 'Monster',
		inst: 'Display your Monster battles',
		records: 'monster',
		filterF: function(cM) {
			return cM.state != 'Join';
		},
		buttons: [{name: 'Refresh Monster List',
			func: function() {
				monster.fullReview();
			}
		}],
		tableTemplate: {
			colorF: function(cM) {
				return cM.link === state.getItem('targetFromFortify', '') ? 'blue' : 
					cM.link === state.getItem('targetFromMonster', '') || cM.link === state.getItem('targetFromraid', '') ? 'green' :
					cM.color;
				}
		},
		tableEntries: [
			{name: 'Summoner', color: 'blue', 
				valueF: function(cM) {
					var link = caap.domain.altered + '/' + cM.link;
					return '<a href="' + link + '" onclick="ajaxLinkSend(\'globalContainer\', \'' + cM.link + '\'); ' + 
						' return false;" style="text-decoration:none;font-size:9px;">' +
						cM.userName + '</a>';
			}},
			{name: 'Monster', color: 'blue', 
				valueF: function(cM) {
					var link = caap.domain.altered + '/' + cM.link;
					return '<a href="' + link + '" onclick="ajaxLinkSend(\'globalContainer\', \'' + cM.link + '\'); ' + 
						' return false;" style="text-decoration:none;font-size:9px;">' +
						cM.monster + '</a>';
			}},
			{name: 'Damage', format: 'SI',
				titleF: function(cM) {
					var achLevel = Number(monster.parseCondition('ach', cM.conditions)),
						maxDamage = monster.parseCondition('max', cM.conditions),
						title = "Stamina used: " + cM.spentStamina + " Energy used: " + cM.spentEnergy;
					
					if (achLevel) {
						title += " User Set Monster Achievement: " + achLevel.addCommas();
					} else if (config.getItem('AchievementMode', false)) {
						title +=  " Default Monster Achievement: " + monster.getInfo(cM, 'ach').addCommas();
						title += cM.page === 'festival_battle_monster' ? " Festival Monster Achievement: " + monster.getInfo(cM, 'festival_ach').addCommas() : '';
					} else {
						title += " Achievement Mode Disabled";
					}

					title += $u.hasContent(maxDamage) && $u.isNumber(maxDamage) ? " - User Set Max Damage: " + maxDamage.addCommas() : '';
					return title;
			}},
			{name: 'Life%', value: 'life', 
				titleF: function(cM) {
					return "Percentage of monster life remaining: " + cM.life + "%";
			}},
			{name: 'Fort%', value: 'fortify', format: 'nonnegative',
				titleF: function(cM) {
					return (config.getItem('HealPercStam', 20) && cM.debtStamina > 0 ? 'Stamina debt: ' + cM.debtStamina + ' or until Fort % > ' + cM.debtStart + ' ' : '') +"Percentage of party health/monster defense: " + cM.fortify + "%";
			}},
			{name: 'Str%', value: 'strength', format: 'nonnegative',
				titleF: function(cM) {
					return "Percentage of party strength: " + cM.strength + "%";
			}},
			{name: 'Time', format: 'time',
				titleF: function(cM) {
					return "Total Monster Duration: " + monster.getInfo(cM, 'duration', 168) + " hours";
			}},
			{name: 'T2K', format: 'time',
				titleF: function(cM) {
					return "Estimated Time To Kill: " + cM.t2k + " hours:mins";
			}},
			{name: 'Phase',
				valueF: function(cM) {
					return !['Attack', 'Join'].hasIndexOf(cM.state) ? cM.state : cM.phase >= 0 ?
						cM.phase + "/" + monster.getInfo(cM, 'siege') + " need " + cM.miss +' next ' + cM.siegeLevel  : '';
				},
				titleF: function(cM) {
					return "Siege: on " + cM.phase +  " of " + monster.getInfo(cM, 'siege') + " phases, need " + cM.miss + ' more clicks. Next click costs ' + cM.siegeLevel;
			}},
			{name: '&nbsp;', color: 'blue', format: 'unsortable',
				valueF: function(cM) {
					return '<span title="User Set Condition string: ' + $u.setContent(cM.fullC, cM.jFullC) +
						'" class="ui-icon ui-icon-info">i</span>';
			}},
			{name: 'name', type: 'remove'}
		]
	};
	
}());
