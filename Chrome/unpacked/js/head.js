// ==UserScript==
// @name           Castle Age Autoplayer
// @namespace      caap
// @description    Auto player for Castle Age
// @version        141.0.0
// @dev			289
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*jslint white: true, browser: true, devel: true, 
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,
schedule,gifting,state,army, general,session,monster,guild_monster */
/*jslint maxlen: 256 */

//////////////////////////////////
//       Globals
//////////////////////////////////

var caapjQuery = "1.8.3",
    caapjQueryUI = "1.9.2",
    caapjQueryDataTables = "1.10.11",
    caapVersion = "141.0.0",
    devVersion = "289",
    hiddenVar = true,
    caap_timeout = 0,
    image64 = {},
    offline = {},
    profiles = {},
    session = null,
    config = null,
    state = null,
    css = {},
    gm = null,
    ss = null,
    db = null,
    sort = {},
	worker = {},
	stats = {},
    schedule = null,
    guild_monster = {},
    spreadsheet = {},
    gifting = {},
    caap = {},
    con = {},
    conquestLands = {},
    guilds = {},
    retryDelay = 1000;

// For daylight savings time calc
Date.prototype.stdTimezoneOffset = function() {
	var jan = new Date(this.getFullYear(), 0, 1),
		jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

String.prototype.stripCaap = function() {
    return this.replace(/caap_/i, '');
};

String.prototype.spaces = function() {
    return this.replace('_', ' ');
};

String.prototype.underline = function() {
    return this.replace(/ /g, '_');
};

String.prototype.numberOnly = function() {
    return parseFloat(this.replace(new RegExp("[^\\d\\.]", "g"), ''));
};

String.prototype.regexd = function(reg, d) {
    return $u.setContent(this.regex(reg), d);
};

Number.prototype.numberOnly = function() {
    return this.valueOf();
};

Number.prototype.r1000 = function() {
    return (this / 1000).dp(0);
};

Array.prototype.flatten = function(f, lc) {
	 return this.map( function(o) {
		return lc ? o[f].toLowerCase() : o[f];
	});
};

Array.prototype.getObjIndex = function(f, v, lc) {
	 return this.flatten(f, lc).indexOf(v);
};

Array.prototype.hasObj = function(f, v) {
	 return this.getObjIndex(f, v) >= 0;
};

Array.prototype.addToList = function(v) {
	if (this.indexOf(v) < 0) {
		this.push(v);
	}
	return this;
};

Array.prototype.sum = function() {
	return this.reduce(function(a,b) {
		return a+b;
	}, 0);
};

Array.prototype.sumsList = function() {
	return this.map( function(a) {
		return a.sum();
	});
};

Array.prototype.removeFromList = function(v) {
	var i = this.indexOf(v);
	if (i > -1) {
		this.splice(i, 1);
	}
	return i > -1;
};

Array.prototype.filterByField = function(f, v) {
	 return this.filter( function(e) {
		return e[f] === v;
	});
};

Array.prototype.getObjByField = function(f, v, d) {
	 var i = this.getObjIndex(f, v);
    return i == -1 ? d : this[i];
};

Array.prototype.getObjByFieldLc = function(f, v, d) {
	 var i = this.getObjIndex(f, v.toLowerCase(), true);
    return i == -1 ? d : this[i];
};

Array.prototype.deleteObjs = function(f, v) {
	return this.filter( function(e) {
		return e[f] !== v;
	});
};

Array.prototype.listMatch = function(r) {
	var m = false;
	this.some( function(c) {
		m = c.regex(r); 
		return m;
	});
	return m;
};

String.prototype.parseTimer = function() {
    var a = [],
        b = 0,
        i = 0,
        l = 0;

    a = this.split(':');
    for( i = 0, l = a.length; i < l; i += 1) {
        b = b * 60 + parseInt(a[i], 10);
    }

    if(isNaN(b)) {
        b = -1;
    }

    a = null;

    return b;
};

function ignoreJSLintError() {
	1;
}
