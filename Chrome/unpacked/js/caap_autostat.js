/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                              IMMEDIATEAUTOSTAT
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    caap.immediateAutoStat = function () {
        if (!config.getItem("StatImmed", false) || !config.getItem('AutoStat', false)) {
            return false;
        }

        return caap.autoStat();
    };

    ////////////////////////////////////////////////////////////////////
    //                      Auto Stat
    ////////////////////////////////////////////////////////////////////

    caap.increaseStat = function (attribute, attrAdjust, atributeSlice) {
        function getValue(div) {
            var retVal = $u.setContent($j("div[onmouseout*='hideItemPopup']", div.parent().parent().parent()).text(), '').regex(/(\d+)/);

            con.log(2, "getValue got", retVal);
            return retVal;
        }

        try {
            attribute = attribute.toLowerCase();
            var button = $j(),
                level = 0,
                attrCurrent = 0,
                energy = 0,
                stamina = 0,
                attack = 0,
                defense = 0,
                health = 0,
                attrAdjustNew = 0,
                energyDiv = $j("a[href*='energy_max']", atributeSlice),
                staminaDiv = $j("a[href*='stamina_max']", atributeSlice),
                attackDiv = $j("a[href*='attack']", atributeSlice),
                defenseDiv = $j("a[href*='defense']", atributeSlice),
                healthDiv = $j("a[href*='health_max']", atributeSlice),
                logTxt = "";

            switch (attribute) {
                case "energy":
                    button = energyDiv;
                    break;
                case "stamina":
                    button = staminaDiv;
                    break;
                case "attack":
                    button = attackDiv;
                    break;
                case "defense":
                    button = defenseDiv;
                    break;
                case "health":
                    button = healthDiv;
                    break;
                default:
                    energyDiv = null;
                    staminaDiv = null;
                    attackDiv = null;
                    defenseDiv = null;
                    healthDiv = null;
                    button = null;
                    throw "Unable to match attribute: " + attribute;
            }

            if (!$u.hasContent(button)) {
                con.warn("Unable to locate upgrade button: Fail ", attribute);
                energyDiv = null;
                staminaDiv = null;
                attackDiv = null;
                defenseDiv = null;
                healthDiv = null;
                button = null;
                return "Fail";
            }

            attrAdjustNew = attrAdjust;
            logTxt = attrAdjust;
            level = caap.stats.level;

            attrCurrent = getValue(button);
            energy = getValue(energyDiv);
            stamina = getValue(staminaDiv);
            if (level >= 10) {
                attack = getValue(attackDiv);
                defense = getValue(defenseDiv);
                health = getValue(healthDiv);
            } else {
                attack = caap.stats.attack;
                defense = caap.stats.defense;
                health = caap.stats.health.max;
            }

            con.log(2, "level/energy/stamina/attack/defense/health/health", level, energy, stamina, attack, defense, health, health);

            if (config.getItem('AutoStatAdv', false)) {
                //Using eval, so user can define formulas on menu, like energy = level + 50
                /*jslint evil: true */
                attrAdjustNew = eval(attrAdjust);
                /*jslint evil: false */
                logTxt = "(" + attrAdjust + ")=" + attrAdjustNew;
                con.log(2, "logTxt", logTxt);
            }

            if ((attribute === 'stamina') && (caap.stats.points.skill < 2)) {
                if (attrAdjustNew <= attrCurrent) {
                    con.log(2, "Stamina at requirement: Next");
                    energyDiv = null;
                    staminaDiv = null;
                    attackDiv = null;
                    defenseDiv = null;
                    healthDiv = null;
                    button = null;
                    return "Next";
                }

                if (config.getItem("StatSpendAll", false)) {
                    con.log(2, "Stamina requires 2 upgrade points: Next");
                    energyDiv = null;
                    staminaDiv = null;
                    attackDiv = null;
                    defenseDiv = null;
                    healthDiv = null;
                    button = null;
                    return "Next";
                }

                con.log(2, "Stamina requires 2 upgrade points: Save");
                state.setItem("statsMatch", false);
                energyDiv = null;
                staminaDiv = null;
                attackDiv = null;
                defenseDiv = null;
                healthDiv = null;
                button = null;
                return "Save";
            }

            if (attrAdjustNew > attrCurrent) {
                con.log(2, "Status Before [" + attribute + "=" + attrCurrent + "]  Adjusting To [" + logTxt + "]");
                caap.click(button);
                energyDiv = null;
                staminaDiv = null;
                attackDiv = null;
                defenseDiv = null;
                healthDiv = null;
                button = null;
                return "Click";
            }

            con.log(2, "We fell through: Next", attrAdjustNew, attrCurrent);
            energyDiv = null;
            staminaDiv = null;
            attackDiv = null;
            defenseDiv = null;
            healthDiv = null;
            button = null;
            return "Next";
        } catch (err) {
            con.error("ERROR in increaseStat: " + err);
            return "Error";
        }
    };

    caap.autoStatCheck = function () {
        try {
            var startAtt = 0,
                stopAtt = 4,
                attribute = '',
                attrValue = 0,
                n = 0,
                level = 0,
                energy = 0,
                stamina = 0,
                attack = 0,
                defense = 0,
                health = 0,
                attrAdjust = 0,
                value = 0,
                passed = false;

            if (!config.getItem('AutoStat', false) || !caap.stats.points.skill) {
                return ['', 0];
            }

            if (config.getItem("AutoStatAdv", false)) {
                startAtt = 5;
                stopAtt = 9;
            }

            for (n = startAtt; n <= stopAtt; n += 1) {
                attribute = config.getItem('Attribute' + n, '').toLowerCase();
                // current thinking is that continue should not be used as it can cause reader confusion
                // therefore when linting, it throws a warning
                /*jslint continue: true */
                if (attribute === '') {
                    con.log(1, "Skipping blank entry: continue");
                    continue;
                }

                if (caap.stats.level < 10) {
                    if (attribute === 'attack' || attribute === 'defense' || attribute === 'health') {
                        con.log(1, "Characters below level 10 can not increase Attack, Defense or Health: continue");
                        continue;
                    }
                }
                /*jslint continue: false */

                attrValue = config.getItem('AttrValue' + n, 0);
                attrAdjust = attrValue;
                level = caap.stats.level;
                energy = caap.stats.energy.max;
                stamina = caap.stats.stamina.max;
                attack = caap.stats.attack;
                defense = caap.stats.defense;
                health = caap.stats.health.max;

                if (config.getItem('AutoStatAdv', false)) {
                    //Using eval, so user can define formulas on menu, like energy = level + 50
                    /*jslint evil: true */
                    attrAdjust = eval(attrValue);
                    /*jslint evil: false */
                }

                if (attribute === "attack" || attribute === "defense") {
                    value = caap.stats[attribute];
                } else {
                    value = caap.stats[attribute].max;
                }

                // current thinking is that continue should not be used as it can cause reader confusion
                // therefore when linting, it throws a warning
                /*jslint continue: true */
                if (attribute === 'stamina' && caap.stats.points.skill < 2) {
                    if (config.getItem("StatSpendAll", false) && attrAdjust > value) {
                        continue;
                    } else {
                        passed = false;
                        break;
                    }
                }
                /*jslint continue: true */

                if (attrAdjust > value) {
                    passed = true;
                    break;
                }
            }

            state.setItem("statsMatch", passed);

            if (passed) {
                con.log(1, "Rule match to increase stats", attribute);
                return [attribute, attrValue];
            }

            con.log(1, "No rules match to increase stats");
            return ['', 0];
        } catch (err) {
            con.error("ERROR in autoStatCheck: " + err);
            return false;
        }
    };

    caap.autoStat = function () {
        try {
            if (!config.getItem('AutoStat', false) || !caap.stats.points.skill) {
                return false;
            }

            if (!state.getItem("statsMatch", true)) {
                if (state.getItem("autoStatRuleLog", true)) {
                    con.log(2, "User should possibly change their stats rules");
                    state.setItem("autoStatRuleLog", false);
                }

                return false;
            }

            var atributeSlice,
                attribute = [],
                returnIncreaseStat = '';

            attribute = caap.autoStatCheck();
            if (attribute[0] === '') {
                return false;
            }

            atributeSlice = $j("#app_body div[style*='keep_cont_top.jpg']");
            if (!$u.hasContent(atributeSlice)) {
                caap.navigateTo('keep');
                atributeSlice = null;
                return true;
            }

            returnIncreaseStat = caap.increaseStat(attribute[0], attribute[1], atributeSlice);
            con.log(1, attribute, returnIncreaseStat);
            atributeSlice = null;
            switch (returnIncreaseStat) {
                case "Next":
                    return true;
                case "Click":
                    return true;
                case "Fail":
                    // There is no code to handle this but as a hacky fix is to say that no stats match,
                    // CAAP will try again but won't keep banging it's head if there is a CA problem.
                    state.setItem("statsMatch", false);
                    return false;
                case "Save":
                    // There is no code to handle this but as a hacky fix is to say that no stats match,
                    // CAAP will try again but won't keep banging it's head if there is a CA problem.
                    state.setItem("statsMatch", false);
                    return false;
                default:
                    return false;
            }
        } catch (err) {
            con.error("ERROR in autoStat: " + err);
            return false;
        }
    };

}());
