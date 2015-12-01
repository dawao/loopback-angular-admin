(function () {
  'use strict';
  /**
   * @ngdoc overview
   * @name loopbackApp
   * @description
   * # loopbackApp
   *
   * Main module of the application.
   */
  angular
    .module('loopbackApp', [
      'angular-loading-bar',
      'angular.filter',
      // 'angularBootstrapNavTree',
      // 'angularFileUpload',
      // 'btford.markdown',
      'angular-timeline',
      'oitozero.ngSweetAlert',
      'config',
      // 'formly',
      // 'formlyBootstrap',
      'lbServices',
      // 'monospaced.elastic',
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.bootstrap',
      // 'ui.codemirror',
      'ui.gravatar',
      // 'ui.grid',
      'ui.router',
      'angular-toasty',
      'autofields',
      'gettext',
      // 'angular-underscore/filters', 'schemaForm',
      'ui.select',
      'ngTagsInput',
      'react',
      'com.module.core',
      'com.module.about',
      // 'com.module.browser',
      // 'com.module.events',
      // 'com.module.files',
      'com.module.notes',
      'com.module.strategy',
      // 'com.module.pages',
      // 'com.module.posts',
      // 'com.module.products',
      // 'com.module.sandbox',
      'com.module.settings',
      'com.module.users'
    ])
    .run(function ($rootScope, $cookies, gettextCatalog) {

      $rootScope.locales = {
        'de': {
          lang: 'zh_CN',
          country: 'CN',
          name: gettextCatalog.getString('Chinese')
        },
        'en': {
          lang: 'en',
          country: 'US',
          name: gettextCatalog.getString('English')
        },
        'es_MX': {
          lang: 'es_MX',
          country: 'MX',
          name: gettextCatalog.getString('Spanish')
        }
      };

      var lang = $cookies.lang || navigator.language || navigator.userLanguage;

      $rootScope.locale = $rootScope.locales[lang];

      if ($rootScope.locale === undefined) {
        $rootScope.locale = $rootScope.locales[lang];
        if ($rootScope.locale === undefined) {
          $rootScope.locale = $rootScope.locales['en'];
        }
      }

      gettextCatalog.setCurrentLanguage($rootScope.locale.lang);

    })
    .run(function () {
      /*
       ngModelAttrs stuff
       */
      var ngModelAttrs = {};

      function camelize (string) {
        string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
        // Ensure 1st char is always lowercase
        return string.replace(/^([A-Z])/, function (match, chr) {
          return chr ? chr.toLowerCase() : '';
        });
      }

      /*
       timepicker
       */
      ngModelAttrs = {};

      // attributes
      angular.forEach([
        'meridians',
        'readonly-input',
        'mousewheel',
        'arrowkeys'
      ], function (attr) {
        ngModelAttrs[camelize(attr)] = {attribute: attr};
      });

      // bindings
      angular.forEach([
        'hour-step',
        'minute-step',
        'show-meridian'
      ], function (binding) {
        ngModelAttrs[camelize(binding)] = {bound: binding};
      });


    });

})();
