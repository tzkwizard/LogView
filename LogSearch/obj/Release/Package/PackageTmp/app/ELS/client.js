(function () {
    'use strict';

    angular
        .module('app')
        .service('client', function(esFactory) {
            return esFactory({
              //  host: 'http://172.16.0.6:9200',
                host: 'http://23.102.191.108:9200', 
           // host: 'localhost:9200',
            log: 'trace'
        });
       // 23.101.184.36
    });
})();