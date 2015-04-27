(function () {
    'use strict';

    var serviceId = 'dataconfig';
    angular.module('app').factory(serviceId, ['$q', '$timeout', '$rootScope', '$cookieStore', 'common', 'client', 'datasearch', dataconfig]);

    function dataconfig($q, $timeout, $rootScope, $cookieStore, common, client, datasearch) {

        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);

        //#region service
        var service = {
            getIndexName: getIndexName,
            getTypeName: getTypeName,
            getFieldName: getFieldName,
            createContainer: createContainer,
            addFilter: addFilter,
            removeFilter: removeFilter,
            initIndex: initIndex,
            prime: prime
        }
        return service;
        //#endregion

        //#region Test   
        function prime() {
            var index = initIndex();
            //$rootScope.index = dataconfig.initIndex();
            $rootScope.logtype = "logs";
            $rootScope.ip = [];

            var field;
            index.then(function (data) {
                $rootScope.index = data;
                log("Load Global Index");
                field = getFieldName($rootScope.index[0], $rootScope.logtype);
            }).then(function () {
                field.then(function (data2) {
                    $rootScope.logfield = data2;
                    log("Load Global Field");
                });
            });
        }
        //#endregion

        //#region Layout
        function createContainer(aggName) {
            var main = document.getElementById('contain');

            var contain = document.createElement('div');
            var containName = 'contain' + aggName;
            contain.setAttribute('id', containName);
            main.appendChild(contain);

            


            var diva = document.createElement('div');
            var dashName = 'dash' + aggName;
            diva.setAttribute('id', dashName);
            contain.appendChild(diva);

            var dash = document.getElementById(dashName);
            var tb = document.createElement('table');
            var tbname = 'table1';
            tb.setAttribute('id', tbname);
            dash.appendChild(tb);

            var table = document.getElementById(tbname);
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);



            //var dash = document.getElementById(dashName);
            var divb = document.createElement('div');
            var rangeName = 'range' + aggName;
            divb.setAttribute('id', rangeName);
            cell1.appendChild(divb);

            var divc = document.createElement('div');
            var barName = 'bar' + aggName;
            divc.setAttribute('id', barName);
            cell1.appendChild(divc);


            var divd = document.createElement('div');
            var tableName = 'table' + aggName;
            divd.setAttribute('id', tableName);
            cell2.appendChild(divd);
        }

        function addFilter(n, fieldsName) {
            var para = document.createElement("p");
            /*  var node = document.createTextNode("filter:" + n);

              para.appendChild(node);*/

            var element = document.getElementById("filter");
            element.appendChild(para);

            //var main = document.getElementById('filter');

            var contain = document.createElement('div');
            var cname = 'contain' + n;
            contain.setAttribute('id', cname);
            element.appendChild(contain);



            var input = document.createElement('input');
            var iname = 'input' + n;
            input.setAttribute("data-ng-model", "vm.fi" + n.toString());
            input.setAttribute('id', iname);
            contain.appendChild(input);



            var xx = document.getElementById(iname);
            /*var el = angular.element(xx);
            $scope = el.scope();
            $injector = el.injector();
            $injector.invoke(function ($compile) {
                $compile(el)($scope);
            });*/



            var fselect = document.createElement('select');
            var sname = 'fselect' + n;
            fselect.setAttribute('id', sname);
            contain.appendChild(fselect);

            angular.forEach(fieldsName, function (name) {
                var opt = document.createElement('option');
                opt.value = name;
                opt.innerHTML = name;
                fselect.appendChild(opt);
            });



            var jselect = document.createElement('select');
            var jname = 'jselect' + n;
            jselect.setAttribute('id', jname);
            contain.appendChild(jselect);

            var j = ['MUST', 'MUST_NOT', 'SHOULD'];
            angular.forEach(j, function (name) {
                var opt = document.createElement('option');
                opt.value = name;
                opt.innerHTML = name;
                jselect.appendChild(opt);
            });
        }

        function removeFilter(n) {
            var main = document.getElementById('filter');
            var cname = 'contain' + n;
            var contain = document.getElementById(cname);
            main.removeChild(contain);
        }
        //#endregion

        //#region Get Maping
        function initIndex() {
            var indicesName = [];

            var ipromise = client.cluster.state({
                flatSettings: true

            }).then(function (resp) {
                var hit = resp.routing_table.indices;
                var j = 0;
                var temp = [];
                var tempindices = [];
                angular.forEach(hit, function (name) {

                    temp[j] = name.shards;
                    angular.forEach(temp[j], function (shard) {
                        tempindices[j] = shard[0].index;

                    });
                    j++;
                });
                j = 0;
                for (var i = 0; i < tempindices.length; i++) {
                    if (tempindices[i].substring(0, 8) === "logstash") {
                        indicesName[j] = tempindices[i];
                        j++;
                    }

                }
            }, function (err) {
                log("get Logstash Index" + err.message);
            });
            //return indicesName;
            return ipromise.then(function () {
                return indicesName;
            });
        }

        function getIndexName() {
            var indicesName = [];

            client.cluster.state({
                flatSettings: true

            }).then(function (resp) {
                var hit = resp.routing_table.indices;
                var j = 0;
                var temp = [];
                var tempindices = [];
                angular.forEach(hit, function (name) {

                    temp[vm.j] = name.shards;
                    angular.forEach(vm.temp[vm.j], function (shard) {
                        vm.tempindices[vm.j] = shard[0].index;

                    });
                    vm.j++;
                });
                j = 0;
                for (var i = 0; i < tempindices.length; i++) {
                    if (tempindices[i].substring(0, 1) !== ".") {
                        indicesName[j] = tempindices[i];
                        j++;
                    }

                }
            }, function (err) {
                log("get Index Name" + err.message);
            });
            return indicesName;
        }

        function getTypeName(index, pagecount) {
            if (index === "all" || index === "")
                return "";
            var typesName = [];
            client.search({
                index: index,
                size: pagecount,
                body: {
                    query: {
                        "match_all": {}
                    }
                }
            }).then(function (resp) {
                var map = resp.hits.hits;
                angular.forEach(map, function (n) {
                    if (typesName.indexOf(n._type) === -1) {
                        typesName.push(n._type);
                    }
                });

            }, function (err) {
                log(err.message);
            });
            return typesName;
        }

        function getFieldName(index, type) {
            if (type === "all" || type === "")
                //|| vm.typesName.indexOf(type) === -1
                return "";
            var fieldsName = [];
            var fpromise = client.indices.getFieldMapping({
                index: index,
                type: type,
                field: '*'
            }).then(function (resp) {
                //vm.map = resp.logs.mappings.logs;

                angular.forEach(resp, function (m) {
                    var map = m.mappings;
                    angular.forEach(map, function (n) {
                        var j = 0;
                        angular.forEach(n, function (name) {
                            if (name.full_name.substring(0, 1) !== '_' && name.full_name !== 'constant_score.filter.exists.field') {
                                fieldsName[j] = name.full_name;
                                j++;
                            }
                        }
                        );
                    });
                });

            }, function (err) {
                log("get Field Name" + err.message);
            });


            return fpromise.then(function () {
                return fieldsName;
            });
            //return fieldsName;
        }
        //#endregion




    }
})();