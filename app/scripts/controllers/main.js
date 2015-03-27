(function () {
  'use strict';

  angular
    .module('testApp')
    .controller('MainCtrl', MainCtrl);

  function MainCtrl($window, appState) {
    $window.addEventListener('beforeunload', function (e) {
      if (appState.hasUnsavedData) {
        var msg = 'There are unsaved changes left.';
        (e || $window.event).returnValue = msg;
        return msg;
      }
    });
  }
})();
