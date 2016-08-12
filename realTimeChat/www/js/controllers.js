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

.controller('ChatCtrl', function($scope, $state, $ionicLoading, $stateParams, ChatService, AuthService) {
  var room_key = $stateParams.roomKey;
  ChatService.getName(room_key)
  .then(function(name){
    $scope.room_name = name
  }, function(error){
    console.log(error);
  });

  ChatService.getChats(room_key)
  .then(function(result){
    $scope.chats = result;
  }, function(error){
    console.log(error);
  })

  $scope.close = function(){
    ChatService.exitChat(room_key)
    .then(function(result){
      $state.go('app.chatrooms');
    },function(error){
      console.log(error);
    });
  }

  $scope.sendMessage = function(message){
    var user = AuthService.getUser();
    ChatService.addMessage(room_key,message,user)
    .then(function(result){
        console.log(result);
    },function(error){
        console.log(error);
    })
  }
})

.controller('ChatRoomsCtrl', function($scope, $state, $ionicPopup, ChatRoomService, $ionicLoading, _) {

  ChatRoomService.getRooms()
  .then(function(result){
    $scope.rooms = result;
  });

  $scope.doRefresh = function(){
    ChatRoomService.getRooms()
    .then(function(result){
      $scope.rooms = result;
    });
  }

  $scope.openChatRoom = function(room){
    ChatRoomService.addToChat(room)
    .then(function(result){
      $state.go('app.chat', {roomKey: room.room_key});
    }, function(error){
      var rooms = _.filter($scope.rooms, function(item){
        item.key == room.room_key;
      })
      $scope.rooms = rooms;
      console.log(error);
    })
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
                  ChatRoomService.getRooms()
                  .then(function(result){
                    $scope.rooms = result;
                  });
                  console.log(error);
                });
              }
            }
          }
        ]
      });
    }
})
