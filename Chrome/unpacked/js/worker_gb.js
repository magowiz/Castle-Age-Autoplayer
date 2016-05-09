/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global $j,gb,stats,worker,$u,caap,config,con,ignoreJSLintError,gb100Dash,gb10Dash,page,
schedule,state,general,session,battle:true */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          guild_battle OBJECT
// this is the main object for dealing with guild battles
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

	worker.add({ name: 'gb', recordIndex: 'label', recordsAreObj: true});

	worker.addAction({worker : 'gb', priority : 1600, description : 'Guild Battle'});
		
    gb.record = function(label) {
        this.data = {
            label: label,
            attacker_guild_id: '',
            defender_guild_id: '',
            battle_id: '',
			att : 0,
            ticker: '',
			collectedTime: 0,
			lastBattleTime: 0,
			startTime: 0,
			endTime: 0,
			burn: false,
			state: 'Active',
			seal: '0',
			easy: false,
			paths: [],
			simtis: false, // someone in my tower is stunned
			towerDesc: [],
			firstScanDone: false,
			heal:0,
			healSplash: {},
			t: { score: 0,
				tokens: 1 },
			tokens: 10,
			last: 0,
			nextTopReview: 0,
			me: {shout: false},
            enemy: {
				health : 0,
				towers : {},
				members : {},
				attacks : []},
            your: {
				health : 0,
				towers : {},
				members : {},
				attacks : []},
            color: $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"))
        };
    };

	gb.towerRecord = function () {
		this.data = {
			players: 0,
			clerics: 0,
			actives: 0,
			AC: 0,
			healthNum: 0,
			healthMax: 0,
			damage: 0,
			life: 0,
			last: 0   // last seen timestamp
		};
	};
	
    gb.member = function() {
        this.data = {
            position: 0,
            target_id: 0,
			isMe : false,
            name: '',
            level: 0,
            mclass: '',
            healthNum: 0,
            healthMax: 0,
            status: '',
            percent: 0,
			battlePoints: 0,
			points: 0,
			scores: {}
        };
    };

    gb.me = function() {
        this.data = {
            name: '',
            level: 0,
            mclass: '',
            healthNum: 0,
            healthMax: 0,
            status: '',
            percent: 0
        };
    };

	gb.gb100 = {
		name: '100v100', // Used for user facing text
		label: 'gb100', // Used for internal naming 'guild_battle_scoring'
		stamina: 20,
		enterButton: 'guild_enter_battle_button2.gif',
		infoDiv: 'fest_guild_battle',
		idTag : 'img[onclick*="target_tag_"]',
		waitHours: 3.9,
		collectHours: 1.5,
		minHealth: 200,
		scoring : 'guild_battle_scoring',
		actionUrl : 'hundred_battle_view.php?battle_id=&attacker_guild_id=&defender_guild_id=&battle_type=hundred&is_attacker=1&ajax=1',
		towerUrl : 'hundred_battle_view.php?battle_id='
	};
		
	gb.gbClassic = {
		name: 'Classic',
		label: 'gbClassic',
		stamina: 20,
		enterButton: 'guild_enter_battle_button2.gif',
		infoDiv: 'guild_achievement',
		idTag : 'img[onclick*="target_tag_"]',
		waitHours: 8.9,
		collectHours: 8.9,
		minHealth: 1,
		scoring : 'guild_battle_scoring',
		actionUrl : 'guild_battle.php?attacker_guild_id=&defender_guild_id=&battle_type=2000&is_attacker=&ajax=1',
		towerUrl : 'guild_battle.php?attacker_guild_id=&defender_guild_id=&battle_type=2000&is_attacker=&ajax=1'
	};
		
	gb.gb10 = {
		name: '10v10',
		label: 'gb10',
		stamina: 10,
		enterButton: 'guild_enter_battle_button3.gif',
		infoDiv: 'guild_10v10',
		idTag : 'img[onclick*="target_tag_"]',
		waitHours: 3.9,
		collectHours: 1.5,
		minHealth: 200,
		scoring : 'guild_battle_scoring',
		actionUrl : 'ten_battle.php?battle_id=', 
		towerUrl : 'ten_battle.php?battle_id='
	};
	
	gb.damageCalc = function(fR, pOa, i, ns, winChance, arr, bonus) {
		
		var hitNS = ns.regex(/(normal|seal)(?:normal|seal)?/), // Capture the first part of "normalseal" for hit damage for cleric
			splashNS = ns.regex(/(?:normal|seal)?(normal|seal)/), // Capture the last part of "normalseal" for splash damage for cleric
			s = fR.me.healthNum > gb[fR.label].minHealth && $u.hasContent(pOa.splash) ?
				{p: pOa.splash[splashNS].p, t: pOa.splash[splashNS].t, d: pOa.splash[splashNS].d} :
				{p: [], t: [], d: []},
			d = 0,
			width = Math.floor(arr.length / 2),
			start = i + 2 - width;
			
			
		pOa.healths.slice(start, start + arr.length).forEach( function(e, ii) {
			d = Math.min(Math.max(0, e - pOa.splashMax), (pOa.bases[i] + $u.setContent(bonus, 0)) * arr[ii]).dp();
			if (d) {
				s.d.push(d);
				s.p.push(pOa[hitNS][i + ii - width].p * d);
				s.t.push(pOa[hitNS][i + ii - width].t * d);
			}
		});
		
		d = s.d.sum();
		
		return d ? (gb.r100(winChance / 100 * d / $u.setContent(pOa.att.tokens, 1)) * s.t.sum() / d + s.p.sum() / d) : 0;
	};
	
	gb.otherCalc = function(fR, pOa, i, ns, metric) {
		ignoreJSLintError(fR);
		ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
		return metric * pOa[ns][i].t + pOa[ns][i].p;
	};
	
	// Passed a general object, gets the general of that object if loadout, and then regexes the regular expression against it.
	// Default value is 0.
	gb.gs = function(gO, r) {
		return parseFloat($u.setContent(general.getRecord(gO.general).special.regex(r), '0'));
	};
	
	gb.enemy = { 
		mage: [   
			{name: 'fireball', tokens: 2, mageSplash: true, score: function(fR, pOa, i, ns, mR) {
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [0.25, 0.5, 1, 0.5, 0.25]);
			}},
			{name: 'enrage', tokens: 2, mageSplash: true, score: function(fR, pOa, i, ns, mR) {
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1]);
			}},
			{name: 'poly', image: 'polymoprh', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, mR.winChance);
			}},
			{name: 'confuse', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, mR.winChance);
			}},
			// Put duel last for mage, so that Dashboard winchance shows duel chance, not poly or confuse
			{name: 'mduel',	image: 'attack', mageSplash: true, score: function(fR, pOa, i, ns, mR) {
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1]);
			}}
		],
		rogue: [
			{name: 'rduel', image: 'attack', score: function(fR, pOa, i, ns, mR) {
				var bonus = 100 + Math.floor(stats.rune.damage / 5) + gb.gs(pOa.gO, /([\d\.]+) Damage as Rogue/);
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1], bonus);
			}},
			{name: 'intimidate', tokens: 2, score: function(fR, pOa, i, ns, mR) {
				var bonus = Math.floor(stats.rune.damage / 5) + gb.gs(pOa.gO,/([\d\.]+) Damage as Rogue/);
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1], bonus);
			}},
			{name: 'poison', score: function(fR, pOa, i, ns, mR) {
				var bonus = Math.floor(stats.rune.damage / 5) +	gb.gs(pOa.gO, /([\d\.]+) Damage as Rogue/) +
					(55 + gb.gs(pOa.gO,/([\d\.]+) Damage and \+[\d\.]+ Duration to Poison/))	*
					(5 + gb.gs(pOa.gO,/[\d\.]+ Damage and \+([\d\.]+) Duration to Poison/));
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1], bonus);
			}}
		],
		warrior: [
			{name: 'whirlwind', score: function(fR, pOa, i, ns, mR) {
				var wwDamage = 0.86 * (1 + gb.gs(pOa.gO, /([\d\.]+)% damage to each surrounding enemy with Whirlwind/) / 100),
					confidence = pOa.gO.powers.hasIndexOf('confidence') ? 50 + gb.gs(pOa.gO, /([\d\.]+) Max Confidence Damage/) : 0,
					baseBonus = stats.rune.damage * (fR.me.shout * 7 + confidence / 2) / 100 + fR.me.shout * 7 + confidence;
					
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [wwDamage, 1,  wwDamage], baseBonus);
			}},
			{name: 'wduel', image: 'attack', score: function(fR, pOa, i, ns, mR) {
				var confidence = pOa.gO.powers.hasIndexOf('confidence') ? 50 + gb.gs(pOa.gO, /([\d\.]+) Max Confidence Damage/) : 0,
					baseBonus = stats.rune.damage * (fR.me.shout * 7 + confidence / 2) / 100 + fR.me.shout * 7 + confidence;
					
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1], baseBonus);
			}}
		],
		cleric: [
			{name: 'cduel',	image: 'attack', healSplash: true, score: function(fR, pOa, i, ns, mR) {
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1]);
			}},
			{name: 'divine_favor', tokens: 2, healSplash: true, score: function(fR, pOa, i, ns, mR) {
				return gb.damageCalc(fR, pOa, i, ns, mR.winChance, [1]);
			}}
		]
	};

	gb.your = {
		mage: [
			{name: 'mirror', self: false, image : 'mage_illusion', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'swap', image:'wall_move_icon', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.healthNum));
			}}
		],
		rogue: [
			{name: 'smokebomb', self: false, image : 'rogue_smoke', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'swap', image:'wall_move_icon', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.healthNum));
			}}
		],
		warrior: [
			{name: 'guardian', self: false, score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'sentinel', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'swap', image:'wall_move_icon', score: function(fR, pOa, i, ns, mR) {
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.healthNum));
			}}
		],
		cleric: [
			// cduel and divine favor are included here for the splash calcs
			{name: 'cduel',	image: 'attack', healSplash: true},
			{name: 'divine_favor', tokens: 2, healSplash: true},
			{name: 'revive', score: function(fR, pOa, i, ns, mR) {
				ignoreJSLintError(fR, mR);
				ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
				return gb.r100(125 + stats.rune.health + gb.gs(pOa.gO, /([\d\.]+) health restored/)) * pOa[ns][i].t + pOa[ns][i].p;
			}},
			{name: 'heal', image: 'c_heal', score: function(fR, pOa, i, ns, mR) {
				var baseBonus = 125 + gb.gs(pOa.gO, /([\d\.]+) and \+[\d\.]+% of Health/),
					runeBonus = (1 + gb.gs(pOa.gO, /[\d\.]+ and \+([\d\.]+)% of Health/) / 100) * mR.winChance / 100 * stats.rune.health;
				return gb.damageCalc(fR, pOa, i, ns, 100, [1], baseBonus + runeBonus);
			}},
			{name: 'mass_heal',	tokens: 2, score: function(fR, pOa, i, ns, mR) {
				ignoreJSLintError(mR);
				var heal = (160 + stats.rune.health) * (1 + gb.gs(pOa.gO, /([\d\.]+)% to Mass Heal/) / 100);
				return gb.damageCalc(fR, pOa, i, ns, 100, [0.25, 0.5, 1, 0.5, 0.25], heal);
			}},
			{name: 'fortify', score: function(fR, pOa, i, ns, mR) {
				ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'cleanse', score: function(fR, pOa, i, ns, mR) {
				ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'dispel', score: function(fR, pOa, i, ns, mR) {
				ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.level));
			}},
			{name: 'swap', image:'wall_move_icon', score: function(fR, pOa, i, ns, mR) {
				ns = ns.regex(/(?:normal|seal)?(normal|seal)/);
				return gb.otherCalc(fR, pOa, i, ns, gb.r100(mR.healthNum));
			}}
		]
	};

    gb.checkResults = function(page) {
        try {
			var fR = false,
				text = '';

			switch (page) {
			case 'guildv2_battle' :
			case 'guild_battle' :
				fR = gb.getRecord('gbClassic');
				break;
			case 'tenxten_gb_formation' :
			case 'ten_battle' :
				fR = gb.getRecord('gb10');
				break;
			case 'hundred_battle' :
			case 'hundred_battle_view' :
				fR = gb.getRecord('gb100');
				break;
			default :
				break;
			}

			switch (page) {
			case 'index' :
				if (caap.clickUrl != 'index.php') {
					break;
				}
				schedule.setItem("page_index", 3600);
				gb.setRecord(gb.onTop(gb.gb10));
				gb.setRecord(gb.onTop(gb.gb100));
				gb.setRecord(gb.onTop(gb.gbClassic));
				break;
			
			case 'guildv2_battle' :
				caap.checkMyGuildIds();
				text = $u.setContent($j('#app_body #guildv2_battle_middle').text().trim().innerTrim(), '');
				
				if (text.indexOf('submit the Guild for Auto-Matching') >= 0) {
					fR.state = 'Start';	
				} else if (text.indexOf('Time Remaining') >= 0) {
					fR.state = 'Active';
				} else if (text.indexOf('Auto-Match in Progress') >= 0) {
					fR.state = 'Auto-match';
				} else if (text.indexOf('JOIN NOW!') >= 0) {
					fR.state = 'Collect';
				} else {
					con.warn('Unrecognized GB status message: ' + text);
				}
				fR.attacker_guild_id = $j('#app_body input[name*="attacker_guild_id"]').eq(0).attr('value');
				fR.defender_guild_id = $j('#app_body input[name*="defender_guild_id"]').eq(0).attr('value');
				fR.last = Date.now() - 2.5 * 60 * 1000;
				fR.nextTopReview = Date.now();
				break;
				
			case 'guild_battle' :
			case 'hundred_battle_view' :
			case 'ten_battle' :
				fR = gb.onBattle(fR);
				break;
				
			case 'tenxten_gb_formation' :
				if (!caap.hasImage('fb_guild_btn_joinbattle_small.gif', $j('.team_content:visible')) && (fR.state == 'Active' || fR.state == 'Collect')) {
					fR.state = 'No battle';
				}
				break;
				
			case 'hundred_battle' :
				if (!caap.hasImage('sort_btn_joinbattle.gif') && (fR.state == 'Active' || fR.state == 'Collect')) {
					fR.state = 'No battle';
				}
				break;
				
			default :
				break;
			}
			if (fR) {
				gb.setRecord(fR);
			}
			return false;
       } catch (err) {
            con.error("ERROR in gb.checkResults: " + err.stack);
            return false;
        }
    };
	
	gb.init = function() {
		try {
			if (!gb.getRecord('winLoss').newRecord) {
				gb.deleteRecord('winLoss');
			}
			
			gb100Dash.dashboard = $j.extend({}, gb.dashboard, {name: '100v100', gbLabel : 'gb100', inst: 'Display the current 100v100 Guild battle'});
			gb10Dash.dashboard = $j.extend({}, gb.dashboard, {name: '10v10', gbLabel : 'gb10', inst: 'Display the current 10v10 Guild battle'});

			gb.winLoss = {	
				invade:		false,
				lost:		'duelLost',
				won:		'duelWon',
				points:		'gbPoints',
				winLossRegex : new RegExp(stats.PlayerName.trim() + ' (.+) Battle Results:'),
				regexVars : ['name'],
				winLossF : function(r) {
					var str = caap.resultsText.replace(r.name, '').replace(stats.PlayerName.trim(), ''),
						tStr = '',
						fR = {};
						
					r.name = r.name.replace(/ \w+ PATH CREDIT: \w+/,'');
					r.points = str.regexd(/\+([\d\.]+) Battle Activity Points/, 0);
					r.action = str.regex(/(POLYMORPH|CONFUSE)/);
					r.wl = str.regex(/(VICTORY|DEFEAT)/);
					if (str.regex(/(Your target is freed from polymorph!)/i) || str.regex(/(yourself)/i)) {
						r.wl = r.wl == 'VICTORY' ? 'won' : 'lost';
						r.att = r.wl == 'VICTORY' ? 1000000 : 0;
						return;
					}
					if ($u.hasContent(r.wl)) {
						fR = gb.getRecord(session.getItem('gbWhich','gb100'));
						tStr = str.regex(/Defense increased by ([\d\.]+)% from Divine Favor/);
						if (tStr) {
							fR.att = (stats.attack + stats.bonus.attack + (stats.defense + stats.bonus.defense) * 0.7 * (tStr.numberOnly() / 100 + 1)).dp(0);
						} else {
							tStr = str.regex(/Attack increased by ([\d\.]+)% from Enrage/);
							if (tStr) {
								fR.att = ((stats.attack + stats.bonus.attack) * (tStr.numberOnly() / 100 + 1) + (stats.defense + stats.bonus.defense) * 0.7).dp(0);
							}
						}
							
						r.wl = r.wl == 'VICTORY' ? 'won' : 'lost';
						r.att = (fR.att > 0 ? fR.att : stats.bonus.api) * (r.action == 'CONFUSE' ? 1.5 : 1) * (r.action == 'POLYMORPH' ? 1.25 : 1);
						gb.setRecord(fR);
					} else {
						r.wl = ($u.hasContent($j("#globalContainer #results_main_wrapper").find('div[style*="color:#ffdb59"]'))) ? 'won' : 'lost';
						r.att = gb.getRecordVal(session.getItem('gbWhich','gb100'), 'att', stats.bonus.api);
					}
				},
				other: 'None'
			};
			
			gb.actions = [];
			['your','enemy'].forEach( function(which) {
				$j.each(gb[which], function(gbclass) {
					gb[which][gbclass].forEach( function(action) {
						gb.actions.addToList($u.setContent(action.image, action.name) + '.jpg');
					});
				});
			});
			return false;
		} catch (err) {
            con.error("ERROR in gb.init: " + err.stack);
            return false;
		}
	};

	gb.onTop = function(gf) {
        try {
			var fR = gb.getRecord(gf.label),
				now = Date.now(),
				infoDiv = $j("#app_body #newsFeedSection div[style*='news_topcontainer.jpg']").has("img[src$='achivement_tabicons_" + gf.infoDiv + ".gif']"),
				text = infoDiv.text().trim();
			
			if ($u.hasContent(infoDiv) && (gf.name == '100v100' || gf.name == '10v10')) {
				fR.battle_id = $j('a', infoDiv).attr('href').regexd(/\=([\d_]+)/, '');
			}
			
			if (gf.name == 'Classic' && !$u.hasContent(text)) {
				fR.state = fR.state == 'Auto-match' ? 'Auto-match' : 'Start';
			} else if (text.regex(/next/i)) {
				fR.state = 'No battle';
				fR.nextTopReview = now + $u.setContent(($j(infoDiv).find('input.monsterTickerSecs').attr('value') - 4 * 60) % (6 * 3600), 0) * 1000;
				fR.startTime = $j(infoDiv).find('input.monsterTickerSecs').attr('value') ? fR.nextTopReview : 0;
			} else if (text.regex(/battle now/i) || text.regex(/active/i)) {
				if (schedule.since(fR.collectedTime, gf.waitHours / 2 * 60 * 60)) {
					fR.state = 'Active';
				}
			} else if (text.regex(/remaining/i)) {
				fR.state = 'Active';
				fR.nextTopReview = now + $u.setContent($j(infoDiv).find('input.monsterTickerSecs').attr('value') - 4 * 60, 0) * 1000;
			} else if (text.regex(/collect/i)) {
				fR.state = 'Collect';
				fR.nextTopReview = gf.name == 'Classic' ? fR.lastBattleTime + gf.waitHours * 3600 * 1000 : now + 3600 * 1000;
				
			} else {
				con.warn(gf.name + ' Unknown message text', text);
			}

			fR.nextTopReview = fR.nextTopReview < now ? now + 5 * 60 * 1000 : fR.nextTopReview;
			//con.log(2, gf.name + ' state ' + fR.state + ', next top page review: ' + new Date(fR.nextTopReview + 5 * 60 * 1000).toLocaleString(), fR, stats.priorityGeneral, text);
			gb.setRecord(fR);
			return fR;

		} catch (err) {
			con.error("ERROR in gb.onTop: " + err.stack);
            return false;
        }
    };
	
    gb.onBattle = function(fR) {
        try {
            var gate = $j(),
				args = [],
				gf = gb[fR.label], 
                tempDiv = $j("#globalContainer #guild_battle_banner_section"),
				tower = 0,
				which = '',
				healthDiv = $j(),
				myStatsTxt = $u.setContent(tempDiv.text().trim().innerTrim(), ''),
				tStr = '',
				battle_id = fR.battle_id,
				pics = [],
				towerPops = [],
				towerTypes = [],
				sealedTowers = 0,
				battleOver = myStatsTxt.regex(/(Battle Is Over)/i) || myStatsTxt.regex(/(initiate more)/i),
				now = Date.now();

			fR.last = now;
            caap.chatLink("#app_body #guild_war_chat_log div[style*='border-bottom: 1px'] div[style*='font-size: 15px']");

			if (myStatsTxt.regex(/(You Are Not A Part Of This .*Battle)/)) {
				return fR;
			}
			if (myStatsTxt.regex(/(You do not have an on going battle with this Guild currently)/i)) {
				// Need to find guild ID
				fR.state = 'Check ID';
				return fR;
			}

			session.setItem('gbWhich', fR.label);
			
			battle.readWinLoss(caap.resultsText, gb.winLoss);

			fR.nextTopReview = Math.max(now + 5 * 60 * 1000, fR.nextTopReview);
			
			fR.attacker_guild_id = $u.setContent(fR.attacker_guild_id, $j('#app_body input[name*="attacker_guild_id"]').eq(0).attr('value'));
			fR.defender_guild_id = $u.setContent(fR.defender_guild_id, $j('#app_body input[name*="defender_guild_id"]').eq(0).attr('value'));

			if (battleOver) {
				if (caap.hasImage('guild_battle_collectbtn_small.gif')) {
					fR.state = 'Collect';
					fR.collectedTime = 0;
				} else {
					fR.collectedTime = now;
					fR.state = gf.name == 'Classic' ? 'Start' : 'No battle';
				}
				return fR;
			}
							
			fR.state = 'Active';
			
			if (caap.hasImage(gf.enterButton)) {
				fR.lastBattleTime = 0;
				return fR;
			}
			
			if (schedule.since(fR.lastBattleTime, gf.waitHours * 60 * 60)) {
				con.log(1,'Resetting battle data');
				tStr = fR.nextTopReview;
				fR = new gb.record(fR.label).data;					
				fR.nextTopReview = tStr;
				fR.battle_id = battle_id;
			}

			fR.lastBattleTime = now;

			tStr = $u.setContent($j("#monsterTicker").text().trim(),'');
            fR.endTime = now + tStr.parseTimer() * 1000;

			args = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (.+)/(\\d+).+Status: (.+) .* Activity Points: (\\d+)"));
			if (args && args.length === 8) {
				fR.me.mclass = args[3].toLowerCase();
				fR.me.status = args[6] ? args[6].trim() : '';
				fR.me.healthNum = args[4] ? args[4].parseInt() : 0;
				fR.me.healthMax = args[5] ? args[5].parseInt() : 1;
				fR.me.battlePoints = args[7] ? args[7].parseInt() : 0;
				fR.me.percent = ((fR.me.healthNum / fR.me.healthMax) * 100).dp(2);
				pics = $j.makeArray(tempDiv.find('img').map(function() { return $j(this).attr('src').regex(/(\w+\.\w+)$/); }));
				if (fR.att === 0 || (!pics.hasIndexOf('cleric_effect_divine_favor.gif') && !pics.hasIndexOf('mage_effect_enrage.gif'))) {
					fR.att = stats.bonus.api;
				}
				fR.me.shout = pics.hasIndexOf('warrior_effect_shout.gif') ? true : false;
			} else {
				if (myStatsTxt.hasIndexOf('Battle Has Not Started')) {
					// Wait retry until started
					return fR;
				}
				con.warn("args error", args, myStatsTxt);
			}

			tempDiv = $j("#globalContainer span[id='guild_token_current_value']");
			tStr = $u.hasContent(tempDiv) ? tempDiv.text().trim() : '';
			fR.tokens = tStr ? tStr.parseInt() : 0;

			tempDiv = $j("#globalContainer span[id='guild_token_time_value']");
			tStr = $u.hasContent(tempDiv) ? tempDiv.text().trim() : '';
			
			tempDiv = $j("#guild_battle_health");
			if (tempDiv && tempDiv.length) {
				['enemy', 'you'].forEach( function(e) {
					healthDiv = $j("div[style*='guild_battle_bar_" + e + ".gif']", tempDiv).eq(0);
					if ($u.hasContent(healthDiv)) {
						fR[e == 'you' ? 'your' : 'enemy'].health = (100 - healthDiv.getPercent('width')).dp(2);
					} else {
						con.warn("Health bar for " + e + " not found.");
					}
				});

				tempDiv = $j("span", tempDiv);
				if ($u.hasContent(tempDiv) && tempDiv.length === 2) {
					tStr = tempDiv.eq(0).text().trim();
					tempDiv.eq(0).text(tStr + " (" + fR.your.health + "%)");
					tStr = tempDiv.eq(1).text().trim();
					tempDiv.eq(1).text(tStr + " (" + fR.enemy.health + "%)");
				}
			} else {
				con.warn("guild_battle_health error");
			}
			
			gate = $j("div[id*='_guild_member_list_']");
			tower = gate.attr('id').match(/_guild_member_list_(\d)/)[1];
			which = gate.attr('id').match(/(\w+)_guild_member_list_(\d)/)[1];

			fR.towerDesc = [];
			$j("#globalContainer div[id*='" + which + "_new_guild_tab_']").each(function(stower) {
				tStr = this.innerText.trim().innerTrim();
				towerTypes.push($u.setContent(tStr.regex(/\d+\) (\w+)/), ''));
				fR.towerDesc.push($u.setContent(tStr.regex(/\d+\) \w+ (.*)/), ''));
				towerPops.push(tStr.regex(/(\d+)/));
				sealedTowers += $u.hasContent(fR[which].towers[stower]) ? fR[which].towers[stower].healthNum === 0 : towerPops[stower - 1] > 0;
			});
			// easy if only 1 unsealed tower left or 2 unsealed and winning by over 20%
			if (which == 'your') {
				fR.simtis = !$u.isString(fR.me.tower) ? false : towerPops[fR.me.tower - 1] < fR.your.towers[fR.me.tower].players;
			} else {
				fR.easy = (sealedTowers + (fR.your.health > fR.enemy.health + 20)) > 2 && !schedule.since(fR.endTime, -8 * 60 );
			}
			
			if (!gate) {
				con.warn("No gates found");
			} else {
				gb.readTower(fR, which, tower, gate, towerTypes);
			}

			con.log(2, 'Battle: ' + gf.label + ' ' + which.ucWords() + ' Tower ' + tower + " in seconds " + ((Date.now() - now)/1000).dp(2), fR);
			session.setItem(gf.label + "DashUpdate", true);
            return fR;
        } catch (err) {
            con.error("ERROR in gb.onBattle: " + err.stack);
            return false;
        }
    };
	
	gb.readTower = function (fR, which, tower, gate, extra) {
		try {
			var lo = fR.label.hasIndexOf('lo'), // Match loe or lom lands
				yourlo = lo && which == 'your',
				towerList = lo ? Object.keys(fR[which].towers) : fR.label == 'gb10' ? ['1'] : ['1','2','3','4'],
				typeList = lo ? [which] : ['your','enemy'],
				tR = new gb.towerRecord().data, // tower record
				gf = gb[fR.label], 
				mR = {}, // member record
				towerType = '',
				isMe = false,
				wl = fR.your.health > fR.enemy.health + 20 || fR.enemy.health > fR.your.health + 20,
				idList = $u.setContent($j.makeArray(gate.find(gf.idTag).map(function() {
					return $j(this).attr(gf.idTag.regexd(/(onclick)/, 'id')).regex(/_(\d+)/);
				})),$j.makeArray(gate.find('div[id^="action_panel_"][id$="_0"]').map(function() {
					return $j(this).attr('id').regex(/_(\d+)/);
				}))),
				argReg = $u.setContent(gf.reg, /\d\d?\. (.*?) Level: (\d+) Status: (\w+) ([\d\.]+)\/(\d+)(?: Battle Points: )?(\d+)?/g),
				argList = $u.setContent($u.setContent(gate.text(), '').trim().innerTrim().regex(argReg),[]),
				pics = [],
				picsList = [],
				picsText = $j.makeArray(gate.find('img[src*="."], input[src*="."]').map(function() {
					return $j(this).attr('src').regex(/(\w+\.\w+)$/); 
				})).join(' ') + ' w.w class_w.gif',
				noSwap = !picsText.hasIndexOf('wall_move_icon.jpg'),
				n = 0,
				args = [],
				notArg = false,
				img = '',
				bR = {}, // battle record
				big = {level: 0}, // highest level in tower
				scoring = yourlo && fR.label == 'loe' ? config.getItem(gb.lom.scoring,'') : config.getItem(gf.scoring,''),
				normal = [],
				seal = {},
				sOrN,
				nsList = ['normal', 'seal'],
				total = 0,
				sealCheck = false,
				fullText = '',
				gO = {}, // general object
				pO = {}, // Object to hold all of the powers and target information for scoring for all attacks
				pOa = {}, // Link to the specific attack portion of pO
				damage = 0,
				idsOk = idList.length == argList.length || idList.length + 1 == argList.length;
				
			// Format the tower seal/normal
			tR.last = Date.now();
			fR[which].towers[tower] = tR;

			nsList = fR.me.mclass == 'cleric' ? ['normalnormal','sealseal','sealnormal','normalseal'] : ['normal', 'seal'];
			nsList.forEach( function(ns) {
				tR[ns] = {stunned: {score : 0}, unstunned: {score : 0}};
			});

			if (!idsOk && which == 'enemy') {
				con.warn(fR.label + ': Unable to parse ' + which + ' tower ' + tower + ' because FB ID list and opponents text number differ', idList, argList);
				return;
			}

			// Scan the data for each member for the tower 
			argList.forEach( function(args, i) {
				mR = new gb.member().data;
				if (idsOk) {
					mR.target_id = $u.hasContent(idList) ? idList.shift() : 0;
				}

				pics = $u.setContent(picsText.regex(/(.*?\w+\.\w+ class_\w+\.gif.*?) \w+\.\w+ class_\w+\.gif/), '').trim().split(' ');
				picsList.push(pics);
				picsText = picsText.replace(pics.join(' '), '').trim();

				if (!$u.hasContent(pics) || !args || args.length != 6) {
					con.warn(fR.label + ': Unable to read info ' + which + ' tower ' + tower + ' id ' + mR.target_id, pics, args);
					return false;
				}
				n = i + 1;
				['name', 'level', 'status', 'healthNum', 'healthMax', 'battlePoints'].forEach( function(e) {
					mR[e] = args.shift();
				});
				mR.name = mR.name.trim();
				mR.mclass = pics.listMatch(/class_(\w+)\.gif/);
				tR.clerics += mR.mclass == 'cleric' ? 1 : 0;
				mR.points = ['160', '200', '240'][['low','mid','high'].indexOf($u.setContent(pics.listMatch(/guild_bp_(\w+)\.jpg/), 'low'))];
				mR.percent = ((mR.healthNum / mR.healthMax) * 100).dp(2);

				tR.players += 1;
				tR.actives += mR.battlePoints > 0 ? 1 : 0;
				tR.AC += (mR.battlePoints > 0 && mR.mclass == 'cleric') ? 1 : 0;
				tR.healthNum += $u.isString(mR.healthNum) ? mR.healthNum.parseFloat() : mR.healthNum;
				tR.healthMax += mR.healthMax;
				mR.isMe = mR.target_id == stats.FBID ? true : 
					which == 'your' && mR.name == stats.PlayerName && (mR.level == stats.level || mR.level + 1 == stats.level);
				fR.me.tower = mR.isMe ? tower : fR.me.tower;
				if (mR.isMe && n + idList.length < argList.length) {
					idList.unshift(mR.target_id.toString());
					mR.target_id = stats.FBID;
				}
				if (mR.level > big.level) {
					big = mR;
				}
				fR[which].members[tower + '-' + n] = mR;
			});
				
			tR.damage = tR.healthMax - tR.healthNum;
			tR.life = (tR.healthNum/tR.healthMax * 100).dp(1);
			
			// See if all towers have been scanned, and check which tower is the current seal tower
			fR.firstScanDone = true;
			fR[which].towers[tower] = tR;

			typeList.forEach(function(fwhich) {
				var maxDamage = 0,
					maxTower = 0;
					
				towerList.forEach(function(fTower) {
					tR = fR[fwhich].towers[fTower];
					if ($u.isObject(tR)) {
						if ($u.isNumber(tR.damage) && tR.damage > maxDamage + 5000 && tR.healthNum > 0) {
							maxDamage = tR.damage;
							maxTower = fTower;
						}
					} else {
						fR.firstScanDone = false;
					}
				});
				fR[fwhich].seal = maxTower;
			});
			
			tR = fR[which].towers[tower];
			
			// Cycle through all of the possible attacks
			(lo ? ['mage','warrior','rogue','cleric'] : [fR.me.mclass]).forEach( function(mclass) { 
				gb[which][mclass].forEach(function(att) {
					fullText = scoring.regex(new RegExp("\\b" + att.name + "(\\[.*?)\\]"));
					img = $u.setContent(att.image, att.name);
					
					if (yourlo && !extra.listMatch(new RegExp('(' + img + ')'))) {
						return;
					}
					// Confirm which general has necessary power
					gO = general.getRecord($u.setContent($u.setContent(fullText, '').regex(/@([^,]+)/), 'Use Current'));
					gO = yourlo || gO.powers.hasIndexOf(img) ? gO : general.getRecordByField('powers', new RegExp(img));
					if (!fullText || !gO || !picsList.length || picsList[0].hasIndexOf('guild_power_locked.jpg') ||
						(att.name == 'swap' && noSwap)) {
						return;
					}
					
					fR[which].attacks.addToList(att.name);
					
					// Define powers object to hold data for scoring
					pO[att.name] = {healths: [0, 0], // Add padding to beginning for fireball/mass_heal
						mRs : [],
						normal : [],
						seal : [],
						gO : gO,
						bases : [],
						splash: {},
						splashMax: 0,
						att : att};
						
					pOa = pO[att.name];
					
					pOa.wc = fullText.match(/\bwc\b/);
					
					// Cycle through all tower members to score the attacks, for both normal and seal
					picsList.forEach( function(pics, i) {
						mR = fR[which].members[tower + '-' + (i + 1)];

						bR = battle.getRecord(mR.target_id);
						bR.level = mR.level;
						
						fR.att = fR.att || stats.bonus.api;
						mR.winChance = mR.poly ? 100 : battle.winChance(bR, (att.name == 'confuse' ? 1.5 : att.name == 'poly' ? 1.25 : 1) *
							fR.att, pics.hasIndexOf('mage_effect_enrage.gif') || pics.hasIndexOf('cleric_effect_divine_favor.gif') ? 1.25 : 0);
						
						if (!(stats.guild.powers).regex(img)) {
							return;
						}
						towerType = fR.label == 'gb100' && $u.isArray(extra) && extra.length ? extra[tower - 1].toLowerCase() : false;
						if ($u.isBoolean(att.self) && att.self !== mR.isMe) {
							return;
						}
						// First number is for multipliers, second is added
						normal = { t: 1, p: 0}; // t is for times, p is for plus
						sealCheck = false;
						
						// Cycle through the modifiers for the attack
						$u.setContent(fullText.match(/(!?\w+:\D?[^,]+)/g),[]).forEach( function(text) {
							var key = text.replace(/:.*/,'').replace('!','').toLowerCase(),
								tf = false;
							switch (key) {
								case 'big' :		tf = mR.target_id == big.target_id;									break;
								case 'out' :		tf = fR.me.mclass == 'cleric' && fR.your.seal == tower && 
														fR.your.towers[tower].life < 66;								break;
								case 'in' :		tf = fR.me.mclass != 'cleric' && fR.your.seal == fR.me.tower && 
														fR.your.towers[fR.me.tower].life < 66;							break;
								case 'base' :		tf = true;															break;
								case 'cleric' :
								case 'rogue' :
								case 'warrior' :
								case 'mage' :		tf = key == mR.mclass;												break;
								case 'l900' :		tf = mR.level > 900;												break;
								case 'l600' :		tf = mR.level > 600 && mR.level <= 900;								break;
								case 'l300' :		tf = mR.level > 300 && mR.level <= 600;								break;
								case 't1' :
								case 't2' :
								case 't3' :
								case 't4' :			tf = tower == key.numberOnly();										break;
								case 'keep' :
								case 'wall' :
								case 'assault' :
								case 'church' :
								case 'arcane' :
								case 'barricade' :	
								case 'elemental' :	
								case 'null' :	
								case 'gate' :	
								case 'sewer' :		tf = towerType == key;												break;
								case 'poly' :		tf = pics.hasIndexOf('polymorph_effect.gif');						break;
								case 'poison' :		tf = pics.hasIndexOf('rogue_effect_poison.gif');					break;
								case 'confuse' :	tf = pics.hasIndexOf('mage_effect_confuse.gif');					break;
								case 'guardian' :	tf = pics.hasIndexOf('warrior_ability_sentinel.gif');				break;
								case 'revive' :		tf = pics.hasIndexOf('cleric_effect_revive.gif');					break;
								case 'shout' :		tf = pics.hasIndexOf('warrior_effect_shout.gif');					break;
								case 'confidence' : tf = pics.hasIndexOf('warrior_effect_confidence.gif');				break;
								case 'fortify' :	tf = pics.hasIndexOf('cleric_effect_fort.gif');						break;
								case 'smokebomb' :	tf = pics.hasIndexOf('rogue_effect_smoke.gif');						break;
								case 'enrage' :		tf = pics.hasIndexOf('mage_effect_enrage.gif');						break;
								case 'divine_favor': tf = pics.hasIndexOf('cleric_effect_divine_favor.gif');			break;
								case 'attack' :		tf = pics.hasIndexOf('targetting_attack.png');						break;
								case 'avoid' :		tf = pics.hasIndexOf('targetting_avoid.png');						break;
								case 'defend' :		tf = pics.hasIndexOf('targetting_defend.png');						break;
								case 'healFlag' :	tf = pics.hasIndexOf('targetting_heal.png');						break;
								case 'me' :			tf = isMe;															break;
								case 'active' :		tf = mR.battlePoints;												break;
								case 'bs' :			tf = mR.healthNum == mR.healthMax;									break;
								case 'healed' :		tf = mR.healthMax - mR.healthNum < 300;								break;
								case '100v100' :	
								case 'classic' :	
								case '10v10' :		tf = gf.name.toLowerCase() == key;									break;
								case 'easy' :		tf = fR.easy;														break;
								case 'easyc' :		tf = fR.easy && mR.mclass == 'cleric';								break;
								case mR.target_id.toString() : tf = true;												break;
								case 'simtis' :		tf = fR.simtis;														break;
								case 'unstunned' :	tf = mR.healthNum > 200;											break;
								case 'meshout' :	tf = fR.me.shout;													break;
								case 'afflicted' :
								tf = pics.hasIndexOf('polymorph_effect.gif') || pics.hasIndexOf('rogue_effect_poison.gif') || pics.hasIndexOf('mage_effect_confuse.gif');	break;
								case 'p160' :		
								case 'p200' :		
								case 'p240' :		tf = mR.points == key.numberOnly();									break;
								case 'wlp160' :
								case 'wlp200' :
								case 'wlp240' :		tf = mR.points == key.numberOnly() && wl;							break;
								case 'seal' :
									tf = true;
									sealCheck = true;
									seal = {t: normal.t, p: normal.p};
									break;
								default :			
									if (!(/\d+/).test(key)) {
										con.log(1, 'Unknown guild battle modifier: ' + key, fullText, att);
									}
									break;
							}

							args = text.match(new RegExp('(!?)' + key + ':(\\*?)(-?)([\\.\\d]+)'));
							
							notArg = (args[1] == '!');
							tf = tf == true;
							if (args && args.length == 5 && tf !== notArg) { 
								normal[args[2] == '*' ? 't' : 'p'] += args[3] == '-' ? -args[4].parseFloat() : args[4].parseFloat();
							}
							if (sealCheck === true) {
								sealCheck = args[1] == '!' ? 'normal' : 'seal';
								seal = {t: normal.t - seal.t, p: normal.p - seal.p};
								normal = { t: normal.t - seal.t, p: normal.p - seal.p};
							}
						});

						// Fill out the powers object for scoring in the next cycle
						pOa.healths.push(which == 'your' ? mR.healthMax - mR.healthNum : mR.healthNum);
						pOa.mRs.push(mR);

						// Store the normal and seal values according to whether sealcheck was modifying a normal or seal
						['normal','seal'].forEach(function(ns) {
							pOa[ns].push(ns == sealCheck ? { t: normal.t + seal.t, p: normal.p + seal.p} : { t: normal.t, p: normal.p});
						});
						
						// Base is the same for all attacks on a given enemy. Placed here to make sure has same index as other pOa items
						var poison =  pics.hasIndexOf('rogue_effect_poison.gif'),
							guardian = pics.hasIndexOf('warrior_ability_sentinel.gif'),
							bonus = gb.gs(gO, /([\d\.]+) Damage, \+[\d\.]+% Damage/);

						pOa.bases.push(which == 'enemy' ?
							Math.max(0,(mR.mclass == 'rogue' ? 0.65 : 1) *
								(110 * $u.setContent(att.tokens, 1) + stats.rune.damage	*
									(1 + (Math.floor(bonus / 2) / 100	+ poison * 0.1 - guardian * 0.15 + fR.me.shout * 0.09))) +
								bonus + fR.me.shout * 9 + poison * 35 - guardian * 215).dp() : 0).dp();

					}); // End of members loops for scoring
					
					// Add padding of zeros on either side of the healths array for fireball/mass heals
					pOa.healths = pOa.healths.concat([0, 0]);

					// Splash damage calcs
					if (att.mageSplash) { // Need to update this to account for mage base damage bonuses
						pOa.splashMax = (Math.min(stats.rune.damage, 500) * 0.1 + 10) * 0.1 *
							(gb.gs(gO, /([\d\.]+)% damage to Mage/) / 100 + 1);
					} else if (att.healSplash) {
						if (which == 'enemy') {
							if ($u.isDefined(fR.healSplash[att.name])) {
								pOa.splash = fR.healSplash[att.name];
							}
						} else if (tower == fR.me.tower) {
								pOa.splashMax = gb.gs(gO, /([\d\.]+)% heal to Cleric/);
								pOa.splashMax = (Math.min(stats.rune.health, 500) * 0.1 + 10 + Math.floor(pOa.splashMax / 2)) * (pOa.splashMax / 100 + 1);
						}
					}
					if (pOa.splashMax) {
						// Total splash damage for tower
						['normal','seal'].forEach(function(ns) {
							pOa.splash[ns] = {p: [], t: [], d: []};
							pOa.healths.forEach( function(h, i) {
								damage = Math.min(h, pOa.splashMax.dp()); 
								if (damage) {
									pOa.splash[ns].p.push(damage * pOa[ns][i - 2].p);
									pOa.splash[ns].t.push(damage * pOa[ns][i - 2].t);
									pOa.splash[ns].d.push(damage);
								}
							});
							['p', 't', 'd'].forEach(function(e) {
								pOa.splash[ns][e] = [pOa.splash[ns][e].sum()];
							});
						});
						// If we're reading cleric splash, record the splash and delete the attack from valid attacks.
						if (att.healSplash) {
							fR.healSplash[att.name] = pOa.splash;
						}
						
					}
					if (att.healSplash && which == 'your') {
						fR[which].attacks.removeFromList(att.name);
						delete pO[att.name];
					}
					
				}); // End of attacks loop
				
			}); // End of classes loop
					
			// Third cycle, to calculate final score based on weighted average of all targets hit by an attack for a composite score.
			//  Picslist used as convenient index
			
			$j.each(pO, function(attName, pOa) {
				pOa.mRs.forEach( function(mR, i) {
					mR.scores[attName] = {};
						
					nsList.forEach(function(ns) {
						if (!pOa.att.healSplash && ['sealnormal','normalseal'].hasIndexOf(ns)) {
							sOrN =  tower == fR[which].seal && ns == 'normalseal' ? 'sealseal' : 'normalnormal';
							mR.scores[attName][ns] = mR.scores[attName][sOrN];
							tR[ns].unstunned = tR[sOrN].unstunned;
							tR[ns].stunned = tR[sOrN].stunned;
							return;
						}
						total = (pOa.wc ? gb.otherCalc(fR, pOa, i, ns, mR.winChance) : pOa.att.score(fR, pOa, i, ns, mR)).dp(2);
						total = mR.healthNum >= (which == 'your' ? gf.minHealth : 1) ? total : 0;
						mR.scores[attName][ns] = total;
						gb.target(tR[ns].unstunned, total, mR, pOa, which, tower);
						if (which == 'enemy' && attName.regex(/duel/)) {
							gb.target(tR[ns].stunned, total, mR, pOa, which, tower);
						}
					});
				}); // End of pOa loop
			}); // End of pO loop
			
			pO = null;
			pOa = null;

			// Delete members that may be left over from previous battles
			Object.keys(fR[which].members).forEach( function(k) {
				n = $u.setContent(k.regex(new RegExp(tower + '-(\\d+)'), 0));
				if (n > argList.length + 1) {
					delete fR[which].members[tower + '-' + n];
				}
			});

			return null;
        } catch (err) {
            con.error("ERROR in gb.readTower: " + err.stack);
            return false;
        }
    };
	
	gb.r100 = function(n) {
		return Math.atan(n/1000)/Math.PI*2*100;
	};
	
	gb.worker = function () {
        try {
			var fR = {},
				result = false,
				order = ['gb100', 'gb10', 'gbClassic', 'gb100', 'gb10'],
				configSet = false;
			
			stats.battleIdle = 'Use Current';
			['gb100', 'gb10', 'gbClassic'].forEach( function(label) {
				var gbName = gb[label].name;
				fR = gb.getRecord(label);
				if (config.getItem(gbName + '_ClassGeneral','Use Current') != 'Use Current' && 
					((schedule.since(fR.startTime, -11 * 60) && !schedule.since(fR.startTime, -1 * 60))
						|| fR.state == 'Auto-match')) {
					stats.priorityGeneral = config.getItem(gbName + '_ClassGeneral','Use Current');
					result = gbName;
				}
				stats.battleIdle = fR.state == 'Active' ? config.getItem('GB_IdleGeneral','Use Current') : 'Use Current';
			});
			
			if (result) {
				caap.passThrough({mess: 'Setting Class General'}, result);
				if (general.selectSpecific(stats.priorityGeneral)) {
					return {log: result + ': Setting Class General' + stats.priorityGeneral};
				}
			}

			return order.some( function(label) {
				configSet =  config.getItem(label + 'whenTokens') != 'Never' ||
					config.getItem(gb[label].name + '_ClassGeneral', 'Use Current') != 'Use Current' ||
					config.getItem(label + 'collect', false);
					
				if (configSet) {
					fR = gb.getRecord(label);
					result = caap.passThrough(gb.workCommon(fR), gb[label].name.toLowerCase());
					gb.setRecord(fR);
					if (gb[label].name == 'Classic') {
						state.setItem('GB_Active', result);
					}
					if (result) {
						return true;
					}
				}

			});
        } catch (err) {
            con.error("ERROR in guildBattle: " + err.stack);
            return false;
        }
    };

	gb.workCommon = function (fR) {
		try {
			var gf = gb[fR.label],
				neverTokens = config.getItem(gf.label + 'whenTokens', 'Never') == 'Never',
				result = '',
				priority = schedule.since(fR.endTime, -8 * 60 ) || fR.your.health < 10,
				stun = fR.me.healthNum <= gf.minHealth ? 'stunned' : 'unstunned',
				wait = stun == 'stunned' || fR.me.poly || 
					(fR.me.confuse && fR.your.attacks.indexOf('cleanse') < 0 && fR.your.attacks.indexOf('dispel') < 0),
				tokenMax = wait ? 8 : config.getItem(gf.label + 'max', 10),
				burn = fR.tokens <= (wait ?  tokenMax - 2 : config.getItem(gf.label + 'min', 0)) 
					? false :  fR.burn || fR.tokens >= tokenMax,
				useTokens = priority || burn,
				doAttack = fR.state == 'Active' && useTokens && fR.tokens,
				teams = stun == 'stunned' ? ['enemy'] : ['your','enemy'],
				towers = gf.name == '10v10' ? ['1'] : ['1','2','3','4'],
				t = { score: 0, tokens: 1 },
				message = schedule.since(fR.collectedTime, gf.waitHours * 60 * 60) ? 'Uncollected, ' : 'Collected, ';
				
			fR.burn = burn;
			
			switch (fR.state) {
			case 'Collect' :
				if (message.hasIndexOf('Uncollected') && config.getItem(gf.label + 'collect',false) && !(caap.gameDay(-2 * 60) == 'Mon' &&
					caap.gameDay(gf.collectHours * 3600, (gf.name == 'Classic' ? fR.lastBattleTime : fR.endTime)) == 'Tue')) {
					page.ajax(gb.path(fR, '&action=collect_battle'), stats.exp.dif < 60 ? 'Level_UpGeneral' : '');
					return {mlog: 'Collecting'};
				}
				break;
				
			case 'No battle' :
				break;
				
			case 'Check ID' :
				page.ajax(gf.name == 'Classic' ? 'guildv2_battle' : 'index');
				return {mlog: 'Checking index page battle status'};
				
			case 'Start' :  // Only true for Classic battles
				if (gb.checkTimes()) {
					return {mlog: 'Clicking button for auto-match'};
				} 
				if (config.getItem('Classic_ClassGeneral', 'Use Current') != 'Use Current' && schedule.since(fR.nextTopReview, 5 * 60)) {
					page.ajax('guildv2_battle');
					return {mlog:'Checking for auto-match to set general'};
				}
				message += 'ready to start next battle, ';
				break;
				
			case 'Auto-match' :
				message += 'auto-match button pushed, ';
				break;
				
			case 'Active' :
				message = schedule.since(fR.lastBattleTime, gf.waitHours * 60 * 60) ? 'Not entered, ' 
					: fR.tokens + '/10 ' + fR.me.status + ', ';
				if (gf.name != 'Classic' && state.getItem('GB_Active', false) && !priority) {
					return {action: false, mess: message + 'waiting on Classic'};
				}
				if (!neverTokens) {
					if (message.hasIndexOf('Not entered')) {
						if (stats.stamina.num >= gf.stamina) {
						page.ajax(gb.path(fR, '&action=enter_battle'));
							return {mlog: 'Entering battle'};
						}
						return {action: false, mess: message + 'waiting on stamina'};
					}
					teams.some(function(which) {
						towers.some(function(tower) {
							var tR = $j.extend(new gb.towerRecord().data, fR[which].towers[tower]),
								filter = which != 'enemy' || tower != '1';
								
							fR[which].towers[tower] = tR;
								
							if (schedule.since(tR.last, 5 * 60) && (!fR.firstScanDone || !filter || doAttack)) {
								if (stats.priorityGeneral == 'Use Current' && general.Select(stats.battleIdle)) {
									result = {mlog: fR.tokens + '/10, setting idle general'};
									return true;
								}
								page.ajax(gb.path(fR, '', which, tower));
								result = {mlog: fR.tokens + '/10 ' + fR.me.status + ', reviewing towers'};
								return true;
							}
						});
						if (result) {
							return true;
						}
					});
					if (result) {
						return result;
					}
				}
				break;
			}

			if (fR.state != 'Active') {
				if (schedule.since(fR.nextTopReview, 5 * 60)) {
					page.ajax('index');
					return {mlog: 'Checking index page battle status'};
				}
				return {action: false, mess: message + 'next check: ' + $u.makeTime(fR.nextTopReview + 5 * 60 * 1000, caap.timeStr(true))};
			}

			if (stats.priorityGeneral != 'Use Current') {
				return {action: false, mess: 'Waiting on priority general: ' + stats.priorityGeneral};
			}
			
			if (neverTokens) {
				return false;
			}
			
			if (doAttack) {
				teams.forEach(function(which) {
					towers.forEach(function(tower) {
						var seal = fR.me.mclass != 'cleric' ? (tower == fR[which].seal ? 'seal' : 'normal') :
							which == 'your' ? 'normal' + (tower == fR.your.seal ? 'seal' : 'normal') :
							(tower == fR.enemy.seal ? 'seal' : 'normal') + (fR.me.tower == fR.your.seal ? 'seal' : 'normal');
						if (!$u.hasContent(fR[which].towers[tower])) {
							con.warn('Skipping ' + which + ' ' + tower + ' because unable to complete reading.', fR);
						} else if (fR[which].towers[tower][seal][stun].score > t.score && fR[which].towers[tower][seal][stun].tokens <= fR.tokens) {
							t = fR[which].towers[tower][seal][stun];
						}
					});
				});
				
				fR.t = t;
				if (!t.score) {
					return {action: false, mess: message + 'no valid target'};
				}
				
				if (!general.hasRecord(t.general.replace('@',''))) {
					t.general = 'Use Current';
				}
				
				result = caap.navigate2(t.general + ',ajax:' + gb.path(fR, '', t.which, t.tower) + ',clickjq:.action_panel_' 
					+ t.id + ' input[src*="' + t.attack + '.jpg"]');
				if (result == 'fail') {
					page.ajax('player_loadouts.php?loadout=' + general.getRecordVal(general.loadout, 'value') + '&selection=4');
					return {mlog: message + t.attack + ' failed on ' + t.which + ' T' + t.tower + ' ' + t.name
						+ ' Checking ' + general.loadout + ' has ' + t.attack};
				} 
				if (result == 'done') {
					battle.setRecordVal(t.id, 'level', t.level);
					state.setItem('lastBattleID', t.id);
					fR.t = false;
				}
				return {mlog: message + t.attack + ' on ' + t.which + ' T' + t.tower + ' ' + t.name};
			}
			return {action: false, mess: message + 'waiting for ' + tokenMax + ' tokens'};
			
        } catch (err) {
            con.error("ERROR in gb.work:" + err.stack);
            return false;
        }
    };

	// guild battle path -- provides the path to the top page of the guild battle
	gb.path = function(fR, suffix, which, tower) {
        try {
			if (!$u.isObject(fR)) {
				con.warn('Invalid gb.path input', which, tower);
				return false;
			}
			var gf = gb[fR.label],
				path = $u.isDefined(suffix) ? gf.actionUrl : gf.towerUrl;
				
			if (gf.label == 'loe') {
				return gf.topUrl + $u.setContent($u.setContent(tower,'').regex(/(\w+):\d/), which) + '&slot=0';
			}
			if (gf.label == 'lom') {
				return 'ajax:guildv2_conquest_expansion.php?guild_id=' + stats.guild.id + '&slot=' + (tower.numberOnly() + 1);
			}
			
			path = path.replace('battle_id=', 'battle_id=' + fR.battle_id);
			path = path.replace('attacker_guild_id=', 'attacker_guild_id=' + fR.attacker_guild_id);
			path = path.replace('defender_guild_id=', 'defender_guild_id=' + fR.defender_guild_id);
			
			if (path.hasIndexOf('battle_id=&')) {
				return 'index';
			}
			if (path.hasIndexOf('attacker_guild_id=&') || path.hasIndexOf('attacker_guild_id=null&')) {
				return gf.name == 'Classic' ? 'guildv2_battle' : gf.towerUrl.replace('battle_id=', 'battle_id=' + fR.battle_id);
			}
			if (path.hasIndexOf('defender_guild_id=&')) {
				return 'keep';
			}

			if ($u.isDefined(which)) {
				if (which == 'your') {
					path += '&view_allies=true';
				}
				if ('1234'.hasIndexOf(tower.toString())) {
					path += '&sel_pos=' + tower;
				}
			}
			return path + $u.setContent(suffix, '');
        } catch (err) {
            con.error("ERROR in gb.path: " + err.stack);
            return false;
        }
    };
	
    gb.target = function(t, total, mR, pOa, which, tower) { //t, total, mR, attack, general, team, tower, tokens
        try {
			if (total > t.score) {
				t.score = total;
				t.tokens = $u.setContent(pOa.att.tokens, 1);
				t.healSplash = pOa.att.healSplash;
				t.attack = pOa.att.image || pOa.att.name;
				t.general = '@' + pOa.gO.name;
				t.id = mR.target_id;
				t.name = mR.name;
				t.level = mR.level;
				t.which = which;
				t.tower = tower;
			}
			return null;
        } catch (err) {
            con.error("ERROR in gb.team: " + err.stack);
            return false;
        }
    };
	
    gb.checkTimes = function() {
        try {
			var begin = new Date(),
				end = new Date(),
				timeString = '',
				timeBattlesList = config.getList('timed_guild_battles', ''),
				timedSetting = config.getItem('WhenGuildBattle', ''),
				match = (timedSetting === 'Battle available') ? true : false,
				now = new Date();
				
			if (timedSetting=='Never') {
				return false;
			}
			// Next we step through the users list getting the name and conditions
			timeBattlesList.some( function(t) {
				if (!t.toString().trim()) {
					return false;
				}
				timeString = t.toString().trim();
				begin = 0;
				caap.weekdays.some( function(w, i) {
					if (timeString.indexOf(w)>=0) {
						begin = general.parseTime(timeString);
						end = general.parseTime(timeString);
						begin.setDate(begin.getDate() + i - now.getDay()); // Need to check on Sunday case
						end.setDate(end.getDate() + i - now.getDay()); // Need to check on Sunday case
						end.setMinutes(end.getMinutes() + 2 * 60);
						return true;
					}
				});
						
				if (!begin) {
					con.log(4, 'No day of week match', now.getDay(), timeString);
					return false;
				}
				con.log(4,'begin ' + $u.makeTime(begin, caap.timeStr(true)) + ' end ' + $u.makeTime(end, caap.timeStr(true)) + ' time ' + $u.makeTime(now, caap.timeStr(true)), begin, end, now);
				
				if (begin < now && now < end) {
					match = true;
					con.log(4, 'Valid time for begin ' + $u.makeTime(begin, caap.timeStr(true)) + ' end ' + $u.makeTime(end, caap.timeStr(true)) + ' time ' + $u.makeTime(now, caap.timeStr(true)), begin, end, now, timeString);
					return true;
				}
			});
			if (match) {
				stats.priorityGeneral = config.getItem('Classic_ClassGeneral','Use Current') == 'Use Current' ? 'Use Current' : config.getItem('Classic_ClassGeneral','Use Current');
				return caap.navigate3('guildv2_battle.php', 'guildv2_battle.php?action=auto_attack&guild_page=1&guild_battle=true', stats.priorityGeneral);
			}

        } catch (err) {
            con.error("ERROR in gb.checkTimes: " + err.stack);
            return false;
        }
    };

    gb.menu = function() {
        try {
            // Guild Battle controls
            var gbattleList = ['Battle available', 'At fixed times', 'Never'],
                gbattleInst = [
                    'Battle available will initiate a guild battle whenever the Start Button is available',
                    'At fixed times will allow you to set a schedule of when to start battles',
                    'Never - disables starting guild battles'
                ],
                tokenList = ['Over', 'Between Max Min', 'Never'],
                tokenInst = [
                    'Over - join battles and attack whenever your tokens are over the max',
                    'Between Max/Min - join battles and burn tokens once over max until just over min',
                    'Never - disables attacking in this battle'],
				tokenRange = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
				timed_guild_battles_inst = "List of times when Guild Battles should be started, such as 'Mon 1, Tue 15:30, Wed 8 PM, etc.  Guild battle will be attempted to be started at the listed time and up to two hours after.",
				guild_battle_scoring_inst = "List of score adjustments to pick targets",
                htmlCode = '';

            htmlCode += caap.startToggle('GuildBattles', 'GUILD BATTLES');

			[gb.gbClassic,gb.gb100,gb.gb10].forEach(function(gf) {
				htmlCode += caap.makeDropDownTR(gf.name + " Use tokens", gf.label + 'whenTokens', tokenList, tokenInst, '', 'Never', false, false, 62);
				htmlCode += caap.display.start(gf.label + 'whenTokens', 'isnot', 'Never');
				htmlCode += caap.makeDropDownTR(gf.name + " Max", gf.label + 'max', tokenRange, [], '', '8', false, false, 62);
				htmlCode += caap.display.start(gf.label + 'whenTokens', 'is', 'Between Max Min');
				htmlCode += caap.makeDropDownTR(gf.name + " Min", gf.label + 'min', tokenRange, [], '', '0', false, false, 62);
				htmlCode += caap.display.end(gf.label + 'whenTokens', 'is', 'Between Max Min');
				htmlCode += caap.display.end(gf.label + 'whenTokens', 'isnot', 'Never');
				htmlCode += caap.makeCheckTR(gf.name + " Auto-collect", gf.label + 'collect', false, 'Auto-collect when these battles finish');
			});

            htmlCode += caap.makeTD("Rate targets by: <a href='http://caaplayer.freeforums.org/viewtopic.php?f=9&t=830' target='_blank' style='color: blue'>(INFO)</a>");
            htmlCode += caap.makeTextBox('guild_battle_scoring', guild_battle_scoring_inst, 'cduel[],mduel[],wduel[],rduel[]', '');
            htmlCode += caap.makeDropDownTR("Start Guild Battles when", 'WhenGuildBattle', gbattleList, gbattleInst, '', 'Never', false, false, 62);
            htmlCode += caap.display.start('WhenGuildBattle', 'is', 'At fixed times');
            htmlCode += caap.makeTD("Start Guild Battles at these times:");
            htmlCode += caap.makeTextBox('timed_guild_battles', timed_guild_battles_inst, '', '');
            htmlCode += caap.display.end('WhenGuildBattle', 'is', 'At fixed times');
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in gb.menu: " + err.stack);
            return '';
        }
    };

	gb.dashboard = {
		name: 'Classic',
		inst: 'Display the current Classic Guild battle',
		records: 'gb',
		gbLabel : 'gbClassic',
		buttons: [{name: 'Opponent',
			func: function() {
				if (config.getItem('gbDashWhich', 'enemy') != 'enemy') {
					config.setItem('gbDashWhich', 'enemy');
					caap.updateDashboard('force');
				}
		}},
		{name: 'Your Guild',
			func: function() {
				if (config.getItem('gbDashWhich', 'enemy') != 'your') {
					config.setItem('gbDashWhich', 'your');
					caap.updateDashboard('force');
				}
		}}],
		headerF: function(fR) {
			var which = config.getItem('gbDashWhich', 'enemy'),
				towerHtml = '';
				
			['1','2','3','4'].forEach( function(p) {
				var tower = fR[which].towers[p];
				if (!tower) {
					return;
				}
				towerHtml += 'Tower ' + p + ' Toons:' + tower.players + '  Active: ' + tower.actives + ' Clerics: ' + tower.clerics + ' Active Clerics: ' + tower.AC + ' Health Life%: ' + tower.life + '<br>';
			});
			return towerHtml;
		},
		tableEntriesF: function(fR) {
			var which = config.getItem('gbDashWhich', 'enemy'),
				actions = fR[which].attacks.map( function(a) {
					return {name: a, 
						colorF: function(r) {
							return $u.hasContent(fR.t) && $u.hasContent(fR.t.id) && r.target_id == fR.t.id ? 'green' : 'black';
						},
						valueF: function(r, key) {
							var seal = fR.me.mclass != 'cleric' ? (key.replace(/-.*/,'') == fR[which].seal ? 'seal' : 'normal') :
								which == 'your' ? 'normal' + (key.replace(/-.*/,'') == fR.your.seal ? 'seal' : 'normal') :
								(key.replace(/-.*/,'') == fR.enemy.seal ? 'seal' : 'normal') +
									(fR.me.tower == fR.your.seal ? 'seal' : 'normal');
							return $u.hasContent(r.scores) && $u.hasContent(r.scores[a]) && $u.hasContent(r.scores[a][seal]) ?
									r.scores[a][seal] : -1;
					}};
				});
			return gb.dashboard.tableEntries.slice(0,2).concat(actions).concat(gb.dashboard.tableEntries.slice(2));
		},
		tableEntries: [
			{name: 'Index',
				valueF: function(r, i) {
					ignoreJSLintError(r);
					return i;
			}},
			{name: 'Name',
				valueF: function(r) {
					return '<a href="' + caap.domain.altered + '/keep.php?casuser=' + r.target_id +
						'" onclick="ajaxLinkSend(\'globalContainer\', \'keep.php?casuser=' + r.target_id +
						'\'); return false;" style="text-decoration:none;font-size:9px;color:blue;">' +
						r.name + '</a>';
			}},
			{name: 'Class', value: 'mclass'},
			{name: 'Level'},
			{name: 'Health', value: 'healthNum'},
			{name: 'Max', value: 'healthMax'},
			{name: 'Status'},
			{name: 'Activity', value: 'battlePoints'},
			{name: 'Points'},
			{name: 'Win Chance', value: 'winChance'}
		]
	};
	
	worker.add({ name: 'gb100Dash'}); // Details of dash added in gb.init
	worker.add({ name: 'gb10Dash'}); // Details of dash added in gb.init

}());