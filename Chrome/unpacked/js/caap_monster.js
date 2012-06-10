/////////////////////////////////////////////////////////////////////
//                          MONSTERS AND BATTLES
/////////////////////////////////////////////////////////////////////

caap.checkResults_army_news_feed = function() {
    try {
        if(!config.getItem('enableMonsterFinder', false)) {
            return true;
        }

        feed.items("feed");
        return true;
    } catch (err) {
        con.error("ERROR in checkResults_army_news_feed: " + err);
        return false;
    }
};
caap.checkResults_public_monster_list = function() {
    try {
        if(config.getItem('enableMonsterFinder', false)) {
            feed.publicItems();
        }

        $j("input[name='Attack Dragon']").click(function() {
            var form = $j(this).parents("form").eq(0), userId = $j("input[name='casuser']", form).val().parseInt(), mpool = $j("input[name='mpool']", form).val().parseInt();

            caap.setDomWaiting("/battle_monster.php?casuser=" + userId + "&mpool=" + mpool);
        });
        return true;
    } catch (err) {
        con.error("ERROR in checkResults_public_monster_list: " + err);
        return false;
    }
};
/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
caap.checkResults_fightList = function() {
    try {
        if(feed.isScan && $u.hasContent($j("div[style*='no_monster_back.jpg']", caap.appBodyDiv))) {
            con.log(2, "No monster");
            feed.checked(monster.getItem(''));
            return false;
        }
//        var buttonsDiv = $j("img[src*='dragon_list_btn_'],input[src*='monster_button_']" + (config.getItem("festivalTower", false) ? ",img[src*='festival_monster_']" : ""), caap.appBodyDiv), page = '', monsterReviewed = {}, it = 0, len = 0, url = '', siege = '', engageButtonName = '', monsterName = '', monsterRow = $j("div[style*='monsterlist_container.gif']", caap.appBodyDiv), monsterFull = '', monsterInfo = {}, summonDiv = $j("img[src*='mp_button_summon_']" + (config.getItem("festivalTower", false) ? ",img[src*='festival_monster_summonbtn.gif']" : ""), caap.appBodyDiv), tempText = '', monsterText = '', userId = 0, userName = '', mName = '', md5 = '', pageUserCheck = 0, newInputsDiv = $j();
        var buttonsDiv = $j("img[src*='dragon_list_btn_'],input[src*='monster_button_'],img[src*='festival_monster_'],img[src*='festival_monster2_']", caap.appBodyDiv), page = '', monsterReviewed = {}, it = 0, len = 0, url = '', siege = '', engageButtonName = '', monsterName = '', monsterRow = $j("div[style*='monsterlist_container.gif']", caap.appBodyDiv), monsterFull = '', monsterInfo = {}, summonDiv = $j("img[src*='mp_button_summon_']" + (config.getItem("festivalTower", false) ? ",img[src*='festival_monster_summonbtn.gif']" : ""), caap.appBodyDiv), tempText = '', monsterText = '', userId = 0, userName = '', mName = '', md5 = '', pageUserCheck = 0, newInputsDiv = $j();

        monster.clean();
        // get all buttons to check monsterObjectList
        if(!$u.hasContent(summonDiv) && !$u.hasContent(buttonsDiv) && !$u.hasContent(monsterRow)) {
            con.log(2, "No buttons found");
            return false;
        }
        page = session.getItem('page', 'battle_monster');
        if(page === 'player_monster_list') {
            // Review monsters and find attack and fortify button
            for( it = 0, len = monsterRow.length; it < len; it += 1) {
                // Make links for easy clickin'
                if(!$u.hasContent($j("input", monsterRow.eq(it)))) {
                    con.log(2, "No inputs found", it);
                    continue;
                }
                userId = $u.setContent($j("input[name='casuser']", monsterRow.eq(it)).val(), "0").parseInt();
                if(!$u.hasContent(userId) || userId === 0) {
                    con.log(2, "No userId found");
                    continue;
                }
                userName = userId === caap.stats['FBID'] ? 'Your' : monsterRow.eq(it).children().eq(1).children().eq(0).text().trim();
                tempText = $j("img", monsterRow.eq(it)).eq(0).attr("src").basename();
                monsterText = monster.getListName(tempText);
                mName = userName + ' ' + monsterText;
                con.log(2, "Monster Name", mName);
                con.log(3, "checkResults_fightList page", page);
                md5 = (userId + ' ' + monsterText + ' ' + "battle_monster").toLowerCase().MD5();
                monsterReviewed = monster.getItem(md5);
                monsterReviewed['name'] = mName;
                monsterReviewed['userName'] = userName;
                monsterReviewed['monster'] = monsterText;
                monsterReviewed['userId'] = userId;
                monsterReviewed['md5'] = md5;
                monsterReviewed['type'] = $u.setContent(monsterReviewed['type'], '');
                monsterReviewed['page'] = "battle_monster";
                newInputsDiv = $j("input[name='Attack Dragon']", monsterRow.eq(it));
                engageButtonName = newInputsDiv.attr("src").regex(/(collect|engage)/);
                switch (engageButtonName) {
                    case 'collect' :
                        monsterReviewed['status'] = 'Collect Reward';
                        monsterReviewed['color'] = 'grey';
                        break;
                    case 'engage' :
                        monster.engageButtons[monsterReviewed['md5']] = newInputsDiv;
                        break;
                    case 'complete' :
                        if(!$u.hasContent(monster.completeButton["battle_monster"]['md5'])) {
                            monster.completeButton["battle_monster"]['md5'] = $u.setContent(monsterReviewed['md5'], '');
                            monster.completeButton["battle_monster"]['name'] = $u.setContent(monsterReviewed['name'], '');
                            monster.completeButton["battle_monster"]['button'] = $u.setContent($j("img[src*='cancelButton.gif']", monsterRow.eq(it)), null);
                        }

                        monsterReviewed['status'] = 'Complete';
                        monsterReviewed['color'] = 'grey';
                        break;
                    default :
                }

                monsterReviewed['hide'] = true;
                monsterReviewed['mpool'] = $j("input[name='mpool']", monsterRow.eq(it)).val().parseInt();
                monsterInfo = monster.getInfo(monsterReviewed);
                siege = monsterInfo && monsterInfo.siege ? "&action=doObjective" : '';
                monsterReviewed['feedLink'] = "battle_monster.php?casuser=" + monsterReviewed['userId'] + "&mpool=" + monsterReviewed['mpool'];
                //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                monsterReviewed['link'] = "<a href='" + caap.domain.altered + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                monsterReviewed['joined'] = true;
                monster.setItem(monsterReviewed);
            }
        } else {
            if((page === 'battle_monster' || page === 'festival_tower') && !$u.hasContent(buttonsDiv)) {
                con.log(2, "No monsters to review");
                //feed.checked("Not Found");
                state.setItem('reviewDone', true);
                return true;
            }
            tempText = buttonsDiv.eq(0).parent().attr("href");
            pageUserCheck = session.getItem('pageUserCheck', 0);
            if(pageUserCheck && tempText && !(new RegExp('user=' + caap.stats['FBID']).test(tempText) || /alchemy\.php/.test(tempText))) {
                con.log(2, "On another player's keep.", pageUserCheck);
                return false;
            }

            // Review monsters and find attack and fortify button
            for( it = 0, len = buttonsDiv.length; it < len; it += 1) {
                // Make links for easy clickin'
                url = buttonsDiv.eq(it).parent().attr("href");
                if(!(url && /user=/.test(url) && (/mpool=/.test(url) || /raid\.php/.test(url)))) {
                    continue;
                }
                url = url.replace(/http(s)*:\/\/(apps\.facebook\.com\/castle_age\/|web3\.castleagegame\.com\/castle_ws\/)/, '');
                monsterRow = buttonsDiv.eq(it).parents().eq(3);
                monsterFull = monsterRow.text().trim().innerTrim();
                monsterName = monsterFull.replace(/Completed!/i, '').replace(/Fled!/i, '').replace(/COLLECTION: \d+:\d+:\d+/i, '').trim().innerTrim();
                if(/^Your /.test(monsterName)) {
                    monsterText = monsterName.replace(/^Your /, '').trim().innerTrim().toLowerCase().ucWords();
                    userName = "Your";
                } else if(/Aurelius, Lion's Rebellion/.test(monsterName)) {
                    monsterText = "Aurelius, Lion's Rebellion";
                    userName = monsterName.replace(monsterText, '').trim();
                } else {
                    monsterText = monsterName.replace(new RegExp(".+'s (.+)$"), '$1');
                    userName = monsterName.replace(monsterText, '').trim();
                    monsterText = monsterText.trim().innerTrim().toLowerCase().ucWords();
                }
                tempText = $j("div[style*='.jpg']", monsterRow).eq(0).attr("style").regex(new RegExp(".*\\/(.*\\.jpg)"));
                monsterText = $u.setContent(monster.getListName(tempText), monsterText);
                mName = userName + ' ' + monsterText;
                con.log(2, "Monster Name", mName);
                userId = $u.setContent(url.regex(/user=(\d+)/), 0);
                con.log(3, "checkResults_fightList page", page.replace(/festival_tower\d*/, "festival_battle_monster"), url);
                md5 = (userId + ' ' + monsterText + ' ' + page.replace(/festival_tower\d*/, "festival_battle_monster")).toLowerCase().MD5();
                monsterReviewed = monster.getItem(md5);
                monsterReviewed['name'] = mName;
                monsterReviewed['userName'] = userName;
                monsterReviewed['monster'] = monsterText;
                monsterReviewed['userId'] = userId;
                monsterReviewed['md5'] = md5;
                monsterReviewed['type'] = $u.setContent(monsterReviewed['type'], '');
                monsterReviewed['page'] = page.replace(/festival_tower\d*/, "festival_battle_monster");
                engageButtonName = (page === 'festival_tower' || page === 'festival_tower2') ? $u.setContent(buttonsDiv.eq(it).attr("src"), '').regex(/festival_monster_(\S+)\.gif/i) : $u.setContent(buttonsDiv.eq(it).attr("src"), '').regex(/(dragon_list_btn_\d)/i);

                switch (engageButtonName) {
                    case 'collectbtn' :
                    case 'dragon_list_btn_2' :
                        monsterReviewed['status'] = 'Collect Reward';
                        monsterReviewed['color'] = 'grey';
                        break;
                    case 'engagebtn' :
                    case 'dragon_list_btn_3' :
                        monster.engageButtons[monsterReviewed['md5']] = $j(buttonsDiv.eq(it));
                        break;
                    case 'viewbtn' :
                    case 'dragon_list_btn_4' :
                        if(page === 'raid' && !(/!/.test(monsterFull))) {
                            monster.engageButtons[monsterReviewed['md5']] = $j(buttonsDiv.eq(it));
                            break;
                        }

                        if(page !== "festival_tower" && page !== "festival_tower2" && !$u.hasContent(monster.completeButton[page.replace(/festival_tower\d*/, "battle_monster")]['button']) || !$u.hasContent(monster.completeButton[page.replace(/festival_tower\d*/, "battle_monster")]['md5'])) {
                            monster.completeButton[page.replace(/festival_tower\d*/, "battle_monster")]['md5'] = $u.setContent(monsterReviewed['md5'], '');
                            monster.completeButton[page.replace(/festival_tower\d*/, "battle_monster")]['name'] = $u.setContent(monsterReviewed['name'], '');
                            monster.completeButton[page.replace(/festival_tower\d*/, "battle_monster")]['button'] = $u.setContent($j("img[src*='cancelButton.gif']", monsterRow), null);
                        }

                        monsterReviewed['status'] = 'Complete';
                        monsterReviewed['color'] = 'grey';
                        break;
                    default :
                }

                monsterReviewed['hide'] = true;
                monsterReviewed['mpool'] = /mpool=\d+/.test(url) ? '&mpool=' + url.regex(/mpool=(\d+)/) : '';
                monsterReviewed['mid'] = /mid=\S+/.test(url) ? '&mid=' + url.regex(/mid=(\S+)[&]*/) : '';
                monsterInfo = monster.getInfo(monsterReviewed);
                siege = monsterInfo && monsterInfo.siege ? "&action=doObjective" : '';
                monsterReviewed['feedLink'] = url;
                //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + (page === 'festival_tower' ? 'festival_battle_monster' : page) + ".php?casuser=" + monsterReviewed['userId'] + monsterReviewed['mpool'] + $u.setContent(monsterReviewed['mid'], '') + siege + "'>Link</a>";
                //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                monsterReviewed['link'] = "<a href='" + caap.domain.altered + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                monsterReviewed['joined'] = true;
                monster.setItem(monsterReviewed);
            }
        }

        state.setItem('reviewDone', true);
        caap.updateDashboard(true);
        return true;
    } catch (err) {
        con.error("ERROR in checkResults_fightList: " + err);
        return false;
    }
};

/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
caap.checkResults_battle = function() {
    try {
        var symDiv = $j(), points = [], success = true;

        battle.checkResults();
        symDiv = caap.appBodyDiv.find("img[src*='symbol_tiny_']").not("img[src*='rewards.jpg']");
        if($u.hasContent(symDiv) && symDiv.length === 5) {
            symDiv.each(function(index) {
                var txt = '';
                txt = $j(this).parent().parent().next().text();
                txt = txt ? txt.replace(/\s/g, '') : '';
                if(txt) {
                    points.push(txt);
                } else {
                    success = false;
                    con.warn('Demi temp text problem', txt);
                }
            });
            if(success) {
                caap.demi['ambrosia']['daily'] = caap.getStatusNumbers(points[0]);
                caap.demi['malekus']['daily'] = caap.getStatusNumbers(points[1]);
                caap.demi['corvintheus']['daily'] = caap.getStatusNumbers(points[2]);
                caap.demi['aurora']['daily'] = caap.getStatusNumbers(points[3]);
                caap.demi['azeron']['daily'] = caap.getStatusNumbers(points[4]);
                schedule.setItem("battle", ( gm ? gm.getItem('CheckDemi', 6, hiddenVar) : 6) * 3600, 300);
                caap.SaveDemi();
            }
        } else {
            con.warn('Demi symDiv problem');
        }

        //config.getItem('DoPlayerRecon', false)
        if(battle.reconInProgress) {
            battle.freshmeat("recon");
        }

        return true;
    } catch (err) {
        con.error("ERROR in checkResults_battle: " + err);
        return false;
    }
};

caap.inLevelUpMode = function() {
    try {
        if(!config.getItem('EnableLevelUpMode', true)) {
            //if levelup mode is false then new level up mode is also false (kob)
            state.setItem("newLevelUpMode", false);
            return false;
        }

        if(!caap.stats['indicators']['enl']) {
            //if levelup mode is false then new level up mode is also false (kob)
            state.setItem("newLevelUpMode", false);
            return false;
        }

        // minutesBeforeLevelToUseUpStaEnergy : 5, = 30000
        if(((caap.stats['indicators']['enl'] - Date.now()) < 30000) || (caap.stats['exp']['dif'] <= config.getItem('LevelUpGeneralExp', 20))) {
            //detect if we are entering level up mode for the very first time (kob)
            if(!state.getItem("newLevelUpMode", false)) {
                //set the current level up mode flag so that we don't call refresh monster routine more than once (kob)
                state.setItem("newLevelUpMode", true);
                caap.refreshMonstersListener();
            }

            return true;
        }

        //if levelup mode is false then new level up mode is also false (kob)
        state.setItem("newLevelUpMode", false);
        return false;
    } catch (err) {
        con.error("ERROR in inLevelUpMode: " + err);
        return false;
    }
};
caap.checkStamina = function(battleOrMonster, attackMinStamina) {
    try {
        con.log(4, "checkStamina", battleOrMonster, attackMinStamina);
        if(!attackMinStamina) {
            attackMinStamina = 1;
        }

        var when = config.getItem('When' + battleOrMonster, 'Never'), maxIdleStamina = 0, theGeneral = '', staminaMF = '', messDiv = battleOrMonster.toLowerCase() + "_mess";

        if(when === 'Never') {
            return false;
        }

        if(!caap.stats['stamina'] || !caap.stats['health']) {
            caap.setDivContent(messDiv, 'Health or stamina not known yet.');
            return false;
        }

        if(caap.stats['health']['num'] < 10) {
            caap.setDivContent(messDiv, "Need health to fight: " + caap.stats['health']['num'] + "/10");
            return false;
        }

        if(battleOrMonster === "Battle" && config.getItem("waitSafeHealth", false) && caap.stats['health']['num'] < 13) {
            caap.setDivContent(messDiv, "Unsafe. Need spare health to fight: " + caap.stats['health']['num'] + "/13");
            return false;
        }

        if(when === 'At X Stamina') {
            if(caap.inLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                caap.setDivContent(messDiv, 'Burning stamina to level up');
                return true;
            }
            staminaMF = battleOrMonster + 'Stamina';
            if(state.getItem('BurnMode_' + staminaMF, false) || caap.stats['stamina']['num'] >= config.getItem('X' + staminaMF, 1)) {
                if(caap.stats['stamina']['num'] < attackMinStamina || caap.stats['stamina']['num'] <= config.getItem('XMin' + staminaMF, 0)) {
                    state.setItem('BurnMode_' + staminaMF, false);
                    return false;
                }

                state.setItem('BurnMode_' + staminaMF, true);
                return true;
            } else {
                state.setItem('BurnMode_' + staminaMF, false);
            }
            caap.setDivContent(messDiv, 'Waiting for stamina: ' + caap.stats['stamina']['num'] + "/" + config.getItem('X' + staminaMF, 1));
            return false;
        }

        if(when === 'At Max Stamina') {
            maxIdleStamina = caap.stats['stamina']['max'];
            theGeneral = config.getItem('IdleGeneral', 'Use Current');
            if(theGeneral !== 'Use Current') {
                maxIdleStamina = general.GetStaminaMax(theGeneral);
            }

            if(theGeneral !== 'Use Current' && !maxIdleStamina) {
                con.log(2, "Changing to idle general to get Max Stamina");
                if(general.Select('IdleGeneral')) {
                    return true;
                }
            }

            if(caap.stats['stamina']['num'] >= maxIdleStamina) {
                caap.setDivContent(messDiv, 'Using max stamina');
                return true;
            }

            if(caap.inLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                caap.setDivContent(messDiv, 'Burning all stamina to level up');
                return true;
            }

            caap.setDivContent(messDiv, 'Waiting for max stamina: ' + caap.stats['stamina']['num'] + "/" + maxIdleStamina);
            return false;
        }

        if(caap.stats['stamina']['num'] >= attackMinStamina) {
            return true;
        }

        caap.setDivContent(messDiv, "Waiting for more stamina: " + caap.stats['stamina']['num'] + "/" + attackMinStamina);
        return false;
    } catch (err) {
        con.error("ERROR in checkStamina: " + err);
        return false;
    }
};
/*-------------------------------------------------------------------------------------\
 needToHide will return true if the current stamina and health indicate we need to bring
 our health down through battles (hiding).  It also returns true if there is no other outlet
 for our stamina (currently this just means Monsters, but will eventually incorporate
 other stamina uses).
 \-------------------------------------------------------------------------------------*/
caap.needToHide = function() {
    try {
        if(config.getItem('WhenMonster', 'Never') === 'Never') {
            con.log(1, 'Stay Hidden Mode: Monster battle not enabled');
            return true;
        }

        if(!state.getItem('targetFrombattle_monster', '')) {
            con.log(1, 'Stay Hidden Mode: No monster to battle');
            return true;
            if(config.getItem('delayStayHidden', true) === false) {
                con.log(2, 'Stay Hidden Mode: Delay hide if "safe" not enabled');
                return true;
            }

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
        var riskConstant = gm ? gm.getItem('HidingRiskConstant', 1.7, hiddenVar) : 1.7;
        /*-------------------------------------------------------------------------------------\
        The formula for determining if we should hide goes something like this:

        If  (health - (estimated dmg from next attacks) puts us below 10)  AND
        (current stamina will be at least 5 using staminatime/healthtime ratio)
        Then stamina can be used/saved for normal process
        Else stamina is used for us to hide

        \-------------------------------------------------------------------------------------*/
        //if ((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && (caap.stats['stamina']['num'] * (5 / 3) >= 5)) {
        if((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && ((caap.stats['stamina']['num'] + ( gm ? gm.getItem('HideStaminaRisk', 1, hiddenVar) : 1)) >= state.getItem('MonsterStaminaReq', 1))) {
            return false;
        } else {
            return true;
        }
    } catch (err) {
        con.error("ERROR in needToHide: " + err);
        return undefined;
    }
};
/*jslint sub: false */

caap.monsters = function() {
    try {
        if(config.getItem('WhenMonster', 'Never') === 'Never') {
            caap.setDivContent('monster_mess', 'Monster off');
            return false;
        }

        ///////////////// Reivew/Siege all monsters/raids \\\\\\\\\\\\\\\\\\\\\\

        if(config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && caap.needToHide() && caap.checkStamina('Monster', 1)) {
            con.log(1, "Stay Hidden Mode: We're not safe. Go battle.");
            caap.setDivContent('monster_mess', 'Not Safe For Monster. Battle!');
            return false;
        }

        if(!schedule.check('NotargetFrombattle_monster')) {
            return false;
        }

        ///////////////// Individual Monster Page \\\\\\\\\\\\\\\\\\\\\\

        // Establish a delay timer when we are 1 stamina below attack level.
        // Timer includes 5 min for stamina tick plus user defined random interval
        if(!caap.inLevelUpMode() && caap.stats['stamina']['num'] === (state.getItem('MonsterStaminaReq', 1) - 1) && schedule.check('battleTimer') && config.getItem('seedTime', 0) > 0) {
            schedule.setItem('battleTimer', 300, config.getItem('seedTime', 0));
            caap.setDivContent('monster_mess', 'Monster Delay Until ' + caap.displayTime('battleTimer'));
            return false;
        }

        if(!schedule.check('battleTimer')) {
            if(caap.stats['stamina']['num'] < general.GetStaminaMax(config.getItem('IdleGeneral', 'Use Current'))) {
                caap.setDivContent('monster_mess', 'Monster Delay Until ' + caap.displayTime('battleTimer'));
                return false;
            }
        }

        var fightMode = '', targetMonster = state.getItem('targetFromfortify', new monster.energyTarget().data), monsterName = targetMonster['name'], nodeNum = 0, energyRequire = 10, currentMonster = monster.getItem(targetMonster['md5']), monsterInfo = monster.getInfo(currentMonster), attackButton = null, singleButtonList = [], buttonList = [], tacticsValue = 0, useTactics = false, attackMess = '', pageUserCheck = 0, it = 0, len = 0, buttonHref = '', theGeneral = config.getItem('FortifyGeneral', 'Use Current');
        monsterInfo = $u.hasContent(currentMonster['type']) ? (currentMonster['type'] === "Raid II" ? monsterInfo.stage2 : monsterInfo.stage1) : monsterInfo;
        if(monsterInfo) {
            if(!caap.inLevelUpMode() && config.getItem('PowerFortifyMax', false) && monsterInfo.staLvl) {
                for( nodeNum = monsterInfo.staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                    if(caap.stats['stamina']['max'] >= monsterInfo.staLvl[nodeNum]) {
                        break;
                    }
                }
            }
            energyRequire = $u.isDefined(nodeNum) && nodeNum >= 0 && config.getItem('PowerAttackMax', false) && monsterInfo.nrgMax ? monsterInfo.nrgMax[nodeNum] : monsterInfo.nrgMax ? monsterInfo.nrgMax[0] : energyRequire;
        }

        con.log(4, "Energy Required/Node", energyRequire, nodeNum);
        theGeneral = theGeneral === "Under Level" ? (config.getItem('ReverseLevelUpGenerals') ? general.GetLevelUpNames().reverse().pop() : general.GetLevelUpNames().pop()) : theGeneral;
        switch (theGeneral) {
            case 'Orc King':
                energyRequire = energyRequire * (general.GetLevel('Orc King') + 1);
                con.log(3, 'Monsters Fortify:Orc King', energyRequire);
                break;
            case 'Barbarus':
                energyRequire = energyRequire * (general.GetLevel('Barbarus') === 4 ? 3 : 2);
                con.log(3, 'Monsters Fortify:Barbarus', energyRequire);
                break;
            case 'Maalvus':
                energyRequire = energyRequire * (general.GetLevel('Maalvus') >= 3 ? 3 : 2);
                con.log(2, 'Monsters Fortify:Maalvus', energyRequire);
                break;
            default:
        }

        // Check to see if we should fortify or attack monster
        if(monsterName && caap.checkEnergy(energyRequire, ( gm ? gm.getItem('WhenFortify', 'Energy Available', hiddenVar) : 'Energy Available'), 'fortify_mess')) {
            fightMode = 'Fortify';
        } else {
            targetMonster = state.getItem('targetFrombattle_monster', '');
            currentMonster = monster.getItem(targetMonster);
            monsterName = currentMonster['name'];
            monsterInfo = monster.getInfo(currentMonster);
            if(monsterName && caap.checkStamina('Monster', state.getItem('MonsterStaminaReq', 1)) && currentMonster['page'].replace('festival_battle_monster', 'battle_monster') === 'battle_monster') {
                fightMode = 'Monster';
            } else {
                schedule.setItem('NotargetFrombattle_monster', 60);
                return false;
            }
        }

        // Set right general
        if(general.Select(fightMode + 'General')) {
            return true;
        }

        // Check if on engage monster page
        if($u.hasContent($j("div[style*='dragon_title_owner'],div[style*='nm_top'],div[style*='monster_header_'],div[style*='monster_'][style*='_header'],div[style*='boss_'][style*='_header'],div[style*='festival_monsters_top_']", caap.appBodyDiv))) {
            if(monster.confirmRightPage(monsterName)) {
                return true;
            }
            singleButtonList = ['button_nm_p_attack.gif', 'attack_monster_button.jpg', 'event_attack1.gif', 'seamonster_attack.gif', 'event_attack2.gif', 'attack_monster_button2.jpg'];

                // if the monster has parts, run through them in reverse order until we find one with health and hit it.
            var partsTargets = $j("div[id^='monster_target_']");
            if (partsTargets.length > 0) {
                for (var ii=2; ii > 0; ii--) {
                    if (partsTargets[ii].children[0].children[1].children[0].children[0].style.width.replace ('%', '') * 1 > 0) {
                        caap.click(partsTargets[ii].children[0].children[1].children[1].children[0]);
                        break;
                    }
                }
            }

            // Find the attack or fortify button
            if(fightMode === 'Fortify') {
                buttonList = ['seamonster_fortify.gif', 'button_dispel.gif', 'attack_monster_button3.jpg'];

                if(monsterInfo && monsterInfo.fortify_img) {
                    buttonList.unshift(monsterInfo.fortify_img[0]);
                }

                if(currentMonster && currentMonster['stunDo'] && currentMonster['stunType'] !== '') {
                    buttonList.unshift("button_nm_s_" + currentMonster['stunType']);
                } else {
                    buttonList.unshift("button_nm_s_");
                }
            } else if(state.getItem('MonsterStaminaReq', 1) === 1) {
                // not power attack only normal attacks
                buttonList = singleButtonList;
            } else {
                if(currentMonster['conditions'] && currentMonster['conditions'].match(/:tac/i) && caap.stats['level'] >= 50) {
                    useTactics = true;
                    tacticsValue = monster.parseCondition("tac%", currentMonster['conditions']);
                } else if(config.getItem('UseTactics', false) && caap.stats['level'] >= 50) {
                    useTactics = true;
                    tacticsValue = config.getItem('TacticsThreshold', false);
                }

                if(tacticsValue !== false && currentMonster['fortify'] && currentMonster['fortify'] < tacticsValue) {
                    con.log(2, "Party health is below threshold value", currentMonster['fortify'], tacticsValue);
                    useTactics = false;
                }

                if(useTactics && caap.hasImage('nm_button_tactics.gif')) {
                    con.log(2, "Attacking monster using tactics buttons");
                    buttonList = ['nm_button_tactics.gif'].concat(singleButtonList);
                } else {
                    con.log(2, "Attacking monster using regular buttons");
                    useTactics = false;
                    // power attack or if not seamonster power attack or if not regular attack -
                    // need case for seamonster regular attack?
                    buttonList = ['button_nm_p_power', 'button_nm_p_', 'power_button_', 'attack_monster_button2.jpg', 'event_attack2.gif', 'seamonster_power.gif', 'event_attack1.gif', 'attack_monster_button.jpg'].concat(singleButtonList);

                    if(monsterInfo && monsterInfo.attack_img) {
                        if(!caap.inLevelUpMode() && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false)) {
                            buttonList.unshift(monsterInfo.attack_img[1]);
                        } else {
                            buttonList.unshift(monsterInfo.attack_img[0]);
                        }
                    }
                }
            }

            con.log(4, "monster/button list", currentMonster, buttonList);
            nodeNum = 0;
            if(!caap.inLevelUpMode()) {
                if(((fightMode === 'Fortify' && config.getItem('PowerFortifyMax', false)) || (fightMode !== 'Fortify' && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false))) && monsterInfo.staLvl) {
                    for( nodeNum = monsterInfo.staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                        if(caap.stats['stamina']['max'] >= monsterInfo.staLvl[nodeNum]) {
                            break;
                        }
                    }
                }
            }

            for( it = 0, len = buttonList.length; it < len; it += 1) {
                attackButton = caap.checkForImage(buttonList[it], null, null, nodeNum);
                if($u.hasContent(attackButton)) {
                    break;
                }
            }

            if(attackButton) {
                if(fightMode === 'Fortify') {
                    attackMess = 'Fortifying ' + monsterName;
                } else if(useTactics) {
                    attackMess = 'Tactic Attacking ' + monsterName;
                } else {
                    attackMess = (state.getItem('MonsterStaminaReq', 1) >= 5 ? 'Power' : 'Single') + ' Attacking ' + monsterName;
                }

                con.log(1, attackMess);
                caap.setDivContent('monster_mess', attackMess);
                session.setItem('ReleaseControl', true);
                caap.click(attackButton);
                // dashboard autorefresh fix
                localStorage.AFrecentAction = true;

                return true;
            } else {
                con.warn('No button to attack/fortify with.');
                schedule.setItem('NotargetFrombattle_monster', 60);
                return false;
            }
        }

        ///////////////// Check For Monster Page \\\\\\\\\\\\\\\\\\\\\\
        if(currentMonster['page'] === 'battle_monster') {
            if(caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                return true;
            }
        } else if(currentMonster['page'] === 'festival_battle_monster') {
            if(caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg')) {
                return true;
            }
        } else {
            con.warn('What kind of monster?', currentMonster);
            return false;
        }
        buttonHref = $u.setContent($j("img[src*='dragon_list_btn_']", caap.appBodyDiv).eq(0).parent().attr("href"), '');
        pageUserCheck = session.getItem('pageUserCheck', 0);
        if(pageUserCheck && (!buttonHref || !new RegExp('user=' + caap.stats['FBID']).test(buttonHref) || !/alchemy\.php/.test(buttonHref))) {
            con.log(2, "On another player's keep.", pageUserCheck);
            if(currentMonster['page'] === 'battle_monster') {
                return caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif');
            } else if(currentMonster['page'] === 'festival_battle_monster') {
                return caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg');
            } else {
                con.warn('What kind of monster?', currentMonster);
                return false;
            }
        }

        if(config.getItem('clearCompleteMonsters', false) && $u.hasContent(monster.completeButton['battle_monster']['button']) && $u.hasContent(monster.completeButton['battle_monster']['md5'])) {
            caap.click(monster.completeButton['battle_monster']['button']);
            monster.deleteItem(monster.completeButton['battle_monster']['md5']);
            monster.completeButton['battle_monster'] = {
                'md5' : undefined,
                'name' : undefined,
                'button' : undefined
            };
            caap.updateDashboard(true);
            con.log(1, 'Cleared a completed monster');
            return true;
        }

        if($u.hasContent(monster.engageButtons[currentMonster['md5']])) {
            caap.setDivContent('monster_mess', 'Opening ' + monsterName);
            caap.click(monster.engageButtons[currentMonster['md5']]);
            return true;
        } else {
            schedule.setItem('NotargetFrombattle_monster', 60);
            con.warn('No "Engage" button for ', monsterName);
            return false;
        }
    } catch (err) {
        con.error("ERROR in monsters: " + err);
        return false;
    }
};
/*-------------------------------------------------------------------------------------\
 MonsterReview is a primary action subroutine to mange the monster and raid list
 on the dashboard
 \-------------------------------------------------------------------------------------*/
caap.monsterReview = function() {
    try {
        /*-------------------------------------------------------------------------------------\
         We do monster review once an hour.  Some routines may reset this timer to drive
         MonsterReview immediately.
         \-------------------------------------------------------------------------------------*/
        if(!schedule.check("monsterReview") || (config.getItem('WhenMonster', 'Never') === 'Never' && config.getItem('WhenBattle', 'Never') === 'Never')) {
            return false;
        }

        /*-------------------------------------------------------------------------------------\
         We get the monsterReviewCounter.  This will be set to -3 if we are supposed to refresh
         the monsterOl completely. Otherwise it will be our index into how far we are into
         reviewing monsterOl.
         Update:
         monsterReviewCounter is now set to -10 so there is room for more monsters later
         \-------------------------------------------------------------------------------------*/
        var fCounter = config.getItem("festivalTower", false) ? -4 : -3,
//            counter = state.getItem('monsterReviewCounter', fCounter),
            firstMonster = -4,
            counter = state.getItem('monsterReviewCounter', firstMonster),
            link = '',
            tempTime = 0,
            isSiege = false,
            monsterInfo = {};
/*
        if(counter === fCounter) {
            state.setItem('monsterReviewCounter', counter += 1);
            return true;
        }
*/
        // festival tower 2
        if(counter <= -4) {
            state.setItem('monsterReviewCounter', counter = firstMonster);
            if(config.getItem("festivalTower", false)) {
                if(caap.stats['level'] > 6) {
                    if(caap.navigateTo('soldiers,festival_home,festival_tower2', 'festival_monster2_towerlist_button.jpg')) {
                        state.setItem('reviewDone', false);
                        return true;
                    }
                } else {
                    con.log(1, "Monsters: Unlock at level 7");
                    state.setItem('reviewDone', true);
                }
                if(state.getItem('reviewDone', true)) {
                    state.setItem('monsterReviewCounter', counter += 1);
                } else {
                    return true;
                }
            } else {
                state.setItem('monsterReviewCounter', counter += 1);
            }
        }
        // festival tower
        if(counter === -3) {
            if(config.getItem("festivalTower", false)) {
                state.setItem('monsterReviewCounter', counter += 1);
                if(caap.stats['level'] > 6) {
                    if(caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg')) {
                        state.setItem('reviewDone', false);
                        return true;
                    }
                } else {
                    con.log(1, "Monsters: Unlock at level 7");
                    state.setItem('reviewDone', true);
                }

                if(state.getItem('reviewDone', true)) {
                    state.setItem('monsterReviewCounter', counter += 1);
                } else {
                    return true;
                }
            } else {
                    state.setItem('monsterReviewCounter', counter += 1);
            }
        }
        if(counter === -2) {
            if(caap.stats['level'] > 6) {
                if(caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                    state.setItem('reviewDone', false);
                    return true;
                }
            } else {
                con.log(1, "Monsters: Unlock at level 7");
                state.setItem('reviewDone', true);
            }

            if(config.getItem('clearCompleteMonsters', false) && $u.hasContent(monster.completeButton['battle_monster']['button']) && $u.hasContent(monster.completeButton['battle_monster']['md5'])) {
                caap.click(monster.completeButton['battle_monster']['button']);
                monster.deleteItem(monster.completeButton['battle_monster']['md5']);
                monster.completeButton['battle_monster'] = {
                    'md5' : undefined,
                    'name' : undefined,
                    'button' : undefined
                };
                caap.updateDashboard(true);
                con.log(1, 'Cleared a completed monster');
                return true;
            }

            if(state.getItem('reviewDone', true)) {
                state.setItem('monsterReviewCounter', counter += 1);
            } else {
                return true;
            }
        }

        if(counter === -1) {
            if(caap.stats['level'] > 7) {
                // This is a temporary fix for the web3 url until CA fix their HTML
                if(caap.domain.which === 2 && !$u.hasContent($j("img[src*='tab_raid_']", caap.appBodyDiv))) {
                    if(caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                        return true;
                    }

                    caap.clickAjaxLinkSend("raid.php");
                    return true;
                }

                if(caap.navigateTo(caap.battlePage + ',raid', 'tab_raid_on.gif')) {
                    state.setItem('reviewDone', false);
                    return true;
                }
            } else {
                con.log(1, "Raids: Unlock at level 8");
                state.setItem('reviewDone', true);
            }

            if(config.getItem('clearCompleteRaids', false) && $u.hasContent(monster.completeButton['raid']['button']) && $u.hasContent(monster.completeButton['raid']['md5'])) {
                caap.click(monster.completeButton['raid']['button']);
                monster.deleteItem(monster.completeButton['raid']['md5']);
                monster.completeButton['raid'] = {
                    'md5' : undefined,
                    'name' : undefined,
                    'button' : undefined
                };
                caap.updateDashboard(true);
                con.log(1, 'Cleared a completed raid');
                return true;
            }

            if(state.getItem('reviewDone', true)) {
                state.setItem('monsterReviewCounter', counter += 1);
            } else {
                return true;
            }
        }

        if(monster.records && monster.records.length === 0) {
            return false;
        }

        /*-------------------------------------------------------------------------------------\
         Now we step through the monsterOl objects. We set monsterReviewCounter to the next
         index for the next reiteration since we will be doing a click and return in here.
         \-------------------------------------------------------------------------------------*/
        while(counter < monster.records.length) {
            if(!monster.records[counter]) {
                state.setItem('monsterReviewCounter', counter += 1);
                continue;
            }
            /*-------------------------------------------------------------------------------------\
             If we looked at this monster more recently than an hour ago, skip it
             \-------------------------------------------------------------------------------------*/
            if(monster.records[counter]['color'] === 'grey' && monster.records[counter]['life'] !== -1) {
                monster.records[counter]['life'] = -1;
                monster.records[counter]['fortify'] = -1;
                monster.records[counter]['strength'] = -1;
                monster.records[counter]['time'] = [];
                monster.records[counter]['t2k'] = -1;
                monster.records[counter]['phase'] = '';
                monster.save();
            }
            tempTime = monster.records[counter]['review'] ? monster.records[counter]['review'] : -1;
            con.log(4, "Review", monster.records[counter], !schedule.since(tempTime, ( gm ? gm.getItem("MonsterLastReviewed", 15, hiddenVar) : 15) * 60));
            if(monster.records[counter]['status'] === 'Complete' || !schedule.since(tempTime, ( gm ? gm.getItem("MonsterLastReviewed", 15, hiddenVar) : 15) * 60) || state.getItem('monsterRepeatCount', 0) > 2) {
                state.setItem('monsterReviewCounter', counter += 1);
                state.setItem('monsterRepeatCount', 0);
                continue;
            }
            /*-------------------------------------------------------------------------------------\
             We get our monster link
             \-------------------------------------------------------------------------------------*/
            caap.setDivContent('monster_mess', 'Reviewing/sieging ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
            link = monster.records[counter]['link'];
            /*-------------------------------------------------------------------------------------\
             If the link is good then we get the url and any conditions for monster
             \-------------------------------------------------------------------------------------*/
            if(/href/.test(link)) {
                link = link.split("'")[1];
                /*-------------------------------------------------------------------------------------\
                 If the autocollect token was specified then we set the link to do auto collect. If
                 the conditions indicate we should not do sieges then we fix the link.
                 \-------------------------------------------------------------------------------------*/
                isSiege = monster.records[counter]['monster'] === 'The Deathrune Siege' ? true : false;
                monsterInfo = monster.getInfo(monster.records[counter]);
                con.log(4, "monster.records[counter]", monster.records[counter]);
                if(((monster.records[counter]['conditions'] && /:ac\b/.test(monster.records[counter]['conditions'])) || (isSiege && config.getItem('raidCollectReward', false)) || (!isSiege && config.getItem('monsterCollectReward', false))) && monster.records[counter]['status'] === 'Collect Reward') {

                    if(general.Select('CollectGeneral')) {
                        return true;
                    }
                    link += '&action=collectReward';
                    if(isSiege) {
                        if(monster.records[counter]['rix'] !== -1) {
                            link += '&rix=' + monster.records[counter]['rix'];
                        } else {
                            link += '&rix=2';
                        }
                    }
                    link = link.replace('&action=doObjective', '');
                    state.setItem('CollectedRewards', true);
                } else if((monster.records[counter]['conditions'] && monster.records[counter]['conditions'].match(':!s')) || (!config.getItem('raidDoSiege', true) && isSiege) || (!config.getItem('monsterDoSiege', true) && !isSiege && monsterInfo && monsterInfo.siege) || caap.stats['stamina']['num'] === 0) {
                    con.log(2, "Do not siege");
                    link = link.replace('&action=doObjective', '');
                }
                /*-------------------------------------------------------------------------------------\
                 Now we use ajaxSendLink to display the monsters page.
                 \-------------------------------------------------------------------------------------*/
                con.log(1, 'Reviewing ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
                session.setItem('ReleaseControl', true);
                //link = link.replace(caap.domain.link + '/', '').replace('?', '?twt2&');
                link = link.replace(caap.domain.altered + '/', '').replace('?', '?twt2&');

                con.log(3, "Link", link);
                caap.clickAjaxLinkSend(link);
                state.setItem('monsterRepeatCount', state.getItem('monsterRepeatCount', 0) + 1);
                session.setItem('resetselectMonster', true);
                return true;
            }
        }
        /*-------------------------------------------------------------------------------------\
         All done.  Set timer and tell monster.select and dashboard they need to do thier thing.
         We set the monsterReviewCounter to do a full refresh next time through.
         \-------------------------------------------------------------------------------------*/
        schedule.setItem("monsterReview", ( gm ? gm.getItem('monsterReviewMins', 60, hiddenVar) : 60) * 60, 300);
        session.setItem('resetselectMonster', true);
        state.setItem('monsterReviewCounter', config.getItem("festivalTower", false) ? -4 : -3);
        con.log(1, 'Done with monster/raid review.');
        caap.setDivContent('monster_mess', '');
        caap.updateDashboard(true);
        if(state.getItem('CollectedRewards', false)) {
            state.setItem('CollectedRewards', false);
            monster.flagReview();
        }

        return true;
    } catch (err) {
        con.error("ERROR in monsterReview: " + err);
        return false;
    }
};

/*jslint sub: false */

caap.checkResults_viewFight = function(ajax) {
    try {
        var slice = ajax ? caap.tempAjax : caap.appBodyDiv, currentMonster = {}, time = [], tempDiv = $j(), tempText = '', tempArr = [], counter = 0, monstHealthImg = '', totalCount = 0, ind = 0, len = 0, searchStr = '', searchRes = $j(), achLevel = 0, maxDamage = 0, maxToFortify = 0, isTarget = false, KOBenable = false, KOBbiasHours = 0, KOBach = false, KOBmax = false, KOBminFort = false, KOBtmp = 0, KOBtimeLeft = 0, KOBbiasedTF = 0, KOBPercentTimeRemaining = 0, KOBtotalMonsterTime = 0,
        monsterDiv = $j("div[style*='dragon_title_owner'],div[style*='monster_header_'],div[style*='monster_'][style*='_header'],div[style*='boss_'][style*='_header'],div[style*='boss_header_']" + (config.getItem("festivalTower", false) ? ",div[style*='festival_monsters_top_']" : ""), slice), actionDiv = $j(), damageDiv = $j(), damageDivNew = false, monsterInfo = {}, targetFromfortify = {}, tStr = '', tNum = 0, tBool = false, fMonstStyle = '', nMonstStyle = '', nMonstStyle2 = '', id = 0, userName = '', mName = '', feedMonster = '', md5 = '',
        //page              = session.getItem('page', 'battle_monster'),
        page = $j(".game", ajax ? slice : caap.globalContainer).eq(0).attr("id").replace(caap.domain.id[caap.domain.which], ''), matches = true, ctaDiv = $j(), dragonDiv = $j(".dragonContainer", slice), dleadersDiv = $j("td:eq(1) div[style*='bold']:eq(0) div:last", dragonDiv), maxJoin = dleadersDiv.text().regex(/(\d+)/), countJoin = 0, it = 0, jt = 0, groups = {}, groupMatch = false, found = false;
            // new monster layout logic
        if (dleadersDiv.text() == '') {
            var dleadersDiv2 = $j("div[id*='leaderboard_0']")[0].children;
            maxJoin = dleadersDiv2[0].children[1].innerHTML.regex(/(\d+)/);
            /* this is the begining of logic that will loop through the leaders and count them for the X/Y stuff, not really important so I'm skipping it for now
            for (var ii = 1; ii < dleadersDiv2.length; ii++) {		// start at 1 to skip the title 'Damage Leaders:'
                if (dleadersDiv2[ii].children.length > 0) {
                    con.log (1, "dleadersDiv2 each", ii, dleadersDiv2[ii].children.length, dleadersDiv2[ii], dleadersDiv2[ii].innerHTML);
                }
            }*/
        } else {		// this is for monster still on the old style, Tower 1, Tower 2, Conquest
            con.log(3, "Damage Leaders", dleadersDiv.text(), maxJoin);
            tempDiv = $j("td[colspan='2']:contains('Levels'),td[colspan='2']:contains('Allies')", dragonDiv);
            if($u.hasContent(tempDiv)) {
                tempDiv.each(function(index) {
                    $j(this).parent().attr("id", "mark" + index);
                });

                tempDiv.each(function(index) {
                    var group = $j(this), levels = $j("b", group).text(), start = levels.regex(/Levels (\d+)/), max = group.text().trim().innerTrim().replace(levels, '').trim(), maxNum = max.regex(/(\d+)/), count = group.parent().nextUntil("#mark" + (index + 1)).find("a[href*='keep.php']").length;

                    con.log(3, "groups", index, levels, start, maxNum, count);
                    groups[levels] = {
                        'level' : start,
                        'max' : maxNum,
                        'count' : count
                    };
                    countJoin += count;
                    if(!feed.isScan && !ajax) {
                        group.html("<div><b>" + levels + "</b> [" + count + "/" + maxNum + " max]</div>");
                    }
                });
            } else {
                tempDiv = $j("table:eq(1) a", dragonDiv);
                countJoin = tempDiv.length;
            }
        }

        groups['total'] = {
            'max' : maxJoin,
            'count' : countJoin
        };
        con.log(3, "groups", groups);
        if(!feed.isScan && !ajax) {
            dleadersDiv.html("[" + countJoin + "/" + maxJoin + "max]");
        }

        if((feed.isScan || ajax) && $u.hasContent(feed.scanRecord['page']) && feed.scanRecord['page'] !== page) {
            page = feed.scanRecord['page'];
            con.log(2, "Page mismatch so using feed.scanRecord page", page, feed.scanRecord['page']);
            if(config.getItem("DebugLevel", 1) > 1) {
                $j().alert("Page mismatch so using feed.scanRecord page<br />" + page + '<br />' + feed.scanRecord['page']);
            }
        }

        con.log(3, "GAME PAGE", page);
        if(!feed.isScan && !ajax) {
            battle.checkResults();
            if(config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            caap.chatLink(slice, "#" + caap.domain.id[caap.domain.which] + "chat_log div[style*='hidden'] div[style*='320px']");
        }

        con.log(4, "monsterDiv", monsterDiv);
        if($u.hasContent(monsterDiv)) {
            fMonstStyle = monsterDiv.attr("style").regex(/(festival_monsters_top_\S+\.jpg)/);
            con.log(2, "fMonstStyle", fMonstStyle);
            if(!$u.hasContent(fMonstStyle)) {
                nMonstStyle = monsterDiv.attr("style").regex(new RegExp(".+\\/(.+_header_\\S+\\.jpg)"));
                nMonstStyle2 = monsterDiv.attr("style").regex(new RegExp(".+\\/(.+_header.jpg)"));
                con.log(2, "nMonstStyle", nMonstStyle);
            }

            if($u.hasContent(fMonstStyle) || $u.hasContent(nMonstStyle) || $u.hasContent(nMonstStyle2)) {
                tempDiv = monsterDiv.find(":contains('summoned'):last,:contains('Summoned'):last");
                if($u.hasContent(fMonstStyle)) {
                    tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/summoned/i, monster.getFestName(fMonstStyle));
                } else {
                    if($u.hasContent(nMonstStyle)) {
                        tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/ summoned/i, "'s " + monster.getNewName(nMonstStyle));
                    } else {
                        tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/ summoned/i, "'s " + monster.getNewName(nMonstStyle2));
                    }
                }
            } else {
                // old pages - shouldn't exist any more
                tempText = $u.setContent(monsterDiv.children(":eq(2)").text(), '').trim().innerTrim();
            }

            con.log(3, "tempText", tempText);
        } else {
            monsterDiv = $j("div[style*='nm_top']", slice);
            if($u.hasContent(monsterDiv)) {
                tempText = $u.setContent(monsterDiv.children(":eq(0)").children(":eq(0)").text(), '').trim().innerTrim();
                tempDiv = $j("div[style*='nm_bars']", slice);
                if($u.hasContent(tempDiv)) {
                    tempText += ' ' + $u.setContent(tempDiv.children(":eq(0)").children(":eq(0)").children(":eq(0)").siblings(":last").children(":eq(0)").text(), '').trim().replace("'s Life", "");
                } else {
                    con.warn("Problem finding nm_bars");
                    return;
                }
            } else {
                if($u.hasContent(fMonstStyle)) {
                    $j().alert(fMonstStyle + "<br />I do not know this monster!<br />Please inform me.");
                }

                if($u.hasContent($j("div[style*='no_monster_back.jpg']", slice))) {
                    con.log(2, "No monster");
                } else {
                    con.warn("Problem finding dragon_title_owner and nm_top");
                }

                feed.checked(monster.getItem(''));
                return;
            }
        }

        if($u.hasContent(monsterDiv)) {
            id = $u.setContent($j("img[src*='profile.ak.fbcdn.net']", monsterDiv).attr("uid"), '').regex(/(\d+)/);
            id = $u.setContent(id, $u.setContent($j(".fb_link[href*='profile.php']", monsterDiv).attr("href"), '').regex(/id=(\d+)/));
            id = $u.setContent(id, $u.setContent($j("img[src*='graph.facebook.com']", monsterDiv).attr("src"), '').regex(/\/(\d+)\//));
            id = $u.setContent(id, $u.setContent($j("button[onclick*='ajaxSectionUpdate']", slice).attr("onclick") + "", '').regex(/user=(\d+)/));
            if ($j("input[name*='guild_creator_id']").length > 0)
                id = $u.setContent(id, $j("input[name*='guild_creator_id']")[0].value);
            id = $u.setContent(id, (feed.isScan || ajax) ? feed.scanRecord['id'] : 0);
            con.log(3, "USER ID", id);
            if(id === 0 || !$u.hasContent(id)) {
                con.warn("Unable to get id!");
                if(config.getItem("DebugLevel", 1) > 1) {
                    $j().alert("Unable to get id!");
                }

                if(feed.isScan || ajax) {
                    feed.checked(monster.getItem(''));
                }

                return;
            }

            if(/Aurelius, Lion's Rebellion/.test(tempText)) {
                feedMonster = "Aurelius, Lion's Rebellion";
                userName = tempText.replace(feedMonster, '').trim();
            } else {
                feedMonster = tempText.replace(new RegExp(".+'s (.+)$"), '$1');
                userName = tempText.replace(feedMonster, '').trim();
                feedMonster = feedMonster.trim().innerTrim().toLowerCase().ucWords();
            }

            if(!$u.hasContent(feedMonster)) {
                con.warn("Unable to get monster string!!");
            }

            if(id === caap.stats['FBID']) {
                con.log(2, "Your monster found", tempText);
                userName = 'Your';
            }
        } else {
            con.warn("checkResults_viewFight monsterDiv issue!");
        }
        mName = userName + ' ' + feedMonster;
        con.log(2, "Monster name", mName);
        if(feed.isScan || ajax) {
            if(feed.scanRecord['id'] !== id) {
                con.warn("User ID doesn't match!");
                if(config.getItem("DebugLevel", 1) > 1) {
                    $j().alert("User ID doesn't match!<br />" + id + '<br />' + feed.scanRecord['id']);
                }
                matches = false;
            }

            if(feed.scanRecord['monster'] !== feedMonster) {
                con.warn("Monster doesn't match!");
                if(config.getItem("DebugLevel", 1) > 1) {
                    $j().alert("Monster doesn't match!<br />" + feed.scanRecord['monster'] + '<br />' + feedMonster);
                }
                matches = false;
            }

            if(!feed.scanRecord['url'].hasIndexOf(page)) {
                con.warn("Page doesn't match!");
                if(config.getItem("DebugLevel", 1) > 1) {
                    $j().alert("Page doesn't match!<br />" + page + '<br />' + feed.scanRecord['url']);
                }
                matches = false;
            }

            if(!matches) {
                feed.checked(monster.getItem(''));
            }
        }
        md5 = (id + ' ' + feedMonster + ' ' + page).toLowerCase().MD5();
        if((feed.isScan || ajax) && matches && feed.scanRecord['md5'] !== md5) {
            con.warn("MD5 mismatch!", md5, feed.scanRecord['md5']);
            if(config.getItem("DebugLevel", 1) > 1) {
                $j().alert("md5 mismatch!<br />" + md5 + '<br />' + feed.scanRecord['md5']);
            }

            throw "MD5 mismatch!";
        }
        currentMonster = monster.getItem(md5);
        currentMonster['save'] = true;
        if((!$u.hasContent(currentMonster['userId']) || currentMonster['userId'] === 0) && $u.hasContent(id) && id !== 0) {
            currentMonster['userId'] = id;
            con.log(3, "Set monster id", currentMonster['userId']);
        }

        if(!$u.hasContent(currentMonster['name']) && $u.hasContent(mName)) {
            currentMonster['name'] = mName;
            con.log(3, "Set monster name", currentMonster['name']);
        }

        if(!$u.hasContent(currentMonster['monster']) && $u.hasContent(feedMonster)) {
            currentMonster['monster'] = feedMonster;
            con.log(3, "Set monster monster", currentMonster['monster']);
        }

        if(!$u.hasContent(currentMonster['userName']) && $u.hasContent(userName)) {
            currentMonster['userName'] = userName;
            con.log(3, "Set monster userName", userName);
        }

        if(!$u.hasContent(currentMonster['md5'])) {
            currentMonster['md5'] = md5;
            con.log(3, "Set monster md5", currentMonster['md5']);
        }

        if(!$u.hasContent(currentMonster['page']) && $u.hasContent(page)) {
            currentMonster['page'] = page;
            con.log(3, "Set monster page", page);
        }

        if(!$u.hasContent(currentMonster['feedLink'])) {
            if(feed.isScan || ajax) {
                currentMonster['save'] = false;
                currentMonster['feedLink'] = feed.scanRecord['url'];
                con.log(3, "Set monster feedLink ajax", currentMonster['feedLink']);
            } else {
                feed.scanRecord = feed.getItem(md5);
                if(feed.scanRecord) {
                    currentMonster['feedLink'] = feed.scanRecord['url'];
                    con.log(3, "Set monster feedLink from feed.scanRecord", currentMonster['feedLink']);
                } else {
                    currentMonster['feedLink'] = page + '.php?';
                    currentMonster['feedLink'] += page !== 'festival_battle_monster' ? 'twt2&' : '';
                    currentMonster['feedLink'] += 'causer=' + id;
                    ctaDiv = $j("input[name*='help with']", slice).parents("form").eq(0);
                    tStr = $j("input[name='mpool']", ctaDiv).attr("value");
                    currentMonster['feedLink'] += $u.hasContent(tStr) ? '&mpool=' + tStr.parseInt() : '';
                    tStr = $j("input[name='mid']", ctaDiv).attr("value");
                    currentMonster['feedLink'] += $u.hasContent(tStr) ? '&mid=' + tStr : '';
                    con.log(2, "Set monster feedLink", currentMonster['feedLink']);
                    /*
                     if (config.getItem("DebugLevel", 1) > 1) {
                     $j().alert("Set monster feedLink<br />" + currentMonster['feedLink']);
                     }
                     */
                }
            }
        }

        if($u.hasContent(currentMonster['feedLink'])) {
            tNum = currentMonster['feedLink'].regex(/mpool=(\d+)/);
            currentMonster['mpool'] = $u.hasContent(tNum) ? '&mpool=' + tNum : '';
            tStr = currentMonster['feedLink'].regex(/mid=(\S+)[&]*/);
            currentMonster['mid'] = $u.hasContent(tStr) ? '&mid=' + tStr : '';
            tNum = currentMonster['feedLink'].regex(/rix=(\d+)/);
            currentMonster['rix'] = $u.hasContent(tNum) ? tNum : -1;
        }

        currentMonster['hide'] = false;
        currentMonster['fImg'] = $u.setContent(fMonstStyle, '');
        currentMonster['type'] = $u.setContent(currentMonster['type'], '');
        monsterInfo = monster.getInfo(currentMonster);
        con.log(2, "monsterInfo", currentMonster['monster'], monsterInfo);
        if($u.hasContent(monsterInfo.levels)) {
            for( it = 0; it < monsterInfo.levels.length; it += 1) {
                groupMatch = false;
                for(jt in groups) {
                    if(groups.hasOwnProperty(jt)) {
                        if(groups[jt]['level'] === monsterInfo.levels[it]) {
                            currentMonster['joinable']['group' + it] = groups[jt];
                            groupMatch = true;
                        }
                    }
                }

                if(!groupMatch) {
                    currentMonster['joinable']['group' + it] = {
                        'level' : monsterInfo.levels[it],
                        'max' : monsterInfo.join[it],
                        'count' : 0
                    };
                }
            }
        }

        currentMonster['joinable']['total'] = groups['total'];
        con.log(3, "Joinable", currentMonster['joinable']);
        if(currentMonster['monster'] === 'The Deathrune Siege') {
            tempDiv = $j("div[style*='raid_back']", slice);
            if($u.hasContent(tempDiv)) {
                if($u.hasContent($j("img[src*='raid_1_large.jpg']", tempDiv))) {
                    currentMonster['type'] = 'Raid I';
                } else if($u.hasContent($j("img[src*='raid_b1_large.jpg']", tempDiv))) {
                    currentMonster['type'] = 'Raid II';
                } else if($u.hasContent($j("img[src*='raid_1_large_victory.jpg']", tempDiv))) {
                    con.log(2, "Siege Victory!");
                    currentMonster['hide'] = true;
                    currentMonster['joinable'] = {};
                } else {
                    con.log(2, "Problem finding raid image! Probably finished.");
                    currentMonster['hide'] = true;
                    currentMonster['joinable'] = {};
                }

                con.log(2, "Raid Type", currentMonster['type']);
            } else {
                con.warn("Problem finding raid_back");
                return;
            }
        }

        currentMonster['review'] = Date.now();
        state.setItem('monsterRepeatCount', 0);
        // Extract info
        tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "monsterTicker", slice);
        if($u.hasContent(tempDiv)) {
            time = $u.setContent(tempDiv.text(), '').regex(/(\d+):(\d+):(\d+)/);
        } else {
            if(caap.hasImage("dead.jpg")) {
                currentMonster['hide'] = true;
                currentMonster['joinable'] = {};
            } else {
                con.warn("Could not locate Monster ticker.");
            }
        }

        if($u.hasContent(time) && time.length === 3 && monsterInfo && monsterInfo.fort) {
            currentMonster['fortify'] = currentMonster['type'] === "Deathrune" || currentMonster['type'] === 'Ice Elemental' ? 100 : 0;
            switch (monsterInfo.defense_img) {
                case 'bar_dispel.gif' :
                    tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                    if($u.hasContent(tempDiv)) {
                        currentMonster['fortify'] = (100 - tempDiv.getPercent('width')).dp(2);
                        tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
                        found = true;
                    } else {
                        currentMonster['fortify'] = 100;
                        con.warn("Unable to find defense bar", monsterInfo.defense_img);
                    }

                    break;
                case 'seamonster_ship_health.jpg' :
                    tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                    if($u.hasContent(tempDiv)) {
                        currentMonster['fortify'] = tempDiv.getPercent('width').dp(2);
                        found = true;
                        if(monsterInfo.repair_img) {
                            found = false;
                            tempDiv = $j("img[src*='" + monsterInfo.repair_img + "']", slice).parent();
                            if($u.hasContent(tempDiv)) {
                                currentMonster['fortify'] = (currentMonster['fortify'] * (100 / (100 - tempDiv.getPercent('width')))).dp(2);
                                found = true;
                            } else {
                                currentMonster['fortify'] = 100;
                                con.warn("Unable to find repair bar", monsterInfo.repair_img);
                            }
                        }

                        if(found) {
                            tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
                        }
                    } else {
                        currentMonster['fortify'] = 100;
                        con.warn("Unable to find defense bar", monsterInfo.defense_img);
                    }

                    break;
                case 'nm_green.jpg' :
                    tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                    if($u.hasContent(tempDiv)) {
                        currentMonster['fortify'] = tempDiv.getPercent('width').dp(2);
                        found = true;
                        tempDiv = tempDiv.parent();
                        if($u.hasContent(tempDiv)) {
                            currentMonster['strength'] = tempDiv.getPercent('width').dp(2);
                            tempDiv = tempDiv.parent().siblings().eq(0).children().eq(0);
                        } else {
                            currentMonster['strength'] = 100;
                            con.warn("Unable to find defense bar strength");
                        }
                    } else {
                        currentMonster['fortify'] = 100;
                        currentMonster['strength'] = 100;
                        con.warn("Unable to find defense bar fortify");
                    }

                    break;
                default:
                    con.warn("No match for defense_img", monsterInfo.defense_img);
            }

            if(!feed.isScan && !ajax && found && config.getItem("monsterEnableLabels", true)) {
                tempText = tempDiv.text().trim();
                if(!$u.hasContent(tempDiv.children()) && (tempText.toLowerCase().hasIndexOf('health') || tempText.toLowerCase().hasIndexOf('defense') || tempText.toLowerCase().hasIndexOf('armor'))) {
                    tempDiv.text(tempText + " (" + (monsterInfo.defense_img === 'bar_dispel.gif' ? (100 - currentMonster['fortify']).dp(2) : currentMonster['fortify']) + "%" + (monsterInfo.defense_img === 'nm_green.jpg' ? '/' + currentMonster['strength'] + '%' : '') + ")");
                }
            }
        }
        // Get damage done to monster
        actionDiv = $j("#" + caap.domain.id[caap.domain.which] + "action_logs", slice);
        damageDiv = $j("td[class='dragonContainer']:first td[valign='top']:first a[href*='user=" + caap.stats['FBID'] + "']:first", actionDiv);
        if($u.hasContent(damageDiv)) {
            if(monsterInfo && monsterInfo.defense) {
                tempArr = $u.setContent(damageDiv.parent().parent().siblings(":last").text(), '').trim().innerTrim().regex(/([\d,]+ dmg) \/ ([\d,]+ def)/);
                if($u.hasContent(tempArr) && tempArr.length === 2) {
                    currentMonster['attacked'] = $u.setContent(tempArr[0], '0').numberOnly();
                    currentMonster['defended'] = $u.setContent(tempArr[1], '0').numberOnly();
                    currentMonster['damage'] = currentMonster['attacked'] + currentMonster['defended'];
                } else {
                    con.warn("Unable to get attacked and defended damage");
                }
            } else if(currentMonster['monster'] === 'The Deathrune Siege') {
                currentMonster['attacked'] = $u.setContent(damageDiv.parent().siblings(":last").text(), '0').numberOnly();
                currentMonster['damage'] = currentMonster['attacked'];
            } else {
                currentMonster['attacked'] = $u.setContent(damageDiv.parent().parent().siblings(":last").text(), '0').numberOnly();
                currentMonster['damage'] = currentMonster['attacked'];
            }

            if(!feed.isScan && !ajax) {
                damageDiv.parents("tr").eq(0).css('background-color', ( gm ? gm.getItem("HighlightColor", '#C6A56F', hiddenVar) : '#C6A56F'));
            }

            currentMonster['hide'] = true;
        } else {
            var dleadersDiv2 = $j("div[id*='leaderboard_0']");
            if (dleadersDiv2.length == 0) {
                currentMonster['hide'] = !$u.hasContent($j("input[name='Attack Dragon'],input[name='raid_btn']", slice));
                con.log(2, "Player hasn't done damage yet");
            } else {
                damageDivNew = true;
                dleadersDiv2 = $j("a[href*='user=" + caap.stats['FBID'] + "']", dleadersDiv2[0].children);
                if (dleadersDiv2.length == 0) {		// yinzanat - this is repeated to prevent errors
                    currentMonster['hide'] = !$u.hasContent($j("input[name='Attack Dragon'],input[name='raid_btn']", slice));
                    con.log(2, "Player hasn't done damage yet");
                } else {
                    if(monsterInfo && monsterInfo.defense) {
                        tempArr = $u.setContent(dleadersDiv2.parent().parent()[0].children[4].innerHTML).trim().innerTrim().regex(/([\d,]+ dmg) \/ ([\d,]+ def)/);
                        if($u.hasContent(tempArr) && tempArr.length === 2) {
                            currentMonster['attacked'] = $u.setContent(tempArr[0], '0').numberOnly();
                            currentMonster['defended'] = $u.setContent(tempArr[1], '0').numberOnly();
                            currentMonster['damage'] = currentMonster['attacked'] + currentMonster['defended'];
                        } else {
                            con.warn("Unable to get attacked and defended damage");
                        }
/*  Not sure if this needed for the new layout
                    } else if(currentMonster['monster'] === 'The Deathrune Siege') {
                        currentMonster['attacked'] = $u.setContent(damageDiv.parent().siblings(":last").text(), '0').numberOnly();
                        currentMonster['damage'] = currentMonster['attacked'];
*/
                    } else {
                        currentMonster['attacked'] = $u.setContent(dleadersDiv2.parent().parent()[0].children[4].innerHTML, '0').numberOnly();
                        currentMonster['damage'] = currentMonster['attacked'];
                    }
                    if(!feed.isScan && !ajax) {
                        dleadersDiv2.parent().parent().eq(0).css('background-color', ( gm ? gm.getItem("HighlightColor", '#C6A56F', hiddenVar) : '#C6A56F'));
                    }
                }
            }
        }
        tBool = currentMonster['monster'] === "The Deathrune Siege" ? true : false;
        if(/:ac\b/.test(currentMonster['conditions']) || (tBool && config.getItem('raidCollectReward', false)) || (!tBool && config.getItem('monsterCollectReward', false))) {
            counter = state.getItem('monsterReviewCounter', config.getItem("festivalTower", false) ? -4 : -3);
            // Change from using monster name to monster MD5 - need to keep an eye open for any more
            if(counter >= 0 && monster.records[counter] && monster.records[counter]['md5'] === currentMonster['md5'] && ($u.hasContent($j("a[href*='&action=collectReward']", slice)) || $u.hasContent($j("input[alt*='Collect Reward']", slice)))) {
                con.log(2, 'Collecting Reward');
                currentMonster['review'] = -1;
                state.setItem('monsterReviewCounter', counter -= 1);
                currentMonster['status'] = 'Collect Reward';
                currentMonster['rix'] = currentMonster['monster'] === "The Deathrune Siege" ? $u.setContent($u.setContent($j("a[href*='&rix=']", slice).attr("href"), '').regex(/&rix=(\d+)/), -1) : -1;
            }
        }
        monstHealthImg = monsterInfo && monsterInfo.alpha ? 'nm_red.jpg' : 'monster_health_background.jpg';
        monsterDiv = $j("img[src*='" + monstHealthImg + "']", slice).parent();
        if($u.hasContent(time) && time.length === 3 && $u.hasContent(monsterDiv)) {
            currentMonster['time'] = time;
            if($u.hasContent(monsterDiv)) {
                currentMonster['life'] = monsterDiv.getPercent('width').dp(2);
                if(!feed.isScan && !ajax && config.getItem("monsterEnableLabels", true)) {
                    tempDiv = monsterDiv.siblings().eq(0).children().eq(0);
                    if(!$u.hasContent(tempDiv)) {
                        tempDiv = monsterDiv.parent().parent().siblings().eq(0);
                        if($u.hasContent(tempDiv.children())) {
                            tempDiv = tempDiv.children().eq(0);
                        }
                    }
                    tempText = tempDiv.text().trim();
                    if(!$u.hasContent(tempDiv.children()) && (tempText.toLowerCase().hasIndexOf('life') || tempText.toLowerCase().hasIndexOf('soldiers'))) {
                        tempDiv.text(tempText + " (" + currentMonster['life'] + "%)");
                    }
                }
            } else {
                con.warn("Could not find monster health div.");
            }

            if(currentMonster['life'] && !monsterInfo) {
                monster.setItem(currentMonster);
                con.warn('Unknown monster', currentMonster);
                return;
            }
            if(($u.hasContent(damageDiv) || damageDivNew) && monsterInfo && monsterInfo.alpha) {
                // Character type stuff
                monsterDiv = $j("div[style*='nm_bottom']", slice);
                if($u.hasContent(monsterDiv)) {
                    tempText = $u.setContent(monsterDiv.children().eq(0).children().text(), '').trim().innerTrim();
                    if(tempText) {
                        con.log(4, "Character class text", tempText);
                        tStr = tempText.regex(/Class: (\w+) /);
                        if($u.hasContent(tStr)) {
                            currentMonster['charClass'] = tStr;
                            con.log(4, "character", currentMonster['charClass']);
                        } else {
                            con.warn("Can't get character", tempText);
                        }
                        tStr = tempText.regex(/Tip: ([\w ]+) Status/);
                        if($u.hasContent(tStr)) {
                            currentMonster['tip'] = tStr;
                            con.log(4, "tip", currentMonster['tip']);
                        } else {
                            con.warn("Can't get tip", tempText);
                        }
                        tempArr = tempText.regex(/Status Time Remaining: (\d+):(\d+):(\d+)\s*/);
                        if($u.hasContent(tempArr) && tempArr.length === 3) {
                            currentMonster['stunTime'] = Date.now() + (tempArr[0] * 60 * 60 * 1000) + (tempArr[1] * 60 * 1000) + (tempArr[2] * 1000);
                            con.log(4, "statusTime", currentMonster['stunTime']);
                        } else {
                            con.warn("Can't get statusTime", tempText);
                        }
                        tempDiv = $j("img[src*='nm_stun_bar']", monsterDiv);
                        if($u.hasContent(tempDiv)) {
                            tempText = tempDiv.getPercent('width').dp(2);
                            con.log(4, "Stun bar percent text", tempText);
                            if(tempText >= 0) {
                                currentMonster['stun'] = tempText;
                                con.log(4, "stun", currentMonster['stun']);
                            } else {
                                con.warn("Can't get stun bar width");
                            }
                        } else {
                            tempArr = currentMonster['tip'].split(" ");
                            if($u.hasContent(tempArr)) {
                                tempText = tempArr[tempArr.length - 1].toLowerCase();
                                tempArr = ["strengthen", "heal"];
                                if(tempText && tempArr.hasIndexOf(tempText)) {
                                    if(tempText === tempArr[0]) {
                                        currentMonster['stun'] = currentMonster['strength'];
                                    } else if(tempText === tempArr[1]) {
                                        currentMonster['stun'] = currentMonster['health'];
                                    } else {
                                        con.warn("Expected strengthen or heal to match!", tempText);
                                    }
                                } else {
                                    con.warn("Expected strengthen or heal from tip!", tempText);
                                }
                            } else {
                                con.warn("Can't get stun bar and unexpected tip!", currentMonster['tip']);
                            }
                        }

                        if(currentMonster['charClass'] && currentMonster['tip'] && currentMonster['stun'] !== -1) {
                            currentMonster['stunDo'] = new RegExp(currentMonster['charClass']).test(currentMonster['tip']) && currentMonster['stun'] < 100;
                            currentMonster['stunType'] = '';
                            if(currentMonster['stunDo']) {
                                con.log(2, "Do character specific attack", currentMonster['stunDo']);
                                tempArr = currentMonster['tip'].split(" ");
                                if($u.hasContent(tempArr)) {
                                    tempText = tempArr[tempArr.length - 1].toLowerCase();
                                    tempArr = ["strengthen", "cripple", "heal", "deflection"];
                                    if(tempText && tempArr.hasIndexOf(tempText)) {
                                        currentMonster['stunType'] = tempText.replace("ion", '');
                                        con.log(2, "Character specific attack type", currentMonster['stunType']);
                                    } else {
                                        con.warn("Type does match list!", tempText);
                                    }
                                } else {
                                    con.warn("Unable to get type from tip!", currentMonster);
                                }
                            } else {
                                con.log(3, "Tip does not match class or stun maxed", currentMonster);
                            }
                        } else {
                            con.warn("Missing 'class', 'tip' or 'stun'", currentMonster);
                        }
                    } else {
                        con.warn("Missing tempText");
                    }
                } else {
                    con.warn("Missing nm_bottom");
                }
            }

            if(monsterInfo) {
                if(monsterInfo.siege) {
                    currentMonster['miss'] = $u.setContent($u.setContent($j("div[style*='monster_layout'],div[style*='nm_bottom'],div[style*='raid_back']", slice).text(), '').trim().innerTrim().regex(/Need (\d+) more/i), 0);
                    for( ind = 0, len = monsterInfo.siege_img.length; ind < len; ind += 1) {
                        searchStr += "img[src*='" + monsterInfo.siege_img[ind] + "']";
                        if(ind < len - 1) {
                            searchStr += ",";
                        }
                    }
                    searchRes = $j(searchStr, slice);
                    if($u.hasContent(searchRes)) {
                        totalCount = currentMonster['monster'] === "The Deathrune Siege" ? $u.setContent(searchRes.attr("src"), '').basename().replace(new RegExp(".*(\\d+).*", "gi"), "$1").parseInt() : searchRes.size() + 1;
                    }

                    currentMonster['phase'] = Math.min(totalCount, monsterInfo.siege);
                    if($u.isNaN(currentMonster['phase']) || currentMonster['phase'] < 1) {
                        currentMonster['phase'] = 1;
                    }
                }

                currentMonster['t2k'] = monster.t2kCalc(currentMonster);
            }
        } else {
            con.log(2, 'Monster is dead or fled');
            currentMonster['color'] = 'grey';
            if(currentMonster['status'] !== 'Complete' && currentMonster['status'] !== 'Collect Reward') {
                currentMonster['status'] = "Dead or Fled";
            }

            currentMonster['hide'] = true;
            currentMonster['joinable'] = {};
            session.setItem('resetselectMonster', true);
            monster.setItem(currentMonster);
            return;
        }

        if($u.hasContent(damageDiv) || damageDivNew) {
            achLevel = monster.parseCondition('ach', currentMonster['conditions']);
            if(monsterInfo && achLevel === false) {
                achLevel = monsterInfo.ach;
            }
            maxDamage = monster.parseCondition('max', currentMonster['conditions']);
            maxToFortify = monster.parseCondition('f%', currentMonster['conditions']);
            maxToFortify = maxToFortify !== false ? maxToFortify : config.getItem('MaxToFortify', 0);
            targetFromfortify = state.getItem('targetFromfortify', new monster.energyTarget().data);
            if(currentMonster['md5'] === targetFromfortify['md5']) {
                switch (targetFromfortify['type']) {
                    case 'Fortify' :
                        if(currentMonster['fortify'] > maxToFortify) {
                            session.setItem('resetselectMonster', true);
                        }

                        break;
                    case 'Strengthen':
                        if(currentMonster['strength'] >= 100) {
                            session.setItem('resetselectMonster', true);
                        }

                        break;
                    case 'Stun':
                        if(!currentMonster['stunDo']) {
                            session.setItem('resetselectMonster', true);
                        }

                        break;
                    default:
                }
            }

            // Start of Keep On Budget (KOB) code Part 1 -- required variables
            con.log(2, 'Start of Keep On Budget (KOB) Code');

            //default is disabled for everything
            KOBenable = false;

            //default is zero bias hours for everything
            KOBbiasHours = 0;

            //KOB needs to follow achievment mode for this monster so that KOB can be skipped.
            KOBach = false;

            //KOB needs to follow max mode for this monster so that KOB can be skipped.
            KOBmax = false;

            //KOB needs to follow minimum fortification state for this monster so that KOB can be skipped.
            KOBminFort = false;

            //create a temp variable so we don't need to call parseCondition more than once for each if statement
            KOBtmp = monster.parseCondition('kob', currentMonster['conditions']);
            if(KOBtmp !== false && $u.isNaN(KOBtmp)) {
                con.log(2, 'KOB NaN branch');
                KOBenable = true;
                KOBbiasHours = 0;
            } else if(KOBtmp === false) {
                con.log(2, 'KOB false branch');
                KOBenable = false;
                KOBbiasHours = 0;
            } else {
                con.log(2, 'KOB passed value branch');
                KOBenable = true;
                KOBbiasHours = KOBtmp;
            }

            //test if user wants kob active globally
            if(!KOBenable && ( gm ? gm.getItem('KOBAllMonters', false, hiddenVar) : false)) {
                KOBenable = true;
            }

            //disable kob if in level up mode or if we are within 5 stamina of max potential stamina
            if(caap.inLevelUpMode() || caap.stats['stamina']['num'] >= caap.stats['stamina']['max'] - 5) {
                KOBenable = false;
            }

            if(KOBenable) {
                con.log(2, 'Level Up Mode: ', caap.inLevelUpMode());
                con.log(2, 'Stamina Avail: ', caap.stats['stamina']['num']);
                con.log(2, 'Stamina Max: ', caap.stats['stamina']['max']);

                //log results of previous two tests
                con.log(2, 'KOBenable: ', KOBenable);
                con.log(2, 'KOB Bias Hours: ', KOBbiasHours);
            }

            //Total Time alotted for monster
            KOBtotalMonsterTime = monsterInfo.duration;
            if(KOBenable) {
                con.log(2, 'Total Time for Monster: ', KOBtotalMonsterTime);

                //Total Damage remaining
                con.log(2, 'HP left: ', currentMonster['life']);
            }

            //Time Left Remaining
            KOBtimeLeft = time[0] + (time[1] * 0.0166);
            if(KOBenable) {
                con.log(2, 'TimeLeft: ', KOBtimeLeft);
            }

            //calculate the bias offset for time remaining
            KOBbiasedTF = KOBtimeLeft - KOBbiasHours;

            //for 7 day monsters we want kob to not permit attacks (beyond achievement level) for the first 24 to 48 hours
            // -- i.e. reach achievement and then wait for more players and siege assist clicks to catch up
            if(KOBtotalMonsterTime >= 168) {
                KOBtotalMonsterTime = KOBtotalMonsterTime - ( gm ? gm.getItem('KOBDelayStart', 48, hiddenVar) : 48);
            }

            //Percentage of time remaining for the currently selected monster
            KOBPercentTimeRemaining = Math.round(KOBbiasedTF / KOBtotalMonsterTime * 1000) / 10;
            if(KOBenable) {
                con.log(2, 'Percent Time Remaining: ', KOBPercentTimeRemaining);
            }

            // End of Keep On Budget (KOB) code Part 1 -- required variables

            isTarget = (currentMonster['name'] === state.getItem('targetFromraid', '') || currentMonster['name'] === state.getItem('targetFrombattle_monster', '') || currentMonster['name'] === targetFromfortify['name']);

            if(maxDamage && currentMonster['damage'] >= maxDamage) {
                currentMonster['color'] = 'red';
                currentMonster['over'] = 'max';
                //used with KOB code
                KOBmax = true;
                //used with kob debugging
                if(KOBenable) {
                    con.log(2, 'KOB - max activated');
                }

                if(isTarget) {
                    session.setItem('resetselectMonster', true);
                }
            } else if(currentMonster['fortify'] !== -1 && currentMonster['fortify'] < config.getItem('MinFortToAttack', 1)) {
                currentMonster['color'] = 'purple';
                //used with KOB code
                KOBminFort = true;
                //used with kob debugging
                if(KOBenable) {
                    con.log(2, 'KOB - MinFort activated');
                }

                if(isTarget) {
                    session.setItem('resetselectMonster', true);
                }
            } else if(currentMonster['damage'] >= achLevel && (config.getItem('AchievementMode', false) || monster.parseCondition('ach', currentMonster['conditions']) !== false)) {
                currentMonster['color'] = 'darkorange';
                currentMonster['over'] = 'ach';
                //used with KOB code
                KOBach = true;
                //used with kob debugging
                if(KOBenable) {
                    con.log(2, 'KOB - achievement reached');
                }

                if(isTarget && currentMonster['damage'] < achLevel) {
                    session.setItem('resetselectMonster', true);
                }
            }

            //Start of KOB code Part 2 begins here
            if(KOBenable && !KOBmax && !KOBminFort && KOBach && currentMonster['life'] < KOBPercentTimeRemaining) {
                //kob color
                currentMonster['color'] = 'magenta';
                // this line is required or we attack anyway.
                currentMonster['over'] = 'max';
                //used with kob debugging
                if(KOBenable) {
                    con.log(2, 'KOB - budget reached');
                }

                if(isTarget) {
                    session.setItem('resetselectMonster', true);
                    con.log(1, 'This monster no longer a target due to kob');
                }
            } else {
                if(!KOBmax && !KOBminFort && !KOBach) {
                    //the way that the if statements got stacked, if it wasn't kob it was painted black anyway
                    //had to jump out the black paint if max, ach or fort needed to paint the entry.
                    currentMonster['color'] = $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
                }
            }
            //End of KOB code Part 2 stops here.
        } else {
            currentMonster['color'] = $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
        }

        monster.setItem(currentMonster);
        con.log(3, "currentMonster", currentMonster);
        monster.select(true);
        caap.updateDashboard(true);
        if(schedule.check('battleTimer')) {
            window.setTimeout(function() {
                caap.setDivContent('monster_mess', '');
            }, 2000);
        }
    } catch (err) {
        con.error("ERROR in checkResults_viewFight: " + err);
    }
};
