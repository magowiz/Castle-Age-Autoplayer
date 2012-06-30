/////////////////////////////////////////////////////////////////////
//                              IMMEDIATEAUTOSTAT
/////////////////////////////////////////////////////////////////////

caap.immediateAutoStat = function() {
	if(!config.getItem("StatImmed", false) || !config.getItem('AutoStat', false)) {
		return false;
	}

	return caap.autoStat();
};
////////////////////////////////////////////////////////////////////
//                      Auto Stat
////////////////////////////////////////////////////////////////////

/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
caap.increaseStat = function(attribute, attrAdjust, atributeSlice) {
	try {
		attribute = attribute.toLowerCase();
		var button = $j(), level = 0, attrCurrent = 0, energy = 0, stamina = 0, attack = 0, defense = 0, health = 0, attrAdjustNew = 0, energyDiv = $j("a[href*='energy_max']", atributeSlice), staminaDiv = $j("a[href*='stamina_max']", atributeSlice), attackDiv = $j("a[href*='attack']", atributeSlice), defenseDiv = $j("a[href*='defense']", atributeSlice), healthDiv = $j("a[href*='health_max']", atributeSlice), logTxt = "";

		switch (attribute) {
			case "energy" :
				button = energyDiv;
				break;
			case "stamina" :
				button = staminaDiv;
				break;
			case "attack" :
				button = attackDiv;
				break;
			case "defense" :
				button = defenseDiv;
				break;
			case "health" :
				button = healthDiv;
				break;
			default :
				throw "Unable to match attribute: " + attribute;
		}

		if(!$u.hasContent(button)) {
			con.warn("Unable to locate upgrade button: Fail ", attribute);
			return "Fail";
		}
		attrAdjustNew = attrAdjust;
		logTxt = attrAdjust;
		level = caap.stats['level'];
		function getValue(div) {
			return $u.setContent($j("div[onmouseout*='hideItemPopup']", div.parent().parent().parent()).text(), '').regex(/(\d+)/);
		}

		attrCurrent = getValue(button);
		energy = getValue(energyDiv);
		stamina = getValue(staminaDiv);
		if(level >= 10) {
			attack = getValue(attackDiv);
			defense = getValue(defenseDiv);
			health = getValue(healthDiv);
		}

		if(config.getItem('AutoStatAdv', false)) {
			//Using eval, so user can define formulas on menu, like energy = level + 50
			/*jslint evil: true */
			attrAdjustNew = eval(attrAdjust);
			/*jslint evil: false */
			logTxt = "(" + attrAdjust + ")=" + attrAdjustNew;
		}

		if((attribute === 'stamina') && (caap.stats['points']['skill'] < 2)) {
			if(attrAdjustNew <= attrCurrent) {
				con.log(2, "Stamina at requirement: Next");
				return "Next";
			} else if(config.getItem("StatSpendAll", false)) {
				con.log(2, "Stamina requires 2 upgrade points: Next");
				return "Next";
			} else {
				con.log(2, "Stamina requires 2 upgrade points: Save");
				state.setItem("statsMatch", false);
				return "Save";
			}
		}

		if(attrAdjustNew > attrCurrent) {
			con.log(2, "Status Before [" + attribute + "=" + attrCurrent + "]  Adjusting To [" + logTxt + "]");
			caap.click(button);
			return "Click";
		}

		return "Next";
	} catch (err) {
		con.error("ERROR in increaseStat: " + err);
		return "Error";
	}
};
caap.autoStatCheck = function() {
	try {
		var startAtt = 0, stopAtt = 4, attribute = '', attrValue = 0, n = 0, level = 0, energy = 0, stamina = 0, attack = 0, defense = 0, health = 0, attrAdjust = 0, value = 0, passed = false;

		if(!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
			return false;
		}

		if(config.getItem("AutoStatAdv", false)) {
			startAtt = 5;
			stopAtt = 9;
		}

		for( n = startAtt; n <= stopAtt; n += 1) {
			attribute = config.getItem('Attribute' + n, '').toLowerCase();
			if(attribute === '') {
				continue;
			}

			if(caap.stats['level'] < 10) {
				if(attribute === 'attack' || attribute === 'defense' || attribute === 'health') {
					continue;
				}
			}
			attrValue = config.getItem('AttrValue' + n, 0);
			attrAdjust = attrValue;
			level = caap.stats['level'];
			energy = caap.stats['energy']['num'];
			stamina = caap.stats['stamina']['num'];
			if(level >= 10) {
				attack = caap.stats['attack'];
				defense = caap.stats['defense'];
				health = caap.stats['health']['num'];
			}

			if(config.getItem('AutoStatAdv', false)) {
				//Using eval, so user can define formulas on menu, like energy = level + 50
				/*jslint evil: true */
				attrAdjust = eval(attrValue);
				/*jslint evil: false */
			}

			if(attribute === "attack" || attribute === "defense") {
				value = caap.stats[attribute];
			} else {
				value = caap.stats[attribute]['num'];
			}

			if(attribute === 'stamina' && caap.stats['points']['skill'] < 2) {
				if(config.getItem("StatSpendAll", false) && attrAdjust > value) {
					continue;
				} else {
					passed = false;
					break;
				}
			}

			if(attrAdjust > value) {
				passed = true;
				break;
			}
		}

		state.setItem("statsMatch", passed);
		return true;
	} catch (err) {
		con.error("ERROR in autoStatCheck: " + err);
		return false;
	}
};
caap.autoStat = function() {
	try {
		if(!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
			return false;
		}

		if(!state.getItem("statsMatch", true)) {
			if(state.getItem("autoStatRuleLog", true)) {
				con.log(2, "User should possibly change their stats rules");
				state.setItem("autoStatRuleLog", false);
			}

			return false;
		}

		var atributeSlice = $j("div[style*='keep_cont_top.jpg']", caap.appBodyDiv), startAtt = 0, stopAtt = 4, attrName = '', attribute = '', attrValue = 0, n = 0, returnIncreaseStat = '';

		if(!$u.hasContent(atributeSlice)) {
			caap.navigateTo('keep');
			return true;
		}

		if(config.getItem("AutoStatAdv", false)) {
			startAtt = 5;
			stopAtt = 9;
		}

		for( n = startAtt; n <= stopAtt; n += 1) {
			attrName = 'Attribute' + n;
			attribute = config.getItem(attrName, '');
			if(attribute === '') {
				con.log(4, attrName + " is blank: continue");
				continue;
			}

			if(caap.stats['level'] < 10) {
				if(attribute === 'Attack' || attribute === 'Defense' || attribute === 'Health') {
					con.log(1, "Characters below level 10 can not increase Attack, Defense or Health: continue");
					continue;
				}
			}
			attrValue = config.getItem('AttrValue' + n, 0);
			returnIncreaseStat = caap.increaseStat(attribute, attrValue, atributeSlice);
			switch (returnIncreaseStat) {
				case "Next" :
					con.log(4, attrName + " : next");
					continue;
				case "Click" :
					con.log(4, attrName + " : click");
					return true;
				default :
					con.log(4, attrName + " return value: " + returnIncreaseStat);
					return false;
			}
		}

		con.log(1, "No rules match to increase stats");
		state.setItem("statsMatch", false);
		return false;
	} catch (err) {
		con.error("ERROR in autoStat: " + err);
		return false;
	}
};
/*jslint sub: false */
