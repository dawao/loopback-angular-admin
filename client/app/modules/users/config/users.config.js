(function () {
  'use strict';
  angular.module('com.module.users')
    .run(function ($rootScope, gettextCatalog, CoreService) {
      $rootScope.addMenu(gettextCatalog.getString('Users'), 'app.users.list', 'fa-user');
      $rootScope.$on('$stateChangePermissionDenied', function(event, msg) {
        CoreService.toastWarning('没有权限', '您的角色没有访问此功能的权限！');
      });
    });

})();
