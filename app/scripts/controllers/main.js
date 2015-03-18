'use strict';

angular.module('testApp').controller('MainCtrl', function ($scope, $window, UsersService) {
  var self = this;

  $scope.users = [];
  $scope.showNewUser = false;
  $scope.newUser = {};

  $scope.page = 1;
  $scope.itemsPerPage = 10;

  $scope.sortReverse = false;
  $scope.sortColumn = '-created';

  $scope.sortBy = function (name) {
    if (name === $scope.sortColumn) {
      $scope.sortReverse = !$scope.sortReverse;
    } else {
      $scope.sortReverse = false;
    }
    $scope.sortColumn = name;
    return false;
  };

  $scope.getOffset = function () {
    var offset = ($scope.page - 1) * $scope.itemsPerPage;
    return offset < 0 ? 0 : offset;
  };

  this.getUserIndexById = function (id) {
    var idx = false,
        users = $scope.users,
        i = users.length;

    for (; i--;) {
      if (users[i].id === id) {
        idx = i;
        break;
      }
    }

    return idx;
  };

  $scope.cancelEditUser = function () {
    $scope.editUserId = null;
    $scope.editUserModel = null;
    $scope.userFrm.$setPristine();
    self.originalUserData = null;
    self.editUserIndex = -1;
  };

  $scope.cancelCreateUser = function () {
    $scope.showNewUser = false;

    delete $scope.newUser;
    $scope.newUser = {};

    $scope.userFrm.$setPristine();
    $scope.sortColumn = 'created';
    $scope.sortReverse = true;
  };

  $scope.createUser = function () {
    $scope.showNewUser = true;
    $scope.newUser.id = 'user-' + Math.round(Math.random() * 100);
  };

  $scope.saveUser = function () {
    if (UsersService.isEmailUnique($scope.newUser.email)) {
      var date = (new Date()).getTime(),
          user = angular.copy($scope.newUser);
      user.created = date;
      user.modified = date;
      $scope.users.push(user);
      UsersService.add(user);
      $scope.cancelCreateUser();
    } else {
      $window.alert('Email "' + $scope.newUser.email + '" is already used.');
      return false;
    }
  };

  $scope.editUser = function () {
    $scope.editUserId = this.user.id;
    self.originalUserData = angular.copy(this.user);
    $scope.editUserModel = angular.copy(this.user);
    return false;
  };

  $scope.updateUser = function () {
    if ($scope.userFrm.$dirty && $scope.userFrm.$valid) {
      if ($window.confirm('Are you sure?')) {
        $scope.editUserModel.modified = (new Date()).getTime();

        var userIndex = self.getUserIndexById($scope.editUserModel.id);

        if (userIndex) {
          $scope.users[userIndex] = $scope.editUserModel;
          UsersService.update($scope.editUserModel);
        } else {
          $scope.error = 'User not found in set';
        }

        $scope.cancelEditUser();
      }
    } else {
      return false;
    }
  };

  $scope.restoreEditUser = function () {
    $scope.editUserModel = angular.copy(self.originalUserData);
    $scope.userFrm.$setPristine();
  };

  $scope.deleteUser = function () {
    if ($window.confirm('Are you sure?')) {
      var idx = self.getUserIndexById(this.user.id);
      if (idx) {
        $scope.users.splice(idx, 1);
        UsersService.delete(this.user);
      }
    }
  };

  $scope.$watch('service.error', function () {
    $scope.error = UsersService.error;
  });

  window.onbeforeunload = function () {
    if ($scope.userFrm.$dirty) {
      return 'There are unsaved changes left. Are you sure you want to leave?';
    }
  };

  // get users list
  $scope.getUsers = function() {
    UsersService.get().then(function (users) {
      $scope.users = users;
    });
  };

  $scope.getUsers();
});
