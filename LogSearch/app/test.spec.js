
/// <reference path="~/Scripts/_references.js" />
describe('layout.testcontroller', function () {
    var controller;

    beforeEach(function () {
        bard.appModule('app.layout');
        bard.inject(this, '$controller');
        controller = $controller('test');
    });
    it('shell', function () {
        bard.log('we got the goods');
        expect(controller.password).toEqual('123');    
    });

    it('shell2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});
describe('layout.shellcontroller', function () {
    var controller;
    var redditService;
   
    beforeEach(function () {
        var x = bard.appModule('common');
        var y = bard.appModule('ngRoute');
        
        bard.appModule('app.layout');
        bard.inject(this, '$controller',x);
      
        controller = $controller('shell');
    });
    it('shell', function () {
        expect(controller.password).toEqual('');
    });
    it('shell2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});


describe('dash.elscontroller', function () {
    var controller;
    beforeEach(function () {
        var x = bard.appModule('common');
        var y = bard.appModule('ngRoute');
        var z = bard.appModule('component.service');
        //angular.mock.module('component.service','com');
        bard.appModule('com');
        bard.inject(this, '$controller', 'chartservice');

        controller = $controller('dashboard');
    });
    it('shell', function () {
        expect(controller.password).toEqual('');
    });
    it('shell2', function () {
        controller.grade();
        expect(controller.strength).toEqual('weak');
    });
});