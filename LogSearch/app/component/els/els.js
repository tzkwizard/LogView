(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function (bsDialog, $rootScope, $routeParams,
           $scope, $modal, client, common, datasearch, dataconfig, $cookieStore, config) {


            var vm = this;
            vm.title = "Elasticsearch";
            vm.title2 = "Function";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);
            $scope.predicate = '_source.timestamp';
            $scope.trend = 'true';
            $scope.trend1 = 'true';
            $scope.trend2 = 'true';
            $scope.count = 0;
            vm.distance = 0;
            vm.location = "";

            //#region variable
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
            vm.showSplash = true;
            vm.filterfill = false;
            vm.condition = [];
            vm.Syntax = {
                title: 'Help',
                Description: "Terms Fields Escaping Special Characters"
            };
            //#endregion

            //#region function
            vm.search = search;
            vm.mSearch = mSearch;
            vm.trySeach = trySeach;
            vm.filtertemp = filtertemp;
            vm.getSampleData = getSampleData;
            vm.test = test;

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
                    templateUrl: 'resultModal.html',
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
                    log.info('Modal dismissed at: ' + new Date());
                });
            };
            //#endregion


            //#region Date-pick

            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy.MM.dd'];
            vm.format = vm.formats[4];
            vm.it = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week"];
            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

           /* //save time change on global
            $scope.$on("$destroy", function () {
                $rootScope.ft = vm.ft;
                $rootScope.st = vm.st;
            });*/
            vm.timeChange = timeChange;
            function timeChange() {
                $rootScope.ft = vm.ft;
                $rootScope.st = vm.st;
            }

            //change time span on scope
            function filterst(x) {
                switch (x) {
                    case "Last three months":
                        vm.st = moment(new Date()).subtract(3, 'month');
                        break;
                    case "Last Month":
                        vm.st = moment(new Date()).subtract(1, 'month');
                        break;
                    case "Last four weeks":
                        vm.st = moment(new Date()).subtract(28, 'days');
                        break;
                    case "Last three weeks":
                        vm.st = moment(new Date()).subtract(21, 'days');
                        break;
                    case "Last two weeks":
                        vm.st = moment(new Date()).subtract(14, 'days');
                        break;
                    case "Last week":
                        vm.st = moment(new Date()).subtract(7, 'days');
                        break;
                    default:
                        // log(x);
                        break;
                }

                search();

            }

            function today() {
                //vm.maxDate = new Date();
                // vm.dt=$filter('date')(vm.tempd, "yyyy.MM.dd");
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
                $rootScope.st = vm.st;
            };

            //open end date calendar
            vm.ftimeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $rootScope.ft = vm.ft;
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
                if ($rootScope.ft !== undefined && $rootScope.st !== undefined) {
                    vm.ft = $rootScope.ft;
                    vm.st = $rootScope.st;
                } else {
                    vm.st = moment(new Date()).subtract(2, 'month');
                    vm.ft = new Date();
                }



                if ($cookieStore.get('index') !== undefined && $rootScope.index !== undefined) {
                    if ($rootScope.index.length !== $cookieStore.get('index').length) {
                        log("Index Changed");
                        $cookieStore.remove('index');
                    }

                }
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

                /* if (ip === undefined) {
                     getFieldName();
                 } else {
                     ip.then(function (data) {
                         vm.indicesName = data;
                         getFieldName();
                     });
                 }*/


            }

            //Load Type
            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            //Load Field
            function getFieldName() {


                if (vm.indicesName[0] !== "" && vm.indicesName[0] !== undefined) {
                    vm.index = vm.indicesName[0];
                }
                if (vm.index !== "" && vm.index !== undefined) {
                    fp = dataconfig.getFieldName(vm.index, $rootScope.logtype);
                    // log(vm.fieldsName.length);
                }

                fp.then(function (data) {
                    vm.fieldsName = data;
                });

            }

            activate();
            function activate() {
                common.activateController([getIndexName(), getFieldName()], controllerId)
                    .then(function () {
                        common.$location.search();
                        if (common.$location.search.field === "" || common.$location.search.field === undefined) {
                            if (common.$location.search.text !== "") {
                                vm.searchText = common.$location.search.text;
                                search();
                            } else {
                                search();
                            }

                        } else {
                            vm.searchText = common.$location.search.field + " : " + common.$location.search.text;
                            search();

                        }


                        common.$location.search.field = "";
                        common.$location.search.text = "";
                        vm.showSplash = false;
                        log('Activated ELS search View');

                    });
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
                          /* vm.hitSearch = resp.hits.hits;
                           vm.total = resp.hits.total;
                           vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                           vm.getCurrentPageData(vm.hitSearch);
                           vm.type = "";
                           log('Loaded sample document');*/
                      });
            }
            //#endregion

            vm.locationF = "";
            vm.distanceF = "";
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
                vm.location = "";


                vm.processSearch = true;
                vm.hitSearch = "";
                vm.condition = [];
                addFilterdata();

                if (vm.searchText == undefined || vm.searchText === "") {
                    getSampleData().then(function () {
                        vm.processSearch = false;
                        random();
                    });

                } else {
                    // autoFill();
                    datasearch.basicSearch(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.field, vm.searchText, vm.condition, vm.st, vm.ft,vm.locationF,vm.distanceF)
                        .then(function (resp) {
                            if (resp.data.Total !== 0) {
                                vm.hitSearch = resp.data.Data;
                            }
                            vm.processSearch = false;
                            vm.total = resp.data.Total;
                            vm.tt = vm.total < vm.pagecount ? vm.total : vm.pagecount;
                            vm.getCurrentPageData(vm.hitSearch);
                            random();
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
            function autoFill() {
                dataconfig.autoFill().then(function (resp) {
                    vm.at = resp.data.AutoData;
                    toastr.info("Auto Fill Update !");

                });
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


            //#region Deprecated
            function filtertemp() {
                client.search({
                    index: 'mytest',
                    type: 'post',
                    body: {
                        query: {
                            /*match: {
                                "message": searchText
                            }*/
                            "filtered": {
                                "query": {
                                    "match": {
                                        "message": "hello"
                                    }
                                },
                                "filter": {
                                    "term": {
                                        "id": 2
                                    }
                                }
                            }
                        }
                    }
                }
                ).then(function (resp) {
                    vm.hits = resp.hits.hits;
                    // $scope.acount = $scope.hits.total;
                }, function (err) {
                    log(err.message);
                });


            }
            function mSearch(searchText) {
                client.search({
                    index: 'logs',
                    type: vm.type,
                    size: 100,
                    body: {
                        query: {
                            "filtered": {
                                "query": {
                                    "multi_match": {
                                        "query": searchText,
                                        "fields": ["username", "response", "message", "ip"]
                                    }

                                }

                            }

                        }
                    }
                }
                ).then(function (resp) {
                    vm.hitSearch = resp.hits.hits;
                }, function (err) {
                    log(err.message);
                });

            }
            //#endregion

        });

})();




