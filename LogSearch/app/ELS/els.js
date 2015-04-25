(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function ($timeout, bsDialog, $rootScope, $routeParams,
         $injector, $log, $scope, $location, $modal, client, common, datasearch, dataconfig, $cookieStore) {


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

            

            //#region variable
            vm.fi = "";
            vm.searchText = $routeParams.search || '';
            vm.hitSearch = "";
            vm.acount = 4;
            vm.hits = "2";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.field = "";
            vm.index = $routeParams.index || "";
            vm.type = "";
            vm.filterAggName = "";
            vm.pagecount = 1000;
            vm.fieldsName = [];
            vm.typesName = [];
            vm.indicesName = [];
            vm.t = [];
            vm.tt = 0;
            vm.ft = "";
            vm.st = "";

            vm.showSplash = true;

            vm.Syntax = {
                title: 'Help',
                Description: "Terms Fields Escaping Special Characters"
            };
            //#endregion

            //#region function
            vm.search = search;
            vm.mSearch = mSearch;
            vm.filtertemp = filtertemp;
            vm.init = init;
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
                        //.query(ejs.MatchQuery("message", searchText).zeroTermsQuery("all"))
                        //.query(ejs.BoolQuery().must(ejs.MatchQuery("message", searchText)).mustNot(ejs.MatchQuery("message", "java")))
                        //  .query(ejs.BoostingQuery(ejs.MultiMatchQuery(["username", "response", "message", "ip"], searchText), ejs.MatchQuery("message", "java"), 0.2))
                        //   .query(ejs.CommonTermsQuery("message", searchText).cutoffFrequency(0.01).highFreqOperator("and").minimumShouldMatchLowFreq(2))
                        //.query(ejs.BoolQuery().mustNot(ejs.QueryStringQuery('dev')))
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


                /* var t1 = document.getElementById('jselect1');
                 var t2 = document.getElementById('fselect1');
                 var t3 = document.getElementById('input1');
 
 
                 toastr.info(t1.value + t2.value + t3.value + vm.fi1);*/

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

            function pageChanged() {
                vm.getCurrentPageData(vm.hitSearch);
            }

            vm.refreshPage = refreshPage;

            function refreshPage() {
                // vm.tt = vm.total;
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
                    $log.info('Modal dismissed at: ' + new Date());
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

            
            //today();


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
                $rootScope.ft = vm.ft;
                $rootScope.st = vm.st;
                search();

            }

            function today() {
                //vm.maxDate = new Date();
                // vm.dt=$filter('date')(vm.tempd, "yyyy.MM.dd");
                vm.st = moment(new Date()).subtract(1, 'month');
                vm.ft = new Date();
                toggleMin();
            }

            vm.toggleMin = toggleMin;
            // vm.minDate = true;
            function toggleMin() {
                vm.tmind = new Date();
                vm.tmind.setMonth(vm.tmind.getMonth() - 1);
                vm.minDate = vm.minDate ? null : vm.tmind;
            };


            vm.clear = function () {
                vm.st = null;
            };

            // Disable weekend selection
            vm.disabled = function (date, mode) {
                //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            vm.timeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();               
                vm.timeopened = true;
                $rootScope.st = vm.st;
            };

            vm.ftimeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $rootScope.ft = vm.ft;
                vm.ftimeopened = true;
            };

            //#endregion


            //#region View Load

            vm.im = 1;

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
                            log("Refresh");
                        } else {
                            log('Nope.');
                        }
                    }
                });



            }

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
                                    vm.searchText += s2.value + " : " + s3.value + "^2";
                                } else {
                                    vm.searchText += " AND " + s2.value + " : " + s3.value + "^2";
                                }
                            }
                        }
                        else if (s1.value === "MUST_NOT") {
                            if (s3.value !== "") {
                                if (i === 1) {
                                    vm.searchText += " NOT " + s2.value + " : " + s3.value;
                                } else {
                                    vm.searchText += " NOT " + s2.value + " : " + s3.value;
                                }
                            }
                        } else {
                            if (s3.value !== "") {
                                if (i === 1) {
                                    vm.searchText += s2.value + " : " + s3.value;
                                } else {
                                    vm.searchText += " AND " + s2.value + " : " + s3.value;
                                }
                            }
                        }

                    }

                }
            }



            function addfilter() {
                dataconfig.addFilter(vm.im, vm.fieldsName);
                vm.im++;
            }


            function removefilter() {

                var x = vm.im - 1;
                if (x >= 1) {
                    dataconfig.removeFilter(x);
                    vm.im--;
                }
            }

            var ip;
            var fp;
            function getIndexName() {

                vm.ft = $rootScope.ft;
                vm.st = $rootScope.st;

                if ($cookieStore.get('index') !== undefined&&$rootScope.index!==undefined) {
                    if ($rootScope.index.length !== $cookieStore.get('index').length) {
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

                //$timeout(getFieldName, 200);
                if (ip === undefined) {
                    getFieldName();
                }else{
                ip.then(function(data) {
                    vm.indicesName = data;
                    getFieldName();
                });
                }
               
                
            }



            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }

            function getFieldName() {


                if (vm.indicesName[0] !== "" && vm.indicesName[0] !== undefined) {
                    vm.index = vm.indicesName[0];
                }
                if (vm.index !== "" && vm.index !== undefined) {
                   fp = dataconfig.getFieldName(vm.index, $rootScope.logtype);
                    // log(vm.fieldsName.length);
                }

                fp.then(function(data) {
                    vm.fieldsName = data;
                });

            }

            activate();
            function activate() {                
                common.activateController([getIndexName()], controllerId)
                    .then(function () {
                        $location.search();
                      

                        if ($location.search.text !== "") {
                            vm.searchText = $location.search.text;
                        }

                        if ($location.search().field === "" || $location.search().field === undefined) {
                            search();
                        } else {
                            vm.field = $location.search().field;
                            search();
                            $location.search().field = "";
                        }
                        $location.search.text = "";
                        //init();
                        vm.showSplash = false;
                        log('Activated ELS search View');
                        
                });
            }

            function init() {

                datasearch.getSampledata(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.st, vm.ft)
                    .then(function (resp) {
                    vm.hitSearch = resp.hits.hits;
                    vm.total = resp.hits.total;
                    vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                    vm.getCurrentPageData(vm.hitSearch);
                    vm.type = "";
                    //log('Loaded sample document');
                });
            }
            //#endregion


            //#region Search and Filter 
            vm.condition = "";

            function search() {          
                    vm.hitSearch = "";
                    if (vm.searchText == undefined || vm.searchText === "") {
                        init();
                        $timeout(random, 200);

                    } else {

                        datasearch.basicSearch(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.field, vm.searchText, vm.filterAggName, vm.fi, vm.condition, vm.st, vm.ft)
                            .then(function (resp) {
                                vm.hitSearch = resp.hits.hits;
                                vm.total = resp.hits.total;
                                /*if (vm.total === 0) {
                                    log("None Result");
                                }*/
                                vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                                vm.getCurrentPageData(vm.hitSearch);
                                $timeout(random, 200);
                            }, function (err) {
                                log("search data error "+err.message);                                
                            });
                    }

                }

            


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






(function () {
    'use strict';

    var controllerId = 'resultModal';

    angular.module('app')
        .controller(controllerId, function ($scope, $modalInstance, $location, common, items) {

            //#region variable
            $scope.title = "Detailed search result";
            $scope.items = items.data;
            $scope.field = items.field;

            $scope.selected = {
                item: ""
            };

            $scope.mySelections = [];
            $scope.myData = [];
            //#endregion


            //#region Form1
            angular.forEach(Object.keys($scope.items._source), function (item) {
                $scope.myData.push({
                    Field: item, Value: $scope.items._source[item]
                });
            });

            /* $scope.myData = [
                 { Field: "UserIP", Value: $scope.items._source.clientip },
                 { Field: "Location", Value: $scope.items._source.geoip },
                 { Field: "HTTPmethod ", Value: $scope.items._source.verb },
                 { Field: "ResquestApi", Value: $scope.items._source.request },
                 { Field: "RuquestTime", Value: $scope.items._source.timestamp },
                 { Field: "Referrer", Value: $scope.items._source.referrer },
                 { Field: "ActualAction", Value: $scope.items._source.action }
             ];*/


            $scope.gridOptions = {
                columnDefs: [
                    { field: 'Field', displayName: 'Field', width: 120 },
                    { field: 'Value', displayName: 'Value', width: 120 }
                ],
                data: 'myData',
                selectedItems: $scope.mySelections,
                //  multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    //var x= $scope.mySelections.pop();
                    //  toastr.info($scope.mySelections.pop());
                    angular.forEach($scope.mySelections, function (item) {
                        // toastr.info(item.Value);
                        $scope.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };
            //#endregion


            //#region Form2
            $scope.myData2 = [
                { Field: "UserIP", Value: $scope.items._source['clientip'] }
            ];
            var x = $scope.items._source;
            if (x.hasOwnProperty('geoip')) {
                //toastr.info($scope.items._source['geoip']);
                $scope.myData2.push({ Field: "Country_Name", Value: $scope.items._source.geoip['country_name'] });
                $scope.myData2.push({ Field: "City_Name", Value: $scope.items._source['geoip']['city_name'] });
                $scope.myData2.push({ Field: "Real_Region_Name", Value: $scope.items._source['geoip']['real_region_name'] });
                $scope.myData2.push({ Field: "Postal_code", Value: $scope.items._source['geoip']['postal_code'] });
                $scope.myData2.push({ Field: "Coordinates ", Value: $scope.items._source['geoip']['coordinates'] });
                $scope.myData2.push({ Field: "Timezone", Value: $scope.items._source['geoip']['timezone'] });

            }


            $scope.gridOptions2 = {
                columnDefs: [
      { field: 'Field', displayName: 'Field', width: 120 },
      { field: 'Value', displayName: 'Value', width: 300 }
                ],
                data: 'myData2',
                selectedItems: $scope.mySelections,
                // multiSelect: false,
                jqueryUITheme: true,
                enableColumnResize: true,
                afterSelectionChange: function () {
                    //var x= $scope.mySelections.pop();
                    //  toastr.info($scope.mySelections.pop());
                    angular.forEach($scope.mySelections, function (item) {
                        // toastr.info(item.Value);
                        $scope.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                    });
                }
            };

            //#endregion


            //#region Form3
            $scope.myData3 = [{ Field: "ClientIP", Value: $scope.items._source['clientip'] },
                   { Field: "HTTPmethod", Value: $scope.items._source['verb'] },
                   { Field: "Resquest", Value: $scope.items._source['request'] },
                   { Field: "Response", Value: $scope.items._source['response'] },
                   { Field: "APIresponse", Value: $scope.items._source['APIresponse'] },
                   { Field: "RuquestTime", Value: $scope.items._source['@timestamp'] },
                   { Field: "Referrer", Value: $scope.items._source['referrer'] },
                   { Field: "Action", Value: $scope.items._source['action'] },
                   { Field: "Agent", Value: $scope.items._source['agent'] }

            ];

          
        

            $scope.gridOptions3 = {
                columnDefs: [
                     { field: 'Field', displayName: 'Field', width: 120 },
                     { field: 'Value', displayName: 'Value', width: 420 }
                ],
                data: 'myData3',
                selectedItems: $scope.mySelections,
                multiSelect: false,
                enableColumnResize: true,
                jqueryUITheme: true,
                afterSelectionChange: function () {
                    //var x= $scope.mySelections.pop();
                    //  toastr.info($scope.mySelections.pop());
                    angular.forEach($scope.mySelections, function (item) {
                        // toastr.info(item.Value);
                        if (item["Field"] === "HTTPmethod")
                        { $scope.selected.item = "verb" + " : " + item["Value"]; }
                        else if (item["Field"] === "RuquestTime") {
                            $scope.selected.item = "@timestamp" + " : " + item["Value"];
                        } else {
                            $scope.selected.item = item["Field"].toLowerCase() + " : " + item["Value"];
                        }
                    });
                }
            };
            //#endregion



            $scope.ok = function () {
                // 


                //  $location.search('field', f);
                $location.search.text = $scope.selected.item;
                //toastr.info($location.search.text);
                $location.path('/els/');
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });
})();

