caap.start = function() {
	con.log(1, "caap.fb(Data/Env)", caap.fbData, caap.fbEnv);
	caap.sessionVarsInit();
	var FBID = 0, idOk = false, accountEl = $j(), delay = 1000, it = 0, len = 0, fbData, aName;

	con.log(1, 'DOM load completed');
	con.log(1, 'mutationTypes', $u.mutationTypes);
	window.clearTimeout(caap_timeout);
	for( it = 0; it < caap.removeLibs.length; it += 1) {
		(document.head || document.getElementsByTagName('head')[0]).removeChild(caap.removeLibs[it]);
	}

	caap.removeLibs = [];
	caap.jQueryExtend();
	css.addCSS();

	if(caap.errorCheck()) {
		caap.mainCaapLoop();
		return;
	}

	caap.jWindow = $j(window);
	if(caap.domain.which === 4) {
		caap.initDb();
		caap.caapifpStartup();
		return;
	} else if(caap.domain.which === 3) {
		caap.initDb();
		caap.getSigned();
		//con.log(2, "session", session);
		caap.caapifStartup();
		return;
	} else {
		/* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
		/*jslint sub: true */
		if(caap.domain.which >= 0 && caap.domain.which < 2) {
			FBID = $u.setContent(caap.fbEnv.user, 0).parseInt();
			aName = $j('#navAccountName').text();
		} else {
			FBID = $u.setContent(caap.fbData.me.id, '0').parseInt();
			aName = $u.setContent(caap.fbData.me.name, '');
		}

		if($u.isNumber(FBID) && FBID > 0) {
			caap.stats['FBID'] = FBID;
			idOk = true;
		}
		/*jslint sub: false */
		if(!idOk && caap.domain.which >= 0 && caap.domain.which < 2) {
			// Force reload without retrying
			con.error('No Facebook UserID!!! Reloading ...', FBID, window.location.href);
			window.setTimeout(function() {
				var newdiv = document.createElement('div');
				newdiv.innerHTML = "<p>CAAP will retry shortly!</p>";
				document.body.appendChild(newdiv);
				window.setTimeout(function() {
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

		if(devVersion !== '0') {
			if(state.getItem('LastVersion', '0') !== caapVersion || state.getItem('LastDevVersion', '0') !== devVersion) {
				state.setItem('LastVersion', caapVersion);
				state.setItem('LastDevVersion', devVersion);
			}
		} else {
			if(state.getItem('LastVersion', '0') !== caapVersion) {
				state.setItem('LastVersion', caapVersion);
				state.setItem('LastDevVersion', '0');
			}
		}

		if(caap.domain.which === 0 || caap.domain.which === 2) {
			state.setItem('caapPause', 'none');
			session.setItem('ReleaseControl', true);
			window.setTimeout(caap.init, 200);
		}

		if(caap.domain.which === 1 || caap.domain.which === 2) {
			caap.mainCaapLoop();
		}

		caap.caapfbStartup();
	}
};
