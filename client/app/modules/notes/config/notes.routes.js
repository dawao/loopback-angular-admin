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
          controller: function ($uibModal, notes, EventsService) {
            this.notes = notes;

            this.openTimeline = function (noteId) {

                var modalInstance = $uibModal.open({
                  templateUrl: 'myModalContent.html',
                  controller: 'ModalInstanceCtrl',
                  resolve: {
                    events: function () {
                      return EventsService.getEvents(noteId);
                    },
                    noteId:function () {return noteId;}
                  }
                });

            };
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
          controller: function ($state, NotesService, strategies, note, $http) {
            this.note = note;
            this.strategies = strategies;
            this.setting = {tags:[],buys:[],sell:[],risk:[]};
            //自动补全股票，添加到列表
            var suggestServer = new SuggestServer();
            suggestServer.bind({"input": "symbol", "value": "@3@", "type": "stock", "width": 180,"callback":
              function (code,arr) {
                var first = arr, sc = code ;
                if(arr.length == 0){
                var first = this._objectData['key_'+code].split(';').shift().split(',');
                sc =  first[3];
                }
                angular.element(document.querySelector('#symbol')).val(first?first[4]:'');
                note.title = first?first[4]:'';
                note.code = code;
              }
            });
            /*this.getLocation = function(val) {
              return $http.get('//gupiao.baidu.com/api/search/stockquery', {
                params: {
                  query_content: val,
                  format:'json',
                  from:'pc',os_ver:1,cuid:'xxx',vv:100
                }
              }).then(function(response){
                if(response.data.errorNo ===0)
                  return response.data.data.stock_data.map(function(item){
                    return item.f_symbolName;
                  });
                else
                  return [response.data.errorMsg];
              });
            };*/
            this.change = function() {
                angular.forEach(strategies, function(stra, k) {
                  if(this.note.strategyId === stra.id){
                    angular.forEach(['tags','buys','sell','risk'], function(value, key) {
                      angular.forEach(stra[value], function(n, i) {
                        this.push({text:n,
                          disp:1,
                          idx:i});
                      }, this.setting[value]);
                    }, this);
                  }
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
              return strategyService.getAvailableStrategies();
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
            this.strategies = strategyService.getStrategies();
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
