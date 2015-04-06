(function () {

   /* google.setOnLoadCallback(function () {
        angular.bootstrap(document.body, ['app']);
    });*/
   
    'use strict';
    google.load('visualization', '1', { packages: ['bar','corechart', 'controls', 'table', 'map', 'annotatedtimeline','treemap'] });
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
        'ngGrid'

        //'ui.grid', 'ui.grid.edit', 'ui.grid.selection'
      //  "google-chart"
        
    ]);
    
    // Handle routing errors and success events
    app.run(['$cookieStore', '$rootScope', '$route', 'breeze', 'dataconfig', 'routeMediator', 'client',
        function ($cookieStore, $rootScope, $route, breeze, dataconfig, routeMediator, client) {
        // Include $route to kick start the router.
      // datacontext.prime();
        routeMediator.setRoutingHandlers();
        
        $rootScope.index = dataconfig.filterIndex();        
        $rootScope.logtype = "logs";

        $rootScope.logfield = dataconfig.getFieldName("logstash-2015.04.01", "logs");


      

        client.ping({
            requestTimeout: 1000,
            hello: "elasticsearch!"
        }, function (error) {
            if (error) {
                toastr.info('elasticsearch cluster is down!');
            } else {
                toastr.info('elasticsearch cluster is connected');
            }
        });



    }]);
})();