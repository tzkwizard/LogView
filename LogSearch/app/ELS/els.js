(function () {
    'use strict';

    var controllerId = 'els';

    angular.module('app')
        .controller(controllerId, function ($rootScope,$routeParams, $filter, $injector, $log, $scope, $location, $modal, common, client, datasearch, dataconfig) {


            var vm = this;
            vm.title = "Elasticsearch";
            //variable
            $scope.count = 0;
            vm.fi = "";
            var getLogFn = common.logger.getLogFn;
            var log = getLogFn(controllerId);
            vm.searchText = $routeParams.search||'';
            vm.hitSearch = "";
            vm.acount = 4;
            vm.hits = "2";
            vm.total = 0;
            vm.mystyle = { 'color': 'blue' };
            vm.field = "";
            vm.index = $routeParams.index || '';
            vm.type = '';
            vm.filterAggName = "";
            vm.pagecount = 1000;         
            vm.total = "";
            vm.fieldsName = [];
            vm.typesName = [];
            vm.indicesName =  [];
            vm.t = [];
            



            vm.paging = {
                currentPage: 1,
                maxPagesToShow: 5,
                pageSize: 25
            };
        vm.showSplash = true;
            Object.defineProperty(vm.paging, 'pageCount', {
                get: function() {
                    return Math.floor(vm.total / vm.paging.pageSize) + 1;
                }
            });
            vm.fselect = "";


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
            vm.im = 0;






           
            $scope.predicate = '_source.response';





            function test() {




                if (vm.ft === "" || vm.ft === undefined) {
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
                      //.query(ejs.MatchAllQuery())
                    //.filter(ejs.BoolFilter().must(ejs.TermFilter("message", "dev")).mustNot(ejs.TermFilter("message", "java")))
                     //.filter(ejs.TermFilter("username","dev"))
                      .filter(ejs.RangeFilter("@timestamp").lte(vm.ft).gte(vm.st))
                    // .query(ejs.BoolQuery().mustNot(ejs.QueryStringQuery('dev')))
/*               
                     .query(ejs.DisMaxQuery()
                        .queries(ejs.TermQuery('username', 'dev'))
                        .queries(ejs.TermQuery('message', 'java'))
                        )
                    body: ejs.Request()
                        .query(ejs.TermQuery("message",""))
                        .aggregation(ejs.TermsAggregation("agg").field("ip"))
                        */
                }).then(function (resp) {
                    vm.hitSearch = resp.hits.hits;
                    vm.total = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                    vm.getCurrentPageData(vm.hitSearch);
                }, function (err) {
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
                log("1");
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
            input.setAttribute("data-ng-model","vm.fi");
            input.setAttribute('id', iname);
            contain.appendChild(input);

         

            var xx = document.getElementById(iname);
            var el = angular.element(xx);
            $scope = el.scope();
            $injector = el.injector();
                $injector.invoke(function($compile) {
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
                angular.forEach(vm.fieldsName, function(name) {
                    var opt = document.createElement('option');
                   
                    opt.value = name;
                    opt.innerHTML = name;
                    fselect.appendChild(opt);
                });
                
            

            var jselect = document.createElement('select');
            var jname = 'jselect';
            jselect.setAttribute('id', jname);
            contain.appendChild(jselect);

                vm.j = ['MUST','MUST_NOT','SHOULD'];
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





           //processorbar
           vm.showWarning ="";
           vm.dynamic = "";
           vm.ptype = "";
           
           vm.random = function () {
               var value = Math.floor((Math.random() * 100) + 1);
               var ptype;

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
           vm.random();


            //popup

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
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                   // size: size,
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

            //date

            vm.ft = "";
            vm.st = "";
            function today() {
                vm.tempd = new Date();
                vm.dt=$filter('date')(vm.tempd, "yyyy.MM.dd");
            }

            /*vm.today = function () {
                vm.dt = new Date();
            
            };*/
           vm.today();

            vm.clear = function () {
                vm.st = null;
            };

            // Disable weekend selection
            vm.disabled = function (date, mode) {
                //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };
            vm.minDate = true;
            vm.toggleMin = function () {
                vm.minDate = vm.minDate ? null : new Date();
            };
            vm.toggleMin();

            vm.timeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                vm.timeopened = true;
            };

            vm.ftimeopen = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                vm.ftimeopened = true;
            };


            vm.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate','yyyy.MM.dd'];
            vm.format = vm.formats[4];



            function getCurrentPageData(res) {
                vm.res = [];
                vm.j = 0;
                vm.pagenumber = vm.paging.pageSize * vm.paging.currentPage;
                if (vm.pagenumber > vm.total)
                    vm.pagenumber = vm.total;
                for (vm.i = (vm.paging.currentPage - 1) * vm.paging.pageSize; vm.i < vm.pagenumber; vm.i++) {
                    vm.res[vm.j] = res[vm.i];
                    vm.j++;
                }
            }

            function pageChanged() {
                vm.getCurrentPageData(vm.hitSearch);
            }


           

            function getIndexName() {
                vm.indicesName = dataconfig.getIndexName();
                //  vm.indicesName = $rootScope.index;
            }

            function getTypeName() {
                vm.typesName = dataconfig.getTypeName(vm.index, vm.pagecount);
            }   

            function getFieldName() {
                vm.fieldsName = dataconfig.getFieldName(vm.index, vm.type);

            }
           

            function activate() {
                common.activateController([getIndexName()], controllerId)
                    .then(function () {
                        $location.search();
                       log($location.search().field);
                    if ($location.search().field === "" || $location.search().field === undefined) {
                        client.search({
                                index: $routeParams.index,
                                // type: $location.search().log,
                                size: 1000,
                                body: ejs.Request()
                                    // .query(ejs.TermQuery($location.search().field, vm.searchText))
                                    .query(ejs.QueryStringQuery(vm.searchText))
                            }).
                            then(function(resp) {
                                vm.hitSearch = resp.hits.hits;
                                vm.total = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                                vm.getCurrentPageData(vm.hitSearch);
                                vm.type = "";
                            });

                    } else {
                        client.search({
                            index: $routeParams.index,
                            //type: 'logs',
                            size: 1000,
                            body: ejs.Request()
                            .query(ejs.TermQuery($location.search().field, vm.searchText))
                            //.query(ejs.TermQuery("logs.clientip.raw", "63.158.0.150"))
                        }).
                           then(function (resp) {
                               vm.hitSearch = resp.hits.hits;
                               vm.total = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                               vm.getCurrentPageData(vm.hitSearch);
                               vm.type = "";
                           });
                    }





                 //   $location.search().field = "";

                        //init();
                        vm.showSplash = false;
                        log('Activated ELS search View');
                    

                    });
            }
         


            function init() {
                if (vm.index === "")
                  {  vm.initdex = vm.indicesName;}
                else {
                    vm.initdex = vm.index;
                }
                datasearch.getSampledata(vm.initdex,vm.type, vm.pagecount).then(function (resp) {
                    vm.hitSearch = resp.hits.hits;
                    vm.total = resp.hits.total < vm.pagecount?resp.hits.total:vm.pagecount;  
                    vm.getCurrentPageData(vm.hitSearch);
                    vm.type = "";
                    log('Loaded sample document');
                });
            }


        


            function search(searchText) {
                
                if (vm.type === "" || vm.type === undefined || vm.type === "all") {
                    if (searchText == undefined || searchText === "") {
                        log("input text");
                        init();
                        return;
                    }
                    else
                    {
                        datasearch.stringSearch(vm, type, pagecount,searchText).then(function (resp) {
                            vm.hitSearch = resp.hits.hits;
                            vm.total = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                            vm.getCurrentPageData(vm.hitSearch);
                        }, function (err) {
                            log(err.message);
                        });
                    }
                }


            
                datasearch.basicSearch(vm.index, vm.type, vm.pagecount, vm.field, searchText, vm.filterAggName, vm.fi, vm.condition)
            .then(function (resp) {
                 vm.hitSearch = resp.hits.hits;
                 vm.total = resp.hits.total < vm.pagecount ? resp.hits.total : vm.pagecount;
                 vm.getCurrentPageData(vm.hitSearch);
             }, function (err) {
                 log(err.message);
             });
               
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

            client.count({
                index: 'azure',
                type: 'activitylog',
                body: {
                    query: {
                        // "match_all": {}
                        match: {
                            "time": searchText
                        }
                    }
                }
            }
            ).then(function (resp2) {                
                vm.acount = resp2.count;
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
        .controller(controllerId, function ($scope, $modalInstance, $location, common, items) {

            $scope.title = "Detailed search result";
            $scope.items = items.data;
            $scope.field = items.field;

            $scope.selected = {
                item: ""
            };

            $scope.ok = function () {
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
