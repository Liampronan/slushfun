angular.module('SlushFunApp')
  .factory('loginService', function($firebaseSimpleLogin, $rootScope, $location, User) {
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
                localStorage.setItem('token', loggedInUser.firebaseAuthToken);
                //create the user in FB /users (already created in simplelogin)
                User.create(registeredUser);
                $rootScope.user = {
                  email: user.email,
                  userName: user.email.match(/^([^@]*)@/)[1],
                  id: user.id,
                  isLoggedIn: true
                }
                localStorage.setItem('user', JSON.stringify($rootScope.user));
              }, function(error) {
                console.error('Login failed: ', error);
            })
          }
        )},
      login: function (provider, options) {
        auth.$login(provider, options)
          .then(function(loggedInUser) {
            $rootScope.user = {
              email: loggedInUser.email,
              userName: loggedInUser.email.match(/^([^@]*)@/)[1],
              id: loggedInUser.id,
              isLoggedIn: true
            }
            localStorage.setItem('token', loggedInUser.firebaseAuthToken);
            localStorage.setItem('user', JSON.stringify($rootScope.user));
          }, function(error) {
            console.error('Login failed: ', error);
          })
      },
      isLoggedIn: function () {
        return auth.user !== null;
      },
      logOut: function(){
        $rootScope.user = {};
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return auth.$logout();
      },
      getCurrentUser: function(){
        return auth.$getCurrentUser();
      }
    }
  });