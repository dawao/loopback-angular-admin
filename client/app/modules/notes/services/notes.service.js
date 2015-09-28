(function () {
  'use strict';
  angular
    .module('com.module.notes')
    .service('NotesService', function ($state, CoreService, Note, LoopBackAuth, gettextCatalog) {

      this.getNotes = function () {
        return Note.find({
          filter: {
            where: {
              ownerId: LoopBackAuth.currentUserId
            },
            include: [
              'user','strategy'
            ]
          }
        }).$promise;
      };

      this.getNote = function (id) {
        return Note.findById({
          id: id
        }).$promise;
      };

      this.upsertNote = function (note) {
        return Note[note.id?'upsert':'create'](note).$promise
          .then(function () {
            CoreService.toastSuccess(
              gettextCatalog.getString('Note saved'),
              gettextCatalog.getString('Your note is safe with us!')
            );
          })
          .catch(function (err) {
            CoreService.toastSuccess(
              gettextCatalog.getString('Error saving note '),
              gettextCatalog.getString('This note could no be saved: ') + err
            );
          }
        );
      };

      this.deleteNote = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Note.deleteById({id: id}, function () {
              CoreService.toastSuccess(
                gettextCatalog.getString('Note deleted'),
                gettextCatalog.getString('Your note is deleted!'));
              successCb();
            }, function (err) {
              CoreService.toastError(
                gettextCatalog.getString('Error deleting note'),
                gettextCatalog.getString('Your note is not deleted! ') + err);
              cancelCb();
            });
          },
          function () {
            cancelCb();
          }
        );
      };

    }).directive('mySetting', function() {

      return {
        restrict: 'E',
        scope: {
          customerInfo: '=info'
        },
        link: function(scope, element, attr) {
          var info = 'list-group-item-success';
          var war = 'list-group-item-danger';
          element.on('click', function(event) {
              // Prevent default dragging of selected content
              event.preventDefault();
              var elm = angular.element(event.target);
              if(elm.hasClass('badge')){
                elm = elm.parent();
              }                
              if(elm.hasClass('list-group-item')){
                var idx = elm.attr('idx');
                var badge = elm.find('span');
                if(elm.hasClass(info)){
                  scope.customerInfo[idx].disp = 0;
                  elm.removeClass(info).addClass(war);
                  badge.text('不符合');
                }else{
                  scope.customerInfo[idx].disp = 2;
                  elm.addClass(info).removeClass(war);
                  badge.text('符合');
                }
                
                
              }

          });
        },
        templateUrl: 'modules/notes/views/my-setting.html'
      };
    });

})();
