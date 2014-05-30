"use strict";

angular.module('testApp').service('UsersService', function ($http, $q) {
    var ls = window.localStorage,
        index = {},
        getLocalUsers = function() {
            try {
                var users = ls.getItem('users');
                users = JSON.parse(users);
            } catch (e) {
                this.error = 'Error retrieving users from storage';
                return false;
            }

            return users;
        };

    this.error = false;

    this.isEmailUnique = function(email) {
        var users = getLocalUsers();

        if (!email || !users) {
            return false;
        }

        for (var i = 0; i < users.length; i++) {
            if (email == users[i].email) {
                return false;
            }
        }

        return true;
    };

    this.get = function () {
        var deferred = $q.defer(),
            self = this,
            savedUsers = getLocalUsers();

        if (savedUsers) {
            deferred.resolve(savedUsers);
        } else {
            $http.get('/data/users.json', { responseType: 'json' })
                .success(function(data, status, headers, config) {
                    if (status == 200) {
                        ls.setItem('users', JSON.stringify(data));
                        deferred.resolve(data);
                    } else {
                        self.error = 'Error requesting users';
                    }
                })
                .error(function(data, status, headers, config) {
                    self.error = 'Request failed';
                });
        }

        return deferred.promise;
    };

    this.add = function (user) {
        var users = getLocalUsers();
        if (!users) {
            return false;
        }

        users.push(user);
        ls.setItem('users', JSON.stringify(users));
    };

    this.update = function (userData) {
        var users = getLocalUsers();
        if (!users || !users.length) {
            this.error = 'Error updating user: no users.'
            return false;
        }

        if (!userData || !userData.id) {
            this.error = 'Error updating user: wrong data.'
            return false;
        }

        if (index[userData.id]) {
            users[index[userData.id]] = userData;
        } else {
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == userData.id) {
                    users[i] = userData;
                    index[userData.id] = i;
                    break;
                }
            }
        }

        ls.setItem('users', JSON.stringify(users));
        return true;
    };
});