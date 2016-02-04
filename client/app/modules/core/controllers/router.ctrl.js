(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:RouteCtrl
   * @description Redirect for acess
   * @requires $q
   * @requires $scope
   * @requires $state
   * @requires $location
   * @requires AppAuth
   **/
  angular
    .module('com.module.core')
    .controller('RouteCtrl', function ($rootScope, $state, ApiService, AppAuth, User, $location) {

      ApiService.checkConnection()
        .then(function () {
          console.log('ApiService.checkConnection success');
          if (!AppAuth.currentUser) {
            $location.path('/login');
          } else {
            User.roles({ id : AppAuth.currentUser.id//,filter: {where: {name: 'admin'}}
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
              $rootScope.menu = menuoptions;
              $location.path('/app');
            }, function () {
              // Error with request//$rootScope.r_deferred.reject();
            });
          }
        })
        .catch(function (err) {
          console.log('ApiService.checkConnection err: ' + err);
          $location.path('/error');
        });

    });

})();
