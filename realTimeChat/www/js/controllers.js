angular.module('starter.controllers', [])

.controller('LogInCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.login = function(user){
   $ionicLoading.show({
     template: 'Logging in ...'
   });
   AuthService.doLogin(user)
    .then(function(user){
     // success
     $state.go('app.chatrooms');
     $ionicLoading.hide();
   },function(err){
     // error
     $scope.errors = err;
     $ionicLoading.hide();
   });
 };
})

.controller('SignUpCtrl', function($scope, $state, AuthService, $ionicLoading) {
  $scope.signup = function(user){
      $ionicLoading.show({
        template: 'Signing up ...'
      });

      AuthService.doSignup(user)
      .then(function(user){
        // success
        $state.go('app.chatrooms');
        $ionicLoading.hide();
      },function(err){
        // error
        $scope.errors = err;
        $ionicLoading.hide();
      });
    };
  })

.controller('ChatCtrl', function($scope, $state, $ionicLoading) {

})

.controller('ChatRoomsCtrl', function($scope, $state, $ionicLoading) {

})
