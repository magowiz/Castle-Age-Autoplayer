/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
festival,feed,battle,town,conquest,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,gm,hiddenVar,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
// MONSTERS DASHBOARD
// Display the current monsters and stats
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

    caap.makeTable = function (id, head, body, caption, style) {
        try {
            if (!$u.hasContent(id) || !$u.isString(id)) {
                throw "Invalid ID!";
            }

            var html = "<table id='caap_" + id + "_table' class='caap_table'>";

            html += $u.hasContent(caption) ? "<caption class='caap_caption' " + ($u.hasContent(style) ? "style='" + style + "'" : "") + ">" + caption + "</caption>" : "";
            html += "<thead>" + $u.setContent(head, '') + "</thead>";
            html += "<tbody>" + $u.setContent(body, '') + "</tbody>";
            html += "</table>";

            return html;
        } catch (err) {
            con.error("ERROR in makeTable: " + err);
            return undefined;
        }
    };

    caap.makeTr = function (data, style) {
        try {
            return $u.hasContent(data) ? "<tr" + ($u.hasContent(style) ? " style='" + style + "'" : "") + ">" + data + "</tr>" : "";
        } catch (err) {
            con.error("ERROR in makeTr: " + err);
            return undefined;
        }
    };

    caap.makeTh = function (header, style) {
        try {
            var type = " data-type='bestcolor'",
                html = '<th';

            type = $u.hasContent(header.color) ? '' : type;
            header.color = $u.setContent(header.color, $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961")));
            html += $u.hasContent(header.id) ? " id='" + header.id + "'" : '';
            html += $u.hasContent(header.title) ? " title='" + header.title + "'" : '';
            html += type + " style='color:" + header.color + ";" + ($u.hasContent(header.bgcolor) ? "background-color:" +
                header.bgcolor + ";" : '') + ($u.hasContent(header.width) ? "width:" + header.width + ";" : '') + ($u.hasContent(style) ? style : "") + "'>" + header.text + "</th>";

            return html;
        } catch (err) {
            con.error("ERROR in makeTh: " + err);
            return undefined;
        }
    };

    caap.makeTd = function (data, style) {
        try {
            var type = " data-type='bestcolor'",
                html = '<td';

            type = $u.hasContent(data.color) ? '' : type;
            data.color = $u.setContent(data.color, $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961")));
            html += $u.hasContent(data.id) ? " id='" + data.id + "'" : '';
            html += $u.hasContent(data.title) ? " title='" + data.title + "'" : '';
            html += type + " style='color:" + data.color + ";" + ($u.hasContent(data.bgcolor) ? "background-color:" + data.bgcolor + ";" : '') + ($u.hasContent(style) ? style : "") + "'>" + data.text + "</td>";

            return html;
        } catch (err) {
            con.error("ERROR in makeTd: " + err);
            return undefined;
        }
    };

    caap.updateDashboardWaitLog = true;

    caap.updateDashboard = function (force) {
        try {
            if (config.getItem("dashMinimised", false)) {
                return false;
            }

            if (caap.caapTopObject.length === 0) {
                throw "We are missing the Dashboard div!";
            }

            if (!force && !caap.oneMinuteUpdate('dashboard') && $j('#caap_infoMonster').html()) {
                if (caap.updateDashboardWaitLog) {
                    con.log(4, "Dashboard update is waiting on oneMinuteUpdate");
                    caap.updateDashboardWaitLog = false;
                }

                return false;
            }

            caap.updateDashboardWaitLog = true;
            con.log(3, "Updating Dashboard");
            monster.dashboard();
            guild_monster.dashboard();
            //arena.AddArenaDashboard();
            festival.dashboard();
            feed.dashboard();
            army.dashboard();
            battle.dashboard();
            conquest.dashboard();
            guilds.dashboard();
            town.dashboard();
            general.dashboard();
            gifting.queue.dashboard();
            gifting.history.dashboard();

            var headers = [],
                values = [],
                pp = 0,
                i = 0,
                count = 0,
                userIdLink = '',
                userIdLinkInstructions = '',
                valueCol = 'red',
                len = 0,
                data = {
                    text: '',
                    color: '',
                    bgcolor: '',
                    id: '',
                    title: ''
                },
                handler = null,
                head = '',
                body = '',
                row = '',
                rows = [];

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_infoTargets1' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (config.getItem('DBDisplay', '') === 'Target List' && session.getItem("ReconDashUpdate", true)) {
                head = "";
                body = "";
                headers = ['UserId', 'Name', 'Deity', 'BR#', 'Arena#',
                'WR#', 'Level', 'Army', 'Last Alive'];
                values = ['userId', 'nameStr', 'deityNum', 'rankNum', 'arenaRankNum',
                'warRankNum', 'levelNum', 'armyNum', 'aliveTime'];
                for (pp = 0; pp < headers.length; pp += 1) {
                    switch (headers[pp]) {
                        case 'UserId':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '16%'
                            });

                            break;
                        case 'Name':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '25%'
                            });

                            break;
                        case 'Deity':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '12%'
                            });

                            break;
                        case 'BR#':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '7%'
                            });

                            break;
                        case 'arena#':
                            head += caap.makeTh({
                                text : headers[pp],
                                width : '7%'
                            });

                            break;
                        case 'WR#':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '7%'
                            });

                            break;
                        case 'Level':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '7%'
                            });

                            break;
                        case 'Army':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '7%'
                            });

                            break;
                        case 'Last Alive':
                            head += caap.makeTh({
                                text: headers[pp],
                                width: '12%'
                            });

                            break;
                        default:
                    }
                }

                head = caap.makeTr(head);
                for (i = 0, len = battle.reconRecords.length; i < len; i += 1) {
                    row = "";
                    for (pp = 0; pp < values.length; pp += 1) {
                        switch (values[pp]) {
                            case 'userId':
                                userIdLinkInstructions = "Clicking this link will take you to the user keep of " + battle.reconRecords[i][values[pp]];
                                userIdLink = "keep.php?casuser=" + battle.reconRecords[i][values[pp]];
                                data = {
                                    text: '<span id="caap_targetrecon_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + battle.reconRecords[i][values[pp]] + '</span>',
                                    color: 'blue'
                                };

                                row += caap.makeTd(data);

                                break;
                            case 'deityNum':
                                row += caap.makeTd({
                                    text: caap.demiTable[battle.reconRecords[i][values[pp]]].ucFirst()
                                });

                                break;
                            case 'rankNum':
                                row += caap.makeTd({
                                    text: battle.reconRecords[i][values[pp]],
                                    title: battle.battleRankTable[battle.reconRecords[i][values[pp]]]
                                });

                                break;
                            case 'arenaRankNum':
                                row += caap.makeTd({
                                    text : battle.reconRecords[i][values[pp]],
                                    title : battle.battleRankTable[battle.reconRecords[i][values[pp]]]
                                });

                                break;
                            case 'warRankNum':
                                row += caap.makeTd({
                                    text: battle.reconRecords[i][values[pp]],
                                    title: battle.warRankTable[battle.reconRecords[i][values[pp]]]
                                });

                                break;
                            case 'aliveTime':
                                data = {
                                    text: $u.makeTime(battle.reconRecords[i][values[pp]], "d M H:i")
                                };

                                row += caap.makeTd(data);

                                break;
                            default:
                                row += caap.makeTd({
                                    text: battle.reconRecords[i][values[pp]]
                                });
                        }
                    }

                    body += caap.makeTr(row);
                }

                $j("#caap_infoTargets1", caap.caapTopObject).html($j(caap.makeTable("recon", head, body)).dataTable({
                    "bAutoWidth": false,
                    "bFilter": false,
                    "bJQueryUI": false,
                    "bInfo": false,
                    "bLengthChange": false,
                    "bPaginate": false,
                    "bProcessing": false,
                    "bStateSave": true,
                    "bSortClasses": false
                }));

                handler = function (e) {
                    var visitUserIdLink = {
                            rlink: '',
                            arlink: ''
                        },
                        i = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'rlink') {
                            visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                            visitUserIdLink.arlink = visitUserIdLink.rlink;
                        }
                    }

                    caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                };

                $j("span[id*='caap_targetrecon_']", caap.caapTopObject).off('click', handler).click(handler);
                session.setItem("ReconDashUpdate", false);
            }

            /*-------------------------------------------------------------------------------------\
            Next we build the HTML to be included into the 'caap_userStats' div. We set our
            table and then build the header row.
            \-------------------------------------------------------------------------------------*/
            if (config.getItem('DBDisplay', '') === 'User Stats' && session.getItem("UserDashUpdate", true)) {
                head = "";
                body = "";
                headers = ['Name', 'Value', 'Name', 'Value'];
                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    head += caap.makeTh({
                        text: headers[pp],
                        width: ''
                    });
                }

                head = caap.makeTr(head);
                rows = [
                    [{
                        text: 'Facebook ID'
                    }, {
                        text: caap.stats.FBID
                    }, {
                        text: 'Account Name'
                    }, {
                        text: caap.fbData.me.name
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;'
                    }],
                    [{
                        text: 'Character Name'
                    }, {
                        text: caap.stats.PlayerName
                    }, {
                        text: 'Energy',
                        title: 'Current/Max'
                    }, {
                        text: caap.stats.energy.num + '/' + caap.stats.energy.max,
                        color: valueCol
                    }],
                    [{
                        text: 'Level'
                    }, {
                        text: caap.stats.level,
                        color: valueCol
                    }, {
                        text: 'Stamina',
                        title: 'Current/Max'
                    }, {
                        text: caap.stats.stamina.num + '/' + caap.stats.stamina.max,
                        color: valueCol
                    }],
                    [{
                        text: 'Battle Rank'
                    }, {
                        text: battle.battleRankTable[caap.stats.rank.battle] + ' (' + caap.stats.rank.battle + ')',
                        color: valueCol
                    }, {
                        text: 'Attack',
                        title: 'Current/Max'
                    }, {
                        text: caap.stats.attack.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Battle Rank Points'
                    }, {
                        text: caap.stats.rank.battlePoints.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Defense'
                    }, {
                        text: caap.stats.defense.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'War Rank'
                    }, {
                        text: battle.warRankTable[caap.stats.rank.war] + ' (' + caap.stats.rank.war + ')',
                        color: valueCol
                    }, {
                        text: 'Health',
                        title: 'Current/Max'
                    }, {
                        text: caap.stats.health.num + '/' + caap.stats.health.max,
                        color: valueCol
                    }],
                    [{
                        text: 'War Rank Points'
                    }, {
                        text: caap.stats.rank.warPoints.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Army'
                    }, {
                        text: caap.stats.army.actual.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Conquest Rank'
                    }, {
                        text: conquest.conquestRankTable[caap.stats.rank.conquest] + ' (' + caap.stats.rank.conquest + ')',
                        color: valueCol
                    }, {
                        text: 'Generals'
                    }, {
                        text: caap.stats.generals.total,
                        color: valueCol
                    }],
                    [{
                        text: 'Conquest Rank Points'
                    }, {
                        text: caap.stats.rank.conquestPoints.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Generals When Invade',
                        title: 'For every 5 army members you have, one of your generals will also join the fight.'
                    }, {
                        text: caap.stats.generals.invade,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Gold In Bank'
                    }, {
                        text: '$' + caap.stats.gold.bank.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Total Income Per Hour'
                    }, {
                        text: '$' + caap.stats.gold.income.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Gold In Cash'
                    }, {
                        text: '$' + caap.stats.gold.cash.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Upkeep'
                    }, {
                        text: '$' + caap.stats.gold.upkeep.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Total Gold'
                    }, {
                        text: '$' + caap.stats.gold.total.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Cash Flow Per Hour'
                    }, {
                        text: '$' + caap.stats.gold.flow.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Skill Points'
                    }, {
                        text: caap.stats.points.skill,
                        color: valueCol
                    }, {
                        text: 'Energy Potions'
                    }, {
                        text: caap.stats.potions.energy,
                        color: valueCol
                    }],
                    [{
                        text: 'Favor Points'
                    }, {
                        text: caap.stats.points.favor,
                        color: valueCol
                    }, {
                        text: 'Stamina Potions'
                    }, {
                        text: caap.stats.potions.stamina,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Experience To Next Level (ETNL)'
                    }, {
                        text: caap.stats.exp.dif.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Battle Strength Index (BSI)'
                    }, {
                        text: caap.stats.indicators.bsi,
                        color: valueCol
                    }],
                    [{
                        text: 'Hours To Level (HTL)'
                    }, {
                        text: $u.minutes2hours(caap.stats.indicators.htl),
                        color: valueCol
                    }, {
                        text: 'Levelling Speed Index (LSI)'
                    }, {
                        text: caap.stats.indicators.lsi,
                        color: valueCol
                    }],
                    [{
                        text: 'Hours Remaining To Level (HRTL)'
                    }, {
                        text: $u.minutes2hours(caap.stats.indicators.hrtl),
                        color: valueCol
                    }, {
                        text: 'Skill Points Per Level (SPPL)'
                    }, {
                        text: caap.stats.indicators.sppl,
                        color: valueCol
                    }],
                    [{
                        text: 'Expected Next Level (ENL)'
                    }, {
                        text: $u.makeTime(caap.stats.indicators.enl, caap.timeStr()),
                        color: valueCol
                    }, {
                        text: 'Attack Power Index (API)'
                    }, {
                        text: caap.stats.indicators.api,
                        color: valueCol
                    }],
                    [{
                        text: 'Build Type'
                    }, {
                        text: caap.stats.indicators.build,
                        color: valueCol
                    }, {
                        text: 'Defense Power Index (DPI)'
                    }, {
                        text: caap.stats.indicators.dpi,
                        color: valueCol
                    }],
                    [{
                        text: 'PvP Class'
                    }, {
                        text: caap.stats.indicators.pvpclass,
                        color: valueCol
                    }, {
                        text: 'Mean Power Index (MPI)'
                    }, {
                        text: caap.stats.indicators.mpi,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: 'Monster Hunting Build Effective Quotent (MHBEQ)'
                    }, {
                        text: caap.stats.indicators.mhbeq,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Battles/Wars Won'
                    }, {
                        text: caap.stats.other.bww.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Times eliminated'
                    }, {
                        text: caap.stats.other.te.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Battles/Wars Lost'
                    }, {
                        text: caap.stats.other.bwl.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Times you eliminated an enemy'
                    }, {
                        text: caap.stats.other.tee.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Battles/Wars Win/Loss Ratio (WLR)'
                    }, {
                        text: caap.stats.other.wlr,
                        color: valueCol
                    }, {
                        text: 'Enemy Eliminated/Eliminated Ratio (EER)'
                    }, {
                        text: caap.stats.other.eer,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Invasions Won'
                    }, {
                        text: caap.stats.achievements.battle.invasions.won.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Duels Won'
                    }, {
                        text: caap.stats.achievements.battle.duels.won.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Invasions Lost'
                    }, {
                        text: caap.stats.achievements.battle.invasions.lost.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Duels Lost'
                    }, {
                        text: caap.stats.achievements.battle.duels.lost.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Invasions Streak'
                    }, {
                        text: caap.stats.achievements.battle.invasions.streak.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Duels Streak'
                    }, {
                        text: caap.stats.achievements.battle.duels.streak.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: 'Invasions Win/loss Ratio (IWLR)'
                    }, {
                        text: caap.stats.achievements.battle.invasions.ratio,
                        color: valueCol
                    }, {
                        text: 'Duels Win/loss Ratio (DWLR)'
                    }, {
                        text: caap.stats.achievements.battle.duels.ratio,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Quests Completed'
                    }, {
                        text: caap.stats.other.qc.addCommas(),
                        color: valueCol
                    }, {
                        text: 'Alchemy Performed'
                    }, {
                        text: caap.stats.achievements.other.alchemy.addCommas(),
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }]
                ];

                $j.each(rows, function () {
                    var _row = '';

                    $j.each(this, function () {
                        _row += caap.makeTd(this);
                    });

                    body += caap.makeTr(_row);
                });

                count = 0;
                for (pp in caap.stats.achievements.monster) {
                    if (caap.stats.achievements.monster.hasOwnProperty(pp)) {
                        row = count % 2 === 0 ? '' : row;
                        row += caap.makeTd({
                            text: pp.escapeHTML()
                        });

                        row += caap.makeTd({
                            text: caap.stats.achievements.monster[pp],
                            color: valueCol
                        });

                        body += count % 2 === 1 ? caap.makeTr(row) : '';
                        count += 1;
                    }
                }

                if (count % 2 === 1) {
                    row += caap.makeTd({
                        text: '&nbsp;'
                    });

                    row += caap.makeTd({
                        text: '&nbsp;',
                        color: valueCol
                    });

                    body += caap.makeTr(row);
                }

                rows = [
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Ambrosia Daily Points'
                    }, {
                        text: caap.demi.ambrosia.daily.num + '/' + caap.demi.ambrosia.daily.max,
                        color: valueCol
                    }, {
                        text: 'Malekus Daily Points'
                    }, {
                        text: caap.demi.malekus.daily.num + '/' + caap.demi.malekus.daily.max,
                        color: valueCol
                    }],
                    [{
                        text: 'Ambrosia Total Points'
                    }, {
                        text: caap.demi.ambrosia.power.total,
                        color: valueCol
                    }, {
                        text: 'Malekus Total Points'
                    }, {
                        text: caap.demi.malekus.power.total,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Corvintheus Daily Points'
                    }, {
                        text: caap.demi.corvintheus.daily.num + '/' + caap.demi.corvintheus.daily.max,
                        color: valueCol
                    }, {
                        text: 'Aurora Daily Points'
                    }, {
                        text: caap.demi.aurora.daily.num + '/' + caap.demi.aurora.daily.max,
                        color: valueCol
                    }],
                    [{
                        text: 'Corvintheus Total Points'
                    }, {
                        text: caap.demi.corvintheus.power.total,
                        color: valueCol
                    }, {
                        text: 'Aurora Total Points'
                    }, {
                        text: caap.demi.aurora.power.total,
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Azeron Daily Points'
                    }, {
                        text: caap.demi.azeron.daily.num + '/' + caap.demi.azeron.daily.max,
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: 'Azeron Total Points'
                    }, {
                        text: caap.demi.azeron.power.total,
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }],
                    [{
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }, {
                        text: '&nbsp;'
                    }, {
                        text: '&nbsp;',
                        color: valueCol
                    }]
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
                for (pp in caap.stats.character) {
                    if (caap.stats.character.hasOwnProperty(pp)) {
                        row = count % 2 === 0 ? '' : row;
                        row += caap.makeTd({
                            text: pp
                        });

                        row += caap.makeTd({
                            text: "Level " + caap.stats.character[pp].level + " (" + caap.stats.character[pp].percent + "%)",
                            color: valueCol
                        });

                        body += count % 2 === 1 ? caap.makeTr(row) : '';
                        count += 1;
                    }
                }

                if (count % 2 === 1) {
                    row += caap.makeTd({
                        text: '&nbsp;'
                    });

                    row += caap.makeTd({
                        text: '&nbsp;',
                        color: valueCol
                    });

                    body += caap.makeTr(row);
                }

                $j("#caap_userStats", caap.caapTopObject).html(caap.makeTable("user", head, body));
                session.setItem("UserDashUpdate", false);
            }

            return true;
        } catch (err) {
            con.error("ERROR in updateDashboard: " + err);
            return false;
        }
    };

    /*-------------------------------------------------------------------------------------\
    addDBListener creates the listener for our dashboard controls.
    \-------------------------------------------------------------------------------------*/
    caap.dbDisplayListener = function (e) {
        var idName = e.target.id.stripCaap(),
            value = e.target.options[e.target.selectedIndex].value,
            title = e.target.options[e.target.selectedIndex].title;

        con.log(1, 'Change: setting "' + idName + '" to "' + value + '" with title "' + title + '"');
        config.setItem(idName, value);
        e.target.title = title;
        caap.setDisplay("caapTopObject", 'infoMonster', false);
        caap.setDisplay("caapTopObject", 'guildMonster', false);
        //caap.setDisplay("caapTopObject", 'arena', false);
        caap.setDisplay("caapTopObject", 'festival', false);
        caap.setDisplay("caapTopObject", 'feed', false);
        caap.setDisplay("caapTopObject", 'army', false);
        caap.setDisplay("caapTopObject", 'infoTargets1', false);
        caap.setDisplay("caapTopObject", 'infoBattle', false);
        caap.setDisplay("caapTopObject", 'infoConquest', false);
        caap.setDisplay("caapTopObject", 'infoGuilds', false);
        caap.setDisplay("caapTopObject", 'userStats', false);
        caap.setDisplay("caapTopObject", 'generalsStats', false);
        caap.setDisplay("caapTopObject", 'soldiersStats', false);
        caap.setDisplay("caapTopObject", 'itemStats', false);
        caap.setDisplay("caapTopObject", 'magicStats', false);
        caap.setDisplay("caapTopObject", 'giftStats', false);
        caap.setDisplay("caapTopObject", 'giftQueue', false);
        caap.setDisplay("caapTopObject", 'buttonMonster', false);
        caap.setDisplay("caapTopObject", 'buttonGuildMonster', false);
        caap.setDisplay("caapTopObject", 'buttonTargets', false);
        caap.setDisplay("caapTopObject", 'buttonBattle', false);
        caap.setDisplay("caapTopObject", 'buttonConquest', false);
        caap.setDisplay("caapTopObject", 'buttonGuilds', false);
        caap.setDisplay("caapTopObject", 'buttonGifting', false);
        caap.setDisplay("caapTopObject", 'buttonGiftQueue', false);
        caap.setDisplay("caapTopObject", 'buttonArmy', false);
        switch (value) {
            case "Target List":
                caap.setDisplay("caapTopObject", 'infoTargets1', true);
                caap.setDisplay("caapTopObject", 'buttonTargets', true);

                break;
            case "Battle Stats":
                caap.setDisplay("caapTopObject", 'infoBattle', true);
                caap.setDisplay("caapTopObject", 'buttonBattle', true);

                break;
            case "Conquest Stats":
                caap.setDisplay("caapTopObject", 'infoConquest', true);
                caap.setDisplay("caapTopObject", 'buttonConquest', true);

                break;
            case "Guild Essence":
                caap.setDisplay("caapTopObject", 'infoGuilds', true);
                caap.setDisplay("caapTopObject", 'buttonGuilds', true);

                break;
            case "User Stats":
                caap.setDisplay("caapTopObject", 'userStats', true);

                break;
            case "Generals Stats":
                caap.setDisplay("caapTopObject", 'generalsStats', true);

                break;
            case "Soldiers Stats":
                caap.setDisplay("caapTopObject", 'soldiersStats', true);

                break;
            case "Item Stats":
                caap.setDisplay("caapTopObject", 'itemStats', true);

                break;
            case "Magic Stats":
                caap.setDisplay("caapTopObject", 'magicStats', true);

                break;
            case "Gifting Stats":
                caap.setDisplay("caapTopObject", 'giftStats', true);
                caap.setDisplay("caapTopObject", 'buttonGifting', true);

                break;
            case "Gift Queue":
                caap.setDisplay("caapTopObject", 'giftQueue', true);
                caap.setDisplay("caapTopObject", 'buttonGiftQueue', true);

                break;
            case "Guild Monster":
                caap.setDisplay("caapTopObject", 'guildMonster', true);
                caap.setDisplay("caapTopObject", 'buttonGuildMonster', true);

                break;
            case "Monster":
                caap.setDisplay("caapTopObject", 'infoMonster', true);
                caap.setDisplay("caapTopObject", 'buttonMonster', true);
                break;
            /*
            case "Arena" :
                caap.setDisplay("caapTopObject", 'arena', true);

                break;
            */
            case "Festival":
                caap.setDisplay("caapTopObject", 'festival', true);

                break;
            case "Feed":
                caap.setDisplay("caapTopObject", 'feed', true);

                break;
            case "Army":
                caap.setDisplay("caapTopObject", 'army', true);
                caap.setDisplay("caapTopObject", 'buttonArmy', true);

                break;
            default:
        }

        caap.updateDashboard(true);
    };

    caap.refreshMonstersListener = function () {
        monster.flagFullReview();
    };

    caap.refreshGuildMonstersListener = function () {
        con.log(1, "refreshGuildMonstersListener");
        session.setItem('ReleaseControl', true);
        guild_monster.clear();
        caap.updateDashboard(true);
        schedule.setItem("guildMonsterReview", 0);
    };

    caap.liveFeedButtonListener = function () {
        caap.clickAjaxLinkSend('army_news_feed.php');
    };

    caap.crusadersButtonListener = function () {
        caap.clickAjaxLinkSend('crusaders.php');
    };

    caap.getBQH = function (cb) {
        function onError() {
            $j().alert("Unable to get bqh");
        }

        function onSuccess(data) {
            var bqh = $j("input[name='bqh']", data).eq(0).val();

            if ($u.isFunction(cb) && $u.hasContent(bqh)) {
                cb(bqh);
            } else {
                $j().alert("Unable to get bqh");
            }

            bqh = null;
        }

        try {
            caap.ajax('keep.php', null, onError, onSuccess);
            return true;
        } catch (err) {
            con.error("ERROR in getBQH: " + err);
            return false;
        }
    };

    caap.fastHealButtonListener = function () {
        if (caap.stats.health.dif && caap.stats.gold.total > 0) {
            caap.getBQH(function (bqh) {
                var params = {
                    "action": "heal_avatar",
                    "bqh": bqh
                };

                caap.ajaxLoad('keep.php', params, "#health_current_value", "#health_current_value", session.getItem("page", ""));
            });
        }
    };

    caap.clearTargetsButtonListener = function () {
        battle.reconRecords = [];
        battle.saveRecon();
        caap.updateDashboard(true);
    };

    caap.clearBattleButtonListener = function () {
        battle.clear();
        caap.updateDashboard(true);
    };

    caap.clearConquestButtonListener = function () {
        conquest.clear();
        caap.updateDashboard(true);
    };

    caap.clearGuildsButtonListener = function () {
        guilds.clear();
        caap.updateDashboard(true);
    };

    caap.rescanGuildsButtonListener = function () {
		guilds.rescan();
        caap.updateDashboard(true);
    };

    caap.clearGiftingButtonListener = function () {
        gifting.clear("history");
        caap.updateDashboard(true);
    };

    caap.clearGiftQueueButtonListener = function () {
        gifting.clear("queue");
        caap.updateDashboard(true);
    };

    caap.getArmyButtonListener = function () {
        schedule.setItem("army_member", 0);
        army.deleteTemp();
    };

    caap.getCollectConquestButtonListener = function () {
        schedule.setItem('collectConquestTimer', 0);
        caap.setDivContent('conquestbless_mess', schedule.check('collectConquestTimer') ? 'Conquest Collect = none' : 'Next Conquest: ' + $u.setContent(caap.displayTime('collectConquestTimer'), "Unknown"));
    };

    caap.getCollectConquestCrystalButtonListener = function () {
        schedule.setItem('collectConquestCrystalTimer', 0);
        caap.setDivContent('conquestcrystalbless_mess', schedule.check('collectConquestCrystalTimer') ? 'Crystal Collect = none' : 'Next Crystal: ' + $u.setContent(caap.displayTime('collectConquestCrystalTimer'), "Unknown"));
    };

    caap.getArenaButtonListener = function() {
        schedule.setItem('arenaTimer', 0);
    };

    caap.addDBListener = function () {
        try {
            con.log(4, "Adding listeners for caap_top");
            if (!$u.hasContent($j('#caap_DBDisplay', caap.caapTopObject))) {
                caap.reloadCastleAge();
            }

            $j('#caap_DBDisplay', caap.caapTopObject).on('change', caap.dbDisplayListener);
            $j('#caap_refreshMonsters', caap.caapTopObject).on('click', caap.refreshMonstersListener);
            $j('#caap_refreshGuildMonsters', caap.caapTopObject).on('click', caap.refreshGuildMonstersListener);
            $j('#caap_liveFeed', caap.caapTopObject).on('click', caap.liveFeedButtonListener);
            $j('#caap_crusaders', caap.caapTopObject).on('click', caap.crusadersButtonListener);
            $j('#caap_fastHeal', caap.caapTopObject).on('click', caap.fastHealButtonListener);
            $j('#caap_clearTargets', caap.caapTopObject).on('click', caap.clearTargetsButtonListener);
            $j('#caap_clearBattle', caap.caapTopObject).on('click', caap.clearBattleButtonListener);
            $j('#caap_clearConquest', caap.caapTopObject).on('click', caap.clearConquestButtonListener);
            $j('#caap_clearGuilds', caap.caapTopObject).on('click', caap.clearGuildsButtonListener);
            $j('#caap_rescanGuilds', caap.caapTopObject).on('click', caap.rescanGuildsButtonListener);
            $j('#caap_clearGifting', caap.caapTopObject).on('click', caap.clearGiftingButtonListener);
            $j('#caap_clearGiftQueue', caap.caapTopObject).on('click', caap.clearGiftQueueButtonListener);
            $j('#caap_getArmy', caap.caapTopObject).on('click', caap.getArmyButtonListener);
            $j('#caap_dashMin', caap.caapTopObject).on('click', function () {
                caap.caapTopObject.toggle('fold', {}, '', function () {
                    caap.caapTopMinObject.show();
                });

                config.setItem("dashMinimised", true);
            });

            $j('#caap_dashMax', caap.caapTopMinObject).on('click', function () {
                caap.caapTopObject.toggle('fold');
                caap.caapTopMinObject.hide();
                config.setItem("dashMinimised", false);
            });

            con.log(4, "Listeners added for caap_top");
            return true;
        } catch (err) {
            con.error("ERROR in addDBListener: " + err);
            return false;
        }
    };

}());
