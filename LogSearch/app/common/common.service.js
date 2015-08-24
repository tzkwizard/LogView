(function () {
    'use strict';

    var serviceId = 'commonService';
    angular.module('common').factory(serviceId, ['$modal', '$rootScope', 'config', 'datasearch', 'localStorageService', commonService]);

    function commonService($modal, $rootScope, config, datasearch, localStorageService) {

        //#region Service
        var service = {
            appStart: appStart,
            prime: prime,
            checkIdent: checkIdent,
            loadMap: loadMap,
            logout: logout,
            changeTimeSpan: changeTimeSpan,
            arrayUnique: arrayUnique,
            aggFieldFilter: aggFieldFilter,
            getMapping: getMapping
        }
        return service;
        //#endregion

        //#region Startup
        function appStart() {
            $rootScope.spinner = true;
            $rootScope.school = "TCU";
            $rootScope.st = moment(new Date()).subtract(3, 'month').toDate();
            $rootScope.ft = new Date();
            $rootScope.token = localStorageService.get('EsToken');
            if (localStorageService.get('SiderBarFacet') === undefined || localStorageService.get('SiderBarFacet') === null) {
                $rootScope.facet = [config.facet[0], config.facet[1], config.facet[2], config.facet[3]];
            } else {
                $rootScope.facet = localStorageService.get('SiderBarFacet');
            }
        }

        //#endregion


        //#region RouteChange 
        //Load index and field
        function prime() {
            $rootScope.logtype = "logs";
            $rootScope.map = getMapping();
            if (localStorageService.get('EsToken') !== null) return;
            checkIdent();
        }

        function checkIndexCookie() {
            if (localStorageService.get('index') !== null && $rootScope.index !== undefined) {
                if ($rootScope.index.length !== localStorageService.get('index').length) {
                    toastr.info("Index Changed");
                    localStorageService.remove('index');
                }
            }
        }

        function checkFieldCookie() {
            if (localStorageService.get('logfield') !== null && $rootScope.logfield !== undefined) {
                if ($rootScope.logfield.length !== localStorageService.get('logfield').length) {
                    toastr.info("Field Changed");
                    localStorageService.remove('logfield');
                }
            }
        }

        function loadMap() {
            checkIndexCookie();
            checkFieldCookie();
            var indicesName = localStorageService.get('index');
            if (localStorageService.get('index') === null) {
                if ($rootScope.index !== undefined) {
                    localStorageService.set('index', $rootScope.index);
                    indicesName = localStorageService.get('index');
                } else {
                    return $rootScope.map;
                }
            }
            var fieldName = localStorageService.get('logfield');
            if (localStorageService.get('logfield') === null) {
                if ($rootScope.logfield !== undefined) {
                    localStorageService.set('logfield', $rootScope.logfield);
                    fieldName = localStorageService.get('logfield');
                } else {
                    return $rootScope.map;
                }
            }
            var map = {
                indicesName: indicesName,
                fieldsName: fieldName
            }
            return map;
        }
        //#endregion


        //#region Get Maping 
        //get logstash index from cluster
        function getMapping() {
            return datasearch.getMap().then(function (resp) {
                $rootScope.index = resp.data.Index;
                var fieldsName = resp.data.Field;
                var field = fieldsName.filter(function (name) {
                    return (name.substring(0, 1) >= 'A' && name.substring(0, 1) <= 'Z') || (name.substring(0, 1) >= 'a' && name.substring(0, 1) <= 'z');
                });
                $rootScope.logfield = field;
            });
        }
        //#endregion


        //#region Login service
        function checkIdent(username, password) {
            if (username === "" || password === "") {
                toastr.info("Username or Password is blank !!");
                return openLoginPage();
            } else {
                return login(username, password).then(function (resp) {
                    saveId(username, password, resp.data);
                    toastr.info('elasticsearch cluster is connected');
                }, function (e) {
                    toastr.info(e.data.Message);
                    openLoginPage();
                });
            }
        }

        function logout() {
            localStorageService.remove("username");
            localStorageService.remove("password");
            localStorageService.remove("key");
            localStorageService.remove("SiderBarFacet");
            localStorageService.remove("EsToken");
        }


        function saveId(username, password, token) {
            if (username !== undefined || password !== undefined) {
                var z = "tzk";
                var x = sjcl.encrypt(z, username);
                var y = sjcl.encrypt(z, password);
                localStorageService.set('username', x);
                localStorageService.set('password', y);
                localStorageService.set('key', z);
            }
            localStorageService.set('EsToken', token);
            $rootScope.token = token;
        }

        function login(u, p) {
            var x = localStorageService.get('username');
            var y = localStorageService.get('password');
            var z = localStorageService.get('key');
            if (x === null || y === null || z === null) {
                return datasearch.checkID(u, p);
            } else {
                var username = sjcl.decrypt(z, x);
                var password = sjcl.decrypt(z, y);
                return datasearch.checkID(username, password);
            }
        }

        function openLoginPage() {
            var modalInstance = $modal.open({
                templateUrl: 'app/component/login/loginModal.html',
                controller: 'loginModal as login',
                size: 'sm',
                keyboard: false,
                backdrop: 'static',
                resolve: {
                    items: function () {
                    }
                }
            });
        }
        //#endregion


        //#region Common service
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
            var filtered = fields.filter(function (x) {
                return x.substring(x.length - 3, x.length) === "raw" && x !== "timestamp.raw" && x !== "tags.raw";
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