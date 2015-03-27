(function () {
  'use strict';

  angular
    .module('testApp')
    .filter('startFrom', function () {
    return function (input, start) {
      var result;

      if (angular.isArray(input) && angular.isNumber(start)) {
        start = +start;
        result = input.slice(start);
      } else {
        result = [];
      }

      return result;
    };
  });
})();
