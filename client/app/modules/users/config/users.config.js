(function () {
  'use strict';
  angular.module('com.module.users')
    .run(function ($rootScope, gettextCatalog, CoreService) {
      $rootScope.addMenu(gettextCatalog.getString('Users'), 'app.users.list', 'fa-user');
      $rootScope.$on('$stateChangePermissionDenied', function(event, msg) {
        CoreService.toastWarning('没有权限',
            'We received a 401 error from the API! Redirecting to login'
        );
      });
    });

})();
