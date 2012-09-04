    ////////////////////////////////////////////////////////////////////
    //                          CONQUEST OBJECT
    // this is the main object for dealing with Conquest
    /////////////////////////////////////////////////////////////////////

    conquest = {
        collect: function () {
            try {
                if(!config.getItem('doConquestCollect', false) || !schedule.check('collectConquestTimer')) {
                    return false;
                }

                var button = caap.checkForImage("conq2_btn_collectpower.gif");
                var button2 = caap.checkForImage("conq2_btn_collect.gif");

                if ($u.hasContent(button)) {
                    caap.click(button);
                } else if ($u.hasContent(button2)) {
                    caap.click(button2);
                }
                schedule.setItem('collectConquestTimer', 24 * 60 * 60);
            } catch (err) {
                con.error("ERROR in collect Conquest: " + err);
                return false;
            }
        },
        land: function () {
            try {
                if((!config.getItem('doConquestCrystalCollect1', false) || !schedule.check('collectConquestCrystal1Timer')) && (!config.getItem('doConquestCrystalCollect2', false) || !schedule.check('collectConquestCrystal2Timer'))) {
                    return false;
                }
                var button = caap.checkForImage("conq2_btn_interiorcass.jpg");
                if ($u.hasContent(button)) {
                    caap.click(button);
                } else {
                    if (schedule.check('collectConquestCrystal1Timer')) {
                        schedule.setItem('collectConquestCrystal1Timer', 60 * 60);
                    } else {
                        schedule.setItem('collectConquestCrystal2Timer', 60 * 60);
                    }
                }
            } catch (err) {
                con.error("ERROR in Conquest Land: " + err);
                return false;
            }
        },
        crystal: function () {
            try {
                if((!config.getItem('doConquestCrystalCollect1', false) || !schedule.check('collectConquestCrystal1Timer')) && (!config.getItem('doConquestCrystalCollect2', false) || !schedule.check('collectConquestCrystal2Timer'))) {
                    return false;
                }
                var tributeMessage = $j("div[style*='cassandra_main']")[0].children[1].children[2].children[3].innerHTML.trim();
                if (tributeMessage === 'PAY TRIBUTE!') {
                    var button = caap.checkForImage("war_sanctum_recievebless.gif");
                    if ($u.hasContent(button)) {
                        caap.click(button);
                        config.setItem('doConquestCrystalCollect', false);
                        //Not going to reset the timer, it will get set on the next pass
                    }
                } else {
                    if (schedule.check('collectConquestCrystal1Timer')) {
                        schedule.setItem('collectConquestCrystal1Timer', tributeMessage.match(/\d*/)[0] * 60 * 60);
                    } else {
                        schedule.setItem('collectConquestCrystal2Timer', tributeMessage.match(/\d*/)[0] * 60 * 60);
                    }
                }
            } catch (err) {
                con.error("ERROR in Conquest Crystal: " + err);
                return false;
            }
        }
    };
