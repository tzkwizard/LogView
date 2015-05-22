(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', '$locationProvider', routeConfigurator]);
    function routeConfigurator($routeProvider, routes, $locationProvider) {

        /*   $locationProvider
         .html5Mode({
             enabled: true,
             requireBase: false,
             rewriteLinks:false
           });*/

        routes.forEach(function (r) {
            // $routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
        function setRoute(url, definition) {
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime
            });
            $routeProvider.when(url, definition);
        }
    }
    prime.$inject = ['dataconfig'];
    function prime(d) {
        d.prime();
    }



    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                controller: 'Loading as vm',
                config: {
                    templateUrl: 'app/component/load/Loading.html',
                    title: 'load',
                    settings: {

                    }
                }
            },
            {
                url: '/dashboard',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard',
                        icon: "dashboard",
                        tooltip: "Main Dashboard Page"
                    }
                }
            },
            {
                url: '/els',
                config: {
                    title: 'els',
                    templateUrl: 'app/component/els/els.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-search"></i> ELS',
                        icon: "search",
                        tooltip: "Main Search Page"
                    }
                }
            },
            {
                url: '/aggs',
                config: {
                    title: 'aggs',
                    templateUrl: 'app/component/agg/aggs.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-area-chart"></i> Aggs',
                        icon: "assessment",
                        tooltip: "Data Analysis Page"
                    }
                }
            },
            {
                url: '/todo',
                config: {
                    title: 'TODO',
                    templateUrl: 'app/component/load/TODO.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-cloud"></i> TODO',
                        icon: "setting",
                        tooltip: "To be continue"
                    }
                }
            },
            {
                url: '/els/:search',
                config: {
                    title: 'search',
                    templateUrl: 'app/component/els/els.html',
                    settings: {
                    }
                }
            },
            {
                url: '/elslist',
                config: {
                    title: 'elslist',
                    templateUrl: 'app/component/show/show.html',
                    settings: {
                        nav: 5,
                        icon: "windows",
                        tooltip: "list"
                    }
                }
            }
        ];
    }

    /*app.use(function (req, res) {
        res.sendfile(__dirname + '/Public/index.html');
    });*/


})();


