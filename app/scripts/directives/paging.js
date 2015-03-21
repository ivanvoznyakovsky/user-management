'use strict';

angular.module('testApp')
  .controller('PagingDirectiveCtrl', PagingDirectiveCtrl)
  .directive('paging', pagingDirective);

function PagingDirectiveCtrl($scope) {
  var self = this;

  this.setTotalPages = function () {
    var totalPages = $scope.pageSize < 1 ? 1 : Math.ceil($scope.totalItems / $scope.pageSize);
    return Math.max(totalPages || 0, 1);
  };

  this.init = function () {
    $scope.totalPages = self.setTotalPages();
    $scope.page = $scope.page || 1;
  };

  $scope.selectPage = function (page) {
    if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
      $scope.page = page;
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

  $scope.$watch('totalItems', function () {
    $scope.totalPages = self.setTotalPages();
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
      page      : '='
    },
    controller: 'PagingDirectiveCtrl',
    replace   : true,
    template  : '<ul class=\"pagination\">\n' +
    '<li ng-hide=\"noPrevious()\"><a href ng-click=\"selectPage(page - 1)\">&laquo; Previous {{pageSize}} users</a></li>\n' +
    '<li class=\"disabled\"><span>{{getShowingText()}}</span></li>\n' +
    '<li ng-hide=\"noNext()\"><a href ng-click=\"selectPage(page + 1)\">Next {{pageSize}} users &raquo;</a></li>\n' +
    '</ul>',
    link      : function (scope, element, attrs, pagingCtrl) {
      pagingCtrl.init();
    }
  };
}
