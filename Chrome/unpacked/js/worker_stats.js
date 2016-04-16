/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global $j,$u,caap,config,con,state,session,worker,stats,statsFunc,ignoreJSLintError,
gm,hiddenVar,battle,general */
/*jslint maxlen: 256 */

    /////////////////////////////////////////////////////////////////////
    //                          GET STATS
    // Functions that records all of base game stats, energy, stamina, etc.
    /////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

	worker.add({name: 'statsFunc', recordIndex: 'FBID', recordsAreObj: true});

    statsFunc.record = function (FBID) {
        this.data = {
			FBID: FBID,
			account: '',
			PlayerName: '',
			level: 0,
			army: {
				actual: 0,
				capped: 0
			},
			records: {
				total: 0,
				invade: 0
			},
			attack: 0,
			defense: 0,
			bonus: {
				attack: 0,
				defense: 0,
				dpi: 0,
				api: 0
			},
			monster: {
				dp: 0
			},
			points: {
				skill: 0,
				favor: 0,
				guild: 0
			},
			indicators: {
				bsi: 0,
				lsi: 0,
				bsib: 0,
				lsib: 0,
				spplb: 0,
				api: 0,
				dpi: 0,
				mpi: 0,
				ttl: 0,
				eSta: 0,
				eEne: 0,
				htl: 0,
				hrtl: 0,
				enl: 0,
				pvpclass: '',
				build: ''
			},
			gold: {
				cash: 0,
				bank: 0,
				total: 0,
				income: 0,
				upkeep: 0,
				flow: 0,
				ticker: []
			},
			rank: {
				battle: 0,
				war: 0,
				conquest: 0,
				festival: 0,
				conquestLevel: 0
			},
			potions: {
				energy: 0,
				stamina: 0
			},
			energy: {
				norm: 0,
				num: 0,
				min: 0,
				max: 0,
				ticker: []
			},
			health: {
				norm: 0,
				num: 0,
				min: 0,
				max: 0,
				ticker: []
			},
			stamina: {
				norm: 0,
				num: 0,
				min: 0,
				max: 0,
				ticker: []
			},
			lowpoints: {
				level: 0,
				stamina: 0,
				energy: 0
			},
			exp: {
				num: 0,
				max: 0,
				dif: 0
			},
			guildTokens: {
				num: 0,
				max: 0,
				dif: 0
			},
			resources: {
				lumber: 0,
				iron: 0
			},
			conquest: {
				Conqueror: 0,
				Guardian: 0,
				Hunter: 0,
				Engineer: 0,
				dif : 0,
				collectOk: true,
				checkPoints : false
			},
			LoMland: -1,
			other: {
				qc: 0,
				bww: 0,
				bwl: 0,
				te: 0,
				tee: 0,
				wlr: 0,
				eer: 0,
				atlantis: false
			},
			achievements: {
				battle: {
					invasions: {
						won: 0,
						lost: 0,
						streak: 0,
						ratio: 0
					},
					duels: {
						won: 0,
						lost: 0,
						streak: 0,
						ratio: 0
					}
				},
				monster: {},
				other: {
					alchemy: 0
				},
				feats: {
					attack: 0,
					defense: 0,
					health: 0,
					energy: 0,
					stamina: 0,
					army: 0
				}
			},
			character: {},
			guild: {
				name: '',
				id: '',
				ids: [], // For your guild mates
				level: 0,
				levelPercent: 0,
				mPoints: 0,
				mRank: '',
				bPoints: 0,
				bRank: '',
				powers: '',
				members: []
			},
			battleIdle: 'Use Current',
			reviewPages : [],
			rune: {
				attack: 0,
				defense: 0,
				damage: 0,
				health: 0
			},
			essence: {
				bonus: 0,
				attack: 0,
				defense: 0,
				damage: 0,
				health: 0
			},
			priorityGeneral: 'Use Current'
		};
    };

	statsFunc.init = function() {
		try {
			var accountName = stats.account;
			window.stats = statsFunc.getRecord(stats.FBID);
			if (stats.FBID == 0) {
				con.log(1, 'Reloading because FBID reset to zero');
				session.setItem("flagReload", true);
			}
			stats.account = accountName;
			state.deleteItem("statsRaiseDone");
			
			session.setItem("UserDashUpdate", true);
       } catch (err) {
            con.error("ERROR in gb.init: " + err.stack);
            return false;
        }
	};

	statsFunc.unpause = function() {
		state.deleteItem("statsRaiseDone");
	};
	
	statsFunc.check = function(page) {
        try {
			ignoreJSLintError(page);
            var passed = true,
                tNum = 0,
                xS = 0,
                xE = 0,
                statDiv = $j("#globalContainer #main_sts_container"),
				tempDiv = $j(),
                text = statDiv.text().trim().innerTrim(),
                topText = $j('#globalContainer #main_bntp').text().trim().innerTrim();

			if (!$u.hasContent(text) || !$u.hasContent(topText)) {
				return false;
			}
			
            // gold
            stats.gold.cash = $u.setContent(text.regex(/to bank ([\d,]+) gold/), 0).numberOnly();

            ['energy','stamina','health'].forEach(function(stat) {
				tNum = stats[stat].max;
                if (caap.getStatusNumbers(text.regex(new RegExp(stat.ucWords() + '(?: \\+\\d\\:\\d+)? (\\d+\\/\\d+)')), stats[stat])) {
					if (stats[stat].max != tNum) {
						tempDiv = $j($j("#" + stat + "_current_value", statDiv)[0].parentNode);
						if ($u.hasContent(tempDiv) && tempDiv.html().indexOf('color') == -1) {
								stats[stat].norm = stats[stat].max;
						}
					}
				} else {
                    con.warn("Unable to get stat " + stat);
                    passed = false;
                }
            });

            // experience
            if (!caap.bulkRegex(text, /XP: (\d+)\/(\d+) XP needed: (\d+)/,
				stats.exp, ['num', 'max', 'dif'])) {
                con.warn("Unable to get experience numbers");
                passed = false;
            }

            // level
            tNum = text.regex(/Level: (\d+)/);
            if (tNum) {
                if (tNum > stats.level) {
                    con.log(2, 'New level. Resetting Best Land Cost.');
                    caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                    state.setItem('KeepLevelUpGeneral', true);
                }

                stats.level = tNum;
            } else {
                con.warn("Unable to get level");
                passed = false;
            }

            // army
            tNum = topText.regex(/Army \((\d+)\)/);
            if (tNum) {
                stats.army.actual = tNum;
                tNum = Math.min(stats.army.actual, 501);
                if (tNum >= 1 && tNum <= 501) {
                    stats.army.capped = tNum;
                } else {
                    con.warn("Army count not in limits");
                    passed = false;
                }
            } else {
                con.warn("Unable to get army numbers");
                passed = false;
            }

            // upgrade points  My Stats (+5) 
            tNum = $u.setContent(topText.regex(/My Stats \(\+(\d+)\)/), 0);
			if (tNum > stats.points.skill) {
				con.log(2, 'New points. Resetting AutoStat.');
				state.deleteItem("statsRaiseDone");
			}
			stats.points.skill = tNum;

            // Indicators: Hours To Level, Time Remaining To Level and Expected Next Level
            if (stats.exp) {
                xS = gm ? gm.getItem("expStaminaRatio", 2.4, hiddenVar) : 2.4;
                xE = state.getItem('nextQuest', {expRatio : 1.4}).expRatio || (gm ? gm.getItem("expEnergyRatio", 1.4, hiddenVar) : 1.4);
                stats.indicators.htl = ((stats.level * 12.5) - (stats.stamina.max * xS) - (stats.energy.max * xE)) / (24 * (xS + xE));
                stats.indicators.hrtl = (stats.exp.dif - (stats.stamina.num * xS) - (stats.energy.num * xE)) / (24 * (xS + xE));
                stats.indicators.enl = Date.now() + Math.ceil(stats.indicators.hrtl * 3600000);
            } else {
                con.warn('Could not calculate time to next level. Missing experience stats!');
                passed = false;
            }
			
			if (caap.oneMinuteUpdate('saveStats')) {
				statsFunc.setRecord(stats);
			}

            if (!passed && stats.energy.max === 0 && stats.health.max === 0 && stats.stamina.max === 0) {
                $j().alert("<div style='text-align: center;'>" + con.warn("Paused as this account may have been disabled!", stats) + "</div>");
                caap.pauseListener();
            }

            return passed;
        } catch (err) {
            con.error("ERROR in stats.check: " + err.stack);
            return false;
        }
    };

    statsFunc.checkResults = function (page) {
        try {
			switch (page) {
			case 'keep' :
				var tempDiv = $j(),
					achDiv = $j(),
					tdDiv = $j(),
					level = 0,
					ii = 0,
					temp,
					row,
					head,
					body,
					text = $j('#app_body').text().trim().innerTrim();

				text = text.replace('COMING SOON This feature is coming soon! ', '').replace(/(You have \d+ Upgrade Points to use\! Click the ' ' buttons below to upgrade your stats\! )/, '').replace(caap.resultsText, '').trim();
				if (!text.match(/Army Size - Take more soldiers into battle!/)) {
					tempDiv = $j("#app_body a[href*='keep.php?user=']");
					if ($u.hasContent(tempDiv)) {
						con.log(2, "On another player's keep", $u.setContent($u.setContent(tempDiv.attr("href"), '').basename().regex(/(\d+)/), 0));
					} else {
						con.error("Error: standard text not found and not another player's keep", text);
					}
					break;
				}
				
				if (!caap.bulkRegex(text, /(.*?) ?Level \d+ - (.*?) ([\d\.]+) .*?Max Energy .*? ([\d\.]+) .*?Max Stamina .* ([\d\.]+) .*?Max Health/,
					stats, ['PlayerName', 'rank.battle', 'energy.norm', 'stamina.norm', 'health.norm'])) {
					con.warn('Stats: unable to read energy, stamina, health unmodified values', text);
				}
				stats.rank.battle = battle.ranks.rank.indexOf(stats.rank.battle);
				// war rank
				if (stats.level >= 100) {
					tempDiv = $j("#app_body img[src*='war_rank_']");
					if ($u.hasContent(tempDiv)) {
						stats.rank.war = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
					} else {
						con.warn('Using stored warRank.');
					}
				}
				if (stats.level >= 10) {
					if (!caap.bulkRegex(text, /([\d\.]+) \(\+([\d\.]+)\) Attack .*? ([\d\.]+) \(\+([\d\.]+)\) Defense/, stats,
					['attack', 'bonus.attack', 'defense', 'bonus.defense'])) {
						con.warn('Stats: unable to read attack, defense, and modifiers', text);
					}
				}
				// conquest rank
				if (stats.level >= 80) {
					tempDiv = $j("#app_body img[src*='conquest_rank_']");
					if ($u.hasContent(tempDiv)) {
						stats.rank.conquest = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
					} else {
						con.warn('Using stored conquestRank.');
					}
				}

				// festival rank
				if (stats.level >= 80) {
					tempDiv = $j("#app_body img[src*='festival_duelchampion']");
					if ($u.hasContent(tempDiv)) {
						stats.rank.festival = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
					} else {
						con.warn('Using stored conquestRank.');
					}
				}

				// Check for Gold Stored  STORED: INCOME: UPKEEP: CASH FLOW: $0 $236,345,000/hour -$1,280,430/hour $235,064,570/hour
				if (caap.bulkRegex(text, /STORED: INCOME: UPKEEP: CASH FLOW: \$([,\d]+) \$([,\d]+)\/hour -\$([,\d]+)\/hour \$([,\d]+)\/hour/,
					stats.gold,	['bank', 'income', 'upkeep', 'flow'], 'silent')) {
					['bank', 'income', 'upkeep', 'flow'].forEach( function(e) {
						stats.gold[e] = stats.gold[e].numberOnly();
					});
					stats.gold.total = stats.gold.bank + stats.gold.cash;
				// New territory style: Bank and Income: Protect your Money from Enemy Attack! STORED: $0 Upgrade Runes
				} else if (caap.bulkRegex(text, /STORED: \$([,\d]+) Upgrade Runes/,	stats.gold,	['bank'])) {
					stats.gold.bank = stats.gold.bank.numberOnly();
					stats.gold.total = stats.gold.bank + stats.gold.cash;
				} else {
					con.warn('Stats: unable to gold values', text);
				}

				if (!caap.bulkRegex(text, /CLASS POWERS CLASS EQUIPMENT RESISTANCES (?:x\d+ )*(\d+)/, stats,
				['monster.dp'])) {
					con.warn('Stats: unable to read divine power', text);
				}
				
				// Potions
				stats.potions.energy = $u.setContent($j("div[title='Energy Potion']").text(), '0').numberOnly();
				stats.potions.stamina = $u.setContent($j("div[title='Stamina Potion']").text(), '0').numberOnly();
				
				// Guild ID
				stats.guild.id = $u.setContent($j('#app_body a[href*="guild_id"]').attr('href'), 'guild_id=').regex(/guild_id=(\w*)/);

				// Runes/Essence
				if (!caap.bulkRegex(text, /(\d+) (?:\(\+\d+\) )?(?:Atk|Attack).*? (\d+) (?:\(\+\d+\) )?(?:Def|Defense).*? (\d+) (?:\(\+\d+\) )?(?:Dmg|Damage).*? (\d+) (?:\(\+\d+\) )?(?:Hth|Health)/, stats.rune, ['attack', 'defense', 'damage', 'health'])) {
					con.warn('Stats: unable to read runes', text);
				}

				if (!caap.bulkRegex(text, /x(\d+) x(\d+) x(\d+) x(\d+)/,
					stats.essence, ['attack', 'defense', 'damage', 'health'])) {
					con.warn('Stats: unable to read essence', text);
				}

				// Other stats
				if (!caap.bulkRegex(text, /Quests Completed (\d+) Battles\/Wars Won (\d+) Battles\/Wars Lost (\d+) Kills (\d+) Deaths (\d+)/,
					stats.other, ['qc', 'bww', 'bwl', 'te', 'tee'])) {
					con.warn('Unable to read quests completed and battle stats', text);
				}

				// Win/Loss Ratio (WLR)
				stats.other.wlr = stats.other.bwl !== 0 ? (stats.other.bww / stats.other.bwl).dp(2) : Infinity;
				// Enemy Eliminated Ratio/Eliminated (EER)
				stats.other.eer = stats.other.tee !== 0 ? (stats.other.tee / stats.other.te).dp(2) : Infinity;
				// Indicators
				if (stats.level >= 10) {
					stats.indicators.bsi = ((stats.attack + stats.defense) / stats.level).dp(2);
					stats.indicators.bsib = ((stats.attack + stats.bonus.attack + stats.defense + stats.bonus.defense) / stats.level).dp(2);
					stats.indicators.lsi = ((stats.energy.max + (2 * stats.stamina.max)) / stats.level).dp(2);
					stats.indicators.lsi = ((stats.energy.max + (2 * stats.stamina.max)) / stats.level).dp(2);
					stats.indicators.sppl = ((stats.energy.max + (2 * stats.stamina.max) + stats.attack + stats.defense + stats.health.max - 122) / stats.level).dp(2);
					stats.indicators.spplb = ((stats.energy.max + (2 * stats.stamina.max) + stats.indicators.bsib * stats.level + stats.health.max - 122) / stats.level).dp(2);
					stats.indicators.api = (stats.attack + (stats.defense * 0.7)).dp(0);
					stats.bonus.api = stats.indicators.api + (stats.bonus.attack + (stats.bonus.defense * 0.7)).dp(0);
					stats.indicators.dpi = ((stats.defense + (stats.attack * 0.7))).dp(0);
					stats.bonus.dpi = stats.indicators.dpi + (stats.bonus.defense + (stats.bonus.attack * 0.7)).dp(0);
					stats.indicators.mpi = (((stats.indicators.api + stats.indicators.dpi) / 2)).dp(0);
					stats.indicators.ttl = ((12.5 * stats.level + 6.25 - stats.energy.max * 1.4 - stats.stamina.max * 2.2) / 3.6 / (60 / 2.5) / 24).dp(2);
					stats.indicators.eSta = (24 * 24 + stats.stamina.max / stats.indicators.ttl).dp(0);
					stats.indicators.eEne = (24 * 24 + stats.energy.max / stats.indicators.ttl).dp(0);
					if (stats.attack >= stats.defense) {
						temp = stats.attack / stats.defense;
						if (temp === stats.attack) {
							stats.indicators.pvpclass = 'Destroyer';
						} else if (temp >= 2 && temp < 7.5) {
							stats.indicators.pvpclass = 'Aggressor';
						} else if (temp < 2 && temp > 1.01) {
							stats.indicators.pvpclass = 'Offensive';
						} else if (temp <= 1.01) {
							stats.indicators.pvpclass = 'Balanced';
						}
					} else {
						temp = stats.defense / stats.attack;
						if (temp === stats.defense) {
							stats.indicators.pvpclass = 'Wall';
						} else if (temp >= 2 && temp < 7.5) {
							stats.indicators.pvpclass = 'Paladin';
						} else if (temp < 2 && temp > 1.01) {
							stats.indicators.pvpclass = 'Defensive';
						} else if (temp <= 1.01) {
							stats.indicators.pvpclass = 'Balanced';
						}
					}
				}

				statsFunc.setRecord(stats);
				if (config.getItem("displayKStats", true)) {
					tempDiv = $j("div[style*='keep_top']");

					temp = "<div style='background-image:url(\"" + caap.domain.protocol[caap.domain.ptype] +
						"castleagegame1-a.akamaihd.net/32703/graphics/keep_tabsubheader_mid.jpg\");border:none;padding: 5px 5px 20px 20px;width:715px;font-weight:bold;font-family:Verdana;sans-serif;background-repeat:y-repeat;'>";
					temp += "<div style='border:1px solid #701919;padding: 5px 5px;width:688px;height:100px;background-color:#d0b682;'>";
					row = caap.makeTh({text: '&nbsp;', width: '5%'});

					row += caap.makeTh({text: '&nbsp;', width: '10%'});
					row += caap.makeTh({text: '&nbsp;', width: '20%'});
					row += caap.makeTh({text: '&nbsp;', width: '10%'});
					row += caap.makeTh({text: '&nbsp;', width: '20%'});
					row += caap.makeTh({text: '&nbsp;', width: '10%'});
					row += caap.makeTh({text: '&nbsp;', width: '20%'});
					row += caap.makeTh({text: '&nbsp;', width: '5%'});
					head = caap.makeTr(row);
					
					row = caap.makeTd({text: '', title: ''});
					row += caap.makeTd({text: 'BSI', title: 'Battle Strength Index'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.bsi + ' (' + stats.indicators.bsib + ')', title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'LSI', title: 'Leveling Speed Index'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.lsi, title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'SPPL', title: 'Skill Points Per Level (More accurate than SPAEQ)'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.sppl + ' (' + stats.indicators.spplb + ')', title: ''}, "font-size:14px;");
					body = caap.makeTr(row);
					
					row = caap.makeTd({text: '', title: ''});
					row += caap.makeTd({text: 'API', title: 'Attack Power Index'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.api + ' (' + stats.bonus.api + ')', title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'DPI', title: 'Defense Power Index'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.dpi + ' (' + stats.bonus.dpi + ')', title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'MPI', title: 'Mean Power Index'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.mpi, title: ''}, "font-size:14px;");
					body += caap.makeTr(row);
					
					row = caap.makeTd({text: '', title: ''});
					row += caap.makeTd({text: 'eSTA', title: 'Effective Daily Stamina'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.eSta, title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'eEne', title: 'Effective Daily Energy'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.eEne, title: ''}, "font-size:14px;");
					row += caap.makeTd({text: 'PvP Class', title: 'Player vs. Player character class'}, "font-size:14px;");
					row += caap.makeTd({text: stats.indicators.pvpclass, title: ''}, "font-size:14px;");
					body += caap.makeTr(row);
					temp += caap.makeTable("keepstats", head, body, "Statistics", "font-size:16px;");
					temp += "</div></div>";
					tempDiv.after(temp);
				}
				break;
			case 'achievements' :

				// Get favor points -- Just put this here since it's a convenient page visited about once a day
				stats.points.favor = $u.setContent($j('#persistHomeFPPlateOpen').text(), '').regexd(/(\d+)/, 0);
				
				achDiv = $j("#app_body #achievement_info_container_test_of_might_monster div[style*='ach_medalcontainer.jpg']");
				if ($u.hasContent(achDiv)) {
					stats.achievements.monster = {};
					achDiv.each(function () {
						text = $j(this).text().trim();
						var divNum = text.regex(/([0-9,]+) total/i),
							tdTxt = text.regex(/(.+) \([0-9,]+ of [0-9,]+, [0-9,]+ total\)/);
						
						stats.achievements.monster[tdTxt] = divNum;
					});

					statsFunc.setRecord(stats);
				} else {
					con.warn('Monster Achievements not found.');
				}

				achDiv = $j("#app_body #achievement_type_container_test_of_might_other");
				if ($u.hasContent(achDiv)) {

					tdDiv = $j('div[id="achievement_type_container_test_of_might_other"] > div[class="achievement_info_container"] > div[id="achievement_body"]');
					for (ii = 0; ii < tdDiv[0].children[0].children.length; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii;
						}
					}

					stats.achievements.other.alchemy = level;
					statsFunc.setRecord(stats);
				} else {
					con.warn('Test of Might Achievements not found.');
				}

				achDiv = $j("#app_body #achievement_type_container_festival_feat");
				if ($u.hasContent(achDiv)) {
					tdDiv = $j('div[id="achievement_type_container_festival_feat"] > div[class="achievement_info_container"] > div[id="achievement_body"]');

					for (ii = 1; ii < 9; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii;
						}
					}

					stats.achievements.feats.attack = level;
					statsFunc.setRecord(stats);
					level = 0;

					for (ii = 9; ii < 17; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii - 8;
						}
					}

					stats.achievements.feats.defense = level;
					statsFunc.setRecord(stats);
					level = 0;
					for (ii = 17; ii < 25; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii - 16;
						}
					}

					stats.achievements.feats.health = level;
					statsFunc.setRecord(stats);
					level = 0;
					for (ii = 25; ii < 33; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii - 24;
						}
					}

					stats.achievements.feats.energy = level;
					statsFunc.setRecord(stats);
					level = 0;
					for (ii = 33; ii < 41; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii - 32;
						}
					}

					stats.achievements.feats.stamina = level;
					statsFunc.setRecord(stats);
					level = 0;
					for (ii = 41; ii < 49; ii += 1) {
						if (tdDiv[0].children[0].children[ii].style.opacity === "") {
							level = ii - 40;
						}
					}

					stats.achievements.feats.army = level;
					statsFunc.setRecord(stats);
				} else {
					con.warn('Festival Feats Achievements not found.');
				}

				achDiv = null;
				tdDiv = null;
				break;
				
			default :
				break;
			}

            return true;
        } catch (err) {
            con.error("ERROR in statsFunc.checkResults: " + err.stack);
            return false;
        }
    };

    ////////////////////////////////////////////////////////////////////
    //                      Stat Point Upgrade
    ////////////////////////////////////////////////////////////////////

	worker.addAction({fName : 'statsFunc.immediate', priority : 1400, description : 'Raising Stats Immediately'});

    statsFunc.immediate = function () {
        if (config.getItem("StatImmed", false)) {
			return statsFunc.upgrade();
        }
    };

	worker.addAction({fName : 'statsFunc.upgrade', priority : -200, description : 'Raising Stats'});

    statsFunc.upgrade = function () {
        try {
            if (!config.getItem('AutoStat', false) || !stats.points.skill) {
                return false;
            }

            if (state.getItem("statsRaiseDone", false)) {
                if (state.getItem("autoStatRuleLog", false)) {
                    con.log(2, "Set to use all stat points, but unable to assign according to settings. Settings should be reviewed.");
                    state.deleteItem("autoStatRuleLog");
                }
                return false;
            }

            var advanced = config.getItem("AutoStatAdv", false),
                attribute = '',
                configVal = 0,
                targetVal = 0,
                currentVal = 0,
                level = stats.level,
                energy = stats.energy.norm,
                stamina = stats.stamina.norm,
                attack = stats.attack,
                defense = stats.defense,
                health = stats.health.norm,
                action = false;

			ignoreJSLintError(level, energy, stamina, attack, defense, health);
			
			(advanced ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4]).some( function(n) {
                attribute = config.getItem('Attribute' + n, '').toLowerCase();

                if (attribute === '') {
                    con.log(2, "Skipping blank entry");
                    return false;
                }

                if (stats.level < 10 && ['attack', 'defense', 'health'].hasIndexOf(attribute)) {
					con.log(2, "Characters below level 10 can not increase Attack, Defense or Health");
					return false;
                }

                configVal = config.getItem('AttrValue' + n, 0);

				//Using eval, so user can define formulas on menu, like energy = level + 50
				/*jslint evil: true */
				targetVal = advanced ? eval(configVal) : configVal;
				/*jslint evil: false */

				currentVal = $u.isObject(stats[attribute]) ? stats[attribute].norm : stats[attribute];

                if (targetVal > currentVal) {
                    if (attribute === 'stamina' && stats.points.skill < 2) {
					// Wait for second stamina point, maybe
						return !config.getItem("StatSpendAll", false);
					}
				// We have a match! Upgrade it
					con.log(2, "Upgrading Skill Point: " + attribute + " is " + currentVal + ", upgrading to " + targetVal);
					if (caap.navigateTo('keep') ||
						caap.ifClick($j("#app_body div[style*='keep_bgv2.jpg'] a[href*='upgrade=" + attribute + "']"))) {
						action = true;
					} else {
						con.warn("Unable to locate upgrade button for " + attribute);
					}
					return true;
                }
            });

			if (action) {
				return true;
			}

			con.log(1, "No rules match to increase stats");	
            state.setItem("statsRaiseDone", true);
			return false;
        } catch (err) {
            con.error("ERROR in statsFunc.upgrade: " + err.stack);
            return false;
        }
    };

	statsFunc.dashboard = {
		name: 'Stats',
		inst: 'Display information about your account and character statistics',
		records: 'statsFunc',
		headerF: function() {
            var headers = [],
                pp = 0,
                count = 0,
                len = 0,
                head = '',
                body = '',
                row = '',
                rows = [];

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_userStats' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
			head = "";
			body = "";
			headers = ['Name', 'Value', 'Name', 'Value'];
			for (pp = 0, len = headers.length; pp < len; pp += 1) {
				head += caap.makeTh({text: headers[pp],
					width: ''});
			}

			head = caap.makeTr(head);
			rows = [
				[{text: 'Facebook ID'}, {text: stats.FBID}, {text: 'Account Name'}, {text: caap.fbData.me.name},
					{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Character Name'}, {text: stats.PlayerName},
					{text: 'Energy', title: 'Current/Max'}, {text: stats.energy.num + '/' + stats.energy.max}],
				[{text: 'Level'}, {text: stats.level}, 
					{text: 'Stamina', title: 'Current/Max'}, {text: stats.stamina.num + '/' + stats.stamina.max}],
				[{text: 'Battle Rank'}, {text: battle.ranks.rank[stats.rank.battle] + ' (' + stats.rank.battle + ')'},
					{text: 'Attack', title: 'Current/Max'}, {text: stats.attack.addCommas()}],
				[{text: 'Battle Rank Points'}, {text: 'Unknown'},
					{text: 'Defense'}, {text: stats.defense.addCommas()}],
				[{text: 'War Rank'}, {text: battle.ranks.warRank[stats.rank.war] + ' (' + stats.rank.war + ')'},
					{text: 'Health', title: 'Current/Max'}, {text: stats.health.num + '/' + stats.health.max}],
				[{text: 'War Rank Points'}, {text: 'Unknown'}, {text: 'Army'}, {text: stats.army.actual.addCommas()}],
				[{text: 'Conquest Rank'}, {text: battle.ranks.conqRank[stats.rank.conquest] + ' (' + stats.rank.conquest + ')'},
					{text: 'Generals'}, {text: general.records.length}],
				[{text: 'Conquest Rank Points'}, {text: 'Unknown'},
					{text: 'Generals When Invade', title: 'For every 5 army members you have, one of your generals will also join the fight.'}, {text: Math.min((stats.army.actual / 5).dp(), general.records.length)}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Gold In Bank'}, {text: '$' + stats.gold.bank.addCommas()},
					{text: 'Total Income Per Hour'}, {text: '$' + stats.gold.income.addCommas()}],
				[{text: 'Gold In Cash'}, {text: '$' + stats.gold.cash.addCommas()},
					{text: 'Upkeep'}, {text: '$' + stats.gold.upkeep.addCommas()}],
				[{text: 'Total Gold'}, {text: '$' + stats.gold.total.addCommas()},
					{text: 'Cash Flow Per Hour'}, {text: '$' + stats.gold.flow.addCommas()}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Skill Points'}, {text: stats.points.skill},
					{text: 'Energy Potions'}, {text: stats.potions.energy}],
				[{text: 'Favor Points'}, {text: stats.points.favor},
					{text: 'Stamina Potions'}, {text: stats.potions.stamina}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Experience To Next Level (ETNL)'}, {text: stats.exp.dif.addCommas()}, {text: 'Battle Strength Index (BSI)'}, {text: stats.indicators.bsi}],
				[{text: 'Hours To Level (HTL)'}, {text: $u.minutes2hours(stats.indicators.htl)}, {text: 'Levelling Speed Index (LSI)'}, {text: stats.indicators.lsi}],
				[{text: 'Hours Remaining To Level (HRTL)'}, {text: $u.minutes2hours(stats.indicators.hrtl)}, {text: 'Skill Points Per Level (SPPL)'}, {text: stats.indicators.sppl}],
				[{text: 'Expected Next Level (ENL)'}, {text: $u.makeTime(stats.indicators.enl, caap.timeStr())}, {text: 'Attack Power Index (API)'}, {text: stats.indicators.api}],
				[{text: 'Build Type'}, {text: stats.indicators.build}, {text: 'Defense Power Index (DPI)'}, {text: stats.indicators.dpi}],
				[{text: 'PvP Class'}, {text: stats.indicators.pvpclass}, {text: 'Mean Power Index (MPI)'}, {text: stats.indicators.mpi}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: 'Monster Hunting Build Effective Quotent (MHBEQ)'}, {text: stats.indicators.mhbeq}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Battles/Wars Won'}, {text: stats.other.bww.addCommas()}, {text: 'Times eliminated'}, {text: stats.other.te.addCommas()}],
				[{text: 'Battles/Wars Lost'}, {text: stats.other.bwl.addCommas()}, {text: 'Times you eliminated an enemy'}, {text: stats.other.tee.addCommas()}],
				[{text: 'Battles/Wars Win/Loss Ratio (WLR)'}, {text: stats.other.wlr}, {text: 'Enemy Eliminated/Eliminated Ratio (EER)'}, {text: stats.other.eer}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Invasions Won'}, {text: stats.achievements.battle.invasions.won.addCommas()}, {text: 'Duels Won'}, {text: stats.achievements.battle.duels.won.addCommas()}],
				[{text: 'Invasions Lost'}, {text: stats.achievements.battle.invasions.lost.addCommas()}, {text: 'Duels Lost'}, {text: stats.achievements.battle.duels.lost.addCommas()}],
				[{text: 'Invasions Streak'}, {text: stats.achievements.battle.invasions.streak.addCommas()}, {text: 'Duels Streak'}, {text: stats.achievements.battle.duels.streak.addCommas()}],
				[{text: 'Invasions Win/loss Ratio (IWLR)'}, {text: stats.achievements.battle.invasions.ratio}, {text: 'Duels Win/loss Ratio (DWLR)'}, {text: stats.achievements.battle.duels.ratio}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Quests Completed'}, {text: stats.other.qc.addCommas()}, {text: 'Alchemy Performed'}, {text: stats.achievements.other.alchemy.addCommas()}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}]
			];

			$j.each(rows, function () {
				var _row = '';

				$j.each(this, function () {
					_row += caap.makeTd(this);
				});

				body += caap.makeTr(_row);
			});

			count = 0;
			for (pp in stats.achievements.monster) {
				if (stats.achievements.monster.hasOwnProperty(pp)) {
					row = count % 2 === 0 ? '' : row;
					row += caap.makeTd({text: pp.escapeHTML()});

					row += caap.makeTd({text: stats.achievements.monster[pp]});

					body += count % 2 === 1 ? caap.makeTr(row) : '';
					count += 1;
				}
			}

			if (count % 2 === 1) {
				row += caap.makeTd({text: '&nbsp;'});

				row += caap.makeTd({text: '&nbsp;'});

				body += caap.makeTr(row);
			}

			rows = [
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Ambrosia Daily Points'}, {text: caap.demi.ambrosia.daily.num + '/' + caap.demi.ambrosia.daily.max}, {text: 'Malekus Daily Points'}, {text: caap.demi.malekus.daily.num + '/' + caap.demi.malekus.daily.max}],
				[{text: 'Ambrosia Total Points'}, {text: caap.demi.ambrosia.power.total}, {text: 'Malekus Total Points'}, {text: caap.demi.malekus.power.total}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Corvintheus Daily Points'}, {text: caap.demi.corvintheus.daily.num + '/' + caap.demi.corvintheus.daily.max}, {text: 'Aurora Daily Points'}, {text: caap.demi.aurora.daily.num + '/' + caap.demi.aurora.daily.max}],
				[{text: 'Corvintheus Total Points'}, {text: caap.demi.corvintheus.power.total}, {text: 'Aurora Total Points'}, {text: caap.demi.aurora.power.total}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Azeron Daily Points'}, {text: caap.demi.azeron.daily.num + '/' + caap.demi.azeron.daily.max}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: 'Azeron Total Points'}, {text: caap.demi.azeron.power.total}, {text: '&nbsp;'}, {text: '&nbsp;'}],
				[{text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}, {text: '&nbsp;'}]
			];

			$j.each(rows, function () {
				var _row = '';

				$j.each(this, function () {
					_row += caap.makeTd(this);
				});

				body += caap.makeTr(_row);
			});

			body += caap.makeTr(row);
			count = 0;
			for (pp in stats.character) {
				if (stats.character.hasOwnProperty(pp)) {
					row = count % 2 === 0 ? '' : row;
					row += caap.makeTd({text: pp});

					row += caap.makeTd({text: "Level " + stats.character[pp].level + " (" + stats.character[pp].percent + "%)"});

					body += count % 2 === 1 ? caap.makeTr(row) : '';
					count += 1;
				}
			}

			if (count % 2 === 1) {
				row += caap.makeTd({text: '&nbsp;'});

				row += caap.makeTd({text: '&nbsp;'});

				body += caap.makeTr(row);
			}

            return caap.makeTable("user", head, body);
		}};

    statsFunc.menu = function () {
        try {
            var autoArchivesInstructions = "Enable or disable the auto archive bonuses",
                statusInstructions = "Automatically increase attributes when upgrade skill points are available.",
                statusAdvInstructions = "USE WITH CAUTION: You can use numbers or " +
                    "formulas(ie. level * 2 + 10). Variable keywords include energy, " +
                    "health, stamina, attack, defense, and level. JS functions can be " +
                    "used (Math.min, Math.max, etc) !!!Remember your math class: " +
                    "'level + 20' not equals 'level * 2 + 10'!!!",
                statImmedInstructions = "Update Stats Immediately",
                statSpendAllInstructions = "If selected then spend all possible points and do not save for stamina upgrade.",
                attrList = ['', 'Energy', 'Attack', 'Defense', 'Stamina', 'Health'],
                autoBlessList = ['None', 'Auto Upgrade', 'Energy', 'Attack', 'Defense', 'Health', 'Stamina'],
                autoBlessListInstructions = [
                    'None disables the auto bless feature.',
                    'Auto Upgrade bless feature according to auto upgrade skill setting.',
                    'Energy performs an automatic daily blessing with Ambrosia.',
                    'Attack performs an automatic daily blessing with Malekus.',
                    'Defense performs an automatic daily blessing with Corvintheus.',
                    'Health performs an automatic daily blessing with Aurora.',
                    'Stamina performs an automatic daily blessing with Azeron.'],
				festivalBlessList = ['None', 'Energy', 'Attack', 'Defense', 'Health', 'Stamina', 'Army', 'All'],
                it = 0,
                htmlCode = '';

            htmlCode += caap.startToggle('Stats', 'STATS');
            htmlCode += caap.makeCheckTR('Item Archives', 'AutoArchives', false, autoArchivesInstructions);
            htmlCode += caap.makeDropDownTR("Demi Blessings", 'AutoBless', autoBlessList, autoBlessListInstructions, '', '', false, false, 62);
            htmlCode += caap.makeCheckTR("Upgrade Points", 'AutoStat', false, statusInstructions);
            htmlCode += caap.display.start('AutoStat');
            htmlCode += caap.makeCheckTR("Spend All Possible", 'StatSpendAll', false, statSpendAllInstructions);
            htmlCode += caap.makeCheckTR("Upgrade Immediately", 'StatImmed', false, statImmedInstructions);
            htmlCode += caap.makeCheckTR("Advanced Settings <a href='http://caaplayer.freeforums.org/help-for-upgrade-points-control-t418.html' target='_blank' style='color: blue'>(INFO)</a>", 'AutoStatAdv', false, statusAdvInstructions);
            htmlCode += caap.display.start('AutoStatAdv', 'isnot', true);
            for (it = 0; it < 5; it += 1) {
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("Increase", false, false, "width: 27%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeDropDown('Attribute' + it, attrList, '', ''), false, false, "width: 40%; display: inline-block;");
                htmlCode += caap.makeTD("to", false, false, "text-align: center; width: 10%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeNumberForm('AttrValue' + it, statusInstructions, 0), false, true, "width: 20%; display: inline-block;");
                htmlCode += caap.endTR;
            }

            htmlCode += caap.display.end('AutoStatAdv', 'isnot', true);
            htmlCode += caap.display.start('AutoStatAdv');
            for (it = 5; it < 10; it += 1) {
                htmlCode += caap.startTR();
                htmlCode += it === 5 ? caap.makeTD("Increase", false, false, "width: 25%; display: inline-block;") : caap.makeTD("Then", false, false, "width: 25%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeDropDown('Attribute' + it, attrList, '', '', ''), false, false, "width: 45%; display: inline-block;");
                htmlCode += caap.makeTD("using", true, false, "width: 25%; display: inline-block;");
                htmlCode += caap.endTR;
                htmlCode += caap.makeTD(caap.makeNumberForm('AttrValue' + it, statusInstructions, '', '', 'text', 'width: 97%;'));
            }

            htmlCode += caap.display.end('AutoStatAdv');
            htmlCode += caap.display.end('AutoStat');
            htmlCode += caap.makeDropDownTR("Festival Feats", 'festivalBless', festivalBlessList, '', '', '', false, false, 62);
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in statsFunc.upgradeMenu: " + err.stack);
            return '';
        }
    };
	
}());
