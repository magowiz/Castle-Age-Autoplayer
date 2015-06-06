/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
feed,battle,town,conquest,ignoreJSLintError,
$u,stats,worker,self,caap,config,con,essence,gb,
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

    caap.addDashboard = function() {
        try {
            /*-------------------------------------------------------------------------------------\
             Here is where we construct the HTML for our dashboard. We start by building the outer
             container and position it within the main container.
             \-------------------------------------------------------------------------------------*/
            var layout = "<div id='caap_top'>",
                displayInst = [],
				dashNames = [],
                    styleXY = {
                        x : 0,
                        y : 0
                    },
					bList = [],
                    bgc = state.getItem("StyleBackgroundLight", "#E0C961"),
					confDisF = function(d) {
						return d == config.getItem('DBDisplay', 'Stats') ? 'block' : 'none';
					};

			// Add new format dashboards by object
			worker.dashList.forEach( function(d) {
				var dO = window[d].dashboard;
				dashNames.push(dO.name);
				displayInst.push(dO.inst);
			});
			
            /*-------------------------------------------------------------------------------------\
            Then we put in the Guild tokens and FP total since we overlay them on the page.
            \-------------------------------------------------------------------------------------*/
            layout += "<div style='position:absolute;top:8 px;left:10px;padding: 0; font-size: 9px; height: 18px'><b>Tokens: " +
				stats.guildTokens.num + '/' + stats.guildTokens.max + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FP: ' + stats.points.favor + "</b></div>";

            /*-------------------------------------------------------------------------------------\
             Then we put in the Raid link since no longer available through normal CA web page.
             \-------------------------------------------------------------------------------------*/
            layout += "<div style='position:absolute;top:0px;left:140px;'><a href='raid.php' onclick=\"ajaxLinkSend('globalContainer'," +
				"'raid.php'); return false;\"><input type='button' value='&nbsp;Raid&nbsp;' style='padding: 0; font-size: 9px; height: 18px' /></a></div>";

            /*-------------------------------------------------------------------------------------\
            We install the display selection box that allows the user to toggle through the
            available displays.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_DBDisplay' style='font-size: 9px;position:absolute;top:0px;right:25px;'>Display: ";
            layout += caap.makeDropDown('DBDisplay', dashNames, displayInst, '', 'User Stats', "font-size: 9px; min-width: 90px; max-width: 90px; width : 90px;") + "</div>";

            /*-------------------------------------------------------------------------------------\
            We install the minimize/maximise button that allows the user to make the dashboard
            appear or disappear.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_dashMin' class='ui-icon ui-icon-circle-minus' style='position:absolute;top:0px;right:5px;' title='Minimise' onmouseover='this.style.cursor=\"pointer\";' onmouseout='this.style.cursor=\"default\";'>-</div>";

            /*-------------------------------------------------------------------------------------\
            And here we build our empty content divs and buttons.  All are built hidden, and 
			will be revealed if selected by caap.updateDashboard()
            \-------------------------------------------------------------------------------------*/
			worker.dashList.forEach( function(d) {
				var wO = window[d],
					dO = $u.extend({}, {buttons : [], tableTemplate: {}, handlers: [], tableEntries: []}, wO.dashboard),
					rO = window[$u.setContent(dO.records)],
					i= dO.buttons.indexOf('clear'),
					bText = [];
					
				layout += "<div id='caap_dash_" + dO.name.underline() + "' class='caap_dash_" + dO.name.underline() +
					"' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + confDisF(dO.name) + "'></div>";
					
				if (i >= 0) {
					dO.buttons[i] = {name: 'Clear ' + dO.name + ' Records',
						func: function() {
							rO.records = [];
							rO.save('update');
						}
					};
				}
					
				dO.tableEntries.forEach( function(e, i) {
					var name = $u.setContent(e.name, rO.recordIndex);
					// Add remove buttons
					if (e.type == 'remove') {
						e = {name: '&nbsp;', format: 'unsortable',
							valueF: function(r) {
								return '<span title="Clicking this link will remove ' + r[name] +
								' from CAAP" class="caap_' + rO.records + '_remove ui-icon ui-icon-circle-close" rlink="' +
								r[rO.recordIndex] + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">X</span>';
						}};
						dO.tableEntries[i] = e;
						dO.handlers.addToList({
							hClass: dO.records + '_remove',
								handleF: function(e) {
									$j.makeArray(e.target.attributes).some( function(n) {
										if (n.nodeName === 'rlink') {
											rO.deleteRecord(n.value);
											rO.save('update');
											return true;
										}
									});
								}
						});
						window[d].dashboard = dO;
					}
				});
					
				if ($u.hasContent(dO.buttons)) {
					layout += '<div class="caap_dash_' + dO.name.underline() + '" style="position:absolute;top:2px;left:200px;display:' + 
						confDisF(dO.name) + '">';
					dO.buttons.forEach( function(b) {
						bText.push('<input type="button" id="caap_dashButton_' + b.name.underline() + '" value="&nbsp;' + b.name +
							'&nbsp;" style="padding: 0; font-size: 9px; height: 18px;" />');
						bList.addToList(b);
					});
					layout += bText.join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + "</div>";
				}
			});

            /*-------------------------------------------------------------------------------------\
            No we apply our CSS to our container
            \-------------------------------------------------------------------------------------*/
            caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
            caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top);
            styleXY = caap.getDashboardXY();
            $j(layout).css({
                background : bgc,
                color : $u.bestTextColor(bgc),
                padding : "5px",
                height : "175px",
                width : "610px",
                margin : "0 auto",
                opacity : state.getItem('StyleOpacityLight', 1),
                top : styleXY.y + 'px',
                left : styleXY.x + 'px',
                zIndex : state.getItem('caap_top_zIndex', 1),
                position : 'absolute',
                display : config.getItem("dashMinimised", false) ? 'none' : 'block'
            }).appendTo(document.body);

            caap.caapTopObject = $j('#caap_top');
            $j("input[type='button']", caap.caapTopObject).button();
			
			// Add button handlers
			bList.forEach( function(b) {
				$j("input[id='caap_dashButton_" + b.name.underline() + "']", caap.caapTopObject).off('click', b.func).on('click', b.func);
			});
			
			caap.updateDashboard();

            return true;
        } catch (err) {
            con.error("ERROR in addDashboard: " + err.stack);
            return false;
        }
    };

    caap.addDashboardMin = function() {
        try {
            /*-------------------------------------------------------------------------------------\
            Here is where we construct the HTML for our dashboard. We start by building the outer
            container and position it within the main container.
            \-------------------------------------------------------------------------------------*/
            var layout = "<div id='caap_topmin'>",
                styleXY = {
                    x : 0,
                    y : 0
                },
                bgc = state.getItem("StyleBackgroundLight", "#E0C961");

            /*-------------------------------------------------------------------------------------\
            We install the display selection box that allows the user to toggle through the
            available displays.
            \-------------------------------------------------------------------------------------*/
            layout += "<div id='caap_dashMax' class='ui-icon ui-icon-circle-plus' style='position:absolute;top:0px;left:0px;' title='Maximise' onmouseover='this.style.cursor=\"pointer\";' onmouseout='this.style.cursor=\"default\";'>-</div>";
            layout += "</div>";

            /*-------------------------------------------------------------------------------------\
            No we apply our CSS to our container
            \-------------------------------------------------------------------------------------*/
            styleXY = caap.getDashboardXY();
            $j(layout).css({
                background : bgc,
                color : $u.bestTextColor(bgc),
                padding : "5px",
                height : "6px",
                width : "6px",
                margin : "0 auto",
                opacity : state.getItem('StyleOpacityLight', 1),
                top : styleXY.y + 'px',
                left : styleXY.x + 'px',
                zIndex : state.getItem('caap_top_zIndex', 1),
                position : 'absolute',
                display : config.getItem("dashMinimised", false) ? 'block' : 'none'
            }).appendTo(document.body);

            caap.caapTopMinObject = $j('#caap_topmin');
            return true;
        } catch (err) {
            con.error("ERROR in addDashboardMin: " + err.stack);
            return false;
        }
    };

    caap.updateDashboard = function (force) {
        try {
            if (config.getItem("dashMinimised", false)) {
                return false;
            }

            if (caap.caapTopObject.length === 0) {
                throw "We are missing the Dashboard div!";
            }
			
			var activeDash = config.getItem('DBDisplay', 'Stats');
				
			worker.dashList.some( function(d) {
				var wO = window[d],
					dO = $u.extend({}, {buttons : [], tableTemplate: {}, handlers: [], tableEntries: []}, wO.dashboard),
					ulName = dO.name.underline(),
					tt = dO.tableTemplate,
					head = '',
					body = '',
					fR = $u.hasContent(dO.gbLabel) ? gb.getRecord(dO.gbLabel) : {},
					tE = $u.isFunction(dO.tableEntriesF) ? dO.tableEntriesF(fR) : dO.tableEntries,
					records = $u.hasContent(fR) ? fR[config.getItem('gbDashWhich', 'enemy')].members : window[dO.records].records,
					indices = function(format) {  
						return tE.map( function(c, i) {
							ignoreJSLintError(c);
							return i;
						}).filter( function(i) {
							return tE[i].format == format;
						});		
					};
					
				if (activeDash != dO.name) {
					return false;  // Wrong dashboard
				}

				if (!force && !session.getItem("DashUpdate" + ulName, true)) {
					return true; // Right dashboard, but it's up to date
				}
				con.log(2, "Updating " + dO.name + " Dashboard ");
				
				if ($u.hasContent(tE)) {

					tE.forEach( function(e) {
						head += caap.makeTh({text: e.name, width: e.width});
					});
					$j.each(records, function(i, r) {
						ignoreJSLintError(i);
						if ($u.isFunction(dO.filterF) && !dO.filterF(r)) {
							return;
						}
						var row = '';
						tE.forEach( function(e) {
							var text = $u.isDefined(e.value) ? r[e.value] : $u.isFunction(e.valueF) ? e.valueF(r, i) : r[e.name.toLowerCase()];
							switch (e.format) {
							case 'time' : 			text = $u.minutes2hours(text); 										break;
							case 'nonnegative' : 	text = (text < 0 ? '' : text);										break;
							case '$SI' : 			text = '$' + text.SI();		 										break;
							case 'SI' : 			text = text.SI();			 										break;
							default :																					break;
							}

							text = e.format != 'text' && $u.hasContent(text) && Number(text) == text ? Number(text).dp(1).addCommas() : text;
							row += caap.makeTd({
								text: text,
								// Order: table entry from record, table entry function, table template fixed value, table template function, blank
								color: $u.isString(e.color) ? r[e.color] : $u.isFunction(e.colorF) ? e.colorF(r) :
									$u.isDefined(tt.color) ? tt.color : $u.isFunction(tt.colorF) ? tt.colorF(r) : '' ,
								title: $u.isString(e.title) ? r[e.title] : $u.isFunction(e.titleF) ? e.titleF(r) : 
									$u.isDefined(tt.title) ? tt.title : $u.isFunction(tt.titleF) ? tt.titleF(r) : ''
							});
						});
						body += caap.makeTr(row);
					});
					
					$j("#caap_dash_" + ulName, caap.caapTopObject).html(
					$j(caap.makeTable(d, head, body)).dataTable({
						"bAutoWidth": false,
						"bFilter": false,
						"bJQueryUI": false,
						"bInfo": false,
						"bLengthChange": false,
						"bPaginate": false,
						"bProcessing": false,
						"bStateSave": true,
						"bSortClasses": false,
						"aoColumnDefs": [{"bSortable": false, 		"aTargets": indices('unsortable') },
							{"sSortDataType": "remaining-time", 	"aTargets": indices('time')}]
					}));
				}
				
				if ($u.isFunction(dO.headerF)) {
					$j("#caap_dash_" + ulName, caap.caapTopObject).prepend(dO.headerF(fR));
				}
				
				dO.handlers.forEach( function(h) {
					$j("span[class*='caap_" + h.hClass + "']", caap.caapTopObject).off('click', h.handleF).on('click', h.handleF);
				});
				session.setItem("DashUpdate" + ulName, false);
				return true;
			});
			
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
            value = e.target.options[e.target.selectedIndex].value;

        con.log(1, 'Change: dashboard setting "' + idName + '" to "' + value + '"');
        config.setItem(idName, value);
		
		// Hide all dash objects
		$j('#caap_top div[class^="caap_dash_"]:visible').each( function() {
			$j(this).css('display', 'none');
		});
		
		// Unhide the objects from this dash
		caap.setDisplay("caapTopObject", {'class' : 'dash_' + value.underline()}, true);

        caap.updateDashboard();
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

    caap.clearTargetsButtonListener = function () {
        battle.reconRecords = [];
        battle.saveRecon();
        caap.updateDashboard(true);
    };

    caap.clearBattleButtonListener = function () {
        battle.clear();
        caap.updateDashboard(true);
    };

    caap.clearGuildsButtonListener = function () {
        essence.clear();
        caap.updateDashboard(true);
    };

    caap.rescanGuildsButtonListener = function () {
		essence.rescan();
        caap.updateDashboard(true);
    };

    caap.getArmyButtonListener = function () {
        schedule.setItem("army_member", 0);
        army.deleteTemp();
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
