'use strict';

describe('Directives', function () {
  var $rootScope, $scope, $isolatedScope, $compile, $controller;

  beforeEach(module('testApp'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$controller_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
  }));

  describe('paging', function () {
    var elem;

    beforeEach(function () {
      $scope = $rootScope.$new();
      $scope.items = [
        {
          "id"       : 0,
          "firstName": "Jocelyn",
          "lastName" : "Wells",
          "email"    : "jocelynwells@slofast.com"
        },
        {
          "id"       : 1,
          "firstName": "Lola",
          "lastName" : "Ellison",
          "email"    : "lolaellison@slofast.com"
        },
        {
          "id"       : 2,
          "firstName": "Stephenson",
          "lastName" : "Bryant",
          "email"    : "stephensonbryant@slofast.com"
        },
        {
          "id"       : 3,
          "firstName": "Jessie",
          "lastName" : "Conner",
          "email"    : "jessieconner@slofast.com"
        }
      ];
      $scope.pageSize = 1;
      elem = $compile('<paging total-items="items.length" page-size="pageSize" page="1"></paging>')($scope);
      $isolatedScope = elem.isolateScope();
      $scope.$digest();
    });

    it('should have correct total pages count', function () {
      // initial value
      var totalPages = Math.ceil($scope.items.length / $scope.pageSize);
      expect($isolatedScope.totalPages).toBe(totalPages);

      // double amount of items in parent scope
      $scope.items = $scope.items.concat($scope.items);
      $scope.$digest();
      expect($isolatedScope.totalPages).toBe(totalPages * 2);
    });

    it('should have no previous page when on first page', function () {
      $isolatedScope.selectPage(1);
      expect($isolatedScope.noPrevious()).toBe(true);
    });

    it('should have no next page when on last page', function () {
      $isolatedScope.selectPage($isolatedScope.totalPages);
      expect($isolatedScope.noNext()).toBe(true);
    });

    it('should have both next and prev page', function () {
      $isolatedScope.selectPage(Math.ceil($isolatedScope.totalPages / 2));
      $isolatedScope.$digest();
      expect($isolatedScope.noNext()).toBe(false);
      expect($isolatedScope.noPrevious()).toBe(false);
    });
  })
});
