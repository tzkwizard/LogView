(function () {
    'use strict';

    var controllerId = 'show';

    angular.module('show',[])
        .controller(controllerId, function (common, elsService) {
            var vm = this;
            vm.title = "Elasticsearch";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);

            //#region variable and public function
            vm.predicate = '_source.timestamp';
            vm.trend = ["true", "true", "true", "true", "true", "true"];
            vm.hitSearch = common.$rootScope.searchresult;
            vm.pagesizeArr = ["5", "10", "25", "50", "100"];

            vm.pagecount = 1000;
            vm.pageChanged = pageChanged;
            vm.refreshPage = refreshPage;
            vm.backPage = backPage;
            vm.showResult = showResult;
            //#endregion


            //#region View Load
            activate();
            function activate() {
                common.activateController([], controllerId)
                    .then(function () {
                        init();
                        common.$rootScope.spinner = false;
                        log('Activated Show search View');
                    });
            }

            function init() {
                if (vm.hitSearch === undefined) {
                    vm.total = 0;
                } else {
                    vm.total = vm.hitSearch.length;
                    if (vm.total !== 0) {
                        if (vm.total >= 20) {
                            vm.pagecountArr = [Math.floor(vm.total / 20), Math.floor(vm.total / 10), Math.floor(vm.total / 5), Math.floor(vm.total / 2), vm.total];
                        } else {
                            vm.pagecountArr = [vm.total];
                        }
                    }
                    refreshPage();
                }
            }

            function backPage() {
                common.$location.path("/els");
            }
            //#endregion


            //#region ResultModal
            function showResult(data) {
                elsService.openResult(data);
            }
            //#endregion


            //#region Paging 
            vm.paging = {
                currentPage: 1,
                maxPagesToShow: 5,
                pageSize: 50
            };

            Object.defineProperty(vm.paging, 'pageCount', {    //unwriteable
                get: function () {
                    return Math.floor(vm.pagetotal / vm.paging.pageSize) + 1;
                }
            });

            //get current page data
            function getCurrentPageData(res) {
                vm.res = [];
                vm.j = 0;
                vm.pagenumber = vm.paging.pageSize * vm.paging.currentPage;
                if (vm.pagenumber > vm.pagetotal)
                    vm.pagenumber = vm.pagetotal; // handle overflow of lastpage
                for (vm.i = (vm.paging.currentPage - 1) * vm.paging.pageSize; vm.i < vm.pagenumber; vm.i++) {
                    vm.res[vm.j] = res[vm.i];
                    vm.j++;
                }
            }

            //change page
            function pageChanged() {
                getCurrentPageData(vm.hitSearch);
            }

            //refresh page
            function refreshPage() {
                vm.pagetotal = (vm.pagetotal > vm.pagecount) ? vm.pagecount : Math.min(vm.total, vm.pagecount);
                getCurrentPageData(vm.hitSearch);
            }
            //#endregion


        });
})();

