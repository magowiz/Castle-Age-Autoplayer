/*jslint white: true, browser: true, devel: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,$j,$u,caap,con,schedule, general,session,worker,page */
/*jslint maxlen: 256 */

/////////////////////////////////////////////////////////////////////
//                          NAVIGATION FUNCTIONS
/////////////////////////////////////////////////////////////////////

(function () {
    "use strict";
	
	// Adding this page for a future improved and standardized navigation function as well as page information
	worker.add('page');
	
	caap.optionCheck = function(o, t) {
		return $u.isObject(o) ? o[t] : $u.isDefined(o) ? o.hasIndexOf(t) : false;
	};

	// Send an ajax link. Add ".php" if passed a link without it, like "index"
	// Gen argument is the general name. Can be '' for none.
	// o argument is the options. Can be passed as a string if only one option, or an object for more options
	page.ajax = function(link, gen, o) {
        try {
            if (!$u.hasContent(link) || !$u.isString(link)) {
                throw 'Invalid link passed to ajaxLink';
            }
			
			if (general.Select($u.setContent(gen, 'Use Current'))) {
				return true;
			}
			
			link += !link.hasIndexOf('.php') ? '.php' : '';
			link += caap.optionCheck(o, 'bqh') ? '&bqh=' + caap.bqh + '&ajax=1' : '';
			link += caap.optionCheck(o, 'ajax') ? '&ajax=1' : '';
				
			if (!caap.optionCheck(o, 'silent')) {
				con.log(1, 'Sending ajax link, ' + link);
			}

            caap.setDomWaiting(link);
            window.location.href = caap.jss + ":void(ajaxLinkSend('globalContainer', '" + link + "'))";
			return true;
        } catch (err) {
            con.error("ERROR in page.ajax: " + err);
            return false;
        }
	};

    caap.waitTime = 5000;

    caap.setDomWaiting = function (url) {
		// Maybe better to update if clickUrl != URL, but would then need to check for removing bqh values and changed order of url arguments
        var update = $u.hasContent(url) && !session.getItem('clickUrl', '').hasIndexOf(url);

        if (update) {
            session.setItem('clickUrl', url);
        }

        if (update || !session.getItem("waitingForDomLoad", false)) {
            schedule.setItem("clickedOnSomething", 0);
            session.setItem("waitingForDomLoad", true);
        }
    };

    caap.getDomWaiting = function () {
        return session.getItem("waitingForDomLoad", false);
    };

    caap.clearDomWaiting = function () {
        con.log(3, "clearDomWaiting");
        schedule.setItem("clickedOnSomething", 3600);
        session.setItem("waitingForDomLoad", false);
    };

    caap.visitUrl = function (url, loadWaitTime) {
        try {
            /*
            if (config.getItem('bookmarkMode', false)) {
                return true;
            }
            */

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
    };

    caap.ifClick = function (obj) {
        try {
			if ($u.isString(obj) && obj.length) {
				obj = caap.checkForImage(obj);
			}
			if (!$u.isObject(obj) || !obj.jquery) {
				con.warn('Invalid jquery passed to caap.ifClick', obj);
				return false;
			}
            if (obj.length) {
				caap.click(obj);
				return true;
            }
            return false;
        } catch (err) {
            con.error("ERROR in caap.ifClick: " + err.stack);
            return undefined;
        }
    };

    caap.click = function (obj, loadWaitTime) {
        try {
            if (!$u.hasContent(obj)) {
                throw 'Null object passed to Click';
            }

            caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
            caap.setDomWaiting();
            var evt = document.createEvent("MouseEvents"),
                bRet;

            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            /*
            Return Value: boolean
            The return value of dispatchEvent indicates whether any of the listeners
            which handled the event called preventDefault. If preventDefault was called
            the value is false, else the value is true.
            */

            bRet = !(obj.jquery ? obj.get(0) : obj).dispatchEvent(evt);
            evt = null;

            return bRet;
        } catch (err) {
            con.error("ERROR in caap.click: " + err);
            return undefined;
        }
    };

    caap.ajaxLink = function (link, loadWaitTime) {
        try {
            if (!$u.hasContent(link)) {
                throw 'No link passed to ajaxLink';
            }
			link += !link.hasIndexOf('.php') ? '.php' : '';
			
			con.log(1, 'Sending ajax link, ' + link);

            caap.waitMilliSecs = $u.setContent(loadWaitTime, caap.waitTime);
            caap.setDomWaiting(link);
            window.location.href = caap.jss + ":void(ajaxLinkSend('globalContainer', '" + link + "'))";
            return true;
        } catch (err) {
            con.error("ERROR in caap.ajaxLink: " + err);
            return false;
        }
    };

    caap.ajaxLoad = function (link, params, selector_dom, selector_load, result, loadWaitTime) {
        function onError(XMLHttpRequest, textStatus, errorThrown) {
            con.error("caap.ajaxLoad", [XMLHttpRequest, textStatus, errorThrown]);
        }

        function onSuccess(data) {
            $j(selector_dom).html(selector_load === "" ? $j(data).html() : $j(selector_load, data).html());
            caap.ajaxLoadIcon.hide();
            caap.clearDomWaiting();
            caap.checkResults();
        }

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
            caap.ajax(link, params, onError, onSuccess);
            return true;
        } catch (err) {
            con.error("ERROR in caap.ajaxLoad: " + err);
            return false;
        }
    };
	
    caap.navigateTo = function (pathToPage, imageOnPage, webSlice) {
        try {
            //webSlice = $u.setContent(webSlice, caap.globalContainer);
            var newwebSlice = $u.setContent(webSlice, $j('#globalcss')),
                pathList,
                s = 0,
                jq,
                path = '';


            if (!$u.hasContent(newwebSlice)) {
                con.warn('No content to Navigate to', imageOnPage, pathToPage);
                return false;
            }

            pathList = $u.hasContent(pathToPage) ? pathToPage.split(",") : [];

			if (!$u.hasContent(imageOnPage) && pathList[pathList.length - 1] && caap.pageList[pathList[pathList.length - 1]]) {
                con.log(5,'Using signature pic for web image', imageOnPage);
                imageOnPage = caap.pageList[pathList[pathList.length - 1]].signaturePic;
            }

            if ($u.hasContent(imageOnPage) && caap.hasImage(imageOnPage, newwebSlice)) {
                con.log(3, 'Image found on page', imageOnPage);
                return false;
            }

            jq = $j();

            for (s = pathList.length - 1; s >= 0; s -= 1) {
                path = $u.setContent(pathList[s], '');
                if (!$u.hasContent(path)) {
                    con.warn('pathList had no content!', pathToPage, imageOnPage, pathList[s]);
                } else {
					if (path.indexOf(':')>=0) {
						if (path.replace(/:.*/,'')=='ajax') {
							return caap.ajaxLink(path.replace(/.*:/,''),2000);
						} 
						con.warn('Unknown caap.navigateTo parameter', path, pathList);
						return false;
					}
                    jq = $j("a[href*='" + path + ".php']", newwebSlice).not("a[href*='" + path + ".php?']", newwebSlice);
                    if ($u.hasContent(jq)) {
                        con.log(2, 'Go to', path);
                    } else {
                        jq = caap.checkForImage(path.hasIndexOf(".") ? path : path + '.', newwebSlice);
                        if ($u.hasContent(jq)) {
                            con.log(2, 'Click on image', jq.attr("src").basename());
                        }
                    }

                    if ($u.hasContent(jq)) {
                        caap.click(jq);
                        return true;
                    }

                    con.log(3, 'No anchor or image found', path);
                }
            }

            con.warn('Unable to Navigate to', imageOnPage, pathToPage);

            newwebSlice = null;
            pathList = null;
            jq = null;

            return false;
        } catch (err) {
            con.error("ERROR in caap.navigateTo: " + err.stack, imageOnPage, pathToPage);
            return undefined;
        }
    };

	// Check if repeatedly trying same step but unable to navigate
	caap.navigate2RepeatCheck = function(tf, path, s) {
		try {
			var tryCount = session.getItem('navigate2_tryCount', 0);
			
			if (path == session.getItem('navigate2_lastPath', '') && s == session.getItem('navigate2_lastStep', 0) && !schedule.since(session.getItem('navigate2_lastTime', 0), 60)) {
				tryCount += 1;
				con.log(2, 'Navigate2 Repeat Check try: ' + tryCount, path, s);
			} else {
				tryCount = 0;
			}
			session.setItem('navigate2_lastPath', path);
			session.setItem('navigate2_lastStep', s);
			session.setItem('navigate2_lastTime', Date.now());
			session.setItem('navigate2_tryCount', tryCount);
			return tryCount > 5 ? 'fail' : tf;
		} catch (err) {
            con.error("ERROR in caap.navigate2RepeatCheck: " + err, tf, path, s);
            return tf;
        }
	};
	
	// Enhanced Navigate function. Can navigate a full path with jquery elements and ajax and button clicks.
	// Path elements can use page names. Page signature image will be used automatically.
	// Other element links can only be used after last page name used.
	// Other elements can be ajax: for an ajax link
	// image: for a signature image name to check for before continuing to next step
	// clickimg: for an image to click
	// ajax: for an ajax URL click
	// ajaxF: to hit an ajax URL click, even if already on that page
	// @general, used to require a specific general or category loadout. Can only be used in first step.
	
	// Return values are 'true' for moving along the path
	// 'done' when the last element in the path is clicked
	// 'fail' when the last element in the path cannot be found
	//	false when the last element is an image or PageList page and already on the page
    caap.navigate2 = function (path) {
        try {
            if (!$u.isString(path)) {
                con.warn('Invalid path to navigate2', path);
                return false;
            }

            var webslice = $j('#globalcss'),
                s = 0,
				step = '',
				action = '',
				text = '',
				steps = path.split(","),
				lastStep = steps.length - 1,
				result = false,
                jq = $j(),
				thisGeneral = $u.setContent(steps[0].regex(/@(.+)/), 'Use Current');
			
			if (general.Select(thisGeneral)) {
				return true;
			}

			// Start with page links to make sure on right page.
			// At this point, the pages must be defined in the caap.pageList
            for (s = lastStep; s >= 0; s -= 1) {
                step = $u.setContent(steps[s], '');

                if (!$u.hasContent(step)) {
                    con.warn('steps had no content!', step, path, s);
                } else {
					action = step.replace(/:.*/,'');
					text = step.replace(/[^:]*:/,'');
					if ($u.hasContent(caap.pageList[step])) {
						if (session.getItem('page','none') != step) {
							jq = $j("a[href*='" + step + ".php']").not("a[href*='" + step + ".php?']", webslice);
							if ($u.hasContent(jq)) {
								con.log(2, 'Navigate2: Go to page', jq, step, path, s);
								caap.click(jq);
								return caap.navigate2RepeatCheck(true, path, s);
							} 
							if (s - (thisGeneral !== 'Use Current') === 0) {
								con.warn('Unable to find path to page: ' + step, path);
							}
							//con.log(2,'Navigate2: Not on page ' + step + ', so going back another step', path, s, caap.pageList[step]);
						} else {
							if (s == lastStep) {
								con.log(5,'Navigate2: Already on destination page', step, s, path, caap.pageList[step]);
								return false;
							}
							con.log(5,'Navigate2: Found signature pic for page', step, s, path, caap.pageList[step]);
							s += 1;
							break;
						}
					} else if (['ajax', 'ajaxF'].hasIndexOf(action)) {
						if (session.getItem('clickUrl', '').replace(/.*\//,'') !== text || action == 'ajaxF') {
							result = caap.ajaxLink(text,2000);
							con.log(2, 'Navigate2: Go to ajax link '+ text, result, jq, step, path, s);
							return s == lastStep ? 'done' : caap.navigate2RepeatCheck(true, path, s);
						} 
						if (s == lastStep) {
							con.log(2,'Navigate2: Already on destination ajax link', step, s, path, caap.pageList[step]);
							return false;
						}
						con.log(2,'Navigate2: On URL ' + text, step, s, path, caap.pageList[step]);
						s += 1;
						break;
					} 
					if (step == 0) {
						con.log(1, 'Unable to find a starting page to navigate to',  step, s, path);
						return false;
					}
						
                }
            }
			
			
            con.log(5, 'Navigate2: First pass search for sig pic passed', step, path, s);
			
			

            for (s = Math.max(s, 0); s < steps.length; s += 1) {
				// Look ahead to see if we have the checkpoint hit already
				step = $u.setContent(steps[s+1], '');
				action = step.replace(/:.*/,'');
				text = step.replace(/[^:]*:/,'');

				// If the next step doesn't exist or isn't an image or that image is on the page, then do this step
				if (action =='image' && caap.hasImage(text, webslice)) {
					con.log(5, 'Navigate2 look ahead found image so skipping ', text, step, path, s);
				} else if (action =='jq' && $u.hasContent($j(text))) {
					con.log(5, 'Navigate2 look ahead found jquery so skipping ', text, step, path, s);
				} else if (action =='url' && session.getItem('clickUrl', '').indexOf(text) >= 0) {
					con.log(5, 'Navigate2 look ahead found a URL so skipping ', text, step, path, s);
				} else {
					step = $u.setContent(steps[s], '');
					action = step.replace(/:.*/,'');
					text = step.replace(/[^:]*:/,'');
/*					if (action =='image') {
						jq = caap.hasImage(text, webslice);
						// If the last step in the path, then we're done
						if (jq) {
							con.log(2,'Navigate2: already on destination page', step, s, path, caap.pageList[step]);
							return false;
						} else {
							con.log(5,'Navigate2: Passing by confirmation pic', step, s, path, caap.pageList[step]);
						}
*/					if (action =='clickimg') {
						jq = caap.checkForImage(text, webslice);
						// If the last step in the path, then we're done
						if ($u.hasContent(jq)) {
							con.log(2, 'Navigate2 image click', text, step, path, s);
							caap.click(jq);
							return s == lastStep ? 'done' : true;
						}
						con.warn('Navigate2: FAIL, unable to find image', step, path, s, action, text);
						return 'fail';
					} 
					if (action =='clickjq') {
						jq = $j(text, webslice);
						// If the last step in the path, then we're done
						if ($u.hasContent(jq)) {
							con.log(2, 'Navigate2 jq click', text, step, path, s);
							caap.click(jq);
							return s == lastStep ? 'done' : true;
						}
						con.warn('Navigate2: FAIL, unable to find jq', step, path, s, action, text);
						return 'fail';
					} 
					if (action == 'image' || action == 'jq' || action == 'url') {
						if (s == lastStep) {
							con.log(2,'Navigate2: Path done',  step, path, s, action, text);
							return false;
						}
						con.log(5,'Navigate2: Skipping found checkpoint',  step, path, s, action, text);
					} else {
						con.log(2, 'Navigate2: FAIL Instructions not understood', step, path, s, action, text);
						return 'fail';
					}
				}
            }

            con.warn('Navigate2: Unable to Navigate2', step, path, s);
            return false;
        } catch (err) {
            con.error("ERROR in caap.navigate2: " + err.stack);
            return undefined;
        }
    };
		
	caap.bad3 = [];
	
	// Equip general if appropriate, then navigate via ajax send to the toPage. Once there, confirm the click link is available.
	// If available, click it!  If options object check option is false, then send the click link even if not on page
	// Returns true if first page navigation complete, 'done' if clicked the link, and false if on page but link not there
    caap.navigate3 = function (toPage, click, thisGeneral, options) {
        try {
			if (caap.bad3.hasIndexOf(toPage + ':' + click)) {
				return false;
			}
			
			if (general.Select($u.setContent(thisGeneral, 'Use Current'))) {
				return true;
			}
			
			if (caap.page != toPage.replace(/\.php.*/, '') || !caap.clickUrl.hasIndexOf(toPage)) {
				caap.ajaxLink(toPage);
				con.log(2, 'Navigate3: Go to base page '+ toPage);
				return true;
			}
			
			options = $u.setContent(options, {});
			if (!$u.setContent(options.check, true) || $u.hasContent($j('[href*="' + click + '"]'))) {
				caap.ajaxLink(click);
				con.log(2, 'Navigate3: Clicking link '+ click);
				return 'done';
			}
			
			var clickPage = click.regex(/(\w+\.php)/),
				links = $j.makeArray($j('[onsubmit*="ajaxFormSend"][onsubmit*="' + clickPage + '"]').map(function() { 
					var head = $j(this).attr('onsubmit').regexd(/(\w+\.php[?&=\w]*)/, '');
					return head + (head.match(/\?/) ? '&' : '?') + $j(this).serialize();
				})).filter( function(l) {
					// If any of the names are not found in a form, that link not valid
					return l.hasIndexOf(clickPage) && !click.regex(/(\w+)=\w+/g).some( function(r) {
						return !l.match(new RegExp('\\b' + r + '\\b='));
					});
				});
			if (links.length) {
				click += links[0].regexd(/(&bqh=\w+)/, '');
				click += links[0].regexd(/(&ajax=1)/, '');
				caap.ajaxLink(click);
				con.log(2, 'Navigate3: Clicking form link '+ click);
				return 'done';
			}

			con.warn('Navigate3: ' + click + ' link type not found on page ' + toPage);
			caap.bad3.push(toPage + ':' + click);
			caap.scrapeLinks();
            return false;
			
        } catch (err) {
            con.error("ERROR in caap.navigateTo: " + err.stack);
            return undefined;
        }
    };
	
	// Output a list of all links available
	caap.scrapeLinks = function(div, silent) {
		var links = $j.makeArray($j('#app_body [onclick*="ajaxLinkSend"]', div).map(function() { 
				return $u.setContent($j(this).attr('href'), '').regex(/(\w+\.php.*)/); 
			}));
		
		div = $u.setContent(div, $j('#app_body_container'));
		links = links.concat($j.makeArray($j('[onsubmit*="ajaxFormSend"]', div).map(function() {
			var head = $j(this).attr('onsubmit').regexd(/(\w+\.php[?&=\w]*)/, '');
			return head + (head.match(/\?/) ? '&' : '?') + $j(this).serialize();
		})));
		
		// Filter out the duplicates and keep.php?casuser=12341 type links.
		links = links.filter( function(l, i) {
			return !(l.hasIndexOf('keep.php') && l.hasIndexOf('casuser=')) && i == links.indexOf(l);
		});
		if (!silent) {
			con.log(1, 'Links available on page aside from user keeps are:\n' + links.sort().join('\n'));
		}
		return links;
	};
	
	caap.linkMatch = function(term, div) {
		var links = caap.scrapeLinks(div, 'silent'),
			match = false;
			
		div = $u.setContent(div, $j('#app_body_container'));
		links.some( function(l) {
			match = l.match(term) ? l : false;
			return match;
		});
		
		return match;
	};

    caap.checkForImage = function (image, webSlice, subDocument, nodeNum) {
        try {
            webSlice = $u.setContent(webSlice, $u.setContent(subDocument, window.document).body);
            return $j("input[src*='" + image + "'],img[src*='" + image + "'],div[style*='" + image + "']", webSlice).eq($u.setContent(nodeNum, 0));
        } catch (err) {
            con.error("ERROR in caap.checkForImage: " + err);
            return undefined;
        }
    };

    caap.hasImage = function (image, webSlice, subDocument, nodeNum) {
        try {
            return $u.hasContent(caap.checkForImage(image, webSlice, subDocument, nodeNum));
        } catch (err) {
            con.error("ERROR in caap.hasImage: " + err);
            return undefined;
        }
    };

}());
