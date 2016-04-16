/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global $j,gb,stats,worker,$u,caap,config,con,loe,
schedule,state,general,session,battle:true */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          LoE OBJECT
// this is the main object for dealing with Land of Earth
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

	worker.add('loe');
	
	gb.loe = {
		name: 'Land of Earth', // Used for user facing text
		label: 'loe', // Used for internal naming
		stamina: 0,
		enterButton: '',
		infoDiv: '',
		waitHours: 24,
		collectHours: 0,
		minHealth: 0,
		top : { enemy: 'guild_conquest_castle_battlelist',
				your : 'index'},
		scoring : 'loeScoring',
		basePath: 'ajax:guildv2_conquest_expansion.php?guild_id='
	};
	
	loe.checkResults = function(page, resultsText) {
        try {
			var fR = false,
				guild_id = '',
				haveBattle = false,
				towerDivs = $j(),
				which,
				check = false,
				pics,
				t;
			
			switch (page) {
			case 'index' :
				if ($u.hasContent($j('a[href*="guildv2_conquest_expansion.php?guild_id=' + stats.guild.id + '&slot=0'))) {
					con.log(2, 'LoE: in defense mode');
					fR = gb.getRecord('loe');
					gb.setrPage(fR, gb.makePath(gb.loe, stats.guild.id));
				}
				break;
			case 'guild_conquest_castle_battlelist' :
				fR = gb.getRecord('loe');
				
				// Add LoE lands current at war
				$j('img[src*="conq2_btn_attack.jpg"]').each(function() {
					guild_id = $j(this).closest('a').attr('href').regex(/guild_id=(\d+_\d+)/);
					if (!$u.isString(guild_id)) {
						con.warn('Loe guild id is undefined');
						return;
					}
					con.log(2, 'At war with guild id ' + guild_id, fR);
					gb.setrPage(fR, gb.makePath(gb.loe, guild_id));
				});
				
				// Delete any lands war is over with
				$j.each(fR.enemy.towers, function(tower) {
					guild_id = tower.regex(/([\d_]+):/);
					if (!$u.hasContent($j('a[href*="?guild_id=' + guild_id + '&"').find('img[src*="conq2_btn_attack.jpg"]'))) {
						con.log(1, 'LoE: War is over, so deleting battles with guild id ' + guild_id + ' tower ' + tower.regex(/:(\d)/));
						delete fR.enemy.towers[tower];
						gb.deleterPage(fR, gb.makePath(gb.loe, guild_id));
					}
				});
				gb.setRecord(fR);
				break;
				
			case 'guildv2_conquest_expansion' :
				
				guild_id = $u.setContent($j("img[src*='conq2_castle_defender_on.jpg']").closest('a').attr('href'), '').regex(/guild_id=(\d+_\d+)/);
				if (!$u.isString(guild_id)) {
					con.log(3, 'Loe guild id is undefined. Probably mist land.');
					return;
				}

				which = guild_id == stats.guild.id ? 'your' : 'enemy';
				fR = gb.getRecord('loe');
				session.setItem('gbWhich', fR.label);
				if (resultsText.regex(/Your guild is too (\w+) level to engage in this battle/)) {
					fR.state = 'No battle';
					gb.setRecord(fR);
					return;
				}
				battle.readWinLoss(resultsText, gb.winLoss);
				
				towerDivs = which == 'enemy' ? $j('#hover_tab_1_1').closest('.tower_tab').find('div[onmouseover*="hover_tab_1_"]') :
					$j('div[id^="tower_"]').not('[id*="fort"]').not('[id*="tab"]');
				
				towerDivs.each( function() {
					var powers = [];
					if (which == 'your') {
						if (!resultsText.hasIndexOf('The guild battle is over, you cannot commence this battle')) {
							pics = $j.makeArray($j(this).find('div[id^="action_panel"] form input[type="image"]').map(function() {
								return $j(this).attr('src').regex(/(\w+\.\w+)$/); 
							}));
							Object.keys(gb.your).forEach( function(classes) {
								gb.your[classes].forEach( function(att) {
									pics.forEach( function(p) {
										if (!att.healSplash && p.hasIndexOf($u.setContent(att.image, att.name))) {
											powers.addToList(p);
										}
									});
								});
							});
							check = powers.length;
						}
						t = $j(this).attr('id').regex(/tower_(\d)/);
					} else {
						check = $u.hasContent($j(this).find('div[title="Officer Tagged"]'));
						t = $j(this).attr('onmouseover').regex(/hover_tab_1_(\d)/);
					}
						
					if (check) {
						gb.readTower(fR, which, guild_id + ':' + t, $j('#tower_' + t), $u.setContent(powers, undefined));
						haveBattle = true;
					} else if ($u.isObject(fR[which].towers[guild_id + ':' + t])) { 
						con.log(1, 'LoE: No war, so deleting guild id ' + guild_id + ' tower ' + t + ' info');
						delete fR[which].towers[guild_id + ':' + t];
					}
				});
				if (haveBattle) {
					gb.setrPage(fR, gb.makePath(gb.loe, guild_id), 'review', Date.now());
				} else {
					gb.deleterPage(fR, gb.makePath(gb.loe, guild_id));
				}
				break;
				
			default :
				break;
			}
			if (fR) {
				gb.setRecord(fR);
			}

		} catch (err) {
            con.error("ERROR in loe.checkResults: " + err.stack);
            return false;
        }
    };
	
	loe.blueDay = function() {
		return ['Tue', 'Wed', 'Thu'].hasIndexOf(caap.gameDay());
	};
	
	loe.init = function() {
		try {
			var when = config.getItem('WhenLoE', 'Never');
			if (when == 'Always' || (when == 'Blue Crystals' && loe.blueDay())) {
				worker.addPageCheck({page : 'guild_conquest_castle_battlelist', hours : 1});
			}
		} catch (err) {
            con.error("ERROR in loe.init: " + err.stack);
            return false;
        }
	};
	
	loe.unpause = function() {
		worker.deletePageCheck('guild_conquest_castle_battlelist');
		loe.init();
	};
	
	loe.worker = function (which, land) {
        try {
			var isloe = land == 'loe',
				whenLoE = config.getItem('When' + (isloe ? 'LoE' : 'Guardian'), 'Never'),
				whenGuard = config.getItem('WhenGuardian', 'Never').regexd(/(\d+)/, 0),
				fR = gb.getRecord(land),
				gf = gb[fR.label], 
				stun = 'unstunned',
				mess = 'conquest_mess',
				stateMsg = '',
				t = {score : 0},
				result = false,
				seal = fR[which].seal ? 'seal' : 'normal',
				doLand = (fR.state == 'Active' || (which == 'enemy' && isloe)) && (which != 'your' || stats.conquest.Guardian < whenGuard) 
					&& (!isloe || (whenLoE != 'Never' && (whenLoE != 'Blue Crystals' || loe.blueDay())));
				
			if (!stats.guildTokens.num || !doLand) {
				return false;
			}
			if (!fR.t.score) {
				result = fR.paths.some( function(pgO) {
					if (schedule.since(pgO.review, 5 * 60)) {
						con.log(1, land.ucWords() + ': Reviewing lands');
						if (caap.navigate3(gf.top[pgO.path.hasIndexOf(stats.guild.id) ? 'your' : 'enemy'], pgO.path.replace('ajax:', ''))) {
							return true;
						}
						con.warn(land.ucWords() + ' link not available on page');
						gb.deleterPage(fR, 'path', pgO.path);
					}
				});
			}
			if (result === true) {
				gb.setRecord(fR);
				return {mlog : 'Reviewing ' + which + ' ' + land.ucWords() + ' lands'};
			}
			
			$j.each(fR[which].towers, function(tower) {
				if (fR[which].towers[tower][seal][stun].score > t.score) {
					t = fR[which].towers[tower][seal][stun];
				}
			});
			
			stateMsg = gf.name + ': ';
		
			fR.t = t;
			if (!t.score) {
				caap.setDivContent(mess, stateMsg + ' no valid target');
				gb.setRecord(fR);
				return false;
			}
			
			if (!general.hasRecord(t.general.replace('@',''))) {
				t.general = 'Use Current';
			}
			
			caap.setDivContent(mess, stateMsg + t.attack + ' on ' + t.team + ' T' + t.tower + ' ' + t.name);
			con.log(2,  stateMsg + t.attack + ' on ' + t.team + ' T' + t.tower + ' ' + t.name, t);

			//path = isloe ? ',clickjq:.action_panel_' + t.id + ' input[src*="' + t.attack + '.jpg"]' :
			//	',clickjq:#special_defense_1_' + t.id + ' input[src*="' + t.attack + '.gif"]';
			
			result = caap.navigate2(t.general + ',' + gb.makePath(gf, t.team, t.tower) + ',clickjq:.action_panel_' + t.id
				+ ' input[src*="' + t.attack + '.jpg"]');
			if (result == 'fail') {
				con.warn(stateMsg + t.attack + ' failed on ' + t.team + ' T' + t.tower + ' ' + t.name + ' Check ' + general.current + ' has ' + t.attack + ', reloading page', general.current, general.loadout);
				caap.setDivContent(mess, stateMsg + t.attack + ' failed on ' + t.team + ' T' + t.tower + ' ' + t.name + ' Check ' + general.current + ' has ' + t.attack);
				gb.setRecord(fR);
				return caap.navigate2('ajax:guild_conquest_castle_battlelist.php');
			} 
			if (result == 'done') {
				battle.setRecordVal(t.id, 'level', t.level);
				state.setItem('lastBattleID', t.id);
				fR.t = false;
			}
			gb.setRecord(fR);
			return result;
			
        } catch (err) {
            con.error("ERROR in loe.worker: " + err.stack);
            return false;
        }
    };

    loe.conquestMenu = function() {
        try {
            // Guild Battle controls
            var whenLoElist = ['Never', 'Blue Crystals', 'Always'],
                whenLoEinst = [
                    'Never - disables starting guild battles',
                    'Do LoE attacks on blue crystal days when a war is available',
                    'Always do LoE attacks'],
				loeScoringInst = "List of score adjustments to pick targets",
                htmlCode = caap.makeDropDownTR("Do LoE conquest for", 'WhenLoE', whenLoElist, whenLoEinst, '', 'Never', false, false, 62);
				
            htmlCode += caap.display.start('WhenLoE', 'isnot', 'Never');
            htmlCode += caap.makeTD("Rate targets by: <a href='http://caaplayer.freeforums.org/viewtopic.php?f=9&t=830' target='_blank' style='color: blue'>(INFO)</a>");
            htmlCode += caap.makeTextBox('loeScoring', loeScoringInst, 'cduel[],mduel[],wduel[],rduel[]', '');
            htmlCode += caap.display.end('WhenLoE', 'isnot', 'Never');
            return htmlCode;
        } catch (err) {
            con.error("ERROR in loe.conquestMenu: " + err.stack);
            return '';
        }
    };

}());
