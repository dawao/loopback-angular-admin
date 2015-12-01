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
    .controller('MainCtrl', function ($scope, $rootScope, $state, AppAuth, CoreService, User, gettextCatalog) {
      AppAuth.ensureHasCurrentUser(function (cu) {
        //This call also serves to redirect a user to the login screen, via the interceptor in users.auth.js, if they are not authenticated.
        $scope.currentUser = User.getCurrent();
        $scope.currentUser.$promise.then(
            function (currentUser) {
                  User.roles({ id : currentUser.id//,filter: {where: {name: 'admin'}}
                  }).$promise.then(function (data) {
                    $scope.menuoptions = [];
                    //只展示有权限的菜单
                    angular.forEach(data, function (role) {
                      angular.forEach($rootScope.menu, function (menu) {
                        var sd = $state.get(menu.sref).data;
                        var nr = sd && sd.roles ? sd.roles : [];
                        var hasRole = nr.length?false:true;
                        angular.forEach(nr, function (ned) {
                          if(role.name === ned) {hasRole = true;}
                        });
                        hasRole && $scope.menuoptions.push(menu);
                      });
                    });

                  }, function () {
                    // Error with request
                    //$rootScope.r_deferred.reject();
                  });
            }
        );

      });

      $scope.menuoptions = $rootScope.menu;

      $scope.logout = function () {
        AppAuth.logout(function () {
          CoreService.toastSuccess(gettextCatalog.getString('Logged out'),
            gettextCatalog.getString('You are logged out!'));
          $state.go('login');
        });
      };

    });

})();
