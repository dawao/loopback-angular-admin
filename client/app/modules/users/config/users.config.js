(function () {
  'use strict';
  angular.module('com.module.users')
    .run(function ($rootScope, gettextCatalog, CoreService) {
      $rootScope.addMenu(gettextCatalog.getString('Users'), 'app.users.list', 'fa-user');
    });

})();
