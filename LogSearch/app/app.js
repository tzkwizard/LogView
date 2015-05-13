(function () {
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
    app.run(['$rootScope', '$route', 'dataconfig', 'routeMediator', 'client', '$templateCache',
        function ($rootScope, $route, dataconfig, routeMediator, client, $templateCache) {
            // Include $route to kick start the router.
            routeMediator.setRoutingHandlers();
            $rootScope.school = "TCU";
            $rootScope.st = moment(new Date()).subtract(3, 'month').toDate();
            $rootScope.ft = new Date();
            // dataconfig.prime();
            $templateCache.put('e.html','app/component/els/els.html');
            //#region Ping           
            /* client.ping({
                 requestTimeout: 1000,
                 hello: "elasticsearch!"
             }, function (error) {
                 if (error) {
 
                     toastr.info('elasticsearch cluster is down!');
                 } else {
                     toastr.info('elasticsearch cluster is connected');
                 }
             });*/
            //#endregion

        }]);
})();