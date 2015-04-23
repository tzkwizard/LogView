(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function ($cookieStore, $rootScope, esFactory) {
            var username = $cookieStore.get('username');
            var y = $cookieStore.get('password');
            var password;
            try {
                password = sjcl.decrypt("tzk", y);
            } catch (e) {
                password = "";
            }

            var h = "http://" + username + ":" + password + "@localhost:9200";
           // var vm = "http://" + username + ":" + password + "@23.101.177.252:9200";

            return esFactory({
               // host:vm,
                host: h,   
                log: 'trace'

            });

            // 23.101.184.36
        });
})();