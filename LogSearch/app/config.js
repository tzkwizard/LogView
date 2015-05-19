(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 1000;
    toastr.options.positionClass = 'toast-bottom-right';

    var input = [];
    function fillInput() {
        input.push(32);
        for (var x = 48; x < 58; x++) {
            input.push(x);
        }
        for (x = 65; x < 91; x++) {
            input.push(x);
        }
    }
    fillInput();

    var facet = [
               { title: "User", field: "ident.raw", collapse: false, data: "", icon: "user" },
               { title: "Location_City", field: "geoip.city_name.raw", collapse: false, data: "", icon: "map" },
               { title: "Api", field: "request.raw", collapse: false, data: "", icon: "windows" },
               { title: "Action", field: "action.raw", collapse: false, data: "", icon: "android" },
               { title: "Method", field: "verb.raw", collapse: false, data: "", icon: "dashboard" },
                { title: "Location_Country", field: "geoip.country_name.raw", collapse: false, data: "", icon: "map" },
                { title: "Location_Region", field: "geoip.real_region_name.raw", collapse: false, data: "", icon: "map" },
                { title: "PostCode", field: "geoip.postal_code.raw", collapse: false, data: "", icon: "envelope" },
                { title: "TimeZone", field: "geoip.timezone.raw", collapse: false, data: "", icon: "timezone" }

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
        version: '2.1.0',
        keyCodes: keyCodes,
        remoteApiUrl: remoteApiUrl,
        localApiUrl: localApiUrl,
        input: input,
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