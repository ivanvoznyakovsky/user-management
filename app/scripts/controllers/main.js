'use strict';

angular.module('testApp').controller('MainCtrl', function ($scope, UsersService) {
    var self = this;

    $scope.service = UsersService;
    $scope.users = [];
    $scope.showNewUser = false;
    $scope.newUserModelTpl = {
        isActive: 1
    };
    $scope.page = 1;
    $scope.itemsPerPage = 10;
    $scope.totalItems = 0;

    $scope.sortReverse = false;
    $scope.sortColumn = '-created';

    $scope.sortBy = function(name) {
        if (name === $scope.sortColumn) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortReverse = false;
        }
        $scope.sortColumn = name;
        return false;
    };

    $scope.getOffset = function() {
        var offset = ($scope.page - 1) * $scope.itemsPerPage;
        return offset < 0 ? 0 : offset;
    };

    this.getUserIndexById = function(id) {
        for (var i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id == id) {
                return i;
            }
        }

        return -1;
    };

    this.resetEdit = function() {
        $scope.editUserId = null;
        $scope.editUserModel = null;
        $scope.userFrm.$setPristine();
        self.originalUserData = null;
        self.editUserIndex = -1;
    };

    this.resetCreate = function() {
        $scope.showNewUser = false;
        $scope.newUserModel = null;
        $scope.userFrm.$setPristine();
        $scope.sortColumn = 'created';
        $scope.sortReverse = true;
    };

    $scope.createUser = function () {
        $scope.showNewUser = true;
        $scope.newUserModel = angular.copy($scope.newUserModelTpl);
        $scope.newUserModel.id = 'user-' + Math.round(Math.random() * 100);
    };

    $scope.saveUser = function () {
        if ($scope.userFrm.$dirty && $scope.userFrm.$valid) {
            if ($scope.service.isEmailUnique($scope.newUserModel.email)) {
                var date = (new Date()).getTime();
                $scope.newUserModel.created = date;
                $scope.newUserModel.modified = date;
                $scope.users.push($scope.newUserModel);
                $scope.service.add($scope.newUserModel);
                self.resetCreate();
            } else {
                alert('Email "' + $scope.newUserModel.email + '" is already used.');
                return false;
            }
        }
    };

    $scope.cancelCreateUser = function () {
        self.resetCreate();
    };

    $scope.editUser = function() {
        $scope.editUserId = this.user.id;
        self.originalUserData = angular.copy(this.user);
        $scope.editUserModel = angular.copy(this.user);
        return false;
    };

    $scope.updateUser = function() {
        if ($scope.userFrm.$dirty && $scope.userFrm.$valid) {
            if (confirm('Are you sure?')) {
                $scope.editUserModel.modified = (new Date()).getTime();

                var userIndex = self.getUserIndexById($scope.editUserModel.id);

                if (userIndex !== -1) {
                    $scope.users[userIndex] = $scope.editUserModel;
                    $scope.service.update($scope.editUserModel);
                } else {
                    $scope.error = 'User not found in set';
                }

                self.resetEdit();
            }
        } else {
            return false;
        }
    };

    $scope.restoreEditUser = function() {
        $scope.editUserModel = angular.copy(self.originalUserData);
        $scope.userFrm.$setPristine();
    };

    $scope.cancelEditUser = function() {
        self.resetEdit();
    };

    $scope.deleteUser = function() {
        if (confirm('Are you sure?')) {
            var idx = self.getUserIndexById(this.user.id);
            if (idx !== -1) {
                $scope.users.splice(idx, 1);
                $scope.service.update(this.user, true);
            }
        }
    };

    $scope.$watch('service.error', function () {
        $scope.error = $scope.service.error;
    });

    window.onbeforeunload = function() {
        if ($scope.userFrm.$dirty) {
            return 'There are unsaved changes left. Are you sure you want to leave?';
        }
    };

    // get users list
    $scope.service.get().then(function (users) {
        $scope.users = users;
        $scope.totalItems = users.length;
    });
});
