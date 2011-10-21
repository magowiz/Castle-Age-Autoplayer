// ==UserScript==
// @name           Castle Age Autoplayer
// @namespace      caap
// @description    Auto player for Castle Age
// @version        141.0.0
// @dev            13
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*jslint white: true, browser: true, devel: true, undef: true, nomen: true, bitwise: true, plusplus: true, immed: true, regexp: true, eqeqeq: true, newcap: true */
/*global window,escape,jQuery,$j,rison,utility,$u,chrome,CAAP_SCOPE_RUN,self */
/*jslint maxlen: 512 */
//////////////////////////////////
//       External version checking
//////////////////////////////////
var caapjQuery = "1.6.4";
//////////////////////////////////
//       Globals
//////////////////////////////////

var	caapVersion = "141.0.0",
		devVersion = "13",
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
		s = null,
		db = null,
		sort = {},
		schedule = null,
		general = {},
		monster = {},
		guild_monster = {},
		//arena         = {},
		festival = {},
		feed = {},
		battle = {},
		town = {},
		spreadsheet = {},
		gifting = {},
		army = {},
		caap = {},
		con = null,
		retryDelay = 1000;

/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
String.prototype['stripCaap'] = function() {
	return this.replace(/caap_/i, '');
};
String.prototype['numberOnly'] = function() {
	return parseFloat(this.replace(new RegExp("[^\\d\\.]", "g"), ''));
};
String.prototype['parseTimer'] = function() {
	var a = [], b = 0, i = 0, l = 0;
	a = this.split(':');
	for( i = 0, l = a.length; i < l; i += 1) {
		b = b * 60 + parseInt(a[i], 10);
	}

	if(isNaN(b)) {
		b = -1;
	}

	return b;
};
/*jslint sub: false */