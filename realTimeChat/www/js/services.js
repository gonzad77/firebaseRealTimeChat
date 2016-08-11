angular.module('starter.services', [])

.service('AuthService', function($q){
  var _firebase = new Firebase("https://ionicthemeschat.firebaseio.com/");

  this.userIsLoggedIn = function(){
    var deferred = $q.defer(),
        authService = this,
        isLoggedIn = (authService.getUser() !== null);

    deferred.resolve(isLoggedIn);

    return deferred.promise;
  };

  this.getUser = function(){
    return _firebase.getAuth();
  };

  this.doLogin = function(user){
    var deferred = $q.defer();

    _firebase.authWithPassword({
      email    : user.email,
      password : user.password
    }, function(errors, data) {
      if (errors) {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  };

  this.doSignup = function(user){
    var deferred = $q.defer(),
        authService = this;

    _firebase.createUser({
      email    : user.email,
      password : user.password,
    }, function(errors, data) {
      if (errors) {
        var errors_list = [],
            error = {
              code: errors.code,
              msg: errors.message
            };
        errors_list.push(error);
        deferred.reject(errors_list);
      } else {
        // After signup we should automatically login the user
        authService.doLogin(user)
        .then(function(data){
          // success
          deferred.resolve(data);
        },function(err){
          // error
          deferred.reject(err);
        });
      }
    });

    return deferred.promise;
  };

})

.service('ChatRoomService', function($q, AuthService){
  var _firebase = new Firebase("https://ionicthemeschat.firebaseio.com/");

  var user = AuthService.getUser();
  console.log(user);

  this.createRoom = function(room){
    //TODO AGREGAR PROMESAS
    var deferred = $q.defer(),
        exists = 'false',
        all_rooms = 'false';
    _firebase.child('rooms').once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var room_name = snapshot.child(childSnapshot.key()).child('name').val();
        if(room_name == room.roomName){
          deferred.reject("This name has been taken");
          exists = 'true';
        }
      })
      if(exists == 'false'){
        var push_ref = _firebase.child('rooms').push({'name' : room.roomName});
        var key = push_ref.key();
        _firebase.child('rooms').child(push_ref.key()).child('people').child(user.uid).set({'email': user.password.email,
                                                      'image' : user.password.profileImageURL},
                                                        function(error){
                                                          if(error){
                                                            deferred.reject(error);
                                                          }
                                                          else{
                                                            deferred.resolve(key);
                                                          }
                                                        });
      }
    })
    return deferred.promise;
  }

  this.addToChat = function(room){
    var deferred = $q.defer();
    var user = AuthService.getUser();
    _firebase.child('rooms').child(room.room_key).child('people').child(user.uid).set({'email': user.password.email,
                                                  'image' : user.password.profileImageURL},
                                                    function(error){
                                                      if(error){
                                                        deferred.reject(error);
                                                      }
                                                      else{
                                                        deferred.resolve("OK");
                                                      }
                                                    });
    return deferred.promise;                                                
  }

  this.getRooms = function(){
    var deferred = $q.defer();
    //TODO AGREGAR PROMESAS
    _firebase.child('rooms').once('value', function(snapshot){
      var room_promises = [];
      snapshot.forEach(function(childSnapshot){
        var deferredRoom = $q.defer();
        var room_key = childSnapshot.key();
        var room_name = snapshot.child(childSnapshot.key()).child('name').val();
        room_promises.unshift(deferredRoom.promise);
        var room = {name: room_name,
                    room_key: room_key}
        deferredRoom.resolve(room);
      })
      $q.all(room_promises)
      .then(function(result){
        console.log(room_promises);
      deferred.resolve(result);
      })
    });
    return deferred.promise;
  }

})

.service('ChatService', function($q, AuthService){
  var _firebase = new Firebase("https://ionicthemeschat.firebaseio.com/");

  this.getName = function(room_key){
    var deferred = $q.defer();
    getKey = function(key){
      return key;
    };
    _firebase.child('rooms').child(getKey(room_key)).once("value",function(snapshot){
      var name = snapshot.val().name;
      deferred.resolve(name);
    }, function(error){
      deferred.reject(error);
    })
    return deferred.promise;
  }

  this.closeChat = function(room_key){
    getKey = function(key){
      return key;
    };
    var user = AuthService.getUser(),
        deferred = $q.defer();
    _firebase.child("rooms").child(getKey(room_key)).child("people").child(user.uid).set(null);

  }
});
