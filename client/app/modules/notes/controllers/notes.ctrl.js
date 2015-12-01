'use strict';
var app = angular.module('com.module.notes');

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, events) {

  $scope.events = events;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
