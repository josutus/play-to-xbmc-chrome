var currentVersion = 1601;

var storageKeys = {
    "showRepeat": "showRepeat",
    "profiles": "profiles",
    "enableMultiHost": "enableMultiHost",
    "selectedHost": "selectedHost",
    "enableDebugLogs": "enableDebugLogs"
};

var actions = {
    "PlayPause": "Player.PlayPause",
    "Stop": "Player.Stop",
    "SmallSkipBackward":"VideoPlayer.SmallSkipBackward",
    "SmallSkipForward":"VideoPlayer.SmallSkipForward",
    "GoPrevious": "Player.GoPrevious",
    "GoNext": "Player.GoNext"
};

var validUrlPatterns = [
    ".*youtube.com/watch.*",
    "^.*vimeo.com.*/\\d+.*$",
    "^.*freeride.se.*/\\d+.*$",
    ".*collegehumor.com/[video|embed]+/\\d+/\\w+",
    ".*dailymotion.com/video/.*",
    ".*ebaumsworld.com/video/.*",
    ".*soundcloud.com.*",
    ".*mycloudplayers.com.*",
    ".*mixcloud.com.*",
    ".*liveleak.com/view.*",
    "^(https|http)://(www\.)?twitch.tv/([^_&/#\?]+).*$",
    ".*hulu.com/watch.*",
    ".*ardmediathek.de/.*documentId=.*",
    "^(https|http)://areena.yle.fi/tv/*",
    "^(https|http)://www.ruutu.fi/ohjelmat/*",
    "^(https|http)://www.ruutu.fi/video/f/*",
    "^(https|http)://www.katsomo.fi/\\?progId=(\\d+)$",
    "^(https|http)://www.mtv3katsomo.fi/\\?progId=(\\d+)$"
];

var validPlaylistPatterns = [
    ".*youtube.com/playlist.*list=.*",
    "(https|http)://(www\.)?youtube.com/watch?.*list=.+",
    "(https|http)://(www\.)?soundcloud.com/[^_&/#\?]+/sets/[^_&/#\?]+"
];

var supportedVideoExtensions = [
    'mp3', 'ogg', 'midi', 'wav', 'aiff', 'aac', 'flac', 'ape', 'wma', 'm4a', 'mka'
];

var supportedAudioExtensions = [
    'avi', 'wmv', 'asf', 'flv', 'mkv', 'mp4'
];

function getURL() {
    var url;
    var port;
    var username;
    var password;

    if (isMultiHostEnabled()) {
        var selectedHost = localStorage[storageKeys.selectedHost];
        var allProfiles = JSON.parse(getAllProfiles());

        for (var i = 0; i < allProfiles.length; i++) {
            var profile = allProfiles[i];
            if (profile.id == selectedHost) {
                url = profile.url;
                port = profile.port;
                username = profile.username;
                password = profile.password;
                break;
            }
        }

    } else {
        url = localStorage["url"];
        port = localStorage["port"];
        username = localStorage["username"];
        password = localStorage["password"];
    }

    var loginPortion = '';
    if (username && password) {
        loginPortion = username + ':' + password + '@';
    }

    return 'http://'+ loginPortion + url + ':' + port;
}

function isMultiHostEnabled() {
    var enableMultiHost = localStorage[storageKeys.enableMultiHost];

    return enableMultiHost != null && enableMultiHost == 'true';
}

function isDebugLogsEnabled() {
    var enableDebugLogs = localStorage[storageKeys.enableDebugLogs];

    return enableDebugLogs != null && enableDebugLogs == 'true';
}

function getAllProfiles() {
    return localStorage[storageKeys.profiles];
}

function getCurrentUrl(callback) {
    chrome.tabs.getSelected(null, function (tab) {
        var tabUrl = tab.url;
        callback(tabUrl);
    });
}

function getURLParameter(tabUrl, sParam) {
    var sPageURL = tabUrl.substring(tabUrl.indexOf('?') + 1 );
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return null;
}
