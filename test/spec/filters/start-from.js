"use strict";

describe('Filters', function () {
  var filter;

  beforeEach(module('testApp'));

  describe('startFrom', function () {
    beforeEach(inject(function (_startFromFilter_) {
      filter = _startFromFilter_;
    }));

    it("should return new array starting from specified element", function() {
      var testArr = [1, 2, 3, 4, 5, 6];
      expect(filter(testArr, 2)).toEqual([3, 4, 5, 6]);
    });

    it("should return empty array on invalid input data", function() {
      expect(filter('someString', false)).toEqual([]);
    });
  });
});
