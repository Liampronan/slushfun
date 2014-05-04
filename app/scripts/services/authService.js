angular.module('SlushFunApp')
  .factory('loginService', function($firebaseSimpleLogin, $rootScope, $location, $timeout) {
//    $rootScope.$on('$firebaseSimpleLogin:login', function (e, user) {
//      $rootScope.user = user;
//    });
    var ref = new Firebase('https://slushfun.firebaseio.com/');
    var auth = $firebaseSimpleLogin(ref);
    return {
      register: function (user) {
        return auth.$createUser(user.email, user.password)
          .then(function(registeredUser) {
            console.log(registeredUser);
              return auth.$login('password', user).then(function(loggedInUser) {
                console.log('Logged in as: ', loggedInUser.uid);
              }, function(error) {
                console.error('Login failed: ', error);
            })
          }
        )},
      logout: function(){
//        $rootScope.signedIn = false;
        return auth.$logout();
      },
      getUser: function(){
        return auth.$getCurrentUser().then(function(user){console.log(user)});
      }
    }
  });