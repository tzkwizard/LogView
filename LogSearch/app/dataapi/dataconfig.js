﻿(function () {
    'use strict';

    var serviceId = 'dataconfig';
    angular.module('app').factory(serviceId, ['common', 'client', dataconfig]);

    function dataconfig(common, client) {

        var vm = this;
        vm.typesName = [];
        vm.findex = [];
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var service = {
            getIndexName: getIndexName,
            getTypeName: getTypeName,
            getFieldName: getFieldName,
            createContainer: createContainer,
            filterIndex: filterIndex,         
            prime:prime
    }
        return service;

        function prime() {
            filterIndex();
            log('Load Index');
            
        }
       
        function createContainer(aggName) {
            var main = document.getElementById('div2');
            var contain = document.createElement('div');
            contain.setAttribute('id', 'contain');
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

        function filterIndex() {         
            /*vm.findex = [];

            client.cluster.state({
                flatSettings: true

            }).then(function (resp) {
                vm.hit = resp.routing_table.indices;
                vm.j = 0;
                vm.temp = [];
                vm.tempindices = [];
                angular.forEach(vm.hit, function (name) {

                    vm.temp[vm.j] = name.shards;
                    angular.forEach(vm.temp[vm.j], function (shard) {
                        vm.tempindices[vm.j] = shard[0].index;

                    });
                    vm.j++;
                });
                vm.j = 0;
                for (vm.i = 0; vm.i < vm.tempindices.length; vm.i++) {
                    if (vm.tempindices[vm.i].substring(0, 8) === "logstash") {
                        vm.findex[vm.j] = vm.tempindices[vm.i];
                        vm.j++;
                    }

                }
            }, function (err) {
                log(err.message);
            });
            return vm.findex;*/
            vm.indicesName = [];

            client.cluster.state({
                flatSettings: true

            }).then(function (resp) {
                vm.hit = resp.routing_table.indices;
                vm.j = 0;
                vm.temp = [];
                vm.tempindices = [];
                angular.forEach(vm.hit, function (name) {

                    vm.temp[vm.j] = name.shards;
                    angular.forEach(vm.temp[vm.j], function (shard) {
                        vm.tempindices[vm.j] = shard[0].index;

                    });
                    vm.j++;
                });
                vm.j = 0;
                for (vm.i = 0; vm.i < vm.tempindices.length; vm.i++) {
                    if (vm.tempindices[vm.i].substring(0, 8) === "logstash") {
                        vm.indicesName[vm.j] = vm.tempindices[vm.i];
                        vm.j++;
                    }

                }
            }, function (err) {
                log(err.message);
            });
            return vm.indicesName;
        }


        function getIndexName() {
            vm.indicesName = [];
            
            client.cluster.state({
                flatSettings: true

            }).then(function (resp) {
                vm.hit = resp.routing_table.indices;
                vm.j = 0;
                vm.temp = [];
                vm.tempindices = [];
                angular.forEach(vm.hit, function (name) {

                    vm.temp[vm.j] = name.shards;
                    angular.forEach(vm.temp[vm.j], function (shard) {
                            vm.tempindices[vm.j] = shard[0].index;
                     
                    });
                    vm.j++;                   
                });
                vm.j = 0;
                for (vm.i = 0; vm.i < vm.tempindices.length; vm.i++) {
                    if (vm.tempindices[vm.i].substring(0, 1) !== ".") {
                        vm.indicesName[vm.j] = vm.tempindices[vm.i];
                        vm.j++;
                    }
                    
                }
            }, function (err) {
                log(err.message);
            });
            return vm.indicesName;
        }

        function getTypeName(index, pagecount) {
            if (index === "all" || index === "")
                return "";
            vm.typesName = [];
            client.search({
                index: index,
                size: pagecount,
                body: {
                    query: {
                        "match_all": {}
                    }
                }
            }).then(function (resp) {
                vm.map = resp.hits.hits;
                angular.forEach(vm.map, function (n) {
                    if (vm.typesName.indexOf(n._type) === -1) {
                        vm.typesName.push(n._type);
                    }
                });

            }, function (err) {
                log(err.message);
            });
            return vm.typesName;
        }

        function getFieldName(index, type) {
            if (type === "all" || type === "")
                //|| vm.typesName.indexOf(type) === -1
                return "";
            vm.fieldsName = [];
            client.indices.getFieldMapping({
                index: index,
                type: type,
                field: '*'
            }).then(function (resp) {
                //vm.map = resp.logs.mappings.logs;

                angular.forEach(resp, function (m) {
                    vm.map = m.mappings;
                    angular.forEach(vm.map, function (n) {
                        vm.j = 0;
                        angular.forEach(n, function (name) {
                            if (name.full_name.substring(0, 1) !== '_' && name.full_name !== 'constant_score.filter.exists.field') {
                                vm.fieldsName[vm.j] = name.full_name;
                                vm.j++;
                            }
                        }
                        );
                    });
                });
            }, function (err) {
                log(err.message);
            });
            return vm.fieldsName;
        }



      

    }
})();