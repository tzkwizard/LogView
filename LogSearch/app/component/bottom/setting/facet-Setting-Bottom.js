(function () {
    'use strict';

    var controllerId = 'facetSettingBottom';

    angular.module('app')
      .controller(controllerId, function ($rootScope, $scope, $mdBottomSheet, config, $cookieStore) {


        
          //#region variable and function
          $scope.selectedFacet = [];
          $scope.selectedItem = null;
          $scope.searchText = null;
          $scope.oldfacet = $rootScope.facet;
         


          $scope.copy = copy;
          $scope.querySearch = querySearch;
          $scope.loadFacet = loadFacet;
          $scope.update = update;
          $scope.refresh = refresh;
          $scope.listItemClick = function ($index) {
              var clickedItem = $scope.items[$index];
              $mdBottomSheet.hide(clickedItem);
          };
          //#endregion
          

          //#region facet search
          function querySearch(query) {
              var results = query ? loadFacet().filter(createFilterFor(query)) : [];
              return results;
          }
          
          function createFilterFor(query) {
              var lowercaseQuery = angular.lowercase(query);
              return function filterFn(f) {
                  return (f._lowername.indexOf(lowercaseQuery) === 0) ||
                      (f._lowertype.indexOf(lowercaseQuery) === 0);
              };
          }

          function loadFacet() {
              var facet = [];
              angular.forEach(config.facet, function (t) {
                  facet.push(t);
              });
              return facet.map(function (f) {
                  f._lowername = f.title.toLowerCase();
                  f._lowertype = f.field.toLowerCase();
                  return f;
              });
          }
          //#endregion


          //#region button
          function update() {
              var x = [];
              angular.forEach($scope.selectedFacet, function (t) {
                  x.push(t);
              });
              $scope.oldfacet = x;
              //$scope.roFruitNames = angular.copy($scope.oldfacet);           
          }

          function copy() {
              $scope.selectedFacet = angular.copy($scope.oldfacet);
          }

          function refresh() {
              $cookieStore.put('SiderBarFacet', $scope.oldfacet);
              window.location.reload();
          }
          //#endregion


      });
})();

