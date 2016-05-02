/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,worker,$j,chores,stats,
$u,chrome,spreadsheet,self,caap,config,con,page,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

(function () {
    "use strict";

	worker.add('chores');
	
	chores.checkResults = function(page, resultsText) {
		try {
			var pagesHeaders = worker.pagesList.flatten('page'),
				url = caap.clickUrl,
				picList = [],
				dupList = [],
				nameList = [],
				src = '';
				
			if (pagesHeaders.hasIndexOf(page)) {
				schedule.setItem('page_' + page, Date.now());
			}
			if (pagesHeaders.hasIndexOf(url)) {
				schedule.setItem('page_' + url, Date.now());
			}
			switch (page) {
			case 'alchemy' :
				// Check for ingredients in multiple recipes to avoid unwanted combines
				if (!config.getItem('alchemy', false) || !caap.oneMinuteUpdate('alchemyDupIngredients')) {
					break;
				}
				dupList = state.getItem('alchemyDupImages', dupList);
				nameList = state.getItem('alchemyDupNames', nameList);
				$j('#app_body img').not('[onmouseover*="display_reward"]').each( function() {
					src = $u.setContent($j(this).attr('src'), '').regex(/.*\/(\w+\.\w+)/);
					if (src) {
						if (picList.hasIndexOf(src)) {
							if (!dupList.hasIndexOf(src)) {
								dupList.push(src);
								nameList.push($j(this).parent().text().trim().innerTrim().replace(/ (Somewhere|Get|Find|Create) .*/, ''));
							}
						} else {
							picList.push(src);
						}
					}
				});
				state.setItem('alchemyDupImages', dupList);
				state.setItem('alchemyDupNames', nameList);
				con.log(2, 'Alchemy ingredients in multiple recipes list: ' + nameList.join(', '), dupList);
				break;
			case 'goblin_emp' :
				if (config.getItem("goblinHinting", true)) {
					spreadsheet.doTitles(true);
				}
				if (/You have exceeded the 10 emporium roll limit for the day/.test(resultsText)) {
					schedule.setItem('koboTimerDelay', 7 * 3600, 100);
					con.log(2, 'Kobo: hit maximum rolls');
					caap.setDivContent('kobo_mess', schedule.check('koboTimerDelay') ? 'Kobo = none' : 'Next Kobo: ' +
						$u.setContent(caap.displayTime('koboTimerDelay'), "Unknown"));
				}
				break;
			default :
				break;
			}
				
        } catch (err) {
            con.error("ERROR in chores.checkResults: " + err.stack);
            return false;
        }
    };
	
/////////////////////////////////////////////////////////////////////
//                          HEAL
/////////////////////////////////////////////////////////////////////

	worker.addAction({fName : 'chores.heal', priority : 850, description : 'Healing'});
	
    chores.heal = function () {
        try {
            var minToHeal = 0,
                minStamToHeal = 0,
                battleHealth = 0,
                conquesthealth = 0,
                highest = 0;

            caap.setDivContent('heal_mess', '');
            minToHeal = eval(config.getItem('MinToHeal', 0));
            if (minToHeal === "" || minToHeal < 0 || !$u.isNumber(minToHeal)) {
                return false;
            }
            minStamToHeal = eval(config.getItem('MinStamToHeal', 0));
            if (minStamToHeal === "" || minStamToHeal < 0 || !$u.isNumber(minStamToHeal)) {
                minStamToHeal = 0;
            }

            if (!stats.health || $j.isEmptyObject(stats.health)) {
                return false;
            }

            if (!stats.stamina || $j.isEmptyObject(stats.stamina)) {
                return false;
            }

            if ((config.getItem('WhenBattle', 'Never') !== 'Never') || (config.getItem('WhenMonster', 'Never') !== 'Never') || (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                battleHealth = (config.getItem('WhenBattle', 'Never') !== 'Never' && config.getItem('waitSafeHealth', false) ? 13 : 10);
                conquesthealth = (config.getItem('WhenConquest', 'Never') !== 'Never' && config.getItem('ConquestWaitSafeHealth', false) ? 13 : 10);
                highest = battleHealth >= conquesthealth ? battleHealth : conquesthealth;
                if ((caap.inLevelUpMode() || stats.stamina.num >= stats.stamina.max) && stats.health.num < highest) {
					monster.lastClick = '';
					page.ajax(caap.page + '.php?action=heal_avatar', '', 'bqh');
					return {mlog: 'Healing'};
                }
            }

            if (stats.health.num >= stats.health.max || stats.health.num >= minToHeal) {
                return false;
            }

            if (stats.stamina.num < minStamToHeal) {
                caap.setDivContent('heal_mess', 'Waiting for stamina to heal: ' + stats.stamina.num + '/' + minStamToHeal);
                return false;
            }

			monster.lastClick = '';
			page.ajax(caap.page + '.php?action=heal_avatar', '', 'bqh');
			return {mlog: 'Healing'};
        } catch (err) {
            con.error("ERROR in chores.heal: " + err.stack);
            return false;
        }
    };

    /*-------------------------------------------------------------------------------------\
    alchemy perform alchemy combines for all recipes that do not have missing
    ingredients.  By default, it also will not combine Battle Hearts.
    First we make sure the option is set and that we haven't been here for a while.
    \-------------------------------------------------------------------------------------*/
/////////////////////////////////////////////////////////////////////
//                          ALCHEMY
/////////////////////////////////////////////////////////////////////

	worker.addAction({fName : 'chores.alchemy', priority : -700, description : 'Doing Alchemy'});
	
    chores.alchemy = function () {
        try {
            if (!config.getItem('alchemy', false) || !schedule.check('AlchemyTimer')) {
                return false;
            }

            /*-------------------------------------------------------------------------------------\
			Navigate to the Alchemy Recipe page.
			\-------------------------------------------------------------------------------------*/
            if (caap.navigateTo('alchemy', 'alchfb_btn_alchemies_on.gif')) {
				return true;
			}
			
			/*-------------------------------------------------------------------------------------\
			Get all of the recipes and step through them one by one
			\-------------------------------------------------------------------------------------*/

			var clicked = false,
				repeatIngredientList = state.getItem('alchemyDupImages', []),
				whiteList = config.getList('alchemy_whitelist', ''),
				blackList = config.getList('alchemy_blacklist', '');

			$j("div .recipe").has('input[src*="alchfb__btn_createon.gif"]').each(function () {

				var name = $j(this).find('[onmouseover*="display_reward"]').parent().text().trim().innerTrim(),
					repeat = [];
					
				/*-------------------------------------------------------------------------------------\
				If ingredient in multiple recipes, skip it
				\-------------------------------------------------------------------------------------*/

				$j(this).find('img').not('[onmouseover*="display_reward"]').each( function() {
					var src = $u.setContent($j(this).attr('src'), '').regex(/.*\/(\w+\.\w+)/);
					if (src && repeatIngredientList.hasIndexOf(src) && src != "alchfb_gifticon.gif") {
						repeat.push($j(this).parent().text().trim().innerTrim().replace(/ (Somewhere|Get|Find|Create) .*/, ''));
					}
				});
				if (repeat.length) {
					con.log(2, 'Skipping ' + name + ' recipe because ingredients in more than one recipe: ' + repeat.join(', '));
					return true;
				}

				/*-------------------------------------------------------------------------------------\
				Check black and white lists
				\-------------------------------------------------------------------------------------*/

				if (!chores.blackWhite(whiteList, blackList, name)) {
					con.log(2, 'Skipping ' + name + ' recipe from black or whitelist');
					return true;
				}

				/*-------------------------------------------------------------------------------------\
				If we are crafting map of atlantis then skip it
				\-------------------------------------------------------------------------------------*/
				if ($u.hasContent($j(this).find("img[src*='seamonster_map_finished.jpg']"))) {
					con.log(2, 'Skipping map of atlantis Recipe');
					return true;
				}

				/*-------------------------------------------------------------------------------------\
				Find our button and click it
				\-------------------------------------------------------------------------------------*/
				if (caap.ifClick($j(this).find('input[src*="alchfb__btn_createon.gif"]'))) {
					con.log(2, 'Clicking recipe for ' + name);
					clicked = true;
					return false;
				}
				con.warn('Cant Find Item Image Button');
			});

			if (clicked) {
				return true;
			}

			/*-------------------------------------------------------------------------------------\
			All done. Set the timer to check back later.
			\-------------------------------------------------------------------------------------*/
			schedule.setItem('AlchemyTimer', 9 * 3600, 300);
			return false;

		} catch (err) {
            con.error("ERROR in chores.alchemy: " + err.stack);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                          KOBO
/////////////////////////////////////////////////////////////////////

	worker.addAction({fName : 'chores.kobo', priority : -2500, description : 'Doing Kobo Rolls'});

	chores.blackWhite = function(whiteList, blackList, name, title) {
		try {
			var whiteListed = false,
				blackListed = false;
				
			if (whiteList.listMatch(/(\w)/)) {
				whiteListed = whiteList.some( function(w) {
					var text = (w[0] == '~' ? title.replace(name, '') : name).trim().toLowerCase();
					if (text.match(new RegExp(w.replace('~','').trim().toLowerCase()))) { 
						con.log(2, "'" + name + "' white listed by condition " + w);
						return true;
					}
				});
				if (!whiteListed) { 
					con.log(2, "'" + name + "' not white listed");
				}
			} else {
				whiteListed = true;
			}
			if (blackList.listMatch(/(\w)/)) {
				blackListed = blackList.some( function(black) {
					if (name.trim().toLowerCase().match(new RegExp(black.trim().toLowerCase()))) { 
						con.log(2, "'" + name + "' black listed by condition " + black);
						return true;
					}
				});
				if (!blackListed) { 
					con.log(2, "'" + name + "' not black listed"); 
				}
			}
			return whiteListed && !blackListed;
			
        } catch (err) {
            con.error("ERROR in chores.blackWhite: " + err);
            return false;
        }
    };

	
	
    chores.kobo = function() {
        try {
            var gin_left = 10,
				ingredientDIV,
                addClick = true,
				countClick = 0,
				whiteList = config.getList('kobo_whitelist', ''),
				blackList = config.getList('kobo_blacklist', ''),
				addIng = function(_i, _e) {
                    var count = $j(_e).text(),
                        name = $j(_e).parent().parent()[0].children[0].children[0].alt,
						title = $j(_e).parent().parent()[0].children[0].children[0].title;

                    con.log(3, "ingredient " + _i + " '" + name + "' :count = " + count);
                    if (count > config.getItem('koboKeepUnder', 10) && (gin_left > countClick) ) {
						if (chores.blackWhite(whiteList, blackList, name, title)) {
							addClick = true;
							countClick = countClick + 1;
							$j(_e).parent().parent().click();
						}
                    }
				};


            if ((!config.getItem('kobo', true)) || (!schedule.check('koboTimerDelay'))) {
                caap.setDivContent('kobo_mess', schedule.check('koboTimerDelay') ? '' : 'Next Kobo: ' + $u.setContent(caap.displayTime('koboTimerDelay'), "Unknown"));
                return false;
            }

			if (caap.navigateTo('goblin_emp')) {
				return true;
			}
			
            ingredientDIV = $j("div[class='ingredientUnit']>div>span[id*='gout_value']");
			
			while (gin_left > 0) {
				addClick = false;
				countClick = 0;

                ingredientDIV.each(addIng);

                if (!addClick) {
                    schedule.setItem('koboTimerDelay', 7 * 3600, 100);
                    caap.setDivContent('kobo_mess', schedule.check('koboTimerDelay') ? '' : 'Next Kobo: ' + $u.setContent(caap.displayTime('koboTimerDelay'), "Unknown"));
                    return false;
                }
				gin_left = Math.min(($j("span[id='gin_left_amt']")).text(), 10);
            }

            if (caap.ifClick('emporium_button.gif')) {
                con.log(1, "Clicking Roll");
                return true;
            }

            return false;

        } catch (err) {
            con.error("ERROR in chores.kobo: " + err);
            return false;
        }
    };

	// This is hardcoded in the mainloop to always have the highest priority
	worker.addAction({fName: 'chores.income', priority : 2000, description : 'Awaiting Income'});

	chores.income = function () {
        try {
            if (config.getItem("disAutoIncome", false) || (config.getItem("NoIncomeAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false))) {
                return false;
            }

            if ($u.hasContent(stats.gold.ticker) && stats.gold.ticker[0] < 1
				&& config.getItem('IncomeGeneral', 'Use Current') !== 'Use Current') {
                general.Select('IncomeGeneral');
                return true;
            }

            return false;
        } catch (err) {
            con.error("ERROR in chores.income: " + err.stack);
            return false;
        }
    };

/////////////////////////////////////////////////////////////////////
//                          BANKING
//                       Keep it safe!
/////////////////////////////////////////////////////////////////////

 	worker.addAction({fName : 'chores.immediateBanking', priority : 1500, description : 'Banking Immediately'});

   chores.immediateBanking = function () {
        if (!config.getItem("BankImmed", false)) {
            return false;
        }

        return caap.bank();
    };

 	worker.addAction({fName : 'chores.bank', priority : 400, description : 'Banking'});

    chores.bank = function () {
        try {
            if (config.getItem("NoBankAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false)) {
                return false;
            }

            var maxInCash = -1,
                minInCash = 0,
                depositButton = $j(),
                numberInput = $j(),
                deposit = 0;

            maxInCash = config.getItem('MaxInCash', -1);
            minInCash = config.getItem('MinInCash', 0);
            if (!maxInCash || maxInCash < 0 || stats.gold.cash <= minInCash || stats.gold.cash < maxInCash || stats.gold.cash < 10) {

                depositButton = null;
                numberInput = null;
				return false;
            }

            if (general.Select('BankingGeneral')) {

                depositButton = null;
                numberInput = null;
                return true;
            }

            depositButton = $j("input[src*='btn_stash.gif']");
            if (!depositButton || !depositButton.length) {
                // Cannot find the link

                depositButton = null;
                numberInput = null;
                return caap.navigateTo('keep');
            }

            numberInput = $j("input[name='stash_gold']");
            if (!numberInput || !numberInput.length) {
                con.warn('Cannot find box to put in number for bank deposit.');

                depositButton = null;
                numberInput = null;
                return false;
            }

            deposit = stats.gold.cash - minInCash;
            numberInput.attr("value", deposit);
            con.log(1, 'Depositing into bank:', deposit);
            caap.click(depositButton);

			depositButton = null;
			numberInput = null;
            return true;
        } catch (err) {
            con.error("ERROR in Bank: " + err.stack);
            return false;
        }
    };

    chores.getMoney = function (num) {
		return chores.retrieveFromBank(num - stats.gold.cash);
    };

    chores.retrieveFromBank = function (num) {
        try {
            if (num <= 0) {
                return false;
            }

            var retrieveButton = $j(),
                numberInput = $j(),
                minInStore = 0;

            retrieveButton = $j("input[src*='keep_btn_retireve.gif']");
            if (!retrieveButton || !retrieveButton.length) {
                // Cannot find the link

				retrieveButton = null;
                numberInput = null;
                return caap.navigateTo('keep');
            }

            minInStore = config.getItem('minInStore', 0);
            if (!(minInStore || minInStore <= stats.gold.bank - num)) {
				retrieveButton = null;
                numberInput = null;
                return false;
            }

            numberInput = $j("input[name='get_gold']");
            if (!numberInput || !numberInput.length) {
                con.warn('Cannot find box to put in number for bank retrieve.');
				retrieveButton = null;
                numberInput = null;
                return false;
            }

            numberInput.attr("value", num);
            con.log(1, 'Retrieving from bank:', num);
            state.setItem('storeRetrieve', '');
            caap.click(retrieveButton);

			retrieveButton = null;
			numberInput = null;
            return true;
        } catch (err) {
            con.error("ERROR in retrieveFromBank: " + err.stack);
            return false;
        }
    };

 	worker.addAction({fName : 'chores.checkPages', priority : -1200, description : 'Reviewing Pages'});
	
	worker.addPageCheck({page : 'achievements'});

	worker.addPageCheck({page : 'view_class_progress', level : 100});

	worker.addPageCheck({page : 'keep', hours : 1});

    chores.checkPages = function(page, value, newOnly) {
        try {
			var list = $u.isDefined(value) ? worker.pagesList.filterByField(page, value) :
				$u.isString(page) ? [{page : page}] : worker.pagesList,
				hours = 0;
			return list.some( function(o) {
				if ((o.config && !config.getItem(o.config, false)) ||
						(o.func && !window[o.func.regex(/(\w+)\./)][o.func.regex(/\.(\w+)/)]())) {
					return false;
				}
				hours = newOnly ? 24 * 7 * 4 : o.cFreq ? config.getItem(o.cFreq, 60) / 60 : $u.setContent(o.hours, 24);
				if (schedule.since('page_' + o.page, hours * 3600) && (!$u.hasContent(o.level) || stats.level >= o.level)
					&& config.getItem($u.setContent(o.config, 'NoNe'), true)) {
					con.log(2, 'Reviewing ' + o.page, o);
					var result = caap.ajaxLink(o.page);
					if (result == 'fail') {
						con.warn('Chores: Unable to check page ' + o.page + '. Waiting to retry', o);
						schedule.setItem('page_' + page, Date.now());
					}
					return result;
				}
			});
        } catch (err) {
            con.error("ERROR in chores.checkPages: " + err.stack);
            return false;
        }
    };

    chores.menu = function () {
        try {
            // Other controls
            var alchemyInstructions1 = "Alchemy will combine all recipes " + "that do not have missing ingredients. By default, it will not " + "combine Battle Hearts recipes.",
                koboInstructions0 = "Enable or disable Kobo rolls.",
                koboInstructions1 = "Number to keep of each item.",
                koboWhiteListInstructions = "List of items to roll in Kobo. Leave blank to roll any item above the Keep value." +
					'Use ~ for matching against the description. For example, ~gift would match all items that have "gift" in the description. Not case sensitive.',
                koboBlackListInstructions = "List of items not to give to to Kobo. " + "Not case sensitive.",
                alchemyWhiteListInstructions = "List of recipes to combine. Will not combine recipes with ingredients that can be used in multiple recipes, like " + state.getItem('alchemydupNames', ['Battle Hearts']).join(', ') + 
					". Leave blank to combine any other recipes. Not case sensitive.",
                alchemyBlackListInstructions = "List of recipes not to combine. " + "Not case sensitive.",
                itemInvInst = "Inventory all items. Uses local storage space and not used by CAAP except to display the Item dashboard.",
                potionsInstructions0 = "Enable or disable the consumption " + "of energy and stamina potions.",
                potionsInstructions1 = "Number of stamina potions at which to " + "begin consuming.",
                potionsInstructions2 = "Number of stamina potions to keep.",
                potionsInstructions3 = "Number of energy potions at which to " + "begin consuming.",
                potionsInstructions4 = "Number of energy potions to keep.",
                potionsInstructions5 = "Do not consume potions if the " + "experience points to the next level are within this value.",
                htmlCode = '';

            htmlCode += caap.startToggle('Item', 'ITEMS');
            htmlCode += caap.makeCheckTR('Potions', 'potions', false, potionsInstructions0);
            htmlCode += caap.display.start('potions');
            htmlCode += caap.makeNumberFormTR("Spend Stamina At", 'staminaPotionsSpendOver', potionsInstructions1, 30, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Keep Stamina", 'staminaPotionsKeepUnder', potionsInstructions2, 25, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Spend Energy At", 'energyPotionsSpendOver', potionsInstructions3, 30, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Keep Energy", 'energyPotionsKeepUnder', potionsInstructions4, 25, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Wait If Exp. To Level", 'potionsExperience', potionsInstructions5, 55, '', '', true, false);
            htmlCode += caap.display.end('potions');
            htmlCode += caap.makeCheckTR('Alchemy', 'alchemy', false, alchemyInstructions1);
            htmlCode += caap.display.start('alchemy');
            htmlCode += caap.makeTD("Alchemy Recipe White List",true);
            htmlCode += caap.makeTextBox('alchemy_whitelist', alchemyWhiteListInstructions, '', '');
            htmlCode += caap.makeTD("Alchemy Recipe Black List",true);
            htmlCode += caap.makeTextBox('alchemy_blacklist', alchemyBlackListInstructions, 'Trophy, ', '');
            htmlCode += caap.display.end('alchemy');
            htmlCode += caap.makeCheckTR('Kobo', 'kobo', false, koboInstructions0);
            htmlCode += caap.display.start('kobo');
            htmlCode += caap.makeNumberFormTR("Keep", 'koboKeepUnder', koboInstructions1, 100, '', '', true, false);
            htmlCode += caap.makeTD("Kobo Item White List",true);
            htmlCode += caap.makeTextBox('kobo_whitelist', koboWhiteListInstructions, '~gift, ', '');
            htmlCode += caap.makeTD("Kobo Item Black List",true);
            htmlCode += caap.makeTextBox('kobo_blacklist', koboBlackListInstructions, '', '');
            htmlCode += caap.display.end('kobo');
            htmlCode += caap.makeCheckTR('Inventory Items', 'itemIventory', false, itemInvInst);
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in chores.menu: " + err.stack);
            return '';
        }
    };

}());
