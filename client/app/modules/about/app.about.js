(function () {
  'use strict';
  /**
   * @ngdoc overview
   * @name com.module.about
   * @module
   * @description
   * @requires loopbackApp
   *
   * The `com.module.core` module provides services for interacting with
   * the models exposed by the LoopBack server via the REST API.
   *
   */
  var app = angular.module('com.module.about', []);
  var Hello = React.createClass( {
    propTypes: {
      fname: React.PropTypes.string.isRequired,
      lname: React.PropTypes.string.isRequired
    },

    render: function() {
      return React.DOM.span( null,
        'Hello ' + this.props.fname + ' ' + this.props.lname
      );
    }
  } );

  app.value( "Hello", Hello );

  app.directive( 'hello', function( reactDirective ) {
    return reactDirective( Hello );
  } );

})();
