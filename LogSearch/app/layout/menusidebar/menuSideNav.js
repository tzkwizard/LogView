(function () {
    'use strict';

    var controllerId = 'menuSideNav';

    angular.module('app')
        .controller(controllerId, function ($rootScope, $scope, $timeout, $mdSidenav, common) {
            $scope.menuNav = [{ name: "DashBoard", icon: "dashboard", tooltip: "Main Dashboard Page" },
            { name: "ELS", icon: "search", tooltip: "Main Search Page" },
            { name: "AGGS", icon: "assessment", tooltip: "Data Analysis Page" },
            { name: "TODO", icon: "setting", tooltip: "To be continue" }
            ];

            $scope.nav = function (n) {
                var route = "/" + n.toLowerCase();
                common.$location.path(route);
            }

            $scope.$on("$destroy", function () {
                document.getElementById("nav").style.height = "10%";
            });
            $scope.close = function () {
                $mdSidenav('left').close()
                  .then(function () {
                      //toastr.info("close left is done");
                  });
            };
        });
})();

