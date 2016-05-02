/*jslint white: true, browser: true, devel: true, 
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,stats,$j,rison,utility,offline,town,
$u,chrome,worker,self,caap,config,con,gsheet,ss,hyper,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          gsheet OBJECT
// this is the main object for dealing with gsheet items
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

	worker.add('gsheet');
	
	chrome.runtime.sendMessage({method: "getLocalStorage", key: "caweb3gsheet"}, function(response) {
		gsheet.tableId = response.data;
	});

	chrome.runtime.sendMessage({method: "getLocalStorage", key: "caweb3salt"}, function(response) {
		gsheet.salt = $u.setContent(response.data, '');
	});
	
	gsheet.init = function() {
        try {
			if(![0, 2].hasIndexOf(caap.domain.which)) {
				return true;
			}
			
			if (!$u.hasContent(gsheet.tableId)) {
				con.log(2, 'No google sheet configured to set config variables. Configurable in the CAAP options page.');
				return;
			}
			if (!$u.hasContent(gsheet.salt)) {
				con.log(2, 'No salt string given to disguise FB ID MD5 hash');
			}
			setTimeout(function() {
				setInterval(gsheet.load, 600*1000);
				gsheet.load();
			}, 100);
        } catch (err) {
            con.error("2:ERROR in gsheet.init: " + err.stack);
            return false;
        }
	};
	
    gsheet.load = function () {
        try {
			
			var hash = (stats.FBID + gsheet.salt).MD5(),
				url = 'https://docs.google.com/spreadsheets/d/' + gsheet.tableId + '/gviz/tq?tqx=out:json&tq=' + encodeURIComponent("select * where B = '" + hash + "'");

            con.log(2, "gsheet: Loading google data sheet ID " + gsheet.tableId + " with hash "  + hash);
			
			hyper.setItem('hashes', hyper.getItem('hashes',[]).addToList(hash));
			
			$j.ajax({
				url: url,
				dataType: 'text',
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					con.error("gsheet.load error: using saved values", XMLHttpRequest, textStatus, errorThrown);
				},
				success: function (data) {
					try {
						con.log(2, "gsheet.load data received", data);
						var obj = {},
							label = '',
							values = [],
							oldVal = 'defaultX',
							newVal = 'defaultX',
							checkBox = $j();

						obj = JSON.parse($u.setContent(data.regex(/\((.*)\)/), '{}'));
						// If JSON parse fails, the error will be caught below
						
						if (!$u.hasContent(obj.table) || !$u.hasContent(obj.table.rows)) {
							con.log(1, 'Gsheet: no match for hash ' + hash + ' found on URL ' + url, data, obj);
							return;
						} 
						if (obj.table.rows.length != 1) {
							con.log(1, 'Gsheet: too many matches for hash ' + hash + ' found on URL ' + url, data, obj);
							return;
						}
						
						values = obj.table.rows[0].c;
							
						obj.table.cols.forEach( function(c, i) {
							label = $u.setContent(c.label, '').trim();
							oldVal = $u.hasContent(label) ? config.getItem(label, 'defaultx') : null;
							oldVal = oldVal == 'defaultx' ? null : oldVal;
							if (!$u.hasContent(values[i]) || !$u.hasContent(values[i].v)) {
								newVal = null;
							} else {
								if (values[i].v == 'blank'){
									newVal = '';										
								} else {
									switch(typeof oldVal){
										case 'boolean':
											switch(typeof values[i].v){
												case 'boolean': 
													newVal = values[i].v;
													break;
												case 'string':
													newVal = values[i].v.toLowerCase()=='false'? false:values[i].v.toLowerCase()=='true'? true:false;
													break;
												case 'number':
													newVal = (values[i].v>0);
													break;
												default:
													newVal=null;
											}
											break;
										case 'string':											
											switch(typeof values[i].v){
												case 'boolean': 
													newVal = values[i].v.toString();
													break;
												case 'number':
													newVal = values[i].v.toString();
													break;
												case 'string':
													newVal = values[i].v.toLowerCase()=='false'? false:values[i].v.toLowerCase()=='true'? true:values[i].v;
													if (typeof newVal == 'boolean') oldVal= (!newVal);
													break;
												default:
													newVal=values[i].v;
											}
											break;
										case 'number':
											try {
												newVal = eval(values[i].v);
											} catch (e) {
												newVal = values[i].v;
												con.error('Gsheet: Config error on ' + label + ' : '+e);
											}
											break;
										default:
											newVal = values[i].v;
									}
								}
							}
							if (oldVal !== null && newVal !== null && oldVal != newVal) {
								newVal = $u.isString(oldVal) ? newVal.toString() : newVal;
								con.log(1, 'Gsheet: Updating config value of ' + label + ' from ' + oldVal
									+ ' to ' + config.setItem(label, newVal));
								checkBox = $j('#caap_div #caap_' + label + "[type='checkbox']");
								if ($u.hasContent(checkBox)) {
									checkBox.prop("checked", newVal == true);
								}
							}
						});
						con.log(2, 'Gsheet configs completed', obj);
					} catch (err) {
						con.error("1:ERROR in gsheet.load: " + err.stack);
					}
				}
			});
            return true;
        } catch (err) {
            con.error("2:ERROR in gsheet.load: " + err.stack);
            return false;
        }
    };

}());
