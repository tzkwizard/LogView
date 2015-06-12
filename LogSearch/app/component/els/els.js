(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function (common, elsService, config, commonService) {
            var vm = this;
            vm.title = "Function";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);

            //#region test
            vm.strength = "";
            vm.password = '123';
            vm.grade = function () {
                var size = vm.password.length;
                if (size > 8) {
                    vm.strength = 'strong';
                } else if (size > 3) {
                    vm.strength = 'medium';
                } else {
                    vm.strength = 'weak';
                }
            };
            //#endregion

            //#region variable
            vm.autocompleLoading = false; // spinner for autofill
            vm.processSearch = false; //spinner for search
            vm.searchText = common.$routeParams.search || '';
            vm.hitSearch = "";
            vm.field = "";
            vm.fieldsName = [];
            vm.indicesName = [];
            vm.pagecount = 1000;
            vm.pagetotal = 0;//    real show result number
            vm.total = 0;// possible max result number
            vm.pagesizeArr = ["5", "10", "25", "50", "100"];
            vm.ft = ""; //end time
            vm.st = ""; //start time
            vm.autoText = [];
            vm.condition = [];
            vm.Syntax = {
                title: 'Search : ',
                Description: " Field(verb?) : Text(GET?)"
            };
            vm.distance = 0;
            vm.dunit = 'mi';
            vm.timeShow = false;
            var filterfill = false; // flag to fill searchtext
            vm.count = 0;// filter number  
            var autocache = ["", "", "", ""];
            var locationF = {
                lat: "",
                lon: ""
            };
            //#endregion

            //#region public function
            vm.search = search;
            vm.trySearch = trySearch;
            vm.refresh = refresh;
            vm.pageChanged = pageChanged;
            vm.fillText = fillText;
            vm.filterst = filterst; //change time span
            vm.timeChange = timeChange;
            vm.transferLocation = transferLocation;
            vm.getLocation = getLocation;
            vm.refreshPage = refreshPage;
            vm.showListBottomSheet = showListBottomSheet;
            vm.showlist = showlist;
            vm.showResult = showResult;
            vm.autoFill = autoFill;
            //#endregion


            //#region View Load
            function getMap() {
                var promise = commonService.loadMap();
                try {
                    return promise.then(function () {
                        vm.indicesName = common.$rootScope.index;
                        vm.fieldsName = common.$rootScope.logfield;
                    });
                } catch (e) {
                    vm.indicesName = promise.indicesName;
                    vm.fieldsName = promise.fieldsName;
                    return null;
                }
            }

            activate();
            function activate() {
                common.activateController([getMap()], controllerId)
                    .then(function () {
                        init();
                        autoFill(true);
                        common.$rootScope.spinner = false;
                        log('Activated ELS search View');
                    });

            }

            function init() {
                vm.ft = common.$rootScope.ft;
                vm.st = common.$rootScope.st;
                common.$location.search();
                if (common.$location.search.field === "" || common.$location.search.field === undefined) {
                    if (common.$location.search.text !== "") {
                        vm.searchText = common.$location.search.text;
                    }
                } else {
                    vm.searchText = common.$location.search.field + " : " + common.$location.search.text;
                }
                search();
                common.$location.search.field = "";
                common.$location.search.text = "";
            }

            function getSampleData() {
                return elsService.data.getSampledata(vm.indicesName, common.$rootScope.logtype, vm.pagecount, vm.st, vm.ft, locationF, vm.distanceF)
                      .then(function (resp) {
                          sanitizeData(resp);
                      }, function (e) {
                          log("sampledata " + e.data.Message);
                      });
            }
            //#endregion


            //#region main search
            function trySearch($event) {
                if ($event.keyCode === config.keyCodes.enter) {
                    search();
                }
            }

            function searchPre() {
                vm.hitSearch = "";
                vm.distanceF = vm.distance + vm.dunit;
                if (vm.distance === 0 || vm.distance === null) {
                    vm.distance = 0;
                    vm.asyncSelected = "";
                    locationF.lat = "";
                    locationF.lon = "";
                    //log("No distance");
                }
                return !filterfill ? angular.copy(vm.condition) : [];
            }
            //core search function
            function search() {
                if (vm.st > vm.ft) {
                    log("Date error");
                    return;
                }
                vm.processSearch = true;                
                var condition = searchPre();

                if (vm.searchText == undefined || vm.searchText === "") {
                    getSampleData();
                } else {
                    elsService.data.basicSearch(vm.indicesName, common.$rootScope.logtype, vm.pagecount, vm.field, vm.searchText, condition, vm.st, vm.ft, locationF, vm.distanceF)
                        .then(function (resp) {
                            sanitizeData(resp);
                        }, function (e) {
                            log("search data error " + e.data.Message);
                        });
                }
            }

            function sanitizeData(resp) {
                vm.total = resp.data.Total;
                if (resp.data.Total !== 0) {
                    vm.hitSearch = resp.data.Data;
                    if (resp.data.Total >= 20) {
                        vm.pagecountArr = [Math.floor(vm.total / 20), Math.floor(vm.total / 10), Math.floor(vm.total / 5), Math.floor(vm.total / 2), vm.total];
                    } else {
                        vm.pagecountArr = [resp.data.Total];
                    }
                }
                vm.pagetotal = vm.total < vm.pagecount ? vm.total : vm.pagecount;
                getCurrentPageData(vm.hitSearch);
                vm.processSearch = false;
            }

            //get auto-fill data
            function autoFill(force) {
                if (force !== true && vm.searchText === "") return null;
                vm.autocompleLoading = true;
                return elsService.data.autoFill(vm.searchText).then(function (resp) {
                    if (resp.data.AutoData.length < 1000 && vm.autoText.length < 1000) {
                        var autotemp = vm.autoText;
                        autocache = [autocache[1], autocache[2], autocache[3], resp.data.AutoData];
                        angular.forEach(autocache, function (x) {
                            autotemp = commonService.arrayUnique(autotemp.concat(x));
                        });
                        vm.autoText = autotemp;
                    } else {
                        vm.autoText = resp.data.AutoData;
                    }
                    vm.autocompleLoading = false;
                });
            }

            function showResult(data) {
                elsService.openResult(data);
            }

            function refresh(ev) {
                var confirm = common.$mdDialog.confirm()
                  .title('Would you like to Refresh Page?')
                  .content('All of the setting will become default.')
                  .ariaLabel('Lucky day')
                  .ok('Yes, sure!')
                  .cancel('No, wait a minute.')
                  .targetEvent(ev);
                common.$mdDialog.show(confirm).then(function () {
                    vm.searchText = "";
                    search();
                    filterfill = false;
                    while (vm.count > 1) {
                        removefilter();
                    }
                    log("Refresh");
                });
            }

            function showlist() {
                common.$rootScope.searchresult = vm.hitSearch;
                common.$location.path("/elslist");
            }
            //#endregion


            //#region Date-pick
            vm.formats = config.time.format;
            vm.format = vm.formats[0];
            vm.it = config.time.timeSpan.s;
            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            function timeChange() {
                common.$rootScope.ft = vm.ft;
                common.$rootScope.st = vm.st;
            }

            //change time span on scope
            function filterst(span) {
                vm.st = commonService.changeTimeSpan(span);
                search();
            }

            //open start date calendar
            vm.timeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.timeopened = true;
            };

            //open end date calendar
            vm.ftimeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                vm.ftimeopened = true;
            };

            function showListBottomSheet() {
                elsService.showListBottomSheet().then(function (span) {
                    filterst(span);
                    timeChange();
                });
            }
            //#endregion


            //#region function block                     
            vm.asyncSelected = "";
            //get address
            function getLocation(val) {
                return elsService.data.getLocation(val);
            }

            //transfer address to cordinate
            function transferLocation() {
                elsService.data.transferLocation(vm.asyncSelected).then(function (data) {
                    try {
                        var cor = data.data.results[0].geometry.location;
                        toastr.info(cor.lat + "---" + cor.lng);
                        locationF.lat = cor.lat;
                        locationF.lon = cor.lng;
                    } catch (e) {
                        toastr.info("cor : " + e);
                    }
                });
            }

            //fill searchText with filter information
            function fillText() {
                if (vm.count > 0) {
                    vm.searchText = elsService.fillSearchText(vm.condition);
                    filterfill = true;
                    vm.field = "all";
                    search();
                }
            }
            //#endregion


            //#region Paging 
            vm.paging = {
                currentPage: 1,
                maxPagesToShow: 8,
                pageSize: 20
            };

            Object.defineProperty(vm.paging, 'pageCount', {
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
                search();
            }
            //#endregion

        });
})();

