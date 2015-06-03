(function () {
    'use strict';

    var controllerId = 'facetSettingBottom';

    angular.module('app')
      .controller(controllerId, function (common, config, localStorageService) {

          var vm = this;
          //#region variable and function
          vm.selectedFacet = [];
          vm.selectedItem = null;
          vm.searchText = null;
          vm.oldfacet = common.$rootScope.facet;



          vm.copy = copy;
          vm.querySearch = querySearch;
          vm.update = update;
          vm.refresh = refresh;
          vm.listItemClick = function ($index) {
              var clickedItem = vm.items[$index];
              common.$mdBottomSheet.hide(clickedItem);
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
              angular.forEach(vm.selectedFacet, function (t) {
                  x.push(t);
              });
              vm.oldfacet = x;
              //vm.roFruitNames = angular.copy(vm.oldfacet);           
          }

          function copy() {
              vm.selectedFacet = angular.copy(vm.oldfacet);
          }

          function refresh() {
              //$cookieStore.put('SiderBarFacet', vm.oldfacet);
              localStorageService.set('SiderBarFacet', vm.oldfacet);
              window.location.reload();
          }
          //#endregion


      });
})();

