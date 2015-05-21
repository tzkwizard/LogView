﻿(function () {
    'use strict';

    var app = angular.module('app');

    app.config(function ($mdIconProvider) {
           $mdIconProvider
               .icon('backpage', 'content/images/icon/ic_backpage_24px.svg', 24)
               .icon('refresh', 'content/images/icon/ic_refresh_24px.svg', 24)
               .icon('logout', 'content/images/icon/ic_logout_24px.svg', 24)
               .icon('envelope', 'content/images/icon/ic_envelope_24px.svg', 24)
               .icon('timezone', 'content/images/icon/ic_timezone_24px.svg', 24)
               .icon('assessment', 'content/images/icon/ic_assessment_24px.svg', 24)
               .icon('search', 'content/images/icon/ic_search_24px.svg', 24)
               .icon('menu', 'content/images/icon/ic_menu_24px.svg', 24)
               .icon('setting', 'content/images/icon/ic_settings_24px.svg', 24)
               .icon('dashboard', 'content/images/icon/ic_dashboard_24px.svg', 24)
               .icon('user', 'content/images/icon/ic_user_24px.svg', 24)
               .icon('map', 'content/images/icon/ic_map_24px.svg', 24)
               .icon('windows', 'content/images/icon/ic_windows_24px.svg', 24)
               .icon('android', 'content/images/icon/ic_android_24px.svg', 24)
               .icon('arrow-up', 'content/images/icon/ic_arrowup_24px.svg', 24)
               .icon('arrow-down', 'content/images/icon/ic_arrowdown_24px.svg', 24);
       });

    // Configure Toastr
    toastr.options.timeOut = 1000;
    toastr.options.positionClass = 'toast-bottom-right';
 
    var facet = [
                { title: "User", field: "ident.raw", collapse: false, data: "", icon: "user", analyze: "string" },
                { title: "Location_City", field: "geoip.city_name.raw", collapse: false, data: "", icon: "map", analyze: "string" },
                { title: "Api", field: "request.raw", collapse: false, data: "", icon: "windows", analyze: "string" },
                { title: "Action", field: "action.raw", collapse: false, data: "", icon: "android", analyze: "string" },
                { title: "Method", field: "verb.raw", collapse: false, data: "", icon: "dashboard", analyze: "string" },
                { title: "Location_Country", field: "geoip.country_name.raw", collapse: false, data: "", icon: "map", analyze: "string" },
                { title: "Location_Region", field: "geoip.real_region_name.raw", collapse: false, data: "", icon: "map", analyze: "string" },
                { title: "PostCode", field: "geoip.postal_code.raw", collapse: false, data: "", icon: "envelope", analyze: "string" },
                { title: "TimeZone", field: "geoip.timezone.raw", collapse: false, data: "", icon: "timezone", analyze: "string" },

                { title: "User", field: "ident", collapse: false, data: "", icon: "user", analyze: "word" },
                { title: "Location_City", field: "geoip.city_name", collapse: false, data: "", icon: "map", analyze: "word" },
                { title: "Api", field: "request", collapse: false, data: "", icon: "windows", analyze: "word" },
                { title: "Action", field: "action", collapse: false, data: "", icon: "android", analyze: "word" },
                { title: "Method", field: "verb", collapse: false, data: "", icon: "dashboard", analyze: "word" },
                { title: "Location_Country", field: "geoip.country_name", collapse: false, data: "", icon: "map", analyze: "word" },
                { title: "Location_Region", field: "geoip.real_region_name", collapse: false, data: "", icon: "map", analyze: "word" },
                { title: "PostCode", field: "geoip.postal_code", collapse: false, data: "", icon: "envelope", analyze: "word" },
                { title: "TimeZone", field: "geoip.timezone", collapse: false, data: "", icon: "timezone", analyze: "word" }

    ];


    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };
    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'breeze/Breeze';

    var imageSettings = {
        imageBasepath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };
    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    //var localApiUrl = "http://localhost:2000/";
    var localApiUrl = "http://localhost/MessageHandleApi/";
    var remoteApiUrl = "https://microsoft-apiapp463245e7d2084cb79dbc3d162e7b94cb.azurewebsites.net/";
    var config = {
        appErrorPrefix: '[ELS Error] ', //Configure the exceptionHandler decorator
        docTitle: 'Elasticsearch:',
        events: events,
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        version: '2.2.0',
        keyCodes: keyCodes,
        remoteApiUrl: remoteApiUrl,
        localApiUrl: localApiUrl,
        facet: facet
    };
    app.config([
    "$routeProvider",
    "$httpProvider",
    function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
    ]);
    app.value('config', config);

    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion
})();