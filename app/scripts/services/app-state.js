(function () {
  'use strict';

  angular
    .module('testApp')
    .service('appState', appState);

  function appState() {
    this.filter = {};
    this.hasUnsavedData = false;
  }
})();
