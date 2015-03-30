(function () {
  'use strict';

  angular.module('testApp')
    .controller('PagingDirectiveCtrl', PagingDirectiveCtrl)
    .directive('paging', pagingDirective);

  function PagingDirectiveCtrl($scope) {
    $scope.selectPage = function (page) {
      if (!$scope.disabled) {
        if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
          $scope.page = page;
        }
      }
    };

    $scope.noPrevious = function () {
      return $scope.page === 1;
    };

    $scope.noNext = function () {
      return $scope.page === $scope.totalPages;
    };

    $scope.getShowingText = function () {
      var from = ($scope.page - 1) * $scope.pageSize + 1,
        to = $scope.page * $scope.pageSize;
      return 'Showing ' + from + '-' + to + ' of ' + $scope.totalItems + ' users';
    };

    $scope.$watch('totalItems', function (totalItems) {
      var totalPages = $scope.pageSize < 1 ? 1 : Math.ceil(totalItems / $scope.pageSize);
      $scope.totalPages = Math.max(totalPages || 0, 1);
    });

    $scope.$watch('totalPages', function (value) {
      if ($scope.page > value) {
        $scope.selectPage(value);
      }
    });
  }

  function pagingDirective() {
    return {
      restrict  : 'E',
      scope     : {
        totalItems: '=',
        pageSize  : '=',
        page      : '=',
        disabled  : '='
      },
      controller: 'PagingDirectiveCtrl',
      replace   : true,
      template  : '<ul class="pagination">\n' +
      '<li ng-class="{disabled: disabled}" ng-hide="noPrevious()"><a href ng-click="selectPage(page - 1)">&laquo; Previous {{pageSize}} users</a></li>\n' +
      '<li class="disabled"><span>{{getShowingText()}}</span></li>\n' +
      '<li ng-class="{disabled: disabled}" ng-hide="noNext()"><a href ng-click="selectPage(page + 1)">Next {{pageSize}} users &raquo;</a></li>\n' +
      '</ul>'
    };
  }
})();
