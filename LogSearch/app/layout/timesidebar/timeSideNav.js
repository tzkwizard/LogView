(function () {
    'use strict';

    var controllerId = 'timeSideNav';

    angular.module('layout')
        .controller(controllerId, function (common, commonService, config) {
            var vm = this;
            vm.time = config.time.timeSpan.m;
            vm.nav = function (span) {
                common.$rootScope.ft = new Date();
                common.$rootScope.st = commonService.changeTimeSpan(span);
                common.$mdSidenav('right').close();
                common.$location.path(common.$location.path() + "/");
            }
            vm.close = function () {
                common.$mdSidenav('right').close()
                  .then(function () {
                      //toastr.info("close RIGHT is done");
                  });
            };
        });
})();

