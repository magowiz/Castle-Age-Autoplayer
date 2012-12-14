/////////////////////////////////////////////////////////////////////
//                          POTIONS
/////////////////////////////////////////////////////////////////////

/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
caap.autoPotions = function() {
	try {
		if(!config.getItem('AutoPotions', true) || !schedule.check('AutoPotionTimerDelay')) {
			return false;
		}

		if(caap.stats['exp']['dif'] <= config.getItem("potionsExperience", 20)) {
			con.log(2, "AutoPotions, ENL condition. Delaying 10 minutes");
			schedule.setItem('AutoPotionTimerDelay', 600);
			return false;
		}

		function consumePotion(potion) {
			try {
				if(!$j("div[style*='keep_cont_top']")) {
					con.log(2, "Going to keep for potions");
					if(caap.navigateTo('keep')) {
						return true;
					}
				}

				var formId = caap.domain.id[caap.domain.which] + "consume_1", potionDiv = $j(), button = null;

				if(potion === 'stamina') {
					formId = caap.domain.id[caap.domain.which] + "consume_2";
				}

				con.log(1, "Consuming potion", potion);
				potionDiv = $j("form[id='" + formId + "'] input[src*='keep_consumebtn.jpg']");
				if(potionDiv && potionDiv.length) {
					button = potionDiv;
					if(button) {
						caap.click(button);
					} else {
						con.warn("Could not find consume button for", potion);
						return false;
					}
				} else {
					con.warn("Could not find consume form for", potion);
					return false;
				}

				return true;
			} catch (err) {
				con.error("ERROR in consumePotion: " + err, potion);
				return false;
			}
		}

		if(caap.stats['energy']['num'] < caap.stats['energy']['max'] - 10 && caap.stats['potions']['energy'] >= config.getItem("energyPotionsSpendOver", 39) && caap.stats['potions']['energy'] > config.getItem("energyPotionsKeepUnder", 35)) {
			return consumePotion('energy');
		}

		if(caap.stats['stamina']['num'] < caap.stats['stamina']['max'] - 10 && caap.stats['potions']['stamina'] >= config.getItem("staminaPotionsSpendOver", 39) && caap.stats['potions']['stamina'] > config.getItem("staminaPotionsKeepUnder", 35)) {
			return consumePotion('stamina');
		}

		return false;
	} catch (err) {
		con.error("ERROR in autoPotions: " + err);
		return false;
	}
};
/*jslint sub: false */


caap.autoArchives = function() {
	try {
		var button,hours=24,minutes=0,archiveDIV;
		
		if(!config.getItem('AutoArchives', true) || !schedule.check('AutoArchiveTimerDelay')) {
			caap.setDivContent('archive_mess', schedule.check('AutoArchiveTimerDelay') ? 'Archive = none' : 'Next Archive: ' + $u.setContent(caap.displayTime('AutoArchiveTimerDelay'), "Unknown"));
			return false;
		}
		
		archiveDIV=$j("div[style*='archive_top']");
		if(!archiveDIV || archiveDIV.length ===0) {
			con.log(2, "Going to Item archives for bonuses");
			if(caap.navigateTo('item_archive_bonus')) {
				return true;
			} else {
				throw "Impossible to navigate to Item archives page";
			}
		}

		button = caap.checkForImage('archive_btn_enable.gif');
		if(button) {
			caap.click(button);
		} else {
			var timespan;
			timespan=$j("span[style='']");
			if (timespan) {
				var timestr,convert1 = new RegExp('([0-9]+)hrs([0-9]+)m', 'i'),timeresult;
				timestr=timespan.innerText;
				timeresult=convert1.exec(timestr);
				if (timeresult) {
					hours=Math.max(timeresult[1],0);
					minutes=Math.max(timeresult[2],0);
				} else {
					var convert2 = new RegExp('([0-9]+)m', 'i');
					timestr=timespan.innerText;
					timeresult=convert2.exec(timestr);
					if (timeresult) {
						hours=0
						minutes=Math.max(timeresult[1],0);
					} else {
						con.warn("Could not find timer; so setting to default");
					}
				}					
			} else {
				con.warn("Could not find timer; so setting to default");
			}
		}	
		schedule.setItem('AutoArchiveTimerDelay', ((hours * 60) + minutes) * 60, 300);	
		return false;
		
	} catch (err) {
		con.error("ERROR in autoArchives: " + err);
		return false;
	}
};
