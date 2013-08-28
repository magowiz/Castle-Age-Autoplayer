/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,gm,hiddenVar,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,battle,conquest,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          CONQUEST OBJECT
// this is the main object for dealing with Conquest
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

    conquest.records = [];

    conquest.targetsOnPage = [];

    conquest.targets = [];

    conquest.record = function() {
        this.data = {
            'userId': 0,
            'nameStr': '',
            'rankNum': 0,
            'levelNum': 0,
            'armyNum': 0,
            'invadewinsNum': 0,
            'invadelossesNum': 0,
            'ibp': 0,
            'duelwinsNum': 0,
            'duellossesNum': 0,
            'dbp': 0,
            'statswinsNum': 0,
            'statslossesNum': 0,
            'chainCount': 0,
            'invadeLostTime': 0,
            'duelLostTime': 0,
            'deadTime': 0,
            'chainTime': 0,
            'ignoreTime': 0,
            'aliveTime': 0,
            'attackTime': 0,
            'selectTime': 0,
            'unknownTime': 0,
            'score': 0,
            'newRecord': true
        };
    };

    conquest.conquestRankTier = function(points) {
        var tier = 0;

        if (points >= 50000) {
            tier = 18;
        } else if (points >= 43000) {
            tier = 17;
        } else if (points >= 37000) {
            tier = 16;
        } else if (points >= 32500) {
            tier = 15;
        } else if (points >= 27000) {
            tier = 14;
        } else if (points >= 22500) {
            tier = 13;
        } else if (points >= 19500) {
            tier = 12;
        } else if (points >= 14000) {
            tier = 11;
        } else if (points >= 10000) {
            tier = 10;
        } else if (points >= 7500) {
            tier = 9;
        } else if (points >= 5000) {
            tier = 8;
        } else if (points >= 3000) {
            tier = 7;
        } else if (points >= 2000) {
            tier = 6;
        } else if (points >= 1200) {
            tier = 5;
        } else if (points >= 700) {
            tier = 4;
        } else if (points >= 450) {
            tier = 3;
        } else if (points >= 250) {
            tier = 2;
        } else if (points >= 100) {
            tier = 1;
        }

        return tier;
    };

    conquest.conquestRankTable = {
        0: 'Grunt',
        1: 'Scout',
        2: 'Soldier',
        3: 'Elite Soldier',
        4: 'Squire',
        5: 'Night',
        6: 'First Night',
        7: 'Legionnaire',
        8: 'Centurian',
        9: 'Champion',
        10: 'Lt Commander',
        11: 'Commander',
        12: 'High Commander',
        13: 'Lieutenant General',
        14: 'General',
        15: 'High General',
        16: 'Baron',
        17: 'Earl',
        18: 'Duke'
    };

    conquest.hbest = 2;

    conquest.load = function() {
        try {
            conquest.records = gm.getItem('conquest.records', 'default');
            if (conquest.records === 'default' || !$j.isArray(conquest.records)) {
                conquest.records = gm.setItem('conquest.records', []);
            }

            conquest.hbest = conquest.hbest === false ? JSON.hbest(conquest.records) : conquest.hbest;
            con.log(2, "conquest.load Hbest", conquest.hbest);
            session.setItem("ConquestDashUpdate", true);
            con.log(1, "conquest.load", conquest.records);
            return true;
        } catch (err) {
            con.error("ERROR in conquest.load: " + err);
            return false;
        }
    };

    conquest.save = function(src) {
        try {
            var compress = false;

            if (caap.domain.which === 3) {
                caap.messaging.setItem('conquest.records', conquest.records);
            } else {
                gm.setItem('conquest.records', conquest.records, conquest.hbest, compress);
                con.log(2, "conquest.save", conquest.records);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    caap.messaging.setItem('conquest.records', conquest.records);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("ConquestDashUpdate", true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in conquest.save: " + err);
            return false;
        }
    };

    conquest.clear = function() {
        try {
            conquest.records = [];
            conquest.save();
            session.setItem("ConquestDashUpdate", true);
            return true;
        } catch (err) {
            con.error("ERROR in conquest.clear: " + err);
            return false;
        }
    };

    conquest.getItem = function(userId) {
        try {
            var it = 0,
                len = 0,
                success = false,
                newRecord = null;

            if (userId === '' || $u.isNaN(userId) || userId < 1) {
                con.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0, len = conquest.records.length; it < len; it += 1) {
                if (conquest.records[it].userId === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                con.log(2, "Got conquest record", userId, conquest.records[it]);
                conquest.records[it].newRecord = false;
                return conquest.records[it];
            }

            newRecord = new conquest.record();
            newRecord.data.userId = userId;
            con.log(2, "New conquest record", userId, newRecord.data);
            return newRecord.data;
        } catch (err) {
            con.error("ERROR in conquest.getItem: " + err);
            return false;
        }
    };

    conquest.setItem = function(record) {
        try {
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (record.userId === '' || $u.isNaN(record.userId) || record.userId < 1) {
                con.warn("userId", record.userId);
                throw "Invalid identifying userId!";
            }

            var it = 0,
                len = 0,
                success = false;

            for (it = 0, len = conquest.records.length; it < len; it += 1) {
                if (conquest.records[it].userId === record.userId) {
                    success = true;
                    break;
                }
            }

            record.newRecord = false;
            if (success) {
                conquest.records[it] = record;
                con.log(1, "Updated conquest record", record, conquest.records);
            } else {
                conquest.records.push(record);
                con.log(1, "Added conquest record", record, conquest.records);
            }

            conquest.save();
            return true;
        } catch (err) {
            con.error("ERROR in conquest.setItem: " + err, record);
            return false;
        }
    };

    conquest.deleteItem = function(userId) {
        try {
            var it = 0,
                len = 0,
                success = false;

            if (userId === '' || $u.isNaN(userId) || userId < 1) {
                con.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0, len = conquest.records.length; it < len; it += 1) {
                if (conquest.records[it].userId === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                conquest.records.splice(it, 1);
                conquest.save();
                con.log(1, "Deleted conquest record", userId, conquest.records);
                return true;
            }

            con.warn("Unable to delete conquest record", userId, conquest.records);
            return false;
        } catch (err) {
            con.error("ERROR in conquest.deleteItem: " + err);
            return false;
        }
    };

    conquest.hashCheck = function(record) {
        try {
            var hash = '',
                hashes = [
                    "3f56e5f147545c2069f615aa2ebc80d2eef34d48",
                    "8caeb4b385c1257419ee18dee47cfa3a1271ba77",
                    "02752cf4b979dd5a77b53694917a60f944cb772f",
                    "c644f2fdcf1a7d721b82efab5313df609442c4f9",
                    "8d29caf6400807789964185405b0f442e6cacae7",
                    "7f04c6d6d1110ce05532ca508efde5dbafe7ec17"
                ];

            if (!hashes.length || !(gm ? gm.getItem('AllowProtected', true, hiddenVar) : true)) {
                return false;
            }

            if (record.userId === '' || $u.isNaN(record.userId) || record.userId < 1) {
                con.warn("userId", record);
                throw "Invalid identifying userId!";
            }

            hash = (record.userId.toString().SHA1() + record.nameStr).SHA1();
            return (hashes.hasIndexOf(hash));
        } catch (err) {
            con.error("ERROR in conquest.hashCheck: " + err);
            return false;
        }
    };

    /*
    conquest.deadCheck = function() {
        try {
            var targetRecord = {},
                dead = false;

            if (state.getItem("lastConquestID", 0)) {
                targetRecord = conquest.getItem(state.getItem("lastConquestID", 0));
            }

            if ($u.hasContent($j("#app_body #results_main_wrapper"))) {
                if ($u.hasContent(caap.resultsText)) {
                    if (/Your opponent is dead or too weak to conquest/.test(caap.resultsText)) {
                        con.log(1, "This opponent is dead or hiding: ", state.getItem("lastConquestID", 0));
                        if ($j.isPlainObject(targetRecord) && !$j.isEmptyObject(targetRecord)) {
                            targetRecord.deadTime = Date.now();
                        }

                        dead = true;
                    }
                } else {
                    if ($j.isPlainObject(targetRecord) && !$j.isEmptyObject(targetRecord)) {
                        targetRecord.unknownTime = Date.now();
                    }

                    con.warn("Unable to determine if user is dead!");
                    dead = null;
                }
            } else {
                if ($j.isPlainObject(targetRecord) && !$j.isEmptyObject(targetRecord)) {
                    targetRecord.unknownTime = Date.now();
                }

                con.warn("Unable to find any results!");
                dead = null;
            }

            if (dead !== false && $j.isPlainObject(targetRecord) && !$j.isEmptyObject(targetRecord)) {
                conquest.setItem(targetRecord);
            }

            return dead;
        } catch (err) {
            con.error("ERROR in conquest.deadCheck: " + err);
            return undefined;
        }
    };
    */

    conquest.click = function(conquestButton) {
        try {
            session.setItem('ReleaseControl', true);
            conquest.flagResult = true;
            caap.setDomWaiting("conquest_duel.php");
            caap.click(conquestButton);
            return true;
        } catch (err) {
            con.error("ERROR in conquest.click: " + err);
            return false;
        }
    };

    conquest.battles = {
        'Invade': 'war_conquest_invadebtn.gif',
        'Duel': 'war_conquest_duelbtn.gif',
        'InvadeChain': 'war_invadeagainbtn.gif',
        'DuelChain': 'war_duelagainbtn.gif'
    };

    conquest.getCommonInfos = function(slice) {
        try {
            var levelDiv = $j(),
                percentageDiv = $j(),
                rechargeDiv = $j(),
                rechargeSecs = 0,
                timeDiv = $j(),
                timeSecs = 0,
                tokensDiv = $j(),
                tempText = '',
                passedStats = true,
                passedTimes = true;

            if (!$u.hasContent(slice)) {
                con.warn("No slice passed to conquest.getCommonInfos");
                levelDiv = null;
                percentageDiv = null;
                rechargeDiv = null;
                timeDiv = null;
                tokensDiv = null;
                return;
            }

            if (caap.hasImage('guild_tab6_on.jpg')) {
                tempText = slice.text();
                if ($u.hasContent(tempText)) {
                    caap.stats.resources.lumber = $u.setContent(tempText.regex(/^\s+(\d+)\s+\d+/i), 0);
                    caap.stats.resources.iron = $u.setContent(tempText.regex(/^\s+\d+\s+(\d+)/i), 0);
                    caap.stats.guild.level = $u.setContent(tempText.regex(/\s+GUILD LEVEL:\s+(\d+)/i), 0);
                    caap.stats.rank.conquestLevel = $u.setContent(tempText.regex(/\s+CONQUEST LV:\s+(\d+)/i), 0);
                } else {
                    con.warn("Unable to get slice text", slice);
                    passedStats = false;
                }
            } else if (caap.hasImage('conqduel_on.jpg')) {
                levelDiv = $j("div[style*='width:160px;height:12px;color:#80cfec']", slice);
                if ($u.hasContent(levelDiv)) {
                    caap.stats.rank.conquestLevel = $u.setContent(levelDiv.text(), '').regex(/(\d+)/);
                } else {
                    con.warn("Unable to get conquest levelDiv");
                    levelDiv = null;
                    percentageDiv = null;
                    rechargeDiv = null;
                    timeDiv = null;
                    tokensDiv = null;
                    return;
                }
            } else {
                con.warn("Unable to get infos from this page");
                passedStats = false;
            }

            percentageDiv = $j("div[style*='war_redbar.jpg']", slice);
            if ($u.hasContent(percentageDiv && percentageDiv.length === 2)) {
                caap.stats.guild.levelPercent = $u.setContent(percentageDiv.getPercent('width'), 0);
            } else if ($u.hasContent(percentageDiv) && percentageDiv.length === 1) {
                caap.stats.rank.conquestLevelPercent = $u.setContent(percentageDiv.getPercent('width'), 0);
            } else {
                con.warn("Unable to get conquest percentageDiv");
                passedStats = false;
            }

            tokensDiv = $j("#guild_token_current_value", slice).parent();
            if ($u.hasContent(tokensDiv)) {
                tempText = $u.setContent(tokensDiv.text(), '').stripTRN();
                if ($u.hasContent(tempText)) {
                    caap.stats.guildTokens.num = $u.setContent(tempText.regex(/(\d+)\/\d+/), 0);
                    caap.stats.guildTokens.max = $u.setContent(tempText.regex(/\d+\/(\d+)/), 0);
                } else {
                    con.warn("Unable to get tokensDiv text", tokensDiv);
                    passedStats = false;
                }
            } else {
                tokensDiv = $j("#guild_token_current_value_amount", slice);
                if ($u.hasContent(tokensDiv)) {
                    tempText = $u.setContent(tokensDiv.val(), '');
                    if ($u.hasContent(tempText)) {
                        caap.stats.guildTokens.num = $u.setContent(tempText.regex(/(\d+)/), 0);
                    } else {
                        con.warn("Unable to get guild_token_current_value_amount text", tokensDiv);
                        passedStats = false;
                    }
                } else {
                    con.warn("Unable to get conquest tokensMaxDiv");
                    passedStats = false;
                }

                tokensDiv = $j("#guild_token_current_max", slice);
                if ($u.hasContent(tokensDiv)) {
                    tempText = $u.setContent(tokensDiv.val(), '');
                    if ($u.hasContent(tempText)) {
                        caap.stats.guildTokens.max = $u.setContent(tempText.regex(/(\d+)/), 0);
                        if (caap.stats.guildTokens.max < 10){
                            con.warn("guild_token_current_max ia too low", caap.stats.guildTokens.max);
                            passedStats = false;
                        }
                    } else {
                        con.warn("Unable to get guild_token_current_max text", tokensDiv);
                        passedStats = false;
                    }
                } else {
                    con.warn("Unable to get conquest tokensMaxDiv");
                    passedStats = false;
                }
            }

            caap.stats.guildTokens.dif = caap.stats.guildTokens.max - caap.stats.guildTokens.num;

            con.log(1, "conquest.battle", caap.stats.rank, caap.stats.guildTokens);
            if (passedStats) {
                caap.saveStats();
            }

            if (passedStats && caap.stats.guildTokens.max >= 10 && caap.stats.guildTokens.num < caap.stats.guildTokens.max) {
                rechargeDiv = $j("#guild_token_current_recharge_time", slice);
                if ($u.hasContent(rechargeDiv)) {
                    rechargeSecs = $u.setContent(rechargeDiv.val(), '').regex(/(\d+)/);
                } else {
                        con.warn("Unable to get conquest rechargeDiv");
                        passedTimes = false;
                }

                timeDiv = $j("#guild_token_time_sec", slice);
                if ($u.hasContent(timeDiv)) {
                    timeSecs = $u.setContent(timeDiv.val(), '').regex(/(\d+)/);
                    schedule.setItem("conquest_token", timeSecs, 300);
                } else {
                        con.warn("Unable to get conquest timeDiv");
                        passedTimes = false;
                }
            } else {
                schedule.setItem("conquest_token", 300, 0);
            }

            con.log(1, "conquest.getCommonInfos", caap.stats, rechargeSecs, timeSecs);

            levelDiv = null;
            percentageDiv = null;
            rechargeDiv = null;
            timeDiv = null;
            tokensDiv = null;
        } catch (err) {
            con.error("ERROR in conquest.getCommonInfos: " + err);
        }
    };

    conquest.targeting = function() {
        function logOpponent(opponent, reason, conditions) {
            con.log(2, (reason === 'sorted' ? 1 : 2), (opponent.nameStr.lpad(' ', 20) + opponent.userId.lpad(' ', 16) +
                opponent.levelNum.lpad(' ', 4) + conquest.conquestRankTable[opponent.rankNum].lpad(' ', 16) +
                opponent.armyNum.lpad(' ', 4) + opponent.score.dp().lpad(' ', 5)), reason, conditions);
        }

        try {
            var opponentsSlice = $j("#app_body div[style*='war_conquest_mid']"),
                minRank = 0,
                maxRank = 0,
                minLevel = 0,
                maxLevel = 0,
                ARBase = 0,
                ARMin = 0,
                ARMax = 0,
                it = 0,
                len = 0,
                conquesttype = config.getItem('ConquestType', 'Invade'),
                targets = [];

            con.log(1, "conquest.targeting begins", caap.stats);

            conquest.targetsOnPage = [];
            conquest.targets = [];

            con.log(1, "in battle", opponentsSlice);
            if (!$u.hasContent(opponentsSlice)) {
                con.warn("missing opponentsSlice");
                opponentsSlice = null;
                return;
            }

            minLevel = config.getItem("ConquestMinLevel", 99999);
            con.log(1, "ConquestMinLevel", minLevel);
            if (minLevel === '' || $u.isNaN(minLevel)) {
                if (minLevel !== '') {
                    con.warn("ConquestMinLevel is NaN, using default", minLevel);
                }

                minLevel = 99999;
            }

            maxLevel = config.getItem("ConquestMaxLevel", 99999);
            con.log(1, "ConquestMaxLevel", maxLevel);
            if (maxLevel === '' || $u.isNaN(maxLevel)) {
                if (maxLevel !== '') {
                    con.warn("ConquestMaxLevel is NaN, using default", maxLevel);
                }

                maxLevel = 99999;
            }

            minRank = config.getItem("ConquestMinRank", 99);
            con.log(1, "ConquestMinRank", minRank);
            if (minRank === '' || $u.isNaN(minRank)) {
                if (minRank !== '') {
                    con.warn("ConquestMinRank is NaN, using default", 99);
                }

                minRank = 99;
            }

            maxRank = config.getItem("ConquestMaxRank", 99);
            con.log(1, "ConquestMaxRank", maxRank);
            if (maxRank === '' || $u.isNaN(maxRank)) {
                if (maxRank !== '') {
                    con.warn("ConquestMaxRank is NaN, using default", 99);
                }

                maxRank = 99;
            }

            ARBase = config.getItem("ConquestARBase", 0.7);
            con.log(1, "ConquestARBase", ARBase);
            if (ARBase === '' || $u.isNaN(ARBase)) {
                if (ARBase !== '') {
                    con.warn("ConquestARBase is NaN, using default", ARBase);
                }

                ARBase = 0.7;
            }

            ARMin = config.getItem("ConquestARMin", 0);
            con.log(1, "ConquestARMin", ARMin);
            if (ARMin === '' || $u.isNaN(ARMin)) {
                if (ARMin !== '') {
                    con.warn("ConquestARMin is NaN, using default", ARMin);
                }

                ARMin = 0;
            }

            ARMax = config.getItem("ConquestARMax", 99999);
            con.log(1, "ConquestARMax", ARMax);
            if (ARMax === '' || $u.isNaN(ARMax)) {
                if (ARMax !== '') {
                    con.warn("ConquestARMax is NaN, using default", ARMax);
                }

                ARMax = 99999;
            }

            con.log(1, "My rank/type is", conquest.conquestRankTable[caap.stats.rank.conquest], caap.stats.rank.conquest, conquesttype);

            opponentsSlice.each(function() {
                var opponentDiv = $j(this),
                    boxesDiv = opponentDiv.children("div"),
                    tempDiv = $j(),
                    tempText = '',
                    battleRecord = {},
                    levelMultiplier = 0,
                    armyRatio = 0,
                    tempTime = 0;

                if ($u.hasContent(boxesDiv) && boxesDiv.length === 7 ) {
                    var playerDiv = boxesDiv.eq(2),
                        armyDiv = boxesDiv.eq(3),
                        idDiv = boxesDiv.eq(5);
                } else {
                    con.warn("skipping opponent, missing boxes", opponentDiv);
                    opponentDiv = null;
                    boxesDiv = null;
                    tempDiv = null;
                    return;
                }

                var userId = parseInt($j("input[name='target_id']",idDiv)[0].defaultValue,10);
                if (userId > 0) {
                    battleRecord = conquest.getItem(userId);
                } else {
                    con.warn("skipping opponent, unable to get userid", tempText);
                    opponentDiv = null;
                    boxesDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    idDiv = null;
                    userId = null;
                    return;
                }

                if ($u.hasContent(playerDiv)) {
                    tempText = $u.setContent(playerDiv.text(), '');
                    if ($u.hasContent(tempText)) {
                        battleRecord.nameStr = $u.setContent(tempText.regex(/\s*(.+) \(Level/), '');
                        battleRecord.levelNum = $u.setContent(tempText.regex(/Level (\d+)/i), -1);
                        battleRecord.rankNum = $u.setContent(tempText.regex(/Rank (\d+)/i), -1);

                        if (battleRecord.nameStr === '') {
                            con.warn("Unable to match opponent's name", tempText);
                        }

                        if (!$u.isNumber(battleRecord.levelNum) || !$u.isNumber(battleRecord.rankNum) || battleRecord.levelNum === -1 || battleRecord.rankNum === -1) {
                            con.warn("skipping opponent, unable to get level or rank", tempText);
                            opponentDiv = null;
                            boxesDiv = null;
                            idDiv = null;
                            playerDiv = null;
                            armyDiv = null;
                            tempDiv = null;
                            return;
                        }
                    } else {
                        con.warn("No text in playerDiv");
                        opponentDiv = null;
                        boxesDiv = null;
                        idDiv = null;
                        playerDiv = null;
                        armyDiv = null;
                        tempDiv = null;
                        return;
                    }
                } else {
                    con.warn("skipping opponent, missing playerDiv", opponentDiv);
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if ($u.hasContent(armyDiv)) {
                    tempText = $u.setContent(armyDiv.text(), '');
                    if ($u.hasContent(tempText)) {
                        battleRecord.armyNum = $u.setContent(tempText.regex(/(\d+)/i), -1);

                        if (battleRecord.armyNum=== -1) {
                            con.warn("skipping opponent, unable to get army", tempText);
                            opponentDiv = null;
                            boxesDiv = null;
                            idDiv = null;
                            playerDiv = null;
                            armyDiv = null;
                            tempDiv = null;
                            return;
                        }
                    } else {
                        con.warn("No text in armyDiv");
                        opponentDiv = null;
                        boxesDiv = null;
                        idDiv = null;
                        playerDiv = null;
                        armyDiv = null;
                        tempDiv = null;
                        return;
                    }
                } else {
                    con.warn("skipping opponent, missing armyDiv", opponentDiv);
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }
                levelMultiplier = caap.stats.level / battleRecord.levelNum;
                battleRecord.score = battleRecord.rankNum - (battleRecord.armyNum / levelMultiplier / caap.stats.army.capped);
                conquest.targetsOnPage.push(battleRecord);
                if (!$u.isNumber(caap.stats.level) || (caap.stats.level - minLevel > battleRecord.levelNum)) {
                    logOpponent(battleRecord, "minLevel", {
                        'level': battleRecord.levelNum,
                        'levelDif': caap.stats.level - battleRecord.levelNum,
                        'minLevel': minLevel
                    });

                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if (!$u.isNumber(caap.stats.level) || (caap.stats.level + maxLevel <= battleRecord.levelNum)) {
                    logOpponent(battleRecord, "maxLevel", {
                        opponent: battleRecord,
                        'level': battleRecord.levelNum,
                        'levelDif': battleRecord.levelNum - caap.stats.level,
                        'maxLevel': maxLevel
                    });

                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if (!$u.isNumber(caap.stats.rank.conquest) || (caap.stats.rank.conquest - minRank > battleRecord.rankNum)) {
                    logOpponent(battleRecord, "minRank", {
                        opponent: battleRecord,
                        'rankDif': caap.stats.rank.conquest - battleRecord.rankNum,
                        'minRank': minRank
                    });

                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if (!$u.isNumber(caap.stats.rank.conquest) || (caap.stats.rank.conquest + maxRank <= battleRecord.rankNum)) {
                    logOpponent(battleRecord, "maxRank", {
                        opponent: battleRecord,
                        'rankDif': battleRecord.rankNum - caap.stats.rank.conquest,
                        'minRank': minRank
                    });

                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                levelMultiplier = $u.setContent(caap.stats.level, 0) / $u.setContent(battleRecord.levelNum, 1);
                armyRatio = ARBase * levelMultiplier;
                armyRatio = Math.min(armyRatio, ARMax);
                armyRatio = Math.max(armyRatio, ARMin);
                if (armyRatio <= 0) {
                    con.warn("Bad ratio", armyRatio, ARBase, ARMin, ARMax, levelMultiplier);
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // if we know our army size, and this one is larger than armyRatio, don't conquest
                if (conquesttype === 'Invade' && caap.stats.army.capped && (battleRecord.armyNum > (caap.stats.army.capped * armyRatio))) {
                    logOpponent(battleRecord, "armyRatio", {
                        'armyRatio': armyRatio.dp(2),
                        'armyNum': battleRecord.armyNum ,
                        'armyMax': (caap.stats.army.capped * armyRatio).dp()
                    });

                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // don't conquest people we lost to in the last week
                if (conquesttype === 'Invade') {
                    tempTime = $u.setContent(battleRecord.invadeLostTime, 0);
                } else if (conquesttype === 'Duel') {
                    tempTime = $u.setContent(battleRecord.duelLostTime, 0);
                } else {
                    con.warn("Conquest type unknown!", conquesttype);
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if (battleRecord && !battleRecord.newRecord && tempTime && !schedule.since(tempTime, 604800)) {
                    logOpponent(battleRecord, "We lost to this id this week", '');
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // don't conquest people that results were unknown in the last hour
                tempTime = $u.setContent(battleRecord.unknownTime, 0);
                if (battleRecord && !battleRecord.newRecord && !schedule.since(tempTime, 3600)) {
                    logOpponent(battleRecord, "User was conquestd but results unknown in the last hour", '');
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // don't conquest people that were dead or hiding in the last hour
                tempTime = $u.setContent(battleRecord.deadTime, 0);
                if (battleRecord && !battleRecord.newRecord && !schedule.since(tempTime, 3600)) {
                    logOpponent(battleRecord, "User was dead in the last hour", '');
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // don't conquest people we've already chained to max in the last 2 days
                tempTime = $u.setContent(battleRecord.chainTime, 0);
                if (battleRecord && !battleRecord.newRecord && !schedule.since(tempTime, 86400)) {
                    logOpponent(battleRecord, "We chained user within 2 days", '');
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                // don't conquest people that didn't meet chain points in the last week
                tempTime = $u.setContent(battleRecord.ignoreTime, 0);
                if (battleRecord && !battleRecord.newRecord && !schedule.since(tempTime, 604800)) {
                    logOpponent(battleRecord, "User didn't meet chain requirements this week", '');
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                if (battleRecord && conquest.hashCheck(battleRecord)) {
                    opponentDiv = null;
                    boxesDiv = null;
                    idDiv = null;
                    playerDiv = null;
                    armyDiv = null;
                    tempDiv = null;
                    return;
                }

                conquest.targets.push(battleRecord.userId);
                logOpponent(battleRecord, "match", '');

                opponentDiv = null;
                boxesDiv = null;
                idDiv = null;
                playerDiv = null;
                armyDiv = null;
                tempDiv = null;
            });

            targets.sort($u.sortBy(true, "score"));

            for (it = 0, len = targets.length; it < len; it += 1) {
                logOpponent(targets[it], 'sorted', '');
                conquest.targets.push(targets[it].userId);
            }

            opponentsSlice = null;
        } catch (err) {
            con.error("ERROR in conquest.targeting: " + err);
        }
    };

    conquest.getResults = function(slice) {
        try {
            var bottomDiv = $j(),
                buttonDiv = $j(),
                targetDiv = $j(),
                tempText = '',
                result = 'unknown',
                type = 'unknown',
                name = 'unknown',
                userId = -1,
                points = -1,
                it = 0,
                len = 0,
                targetRecord = {},
                tempTime = 0,
                chainBP = '',
                maxChains = 0;

            if (!$u.hasContent(slice)) {
                con.warn("No slice passed to conquest.getResults");
                bottomDiv = null;
                buttonDiv = null;
                targetDiv = null;
                return;
            }

            tempText = slice.attr('style');
            if ($u.hasContent(tempText)) {
                result = $u.setContent(tempText.regex(/war_fort_battle(\S+).jpg/), 'unknown');
                if (!$u.hasContent(result) || (result !== 'victory' && result !== 'defeat')) {
                    con.warn("conquest.battle: result unknown", tempText);
                }
            } else {
                con.warn("conquest.battle: missing resultDiv");
            }

            bottomDiv = $j("#app_body div[style*='conqduel_battlebottom2.jpg']");
            if ($u.hasContent(bottomDiv)) {
                targetDiv = $j("input[name='target_id']", bottomDiv);
                if ($u.hasContent(targetDiv)) {
                    tempText = targetDiv.val();
                    if ($u.hasContent(tempText)) {
                        userId = $u.setContent(tempText.regex(/(\d+)/i), -1);
                        if (!$u.hasContent(userId) || userId === -1) {
                            con.warn("conquest.battle: userId unknown", tempText);
                        }
                    } else {
                        con.warn("conquest.battle: missing targetDiv tempText");
                    }
                } else {
                    con.warn("conquest.battle: missing targetDiv");
                }

                targetDiv = bottomDiv.children().eq(1);
                if ($u.hasContent(targetDiv)) {
                    tempText = targetDiv.text();
                    if ($u.hasContent(tempText)) {
                        name = $u.setContent(tempText.regex(/\s+(.+)\s+\d+ Conquest Rank Pts/i), '').trim().innerTrim();
                        if (!$u.hasContent(name) || name === '') {
                            con.warn("conquest.battle: name unknown", tempText);
                        }
                    } else {
                        con.warn("conquest.battle: missing name targetDiv tempText");
                    }
                } else {
                    con.warn("conquest.battle: missing name targetDiv");
                }

                buttonDiv = $j('input[name="duel"]',bottomDiv);

                if ($u.hasContent(buttonDiv)) {
                    tempText = buttonDiv.val();
                    type = tempText == 'true' ? 'duel' : 'invade';
                } else {
                    type = 'unknown';
                    con.warn("conquest.battle: missing buttonDiv");
                }

                tempText = $u.setContent(bottomDiv.text(), '');
                if ($u.hasContent(tempText)) {
                    points = $u.setContent(tempText.regex(/(\d+) Conquest Rank Pts/), -1);
                    if (!$u.hasContent(points) || points === -1) {
                        con.warn("conquest.battle: missing Conquest Rank Pts", tempText);
                    }
                } else {
                    con.warn("conquest.battle: missing bottomDiv tempText");
                }
            } else {
                con.warn("conquest.battle: missing bottomDiv");
            }

            con.log(1, "conquest.getResults", userId, name, type, result, points);

            if (userId > 0)  {
                con.log(1, "Searching targets on page");
                for (it = 0, len = conquest.targetsOnPage.length; it < len; it += 1) {
                    if (conquest.targetsOnPage[it].userId === userId) {
                        targetRecord = conquest.targetsOnPage[it];
                    }
                }

                if (!$u.hasContent(targetRecord)) {
                    con.log(1, "No target record found, searching/creating conquest records");
                    targetRecord = conquest.getItem(userId);
                } else {
                    con.log(1, "Target found on page", targetRecord);
                }

                targetRecord.attackTime = Date.now();
                if ($u.hasContent(name) && name !== 'unknown' && name !== targetRecord.nameStr) {
                    con.log(1, "Updating conquest record user name, from/to", targetRecord.nameStr, name);
                    targetRecord.nameStr = name;
                }

                if ($u.hasContent(result) && (result === 'victory' || result === 'defeat')) {
                    if ($u.hasContent(type) && (type === 'invade' || type === 'duel')) {
                        if (type === 'invade') {
                          if (result === 'victory') {
                                targetRecord.statswinsNum += 1;
                                targetRecord.invadewinsNum += 1;
                                targetRecord.ibp += points;
                            } else {
                                targetRecord.statslossesNum += 1;
                                targetRecord.invadelossesNum += 1;
                                targetRecord.ibp -= points;
                                targetRecord.invadeLostTime = Date.now();
                            }
                        } else {
                            if (result === 'victory') {
                                targetRecord.statswinsNum += 1;
                                targetRecord.duelwinsNum += 1;
                                targetRecord.dbp += points;
                            } else {
                                targetRecord.statslossesNum += 1;
                                targetRecord.duellossesNum += 1;
                                targetRecord.dbp -= points;
                                targetRecord.duelLostTime = Date.now();
                            }
                        }

                        if (result === 'victory') {
                            con.log(1, "Chain check");
                            //Test if we should chain this guy
                            tempTime = $u.setContent(targetRecord.chainTime, 0);
                            chainBP = config.getItem('ConquestChainBP', '');
                            if (schedule.since(tempTime, 86400) && ((chainBP !== '' && !$u.isNaN(chainBP) && chainBP >= 0))) {
                                if (chainBP !== '' && !$u.isNaN(chainBP) && chainBP >= 0) {
                                    if (points >= chainBP) {
                                        state.setItem("ConquestChainId", targetRecord.userId);
                                        con.log(1, "Chain Attack:", targetRecord.userId, "Conquest Points: " + points);
                                    } else {
                                        con.log(1, "Ignore Chain Attack:", targetRecord.userId, "Conquest Points: " + points);
                                        targetRecord.ignoreTime = Date.now();
                                    }
                                }
                            }

                            targetRecord.chainCount = targetRecord.chainCount ? targetRecord.chainCount += 1 : 1;
                            maxChains = config.getItem('ConquestMaxChains', 4);
                            if (maxChains === '' || $u.isNaN(maxChains) || maxChains < 0) {
                                maxChains = 4;
                            }

                            if (targetRecord.chainCount >= maxChains) {
                                con.log(1, "Lets give this guy a break. Chained", targetRecord.chainCount);
                                targetRecord.chainTime = Date.now();
                                targetRecord.chainCount = 0;
                                targetRecord.ignoreTime = 0;
                                targetRecord.unknownTime = 0;
                            }
                        } else {
                            con.log(1, "Do Not Chain Attack:", targetRecord.userId);
                            targetRecord.chainCount = 0;
                            targetRecord.chainTime = 0;
                            targetRecord.ignoreTime = 0;
                            targetRecord.unknownTime = 0;
                        }
                    } else {
                        con.warn("Setting unknown timer as conquest type unknown", type);
                        targetRecord.chainCount = 0;
                        targetRecord.chainTime = 0;
                        targetRecord.ignoreTime = 0;
                        targetRecord.unknownTime = Date.now();
                    }
                } else {
                    con.warn("Setting unknown timer as conquest result unknown", result);
                    targetRecord.chainCount = 0;
                    targetRecord.chainTime = 0;
                    targetRecord.ignoreTime = 0;
                    targetRecord.unknownTime = Date.now();
                }

                conquest.setItem(targetRecord);
            } else {
                con.error("Unable to process records without valid userId", userId);
            }

            bottomDiv = null;
            buttonDiv = null;
            targetDiv = null;
        } catch (err) {
            con.error("ERROR in conquest.getResults: " + err);
        }
    };

    conquest.getLands = function() {
        var landCapsules = $j("[style*='conq2_capsule']"),
            timeLeft;
        landCapsules.each(function() {
            var currentCapsule = $j(this),
                tmp = '',
                landRecord = new conquestLands.record();
            landRecord.name = currentCapsule.children().eq(0).text().trim();
            tmp = $j("img[src*='conq2_btn']", currentCapsule)[0].src.split('/');
            landRecord.status = tmp[tmp.length - 1].match(/.+_(.+)\..+/)[1];
            if (landRecord.status == 'explore') {
                tmp = $j("img[src*='conq2_btn']", currentCapsule).attr('onClick').match(/.+popup_(\d+)/)[1];
                landRecord.timeLeft = 0;
                landRecord.stateTimeLeft = 0;
            } else {
                tmp = $j("img[src*='conq2_btn']", currentCapsule).parent().eq(0).attr('href').match(/.+slot=(\d+)/)[1];
    			try{
					landRecord.timeLeft = $j("[id*='expire_text']", currentCapsule).html().match(/.+forever in (\d+) hours/)[1];
				} catch (err) {
					con.error("ERROR in landRecord.timeLeft: " + err);
					landRecord.timeLeft = 999999;
				}	
            }
            landRecord.slot = tmp[tmp.length - 1];

            conquestLands.setItem(landRecord);
        });
    };

    // this function appears to have some serious bugs and really needs to be reworked!
    // it can try to click all 3 buttons, but the DOM could change after each click
    conquest.collect = function() {
        try {
            var button = caap.checkForImage("conq3_btn_collectpower_small.gif"),
                button2 = caap.checkForImage("conq3_btn_collect.gif"),
                buttonCrystal = caap.checkForImage("conq3_btn_pray.gif"),
                landCapsules = $j("[style*='conq2_capsule']"),
                timeLeft;

                // this should now handle lands in progress because they have the attack button displayed while they're in collect before they produce resources
            if (landCapsules.length == $j("[src*='conq2_btn_explore'],[src*='conq2_btn_attack']", landCapsules).length) {
                con.log (1, "There are no lands to collect from");
            } else {
                if (config.getItem('doConquestCollect', false)) {
                    if ($u.hasContent(button)) {
                        caap.click(button);
                    }

                    if ($u.hasContent(button2)) {
                        con.log(1, "button exists");
                        caap.click(button2);
                    }
                }

                if (schedule.check('collectConquestTimer') && $u.hasContent(buttonCrystal)) {
                    caap.click(buttonCrystal);
                }
            }

            timeLeft = $j("div[style*='conq3_mid_notop']")[0].children[0].children[0].children[2].children[0].innerHTML.match(/(\d+)/)[0];
            schedule.setItem('collectConquestTimer', timeLeft * 60 * 60);
            schedule.setItem('collectConquestCrystalTimer', timeLeft * 60 * 60);

            button = null;
            button2 = null;
            buttonCrystal = null;
        } catch (err) {
            con.error("ERROR in collect Conquest: " + err);
            return;
        }
    };

    conquest.battle = function() {
        try {
            var slice = $j();

            slice = $j("#app_body div[style*='war_fort_battledefeat.jpg'],div[style*='war_fort_battlevictory.jpg']");
            if ($u.hasContent(slice)) {
                conquest.getResults(slice);
            }

            slice = $j("#app_body div[style*='war_conquest_header2.jpg']");
            if ($u.hasContent(slice)) {
                conquest.getCommonInfos(slice);
                conquest.targeting();
            } else {
                con.warn("conquest.battle: missing header slice");
            }

            slice = null;
        } catch (err) {
            con.error("ERROR in conquest.battle: " + err);
        }
    };

    conquest.menu = function() {
        try {
            var XConquestInstructions = "Start battling if Guild Coins is above this points",
                XMinConquestInstructions = "Do not conquest if Guild Coins is below this points",
                chainBPInstructions = "Number of conquest points won to initiate a chain attack. Specify 0 to always chain attack.",
                maxChainsInstructions = "Maximum number of chain hits after the initial attack.",
                FMRankInstructions = "The lowest relative rank below yours that " + "you are willing to spend your Guild Coins on. Leave blank to attack " + "any rank. (Uses Conquest Rank for invade and duel)",
                FMARBaseInstructions = "This value sets the base for your Army " + "Ratio calculation [X * (Your Army Size/ Opponent Army Size)]. It is basically a multiplier for the army " +
                    "size of a player at your equal level. A value of 1 means you " + "will conquest an opponent the same level as you with an army the " + "same size as you or less. Default .5",
                FreshMeatARMaxInstructions = "This setting sets the highest value you will use for the Army Ratio [Math.min(Army Ratio, Army Ratio Max)] value. " +
                    "So, if you NEVER want to fight an army bigger than 80% your size, you can set the Max value to .8.",
                FreshMeatARMinInstructions = "This setting sets the lowest value you will use for the Army Ratio [Math.max(Army Ratio, Army Ratio Min)] value. " +
                    "So, if you NEVER want to pass up an army that is less than 10% the size of yours, you can set MIN value to .1.",
                FreshMeatMaxLevelInstructions = "This sets the highest relative level, above yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent above level 120, you would code 20.",
                FreshMeatMinLevelInstructions = "This sets the lowest relative level, below yours, that you are willing to attack. So if you are a level 100 and do not want to attack an opponent below level 60, you would code 40.",
                conquestList = ['Coins Available', 'At Max Coins', 'At X Coins', 'Never'],
                conquestInst = [
                    'Guild Coins Available will conquest whenever you have enough Guild Coins',
                    'At Max Guild Coins will conquest when Guild Coins is at max and will burn down all Guild Coins when able to level up',
                    'At X Guild Coins you can set maximum and minimum Guild Coins to conquest',
                    'Never - disables'
                ],
                typeList = ['Invade', 'Duel'],
                typeInst = ['Conquest using Invade button', 'Conquest using Duel button - no guarentee you will win though'],
                htmlCode = '';

            htmlCode = caap.startToggle('Conquesting', 'CONQUEST BATTLE');
            htmlCode += caap.makeDropDownTR("Conquest When", 'WhenConquest', conquestList, conquestInst, '', 'Never', false, false, 62);
            htmlCode += caap.startDropHide('WhenConquest', '', 'Never', true);
            htmlCode += caap.startDropHide('WhenConquest', 'XCoins', 'At X Coins', false);
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'ConquestXCoins', '', 1, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'ConquestXMinCoins', '', 0, '', '', true, false);
            htmlCode += caap.endDropHide('WhenConquest', 'XCoins');
            htmlCode += caap.makeDropDownTR("Conquest Type", 'ConquestType', typeList, typeInst, '', '', false, false, 62);
            htmlCode += caap.makeCheckTR("Wait For Safe Health", 'conquestWaitSafeHealth', false, '');
            htmlCode += caap.makeNumberFormTR("Chain Conquest Points", 'ConquestChainBP', chainBPInstructions, '', '');
            htmlCode += caap.makeNumberFormTR("Max Chains", 'ConquestMaxChains', maxChainsInstructions, 4, '', '');
            htmlCode += caap.makeTD("Attack targets that are not:");
            htmlCode += caap.makeNumberFormTR("My Level Minus", 'ConquestMinLevel', FreshMeatMaxLevelInstructions, '', '', '', true);
            htmlCode += caap.makeNumberFormTR("My Level Plus", 'ConquestMaxLevel', FreshMeatMinLevelInstructions, '', 50, '', true);
            htmlCode += caap.makeNumberFormTR("My Rank Minus", 'ConquestMinRank', '', 0, '', '', true);
            htmlCode += caap.makeNumberFormTR("My Rank Plus", 'ConquestMaxRank', '', 2, '', '', true);
            htmlCode += caap.makeNumberFormTR("Higher Than X*AR", 'ConquestARBase', FMARBaseInstructions, 0.7, '', '', true);
            htmlCode += caap.makeCheckTR('Advanced', 'ConquestAdvancedOptions', false);
            htmlCode += caap.startCheckHide('ConquestAdvancedOptions');
            htmlCode += caap.makeNumberFormTR("Army Ratio Max", 'ConquestARMax', FreshMeatARMaxInstructions, '', '', '', true);
            htmlCode += caap.makeNumberFormTR("Army Ratio Min", 'ConquestARMin', FreshMeatARMinInstructions, '', '', '', true);
            htmlCode += caap.endCheckHide('ConquestAdvancedOptions');
            htmlCode += caap.endDropHide('WhenConquest');
            /*
            htmlCode += caap.makeCheckTR("Modify Timers", 'conquestModifyTimers', false, "Advanced timers for how often Conquest functions are performed.");
            htmlCode += caap.startCheckHide('conquestModifyTimers');
            htmlCode += caap.makeNumberFormTR("Conquest retry", 'ConquestNotSafeCount', "Check the Conquest X times before release and delay for other processes. Minimum 1.", 20, '', '', true);
            htmlCode += caap.makeNumberFormTR("Conquest delay", 'ConquestNoTargetDelay', "Check the Conquest every X seconds when no target available. Minimum 10.", 45, '', '', true);
            htmlCode += caap.endCheckHide('conquestModifyTimers');
            */
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in conquest.menu: " + err);
            return '';
        }
    };

    conquest.dashboard = function() {
        function points(num) {
            num = $u.setContent(num, 0);
            return num >= 0 ? "+" + num : num;
        }

        try {
            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_infoConquest' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (config.getItem('DBDisplay', '') === 'Conquest Stats' && session.getItem("ConquestDashUpdate", true)) {
                var headers = ['UserId', 'Name', 'CR', 'Level', 'Army', 'Invade', 'Duel'],
                    values = ['userId', 'nameStr', 'rankNum', 'levelNum', 'armyNum', 'invadewinsNum', 'duelwinsNum'],
                    pp = 0,
                    i = 0,
                    userIdLink = '',
                    userIdLinkInstructions = '',
                    len = 0,
                    len1 = 0,
                    data = {
                        text: '',
                        color: '',
                        bgcolor: '',
                        id: '',
                        title: ''
                    },
                    head = '',
                    body = '',
                    row = '';

                for (pp = 0; pp < headers.length; pp += 1) {
                    switch (headers[pp]) {
                    case 'UserId':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '19%'
                        });
                        break;
                    case 'Name':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '30%'
                        });
                        break;
                    case 'Invade':
                    case 'Duel':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '11%'
                        });
                        break;
                    case 'BR':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '5%'
                        });
                        break;
                    default:
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '7%'
                        });
                    }
                }

                head = caap.makeTr(head);
                for (i = 0, len = conquest.records.length; i < len; i += 1) {
                    row = "";
                    for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                        switch (values[pp]) {
                        case 'userId':
                            userIdLinkInstructions = "Clicking this link will take you to the user keep of " + conquest.records[i][values[pp]];
                            userIdLink = "keep.php?casuser=" + conquest.records[i][values[pp]];
                            data = {
                                text: '<span id="caap_conquest_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                    '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + conquest.records[i][values[pp]] + '</span>',
                                color: 'blue',
                                id: '',
                                title: ''
                            };

                            row += caap.makeTd(data);
                            break;
                        case 'rankNum':
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]],
                                color: '',
                                id: '',
                                title: conquest.records[i].rankStr
                            });
                            break;
                        case 'warRankNum':
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]],
                                color: '',
                                id: '',
                                title: conquest.records[i].warRankStr
                            });
                            break;
                        case 'invadewinsNum':
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]] + "/" + conquest.records[i].invadelossesNum + " " + points(conquest.records[i].ibp),
                                color: '',
                                id: '',
                                title: ''
                            });
                            break;
                        case 'duelwinsNum':
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]] + "/" + conquest.records[i].duellossesNum + " " + points(conquest.records[i].dbp),
                                color: '',
                                id: '',
                                title: ''
                            });
                            break;
                        case 'warwinsNum':
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]] + "/" + conquest.records[i].warlossesNum + " " + points(conquest.records[i].wbp),
                                color: '',
                                id: '',
                                title: ''
                            });
                            break;
                        default:
                            row += caap.makeTd({
                                text: conquest.records[i][values[pp]],
                                color: '',
                                id: '',
                                title: ''
                            });
                        }
                    }

                    body += caap.makeTr(row);
                }

                $j("#caap_infoConquest", caap.caapTopObject).html(
                $j(caap.makeTable("conquest", head, body)).dataTable({
                    "bAutoWidth": false,
                    "bFilter": false,
                    "bJQueryUI": false,
                    "bInfo": false,
                    "bLengthChange": false,
                    "bPaginate": false,
                    "bProcessing": false,
                    "bStateSave": true,
                    "bSortClasses": false
                }));

                $j("span[id*='caap_conquest_']", caap.caapTopObject).click(function(e) {
                    var visitUserIdLink = {
                        rlink: '',
                        arlink: ''
                    },
                    i = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink;
                        }
                    }

                    caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                });

                session.setItem("ConquestDashUpdate", false);
            }

            return true;
        } catch (err) {
            con.error("ERROR in conquest.dashboard: " + err);
            return false;
        }
    };
}());

(function() {
   "use strict";

    guilds.records = [];

    guilds.targets = [];

    guilds.record = function() {
        this.data = {
            'name': '',
            'guildId': '',
            'level': 0,
            'lastCheck': 0,
            'Attack': 0,
            'Defense': 0,
            'Damage': 0,
            'Health': 0,
            'AttackMax': 0,
            'DefenseMax': 0,
            'DamageMax': 0,
            'HealthMax': 0,
            'newRecord': true
        };
    };

    guilds.hbest = 2;

    guilds.load = function() {
        try {
            guilds.records = gm.getItem('guilds.records', 'default');
            if (guilds.records === 'default' || !$j.isArray(guilds.records)) {
                guilds.records = gm.setItem('guilds.records', []);
            }

            guilds.hbest = guilds.hbest === false ? JSON.hbest(guilds.records) : guilds.hbest;
            con.log(2, "guilds.load Hbest", guilds.hbest);
            session.setItem("GuildsDashUpdate", true);
            con.log(2, "guilds.load", guilds.records);
            return true;
        } catch (err) {
            con.error("ERROR in guilds.load: " + err);
            return false;
        }
    };

    guilds.save = function(src) {
        try {
            var compress = false;
            if (caap.domain.which === 3) {
                caap.messaging.setItem('guilds.records', guilds.records);
            } else {
                gm.setItem('guilds.records', guilds.records, guilds.hbest, compress);
                con.log(2, "guilds.save", guilds.records);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    caap.messaging.setItem('guilds.records', guilds.records);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("GuildsDashUpdate", true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in guilds.save: " + err);
            return false;
        }
    };

    guilds.clear = function() {
        try {
            guilds.records = [];
            guilds.save();
            session.setItem("GuildsDashUpdate", true);
            return true;
        } catch (err) {
            con.error("ERROR in guilds.clear: " + err);
            return false;
        }
    };

    guilds.rescan = function() {
        try {
			var i = 0, len = 0;
            for (i = 0, len = guilds.records.length; i < len; i += 1) {
				guilds.records[i].lastCheck = Date.now();
				guilds.records[i].Attack = -1;
				guilds.records[i].Defense = -1;
				guilds.records[i].Damage = -1;
				guilds.records[i].Health = -1;
				guilds.records[i].AttackMax = 0;
				guilds.records[i].DefenseMax = 0;
				guilds.records[i].DamageMax = 0;
				guilds.records[i].HealthMax = 0;
			}
            guilds.save();
            session.setItem("GuildsDashUpdate", true);
            return true;
        } catch (err) {
            con.error("ERROR in guilds.clear: " + err);
            return false;
        }
    };

    guilds.getItem = function(guildId) {
        try {
            var it = 0,
                len = 0,
                success = false,
                newRecord = null;

            if (guildId === '') {
                con.warn("guildId", guildId);
                throw "Invalid identifying guildId!";
            }

            for (it = 0, len = guilds.records.length; it < len; it += 1) {
                if (guilds.records[it].guildId === guildId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                con.log(2, "Got guilds record", guildId, guilds.records[it]);
                guilds.records[it].newRecord = false;
                return guilds.records[it];
            }

            newRecord = new guilds.record();
            newRecord.data.guildId = guildId;
            con.log(2, "New guilds record", guildId, newRecord.data);
            return newRecord.data;
        } catch (err) {
            con.error("ERROR in guilds.getItem: " + err);
            return false;
        }
    };

    guilds.setItem = function(record) {
        try {
/*
            if (!record || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }
*/

            if (record.guildId === '') {
                con.warn("guildId", record.guildId);
                throw "Invalid identifying guildId!";
            }

            var it = 0,
                len = 0,
                success = false;

             for (it = 0, len = guilds.records.length; it < len; it += 1) {
                if (guilds.records[it].guildId === record.guildId) {
                    success = true;
                    break;
                }
            }

            record.newRecord = false;
            if (success) {
                if (record.Attack != -1) {
                    guilds.records[it] = record;
                    con.log(2, "Updated guilds record", record, guilds.records);
                }
            } else {
                guilds.records.push(record);
                con.log(2, "Added guilds record", record, guilds.records);
            }

            guilds.save();
            return true;
        } catch (err) {
            con.error("ERROR in guilds.setItem: " + err, record);
            return false;
        }
    };

    guilds.deleteItem = function(guildId) {
        try {
            var it = 0,
                len = 0,
                success = false;

            if (guildId === '') {
                con.warn("guildId", guildId);
                throw "Invalid identifying guildId!";
            }

            for (it = 0, len = guilds.records.length; it < len; it += 1) {
                if (guilds.records[it].guildId === guildId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                guilds.records.splice(it, 1);
                guilds.save();
                con.log(2, "Deleted guilds record", guildId, guilds.records);
                return true;
            }

            con.warn("Unable to delete guilds record", guildId, guilds.records);
            return false;
        } catch (err) {
            con.error("ERROR in guilds.deleteItem: " + err);
            return false;
        }
    };

    guilds.tradeMarket = function() {

        var guildCapsules = $j("[style*='trade_capsule']");
        guildCapsules.each(function() {
            var currentCapsule = $j(this),
                guildRecord = new guilds.record();
            guildRecord.name = currentCapsule.children().eq(0).eq(0).eq(0).eq(0).text().trim();
            guildRecord.level = currentCapsule.children().eq(1).children(2).children(0).children(0).eq(0).text().match(/(\d+)/)[1];
            guildRecord.lastCheck = Date.now();
            guildRecord.guildId = $j("[name='guild_id']", currentCapsule)[0].value;
            guildRecord.Attack = -1;
            guildRecord.Defense = -1;
            guildRecord.Damage = -1;
            guildRecord.Health = -1;
            guildRecord.AttackMax = 0;
            guildRecord.DefenseMax = 0;
            guildRecord.DamageMax = 0;
            guildRecord.HealthMax = 0;
            guilds.setItem(guildRecord);
        });
    };

    guilds.guildMarket = function() {
        var storageDivs = $j("[id^='storage_']"),
            guildRecord = new guilds.record();

        guildRecord.name = $j("[id^='guild_name_header']").children().eq(0).text();
        guildRecord.guildId = $j("[id^='guild_name_header']").children().eq(0).attr('href').split('=')[1];

        storageDivs.each(function() {
            var essenceText = $j(this).children().eq(0).text().split(/\W+/);
            guildRecord[essenceText[1]] = essenceText[5];
            guildRecord[essenceText[1] + 'Max'] = essenceText[6];
        });
        guilds.setItem(guildRecord);
    };

    guilds.nextToCheck = function() {
        try {
            var it = 0,
                len = 0,
                success = false;
            for (it = 0, len = guilds.records.length; it < len; it += 1) {
                if (guilds.records[it].Attack == -1) {
                    success = true;
                    break;
                }
            }

            if (success) {
                con.log(2, "Got guilds record", guilds.records[it]);
                return guilds.records[it].guildId;
            }

            con.log(2, "No Unchecked guilds");
            return 0;
        } catch (err) {
            con.error("ERROR in guilds.nextToCheck: " + err);
            return false;
        }
    };

    guilds.dashboard = function() {
        function points(num) {
            num = $u.setContent(num, 0);
            return num >= 0 ? "+" + num : num;
        }

        try {
            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_infoGuilds' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (config.getItem('DBDisplay', '') === 'Guild Essence' && session.getItem("GuildsDashUpdate", true)) {
                var headers = ['Name', 'Attack', 'Defense', 'Damage', 'Health'],
                    values = ['name', 'attackStr', 'defenseStr', 'damageStr', 'healthStr'],
                    pp = 0,
                    i = 0,
                    userIdLink = '',
                    userIdLinkInstructions = '',
                    len = 0,
                    len1 = 0,
                    data = {
                        text: '',
                        color: '',
                        bgcolor: '',
                        id: '',
                        title: ''
                    },
                    head = '',
                    body = '',
                    row = '';

                for (pp = 0; pp < headers.length; pp += 1) {
                    switch (headers[pp]) {
                    case 'Name':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '30%'
                        });
                        break;
                    case 'Attack':
                    case 'Defense':
                    case 'Damage':
                    case 'Health':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '10%'
                        });
                        break;
                    default:
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '7%'
                        });
                    }
                }

                head = caap.makeTr(head);
                for (i = 0, len = guilds.records.length; i < len; i += 1) {
                    row = "";
                    for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                        switch (values[pp]) {
                        case 'name':
                            userIdLinkInstructions = "Clicking this link will take you to the guild keep of " + guilds.records[i][values[pp]];
                            userIdLink = "guildv2_home.php?guild_id=" + guilds.records[i].guildId;
                            data = {
                                text: '<span id="caap_Guilds_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                    '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + guilds.records[i][values[pp]] + '</span>',
                                color: 'blue',
                                id: '',
                                title: ''
                            };

                            row += caap.makeTd(data);
                            break;
                        case 'attackStr':
                            row += caap.makeTd({
                                text: (config.getItem('essenceRoomOnly', true) ? (guilds.records[i].Attack != -1 ? guilds.records[i].AttackMax - guilds.records[i].Attack : 'Unchecked') :
                                        (guilds.records[i].Attack != -1 ? guilds.records[i].Attack + "/" + guilds.records[i].AttackMax : 'Unchecked')),
                                color: ((guilds.records[i].Attack < guilds.records[i].AttackMax) && (guilds.records[i].Attack >= 0) ? 'green' : 'black'),
                                id: '',
                                title: ''
                            });
                            break;
                        case 'defenseStr':
                            row += caap.makeTd({
                                text: (config.getItem('essenceRoomOnly', true) ? (guilds.records[i].Defense != -1 ? guilds.records[i].DefenseMax - guilds.records[i].Defense : 'Unchecked') :
                                        (guilds.records[i].Defense != -1 ? guilds.records[i].Defense + "/" + guilds.records[i].DefenseMax : 'Unchecked')),
                                color: ((guilds.records[i].Defense < guilds.records[i].DefenseMax) && (guilds.records[i].Defense >= 0) ? 'green' : 'black'),
                                id: '',
                                title: ''
                            });
                            break;
                        case 'damageStr':
                            row += caap.makeTd({
                                text: (config.getItem('essenceRoomOnly', true) ? (guilds.records[i].Damage != -1 ? guilds.records[i].DamageMax - guilds.records[i].Damage : 'Unchecked') :
                                        (guilds.records[i].Damage != -1 ? guilds.records[i].Damage + "/" + guilds.records[i].DamageMax : 'Unchecked')),
                                color: ((guilds.records[i].Damage < guilds.records[i].DamageMax) && (guilds.records[i].Damage >= 0) ? 'green' : 'black'),
                                id: '',
                                title: ''
                            });
                            break;
                        case 'healthStr':
                            row += caap.makeTd({
                                text: (config.getItem('essenceRoomOnly', true) ? (guilds.records[i].Health != -1 ? guilds.records[i].HealthMax - guilds.records[i].Health : 'Unchecked') :
                                        (guilds.records[i].Health != -1 ? guilds.records[i].Health + "/" + guilds.records[i].HealthMax : 'Unchecked')),
                                color: ((guilds.records[i].Health < guilds.records[i].HealthMax) && (guilds.records[i].Health >= 0) ? 'green' : 'black'),
                                id: '',
                                title: ''
                            });
                            break;
                        default:
                            row += caap.makeTd({
                                text: guilds.records[i][values[pp]],
                                color: '',
                                id: '',
                                title: ''
                            });
                        }
                    }

                    body += caap.makeTr(row);
                }

                $j("#caap_infoGuilds", caap.caapTopObject).html(
                $j(caap.makeTable("Guilds", head, body)).dataTable({
                    "bAutoWidth": false,
                    "bFilter": false,
                    "bJQueryUI": false,
                    "bInfo": false,
                    "bLengthChange": false,
                    "bPaginate": false,
                    "bProcessing": false,
                    "bStateSave": true,
                    "bSortClasses": false
                }));

                $j("span[id*='caap_Guilds_']", caap.caapTopObject).click(function(e) {
                    var visitUserIdLink = {
                        rlink: '',
                        arlink: ''
                    },
                    i = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink;
                        }
                    }

                    caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                });

                session.setItem("GuildsDashUpdate", false);
            }

            return true;
        } catch (err) {
            con.error("ERROR in guilds.dashboard: " + err);
            return false;
        }
    };

    caap.scoutGuildEssence = function() {
        try {
            if (config.getItem('EssenceScanCheck', false)) {
                var guildId, link;
                if ((guildId = guilds.nextToCheck()) != 0) {
                    link = "guild_conquest_market.php?guild_id=" + guildId;
                    caap.clickAjaxLinkSend(link, 1000);
                } else {
                    if (schedule.check("newEssenceListTimer")) {
                        schedule.setItem("newEssenceListTimer", config.getItem('essenceScanInterval', 60) * 60, 0);
                        caap.navigateTo('trade_market');
                    }
                    else con.log(2, "waiting for list to reset");
                }
            }

            return false;
        } catch (err) {
            con.error("ERROR in caap.schoutGuilEssence: " + err);
            return false;
        }
    }
}());

(function() {
    conquestLands.records = [];

    conquestLands.record = function() {
        this.data = {
            'name': '',
            'slot': 0,
            'status': 0,
            'timeLeft': 0,
            'stateTimeLeft': 0,
            'newRecord': true
        };
    };

    conquestLands.hbest = 2;

    conquestLands.load = function() {
        try {
            conquestLands.records = gm.getItem('conquestLands.records', 'default');
            if (conquestLands.records === 'default' || !$j.isArray(conquestLands.records)) {
                conquestLands.records = gm.setItem('conquestLands.records', []);
            }

            conquestLands.hbest = conquestLands.hbest === false ? JSON.hbest(conquestLands.records) : conquestLands.hbest;
            con.log(2, "conquestLands.load Hbest", conquestLands.hbest);
            session.setItem("ConquestDashUpdate", true);
            con.log(1, "conquestLands.load", conquestLands.records);
            return true;
        } catch (err) {
            con.error("ERROR in conquestLands.load: " + err);
            return false;
        }
    };

    conquestLands.save = function(src) {
        try {
            var compress = false;
            if (caap.domain.which === 3) {
                caap.messaging.setItem('conquestLands.records', conquestLands.records);
            } else {
                gm.setItem('conquestLands.records', conquestLands.records, conquestLands.hbest, compress);
                con.log(2, "conquestLands.save", conquestLands.records);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    caap.messaging.setItem('conquestLands.records', conquestLands.records);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("ConquestDashUpdate", true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in conquestLands.save: " + err);
            return false;
        }
    };

    conquestLands.clear = function() {
        try {
            conquestLands.records = [];
            conquestLands.save();
            session.setItem("ConquestDashUpdate", true);
            return true;
        } catch (err) {
            con.error("ERROR in conquestLands.clear: " + err);
            return false;
        }
    };

    conquestLands.getItem = function(slot) {
        try {
            var it = 0,
                len = 0,
                success = false,
                newRecord = null;

            if (slot === '' || $u.isNaN(slot) || slot < 1) {
                con.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            for (it = 0, len = conquestLands.records.length; it < len; it += 1) {
                if (conquestLands.records[it].slot === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                con.log(2, "Got conquest land record", slot, conquestLands.records[it]);
                conquestLands.records[it].newRecord = false;
                return conquestLands.records[it];
            }

            newRecord = new conquestLands.record();
            newRecord.data.slot = slot;
            con.log(2, "New conquest record", slot, newRecord.data);
            return newRecord.data;
        } catch (err) {
            con.error("ERROR in conquestLands.getItem: " + err);
            return false;
        }
    };

    conquestLands.getMonsters = function() {
        var retVal = [],
            curReturn = 0;
        for (var ii=0; ii < conquestLands.records.length; ii+= 1) {
            if (conquestLands.records[ii].status == 'attack') {
                retVal[curReturn] = conquestLands.records[ii];
                curReturn++;
            }
        }
        return retVal;
    };

    conquestLands.setItem = function(record) {
        try {
            var it = 0,
                success = false;

            for (it = 0; it < conquestLands.records.length; it += 1) {
                if (conquestLands.records[it].slot === record.slot) {
                    success = true;
                    break;
                }
            }

            record.newRecord = false;
            if (success) {
                conquestLands.records[it] = record;
                con.log(1, "Updated conquestLands record", record, conquestLands.records);
            } else {
                conquestLands.records.push(record);
                con.log(1, "Added conquestLands record", record, conquestLands.records);
            }
// this causes errors, need to look at it
//            conquestLands.save();
            return true;
        } catch (err) {
            con.error("ERROR in conquestLands.setItem: " + err, record);
            return false;
        }
    };
}());
