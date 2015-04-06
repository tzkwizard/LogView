(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function ($timeout,bsDialog, $rootScope, $routeParams,
        $filter, $injector, $log, $scope, $location, $modal, common, client, datasearch, dataconfig, $cookieStore) {


        var vm = this;
        vm.title = "Elasticsearch";
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        $scope.predicate = '_source.timestamp';
        $scope.count = 0;
        //variable

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

        vm.showSplash = true;

        vm.Syntax = {
            title: 'Help',
            Description: "Terms Fields Escaping Special Characters"
        };


        //function
        vm.search = search;
        vm.mSearch = mSearch;
        vm.filtertemp = filtertemp;
        vm.init = init;
        vm.test = test;
        activate();
        vm.today = today;
        vm.pageChanged = pageChanged;
        vm.getCurrentPageData = getCurrentPageData;
        vm.getFieldName = getFieldName;
        vm.getIndexName = getIndexName;
        vm.getTypeName = getTypeName;
        vm.addaddFilter = addFilter;


        vm.tests = tests;

        function tests(x) {      

        }


        function test() {
              //  bsDialog.deleteDialog('Session');
              //  bsDialog.confirmationDialog('Session');

            /*   if (vm.ft === "" || vm.ft === undefined) {
                    log("1");
                    
                    vm.ft = new Date();
                    return;
                }
                if (vm.st === "" || vm.st === undefined) {
                    log("2");
                    return;
                }
                if (vm.ft < vm.st) {
                    log("3");
                    vm.st = "";
                    return;
                }
                
*/

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
                    //  .query(ejs.RangeQuery("ip").gte("19.18.200.201").lte("19.18.200.204"))
                    // .query(ejs.MatchAllQuery())
                    //.filter(ejs.BoolFilter().must(ejs.TermFilter("message", "dev")).mustNot(ejs.TermFilter("message", "java")))
                    //.filter(ejs.TermFilter("username","dev"))
                    //  .filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st))
                    //.query(ejs.BoolQuery().mustNot(ejs.QueryStringQuery('dev')))
                    .query(y)
                    .filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st))

            }).then(function(resp) {
                vm.hitSearch = resp.hits.hits;
                vm.total = resp.hits.total;
                vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                vm.getCurrentPageData(vm.hitSearch);
            }, function(err) {
                log(err.message);
            });

            /*  client.suggest({
                    index: 'logs',
                    body: {
                        mysuggester: {
                            text: vm.searchText,
                            term: {
                                field: 'message'
                            }
                        }
                    }
                }, function(resp) {
                    vm.hitSearch = resp;

                }, function (err) {
                        log(err.message);
                    });*/

            // var t1 = document.getElementById('jselect');
            // var t2 = document.getElementById('fselect');
            // var t3 = document.getElementById('input');

            // addFilter();         

            //  toastr.info(t1.value+t2.value+t3.value);

        }

//      result showing
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 5
        };

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function() {

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


//processorbar
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

       // vm.random();


//   popup

        vm.showModal = false;

        vm.popdata = {
            data: "",
            field: []
        };
        vm.items = ['item1', 'item2', 'item3'];

        vm.open = function(doc) {

            vm.popdata.data = doc;
            vm.popdata.field = vm.fieldsName;
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                //size: 'lg',
                resolve: {
                    items: function() {
                        return vm.popdata;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                vm.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

//   date pick
        vm.it = ["Last three months", "Last Month", "Last four weeks", "Last three weeks", "Last two weeks", "Last week"];
        vm.filterst = filterst;


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


        vm.ft = "";
        vm.st = "";

        today();

        function today() {
            //vm.maxDate = new Date();
            // vm.dt=$filter('date')(vm.tempd, "yyyy.MM.dd");
            vm.st = moment(new Date()).subtract(1, 'month');
            vm.ft = new Date();
            toggleMin();
        }

        /*vm.today = function () {
                vm.dt = new Date();
            
            };*/


        vm.clear = function() {
            vm.st = null;
        };

        // Disable weekend selection
        vm.disabled = function(date, mode) {
            //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };
        // vm.minDate = true;
        vm.toggleMin = toggleMin;

        function toggleMin() {
            vm.tmind = new Date();
            vm.tmind.setMonth(vm.tmind.getMonth() - 1);
            vm.minDate = vm.minDate ? null : vm.tmind;
        };


        vm.timeopen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.timeopened = true;
        };

        vm.ftimeopen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            vm.ftimeopened = true;
        };


        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy.MM.dd'];
        vm.format = vm.formats[4];


//  Page load         

         
        vm.refresh = function () {
            vm.searchText = "";
            search();
            log("refresh");
        }

        function getIndexName() {
            if ($cookieStore.get('index')!==undefined)
           { if ($rootScope.index.length !== $cookieStore.get('index').length && $rootScope.index.length > 1) {
                $cookieStore.remove('index');
            }}

            if ($cookieStore.get('index')===undefined||$cookieStore.get('index').length <= 1)
            {
               
                $cookieStore.put('index', $rootScope.index);
            }
            
            
           
            vm.indicesName = $cookieStore.get('index');
           // log(vm.indicesName.length);
            $timeout(getFieldName, 500);
           // getFieldName();
        }

        function getTypeName() {
            vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
        }

        function getFieldName() {
            if (vm.indicesName[0] !== "" && vm.indicesName[0] !== undefined) {
                vm.index = vm.indicesName[0];
            }
            if (vm.index !== "" && vm.index !== undefined) {
                vm.fieldsName = dataconfig.getFieldName(vm.index, $rootScope.logtype);
               // log(vm.fieldsName.length);
            }

        }


        function activate() {
            common.activateController([getIndexName()], controllerId)
                .then(function() {
                    $location.search();                 
                    if ($location.search.text !== "")
                    {
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

            datasearch.getSampledata(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.st, vm.ft).then(function(resp) {
                vm.hitSearch = resp.hits.hits;
                vm.total = resp.hits.total;
                vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                vm.getCurrentPageData(vm.hitSearch);
                vm.type = "";
                log('Loaded sample document');
            });
        }


//  Search and filter
        vm.fselect = "";
        vm.im = 0;
        vm.condition = "";

        function search() {

            if (vm.searchText == undefined || vm.searchText === "") {
                init();
                $timeout(random, 500);

            } else {
              
                datasearch.basicSearch(vm.indicesName, $rootScope.logtype, vm.pagecount, vm.field, vm.searchText, vm.filterAggName, vm.fi, vm.condition, vm.st, vm.ft)
            .then(function (resp) {
                vm.hitSearch = resp.hits.hits;
                vm.total = resp.hits.total;
                vm.tt = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                vm.getCurrentPageData(vm.hitSearch);
                $timeout(random, 500);
            }, function (err) {
                log(err.message);
            });
            }

                

            }

            function addFilter(i) {

                var para = document.createElement("p");
                var node = document.createTextNode("filter:" + vm.im);

                para.appendChild(node);

                var element = document.getElementById("filter");
                element.appendChild(para);

                //var main = document.getElementById('filter');
                var contain = document.createElement('div');
                contain.setAttribute('id', 'contain');
                element.appendChild(contain);



                var input = document.createElement('input');
                var iname = 'input';
                input.setAttribute("data-ng-model", "vm.fi");
                input.setAttribute('id', iname);
                contain.appendChild(input);



                var xx = document.getElementById(iname);
                var el = angular.element(xx);
                $scope = el.scope();
                $injector = el.injector();
                $injector.invoke(function ($compile) {
                    $compile(el)($scope);
                });

                /*
                              var $scope = angular.element(el).scope();
                                $scope.thing = newVal;
                                $scope.$apply(); //tell angular to check dirty bindings again
                                }*/




                var fselect = document.createElement('select');
                var sname = 'fselect';
                fselect.setAttribute('id', sname);
                fselect.setAttribute("data-ng-model", "vm.filterAggName");
                contain.appendChild(fselect);

                var xy = document.getElementById(sname);
                var eld = angular.element(xy);
                $scope = eld.scope();
                $injector = eld.injector();
                $injector.invoke(function ($compile) {
                    $compile(eld)($scope);
                });

                // fselect.setAttribute("data-ng-model", "vm.filterAggName");
                angular.forEach(vm.fieldsName, function (name) {
                    var opt = document.createElement('option');

                    opt.value = name;
                    opt.innerHTML = name;
                    fselect.appendChild(opt);
                });



                var jselect = document.createElement('select');
                var jname = 'jselect';
                jselect.setAttribute('id', jname);
                contain.appendChild(jselect);

                vm.j = ['MUST', 'MUST_NOT', 'SHOULD'];
                angular.forEach(vm.j, function (name) {
                    var opt = document.createElement('option');
                    opt.value = name;
                    opt.innerHTML = name;
                    jselect.appendChild(opt);
                });
                //jselect.setAttribute("data-ng-model", "vm.condition");

                /*   var el = angular.element("jselect");
                   $scope = el.scope();
                   $injector = el.injector();
                   $injector.invoke(function ($compile) {
                       $compile(el)($scope);
                   });*/
                vm.im++;

            }

         function filtertemp(searchText) {
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
     
            client.search({
                index: 'logsd',
                type: 'log',
                size: vm.pagecount,
                body: ejs.Request().
                     filter(ejs.NumericRangeFilter("response").gt(202).lt(205))
            }).then(function (resp) {
                vm.hitSearch = resp.hits.hits;
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
            /* client.search({
                 index: 'logs',
                 type: 'log',
                 body: ejs.Request()
                     .query(ejs.MultiMatchQuery(["username", "response", "message", "ip"], searchText))
                 //  .filter(ejs.TermFilter(vm.filterAggName, vm.fi))
             }).then(function (resp) {
                 vm.hitSearch = resp.hits.hits;
             }, function (err) {
                 log(err.message);
         });*/
             }


        

    });
})();






(function () {
    'use strict';

    var controllerId = 'ModalInstanceCtrl';

    angular.module('app')
        .controller(controllerId, function($scope, $modalInstance, $location, common, items) {

        $scope.title = "Detailed search result";
        $scope.items = items.data;
        $scope.field = items.field;

        $scope.selected = {
            item: ""
        };

        /* $scope.myData = [{ name: "", value: "" }];

            function fill(){
            angular.forEach($scope.items._source, function (n) {
                    
                $scope.myData.push({ name: "aotuo", value:n});

            });
            }
            fill();*/
        $scope.mySelections = [];
        $scope.myData = [];

        angular.forEach(Object.keys($scope.items._source), function(item) {
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
            afterSelectionChange: function() {
                //var x= $scope.mySelections.pop();
                //  toastr.info($scope.mySelections.pop());
                angular.forEach($scope.mySelections, function(item) {
                    // toastr.info(item.Value);
                    $scope.selected.item = item["Field"] + " : " + item["Value"];
                });
            }
        };

        /* var timezone = ($scope.items._source.geoip.timezone !== undefined) ? $scope.items._source.geoip.timezone : "";
            var location = ($scope.items._source.geoip.location !== undefined) ? $scope.items._source.geoip.location : "";
            var region = ($scope.items._source.geoip.region !== undefined) ? $scope.items._source.geoip.region : "";
            var country = ($scope.items._source.geoip.country !== undefined) ? $scope.items._source.geoip.country : "";
            var city = ($scope.items._source.geoip.city !== undefined) ? $scope.ite ms._source.geoip.city : "";*/
        $scope.myData2 = [
            { Field: "UserIP", Value: $scope.items._source['clientip'] }
        ];
        var x = $scope.items._source;
        if (x.hasOwnProperty('geoip')) {
            toastr.info($scope.items._source['geoip']);
         $scope.myData2.push({ Field: "Country", Value: $scope.items._source.geoip['country_name'] });       
        $scope.myData2.push({ Field: "City", Value: $scope.items._source['geoip']['city_name'] });
        $scope.myData2.push({ Field: "Region", Value: $scope.items._source['geoip']['real_region_name'] });
        $scope.myData2.push({ Field: "postal_code", Value: $scope.items._source['geoip']['postal_code'] });
        $scope.myData2.push({ Field: "Coordinate ", Value: $scope.items._source['geoip']['coordinates'] });
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
                        $scope.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };






            $scope.myData3 = [{ Field: "UserIP", Value: $scope.items._source['clientip']},
                   { Field: "HTTPmethod ", Value: $scope.items._source['verb'] },
                   { Field: "ResquestApi", Value: $scope.items._source['request'] },
                   { Field: "Response", Value: $scope.items._source['response'] },
                   { Field: "ApiResponse", Value: $scope.items._source['APIresponse'] },
                   { Field: "RuquestTime", Value: $scope.items._source['@timestamp'] },
                   { Field: "Referrer", Value: $scope.items._source['referrer'] },
                   { Field: "ActualAction", Value: $scope.items._source['action'] },
                   { Field: "Brsower", Value: $scope.items._source['agent'] }

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
                        $scope.selected.item = item["Field"] + " : " + item["Value"];
                    });
                }
            };






            


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



/*  function temp1() {
           gett();
           geti();

           function gett() {
               vm.j = 0;
               vm.x = 'logstash-';
               for (vm.i = 0; vm.i < 144; vm.i++) {
                   vm.y = new Date(2015, 2, 10 + vm.i);
                   vm.t[vm.j] = vm.x + vm.y.getFullYear() + "." + ('0' + vm.y.getMonth()).slice(-2) + "." + ('0' + vm.y.getDate()).slice(-2);
                   vm.j++;
               }
           }

           function geti() {
               vm.j = 0;
               vm.z = 0;
               vm.i = 0;

               for (vm.i = 0; vm.i < 144; vm.i++) {
                   client.indices.exists({
                       index: vm.t[vm.i]
                   }).then(function(resp) {
                       if (resp) {
                           vm.indexName[vm.j] = vm.t[vm.z];
                           vm.j++;
                           log(vm.z);
                       }
                       vm.z++;
                   }, function(err) {
                       log(err.message);
                   });

               }
           }
       }*/
