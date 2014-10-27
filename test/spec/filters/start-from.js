"use strict";

describe('Filters', function () {
  beforeEach(module('testApp'));

  describe('start-from', function () {
    it("should return new array starting from 3rd element",
      inject(function (startFromFilter) {
        var testArr = [1, 2, 3, 4, 5, 6];
        expect(startFromFilter(testArr, 2)).toEqual([3, 4, 5, 6]);
      })
    );
  });
});
