'use strict';

angular.module('testApp').service('UsersService', function ($http, $q, $window) {
  var ls = $window.localStorage,
    index = {},
    getLocalUsers = function () {
      try {
        var users = ls.getItem('users');
        users = JSON.parse(users);
        return users;
      } catch (e) {
        this.error = 'Error retrieving users from storage';
        return false;
      }
    };

  this.error = false;

  this.isEmailUnique = function (email) {
    var users = getLocalUsers();

    if (!email || !users) {
      return false;
    }

    for (var i = 0; i < users.length; i++) {
      if (email === users[i].email) {
        return false;
      }
    }

    return true;
  };

  this.get = function () {
    var dfd = $q.defer(),
      savedUsers = getLocalUsers();

    if (savedUsers) {
      dfd.resolve(savedUsers);
      return dfd.promise;
    } else {
      return $http.get('/data/users.json', {responseType: 'json'})
        .then(function (data, status) {
          if (status === 200) {
            ls.setItem('users', JSON.stringify(data));
            return data;
          } else {
            return false;
          }
        });
    }
  };

  this.add = function (user) {
    var users = getLocalUsers();
    if (!users) {
      return false;
    }

    users.push(user);
    ls.setItem('users', JSON.stringify(users));
  };

  this.update = function (userData, remove) {
    var users = getLocalUsers();
    if (!users || !users.length) {
      this.error = 'Error updating user: no users.';
      return false;
    }

    if (!userData || !userData.id) {
      this.error = 'Error updating user: wrong data.';
      return false;
    }

    var idx = index[userData.id];
    if (!idx) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === userData.id) {
          index[userData.id] = i;
          idx = i;
          break;
        }
      }
    }

    if (remove) {
      users.splice(idx, 1);
    } else {
      users[idx] = userData;
    }

    ls.setItem('users', JSON.stringify(users));
    return true;
  };
});
