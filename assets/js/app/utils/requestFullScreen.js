


var vendors = ["moz", "webkit", "", "ms", "o" ],
    l = vendors.length,
    fs, requestFn, cancelFn, eventName, isFullScreen;

if (document.cancelFullscreen !== undefined) {
    requestFn = "requestFullscreen";
    cancelFn  = "exitFullscreen";
    eventName = "fullscreenchange";
} else {
    while( l-- ){
        if (( vendors[l] != "moz" || document.mozFullScreenEnabled) && document[ vendors[l] + "CancelFullScreen"] !== undefined) {
            requestFn    = vendors[l] + "RequestFullScreen";
            cancelFn     = vendors[l] + "CancelFullScreen";
            eventName    = vendors[l] + "fullscreenchange";
            isFullScreen = vendors[l] == "webkit" ? vendors[l] + "IsFullScreen" :
                                                    vendors[l] + "FullScreen";
        }
    }
}


module.exports = {
    requestFn: requestFn,
    cancelFn: cancelFn,
    eventName: eventName,
    isFullScreen: isFullScreen
};