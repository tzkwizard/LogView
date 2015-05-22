(function () {
    'use strict';

    var serviceId = 'dataconfig';
    angular.module('app').factory(serviceId, ['$modal', '$rootScope', '$cookieStore', 'datasearch', dataconfig]);

    function dataconfig($modal, $rootScope, $cookieStore, datasearch) {

        //#region Service
        var service = {
            checkIndexCookie: checkIndexCookie,
            checkFieldCookie: checkFieldCookie,
            initIndex: initIndex,
            getFieldName: getFieldName,           
            prime: prime,
            login: login,
            openLoginPage: openLoginPage,
            checkIdent: checkIdent,
            loadIndex: loadIndex,
            loadField: loadField,
            changeTimeSpan: changeTimeSpan,
            arrayUnique: arrayUnique,
            aggFieldFilter: aggFieldFilter
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
            return datasearch.getMap().then(function (resp) {
                return resp.data.Index;
            });
        }

        //get field from cluster
        function getFieldName() {
            return datasearch.getMap().then(function (resp) {
                var fieldsName = resp.data.Field;
                var field = [];
                angular.forEach(fieldsName, function (name) {
                    if ((name.substring(0, 1) >= 'A' && name.substring(0, 1) <= 'Z') || (name.substring(0, 1) >= 'a' && name.substring(0, 1) <= 'z')) {
                        field.push(name);
                    }
                });
                return field;
            }).then(function (data) {
                return data;
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
            return datasearch.checkID(username, password);
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
        }

        function aggFieldFilter(fields) {
            var filtered = [];
            angular.forEach(fields, function (x) {
                if (x.substring(x.length - 3, x.length) === "raw" && x !== "timestamp.raw" && x !== "tags.raw") {
                    filtered.push(x);
                }
            });
            return filtered;
        }

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
    }


})();