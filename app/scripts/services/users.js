'use strict';

angular.module('testApp')
  .service('UsersService', UsersService);

function UsersService($http, $q, $window) {
  var ls = $window.localStorage,
    self = this,
    map = {};

  self.error = {};

  function _getLocalUsers() {
    try {
      var users = ls.getItem('users');
      users = JSON.parse(users);
      return users;
    } catch (e) {
      self.error.msg = 'Error retrieving users from storage';
      return false;
    }
  }

  function _buildUsersMap(users) {
    if (!users) {
      return false;
    }

    users.forEach(function (user, idx) {
      map[user.id] = idx;
    });
  }

  function _isEmailUnique(email) {
    var users = _getLocalUsers();

    if (!email || !users) {
      return false;
    }

    for (var i = 0; i < users.length; i++) {
      if (email === users[i].email) {
        return false;
      }
    }

    return true;
  }


  self.get = function () {
    var dfd = $q.defer(),
      savedUsers = _getLocalUsers();

    dfd.promise.then(_buildUsersMap);

    if (savedUsers) {
      dfd.resolve(savedUsers);
    } else {
      $http.get('/data/users.json', {responseType: 'json'}).then(function (response) {
        var users = response.data || [];

        if (response.status === 200) {
          ls.setItem('users', JSON.stringify(users));
        }

        dfd.resolve(users);
      });
    }

    return dfd.promise;
  };

  self.add = function (user) {
    var dfd = $q.defer(),
      users = _getLocalUsers();

    if (!users || !_isEmailUnique(user.email)) {
      self.error.msg = 'Email "' + user.email + '" is already used.';
      dfd.resolve(false);
    } else {
      users.push(user);
      map[user.id] = users.length - 1;
      ls.setItem('users', JSON.stringify(users));
      dfd.resolve(true);
    }

    return dfd.promise;
  };

  self.delete = function (id) {
    var dfd = $q.defer(),
      users = _getLocalUsers(),
      userIdx = map[id];

    if (!users) {
      dfd.resolve(false);
    } else if (undefined === userIdx) {
      self.error.msg = 'Invalid user id.';
      dfd.resolve(false);
    } else {
      delete map[id];
      users.splice(userIdx, 1);
      ls.setItem('users', JSON.stringify(users));
      dfd.resolve(true);
    }

    return dfd.promise;
  };

  self.update = function (user) {
    var dfd = $q.defer(),
      users = _getLocalUsers(),
      userIdx = map[user.id];

    if (!users) {
      dfd.resolve(false);
    } else if (undefined === userIdx) {
      self.error.msg = 'Invalid user id.';
      dfd.resolve(false);
    } else {
      users[userIdx] = user;
      ls.setItem('users', JSON.stringify(users));
      dfd.resolve(true);
    }

    return dfd.promise;
  };
}
