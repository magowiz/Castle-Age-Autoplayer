    ////////////////////////////////////////////////////////////////////
    //                          ARENA OBJECT
    // this is the main object for dealing with Arena VI
    /////////////////////////////////////////////////////////////////////

     arena = {
        menu: function () {
            var typeList = [
                'Invade',
                'Duel'
            ],
            typeInst = [
                'Battle using Invade button',
                'Battle using Duel button'
            ]
            MaxLevelInstructions = "This sets the highest relative level, above yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent above level 120, you would code 20.",
            MinLevelInstructions = "This sets the lowest relative level, below yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent below level 60, you would code 40.",

            htmlCode = caap.startToggle('Arena', 'ARENA');
            htmlCode += caap.makeCheckTR('Enable Arena Battles', 'enableArena', false, '');
            htmlCode += caap.makeDropDownTR("Battle Type", 'ArenaBattleType', typeList, typeInst, '', '', false, false, 62);
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'arenaTokenStart', '', 10, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'arenaTokenStop', '', 0, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Opponent's Army Max", 'arenaArmyMax', '', 501, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Opponent's Rank Min", 'arenaRankMin', '', '', '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Opponent's Rank Max", 'arenaRankMax', '', '', '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Opponent's Level Min", 'arenaLevelMin', MinLevelInstructions, '', '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Opponent's Level Max", 'arenaLevelMax', MaxLevelInstructions, '', '', '', true, false);
            htmlCode += caap.makeTD("<input type='button' id='caap_ArenaNow' value='Fight!' style='padding: 0; font-size: 10px; height: 18px' />");
            htmlCode += caap.endToggle;
            return htmlCode;
        },
        flagResult: false,
        click: function (battleButton) {
            try {
                session.setItem('ReleaseControl', true);
                arena.flagResult = true;
                caap.setDomWaiting("arena.php");
                caap.click(battleButton);
                return true;
            } catch (err) {
                con.error("ERROR in arena.click: " + err);
                return false;
            }
        },
        getResult: function () {
            try {
                var tempDiv       = $j(),
                    tempText      = '',
                    tNum          = 0,
                    battleRecord  = {},
                    warWinLoseImg = '',
                    result        = {
                        userId     : 0,
                        userName   : '',
                        battleType : '',
                        points     : 0,
                        gold       : 0,
                        win        : false,
                        hiding     : false,
                        unknown    : false
                    };

                if ($u.hasContent($j("img[src*='battle_victory.gif']"))) {
                    warWinLoseImg = 'war_win_left.jpg';
                    result.win = true;
                } else if ($u.hasContent($j("img[src*='battle_defeat.gif']"))) {
                    warWinLoseImg = 'war_lose_left.jpg';
                } else {
                    result.unknown = true;
                    con.warn("Unable to determine won or lost!");
                    return result;
                }

                if ($u.hasContent($j("input[src*='battle_invade_again.gif']"))) {
                    result.battleType = 'Invade';
                } else if ($u.hasContent($j("input[src*='battle_duel_again.gif']"))) {
                    result.battleType = 'Duel';
                } else {
                    if ($u.hasContent($j("img[src*='icon_weapon.gif']"))) {
                        result.battleType = 'Duel';
                    } else if ($u.hasContent($j("div[class='full_invade_results']"))) {
                        result.battleType = 'Invade';
                    }
                }

                if ($u.hasContent(result.battleType)) {
                    if ($u.hasContent($j("#app_body #results_main_wrapper"))) {
                        tempDiv = $j("img[src*='arena_battlepoints']").eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tempText = $u.setContent(tempDiv.parent().parent().text(), '').trim().innerTrim();
                            if ($u.hasContent(tempText)) {
                                tNum = tempText.regex(/(\d+)\s+Arena Points/i);
                                if ($u.hasContent(tNum)) {
                                    result.points = tNum;
                                } else {
                                    con.warn("Unable to match arena points", tempText);
                                }
                            } else {
                                con.warn("Unable to find arena points text in tempDiv.parent().parent()");
                            }
                        } else {
                            con.log(3, "Unable to find arena_battlepoints in $j('#app_body #results_main_wrapper')");
                        }

                        result.gold = 100000;   
    					// don't really care about the gold
                        /*tempDiv = $j("b[class*='gold']").eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tNum = $u.setContent(tempDiv.text(), '').trim().numberOnly();
                            if ($u.hasContent(tNum)) {
                                result.gold = tNum;
                            } else {
                                con.warn("Unable to find gold text in tempDiv");
                            }
                        } else {
                            con.warn("Unable to find gold element in $j('#app_body #results_main_wrapper')");
                        }*/

                        result.userId = state.getItem("lastArenaBattleID", 0);
                        result.userId = $j('form[id*="fight_opp_"]')[0].children[0].value;
                        result.userName = 'unknown';
						
						// There is no link to target's keep 
                        /*tempDiv = $j("a[href*='keep.php?casuser=']").eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tempText = $u.setContent(tempDiv.attr("href"), '');
                            if ($u.hasContent(tempText)) {
                                tNum = tempText.regex(/user=(\d+)/i);
                                if ($u.hasContent(tNum)) {
                                    result.userId = tNum;
                                } else {
                                    con.warn("Unable to match user's id in", tempText);
                                    throw "Unable to get userId!";
                                }

                                tempText = $u.setContent(tempDiv.text(), '').trim();
                                if ($u.hasContent(tempText)) {
                                    result.userName = tempText;
                                } else {
                                    con.warn("Unable to match user's name in", tempText);
                                }
                            } else {
                                con.warn("No href text in tempDiv");
                                throw "Unable to get userId!";
                            }
                        } else {
                            con.warn("Unable to find keep.php?casuser= in $j('#app_body #results_main_wrapper')");
                            throw "Unable to get userId!";
                        }*/

                    } else {
                        con.warn("Unable to find result div");
                        throw "Unable to get userId!";
                    }
                } else {
                    con.warn("Unable to determine battle type");
                    throw "Unable to get userId!";
                }
                battleRecord = battle.getItem(result.userId);
                battleRecord.attackTime = Date.now();
                if (result.userName && result.userName !== battleRecord.nameStr && result.userName !== 'unknown') {
                    con.log(1, "Updating battle record user name, from/to", battleRecord.nameStr, result.userName);
                    battleRecord.nameStr = result.userName;
                }

                if (result.win) {
                    battleRecord.statswinsNum += 1;
                } else {
                    battleRecord.statslossesNum += 1;
                }

                switch (result.battleType) {
                case 'Invade' :
                    if (result.win) {
                        battleRecord.invadewinsNum += 1;
                        battleRecord.ibp += result.points;
                    } else {
                        battleRecord.invadelossesNum += 1;
                        battleRecord.ibp -= result.points;
                        battleRecord.invadeLostTime = Date.now();
                    }

                    break;
                case 'Duel' :
                    if (result.win) {
                        battleRecord.duelwinsNum += 1;
                        battleRecord.dbp += result.points;
                    } else {
                        battleRecord.duellossesNum += 1;
                        battleRecord.dbp -= result.points;
                        battleRecord.duelLostTime = Date.now();
                    }
                    break;
                default :
                    con.warn("Battle type unknown!", result.battleType);
                }

                battle.setItem(battleRecord);
                return result;
            } catch (err) {
                con.error("ERROR in battle.getResult: " + err);
                return false;
            }
        },
        checkResults: function () {
            try {con.log (1, "in checkresults for arena");
                var battleRecord = {},
                    tempTime     = 0,
					arenaTokens = $j("span[id*='guild_token_current_value']")[0].innerHTML,
                    result       = {};
					
                if (!arena.flagResult) {
                    return true;
                }
					
				state.setItem("arenaTokens", arenaTokens);

				if (arenaTokens <= config.getItem("arenaTokenStop", 1)) {
					con.log (1, "Not enough tokens");
					schedule.setItem('arenaTimer', Math.max (config.getItem("arenaTokenStart", 1) - config.getItem("arenaTokenStop", 1), 0) * 5 * 60);
					return true;
				}

                con.log(2, "Checking Battle Results");
                arena.flagResult = false;
                state.setItem("arenaBattleChainId", 0);

                result = arena.getResult();
                if (!result || result.hiding === true) {
                    return true;
                }

                if (result.unknown === true) {
                    if (state.getItem("lastArenaBattleID", 0)) {
                        battleRecord = battle.getItem(arena.getItem("lastArenaBattleID", 0));
                        battleRecord.unknownTime = Date.now();
                        battle.getItem(battleRecord);
                    }

                    return true;
                }

                battleRecord = battle.getItem(result.userId);
                if (result.win) {
                    con.log(1, "We Defeated ", result.userName, "Battle Points: " + result.points + ", Gold: " + result.gold);
                    //Test if we should chain this guy
                    state.setItem("arenaBattleChainId", result.userId);
                    con.log(1, "Chain Attack:", result.userId, "Battle Points: " + result.points);
                } else {
                    con.log(1, "We Were Defeated By ", result.userName);
                    battleRecord.chainCount = 0;
                    battleRecord.chainTime = 0;
                }

                battle.setItem(battleRecord);
                return true;
            } catch (err) {
                con.error("ERROR in arena.checkResults: " + err);
                return false;
            }
        },

        battle: function () {con.log (1, "starting arena.battle");
            var minLevel = 0,
                maxLevel = 0,
                minRank = 0,
                maxRank = 0,
                useGeneral = '';
            if(caap.navigateTo('arena', 'battle_tab_arena_on.jpg')) {
                return true;
            }
con.log (1, "in arena.battle");
            var inputDiv = $j("div[style*='arena_infobar']"),
                arenaTokens = $j("span[id*='guild_token_current_value']")[0].innerHTML,
                battleRecord      = {},
                levelMultiplier   = 0,
                lastArenaBattleID = 0,
                safeTargets       = [];

            state.setItem("arenaTokens", arenaTokens);

            if (arenaTokens <= config.getItem("arenaTokenStop", 1)) {
                con.log (1, "Not enough tokens");
                schedule.setItem('arenaTimer', Math.max (config.getItem("arenaTokenStart", 1) - config.getItem("arenaTokenStop", 1), 0) * 5 * 60);
                return true;
            }
con.log (1, "inputDiv", inputDiv);
            inputDiv.each(function (index) {
                var tr         = $j(),
                    levelm     = [],
                    tempTxt    = '',
                    tNum       = 0,
                    tempTime   = -1,
                    i          = 0,
                    len        = 0,
                    tempRecord = new battle.record();
                levelMultiplier = caap.stats.level / (tempRecord.data.levelNum > 0 ? tempRecord.data.levelNum : 1);
                tempRecord.data.nameStr = inputDiv[index].children[1].children[0].innerHTML.trim();
                tempRecord.data.levelNum = /\d+/.exec(inputDiv[index].children[1].children[1].innerHTML)[0];
                tempRecord.data.rankStr = inputDiv[index].children[1].children[2].innerHTML.trim();
                tempRecord.data.arenaRankNum = /\d+/.exec(inputDiv[index].children[1].children[2].innerHTML)[0];
                tempRecord.data.userId = $j("input[name*='target_id']", inputDiv[index].children[4].children[0].children[0])[0].value;
                tempRecord.data.armyNum = Math.min (501, inputDiv[index].children[2].innerHTML.trim());  // arena doesn't list the army size capped at 501

                tempRecord.data.button = $j("input[src*='arena_invade_btn']", inputDiv[index]);
                battleRecord = battle.getItem(tempRecord.data.userId);
                switch (config.getItem("ArenaBattleType", 'Invade')) {
                case 'Invade' :
                    useGeneral = 'InvadeGeneral';
                    tempTime = $u.setContent(battleRecord.invadeLostTime, 0);
                    tempRecord.data.button = $j("input[src*='arena_invade_btn']", inputDiv[index]);
                    break;
                case 'Duel' :
                    useGeneral = 'DuelGeneral';
                    tempTime = $u.setContent(battleRecord.duelLostTime, 0);
                    tempRecord.data.button = $j("input[src*='arena_duel_btn']", inputDiv[index]);
                    break;
                default :
                    con.warn("Battle type unknown!", config.getItem("ArenaBattleType", 'Invade'));
                }
                if (battleRecord && !battleRecord.newRecord && tempTime && !schedule.since(tempTime, 604800)) {
                    con.log(1, "We lost " + config.getItem("arenaBattleType", 'Invade') + " to this id this week: ", tempRecord.data.userId);
                    return true;
                }

                maxLevel = config.getItem("arenaLevelMax", 99999);
                con.log(3, "arenaLevelMax", maxLevel);
                if (maxLevel === '' || $u.isNaN(maxLevel)) {
                    if (maxLevel !== '') {
                        con.warn("arenaLevelMax is NaN, using default", maxLevel);
                    }

                    maxLevel = 99999;
                }

                minLevel = config.getItem("arenaLevelMin", 99999);
                con.log(3, "arenaLevelMin", minLevel);
                if (minLevel === '' || $u.isNaN(minLevel)) {
                    if (minLevel !== '') {
                        con.warn("arenaLevelMin is NaN, using default", minLevel);
                    }

                    minLevel = 99999;
                }

                maxRank = config.getItem("arenaRankMax", 8);
                con.log(3, "arenaRankMax", maxRank);
                if (maxRank === '' || $u.isNaN(maxRank)) {
                    if (maxRank !== '') {
                        con.warn("arenaRankMax is NaN, using default", maxRank);
                    }

                    maxRank = 8;
                }

                minRank = config.getItem("arenaRankMin", 0);
                con.log(3, "arenaRankMin", minRank);
                if (minRank === '' || $u.isNaN(minRank)) {
                    if (minRank !== '') {
                        con.warn("arenaRankMin is NaN, using default", minRank);
                    }

                    minRank = 0;
                }

                if (tempRecord.data.levelNum - caap.stats.level > maxLevel) {
                    con.log(2, "Exceeds relative maxLevel", {'level': tempRecord.data.levelNum, 'levelDif': tempRecord.data.levelNum - caap.stats.level, 'maxLevel': maxLevel});
                    return true;
                }

                if (caap.stats.level - tempRecord.data.levelNum > minLevel) {
                    con.log(2, "Exceeds relative minLevel", {'level': tempRecord.data.levelNum, 'levelDif': caap.stats.level - tempRecord.data.levelNum, 'minLevel': minLevel});
                    return true;
                }

                if (tempRecord.data.arenaRankNum > maxRank) {
                    con.log(2, "This guy's rank is too big ", {'Rank': tempRecord.data.arenaRankNum, 'maxRank': maxRank});
                    return true;
                }

                if (tempRecord.data.arenaRankNum < minRank) {
                    con.log(2, "This guy's rank is too small ", {'Rank': tempRecord.data.arenaRankNum, 'minRank': minRank});
                    return true;
                }

                if (config.getItem("arenaArmyMax", 501) < tempRecord.data.armyNum) {
                    con.log(2, "This guy's army is too big (" + tempRecord.data.armyNum + "): ", tempRecord.data.userId);
                    return true;
                }

                switch (config.getItem("ArenaBattleType", 'Invade')) {
                case 'Invade' :
                    tempRecord.data.score = tempRecord.data.arenaRankNum - (tempRecord.data.armyNum / levelMultiplier / caap.stats.army.capped);
                case 'Duel' :
                    tempRecord.data.score = tempRecord.data.arenaRankNum - (tempRecord.data.armyNum / levelMultiplier / caap.stats.army.capped);
                default :
                    tempRecord.data.score = tempRecord.data.arenaRankNum - (tempRecord.data.armyNum / levelMultiplier / caap.stats.army.capped);
                }

                tempRecord.data.targetNumber = index + 1;
                safeTargets.push(tempRecord.data);
                tempRecord = null;

                return true;
            });
            safeTargets.sort($u.sortBy(true, "score"));

            lastArenaBattleID = state.getItem("lastArenaBattleID", 0);
            if (safeTargets.length == 0) {
                con.log (1, "No valid targets right now, try again in a few minutes");
                schedule.setItem('arenaTimer', 5 * 60);
                return true;
            }
            for (it = 0, len = safeTargets.length; it < len; it += 1) {
                if (!lastArenaBattleID && lastArenaBattleID === safeTargets[it].id && !state.getItem ('arenaBattleChainId', 0) === safeTargets[it].id) {
                    continue;
                }

                if ($u.isDefined(safeTargets[it].button)) {
                    con.log(2, 'Found Target score: ' + safeTargets[it].score.dp(2) + ' id: ' + safeTargets[it].userId + ' Number: ' + safeTargets[it].targetNumber);

                    //removing changing general since generates infinite loops
                    //con.log (1, "changing general", useGeneral);
                                        //if(general.Select(useGeneral)) {
                                          //  return true;
                                        //}
                    //con.log (1, "done general");

                    arena.click(safeTargets[it].button);

                    delete safeTargets[it].score;
                    delete safeTargets[it].targetNumber;
                    delete safeTargets[it].button;
                    battleRecord = battle.getItem(safeTargets[it].userId);
                    if (battleRecord.newRecord) {
                        state.setItem("lastArenaBattleID", safeTargets[it].userId);
                        $j.extend(true, battleRecord, safeTargets[it]);
                        battleRecord.newRecord = false;
                        battleRecord.aliveTime = Date.now();
                    } else {
                        battleRecord.aliveTime = Date.now();
                        for (itx in safeTargets[it]) {
                            if (safeTargets[it].hasOwnProperty(itx)) {
                                if (!$u.hasContent(battleRecord[itx] && $u.hasContent(safeTargets[it][itx]))) {
                                    battleRecord[itx] = safeTargets[it][itx];
                                }

                                if ($u.hasContent(safeTargets[it][itx]) && $u.isString(safeTargets[it][itx]) && battleRecord[itx] !== safeTargets[it][itx]) {
                                    battleRecord[itx] = safeTargets[it][itx];
                                }

                                if ($u.hasContent(safeTargets[it][itx]) && $u.isNumber(safeTargets[it][itx]) && battleRecord[itx] < safeTargets[it][itx]) {
                                    battleRecord[itx] = safeTargets[it][itx];
                                }
                            }
                        }
                    }

                    battle.setItem(battleRecord);
                    caap.setDivContent('battle_mess', 'Attacked: ' + lastArenaBattleID);
                    state.setItem("notSafeCount", 0);
                    return true;
                }
            }
        }
    };
