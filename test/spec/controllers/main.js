'use strict';

describe('controllers', function() {

  beforeEach(module('testApp'));

  var ctrl,
    scope,
    childScope,
    service;

  var users = [
    {
      "id"       : 0,
      "isActive" : true,
      "age"      : 23,
      "firstName": "Jocelyn",
      "lastName" : "Wells",
      "email"    : "jocelynwells@slofast.com",
      "created"  : 1396345548579,
      "modified" : 1397094371820
    },
    {
      "id"       : 1,
      "isActive" : false,
      "age"      : 31,
      "firstName": "Lola",
      "lastName" : "Ellison",
      "email"    : "lolaellison@slofast.com",
      "created"  : 1397704093343,
      "modified" : 1393277263594
    },
    {
      "id"       : 2,
      "isActive" : true,
      "age"      : 55,
      "firstName": "Stephenson",
      "lastName" : "Bryant",
      "email"    : "stephensonbryant@slofast.com",
      "created"  : 1394860184950,
      "modified" : 1389589191908
    },
    {
      "id"       : 3,
      "isActive" : true,
      "age"      : 54,
      "firstName": "Jessie",
      "lastName" : "Conner",
      "email"    : "jessieconner@slofast.com",
      "created"  : 1399935001343,
      "modified" : 1399851239729
    },
    {
      "id"       : 4,
      "isActive" : false,
      "age"      : 39,
      "firstName": "Chasity",
      "lastName" : "Dalton",
      "email"    : "chasitydalton@slofast.com",
      "created"  : 1394389595806,
      "modified" : 1391824879638
    },
    {
      "id"       : 5,
      "isActive" : false,
      "age"      : 21,
      "firstName": "Rhonda",
      "lastName" : "Rhodes",
      "email"    : "rhondarhodes@slofast.com",
      "created"  : 1390692385032,
      "modified" : 1390625917364
    },
    {
      "id"       : 6,
      "isActive" : true,
      "age"      : 57,
      "firstName": "Terra",
      "lastName" : "Ashley",
      "email"    : "terraashley@slofast.com",
      "created"  : 1399173747410,
      "modified" : 1397839147617
    },
    {
      "id"       : 7,
      "isActive" : false,
      "age"      : 25,
      "firstName": "Davidson",
      "lastName" : "Wolf",
      "email"    : "davidsonwolf@slofast.com",
      "created"  : 1388974888567,
      "modified" : 1392732896816
    },
    {
      "id"       : 8,
      "isActive" : false,
      "age"      : 48,
      "firstName": "Myers",
      "lastName" : "Berg",
      "email"    : "myersberg@slofast.com",
      "created"  : 1391668389475,
      "modified" : 1392023291118
    },
    {
      "id"       : 9,
      "isActive" : true,
      "age"      : 29,
      "firstName": "Spence",
      "lastName" : "Acosta",
      "email"    : "spenceacosta@slofast.com",
      "created"  : 1388767190421,
      "modified" : 1397742072664
    },
    {
      "id"       : 10,
      "isActive" : false,
      "age"      : 42,
      "firstName": "Angie",
      "lastName" : "Horne",
      "email"    : "angiehorne@slofast.com",
      "created"  : 1395638481965,
      "modified" : 1393294429931
    },
    {
      "id"       : 11,
      "isActive" : false,
      "age"      : 26,
      "firstName": "Garcia",
      "lastName" : "Levine",
      "email"    : "garcialevine@slofast.com",
      "created"  : 1392886361595,
      "modified" : 1393133555244
    },
    {
      "id"       : 12,
      "isActive" : false,
      "age"      : 47,
      "firstName": "Mckenzie",
      "lastName" : "Hodges",
      "email"    : "mckenziehodges@slofast.com",
      "created"  : 1389905746183,
      "modified" : 1390756276409
    },
    {
      "id"       : 13,
      "isActive" : true,
      "age"      : 39,
      "firstName": "Jeannine",
      "lastName" : "Everett",
      "email"    : "jeannineeverett@slofast.com",
      "created"  : 1392764741964,
      "modified" : 1397375842112
    },
    {
      "id"       : 14,
      "isActive" : true,
      "age"      : 39,
      "firstName": "Kelley",
      "lastName" : "Monroe",
      "email"    : "kelleymonroe@slofast.com",
      "created"  : 1395721501476,
      "modified" : 1389418406634
    },
    {
      "id"       : 15,
      "isActive" : true,
      "age"      : 42,
      "firstName": "Ellis",
      "lastName" : "Wilson",
      "email"    : "elliswilson@slofast.com",
      "created"  : 1398477281438,
      "modified" : 1393961611883
    },
    {
      "id"       : 16,
      "isActive" : false,
      "age"      : 43,
      "firstName": "Pamela",
      "lastName" : "Cameron",
      "email"    : "pamelacameron@slofast.com",
      "created"  : 1399745079614,
      "modified" : 1391376327386
    },
    {
      "id"       : 17,
      "isActive" : true,
      "age"      : 53,
      "firstName": "Gaines",
      "lastName" : "Finch",
      "email"    : "gainesfinch@slofast.com",
      "created"  : 1397941162936,
      "modified" : 1399123085927
    },
    {
      "id"       : 18,
      "isActive" : true,
      "age"      : 35,
      "firstName": "Ginger",
      "lastName" : "Green",
      "email"    : "gingergreen@slofast.com",
      "created"  : 1394391321575,
      "modified" : 1398456309215
    },
    {
      "id"       : 19,
      "isActive" : true,
      "age"      : 40,
      "firstName": "Watts",
      "lastName" : "Cleveland",
      "email"    : "wattscleveland@slofast.com",
      "created"  : 1397460399322,
      "modified" : 1394607697451
    },
    {
      "id"       : 20,
      "isActive" : true,
      "age"      : 25,
      "firstName": "Bolton",
      "lastName" : "Pruitt",
      "email"    : "boltonpruitt@slofast.com",
      "created"  : 1394980555333,
      "modified" : 1398212307413
    },
    {
      "id"       : 21,
      "isActive" : true,
      "age"      : 53,
      "firstName": "Michelle",
      "lastName" : "Mathis",
      "email"    : "michellemathis@slofast.com",
      "created"  : 1400472527219,
      "modified" : 1395281020188
    },
    {
      "id"       : 22,
      "isActive" : false,
      "age"      : 40,
      "firstName": "Mendoza",
      "lastName" : "Figueroa",
      "email"    : "mendozafigueroa@slofast.com",
      "created"  : 1399749351216,
      "modified" : 1396384120881
    },
    {
      "id"       : 23,
      "isActive" : false,
      "age"      : 22,
      "firstName": "Bradford",
      "lastName" : "Rosa",
      "email"    : "bradfordrosa@slofast.com",
      "created"  : 1388864074777,
      "modified" : 1389300363356
    },
    {
      "id"       : 24,
      "isActive" : true,
      "age"      : 48,
      "firstName": "Emerson",
      "lastName" : "Bradford",
      "email"    : "emersonbradford@slofast.com",
      "created"  : 1389906761825,
      "modified" : 1395910201902
    },
    {
      "id"       : 25,
      "isActive" : true,
      "age"      : 50,
      "firstName": "Page",
      "lastName" : "Barrett",
      "email"    : "pagebarrett@slofast.com",
      "created"  : 1394426881733,
      "modified" : 1392202433014
    },
    {
      "id"       : 26,
      "isActive" : true,
      "age"      : 34,
      "firstName": "Delaney",
      "lastName" : "Zamora",
      "email"    : "delaneyzamora@slofast.com",
      "created"  : 1393293810115,
      "modified" : 1397500205161
    },
    {
      "id"       : 27,
      "isActive" : false,
      "age"      : 26,
      "firstName": "Herminia",
      "lastName" : "Martin",
      "email"    : "herminiamartin@slofast.com",
      "created"  : 1397150871023,
      "modified" : 1391969459213
    },
    {
      "id"       : 28,
      "isActive" : false,
      "age"      : 34,
      "firstName": "Guzman",
      "lastName" : "Oneal",
      "email"    : "guzmanoneal@slofast.com",
      "created"  : 1397462285712,
      "modified" : 1393389900406
    },
    {
      "id"       : 29,
      "isActive" : true,
      "age"      : 43,
      "firstName": "Dillard",
      "lastName" : "Nielsen",
      "email"    : "dillardnielsen@slofast.com",
      "created"  : 1393426204905,
      "modified" : 1391954606435
    },
    {
      "id"       : 30,
      "isActive" : false,
      "age"      : 48,
      "firstName": "Larsen",
      "lastName" : "Rivera",
      "email"    : "larsenrivera@slofast.com",
      "created"  : 1393850689639,
      "modified" : 1399410954342
    },
    {
      "id"       : 31,
      "isActive" : false,
      "age"      : 32,
      "firstName": "Christina",
      "lastName" : "Ingram",
      "email"    : "christinaingram@slofast.com",
      "created"  : 1392394343493,
      "modified" : 1389127613727
    },
    {
      "id"       : 32,
      "isActive" : true,
      "age"      : 52,
      "firstName": "Gray",
      "lastName" : "Bullock",
      "email"    : "graybullock@slofast.com",
      "created"  : 1399827739865,
      "modified" : 1398153860455
    },
    {
      "id"       : 33,
      "isActive" : true,
      "age"      : 22,
      "firstName": "Sparks",
      "lastName" : "Rivers",
      "email"    : "sparksrivers@slofast.com",
      "created"  : 1392562374172,
      "modified" : 1396373251992
    },
    {
      "id"       : 34,
      "isActive" : true,
      "age"      : 37,
      "firstName": "Munoz",
      "lastName" : "Mcknight",
      "email"    : "munozmcknight@slofast.com",
      "created"  : 1395392121893,
      "modified" : 1401110068357
    },
    {
      "id"       : 35,
      "isActive" : false,
      "age"      : 49,
      "firstName": "Reva",
      "lastName" : "Barlow",
      "email"    : "revabarlow@slofast.com",
      "created"  : 1394819427728,
      "modified" : 1391955609655
    },
    {
      "id"       : 36,
      "isActive" : true,
      "age"      : 45,
      "firstName": "Louisa",
      "lastName" : "Bowers",
      "email"    : "louisabowers@slofast.com",
      "created"  : 1393217662092,
      "modified" : 1391874507535
    },
    {
      "id"       : 37,
      "isActive" : true,
      "age"      : 29,
      "firstName": "Olson",
      "lastName" : "Parsons",
      "email"    : "olsonparsons@slofast.com",
      "created"  : 1397983354331,
      "modified" : 1397936467003
    },
    {
      "id"       : 38,
      "isActive" : false,
      "age"      : 42,
      "firstName": "Traci",
      "lastName" : "Hardin",
      "email"    : "tracihardin@slofast.com",
      "created"  : 1401047393623,
      "modified" : 1388594086268
    },
    {
      "id"       : 39,
      "isActive" : false,
      "age"      : 47,
      "firstName": "Bernadine",
      "lastName" : "Wiggins",
      "email"    : "bernadinewiggins@slofast.com",
      "created"  : 1389159170963,
      "modified" : 1397973462462
    },
    {
      "id"       : 40,
      "isActive" : false,
      "age"      : 47,
      "firstName": "Shelby",
      "lastName" : "Aguilar",
      "email"    : "shelbyaguilar@slofast.com",
      "created"  : 1397869819788,
      "modified" : 1393960688752
    },
    {
      "id"       : 41,
      "isActive" : true,
      "age"      : 39,
      "firstName": "Copeland",
      "lastName" : "Noble",
      "email"    : "copelandnoble@slofast.com",
      "created"  : 1394037600591,
      "modified" : 1401002785771
    },
    {
      "id"       : 42,
      "isActive" : true,
      "age"      : 25,
      "firstName": "Middleton",
      "lastName" : "Turner",
      "email"    : "middletonturner@slofast.com",
      "created"  : 1396713633240,
      "modified" : 1401091267701
    },
    {
      "id"       : 43,
      "isActive" : true,
      "age"      : 38,
      "firstName": "Kate",
      "lastName" : "Campbell",
      "email"    : "katecampbell@slofast.com",
      "created"  : 1393666654252,
      "modified" : 1394895866816
    },
    {
      "id"       : 44,
      "isActive" : true,
      "age"      : 33,
      "firstName": "Bauer",
      "lastName" : "Flores",
      "email"    : "bauerflores@slofast.com",
      "created"  : 1390857838875,
      "modified" : 1389800557394
    },
    {
      "id"       : 45,
      "isActive" : true,
      "age"      : 50,
      "firstName": "Buchanan",
      "lastName" : "Roman",
      "email"    : "buchananroman@slofast.com",
      "created"  : 1397802582288,
      "modified" : 1391106376623
    },
    {
      "id"       : 46,
      "isActive" : true,
      "age"      : 40,
      "firstName": "Carole",
      "lastName" : "Harrell",
      "email"    : "caroleharrell@slofast.com",
      "created"  : 1400944878069,
      "modified" : 1398080736213
    },
    {
      "id"       : 47,
      "isActive" : true,
      "age"      : 28,
      "firstName": "Lester",
      "lastName" : "Mckenzie",
      "email"    : "lestermckenzie@slofast.com",
      "created"  : 1399272387439,
      "modified" : 1399870880140
    },
    {
      "id"       : 48,
      "isActive" : true,
      "age"      : 29,
      "firstName": "Dalton",
      "lastName" : "Santiago",
      "email"    : "daltonsantiago@slofast.com",
      "created"  : 1398446040898,
      "modified" : 1389605442540
    },
    {
      "id"       : 49,
      "isActive" : false,
      "age"      : 30,
      "firstName": "Bowers",
      "lastName" : "Golden",
      "email"    : "bowersgolden@slofast.com",
      "created"  : 1389524141006,
      "modified" : 1396561778865
    }
  ];

  describe('MainCtrl', function () {
    beforeEach(inject(function ($controller, $rootScope, $window, $q) {
      // mock service
      var mockFn = function () {
        var dfd = $q.defer();
        dfd.resolve(true);
        return dfd.promise;
      };

      service = {
        get: function() {
          var dfd = $q.defer();
          dfd.resolve(users);
          return dfd.promise;
        },

        'add'   : mockFn,
        'delete': mockFn,
        'update': mockFn
      };

      spyOn(service, 'add').andCallThrough();
      spyOn(service, 'delete').andCallThrough();
      spyOn(service, 'update').andCallThrough();

      scope = $rootScope.$new();
      childScope = scope.$new();

      $window.confirm = function(msg) { return true };

      ctrl = $controller('MainCtrl', {
        $scope      : scope,
        $window     : $window,
        UsersService: service
      });

      scope.$digest(); // let it know that we've got users
    }));

    it("create a user", function () {
      scope.createUser();

      var usersLen = scope.users.length;

      scope.userFrm = {
        $setPristine: function () {}
      };

      // fill in user properties
      scope.newUser.lastName = 'new last name';
      scope.newUser.firstName = 'new first name';
      scope.newUser.age = 25;
      scope.newUser.email = 'somefakemail@gmail.com';
      scope.newUser.isActive = true;

      // save it
      scope.saveUser();
      scope.$root.$digest();

      // let's check if it's there
      expect(usersLen).not.toEqual(scope.users.length);

      var lastUser = scope.users.pop();
      expect(lastUser.email).toEqual('somefakemail@gmail.com');
    });

    it("update user", function () {
      var user = childScope.user = scope.users[0],
          oldAge = user.age;

      user.age += 10;
      childScope.updateUser();
      expect(scope.users[0].age).toEqual(oldAge + 10);
    });

    it("delete user", function () {
      var len = scope.users.length,
          nextUserId = scope.users[1].id;
      childScope.user = scope.users[0];

      childScope.deleteUser();
      scope.$root.$digest();

      expect(scope.users.length).toEqual(len - 1);
      expect(scope.users[0].id).toEqual(nextUserId);
    });
  });
});
