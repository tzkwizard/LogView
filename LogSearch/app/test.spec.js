/// <reference path="~/Scripts/_references.js" />
describe('layout.test', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.layout');
        bard.inject(this, '$controller');
        controller = $controller('test');
    });
    it('test1', function () {
        expect(controller.password).toEqual('123');
    });

    it('test2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});

describe('layout.shell', function () {
    var controller;
    var redditService;

    beforeEach(function () {
        var x = bard.appModule('common');
        var y = bard.appModule('ngRoute');

        bard.appModule('app.layout');
        bard.inject(this, '$controller', x);

        controller = $controller('shell');
    });
    it('test', function () {
        expect(controller.password).toEqual('');
    });
    it('test2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});

describe('els.controller', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app');
        bard.inject(this, '$controller', 'common', '$q', 'elsService', '$rootScope', 'dataconfig');
        bard.mockService(dataconfig, {
            _default: $q.when([])

        });

        /*  bard.mockService(common, {
             _default: $q.when([])
  
         });*/
        var $scope = $rootScope.$new();
        controller = $controller('els', { $scope: $scope });
    });
    it('test', function () {

        expect(controller.password).toEqual('123');
    });
    it('test2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});

describe('dash.controller', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app');
        bard.inject(this, '$controller', 'common', '$q', 'chartService', '$rootScope', 'dataconfig');
        /* bard.mockService(chartservice, {
             _default: $q.when([])
 
         });*/
        bard.mockService(dataconfig, {
            _default: $q.when([])

        });

        /*  bard.mockService(common, {
             _default: $q.when([])
  
         });*/
        var $scope = $rootScope.$new();
        controller = $controller('dashboard', { $scope: $scope });
    });
    it('test', function () {

        expect(controller.password).toEqual('123');
    });
    it('test2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});

describe('agg.controller', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app');
        bard.inject(this, '$controller', 'common', '$q', 'aggService', '$rootScope', 'dataconfig');
        bard.mockService(dataconfig, {
            _default: $q.when([])
        });

        /*  bard.mockService(common, {
             _default: $q.when([])
  
         });*/
        var $scope = $rootScope.$new();
        controller = $controller('aggs', { $scope: $scope });
    });
    it('test', function () {

        expect(controller.password).toEqual('123');
    });
    it('test2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});


angular.module('myModule', [])
    .factory('myService', function (myDependency) {
        return {
            useDependency: function () {
                return myDependency.getSomething();

            },
            test: function () {
                return "haha";
            }
        };
    })
    .controller("dash", function (myDependency, myService) {
        var vm = this;
        vm.test = myDependency.getSomething();

        vm.activate = function () {
            vm.avengers = myService.getAvengers();
            vm.test2 = myService.useDependency(123);
            myService.test(123);
        }
        vm.try = function () {
            return myService.useDependency();
        }
    });
describe('Service: myService', function () {

    var mockDependency;
    beforeEach(function () {
        mockDependency = {
            getSomething: function () {
                return 'mockReturnValue';
            }
        };
        module(function ($provide) {
            $provide.value('myDependency', mockDependency);
        });

    });
    var controller;
    var mockUser = [{}];
    beforeEach(function () {

        //module('myModule');
        bard.appModule('myModule');
        bard.inject(this, '$controller', '$q', 'myService');
        bard.mockService(myService, {
            getAvengers: function () {
                return "m22";
            },

            useDependency: $q.when("haha"),
            _default: $q.when([])

        });
        spyOn(myService, 'test');
        //spyOn(myService, '_default');
        controller = $controller('dash');
    }
  );


    it('mock service without bard', inject(function (myDependency) {
        expect(myDependency.getSomething()).toBe('mockReturnValue');
    }));

    it('mock service without bard 2', (function () {
        expect(controller.test).toEqual('mockReturnValue');
    }));

    it('mock service by bard', (function () {
        controller.activate();
        expect(controller.avengers).toEqual("m22");
    }));

    it('mock service by bard 2', (function () {
        controller.activate();
        expect(controller.test2.$$state.status).toEqual(0);
        expect(controller.test2).toEqual(jasmine.any(Object));
        expect(myService.test).toHaveBeenCalled();
        expect(myService.test).toHaveBeenCalledWith(123);
    }));

});



angular
  .module('MyApp', [])
  .controller('MyController', MyController);

// The controller code
function MyController($scope, $http) {
    var authToken;

    $http.get('/auth.py').success(function (data, status, headers) {
        authToken = headers('A-Token');
        $scope.user = data;
    });

    $scope.saveMessage = function (message) {
        var headers = { 'Authorization': authToken };
        $scope.status = 'Saving...';

        $http.post('/add-msg.py', message, { headers: headers }).success(function (response) {
            $scope.status = '';
        }).error(function () {
            $scope.status = 'ERROR!';
        });
    };
}

// testing controller
describe('Httptest', function () {
    var $httpBackend, $rootScope, createController, authRequestHandler;

    // Set up the module
    beforeEach(module('MyApp'));

    beforeEach(inject(function ($injector) {
        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
        // backend definition common for all tests
        authRequestHandler = $httpBackend.when('GET', '/auth.py')
                               .respond({ userId: 'userX' }, { 'A-Token': 'xxx' });

        // Get hold of a scope (i.e. the root scope)
        $rootScope = $injector.get('$rootScope');
        // The $controller service is used to create instances of controllers
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('MyController', { '$scope': $rootScope });
        };
    }));


    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('should fetch authentication token', function () {
        $httpBackend.expectGET('/auth.py');
        var controller = createController();
        $httpBackend.flush();
    });


    it('should fail authentication', function () {

        // Notice how you can change the response even after it was set
        authRequestHandler.respond(401, '');

        $httpBackend.expectGET('/auth.py');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.status).toBe('Failed...');
    });


    it('should send msg to server', function () {
        var controller = createController();
        $httpBackend.flush();

        // now you don’t care about the authentication, but
        // the controller will still send the request and
        // $httpBackend will respond without you having to
        // specify the expectation and response for this request

        $httpBackend.expectPOST('/add-msg.py', 'message content').respond(201, '');
        $rootScope.saveMessage('message content');
        expect($rootScope.status).toBe('Saving...');
        $httpBackend.flush();
        expect($rootScope.status).toBe('');
    });


    it('should send auth header', function () {
        var controller = createController();
        $httpBackend.flush();

        $httpBackend.expectPOST('/add-msg.py', undefined, function (headers) {
            // check if the header was sent, if it wasn't the expectation won't
            // match the request and the test will fail
            return headers['Authorization'] == 'xxx';
        }).respond(201, '');

        $rootScope.saveMessage('whatever');
        $httpBackend.flush();
    });
});

