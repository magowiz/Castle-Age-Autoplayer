/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,stats,$j,rison,chores,feed,spreadsheet,ss,
$u,hyper,worker,self,caap,config,con,gm,guilds,profiles,town,
conquest,battle,guild_battle,stats,statsFunc,essence,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                          MAIN LOOP
// This function repeats continously.  In principle, functions should only make one
// click before returning back here.
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    caap.makeActionsList = function () {
        try {
            if ($u.hasContent(caap.actionsList)) {
				return;
			}
			var prioritiesList = worker.actionsList.flatten('priority');

			// Check no two actions have same priority
			prioritiesList.forEach( function(e, i) {
				if (i !== prioritiesList.indexOf(e) && i == prioritiesList.lastIndexOf(e)) {
					con.warn('Worker actions with same priority of ' + e + ': ' + worker.actionsList.filterByField('priority', e).flatten('description').join(', '));
				}
			});
			
			// Check all worker functions are defined
			worker.actionsList.forEach( function(o) {
				if (!$u.isFunction(window[o.worker][o.functionName])) {
					con.warn('Worker function for ' + o.name + ': ' + o.worker + '.' + o.functionName + ' is not defined', o);
					worker.actionsList.deleteObjs('fName', o.fName);
				}
			});
					
			worker.actionsList.sort($u.sortBy(true, "priority"));
			
			con.log(1, 'Action order: ' + worker.actionsList.flatten('description').join(', ')); 
			
        } catch (err) {
            // Something went wrong, log it and use the emergency Action List.
            con.error("ERROR in makeActionsList: " + err.stack);
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
//                    window.location.href = caap.domain.protocol[caap.domain.ptype] + "apps.facebook.com/castle_age/?fb_source=bookmark_apps&ref=bookmarks&count=0&fb_bmpos=2_0";
                    window.location.href = caap.domain.protocol[caap.domain.ptype] + "apps.facebook.com/castle_age/";
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
                    window.guild_battle = null;
                    window.arena = null;
                    window.festival = null;
                    window.tenVten = null;
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
                stats.gold.ticker = arr;
                con.log(3, "stsPoll gtv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(stv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                stats.stamina.ticker = arr;
                con.log(3, "stsPoll stv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(htv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                stats.health.ticker = arr;
                con.log(3, "stsPoll htv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            arr = $u.setContent($u.setContent(etv, '').regex(/(\d+):(\d+)/), []);
            if ($u.hasContent(arr) && arr.length === 2) {
                stats.energy.ticker = arr;
                con.log(3, "stsPoll etv", arr[0] + ":" + arr[1].lpad("0", 2));
            }

            num = $u.setContent($u.setContent(ecv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                stats.energy.num = num;
                con.log(3, "stsPoll ecv", num);
            }

            num = $u.setContent($u.setContent(hcv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                stats.health.num = num;
                con.log(3, "stsPoll hcv", num);
            }

            num = $u.setContent($u.setContent(scv, '').parseInt(), -1);
            if (num > 0 && !$u.isNaN(num)) {
                stats.stamina.num = num;
                con.log(3, "stsPoll scv", num);
            }
			
			// Check for lowpoints in energy stamina maxes at every level, for use with max stat checks
			if (stats.level !== stats.lowpoint.level) {
				stats.lowpoint.level = stats.level;
				stats.lowpoint.energy = stats.energy.max > 0 ? stats.energy.max : stats.lowpoint.energy;
				stats.lowpoint.stamina = stats.stamina.max > 0 ? stats.stamina.max : stats.lowpoint.stamina;
			}
			['energy', 'stamina'].forEach( function(stat) {
				if (stats[stat].max > 0 && stats[stat].max < stats.lowpoint[stat]) {
					stats.lowpoint[stat] = stats[stat].max;
				}
			});

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

	// Takes a true/false result and an action name or object, and provides config 
	caap.passThrough = function(result, actor)  {
        try {
			// Convert text actors to worker objects
			
			actor = !$u.isDefined(actor) ? session.getItem('ThisAction', 'None') : actor;
			
			var mName = actor.replace(/\..*/, ''),
				mPrefix = mName.ucWords() + ': ',
				fObj = worker.actionsList.getObjByField('fName', actor),
				description,
				lastAction = state.getItem('LastAction', 'caap.idle'),
				fName,
				message,
				logText,
				warnText,
				resultTf = result && (!$u.isObject(result) || $u.setContent(result.action, true));
								
			fObj = !$u.isObject(fObj) ? worker.actionsList.getObjByField('fName', session.getItem('ThisAction', 'None')) : fObj;
			description = $u.isObject(fObj) ? fObj.description : 'Unknown';
			fName = $u.isObject(fObj) ? fObj.fName : 'Unknown';
			
            if (resultTf && lastAction != fName) {
                con.log(1, 'Changed from doing ' + lastAction + ' to ' + fName);
                state.setItem('LastAction', fName);
				caap.setDivContent('activity_mess', 'Activity: ' + description);
				if (!$u.isObject(result) && session.getItem('ThisAction', 'None') != 'caap.idle') {
					caap.setDivContent('last_mess', '');
				}
            }

			if ($u.isObject(result)) {
				message = $u.isDefined(result.mess) ? result.mess : $u.isDefined(result.mlog) ? result.mlog :
					$u.isDefined(result.mwarn) ? result.mwarn : false;
				logText = $u.isDefined(result.log) ? result.log : $u.isDefined(result.mlog) ? result.mlog : false;
				warnText = $u.isDefined(result.mwarn) ? result.mwarn : false;
				
				// Add a prefix for the message div if the name starts with a number, like 100v100 for guild battles
				if (mName.slice(0,1).match(/\d/)) {
					mName = 'n' + mName;
				}
				if (message !== false) {
					if (resultTf) {
						caap.setDivContent('last_mess', 'Last: ' + ($u.hasContent(message) ? mPrefix + message : ''));
						caap.setDivContent(mName + '_mess', '');
					} else {
						caap.setDivContent(mName + '_mess', $u.hasContent(message) ? mPrefix + message : '');
					}
				}
				if (logText !== false) {
					con.log($u.setContent(result.level, 1), mPrefix + logText);
				}
				if (warnText !== false) {
					con.warn(mPrefix + warnText);
				}
			}
			return resultTf;
        } catch (err) {
            con.error("ERROR in caap.passThrough:" + err);
        }
	};
	
    caap.mainLoop = function () {
        try {
            var button = $j(),
                noWindowLoad = 0,
                actionsListCopy = [],
				releaseControl = true,
				result = false,
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

			if (caap.oneMinuteUpdate('splashCheck') && caap.checkForImage('web3splash.jpg').length) {
				con.warn('On splash page, so reloading');
				caap.reloadCastleAge();
				return true;
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

            actionsListCopy = worker.actionsList.slice();
			releaseControl = session.getItem('ReleaseControl', true);
			if (!releaseControl) {
				actionsListCopy.unshift(worker.actionsList.getObjByField('fName', state.getItem('LastAction', 'caap.idle')));
			}

			// Income general always first. Remember when this was super important and the highest priority?
			actionsListCopy.unshift(worker.actionsList.getObjByField('fName', 'chores.income'));
			
            result = actionsListCopy.some( function(action) {
				session.setItem('ThisAction', action.fName);
				return caap.passThrough(window[action.worker][action.functionName](), action.fName);
            });
			
			if (!releaseControl && result) {
				session.setItem('ReleaseControl', true);
			}
			worker.list.forEach(worker.checkSave);

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
                mc = session.getItem("messageCount", 0),
				suffix = '';
			
			// If we have messages waiting in the queue, wait up to 20 X 100ms times
            if (rc < 20 && mc > 0) {
                con.log(1, 'Reload waiting ' + mc + ' message' + $u.plural(mc) + ' ...', rc);
                window.setTimeout(function () {
                    doit();
                }, 100);

                return;
            }

            if (force || (!config.getItem('Disabled') && state.getItem('caapPause') === 'none')) {
                // better than reload... no prompt on forms!
                con.log(1, 'Reloading now!');
				if (caap.checkForImage('header_persist_background.jpg').length && window.hyper !== undefined && $u.isArray(hyper.getItem('logons',false)) && hyper.getItem('logons',false).length > 1) {
					suffix = '/connect_login.php?platform_action=CA_web3_logout';
				} else if (caap.domain.which === 0 || caap.domain.which === 2) {
					suffix = '/keep.php';
				}
				caap.visitUrl(caap.domain.altered + suffix, 1000);
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
            reloadMin = $u.isNumber(reloadMin) ? Math.max(reloadMin, 2) : 2;
			
			if (!config.getItem('Disabled') && state.getItem('caapPause', 'none') == 'none') {
				if (schedule.since("clickedOnSomething", 300)) {
					con.log(1, 'Reloading after no response from click');
					session.setItem("flagReload", true);
				} else if (session.getItem("workerRepeats", 0) > 50) {
					con.log(1, 'Reloading after fifty or more actions by only one or two workers');
					session.setItem("flagReload", true);
				} else if (caap.hyper && schedule.since("hyperTimer", reloadMin * 60)) {
					con.log(1, 'Reloading to allow another toon time');
					session.setItem("flagReload", true);
				}
			}
            window.setTimeout(function () {
                caap.reloadOccasionally();
            }, 60000 * (1 + Math.random()));

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
        'Essences': {
            'export': function () {
                return essence.records;
            },
            'import': function (d) {
                essence.records = d;
                essence.save();
            },
            'delete': function () {
                essence.records = [];
                gm.deleteItem("essence.records");
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
        'Guild Battle': {
            'export': function () {
                return guild_battle.records;
            },
            'import': function (d) {
                guild_battle.records = d;
                guild_battle.save();
            },
            'delete': function () {
                guild_battle.records = [];
                gm.deleteItem("guild_battle.records");
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
                return stats;
            },
            'import': function (d) {
                window.stats = d;
                statsFunc.setRecord(stats);
            },
            'delete': function () {
                window.stats = {};
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
        'Town': {
            'export': function () {
                return town.records;
            },
            'import': function (d) {
                town.records = d;
                town.save();
            },
            'delete': function () {
                town.records = [];
                gm.deleteItem("town.records");
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

	
	// Not compatible yet with new action list, so disabling for now.
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
