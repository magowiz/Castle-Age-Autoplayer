/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,feed,spreadsheet,ss,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,gm,battle,profiles,town,
conquest,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                          MAIN LOOP
// This function repeats continously.  In principle, functions should only make one
// click before returning back here.
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    caap.actionDescTable = {
        'autoIncome': 'Awaiting Income',
        'autoStat': 'Upgrade Skill Points',
        'maxEnergyQuest': 'At Max Energy Quest',
        'passiveGeneral': 'Setting Idle General',
        'idle': 'Idle Tasks',
        'immediateBanking': 'Immediate Banking',
        'battle': 'Battling Players',
        'conquestBattle': 'Conquesting Players',
        'monsterReview': 'Review Monsters/Raids',
        'guildMonsterReview': 'Review Guild Monsters',
        'immediateAutoStat': 'Immediate Auto Stats',
        'autoElite': 'Fill Elite Guard',
        'autoPotions': 'Auto Potions',
        'autoArchives': 'Auto Archives',
        'autoKobo': 'Auto Kobo',
        'autoAlchemy': 'Auto Alchemy',
        'autoBless': 'Auto Bless',
        'autoGift': 'Auto Gifting',
        'demiPoints': 'Demi Points First',
        'monsters': 'Fighting Monsters',
        'guildMonster': 'Fight Guild Monster',
        'heal': 'Auto Healing',
        'bank': 'Auto Banking',
        'lands': 'Land Operations',
        'quests': 'Questing',
        'checkGenerals': 'Checking Generals',
        'checkAllGenerals': 'Getting Generals Stats',
        'checkArmy': 'Checking Army',
        'checkKeep': 'Checking Keep',
        'ajaxGiftCheck': 'Gift Check',
        'ajaxCheckFeed': 'Feed Check',
        'ajaxCheckGuild': 'Guild Check',
        'ajaxCheckPublic1': 'Public Check 1',
        'ajaxCheckPublic2': 'Public Check 2',
        'ajaxCheckPublic3': 'Public Check 3',
        'feedScan': 'Scanning Monsters',
        'checkAchievements': 'Achievements',
        'reconPlayers': 'Player Recon',
        'checkOracle': 'Checking Oracle',
        'checkBattleRank': 'Battle Rank',
        'checkWarRank': 'War Rank',
        'checkConquestRank': 'Conquest Rank',
        'checkSymbolQuests': 'Demi Blessing Stats',
        'checkSoldiers': 'Getting Soldiers',
        'checkItem': 'Getting Items',
        'checkMagic': 'Getting Magic',
        'checkCharacterClasses': 'Character Classes',
        'festivalBless': 'Festival Feats',
        'collectConquest': 'Collect Conquest Resources',
        'collectConquestCrystal': 'Collect Conquest Crystals',
        'scoutGuildEssence': 'Scout Guild Essence',
        'doArenaBattle' : 'Battling in Arena' 
    };

    caap.checkLastAction = function (thisAction) {
        try {
            state.setItem('ThisAction', thisAction);
            var lastAction = state.getItem('LastAction', 'idle');

            caap.setDivContent('activity_mess', 'Activity: ' + $u.setContent(caap.actionDescTable[thisAction], thisAction));
            if (lastAction !== thisAction) {
                con.log(1, 'Changed from doing ' + lastAction + ' to ' + thisAction);
                state.setItem('LastAction', thisAction);
            }

            return true;
        } catch (err) {
            con.error("ERROR in checkLastAction:" + err);
            return false;
        }
    };

    caap.masterActionList = {
        0x00: 'autoElite',
        0x01: 'heal',
        0x02: 'immediateBanking',
        0x03: 'immediateAutoStat',
        0x04: 'maxEnergyQuest',
        0x05: 'festivalReview',
        0x06: 'guildMonsterReview',
        0x07: 'monsterReview',
        0x08: 'festival',
        0x09: 'guildMonster',
        0x0A: 'demiPoints',
        0x0B: 'monsters',
        0x0C: 'battle',
        0x0D: 'quests',
        0x0E: 'conquestBattle',
        0x0F: 'bank',
        0x10: 'passiveGeneral',
        0x11: 'checkGenerals',
        0x12: 'checkAllGenerals',
        0x13: 'checkArmy',
        0x14: 'lands',
        0x15: 'autoBless',
        0x16: 'autoStat',
        0x17: 'checkCoins',
        0x18: 'autoGift',
        0x19: 'checkKeep',
        0x1A: 'autoPotions',
        0x1B: 'autoAlchemy',
        0x1C: 'checkAchievements',
        0x1D: 'ajaxGiftCheck',
        0x1E: 'reconPlayers',
        0x1F: 'checkOracle',
        0x20: 'checkBattleRank',
        0x21: 'checkWarRank',
        0x22: 'checkConquestRank',
        0x23: 'checkSymbolQuests',
        0x24: 'checkSoldiers',
        0x25: 'checkItem',
        0x26: 'checkMagic',
        0x27: 'checkCharacterClasses',
        0x28: 'festivalBless',
        0x29: 'ajaxCheckFeed',
        0x2A: 'ajaxCheckGuild',
        0x2B: 'ajaxCheckPublic1',
        0x2C: 'ajaxCheckPublic2',
        0x2D: 'ajaxCheckPublic3',
        0x2E: 'feedScan',
        0x2F: 'collectConquest',
        0x30: 'collectConquestCrystal',
        0x31: 'autoArchives',
        0x32: 'doArenaBattle',
        0x33: 'autoKobo',
        0x34: 'scoutGuildEssence',
        0x35: 'idle'
    };

    caap.actionsList = [];

    caap.makeActionsList = function () {
        var action = '',
            actionOrderArray = [],
            masterActionListCount = 0,
            actionOrderUser = '',
            actionOrderArrayCount = 0,
            itemCount = 0,
            actionItem = '',
            jt;

        try {
            if (!$u.hasContent(caap.actionsList)) {
                con.log(2, "Loading a fresh Action List");
                // actionOrder is a comma seperated string of action numbers as
                // hex pairs and can be referenced in the Master Action List
                // Example: "00,01,02,03,04,05,06,07,08,09,0A,0B,0C,0D,0E,0F,10,11,12"

                actionOrderUser = config.getItem("actionOrder", '');
                if ($u.hasContent(actionOrderUser)) {
                    // We are using the user defined actionOrder set in the
                    // Advanced Hidden Options
                    con.log(2, "Trying user defined Action Order");
                    // We take the User Action Order and convert it from a comma
                    // separated list into an array
                    actionOrderArray = actionOrderUser.split(",");
                    // We count the number of actions contained in the
                    // Master Action list

                    /*jslint forin: true */
                    for (action in caap.masterActionList) {
                        if (caap.masterActionList.hasOwnProperty(action)) {
                            masterActionListCount += 1;
                            con.log(4, "Counting Action List", masterActionListCount);
                        } else {
                            con.warn("Error Getting Master Action List length!");
                            con.warn("Skipping 'action' from masterActionList: ", action);
                        }
                    }
                    /*jslint forin: false */
                } else {
                    // We are building the Action Order Array from the
                    // Master Action List
                    con.log(2, "Building the default Action Order");

                    /*jslint forin: true */
                    for (action in caap.masterActionList) {
                        if (caap.masterActionList.hasOwnProperty(action)) {
                            masterActionListCount = actionOrderArray.push(action);
                            con.log(4, "Action Added", action);
                        } else {
                            con.warn("Error Building Default Action Order!");
                            con.warn("Skipping 'action' from masterActionList: ", action);
                        }
                    }
                    /*jslint forin: false */
                }

                // We notify if the number of actions are not sensible or the
                // same as in the Master Action List
                actionOrderArrayCount = actionOrderArray.length;
                if (actionOrderArrayCount === 0) {
                    throw "Action Order Array is empty! " + (actionOrderUser === "" ? "(Default)" : "(User)");
                } else if (actionOrderArrayCount < masterActionListCount) {
                    con.warn("Warning! Action Order Array has fewer orders than default!");
                } else if (actionOrderArrayCount > masterActionListCount) {
                    con.warn("Warning! Action Order Array has more orders than default!");
                }

                // We build the Action List
                con.log(8, "Building Action List ...");
                for (itemCount = 0; itemCount !== actionOrderArrayCount; itemCount += 1) {
                    actionItem = '';
                    if ($u.hasContent(actionOrderUser)) {
                        // We are using the user defined comma separated list of hex pairs
                        actionItem = caap.masterActionList[actionOrderArray[itemCount].parseInt(16)];
                        con.log(4, "(" + itemCount + ") Converted user defined hex pair to action", actionItem);
                    } else {
                        // We are using the Master Action List
                        actionItem = caap.masterActionList[actionOrderArray[itemCount]];
                        con.log(4, "(" + itemCount + ") Converted Master Action List entry to an action", actionItem);
                    }

                    // Check the Action Item
                    if ($u.hasContent(actionItem)) {
                        // We add the Action Item to the Action List
                        caap.actionsList.push(actionItem);
                        con.log(4, "Added action to the list", actionItem);
                    } else {
                        con.warn("Error! Skipping actionItem");
                        con.warn("Action Item(" + itemCount + "): ", actionItem);
                    }
                }

                if ($u.hasContent(actionOrderUser)) {
                    con.log(1, "Get Action List: ", caap.actionsList);
                }
            }
            return true;
        } catch (err) {
            // Something went wrong, log it and use the emergency Action List.
            con.error("ERROR in makeActionsList: " + err);

            for (jt in caap.masterActionList) {
                if (caap.masterActionList.hasOwnProperty(jt)) {
                    caap.actionsList.push(caap.masterActionList[jt]);
                }
            }

            return false;
        }
    };

    caap.errorCheckWait = false;

    caap.errorCheck = function () {
        // assorted errors...
        if (caap.errorCheckWait) {
            return true;
        }

        if (window.location.href.hasIndexOf('/error.html') || window.location.href.hasIndexOf('/sorry.php')) {
            con.warn('Detected "error" or "sorry" page, waiting to go back to previous page.');
            window.setTimeout(function () {
                if (window.hasOwnProperty("history") && window.history.hasOwnProperty("back")) {
                    window.history.back();
                } else if (window.hasOwnProperty("history") && window.history.hasOwnProperty("go")) {
                    window.history.go(-1);
                } else {
                    window.location.href = caap.domain.protocol[caap.domain.ptype] + "apps.facebook.com/castle_age/?fb_source=bookmark_apps&ref=bookmarks&count=0&fb_bmpos=2_0";
                }
            }, 60000);

            caap.errorCheckWait = true;
            return true;
        }

        // Try again button
        var button = $j("#try_again_button, input[name='try_again_button']");
        if ($u.hasContent(button)) {
            con.warn('Detected "Try Again" message, clicking button else refresh.');
            $j(".phl").append("<p>CAAP will retry shortly!</p>");
            window.setTimeout(function () {
                caap.click(button);
                window.setTimeout(function () {
                    window.image64 = null;
                    window.offline = null;
                    window.profiles = null;
                    window.session = null;
                    window.config = null;
                    window.state = null;
                    window.css = null;
                    window.gm = null;
                    window.ss = null;
                    window.db = null;
                    window.sort = null;
                    window.schedule = null;
                    window.general = null;
                    window.monster = null;
                    window.guild_monster = null;
                    //window.arena = null;
                    window.festival = null;
                    window.feed = null;
                    window.battle = null;
                    window.town = null;
                    window.spreadsheet = null;
                    window.gifting = null;
                    window.army = null;
                    window.caap = null;
                    window.con = null;
                    window.conquest = null;
                    window.guilds = null;
                    $u.reload();
                }, 180000);
            }, 60000 + (Math.floor(Math.random() * 60) * 1000));

            caap.errorCheckWait = true;
            button = null;
            return true;
        }

        button = null;
        return false;
    };

    caap.waitingAjaxLoad = function () {
        try {
            return $u.hasContent(caap.ajaxLoadIcon) && caap.ajaxLoadIcon.css("display") !== "none";
        } catch (err) {
            con.error("ERROR in waitingAjaxLoad: " + err);
            return false;
        }
    };

    caap.stsPoll = function () {
        try {
            var mainSts = $j("#globalContainer #mainsts"),
                gtv = $j("#gold_time_value", mainSts).text(),
                ecv = $j("#energy_current_value", mainSts).text(),
                etv = $j("#energy_time_value", mainSts).text(),
                scv = $j("#stamina_current_value", mainSts).text(),
                stv = $j("#stamina_time_value", mainSts).text(),
                hcv = $j("#health_current_value", mainSts).text(),
                htv = $j("#health_time_value", mainSts).text(),
                arr = [],
                num = 0;

            arr = $u.setContent($u.setContent(gtv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                caap.stats.gold.ticker = arr;
                con.log(3, "stsPoll gtv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(stv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                caap.stats.stamina.ticker = arr;
                con.log(3, "stsPoll stv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(htv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                caap.stats.health.ticker = arr;
                con.log(3, "stsPoll htv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(etv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                caap.stats.energy.ticker = arr;
                con.log(3, "stsPoll etv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            num = $u.setContent($u.setContent(ecv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                caap.stats.energy = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.energy.max), caap.stats.energy);
                caap.stats.energyT = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.energyT.max), caap.stats.energy);
                con.log(3, "stsPoll ecv", num);
            }

            num = $u.setContent($u.setContent(hcv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                caap.stats.health = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.health.max), caap.stats.health);
                caap.stats.healthT = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.healthT.max), caap.stats.healthT);
                con.log(3, "stsPoll hcv", num);
            }

            num = $u.setContent($u.setContent(scv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                caap.stats.stamina = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.stamina.max), caap.stats.stamina);
                caap.stats.staminaT = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats.staminaT.max), caap.stats.staminaT);
                con.log(3, "stsPoll scv", num);
            }

            mainSts = null;
            gtv = null;
            ecv = null;
            etv = null;
            scv = null;
            stv = null;
            hcv = null;
            htv = null;
            arr = null;
            return true;
        } catch (err) {
            con.error("ERROR in stsPoll: " + err);
            return false;
        }
    };

    caap.mainLoop = function () {
        try {
            var button = $j(),
                noWindowLoad = 0,
                actionsListCopy = [],
                action = 0,
                len = 0,
                dmc = 0;

            // assorted errors...
            if (caap.errorCheck()) {
                button = null;
                return true;
            }

            if (caap.domain.which === 1) {
                button = null;
                gifting.collect();
                caap.waitMainLoop();
                return true;
            }

            //We don't need to send out any notifications
            button = $j("#single_popup_feedback");
            if ($u.hasContent(button) && button.css("display") === 'block') {
                button = $j("img[src*='quest_skip_btn']", button);
                if ($u.hasContent(button)) {
                    con.log(1, 'Undoing/skipping notification');
                    caap.click(button.eq(0));
                }
            }

            //We don't need to send out any notifications
            button = $j("a[class*='undo_link']");
            if ($u.hasContent(button)) {
                con.log(1, 'Undoing/skipping notification');
                caap.click(button);
            }

            button = null;

            if (!$u.mutationTypes.DOMSubtreeModified) {
                caap.stsPoll();
            }

            if (config.getItem('Disabled', false)) {
                caap.waitMainLoop();
                return true;
            }

            if (!session.getItem("pageLoadOK", false)) {
                noWindowLoad = state.getItem('NoWindowLoad', 0);
                if (noWindowLoad === 0) {
                    schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                    state.setItem('NoWindowLoad', 1);
                } else if (schedule.check('NoWindowLoadTimer')) {
                    schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                    state.setItem('NoWindowLoad', noWindowLoad + 1);
                    caap.reloadCastleAge();
                }

                con.log(1, 'Page no-load count: ', noWindowLoad);
                session.setItem("pageLoadOK", caap.getStats());
                caap.waitMainLoop();
                return true;
            }

            state.setItem('NoWindowLoad', 0);

            if (state.getItem('caapPause', 'none') !== 'none') {
                caap.waitMainLoop();
                return true;
            }

            if (caap.getDomWaiting()) {
                if (schedule.since("clickedOnSomething", 45)) {
                    con.log(1, 'Clicked on something, but nothing new loaded.  Reloading page.', session, schedule);
                    caap.reloadCastleAge();
                    return true;
                }

                if (caap.waitingAjaxLoad()) {
                    con.log(1, 'Waiting for page load ...');
                    caap.waitMainLoop();
                    return true;
                }
            }

            if (session.getItem("delayMain", false)) {
                dmc = session.incItem("delayMainCnt");
                con.log(2, 'Delay main ...', dmc);
                if (dmc > 20) {
                    caap.reloadCastleAge();
                }

                caap.waitMainLoop();
                return true;
            }

            session.setItem("delayMainCnt", 0);

            if (caap.autoIncome()) {
                caap.checkLastAction('autoIncome');
                caap.waitMainLoop();
                return true;
            }

            actionsListCopy = caap.actionsList.slice();
            len = session.getItem('ReleaseControl', false) ? session.setItem('ReleaseControl', false) : actionsListCopy.unshift(state.getItem('LastAction', 'idle'));
            monster.select();
            for (action = 0, len = actionsListCopy.indexOf('idle') + 1; action < len; action += 1) {
                if (caap[actionsListCopy[action]]()) {
                    caap.checkLastAction(actionsListCopy[action]);
                    break;
                }
            }

            caap.waitMainLoop();
            return true;
        } catch (err) {
            con.error("ERROR in mainLoop: " + err);
            caap.reloadCastleAge(true);
            return false;
        }
    };

    caap.waitMilliSecs = 5000;

    caap.waitMainLoop = function () {
        try {
            window.setTimeout(function () {
                caap.waitMilliSecs = 5000;
                if (session.getItem("flagReload", false)) {
                    caap.reloadCastleAge();
                }

                caap.mainLoop();
            }, caap.waitMilliSecs * (1 + Math.random() * 0.2));

            return true;
        } catch (err) {
            con.error("ERROR in waitMainLoop: " + err);
            return false;
        }
    };

    caap.reloadCastleAge = function (force) {
        function doit() {
            var rc = session.incItem("reloadCounter"),
                mc = session.getItem("messageCount", 0);

            if (!force && rc < 20 && mc > 0) {
                con.log(1, 'Reload waiting ' + mc + ' message' + $u.plural(mc) + ' ...', rc);
                window.setTimeout(function () {
                    doit();
                }, 100);

                return;
            }

            if (force || (!config.getItem('Disabled') && state.getItem('caapPause') === 'none')) {
                // better than reload... no prompt on forms!
                con.log(1, 'Reloading now!');
                caap.visitUrl(caap.domain.altered + (caap.domain.which === 0 || caap.domain.which === 2 ? "/index.php?bm=1&ref=bookmarks&count=0" : ""));
            }
        }

        try {
            doit();
            return true;
        } catch (err) {
            con.error("ERROR in reloadCastleAge: " + err);
            return false;
        }
    };

    caap.reloadOccasionally = function () {
        try {
            var reloadMin = config.getItem('ReloadFrequency', 8);

            reloadMin = !$u.isNumber(reloadMin) || reloadMin < 8 ? 8 : reloadMin;
            window.setTimeout(function () {
                if (schedule.since("clickedOnSomething", 300) || session.getItem("pageLoadCounter", 0) > 40) {
                    con.log(1, 'Reloading if not paused after inactivity');
                    session.setItem("flagReload", true);
                }

                caap.reloadOccasionally();
            }, 60000 * reloadMin + (reloadMin * 60000 * Math.random()));

            return true;
        } catch (err) {
            con.error("ERROR in reloadOccasionally: " + err);
            return false;
        }
    };

    caap.exportTable = {
        'Config': {
            'export': function () {
                return config.getAll();
            },
            'import': function (d) {
                config.setAll(d);
            },
            'delete': function () {
                config.deleteAll();
            }
        },
        'State': {
            'export': function () {
                return state.getAll();
            },
            'import': function (d) {
                state.setAll(d);
            },
            'delete': function () {
                state.deleteAll();
            }
        },
        'Schedule': {
            'export': function () {
                return schedule.getAll();
            },
            'import': function (d) {
                schedule.setAll(d);
            },
            'delete': function () {
                schedule.deleteAll();
            }
        },
        'Monster': {
            'export': function () {
                return monster.records;
            },
            'import': function (d) {
                monster.records = d;
                monster.save();
            },
            'delete': function () {
                monster.records = [];
                gm.deleteItem("monster.records");
            }
        },
        'Battle': {
            'export': function () {
                return battle.records;
            },
            'import': function (d) {
                battle.records = d;
                battle.save();
            },
            'delete': function () {
                battle.records = [];
                gm.deleteItem("battle.records");
            }
        },
        'Conquest': {
            'export': function () {
                return conquest.records;
            },
            'import': function (d) {
                conquest.records = d;
                conquest.save();
            },
            'delete': function () {
                conquest.records = [];
                gm.deleteItem("conquest.records");
            }
        },
        'Guilds': {
            'export': function () {
                return guilds.records;
            },
            'import': function (d) {
                guilds.records = d;
                guilds.save();
            },
            'delete': function () {
                guilds.records = [];
                gm.deleteItem("guilds.records");
            }
        },
        'Guild Monster': {
            'export': function () {
                return guild_monster.records;
            },
            'import': function (d) {
                guild_monster.records = d;
                guild_monster.save();
            },
            'delete': function () {
                guild_monster.records = [];
                gm.deleteItem("guild_monster.records");
            }
        },
        'Target': {
            'export': function () {
                return battle.reconRecords;
            },
            'import': function (d) {
                battle.reconRecords = d;
                battle.saveRecon();
            },
            'delete': function () {
                battle.reconRecords = [];
                gm.deleteItem("recon.records");
            }
        },
        'User': {
            'export': function () {
                return caap.stats;
            },
            'import': function (d) {
                caap.stats = d;
                caap.saveStats();
            },
            'delete': function () {
                caap.stats = {};
                gm.deleteItem("stats.record");
            }
        },
        'Generals': {
            'export': function () {
                return general.records;
            },
            'import': function (d) {
                general.records = d;
                general.save();
            },
            'delete': function () {
                general.records = [];
                gm.deleteItem("general.records");
            }
        },
        'Soldiers': {
            'export': function () {
                return town.soldiers;
            },
            'import': function (d) {
                town.soldiers = d;
                town.save('soldiers');
            },
            'delete': function () {
                town.soldiers = [];
                gm.deleteItem("soldiers.records");
            }
        },
        'Item': {
            'export': function () {
                return town.item;
            },
            'import': function (d) {
                town.item = d;
                town.save('item');
            },
            'delete': function () {
                town.item = [];
                gm.deleteItem("item.records");
            }
        },
        'Magic': {
            'export': function () {
                return town.magic;
            },
            'import': function (d) {
                town.magic = d;
                town.save('magic');
            },
            'delete': function () {
                town.magic = [];
                gm.deleteItem("magic.records");
            }
        },
        'Gift Stats': {
            'export': function () {
                return gifting.history.records;
            },
            'import': function (d) {
                gifting.history.records = d;
                gifting.save('history');
            },
            'delete': function () {
                gifting.history.records = [];
                gm.deleteItem("gifting.history");
            }
        },
        'Gift Queue': {
            'export': function () {
                return gifting.queue.records;
            },
            'import': function (d) {
                gifting.queue.records = d;
                gifting.save('queue');
            },
            'delete': function () {
                gifting.queue.records = [];
                gm.deleteItem("gifting.queue");
            }
        },
        'Gifts': {
            'export': function () {
                return gifting.gifts.records;
            },
            'import': function (d) {
                gifting.queue.records = d;
                gifting.save('gifts');
            },
            'delete': function () {
                gifting.queue.records = [];
                gm.deleteItem("gifting.gifts");
            }
        },
        'Army': {
            'export': function () {
                return army.records;
            },
            'import': function (d) {
                army.records = d;
                army.save();
            },
            'delete': function () {
                army.records = [];
                gm.deleteItem("army.records");
            }
        },
        'Demi Points': {
            'export': function () {
                return caap.demi;
            },
            'import': function (d) {
                caap.demi = d;
                caap.SaveDemi();
            },
            'delete': function () {
                caap.demi = {};
                gm.deleteItem("demipoint.records");
            }
        },
        'Feed': {
            'export': function () {
                return feed.records;
            },
            'import': function (d) {
                feed.records = d;
                feed.save();
            },
            'delete': function () {
                feed.records = {};
                gm.deleteItem("feed.records");
            }
        },
        'Monster List': {
            'export': function () {
                return feed.monsterList;
            },
            'import': function (d) {
                feed.monsterList = d;
                feed.saveList();
            },
            'delete': function () {
                feed.monsterList = [];
                gm.deleteItem("feed.monsterList");
            }
        },
        'Goblin Hints': {
            'export': function () {
                return spreadsheet.records;
            },
            'import': function (d) {
                spreadsheet.records = d;
                spreadsheet.save();
            },
            'delete': function () {
                spreadsheet.records = [];
                ss.deleteItem("spreadsheet.records");
            }
        }
    };

    caap.exportList = function () {
        try {
            var it,
            list = [];

            for (it in caap.exportTable) {
                if (caap.exportTable.hasOwnProperty(it)) {
                    list.push(it);
                }
            }

            return list.sort();
        } catch (err) {
            con.error("ERROR in caap.exportList: " + err);
            return undefined;
        }
    };

    caap.profilesDialog = function (keys) {
        var h = '',
            w = $j("#caap_backup"),
            n = '',
            i = 0,
            l = keys.length,
            list, name, status;

        function getKeys(event) {
            name.val($j(event.target).val());
        }

        function backup(key) {
            status.text("Saving " + key + " ...");
            profiles.backup(key, function (event) {
                status.text(key + " : " + event);
                profiles.getBackupKeys(function (newKeys) {
                    keys = newKeys;
                    name.val("");
                    name.autocomplete("option", "source", keys);
                    h = '';
                    l = keys.length;
                    for (i = 0; i < l; i += 1) {
                        h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                    }

                    list.html(h);
                });
            });
        }

        function restore(key) {
            status.text("Loading " + key + " ...");
            profiles.restore(key, function (event) {
                caap.addControl(true);
                status.text(key + " : " + event);
                profiles.getBackupKeys(function (newKeys) {
                    keys = newKeys;
                    name.val("");
                    name.autocomplete("option", "source", keys);
                    h = '';
                    l = keys.length;
                    for (i = 0; i < l; i += 1) {
                        h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                    }

                    list.html(h);
                });
            });
        }

        function erase(key) {
            status.text("Deleting " + key + " ...");
            profiles.erase(key, function (event) {
                status.text(key + " : " + event);
                profiles.getBackupKeys(function (newKeys) {
                    keys = newKeys;
                    name.val("");
                    name.autocomplete("option", "source", keys);
                    h = '';
                    l = keys.length;
                    for (i = 0; i < l; i += 1) {
                        h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                    }

                    list.html(h);
                });
            });
        }

        try {
            if (!$u.hasContent(w)) {
                h += "<form><label for='caap_backup_list'>Profiles<br /><select id='caap_backup_list' multiple='multiple' style='width:400px;height:100px;'>";
                for (i = 0; i < l; i += 1) {
                    h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                }

                h += "</select></label></form><br />";
                h += "<form><label for='caap_backup_name'>Name<br /><input id='caap_backup_name' type='text' style='width:400px;' title='Enter the name of the profile.' name='name' /></label></form><br />";
                h += "<div id='caap_backup_status' class='caap_ff caap_fs caap_tc'></div>";
                w = $j('<div id="caap_backup" class="caap_ff caap_fs" title="Config Profiles">' + h + '</div>').appendTo(document.body);
                list = $j("#caap_backup_list", w);
                name = $j("#caap_backup_name", w);
                status = $j("#caap_backup_status", w);
                list.on("dblclick", getKeys);
                name.autocomplete({
                    source: keys
                });

                w.dialog({
                    resizable: false,
                    width: 'auto',
                    height: 'auto',
                    buttons: {
                        "Backup": function () {
                            n = name.val();
                            if ($u.hasContent(n)) {
                                if (n === "current") {
                                    alert("This is a system backup.\nYou can not overwrite this.");
                                } else if (keys.hasIndexOf(n)) {
                                    if (confirm("Overwrite profile?\n" + n)) {
                                        backup(n);
                                    } else {
                                        status.text("Cancelled!");
                                    }
                                } else {
                                    backup(n);
                                }
                            } else {
                                status.text("Enter a name!");
                            }
                        },
                        "Restore": function () {
                            n = name.val();
                            if ($u.hasContent(n)) {
                                if (keys.hasIndexOf(n)) {
                                    if (confirm("Load profile?\n" + n)) {
                                        restore(n);
                                    } else {
                                        status.text("Cancelled!");
                                    }
                                } else {
                                    restore(n);
                                }
                            } else {
                                status.text("Enter a name!");
                            }
                        },
                        "Erase": function () {
                            n = name.val();
                            if ($u.hasContent(n)) {
                                if (n === "current") {
                                    alert("This is a system backup.\nYou can not erase this.");
                                } else if (keys.hasIndexOf(n)) {
                                    if (confirm("Delete profile?\n" + n)) {
                                        erase(n);
                                    } else {
                                        status.text("Cancelled!");
                                    }
                                } else {
                                    erase(n);
                                }
                            } else {
                                status.text("Enter a name!");
                            }
                        },
                        "Close": function () {
                            list.off("dblclick", getKeys);
                            w.dialog("destroy").remove();
                        }
                    },
                    close: function () {
                        list.off("dblclick", getKeys);
                        w.dialog("destroy").remove();
                    }
                });
            }

            return w;
        } catch (err) {
            con.error("ERROR in caap.profilesDialog: " + err);
            return undefined;
        }
    };

    caap.exportDialog = function (data, title) {
        try {
            var h = '',
                w = $j("#caap_export");

            if (!$u.hasContent(w)) {
                h = "<textarea style='resize:none;width:400px;height:400px;' readonly='readonly'>" + JSON.stringify(data, null, "\t") + "</textarea>";
                w = $j('<div id="caap_export" class="caap_ff caap_fs" title="Export ' + title + ' Data">' + h + '</div>').appendTo(document.body);
                w.dialog({
                    resizable: false,
                    width: 'auto',
                    height: 'auto',
                    buttons: {
                        "Ok": function () {
                            w.dialog("destroy").remove();
                        }
                    },
                    close: function () {
                        w.dialog("destroy").remove();
                    }
                });
            }

            return w;
        } catch (err) {
            con.error("ERROR in caap.exportDialog: " + err);
            return undefined;
        }
    };

    caap.importDialog = function (which) {
        try {
            var h = '',
                w = $j("#caap_import"),
                l = {},
                v = '',
                resp = false;

            if (!$u.hasContent(w)) {
                h = "<textarea id='caap_import_data' style='resize:none;width:400px;height:400px;'></textarea>";
                w = $j('<div id="caap_import" class="caap_ff caap_fs" title="Import ' + which + ' Data">' + h + '</div>').appendTo(document.body);
                w.dialog({
                    resizable: false,
                    width: 'auto',
                    height: 'auto',
                    buttons: {
                        "Ok": function () {
                            try {
                                v = JSON.parse($u.setContent($j("#caap_import_data", w).val(), 'null'));
                            } catch (e) {
                                v = null;
                            }

                            l = $u.setContent(v, 'default');
                            if (($j.isArray(l) || $j.isPlainObject(l)) && l !== 'default') {
                                resp = confirm("Are you sure you want to load " + which + "?");
                                if (resp) {
                                    caap.caapfbShutdown();
                                    caap.exportTable[which]['import'](l);
                                    w.dialog("destroy").remove();
                                    caap.reloadCastleAge(true);
                                }
                            } else {
                                con.warn(which + " config was not loaded!", l);
                            }
                        },
                        "Close": function () {
                            w.dialog("destroy").remove();
                        }
                    },
                    close: function () {
                        w.dialog("destroy").remove();
                    }
                });
            }

            return w;
        } catch (err) {
            con.error("ERROR in caap.importDialog: " + err);
            return undefined;
        }
    };

    caap.deleteDialog = function (which) {
        try {
            var resp = confirm("Are you sure you want to delete " + which + "?");

            if (resp) {
                caap.caapfbShutdown();
                caap.exportTable[which]['delete']();
                caap.reloadCastleAge(true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in caap.deleteDialog: " + err);
            return false;
        }
    };

    caap.actionDialog = function () {
        try {
            var h = '',
                w = $j("#caap_action"),
                csa = $j(),
                it = 0,
                jt = '',
                t = '';

            if (!$u.hasContent(w)) {
                caap.makeActionsList();
                for (it = 0; it < caap.actionsList.length; it += 1) {
                    for (jt in caap.masterActionList) {
                        if (caap.masterActionList.hasOwnProperty(jt)) {
                            if (caap.actionsList[it] === caap.masterActionList[jt]) {
                                h += "<li id='caap_action_" + jt + "' class='" + (caap.masterActionList[jt] === 'idle' ? "ui-state-highlight" : "ui-state-default") + "'>" + caap.actionsList[it] + "</li>";
                            }

                            if (it === 0) {
                                t += $u.dec2hex(jt.parseInt()) + ',';
                            }
                        }
                    }
                }

                t = t.substring(0, t.length - 1);
                w = $j('<div id="caap_action" class="caap_ff caap_fs" title="Action Order"><div style="margin:20px 0px; width: 150px; height: 480px;">' +
                    caap.makeCheckTR('Disable AutoIncome', 'disAutoIncome', false, '') + '<ul class="caap_ul" id="caap_action_sortable">' + h + '</ul></div></div>').appendTo(document.body);
                csa = $j("#caap_action_sortable", w);
                w.dialog({
                    resizable: false,
                    modal: true,
                    width: '200px',
                    height: 'auto',
                    buttons: {
                        "Ok": function () {
                            var result = csa.sortable('toArray'),
                                s = '';

                            for (it = 0; it < result.length; it += 1) {
                                s += $u.dec2hex(result[it].regex(/(\d+)/)) + (it < result.length - 1 ? ',' : '');
                            }

                            if (s === t) {
                                con.log(1, "Reset actionOrder to default", config.setItem("actionOrder", ''));
                            } else {
                                con.log(1, "Saved actionOrder to user preference", config.setItem("actionOrder", s));
                            }

                            con.log(1, "Change: setting 'disAutoIncome' to ", config.setItem("disAutoIncome", $j("#caap_disAutoIncome", w).is(":checked")));
                            w.dialog("destroy").remove();
                            caap.actionsList = [];
                            caap.makeActionsList();
                        },
                        "Reset": function () {
                            con.log(1, "Reset actionOrder to default", config.setItem("actionOrder", ''));
                            con.log(1, "Change: setting 'disAutoIncome' to ", config.setItem("disAutoIncome", false));
                            $j("#caap_disAutoIncome", w).attr("checked", false);
                            caap.actionsList = [];
                            caap.makeActionsList();
                            var ht = '',
                                xt = '';

                            for (xt in caap.masterActionList) {
                                if (caap.masterActionList.hasOwnProperty(xt)) {
                                    ht += "<li id='caap_action_" + xt + "' class='" + (caap.masterActionList[xt] === 'idle' ? "ui-state-highlight" : "ui-state-default") + "'>" + caap.masterActionList[xt] + "</li>";
                                }
                            }

                            csa.html(ht).sortable("refresh");
                        }
                    },
                    close: function () {
                        w.dialog("destroy").remove();
                    }
                });

                csa.sortable({
                    containment: w,
                    placeholder: "ui-state-highlight"
                }).disableSelection();
            }

            return w;
        } catch (err) {
            con.error("ERROR in caap.actionDialog: " + err);
            return undefined;
        }
    };

}());
