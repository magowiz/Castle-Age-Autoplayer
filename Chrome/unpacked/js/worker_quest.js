/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,$,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,gm,hiddenVar,
devVersion,caapVersion,caapjQuery,caapjQueryUI,caapjQueryDataTables,
battle,feed,festival,spreadsheet,town,FB,conquest,
image64:true,offline:true,profiles:true,
session:true,state:true,css:true,gm:true,ss:true,db:true,sort:true,schedule:true,
general:true,monster:true,guild_monster:true,gifting:true,army:true,caap:true,con:true,
schedule,gifting,state,army, general,session,monster,guild_monster,worker,conquestLands,
stats,statsFunc,throwError,configOld,configDefault,hyper,stateOld,ignoreJSLintError,
gb,essence,gift,chores */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          Quest Worker
// All things quest related
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";

	worker.add({name: 'questLands', recordIndex: 'link'});
	
	questLands.record = function(link) {
		this.data = {	
			link: '',
			name: '',
			review: 0, // Time of last review
			status: 'Opening'  // Opening, Opened, Complete
		}
	};
	
    questLands.checkResults = function(page, resultsText) {
        try {
			var status = 'Locked',
				qR = {},
				num = 0,
				name = '';
			
			switch (page) {
			case 'symbolquests' :
				lR = questLands.getRecord('symbolquests');
				lR.name = 'Demi Quests';
				lR.status = caap.hasImage('demi_quest_locked.jpg') ? 'Opening' : 
					$u.hasContent($j('tr:contains("INFLUENCE:")').not(':contains("INFLUENCE: 100%")')) ? 'Opened' : 'Complete';
				lR.review = Date.now();
				questLands.setRecord(lR);
				break;
			case 'quests' :
			case 'monster_quests' :
				$j('a[href*="' + page + '.php?land="]').each( function() {
					link = this.attr('href');
					num = link.numberOnly();
					name = questLands[page].length > num + 1 ? questLands[page][0] + num : questLands[page][num];
					questLand.setRecordVal(link, 'name', name);
				});
				break;
			}
		} catch (err) {
            con.error("ERROR in questLands.checkResults: " + err.stack);
            return false;
        }
    };


    questLands.quests = [
			'Land ', // Spacer to make index 1 based and prefix for unlisted lands
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
			'Perdition',
			'Land of Fire III',
			'Land of Earth III',
			'Land of Mist IV',
			'Land of Water III',
			'Undead II',
			'Outer Realms'
		];
		
	questLands.monster_quests = [
			'Atlantis ', // Spacer to make index 1 based and prefix for unlisted lands
			'Atlantis I',
			'Atlantis II',
			'Atlantis III'
		];
		
	questLands.dashboard = {
		name: 'Quest Lands',
		inst: 'Display your quest lands status and completion levels',
		records: 'questLands',
		tableEntries: [
			{name: 'Land', color: 'blue', format: 'text',
				valueF: function(r) {
					return '<a href="' + caap.domain.altered + '/' + r.link +
						'" onclick="ajaxLinkSend(\'globalContainer\', \'' + r.link +
						'\'); return false;" style="text-decoration:none;font-size:9px;color:blue;">' +
						r.name + '</a>';
			}},
			{name: 'Status'}
		]
	};
	

    quest.demiQuestList = ['Ambrosia', 'Malekus', 'Corvintheus', 'Aurora', 'Azeron'];

    quest.record = function (link) {
        this.data = {
			link : '',
            name : '',
			lastTry : 0,
            energy : 0,
			level : 0,
			influence : 0,
            general : '',
            experience : 0
        };
    };

    /////////////////////////////////////////////////////////////////////
    //                          QUESTING
    // Quest function does action, DrawQuest sets up the page and gathers info
    /////////////////////////////////////////////////////////////////////

    quest.demiQuestTable = {
        'Ambrosia': 'energy',
        'Malekus': 'attack',
        'Corvintheus': 'defense',
        'Aurora': 'health',
        'Azeron': 'stamina'
    };

    quest.isExcavationQuest = {
        'Cave of Wonder': true,
        'Rune Mines': true,
        'Nether Vortex': true,
        // Atlantis II
        'Entrance': true,
        'Fortress': true,
        'Path': true,
        'Town': true,
        'Underwater': true
    };

//	worker.addAction({worker : 'caap', priority : 600, description : 'Questing', functionName : 'quests'});
	
    quest.worker = function () {
        try {
            var storeRetrieve = state.getItem('storeRetrieve', ''),
                whenQuest = config.getItem('WhenQuest', 'Never'),
                fortMon,
                maxHealthtoQuest,
                targetFrombattle_monster,
                currentMonster,
                energyCheck,
                pathToPage,
                imageOnPage,
                subQArea,
                landPic,
                subDQArea,
                deityN = caap.deityTable[caap.demiQuestTable[subDQArea]],
                picSlice,
                descSlice,
                bDiv,
                bDisp,
                button,
				result,
                itemBuyPopUp,
                costToBuy,
				qO = state.getItem('AutoQuest', caap.newAutoQuest()),
                autoQuestDivs,
                background;

            if (whenQuest === 'Never') {
                return {action: false, mess: ''};
            }

            if (whenQuest === 'Not Fortifying' && state.getItem('targetFromfortify', false)) {
				return {action: false, mess: 'Waiting for Monster Fortify to finish'};
            }
			
			result = conquest.engineer();
			if (caap.passThrough(result)) {
				return result;
			}

            if (!qO.name) {
                if (config.getItem('WhyQuest', 'Manual') === 'Manual') {
                    quest.setDivContent('quest_mess', 'Pick quest manually.');
                    window.clearTimeout(caap.qtom);
                    return false;
                }

                quest.setDivContent('quest_mess', 'Searching for quest.');
                window.clearTimeout(caap.qtom);
                con.log(1, "Searching for quest");
            } else {
                energyCheck = caap.checkEnergy('Quest', whenQuest, qO.energy);
                if (!energyCheck) {
                    return false;
                }
            }

			// Set general
            if (storeRetrieve) {
                if (storeRetrieve === 'general') {
                    con.log(1, "storeRetrieve", storeRetrieve);
                    if (general.Select('BuyGeneral')) {
                        return true;
                    }
                } else if (chores.retrieveFromBank(storeRetrieve)) {
					con.log(1, 'Getting $' + storeRetrieve + ' from bank');
					return true;
				}
			} else if (general.Select('QuestGeneral:' + qO.experience)) {
				return {log: 'Setting quest general'};
            }

            pathToPage = 'quests';
            imageOnPage = 'quest_back_1.jpg';
            subQArea = 'Land of Fire';
            landPic = '';

            switch (config.getItem('QuestArea', 'Quest')) {
                case 'Quest':
                    if (stats.level > 7) {
                        subQArea = config.getItem('QuestSubArea', 'Land of Fire');
                        landPic = caap.questAreaInfo[subQArea].base;
                        if ($u.hasContent($j("img[src*='" + landPic + "_lock']"))) {
                            quest.checkResults_quests(true);
                        }

                        if ((landPic === 'tab_heaven' || config.getItem('GetOrbs', false)) && config.getItem('WhyQuest', 'Manual') !== 'Manual') {
                            if (chores.checkPages('magic')) {
                                return true;
                            }
                        }

                        pathToPage = 'quests,' + landPic;
                        imageOnPage = landPic;
                        switch (landPic) {
                            case 'tab_outer':
                                pathToPage += '_small.jpg';
                                imageOnPage += '_big.jpg';
                                break;
                            case 'tab_undead2':
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

                    if (caap.navigateTo(pathToPage, imageOnPage)) {
                        return true;
                    }

                    break;
                case 'Demi Quests':
                    if (caap.navigateTo('quests,symbolquests', 'demi_quest_on.gif')) {
                        return true;
                    }

                    subDQArea = config.getItem('QuestSubArea', 'Ambrosia');
                    deityN = caap.deityTable[caap.demiQuestTable[subDQArea]];
                    picSlice = $j('#globalContainer #symbol_image_symbolquests' + deityN);
                    descSlice = $j('#globalContainer #symbol_desc_symbolquests' + deityN);

                    if (!$u.hasContent(picSlice) || !$u.hasContent(descSlice)) {
                        con.warn('No diety image or description for', subDQArea);
                        return false;
                    }

                    if (descSlice.css('display') === 'none') {
                        return caap.navigateTo(picSlice.attr("src").basename());
                    }

                    break;
                case 'Atlantis':
                    if (stats.level > 7) {
                        subQArea = config.getItem('QuestSubArea', 'Atlantis');
                        landPic = caap.questAreaInfo[subQArea].base;
                        if ($u.hasContent($j("img[src*='" + landPic + "_lock']"))) {
                            quest.checkResults_quests(true);
                        }

                        pathToPage = 'quests,monster_quests,' + landPic;
                        imageOnPage = landPic;
                        switch (subQArea) {
                            case 'Atlantis':
                                pathToPage += '.gif';
                                imageOnPage += '_realm_sel.gif';
                                break;
                            case 'Atlantis II':
                                pathToPage += '_2.gif';
                                imageOnPage += '_realm_sel_2.gif';
                                break;
                            case 'Atlantis III':
                                pathToPage += '_small.gif';
                                imageOnPage += '_big.gif';
                                break;
                            default:
                                pathToPage += '_small.gif';
                                imageOnPage += '_big.gif';
                                break;
                        }
                    }

                    if (caap.navigateTo(pathToPage, imageOnPage)) {
                        return true;
                    }

                    break;
                default:
					break;
            }

            bDiv = $j('#globalContainer #single_popup');
            bDisp = $u.setContent(bDiv.css("display"), 'none');
            button = $j();

            // Buy quest requires popup
            itemBuyPopUp = $j('#globalContainer form[id*="itemBuy"]');
            costToBuy = 0;

            if (bDisp !== 'none' && $u.hasContent(itemBuyPopUp)) {
                con.log(2, 'itemBuy');
                state.setItem('storeRetrieve', 'general');
                if (general.Select('BuyGeneral')) {
                    return true;
                }

                state.setItem('storeRetrieve', '');
                costToBuy = itemBuyPopUp.text().replace(new RegExp(".*\\$"), '').replace(new RegExp("[^\\d]{3,}.*"), '').parseInt();
                con.log(2, "costToBuy", costToBuy);
                if (stats.gold.cash < costToBuy) {
                    //Retrieving from Bank
                    if (stats.gold.cash + (stats.gold.bank - config.getItem('minInStore', 0)) >= costToBuy) {
                        con.log(1, "Trying to retrieve", costToBuy - stats.gold.cash);
                        state.setItem("storeRetrieve", costToBuy - stats.gold.cash);
                        return chores.retrieveFromBank(costToBuy - stats.gold.cash);
                    }

                    con.log(1, "Cant buy requires, stopping quest");
                    quest.manualAutoQuest();
                    return false;
                }

                button = caap.checkForImage('quick_buy_button.jpg', $j('#single_popup'));
                if ($u.hasContent(button)) {
                    con.log(1, 'Clicking on quick buy button.');
                    quest.click(button);
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
                if (stats.gold.cash < costToBuy) {
                    //Retrieving from Bank
                    if (stats.gold.cash + (stats.gold.bank - config.getItem('minInStore', 0)) >= costToBuy) {
                        con.log(1, "Trying to retrieve: ", costToBuy - stats.gold.cash);
                        state.setItem("storeRetrieve", costToBuy - stats.gold.cash);
                        return chores.retrieveFromBank(costToBuy - stats.gold.cash);
                    }

                    con.log(1, "Cant buy General, stopping quest");
                    quest.manualAutoQuest();
                    return false;
                }

                con.log(2, 'Clicking on quick buy general button.');
                quest.click(button);
                return true;
            }

            autoQuestDivs = {
                name: '',
                click: $j(),
                tr: $j(),
                genDiv: $j(),
                orbCheck: false
            };

            autoQuestDivs = caap.checkResults_quests(true);
            //con.log(1, 'autoQuestDivs/qO.name', autoQuestDivs, qO.name);
            if (!autoQuestDivs.name) {
                con.log(1, 'Could not find AutoQuest.');
                quest.setDivContent('quest_mess', 'Could not find AutoQuest.');
                window.clearTimeout(caap.qtom);
                return false;
            }

            if (autoQuestDivs.name !== qO.name) {
                con.log(1, 'New AutoQuest found.');
                quest.setDivContent('quest_mess', 'New AutoQuest found.');
                window.clearTimeout(caap.qtom);
                return true;
            }

            // if found missing requires, click to buy
            if ($u.hasContent(autoQuestDivs.tr)) {
                background = $j("div[style*='background-color']", autoQuestDivs.tr);
                if ($u.hasContent(background) && background.css("background-color") === 'rgb(158, 11, 15)') {
                    con.log(1, "Missing item");
                    if (config.getItem('QuestSubArea', 'Atlantis') === 'Atlantis') {
                        con.log(1, "Cant buy Atlantis items, stopping quest");
                        quest.manualAutoQuest();
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
                        quest.click(background.children().eq(0).children().eq(0));
                        return true;
                    }
                }
            } else {
                con.warn('Can not buy quest item');
                return false;
            }

            if ($u.hasContent(autoQuestDivs.click)) {
                con.log(2, 'Clicking auto quest', qO.name);
                session.setItem('ReleaseControl', true);
                quest.click(autoQuestDivs.click);
                quest.showAutoQuest();
                if (autoQuestDivs.orbCheck) {
                    schedule.setItem("magic", 0);
                }

                return true;
            }

            con.warn('Can not click auto quest', qO.name);
            return false;
        } catch (err) {
            con.error("ERROR in quests: " + err.stack);
            return false;
        }
    };

    quest.questName = null;

    quest.checkResults_symbolquests = function () {
        try {
            $j('#globalContainer div[id*="symbol_tab_symbolquests"]').off('click', caap.symbolquestsListener).on('click', caap.symbolquestsListener);
            $j('#globalContainer form[id*="symbols_form_"]').off('click', caap.symbolquestsClickListener).on('click', caap.symbolquestsClickListener);

            var demiDiv = $j('#globalContainer div[id*="symbol_desc_symbolquests"]'),
                points = [],
                success = true;

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
                    quest.demi.ambrosia.power.total = $u.setContent(points[0], 0);
                    quest.demi.malekus.power.total = $u.setContent(points[1], 0);
                    quest.demi.corvintheus.power.total = $u.setContent(points[2], 0);
                    quest.demi.aurora.power.total = $u.setContent(points[3], 0);
                    quest.demi.azeron.power.total = $u.setContent(points[4], 0);
                    schedule.setItem("symbolquests", (gm ? gm.getItem("checkSymbolQuests", 24, hiddenVar) : 24) * 3600, 300);
                    quest.SaveDemi();
                }
            } else {
                con.warn("Demi demiDiv problem", demiDiv);
            }

            return true;
        } catch (err) {
            con.error("ERROR in checkResults_symbolquests: " + err.stack);
            return false;
        }
    };

    quest.isBossQuest = function (name) {
        try {
            var qn = '',
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
            con.error("ERROR in isBossQuest: " + err.stack);
            return false;
        }
    };

    quest.symbolquestsListener = function (event) {
        con.log(2, "Clicked Demi Power image", event.target.parentNode.parentNode.parentNode.parentNode.id);
        quest.setDomWaiting("symbolquests.php");
        quest.clearDomWaiting();
        quest.checkResultsTop();
    };

    quest.symbolquestsClickListener = function (event) {
        con.log(2, "Clicked Demi Power blessing", event.target.parentNode.id);
        quest.setDomWaiting("symbolquests.php");
    };

    quest.checkResults_quests = function (pickQuestTF) {
        try {
            //con.log(1, "checkResults_quests pickQuestTF", pickQuestTF);
            pickQuestTF = pickQuestTF || false;
            if ($u.hasContent($j('#globalContainer #quest_map_container'))) {
                $j("#app_body div[id*='meta_quest_']").each(function () {
                    var row = $j(this);

                    if (!($u.hasContent($j("img[src*='_completed']", row)) || $u.hasContent($j("img[src*='_locked']", row)))) {
                        $j("#globalContainer div[id*='quest_wrapper_" + row.attr("id").replace("meta_quest_", '') + "']").show();
                    }

                    row = null;
                });
            }

            var bestReward = 0,
                rewardRatio = 0,
                div = $j(),
                ssDiv = $j(),
                whyQuest = config.getItem('WhyQuest', 'Manual'),
                haveOrb,
                isTheArea,
                questSubArea,
                autoQuestDivs,
                expRegExp,
                energyRegExp,
                moneyRegExp,
                money2RegExp,
                influenceRegExp,
                reward,
                energy,
                experience,
                divTxt,
                expM,
                tStr,
                idx,
                energyM,
                eObj,
                expObj,
                moneyM = [],
                rewardLow,
                rewardHigh,
                click,
                influence,
                influenceList,
                general,
                genDiv,
                questType,
                tempAutoQuest;

            if (pickQuestTF === true && whyQuest !== 'Manual') {
                state.setItem('AutoQuest', caap.newAutoQuest());
            }

            if (caap.hasImage('demi_quest_on.gif')) {
                quest.checkResults_symbolquests($u.isString(pickQuestTF) ? pickQuestTF : undefined);
                ssDiv = $j("#globalContainer div[id*='symbol_displaysymbolquest']");
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
                div = $j("#globalContainer");
            }

            ssDiv = $j(".quests_background,.quests_background_sub", div);
            if (!$u.hasContent(ssDiv)) {
                con.warn("Failed to find quests_background");
                return false;
            }

            haveOrb = false;
            isTheArea = false;
            questSubArea = '';

            questSubArea = config.getItem('QuestSubArea', 'Land of Fire');
            isTheArea = caap.checkCurrentQuestArea(questSubArea);
            con.log(2, "Is quest area", questSubArea, isTheArea);
            if (isTheArea && whyQuest !== 'Manual' && config.getItem('GetOrbs', false)) {
                if ($u.hasContent($j("input[alt='Perform Alchemy']"))) {
                    haveOrb = true;
                } else {
                    if (questSubArea && caap.questAreaInfo[questSubArea].orb) {
                        haveOrb = town.records.getObjIndex('name', caap.questAreaInfo[questSubArea].orb) >= 0;
                    }
                }

                con.log(2, "Have Orb for", questSubArea, haveOrb);
                if (haveOrb && caap.isBossQuest(state.getItem('AutoQuest', caap.newAutoQuest()).name)) {
                    state.setItem('AutoQuest', caap.newAutoQuest());
                }
            }

            /*
             * This subroutine call added as a stop-gap measure to allow CAAP to perform auto-quests even
             * when CA developers omit or duplicate the names for either main quests or sub-quests.
             */
            quest.updateQuestNames(ssDiv);

            autoQuestDivs = {
                name: '',
                click: $j(),
                tr: $j(),
                genDiv: $j(),
                orbCheck: false
            };

            $j("#app_body .autoquest").remove();

            expRegExp = new RegExp("\\+(\\d+)");
            energyRegExp = new RegExp("(\\d+)\\s+energy", "i");
            moneyRegExp = new RegExp("\\$([0-9,]+)\\s*-\\s*\\$([0-9,]+)", "i");
            money2RegExp = new RegExp("\\$([0-9,]+)mil\\s*-\\s*\\$([0-9,]+)mil", "i");
            influenceRegExp = new RegExp("(\\d+)%");

            ssDiv.each(function () {
                div = $j(this);
                quest.questName = caap.getQuestName(div);
                if (!caap.questName) {
                    return true;
                }

                reward = null;
                energy = null;
                experience = null;
                divTxt = '';
                expM = [];
                tStr = '';

                divTxt = div.text().trim().innerTrim();
                expM = divTxt ? divTxt.match(expRegExp) : [];
                if (expM && expM.length === 2) {
                    experience = expM[1] ? expM[1].numberOnly() : 0;
                } else {
                    expObj = $j(".quest_experience", div);
                    if ($u.hasContent(expObj)) {
                        tStr = expObj.text();
                        experience = tStr ? tStr.numberOnly() : 0;
                    } else {
                        con.warn("Can't find experience for", caap.questName);
                    }
                }

                idx = caap.questName.indexOf('<br>');

                if (idx >= 0) {
                    quest.questName = caap.questName.substring(0, idx);
                }

                energyM = divTxt.match(energyRegExp);
                if (energyM && energyM.length === 2) {
                    energy = energyM[1] ? energyM[1].numberOnly() : 0;
                } else {
                    eObj = $j(".quest_req", div);
                    if ($u.hasContent(eObj)) {
                        energy = $j('b', eObj).eq(0).text().numberOnly();
                    }
                }

                if (!energy) {
                    con.warn("Can't find energy for", caap.questName);
                    return true;
                }

                moneyM = [];
                rewardLow = 0;
                rewardHigh = 0;

                moneyM = divTxt ? divTxt.stripHtmlJunk().match(moneyRegExp) : [];
                if (moneyM && moneyM.length === 3) {
                    rewardLow = moneyM[1] ? moneyM[1].numberOnly() : 0;
                    rewardHigh = moneyM[2] ? moneyM[2].numberOnly() : 0;
                    reward = (rewardLow + rewardHigh) / 2;
                } else {
                    moneyM = divTxt ? divTxt.stripHtmlJunk().match(money2RegExp) : [];
                    if (moneyM && moneyM.length === 3) {
                        rewardLow = moneyM[1] ? moneyM[1].numberOnly() * 1000000 : 0;
                        rewardHigh = moneyM[2] ? moneyM[2].numberOnly() * 1000000 : 0;
                        reward = (rewardLow + rewardHigh) / 2;
                    } else {
                        con.warn('No money found for', caap.questName, divTxt);
                    }
                }

                click = $j("input[name='Do Quest']", div);

                if (!$u.hasContent(click)) {
                    con.warn('No button found for', caap.questName);
                    return true;
                }

                influence = -1;

                if (caap.isBossQuest(caap.questName)) {
                    if ($u.hasContent($j(".quests_background_sub", div))) {
                        //if boss and found sub quests
                        influence = 100;
                    } else {
                        influence = 0;
                    }
                } else {
                    influenceList = divTxt.match(influenceRegExp);
                    if (influenceList && influenceList.length === 2) {
                        influence = influenceList[1] ? influenceList[1].parseInt() : 0;
                    } else {
                        con.warn("Influence div not found.", influenceList);
                    }
                }

                if (influence < 0) {
                    con.warn('No influence found for', caap.questName, divTxt);
                }

                general = 'none';
                genDiv = $j();

                if (influence >= 0 && influence < 100) {
                    genDiv = $j(".quest_act_gen", div);
                    if ($u.hasContent(genDiv)) {
                        genDiv = $j("img[src*='jpg']", genDiv);
                        if ($u.hasContent(genDiv)) {
                            general = genDiv.attr("title");
                        }
                    }
                }

                switch (div.attr("class")) // determine quest type
                {
                    case 'quests_background_special':
                        questType = 'boss';

                        break;
                    case 'quests_background':
                        if (caap.isExcavationQuest[caap.questName]) {
                            questType = 'mine';
                        } else {
                            questType = 'primary';
                        }

                        break;
                    default:
                        questType = 'subquest';
                }

                quest.labelQuests(div, energy, reward, experience, click);
                con.log(9, "QuestSubArea", questSubArea);
                if (isTheArea) {
                    if (questType === 'boss' && config.getItem('GetOrbs', false) && whyQuest !== 'Manual' && !haveOrb) {
                        quest.updateAutoQuest('name', caap.questName);
                        pickQuestTF = true;
                        autoQuestDivs.orbCheck = true;
                    }

                    if (questType === 'mine' && config.getItem('ExcavateMines', false) && whyQuest !== 'Manual' && influence < 100) {
                        quest.updateAutoQuest('name', caap.questName);
                        pickQuestTF = true;
                    }

                    switch (whyQuest) {
                        case 'Advancement':
                            if (influence >= 0) {
                                if (!state.getItem('AutoQuest', caap.newAutoQuest()).name && questType === 'primary' && influence < 100) {
                                    quest.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Influence':
                            if (influence >= 0) {
                                if (!state.getItem('AutoQuest', caap.newAutoQuest()).name && questType !== 'mine' && influence < 100) {
                                    quest.updateAutoQuest('name', caap.questName);
                                    pickQuestTF = true;
                                }
                            } else {
                                con.warn("Can't find influence for", caap.questName, influence);
                            }

                            break;
                        case 'Max Experience':
                            rewardRatio = (Math.floor(experience / energy * 100) / 100);
                            if (bestReward < rewardRatio && questType !== 'mine') {
                                quest.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        case 'Max Gold':
                            rewardRatio = (Math.floor(reward / energy * 10) / 10);
                            if (bestReward < rewardRatio && questType !== 'mine') {
                                quest.updateAutoQuest('name', caap.questName);
                                pickQuestTF = true;
                            }

                            break;
                        default:
							break;
                    }

                    if (isTheArea && state.getItem('AutoQuest', caap.newAutoQuest()).name === caap.questName) {
                        bestReward = rewardRatio;

                        con.log(2, "Setting AutoQuest", caap.questName);

                        tempAutoQuest = caap.newAutoQuest();

                        tempAutoQuest.name = caap.questName;
                        tempAutoQuest.energy = energy;
                        tempAutoQuest.general = general;
                        tempAutoQuest.experience = experience;
                        state.setItem('AutoQuest', tempAutoQuest);
                        con.log(4, "checkResults_quests", state.getItem('AutoQuest', caap.newAutoQuest()));
                        quest.showAutoQuest();
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
                if (state.getItem('AutoQuest', caap.newAutoQuest()).name) {
                    con.log(4, "return autoQuestDivs", autoQuestDivs);
                    quest.showAutoQuest();
                    return autoQuestDivs;
                }

                //if not find quest, probably you already maxed the subarea, try another area
                if ((whyQuest === 'Max Influence' || whyQuest === 'Advancement') && config.getItem('switchQuestArea', true)) {
                    con.log(9, "QuestSubArea", questSubArea);
                    if (questSubArea && caap.questAreaInfo[questSubArea] && caap.questAreaInfo[questSubArea].next) {
                        questSubArea = config.setItem('QuestSubArea', caap.questAreaInfo[questSubArea].next);
                        if (caap.questAreaInfo[questSubArea].area && caap.questAreaInfo[questSubArea].list) {
                            config.setItem('QuestArea', caap.questAreaInfo[questSubArea].area);
                            quest.changeDropDownList('QuestSubArea', caap[caap.questAreaInfo[questSubArea].list]);
                        }
                    } else {
                        con.log(1, "Setting questing to manual");
                        quest.manualAutoQuest();
                    }

                    con.log(2, "UpdateQuestGUI: Setting drop down menus");
                    quest.selectDropOption('QuestArea', config.getItem('QuestArea', 'Quest'));
                    quest.selectDropOption('QuestSubArea', questSubArea);
                    return false;
                }

                con.log(1, "Finished QuestArea.");
                quest.manualAutoQuest();
            }

            return false;
        } catch (err) {
            con.error("ERROR in checkResults_quests: " + err.stack);
            quest.manualAutoQuest();
            return false;
        }
    };

    quest.classToQuestArea = {
        'quests_stage_1': 'Land of Fire',
        'quests_stage_2': 'Land of Earth',
        'quests_stage_3': 'Land of Mist',
        'quests_stage_4': 'Land of Water',
        'quests_stage_5': 'Demon Realm',
        'quests_stage_6': 'Undead Realm',
        'quests_stage_7': 'Underworld',
        'quests_stage_8': 'Kingdom of Heaven',
        'quests_stage_9': 'Ivory City',
        'quests_stage_10': 'Earth II',
        'quests_stage_11': 'Water II',
        'quests_stage_12': 'Mist II',
        'quests_stage_13': 'Mist III',
        'quests_stage_14': 'Fire II',
        'quests_stage_15': 'Pangaea',
        'quests_stage_16': 'Perdition',
        'quests_stage_17': 'Land of Fire III',
        'quests_stage_18': 'Land of Earth III',
        'quests_stage_19': 'Land of Mist IV',
        'quests_stage_20': 'Land of Water III',
        'quests_stage_21': 'Undead II',
        'quests_stage_22': 'Outer Realms',
        'symbolquests_stage_1': 'Ambrosia',
        'symbolquests_stage_2': 'Malekus',
        'symbolquests_stage_3': 'Corvintheus',
        'symbolquests_stage_4': 'Aurora',
        'symbolquests_stage_5': 'Azeron',
        'monster_quests_stage_1': 'Atlantis',
        'monster_quests_stage_2': 'Atlantis II',
        'monster_quests_stage_3': 'Atlantis III'
    };

    quest.checkCurrentQuestArea = function (QuestSubArea) {
        try {
            var found = false;

            if (stats.level < 8) {
                if (caap.hasImage('quest_back_1.jpg')) {
                    found = true;
                }
            } else if (QuestSubArea && caap.questAreaInfo[QuestSubArea]) {
                if ($u.hasContent($j("#globalContainer div[class='" + caap.questAreaInfo[QuestSubArea].clas + "']"))) {
                    found = true;
                }
            }

            return found;
        } catch (err) {
            con.error("ERROR in checkCurrentQuestArea: " + err.stack);
            return false;
        }
    };

    quest.getCurrentQuestArea = function () {
        var mainDiv = $j('#main_bn'),
            className;

        if ($u.hasContent(mainDiv)) {
            className = mainDiv.attr("class");
            if ($u.hasContent(className) && caap.classToQuestArea[className]) {
                return caap.classToQuestArea[className];
            }
        }

        return false;
    };

    quest.getQuestName = function (questDiv) {
        try {
            var item_title = $j(".quest_desc,.quest_sub_title", questDiv),
                firstb = $j("b", item_title).eq(0),
                text = '';

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

            quest.questName = firstb.text().trim().innerTrim();
            if (!$u.hasContent(caap.questName)) {
                con.warn('No quest name for this row');
                return false;
            }

            return caap.questName;
        } catch (err) {
            con.error("ERROR in getQuestName: " + err.stack);
            return false;
        }
    };

    /*------------------------------------------------------------------------------------\
    quest.checkEnergy gets passed the default energy requirement plus the condition text from
    quest.the 'Whenxxxxx' setting and the message div name. If energy is not defined, returns
	the total amount of energy available.
    \------------------------------------------------------------------------------------*/
    quest.checkEnergy = function (which, condition, energyRequired) {
        try {
            if (!stats.energy) {
                return false;
            }

            if (!which) {
				con.warn('Check Energy not passed an argument to specify quest or fortify');
                return false;
            }

            var whichEnergy,
                maxIdleEnergy = caap.maxStatCheck('energy'),
				energyMin,
				msgdiv = which.toLowerCase() + '_mess';
				
			energyRequired = $u.setContent(energyRequired, 0);
			
			if (condition == 'Never') {
				caap.setDivContent(msgdiv, which + ': Never');
				return 0;
			}

			if (caap.inLevelUpMode() && stats.energy.num >= energyRequired) {
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Burning all energy to ' + (caap.inLevelUpMode() ? 'level up' : ' get below max'));
				return stats.energy.num;
			}

            if (['Energy Available', 'Not Fortifying', 'Not Covering My Damage'].indexOf(condition) >=0) {
				energyMin = Math.max(0, stats.energy.num - (condition == 'Not Covering My Damage' ? Math.max( 20, stats.stamina.num * config.getItem('HealPercStam', 20) / 100) : 0));
                if (energyMin >= energyRequired) {
                    return energyMin;
                }
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
                }
				caap.setDivContent(msgdiv, which + ': Waiting for more energy: ' + stats.energy.num + "/" + energyRequired);
            } else if (condition === 'At X Energy') {

                whichEnergy = config.getItem('X' + which + 'Energy', 1);

                if (stats.energy.num >= whichEnergy) {
                    state.setItem('X' + which + 'Energy', true);
                }
                if (stats.energy.num >= energyRequired) {
                    if (state.getItem('X' + which + 'Energy', false) && stats.energy.num >= config.getItem('XMin' + which + 'Energy', 0)) {
						if (msgdiv === "quest_mess") {
							window.clearTimeout(caap.qtom);
						}
						caap.setDivContent(msgdiv, which + ': At X energy. Burning to ' + config.getItem('XMin' + which + 'Energy', 0));
                        return stats.energy.num - config.getItem('XMin' + which + 'Energy', 0);
                    }
                    state.setItem('X' + which + 'Energy', false);
                }
				whichEnergy = energyRequired > whichEnergy ? energyRequired : whichEnergy;
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Waiting for X energy: ' + stats.energy.num + "/" + whichEnergy);
            } else if (condition === 'At Max Energy') {
                if (stats.energy.num >= maxIdleEnergy) {
                    return stats.energy.num;
                }
				if (msgdiv === "quest_mess") {
					window.clearTimeout(caap.qtom);
				}
				caap.setDivContent(msgdiv, which + ': Waiting for max energy: ' + stats.energy.num + "/" + maxIdleEnergy);
            }
            return false;
        } catch (err) {
            con.error("ERROR in checkEnergy: " + err.stack);
            return false;
        }
    };

    quest.labelListener = function (e) {
        try {
            var sps = e.target.getElementsByTagName('span'),
                mainDiv = $j("#globalContainer #main_bn"),
                className = '',
                tempAutoQuest = {};

            if (sps.length <= 0) {
                throw 'what did we click on?';
            }

            tempAutoQuest = caap.newAutoQuest();
            tempAutoQuest.name = sps[0].innerHTML;
            tempAutoQuest.energy = sps[1].innerHTML.parseInt();

            quest.manualAutoQuest(tempAutoQuest);
            con.log(5, 'labelListener', sps, state.getItem('AutoQuest'));
            if (stats.level < 8 && caap.hasImage('quest_back_1.jpg')) {
                config.setItem('QuestArea', 'Quest');
                config.setItem('QuestSubArea', 'Land of Fire');
            } else {
                if (caap.hasImage('tab_quest_on.gif')) {
                    config.setItem('QuestArea', 'Quest');
                    quest.selectDropOption('QuestArea', 'Quest');
                    quest.changeDropDownList('QuestSubArea', caap.lands);
                } else if (caap.hasImage('demi_quest_on.gif')) {
                    config.setItem('QuestArea', 'Demi Quests');
                    quest.selectDropOption('QuestArea', 'Demi Quests');
                    quest.changeDropDownList('QuestSubArea', caap.demiQuestList);
                } else if (caap.hasImage('tab_atlantis_on.gif')) {
                    config.setItem('QuestArea', 'Atlantis');
                    quest.selectDropOption('QuestArea', 'Atlantis');
                    quest.changeDropDownList('QuestSubArea', caap.atlantisQuestList);
                }

                if ($u.hasContent(mainDiv)) {
                    className = mainDiv.attr("class");
                    if ($u.hasContent(className) && caap.classToQuestArea[className]) {
                        config.setItem('QuestSubArea', caap.classToQuestArea[className]);
                    }
                }
            }

            con.log(1, 'Setting QuestSubArea to', config.getItem('QuestSubArea', 'Land Of Fire'));
            quest.selectDropOption('QuestSubArea', config.getItem('QuestSubArea', 'Land Of Fire'));
            quest.showAutoQuest();
            quest.checkResults_quests();
            mainDiv = null;
            return true;
        } catch (err) {
            con.error("ERROR in labelListener: " + err.stack);
            return false;
        }
    };

    quest.labelQuests = function (div, energy, reward, experience, click) {
        try {
            if ($u.hasContent($j("div[class='autoquest']", div))) {
                return;
            }

            var newdiv,
                b,
                setAutoQuest,
                quest_nameObj,
                quest_energyObj;

            newdiv = document.createElement('div');
            newdiv.className = 'autoquest';
            newdiv.style.fontSize = '10px';
            newdiv.innerHTML = "$ per energy: " + (Math.floor(reward / energy * 10) / 10) + "<br />Exp per energy: " + (Math.floor(experience / energy * 100) / 100) + "<br />";

            if (state.getItem('AutoQuest', caap.newAutoQuest()).name === caap.questName) {
                b = document.createElement('b');

                b.innerHTML = "Current auto quest";
                newdiv.appendChild(b);

                b = null;
            } else {
                setAutoQuest = document.createElement('a');

                setAutoQuest.innerHTML = 'Auto run this quest.';
                setAutoQuest.quest_name = caap.questName;

                quest_nameObj = document.createElement('span');

                quest_nameObj.innerHTML = caap.questName;
                quest_nameObj.style.display = 'none';
                setAutoQuest.appendChild(quest_nameObj);

                quest_energyObj = document.createElement('span');

                quest_energyObj.innerHTML = energy;
                quest_energyObj.style.display = 'none';
                setAutoQuest.appendChild(quest_energyObj);
                $u.addEvent(setAutoQuest, "click", caap.labelListener);

                newdiv.appendChild(setAutoQuest);

                quest_nameObj = null;
                quest_energyObj = null;
                setAutoQuest = null;
            }

            newdiv.style.position = 'absolute';
            newdiv.style.background = '#B09060';
            newdiv.style.right = "144px";
            click.parent().before(newdiv);

            newdiv = null;
        } catch (err) {
            con.error("ERROR in labelQuests: " + err.stack);
        }
    };

}());
