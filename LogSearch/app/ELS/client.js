(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function ($cookieStore, $rootScope, esFactory) {
            var username = $cookieStore.get('username');
            var password = $cookieStore.get('password');
            var h = "http://" + username + ":" + password + "@localhost:9200";


            return esFactory({
                //  host: 'http://172.16.0.6:9200',
                // host: 'http://23.102.191.108:9200', 
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