(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function ($rootScope, $routeParams,
           $scope, $modal, common, datasearch, dataconfig, $cookieStore, config, $timeout, $mdBottomSheet) {

            var vm = this;
            vm.title = "Elasticsearch";
            vm.title2 = "Function";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);
            $scope.collapse = true;


            //#region variable
            $scope.predicate = '_source.timestamp';
            $scope.trend = 'true';
            $scope.trend1 = 'true';
            $scope.trend2 = 'true';
            $scope.count = 0;
            vm.distance = 0;
            vm.autocompleLoading = false;
            vm.searchText = $routeParams.search || '';
            vm.processSearch = false;
            vm.hitSearch = "";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.field = "";
            vm.index = $routeParams.index || "";
            vm.type = "";
            vm.pagecount = 1000;
            vm.fieldsName = [];
            vm.indicesName = [];
            vm.tt = 0;
            vm.ft = "";
            vm.st = "";
            vm.autoText = [];
            vm.filterfill = false;
            vm.condition = [];
            vm.Syntax = {
                title: 'Search : ',
                Description: " Field(verb?) : Text(GET?)"
            };
            vm.dunit = 'mi';
            vm.timeShow = false;
            vm.im = 1;
            vm.pagesizeArr = ["5", "10", "25", "50", "100"];
            vm.pagecountArr = ["100", "500", "1000", "5000", "10000"];
            //#endregion

            //#region function
            vm.search = search;
            vm.trySeach = trySeach;
            vm.getSampleData = getSampleData;
            vm.test = test;
            vm.init = init;

            vm.today = today;
            vm.pageChanged = pageChanged;
            vm.getCurrentPageData = getCurrentPageData;
            vm.getFieldName = getFieldName;
            vm.getIndexName = getIndexName;
            vm.filltext = filltext;
            vm.addfilter = addfilter;
            vm.removefilter = removefilter;
            vm.filterst = filterst;
            vm.autoFill = autoFill;
            vm.addFilterdata = addFilterdata;
            vm.transferLocation = transferLocation;
            vm.getLocation = getLocation;
            vm.refreshPage = refreshPage;
            vm.showListBottomSheet = showListBottomSheet;
            vm.timeChange = timeChange;
            //#endregion


            //#region Test
            function test() {
                //  bsDialog.deleteDialog('Session');
                //  bsDialog.confirmationDialog('Session');       
            }
            //#endregion


            //#region View Load
            //Load Index
            function getIndexName() {
                var ip = dataconfig.loadIndex();
                try {
                    return ip.then(function (data) {
                        vm.indicesName = data;
                    });
                } catch (e) {
                    vm.indicesName = ip;
                    return null;
                }
            }
            //Load Field
            function getFieldName() {
                var fp = dataconfig.loadField();
                try {
                    return fp.then(function (data) {
                        vm.fieldsName = data;
                    });
                } catch (e) {
                    vm.fieldsName = fp;
                    return null;
                }
            }

            activate();
            function activate() {
                common.activateController([getIndexName(), getFieldName(), autoFill(true)], controllerId)
                    .then(function () {
                        init();
                        log('Activated ELS search View');
                    });
            }

            function init() {
                vm.ft = $rootScope.ft;
                vm.st = $rootScope.st;
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

            //get sample search result
            function getSampleData() {
                return datasearch.getSampledata(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.st, vm.ft, vm.locationF, vm.distanceF)
                      .then(function (resp) {
                          if (resp.data.Total !== 0) {
                              vm.hitSearch = resp.data.Data;
                          }
                          vm.total = resp.data.Total;
                          vm.tt = resp.total < vm.pagecount ? resp.total : vm.pagecount;
                          vm.getCurrentPageData(vm.hitSearch);
                          random();
                          vm.processSearch = false;
                          refreshPage();
                      }, function (e) {
                          log("sampledata " + e.data.Message);
                      });
            }
            //#endregion


            //#region main search
            function trySeach($event) {
                if ($event.keyCode === config.keyCodes.esc) {
                    vm.searchText = '';
                    return;
                }
                if ($event.keyCode === config.keyCodes.enter) {
                    search();
                }
            }

            //core search function
            function search() {
                if (vm.st > vm.ft) {
                    log("Date error");
                    return;
                }
                vm.processSearch = true;
                vm.hitSearch = "";
                vm.condition = [];
                addFilterdata();

                vm.distanceF = vm.distance + vm.dunit;
                if (vm.distance === 0 || vm.distance === null) {
                    vm.distance = 0;
                    vm.asyncSelected = "";
                    vm.locationF.lat = "";
                    vm.locationF.lon = "";
                    //log("No distance");
                }
                if (vm.searchText == undefined || vm.searchText === "") {
                    getSampleData();
                } else {
                    datasearch.basicSearch(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.field, vm.searchText, vm.condition, vm.st, vm.ft, vm.locationF, vm.distanceF)
                        .then(function (resp) {
                            if (resp.data.Total !== 0) {
                                vm.hitSearch = resp.data.Data;
                            }
                            vm.processSearch = false;
                            vm.total = resp.data.Total;
                            vm.tt = vm.total < vm.pagecount ? vm.total : vm.pagecount;
                            vm.getCurrentPageData(vm.hitSearch);
                            random();
                            refreshPage();
                        }, function (e) {
                            log("search data error " + e.data.Message);
                        });
                }
            }

            //update auto-fill data
            var appre = "";
            var apre = "";
            var anow = "";
            function autoFill(force) {
                vm.autocompleLoading = true;
                if (force !== true && vm.searchText === "") return null;
                return datasearch.autoFill(vm.searchText).then(function (resp) {
                    appre = apre; apre = anow;
                    anow = resp.data.AutoData;
                    if (vm.autoText.length < 1000 && vm.autoText.length !== 0) {
                        vm.autoText = dataconfig.arrayUnique(anow.concat(dataconfig.arrayUnique(apre.concat(appre))));
                    } else {
                        vm.autoText = anow.concat(apre.concat(appre));
                    }
                    vm.autocompleLoading = false;
                    return resp.data.AutoData;
                });
            }

            //fill condition with filter information
            function addFilterdata() {
                if (!vm.filterfill) {
                    for (var i = 1; i < vm.im; i++) {
                        var s1 = document.getElementById('jselect' + i.toString());
                        var s2 = document.getElementById('fselect' + i.toString());
                        var s3 = document.getElementById('input' + i.toString());
                        var filterdata = {
                            text: s3.value,
                            field: s2.value,
                            condition: s1.value
                        }
                        vm.condition.push(filterdata);
                    }
                }
            }

            //refreh page
            vm.refresh = function () {
                BootstrapDialog.confirm({
                    message: 'Sure to Refresh?',
                    closable: true, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
                    callback: function (result) {
                        if (result) {
                            vm.searchText = "";
                            search();
                            vm.filterfill = false;
                            while (vm.im > 1) {
                                removefilter();
                            }
                            log("Refresh");
                        }
                    }
                });
            }
            //#endregion


            //#region Date-pick
            vm.formats = ['yyyy.MM.dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];
            vm.it = ["Last 3 months", "Last Month", "Last 4 weeks", "Last 3 weeks", "Last 2 weeks", "Last week"];
            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            function timeChange() {
                $rootScope.ft = vm.ft;
                $rootScope.st = vm.st;
            }

            //change time span on scope
            function filterst(span) {
                vm.st = dataconfig.changeTimeSpan(span);
                search();
            }

            function today() {
                vm.st = moment(new Date()).subtract(1, 'month').toDate();
                vm.ft = new Date();
                toggleMin();
            }

            //disable after today
            vm.toggleMin = toggleMin;

            function toggleMin() {
                vm.tmind = new Date();
                vm.minDate = vm.minDate ? null : vm.tmind;
            };

            vm.clear = function () {
                vm.st = null;
            };

            // Disable weekend selection
            vm.disabled = function (date, mode) {
                //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

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

            //#endregion


            //#region function block
            vm.locationF = {
                lat: "",
                lon: ""
            };
            vm.distance = 0;
            vm.asyncSelected = "";
            //get address
            function getLocation(val) {
                return datasearch.getLocation(val);
            }

            //transfer address to cordinate
            function transferLocation() {
                datasearch.transferLocation(vm.asyncSelected).then(function (data) {
                    try {
                        var cor = data.data.results[0].geometry.location;
                        toastr.info(cor.lat + "---" + cor.lng);
                        vm.locationF.lat = cor.lat;
                        vm.locationF.lon = cor.lng;
                    } catch (e) {
                        toastr.info("cor" + e);
                    }
                });
            }

            //add filter button
            function addfilter() {
                dataconfig.addFilter(vm.im, vm.fieldsName);
                vm.im++;
            }

            //delete filter button
            function removefilter() {
                var x = vm.im - 1;
                if (x >= 1) {
                    dataconfig.removeFilter(x);
                    vm.im--;
                }
            }

            //fill searchText with filter information
            function filltext() {
                if (vm.im > 1) {
                    vm.searchText = dataconfig.fillSearchText(vm.im);
                    vm.filterfill = true;
                    vm.field = "all";
                    search();
                }
            }
            //#endregion


            //#region Paging 
            vm.paging = {
                currentPage: 1,
                maxPagesToShow: 5,
                pageSize: 5
            };

            Object.defineProperty(vm.paging, 'pageCount', {
                get: function () {
                    return Math.floor(vm.tt / vm.paging.pageSize) + 1;
                }
            });

            //get current page data
            function getCurrentPageData(res) {
                vm.res = [];
                vm.j = 0;
                vm.pagenumber = vm.paging.pageSize * vm.paging.currentPage;
                if (vm.pagenumber > vm.tt)
                    vm.pagenumber = vm.tt;
                for (vm.i = (vm.paging.currentPage - 1) * vm.paging.pageSize; vm.i < vm.pagenumber; vm.i++) {
                    vm.res[vm.j] = res[vm.i];
                    vm.j++;
                }
            }

            //change page
            function pageChanged() {
                vm.getCurrentPageData(vm.hitSearch);
            }

            //refresh page
            function refreshPage() {
                if (vm.tt > vm.pagecount) {
                    vm.tt = vm.pagecount;
                } else {
                    vm.tt = Math.min(vm.total, vm.pagecount);
                }
                vm.getCurrentPageData(vm.hitSearch);
                random();
            }
            //#endregion


            //#region Processorbar
            vm.showWarning = "";
            vm.dynamic = "";
            vm.ptype = "";
            vm.random = random;
            //fill process bar
            function random() {
                var value = vm.tt / vm.total * 100;
                var ptype;
                //log(value);
                if (value < 20) {
                    ptype = 'idle';
                } else if (value < 60) {
                    ptype = 'regular';
                } else if (value < 85) {
                    ptype = 'warning';
                } else {
                    ptype = 'danger';
                }
                vm.showWarning = (ptype === 'danger' || ptype === 'warning');
                vm.dynamic = value;
                vm.ptype = ptype;
            };
            //#endregion


            //#region ResultModal
            vm.popdata = {
                data: ""
            };
            vm.items = ['item1', 'item2', 'item3'];

            //open result page
            vm.open = function (doc) {
                vm.popdata.data = doc;
                var modalInstance = $modal.open({
                    templateUrl: 'app/component/els/result/resultModal.html',
                    controller: 'resultModal',
                    //size: 'lg',
                    resolve: {
                        items: function () {
                            return vm.popdata;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    vm.selected = selectedItem;
                }, function () {
                    log('Modal dismissed at: ' + new Date());
                });
            };
            //#endregion


            //#region BottomSheet
            function showListBottomSheet() {
                $mdBottomSheet.show({
                    templateUrl: 'app/component/els/BottomListSheet.html',
                    controller: 'els'
                }).then(function (clickedItem) {
                    filterst(clickedItem);
                    timeChange();
                });
            };

            $scope.ts = ["Last year", "Last 6 months", "Last 3 months", "Last Month", "Last 4 weeks", "Last 3 weeks", "Last 2 weeks", "Last week",
            "Last 5 days", "Last 3 days", "Last 2 days", "Last day", "Last 12 hours", "Last 6 hours", "Last hour"];
            $scope.listItemClick = function ($index) {
                var clickedItem = $scope.ts[$index];
                $mdBottomSheet.hide(clickedItem);
            };
        });
    //#endregion


})();

