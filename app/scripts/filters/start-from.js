"use strict";

angular.module('testApp').filter('startFrom', function() {
    return function(input, start) {
        if ((input != null) && (start != null) && typeof start === 'number') {
            start = +start;
            return input.slice(start);
        }
    }
});