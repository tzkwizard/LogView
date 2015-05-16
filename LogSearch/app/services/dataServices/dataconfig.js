(function () {
    'use strict';

    var serviceId = 'dataconfig';
    angular.module('app').factory(serviceId, ['$modal', '$http', '$rootScope', '$cookieStore', 'common', 'client', 'config', dataconfig]);

    function dataconfig($modal, $http, $rootScope, $cookieStore, common, client, config) {

        var vm = this;

        //#region Service
        var service = {
            checkIndexCookie: checkIndexCookie,
            checkFieldCookie: checkFieldCookie,
            getIndexName: getIndexName,
            getTypeName: getTypeName,
            getFieldName: getFieldName,
            createContainer: createContainer,
            addFilter: addFilter,
            removeFilter: removeFilter,
            initIndex: initIndex,
            autoFill: autoFill,
            prime: prime,
            login: login,
            openLoginPage: openLoginPage,
            checkIdent: checkIdent,
            getLocation: getLocation,
            transferLocation: transferLocation,
            loadIndex: loadIndex,
            loadField: loadField,
            fillSearchText: fillSearchText,
            changeTimeSpan: changeTimeSpan,
            arrayUnique: arrayUnique
        }
        return service;
        //#endregion


        //#region Startup service
        //Load index and field
        function prime() {
            var index = initIndex();
            //$rootScope.index = initIndex();
            $rootScope.logtype = "logs";
            $rootScope.ip = [];

            var field;
            index.then(function (indexData) {
                $rootScope.index = indexData;
                field = getFieldName();
            }, function (e) {
                field = getFieldName();
                toastr.info("index " + e.Message);
            })
                .then(function () {
                    field.then(function (fieldData) {
                        $rootScope.logfield = fieldData;
                    });
                }, function (e) {
                    toastr.info("field " + e.Message);
                });
            if ($rootScope.logged) return;
            checkIdent();
        }
        // get auto fill data
        function autoFill(text) {
            var info = {
                SearchText: text,
                Start: $rootScope.st,
                End: $rootScope.ft
            }
            var remote = config.remoteApiUrl + "api/ElasticMapping/AutoFill";
            var local = config.localApiUrl + "api/ElasticMapping/AutoFill";
            var ii = angular.toJson(info);

            var r = {
                method: 'POST',
                url: local,
                data: ii,
                params: {
                    token: $rootScope.token
                }
            }

            return $http(r)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  toastr.info("auto-fill " + e.Message);
              });
        }

        function checkIndexCookie() {
            if ($cookieStore.get('index') !== undefined && $rootScope.index !== undefined) {
                if ($rootScope.index.length !== $cookieStore.get('index').length) {
                    toastr.info("Index Changed");
                    $cookieStore.remove('index');
                }
            }
        }

        function checkFieldCookie() {
            if ($cookieStore.get('logfield') !== undefined && $rootScope.logfield !== undefined) {
                if ($rootScope.logfield.length !== $cookieStore.get('logfield').length) {
                    toastr.info("Field Changed");
                    $cookieStore.remove('logfield');
                }
            }
        }

        function loadIndex() {
            checkIndexCookie();
            var indicesName = $cookieStore.get('index');
            if ($cookieStore.get('index') === undefined) {
                if ($rootScope.index !== undefined) {
                    $cookieStore.put('index', $rootScope.index);
                    indicesName = $cookieStore.get('index');
                } else {
                    indicesName = initIndex();
                }
            }
            return indicesName;
        }

        function loadField() {
            checkFieldCookie();
            var fieldName = $cookieStore.get('logfield');
            if ($cookieStore.get('logfield') === undefined) {
                if ($rootScope.logfield !== undefined) {
                    $cookieStore.put('logfield', $rootScope.logfield);
                    fieldName = $cookieStore.get('logfield');
                } else {
                    fieldName = getFieldName();
                }
            }
            return fieldName;
        }
        //#endregion


        //#region Get Maping service
        //get logstash index from cluster
        function initIndex() {
            var indicesName = [];

            var remote = config.remoteApiUrl + "api/ElasticMapping/LogstashMap";
            var local = config.localApiUrl + "api/ElasticMapping/LogstashMap";
            var r = {
                method: 'GET',
                url: local,
                params: {
                    token: $rootScope.token
                }
            }
            var ipromise = $http(r)
              .success(function (resp) {
                  indicesName = resp.Index;
              }).error(function (e) {
                  // toastr.info(e);
              });
            return ipromise.then(function () {
                return indicesName;
            });
        }

        //get index from cluster
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
                toastr.info("get Index Name" + err.message);
            });
            return indicesName;
        }

        //get type from cluster
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
                toastr.info(err.message);
            });
            return typesName;
        }

        //get field from cluster
        function getFieldName() {
            var fieldsName = [];
            var remote = config.remoteApiUrl + "api/ElasticMapping/LogstashMap";
            var local = config.localApiUrl + "api/ElasticMapping/LogstashMap";
            var r = {
                method: 'GET',
                url: local,
                params: {
                    token: $rootScope.token
                }
            }
            var ipromise = $http(r)
              .success(function (resp) {
                  fieldsName = resp.Field;
                  angular.forEach(fieldsName, function (name) {
                      if (name.substring(0, 1) === '_') {
                          var index = fieldsName.indexOf(name);
                          fieldsName.splice(index, 1);
                      }
                  });
              }).error(function (e) {
                  //toastr.info(e);
              });
            return ipromise.then(function () {
                return fieldsName;
            });
        }
        //#endregion


        //#region Login service
        function login() {
            var x = $cookieStore.get('username');
            var y = $cookieStore.get('password');
            var z = $cookieStore.get('key');
            var username;
            var password;
            try {
                username = sjcl.decrypt(z, x);
                password = sjcl.decrypt(z, y);
                if (username === "" || password === "") {
                    password = "1";
                    username = "1";
                }
            } catch (e) {
                password = "1";
                username = "1";
            }

            var remote = config.remoteApiUrl + "api/ElasticMapping/Login/" + username + "/" + password;
            var local = config.localApiUrl + "api/ElasticMapping/Login/" + username + "/" + password;

            return $http.get(local)
              .success(function (resp) {
                  return resp;
              }).error(function (e) {
                  return e;
              });
        }

        function openLoginPage() {
            var modalInstance = $modal.open({
                templateUrl: 'app/component/login/loginModal.html',
                controller: 'loginModal',
                size: 'sm',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    items: function () {
                        return "";
                    }
                }
            });
        }

        function checkIdent() {
            return login().then(function (resp) {
                $cookieStore.put('EsToken', resp.data);
                $rootScope.logged = true;
                toastr.info('elasticsearch cluster is connected');
            }, function (e) {
                toastr.info(e.data.Message);
                openLoginPage();
            });
        }
        //#endregion


        //#region Location service
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
        }

        function transferLocation(add) {
            return common.$http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: add,
                    sensor: false
                }
            });
        }
        //#endregion


        //#region els service
        function fillSearchText(n) {
            var searchText = "";
            for (var i = 1; i < n; i++) {
                var s1 = document.getElementById('jselect' + i.toString());
                var s2 = document.getElementById('fselect' + i.toString());
                var s3 = document.getElementById('input' + i.toString());
                if (s1.value === "MUST") {
                    if (s3.value !== "") {
                        if (i === 1) {
                            searchText += s2.value + " : \"" + s3.value + "\"^2";
                        } else {
                            searchText += " AND " + s2.value + " : \"" + s3.value + "\"^2";
                        }
                    }
                }
                else if (s1.value === "MUST_NOT") {
                    if (s3.value !== "") {
                        if (i === 1) {
                            searchText += " NOT " + s2.value + " : \"" + s3.value + "\"";
                        } else {
                            searchText += " NOT " + s2.value + " : \"" + s3.value + "\"";
                        }
                    }
                } else {
                    if (s3.value !== "") {
                        if (i === 1) {
                            searchText += s2.value + " : \"" + s3.value + "\"";
                        } else {
                            searchText += " AND " + s2.value + " : \"" + s3.value + "\"";
                        }
                    }
                }

            }
            return searchText;
        }

        //add filter button
        function addFilter(n, fieldsName) {
            var para = document.createElement("p");
            /*  var node = document.createTextNode("filter:" + n);
              para.appendChild(node);*/

            var element = document.getElementById("filter");
            element.appendChild(para);

            var contain = document.createElement('div');
            var cname = 'contain' + n;
            contain.setAttribute('id', cname);
            element.appendChild(contain);

            var input = document.createElement('input');
            var iname = 'input' + n;
            input.setAttribute("data-ng-model", "vm.fi" + n.toString());
            input.setAttribute('id', iname);
            contain.appendChild(input);

            /*var xx = document.getElementById(iname);
            var el = angular.element(xx);
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

        //delete filter button
        function removeFilter(n) {
            var main = document.getElementById('filter');
            var cname = 'contain' + n;
            var contain = document.getElementById(cname);
            main.removeChild(contain);
        }
        //#endregion


        //#region agg service
        //create container for chart
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
        //#endregion


        //#region Time history service
        function changeTimeSpan(span) {
            var st;
            switch (span) {
                case "Last year":
                    st = moment(new Date()).subtract(1, 'year').toDate();
                    break;
                case "Last 6 months":
                    st = moment(new Date()).subtract(6, 'month').toDate();
                    break;
                case "Last 3 months":
                    st = moment(new Date()).subtract(3, 'month').toDate();
                    break;
                case "Last Month":
                    st = moment(new Date()).subtract(1, 'month').toDate();
                    break;
                case "Last 4 weeks":
                    st = moment(new Date()).subtract(4, 'week').toDate();
                    break;
                case "Last 3 weeks":
                    st = moment(new Date()).subtract(3, 'week').toDate();
                    break;
                case "Last 2 weeks":
                    st = moment(new Date()).subtract(2, 'week').toDate();
                    break;
                case "Last week":
                    st = moment(new Date()).subtract(1, 'week').toDate();
                    break;
                case "Last 5 days":
                    st = moment(new Date()).subtract(5, 'days').toDate();
                    break;
                case "Last 3 days":
                    st = moment(new Date()).subtract(3, 'days').toDate();
                    break;
                case "Last 2 days":
                    st = moment(new Date()).subtract(2, 'days').toDate();
                    break;
                case "Last day":
                    st = moment(new Date()).subtract(1, 'day').toDate();
                    break;
                case "Last 12 hours":
                    st = moment(new Date()).subtract(12, 'hour').toDate();
                    break;
                case "Last 6 hours":
                    st = moment(new Date()).subtract(6, 'hour').toDate();
                    break;
                case "Last hour":
                    st = moment(new Date()).subtract(1, 'hour').toDate();
                    break;
                default:
                    break;
            }
            return st;
        }
        //#endregion

        //#region regular service
        function arrayUnique(array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }
            return a;
        };
        //#endregion
    }
})();