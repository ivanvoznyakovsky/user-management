(function () {
  'use strict';

  angular
    .module('testApp')
    .service('appState', appState);

  function appState() {
    this.filter = {
      value: ''
    };

    this.hasUnsavedData = false;
  }
})();
