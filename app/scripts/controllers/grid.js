(function () {
  'use strict';

  angular
    .module('testApp')
    .controller('GridCtrl', GridCtrl);

  function GridCtrl($scope, $window, appState, usersService) {
    var originalUserData;

    // bind local filter state
    $scope.filter = appState.filter;

    // track errors when manipulating users
    $scope.error = usersService.error;


    // set controller's defaults
    $scope.users = [];
    $scope.newUser = {};

    $scope.pagination = {
      pageSize: 10
    };

    // configure grid
    $scope.sortReverse = false;
    $scope.sortColumn = '-created';

    $scope.sortBy = function (name) {
      if (name === $scope.sortColumn) {
        $scope.sortReverse = !$scope.sortReverse;
      } else {
        $scope.sortReverse = false;
      }
      $scope.sortColumn = name;
    };

    $scope.getOffset = function () {
      var pagination = $scope.pagination,
        offset = (pagination.page - 1) * pagination.pageSize;
      return offset < 0 ? 0 : offset;
    };

    $scope.restoreUser = function (user) {
      if (angular.isDefined(user.id)) {
        angular.extend(user, originalUserData);
        $scope.userFrm.$setPristine();
      }
    };

    $scope.cancelEditUser = function (user, doNotRestore) {
      !doNotRestore && $scope.restoreUser(user);

      delete user.edit;
      originalUserData = null;
      $scope.userFrm.$setPristine();
    };

    $scope.showNewUserFrm = function () {
      $scope.newUserFrmVisible = true;
    };

    $scope.hideNewUserFrm = function (userCreated) {
      $scope.newUserFrmVisible = false;
      $scope.newUser = {};
      $scope.userFrm.$setPristine();

      if (userCreated) {
        // sort ASC by created date
        // to show new user on top of the grid
        $scope.sortColumn = 'created';
        $scope.sortReverse = true;
      }
    };

    $scope.createUser = function () {
      usersService.create($scope.newUser).then(function (success) {
        if (success) {
          $scope.users.push($scope.newUser);
          $scope.hideNewUserFrm(success);
        }
      });
    };

    $scope.editUser = function (user) {
      originalUserData = angular.copy(user);

      // delete `id` property to avoid ngRepeat complaining
      // on duplicates when restoring original user
      delete originalUserData.id;

      user.edit = true;
    };

    $scope.updateUser = function (user) {
      if ($window.confirm('Are you sure?')) {
        usersService.update(user).then(function (success) {
          success ? $scope.cancelEditUser(user, true) : $scope.restoreUser(user);
        });
      }
    };

    $scope.deleteUser = function (user) {
      if ($window.confirm('Are you sure?')) {
        usersService.delete(user.id).then(function (success) {
          if (success) {
            var idx = $scope.users.indexOf(user);
            idx >= 0 && $scope.users.splice(idx, 1);
          }
        });
      }
    };

    // keep application internal state up to date
    $scope.$watchGroup(['userFrm.$dirty', 'newUser.id'], function(newVal) {
      appState.hasUnsavedData = newVal[0] || newVal[1];
    });

    // got to first page when start filtering
    // return to page before filtering when filter value is empty
    var pageBeforeFilter;
    $scope.$watch('filter.$', function (filterValue) {
      var disable = $scope.pagination.disabled = !!filterValue,
        page = pageBeforeFilter || 1;

      if (disable) {
        pageBeforeFilter = $scope.pagination.page;
        page = 1;
      }

      $scope.pagination.page = page;
    });

    // get users list
    usersService.get().then(function (users) {
      $scope.users = users;
    });
  }
})();
