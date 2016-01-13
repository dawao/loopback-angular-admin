(function () {
  'use strict';
  angular
    .module('com.module.notes')
    .service('EventsService', function ($state, CoreService, Event, gettextCatalog) {

      this.getEvents = function (noteId) {
        return Event.find({
          filter: {
            order: 'created DESC',
            where: {
              noteId: noteId
            }//,include: ['user']
          }
        }).$promise;
      };

      this.getEvent = function (id) {
        return Event.findById({
          id: id
        }).$promise;
      };

      this.upsertEvent = function (note) {
        return Event[note.id?'upsert':'create'](note).$promise
          .then(function (evt) {
            CoreService.toastSuccess(
              gettextCatalog.getString('Note saved'),
              gettextCatalog.getString('Your note is safe with us!')
            );
            return evt;
          })
          .catch(function (err) {
            CoreService.toastSuccess(
              gettextCatalog.getString('Error saving note '),
              gettextCatalog.getString('This note could no be saved: ') + err
            );
          }
        );
      };

      this.deleteEvent = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            Event.deleteById({id: id}, function () {
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

    });

})();
