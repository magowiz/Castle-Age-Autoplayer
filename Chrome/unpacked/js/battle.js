
    ////////////////////////////////////////////////////////////////////
    //                          battle OBJECT
    // this is the main object for dealing with battles
    /////////////////////////////////////////////////////////////////////

    battle = {
        records : [],

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'userId'          : 0,
                'nameStr'         : '',
                'rankStr'         : '',
                'rankNum'         : 0,
                'arenaRankNum'    : 0,
                'conquestRankNum' : 0,
                'warRankStr'      : '',
                'warRankNum'      : 0,
                'levelNum'        : 0,
                'armyNum'         : 0,
                'deityNum'        : 0,
                'deityStr'        : '',
                'invadewinsNum'   : 0,
                'invadelossesNum' : 0,
                'ibp'             : 0,
                'duelwinsNum'     : 0,
                'duellossesNum'   : 0,
                'dbp'             : 0,
                'warwinsNum'      : 0,
                'warlossesNum'    : 0,
                'wbp'             : 0,
                'defendwinsNum'   : 0,
                'defendlossesNum' : 0,
                'statswinsNum'    : 0,
                'statslossesNum'  : 0,
                'goldNum'         : 0,
                'chainCount'      : 0,
                'invadeLostTime'  : 0,
                'duelLostTime'    : 0,
                'warLostTime'     : 0,
                'deadTime'        : 0,
                'chainTime'       : 0,
                'ignoreTime'      : 0,
                'aliveTime'       : 0,
                'attackTime'      : 0,
                'selectTime'      : 0,
                'unknownTime'     : 0,
                'newRecord'       : true
            };
        },
        /*jslint sub: false */

        battleRankTable: {
            0  : 'Acolyte',
            1  : 'Scout',
            2  : 'Soldier',
            3  : 'Elite Soldier',
            4  : 'Squire',
            5  : 'Knight',
            6  : 'First Knight',
            7  : 'Legionnaire',
            8  : 'Centurion',
            9  : 'Champion',
            10 : 'Lieutenant Commander',
            11 : 'Commander',
            12 : 'High Commander',
            13 : 'Lieutenant General',
            14 : 'General',
            15 : 'High General',
            16 : 'Baron',
            17 : 'Earl',
            18 : 'Duke',
            19 : 'Prince',
            20 : 'King',
            21 : 'High King'
        },

        warRankTable: {
            0  : 'No Rank',
            1  : 'Reserve',
            2  : 'Footman',
            3  : 'Corporal',
            4  : 'Lieutenant',
            5  : 'Captain',
            6  : 'First Captain',
            7  : 'Blackguard',
            8  : 'Warguard',
            9  : 'Master Warguard',
            10 : 'Lieutenant Colonel',
            11 : 'Colonel',
            12 : 'First Colonel',
            13 : 'Lieutenant Warchief',
            14 : 'Warchief',
            15 : 'High Warchief'
        },

        hbest: 2,

        load: function () {
            try {
                battle.records = gm.getItem('battle.records', 'default');
                if (battle.records === 'default' || !$j.isArray(battle.records)) {
                    battle.records = gm.setItem('battle.records', []);
                }

                battle.hbest = battle.hbest === false ? JSON.hbest(battle.records) : battle.hbest;
                con.log(3, "battle.load Hbest", battle.hbest);
                session.setItem("BattleDashUpdate", true);
                con.log(3, "battle.load", battle.records);
                return true;
            } catch (err) {
                con.error("ERROR in battle.load: " + err);
                return false;
            }
        },

        save: function (src) {
            try {
                var compress = false;
                if (caap.domain.which === 3) {
                    caap.messaging.setItem('battle.records', battle.records);
                } else {
                    gm.setItem('battle.records', battle.records, battle.hbest, compress);
                    con.log(3, "battle.save", battle.records);
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                        caap.messaging.setItem('battle.records', battle.records);
                    }
                }

                if (caap.domain.which !== 0) {
                    session.setItem("BattleDashUpdate", true);
                }

                return true;
            } catch (err) {
                con.error("ERROR in battle.save: " + err);
                return false;
            }
        },

        clear: function () {
            try {
                battle.records = [];
                battle.save();
                session.setItem("BattleDashUpdate", true);
                return true;
            } catch (err) {
                con.error("ERROR in battle.clear: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getItem: function (userId) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false,
                    newRecord = null;

                if (userId === '' || $u.isNaN(userId) || userId < 1) {
                    con.warn("userId", userId);
                    throw "Invalid identifying userId!";
                }

                for (it = 0, len = battle.records.length; it < len; it += 1) {
                    if (battle.records[it]['userId'] === userId) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    con.log(3, "Got battle record", userId, battle.records[it]);
                    battle.records[it]['newRecord'] = false;
                    return battle.records[it];
                } else {
                    newRecord = new battle.record();
                    newRecord.data['userId'] = userId;
                    con.log(3, "New battle record", userId, newRecord.data);
                    return newRecord.data;
                }
            } catch (err) {
                con.error("ERROR in battle.getItem: " + err);
                return false;
            }
        },

        setItem: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (record['userId'] === '' || $u.isNaN(record['userId']) || record['userId'] < 1) {
                    con.warn("userId", record['userId']);
                    throw "Invalid identifying userId!";
                }

                var it      = 0,
                    len     = 0,
                    success = false;

                for (it = 0, len = battle.records.length; it < len; it += 1) {
                    if (battle.records[it]['userId'] === record['userId']) {
                        success = true;
                        break;
                    }
                }

                record['newRecord'] = false;
                if (success) {
                    battle.records[it] = record;
                    con.log(3, "Updated battle record", record, battle.records);
                } else {
                    battle.records.push(record);
                    con.log(3, "Added battle record", record, battle.records);
                }

                battle.save();
                return true;
            } catch (err) {
                con.error("ERROR in battle.setItem: " + err, record);
                return false;
            }
        },

        deleteItem: function (userId) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false;

                if (userId === '' || $u.isNaN(userId) || userId < 1) {
                    con.warn("userId", userId);
                    throw "Invalid identifying userId!";
                }

                for (it = 0, len = battle.records.length; it < len; it += 1) {
                    if (battle.records[it]['userId'] === userId) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    battle.records.splice(it, 1);
                    battle.save();
                    con.log(3, "Deleted battle record", userId, battle.records);
                    return true;
                } else {
                    con.warn("Unable to delete battle record", userId, battle.records);
                    return false;
                }
            } catch (err) {
                con.error("ERROR in battle.deleteItem: " + err);
                return false;
            }
        },

        hashCheck: function (record) {
            try {
                var hash = '',
                    hashes = ["3f56e5f147545c2069f615aa2ebc80d2eef34d48",
                              "8caeb4b385c1257419ee18dee47cfa3a1271ba77",
                              "02752cf4b979dd5a77b53694917a60f944cb772f",
                              "c644f2fdcf1a7d721b82efab5313df609442c4f9",
                              "8d29caf6400807789964185405b0f442e6cacae7",
                              "7f04c6d6d1110ce05532ca508efde5dbafe7ec17"];

                if (!hashes.length || !(gm ? gm.getItem('AllowProtected', true, hiddenVar) : true)) {
                    return false;
                }

                if (record['userId'] === '' || $u.isNaN(record['userId']) || record['userId'] < 1) {
                    con.warn("userId", record);
                    throw "Invalid identifying userId!";
                }

                hash = (record['userId'].toString().SHA1() + record['nameStr']).SHA1();
                return (hashes.hasIndexOf(hash));
            } catch (err) {
                con.error("ERROR in battle.hashCheck: " + err);
                return false;
            }
        },

        flagResult: false,

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

                if ($u.hasContent($j("img[src*='battle_victory.gif']", caap.resultsWrapperDiv))) {
                    warWinLoseImg = 'war_win_left.jpg';
                    result.win = true;
                } else if ($u.hasContent($j("img[src*='battle_defeat.gif']", caap.resultsWrapperDiv))) {
                    warWinLoseImg = 'war_lose_left.jpg';
                } else {
                    if ($u.hasContent(caap.resultsWrapperDiv)) {
                        if (/Your opponent is hiding, please try again/.test(caap.resultsText)) {
                            result.hiding = true;
                            con.log(1, "Your opponent is hiding");
                            return result;
                        } else {
                            result.unknown = true;
                            con.warn("Unable to determine won, lost or hiding!", caap.resultsText);
                            return result;
                        }
                    } else {
                        result.unknown = true;
                        con.warn("Unable to determine won or lost!");
                        return result;
                    }
                }

                if ($u.hasContent($j("img[src*='war_castle.jpg']", caap.resultsWrapperDiv))) {
                    result.battleType = 'War';
                    if ($u.hasContent(caap.resultsWrapperDiv)) {
                        tempDiv = $j("img[src*='war_rank_small_icon']", caap.resultsWrapperDiv).eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tempText = $u.setContent(tempDiv.parent().text(), '').trim().innerTrim();
                            if ($u.hasContent(tempText)) {
                                tNum = tempText.regex(/(\d+)\s+War Points/i);
                                if ($u.hasContent(tNum)) {
                                    result.points = tNum;
                                } else {
                                    con.warn("Unable to match war points", tempText);
                                }
                            } else {
                                con.warn("Unable to find war points text");
                            }
                        } else {
                            con.log(3, "Unable to find war_rank_small_icon");
                        }

                        tempDiv = $j("b[class*='gold']", caap.resultsWrapperDiv).eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tNum = $u.setContent(tempDiv.text(), '').trim().numberOnly();
                            if ($u.hasContent(tNum)) {
                                result.gold = tNum;
                            } else {
                                con.warn("Unable to find gold text");
                            }
                        } else {
                            con.warn("Unable to find gold element");
                        }

                        tempDiv = $j("form[id*='fight_opp_'] input[name='target_id']", caap.resultsWrapperDiv).eq(0);
                        if ($u.hasContent(tempDiv)) {
                            tNum = $u.setContent(tempDiv.attr("value"), '0').parseInt();
                            if ($u.hasContent(tNum) && tNum > 0) {
                                result.userId = tNum;
                            } else {
                                con.warn("No value in tempDiv");
                                throw "Unable to get userId!";
                            }
                        } else {
                            con.warn("Unable to find target_id in caap.resultsWrapperDiv");
                            throw "Unable to get userId!";
                        }

                        tempDiv = $j("div[style*='" + warWinLoseImg + "']", caap.resultsWrapperDiv);
                        if ($u.hasContent(tempDiv)) {
                            tempText = $u.setContent(tempDiv.text(), '').trim().replace("'s Defense", '');
                            if ($u.hasContent(tempText)) {
                                result.userName = tempText;
                            } else {
                                con.warn("Unable to match user's name in", tempText);
                            }
                        } else {
                            con.warn("Unable to find ", warWinLoseImg);
                        }
                    } else {
                        con.warn("Unable to find result div");
                        throw "Unable to get userId!";
                    }
                } else {
                    if ($u.hasContent($j("input[src*='battle_invade_again.gif']", caap.resultsWrapperDiv))) {
                        result.battleType = 'Invade';
                    } else if ($u.hasContent($j("input[src*='battle_duel_again.gif']", caap.resultsWrapperDiv))) {
                        result.battleType = 'Duel';
                    } else {
                        if ($u.hasContent($j("img[src*='icon_weapon.gif']", caap.resultsWrapperDiv))) {
                            result.battleType = 'Duel';
                        } else if ($u.hasContent($j("div[class='full_invade_results']", caap.resultsWrapperDiv))) {
                            result.battleType = 'Invade';
                        }
                    }

                    if ($u.hasContent(result.battleType)) {
                        if ($u.hasContent(caap.resultsWrapperDiv)) {
                            tempDiv = $j("img[src*='battle_rank_small_icon']", caap.resultsWrapperDiv).eq(0);
                            if ($u.hasContent(tempDiv)) {
                                tempText = $u.setContent(tempDiv.parent().parent().text(), '').trim().innerTrim();
                                if ($u.hasContent(tempText)) {
                                    tNum = tempText.regex(/(\d+)\s+Battle Points/i);
                                    if ($u.hasContent(tNum)) {
                                        result.points = tNum;
                                    } else {
                                        con.warn("Unable to match battle points", tempText);
                                    }
                                } else {
                                    con.warn("Unable to find battle points text in tempDiv.parent().parent()");
                                }
                            } else {
                                con.log(3, "Unable to find battle_rank_small_icon in caap.resultsWrapperDiv");
                            }

                            tempDiv = $j("b[class*='gold']", caap.resultsWrapperDiv).eq(0);
                            if ($u.hasContent(tempDiv)) {
                                tNum = $u.setContent(tempDiv.text(), '').trim().numberOnly();
                                if ($u.hasContent(tNum)) {
                                    result.gold = tNum;
                                } else {
                                    con.warn("Unable to find gold text in tempDiv");
                                }
                            } else {
                                con.warn("Unable to find gold element in caap.resultsWrapperDiv");
                            }

                            tempDiv = $j("a[href*='keep.php?casuser=']", caap.resultsWrapperDiv).eq(0);
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
                                con.warn("Unable to find keep.php?casuser= in caap.resultsWrapperDiv");
                                throw "Unable to get userId!";
                            }
                        } else {
                            con.warn("Unable to find result div");
                            throw "Unable to get userId!";
                        }
                    } else {
                        con.warn("Unable to determine battle type");
                        throw "Unable to get userId!";
                    }
                }

                battleRecord = battle.getItem(result.userId);
                battleRecord['attackTime'] = Date.now();
                if (result.userName && result.userName !== battleRecord['nameStr']) {
                    con.log(1, "Updating battle record user name, from/to", battleRecord['nameStr'], result.userName);
                    battleRecord['nameStr'] = result.userName;
                }

                if (result.win) {
                    battleRecord['statswinsNum'] += 1;
                } else {
                    battleRecord['statslossesNum'] += 1;
                }

                switch (result.battleType) {
                case 'Invade' :
                    if (result.win) {
                        battleRecord['invadewinsNum'] += 1;
                        battleRecord['ibp'] += result.points;
                    } else {
                        battleRecord['invadelossesNum'] += 1;
                        battleRecord['ibp'] -= result.points;
                        battleRecord['invadeLostTime'] = Date.now();
                    }

                    break;
                case 'Duel' :
                    if (result.win) {
                        battleRecord['duelwinsNum'] += 1;
                        battleRecord['dbp'] += result.points;
                    } else {
                        battleRecord['duellossesNum'] += 1;
                        battleRecord['dbp'] -= result.points;
                        battleRecord['duelLostTime'] = Date.now();
                    }

                    break;
                case 'War' :
                    if (result.win) {
                        battleRecord['warwinsNum'] += 1;
                        battleRecord['wbp'] += result.points;
                        con.log(1, "War Win", battleRecord['warwinsNum']);
                    } else {
                        battleRecord['warlossesNum'] += 1;
                        battleRecord['wbp'] -= result.points;
                        battleRecord['warLostTime'] = Date.now();
                        con.log(1, "War Loss", battleRecord['userId'], battleRecord);
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

        deadCheck: function () {
            try {
                var battleRecord = {},
                    dead         = false;

                if (state.getItem("lastBattleID", 0)) {
                    battleRecord = battle.getItem(state.getItem("lastBattleID", 0));
                }

                if ($u.hasContent(caap.resultsWrapperDiv)) {
                    if ($u.hasContent(caap.resultsText)) {
                        if (/Your opponent is dead or too weak to battle/.test(caap.resultsText)) {
                            con.log(1, "This opponent is dead or hiding: ", state.getItem("lastBattleID", 0));
                            if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                                battleRecord['deadTime'] = Date.now();
                            }

                            dead = true;
                        }
                    } else {
                        if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                            battleRecord['unknownTime'] = Date.now();
                        }

                        con.warn("Unable to determine if user is dead!");
                        dead = null;
                    }
                } else {
                    if ($j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                        battleRecord['unknownTime'] = Date.now();
                    }

                    con.warn("Unable to find any results!");
                    dead = null;
                }

                if (dead !== false && $j.isPlainObject(battleRecord) && !$j.isEmptyObject(battleRecord)) {
                    battle.setItem(battleRecord);
                }

                return dead;
            } catch (err) {
                con.error("ERROR in battle.deadCheck: " + err);
                return undefined;
            }
        },

        checkResults: function () {
            try {
                var battleRecord = {},
                    tempTime     = 0,
                    chainBP      = 0,
                    chainGold    = 0,
                    maxChains    = 0,
                    result       = {};

                if (!battle.flagResult) {
                    return true;
                }

                con.log(2, "Checking Battle Results");
                battle.flagResult = false;
                state.setItem("BattleChainId", 0);
                if (battle.deadCheck() !== false) {
                    return true;
                }

                result = battle.getResult();
                if (!result || result.hiding === true) {
                    return true;
                }

                if (result.unknown === true) {
                    if (state.getItem("lastBattleID", 0)) {
                        battleRecord = battle.getItem(state.getItem("lastBattleID", 0));
                        battleRecord['unknownTime'] = Date.now();
                        battle.setItem(battleRecord);
                    }

                    return true;
                }

                battleRecord = battle.getItem(result.userId);
                if (result.win) {
                    con.log(1, "We Defeated ", result.userName, ((result.battleType === "War") ? "War Points: " : "Battle Points: ") + result.points + ", Gold: " + result.gold);
                    //Test if we should chain this guy
                    tempTime = $u.setContent(battleRecord['chainTime'], 0);
                    chainBP = config.getItem('ChainBP', '');
                    chainGold = config.getItem('ChainGold', '');
                    if (schedule.since(tempTime, 86400) && ((chainBP !== '' && !$u.isNaN(chainBP) && chainBP >= 0) || (chainGold !== '' && !$u.isNaN(chainGold) && chainGold >= 0))) {
                        if (chainBP !== '' && !$u.isNaN(chainBP) && chainBP >= 0) {
                            if (result.points >= chainBP) {
                                state.setItem("BattleChainId", result.userId);
                                con.log(1, "Chain Attack:", result.userId, ((result.battleType === "War") ? "War Points: " : "Battle Points: ") + result.points);
                            } else {
                                battleRecord['ignoreTime'] = Date.now();
                            }
                        }

                        if (chainGold !== '' && !$u.isNaN(chainGold) && chainGold >= 0) {
                            if (result.gold >= chainGold) {
                                state.setItem("BattleChainId", result.userId);
                                con.log(1, "Chain Attack:", result.userId, "Gold: " + result.goldnum);
                            } else {
                                battleRecord['ignoreTime'] = Date.now();
                            }
                        }
                    }

                    battleRecord['chainCount'] = battleRecord['chainCount'] ? battleRecord['chainCount'] += 1 : 1;
                    maxChains = config.getItem('MaxChains', 4);
                    if (maxChains === '' || $u.isNaN(maxChains) || maxChains < 0) {
                        maxChains = 4;
                    }

                    if (battleRecord['chainCount'] >= maxChains) {
                        con.log(1, "Lets give this guy a break. Chained", battleRecord['chainCount']);
                        battleRecord['chainTime'] = Date.now();
                        battleRecord['chainCount'] = 0;
                    }
                } else {
                    con.log(1, "We Were Defeated By ", result.userName);
                    battleRecord['chainCount'] = 0;
                    battleRecord['chainTime'] = 0;
                }

                battle.setItem(battleRecord);
                return true;
            } catch (err) {
                con.error("ERROR in battle.checkResults: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        nextTarget: function () {
            state.setItem('BattleTargetUpto', state.getItem('BattleTargetUpto', 0) + 1);
        },

        getTarget: function (mode) {
            try {
                var target     = '',
                    targets    = [],
                    battleUpto = '',
                    targetType = '',
                    targetRaid = '';

                targetType = config.getItem('TargetType', 'Freshmeat');
                targetRaid = state.getItem('targetFromraid', '');
                if (mode === 'DemiPoints') {
                    if (targetRaid && targetType === 'Raid') {
                        return 'Raid';
                    }

                    return 'Freshmeat';
                }

                if (targetType === 'Raid') {
                    if (targetRaid) {
                        return 'Raid';
                    }

                    caap.setDivContent('battle_mess', 'No Raid To Attack');
                    return 'NoRaid';
                }

                if (targetType === 'Freshmeat') {
                    return 'Freshmeat';
                }

                target = state.getItem('BattleChainId', 0);
                if (target) {
                    return target;
                }

                targets = config.getList('BattleTargets', '');
                if (!targets.length) {
                    return false;
                }

                battleUpto = state.getItem('BattleTargetUpto', 0);
                if (battleUpto > targets.length - 1) {
                    battleUpto = 0;
                    state.setItem('BattleTargetUpto', 0);
                }

                if (!targets[battleUpto]) {
                    battle.nextTarget();
                    return false;
                }

                caap.setDivContent('battle_mess', 'Battling User ' + battleUpto + '/' + targets.length + ' ' + targets[battleUpto]);
                if ((targets[battleUpto] === '' || $u.isNaN(targets[battleUpto]) ? targets[battleUpto].toLowerCase() : targets[battleUpto]) === 'raid') {
                    if (targetRaid) {
                        return 'Raid';
                    }

                    caap.setDivContent('battle_mess', 'No Raid To Attack');
                    battle.nextTarget();
                    return false;
                }

                return targets[battleUpto];
            } catch (err) {
                con.error("ERROR in battle.getTarget: " + err);
                return false;
            }
        },

        click: function (battleButton, type) {
            try {
                session.setItem('ReleaseControl', true);
                battle.flagResult = true;
                caap.setDomWaiting(type === "Raid" ? "raid.php" : "battle.php");
                caap.click(battleButton);
                return true;
            } catch (err) {
                con.error("ERROR in battle.click: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        battles: {
            'Raid' : {
                'Invade1'  : 'raid_attack_button.gif',
                'Invade5'  : 'raid_attack_button3.gif',
                'Duel1'    : 'raid_attack_button2.gif',
                'Duel5'    : 'raid_attack_button4.gif',
                'regex1'   : new RegExp('[0-9]+\\. (.+)\\s*Rank: ([0-9]+) ([^0-9]+) ([0-9]+) ([^0-9]+) ([0-9]+)', 'i'),
                'refresh'  : 'raid',
                'image'    : 'tab_raid_on.gif'
            },
            'Freshmeat' : {
                'Invade'   : 'battle_01.gif',
                'Duel'     : 'battle_02.gif',
                'War'      : 'war_button_duel.gif',
                'regex1'   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*War: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
                'regex2'   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
                'warLevel' : true,
                'refresh'  : 'battle_on.gif',
                'image'    : 'battle_on.gif'
            }
        },

        selectedDemisDone: function (force) {
            try {
                var demiPointsDone = true,
                    it = 0;

                for (it = 0; it < 5; it += 1) {
                    if (force || config.getItem('DemiPoint' + it, true)) {
                        if (caap.demi[caap.demiTable[it]]['daily']['dif'] > 0) {
                            demiPointsDone = false;
                            break;
                        }
                    }
                }

                return demiPointsDone;
            } catch (err) {
                con.error("ERROR in battle.selectedDemisDone: " + err);
                return undefined;
            }
        },

        freshmeat: function (type) {
            try {
                var buttonType      = type === 'Raid' ? config.getItem('BattleType', 'Invade') + state.getItem('RaidStaminaReq', 1) : config.getItem('BattleType', 'Invade'),
                    inputDiv        = $j("input[src*='" + battle.battles[type === "recon" ? "Freshmeat" : type][buttonType] + "']", (type === "recon" && config.getItem('bgRecon', true) ? caap.tempAjax : caap.appBodyDiv)),
                    plusOneSafe     = false,
                    safeTargets     = [],
                    chainId         = '',
                    chainAttack     = false,
                    inp             = $j(),
                    txt             = '',
                    minRank         = 0,
                    maxLevel        = 0,
                    minLevel		= 0,
                    ARBase          = 0,
                    ARMax           = 0,
                    ARMin           = 0,
                    levelMultiplier = 0,
                    armyRatio       = 0,
                    battleRecord    = {},
                    it              = 0,
                    itx,
                    len             = 0,
                    form            = $j(),
                    firstId         = '',
                    lastBattleID    = 0,
                    engageButton    = null,
                    time            = 0,
                    found           = 0,
                    entryLimit      = 0,
                    noSafeCount     = 0,
                    noSafeCountSet  = 0;

                if (!$u.hasContent(inputDiv)) {
                    con.warn('Not on battlepage');
                    caap.navigateTo(caap.battlePage);
                    return false;
                }

                chainId = state.getItem('BattleChainId', 0);
                state.setItem('BattleChainId', '');
                // Lets get our Freshmeat user settings
                minRank = config.getItem("FreshMeatMinRank", 99);
                con.log(3, "FreshMeatMinRank", minRank);
                if (minRank === '' || $u.isNaN(minRank)) {
                    if (minRank !== '') {
                        con.warn("FreshMeatMinRank is NaN, using default", 99);
                    }

                    minRank = 99;
                }

                maxLevel = config.getItem("FreshMeatMaxLevel", 99999);
                con.log(3, "FreshMeatMaxLevel", maxLevel);
                if (maxLevel === '' || $u.isNaN(maxLevel)) {
                    if (maxLevel !== '') {
                        con.warn("FreshMeatMaxLevel is NaN, using default", maxLevel);
                    }

                    maxLevel = 99999;
                }

                minLevel = config.getItem("FreshMeatMinLevel", 99999);
                con.log(3, "FreshMeatMinLevel", minLevel);
                if (minLevel === '' || $u.isNaN(minLevel)) {
                    if (minLevel !== '') {
                        con.warn("FreshMeatMinLevel is NaN, using default", minLevel);
                    }

                    minLevel = 99999;
                }

                ARBase = config.getItem("FreshMeatARBase", 0.5);
                con.log(3, "FreshMeatARBase", ARBase);
                if (ARBase === '' || $u.isNaN(ARBase)) {
                    if (ARBase !== '') {
                        con.warn("FreshMeatARBase is NaN, using default", ARBase);
                    }

                    ARBase = 0.5;
                }

                ARMax = config.getItem("FreshMeatARMax", 99999);
                con.log(3, "FreshMeatARMax", ARMax);
                if (ARMax === '' || $u.isNaN(ARMax)) {
                    if (ARMax !== '') {
                        con.warn("FreshMeatARMax is NaN, using default", ARMax);
                    }

                    ARMax = 99999;
                }

                ARMin = config.getItem("FreshMeatARMin", 0);
                con.log(3, "FreshMeatARMin", ARMin);
                if (ARMin === '' || $u.isNaN(ARMin)) {
                    if (ARMin !== '') {
                        con.warn("FreshMeatARMin is NaN, using default", ARMin);
                    }

                    ARMin = 0;
                }

                inputDiv.each(function (index) {
                    var tr         = $j(),
                        levelm     = [],
                        tempTxt    = '',
                        tNum       = 0,
                        tempTime   = -1,
                        i          = 0,
                        len        = 0,
                        tempRecord = type === "recon" ? new battle.reconRecord() : new battle.record();

                    tempRecord.data['button'] = $j(this);
                    if (type === 'Raid') {
                        tr = tempRecord.data['button'].parents().eq(4);
                    } else {
                        tr = tempRecord.data['button'].parents("tr").eq(0);
                    }

                    inp = $j("input[name='target_id']", tr);
                    if (!$u.hasContent(inp)) {
                        con.warn("Could not find 'target_id' input");
                        return true;
                    }

                    tempRecord.data['userId'] = $u.setContent(inp.val(), '0').parseInt();
                    if (!$u.isNumber(tempRecord.data['userId']) || tempRecord.data['userId'] <= 0) {
                        con.warn("Not a valid userId", tempRecord.data['userId']);
                        return true;
                    }

                    if (type === "recon") {
                        for (i = 0, len = battle.reconRecords.length; i < len; i += 1) {
                            if (battle.reconRecords[i]['userId'] === tempRecord.data['userId']) {
                                tempRecord.data = battle.reconRecords[i];
                                battle.reconRecords.splice(i, 1);
                                con.log(2, "UserRecord exists. Loaded and removed.", tempRecord);
                                break;
                            }
                        }
                    }

                    if (type === 'Raid') {
                        tempTxt = $u.setContent(tr.children().eq(1).text(), '').trim();
                        levelm = battle.battles['Raid']['regex1'].exec(tempTxt);
                        if (!$u.hasContent(levelm)) {
                            con.warn("Can't match Raid regex in ", tempTxt);
                            return true;
                        }

                        tempRecord.data['nameStr'] = $u.setContent(levelm[1], '').trim();
                        tempRecord.data['rankNum'] = $u.setContent(levelm[2], '').parseInt();
                        tempRecord.data['rankStr'] = battle.battleRankTable[tempRecord.data['rankNum']];
                        tempRecord.data['levelNum'] = $u.setContent(levelm[4], '').parseInt();
                        tempRecord.data['armyNum'] = $u.setContent(levelm[6], '').parseInt();
                    } else {
                        if (!$u.hasContent(tr)) {
                            con.warn("Can't find parent tr in tempRecord.data['button']");
                            return true;
                        }

                        tNum = $u.setContent($j("img[src*='symbol_']", tr).attr("src"), '').regex(/(\d+)\.jpg/i);
                        if ($u.hasContent(tNum)) {
                            tempRecord.data['deityNum'] = tNum - 1;
                            if (tempRecord.data['deityNum'] >= 0 && tempRecord.data['deityNum'] <= 4) {
                                tempRecord.data['deityStr'] = caap.demiTable[tempRecord.data['deityNum']];
                            } else {
                                con.warn("Demi number is not between 0 and 4", tempRecord.data['deityNum']);
                                tempRecord.data['deityNum'] = 0;
                                tempRecord.data['deityStr'] = caap.demiTable[tempRecord.data['deityNum']];
                            }
                        } else {
                            con.warn("Unable to match demi number in tempTxt");
                        }

                        // If looking for demi points, and already full, continue
                        if (type !== "recon") {
                            if (config.getItem('DemiPointsFirst', false) && !state.getItem('DemiPointsDone', true) && (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                                if (caap.demi[tempRecord.data['deityStr']]['daily']['dif'] <= 0 || !config.getItem('DemiPoint' + tempRecord.data['deityNum'], true)) {
                                    con.log(2, "Daily Demi Points done for", tempRecord.data['deityStr']);
                                    return true;
                                }
                            } else if (config.getItem('WhenBattle', 'Never') === "Demi Points Only") {
                                if (caap.demi[tempRecord.data['deityStr']]['daily']['dif'] <= 0) {
                                    con.log(2, "Daily Demi Points done for", tempRecord.data['deityStr']);
                                    return true;
                                }
                            }
                        }

                        tempTxt = $u.setContent(tr.text(), '').trim();
                        if (!$u.hasContent(tempTxt)) {
                            con.warn("Can't find tempTxt in tr");
                            return true;
                        }

                        if (battle.battles['Freshmeat']['warLevel']) {
                            levelm = battle.battles['Freshmeat']['regex1'].exec(tempTxt);
                            if (!levelm) {
                                levelm = battle.battles['Freshmeat']['regex2'].exec(tempTxt);
                                battle.battles['Freshmeat']['warLevel'] = false;
                            }
                        } else {
                            levelm = battle.battles['Freshmeat']['regex2'].exec(tempTxt);
                            if (!levelm) {
                                levelm = battle.battles['Freshmeat']['regex1'].exec(tempTxt);
                                battle.battles['Freshmeat']['warLevel'] = true;
                            }
                        }

                        if (!levelm) {
                            con.warn("Can't match Freshmeat regex in ", tempTxt);
                            return true;
                        }

                        tempRecord.data['nameStr'] = $u.setContent(levelm[1], '').trim();
                        tempRecord.data['levelNum'] = $u.setContent(levelm[2], '').parseInt();
                        tempRecord.data['rankStr'] = $u.setContent(levelm[3], '').trim();
                        tempRecord.data['rankNum'] = $u.setContent(levelm[4], '').parseInt();
                        if (battle.battles['Freshmeat']['warLevel']) {
                            tempRecord.data['warRankStr'] = $u.setContent(levelm[5], '').trim();
                            tempRecord.data['warRankNum'] = $u.setContent(levelm[6], '').parseInt();
                            tempRecord.data['armyNum'] = $u.setContent(levelm[7], '').parseInt();
                        } else {
                            tempRecord.data['armyNum'] = $u.setContent(levelm[5], '').parseInt();
                        }
                    }

                    if (battle.hashCheck(tempRecord.data)) {
                        return true;
                    }

                    levelMultiplier = caap.stats['level'] / (tempRecord.data['levelNum'] > 0 ? tempRecord.data['levelNum'] : 1);
                    armyRatio = ARBase * levelMultiplier;
                    armyRatio = Math.min(armyRatio, ARMax);
                    armyRatio = Math.max(armyRatio, ARMin);
                    if (armyRatio <= 0) {
                        con.warn("Bad ratio", armyRatio, ARBase, ARMin, ARMax, levelMultiplier);
                        return true;
                    }

                    if (tempRecord.data['levelNum'] - caap.stats['level'] > maxLevel) {
                        con.log(2, "Exceeds relative maxLevel", {'level': tempRecord.data['levelNum'], 'levelDif': tempRecord.data['levelNum'] - caap.stats['level'], 'maxLevel': maxLevel});
                        return true;
                    }

                    if (caap.stats['level'] - tempRecord.data['levelNum'] > minLevel) {
                        con.log(2, "Exceeds relative minLevel", {'level': tempRecord.data['levelNum'], 'levelDif': caap.stats['level'] - tempRecord.data['levelNum'], 'minLevel': minLevel});
                        return true;
                    }

                    if (config.getItem("BattleType", 'Invade') === "War" && battle.battles['Freshmeat']['warLevel']) {
                        if (caap.stats['rank']['war'] && (caap.stats['rank']['war'] - tempRecord.data['warRankNum'] > minRank)) {
                            con.log(2, "Greater than war minRank", {'rankDif': caap.stats['rank']['war'] - tempRecord.data['warRankNum'], 'minRank': minRank});
                            return true;
                        }
                    } else {
                        if (caap.stats['rank']['battle'] && (caap.stats['rank']['battle'] - tempRecord.data['rankNum'] > minRank)) {
                            con.log(2, "Greater than battle minRank", {'rankDif': caap.stats['rank']['battle'] - tempRecord.data['rankNum'], 'minRank': minRank});
                            return true;
                        }
                    }

                    // if we know our army size, and this one is larger than armyRatio, don't battle
                    if (caap.stats['army']['capped'] && (tempRecord.data['armyNum'] > (caap.stats['army']['capped'] * armyRatio))) {
                        con.log(2, "Greater than armyRatio", {'armyRatio': armyRatio.dp(2), 'armyNum': tempRecord.data['armyNum'], 'armyMax': (caap.stats['army']['capped'] * armyRatio).dp()});
                        return true;
                    }

                    if (type === "recon") {
                        tempRecord.data['aliveTime'] = Date.now();
                        entryLimit = config.getItem("LimitTargets", 100);
                        while (battle.reconRecords.length >= entryLimit) {
                            con.log(2, "Entry limit matched. Deleted an old record", battle.reconRecords.shift());
                        }

                        delete tempRecord.data['button'];
                        con.log(2, "Push UserRecord", tempRecord);
                        battle.reconRecords.push(tempRecord.data);
                        found += 1;
                        return true;
                    }

                    if (config.getItem("BattleType", 'Invade') === "War" && battle.battles['Freshmeat']['warLevel']) {
                        con.log(1, "ID: " + tempRecord.data['userId'].toString().rpad(" ", 15) +
                                    " Level: " + tempRecord.data['levelNum'].toString().rpad(" ", 4) +
                                    " War Rank: " + tempRecord.data['warRankNum'].toString().rpad(" ", 2) +
                                    " Army: " + tempRecord.data['armyNum']);
                    } else {
                        con.log(1, "ID: " + tempRecord.data['userId'].toString().rpad(" ", 15) +
                                    " Level: " + tempRecord.data['levelNum'].toString().rpad(" ", 4) +
                                    " Battle Rank: " + tempRecord.data['rankNum'].toString().rpad(" ", 2) +
                                    " Army: " + tempRecord.data['armyNum']);
                    }

                    // don't battle people we lost to in the last week
                    battleRecord = battle.getItem(tempRecord.data['userId']);
                    if (!config.getItem("IgnoreBattleLoss", false)) {
                        switch (config.getItem("BattleType", 'Invade')) {
                        case 'Invade' :
                            tempTime = $u.setContent(battleRecord['invadeLostTime'], 0);
                            break;
                        case 'Duel' :
                            tempTime = $u.setContent(battleRecord['duelLostTime'], 0);
                            break;
                        case 'War' :
                            tempTime = $u.setContent(battleRecord['warLostTime'], 0);
                            break;
                        default :
                            con.warn("Battle type unknown!", config.getItem("BattleType", 'Invade'));
                        }

                        if (battleRecord && !battleRecord['newRecord'] && tempTime && !schedule.since(tempTime, 604800)) {
                            con.log(1, "We lost " + config.getItem("BattleType", 'Invade') + " to this id this week: ", tempRecord.data['userId']);
                            return true;
                        }
                    }

                    // don't battle people that results were unknown in the last hour
                    tempTime = $u.setContent(battleRecord['unknownTime'], 0);
                    if (battleRecord && !battleRecord['newRecord'] && !schedule.since(tempTime, 3600)) {
                        con.log(1, "User was battled but results unknown in the last hour: ", tempRecord.data['userId']);
                        return true;
                    }

                    // don't battle people that were dead or hiding in the last hour
                    tempTime = $u.setContent(battleRecord['deadTime'], 0);
                    if (battleRecord && !battleRecord['newRecord'] && !schedule.since(tempTime, 3600)) {
                        con.log(1, "User was dead in the last hour: ", tempRecord.data['userId']);
                        return true;
                    }

                    // don't battle people we've already chained to max in the last 2 days
                    tempTime = $u.setContent(battleRecord['chainTime'], 0);
                    if (battleRecord && !battleRecord['newRecord'] && !schedule.since(tempTime, 86400)) {
                        con.log(1, "We chained user within 2 days: ", tempRecord.data['userId']);
                        return true;
                    }

                    // don't battle people that didn't meet chain gold or chain points in the last week
                    tempTime = $u.setContent(battleRecord['ignoreTime'], 0);
                    if (battleRecord && !battleRecord['newRecord'] && !schedule.since(tempTime, 604800)) {
                        con.log(1, "User didn't meet chain requirements this week: ", tempRecord.data['userId']);
                        return true;
                    }

                    tempRecord.data['score'] = (type === 'Raid' ? 0 : tempRecord.data['rankNum']) - (tempRecord.data['armyNum'] / levelMultiplier / caap.stats['army']['capped']);
                    if (tempRecord.data['userId'] === chainId) {
                        chainAttack = true;
                    }

                    tempRecord.data['targetNumber'] = index + 1;
                    con.log(3, "tempRecord/levelm", tempRecord.data, levelm);
                    safeTargets.push(tempRecord.data);
                    tempRecord = null;
                    if (index === 0 && type === 'Raid') {
                        plusOneSafe = true;
                    }

                    return true;
                });

                if (type === "recon") {
                    battle.saveRecon();
                    caap.setDivContent('idle_mess', 'Player Recon: Found:' + found + ' Total:' + battle.reconRecords.length);
                    con.log(1, 'Player Recon: Found:' + found + ' Total:' + battle.reconRecords.length);
                    window.setTimeout(function () {
                        caap.setDivContent('idle_mess', '');
                    }, 5000);

                    schedule.setItem('PlayerReconTimer', (gm ? gm.getItem('PlayerReconRetry', 60, hiddenVar) : 60), 60);
                    battle.reconInProgress = false;
                    return true;
                }

                safeTargets.sort($u.sortBy(true, "score"));
                if ($u.hasContent(safeTargets)) {
                    if (chainAttack) {
                        form = inputDiv.eq(0).parent().parent();
                        inp = $j("input[name='target_id']", form);
                        if ($u.hasContent(inp)) {
                            inp.attr("value", chainId);
                            con.log(1, "Chain attacking: ", chainId);
                            battle.click(inputDiv.eq(0), type);
                            state.setItem("lastBattleID", chainId);
                            caap.setDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                            state.setItem("notSafeCount", 0);
                            return true;
                        }

                        con.warn("Could not find 'target_id' input");
                    } else if (config.getItem('PlusOneKills', false) && type === 'Raid') {
                        if (plusOneSafe) {
                            form = inputDiv.eq(0).parent().parent();
                            inp = $j("input[name='target_id']", form);
                            if ($u.hasContent(inp)) {
                                txt = inp.attr("value");
                                firstId = txt ? txt.parseInt() : 0;
                                inp.attr("value", '200000000000001');
                                con.log(1, "Target ID Overriden For +1 Kill. Expected Defender: ", firstId);
                                battle.click(inputDiv.eq(0), type);
                                state.setItem("lastBattleID", firstId);
                                caap.setDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                                state.setItem("notSafeCount", 0);
                                return true;
                            }

                            con.warn("Could not find 'target_id' input");
                        } else {
                            con.log(1, "Not safe for +1 kill.");
                        }
                    } else {
                        lastBattleID = state.getItem("lastBattleID", 0);
                        for (it = 0, len = safeTargets.length; it < len; it += 1) {
                            if (!lastBattleID && lastBattleID === safeTargets[it]['id']) {
                                continue;
                            }

                            if ($u.isDefined(safeTargets[it]['button'])) {
                                con.log(2, 'Found Target score: ' + safeTargets[it]['score'].dp(2) + ' id: ' + safeTargets[it]['userId'] + ' Number: ' + safeTargets[it]['targetNumber']);
                                battle.click(safeTargets[it]['button'], type);
                                delete safeTargets[it]['score'];
                                delete safeTargets[it]['targetNumber'];
                                delete safeTargets[it]['button'];
                                battleRecord = battle.getItem(safeTargets[it]['userId']);
                                if (battleRecord['newRecord']) {
                                    state.setItem("lastBattleID", safeTargets[it]['userId']);
                                    $j.extend(true, battleRecord, safeTargets[it]);
                                    battleRecord['newRecord'] = false;
                                    battleRecord['aliveTime'] = Date.now();
                                } else {
                                    battleRecord['aliveTime'] = Date.now();
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
                                caap.setDivContent('battle_mess', 'Attacked: ' + lastBattleID);
                                state.setItem("notSafeCount", 0);
                                return true;
                            }

                            con.warn('Attack button is null or undefined');
                        }
                    }
                }

                noSafeCount = state.setItem("notSafeCount", state.getItem("notSafeCount", 0) + 1);
                noSafeCountSet = config.getItem("notSafeCount", 20);
                noSafeCountSet = noSafeCountSet < 1 ? 1 : noSafeCountSet;
                if (noSafeCount >= noSafeCountSet) {
                    caap.setDivContent('battle_mess', 'Leaving Battle. Will Return Soon.');
                    con.log(1, 'No safe targets limit reached. Releasing control for other processes: ', noSafeCount);
                    state.setItem("notSafeCount", 0);
                    time = config.getItem("NoTargetDelay", 45);
                    time = time < 10 ? 10 : time;
                    schedule.setItem("NoTargetDelay", time);
                    return false;
                }

                caap.setDivContent('battle_mess', 'No targets matching criteria');
                con.log(1, 'No safe targets: ', noSafeCount);
                if (type === 'Raid') {
                    engageButton = monster.engageButtons[state.getItem('targetFromraid', '')];
                    if (session.getItem("page", '') === 'raid' && engageButton) {
                        caap.click(engageButton);
                    } else {
                        caap.navigateTo(caap.battlePage + ',raid');
                    }
                } else {
                    caap.navigateTo(caap.battlePage + ',battle_on.gif');
                }

                return true;
            } catch (err) {
                con.error("ERROR in battle.freshmeat: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        menu: function () {
            try {
                var XBattleInstructions = "Start battling if stamina is above this points",
                    XMinBattleInstructions = "Do not battle if stamina is below this points",
                    safeHealthInstructions = "Wait until health is 13 instead of 10, prevents you killing yourself but leaves you unhidden for upto 15 minutes",
                    userIdInstructions = "User IDs(not user name).  Click with the " +
                        "right mouse button on the link to the users profile & copy link." +
                        "  Then paste it here and remove everything but the last numbers." +
                        " (ie. 123456789)",
                    chainBPInstructions = "Number of battle points won to initiate a chain attack. Specify 0 to always chain attack.",
                    chainGoldInstructions = "Amount of gold won to initiate a chain attack. Specify 0 to always chain attack.",
                    maxChainsInstructions = "Maximum number of chain hits after the initial attack.",
                    FMRankInstructions = "The lowest relative rank below yours that " +
                        "you are willing to spend your stamina on. Leave blank to attack " +
                        "any rank. (Uses Battle Rank for invade and duel, War Rank for wars.)",
                    FMARBaseInstructions = "This value sets the base for your Army " +
                        "Ratio calculation [X * (Your Army Size/ Opponent Army Size)]. It is basically a multiplier for the army " +
                        "size of a player at your equal level. A value of 1 means you " +
                        "will battle an opponent the same level as you with an army the " +
                        "same size as you or less. Default .5",
                    FreshMeatARMaxInstructions = "This setting sets the highest value you will use for the Army Ratio [Math.min(Army Ratio, Army Ratio Max)] value. So, if you NEVER want to fight an army bigger than 80% your size, you can set the Max value to .8.",
                    FreshMeatARMinInstructions = "This setting sets the lowest value you will use for the Army Ratio [Math.max(Army Ratio, Army Ratio Min)] value. So, if you NEVER want to pass up an army that is less than 10% the size of yours, you can set MIN value to .1.",
                    FreshMeatMaxLevelInstructions = "This sets the highest relative level, above yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent above level 120, you would code 20.",
                    FreshMeatMinLevelInstructions = "This sets the lowest relative level, below yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent below level 60, you would code 40.",
                    plusonekillsInstructions = "Force +1 kill scenario if 80% or more" +
                        " of targets are withn freshmeat settings. Note: Since Castle Age" +
                        " choses the target, selecting this option could result in a " +
                        "greater chance of loss.",
                    raidPowerAttackInstructions = "Attack raids using the x5 button. (Not recommended).",
                    raidOrderInstructions = "List of search words that decide which " +
                        "raids to participate in first.  Use words in player name or in " +
                        "raid name. To specify max damage follow keyword with :max token " +
                        "and specifiy max damage values. Use 'k' and 'm' suffixes for " +
                        "thousand and million.",
                    ignorebattlelossInstructions = "Ignore battle losses and attack " +
                        "regardless.  This will also delete all battle loss records.",
                    battleList = [
                        'Stamina Available',
                        'At Max Stamina',
                        'At X Stamina',
                        'No Monster',
                        'Stay Hidden',
                        'Demi Points Only',
                        'Recon Only',
                        'Never'
                    ],
                    battleInst = [
                        'Stamina Available will battle whenever you have enough stamina',
                        'At Max Stamina will battle when stamina is at max and will burn down all stamina when able to level up',
                        'At X Stamina you can set maximum and minimum stamina to battle',
                        'No Monster will battle only when there are no active monster battles or if Get Demi Points First has been selected.',
                        'Stay Hidden uses stamina to try to keep you under 10 health so you cannot be attacked, while also attempting to maximize your stamina use for Monster attacks. YOU MUST SET MONSTER TO "STAY HIDDEN" TO USE THIS FEATURE.',
                        'Demi Points Only will battle only when Daily Demi Points are required, can use in conjunction with Get Demi Points First. Does not work with War.',
                        'Only perform Player Recon, does not actually battle players.',
                        'Never - disables player battles'
                    ],
                    typeList = [
                        'Invade',
                        'Duel',
                        'War'
                    ],
                    typeInst = [
                        'Battle using Invade button',
                        'Battle using Duel button - no guarentee you will win though',
                        'War using Duel button - no guarentee you will win though'
                    ],
                    targetList = [
                        'Freshmeat',
                        'Userid List',
                        'Raid'
                    ],
                    targetInst = [
                        'Use settings to select a target from the Battle Page',
                        'Select target from the supplied list of userids',
                        'Raid Battles'
                    ],
                    dosiegeInstructions = "(EXPERIMENTAL) Turns on or off automatic siege assist for all raids only.",
                    collectRewardInstructions = "(EXPERIMENTAL) Automatically collect raid rewards.",
                    observeDemiFirstInstructions = "If you are setting Get demi Points First and No Attack If % Under in Monster then enabling this option " +
                        "will cause Demi Points Only to observe the Demi Points requested in the case where No Attack If % Under is triggered.",
                    PReconInstructions = "Enable player battle reconnaissance to run " +
                        "as an idle background task. Battle targets will be collected and" +
                        " can be displayed using the 'Target List' selection on the " +
                        "dashboard.",
                    htmlCode = '';

                htmlCode = caap.startToggle('Battling', 'BATTLE');
                htmlCode += caap.makeDropDownTR("Battle When", 'WhenBattle', battleList, battleInst, '', 'Never', false, false, 62);
                htmlCode += caap.startDropHide('WhenBattle', '', 'Never', true);
                htmlCode += "<div id='caap_WhenBattleStayHidden_hide' style='color: red; font-weight: bold; display: ";
                htmlCode += (config.getItem('WhenBattle', 'Never') === 'Stay Hidden' && config.getItem('WhenMonster', 'Never') !== 'Stay Hidden' ? 'block' : 'none') + "'>";
                htmlCode += "Warning: Monster Not Set To 'Stay Hidden'";
                htmlCode += "</div>";
                htmlCode += caap.startDropHide('WhenBattle', 'XStamina', 'At X Stamina', false);
                htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XBattleStamina', XBattleInstructions, 1, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinBattleStamina', XMinBattleInstructions, 0, '', '', true, false);
                htmlCode += caap.endDropHide('WhenBattle', 'XStamina');
                htmlCode += caap.startDropHide('WhenBattle', 'DemiOnly', 'Demi Points Only', false);
                htmlCode += caap.makeCheckTR("Observe Get Demi Points First", 'observeDemiFirst', false, observeDemiFirstInstructions);
                htmlCode += caap.endDropHide('WhenBattle', 'DemiOnly');
                htmlCode += caap.makeDropDownTR("Battle Type", 'BattleType', typeList, typeInst, '', '', false, false, 62);
                htmlCode += caap.makeCheckTR("Wait For Safe Health", 'waitSafeHealth', false, safeHealthInstructions);
                htmlCode += caap.makeCheckTR("Siege Weapon Assist Raids", 'raidDoSiege', true, dosiegeInstructions);
                htmlCode += caap.makeCheckTR("Collect Raid Rewards", 'raidCollectReward', false, collectRewardInstructions);
                htmlCode += caap.makeCheckTR("Clear Complete Raids", 'clearCompleteRaids', false, '');
                htmlCode += caap.makeCheckTR("Ignore Battle Losses", 'IgnoreBattleLoss', false, ignorebattlelossInstructions);
                htmlCode += caap.makeNumberFormTR("Chain Battle Points", 'ChainBP', chainBPInstructions, '', '');
                htmlCode += caap.makeNumberFormTR("Chain Gold", 'ChainGold', chainGoldInstructions, '', '', '', false, false, 30);
                htmlCode += caap.makeNumberFormTR("Max Chains", 'MaxChains', maxChainsInstructions, 4, '', '');
                htmlCode += caap.makeTD("Attack targets that are not:");
                htmlCode += caap.makeNumberFormTR("Lower Than Rank Minus", 'FreshMeatMinRank', FMRankInstructions, '', '', '');
                htmlCode += caap.makeNumberFormTR("Higher Than X*AR", 'FreshMeatARBase', FMARBaseInstructions, 0.5, '', '');
                htmlCode += caap.makeCheckTR('Advanced', 'AdvancedFreshMeatOptions', false);
                htmlCode += caap.startCheckHide('AdvancedFreshMeatOptions');
                htmlCode += caap.makeNumberFormTR("Max Level", 'FreshMeatMaxLevel', FreshMeatMaxLevelInstructions, '', '', '', true);
                htmlCode += caap.makeNumberFormTR("Min Level", 'FreshMeatMinLevel', FreshMeatMinLevelInstructions, '', '', '', true);
                htmlCode += caap.makeNumberFormTR("Army Ratio Max", 'FreshMeatARMax', FreshMeatARMaxInstructions, '', '', '', true);
                htmlCode += caap.makeNumberFormTR("Army Ratio Min", 'FreshMeatARMin', FreshMeatARMinInstructions, '', '', '', true);
                htmlCode += caap.endCheckHide('AdvancedFreshMeatOptions');
                htmlCode += caap.makeCheckTR("Enable Player Recon", 'DoPlayerRecon', false, PReconInstructions);
                htmlCode += caap.startCheckHide('DoPlayerRecon');
                htmlCode += caap.makeCheckTR("Do In Background", 'bgRecon', true, "Use AJAX for Player Recon.");
                htmlCode += caap.makeNumberFormTR("Limit Target Records", 'LimitTargets', "Maximum number of records to hold.", 100, '', '');
                htmlCode += caap.makeCheckTR("Stop Recon At Limit", 'stopReconLimit', true, "Stop performing Player Recon when target limit is reached rather than replacing oldest targets with new.");
                htmlCode += caap.endCheckHide('DoPlayerRecon');
                htmlCode += caap.makeDropDownTR("Target Type", 'TargetType', targetList, targetInst, '', '', false, false, 62);
                htmlCode += caap.startDropHide('TargetType', 'Raid', 'Raid', false);
                htmlCode += caap.makeCheckTR("Power Attack", 'RaidPowerAttack', false, raidPowerAttackInstructions, true);
                htmlCode += caap.makeCheckTR("Attempt +1 Kills", 'PlusOneKills', false, plusonekillsInstructions, true);
                htmlCode += caap.makeTD("Join Raids in this order <a href='http://caaplayer.freeforums.org/attack-monsters-in-this-order-clarified-t408.html' target='_blank' style='color: blue'>(INFO)</a>");
                htmlCode += caap.makeTextBox('orderraid', raidOrderInstructions, '');
                htmlCode += caap.endDropHide('TargetType', 'Raid');
                htmlCode += caap.startDropHide('TargetType', 'UserId', 'Userid List', false);
                htmlCode += caap.makeTextBox('BattleTargets', userIdInstructions, '');
                htmlCode += caap.endDropHide('TargetType', 'UserId');
                htmlCode += caap.endDropHide('WhenBattle');
                htmlCode += caap.makeCheckTR("Modify Timers", 'battleModifyTimers', false, "Advanced timers for how often Battle functions are performed.");
                htmlCode += caap.startCheckHide('battleModifyTimers');
                htmlCode += caap.makeNumberFormTR("Battle retry", 'notSafeCount', "Check the Battle/Raid X times before release and delay for other processes. Minimum 1.", 20, '', '', true);
                htmlCode += caap.makeNumberFormTR("Battle delay", 'NoTargetDelay', "Check the Battle/Raid every X seconds when no target available. Minimum 10.", 45, '', '', true);
                htmlCode += caap.endCheckHide('battleModifyTimers');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in battle.menu: " + err);
                return '';
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        dashboard: function () {
            try {
                function points(num) {
                    num = $u.setContent(num, 0);
                    return num >= 0 ? "+" + num : num;
                }

                /*-------------------------------------------------------------------------------------\
                Next we build the HTML to be included into the 'caap_infoBattle' div. We set our
                table and then build the header row.
                \-------------------------------------------------------------------------------------*/
                if (config.getItem('DBDisplay', '') === 'Battle Stats' && session.getItem("BattleDashUpdate", true)) {
                    var headers                 = ['UserId', 'Name',    'BR',     'WR',        'Level',    'Army',    'Invade',           'Duel',        'War'],
                        values                  = ['userId', 'nameStr', 'rankNum', 'warRankNum', 'levelNum', 'armyNum', 'invadewinsNum', 'duelwinsNum', 'warwinsNum'],
                        pp                      = 0,
                        i                       = 0,
                        userIdLink              = '',
                        userIdLinkInstructions  = '',
                        len                     = 0,
                        len1                    = 0,
                        data                    = {text: '', color: '', bgcolor: '', id: '', title: ''},
                        head                    = '',
                        body                    = '',
                        row                     = '';

                    for (pp = 0; pp < headers.length; pp += 1) {
                        switch (headers[pp]) {
                        case 'UserId':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '16%'});
                            break;
                        case 'Name':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '30%'});
                            break;
                        case 'Invade':
                        case 'Duel':
                        case 'War':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '10%'});
                            break;
                        case 'BR':
                        case 'WR':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '5%'});
                            break;
                        default:
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '7%'});
                        }
                    }

                    head = caap.makeTr(head);
                    for (i = 0, len = battle.records.length; i < len; i += 1) {
                        row = "";
                        for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                            switch (values[pp]) {
                            case 'userId':
                                userIdLinkInstructions = "Clicking this link will take you to the user keep of " + battle.records[i][values[pp]];
                                //userIdLink = caap.domain.link + "/keep.php?casuser=" + battle.records[i][values[pp]];
                                userIdLink = "keep.php?casuser=" + battle.records[i][values[pp]];
                                data = {
                                    text  : '<span id="caap_battle_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                            '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + battle.records[i][values[pp]] + '</span>',
                                    color : 'blue',
                                    id    : '',
                                    title : ''
                                };

                                row += caap.makeTd(data);
                                break;
                            case 'rankNum':
                                row += caap.makeTd({text: battle.records[i][values[pp]], color: '', id: '', title: battle.records[i]['rankStr']});
                                break;
                            case 'warRankNum':
                                row += caap.makeTd({text: battle.records[i][values[pp]], color: '', id: '', title: battle.records[i]['warRankStr']});
                                break;
                            case 'invadewinsNum':
                                row += caap.makeTd({text: battle.records[i][values[pp]] + "/" + battle.records[i]['invadelossesNum'] + " " + points(battle.records[i]['ibp']), color: '', id: '', title: ''});
                                break;
                            case 'duelwinsNum':
                                row += caap.makeTd({text: battle.records[i][values[pp]] + "/" + battle.records[i]['duellossesNum'] + " " + points(battle.records[i]['dbp']), color: '', id: '', title: ''});
                                break;
                            case 'warwinsNum':
                                row += caap.makeTd({text: battle.records[i][values[pp]] + "/" + battle.records[i]['warlossesNum'] + " " + points(battle.records[i]['wbp']), color: '', id: '', title: ''});
                                break;
                            default:
                                row += caap.makeTd({text: battle.records[i][values[pp]], color: '', id: '', title: ''});
                            }
                        }

                        body += caap.makeTr(row);
                    }

                    $j("#caap_infoBattle", caap.caapTopObject).html(
                        $j(caap.makeTable("battle", head, body)).dataTable({
                            "bAutoWidth"    : false,
                            "bFilter"       : false,
                            "bJQueryUI"     : false,
                            "bInfo"         : false,
                            "bLengthChange" : false,
                            "bPaginate"     : false,
                            "bProcessing"   : false,
                            "bStateSave"    : true,
                            "bSortClasses"  : false
                        })
                    );

                    $j("span[id*='caap_battle_']", caap.caapTopObject).click(function (e) {
                        var visitUserIdLink = {
                                rlink     : '',
                                arlink    : ''
                            },
                            i   = 0,
                            len = 0;

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'rlink') {
                                visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                                //visitUserIdLink.arlink = visitUserIdLink.rlink.replace(caap.domain.link + "/", "");
                                visitUserIdLink.arlink = visitUserIdLink.rlink;
                            }
                        }

                        caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                    });

                    session.setItem("BattleDashUpdate", false);
                }

                return true;
            } catch (err) {
                con.error("ERROR in battle.dashboard: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                              PLAYER RECON
        /////////////////////////////////////////////////////////////////////

        /*-------------------------------------------------------------------------------------\
                                          RECON PLAYERS
        reconPlayers is an idle background process that scans the battle page for viable
        targets that can later be attacked.
        \-------------------------------------------------------------------------------------*/

        reconRecords: [],

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        reconRecord: function () {
            this.data = {
                'userId'          : 0,
                'nameStr'         : '',
                'rankNum'         : 0,
                'warRankNum'      : 0,
                'levelNum'        : 0,
                'armyNum'         : 0,
                'deityNum'        : 0,
                'aliveTime'       : 0
            };
        },
        /*jslint sub: false */

        reconhbest: 2,

        loadRecon: function () {
            battle.reconRecords = gm.getItem('recon.records', 'default');
            if (battle.reconRecords === 'default' || !$j.isArray(battle.reconRecords)) {
                battle.reconRecords = gm.setItem('recon.records', []);
            }

            battle.reconhbest = battle.reconhbest === false ? JSON.hbest(battle.reconRecords) : battle.reconhbest;
            con.log(3, "recon.records Hbest", battle.reconhbest);
            session.setItem("ReconDashUpdate", true);
            con.log(3, "recon.records", battle.reconRecords);
        },

        saveRecon: function (src) {
            var compress = false;
            if (caap.domain.which === 3) {
                caap.messaging.setItem('battle.reconRecords', battle.reconRecords);
            } else {
                gm.setItem('recon.records', battle.reconRecords, battle.reconhbest, compress);
                con.log(3, "recon.records", battle.reconRecords);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    con.log(2, "battle.saveRecon send");
                    caap.messaging.setItem('general.records', general.records);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("ReconDashUpdate", true);
            }
        },

        reconInProgress: false
    };
