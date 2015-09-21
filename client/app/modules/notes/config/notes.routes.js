(function () {
  'use strict';
  angular
    .module('com.module.notes')
    .config(function ($stateProvider) {
      $stateProvider
        .state('app.notes', {
          abstract: true,
          url: '/notes',
          templateUrl: 'modules/notes/views/main.html'
        })
        .state('app.notes.list', {
          url: '',
          templateUrl: 'modules/notes/views/list.html',
          controllerAs: 'ctrl',
          controller: function (notes) {
            this.notes = notes;
          },
          resolve: {
            notes: function (NotesService) {
              return NotesService.getNotes();
            }
          }
        })
        .state('app.notes.add', {
          url: '/add',
          templateUrl: 'modules/notes/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, NotesService, strategies, note) {
            this.note = note;
            this.strategies = strategies;
            this.setting = {tags:[],buys:[],sell:[],risk:[]};
            this.formFields = NotesService.getFormFields();
            this.formOptions = {};
            this.change = function() {  
                angular.forEach(strategies, function(stra, k) {
                  if(this.note.strategyId == stra.id)
                    angular.forEach(['tags','buys','sell','risk'], function(value, key) {
                      angular.forEach(stra[value], function(n, i) {
                        this.push({text:n,
                          disp:1,
                          idx:i});
                      }, this.setting[value]);
                    }, this);

                }, this);

            };
            this.submit = function () {
              angular.forEach(['tags','buys','sell','risk'], function(value, key) {
                this.note[value] = [];
                angular.forEach(this.setting[value], function(n, i) {
                  this.push(n.disp);
                }, this.note[value]);
              }, this);
              NotesService.upsertNote(this.note).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            strategies: function (strategyService) {
              return strategyService.getStrategies();
            },
            note: function () {
              return {};
            }
          }
        })
        .state('app.notes.edit', {
          url: '/:id/edit',
          templateUrl: 'modules/notes/views/form.html',
          controllerAs: 'ctrl',
          controller: function ($state, NotesService, note, strategyService) {
            this.note = note;
            this.formFields = NotesService.getFormFields();
            this.formOptions = {};
            this.setting = {tags:[],buys:[],sell:[],risk:[]};
            var self = this;
            if(this.note.strategyId) {
              strategyService.getStrategy(this.note.strategyId).$promise.then(function(result) {  

                angular.forEach(['tags','buys','sell','risk'], function(value, key) {
                  if(result[value] && result[value].length > 0){
                      angular.forEach(result[value], function(n, i) {
                        this.push({text:n,
                          disp:self.note[value][i],
                          idx:i});
                      }, this.setting[value]);
                  }
                }, self);
              });
            }
            this.submit = function () {
              angular.forEach(['tags','buys','sell','risk'], function(value, key) {
                this.note[value] = [];
                angular.forEach(this.setting[value], function(n, i) {
                  this.push(n.disp);
                }, this.note[value]);
              }, this);
              NotesService.upsertNote(this.note).then(function () {
                $state.go('^.list');
              });
            };
          },
          resolve: {
            note: function ($stateParams, NotesService) {
              return NotesService.getNote($stateParams.id);
            }
          }
        })
        .state('app.notes.view', {
          url: '/:id',
          templateUrl: 'modules/notes/views/view.html',
          controllerAs: 'ctrl',
          controller: function (note) {
            this.note = note;
          },
          resolve: {
            note: function ($stateParams, NotesService) {
              return NotesService.getNote($stateParams.id);
            }
          }
        })
        .state('app.notes.delete', {
          url: '/:id/delete',
          template: '',
          controllerAs: 'ctrl',
          controller: function ($state, NotesService, note) {
            NotesService.deleteNote(note.id, function () {
              $state.go('^.list');
            }, function () {
              $state.go('^.list');
            });
          },
          resolve: {
            note: function ($stateParams, NotesService) {
              return NotesService.getNote($stateParams.id);
            }
          }
        });
    });

})();
