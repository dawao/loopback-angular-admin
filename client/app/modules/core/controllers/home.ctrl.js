(function () {
  'use strict';
  /**
   * @ngdoc function
   * @name com.module.core.controller:HomeCtrl
   * @description Dashboard
   * @requires $scope
   * @requires $rootScope
   **/
  angular
    .module('com.module.core')
    .controller('HomeCtrl', function ( $scope, $rootScope,$state,User,AppAuth) {
      $scope.count = {};
      $scope.boxes = $rootScope.dashboardBox;
              User.roles({ id : AppAuth.currentUser.id,filter: {where: {name: 'admin'}}
              }).$promise.then(function (data) {
                if(data.length > 0){
 
                }else{
                  $state.go('app.notes.list');
                }
              }, function () {
                // Error with request
                  $state.go('app.notes.list');
              });
    });

})();
