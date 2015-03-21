'use strict';

angular.module('testApp')
  .controller('MainCtrl', MainCtrl);

function MainCtrl($scope, $window, UsersService) {
  var self = this;

  $scope.users = [];
  $scope.newUser = {};

  $scope.pagination = {
    pageSize: 10
  };

  $scope.sortReverse = false;
  $scope.sortColumn = '-created';

  $scope.error = UsersService.error;

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

  this.getUserIndex = function (user) {
    return $scope.users.indexOf(user);
  };

  $scope.cancelEditUser = function (doNotRestore) {
    !doNotRestore && $scope.restoreUser.call(this);

    delete this.user.edit;
    self.originalUserData = null;
    $scope.userFrm.$setPristine();
  };

  $scope.hideNewUserFrm = function (userCreated) {
    delete $scope.newUser;
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
    $scope.newUser.id = $scope.users.slice(-1)[0].id + 1;
  };

  $scope.saveUser = function () {
    var date = (new Date()).getTime();
    $scope.newUser.created = date;
    $scope.newUser.modified = date;
    $scope.users.push($scope.newUser);

    UsersService.add($scope.newUser).then(function (success) {
      success && $scope.hideNewUserFrm(success);
    });
  };

  $scope.editUser = function () {
    self.originalUserData = angular.copy(this.user);

    // delete `id` property to avoid ngRepeat complaining
    // on duplicates when restoring original user
    delete self.originalUserData.id;

    this.user.edit = true;
    return false;
  };

  $scope.updateUser = function () {
    if ($window.confirm('Are you sure?')) {
      this.user.modified = (new Date()).getTime();
      delete this.user.edit;
      UsersService.update(this.user).then(function (success) {
        success ? $scope.cancelEditUser.call(this, true) : $scope.restoreUser.call(this);
      }.bind(this));
    }
  };

  $scope.restoreUser = function () {
    var user = this.user;

    if (user) {
      angular.extend(user, self.originalUserData);
      $scope.userFrm.$setPristine();
    }
  };

  $scope.deleteUser = function () {
    if ($window.confirm('Are you sure?')) {
      var idx = self.getUserIndex(this.user);
      if (idx !== -1) {
        UsersService.delete(this.user.id).then(function (success) {
          success && $scope.users.splice(idx, 1);
        });
      }
    }
  };

  $window.addEventListener('beforeunload', function (e) {
    if ($scope.userFrm.$dirty) {
      var msg = 'There are unsaved changes left.';
      (e || $window.event).returnValue = msg;
      return msg;
    }
  });

  // get users list
  UsersService.get().then(function (users) {
    $scope.users = users;
  });
}
