////////////////////////////////////////////////////////////////////
//                          caap OBJECT
// this is the main object for the game, containing all methods, globals, etc.
/////////////////////////////////////////////////////////////////////
caap = {
    namespace : "caap",
    caapDivObject : {},
    caapTopObject : {},
    caapTopMinObject : {},
    caapPlayButtonDiv : {},
    documentTitle : '',
    newVersionAvailable : typeof CAAP_SCOPE_RUN !== 'undefined' ? (devVersion !== '0' ? (CAAP_SCOPE_RUN[1] > caapVersion || (CAAP_SCOPE_RUN[1] >= caapVersion && CAAP_SCOPE_RUN[2] > devVersion)) : (CAAP_SCOPE_RUN[1] > caapVersion)) : false,
    fbIframeDiv : {},
    ajaxLoadIcon : {},
    globalContainer : {},
    caToolsDiv : {},
    appBodyDiv : {},
    pageletPresenceDiv : {},
    tempAjax : {},
    resultsWrapperDiv : {},
    resultsText : '',
    jWindow : null,
    jss : "javascript",
    libs : {
        jQuery : 'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js',
        jQueryUI : 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js',
        farbtastic : 'https://castle-age-auto-player.googlecode.com/files/farbtastic.min.js',
        utility : 'https://utility-js.googlecode.com/files/utility-0.2.3.min.js',
        dataTables : 'https://castle-age-auto-player.googlecode.com/files/jquery.dataTables-1.8.1.min.js'
    },
    removeLibs : [],
    domain : {
        which : -1,
        protocol : ["http://", "https://"],
        ptype : 0,
        url : ["apps.facebook.com/castle_age", "apps.facebook.com/reqs.php#confirm_46755028429_0", "web3.castleagegame.com/castle_ws", "web.castleagegame.com/castle", "www.facebook.com/dialog/apprequests"],
        /*
         id       : ["app46755028429_", "", ""],
         ajax     : ["a46755028429_", "", ""],
         */
        id : ["", "", "", "", ""],
        ajax : ["", "", "", "", ""],
        link : "",
        altered : "",
        inIframe : false
    },

    setDomWaiting : function(url) {
        var update = $u.hasContent(url) && !session.getItem('clickUrl', '').hasIndexOf(url);
        con.log(3, "setDomWaiting update", update);
        if(update) {
            session.setItem('clickUrl', url);
        }

        if(update || !session.getItem("waitingForDomLoad", false)) {
            con.log(3, "waitingForDomLoad", session.getItem('clickUrl', ''));
            schedule.setItem("clickedOnSomething", 0);
            session.setItem("waitingForDomLoad", true);
        }
    },
    getDomWaiting : function() {
        return session.getItem("waitingForDomLoad", false);
    },
    clearDomWaiting : function(url) {
        con.log(3, "clearDomWaiting");
        schedule.setItem("clickedOnSomething", 3600);
        session.setItem("waitingForDomLoad", false);
    },
    sessionVarsInit : function() {
        session.setItem("lastReload", Date.now());
        session.setItem("pageLoadCounter", 0);
        session.setItem("flagReload", false);
        session.setItem("delayMain", false);
        session.setItem("pageLoadOK", true);
        session.setItem('clickUrl', window.location.href);
        session.setItem("waitingForDomLoad", false);
    },
    dataRegister : {
        "config.options" : {
            "get" : function() {
                return config.getAll();
            },
            "set" : function(value) {
                config.setAll(value);
            },
            "loaded" : false
        },
        "state.flags" : {
            "get" : function() {
                return state.getAll();
            },
            "set" : function(value) {
                state.setAll(value);
            },
            "loaded" : false
        },
        "schedule.timers" : {
            "get" : function() {
                return schedule.getAll();
            },
            "set" : function(value) {
                schedule.setAll(value);
            },
            "loaded" : false
        },
        "caap.stats" : {
            "get" : function() {
                return caap.stats;
            },
            "set" : function(value) {
                caap.stats = value;
            },
            "save" : function(src) {
                caap.saveStats(src);
            },
            "loaded" : false
        },
        "caap.demi" : {
            "get" : function() {
                return caap.demi;
            },
            "set" : function(value) {
                caap.demi = value;
            },
            "save" : function(src) {
                caap.SaveDemi(src);
            },
            "loaded" : false
        },
        "gifting.gifts.records" : {
            "get" : function() {
                return gifting.gifts.records;
            },
            "set" : function(value) {
                gifting.gifts.records = value;
            },
            "save" : function(src) {
                gifting.save("gifts", src);
            },
            "loaded" : false
        },
        "gifting.queue.records" : {
            "get" : function() {
                return gifting.queue.records;
            },
            "set" : function(value) {
                gifting.queue.records = value;
            },
            "save" : function(src) {
                gifting.save("queue", src);
            },
            "loaded" : false
        },
        "gifting.history.records" : {
            "get" : function() {
                return gifting.history.records;
            },
            "set" : function(value) {
                gifting.history.records = value;
            },
            "save" : function(src) {
                gifting.save("history", src);
            },
            "loaded" : false
        },
        "gifting.cachedGiftEntry" : {
            "get" : function() {
                return gifting.cachedGiftEntry;
            },
            "set" : function(value) {
                gifting.cachedGiftEntry = value;
            },
            "save" : function(src) {
                gifting.setCurrent(gifting.cachedGiftEntry, false, src);
            },
            "loaded" : false
        },
        "army.records" : {
            "get" : function() {
                return army.records;
            },
            "set" : function(value) {
                army.records = value;
            },
            "save" : function(src) {
                army.save(src);
            },
            "loaded" : false
        },
        "battle.records" : {
            "get" : function() {
                return battle.records;
            },
            "set" : function(value) {
                battle.records = value;
            },
            "save" : function(src) {
                battle.save(src);
            },
            "loaded" : false
        },
        "battle.reconRecords" : {
            "get" : function() {
                return battle.reconRecords;
            },
            "set" : function(value) {
                battle.reconRecords = value;
            },
            "save" : function(src) {
                battle.saveRecon(src);
            },
            "loaded" : false
        },
        "feed.records" : {
            "get" : function() {
                return feed.records;
            },
            "set" : function(value) {
                feed.records = value;
            },
            "save" : function(src) {
                feed.save(src);
            },
            "loaded" : false
        },
        "feed.recordsSortable" : {
            "get" : function() {
                return feed.recordsSortable;
            },
            "set" : function(value) {
                feed.recordsSortable = value;
            },
            "loaded" : false
        },
        "feed.monsterList" : {
            "get" : function() {
                return feed.monsterList;
            },
            "set" : function(value) {
                feed.monsterList = value;
            },
            "save" : function(src) {
                feed.saveList(src);
            },
            "loaded" : false
        },
        "festival.records" : {
            "get" : function() {
                return festival.records;
            },
            "set" : function(value) {
                festival.records = value;
            },
            "save" : function(src) {
                festival.save(src);
            },
            "loaded" : false
        },
        "general.records" : {
            "get" : function() {
                return general.records;
            },
            "set" : function(value) {
                general.records = value;
            },
            "save" : function(src) {
                general.save(src);
            },
            "loaded" : false
        },
        "guild_monster.records" : {
            "get" : function() {
                return guild_monster.records;
            },
            "set" : function(value) {
                guild_monster.records = value;
            },
            "save" : function(src) {
                guild_monster.save(src);
            },
            "loaded" : false
        },
        "monster.records" : {
            "get" : function() {
                return monster.records;
            },
            "set" : function(value) {
                monster.records = value;
            },
            "save" : function(src) {
                monster.save(src);
            },
            "loaded" : false
        },
        "spreadsheet.records" : {
            "get" : function() {
                return spreadsheet.records;
            },
            "set" : function(value) {
                spreadsheet.records = value;
            },
            "save" : function(src) {
                spreadsheet.save(src);
            },
            "loaded" : false
        },
        "town.soldiers" : {
            "get" : function() {
                return town.soldiers;
            },
            "set" : function(value) {
                town.soldiers = value;
            },
            "save" : function(src) {
                town.save("soldiers", src);
            },
            "loaded" : false
        },
        "town.item" : {
            "get" : function() {
                return town.item;
            },
            "set" : function(value) {
                town.item = value;
            },
            "save" : function(src) {
                town.save("item", src);
            },
            "loaded" : false
        },
        "town.magic" : {
            "get" : function() {
                return town.magic;
            },
            "set" : function(value) {
                town.magic = value;
            },
            "save" : function(src) {
                town.save("magic", src);
            },
            "loaded" : false
        }
    },

    mTarget : {
        "caapfb" : {
            ref : null,
            url : "*"
        },
        "caapif" : {
            ref : null,
            url : "*"
        },
        "caapifp" : {
            ref : null,
            url : "*"
        }
    },

    postMessage : function(msg) {
        try {
            var port = $u.is_chrome ? caap.port : caap.mTarget[msg.dest].ref, msj = $u.is_chrome ? msg : JSON.stringify(msg), url = $u.is_chrome ? null : $u.setContent(caap.mTarget[msg.dest].url, "*");

            if(!port) {
                throw "No port available";
            }

            port.postMessage(msj, url);
        } catch (err) {
            con.error("ERROR in postMessage: " + err, msg);
            //alert("ERROR in postMessage: " + err);
            $u.reload();
        }
    },
    messaging : {
        connected : ["caap"],
        dataRegisterLoaded : false,
        connect : function() {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caap")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caap",
                        message : "connect",
                        data : ""
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caap")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : ($u.is_chrome ? "caap" : "caapfb"),
                        message : "connect",
                        data : ""
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caap")) {
                    caap.postMessage({
                        source : "caapifp",
                        dest : ($u.is_chrome ? "caap" : "caapif"),
                        message : "connect",
                        data : ""
                    });
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
        setItem : function(name, value) {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "setItem",
                        data : {
                            name : name,
                            value : value
                        }
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "setItem",
                        data : {
                            name : name,
                            value : value
                        }
                    });
                    session.incItem("messageCount");
                } else {
                    if(caap.domain.which !== 4) {
                        throw "Wrong domain or destination not connected";
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.setItem: " + err);
                return false;
            }
        },
        getItem : function(msg, data) {
            try {
                if(caap.messaging.connected.hasIndexOf(msg.source)) {
                    caap.postMessage({
                        source : msg.dest,
                        dest : msg.source,
                        message : "getItem",
                        data : data
                    });
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
        ok : function(msg) {
            try {
                if((caap.domain.which === 0 || caap.domain.which === 3 || caap.domain.which === 4) && caap.messaging.connected.hasIndexOf(msg.source)) {
                    caap.postMessage({
                        source : msg.dest,
                        dest : msg.source,
                        message : "ok",
                        data : msg.message
                    });
                } else {
                    throw "Wrong domain or destination not connected";
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.ok: " + err);
                return false;
            }
        },
        visitUrl : function(url) {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "visitUrl",
                        data : url
                    });
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
        setDivContent : function(name, value, hide) {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "setDivContent",
                        data : {
                            name : name,
                            value : value,
                            hide : ( hide ? true : false)
                        }
                    });
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
        setCheckedIds : function(idArray) {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapifp")) {
                    session.setItem("delayMain", true);
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapifp",
                        message : "setCheckedIds",
                        data : idArray
                    });
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
        restartListener : function(inform) {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "restartListener",
                        data : ""
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    if(inform) {
                        caap.postMessage({
                            source : "caapif",
                            dest : "caapfb",
                            message : "restartListener",
                            data : ""
                        });
                        session.incItem("messageCount");
                    }
                } else {
                    if(caap.domain.which === 0 || caap.domain.which === 3) {
                        throw "Destination not connected";
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.restartListener: " + err);
                return false;
            }
        },
        pauseListener : function(inform) {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "pauseListener",
                        data : ""
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    if(inform) {
                        caap.postMessage({
                            source : "caapif",
                            dest : "caapfb",
                            message : "pauseListener",
                            data : ""
                        });
                        session.incItem("messageCount");
                    }
                } else {
                    if(caap.domain.which === 0 || caap.domain.which === 3) {
                        throw "Destination not connected";
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.pauseListener: " + err);
                return false;
            }
        },
        ajaxGiftCheck : function() {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "ajaxGiftCheck",
                        data : ""
                    });
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
        changeDropDownList : function(idName, dropList, option) {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "changeDropDownList",
                        data : {
                            idName : idName,
                            dropList : dropList,
                            option : option
                        }
                    });
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
        selectDropOption : function(idName, value) {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "selectDropOption",
                        data : {
                            idName : idName,
                            value : value
                        }
                    });
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
        hello : function(msg) {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "hello",
                        data : ""
                    });
                    session.incItem("messageCount");
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "hello",
                        data : ""
                    });
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
        sentGifts : function(msg, results) {
            try {
                if(caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : msg.dest,
                        dest : msg.source,
                        message : "sentGifts",
                        data : results
                    });
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
        broadcast : function() {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "broadcast",
                        data : caap.messaging.connected
                    });
                } else {
                    throw "Wrong domain or destination not connected";
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.broadcast: " + err);
                return false;
            }
        },
        cntd : function(msg) {
            try {
                if((caap.domain.which === 0 || caap.domain.which === 3) && caap.messaging.connected.hasIndexOf(msg.source)) {
                    caap.postMessage({
                        source : msg.dest,
                        dest : msg.source,
                        message : "connected",
                        data : caap.messaging.connected
                    });
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
        disconnect : function(msg) {
            try {
                if(caap.domain.which === 4 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapifp",
                        dest : "caapif",
                        message : "disconnect",
                        data : ""
                    });
                    caap.caapifpShutdown();
                } else if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "disconnect",
                        data : ""
                    });
                    caap.caapifShutdown();
                } else if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "disconnect",
                        data : ""
                    });
                } else {
                    throw "Wrong domain or destination not connected";
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.disconnect: " + err);
                return false;
            }
        },
        scrollToTop : function() {
            try {
                if(caap.domain.which === 3 && caap.messaging.connected.hasIndexOf("caapfb")) {
                    caap.postMessage({
                        source : "caapif",
                        dest : "caapfb",
                        message : "scrollToTop",
                        data : ""
                    });
                } else {
                    throw "Wrong domain or destination not connected";
                }

                return true;
            } catch (err) {
                con.error("ERROR in messaging.scrollToTop: " + err);
                return false;
            }
        },
        styleChange : function() {
            try {
                if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif")) {
                    caap.postMessage({
                        source : "caapfb",
                        dest : "caapif",
                        message : "styleChange",
                        data : ""
                    });
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

    scrollToTop : function() {
        window.scrollTo(0, config.getItem("scrollToPosition", 0));
    },
    showRequestForm : (function(tit, msg, track, request_params) {
        FB.api({
            method : 'fql.query',
            query : 'SELECT uid FROM user WHERE is_app_user = 1 AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())'
        }, function(result) {
            var i, appUsers = [], filterLists = [], lists = {
                0x00 : {
                    name : 'Send',
                    list : 'caap_giftSend',
                    gift : true,
                    fest : false,
                    recr : false,
                    mons : false,
                    prom : false,
                    all : false
                },
                0x01 : {
                    name : 'app_users',
                    list : '',
                    gift : false,
                    fest : false,
                    recr : false,
                    mons : false,
                    prom : false,
                    all : true
                },
                0x02 : {
                    name : 'Custom',
                    list : 'caap_giftCustom',
                    gift : true,
                    fest : false,
                    recr : false,
                    mons : true,
                    prom : true,
                    all : false
                },
                0x03 : {
                    name : 'Guild',
                    list : 'caap_giftGuild',
                    gift : true,
                    fest : true,
                    recr : false,
                    mons : true,
                    prom : true,
                    all : false
                },
                0x04 : {
                    name : 'Gift Queue',
                    list : 'caap_giftQueue',
                    gift : true,
                    fest : false,
                    recr : false,
                    mons : false,
                    prom : false,
                    all : false
                },
                0x05 : {
                    name : 'Gift History',
                    list : 'caap_giftHistory',
                    gift : true,
                    fest : true,
                    recr : false,
                    mons : false,
                    prom : true,
                    all : false
                },
                0x06 : {
                    name : 'all',
                    list : '',
                    gift : false,
                    fest : false,
                    recr : true,
                    mons : false,
                    prom : false,
                    all : false
                },
                0x07 : {
                    name : 'app_non_users',
                    list : '',
                    gift : false,
                    fest : false,
                    recr : true,
                    mons : false,
                    prom : false,
                    all : false
                },
                0x08 : {
                    name : 'Non Followers',
                    list : 'caap_nfollowers',
                    gift : false,
                    fest : true,
                    recr : false,
                    mons : false,
                    prom : false,
                    all : false
                }
            }, list, limit = false, gift = request_params.indexOf("gift=") >= 0, fest = request_params.indexOf("fest=") >= 0, recr = msg.indexOf("recruiting") >= 0, mons = request_params.indexOf("battle_monster") >= 0, prom = request_params.indexOf("popup_promo_create") >= 0;

            for(i in result) {
                if(result.hasOwnProperty(i)) {
                    appUsers.push(parseInt(result[i].uid, 10));
                }
            }

            for(i in lists) {
                if(lists.hasOwnProperty(i)) {
                    if(!lists[i].all) {
                        if((!gift && !fest && !recr && !mons && !prom) || (gift && !lists[i].gift) || (fest && !lists[i].fest) || (recr && !lists[i].recr) || (mons && !lists[i].mons) || (prom && !lists[i].prom)) {
                            continue;
                        }
                    }
                    list = '';
                    if(lists[i].list) {
                        list = sessionStorage.getItem(lists[i].list);
                        list = list && list.length ? JSON.parse(list).filter(function(member) {
                            return appUsers.indexOf(member) >= 0;
                        }) : null;
                        if(list && list.length) {
                            filterLists.push({
                                name : lists[i].name,
                                user_ids : list
                            });
                            if(lists[i].name === "Send") {
                                limit = true;
                            }
                        }
                    } else {
                        filterLists.push(lists[i].name);
                    }

                    if(limit && lists[i].name === "app_users") {
                        break;
                    }
                }
            }

            console.log("filterLists", filterLists);
            FB.ui({
                method : 'apprequests',
                message : msg,
                filters : filterLists,
                data : track,
                title : tit
            }, function(result) {
                $('.fb_dialog_iframe').each(function() {
                    $(this).remove();
                });

                sessionStorage.setItem("caap_giftResult", JSON.stringify(result));
                if(result && result.request_ids) {
                    var request_id_string = String(result.request_ids), request_id_array = request_id_string.split(','), request_id_count = request_id_array.length, params = 'ajax=1&signed_request=SIGNED_REQUEST';

                    $.ajax({
                        url : 'request_handler.php?' + request_params + '&request_ids=' + result.request_ids,
                        context : document.body,
                        data : params,
                        type : 'POST',
                        success : function(data) {
                            document.getElementById('results_container').innerHTML = request_id_count + (request_id_count === 1 ? ' request' : ' requests') + ' sent! By CAAP';
                            FB.XFBML.parse(document.getElementById('results_container'));
                            $('#results_container').show();
                        }
                    });
                }
            });
        });
    }).toString(),

    getSigned : function() {
        try {
            var params = $u.setContent($j('script').text(), '').regex(new RegExp("params \\+= '&signed_request(.*)'", 'gmi')), inject;

            if($u.hasContent(params)) {
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
    mainCaapLoop : function() {
        caap.makeActionsList();
        caap.waitMilliSecs = 8000;
        caap.waitMainLoop();
        caap.reloadOccasionally();
    },
    getMsgItem : function(msg) {
        try {
            var done = true, it;

            caap.dataRegister[msg.data.name]['set'](msg.data.value);
            caap.dataRegister[msg.data.name]["loaded"] = true;
            for(it in caap.dataRegister) {
                if(caap.dataRegister.hasOwnProperty(it)) {
                    if(!done) {
                        break;
                    }

                    if(!caap.dataRegister[it]["loaded"]) {
                        done = false;
                    }
                }
            }

            if(done) {
                con.log_level = config.getItem('DebugLevel', 1);
                con.log(2, "iframe all data loaded");
                //con.log(2, "config", config);
                //con.log(2, "state", state);
                //con.log(2, "schedule", schedule);
                caap.messaging.dataRegisterLoaded = true;
                ss = new $u.StorageHelper({
                    'namespace' : caap.namespace,
                    'storage_id' : caap.stats['FBID'].toString(),
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
    setCheckedIds : function(msg) {
        try {
            con.log(2, "setCheckedIds received", msg.data);
            var results = {
                'notChecked' : [],
                'areChecked' : [],
                'notFound' : [],
                'areFound' : []
            }, it = 0, len = msg.data.length;

            function doChecks() {
                var input, checkState;

                for( it = 0; it < len; it += 1) {
                    checkState = false;
                    input = $j("input[value='" + msg.data[it] + "']");
                    if($u.hasContent(input)) {
                        caap.click(input);
                        results['areFound'].push(msg.data[it]);
                        checkState = input.is(":checked");
                        if(checkState) {
                            results['areChecked'].push(msg.data[it]);
                        } else {
                            results['notChecked'].push(msg.data[it]);
                        }

                    } else {
                        results['notFound'].push(msg.data[it]);
                    }
                }
                input = $u.hasContent(results['areChecked']) ? $j("input[name='ok_clicked']") : $j("input[name='cancel_clicked']");
                if(input) {
                    caap.messaging.sentGifts(msg, results);
                    caap.click(input);
                }
            }


            window.setTimeout(function() {
                var objDiv = $j('.fbProfileBrowserListContainer').parent(), domDiv = objDiv.get(1), to;

                objDiv.bind("DOMNodeInserted", function() {
                    con.log(3, "Scroll ...");
                    window.clearTimeout(to);
                    domDiv.scrollTop = domDiv.scrollHeight;
                    to = window.setTimeout(doChecks, 5000);
                });
                if(domDiv) {
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
    initDb : function(FBID) {
        if(caap.domain.which === 3 || caap.domain.which === 4) {
            config = new $u.VarsHelper();
            config.oldSetItem = config.setItem;
            config.setItem = function(name, value) {
                config.oldSetItem(name, value);
                caap.messaging.setItem('config.options', config.getAll());
                return config.getItem(name, value);
            };
            state = new $u.VarsHelper();
            state.oldSetItem = state.setItem;
            state.setItem = function(name, value) {
                state.oldSetItem(name, value);
                caap.messaging.setItem('state.flags', state.getAll());
                return state.getItem(name, value);
            };
            schedule = new $u.ScheduleVarsHelper();
            schedule.oldSetItem = schedule.setItem;
            schedule.setItem = function(name, seconds, randomSecs) {
                schedule.oldSetItem(name, seconds, randomSecs);
                caap.messaging.setItem('schedule.timers', schedule.getAll());
                return schedule.getItem(name);
            };
        } else {
            db = new $u.IDBHelperAsync();
            if(db && db.available) {
                //db.onsuccess = function () {con.log(1, "db", db)};
                db.open(caap.namespace + "." + FBID, "CAAP Database", "1");
            }

            //con.log(1, "$u", $u);
            gm = new $u.StorageHelper({
                'namespace' : caap.namespace,
                'storage_id' : FBID.toString(),
                'storage_type' : 'localStorage'
            });

            //con.log(1, "gm", gm);
            ss = new $u.StorageHelper({
                'namespace' : caap.namespace,
                'storage_id' : FBID.toString(),
                'storage_type' : 'sessionStorage'
            });

            //con.log(1, "ss", ss);
            //gm.clear('0');
            config = new $u.ConfigHelper("config.options", "current", {
                'namespace' : caap.namespace,
                'storage_id' : FBID.toString(),
                'storage_type' : 'localStorage'
            });

            if(caap.domain.which === 0) {
                config.oldSave = config.save;
                config.save = function() {
                    config.oldSave();
                    con.log(3, "config.save", config);
                    if(caap.messaging.connected.hasIndexOf("caapif")) {
                        con.log(3, "config.save send");
                        caap.messaging.setItem('config.options', config.getAll());
                    }
                };
            }
            state = new $u.ConfigHelper("state.flags", "current", {
                'namespace' : caap.namespace,
                'storage_id' : FBID.toString(),
                'storage_type' : 'localStorage'
            });

            if(caap.domain.which === 0) {
                state.oldSave = state.save;
                state.save = function() {
                    state.oldSave();
                    con.log(3, "state.save", state);
                    if(caap.messaging.connected.hasIndexOf("caapif")) {
                        con.log(3, "state.save send");
                        caap.messaging.setItem('state.flags', state.getAll());
                    }
                };
            }
            schedule = new $u.ScheduleStorageHelper("schedule.timers", "current", {
                'namespace' : caap.namespace,
                'storage_id' : FBID.toString(),
                'storage_type' : 'localStorage'
            });

            if(caap.domain.which === 0) {
                schedule.oldSave = schedule.save;
                schedule.save = function() {
                    schedule.oldSave();
                    con.log(3, "schedule.save", schedule);
                    if(caap.messaging.connected.hasIndexOf("caapif")) {
                        con.log(3, "schedule.save send");
                        caap.messaging.setItem('schedule.timers', schedule.getAll());
                    }
                };
            }
        }
    },
    giftingHandler : function(msg, event) {
        if((msg.source === "caap" || msg.source === "caapif" || msg.source === "caapfb") && msg.dest === "caapifp") {
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
                    if(msg.source === ($u.is_chrome ? "caap" : "caapif") && msg.data.name === "connected") {
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
    caapifpPMListener : function(e) {
        try {
            if(caap.domain.which === 4) {
                if(e.origin.hasIndexOf("web.castleagegame.com") || e.origin.hasIndexOf("apps.facebook.com")) {
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
    caapifpStartup : function() {
        try {
            if(caap.domain.which === 4) {
                if($u.is_chrome) {
                    caap.port = chrome.extension.connect({
                        name : "caapifp"
                    });
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
    caapifpShutdown : function() {
        try {
            if(caap.domain.which === 4) {
                if($u.is_chrome) {
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
    iframeHandler : function(msg, event) {
        if((msg.source === "caap" || msg.source === "caapfb" || msg.source === "caapifp") && msg.dest === "caapif") {
            switch (msg.message) {
                case "ok":
                    session.decItem("messageCount");
                    break;
                case "connect":
                    if(!caap.messaging.connected.hasIndexOf(msg.source)) {
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
                    if(!caap.messaging.dataRegisterLoaded) {
                        caap.messaging.hello(msg);
                    }

                    break;
                case "disconnect":
                    caap.messaging.connected.removeByValue(msg.source);
                    con.log(2, "current connections", caap.messaging.connected, msg.source);
                    break;
                case "broadcast":
                    if(msg.source === ($u.is_chrome ? "caap" : "caapif") && msg.data.name === "connected") {
                        caap.messaging.connected = msg.data.value;
                        caap.messaging.ok(msg);
                        con.log(3, "broadcast connected received", caap.messaging.connected);
                        if(!caap.messaging.dataRegisterLoaded) {
                            caap.messaging.hello(msg);
                        }
                    }

                    break;
                case "hello":
                    caap.messaging.ok(msg);
                    for(var it in caap.dataRegister) {
                        if(caap.dataRegister.hasOwnProperty(it)) {
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
                    if(msg.data.name === "config.options") {
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
    caapifPMListener : function(e) {
        try {
            if(caap.domain.which === 3) {
                if(e.origin.hasIndexOf("apps.facebook.com") || e.origin.hasIndexOf("www.facebook.com")) {
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
    caapifStartup : function() {
        try {
            if(caap.domain.which === 3) {
                if($u.is_chrome) {
                    caap.port = chrome.extension.connect({
                        name : "caapif"
                    });
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
    caapifShutdown : function() {
        try {
            if(caap.domain.which === 3) {
                if($u.is_chrome) {
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
    chromeHandler : function(msg, event) {
        if((msg.source === "caap" || msg.source === "caapif" || msg.source === "caapifp") && msg.dest === "caapfb") {
            switch (msg.message) {
                case "ok":
                    session.decItem("messageCount");
                    break;
                case "connect":
                    if(!caap.messaging.connected.hasIndexOf(msg.source)) {
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
                    if(msg.source === "caap" && msg.data.name === "connected") {
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
                    caap.messaging.getItem(msg, {
                        name : msg.data,
                        value : caap.dataRegister[msg.data]['get']()
                    });
                    break;
                case "setItem":
                    caap.messaging.ok(msg);
                    caap.dataRegister[msg.data.name]['set'](msg.data.value);
                    if($u.isFunction(caap.dataRegister[msg.data.name]['save'])) {
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
    caapfbPMListener : function(e) {
        try {
            if(caap.domain.which === 0) {
                if(e.origin.hasIndexOf("web.castleagegame.com")) {
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
    caapfbStartup : function() {
        try {
            if(caap.domain.which === 0) {
                if($u.is_chrome) {
                    caap.port = chrome.extension.connect({
                        name : "caapfb"
                    });
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
    caapfbShutdown : function() {
        try {
            if(caap.domain.which === 0) {
                if($u.is_chrome) {
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
    fbData : null,

    fbEnv : null,

    setGiftGuild : function() {
        var i = 0, l = caap.stats['guild']['members'].length, g = [];

        for( i = 0; i < l; i += 1) {
            g.push(caap.stats['guild']['members'][i]['userId']);
        }

        con.log(1, "g", g);
        if($u.hasContent(g)) {
            sessionStorage.setItem("caap_giftGuild", JSON.stringify(g));
        }
    },
    setGiftQueue : function() {
        var g = gifting.queue.getIds();
        if($u.hasContent(g)) {
            sessionStorage.setItem("caap_giftQueue", JSON.stringify(g));
        }
    },
    setGiftHistory : function() {
        var g = gifting.history.getIds();
        if($u.hasContent(g)) {
            sessionStorage.setItem("caap_giftHistory", JSON.stringify(g));
        }
    },
    setGiftCustom : function() {
        if(config.getItem("FBCustomDrop", false)) {
            var g = config.getList("FBCustomDropList", "");
            if($u.hasContent(g)) {
                sessionStorage.setItem("caap_giftCustom", JSON.stringify(g));
            }
        } else {
            sessionStorage.removeItem("caap_giftCustom");
        }
    },

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    lsUsed : function() {
        try {
            var used = {
                'type' : '',
                'match' : 0,
                'total' : 0
            }, perc = {
                caap : 0,
                total : 0
            }, msg = '';
            used = gm.used();
            if(used['type'] !== "greaseMonkey") {
                perc.caap = ((used['match'] * 2.048 / 5242880) * 100).dp();
                con.log(1, "CAAP localStorage used: " + perc.caap + "%");
                perc.total = ((used['total'] * 2.048 / 5242880) * 100).dp();
                if(perc.total >= 90) {
                    con.warn("Total localStorage used: " + perc.total + "%");
                    msg = "<div style='text-align: center;'>";
                    msg += "<span style='color: red; font-size: 14px; font-weight: bold;'>WARNING!</span><br />";
                    msg += "localStorage usage for domain: " + perc.total + "%<br />";
                    msg += "CAAP is using: " + perc.total + "%";
                    msg += "</div>";
                    window.setTimeout(function() {
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

    incrementPageLoadCounter : function() {
        try {
            return session.incItem("pageLoadCounter");
        } catch (err) {
            con.error("ERROR in incrementPageLoadCounter: " + err);
            return undefined;
        }
    },
    injectCATools : function() {
        $u.injectScript("http://cage.northcornwall.com/hoots/catbox.asp?" + Math.random());
    },
    init : function() {
        try {
            var tDiv;

            if(caap.domain.which === 2 || caap.domain.which === 3) {
                caap.ajaxLoadIcon = $j('#' + caap.domain.id[caap.domain.which] + 'AjaxLoadIcon');
            }

            if(caap.domain.which === 3 && config.getItem('backgroundCA', false)) {
                $j("body").css({
                    'background-image' : "",
                    'background-position' : 'center top',
                    'background-repeat' : 'no-repeat',
                    'background-color' : 'black',
                    'margin' : '0px',
                    'overflow' : 'hidden'
                });
            }

            if(caap.domain.which === 0 && config.getItem('backgroundCA', false)) {
                $j("body").css({
                    'background-image' : "url('http://image4.castleagegame.com/graphics/guild_webpage_bg.jpg')",
                    'background-position' : 'center top',
                    'background-repeat' : 'no-repeat',
                    'background-color' : 'black',
                    'margin' : '0px'
                });

                $j("#contentCol").css({
                    'background-color' : 'black'
                });

                $j("#contentArea").css({
                    'background-image' : "url('http://image4.castleagegame.com/graphics/ws_middle.jpg')",
                    'padding' : '0px 10px'
                });

                $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                    'display' : 'none'
                });

                $j("#contentCol").removeClass("clearfix");
            }

            if(caap.domain.which === 0 || caap.domain.which === 2) {
                caap.controlXY.selector = caap.domain.which === 0 ? "#contentArea" : "#globalcss";
            }

            if(caap.domain.which === 2 || caap.domain.which === 3) {
                caap.dashboardXY.selector = "#" + caap.domain.id[caap.domain.which] + "app_body_container";
            }

            function chatListener(event) {
                if(event.target.className === "fbDockWrapper fbDockWrapperRight bb") {
                    event.target.style.display = "none";
                    caap.pageletPresenceDiv.unbind("DOMNodeInserted", chatListener);
                }
            }

            if(caap.domain.which === 0) {
                caap.pageletPresenceDiv = $j("#pagelet_presence");
                // Get rid of those ads now! :P
                if(config.getItem('HideAds', false)) {
                    $j('#rightCol').css('display', 'none');
                }

                if(config.getItem('HideFBChat', false)) {
                    tDiv = $j("div[class='fbDockWrapper fbDockWrapperRight bb']", caap.pageletPresenceDiv);
                    if($u.hasContent(tDiv)) {
                        tDiv.css('display', 'none');
                    } else {
                        caap.pageletPresenceDiv.bind("DOMNodeInserted", chatListener);
                    }
                }
            }

            if(caap.domain.which === 3) {
                if(config.getItem('HideAdsIframe', false)) {
                    //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                    //$j("div[style*='tool_top.jpg']").css('display', 'none');
                    $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', 'none');
                }
            }

            // Can create a blank space above the game to host the dashboard if wanted.
            // Dashboard currently uses '185px'
            if(caap.domain.which === 2) {
                var shiftDown = gm ? gm.getItem('ShiftDown', '', hiddenVar) : '';
                if($u.hasContent(shiftDown)) {
                    $j(caap.controlXY.selector).css('padding-top', shiftDown);
                }
            }

            if(caap.domain.which === 0 || caap.domain.which === 2) {
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
                var chelper = new $u.CommunicationHelper('test_div', true, function(data) {
                    con.log(1, "fired", chelper, data);
                });

                $u.injectScript("var CHelper=" + $u.CommunicationHelper.toString() + ";var chelper = new CHelper('test_div');chelper.send('test');", true);
                chelper = chelper.destroy();
                con.log(1, "destroyed", chelper);
                //alert($u.CommunicationHelper.toString());
            }

            if(caap.domain.which === 2 || caap.domain.which === 3) {
                caap.addDashboard();
                caap.addDashboardMin();
            }

            caap.addCaapAjax();
            caap.addListeners();

            if(caap.domain.which === 2 || caap.domain.which === 3) {
                caap.addDBListener();
                caap.checkResults();
                caap.autoStatCheck();
                caap.bestLand = new caap.landRecord().data;
                caap.sellLand = {};
                offline.bga.sort($u.sortBy(false, 'n'));
            }

            if(caap.domain.which === 0 && config.getItem('injectCATools', false)) {
                caap.injectCATools();
            }

            if(caap.domain.which === 3 && state.getItem('caapPause', 'none') === 'block') {
                caap.pauseListener();
            }

            return true;
        } catch (err) {
            con.error("ERROR in init: " + err);
            return false;
        }
    },
    oneMinuteUpdate : function(funcName) {
        try {
            if(!$u.isString(funcName) || funcName === '') {
                throw "Invalid identifying name!";
            }

            if(!state.getItem('reset' + funcName) && !schedule.check(funcName + 'Timer')) {
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
    timeStr : function(Short) {
        return config.getItem("use24hr", true) ? ( Short ? "D H:i" : "D d M H:i") : ( Short ? "D g:i A" : "D d M g:i A");
    },
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    displayTime : function(name) {
        try {
            if(!$u.isString(name) || name === '') {
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

    landQuestList : ['Land of Fire', 'Land of Earth', 'Land of Mist', 'Land of Water', 'Demon Realm', 'Undead Realm', 'Underworld', 'Kingdom of Heaven', 'Ivory City', 'Earth II', 'Water II', 'Mist II', 'Mist III', 'Fire II', 'Pangaea', 'Perdition', 'Land of Fire III', 'Land of Earth III', 'Land of Mist IV', 'Land of Water III'],

    demiQuestList : ['Ambrosia', 'Malekus', 'Corvintheus', 'Aurora', 'Azeron'],

    atlantisQuestList : ['Atlantis'],

    selectDropOption : function(idName, value) {
        try {
            if(caap.domain.which === 3) {
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
    newAutoQuest : function() {
        return JSON.copy({
            'name' : '',
            'energy' : 0,
            'general' : 'none',
            'expRatio' : 0
        });
    },
    updateAutoQuest : function(id, value) {
        try {
            if(!$u.isString(id) || !$u.hasContent(id)) {
                throw "No valid id supplied!";
            }

            if(!$u.hasContent(value)) {
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
    showAutoQuest : function() {
        try {
            caap.setDivContent("stopAutoQuest", "Stop auto quest: " + state.getItem('AutoQuest', caap.newAutoQuest())['name'] + " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")", caap.caapDivObject, false);
            return true;
        } catch (err) {
            con.error("ERROR in showAutoQuest: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    clearAutoQuest : function() {
        try {
            caap.setDivContent("stopAutoQuest", "", caap.caapDivObject, true);
            return true;
        } catch (err) {
            con.error("ERROR in clearAutoQuest: " + err);
            return false;
        }
    },
    manualAutoQuest : function(AutoQuest) {
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
    changeDropDownList : function(idName, dropList, option) {
        try {
            if(caap.domain.which === 3) {
                caap.messaging.changeDropDownList(idName, dropList, option);
            } else {
                $j("#caap_" + idName + " option", caap.caapDivObject).remove();
                $j("#caap_" + idName, caap.caapDivObject).append("<option disabled='disabled' value='not selected'>Choose one</option>");
                var item = 0, len = dropList.length, drop = $j("#caap_" + idName, caap.caapDivObject);

                for( item = 0; item < len; item += 1) {
                    if(item === 0 && !option) {
                        config.setItem(idName, dropList[item]);
                        con.log(1, "Saved: " + idName + "  Value: " + dropList[item]);
                    }

                    $j("#caap_" + idName, caap.caapDivObject).append("<option value='" + dropList[item].escapeHTML() + "'>" + dropList[item].escapeHTML() + "</option>");
                }

                if(option) {
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
    controlXY : {
        selector : '',
        x : 0,
        y : 0
    },

    getControlXY : function(reset, tools) {
        try {
            var selector = $j(caap.controlXY.selector), outer = selector.outerWidth(true), xoff = !tools && (caap.domain.which === 2 || (caap.domain.which === 0 && !config.getItem('backgroundCA', false))) ? outer + 10 : outer;

            return {
                y : reset ? selector.offset().top : caap.controlXY.y,
                x : caap.controlXY.x === '' || reset ? selector.offset().left + xoff : selector.offset().left + caap.controlXY.x
            };
        } catch (err) {
            con.error("ERROR in getControlXY: " + err);
            return {
                x : 0,
                y : 0
            };
        }
    },
    saveControlXY : function() {
        try {
            state.setItem('caap_div_menuTop', caap.caapDivObject.offset().top);
            state.setItem('caap_div_menuLeft', caap.caapDivObject.offset().left - $j(caap.controlXY.selector).offset().left);
            state.setItem('caap_top_zIndex', '1');
            state.setItem('caap_div_zIndex', '2');
        } catch (err) {
            con.error("ERROR in saveControlXY: " + err);
        }
    },
    dashboardXY : {
        selector : '',
        x : 0,
        y : 0
    },

    getDashboardXY : function(reset) {
        try {
            var selector = $j(caap.dashboardXY.selector);

            return {
                y : reset ? selector.offset().top - 10 : caap.dashboardXY.y,
                x : caap.dashboardXY.x === '' || reset ? selector.offset().left : selector.offset().left + caap.dashboardXY.x
            };
        } catch (err) {
            con.error("ERROR in getDashboardXY: " + err);
            return {
                x : 0,
                y : 0
            };
        }
    },
    saveDashboardXY : function() {
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
    messDivs : {
        'banner' : "",
        'activity_mess' : "",
        'idle_mess' : "",
        'quest_mess' : "",
        'battle_mess' : "",
        'monster_mess' : "",
        'guild_monster_mess' : "",
        //'arena_mess': "",
        'festival_mess' : "",
        'fortify_mess' : "",
        'heal_mess' : "",
        'demipoint_mess' : "",
        'gifting_mess' : "",
        'feats_mess' : "",
        'demibless_mess' : "",
        'conquestbless_mess' : "",
        'conquestcrystal1bless_mess' : "",
        'conquestcrystal2bless_mess' : "",
        'level_mess' : "",
        'exp_mess' : "",
        'debug1_mess' : "",
        'debug2_mess' : "",
        'control' : "",
        'donate' : ""
    },

    addControl : function(reload) {
        try {
            var caapDiv = "<div id='caap_div'>", divID, len = 0, styleXY = {
                x : 0,
                y : 0
            }, bgc = state.getItem('StyleBackgroundLight', '#E0C691'), htmlCode = '', banner = '', donate = '';

            for(divID in caap.messDivs) {
                if(caap.messDivs.hasOwnProperty(divID)) {
                    caapDiv += "<div class='caap_ww' id='caap_" + divID + "'></div>";
                }
            }
            caapDiv += "</div>";
            caap.controlXY.x = state.getItem('caap_div_menuLeft', '');
            caap.controlXY.y = state.getItem('caap_div_menuTop', $j(caap.controlXY.selector).offset().top);
            styleXY = caap.getControlXY();
            caapDiv = $j(caapDiv);
            caapDiv.css({
                width : '180px',
                background : bgc,
                opacity : state.getItem('StyleOpacityLight', 1),
                color : $u.bestTextColor(bgc),
                padding : "4px",
                border : "2px solid #444",
                top : styleXY.y + 'px',
                left : styleXY.x + 'px',
                zIndex : state.getItem('caap_div_zIndex', '2'),
                position : 'absolute'
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
            if(false) {
                htmlCode += festival.menu();
            } else {
                if(config.getItem("WhenFestival", "Never") !== "Never") {
                    config.setItem("WhenFestival", "Never");
                }
            }
            htmlCode += general.menu();
            htmlCode += caap.addSkillPointsMenu();
            htmlCode += army.menu();
            if(caap.domain.which === 0) {
                htmlCode += gifting.menu();
            } else {
                config.setItem("AutoGift", false);
                config.setItem("watchBeeper", false);
            }
            htmlCode += caap.addAutoOptionsMenu();
            htmlCode += caap.addFestivalOptionsMenu();
            htmlCode += caap.addConquestOptionsMenu();
            htmlCode += town.menu();
            htmlCode += caap.addOtherOptionsMenu();
            htmlCode += caap.addFooterMenu();
            caap.setDivContent('control', htmlCode, caapDiv);
            $j("input[type='button']", caapDiv).button();
            caap.makeSliderListener("CustStyleOpacityLight", 0.5, 1, 0.01, 1, true, caapDiv);
            caap.makeSliderListener("CustStyleOpacityDark", 0.5, 1, 0.01, 1, true, caapDiv);
            caap.makeSliderListener("scrollToPosition", 0, 1000, 10, 0, false, caapDiv);
            if(reload === true) {
                caap.caapDivObject.replaceWith(caapDiv);
                caap.caapDivObject = caapDiv;
                caap.pauseListener();
                caap.reBindCaapDiv();
            } else {
                if(document.getElementById('body'))
                    caap.caapDivObject = caapDiv.appendTo(document.getElementById('body'));
                else
                    caap.caapDivObject = caapDiv.appendTo(document.body);
            }

            caap.checkLastAction(state.getItem('LastAction', 'idle'));
            return true;
        } catch (err) {
            con.error("ERROR in addControl: " + err);
            return false;
        }
    },
    addCaapAjax : function() {
        try {
            caap.tempAjax = true ? $j("<div id='caap_ajax'></div>") : $j("<div id='caap_ajax'></div>").appendTo(document.body);
            return true;
        } catch (err) {
            con.error("ERROR in addCaapAjax: " + err);
            return false;
        }
    },
    ajax : function(page, params, cbError, cbSuccess) {
        try {
            if(caap.domain.which !== 2 && caap.domain.which !== 3) {
                throw "can not be called on this domain: " + caap.domain.which;
            }
            params = $u.hasContent(params) && $u.isPlainObject(params) && !$u.isEmptyObject(params) ? params : {};
            params["ajax"] = 1;
            var signedRequest = session.getItem("signedRequest");
            if($u.hasContent(signedRequest) && $u.isString(signedRequest)) {
                params["signed_request"] = signedRequest;
            }

            if(!$u.hasContent(page) || !$u.isString(page)) {
                page = "index.php";
                params["adkx"] = 2;
            }

            if(!$u.hasContent(cbError) || !$u.isFunction(cbError)) {
                cbError = function(XMLHttpRequest, textStatus, errorThrown) {
                    con.error("ajax: " + textStatus);
                };
            }

            if(!$u.hasContent(cbSuccess) || !$u.isFunction(cbSuccess)) {
                cbSuccess = function(data, textStatus, XMLHttpRequest) {
                    con.log(2, "ajax:", textStatus);
                };
            }

            $j.ajax({
                url : page,
                type : 'POST',
                data : params,
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    cbError(XMLHttpRequest, textStatus, errorThrown);
                },
                success : function(data, textStatus, XMLHttpRequest) {
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
    addPauseMenu : function() {
        try {
            return "<div id='caapPaused' style='font-weight: bold; display: " + state.getItem('caapPause', 'block') + "'>Paused on mouse click.<br /><a href='javascript:;' id='caapRestart' >Click here to restart</a></div><hr />";
        } catch (err) {
            con.error("ERROR in addPauseMenu: " + err);
            return '';
        }
    },
    addDisableMenu : function() {
        try {
            var autoRunInstructions = "Disable auto running of CAAP. Stays persistent even on page reload and the autoplayer will not autoplay.", htmlCode = '';
            htmlCode += caap.makeCheckTR("Disable Autoplayer", 'Disabled', false, autoRunInstructions);
            htmlCode += '<hr />';
            return htmlCode;
        } catch (err) {
            con.error("ERROR in addDisableMenu: " + err);
            return '';
        }
    },
    addCashHealthMenu : function() {
        try {
            var bankInstructions0 = "Minimum cash to keep in the bank. Press tab to save", bankInstructions1 = "Minimum cash to have on hand, press tab to save", bankInstructions2 = "Maximum cash to have on hand, bank anything above this, press tab to save (leave blank to disable).", healthInstructions = "Minimum health to have before healing, press tab to save (leave blank to disable).", healthStamInstructions = "Minimum Stamina to have before healing, press tab to save (leave blank to disable).", bankImmedInstructions = "Bank as soon as possible. May interrupt player and monster battles.", autobuyInstructions = "Automatically buy lands in groups of 10 based on best Return On Investment value.", autosellInstructions = "Automatically sell off any excess lands above your level allowance.", htmlCode = '';
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
    addQuestMenu : function() {
        try {
            var forceSubGen = "Always do a quest with the Subquest General you selected under the Generals section. NOTE: This will keep the script from automatically switching to the required general for experience of primary quests.", XQuestInstructions = "Start questing when energy is at or above this value.", XMinQuestInstructions = "Stop quest when energy is at or below this value.", questForList = ['Advancement', 'Max Influence', 'Max Gold', 'Max Experience', 'Manual'], questForListInstructions = ['Advancement performs all the main quests in a sub quest area but not the secondary quests.', 'Max Influence performs all the main and secondary quests in a sub quest area.', 'Max Gold performs the quest in the specific area that yields the highest gold.', 'Max Experience performs the quest in the specific area that yields the highest experience.', 'Manual performs the specific quest that you have chosen.'], questAreaList = ['Quest', 'Demi Quests', 'Atlantis'], questWhenList = ['Energy Available', 'At Max Energy', 'At X Energy', 'Not Fortifying', 'Never'], questWhenInst = ['Energy Available - will quest whenever you have enough energy.', 'At Max Energy - will quest when energy is at max and will burn down all energy when able to level up.', 'At X Energy - allows you to set maximum and minimum energy values to start and stop questing. Will burn down all energy when able to level up.', 'Not Fortifying - will quest only when your fortify settings are matched.', 'Never - disables questing.'], stopInstructions = "This will stop and remove the chosen quest and set questing to manual.", autoQuestName = state.getItem('AutoQuest', caap.newAutoQuest())['name'], htmlCode = '';
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
            htmlCode += caap.makeCheckTR("Perform Excavation Quests", 'ExcavateMines', false, 'If quest is for a mine, go ahead and excavate it.');
            htmlCode += caap.makeCheckTR("Quest For Orbs", 'GetOrbs', false, 'Perform the Boss quest in the selected land for orbs you do not have.');
            htmlCode += "<a id='caap_stopAutoQuest' style='display: " + ( autoQuestName ? "block" : "none") + "' href='javascript:;' title='" + stopInstructions + "'>";
            htmlCode += ( autoQuestName ? "Stop auto quest: " + autoQuestName + " (energy: " + state.getItem('AutoQuest', caap.newAutoQuest())['energy'] + ")" : '');
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

    addSkillPointsMenu : function() {
        try {
            var statusInstructions = "Automatically increase attributes when " + "upgrade skill points are available.", statusAdvInstructions = "USE WITH CAUTION: You can use numbers or " + "formulas(ie. level * 2 + 10). Variable keywords include energy, " + "health, stamina, attack, defense, and level. JS functions can be " + "used (Math.min, Math['max'], etc) !!!Remember your math class: " + "'level + 20' not equals 'level * 2 + 10'!!!", statImmedInstructions = "Update Stats Immediately", statSpendAllInstructions = "If selected then spend all possible points and do not save for stamina upgrade.", attrList = ['', 'Energy', 'Attack', 'Defense', 'Stamina', 'Health'], it = 0, htmlCode = '';
            htmlCode += caap.startToggle('Status', 'UPGRADE SKILL POINTS');
            htmlCode += caap.makeCheckTR("Auto Add Upgrade Points", 'AutoStat', false, statusInstructions);
            htmlCode += caap.startCheckHide('AutoStat');
            htmlCode += caap.makeCheckTR("Spend All Possible", 'StatSpendAll', false, statSpendAllInstructions);
            htmlCode += caap.makeCheckTR("Upgrade Immediately", 'StatImmed', false, statImmedInstructions);
            htmlCode += caap.makeCheckTR("Advanced Settings <a href='http://caaplayer.freeforums.org/help-for-upgrade-points-control-t418.html' target='_blank' style='color: blue'>(INFO)</a>", 'AutoStatAdv', false, statusAdvInstructions);
            htmlCode += caap.startCheckHide('AutoStatAdv', true);
            for( it = 0; it < 5; it += 1) {
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("Increase", false, false, "width: 27%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeDropDown('Attribute' + it, attrList, '', ''), false, false, "width: 40%; display: inline-block;");
                htmlCode += caap.makeTD("to", false, false, "text-align: center; width: 10%; display: inline-block;");
                htmlCode += caap.makeTD(caap.makeNumberForm('AttrValue' + it, statusInstructions, 0), false, true, "width: 20%; display: inline-block;");
                htmlCode += caap.endTR;
            }
            htmlCode += caap.endCheckHide('AutoStatAdv', true);
            htmlCode += caap.startCheckHide('AutoStatAdv');
            for( it = 5; it < 10; it += 1) {
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
    addAutoOptionsMenu : function() {
        try {
            // Other controls
            var autoAlchemyInstructions1 = "AutoAlchemy will combine all recipes " + "that do not have missing ingredients. By default, it will not " + "combine Battle Hearts recipes.", autoAlchemyInstructions2 = "If for some reason you do not want " + "to skip Battle Hearts", autoPotionsInstructions0 = "Enable or disable the auto consumption " + "of energy and stamina potions.", autoPotionsInstructions1 = "Number of stamina potions at which to " + "begin consuming.", autoPotionsInstructions2 = "Number of stamina potions to keep.", autoPotionsInstructions3 = "Number of energy potions at which to " + "begin consuming.", autoPotionsInstructions4 = "Number of energy potions to keep.", autoPotionsInstructions5 = "Do not consume potions if the " + "experience points to the next level are within this value.", autoBlessList = ['None', 'Auto Upgrade','Energy', 'Attack', 'Defense', 'Health', 'Stamina'], autoBlessListInstructions = ['None disables the auto bless feature.', 'Auto Upgrade bless feature according to auto upgrade skill setting.', 'Energy performs an automatic daily blessing with Ambrosia.', 'Attack performs an automatic daily blessing with Malekus.', 'Defense performs an automatic daily blessing with Corvintheus.', 'Health performs an automatic daily blessing with Aurora.', 'Stamina performs an automatic daily blessing with Azeron.'], htmlCode = '';
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
    addFestivalOptionsMenu : function() {
        try {
            // Other controls
            var festivalBlessList = ['None', 'Energy', 'Attack', 'Defense', 'Health', 'Stamina', 'Army','All'], htmlCode = '';
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
    addConquestOptionsMenu : function() {
        try {
            // Other controls
            var festivalBlessList = ['None', 'Energy', 'Attack', 'Defense', 'Health', 'Stamina', 'Army','All'], htmlCode = '';
            htmlCode += caap.startToggle('ConquestOptions', 'CONQUEST OPTIONS');
            htmlCode += caap.makeCheckTR('Enable Conquest Collect', 'doConquestCollect', false, '');
            htmlCode += caap.makeTD("<input type='button' id='caap_CollectConquestNow' value='Collect Now' style='padding: 0; font-size: 10px; height: 18px' />");
            htmlCode += caap.makeCheckTR('Enable Hero Crystal Collect on Land 1', 'doConquestCrystalCollect1', false, '');
            htmlCode += caap.makeTD("<input type='button' id='caap_collectConquestCrystal1Now' value='Collect Now' style='padding: 0; font-size: 10px; height: 18px' />");
            htmlCode += caap.makeCheckTR('Enable Hero Crystal Collect on Land 2', 'doConquestCrystalCollect2', false, '');
            htmlCode += caap.makeTD("<input type='button' id='caap_collectConquestCrystal2Now' value='Collect Now' style='padding: 0; font-size: 10px; height: 18px' />");
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in addConquestOptionsMenu: " + err);
            return '';
        }
    },
    addOtherOptionsMenu : function() {
        try {
            // Other controls
            var timeInstructions = "Use 24 hour format for displayed times.", titleInstructions0 = "Set the title bar.", titleInstructions1 = "Add the current action.", titleInstructions2 = "Add the player name.", hideAdsInstructions = "Hides the sidebar adverts.", hideAdsIframeInstructions = "Hide the FaceBook Iframe adverts", hideFBChatInstructions = "Hide the FaceBook Chat", newsSummaryInstructions = "Enable or disable the news summary on the index page.", bannerInstructions = "Uncheck if you wish to hide the CAAP banner.", donateInstructions = "Uncheck if you wish to hide the CAAP donate button.", itemTitlesInstructions = "Replaces the CA item titles with more useful tooltips.", goblinHintingInstructions = "When in the Goblin Emporium, CAAP will try to hide items that you require and fade those that may be required.", ingredientsHideInstructions = "Hide the ingredients list on the Alchemy pages.", alchemyShrinkInstructions = "Reduces the size of the item images and shrinks the recipe layout on the Alchemy pages.", keepShrinkInstructions = "Reduces the size of the item images on the Keep pages.", recipeCleanInstructions = "CAAP will try to hide recipes that are no longer required on the Alchemy page and therefore shrink the list further.", recipeCleanCountInstructions = "The number of items to be owned before cleaning the recipe item from the Alchemy page.", bookmarkModeInstructions = "Enable this if you are running CAAP from a bookmark. Disables refreshes and gifting. Note: not recommended for long term operation.", levelupModeInstructions = "Calculates approx. how many XP points you will get from your current stamina and energy and when you have enough of each to level up it will start using them down to 0.", serializeInstructions = "Setting this value allows you to define your Raids and Monsters all within either the Monster Attack Order or Raid Attack Order list boxes. Selection is serialized so that you only have a single selection from the list active at one time.  This is in contrast to the default mode, where you can have an active Raid and an active Monster, both processing independently.", styleList = ['CA Skin', 'Original', 'Custom', 'None'], htmlCode = '';
            htmlCode += caap.startToggle('Other', 'OTHER OPTIONS');
            if(caap.domain.which === 0) {
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
            if(caap.domain.which === 0) {
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
            if(caap.domain.which === 0) {
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

            if(db && db.available) {
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
    addFooterMenu : function() {
        try {
            var htmlCode = '';
            htmlCode += caap.startTR();
            htmlCode += caap.makeTD("Unlock Menu <input type='button' id='caap_ResetMenuLocation' value='Reset' style='padding: 0; font-size: 10px; height: 18px' />", false, false, "width: 90%; display: inline-block;");
            htmlCode += caap.makeTD("<input type='checkbox' id='unlockMenu' />", false, true, "width: 10%; display: inline-block;");
            htmlCode += caap.endTR;

            if(devVersion === '0') {
                htmlCode += caap.makeTD("Version: " + caapVersion + " - <a href='http://caaplayer.freeforums.org/' target='_blank'>CAAP Forum</a>");
                if(caap.newVersionAvailable) {
                    htmlCode += caap.makeTD("<a href='http://castle-age-auto-player.googlecode.com/files/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + "!</a>");
                }
            } else {
                htmlCode += caap.makeTD("Version: " + caapVersion + " d" + devVersion + " - <a href='http://caaplayer.freeforums.org/' target='_blank'>CAAP Forum</a>");
                if(caap.newVersionAvailable) {
                    htmlCode += caap.makeTD("<a href='http://castle-age-auto-player.googlecode.com/svn/trunk/Castle-Age-Autoplayer.user.js'>Install new CAAP version: " + state.getItem('SUC_remote_version') + " d" + state.getItem('DEV_remote_version') + "!</a>");
                }
            }

            return htmlCode;
        } catch (err) {
            con.error("ERROR in addFooterMenu: " + err);
            return '';
        }
    },
    addDashboard : function() {
        try {
            /*-------------------------------------------------------------------------------------\
             Here is where we construct the HTML for our dashboard. We start by building the outer
             container and position it within the main container.
             \-------------------------------------------------------------------------------------*/
            var layout = "<div id='caap_top'>", displayList = [
            /*'Arena',*/'Army', 'Battle Stats', 'Feed', 'Festival', 'Generals Stats', 'Gift Queue', 'Gifting Stats', 'Guild Monster', 'Item Stats', 'Magic Stats', 'Monster', 'Soldiers Stats', 'Target List', 'User Stats'], displayInst = [
            /*'Display the Arena battle in progress.',*/'Display your army members, the last time they leveled up and choose priority Elite Guard.', 'Display your Battle history statistics, who you fought and if you won or lost.', 'Display the monsters that have been seen in your Live Feed and/or Guild Feed that are still valid.', 'Display the Festival battle in progress.', 'Display information about your Generals.', 'Display your current Gift Queue', 'Display your Gifting history, how many gifts you have received and returned to a user.', 'Guild Monster', 'Display information about Items seen in your Black Smith page.', 'Display information about Magic seen in your Magic page.', 'Display your Monster battles.', 'Display information about Soldiers seen in your Soldiers page.', 'Display information about Targets that you have performed reconnaissance on.', 'Useful informaton about your account and character statistics.'], styleXY = {
                x : 0,
                y : 0
            }, bgc = state.getItem("StyleBackgroundLight", "#E0C961");

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
                background : bgc,
                color : $u.bestTextColor(bgc),
                padding : "5px",
                height : "185px",
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
            return true;
        } catch (err) {
            con.error("ERROR in addDashboard: " + err);
            return false;
        }
    },
    addDashboardMin : function() {
        try {
            /*-------------------------------------------------------------------------------------\
             Here is where we construct the HTML for our dashboard. We start by building the outer
             container and position it within the main container.
             \-------------------------------------------------------------------------------------*/
            var layout = "<div id='caap_topmin'>", styleXY = {
                x : 0,
                y : 0
            }, bgc = state.getItem("StyleBackgroundLight", "#E0C961");

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
            con.error("ERROR in addDashboardMin: " + err);
            return false;
        }
    },
    addPlayButton : function() {
        try {
            /*-------------------------------------------------------------------------------------\
             Here is where we construct the HTML for our dashboard. We start by building the outer
             container and position it within the main container.
             \-------------------------------------------------------------------------------------*/
            var layout = "<div id='caap_playbuttondiv'>", bgc = state.getItem('StyleBackgroundDark', '#B09060');

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
                background : bgc,
                color : $u.bestTextColor(bgc),
                padding : "5px",
                height : "6px",
                width : "6px",
                margin : "0 auto",
                opacity : state.getItem('StyleOpacityDark', 1),
                top : '0px',
                left : '0px',
                zIndex : '99',
                position : 'fixed',
                display : state.getItem('caapPause', 'none')
            }).appendTo(document.body);

            caap.caapPlayButtonDiv = $j('#caap_playbuttondiv');
            return true;
        } catch (err) {
            con.error("ERROR in addPlayButton: " + err);
            return false;
        }
    },
    /////////////////////////////////////////////////////////////////////
    //                          EVENT LISTENERS
    // Watch for changes and update the controls
    /////////////////////////////////////////////////////////////////////

    setDisplay : function(area, idName, display, quiet) {
        try {
            if(!$u.hasContent(idName) || (!$u.isString(idName) && !$u.isNumber(idName))) {
                con.warn("idName", idName);
                throw "Bad idName!";
            }

            var areaDiv = caap[area], areatest = area;
            if(!$u.hasContent(areaDiv)) {
                aeatest = "default";
                areaDiv = $j(document.body);
                con.warn("Unknown area. Using document.body", area);
            }
            con.log(2, "Change: display of 'caap_" + idName + "' to '" + (display === true ? 'block' : 'none') + "'", areatest);
            areaDiv = $j('#caap_' + idName, areaDiv).css('display', display === true ? 'block' : 'none');
            if(!$u.hasContent(areaDiv) && !quiet) {
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
    checkBoxListener : function(e) {
        try {
            var idName = e.target.id.stripCaap(), DocumentTitle = '', d = '', styleXY = {};

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
                    if(caap.domain.which === 0) {
                        if(e.target.checked) {
                            $j("body").css({
                                'background-image' : "url('http://image4.castleagegame.com/graphics/guild_webpage_bg.jpg')",
                                'background-position' : 'center top',
                                'background-repeat' : 'no-repeat',
                                'background-color' : 'black',
                                'margin' : '0px'
                            });

                            $j("#contentCol").css({
                                'background-color' : 'black'
                            });

                            $j("#contentArea").css({
                                'background-image' : "url('http://image4.castleagegame.com/graphics/ws_middle.jpg')",
                                'padding' : '0px 10px'
                            });

                            $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                                'display' : 'none'
                            });

                            $j("#contentCol").removeClass("clearfix");
                        } else {
                            $j("body").css({
                                'background-image' : '',
                                'background-position' : '',
                                'background-repeat' : '',
                                'background-color' : '',
                                'margin' : ''
                            });

                            $j("#contentCol").css({
                                'background-color' : 'white'
                            });

                            $j("#contentArea").css({
                                'background-image' : '',
                                'padding' : ''
                            });

                            $j("#leftColContainer,#pagelet_canvas_footer_content,#bottomContent").css({
                                'display' : 'block'
                            });

                            $j("#contentCol").addClass("clearfix");
                        }
                    }

                    if(caap.domain.which === 0 || caap.domain.which === 2) {
                        styleXY = caap.getControlXY(true);
                        caap.caapDivObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    if(caap.domain.which === 2 || caap.domain.which === 3) {
                        styleXY = caap.getDashboardXY(true);
                        caap.caapTopObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        caap.caapTopMinObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    break;
                case "filterGeneral" :
                    if(caap.domain.which === 0 || caap.domain.which === 2) {
                        general.UpdateDropDowns();
                    }

                    break;
                case "injectCATools" :
                    if(caap.domain.which === 0) {
                        if(e.target.checked) {
                            caap.injectCATools();
                        } else {
                            caap.reloadCastleAge(true);
                        }
                    }

                    break;
                case "HideAds" :
                    if(caap.domain.which === 0) {
                        con.log(9, "HideAds");
                        $j('#rightCol').css('display', e.target.checked ? 'none' : 'block');
                    }

                    break;
                case "HideAdsIframe" :
                    if(caap.domain.which === 3) {
                        con.log(9, "HideAdsIframe");
                        //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', e.target.checked ? 'none' : 'block');
                        //$j("div[style*='tool_top.jpg']").css('display', e.target.checked ? 'none' : 'block');
                        $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', e.target.checked ? 'none' : 'block');
                        caap.dashboardXY.x = state.getItem('caap_top_menuLeft', '');
                        caap.dashboardXY.y = state.getItem('caap_top_menuTop', $j(caap.dashboardXY.selector).offset().top - 10);
                        styleXY = caap.getDashboardXY();
                        caap.caapTopObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        caap.caapTopMinObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                    }

                    break;
                case "HideFBChat" :
                    if(caap.domain.which === 0) {
                        con.log(9, "HideFBChat");
                        $j("div[class='fbDockWrapper fbDockWrapperRight bb']", caap.pageletPresenceDiv).css('display', e.target.checked ? 'none' : 'block');
                    }

                    break;
                case "IgnoreBattleLoss" :
                    con.log(9, "IgnoreBattleLoss");
                    if(e.target.checked) {
                        con.log(1, "Ignore Battle Losses has been enabled.");
                    }

                    break;
                case "SetTitle" :
                case "SetTitleAction" :
                case "SetTitleName" :
                    if(caap.domain.which === 0 || caap.domain.which === 2) {
                        con.log(9, idName);
                        if(e.target.checked) {
                            if(config.getItem('SetTitleAction', false)) {
                                d = $j('#caap_activity_mess', caap.caapDivObject).html();
                                if(d) {
                                    DocumentTitle += d.replace("Activity: ", '') + " - ";
                                }
                            }

                            if(config.getItem('SetTitleName', false)) {
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
                    if(e.target.checked) {
                        if(caap.domain.which === 0 || caap.domain.which === 2) {
                            $j(":input[id^='caap_']", caap.caapDivObject).attr({
                                disabled : true
                            });
                            caap.caapDivObject.css('cursor', 'move').draggable({
                                stop : function() {
                                    caap.saveControlXY();
                                }
                            });
                        }

                        if(caap.domain.which === 2 || caap.domain.which === 3) {
                            $j(":input[id^='caap_']", caap.caapTopObject).attr({
                                disabled : true
                            });
                            caap.caapTopObject.css('cursor', 'move').draggable({
                                stop : function() {
                                    caap.saveDashboardXY();
                                    styleXY = caap.getDashboardXY();
                                    caap.caapTopMinObject.css({
                                        top : styleXY.y + 'px',
                                        left : styleXY.x + 'px'
                                    });
                                }
                            });
                        }

                    } else {
                        if(caap.domain.which === 0 || caap.domain.which === 2) {
                            caap.caapDivObject.css('cursor', '').draggable("destroy");
                            $j(":input[id^='caap_']", caap.caapDivObject).attr({
                                disabled : false
                            });
                        }

                        if(caap.domain.which === 2 || caap.domain.which === 3) {
                            caap.caapTopObject.css('cursor', '').draggable("destroy");
                            $j(":input[id^='caap_']", caap.caapTopObject).attr({
                                disabled : false
                            });
                        }
                    }

                    break;
                case "AutoElite" :
                    con.log(9, "AutoElite");
                    schedule.setItem('AutoEliteGetList', 0);
                    schedule.setItem('AutoEliteReqNext', 0);
                    state.setItem('AutoEliteEnd', '');
                    state.setItem("MyEliteTodo", []);
                    if(caap.domain.which === 2 && e.target.checked) {
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
                    if(e.target.checked) {
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

    colorDiv : {},

    colorUpdate : function() {
        try {
            var color = state.getItem('caapPause', 'none') === 'none' ? state.getItem('StyleBackgroundLight', 1) : state.getItem('StyleBackgroundDark', 1), bgo = state.getItem('caapPause', 'none') === 'none' ? state.getItem('StyleOpacityLight', 1) : state.getItem('StyleOpacityDark', 1), btc = $u.bestTextColor(color), chk1, chk2;

            if(caap.domain.which === 0 || caap.domain.which === 2) {
                chk1 = caap.caapDivObject.css('background-color'), chk2 = caap.caapDivObject.css('color');
            } else if(caap.domain.which === 3) {
                chk1 = caap.caapTopObject.css('background-color'), chk2 = caap.caapTopObject.css('color');
            }

            if($u.hex2rgb(color).color !== chk1) {
                con.log(4, "Update background color", color, chk1);
                if(caap.domain.which === 0 || caap.domain.which === 2) {
                    caap.caapDivObject.css({
                        'background' : color,
                        'opacity' : bgo,
                        'color' : btc
                    });

                    caap.caapPlayButtonDiv.css({
                        'background' : color,
                        'opacity' : bgo,
                        'color' : btc
                    });
                }

                if(caap.domain.which === 2 || caap.domain.which === 3) {
                    caap.caapTopObject.css({
                        'background' : color,
                        'opacity' : bgo,
                        'color' : btc
                    });

                    caap.caapTopMinObject.css({
                        'background' : color,
                        'opacity' : bgo,
                        'color' : btc
                    });
                }

                if($u.hex2rgb(btc).color !== chk2) {
                    con.log(4, "Update text color", btc, chk2);
                    if(caap.domain.which === 2 || caap.domain.which === 3) {
                        $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({
                            'color' : btc
                        });
                    }
                }
            }

            if(caap.domain.which === 0) {
                caap.messaging.styleChange();
            }

            return true;
        } catch (err) {
            con.error("ERROR in colorUpdate: " + err);
            return false;
        }
    },
    colorBoxClickListener : function(e) {
        try {
            var id = e.target.id.stripCaap(), t = $j(e.target);

            function fb1call(color) {
                state.setItem("StyleBackgroundLight", color);
                caap.colorUpdate();
            }

            function fb2call(color) {
                state.setItem("StyleBackgroundDark", color);
                caap.colorUpdate();
            }

            function d1call(el_id, color) {
                var s = el_id.stripCaap(), v = $u.addSharp(color).toUpperCase(), c = '';

                if(color !== 'close') {
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
                        color : $u.bestTextColor(e.target.value)
                    });
                }
                delete caap.colorDiv[el_id];
            }

            if(!$u.hasContent(caap.colorDiv[e.target.id])) {
                switch (id) {
                    case "CustStyleBackgroundLight" :
                        caap.colorDiv[e.target.id] = t.colorInput(fb1call, d1call).concat(t);
                        break;
                    case "CustStyleBackgroundDark" :
                        caap.colorDiv[e.target.id] = t.colorInput(fb2call, d1call).concat(t);
                        break;
                    default :
                        caap.colorDiv[e.target.id] = t.colorInput(function() {
                        }, d1call).concat(t);
                }

                caap.colorDiv[e.target.id][1].css({
                    background : e.target.value,
                    color : $u.bestTextColor(e.target.value),
                    padding : "5px",
                    border : "2px solid #000000"
                });
            }

            return true;
        } catch (err) {
            con.error("ERROR in colorBoxClickListener: " + err);
            return false;
        }
    },
    colorBoxChangeListener : function(e) {
        try {
            e.target.value = $u.addSharp(e.target.value).toUpperCase();
            caap.colorBoxListener(e);
            return true;
        } catch (err) {
            con.error("ERROR in colorBoxChangeListener: " + err);
            return false;
        }
    },
    colorBoxListener : function(e) {
        try {
            var id = e.target.id.stripCaap(), val = $u.addSharp(e.target.value).toUpperCase(), c = new $u.ColorConv();

            e.target.style.backgroundColor = val;
            c.setRgb(e.target.style.backgroundColor);
            e.target.style.color = $u.bestTextColor(c.getHex());
            con.log(1, 'Change: setting "' + id + '" to ', val);
            config.setItem(id, val);
            if($u.hasContent(caap.colorDiv[e.target.id])) {
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
    textBoxListener : function(e) {
        try {
            var idName = e.target.id.stripCaap();
            con.log(1, 'Change: setting "' + idName + '" to ', String(e.target.value));
            if(/AttrValue+/.test(idName)) {
                state.setItem("statsMatch", true);
            }

            config.setItem(idName, String(e.target.value));
            return true;
        } catch (err) {
            con.error("ERROR in textBoxListener: " + err);
            return false;
        }
    },
    numberBoxListener : function(e) {
        try {
            var idName = e.target.id.stripCaap(), number = null, message = '';

            if($u.isNaN(e.target.value) && e.target.value !== '') {
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
            if(/AttrValue+/.test(idName)) {
                state.setItem("statsMatch", true);
            } else if(/MaxToFortify/.test(idName)) {
                monster.flagFullReview();
            } else if(/Chain/.test(idName)) {
                state.getItem('BattleChainId', 0);
            } else if(idName === 'DebugLevel') {
                con.log_level = e.target.value.parseInt();
            } else if(idName === "IgnoreMinionsBelow") {
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
    dropBoxListener : function(e) {
        try {
            if(e.target.selectedIndex > 0) {
                var idName = e.target.id.stripCaap(), value = e.target.options[e.target.selectedIndex].value, title = e.target.options[e.target.selectedIndex].title;

                con.log(1, 'Change: setting "' + idName + '" to "' + value + '" with title "' + title + '"');
                config.setItem(idName, value);
                e.target.title = title;
                if(idName.hasIndexOf('When')) {
                    caap.setDisplay("caapDivObject", idName + '_hide', value !== 'Never');
                    if(!idName.hasIndexOf('Quest')) {
                        //if (!idName.hasIndexOf('Arena')) {
                        if(!idName.hasIndexOf('Festival')) {
                            caap.setDisplay("caapDivObject", idName + 'XStamina_hide', value === 'At X Stamina');
                            caap.setDisplay("caapDivObject", idName + 'DelayStayHidden_hide', value === 'Stay Hidden', false);
                        }

                        caap.setDisplay("caapDivObject", 'WhenBattleStayHidden_hide', ((config.getItem('WhenBattle', 'Never') === 'Stay Hidden' && config.getItem('WhenMonster', 'Never') !== 'Stay Hidden')));
                        caap.setDisplay("caapDivObject", 'WhenMonsterStayHidden_hide', ((config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden')));
                        caap.setDisplay("caapDivObject", 'DemiPointsFirst_hide', (config.getItem('WhenBattle', 'Never') === 'Demi Points Only'));
                        switch (idName) {
                            case 'WhenBattle':
                                if(value === 'Never') {
                                    caap.setDivContent('battle_mess', 'Battle off');
                                } else {
                                    caap.setDivContent('battle_mess', '');
                                }

                                break;
                            case 'WhenMonster':
                                if(value === 'Never') {
                                    caap.setDivContent('monster_mess', 'Monster off');
                                } else {
                                    caap.setDivContent('monster_mess', '');
                                }

                                break;
                            case 'WhenGuildMonster':
                                if(value === 'Never') {
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
                                if(value === 'Never') {
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
                } else if(idName === 'QuestArea' || idName === 'QuestSubArea' || idName === 'WhyQuest') {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                    caap.clearAutoQuest();
                    if(idName === 'QuestArea') {
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
                } else if(idName === 'BattleType') {
                    state.getItem('BattleChainId', 0);
                } else if(idName === 'AutoBless' && value === 'None') {
                    schedule.setItem('BlessingTimer', 0);
                } else if(idName === 'doConquestCollect' && value === 'None') {
                    schedule.setItem('collectConquestTimer', 0);
                } else if(idName === 'doConquestCrystalCollect1' && value === 'None') {
                    schedule.setItem('collectConquestCrystal1Timer', 0);
                } else if(idName === 'doConquestCrystalCollect2' && value === 'None') {
                    schedule.setItem('collectConquestCrystal2Timer', 0);
                } else if(idName === 'festivalBless' && value === 'None') {
                    schedule.setItem('festivalBlessTimer', 0);
                } else if(idName === 'TargetType') {
                    state.getItem('BattleChainId', 0);
                    //caap.setDisplay("caapDivObject", 'TargetTypeFreshmeat_hide', value === "Freshmeat");
                    caap.setDisplay("caapDivObject", 'TargetTypeUserId_hide', value === "Userid List");
                    caap.setDisplay("caapDivObject", 'TargetTypeRaid_hide', value === "Raid");
                } else if(idName === 'LevelUpGeneral') {
                    caap.setDisplay("caapDivObject", idName + '_hide', value !== 'Use Current');
                } else if(/Attribute?/.test(idName)) {
                    state.setItem("statsMatch", true);
                    /*} else if (idName === 'chainArena') {
                     caap.setDisplay("caapDivObject", idName + '_hide', value !== '0');*/
                } else if(idName === 'chainFestival') {
                    caap.setDisplay("caapDivObject", idName + '_hide', value !== '0');
                } else if(idName === 'DisplayStyle') {
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
    textAreaListener : function(e) {
        try {
            var idName = e.target.id.stripCaap(), value = e.target.value;

            function commas() {
                // Change the boolean from false to true to enable BoJangles patch or
                // set the hidden variable in localStorage
                if(config.getItem("TextAreaCommas", false)) {
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
    pauseListener : function(e) {
        caap.messaging.pauseListener();
        var bgc = state.getItem('StyleBackgroundDark', '#B09060'), bgo = state.getItem('StyleOpacityDark', 1), btc = $u.bestTextColor(bgc), chk = $u.bestTextColor(state.getItem('StyleBackgroundLight', '#E0C691'));

        if(caap.domain.which !== 3) {
            caap.caapDivObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo,
                'z-index' : '3'
            });
        }

        if(caap.domain.which !== 0) {
            caap.caapTopObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo
            });

            caap.caapTopMinObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo
            });

            if(btc !== chk) {
                $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({
                    'color' : btc
                });
            }
        }

        if(caap.domain.which !== 3) {
            $j('#caapPaused', caap.caapDivObject).css('display', 'block');
            caap.caapPlayButtonDiv.css('display', 'block');
        }

        state.setItem('caapPause', 'block');
        session.setItem('ReleaseControl', true);
    },
    restartListener : function(e) {
        caap.messaging.restartListener();
        var bgc = state.getItem('StyleBackgroundLight', '#E0C691'), bgo = state.getItem('StyleOpacityLight', 1), btc = $u.bestTextColor(bgc), chk = $u.bestTextColor(state.getItem('StyleBackgroundDark', '#B09060'));

        if(caap.domain.which !== 3) {
            $j('#caapPaused', caap.caapDivObject).css('display', 'none');
            caap.caapPlayButtonDiv.css('display', 'none');
            caap.caapDivObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo,
                'z-index' : state.getItem('caap_div_zIndex', '2'),
                'cursor' : ''
            });
        }

        if(caap.domain.which !== 0) {
            caap.caapTopObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo,
                'z-index' : state.getItem('caap_top_zIndex', '1'),
                'cursor' : ''
            });

            caap.caapTopMinObject.css({
                'background' : bgc,
                'color' : btc,
                'opacity' : bgo,
                'z-index' : state.getItem('caap_top_zIndex', '1'),
                'cursor' : ''
            });

            if(btc !== chk) {
                $j("th[data-type='bestcolor'],td[data-type='bestcolor']", caap.caapTopObject).css({
                    'color' : btc
                });
            }
        }

        if(caap.domain.which !== 3) {
            $j('#unlockMenu', caap.caapDivObject).attr('checked', false);
        }

        state.setItem('caapPause', 'none');
        session.setItem('ReleaseControl', true);
        session.setItem('resetselectMonster', true);
        session.setItem('resetselectGuildMonster', true);
        caap.clearDomWaiting();
    },
    resetMenuLocationListener : function(e) {
        var caap_divXY = {}, caap_topXY = {};

        state.deleteItem('caap_div_menuLeft');
        state.deleteItem('caap_div_menuTop');
        state.deleteItem('caap_div_zIndex');
        if(caap.domain.which !== 3) {
            caap.controlXY.x = '';
            caap.controlXY.y = $j(caap.controlXY.selector).offset().top;
            caap_divXY = caap.getControlXY(true);
            caap.caapDivObject.css({
                'cursor' : '',
                'z-index' : '2',
                'top' : caap_divXY.y + 'px',
                'left' : caap_divXY.x + 'px'
            });

            $j(":input[id^='caap_']", caap.caapDivObject).attr({
                disabled : false
            });
        }

        state.deleteItem('caap_top_menuLeft');
        state.deleteItem('caap_top_menuTop');
        state.deleteItem('caap_top_zIndex');
        if(caap.domain.which !== 0) {
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

            $j(":input[id^='caap_']", caap.caapTopObject).attr({
                disabled : false
            });
        }
    },
    foldingBlockListener : function(e) {
        try {
            var subId = e.target.id.replace(/_Switch/i, ''), subDiv = document.getElementById(subId);

            if(subDiv.style.display === "block") {
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
    whatClickedURLListener : function(event) {
        try {
            var obj = event.target;
            while(obj && !obj.href) {
                obj = obj.parentNode;
            }

            if(obj && obj.href) {
                caap.setDomWaiting(obj.href);
            } else {
                if(obj && !obj.href) {
                    con.warn('whatClickedURLListener globalContainer no href', obj);
                }
            }
        } catch (err) {
            con.error("ERROR in whatClickedURLListener: " + err, event);
        }
    },
    whatFriendBox : function(event) {
        try {
            var obj = event.target, userID = 0;

            while(obj && !obj.id) {
                obj = obj.parentNode;
            }

            if(obj && obj.id && obj.onclick) {
                userID = obj.onclick.toString().regex(/friendKeepBrowse\('(\d+)'/);
                caap.setDomWaiting("keep.php" + ($u.isNumber(userID) && userID > 0 ? "?casuser=" + userID : ''));
            }
        } catch (err) {
            con.error("ERROR in whatFriendBox: " + err, event);
        }
    },
    guildMonsterEngageListener : function(event) {
        con.log(4, "engage guild_battle_monster.php");
        caap.setDomWaiting("guild_battle_monster.php");
    },
    windowResizeListener : function(e) {
        var caap_topXY;
        if(caap.domain.which === 0 || caap.domain.which === 2) {
            caap.caapDivObject.css('left', caap.getControlXY().x + 'px');
        }

        if(caap.domain.which === 2 || caap.domain.which === 3) {
            caap_topXY = caap.getDashboardXY();
            caap.caapTopObject.css('left', caap_topXY.x + 'px');
            caap.caapTopMinObject.css('left', caap_topXY.x + 'px');
        }
    },
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    goldTimeListener : function(e) {
        var tArr = $u.setContent($u.setContent($j(e.target).text(), '').regex(/(\d+):(\d+)/), []);
        if(!$u.hasContent(tArr) || tArr.length !== 2) {
            return;
        }

        caap.stats['gold']['ticker'] = tArr;
        if(tArr[1] === 0 || con.log_level >= 4) {
            con.log(3, "goldTimeListener", tArr[0] + ":" + tArr[1].lpad("0", 2));
        }
    },
    energyListener : function(e) {
        var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
        if(num < 0 || $u.isNaN(num)) {
            return;
        }

        caap.stats['energy'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energy']['max']), caap.stats['energy']);
        caap.stats['energyT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['energyT']['max']), caap.stats['energy']);
        con.log(3, "energyListener", num);
    },
    healthListener : function(e) {
        var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
        if(num < 0 || $u.isNaN(num)) {
            return;
        }

        caap.stats['health'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['health']['max']), caap.stats['health']);
        caap.stats['healthT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['healthT']['max']), caap.stats['healthT']);
        con.log(3, "healthListener", num);
    },
    staminaListener : function(e) {
        var num = $u.setContent($u.setContent($j(e.target).text(), '').parseInt(), -1);
        if(num < 0 || $u.isNaN(num)) {
            return;
        }

        caap.stats['stamina'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['stamina']['max']), caap.stats['stamina']);
        caap.stats['staminaT'] = $u.setContent(caap.getStatusNumbers(num + "/" + caap.stats['staminaT']['max']), caap.stats['staminaT']);
        con.log(3, "staminaListener", num);
    },
    /*jslint sub: false */

    caTools : false,

    reBind : function() {
        try {
            $j('a', caap.globalContainer).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
            $j("div[id*='friend_box_']", caap.globalContainer).unbind('click', caap.whatFriendBox).bind('click', caap.whatFriendBox);
            if($u.mutationTypes['DOMSubtreeModified']) {
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
    reBindCaapDiv : function() {
        try {
            if(!$u.hasContent(caap.caapDivObject)) {
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
            $j('#caap_ImportData', caap.caapDivObject).click(function() {
                caap.importDialog($u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config'));
            });

            $j('#caap_ExportData', caap.caapDivObject).click(function() {
                var val = $u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config');
                caap.exportDialog(caap.exportTable[val]['export'](), val);
            });

            $j('#caap_DeleteData', caap.caapDivObject).click(function() {
                caap.deleteDialog($u.setContent($j('#caap_DataSelect', caap.caapDivObject).val(), 'Config'));
            });

            $j('#caap_BackupConfig', caap.caapDivObject).click(function() {
                profiles.getBackupKeys(caap.profilesDialog);
            });

            $j('#caap_BackupCurrent', caap.caapDivObject).click(function() {
                profiles.backupCurrent();
            });

            $j('#caap_RestoreCurrent', caap.caapDivObject).click(function() {
                profiles.restoreCurrent();
            });

            $j('#caap_TownItemReport', caap.caapDivObject).click(town.report);
            $j('#caap_ActionList', caap.caapDivObject).click(caap.actionDialog);
            $j('#caap_FillArmy', caap.caapDivObject).click(function(e) {
                state.setItem("FillArmy", true);
                state.setItem("ArmyCount", 0);
                state.setItem('FillArmyList', []);
                caap.getArmyButtonListener();
            });
            $j('#caap_CollectConquestNow', caap.caapDivObject).click(function(e) {
                caap.getCollectConquestButtonListener();
            });
            $j('#caap_CollectConquestCrystal1Now', caap.caapDivObject).click(function(e) {
                caap.getCollectConquestCrystal1ButtonListener();
            });
            $j('#caap_CollectConquestCrystal2Now', caap.caapDivObject).click(function(e) {
                caap.getCollectConquestCrystal2ButtonListener();
            });
            $j('#caap_ResetMenuLocation', caap.caapDivObject).click(caap.resetMenuLocationListener);
            $j('#caap_resetElite', caap.caapDivObject).click(function(e) {
                schedule.setItem('AutoEliteGetList', 0);
                schedule.setItem('AutoEliteReqNext', 0);
                state.setItem('AutoEliteEnd', '');
            });

            $j('#caapRestart', caap.caapDivObject).click(caap.restartListener);
            $j('#caap_playbutton', caap.caapPlayButtonDiv).bind('click', caap.restartListener);
            $j('#caap_control', caap.caapDivObject).mousedown(caap.pauseListener);
            $j('#caap_stopAutoQuest', caap.caapDivObject).click(function(e) {
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
    addListeners : function() {
        try {
            if(caap.domain.which !== 3) {
                if(!caap.reBindCaapDiv()) {
                    throw "Unable to find div for caap_div";
                }

                caap.jWindow.bind('resize', caap.windowResizeListener);
            }

            if(caap.domain.which === 0) {
                caap.pageletPresenceDiv.live('DOMNodeInserted', function(event) {
                    if(config.getItem('AutoGift', false) && config.getItem('watchBeeper', true) && $u.setContent($j(event.target).text(), '').hasIndexOf("sent you a request in Castle Age")) {
                        con.log(1, "Beeper saw a gift!");
                        schedule.setItem("ajaxGiftCheck", 0);
                        caap.messaging.ajaxGiftCheck();
                    }
                });

                $j("#contentCol").bind('DOMNodeInserted', function(event) {
                    if(event.target.id !== 'CA-Tools') {
                        return;
                    }

                    con.log(1, "CA-Tools detected! Changing layout.");
                    caap.caTools = true;
                    caap.caToolsDiv = $j('#CA-Tools');
                    window.setTimeout(function() {
                        var styleXY = caap.getControlXY(true, true);
                        caap.caapDivObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });
                        styleXY = caap.getDashboardXY(true);
                        caap.caapTopObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        caap.caapTopMinObject.css({
                            top : styleXY.y + 'px',
                            left : styleXY.x + 'px'
                        });

                        $j('a', caap.caToolsDiv).bind('click', caap.whatClickedURLListener);
                        caap.reBind();
                        caap.caToolsDiv.bind('DOMNodeInserted', function(evt) {
                            if(evt.target.id.hasIndexOf("alt_sts")) {
                                $j('a', caap.caToolsDiv).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                                caap.reBind();
                            } else if(evt.target.id.hasIndexOf("st_2_5")) {
                                $j('#' + evt.target.id + ' a', caap.caToolsDiv).unbind('click', caap.whatClickedURLListener).bind('click', caap.whatClickedURLListener);
                            }
                        });

                        $j("img[src*='facebook-icon.png']", caap.caToolsDiv).bind('click', function() {
                            con.log(1, "CA-Tools quit! Changing layout.");
                            caap.caTools = false;
                            caap.caToolsDiv = null;

                            window.setTimeout(function() {
                                var styleXY = caap.getControlXY(true, true);
                                caap.caapDivObject.css({
                                    top : styleXY.y + 'px',
                                    left : styleXY.x + 'px'
                                });
                                styleXY = caap.getDashboardXY(true);
                                caap.caapTopObject.css({
                                    top : styleXY.y + 'px',
                                    left : styleXY.x + 'px'
                                });

                                caap.caapTopMinObject.css({
                                    top : styleXY.y + 'px',
                                    left : styleXY.x + 'px'
                                });

                                caap.reBind();
                            }, 2000);
                        });
                    }, 2000);
                });
            }

            if(caap.domain.which !== 0) {
                caap.globalContainer = $j('#' + caap.domain.id[caap.domain.which] + 'globalContainer');
                if(!$u.hasContent(caap.globalContainer)) {
                    throw 'Global Container not found';
                }

                // Fires once when page loads
                $j('a', caap.globalContainer).bind('click', caap.whatClickedURLListener);
                $j("div[id*='friend_box_']", caap.globalContainer).bind('click', caap.whatFriendBox);
                if($u.mutationTypes['DOMSubtreeModified']) {
                    con.log(3, "Bind sts onload");
                    $j("span[id*='gold_time_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.goldTimeListener);
                    $j("span[id*='energy_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.energyListener);
                    $j("span[id*='stamina_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.staminaListener);
                    $j("span[id*='health_current_value']", caap.globalContainer).bind('DOMSubtreeModified', caap.healthListener);
                }

                //arena.addListeners();
                festival.addListeners();

                caap.globalContainer.bind('DOMNodeInserted', function(event) {
                    var tId = $u.hasContent(event.target.id) ? event.target.id.replace('app46755028429_', '') : event.target.id,
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
                    page = $j(".game", caap.globalContainer).eq(0).attr("id"), caap_topXY;

                    // Uncomment this to see the id of domNodes that are inserted
                    /*
                    if (event.target.id && !event.target.id.match(/globalContainer/) && !event.target.id.match(/time/i) && !event.target.id.match(/ticker/i) && !event.target.id.match(/caap/i)) {
                    caap.setDivContent('debug2_mess', tId);
                    alert(event.target.id);
                    }
                    */

                    //if (targetList.hasIndexOf(tId)) {
                    if(tId === page) {
                        session.setItem('page', page);
                        con.log(4, "DOM load target matched", tId);
                        caap.clearDomWaiting();
                        caap.incrementPageLoadCounter();
                        caap.reBind();
                        if(caap.domain.which === 3) {
                            if(config.getItem('HideAdsIframe', false)) {
                                //$j("iframe[name*='fb_iframe']").eq(0).parent().css('display', 'none');
                                //$j("div[style*='tool_top.jpg']").css('display', 'none');
                                $j("img[src*='cross_promo_ad2.png']").parents("div:first").css('display', 'none');
                            }

                            if(config.getItem('scrollToTop', false)) {
                                caap.messaging.scrollToTop();
                            }
                        }

                        session.setItem("delayMain", true);
                        window.setTimeout(function() {
                            caap.checkResults();
                            session.setItem("delayMain", false);
                        }, 800);
                    }

                    // Reposition the dashboard
                    if(event.target.id === caap.dashboardXY.selector.replace("#", '')) {
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

    pageList : {
        'castle_age' : {
            signaturePic : 'choose_demi.jpg',
            CheckResultsFunction : 'checkResults_index'
        },
        'castle' : {
            signaturePic : 'choose_demi.jpg',
            CheckResultsFunction : 'checkResults_index'
        },
        'castle_ws' : {
            signaturePic : 'choose_demi.jpg',
            CheckResultsFunction : 'checkResults_index'
        },
        'index' : {
            signaturePic : 'choose_demi.jpg',
            CheckResultsFunction : 'checkResults_index'
        },
        'battle_monster' : {
            signaturePic : 'tab_monster_list_on.gif',
            CheckResultsFunction : 'checkResults_fightList',
            subpages : ['onMonster']
        },
        'player_monster_list' : {
            signaturePic : 'monster_button_yourmonster_on.jpg',
            CheckResultsFunction : 'checkResults_fightList',
            subpages : ['onMonster']
        },
        'public_monster_list' : {
            signaturePic : 'monster_button_pubmonster_on.jpg',
            CheckResultsFunction : 'checkResults_public_monster_list'
        },
        'onMonster' : {
            signaturePic : 'tab_monster_active.gif',
            CheckResultsFunction : 'checkResults_viewFight'
        },
        'guildv2_battle_monster' : {
            signaturePic : 'tab_monster_active.gif',
            CheckResultsFunction : 'checkResults_viewFight'
        },
        'raid' : {
            signaturePic : 'tab_raid_on.gif',
            CheckResultsFunction : 'checkResults_fightList',
            subpages : ['onRaid']
        },
        'onRaid' : {
            signaturePic : 'raid_map',
            CheckResultsFunction : 'checkResults_viewFight'
        },
        'land' : {
            signaturePic : 'tab_land_on.gif',
            CheckResultsFunction : 'checkResults_land'
        },
        'generals' : {
            signaturePic : 'tab_generals_on.gif',
            CheckResultsFunction : 'checkResults_generals'
        },
        'quests' : {
            signaturePic : 'tab_quest_on.gif',
            CheckResultsFunction : 'checkResults_quests',
            subpages : ['earlyQuest']
        },
        'earlyQuest' : {
            signaturePic : 'quest_back_1.jpg',
            CheckResultsFunction : 'checkResults_quests'
        },
        'symbolquests' : {
            signaturePic : 'demi_quest_on.gif',
            CheckResultsFunction : 'checkResults_quests'
        },
        'monster_quests' : {
            signaturePic : 'tab_atlantis_on.gif',
            CheckResultsFunction : 'checkResults_quests'
        },
        'gift_accept' : {
            signaturePic : 'gif',
            CheckResultsFunction : 'checkResults_gift_accept'
        },
        'army' : {
            signaturePic : 'invite_on.gif',
            CheckResultsFunction : 'checkResults_army'
        },
        'keep' : {
            signaturePic : 'tab_stats_on.gif',
            CheckResultsFunction : 'checkResults_keep'
        },
        'oracle' : {
            signaturePic : 'oracle_on.gif',
            CheckResultsFunction : 'checkResults_oracle'
        },
        'alchemy' : {
            signaturePic : 'tab_alchemy_on.gif',
            CheckResultsFunction : 'checkResults_alchemy'
        },
        'battlerank' : {
            signaturePic : 'tab_battle_rank_on.gif',
            CheckResultsFunction : 'checkResults_battlerank'
        },
        'war_rank' : {
            signaturePic : 'tab_war_on.gif',
            CheckResultsFunction : 'checkResults_war_rank'
        },
        'achievements' : {
            signaturePic : 'tab_achievements_on.gif',
            CheckResultsFunction : 'checkResults_achievements'
        },
        'battle' : {
            signaturePic : 'battle_on.gif',
            CheckResultsFunction : 'checkResults_battle'
        },
        'soldiers' : {
            signaturePic : 'tab_soldiers_on.gif',
            CheckResultsFunction : 'checkResults_soldiers'
        },
        'item' : {
            signaturePic : 'tab_black_smith_on.gif',
            CheckResultsFunction : 'checkResults_item'
        },
        'magic' : {
            signaturePic : 'tab_magic_on.gif',
            CheckResultsFunction : 'checkResults_magic'
        },
        'gift' : {
            signaturePic : 'tab_gifts_on.gif',
            CheckResultsFunction : 'checkResults_gift'
        },
        'goblin_emp' : {
            signaturePic : 'emporium_cancel.gif',
            CheckResultsFunction : 'checkResults_goblin_emp'
        },
        'view_class_progress' : {
            signatureId : 'choose_class_screen',
            //signaturePic: 'tab_monster_class_on.gif',
            CheckResultsFunction : 'checkResults_view_class_progress'
        },
        'guildv2_home' : {
            signaturePic : 'tab_guild_main_on.jpg',
            CheckResultsFunction : 'checkResults_guild'
        },
        'guildv2_monster_summon_list' : {
            signaturePic : 'tab_guild_main_on.jpg',
            CheckResultsFunction : 'checkResults_guild_monster_summon_list'
        },
        'guildv2_current_monster_battles' : {
            signaturePic : 'tab_guild_main_on.jpg',
            CheckResultsFunction : 'checkResults_guild_current_monster_battles'
        }, /* some of these older pages can be cleaned up. */
        'guild_current_battles' : {
            signaturePic : 'tab_guild_current_battles_on.gif',
            CheckResultsFunction : 'checkResults_guild_current_battles'
        },
        'guild_current_monster_battles' : {
            signaturePic : 'guild_monster_tab_on.jpg',
            CheckResultsFunction : 'checkResults_guild_current_monster_battles'
        },
        'guild_monster_summon_list' : {
            signaturePic : 'guild_summon_monster_button_on.jpg',
            CheckResultsFunction : 'checkResults_guild_monster_summon_list'
        },
        'guild_battle_monster' : {
            signatureId : 'guild_battle_banner_section',
            CheckResultsFunction : 'checkResults_guild_battle_monster'
        },
        /*'arena': {
         signaturePic: 'tab_arena_on.gif',
         CheckResultsFunction: 'checkResults_arena'
         },
         'arena_battle': {
         signatureId: 'arena_battle_banner_section',
         CheckResultsFunction: 'checkResults_arena_battle'
         },*/
        'army_member' : {
            signaturePic : 'view_army_on.gif',
            CheckResultsFunction : 'checkResults_army_member'
        },
        'festival_challenge' : {
            signaturePic : 'festival_rankbarslider.gif',
            CheckResultsFunction : 'festivalBlessResults'
        },
        'festival_tower' : {
            signaturePic : 'festival_monster_towerlist_button.jpg',
            CheckResultsFunction : 'checkResults_fightList'
        },
        'festival_tower2' : {
            signaturePic : 'festival_monster2_towerlist_button.jpg',
            CheckResultsFunction : 'checkResults_fightList'
        },
        'festival_battle_monster' : {
            signaturePic : 'festival_achievement_monster_',
            CheckResultsFunction : 'checkResults_viewFight'
        },
        'festival_battle_home' : {
            signaturePic : 'festival_button_rewards.gif',
            CheckResultsFunction : 'checkResults_festival_battle_home'
        },
        'festival_guild_battle' : {
            signatureId : 'arena_battle_banner_section',
            CheckResultsFunction : 'checkResults_festival_guild_battle'
        },
        'army_news_feed' : {
            signatureId : 'army_feed_body',
            CheckResultsFunction : 'checkResults_army_news_feed'
        },
        'party' : {
            signaturePic : 'tab_elite_guard_on.gif',
            CheckResultsFunction : 'checkResults_party'
        },
        'festival_duel_home' : {
            signaturePic : 'festival_duelchamp_enter.gif',
            CheckResultsFunction : 'checkResults_festival_duel_home'
        },
        'guild_panel' : {
            signaturePic : 'tab_guild_management_on.gif',
            CheckResultsFunction : 'checkResults_guild_panel'
        },
        'guild_shop' : {
            signaturePic : 'generic_hero_deianira.gif',
            CheckResultsFunction : 'checkResults_guild_shop'
        },
        'guild_class' : {
            signatureId : 'class_help',
            CheckResultsFunction : 'checkResults_guild_class'
        },
        'guild_formation' : {
            signatureId : 'gout_2_',
            CheckResultsFunction : 'checkResults_guild_formation'
        },
        'guildv2_conquest_command' : {
            signatureId : 'war_btn_keep_on',
            CheckResultsFunction : 'checkResults_conquest'
        },
        'guildv2_conquest_expansion_fort' : {
            signatureId : 'war_fort_topinfo.jpg',
            CheckResultsFunction : 'checkResults_conquestLand'
        },
        'guildv2_conquest_expansion_demi' : {
            signatureId : 'war_fort_topinfo.jpg',
            CheckResultsFunction : 'checkResults_conquestLand2'
        }
    },

    addExpDisplay : function() {
        try {
            if(!caap.caTools && config.getItem("displayETNL", true)) {
                var catSTS = caap.caTools ? $j("#alt_sts", caap.caToolsDiv) : null, catOK = caap.caTools && catSTS && catSTS.css("display") !== 'none', etnlDiv = $j("#caap_etnl", catOK ? catSTS : caap.globalContainer);
                etnlDiv = $u.hasContent(etnlDiv) ? etnlDiv.html(caap.stats['exp']['dif']) : $j("#" + caap.domain.id[caap.domain.which] + "st_2_5 strong", catOK ? catSTS : caap.globalContainer).prepend("(<span id='caap_etnl' style='color:red'>" + caap.stats['exp']['dif'] + "</span>) ");
                if(!$u.hasContent(etnlDiv)) {
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
    checkResults : function() {
        try {
            // Check page to see if we should go to a page specific check function
            // todo find a way to verify if a function exists, and replace the array with a check_functionName exists check
            if(!schedule.check('CheckResultsTimer')) {
                return false;
            }

            schedule.setItem('CheckResultsTimer', 1);
            caap.appBodyDiv = $j("#" + caap.domain.id[caap.domain.which] + "app_body", caap.globalContainer);
            caap.resultsWrapperDiv = $j("#" + caap.domain.id[caap.domain.which] + "results_main_wrapper", caap.appBodyDiv);
            caap.resultsText = $u.setContent(caap.resultsWrapperDiv.text(), '').trim().innerTrim();
            caap.battlePage = caap.stats['level'] < 10 ? 'battle_train,battle_off' : 'battle';
            if(!session.setItem("pageLoadOK", caap.getStats())) {
                return true;
            }

            general.GetCurrent();
            general.Shrink();
            var AFrecentAction = localStorage.AFrecentAction;
            if(AFrecentAction == undefined) {
                localStorage.AFrecentAction = true;
                AFrecentAction = true;
            }

            // THIS doesn't work and make CAAP infinite loop if no monsters
            //- reverting back to previous d27 behaviour -- magowiz

            if((monster.records.length == 0) && ((AFrecentAction == true) ))
                monster.flagFullReview();

            if(general.quickSwitch) {
                general.GetEquippedStats();
            }

            var pageUrl = session.getItem('clickUrl', ''), page2 = $u.setContent(pageUrl, 'none').basename(".php"), page = session.getItem('page', page2), demiPointsFirst = config.getItem('DemiPointsFirst', false), whenMonster = config.getItem('WhenMonster', 'Never'), whenBattle = config.getItem('whenBattle', 'Never'), it = 0, len = 0;

            if(page !== page2) {
                //alert("page and page2 differ\n" + page + "\n" + page2 + "\n" + pageUrl);
                con.warn("page and page2 differ", page, page2, pageUrl);
            }

            session.setItem('pageUserCheck', page === 'keep' ? $u.setContent(pageUrl.regex(/user=(\d+)/), 0) : 0);
            if($u.hasContent(page) && $u.hasContent(caap.pageList[page]) && $u.hasContent(caap.pageList[page].subpages)) {
                for( it = 0, len = caap.pageList[page].subpages.length; it < len; it += 1) {
                    if($u.hasContent($j("img[src*='" + caap.pageList[caap.pageList[page].subpages[it]].signaturePic + "']", caap.appBodyDiv))) {
                        page = caap.pageList[page].subpages[it];
                        break;
                    }
                }
            }

            session.setItem('page', page);
            if($u.hasContent(caap.pageList[page])) {
                con.log(2, 'Checking results for', page);
                if($u.isFunction(caap[caap.pageList[page].CheckResultsFunction])) {
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
            caap.setDivContent('conquestbless_mess', schedule.check('collectConquestTimer') ? 'Conquest Collect = none' : 'Next Conquest: ' + $u.setContent(caap.displayTime('collectConquestTimer'), "Unknown"));
            caap.setDivContent('conquestcrystal1bless_mess', schedule.check('collectConquestCrystal1Timer') ? 'Crystal 1 Collect = none' : 'Next Crystal 1: ' + $u.setContent(caap.displayTime('collectConquestCrystal1Timer'), "Unknown"));
            caap.setDivContent('conquestcrystal2bless_mess', schedule.check('collectConquestCrystal2Timer') ? 'Crystal 2 Collect = none' : 'Next Crystal 2: ' + $u.setContent(caap.displayTime('collectConquestCrystal2Timer'), "Unknown"));
            caap.setDivContent('feats_mess', schedule.check('festivalBlessTimer') ? 'Feat = none' : 'Next Feat: ' + $u.setContent(caap.displayTime('festivalBlessTimer'), "Unknown"));
            if($u.hasContent(general.List) && general.List.length <= 2) {
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
    checkResults_generals : function() {
        try {
            var currentGeneral = '', html = '', time = config.getItem("checkGenerals", 24);

            general.GetGenerals();
            currentGeneral = general.GetEquippedStats();
            if(currentGeneral) {
                html = "<span title='Equipped Attack Power Index' style='font-size: 12px; font-weight: normal;'>EAPI:" + currentGeneral['eapi'] + "</span> <span title='Equipped Defense Power Index' style='font-size: 12px; font-weight: normal;'>EDPI:" + currentGeneral['edpi'] + "</span> <span title='Equipped Mean Power Index' style='font-size: 12px; font-weight: normal;'>EMPI:" + currentGeneral['empi'] + "</span>";
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
    getStatusNumbers : function(text) {
        try {
            text = $u.isString(text) ? text.trim() : '';
            if(text === '' || !$u.isString(text) || !/^\d+\/\d+$/.test(text)) {
                throw "Invalid text supplied:" + text;
            }

            var num = $u.setContent(text.regex(/^(\d+)\//), 0), max = $u.setContent(text.regex(/\/(\d+)$/), 0), dif = $u.setContent(max - num, 0);

            return {
                'num' : num,
                'max' : max,
                'dif' : dif
            };
        } catch (err) {
            con.error("ERROR in getStatusNumbers: " + err);
            return undefined;
        }
    },
    stats : {
        'FBID' : 0,
        'account' : '',
        'PlayerName' : '',
        'level' : 0,
        'army' : {
            'actual' : 0,
            'capped' : 0
        },
        'generals' : {
            'total' : 0,
            'invade' : 0
        },
        'attack' : 0,
        'defense' : 0,
        'points' : {
            'skill' : 0,
            'favor' : 0
        },
        'indicators' : {
            'bsi' : 0,
            'lsi' : 0,
            'sppl' : 0,
            'api' : 0,
            'dpi' : 0,
            'mpi' : 0,
            'mhbeq' : 0,
            'htl' : 0,
            'hrtl' : 0,
            'enl' : 0,
            'pvpclass' : '',
            'build' : ''
        },
        'gold' : {
            'cash' : 0,
            'bank' : 0,
            'total' : 0,
            'income' : 0,
            'upkeep' : 0,
            'flow' : 0,
            'ticker' : []
        },
        'rank' : {
            'battle' : 0,
            'battlePoints' : 0,
            'war' : 0,
            'warPoints' : 0
        },
        'potions' : {
            'energy' : 0,
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
            'qc' : 0,
            'bww' : 0,
            'bwl' : 0,
            'te' : 0,
            'tee' : 0,
            'wlr' : 0,
            'eer' : 0,
            'atlantis' : false
        },
        'achievements' : {
            'battle' : {
                'invasions' : {
                    'won' : 0,
                    'lost' : 0,
                    'streak' : 0,
                    'ratio' : 0
                },
                'duels' : {
                    'won' : 0,
                    'lost' : 0,
                    'streak' : 0,
                    'ratio' : 0
                }
            },
            'monster' : {},
            'other' : {
                'alchemy' : 0
            },
	    'feats' : {
                'attack' : 0,
                'defense' : 0,
                'health' : 0,
                'energy' : 0,
                'stamina' : 0,
                'army' : 0
            }
        },
        'character' : {},
        'guild' : {
            'name' : '',
            'id' : '',
            'mPoints' : 0,
            'mRank' : '',
            'bPoints' : 0,
            'bRank' : '',
            'members' : []
        }
    },

    loadStats : function(FBID, AccName) {
        var Stats = gm.getItem('stats.record', 'default');
        if(Stats === 'default' || !$j.isPlainObject(Stats)) {
            Stats = gm.setItem('stats.record', caap.stats);
        }

        $j.extend(true, caap.stats, Stats);
        caap.stats['FBID'] = FBID;
        caap.stats['account'] = AccName;
        con.log(4, "Stats", caap.stats);
        session.setItem("UserDashUpdate", true);
    },
    /*jslint sub: false */

    saveStats : function(src) {
        if(caap.domain.which === 3) {
            caap.messaging.setItem('caap.stats', caap.stats);
        } else {
            gm.setItem('stats.record', caap.stats);
            con.log(4, "Stats", caap.stats);
            if(caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                con.log(2, "caap.saveStats send");
                caap.messaging.setItem('caap.stats', caap.stats);
            }
        }

        if(caap.domain.which !== 0) {
            session.setItem("UserDashUpdate", true);
        }
    },
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    getStats : function() {
        try {
            var passed = true, tNum = 0, xS = 0, xE = 0, ststbDiv = $j("#" + caap.domain.id[caap.domain.which] + "main_ststb", caap.caTools ? caap.caToolsDiv : caap.globalContainer), bntpDiv = $j("#" + caap.domain.id[caap.domain.which] + "main_bntp", caap.globalContainer), tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "gold_current_value", ststbDiv);

            // gold
            if($u.hasContent(tempDiv)) {
                caap.stats['gold']['cash'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
            } else {
                con.warn("Unable to get cashDiv");
                passed = false;
            }

            // energy
            tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_2", ststbDiv);
            if($u.hasContent(tempDiv)) {
                caap.stats['energyT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                caap.stats['energy'] = caap.getStatusNumbers(caap.stats['energyT']['num'] + "/" + caap.stats['energy']['max']);
            } else {
                con.warn("Unable to get energyDiv");
                passed = false;
            }

            // health
            tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_3", ststbDiv);
            if($u.hasContent(tempDiv)) {
                caap.stats['healthT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                caap.stats['health'] = caap.getStatusNumbers(caap.stats['healthT']['num'] + "/" + caap.stats['health']['max']);
            } else {
                con.warn("Unable to get healthDiv");
                passed = false;
            }

            // stamina
            tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_4", ststbDiv);
            if($u.hasContent(tempDiv)) {
                caap.stats['staminaT'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
                caap.stats['stamina'] = caap.getStatusNumbers(caap.stats['staminaT']['num'] + "/" + caap.stats['stamina']['max']);
            } else {
                con.warn("Unable to get staminaDiv");
                passed = false;
            }

            // experience
            tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_2_5", ststbDiv);
            if($u.hasContent(tempDiv)) {
                caap.stats['exp'] = caap.getStatusNumbers($u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+\/\d+)/), "0/0"));
            } else {
                con.warn("Unable to get expDiv");
                passed = false;
            }

            // level
            tempDiv = $j("#" + caap.domain.id[caap.domain.which] + "st_5", ststbDiv);
            if($u.hasContent(tempDiv)) {
                tNum = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                if(tNum > caap.stats['level']) {
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
            if($u.hasContent(tempDiv)) {
                caap.stats['army']['actual'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                tNum = Math.min(caap.stats['army']['actual'], 501);
                if(tNum >= 1 && tNum <= 501) {
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
            if($u.hasContent(tempDiv)) {
                tNum = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                if(tNum > caap.stats['points']['skill']) {
                    con.log(2, 'New points. Resetting AutoStat.');
                    state.setItem("statsMatch", true);
                }

                caap.stats['points']['skill'] = tNum;
            } else {
                con.warn("Unable to get pointsDiv");
                passed = false;
            }

            // Indicators: Hours To Level, Time Remaining To Level and Expected Next Level
            if(caap.stats['exp']) {
                xS = gm ? gm.getItem("expStaminaRatio", 2.4, hiddenVar) : 2.4;
                xE = state.getItem('AutoQuest', caap.newAutoQuest())['expRatio'] || ( gm ? gm.getItem("expEnergyRatio", 1.4, hiddenVar) : 1.4);
                caap.stats['indicators']['htl'] = ((caap.stats['level'] * 12.5) - (caap.stats['stamina']['max'] * xS) - (caap.stats['energy']['max'] * xE)) / (12 * (xS + xE));
                caap.stats['indicators']['hrtl'] = (caap.stats['exp']['dif'] - (caap.stats['stamina']['num'] * xS) - (caap.stats['energy']['num'] * xE)) / (12 * (xS + xE));
                caap.stats['indicators']['enl'] = Date.now() + Math.ceil(caap.stats['indicators']['hrtl'] * 3600000);
            } else {
                con.warn('Could not calculate time to next level. Missing experience stats!');
                passed = false;
            }

            if(!passed) {
                caap.saveStats();
            }

            if(!passed && caap.stats['energy']['max'] === 0 && caap.stats['health']['max'] === 0 && caap.stats['stamina']['max'] === 0) {
                $j().alert("<div style='text-align: center;'>" + con.warn("Paused as this account may have been disabled!", caap.stats) + "</div>");
                caap.pauseListener();
            }

            return passed;
        } catch (err) {
            con.error("ERROR getStats: " + err);
            return false;
        }
    },
    checkResults_keep : function() {
        try {
            var attrDiv = $j("#keepAltStats", caap.appBodyDiv), statsTB = $j("div[style*='keep_cont_treasure.jpg'] div:nth-child(3)>div>div>div>div", caap.appBodyDiv), keepTable1 = $j(".keepTable1 tr", caap.appBodyDiv), statCont = $j("div[style*='keep_cont_top.jpg']>div>div>div", caap.appBodyDiv), tempDiv = $j(), temp, row, head, body;

            if($u.hasContent(attrDiv)) {
                con.log(8, "Getting new values from player keep");
                // rank
                tempDiv = $j("img[src*='gif/rank']", caap.appBodyDiv);
                if($u.hasContent(tempDiv)) {
                    caap.stats['rank']['battle'] = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored rank.');
                }

                // PlayerName
                tempDiv = $j("div[style*='keep_top.jpg'] div", caap.appBodyDiv).first();
                if($u.hasContent(tempDiv)) {
                    caap.stats['PlayerName'] = tempDiv.text().trim();
                    con.log(1, caap.stats['PlayerName']);
                } else {
                    con.warn('Using stored PlayerName.');
                }

                // war rank
                if(caap.stats['level'] >= 100) {
                    tempDiv = $j("img[src*='war_rank_']", caap.appBodyDiv);
                    if($u.hasContent(tempDiv)) {
                        caap.stats['rank']['war'] = $u.setContent($u.setContent(tempDiv.attr("src"), '').basename().regex(/(\d+)/), 0);
                    } else {
                        con.warn('Using stored warRank.');
                    }
                }

                if($u.hasContent(statCont) && statCont.length >= 6) {
                    // Energy
                    tempDiv = statCont.eq(0);
                    if($u.hasContent(tempDiv)) {
                        caap.stats['energy'] = caap.getStatusNumbers(caap.stats['energyT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                    } else {
                        con.warn('Using stored energy value.');
                    }

                    // Stamina
                    tempDiv = statCont.eq(1);
                    if($u.hasContent(tempDiv)) {
                        caap.stats['stamina'] = caap.getStatusNumbers(caap.stats['staminaT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                    } else {
                        con.warn('Using stored stamina value.');
                    }

                    if(caap.stats['level'] >= 10) {
                        // Attack
                        tempDiv = statCont.eq(2);
                        if($u.hasContent(tempDiv)) {
                            caap.stats['attack'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                        } else {
                            con.warn('Using stored attack value.');
                        }

                        // Defense
                        tempDiv = statCont.eq(3);
                        if($u.hasContent(tempDiv)) {
                            caap.stats['defense'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                        } else {
                            con.warn('Using stored defense value.');
                        }
                    }

                    // Health
                    tempDiv = statCont.eq(4);
                    if($u.hasContent(tempDiv)) {
                        caap.stats['health'] = caap.getStatusNumbers(caap.stats['healthT']['num'] + '/' + $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0));
                    } else {
                        con.warn('Using stored health value.');
                    }
                } else {
                    con.warn("Can't find stats containers! Using stored stats values.");
                }

                // Check for Gold Stored
                tempDiv = statsTB.eq(4);
                if($u.hasContent(tempDiv)) {
                    caap.stats['gold']['bank'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                    caap.stats['gold']['total'] = caap.stats['gold']['bank'] + caap.stats['gold']['cash'];
                    tempDiv.attr({
                        title : "Click to copy value to retrieve",
                        style : "color: blue;"
                    }).hover(function() {
                        caap.style.cursor = 'pointer';
                    }, function() {
                        caap.style.cursor = 'default';
                    }).click(function() {
                        $j("input[name='get_gold']", caap.appBodyDiv).val(caap.stats['gold']['bank']);
                    });
                } else {
                    con.warn('Using stored inStore.');
                }

                // Check for income
                tempDiv = statsTB.eq(5);
                if($u.hasContent(tempDiv)) {
                    caap.stats['gold']['income'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                } else {
                    con.warn('Using stored income.');
                }

                // Check for upkeep
                tempDiv = statsTB.eq(6);
                if($u.hasContent(tempDiv)) {
                    caap.stats['gold']['upkeep'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                } else {
                    con.warn('Using stored upkeep.');
                }

                // Cash Flow
                caap.stats['gold']['flow'] = caap.stats['gold']['income'] - caap.stats['gold']['upkeep'];

                // Energy potions
                tempDiv = $j("div[title='Energy Potion']").children().eq(1);
                if($u.hasContent(tempDiv)) {
                    caap.stats['potions']['energy'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                } else {
                    caap.stats['potions']['energy'] = 0;
                }

                // Stamina potions
                tempDiv = $j("div[title='Stamina Potion']").children().eq(1);
                if($u.hasContent(tempDiv)) {
                    caap.stats['potions']['stamina'] = $u.setContent($u.setContent(tempDiv.text(), '').numberOnly(), 0);
                } else {
                    caap.stats['potions']['stamina'] = 0;
                }

                // Other stats
                // Atlantis Open
                caap.stats['other'].atlantis = $u.hasContent(caap.checkForImage("seamonster_map_finished.jpg")) ? true : false;

                // quests Completed
                tempDiv = statCont.eq(18);
                if($u.hasContent(tempDiv)) {
                    caap.stats['other']['qc'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored other.');
                }

                // Battles/Wars Won
                tempDiv = statCont.eq(19);
                if($u.hasContent(tempDiv)) {
                    caap.stats['other']['bww'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored other.');
                }

                // Battles/Wars Lost
                tempDiv = statCont.eq(20);
                if($u.hasContent(tempDiv)) {
                    caap.stats['other']['bwl'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored other.');
                }

                // Times eliminated
                tempDiv = statCont.eq(21);
                if($u.hasContent(tempDiv)) {
                    caap.stats['other']['te'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored other.');
                }

                // Times you eliminated an enemy
                tempDiv = statCont.eq(22);
                if($u.hasContent(tempDiv)) {
                    caap.stats['other']['tee'] = $u.setContent($u.setContent(tempDiv.text(), '').regex(/(\d+)/), 0);
                } else {
                    con.warn('Using stored other.');
                }

                // Win/Loss Ratio (WLR)
                caap.stats['other']['wlr'] = caap.stats['other']['bwl'] !== 0 ? (caap.stats['other']['bww'] / caap.stats['other']['bwl']).dp(2) : Infinity;
                // Enemy Eliminated Ratio/Eliminated (EER)
                caap.stats['other']['eer'] = caap.stats['other']['tee'] !== 0 ? (caap.stats['other']['tee'] / caap.stats['other']['te']).dp(2) : Infinity;
                // Indicators
                if(caap.stats['level'] >= 10) {
                    caap.stats['indicators']['bsi'] = ((caap.stats['attack'] + caap.stats['defense']) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['lsi'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max'])) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['sppl'] = ((caap.stats['energy']['max'] + (2 * caap.stats['stamina']['max']) + caap.stats['attack'] + caap.stats['defense'] + caap.stats['health']['max'] - 122) / caap.stats['level']).dp(2);
                    caap.stats['indicators']['api'] = ((caap.stats['attack'] + (caap.stats['defense'] * 0.7))).dp(2);
                    caap.stats['indicators']['dpi'] = ((caap.stats['defense'] + (caap.stats['attack'] * 0.7))).dp(2);
                    caap.stats['indicators']['mpi'] = (((caap.stats['indicators']['api'] + caap.stats['indicators']['dpi']) / 2)).dp(2);
                    caap.stats['indicators']['mhbeq'] = ((caap.stats['attack'] + (2 * caap.stats['stamina']['max'])) / caap.stats['level']).dp(2);
                    if(caap.stats['attack'] >= caap.stats['defense']) {
                        temp = caap.stats['attack'] / caap.stats['defense'];
                        if(temp === caap.stats['attack']) {
                            caap.stats['indicators']['pvpclass'] = 'Destroyer';
                        } else if(temp >= 2 && temp < 7.5) {
                            caap.stats['indicators']['pvpclass'] = 'Aggressor';
                        } else if(temp < 2 && temp > 1.01) {
                            caap.stats['indicators']['pvpclass'] = 'Offensive';
                        } else if(temp <= 1.01) {
                            caap.stats['indicators']['pvpclass'] = 'Balanced';
                        }
                    } else {
                        temp = caap.stats['defense'] / caap.stats['attack'];
                        if(temp === caap.stats['defense']) {
                            caap.stats['indicators']['pvpclass'] = 'Wall';
                        } else if(temp >= 2 && temp < 7.5) {
                            caap.stats['indicators']['pvpclass'] = 'Paladin';
                        } else if(temp < 2 && temp > 1.01) {
                            caap.stats['indicators']['pvpclass'] = 'Defensive';
                        } else if(temp <= 1.01) {
                            caap.stats['indicators']['pvpclass'] = 'Balanced';
                        }
                    }

                    if(caap.stats['indicators']['bsi'] >= 7) {
                        caap.stats['indicators']['build'] = 'Pure PvP';
                    } else if(caap.stats['indicators']['bsi'] >= 5 && caap.stats['indicators']['bsi'] < 7) {
                        caap.stats['indicators']['build'] = 'PvP';
                    } else if(caap.stats['indicators']['bsi'] >= 3 && caap.stats['indicators']['bsi'] < 5) {
                        caap.stats['indicators']['build'] = 'Hybrid';
                    } else if(caap.stats['indicators']['bsi'] >= 1 && caap.stats['indicators']['bsi'] < 3) {
                        caap.stats['indicators']['build'] = 'Monster Hunter';
                    } else if(caap.stats['indicators']['bsi'] < 1) {
                        caap.stats['indicators']['build'] = 'Power Leveler';
                    }
                }

                schedule.setItem("keep", ( gm ? gm.getItem("checkKeep", 1, hiddenVar) : 1) * 3600, 300);
                caap.saveStats();
                if(!caap.caTools && config.getItem("displayKStats", true)) {
                    tempDiv = $j("div[style*='keep_top']");
                    backgroundDiv = $j("div[style*='keep_tabheader']");

                    temp = "<div style='background-image:url(\"http://image4.castleagegame.com/12124/graphics/keep_tabheader.jpg\");border:none;padding: 5px 5px 20px 20px;width:715px;height:100px;z-index:10;position:relative;top:0px;'>";
                    temp += "<div style='border:1px solid #701919;padding: 5px 5px;width:688px;height:100px;background-color:#d0b682;'>";
                    row = caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '5%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '10%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '20%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '10%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '20%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '10%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '20%'
                    });
                    row += caap.makeTh({
                        text : '&nbsp;',
                        color : '',
                        bgcolor : '',
                        id : '',
                        title : '',
                        width : '5%'
                    });
                    head = caap.makeTr(row);
                    row = caap.makeTd({
                        text : '',
                        color : '',
                        id : '',
                        title : ''
                    });
                    row += caap.makeTd({
                        text : 'BSI',
                        color : '',
                        id : '',
                        title : 'Battle Strength Index'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['bsi'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'LSI',
                        color : '',
                        id : '',
                        title : 'Leveling Speed Index'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['lsi'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'SPPL',
                        color : '',
                        id : '',
                        title : 'Skill Points Per Level (More accurate than SPAEQ)'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['sppl'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    body = caap.makeTr(row);
                    row = caap.makeTd({
                        text : '',
                        color : '',
                        id : '',
                        title : ''
                    });
                    row += caap.makeTd({
                        text : 'API',
                        color : '',
                        id : '',
                        title : 'Attack Power Index'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['api'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'DPI',
                        color : '',
                        id : '',
                        title : 'Defense Power Index'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['dpi'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'MPI',
                        color : '',
                        id : '',
                        title : 'Mean Power Index'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['mpi'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    body += caap.makeTr(row);
                    row = caap.makeTd({
                        text : '',
                        color : '',
                        id : '',
                        title : ''
                    });
                    row += caap.makeTd({
                        text : 'MHBEQ',
                        color : '',
                        id : '',
                        title : 'Monster Hunting Build Effective Quotent'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['mhbeq'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'Build',
                        color : '',
                        id : '',
                        title : 'Character build type'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['build'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : 'PvP Class',
                        color : '',
                        id : '',
                        title : 'Player vs. Player character class'
                    }, "font-size:14px;");
                    row += caap.makeTd({
                        text : caap.stats['indicators']['pvpclass'],
                        color : '',
                        id : '',
                        title : ''
                    }, "font-size:14px;");
                    body += caap.makeTr(row);
                    temp += caap.makeTable("keepstats", head, body, "Statistics", "font-size:16px;");
                    temp += "</div></div>";
                    tempDiv.after(temp);
                } else {
                    tempDiv = $j(".keep_stat_title_inc", attrDiv);
                    tempDiv = $u.hasContent(tempDiv) ? tempDiv.html($u.setContent(tempDiv.html(), '').trim() + ", <span style='white-space: nowrap;'>BSI: " + caap.stats['indicators']['bsi'] + " LSI: " + caap.stats['indicators']['lsi'] + "</span>") : tempDiv;
                }
            } else {
                tempDiv = $j("a[href*='keep.php?user=']", caap.appBodyDiv);
                if($u.hasContent(tempDiv)) {
                    con.log(2, "On another player's keep", $u.setContent($u.setContent(tempDiv.attr("href"), '').basename().regex(/(\d+)/), 0));
                } else {
                    con.warn("Attribute section not found and not identified as another player's keep!");
                }
            }

            if(config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            if(config.getItem("enableKeepShrink", true)) {
                $j("div[class*='statUnit'] img", caap.appBodyDiv).attr("style", "height: 45px; width: 45px;").not("div[class*='statUnit'] img[alt='Stamina Potion'],img[alt='Energy Potion']", caap.appBodyDiv).parent().parent().attr("style", "height: 45px; width: 45px;");
            }

            return true;
        } catch (err) {
            con.error("ERROR in checkResults_keep: " + err);
            return false;
        }
    },
    checkResults_oracle : function() {
        try {
            var favorDiv = $j(".title_action", caap.appBodyDiv), text = '', tNum = 0, save = false, tDiv, lDiv;

            if($u.hasContent(favorDiv)) {
                text = favorDiv.text();
                if(/You have zero favor points!/.test(text)) {
                    caap.stats['points']['favor'] = 0;
                    save = true;
                } else if(/You have a favor point!/.test(text)) {
                    caap.stats['points']['favor'] = 1;
                    save = true;
                } else {
                    tNum = text.regex(/You have (\d+) favor points!/);
                    if($u.hasContent(tNum)) {
                        caap.stats['points']['favor'] = tNum;
                        save = true;
                    }
                }
            } else {
                con.warn('Favor Points div not found.');
            }

            if(save) {
                con.log(2, 'Got number of Favor Points', caap.stats['points']['favor']);
                caap.saveStats();
            } else {
                con.warn('Favor Points not matched.');
            }

            if(config.getItem("enableOracleMod", true)) {
                tDiv = $j("#results_container", caap.appBodyDiv).parent().children().eq(6);
                if($u.hasContent(tDiv)) {
                    lDiv = $j(".limitedDiv_int", caap.appBodyDiv);
                    if($u.hasContent(lDiv) && lDiv.length === 4) {
                        text = '<form><select><option value="#">Change General</option>';
                        for( tNum = 0; tNum < offline.bga.length; tNum += 1) {
                            text += '<option value="' + tNum + '">' + offline.bga[tNum].n + '</option>';
                        }
                        text += '</select></form>';
                        tDiv.html(text);
                        tDiv.children("form").bind('change', function(event) {
                            var v = event.target.value, it = 0;

                            function change(t, i, n, a, d, b, o, p) {
                                o = lDiv.eq(o).children();
                                o.eq(1).children().eq(0).html('Summon<br>' + ["General", "Magic", "Amulet", "Weapon", "Shield", "Helmet", "Armor", "Glove", "Off-hand", "Spell"][t] + '<br>');
                                o.eq(2).children().eq(0).attr({
                                    'src' : o.eq(2).children().eq(0).attr('src').dirname() + p + '.jpg',
                                    'alt' : n,
                                    'title' : i
                                });

                                o.eq(3).children().eq(0).html(n + '!');
                                o.eq(4).children().eq(0).children(0).text(a + ' Attack');
                                o.eq(4).children().eq(1).children(0).text(d + ' Defense');
                                o.eq(5).children().eq(0).attr('id', 'favorBuy_' + b);
                                $j("input[name='buychoice']", o).val(b);
                            }

                            if(v !== "#") {
                                change(0, offline.bga[v].i, offline.bga[v].n, offline.bga[v].a, offline.bga[v].d, offline.bga[v].b, 0, offline.bga[v].p);
                                for( it = 0; it < 3; it += 1) {
                                    change(offline.bga[v].e[it].t, offline.bga[v].e[it].i, offline.bga[v].e[it].n, offline.bga[v].e[it].a, offline.bga[v].e[it].d, offline.bga[v].e[it].b, 1 + it, offline.bga[v].e[it].p);
                                }
                            }
                        });
                    } else {
                        con.warn('limitedDiv_int not found.');
                    }
                } else {
                    con.warn('results_container not found.');
                }
            }

            schedule.setItem("oracle", ( gm ? gm.getItem("checkOracle", 24, hiddenVar) : 24) * 3600, 300);
            return true;
        } catch (err) {
            con.error("ERROR in checkResults_oracle: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    checkResults_alchemy : function() {
        try {
            if(config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            var recipeDiv = $j(".alchemyRecipeBack .recipeTitle", caap.appBodyDiv), titleTxt = '', titleRegExp = new RegExp("RECIPES: Create (.+)", "i"), image = '', hideCount = config.getItem("recipeCleanCount", 1), special = ["Volcanic Knight", "Holy Plate", "Atlantean Forcefield", "Spartan Phalanx", "Cronus, The World Hydra", "Helm of Dragon Power", "Avenger", "Judgement", "Tempered Steel", "Bahamut, the Volcanic Dragon", "Blood Zealot", "Transcendence", "Soul Crusher", "Soulforge", "Crown of Flames"];
            hideCount = hideCount < 1 ? 1 : hideCount;
            if($u.hasContent(recipeDiv)) {
                recipeDiv.each(function() {
                    var row = $j(this);
                    titleTxt = row.text().trim().innerTrim().regex(titleRegExp);
                    if($u.hasContent(titleTxt)) {
                        if(titleTxt === "Elven Crown") {
                            image = "gift_aeris_complete.jpg";
                        }

                        if(spreadsheet.isSummon(titleTxt, image)) {
                            row.text(row.text().trim() + ' : Summon Owned (' + town.getCount(titleTxt, image) + ')');
                        } else {
                            row.text(row.text().trim() + ' : Owned (' + town.getCount(titleTxt, image) + ')');
                            if(config.getItem("enableRecipeClean", true) && !special.hasIndexOf(titleTxt) && town.getCount(titleTxt, image) >= hideCount) {
                                row.parent().parent().css("display", "none").next().css("display", "none");
                            }
                        }
                    }

                    return true;
                });
            }

            if(config.getItem("enableIngredientsHide", false)) {
                $j("div[class='statsTTitle'],div[class='statsTMain']", caap.appBodyDiv).css("display", "none");
            }

            if(config.getItem("enableAlchemyShrink", true)) {
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
    commonTown : function() {
        try {
            $j("form[id*='itemBuy'] select[name='amount']", caap.appBodyDiv).val("5");
            if(config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            return true;
        } catch (err) {
            con.error("ERROR in commonTown: " + err);
            return false;
        }
    },
    checkResults_soldiers : function() {
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
    checkResults_item : function() {
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
    checkResults_magic : function() {
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
    checkResults_goblin_emp : function() {
        try {
            if(config.getItem("goblinHinting", true)) {
                spreadsheet.doTitles(true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in checkResults_goblin_emp: " + err);
            return false;
        }
    },
    checkResults_gift : function() {
        try {
            if($u.hasContent(gifting.queue.sentHtml)) {
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
    checkResults_battlerank : function() {
        try {
            var rankDiv = $j("div[style*='battle_rank_banner.jpg']", caap.appBodyDiv), tNum = 0;

            if($u.hasContent(rankDiv)) {
                tNum = $u.setContent($u.setContent(rankDiv.text(), '').replace(',', '').regex(/with (\d+) Battle Points/i), 0);
                if($u.hasContent(tNum)) {
                    con.log(2, 'Got Battle Rank Points', tNum);
                    caap.stats['rank']['battlePoints'] = tNum;
                    caap.saveStats();
                } else {
                    con.warn('Battle Rank Points RegExp not matched.');
                }
            } else {
                con.warn('Battle Rank Points div not found.');
            }

            schedule.setItem("battlerank", ( gm ? gm.getItem("checkBattleRank", 48, hiddenVar) : 48) * 3600, 300);
            return true;
        } catch (err) {
            con.error("ERROR in checkResults_battlerank: " + err);
            return false;
        }
    },
    checkResults_war_rank : function() {
        try {
            var rankDiv = $j("div[style*='war_rank_banner.jpg']", caap.appBodyDiv), tNum = 0;

            if($u.hasContent(rankDiv)) {
                tNum = $u.setContent($u.setContent(rankDiv.text(), '').replace(',', '').regex(/with (\d+) War Points/i), 0);
                if($u.hasContent(tNum)) {
                    con.log(2, 'Got War Rank Points', tNum);
                    caap.stats['rank']['warPoints'] = tNum;
                    caap.saveStats();
                } else {
                    con.warn('War Rank Points RegExp not matched.');
                }
            } else {
                con.warn('War Rank Points div not found.');
            }

            schedule.setItem("warrank", ( gm ? gm.getItem("checkWarRank", 48, hiddenVar) : 48) * 3600, 300);
            return true;
        } catch (err) {
            con.error("ERROR in checkResults_war_rank: " + err);
            return false;
        }
    },
            checkResults_achievements : function() {
            try {
                var achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievements_2", caap.appBodyDiv), tdDiv = $j("td div", achDiv);

                if($u.hasContent(achDiv)) {
                    if($u.hasContent(tdDiv) && tdDiv.length === 6) {
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
                if($u.hasContent(achDiv)) {
                    tdDiv = $j("td", achDiv);
                    if($u.hasContent(tdDiv)) {
                        caap.stats['achievements']['monster'] = {};
                        tdDiv.each(function() {
                            var td = $j(this), divNum = $j("div", td).text().parseInt(), tdTxt = td.justtext().trim();

                            caap.stats['achievements']['monster'][tdTxt] = divNum;
                        });

                        caap.saveStats();
                    } else {
                        con.warn('Monster Achievements problem.');
                    }
                } else {
                    con.warn('Monster Achievements not found.');
                }
                achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievement_type_container_test_of_might_other", caap.appBodyDiv);
                if($u.hasContent(achDiv)) {
                var level = 0;
                    tdDiv = $j('div[id="achievement_type_container_test_of_might_other"] > div[class="achievement_info_container"] > div[id="achievement_body"]');
                for (ii=0;ii<tdDiv[0].children[0].children.length;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii;
                   }
                }
                caap.stats['achievements']['other']['alchemy'] = level;
                    caap.saveStats();
                } else {
                    con.warn('Test of Might Achievements not found.');
                }
             
                achDiv = $j("#" + caap.domain.id[caap.domain.which] + "achievement_type_container_festival_feat", caap.appBodyDiv);
                if($u.hasContent(achDiv)) {
                var level = 0;
                    tdDiv = $j('div[id="achievement_type_container_festival_feat"] > div[class="achievement_info_container"] > div[id="achievement_body"]');
                for (ii=1;ii<9;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii;
                   }
                }
                caap.stats['achievements']['feats']['attack'] = level;
                    caap.saveStats();
                level = 0;
                for (ii=9;ii<17;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii-8;
                   }
                }
                caap.stats['achievements']['feats']['defense'] = level;
                    caap.saveStats();
                level = 0;
                for (ii=17;ii<25;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii-16;
                   }
                }
                caap.stats['achievements']['feats']['health'] = level;
                    caap.saveStats();
                level = 0;
                for (ii=25;ii<33;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii-24;
                   }
                }
                caap.stats['achievements']['feats']['energy'] = level;
                    caap.saveStats();
                level = 0;
                for (ii=33;ii<41;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii-32;
                   }
                }
                caap.stats['achievements']['feats']['stamina'] = level;
                    caap.saveStats();
                level = 0;
                for (ii=41;ii<49;ii++) {
                   if (tdDiv[0].children[0].children[ii].style['opacity']==="") {
                      level=ii-40;
                   }
                }
                caap.stats['achievements']['feats']['army'] = level;
                    caap.saveStats();
                } else {
                    con.warn('Festival Feats Achievements not found.');
                }

                schedule.setItem("achievements", ( gm ? gm.getItem("checkAchievements", 72, hiddenVar) : 72) * 3600, 300);
                return true;
            } catch (err) {
                con.error("ERROR in checkResults_achievements: " + err);
                return false;
            }
        },
    checkResults_view_class_progress : function() {
        try {
            var classDiv = $j("#" + caap.domain.id[caap.domain.which] + "choose_class_screen div[class*='banner_']", caap.appBodyDiv);
            if($u.hasContent(classDiv)) {
                caap.stats['character'] = {};
                classDiv.each(function() {
                    var monsterClass = $j(this), name = $u.setContent(monsterClass.attr("class"), '').replace("banner_", '').ucFirst();

                    if(name) {
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

            schedule.setItem("characterClasses", ( gm ? gm.getItem("CheckClassProgress", 48, hiddenVar) : 48) * 3600, 300);
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

    maxEnergyQuest : function() {
        try {
            var maxIdleEnergy = 0, theGeneral = config.getItem('IdleGeneral', 'Use Current');

            if(theGeneral !== 'Use Current') {
                maxIdleEnergy = $u.setContent(general.GetEnergyMax(theGeneral), 0);
                if(maxIdleEnergy <= 0 || $u.isNaN(maxIdleEnergy)) {
                    con.log(1, "Changing to idle general to get Max energy");
                    if(general.Select('IdleGeneral')) {
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

    questAreaInfo : {
        'Land of Fire' : {
            clas : 'quests_stage_1',
            base : 'land_fire',
            next : 'Land of Earth',
            area : '',
            list : '',
            boss : 'Heart of Fire',
            orb : 'Orb of Gildamesh'
        },
        'Land of Earth' : {
            clas : 'quests_stage_2',
            base : 'land_earth',
            next : 'Land of Mist',
            area : '',
            list : '',
            boss : 'Gift of Earth',
            orb : 'Colossal Orb'
        },
        'Land of Mist' : {
            clas : 'quests_stage_3',
            base : 'land_mist',
            next : 'Land of Water',
            area : '',
            list : '',
            boss : 'Eye of the Storm',
            orb : 'Sylvanas Orb'
        },
        'Land of Water' : {
            clas : 'quests_stage_4',
            base : 'land_water',
            next : 'Demon Realm',
            area : '',
            list : '',
            boss : 'A Look into the Darkness',
            orb : 'Orb of Mephistopheles'
        },
        'Demon Realm' : {
            clas : 'quests_stage_5',
            base : 'land_demon_realm',
            next : 'Undead Realm',
            area : '',
            list : '',
            boss : 'The Rift',
            orb : 'Orb of Keira'
        },
        'Undead Realm' : {
            clas : 'quests_stage_6',
            base : 'land_undead_realm',
            next : 'Underworld',
            area : '',
            list : '',
            boss : 'Undead Embrace',
            orb : 'Lotus Orb'
        },
        'Underworld' : {
            clas : 'quests_stage_7',
            base : 'tab_underworld',
            next : 'Kingdom of Heaven',
            area : '',
            list : '',
            boss : 'Confrontation',
            orb : 'Orb of Skaar Deathrune'
        },
        'Kingdom of Heaven' : {
            clas : 'quests_stage_8',
            base : 'tab_heaven',
            next : 'Ivory City',
            area : '',
            list : '',
            boss : 'Archangels Wrath',
            orb : 'Orb of Azriel'
        },
        'Ivory City' : {
            clas : 'quests_stage_9',
            base : 'tab_ivory',
            next : 'Earth II',
            area : '',
            list : '',
            boss : 'Entrance to the Throne',
            orb : 'Orb of Alpha Mephistopheles'
        },
        'Earth II' : {
            clas : 'quests_stage_10',
            base : 'tab_earth2',
            next : 'Water II',
            area : '',
            list : '',
            boss : "Lion's Rebellion",
            orb : 'Orb of Aurelius'
        },
        'Water II' : {
            clas : 'quests_stage_11',
            base : 'tab_water2',
            next : 'Mist II',
            area : '',
            list : '',
            boss : "Corvintheus",
            orb : 'Orb of Corvintheus'
        },
        'Mist II' : {
            clas : 'quests_stage_12',
            base : 'tab_mist2',
            next : 'Mist III',
            area : '',
            list : '',
            boss : "Jahanna",
            orb : 'Orb of Jahanna'
        },
        'Mist III' : {
            clas : 'quests_stage_13',
            base : 'tab_mist3',
            next : 'Fire II',
            area : '',
            list : '',
            boss : "Aurora",
            orb : 'Orb of Aurora'
        },
        'Fire II' : {
            clas : 'quests_stage_14',
            base : 'tab_fire2',
            next : 'Pangaea',
            area : '',
            list : '',
            boss : "Ambrosia",
            orb : 'Orb of Ambrosia'
        },
        'Pangaea' : {
            clas : 'quests_stage_15',
            base : 'tab_pangaea',
            next : 'Perdition',
            area : '',
            list : '',
            boss : "Malekus",
            orb : 'Orb of Malekus'
        },
        'Perdition' : {
            clas : 'quests_stage_16',
            base : 'tab_perdition',
            next : 'Land of Fire III',
            area : '',
            list : '',
            boss : "Azeron",
            orb : 'Orb of Azeron'
        },
        'Land of Fire III' : {
            clas : 'quests_stage_17',
            base : 'tab_fire4',
            next : 'Land of Earth III',
            area : '',
            list : '',
            boss : "Fenix",
            orb : 'Orb of Fenix'
        },
        'Land of Earth III' : {
            clas : 'quests_stage_18',
            base : 'tab_earth3',
            next : 'Land of Mist IV',
            area : '',
            list : '',
            boss : "Urmek",
            orb : 'Orb of Urmek'
        },
        'Land of Mist IV' : {
            clas : 'quests_stage_19',
            base : 'tab_mist4',
            next : 'Land of Water III',
            area : '',
            list : '',
            boss : "Vorak",
            orb : 'Orb of Vorak'
        },
        'Land of Water III' : {
            clas : 'quests_stage_20',
            base : 'tab_water3',
            next : 'DemiChange',
            area : '',
            list : '',
            boss : "Baal",
            orb : 'Orb of Baal'
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
        'Ambrosia' : 'energy',
        'Malekus' : 'attack',
        'Corvintheus' : 'defense',
        'Aurora' : 'health',
        'Azeron' : 'stamina'
    },

    isExcavationQuest : {
    	'Cave of Wonder' : true,
    	'Rune Mines' : true,
    	'Nether Vortex' : true
    },

    qtom : null,

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    quests : function() {
        try {
            var storeRetrieve = state.getItem('storeRetrieve', ''), to;

            if(storeRetrieve) {
                if(storeRetrieve === 'general') {
                    con.log(1, "storeRetrieve", storeRetrieve);
                    if(general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    return true;
                } else {
                    return caap.retrieveFromBank(storeRetrieve);
                }
            }

            caap.qtom = window.setTimeout(function() {
                caap.setDivContent('quest_mess', '');
            }, 1000);
            var whenQuest = config.getItem('WhenQuest', 'Never');
            if(whenQuest === 'Never') {
                caap.setDivContent('quest_mess', 'Questing off');
                window.clearTimeout(caap.qtom);
                return false;
            }

            if(whenQuest === 'Not Fortifying' || (config.getItem('PrioritiseMonsterAfterLvl', false) && state.getItem('KeepLevelUpGeneral', false))) {
                var fortMon = state.getItem('targetFromfortify', new monster.energyTarget().data);
                if($j.isPlainObject(fortMon) && fortMon['md5'] && fortMon['type']) {
                    switch (fortMon['type']) {
                        case "Fortify":
                            var maxHealthtoQuest = config.getItem('MaxHealthtoQuest', 0);
                            if(!maxHealthtoQuest) {
                                caap.setDivContent('quest_mess', '<span style="font-weight: bold;">No valid over fortify %</span>');
                                window.clearTimeout(caap.qtom);
                                return false;
                            }

                            caap.setDivContent('quest_mess', 'No questing until attack target ' + fortMon['name'] + " health exceeds " + config.getItem('MaxToFortify', 0) + '%');
                            window.clearTimeout(caap.qtom);
                            var targetFrombattle_monster = state.getItem('targetFrombattle_monster', '');
                            // this looks like a bug and needs testing if (!targetFrombattle_monster) {
                            if(!targetFrombattle_monster) {
                                var currentMonster = monster.getItem(targetFrombattle_monster);
                                if(!currentMonster['fortify']) {
                                    if(currentMonster['fortify'] < maxHealthtoQuest) {
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
            if(!autoQuestName) {
                if(config.getItem('WhyQuest', 'Manual') === 'Manual') {
                    caap.setDivContent('quest_mess', 'Pick quest manually.');
                    window.clearTimeout(caap.qtom);
                    return false;
                }

                caap.setDivContent('quest_mess', 'Searching for quest.');
                window.clearTimeout(caap.qtom);
                con.log(1, "Searching for quest");
            } else {
                var energyCheck = caap.checkEnergy(state.getItem('AutoQuest', caap.newAutoQuest())['energy'], whenQuest, 'quest_mess');
                if(!energyCheck) {
                    return false;
                }
            }

            if(state.getItem('AutoQuest', caap.newAutoQuest())['general'] === 'none' || config.getItem('ForceSubGeneral', false)) {
                if(general.Select('SubQuestGeneral')) {
                    return true;
                }
            } else if(general.LevelUpCheck('QuestGeneral')) {
                if(general.Select('LevelUpGeneral')) {
                    return true;
                }

                con.log(2, 'Using level up general');
            }

            switch (config.getItem('QuestArea', 'Quest')) {
                case 'Quest' :
                    var pathToPage = 'quests', imageOnPage = 'quest_back_1.jpg', subQArea = 'Land of Fire', landPic = '';

                    if(caap.stats['level'] > 7) {
                        subQArea = config.getItem('QuestSubArea', 'Land of Fire');
                        landPic = caap.questAreaInfo[subQArea].base;
                        if($u.hasContent($j("img[src*='" + landPic + "_lock']"))) {
                            caap.checkResults_quests(true);
                        }

                        if(landPic === 'tab_heaven' || config.getItem('GetOrbs', false) && config.getItem('WhyQuest', 'Manual') !== 'Manual') {
                            if(caap.checkMagic()) {
                                return true;
                            }
                        }
                        pathToPage = 'quests,jobs_tab_more.gif,' + landPic;
                        imageOnPage = landPic;
                        switch (landPic) {
                        	case 'tab_water3':
                            case 'tab_mist4':
                            case 'tab_earth3':
                            case 'tab_fire4':
                            case 'tab_perdition':
                            case 'tab_pangaea':
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

                    if(caap.navigateTo(pathToPage, imageOnPage)) {
                        return true;
                    }

                    break;
                case 'Demi Quests' :
                    if(caap.navigateTo('quests,symbolquests', 'demi_quest_on.gif')) {
                        return true;
                    }

                    var subDQArea = config.getItem('QuestSubArea', 'Ambrosia'), deityN = caap.deityTable[caap.demiQuestTable[subDQArea]], picSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_image_symbolquests" + deityN, caap.globalContainer), descSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_desc_symbolquests" + deityN, caap.globalContainer);

                    if(!$u.hasContent(picSlice) || !$u.hasContent(descSlice)) {
                        con.warn('No diety image or description for', subDQArea);
                        return false;
                    }

                    if(descSlice.css('display') === 'none') {
                        return caap.navigateTo(picSlice.attr("src").basename());
                    }

                    break;
                case 'Atlantis' :
                    if(!caap.hasImage('tab_atlantis_on.gif')) {
                        return caap.navigateTo('quests,monster_quests');
                    }

                    break;
                default :
            }

            var bDiv = $j("#" + caap.domain.id[caap.domain.which] + "single_popup", caap.globalContainer), bDisp = $u.setContent(bDiv.css("display"), 'none'), button = $j();

            if(bDisp !== 'none') {
                button = $j("input[src*='quick_switch_button.gif']", bDiv);
                if($u.hasContent(button) && !config.getItem('ForceSubGeneral', false)) {
                    con.log(2, 'Clicking on quick switch general button.');
                    caap.click(button);
                    general.quickSwitch = true;
                    return true;
                }
            }

            if(general.quickSwitch) {
                caap.reBind();
                general.GetEquippedStats();
            }

            // Buy quest requires popup
            var itemBuyPopUp = $j("form[id*='itemBuy']", caap.globalContainer), costToBuy = 0;

            if(bDisp !== 'none' && $u.hasContent(itemBuyPopUp)) {
                con.log(2, 'itemBuy');
                state.setItem('storeRetrieve', 'general');
                if(general.Select('BuyGeneral')) {
                    return true;
                }

                state.setItem('storeRetrieve', '');
                costToBuy = itemBuyPopUp.text().replace(new RegExp(".*\\$"), '').replace(new RegExp("[^\\d]{3,}.*"), '').parseInt();
                con.log(2, "costToBuy", costToBuy);
                if(caap.stats['gold']['cash'] < costToBuy) {
                    //Retrieving from Bank
                    if(caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
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
                if($u.hasContent(button)) {
                    con.log(1, 'Clicking on quick buy button.');
                    caap.click(button);
                    return true;
                }

                con.warn("Cant find buy button");
                return false;
            }
            button = caap.checkForImage('quick_buy_button.jpg');
            if(bDisp !== 'none' && $u.hasContent(button)) {
                con.log(2, 'quick_buy_button');
                state.setItem('storeRetrieve', 'general');
                if(general.Select('BuyGeneral')) {
                    return true;
                }

                state.setItem('storeRetrieve', '');
                costToBuy = $j("strong", button.parents("form").eq(0)).text().replace(new RegExp("[^0-9]", "g"), '');
                con.log(2, "costToBuy", costToBuy);
                if(caap.stats['gold']['cash'] < costToBuy) {
                    //Retrieving from Bank
                    if(caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0)) >= costToBuy) {
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
                name : '',
                click : $j(),
                tr : $j(),
                genDiv : $j(),
                orbCheck : false
            };
            autoQuestDivs = caap.checkResults_quests(true);
            //con.log(1, 'autoQuestDivs/autoQuestName', autoQuestDivs, autoQuestName);
            if(!autoQuestDivs.name) {
                con.log(1, 'Could not find AutoQuest.');
                caap.setDivContent('quest_mess', 'Could not find AutoQuest.');
                window.clearTimeout(caap.qtom);
                return false;
            }

            if(autoQuestDivs.name !== autoQuestName) {
                con.log(1, 'New AutoQuest found.');
                caap.setDivContent('quest_mess', 'New AutoQuest found.');
                window.clearTimeout(caap.qtom);
                return true;
            }

            // if found missing requires, click to buy
            if($u.hasContent(autoQuestDivs.tr)) {
                var background = $j("div[style*='background-color']", autoQuestDivs.tr);
                if($u.hasContent(background) && background.css("background-color") === 'rgb(158, 11, 15)') {
                    con.log(1, "Missing item");
                    if(config.getItem('QuestSubArea', 'Atlantis') === 'Atlantis') {
                        con.log(1, "Cant buy Atlantis items, stopping quest");
                        caap.manualAutoQuest();
                        return false;
                    }

                    con.log(2, "background.style.backgroundColor", background.css("background-color"));
                    state.setItem('storeRetrieve', 'general');
                    if(general.Select('BuyGeneral')) {
                        return true;
                    }

                    state.setItem('storeRetrieve', '');
                    con.log(2, "background.children().eq(0).children().eq(0).attr('title')", background.children().eq(0).children().eq(0).attr("title"));
                    if(background.children().eq(0).children().eq(0).attr("title")) {
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
            if(questGeneral === 'none' || config.getItem('ForceSubGeneral', false)) {
                if(general.Select('SubQuestGeneral')) {
                    return true;
                }
            } else if(questGeneral && questGeneral !== general.GetCurrent()) {
                if(general.LevelUpCheck("QuestGeneral")) {
                    if(general.Select('LevelUpGeneral')) {
                        return true;
                    }

                    con.log(2, 'Using level up general');
                } else {
                    if($u.hasContent(autoQuestDivs.genDiv)) {
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

            if($u.hasContent(autoQuestDivs.click)) {
                con.log(2, 'Clicking auto quest', autoQuestName);
                session.setItem('ReleaseControl', true);
                caap.click(autoQuestDivs.click);
                caap.showAutoQuest();
                if(autoQuestDivs.orbCheck) {
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
    questName : null,

    checkResults_symbolquests : function() {
        try {
            $j("div[id*='symbol_tab_symbolquests']", caap.appBodyDiv).unbind('click', caap.symbolquestsListener).bind('click', caap.symbolquestsListener);
            $j("form[id*='symbols_form_']", caap.appBodyDiv).unbind('click', caap.symbolquestsClickListener).bind('click', caap.symbolquestsClickListener);
            var demiDiv = $j("div[id*='symbol_desc_symbolquests']", caap.globalContainer), points = [], success = true;

            caap.blessingResults();
            if($u.hasContent(demiDiv) && demiDiv.length === 5) {
                demiDiv.each(function() {
                    var num = $u.setContent($j(this).children().next().eq(1).children().children().next().text(), '').trim().innerTrim().regex(/(\d+)/);
                    if($u.hasContent(num) && !$u.isNaN(num)) {
                        points.push(num);
                    } else {
                        success = false;
                        con.warn('Demi-Power text problem');
                    }
                });
                if(success) {
                    con.log(3, 'Demi-Power Points', points);
                    caap.demi['ambrosia']['power']['total'] = $u.setContent(points[0], 0);
                    caap.demi['malekus']['power']['total'] = $u.setContent(points[1], 0);
                    caap.demi['corvintheus']['power']['total'] = $u.setContent(points[2], 0);
                    caap.demi['aurora']['power']['total'] = $u.setContent(points[3], 0);
                    caap.demi['azeron']['power']['total'] = $u.setContent(points[4], 0);
                    schedule.setItem("symbolquests", ( gm ? gm.getItem("checkSymbolQuests", 24, hiddenVar) : 24) * 3600, 300);
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

    isBossQuest : function(name) {
        try {
            var qn = '', found = false;

            for(qn in caap.questAreaInfo) {
                if(caap.questAreaInfo.hasOwnProperty(qn)) {
                    if(caap.questAreaInfo[qn].boss && caap.questAreaInfo[qn].boss === name) {
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
    symbolquestsListener : function(event) {
        con.log(2, "Clicked Demi Power image", event.target.parentNode.parentNode.parentNode.parentNode.id);
        caap.setDomWaiting("symbolquests.php");
        caap.clearDomWaiting();
        caap.checkResults();
    },
    symbolquestsClickListener : function(event) {
        con.log(2, "Clicked Demi Power blessing", event.target.parentNode.id);
        caap.setDomWaiting("symbolquests.php");
        caap.blessingPerformed = true;
    },
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    checkResults_quests : function(pickQuestTF) {
        try {
            army.eliteCheckImg();
            //con.log(1, "checkResults_quests pickQuestTF", pickQuestTF);
            pickQuestTF = pickQuestTF ? pickQuestTF : false;
            if($u.hasContent($j("#" + caap.domain.id[caap.domain.which] + "quest_map_container", caap.globalContainer))) {
                $j("div[id*='meta_quest_']", caap.appBodyDiv).each(function(index) {
                    var row = $j(this);
                    if(!($u.hasContent($j("img[src*='_completed']", row)) || $u.hasContent($j("img[src*='_locked']", row)))) {
                        $j("div[id*='quest_wrapper_" + row.attr("id").replace(caap.domain.id[caap.domain.which] + "meta_quest_", '') + "']", caap.globalContainer).css("display", "block");
                    }
                });
            }

            if(config.getItem("enableTitles", true)) {
                spreadsheet.doTitles();
            }

            var whyQuest = config.getItem('WhyQuest', 'Manual');
            if(pickQuestTF === true && whyQuest !== 'Manual') {
                state.setItem('AutoQuest', caap.newAutoQuest());
            }

            var bestReward = 0, rewardRatio = 0, div = $j(), ssDiv = $j();

            if(caap.hasImage('demi_quest_on.gif')) {
                caap.checkResults_symbolquests($u.isString(pickQuestTF) ? pickQuestTF : undefined);
                ssDiv = $j("div[id*='symbol_displaysymbolquest']", caap.globalContainer);
                if(!$u.hasContent(ssDiv)) {
                    con.warn("Failed to find symbol_displaysymbolquest");
                }

                ssDiv.each(function() {
                    div = $j(this);
                    if(div.css("display") !== 'none') {
                        return false;
                    }

                    return true;
                });
            } else {
                div = caap.globalContainer;
            }
            ssDiv = $j(".quests_background,.quests_background_sub", div);
            if(!$u.hasContent(ssDiv)) {
                con.warn("Failed to find quests_background");
                return false;
            }

            var haveOrb = false, isTheArea = false, questSubArea = '';
            questSubArea = config.getItem('QuestSubArea', 'Land of Fire');
            isTheArea = caap.checkCurrentQuestArea(questSubArea);
            con.log(2, "Is quest area", questSubArea, isTheArea);
            if(isTheArea && whyQuest !== 'Manual' && config.getItem('GetOrbs', false)) {
                if($u.hasContent($j("input[alt='Perform Alchemy']"))) {
                    haveOrb = true;
                } else {
                    if(questSubArea && caap.questAreaInfo[questSubArea].orb) {
                        haveOrb = town.haveOrb(caap.questAreaInfo[questSubArea].orb);
                    }
                }

                con.log(2, "Have Orb for", questSubArea, haveOrb);
                if(haveOrb && caap.isBossQuest(state.getItem('AutoQuest', caap.newAutoQuest())['name'])) {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                }
            }

            /*
             * This subroutine call added as a stop-gap measure to allow CAAP to perform auto-quests even
             * when CA developers omit or duplicate the names for either main quests or sub-quests.
             */
            caap.updateQuestNames(ssDiv);

            var autoQuestDivs = {
                name : '',
                click : $j(),
                tr : $j(),
                genDiv : $j(),
                orbCheck : false
            };

            $j(".autoquest", caap.appBodyDiv).remove();
            var expRegExp = new RegExp("\\+(\\d+)"), energyRegExp = new RegExp("(\\d+)\\s+energy", "i"), moneyRegExp = new RegExp("\\$([0-9,]+)\\s*-\\s*\\$([0-9,]+)", "i"), money2RegExp = new RegExp("\\$([0-9,]+)mil\\s*-\\s*\\$([0-9,]+)mil", "i"), influenceRegExp = new RegExp("(\\d+)%");

            ssDiv.each(function() {
                div = $j(this);
                caap.questName = caap.getQuestName(div);
                if(!caap.questName) {
                    return true;
                }

                var reward = null, energy = null, experience = null, divTxt = '', expM = [], tStr = '';
                divTxt = div.text().trim().innerTrim();
                expM = divTxt ? divTxt.match(expRegExp) : [];
                if(expM && expM.length === 2) {
                    experience = expM[1] ? expM[1].numberOnly() : 0;
                } else {
                    var expObj = $j(".quest_experience", div);
                    if($u.hasContent(expObj)) {
                        tStr = expObj.text();
                        experience = tStr ? tStr.numberOnly() : 0;
                    } else {
                        con.warn("Can't find experience for", caap.questName);
                    }
                }

                var idx = caap.questName.indexOf('<br>');
                if(idx >= 0) {
                    caap.questName = caap.questName.substring(0, idx);
                }

                var energyM = divTxt.match(energyRegExp);
                if(energyM && energyM.length === 2) {
                    energy = energyM[1] ? energyM[1].numberOnly() : 0;
                } else {
                    var eObj = $j(".quest_req", div);
                    if($u.hasContent(eObj)) {
                        energy = $j('b', eObj).eq(0).text().numberOnly();
                    }
                }

                if(!energy) {
                    con.warn("Can't find energy for", caap.questName);
                    return true;
                }

                var moneyM = [], rewardLow = 0, rewardHigh = 0;
                moneyM = divTxt ? divTxt.stripHtmlJunk().match(moneyRegExp) : [];
                if(moneyM && moneyM.length === 3) {
                    rewardLow = moneyM[1] ? moneyM[1].numberOnly() : 0;
                    rewardHigh = moneyM[2] ? moneyM[2].numberOnly() : 0;
                    reward = (rewardLow + rewardHigh) / 2;
                } else {
                    moneyM = divTxt ? divTxt.stripHtmlJunk().match(money2RegExp) : [];
                    if(moneyM && moneyM.length === 3) {
                        rewardLow = moneyM[1] ? moneyM[1].numberOnly() * 1000000 : 0;
                        rewardHigh = moneyM[2] ? moneyM[2].numberOnly() * 1000000 : 0;
                        reward = (rewardLow + rewardHigh) / 2;
                    } else {
                        con.warn('No money found for', caap.questName, divTxt);
                    }
                }

                var click = $j("input[name='Do Quest']", div);
                if(!$u.hasContent(click)) {
                    con.warn('No button found for', caap.questName);
                    return true;
                }

                var influence = -1;
                if(caap.isBossQuest(caap.questName)) {
                    if($u.hasContent($j(".quests_background_sub", div))) {
                        //if boss and found sub quests
                        influence = 100;
                    } else {
                        influence = 0;
                    }
                } else {
                    var influenceList = divTxt.match(influenceRegExp);
                    if(influenceList && influenceList.length === 2) {
                        influence = influenceList[1] ? influenceList[1].parseInt() : 0;
                    } else {
                        con.warn("Influence div not found.", influenceList);
                    }
                }

                if(influence < 0) {
                    con.warn('No influence found for', caap.questName, divTxt);
                }

                var general = 'none', genDiv = $j();

                if(influence >= 0 && influence < 100) {
                    genDiv = $j(".quest_act_gen", div);
                    if($u.hasContent(genDiv)) {
                        genDiv = $j("img[src*='jpg']", genDiv);
                        if($u.hasContent(genDiv)) {
                            general = genDiv.attr("title");
                        }
                    }
                }

                switch (div.attr("class")) // determine quest type
                {
                	case 'quests_background_special' :
                		var questType = 'boss';
                		break;
                	case 'quests_background' :
                		if(caap.isExcavationQuest[caap.questName])
                		{
                			var questType = 'mine';
                		}
                		else
                		{
                			var questType = 'primary';
                		}
                		break;
                    default :
                    	var questType = 'subquest';
                }

                caap.labelQuests(div, energy, reward, experience, click);
                con.log(9, "QuestSubArea", questSubArea);
                if(isTheArea) {
                    if(questType === 'boss' && config.getItem('GetOrbs', false) && whyQuest !== 'Manual' && !haveOrb) {
                        caap.updateAutoQuest('name', caap.questName);
                        pickQuestTF = true;
                        autoQuestDivs.orbCheck = true;
                    }

                    if(questType === 'mine' && config.getItem('ExcavateMines', false) && whyQuest !== 'Manual' && influence < 100) {
                        caap.updateAutoQuest('name', caap.questName);
                        pickQuestTF = true;
                    }

                    switch (whyQuest) {
                        case 'Advancement' :
                            if(influence >= 0) {
                                if(!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && questType === 'primary' && influence < 100) {
                                    caap.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Influence' :
                            if(influence >= 0) {
                                if(!state.getItem('AutoQuest', caap.newAutoQuest())['name'] && questType !== 'mine' && influence < 100) {
                                    caap.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Experience' :
                            rewardRatio = (Math.floor(experience / energy * 100) / 100);
                            if(bestReward < rewardRatio && questType !== 'mine') {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        case 'Max Gold' :
                            rewardRatio = (Math.floor(reward / energy * 10) / 10);
                            if(bestReward < rewardRatio && questType !== 'mine') {
                                caap.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        default :
                    }

                    if(isTheArea && state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
                        bestReward = rewardRatio;
                        var expRatio = experience / ( energy ? energy : 1);
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
            if(pickQuestTF) {
                if(state.getItem('AutoQuest', caap.newAutoQuest())['name']) {
                    con.log(4, "return autoQuestDivs", autoQuestDivs);
                    caap.showAutoQuest();
                    return autoQuestDivs;
                }

                //if not find quest, probably you already maxed the subarea, try another area
                if((whyQuest === 'Max Influence' || whyQuest === 'Advancement') && config.getItem('switchQuestArea', true)) {
                    con.log(9, "QuestSubArea", questSubArea);
                    if(questSubArea && caap.questAreaInfo[questSubArea] && caap.questAreaInfo[questSubArea].next) {
                        questSubArea = config.setItem('QuestSubArea', caap.questAreaInfo[questSubArea].next);
                        if(caap.questAreaInfo[questSubArea].area && caap.questAreaInfo[questSubArea].list) {
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

    classToQuestArea : {
        'quests_stage_1' : 'Land of Fire',
        'quests_stage_2' : 'Land of Earth',
        'quests_stage_3' : 'Land of Mist',
        'quests_stage_4' : 'Land of Water',
        'quests_stage_5' : 'Demon Realm',
        'quests_stage_6' : 'Undead Realm',
        'quests_stage_7' : 'Underworld',
        'quests_stage_8' : 'Kingdom of Heaven',
        'quests_stage_9' : 'Ivory City',
        'quests_stage_10' : 'Earth II',
        'quests_stage_11' : 'Water II',
        'quests_stage_12' : 'Mist II',
        'quests_stage_13' : 'Mist III',
        'quests_stage_14' : 'Fire II',
        'quests_stage_15' : 'Pangaea',
        'quests_stage_16' : 'Perdition',
        'quests_stage_17' : 'Land of Fire III',
        'quests_stage_18' : 'Land of Earth III',
        'quests_stage_19' : 'Land of Mist IV',
        'quests_stage_20' : 'Land of Water III',
        'symbolquests_stage_1' : 'Ambrosia',
        'symbolquests_stage_2' : 'Malekus',
        'symbolquests_stage_3' : 'Corvintheus',
        'symbolquests_stage_4' : 'Aurora',
        'symbolquests_stage_5' : 'Azeron',
        'monster_quests_stage_1' : 'Atlantis'
    },

    checkCurrentQuestArea : function(QuestSubArea) {
        try {
            var found = false;

            if(caap.stats['level'] < 8) {
                if(caap.hasImage('quest_back_1.jpg')) {
                    found = true;
                }
            } else if(QuestSubArea && caap.questAreaInfo[QuestSubArea]) {
                if($u.hasContent($j("div[class='" + caap.questAreaInfo[QuestSubArea].clas + "']", caap.globalContainer))) {
                    found = true;
                }
            }

            return found;
        } catch (err) {
            con.error("ERROR in checkCurrentQuestArea: " + err);
            return false;
        }
    },

    getCurrentQuestArea : function()
    {
    	var mainDiv = $j('#main_bn');
    	if($u.hasContent(mainDiv))
    	{
        	var className = mainDiv.attr("class");
        	if($u.hasContent(className) && caap.classToQuestArea[className])
        	{
            	return caap.classToQuestArea[className];
        	}
    	}
    	return false;
	},

    /*jslint sub: false */

    getQuestName : function(questDiv) {
        try {
            var item_title = $j(".quest_desc,.quest_sub_title", questDiv), firstb = $j("b", item_title).eq(0), text = '';

            if(!$u.hasContent(item_title)) {
                con.log(2, "Can't find quest description or sub-title");
                return false;
            }
            text = item_title.html().trim().innerTrim();
            if(/LOCK/.test(text) || /boss_locked/.test(text)) {
                con.log(2, "Quest locked", text);
                return false;
            }

            if(!$u.hasContent(firstb)) {
                con.warn("Can't get bolded member out of", text);
                return false;
            }

            caap.questName = firstb.text().trim().innerTrim();
            if(!$u.hasContent(caap.questName)) {
                con.warn('No quest name for this row');
                return false;
            }

            return caap.questName;
        } catch (err) {
            con.error("ERROR in getQuestName: " + err);
            return false;
        }
    },

    /*
     * Below section of code added as a stop-gap measure to allow CAAP to perform auto-quests even
     * when CA developers omit or duplicate the names for either main quests or sub quests.
     */

	// this table is only for quest name corrections; however, if a quest area requires any
	// corrections at all, then all main/sub quest names must be listed here regardless;
	// because, the array index must match the element index from the HTML container. 
	questNameCorrections : { // note: indent subquests under main quests for readability
		'Mist III' : // this quest area had a duplicate name on a subquest
							['Tenvir Summit',
									 'Defeat Wolverines',
									 'Survey Area',
									 'Gather Supplies',
							 'Taubourne Falls',
									 'Find A Way Across',
									 'Repair Bridge',
									 'Cross the Falls',
							 'Hakkal Woods',
									 'Gather Samples',
									 'Hunt For Food',
									 'Prepare for Dark',
							 'Signs of the Scourge',
									 'Kill Slimes',
									 'Cast Poison Shield',
									 'Make Camp',
							 'The Green Haze',
									 'Dispatch Corrupted Soldiers',
									 'Kill Diseased Treants',
									 'Find Shelter From Haze',
							 'Sporeguard Revisited',
									 'Destroy Mushrooms',
									 'Eradicate Spores',
									 'Clear Haze',
							 'Death of a Forest',
									 'Gather Nature Essence',
									 'Gather Life Dust',
									 'Cast Regrowth',
							 'Calm Before the Storm',
									 'Walking in the Woods', // renamed
									 'Defeat Rock Elementals', // was duplicate
									 'Gather Earth Essence',
							 'The Life Temple',
									 'Investigate Temple',
									 'Collect Artifact Shards',
									 'Create Artifact Relic',
							 'The Life Altar',
									 'Use Artifact Relic',
									 'Unlock Altar',
									 'Destroy Scourge'
							],
		'Fire II' : // this quest area had a duplicate name on a main quest
							['Unlikely Alliance',
									'Counter Life Drain',
									'Test Her Power',
									'Defeat Sylvana',
							 'Bridge of Fire',
									'Destroy Fire Elementals',
									'Cross Lava Pools',
									'Avoid an Avalanche',
							 'River of Light',
									'Enchant Weapon',
									'Kill River Hydras',
									'Destroy Path',
							 'Karth',
									'Make Preparations',
									'Scout Karth',
									'Climb Wall',
							 'Nighttime Infiltration',
									'Find Shortcut',
									'Find Supplies',
									'Dispatch Patrol',
							 'Burning of Karth',
									'Defeat Paladin',
									'Capture Army',
									'Burn Barracks',
							 'Crossing the White Plains',
									'Avoid Patrols',
									'Move Supplies',
									'Make Camp',
							 'Prepare for Siege', // renamed
									'Plan Strategy',
									'Setup Siege',
									'Prepare for War',
							 'Siege on the Capital', // was duplicate
									'Don Armor',
									'Ride Down',
									'Confront Celesta',
							 'Energy Rift',
									'Cast Barrier',
									'Brace Yourself',
									'Confront Figure'
							],
		'Land of Earth III' : // this quest area had a duplicate name on a subquest
							['Battle Cultists',
									 'Interrogate',
									 'Gather Crystals',
									 'Free Prisoners',
							 'Dodge Wind Attacks!',
									 'Cast Earth Shield',
									 'Chase Assassin',
									 'Catch Breath',
							 'Cut A Path',
									 'Traverse River',
									 'Find Clues',
									 'Cure Snake Bite',
							 'Find Walkway',
									 'Battle Lizardman',
									 'Defeat Swamp Hags',
									 'Fight Troll',
							 'Calm Villagers',
									 'Gather Information',
									 'Heal Wounded Villagers', // renamed
									 'Repair Buildings',
							 'Follow Wreckage',
									 'Traverse Lava',
									 'Defeat Wild Apes',
									 'Scout Ahead',
							 'Stone Idols Attack',
									 'Defensive Position',
									 'Defeat Stone Guardians',
									 'Enter the Cradle',
							 'Research',
									 'Gorilla Ambush',
									 'Discover Artifacts',
									 'Loot Artifacts',
							 'Save Survivors',
									 'Distract Urmek',
									 'Retreat',
									 'Find Cover',
							 'Discover Empty Tomb',
									 'Heal Our Wounded', // renamed
									 'Build Morale',
									 'Plan Attack'
							],
		'Land of Mist IV' : // this quest area needed names for all subquests
							['Recovery',
		                     		'Give Army Leave',
		                     		'Rest at Home',
		                     		'Recall Army',
		                     'Desolate Pass',
		                     		'Mountain Ascent',
		                     		'Mist-filled Pass',
		                     		'Descent from the Pass',
		                     'Canyons of Borati',
		                     		'Explore Canyons',
		                     		'No one Around',
		                     		'Scout Ahead',
		                     'Surrounded',
		                     		'Cultists Approach',
		                     		'Wait and See',
		                     		'The Chant Begins',
		                     'Cassandra',
		                     		'The Chant Ceases',
		                     		'Cassandra Appears',
		                     		'Questions Asked',
		                     'Contemplation',
		                     		'No Harm Threatened',
		                     		'Cassandra Disappears',
		                     		'Cultists Leave',
		                     'Elyraels Stepstones',
		                     		'Secure the Area',
		                     		'Bury the Dead',
		                     		'Break Camp',
		                     'The Floating City',
		                     		'Enter the City',
		                     		'Admire the Architecture',
		                     		'Meet the Griffin Legions',
		                     'Griffin Legions',
		                     		'War Council Called',
		                     		'Battle Planning',
		                     		'Leaders Assigned',
		                     'Taking Flight',
		                     		'The Hunt Begins',
		                     		'Wings in Formation',
		                     		'Falcons Recon Ahead'
		                    ],
		'end-of-table' : []
	},

    updateQuestNames : function(qc)
    {
    	var qa = caap.getCurrentQuestArea();
    	if(caap.questNameCorrections[qa])
    	{
    		var qnc = caap.questNameCorrections[qa];
    		qc.each(function(idx, ele)
    		{
                var ttl = $j(".quest_desc,.quest_sub_title", ele), firstb = $j("b", ttl).eq(0);
            	firstb[0].innerHTML = qnc[idx];
    		});
    	}
    	return;
    },

    /*
     * Above section of code added as a stop-gap measure to allow CAAP to perform auto-quests even
     * when CA developers omit or duplicate the names for either main quests or sub quests.
     */

    /*------------------------------------------------------------------------------------\
     checkEnergy gets passed the default energy requirement plus the condition text from
     the 'Whenxxxxx' setting and the message div name.
     \------------------------------------------------------------------------------------*/
    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    checkEnergy : function(energy, condition, msgdiv) {
        try {
            if(!caap.stats['energy'] || !energy) {
                return false;
            }

            if(condition === 'Energy Available' || condition === 'Not Fortifying') {
                if(caap.stats['energy']['num'] >= energy) {
                    return true;
                }

                if(msgdiv) {
                    if(msgdiv === "quest_mess") {
                        window.clearTimeout(caap.qtom);
                    }

                    caap.setDivContent(msgdiv, 'Waiting for more energy: ' + caap.stats['energy']['num'] + "/" + ( energy ? energy : ""));
                }
            } else if(condition === 'At X Energy') {
                if(caap.inLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                    if(msgdiv) {
                        if(msgdiv === "quest_mess") {
                            window.clearTimeout(caap.qtom);
                        }

                        caap.setDivContent(msgdiv, 'Burning all energy to level up');
                    }

                    return true;
                }

                var whichEnergy = config.getItem('XQuestEnergy', 1);
                if(caap.stats['energy']['num'] >= whichEnergy) {
                    state.setItem('AtXQuestEnergy', true);
                }

                if(caap.stats['energy']['num'] >= energy) {
                    if(state.getItem('AtXQuestEnergy', false) && caap.stats['energy']['num'] >= config.getItem('XMinQuestEnergy', 0)) {
                        if(msgdiv) {
                            if(msgdiv === "quest_mess") {
                                window.clearTimeout(caap.qtom);
                            }

                            caap.setDivContent(msgdiv, 'At X energy. Burning to ' + config.getItem('XMinQuestEnergy', 0));
                        }

                        return true;
                    } else {
                        state.setItem('AtXQuestEnergy', false);
                    }
                }

                if(energy > whichEnergy) {
                    whichEnergy = energy;
                }

                if(msgdiv) {
                    if(msgdiv === "quest_mess") {
                        window.clearTimeout(caap.qtom);
                    }

                    caap.setDivContent(msgdiv, 'Waiting for X energy: ' + caap.stats['energy']['num'] + "/" + whichEnergy);
                }
            } else if(condition === 'At Max Energy') {
                var maxIdleEnergy = caap.stats['energy']['max'], theGeneral = config.getItem('IdleGeneral', 'Use Current');

                if(theGeneral !== 'Use Current') {
                    maxIdleEnergy = general.GetEnergyMax(theGeneral);
                }

                if(theGeneral !== 'Use Current' && !maxIdleEnergy) {
                    con.log(2, "Changing to idle general to get Max energy");
                    if(general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                if(caap.stats['energy']['num'] >= maxIdleEnergy) {
                    return true;
                }

                if(caap.inLevelUpMode() && caap.stats['energy']['num'] >= energy) {
                    if(msgdiv) {
                        if(msgdiv === "quest_mess") {
                            window.clearTimeout(caap.qtom);
                        }

                        con.log(1, "Burning all energy to level up");
                        caap.setDivContent(msgdiv, 'Burning all energy to level up');
                    }

                    return true;
                }

                if(msgdiv) {
                    if(msgdiv === "quest_mess") {
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
    labelListener : function(e) {
        try {
            var sps = e.target.getElementsByTagName('span'), mainDiv = $j("#" + caap.domain.id[caap.domain.which] + "main_bn", caap.globalContainer), className = '', tempAutoQuest = {};

            if(sps.length <= 0) {
                throw 'what did we click on?';
            }
            tempAutoQuest = caap.newAutoQuest();
            tempAutoQuest['name'] = sps[0].innerHTML;
            tempAutoQuest['energy'] = sps[1].innerHTML.parseInt();
            //tempAutoQuest['general'] = general;
            //tempAutoQuest['expRatio'] = expRatio;

            caap.manualAutoQuest(tempAutoQuest);
            con.log(5, 'labelListener', sps, state.getItem('AutoQuest'));
            if(caap.stats['level'] < 8 && caap.hasImage('quest_back_1.jpg')) {
                config.setItem('QuestArea', 'Quest');
                config.setItem('QuestSubArea', 'Land of Fire');
            } else {
                if(caap.hasImage('tab_quest_on.gif')) {
                    config.setItem('QuestArea', 'Quest');
                    caap.selectDropOption('QuestArea', 'Quest');
                    caap.changeDropDownList('QuestSubArea', caap.landQuestList);
                } else if(caap.hasImage('demi_quest_on.gif')) {
                    config.setItem('QuestArea', 'Demi Quests');
                    caap.selectDropOption('QuestArea', 'Demi Quests');
                    caap.changeDropDownList('QuestSubArea', caap.demiQuestList);
                } else if(caap.hasImage('tab_atlantis_on.gif')) {
                    config.setItem('QuestArea', 'Atlantis');
                    caap.selectDropOption('QuestArea', 'Atlantis');
                    caap.changeDropDownList('QuestSubArea', caap.atlantisQuestList);
                }

                if($u.hasContent(mainDiv)) {
                    className = mainDiv.attr("class");
                    if($u.hasContent(className) && caap.classToQuestArea[className]) {
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
    labelQuests : function(div, energy, reward, experience, click) {
        try {
            if($u.hasContent($j("div[class='autoquest']", div))) {
                return;
            }

            var newdiv = {};
            newdiv = document.createElement('div');
            newdiv.className = 'autoquest';
            newdiv.style.fontSize = '10px';
            newdiv.innerHTML = "$ per energy: " + (Math.floor(reward / energy * 10) / 10) + "<br />Exp per energy: " + (Math.floor(experience / energy * 100) / 100) + "<br />";

            if(state.getItem('AutoQuest', caap.newAutoQuest())['name'] === caap.questName) {
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

    deityTable : {
        'energy' : 1,
        'attack' : 2,
        'defense' : 3,
        'health' : 4,
        'stamina' : 5
    },
    /*jslint sub: false */

    blessingPerformed : false,

    blessingResults : function() {
        try {
            var hours = 0, minutes = 0, done = false;

            if(caap.blessingPerformed) {
                if(/Please come back in:/i.test(caap.resultsText)) {
                    // Check time until next Oracle Blessing
                    hours = $u.setContent(caap.resultsText.regex(/(\d+) hour/i), 3);
                    minutes = $u.setContent(caap.resultsText.regex(/(\d+) minute/i), 0);
                    done = true;
                } else if(/You have paid tribute to/i.test(caap.resultsText)) {
                    // Recieved Demi Blessing.  Wait X hours to try again.
                    hours = /Azeron/i.test(caap.resultsText) ? 48 : 24;
                    done = true;
                } else {
                    if($u.hasContent(caap.resultsText)) {
                        con.warn("Unknown blessing result text", caap.resultsText);
                    }
                }

                if(done) {
                    con.log(2, 'Recorded Blessing Time. Scheduling next click! ' + hours + ':' + minutes.lpad("0", 2));
                    schedule.setItem('BlessingTimer', (hours * 60 + minutes + 5) * 60, 300);
                }

                caap.blessingPerformed = false;
            }
        } catch (err) {
            con.error("ERROR in blessingResults: " + err);
        }
    },
    autoBlessSelection : function() {
		var autoBless = config.getItem('AutoBless', 'none');
		if (autoBless.match('Auto Upgrade')) {
			try {
				var startAtt = 0, stopAtt = 4, attribute = '', attrName = '', attrValue = 0, attrAdjustNew = 0, attrCurrent = 0,
					level = 0, energy = 0, stamina = 0, attack = 0, defense = 0, health = 0;

				if(config.getItem("AutoStatAdv", false)) {
					startAtt = 5;
					stopAtt = 9;
				}
				energy = caap.stats['energy']['max'];
				stamina = caap.stats['stamina']['max'];
				attack = caap.stats['attack'];
				defense = caap.stats['defense'];
				health = caap.stats['health']['max'];
				level = caap.stats['level'];

				for( n = startAtt; n <= stopAtt; n += 1) {
					attrName = 'Attribute' + n;
					attribute = config.getItem(attrName, '');
					if(attribute === '') {
						con.log(4, attrName + " is blank: continue");
						continue;
					}
					

					if(caap.stats['level'] < 10) {
						if(attribute === 'Attack' || attribute === 'Defense' || attribute === 'Health') {
							con.log(1, "Characters below level 10 can not increase Attack, Defense or Health: continue");
							continue;
						}
					}
					attrValue = config.getItem('AttrValue' + n, 0);
					attribute = attribute.toLowerCase();
					switch (attribute) {
						case 'energy' :
							attrCurrent = energy;
							break;
						case 'stamina' :
							attrCurrent = stamina;
							break;
						case 'attack' :
							attrCurrent = attack;
							break;
						case 'defense' :
							attrCurrent = defense;
							break;
						case 'health' :
							attrCurrent = health;
							break;
						default :
							throw "Unable to match attribute: " + attribute;
					}
					
					if(config.getItem('AutoStatAdv', false)) {
						attrAdjustNew = eval(attrValue);
					} else {
						attrAdjustNew = attrValue;
					}
					if (attrAdjustNew > attrCurrent) {
						return attribute;
					}
				}
				return 'attack';
			} catch (err) {
				con.error("ERROR in autoBlessSelection: " + err);
				return 'none';
			}
		} else {
			return autoBless;
		}
    },
    autoBless : function() {
        try {
            if(caap.blessingPerformed) {
                return true;
            }

            //var autoBless = config.getItem('AutoBless', 'none');
			var autoBless = caap.autoBlessSelection(),			
				autoBlessN = caap.deityTable[autoBless.toLowerCase()], 
				picSlice = $j(), 
				descSlice = $j();
			
			
            if(!$u.hasContent(autoBlessN) || !schedule.check('BlessingTimer')) {
                return false;
            }

            if(caap.navigateTo('quests,demi_quest_off', 'demi_quest_bless')) {
                return true;
            }
            picSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_image_symbolquests" + autoBlessN, caap.appBodyDiv);
            if(!$u.hasContent(picSlice)) {
                con.warn('No diety image for', autoBless);
                return false;
            }
            descSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbol_desc_symbolquests" + autoBlessN, caap.appBodyDiv);
            if(!$u.hasContent(descSlice)) {
                con.warn('No diety description for', autoBless);
                return false;
            }

            if(descSlice.css('display') === 'none') {
                return caap.navigateTo(picSlice.attr("src").basename());
            }
            picSlice = $j("#" + caap.domain.id[caap.domain.which] + "symbols_form_" + autoBlessN + " input[name='symbolsubmit']", descSlice);
            if(!$u.hasContent(picSlice)) {
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

    checkResults_festival_tower : function() {
        try {
            return true;
        } catch (err) {
            con.error("ERROR in checkResults_festival_tower: " + err);
            return false;
        }
    },
    festivalBlessTable : {
        'attack' : 'defense',
        'defense' : 'energy',
        'energy' : 'stamina',
        'stamina' : 'health',
        'health' : 'army',
        'army' : 'attack'
    },

    festivalBlessGeneral : {
        'attack' : 'DuelGeneral',
        'defense' : 'FortifyGeneral',
        'energy' : 'IdleGeneral',
        'stamina' : 'IdleGeneral',
        'health' : 'IdleGeneral',
        'army' : 'InvadeGeneral'
    },
    /*jslint sub: false */

    festivalBlessResults : function() {
        try {
            var hours = 0, minutes = 0, tDiv = $j(), txt = '', autoBless = config.getItem('festivalBless', 'None');

            if(autoBless !== 'None') {
                tDiv = $j("div[style*='festival_feats_bottom.jpg']", caap.globalContainer);
                txt = $u.setContent(tDiv.text(), '').trim().innerTrim().regex(/(\d+:\d+)/);
                if($u.hasContent(txt)) {
                    // Check time until next Festival Blessing
                    hours = $u.setContent(txt.regex(/(\d+):/), 0);
                    minutes = $u.setContent(txt.regex(/:(\d+)/), 30);
                    con.log(2, 'Recorded Festival Blessing Time. Scheduling next click! ' + hours + ':' + minutes.lpad("0", 2));
                    schedule.setItem('festivalBlessTimer', (hours * 60 + minutes + 5) * 60, 300);
                }
                tDiv = $j("div[style*='festival_victory_popup.jpg']", caap.globalContainer);
                if($u.hasContent(tDiv)) {
                    con.log(1, "Festival Feat Victory!");
                } else {
                    tDiv = $j("div[style*='festival_defeat_popup.jpg']", caap.globalContainer);
                    if($u.hasContent(tDiv)) {
                        con.log(1, "Festival Feat Defeat!");
                        $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                    }
                }
            }
        } catch (err) {
            con.error("ERROR in festivalBlessResults: " + err);
        }
    },
            festivalBless : function() {
            try {
                var autoBless = config.getItem('festivalBless', 'None'), capPic, tgeneral, luGeneral, picSlice, txt;
             
             if(autoBless === 'None' || !schedule.check('festivalBlessTimer')) {
                    return false;
                }
             if (autoBless==='All')
             {
                var atkFeat = [50,100,150,200,280,375,510,725],
                   defFeat = [50,100,150,200,280,375,510,725],
                   heaFeat = [125,150,200,250,300,375,440,500],
                   eneFeat = [50,100,150,200,280,375,510,725],
                   staFeat = [25,50,75,100,140,180,255,360],
                   armFeat = [50,100,200,400,600,800,1000,1200],
                   default_bless = 'All';
                if (caap.stats['achievements']['feats']['attack']<8) {
                   if (caap.stats['attack']>= atkFeat[caap.stats['achievements']['feats']['attack']]) {
                      autoBless = 'Attack';
                   }
				   default_bless = 'Attack';
                }
                if (caap.stats['achievements']['feats']['defense']<8) {
                   if (caap.stats['defense']>= defFeat[caap.stats['achievements']['feats']['defense']]) {
                      autoBless = 'Defense';
                   }
				   default_bless = default_bless === 'All' ? 'Defense' : default_bless;
                }
                if (caap.stats['achievements']['feats']['health']<8) {
                   if (caap.stats['health']['max']>= heaFeat[caap.stats['achievements']['feats']['health']]) {
                      autoBless = 'Health';
                   }
				   default_bless = default_bless === 'All' ? 'Health' : default_bless;
                }
                if (caap.stats['achievements']['feats']['energy']<8) {
                   if (caap.stats['energy']['max']>= eneFeat[caap.stats['achievements']['feats']['energy']]) {
                      autoBless = 'Energy';
                   }
				   default_bless = default_bless === 'All' ? 'Energy' : default_bless;
                }
                if (caap.stats['achievements']['feats']['stamina']<8) {
                   if (caap.stats['stamina']['max']>= staFeat[caap.stats['achievements']['feats']['stamina']]) {
                      autoBless = 'Stamina';
                   }
				   default_bless = default_bless === 'All' ? 'Stamina' : default_bless;
                }
                if (caap.stats['achievements']['feats']['army']<8) {
                   if (caap.stats['army']['actual']>= armFeat[caap.stats['achievements']['feats']['army']]) {
                      autoBless = 'Army';
                   }
				   default_bless = default_bless === 'All' ? 'Army' : default_bless;
                }
                
                if(autoBless === 'All') {
				   autoBless = default_bless !== 'All' ? default_bless : 'Attack' ;
                }
             }
             
             capPic = 'festival_capsule_' + autoBless.toLowerCase() + '.gif';
             tgeneral = caap.festivalBlessGeneral[autoBless.toLowerCase()];
             luGeneral = config.getItem('LevelUpGeneral', 'Use Current');
             picSlice = $j();
             txt = '';

                tgeneral = tgeneral === 'IdleGeneral' ? (luGeneral !== 'Use Current' ? 'LevelUpGeneral' : tgeneral) : tgeneral;
                if(general.Select(tgeneral)) {
                    return true;
                }

                if(caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav,' + capPic, 'festival_feats_bottom.jpg')) {
                    return true;
                }
                txt = $u.setContent($j("div[style*='festival_feats_middle.jpg'] strong", caap.appBodyDiv).text(), '').trim().innerTrim();
                if(/Mastered/i.test(txt)) {
                    con.log(1, 'Area Completed!', autoBless);
                    $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }

                if(!new RegExp(autoBless).test(txt)) {
                    con.warn('No match for text', autoBless);
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }
                picSlice = $j("img[src*='festival_feat_completedbutton.jpg']", caap.appBodyDiv);
                if($u.hasContent(picSlice)) {
                    con.log(1, 'Area Completed!', autoBless);
                    $j("#caap_festivalBless", caap.caapDivObject).val(config.setItem('festivalBless', caap.festivalBlessTable[autoBless.toLowerCase()].ucFirst()));
                    caap.navigateTo('soldiers,tab_festival_off.jpg,festival_feat_nav');
                    return false;
                }
                picSlice = $j("input[src*='festival_feat_testbutton.jpg']", caap.appBodyDiv);
                if(!$u.hasContent(picSlice)) {
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

    checkResults_festival_duel_home : function() {
        var followerDiv = $j("#follower_list div", caap.appBodyDiv), followers = [], nfollowers = [], a = army.getIdList(), crossList = function(uid) {
            return !followers.hasIndexOf(uid);
        };

        followerDiv.each(function() {
            var uid = $u.setContent($j(this).children().eq(0).attr("uid"), "").parseInt();
            if(uid) {
                followers.push(uid);
            }
        });
        nfollowers = a.filter(crossList);
        session.setItem("followers", followers);
        session.setItem("nfollowers", nfollowers);
        sessionStorage.setItem("caap_nfollowers", JSON.stringify(nfollowers));
        con.log(1, "followers/non", followers, nfollowers);
    },
    ajax_festival_duel_home : function() {
        function onError(XMLHttpRequest, textStatus, errorThrown) {
            con.error("ajax_festival_duel_home", textStatus);
        }

        function onSuccess(data, textStatus, XMLHttpRequest) {
            var followerDiv = $j("#follower_list div", data), followers = [], nfollowers = [], a = army.getIdList(), crossList = function(uid) {
                return !followers.hasIndexOf(uid);
            };

            followerDiv.each(function() {
                var uid = $u.setContent($j(this).children().eq(0).attr("uid"), "").parseInt();
                if(uid) {
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
    landRecord : function() {
        this.data = {
            'row' : $j(),
            'name' : '',
            'income' : 0,
            'cost' : 0,
            'totalCost' : 0,
            'owned' : 0,
            'maxAllowed' : 0,
            'buy' : 0,
            'roi' : 0,
            'set' : 0,
            'last' : 0
        };
    },
    /*jslint sub: false */

    bestLand : {},

    sellLand : {},

    /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    checkResults_land : function() {
        try {
            var ssDiv = $j("div[style*='town_land_bar']", caap.appBodyDiv), bestLandCost = {};

            if(!$u.hasContent(ssDiv)) {
                con.warn("Can't find town_land_bar.jpg");
                return false;
            }

            caap.bestLand = state.setItem('BestLandCost', new caap.landRecord().data);
            caap.sellLand = {};

            function selectLands(div, val, type) {
                try {
                    type = type ? type : 'Buy';
                    var selects = $j("select", div);
                    if(!$u.hasContent(selects)) {
                        con.warn(type + " select not found!");
                        return false;
                    }

                    if(type === "Buy") {
                        if(selects.length === 2) {
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


            ssDiv.each(function() {
                var row = $j(this), strongs = $j("strong", row), name = '', income = 0, cost = 0, tStr = '', maxAllowed = 0, owned = 0, s = 0, roi = 0, selection = [1, 5, 10], land = new caap.landRecord();

                if(!$u.hasContent(row)) {
                    return true;
                }

                selectLands(row, 10);
                if(!$u.hasContent(strongs) || strongs.length !== 3) {
                    con.warn("Can't find strongs", strongs.length);
                    return true;
                }
                name = strongs.eq(0).text().trim();
                if(!$u.hasContent(name)) {
                    con.warn("Can't find land name");
                    return true;
                }
                income = strongs.eq(1).text().trim().numberOnly();
                if(!$u.hasContent(income)) {
                    con.warn("Can't find land income");
                    return true;
                }
                cost = strongs.eq(2).text().trim().numberOnly();
                if(!$u.hasContent(cost)) {
                    con.warn("Can't find land cost");
                    return true;
                }

                // Lets get our max allowed from the land_buy_info div
                tStr = row.text().trim().innerTrim();
                if(!$u.hasContent(tStr)) {
                    con.warn("Can't find land text");
                    return true;
                }
                maxAllowed = tStr.regex(/Max Allowed For your level: (\d+)/);
                if(!$u.hasContent(maxAllowed)) {
                    con.warn("Can't find land maxAllowed");
                    return true;
                }
                owned = tStr.regex(/Owned: (\d+)/);
                if(!$u.hasContent(owned)) {
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
                if(!$u.hasContent($j("input[name='Buy']", row))) {
                    roi = 0;
                    // If we own more than allowed we will set land and selection
                    for( s = 2; s >= 0; s -= 1) {
                        if(land.data['owned'] - land.data['maxAllowed'] >= selection[s]) {
                            caap.sellLand = land.data;
                            selectLands(row, selection[s], 'Sell');
                            break;
                        }
                    }
                }

                land.data['roi'] = $u.setContent(roi, 0);
                strongs.eq(0).text(name + " | " + land.data['roi'] + "% per day.");
                con.log(4, "Land:", land.data['name']);
                if(land.data['roi'] > 0 && land.data['roi'] > caap.bestLand['roi']) {
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
    noLandsLog : true,

    lands : function() {
        try {
            if(!config.getItem('autoBuyLand', false)) {
                return false;
            }

            var bestLandCost = {}, cashTotAvail = 0, cashNeed = 0, theGeneral = '';

            function buySellLand(land, type) {
                try {
                    type = type ? type : 'Buy';
                    var button = $j("input[name='" + type + "']", land['row']);
                    if($u.hasContent(button)) {
                        if(type === 'Buy') {
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
            if(!$j.isEmptyObject(caap.sellLand) && config.getItem('SellLands', false)) {
                con.log(2, "Selling land", caap.sellLand['name']);
                buySellLand(caap.sellLand, 'Sell');
                return true;
            }
            bestLandCost = state.getItem('BestLandCost', new caap.landRecord().data);
            if(!bestLandCost['set']) {
                con.log(2, "Going to land to get Best Land Cost");
                if(caap.navigateTo('soldiers,land', caap.hasImage('tab_land_on.gif') ? '' : 'tab_land_on.gif')) {
                    return true;
                }
            }

            if(bestLandCost['cost'] === 0) {
                if(caap.noLandsLog) {
                    con.log(2, "No lands to purchase");
                    caap.noLandsLog = false;
                }

                return false;
            }

            if(!caap.stats['gold']['bank'] && caap.stats['gold']['bank'] !== 0) {
                con.log(2, "Going to keep to get Stored Value");
                if(caap.navigateTo('keep')) {
                    return true;
                }
            }

            // Retrieving from Bank
            cashTotAvail = caap.stats['gold']['cash'] + (caap.stats['gold']['bank'] - config.getItem('minInStore', 0));
            cashNeed = bestLandCost['buy'] * bestLandCost['cost'];
            theGeneral = config.getItem('IdleGeneral', 'Use Current');
            if((cashTotAvail >= cashNeed) && (caap.stats['gold']['cash'] < cashNeed)) {
                if(theGeneral !== 'Use Current') {
                    con.log(2, "Changing to idle general");
                    if(general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                con.log(2, "Trying to retrieve", cashNeed - caap.stats['gold']['cash']);
                return caap.retrieveFromBank(cashNeed - caap.stats['gold']['cash']);
            }

            // Need to check for enough moneys + do we have enough of the builton type that we already own.
            if(bestLandCost['cost'] && caap.stats['gold']['cash'] >= cashNeed) {
                if(theGeneral !== 'Use Current') {
                    con.log(2, "Changing to idle general");
                    if(general.Select('IdleGeneral')) {
                        return true;
                    }
                }

                caap.navigateTo('soldiers,land');
                if(caap.hasImage('tab_land_on.gif')) {
                    if(bestLandCost['buy']) {
                        con.log(2, "Buying land", caap.bestLand['name']);
                        if(buySellLand(caap.bestLand)) {
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

    checkKeep : function() {
        try {
            if(!schedule.check("keep")) {
                return false;
            }

            con.log(2, 'Visiting keep to get stats');
            return caap.navigateTo('keep', 'tab_stats_on.gif');
        } catch (err) {
            con.error("ERROR in checkKeep: " + err);
            return false;
        }
    },
    checkOracle : function() {
        try {
            if(!schedule.check("oracle")) {
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
    checkBattleRank : function() {
        try {
            if(!schedule.check("battlerank") || caap.stats['level'] < 8) {
                return false;
            }

            con.log(2, 'Visiting Battle Rank to get stats');
            return caap.navigateTo('battle,battlerank', 'tab_battle_rank_on.gif');
        } catch (err) {
            con.error("ERROR in checkBattleRank: " + err);
            return false;
        }
    },
    checkWarRank : function() {
        try {
            if(!schedule.check("warrank") || caap.stats['level'] < 100) {
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

    checkGenerals : function() {
        try {
            if(!schedule.check("generals")) {
                return false;
            }

            con.log(2, "Visiting generals to get 'General' list");
            return caap.navigateTo('mercenary,generals', 'tab_generals_on.gif');
        } catch (err) {
            con.error("ERROR in checkGenerals: " + err);
            return false;
        }
    },
    checkAllGenerals : function() {
        try {
            if(!schedule.check("allGenerals")) {
                return false;
            }

            return general.GetAllStats();
        } catch (err) {
            con.error("ERROR in checkAllGenerals: " + err);
            return false;
        }
    },
    checkSoldiers : function() {
        try {
            if(!schedule.check("soldiers")) {
                return false;
            }

            con.log(2, "Checking Soldiers");
            return caap.navigateTo('soldiers', 'tab_soldiers_on.gif');
        } catch (err) {
            con.error("ERROR in checkSoldiers: " + err);
            return false;
        }
    },
    checkItem : function() {
        try {
            if(!schedule.check("item")) {
                return false;
            }

            con.log(2, "Checking Item");
            return caap.navigateTo('soldiers,item', 'tab_black_smith_on.gif');
        } catch (err) {
            con.error("ERROR in checkItem: " + err);
            return false;
        }
    },
    checkMagic : function() {
        try {
            if(!schedule.check("magic")) {
                return false;
            }

            con.log(2, "Checking Magic");
            return caap.navigateTo('soldiers,magic', 'tab_magic_on.gif');
        } catch (err) {
            con.error("ERROR in checkMagic: " + err);
            return false;
        }
    },
    checkAchievements : function() {
        try {
            if(!schedule.check("achievements")) {
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
    checkSymbolQuests : function() {
        try {
            if(!schedule.check("symbolquests") || caap.stats['level'] < 8) {
                return false;
            }

            con.log(2, "Visiting symbolquests to get 'Demi-Power' points");
            return caap.navigateTo('quests,symbolquests', 'demi_quest_on.gif');
        } catch (err) {
            con.error("ERROR in checkSymbolQuests: " + err);
            return false;
        }
    },
    checkCharacterClasses : function() {
        try {
            if(!schedule.check("characterClasses") || caap.stats['level'] < 100) {
                return false;
            }

            con.log(2, "Checking Monster Class to get Character Class Stats");
            return caap.navigateTo('keep,battle_monster,view_class_progress', 'nm_class_whole_progress_bar.jpg');
        } catch (err) {
            con.error("ERROR in checkCharacterClasses: " + err);
            return false;
        }
    },
    checkArmy : function() {
        try {
            if(!config.getItem("EnableArmy", true) || !schedule.check("army_member")) {
                return false;
            }

            return army.run();
        } catch (err) {
            con.error("ERROR in checkArmy: " + err);
            return false;
        }
    },
    /*jslint sub: false */

    checkGift : function() {
        try {
            if(!schedule.check("gift")) {
                return false;
            }

            con.log(2, "Checking Gift");
            return caap.navigateTo('army,gift', 'tab_gifts_on.gif');
        } catch (err) {
            con.error("ERROR in checkGift: " + err);
            return false;
        }
    },
    ajaxCheckFeed : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('feedMonsterFinder', false) || !schedule.check("feedMonsterFinder")) {
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
    ajaxCheckGuild : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('guildMonsterFinder', false) || !schedule.check("guildMonsterFinder")) {
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
    ajaxCheckPublic1 : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder1', false) || !schedule.check("publicMonsterFinder1")) {
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
    ajaxCheckPublic2 : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder2', false) || !schedule.check("publicMonsterFinder2")) {
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
    ajaxCheckPublic3 : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('publicMonsterFinder3', false) || !schedule.check("publicMonsterFinder3")) {
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
    feedScan : function() {
        try {
            if(!config.getItem('enableMonsterFinder', false) || !config.getItem('feedScan', false) || state.getItem("feedScanDone", false)) {
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
    //                          CONQUEST EVENTS
    /////////////////////////////////////////////////////////////////////
    collectConquest : function() {
        try {
            if(!config.getItem('doConquestCollect', false) || !schedule.check('collectConquestTimer')) {
                return false;
            }
            caap.navigateTo('guildv2_conquest_command');

            return true;
        } catch (err) {
            con.error("ERROR in collectConquest: " + err);
            return false;
        }
    },
    collectConquestCrystal1 : function() {
        try {
            if(!config.getItem('doConquestCrystalCollect1', false) || !schedule.check('collectConquestCrystal1Timer')) {
                return false;
            }
            var link = "guildv2_conquest_expansion_fort.php?guild_id=" + caap.stats['guild']['id'] + "&slot=1001";
            caap.clickAjaxLinkSend(link, 1000);
            return true;
        } catch (err) {
            con.error("ERROR in collectConquest: " + err);
            return false;
        }
    },
    collectConquestCrystal2 : function() {
        try {
            if(!config.getItem('doConquestCrystalCollect2', false) || !schedule.check('collectConquestCrystal2Timer')) {
                return false;
            }
            var link = "guildv2_conquest_expansion_fort.php?guild_id=" + caap.stats['guild']['id'] + "&slot=1002";
            caap.clickAjaxLinkSend(link, 1000);
            return true;
        } catch (err) {
            con.error("ERROR in collectConquestCrystal: " + err);
            return false;
        }
    },
    checkResults_conquest : function() {
        conquest.collect();
    },
    checkResults_conquestLand : function() {
        conquest.land();
    },
    checkResults_conquestLand2 : function() {
        conquest.crystal();
    }
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

};

/* This section is added to allow Advanced Optimisation by the Closure Compiler */
/*jslint sub: true */
//window['caap'] = true; // sets caap to boolean should (must?) be object // 2011-09-27 CAGE
/*
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
 caap['checkResults_keep'] = caap.checkResults_keep`;
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
 */
/*jslint sub: false */
