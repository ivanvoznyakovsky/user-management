'use strict';

describe('Services', function () {
  var $httpBackend, $rootScope;

  beforeEach(module('testApp'));

  beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $httpBackend = $injector.get('$httpBackend');
    })
  );

  describe('Users', function() {
    var usersService, users;

    beforeEach(function () {
      inject(function($injector) {
        usersService = $injector.get('usersService');

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
      usersService.get().then(function (userList) {
        expect(userList.length).toEqual(users.length);
      });

      $httpBackend.flush();
    });

    it('should add new user', function () {
      usersService.get().then(function (userList) {
        var user = {
          id       : userList.pop().id + 1,
          lastName : 'new last name',
          firstName: 'new first name',
          email    : 'somefakemail@gmail.com'
        };

        usersService.create(user).then(function (success) {
          expect(success).toEqual(true);

          usersService.get().then(function (userList) {
            expect(userList.pop().email).toEqual(user.email);
          });
        });
      });

      $httpBackend.flush();
    });


    it('should fail adding new user', function () {
      usersService.get().then(function (userList) {
        var last = userList.pop(),
          len = users.length,
          user = {
            id       : last.id + 1,
            lastName : 'new ' + last.lastName,
            firstName: 'new ' + last.firstName,
            age      : 25,
            email    : last.email,
            isActive : true
          };

        usersService.create(user).then(function (success) {
          expect(success).toEqual(false);

          usersService.get().then(function (userList) {
            expect(userList.length).toEqual(len);
          });
        });
      });

      $httpBackend.flush();
    });

    it('should update user by id', function () {
      usersService.get().then(function (userList) {
        var user = userList.pop();
        user.email = 'newusermail@gmail.com';

        usersService.update(user).then(function (success) {
          expect(success).toEqual(true);

          usersService.get().then(function (userList) {
            expect(userList.pop().email).toEqual(user.email);
          });
        });
      });

      $httpBackend.flush();
    });

    it('should delete user by id', function () {
      usersService.get().then(function (userList) {
        var user = userList.pop();

        usersService.delete(user.id).then(function (success) {
          expect(success).toEqual(true);

          usersService.get().then(function (userList) {
            expect(userList.pop().id).not.toEqual(user.id);
          });
        });
      });

      $httpBackend.flush();
    });
  });
});
