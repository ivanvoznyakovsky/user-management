(function () {
  'use strict';

  angular
    .module('testApp')
    .controller('SearchFormCtrl', SearchFormCtrl);

  function SearchFormCtrl($scope, appState) {
    $scope.filter = appState.filter;
  }
})();
