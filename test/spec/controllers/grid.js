'use strict';

describe('Controllers', function() {

  var $rootScope, ctrl, scope, childScope, service;

  beforeEach(module('testApp'));

  beforeEach(inject(function (_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('GridCtrl', function () {
    var users;

    beforeEach(inject(function ($controller, $window, $q) {
      // mock service
      var mockFn = function () {
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;
      };

      users = [
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

      service = {
        'get': function() {
          var dfd = $q.defer();
          dfd.resolve(users);
          return dfd.promise;
        },

        'create': mockFn,
        'delete': mockFn,
        'update': mockFn
      };

      scope = $rootScope.$new();
      scope.userFrm = {
        $setPristine: function () {}
      };

      childScope = scope.$new();

      $window.confirm = function() { return true };

      ctrl = $controller('GridCtrl', {
        $scope      : scope,
        $window     : $window,
        usersService: service
      });

      scope.$digest(); // let it know that we've got users
    }));

    it("should have list of users", function () {
      expect(scope.users).toBeDefined();
      expect(scope.users.length).toEqual(users.length);
    });

    it("should create a user", function () {
      // fill in user properties
      scope.newUser = {
        lastName : 'new last name',
        firstName: 'new first name',
        email    : 'somefakemail@gmail.com'
      };

      var usersLen = scope.users.length;

      // save it
      scope.createUser();
      $rootScope.$digest();

      // let's check if it's there
      expect(usersLen).not.toEqual(scope.users.length);

      var lastUser = scope.users.pop();
      expect(lastUser.email).toEqual('somefakemail@gmail.com');
    });

    it("should delete user", function () {
      var len = scope.users.length,
          nextUserId = scope.users[1].id;

      childScope.deleteUser(scope.users[0]);
      $rootScope.$digest();

      expect(scope.users.length).toEqual(len - 1);
      expect(scope.users[0].id).toEqual(nextUserId);
    });
  });
});
