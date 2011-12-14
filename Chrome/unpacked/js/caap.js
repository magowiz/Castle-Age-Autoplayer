     ////////////////////////////////////////////////////////////////////
    //                          caap OBJECT
    // this is the main object for the game, containing all methods, globals, etc.
    /////////////////////////////////////////////////////////////////////

    caap = {
        namespace           : "caap",
        caapDivObject       : {},
        caapTopObject       : {},
        caapTopMinObject    : {},
        caapPlayButtonDiv   : {},
        documentTitle       : '',
        newVersionAvailable : typeof CAAP_SCOPE_RUN !== 'undefined' ? (devVersion !== '0' ? (CAAP_SCOPE_RUN[1] > caapVersion || (CAAP_SCOPE_RUN[1] >= caapVersion && CAAP_SCOPE_RUN[2] > devVersion)) : (CAAP_SCOPE_RUN[1] > caapVersion)) : false,
        fbIframeDiv         : {},
        ajaxLoadIcon        : {},
        globalContainer     : {},
        caToolsDiv          : {},
        appBodyDiv          : {},
        pageletPresenceDiv  : {},
        tempAjax            : {},
        resultsWrapperDiv   : {},
        resultsText         : '',
        jWindow             : null,
        jss                 : "javascript",
        libs                : {
            jQuery     : 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js',
            jQueryUI   : 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js',
            farbtastic : 'https://castle-age-auto-player.googlecode.com/files/farbtastic.min.js',
            utility    : 'https://utility-js.googlecode.com/files/utility-0.2.3.min.js',
            dataTables : 'https://castle-age-auto-player.googlecode.com/files/jquery.dataTables-1.8.1.min.js'
        },
        removeLibs   : [],
        domain              : {
            which    : -1,
            protocol : ["http://", "https://"],
            ptype    : 0,
            url      : ["apps.facebook.com/castle_age", "apps.facebook.com/reqs.php#confirm_46755028429_0", "web3.castleagegame.com/castle_ws", "web.castleagegame.com/castle", "www.facebook.com/dialog/apprequests?access_token=46755028429"],
            /*
            id       : ["app46755028429_", "", ""],
            ajax     : ["a46755028429_", "", ""],
            */
            id       : ["", "", "", "", ""],
            ajax     : ["", "", "", "", ""],
            link     : "",
            altered  : "",
            inIframe : false
        },

        setDomWaiting: function (url) {
            var update = $u.hasContent(url) && !session.getItem('clickUrl', '').hasIndexOf(url);
            con.log(3, "setDomWaiting update", update);
            if (update) {
                session.setItem('clickUrl', url);
            }

            if (update || !session.getItem("waitingForDomLoad", false)) {
                con.log(3, "waitingForDomLoad", session.getItem('clickUrl', ''));
                schedule.setItem("clickedOnSomething", 0);
                session.setItem("waitingForDomLoad", true);
            }
        },

        getDomWaiting: function () {
            return session.getItem("waitingForDomLoad", false);
        },

        clearDomWaiting: function (url) {
            con.log(3, "clearDomWaiting");
            schedule.setItem("clickedOnSomething", 3600);
            session.setItem("waitingForDomLoad", false);
        },

        sessionVarsInit: function () {
            session.setItem("lastReload", Date.now());
            session.setItem("pageLoadCounter", 0);
            session.setItem("flagReload", false);
            session.setItem("delayMain", false);
            session.setItem("pageLoadOK", true);
            session.setItem('clickUrl', window.location.href);
            session.setItem("waitingForDomLoad", false);
        },

        dataRegister: {
            "config.options":  {
                "get": function () {
                    return config.getAll();
                },
                "set": function (value) {
                    config.setAll(value);
                },
                "loaded": false
            },
            "state.flags":  {
                "get": function () {
                    return state.getAll();
                },
                "set": function (value) {
                    state.setAll(value);
                },
                "loaded": false
            },
            "schedule.timers":  {
                "get": function () {
                    return schedule.getAll();
                },
                "set": function (value) {
                    schedule.setAll(value);
                },
                "loaded": false
            },
            "caap.stats": {
                "get": function () {
                    return caap.stats;
                },
                "set": function (value) {
                    caap.stats = value;
                },
                "save": function (src) {
                    caap.saveStats(src);
                },
                "loaded": false
            },
            "caap.demi": {
                "get": function () {
                    return caap.demi;
                },
                "set": function (value) {
                    caap.demi = value;
                },
                "save": function (src) {
                    caap.SaveDemi(src);
                },
                "loaded": false
            },
            "gifting.gifts.records":  {
                "get": function () {
                    return gifting.gifts.records;
                },
                "set": function (value) {
                    gifting.gifts.records = value;
                },
                "save": function (src) {
                    gifting.save("gifts", src);
                },
                "loaded": false
            },
            "gifting.queue.records":  {
                "get": function () {
                    return gifting.queue.records;
                },
                "set": function (value) {
                    gifting.queue.records = value;
                },
                "save": function (src) {
                    gifting.save("queue", src);
                },
                "loaded": false
            },
            "gifting.history.records":  {
                "get": function () {
                    return gifting.history.records;
                },
                "set": function (value) {
                    gifting.history.records = value;
                },
                "save": function (src) {
                    gifting.save("history", src);
                },
                "loaded": false
            },
            "gifting.cachedGiftEntry":  {
                "get": function () {
                    return gifting.cachedGiftEntry;
                },
                "set": function (value) {
                    gifting.cachedGiftEntry = value;
                },
                "save": function (src) {
                    gifting.setCurrent(gifting.cachedGiftEntry, false, src);
                },
                "loaded": false
            },
            "army.records":  {
                "get": function () {
                    return army.records;
                },
                "set": function (value) {
                    army.records = value;
                },
                "save": function (src) {
                    army.save(src);
                },
                "loaded": false
            },
            "battle.records":  {
                "get": function () {
                    return battle.records;
                },
                "set": function (value) {
                    battle.records = value;
                },
                "save": function (src) {
                    battle.save(src);
                },
                "loaded": false
            },
            "battle.reconRecords":  {
                "get": function () {
                    return battle.reconRecords;
                },
                "set": function (value) {
                    battle.reconRecords = value;
                },
                "save": function (src) {
                    battle.saveRecon(src);
                },
                "loaded": false
            },
            "feed.records":  {
                "get": function () {
                    return feed.records;
                },
                "set": function (value) {
                    feed.records = value;
                },
                "save": function (src) {
                    feed.save(src);
                },
                "loaded": false
            },
            "feed.recordsSortable":  {
                "get": function () {
                    return feed.recordsSortable;
                },
                "set": function (value) {
                    feed.recordsSortable = value;
                },
                "loaded": false
            },
            "feed.monsterList":  {
                "get": function () {
                    return feed.monsterList;
                },
                "set": function (value) {
                    feed.monsterList = value;
                },
                "save": function (src) {
                    feed.saveList(src);
                },
                "loaded": false
            },
            "festival.records":  {
                "get": function () {
                    return festival.records;
                },
                "set": function (value) {
                    festival.records = value;
                },
                "save": function (src) {
                    festival.save(src);
                },
                "loaded": false
            },
            "general.records":  {
                "get": function () {
                    return general.records;
                },
                "set": function (value) {
                    general.records = value;
                },
                "save": function (src) {
                    general.save(src);
                },
                "loaded": false
            },
            "guild_monster.records":  {
                "get": function () {
                    return guild_monster.records;
                },
                "set": function (value) {
                    guild_monster.records = value;
                },
                "save": function (src) {
                    guild_monster.save(src);
                },
                "loaded": false
            },
            "monster.records":  {
                "get": function () {
                    return monster.records;
                },
                "set": function (value) {
                    monster.records = value;
                },
                "save": function (src) {
                    monster.save(src);
                },
                "loaded": false
            },
            "spreadsheet.records":  {
                "get": function () {
                    return spreadsheet.records;
                },
                "set": function (value) {
                    spreadsheet.records = value;
                },
                "save": function (src) {
                    spreadsheet.save(src);
                },
                "loaded": false
            },
            "town.soldiers":  {
                "get": function () {
                    return town.soldiers;
                },
                "set": function (value) {
                    town.soldiers = value;
                },
                "save": function (src) {
                    town.save("soldiers", src);
                },
                "loaded": false
            },
            "town.item":  {
                "get": function () {
                    return town.item;
                },
                "set": function (value) {
                    town.item = value;
                },
                "save": function (src) {
                    town.save("item", src);
                },
                "loaded": false
            },
            "town.magic":  {
                "get": function () {
                    return town.magic;
                },
                "set": function (value) {
                    town.magic = value;
                },
                "save": function (src) {
                    town.save("magic", src);
                },
                "loaded": false
            }
        },

        mTarget: {
            "caapfb": {
                ref: null,
                url: "*"
            },
            "caapif": {
                ref: null,
                url: "*"
            },
            "caapifp": {
                ref: null,
                url: "*"
            }
        },

        postMessage: function (msg) {
            try {
                var port = $u.is_chrome ? caap.port : caap.mTarget[msg.dest].ref,
                    msj = $u.is_chrome ? msg : JSON.stringify(msg),
                    url = $u.is_chrome ? null : $u.setContent(caap.mTarget[msg.dest].url, "*");

                if (!port) {
                    throw "No port available";
                }

                port.postMessage(msj, url);
            } catch (err) {
                con.error("ERROR in postMessage: " + err, msg);
                //alert("ERROR in postMessage: " + err);
                $u.reload();
            }
        },

        messaging: {
            connected: ["caap"],
            dataRegisterLoaded: false,
            connect: function () {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caap")) {
                        caap.postMessage({source: "caapfb", dest: "caap", message: "connect", data: ""});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caap")) {
                        caap.postMessage({source: "caapif", dest: ($u.is_chrome ? "caap" : "caapfb"), message: "connect", data: ""});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caap")) {
                        caap.postMessage({source: "caapifp", dest: ($u.is_chrome ? "caap" : "caapif"), message: "connect", data: ""});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connect";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.connect: " + err);
                    return false;
                }
            },
            setItem: function (name, value) {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "setItem", data: {name: name, value: value}});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "setItem", data: {name: name, value: value}});
                        session.incItem("messageCount");
                    } else {
                        if (caap.domain.which !== 4) {
                            throw "Wrong domain or destination not connected";
                        }
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.setItem: " + err);
                    return false;
                }
            },
            getItem: function (msg, data) {
                try {
                    if (caap.messaging.connected.hasIndexOf(msg.source)) {
                        caap.postMessage({source: msg.dest, dest: msg.source, message: "getItem", data: data});
                        session.incItem("messageCount");
                    } else {
                        throw "Destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.getItem: " + err);
                    return false;
                }
            },
            ok: function (msg) {
                try {
                    if ((caap.domain.which === 0 || caap.domain.which === 3 || caap.domain.which === 4) && caap.messaging.connected.hasIndexOf(msg.source)) {
                        caap.postMessage({source: msg.dest, dest: msg.source, message: "ok", data: msg.message});
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.ok: " + err);
                    return false;
                }
            },
            visitUrl: function (url) {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "visitUrl", data: url});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.visitUrl: " + err);
                    return false;
                }
            },
            setDivContent: function (name, value, hide) {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "setDivContent", data: {name: name, value: value, hide: (hide ? true : false)}});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.setDivContent: " + err);
                    return false;
                }
            },
            setCheckedIds: function (idArray) {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapifp")) {
                        session.setItem("delayMain", true);
                        caap.postMessage({source: "caapif", dest: "caapifp", message: "setCheckedIds", data: idArray});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.setCheckedIds: " + err);
                    return false;
                }
            },
            restartListener: function (inform) {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "restartListener", data: ""});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        if (inform) {
                            caap.postMessage({source: "caapif", dest: "caapfb", message: "restartListener", data: ""});
                            session.incItem("messageCount");
                        }
                    } else {
                        if (caap.domain.which === 0 || caap.domain.which === 3) {
                            throw "Destination not connected";
                        }
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.restartListener: " + err);
                    return false;
                }
            },
            pauseListener: function (inform) {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "pauseListener", data: ""});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        if (inform) {
                            caap.postMessage({source: "caapif", dest: "caapfb", message: "pauseListener", data: ""});
                            session.incItem("messageCount");
                        }
                    } else {
                        if (caap.domain.which === 0 || caap.domain.which === 3) {
                            throw "Destination not connected";
                        }
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.pauseListener: " + err);
                    return false;
                }
            },
            ajaxGiftCheck: function () {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "ajaxGiftCheck", data: ""});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.ajaxGiftCheck: " + err);
                    return false;
                }
            },
            changeDropDownList: function (idName, dropList, option) {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "changeDropDownList", data: {idName: idName, dropList: dropList, option: option}});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.changeDropDownList: " + err);
                    return false;
                }
            },
            selectDropOption: function (idName, value) {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "selectDropOption", data: {idName: idName, value: value}});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.selectDropOption: " + err);
                    return false;
                }
            },
            hello: function (msg) {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "hello", data: ""});
                        session.incItem("messageCount");
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "hello", data: ""});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.hello: " + err);
                    return false;
                }
            },
            sentGifts: function (msg, results) {
                try {
                    if (caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: msg.dest, dest: msg.source, message: "sentGifts", data: results});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.sentGifts: " + err);
                    return false;
                }
            },
            broadcast: function () {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "broadcast", data: caap.messaging.connected});
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.broadcast: " + err);
                    return false;
                }
            },
            cntd: function (msg) {
                try {
                    if ((caap.domain.which === 0 || caap.domain.which === 3) && caap.messaging.connected.hasIndexOf(msg.source)) {
                        caap.postMessage({source: msg.dest, dest: msg.source, message: "connected", data: caap.messaging.connected});
                        session.incItem("messageCount");
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.cntd: " + err);
                    return false;
                }
            },
            disconnect: function (msg) {
                try {
                    if (caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapifp", dest: "caapif", message: "disconnect", data: ""});
                        caap.caapifpShutdown();
                    } else if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "disconnect", data: ""});
                        caap.caapifShutdown();
                    } else if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "disconnect", data: ""});
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.disconnect: " + err);
                    return false;
                }
            },
            scrollToTop: function () {
                try {
                    if (caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                        caap.postMessage({source: "caapif", dest: "caapfb", message: "scrollToTop", data: ""});
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.scrollToTop: " + err);
                    return false;
                }
            },
            styleChange: function () {
                try {
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                        caap.postMessage({source: "caapfb", dest: "caapif", message: "styleChange", data: ""});
                    } else {
                        throw "Wrong domain or destination not connected";
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in messaging.styleChange: " + err);
                    return false;
                }
            }
        },

        scrollToTop: function () {
            window.scrollTo(0, config.getItem("scrollToPosition", 0));
        },

        showRequestForm: (function (tit, msg, track, request_params) {
            FB.api({
                method: 'fql.query',
                query: 'SELECT uid FROM user WHERE is_app_user = 1 AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
            }, function (result) {
                var i,
                    appUsers = [],
                    filterLists = [],
                    lists = {
                        0x00 : {
                            name: 'Send',
                            list: 'caap_giftSend',
                            gift: true,
                            fest: false,
                            recr: false,
                            mons: false,
                            prom: false,
                            all : false
                        },
                        0x01 : {
                            name: 'app_users',
                            list: '',
                            gift: false,
                            fest: false,
                            recr: false,
                            mons: false,
                            prom: false,
                            all : true
                        },
                        0x02 : {
                            name: 'Custom',
                            list: 'caap_giftCustom',
                            gift: true,
                            fest: false,
                            recr: false,
                            mons: true,
                            prom: true,
                            all : false
                        },
                        0x03 : {
                            name: 'Guild',
                            list: 'caap_giftGuild',
                            gift: true,
                            fest: true,
                            recr: false,
                            mons: true,
                            prom: true,
                            all : false
                        },
                        0x04 : {
                            name: 'Gift Queue',
                            list: 'caap_giftQueue',
                            gift: true,
                            fest: false,
                            recr: false,
                            mons: false,
                            prom: false,
                            all : false
                        },
                        0x05 : {
                            name: 'Gift History',
                            list: 'caap_giftHistory',
                            gift: true,
                            fest: true,
                            recr: false,
                            mons: false,
                            prom: true,
                            all : false
                        },
                        0x06 : {
                            name: 'all',
                            list: '',
                            gift: false,
                            fest: false,
                            recr: true,
                            mons: false,
                            prom: false,
                            all : false
                        },
                        0x07 : {
                            name: 'app_non_users',
                            list: '',
                            gift: false,
                            fest: false,
                            recr: true,
                            mons: false,
                            prom: false,
                            all : false
                        },
                        0x08 : {
                            name: 'Non Followers',
                            list: 'caap_nfollowers',
                            gift: false,
                            fest: true,
                            recr: false,
                            mons: false,
                            prom: false,
                            all : false
                        }
                    },
                    list,
                    limit = false,
                    gift = request_params.indexOf("gift=") >= 0,
                    fest = request_params.indexOf("fest=") >= 0,
                    recr = msg.indexOf("recruiting") >= 0,
                    mons = request_params.indexOf("battle_monster") >= 0,
                    prom = request_params.indexOf("popup_promo_create") >= 0;

                for (i in result) {
                    if (result.hasOwnProperty(i)) {
                        appUsers.push(parseInt(result[i].uid, 10));
                    }
                }

                for (i in lists) {
                    if (lists.hasOwnProperty(i)) {
                        if (!lists[i].all) {
                            if ((!gift && !fest && !recr && !mons && !prom) || (gift && !lists[i].gift) || (fest && !lists[i].fest) || (recr && !lists[i].recr) || (mons && !lists[i].mons) || (prom && !lists[i].prom)) {
                                continue;
                            }
                        }

                        list = '';
                        if (lists[i].list) {
                            list = sessionStorage.getItem(lists[i].list);
                            list = list && list.length ? JSON.parse(list).filter(function (member) {
                                    return appUsers.indexOf(member) >= 0;
                                }) : null;

                            if (list && list.length) {
                                filterLists.push({name: lists[i].name, user_ids: list});
                                if (lists[i].name === "Send") {
                                    limit = true;
                                }
                            }
                        } else {
                            filterLists.push(lists[i].name);
                        }

                        if (limit && lists[i].name === "app_users") {
                            break;
                        }
                    }
                }

                console.log("filterLists", filterLists);
                FB.ui({
                    method: 'apprequests',
                    message: msg,
                    filters: filterLists,
                    data: track,
                    title: tit
                }, function(result) {
                    $('.fb_dialog_iframe').each(function() {
                        $(this).remove();
                    });

                    sessionStorage.setItem("caap_giftResult", JSON.stringify(result));
                    if (result && result.request_ids) {
                        var request_id_string = String(result.request_ids),
                            request_id_array = request_id_string.split(','),
                            request_id_count = request_id_array.length,
                            params = 'ajax=1&signed_request=SIGNED_REQUEST';

                        $.ajax({
                            url: 'request_handler.php?' + request_params + '&request_ids=' + result.request_ids,
                            context: document.body,
                            data: params,
                            type: 'POST',
                            success: function(data) {
                                document.getElementById('results_container').innerHTML = request_id_count + (request_id_count === 1 ? ' request' : ' requests') + ' sent! By CAAP';
                                FB.XFBML.parse(document.getElementById('results_container'));
                                $('#results_container').show();
                            }
                        });
                    }
                });
            });
        }).toString(),

        getSigned: function () {
            try {
                var params = $u.setContent($j('script').text(), '').regex(new RegExp("params \\+= '&signed_request(.*)'", 'gmi')),
                    inject;

                if ($u.hasContent(params)) {
                    params = $u.isArray(params) ? params[0] : params;
                    session.setItem("signedRequest", params);
                    con.log(2, "Ajax signed request available");
// disabled this because it causes gifts to be already collected.
//                    caap.showRequestForm = "showRequestForm = " + caap.showRequestForm.replace(/SIGNED_REQUEST/gm, params);
//                    $u.injectScript(caap.showRequestForm, true);
                } else {
                    con.warn("caap.signedRequest is empty");
                }

                return true;
            } catch (err) {
                con.error("ERROR in getSigned: " + err);
                return false;
            }
        },

        mainCaapLoop: function () {
            caap.makeActionsList();
            caap.waitMilliSecs = 8000;
            caap.waitMainLoop();
            caap.reloadOccasionally();
        },

        getMsgItem: function (msg) {
            try {
                var done = true,
                    it;

                caap.dataRegister[msg.data.name]['set'](msg.data.value);
                caap.dataRegister[msg.data.name]["loaded"] = true;
                for (it in caap.dataRegister) {
                    if (caap.dataRegister.hasOwnProperty(it)) {
                        if (!done) {
                            break;
                        }

                        if (!caap.dataRegister[it]["loaded"]) {
                            done = false;
                        }
                    }
                }

                if (done) {
                    con.log_level = config.getItem('DebugLevel', 1);
                    con.log(2, "iframe all data loaded");
                    //con.log(2, "config", config);
                    //con.log(2, "state", state);
                    //con.log(2, "schedule", schedule);
                    caap.messaging.dataRegisterLoaded = true;
                    ss = new $u.StorageHelper({
                            'namespace'    : caap.namespace,
                            'storage_id'   : caap.stats['FBID'].toString(),
                            'storage_type' : 'sessionStorage'
                        });

                    caap.setGiftGuild();
                    caap.setGiftQueue();
                    caap.setGiftHistory();
                    caap.setGiftCustom();
                    //state.setItem('caapPause', 'none');
                    //state.setItem('ReleaseControl', true);
                    window.setTimeout(caap.init, 200);
                    caap.mainCaapLoop();
                }

                return true;
            } catch (err) {
                con.error("ERROR in getMsgItem: " + err);
                return false;
            }
        },

        setCheckedIds: function (msg) {
            try {
                con.log(2, "setCheckedIds received", msg.data);
                var results = {
                        'notChecked' : [],
                        'areChecked' : [],
                        'notFound'   : [],
                        'areFound'   : []
                    },
                    it  = 0,
                    len = msg.data.length;

                function doChecks() {
                    var input,
                        checkState;

                    for (it = 0; it < len; it += 1) {
                        checkState = false;
                        input = $j("input[value='" + msg.data[it] + "']");
                        if ($u.hasContent(input)) {
                            caap.click(input);
                            results['areFound'].push(msg.data[it]);
                            checkState = input.is(":checked");
                            if (checkState) {
                                results['areChecked'].push(msg.data[it]);
                            } else {
                                results['notChecked'].push(msg.data[it]);
                            }

                        } else {
                            results['notFound'].push(msg.data[it]);
                        }
                    }

                    input = $u.hasContent(results['areChecked']) ? $j("input[name='ok_clicked']") : $j("input[name='cancel_clicked']");
                    if (input) {
                        caap.messaging.sentGifts(msg, results);
                        caap.click(input);
                    }
                }

                window.setTimeout(function () {
                    var objDiv = $j('.fbProfileBrowserListContainer').parent(),
                        domDiv = objDiv.get(1),
                        to;

                    objDiv.bind("DOMNodeInserted", function () {
                        con.log(3, "Scroll ...");
                        window.clearTimeout(to);
                        domDiv.scrollTop = domDiv.scrollHeight;
                        to = window.setTimeout(doChecks, 5000);
                    });

                    if (domDiv) {
                        domDiv.scrollTop = domDiv.scrollHeight;
                    }

                    to = window.setTimeout(doChecks, 5000);
                }, 5000);

                return true;
            } catch (err) {
                con.error("ERROR in setCheckedIds: " + err);
                return false;
            }
        },

        initDb: function (FBID) {
            if (caap.domain.which === 3 || caap.domain.which === 4) {
                config = new $u.VarsHelper();
                config.oldSetItem = config.setItem;
                config.setItem = function (name, value) {
                    config.oldSetItem(name, value);
                    caap.messaging.setItem('config.options', config.getAll());
                    return config.getItem(name, value);
                };

                state = new $u.VarsHelper();
                state.oldSetItem = state.setItem;
                state.setItem = function (name, value) {
                    state.oldSetItem(name, value);
                    caap.messaging.setItem('state.flags', state.getAll());
                    return state.getItem(name, value);
                };

                schedule = new $u.ScheduleVarsHelper();
                schedule.oldSetItem = schedule.setItem;
                schedule.setItem = function (name, seconds, randomSecs) {
                    schedule.oldSetItem(name, seconds, randomSecs);
                    caap.messaging.setItem('schedule.timers', schedule.getAll());
                    return schedule.getItem(name);
                };
            } else {
                db = new $u.IDBHelperAsync();
                if (db && db.available) {
                    //db.onsuccess = function () {con.log(1, "db", db)};
                    db.open(caap.namespace + "." + FBID, "CAAP Database", "1");
                }

                //con.log(1, "$u", $u);
                gm = new $u.StorageHelper({
                        'namespace'    : caap.namespace,
                        'storage_id'   : FBID.toString(),
                        'storage_type' : 'localStorage'
                    });

                //con.log(1, "gm", gm);
                ss = new $u.StorageHelper({
                        'namespace'    : caap.namespace,
                        'storage_id'   : FBID.toString(),
                        'storage_type' : 'sessionStorage'
                    });

                //con.log(1, "ss", ss);
                //gm.clear('0');
                config = new $u.ConfigHelper("config.options", "current", {
                        'namespace'    : caap.namespace,
                        'storage_id'   : FBID.toString(),
                        'storage_type' : 'localStorage'
                    });

                if (caap.domain.which === 0) {
                    config.oldSave = config.save;
                    config.save = function () {
                        config.oldSave();
                        con.log(3, "config.save", config);
                        if (caap.messaging.connected.hasIndexOf("caapif")) {
                            con.log(3, "config.save send");
                            caap.messaging.setItem('config.options', config.getAll());
                        }
                    };
                }

                state = new $u.ConfigHelper("state.flags", "current", {
                        'namespace'    : caap.namespace,
                        'storage_id'   : FBID.toString(),
                        'storage_type' : 'localStorage'
                    });

                if (caap.domain.which === 0) {
                    state.oldSave = state.save;
                    state.save = function () {
                        state.oldSave();
                        con.log(3, "state.save", state);
                        if (caap.messaging.connected.hasIndexOf("caapif")) {
                            con.log(3, "state.save send");
                            caap.messaging.setItem('state.flags', state.getAll());
                        }
                    };
                }

                schedule = new $u.ScheduleStorageHelper("schedule.timers", "current", {
                        'namespace'    : caap.namespace,
                        'storage_id'   : FBID.toString(),
                        'storage_type' : 'localStorage'
                    });

                if (caap.domain.which === 0) {
                    schedule.oldSave = schedule.save;
                    schedule.save = function () {
                        schedule.oldSave();
                        con.log(3, "schedule.save", schedule);
                        if (caap.messaging.connected.hasIndexOf("caapif")) {
                            con.log(3, "schedule.save send");
                            caap.messaging.setItem('schedule.timers', schedule.getAll());
                        }
                    };
                }
            }
        },

        giftingHandler: function (msg, event) {
            if ((msg.source === "caap" || msg.source === "caapif" || msg.source === "caapfb") && msg.dest === "caapifp") {
                switch (msg.message) {
                case "ok":
                    session.decItem("messageCount");
                    break;
                case "connected":
                    caap.messaging.connected = msg.data;
                    caap.messaging.ok(msg);
                    con.log(3, "current connections", caap.messaging.connected);
                    break;
                case "disconnect":
                    caap.messaging.connected.removeByValue(msg.source);
                    con.log(2, "current connections", caap.messaging.connected);
                    break;
                case "broadcast":
                    if (msg.source === ($u.is_chrome ? "caap" : "caapif") && msg.data.name === "connected") {
                        caap.messaging.connected = msg.data.value;
                        caap.messaging.ok(msg);
                        con.log(3, "broadcast connected received", caap.messaging.connected);
                    }

                    break;
                case "setCheckedIds":
                    caap.messaging.ok(msg);
                    caap.setCheckedIds(msg);
                    break;
                default:
                }

                con.log(4, "caap.messageCount", session.getItem("messageCount"));
            }
        },

        caapifpPMListener: function (e) {
            try {
                if (caap.domain.which === 4) {
                    if (e.origin.hasIndexOf("web.castleagegame.com") || e.origin.hasIndexOf("apps.facebook.com")) {
                        var msg = JSON.parse(e.data);
                        con.log(3, "caapifp got message", msg, e.origin);
                        caap.mTarget[msg.source].url = e.origin;
                        caap.mTarget[msg.source].ref = e.source;
                        caap.giftingHandler(msg);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapifpPMListener: " + err, e);
            }
        },

        caapifpStartup: function () {
            try {
                if (caap.domain.which === 4) {
                    if ($u.is_chrome) {
                        caap.port = chrome.extension.connect({name: "caapifp"});
                        caap.port.onMessage.addListener(caap.giftingHandler);
                    } else {
                        con.log(3, "caapifp add listeners");
                        caap.messaging.connected.push("caapifp");
                        caap.mTarget["caapif"].ref = window.parent;
                        $u.addEvent(window, "message", caap.caapifpPMListener);
                        caap.jWindow.bind("unload", caap.messaging.disconnect);
                    }

                    caap.messaging.connect();
                }
            } catch (err) {
                con.error("ERROR in caapifpStartup: " + err);
            }
        },

        caapifpShutdown: function () {
            try {
                if (caap.domain.which === 4) {
                    if ($u.is_chrome) {
                        caap.port.onMessage.removeListener(caap.giftingHandler);
                        caap.port = null;
                    } else {
                        $u.removeEvent(window, "message", caap.caapifpPMListener);
                        caap.jWindow.unbind("unload", caap.messaging.disconnect);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapifpShutdown: " + err);
            }
        },

        iframeHandler: function (msg, event) {
            if ((msg.source === "caap" || msg.source === "caapfb" || msg.source === "caapifp") && msg.dest === "caapif") {
                switch (msg.message) {
                case "ok":
                    session.decItem("messageCount");
                    break;
                case "connect":
                    if (!caap.messaging.connected.hasIndexOf(msg.source)) {
                        caap.messaging.connected.push(msg.source);
                    }

                    caap.messaging.ok(msg);
                    con.log(3, "connect current connections", caap.messaging.connected);
                    caap.messaging.cntd(msg);
                    break;
                case "connected":
                    caap.messaging.connected = msg.data;
                    caap.messaging.ok(msg);
                    con.log(3, "current connections", caap.messaging.connected);
                    if (!caap.messaging.dataRegisterLoaded) {
                        caap.messaging.hello(msg);
                    }

                    break;
                case "disconnect":
                    caap.messaging.connected.removeByValue(msg.source);
                    con.log(2, "current connections", caap.messaging.connected, msg.source);
                    break;
                case "broadcast":
                    if (msg.source === ($u.is_chrome ? "caap" : "caapif") && msg.data.name === "connected") {
                        caap.messaging.connected = msg.data.value;
                        caap.messaging.ok(msg);
                        con.log(3, "broadcast connected received", caap.messaging.connected);
                        if (!caap.messaging.dataRegisterLoaded) {
                            caap.messaging.hello(msg);
                        }
                    }

                    break;
                case "hello":
                    caap.messaging.ok(msg);
                    for (var it in caap.dataRegister) {
                        if (caap.dataRegister.hasOwnProperty(it)) {
                            caap.messaging.getItem(msg, it);
                        }
                    }

                    break;
                case "getItem":
                    caap.messaging.ok(msg);
                    caap.getMsgItem(msg);
                    break;
                case "setItem":
                    caap.messaging.ok(msg);
                    //con.log(1, "iframe got setItem", msg);
                    caap.dataRegister[msg.data.name]['set'](msg.data.value);
                    caap.dataRegister[msg.data.name]["loaded"] = true;
                    if (msg.data.name === "config.options") {
                        caap.setGiftCustom();
                    }

                    break;
                case "pauseListener":
                    caap.messaging.ok(msg);
                    caap.pauseListener();
                    break;
                case "restartListener":
                    caap.messaging.ok(msg);
                    caap.restartListener();
                    break;
                case "ajaxGiftCheck":
                    caap.messaging.ok(msg);
                    schedule.setItem("ajaxGiftCheck", 0);
                    break;
                case "sentGifts":
                    caap.messaging.ok(msg);
                    sessionStorage.removeItem("caap_giftSend");
                    gifting.queue.sentGifts(msg);
                    break;
                case "styleChange":
                    caap.messaging.ok(msg);
                    con.log(4, "iframe got styleChange", msg);
                    caap.colorUpdate();
                    break;
                default:
                }

                con.log(4, "caap.messageCount", session.getItem("messageCount"));
            }
        },

        caapifPMListener: function (e) {
            try {
                if (caap.domain.which === 3) {
                    if (e.origin.hasIndexOf("apps.facebook.com") || e.origin.hasIndexOf("www.facebook.com")) {
                        var msg = JSON.parse(e.data);
                        con.log(3, "caapif got message", msg, e.origin);
                        caap.mTarget[msg.source].url = e.origin;
                        caap.mTarget[msg.source].ref = e.source;
                        caap.iframeHandler(msg, e);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapifPMListener: " + err, e);
            }
        },

        caapifStartup: function () {
            try {
                if (caap.domain.which === 3) {
                    if ($u.is_chrome) {
                        caap.port = chrome.extension.connect({name: "caapif"});
                        caap.port.onMessage.addListener(caap.iframeHandler);
                    } else {
                        caap.messaging.connected.push("caapif");
                        //caap.jWindow.bind("message", caap.caapifPMListener);
                        $u.addEvent(window, "message", caap.caapifPMListener);
                        caap.jWindow.bind("unload", caap.messaging.disconnect);
                        caap.mTarget["caapfb"].ref = window.parent;
                    }

                    caap.messaging.connect();
                }
            } catch (err) {
                con.error("ERROR in caapfbStartup: " + err);
            }
        },

        caapifShutdown: function () {
            try {
                if (caap.domain.which === 3) {
                    if ($u.is_chrome) {
                        caap.port.onMessage.removeListener(caap.iframeHandler);
                        caap.port = null;
                    } else {
                        //caap.jWindow.unbind("message", caap.caapifPMListener);
                        $u.removeEvent(window, "message", caap.caapifPMListener);
                        caap.jWindow.unbind("unload", caap.messaging.disconnect);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapifShutdown: " + err);
            }
        },

        chromeHandler: function (msg, event) {
            if ((msg.source === "caap" || msg.source === "caapif" || msg.source === "caapifp") && msg.dest === "caapfb") {
                switch (msg.message) {
                case "ok":
                    session.decItem("messageCount");
                    break;
                case "connect":
                    if (!caap.messaging.connected.hasIndexOf(msg.source)) {
                        caap.messaging.connected.push(msg.source);
                    }

                    caap.messaging.ok(msg);
                    con.log(3, "connect current connections", caap.messaging.connected);
                    caap.messaging.cntd(msg);
                    break;
                case "connected":
                    caap.messaging.connected = msg.data;
                    caap.messaging.ok(msg);
                    con.log(3, "current connections", caap.messaging.connected);
                    break;
                case "disconnect":
                    caap.messaging.connected.removeByValue(msg.source);
                    con.log(2, "current connections", caap.messaging.connected, msg.source);
                    break;
                case "broadcast":
                    if (msg.source === "caap" && msg.data.name === "connected") {
                        caap.messaging.connected = msg.data.value;
                        caap.messaging.ok(msg);
                        con.log(3, "broadcast connected received", caap.messaging.connected);
                    }

                    break;
                case "hello":
                    caap.messaging.ok(msg);
                    caap.messaging.hello(msg);
                    break;
                case "getItem":
                    caap.messaging.ok(msg);
                    caap.messaging.getItem(msg, {name: msg.data, value: caap.dataRegister[msg.data]['get']()});
                    break;
                case "setItem":
                    caap.messaging.ok(msg);
                    caap.dataRegister[msg.data.name]['set'](msg.data.value);
                    if ($u.isFunction(caap.dataRegister[msg.data.name]['save'])) {
                        caap.dataRegister[msg.data.name]['save'](msg.source);
                    } else {
                        con.log(4, "no save function", msg.data.name);
                    }

                    break;
                case "visitUrl":
                    caap.messaging.ok(msg);
                    caap.visitUrl(msg.data);
                    break;
                case "setDivContent":
                    caap.messaging.ok(msg);
                    caap.setDivContent(msg.data.name, msg.data.value, caap.caapDivObject, msg.data.hide);
                    break;
                case "changeDropDownList":
                    caap.messaging.ok(msg);
                    con.log(4, "changeDropDownList", msg);
                    caap.changeDropDownList(msg.data.idName, msg.data.dropList, msg.data.option);
                    break;
                case "selectDropOption":
                    caap.messaging.ok(msg);
                    con.log(4, "selectDropOption", msg);
                    caap.selectDropOption(msg.data.idName, msg.data.value);
                    break;
                case "scrollToTop":
                    caap.messaging.ok(msg);
                    con.log(4, "scrollToTop", msg);
                    caap.scrollToTop(msg.data);
                    break;
                default:
                }

                con.log(4, "caap.messageCount", session.getItem("messageCount"));
            }
        },

        caapfbPMListener: function (e) {
            try {
                if (caap.domain.which === 0) {
                    if (e.origin.hasIndexOf("web.castleagegame.com")) {
                        var msg = JSON.parse(e.data);
                        con.log(3, "caapfb got message", msg, e.origin);
                        caap.mTarget[msg.source].url = e.origin;
                        caap.mTarget[msg.source].ref = e.source;
                        caap.chromeHandler(msg, e);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapfbPMListener: " + err);
            }
        },

        caapfbStartup: function () {
            try {
                if (caap.domain.which === 0) {
                    if ($u.is_chrome) {
                        caap.port = chrome.extension.connect({name: "caapfb"});
                        caap.port.onMessage.addListener(caap.chromeHandler);
                        caap.messaging.connect();
                    } else {
                        caap.messaging.connected.push("caapfb");
                        //$j(window).bind("message", caap.caapfbPMListener);
                        $u.addEvent(window, "message", caap.caapfbPMListener);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapfbStartup: " + err);
            }
        },

        caapfbShutdown: function () {
            try {
                if (caap.domain.which === 0) {
                    if ($u.is_chrome) {
                        caap.port.onMessage.removeListener(caap.chromeHandler);
                        caap.port = null;
                    } else {
                        //$j(window).unbind("message", caap.caapfbPMListener);
                        $u.removeEvent(window, "message", caap.caapfbPMListener);
                    }
                }
            } catch (err) {
                con.error("ERROR in caapfbShutdown: " + err);
            }
        },

        fbData: null,

        fbEnv: null,

        setGiftGuild: function () {
            var i = 0,
                l = caap.stats['guild']['members'].length,
                g = [];

            for (i = 0; i < l; i += 1) {
                g.push(caap.stats['guild']['members'][i]['userId']);
            }

            con.log(1, "g", g);
            if ($u.hasContent(g)) {
                sessionStorage.setItem("caap_giftGuild", JSON.stringify(g));
            }
        },

        setGiftQueue: function () {
            var g = gifting.queue.getIds();
            if ($u.hasContent(g)) {
                sessionStorage.setItem("caap_giftQueue", JSON.stringify(g));
            }
        },

        setGiftHistory: function () {
            var g = gifting.history.getIds();
            if ($u.hasContent(g)) {
                sessionStorage.setItem("caap_giftHistory", JSON.stringify(g));
            }
        },

        setGiftCustom: function () {
            if (config.getItem("FBCustomDrop", false)) {
                var g = config.getList("FBCustomDropList", "");
                if ($u.hasContent(g)) {
                    sessionStorage.setItem("caap_giftCustom", JSON.stringify(g));
                }
            } else {
                sessionStorage.removeItem("caap_giftCustom");
            }
        },

        start: function () {
            con.log(1, "caap.fb(Data/Env)", caap.fbData, caap.fbEnv);
            caap.sessionVarsInit();
            var FBID      = 0,
                idOk      = false,
                accountEl = $j(),
                delay     = 1000,
                it        = 0,
                len       = 0,
                fbData,
                aName;

            con.log(1, 'DOM load completed');
            con.log(1, 'mutationTypes', $u.mutationTypes);
            window.clearTimeout(caap_timeout);
            for (it = 0; it < caap.removeLibs.length; it += 1) {
                (document.head || document.getElementsByTagName('head')[0]).removeChild(caap.removeLibs[it]);
            }

            caap.removeLibs = [];
            caap.jQueryExtend();
            css.addCSS();

            if (caap.errorCheck()) {
                caap.mainCaapLoop();
                return;
            }

            caap.jWindow = $j(window);
            if (caap.domain.which === 4) {
                caap.initDb();
                caap.caapifpStartup();
                return;
            } else if (caap.domain.which === 3) {
                caap.initDb();
                caap.getSigned();
                //con.log(2, "session", session);
                caap.caapifStartup();
                return;
            } else {
                /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
                /*jslint sub: true */
                if (caap.domain.which >= 0 && caap.domain.which < 2) {
                    FBID = $u.setContent(caap.fbEnv.user, 0).parseInt();
                    aName = $j('#navAccountName').text();
                } else {
                    FBID = $u.setContent(caap.fbData.me.uid, '0').parseInt();
                    aName = $u.setContent(caap.fbData.me.name, '');
                }

                if ($u.isNumber(FBID) && FBID > 0) {
                    caap.stats['FBID'] = FBID;
                    idOk = true;
                }
                /*jslint sub: false */
                if (!idOk && caap.domain.which >= 0 && caap.domain.which < 2) {
                    // Force reload without retrying
                    con.error('No Facebook UserID!!! Reloading ...', FBID, window.location.href);
                    window.setTimeout(function () {
                        var newdiv = document.createElement('div');
                        newdiv.innerHTML = "<p>CAAP will retry shortly!</p>";
                        document.body.appendChild(newdiv);
                        window.setTimeout(function () {
                            $u.reload();
                        }, 60000 + (Math.floor(Math.random() * 60) * 1000));
                    }, retryDelay);

                    return;
                }

                caap.initDb(FBID);
                con.log_level = config.getItem('DebugLevel', 1);
                //con.log(3, "config", config);
                //con.log(3, "state", state);
                //con.log(3, "schedule", schedule);
                caap.lsUsed();
                schedule.setItem("clickedOnSomething", 3600);
                caap.loadStats(FBID, aName);
                gifting.init();
                gifting.loadCurrent();

                /////////////////////////////////////////////////////////////////////
                // Put code to be run once to upgrade an old version's variables to
                // new format or such here.
                /////////////////////////////////////////////////////////////////////

                if (devVersion !== '0') {
                    if (state.getItem('LastVersion', '0') !== caapVersion || state.getItem('LastDevVersion', '0') !== devVersion) {
                        state.setItem('LastVersion', caapVersion);
                        state.setItem('LastDevVersion', devVersion);
                    }
                } else {
                    if (state.getItem('LastVersion', '0') !== caapVersion) {
                        state.setItem('LastVersion', caapVersion);
                        state.setItem('LastDevVersion', '0');
                    }
                }

                if (caap.domain.which === 0 || caap.domain.which === 2) {
                    state.setItem('caapPause', 'none');
                    session.setItem('ReleaseControl', true);
                    window.setTimeout(caap.init, 200);
                }

                if (caap.domain.which === 1 || caap.domain.which === 2) {
                    caap.mainCaapLoop();
                }

                caap.caapfbStartup();
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        lsUsed: function () {
            try {
                var used = {
                        'type'  : '',
                        'match' : 0,
                        'total' : 0
                    },
                    perc = {
                        caap  : 0,
                        total : 0
                    },
                    msg = '';

                used = gm.used();
                if (used['type'] !== "greaseMonkey") {
                    perc.caap = ((used['match'] * 2.048 / 5242880) * 100).dp();
                    con.log(1, "CAAP localStorage used: " + perc.caap + "%");
                    perc.total = ((used['total'] * 2.048 / 5242880) * 100).dp();
                    if (perc.total >= 90) {
                        con.warn("Total localStorage used: " + perc.total + "%");
                        msg = "<div style='text-align: center;'>";
                        msg += "<span style='color: red; font-size: 14px; font-weight: bold;'>WARNING!</span><br />";
                        msg += "localStorage usage for domain: " + perc.total + "%<br />";
                        msg += "CAAP is using: " + perc.total + "%";
                        msg += "</div>";
                        window.setTimeout(function () {
                            $j().alert(msg);
                        }, 5000);
                    } else {
                        con.log(1, "Total localStorage used: " + perc.total + "%");
                    }
                } else {
                    con.log(1, "CAAP GM storage used (chars): " + used['match']);
                    con.log(1, "GM storage used (chars): " + used['total']);
                }

                return true;
            } catch (err) {
                con.error("ERROR in release lsUsed: " + err);
                return false;
            }
        },

        /*jslint sub: false */

        incrementPageLoadCounter: function () {
            try {
                return session.incItem("pageLoadCounter");
            } catch (err) {
                con.error("ERROR in incrementPageLoadCounter: " + err);
                return undefined;
            }
        },

        injectCATools: function () {
            $u.injectScript("http://cage.northcornwall.com/hoots/catbox.asp?" + Math.random());
        },

        init: function () {
            try {
                var tDiv;

                if (caap.domain.which === 2 || caap.domain.which === 3) {
                    caap.ajaxLoadIcon = $j('#' + caap.domain.id[caap.domain.which] + 'AjaxLoadIcon');
                }

                if (caap.domain.which === 3 && config.getItem('backgroundCA', false)) {
                    $j("body").css({
                        'background-image'    : "",
                        'background-position' : 'center top',
                        'background-repeat'   : 'no-repeat',
                        'background-color'    : 'black',
                        'margin'              : '0px',
                        'overflow'            : 'hidden'
                    });
                }

                if (caap.domain.which === 0 && config.getItem('backgroundCA', false)) {
                    $j("body").css({
                        'background-image'    : "url('http://image4.castleagegame.com/graphics/guild_webpage_bg.jpg')",
                        'background-position' : 'center top',
                        'background-repeat'   : 'no-repeat',
                        'background-color'    : 'black',
                        'margin'              : '0px'
                    });

                    $j("#contentCol").css({
                        'background-color'    : 'black'
                    });

                    $j("#contentArea").css({
                        'background-image'    : "url('http://image4.castleagegame.com/graphics/ws_middle.jpg')",
                        'padding'             : '0px 10px'
                    });

                    $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                        'display'    : 'none'
                    });

                    $j("#contentCol").removeClass("clearfix");
                }

                if (caap.domain.which === 0 || caap.domain.which === 2) {
                    caap.controlXY.selector = caap.domain.which === 0 ? "#contentArea" : "#globalcss";
                }

                if (caap.domain.which === 2 || caap.domain.which === 3) {
                    caap.dashboardXY.selector = "#" + caap.domain.id[caap.domain.which] + "app_body_container";
                }

                function chatListener(event) {
                    if (event.target.className === "fbDockWrapper fbDockWrapperRight bb") {
                        event.target.style.display = "none";
                        caap.pageletPresenceDiv.unbind("DOMNodeInserted", chatListener);
                    }
                }

                if (caap.domain.which === 0) {
                    caap.pageletPresenceDiv = $j("#pagelet_presence");
                    // Get rid of those ads now! :P
                    if (config.getItem('HideAds', false)) {
                        $j('#rightCol').css('display', 'none');
                    }

                    if (config.getItem('HideFBChat', false)) {
                        tDiv = $j("div[class='fbDockWrapper fbDockWrapperRight bb']", caap.pageletPresenceDiv);
                        if ($u.hasContent(tDiv)) {
                            tDiv.css('display', 'none');
                        } else {
                            caap.pageletPresenceDiv.bind("DOMNodeInserted", chatListener);
                        }
                    }
                }

                if (caap.domain.which === 3) {
                    if (config.getItem('HideAdsIframe', false)) {
                        //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                        //$j("div[style*='tool_top.jpg']").css('display', 'none');
                        $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', 'none');
                    }
                }

                // Can create a blank space above the game to host the dashboard if wanted.
                // Dashboard currently uses '185px'
                if (caap.domain.which === 2) {
                    var shiftDown = gm ? gm.getItem('ShiftDown', '', hiddenVar) : '';
                    if ($u.hasContent(shiftDown)) {
                        $j(caap.controlXY.selector).css('padding-top', shiftDown);
                    }
                }

                if (caap.domain.which === 0 || caap.domain.which === 2) {
                    general.load();
                    monster.load();
                    guild_monster.load();
                    //arena.load();
                    festival.load();
                    feed.load();
                    battle.load();
                    caap.loadDemi();
                    battle.loadRecon();
                    town.load('soldiers');
                    town.load('item');
                    town.load('magic');
                    army.init();
                    spreadsheet.load();
                    caap.addControl();
                    caap.addPlayButton();
                    var chelper = new $u.CommunicationHelper('test_div', true, function (data) {
                        con.log(1, "fired", chelper, data);
                    });

                    $u.injectScript("var CHelper=" + $u.CommunicationHelper.toString() + ";var chelper = new CHelper('test_div');chelper.send('test');", true);
                    chelper = chelper.destroy();
                    con.log(1, "destroyed", chelper);
                    //alert($u.CommunicationHelper.toString());
                }

                if (caap.domain.which === 2 || caap.domain.which === 3) {
                    caap.addDashboard();
                    caap.addDashboardMin();
                }

                caap.addCaapAjax();
                caap.addListeners();

                if (caap.domain.which === 2 || caap.domain.which === 3) {
                    caap.addDBListener();
                    caap.checkResults();
                    caap.autoStatCheck();
                    caap.bestLand = new caap.landRecord().data;
                    caap.sellLand = {};
                    offline.bga.sort($u.sortBy(false, 'n'));
                }

                if (caap.domain.which === 0 && config.getItem('injectCATools', false)) {
                    caap.injectCATools();
                }

                if (caap.domain.which === 3 && state.getItem('caapPause', 'none') === 'block') {
                    caap.pauseListener();
                }

                return true;
            } catch (err) {
                con.error("ERROR in init: " + err);
                return false;
            }
        },

        oneMinuteUpdate: function (funcName) {
            try {
                if (!$u.isString(funcName) || funcName === '') {
                    throw "Invalid identifying name!";
                }

                if (!state.getItem('reset' + funcName) && !schedule.check(funcName + 'Timer')) {
                    return false;
                }

                schedule.setItem(funcName + 'Timer', 60);
                state.setItem('reset' + funcName, false);
                return true;
            } catch (err) {
                con.error("ERROR in oneMinuteUpdate: " + err);
                return undefined;
            }
        },

        timeStr: function (Short) {
            return config.getItem("use24hr", true) ? (Short ? "D H:i" : "D d M H:i") : (Short ? "D g:i A" : "D d M g:i A");
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        displayTime: function (name) {
            try {
                if (!$u.isString(name) || name === '') {
                    throw "Invalid identifying name!";
                }

                var timer = schedule.getItem(name);
                return $u.makeTime(($u.isPlainObject(timer) ? timer['next'] : new Date()), caap.timeStr(true));
            } catch (err) {
                con.error("ERROR in displayTime: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          NAVIGATION FUNCTIONS
        /////////////////////////////////////////////////////////////////////

        waitTime: 5000,

        visitUrl: function (url, loadWaitTime) {
            try {
                if (config.getItem('bookmarkMode', false)) {
                    return true;
                }

                if (!$u.hasContent(url)) {
                    throw 'No url passed to visitUrl';
                }

                caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
                caap.setDomWaiting(url);
                if (caap.domain.inIframe) {
                    caap.messaging.visitUrl(url);
                } else {
                    window.location.href = url;
                }

                return true;
            } catch (err) {
                con.error("ERROR in caap.visitUrl: " + err);
                return false;
            }
        },

        click: function (obj, loadWaitTime) {
            try {
                if (!$u.hasContent(obj)) {
                    throw 'Null object passed to Click';
                }

                caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
                caap.setDomWaiting();
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                /*
                Return Value: boolean
                The return value of dispatchEvent indicates whether any of the listeners
                which handled the event called preventDefault. If preventDefault was called
                the value is false, else the value is true.
                */
                return !(obj.jquery ? obj.get(0) : obj).dispatchEvent(evt);
            } catch (err) {
                con.error("ERROR in caap.click: " + err);
                return undefined;
            }
        },

        clickAjaxLinkSend: function (link, loadWaitTime) {
            try {
                if (!$u.hasContent(link)) {
                    throw 'No link passed to clickAjaxLinkSend';
                }

                caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
                caap.setDomWaiting(link);
                window.location.href = caap.jss + ":void(" + caap.domain.ajax[caap.domain.which] + "ajaxLinkSend('globalContainer', '" + link + "'))";
                return true;
            } catch (err) {
                con.error("ERROR in caap.clickAjaxLinkSend: " + err);
                return false;
            }
        },

        clickGetCachedAjax: function (link, loadWaitTime) {
            try {
                if (!$u.hasContent(link)) {
                    throw 'No link passed to clickGetCachedAjax';
                }

                caap.setDomWaiting(link);
                window.location.href = caap.jss + ":void(" + caap.domain.ajax[caap.domain.which] + "get_cached_ajax('" + link + "', 'get_body'))";
                return true;
            } catch (err) {
                con.error("ERROR in caap.clickGetCachedAjax: " + err);
                return false;
            }
        },

        ajaxLoad: function (link, params, selector_dom, selector_load, result, loadWaitTime) {
            try {
                if (!$u.hasContent(link)) {
                    throw 'No link passed to ajaxLoad';
                }

                if (!$u.hasContent(selector_dom)) {
                    throw 'No selector_dom passed to ajaxLoad';
                }

                selector_load = $u.setContent(selector_load, "");
                caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
                caap.setDomWaiting($u.setContent(result, link));
                caap.ajaxLoadIcon.css("display", "block");
                function onError(XMLHttpRequest, textStatus, errorThrown) {
                    con.error("caap.ajaxLoad", textStatus);
                }

                function onSuccess(data, textStatus, XMLHttpRequest) {
                    $j(selector_dom).html(selector_load === "" ? caap.tempAjax.html() : $j(selector_load, caap.tempAjax).html());
                    caap.ajaxLoadIcon.css("display", "none");
                    caap.reBind();
                    caap.clearDomWaiting();
                    caap.checkResults();
                }

                caap.ajax(link, params, onError, onSuccess);
                return true;
            } catch (err) {
                con.error("ERROR in caap.ajaxLoad: " + err);
                return false;
            }
        },

        navigateTo: function (pathToPage, imageOnPage, webSlice) {
            try {
                webSlice = $u.setContent(webSlice, caap.globalContainer);
                if (!$u.hasContent(webSlice)) {
                    con.warn('No content to Navigate to', imageOnPage, pathToPage);
                    return false;
                }

                if ($u.hasContent(imageOnPage) && caap.hasImage(imageOnPage, webSlice)) {
                    con.log(3, 'Image found on page', imageOnPage);
                    return false;
                }

                var pathList = $u.hasContent(pathToPage) ? pathToPage.split(",") : [],
                    s        = 0,
                    jq       = $j(),
                    path     = '';

                for (s = pathList.length - 1; s >= 0; s -= 1) {
                    path = $u.setContent(pathList[s], '');
                    if (!$u.hasContent(path)) {
                        con.warn('pathList had no content!', pathList[s]);
                        continue;
                    }

                    jq = $j("a[href*='" + path + ".php']", webSlice).not("a[href*='" + path + ".php?']", webSlice);
                    if ($u.hasContent(jq)) {
                        con.log(2, 'Go to', path);
                    } else {
                        jq = caap.checkForImage(path.hasIndexOf(".") ? path : path + '.', webSlice);
                        if ($u.hasContent(jq)) {
                            con.log(2, 'Click on image', jq.attr("src").basename());
                        }
                    }

                    if ($u.hasContent(jq)) {
                        caap.click(jq);
                        return true;
                    } else {
                        con.log(3, 'No anchor or image found', path);
                    }
                }

                con.warn('Unable to Navigate to', imageOnPage, pathToPage);
                return false;
            } catch (err) {
                con.error("ERROR in caap.navigateTo: " + err, imageOnPage, pathToPage);
                return undefined;
            }
        },

        checkForImage: function (image, webSlice, subDocument, nodeNum) {
            try {
                webSlice = $u.setContent(webSlice, $u.setContent(subDocument, window.document).body);
                return $j("input[src*='" + image + "'],img[src*='" + image + "'],div[style*='" + image + "']", webSlice).eq($u.setContent(nodeNum, 0));
            } catch (err) {
                con.error("ERROR in caap.checkForImage: " + err);
                return undefined;
            }
        },

        hasImage: function (image, webSlice, subDocument, nodeNum) {
            try {
                return $u.hasContent(caap.checkForImage(image, webSlice, subDocument, nodeNum));
            } catch (err) {
                con.error("ERROR in caap.hasImage: " + err);
                return undefined;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          DISPLAY FUNCTIONS
        // these functions set up the control applet and allow it to be changed
        /////////////////////////////////////////////////////////////////////

        chatLink: function (slice, query) {
            try {
                var hr = new RegExp('.*(http:.*)'),
                    qr = /"/g;

                $j(query, slice).each(function () {
                    var e = $j(this),
                        h = '',
                        t = '',
                        a = [];

                    h = e.html();
                    a = $u.hasContent(h) ? h.trim().split("<br>") : [];
                    t = $u.hasContent(a[1]) ? a[1].replace(qr, '').regex(hr) : '';
                    a = $u.hasContent(t) ? t.split(" ") : [];
                    t = $u.hasContent(a) ? h.replace(a[0], "<a href='" + a[0] + "'>" + a[0] + "</a>") : '';
                    if ($u.hasContent(t)) {
                        e.html(t);
                    }
                });

                return true;
            } catch (err) {
                con.error("ERROR in caap.chatLink: " + err);
                return false;
            }
        },

        makeDropDown: function (idName, dropDownList, instructions, formatParms, defaultValue, css) {
            try {
                var selectedItem = config.getItem(idName, 'defaultValue'),
                    id           = idName ? " id='caap_" + idName + "'" : '',
                    title        = '',
                    htmlCode     = '',
                    item         = 0,
                    len          = 0;

                selectedItem = selectedItem !== 'defaultValue' ? selectedItem : (config.setItem(idName, $u.setContent(defaultValue, dropDownList[0])));
                len = dropDownList.length;
                for (item = 0; item < len; item += 1) {
                    if (selectedItem === dropDownList[item]) {
                        break;
                    }
                }

                title = instructions[item] ? " title='" + instructions[item].toString().escapeHTML() + "'" : '';
                css = css ? " style='" + css + "'" : '';
                formatParms = formatParms ? ' ' + formatParms : '';
                htmlCode = "<select class='caap_ff caap_fs caap_ww'" + id + css + title + formatParms + ">";
                htmlCode += "<option disabled='disabled' value='not selected'>Choose one</option>";
                for (item = 0; item < len; item += 1) {
                    title = instructions[item] ? " title='" + instructions[item].toString().escapeHTML() + "'" : '';
                    htmlCode += "<option value='" + dropDownList[item].toString().escapeHTML() + "'" + (selectedItem === dropDownList[item] ? " selected='selected'" : '') + title + ">" + dropDownList[item].toString().escapeHTML() + "</option>";
                }

                htmlCode += "</select>";
                return htmlCode;
            } catch (err) {
                con.error("ERROR in makeDropDown: " + err);
                return '';
            }
        },

        startTR: function (id, css) {
            try {
                id = id ? " id='" + id  + "'" : '';
                css = css ? " style='" + css + "'" : '';
                return "<div class='caap_ff caap_fn caap_ww'" + id + css + ">";
            } catch (err) {
                con.error("ERROR in startTR: " + err);
                return '';
            }
        },

        endTR: "</div>",

        makeTD: function (text, indent, right, css) {
            try {
                css = css ? " style='" + css + "'" : '';
                var cls = " class='caap_ff caap_fn" + (indent ? " caap_in" : '') + (right ? " caap_tr" : '') + "'";
                return "<div" + cls + css + ">" + text + "</div>";
            } catch (err) {
                con.error("ERROR in makeTD: " + err);
                return '';
            }
        },

        makeSlider: function (text, id, inst, defaultValue, indent) {
            try {
                var value = config.getItem(id, 'defaultValue'),
                    html  = "<div class='caap_ff caap_fn caap_ww' id='caap_" + id + "'>";

                value = value !== 'defaultValue' ? value : config.setItem(id, $u.setContent(defaultValue, 1));
                html += '<div style="width: ' + (indent ? "42%;padding-left: 5%;" : "47%") + ';display: inline-block;">' + text + '</div>';
                html += "<div style='width: 45%;padding-right: 5%;display: inline-block;' id='caap_" + id + "_slider' title='" + inst.escapeHTML() + "'></div>";
                html += "</div>";

                return html;
            } catch (err) {
                con.error("ERROR in makeTD: " + err);
                return '';
            }
        },

        makeSliderListener: function (id, min, max, step, defaultValue, opacity, slice) {
            try {
                $j("#caap_" + id + "_slider", $u.setContent(slice, caap.caapDivObject)).slider({
                    orientation : "horizontal",
                    range       : "min",
                    min         : min,
                    max         : max,
                    step        : step,
                    value       : config.getItem(id, defaultValue),
                    slide       : function (event, ui) {
                        if (opacity) {
                            state.setItem(id.replace("Cust", ''), config.setItem(id, ui.value));
                            caap.colorUpdate();
                        } else {
                            config.setItem(id, ui.value);
                        }
                    }
                });

                return true;
            } catch (err) {
                con.error("ERROR in makeTD: " + err);
                return false;
            }
        },

        makeCheckBox: function (idName, defaultValue, instructions, css) {
            try {
                var id    = idName ? " id='caap_" + idName  + "'" : '',
                    title = instructions ? " title='" + instructions.escapeHTML() + "'" : '',
                    check = config.getItem(idName, 'defaultValue');

                check = check !== 'defaultValue' ? check : config.setItem(idName, $u.setContent(defaultValue, false));
                check = check ? " checked" : '';
                css = css ? " style='" + css + "'" : '';
                return "<input class='caap_ff caap_fn' type='checkbox'" + id + css + title + check + ' />';
            } catch (err) {
                con.error("ERROR in makeCheckBox: " + err);
                return '';
            }
        },

        makeNumberForm: function (idName, instructions, initDefault, formatParms, subtype, css) {
            try {
                subtype = $u.setContent(subtype, 'number');
                css = $u.setContent(css, '');
                var value = config.getItem(idName, 'defaultValue'),
                    stNum = subtype === 'number',
                    id    = idName ? " id='caap_" + idName + "'" : '',
                    title = instructions ? " title='" + instructions.escapeHTML() + "'" : '',
                    type  = stNum ? " type='text' min='0' step='1'" : " type='text'";

                css += subtype === 'color' ? 'background-color:' + value + '; color:' + $u.bestTextColor(value) + ';' : '';
                css = css ? " style='" + css + "'" : '';
                subtype = subtype ? " data-subtype='" + subtype + "'" : '';
                initDefault = stNum && $u.isNumber(initDefault) ? initDefault : (stNum && $u.hasContent(initDefault) && $u.isString(initDefault) && !$u.isNaN(initDefault) ? initDefault.parseFloat() : (!stNum && $u.isString(initDefault) ? initDefault : ''));
                if (stNum && $u.hasContent(initDefault) && $u.isNaN(initDefault)) {
                    con.warn("makeNumberForm - default value is not a number!", idName, initDefault);
                }

                value = value !== 'defaultValue' ? value : config.setItem(idName, initDefault);
                formatParms = $u.setContent(formatParms, '');
                return "<input class='caap_ff caap_fs caap_tr caap_ww'" + type + subtype + id + css + formatParms + title + " value='" + value + "' />";
            } catch (err) {
                con.error("ERROR in makeNumberForm: " + err);
                return '';
            }
        },

        makeCheckTR: function (text, idName, defaultValue, instructions, indent, right, css, id1, css1) {
            try {
                var htmlCode = '';
                htmlCode += caap.startTR(id1 ? idName + id1 : idName + "_row", css1);
                htmlCode += caap.makeTD(text, indent, right, "width: " + (indent ? 85 : 90) + "%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeCheckBox(idName, defaultValue, instructions, css), false, true, "width: 10%; display: inline-block;");
                htmlCode += caap.endTR;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in makeCheckTR: " + err);
                return '';
            }
        },

        startCheckHide: function (idName, not) {
            try {
                var id  = idName ? " id='caap_" + idName + (not ? "_not" : '') + "_hide'" : '',
                    css = " style='display: " + (config.getItem(idName, false) ? (not ? 'none' : 'block') : (not ? 'block' : 'none')) + ";'";

                return "<div class='caap_ff caap_fn caap_ww'" + id + css + ">";
            } catch (err) {
                con.error("ERROR in startCheckHide: " + err);
                return '';
            }
        },

        endCheckHide: function () {
            try {
                return "</div>";
            } catch (err) {
                con.error("ERROR in endCheckHide: " + err);
                return '';
            }
        },

        makeNumberFormTR: function (text, idName, instructions, initDefault, formatParms, subtype, indent, right, width) {
            try {
                indent = $u.setContent(indent, false);
                right = $u.setContent(right, false);
                width = $u.setContent(width, 30);
                var htmlCode = '';
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD(text, indent, right, "width: " + (indent ? 92 - width : 97 - width) + "%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeNumberForm(idName, instructions, initDefault, formatParms, subtype, ''), false, true, "width: " + width + "%; display: inline-block;");
                htmlCode += caap.endTR;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in makeNumberFormTR: " + err);
                return '';
            }
        },

        makeDropDownTR: function (text, idName, dropDownList, instructions, formatParms, defaultValue, indent, right, width, css, id1, css1) {
            try {
                var htmlCode = '';
                htmlCode += caap.startTR(id1 ? idName + id1 : idName + "_row", css1);
                htmlCode += caap.makeTD(text, indent, right, "width: " + (indent ? 95 - width : 100 - width) + "%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeDropDown(idName, dropDownList, instructions, formatParms, defaultValue, css), false, true, "width: " + width + "%; display: inline-block;");
                htmlCode += caap.endTR;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in makeDropDownTR: " + err);
                return '';
            }
        },

        startDropHide: function (idName, idPlus, test, not) {
            try {
                var value  = config.getItem(idName, 'Never'),
                    result = not ? value !== test : value === test,
                    id     = " id='caap_" + idName + idPlus + "_hide'",
                    css    = " style='display: " + (result ? 'block' : 'none') + ";'";

                return "<div class='caap_ff caap_fn caap_ww'" + id + css + ">";
            } catch (err) {
                con.error("ERROR in startDropHide: " + err);
                return '';
            }
        },

        endDropHide: function () {
            try {
                return "</div>";
            } catch (err) {
                con.error("ERROR in endDropHide: " + err);
                return '';
            }
        },

        startToggle: function (controlId, staticText) {
            try {
                var currentDisplay = state.getItem('Control_' + controlId, "none"),
                    displayChar    = currentDisplay === "none" ? "+" : "-",
                    style = "font-family: 'lucida grande', tahoma, verdana, arial, sans-serif; font-size: 11px;",
                    toggleCode     = '';

                toggleCode += '<a style=\"font-weight: bold;' + style + '\" id="caap_Switch_' + controlId + '" href="javascript:;" style="text-decoration: none;"> ';
                toggleCode += displayChar + ' ' + staticText + '</a><br />' + "<div id='caap_" + controlId + "' style='display: " + currentDisplay + ";'>";
                return toggleCode;
            } catch (err) {
                con.error("ERROR in startToggle: " + err);
                return '';
            }
        },

        endToggle: "<hr /></div>",

        makeTextBox: function (idName, instructions, initDefault) {
            try {
                initDefault = $u.setContent(initDefault, '');
                var style = "font-family: 'lucida grande', tahoma, verdana, arial, sans-serif; font-size: 11px;",
                    value = config.getItem(idName, 'defaultValue');

                value = value === 'defaultValue' ? config.setItem(idName, initDefault) : value;
                return "<textarea style=\"" + style + "\" title=" + '"' + instructions.escapeHTML() + '"' + " type='text' id='caap_" + idName + "' " + ($u.is_chrome ? " rows='3' cols='25'" : " rows='3' cols='21'") + ">" + value + "</textarea>";
            } catch (err) {
                con.error("ERROR in makeTextBox: " + err);
                return '';
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        setDivContent: function (idName, mess, slice, hide) {
            try {
                if (/_mess$/.test(idName)) {
                    if (caap.messDivs[idName] !== mess) {
                        caap.messDivs[idName] = mess;
                        con.log(4, "setDivContent", idName, mess);
                    } else {
                        return;
                    }
                }

                if (caap.domain.which === 3) {
                    caap.messaging.setDivContent(idName, mess, hide);
                } else {
                    if (config.getItem('SetTitle', false) && idName === "activity_mess") {
                        var DocumentTitle = config.getItem('SetTitleAction', false) ? mess.replace("Activity: ", '') + " - " : '';
                        DocumentTitle += config.getItem('SetTitleName', false) ? caap.stats['PlayerName'] + " - " : '';
                        document.title = DocumentTitle + caap.documentTitle;
                    }

                    $j('#caap_' + idName, $u.setContent(slice, caap.caapDivObject)).html(mess).css('display', hide ? 'none' : 'block');
                }
            } catch (err) {
                con.error("ERROR in setDivContent: " + err);
            }
        },
        /*jslint sub: false */

        landQuestList: [
            'Land of Fire',
            'Land of Earth',
            'Land of Mist',
            'Land of Water',
            'Demon Realm',
            'Undead Realm',
            'Underworld',
            'Kingdom of Heaven',
            'Ivory City',
            'Earth II',
            'Water II',
            'Mist II',
            'Mist III',
            'Fire II',
            'Pangaea',
            'Perdition'
        ],

        demiQuestList: [
            'Ambrosia',
            'Malekus',
            'Corvintheus',
            'Aurora',
            'Azeron'
        ],

        atlantisQuestList: [
            'Atlantis'
        ],

        selectDropOption: function (idName, value) {
            try {
                if (caap.domain.which === 3) {
                    caap.messaging.selectDropOption(idName, value);
                } else {
                    var drop = $j("#caap_" + idName, caap.caapDivObject);
                    $j("option", drop).removeAttr('selected');
                    drop.val(value);
                }

                return true;
            } catch (err) {
                con.error("ERROR in selectDropOption: " + err);
                return false;
            }
        },

        newAutoQuest: function () {
            return JSON.copy({
                'name'     : '',
                'energy'   : 0,
                'general'  : 'none',
                'expRatio' : 0
            });
        },

        updateAutoQuest: function (id, value) {
            try {
                if (!$u.isString(id) || !$u.hasContent(id)) {
                    throw "No valid id supplied!";
                }

                if (!$u.hasContent(value)) {
                    throw "No value supplied!";
                }

                var temp = state.getItem('AutoQuest', caap.newAutoQuest());
                temp[id] = value;
                state.setItem('AutoQuest', temp);
                return true;
            } catch (err) {
                con.error("ERROR in updateAutoQuest: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        showAutoQuest: function () {
            try {
                caap.setDivContent("stopAutoQuest", "Stop auto quest: " + state.getItem('AutoQuest', caap.newAutoQuest())['name'] + " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")", caap.caapDivObject, false);
                return true;
            } catch (err) {
                con.error("ERROR in showAutoQuest: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        clearAutoQuest: function () {
            try {
                caap.setDivContent("stopAutoQuest", "", caap.caapDivObject, true);
                return true;
            } catch (err) {
                con.error("ERROR in clearAutoQuest: " + err);
                return false;
            }
        },

        manualAutoQuest: function (AutoQuest) {
            try {
                state.setItem('AutoQuest', $u.setContent(AutoQuest, caap.newAutoQuest()));
                caap.selectDropOption('WhyQuest', config.setItem('WhyQuest', 'Manual'));
                caap.clearAutoQuest();
                return true;
            } catch (err) {
                con.error("ERROR in manualAutoQuest: " + err);
                return false;
            }
        },

        changeDropDownList: function (idName, dropList, option) {
            try {
                if (caap.domain.which === 3) {
                    caap.messaging.changeDropDownList(idName, dropList, option);
                } else {
                    $j("#caap_" + idName + " option", caap.caapDivObject).remove();
                    $j("#caap_" + idName, caap.caapDivObject).append("<option disabled='disabled' value='not selected'>Choose one</option>");
                    var item = 0,
                        len  = dropList.length,
                        drop = $j("#caap_" + idName, caap.caapDivObject);

                    for (item = 0; item < len; item += 1) {
                        if (item === 0 && !option) {
                            config.setItem(idName, dropList[item]);
                            con.log(1, "Saved: " + idName + "  Value: " + dropList[item]);
                        }

                        $j("#caap_" + idName, caap.caapDivObject).append("<option value='" + dropList[item].escapeHTML() + "'>" + dropList[item].escapeHTML() + "</option>");
                    }

                    if (option) {
                        drop.val(option.escapeHTML());
                    } else {
                        drop.val($j("option:eq(1)", drop).val());
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in changeDropDownList: " + err);
                return false;
            }
        },

        controlXY: {
            selector : '',
            x        : 0,
            y        : 0
        },

        getControlXY: function (reset, tools) {
            try {
                var selector  = $j(caap.controlXY.selector),
                        outer = selector.outerWidth(true),
                        xoff  = !tools && (caap.domain.which === 2 || (caap.domain.which === 0 && !config.getItem('backgroundCA', false))) ? outer + 10 : outer;

                return {
                    y: reset ? selector.offset().top : caap.controlXY.y,
                    x: caap.controlXY.x === '' || reset ? selector.offset().left + xoff : selector.offset().left + caap.controlXY.x
                };
            } catch (err) {
                con.error("ERROR in getControlXY: " + err);
                return {x: 0, y: 0};
            }
        },

        saveControlXY: function () {
            try {
                state.setItem('caap_div_menuTop', caap.caapDivObject.offset().top);
                state.setItem('caap_div_menuLeft', caap.caapDivObject.offset().left - $j(caap.controlXY.selector).offset().left);
                state.setItem('caap_top_zIndex', '1');
                state.setItem('caap_div_zIndex', '2');
            } catch (err) {
                con.error("ERROR in saveControlXY: " + err);
            }
        },

        dashboardXY: {
            selector : '',
            x        : 0,
            y        : 0
        },

        getDashboardXY: function (reset) {
            try {
                var selector = $j(caap.dashboardXY.selector);

                return {
                    y: reset ? selector.offset().top - 10 : caap.dashboardXY.y,
                    x: caap.dashboardXY.x === '' || reset ? selector.offset().left : selector.offset().left + caap.dashboardXY.x
                };
            } catch (err) {
                con.error("ERROR in getDashboardXY: " + err);
                return {x: 0, y: 0};
            }
        },

        saveDashboardXY: function () {
            try {
                state.setItem('caap_top_menuTop', caap.caapTopObject.offset().top);
                state.setItem('caap_top_menuLeft', caap.caapTopObject.offset().left - $j(caap.dashboardXY.selector).offset().left);
                state.setItem('caap_div_zIndex', '1');
                state.setItem('caap_top_zIndex', '2');
                caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
                caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
            } catch (err) {
                con.error("ERROR in saveDashboardXY: " + err);
            }
        },

        messDivs: {
            'banner': "",
            'activity_mess': "",
            'idle_mess': "",
            'quest_mess': "",
            'battle_mess': "",
            'monster_mess': "",
            'guild_monster_mess': "",
            //'arena_mess': "",
            'festival_mess': "",
            'fortify_mess': "",
            'heal_mess': "",
            'demipoint_mess': "",
            'gifting_mess': "",
            'feats_mess': "",
            'demibless_mess': "",
            'level_mess': "",
            'exp_mess': "",
            'debug1_mess': "",
            'debug2_mess': "",
            'control': "",
            'donate': ""
        },

        addControl: function (reload) {
            try {
                var caapDiv  = "<div id='caap_div'>",
                    divID,
                    len      = 0,
                    styleXY  = {
                        x: 0,
                        y: 0
                    },
                    bgc = state.getItem('StyleBackgroundLight', '#E0C691'),
                    htmlCode = '',
                    banner   = '',
                    donate   = '';

                for (divID in caap.messDivs) {
                    if (caap.messDivs.hasOwnProperty(divID)) {
                        caapDiv += "<div class='caap_ww' id='caap_" + divID + "'></div>";
                    }
                }

                caapDiv += "</div>";
                caap.controlXY.x = state.getItem('caap_div_menuLeft', '');
                caap.controlXY.y = state.getItem('caap_div_menuTop', $j(caap.controlXY.selector).offset().top);
                styleXY = caap.getControlXY();
                caapDiv = $j(caapDiv);
                caapDiv.css({
                    width                   : '180px',
                    background              : bgc,
                    opacity                 : state.getItem('StyleOpacityLight', 1),
                    color                   : $u.bestTextColor(bgc),
                    padding                 : "4px",
                    border                  : "2px solid #444",
                    top                     : styleXY.y + 'px',
                    left                    : styleXY.x + 'px',
                    zIndex                  : state.getItem('caap_div_zIndex', '2'),
                    position                : 'absolute'
                });

                /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
                /*jslint sub: true */
                banner += "<div id='caap_BannerDisplay_hide' style='display: " + (config.getItem('BannerDisplay', true) ? 'block' : 'none') + "'>";
                banner += "<img src='data:image/png;base64," + image64['header'] + "' alt='Castle Age Auto Player' /><br /><hr /></div>";
                caap.setDivContent('banner', banner, caapDiv);

                donate += "<div id='caap_DonateDisplay_hide' style='text-align: center; display: " + (config.getItem('DonateDisplay', true) ? 'block' : 'none') + "'><br /><hr />";
                donate += "<a href='https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=xotic750%40gmail%2ecom&item_name=Castle%20Age%20Auto%20Player&item_number=CAAP&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted'>";
                donate += "<img src='data:image/gif;base64," + image64['donate'] + "' alt='Donate' /></a></div>";
                caap.setDivContent('donate', donate, caapDiv);
                /*jslint sub: false */

                htmlCode += caap.addPauseMenu();
                htmlCode += caap.addDisableMenu();
                htmlCode += caap.addCashHealthMenu();
                htmlCode += caap.addQuestMenu();
                htmlCode += battle.menu();
                htmlCode += monster.menu();
                htmlCode += guild_monster.menu();
                htmlCode += feed.menu();
                //htmlCode += arena.menu();
                if (false) {
                    htmlCode += festival.menu();
                } else {
                    if (config.getItem("WhenFestival", "Never") !== "Never") {
                        config.setItem("WhenFestival", "Never");
                    }
                }

                htmlCode += general.menu();
                htmlCode += caap.addSkillPointsMenu();
                htmlCode += army.menu();
                if (caap.domain.which === 0) {
                    htmlCode += gifting.menu();
                } else {
                    config.setItem("AutoGift", false);
                    config.setItem("watchBeeper", false);
                }

                htmlCode += caap.addAutoOptionsMenu();
                htmlCode += caap.addFestivalOptionsMenu();
                htmlCode += town.menu();
                htmlCode += caap.addOtherOptionsMenu();
                htmlCode += caap.addFooterMenu();
                caap.setDivContent('control', htmlCode, caapDiv);
                $j("input[type='button']", caapDiv).button();
                caap.makeSliderListener("CustStyleOpacityLight", 0.5, 1, 0.01, 1, true, caapDiv);
                caap.makeSliderListener("CustStyleOpacityDark", 0.5, 1, 0.01, 1, true, caapDiv);
                caap.makeSliderListener("scrollToPosition", 0, 1000, 10, 0, false, caapDiv);
                if (reload === true) {
                    caap.caapDivObject.replaceWith(caapDiv);
                    caap.caapDivObject = caapDiv;
                    caap.pauseListener();
                    caap.reBindCaapDiv();
                } else {
                    caap.caapDivObject = caapDiv.appendTo(document.body);
                }

                caap.checkLastAction(state.getItem('LastAction', 'idle'));
                return true;
            } catch (err) {
                con.error("ERROR in addControl: " + err);
                return false;
            }
        },

        addCaapAjax: function () {
            try {
                caap.tempAjax = true ? $j("<div id='caap_ajax'></div>") : $j("<div id='caap_ajax'></div>").appendTo(document.body);
                return true;
            } catch (err) {
                con.error("ERROR in addCaapAjax: " + err);
                return false;
            }
        },

        ajax: function (page, params, cbError, cbSuccess) {
            try {
                if (caap.domain.which !== 2 && caap.domain.which !== 3) {
                    throw "can not be called on this domain: " + caap.domain.which;
                }

                params = $u.hasContent(params) && $u.isPlainObject(params) && !$u.isEmptyObject(params) ? params : {};
                params["ajax"] = 1;
                var signedRequest = session.getItem("signedRequest");
                if ($u.hasContent(signedRequest) && $u.isString(signedRequest)) {
                    params["signed_request"] = signedRequest;
                }

                if (!$u.hasContent(page) || !$u.isString(page)) {
                    page = "index.php";
                    params["adkx"] = 2;
                }

                if (!$u.hasContent(cbError) || !$u.isFunction(cbError)) {
                    cbError = function (XMLHttpRequest, textStatus, errorThrown) {
                        con.error("ajax: " + textStatus);
                    };
                }

                if (!$u.hasContent(cbSuccess) || !$u.isFunction(cbSuccess)) {
                    cbSuccess = function (data, textStatus, XMLHttpRequest) {
                        con.log(2, "ajax:", textStatus);
                    };
                }

                $j.ajax({
                    url: page,
                    type: 'POST',
                    data: params,
                    error:
                        function (XMLHttpRequest, textStatus, errorThrown) {
                            cbError(XMLHttpRequest, textStatus, errorThrown);
                        },
                    success:
                        function (data, textStatus, XMLHttpRequest) {
                            data = caap.tempAjax.html($j("<div>" + data + "</div>").html());
                            con.log(2, "ajax", [data, textStatus, XMLHttpRequest]);
                            cbSuccess(data, textStatus, XMLHttpRequest);
                        }
                });

                return true;
            } catch (err) {
                con.error("ERROR in ajax: " + err);
                return false;
            }
        },

        addPauseMenu: function () {
            try {
                return "<div id='caapPaused' style='font-weight: bold; display: " + state.getItem('caapPause', 'block') + "'>Paused on mouse click.<br /><a href='javascript:;' id='caapRestart' >Click here to restart</a></div><hr />";
            } catch (err) {
                con.error("ERROR in addPauseMenu: " + err);
                return '';
            }
        },

        addDisableMenu: function () {
            try {
                var autoRunInstructions = "Disable auto running of CAAP. Stays persistent even on page reload and the autoplayer will not autoplay.",
                    htmlCode = '';

                htmlCode += caap.makeCheckTR("Disable Autoplayer", 'Disabled', false, autoRunInstructions);
                htmlCode += '<hr />';
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addDisableMenu: " + err);
                return '';
            }
        },

        addCashHealthMenu: function () {
            try {
                var bankInstructions0 = "Minimum cash to keep in the bank. Press tab to save",
                    bankInstructions1 = "Minimum cash to have on hand, press tab to save",
                    bankInstructions2 = "Maximum cash to have on hand, bank anything above this, press tab to save (leave blank to disable).",
                    healthInstructions = "Minimum health to have before healing, press tab to save (leave blank to disable).",
                    healthStamInstructions = "Minimum Stamina to have before healing, press tab to save (leave blank to disable).",
                    bankImmedInstructions = "Bank as soon as possible. May interrupt player and monster battles.",
                    autobuyInstructions = "Automatically buy lands in groups of 10 based on best Return On Investment value.",
                    autosellInstructions = "Automatically sell off any excess lands above your level allowance.",
                    htmlCode = '';

                htmlCode = caap.startToggle('CashandHealth', 'CASH and HEALTH');
                htmlCode += caap.makeCheckTR("Bank Immediately", 'BankImmed', false, bankImmedInstructions);
                htmlCode += caap.makeCheckTR("Auto Buy Lands", 'autoBuyLand', false, autobuyInstructions);
                htmlCode += caap.makeCheckTR("Auto Sell Excess Lands", 'SellLands', false, autosellInstructions);
                htmlCode += caap.makeNumberFormTR("Keep In Bank", 'minInStore', bankInstructions0, 100000, '', '', false, false, 62);
                htmlCode += caap.makeNumberFormTR("Bank Above", 'MaxInCash', bankInstructions2, '', '', '', false, false, 40);
                htmlCode += caap.makeNumberFormTR("But Keep On Hand", 'MinInCash', bankInstructions1, '', '', '', true, false, 40);
                htmlCode += caap.makeNumberFormTR("Heal If Health Below", 'MinToHeal', healthInstructions, '', '', '');
                htmlCode += caap.makeNumberFormTR("Not If Stamina Below", 'MinStamToHeal', healthStamInstructions, '', '', '', true, false);
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addCashHealthMenu: " + err);
                return '';
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        addQuestMenu: function () {
            try {
                var forceSubGen = "Always do a quest with the Subquest General you selected under the Generals section. NOTE: This will keep the script from automatically switching to the required general for experience of primary quests.",
                    XQuestInstructions = "Start questing when energy is at or above this value.",
                    XMinQuestInstructions = "Stop quest when energy is at or below this value.",
                    questForList = [
                        'Advancement',
                        'Max Influence',
                        'Max Gold',
                        'Max Experience',
                        'Manual'
                    ],
                    questForListInstructions = [
                        'Advancement performs all the main quests in a sub quest area but not the secondary quests.',
                        'Max Influence performs all the main and secondary quests in a sub quest area.',
                        'Max Gold performs the quest in the specific area that yields the highest gold.',
                        'Max Experience performs the quest in the specific area that yields the highest experience.',
                        'Manual performs the specific quest that you have chosen.'
                    ],
                    questAreaList = [
                        'Quest',
                        'Demi Quests',
                        'Atlantis'
                    ],
                    questWhenList = [
                        'Energy Available',
                        'At Max Energy',
                        'At X Energy',
                        'Not Fortifying',
                        'Never'
                    ],
                    questWhenInst = [
                        'Energy Available - will quest whenever you have enough energy.',
                        'At Max Energy - will quest when energy is at max and will burn down all energy when able to level up.',
                        'At X Energy - allows you to set maximum and minimum energy values to start and stop questing. Will burn down all energy when able to level up.',
                        'Not Fortifying - will quest only when your fortify settings are matched.',
                        'Never - disables questing.'
                    ],
                    stopInstructions = "This will stop and remove the chosen quest and set questing to manual.",
                    autoQuestName = state.getItem('AutoQuest', caap.newAutoQuest())['name'],
                    htmlCode = '';

                htmlCode = caap.startToggle('Quests', 'QUEST');
                htmlCode += caap.makeDropDownTR("Quest When", 'WhenQuest', questWhenList, questWhenInst, '', 'Never', false, false, 62);
                htmlCode += caap.startDropHide('WhenQuest', '', 'Never', true);
                htmlCode += caap.startDropHide('WhenQuest', 'XEnergy', 'At X Energy', false);
                htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XQuestEnergy', XQuestInstructions, 1, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinQuestEnergy', XMinQuestInstructions, 0, '', '', true, false);
                htmlCode += caap.endDropHide('WhenQuest', 'XEnergy');
                htmlCode += caap.makeDropDownTR("Quest Area", 'QuestArea', questAreaList, '', '', '', false, false, 62);
                switch (config.getItem('QuestArea', questAreaList[0])) {
                case 'Quest':
                    htmlCode += caap.makeDropDownTR("Sub Area", 'QuestSubArea', caap.landQuestList, '', '', '', false, false, 62);
                    break;
                case 'Demi Quests':
                    htmlCode += caap.makeDropDownTR("Sub Area", 'QuestSubArea', caap.demiQuestList, '', '', '', false, false, 62);
                    break;
                default:
                    htmlCode += caap.makeDropDownTR("Sub Area", 'QuestSubArea', caap.atlantisQuestList, '', '', '', false, false, 62);
                    break;
                }

                htmlCode += caap.makeDropDownTR("Quest For", 'WhyQuest', questForList, questForListInstructions, '', '', false, false, 62);
                htmlCode += caap.makeCheckTR("Switch Quest Area", 'switchQuestArea', true, 'Allows switching quest area after Advancement or Max Influence');
                htmlCode += caap.makeCheckTR("Use Only Subquest General", 'ForceSubGeneral', false, forceSubGen);
                htmlCode += caap.makeCheckTR("Quest For Orbs", 'GetOrbs', false, 'Perform the Boss quest in the selected land for orbs you do not have.');
                htmlCode += "<a id='caap_stopAutoQuest' style='display: " + (autoQuestName ? "block" : "none") + "' href='javascript:;' title='" + stopInstructions + "'>";
                htmlCode += (autoQuestName ? "Stop auto quest: " + autoQuestName + " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")" : '');
                htmlCode += "</a>";
                htmlCode += caap.endDropHide('WhenQuest');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addQuestMenu: " + err);
                return '';
            }
        },
        /*jslint sub: false */

        addSkillPointsMenu: function () {
            try {
                var statusInstructions = "Automatically increase attributes when " +
                        "upgrade skill points are available.",
                    statusAdvInstructions = "USE WITH CAUTION: You can use numbers or " +
                        "formulas(ie. level * 2 + 10). Variable keywords include energy, " +
                        "health, stamina, attack, defense, and level. JS functions can be " +
                        "used (Math.min, Math['max'], etc) !!!Remember your math class: " +
                        "'level + 20' not equals 'level * 2 + 10'!!!",
                    statImmedInstructions = "Update Stats Immediately",
                    statSpendAllInstructions = "If selected then spend all possible points and do not save for stamina upgrade.",
                    attrList = [
                        '',
                        'Energy',
                        'Attack',
                        'Defense',
                        'Stamina',
                        'Health'
                    ],
                    it = 0,
                    htmlCode = '';

                htmlCode += caap.startToggle('Status', 'UPGRADE SKILL POINTS');
                htmlCode += caap.makeCheckTR("Auto Add Upgrade Points", 'AutoStat', false, statusInstructions);
                htmlCode += caap.startCheckHide('AutoStat');
                htmlCode += caap.makeCheckTR("Spend All Possible", 'StatSpendAll', false, statSpendAllInstructions);
                htmlCode += caap.makeCheckTR("Upgrade Immediately", 'StatImmed', false, statImmedInstructions);
                htmlCode += caap.makeCheckTR("Advanced Settings <a href='http://caaplayer.freeforums.org/help-for-upgrade-points-control-t418.html' target='_blank' style='color: blue'>(INFO)</a>", 'AutoStatAdv', false, statusAdvInstructions);
                htmlCode += caap.startCheckHide('AutoStatAdv', true);
                for (it = 0; it < 5; it += 1) {
                    htmlCode += caap.startTR();
                    htmlCode += caap.makeTD("Increase", false, false, "width: 27%; display: inline-block;");
                    htmlCode += caap.makeTD(caap.makeDropDown('Attribute' + it, attrList, '', ''), false, false, "width: 40%; display: inline-block;");
                    htmlCode += caap.makeTD("to", false, false, "text-align: center; width: 10%; display: inline-block;");
                    htmlCode += caap.makeTD(caap.makeNumberForm('AttrValue' + it, statusInstructions, 0), false, true, "width: 20%; display: inline-block;");
                    htmlCode += caap.endTR;
                }

                htmlCode += caap.endCheckHide('AutoStatAdv', true);
                htmlCode += caap.startCheckHide('AutoStatAdv');
                for (it = 5; it < 10; it += 1) {
                    htmlCode += caap.startTR();
                    htmlCode += it === 5 ? caap.makeTD("Increase", false, false, "width: 25%; display: inline-block;") : caap.makeTD("Then", false, false, "width: 25%; display: inline-block;");
                    htmlCode += caap.makeTD(caap.makeDropDown('Attribute' + it, attrList, '', '', ''), false, false, "width: 45%; display: inline-block;");
                    htmlCode += caap.makeTD("using", true, false, "width: 25%; display: inline-block;");
                    htmlCode += caap.endTR;
                    htmlCode += caap.makeTD(caap.makeNumberForm('AttrValue' + it, statusInstructions, '', '', 'text', 'width: 97%;'));
                }

                htmlCode += caap.endCheckHide('AutoStatAdv');
                htmlCode += caap.endCheckHide('AutoStat');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addSkillPointsMenu: " + err);
                return '';
            }
        },

        addAutoOptionsMenu: function () {
            try {
                // Other controls
                var autoAlchemyInstructions1 = "AutoAlchemy will combine all recipes " +
                        "that do not have missing ingredients. By default, it will not " +
                        "combine Battle Hearts recipes.",
                    autoAlchemyInstructions2 = "If for some reason you do not want " +
                        "to skip Battle Hearts",
                    autoPotionsInstructions0 = "Enable or disable the auto consumption " +
                        "of energy and stamina potions.",
                    autoPotionsInstructions1 = "Number of stamina potions at which to " +
                        "begin consuming.",
                    autoPotionsInstructions2 = "Number of stamina potions to keep.",
                    autoPotionsInstructions3 = "Number of energy potions at which to " +
                        "begin consuming.",
                    autoPotionsInstructions4 = "Number of energy potions to keep.",
                    autoPotionsInstructions5 = "Do not consume potions if the " +
                        "experience points to the next level are within this value.",
                    autoBlessList = [
                        'None',
                        'Energy',
                        'Attack',
                        'Defense',
                        'Health',
                        'Stamina'
                    ],
                    autoBlessListInstructions = [
                        'None disables the auto bless feature.',
                        'Energy performs an automatic daily blessing with Ambrosia.',
                        'Attack performs an automatic daily blessing with Malekus.',
                        'Defense performs an automatic daily blessing with Corvintheus.',
                        'Health performs an automatic daily blessing with Aurora.',
                        'Stamina performs an automatic daily blessing with Azeron.'
                    ],
                    htmlCode = '';

                htmlCode += caap.startToggle('Auto', 'AUTO OPTIONS');
                htmlCode += caap.makeDropDownTR("Auto Bless", 'AutoBless', autoBlessList, autoBlessListInstructions, '', '', false, false, 62);
                htmlCode += caap.makeCheckTR('Auto Potions', 'AutoPotions', false, autoPotionsInstructions0);
                htmlCode += caap.startCheckHide('AutoPotions');
                htmlCode += caap.makeNumberFormTR("Spend Stamina At", 'staminaPotionsSpendOver', autoPotionsInstructions1, 39, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Keep Stamina", 'staminaPotionsKeepUnder', autoPotionsInstructions2, 35, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Spend Energy At", 'energyPotionsSpendOver', autoPotionsInstructions3, 39, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Keep Energy", 'energyPotionsKeepUnder', autoPotionsInstructions4, 35, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Wait If Exp. To Level", 'potionsExperience', autoPotionsInstructions5, 20, '', '', true, false);
                htmlCode += caap.endCheckHide('AutoPotions');
                htmlCode += caap.makeCheckTR('Auto Alchemy', 'AutoAlchemy', false, autoAlchemyInstructions1);
                htmlCode += caap.startCheckHide('AutoAlchemy');
                htmlCode += caap.makeCheckTR('Do Battle Hearts', 'AutoAlchemyHearts', false, autoAlchemyInstructions2, true);
                htmlCode += caap.endCheckHide('AutoAlchemy');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addAutoOptionsMenu: " + err);
                return '';
            }
        },

        addFestivalOptionsMenu: function () {
            try {
                // Other controls
                var festivalBlessList = [
                        'None',
                        'Energy',
                        'Attack',
                        'Defense',
                        'Health',
                        'Stamina',
                        'Army'
                    ],
                    htmlCode = '';

                htmlCode += caap.startToggle('FestivalOptions', 'FESTIVAL OPTIONS');
                htmlCode += caap.makeDropDownTR("Feats", 'festivalBless', festivalBlessList, '', '', '', false, false, 62);
                htmlCode += caap.makeCheckTR('Enable Tower', 'festivalTower', false, '');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addFestivalOptionsMenu: " + err);
                return '';
            }
        },

        addOtherOptionsMenu: function () {
            try {
                // Other controls
                var timeInstructions = "Use 24 hour format for displayed times.",
                    titleInstructions0 = "Set the title bar.",
                    titleInstructions1 = "Add the current action.",
                    titleInstructions2 = "Add the player name.",
                    hideAdsInstructions = "Hides the sidebar adverts.",
                    hideAdsIframeInstructions = "Hide the FaceBook Iframe adverts",
                    hideFBChatInstructions = "Hide the FaceBook Chat",
                    newsSummaryInstructions = "Enable or disable the news summary on the index page.",
                    bannerInstructions = "Uncheck if you wish to hide the CAAP banner.",
                    donateInstructions = "Uncheck if you wish to hide the CAAP donate button.",
                    itemTitlesInstructions = "Replaces the CA item titles with more useful tooltips.",
                    goblinHintingInstructions = "When in the Goblin Emporium, CAAP will try to hide items that you require and fade those that may be required.",
                    ingredientsHideInstructions = "Hide the ingredients list on the Alchemy pages.",
                    alchemyShrinkInstructions = "Reduces the size of the item images and shrinks the recipe layout on the Alchemy pages.",
                    keepShrinkInstructions = "Reduces the size of the item images on the Keep pages.",
                    recipeCleanInstructions = "CAAP will try to hide recipes that are no longer required on the Alchemy page and therefore shrink the list further.",
                    recipeCleanCountInstructions = "The number of items to be owned before cleaning the recipe item from the Alchemy page.",
                    bookmarkModeInstructions = "Enable this if you are running CAAP from a bookmark. Disables refreshes and gifting. Note: not recommended for long term operation.",
                    levelupModeInstructions = "Calculates approx. how many XP points you will get from your current stamina and energy and when you have enough of each to level up it will start using them down to 0.",
                    serializeInstructions = "Setting this value allows you to define your Raids and Monsters all within either the Monster Attack Order or Raid Attack Order list boxes. Selection is serialized so that you only have a single selection from the list active at one time.  This is in contrast to the default mode, where you can have an active Raid and an active Monster, both processing independently.",
                    styleList = [
                        'CA Skin',
                        'Original',
                        'Custom',
                        'None'
                    ],
                    htmlCode = '';

                htmlCode += caap.startToggle('Other', 'OTHER OPTIONS');
                if (caap.domain.which === 0) {
                    htmlCode += caap.makeCheckTR('FB Custom Dropdown', 'FBCustomDrop', false, "Enable FB custom request dropdown");
                    htmlCode += caap.startCheckHide('FBCustomDrop');
                    htmlCode += caap.startTR();
                    htmlCode += caap.makeTD(caap.makeTextBox('FBCustomDropList', "List of UserIDs for a FB custom request dropdown", '', ''));
                    htmlCode += caap.endTR;
                    htmlCode += caap.endCheckHide('FBCustomDrop');
                }

                htmlCode += caap.makeCheckTR('Display Keep Stats', 'displayKStats', true, "Display user statistics on your keep.");
                htmlCode += caap.makeCheckTR('Enable Oracle Mod', 'enableOracleMod', true, "Allows you to change the monthly general and the equipment that you wish to purchase.");
                htmlCode += caap.makeCheckTR('Display ETNL', 'displayETNL', true, "Display Experience To Next Level.");
                htmlCode += caap.makeCheckTR('Display Item Titles', 'enableTitles', true, itemTitlesInstructions);
                htmlCode += caap.makeCheckTR('Do Goblin Hinting', 'goblinHinting', true, goblinHintingInstructions);
                htmlCode += caap.makeCheckTR('Hide Recipe Ingredients', 'enableIngredientsHide', false, ingredientsHideInstructions);
                htmlCode += caap.makeCheckTR('Alchemy Shrink', 'enableAlchemyShrink', true, alchemyShrinkInstructions);
                htmlCode += caap.makeCheckTR('Keep Shrink', 'enableKeepShrink', true, keepShrinkInstructions);
                htmlCode += caap.makeCheckTR('Recipe Clean-Up', 'enableRecipeClean', 1, recipeCleanInstructions);
                htmlCode += caap.startCheckHide('enableRecipeClean');
                htmlCode += caap.makeNumberFormTR("Recipe Count", 'recipeCleanCount', recipeCleanCountInstructions, 1, '', '', true);
                htmlCode += caap.endCheckHide('enableRecipeClean');
                if (caap.domain.which === 0) {
                    htmlCode += caap.makeCheckTR('Auto Scroll To Top', 'scrollToTop', false, "Automatically scrolls the window to the very top of the view.");
                    htmlCode += caap.startCheckHide('scrollToTop');
                    htmlCode += caap.makeSlider('Offset', "scrollToPosition", '', 0, true);
                    htmlCode += caap.endCheckHide('scrollToTop');
                }

                htmlCode += caap.makeCheckTR('Display CAAP Banner', 'BannerDisplay', true, bannerInstructions);
                htmlCode += caap.makeCheckTR('Display CAAP Donate', 'DonateDisplay', true, donateInstructions);
                htmlCode += caap.makeCheckTR('Use 24 Hour Format', 'use24hr', true, timeInstructions);
                htmlCode += caap.makeCheckTR('Set Title', 'SetTitle', false, titleInstructions0);
                htmlCode += caap.startCheckHide('SetTitle');
                htmlCode += caap.makeCheckTR('Display Action', 'SetTitleAction', false, titleInstructions1, true);
                htmlCode += caap.makeCheckTR('Display Name', 'SetTitleName', false, titleInstructions2, true);
                htmlCode += caap.endCheckHide('SetTitle');
                htmlCode += caap.makeCheckTR('Auto Comma Text Areas', 'TextAreaCommas', false, "When enabled, text input areas will be automatically converted to comma seperation");
                if (caap.domain.which === 0) {
                    htmlCode += caap.makeCheckTR('Use CA Background', 'backgroundCA', false, '');
                    //htmlCode += caap.makeCheckTR('Inject CA-Tools', 'injectCATools', false, 'EXPERIMENTAL: Injects the CA-Tools bookmarklet.');
                    htmlCode += caap.makeCheckTR('Hide Sidebar Adverts', 'HideAds', false, hideAdsInstructions);
                    htmlCode += caap.makeCheckTR('Hide FB Iframe Adverts', 'HideAdsIframe', false, hideAdsIframeInstructions);
                    htmlCode += caap.makeCheckTR('Hide FB Chat', 'HideFBChat', false, hideFBChatInstructions);
                    //htmlCode += caap.makeCheckTR('Hide Cross Adverts', 'HideCrossAds', false, "Hide CA cross advertising.");
                }

                htmlCode += caap.makeCheckTR('Enable News Summary', 'NewsSummary', true, newsSummaryInstructions);
                htmlCode += caap.makeDropDownTR("Style", 'DisplayStyle', styleList, '', '', 'CA Skin', false, false, 62);
                htmlCode += caap.startDropHide('DisplayStyle', '', 'Custom');
                htmlCode += caap.makeTD("Running:");
                htmlCode += caap.makeNumberFormTR("Color", 'CustStyleBackgroundLight', '#FFFFFF', '#E0C691', '', 'color', true, false, 40);
                htmlCode += caap.makeSlider('Transparency', "CustStyleOpacityLight", '', 1, true);
                htmlCode += caap.makeTD("Paused:");
                htmlCode += caap.makeNumberFormTR("Color", 'CustStyleBackgroundDark', '#FFFFFF', '#B09060', '', 'color', true, false, 40);
                htmlCode += caap.makeSlider('Transparency', "CustStyleOpacityDark", '', 1, true);
                htmlCode += caap.endDropHide('DisplayStyle');
                htmlCode += caap.makeCheckTR('Advanced', 'AdvancedOptions', false);
                htmlCode += caap.startCheckHide('AdvancedOptions');
                htmlCode += caap.makeCheckTR('Enable Level Up Mode', 'EnableLevelUpMode', true, levelupModeInstructions, true);
                htmlCode += caap.makeCheckTR('Serialize Raid and Monster', 'SerializeRaidsAndMonsters', false, serializeInstructions, true);
                htmlCode += caap.makeCheckTR('Bookmark Mode', 'bookmarkMode', false, bookmarkModeInstructions, true);
                htmlCode += caap.makeNumberFormTR("Reload Frequency", 'ReloadFrequency', 'Changing this will cause longer/shorter refresh rates. Minimum is 8 minutes.', 8, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Log Level", 'DebugLevel', '', 1, '', '', true, false);
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("<input type='button' id='caap_ActionList' value='Modify Action Order' style='padding: 0; font-size: 10px; height: 18px' />");
                htmlCode += caap.endTR;
                htmlCode += "<form><fieldset><legend>Database</legend>";
                htmlCode += caap.makeDropDownTR("Which Data", 'DataSelect', caap.exportList(), '', '', 'Config', true, false, 50);
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("<input type='button' id='caap_ExportData' value='Export' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                htmlCode += caap.makeTD("<input type='button' id='caap_ImportData' value='Import' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                htmlCode += caap.makeTD("<input type='button' id='caap_DeleteData' value='Delete' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                htmlCode += caap.makeCheckTR("Town Item Report BBCode", "townBBCode", true, 'Switches between BBCode for forum posts and a screen viewable table.');
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("<input type='button' id='caap_TownItemReport' value='Town Item Report' style='padding: 0; font-size: 10px; height: 18px' />", false, false, "text-align: center;");
                htmlCode += caap.endTR;
                htmlCode += caap.endTR;
                htmlCode += "</fieldset></form>";

                if (db && db.available) {
                    htmlCode += "<form><fieldset><legend>Config</legend>";
                    htmlCode += caap.startTR();
                    htmlCode += caap.makeTD("<input type='button' id='caap_BackupConfig' value='Profiles' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                    htmlCode += caap.makeTD("<input type='button' id='caap_BackupCurrent' value='Backup' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                    htmlCode += caap.makeTD("<input type='button' id='caap_RestoreCurrent' value='Restore' style='padding: 0; font-size: 10px; height: 18px' />", true, false, "display: inline-block;");
                    htmlCode += caap.endTR;
                    htmlCode += "</fieldset></form>";
                }

                htmlCode += caap.endCheckHide('AdvancedOptions');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in addOtherOptionsMenu: " + err);
                return '';
            }
        },

        addFooterMenu: function () {
            try {
                var htmlCode = '';
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("Unlock Menu <input type='button' id='caap_ResetMenuLocation' value='Reset' style='padding: 0; font-size: 10px; height: 18px' />", false, false, "width: 90%; display: inline-block;");
                htmlCode += caap.makeTD("<input type='checkbox' id='unlockMenu' />", false, true, "width: 10%; display: inline-block;");
                htmlCode += caap.endTR;

                if (devVersion === '0') {
                    htmlCode += caap.makeTD("Version: " + caapVersion + " - <a href='http://caaplayer.freeforums.org/' target='_blank'>CAAP Forum</a>");
                    if (caap.newVersionAvailable) {
                        htmlCode += caap.makeTD("<a href='http://castle-age-auto-player.googlecode.com/files/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + "!</a>");
                    }
                } else {
                    htmlCode += caap.makeTD("Version: " + caapVersion + " d" + devVersion + " - <a href='http://caaplayer.freeforums.org/' target='_blank'>CAAP Forum</a>");
                    if (caap.newVersionAvailable) {
                        htmlCode += caap.makeTD("<a href='http://castle-age-auto-player.googlecode.com/svn/trunk/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + " d" + state.getItem('DEV_remote_version')  + "!</a>");
                    }
                }

                return htmlCode;
            } catch (err) {
                con.error("ERROR in addFooterMenu: " + err);
                return '';
            }
        },

        addDashboard: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                 Here is where we construct the HTML for our dashboard. We start by building the outer
                 container and position it within the main container.
                \-------------------------------------------------------------------------------------*/
                var layout      = "<div id='caap_top'>",
                    displayList = [
                        /*'Arena',*/
                        'Army',
                        'Battle Stats',
                        'Feed',
                        'Festival',
                        'Generals Stats',
                        'Gift Queue',
                        'Gifting Stats',
                        'Guild Monster',
                        'Item Stats',
                        'Magic Stats',
                        'Monster',
                        'Soldiers Stats',
                        'Target List',
                        'User Stats'
                    ],
                    displayInst = [
                        /*'Display the Arena battle in progress.',*/
                        'Display your army members, the last time they leveled up and choose priority Elite Guard.',
                        'Display your Battle history statistics, who you fought and if you won or lost.',
                        'Display the monsters that have been seen in your Live Feed and/or Guild Feed that are still valid.',
                        'Display the Festival battle in progress.',
                        'Display information about your Generals.',
                        'Display your current Gift Queue',
                        'Display your Gifting history, how many gifts you have received and returned to a user.',
                        'Guild Monster',
                        'Display information about Items seen in your Black Smith page.',
                        'Display information about Magic seen in your Magic page.',
                        'Display your Monster battles.',
                        'Display information about Soldiers seen in your Soldiers page.',
                        'Display information about Targets that you have performed reconnaissance on.',
                        'Useful informaton about your account and character statistics.'
                    ],
                    styleXY = {
                        x: 0,
                        y: 0
                    },
                    bgc = state.getItem("StyleBackgroundLight", "#E0C961");

                /*-------------------------------------------------------------------------------------\
                 Next we put in our Refresh Monster List button which will only show when we have
                 selected the Monster display.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonMonster' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Monster' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_refreshMonsters' value='Refresh Monster List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in our Refresh Guild Monster List button which will only show when we have
                 selected the Guild Monster display.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonGuildMonster' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Guild Monster' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_refreshGuildMonsters' value='Refresh Guild Monster List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in the Clear Target List button which will only show when we have
                 selected the Target List display
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonTargets' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Target List' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_clearTargets' value='Clear Targets List' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in the Clear Battle Stats button which will only show when we have
                 selected the Target List display
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonBattle' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Battle Stats' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_clearBattle' value='Clear Battle Stats' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in the Clear Gifting Stats button which will only show when we have
                 selected the Target List display
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonGifting' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gifting Stats' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_clearGifting' value='Clear Gifting Stats' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in the Clear Gift Queue button which will only show when we have
                 selected the Target List display
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonGiftQueue' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gift Queue' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_clearGiftQueue' value='Clear Gift Queue' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Next we put in the Clear Gifting Stats button which will only show when we have
                 selected the Target List display
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonArmy' style='position:absolute;top:0px;left:250px;display:" + (config.getItem('DBDisplay', 'Monster') === 'Army' ? 'block' : 'none') + "'>";
                layout += "<input type='button' id='caap_getArmy' value='Get Army' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Then we put in the Live Feed link since we overlay the Castle Age link.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonFeed' style='position:absolute;top:0px;left:10px;'><input id='caap_liveFeed' type='button' value='Live Feed' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Then we put in the Crusaders link since we overlay the Castle Age link.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonCrusaders' style='position:absolute;top:0px;left:80px;'><input id='caap_crusaders' type='button' value='Crusaders' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 Then we put in the Fast Heal.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_buttonFastHeal' style='position:absolute;top:0px;left:160px;'><input id='caap_fastHeal' type='button' value='Fast Heal' style='padding: 0; font-size: 9px; height: 18px' /></div>";
                /*-------------------------------------------------------------------------------------\
                 We install the display selection box that allows the user to toggle through the
                 available displays.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_DBDisplay' style='font-size: 9px;position:absolute;top:0px;right:25px;'>Display: ";
                layout += caap.makeDropDown('DBDisplay', displayList, displayInst, '', 'User Stats', "font-size: 9px; min-width: 90px; max-width: 90px; width : 90px;") + "</div>";
                /*-------------------------------------------------------------------------------------\
                 We install the display selection box that allows the user to toggle through the
                 available displays.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_dashMin' class='ui-icon ui-icon-circle-minus' style='position:absolute;top:0px;right:5px;' title='Minimise' onmouseover='this.style.cursor=\"pointer\";' onmouseout='this.style.cursor=\"default\";'>-</div>";
                /*-------------------------------------------------------------------------------------\
                And here we build our empty content divs.  We display the appropriate div
                depending on which display was selected using the control above
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_infoMonster' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Monster' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_guildMonster' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Guild Monster' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_infoTargets1' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Target List' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_infoBattle' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Battle Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_userStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'User Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_generalsStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Generals Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_soldiersStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Soldiers Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_itemStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Item Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_magicStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Magic Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_giftStats' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gifting Stats' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_giftQueue' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Gift Queue' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_army' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Army' ? 'block' : 'none') + "'></div>";
                //layout += "<div id='caap_arena' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Arena' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_festival' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Festival' ? 'block' : 'none') + "'></div>";
                layout += "<div id='caap_feed' style='position:relative;top:15px;width:610px;height:165px;overflow:auto;display:" + (config.getItem('DBDisplay', 'Monster') === 'Feed' ? 'block' : 'none') + "'></div>";
                layout += "</div>";
                /*-------------------------------------------------------------------------------------\
                 No we apply our CSS to our container
                \-------------------------------------------------------------------------------------*/
                caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
                caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
                styleXY = caap.getDashboardXY();
                $j(layout).css({
                    background              : bgc,
                    color                   : $u.bestTextColor(bgc),
                    padding                 : "5px",
                    height                  : "185px",
                    width                   : "610px",
                    margin                  : "0 auto",
                    opacity                 : state.getItem('StyleOpacityLight', 1),
                    top                     : styleXY.y + 'px',
                    left                    : styleXY.x + 'px',
                    zIndex                  : state.getItem('caap_top_zIndex', 1),
                    position                : 'absolute',
                    display                 : config.getItem("dashMinimised", false) ? 'none' : 'block'
                }).appendTo(document.body);

                caap.caapTopObject = $j('#caap_top');
                $j("input[type='button']", caap.caapTopObject).button();
                return true;
            } catch (err) {
                con.error("ERROR in addDashboard: " + err);
                return false;
            }
        },

        addDashboardMin: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                 Here is where we construct the HTML for our dashboard. We start by building the outer
                 container and position it within the main container.
                \-------------------------------------------------------------------------------------*/
                var layout      = "<div id='caap_topmin'>",
                    styleXY = {
                        x: 0,
                        y: 0
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
                    background              : bgc,
                    color                   : $u.bestTextColor(bgc),
                    padding                 : "5px",
                    height                  : "6px",
                    width                   : "6px",
                    margin                  : "0 auto",
                    opacity                 : state.getItem('StyleOpacityLight', 1),
                    top                     : styleXY.y + 'px',
                    left                    : styleXY.x + 'px',
                    zIndex                  : state.getItem('caap_top_zIndex', 1),
                    position                : 'absolute',
                    display                 : config.getItem("dashMinimised", false) ? 'block' : 'none'
                }).appendTo(document.body);

                caap.caapTopMinObject = $j('#caap_topmin');
                return true;
            } catch (err) {
                con.error("ERROR in addDashboardMin: " + err);
                return false;
            }
        },

        addPlayButton: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                 Here is where we construct the HTML for our dashboard. We start by building the outer
                 container and position it within the main container.
                \-------------------------------------------------------------------------------------*/
                var layout = "<div id='caap_playbuttondiv'>",
                    bgc = state.getItem('StyleBackgroundDark', '#B09060');

                /*-------------------------------------------------------------------------------------\
                 We install the display selection box that allows the user to toggle through the
                 available displays.
                \-------------------------------------------------------------------------------------*/
                layout += "<div id='caap_playbutton' class='ui-icon ui-icon-circle-triangle-e' style='position:absolute;top:0px;left:0px;' title='Resume' onmouseover='this.style.cursor=\"pointer\";' onmouseout='this.style.cursor=\"default\";'>&gt;</div>";
                layout += "</div>";
                /*-------------------------------------------------------------------------------------\
                 No we apply our CSS to our container
                \-------------------------------------------------------------------------------------*/
                $j(layout).css({
                    background              : bgc,
                    color                   : $u.bestTextColor(bgc),
                    padding                 : "5px",
                    height                  : "6px",
                    width                   : "6px",
                    margin                  : "0 auto",
                    opacity                 : state.getItem('StyleOpacityDark', 1),
                    top                     : '0px',
                    left                    : '0px',
                    zIndex                  : '99',
                    position                : 'fixed',
                    display                 : state.getItem('caapPause', 'none')
                }).appendTo(document.body);

                caap.caapPlayButtonDiv = $j('#caap_playbuttondiv');
                return true;
            } catch (err) {
                con.error("ERROR in addPlayButton: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                      MONSTERS DASHBOARD
        // Display the current monsters and stats
        /////////////////////////////////////////////////////////////////////

        makeTable: function (id, head, body, caption, style) {
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
        },

        makeTr: function (data, style) {
            try {
                return $u.hasContent(data) ? "<tr" + ($u.hasContent(style) ? " style='" + style + "'" : "") + ">" + data + "</tr>" : "";
            } catch (err) {
                con.error("ERROR in makeTr: " + err);
                return undefined;
            }
        },

        makeTh: function (obj, style) {
            try {
                var header = {text: '', color: '', bgcolor: '', id: '', title: '', width: ''},
                    type   = " data-type='bestcolor'",
                    html   = '<th';

                header = obj;
                type = $u.hasContent(header.color) ? '' : type;
                header.color = $u.setContent(header.color, $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961")));
                html += $u.hasContent(header.id) ? " id='" + header.id + "'" : '';
                html += $u.hasContent(header.title) ? " title='" + header.title + "'" : '';
                html += type + " style='color:" + header.color + ";" + ($u.hasContent(header.bgcolor) ? "background-color:" + header.bgcolor + ";" : '') + ($u.hasContent(header.width) ? "width:" + header.width + ";" : '') + ($u.hasContent(style) ? style : "") + "'>" + header.text + "</th>";
                return html;
            } catch (err) {
                con.error("ERROR in makeTh: " + err);
                return undefined;
            }
        },

        makeTd: function (obj, style) {
            try {
                var data = {text: '', color: '', bgcolor: '', id: '',  title: ''},
                    type = " data-type='bestcolor'",
                    html = '<td';

                data = obj;
                type = $u.hasContent(data.color) ? '' : type;
                data.color = $u.setContent(data.color, $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961")));
                html += $u.hasContent(data.id) ? " id='" + data.id + "'" : '';
                html += $u.hasContent(data.title) ? " title='" + data.title + "'" : '';
                html += type + " style='color:" + data.color + ";" + ($u.hasContent(data.bgcolor) ? "background-color:" + data.bgcolor + ";" : '') + ($u.hasContent(style) ? style  : "") + "'>" + data.text + "</td>";
                return html;
            } catch (err) {
                con.error("ERROR in makeTd: " + err);
                return undefined;
            }
        },

        updateDashboardWaitLog: true,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        updateDashboard: function (force) {
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
                town.dashboard();
                general.dashboard();
                gifting.queue.dashboard();
                gifting.history.dashboard();

                var headers                = [],
                    values                 = [],
                    pp                     = 0,
                    i                      = 0,
                    count                  = 0,
                    userIdLink             = '',
                    userIdLinkInstructions = '',
                    valueCol               = 'red',
                    len                    = 0,
                    data                   = {text: '', color: '', bgcolor: '', id: '', title: ''},
                    handler                = null,
                    head                   = '',
                    body                   = '',
                    row                    = '';

                /*-------------------------------------------------------------------------------------\
                Next we build the HTML to be included into the 'caap_infoTargets1' div. We set our
                table and then build the header row.
                \-------------------------------------------------------------------------------------*/
                if (config.getItem('DBDisplay', '') === 'Target List' && session.getItem("ReconDashUpdate", true)) {
                    head = "";
                    body = "";
                    headers = ['UserId', 'Name',    'Deity',   'BR#',     'WR#',        'Level',    'Army',    'Last Alive'];
                    values  = ['userId', 'nameStr', 'deityNum', 'rankNum', 'warRankNum', 'levelNum', 'armyNum', 'aliveTime'];
                    for (pp = 0; pp < headers.length; pp += 1) {
                        switch (headers[pp]) {
                        case 'UserId':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '16%'});
                            break;
                        case 'Name':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '30%'});
                            break;
                        case 'Deity':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '12%'});
                            break;
                        case 'BR#':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '7%'});
                            break;
                        case 'WR#':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '7%'});
                            break;
                        case 'Level':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '8%'});
                            break;
                        case 'Army':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '8%'});
                            break;
                        case 'Last Alive':
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: '12%'});
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
                                //userIdLink = caap.domain.link + "/keep.php?casuser=" + battle.reconRecords[i][values[pp]];
                                userIdLink = "keep.php?casuser=" + battle.reconRecords[i][values[pp]];
                                data = {
                                    text  : '<span id="caap_targetrecon_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                            '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + battle.reconRecords[i][values[pp]] + '</span>',
                                    color : 'blue',
                                    id    : '',
                                    title : ''
                                };

                                row += caap.makeTd(data);
                                break;
                            case 'deityNum':
                                row += caap.makeTd({text: caap.demiTable[battle.reconRecords[i][values[pp]]].ucFirst(), color: '', id: '', title: ''});
                                break;
                            case 'rankNum':
                                row += caap.makeTd({text: battle.reconRecords[i][values[pp]], color: '', id: '', title: battle.battleRankTable[battle.reconRecords[i][values[pp]]]});
                                break;
                            case 'warRankNum':
                                row += caap.makeTd({text: battle.reconRecords[i][values[pp]], color: '', id: '', title: battle.warRankTable[battle.reconRecords[i][values[pp]]]});
                                break;
                            case 'aliveTime':
                                data = {
                                    text  : $u.makeTime(battle.reconRecords[i][values[pp]], "d M H:i"),
                                    color : '',
                                    id    : '',
                                    title : ''
                                };

                                row += caap.makeTd(data);
                                break;
                            default:
                                row += caap.makeTd({text: battle.reconRecords[i][values[pp]], color: '', id: '', title: ''});
                            }
                        }

                        body += caap.makeTr(row);
                    }

                    $j("#caap_infoTargets1", caap.caapTopObject).html(
                        $j(caap.makeTable("recon", head, body)).dataTable({
                            "bAutoWidth"    : false,
                            "bFilter"       : false,
                            "bJQueryUI"     : false,
                            "bInfo"         : false,
                            "bLengthChange" : false,
                            "bPaginate"     : false,
                            "bProcessing"   : false,
                            "bStateSave"    : true,
                            "bSortClasses"  : false
                        })
                    );

                    handler = function (e) {
                        var visitUserIdLink = {
                                rlink     : '',
                                arlink    : ''
                            },
                            i   = 0,
                            len = 0;

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'rlink') {
                                visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                                //visitUserIdLink.arlink = visitUserIdLink.rlink.replace(caap.domain.link + "/", "");
                                visitUserIdLink.arlink = visitUserIdLink.rlink;
                            }
                        }

                        caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                    };

                    $j("span[id*='caap_targetrecon_']", caap.caapTopObject).unbind('click', handler).click(handler);
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
                        head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                    }

                    head = caap.makeTr(head);
                    row = caap.makeTd({text: 'Facebook ID', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['FBID'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Account Name', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['account'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Character Name', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['PlayerName'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Energy', color: '', id: '', title: 'Current/Max'});
                    row += caap.makeTd({text: caap.stats['energy']['num'] + '/' + caap.stats['energy']['max'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Level', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['level'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Stamina', color: '', id: '', title: 'Current/Max'});
                    row += caap.makeTd({text: caap.stats['stamina']['num'] + '/' + caap.stats['stamina']['max'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Battle Rank', color: '', id: '', title: ''});
                    row += caap.makeTd({text: battle.battleRankTable[caap.stats['rank']['battle']] + ' (' + caap.stats['rank']['battle'] + ')', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Attack', color: '', id: '', title: 'Current/Max'});
                    row += caap.makeTd({text: caap.stats['attack'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Battle Rank Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['rank']['battlePoints'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Defense', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['defense'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'War Rank', color: '', id: '', title: ''});
                    row += caap.makeTd({text: battle.warRankTable[caap.stats['rank']['war']] + ' (' + caap.stats['rank']['war'] + ')', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Health', color: '', id: '', title: 'Current/Max'});
                    row += caap.makeTd({text: caap.stats['health']['num'] + '/' + caap.stats['health']['max'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'War Rank Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['rank']['warPoints'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Army', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['army']['actual'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Generals', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['generals']['total'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Generals When Invade', color: '', id: '', title: 'For every 5 army members you have, one of your generals will also join the fight.'});
                    row += caap.makeTd({text: caap.stats['generals']['invade'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Gold In Bank', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['bank'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Total Income Per Hour', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['income'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Gold In Cash', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['cash'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Upkeep', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['upkeep'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Total Gold', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['total'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Cash Flow Per Hour', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '$' + caap.stats['gold']['flow'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Skill Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['points']['skill'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Energy Potions', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['potions']['energy'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Favor Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['points']['favor'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Stamina Potions', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['potions']['stamina'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Experience To Next Level (ETNL)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['exp']['dif'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Battle Strength Index (BSI)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['bsi'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Hours To Level (HTL)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: $u.minutes2hours(caap.stats['indicators']['htl']), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Levelling Speed Index (LSI)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['lsi'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Hours Remaining To Level (HRTL)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: $u.minutes2hours(caap.stats['indicators']['hrtl']), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Skill Points Per Level (SPPL)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['sppl'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Expected Next Level (ENL)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: $u.makeTime(caap.stats['indicators']['enl'], caap.timeStr()), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Attack Power Index (API)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['api'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Build Type', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['build'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Defense Power Index (DPI)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['dpi'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'PvP Class', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['pvpclass'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Mean Power Index (MPI)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['mpi'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Monster Hunting Build Effective Quotent (MHBEQ)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['indicators']['mhbeq'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Battles/Wars Won', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['bww'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Times eliminated', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['te'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Battles/Wars Lost', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['bwl'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Times you eliminated an enemy', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['tee'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Battles/Wars Win/Loss Ratio (WLR)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['wlr'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Enemy Eliminated/Eliminated Ratio (EER)', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['eer'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Invasions Won', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['won'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Duels Won', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['won'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Invasions Lost', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['lost'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Duels Lost', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['lost'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Invasions Streak', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['streak'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Duels Streak', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['streak'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Invasions Win/loss Ratio (IWLR)', color: '', id: '', title: ''});
                    if (caap.stats['achievements']['battle']['invasions']['ratio']) {
                        row += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['ratio'], color: valueCol, id: '', title: ''});
                    } else {
                        row += caap.makeTd({text: caap.stats['achievements']['battle']['invasions']['ratio'], color: valueCol, id: '', title: ''});
                    }

                    row += caap.makeTd({text: 'Duels Win/loss Ratio (DWLR)', color: '', id: '', title: ''});
                    if (caap.stats['achievements']['battle']['duels']['ratio']) {
                        row += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['ratio'], color: valueCol, id: '', title: ''});
                    } else {
                        row += caap.makeTd({text: caap.stats['achievements']['battle']['duels']['ratio'], color: valueCol, id: '', title: ''});
                    }

                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Quests Completed', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['other']['qc'].addCommas(), color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Alchemy Performed', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.stats['achievements']['other']['alchemy'].addCommas(), color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    count = 0;
                    for (pp in caap.stats['achievements']['monster']) {
                        if (caap.stats['achievements']['monster'].hasOwnProperty(pp)) {
                            row = count % 2 === 0 ? '' : row;
                            row += caap.makeTd({text: pp.escapeHTML(), color: '', id: '', title: ''});
                            row += caap.makeTd({text: caap.stats['achievements']['monster'][pp], color: valueCol, id: '', title: ''});
                            body += count % 2 === 1 ? caap.makeTr(row) : '';
                            count += 1;
                        }
                    }

                    if (count % 2 === 1) {
                        row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                        row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                        body += caap.makeTr(row);
                    }

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Ambrosia Daily Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['ambrosia']['daily']['num'] + '/' + caap.demi['ambrosia']['daily']['max'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Malekus Daily Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['malekus']['daily']['num'] + '/' + caap.demi['malekus']['daily']['max'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Ambrosia Total Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['ambrosia']['power']['total'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Malekus Total Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['malekus']['power']['total'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Corvintheus Daily Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['corvintheus']['daily']['num'] + '/' + caap.demi['corvintheus']['daily']['max'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Aurora Daily Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['aurora']['daily']['num'] + '/' + caap.demi['aurora']['daily']['max'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Corvintheus Total Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['corvintheus']['power']['total'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: 'Aurora Total Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['aurora']['power']['total'], color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Azeron Daily Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['azeron']['daily']['num'] + '/' + caap.demi['azeron']['daily']['max'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: 'Azeron Total Points', color: '', id: '', title: ''});
                    row += caap.makeTd({text: caap.demi['azeron']['power']['total'], color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    row = caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                    row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
                    body += caap.makeTr(row);

                    count = 0;
                    for (pp in caap.stats['character']) {
                        if (caap.stats['character'].hasOwnProperty(pp)) {
                            row = count % 2 === 0 ? '' : row;
                            row += caap.makeTd({text: pp, color: '', id: '', title: ''});
                            row += caap.makeTd({text: "Level " + caap.stats['character'][pp]['level'] + " (" + caap.stats['character'][pp]['percent'] + "%)", color: valueCol, id: '', title: ''});
                            body += count % 2 === 1 ? caap.makeTr(row) : '';
                            count += 1;
                        }
                    }

                    if (count % 2 === 1) {
                        row += caap.makeTd({text: '&nbsp;', color: '', id: '', title: ''});
                        row += caap.makeTd({text: '&nbsp;', color: valueCol, id: '', title: ''});
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
        },
        /*jslint sub: false */

        /*-------------------------------------------------------------------------------------\
        addDBListener creates the listener for our dashboard controls.
        \-------------------------------------------------------------------------------------*/
        dbDisplayListener: function (e) {
            var idName = e.target.id.stripCaap(),
                value  = e.target.options[e.target.selectedIndex].value,
                title  = e.target.options[e.target.selectedIndex].title;

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
            caap.setDisplay("caapTopObject", 'buttonGifting', false);
            caap.setDisplay("caapTopObject", 'buttonGiftQueue', false);
            caap.setDisplay("caapTopObject", 'buttonArmy', false);
            switch (value) {
            case "Target List" :
                caap.setDisplay("caapTopObject", 'infoTargets1', true);
                caap.setDisplay("caapTopObject", 'buttonTargets', true);
                break;
            case "Battle Stats" :
                caap.setDisplay("caapTopObject", 'infoBattle', true);
                caap.setDisplay("caapTopObject", 'buttonBattle', true);
                break;
            case "User Stats" :
                caap.setDisplay("caapTopObject", 'userStats', true);
                break;
            case "Generals Stats" :
                caap.setDisplay("caapTopObject", 'generalsStats', true);
                break;
            case "Soldiers Stats" :
                caap.setDisplay("caapTopObject", 'soldiersStats', true);
                break;
            case "Item Stats" :
                caap.setDisplay("caapTopObject", 'itemStats', true);
                break;
            case "Magic Stats" :
                caap.setDisplay("caapTopObject", 'magicStats', true);
                break;
            case "Gifting Stats" :
                caap.setDisplay("caapTopObject", 'giftStats', true);
                caap.setDisplay("caapTopObject", 'buttonGifting', true);
                break;
            case "Gift Queue" :
                caap.setDisplay("caapTopObject", 'giftQueue', true);
                caap.setDisplay("caapTopObject", 'buttonGiftQueue', true);
                break;
            case "Guild Monster" :
                caap.setDisplay("caapTopObject", 'guildMonster', true);
                caap.setDisplay("caapTopObject", 'buttonGuildMonster', true);
                break;
            case "Monster" :
                caap.setDisplay("caapTopObject", 'infoMonster', true);
                caap.setDisplay("caapTopObject", 'buttonMonster', true);
                break;
            /*case "Arena" :
                caap.setDisplay("caapTopObject", 'arena', true);
                break;*/
            case "Festival" :
                caap.setDisplay("caapTopObject", 'festival', true);
                break;
            case "Feed" :
                caap.setDisplay("caapTopObject", 'feed', true);
                break;
            case "Army" :
                caap.setDisplay("caapTopObject", 'army', true);
                caap.setDisplay("caapTopObject", 'buttonArmy', true);
                break;
            default :
            }

            caap.updateDashboard(true);
        },

        refreshMonstersListener: function (e) {
            monster.flagFullReview();
        },

        refreshGuildMonstersListener: function (e) {
            con.log(1, "refreshGuildMonstersListener");
            session.setItem('ReleaseControl', true);
            guild_monster.clear();
            caap.updateDashboard(true);
            schedule.setItem("guildMonsterReview", 0);
        },

        liveFeedButtonListener: function (e) {
            caap.clickAjaxLinkSend('army_news_feed.php');
        },

        crusadersButtonListener: function (e) {
            caap.clickAjaxLinkSend('specialmembership.php');
        },

        getBQH: function (cb) {
            try {
                function onError() {
                    $j().alert("Unable to get bqh");
                }

                function onSuccess(data, textStatus, XMLHttpRequest) {
                    var bqh = $j("input[name='bqh']", data).eq(0).val();
                    if ($u.hasContent(bqh)) {
                        cb(bqh);
                    } else {
                        $j().alert("Unable to get bqh");
                    }
                }

                caap.ajax('keep.php', null, onError, onSuccess);
                return true;
            } catch (err) {
                con.error("ERROR in getBQH: " + err);
                return false;
            }
        },

        /*jslint sub: true */
        fastHealButtonListener: function (e) {
            if (caap.stats['health']['dif'] && caap.stats['gold']['total'] > 0) {
                caap.getBQH(function (bqh) {
                    var params = {
                            "action" : "heal_avatar",
                            "bqh"    : bqh
                        };

                    caap.ajaxLoad('keep.php', params, "#" + caap.domain.id[caap.domain.which] + "health_current_value", "#" + caap.domain.id[caap.domain.which] + "health_current_value", session.getItem("page", ""));
                });
            }
        },
        /*jslint sub: false */

        clearTargetsButtonListener: function (e) {
            battle.reconRecords = [];
            battle.saveRecon();
            caap.updateDashboard(true);
        },

        clearBattleButtonListener: function (e) {
            battle.clear();
            caap.updateDashboard(true);
        },

        clearGiftingButtonListener: function (e) {
            gifting.clear("history");
            caap.updateDashboard(true);
        },

        clearGiftQueueButtonListener: function (e) {
            gifting.clear("queue");
            caap.updateDashboard(true);
        },

        getArmyButtonListener: function (e) {
            schedule.setItem("army_member", 0);
            army.deleteTemp();
        },

        addDBListener: function () {
            try {
                con.log(4, "Adding listeners for caap_top");
                if (!$u.hasContent($j('#caap_DBDisplay', caap.caapTopObject))) {
                    caap.reloadCastleAge();
                }

                $j('#caap_DBDisplay', caap.caapTopObject).bind('change', caap.dbDisplayListener);
                $j('#caap_refreshMonsters', caap.caapTopObject).bind('click', caap.refreshMonstersListener);
                $j('#caap_refreshGuildMonsters', caap.caapTopObject).bind('click', caap.refreshGuildMonstersListener);
                $j('#caap_liveFeed', caap.caapTopObject).bind('click', caap.liveFeedButtonListener);
                $j('#caap_crusaders', caap.caapTopObject).bind('click', caap.crusadersButtonListener);
                $j('#caap_fastHeal', caap.caapTopObject).bind('click', caap.fastHealButtonListener);
                $j('#caap_clearTargets', caap.caapTopObject).bind('click', caap.clearTargetsButtonListener);
                $j('#caap_clearBattle', caap.caapTopObject).bind('click', caap.clearBattleButtonListener);
                $j('#caap_clearGifting', caap.caapTopObject).bind('click', caap.clearGiftingButtonListener);
                $j('#caap_clearGiftQueue', caap.caapTopObject).bind('click', caap.clearGiftQueueButtonListener);
                $j('#caap_getArmy', caap.caapTopObject).bind('click', caap.getArmyButtonListener);
                $j('#caap_dashMin', caap.caapTopObject).bind('click', function () {
                    caap.caapTopObject.toggle('fold', {}, '', function () {
                        caap.caapTopMinObject.css('display', 'block');
                    });

                    config.setItem("dashMinimised", true);
                });

                $j('#caap_dashMax', caap.caapTopMinObject).bind('click', function () {
                    caap.caapTopObject.toggle('fold');
                    caap.caapTopMinObject.css('display', 'none');
                    config.setItem("dashMinimised", false);
                });

                con.log(4, "Listeners added for caap_top");
                return true;
            } catch (err) {
                con.error("ERROR in addDBListener: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          EVENT LISTENERS
        // Watch for changes and update the controls
        /////////////////////////////////////////////////////////////////////

        setDisplay: function (area, idName, display, quiet) {
            try {
                if (!$u.hasContent(idName) || (!$u.isString(idName) && !$u.isNumber(idName))) {
                    con.warn("idName", idName);
                    throw "Bad idName!";
                }

                var areaDiv = caap[area];
                if (!$u.hasContent(areaDiv)) {
                    areaDiv = $j(document.body);
                    con.warn("Unknown area. Using document.body", area);
                }

                areaDiv = $j('#caap_' + idName, areaDiv).css('display', display === true ? 'block' : 'none');
                if (!$u.hasContent(areaDiv) && !quiet) {
                    con.warn("Unable to find idName in area!", idName, area);
                }

                return true;
            } catch (err) {
                con.error("ERROR in setDisplay: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkBoxListener: function (e) {
            try {
                var idName        = e.target.id.stripCaap(),
                    DocumentTitle = '',
                    d             = '',
                    styleXY       = {};

                con.log(1, "Change: setting '" + idName + "' to ", e.target.checked);
                config.setItem(idName, e.target.checked);
                caap.setDisplay("caapDivObject", idName + '_hide', e.target.checked, true);
                caap.setDisplay("caapDivObject", idName + '_not_hide', !e.target.checked, true);
                switch (idName) {
                case "AutoStatAdv" :
                    con.log(9, "AutoStatAdv");
                    state.setItem("statsMatch", true);
                    break;
                case "backgroundCA" :
                    if (caap.domain.which === 0) {
                        if (e.target.checked) {
                            $j("body").css({
                                'background-image'    : "url('http://image4.castleagegame.com/graphics/guild_webpage_bg.jpg')",
                                'background-position' : 'center top',
                                'background-repeat'   : 'no-repeat',
                                'background-color'    : 'black',
                                'margin'              : '0px'
                            });

                            $j("#contentCol").css({
                                'background-color'    : 'black'
                            });

                            $j("#contentArea").css({
                                'background-image'    : "url('http://image4.castleagegame.com/graphics/ws_middle.jpg')",
                                'padding'             : '0px 10px'
                            });

                            $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                                'display'    : 'none'
                            });

                            $j("#contentCol").removeClass("clearfix");
                        } else {
                            $j("body").css({
                                'background-image'    : '',
                                'background-position' : '',
                                'background-repeat'   : '',
                                'background-color'    : '',
                                'margin'              : ''
                            });

                            $j("#contentCol").css({
                                'background-color'    : 'white'
                            });

                            $j("#contentArea").css({
                                'background-image'    : '',
                                'padding'             : ''
                            });

                            $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                                'display'    : 'block'
                            });

                            $j("#contentCol").addClass("clearfix");
                        }
                    }

                    if (caap.domain.which === 0 || caap.domain.which === 2) {
                        styleXY = caap.getControlXY(true);
                        caap.caapDivObject.css({
                            top  : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    if (caap.domain.which === 2 || caap.domain.which === 3) {
                        styleXY = caap.getDashboardXY(true);
                        caap.caapTopObject.css({
                            top  : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        caap.caapTopMinObject.css({
                            top  : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    break;
                case "filterGeneral" :
                    if (caap.domain.which === 0 || caap.domain.which === 2) {
                        general.UpdateDropDowns();
                    }

                    break;
                case "injectCATools" :
                    if (caap.domain.which === 0) {
                        if (e.target.checked) {
                            caap.injectCATools();
                        } else {
                            caap.reloadCastleAge(true);
                        }
                    }

                    break;
                case "HideAds" :
                    if (caap.domain.which === 0) {
                        con.log(9, "HideAds");
                        $j('#rightCol').css('display', e.target.checked ? 'none' : 'block');
                    }

                    break;
                case "HideAdsIframe" :
                    if (caap.domain.which === 3) {
                        con.log(9, "HideAdsIframe");
                        //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', e.target.checked ? 'none' : 'block');
                        //$j("div[style*='tool_top.jpg']").css('display', e.target.checked ? 'none' : 'block');
                        $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', e.target.checked ? 'none' : 'block');
                        caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
                        caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
                        styleXY = caap.getDashboardXY();
                        caap.caapTopObject.css({
                            top  : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        caap.caapTopMinObject.css({
                            top  : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    break;
                case "HideFBChat" :
                    if (caap.domain.which === 0) {
                        con.log(9, "HideFBChat");
                        $j("div[class='fbDockWrapper fbDockWrapperRight bb']", caap.pageletPresenceDiv).css('display', e.target.checked ? 'none' : 'block');
                    }

                    break;
                case "IgnoreBattleLoss" :
                    con.log(9, "IgnoreBattleLoss");
                    if (e.target.checked) {
                        con.log(1, "Ignore Battle Losses has been enabled.");
                    }

                    break;
                case "SetTitle" :
                case "SetTitleAction" :
                case "SetTitleName" :
                    if (caap.domain.which === 0 || caap.domain.which === 2) {
                        con.log(9, idName);
                        if (e.target.checked) {
                            if (config.getItem('SetTitleAction', false)) {
                                d = $j('#caap_activity_mess', caap.caapDivObject).html();
                                if (d) {
                                    DocumentTitle += d.replace("Activity: ", '') + " - ";
                                }
                            }

                            if (config.getItem('SetTitleName', false)) {
                                DocumentTitle += caap.stats['PlayerName'] + " - ";
                            }

                            document.title = DocumentTitle + caap.documentTitle;
                        } else {
                            document.title = caap.documentTitle;
                        }
                    }

                    break;
                case "unlockMenu" :
                    con.log(9, "unlockMenu");
                    if (e.target.checked) {
                        if (caap.domain.which === 0 || caap.domain.which === 2) {
                            $j(":input[id^='caap_']", caap.caapDivObject).attr({disabled: true});
                            caap.caapDivObject.css('cursor', 'move').draggable({
                                stop: function () {
                                    caap.saveControlXY();
                                }
                            });
                        }

                        if (caap.domain.which === 2 || caap.domain.which === 3) {
                            $j(":input[id^='caap_']", caap.caapTopObject).attr({disabled: true});
                            caap.caapTopObject.css('cursor', 'move').draggable({
                                stop: function () {
                                    caap.saveDashboardXY();
                                    styleXY = caap.getDashboardXY();
                                    caap.caapTopMinObject.css({
                                        top  : styleXY.y + 'px',
                                        left : styleXY.x + 'px'
                                    });
                                }
                            });
                        }

                    } else {
                        if (caap.domain.which === 0 || caap.domain.which === 2) {
                            caap.caapDivObject.css('cursor', '').draggable("destroy");
                            $j(":input[id^='caap_']", caap.caapDivObject).attr({disabled: false});
                        }

                        if (caap.domain.which === 2 || caap.domain.which === 3) {
                            caap.caapTopObject.css('cursor', '').draggable("destroy");
                            $j(":input[id^='caap_']", caap.caapTopObject).attr({disabled: false});
                        }
                    }

                    break;
                case "AutoElite" :
                    con.log(9, "AutoElite");
                    schedule.setItem('AutoEliteGetList', 0);
                    schedule.setItem('AutoEliteReqNext', 0);
                    state.setItem('AutoEliteEnd', '');
                    state.setItem("MyEliteTodo", []);
                    if (caap.domain.which === 2 && e.target.checked) {
                        $j("#caap_EnableArmy", caap.caapDivObject).attr("checked", config.setItem("EnableArmy", true));
                        caap.setDisplay("caapDivObject", "EnableArmy" + '_hide', true, true);
                    }

                    break;
                case "AchievementMode" :
                    con.log(9, "AchievementMode");
                    monster.flagReview();
                    break;
                case "StatSpendAll" :
                    con.log(9, "StatSpendAll");
                    state.setItem("statsMatch", true);
                    state.setItem("autoStatRuleLog", true);
                    break;
                case "enableTitles" :
                case "goblinHinting" :
                    if (e.target.checked) {
                        spreadsheet.clear();
                        spreadsheet.load();
                    }

                    break;
                case "ignoreClerics" :
                case "chooseIgnoredMinions" :
                    state.setItem('targetGuildMonster', {});
                    state.setItem('staminaGuildMonster', 0);
                    schedule.setItem("guildMonsterReview", 0);
                    break;
                case "festivalTower" :
                    monster.flagFullReview();
                    break;
                default :
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkBoxListener: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        colorDiv: {},

        colorUpdate: function () {
            try {
                var color = state.getItem('caapPause', 'none') === 'none' ? state.getItem('StyleBackgroundLight', 1) : state.getItem('StyleBackgroundDark', 1),
                    bgo   = state.getItem('caapPause', 'none') === 'none' ? state.getItem('StyleOpacityLight', 1) : state.getItem('StyleOpacityDark', 1),
                    btc   = $u.bestTextColor(color),
                    chk1,
                    chk2;

                if (caap.domain.which === 0 || caap.domain.which === 2) {
                    chk1 = caap.caapDivObject.css('background-color'),
                    chk2 = caap.caapDivObject.css('color');
                } else if (caap.domain.which === 3) {
                    chk1 = caap.caapTopObject.css('background-color'),
                    chk2 = caap.caapTopObject.css('color');
                }

                if ($u.hex2rgb(color).color !== chk1) {
                    con.log(4, "Update background color", color, chk1);
                    if (caap.domain.which === 0 || caap.domain.which === 2) {
                        caap.caapDivObject.css({
                            'background' : color,
                            'opacity'    : bgo,
                            'color'      : btc
                        });

                        caap.caapPlayButtonDiv.css({
                            'background' : color,
                            'opacity'    : bgo,
                            'color'      : btc
                        });
                    }

                    if (caap.domain.which === 2 || caap.domain.which === 3) {
                        caap.caapTopObject.css({
                            'background' : color,
                            'opacity'    : bgo,
                            'color'      : btc
                        });

                        caap.caapTopMinObject.css({
                            'background' : color,
                            'opacity'    : bgo,
                            'color'      : btc
                        });
                    }

                    if ($u.hex2rgb(btc).color !== chk2) {
                        con.log(4, "Update text color", btc, chk2);
                        if (caap.domain.which === 2 || caap.domain.which === 3) {
                            $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({'color': btc});
                        }
                    }
                }

                if (caap.domain.which === 0) {
                    caap.messaging.styleChange();
                }

                return true;
            } catch (err) {
                con.error("ERROR in colorUpdate: " + err);
                return false;
            }
        },

        colorBoxClickListener: function (e) {
            try {
                var id = e.target.id.stripCaap(),
                    t  = $j(e.target);

                function fb1call(color) {
                    state.setItem("StyleBackgroundLight", color);
                    caap.colorUpdate();
                }

                function fb2call(color) {
                    state.setItem("StyleBackgroundDark", color);
                    caap.colorUpdate();
                }

                function d1call(el_id, color) {
                    var s = el_id.stripCaap(),
                        v = $u.addSharp(color).toUpperCase(),
                        c = '';

                    if (color !== 'close') {
                        con.log(1, 'Change: setting "' + s + '" to ', v);
                        config.setItem(s, v);
                    } else {
                        c = config.getItem(s, v);
                        switch (s) {
                        case "CustStyleBackgroundLight" :
                            state.setItem("StyleBackgroundLight", c);
                            caap.colorUpdate();
                            break;
                        case "CustStyleBackgroundDark" :
                            state.setItem("StyleBackgroundDark", c);
                            caap.colorUpdate();
                            break;
                        default :
                        }

                        caap.colorDiv[e.target.id][3].val(c);
                        caap.colorDiv[e.target.id][3].css({
                            background : e.target.value,
                            color      : $u.bestTextColor(e.target.value)
                        });
                    }

                    delete caap.colorDiv[el_id];
                }

                if (!$u.hasContent(caap.colorDiv[e.target.id])) {
                    switch (id) {
                    case "CustStyleBackgroundLight" :
                        caap.colorDiv[e.target.id] = t.colorInput(fb1call, d1call).concat(t);
                        break;
                    case "CustStyleBackgroundDark" :
                        caap.colorDiv[e.target.id] = t.colorInput(fb2call, d1call).concat(t);
                        break;
                    default :
                        caap.colorDiv[e.target.id] = t.colorInput(function () {}, d1call).concat(t);
                    }

                    caap.colorDiv[e.target.id][1].css({
                        background : e.target.value,
                        color      : $u.bestTextColor(e.target.value),
                        padding    : "5px",
                        border     : "2px solid #000000"
                    });
                }

                return true;
            } catch (err) {
                con.error("ERROR in colorBoxClickListener: " + err);
                return false;
            }
        },

        colorBoxChangeListener: function (e) {
            try {
                e.target.value = $u.addSharp(e.target.value).toUpperCase();
                caap.colorBoxListener(e);
                return true;
            } catch (err) {
                con.error("ERROR in colorBoxChangeListener: " + err);
                return false;
            }
        },

        colorBoxListener: function (e) {
            try {
                var id  = e.target.id.stripCaap(),
                    val = $u.addSharp(e.target.value).toUpperCase(),
                    c   = new $u.ColorConv();

                e.target.style.backgroundColor = val;
                c.setRgb(e.target.style.backgroundColor);
                e.target.style.color = $u.bestTextColor(c.getHex());
                con.log(1, 'Change: setting "' + id + '" to ', val);
                config.setItem(id, val);
                if ($u.hasContent(caap.colorDiv[e.target.id])) {
                    caap.colorDiv[e.target.id][2].setColor(val);
                }

                switch (id) {
                case "CustStyleBackgroundLight" :
                    state.setItem("StyleBackgroundLight", val);
                    caap.colorUpdate();
                    break;
                case "CustStyleBackgroundDark" :
                    state.setItem("StyleBackgroundDark", val);
                    caap.colorUpdate();
                    break;
                default :
                }

                return true;
            } catch (err) {
                con.error("ERROR in colorBoxListener: " + err);
                return false;
            }
        },

        textBoxListener: function (e) {
            try {
                var idName = e.target.id.stripCaap();
                con.log(1, 'Change: setting "' + idName + '" to ', String(e.target.value));
                if (/AttrValue+/.test(idName)) {
                    state.setItem("statsMatch", true);
                }

                config.setItem(idName, String(e.target.value));
                return true;
            } catch (err) {
                con.error("ERROR in textBoxListener: " + err);
                return false;
            }
        },

        numberBoxListener: function (e) {
            try {
                var idName  = e.target.id.stripCaap(),
                    number  = null,
                    message = '';

                if ($u.isNaN(e.target.value) && e.target.value !== '') {
                    message = "<div style='text-align: center;'>";
                    message += "You entered:<br /><br />";
                    message += "'" + e.target.value + "'<br /><br />";
                    message += "Please enter a number or leave blank.";
                    message += "</div>";
                    $j().alert(message);
                    number = '';
                } else {
                    number = $u.isNaN(e.target.value) && e.target.value === '' ? '' : e.target.value.parseFloat();
                }

                con.log(1, 'Change: setting "' + idName + '" to ', number);
                if (/AttrValue+/.test(idName)) {
                    state.setItem("statsMatch", true);
                } else if (/MaxToFortify/.test(idName)) {
                    monster.flagFullReview();
                } else if (/Chain/.test(idName)) {
                    state.getItem('BattleChainId', 0);
                } else if (idName === 'DebugLevel') {
                    con.log_level = e.target.value.parseInt();
                } else if (idName === "IgnoreMinionsBelow") {
                    state.setItem('targetGuildMonster', {});
                    state.setItem('staminaGuildMonster', 0);
                    schedule.setItem("guildMonsterReview", 0);
                }

                e.target.value = config.setItem(idName, number);
                return true;
            } catch (err) {
                con.error("ERROR in numberBoxListener: " + err);
                return false;
            }
        },

        dropBoxListener: function (e) {
            try {
                if (e.target.selectedIndex > 0) {
                    var idName = e.target.id.stripCaap(),
                        value  = e.target.options[e.target.selectedIndex].value,
                        title  = e.target.options[e.target.selectedIndex].title;

                    con.log(1, 'Change: setting "' + idName + '" to "' + value + '" with title "' + title + '"');
                    config.setItem(idName, value);
                    e.target.title = title;
                    if (idName.hasIndexOf('When')) {
                        caap.setDisplay("caapDivObject", idName + '_hide', value !== 'Never');
                        if (!idName.hasIndexOf('Quest')) {
                            //if (!idName.hasIndexOf('Arena')) {
                            if (!idName.hasIndexOf('Festival')) {
                                caap.setDisplay("caapDivObject", idName + 'XStamina_hide', value === 'At X Stamina');
                            }

                            caap.setDisplay("caapDivObject", 'WhenBattleStayHidden_hide', ((config.getItem('WhenBattle', 'Never') === 'Stay Hidden' && config.getItem('WhenMonster', 'Never') !== 'Stay Hidden')));
                            caap.setDisplay("caapDivObject", 'WhenMonsterStayHidden_hide', ((config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden')));
                            caap.setDisplay("caapDivObject", 'DemiPointsFirst_hide', (config.getItem('WhenBattle', 'Never') === 'Demi Points Only'));
                            switch (idName) {
                            case 'WhenBattle':
                                if (value === 'Never') {
                                    caap.setDivContent('battle_mess', 'Battle off');
                                } else {
                                    caap.setDivContent('battle_mess', '');
                                }

                                break;
                            case 'WhenMonster':
                                if (value === 'Never') {
                                    caap.setDivContent('monster_mess', 'Monster off');
                                } else {
                                    caap.setDivContent('monster_mess', '');
                                }

                                break;
                            case 'WhenGuildMonster':
                                if (value === 'Never') {
                                    caap.setDivContent('guild_monster_mess', 'Guild Monster off');
                                } else {
                                    caap.setDivContent('guild_monster_mess', '');
                                }

                                break;
                            /*case 'WhenArena':
                                if (value === 'Never') {
                                    caap.setDivContent('arena_mess', 'Arena off');
                                } else {
                                    caap.setDivContent('arena_mess', '');
                                }

                                break;*/
                            case 'WhenFestival':
                                if (value === 'Never') {
                                    caap.setDivContent('festival_mess', 'Festival off');
                                } else {
                                    caap.setDivContent('festival_mess', '');
                                }

                                break;
                            default:
                            }
                        } else {
                            caap.setDisplay("caapDivObject", idName + 'XEnergy_hide', value === 'At X Energy');
                        }
                    } else if (idName === 'QuestArea' || idName === 'QuestSubArea' || idName === 'WhyQuest') {
                        state.setItem('AutoQuest', caap.newAutoQuest());
                        caap.clearAutoQuest();
                        if (idName === 'QuestArea') {
                            switch (value) {
                            case "Quest" :
                                caap.changeDropDownList('QuestSubArea', caap.landQuestList);
                                break;
                            case "Demi Quests" :
                                caap.changeDropDownList('QuestSubArea', caap.demiQuestList);
                                break;
                            case "Atlantis" :
                                caap.changeDropDownList('QuestSubArea', caap.atlantisQuestList);
                                break;
                            default :
                            }
                        }
                    } else if (idName === 'BattleType') {
                        state.getItem('BattleChainId', 0);
                    } else if (idName === 'AutoBless' && value === 'None') {
                        schedule.setItem('BlessingTimer', 0);
                    } else if (idName === 'festivalBless' && value === 'None') {
                        schedule.setItem('festivalBlessTimer', 0);
                    } else if (idName === 'TargetType') {
                        state.getItem('BattleChainId', 0);
                        //caap.setDisplay("caapDivObject", 'TargetTypeFreshmeat_hide', value === "Freshmeat");
                        caap.setDisplay("caapDivObject", 'TargetTypeUserId_hide', value === "Userid List");
                        caap.setDisplay("caapDivObject", 'TargetTypeRaid_hide', value === "Raid");
                    } else if (idName === 'LevelUpGeneral') {
                        caap.setDisplay("caapDivObject", idName + '_hide', value !== 'Use Current');
                    } else if (/Attribute?/.test(idName)) {
                        state.setItem("statsMatch", true);
                    /*} else if (idName === 'chainArena') {
                        caap.setDisplay("caapDivObject", idName + '_hide', value !== '0');*/
                    } else if (idName === 'chainFestival') {
                        caap.setDisplay("caapDivObject", idName + '_hide', value !== '0');
                    } else if (idName === 'DisplayStyle') {
                        caap.setDisplay("caapDivObject", idName + '_hide', value === 'Custom');
                        switch (value) {
                        case "Original" :
                            state.setItem("StyleBackgroundLight", "#EFEFFF");
                            state.setItem("StyleBackgroundDark", "#FEEFFF");
                            state.setItem("StyleOpacityLight", 1);
                            state.setItem("StyleOpacityDark", 1);
                            break;
                        case "None" :
                            state.setItem("StyleBackgroundLight", "#FFFFFF");
                            state.setItem("StyleBackgroundDark", "#FFFFFF");
                            state.setItem("StyleOpacityLight", 1);
                            state.setItem("StyleOpacityDark", 1);
                            break;
                        case "Custom" :
                            state.setItem("StyleBackgroundLight", config.getItem("CustStyleBackgroundLight", "#E0C691"));
                            state.setItem("StyleBackgroundDark", config.getItem("CustStyleBackgroundDark", "#B09060"));
                            state.setItem("StyleOpacityLight", config.getItem("CustStyleOpacityLight", 1));
                            state.setItem("StyleOpacityDark", config.getItem("CustStyleOpacityDark", 1));
                            break;
                        default :
                            state.setItem("StyleBackgroundLight", "#E0C691");
                            state.setItem("StyleBackgroundDark", "#B09060");
                            state.setItem("StyleOpacityLight", 1);
                            state.setItem("StyleOpacityDark", 1);
                        }

                        caap.colorUpdate();
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in dropBoxListener: " + err);
                return false;
            }
        },

        textAreaListener: function (e) {
            try {
                var idName = e.target.id.stripCaap(),
                    value  = e.target.value;

                function commas() {
                    // Change the boolean from false to true to enable BoJangles patch or
                    // set the hidden variable in localStorage
                    if (config.getItem("TextAreaCommas", false)) {
                        // This first removes leading and trailing white space and/or commas before
                        // both removing and inserting commas where appropriate.
                        // Handles adding a single user id as well as replacing the entire list.
                        e.target.value = value.replace(/(^[,\s]+)|([,\s]+$)/g, "").replace(/[,\s]+/g, ",");
                    }
                }

                con.log(1, 'Change: setting "' + idName + '" to ', e.target.value);
                config.setItem(idName, e.target.value);
                switch (idName) {
                case "orderGuildMinion":
                case "orderGuildMonster":
                    state.setItem('targetGuildMonster', {});
                    state.setItem('staminaGuildMonster', 0);
                    schedule.setItem("guildMonsterReview", 0);
                    break;
                case "orderbattle_monster":
                case "orderraid":
                    monster.flagFullReview();
                    break;
                case "BattleTargets":
                    state.setItem('BattleChainId', 0);
                    commas();
                    break;
                case "EliteArmyList":
                    commas();
                    break;
                default:
                }

                return true;
            } catch (err) {
                con.error("ERROR in textAreaListener: " + err);
                return false;
            }
        },

        pauseListener: function (e) {
            caap.messaging.pauseListener();
            var bgc = state.getItem('StyleBackgroundDark', '#B09060'),
                bgo = state.getItem('StyleOpacityDark', 1),
                btc = $u.bestTextColor(bgc),
                chk = $u.bestTextColor(state.getItem('StyleBackgroundLight', '#E0C691'));

            if (caap.domain.which !== 3) {
                caap.caapDivObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo,
                    'z-index'    : '3'
                });
            }

            if (caap.domain.which !== 0) {
                caap.caapTopObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo
                });

                caap.caapTopMinObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo
                });

                if (btc !== chk) {
                    $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({'color': btc});
                }
            }

            if (caap.domain.which !== 3) {
                $j('#caapPaused', caap.caapDivObject).css('display', 'block');
                caap.caapPlayButtonDiv.css('display', 'block');
            }

            state.setItem('caapPause', 'block');
            session.setItem('ReleaseControl', true);
        },

        restartListener: function (e) {
            caap.messaging.restartListener();
            var bgc = state.getItem('StyleBackgroundLight', '#E0C691'),
                bgo = state.getItem('StyleOpacityLight', 1),
                btc = $u.bestTextColor(bgc),
                chk = $u.bestTextColor(state.getItem('StyleBackgroundDark', '#B09060'));

            if (caap.domain.which !== 3) {
                $j('#caapPaused', caap.caapDivObject).css('display', 'none');
                caap.caapPlayButtonDiv.css('display', 'none');
                caap.caapDivObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo,
                    'z-index'    : state.getItem('caap_div_zIndex', '2'),
                    'cursor'     : ''
                });
            }

            if (caap.domain.which !== 0) {
                caap.caapTopObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo,
                    'z-index'    : state.getItem('caap_top_zIndex', '1'),
                    'cursor'     : ''
                });

                caap.caapTopMinObject.css({
                    'background' : bgc,
                    'color'      : btc,
                    'opacity'    : bgo,
                    'z-index'    : state.getItem('caap_top_zIndex', '1'),
                    'cursor'     : ''
                });

                if (btc !== chk) {
                    $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({'color': btc});
                }
            }

            if (caap.domain.which !== 3) {
                $j('#unlockMenu', caap.caapDivObject).attr('checked', false);
            }

            state.setItem('caapPause', 'none');
            session.setItem('ReleaseControl', true);
            session.setItem('resetselectMonster', true);
            session.setItem('resetselectGuildMonster', true);
            caap.clearDomWaiting();
        },

        resetMenuLocationListener: function (e) {
            var caap_divXY = {},
                caap_topXY = {};

            state.deleteItem('caap_div_menuLeft');
            state.deleteItem('caap_div_menuTop');
            state.deleteItem('caap_div_zIndex');
            if (caap.domain.which !== 3) {
                caap.controlXY.x = '';
                caap.controlXY.y = $j(caap.controlXY.selector).offset().top;
                caap_divXY = caap.getControlXY(true);
                caap.caapDivObject.css({
                    'cursor'  : '',
                    'z-index' : '2',
                    'top'     : caap_divXY.y + 'px',
                    'left'    : caap_divXY.x + 'px'
                });

                $j(":input[id^='caap_']", caap.caapDivObject).attr({disabled: false});
            }

            state.deleteItem('caap_top_menuLeft');
            state.deleteItem('caap_top_menuTop');
            state.deleteItem('caap_top_zIndex');
            if (caap.domain.which !== 0) {
                caap.dashboardXY.x = '';
                caap.dashboardXY.y = $j(caap.dashboardXY.selector).offset().top - 10;
                caap_topXY = caap.getDashboardXY(true);
                caap.caapTopObject.css({
                    'cursor' : '',
                    'z-index' : '1',
                    'top' : caap_topXY.y + 'px',
                    'left' : caap_topXY.x + 'px'
                });

                caap.caapTopMinObject.css({
                    'cursor' : '',
                    'z-index' : '1',
                    'top' : caap_topXY.y + 'px',
                    'left' : caap_topXY.x + 'px'
                });

                $j(":input[id^='caap_']", caap.caapTopObject).attr({disabled: false});
            }
        },

        foldingBlockListener: function (e) {
            try {
                var subId  = e.target.id.replace(/_Switch/i, ''),
                    subDiv = document.getElementById(subId);

                if (subDiv.style.display === "block") {
                    con.log(2, 'Folding: ', subId);
                    subDiv.style.display = "none";
                    e.target.innerHTML = e.target.innerHTML.replace(/-/, '+');
                    state.setItem('Control_' + subId.stripCaap(), "none");
                } else {
                    con.log(2, 'Unfolding: ', subId);
                    subDiv.style.display = "block";
                    e.target.innerHTML = e.target.innerHTML.replace(/\+/, '-');
                    state.setItem('Control_' + subId.stripCaap(), "block");
                }

                return true;
            } catch (err) {
                con.error("ERROR in foldingBlockListener: " + err);
                return false;
            }
        },

        whatClickedURLListener: function (event) {
            try {
                var obj = event.target;
                while (obj && !obj.href) {
                    obj = obj.parentNode;
                }

                if (obj && obj.href) {
                    caap.setDomWaiting(obj.href);
                } else {
                    if (obj && !obj.href) {
                        con.warn('whatClickedURLListener globalContainer no href', obj);
                    }
                }
            } catch (err) {
                con.error("ERROR in whatClickedURLListener: " + err, event);
            }
        },

        whatFriendBox: function (event) {
            try {
                var obj    = event.target,
                    userID = 0;

                while (obj && !obj.id) {
                    obj = obj.parentNode;
                }

                if (obj && obj.id && obj.onclick) {
                    userID = obj.onclick.toString().regex(/friendKeepBrowse\('(\d+)'/);
                    caap.setDomWaiting("keep.php" + ($u.isNumber(userID) && userID > 0 ? "?casuser=" + userID : ''));
                }
            } catch (err) {
                con.error("ERROR in whatFriendBox: " + err, event);
            }
        },

        guildMonsterEngageListener: function (event) {
            con.log(4, "engage guild_battle_monster.php");
            caap.setDomWaiting("guild_battle_monster.php");
        },

        windowResizeListener: function (e) {
            var caap_topXY;
            if (caap.domain.which === 0 || caap.domain.which === 2) {
                caap.caapDivObject.css('left', caap.getControlXY().x + 'px');
            }

            if (caap.domain.which === 2 || caap.domain.which === 3) {
                caap_topXY = caap.getDashboardXY();
                caap.caapTopObject.css('left', caap_topXY.x + 'px');
                caap.caapTopMinObject.css('left', caap_topXY.x + 'px');
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        goldTimeListener: function (e) {
            var tArr = $u.setContent($u.setContent($j(e.target).text(), '').regex(/(\d+):(\d+)/), []);
            if (!$u.hasContent(tArr) || tArr.length !== 2) {
                return;
            }

            caap.stats['gold']['ticker'] = tArr;
            if (tArr[1] === 0 || con.log_level >= 4) {
                con.log(3, "goldTimeListener", tArr[0] + ":" + tArr[1].lpad("0", 2));
            }
        },

        energyListener: function (e) {
            var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
            if (num < 0 || $u.isNaN(num)) {
                return;
            }

            caap.stats['energy'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energy']['max']), caap.stats['energy']);
            caap.stats['energyT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energyT']['max']), caap.stats['energy']);
            con.log(3, "energyListener", num);
        },

        healthListener: function (e) {
            var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
            if (num < 0 || $u.isNaN(num)) {
                return;
            }

            caap.stats['health'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['health']['max']), caap.stats['health']);
            caap.stats['healthT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['healthT']['max']), caap.stats['healthT']);
            con.log(3, "healthListener", num);
        },

        staminaListener: function (e) {
            var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
            if (num < 0 || $u.isNaN(num)) {
                return;
            }

            caap.stats['stamina'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['stamina']['max']), caap.stats['stamina']);
            caap.stats['staminaT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['staminaT']['max']), caap.stats['staminaT']);
            con.log(3, "staminaListener", num);
        },
        /*jslint sub: false */

        caTools: false,

        reBind: function () {
            try {
                $j('a', caap.globalContainer).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                $j("div[id*='friend_box_']", caap.globalContainer).unbind('click', caap.whatFriendBox).bind('click', caap.whatFriendBox);
                if ($u.mutationTypes['DOMSubtreeModified']) {
                    con.log(3, "reBind sts");
                    $j("span[id*='gold_time_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).unbind('DOMSubtreeModified', caap.goldTimeListener).bind('DOMSubtreeModified', caap.goldTimeListener);
                    $j("span[id*='energy_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).unbind('DOMSubtreeModified', caap.energyListener).bind('DOMSubtreeModified', caap.energyListener);
                    $j("span[id*='stamina_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).unbind('DOMSubtreeModified', caap.staminaListener).bind('DOMSubtreeModified', caap.staminaListener);
                    $j("span[id*='health_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).unbind('DOMSubtreeModified', caap.healthListener).bind('DOMSubtreeModified', caap.healthListener);
                }

                return true;
            } catch (err) {
                con.error("ERROR in whatFriendBox: " + err, event);
                return false;
            }
        },

        reBindCaapDiv: function () {
            try {
                if (!$u.hasContent(caap.caapDivObject)) {
                    throw "Unable to find div for caap_div";
                }

                $j('input:checkbox[id^="caap_"]', caap.caapDivObject).change(caap.checkBoxListener);
                $j('input[data-subtype="text"]', caap.caapDivObject).change(caap.textBoxListener);
                $j('input[data-subtype="color"]', caap.caapDivObject).keyup(caap.colorBoxListener).change(caap.colorBoxChangeListener).click(caap.colorBoxClickListener);
                $j('input[data-subtype="number"]', caap.caapDivObject).change(caap.numberBoxListener);
                $j('#caap_TownBestReport', caap.caapDivObject).click(town.runReport);
                $j('#unlockMenu', caap.caapDivObject).change(caap.checkBoxListener);
                $j('select[id^="caap_"]', caap.caapDivObject).change(caap.dropBoxListener);
                $j('textarea[id^="caap_"]', caap.caapDivObject).change(caap.textAreaListener);
                $j('a[id^="caap_Switch"]', caap.caapDivObject).click(caap.foldingBlockListener);
                $j('#caap_ImportData', caap.caapDivObject).click(function () {
                    caap.importDialog($u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config'));
                });

                $j('#caap_ExportData', caap.caapDivObject).click(function () {
                    var val = $u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config');
                    caap.exportDialog(caap.exportTable[val]['export'](), val);
                });

                $j('#caap_DeleteData', caap.caapDivObject).click(function () {
                    caap.deleteDialog($u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config'));
                });

                $j('#caap_BackupConfig', caap.caapDivObject).click(function () {
                    profiles.getBackupKeys(caap.profilesDialog);
                });

                $j('#caap_BackupCurrent', caap.caapDivObject).click(function () {
                    profiles.backupCurrent();
                });

                $j('#caap_RestoreCurrent', caap.caapDivObject).click(function () {
                    profiles.restoreCurrent();
                });

                $j('#caap_TownItemReport', caap.caapDivObject).click(town.report);
                $j('#caap_ActionList', caap.caapDivObject).click(caap.actionDialog);
                $j('#caap_FillArmy', caap.caapDivObject).click(function (e) {
                    state.setItem("FillArmy", true);
                    state.setItem("ArmyCount", 0);
                    state.setItem('FillArmyList', []);
                    caap.getArmyButtonListener();
                });

                $j('#caap_ResetMenuLocation', caap.caapDivObject).click(caap.resetMenuLocationListener);
                $j('#caap_resetElite', caap.caapDivObject).click(function (e) {
                    schedule.setItem('AutoEliteGetList', 0);
                    schedule.setItem('AutoEliteReqNext', 0);
                    state.setItem('AutoEliteEnd', '');
                });

                $j('#caapRestart', caap.caapDivObject).click(caap.restartListener);
                $j('#caap_playbutton', caap.caapPlayButtonDiv).bind('click', caap.restartListener);
                $j('#caap_control', caap.caapDivObject).mousedown(caap.pauseListener);
                $j('#caap_stopAutoQuest', caap.caapDivObject).click(function (e) {
                    con.log(1, 'Change: setting stopAutoQuest and go to Manual');
                    caap.manualAutoQuest();
                });

                return true;
            } catch (err) {
                con.error("ERROR in reBindCaapDiv: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        addListeners: function () {
            try {
                if (caap.domain.which !== 3) {
                    if (!caap.reBindCaapDiv()) {
                        throw "Unable to find div for caap_div";
                    }

                    caap.jWindow.bind('resize', caap.windowResizeListener);
                }

                if (caap.domain.which === 0) {
                    caap.pageletPresenceDiv.live('DOMNodeInserted', function (event) {
                        if (config.getItem('AutoGift', false) && config.getItem('watchBeeper', true) && $u.setContent($j(event.target).text(), '').hasIndexOf("sent you a request in Castle Age")) {
                            con.log(1, "Beeper saw a gift!");
                            schedule.setItem("ajaxGiftCheck", 0);
                            caap.messaging.ajaxGiftCheck();
                        }
                    });

                    $j("#contentCol").bind('DOMNodeInserted', function (event) {
                        if (event.target.id !== 'CA-Tools') {
                            return;
                        }

                        con.log(1, "CA-Tools detected! Changing layout.");
                        caap.caTools = true;
                        caap.caToolsDiv = $j('#CA-Tools');
                        window.setTimeout(function () {
                            var styleXY = caap.getControlXY(true, true);
                            caap.caapDivObject.css({
                                top  : styleXY.y + 'px',
                                left : styleXY.x + 'px'
                            });

                            styleXY = caap.getDashboardXY(true);
                            caap.caapTopObject.css({
                                top  : styleXY.y + 'px',
                                left : styleXY.x + 'px'
                            });

                            caap.caapTopMinObject.css({
                                top  : styleXY.y + 'px',
                                left : styleXY.x + 'px'
                            });

                            $j('a', caap.caToolsDiv).bind('click', caap.whatClickedURLListener);
                            caap.reBind();
                            caap.caToolsDiv.bind('DOMNodeInserted', function (evt) {
                                if (evt.target.id.hasIndexOf("alt_sts")) {
                                    $j('a', caap.caToolsDiv).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                                    caap.reBind();
                                } else if (evt.target.id.hasIndexOf("st_2_5")) {
                                    $j('#' + evt.target.id + ' a', caap.caToolsDiv).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                                }
                            });

                            $j("img[src*='facebook-icon.png']", caap.caToolsDiv).bind('click', function () {
                                con.log(1, "CA-Tools quit! Changing layout.");
                                caap.caTools = false;
                                caap.caToolsDiv = null;

                                window.setTimeout(function () {
                                    var styleXY = caap.getControlXY(true, true);
                                    caap.caapDivObject.css({
                                        top  : styleXY.y + 'px',
                                        left : styleXY.x + 'px'
                                    });

                                    styleXY = caap.getDashboardXY(true);
                                    caap.caapTopObject.css({
                                        top  : styleXY.y + 'px',
                                        left : styleXY.x + 'px'
                                    });

                                    caap.caapTopMinObject.css({
                                        top  : styleXY.y + 'px',
                                        left : styleXY.x + 'px'
                                    });

                                    caap.reBind();
                                }, 2000);
                            });
                        }, 2000);
                    });
                }

                if (caap.domain.which !== 0) {
                    caap.globalContainer = $j('#' + caap.domain.id[caap.domain.which] + 'globalContainer');
                    if (!$u.hasContent(caap.globalContainer)) {
                        throw 'Global Container not found';
                    }

                    // Fires once when page loads
                    $j('a', caap.globalContainer).bind('click', caap.whatClickedURLListener);
                    $j("div[id*='friend_box_']", caap.globalContainer).bind('click', caap.whatFriendBox);
                    if ($u.mutationTypes['DOMSubtreeModified']) {
                        con.log(3, "Bind sts onload");
                        $j("span[id*='gold_time_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.goldTimeListener);
                        $j("span[id*='energy_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.energyListener);
                        $j("span[id*='stamina_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.staminaListener);
                        $j("span[id*='health_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.healthListener);
                    }

                    //arena.addListeners();
                    festival.addListeners();

                    caap.globalContainer.bind('DOMNodeInserted', function (event) {
                        var tId        = $u.hasContent(event.target.id) ? event.target.id.replace('app46755028429_', '') : event.target.id,
                            /*
                            targetList = [
                                "app_body",
                                "index",
                                "keep",
                                "generals",
                                "battle_monster",
                                "player_monster_list",
                                "public_monster_list",
                                "monster_summon_list",
                                "battle",
                                "battlerank",
                                "battle_train",
                                "quests",
                                "symbolquests",
                                "monster_quests",
                                "raid",
                                "party",
                                "symbolquests",
                                "alchemy",
                                "goblin_emp",
                                "soldiers",
                                "item",
                                "land",
                                "magic",
                                "oracle",
                                "symbols",
                                "treasure_chest",
                                "gift",
                                "war_rank",
                                "war_council",
                                "mercenary",
                                "view_class_progress",
                                "achievements",
                                "apprentice",
                                "news",
                                "friend_page",
                                "party",
                                "comments",
                                "army",
                                "army_member",
                                "army_news_feed",
                                "army_reqs",
                                "guild",
                                "guild_panel",
                                "guild_shop",
                                "guild_class",
                                "guild_formation",
                                "guild_monster_summon",
                                "guild_current_battles",
                                "guild_current_monster_battles",
                                "guild_battle_monster",
                                "guild_monster_summon_list",
                                "arena",
                                "arena_battle",
                                "specialmembership",
                                "festival_home",
                                "festival_feat_nav",
                                "festival_challenge",
                                "festival_achievements",
                                "festival_battle_home",
                                "festival_guild_battle",
                                "festival_battle_rank",
                                "festival_battle_selector",
                                "festival_tower",
                                "festival_tavern",
                                "festival_quests",
                                "festival_qengage",
                                "festival_games",
                                "festival_battle_monster",
                                "festival_duel_home",
                                "festival_duel_battle"
                            ],
                            */
                            page = $j(".game", caap.globalContainer).eq(0).attr("id"),
                            caap_topXY;

                        // Uncomment this to see the id of domNodes that are inserted
                        /*
                        if (event.target.id && !event.target.id.match(/globalContainer/) && !event.target.id.match(/time/i) && !event.target.id.match(/ticker/i) && !event.target.id.match(/caap/i)) {
                            caap.setDivContent('debug2_mess', tId);
                            alert(event.target.id);
                        }
                        */

                        //if (targetList.hasIndexOf(tId)) {
                        if (tId === page) {
                            session.setItem('page', page);
                            con.log(4, "DOM load target matched", tId);
                            caap.clearDomWaiting();
                            caap.incrementPageLoadCounter();
                            caap.reBind();
                            if (caap.domain.which === 3) {
                                if (config.getItem('HideAdsIframe', false)) {
                                    //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                                    //$j("div[style*='tool_top.jpg']").css('display', 'none');
                                    $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', 'none');
                                }

                                if (config.getItem('scrollToTop', false)) {
                                    caap.messaging.scrollToTop();
                                }
                            }

                            session.setItem("delayMain", true);
                            window.setTimeout(function () {
                                caap.checkResults();
                                session.setItem("delayMain", false);
                            }, 800);
                        }

                        // Reposition the dashboard
                        if (event.target.id === caap.dashboardXY.selector.replace("#", '')) {
                            caap_topXY = caap.getDashboardXY();
                            caap.caapTopObject.css('left', caap_topXY.x + 'px');
                            caap.caapTopMinObject.css('left', caap_topXY.x + 'px');
                        }
                    });
                }

                return true;
            } catch (err) {
                con.error("ERROR in addListeners: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          CHECK RESULTS
        // Called each iteration of main loop, this does passive checks for
        // results to update other functions.
        /////////////////////////////////////////////////////////////////////

        pageList: {
            'castle_age': {
                signaturePic: 'choose_demi.jpg',
                CheckResultsFunction: 'checkResults_index'
            },
            'castle': {
                signaturePic: 'choose_demi.jpg',
                CheckResultsFunction: 'checkResults_index'
            },
            'castle_ws': {
                signaturePic: 'choose_demi.jpg',
                CheckResultsFunction: 'checkResults_index'
            },
            'index': {
                signaturePic: 'choose_demi.jpg',
                CheckResultsFunction: 'checkResults_index'
            },
            'battle_monster': {
                signaturePic: 'tab_monster_list_on.gif',
                CheckResultsFunction: 'checkResults_fightList',
                subpages: ['onMonster']
            },
            'player_monster_list': {
                signaturePic: 'monster_button_yourmonster_on.jpg',
                CheckResultsFunction: 'checkResults_fightList',
                subpages: ['onMonster']
            },
            'public_monster_list': {
                signaturePic: 'monster_button_pubmonster_on.jpg',
                CheckResultsFunction: 'checkResults_public_monster_list'
            },
            'onMonster': {
                signaturePic: 'tab_monster_active.gif',
                CheckResultsFunction: 'checkResults_viewFight'
            },
            'raid': {
                signaturePic: 'tab_raid_on.gif',
                CheckResultsFunction: 'checkResults_fightList',
                subpages: ['onRaid']
            },
            'onRaid': {
                signaturePic: 'raid_map',
                CheckResultsFunction : 'checkResults_viewFight'
            },
            'land': {
                signaturePic: 'tab_land_on.gif',
                CheckResultsFunction: 'checkResults_land'
            },
            'generals': {
                signaturePic: 'tab_generals_on.gif',
                CheckResultsFunction: 'checkResults_generals'
            },
            'quests': {
                signaturePic: 'tab_quest_on.gif',
                CheckResultsFunction: 'checkResults_quests',
                subpages: ['earlyQuest']
            },
            'earlyQuest': {
                signaturePic: 'quest_back_1.jpg',
                CheckResultsFunction: 'checkResults_quests'
            },
            'symbolquests': {
                signaturePic: 'demi_quest_on.gif',
                CheckResultsFunction: 'checkResults_quests'
            },
            'monster_quests': {
                signaturePic: 'tab_atlantis_on.gif',
                CheckResultsFunction: 'checkResults_quests'
            },
            'gift_accept': {
                signaturePic: 'gif',
                CheckResultsFunction: 'checkResults_gift_accept'
            },
            'army': {
                signaturePic: 'invite_on.gif',
                CheckResultsFunction: 'checkResults_army'
            },
            'keep': {
                signaturePic: 'tab_stats_on.gif',
                CheckResultsFunction: 'checkResults_keep'
            },
            'oracle': {
                signaturePic: 'oracle_on.gif',
                CheckResultsFunction: 'checkResults_oracle'
            },
            'alchemy': {
                signaturePic: 'tab_alchemy_on.gif',
                CheckResultsFunction: 'checkResults_alchemy'
            },
            'battlerank': {
                signaturePic: 'tab_battle_rank_on.gif',
                CheckResultsFunction: 'checkResults_battlerank'
            },
            'war_rank': {
                signaturePic: 'tab_war_on.gif',
                CheckResultsFunction: 'checkResults_war_rank'
            },
            'achievements': {
                signaturePic: 'tab_achievements_on.gif',
                CheckResultsFunction: 'checkResults_achievements'
            },
            'battle': {
                signaturePic: 'battle_on.gif',
                CheckResultsFunction: 'checkResults_battle'
            },
            'soldiers': {
                signaturePic: 'tab_soldiers_on.gif',
                CheckResultsFunction: 'checkResults_soldiers'
            },
            'item': {
                signaturePic: 'tab_black_smith_on.gif',
                CheckResultsFunction: 'checkResults_item'
            },
            'magic': {
                signaturePic: 'tab_magic_on.gif',
                CheckResultsFunction: 'checkResults_magic'
            },
            'gift': {
                signaturePic: 'tab_gifts_on.gif',
                CheckResultsFunction: 'checkResults_gift'
            },
            'goblin_emp': {
                signaturePic: 'emporium_cancel.gif',
                CheckResultsFunction: 'checkResults_goblin_emp'
            },
            'view_class_progress': {
                signatureId: 'choose_class_screen',
                //signaturePic: 'tab_monster_class_on.gif',
                CheckResultsFunction: 'checkResults_view_class_progress'
            },
            'guild': {
                signaturePic: 'tab_guild_main_on.gif',
                CheckResultsFunction: 'checkResults_guild'
            },
            'guild_current_battles': {
                signaturePic: 'tab_guild_current_battles_on.gif',
                CheckResultsFunction: 'checkResults_guild_current_battles'
            },
            'guild_current_monster_battles': {
                signaturePic: 'guild_monster_tab_on.jpg',
                CheckResultsFunction: 'checkResults_guild_current_monster_battles'
            },
            'guild_monster_summon_list': {
                signaturePic: 'guild_summon_monster_button_on.jpg',
                CheckResultsFunction: 'checkResults_guild_monster_summon_list'
            },
            'guild_battle_monster': {
                signatureId: 'guild_battle_banner_section',
                CheckResultsFunction: 'checkResults_guild_battle_monster'
            },
            /*'arena': {
                signaturePic: 'tab_arena_on.gif',
                CheckResultsFunction: 'checkResults_arena'
            },
            'arena_battle': {
                signatureId: 'arena_battle_banner_section',
                CheckResultsFunction: 'checkResults_arena_battle'
            },*/
            'army_member': {
                signaturePic: 'view_army_on.gif',
                CheckResultsFunction: 'checkResults_army_member'
            },
            'festival_challenge': {
                signaturePic: 'festival_rankbarslider.gif',
                CheckResultsFunction: 'festivalBlessResults'
            },
            'festival_tower': {
                signaturePic: 'festival_monster_towerlist_button.jpg',
                CheckResultsFunction: 'checkResults_fightList'
            },
            'festival_battle_monster': {
                signaturePic: 'festival_achievement_monster_',
                CheckResultsFunction: 'checkResults_viewFight'
            },
            'festival_battle_home': {
                signaturePic: 'festival_button_rewards.gif',
                CheckResultsFunction: 'checkResults_festival_battle_home'
            },
            'festival_guild_battle': {
                signatureId: 'arena_battle_banner_section',
                CheckResultsFunction: 'checkResults_festival_guild_battle'
            },
            'army_news_feed': {
                signatureId: 'army_feed_body',
                CheckResultsFunction: 'checkResults_army_news_feed'
            },
            'party': {
                signaturePic: 'tab_elite_guard_on.gif',
                CheckResultsFunction: 'checkResults_party'
            },
            'festival_duel_home': {
                signaturePic: 'festival_duelchamp_enter.gif',
                CheckResultsFunction: 'checkResults_festival_duel_home'
            },
            'guild_panel': {
                signaturePic: 'tab_guild_management_on.gif',
                CheckResultsFunction: 'checkResults_guild_panel'
            },
            'guild_shop': {
                signaturePic: 'generic_hero_deianira.gif',
                CheckResultsFunction: 'checkResults_guild_shop'
            },
            'guild_class': {
                signatureId: 'class_help',
                CheckResultsFunction: 'checkResults_guild_class'
            },
            'guild_formation': {
                signatureId: 'gout_2_',
                CheckResultsFunction: 'checkResults_guild_formation'
            }
        },

        addExpDisplay: function () {
            try {
                if (!caap.caTools && config.getItem("displayETNL", true)) {
                    var catSTS = caap.caTools ? $j("#alt_sts", caap.caToolsDiv) : null,
                        catOK  = caap.caTools && catSTS && catSTS.css("display") !== 'none',
                        etnlDiv = $j("#caap_etnl", catOK ? catSTS : caap.globalContainer);

                    etnlDiv = $u.hasContent(etnlDiv) ? etnlDiv.html(caap.stats['exp']['dif']) : $j("#" + caap.domain.id[caap.domain.which] + "st_2_5 strong", catOK ? catSTS : caap.globalContainer).prepend("(<span id='caap_etnl' style='color:red'>" + caap.stats['exp']['dif'] + "</span>) ");
                    if (!$u.hasContent(etnlDiv)) {
                        con.warn("Unable to get experience array");
                    }

                    caap.setDivContent('exp_mess', "Experience to next level: " + caap.stats['exp']['dif']);
                }

                return true;
            } catch (err) {
                con.error("ERROR in addExpDisplay: " + err);
                return false;
            }
        },

        checkResults: function () {
            try {
                // Check page to see if we should go to a page specific check function
                // todo find a way to verify if a function exists, and replace the array with a check_functionName exists check
                if (!schedule.check('CheckResultsTimer')) {
                    return false;
                }

                schedule.setItem('CheckResultsTimer', 1);
                caap.appBodyDiv = $j("#" + caap.domain.id[caap.domain.which] + "app_body", caap.globalContainer);
                caap.resultsWrapperDiv = $j("#" + caap.domain.id[caap.domain.which] + "results_main_wrapper", caap.appBodyDiv);
                caap.resultsText = $u.setContent(caap.resultsWrapperDiv.text(), '').trim().innerTrim();
                caap.battlePage = caap.stats['level'] < 10 ? 'battle_train,battle_off' : 'battle';
                if (!session.setItem("pageLoadOK", caap.getStats())) {
                    return true;
                }

                general.GetCurrent();
                if (general.quickSwitch) {
                    general.GetEquippedStats();
                }

                var pageUrl         = session.getItem('clickUrl', ''),
                    page2           = $u.setContent(pageUrl, 'none').basename(".php"),
                    page            = session.getItem('page', page2),
                    demiPointsFirst = config.getItem('DemiPointsFirst', false),
                    whenMonster     = config.getItem('WhenMonster', 'Never'),
                    whenBattle      = config.getItem('whenBattle', 'Never'),
                    it              = 0,
                    len             = 0;

                if (page !== page2) {
                    //alert("page and page2 differ\n" + page + "\n" + page2 + "\n" + pageUrl);
                    con.warn("page and page2 differ", page, page2, pageUrl);
                }

                session.setItem('pageUserCheck', page === 'keep' ? $u.setContent(pageUrl.regex(/user=(\d+)/), 0) : 0);
                if ($u.hasContent(page) && $u.hasContent(caap.pageList[page]) && $u.hasContent(caap.pageList[page].subpages)) {
                    for (it = 0, len = caap.pageList[page].subpages.length; it < len; it += 1) {
                        if ($u.hasContent($j("img[src*='" + caap.pageList[caap.pageList[page].subpages[it]].signaturePic + "']", caap.appBodyDiv))) {
                            page = caap.pageList[page].subpages[it];
                            break;
                        }
                    }
                }

                session.setItem('page', page);
                if ($u.hasContent(caap.pageList[page])) {
                    con.log(2, 'Checking results for', page);
                    if ($u.isFunction(caap[caap.pageList[page].CheckResultsFunction])) {
                        con.log(3, 'Calling function', caap.pageList[page].CheckResultsFunction);
                        caap[caap.pageList[page].CheckResultsFunction]();
                    } else {
                        con.warn('Check Results function not found', caap.pageList[page]);
                    }
                } else {
                    con.log(2, 'No results check defined for', page);
                }

                // Information updates
                caap.updateDashboard();
                caap.addExpDisplay();
                caap.setDivContent('level_mess', 'Expected next level: ' + $u.makeTime(caap.stats['indicators']['enl'], caap.timeStr(true)));
                caap.setDivContent('demipoint_mess', (whenBattle !== 'Never' && demiPointsFirst && whenMonster !== 'Never') || whenBattle === 'Demi Points Only' ? (state.getItem('DemiPointsDone', true) ? 'Daily Demi Points: Done' : (whenBattle !== 'Never' && demiPointsFirst && whenMonster !== 'Never' ? 'Daily Demi Points: First' : 'Daily Demi Points: Only')) : '');
                caap.setDivContent('demibless_mess', schedule.check('BlessingTimer') ? 'Demi Blessing = none' : 'Next Demi Blessing: ' + $u.setContent(caap.displayTime('BlessingTimer'), "Unknown"));
                caap.setDivContent('feats_mess', schedule.check('festivalBlessTimer') ? 'Feat = none' : 'Next Feat: ' + $u.setContent(caap.displayTime('festivalBlessTimer'), "Unknown"));
                if ($u.hasContent(general.List) && general.List.length <= 2) {
                    schedule.setItem("generals", 0);
                    schedule.setItem("allGenerals", 0);
                    caap.checkGenerals();
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults: " + err);
                return false;
            }
        },

        checkResults_generals: function () {
            try {
                var currentGeneral = '',
                    html           = '',
                    time           = config.getItem("checkGenerals", 24);

                general.GetGenerals();
                currentGeneral = general.GetEquippedStats();
                if (currentGeneral) {
                    html = "<span title='Equipped Attack Power Index' style='font-size: 12px; font-weight: normal;'>EAPI:" + currentGeneral['eapi'] +
                           "</span> <span title='Equipped Defense Power Index' style='font-size: 12px; font-weight: normal;'>EDPI:" + currentGeneral['edpi'] +
                           "</span> <span title='Equipped Mean Power Index' style='font-size: 12px; font-weight: normal;'>EMPI:" + currentGeneral['empi'] + "</span>";
                    $j("#" + caap.domain.id[caap.domain.which] + "general_name_div_int", caap.appBodyDiv).append(html);
                }

                time = time < 24 ? 24 : time;
                schedule.setItem("generals", time * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_generals: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          GET STATS
        // Functions that records all of base game stats, energy, stamina, etc.
        /////////////////////////////////////////////////////////////////////

        // text in the format '123/234'
        getStatusNumbers: function (text) {
            try {
                text = $u.isString(text) ? text.trim() : '';
                if (text === '' || !$u.isString(text) || !/^\d+\/\d+$/.test(text)) {
                    throw "Invalid text supplied:" + text;
                }

                var num = $u.setContent(text.regex(/^(\d+)\//), 0),
                    max = $u.setContent(text.regex(/\/(\d+)$/), 0),
                    dif = $u.setContent(max - num, 0);

                return {
                    'num': num,
                    'max': max,
                    'dif': dif
                };
            } catch (err) {
                con.error("ERROR in getStatusNumbers: " + err);
                return undefined;
            }
        },

        stats: {
            'FBID'       : 0,
            'account'    : '',
            'PlayerName' : '',
            'level'      : 0,
            'army'       : {
                'actual' : 0,
                'capped' : 0
            },
            'generals'   : {
                'total'  : 0,
                'invade' : 0
            },
            'attack'     : 0,
            'defense'    : 0,
            'points'     : {
                'skill' : 0,
                'favor' : 0
            },
            'indicators' : {
                'bsi'      : 0,
                'lsi'      : 0,
                'sppl'     : 0,
                'api'      : 0,
                'dpi'      : 0,
                'mpi'      : 0,
                'mhbeq'    : 0,
                'htl'      : 0,
                'hrtl'     : 0,
                'enl'      : 0,
                'pvpclass' : '',
                'build'    : ''
            },
            'gold' : {
                'cash'    : 0,
                'bank'    : 0,
                'total'   : 0,
                'income'  : 0,
                'upkeep'  : 0,
                'flow'    : 0,
                'ticker'  : []
            },
            'rank' : {
                'battle'       : 0,
                'battlePoints' : 0,
                'war'          : 0,
                'warPoints'    : 0
            },
            'potions' : {
                'energy'  : 0,
                'stamina' : 0
            },
            'energy' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'energyT' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'health' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'healthT' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'stamina' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'staminaT' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'exp' : {
                'num' : 0,
                'max' : 0,
                'dif' : 0
            },
            'other' : {
                'qc'       : 0,
                'bww'      : 0,
                'bwl'      : 0,
                'te'       : 0,
                'tee'      : 0,
                'wlr'      : 0,
                'eer'      : 0,
                'atlantis' : false
            },
            'achievements' : {
                'battle' : {
                    'invasions' : {
                        'won'    : 0,
                        'lost'   : 0,
                        'streak' : 0,
                        'ratio'  : 0
                    },
                    'duels' : {
                        'won'    : 0,
                        'lost'   : 0,
                        'streak' : 0,
                        'ratio'  : 0
                    }
                },
                'monster' : {},
                'other' : {
                    'alchemy' : 0
                }
            },
            'character' : {},
            'guild' : {
                'name'    : '',
                'id'      : '',
                'mPoints' : 0,
                'mRank'   : '',
                'bPoints' : 0,
                'bRank'   : '',
                'members' : []
            }
        },

        loadStats: function (FBID, AccName) {
            var Stats = gm.getItem('stats.record', 'default');
            if (Stats === 'default' || !$j.isPlainObject(Stats)) {
                Stats = gm.setItem('stats.record', caap.stats);
            }

            $j.extend(true, caap.stats, Stats);
            caap.stats['FBID'] = FBID;
            caap.stats['account'] = AccName;
            con.log(4, "Stats", caap.stats);
            session.setItem("UserDashUpdate", true);
        },
        /*jslint sub: false */

        saveStats: function (src) {
            if (caap.domain.which === 3) {
                caap.messaging.setItem('caap.stats', caap.stats);
            } else {
                gm.setItem('stats.record', caap.stats);
                con.log(4, "Stats", caap.stats);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    con.log(2, "caap.saveStats send");
                    caap.messaging.setItem('caap.stats', caap.stats);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("UserDashUpdate", true);
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getStats: function () {
            try {
                var passed      = true,
                    tNum        = 0,
                    xS          = 0,
                    xE          = 0,
                    ststbDiv    = $j("#" + caap.domain.id[caap.domain.which] + "main_ststb", caap.caTools ? caap.caToolsDiv : caap.globalContainer),
                    bntpDiv     = $j("#" + caap.domain.id[caap.domain.which] + "main_bntp", caap.globalContainer),
                    tempDiv     = $j("#" + caap.domain.id[caap.domain.which] + "gold_current_value", ststbDiv);

                // gold
                if ($u.hasContent(tempDiv)) {
                    caap.stats['gold']['cash'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
                } else {
                    con.warn("Unable to get cashDiv");
                    passed = false;
                }

                // energy
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_2", ststbDiv);
                if ($u.hasContent(tempDiv)) {
                    caap.stats['energyT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                    caap.stats['energy'] = caap.getStatusNumbers(caap.stats['energyT']['num'] + "/" + caap.stats['energy']['max']);
                } else {
                    con.warn("Unable to get energyDiv");
                    passed = false;
                }

                // health
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_3", ststbDiv);
                if ($u.hasContent(tempDiv)) {
                    caap.stats['healthT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                    caap.stats['health'] = caap.getStatusNumbers(caap.stats['healthT']['num'] + "/" + caap.stats['health']['max']);
                } else {
                    con.warn("Unable to get healthDiv");
                    passed = false;
                }

                // stamina
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_4", ststbDiv);
                if ($u.hasContent(tempDiv)) {
                    caap.stats['staminaT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                    caap.stats['stamina'] = caap.getStatusNumbers(caap.stats['staminaT']['num'] + "/" + caap.stats['stamina']['max']);
                } else {
                    con.warn("Unable to get staminaDiv");
                    passed = false;
                }

                // experience
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_5", ststbDiv);
                if ($u.hasContent(tempDiv)) {
                    caap.stats['exp'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                } else {
                    con.warn("Unable to get expDiv");
                    passed = false;
                }

                // level
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_5", ststbDiv);
                if ($u.hasContent(tempDiv)) {
                    tNum = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    if (tNum > caap.stats['level']) {
                        con.log(2, 'New level. Resetting Best Land Cost.');
                        caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                        state.setItem('KeepLevelUpGeneral', true);
                    }

                    caap.stats['level'] = tNum;
                } else {
                    con.warn("Unable to get levelDiv");
                    passed = false;
                }

                // army
                tempDiv = $j("a[href*='army.php']", bntpDiv);
                if ($u.hasContent(tempDiv)) {
                    caap.stats['army']['actual'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    tNum = Math.min(caap.stats['army']['actual'], 501);
                    if (tNum >= 1 && tNum <= 501) {
                        caap.stats['army']['capped'] = tNum;
                    } else {
                        con.warn("Army count not in limits");
                        passed = false;
                    }
                } else {
                    con.warn("Unable to get armyDiv");
                    passed = false;
                }

                // upgrade points
                tempDiv = $j("a[href*='keep.php']", bntpDiv);
                if ($u.hasContent(tempDiv)) {
                    tNum = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    if (tNum > caap.stats['points']['skill']) {
                        con.log(2, 'New points. Resetting AutoStat.');
                        state.setItem("statsMatch", true);
                    }

                    caap.stats['points']['skill'] = tNum;
                } else {
                    con.warn("Unable to get pointsDiv");
                    passed = false;
                }

                // Indicators: Hours To Level, Time Remaining To Level and Expected Next Level
                if (caap.stats['exp']) {
                    xS = gm ? gm.getItem("expStaminaRatio", 2.4, hiddenVar) : 2.4;
                    xE = state.getItem('AutoQuest', caap.newAutoQuest())['expRatio'] || (gm ? gm.getItem("expEnergyRatio", 1.4, hiddenVar) : 1.4);
                    caap.stats['indicators']['htl'] = ((caap.stats['level'] * 12.5) - (caap.stats['stamina']['max'] * xS) - (caap.stats['energy']['max'] * xE)) / (12 * (xS + xE));
                    caap.stats['indicators']['hrtl'] = (caap.stats['exp']['dif'] - (caap.stats['stamina']['num'] * xS) - (caap.stats['energy']['num'] * xE)) / (12 * (xS + xE));
                    caap.stats['indicators']['enl'] = Date.now() + Math.ceil(caap.stats['indicators']['hrtl'] * 3600000);
                } else {
                    con.warn('Could not calculate time to next level. Missing experience stats!');
                    passed = false;
                }

                if (!passed)  {
                    caap.saveStats();
                }

                if (!passed && caap.stats['energy']['max'] === 0 && caap.stats['health']['max'] === 0 && caap.stats['stamina']['max'] === 0) {
                    $j().alert("<div style='text-align: center;'>" + con.warn("Paused as this account may have been disabled!", caap.stats) + "</div>");
                    caap.pauseListener();
                }

                return passed;
            } catch (err) {
                con.error("ERROR getStats: " + err);
                return false;
            }
        },

        checkResults_keep: function () {
            try {
                var attrDiv    = $j(".keep_attribute_section", caap.appBodyDiv),
                    statsTB    = $j(".statsTB", caap.appBodyDiv),
                    keepTable1 = $j(".keepTable1 tr", statsTB),
                    statCont   = $j(".attribute_stat_container", attrDiv),
                    tempDiv    = $j(),
                    temp,
                    row,
                    head,
                    body;

                if ($u.hasContent(attrDiv)) {
                    con.log(8, "Getting new values from player keep");
                    // rank
                    tempDiv = $j("img[src*='gif/rank']", caap.appBodyDiv);
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['rank']['battle'] = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored rank.');
                    }

                    // PlayerName
                    tempDiv = $j(".keep_stat_title_inc", attrDiv);
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['PlayerName'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(new RegExp("\"(.+)\",")), '');
                    } else {
                        con.warn('Using stored PlayerName.');
                    }

                    // war rank
                    if (caap.stats['level'] >= 100) {
                        tempDiv = $j("img[src*='war_rank_']", caap.appBodyDiv);
                        if ($u.hasContent(tempDiv)) {
                            caap.stats['rank']['war'] = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
                        } else {
                            con.warn('Using stored warRank.');
                        }
                    }

                    if ($u.hasContent(statCont) && statCont.length === 6) {
                        // Energy
                        tempDiv = statCont.eq(0);
                        if ($u.hasContent(tempDiv)) {
                            caap.stats['energy'] = caap.getStatusNumbers(caap.stats['energyT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                        } else {
                            con.warn('Using stored energy value.');
                        }

                        // Stamina
                        tempDiv = statCont.eq(1);
                        if ($u.hasContent(tempDiv)) {
                            caap.stats['stamina'] = caap.getStatusNumbers(caap.stats['staminaT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                        } else {
                            con.warn('Using stored stamina value.');
                        }

                        if (caap.stats['level'] >= 10) {
                            // Attack
                            tempDiv = statCont.eq(2);
                            if ($u.hasContent(tempDiv)) {
                                caap.stats['attack'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                            } else {
                                con.warn('Using stored attack value.');
                            }

                            // Defense
                            tempDiv = statCont.eq(3);
                            if ($u.hasContent(tempDiv)) {
                                caap.stats['defense'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                            } else {
                                con.warn('Using stored defense value.');
                            }
                        }

                        // Health
                        tempDiv = statCont.eq(4);
                        if ($u.hasContent(tempDiv)) {
                            caap.stats['health'] = caap.getStatusNumbers(caap.stats['healthT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                        } else {
                            con.warn('Using stored health value.');
                        }
                    } else {
                        con.warn("Can't find stats containers! Using stored stats values.");
                    }

                    // Check for Gold Stored
                    tempDiv = $j(".money", statsTB);
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['gold']['bank'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                        caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
                        tempDiv.attr({
                            title : "Click to copy value to retrieve",
                            style : "color: blue;"
                        }).hover(
                            function () {
                                caap.style.cursor = 'pointer';
                            },
                            function () {
                                caap.style.cursor = 'default';
                            }
                        ).click(function () {
                            $j("input[name='get_gold']", caap.appBodyDiv).val(caap.stats['gold']['bank']);
                        });
                    } else {
                        con.warn('Using stored inStore.');
                    }

                    // Check for income
                    tempDiv = $j(".positive", statsTB).eq(0);
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['gold']['income'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    } else {
                        con.warn('Using stored income.');
                    }

                    // Check for upkeep
                    tempDiv = $j(".negative", statsTB);
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['gold']['upkeep'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    } else {
                        con.warn('Using stored upkeep.');
                    }

                    // Cash Flow
                    caap.stats['gold']['flow'] = caap.stats['gold']['income'] - caap.stats['gold']['upkeep'];

                    // Energy potions
                    tempDiv = $j("img[title='Energy Potion']", caap.appBodyDiv).parent().next();
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['potions']['energy'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    } else {
                        caap.stats['potions']['energy'] = 0;
                    }

                    // Stamina potions
                    tempDiv = $j("img[title='Stamina Potion']", caap.appBodyDiv).parent().next();
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['potions']['stamina'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    } else {
                        caap.stats['potions']['stamina'] = 0;
                    }

                    // Other stats
                    // Atlantis Open
                    caap.stats['other'].atlantis = $u.hasContent(caap.checkForImage("seamonster_map_finished.jpg")) ? true : false;

                    // quests Completed
                    tempDiv = $j("td:last", keepTable1.eq(0));
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['other']['qc'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored other.');
                    }

                    // Battles/Wars Won
                    tempDiv = $j("td:last", keepTable1.eq(1));
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['other']['bww'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored other.');
                    }

                    // Battles/Wars Lost
                    tempDiv = $j("td:last", keepTable1.eq(2));
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['other']['bwl'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored other.');
                    }

                    // Times eliminated
                    tempDiv = $j("td:last", keepTable1.eq(3));
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['other']['te'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored other.');
                    }

                    // Times you eliminated an enemy
                    tempDiv = $j("td:last", keepTable1.eq(4));
                    if ($u.hasContent(tempDiv)) {
                        caap.stats['other']['tee'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored other.');
                    }

                    // Win/Loss Ratio (WLR)
                    caap.stats['other']['wlr'] = caap.stats['other']['bwl'] !== 0 ? (caap.stats['other']['bww'] / caap.stats['other']['bwl']).dp(2) : Infinity;
                    // Enemy Eliminated Ratio/Eliminated (EER)
                    caap.stats['other']['eer'] = caap.stats['other']['tee'] !== 0 ? (caap.stats['other']['tee'] / caap.stats['other']['te']).dp(2) : Infinity;
                    // Indicators
                    if (caap.stats['level'] >= 10) {
                        caap.stats['indicators']['bsi'] = ((caap.stats['attack'] + caap.stats['defense']) / caap.stats['level']).dp(2);
                        caap.stats['indicators']['lsi'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max'])) / caap.stats['level']).dp(2);
                        caap.stats['indicators']['sppl'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max']) + caap.stats['attack'] + caap.stats['defense'] + caap.stats['health']['max'] - 122) / caap.stats['level']).dp(2);
                        caap.stats['indicators']['api'] = ((caap.stats['attack'] + (caap.stats['defense'] * 0.7))).dp(2);
                        caap.stats['indicators']['dpi'] = ((caap.stats['defense'] + (caap.stats['attack'] * 0.7))).dp(2);
                        caap.stats['indicators']['mpi'] = (((caap.stats['indicators']['api'] + caap.stats['indicators']['dpi']) / 2)).dp(2);
                        caap.stats['indicators']['mhbeq'] = ((caap.stats['attack'] + (2 * caap.stats['stamina']['max'])) / caap.stats['level']).dp(2);
                        if (caap.stats['attack'] >= caap.stats['defense']) {
                            temp = caap.stats['attack'] / caap.stats['defense'];
                            if (temp === caap.stats['attack']) {
                                caap.stats['indicators']['pvpclass'] = 'Destroyer';
                            } else if (temp >= 2 && temp < 7.5) {
                                caap.stats['indicators']['pvpclass'] = 'Aggressor';
                            } else if (temp < 2 && temp > 1.01) {
                                caap.stats['indicators']['pvpclass'] = 'Offensive';
                            } else if (temp <= 1.01) {
                                caap.stats['indicators']['pvpclass'] = 'Balanced';
                            }
                        } else {
                            temp = caap.stats['defense'] / caap.stats['attack'];
                            if (temp === caap.stats['defense']) {
                                caap.stats['indicators']['pvpclass'] = 'Wall';
                            } else if (temp >= 2 && temp < 7.5) {
                                caap.stats['indicators']['pvpclass'] = 'Paladin';
                            } else if (temp < 2 && temp > 1.01) {
                                caap.stats['indicators']['pvpclass'] = 'Defensive';
                            } else if (temp <= 1.01) {
                                caap.stats['indicators']['pvpclass'] = 'Balanced';
                            }
                        }

                        if (caap.stats['indicators']['bsi'] >= 7) {
                            caap.stats['indicators']['build'] = 'Pure PvP';
                        } else if (caap.stats['indicators']['bsi'] >= 5 && caap.stats['indicators']['bsi'] < 7) {
                            caap.stats['indicators']['build'] = 'PvP';
                        } else if (caap.stats['indicators']['bsi'] >= 3 && caap.stats['indicators']['bsi'] < 5) {
                            caap.stats['indicators']['build'] = 'Hybrid';
                        } else if (caap.stats['indicators']['bsi'] >= 1 && caap.stats['indicators']['bsi'] < 3) {
                            caap.stats['indicators']['build'] = 'Monster Hunter';
                        } else if (caap.stats['indicators']['bsi'] < 1) {
                            caap.stats['indicators']['build'] = 'Power Leveler';
                        }
                    }

                    schedule.setItem("keep", (gm ? gm.getItem("checkKeep", 1, hiddenVar) : 1) * 3600, 300);
                    caap.saveStats();
                    if (!caap.caTools && config.getItem("displayKStats", true)) {
                        tempDiv = $j(".keep_healer_section", caap.appBodyDiv).children().eq(0);
                        temp = "<div style='border:1px solid #701919;margin:-238px 0pt 0pt 21px;padding: 5px 5px;width:200px;height:223px;float:left;background-color:#d0b682;background-image: url(\"" + $j("input[src*='btn_retrieve.gif']", caap.appBodyDiv).attr("src").replace("btn_retrieve.gif", "bg_main_middle.jpg") + "\");'>";
                        row = caap.makeTh({text: '&nbsp;', color: '', bgcolor: '', id: '', title: '', width: '40%'});
                        row += caap.makeTh({text: '&nbsp;', color: '', bgcolor: '', id: '', title: '', width: '60%'});
                        head = caap.makeTr(row);
                        row = caap.makeTd({text: 'BSI', color: '', id: '', title: 'Battle Strength Index'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['bsi'], color: '', id: '', title: ''}, "font-size:14px;");
                        body = caap.makeTr(row);
                        row = caap.makeTd({text: 'LSI', color: '', id: '', title: 'Leveling Speed Index'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['lsi'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'SPPL', color: '', id: '', title: 'Skill Points Per Level (More accurate than SPAEQ)'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['sppl'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'API', color: '', id: '', title: 'Attack Power Index'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['api'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'DPI', color: '', id: '', title: 'Defense Power Index'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['dpi'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'MPI', color: '', id: '', title: 'Mean Power Index'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['mpi'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'MHBEQ', color: '', id: '', title: 'Monster Hunting Build Effective Quotent'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['mhbeq'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'Build', color: '', id: '', title: 'Character build type'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['build'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        row = caap.makeTd({text: 'PvP Class', color: '', id: '', title: 'Player vs. Player character class'}, "font-size:14px;");
                        row += caap.makeTd({text: caap.stats['indicators']['pvpclass'], color: '', id: '', title: ''}, "font-size:14px;");
                        body += caap.makeTr(row);
                        temp += caap.makeTable("keepstats", head, body, "Statistics", "font-size:16px;");
                        temp += "</div>";
                        tempDiv.before(temp);
                    } else {
                        tempDiv = $j(".keep_stat_title_inc", attrDiv);
                        tempDiv = $u.hasContent(tempDiv) ? tempDiv.html($u.setContent(tempDiv.html(), '').trim() + ", <span style='white-space: nowrap;'>BSI: " + caap.stats['indicators']['bsi'] + " LSI: " + caap.stats['indicators']['lsi'] + "</span>") : tempDiv;
                    }
                } else {
                    tempDiv = $j("a[href*='keep.php?user=']", caap.appBodyDiv);
                    if ($u.hasContent(tempDiv)) {
                        con.log(2, "On another player's keep", $u.setContent($u.setContent(tempDiv.attr("href"), '').basename().regex(/(\d+)/), 0));
                    } else {
                        con.warn("Attribute section not found and not identified as another player's keep!");
                    }
                }

                if (config.getItem("enableTitles", true)) {
                    spreadsheet.doTitles();
                }

                if (config.getItem("enableKeepShrink", true)) {
                    $j("div[class*='statUnit'] img", caap.appBodyDiv).attr("style", "height: 45px; width: 45px;").not("div[class*='statUnit'] img[alt='Stamina Potion'],img[alt='Energy Potion']", caap.appBodyDiv).parent().parent().attr("style", "height: 45px; width: 45px;");
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_keep: " + err);
                return false;
            }
        },

        checkResults_oracle: function () {
            try {
                var favorDiv = $j(".title_action", caap.appBodyDiv),
                    text     = '',
                    tNum     = 0,
                    save     = false,
                    tDiv,
                    lDiv;

                if ($u.hasContent(favorDiv)) {
                    text = favorDiv.text();
                    if (/You have zero favor points!/.test(text)) {
                        caap.stats['points']['favor'] = 0;
                        save = true;
                    } else if (/You have a favor point!/.test(text)) {
                        caap.stats['points']['favor'] = 1;
                        save = true;
                    } else {
                        tNum = text.regex(/You have (\d+) favor points!/);
                        if ($u.hasContent(tNum)) {
                            caap.stats['points']['favor'] = tNum;
                            save = true;
                        }
                    }
                } else {
                    con.warn('Favor Points div not found.');
                }

                if (save) {
                    con.log(2, 'Got number of Favor Points', caap.stats['points']['favor']);
                    caap.saveStats();
                } else {
                    con.warn('Favor Points not matched.');
                }

                if (config.getItem("enableOracleMod", true)) {
                    tDiv = $j("#results_container", caap.appBodyDiv).parent().children().eq(6);
                    if ($u.hasContent(tDiv)) {
                        lDiv = $j(".limitedDiv_int", caap.appBodyDiv);
                        if ($u.hasContent(lDiv) && lDiv.length === 4) {
                            text = '<form><select><option value="#">Change General</option>';
                            for (tNum = 0; tNum < offline.bga.length; tNum += 1) {
                                text += '<option value="' + tNum + '">' + offline.bga[tNum].n + '</option>';
                            }

                            text += '</select></form>';
                            tDiv.html(text);
                            tDiv.children("form").bind('change', function (event) {
                                var v = event.target.value,
                                    it = 0;

                                function change(t, i, n, a, d, b, o, p) {
                                    o = lDiv.eq(o).children();
                                    o.eq(1).children().eq(0).html('Summon<br>' + ["General", "Magic", "Amulet", "Weapon", "Shield", "Helmet", "Armor", "Glove", "Off-hand", "Spell"][t] + '<br>');
                                    o.eq(2).children().eq(0).attr({
                                        'src'   : o.eq(2).children().eq(0).attr('src').dirname() + p + '.jpg',
                                        'alt'   : n,
                                        'title' : i
                                    });

                                    o.eq(3).children().eq(0).html(n + '!');
                                    o.eq(4).children().eq(0).children(0).text(a + ' Attack');
                                    o.eq(4).children().eq(1).children(0).text(d + ' Defense');
                                    o.eq(5).children().eq(0).attr('id', 'favorBuy_' + b);
                                    $j("input[name='buychoice']", o).val(b);
                                }

                                if (v !== "#") {
                                    change(0, offline.bga[v].i, offline.bga[v].n, offline.bga[v].a, offline.bga[v].d, offline.bga[v].b, 0, offline.bga[v].p);
                                    for (it = 0; it < 3; it += 1) {
                                        change(offline.bga[v].e[it].t, offline.bga[v].e[it].i, offline.bga[v].e[it].n, offline.bga[v].e[it].a, offline.bga[v].e[it].d, offline.bga[v].e[it].b, 1 + it, offline.bga[v].e[it].p);                                    }
                                   	}
                            });
                        } else {
                            con.warn('limitedDiv_int not found.');
                        }
                    } else {
                        con.warn('results_container not found.');
                    }
                }

                schedule.setItem("oracle", (gm ? gm.getItem("checkOracle", 24, hiddenVar) : 24) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_oracle: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        checkResults_alchemy: function () {
            try {
                if (config.getItem("enableTitles", true)) {
                    spreadsheet.doTitles();
                }

                var recipeDiv   = $j(".alchemyRecipeBack .recipeTitle", caap.appBodyDiv),
                    titleTxt    = '',
                    titleRegExp = new RegExp("RECIPES: Create (.+)", "i"),
                    image       = '',
                    hideCount   = config.getItem("recipeCleanCount", 1),
                    special     = [
                        "Volcanic Knight",
                        "Holy Plate",
                        "Atlantean Forcefield",
                        "Spartan Phalanx",
                        "Cronus, The World Hydra",
                        "Helm of Dragon Power",
                        "Avenger",
                        "Judgement",
                        "Tempered Steel",
                        "Bahamut, the Volcanic Dragon",
                        "Blood Zealot",
                        "Transcendence",
                        "Soul Crusher",
                        "Soulforge",
                        "Crown of Flames"
                    ];

                hideCount = hideCount < 1 ? 1 : hideCount;
                if ($u.hasContent(recipeDiv)) {
                    recipeDiv.each(function () {
                        var row = $j(this);
                        titleTxt = row.text().trim().innerTrim().regex(titleRegExp);
                        if ($u.hasContent(titleTxt)) {
                            if (titleTxt === "Elven Crown") {
                                image = "gift_aeris_complete.jpg";
                            }

                            if (spreadsheet.isSummon(titleTxt, image)) {
                                row.text(row.text().trim() + ' : Summon Owned (' + town.getCount(titleTxt, image) + ')');
                            } else {
                                row.text(row.text().trim() + ' : Owned (' + town.getCount(titleTxt, image) + ')');
                                if (config.getItem("enableRecipeClean", true) && !special.hasIndexOf(titleTxt) && town.getCount(titleTxt, image) >= hideCount) {
                                    row.parent().parent().css("display", "none").next().css("display", "none");
                                }
                            }
                        }

                        return true;
                    });
                }

                if (config.getItem("enableIngredientsHide", false)) {
                    $j("div[class='statsTTitle'],div[class='statsTMain']", caap.appBodyDiv).css("display", "none");
                }

                if (config.getItem("enableAlchemyShrink", true)) {
                    $j("div[class*='alchemyRecipeBack'],div[class*='alchemyQuestBack']", caap.appBodyDiv).css("height", "100px");
                    $j("div[class*='alchemySpace']", caap.appBodyDiv).css("height", "4px");
                    $j(".statsT2 img").not("img[src*='emporium_go.gif']", caap.appBodyDiv).attr("style", "height: 45px; width: 45px;").parent().attr("style", "height: 45px; width: 45px;").parent().css("width", "50px");
                    $j("input[name='Alchemy Submit']", caap.appBodyDiv).css("width", "80px");
                    $j(".recipeTitle", caap.appBodyDiv).css("margin", "0px");
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_alchemy: " + err);
                return false;
            }
        },

        commonTown: function () {
            try {
                $j("form[id*='itemBuy'] select[name='amount']", caap.appBodyDiv).val("5");
                if (config.getItem("enableTitles", true)) {
                    spreadsheet.doTitles();
                }

                return true;
            } catch (err) {
                con.error("ERROR in commonTown: " + err);
                return false;
            }
        },

        checkResults_soldiers: function () {
            try {
                caap.commonTown();
                town.GetItems("soldiers");
                var time = config.getItem("checkSoldiers", 72);
                time = time < 72 ? 72 : time;
                schedule.setItem("soldiers", time * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_soldiers: " + err);
                return false;
            }
        },

        checkResults_item: function () {
            try {
                caap.commonTown();
                town.GetItems("item");
                var time = config.getItem("checkItem", 72);
                time = time < 72 ? 72 : time;
                schedule.setItem("item", time * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_item: " + err);
                return false;
            }
        },

        checkResults_magic: function () {
            try {
                caap.commonTown();
                town.GetItems("magic");
                var time = config.getItem("checkMagic", 72);
                time = time < 72 ? 72 : time;
                schedule.setItem("magic", time * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_magic: " + err);
                return false;
            }
        },

        checkResults_goblin_emp: function () {
            try {
                if (config.getItem("goblinHinting", true)) {
                    spreadsheet.doTitles(true);
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_goblin_emp: " + err);
                return false;
            }
        },

        checkResults_gift: function () {
            try {
                if ($u.hasContent(gifting.queue.sentHtml)) {
                    $j("#results_container", caap.appBodyDiv).before(gifting.queue.sentHtml);
                    gifting.queue.sentHtml = '';
                }

                gifting.gifts.populate();
                var time = config.getItem("checkGift", 3);
                time = time < 3 ? 3 : time;
                schedule.setItem("gift", time * 86400, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_gift: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_battlerank: function () {
            try {
                var rankDiv = $j("div[style*='battle_rank_banner.jpg']", caap.appBodyDiv),
                    tNum    = 0;

                if ($u.hasContent(rankDiv)) {
                    tNum = $u.setContent($u.setContent(rankDiv.text(), '').replace(',', '').regex(/with (\d+) Battle Points/i), 0);
                    if ($u.hasContent(tNum)) {
                        con.log(2, 'Got Battle Rank Points', tNum);
                        caap.stats['rank']['battlePoints'] = tNum;
                        caap.saveStats();
                    } else {
                        con.warn('Battle Rank Points RegExp not matched.');
                    }
                } else {
                    con.warn('Battle Rank Points div not found.');
                }

                schedule.setItem("battlerank", (gm ? gm.getItem("checkBattleRank", 48, hiddenVar) : 48) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_battlerank: " + err);
                return false;
            }
        },

        checkResults_war_rank: function () {
            try {
                var rankDiv = $j("div[style*='war_rank_banner.jpg']", caap.appBodyDiv),
                    tNum    = 0;

                if ($u.hasContent(rankDiv)) {
                    tNum = $u.setContent($u.setContent(rankDiv.text(), '').replace(',', '').regex(/with (\d+) War Points/i), 0);
                    if ($u.hasContent(tNum)) {
                        con.log(2, 'Got War Rank Points', tNum);
                        caap.stats['rank']['warPoints'] = tNum;
                        caap.saveStats();
                    } else {
                        con.warn('War Rank Points RegExp not matched.');
                    }
                } else {
                    con.warn('War Rank Points div not found.');
                }

                schedule.setItem("warrank", (gm ? gm.getItem("checkWarRank", 48, hiddenVar) : 48) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_war_rank: " + err);
                return false;
            }
        },

        checkResults_achievements: function () {
            try {
                var achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievements_2", caap.appBodyDiv),
                    tdDiv  = $j("td div", achDiv);

                if ($u.hasContent(achDiv)) {
                    if ($u.hasContent(tdDiv) && tdDiv.length === 6) {
                        caap.stats['achievements']['battle']['invasions']['won'] = $u.setContent(tdDiv.eq(0).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['duels']['won'] = $u.setContent(tdDiv.eq(1).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['invasions']['lost'] = $u.setContent(tdDiv.eq(2).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['duels']['lost'] = $u.setContent(tdDiv.eq(3).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['invasions']['streak'] = $u.setContent(tdDiv.eq(4).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['duels']['streak'] = $u.setContent(tdDiv.eq(5).text().numberOnly(), 0);
                        caap.stats['achievements']['battle']['invasions']['ratio'] = caap.stats['achievements']['battle']['invasions']['lost'] > 0 ? (caap.stats['achievements']['battle']['invasions']['won'] / caap.stats['achievements']['battle']['invasions']['lost']).dp(2) : Infinity;
                        caap.stats['achievements']['battle']['duels']['ratio'] = caap.stats['achievements']['battle']['invasions']['lost'] > 0 ? (caap.stats['achievements']['battle']['duels']['won'] / caap.stats['achievements']['battle']['duels']['lost']).dp(2) : Infinity;
                        caap.saveStats();
                    } else {
                        con.warn('Battle Achievements problem.');
                    }
                } else {
                    con.warn('Battle Achievements not found.');
                }

                achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievements_3", caap.appBodyDiv);
                if ($u.hasContent(achDiv)) {
                    tdDiv = $j("td", achDiv);
                    if ($u.hasContent(tdDiv)) {
                        caap.stats['achievements']['monster'] = {};
                        tdDiv.each(function () {
                            var td  = $j(this),
                                divNum = $j("div", td).text().parseInt(),
                                tdTxt = td.justtext().trim();

                            caap.stats['achievements']['monster'][tdTxt] = divNum;
                        });

                        caap.saveStats();
                    } else {
                        con.warn('Monster Achievements problem.');
                    }
                } else {
                    con.warn('Monster Achievements not found.');
                }

                achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievements_4", caap.appBodyDiv);
                if ($u.hasContent(achDiv)) {
                    tdDiv = $j("td div", achDiv);
                    if ($u.hasContent(tdDiv) && tdDiv.length === 1) {
                        caap.stats['achievements']['other']['alchemy'] = $u.setContent(tdDiv.eq(0).text().numberOnly(), 0);
                        caap.saveStats();
                    } else {
                        con.warn('Other Achievements problem.');
                    }
                } else {
                    con.warn('Other Achievements not found.');
                }

                schedule.setItem("achievements", (gm ? gm.getItem("checkAchievements", 72, hiddenVar) : 72) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_achievements: " + err);
                return false;
            }
        },

        checkResults_view_class_progress: function () {
            try {
                var classDiv = $j("#" + caap.domain.id[caap.domain.which] + "choose_class_screen div[class*='banner_']", caap.appBodyDiv);
                if ($u.hasContent(classDiv)) {
                    caap.stats['character'] = {};
                    classDiv.each(function () {
                        var monsterClass = $j(this),
                            name         = $u.setContent(monsterClass.attr("class"), '').replace("banner_", '').ucFirst();

                        if (name) {
                            caap.stats['character'][name] = {};
                            caap.stats['character'][name]['percent'] = $u.setContent($j("img[src*='progress']", monsterClass).eq(0).getPercent('width').dp(2), 0);
                            caap.stats['character'][name]['level'] = $u.setContent(monsterClass.children().eq(2).text().numberOnly(), 0);
                            con.log(2, "Got character class record", name, caap.stats['character'][name]);
                            caap.saveStats();
                        } else {
                            con.warn("Problem character class name", name);
                        }
                    });
                } else {
                    con.warn("Problem with character class records", classDiv);
                }

                schedule.setItem("characterClasses", (gm ? gm.getItem("CheckClassProgress", 48, hiddenVar) : 48) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_view_class_progress: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          QUESTING
        // Quest function does action, DrawQuest sets up the page and gathers info
        /////////////////////////////////////////////////////////////////////

        maxEnergyQuest: function () {
            try {
                var maxIdleEnergy = 0,
                    theGeneral    = config.getItem('IdleGeneral', 'Use Current');

                if (theGeneral !== 'Use Current') {
                    maxIdleEnergy = $u.setContent(general.GetEnergyMax(theGeneral), 0);
                    if (maxIdleEnergy <= 0 || $u.isNaN(maxIdleEnergy)) {
                        con.log(1, "Changing to idle general to get Max energy");
                        if (general.Select('IdleGeneral')) {
                            return true;
                        }
                    }
                }

                return caap.stats['energy']['num'] >= maxIdleEnergy ? caap.quests() : false;
            } catch (err) {
                con.error("ERROR in maxEnergyQuest: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        questAreaInfo: {
            'Land of Fire' : {
                clas : 'quests_stage_1',
                base : 'land_fire',
                next : 'Land of Earth',
                area : '',
                list : '',
                boss : 'Heart of Fire',
                orb  : 'Orb of Gildamesh'
            },
            'Land of Earth' : {
                clas : 'quests_stage_2',
                base : 'land_earth',
                next : 'Land of Mist',
                area : '',
                list : '',
                boss : 'Gift of Earth',
                orb  : 'Colossal Orb'
            },
            'Land of Mist' : {
                clas : 'quests_stage_3',
                base : 'land_mist',
                next : 'Land of Water',
                area : '',
                list : '',
                boss : 'Eye of the Storm',
                orb  : 'Sylvanas Orb'
            },
            'Land of Water' : {
                clas : 'quests_stage_4',
                base : 'land_water',
                next : 'Demon Realm',
                area : '',
                list : '',
                boss : 'A Look into the Darkness',
                orb  : 'Orb of Mephistopheles'
            },
            'Demon Realm' : {
                clas : 'quests_stage_5',
                base : 'land_demon_realm',
                next : 'Undead Realm',
                area : '',
                list : '',
                boss : 'The Rift',
                orb  : 'Orb of Keira'
            },
            'Undead Realm' : {
                clas : 'quests_stage_6',
                base : 'land_undead_realm',
                next : 'Underworld',
                area : '',
                list : '',
                boss : 'Undead Embrace',
                orb  : 'Lotus Orb'
            },
            'Underworld' : {
                clas : 'quests_stage_7',
                base : 'tab_underworld',
                next : 'Kingdom of Heaven',
                area : '',
                list : '',
                boss : 'Confrontation',
                orb  : 'Orb of Skaar Deathrune'
            },
            'Kingdom of Heaven' : {
                clas : 'quests_stage_8',
                base : 'tab_heaven',
                next : 'Ivory City',
                area : '',
                list : '',
                boss : 'Archangels Wrath',
                orb  : 'Orb of Azriel'
            },
            'Ivory City' : {
                clas : 'quests_stage_9',
                base : 'tab_ivory',
                next : 'Earth II',
                area : '',
                list : '',
                boss : 'Entrance to the Throne',
                orb  : 'Orb of Alpha Mephistopheles'
            },
            'Earth II' : {
                clas : 'quests_stage_10',
                base : 'tab_earth2',
                next : 'Water II',
                area : '',
                list : '',
                boss : "Lion's Rebellion",
                orb  : 'Orb of Aurelius'
            },
            'Water II' : {
                clas : 'quests_stage_11',
                base : 'tab_water2',
                next : 'Mist II',
                area : '',
                list : '',
                boss : "Corvintheus",
                orb  : 'Orb of Corvintheus'
            },
            'Mist II' : {
                clas : 'quests_stage_12',
                base : 'tab_mist2',
                next : 'Mist III',
                area : '',
                list : '',
                boss : "Jahanna",
                orb  : 'Orb of Jahanna'
            },
            'Mist III' : {
                clas : 'quests_stage_13',
                base : 'tab_mist3',
                next : 'Fire II',
                area : '',
                list : '',
                boss : "Aurora",
                orb  : 'Orb of Aurora'
            },
            'Fire II' : {
                clas : 'quests_stage_14',
                base : 'tab_fire2',
                next : 'Pangaea',
                area : '',
                list : '',
                boss : "Ambrosia",
                orb  : 'Orb of Ambrosia'
            },
            'Pangaea' : {
                clas : 'quests_stage_15',
                base : 'tab_pangaea',
                next : 'Perdition',
                area : '',
                list : '',
                boss : "Malekus",
                orb  : 'Orb of Malekus'
            },
            'Perdition' : {
                clas : 'quests_stage_16',
                base : 'tab_perdition',
                next : 'DemiChange',
                area : '',
                list : '',
                boss : "Azeron",
                orb  : 'Orb of Azeron'
            },
            'DemiChange' : {
                clas : 'symbolquests_stage_1',
                next : 'Ambrosia',
                area : 'Demi Quests',
                list : 'demiQuestList'
            },
            'Ambrosia' : {
                clas : 'symbolquests_stage_1',
                next : 'Malekus',
                area : '',
                list : ''
            },
            'Malekus' : {
                clas : 'symbolquests_stage_2',
                next : 'Corvintheus',
                area : '',
                list : ''
            },
            'Corvintheus' : {
                clas : 'symbolquests_stage_3',
                next : 'Aurora',
                area : '',
                list : ''
            },
            'Aurora' : {
                clas : 'symbolquests_stage_4',
                next : 'Azeron',
                area : '',
                list : ''
            },
            'Azeron' : {
                clas : 'symbolquests_stage_5',
                next : 'AtlantisChange',
                area : '',
                list : ''
            },
            'AtlantisChange' : {
                clas : 'monster_quests_stage_1',
                next : 'Atlantis',
                area : 'Atlantis',
                list : 'atlantisQuestList'
            },
            'Atlantis' : {
                clas : 'monster_quests_stage_1',
                next : '',
                area : '',
                list : ''
            }
        },

        demiQuestTable : {
            'Ambrosia'    : 'energy',
            'Malekus'     : 'attack',
            'Corvintheus' : 'defense',
            'Aurora'      : 'health',
            'Azeron'      : 'stamina'
        },

        qtom: null,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        quests: function () {
            try {
                var storeRetrieve = state.getItem('storeRetrieve', ''),
                    to;

                if (storeRetrieve) {
                    if (storeRetrieve === 'general') {
                        con.log(1, "storeRetrieve", storeRetrieve);
                        if (general.Select('BuyGeneral')) {
                            return true;
                        }

                        state.setItem('storeRetrieve', '');
                        return true;
                    } else {
                        return caap.retrieveFromBank(storeRetrieve);
                    }
                }

                caap.qtom = window.setTimeout(function () {
                    caap.setDivContent('quest_mess', '');
                }, 1000);

                var whenQuest = config.getItem('WhenQuest', 'Never');
                if (whenQuest === 'Never') {
                    caap.setDivContent('quest_mess', 'Questing off');
                    window.clearTimeout(caap.qtom);
                    return false;
                }

                if (whenQuest === 'Not Fortifying' || (config.getItem('PrioritiseMonsterAfterLvl', false) && state.getItem('KeepLevelUpGeneral', false))) {
                    var fortMon = state.getItem('targetFromfortify', new monster.energyTarget().data);
                    if ($j.isPlainObject(fortMon) && fortMon['md5'] && fortMon['type']) {
                        switch (fortMon['type']) {
                        case "Fortify":
                            var maxHealthtoQuest = config.getItem('MaxHealthtoQuest', 0);
                            if (!maxHealthtoQuest) {
                                caap.setDivContent('quest_mess', '<span style="font-weight: bold;">No valid over fortify %</span>');
                                window.clearTimeout(caap.qtom);
                                return false;
                            }

                            caap.setDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " health exceeds " + config.getItem('MaxToFortify', 0) + '%');
                            window.clearTimeout(caap.qtom);
                            var targetFrombattle_monster = state.getItem('targetFrombattle_monster', '');
                            // this looks like a bug and needs testing if (!targetFrombattle_monster) {
                            if (!targetFrombattle_monster) {
                                var currentMonster = monster.getItem(targetFrombattle_monster);
                                if (!currentMonster['fortify']) {
                                    if (currentMonster['fortify'] < maxHealthtoQuest) {
                                        caap.setDivContent('quest_mess', 'No questing until fortify target ' + currentMonster['name'] + ' health exceeds ' + maxHealthtoQuest + '%');
                                        window.clearTimeout(caap.qtom);
                                        return false;
                                    }
                                }
                            }

                            break;
                        case "Strengthen":
                            caap.setDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " at full strength.");
                            window.clearTimeout(caap.qtom);
                            break;
                        case "Stun":
                            caap.setDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " stunned.");
                            window.clearTimeout(caap.qtom);
                            break;
                        default:
                        }

                        return false;
                    }
                }

                var autoQuestName = state.getItem('AutoQuest', caap.newAutoQuest())['name'];
                if (!autoQuestName) {
                    if (config.getItem('WhyQuest', 'Manual') === 'Manual') {
                        caap.setDivContent('quest_mess', 'Pick quest manually.');
                        window.clearTimeout(caap.qtom);
                        return false;
                    }

                    caap.setDivContent('quest_mess', 'Searching for quest.');
                    window.clearTimeout(caap.qtom);
                    con.log(1, "Searching for quest");
                } else {
                    var energyCheck = caap.checkEnergy(state.getItem('AutoQuest', caap.newAutoQuest())['energy'], whenQuest, 'quest_mess');
                    if (!energyCheck) {
                        return false;
                    }
                }

                if (state.getItem('AutoQuest', caap.newAutoQuest())['general'] === 'none' || config.getItem('ForceSubGeneral', false)) {
                    if (general.Select('SubQuestGeneral')) {
                        return true;
                    }
                } else if (general.LevelUpCheck('QuestGeneral')) {
                    if (general.Select('LevelUpGeneral')) {
                        return true;
                    }

                    con.log(2, 'Using level up general');
                }

                switch (config.getItem('QuestArea', 'Quest')) {
                case 'Quest' :
                    var pathToPage  = 'quests',
                        imageOnPage = 'quest_back_1.jpg',
                        subQArea    = 'Land of Fire',
                        landPic     = '';

                    if (caap.stats['level'] > 7) {
                        subQArea = config.getItem('QuestSubArea', 'Land of Fire');
                        landPic = caap.questAreaInfo[subQArea].base;
                        if ($u.hasContent($j("img[src*='" + landPic + "_lock']"))) {
                            caap.checkResults_quests(true);
                        }

                        if (landPic === 'tab_heaven' || config.getItem('GetOrbs', false) && config.getItem('WhyQuest', 'Manual') !== 'Manual') {
                            if (caap.checkMagic()) {
                                return true;
                            }
                        }

                        pathToPage = 'quests,jobs_tab_more.gif,' + landPic;
                        imageOnPage = landPic;
                        switch (landPic) {
                        case 'tab_fire2':
                        case 'tab_mist3':
                        case 'tab_mist2':
                        case 'tab_water2':
                        case 'tab_earth2':
                        case 'tab_ivory':
                        case 'tab_underworld':
                            pathToPage += '_small.gif';
                            imageOnPage += '_big.gif';
                            break;
                        case 'tab_heaven':
                            pathToPage += '_small2.gif';
                            imageOnPage += '_big2.gif';
                            break;
                        case 'land_undead_realm':
                        case 'land_demon_realm':
                            pathToPage += '.gif';
                            imageOnPage += '_sel.gif';
                            break;
                        default:
                            pathToPage = 'quests,jobs_tab_back.gif,' + landPic + '.gif';
                            imageOnPage += '_sel.gif';
                        }
                    }

                    if (caap.navigateTo(pathToPage, imageOnPage)) {
                        return true;
                    }

                    break;
                case 'Demi Quests' :
                    if (caap.navigateTo('quests,symbolquests', 'demi_quest_on.gif')) {
                        return true;
                    }

                    var subDQArea = config.getItem('QuestSubArea', 'Ambrosia'),
                        deityN    = caap.deityTable[caap.demiQuestTable[subDQArea]],
                        picSlice  = $j("#" + caap.domain.id[caap.domain.which] + "symbol_image_symbolquests" + deityN, caap.globalContainer),
                        descSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_desc_symbolquests" + deityN, caap.globalContainer);

                    if (!$u.hasContent(picSlice) || !$u.hasContent(descSlice)) {
                        con.warn('No diety image or description for', subDQArea);
                        return false;
                    }

                    if (descSlice.css('display') === 'none') {
                        return caap.navigateTo(picSlice.attr("src").basename());
                    }

                    break;
                case 'Atlantis' :
                    if (!caap.hasImage('tab_atlantis_on.gif')) {
                        return caap.navigateTo('quests,monster_quests');
                    }

                    break;
                default :
                }

                var bDiv   = $j("#" + caap.domain.id[caap.domain.which] + "single_popup", caap.globalContainer),
                    bDisp  = $u.setContent(bDiv.css("display"), 'none'),
                    button = $j();

                if (bDisp !== 'none') {
                    button = $j("input[src*='quick_switch_button.gif']", bDiv);
                    if ($u.hasContent(button) && !config.getItem('ForceSubGeneral', false)) {
                        con.log(2, 'Clicking on quick switch general button.');
                        caap.click(button);
                        general.quickSwitch = true;
                        return true;
                    }
                }

                if (general.quickSwitch) {
                    caap.reBind();
                    general.GetEquippedStats();
                }

                // Buy quest requires popup
                var itemBuyPopUp = $j("form[id*='itemBuy']", caap.globalContainer),
                    costToBuy    = 0;

                if (bDisp !== 'none' && $u.hasContent(itemBuyPopUp)) {
                    con.log(2, 'itemBuy');
                    state.setItem('storeRetrieve', 'general');
                    if (general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    costToBuy = itemBuyPopUp.text().replace(new RegExp(".*\\$"), '').replace(new RegExp("[^\\d]{3,}.*"), '').parseInt();
                    con.log(2, "costToBuy", costToBuy);
                    if (caap.stats['gold']['cash'] < costToBuy) {
                        //Retrieving from Bank
                        if (caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
                            con.log(1, "Trying to retrieve", costToBuy - caap.stats['gold']['cash']);
                            state.setItem("storeRetrieve", costToBuy - caap.stats['gold']['cash']);
                            return caap.retrieveFromBank(costToBuy - caap.stats['gold']['cash']);
                        } else {
                            con.log(1, "Cant buy requires, stopping quest");
                            caap.manualAutoQuest();
                            return false;
                        }
                    }


                    button = caap.checkForImage('quick_buy_button.jpg');
                    if ($u.hasContent(button)) {
                        con.log(1, 'Clicking on quick buy button.');
                        caap.click(button);
                        return true;
                    }

                    con.warn("Cant find buy button");
                    return false;
                }

                button = caap.checkForImage('quick_buy_button.jpg');
                if (bDisp !== 'none' && $u.hasContent(button)) {
                    con.log(2, 'quick_buy_button');
                    state.setItem('storeRetrieve', 'general');
                    if (general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    costToBuy = $j("strong", button.parents("form").eq(0)).text().replace(new RegExp("[^0-9]", "g"), '');
                    con.log(2, "costToBuy", costToBuy);
                    if (caap.stats['gold']['cash'] < costToBuy) {
                        //Retrieving from Bank
                        if (caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
                            con.log(1, "Trying to retrieve: ", costToBuy - caap.stats['gold']['cash']);
                            state.setItem("storeRetrieve", costToBuy - caap.stats['gold']['cash']);
                            return caap.retrieveFromBank(costToBuy - caap.stats['gold']['cash']);
                        } else {
                            con.log(1, "Cant buy General, stopping quest");
                            caap.manualAutoQuest();
                            return false;
                        }
                    }

                    con.log(2, 'Clicking on quick buy general button.');
                    caap.click(button);
                    return true;
                }

                var autoQuestDivs = {
                        name     : '',
                        click    : $j(),
                        tr       : $j(),
                        genDiv   : $j(),
                        orbCheck : false
                    };

                autoQuestDivs = caap.checkResults_quests(true);
                //con.log(1, 'autoQuestDivs/autoQuestName', autoQuestDivs, autoQuestName);
                if (!autoQuestDivs.name) {
                    con.log(1, 'Could not find AutoQuest.');
                    caap.setDivContent('quest_mess', 'Could not find AutoQuest.');
                    window.clearTimeout(caap.qtom);
                    return false;
                }

                if (autoQuestDivs.name !== autoQuestName) {
                    con.log(1, 'New AutoQuest found.');
                    caap.setDivContent('quest_mess', 'New AutoQuest found.');
                    window.clearTimeout(caap.qtom);
                    return true;
                }

                // if found missing requires, click to buy
                if ($u.hasContent(autoQuestDivs.tr)) {
                    var background = $j("div[style*='background-color']", autoQuestDivs.tr);
                    if ($u.hasContent(background) && background.css("background-color") === 'rgb(158, 11, 15)') {
                        con.log(1, "Missing item");
                        if (config.getItem('QuestSubArea', 'Atlantis') === 'Atlantis') {
                            con.log(1, "Cant buy Atlantis items, stopping quest");
                            caap.manualAutoQuest();
                            return false;
                        }

                        con.log(2, "background.style.backgroundColor", background.css("background-color"));
                        state.setItem('storeRetrieve', 'general');
                        if (general.Select('BuyGeneral')) {
                            return true;
                        }

                        state.setItem('storeRetrieve', '');
                        con.log(2, "background.children().eq(0).children().eq(0).attr('title')", background.children().eq(0).children().eq(0).attr("title"));
                        if (background.children().eq(0).children().eq(0).attr("title")) {
                            con.log(2, "Clicking to buy", background.children().eq(0).children().eq(0).attr("title"));
                            caap.click(background.children().eq(0).children().eq(0));
                            return true;
                        }
                    }
                } else {
                    con.warn('Can not buy quest item');
                    return false;
                }

                var questGeneral = state.getItem('AutoQuest', caap.newAutoQuest())['general'];
                if (questGeneral === 'none' || config.getItem('ForceSubGeneral', false)) {
                    if (general.Select('SubQuestGeneral')) {
                        return true;
                    }
                } else if (questGeneral && questGeneral !== general.GetCurrent()) {
                    if (general.LevelUpCheck("QuestGeneral")) {
                        if (general.Select('LevelUpGeneral')) {
                            return true;
                        }

                        con.log(2, 'Using level up general');
                    } else {
                        if ($u.hasContent(autoQuestDivs.genDiv)) {
                            con.log(2, 'Clicking on general', questGeneral);
                            caap.click(autoQuestDivs.genDiv);
                            caap.clearDomWaiting();
                            return true;
                        } else {
                            con.warn('Can not click on general', questGeneral);
                            return false;
                        }
                    }
                }

                if ($u.hasContent(autoQuestDivs.click)) {
                    con.log(2, 'Clicking auto quest', autoQuestName);
                    session.setItem('ReleaseControl', true);
                    caap.click(autoQuestDivs.click);
                    caap.showAutoQuest();
                    if (autoQuestDivs.orbCheck) {
                        schedule.setItem("magic", 0);
                    }

                    return true;
                } else {
                    con.warn('Can not click auto quest', autoQuestName);
                    return false;
                }
            } catch (err) {
                con.error("ERROR in quests: " + err);
                return false;
            }
        },

        questName: null,

        checkResults_symbolquests: function () {
            try {
                $j("div[id*='symbol_tab_symbolquests']", caap.appBodyDiv).unbind('click', caap.symbolquestsListener).bind('click', caap.symbolquestsListener);
                $j("form[id*='symbols_form_']", caap.appBodyDiv).unbind('click', caap.symbolquestsClickListener).bind('click', caap.symbolquestsClickListener);
                var demiDiv = $j("div[id*='symbol_desc_symbolquests']", caap.globalContainer),
                    points  = [],
                    success = true;

                caap.blessingResults();
                if ($u.hasContent(demiDiv) && demiDiv.length === 5) {
                    demiDiv.each(function () {
                        var num = $u.setContent($j(this).children().next().eq(1).children().children().next().text(), '').trim().innerTrim().regex(/(\d+)/);
                        if ($u.hasContent(num) && !$u.isNaN(num)) {
                            points.push(num);
                        } else {
                            success = false;
                            con.warn('Demi-Power text problem');
                        }
                    });

                    if (success) {
                        con.log(3, 'Demi-Power Points', points);
                        caap.demi['ambrosia']['power']['total'] = $u.setContent(points[0], 0);
                        caap.demi['malekus']['power']['total'] = $u.setContent(points[1], 0);
                        caap.demi['corvintheus']['power']['total'] = $u.setContent(points[2], 0);
                        caap.demi['aurora']['power']['total'] = $u.setContent(points[3], 0);
                        caap.demi['azeron']['power']['total'] = $u.setContent(points[4], 0);
                        schedule.setItem("symbolquests", (gm ? gm.getItem("checkSymbolQuests", 24, hiddenVar) : 24) * 3600, 300);
                        caap.SaveDemi();
                    }
                } else {
                    con.warn("Demi demiDiv problem", demiDiv);
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_symbolquests: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        isBossQuest: function (name) {
            try {
                var qn    = '',
                    found = false;

                for (qn in caap.questAreaInfo) {
                    if (caap.questAreaInfo.hasOwnProperty(qn)) {
                        if (caap.questAreaInfo[qn].boss && caap.questAreaInfo[qn].boss === name) {
                            found = true;
                            break;
                        }
                    }
                }

                return found;
            } catch (err) {
                con.error("ERROR in isBossQuest: " + err);
                return false;
            }
        },

        symbolquestsListener: function (event) {
            con.log(2, "Clicked Demi Power image", event.target.parentNode.parentNode.parentNode.parentNode.id);
            caap.setDomWaiting("symbolquests.php");
            caap.clearDomWaiting();
            caap.checkResults();
        },

        symbolquestsClickListener: function (event) {
            con.log(2, "Clicked Demi Power blessing", event.target.parentNode.id);
            caap.setDomWaiting("symbolquests.php");
            caap.blessingPerformed = true;
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_quests: function (pickQuestTF) {
            try {
                army.eliteCheckImg();
                //con.log(1, "checkResults_quests pickQuestTF", pickQuestTF);
                pickQuestTF = pickQuestTF ? pickQuestTF : false;
                if ($u.hasContent($j("#" + caap.domain.id[caap.domain.which] + "quest_map_container", caap.globalContainer))) {
                    $j("div[id*='meta_quest_']", caap.appBodyDiv).each(function (index) {
                        var row = $j(this);
                        if (!($u.hasContent($j("img[src*='_completed']", row)) || $u.hasContent($j("img[src*='_locked']", row)))) {
                            $j("div[id*='quest_wrapper_" + row.attr("id").replace(caap.domain.id[caap.domain.which] + "meta_quest_", '') + "']", caap.globalContainer).css("display", "block");
                        }
                    });
                }

                if (config.getItem("enableTitles", true)) {
                    spreadsheet.doTitles();
                }

                var whyQuest = config.getItem('WhyQuest', 'Manual');
                if (pickQuestTF === true && whyQuest !== 'Manual') {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                }

                var bestReward  = 0,
                    rewardRatio = 0,
                    div         = $j(),
                    ssDiv       = $j();

                if (caap.hasImage('demi_quest_on.gif')) {
                    caap.checkResults_symbolquests($u.isString(pickQuestTF) ? pickQuestTF : undefined);
                    ssDiv = $j("div[id*='symbol_displaysymbolquest']", caap.globalContainer);
                    if (!$u.hasContent(ssDiv)) {
                        con.warn("Failed to find symbol_displaysymbolquest");
                    }

                    ssDiv.each(function () {
                        div = $j(this);
                        if (div.css("display") !== 'none') {
                            return false;
                        }

                        return true;
                    });
                } else {
                    div = caap.globalContainer;
                }

                ssDiv = $j(".quests_background,.quests_background_sub", div);
                if (!$u.hasContent(ssDiv)) {
                    con.warn("Failed to find quests_background");
                    return false;
                }

                var haveOrb      = false,
                    isTheArea    = false,
                    questSubArea = '';

                questSubArea = config.getItem('QuestSubArea', 'Land of Fire');
                isTheArea = caap.checkCurrentQuestArea(questSubArea);
                con.log(2, "Is quest area", questSubArea, isTheArea);
                if (isTheArea && whyQuest !== 'Manual' && config.getItem('GetOrbs', false)) {
                    if ($u.hasContent($j("input[alt='Perform Alchemy']"))) {
                        haveOrb = true;
                    } else {
                        if (questSubArea && caap.questAreaInfo[questSubArea].orb) {
                            haveOrb = town.haveOrb(caap.questAreaInfo[questSubArea].orb);
                        }
                    }

                    con.log(2, "Have Orb for", questSubArea, haveOrb);
                    if (haveOrb && caap.isBossQuest(state.getItem('AutoQuest', caap.newAutoQuest())['name'])) {
                        state.setItem('AutoQuest', caap.newAutoQuest());
                    }
                }

                var autoQuestDivs = {
                    name     : '',
                    click    : $j(),
                    tr       : $j(),
                    genDiv   : $j(),
                    orbCheck : false
                };

                $j(".autoquest", caap.appBodyDiv).remove();
                var expRegExp       = new RegExp("\\+(\\d+)"),
                    energyRegExp    = new RegExp("(\\d+)\\s+energy", "i"),
                    moneyRegExp     = new RegExp("\\$([0-9,]+)\\s*-\\s*\\$([0-9,]+)", "i"),
                    money2RegExp    = new RegExp("\\$([0-9,]+)mil\\s*-\\s*\\$([0-9,]+)mil", "i"),
                    influenceRegExp = new RegExp("(\\d+)%");

                ssDiv.each(function () {
                    div = $j(this);
                    caap.questName = caap.getQuestName(div);
                    if (!caap.questName) {
                        return true;
                    }

                    var reward     = null,
                        energy     = null,
                        experience = null,
                        divTxt     = '',
                        expM       = [],
                        tStr       = '';

                    divTxt = div.text().trim().innerTrim();
                    expM = divTxt ? divTxt.match(expRegExp) : [];
                    if (expM && expM.length === 2) {
                        experience = expM[1] ? expM[1].numberOnly() : 0;
                    } else {
                        var expObj = $j(".quest_experience", div);
                        if ($u.hasContent(expObj)) {
                            tStr = expObj.text();
                            experience = tStr ? tStr.numberOnly() : 0;
                        } else {
                            con.warn("Can't find experience for", caap.questName);
                        }
                    }

                    var idx = caap.questName.indexOf('<br>');
                    if (idx >= 0) {
                        caap.questName = caap.questName.substring(0, idx);
                    }

                    var energyM = divTxt.match(energyRegExp);
                    if (energyM && energyM.length === 2) {
                        energy = energyM[1] ? energyM[1].numberOnly() : 0;
                    } else {
                        var eObj = $j(".quest_req", div);
                        if ($u.hasContent(eObj)) {
                            energy = $j('b', eObj).eq(0).text().numberOnly();
                        }
                    }

                    if (!energy) {
                        con.warn("Can't find energy for", caap.questName);
                        return true;
                    }

                    var moneyM     = [],
                        rewardLow  = 0,
                        rewardHigh = 0;

                    moneyM = divTxt ? divTxt.stripHtmlJunk().match(moneyRegExp) : [];
                    if (moneyM && moneyM.length === 3) {
                        rewardLow  = moneyM[1] ? moneyM[1].numberOnly() : 0;
                        rewardHigh = moneyM[2] ? moneyM[2].numberOnly() : 0;
                        reward = (rewardLow + rewardHigh) / 2;
                    } else {
                        moneyM = divTxt ? divTxt.stripHtmlJunk().match(money2RegExp) : [];
                        if (moneyM && moneyM.length === 3) {
                            rewardLow  = moneyM[1] ? moneyM[1].numberOnly() * 1000000 : 0;
                            rewardHigh = moneyM[2] ? moneyM[2].numberOnly() * 1000000 : 0;
                            reward = (rewardLow + rewardHigh) / 2;
                        } else {
                            con.warn('No money found for', caap.questName, divTxt);
                        }
                    }

                    var click = $j("input[name='Do Quest']", div);
                    if (!$u.hasContent(click)) {
                        con.warn('No button found for', caap.questName);
                        return true;
                    }

                    var influence = -1;
                    if (caap.isBossQuest(caap.questName)) {
                        if ($u.hasContent($j(".quests_background_sub", div))) {
                            //if boss and found sub quests
                            influence = 100;
                        } else {
                            influence = 0;
                        }
                    } else {
                        var influenceList = divTxt.match(influenceRegExp);
                        if (influenceList && influenceList.length === 2) {
                            influence = influenceList[1] ? influenceList[1].parseInt() : 0;
                        } else {
                            con.warn("Influence div not found.", influenceList);
                        }
                    }

                    if (influence < 0) {
                        con.warn('No influence found for', caap.questName, divTxt);
                    }

                    var general = 'none',
                        genDiv  = $j();

                    if (influence >= 0 && influence < 100) {
                        genDiv = $j(".quest_act_gen", div);
                        if ($u.hasContent(genDiv)) {
                            genDiv = $j("img[src*='jpg']", genDiv);
                            if ($u.hasContent(genDiv)) {
                                general = genDiv.attr("title");
                            }
                        }
                    }

                    var questType = 'subquest';
                    if (div.attr("class") === 'quests_background') {
                        questType = 'primary';
                    } else if (div.attr("class") === 'quests_background_special') {
                        questType = 'boss';
                    }

                    caap.labelQuests(div, energy, reward, experience, click);
                    con.log(9, "QuestSubArea", questSubArea);
                    if (isTheArea) {
                        if (config.getItem('GetOrbs', false) && questType === 'boss' && whyQuest !== 'Manual' && !haveOrb) {
                            caap.updateAutoQuest('name', caap.questName);
                            pickQuestTF = true;
                            autoQuestDivs.orbCheck = true;
                        }

                        switch (whyQuest) {
                        case 'Advancement' :
                            if (influence >= 0) {
                                if (!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && questType === 'primary' && influence < 100) {
                                    caap.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Influence' :
                            if (influence >= 0) {
                                if (!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && influence < 100) {
                                    caap.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Experience' :
                            rewardRatio = (Math.floor(experience / energy * 100) / 100);
                            if (bestReward < rewardRatio) {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        case 'Max Gold' :
                            rewardRatio = (Math.floor(reward / energy * 10) / 10);
                            if (bestReward < rewardRatio) {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        default :
                        }

                        if (isTheArea && state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
                            bestReward = rewardRatio;
                            var expRatio = experience / (energy ? energy : 1);
                            con.log(2, "Setting AutoQuest", caap.questName);
                            var tempAutoQuest = caap.newAutoQuest();
                            tempAutoQuest['name'] = caap.questName;
                            tempAutoQuest['energy'] = energy;
                            tempAutoQuest['general'] = general;
                            tempAutoQuest['expRatio'] = expRatio;
                            state.setItem('AutoQuest', tempAutoQuest);
                            con.log(4, "checkResults_quests", state.getItem('AutoQuest', caap.newAutoQuest()));
                            caap.showAutoQuest();
                            autoQuestDivs.name = caap.questName;
                            autoQuestDivs.click = click;
                            autoQuestDivs.tr = div;
                            autoQuestDivs.genDiv = genDiv;
                        }
                    }

                    //con.log(1, "End of run");
                    return true;
                });

                con.log(4, "pickQuestTF", pickQuestTF);
                if (pickQuestTF) {
                    if (state.getItem('AutoQuest', caap.newAutoQuest())['name']) {
                        con.log(4, "return autoQuestDivs", autoQuestDivs);
                        caap.showAutoQuest();
                        return autoQuestDivs;
                    }

                    //if not find quest, probably you already maxed the subarea, try another area
                    if ((whyQuest === 'Max Influence' || whyQuest === 'Advancement') && config.getItem('switchQuestArea', true)) {
                        con.log(9, "QuestSubArea", questSubArea);
                        if (questSubArea && caap.questAreaInfo[questSubArea] && caap.questAreaInfo[questSubArea].next) {
                            questSubArea = config.setItem('QuestSubArea', caap.questAreaInfo[questSubArea].next);
                            if (caap.questAreaInfo[questSubArea].area && caap.questAreaInfo[questSubArea].list) {
                                config.setItem('QuestArea', caap.questAreaInfo[questSubArea].area);
                                caap.changeDropDownList('QuestSubArea', caap[caap.questAreaInfo[questSubArea].list]);
                            }
                        } else {
                            con.log(1, "Setting questing to manual");
                            caap.manualAutoQuest();
                        }

                        con.log(2, "UpdateQuestGUI: Setting drop down menus");
                        caap.selectDropOption('QuestArea', config.getItem('QuestArea', 'Quest'));
                        caap.selectDropOption('QuestSubArea', questSubArea);
                        return false;
                    }

                    con.log(1, "Finished QuestArea.");
                    caap.manualAutoQuest();
                }

                return false;
            } catch (err) {
                con.error("ERROR in checkResults_quests: " + err);
                caap.manualAutoQuest();
                return false;
            }
        },

        classToQuestArea: {
            'quests_stage_1'         : 'Land of Fire',
            'quests_stage_2'         : 'Land of Earth',
            'quests_stage_3'         : 'Land of Mist',
            'quests_stage_4'         : 'Land of Water',
            'quests_stage_5'         : 'Demon Realm',
            'quests_stage_6'         : 'Undead Realm',
            'quests_stage_7'         : 'Underworld',
            'quests_stage_8'         : 'Kingdom of Heaven',
            'quests_stage_9'         : 'Ivory City',
            'quests_stage_10'        : 'Earth II',
            'quests_stage_11'        : 'Water II',
            'quests_stage_12'        : 'Mist II',
            'quests_stage_13'        : 'Mist III',
            'quests_stage_14'        : 'Fire II',
            'symbolquests_stage_1'   : 'Ambrosia',
            'symbolquests_stage_2'   : 'Malekus',
            'symbolquests_stage_3'   : 'Corvintheus',
            'symbolquests_stage_4'   : 'Aurora',
            'symbolquests_stage_5'   : 'Azeron',
            'monster_quests_stage_1' : 'Atlantis'
        },

        checkCurrentQuestArea: function (QuestSubArea) {
            try {
                var found = false;

                if (caap.stats['level'] < 8) {
                    if (caap.hasImage('quest_back_1.jpg')) {
                        found = true;
                    }
                } else if (QuestSubArea && caap.questAreaInfo[QuestSubArea]) {
                    if ($u.hasContent($j("div[class='" + caap.questAreaInfo[QuestSubArea].clas + "']", caap.globalContainer))) {
                        found = true;
                    }
                }

                return found;
            } catch (err) {
                con.error("ERROR in checkCurrentQuestArea: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        getQuestName: function (questDiv) {
            try {
                var item_title = $j(".quest_desc,.quest_sub_title", questDiv),
                    firstb     = $j("b", item_title).eq(0),
                    text       = '';

                if (!$u.hasContent(item_title)) {
                    con.log(2, "Can't find quest description or sub-title");
                    return false;
                }

                text = item_title.html().trim().innerTrim();
                if (/LOCK/.test(text) || /boss_locked/.test(text)) {
                    con.log(2, "Quest locked", text);
                    return false;
                }

                if (!$u.hasContent(firstb)) {
                    con.warn("Can't get bolded member out of", text);
                    return false;
                }

                caap.questName = firstb.text().trim().innerTrim();
                if (!$u.hasContent(caap.questName)) {
                    con.warn('No quest name for this row');
                    return false;
                }

                return caap.questName;
            } catch (err) {
                con.error("ERROR in getQuestName: " + err);
                return false;
            }
        },

        /*------------------------------------------------------------------------------------\
        checkEnergy gets passed the default energy requirement plus the condition text from
        the 'Whenxxxxx' setting and the message div name.
        \------------------------------------------------------------------------------------*/
        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkEnergy: function (energy, condition, msgdiv) {
            try {
                if (!caap.stats['energy'] || !energy) {
                    return false;
                }

                if (condition === 'Energy Available' || condition === 'Not Fortifying') {
                    if (caap.stats['energy']['num'] >= energy) {
                        return true;
                    }

                    if (msgdiv) {
                        if (msgdiv === "quest_mess") {
                            window.clearTimeout(caap.qtom);
                        }

                        caap.setDivContent(msgdiv, 'Waiting for more energy: ' + caap.stats['energy']['num'] + "/" + (energy ? energy : ""));
                    }
                } else if (condition === 'At X Energy') {
                    if (caap.inLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                        if (msgdiv) {
                            if (msgdiv === "quest_mess") {
                                window.clearTimeout(caap.qtom);
                            }

                            caap.setDivContent(msgdiv, 'Burning all energy to level up');
                        }

                        return true;
                    }

                    var whichEnergy = config.getItem('XQuestEnergy', 1);
                    if (caap.stats['energy']['num'] >= whichEnergy) {
                        state.setItem('AtXQuestEnergy', true);
                    }

                    if (caap.stats['energy']['num'] >= energy) {
                        if (state.getItem('AtXQuestEnergy', false) && caap.stats['energy']['num'] >= config.getItem('XMinQuestEnergy', 0)) {
                            if (msgdiv) {
                                if (msgdiv === "quest_mess") {
                                    window.clearTimeout(caap.qtom);
                                }

                                caap.setDivContent(msgdiv, 'At X energy. Burning to ' + config.getItem('XMinQuestEnergy', 0));
                            }

                            return true;
                        } else {
                            state.setItem('AtXQuestEnergy', false);
                        }
                    }

                    if (energy > whichEnergy) {
                        whichEnergy = energy;
                    }

                    if (msgdiv) {
                        if (msgdiv === "quest_mess") {
                            window.clearTimeout(caap.qtom);
                        }

                        caap.setDivContent(msgdiv, 'Waiting for X energy: ' + caap.stats['energy']['num'] + "/" + whichEnergy);
                    }
                } else if (condition === 'At Max Energy') {
                    var maxIdleEnergy = caap.stats['energy']['max'],
                        theGeneral = config.getItem('IdleGeneral', 'Use Current');

                    if (theGeneral !== 'Use Current') {
                        maxIdleEnergy = general.GetEnergyMax(theGeneral);
                    }

                    if (theGeneral !== 'Use Current' && !maxIdleEnergy) {
                        con.log(2, "Changing to idle general to get Max energy");
                        if (general.Select('IdleGeneral')) {
                            return true;
                        }
                    }

                    if (caap.stats['energy']['num'] >= maxIdleEnergy) {
                        return true;
                    }

                    if (caap.inLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                        if (msgdiv) {
                            if (msgdiv === "quest_mess") {
                                window.clearTimeout(caap.qtom);
                            }

                            con.log(1, "Burning all energy to level up");
                            caap.setDivContent(msgdiv, 'Burning all energy to level up');
                        }

                        return true;
                    }

                    if (msgdiv) {
                        if (msgdiv === "quest_mess") {
                            window.clearTimeout(caap.qtom);
                        }

                        caap.setDivContent(msgdiv, 'Waiting for max energy: ' + caap.stats['energy']['num'] + "/" + maxIdleEnergy);
                    }
                }

                return false;
            } catch (err) {
                con.error("ERROR in checkEnergy: " + err);
                return false;
            }
        },

        labelListener: function (e) {
            try {
                var sps           = e.target.getElementsByTagName('span'),
                    mainDiv       = $j("#" + caap.domain.id[caap.domain.which] + "main_bn", caap.globalContainer),
                    className     = '',
                    tempAutoQuest = {};

                if (sps.length <= 0) {
                    throw 'what did we click on?';
                }

                tempAutoQuest = caap.newAutoQuest();
                tempAutoQuest['name'] = sps[0].innerHTML;
                tempAutoQuest['energy'] = sps[1].innerHTML.parseInt();
                //tempAutoQuest['general'] = general;
                //tempAutoQuest['expRatio'] = expRatio;

                caap.manualAutoQuest(tempAutoQuest);
                con.log(5, 'labelListener', sps, state.getItem('AutoQuest'));
                if (caap.stats['level'] < 8 && caap.hasImage('quest_back_1.jpg')) {
                    config.setItem('QuestArea', 'Quest');
                    config.setItem('QuestSubArea', 'Land of Fire');
                } else {
                    if (caap.hasImage('tab_quest_on.gif')) {
                        config.setItem('QuestArea', 'Quest');
                        caap.selectDropOption('QuestArea', 'Quest');
                        caap.changeDropDownList('QuestSubArea', caap.landQuestList);
                    } else if (caap.hasImage('demi_quest_on.gif')) {
                        config.setItem('QuestArea', 'Demi Quests');
                        caap.selectDropOption('QuestArea', 'Demi Quests');
                        caap.changeDropDownList('QuestSubArea', caap.demiQuestList);
                    } else if (caap.hasImage('tab_atlantis_on.gif')) {
                        config.setItem('QuestArea', 'Atlantis');
                        caap.selectDropOption('QuestArea', 'Atlantis');
                        caap.changeDropDownList('QuestSubArea', caap.atlantisQuestList);
                    }

                    if ($u.hasContent(mainDiv)) {
                        className = mainDiv.attr("class");
                        if ($u.hasContent(className) && caap.classToQuestArea[className]) {
                            config.setItem('QuestSubArea', caap.classToQuestArea[className]);
                        }
                    }
                }

                con.log(1, 'Setting QuestSubArea to', config.getItem('QuestSubArea', 'Land Of Fire'));
                caap.selectDropOption('QuestSubArea', config.getItem('QuestSubArea', 'Land Of Fire'));
                caap.showAutoQuest();
                caap.checkResults_quests();
                return true;
            } catch (err) {
                con.error("ERROR in labelListener: " + err);
                return false;
            }
        },

        labelQuests: function (div, energy, reward, experience, click) {
            try {
                if ($u.hasContent($j("div[class='autoquest']", div))) {
                    return;
                }

                var newdiv = {};
                newdiv = document.createElement('div');
                newdiv.className = 'autoquest';
                newdiv.style.fontSize = '10px';
                newdiv.innerHTML = "$ per energy: " + (Math.floor(reward / energy * 10) / 10) +
                    "<br />Exp per energy: " + (Math.floor(experience / energy * 100) / 100) + "<br />";

                if (state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
                    var b = document.createElement('b');
                    b.innerHTML = "Current auto quest";
                    newdiv.appendChild(b);
                } else {
                    var setAutoQuest = document.createElement('a');
                    setAutoQuest.innerHTML = 'Auto run this quest.';
                    setAutoQuest.quest_name = caap.questName;

                    var quest_nameObj = document.createElement('span');
                    quest_nameObj.innerHTML = caap.questName;
                    quest_nameObj.style.display = 'none';
                    setAutoQuest.appendChild(quest_nameObj);

                    var quest_energyObj = document.createElement('span');
                    quest_energyObj.innerHTML = energy;
                    quest_energyObj.style.display = 'none';
                    setAutoQuest.appendChild(quest_energyObj);
                    $u.addEvent(setAutoQuest, "click", caap.labelListener);

                    newdiv.appendChild(setAutoQuest);
                }

                newdiv.style.position = 'absolute';
                newdiv.style.background = '#B09060';
                newdiv.style.right = "144px";
                click.parent().before(newdiv);
            } catch (err) {
                con.error("ERROR in labelQuests: " + err);
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          AUTO BLESSING
        /////////////////////////////////////////////////////////////////////

        deityTable: {
            'energy'  : 1,
            'attack'  : 2,
            'defense' : 3,
            'health'  : 4,
            'stamina' : 5
        },
        /*jslint sub: false */

        blessingPerformed: false,

        blessingResults: function () {
            try {
                var hours   = 0,
                    minutes = 0,
                    done    = false;

                if (caap.blessingPerformed) {
                    if (/Please come back in:/i.test(caap.resultsText)) {
                        // Check time until next Oracle Blessing
                        hours = $u.setContent(caap.resultsText.regex(/(\d+) hour/i), 3);
                        minutes = $u.setContent(caap.resultsText.regex(/(\d+) minute/i), 0);
                        done = true;
                    } else if (/You have paid tribute to/i.test(caap.resultsText)) {
                        // Recieved Demi Blessing.  Wait X hours to try again.
                        hours = /Azeron/i.test(caap.resultsText) ? 48 : 24;
                        done = true;
                    } else {
                        if ($u.hasContent(caap.resultsText)) {
                            con.warn("Unknown blessing result text", caap.resultsText);
                        }
                    }

                    if (done) {
                        con.log(2, 'Recorded Blessing Time. Scheduling next click! ' + hours + ':' + minutes.lpad("0", 2));
                        schedule.setItem('BlessingTimer', (hours * 60 + minutes + 5) * 60, 300);
                    }

                    caap.blessingPerformed = false;
                }
            } catch (err) {
                con.error("ERROR in blessingResults: " + err);
            }
        },

        autoBless: function () {
            try {
                if (caap.blessingPerformed) {
                    return true;
                }

                var autoBless  = config.getItem('AutoBless', 'none'),
                    autoBlessN = caap.deityTable[autoBless.toLowerCase()],
                    picSlice   = $j(),
                    descSlice  = $j();

                if (!$u.hasContent(autoBlessN) || !schedule.check('BlessingTimer')) {
                    return false;
                }

                if (caap.navigateTo('quests,demi_quest_off', 'demi_quest_bless')) {
                    return true;
                }

                picSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_image_symbolquests" + autoBlessN, caap.appBodyDiv);
                if (!$u.hasContent(picSlice)) {
                    con.warn('No diety image for', autoBless);
                    return false;
                }

                descSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_desc_symbolquests" + autoBlessN, caap.appBodyDiv);
                if (!$u.hasContent(descSlice)) {
                    con.warn('No diety description for', autoBless);
                    return false;
                }

                if (descSlice.css('display') === 'none') {
                    return caap.navigateTo(picSlice.attr("src").basename());
                }

                picSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbols_form_" + autoBlessN + " input[name='symbolsubmit']", descSlice);
                if (!$u.hasContent(picSlice)) {
                    con.warn('No image for deity blessing', autoBless);
                    return false;
                }

                con.log(1, 'Click deity blessing for', autoBless, autoBlessN);
                schedule.setItem('BlessingTimer', 300, 300);
                caap.blessingPerformed = true;
                caap.click(picSlice);
                return true;
            } catch (err) {
                con.error("ERROR in autoBless: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          FESTIVAL BLESSING
        /////////////////////////////////////////////////////////////////////

        checkResults_festival_tower:  function () {
            try {
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_festival_tower: " + err);
                return false;
            }
        },

        festivalBlessTable: {
            'attack'  : 'defense',
            'defense' : 'energy',
            'energy'  : 'stamina',
            'stamina' : 'health',
            'health'  : 'army',
            'army'    : 'attack'
        },

        festivalBlessGeneral: {
            'attack'  : 'DuelGeneral',
            'defense' : 'FortifyGeneral',
            'energy'  : 'IdleGeneral',
            'stamina' : 'IdleGeneral',
            'health'  : 'IdleGeneral',
            'army'    : 'InvadeGeneral'
        },
        /*jslint sub: false */

        festivalBlessResults: function () {
            try {
                var hours     = 0,
                    minutes   = 0,
                    tDiv      = $j(),
                    txt       = '',
                    autoBless = config.getItem('festivalBless', 'None');

                if (autoBless !== 'None') {
                    tDiv = $j("div[style*='festival_feats_bottom.jpg']", caap.globalContainer);
                    txt = $u.setContent(tDiv.text(), '').trim().innerTrim().regex(/(\d+:\d+)/);
                    if ($u.hasContent(txt)) {
                        // Check time until next Festival Blessing
                        hours = $u.setContent(txt.regex(/(\d+):/), 0);
                        minutes = $u.setContent(txt.regex(/:(\d+)/), 30);
                        con.log(2, 'Recorded Festival Blessing Time. Scheduling next click! ' + hours + ':' + minutes.lpad("0", 2));
                        schedule.setItem('festivalBlessTimer', (hours * 60 + minutes + 5) * 60, 300);
                    }

                    tDiv = $j("div[style*='festival_victory_popup.jpg']", caap.globalContainer);
                    if ($u.hasContent(tDiv)) {
                        con.log(1, "Festival Feat Victory!");
                    } else {
                        tDiv = $j("div[style*='festival_defeat_popup.jpg']", caap.globalContainer);
                        if ($u.hasContent(tDiv)) {
                            con.log(1, "Festival Feat Defeat!");
                            $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                        }
                    }
                }
            } catch (err) {
                con.error("ERROR in festivalBlessResults: " + err);
            }
        },

        festivalBless: function () {
            try {
                var autoBless  = config.getItem('festivalBless', 'None'),
                    capPic     = 'festival_capsule_' + autoBless.toLowerCase() + '.gif',
                    tgeneral   = caap.festivalBlessGeneral[autoBless.toLowerCase()],
                    luGeneral  = config.getItem('LevelUpGeneral', 'Use Current'),
                    picSlice   = $j(),
                    txt        = '';

                if (autoBless === 'None' || !schedule.check('festivalBlessTimer')) {
                    return false;
                }

                tgeneral = tgeneral === 'IdleGeneral' ? (luGeneral !== 'Use Current' ? 'LevelUpGeneral' : tgeneral) : tgeneral;
                if (general.Select(tgeneral)) {
                    return true;
                }

                if (caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav,' + capPic, 'festival_feats_bottom.jpg')) {
                    return true;
                }

                txt = $u.setContent($j("div[style*='festival_feats_middle.jpg'] strong", caap.appBodyDiv).text(), '').trim().innerTrim();
                if (/Mastered/i.test(txt)) {
                    con.log(1, 'Area Completed!', autoBless);
                    $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }

                if (!new RegExp(autoBless).test(txt)) {
                    con.warn('No match for text', autoBless);
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }

                picSlice = $j("img[src*='festival_feat_completedbutton.jpg']", caap.appBodyDiv);
                if ($u.hasContent(picSlice)) {
                    con.log(1, 'Area Completed!', autoBless);
                    $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }

                picSlice = $j("input[src*='festival_feat_testbutton.jpg']", caap.appBodyDiv);
                if (!$u.hasContent(picSlice)) {
                    con.warn('No blessing button', autoBless);
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }

                con.log(1, 'Click blessing button for', autoBless);
                schedule.setItem('festivalBlessTimer', 300, 300);
                caap.click(picSlice);
                return true;
            } catch (err) {
                con.error("ERROR in festivalBless: " + err);
                return false;
            }
        },

        checkResults_festival_duel_home: function () {
            var followerDiv = $j("#follower_list div", caap.appBodyDiv),
                followers = [],
                nfollowers = [],
                a = army.getIdList(),
                crossList = function (uid) {
                    return !followers.hasIndexOf(uid);
                };

            followerDiv.each(function () {
                var uid = $u.setContent($j(this).children().eq(0).attr("uid"), "").parseInt();
                if (uid) {
                    followers.push(uid);
                }
            });

            nfollowers = a.filter(crossList);
            session.setItem("followers", followers);
            session.setItem("nfollowers", nfollowers);
            sessionStorage.setItem("caap_nfollowers", JSON.stringify(nfollowers));
            con.log(1, "followers/non", followers, nfollowers);
        },

        ajax_festival_duel_home: function () {
            function onError(XMLHttpRequest, textStatus, errorThrown) {
                con.error("ajax_festival_duel_home", textStatus);
            }

            function onSuccess(data, textStatus, XMLHttpRequest) {
                var followerDiv = $j("#follower_list div", data),
                    followers = [],
                    nfollowers = [],
                    a = army.getIdList(),
                    crossList = function (uid) {
                        return !followers.hasIndexOf(uid);
                    };

                followerDiv.each(function () {
                    var uid = $u.setContent($j(this).children().eq(0).attr("uid"), "").parseInt();
                    if (uid) {
                        followers.push(uid);
                    }
                });

                nfollowers = a.filter(crossList);
                session.setItem("followers", followers);
                session.setItem("nfollowers", nfollowers);
                sessionStorage.setItem("caap_nfollowers", JSON.stringify(nfollowers));
                con.log(1, "followers/non", followers, nfollowers);
            }

            caap.ajax("festival_duel_home.php", null, onError, onSuccess);
        },

        /////////////////////////////////////////////////////////////////////
        //                          LAND
        // Displays return on lands and perfom auto purchasing
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        landRecord: function () {
            this.data = {
                'row'         : $j(),
                'name'        : '',
                'income'      : 0,
                'cost'        : 0,
                'totalCost'   : 0,
                'owned'       : 0,
                'maxAllowed'  : 0,
                'buy'         : 0,
                'roi'         : 0,
                'set'         : 0,
                'last'        : 0
            };
        },
        /*jslint sub: false */

        bestLand: {},

        sellLand: {},

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_land: function () {
            try {
                var ssDiv           = $j("div[style*='town_land_bar']", caap.appBodyDiv),
                    bestLandCost = {};

                if (!$u.hasContent(ssDiv)) {
                    con.warn("Can't find town_land_bar.jpg");
                    return false;
                }

                caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                caap.sellLand = {};

                function selectLands(div, val, type) {
                    try {
                        type = type ? type : 'Buy';
                        var selects = $j("select", div);
                        if (!$u.hasContent(selects)) {
                            con.warn(type + " select not found!");
                            return false;
                        }

                        if (type === "Buy") {
                            if (selects.length === 2) {
                                selects.eq(0).val(val);
                            }
                        } else {
                            selects.eq(0).val(val);
                        }

                        return true;
                    } catch (err) {
                        con.error("ERROR in selectLands: " + err);
                        return false;
                    }
                }

                ssDiv.each(function () {
                    var row          = $j(this),
                        strongs      = $j("strong", row),
                        name         = '',
                        income       = 0,
                        cost         = 0,
                        tStr         = '',
                        maxAllowed   = 0,
                        owned        = 0,
                        s            = 0,
                        roi          = 0,
                        selection    = [1, 5, 10],
                        land         = new caap.landRecord();

                    if (!$u.hasContent(row)) {
                        return true;
                    }

                    selectLands(row, 10);
                    if (!$u.hasContent(strongs) || strongs.length !== 3) {
                        con.warn("Can't find strongs", strongs.length);
                        return true;
                    }

                    name = strongs.eq(0).text().trim();
                    if (!$u.hasContent(name)) {
                        con.warn("Can't find land name");
                        return true;
                    }

                    income = strongs.eq(1).text().trim().numberOnly();
                    if (!$u.hasContent(income)) {
                        con.warn("Can't find land income");
                        return true;
                    }

                    cost = strongs.eq(2).text().trim().numberOnly();
                    if (!$u.hasContent(cost)) {
                        con.warn("Can't find land cost");
                        return true;
                    }

                    // Lets get our max allowed from the land_buy_info div
                    tStr = row.text().trim().innerTrim();
                    if (!$u.hasContent(tStr)) {
                        con.warn("Can't find land text");
                        return true;
                    }

                    maxAllowed = tStr.regex(/Max Allowed For your level: (\d+)/);
                    if (!$u.hasContent(maxAllowed)) {
                        con.warn("Can't find land maxAllowed");
                        return true;
                    }

                    owned = tStr.regex(/Owned: (\d+)/);
                    if (!$u.hasContent(owned)) {
                        con.warn("Can't find land owned");
                        return true;
                    }

                    land.data['row'] = row;
                    land.data['name'] = name;
                    land.data['income'] = income;
                    land.data['cost'] = cost;
                    land.data['maxAllowed'] = maxAllowed;
                    land.data['owned'] = owned;
                    land.data['buy'] = (maxAllowed - owned) > 10 ? 10 : maxAllowed - owned;
                    land.data['totalCost'] = land.data['buy'] * cost;
                    roi = (((income / cost) * 240000) / 100).dp(2);
                    if (!$u.hasContent($j("input[name='Buy']", row))) {
                        roi = 0;
                        // If we own more than allowed we will set land and selection
                        for (s = 2; s >= 0; s -= 1) {
                            if (land.data['owned'] - land.data['maxAllowed'] >= selection[s]) {
                                caap.sellLand = land.data;
                                selectLands(row, selection[s], 'Sell');
                                break;
                            }
                        }
                    }

                    land.data['roi'] = $u.setContent(roi, 0);
                    strongs.eq(0).text(name + " | " + land.data['roi'] + "% per day.");
                    con.log(4, "Land:", land.data['name']);
                    if (land.data['roi'] > 0 && land.data['roi'] > caap.bestLand['roi']) {
                        con.log(4, "Set Land:", land.data['name'], land.data);
                        caap.bestLand = $j.extend(true, {}, land.data);
                    }

                    return true;
                });

                $j.extend(true, bestLandCost, caap.bestLand);
                delete bestLandCost['row'];
                bestLandCost['set'] = true;
                bestLandCost['last'] = Date.now();
                state.setItem('BestLandCost', bestLandCost);
                con.log(2, "Best Land Cost: ", bestLandCost['name'], bestLandCost['cost'], bestLandCost);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_land: " + err);
                return false;
            }
        },

        noLandsLog: true,

        lands: function () {
            try {
                if (!config.getItem('autoBuyLand', false)) {
                    return false;
                }

                var bestLandCost = {},
                    cashTotAvail = 0,
                    cashNeed     = 0,
                    theGeneral   = '';

                function buySellLand(land, type) {
                    try {
                        type = type ? type : 'Buy';
                        var button = $j("input[name='" + type + "']", land['row']);
                        if ($u.hasContent(button)) {
                            if (type === 'Buy') {
                                caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
                            } else {
                                caap.sellLand = {};
                            }

                            caap.click(button, 15000);
                            return true;
                        } else {
                            con.warn(type + " button not found!");
                            return false;
                        }
                    } catch (err) {
                        con.error("ERROR in buySellLand: " + err);
                        return false;
                    }
                }

                // Do we have lands above our max to sell?
                if (!$j.isEmptyObject(caap.sellLand) && config.getItem('SellLands', false)) {
                    con.log(2, "Selling land", caap.sellLand['name']);
                    buySellLand(caap.sellLand, 'Sell');
                    return true;
                }

                bestLandCost = state.getItem('BestLandCost', new caap.landRecord().data);
                if (!bestLandCost['set']) {
                    con.log(2, "Going to land to get Best Land Cost");
                    if (caap.navigateTo('soldiers,land', caap.hasImage('tab_land_on.gif') ? '' : 'tab_land_on.gif')) {
                        return true;
                    }
                }

                if (bestLandCost['cost'] === 0) {
                    if (caap.noLandsLog) {
                        con.log(2, "No lands to purchase");
                        caap.noLandsLog = false;
                    }

                    return false;
                }

                if (!caap.stats['gold']['bank'] && caap.stats['gold']['bank'] !== 0) {
                    con.log(2, "Going to keep to get Stored Value");
                    if (caap.navigateTo('keep')) {
                        return true;
                    }
                }

                // Retrieving from Bank
                cashTotAvail = caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0));
                cashNeed = bestLandCost['buy'] * bestLandCost['cost'];
                theGeneral = config.getItem('IdleGeneral', 'Use Current');
                if ((cashTotAvail >= cashNeed) && (caap.stats['gold']['cash'] < cashNeed)) {
                    if (theGeneral !== 'Use Current') {
                        con.log(2, "Changing to idle general");
                        if (general.Select('IdleGeneral')) {
                            return true;
                        }
                    }

                    con.log(2, "Trying to retrieve", cashNeed - caap.stats['gold']['cash']);
                    return caap.retrieveFromBank(cashNeed - caap.stats['gold']['cash']);
                }

                // Need to check for enough moneys + do we have enough of the builton type that we already own.
                if (bestLandCost['cost'] && caap.stats['gold']['cash'] >= cashNeed) {
                    if (theGeneral !== 'Use Current') {
                        con.log(2, "Changing to idle general");
                        if (general.Select('IdleGeneral')) {
                            return true;
                        }
                    }

                    caap.navigateTo('soldiers,land');
                    if (caap.hasImage('tab_land_on.gif')) {
                        if (bestLandCost['buy']) {
                            con.log(2, "Buying land", caap.bestLand['name']);
                            if (buySellLand(caap.bestLand)) {
                                return true;
                            }
                        }
                    } else {
                        return caap.navigateTo('soldiers,land');
                    }
                }

                return false;
            } catch (err) {
                con.error("ERROR in lands: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          CHECKS
        /////////////////////////////////////////////////////////////////////

        checkKeep: function () {
            try {
                if (!schedule.check("keep")) {
                    return false;
                }

                con.log(2, 'Visiting keep to get stats');
                return caap.navigateTo('keep', 'tab_stats_on.gif');
            } catch (err) {
                con.error("ERROR in checkKeep: " + err);
                return false;
            }
        },

        checkOracle: function () {
            try {
                if (!schedule.check("oracle")) {
                    return false;
                }

                con.log(2, "Checking Oracle for Favor Points");
                return caap.navigateTo('oracle', 'oracle_on.gif');
            } catch (err) {
                con.error("ERROR in checkOracle: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkBattleRank: function () {
            try {
                if (!schedule.check("battlerank") || caap.stats['level'] < 8) {
                    return false;
                }

                con.log(2, 'Visiting Battle Rank to get stats');
                return caap.navigateTo('battle,battlerank', 'tab_battle_rank_on.gif');
            } catch (err) {
                con.error("ERROR in checkBattleRank: " + err);
                return false;
            }
        },

        checkWarRank: function () {
            try {
                if (!schedule.check("warrank") || caap.stats['level'] < 100) {
                    return false;
                }

                con.log(2, 'Visiting War Rank to get stats');
                return caap.navigateTo('battle,war_rank', 'tab_war_on.gif');
            } catch (err) {
                con.error("ERROR in CheckWar: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        checkGenerals: function () {
            try {
                if (!schedule.check("generals")) {
                    return false;
                }

                con.log(2, "Visiting generals to get 'General' list");
                return caap.navigateTo('mercenary,generals', 'tab_generals_on.gif');
            } catch (err) {
                con.error("ERROR in checkGenerals: " + err);
                return false;
            }
        },

        checkAllGenerals: function () {
            try {
                if (!schedule.check("allGenerals")) {
                    return false;
                }

                return general.GetAllStats();
            } catch (err) {
                con.error("ERROR in checkAllGenerals: " + err);
                return false;
            }
        },

        checkSoldiers: function () {
            try {
                if (!schedule.check("soldiers")) {
                    return false;
                }

                con.log(2, "Checking Soldiers");
                return caap.navigateTo('soldiers', 'tab_soldiers_on.gif');
            } catch (err) {
                con.error("ERROR in checkSoldiers: " + err);
                return false;
            }
        },


        checkItem: function () {
            try {
                if (!schedule.check("item")) {
                    return false;
                }

                con.log(2, "Checking Item");
                return caap.navigateTo('soldiers,item', 'tab_black_smith_on.gif');
            } catch (err) {
                con.error("ERROR in checkItem: " + err);
                return false;
            }
        },

        checkMagic: function () {
            try {
                if (!schedule.check("magic")) {
                    return false;
                }

                con.log(2, "Checking Magic");
                return caap.navigateTo('soldiers,magic', 'tab_magic_on.gif');
            } catch (err) {
                con.error("ERROR in checkMagic: " + err);
                return false;
            }
        },

        checkAchievements: function () {
            try {
                if (!schedule.check("achievements")) {
                    return false;
                }

                con.log(2, 'Visiting achievements to get stats');
                return caap.navigateTo('keep,achievements', 'tab_achievements_on.gif');
            } catch (err) {
                con.error("ERROR in checkAchievements: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkSymbolQuests: function () {
            try {
                if (!schedule.check("symbolquests") || caap.stats['level'] < 8) {
                    return false;
                }

                con.log(2, "Visiting symbolquests to get 'Demi-Power' points");
                return caap.navigateTo('quests,symbolquests', 'demi_quest_on.gif');
            } catch (err) {
                con.error("ERROR in checkSymbolQuests: " + err);
                return false;
            }
        },

        checkCharacterClasses: function () {
            try {
                if (!schedule.check("characterClasses") || caap.stats['level'] < 100) {
                    return false;
                }

                con.log(2, "Checking Monster Class to get Character Class Stats");
                return caap.navigateTo('keep,battle_monster,view_class_progress', 'nm_class_whole_progress_bar.jpg');
            } catch (err) {
                con.error("ERROR in checkCharacterClasses: " + err);
                return false;
            }
        },

        checkArmy: function () {
            try {
                if (!config.getItem("EnableArmy", true) || !schedule.check("army_member")) {
                    return false;
                }

                return army.run();
            } catch (err) {
                con.error("ERROR in checkArmy: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        checkGift: function () {
            try {
                if (!schedule.check("gift")) {
                    return false;
                }

                con.log(2, "Checking Gift");
                return caap.navigateTo('army,gift', 'tab_gifts_on.gif');
            } catch (err) {
                con.error("ERROR in checkGift: " + err);
                return false;
            }
        },

        ajaxCheckFeed: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('feedMonsterFinder', false) || !schedule.check("feedMonsterFinder")) {
                    return false;
                }

                con.log(2, "Checking Ajax Feed");
                feed.ajaxFeedWait = false;
                feed.ajaxFeed();
                return true;
            } catch (err) {
                con.error("ERROR in ajaxCheckFeed: " + err);
                return false;
            }
        },

        ajaxCheckGuild: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('guildMonsterFinder', false) || !schedule.check("guildMonsterFinder")) {
                    return false;
                }

                con.log(2, "Checking Ajax Guild");
                feed.ajaxGuildWait = false;
                feed.ajaxGuild();
                return true;
            } catch (err) {
                con.error("ERROR in ajaxCheckGuild: " + err);
                return false;
            }
        },

        ajaxCheckPublic1: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder1', false) || !schedule.check("publicMonsterFinder1")) {
                    return false;
                }

                con.log(2, "Checking Ajax Public Tier 1");
                feed.ajaxPublicWait = false;
                feed.ajaxPublic("1");
                return true;
            } catch (err) {
                con.error("ERROR in ajaxCheckPublic1: " + err);
                return false;
            }
        },

        ajaxCheckPublic2: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder2', false) || !schedule.check("publicMonsterFinder2")) {
                    return false;
                }

                con.log(2, "Checking Ajax Public Tier 2");
                feed.ajaxPublicWait = false;
                feed.ajaxPublic("2");
                return true;
            } catch (err) {
                con.error("ERROR in ajaxCheckPublic2: " + err);
                return false;
            }
        },

        ajaxCheckPublic3: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder3', false) || !schedule.check("publicMonsterFinder3")) {
                    return false;
                }

                con.log(2, "Checking Ajax Public Tier 3");
                feed.ajaxPublicWait = false;
                feed.ajaxPublic("3");
                return true;
            } catch (err) {
                con.error("ERROR in ajaxCheckPublic3: " + err);
                return false;
            }
        },

        feedScan: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false) || !config.getItem('feedScan', false) || state.getItem("feedScanDone", false)) {
                    return false;
                }

                con.log(2, "Doing Feed Scan");
                feed.scan();
                return true;
            } catch (err) {
                con.error("ERROR in feedScan: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          BATTLING PLAYERS
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        battleUserId: function (userid) {
            try {
                if (battle.hashCheck(userid)) {
                    return true;
                }

                var battleButton = null,
                    form         = $j(),
                    inp          = $j();

                battleButton = caap.checkForImage(battle.battles['Freshmeat'][config.getItem('BattleType', 'Invade')]);
                if ($u.hasContent(battleButton)) {
                    form = battleButton.parent().parent();
                    if ($u.hasContent(form)) {
                        inp = $j("input[name='target_id']", form);
                        if ($u.hasContent(inp)) {
                            inp.attr("value", userid);
                            state.setItem("lastBattleID", userid);
                            battle.click(battleButton);
                            state.setItem("notSafeCount", 0);
                            return true;
                        } else {
                            con.warn("target_id not found in battleForm");
                        }
                    } else {
                        con.warn("form not found in battleButton");
                    }
                } else {
                    con.warn("battleButton not found");
                }

                return false;
            } catch (err) {
                con.error("ERROR in battleUserId: " + err);
                return false;
            }
        },

        battleWarnLevel: true,

        battle: function (mode) {
            try {
                var whenBattle     = '',
                    target         = '',
                    battletype     = '',
                    useGeneral     = '',
                    staminaReq     = 0,
                    chainImg       = '',
                    button         = null,
                    raidName       = '',
                    battleChainId  = 0,
                    targetMonster  = '',
                    whenMonster    = '',
                    targetType     = '',
                    rejoinSecs     = '',
                    battleRecord   = {},
                    tempTime       = 0,
                    monsterObject  = {},
                    noSafeCountSet = 0;

                if (caap.stats['level'] < 8) {
                    if (caap.battleWarnLevel) {
                        con.log(1, "Battle: Unlock at level 8");
                        caap.battleWarnLevel = false;
                    }

                    return false;
                }

                whenBattle = config.getItem('WhenBattle', 'Never');
                whenMonster = config.getItem('WhenMonster', 'Never');
                targetMonster = state.getItem('targetFrombattle_monster', '');
                monsterObject = $u.hasContent(targetMonster) ? monster.getItem(targetMonster) : monsterObject;
                switch (whenBattle) {
                case 'Never' :
                    caap.setDivContent('battle_mess', 'Battle off');
                    return false;
                case 'Recon Only' :
                    caap.setDivContent('battle_mess', 'Battle Recon Only');
                    return false;
                case 'Stay Hidden' :
                    if (!caap.needToHide()) {
                        caap.setDivContent('battle_mess', 'We Dont Need To Hide Yet');
                        con.log(1, 'We Dont Need To Hide Yet');
                        return false;
                    }

                    break;
                case 'No Monster' :
                    if (mode !== 'DemiPoints') {
                        if (whenMonster !== 'Never' && monsterObject && !/the deathrune siege/i.test(monsterObject['name'])) {
                            return false;
                        }
                    }

                    break;
                case 'Demi Points Only' :
                    if (mode === 'DemiPoints' && whenMonster === 'Never') {
                        return false;
                    }

                    if (mode !== 'DemiPoints' && whenMonster !== 'Never' && monsterObject && !/the deathrune siege/i.test(monsterObject['name'])) {
                        return false;
                    }

                    if (battle.selectedDemisDone(true) || (config.getItem("DemiPointsFirst", false) && whenMonster !== 'Never' && config.getItem("observeDemiFirst", false) && state.getItem('DemiPointsDone', false))) {
                        return false;
                    }

                    break;
                default :
                }

                if (caap.checkKeep()) {
                    return true;
                }

                if (caap.stats['health']['num'] < 10) {
                    con.log(5, 'Health is less than 10: ', caap.stats['health']['num']);
                    return false;
                }

                if (config.getItem("waitSafeHealth", false) && caap.stats['health']['num'] < 13) {
                    con.log(5, 'Unsafe. Health is less than 13: ', caap.stats['health']['num']);
                    return false;
                }

                target = battle.getTarget(mode);
                con.log(5, 'Mode/Target', mode, target);
                if (!target) {
                    con.log(1, 'No valid battle target');
                    return false;
                } else if (!$u.isNumber(target)) {
                    target = target.toLowerCase();
                }

                if (target === 'noraid') {
                    con.log(5, 'No Raid To Attack');
                    return false;
                }

                battletype = config.getItem('BattleType', 'Invade');
                switch (battletype) {
                case 'Invade' :
                    useGeneral = 'InvadeGeneral';
                    staminaReq = target === 'raid' ? state.getItem('RaidStaminaReq', 1) : 1;
                    chainImg = 'battle_invade_again.gif';
                    if (general.LevelUpCheck(useGeneral)) {
                        useGeneral = 'LevelUpGeneral';
                        con.log(3, 'Using level up general');
                    }

                    break;
                case 'Duel' :
                    useGeneral = 'DuelGeneral';
                    staminaReq = target === 'raid' ? state.getItem('RaidStaminaReq', 1) : 1;
                    chainImg = 'battle_duel_again.gif';
                    if (general.LevelUpCheck(useGeneral)) {
                        useGeneral = 'LevelUpGeneral';
                        con.log(3, 'Using level up general');
                    }

                    break;
                case 'War' :
                    useGeneral = 'WarGeneral';
                    staminaReq = 10;
                    chainImg = 'battle_duel_again.gif';
                    if (general.LevelUpCheck(useGeneral)) {
                        useGeneral = 'LevelUpGeneral';
                        con.log(3, 'Using level up general');
                    }

                    break;
                default :
                    con.warn('Unknown battle type ', battletype);
                    return false;
                }

                if (!caap.checkStamina('Battle', staminaReq)) {
                    con.log(3, 'Not enough stamina for ', battletype, staminaReq);
                    return false;
                }

                // Check if we should chain attack
                if ($u.hasContent($j("img[src*='battle_victory.gif']", caap.resultsWrapperDiv))) {
                    button = caap.checkForImage(chainImg);
                    battleChainId = state.getItem("BattleChainId", 0);
                    if ($u.hasContent(button) && battleChainId) {
                        caap.setDivContent('battle_mess', 'Chain Attack In Progress');
                        con.log(2, 'Chaining Target', battleChainId);
                        battle.click(button);
                        state.setItem("BattleChainId", 0);
                        return true;
                    }

                    state.setItem("BattleChainId", 0);
                }

                if (!state.getItem("notSafeCount", 0)) {
                    state.setItem("notSafeCount", 0);
                }

                con.log(2, 'Battle Target', target);
                targetType = config.getItem('TargetType', 'Invade');
                switch (target) {
                case 'raid' :
                    if (!schedule.check("NoTargetDelay")) {
                        rejoinSecs = ((schedule.getItem("NoTargetDelay").next - Date.now()) / 1000).dp() + ' secs';
                        con.log(2, 'Rejoining the raid in', rejoinSecs);
                        caap.setDivContent('battle_mess', 'Joining the Raid in ' + rejoinSecs);
                        return false;
                    }

                    if (general.Select(useGeneral)) {
                        return true;
                    }

                    caap.setDivContent('battle_mess', 'Joining the Raid');
                    // This is a temporary fix for the web3 url until CA fix their HTML
                    if (caap.domain.which === 2 && !$u.hasContent($j("img[src*='tab_raid_']", caap.appBodyDiv))) {
                        if (caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                            return true;
                        }

                        caap.clickAjaxLinkSend("raid.php");
                        return true;
                    }

                    if (caap.navigateTo(caap.battlePage + ',raid', 'tab_raid_on.gif')) {
                        return true;
                    }

                    if (config.getItem('clearCompleteRaids', false) && $u.hasContent(monster.completeButton['raid']['button']) && $u.hasContent(monster.completeButton['raid']['md5'])) {
                        caap.click(monster.completeButton['raid']['button']);
                        monster.deleteItem(monster.completeButton['raid']['md5']);
                        monster.completeButton['raid'] = {'md5': undefined, 'name': undefined, 'button': undefined};
                        caap.updateDashboard(true);
                        con.log(1, 'Cleared a completed raid');
                        return true;
                    }

                    raidName = state.getItem('targetFromraid', '');
                    if ($u.hasContent(raidName)) {
                        monsterObject = monster.getItem(raidName);
                    }

                    if (!$u.hasContent($j("div[style*='dragon_title_owner']", caap.appBodyDiv))) {
                        button = monster.engageButtons[monsterObject['md5']];
                        if ($u.hasContent(button)) {
                            caap.click(button);
                            return true;
                        }

                        con.warn('Unable to engage raid', monsterObject['name']);
                        return false;
                    }

                    if (monster.confirmRightPage(monsterObject['name'])) {
                        return true;
                    }

                    // The user can specify 'raid' in their Userid List to get us here. In that case we need to adjust NextBattleTarget when we are done
                    if (targetType === "Userid List") {
                        if (battle.freshmeat('Raid')) {
                            if ($u.hasContent($j("span[class*='result_body']", caap.appBodyDiv))) {
                                battle.nextTarget();
                            }

                            noSafeCountSet = config.getItem("notSafeCount", 20);
                            noSafeCountSet = noSafeCountSet < 1 ? 1 : noSafeCountSet;
                            noSafeCountSet = Math.round(noSafeCountSet / 4);
                            if (state.getItem("notSafeCount", 0) > noSafeCountSet) {
                                state.setItem("notSafeCount", 0);
                                battle.nextTarget();
                            }

                            return true;
                        }

                        con.warn('Doing Raid UserID list, but no target');
                        return false;
                    }

                    return battle.freshmeat('Raid');
                case 'freshmeat' :
                    if (!schedule.check("NoTargetDelay")) {
                        rejoinSecs = ((schedule.getItem("NoTargetDelay").next - Date.now()) / 1000).dp() + ' secs';
                        con.log(2, 'Rejoining battles in', rejoinSecs);
                        caap.setDivContent('battle_mess', 'Joining battles in ' + rejoinSecs);
                        return false;
                    }

                    if (general.Select(useGeneral)) {
                        return true;
                    }

                    if (caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                        return true;
                    }

                    caap.setDivContent('battle_mess', 'Battling ' + target);
                    // The user can specify 'freshmeat' in their Userid List to get us here. In that case we need to adjust NextBattleTarget when we are done
                    if (targetType === "Userid List") {
                        if (battle.freshmeat('Freshmeat')) {
                            if ($u.hasContent($j("span[class*='result_body']", caap.appBodyDiv))) {
                                battle.nextTarget();
                            }

                            noSafeCountSet = config.getItem("notSafeCount", 20);
                            noSafeCountSet = noSafeCountSet < 1 ? 1 : noSafeCountSet;
                            noSafeCountSet = Math.round(noSafeCountSet / 4);
                            if (state.getItem("notSafeCount", 0) > noSafeCountSet) {
                                state.setItem("notSafeCount", 0);
                                battle.nextTarget();
                            }

                            return true;
                        }

                        con.warn('Doing Freshmeat UserID list, but no target');
                        return false;
                    }

                    return battle.freshmeat('Freshmeat');
                default:
                    if (!config.getItem("IgnoreBattleLoss", false)) {
                        battleRecord = battle.getItem(target);
                        switch (config.getItem("BattleType", 'Invade')) {
                        case 'Invade' :
                            tempTime = battleRecord.invadeLostTime ? battleRecord.invadeLostTime : tempTime;
                            break;
                        case 'Duel' :
                            tempTime = battleRecord.duelLostTime ? battleRecord.duelLostTime : tempTime;
                            break;
                        case 'War' :
                            tempTime = battleRecord.warlostTime ? battleRecord.warlostTime : tempTime;
                            break;
                        default :
                            con.warn("Battle type unknown!", config.getItem("BattleType", 'Invade'));
                        }

                        if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 604800)) {
                            con.log(1, 'Avoiding Losing Target', target);
                            battle.nextTarget();
                            return true;
                        }
                    }

                    if (general.Select(useGeneral)) {
                        return true;
                    }

                    if (caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                        return true;
                    }

                    //state.setItem('BattleChainId', 0);
                    if (caap.battleUserId(target)) {
                        battle.nextTarget();
                        return true;
                    }

                    con.warn('Doing default UserID list, but no target');
                    return false;
                }
            } catch (err) {
                con.error("ERROR in battle: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          GUILD
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_guild: function () {
            try {
                if (session.getItem("clickUrl").hasIndexOf("guild_battle=true")) {
                    caap.guildTabAddListener();
                    con.log(2, "Battle List");
                    return true;
                }

                // Guild
                var guildTxt   = '',
                    guildDiv   = $j(),
                    tStr       = '',
                    members    = [],
                    save       = false;

                if (config.getItem('enableMonsterFinder', false)) {
                    feed.items("guild");
                }

                guildTxt = $j("#" + caap.domain.id[caap.domain.which] + "guild_achievement", caap.appBodyDiv).text().trim().innerTrim();
                if ($u.hasContent(guildTxt)) {
                    tStr = guildTxt.regex(/Monster ([\d,]+)/);
                    caap.stats['guild']['mPoints'] = $u.hasContent(tStr) ? ($u.isString(tStr) ? tStr.numberOnly() : tStr) : 0;
                    tStr = guildTxt.regex(/Battle ([\d,]+)/);
                    caap.stats['guild']['bPoints'] = $u.hasContent(tStr) ? ($u.isString(tStr) ? tStr.numberOnly() : tStr) : 0;
                    tStr = guildTxt.regex(/Monster [\d,]+ points \(Top (\d+\-\d+%)\)/);
                    caap.stats['guild']['mRank'] = $u.hasContent(tStr) ? tStr : '';
                    tStr = guildTxt.regex(/Battle [\d,]+ points \(Top (\d+\-\d+%)\)/);
                    caap.stats['guild']['bRank'] = $u.hasContent(tStr) ? tStr : '';
                    save = true;
                } else {
                    con.warn('Using stored guild Monster and Battle points.');
                }

                guildTxt = $j("#" + caap.domain.id[caap.domain.which] + "guild_blast input[name='guild_id']", caap.globalContainer).attr("value");
                if ($u.hasContent(guildTxt)) {
                    caap.stats['guild']['id'] = guildTxt;
                    save = true;
                } else {
                    con.warn('Using stored guild_id.');
                }

                guildTxt = $j("#" + caap.domain.id[caap.domain.which] + "guild_banner_section", caap.globalContainer).text().trim();
                if ($u.hasContent(guildTxt)) {
                    caap.stats['guild']['name'] = guildTxt;
                    save = true;
                } else {
                    con.warn('Using stored guild name.');
                }

                guildDiv = $j("#" + caap.domain.id[caap.domain.which] + "cta_log div[style*='guild_main_score_middle'] a[href*='keep.php?casuser']", caap.globalContainer);
                if ($u.hasContent(guildDiv)) {
                    guildDiv.each(function () {
                        var t = $j(this),
                            uid = t.attr("href").regex(/casuser=(\d+)/),
                            name = t.text().trim();

                        if (uid !== caap.stats['FBID']) {
                            members.push({'userId': uid, 'name': name});
                        }
                    });

                    caap.stats['guild']['members'] = members.slice();
                    save = true;
                } else {
                    con.warn('Using stored guild member count.');
                }

                con.log(2, "checkResults_guild", caap.stats['guild']);
                if (save) {
                    caap.saveStats();
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_guild: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        guildTabListener: function (event) {
            session.setItem("clickUrl", $u.setContent($j(event.target).parent().attr("onclick"), '').regex(new RegExp(",'(.+\\.php.*?)'")));
        },

        guildTabAddListener: function () {
            $j("div[style*='guild_tab_off_tile.jpg'],div[style*='guild_tab_on_tile.jpg']").unbind('click', caap.guildTabListener).bind('click', caap.guildTabListener);
        },

        checkResults_guild_panel: function () {
            caap.guildTabAddListener();
        },

        checkResults_guild_shop: function () {
            caap.guildTabAddListener();
        },

        checkResults_guild_class: function () {
            caap.guildTabAddListener();
        },

        checkResults_guild_formation: function () {
            caap.guildTabAddListener();
        },

        /////////////////////////////////////////////////////////////////////
        //                          GUILD BATTLES
        /////////////////////////////////////////////////////////////////////

        checkResults_guild_current_battles: function () {
            try {
                var tempDiv = $j();
                tempDiv = $j("img[src*='guild_symbol']");
                if (tempDiv && tempDiv.length) {
                    tempDiv.each(function () {
                        con.log(5, "name", $j(this).parent().parent().next().text().trim());
                        con.log(5, "button", $j(this).parent().parent().parent().next().find("input[src*='dragon_list_btn_']"));
                    });
                } else {
                    return false;
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_guild_current_battles: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          GUILD MONSTERS
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        /*-------------------------------------------------------------------------------------\
        GuildMonsterReview is a primary action subroutine to mange the guild monster on the dashboard
        \-------------------------------------------------------------------------------------*/
        guildMonsterReview: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                We do guild monster review once an hour.  Some routines may reset this timer to drive
                GuildMonsterReview immediately.
                \-------------------------------------------------------------------------------------*/
                if (!schedule.check("guildMonsterReview") || config.getItem('WhenGuildMonster', 'Never') === 'Never') {
                    return false;
                }

                if (!caap.stats['guild']['id']) {
                    con.log(2, "Going to guild to get Guild Id");
                    if (caap.navigateTo('guild')) {
                        return true;
                    }
                }

                var record = {},
                    url    = '',
                    objective = '';

                if (state.getItem('guildMonsterBattlesRefresh', true)) {
                    if (guild_monster.navigate_to_battles_refresh()) {
                        return true;
                    }
                }

                if (!state.getItem('guildMonsterBattlesReview', false)) {
                    if (guild_monster.navigate_to_battles()) {
                        return true;
                    }

                    state.setItem('guildMonsterBattlesReview', true);
                }

                record = guild_monster.getReview();
                if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                    con.log(1, "Reviewing Slot (" + record['slot'] + ") Name: " + record['name']);
                    if (caap.stats['staminaT']['num'] > 0 && config.getItem("doGuildMonsterSiege", true)) {
                        objective = "&action=doObjective";
                    }

                    url = "guild_battle_monster.php?twt2=" + guild_monster.info[record['name']].twt2 + "&guild_id=" + record['guildId'] + objective + "&slot=" + record['slot'] + "&ref=nf";
                    state.setItem('guildMonsterReviewSlot', record['slot']);
                    caap.clickAjaxLinkSend(url);
                    return true;
                }

                schedule.setItem("guildMonsterReview", (gm ? gm.getItem('guildMonsterReviewMins', 60, hiddenVar) : 60) * 60, 300);
                state.setItem('guildMonsterBattlesRefresh', true);
                state.setItem('guildMonsterBattlesReview', false);
                state.setItem('guildMonsterReviewSlot', 0);
                guild_monster.select(true);
                con.log(1, 'Done with guild monster review.');
                return false;
            } catch (err) {
                con.error("ERROR in guildMonsterReview: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        checkResults_guild_current_monster_battles: function () {
            try {
                $j("input[src*='dragon_list_btn_']", caap.globalContainer).unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);
                guild_monster.populate();

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_guild_current_monster_battles: " + err);
                return false;
            }
        },

        checkResults_guild_monster_summon_list: function () {
            try {
                if (config.getItem("enableSpider", true)) {
                    guild_monster.enableSpider();
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_guild_current_monster_battles: " + err);
                return false;
            }
        },

        checkResults_guild_battle_monster: function () {
            try {
                $j("input[src*='guild_duel_button']", caap.globalContainer).unbind('click', caap.guildMonsterEngageListener).bind('click', caap.guildMonsterEngageListener);
                guild_monster.onMonster();
                if (config.getItem("enableTitles", true)) {
                    spreadsheet.doTitles();
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_guild_battle_monster: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        guildMonster: function () {
            try {
                var when    = '',
                    record  = {},
                    minion  = {},
                    form    = $j(),
                    key     = $j(),
                    url     = '',
                    attack  = 0,
                    stamina = 0,
                    WhenBattle = '';

                when = config.getItem("WhenGuildMonster", 'Never');
                if (when === 'Never') {
                    return false;
                }

                if (!caap.stats['guild']['id']) {
                    con.log(2, "Going to guild to get Guild Id");
                    if (caap.navigateTo('guild')) {
                        return true;
                    }
                }

                /*
                if (!caap.stats['guild']['id']) {
                    con.log(2, "Going to keep to get Guild Id");
                    if (caap.navigateTo('keep')) {
                        return true;
                    }
                }
                */

                function doClassicFirst() {
                    if (config.getItem('doClassicMonstersFirst', false) && config.getItem("WhenMonster", 'Never') !== 'Never') {
                        if (state.getItem('targetFrombattle_monster', '') || state.getItem('targetFromraid', '')) {
                            return true;
                        }

                        WhenBattle = config.getItem("WhenBattle", 'Never');
                        if ((WhenBattle === 'No Monster' || WhenBattle === 'Demi Points Only') && config.getItem("DemiPointsFirst", false) && !battle.selectedDemisDone()) {
                            return true;
                        }
                    }

                    return false;
                }

                if (caap.inLevelUpMode()) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        caap.setDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + 5);
                        return false;
                    }

                    if (doClassicFirst()) {
                        return false;
                    }
                } else if (when === 'Stamina Available') {
                    stamina = state.getItem('staminaGuildMonster', 0);
                    if (caap.stats['staminaT']['num'] < stamina) {
                        caap.setDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + stamina);
                        return false;
                    }

                    state.setItem('staminaGuildMonster', 0);
                    record = state.getItem('targetGuildMonster', {});
                    if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                        minion = guild_monster.getTargetMinion(record);
                        if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                            stamina = guild_monster.getStaminaValue(record, minion);
                            state.setItem('staminaGuildMonster', stamina);
                            if (caap.stats['staminaT']['num'] < stamina) {
                                caap.setDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + stamina);
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }

                    if (doClassicFirst()) {
                        return false;
                    }
                } else if (when === 'At X Stamina') {
                    if (caap.stats['staminaT']['num'] >= config.getItem("MaxStaminaToGMonster", 20)) {
                        state.setItem('guildMonsterBattlesBurn', true);
                    }

                    if (caap.stats['staminaT']['num'] <= config.getItem("MinStaminaToGMonster", 0) || caap.stats['staminaT']['num'] < 1) {
                        state.setItem('guildMonsterBattlesBurn', false);
                    }

                    if (!state.getItem('guildMonsterBattlesBurn', false)) {
                        caap.setDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + config.getItem("MaxStaminaToGMonster", 20));
                        return false;
                    }

                    if (doClassicFirst()) {
                        return false;
                    }
                } else if (when === 'At Max Stamina') {
                    if (caap.stats['staminaT']['num'] < caap.stats['stamina']['max'] || caap.stats['staminaT']['num'] < 1) {
                        caap.setDivContent('guild_monster_mess', 'Guild Monster stamina ' + caap.stats['staminaT']['num'] + '/' + caap.stats['stamina']['max']);
                        return false;
                    }

                    if (doClassicFirst()) {
                        return false;
                    }
                }

                caap.setDivContent('guild_monster_mess', '');
                record = guild_monster.select();
                //record = guild_monster.select(true);
                //record = state.setItem('targetGuildMonster', {});
                //con.log(1, "record", record);
                if (record && $j.isPlainObject(record) && !$j.isEmptyObject(record)) {
                    if (general.Select('GuildMonsterGeneral')) {
                        return true;
                    }

                    if (!guild_monster.checkPage(record)) {
                        con.log(2, "Fighting Slot (" + record['slot'] + ") Name: " + record['name']);
                        caap.setDivContent('guild_monster_mess', "Fighting ("  + record['slot'] + ") " + record['name']);
                        url = "guild_battle_monster.php?twt2=" + guild_monster.info[record['name']].twt2 + "&guild_id=" + record['guildId'] + "&slot=" + record['slot'];
                        caap.clickAjaxLinkSend(url);
                        return true;
                    }

                    minion = guild_monster.getTargetMinion(record);
                    if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                        con.log(2, "Fighting target_id (" + minion['target_id'] + ") Name: " + minion['name']);
                        caap.setDivContent('guild_monster_mess', "Fighting (" + minion['target_id'] + ") " + minion['name']);
                        key = $j("#" + caap.domain.id[caap.domain.which] + "attack_key_" + minion['target_id']);
                        if (key && key.length) {
                            attack = guild_monster.getAttackValue(record, minion);
                            if (!attack) {
                                return false;
                            }

                            key.attr("value", attack);
                            form = key.parents("form").eq(0);
                            if (form && form.length) {
                                caap.click(form.find("input[src*='guild_duel_button2.gif'],input[src*='monster_duel_button.gif']"));
                                return true;
                            }
                        }
                    }
                }

                return false;
            } catch (err) {
                con.error("ERROR in guildMonster: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          ARENA
        /////////////////////////////////////////////////////////////////////

        /*checkResults_arena: function () {
            try {
                return arena.checkResults_arena();
            } catch (err) {
                con.error("ERROR in checkResults_arena: " + err);
                return false;
            }
        },

        checkResults_arena_battle: function () {
            try {
                return arena.checkResults_arena_battle();
            } catch (err) {
                con.error("ERROR in checkResults_arena_battle: " + err);
                return false;
            }
        },*/

        /*-------------------------------------------------------------------------------------\
        ArenaReview is a primary action subroutine to mange the Arena on the dashboard
        \-------------------------------------------------------------------------------------*/
        /*arenaReview: function () {
            try {
                return arena.review();
            } catch (err) {
                con.error("ERROR in arenaReview: " + err);
                return false;
            }
        },

        arena: function () {
            try {
                return arena.arena();
            } catch (err) {
                con.error("ERROR in arena: " + err);
                return false;
            }
        },*/

        /////////////////////////////////////////////////////////////////////
        //                          FESTIVAL
        /////////////////////////////////////////////////////////////////////

        checkResults_festival_battle_home: function () {
            try {
                return festival.checkResults_festival_battle_home();
            } catch (err) {
                con.error("ERROR in checkResults_festival_battle_home: " + err);
                return false;
            }
        },

        checkResults_festival_guild_battle: function () {
            try {
                return festival.checkResults_festival_guild_battle();
            } catch (err) {
                con.error("ERROR in checkResults_festival_guild_battle: " + err);
                return false;
            }
        },

        /*-------------------------------------------------------------------------------------\
        FestivalReview is a primary action subroutine to mange the Festival on the dashboard
        \-------------------------------------------------------------------------------------*/
        festivalReview: function () {
            try {
                return festival.review();
            } catch (err) {
                con.error("ERROR in festivalReview: " + err);
                return false;
            }
        },

        festival: function () {
            try {
                return festival.festival();
            } catch (err) {
                con.error("ERROR in festival: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          MONSTERS AND BATTLES
        /////////////////////////////////////////////////////////////////////

        checkResults_army_news_feed: function () {
            try {
                if (!config.getItem('enableMonsterFinder', false)) {
                    return true;
                }

                feed.items("feed");
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_army_news_feed: " + err);
                return false;
            }
        },

        checkResults_public_monster_list: function () {
            try {
                if (config.getItem('enableMonsterFinder', false)) {
                    feed.publicItems();
                }

                $j("input[name='Attack Dragon']").click(function () {
                    var form   = $j(this).parents("form").eq(0),
                        userId = $j("input[name='casuser']", form).val().parseInt(),
                        mpool  = $j("input[name='mpool']", form).val().parseInt();

                    caap.setDomWaiting("/battle_monster.php?casuser=" + userId + "&mpool=" + mpool);
                });

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_public_monster_list: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_fightList: function () {
            try {
                if (feed.isScan && $u.hasContent($j("div[style*='no_monster_back.jpg']", caap.appBodyDiv))) {
                    con.log(2, "No monster");
                    feed.checked(monster.getItem(''));
                    return false;
                }

                var buttonsDiv            = $j("img[src*='dragon_list_btn_'],input[src*='monster_button_']" + (config.getItem("festivalTower", false) ? ",img[src*='festival_monster_']" : ""), caap.appBodyDiv),
                    page                  = '',
                    monsterReviewed       = {},
                    it                    = 0,
                    len                   = 0,
                    url                   = '',
                    siege                 = '',
                    engageButtonName      = '',
                    monsterName           = '',
                    monsterRow            = $j("div[style*='monsterlist_container.gif']", caap.appBodyDiv),
                    monsterFull           = '',
                    monsterInfo           = {},
                    summonDiv             = $j("img[src*='mp_button_summon_']" + (config.getItem("festivalTower", false) ? ",img[src*='festival_monster_summonbtn.gif']" : ""), caap.appBodyDiv),
                    tempText              = '',
                    monsterText           = '',
                    userId                = 0,
                    userName              = '',
                    mName                 = '',
                    md5                   = '',
                    pageUserCheck         = 0,
                    newInputsDiv          = $j();

                monster.clean();
                // get all buttons to check monsterObjectList
                if (!$u.hasContent(summonDiv) && !$u.hasContent(buttonsDiv) && !$u.hasContent(monsterRow)) {
                    con.log(2, "No buttons found");
                    return false;
                }

                page = session.getItem('page', 'battle_monster');
                if (page === 'player_monster_list') {
                    // Review monsters and find attack and fortify button
                    for (it = 0, len = monsterRow.length; it < len; it += 1) {
                        // Make links for easy clickin'
                        if (!$u.hasContent($j("input", monsterRow.eq(it)))) {
                            con.log(2, "No inputs found", it);
                            continue;
                        }

                        userId = $u.setContent($j("input[name='casuser']", monsterRow.eq(it)).val(), "0").parseInt();
                        if (!$u.hasContent(userId) || userId === 0) {
                            con.log(2, "No userId found");
                            continue;
                        }

                        userName = userId === caap.stats['FBID'] ? 'Your' : monsterRow.eq(it).children().eq(1).children().eq(0).text().trim();
                        tempText = $j("img", monsterRow.eq(it)).eq(0).attr("src").basename();
                        monsterText = monster.getListName(tempText);
                        mName = userName + ' ' + monsterText;
                        con.log(2, "Monster Name", mName);
                        con.log(3, "checkResults_fightList page", page);
                        md5 = (userId + ' ' + monsterText + ' ' + "battle_monster").toLowerCase().MD5();
                        monsterReviewed = monster.getItem(md5);
                        monsterReviewed['name'] = mName;
                        monsterReviewed['userName'] = userName;
                        monsterReviewed['monster'] = monsterText;
                        monsterReviewed['userId'] = userId;
                        monsterReviewed['md5'] = md5;
                        monsterReviewed['type'] = $u.setContent(monsterReviewed['type'], '');
                        monsterReviewed['page'] = "battle_monster";
                        newInputsDiv = $j("input[name='Attack Dragon']", monsterRow.eq(it));
                        engageButtonName = newInputsDiv.attr("src").regex(/(collect|engage)/);
                        switch (engageButtonName) {
                        case 'collect' :
                            monsterReviewed['status'] = 'Collect Reward';
                            monsterReviewed['color'] = 'grey';
                            break;
                        case 'engage' :
                            monster.engageButtons[monsterReviewed['md5']] = newInputsDiv;
                            break;
                        case 'complete' :
                            if (!$u.hasContent(monster.completeButton["battle_monster"]['md5'])) {
                                monster.completeButton["battle_monster"]['md5'] = $u.setContent(monsterReviewed['md5'], '');
                                monster.completeButton["battle_monster"]['name'] = $u.setContent(monsterReviewed['name'], '');
                                monster.completeButton["battle_monster"]['button'] = $u.setContent($j("img[src*='cancelButton.gif']", monsterRow.eq(it)), null);
                            }

                            monsterReviewed['status'] = 'Complete';
                            monsterReviewed['color'] = 'grey';
                            break;
                        default :
                        }

                        monsterReviewed['hide'] = true;
                        monsterReviewed['mpool'] = $j("input[name='mpool']", monsterRow.eq(it)).val().parseInt();
                        monsterInfo = monster.getInfo(monsterReviewed);
                        siege = monsterInfo && monsterInfo.siege ? "&action=doObjective" : '';
                        monsterReviewed['feedLink'] = "battle_monster.php?casuser=" + monsterReviewed['userId'] + "&mpool=" + monsterReviewed['mpool'];
                        //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                        monsterReviewed['link'] = "<a href='" + caap.domain.altered + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                        monsterReviewed['joined'] = true;
                        monster.setItem(monsterReviewed);
                    }
                } else {
                    if ((page === 'battle_monster' || page === 'festival_tower') && !$u.hasContent(buttonsDiv)) {
                        con.log(2, "No monsters to review");
                        //feed.checked("Not Found");
                        state.setItem('reviewDone', true);
                        return true;
                    }

                    tempText = buttonsDiv.eq(0).parent().attr("href");
                    pageUserCheck = session.getItem('pageUserCheck', 0);
                    if (pageUserCheck && tempText && !(new RegExp('user=' + caap.stats['FBID']).test(tempText) || /alchemy\.php/.test(tempText))) {
                        con.log(2, "On another player's keep.", pageUserCheck);
                        return false;
                    }

                    // Review monsters and find attack and fortify button
                    for (it = 0, len = buttonsDiv.length; it < len; it += 1) {
                        // Make links for easy clickin'
                        url = buttonsDiv.eq(it).parent().attr("href");
                        if (!(url && /user=/.test(url) && (/mpool=/.test(url) || /raid\.php/.test(url)))) {
                            continue;
                        }

                        url = url.replace(/http(s)*:\/\/(apps\.facebook\.com\/castle_age\/|web3\.castleagegame\.com\/castle_ws\/)/, '');
                        monsterRow = buttonsDiv.eq(it).parents().eq(3);
                        monsterFull = monsterRow.text().trim().innerTrim();
                        monsterName = monsterFull.replace(/Completed!/i, '').replace(/Fled!/i, '').replace(/COLLECTION: \d+:\d+:\d+/i, '').trim().innerTrim();
                        if (/^Your /.test(monsterName)) {
                            monsterText = monsterName.replace(/^Your /, '').trim().innerTrim().toLowerCase().ucWords();
                            userName = "Your";
                        } else if (/Aurelius, Lion's Rebellion/.test(monsterName)) {
                            monsterText = "Aurelius, Lion's Rebellion";
                            userName = monsterName.replace(monsterText, '').trim();
                        } else {
                            monsterText = monsterName.replace(new RegExp(".+'s (.+)$"), '$1');
                            userName = monsterName.replace(monsterText, '').trim();
                            monsterText = monsterText.trim().innerTrim().toLowerCase().ucWords();
                        }

                        tempText = $j("div[style*='.jpg']", monsterRow).eq(0).attr("style").regex(new RegExp(".*\\/(.*\\.jpg)"));
                        monsterText = $u.setContent(monster.getListName(tempText), monsterText);
                        mName = userName + ' ' + monsterText;
                        con.log(2, "Monster Name", mName);
                        userId = $u.setContent(url.regex(/user=(\d+)/), 0);
                        con.log(3, "checkResults_fightList page", page.replace(/festival_tower/, "festival_battle_monster"), url);
                        md5 = (userId + ' ' + monsterText + ' ' + page.replace(/festival_tower/, "festival_battle_monster")).toLowerCase().MD5();
                        monsterReviewed = monster.getItem(md5);
                        monsterReviewed['name'] = mName;
                        monsterReviewed['userName'] = userName;
                        monsterReviewed['monster'] = monsterText;
                        monsterReviewed['userId'] = userId;
                        monsterReviewed['md5'] = md5;
                        monsterReviewed['type'] = $u.setContent(monsterReviewed['type'], '');
                        monsterReviewed['page'] = page.replace(/festival_tower/, "festival_battle_monster");
                        engageButtonName = page === 'festival_tower' ? $u.setContent(buttonsDiv.eq(it).attr("src"), '').regex(/festival_monster_(\S+)\.gif/i) : $u.setContent(buttonsDiv.eq(it).attr("src"), '').regex(/(dragon_list_btn_\d)/i);
                        switch (engageButtonName) {
                        case 'collectbtn' :
                        case 'dragon_list_btn_2' :
                            monsterReviewed['status'] = 'Collect Reward';
                            monsterReviewed['color'] = 'grey';
                            break;
                        case 'engagebtn' :
                        case 'dragon_list_btn_3' :
                            monster.engageButtons[monsterReviewed['md5']] = $j(buttonsDiv.eq(it));
                            break;
                        case 'viewbtn' :
                        case 'dragon_list_btn_4' :
                            if (page === 'raid' && !(/!/.test(monsterFull))) {
                                monster.engageButtons[monsterReviewed['md5']] = $j(buttonsDiv.eq(it));
                                break;
                            }

                            if (page !== "festival_tower" && !$u.hasContent(monster.completeButton[page.replace("festival_tower", "battle_monster")]['button']) || !$u.hasContent(monster.completeButton[page.replace("festival_tower", "battle_monster")]['md5'])) {
                                monster.completeButton[page.replace("festival_tower", "battle_monster")]['md5'] = $u.setContent(monsterReviewed['md5'], '');
                                monster.completeButton[page.replace("festival_tower", "battle_monster")]['name'] = $u.setContent(monsterReviewed['name'], '');
                                monster.completeButton[page.replace("festival_tower", "battle_monster")]['button'] = $u.setContent($j("img[src*='cancelButton.gif']", monsterRow), null);
                            }

                            monsterReviewed['status'] = 'Complete';
                            monsterReviewed['color'] = 'grey';
                            break;
                        default :
                        }

                        monsterReviewed['hide'] = true;
                        monsterReviewed['mpool'] = /mpool=\d+/.test(url) ? '&mpool=' + url.regex(/mpool=(\d+)/) : '';
                        monsterReviewed['mid'] = /mid=\S+/.test(url) ? '&mid=' + url.regex(/mid=(\S+)[&]*/) : '';
                        monsterInfo = monster.getInfo(monsterReviewed);
                        siege = monsterInfo && monsterInfo.siege ? "&action=doObjective" : '';
                        monsterReviewed['feedLink'] = url;
                        //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + (page === 'festival_tower' ? 'festival_battle_monster' : page) + ".php?casuser=" + monsterReviewed['userId'] + monsterReviewed['mpool'] + $u.setContent(monsterReviewed['mid'], '') + siege + "'>Link</a>";
                        //monsterReviewed['link'] = "<a href='" + caap.domain.link + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                        monsterReviewed['link'] = "<a href='" + caap.domain.altered + "/" + monsterReviewed['feedLink'] + siege + "'>Link</a>";
                        monsterReviewed['joined'] = true;
                        monster.setItem(monsterReviewed);
                    }
                }

                state.setItem('reviewDone', true);
                caap.updateDashboard(true);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_fightList: " + err);
                return false;
            }
        },

        checkResults_viewFight: function (ajax) {
            try {
                var slice             = ajax ? caap.tempAjax : caap.appBodyDiv,
                    currentMonster    = {},
                    time              = [],
                    tempDiv           = $j(),
                    tempText          = '',
                    tempArr           = [],
                    counter           = 0,
                    monstHealthImg    = '',
                    totalCount        = 0,
                    ind               = 0,
                    len               = 0,
                    searchStr         = '',
                    searchRes         = $j(),
                    achLevel          = 0,
                    maxDamage         = 0,
                    maxToFortify      = 0,
                    isTarget          = false,
                    KOBenable         = false,
                    KOBbiasHours      = 0,
                    KOBach            = false,
                    KOBmax            = false,
                    KOBminFort        = false,
                    KOBtmp            = 0,
                    KOBtimeLeft       = 0,
                    KOBbiasedTF       = 0,
                    KOBPercentTimeRemaining = 0,
                    KOBtotalMonsterTime = 0,
//                    monsterDiv        = $j("div[style*='dragon_title_owner'],div[style*='monster_header_'],div[style*='boss_header_']" + (config.getItem("festivalTower", false) ? ",div[style*='festival_monsters_top_']" : ""), slice),
                    monsterDiv        = $j("div[style*='dragon_title_owner'],div[style*='monster_header_'],div[style*='monster_'][style*='_header'],div[style*='boss_header_']" + (config.getItem("festivalTower", false) ? ",div[style*='festival_monsters_top_']" : ""), slice),
                    actionDiv         = $j(),
                    damageDiv         = $j(),
                    monsterInfo       = {},
                    targetFromfortify = {},
                    tStr              = '',
                    tNum              = 0,
                    tBool             = false,
                    fMonstStyle       = '',
                    nMonstStyle       = '',
                    nMonstStyle2      = '',
                    id                = 0,
                    userName          = '',
                    mName             = '',
                    feedMonster       = '',
                    md5               = '',
                    //page              = session.getItem('page', 'battle_monster'),
                    page              = $j(".game", ajax ? slice : caap.globalContainer).eq(0).attr("id").replace(caap.domain.id[caap.domain.which], ''),
                    matches           = true,
                    ctaDiv            = $j(),
                    dragonDiv         = $j(".dragonContainer", slice),
                    dleadersDiv       = $j("td:eq(1) div[style*='bold']:eq(0) div:last", dragonDiv),
                    maxJoin           = dleadersDiv.text().regex(/(\d+)/),
                    countJoin         = 0,
                    it                = 0,
                    jt                = 0,
                    groups            = {},
                    groupMatch        = false,
                    found             = false;

                con.log(3, "Damage Leaders", dleadersDiv.text(), maxJoin);
                tempDiv = $j("td[colspan='2']:contains('Levels'),td[colspan='2']:contains('Allies')", dragonDiv);
                if ($u.hasContent(tempDiv)) {
                    tempDiv.each(function (index) {
                        $j(this).parent().attr("id", "mark" + index);
                    });

                    tempDiv.each(function (index) {
                        var group  = $j(this),
                            levels = $j("b", group).text(),
                            start  = levels.regex(/Levels (\d+)/),
                            max    = group.text().trim().innerTrim().replace(levels, '').trim(),
                            maxNum = max.regex(/(\d+)/),
                            count  = group.parent().nextUntil("#mark" + (index + 1)).find("a[href*='keep.php']").length;

                        con.log(3, "groups", index, levels, start, maxNum, count);
                        groups[levels] = {'level': start, 'max': maxNum, 'count': count};
                        countJoin += count;
                        if (!feed.isScan && !ajax) {
                            group.html("<div><b>" + levels + "</b> [" + count + "/" + maxNum + " max]</div>");
                        }
                    });
                } else {
                    tempDiv = $j("table:eq(1) a", dragonDiv);
                    countJoin = tempDiv.length;
                }

                groups['total'] = {'max': maxJoin, 'count': countJoin};
                con.log(3, "groups", groups);
                if (!feed.isScan && !ajax) {
                    dleadersDiv.html("[" + countJoin + "/" + maxJoin + "max]");
                }

                if ((feed.isScan || ajax) && $u.hasContent(feed.scanRecord['page']) && feed.scanRecord['page'] !== page) {
                    page = feed.scanRecord['page'];
                    con.log(2, "Page mismatch so using feed.scanRecord page", page, feed.scanRecord['page']);
                    if (config.getItem("DebugLevel", 1) > 1) {
                        $j().alert("Page mismatch so using feed.scanRecord page<br />" + page + '<br />' + feed.scanRecord['page']);
                    }
                }

                con.log(3, "GAME PAGE", page);
                if (!feed.isScan && !ajax) {
                    battle.checkResults();
                    if (config.getItem("enableTitles", true)) {
                        spreadsheet.doTitles();
                    }

                    caap.chatLink(slice, "#" + caap.domain.id[caap.domain.which] + "chat_log div[style*='hidden'] div[style*='320px']");
                }

                con.log(4, "monsterDiv", monsterDiv);
                if ($u.hasContent(monsterDiv)) {
                    fMonstStyle = monsterDiv.attr("style").regex(/(festival_monsters_top_\S+\.jpg)/);
                    con.log(2, "fMonstStyle", fMonstStyle);
                    if (!$u.hasContent(fMonstStyle)) {
                        nMonstStyle = monsterDiv.attr("style").regex(new RegExp(".+\\/(.+_header_\\S+\\.jpg)"));
                        nMonstStyle2 = monsterDiv.attr("style").regex(new RegExp(".+\\/(.+_header.jpg)"));
                        con.log(2, "nMonstStyle", nMonstStyle);
                    }

                    if ($u.hasContent(fMonstStyle) || $u.hasContent(nMonstStyle) || $u.hasContent(nMonstStyle2)) {
                        tempDiv = monsterDiv.find(":contains('summoned'):last,:contains('Summoned'):last");
                        if ($u.hasContent(fMonstStyle)) {
                            tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/summoned/i, monster.getFestName(fMonstStyle));
                        } else {
                            if ($u.hasContent(nMonstStyle)) {
                            tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/ summoned/i, "'s " + monster.getNewName(nMonstStyle));
                            } else {
                                tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/ summoned/i, "'s " + monster.getNewName(nMonstStyle2));
                            }
                        }
                    } else {
                        // old pages - shouldn't exist any more
                        tempText = $u.setContent(monsterDiv.children(":eq(2)").text(), '').trim().innerTrim();
                    }

                    con.log(3, "tempText", tempText);
                } else {
                    monsterDiv = $j("div[style*='nm_top']", slice);
                    if ($u.hasContent(monsterDiv)) {
                        tempText = $u.setContent(monsterDiv.children(":eq(0)").children(":eq(0)").text(), '').trim().innerTrim();
                        tempDiv = $j("div[style*='nm_bars']", slice);
                        if ($u.hasContent(tempDiv)) {
                            tempText += ' ' + $u.setContent(tempDiv.children(":eq(0)").children(":eq(0)").children(":eq(0)").siblings(":last").children(":eq(0)").text(), '').trim().replace("'s Life", "");
                        } else {
                            con.warn("Problem finding nm_bars");
                            return;
                        }
                    } else {
                        if ($u.hasContent(fMonstStyle)) {
                            $j().alert(fMonstStyle + "<br />I do not know this monster!<br />Please inform me.");
                        }

                        if ($u.hasContent($j("div[style*='no_monster_back.jpg']", slice))) {
                            con.log(2, "No monster");
                        }  else {
                            con.warn("Problem finding dragon_title_owner and nm_top");
                        }

                        feed.checked(monster.getItem(''));
                        return;
                    }
                }

                if ($u.hasContent(monsterDiv)) {
                    id = $u.setContent($j("img[src*='profile.ak.fbcdn.net']", monsterDiv).attr("uid"), '').regex(/(\d+)/);
                    id = $u.setContent(id, $u.setContent($j(".fb_link[href*='profile.php']", monsterDiv).attr("href"), '').regex(/id=(\d+)/));
                    id = $u.setContent(id, $u.setContent($j("img[src*='graph.facebook.com']", monsterDiv).attr("src"), '').regex(/\/(\d+)\//));
                    id = $u.setContent(id, $u.setContent($j("button[onclick*='ajaxSectionUpdate']", slice).attr("onclick") + "", '').regex(/user=(\d+)/));
                    id = $u.setContent(id, (feed.isScan || ajax) ? feed.scanRecord['id'] : 0);
                    con.log(3, "USER ID", id);
                    if (id === 0 || !$u.hasContent(id)) {
                        con.warn("Unable to get id!");
                        if (config.getItem("DebugLevel", 1) > 1) {
                            $j().alert("Unable to get id!");
                        }

                        if (feed.isScan || ajax) {
                            feed.checked(monster.getItem(''));
                        }

                        return;
                    }

                    if (/Aurelius, Lion's Rebellion/.test(tempText)) {
                        feedMonster = "Aurelius, Lion's Rebellion";
                        userName = tempText.replace(feedMonster, '').trim();
                    } else {
                        feedMonster = tempText.replace(new RegExp(".+'s (.+)$"), '$1');
                        userName = tempText.replace(feedMonster, '').trim();
                        feedMonster = feedMonster.trim().innerTrim().toLowerCase().ucWords();
                    }

                    if (!$u.hasContent(feedMonster)) {
                        con.warn("Unable to get monster string!!");
                    }

                    if (id === caap.stats['FBID']) {
                        con.log(2, "Your monster found", tempText);
                        userName = 'Your';
                    }
                } else {
                    con.warn("checkResults_viewFight monsterDiv issue!");
                }

                mName = userName + ' ' + feedMonster;
                con.log(2, "Monster name", mName);
                if (feed.isScan || ajax) {
                    if (feed.scanRecord['id'] !== id) {
                        con.warn("User ID doesn't match!");
                        if (config.getItem("DebugLevel", 1) > 1) {
                            $j().alert("User ID doesn't match!<br />" + id + '<br />' + feed.scanRecord['id']);
                        }

                        matches = false;
                    }

                    if (feed.scanRecord['monster'] !== feedMonster) {
                        con.warn("Monster doesn't match!");
                        if (config.getItem("DebugLevel", 1) > 1) {
                            $j().alert("Monster doesn't match!<br />" + feed.scanRecord['monster'] + '<br />' + feedMonster);
                        }

                        matches = false;
                    }

                    if (!feed.scanRecord['url'].hasIndexOf(page)) {
                        con.warn("Page doesn't match!");
                        if (config.getItem("DebugLevel", 1) > 1) {
                            $j().alert("Page doesn't match!<br />" + page + '<br />' + feed.scanRecord['url']);
                        }

                        matches = false;
                    }

                    if (!matches) {
                        feed.checked(monster.getItem(''));
                    }
                }

                md5 = (id + ' ' + feedMonster + ' ' + page).toLowerCase().MD5();
                if ((feed.isScan || ajax) && matches && feed.scanRecord['md5'] !== md5) {
                    con.warn("MD5 mismatch!", md5, feed.scanRecord['md5']);
                    if (config.getItem("DebugLevel", 1) > 1) {
                        $j().alert("md5 mismatch!<br />" + md5 + '<br />' + feed.scanRecord['md5']);
                    }

                    throw "MD5 mismatch!";
                }

                currentMonster = monster.getItem(md5);
                currentMonster['save'] = true;
                if ((!$u.hasContent(currentMonster['userId']) || currentMonster['userId'] === 0) && $u.hasContent(id) && id !== 0) {
                    currentMonster['userId'] = id;
                    con.log(3, "Set monster id", currentMonster['userId']);
                }

                if (!$u.hasContent(currentMonster['name']) && $u.hasContent(mName)) {
                    currentMonster['name'] = mName;
                    con.log(3, "Set monster name", currentMonster['name']);
                }

                if (!$u.hasContent(currentMonster['monster']) && $u.hasContent(feedMonster)) {
                    currentMonster['monster'] = feedMonster;
                    con.log(3, "Set monster monster", currentMonster['monster']);
                }

                if (!$u.hasContent(currentMonster['userName']) && $u.hasContent(userName)) {
                    currentMonster['userName'] = userName;
                    con.log(3, "Set monster userName", userName);
                }

                if (!$u.hasContent(currentMonster['md5'])) {
                    currentMonster['md5'] = md5;
                    con.log(3, "Set monster md5", currentMonster['md5']);
                }

                if (!$u.hasContent(currentMonster['page']) && $u.hasContent(page)) {
                    currentMonster['page'] = page;
                    con.log(3, "Set monster page", page);
                }

                if (!$u.hasContent(currentMonster['feedLink'])) {
                    if (feed.isScan || ajax) {
                        currentMonster['save'] = false;
                        currentMonster['feedLink'] = feed.scanRecord['url'];
                        con.log(3, "Set monster feedLink ajax", currentMonster['feedLink']);
                    } else {
                        feed.scanRecord = feed.getItem(md5);
                        if (feed.scanRecord) {
                            currentMonster['feedLink'] = feed.scanRecord['url'];
                            con.log(3, "Set monster feedLink from feed.scanRecord", currentMonster['feedLink']);
                        } else {
                            currentMonster['feedLink'] = page + '.php?';
                            currentMonster['feedLink'] += page !== 'festival_battle_monster' ? 'twt2&' : '';
                            currentMonster['feedLink'] += 'causer=' + id;
                            ctaDiv = $j("input[name*='help with']", slice).parents("form").eq(0);
                            tStr = $j("input[name='mpool']", ctaDiv).attr("value");
                            currentMonster['feedLink'] += $u.hasContent(tStr) ? '&mpool=' + tStr.parseInt() : '';
                            tStr = $j("input[name='mid']", ctaDiv).attr("value");
                            currentMonster['feedLink'] += $u.hasContent(tStr) ? '&mid=' + tStr : '';
                            con.log(2, "Set monster feedLink", currentMonster['feedLink']);
/*
                            if (config.getItem("DebugLevel", 1) > 1) {
                                $j().alert("Set monster feedLink<br />" + currentMonster['feedLink']);
                            }
*/
                        }
                    }
                }

                if ($u.hasContent(currentMonster['feedLink'])) {
                    tNum = currentMonster['feedLink'].regex(/mpool=(\d+)/);
                    currentMonster['mpool'] = $u.hasContent(tNum) ? '&mpool=' + tNum : '';
                    tStr = currentMonster['feedLink'].regex(/mid=(\S+)[&]*/);
                    currentMonster['mid'] = $u.hasContent(tStr) ? '&mid=' + tStr : '';
                    tNum = currentMonster['feedLink'].regex(/rix=(\d+)/);
                    currentMonster['rix'] = $u.hasContent(tNum) ? tNum : -1;
                }

                currentMonster['hide'] = false;
                currentMonster['fImg'] = $u.setContent(fMonstStyle, '');
                currentMonster['type'] = $u.setContent(currentMonster['type'], '');
                monsterInfo = monster.getInfo(currentMonster);
                con.log(2, "monsterInfo", currentMonster['monster'], monsterInfo);
                if ($u.hasContent(monsterInfo.levels)) {
                    for (it = 0; it < monsterInfo.levels.length; it += 1) {
                        groupMatch = false;
                        for (jt in groups) {
                            if (groups.hasOwnProperty(jt)) {
                                if (groups[jt]['level'] === monsterInfo.levels[it]) {
                                    currentMonster['joinable']['group' + it] = groups[jt];
                                    groupMatch = true;
                                }
                            }
                        }

                        if (!groupMatch) {
                            currentMonster['joinable']['group' + it] = {'level': monsterInfo.levels[it], 'max': monsterInfo.join[it], 'count': 0};
                        }
                    }
                }

                currentMonster['joinable']['total'] = groups['total'];
                con.log(3, "Joinable", currentMonster['joinable']);
                if (currentMonster['monster'] === 'The Deathrune Siege') {
                    tempDiv = $j("div[style*='raid_back']", slice);
                    if ($u.hasContent(tempDiv)) {
                        if ($u.hasContent($j("img[src*='raid_1_large.jpg']", tempDiv))) {
                            currentMonster['type'] = 'Raid I';
                        } else if ($u.hasContent($j("img[src*='raid_b1_large.jpg']", tempDiv))) {
                            currentMonster['type'] = 'Raid II';
                        } else if ($u.hasContent($j("img[src*='raid_1_large_victory.jpg']", tempDiv))) {
                            con.log(2, "Siege Victory!");
                            currentMonster['hide'] = true;
                            currentMonster['joinable'] = {};
                        } else {
                            con.log(2, "Problem finding raid image! Probably finished.");
                            currentMonster['hide'] = true;
                            currentMonster['joinable'] = {};
                        }

                        con.log(2, "Raid Type", currentMonster['type']);
                    } else {
                        con.warn("Problem finding raid_back");
                        return;
                    }
                }

                currentMonster['review'] = Date.now();
                state.setItem('monsterRepeatCount', 0);
                // Extract info
                tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "monsterTicker", slice);
                if ($u.hasContent(tempDiv)) {
                    time = $u.setContent(tempDiv.text(), '').regex(/(\d+):(\d+):(\d+)/);
                } else {
                    if (caap.hasImage("dead.jpg")) {
                        currentMonster['hide'] = true;
                        currentMonster['joinable'] = {};
                    } else {
                        con.warn("Could not locate Monster ticker.");
                    }
                }

                if ($u.hasContent(time) && time.length === 3 && monsterInfo && monsterInfo.fort) {
                    currentMonster['fortify'] = currentMonster['type'] === "Deathrune" || currentMonster['type'] === 'Ice Elemental' ? 100 : 0;
                    switch (monsterInfo.defense_img) {
                    case 'bar_dispel.gif' :
                        tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                        if ($u.hasContent(tempDiv)) {
                            currentMonster['fortify'] = (100 - tempDiv.getPercent('width')).dp(2);
                            tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
                            found = true;
                        } else {
                            currentMonster['fortify'] = 100;
                            con.warn("Unable to find defense bar", monsterInfo.defense_img);
                        }

                        break;
                    case 'seamonster_ship_health.jpg' :
                        tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                        if ($u.hasContent(tempDiv)) {
                            currentMonster['fortify'] = tempDiv.getPercent('width').dp(2);
                            found = true;
                            if (monsterInfo.repair_img) {
                                found = false;
                                tempDiv = $j("img[src*='" + monsterInfo.repair_img + "']", slice).parent();
                                if ($u.hasContent(tempDiv)) {
                                    currentMonster['fortify'] = (currentMonster['fortify'] * (100 / (100 - tempDiv.getPercent('width')))).dp(2);
                                    found = true;
                                } else {
                                    currentMonster['fortify'] = 100;
                                    con.warn("Unable to find repair bar", monsterInfo.repair_img);
                                }
                            }

                            if (found) {
                                tempDiv = tempDiv.parent().parent().siblings().eq(0).children().eq(0).children().eq(1);
                            }
                        } else {
                            currentMonster['fortify'] = 100;
                            con.warn("Unable to find defense bar", monsterInfo.defense_img);
                        }

                        break;
                    case 'nm_green.jpg' :
                        tempDiv = $j("img[src*='" + monsterInfo.defense_img + "']", slice).parent();
                        if ($u.hasContent(tempDiv)) {
                            currentMonster['fortify'] = tempDiv.getPercent('width').dp(2);
                            found = true;
                            tempDiv = tempDiv.parent();
                            if ($u.hasContent(tempDiv)) {
                                currentMonster['strength'] = tempDiv.getPercent('width').dp(2);
                                tempDiv = tempDiv.parent().siblings().eq(0).children().eq(0);
                            } else {
                                currentMonster['strength'] = 100;
                                con.warn("Unable to find defense bar strength");
                            }
                        } else {
                            currentMonster['fortify'] = 100;
                            currentMonster['strength'] = 100;
                            con.warn("Unable to find defense bar fortify");
                        }

                        break;
                    default:
                        con.warn("No match for defense_img", monsterInfo.defense_img);
                    }

                    if (!feed.isScan && !ajax && found && config.getItem("monsterEnableLabels", true)) {
                        tempText = tempDiv.text().trim();
                        if (!$u.hasContent(tempDiv.children()) && (tempText.toLowerCase().hasIndexOf('health') || tempText.toLowerCase().hasIndexOf('defense') || tempText.toLowerCase().hasIndexOf('armor'))) {
                            tempDiv.text(tempText + " (" + (monsterInfo.defense_img === 'bar_dispel.gif' ? (100 - currentMonster['fortify']).dp(2) : currentMonster['fortify']) + "%" + (monsterInfo.defense_img === 'nm_green.jpg' ? '/' + currentMonster['strength'] + '%': '') + ")");
                        }
                    }
                }

                // Get damage done to monster
                actionDiv = $j("#" + caap.domain.id[caap.domain.which] + "action_logs", slice);
                damageDiv = $j("td[class='dragonContainer']:first td[valign='top']:first a[href*='user=" + caap.stats['FBID'] + "']:first", actionDiv);
                if ($u.hasContent(damageDiv)) {
                    if (monsterInfo && monsterInfo.defense) {
                        tempArr = $u.setContent(damageDiv.parent().parent().siblings(":last").text(), '').trim().innerTrim().regex(/([\d,]+ dmg) \/ ([\d,]+ def)/);
                        if ($u.hasContent(tempArr) && tempArr.length === 2) {
                            currentMonster['attacked'] = $u.setContent(tempArr[0], '0').numberOnly();
                            currentMonster['defended'] = $u.setContent(tempArr[1], '0').numberOnly();
                            currentMonster['damage'] = currentMonster['attacked'] + currentMonster['defended'];
                        } else {
                            con.warn("Unable to get attacked and defended damage");
                        }
                    } else if (currentMonster['monster'] === 'The Deathrune Siege') {
                        currentMonster['attacked'] = $u.setContent(damageDiv.parent().siblings(":last").text(), '0').numberOnly();
                        currentMonster['damage'] = currentMonster['attacked'];
                    } else {
                        currentMonster['attacked'] = $u.setContent(damageDiv.parent().parent().siblings(":last").text(), '0').numberOnly();
                        currentMonster['damage'] = currentMonster['attacked'];
                    }

                    if (!feed.isScan && !ajax) {
                        damageDiv.parents("tr").eq(0).css('background-color', (gm ? gm.getItem("HighlightColor", '#C6A56F', hiddenVar) : '#C6A56F'));
                    }

                    currentMonster['hide'] = true;
                } else {
                    currentMonster['hide'] = !$u.hasContent($j("input[name='Attack Dragon'],input[name='raid_btn']", slice));
                    con.log(2, "Player hasn't done damage yet");
                }

                tBool = currentMonster['monster'] === "The Deathrune Siege" ? true : false;
                if (/:ac\b/.test(currentMonster['conditions']) || (tBool && config.getItem('raidCollectReward', false)) || (!tBool && config.getItem('monsterCollectReward', false))) {
                    counter = state.getItem('monsterReviewCounter', config.getItem("festivalTower", false) ? -4 : -3);
                    // Change from using monster name to monster MD5 - need to keep an eye open for any more
                    if (counter >= 0 && monster.records[counter] && monster.records[counter]['md5'] === currentMonster['md5'] && ($u.hasContent($j("a[href*='&action=collectReward']", slice)) || $u.hasContent($j("input[alt*='Collect Reward']", slice)))) {
                        con.log(2, 'Collecting Reward');
                        currentMonster['review'] = -1;
                        state.setItem('monsterReviewCounter', counter -= 1);
                        currentMonster['status'] = 'Collect Reward';
                        currentMonster['rix'] = currentMonster['monster'] === "The Deathrune Siege" ? $u.setContent($u.setContent($j("a[href*='&rix=']", slice).attr("href"), '').regex(/&rix=(\d+)/), -1) : -1;
                    }
                }

                monstHealthImg = monsterInfo && monsterInfo.alpha ? 'nm_red.jpg' :  'monster_health_background.jpg';
                monsterDiv = $j("img[src*='" + monstHealthImg + "']", slice).parent();
                if ($u.hasContent(time) && time.length === 3 && $u.hasContent(monsterDiv)) {
                    currentMonster['time'] = time;
                    if ($u.hasContent(monsterDiv)) {
                        currentMonster['life'] = monsterDiv.getPercent('width').dp(2);
                        if (!feed.isScan && !ajax && config.getItem("monsterEnableLabels", true)) {
                            tempDiv = monsterDiv.siblings().eq(0).children().eq(0);
                            if (!$u.hasContent(tempDiv)) {
                                tempDiv = monsterDiv.parent().parent().siblings().eq(0);
                                if ($u.hasContent(tempDiv.children())) {
                                    tempDiv = tempDiv.children().eq(0);
                                }
                            }

                            tempText = tempDiv.text().trim();
                            if (!$u.hasContent(tempDiv.children()) && (tempText.toLowerCase().hasIndexOf('life') || tempText.toLowerCase().hasIndexOf('soldiers'))) {
                                tempDiv.text(tempText + " (" + currentMonster['life'] + "%)");
                            }
                        }
                    } else {
                        con.warn("Could not find monster health div.");
                    }

                    if (currentMonster['life'] && !monsterInfo) {
                        monster.setItem(currentMonster);
                        con.warn('Unknown monster', currentMonster);
                        return;
                    }

                    if ($u.hasContent(damageDiv) && monsterInfo && monsterInfo.alpha) {
                        // Character type stuff
                        monsterDiv = $j("div[style*='nm_bottom']", slice);
                        if ($u.hasContent(monsterDiv)) {
                            tempText = $u.setContent(monsterDiv.children().eq(0).children().text(), '').trim().innerTrim();
                            if (tempText) {
                                con.log(4, "Character class text", tempText);
                                tStr = tempText.regex(/Class: (\w+) /);
                                if ($u.hasContent(tStr)) {
                                    currentMonster['charClass'] = tStr;
                                    con.log(4, "character", currentMonster['charClass']);
                                } else {
                                    con.warn("Can't get character", tempText);
                                }

                                tStr = tempText.regex(/Tip: ([\w ]+) Status/);
                                if ($u.hasContent(tStr)) {
                                    currentMonster['tip'] = tStr;
                                    con.log(4, "tip", currentMonster['tip']);
                                } else {
                                    con.warn("Can't get tip", tempText);
                                }

                                tempArr = tempText.regex(/Status Time Remaining: (\d+):(\d+):(\d+)\s*/);
                                if ($u.hasContent(tempArr) && tempArr.length === 3) {
                                    currentMonster['stunTime'] = Date.now() + (tempArr[0] * 60 * 60 * 1000) + (tempArr[1] * 60 * 1000) + (tempArr[2] * 1000);
                                    con.log(4, "statusTime", currentMonster['stunTime']);
                                } else {
                                    con.warn("Can't get statusTime", tempText);
                                }

                                tempDiv = $j("img[src*='nm_stun_bar']", monsterDiv);
                                if ($u.hasContent(tempDiv)) {
                                    tempText = tempDiv.getPercent('width').dp(2);
                                    con.log(4, "Stun bar percent text", tempText);
                                    if (tempText >= 0) {
                                        currentMonster['stun'] = tempText;
                                        con.log(4, "stun", currentMonster['stun']);
                                    } else {
                                        con.warn("Can't get stun bar width");
                                    }
                                } else {
                                    tempArr = currentMonster['tip'].split(" ");
                                    if ($u.hasContent(tempArr)) {
                                        tempText = tempArr[tempArr.length - 1].toLowerCase();
                                        tempArr = ["strengthen", "heal"];
                                        if (tempText && tempArr.hasIndexOf(tempText)) {
                                            if (tempText === tempArr[0]) {
                                                currentMonster['stun'] = currentMonster['strength'];
                                            } else if (tempText === tempArr[1]) {
                                                currentMonster['stun'] = currentMonster['health'];
                                            } else {
                                                con.warn("Expected strengthen or heal to match!", tempText);
                                            }
                                        } else {
                                            con.warn("Expected strengthen or heal from tip!", tempText);
                                        }
                                    } else {
                                        con.warn("Can't get stun bar and unexpected tip!", currentMonster['tip']);
                                    }
                                }

                                if (currentMonster['charClass'] && currentMonster['tip'] && currentMonster['stun'] !== -1) {
                                    currentMonster['stunDo'] = new RegExp(currentMonster['charClass']).test(currentMonster['tip']) && currentMonster['stun'] < 100;
                                    currentMonster['stunType'] = '';
                                    if (currentMonster['stunDo']) {
                                        con.log(2, "Do character specific attack", currentMonster['stunDo']);
                                        tempArr = currentMonster['tip'].split(" ");
                                        if ($u.hasContent(tempArr)) {
                                            tempText = tempArr[tempArr.length - 1].toLowerCase();
                                            tempArr = ["strengthen", "cripple", "heal", "deflection"];
                                            if (tempText && tempArr.hasIndexOf(tempText)) {
                                                currentMonster['stunType'] = tempText.replace("ion", '');
                                                con.log(2, "Character specific attack type", currentMonster['stunType']);
                                            } else {
                                                con.warn("Type does match list!", tempText);
                                            }
                                        } else {
                                            con.warn("Unable to get type from tip!", currentMonster);
                                        }
                                    } else {
                                        con.log(3, "Tip does not match class or stun maxed", currentMonster);
                                    }
                                } else {
                                    con.warn("Missing 'class', 'tip' or 'stun'", currentMonster);
                                }
                            } else {
                                con.warn("Missing tempText");
                            }
                        } else {
                            con.warn("Missing nm_bottom");
                        }
                    }

                    if (monsterInfo) {
                        if (monsterInfo.siege) {
                            currentMonster['miss'] = $u.setContent($u.setContent($j("div[style*='monster_layout'],div[style*='nm_bottom'],div[style*='raid_back']", slice).text(), '').trim().innerTrim().regex(/Need (\d+) more/i), 0);
                            for (ind = 0, len = monsterInfo.siege_img.length; ind < len; ind += 1) {
                                searchStr += "img[src*='" + monsterInfo.siege_img[ind] + "']";
                                if (ind < len - 1) {
                                    searchStr += ",";
                                }
                            }

                            searchRes = $j(searchStr, slice);
                            if ($u.hasContent(searchRes)) {
                                totalCount = currentMonster['monster'] === "The Deathrune Siege" ? $u.setContent(searchRes.attr("src"), '').basename().replace(new RegExp(".*(\\d+).*", "gi"), "$1").parseInt() : searchRes.size() + 1;
                            }

                            currentMonster['phase'] = Math.min(totalCount, monsterInfo.siege);
                            if ($u.isNaN(currentMonster['phase']) || currentMonster['phase'] < 1) {
                                currentMonster['phase'] = 1;
                            }
                        }

                        currentMonster['t2k'] = monster.t2kCalc(currentMonster);
                    }
                } else {
                    con.log(2, 'Monster is dead or fled');
                    currentMonster['color'] = 'grey';
                    if (currentMonster['status'] !== 'Complete' && currentMonster['status'] !== 'Collect Reward') {
                        currentMonster['status'] = "Dead or Fled";
                    }

                    currentMonster['hide'] = true;
                    currentMonster['joinable'] = {};
                    session.setItem('resetselectMonster', true);
                    monster.setItem(currentMonster);
                    return;
                }

                if ($u.hasContent(damageDiv)) {
                    achLevel = monster.parseCondition('ach', currentMonster['conditions']);
                    if (monsterInfo && achLevel === false) {
                        achLevel = monsterInfo.ach;
                    }

                    maxDamage = monster.parseCondition('max', currentMonster['conditions']);
                    maxToFortify = monster.parseCondition('f%', currentMonster['conditions']);
                    maxToFortify = maxToFortify !== false ? maxToFortify : config.getItem('MaxToFortify', 0);
                    targetFromfortify = state.getItem('targetFromfortify', new monster.energyTarget().data);
                    if (currentMonster['md5'] === targetFromfortify['md5']) {
                        switch (targetFromfortify['type']) {
                        case 'Fortify' :
                            if (currentMonster['fortify'] > maxToFortify) {
                                session.setItem('resetselectMonster', true);
                            }

                            break;
                        case 'Strengthen':
                            if (currentMonster['strength'] >= 100) {
                                session.setItem('resetselectMonster', true);
                            }

                            break;
                        case 'Stun':
                            if (!currentMonster['stunDo']) {
                                session.setItem('resetselectMonster', true);
                            }

                            break;
                        default:
                        }
                    }

                    // Start of Keep On Budget (KOB) code Part 1 -- required variables
                    con.log(2, 'Start of Keep On Budget (KOB) Code');

                    //default is disabled for everything
                    KOBenable = false;

                    //default is zero bias hours for everything
                    KOBbiasHours = 0;

                    //KOB needs to follow achievment mode for this monster so that KOB can be skipped.
                    KOBach = false;

                    //KOB needs to follow max mode for this monster so that KOB can be skipped.
                    KOBmax = false;

                    //KOB needs to follow minimum fortification state for this monster so that KOB can be skipped.
                    KOBminFort = false;

                    //create a temp variable so we don't need to call parseCondition more than once for each if statement
                    KOBtmp = monster.parseCondition('kob', currentMonster['conditions']);
                    if (KOBtmp !== false && $u.isNaN(KOBtmp)) {
                        con.log(2, 'KOB NaN branch');
                        KOBenable = true;
                        KOBbiasHours = 0;
                    } else if (KOBtmp === false) {
                        con.log(2, 'KOB false branch');
                        KOBenable = false;
                        KOBbiasHours = 0;
                    } else {
                        con.log(2, 'KOB passed value branch');
                        KOBenable = true;
                        KOBbiasHours = KOBtmp;
                    }

                    //test if user wants kob active globally
                    if (!KOBenable && (gm ? gm.getItem('KOBAllMonters', false, hiddenVar) : false)) {
                        KOBenable = true;
                    }

                    //disable kob if in level up mode or if we are within 5 stamina of max potential stamina
                    if (caap.inLevelUpMode() || caap.stats['stamina']['num'] >= caap.stats['stamina']['max'] - 5) {
                        KOBenable = false;
                    }

                    if (KOBenable) {
                        con.log(2, 'Level Up Mode: ', caap.inLevelUpMode());
                        con.log(2, 'Stamina Avail: ', caap.stats['stamina']['num']);
                        con.log(2, 'Stamina Max: ', caap.stats['stamina']['max']);

                        //log results of previous two tests
                        con.log(2, 'KOBenable: ', KOBenable);
                        con.log(2, 'KOB Bias Hours: ', KOBbiasHours);
                    }

                    //Total Time alotted for monster
                    KOBtotalMonsterTime = monsterInfo.duration;
                    if (KOBenable) {
                        con.log(2, 'Total Time for Monster: ', KOBtotalMonsterTime);

                        //Total Damage remaining
                        con.log(2, 'HP left: ', currentMonster['life']);
                    }

                    //Time Left Remaining
                    KOBtimeLeft = time[0] + (time[1] * 0.0166);
                    if (KOBenable) {
                        con.log(2, 'TimeLeft: ', KOBtimeLeft);
                    }

                    //calculate the bias offset for time remaining
                    KOBbiasedTF = KOBtimeLeft - KOBbiasHours;

                    //for 7 day monsters we want kob to not permit attacks (beyond achievement level) for the first 24 to 48 hours
                    // -- i.e. reach achievement and then wait for more players and siege assist clicks to catch up
                    if (KOBtotalMonsterTime >= 168) {
                        KOBtotalMonsterTime = KOBtotalMonsterTime - (gm ? gm.getItem('KOBDelayStart', 48, hiddenVar) : 48);
                    }

                    //Percentage of time remaining for the currently selected monster
                    KOBPercentTimeRemaining = Math.round(KOBbiasedTF / KOBtotalMonsterTime * 1000) / 10;
                    if (KOBenable) {
                        con.log(2, 'Percent Time Remaining: ', KOBPercentTimeRemaining);
                    }

                    // End of Keep On Budget (KOB) code Part 1 -- required variables

                    isTarget = (currentMonster['name'] === state.getItem('targetFromraid', '') ||
                                currentMonster['name'] === state.getItem('targetFrombattle_monster', '') ||
                                currentMonster['name'] === targetFromfortify['name']);

                    if (maxDamage && currentMonster['damage'] >= maxDamage) {
                        currentMonster['color'] = 'red';
                        currentMonster['over'] = 'max';
                        //used with KOB code
                        KOBmax = true;
                        //used with kob debugging
                        if (KOBenable) {
                            con.log(2, 'KOB - max activated');
                        }

                        if (isTarget) {
                            session.setItem('resetselectMonster', true);
                        }
                    } else if (currentMonster['fortify'] !== -1 && currentMonster['fortify'] < config.getItem('MinFortToAttack', 1)) {
                        currentMonster['color'] = 'purple';
                        //used with KOB code
                        KOBminFort = true;
                        //used with kob debugging
                        if (KOBenable) {
                            con.log(2, 'KOB - MinFort activated');
                        }

                        if (isTarget) {
                            session.setItem('resetselectMonster', true);
                        }
                    } else if (currentMonster['damage'] >= achLevel && (config.getItem('AchievementMode', false) || monster.parseCondition('ach', currentMonster['conditions']) !== false)) {
                        currentMonster['color'] = 'darkorange';
                        currentMonster['over'] = 'ach';
                        //used with KOB code
                        KOBach = true;
                        //used with kob debugging
                        if (KOBenable) {
                            con.log(2, 'KOB - achievement reached');
                        }

                        if (isTarget && currentMonster['damage'] < achLevel) {
                            session.setItem('resetselectMonster', true);
                        }
                    }

                    //Start of KOB code Part 2 begins here
                    if (KOBenable && !KOBmax && !KOBminFort && KOBach && currentMonster['life'] < KOBPercentTimeRemaining) {
                        //kob color
                        currentMonster['color'] = 'magenta';
                        // this line is required or we attack anyway.
                        currentMonster['over'] = 'max';
                        //used with kob debugging
                        if (KOBenable) {
                            con.log(2, 'KOB - budget reached');
                        }

                        if (isTarget) {
                            session.setItem('resetselectMonster', true);
                            con.log(1, 'This monster no longer a target due to kob');
                        }
                    } else {
                        if (!KOBmax && !KOBminFort && !KOBach) {
                            //the way that the if statements got stacked, if it wasn't kob it was painted black anyway
                            //had to jump out the black paint if max, ach or fort needed to paint the entry.
                            currentMonster['color'] = $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
                        }
                    }
                    //End of KOB code Part 2 stops here.
                } else {
                    currentMonster['color'] = $u.bestTextColor(state.getItem("StyleBackgroundLight", "#E0C961"));
                }

                monster.setItem(currentMonster);
                con.log(3, "currentMonster", currentMonster);
                monster.select(true);
                caap.updateDashboard(true);
                if (schedule.check('battleTimer')) {
                    window.setTimeout(function () {
                        caap.setDivContent('monster_mess', '');
                    }, 2000);
                }
            } catch (err) {
                con.error("ERROR in checkResults_viewFight: " + err);
            }
        },

        /*-------------------------------------------------------------------------------------\
        MonsterReview is a primary action subroutine to mange the monster and raid list
        on the dashboard
        \-------------------------------------------------------------------------------------*/
        monsterReview: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                We do monster review once an hour.  Some routines may reset this timer to drive
                MonsterReview immediately.
                \-------------------------------------------------------------------------------------*/
                if (!schedule.check("monsterReview") || (config.getItem('WhenMonster', 'Never') === 'Never' && config.getItem('WhenBattle', 'Never') === 'Never')) {
                    return false;
                }

                /*-------------------------------------------------------------------------------------\
                We get the monsterReviewCounter.  This will be set to -3 if we are supposed to refresh
                the monsterOl completely. Otherwise it will be our index into how far we are into
                reviewing monsterOl.
                \-------------------------------------------------------------------------------------*/
                var fCounter    = config.getItem("festivalTower", false) ? -4 : -3,
                    counter     = state.getItem('monsterReviewCounter', fCounter),
                    link        = '',
                    tempTime    = 0,
                    isSiege     = false,
                    monsterInfo = {};

                if (counter === fCounter) {
                    state.setItem('monsterReviewCounter', counter += 1);
                    return true;
                }

                // festival tower
                if (config.getItem("festivalTower", false) && counter === -3) {
                    if (caap.stats['level'] > 6) {
                        if (caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg')) {
                            state.setItem('reviewDone', false);
                            return true;
                        }
                    } else {
                        con.log(1, "Monsters: Unlock at level 7");
                        state.setItem('reviewDone', true);
                    }

                    /*
                    if (config.getItem('clearCompleteMonsters', false) && $u.hasContent(monster.completeButton['battle_monster']['button']) && $u.hasContent(monster.completeButton['battle_monster']['md5'])) {
                        caap.click(monster.completeButton['battle_monster']['button']);
                        monster.deleteItem(monster.completeButton['battle_monster']['md5']);
                        monster.completeButton['battle_monster'] = {'md5': undefined, 'name': undefined, 'button': undefined};
                        caap.updateDashboard(true);
                        con.log(1, 'Cleared a completed monster');
                        return true;
                    }
                    */

                    if (state.getItem('reviewDone', true)) {
                        state.setItem('monsterReviewCounter', counter += 1);
                    } else {
                        return true;
                    }
                }

                if (counter === -2) {
                    if (caap.stats['level'] > 6) {
                        if (caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                            state.setItem('reviewDone', false);
                            return true;
                        }
                    } else {
                        con.log(1, "Monsters: Unlock at level 7");
                        state.setItem('reviewDone', true);
                    }

                    if (config.getItem('clearCompleteMonsters', false) && $u.hasContent(monster.completeButton['battle_monster']['button']) && $u.hasContent(monster.completeButton['battle_monster']['md5'])) {
                        caap.click(monster.completeButton['battle_monster']['button']);
                        monster.deleteItem(monster.completeButton['battle_monster']['md5']);
                        monster.completeButton['battle_monster'] = {'md5': undefined, 'name': undefined, 'button': undefined};
                        caap.updateDashboard(true);
                        con.log(1, 'Cleared a completed monster');
                        return true;
                    }

                    if (state.getItem('reviewDone', true)) {
                        state.setItem('monsterReviewCounter', counter += 1);
                    } else {
                        return true;
                    }
                }

                if (counter === -1) {
                    if (caap.stats['level'] > 7) {
                        // This is a temporary fix for the web3 url until CA fix their HTML
                        if (caap.domain.which === 2 && !$u.hasContent($j("img[src*='tab_raid_']", caap.appBodyDiv))) {
                            if (caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                                return true;
                            }

                            caap.clickAjaxLinkSend("raid.php");
                            return true;
                        }

                        if (caap.navigateTo(caap.battlePage + ',raid', 'tab_raid_on.gif')) {
                            state.setItem('reviewDone', false);
                            return true;
                        }
                    } else {
                        con.log(1, "Raids: Unlock at level 8");
                        state.setItem('reviewDone', true);
                    }

                    if (config.getItem('clearCompleteRaids', false) && $u.hasContent(monster.completeButton['raid']['button']) && $u.hasContent(monster.completeButton['raid']['md5'])) {
                        caap.click(monster.completeButton['raid']['button']);
                        monster.deleteItem(monster.completeButton['raid']['md5']);
                        monster.completeButton['raid'] = {'md5': undefined, 'name': undefined, 'button': undefined};
                        caap.updateDashboard(true);
                        con.log(1, 'Cleared a completed raid');
                        return true;
                    }

                    if (state.getItem('reviewDone', true)) {
                        state.setItem('monsterReviewCounter', counter += 1);
                    } else {
                        return true;
                    }
                }

                if (monster.records && monster.records.length === 0) {
                    return false;
                }

                /*-------------------------------------------------------------------------------------\
                Now we step through the monsterOl objects. We set monsterReviewCounter to the next
                index for the next reiteration since we will be doing a click and return in here.
                \-------------------------------------------------------------------------------------*/
                while (counter < monster.records.length) {
                    if (!monster.records[counter]) {
                        state.setItem('monsterReviewCounter', counter += 1);
                        continue;
                    }
                    /*-------------------------------------------------------------------------------------\
                    If we looked at this monster more recently than an hour ago, skip it
                    \-------------------------------------------------------------------------------------*/
                    if (monster.records[counter]['color'] === 'grey' && monster.records[counter]['life'] !== -1) {
                        monster.records[counter]['life'] = -1;
                        monster.records[counter]['fortify'] = -1;
                        monster.records[counter]['strength'] = -1;
                        monster.records[counter]['time'] = [];
                        monster.records[counter]['t2k'] = -1;
                        monster.records[counter]['phase'] = '';
                        monster.save();
                    }

                    tempTime = monster.records[counter]['review'] ? monster.records[counter]['review'] : -1;
                    con.log(4, "Review", monster.records[counter], !schedule.since(tempTime, (gm ? gm.getItem("MonsterLastReviewed", 15, hiddenVar) : 15) * 60));
                    if (monster.records[counter]['status'] === 'Complete' || !schedule.since(tempTime, (gm ? gm.getItem("MonsterLastReviewed", 15, hiddenVar) : 15) * 60) || state.getItem('monsterRepeatCount', 0) > 2) {
                        state.setItem('monsterReviewCounter', counter += 1);
                        state.setItem('monsterRepeatCount', 0);
                        continue;
                    }
                    /*-------------------------------------------------------------------------------------\
                    We get our monster link
                    \-------------------------------------------------------------------------------------*/
                    caap.setDivContent('monster_mess', 'Reviewing/sieging ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
                    link = monster.records[counter]['link'];
                    /*-------------------------------------------------------------------------------------\
                    If the link is good then we get the url and any conditions for monster
                    \-------------------------------------------------------------------------------------*/
                    if (/href/.test(link)) {
                        link = link.split("'")[1];
                        /*-------------------------------------------------------------------------------------\
                        If the autocollect token was specified then we set the link to do auto collect. If
                        the conditions indicate we should not do sieges then we fix the link.
                        \-------------------------------------------------------------------------------------*/
                        isSiege = monster.records[counter]['monster'] === 'The Deathrune Siege' ? true : false;
                        monsterInfo = monster.getInfo(monster.records[counter]);
                        con.log(4, "monster.records[counter]", monster.records[counter]);
                        if (((monster.records[counter]['conditions'] && /:ac\b/.test(monster.records[counter]['conditions'])) ||
                                (isSiege && config.getItem('raidCollectReward', false)) ||
                                (!isSiege && config.getItem('monsterCollectReward', false))) && monster.records[counter]['status'] === 'Collect Reward') {

                            if (general.Select('CollectGeneral')) {
                                return true;
                            }

                            link += '&action=collectReward';
                            if (isSiege) {
                                if (monster.records[counter]['rix'] !== -1)  {
                                    link += '&rix=' + monster.records[counter]['rix'];
                                } else {
                                    link += '&rix=2';
                                }
                            }

                            link = link.replace('&action=doObjective', '');
                            state.setItem('CollectedRewards', true);
                        } else if ((monster.records[counter]['conditions'] && monster.records[counter]['conditions'].match(':!s')) ||
                                   (!config.getItem('raidDoSiege', true) && isSiege) ||
                                   (!config.getItem('monsterDoSiege', true) && !isSiege && monsterInfo && monsterInfo.siege) ||
                                   caap.stats['stamina']['num'] === 0) {
                            con.log(2, "Do not siege");
                            link = link.replace('&action=doObjective', '');
                        }
                        /*-------------------------------------------------------------------------------------\
                        Now we use ajaxSendLink to display the monsters page.
                        \-------------------------------------------------------------------------------------*/
                        con.log(1, 'Reviewing ' + (counter + 1) + '/' + monster.records.length + ' ' + monster.records[counter]['name']);
                        session.setItem('ReleaseControl', true);
                        //link = link.replace(caap.domain.link + '/', '').replace('?', '?twt2&');
                        link = link.replace(caap.domain.altered + '/', '').replace('?', '?twt2&');

                        con.log(3, "Link", link);
                        caap.clickAjaxLinkSend(link);
                        state.setItem('monsterRepeatCount', state.getItem('monsterRepeatCount', 0) + 1);
                        session.setItem('resetselectMonster', true);
                        return true;
                    }
                }
                /*-------------------------------------------------------------------------------------\
                All done.  Set timer and tell monster.select and dashboard they need to do thier thing.
                We set the monsterReviewCounter to do a full refresh next time through.
                \-------------------------------------------------------------------------------------*/
                schedule.setItem("monsterReview", (gm ? gm.getItem('monsterReviewMins', 60, hiddenVar) : 60) * 60, 300);
                session.setItem('resetselectMonster', true);
                state.setItem('monsterReviewCounter', config.getItem("festivalTower", false) ? -4 : -3);
                con.log(1, 'Done with monster/raid review.');
                caap.setDivContent('monster_mess', '');
                caap.updateDashboard(true);
                if (state.getItem('CollectedRewards', false)) {
                    state.setItem('CollectedRewards', false);
                    monster.flagReview();
                }

                return true;
            } catch (err) {
                con.error("ERROR in monsterReview: " + err);
                return false;
            }
        },

        monsters: function () {
            try {
                if (config.getItem('WhenMonster', 'Never') === 'Never') {
                    caap.setDivContent('monster_mess', 'Monster off');
                    return false;
                }

                ///////////////// Reivew/Siege all monsters/raids \\\\\\\\\\\\\\\\\\\\\\

                if (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && caap.needToHide() && caap.checkStamina('Monster', 1)) {
                    con.log(1, "Stay Hidden Mode: We're not safe. Go battle.");
                    caap.setDivContent('monster_mess', 'Not Safe For Monster. Battle!');
                    return false;
                }

                if (!schedule.check('NotargetFrombattle_monster')) {
                    return false;
                }

                ///////////////// Individual Monster Page \\\\\\\\\\\\\\\\\\\\\\

                // Establish a delay timer when we are 1 stamina below attack level.
                // Timer includes 5 min for stamina tick plus user defined random interval
                if (!caap.inLevelUpMode() && caap.stats['stamina']['num'] === (state.getItem('MonsterStaminaReq', 1) - 1) && schedule.check('battleTimer') && config.getItem('seedTime', 0) > 0) {
                    schedule.setItem('battleTimer', 300, config.getItem('seedTime', 0));
                    caap.setDivContent('monster_mess', 'Monster Delay Until ' + caap.displayTime('battleTimer'));
                    return false;
                }

                if (!schedule.check('battleTimer')) {
                    if (caap.stats['stamina']['num'] < general.GetStaminaMax(config.getItem('IdleGeneral', 'Use Current'))) {
                        caap.setDivContent('monster_mess', 'Monster Delay Until ' + caap.displayTime('battleTimer'));
                        return false;
                    }
                }

                var fightMode        = '',
                    targetMonster    = state.getItem('targetFromfortify', new monster.energyTarget().data),
                    monsterName      = targetMonster['name'],
                    nodeNum          = 0,
                    energyRequire    = 10,
                    currentMonster   = monster.getItem(targetMonster['md5']),
                    monsterInfo      = monster.getInfo(currentMonster),
                    attackButton     = null,
                    singleButtonList = [],
                    buttonList       = [],
                    tacticsValue     = 0,
                    useTactics       = false,
                    attackMess       = '',
                    pageUserCheck    = 0,
                    it               = 0,
                    len              = 0,
                    buttonHref       = '',
                    theGeneral       = config.getItem('FortifyGeneral', 'Use Current');

                monsterInfo = $u.hasContent(currentMonster['type']) ? (currentMonster['type'] === "Raid II" ? monsterInfo.stage2 : monsterInfo.stage1) : monsterInfo;
                if (monsterInfo) {
                    if (!caap.inLevelUpMode() && config.getItem('PowerFortifyMax', false) && monsterInfo.staLvl) {
                        for (nodeNum = monsterInfo.staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                            if (caap.stats['stamina']['max'] >= monsterInfo.staLvl[nodeNum]) {
                                break;
                            }
                        }
                    }

                    energyRequire = $u.isDefined(nodeNum) && nodeNum >= 0 && config.getItem('PowerAttackMax', false) && monsterInfo.nrgMax ? monsterInfo.nrgMax[nodeNum] : monsterInfo.nrgMax ? monsterInfo.nrgMax[0] : energyRequire;
                }

                con.log(4, "Energy Required/Node", energyRequire, nodeNum);
                theGeneral = theGeneral === "Under Level" ? (config.getItem('ReverseLevelUpGenerals') ? general.GetLevelUpNames().reverse().pop() : general.GetLevelUpNames().pop()) : theGeneral;
                switch (theGeneral) {
                case 'Orc King':
                    energyRequire = energyRequire * (general.GetLevel('Orc King') + 1);
                    con.log(3, 'Monsters Fortify:Orc King', energyRequire);
                    break;
                case 'Barbarus':
                    energyRequire = energyRequire * (general.GetLevel('Barbarus') === 4 ? 3 : 2);
                    con.log(3, 'Monsters Fortify:Barbarus', energyRequire);
                    break;
                case 'Maalvus':
                    energyRequire = energyRequire * (general.GetLevel('Maalvus') >= 3 ? 3 : 2);
                    con.log(2, 'Monsters Fortify:Maalvus', energyRequire);
                    break;
                default:
                }

                // Check to see if we should fortify or attack monster
                if (monsterName && caap.checkEnergy(energyRequire, (gm ? gm.getItem('WhenFortify', 'Energy Available', hiddenVar) : 'Energy Available'), 'fortify_mess')) {
                    fightMode = 'Fortify';
                } else {
                    targetMonster = state.getItem('targetFrombattle_monster', '');
                    currentMonster = monster.getItem(targetMonster);
                    monsterName = currentMonster['name'];
                    monsterInfo = monster.getInfo(currentMonster);
                    if (monsterName && caap.checkStamina('Monster', state.getItem('MonsterStaminaReq', 1)) && currentMonster['page'].replace('festival_battle_monster', 'battle_monster') === 'battle_monster') {
                        fightMode = 'Monster';
                    } else {
                        schedule.setItem('NotargetFrombattle_monster', 60);
                        return false;
                    }
                }

                // Set right general
                if (general.Select(fightMode + 'General')) {
                    return true;
                }

                // Check if on engage monster page
                if ($u.hasContent($j("div[style*='dragon_title_owner'],div[style*='nm_top'],div[style*='monster_header_'],div[style*='monster_'][style*='_header'],div[style*='festival_monsters_top_']", caap.appBodyDiv))) {
                    if (monster.confirmRightPage(monsterName)) {
                        return true;
                    }

                    singleButtonList = [
                        'button_nm_p_attack.gif',
                        'attack_monster_button.jpg',
                        'event_attack1.gif',
                        'seamonster_attack.gif',
                        'event_attack2.gif',
                        'attack_monster_button2.jpg'
                    ];

                    // Find the attack or fortify button
                    if (fightMode === 'Fortify') {
                        buttonList = [
                            'seamonster_fortify.gif',
                            'button_dispel.gif',
                            'attack_monster_button3.jpg'
                        ];

                        if (monsterInfo && monsterInfo.fortify_img) {
                            buttonList.unshift(monsterInfo.fortify_img[0]);
                        }

                        if (currentMonster && currentMonster['stunDo'] && currentMonster['stunType'] !== '') {
                            buttonList.unshift("button_nm_s_" + currentMonster['stunType']);
                        } else {
                            buttonList.unshift("button_nm_s_");
                        }
                    } else if (state.getItem('MonsterStaminaReq', 1) === 1) {
                        // not power attack only normal attacks
                        buttonList = singleButtonList;
                    } else {
                        if (currentMonster['conditions'] && currentMonster['conditions'].match(/:tac/i) && caap.stats['level'] >= 50) {
                            useTactics = true;
                            tacticsValue = monster.parseCondition("tac%", currentMonster['conditions']);
                        } else if (config.getItem('UseTactics', false) && caap.stats['level'] >= 50) {
                            useTactics = true;
                            tacticsValue = config.getItem('TacticsThreshold', false);
                        }

                        if (tacticsValue !== false && currentMonster['fortify'] && currentMonster['fortify'] < tacticsValue) {
                            con.log(2, "Party health is below threshold value", currentMonster['fortify'], tacticsValue);
                            useTactics = false;
                        }

                        if (useTactics && caap.hasImage('nm_button_tactics.gif')) {
                            con.log(2, "Attacking monster using tactics buttons");
                            buttonList = ['nm_button_tactics.gif'].concat(singleButtonList);
                        } else {
                            con.log(2, "Attacking monster using regular buttons");
                            useTactics = false;
                            // power attack or if not seamonster power attack or if not regular attack -
                            // need case for seamonster regular attack?
                            buttonList = [
                                'button_nm_p_power',
                                'button_nm_p_',
                                'power_button_',
                                'attack_monster_button2.jpg',
                                'event_attack2.gif',
                                'seamonster_power.gif',
                                'event_attack1.gif',
                                'attack_monster_button.jpg'
                            ].concat(singleButtonList);

                            if (monsterInfo && monsterInfo.attack_img) {
                                if (!caap.inLevelUpMode() && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false)) {
                                    buttonList.unshift(monsterInfo.attack_img[1]);
                                } else {
                                    buttonList.unshift(monsterInfo.attack_img[0]);
                                }
                            }
                        }
                    }

                    con.log(4, "monster/button list", currentMonster, buttonList);
                    nodeNum = 0;
                    if (!caap.inLevelUpMode()) {
                        if (((fightMode === 'Fortify' && config.getItem('PowerFortifyMax', false)) || (fightMode !== 'Fortify' && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false))) && monsterInfo.staLvl) {
                            for (nodeNum = monsterInfo.staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                                if (caap.stats['stamina']['max'] >= monsterInfo.staLvl[nodeNum]) {
                                    break;
                                }
                            }
                        }
                    }

                    for (it = 0, len = buttonList.length; it < len; it += 1) {
                        attackButton = caap.checkForImage(buttonList[it], null, null, nodeNum);
                        if ($u.hasContent(attackButton)) {
                            break;
                        }
                    }

                    if (attackButton) {
                        if (fightMode === 'Fortify') {
                            attackMess = 'Fortifying ' + monsterName;
                        } else if (useTactics) {
                            attackMess = 'Tactic Attacking ' + monsterName;
                        } else {
                            attackMess = (state.getItem('MonsterStaminaReq', 1) >= 5 ? 'Power' : 'Single') + ' Attacking ' + monsterName;
                        }

                        con.log(1, attackMess);
                        caap.setDivContent('monster_mess', attackMess);
                        session.setItem('ReleaseControl', true);
                        caap.click(attackButton);
                        return true;
                    } else {
                        con.warn('No button to attack/fortify with.');
                        schedule.setItem('NotargetFrombattle_monster', 60);
                        return false;
                    }
                }

                ///////////////// Check For Monster Page \\\\\\\\\\\\\\\\\\\\\\
                if (currentMonster['page'] === 'battle_monster') {
                    if (caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif')) {
                        return true;
                    }
                } else if (currentMonster['page'] === 'festival_battle_monster') {
                    if (caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg')) {
                        return true;
                    }
                } else {
                    con.warn('What kind of monster?', currentMonster);
                    return false;
                }

                buttonHref = $u.setContent($j("img[src*='dragon_list_btn_']", caap.appBodyDiv).eq(0).parent().attr("href"), '');
                pageUserCheck = session.getItem('pageUserCheck', 0);
                if (pageUserCheck && (!buttonHref || !new RegExp('user=' + caap.stats['FBID']).test(buttonHref) || !/alchemy\.php/.test(buttonHref))) {
                    con.log(2, "On another player's keep.", pageUserCheck);
                    if (currentMonster['page'] === 'battle_monster') {
                        return caap.navigateTo('keep,battle_monster', 'tab_monster_list_on.gif');
                    } else if (currentMonster['page'] === 'festival_battle_monster') {
                        return caap.navigateTo('soldiers,festival_home,festival_tower', 'festival_monster_towerlist_button.jpg');
                    } else {
                        con.warn('What kind of monster?', currentMonster);
                        return false;
                    }
                }

                if (config.getItem('clearCompleteMonsters', false) && $u.hasContent(monster.completeButton['battle_monster']['button']) && $u.hasContent(monster.completeButton['battle_monster']['md5'])) {
                    caap.click(monster.completeButton['battle_monster']['button']);
                    monster.deleteItem(monster.completeButton['battle_monster']['md5']);
                    monster.completeButton['battle_monster'] = {'md5': undefined, 'name': undefined, 'button': undefined};
                    caap.updateDashboard(true);
                    con.log(1, 'Cleared a completed monster');
                    return true;
                }

                if ($u.hasContent(monster.engageButtons[currentMonster['md5']])) {
                    caap.setDivContent('monster_mess', 'Opening ' + monsterName);
                    caap.click(monster.engageButtons[currentMonster['md5']]);
                    return true;
                } else {
                    schedule.setItem('NotargetFrombattle_monster', 60);
                    con.warn('No "Engage" button for ', monsterName);
                    return false;
                }
            } catch (err) {
                con.error("ERROR in monsters: " + err);
                return false;
            }
        },

        demi: {
            'ambrosia' : {
                'power' : {
                    'total' : 0,
                    'max'   : 0,
                    'next'  : 0
                },
                'daily' : {
                    'num' : 0,
                    'max' : 0,
                    'dif' : 0
                }
            },
            'malekus' : {
                'power' : {
                    'total' : 0,
                    'max'   : 0,
                    'next'  : 0
                },
                'daily' : {
                    'num' : 0,
                    'max' : 0,
                    'dif' : 0
                }
            },
            'corvintheus' : {
                'power' : {
                    'total' : 0,
                    'max'   : 0,
                    'next'  : 0
                },
                'daily' : {
                    'num' : 0,
                    'max' : 0,
                    'dif' : 0
                }
            },
            'aurora' : {
                'power' : {
                    'total' : 0,
                    'max'   : 0,
                    'next'  : 0
                },
                'daily' : {
                    'num' : 0,
                    'max' : 0,
                    'dif' : 0
                }
            },
            'azeron' : {
                'power' : {
                    'total' : 0,
                    'max'   : 0,
                    'next'  : 0
                },
                'daily' : {
                    'num' : 0,
                    'max' : 0,
                    'dif' : 0
                }
            }
        },
        /*jslint sub: false */

        loadDemi: function () {
            var demis = gm.getItem('demipoint.records', 'default');
            if (demis === 'default' || !$j.isPlainObject(demis)) {
                demis = gm.setItem('demipoint.records', caap.demi);
            }

            $j.extend(true, caap.demi, demis);
            con.log(4, 'Demi', caap.demi);
            session.setItem("UserDashUpdate", true);
        },

        SaveDemi: function (src) {
            if (caap.domain.which === 3) {
                caap.messaging.setItem('caap.demi', caap.demi);
            } else {
                gm.setItem('demipoint.records', caap.demi);
                con.log(4, 'Demi', caap.demi);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    con.log(2, "caap.SaveDemi send");
                    caap.messaging.setItem('caap.stats', caap.stats);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("UserDashUpdate", true);
            }
        },

        demiTable: {
            0 : 'ambrosia',
            1 : 'malekus',
            2 : 'corvintheus',
            3 : 'aurora',
            4 : 'azeron'
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_battle: function () {
            try {
                var symDiv  = $j(),
                    points  = [],
                    success = true;

                battle.checkResults();
                symDiv = caap.appBodyDiv.find("img[src*='symbol_tiny_']").not("img[src*='rewards.jpg']");
                if ($u.hasContent(symDiv) && symDiv.length === 5) {
                    symDiv.each(function (index) {
                        var txt = '';
                        txt = $j(this).parent().parent().next().text();
                        txt = txt ? txt.replace(/\s/g, '') : '';
                        if (txt) {
                            points.push(txt);
                        } else {
                            success = false;
                            con.warn('Demi temp text problem', txt);
                        }
                    });

                    if (success) {
                        caap.demi['ambrosia']['daily'] = caap.getStatusNumbers(points[0]);
                        caap.demi['malekus']['daily'] = caap.getStatusNumbers(points[1]);
                        caap.demi['corvintheus']['daily'] = caap.getStatusNumbers(points[2]);
                        caap.demi['aurora']['daily'] = caap.getStatusNumbers(points[3]);
                        caap.demi['azeron']['daily'] = caap.getStatusNumbers(points[4]);
                        schedule.setItem("battle", (gm ? gm.getItem('CheckDemi', 6, hiddenVar) : 6) * 3600, 300);
                        caap.SaveDemi();
                    }
                } else {
                    con.warn('Demi symDiv problem');
                }

                //config.getItem('DoPlayerRecon', false)
                if (battle.reconInProgress) {
                    battle.freshmeat("recon");
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_battle: " + err);
                return false;
            }
        },

        demiPoints: function () {
            try {
                if (caap.stats['level'] < 9) {
                    return false;
                }

                if (!config.getItem('DemiPointsFirst', false) || config.getItem('WhenMonster', 'Never') === 'Never') {
                    return false;
                }

                if (schedule.check("battle")) {
                    if (caap.navigateTo(caap.battlePage, 'battle_on.gif')) {
                        return true;
                    }
                }

                var demiPointsDone = false;
                demiPointsDone = battle.selectedDemisDone();
                state.setItem("DemiPointsDone", demiPointsDone);
                if (!demiPointsDone) {
                    return caap.battle('DemiPoints');
                } else {
                    return false;
                }
            } catch (err) {
                con.error("ERROR in demiPoints: " + err);
                return false;
            }
        },

        inLevelUpMode: function () {
            try {
                if (!config.getItem('EnableLevelUpMode', true)) {
                    //if levelup mode is false then new level up mode is also false (kob)
                    state.setItem("newLevelUpMode", false);
                    return false;
                }

                if (!caap.stats['indicators']['enl']) {
                    //if levelup mode is false then new level up mode is also false (kob)
                    state.setItem("newLevelUpMode", false);
                    return false;
                }

                // minutesBeforeLevelToUseUpStaEnergy : 5, = 30000
                if (((caap.stats['indicators']['enl'] - Date.now()) < 30000) || (caap.stats['exp']['dif'] <= config.getItem('LevelUpGeneralExp', 20))) {
                    //detect if we are entering level up mode for the very first time (kob)
                    if (!state.getItem("newLevelUpMode", false)) {
                        //set the current level up mode flag so that we don't call refresh monster routine more than once (kob)
                        state.setItem("newLevelUpMode", true);
                        caap.refreshMonstersListener();
                    }

                    return true;
                }

                //if levelup mode is false then new level up mode is also false (kob)
                state.setItem("newLevelUpMode", false);
                return false;
            } catch (err) {
                con.error("ERROR in inLevelUpMode: " + err);
                return false;
            }
        },

        checkStamina: function (battleOrMonster, attackMinStamina) {
            try {
                con.log(4, "checkStamina", battleOrMonster, attackMinStamina);
                if (!attackMinStamina) {
                    attackMinStamina = 1;
                }

                var when           = config.getItem('When' + battleOrMonster, 'Never'),
                    maxIdleStamina = 0,
                    theGeneral     = '',
                    staminaMF      = '',
                    messDiv        = battleOrMonster.toLowerCase() + "_mess";

                if (when === 'Never') {
                    return false;
                }

                if (!caap.stats['stamina'] || !caap.stats['health']) {
                    caap.setDivContent(messDiv, 'Health or stamina not known yet.');
                    return false;
                }

                if (caap.stats['health']['num'] < 10) {
                    caap.setDivContent(messDiv, "Need health to fight: " + caap.stats['health']['num'] + "/10");
                    return false;
                }

                if (battleOrMonster === "Battle" && config.getItem("waitSafeHealth", false) && caap.stats['health']['num'] < 13) {
                    caap.setDivContent(messDiv, "Unsafe. Need spare health to fight: " + caap.stats['health']['num'] + "/13");
                    return false;
                }

                if (when === 'At X Stamina') {
                    if (caap.inLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                        caap.setDivContent(messDiv, 'Burning stamina to level up');
                        return true;
                    }

                    staminaMF = battleOrMonster + 'Stamina';
                    if (state.getItem('BurnMode_' + staminaMF, false) || caap.stats['stamina']['num'] >= config.getItem('X' + staminaMF, 1)) {
                        if (caap.stats['stamina']['num'] < attackMinStamina || caap.stats['stamina']['num'] <= config.getItem('XMin' + staminaMF, 0)) {
                            state.setItem('BurnMode_' + staminaMF, false);
                            return false;
                        }

                        state.setItem('BurnMode_' + staminaMF, true);
                        return true;
                    } else {
                        state.setItem('BurnMode_' + staminaMF, false);
                    }

                    caap.setDivContent(messDiv, 'Waiting for stamina: ' + caap.stats['stamina']['num'] + "/" + config.getItem('X' + staminaMF, 1));
                    return false;
                }

                if (when === 'At Max Stamina') {
                    maxIdleStamina = caap.stats['stamina']['max'];
                    theGeneral = config.getItem('IdleGeneral', 'Use Current');
                    if (theGeneral !== 'Use Current') {
                        maxIdleStamina = general.GetStaminaMax(theGeneral);
                    }

                    if (theGeneral !== 'Use Current' && !maxIdleStamina) {
                        con.log(2, "Changing to idle general to get Max Stamina");
                        if (general.Select('IdleGeneral')) {
                            return true;
                        }
                    }

                    if (caap.stats['stamina']['num'] >= maxIdleStamina) {
                        caap.setDivContent(messDiv, 'Using max stamina');
                        return true;
                    }

                    if (caap.inLevelUpMode() && caap.stats['stamina']['num'] >= attackMinStamina) {
                        caap.setDivContent(messDiv, 'Burning all stamina to level up');
                        return true;
                    }

                    caap.setDivContent(messDiv, 'Waiting for max stamina: ' + caap.stats['stamina']['num'] + "/" + maxIdleStamina);
                    return false;
                }

                if (caap.stats['stamina']['num'] >= attackMinStamina) {
                    return true;
                }

                caap.setDivContent(messDiv, "Waiting for more stamina: " + caap.stats['stamina']['num'] + "/" + attackMinStamina);
                return false;
            } catch (err) {
                con.error("ERROR in checkStamina: " + err);
                return false;
            }
        },

        /*-------------------------------------------------------------------------------------\
        needToHide will return true if the current stamina and health indicate we need to bring
        our health down through battles (hiding).  It also returns true if there is no other outlet
        for our stamina (currently this just means Monsters, but will eventually incorporate
        other stamina uses).
        \-------------------------------------------------------------------------------------*/
        needToHide: function () {
            try {
                if (config.getItem('WhenMonster', 'Never') === 'Never') {
                    con.log(1, 'Stay Hidden Mode: Monster battle not enabled');
                    return true;
                }

                if (!state.getItem('targetFrombattle_monster', '')) {
                    con.log(1, 'Stay Hidden Mode: No monster to battle');
                    return true;
                }
            /*-------------------------------------------------------------------------------------\
            The riskConstant helps us determine how much we stay in hiding and how much we are willing
            to risk coming out of hiding.  The lower the riskConstant, the more we spend stamina to
            stay in hiding. The higher the risk constant, the more we attempt to use our stamina for
            non-hiding activities.  The below matrix shows the default riskConstant of 1.7

                        S   T   A   M   I   N   A
                        1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
                H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
                E   11  -   -   +   +   +   +   +   +   +
                A   12  -   -   +   +   +   +   +   +   +
                L   13  -   -   +   +   +   +   +   +   +
                T   14  -   -   -   +   +   +   +   +   +
                H   15  -   -   -   +   +   +   +   +   +
                    16  -   -   -   -   +   +   +   +   +
                    17  -   -   -   -   -   +   +   +   +
                    18  -   -   -   -   -   +   +   +   +

            Setting our riskConstant down to 1 will result in us spending out stamina to hide much
            more often:

                        S   T   A   M   I   N   A
                        1   2   3   4   5   6   7   8   9        -  Indicates we use stamina to hide
                H   10  -   -   +   +   +   +   +   +   +        +  Indicates we use stamina as requested
                E   11  -   -   +   +   +   +   +   +   +
                A   12  -   -   -   +   +   +   +   +   +
                L   13  -   -   -   -   +   +   +   +   +
                T   14  -   -   -   -   -   +   +   +   +
                H   15  -   -   -   -   -   -   +   +   +
                    16  -   -   -   -   -   -   -   +   +
                    17  -   -   -   -   -   -   -   -   +
                    18  -   -   -   -   -   -   -   -   -

            \-------------------------------------------------------------------------------------*/
                var riskConstant = gm ? gm.getItem('HidingRiskConstant', 1.7, hiddenVar) : 1.7;
            /*-------------------------------------------------------------------------------------\
            The formula for determining if we should hide goes something like this:

                If  (health - (estimated dmg from next attacks) puts us below 10)  AND
                    (current stamina will be at least 5 using staminatime/healthtime ratio)
                Then stamina can be used/saved for normal process
                Else stamina is used for us to hide

            \-------------------------------------------------------------------------------------*/
                //if ((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && (caap.stats['stamina']['num'] * (5 / 3) >= 5)) {
                if ((caap.stats['health']['num'] - ((caap.stats['stamina']['num'] - 1) * riskConstant) < 10) && ((caap.stats['stamina']['num'] + (gm ? gm.getItem('HideStaminaRisk', 1, hiddenVar) : 1)) >= state.getItem('MonsterStaminaReq', 1))) {
                    return false;
                } else {
                    return true;
                }
            } catch (err) {
                con.error("ERROR in needToHide: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          POTIONS
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        autoPotions: function () {
            try {
                if (!config.getItem('AutoPotions', true) || !schedule.check('AutoPotionTimerDelay')) {
                    return false;
                }

                if (caap.stats['exp']['dif'] <= config.getItem("potionsExperience", 20)) {
                    con.log(2, "AutoPotions, ENL condition. Delaying 10 minutes");
                    schedule.setItem('AutoPotionTimerDelay', 600);
                    return false;
                }

                function consumePotion(potion) {
                    try {
                        if (!$j(".statsTTitle").length) {
                            con.log(2, "Going to keep for potions");
                            if (caap.navigateTo('keep')) {
                                return true;
                            }
                        }

                        var formId    =  caap.domain.id[caap.domain.which] + "consume_1",
                            potionDiv = $j(),
                            button    = null;

                        if (potion === 'stamina') {
                            formId = caap.domain.id[caap.domain.which] + "consume_2";
                        }

                        con.log(1, "Consuming potion", potion);
                        potionDiv = $j("form[id='" + formId + "'] input[src*='potion_consume.gif']");
                        if (potionDiv && potionDiv.length) {
                            button = potionDiv;
                            if (button) {
                                caap.click(button);
                            } else {
                                con.warn("Could not find consume button for", potion);
                                return false;
                            }
                        } else {
                            con.warn("Could not find consume form for", potion);
                            return false;
                        }

                        return true;
                    } catch (err) {
                        con.error("ERROR in consumePotion: " + err, potion);
                        return false;
                    }
                }

                if (caap.stats['energy']['num'] < caap.stats['energy']['max'] - 10 &&
                    caap.stats['potions']['energy'] >= config.getItem("energyPotionsSpendOver", 39) &&
                    caap.stats['potions']['energy'] > config.getItem("energyPotionsKeepUnder", 35)) {
                    return consumePotion('energy');
                }

                if (caap.stats['stamina']['num'] < caap.stats['stamina']['max'] - 10 &&
                    caap.stats['potions']['stamina'] >= config.getItem("staminaPotionsSpendOver", 39) &&
                    caap.stats['potions']['stamina'] > config.getItem("staminaPotionsKeepUnder", 35)) {
                    return consumePotion('stamina');
                }

                return false;
            } catch (err) {
                con.error("ERROR in autoPotions: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          ALCHEMY
        /////////////////////////////////////////////////////////////////////

        /*-------------------------------------------------------------------------------------\
        AutoAlchemy perform aclchemy combines for all recipes that do not have missing
        ingredients.  By default, it also will not combine Battle Hearts.
        First we make sure the option is set and that we haven't been here for a while.
        \-------------------------------------------------------------------------------------*/
        autoAlchemy: function () {
            try {
                if (!config.getItem('AutoAlchemy', false)) {
                    return false;
                }

                if (!schedule.check('AlchemyTimer')) {
                    return false;
                }
        /*-------------------------------------------------------------------------------------\
        Now we navigate to the Alchemy Recipe page.
        \-------------------------------------------------------------------------------------*/
                if (!caap.navigateTo('keep,alchemy', 'tab_alchemy_on.gif')) {
                    var button    = {},
                        recipeDiv = $j(),
                        ssDiv        = $j(),
                        clicked   = false;

                    recipeDiv = $j("#" + caap.domain.id[caap.domain.which] + "recipe_list");
                    if (recipeDiv && recipeDiv.length) {
                        if (recipeDiv.attr("class") !== 'show_items') {
                            button = recipeDiv.find("div[id*='alchemy_item_tab']");
                            if (button && button.length) {
                                caap.click(button);
                                return true;
                            } else {
                                con.warn('Cant find item tab', recipeDiv);
                                return false;
                            }
                        }
                    } else {
                        con.warn('Cant find recipe list');
                        return false;
                    }
        /*-------------------------------------------------------------------------------------\
        We close the results of our combines so they don't hog up our screen
        \-------------------------------------------------------------------------------------*/
                    button = caap.checkForImage('help_close_x.gif');
                    if ($u.hasContent(button)) {
                        caap.click(button);
                        return true;
                    }
        /*-------------------------------------------------------------------------------------\
        Now we get all of the recipes and step through them one by one
        \-------------------------------------------------------------------------------------*/
                    ssDiv = $j("div[class='alchemyRecipeBack']");
                    if (!ssDiv || !ssDiv.length) {
                        con.log(2, 'No recipes found');
                    }

                    ssDiv.each(function () {
                        recipeDiv = $j(this);
        /*-------------------------------------------------------------------------------------\
        If we are missing an ingredient then skip it
        \-------------------------------------------------------------------------------------*/
                        if (recipeDiv.find("div[class*='missing']").length) {
                            con.log(2, 'Skipping Recipe');
                            return true;
                        }
        /*-------------------------------------------------------------------------------------\
        If we are skipping battle hearts then skip it
        \-------------------------------------------------------------------------------------*/
                        if (caap.hasImage('raid_hearts', recipeDiv) && !config.getItem('AutoAlchemyHearts', false)) {
                            con.log(2, 'Skipping Hearts');
                            return true;
                        }
        /*-------------------------------------------------------------------------------------\
        Find our button and click it
        \-------------------------------------------------------------------------------------*/
                        button = recipeDiv.find("input[type='image']");
                        if (button && button.length) {
                            clicked = true;
                            caap.click(button);
                            con.log(2, 'Clicked A Recipe', recipeDiv.find("img").attr("title"));
                            return false;
                        } else {
                            con.warn('Cant Find Item Image Button');
                        }

                        return true;
                    });

                    if (clicked) {
                        return true;
                    }
        /*-------------------------------------------------------------------------------------\
        All done. Set the timer to check back in 3 hours.
        \-------------------------------------------------------------------------------------*/
                    schedule.setItem('AlchemyTimer', 10800, 300);
                    return false;
                }

                return true;
            } catch (err) {
                con.error("ERROR in autoAlchemy: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          BANKING
        // Keep it safe!
        /////////////////////////////////////////////////////////////////////

        immediateBanking: function () {
            if (!config.getItem("BankImmed", false)) {
                return false;
            }

            return caap.bank();
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        bank: function () {
            try {
                if (config.getItem("NoBankAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false)) {
                    return false;
                }

                var maxInCash     = -1,
                    minInCash     = 0,
                    depositButton = null,
                    numberInput   = null,
                    deposit       = 0;

                maxInCash = config.getItem('MaxInCash', -1);
                minInCash = config.getItem('MinInCash', 0);
                if (!maxInCash || maxInCash < 0 || caap.stats['gold']['cash'] <= minInCash || caap.stats['gold']['cash'] < maxInCash || caap.stats['gold']['cash'] < 10) {
                    return false;
                }

                if (general.Select('BankingGeneral')) {
                    return true;
                }

                depositButton = $j("input[src*='btn_stash.gif']");
                if (!depositButton || !depositButton.length) {
                    // Cannot find the link
                    return caap.navigateTo('keep');
                }

                numberInput = $j("input[name='stash_gold']");
                if (!numberInput || !numberInput.length) {
                    con.warn('Cannot find box to put in number for bank deposit.');
                    return false;
                }

                deposit = numberInput.attr("value").parseInt() - minInCash;
                numberInput.attr("value", deposit);
                con.log(1, 'Depositing into bank:', deposit);
                caap.click(depositButton);
                return true;
            } catch (err) {
                con.error("ERROR in Bank: " + err);
                return false;
            }
        },

        retrieveFromBank: function (num) {
            try {
                if (num <= 0) {
                    return false;
                }

                var retrieveButton = null,
                    numberInput    = null,
                    minInStore     = 0;

                retrieveButton = $j("input[src*='btn_retrieve.gif']");
                if (!retrieveButton || !retrieveButton.length) {
                    // Cannot find the link
                    return caap.navigateTo('keep');
                }

                minInStore = config.getItem('minInStore', 0);
                if (!(minInStore || minInStore <= caap.stats['gold']['bank'] - num)) {
                    return false;
                }

                numberInput = $j("input[name='get_gold']");
                if (!numberInput || !numberInput.length) {
                    con.warn('Cannot find box to put in number for bank retrieve.');
                    return false;
                }

                numberInput.attr("value", num);
                con.log(1, 'Retrieving from bank:', num);
                state.setItem('storeRetrieve', '');
                caap.click(retrieveButton);
                return true;
            } catch (err) {
                con.error("ERROR in retrieveFromBank: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          HEAL
        /////////////////////////////////////////////////////////////////////

        heal: function () {
            try {
                var minToHeal     = 0,
                    minStamToHeal = 0;

                caap.setDivContent('heal_mess', '');
                minToHeal = config.getItem('MinToHeal', 0);
                if (minToHeal === "" || minToHeal < 0 || !$u.isNumber(minToHeal)) {
                    return false;
                }

                minStamToHeal = config.getItem('MinStamToHeal', 0);
                if (minStamToHeal === "" || minStamToHeal < 0 || !$u.isNumber(minStamToHeal)) {
                    minStamToHeal = 0;
                }

                if (!caap.stats['health'] || $j.isEmptyObject(caap.stats['health']) || $j.isEmptyObject(caap.stats['healthT'])) {
                    return false;
                }

                if (!caap.stats['stamina'] || $j.isEmptyObject(caap.stats['stamina']) || $j.isEmptyObject(caap.stats['staminaT'])) {
                    return false;
                }

                if ((config.getItem('WhenBattle', 'Never') !== 'Never') || (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                    if ((caap.inLevelUpMode() || caap.stats['stamina']['num'] >= caap.stats['staminaT']['max']) && caap.stats['health']['num'] < (config.getItem('WhenBattle', 'Never') !== 'Never' && config.getItem('waitSafeHealth', false) ? 13 : 10)) {
                        con.log(1, 'Heal');
                        return caap.navigateTo('keep,heal_button.gif');
                    }
                }

                if (caap.stats['health']['num'] >= caap.stats['healthT']['max'] || caap.stats['health']['num'] >= minToHeal) {
                    return false;
                }

                if (caap.stats['stamina']['num'] < minStamToHeal) {
                    caap.setDivContent('heal_mess', 'Waiting for stamina to heal: ' + caap.stats['stamina']['num'] + '/' + minStamToHeal);
                    return false;
                }

                con.log(1, 'Heal');
                return caap.navigateTo('keep,heal_button.gif');
            } catch (err) {
                con.error("ERROR in heal: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          ELITE GUARD
        /////////////////////////////////////////////////////////////////////

        checkResults_party: function () {
            try {
                if ($u.hasContent($j("input[src*='elite_guard_request.gif']", caap.appBodyDiv))) {
                    army.eliteCheckImg();
                } else {
                    army.eliteResult();
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_army_member: " + err);
                return false;
            }
        },

        autoElite: function () {
            try {
                if (!config.getItem("EnableArmy", true) || !config.getItem('AutoElite', true) || !schedule.check('AutoEliteGetList')) {
                    return false;
                }

                return army.elite();
            } catch (err) {
                con.error("ERROR in autoElite: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                          PASSIVE GENERALS
        /////////////////////////////////////////////////////////////////////

        passiveGeneral: function () {
            try {
                if (config.getItem('IdleGeneral', 'Use Current') !== 'Use Current') {
                    if (general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                return false;
            } catch (err) {
                con.error("ERROR in passiveGeneral: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          AUTOINCOME
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkAutoIncome: function (minutes) {
            try {
                return $u.hasContent(caap.stats['gold']['ticker']) && caap.stats['gold']['ticker'][0] < $u.setContent(minutes, 1);
            } catch (err) {
                con.error("ERROR in checkAutoIncome: " + err);
                return false;
            }
        },

        autoIncome: function () {
            try {
                if (config.getItem("disAutoIncome", false) || (config.getItem("NoIncomeAfterLvl", true) && state.getItem('KeepLevelUpGeneral', false))) {
                    return false;
                }

                if (caap.checkAutoIncome() && config.getItem('IncomeGeneral', 'Use Current') !== 'Use Current') {
                    general.Select('IncomeGeneral');
                    return true;
                }

                return false;
            } catch (err) {
                con.error("ERROR in autoIncome: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                              ARMY
        /////////////////////////////////////////////////////////////////////

        checkResults_army: function () {
            try {
                var listHref   = $j("div[class='messages'] a[href*='army.php?act=ignore']", caap.appBodyDiv),
                    autoGift   = config.getItem('AutoGift', false),
                    time       = autoGift ? config.getItem('CheckGiftMins', 15) : 0;

                if ($u.hasContent(listHref)) {
                    listHref.each(function () {
                        var row = $j(this),
                            link = $j("<br /><a title='This link can be used to collect the " +
                                "gift when it has been lost on Facebook. !!If you accept a gift " +
                                "in this manner then it will leave an orphan request on Facebook!!' " +
                                "href='" + row.attr("href").replace('ignore', 'acpt') + "'>Lost Accept</a>");

                        link.insertAfter(row);
                    });
                }

                if (autoGift) {
                    if ($u.hasContent(listHref)) {
                        con.log(1, 'We have a gift waiting!');
                        state.setItem('HaveGift', true);
                    } else {
                        con.log(2, 'No gifts waiting.');
                        state.setItem('HaveGift', false);
                    }

                    time = time < 15 ? 15 : time;
                    schedule.setItem("ajaxGiftCheck", time * 60, 300);
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkResults_army: " + err);
                return false;
            }
        },

        checkResults_army_member: function () {
            try {
                army.page();
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_army_member: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                              INDEX
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        checkResults_index: function () {
            try {
                function news() {
                    try {
                        if ($u.hasContent($j("#caap_news", caap.globalContainer))) {
                            return true;
                        }

                        var xp     = 0,
                            bp     = 0,
                            wp     = 0,
                            cp     = 0,
                            win    = 0,
                            lose   = 0,
                            deaths = 0,
                            cash   = 0,
                            i      = '',
                            list   = [],
                            user   = {},
                            tStr   = '',
                            $b     = null,
                            $c     = null;

                        $b = $j('#' + caap.domain.id[caap.domain.which] + 'battleUpdateBox');
                        if ($b && $b.length) {
                            $c = $j('.alertsContainer', $b);
                            $j('.alert_content', $c).each(function (i, el) {
                                var uid     = 0,
                                    txt     = '',
                                    my_xp   = 0,
                                    my_bp   = 0,
                                    my_wp   = 0,
                                    my_cp   = 0,
                                    my_cash = 0,
                                    $a      = $j('a', el).eq(0);

                                txt = $j(el).text().replace(/,/g, '');
                                if (txt.regex(/You were killed/i)) {
                                    deaths += 1;
                                } else {
                                    tStr = $a.attr('href');
                                    uid = tStr.regex(/user=(\d+)/);
                                    user[uid] = user[uid] || {name: $a.text(), win: 0, lose: 0};
                                    my_xp = txt.regex(/(\d+) experience/i);
                                    my_bp = txt.regex(/(\d+) Battle Points!/i);
                                    my_wp = txt.regex(/(\d+) War Points!/i);
                                    my_cp = txt.regex(/(\d+) Champion Points!/i);
                                    my_cash = txt.regex(/\$(\d+)/i);
                                    if (txt.regex(/Victory!/i)) {
                                        win += 1;
                                        user[uid].lose += 1;
                                        xp += my_xp;
                                        bp += my_bp;
                                        wp += my_wp;
                                        cp += my_cp;
                                        cash += my_cash;
                                    } else {
                                        lose += 1;
                                        user[uid].win += 1;
                                        xp -= my_xp;
                                        bp -= my_bp;
                                        wp -= my_wp;
                                        cp -= my_cp;
                                        cash -= my_cash;
                                    }
                                }
                            });

                            if (win || lose) {
                                list.push('You were challenged <strong>' + (win + lose) + '</strong> times,<br>winning <strong>' + win + '</strong> and losing <strong>' + lose + '</strong>.');
                                list.push('You ' + (xp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + Math.abs(xp).addCommas() + '</span> experience points.');
                                list.push('You ' + (cash >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + '<b class="gold">$' + Math.abs(cash).addCommas() + '</b></span>.');
                                list.push('You ' + (bp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + Math.abs(bp).addCommas() + '</span> Battle Points.');
                                list.push('You ' + (wp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + Math.abs(wp).addCommas() + '</span> War Points.');
                                list.push('You ' + (cp >= 0 ? 'gained <span class="positive">' : 'lost <span class="negative">') + Math.abs(cp).addCommas() + '</span> Champion Points.');
                                list.push('');
                                user = $u.sortObjectBy(user, function (a, b) {
                                        return (user[b].win + (user[b].lose / 100)) - (user[a].win + (user[a].lose / 100));
                                    });

                                for (i in user) {
                                    if (user.hasOwnProperty(i)) {
                                        list.push('<strong title="' + i + '">' + user[i].name + '</strong> ' +
                                            (user[i].win ? 'beat you <span class="negative">' + user[i].win +
                                            '</span> time' + (user[i].win > 1 ? 's' : '') : '') +
                                            (user[i].lose ? (user[i].win ? ' and ' : '') +
                                            'was beaten <span class="positive">' + user[i].lose +
                                            '</span> time' + (user[i].lose > 1 ? 's' : '') : '') + '.');
                                    }
                                }

                                if (deaths) {
                                    list.push('You died ' + (deaths > 1 ? deaths + ' times' : 'once') + '!');
                                }

                                $c.prepend('<div id="caap_news" style="padding: 0pt 0pt 10px;"><div class="alert_title">Summary:</div><div class="alert_content">' + list.join('<br>') + '</div></div>');
                            }
                        }

                        return true;
                    } catch (err) {
                        con.error("ERROR in news: " + err);
                        return false;
                    }
                }

                if (config.getItem('NewsSummary', true)) {
                    news();
                }

                if (config.getItem('AutoGift', false)) {
                    gifting.collected();
                    // Check for new gifts
                    // A warrior wants to join your Army!
                    // Send Gifts to Friends
                    if ($u.hasContent(caap.resultsText) && /Send Gifts to Friends/.test(caap.resultsText)) {
                        con.log(1, 'We have a gift waiting!');
                        state.setItem('HaveGift', true);
                    }

                    var time = config.getItem('CheckGiftMins', 15);
                    time = time < 15 ? 15 : time;
                    schedule.setItem("ajaxGiftCheck", time * 60, 300);
                }

                //arena.index();
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_index: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                              AUTOGIFT
        /////////////////////////////////////////////////////////////////////

        checkResults_gift_accept: function () {
            return true;
        },

        ajaxGiftCheck: function () {
            try {
                if (config.getItem('bookmarkMode', false) || !config.getItem('AutoGift', false) || !schedule.check("ajaxGiftCheck")) {
                    return false;
                }

                return gifting.ajaxGiftCheck();
            } catch (err) {
                con.error("ERROR in AjaxGiftCheck: " + err);
                return false;
            }
        },

        autoGift: function () {
            try {
                /*
                var whenArena  = '',
                    arenaInfo  = {};

                whenArena = config.getItem("WhenArena", 'Never');
                if (whenArena !== 'Never') {
                    arenaInfo = arena.getItem();
                }*/

                if (caap.checkAutoIncome(3) || caap.inLevelUpMode() || config.getItem('bookmarkMode', false) || !config.getItem('AutoGift', false) /*|| (!$j.isEmptyObject(arenaInfo) && arenaInfo['state'] !== 'Ready')*/) {
                    return false;
                }

                return gifting.run();
            } catch (err) {
                con.error("ERROR in autoGift: " + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                              IMMEDIATEAUTOSTAT
        /////////////////////////////////////////////////////////////////////

        immediateAutoStat: function () {
            if (!config.getItem("StatImmed", false) || !config.getItem('AutoStat', false)) {
                return false;
            }

            return caap.autoStat();
        },

        ////////////////////////////////////////////////////////////////////
        //                      Auto Stat
        ////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        increaseStat: function (attribute, attrAdjust, atributeSlice) {
            try {
                attribute = attribute.toLowerCase();
                var button        = $j(),
                    level         = 0,
                    attrCurrent   = 0,
                    energy        = 0,
                    stamina       = 0,
                    attack        = 0,
                    defense       = 0,
                    health        = 0,
                    attrAdjustNew = 0,
                    energyDiv     = $j("a[href*='energy_max']", atributeSlice),
                    staminaDiv    = $j("a[href*='stamina_max']", atributeSlice),
                    attackDiv     = $j("a[href*='attack']", atributeSlice),
                    defenseDiv    = $j("a[href*='defense']", atributeSlice),
                    healthDiv     = $j("a[href*='health_max']", atributeSlice),
                    logTxt        = "";

                switch (attribute) {
                case "energy" :
                    button = energyDiv;
                    break;
                case "stamina" :
                    button = staminaDiv;
                    break;
                case "attack" :
                    button = attackDiv;
                    break;
                case "defense" :
                    button = defenseDiv;
                    break;
                case "health" :
                    button = healthDiv;
                    break;
                default :
                    throw "Unable to match attribute: " + attribute;
                }

                if (!$u.hasContent(button)) {
                    con.warn("Unable to locate upgrade button: Fail ", attribute);
                    return "Fail";
                }

                attrAdjustNew = attrAdjust;
                logTxt = attrAdjust;
                level = caap.stats['level'];
                function getValue(div) {
                    return $u.setContent($j("div[class='attribute_stat_container']", div.parent().parent()).text(), '').regex(/(\d+)/);
                }

                attrCurrent = getValue(button);
                energy = getValue(energyDiv);
                stamina = getValue(staminaDiv);
                if (level >= 10) {
                    attack = getValue(attackDiv);
                    defense = getValue(defenseDiv);
                    health = getValue(healthDiv);
                }

                if (config.getItem('AutoStatAdv', false)) {
                    //Using eval, so user can define formulas on menu, like energy = level + 50
                    /*jslint evil: true */
                    attrAdjustNew = eval(attrAdjust);
                    /*jslint evil: false */
                    logTxt = "(" + attrAdjust + ")=" + attrAdjustNew;
                }

                if ((attribute === 'stamina') && (caap.stats['points']['skill'] < 2)) {
                    if (attrAdjustNew <= attrCurrent) {
                        con.log(2, "Stamina at requirement: Next");
                        return "Next";
                    } else if (config.getItem("StatSpendAll", false)) {
                        con.log(2, "Stamina requires 2 upgrade points: Next");
                        return "Next";
                    } else {
                        con.log(2, "Stamina requires 2 upgrade points: Save");
                        state.setItem("statsMatch", false);
                        return "Save";
                    }
                }

                if (attrAdjustNew > attrCurrent) {
                    con.log(2, "Status Before [" + attribute + "=" + attrCurrent + "]  Adjusting To [" + logTxt + "]");
                    caap.click(button);
                    return "Click";
                }

                return "Next";
            } catch (err) {
                con.error("ERROR in increaseStat: " + err);
                return "Error";
            }
        },

        autoStatCheck: function () {
            try {
                var startAtt   = 0,
                    stopAtt    = 4,
                    attribute  = '',
                    attrValue  = 0,
                    n          = 0,
                    level      = 0,
                    energy     = 0,
                    stamina    = 0,
                    attack     = 0,
                    defense    = 0,
                    health     = 0,
                    attrAdjust = 0,
                    value      = 0,
                    passed     = false;

                if (!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
                    return false;
                }

                if (config.getItem("AutoStatAdv", false)) {
                    startAtt = 5;
                    stopAtt = 9;
                }

                for (n = startAtt; n <= stopAtt; n += 1) {
                    attribute = config.getItem('Attribute' + n, '').toLowerCase();
                    if (attribute === '') {
                        continue;
                    }

                    if (caap.stats['level'] < 10) {
                        if (attribute === 'attack' || attribute === 'defense' || attribute === 'health') {
                            continue;
                        }
                    }

                    attrValue = config.getItem('AttrValue' + n, 0);
                    attrAdjust = attrValue;
                    level = caap.stats['level'];
                    energy = caap.stats['energy']['num'];
                    stamina = caap.stats['stamina']['num'];
                    if (level >= 10) {
                        attack = caap.stats['attack'];
                        defense = caap.stats['defense'];
                        health = caap.stats['health']['num'];
                    }

                    if (config.getItem('AutoStatAdv', false)) {
                        //Using eval, so user can define formulas on menu, like energy = level + 50
                        /*jslint evil: true */
                        attrAdjust = eval(attrValue);
                        /*jslint evil: false */
                    }

                    if (attribute === "attack" || attribute === "defense") {
                        value = caap.stats[attribute];
                    } else {
                        value = caap.stats[attribute]['num'];
                    }

                    if (attribute === 'stamina' && caap.stats['points']['skill'] < 2) {
                        if (config.getItem("StatSpendAll", false) && attrAdjust > value) {
                            continue;
                        } else {
                            passed = false;
                            break;
                        }
                    }

                    if (attrAdjust > value) {
                        passed = true;
                        break;
                    }
                }

                state.setItem("statsMatch", passed);
                return true;
            } catch (err) {
                con.error("ERROR in autoStatCheck: " + err);
                return false;
            }
        },

        autoStat: function () {
            try {
                if (!config.getItem('AutoStat', false) || !caap.stats['points']['skill']) {
                    return false;
                }

                if (!state.getItem("statsMatch", true)) {
                    if (state.getItem("autoStatRuleLog", true)) {
                        con.log(2, "User should possibly change their stats rules");
                        state.setItem("autoStatRuleLog", false);
                    }

                    return false;
                }

                var atributeSlice      = $j("div[class*='keep_attribute_section']", caap.appBodyDiv),
                    startAtt           = 0,
                    stopAtt            = 4,
                    attrName           = '',
                    attribute          = '',
                    attrValue          = 0,
                    n                  = 0,
                    returnIncreaseStat = '';

                if (!$u.hasContent(atributeSlice)) {
                    caap.navigateTo('keep');
                    return true;
                }

                if (config.getItem("AutoStatAdv", false)) {
                    startAtt = 5;
                    stopAtt = 9;
                }

                for (n = startAtt; n <= stopAtt; n += 1) {
                    attrName = 'Attribute' + n;
                    attribute = config.getItem(attrName, '');
                    if (attribute === '') {
                        con.log(4, attrName + " is blank: continue");
                        continue;
                    }

                    if (caap.stats['level'] < 10) {
                        if (attribute === 'Attack' || attribute === 'Defense' || attribute === 'Health') {
                            con.log(1, "Characters below level 10 can not increase Attack, Defense or Health: continue");
                            continue;
                        }
                    }

                    attrValue = config.getItem('AttrValue' + n, 0);
                    returnIncreaseStat = caap.increaseStat(attribute, attrValue, atributeSlice);
                    switch (returnIncreaseStat) {
                    case "Next" :
                        con.log(4, attrName + " : next");
                        continue;
                    case "Click" :
                        con.log(4, attrName + " : click");
                        return true;
                    default :
                        con.log(4, attrName + " return value: " + returnIncreaseStat);
                        return false;
                    }
                }

                con.log(1, "No rules match to increase stats");
                state.setItem("statsMatch", false);
                return false;
            } catch (err) {
                con.error("ERROR in autoStat: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                              CTA
        /////////////////////////////////////////////////////////////////////

        waitAjaxCTA: false,

        recordCTA: [],

        loadedCTA: false,

        waitLoadCTA: true,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        doCTAs: function () {
            try {
                if ((gm ? gm.getItem("ajaxCTA", false, hiddenVar) : false) || caap.waitAjaxCTA || caap.stats['stamina']['num'] < 1 || !schedule.check('ajaxCTATimer')) {
                    return false;
                }

                if (caap.waitLoadCTA) {
                    $j.ajax({
                        url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Fspreadsheets.google.com%2Fpub%3Fkey%3D0At1LY6Vd3Bp9dFhvYkltNVdVNlRfSzZWV0xCQXQtR3c%26hl%3Den%26output%3Dcsv'&format=json",
                        dataType: ($u.is_opera ? "jsonp" : "json"),
                        error: function () {
                            caap.loadedCTA = true;
                        },
                        success: function (msg) {
                            var rows       = msg['query'] && msg['query']['results'] && msg['query']['results']['row'] ? msg['query']['results']['row'] : [],
                                row        = 0,
                                rowsLen    = 0,
                                column     = 0,
                                newRecord  = {},
                                headers    = $u.hasContent(rows) ? rows[0] : {},
                                headersLen = 0,
                                headersArr = [],
                                key        = '';

                            for (key in headers) {
                                if (headers.hasOwnProperty(key)) {
                                    headersLen = headersArr.push((headers[key]).toLowerCase());
                                }
                            }

                            for (row = 1, rowsLen = rows.length; row < rowsLen; row += 1) {
                                newRecord = {};
                                for (column = 0; column < headersLen; column += 1) {
                                    if (!$u.hasContent(headersArr[column])) {
                                        continue;
                                    }

                                    newRecord[headersArr[column]] = $u.setContent(rows[row]["col" + column], null);
                                }

                                caap.recordCTA.push(newRecord);
                            }

                            caap.loadedCTA = true;
                        }
                    });

                    caap.waitLoadCTA = false;
                    return true;
                }

                if (!$u.hasContent(caap.recordCTA) || !caap.loadedCTA) {
                    return false;
                }

                var count = state.getItem('ajaxCTACount', 0);
                if (count < caap.recordCTA.length) {
                    caap.waitAjaxCTA = true;
                    $j.ajax({
                        //url: caap.domain.link + caap.recordCTA[count]['code'].AESDecrypt(caap.namespace),
                        url: caap.recordCTA[count]['code'].AESDecrypt(caap.namespace),
                        error: function () {
                            caap.waitAjaxCTA = false;
                        },
                        success: function () {
                            caap.waitAjaxCTA = false;
                        }
                    });

                    count = state.setItem('ajaxCTACount', count + 1);
                    con.log(10, "doCTAs", count, caap.recordCTA.length);
                } else {
                    caap.waitAjaxCTA = false;
                    state.setItem('ajaxCTACount', 0);
                    schedule.setItem('ajaxCTATimer', 10800, 300);
                }

                return true;
            } catch (err) {
                con.error("ERROR in doCTAs: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        /////////////////////////////////////////////////////////////////////
        //                              FILL ARMY
        /////////////////////////////////////////////////////////////////////

        addFriendSpamCheck: 0,

        autoFillArmy: function () {
            try {
                if (!state.getItem('FillArmy', false) || !config.getItem("EnableArmy", true) || caap.domain.which === 0 || caap.domain.which === 1 || caap.domain.which === 4) {
                    return false;
                }

                function addFriend(id) {
                    try {
                        function responseCallback(data, textStatus, XMLHttpRequest) {
                            if (caap.addFriendSpamCheck > 0) {
                                caap.addFriendSpamCheck -= 1;
                            }

                            con.log(1, "AddFriend(" + id + "): ", textStatus);
                        }

                        caap.ajax('party.php?twt=jneg&jneg=true&user=' + id + '&lka=' + id + '&etw=9&ref=nf', null, responseCallback, responseCallback);
                        //caap.ajax('index.php?tp=cht&buf=1&lka=' + id, null, responseCallback, responseCallback);
                        return true;
                    } catch (err) {
                        con.error("ERROR in addFriend(" + id + "): " + err);
                        return false;
                    }
                }

                var armyCount     = state.getItem("ArmyCount", 0),
                    fillArmyList  = state.getItem('FillArmyList', []),
                    batchCount    = 5,
                    i             = 0;

                con.log(2, "fillArmyList:", fillArmyList);
                con.log(2, "armyCount:", armyCount);
                if (armyCount === 0) {
                    fillArmyList = state.setItem('FillArmyList', army.getDiffList());
                    if ($u.hasContent(fillArmyList)) {
                        caap.setDivContent('idle_mess', 'Filling Army');
                        con.log(1, "Filling army");
                    } else {
                        caap.setDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Completed</span>');
                        con.log(1, "Fill Army Completed: no friends found");
                        window.setTimeout(function () {
                            caap.setDivContent('idle_mess', '');
                        }, 5000);

                        state.setItem('FillArmy', false);
                        state.setItem("ArmyCount", 0);
                        state.setItem('FillArmyList', []);
                        return false;
                    }
                }

                if ($u.hasContent(fillArmyList)) {
                    con.log(2, "inside");
                    // Add army members //
                    if (fillArmyList.length < 5) {
                        batchCount = fillArmyList.length;
                    } else if (fillArmyList.length - armyCount < 5) {
                        batchCount = fillArmyList.length - armyCount;
                    }

                    batchCount = batchCount - caap.addFriendSpamCheck;
                    for (i = 0; i < batchCount; i += 1) {
                        addFriend(fillArmyList[armyCount]);
                        armyCount += 1;
                        caap.addFriendSpamCheck += 1;
                    }

                    caap.setDivContent('idle_mess', 'Filling Army, Please wait...' + armyCount + "/" + fillArmyList.length);
                    con.log(1, 'Filling Army, Please wait...' + armyCount + "/" + fillArmyList.length);
                    state.setItem("ArmyCount", armyCount);
                    if (armyCount >= fillArmyList.length) {
                        caap.setDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Completed</span>');
                        window.setTimeout(function () {
                            caap.setDivContent('idle_mess', '');
                        }, 5000);

                        con.log(1, "Fill Army Completed");
                        state.setItem('FillArmy', false);
                        state.setItem("ArmyCount", 0);
                        state.setItem('FillArmyList', []);
                        return false;
                    }
                }

                con.log(2, "At end returning true");
                return true;
            } catch (err) {
                con.error("ERROR in autoFillArmy: " + err);
                caap.setDivContent('idle_mess', '<span style="font-weight: bold;">Fill Army Failed</span>');
                window.setTimeout(function () {
                    caap.setDivContent('idle_mess', '');
                }, 5000);

                state.setItem('FillArmy', false);
                state.setItem("ArmyCount", 0);
                state.setItem('FillArmyList', []);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                              IDLE
        /////////////////////////////////////////////////////////////////////

        idle: function () {
            if (config.getItem("WhenMonster", "Never") !== "Never" && config.getItem("WhenBattle", "Never") !== "Never" && session.getItem('resetselectMonster', true)) {
                con.log(4, "resetselectMonster");
                monster.select(true);
                session.setItem('resetselectMonster', false);
            }

            if (config.getItem("WhenGuildMonster", "Never") !== "Never" && session.getItem('resetselectGuildMonster', true)) {
                con.log(4, "resetselectGuildMonster");
                guild_monster.select(true);
                session.setItem('resetselectGuildMonster', false);
            }

            if (caap.doCTAs()) {
                return true;
            }

            caap.autoFillArmy();
            caap.updateDashboard();
            session.setItem('ReleaseControl', true);
            return true;
        },

        /////////////////////////////////////////////////////////////////////
        //                              PLAYER RECON
        /////////////////////////////////////////////////////////////////////

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        reconPlayers: function () {
            try {
                if (config.getItem('WhenBattle', 'Never') === 'Never' || !config.getItem('DoPlayerRecon', false) || !schedule.check('PlayerReconTimer') || caap.stats['stamina']['num'] <= 0) {
                    return false;
                }

                if (config.getItem("stopReconLimit", true) && battle.reconRecords.length >= config.getItem("LimitTargets", 100)) {
                    schedule.setItem('PlayerReconTimer', (gm ? gm.getItem('PlayerReconRetry', 60, hiddenVar) : 60), 60);
                    caap.setDivContent('idle_mess', 'Player Recon: Stop Limit');
                    return false;
                }

                function onError(XMLHttpRequest, textStatus, errorThrown) {
                    con.error("reconPlayers", textStatus);
                }

                function onSuccess(data, textStatus, XMLHttpRequest) {
                    battle.freshmeat("recon");
                }

                battle.reconInProgress = true;
                caap.setDivContent('idle_mess', 'Player Recon: In Progress');
                con.log(1, "Player Recon: In Progress");
                if (config.getItem('bgRecon', true)) {
                    caap.ajax("battle.php", null, onError, onSuccess);
                } else {
                    if (caap.navigateTo(caap.battlePage, $j("img[src*='battle_on.gif']", caap.appBodyDiv).length ? '' : 'battle_on.gif')) {
                        return true;
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in reconPlayers:" + err);
                return false;
            }
        },

        /////////////////////////////////////////////////////////////////////
        //                          MAIN LOOP
        // This function repeats continously.  In principle, functions should only make one
        // click before returning back here.
        /////////////////////////////////////////////////////////////////////

        actionDescTable: {
            'autoIncome'            : 'Awaiting Income',
            'autoStat'              : 'Upgrade Skill Points',
            'maxEnergyQuest'        : 'At Max Energy Quest',
            'passiveGeneral'        : 'Setting Idle General',
            'idle'                  : 'Idle Tasks',
            'immediateBanking'      : 'Immediate Banking',
            'battle'                : 'Battling Players',
            'monsterReview'         : 'Review Monsters/Raids',
            'guildMonsterReview'    : 'Review Guild Monsters',
            'immediateAutoStat'     : 'Immediate Auto Stats',
            'autoElite'             : 'Fill Elite Guard',
            'autoPotions'           : 'Auto Potions',
            'autoAlchemy'           : 'Auto Alchemy',
            'autoBless'             : 'Auto Bless',
            'autoGift'              : 'Auto Gifting',
            'demiPoints'            : 'Demi Points First',
            'monsters'              : 'Fighting Monsters',
            'guildMonster'          : 'Fight Guild Monster',
            'heal'                  : 'Auto Healing',
            'bank'                  : 'Auto Banking',
            'lands'                 : 'Land Operations',
            'quests'                : 'Questing',
            'checkGenerals'         : 'Checking Generals',
            'checkAllGenerals'      : 'Getting Generals Stats',
            'checkArmy'             : 'Checking Army',
            'checkKeep'             : 'Checking Keep',
            'ajaxGiftCheck'         : 'Gift Check',
            'ajaxCheckFeed'         : 'Feed Check',
            'ajaxCheckGuild'        : 'Guild Check',
            'ajaxCheckPublic1'      : 'Public Check 1',
            'ajaxCheckPublic2'      : 'Public Check 2',
            'ajaxCheckPublic3'      : 'Public Check 3',
            'feedScan'              : 'Scanning Monsters',
            'checkAchievements'     : 'Achievements',
            'reconPlayers'          : 'Player Recon',
            'checkOracle'           : 'Checking Oracle',
            'checkBattleRank'       : 'Battle Rank',
            'checkWarRank'          : 'War Rank',
            'checkSymbolQuests'     : 'Demi Blessing Stats',
            'checkSoldiers'         : 'Getting Soldiers',
            'checkItem'             : 'Getting Items',
            'checkMagic'            : 'Getting Magic',
            'checkCharacterClasses' : 'Character Classes',
            'festivalBless'         : 'Festival Feats'
        },
        /*jslint sub: false */

        checkLastAction: function (thisAction) {
            try {
                var lastAction = state.getItem('LastAction', 'idle');
                caap.setDivContent('activity_mess', 'Activity: ' + $u.setContent(caap.actionDescTable[thisAction], thisAction));

                if (lastAction !== thisAction) {
                    con.log(1, 'Changed from doing ' + lastAction + ' to ' + thisAction);
                    state.setItem('LastAction', thisAction);
                }

                return true;
            } catch (err) {
                con.error("ERROR in checkLastAction:" + err);
                return false;
            }
        },

        masterActionList: {
            0x00: 'autoElite',
            0x01: 'heal',
            0x02: 'immediateBanking',
            0x03: 'immediateAutoStat',
            0x04: 'maxEnergyQuest',
            //0x05: 'arenaReview',
            0x05: 'festivalReview',
            0x06: 'guildMonsterReview',
            0x07: 'monsterReview',
            //0x08: 'arena',
            0x08: 'festival',
            0x09: 'guildMonster',
            0x0A: 'demiPoints',
            0x0B: 'monsters',
            0x0C: 'battle',
            0x0D: 'quests',
            0x0E: 'bank',
            0x0F: 'passiveGeneral',
            0x10: 'checkGenerals',
            0x11: 'checkAllGenerals',
            0x12: 'checkArmy',
            0x13: 'lands',
            0x14: 'autoBless',
            0x15: 'autoStat',
            0x16: 'autoGift',
            0x17: 'checkKeep',
            0x18: 'autoPotions',
            0x19: 'autoAlchemy',
            0x1A: 'checkAchievements',
            0x1B: 'ajaxGiftCheck',
            0x1C: 'reconPlayers',
            0x1D: 'checkOracle',
            0x1E: 'checkBattleRank',
            0x1F: 'checkWarRank',
            0x20: 'checkSymbolQuests',
            0x21: 'checkSoldiers',
            0x22: 'checkItem',
            0x23: 'checkMagic',
            0x24: 'checkCharacterClasses',
            0x25: 'festivalBless',
            0x26: 'ajaxCheckFeed',
            0x27: 'ajaxCheckGuild',
            0x28: 'ajaxCheckPublic1',
            0x29: 'ajaxCheckPublic2',
            0x2A: 'ajaxCheckPublic3',
            0x2B: 'feedScan',
            0x2C: 'idle'
        },

        actionsList: [],

        makeActionsList: function () {
            try {
                if (!$u.hasContent(caap.actionsList)) {
                    con.log(2, "Loading a fresh Action List");
                    // actionOrder is a comma seperated string of action numbers as
                    // hex pairs and can be referenced in the Master Action List
                    // Example: "00,01,02,03,04,05,06,07,08,09,0A,0B,0C,0D,0E,0F,10,11,12"
                    var action                = '',
                        actionOrderArray      = [],
                        masterActionListCount = 0,
                        actionOrderUser       = config.getItem("actionOrder", ''),
                        actionOrderArrayCount = 0,
                        itemCount             = 0,
                        actionItem            = '';

                    if ($u.hasContent(actionOrderUser)) {
                        // We are using the user defined actionOrder set in the
                        // Advanced Hidden Options
                        con.log(2, "Trying user defined Action Order");
                        // We take the User Action Order and convert it from a comma
                        // separated list into an array
                        actionOrderArray = actionOrderUser.split(",");
                        // We count the number of actions contained in the
                        // Master Action list
                        for (action in caap.masterActionList) {
                            if (caap.masterActionList.hasOwnProperty(action)) {
                                masterActionListCount += 1;
                                con.log(4, "Counting Action List", masterActionListCount);
                            } else {
                                con.warn("Error Getting Master Action List length!");
                                con.warn("Skipping 'action' from masterActionList: ", action);
                            }
                        }
                    } else {
                        // We are building the Action Order Array from the
                        // Master Action List
                        con.log(2, "Building the default Action Order");
                        for (action in caap.masterActionList) {
                            if (caap.masterActionList.hasOwnProperty(action)) {
                                masterActionListCount = actionOrderArray.push(action);
                                con.log(4, "Action Added", action);
                            } else {
                                con.warn("Error Building Default Action Order!");
                                con.warn("Skipping 'action' from masterActionList: ", action);
                            }
                        }
                    }

                    // We notify if the number of actions are not sensible or the
                    // same as in the Master Action List
                    actionOrderArrayCount = actionOrderArray.length;
                    if (actionOrderArrayCount === 0) {
                        throw "Action Order Array is empty! " + (actionOrderUser === "" ? "(Default)" : "(User)");
                    } else if (actionOrderArrayCount < masterActionListCount) {
                        con.warn("Warning! Action Order Array has fewer orders than default!");
                    } else if (actionOrderArrayCount > masterActionListCount) {
                        con.warn("Warning! Action Order Array has more orders than default!");
                    }

                    // We build the Action List
                    con.log(8, "Building Action List ...");
                    for (itemCount = 0; itemCount !== actionOrderArrayCount; itemCount += 1) {
                        actionItem = '';
                        if ($u.hasContent(actionOrderUser)) {
                            // We are using the user defined comma separated list of hex pairs
                            actionItem = caap.masterActionList[actionOrderArray[itemCount].parseInt(16)];
                            con.log(4, "(" + itemCount + ") Converted user defined hex pair to action", actionItem);
                        } else {
                            // We are using the Master Action List
                            actionItem = caap.masterActionList[actionOrderArray[itemCount]];
                            con.log(4, "(" + itemCount + ") Converted Master Action List entry to an action", actionItem);
                        }

                        // Check the Action Item
                        if ($u.hasContent(actionItem)) {
                            // We add the Action Item to the Action List
                            caap.actionsList.push(actionItem);
                            con.log(4, "Added action to the list", actionItem);
                        } else {
                            con.warn("Error! Skipping actionItem");
                            con.warn("Action Item(" + itemCount + "): ", actionItem);
                        }
                    }

                    if ($u.hasContent(actionOrderUser)) {
                        con.log(1, "Get Action List: ", caap.actionsList);
                    }
                }

                return true;
            } catch (err) {
                // Something went wrong, log it and use the emergency Action List.
                con.error("ERROR in makeActionsList: " + err);
                for (var jt in caap.masterActionList) {
                    if (caap.masterActionList.hasOwnProperty(jt)) {
                        caap.actionsList.push(caap.masterActionList[jt]);
                    }
                }

                return false;
            }
        },

        errorCheckWait: false,

        errorCheck: function () {
            // assorted errors...
            if (caap.errorCheckWait) {
                return true;
            }

            if (window.location.href.hasIndexOf('/error.html') || window.location.href.hasIndexOf('/sorry.php')) {
                con.warn('Detected "error" or "sorry" page, waiting to go back to previous page.');
                window.setTimeout(function () {
                    if ("history" in window && "back" in window.history) {
                        window.history.back();
                    } else if ("history" in window && "go" in window.history) {
                        window.history.go(-1);
                    } else {
                        window.location.href = caap.domain.protocol[caap.domain.ptype] + "apps.facebook.com/castle_age/index.php?bm=1&ref=bookmarks&count=0";
                    }
                }, 60000);

                caap.errorCheckWait = true;
                return true;
            }

            // Try again button
            var button = $j("#try_again_button, input[name='try_again_button']");
            if ($u.hasContent(button)) {
                con.warn('Detected "Try Again" message, clicking button else refresh.');
                $j(".phl").append("<p>CAAP will retry shortly!</p>");
                window.setTimeout(function () {
                    caap.click(button);
                    window.setTimeout(function () {
                        $u.reload();
                    }, 180000);
                }, 60000 + (Math.floor(Math.random() * 60) * 1000));

                caap.errorCheckWait = true;
                return true;
            }

            return false;
        },

        waitingAjaxLoad: function () {
            try {
                return $u.hasContent(caap.ajaxLoadIcon) && caap.ajaxLoadIcon.css("display") !== "none";
            } catch (err) {
                con.error("ERROR in waitingAjaxLoad: " + err);
                return false;
            }
        },

        stsPoll: function () {
            try {
                var gtv = $j("span[id*='gold_time_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).text(),
                    ecv = $j("span[id*='energy_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).text(),
                    scv = $j("span[id*='stamina_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).text(),
                    hcv = $j("span[id*='health_current_value']", caap.caTools ? caap.caToolsDiv : caap.globalContainer).text(),
                    arr = [],
                    num = 0;

                /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
                /*jslint sub: true */
                arr = $u.setContent($u.setContent(gtv, '').regex(/(\d+):(\d+)/), []);
                if ($u.hasContent(arr) && arr.length === 2) {
                    caap.stats['gold']['ticker'] = arr;
                    con.log(3, "stsPoll gtv", arr[0] + ":" + arr[1].lpad("0", 2));
                }

                num = $u.setContent($u.setContent(ecv, '').parseInt(), -1);
                if (num > 0 && !$u.isNaN(num)) {
                    caap.stats['energy'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energy']['max']), caap.stats['energy']);
                    caap.stats['energyT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energyT']['max']), caap.stats['energy']);
                    con.log(3, "stsPoll ecv", num);
                }

                num = $u.setContent($u.setContent(hcv, '').parseInt(), -1);
                if (num > 0 && !$u.isNaN(num)) {
                    caap.stats['health'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['health']['max']), caap.stats['health']);
                    caap.stats['healthT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['healthT']['max']), caap.stats['healthT']);
                    con.log(3, "stsPoll hcv", num);
                }

                num = $u.setContent($u.setContent(scv, '').parseInt(), -1);
                if (num > 0 && !$u.isNaN(num)) {
                    caap.stats['stamina'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['stamina']['max']), caap.stats['stamina']);
                    caap.stats['staminaT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['staminaT']['max']), caap.stats['staminaT']);
                    con.log(3, "stsPoll scv", num);
                }
                /*jslint sub: false */
                return true;
            } catch (err) {
                con.error("ERROR in stsPoll: " + err);
                return false;
            }
        },

        mainLoop: function () {
            try {
                var button          = null,
                    noWindowLoad    = 0,
                    actionsListCopy = [],
                    action          = 0,
                    len             = 0,
                    dmc             = 0;

                // assorted errors...
                if (caap.errorCheck()) {
                    return true;
                }

                if (caap.domain.which === 1) {
                    gifting.collect();
                    caap.waitMainLoop();
                    return true;
                }

                //We don't need to send out any notifications
                button = $j("a[class*='undo_link']");
                if ($u.hasContent(button)) {
                    con.log(1, 'Undoing/skipping notification');
                    caap.click(button);
                }

                if (!$u.mutationTypes['DOMSubtreeModified']) {
                    caap.stsPoll();
                }

                if (config.getItem('Disabled', false)) {
                    caap.waitMainLoop();
                    return true;
                }

                if (!session.getItem("pageLoadOK", false)) {
                    noWindowLoad = state.getItem('NoWindowLoad', 0);
                    if (noWindowLoad === 0) {
                        schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                        state.setItem('NoWindowLoad', 1);
                    } else if (schedule.check('NoWindowLoadTimer')) {
                        schedule.setItem('NoWindowLoadTimer', Math.min(Math.pow(2, noWindowLoad - 1) * 15, 3600));
                        state.setItem('NoWindowLoad', noWindowLoad + 1);
                        caap.reloadCastleAge();
                    }

                    con.log(1, 'Page no-load count: ', noWindowLoad);
                    session.setItem("pageLoadOK", caap.getStats());
                    caap.waitMainLoop();
                    return true;
                } else {
                    state.setItem('NoWindowLoad', 0);
                }

                if (state.getItem('caapPause', 'none') !== 'none') {
                    caap.waitMainLoop();
                    return true;
                }

                if (caap.getDomWaiting()) {
                    if (schedule.since("clickedOnSomething", 45)) {
                        con.log(1, 'Clicked on something, but nothing new loaded.  Reloading page.', session, schedule);
                        caap.reloadCastleAge();
                        return true;
                    }

                    if (caap.waitingAjaxLoad()) {
                        con.log(1, 'Waiting for page load ...');
                        caap.waitMainLoop();
                        return true;
                    }
                }

                if (session.getItem("delayMain", false)) {
                    dmc = session.incItem("delayMainCnt");
                    con.log(2, 'Delay main ...', dmc);
                    if (dmc > 20) {
                        caap.reloadCastleAge();
                    }

                    caap.waitMainLoop();
                    return true;
                }

                if (caap.autoIncome()) {
                    caap.checkLastAction('autoIncome');
                    caap.waitMainLoop();
                    return true;
                }

                actionsListCopy = caap.actionsList.slice();
                len = session.getItem('ReleaseControl', false) ? session.setItem('ReleaseControl', false) : actionsListCopy.unshift(state.getItem('LastAction', 'idle'));
                monster.select();
                for (action = 0, len = actionsListCopy.indexOf('idle') + 1; action < len; action += 1) {
                    if (caap[actionsListCopy[action]]()) {
                        caap.checkLastAction(actionsListCopy[action]);
                        break;
                    }
                }

                caap.waitMainLoop();
                return true;
            } catch (err) {
                con.error("ERROR in mainLoop: " + err);
                caap.reloadCastleAge(true);
                return false;
            }
        },

        waitMilliSecs: 5000,

        waitMainLoop: function () {
            try {
                window.setTimeout(function () {
                    caap.waitMilliSecs = 5000;
                    if (session.getItem("flagReload", false)) {
                        caap.reloadCastleAge();
                    }

                    caap.mainLoop();
                }, caap.waitMilliSecs * (1 + Math.random() * 0.2));

                return true;
            } catch (err) {
                con.error("ERROR in waitMainLoop: " + err);
                return false;
            }
        },

        reloadCastleAge: function (force) {
            try {
                function doit() {
                    var rc = session.incItem("reloadCounter"),
                        mc = session.getItem("messageCount", 0);

                    if (!force && rc < 20 && mc > 0) {
                        con.log(1, 'Reload waiting ' + mc + ' message' + $u.plural(mc) + ' ...', rc);
                        window.setTimeout(function () {
                            doit();
                        }, 100);

                        return;
                    }

                    if (force || (!config.getItem('Disabled') && state.getItem('caapPause') === 'none')) {
                        // better than reload... no prompt on forms!
                        con.log(1, 'Reloading now!');
                        //caap.visitUrl(caap.domain.link + (caap.domain.which === 0 || caap.domain.which === 2 ? "/index.php?bm=1&ref=bookmarks&count=0" : ""));
                        caap.visitUrl(caap.domain.altered + (caap.domain.which === 0 || caap.domain.which === 2 ? "/index.php?bm=1&ref=bookmarks&count=0" : ""));
                    }
                }

                doit();
                return true;
            } catch (err) {
                con.error("ERROR in reloadCastleAge: " + err);
                return false;
            }
        },

        reloadOccasionally: function () {
            try {
                var reloadMin = config.getItem('ReloadFrequency', 8);
                reloadMin = !$u.isNumber(reloadMin) || reloadMin < 8 ? 8 : reloadMin;
                window.setTimeout(function () {
                    if (schedule.since("clickedOnSomething", 300) || session.getItem("pageLoadCounter", 0) > 40) {
                        con.log(1, 'Reloading if not paused after inactivity');
                        session.setItem("flagReload", true);
                    }

                    caap.reloadOccasionally();
                }, 60000 * reloadMin + (reloadMin * 60000 * Math.random()));

                return true;
            } catch (err) {
                con.error("ERROR in reloadOccasionally: " + err);
                return false;
            }
        },

        exportTable: {
            'Config' : {
                'export' : function () {
                    return config.getAll();
                },
                'import' : function (d) {
                    config.setAll(d);
                },
                'delete' : function () {
                    config.deleteAll();
                }
            },
            'State' : {
                'export' : function () {
                    return state.getAll();
                },
                'import' : function (d) {
                    state.setAll(d);
                },
                'delete' : function () {
                    state.deleteAll();
                }
            },
            'Schedule' : {
                'export' : function () {
                    return schedule.getAll();
                },
                'import' : function (d) {
                    schedule.setAll(d);
                },
                'delete' : function () {
                    schedule.deleteAll();
                }
            },
            'Monster' : {
                'export' : function () {
                    return monster.records;
                },
                'import' : function (d) {
                    monster.records = d;
                    monster.save();
                },
                'delete' : function () {
                    monster.records = [];
                    gm.deleteItem("monster.records");
                }
            },
            'Battle' : {
                'export' : function () {
                    return battle.records;
                },
                'import' : function (d) {
                    battle.records = d;
                    battle.save();
                },
                'delete' : function () {
                    battle.records = [];
                    gm.deleteItem("battle.records");
                }
            },
            'Guild Monster' : {
                'export' : function () {
                    return guild_monster.records;
                },
                'import' : function (d) {
                    guild_monster.records = d;
                    guild_monster.save();
                },
                'delete' : function () {
                    guild_monster.records = [];
                    gm.deleteItem("guild_monster.records");
                }
            },
            'Target' : {
                'export' : function () {
                    return battle.reconRecords;
                },
                'import' : function (d) {
                    battle.reconRecords = d;
                    battle.saveRecon();
                },
                'delete' : function () {
                    battle.reconRecords = [];
                    gm.deleteItem("recon.records");
                }
            },
            'User' : {
                'export' : function () {
                    return caap.stats;
                },
                'import' : function (d) {
                    caap.stats = d;
                    caap.saveStats();
                },
                'delete' : function () {
                    caap.stats = {};
                    gm.deleteItem("stats.record");
                }
            },
            'Generals' : {
                'export' : function () {
                    return general.records;
                },
                'import' : function (d) {
                    general.records = d;
                    general.save();
                },
                'delete' : function () {
                    general.records = [];
                    gm.deleteItem("general.records");
                }
            },
            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            'Soldiers' : {
                'export' : function () {
                    return town['soldiers'];
                },
                'import' : function (d) {
                    town['soldiers'] = d;
                    town.save('soldiers');
                },
                'delete' : function () {
                    town['soldiers'] = [];
                    gm.deleteItem("soldiers.records");
                }
            },
            'Item' : {
                'export' : function () {
                    return town['item'];
                },
                'import' : function (d) {
                    town['item'] = d;
                    town.save('item');
                },
                'delete' : function () {
                    town['item'] = [];
                    gm.deleteItem("item.records");
                }
            },
            'Magic' : {
                'export' : function () {
                    return town['magic'];
                },
                'import' : function (d) {
                    town['magic'] = d;
                    town.save('magic');
                },
                'delete' : function () {
                    town['magic'] = [];
                    gm.deleteItem("magic.records");
                }
            },
            /*jslint sub: false */
            'Gift Stats' : {
                'export' : function () {
                    return gifting.history.records;
                },
                'import' : function (d) {
                    gifting.history.records = d;
                    gifting.save('history');
                },
                'delete' : function () {
                    gifting.history.records = [];
                    gm.deleteItem("gifting.history");
                }
            },
            'Gift Queue' : {
                'export' : function () {
                    return gifting.queue.records;
                },
                'import' : function (d) {
                    gifting.queue.records = d;
                    gifting.save('queue');
                },
                'delete' : function () {
                    gifting.queue.records = [];
                    gm.deleteItem("gifting.queue");
                }
            },
            'Gifts' : {
                'export' : function () {
                    return gifting.gifts.records;
                },
                'import' : function (d) {
                    gifting.queue.records = d;
                    gifting.save('gifts');
                },
                'delete' : function () {
                    gifting.queue.records = [];
                    gm.deleteItem("gifting.gifts");
                }
            },
            /*'Arena' : {
                'export' : function () {
                    return arena.records;
                },
                'import' : function (d) {
                    arena.records = d;
                    arena.save();
                },
                'delete' : function () {
                arena.records = [];
                    gm.deleteItem("arena.records");
                }
            },*/
            'Army' : {
                'export' : function () {
                    return army.records;
                },
                'import' : function (d) {
                    army.records = d;
                    army.save();
                },
                'delete' : function () {
                    army.records = [];
                    gm.deleteItem("army.records");
                }
            },
            'Demi Points' : {
                'export' : function () {
                    return caap.demi;
                },
                'import' : function (d) {
                    caap.demi = d;
                    caap.SaveDemi();
                },
                'delete' : function () {
                    caap.demi = {};
                    gm.deleteItem("demipoint.records");
                }
            },
            'Feed' : {
                'export' : function () {
                    return feed.records;
                },
                'import' : function (d) {
                    feed.records = d;
                    feed.save();
                },
                'delete' : function () {
                    feed.records = {};
                    gm.deleteItem("feed.records");
                }
            },
            'Monster List' : {
                'export' : function () {
                    return feed.monsterList;
                },
                'import' : function (d) {
                    feed.monsterList = d;
                    feed.saveList();
                },
                'delete' : function () {
                    feed.monsterList = [];
                    gm.deleteItem("feed.monsterList");
                }
            },
            'Goblin Hints' : {
                'export' : function () {
                    return spreadsheet.records;
                },
                'import' : function (d) {
                    spreadsheet.records = d;
                    spreadsheet.save();
                },
                'delete' : function () {
                    spreadsheet.records = [];
                    ss.deleteItem("spreadsheet.records");
                }
            }
        },

        exportList: function () {
            try {
                var it,
                    list = [];

                for (it in caap.exportTable) {
                    if (caap.exportTable.hasOwnProperty(it)) {
                        list.push(it);
                    }
                }

                return list.sort();
            } catch (err) {
                con.error("ERROR in caap.exportList: " + err);
                return undefined;
            }
        },

        profilesDialog: function (keys) {
            try {
                var h = '',
                    w = $j("#caap_backup"),
                    n = '',
                    i = 0,
                    l = keys.length,
                    list,
                    name,
                    status;

                function getKeys(event) {
                    name.val($j(event.target).val());
                }

                function backup(key) {
                    status.text("Saving " + key + " ...");
                    profiles.backup(key, function (event) {
                        status.text(key + " : " + event);
                        profiles.getBackupKeys(function (newKeys) {
                            keys = newKeys;
                            name.val("");
                            name.autocomplete("option", "source", keys);
                            h = '';
                            l = keys.length;
                            for (i = 0; i < l; i += 1)  {
                                h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                            }

                            list.html(h);
                        });
                    });
                }

                function restore(key) {
                    status.text("Loading " + key + " ...");
                    profiles.restore(key, function (event) {
                        caap.addControl(true);
                        status.text(key + " : " + event);
                        profiles.getBackupKeys(function (newKeys) {
                            keys = newKeys;
                            name.val("");
                            name.autocomplete("option", "source", keys);
                            h = '';
                            l = keys.length;
                            for (i = 0; i < l; i += 1)  {
                                h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                            }

                            list.html(h);
                        });
                    });
                }

                function erase(key) {
                    status.text("Deleting " + key + " ...");
                    profiles.erase(key, function (event) {
                        status.text(key + " : " + event);
                        profiles.getBackupKeys(function (newKeys) {
                            keys = newKeys;
                            name.val("");
                            name.autocomplete("option", "source", keys);
                            h = '';
                            l = keys.length;
                            for (i = 0; i < l; i += 1)  {
                                h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                            }

                            list.html(h);
                        });
                    });
                }

                if (!$u.hasContent(w)) {
                    h += "<form><label for='caap_backup_list'>Profiles<br /><select id='caap_backup_list' multiple='multiple' style='width:400px;height:100px;'>";
                    for (i = 0; i < l; i += 1)  {
                        h += "<option value='" + keys[i] + "'>" + keys[i] + "</option>";
                    }

                    h += "</select></label></form><br />";
                    h += "<form><label for='caap_backup_name'>Name<br /><input id='caap_backup_name' type='text' style='width:400px;' title='Enter the name of the profile.' name='name' /></label></form><br />";
                    h += "<div id='caap_backup_status' class='caap_ff caap_fs caap_tc'></div>";
                    w = $j('<div id="caap_backup" class="caap_ff caap_fs" title="Config Profiles">' + h + '</div>').appendTo(document.body);
                    list = $j("#caap_backup_list", w);
                    name = $j("#caap_backup_name", w);
                    status = $j("#caap_backup_status", w);
                    list.bind("dblclick", getKeys);
                    name.autocomplete({
                        source: keys
                    });

                    w.dialog({
                        resizable : false,
                        width     : 'auto',
                        height    : 'auto',
                        buttons   : {
                            "Backup": function () {
                                n = name.val();
                                if ($u.hasContent(n)) {
                                    if (n === "current") {
                                        alert("This is a system backup.\nYou can not overwrite this.");
                                    } else if (keys.hasIndexOf(n)) {
                                        if (confirm("Overwrite profile?\n" + n)) {
                                            backup(n);
                                        } else {
                                            status.text("Cancelled!");
                                        }
                                    } else {
                                        backup(n);
                                    }
                                } else {
                                    status.text("Enter a name!");
                                }
                            },
                            "Restore": function () {
                                n = name.val();
                                if ($u.hasContent(n)) {
                                    if (keys.hasIndexOf(n)) {
                                        if (confirm("Load profile?\n" + n)) {
                                            restore(n);
                                        } else {
                                            status.text("Cancelled!");
                                        }
                                    } else {
                                        restore(n);
                                    }
                                } else {
                                    status.text("Enter a name!");
                                }
                            },
                            "Erase": function () {
                                n = name.val();
                                if ($u.hasContent(n)) {
                                    if (n === "current") {
                                        alert("This is a system backup.\nYou can not erase this.");
                                    } else if (keys.hasIndexOf(n)) {
                                        if (confirm("Delete profile?\n" + n)) {
                                            erase(n);
                                        } else {
                                            status.text("Cancelled!");
                                        }
                                    } else {
                                        erase(n);
                                    }
                                } else {
                                    status.text("Enter a name!");
                                }
                            },
                            "Close": function () {
                                list.unbind("dblclick", getKeys);
                                w.dialog("destroy").remove();
                            }
                        },
                        close     : function () {
                            list.unbind("dblclick", getKeys);
                            w.dialog("destroy").remove();
                        }
                    });
                }

                return w;
            } catch (err) {
                con.error("ERROR in caap.profilesDialog: " + err);
                return undefined;
            }
        },

        exportDialog: function (data, title) {
            try {
                var h = '',
                    w = $j("#caap_export");

                if (!$u.hasContent(w)) {
                    h = "<textarea style='resize:none;width:400px;height:400px;' readonly='readonly'>" + JSON.stringify(data, null, "\t") + "</textarea>";
                    w = $j('<div id="caap_export" class="caap_ff caap_fs" title="Export ' + title + ' Data">' + h + '</div>').appendTo(document.body);
                    w.dialog({
                        resizable : false,
                        width     : 'auto',
                        height    : 'auto',
                        buttons   : {
                            "Ok": function () {
                                w.dialog("destroy").remove();
                            }
                        },
                        close     : function () {
                            w.dialog("destroy").remove();
                        }
                    });
                }

                return w;
            } catch (err) {
                con.error("ERROR in caap.exportDialog: " + err);
                return undefined;
            }
        },

        importDialog: function (which) {
            try {
                var h    = '',
                    w    = $j("#caap_import"),
                    l    = {},
                    v    = '',
                    resp = false;

                if (!$u.hasContent(w)) {
                    h = "<textarea id='caap_import_data' style='resize:none;width:400px;height:400px;'></textarea>";
                    w = $j('<div id="caap_import" class="caap_ff caap_fs" title="Import ' + which + ' Data">' + h + '</div>').appendTo(document.body);
                    w.dialog({
                        resizable : false,
                        width     : 'auto',
                        height    : 'auto',
                        buttons   : {
                            "Ok": function () {
                                try {
                                    v = JSON.parse($u.setContent($j("#caap_import_data", w).val(), 'null'));
                                } catch (e) {
                                    v = null;
                                }

                                l = $u.setContent(v, 'default');
                                if (($j.isArray(l) || $j.isPlainObject(l)) && l !== 'default') {
                                    resp = confirm("Are you sure you want to load " + which + "?");
                                    if (resp) {
                                        caap.caapfbShutdown();
                                        caap.exportTable[which]['import'](l);
                                        w.dialog("destroy").remove();
                                        caap.reloadCastleAge(true);
                                    }
                                } else {
                                    con.warn(which + " config was not loaded!", l);
                                }
                            },
                            "Close": function () {
                                w.dialog("destroy").remove();
                            }
                        },
                        close     : function () {
                            w.dialog("destroy").remove();
                        }
                    });
                }

                return w;
            } catch (err) {
                con.error("ERROR in caap.importDialog: " + err);
                return undefined;
            }
        },

        deleteDialog: function (which) {
            try {
                var resp = confirm("Are you sure you want to delete " + which + "?");
                if (resp) {
                    caap.caapfbShutdown();
                    caap.exportTable[which]['delete']();
                    caap.reloadCastleAge(true);
                }

                return true;
            } catch (err) {
                con.error("ERROR in caap.deleteDialog: " + err);
                return false;
            }
        },

        actionDialog: function () {
            try {
                var h  = '',
                    w  = $j("#caap_action"),
                    csa = $j(),
                    it = 0,
                    jt = '',
                    t  = '';

                if (!$u.hasContent(w)) {
                    caap.makeActionsList();
                    for (it = 0; it < caap.actionsList.length; it += 1) {
                        for (jt in caap.masterActionList) {
                            if (caap.masterActionList.hasOwnProperty(jt)) {
                                if (caap.actionsList[it] === caap.masterActionList[jt]) {
                                    h += "<li id='caap_action_" + jt + "' class='" + (caap.masterActionList[jt] === 'idle' ? "ui-state-highlight" : "ui-state-default") + "'>" + caap.actionsList[it] + "</li>";
                                }

                                if (it === 0) {
                                    t += $u.dec2hex(jt.parseInt()) + ',';
                                }
                            }
                        }
                    }

                    t = t.substring(0, t.length - 1);
                    w = $j('<div id="caap_action" class="caap_ff caap_fs" title="Action Order"><div style="margin:20px 0px; width: 150px; height: 480px;">' + caap.makeCheckTR('Disable AutoIncome', 'disAutoIncome', false, '') + '<ul class="caap_ul" id="caap_action_sortable">' + h + '</ul></div></div>').appendTo(document.body);
                    csa = $j("#caap_action_sortable", w);
                    w.dialog({
                        resizable : false,
                        modal     : true,
                        width     : '200px',
                        height    : 'auto',
                        buttons   : {
                            "Ok": function () {
                                var result = csa.sortable('toArray'),
                                    s      = '';

                                for (it = 0; it < result.length; it += 1) {
                                    s += $u.dec2hex(result[it].regex(/(\d+)/)) + (it < result.length - 1 ? ',' : '');
                                }

                                if (s === t) {
                                    con.log(1, "Reset actionOrder to default", config.setItem("actionOrder", ''));
                                } else {
                                    con.log(1, "Saved actionOrder to user preference", config.setItem("actionOrder", s));
                                }

                                con.log(1, "Change: setting 'disAutoIncome' to ", config.setItem("disAutoIncome", $j("#caap_disAutoIncome", w).is(":checked")));
                                w.dialog("destroy").remove();
                                caap.actionsList = [];
                                caap.makeActionsList();
                            },
                            "Reset": function () {
                                con.log(1, "Reset actionOrder to default", config.setItem("actionOrder", ''));
                                con.log(1, "Change: setting 'disAutoIncome' to ", config.setItem("disAutoIncome", false));
                                $j("#caap_disAutoIncome", w).attr("checked", false);
                                caap.actionsList = [];
                                caap.makeActionsList();
                                var ht = '',
                                    xt = '';

                                for (xt in caap.masterActionList) {
                                    if (caap.masterActionList.hasOwnProperty(xt)) {
                                        ht += "<li id='caap_action_" + xt + "' class='" + (caap.masterActionList[xt] === 'idle' ? "ui-state-highlight" : "ui-state-default") + "'>" + caap.masterActionList[xt] + "</li>";
                                    }
                                }

                                csa.html(ht).sortable("refresh");
                            }
                        },
                        close     : function () {
                            w.dialog("destroy").remove();
                        }
                    });

                    csa.sortable({
                        containment: w,
                        placeholder: "ui-state-highlight"
                    }).disableSelection();
                }

                return w;
            } catch (err) {
                con.error("ERROR in caap.actionDialog: " + err);
                return undefined;
            }
        },

        ///////////////////////////
        //       Extend jQuery
        ///////////////////////////
        jQueryExtend: function () {
            (function ($) {
                /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
                /*jslint sub: true */
                jQuery.fn['getPercent'] = jQuery.fn.getPercent = function (type) {
                    var t = [];
                    if (!type || type === 'width') {
                        t = this.attr("style").match(/width:\s*([\d\.]+)%/i);
                    } else if (!type || type === 'height') {
                        t = this.attr("style").match(/height:\s*([\d\.]+)%/i);
                    }

                    return (t && t.length >= 2 && t[1]) ? parseFloat(t[1]) : 0;
                };

                jQuery.fn.justtext = function () {
                    return jQuery(this).clone().children().remove().end().text();
                };

                jQuery.fn['colorInput'] = jQuery.fn.colorInput = function (farb_callback, diag_callback) {
                    var t = this,
                        v = jQuery("<div id='" + t.attr("id") + "_diag'></div>").appendTo(document.body),
                        w,
                        x;

                    v.dialog({
                        title     : t.attr("id"),
                        resizable : false,
                        top       : t.offset().top + 'px',
                        left      : (window.innerWidth / 2) + 'px',
                        width     : 'auto',
                        height    : 'auto',
                        buttons   : {
                            "Ok": function () {
                                v.dialog("destroy").remove();
                                if (utility.isFunction(diag_callback)) {
                                    diag_callback(t.attr("id"), t.val());
                                }
                            }
                        },
                        close     : function () {
                            v.dialog("destroy").remove();
                            if (utility.isFunction(diag_callback)) {
                                diag_callback(t.attr("id"), 'close');
                            }
                        }
                    });

                    w = jQuery("<div id='" + t.attr("id") + "_farb'></div>").appendTo(v);
                    x = jQuery.farbtastic(w, function (c) {
                        c = c.toUpperCase();
                        w.css({
                            background : c,
                            color      : utility.bestTextColor(c)
                        });

                        t.css({
                            background: c,
                            color      : utility.bestTextColor(c)
                        });

                        t.val(c);
                        if (utility.isFunction(farb_callback)) {
                            farb_callback(c);
                        }
                    }).setColor(t.val());

                    return [v, w, x];
                };

                jQuery.fn['alert'] = jQuery.fn.alert = function (html) {
                    var w = jQuery('<div id="alert_' + Date.now() + '" title="Alert!">' + (html ? html : '') + '</div>').appendTo(document.body);

                    w.dialog({
                        buttons: {
                            "Ok": function () {
                                w.dialog("destroy").remove();
                            }
                        }
                    });

                    return w;
                };

                /*jslint nomen: false */
                /* Create an array with the values of all the checkboxes in a column */
                jQuery.fn.dataTableExt.afnSortData['dom-checkbox'] = function (oSettings, iColumn) {
                    var aData = [];
                    jQuery('td:eq(' + iColumn + ') input', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                        aData.push(this.checked === true ? "1" : "0");
                    });

                    return aData;
                };

                jQuery.fn.dataTableExt.afnSortData['remaining-time'] = function (oSettings, iColumn) {
                    var aData = [];
                    jQuery('td:eq(' + iColumn + ')', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                        aData.push(jQuery(this).text().lpad("0", 9));
                    });

                    return aData;
                };

                jQuery.fn.dataTableExt.afnSortData['scan-date'] = function (oSettings, iColumn) {
                    var aData = [];
                    jQuery('td:eq(' + iColumn + ')', oSettings.oApi._fnGetTrNodes(oSettings)).each(function () {
                        aData.push(jQuery(this).text().split("-").reverse().join("-"));
                    });

                    return aData;
                };
                /*jslint nomen: true */
                /*jslint sub: false */
            }(jQuery));
        }
    };

    /* This section is added to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    //window['caap'] = true; // sets caap to boolean should (must?) be object // 2011-09-27 CAGE
    caap['checkResults_index'] = caap.checkResults_index;
    caap['checkResults_fightList'] = caap.checkResults_fightList;
    caap['checkResults_viewFight'] = caap.checkResults_viewFight;
    caap['checkResults_fightList'] = caap.checkResults_fightList;
    caap['checkResults_viewFight'] = caap.checkResults_viewFight;
    caap['checkResults_land'] = caap.checkResults_land;
    caap['checkResults_generals'] = caap.checkResults_generals;
    caap['checkResults_quests'] = caap.checkResults_quests;
    caap['checkResults_gift_accept'] = caap.checkResults_gift_accept;
    caap['checkResults_army'] = caap.checkResults_army;
    caap['checkResults_keep'] = caap.checkResults_keep;
    caap['checkResults_oracle'] = caap.checkResults_oracle;
    caap['checkResults_alchemy'] = caap.checkResults_alchemy;
    caap['checkResults_battlerank'] = caap.checkResults_battlerank;
    caap['checkResults_war_rank'] = caap.checkResults_war_rank;
    caap['checkResults_achievements'] = caap.checkResults_achievements;
    caap['checkResults_battle'] = caap.checkResults_battle;
    caap['checkResults_soldiers'] = caap.checkResults_soldiers;
    caap['checkResults_item'] = caap.checkResults_item;
    caap['checkResults_magic'] = caap.checkResults_magic;
    caap['checkResults_gift'] = caap.checkResults_gift;
    caap['checkResults_goblin_emp'] = caap.checkResults_goblin_emp;
    caap['checkResults_view_class_progress'] = caap.checkResults_view_class_progress;
    caap['checkResults_guild'] = caap.checkResults_guild;
    caap['checkResults_guild_current_battles'] = caap.checkResults_guild_current_battles;
    caap['checkResults_guild_current_monster_battles'] = caap.checkResults_guild_current_monster_battles;
    caap['checkResults_guild_battle_monster'] = caap.checkResults_guild_battle_monster;
    //caap['checkResults_arena'] = caap.checkResults_arena;
    //caap['checkResults_arena_battle'] = caap.checkResults_arena_battle;
    caap['autoElite'] = caap.autoElite;
    caap['heal'] = caap.heal;
    caap['immediateBanking'] = caap.immediateBanking;
    caap['immediateAutoStat'] = caap.immediateAutoStat;
    caap['maxEnergyQuest'] = caap.maxEnergyQuest;
    caap['monsterReview'] = caap.monsterReview;
    caap['guildMonsterReview'] = caap.guildMonsterReview;
    caap['guildMonster'] = caap.guildMonster;
    caap['demiPoints'] = caap.demiPoints;
    caap['monsters'] = caap.monsters;
    caap['battle'] = caap.battle;
    caap['quests'] = caap.quests;
    caap['bank'] = caap.bank;
    caap['passiveGeneral'] = caap.passiveGeneral;
    caap['lands'] = caap.lands;
    caap['autoBless'] = caap.autoBless;
    caap['autoStat'] = caap.autoStat;
    caap['autoGift'] = caap.autoGift;
    caap['autoPotions'] = caap.autoPotions;
    caap['autoAlchemy'] = caap.autoAlchemy;
    caap['idle'] = caap.idle;
    caap['autoIncome'] = caap.autoIncome;
    //caap['arena'] = caap.arena;
    //caap['arenaReview'] = caap.arenaReview;
	
	// from feed object
	caap['opMessage'] = feed.opMessage;
    
	/*jslint sub: false */
