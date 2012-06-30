        /////////////////////////////////////////////////////////////////////
        //                         Begin
        /////////////////////////////////////////////////////////////////////
    function caap_start_all () {
        sessionStorage.removeItem('caap_fbData');
        sessionStorage.removeItem('caap_fbEnv');
        sessionStorage.removeItem('caap_fbFriends');

        if (window.location.href.indexOf(caap.domain.url[0]) >= 0) {
            caap.domain.which = 0;
        } else if (window.location.href.indexOf(caap.domain.url[1]) >= 0) {
            caap.domain.which = 1;
        } else if (window.location.href.indexOf(caap.domain.url[2]) >= 0) {
            caap.domain.which = 2;
            retryDelay = 5000;
        } else if (window.location.href.indexOf(caap.domain.url[3]) >= 0) {
            caap.domain.which = 3;
        } else if (window.location.href.indexOf(caap.domain.url[4]) >= 0) {
            caap.domain.which = 4;
        } else {
            caap.domain.which = -1;
            caap_log('Unknown domain! ' + window.location.href);
        }
        
        //Needclickers fix
        if (window.location.href.indexOf('needclickers=1') >= 0) {
			return;
		}

        if (window.location.href.indexOf('http://') >= 0) {
            caap.domain.ptype = 0;
        } else if (window.location.href.indexOf('https://') >= 0) {
            caap.domain.ptype = 1;
        } else {
            caap.domain.ptype = -1;
            caap_log('Unknown protocol! ' + window.location.href);
        }

        if (top === self) {
            caap_log("Started in a window");
        } else {
            caap_log("Started in an iFrame");
            caap.domain.inIframe = true;
        }

        if (caap.domain.which === -1 || caap.domain.ptype === -1) {
            caap_reload();
        }

        caap.domain.link = caap.domain.protocol[caap.domain.ptype] + caap.domain.url[caap.domain.which];
        caap.domain.altered = caap.domain.protocol[caap.domain.ptype] + caap.domain.url[caap.domain.which === 3 ? 0 : caap.domain.which];
        caap_log('Domain', caap.domain.which, caap.domain.protocol[caap.domain.ptype], caap.domain.url[caap.domain.which]);
        caap.documentTitle = document.title;
        caap_log(window.navigator.userAgent);
        if (typeof CAAP_SCOPE_RUN !== 'undefined') {
            caap_log('Remote version: ' + CAAP_SCOPE_RUN[0] + ' ' + CAAP_SCOPE_RUN[1] + ' d' + CAAP_SCOPE_RUN[2]);
        }

        caap_log("Starting ... waiting for libraries and DOM load");
        caap_timeout = window.setTimeout(caap_DomTimeOut, 180000);
        if (!window.jQuery || window.jQuery().jquery !== caapjQuery) {
            caap_log("Inject jQuery");
            injectScript(caap.libs.jQuery);
        }

       $('body').removeClass('center_fixed_width_app');      
       caap_WaitForjQuery();
    }
    setTimeout(caap_start_all,5000);

