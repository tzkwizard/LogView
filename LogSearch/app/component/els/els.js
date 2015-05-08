(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function (bsDialog, $rootScope, $routeParams,
           $scope, $modal, client, common, datasearch, dataconfig, $cookieStore, config, $timeout, $mdBottomSheet) {


            var vm = this;
            vm.title = "Elasticsearch";
            vm.title2 = "Function";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);


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
            vm.acount = 4;
            vm.hits = "2";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.field = "";
            vm.index = $routeParams.index || "";
            vm.type = "";
            vm.pagecount = 1000;
            vm.fieldsName = [];
            vm.typesName = [];
            vm.indicesName = [];
            vm.t = [];
            vm.tt = 0;
            vm.ft = "";
            vm.st = "";
            vm.at = [];
            vm.filterfill = false;
            vm.condition = [];
            vm.Syntax = {
                title: 'Help',
                Description: "Terms Fields Escaping Special Characters"
            };
            vm.dunit = 'mi';
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
            vm.getTypeName = getTypeName;
            vm.filltext = filltext;
            vm.addfilter = addfilter;
            vm.removefilter = removefilter;
            vm.filterst = filterst;
            vm.autoFill = autoFill;
            vm.addFilterdata = addFilterdata;

            //#endregion


            //#region Test
            vm.tests = tests;

            function tests(x) {
                log("1");
            }


            function test() {
                //  bsDialog.deleteDialog('Session');
                //  bsDialog.confirmationDialog('Session');
                var x = ejs.RangeQuery("bytes").gte(17);
                var y = ejs.TermQuery("verb.raw", "GET");
                client.search({
                    index: vm.indicesName,
                    type: 'logs',
                    size: vm.pagecount,
                    body: ejs.Request()

                        .query(y)
                        .filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st))

                }).then(function (resp) {
                    vm.hitSearch = resp.hits.hits;
                    vm.total = resp.hits.total;
                    vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                    vm.getCurrentPageData(vm.hitSearch);
                }, function (err) {
                    log(err.message);
                });

            }
            //#endregion


            //#region Processorbar

            vm.showWarning = "";
            vm.dynamic = "";
            vm.ptype = "";

            vm.random = random;
            //fill process bar
            function random() {
                //var value = Math.floor((Math.random() * 100) + 1);
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


            //#region Date-pick

            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy.MM.dd'];
            vm.format = vm.formats[4];
            vm.it = ["Last 3 months", "Last Month", "Last 4 weeks", "Last 3 weeks", "Last 2 weeks", "Last week"];
            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            /* //save time change on global
             $scope.$on("$destroy", function () {
                 $rootScope.ft = vm.ft;
                 $rootScope.st = vm.st;
             });*/

            //save time change on global
            vm.timeChange = timeChange;
            function timeChange() {
                $rootScope.ft = vm.ft;
                $rootScope.st = vm.st;
            }

            //change time span on scope
            function filterst(x) {
                switch (x) {
                    case "Last year":
                        vm.st = moment(new Date()).subtract(1, 'year');
                        break;
                    case "Last 6 months":
                        vm.st = moment(new Date()).subtract(6, 'month');
                        break;
                    case "Last 3 months":
                        vm.st = moment(new Date()).subtract(3, 'month');
                        break;
                    case "Last Month":
                        vm.st = moment(new Date()).subtract(1, 'month');
                        break;
                    case "Last 4 weeks":
                        vm.st = moment(new Date()).subtract(4, 'week');
                        break;
                    case "Last 3 weeks":
                        vm.st = moment(new Date()).subtract(3, 'week');
                        break;
                    case "Last 2 weeks":
                        vm.st = moment(new Date()).subtract(2, 'week');
                        break;
                    case "Last week":
                        vm.st = moment(new Date()).subtract(1, 'week');
                        break;
                    case "Last 5 days":
                        vm.st = moment(new Date()).subtract(5, 'days');
                        break;
                    case "Last 3 days":
                        vm.st = moment(new Date()).subtract(3, 'days');
                        break;
                    case "Last 2 days":
                        vm.st = moment(new Date()).subtract(2, 'days');
                        break;
                    case "Last day":
                        vm.st = moment(new Date()).subtract(1, 'day');
                        break;
                    case "Last 12 hours":
                        vm.st = moment(new Date()).subtract(12, 'hour');
                        break;
                    case "Last 6 hours":
                        vm.st = moment(new Date()).subtract(6, 'hour');
                        break;
                    case "Last hour":
                        vm.st = moment(new Date()).subtract(1, 'hour');
                        break;
                    default:
                        // log(x);
                        break;
                }
                search();
            }

            vm.showListBottomSheet = showListBottomSheet;
            function showListBottomSheet() {
                //$scope.alert = '';
                $mdBottomSheet.show({
                    templateUrl: 'app/component/els/BottomListSheet.html',
                    controller: 'els'
                }).then(function (clickedItem) {
                    filterst(clickedItem);
                });
            };

            function today() {
                vm.st = moment(new Date()).subtract(1, 'month');
                vm.ft = new Date();
                toggleMin();
            }

            //disable after today
            vm.toggleMin = toggleMin;
            // vm.minDate = true;
            function toggleMin() {
                vm.tmind = new Date();
                //vm.tmind.setMonth(vm.tmind.getMonth() - 1);
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


            //#region View Load

            vm.im = 1;
            var ip;
            var fp;

            //refreh page
            vm.refresh = function () {
                BootstrapDialog.confirm({
                    message: 'Sure to Refresh?',
                    closable: true, // <-- Default value is false
                    draggable: true, // <-- Default value is false
                    btnCancelLabel: 'No thanks', // <-- Default value is 'Cancel',
                    btnOKLabel: 'Sure!', // <-- Default value is 'OK',
                    btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
                    callback: function (result) {
                        // result will be true if button was click, while it will be false if users close the dialog directly.
                        if (result) {
                            vm.searchText = "";
                            search();
                            vm.filterfill = false;
                            while (vm.im > 1) {
                                removefilter();

                            }
                            log("Refresh");
                        } else {
                            log('Nope.');
                        }
                    }
                });

            }

            //Load Index
            function getIndexName() {
                dataconfig.checkIndexCookie();

                vm.indicesName = $cookieStore.get('index');
                if ($cookieStore.get('index') === undefined) {
                    if ($rootScope.index !== undefined) {
                        $cookieStore.put('index', $rootScope.index);
                        vm.indicesName = $cookieStore.get('index');
                    } else {

                        //vm.indicesName = dataconfig.initIndex();
                        ip = dataconfig.initIndex();
                    }
                }

                if (ip !== undefined) {
                    return ip.then(function (data) {
                        vm.indicesName = data;
                    });
                }

                return null;

            }

            //Load Type
            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            //Load Field
            function getFieldName() {
                dataconfig.checkFieldCookie();

                vm.fieldsName = $cookieStore.get('logfield');
                if ($cookieStore.get('logfield') === undefined) {
                    if ($rootScope.logfield !== undefined) {
                        $cookieStore.put('logfield', $rootScope.logfield);
                        vm.fieldsName = $cookieStore.get('logfield');
                    } else {
                        fp = dataconfig.getFieldName("", "");
                    }
                }

                if (fp !== undefined) {
                    return fp.then(function (data) {
                        vm.fieldsName = data;
                    });
                }

                return null;

            }

            activate();
            function activate() {
                common.activateController([getIndexName(), getFieldName(), autoFill()], controllerId)
                    .then(function () {
                        init();
                        log('Activated ELS search View');
                    });
            }

            function init() {
                if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                    vm.ft = $rootScope.ft;
                    vm.st = $rootScope.st;
                } else {
                    vm.st = moment(new Date()).subtract(2, 'month');
                    vm.ft = new Date();
                }
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
                          refreshPage();
                          /* vm.hitSearch = resp.hits.hits;
                           vm.total = resp.hits.total;
                           vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                           vm.getCurrentPageData(vm.hitSearch);
                           vm.type = "";
                           log('Loaded sample document');*/
                      });
            }
            //#endregion


            //#region GetLocation
            vm.locationF = {
                lat: "",
                lon: ""
            };
            vm.distance = 0;
            vm.getLocation = getLocation;
            vm.asyncSelected = "";
            function getLocation(val) {
                return common.$http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: val,
                        sensor: false
                    }
                }).then(function (response) {
                    return response.data.results.map(function (item) {
                        return item.formatted_address;
                    });
                });
            };

            vm.transferLocation = transferLocation;
            function transferLocation() {
                common.$http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: vm.asyncSelected,
                        sensor: false
                    }
                })
                   .success(function (mapData) {
                       try {
                           var cor = mapData.results[0].geometry.location;
                           log(cor.lat + "---" + cor.lng);
                           if (cor.lat !== undefined && cor.lng !== undefined) {
                               vm.locationF.lat = cor.lat;
                               vm.locationF.lon = cor.lng;
                           }
                       } catch (e) {
                           log("cor" + e);
                       }
                   });

            }
            //#endregion


            //#region Search and Filter 

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
                log(vm.distanceF);
                if (vm.distance === 0 || vm.distance === null) {
                    vm.distance = 0;
                    vm.asyncSelected = "";
                    vm.locationF.lat = "";
                    vm.locationF.lon = "";
                    log("No distance");
                }



                if (vm.searchText == undefined || vm.searchText === "") {
                    getSampleData().then(function () {
                        vm.processSearch = false;
                        random();
                    });

                } else {
                    // autoFill();
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
                            /*vm.hitSearch = resp.hits.hits;
                            vm.total = resp.hits.total;
                            vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                            vm.getCurrentPageData(vm.hitSearch);
                            random();*/
                        }, function (err) {
                            // log("search data error " + err.message);
                        });
                }

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



            //update auto-fill data
            function autoFill($event) {
                if ($event === undefined || config.input.indexOf($event.keyCode) !== -1) {
                    vm.autocompleLoading = true;
                    return dataconfig.autoFill().then(function (resp) {
                        vm.at = resp.data.AutoData;
                        vm.autocompleLoading = false;

                    });
                }
                return null;
            }

            //fill searchText with filter information
            function filltext() {

                if (vm.im > 1) {
                    vm.searchText = "";

                    for (var i = 1; i < vm.im; i++) {
                        var s1 = document.getElementById('jselect' + i.toString());
                        var s2 = document.getElementById('fselect' + i.toString());
                        var s3 = document.getElementById('input' + i.toString());

                        if (s1.value === "MUST") {
                            if (s3.value !== "") {
                                if (i === 1) {
                                    vm.searchText += s2.value + " : \"" + s3.value + "\"^2";
                                } else {
                                    vm.searchText += " AND " + s2.value + " : \"" + s3.value + "\"^2";
                                }
                            }
                        }
                        else if (s1.value === "MUST_NOT") {
                            if (s3.value !== "") {
                                if (i === 1) {
                                    vm.searchText += " NOT " + s2.value + " : \"" + s3.value + "\"";
                                } else {
                                    vm.searchText += " NOT " + s2.value + " : \"" + s3.value + "\"";
                                }
                            }
                        } else {
                            if (s3.value !== "") {
                                if (i === 1) {
                                    vm.searchText += s2.value + " : \"" + s3.value + "\"";
                                } else {
                                    vm.searchText += " AND " + s2.value + " : \"" + s3.value + "\"";
                                }
                            }
                        }

                    }
                    vm.filterfill = true;
                    vm.field = "all";
                    search();
                }

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

            //#endregion


            //#region ResultModal

            vm.showModal = false;

            vm.popdata = {
                data: "",
                field: []
            };
            vm.items = ['item1', 'item2', 'item3'];

            //open result page
            vm.open = function (doc) {
                vm.popdata.data = doc;
                vm.popdata.field = vm.fieldsName;
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

            vm.refreshPage = refreshPage;

            //refresh page
            function refreshPage() {
                if (vm.pagecount === "0") {
                    vm.pagecount = vm.total;
                }

                if (vm.tt > vm.pagecount) {
                    vm.tt = vm.pagecount;
                } else {
                    vm.tt = Math.min(vm.total, vm.pagecount);
                }

                vm.getCurrentPageData(vm.hitSearch);
                random();
            }
            //#endregion


            //#region BottomSheet
            //#region BottomSheet
            $scope.ts = ["Last year", "Last 6 months", "Last 3 months", "Last Month",
            "Last 4 weeks", "Last 3 weeks", "Last 2 weeks", "Last week",
            "Last 5 days", "Last 3 days", "Last 2 days", "Last day",
             "Last 12 hours", "Last 6 hours", "Last hour"];
            $scope.listItemClick = function ($index) {
                var clickedItem = $scope.ts[$index];
                $mdBottomSheet.hide(clickedItem);
            };
        });
           //#endregion


})();

