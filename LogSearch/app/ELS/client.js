(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function ($cookieStore, $rootScope, esFactory) {
            var username = $cookieStore.get('username');
            var password = $cookieStore.get('password');
            var h = "http://" + username + ":" + password + "@localhost:9200";
           // var vm = "http://" + username + ":" + password + "@23.101.177.252:9200";

            return esFactory({
               // host:vm,
                host: h,

                /* host: [
                     {
                         host: 'localhost',
                         auth: 'aotuo:123456'
                     }
                 ],*/
                log: 'trace'

            });

            // 23.101.184.36
        });
})();