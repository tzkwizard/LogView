(function () {
    'use strict';

    var controllerId = 'menuSideNav';

    angular.module('app')
        .controller(controllerId, function ($rootScope, $scope, $timeout, $mdSidenav, common) {
            $scope.menuNav = [{ name: "DashBoard", icon: "content/images/icon/ic_dashboard_24px.svg", tooltip: "Main Dashboard Page" },
            { name: "ELS", icon: "content/images/icon/ic_search_24px.svg", tooltip: "Main Search Page" },
            { name: "AGGS", icon: "content/images/icon/ic_assessment_24px.svg", tooltip: "Data Analysis Page" },
            { name: "TODO", icon: "content/images/icon/ic_settings_24px.svg", tooltip: "To be continue" }
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
                      toastr.info("close left is done");
                  });
            };
        });
})();

