(function () {
    'use strict';

    var controllerId = 'timeSideNav';

    angular.module('app.layout')
        .controller(controllerId, function (common, dataconfig, config) {
            var vm = this;
            vm.time = config.time.timeSpan.m;
            vm.nav = function (span) {
                common.$rootScope.ft = new Date();
                common.$rootScope.st = dataconfig.changeTimeSpan(span);
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

