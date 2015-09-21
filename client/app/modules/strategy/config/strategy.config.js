'use strict';
var app = angular.module('com.module.strategy');

app.run(function($rootScope, Strategy, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('strategy'), 'app.strategy.list',
    'fa-file-o');

  Strategy.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('strategy'),
      'bg-green', 'ion-clipboard', data.length, 'app.strategy.list');
  });

});
