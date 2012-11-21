$(function () {
    /**
     * Handles data sent via chrome.extension.sendRequest().
     * @param request Object Data sent in the request.
     * @param sender Object Origin of the request.
     * @param callback Function The method to call when the request completes.
     */
    /*
    function onRequest(request, sender, callback) {
	console.log(1, "background.onRequest", request, sender, callback);
	if (request.action === 'getPage') {
	    $.ajax({
		url: request.value,
		error:
		    function (XMLHttpRequest, textStatus, errorThrown) {
			console.error("background.getPage", textStatus);
			responseText
			callback({
			    status       : XMLHttpRequest.status,
			    statusText   : textStatus,
			    responseText : "",
			    errorThrown  : errorThrown
			});
		    },
		success:
		    function (data, textStatus, XMLHttpRequest) {
			console.log(1, "background.getPage", textStatus);
			callback({
			    status       : XMLHttpRequest.status,
			    statusText   : textStatus,
			    responseText : data,
			    errorThrown  : ""
			});
		    }
	    });
	}
    };

    // Wire up the listener.
    chrome.extension.onRequest.addListener(onRequest);
    */
    var ports = {};
    function getConnected(port) {
	var it,
	    ar = ["caap"];

	if (ports[port.tab.id]) {
	    for (it in ports[port.tab.id]) {
		if (ports[port.tab.id].hasOwnProperty(it)) {
		    ar.push(it);
		}
	    }
	}

	return ar;
    }

    function broadcastConnected(port) {
	var it;

	for (it in ports[port.tab.id]) {
	    if (ports[port.tab.id].hasOwnProperty(it)) {
		if (it !== port.name) {
		    try {
			ports[port.tab.id][it].postMessage({
			    source  : "caap",
			    dest    : it,
			    message : "broadcast",
			    data    : {name: "connected", value: getConnected(port)}
			});
		    } catch (err) {
			console.warn("broadcastConnected", err, it, port);
		    }
		}
	    }
	}
    }

    chrome.extension.onConnect.addListener(function (port) {
	if (port.name === "caapfb" || port.name === "caapif" || port.name === "caapifp") {
	    var it;
	    console.log("onConnect", port);
	    if (!ports[port.tab.id]) {
		ports[port.tab.id] = {};
	    }

	    ports[port.tab.id][port.name] = port;
	    console.log("ports", ports);
	    port.onMessage.addListener(function (msg) {
		if (msg.source === "caapfb" || msg.source === "caapif" || port.name === "caapifp") {
		    //console.log("onMessage", msg);
		    if (msg.dest === "caap") {
			if (msg.message === "connect") {
			    port.postMessage({
				source  : msg.dest,
				dest    : msg.source,
				message : "ok",
				data    : ""
			    });

			    port.postMessage({
				source  : msg.dest,
				dest    : port.name,
				message : "connected",
				data    : getConnected(port)
			    });
			}
		    } else if (msg.dest === "caapfb" || msg.dest === "caapif" || msg.dest === "caapifp") {
			ports[port.tab.id][msg.dest].postMessage({
			    source  : msg.source,
			    dest    : msg.dest,
			    message : msg.message,
			    data    : msg.data
			});
		    }
		}
	    });

	    port.onDisconnect.addListener(function (pt) {
		console.log("onDisconnect", pt);
		delete ports[pt.tab.id][pt.name];
		if ($u.isEmptyObject(ports[pt.tab.id])) {
		    delete ports[pt.tab.id];
		}

		console.log("ports", ports);
		broadcastConnected(pt);
	    });

	    broadcastConnected(port);
	}
    });

    console.log("Ready");
}).ready();
