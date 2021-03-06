﻿(function () {
    'use strict';

    //Load google Api
    google.load('visualization', '1', {
        packages: ['geomap', 'geochart', 'bar', 'corechart', 'controls',
            'table', 'map', 'annotatedtimeline', 'treemap']
    });

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ngCookies',
        'ngMaterial',
        'ngAria',
        'LocalStorageModule',
        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions


        // 3rd Party Modules    
        'ui.bootstrap',   // ui-bootstrap (ex: carousel, pagination, dialog)    
        'elasticsearch',
        'ngGrid'

        //'ui.grid', 'ui.grid.edit', 'ui.grid.selection'
    ]);



    // Handle routing errors and success events
    app.run(['$route', 'dataconfig', 'routeMediator',
        function ($route, dataconfig, routeMediator) {
            // Include $route to kick start the router.
            routeMediator.setRoutingHandlers();
            dataconfig.appStart();
        }]);
})();