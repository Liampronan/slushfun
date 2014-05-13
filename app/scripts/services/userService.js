'use strict';

angular.module('SlushFunApp')
  .factory('User', function ($firebase, FBURL) {
    var ref = new Firebase(FBURL + 'users');
    var users = $firebase(ref);

    var User = {
      create: function (authUser) {
        console.log('ref', ref);
        console.log('users', users);
        users[authUser.id] = {
          email: authUser.email,
          test: "hello",
          $priority: authUser.id
        };

        users.$save(authUser.id);
      }
    };

  return User;
});