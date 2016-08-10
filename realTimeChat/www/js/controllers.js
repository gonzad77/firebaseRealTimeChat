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

.controller('ChatCtrl', function($scope, $state, $ionicLoading, $stateParams, ChatService) {
  var room_key = $stateParams.roomKey;
  ChatService.getName(room_key)
  .then(function(name){
    $scope.room_name = name
  }, function(error){
    console.log(error);
  });
})

.controller('ChatRoomsCtrl', function($scope, $state, $ionicPopup, ChatRoomService, $ionicLoading) {

  ChatRoomService.getRooms()
  .then(function(result){
    $scope.rooms = result;
  });

  $scope.openChatRoom = function(room){
    console.log(room);
    $state.go('app.chat', {roomKey: room.room_key});
  }

  $scope.showPopUp = function(){
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.roomName">',
        title: 'Enter room name',
        subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Create</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.roomName) {
                //don't allow the user to close unless he enters the chat room name
                e.preventDefault();
              } else {
                ChatRoomService.createRoom($scope.data)
                .then(function(result){
                  // $scope.rooms.unshift({name: $scope.data.roomName,
                  //                   key: result});
                  $state.go('app.chat', {roomKey: result});
                },function(error){
                  console.log(error);
                });
              }
            }
          }
        ]
      });
    }
})
