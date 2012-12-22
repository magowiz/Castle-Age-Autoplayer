    ////////////////////////////////////////////////////////////////////
    //                          CONQUEST OBJECT
    // this is the main object for dealing with Conquest
    /////////////////////////////////////////////////////////////////////

    conquest = {
        collect: function () {
            try {
                if((!config.getItem('doConquestCollect', false) || !schedule.check('collectConquestTimer')) && (!config.getItem('doConquestCrystalCollect', false) || !schedule.check('collectConquestCrystalTimer'))) {
                    return false;
                }

                var button = caap.checkForImage("conq3_btn_collectpower.gif");     //this is a guess
                var button2 = caap.checkForImage("conq3_btn_collect.gif");
                var buttonCrystal = caap.checkForImage("conq3_btn_pray.gif");

                if ($u.hasContent(button)) {
                    caap.click(button);
                } else if ($u.hasContent(button2)) {con.log (1, "button exists");
                    caap.click(button2);
                }
con.log (1, "done with buttons", button, button2, buttonCrystal);
                if ($u.hasContent(buttonCrystal)) {
                    caap.click(buttonCrystal);
                }
                var timeLeft = $j("div[style*='conq3_mid_notop']")[0].children[0].children[0].children[2].children[0].innerHTML.match(/(\d+)/)[0];
                schedule.setItem('collectConquestTimer', timeLeft * 60 * 60);
                schedule.setItem('collectConquestCrystalTimer', timeLeft * 60 * 60);
            } catch (err) {
                con.error("ERROR in collect Conquest: " + err);
                return false;
            }
        },
        battle: function () {
            var inputDiv = $j("div[style*='war_conquest_mid']");
            con.log (1, "in battle", inputDiv);
            inputDiv.each(function (index) {
                var rank = /\d+/.exec(inputDiv[index].children[4].children[0].children[0].title)[0];
                var playerId = $j("input[name*='target_id']", inputDiv[index].children[5].children[0].children[0].children[0])[0].value;
                var armySize = inputDiv[index].children[3].children[0].innerHTML;
                var duelNum = battle.getItem(playerId).duelwinsNum - battle.getItem(playerId).duellossesNum;
                var invadeNum = battle.getItem(playerId).invadewinsNum - battle.getItem(playerId).invadelossesNum;
                con.log (1, playerId, rank, armySize, duelNum, invadeNum);
            });
        }
    };
