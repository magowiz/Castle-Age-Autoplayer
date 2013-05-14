// ==UserScript==
// @name           Castle Age Autoplayer
// @namespace      caap
// @description    Auto player for Castle Age
// @version        141.0.0
// @dev            173
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/*jslint white: true, browser: true, devel: true, undef: true,
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
    caapjQueryDataTables = "1.9.4",
    caapVersion = "141.0.0",
    devVersion = "173",
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
    schedule = null,
    general = {},
    monster = {},
    guild_monster = {},
    //arena = {},
    festival = {},
    feed = {},
    battle = {},
    town = {},
    spreadsheet = {},
    gifting = {},
    army = {},
    caap = {},
    con = {},
    conquest = {},
    conquestLands = {},
    guilds = {},
    retryDelay = 1000;

String.prototype.stripCaap = function() {
    return this.replace(/caap_/i, '');
};

String.prototype.numberOnly = function() {
    return parseFloat(this.replace(new RegExp("[^\\d\\.]", "g"), ''));
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
