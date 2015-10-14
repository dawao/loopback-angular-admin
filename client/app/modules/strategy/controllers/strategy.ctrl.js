'use strict';
var app = angular.module('com.module.strategy');

app.controller('strategyCtrl', function($scope, $state, $stateParams, strategyService, gettextCatalog) {

  $scope.delete = function(id) {
    strategyService.deleteStrategy(id, function() {
      $scope.strategies = strategyService.getStrategies();
    });
  };

  $scope.onSubmit = function() {
      angular.extend($scope.strategy, {tags:[],buys:[],sell:[],risk:[]});
      angular.forEach(['tags','buys','sell','risk'], function(value, key) {
        angular.forEach(this[value], function(n, i) {
          this.push(n.text);
        }, this.strategy[value]);
      }, $scope);

    strategyService.upsertStrategy($scope.strategy, function() {
      $scope.strategies = strategyService.getStrategies();
      $state.go('^.list');
    });
  };

  $scope.strategies = strategyService.getStrategies();

  if ($stateParams.id) {
    $scope.strategy = strategyService.getStrategy($stateParams.id)
      .$promise.then(function(result) {  
      // console.log(newValue+ '===' +oldValue);  
            angular.forEach(['tags','buys','sell','risk'], function(value, key) {
              if(result[value] && result[value].length > 0){
                var temp = [];
                angular.forEach(result[value], function(n, i) {
                  this.push({text:n});
                }, temp);
                this[value] = temp;
              }
            }, $scope);
            $scope.strategy = result;
      });
  } else {
    $scope.strategy = {public:false,tags:[],buys:[],sell:[],risk:[]};
    $scope.tags = [{text:'业绩最近季度显著增长'},{text:'业绩连年稳定增长'},{text:'题材好且有板块效应'},{text:'有主力资金参与'},{text:'处于板块龙头地位'},{text:'有优质机构最近季度增仓'}];
    $scope.buys=[{text:'带量突破盘整区'},{text:'股价创新高'},{text:'形态无缺陷'},{text:'价量关系合理'}];
    $scope.sell=[{text:'涨25%考虑止赢'},{text:'跌5%减半仓'},{text:'跌8%考虑止损'},{text:'跌破最近大阳线考虑卖出'}];
    $scope.risk=[{text:'趋势为王-不在弱市买入'},{text:'平盘震荡方向不明不加仓'},{text:'非明确上升趋势下仓位不超50%'},{text:'持仓不超过五只股'},{text:'方向不明可放飞利润'}] ;

  }

});
