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


    angular.module('app')
        .config(function($mdIconProvider) {
            $mdIconProvider
                .icon('dashboard', 'content/images/icon/ic_dashboard_24px.svg', 24)
                .icon('user', 'content/images/icon/ic_user_24px.svg', 24)
                .icon('map', 'content/images/icon/ic_map_24px.svg', 24)
                .icon('windows', 'content/images/icon/ic_windows_24px.svg', 24)
                .icon('android', 'content/images/icon/ic_android_24px.svg', 24)
                .icon('arrow-up', 'content/images/icon/ic_arrowup_24px.svg', 24)
                .icon('arrow-down', 'content/images/icon/ic_arrowdown_24px.svg', 24);
        });

    // Handle routing errors and success events
    app.run(['$cookieStore', '$rootScope', '$route', 'dataconfig', 'routeMediator','config',
        function ($cookieStore,$rootScope, $route, dataconfig, routeMediator, config) {
            // Include $route to kick start the router.
            routeMediator.setRoutingHandlers();
            $rootScope.school = "TCU";
            $rootScope.st = moment(new Date()).subtract(3, 'month').toDate();
            $rootScope.ft = new Date();
            $rootScope.token = $cookieStore.get('EsToken');

            if ($cookieStore.get('SiderBarFacet') === undefined || $cookieStore.get('SiderBarFacet').length < 1) {
                $rootScope.facet = [config.facet[0], config.facet[1], config.facet[2], config.facet[3]];
            } else {
                $rootScope.facet = $cookieStore.get('SiderBarFacet');
            }

            // dataconfig.prime();
        }]);
})();