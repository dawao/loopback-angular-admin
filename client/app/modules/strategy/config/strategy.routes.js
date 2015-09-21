'use strict';
var app = angular.module('com.module.strategy');

app.config(function($stateProvider) {
  $stateProvider.state('app.strategy', {
    abstract: true,
    url: '/strategies',
    templateUrl: 'modules/strategy/views/main.html'
  }).state('app.strategy.list', {
    url: '',
    templateUrl: 'modules/strategy/views/list.html',
    controller: 'strategyCtrl'
  }).state('app.strategy.add', {
    url: '/add',
    templateUrl: 'modules/strategy/views/form.html',
    controller: 'strategyCtrl',
    authenticate: true
  }).state('app.strategy.edit', {
    url: '/:id/edit',
    templateUrl: 'modules/strategy/views/form.html',
    controller: 'strategyCtrl'
  }).state('app.strategy.view', {
    url: '/:id',
    templateUrl: 'modules/strategy/views/view.html',
    controller: 'strategyCtrl'
  });
});
