   ////////////////////////////////////////////////////////////////////
    //                          gifting OBJECT
    // this is the main object for dealing with gifting
    /////////////////////////////////////////////////////////////////////

    gifting = {
        extraList: ['Recruiting', 'Sephora', 'Valiant', "Festivus Sword", "Valhalla", "Monster", "Elite", "Guild"],

        cachedGiftEntry: {},

        types: ["gifts", "queue", "history"],

        load: function (type) {
            try {
                if (!$u.isString(type) || type === '' || !gifting.types.hasIndexOf(type))  {
                    con.warn("Type passed to load: ", type);
                    throw "Invalid type value!";
                }

                gifting[type].records = gm.getItem("gifting." + type, 'default');
                if (gifting[type].records === 'default' || !$j.isArray(gifting[type].records)) {
                    gifting[type].records = gm.setItem("gifting." + type, []);
                }

                gifting[type].hbest = gifting[type].hbest === false ? JSON.hbest(gifting[type].records) : gifting[type].hbest;
                con.log(3, "gifting." + type + " Hbest", gifting[type].hbest);
                con.log(3, "gifting.load", type, gifting[type].records);
                session.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
                return true;
            } catch (err) {
                con.error("ERROR in gifting.load: " + err);
                return false;
            }
        },

        save: function (type, src) {
            try {
                if (!$u.isString(type) || type === '' || !gifting.types.hasIndexOf(type))  {
                    con.warn("Type passed to load: ", type);
                    throw "Invalid type value!";
                }

                var compress = false;
                if (caap.domain.which === 3) {
                    if (type === "queue") {
                        caap.setGiftQueue();
                    } else if (type === "queue") {
                        caap.setGiftHistory();
                    }

                    caap.messaging.setItem('gifting.' + type + '.records', gifting[type].records);
                } else {
                    gm.setItem("gifting." + type, gifting[type].records, gifting[type].hbest, compress);
                    con.log(3, "gifting.save", type, gifting[type].records);
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                        con.log(2, "gifting.save send");
                        caap.messaging.setItem('gifting.' + type + '.records', gifting[type].records);
                    }
                }

                if (caap.domain.which !== 0) {
                    session.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
                }

                return true;
            } catch (err) {
                con.error("ERROR in gifting.save: " + err);
                return false;
            }
        },

        clear: function (type) {
            try {
                if (!$u.isString(type) || type === '' || !gifting.types.hasIndexOf(type))  {
                    con.warn("Type passed to clear: ", type);
                    throw "Invalid type value!";
                }

                gifting[type].records = [];
                gifting.save(type);
                gifting.clearCurrent();
                session.setItem("Gift" + type.ucFirst() + "DashUpdate", true);
                return true;
            } catch (err) {
                con.error("ERROR in gifting.clear: " + err);
                return false;
            }
        },

        init: function () {
            try {
                var result = true;

                if (!gifting.load("gifts")) {
                    result = false;
                }

                if (!gifting.load("queue")) {
                    result = false;
                }

                if (!gifting.load("history")) {
                    result = false;
                }

                if (!gifting.loadCurrent()) {
                    result = false;
                }

                gifting.queue.fix();
                gifting.history.fix();
                return result;
            } catch (err) {
                con.error("ERROR in gifting.init: " + err);
                return undefined;
            }
        },

        ajaxGiftCheck: function () {
            try {
                con.log(2, 'gifting.ajaxGiftCheck');
                function onSuccess(data, textStatus, XMLHttpRequest) {
                    if ($u.hasContent($j("div[class='messages'] a[href*='army.php?act=ignore']", data))) {
                        con.log(1, 'We have a gift waiting!');
                        state.setItem('HaveGift', true);
                    } else {
                        con.log(2, 'No gifts waiting.');
                        state.setItem('HaveGift', false);
                    }
                }

                function onError(XMLHttpRequest, textStatus, errorThrown) {
                    con.warn('ajaxGiftCheck failed!');
                }

                if (config.getItem('useAjaxGiftCheck', true) && $u.hasContent(session.getItem("signedRequest"))) {
                    caap.ajax('army.php', null, onError, onSuccess);
                } else {
                    caap.clickAjaxLinkSend('army.php');
                }

                var time = config.getItem('CheckGiftMins', 15);
                time = time < 15 ? 15 : time;
                schedule.setItem("ajaxGiftCheck", time * 60, 300);
                return true;
            } catch (err) {
                con.error("ERROR in gifting.ajaxGiftCheck: " + err);
                return false;
            }
        },

        selectedGift: false,

        selectGift: function (giftChoice) {
            try {
                if (caap.navigateTo('army,gift', 'tab_gifts_on.gif')) {
                    return true;
                }

                var giftImg = gifting.gifts.getImg(giftChoice),
                    giftContainer,
                    tempDiv;

                if ($u.hasContent(giftImg)) {
                    giftContainer = $j("#app_body #giftContainer");
                    if (!$u.hasContent(giftContainer)) {
                        con.warn("Could not find giftContainer");
                        return false;
                    }

                    tempDiv = $j("img[src*='gift_more_gifts.gif']", giftContainer);
                    if ($u.hasContent(tempDiv)) {
                        caap.click(tempDiv);
                        caap.clearDomWaiting();
                    }

                    tempDiv = $j("img[class^='imgButton']", giftContainer);
                    if (!$u.hasContent(giftContainer)) {
                        con.warn("Could not find imgButton");
                        return false;
                    }

                    tempDiv.each(function () {
                        var button = $j(this),
                            imgSrc = $u.setContent(button.attr("src"), '').basename();

                        if (imgSrc !== giftImg) {
                            return true;
                        }

                        caap.click(button);
                        gifting.selectedGift = true;
                        con.log(1, "Gift selected", giftChoice);
                        return true;
                    });
                } else {
                    con.log(1, "Unknown gift, using first", giftChoice);
                    gifting.selectedGift = true;
                }

                return true;
            } catch (err) {
                con.error("ERROR in gifting.selectGift: " + err);
                return false;
            }
        },

        exceedLog: true,

        run: function () {
            try {
                var tempDiv    = $j(),
                    tempText   = '',
                    giftImg    = '',
                    giftChoice = '',
                    popCheck,
                    collecting,
                    button,
                    giftingList;

                if (gifting.messageSent) {
                    return true;
                }

                popCheck = gifting.popCheck();
                if ($u.isBoolean(popCheck)) {
                    return popCheck;
                }

                // Go to gifts page if gift list is empty
                if (gifting.gifts.length() <= 2) {
                    if (caap.navigateTo('army,gift', 'tab_gifts_on.gif')) {
                        return true;
                    }
                }

                collecting = gifting.collecting();
                if ($u.isBoolean(collecting)) {
                    return collecting;
                }

                if (config.getItem("CollectOnly", false)) {
                    return false;
                }

                if (!schedule.check("NoGiftDelay")) {
                    return false;
                }

                if (!schedule.check("MaxGiftsExceeded")) {
                    if (gifting.exceedLog) {
                        con.log(1, 'Gifting limit exceeded, will try later');
                        gifting.exceedLog = false;
                        caap.setDivContent('gifting_mess', "Max gift limit");
                    }

                    return false;
                }

                giftChoice = gifting.queue.chooseGift();
                if (gifting.queue.length() && giftChoice) {
                    giftingList = gifting.queue.chooseFriend(gm ? gm.getItem("NumberOfGifts", 5, hiddenVar) : 5);
                    if ($u.hasContent(giftingList)) {
                        sessionStorage.setItem("caap_giftSend", JSON.stringify(giftingList));
                        if (!gifting.selectedGift) {
                            return gifting.selectGift(giftChoice);
                        }

                        if (!$u.hasContent(gifting.queue.clickFriend(giftingList))) {
                            con.log(1, "No friends chosen");
                            return false;
                        }

                        button = $j("#app_body img[src*='invite_sendgift.gif']");
                        if ($u.hasContent(button)) {
                            if (!gifting.clickedButton) {
                                caap.click(button);
                                caap.clearDomWaiting();
                                gifting.clickedButton = true;
                                return true;
                            }
                        } else {
                            con.warn("Friend button not found!");
                            return false;
                        }

                        if (!caap.messaging.connected.hasIndexOf("caapifp")) {
                            con.warn("caapifp not ready");
                            return true;
                        }

                        if (gifting.clickedButton && !gifting.messageSent && !gifting.frameResult) {
                            gifting.queue.setCheckedIds(giftingList);
                            return true;
                        }

                        if (gifting.clickedButton && !gifting.messageSent && gifting.frameResult) {
                            gifting.clickedButton = false;
                        }

                        if (caap.domain.which === 2) {
                            //tempDiv = $j("form[id*='req_form_'] input[name='send']", caap.globalContainer);
                            tempDiv = $j('#globalContainer form[id*="req_form_"] input[name="send"]');
                            if ($u.hasContent(tempDiv)) {
                                caap.click(tempDiv);
                                return true;
                            } else {
                                con.warn("Send button not found!");
                                return false;
                            }
                        }

                    } else {
                        con.log(1, "No friends chosen");
                        return false;
                    }
                }

                if ($j.isEmptyObject(gifting.getCurrent())) {
                    return false;
                }

                return true;
            } catch (err) {
                con.error("ERROR in gifting.run: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        accept: function () {
            try {
                //var giftDiv   = $j("div[class='messages'] a[href*='profile.php?id=']", caap.globalContainer).eq(0),
                var giftDiv   = $j('#globalContainer div[class="messages"] a[href*="profile.php?id="]').eq(0),
                    tempText  = '',
                    tempNum   = 0,
                    current   = {};

                if ($u.hasContent(giftDiv)) {
                    tempNum = $u.setContent(giftDiv.parent().attr("uid"), '0').parseInt();
                    if ($u.hasContent(tempNum) && tempNum > 0) {
                        current = new gifting.queue.record();
                        current.data['userId'] = tempNum;
                        tempText = $u.setContent(giftDiv.children().eq(0).attr("title"), '').trim();
                        if ($u.hasContent(tempText)) {
                            current.data['name'] = tempText;
                        } else {
                            con.warn("No name found!");
                            current.data['name'] = "Unknown";
                        }
                    } else {
                        con.warn("No uid found!");
                    }
                } else {
                    con.warn("No gift messages found!");
                }

                gifting.setCurrent(current.data);
                return !$j.isEmptyObject(gifting.getCurrent());
            } catch (err) {
                con.error("ERROR in gifting.accept: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        loadCurrent: function () {
            try {
                gifting.cachedGiftEntry = gm.getItem('GiftEntry', 'default');
                if (gifting.cachedGiftEntry === 'default' || !$j.isPlainObject(gifting.cachedGiftEntry)) {
                    gifting.cachedGiftEntry = gm.setItem('GiftEntry', {});
                }

                return true;
            } catch (err) {
                con.error("ERROR in gifting.loadCurrent: " + err);
                return false;
            }
        },

        getCurrent: function () {
            try {
                return gifting.cachedGiftEntry;
            } catch (err) {
                con.error("ERROR in gifting.getCurrent: " + err);
                return undefined;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        setCurrent: function (record, clear, src) {
            try {
                if (clear) {
                    gifting.cachedGiftEntry = {};
                } else if (src === "caapif") {
                    gifting.cachedGiftEntry = record;
                } else {
                    if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                        throw "Not passed a record";
                    }

                    if ($u.isNaN(record['userId']) || record['userId'] < 1) {
                        con.warn("userId", record, record['userId']);
                        throw "Invalid identifying userId!";
                    }

                    gifting.cachedGiftEntry = record;
                }

                if (caap.domain.which === 3) {
                    caap.messaging.setItem('gifting.cachedGiftEntry', gifting.cachedGiftEntry);
                } else {
                    gm.setItem("GiftEntry", gifting.cachedGiftEntry);
                    con.log(3, "gifting.setCurrent", gifting.cachedGiftEntry);
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                        con.log(2, "gifting.setCurrent send");
                        caap.messaging.setItem('gifting.cachedGiftEntry', gifting.cachedGiftEntry);
                    }
                }

                return gifting.cachedGiftEntry;
            } catch (err) {
                con.error("ERROR in gifting.setCurrent: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        clearCurrent: function (clearState) {
            try {
                if (clearState) {
                    state.setItem("GiftingRefresh", 0);
                }

                return gifting.setCurrent(null, true);
            } catch (err) {
                con.error("ERROR in gifting.clearCurrent: " + err);
                return undefined;
            }
        },

        clickedButton: false,

        messageSent: false,

        frameResult: null,

        checkResults: false,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        collecting: function () {
            try {
                var giftEntry = gifting.getCurrent();
                if (!$j.isEmptyObject(giftEntry) && giftEntry['checked']) {
                    gifting.collected(true);
                }

                if ($j.isEmptyObject(giftEntry) && state.getItem('HaveGift', false)) {
                    if (caap.navigateTo('army', 'invite_on.gif')) {
                        return true;
                    }

                    if (!gifting.accept()) {
                        state.setItem('HaveGift', false);
                        return false;
                    }

                    schedule.setItem('ClickedFacebookURL', 30);
                    caap.visitUrl(caap.domain.protocol[caap.domain.ptype] + caap.domain.url[1]);
                    /*
                    if (caap.domain.which === 3) {
                        caap.messaging.visitUrl(caap.domain.protocol[caap.domain.ptype] + caap.domain.url[1]);
                    } else {
                        caap.visitUrl(caap.domain.protocol[caap.domain.ptype] + caap.domain.url[1]);
                    }
                    */

                    return true;
                }

                if (!$j.isEmptyObject(giftEntry) && !giftEntry['checked']) {
                    con.log(1, "Clearing incomplete pending gift", giftEntry);
                    gifting.clearCurrent();
                }

                return null;
            } catch (err) {
                con.error("ERROR in gifting.collecting: " + err);
                return undefined;
            }
        },

        collect: function () {
            try {
                var giftEntry  = false,
                    appDiv     = $j(),
                    reload     = false,
                    rfCount    = state.getItem("GiftingRefresh", 0),
                    giftsList  = [];

                if (!window.location.href.hasIndexOf(caap.domain.url[1])) {
                    return false;
                }

                giftEntry = gifting.getCurrent();
                if ($j.isEmptyObject(giftEntry)) {
                    con.log(1, 'On FB page with but no gift');
                    caap.visitUrl(caap.domain.protocol[caap.domain.ptype] + caap.domain.url[0] + "/index.php?bm=1&ref=bookmarks&count=0");
                    return false;
                }

                if (!giftEntry['checked'] || rfCount > 0) {
                    con.log(1, 'On FB page with gift ready to go');
                    appDiv = $j("#confirm_46755028429 .requests").children("li");
                    if ($u.hasContent(appDiv)) {
                        giftsList = gifting.gifts.list().concat(gifting.extraList);
                        appDiv.each(function (index) {
                            try {
                                var giftRequest = $j(this),
                                    giftText    = '',
                                    giftType    = '',
                                    userId      = 0,
                                    name        = '',
                                    giftDiv     = $j(".appRequestBodyNewA", giftRequest),
                                    inputDiv    = $j("input[name='actions[accept]']", giftRequest);

                                if ($u.hasContent(inputDiv)) {
                                    userId = $j("input[name='params[from_id]']", giftRequest).val().parseInt();
                                    if (giftEntry['userId'] !== userId) {
                                        return true;
                                    }

                                    if ($u.hasContent(giftDiv)) {
                                        giftText = $u.setContent(giftDiv.text(), '').trim();
                                        giftType = giftText.regex(new RegExp("has sent you a (.*) in Castle Age!", "i"));
                                        giftType = $u.setContent(giftType, $u.setContent(giftText.regex(new RegExp(".* army is (recruiting) .* in Castle Age!", "i")), '').ucFirst());
                                        giftType = $u.setContent(giftType, giftText.regex(new RegExp(".* needs your help to persuade the great general (.*) to their side in Castle Age", "i")));
                                        giftType = $u.setContent(giftType, giftText.regex(new RegExp(".* needs your help to unlock the item (.*) in Castle Age", "i")));
                                        giftType = $u.setContent(giftType, giftText.regex(new RegExp(".* is rallying you to aid them in their quest to become the Festival (Duel) Champion! Help each other rise to new heights in Castle Age", "i")));
                                        giftType = $u.setContent(giftType, $u.hasContent(giftText.regex(new RegExp(".* is requesting your help to battle (.*) in Castle Age", "i"))) ? "Monster" : "");
                                        giftType = $u.setContent(giftType, $u.setContent(giftText.regex(new RegExp(".* is recruiting you to his (guild), .*, in Castle Age", "i")), '').ucFirst());
                                        name = giftText.regex(new RegExp("(.*) has sent you a .* in Castle Age!", "i"));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) army is recruiting .* in Castle Age!", "i")));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) needs your help to persuade the great general .* to their side in Castle Age", "i")));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) needs your help to unlock the item .* in Castle Age", "i")));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) is rallying you to aid them in their quest to become the Festival Duel Champion! Help each other rise to new heights in Castle Age", "i")));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) is requesting your help to battle .* in Castle Age", "i")));
                                        name = $u.setContent(name, giftText.regex(new RegExp("(.*) is recruiting you to his guild, .*, in Castle Age", "i")));
                                        if (giftType === "Guild") {
                                            con.log(1, "Skipping Guild request from:", name);
                                            return true;
                                        }

                                        if (giftType === "Monster") {
                                            con.log(1, "Skipping Monster request from:", name);
                                            return true;
                                        }

                                        giftEntry['name'] = $u.setContent(giftEntry['name'], $u.setContent(name, 'Unknown'));
                                        if (!$u.hasContent(giftType)) {
                                            con.warn("No gift type found in ", giftText);
                                        }
                                    } else {
                                        con.warn("No appRequestBodyNewA in giftRequest", index);
                                    }

                                    if (giftType === '' || !giftsList.hasIndexOf(giftType)) {
                                        con.log(1, 'Unknown gift type', giftType, giftsList);
                                        giftType = 'Unknown Gift';
                                    } else {
                                        con.log(1, 'gift type', giftType, giftsList);
                                    }

                                    giftEntry['gift'] = giftType;
                                    giftEntry['found'] = true;
                                    giftEntry['checked'] = true;
                                    gifting.setCurrent(giftEntry);
                                    schedule.setItem('ClickedFacebookURL', 35);
                                    if (!reload) {
                                        rfCount = state.setItem("GiftingRefresh", rfCount + 1);
                                    }

                                    reload = true;
                                    caap.click(inputDiv);
                                    return false;
                                } else {
                                    if (!reload) {
                                        rfCount = state.setItem("GiftingRefresh", rfCount + 1);
                                    }

                                    reload = true;
                                    con.warn("No input found in giftRequest", index);
                                }

                                return true;
                            } catch (e) {
                                con.warn("ERROR in gifting.collect: skipping" + e);
                                return true;
                            }
                        });
                    } else {
                        if (!reload) {
                            rfCount = state.setItem("GiftingRefresh", rfCount + 1);
                        }

                        reload = true;
                        con.warn("No gifts found for CA");
                    }

                    giftEntry['checked'] = true;
                    gifting.setCurrent(giftEntry);
                }

                if (!schedule.check('ClickedFacebookURL')) {
                    return false;
                }

                if (giftEntry['found']) {
                    con.log(1, 'Gift click timed out');
                } else {
                    giftEntry['gift'] = 'Unknown Gift';
                    gifting.setCurrent(giftEntry);
                    con.log(1, 'Unable to find gift', giftEntry);
                }

                if (reload && rfCount === 1) {
                    window.image64 = null;
                    window.offline = null;
                    window.profiles = null;
                    window.session = null;
                    window.config = null;
                    window.state = null;
                    window.css = null;
                    window.gm = null;
                    window.ss = null;
                    window.db = null;
                    window.sort = null;
                    window.schedule = null;
                    window.general = null;
                    window.monster = null;
                    window.guild_monster = null;
                    //window.arena = null;
                    window.festival = null;
                    window.feed = null;
                    window.battle = null;
                    window.town = null;
                    window.spreadsheet = null;
                    window.gifting = null;
                    window.army = null;
                    window.caap = null;
                    window.con = null;
                    window.conquest = null;
                    $u.reload();
                }

                state.setItem("GiftingRefresh", 0);
                caap.visitUrl(caap.domain.protocol[caap.domain.ptype] + caap.domain.url[0] + "/gift_accept.php?act=acpt&uid=" + giftEntry['userId']);
                return true;
            } catch (err) {
                con.error("ERROR in gifting.collect: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        collected: function (force) {
            try {
                var giftEntry   = gifting.getCurrent(),
                    collectOnly = false,
                    filterIdList = config.getList("FilterReturnIdList", ''),
                    filterGiftList = config.getList("FilterReturnGiftList", ''),
                    noQID = config.getItem("noQueueFilterReturnIdList", false),
                    noQGift = config.getItem("noQueueFilterReturnGift", false),
                    award;

                if (!$j.isEmptyObject(giftEntry)) {
                    award = /You have been awarded the gift/.test(caap.resultsText) || /You have accepted the gift/.test(caap.resultsText) || /You spoke to/.test(caap.resultsText) || /You have helped/.test(caap.resultsText);
                    if (!award) {
                        con.log(1, "gifting.collected", giftEntry, caap.resultsText);
                    }

                    if (force || award || caap.hasImage("gift_yes.gif")) {
                        collectOnly = config.getItem("CollectOnly", false);
                        if (!collectOnly || (collectOnly && config.getItem("CollectAndQueue", false))) {
                            if (!noQID || (noQID && !filterIdList.hasIndexOf(giftEntry['userId']))) {
                                if (!noQGift || (noQGift && !filterGiftList.hasIndexOf(giftEntry['gift']))) {
                                    gifting.queue.setItem(giftEntry);
                                } else {
                                    con.log(1, "Filter Gift, queue skipped", giftEntry, filterGiftList);
                                }
                            } else {
                                con.log(1, "Filter ID, queue skipped", giftEntry, filterIdList);
                            }
                        }

                        gifting.history.received(giftEntry);
                    }

                    gifting.clearCurrent(true);
                }

                schedule.setItem("NoGiftDelay", 0);
                return true;
            } catch (err) {
                con.error("ERROR in gifting.collected: " + err);
                return false;
            }
        },

        popCheck: function (type) {
            try {
                var popDiv     = $j("#pop_content"),
                    tempDiv    = $j(),
                    tempText   = '',
                    tryAgain   = true;

                if ($u.hasContent(popDiv)) {
                    tempDiv = $j("input[name='sendit']", popDiv);
                    if ($u.hasContent(tempDiv)) {
                        con.log(2, 'Sending gifts to Facebook');
                        caap.click(tempDiv);
                        caap.clearDomWaiting();
                        return true;
                    }

                    tempDiv = $j("input[name='skip_ci_btn']", popDiv);
                    if ($u.hasContent(tempDiv)) {
                        con.log(2, 'Denying Email Nag For Gift Send');
                        caap.click(tempDiv);
                        caap.clearDomWaiting();
                        return true;
                    }

                    tempDiv = $j("input[name='ok']", popDiv);
                    if ($u.hasContent(tempDiv)) {
                        tempText = $u.setContent(tempDiv.parent().parent().prev().text(), '').trim().innerTrim();
                        if (tempText) {
                            if (/you have run out of requests/.test(tempText)) {
                                con.log(2, 'Out of gift requests: ', tempText);
                                schedule.setItem("MaxGiftsExceeded", 10800, 300);
                                caap.setDivContent('gifting_mess', "Max gift limit");
                                tryAgain = false;
                            } else {
                                con.warn('Unknown popup message: ', tempText);
                            }
                        } else {
                            con.warn('Popup message but no text found');
                        }

                        caap.click(tempDiv);
                        caap.clearDomWaiting();
                        return tryAgain;
                    }

                    tempText = $u.setContent(popDiv.text(), '').trim().innerTrim();
                    if (tempText) {
                        if (/Loading/.test(tempText)) {
                            con.log(2, "Popup is loading ...");
                            return true;
                        } else {
                            con.warn('Unknown popup!', tempText);
                            return false;
                        }
                    } else {
                        con.warn('Popup message but no text found');
                        return false;
                    }
                }

                /*
                if (caap.getDomWaiting()) {
                    return true;
                }
                */

                return null;
            } catch (err) {
                con.error("ERROR in gifting.popCheck: " + err);
                return undefined;
            }
        },

        menu: function () {
            try {
                // Other controls
                var giftInstructions = "Automatically receive and send return gifts.",
                    giftQueueUniqueInstructions = "When enabled only unique user's gifts will be queued, otherwise all received gifts will be queued.",
                    giftCollectOnlyInstructions = "Only collect gifts, do not queue and do not return.",
                    giftCollectAndQueueInstructions = "When used with Collect Only it will collect and queue gifts but not return.",
                    giftReturnOnlyOneInstructions = "Only return 1 gift to a person in 24 hours even if you received many from that person.",
                    htmlCode = '';

                htmlCode += caap.startToggle('Gifting', 'GIFTING OPTIONS');
                htmlCode += caap.makeCheckTR('Auto Gifting', 'AutoGift', false, giftInstructions);
                htmlCode += caap.startCheckHide('AutoGift');
                htmlCode += caap.makeCheckTR('Do In Background', 'useAjaxGiftCheck', true, "Check for gifts using AJAX rather than page navigation.");
                htmlCode += caap.makeCheckTR('Watch FB Beeper', 'watchBeeper', true, "Watch the FB Beeper for new gifts.");
                htmlCode += caap.makeCheckTR('Queue unique users only', 'UniqueGiftQueue', true, giftQueueUniqueInstructions);
                htmlCode += caap.makeCheckTR('Collect Only', 'CollectOnly', false, giftCollectOnlyInstructions);
                htmlCode += caap.startCheckHide('CollectOnly');
                htmlCode += caap.makeCheckTR('And Queue', 'CollectAndQueue', false, giftCollectAndQueueInstructions, true);
                htmlCode += caap.endCheckHide('CollectOnly');
                /*
                htmlCode += caap.makeDropDownTR("Give", 'GiftChoice', gifting.gifts.list(), '', '', '', false, false, 80);
                htmlCode += caap.makeCheckTR('1 Gift Per Person Per 24hrs', 'ReturnOnlyOne', false, giftReturnOnlyOneInstructions);
                htmlCode += caap.makeCheckTR('Filter Return By UserId', 'FilterReturnId', false, "Do not return gifts to a list of UserIDs");
                htmlCode += caap.startCheckHide('FilterReturnId');
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD(caap.makeTextBox('FilterReturnIdList', "Do not return gifts to these UserIDs. Use ',' between each UserID", '', ''));
                htmlCode += caap.endTR;
                htmlCode += caap.makeCheckTR('Do Not Queue', 'noQueueFilterReturnIdList', false, "Do not queue gifts for a list of certain UserIDs recieved", true);
                htmlCode += caap.endCheckHide('FilterReturnId');
                htmlCode += caap.makeCheckTR('Filter Return By Gift', 'FilterReturnGift', false, "Do not return gifts for a list of certain gifts recieved");
                htmlCode += caap.startCheckHide('FilterReturnGift');
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD(caap.makeTextBox('FilterReturnGiftList', "Do not return gifts to these received gifts. Use ',' between each gift", '', ''));
                htmlCode += caap.endTR;
                htmlCode += caap.makeCheckTR('Do Not Queue', 'noQueueFilterReturnGift', false, "Do not queue gifts for a list of certain gifts recieved", true);
                htmlCode += caap.endCheckHide('FilterReturnGift');
                */
                htmlCode += caap.endCheckHide('AutoGift');
                htmlCode += caap.makeCheckTR("Modify Timers", 'giftModifyTimers', false, "Advanced timers for how often Gifting actions are performed.");
                htmlCode += caap.startCheckHide('giftModifyTimers');
                /*
                htmlCode += caap.makeNumberFormTR("Max Gift Hours", 'MaxGiftsExceededDelaySecs', "When Max Gifts is exceeded wait X hours before attempting to send gifts. Minimum 1.", 3, '', '', true);
                htmlCode += caap.makeNumberFormTR("One Gift Hours", 'OneGiftPerPersonDelaySecs', "When '1 Gift Per Person Per 24hrs' is enabled this is the timer used and is normally 24. Minimum 1.", 24, '', '', true);
                htmlCode += caap.makeNumberFormTR("Last Tried Delay", 'LastGiftUserDelaySecs', "If we tried to send a gift to a users and they were not in the gifting list then wait X hours before attempting to send a gift to this user again. Minimum 1.", 1, '', '', true);
                htmlCode += caap.makeNumberFormTR("No Gift Delay", 'NoGiftDelaySecs', "When no return gift could be found then wait X minutes before attempting to send gift again. Minimum 30.", 30, '', '', true);
                */
                htmlCode += caap.makeNumberFormTR("Gift List Days", 'checkGift', "Check gift list every X days. Minimum 3.", 3, '', '', true);
                htmlCode += caap.makeNumberFormTR("Ajax Gift Check", 'CheckGiftMins', "Check gifts waiting every X minutes. Minimum 15.", 15, '', '', true);
                htmlCode += caap.endCheckHide('giftModifyTimers');
                htmlCode += caap.endCheckHide('AutoGift');

                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in gifting.menu: " + err);
                return '';
            }
        },

        gifts: {
            options: ['Same Gift As Received', 'Random Gift'],

            hbest: 0,

            records: [],

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            record: function () {
                this.data = {
                    'name'  : '',
                    'image' : ''
                };
            },

            getItem: function (name) {
                try {
                    var it    = 0,
                        len   = 0,
                        gift  = false;

                    if (!$u.isString(name) || name === '') {
                        con.warn("name", name);
                        throw "Invalid identifying name!";
                    }

                    for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                        if (gifting.gifts.records[it]['name'] === name) {
                            gift = gifting.gifts.records[it];
                            break;
                        }
                    }

                    return gift;
                } catch (err) {
                    con.error("ERROR in gifting.gifts.getItem: " + err);
                    return undefined;
                }
            },

            getImg: function (name) {
                try {
                    var it    = 0,
                        len   = 0,
                        image = '';

                    if (!$u.isString(name) || name === '') {
                        con.warn("name", name);
                        throw "Invalid identifying name!";
                    }

                    if (name !== 'Unknown Gift') {
                        for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                            if (gifting.gifts.records[it]['name'] === name) {
                                image = gifting.gifts.records[it]['image'];
                                break;
                            }
                        }

                        if (it >= len) {
                            con.warn("Gift not in list! ", name);
                        }
                    }

                    return image;
                } catch (err) {
                    con.error("ERROR in gifting.gifts.getImg: " + err);
                    return undefined;
                }
            },

            populate: function () {
                try {
                    //var giftDiv  = $j("#giftContainer div[id*='gift']", caap.globalContainer),
                    var giftDiv  = $j('#globalContainer #giftContainer div[id*="gift"]'),
                        tempText = '',
                        tempArr  = [],
                        update   = false,
                        it       = 0;

                    if ($u.hasContent(giftDiv)) {
                        gifting.clear("gifts");
                        giftDiv.each(function () {
                            var theGift = $j(this),
                                tempDiv = theGift.children().eq(0),
                                newGift = new gifting.gifts.record();

                            if ($u.hasContent(tempDiv)) {
                                tempText = $u.setContent(tempDiv.text(), '').trim().replace("!", "");
                                if ($u.hasContent(tempText)) {
                                    newGift.data['name'] = tempText;
                                } else {
                                    con.warn("Unable to get gift name! No text in ", tempDiv);
                                    return true;
                                }
                            } else {
                                con.warn("Unable to get gift name! No child!");
                                return true;
                            }

                            tempDiv = $j("img[class*='imgButton']", theGift);
                            if ($u.hasContent(tempDiv)) {
                                tempText = $u.setContent(tempDiv.attr("src"), '').basename();
                                if (tempText) {
                                    newGift.data['image'] = tempText;
                                } else {
                                    con.warn("Unable to get gift image! No src in ", tempDiv);
                                    return true;
                                }
                            } else {
                                con.warn("Unable to get gift image! No img!");
                                return true;
                            }

                            if (gifting.gifts.getItem(newGift.data['name'])) {
                                it = 2;
                                while (gifting.gifts.getItem(newGift.data['name'] + " #" + it)) {
                                    it += 1;
                                }

                                newGift.data['name'] += " #" + it;
                                con.log(2, "Gift exists, no auto return for ", newGift.data['name']);
                            }

                            gifting.gifts.records.push(newGift.data);
                            update = true;
                            return true;
                        });
                    }

                    if (update) {
                        tempArr = gifting.gifts.list();
                        tempText = config.getItem("GiftChoice", gifting.gifts.options[0]);
                        if (!tempArr.hasIndexOf(tempText))  {
                            con.log(1, "Gift choice invalid, changing from/to ", tempText, gifting.gifts.options[0]);
                            tempText = config.setItem("GiftChoice", gifting.gifts.options[0]);
                        }

                        caap.changeDropDownList("GiftChoice", tempArr, tempText);
                        gifting.save("gifts");
                    }

                    return update;
                } catch (err) {
                    con.error("ERROR in gifting.gifts.populate: " + err);
                    return undefined;
                }
            },

            list: function () {
                try {
                    var it       = 0,
                        len      = 0,
                        giftList = [],
                        giftOpts = gifting.gifts.options.slice();

                    for (it = 0, len = gifting.gifts.records.length; it < len; it += 1) {
                        giftList.push(gifting.gifts.records[it]['name']);
                    }

                    return $j.merge(giftOpts, giftList);
                } catch (err) {
                    con.error("ERROR in gifting.gifts.list: " + err);
                    return undefined;
                }
            },

            random: function () {
                try {
                    return gifting.gifts.records[Math.floor(Math.random() * (gifting.gifts.records.length))]['name'];
                } catch (err) {
                    con.error("ERROR in gifting.gifts.random: " + err);
                    return undefined;
                }
            },
            /*jslint sub: false */

            length: function () {
                try {
                    return gifting.gifts.records.length;
                } catch (err) {
                    con.error("ERROR in gifting.gifts.length: " + err);
                    return undefined;
                }
            }
        },

        queue: {
            records: [],

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            record: function () {
                this.data = {
                    'userId'  : 0,
                    'name'    : '',
                    'gift'    : '',
                    'checked' : false,
                    'found'   : false,
                    'chosen'  : false,
                    'sent'    : false,
                    'last'    : 0
                };
            },

            fix: function () {
                try {
                    var it   = 0,
                        save = false;

                    for (it = gifting.queue.records.length - 1; it >= 0; it -= 1) {
                        if ($u.isNaN(gifting.queue.records[it]['userId']) || gifting.queue.records[it]['userId'] < 1 || gifting.queue.records[it]['sent'] === true) {
                            con.warn("gifting.queue.fix - delete", gifting.queue.records[it]);
                            gifting.queue.records.splice(it, 1);
                            save = true;
                        }
                    }

                    if (save) {
                        gifting.save("queue");
                    }

                    return save;
                } catch (err) {
                    con.error("ERROR in gifting.queue.fix: " + err);
                    return undefined;
                }
            },

            hbest: 2,

            setItem: function (record) {
                try {
                    if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                        throw "Not passed a record";
                    }

                    if ($u.isNaN(record['userId']) || record['userId'] < 1) {
                        con.warn("userId", record['userId']);
                        throw "Invalid identifying userId!";
                    }

                    var it      = 0,
                        len     = 0,
                        found   = false,
                        updated = false;

                    if (config.getItem("UniqueGiftQueue", true)) {
                        for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                            if (gifting.queue.records[it]['userId'] === record['userId']) {
                                if (gifting.queue.records[it]['name'] !== record['name']) {
                                    gifting.queue.records[it]['name'] = record['name'];
                                    updated = true;
                                    con.log(2, "Updated users name", record, gifting.queue.records);
                                }

                                found = true;
                                con.log(2, "found in queue", gifting.queue.records[it]);
                                break;
                            }
                        }
                    }

                    if (!found) {
                        gifting.queue.records.push(record);
                        updated = true;
                        con.log(2, "Added gift to queue", record, gifting.queue.records);
                    }

                    if (updated) {
                        gifting.save("queue");
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.queue.setItem: " + err, record);
                    return false;
                }
            },
            /*jslint sub: false */

            deleteIndex: function (index) {
                try {
                    if ($u.isNaN(index) || index < 0 || index >= gifting.queue.records.length) {
                        throw "Invalid index! (" + index + ")";
                    }

                    gifting.queue.records.splice(index, 1);
                    gifting.save("queue");
                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.queue.deleteIndex: " + err, index);
                    return false;
                }
            },

            length: function () {
                try {
                    return gifting.queue.records.length;
                } catch (err) {
                    con.error("ERROR in gifting.queue.length: " + err);
                    return undefined;
                }
            },

            getIds: function () {
                try {
                    var it = 0,
                        ids = [];

                    for (it = gifting.queue.records.length - 1; it >= 0; it -= 1) {
                        if (!$u.isNaN(gifting.queue.records[it]['userId']) && gifting.queue.records[it]['userId'] > 1) {
                            ids.push(gifting.queue.records[it]['userId']);
                        }
                    }

                    return ids;
                } catch (err) {
                    con.error("ERROR in gifting.queue.getIds: " + err);
                    return undefined;
                }
            },

            randomImg: '',

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            chooseGift: function () {
                try {
                    var it             = 0,
                        it1            = 0,
                        len            = 0,
                        gift           = '',
                        choice         = '',
                        filterId       = false,
                        filterIdList   = [],
                        filterIdLen    = 0,
                        filterGift     = false,
                        filterGiftList = [],
                        filterGiftLen  = 0,
                        filterGiftCont = false,
                        time           = 0;

                    filterId = config.getItem("FilterReturnId", false);
                    if (filterId) {
                        filterIdList = config.getList("FilterReturnIdList", '');
                        filterIdLen = filterIdList.length;
                    }

                    filterGift = config.getItem("FilterReturnGift", false);
                    if (filterGift) {
                        filterGiftList = config.getList("FilterReturnGiftList", '');
                        filterGiftLen = filterGiftList.length;
                    }

                    choice = config.getItem("GiftChoice", gifting.gifts.options[0]);
                    time = config.getItem("LastGiftUserDelaySecs", 1);
                    time = (time < 1 ? 1 : time) * 3600;
                    for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                        if (!schedule.since(gifting.queue.records[it]['last'] || 0, time)) {
                            continue;
                        }

                        if (gifting.queue.records[it]['sent']) {
                            continue;
                        }

                        if (filterId && filterIdLen && filterIdList.hasIndexOf(gifting.queue.records[it]['userId'])) {
                            con.log(3, "chooseGift Filter Id", gifting.queue.records[it]['userId']);
                            continue;
                        }

                        if (filterGift && filterGiftLen) {
                            filterGiftCont = false;
                            for (it1 = 0; it1 < filterGiftLen; it1 += 1) {
                                if (gifting.queue.records[it]['gift'].hasIndexOf(filterGiftList[it1])) {
                                    con.log(3, "chooseGift Filter Gift", gifting.queue.records[it]['gift']);
                                    filterGiftCont = true;
                                    break;
                                }
                            }

                            if (filterGiftCont) {
                                continue;
                            }
                        }

                        switch (choice) {
                        case gifting.gifts.options[0]:
                            gift = gifting.queue.records[it]['gift'];
                            break;
                        case gifting.gifts.options[1]:
                            gift = $u.setContent(gifting.queue.randomImg, gifting.gifts.random());
                            gifting.queue.randomImg = gift;
                            break;
                        default:
                            gift = choice;
                        }

                        break;
                    }

                    if (!gift) {
                        time = config.getItem("NoGiftDelaySecs", 30);
                        time = (time < 30 ? 30 : time) * 60;
                        schedule.setItem("NoGiftDelay", time, 300);
                    }

                    return gift;
                } catch (err) {
                    con.error("ERROR in gifting.queue.chooseGift: " + err);
                    return undefined;
                }
            },

            clickFriend: function (giftingList) {
                try {
                    var it             = 0,
                        it1            = 0,
                        len            = 0,
                        tempGift       = '',
                        unselListDiv   = $j("#app_body div[class='unselected_list']"),
                        selListDiv     = $j("#app_body div[class='selected_list']"),
                        unselDiv       = $j(),
                        selDiv         = $j(),
                        first          = true,
                        same           = true,
                        returnOnlyOne  = false,
                        filterId       = false,
                        filterIdList   = [],
                        filterIdLen    = 0,
                        filterGift     = false,
                        filterGiftList = [],
                        filterGiftLen  = 0,
                        filterGiftCont = false,
                        searchStr      = '',
                        clickedList    = [],
                        pendingList    = [],
                        chosenList     = [],
                        time           = 0;

                    if ($u.hasContent(giftingList)) {
                        if (caap.domain.which === 3) {
                            chosenList = giftingList;
                        } else if (caap.domain.which === 2) {
                            for (it = 0, len = giftingList.length; it < len; it += 1) {
                                searchStr += "input[value='" + giftingList[it] + "']";
                                if (it >= 0 && it < len - 1) {
                                    searchStr += ",";
                                }
                            }

                            unselDiv = $j(searchStr, unselListDiv);
                            if ($u.hasContent(unselDiv)) {
                                unselDiv.each(function () {
                                    var unsel = $j(this),
                                        id    = $u.setContent(unsel.attr("value"), '0').parseInt();

                                    if (!/none/.test($u.setContent(unsel.parent().attr("style"), ''))) {
                                        caap.click(unsel);
                                        caap.clearDomWaiting();
                                        con.log(2, "Id clicked:", id);
                                        clickedList.push(id);
                                    } else {
                                        con.log(2, "Id not found, perhaps gift pending:", id);
                                        pendingList.push(id);
                                    }
                                });
                            } else {
                                con.log(2, "Ids not found:", giftingList, searchStr);
                                $j.merge(pendingList, giftingList);
                            }

                            if ($u.hasContent(clickedList)) {
                                for (it = 0, len = clickedList.length; it < len; it += 1) {
                                    searchStr += "input[value='" + clickedList[it] + "']";
                                    if (it >= 0 && it < len - 1) {
                                        searchStr += ",";
                                    }
                                }

                                selDiv = $j(searchStr, selListDiv);
                                if ($u.hasContent(selDiv)) {
                                    selDiv.each(function () {
                                        var sel = $j(this),
                                            id  = $u.setContent(sel.attr("value"), '0').parseInt();

                                        if (!/none/.test($u.setContent(sel.parent().attr("style"), ''))) {
                                            con.log(2, "User Chosen:", id);
                                            chosenList.push(id);
                                        } else {
                                            con.log(2, "Selected id is none:", id);
                                            pendingList.push(id);
                                        }
                                    });
                                } else {
                                    con.log(2, "Selected ids not found:", searchStr);
                                    $j.merge(pendingList, clickedList);
                                }
                            }

                            con.log(2, "chosenList/pendingList", chosenList, pendingList);
                            for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                                if (chosenList.hasIndexOf(gifting.queue.records[it]['userId'])) {
                                    con.log(2, "Chosen", gifting.queue.records[it]['userId']);
                                    gifting.queue.records[it]['chosen'] = true;
                                    gifting.queue.records[it]['last'] = Date.now();
                                } else if (pendingList.hasIndexOf(gifting.queue.records[it]['userId'])) {
                                    con.log(2, "Pending", gifting.queue.records[it]['userId']);
                                    gifting.queue.records[it]['last'] = Date.now();
                                }
                            }

                            caap.clearDomWaiting();
                            gifting.save("queue");
                        }
                    }

                    return chosenList;
                } catch (err) {
                    con.error("ERROR in gifting.queue.clickFriend: " + err);
                    return undefined;
                }
            },

            chooseFriend: function (howmany) {
                try {
                    var it             = 0,
                        it1            = 0,
                        len            = 0,
                        tempGift       = '',
                        unselListDiv   = $j("#app_body div[class='unselected_list']"),
                        selListDiv     = $j("#app_body div[class='selected_list']"),
                        unselDiv       = $j(),
                        selDiv         = $j(),
                        first          = true,
                        same           = true,
                        returnOnlyOne  = false,
                        filterId       = false,
                        filterIdList   = [],
                        filterIdLen    = 0,
                        filterGift     = false,
                        filterGiftList = [],
                        filterGiftLen  = 0,
                        filterGiftCont = false,
                        giftingList    = [],
                        searchStr      = '',
                        clickedList    = [],
                        pendingList    = [],
                        chosenList     = [],
                        time           = 0;
con.log(1, 'chooseFriend');
                    if ($u.isNaN(howmany) || howmany < 1) {
                        throw "Invalid howmany! (" + howmany + ")";
                    }

                    returnOnlyOne = config.getItem("ReturnOnlyOne", false);
                    filterId = config.getItem("FilterReturnId", false);
                    if (filterId) {
                        filterIdList = config.getList("FilterReturnIdList", '');
                        filterIdLen = filterIdList.length;
                    }

                    filterGift = config.getItem("FilterReturnGift", false);
                    if (filterGift) {
                        filterGiftList = config.getList("FilterReturnGiftList", '');
                        filterGiftLen = filterGiftList.length;
                    }

                    if (config.getItem("GiftChoice", gifting.gifts.options[0]) !== gifting.gifts.options[0]) {
                        same = false;
                    }

                    time = config.getItem("LastGiftUserDelaySecs", 1);
                    time = (time < 1 ? 1 : time) * 3600;
                    for (it = 0, len = gifting.queue.records.length; it < len; it += 1) {
                        gifting.queue.records[it]['chosen'] = false;

                        if (giftingList.length >= howmany) {
                            continue;
                        }

                        if (!schedule.since(gifting.queue.records[it]['last'] || 0, time)) {
                            continue;
                        }

                        if (gifting.queue.records[it]['sent']) {
                            continue;
                        }

                        if (filterId && filterIdLen && filterIdList.hasIndexOf(gifting.queue.records[it]['userId'])) {
                            con.log(3, "chooseFriend Filter Id", gifting.queue.records[it]['userId']);
                            continue;
                        }

                        if (filterGift && filterGiftLen) {
                            filterGiftCont = false;
                            for (it1 = 0; it1 < filterGiftLen; it1 += 1) {
                                if (gifting.queue.records[it]['gift'].hasIndexOf(filterGiftList[it1])) {
                                    con.log(3, "chooseFriend Filter Gift", gifting.queue.records[it]['gift']);
                                    filterGiftCont = true;
                                    break;
                                }
                            }

                            if (filterGiftCont) {
                                continue;
                            }
                        }

                        if (returnOnlyOne) {
                            if (gifting.history.checkSentOnce(gifting.queue.records[it]['userId'])) {
                                con.log(2, "Sent Today: ", gifting.queue.records[it]['userId']);
                                gifting.queue.records[it]['last'] = Date.now();
                                continue;
                            }
                        }

                        if (first) {
                            tempGift = gifting.queue.records[it]['gift'];
                            first = false;
                        }

                        if (gifting.queue.records[it]['gift'] === tempGift || !same) {
                            giftingList.push(gifting.queue.records[it]['userId']);
                        }
                    }

                    return giftingList;
                } catch (err) {
                    con.error("ERROR in gifting.queue.chooseFriend: " + err);
                    return undefined;
                }
            },

            sentGifts: function (msg) {
                try {
                    con.log(2, "sentGifts", msg);
                    gifting.messageSent = false;
                    gifting.frameResult = msg.data;

                    var chosenList  = gifting.frameResult['areChecked'],
                        pendingList = [].concat(gifting.frameResult['notFound']).concat(gifting.frameResult['notChecked']),
                        getTime     = Date.now(),
                        userId      = 0,
                        it          = 0,
                        len         = gifting.queue.records.length;

                    for (it = 0; it < len; it += 1) {
                        userId = gifting.queue.records[it]['userId'];
                        if (chosenList.hasIndexOf(userId)) {
                            con.log(2, "Chosen", userId);
                            gifting.queue.records[it]['chosen'] = true;
                            gifting.queue.records[it]['last'] = getTime;
                        } else if (pendingList.hasIndexOf(userId)) {
                            con.log(2, "Pending", userId);
                            gifting.queue.records[it]['last'] = getTime;
                        }
                    }

                    gifting.save("queue");
                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.queue.sentGifts: " + err);
                    gifting.messageSent = false;
                    return false;
                }
            },

            resultsContainer: null,

            checkSentTo: null,

            sentHtml: '',

            checkSent: function (event) {
                try {
                    var howMany,
                        button = $j("#app_body img[src*='tab_gifts_on.gif']");

                    con.log(1, "gifting.queue.checkSent begin");
                    if ($u.mutationTypes['DOMSubtreeModified']) {
                        gifting.queue.resultsContainer.off("DOMSubtreeModified", gifting.queue.checkSent);
                    } else if ($u.mutationTypes['DOMAttrModified']) {
                        gifting.queue.resultsContainer.off("DOMAttrModified", gifting.queue.checkSent);
                    } else {
                        window.clearTimeout(gifting.queue.checkSentTo);
                    }

                    gifting.checkResults = true;
                    howMany = gifting.queue.sent();
                    gifting.checkResults = false;
                    gifting.queue.sentHtml = "<div id='caap_results_container_" + (Math.random() * 100).dp(0) + "' class='results_container'>CAAP sent " + howMany + " gift" + $u.plural(howMany) + "!</div>";
                    gifting.queue.resultsContainer.before(gifting.queue.sentHtml);
                    gifting.queue.resultsContainer = null;
                    gifting.frameResult = null;
                    gifting.clickedButton = false;
                    session.setItem("delayMain", false);
                    if ($u.hasContent(button)) {
                        caap.click(button);
                    } else {
                        con.warn("Unable to find gifting tab");
                    }

                    con.log(1, "gifting.queue.checkSent done");
                } catch (err) {
                    con.error("ERROR in gifting.queue.checkSent: " + err);
                }
            },

            setCheckedIds: function (idArray) {
                try {
                    con.log(1, "gifting.queue.setCheckedIds");
                    gifting.queue.resultsContainer = $j("#app_body #results_container");
                    if ($u.mutationTypes['DOMSubtreeModified']) {
                        gifting.queue.resultsContainer.on("DOMSubtreeModified", gifting.queue.checkSent);
                    } else if ($u.mutationTypes['DOMAttrModified']) {
                        gifting.queue.resultsContainer.on("DOMAttrModified", gifting.queue.checkSent);
                    } else {
                        gifting.queue.checkSentTo = window.setTimeout(function () {
                            gifting.queue.checkSent();
                        }, 60000);
                    }

                    caap.messaging.setCheckedIds(idArray);
                    gifting.messageSent = true;
                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.queue.setCheckedIds: " + err);
                    gifting.messageSent = false;
                    return false;
                }
            },

            sent: function () {
                try {
                    var it          = 0,
                        sentok      = false,
                        time        = 0,
                        resultsText = null,
                        howMany     = 0;

                    if (gifting.checkResults) {
                        resultsText = $u.setContent(gifting.queue.resultsContainer.text(), '').trim().innerTrim();
                        con.log(1, 'gifting.queue.sent resultsText', resultsText);
                        if (gifting.checkResults) {
                            howMany = $u.setContent(resultsText.regex(new RegExp("(\\d+) requests? sent!")), resultsText.regex(/You have sent (\d+) gift/));
                            con.log(1, 'gifting.queue.sent', howMany);
                            if (howMany > 0) {
                                for (it = gifting.queue.records.length - 1; it >= 0; it -= 1) {
                                    if (gifting.queue.records[it]['chosen']) {
                                        gifting.queue.records[it]['sent'] = true;
                                        gifting.history.sent(gifting.queue.records[it]);
                                        gifting.queue.records.splice(it, 1);
                                    }
                                }

                                con.log(1, 'Confirmed gifts sent out.');
                                sentok = true;
                                gifting.save("queue");
                            } else if (/You have exceed the max gift limit for the day/.test(resultsText)) {
                                con.log(1, 'Exceeded daily gift limit.');
                                time = config.getItem("MaxGiftsExceededDelaySecs", 3);
                                time = time < 1 ? 1 : time;
                                schedule.setItem("MaxGiftsExceeded", time * 3600, 300);
                                caap.setDivContent('gifting_mess', "Max gift limit");
                            } else {
                                con.log(2, 'Result message', resultsText);
                            }
                        } else {
                            con.log(2, 'No result message');
                        }
                    }

                    return howMany;
                } catch (err) {
                    con.error("ERROR in gifting.queue.sent: " + err);
                    return undefined;
                }
            },

            dashboard: function () {
                try {
                    /*-------------------------------------------------------------------------------------\
                    Next we build the HTML to be included into the 'caap_giftQueue' div. We set our
                    table and then build the header row.
                    \-------------------------------------------------------------------------------------*/
                    if (config.getItem('DBDisplay', '') === 'Gift Queue' && session.getItem("GiftQueueDashUpdate", true)) {
                        var headers                = ['UserId', 'Name', 'Gift', 'FB Cleared', 'Delete'],
                            values                 = ['userId', 'name', 'gift', 'found'],
                            pp                     = 0,
                            i                      = 0,
                            userIdLink             = '',
                            userIdLinkInstructions = '',
                            removeLinkInstructions = '',
                            len                    = 0,
                            len1                   = 0,
                            str                    = '',
                            data                   = {text: '', color: '', bgcolor: '', id: '', title: ''},
                            handler                = null,
                            head                   = '',
                            body                   = '',
                            row                    = '';

                        for (pp = 0, len = headers.length; pp < len; pp += 1) {
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                        }

                        head = caap.makeTr(head);
                        for (i = 0, len = gifting.queue.records.length; i < len; i += 1) {
                            row = "";
                            for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                                str = $u.setContent(gifting.queue.records[i][values[pp]], '');
                                if (/userId/.test(values[pp])) {
                                    userIdLinkInstructions = "Clicking this link will take you to the user keep of " + str;
                                    //userIdLink = caap.domain.link + "/keep.php?casuser=" + str;
                                    userIdLink = "keep.php?casuser=" + str;

                                    data = {
                                        text  : '<span id="caap_targetgiftq_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                                '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + str + '</span>',
                                        color : 'blue',
                                        id    : '',
                                        title : ''
                                    };

                                    row += caap.makeTd(data);
                                } else {
                                    row += caap.makeTd({text: str, color: '', id: '', title: ''});
                                }
                            }

                            removeLinkInstructions = "Clicking this link will remove " + gifting.queue.records[i]['name'] + "'s entry from the gift queue!";
                            data = {
                                text  : '<span id="caap_removeq_' + i + '" title="' + removeLinkInstructions + '" mname="' +
                                        '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';" class="ui-icon ui-icon-circle-close">X</span>',
                                color : 'blue',
                                id    : '',
                                title : ''
                            };

                            row += caap.makeTd(data);
                            body += caap.makeTr(row);
                        }

                        $j("#caap_giftQueue", caap.caapTopObject).html(
                            $j(caap.makeTable("gifting_queue", head, body)).dataTable({
                                "bAutoWidth"    : false,
                                "bFilter"       : false,
                                "bJQueryUI"     : false,
                                "bInfo"         : false,
                                "bLengthChange" : false,
                                "bPaginate"     : false,
                                "bProcessing"   : false,
                                "bStateSave"    : true,
                                "bSortClasses"  : false,
                                "aoColumnDefs"  : [{
                                    "bSortable" : false,
                                    "aTargets"  : [4]
                                }]
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

                        $j("span[id*='caap_targetgiftq_']", caap.caapTopObject).off('click', handler).click(handler);

                        handler = function (e) {
                            var index = -1,
                                i     = 0,
                                len   = 0,
                                resp  = false;

                            for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                                if (e.target.attributes[i].nodeName === 'id') {
                                    index = e.target.attributes[i].nodeValue.replace("caap_removeq_", "").parseInt();
                                }
                            }

                            resp = confirm("Are you sure you want to remove this queue entry?");
                            if (resp === true) {
                                gifting.queue.deleteIndex(index);
                                caap.updateDashboard(true);
                            }
                        };

                        $j("span[id*='caap_removeq_']", caap.caapTopObject).off('click', handler).click(handler);
                        session.setItem("GiftQueueDashUpdate", false);
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.queue.dashboard: " + err);
                    return false;
                }
            }
            /*jslint sub: false */
        },

        history: {
            records: [],

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            record: function () {
                this.data = {
                    'userId'       : 0,
                    'name'         : '',
                    'sent'         : 0,
                    'lastSent'     : 0,
                    'received'     : 0,
                    'lastReceived' : 0
                };
            },

            fix: function () {
                try {
                    var it = 0,
                        save = false;

                    for (it = gifting.history.records.length - 1; it >= 0; it -= 1) {
                        if ($u.isNaN(gifting.history.records[it]['userId']) || gifting.history.records[it]['userId'] < 1) {
                            con.warn("gifting.history.fix - delete", gifting.history.records[it]);
                            gifting.history.records.splice(it, 1);
                            save = true;
                        }
                    }

                    if (save) {
                        gifting.save("history");
                    }

                    return save;
                } catch (err) {
                    con.error("ERROR in gifting.history.fix: " + err);
                    return undefined;
                }
            },

            getIds: function () {
                try {
                    var it = 0,
                        ids = [];

                    for (it = gifting.history.records.length - 1; it >= 0; it -= 1) {
                        if (!$u.isNaN(gifting.history.records[it]['userId']) && gifting.history.records[it]['userId'] > 1) {
                            ids.push(gifting.history.records[it]['userId']);
                        }
                    }

                    return ids;
                } catch (err) {
                    con.error("ERROR in gifting.history.getIds: " + err);
                    return undefined;
                }
            },

            hbest: 0,

            received: function (record) {
                try {
                    if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                        throw "Not passed a record";
                    }

                    if ($u.isNaN(record['userId']) || record['userId'] < 1) {
                        con.warn("userId", record['userId']);
                        throw "Invalid identifying userId!";
                    }

                    var it        = 0,
                        len       = 0,
                        success   = false,
                        newRecord = {};

                    for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                        if (gifting.history.records[it]['userId'] === record['userId']) {
                            if (gifting.history.records[it]['name'] !== record['name']) {
                                gifting.history.records[it]['name'] = record['name'];
                            }

                            gifting.history.records[it]['received'] += 1;
                            gifting.history.records[it]['lastReceived'] = Date.now();
                            success = true;
                            break;
                        }
                    }

                    if (success) {
                        con.log(2, "Updated gifting.history record", gifting.history.records[it], gifting.history.records);
                    } else {
                        newRecord = new gifting.history.record();
                        newRecord.data['userId'] = record['userId'];
                        newRecord.data['name'] = record['name'];
                        newRecord.data['received'] = 1;
                        newRecord.data['lastReceived'] = Date.now();
                        gifting.history.records.push(newRecord.data);
                        con.log(2, "Added gifting.history record", newRecord.data, gifting.history.records);
                    }

                    gifting.save("history");
                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.history.received: " + err, record);
                    return false;
                }
            },

            sent: function (record) {
                try {
                    if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                        throw "Not passed a record";
                    }

                    if ($u.isNaN(record['userId']) || record['userId'] < 1) {
                        con.warn("userId", record['userId']);
                        throw "Invalid identifying userId!";
                    }

                    var it        = 0,
                        len       = 0,
                        success   = false,
                        newRecord = {};

                    for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                        if (gifting.history.records[it]['userId'] === record['userId']) {
                            if (gifting.history.records[it]['name'] !== record['name']) {
                                gifting.history.records[it]['name'] = record['name'];
                            }

                            gifting.history.records[it]['sent'] += 1;
                            gifting.history.records[it]['lastSent'] = Date.now();
                            success = true;
                            break;
                        }
                    }

                    if (success) {
                        con.log(2, "Updated gifting.history record", gifting.history.records[it], gifting.history.records);
                    } else {
                        newRecord = new gifting.history.record();
                        newRecord.data['userId'] = record['userId'];
                        newRecord.data['name'] = record['name'];
                        newRecord.data['sent'] = 1;
                        newRecord.data['lastSent'] = Date.now();
                        gifting.history.records.push(newRecord.data);
                        con.log(2, "Added gifting.history record", newRecord.data, gifting.history.records);
                    }

                    gifting.save("history");
                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.history.sent: " + err, record);
                    return false;
                }
            },

            checkSentOnce: function (userId) {
                try {
                    if ($u.isNaN(userId) || userId < 1) {
                        con.warn("userId", userId);
                        throw "Invalid identifying userId!";
                    }

                    var it       = 0,
                        len      = 0,
                        sentOnce = false,
                        time     = config.getItem("OneGiftPerPersonDelaySecs", 24);

                    time = (time < 1 ? 1 : time) * 3600;
                    for (it = 0, len = gifting.history.records.length; it < len; it += 1) {
                        if (gifting.history.records[it]['userId'] !== userId) {
                            continue;
                        }

                        sentOnce = !schedule.since(gifting.history.records[it]['lastSent'] || 0, time);
                        break;
                    }

                    return sentOnce;
                } catch (err) {
                    con.error("ERROR in gifting.history.checkSentOnce: " + err, userId);
                    return undefined;
                }
            },
            /*jslint sub: false */

            length: function () {
                try {
                    return gifting.history.records.length;
                } catch (err) {
                    con.error("ERROR in gifting.history.length: " + err);
                    return undefined;
                }
            },

            /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
            /*jslint sub: true */
            dashboard: function () {
                try {
                    /*-------------------------------------------------------------------------------------\
                    Next we build the HTML to be included into the 'caap_giftStats' div. We set our
                    table and then build the header row.
                    \-------------------------------------------------------------------------------------*/
                    if (config.getItem('DBDisplay', '') === 'Gifting Stats' && session.getItem("GiftHistoryDashUpdate", true)) {
                        var headers                  = ['UserId', 'Name', 'Received', 'Sent'],
                            values                   = ['userId', 'name', 'received', 'sent'],
                            pp                       = 0,
                            i                        = 0,
                            userIdLink               = '',
                            userIdLinkInstructions   = '',
                            len                      = 0,
                            len1                     = 0,
                            str                      = '',
                            data                     = {text: '', color: '', bgcolor: '', id: '', title: ''},
                            handler                  = null,
                            head                     = '',
                            body                     = '',
                            row                      = '';

                        for (pp = 0, len = headers.length; pp < len; pp += 1) {
                            head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                        }

                        head = caap.makeTr(head);
                        for (i = 0, len = gifting.history.records.length; i < len; i += 1) {
                            row = "";
                            for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                                str = $u.setContent(gifting.history.records[i][values[pp]], '');
                                if (/userId/.test(values[pp])) {
                                    userIdLinkInstructions = "Clicking this link will take you to the user keep of " + str;
                                    //userIdLink = caap.domain.link + "/keep.php?casuser=" + str;
                                    userIdLink = "keep.php?casuser=" + str;
                                    data = {
                                        text  : '<span id="caap_targetgift_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                                '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + str + '</span>',
                                        color : 'blue',
                                        id    : '',
                                        title : ''
                                    };

                                    row += caap.makeTd(data);
                                } else {
                                    row += caap.makeTd({text: str, color: '', id: '', title: ''});
                                }
                            }

                            body += caap.makeTr(row);
                        }

                        $j("#caap_giftStats", caap.caapTopObject).html(
                            $j(caap.makeTable("gifting_history", head, body)).dataTable({
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

                        $j("span[id*='caap_targetgift_']", caap.caapTopObject).off('click', handler).click(handler);
                        session.setItem("GiftHistoryDashUpdate", false);
                    }

                    return true;
                } catch (err) {
                    con.error("ERROR in gifting.history.dashboard: " + err);
                    return false;
                }
            }
            /*jslint sub: false */
        }
    };

    /* This section is added to allow Advanced Optimisation by the Closure Compiler */
    /*jslint sub: true */
    window['gifting'] = gifting;
    gifting['gifts'] = gifting.gifts;
    gifting['queue'] = gifting.queue;
    gifting['history'] = gifting.history;
    /*jslint sub: false */
