(function () {
    'use strict';

    var controllerId = 'menuSideNav';

    angular.module('app')
        .controller(controllerId, function (routes, $mdSidenav) {
            var vm = this;
            vm.getNav = function () {
                return routes.filter(function (r) {
                    return r.config.settings && r.config.settings.nav;
                }).sort(function (r1, r2) {
                    return r1.config.settings.nav - r2.config.settings.nav;
                });
            }
            /* $scope.$on("$destroy", function () {
                 document.getElementById("nav").style.height = "10%";
             });*/
            vm.close = function () {
                $mdSidenav('left').close()
                  .then(function () {
                      //toastr.info("close left is done");
                  });
            };
        });
})();

