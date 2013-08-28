/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                          ALCHEMY
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    /*-------------------------------------------------------------------------------------\
    AutoAlchemy perform aclchemy combines for all recipes that do not have missing
    ingredients.  By default, it also will not combine Battle Hearts.
    First we make sure the option is set and that we haven't been here for a while.
    \-------------------------------------------------------------------------------------*/
    caap.autoAlchemy = function () {
        try {
            if (!config.getItem('AutoAlchemy', false)) {
                return false;
            }

            if (!schedule.check('AlchemyTimer')) {
                return false;
            }

            /*-------------------------------------------------------------------------------------\
			Now we navigate to the Alchemy Recipe page.
			\-------------------------------------------------------------------------------------*/
            if (!caap.navigateTo('keep,alchemy', 'alchfb_btn_alchemies_on.gif')) {
                var button1 = {},
					ssDiv = $j(),
                    clicked = false;

                /*-------------------------------------------------------------------------------------\
				We close the results of our combines so they don't hog up our screen
				\-------------------------------------------------------------------------------------*/
                button1 = caap.checkForImage('help_close_x.gif');
                if ($u.hasContent(button1)) {
                    caap.click(button1);
                    return true;
                }

                /*-------------------------------------------------------------------------------------\
				Now we get all of the recipes and step through them one by one
				\-------------------------------------------------------------------------------------*/
                ssDiv = $j("div[id*='recipe']");
                if (!ssDiv || !ssDiv.length) {
                    con.log(3, 'No recipes found');
                }

                ssDiv.each(function () {
                    var button2 = {},
						recipeDiv = $j(this);

                    con.log(3, 'If we are missing an ingredient then skip it');

                    /*-------------------------------------------------------------------------------------\
					If we are missing an ingredient then skip it
					\-------------------------------------------------------------------------------------*/
                    button2 = recipeDiv.find("img[src*='alchfb_createoff.gif']");
                    if (button2 && button2.length) {
                        con.log(2, 'Skipping Recipe');

						recipeDiv = null;
						button2 = null;
                        return true;
                    }

                    con.log(3, 'If we are crafting map of atlantis then skip it');

                    /*-------------------------------------------------------------------------------------\
					If we are crafting map of atlantis then skip it
					\-------------------------------------------------------------------------------------*/
                    button2 = recipeDiv.find("img[src*='seamonster_map_finished.jpg']");
                    if (button2 && button2.length) {
                        con.log(2, 'Skipping map of atlantis Recipe');

						recipeDiv = null;
						button2 = null;
                        return true;
                    }

                    con.log(3, 'If we are skipping battle hearts then skip it');

                    /*-------------------------------------------------------------------------------------\
					If we are skipping battle hearts then skip it
					\-------------------------------------------------------------------------------------*/

                    if (caap.hasImage('raid_hearts', recipeDiv) && !config.getItem('AutoAlchemyHearts', false)) {
                        con.log(2, 'Skipping Hearts');

						recipeDiv = null;
						button2 = null;
                        return true;
                    }

                    con.log(3, 'Find our button and click it');

                    /*-------------------------------------------------------------------------------------\
					Find our button and click it
					\-------------------------------------------------------------------------------------*/
                    button2 = recipeDiv.find("input[type='image']");
                    if (button2 && button2.length) {
                        caap.click(button2);
                        con.log(2, 'Clicked A Recipe', recipeDiv.find("div[style='padding-top:5px;']"));
                        clicked = true;

						recipeDiv = null;
						button2 = null;
                        return false;
                    }

                    con.warn('Cant Find Item Image Button');

					recipeDiv = null;
					button2 = null;
                    return true;
                });

                con.log(3, 'End each recipe');

                if (clicked) {
                    return true;
                }

                /*-------------------------------------------------------------------------------------\
				All done. Set the timer to check back in 3 hours.
				\-------------------------------------------------------------------------------------*/
                schedule.setItem('AlchemyTimer', 10800, 300);

				button1 = null;
				ssDiv = null;
                return false;
            }

            return true;
        } catch (err) {
            con.error("ERROR in autoAlchemy: " + err);
            return false;
        }
    };

}());
