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
      
      $scope.menuoptions = [];

      $scope.setUserMenus = function(user){
        if(user.profiles){
            //github user 没有roles,展示无rolse的菜单 
            angular.forEach($rootScope.menu, function (menu) {
              var sd = $state.get(menu.sref).data;
              var nr = sd && sd.roles ? sd.roles : [];
              var hasRole = nr.length?false:true;
              hasRole && this.push(menu);
            },$scope.menuoptions);
        }else
            User.roles({ id : user.id//,filter: {where: {name: 'admin'}}
            }).$promise.then(function (data) {

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
                },$scope.menuoptions);
              });
            }, function () {
              // Error with request//$rootScope.r_deferred.reject();
            });
      };

      AppAuth.ensureHasCurrentUser(function (cu) {
        
        if(cu){
          $scope.currentUser = cu;
          $scope.setUserMenus(cu);
        }else{
          //This call also serves to redirect a user to the login screen, via the interceptor in users.auth.js, if they are not authenticated.
          //有两种情况AppAuth.currentUser为空：直接刷新页面和github用户登录
          $scope.currentUser = User.getCurrent(function (user) {
              $scope.setUserMenus(user);
              return user;
            }, function (err) {
              console.log(err);
          });
        }
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
