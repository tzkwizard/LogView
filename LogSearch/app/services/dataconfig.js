﻿(function () {
    'use strict';

    var serviceId = 'dataconfig';
    angular.module('app').factory(serviceId, ['$modal', '$rootScope', 'config', 'datasearch', 'localStorageService', dataconfig]);

    function dataconfig($modal, $rootScope, config, datasearch, localStorageService) {

        //#region Service
        var service = {
            appStart: appStart,
            prime: prime,
            login: login,
            openLoginPage: openLoginPage,
            checkIdent: checkIdent,
            loadIndex: loadIndex,
            loadField: loadField,
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
            $rootScope.school = "TCU";
            $rootScope.st = moment(new Date()).subtract(3, 'month').toDate();
            $rootScope.ft = new Date();
            //$rootScope.token = $cookieStore.get('EsToken');

            $rootScope.token = localStorageService.get('EsToken');
            /* if ($cookieStore.get('SiderBarFacet') === undefined || $cookieStore.get('SiderBarFacet').length < 1) {
                 $rootScope.facet = [config.facet[0], config.facet[1], config.facet[2], config.facet[3]];
             } else {
                 $rootScope.facet = $cookieStore.get('SiderBarFacet');
             }*/
            if (localStorageService.get('SiderBarFacet') === undefined || localStorageService.get('SiderBarFacet') === null) {
                $rootScope.facet = [config.facet[0], config.facet[1], config.facet[2], config.facet[3]];
            } else {
                $rootScope.facet = localStorageService.get('SiderBarFacet');
            }


        }

        //#endregion



        //#region RouteChange service
        //Load index and field
        function prime() {
            $rootScope.logtype = "logs";
            $rootScope.ip = [];
            $rootScope.map = getMapping();
            if ($rootScope.logged) return;
            checkIdent();
        }

        function checkIndexCookie() {
            /* if ($cookieStore.get('index') !== undefined && $rootScope.index !== undefined) {
                 if ($rootScope.index.length !== $cookieStore.get('index').length) {
                     toastr.info("Index Changed");
                     $cookieStore.remove('index');
                 }
             }*/
            if (localStorageService.get('index') !== null && $rootScope.index !== undefined) {
                if ($rootScope.index.length !== localStorageService.get('index').length) {
                    toastr.info("Index Changed");
                    localStorageService.remove('index');
                }
            }
        }

        function checkFieldCookie() {
            /* if ($cookieStore.get('logfield') !== undefined && $rootScope.logfield !== undefined) {
                 if ($rootScope.logfield.length !== $cookieStore.get('logfield').length) {
                     toastr.info("Field Changed");
                     $cookieStore.remove('logfield');
                 }
             }*/
            if (localStorageService.get('logfield') !== null && $rootScope.logfield !== undefined) {
                if ($rootScope.logfield.length !== localStorageService.get('logfield').length) {
                    toastr.info("Field Changed");
                    localStorageService.remove('logfield');
                }
            }
        }

        function loadIndex() {
            checkIndexCookie();
            /*var indicesName = $cookieStore.get('index');
            if ($cookieStore.get('index') === undefined) {
                if ($rootScope.index !== undefined) {
                    $cookieStore.put('index', $rootScope.index);
                    indicesName = $cookieStore.get('index');
                } else {
                    return $rootScope.map;
                }
            }*/
            var indicesName = localStorageService.get('index');
            if (localStorageService.get('index') === null) {
                if ($rootScope.index !== undefined) {
                    localStorageService.set('index', $rootScope.index);
                    indicesName = localStorageService.get('index');
                } else {
                    return $rootScope.map;
                }
            }
            return indicesName;
        }

        function loadField() {
            checkFieldCookie();
            /*var fieldName = $cookieStore.get('logfield');
            if ($cookieStore.get('logfield') === undefined) {
                if ($rootScope.logfield !== undefined) {
                    $cookieStore.put('logfield', $rootScope.logfield);
                    fieldName = $cookieStore.get('logfield');
                } else {
                    return $rootScope.map;
                }
            }*/
            var fieldName = localStorageService.get('logfield');
            if (localStorageService.get('logfield') === null) {
                if ($rootScope.logfield !== undefined) {
                    localStorageService.set('logfield', $rootScope.logfield);
                    fieldName = localStorageService.get('logfield');
                } else {
                    return $rootScope.map;
                }
            }
            return fieldName;
        }
        //#endregion


        //#region Get Maping service
        //get logstash index from cluster
        function getMapping() {
            return datasearch.getMap().then(function (resp) {
                $rootScope.index = resp.data.Index;
                var fieldsName = resp.data.Field;
                var field = [];
                angular.forEach(fieldsName, function (name) {
                    if ((name.substring(0, 1) >= 'A' && name.substring(0, 1) <= 'Z') || (name.substring(0, 1) >= 'a' && name.substring(0, 1) <= 'z')) {
                        field.push(name);
                    }
                });
                $rootScope.logfield = field;
            });
        }
        //#endregion


        //#region Login service
        function login() {
            /* var x = $cookieStore.get('username');
             var y = $cookieStore.get('password');
             var z = $cookieStore.get('key');*/

            var x = localStorageService.get('username');
            var y = localStorageService.get('password');
            var z = localStorageService.get('key');
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

        function checkIdent() {
            return login().then(function (resp) {
                //$cookieStore.put('EsToken', resp.data);
                localStorageService.set('EsToken', resp.data);
                $rootScope.logged = true;
                toastr.info('elasticsearch cluster is connected');
            }, function (e) {
                toastr.info(e.data.Message);
                openLoginPage();
            });
        }
        function logout() {
            $rootScope.logged = false;
            /*$cookieStore.remove("useranme");
            $cookieStore.remove("password");
            $cookieStore.remove("key");
            $cookieStore.remove("SiderBarFacet");*/
            localStorageService.remove("useranme");
            localStorageService.remove("password");
            localStorageService.remove("key");
            localStorageService.remove("SiderBarFacet");
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