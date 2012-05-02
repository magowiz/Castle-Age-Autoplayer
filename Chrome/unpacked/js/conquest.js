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
                var button = caap.checkForImage("powercollect.gif");
                var button2 = caap.checkForImage("war_keep_btn_collect.gif");
                if ($u.hasContent(button)) {
                    caap.click(button);
                } else if ($u.hasContent(button2)) {
                    caap.click(button2);
                }
            } catch (err) {
                con.error("ERROR in collect Conquest: " + err);
                return false;
            }
        }
    };
