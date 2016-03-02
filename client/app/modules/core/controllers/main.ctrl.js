(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:MainCtrl
   * @description Login Controller
   * @requires $scope
   * @requires $state

   * @requires CoreService
   * @requires User
   * @requires gettextCatalog
   **/
  angular
    .module('com.module.core')
    .controller('MainCtrl', function ($scope, $rootScope, $state, LoopBackAuth, AppAuth, CoreService, User, gettextCatalog) {
      AppAuth.ensureHasCurrentUser(function (cu) {
        //This call also serves to redirect a user to the login screen, via the interceptor in users.auth.js, if they are not authenticated.
        $scope.currentUser = User.getCurrent();

      });

      $scope.menuoptions = [];

      User.roles({ id : LoopBackAuth.currentUserId//,filter: {where: {name: 'admin'}}
        }).$promise.then(function (data) {
          var menuoptions = [];
          //只展示有权限的菜单
          angular.forEach(data, function (role) {
            angular.forEach($rootScope.menu, function (menu) {
              var sd = $state.get(menu.sref).data;
              var nr = sd && sd.roles ? sd.roles : [];
              var hasRole = nr.length?false:true;
              angular.forEach(nr, function (ned) {
                if(role.name === ned) {hasRole = true;}
              });
              hasRole && this.push(menu);
            },menuoptions);
          });
          $scope.menuoptions = menuoptions;

        }, function () {
          // Error with request//$rootScope.r_deferred.reject();
        });

      $scope.logout = function () {
        AppAuth.logout(function () {
          CoreService.toastSuccess(gettextCatalog.getString('Logged out'),
            gettextCatalog.getString('You are logged out!'));
          $state.go('login');
        });
      };

    });

})();
