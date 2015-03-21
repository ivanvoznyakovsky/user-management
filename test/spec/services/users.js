'use strict';

describe('Services', function () {
  var $httpBackend, $rootScope;


  beforeEach(function () {
    module('testApp');

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
    });
  });

  describe('Users', function() {
    var UsersService, users;

    beforeEach(function () {
      inject(function($injector) {
        UsersService = $injector.get('UsersService');

        $injector.get('$window').localStorage.removeItem('users');

        users = [
          {
            "id"       : 0,
            "age"      : 23,
            "firstName": "Jocelyn",
            "lastName" : "Wells",
            "email"    : "jocelynwells@slofast.com"
          },
          {
            "id"       : 1,
            "age"      : 31,
            "firstName": "Lola",
            "lastName" : "Ellison",
            "email"    : "lolaellison@slofast.com"
          },
          {
            "id"       : 2,
            "firstName": "Stephenson",
            "lastName" : "Bryant",
            "email"    : "stephensonbryant@slofast.com"
          }
        ];

        $httpBackend.whenGET('/data/users.json').respond(users);
      });
    });

    it('should get list of users', function () {
      UsersService.get().then(function (userList) {
        expect(userList.length).toEqual(users.length);
      });

      $httpBackend.flush();
    });

    it('should add new user', function () {
      UsersService.get().then(function (userList) {
        var user = {
          id       : userList.slice(-1)[0].id + 1,
          lastName : 'new last name',
          firstName: 'new first name',
          email    : 'somefakemail@gmail.com'
        };

        UsersService.add(user).then(function (success) {
          expect(success).toEqual(true);

          UsersService.get().then(function (userList) {
            expect(userList.slice(-1)[0].email).toEqual(user.email);
          });
        });
      });

      $httpBackend.flush();
    });


    it('should fail adding new user', function () {
      UsersService.get().then(function (userList) {
        var last = userList.slice(-1)[0],
          len = users.length,
          user = {
            id       : last.id + 1,
            lastName : 'new ' + last.lastName,
            firstName: 'new ' + last.firstName,
            age      : 25,
            email    : last.email,
            isActive : true
          };

        UsersService.add(user).then(function (success) {
          expect(success).toEqual(false);

          UsersService.get().then(function (userList) {
            expect(userList.length).toEqual(len);
          });
        });
      });

      $httpBackend.flush();
    });

    it('should update user by id', function () {
      UsersService.get().then(function (userList) {
        var user = userList.slice(-1)[0];
        user.email = 'newusermail@gmail.com';

        UsersService.update(user).then(function (success) {
          expect(success).toEqual(true);

          UsersService.get().then(function (userList) {
            expect(userList.slice(-1)[0].email).toEqual(user.email);
          });
        });
      });

      $httpBackend.flush();
    });

    it('should delete user by id', function () {
      UsersService.get().then(function (userList) {
        var user = userList.slice(-1)[0];

        UsersService.delete(user.id).then(function (success) {
          expect(success).toEqual(true);

          UsersService.get().then(function (userList) {
            expect(userList.slice(-1)[0].id).not.toEqual(user.id);
          });
        });
      });

      $httpBackend.flush();
    });
  });
});
