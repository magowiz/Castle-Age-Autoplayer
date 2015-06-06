/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,statsFunc,$j,gm,utility,
$u,stats,worker,self,caap,config,con,
schedule,gifting,state,army, general,session,monster,feed */
/*jslint maxlen: 256 */

(function () {
    "use strict";

	worker.add('caap');
	
	worker.addAction({worker : 'caap', priority : 0, description : 'Setting Idle General', functionName : 'passiveGeneral'});	
	
	caap.checkResults = function(page, resultsText) {
        try {
			switch (page) {
			case 'index' :
				if (config.getItem('AutoGift', false)) {
					gifting.collected();
					// Check for new gifts
					// A warrior wants to join your Army!
					// Send Gifts to Friends
					if ($u.hasContent(caap.resultsText) && /Send Gifts to Friends/.test(caap.resultsText)) {
						con.log(1, 'We have a gift waiting!');
						state.setItem('HaveGift', true);
					}

					var time = config.getItem('CheckGiftMins', 15);
					time = time < 15 ? 15 : time;
					schedule.setItem("ajaxGiftCheck", time * 60, 300);
				}
				
				break;
			default :
				break;
			}
        } catch (err) {
            con.error("ERROR in town.checkResults: " + err.stack);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                          PASSIVE GENERALS
/////////////////////////////////////////////////////////////////////

    caap.passiveGeneral = function () {
        try {
			var timedLoadoutCheck = general.timedLoadout();
			if (timedLoadoutCheck) {
//				con.log(5,"Idle Check paused",timedLoadoutCheck);
				return timedLoadoutCheck === 'change';
			}
//			con.log(2,"Idle Check equipped", timedLoadoutCheck, stats.battleIdle);
			if (stats.battleIdle != 'Use Current' ? general.Select(stats.battleIdle) 
				: (config.getItem('IdleGeneral', 'Use Current') == 'Use Current') 
				? general.Select(state.getItem('lastLoadout', 'Use Current')) || general.Select(state.getItem('lastGeneral', 'Use Current'))
				: general.Select('IdleGeneral')) {
				return true;
			}
			state.setItem('lastLoadout', 'Use Current');
			state.setItem('lastGeneral', 'Use Current');
			return false;
        } catch (err) {
            con.error("ERROR in passiveGeneral: " + err);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                              IDLE
/////////////////////////////////////////////////////////////////////

	worker.addAction({worker : 'caap', priority : -10000, description : 'Idle', functionName : 'idle'});
	
    caap.idle = function () {
        if (caap.doCTAs()) {
            return true;
        }
        return true;
    };

/////////////////////////////////////////////////////////////////////
//                          POTIONS
/////////////////////////////////////////////////////////////////////

	worker.addAction({worker : 'caap', priority : -600, description : 'Drinking Potions', functionName : 'autoPotions'});
	
    caap.autoPotions = function() {
        function consumePotion(potion) {
            try {
                if (!caap.hasImage('keep_top.jpg')) {
                    con.log(2, "Going to keep for potions");
                    if (caap.navigateTo('keep')) {
                        return true;
                    }
                }

                var formId = "consume_1",
                    potionDiv = $j(),
                    button = $j();

                if (potion === 'stamina') {
                    formId = "consume_2";
                }

                con.log(1, "Consuming potion", potion);
                potionDiv = $j("form[id='" + formId + "'] input[src*='keep_consumebtn.jpg']");
                if (potionDiv && potionDiv.length) {
                    button = potionDiv;
                    if (button) {
                        caap.click(button);
                    } else {
                        con.warn("Could not find consume button for", potion);

                        potionDiv = null;
                        button = null;
                        return false;
                    }
                } else {
                    con.warn("Could not find consume form for", potion);

                    potionDiv = null;
                    button = null;
                    return false;
                }

                potionDiv = null;
                button = null;
                return true;
            } catch (err) {
                con.error("ERROR in consumePotion: " + err, potion);
                return false;
            }
        }

        try {
            if (!config.getItem('potions', true) || !schedule.check('AutoPotionTimerDelay')) {
                return false;
            }

            if (stats.exp.dif <= config.getItem("potionsExperience", 20)) {
                con.log(2, "AutoPotions, ENL condition. Delaying 10 minutes");
                schedule.setItem('AutoPotionTimerDelay', 600);
                return false;
            }

            if (stats.energy.num < stats.energy.max - 10 && stats.potions.energy >= config.getItem("energyPotionsSpendOver", 39) && stats.potions.energy > config.getItem("energyPotionsKeepUnder", 35)) {
                return consumePotion('energy');
            }

            if (stats.stamina.num < stats.stamina.max - 10 && stats.potions.stamina >= config.getItem("staminaPotionsSpendOver", 39) && stats.potions.stamina > config.getItem("staminaPotionsKeepUnder", 35)) {
                return consumePotion('stamina');
            }

            return false;
        } catch (err) {
            con.error("ERROR in autoPotions: " + err);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                              CTA
/////////////////////////////////////////////////////////////////////

    caap.waitAjaxCTA = false;

    caap.recordCTA = [];

    caap.loadedCTA = false;

    caap.waitLoadCTA = true;

    caap.doCTAs = function () {
        function onError() {
            caap.waitAjaxCTA = false;
        }

        function onSuccess() {
            caap.waitAjaxCTA = false;
        }

        try {
            if ((gm ? gm.getItem("ajaxCTA", false) : false) || caap.waitAjaxCTA || stats.stamina.num < 1 || !schedule.check('ajaxCTATimer')) {
                return false;
            }

            if (caap.waitLoadCTA) {
                $j.ajax({
                    url: caap.domain.protocol[caap.domain.ptype] +
                        "query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0At1LY6Vd3Bp9dFhvYkltNVdVNlRfSzZWV0xCQXQtR3c%26hl%3Den%26output%3Dcsv'&format=json",
                    dataType: ($u.is_opera ? "jsonp" : "json"),
                    error: function () {
                        caap.loadedCTA = true;
                    },
                    success: function (msg) {
                        var rows = msg.query && msg.query.results && msg.query.results.row ? msg.query.results.row : [],
                            row = 0,
                            rowsLen = 0,
                            column = 0,
                            newRecord = {}, headers = $u.hasContent(rows) ? rows[0] : {}, headersLen = 0,
                            headersArr = [],
                            key = '';

                        for (key in headers) {
                            if (headers.hasOwnProperty(key)) {
                                headersLen = headersArr.push((headers[key]).toLowerCase());
                            }
                        }

                        for (row = 1, rowsLen = rows.length; row < rowsLen; row += 1) {
                            newRecord = {};
                            for (column = 0; column < headersLen; column += 1) {
                                if ($u.hasContent(headersArr[column])) {
                                    newRecord[headersArr[column]] = $u.setContent(rows[row]["col" + column], null);
                                }
                            }

                            caap.recordCTA.push(newRecord);
                        }

                        caap.loadedCTA = true;
                    }
                });

                caap.waitLoadCTA = false;
                return true;
            }

            if (!$u.hasContent(caap.recordCTA) || !caap.loadedCTA) {
                return false;
            }

            var count = state.getItem('ajaxCTACount', 0);
            if (count < caap.recordCTA.length) {
                caap.waitAjaxCTA = true;

                caap.ajax(caap.recordCTA[count].code.AESDecrypt(caap.namespace), null, onError, onSuccess);

                state.setItem('ajaxCTACount', count + 1);
            } else {
                caap.waitAjaxCTA = false;
                state.setItem('ajaxCTACount', 0);
                schedule.setItem('ajaxCTATimer', 10800, 300);
            }

            return true;
        } catch (err) {
            con.error("ERROR in doCTAs: " + err);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                          GUILD
/////////////////////////////////////////////////////////////////////

    caap.checkResults_guild = function() {
        try {
            if (session.getItem("clickUrl").hasIndexOf("guild_battle=true")) {
                caap.guildTabAddListener();
                con.log(2, "Battle List");
                return true;
            }

            // Guild
            var guildTxt = '',
                guildDiv = $j(),
                tStr = '',
                members = [],
                save = false;

            guildTxt = $j("#globalContainer #guild_achievement").text().trim().innerTrim();
            if ($u.hasContent(guildTxt)) {
                tStr = guildTxt.regex(/Monster ([\d,]+)/);
                stats.guild.mPoints = $u.hasContent(tStr) ? ($u.isString(tStr) ? tStr.numberOnly() : tStr) : 0;
                tStr = guildTxt.regex(/Battle ([\d,]+)/);
                stats.guild.bPoints = $u.hasContent(tStr) ? ($u.isString(tStr) ? tStr.numberOnly() : tStr) : 0;
                tStr = guildTxt.regex(/Monster [\d,]+ points \(Top (\d+\-\d+%)\)/);
                stats.guild.mRank = $u.hasContent(tStr) ? tStr : '';
                tStr = guildTxt.regex(/Battle [\d,]+ points \(Top (\d+\-\d+%)\)/);
                stats.guild.bRank = $u.hasContent(tStr) ? tStr : '';
                save = true;
            } else {
                con.warn('Using stored guild Monster and Battle points.');
            }

            guildTxt = $j("#globalContainer #guild_blast input[name='guild_id']").attr("value");
            if ($u.hasContent(guildTxt)) {
                stats.guild.id = guildTxt;
                save = true;
            } else {
                con.warn('Using stored guild_id.');
            }

            guildTxt = $j("#globalContainer #guild_banner_section").text().trim();
            if ($u.hasContent(guildTxt)) {
                stats.guild.name = guildTxt;
                save = true;
            } else {
                con.warn('Using stored guild name.');
            }

            guildDiv = $j("#globalContainer div[style*='guild_popup_middle.jpg'] div[style*='float:left;'] a[href*='keep.php?casuser']");
            if ($u.hasContent(guildDiv)) {
                guildDiv.each(function() {
                    var t = $j(this),
                        uid = t.attr("href").regex(/casuser=(\d+)/),
                        name = t.text().trim();

                    if (uid !== stats.FBID) {
                        members.push({
                            'userId': uid,
                            'name': name
                        });
                    }

                    t = null;
                });

                stats.guild.members = members.slice();
                save = true;
            } else {
                con.warn('Using stored guild member count.');
            }

            con.log(2, "checkResults_guild", stats.guild);
            if (save) {
                statsFunc.setRecord(stats);
            }

            guildDiv = null;
            return true;
        } catch (err) {
            con.error("ERROR in checkResults_guild: " + err);
            return false;
        }
    };

    caap.guildTabListener = function(event) {
        session.setItem("clickUrl", $u.setContent($j(event.target).parent().attr("onclick"), '').regex(new RegExp(",'(.+\\.php.*?)'")));
    };

    caap.guildTabAddListener = function() {
        $j("div[style*='guild_tab_off_tile.jpg'],div[style*='guild_tab_on_tile.jpg']").off('click', caap.guildTabListener).on('click', caap.guildTabListener);
    };

    caap.checkResults_guild_panel = function() {
        caap.guildTabAddListener();
    };

    caap.checkResults_guild_shop = function() {
        caap.guildTabAddListener();
    };

    caap.checkResults_guild_class = function() {
        caap.guildTabAddListener();
    };

    caap.checkResults_guild_formation = function() {
        caap.guildTabAddListener();
    };
	
}());
