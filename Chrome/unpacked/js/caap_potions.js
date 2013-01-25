/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                          POTIONS
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

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
            if (!config.getItem('AutoPotions', true) || !schedule.check('AutoPotionTimerDelay')) {
                return false;
            }

            if (caap.stats.exp.dif <= config.getItem("potionsExperience", 20)) {
                con.log(2, "AutoPotions, ENL condition. Delaying 10 minutes");
                schedule.setItem('AutoPotionTimerDelay', 600);
                return false;
            }

            if (caap.stats.energy.num < caap.stats.energy.max - 10 && caap.stats.potions.energy >= config.getItem("energyPotionsSpendOver", 39) && caap.stats.potions.energy > config.getItem("energyPotionsKeepUnder", 35)) {
                return consumePotion('energy');
            }

            if (caap.stats.stamina.num < caap.stats.stamina.max - 10 && caap.stats.potions.stamina >= config.getItem("staminaPotionsSpendOver", 39) && caap.stats.potions.stamina > config.getItem("staminaPotionsKeepUnder", 35)) {
                return consumePotion('stamina');
            }

            return false;
        } catch (err) {
            con.error("ERROR in autoPotions: " + err);
            return false;
        }
    };

    /////////////////////////////////////////////////////////////////////
    //                          ARCHIVES
    /////////////////////////////////////////////////////////////////////

    caap.autoArchives = function() {
        try {
                var button = $j(),
            archiveDIV = $j(),
            hours = 24,
            minutes = 0,
            rClick;


            if ((!config.getItem('AutoArchives', true)) || (!schedule.check('AutoArchiveTimerDelay'))) {
                caap.setDivContent('archive_mess', schedule.check('AutoArchiveTimerDelay') ? 'Archive = none' : 'Next Archive: ' + $u.setContent(caap.displayTime('AutoArchiveTimerDelay'), "Unknown"));

                button = null;
                archiveDIV = null;
                return false;
            }

            con.log(2, "autoArchives");

            archiveDIV = $j("div[style*='archive_top']");
            if (!archiveDIV || archiveDIV.length === 0) {
                con.log(2, "Going to Item archives for bonuses");
                if (caap.navigateTo('item_archive_bonus')) {
                    button = null;
                    archiveDIV = null;
                    return true;
                }

                button = null;
                archiveDIV = null;
                throw "Impossible to navigate to Item archives page";
            }

            button = caap.checkForImage('archive_btn_enable.gif');
            if (button && button.length > 0) {
                con.log(2, "Click enable archives for bonuses");
                schedule.setItem('AutoArchiveTimerDelay', ((hours * 60) + minutes) * 60, 100);
                caap.setDivContent('archive_mess', schedule.check('AutoArchiveTimerDelay') ? 'Archive = none' : 'Next Archive: ' + $u.setContent(caap.displayTime('AutoArchiveTimerDelay'), "Unknown"));
                rClick = caap.click(button);

                button = null;
                archiveDIV = null;
                return rClick;
            }

            return false;

        } catch (err) {
            con.error("ERROR in autoArchives: " + err);
            return false;
        }
    };

    caap.timerArchives = function() {
        try {
            var button = $j(),
                hours = 24,
                minutes = 0,
                delay = 100,
                timespan = $j(),
                timestr = '',
                convert1 = new RegExp('([0-9]+)hrs([0-9]+)m', 'i'),
                convert2 = new RegExp('([0-9]+)m', 'i'),
                timeresult;

            con.log(2, "timerArchives");

            button = caap.checkForImage('archive_btn_enable.gif');
            con.log(4, "button", button);
            if (button && button.length > 0) {
                hours = 0;
                minutes = 0;
                delay = 0;
            } else {
                timespan = $j('span[style="color:#6c2000;"]');
                con.log(4, "timespan", timespan);
                if (timespan) {
                    timestr = timespan.text().substring(1).replace(/\s/g, "");
                    con.log(4, "convert1 timestr", timestr);
                    timeresult = convert1.exec(timestr);
                    con.log(4, "convert1 timeresult", timeresult);
                    if (timeresult) {
                        hours = Math.max(timeresult[1], 0);
                        minutes = Math.max(timeresult[2], 0);
                    } else {
                        timestr = timespan.text().substring(1).replace(/\s/g, "");
                        con.log(4, "convert2 timestr", timestr);
                        timeresult = convert2.exec(timestr);
                        con.log(4, "convert2 timeresult", timeresult);
                        if (timeresult) {
                            hours = 0;
                            minutes = Math.max(timeresult[1], 0);
                        } else {
                            con.warn("Could not find timer; so setting to default");
                            hours = 0;
                            minutes = 5;
                        }
                    }
                } else {
                    con.warn("Could not find timespan; so setting to default");
                    hours = 0;
                    minutes = 5;
                }
            }

            con.log(2, "timerArchives [hours minutes delay]", hours, minutes, delay);
            schedule.setItem('AutoArchiveTimerDelay', ((hours * 60) + minutes) * 60, delay);
            caap.setDivContent('archive_mess', schedule.check('AutoArchiveTimerDelay') ? 'Archive = none' : 'Next Archive: ' + $u.setContent(caap.displayTime('AutoArchiveTimerDelay'), "Unknown"));

            button = null;
            timespan = null;
            return false;
        } catch (err) {
            con.error("ERROR in timerArchives: " + err);
            return false;
        }
    };

    /////////////////////////////////////////////////////////////////////
    //                          KOBO
    /////////////////////////////////////////////////////////////////////

    caap.autoKobo = function() {
        try {
            var button = $j(),
                koboDIV = $j(),
                ginDIV = $j(),
                gin_left = 10,
                hours = 24,
                minutes = 0,
                rClick,
                addClick = false;


            if ((!config.getItem('AutoKobo', true)) || (!schedule.check('AutoKoboTimerDelay'))) {
                caap.setDivContent('kobo_mess', schedule.check('AutoKoboTimerDelay') ? 'Kobo = none' : 'Next Kobo: ' + $u.setContent(caap.displayTime('AutoKoboTimerDelay'), "Unknown"));
                button = null;
                koboDIV = null;
                ginDIV = null;
                return false;
            }
            con.log(2, "autoKobo");

            koboDIV = $j("div[style*='emporium_top']");
            if (!koboDIV || koboDIV.length === 0) {
                con.log(2, "Going to emporium");
                if (caap.navigateTo('goblin_emp')) {
                    button = null;
                    koboDIV = null;
                    ginDIV = null;
                    return true;
                }

                button = null;
                koboDIV = null;
                ginDIV = null;
                throw "Impossible to navigate to emporium page";
            }

            if ($u.hasContent(caap.resultsText) &&  /You have exceeded the 10 emporium roll limit for the day. Come back tomorrow for another chance!/.test(caap.resultsText)) {
                con.log(1, "caap.autoKobo", caap.resultsText);
                schedule.setItem('AutoKoboTimerDelay', ((hours * 60) + minutes) * 60, 100);
                caap.setDivContent('kobo_mess', schedule.check('AutoKoboTimerDelay') ? 'Kobo = none' : 'Next Kobo: ' + $u.setContent(caap.displayTime('AutoKoboTimerDelay'), "Unknown"));
                button = null;
                koboDIV = null;
                ginDIV = null;
                return false;
            }

            gin_left = Math.min(($j("span[id='gin_left_amt']")).text(), 10);
            con.log(4, "gin_left = ", gin_left);
            if (gin_left > 0) {
                var ingredientDIV = $j("div[class='ingredientUnit']" + (config.getItem('autoKoboAle', false) ? "" : "[id!='gout_6_261']") + ">div>span[id*='gout_value']"),
                    countClick = 0,
                    blackList = config.getList('kobo_blacklist', '');

                con.log(4, "ingredientDIV = ", ingredientDIV);
                ingredientDIV.each(function(_i, _e) {
                    var count = $j(_e).text(),
                        name = $j(_e).parent().parent()[0].children[0].children[0].alt,
    					blackListed=false, p=0, len=0;

                    con.log(3, "ingredient " + _i + " '" + name + "' :count = " + count);
                    if (count > config.getItem('koboKeepUnder', 10) && (gin_left > countClick) ) {
						for (p = 0, len = blackList.length; p < len; p += 1) {
							if (name.trim().toLowerCase()===blackList[p].trim().toLowerCase()) { 
								con.log(2, "ingredient " + _i + " '" + name + "' is black listed");
								blackListed = true; 
							}
						}
						if (!blackListed) {
							addClick = true;
							countClick = countClick + 1;
							$j(_e).parent().parent().click();
						}
                    }
                });

                if (!addClick) {
                    schedule.setItem('AutoKoboTimerDelay', ((hours * 60) + minutes) * 60);
                    caap.setDivContent('kobo_mess', schedule.check('AutoKoboTimerDelay') ? 'Kobo = none' : 'Next Kobo: ' + $u.setContent(caap.displayTime('AutoKoboTimerDelay'), "Unknown"));
                    button = null;
                    koboDIV = null;
                    ginDIV = null;
                    return false;
                }

                if (gin_left > countClick) {
                    button = null;
                    koboDIV = null;
                    ginDIV = null;
                    return true;
                }
            }

            button = caap.checkForImage('emporium_button.gif');
            if (button && button.length > 0) {
                con.log(2, "Click Roll");
                hours = 0;
                minutes = 1;
                schedule.setItem('AutoKoboTimerDelay', ((hours * 60) + minutes) * 60, 100);
                caap.setDivContent('kobo_mess', schedule.check('AutoKoboTimerDelay') ? 'Kobo = none' : 'Next Kobo: ' + $u.setContent(caap.displayTime('AutoKoboTimerDelay'), "Unknown"));
                rClick = caap.click(button);

                button = null;
                koboDIV = null;
                ginDIV = null;
                return rClick;
            }

            button = null;
            koboDIV = null;
            ginDIV = null;
            return false;

        } catch (err) {
            con.error("ERROR in autoKobo: " + err);
            return false;
        }
    };

}());
