(function () {

    /* google.setOnLoadCallback(function () {
         angular.bootstrap(document.body, ['app']);
     });*/

    'use strict';
    google.load('visualization', '1', { packages: ['bar', 'corechart', 'controls', 'table', 'map', 'annotatedtimeline', 'treemap'] });
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ngCookies',

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions


        // 3rd Party Modules    
        'breeze.angular',
        'ui.bootstrap',   // ui-bootstrap (ex: carousel, pagination, dialog)    
        'elasticsearch',
        'ngGrid',


        //'ui.grid', 'ui.grid.edit', 'ui.grid.selection'
      //  "google-chart"

    ]);

    // Handle routing errors and success events
    app.run(['$q', '$timeout', '$cookieStore', '$rootScope', '$route', 'breeze', 'dataconfig', 'routeMediator', 'client', 'datasearch',
        function ($q, $timeout, $cookieStore, $rootScope, $route, breeze, dataconfig, routeMediator, client, datasearch) {
            // Include $route to kick start the router.
            // datacontext.prime();
            routeMediator.setRoutingHandlers();

            $rootScope.school = "TCU";

            var index = dataconfig.initIndex();
            //$rootScope.index = dataconfig.initIndex();

            $rootScope.logtype = "logs";
            //  $timeout(xx, 200);
            $rootScope.st = moment(new Date()).subtract(2, 'month');
            $rootScope.ft = new Date();
            $rootScope.ip = [];

            var field;
            index.then(function (data) {
                $rootScope.index = data;
                field = dataconfig.getFieldName($rootScope.index[0], $rootScope.logtype);
            }).then(function () {
                field.then(function (data2) {
                    $rootScope.logfield = data2;
                });
            });


            /* function xx() {
                 $rootScope.logfield = dataconfig.getFieldName($rootScope.index[0], $rootScope.logtype);
                          
             }*/



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



        }]);
})();