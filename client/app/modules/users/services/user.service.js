(function () {
  'use strict';
  angular
    .module('com.module.users')
    .service('UserService', function ($state, CoreService, User, gettextCatalog) {

      this.find = function () {
        return User.find().$promise;
      };

      this.findById = function (id) {
        return User.findById({
          id: id
        }).$promise;
      };

      this.upsert = function (user) {
        return User.upsert(user).$promise
          .then(function () {
            CoreService.toastSuccess(
              gettextCatalog.getString('User saved'),
              gettextCatalog.getString('Your user is safe with us!')
            );
          })
          .catch(function (err) {
            CoreService.toastError(
              gettextCatalog.getString('Error saving user '),
              gettextCatalog.getString('This user could no be saved: ' + err)
            );
          }
        );
      };

      this.delete = function (id, successCb, cancelCb) {
        CoreService.confirm(
          gettextCatalog.getString('Are you sure?'),
          gettextCatalog.getString('Deleting this cannot be undone'),
          function () {
            User.deleteById({id: id}, function () {
              CoreService.toastSuccess(
                gettextCatalog.getString('User deleted'),
                gettextCatalog.getString('Your user is deleted!'));
              successCb();
            }, function (err) {
              CoreService.toastError(
                gettextCatalog.getString('Error deleting user'),
                gettextCatalog.getString('Your user is not deleted! ') + err);
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
