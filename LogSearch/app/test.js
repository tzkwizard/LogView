/// <reference path="~/Scripts/angularjs/angular.js"  />
/// <reference path="~/Scripts/angularjs/angular-mocks.js" />
/// <reference path="~/Scripts/angularjs/angular-route.js" />
/// <reference path="~/app/app.js" />
/// <reference path="~/app/layout/topnav.js" />
/*describe('jasmine works', function () {
    it('sanity check', function () {
        expect(0).toBe(0);
    });

    it("judge", function () {
        expect(true).toBe(true);
    });

});*/
describe('test', function () {
    beforeEach(function() {
        module("app");
    });

    var $controller;
    var $scope;
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
       
        var controller = $controller('topnav', { $scope: $scope });
    }));

    describe('$scope.grade', function () {
        it('sets the strength to "strong" if the password length is >8 chars', function () {            
            $scope.password = 'longerthaneightchars';
            $scope.grade();
            expect($scope.strength).toEqual('strong');
        });
    });
});