(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function ($cookieStore, $rootScope, esFactory) {
            var x = $cookieStore.get('username');
            var y = $cookieStore.get('password');
            var z = $cookieStore.get('key');
            var username;
            var password;
            try {
                username = sjcl.decrypt(z, x);
                password = sjcl.decrypt(z, y);
            } catch (e) {
                password = "";
                username = "";
            }


            var localhost = "localhost"+":9200";
            var remote ="23.101.177.252" + ":9200";

            var local = "http://" + username + ":" + password + "@" + localhost;
            // var azurecluster = "http://" + username + ":" + password + "@23.101.177.252:9200";

            return esFactory({
                // host:azurecluster,
                host: local,
                log: 'trace'

            });
        });
})();