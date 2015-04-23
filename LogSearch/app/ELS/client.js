(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function ($cookieStore, $rootScope, esFactory) {
            var x = $cookieStore.get('username');
            var y = $cookieStore.get('password');
            var username;
            var password;
            try {
                username = sjcl.decrypt("tzk", x);
                password = sjcl.decrypt("tzk", y);
            } catch (e) {
                password = "";
                username = "";
            }

            var local = "http://" + username + ":" + password + "@localhost:9200";
           // var vm = "http://" + username + ":" + password + "@23.101.177.252:9200";

            return esFactory({
               // host:vm,
                host: local,   
                log: 'trace'

            });

            // 23.101.184.36
        });
})();