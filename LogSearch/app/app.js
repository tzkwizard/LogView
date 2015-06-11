(function () {
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ngCookies',
        

        'app.layout',
        'componentService',
        'commonService',
        'datacontext',

        'LocalStorageModule',
        // Custom modules 
       
        'common',           // common functions, logger, spinner ,ngMaterial
        'common.bootstrap', // bootstrap dialog wrapper functions


        // 3rd Party Modules    
        'ui.bootstrap',   // ui-bootstrap (ex: carousel, pagination, dialog)    
        'elasticsearch',
        //'ngGrid'

        //'ui.grid', 'ui.grid.edit', 'ui.grid.selection'
    ]);
    angular.module('componentService', []);

    //Load google Api
    google.load('visualization', '1', {
        packages: ['geomap', 'geochart', 'bar', 'corechart', 'controls',
            'table', 'map', 'annotatedtimeline', 'treemap']
    });
 
    // Handle routing errors and success events
    app.run(['$route', 'commonService', 'routeMediator',
        function ($route, commonService, routeMediator) {
            // Include $route to kick start the router.
            routeMediator.setRoutingHandlers();
            commonService.appStart();
        }]);
})();