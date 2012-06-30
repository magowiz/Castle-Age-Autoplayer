    ////////////////////////////////////////////////////////////////////
    //                          guild_monster OBJECT
    // this is the main object for dealing with guild monsters
    /////////////////////////////////////////////////////////////////////

    guild_monster = {
        records: [],

        record: function () {
            this.data = {
                'name'        : '',
                'guildId'     : '',
                'slot'        : 0,
                'ticker'      : '',
                'minions'     : [],
                'attacks'     : 1,
                'damage'      : 0,
                'myStatus'    : '',
                'reviewed'    : 0,
                'state'       : '',
                'enemyHealth' : 0,
                'guildHealth' : 0,
                'conditions'  : '',
                'color'       : $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"))
            };
        },

        minion: function () {
            this.data = {
                'attacking_position' : 0,
                'target_id'          : 0,
                'name'               : '',
                'level'              : 0,
                'mclass'             : '',
                'healthNum'          : 0,
                'healthMax'          : 0,
                'status'             : '',
                'percent'            : 0
            };
        },

        me: function () {
            this.data = {
                'name'               : '',
                'level'              : 0,
                'mclass'             : '',
                'healthNum'          : 0,
                'healthMax'          : 0,
                'status'             : '',
                'percent'            : 0
            };
        },

        info: {
            "Vincent": {
                twt2     : "vincent",
                special1 : [0],
                special2 : [1],
                health   : [100, 200, 400, 800],
                cta_img  : ['cta_vincent.gif'],
                enemy    : 100
            },
            "Alpha Vincent": {
                twt2     : "alpha_vincent",
                special1 : [0],
                special2 : [1],
                health   : [500, 1000, 2000, 4000],
                cta_img  : ['cta_alphavincent.gif'],
                enemy    : 100
            },
            "Army of the Apocalypse": {
                twt2     : "ca_girls",
                special1 : [0, 25, 50, 75],
                special2 : [1, 2, 3, 4],
                health   : [500, 1000, 2000, 4000],
                cta_img  : [],
                enemy    : 100
            },
            "Giant Arachnid": {
                twt2     : "giant_arachnid",
                special1 : [0],
                special2 : [1],
                health   : [100, 200, 400, 800],
                cta_img  : ['cta_spider.jpg'],
                enemy    : 24
            }
        },

        enableSpider: function () {
            try {
                var ladies   = $j("div[style*='monster_summon_ladies.jpg']", caap.appBodyDiv).parent(),
                    cloned   = ladies.clone(),
                    tempText = '',
                    tempDiv;

                tempDiv = $j("div[style*='monster_summon_ladies.jpg']", cloned);
                tempText = tempDiv.attr("style").replace("ladies", "spider");
                tempDiv.attr("style", tempText);
                tempDiv = $j("div[style*='guild_summon_monster_progress_bar.jpg']", cloned);
                tempText = caap.resultsText.hasIndexOf("Giant Arachnid :") ? $u.setContent($j("img[src*='nm_class_progress.jpg']", caap.appBodyDiv).parent().css("width"), "0px") : "0px";
                tempDiv.css("width", tempText);
                tempDiv = $j("input[name='b_type']", cloned);
                tempDiv.val("spider");
                ladies.before(cloned);
                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.which: " + err);
                return false;
            }
        },

        getCtaName: function (img) {
            return guild_monster.which(img, "cta_img");
        },

        which: function (img, entity) {
            try {
                if (!$u.hasContent(img) || !$u.isString(img)) {
                    con.warn("img", img);
                    throw "Invalid identifying img!";
                }

                if (!$u.hasContent(entity) || !$u.isString(entity)) {
                    con.warn("entity", entity);
                    throw "Invalid entity name!";
                }

                var i    = '',
                    k    = 0,
                    r    = {},
                    name = '';

                for (i in guild_monster.info) {
                    if (guild_monster.info.hasOwnProperty(i)) {
                        if ($u.hasContent(name)) {
                            break;
                        }

                        r = guild_monster.info[i];
                        if (!$u.hasContent(r) || !$u.hasContent(r[entity]) || !$j.isArray(r[entity])) {
                            continue;
                        }

                        for (k = 0; k < r[entity].length; k += 1) {
                            if (img === r[entity][k]) {
                                name = i;
                                break;
                            }
                        }
                    }
                }

                return name;
            } catch (err) {
                con.error("ERROR in guild_monster.which: " + err);
                return undefined;
            }
        },

        load: function () {
            try {
                guild_monster.records = gm.getItem('guild_monster.records', 'default');
                if (guild_monster.records === 'default' || !$j.isArray(guild_monster.records)) {
                    guild_monster.records = gm.setItem('guild_monster.records', []);
                }

                session.setItem("GuildMonsterDashUpdate", true);
                con.log(3, "guild_monster.load", guild_monster.records);
                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.load: " + err);
                return false;
            }
        },

        save: function (src) {
            try {
                if (caap.domain.which === 3) {
                    caap.messaging.setItem('guild_monster.records', guild_monster.records);
                } else {
                    gm.setItem('guild_monster.records', guild_monster.records);
                    con.log(3, "guild_monster.save", guild_monster.records);
                    if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                        con.log(2, "guild_monster.save send");
                        caap.messaging.setItem('guild_monster.records', guild_monster.records);
                    }
                }

                if (caap.domain.which !== 0) {
                    session.setItem("GuildMonsterDashUpdate", true);
                }

                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.save: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getItem: function (slot) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false,
                    newRecord = {};

                if (!$u.isNumber(slot)) {
                    con.warn("slot", slot);
                    throw "Invalid identifying slot!";
                }

                if (slot === '') {
                    return '';
                }

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === slot) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    con.log(3, "Got guild_monster record", slot, guild_monster.records[it]);
                    return guild_monster.records[it];
                } else {
                    newRecord = new guild_monster.record();
                    newRecord.data['slot'] = slot;
                    con.log(3, "New guild_monster record", slot, newRecord.data);
                    return newRecord.data;
                }
            } catch (err) {
                con.error("ERROR in guild_monster.getItem: " + err);
                return false;
            }
        },

        setItem: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (!$u.isNumber(record['slot']) || record['slot'] <= 0) {
                    con.warn("slot", record['slot']);
                    throw "Invalid identifying slot!";
                }

                var it      = 0,
                    len     = 0,
                    success = false;

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === record['slot']) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    guild_monster.records[it] = record;
                    con.log(3, "Updated guild_monster record", record, guild_monster.records);
                } else {
                    guild_monster.records.push(record);
                    con.log(3, "Added guild_monster record", record, guild_monster.records);
                }

                guild_monster.save();
                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.setItem: " + err);
                return false;
            }
        },

        deleteItem: function (slot) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false;

                if (!$u.isNumber(slot) || slot <= 0) {
                    con.warn("slot", slot);
                    throw "Invalid identifying slot!";
                }

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === slot) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    guild_monster.records.splice(it, 1);
                    guild_monster.save();
                    con.log(3, "Deleted guild_monster record", slot, guild_monster.records);
                    return true;
                } else {
                    con.warn("Unable to delete guild_monster record", slot, guild_monster.records);
                    return false;
                }
            } catch (err) {
                con.error("ERROR in guild_monster.deleteItem: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        clear: function () {
            try {
                con.log(1, "guild_monster.clear");
                guild_monster.records = [];
                guild_monster.save();
                state.setItem('staminaGuildMonster', 0);
                state.setItem('targetGuildMonster', {});
                session.setItem("GuildMonsterDashUpdate", true);
                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.clear: " + err);
                return false;
            }
        },

        navigate_to_main: function () {
            return caap.navigateTo('guild', 'tab_guild_main_on.gif');
        },

        navigate_to_battles_refresh: function () {
            var button = caap.checkForImage("guild_monster_tab_on.jpg");
            if ($u.hasContent(button)) {
                caap.click(button);
            }

            state.setItem('guildMonsterBattlesRefresh', false);
            return $u.hasContent(button);
        },

        navigate_to_battles: function () {
            return caap.navigateTo('guildv2_monster_summon_list,guildv2_current_monster_battles', 'guild_monster_list_on.jpg');
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        populate: function () {
            try {
                var buttons = $j("input[src*='guild_battle_']"),
                    slotArr = [],
                    it      = 0;

                if (buttons && buttons.length) {
                    buttons.each(function () {
                        var button        = $j(this),
                            form          = null,
                            currentRecord = {},
                            imageName     = '',
                            slot          = 0,
                            name          = '',
                            guildId       = '',
                            passed        = true;

                        form = button.parents("form").eq(0);
                        if (form && form.length) {
                            slot = form.find("input[name='slot']").eq(0).attr("value");
                            slot = slot ? slot.parseInt() : 0;
                            if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                                con.log(3, "slot", slot);
                                slotArr.push(slot);
                                currentRecord = guild_monster.getItem(slot);
                                name = button.parents().eq(4).text();
                                name = name.replace ("has  been summoned!", "");
                                name = name.replace ("Join Battle!", "");
                                name = name.replace ("Collect Now!", "");
                                name = name ? name.trim() : '';
                                if (name) {
                                    if (currentRecord['name'] !== name) {
                                        con.log(1, "Updated name", currentRecord['name'], name);
                                        currentRecord['name'] = name;
                                    }
                                } else {
                                    con.warn("name error", name);
                                    passed = false;
                                }

                                guildId = form.find("input[name='guild_id']").eq(0).attr("value");
                                if (caap.stats['guild']['id'] && guildId === caap.stats['guild']['id']) {
                                    if (currentRecord['guildId'] !== guildId) {
                                        con.log(2, "Updated guildId", currentRecord['guildId'], guildId);
                                        currentRecord['guildId'] = guildId;
                                    }
                                } else {
                                    con.warn("guildId error", guildId, caap.stats['guild']['id']);
                                    passed = false;
                                }

                                imageName = button.attr("src").basename();
                                if (imageName) {
                                    switch (imageName) {
                                    case "guild_battle_joinbtn.gif":
                                        currentRecord['color'] = $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"));
                                        currentRecord['state'] = "Alive";
                                        break;
// Need to find the image for dragon_list_btn_4.jpg. Its view or fail, might no longer be in use
                                    case "guild_battle_collectbtn.gif":
                                    case "dragon_list_btn_4.jpg":
                                        currentRecord['color'] = "grey";
                                        if (currentRecord['state'] !== "Completed") {
                                            con.log(2, "Updated state", currentRecord['state'], "Collect");
                                            currentRecord['state'] = "Collect";
                                        }

                                        break;
                                    default:
                                        currentRecord['state'] = "Error";
                                        con.warn("state error", imageName);
                                        passed = false;
                                    }
                                } else {
                                    con.warn("imageName error", button.attr("src"), imageName);
                                    passed = false;
                                }
                            } else {
                                con.warn("slot error", slot);
                                passed = false;
                            }
                        } else {
                            con.warn("form error", button);
                            passed = false;
                        }

                        if (passed) {
                            con.log(2, "currentRecord/button", currentRecord, button);
                            guild_monster.setItem(currentRecord);
                        } else {
                            con.warn("populate record failed", currentRecord, button);
                        }
                    });

                    for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                        if (!slotArr.hasIndexOf(guild_monster.records[it]['slot'])) {
                            guild_monster.deleteItem(guild_monster.records[it]['slot']);
                        }
                    }

                    guild_monster.select(true);
                } else {
                    con.log(1, "No buttons found");
                    guild_monster.clear();
                }

                caap.updateDashboard(true);
                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.populate: " + err);
                return false;
            }
        },

        onMonster: function () {
            try {
                var gates         = $j(),
                    health        = $j(),
                    healthGuild   = $j(),
                    healthEnemy   = $j(),
                    allowedDiv    = $j(),
                    bannerDiv     = $j(),
                    collectDiv    = $j(),
                    tempDiv       = $j(),
                    tempTxt       = '',
                    collect       = false,
                    myStatsTxt    = '',
                    myStatsArr    = [],
                    slot          = 0,
                    currentRecord = {},
                    minionRegEx   = new RegExp("(.*) Level (\\d+) Class: (.*) Health: (.+)/(.+) Status: (.*)");

                caap.chatLink(caap.appBodyDiv, "#" +  caap.domain.id[caap.domain.which] + "guild_war_chat_log div[style*='border-bottom: 1px'] div[style*='font-size: 15px']");
                slot = $j("input[name='slot']").eq(0).attr("value");
                slot = slot ? slot.parseInt() : 0;
                bannerDiv = $j("#" +  caap.domain.id[caap.domain.which] + "guild_battle_banner_section");
                myStatsTxt = bannerDiv.children().eq(2).children().eq(0).children().eq(1).text();
                myStatsTxt = myStatsTxt ? myStatsTxt.trim().innerTrim() : '';
                if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                    con.log(3, "slot", slot);
                    currentRecord = guild_monster.getItem(slot);
                    currentRecord['minions'] = [];
                    currentRecord['ticker'] = '';
                    currentRecord['guildHealth'] = 0;
                    currentRecord['enemyHealth'] = 0;
                    if (!bannerDiv.attr("style").match(/_dead/)) {
                        currentRecord['ticker'] = $j("#" +  caap.domain.id[caap.domain.which] + "monsterTicker").text();
                        currentRecord['ticker'] = currentRecord['ticker'] ? currentRecord['ticker'].trim() : '';
                        if (myStatsTxt) {
                            con.log(3, "myStatsTxt", myStatsTxt);
                            myStatsArr = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (\\d+)/(\\d+).+Status: (.+) Battle Damage: (\\d+)"));
                            if (myStatsArr && myStatsArr.length === 8) {
                                con.log(2, "myStatsArr", myStatsArr);
                                currentRecord['damage'] = myStatsArr[7] ? myStatsArr[7].parseInt() : 0;
                                currentRecord['myStatus'] = myStatsArr[6] ? myStatsArr[6].trim() : '';
                            } else {
                                con.warn("myStatsArr error", myStatsArr, myStatsTxt);
                            }
                        }

                        allowedDiv = $j("#" +  caap.domain.id[caap.domain.which] + "allowedAttacks");
                        if (allowedDiv && allowedDiv.length) {
                            currentRecord['attacks'] = allowedDiv.attr("value") ? allowedDiv.attr("value").parseInt() : 1;
                            if (currentRecord['attacks'] < 1 || currentRecord['attacks'] > 5) {
                                currentRecord['attacks'] = 1;
                                con.warn("Invalid allowedAttacks");
                            }
                        } else {
                            con.warn("Could not find allowedAttacks");
                        }

                        health = $j("#" +  caap.domain.id[caap.domain.which] + "guild_battle_health");
                        if (health && health.length) {
                            healthEnemy = $j("div[style*='guild_battle_bar_enemy.gif']", health).eq(0);
                            if ($u.hasContent(healthEnemy)) {
                                currentRecord['enemyHealth'] = (100 - healthEnemy.getPercent('width')).dp(2);
                            } else {
                                con.warn("guild_battle_bar_enemy.gif not found");
                            }

                            healthGuild = $j("div[style*='guild_battle_bar_you.gif']", health).eq(0);
                            if ($u.hasContent(healthGuild)) {
                                currentRecord['guildHealth'] = (100 - healthGuild.getPercent('width')).dp(2);
                            } else {
                                con.warn("guild_battle_bar_you.gif not found");
                            }

                            tempDiv = $j("span", health);
                            if ($u.hasContent(tempDiv) && tempDiv.length === 2) {
                                tempTxt = tempDiv.eq(0).text().trim();
                                tempDiv.eq(0).text(tempTxt + " (" + currentRecord['guildHealth'] + "%)");
                                tempTxt = tempDiv.eq(1).text().trim();
                                tempDiv.eq(1).text(tempTxt + " (" + currentRecord['enemyHealth'] + "%)");
                            }
                        } else {
                            con.warn("guild_battle_health error");
                        }

                        gates = $j("div[id*='" +  caap.domain.id[caap.domain.which] + "enemy_guild_member_list_']");
                        if (!gates || !gates.length) {
                            con.warn("No gates found");
                        } else if (gates && gates.length !== 4) {
                            con.warn("Not enough gates found");
                        } else {
                            gates.each(function (gIndex) {
                                var memberDivs = $j(this).children();
                                if (!memberDivs || !memberDivs.length) {
                                    con.warn("No members found");
                                } else if (memberDivs && memberDivs.length !== guild_monster.info[currentRecord['name']]['enemy'] / 4) {
                                    con.warn("Not enough members found", memberDivs);
                                } else {
                                    memberDivs.each(function (mIndex) {
                                        var member       = $j(this),
                                            memberText   = '',
                                            memberArr    = [],
                                            targetIdDiv  = $j(),
                                            memberRecord = new guild_monster.minion().data;

                                        memberRecord['attacking_position'] = (gIndex + 1);
                                        targetIdDiv = member.find("input[name='target_id']").eq(0);
                                        if (targetIdDiv && targetIdDiv.length) {
                                            memberRecord['target_id'] = targetIdDiv.attr("value") ? targetIdDiv.attr("value").parseInt() : 1;
                                        } else {
                                            con.warn("Unable to find target_id for minion!", member);
                                        }

                                        memberText = member.children().eq(1).text();
                                        memberText = memberText ? memberText.trim().innerTrim() : '';
                                        memberArr = memberText.match(minionRegEx);
                                        if (memberArr && memberArr.length === 7) {
                                            memberRecord['name'] = memberArr[1] ? memberArr[1] : '';
                                            memberRecord['level'] = memberArr[2] ? memberArr[2].parseInt() : 0;
                                            memberRecord['mclass'] = memberArr[3] ? memberArr[3] : '';
                                            memberRecord['healthNum'] = memberArr[4] ? memberArr[4].parseInt() : 0;
                                            memberRecord['healthMax'] = memberArr[5] ? memberArr[5].parseInt() : 1;
                                            memberRecord['status'] = memberArr[6] ? memberArr[6] : '';
                                            memberRecord['percent'] = ((memberRecord['healthNum'] / memberRecord['healthMax']) * 100).dp(2);
                                        }

                                        currentRecord['minions'].push(memberRecord);
                                    });
                                }
                            });
                        }
                    } else {
                        collectDiv = $j("input[src*='collect_reward_button2.jpg']");
                        if (collectDiv && collectDiv.length) {
                            con.log(1, "Monster is dead and ready to collect");
                            currentRecord['state'] = 'Collect';
                            if (config.getItem('guildMonsterCollect', false)) {
                                collect = true;
                            }
                        } else {
                            con.log(1, "Monster is completed");
                            currentRecord['state'] = 'Completed';
                        }

                        currentRecord['color'] = "grey";
                    }

                    currentRecord['reviewed'] = Date.now();
                    con.log(2, "currentRecord", currentRecord);
                    guild_monster.setItem(currentRecord);
                    if (collect) {
                        caap.click(collectDiv);
                    }
                } else {
                    if (bannerDiv.children().eq(0).text().hasIndexOf("You do not have an on going guild monster battle. Have your Guild initiate more!")) {
                        slot = state.getItem('guildMonsterReviewSlot', 0);
                        if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                            con.log(1, "monster expired", slot);
                            guild_monster.deleteItem(slot);
                        } else {
                            con.warn("monster expired slot error", slot);
                        }
                    } else {
                        con.log(1, "On another guild's monster", myStatsTxt);
                    }
                }

                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.onMonster: " + err);
                return false;
            }
        },

        getReview: function () {
            try {
                var it     = 0,
                    len    = 0;

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['state'] === 'Completed') {
                        continue;
                    }

                    if (!schedule.since(guild_monster.records[it]['reviewed'], 30 * 60)) {
                        continue;
                    }

                    break;
                }

                return guild_monster.records[it];
            } catch (err) {
                con.error("ERROR in guild_monster.getReview: " + err);
                return undefined;
            }
        },

        checkPage: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                var slot = 0;
                slot = $j("input[name='slot']").eq(0).attr("value");
                slot = slot ? slot.parseInt() : 0;
                return (record['slot'] === slot);
            } catch (err) {
                con.error("ERROR in guild_monster.checkPage: " + err);
                return undefined;
            }
        },

        getTargetMinion: function (record) {
            try {
                var it              = 0,
                    ol              = 0,
                    len             = 0,
                    alive           = 0,
                    minion          = {},
                    minHealth       = 0,
                    specialTargets  = [],
                    firstSpecial    = -1,
                    ignoreClerics   = false,
                    attackOrderList = [],
                    isSpecial       = false,
                    isMatch         = false,
                    attackNorth     = config.getItem('attackGateNorth', true),
                    attackEast      = config.getItem('attackGateEast', true),
                    attackSouth     = config.getItem('attackGateSouth', true),
                    attackWest      = config.getItem('attackGateWest', true);

                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                minHealth = config.getItem('IgnoreMinionsBelow', 0);
                if (!$u.isNumber(minHealth)) {
                    minHealth = 0;
                }

                attackOrderList = config.getList('orderGuildMinion', '');
                if (!attackOrderList || attackOrderList.length === 0) {
                    attackOrderList = [String.fromCharCode(0)];
                    con.log(2, "Added null character to getTargetMinion attackOrderList", attackOrderList);
                }

                ignoreClerics = config.getItem('ignoreClerics', false);
                for (ol = 0, len = attackOrderList.length; ol < len; ol += 1) {
                    if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                        con.log(2, "Minion matched and set - break", minion);
                        break;
                    }

                    specialTargets = guild_monster.info[record['name']].special1.slice();
                    for (it = record['minions'].length - 1; it >= 0; it -= 1) {
                        if (!attackNorth && record['minions'][it]['attacking_position'] === 1) {
                            con.log(2, "Skipping North Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackWest && record['minions'][it]['attacking_position'] === 2) {
                            con.log(2, "Skipping West Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackEast && record['minions'][it]['attacking_position'] === 3) {
                            con.log(2, "Skipping East Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackSouth && record['minions'][it]['attacking_position'] === 4) {
                            con.log(2, "Skipping South Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (attackOrderList[ol] === String.fromCharCode(0)) {
                            isMatch = true;
                        } else {
                            isMatch = !record['minions'][it]['name'].toLowerCase().hasIndexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase());
                        }

                        if (isMatch) {
                            con.log(2, "Minion matched", it, record['minions'][it]);
                        }

                        isSpecial = specialTargets.hasIndexOf(it);
                        if (record['minions'][it]['status'] === 'Stunned') {
                            if (isSpecial && $u.isNaN(record['minions'][it]['healthNum'])) {
                                specialTargets.pop();
                                if (isMatch) {
                                    con.log(2, "Special minion stunned", specialTargets);
                                }
                            } else if (isMatch) {
                                con.log(2, "Minion stunned");
                            }

                            continue;
                        }

                        // need to look at this when next fighting one, don't think ignore cleric code is correct
                        if (isSpecial) {
                            if (!$u.isNaN(record['minions'][it]['healthNum'])) {
                                specialTargets.pop();
                                con.log(2, "Not special minion", it, specialTargets);
                                if (ignoreClerics && record['minions'][it]['mclass'] === "Cleric") {
                                    con.log(2, "Ignoring Cleric", record['minions'][it]);
                                    continue;
                                }
                            } else if (firstSpecial < 0) {
                                firstSpecial = it;
                                con.log(2, "firstSpecial minion", firstSpecial);
                            } else {
                                con.log(2, "Special minion", it, specialTargets);
                            }
                        } else {
                            if (ignoreClerics && record['minions'][it]['mclass'] === "Cleric") {
                                con.log(2, "Ignoring Cleric", record['minions'][it]);
                                continue;
                            }
                        }

                        if (minHealth && !isSpecial) {
                            if (record['minions'][it]['healthNum'] < minHealth) {
                                if (!alive) {
                                    alive = it;
                                    con.log(2, "First alive", alive);
                                }

                                continue;
                            }
                        }

                        if (!isMatch) {
                            continue;
                        }

                        minion = record['minions'][it];
                        break;
                    }
                }

                if ($j.isEmptyObject(minion) && firstSpecial >= 0) {
                    minion = record['minions'][firstSpecial];
                    con.log(2, "Target Special", firstSpecial, record['minions'][firstSpecial]);
                }

                if (config.getItem('chooseIgnoredMinions', false) && alive) {
                    minion = record['minions'][alive];
                    con.log(2, "Target Alive", alive, record['minions'][alive]);
                }

                con.log(2, "Target minion", minion);
                return minion;
            } catch (err) {
                con.error("ERROR in guild_monster.getTargetMinion: " + err);
                return undefined;
            }
        },

        select: function (force) {
            try {
                var it              = 0,
                    ol              = 0,
                    len             = 0,
                    len1            = 0,
                    attackOrderList = [],
                    conditions      = '',
                    ach             = 999999,
                    max             = 999999,
                    target          = {},
                    firstOverAch    = {},
                    firstUnderMax   = {};

                if (!(force || caap.oneMinuteUpdate('selectGuildMonster'))) {
                    return state.getItem('targetGuildMonster', {});
                }

                state.setItem('targetGuildMonster', {});
                attackOrderList = config.getList('orderGuildMonster', '');
                if (!attackOrderList || attackOrderList.length === 0) {
                    attackOrderList = [String.fromCharCode(0)];
                    con.log(3, "Added null character to select attackOrderList", attackOrderList);
                }

                for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                    if (guild_monster.records[it]['state'] !== 'Alive') {
                        guild_monster.records[it]['color'] = "grey";
                        guild_monster.records[it]['conditions'] = '';
                        continue;
                    }

                    attackOrderList.push(guild_monster.records[it]['slot'].toString());
                    guild_monster.records[it]['conditions'] = 'none';
                    guild_monster.records[it]['color'] = $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"));
                }

                for (ol = 0, len1 = attackOrderList.length; ol < len1; ol += 1) {
                    conditions = attackOrderList[ol].replace(new RegExp("^[^:]+"), '').toString().trim();
                    for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                        if (guild_monster.records[it]['state'] !== 'Alive') {
                            guild_monster.records[it]['color'] = "grey";
                            continue;
                        }

                        if (guild_monster.records[it]['myStatus'] === 'Stunned') {
                            guild_monster.records[it]['color'] = "purple";
                            continue;
                        }

                        if (guild_monster.records[it]['conditions'] !== 'none') {
                            continue;
                        }

                        if (attackOrderList[ol] !== String.fromCharCode(0)) {
                            if (!(guild_monster.records[it]['slot'] + " " + guild_monster.records[it]['name'].toLowerCase()).hasIndexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase())) {
                                continue;
                            }
                        }

                        if (conditions) {
                            guild_monster.records[it]['conditions'] = conditions;
                            if (conditions.hasIndexOf("ach")) {
                                ach = monster.parseCondition('ach', conditions);
                            }

                            if (conditions.hasIndexOf("max")) {
                                max = monster.parseCondition('max', conditions);
                            }
                        }

                        if (guild_monster.records[it]['damage'] >= ach) {
                            guild_monster.records[it]['color'] = "darkorange";
                            if (!firstOverAch || !$j.isPlainObject(firstOverAch) || $j.isEmptyObject(firstOverAch)) {
                                if (guild_monster.records[it]['damage'] >= max) {
                                    guild_monster.records[it]['color'] = "red";
                                    con.log(2, 'OverMax', guild_monster.records[it]);
                                } else {
                                    firstOverAch = guild_monster.records[it];
                                    con.log(2, 'firstOverAch', firstOverAch);
                                }
                            }
                        } else if (guild_monster.records[it]['damage'] < max) {
                            if (!firstUnderMax || !$j.isPlainObject(firstUnderMax) || $j.isEmptyObject(firstUnderMax)) {
                                firstUnderMax = guild_monster.records[it];
                                con.log(2, 'firstUnderMax', firstUnderMax);
                            }
                        } else {
                            guild_monster.records[it]['color'] = "red";
                            con.log(2, 'OverMax', guild_monster.records[it]);
                        }
                    }
                }

                target = firstUnderMax;
                if (!target || !$j.isPlainObject(target) || $j.isEmptyObject(target)) {
                    target = firstOverAch;
                }

                con.log(2, 'Guild Monster Target', target);
                if (target && $j.isPlainObject(target) && !$j.isEmptyObject(target)) {
                    target['color'] = 'green';
                    guild_monster.setItem(target);
                } else {
                    state.setItem('guildMonsterBattlesBurn', false);
                    guild_monster.save();
                }

                return state.setItem('targetGuildMonster', target);
            } catch (err) {
                con.error("ERROR in guild_monster.select: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        attack2stamina: {
            1: 1,
            2: 5,
            3: 10,
            4: 20,
            5: 50
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getAttackValue: function (record, minion) {
            try {
                if (!minion || !$j.isPlainObject(minion)) {
                    throw "Not passed a minion";
                }

                var attack         = 0,
                    recordInfo     = guild_monster.info[record['name']],
                    specialTargets = recordInfo.special2.slice();

                if (specialTargets.hasIndexOf(minion['target_id']) && $u.isNaN(minion['healthNum'])) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else if (caap.stats['staminaT']['num'] < 50) {
                        attack = 4;
                    } else {
                        attack = 5;
                    }
                } else if (minion['healthNum'] < recordInfo.health[0]) {
                    attack = 1;
                } else if (minion['healthNum'] < recordInfo.health[1]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else {
                        attack = 2;
                    }
                } else if (minion['healthNum'] < recordInfo.health[2]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else {
                        attack = 3;
                    }
                } else if (minion['healthNum'] < recordInfo.health[3]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else {
                        attack = 4;
                    }
                } else {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else if (caap.stats['staminaT']['num'] < 50) {
                        attack = 4;
                    } else {
                        attack = 5;
                    }
                }

                if (attack > record['attacks']) {
                    attack = record['attacks'];
                }

                con.log(2, 'getAttackValue', attack);
                return attack;
            } catch (err) {
                con.error("ERROR in guild_monster.getAttackValue: " + err);
                return undefined;
            }
        },

        getStaminaValue: function (record, minion) {
            try {
                if (!minion || !$j.isPlainObject(minion)) {
                    throw "Not passed a minion";
                }

                var stamina        = 0,
                    staminaCap     = 0,
                    recordInfo     = guild_monster.info[record['name']],
                    specialTargets = recordInfo.special2.slice();

                if (specialTargets.hasIndexOf(minion['target_id']) && $u.isNaN(minion['healthNum'])) {
                    stamina = 50;
                } else if (minion['healthNum'] < recordInfo.health[0]) {
                    stamina = 1;
                } else if (minion['healthNum'] < recordInfo.health[1]) {
                    stamina = 5;
                } else if (minion['healthNum'] < recordInfo.health[2]) {
                    stamina = 10;
                } else if (minion['healthNum'] < recordInfo.health[3]) {
                    stamina = 20;
                } else {
                    stamina = 50;
                }

                staminaCap = guild_monster.attack2stamina[record['attacks']];
                if (stamina > staminaCap) {
                    stamina = staminaCap;
                }

                con.log(2, 'getStaminaValue', stamina);
                return stamina;
            } catch (err) {
                con.error("ERROR in guild_monster.getStaminaValue: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        menu: function () {
            try {
                // Guild Monster controls
                var mbattleList = [
                        'Stamina Available',
                        'At Max Stamina',
                        'At X Stamina',
                        'Never'
                    ],
                    mbattleInst = [
                        'Stamina Available will attack whenever you have enough stamina',
                        'At Max Stamina will attack when stamina is at max and will burn down all stamina when able to level up',
                        'At X Stamina you can set maximum and minimum stamina to battle',
                        'Never - disables attacking monsters'
                    ],
                    htmlCode = '';

                htmlCode += caap.startToggle('GuildMonsters', 'GUILD MONSTERS');
                htmlCode += caap.makeDropDownTR("Attack When", 'WhenGuildMonster', mbattleList, mbattleInst, '', 'Never', false, false, 62);
                htmlCode += caap.startDropHide('WhenGuildMonster', '', 'Never', true);
                htmlCode += caap.startDropHide('WhenGuildMonster', 'XStamina', 'At X Stamina', false);
                htmlCode += caap.makeNumberFormTR("Start At Or Above", 'MaxStaminaToGMonster', '', 0, '', '', true, false);
                htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'MinStaminaToGMonster', '', 0, '', '', true, false);
                htmlCode += caap.endDropHide('WhenGuildMonster', 'XStamina');
                htmlCode += caap.makeCheckTR('Classic Monsters First', 'doClassicMonstersFirst', false, 'Prioritise the classic monsters and raids before Guild Monsters.');
                htmlCode += caap.makeCheckTR('Siege Monster', 'doGuildMonsterSiege', true, 'Perform siege assists when visiting your Guild Monster.');
                htmlCode += caap.makeCheckTR('Collect Rewards', 'guildMonsterCollect', false, 'Collect the rewards of your completed Guild Monsters.');
                htmlCode += caap.makeCheckTR("Do not Attack Clerics", 'ignoreClerics', false, "Do not attack Guild Monster's Clerics. Does not include the Gate minions e.g. Azriel");
                htmlCode += caap.makeTD("Attack Gates");
                htmlCode += caap.makeTD("N" + caap.makeCheckBox('attackGateNorth', true), false, true, "display: inline-block; width: 25%;");
                htmlCode += caap.makeTD("W" + caap.makeCheckBox('attackGateWest', true), false, true, "display: inline-block; width: 25%;");
                htmlCode += caap.makeTD("E" + caap.makeCheckBox('attackGateEast', true), false, true, "display: inline-block; width: 25%;");
                htmlCode += caap.makeTD("S" + caap.makeCheckBox('attackGateSouth', true), false, true, "display: inline-block; width: 25%;");
                htmlCode += caap.makeNumberFormTR("Ignore Below Health", 'IgnoreMinionsBelow', "Do not attack monster minions that have a health below this value.", 0, '', '');
                htmlCode += caap.makeCheckTR('Choose First Alive', 'chooseIgnoredMinions', false, 'When the only selection left is the monster general then go back and attack any previously ignored monster minions.');
                htmlCode += caap.makeTD("Attack Monsters in this order");
                htmlCode += caap.makeTextBox('orderGuildMonster', 'Attack your guild monsters in this order, can use Slot Number and Name. Control is provided by using :ach and :max', '', '');
                htmlCode += caap.makeTD("Attack Minions in this order");
                htmlCode += caap.makeTextBox('orderGuildMinion', 'Attack your guild minions in this order. Uses the minion name.', '', '');
                htmlCode += caap.endDropHide('WhenGuildMonster');
                htmlCode += caap.makeCheckTR('Enable Arachnid', 'enableSpider', true, 'Allows you to summon the Giant Arachnid.');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                con.error("ERROR in guild_monster.menu: " + err);
                return '';
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        dashboard: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                Next we build the HTML to be included into the 'caap_guildMonster' div. We set our
                table and then build the header row.
                \-------------------------------------------------------------------------------------*/
                if (config.getItem('DBDisplay', '') === 'Guild Monster' && session.getItem("GuildMonsterDashUpdate", true)) {
                    var color   = '',
                        headers = ['Slot', 'Name', 'Damage', 'Damage%',     'My Status', 'TimeLeft', 'Status', 'Link', '&nbsp;'],
                        values  = ['slot', 'name', 'damage', 'enemyHealth', 'myStatus',  'ticker',   'state'],
                        pp      = 0,
                        i       = 0,
                        len     = 0,
                        len1    = 0,
                        data    = {text: '', color: '', bgcolor: '', id: '', title: ''},
                        handler = null,
                        head    = '',
                        body    = '',
                        row     = '';

                    for (pp = 0; pp < headers.length; pp += 1) {
                        head += caap.makeTh({text: headers[pp], color: '', id: '', title: '', width: ''});
                    }

                    head = caap.makeTr(head);
                    for (i = 0, len = guild_monster.records.length; i < len; i += 1) {
                        row = "";
                        for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                            switch (values[pp]) {
                            case 'name' :
                                data = {
                                    text  : '<span id="caap_guildmonster_' + pp + '" title="Clicking this link will take you to (' + guild_monster.records[i]['slot'] + ') ' + guild_monster.records[i]['name'] +
                                            '" mname="' + guild_monster.records[i]['slot'] + '" rlink="guild_battle_monster.php?twt2=' + guild_monster.info[guild_monster.records[i]['name']].twt2 + '&guild_id=' + guild_monster.records[i]['guildId'] +
                                            '&slot=' + guild_monster.records[i]['slot'] + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + guild_monster.records[i]['name'] + '</span>',
                                    color : guild_monster.records[i]['color'],
                                    id    : '',
                                    title : ''
                                };

                                row += caap.makeTd(data);
                                break;
                            case 'ticker' :
                                row += caap.makeTd({text: $u.hasContent(guild_monster.records[i][values[pp]]) ? guild_monster.records[i][values[pp]].regex(/(\d+:\d+):\d+/) : '', color: guild_monster.records[i]['color'], id: '', title: ''});
                                break;
                            default :
                                row += caap.makeTd({text: $u.hasContent(guild_monster.records[i][values[pp]]) ? guild_monster.records[i][values[pp]] : '', color: guild_monster.records[i]['color'], id: '', title: ''});
                            }
                        }

                        data = {
                            //text  : '<a href="' + caap.domain.link + '/guild_battle_monster.php?twt2=' + guild_monster.info[guild_monster.records[i]['name']].twt2 +
                            text  : '<a href="' + caap.domain.altered + '/guild_battle_monster.php?twt2=' + guild_monster.info[guild_monster.records[i]['name']].twt2 +
                                    '&guild_id=' + guild_monster.records[i]['guildId'] + '&action=doObjective&slot=' + guild_monster.records[i]['slot'] + '&ref=nf">Link</a>',
                            color : 'blue',
                            id    : '',
                            title : 'This is a siege link.'
                        };

                        row += caap.makeTd(data);

                        if ($u.hasContent(guild_monster.records[i]['conditions']) && guild_monster.records[i]['conditions'] !== 'none') {
                            data = {
                                text  : '<span title="User Set Conditions: ' + guild_monster.records[i]['conditions'] + '" class="ui-icon ui-icon-info">i</span>',
                                color : guild_monster.records[i]['color'],
                                id    : '',
                                title : ''
                            };

                            row += caap.makeTd(data);
                        } else {
                            row += caap.makeTd({text: '', color: color, id: '', title: ''});
                        }

                        body += caap.makeTr(row);
                    }

                    $j("#caap_guildMonster", caap.caapTopObject).html(caap.makeTable("guild_monster", head, body));

                    handler = function (e) {
                        var visitMonsterLink = {
                                mname     : '',
                                arlink    : ''
                            },
                            i   = 0,
                            len = 0;

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'mname') {
                                visitMonsterLink.mname = e.target.attributes[i].nodeValue;
                            } else if (e.target.attributes[i].nodeName === 'rlink') {
                                visitMonsterLink.arlink = e.target.attributes[i].nodeValue;
                            }
                        }

                        caap.clickAjaxLinkSend(visitMonsterLink.arlink);
                    };

                    $j("span[id*='caap_guildmonster_']", caap.caapTopObject).unbind('click', handler).click(handler);

                    session.setItem("GuildMonsterDashUpdate", false);
                }

                return true;
            } catch (err) {
                con.error("ERROR in guild_monster.dashboard: " + err);
                return false;
            }
        }
        /*jslint sub: false */
    };
