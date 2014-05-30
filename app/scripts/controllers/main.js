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
        $scope.sortReverse = name === $scope.sortColumn;
        $scope.sortColumn = name;
        return false;
    };

    $scope.getOffset = function() {
        var offset = ($scope.page - 1) * $scope.itemsPerPage;
        return offset < 0 ? 0 : offset;
    };

    this.resetEdit = function() {
        $scope.editUserId = null;
        $scope.editUserModel = null;
        $scope.userFrm.$setPristine();
        self.editUserIndex = -1;
    };

    this.resetCreate = function() {
        $scope.showNewUser = false;
        $scope.newUserModel = null;
        $scope.userFrm.$setPristine();
        $scope.sortColumn = '-created';
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
        $scope.editUserModel = angular.copy(this.user);
        return false;
    };

    $scope.updateUser = function() {
        if ($scope.userFrm.$dirty && $scope.userFrm.$valid) {
            if (confirm('Are you sure?')) {
                $scope.editUserModel.modified = (new Date()).getTime();

                for (var i = 0; i < $scope.users.length; i++) {
                    if ($scope.users[i].id == $scope.editUserModel.id) {
                        $scope.users[i] = $scope.editUserModel;
                        break;
                    }
                }

                $scope.service.update($scope.editUserModel);
                self.resetEdit();
            }
        } else {
            return false;
        }
    };

    $scope.toggleActiveFlag = function() {
        debugger;
        $scope.editUserModel.isActive;
    };

    $scope.cancelEditUser = function () {
        self.resetEdit();
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
