'use strict';

angular.module('testApp')
  .constant('pagingConfig', {
    itemsPerPage: 10
  })
  .controller('PagingCtrl', function ($scope, $attrs) {
    var self = this,
      ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtr;

    if ($attrs.itemsPerPage) {
      $scope.itemsPerPage = parseInt($attrs.itemsPerPage, 10);
    } else {
      $scope.itemsPerPage = 10;
    }

    this.render = function () {
      $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
    };

    this.setTotalPages = function () {
      var totalPages = $scope.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / $scope.itemsPerPage);
      return Math.max(totalPages || 0, 1);
    };

    this.init = function (modelCtrl, config) {
      ngModelCtrl = modelCtrl;

      ngModelCtrl.$render = function () {
        self.render();
      };

      if ($attrs.itemsPerPage) {
        $scope.itemsPerPage = parseInt($attrs.itemsPerPage, 10);
        $scope.totalPages = self.setTotalPages();
      } else {
        $scope.itemsPerPage = config.itemsPerPage;
      }

      $scope.page = $scope.page || 1;
    };

    $scope.selectPage = function (page) {
      if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
        ngModelCtrl.$setViewValue(page);
        ngModelCtrl.$render();
      }
    };

    $scope.noPrevious = function () {
      return $scope.page === 1;
    };

    $scope.noNext = function () {
      return $scope.page === $scope.totalPages;
    };

    $scope.getShowingText = function () {
      var from = ($scope.page - 1) * $scope.itemsPerPage + 1,
        to = $scope.page * $scope.itemsPerPage;
      return 'Showing ' + from + '-' + to + ' of ' + $scope.totalItems + ' users';
    };

    $scope.$watch('totalItems', function () {
      $scope.totalPages = self.setTotalPages();
    });

    $scope.$watch('totalPages', function (value) {
      if ($scope.page > value) {
        $scope.selectPage(value);
      } else {
        ngModelCtrl.$render();
      }
    });
  })
  .directive('paging', function (pagingConfig) {
    return {
      restrict  : 'E',
      scope     : {
        totalItems: '='
      },
      controller: 'PagingCtrl',
      require   : ['paging', '?ngModel'],
      replace   : true,
      template  : '<ul class=\"pagination\">\n' +
      '<li ng-hide=\"noPrevious()\"><a href ng-click=\"selectPage(page - 1)\">&laquo; Previous {{itemsPerPage}} users</a></li>\n' +
      '<li class=\"disabled\"><span>{{getShowingText()}}</span></li>\n' +
      '<li ng-hide=\"noNext()\"><a href ng-click=\"selectPage(page + 1)\">Next {{itemsPerPage}} users &raquo;</a></li>\n' +
      '</ul>',
      link      : function (scope, element, attrs, ctrls) {
        var pagingCtrl = ctrls[0],
          modelCtrl = ctrls[1];

        pagingCtrl.init(modelCtrl, pagingConfig);
      }
    };
  });
