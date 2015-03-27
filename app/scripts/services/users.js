(function () {
  'use strict';

  angular
    .module('testApp')
    .service('usersService', usersService);

  function usersService($http, $q, $window) {
    var ls = $window.localStorage,
      map = {},
      error = this.error = {};

    function _getLocalUsers() {
      try {
        var users = ls.getItem('users');
        users = JSON.parse(users);
        return users;
      } catch (e) {
        /* jshint validthis: true */
        error.msg = 'Error retrieving users from storage';
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


    this.get = function () {
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

    this.create = function (user) {
      var dfd = $q.defer(),
        users = _getLocalUsers();

      if (!users || !_isEmailUnique(user.email)) {
        error.msg = 'Email "' + user.email + '" is already used.';
        dfd.resolve(false);
      } else {
        var date = (new Date()).getTime();
        user.id = date + 1;
        user.created = date;
        users.push(user);
        map[user.id] = users.length - 1;
        ls.setItem('users', JSON.stringify(users));
        dfd.resolve(true);
      }

      return dfd.promise;
    };

    this.delete = function (id) {
      var dfd = $q.defer(),
        users = _getLocalUsers(),
        userIdx = map[id];

      if (!users) {
        dfd.resolve(false);
      } else if (angular.isUndefined(userIdx)) {
        error.msg = 'Invalid user id.';
        dfd.resolve(false);
      } else {
        delete map[id];
        users.splice(userIdx, 1);
        ls.setItem('users', JSON.stringify(users));
        dfd.resolve(true);
      }

      return dfd.promise;
    };

    this.update = function (user) {
      var dfd = $q.defer(),
        users = _getLocalUsers(),
        userIdx = map[user.id];

      if (!users) {
        dfd.resolve(false);
      } else if (undefined === userIdx) {
        error.msg = 'Invalid user id.';
        dfd.resolve(false);
      } else {
        user.modified = (new Date()).getTime();
        users[userIdx] = user;
        ls.setItem('users', JSON.stringify(users));
        dfd.resolve(true);
      }

      return dfd.promise;
    };
  }
})();
