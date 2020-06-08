
var messageGameStarted = function () {
    console.log("Function messageGameStarted");
    var objectToPass={"action":"Game Started", "value":"1"};
    parent.postMessage(objectToPass, "*");

    //FB tag
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version ='2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '222307131296539');
    fbq('track', 'Start Game');
    console.log("FB Tag sent");

};

var messageGameDurationGA = function () {
    var objectToPass={"action":"Time Played", "value":"1"};
    parent.postMessage(objectToPass, "*");
};

var messageGameCompletedGA = function () {
    var objectToPass={"action":"Game Completed", "value":"1"};
    parent.postMessage(objectToPass, "*");
};

var messageGameShared = function () {
    var objectToPass={"action":"Game Shared", "value":"1"};
    parent.postMessage(objectToPass, "*");
};

var messageScoreSubmit = function () {
    //FB tag
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version ='2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '222307131296539');
    fbq('track', 'Score Submit');
}




