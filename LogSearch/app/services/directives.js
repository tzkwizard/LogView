﻿(function() {
    'use strict';

    var app = angular.module('app');

   

    app.directive("addbuttonsbutton", function () {
        return {
            restrict: "E",
            template: "<button addbuttons>Click to add buttons</button>"
        }
    });

    //Directive for adding buttons on click that show an alert on click
    app.directive("addbuttons", function ($compile) {
        return function (scope, element, attrs) {
            element.bind("click", function () {
                scope.count++;
                
                angular.element(document.getElementById('space-for-buttons')).
                   append($compile( "<input id='tt'"+"type='text'" +"size='8'"+
                   "data-ng-model='vm.fi'"+
                   "placeholder='  Filter '" + "/>")(scope));
                angular.element(document.getElementById('space-for-buttons')).
                    append($compile("<select id='test2''" +"ng-model='vm.filterAggName''"+ "class='input-medium'" +"style='width: 100px'"+">"+
                "<option value={{doc}}"+"data-ng-repeat='doc in vm.fieldsName'"+">"+"{{doc}}"+"</option"+">"+
            "</select"+">")(scope));
                angular.element(document.getElementById('space-for-buttons')).
                  append($compile( "<select ng-model=' vm.condition'"+">"+
                "<option selected value='MUST'"+">"+"MUST"+"</option"+">"+
                "<option vaule='MUST_NOT'"+">"+"MUST_NOT"+"</option"+">"+
                "<option vaule='SHOULD'"+">"+"SHOULD"+"</option"+">"+
                "</select"+">")(scope));

                
            });
        };
    });

    //Directive for showing an alert on click
    app.directive("alert", function () {
        return function (scope, element, attrs) {
            element.bind("click", function () {
                console.log(attrs);
                alert("This is alert #" + attrs.alert);
            });
        };
    });





    var googleChart = googleChart || angular.module("google-chart", []);

    googleChart.directive("googleChart", function () {
        return {
            restrict: "A",
            link: function ($scope, $elem, $attr) {
                var dt = $scope[$attr.ngModel].dataTable;

                var options = {};
                if ($scope[$attr.ngModel].title)
                    options.title = $scope[$attr.ngModel].title;

                var googleChart = new google.visualization[$attr.googleChart]($elem[0]);
                googleChart.draw(dt, options)
            }
        }
    });


    app.directive('disableAnimation', function ($animate) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $attrs.$observe('disableAnimation', function (value) {
                    $animate.enabled(!value, $element);
                });
            }
        }
    });

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasepath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function(value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);


    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown(): element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function() {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });
})();