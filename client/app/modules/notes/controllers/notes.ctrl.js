'use strict';
var app = angular.module('com.module.notes');

app.controller('ModalInstanceCtrl', function($scope, $uibModalInstance, events, noteId, EventsService) {

  $scope.events = events;
  $scope.newEvent = {noteId:noteId};
  $scope.iconClass = {info:'glyphicon-check', warning:'glyphicon-credit-card', success:'glyphicon-flag'};

  $scope.save = function () {
    var pm = EventsService.upsertEvent($scope.newEvent);
    pm.then(function (evt) {
      $scope.events.unshift(evt);
    });
  };

  $scope.delete = function (id) {
    EventsService.deleteEvent(id,
        function(){
          angular.forEach($scope.events, function(value, key) {
            if(value.id === id)
                 $scope.events.splice(key,1);
          });

        },
        function(){
        }
    );
  };

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
