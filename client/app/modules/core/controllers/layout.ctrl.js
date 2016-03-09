(function () {
  'use strict';
  angular
    .module('com.module.core')
  /**
   * @ngdoc function
   * @name com.module.core.controller:LayoutCtrl
   * @description Layout controller
   * @requires $scope
   * @requires $rootScope
   * @requires CoreService
   * @requires gettextCatalog
   **/
    .controller('LayoutCtrl', function ($scope, $rootScope, $cookies, CoreService, gettextCatalog) {

      // angular translate
      $scope.locale = {
        isopen: false
      };

      $scope.locales = $rootScope.locales;
      $scope.selectLocale = $rootScope.locale;

      $scope.setLocale = function (locale) {
        // set the current lang
        $scope.locale = $scope.locales[locale];
        $scope.selectLocale = $scope.locale;
        $rootScope.locale = $scope.locale;
        $cookies.lang = $scope.locale.lang;

        // You can change the language during runtime
        $scope.locale.isopen = !$scope.locale.isopen;

        gettextCatalog.setCurrentLanguage($scope.locale.lang);
      };

      $scope.appName = 'LoopBack Admin';
      $scope.apiUrl = CoreService.env.apiUrl;
      $scope.appTheme = 'skin-blue';
      $scope.appThemes = [
        {
          'name': 'Black',
          'class': 'skin-black'
        },
        {
          'name': 'Blue',
          'class': 'skin-blue'
        }
      ];
      $scope.appLayout = '';
      $scope.appLayouts = [
        {
          'name': 'Fixed',
          'class': 'fixed'
        },
        {
          'name': 'Scrolling',
          'class': 'not-fixed'
        }
      ];

      $scope.toggleSidebar = function () {
        var $ = angular.element;
        //Enable sidebar push menu
        if (window.innerWidth > (768 - 1)) {
          if ($(document.body).hasClass('sidebar-collapse')) {
            $(document.body).removeClass('sidebar-collapse');
          } else {
            $(document.body).addClass('sidebar-collapse');
          }
        }
        //Handle sidebar push menu for small screens
        else {
          if ($(document.body).hasClass('sidebar-open')) {
            $(document.body).removeClass('sidebar-open').removeClass('sidebar-collapse');
          } else {
            $(document.body).addClass('sidebar-open');
          }
        }
      };

      $scope.settings = $rootScope.settings;

      $rootScope.loadSettings();

    });

})();
