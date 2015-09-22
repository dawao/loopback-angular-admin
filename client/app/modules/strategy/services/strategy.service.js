'use strict';
var app = angular.module('com.module.strategy');

app.service('strategyService', ['$state', 'CoreService', 'Strategy', 'LoopBackAuth', 'gettextCatalog', function($state,
  CoreService, Strategy, LoopBackAuth, gettextCatalog) {

  this.getStrategies = function() {
    return Strategy.find();
  };

  this.getStrategy = function(id) {
    return Strategy.findById({
      id: id
    });
  };

  this.upsertStrategy = function(strategy, cb) {
    Strategy[strategy.id?'upsert':'create'](strategy, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Strategy saved'), gettextCatalog.getString(
        'Your Strategy is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving Strategy '), gettextCatalog.getString(
        'This Strategy could no be saved: ') + err);
    });
  };

  this.deleteStrategy = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        Strategy.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'Strategy deleted'), gettextCatalog.getString(
            'Your Strategy is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting Strategy'), gettextCatalog.getString(
            'Your Strategy is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
