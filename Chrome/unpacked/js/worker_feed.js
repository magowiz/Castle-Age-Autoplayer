/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global $j,$u,caap,config,con,feed:true,schedule,stats,state,worker,ignoreJSLintError,
chores,town,general,session,monster:true */
/*jslint maxlen: 256 */

    ////////////////////////////////////////////////////////////////////
    //                          feed OBJECT
    // this is the main object for dealing with feed records
    /////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

	worker.add('feed');
	
    feed.init = function() {
		try {
			// Fill out dashboard with monster dash entries
			feed.dashboard = $j.extend(true, {}, monster.dashboard, feed.dashboard);
			feed.dashboard.tableEntries[2] = {name: 'Score', value: 'score', format: 'number'};
				
			if (!config.getItem('enableMonsterFinder', false)) {
				return false;
			}
			var keeps = config.getItem('feedKeeps', ''); 
			
			worker.addPageCheck({page : 'public_monster_list.php?monster_tier=2', config: 'feedLowTier', cFreq: 'feedLowTierFreq', type: 'findKeep'});
			worker.addPageCheck({page : 'public_monster_list.php?monster_tier=3', config: 'feedMediumTier', cFreq: 'feedMediumTierFreq', type: 'findKeep'});
			worker.addPageCheck({page : 'public_monster_list.php?monster_tier=4', config: 'feedHighTier', cFreq: 'feedHighTierFreq', type: 'findKeep'});
			worker.addPageCheck({page : 'guild_priority_mlist.php', config: 'feedGuild', cFreq: 'feedGuildFreq', type: 'findKeep'});
			if (!$u.hasContent(keeps.trim())) {
				return true;
			}
			$u.setContent(keeps.regex(/(\d+:\d)/g), []).forEach( function(k) {
				worker.addPageCheck({page : 'battle_monster.php?casuser=' + k.regex(/(\d+):/) + '&mpool=' + k.regex(/:(\d)/), hours: 1, type: 'findKeep'});
			});
				
			return true;
		} catch (err) {
			con.error("ERROR in feed.init: " + err.stack);
			return false;
		}
	};
	
	feed.unpause = function() {
		worker.deletePageCheck({type : 'findKeep'});
		feed.init();
	};
	
	feed.checkResults = function(page, resultsText) {
        try {
			var pR = {},
				tempDiv = $j(),
				found = false,
				deleteLand = false,
				sO = $u.setContent(feed.sO, {}),
				hours = 0;
				
			switch (page) {
			case 'keep' : 
				if (!$u.hasContent($j('img[src*="keep_plus.jpg"][onclick*="Items"]:visible'))) {
					schedule.setItem('findKeep', Date.now());
					state.getItem('feedPicOwned', '').split('\n').forEach( function(p) {
						if (!$u.hasContent(p)) {
							return;
						}
						var picDiv = $j('img[src*="' + p + '"]');
						if ($u.hasContent(picDiv)) {
							pR = town.getRecord(picDiv.attr('src').regex(/(\w+\.\w+)$/));
							pR.name = picDiv.attr('alt');
							pR.owned = picDiv.closest('div').next().text().innerTrim().trim().regex(/(\d+)/);
							town.setRecord(pR);
						}
					});
					state.getItem('feedNameOwned', '').split('\n').forEach( function(p) {
						if (!$u.hasContent(p)) {
							return;
						}
						var nameDiv = $j('img[alt]').filter(function() {
							return this.alt.toLowerCase() == p.toLowerCase();
						});
						if ($u.hasContent(nameDiv)) {
							pR = town.getRecord(nameDiv.attr('src').regex(/(\w+\.\w+)$/));
							pR.name = nameDiv.attr('alt');
							pR.owned = nameDiv.closest('div').next().text().innerTrim().trim().regex(/(\d+)/);
							town.setRecord(pR);
						}
					});
				}
				break;
			case 'quests' :
				if (sO.mpool) {
					tempDiv = $j('#app_body tr .quest_desc').has('img[src*="' + sO.missing + '"]');
					found = $u.hasContent(tempDiv);
					
					if (resultsText.match(/You have acquired/)) {
						delete sO.land;
						delete sO.energy;
					} else if (!$u.hasContent($j('#app_body a[href*="quests.php?land=' + sO.land + '"]')) || (found &&
							(caap.hasImage("boss_locked.jpg") || $u.hasContent($j('a[onclick*="PositionAndDisplayPopupBox"]', tempDiv))))) {
						schedule.setItem(sO.mTimer, 36 * 3600);
						con.warn('Unable to find quest to summon ' + sO.mName + ' orb');
						deleteLand = true;
					} else if (found) {
						// Have enough energy?
						sO.energy = tempDiv.text().regexd(/(\d+) Energy/, 0);
						con.log(2, 'Found quest for ' + sO.mName + ' orb in quest land ' + sO.land);
					} else {
						// Check the next quest page
						sO.land += 1;
						con.log(2, 'Look for ' + sO.mName + ' orb in next quest land ' + sO.land);
					}
					if (deleteLand) {
						state.deleteItem(sO.name);
					} else {
						state.setItem(sO.name, sO);
					}
				}
				break;
			case 'monster_summon_list' :
				//You have already summoned a monster, The Emerald Sea Serpent, or the timer has not run out on the previous monster you have summoned, try again soon. Go to the Monster Battle Page to engage your summoned bosses and monsters.
				//You have already summoned a monster, The Emerald Sea Serpent, or the timer has not run out on the previous monster you have summoned, try again in 55 hour(s) Go to the Monster Battle Page to engage your summoned bosses and monsters.
				// You are missing some item(s) to perform this alchemy!
				hours = resultsText.regex(/try again in (\d+) hour/);
				if (sO.mpool) {
					if (resultsText.match(/Attack .* now/)) {
						monster.setrPage('player_monster_list','review', 0);
					} else if (hours) {
						schedule.setItem('feed' + sO.mpool, hours * 3600);
					} else if (resultsText.match(/try again soon/)) {
						schedule.setItem('feed' + sO.mpool, 7 *3600);
					}
				}
				break;
			default : 
				break;
			}
			feed.sO = {};
        } catch (err) {
            con.error("ERROR in town.checkResults: " + err.stack);
            return false;
        }
    };

	// Takes monster object. Adds conditions to monster object if valid
	// If a match, scores the monster. If joinable with a positive score returns true.
    feed.joinable = function(cM) {
		try {
			var matched = false,
				conditions;
			
			config.getItem('feedFilter', 'all').split('\n').some( function(item) {
				item = item.trim();
				if (item.length && 
					(item.regex(/(^all\b)/) || cM.name.toLowerCase().hasIndexOf(item.replace(/:.*/, '').toLowerCase()))) {
					conditions = item.replace(/^[^:]+/i, '').trim() + ':';
					if ((conditions.regex(/(:conq)\b/) && !cM.link.hasIndexOf("guildv2_battle_monster.php")) ||
								(conditions.regex(/(:!conq)\b/) && cM.link.hasIndexOf("guildv2_battle_monster.php"))) {
						return false;
					}
					cM.joinConditions = conditions;
					cM.jFullC = item;
					matched = feed.scoring(cM);
					return true;
				}
			});
			return cM.damage > 0 ? false : matched;
		} catch (err) {
			con.error("ERROR in feed.addConditions: " + err.stack);
			return false;
		}
	};
	
	worker.addAction({worker : 'feed', priority : 200, description : 'Finding Monsters'});
    feed.worker = function() {
		try {
            if (!config.getItem('enableMonsterFinder', false)) {
                return false;
            }
			var slice = $j("#app_body"),
				tR = false,
				link = 'ajax:',
				plus = '',
				page = session.getItem('page', ''),
				attackButton = '',
				hasClass = function(charClass) {
					return $u.hasContent($j('#choose_class_screen .banner_' + charClass.toLowerCase() + ' input[src*="nm_class_select.gif"]', slice));
				},
				result,
				charStats = stats.character,
				currentGeneralObj = general.getRecord(general.current),
				joinable = function(cM) {
					return cM.join && cM.state == 'Join';
				},
				reviewInterval = Math.max(1, config.getItem('feedScan', false) ? config.getItem("feedMonsterReviewHrs", 6) : 365 * 24) * 3600,
				attackReady = false;
			
			// Check on achievements
			if (chores.checkPages('achievements') || (general.records.length < 21 && chores.checkPages('generals'))) {
				return true;
			}
			
			// Check on item inventory
			if (schedule.since('findKeep', 24 * 3600) && (state.getItem('feedPicOwned',false) || state.getItem('feedNameOwned',false))) {
				if (page == 'keep') {
					$j('img[src*="keep_plus.jpg"][onclick*="Items"]:visible').click();
					caap.setDomWaiting('keep.php');
					caap.clearDomWaiting();
					caap.checkResultsTop();
					return true;
				}
				return caap.navigateTo('keep');
			}
			
			// Scan monsters
			tR = monster.records.filter(joinable).reduce( function(previous, tarM) {
				return tarM.score > previous.score ? tarM : previous;
			}, {'score' : 0, conditions : ''});
			attackReady = tR.score && stats.stamina.num > tR.listStamina[0];
			
			if (!attackReady || !tR.joinConditions.match(/:burn\b/)) {
				result = monster.records.some( function(cM, i) {
					//con.log(2, 'SCAN1', cM, cM.hide, cM.state, schedule.since(cM.review, reviewInterval));
					if (!cM.hide && cM.state == 'Join' && cM.joinConditions.length) {
						if (cM.canPri && monster.parseCondition("pri", cM.joinConditions) &&
							monster.parseCondition("pri", cM.joinConditions) > cM.time && schedule.check('monsterPriorityWait')) {
							cM.review = 0;
							plus = '&action=commitPriorityMonster';
							con.log(1, 'Making my feed monster ' + cM.name + ' priority', cM);
						} else if (cM.canPub && monster.parseCondition("pub", cM.joinConditions) &&
							monster.parseCondition("pub", cM.joinConditions) > cM.time) {
							cM.review = 0;
							plus = '&action=makeMonsterPublic';
							con.log(1, 'Making my feed monster ' + cM.name + ' public', cM);
						}
						if (schedule.since(cM.review, attackReady ? 3600 : reviewInterval)) {
							con.log(1, 'Scanning ' + (i + 1) + '/' + monster.records.length + ' ' + cM.name, cM.link, cM);
							feed.scanRecord = cM;
							feed.isScan = true;
							caap.navigate2('ajax:' + cM.link + plus);
							monster.lastClick = cM.link;
							return true;
						}
					}
				});
				if (result) {
					return true;
				}
			}
			
			feed.isScan = false;
			feed.scanRecord = {};

			if (attackReady) {
				link += tR.link;
				if (tR.charClass) {
					if ($j("div[id='choose_class_screen']", slice).length) {
						if ($u.hasContent(monster.characterClass[tR.charClass.ucWords()]) && hasClass(tR.charClass)) {
							result = tR.charClass;
						} else {
							result = Object.keys(charStats).filter(hasClass).reduce(function(previous, key) {
								if (charStats[key].percent < 100 && charStats[key].level + charStats[key].percent / 100 >
									charStats[previous].level + charStats[previous].percent / 100) {
									return key;
								}
								return previous;
							}, hasClass('Warlock') ? 'Warlock' : 'Cleric');
						}
						link = 'clickjq:#choose_class_screen .banner_' + result.toLowerCase() + ' input[src*="nm_class_select.gif"]';
						con.log(1, 'Joining ' + tR.name + ' with class ' + result, tR, link);
					} else {
						link += ",clickimg:battle_enter_battle.gif";
					}
				} else {
					link += tR.targetPart > 0 ? (",clickjq:#app_body #monster_target_" +
				tR.targetPart + " img[src*='multi_selectbtn.jpg'],jq:#app_body #expanded_monster_target_" + tR.targetPart + ":visible") : '';
				}
				
				if (general.Select('MonsterGeneral')) {
					return true;
				}
			
				con.log(1, 'Joining ' + tR.name, tR, link);
				result = caap.navigate2(link);
				if (result === 'fail') {
					return caap.navigate2('player_monster_list');
				} 
				if (result === 'done') {
					currentGeneralObj.charge = currentGeneralObj.charge == 100 ? 0 : currentGeneralObj.charge;
					monster.lastClick = tR.link;
				} else if (!result && !tR.charClass) {
					monster.powerButtons.some( function(button) {
						attackButton = caap.checkForImage(button);
						return $u.hasContent(attackButton);
					});
					if ($u.hasContent(attackButton)) {
						caap.click(attackButton);
						monster.lastClick = tR.link;
						return true;
					}
					con.warn('Unable to find attack button to join ' + tR.name + ', deleting record');
					monster.deleteRecord(tR);
				}

				return result;
			}
			
			// Check on summoning a monster
			result = config.getItem('feedFilter', 'all').split('\n').some( function(item) {
				if (!item.match(/\w/)) {
					return false;
				}
				var sumEval = (item+ ':').regex(/:sum\d+\[(.*?)\]:/),
					mpool = item.regex(/:sum(\d+)\[/),
					poolTimer = 'feed' + mpool,
					mName = item.trim().replace(/:.*/, ''),
					mTimer = 'feed' + mName,
					text,
					sOname = 'feedSummonObj' + mpool,
					sO = state.getItem(sOname, {}),
					poolReg = new RegExp ('user=' + stats.FBID + '&mpool=(' + mpool + ')\\b'),
					poolFull = monster.records.flatten('link').listMatch(poolReg),
					tempDiv, missingDiv, formsDiv, which, tab,
					summonName = monster.getInfo(mName, 'summonAlias', mName);
				
				if (!sumEval || poolFull || !schedule.check(poolTimer) || !schedule.check(mTimer) ||
						$u.setContent(sO.energy, 0) > stats.energy.num ) {
					return false;
				}
			
				// Pull a blank record for scoring
				tR = monster.getRecord('1');
				tR.monster = mName;
				tR.joinConditions = item;
				if (!feed.scoring(tR, sumEval)) {
					return false;
				}
				sO = $j.extend({tab : 1, monster : mName, mpool : mpool, name : sOname, mTimer : mTimer},
						sO.monster == mName ? sO : {});
						
				if (!$u.isDefined(sO.land)) {
					if (page != 'monster_summon_list') {
						con.log(1, 'Going to summon monster page to summon ' + mName, item);
						return caap.ajaxLink('monster_summon_list');
					}
					tab = $u.setContent($j('img[id*="summonTab_"][src*="_on.gif"]:visible').attr('id'), '').regex(/_(\d)/);

					if (tab == sO.tab) {
						tempDiv = $j('#app_body div[id*="monster_summon_"]:contains("Summon:"):contains("' + summonName + '")');
						if ($u.hasContent(tempDiv)) {
							missingDiv = $j('div[class*="missing recipeImgContainer"]', tempDiv);
							formsDiv = $j('form[onsubmit*="monster_summon_list"]', tempDiv);
							which = !$u.hasContent(missingDiv) ? 0 : formsDiv.length == 2 ? 1 : false;
							if (which !== false) {
								sO.energy = tempDiv.last().text().trim().innerTrim().regexd(/-(\d+)/, 0);
								if (sO.energy > stats.energy.num && (which == 0 || $u.hasContent(missingDiv))) {
									state.setItem(sOname, sO);	
									return false;
								}
								caap.ajaxLink('monster_summon_list.php?' + formsDiv.eq(which).serialize());
								feed.sO = sO;
								state.setItem(sOname, sO);
								con.log(1, 'Summoning ' + mName, item);
								return true;
							}	
							sO.land = 1;
							sO.missing = $j('img', missingDiv).attr('src').regex(/.*\/(\w+\.\w+)/);
						} else {
							sO.tab += 1;
						}
					}
					if (sO.tab > 6) {
						schedule.setItem(mTimer, 36 * 3600);
						con.warn('Unable to find match to summon ' + mName, item);
						state.deleteItem(sOname);
						return false;
					}
					if (tab != sO.tab) {
						state.setItem(sOname, sO);
						caap.click($j('img[id*="summonTab_' + sO.tab + '"]:visible'));
						con.log(1, 'Searching summon tabs for ' + mName, item);
						return true;
					}
				}
				// Are we looking for the orb?
				if ($u.isDefined(sO.land)) {
					// On right page?
					if (!session.getItem('clickUrl','').hasIndexOf('quests.php?land=' + sO.land)) {
						state.setItem(sOname, sO);
						con.log(1, 'Looking for ' + mName + ' orb in quest land ' + sO.land, item);
						return caap.ajaxLink('quests.php?land=' + sO.land);
					}
					// Orb on this page?
					tempDiv = $j('#app_body tr .quest_desc').has('img[src*="' + sO.missing + '"]');
					if ($u.hasContent(tempDiv)) {
						// Have enough energy?
						text = tempDiv.text().trim().innerTrim();
						sO.energy = text.regexd(/(\d+) Energy/, 0);
						if (sO.energy > stats.energy.num || text.regexd(/(\d+) Experience/, 0) >= stats.exp.dif) {
							state.setItem(sOname, sO);	
							return false;
						}
						feed.sO = sO;
						caap.navigate3('quests', 'quests.php?' + tempDiv.find('form').serialize(), 'QuestGeneral');
						state.setItem(sOname, sO);
						con.log(1, 'Doing quest for ' + mName + ' orb in quest land ' + sO.land, item);
						return true;
					}
					// Check the next quest page
					sO.land = Number(sO.land) + 1;
					state.setItem(sOname, sO);
					feed.sO = sO;
					con.log(1, 'Looking for ' + mName + ' orb in next quest land ' + sO.land, item);
					return caap.ajaxLink('quests.php?land=' + sO.land);
				}
			});
			
			return result;

		} catch (err) {
			con.error("ERROR in feed.scan: " + err.stack);
			return false;
		}
	};

	// Saves score, join, and charClass in CM and returns true if has score and positive
    feed.scoring = function(cM, summon) {
		try {
			var temp,
				evalTxt,
				filterok = true,
				userid = stats.FBID,
				life = cM.life,
				t2k = cM.t2k,
				fortify = cM.fortify,
				strength = cM.strength,
				dp = stats.monster.dp,
				same = monster.records.filter( function(obj) {
					return obj.monster == cM.monster && obj.state == 'Attack';
				}).length,
				sameundermax = monster.records.filter( function(obj) {
					return obj.monster == cM.monster && obj.state == 'Attack' && obj.over != 'max';
				}).length,
				undermax = monster.records.filter( function(obj) {
					return obj.state == 'Attack' && obj.over != 'max';
				}).length,
				mainonly = life == 100 || cM.mainOnly,
				targetpart = cM.targetPart,
				parts = cM.partsHealth,
				time = cM.time,
				name = cM.name,
				monstername = cM.monster,
				damagemod = fortify > 0 ? 58 * fortify / 100 * (strength > 0 ? strength : 100) / 100 + 42 : 0,
				rogue = 'Rogue',
				warlock = 'Warlock',
				warrior = 'Warrior',
				mage = 'Mage',
				cleric = 'Cleric',
				ranger = 'Ranger',
				levelup = caap.inLevelUpMode(),
				energy = stats.energy.num,
				atmaxenergy = stats.energy.num >= caap.maxStatCheck('energy'),
				atmaxstamina = stats.stamina.num >= caap.maxStatCheck('stamina'),
				stamina = stats.stamina.num,
				exp = stats.exp.dif,
				killed = monster.getInfo(cM.monster, 'achTitle', false),
				achnum = monster.getInfo(cM.monster, 'achNum'),
				picowned = function(pic) {
					state.setItem('feedPicOwned', state.getItem('feedPicOwned', '').split('\n').addToList(pic).join('\n'));
					return town.getRecordVal(pic, 'owned', 0);
				},
				needpic = function(pic, want) {
					return want > picowned(pic) + same;
				},
				nameowned = function(name) {
					state.setItem('feedNameOwned', state.getItem('feedNameOwned', '').split('\n').addToList(name).join('\n'));
					return town.records.getObjByFieldLc('name', name.toLowerCase(), {owned: 0}).owned;
				},
				needname = function(name, want) {
					name = name.regexd(/([\w' ]+)/g, []);
					return name.reduce( function(p, c) {
						return Math.max(p, want - nameowned(c.trim()) - same);
					}, 0);
				},
				hasgeneral = function(g) {
					return general.hasRecord(g);
				},
				// r = result of recipe, nr = number wanted, or 'g' for a general, i = ingredients, and nr = number of ingredients per item
				needrecipe = function(r, nr, i, ni) { 
					return nr == 'g' ? !hasgeneral(r) && needname(i, ni) : needname(i, (nr - nameowned(r)) * ni);
				},
				userdamage = function(userId, damage) {
					state.setItem('feedUserId', state.getItem('feedUserId', '').split('\n').addToList(name).join('\n'));
					return $u.setContent(cM.userDamage.regex(new RegExp('\\b' + userId + ':(\\d+)')), 0) >= damage;
				},
				keep = worker.pagesList.flatten('page').hasIndexOf('ajax:' + cM.link),
				guild = cM.lpage == 'guild_priority_mlist',
				mine = cM.link.regex(new RegExp ('user=(' + stats.FBID + ')\\b')),
				achleft = 0,
				conq = monster.isConq(cM),
				achrecords = stats.achievements.monster,
				main = killed ? achrecords[killed + "'s Main"] : Object.keys(achrecords).reduce(function(previous, current) {
					return previous || (current.hasIndexOf(cM.monster) && current.match(/'s Main/) ? achrecords[current] : 0);
				}, 0),
				mainleft = 5 > main + same;

			ignoreJSLintError(filterok, userid, life, t2k, dp, sameundermax, undermax, targetpart, parts, time, monstername, damagemod,
				rogue, warlock, cleric, warrior, mage, ranger, levelup, energy, atmaxenergy, atmaxstamina, exp, needpic, needrecipe, userdamage, keep, mainonly, mainleft, guild, achleft);
				
			killed = killed ? achrecords[killed] : Object.keys(achrecords).reduce(function(previous, current) {
				return previous || (current.hasIndexOf(cM.monster) && !current.match(/'s/) ? achrecords[current] : 0);
			}, 0);
			achleft = achnum > killed + same;

			/*jslint evil: true */
			
			evalTxt = cM.joinConditions.regex(/:f\[(.*?)\]:/);
			if ($u.hasContent(evalTxt) && !eval(evalTxt)) {
				cM.join = false;
				filterok = false;
				if (!summon) {
					con.log(2, cM.name +  ' filtered out by string ' + evalTxt + ' as FALSE', cM.joinConditions, cM);
					return mine || conq;
				}
			}
			if (summon) {
				return eval(summon);
			}
				
			evalTxt = cM.joinConditions.regex(/:j\[(.*?)\]:/);
			if ($u.hasContent(evalTxt)) {
				temp = (cM.listStamina.length ? Math.max(cM.listStamina[0], 5) : 5);
				cM.join = eval(evalTxt) && stamina > temp;
				evalTxt = cM.joinConditions.regex(/:s\[(.*?)\]:/);
				cM.score = (Number(eval(evalTxt))).dp(2);
				if (session.getItem('clickUrl', '').hasIndexOf(cM.link)) {
					con.log(2, cM.name +  (cM.join ? ' Join candidate' : ' Do not join') + '. Score: ' + cM.score + ' Min stamina ' + temp, cM.joinConditions);
				}
				cM.color = cM.join ? 'green' : $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
				if (cM.score <=0) {
					return mine || conq;
				}
			}
			evalTxt = cM.joinConditions.regex(/:c\[(.*?)\]:/);
			if (cM.charClass !== false && $u.hasContent(evalTxt)) {
				cM.charClass = eval($u.setContent(evalTxt, 'Warlock'));
				con.log(1, 'Class to be set: ' + cM.charClass, evalTxt);
			}
			/*jslint evil: false */
			
			return true;

		} catch (err) {
			con.error("ERROR in feed.scoring: " + err.stack);
			return false;
		}
	};

    feed.checkDeath = function(cM) {
		try {
			// Skip if the monster has already been read
			if (!monster.damaged(cM) || ['Done', 'Dead or Fled'].hasIndexOf(cM.state)) {
				return false;
			}
			feed.joinable(cM);
	
			if (cM.joinConditions.match(/\b(achleft|killed)\b/)) {
				schedule.deleteItem("page_achievements");
			}
			if (cM.joinConditions.match(/\b(picowned|nameowned|needname|needrecipe)\b/)) {
				schedule.deleteItem("findKeep");
			}
				
		} catch (err) {
			con.error("ERROR in feed.checkDeath: " + err.stack);
			return false;
		}
	};

	feed.dashboard = {
		name: 'Feed',
		inst: 'Display the monsters that are public or from your Guild Priority list',
		filterF: function(cM) {
			return cM.state == 'Join';
		},
		buttons: [{name: 'Clear Feed',
			func: function() {
				monster.fullReview('Feed');
			}
		}]
	};
	
    feed.menu = function() {
		try {
			var htmlCode = '',
				filterInstructions = "List of filters to decide what monsters to look for. ",
				keepInstruction = 'List of userid keeps and mpools to watch. Separate items by return or commas. ' + 
					"Format like, '100000666:3, 55000000012341234:3'",
				str = '';

			htmlCode += caap.startToggle('MonsterFinder', 'MONSTER FINDER');
			htmlCode += caap.makeCheckTR("Enable Monster Finder", 'enableMonsterFinder', false, "Find joinable monsters.");
			htmlCode += caap.display.start('enableMonsterFinder');
/*              htmlCode += caap.makeCheckTR('Do In Background', 'useAjaxMonsterFinder', true, "Check Monsters using AJAX rather than page navigation.");
			htmlCode += caap.makeCheckTR("Enable Live Feed", 'feedMonsterFinder', false, "Find monsters in the Live Feed.");
			htmlCode += caap.display.start('feedMonsterFinder');
			htmlCode += caap.makeNumberFormTR("Check every X mins", 'CheckFeedMonsterFinderMins', "Check the Live Feed every X minutes. Minimum 15.", 15, '', '', true);
			htmlCode += caap.display.end('feedMonsterFinder');
*/		
			['Low Tier', 'Medium Tier', 'High Tier', 'Guild'].forEach( function(t) {
				str = t.replace(' ', '');
				htmlCode += caap.makeCheckTR("Scan " + t, 'feed' + str, false, "Look for monsters in the " + t + " Feed.");
				htmlCode += caap.display.start('feed' + str);
				htmlCode += caap.makeNumberFormTR("Check every X mins", 'feed' + str + 'Freq', "Check the " + t + " feed every X minutes", 60, '', '', true);
				htmlCode += caap.display.end('feed' + str);
			});
			
			htmlCode += caap.makeCheckTR("Status Scan", 'feedScan', false, "Scan the feed monsters to check their status.");
			htmlCode += caap.display.start('feedScan');
			htmlCode += caap.makeNumberFormTR("Scan every X hours", 'feedMonsterReviewHrs', "Scan the feed monsters every X hours to check their status", 6, '', '', true);
			htmlCode += caap.display.end('feedScan');

			htmlCode += caap.makeTD("Filter and join monsters according to <a href='http://caaplayer.freeforums.org/auto-join-and-monster-finder-configs-t839.html' target='_blank' style='color: blue'>(INFO)</a>");
			htmlCode += caap.makeTextBox('feedFilter', filterInstructions, 'all');

			htmlCode += caap.makeTD("Keep Watch");
			htmlCode += caap.makeTextBox('feedKeeps', keepInstruction, '');

			htmlCode += caap.display.end('enableMonsterFinder');
			htmlCode += caap.endToggle;
			return htmlCode;
		} catch (err) {
			con.error("ERROR in feed.menu: " + err.stack);
			return '';
		}
	};

}());
