var rootRef = firebase.database().ref();

  var classroomsRef = firebase.database().ref('classrooms');
  var teachersRef = firebase.database().ref('teachers');

  $scope.classrooms = $firebaseArray(classroomsRef);
  $scope.teachers = $firebaseArray(teachersRef);

  $scope.classrooms.$loaded().then(function() {
    console.log('classrooms:');
    angular.forEach($scope.classrooms, function(value, key) {
      console.log(key, value);
    });   
  })

  $scope.teachers.$loaded().then(function() {
    console.log('teachers:');
    angular.forEach($scope.teachers, function(value, key) {
      console.log(key, value);
    });   
  })

  //var ref = firebase.database().ref();

  //var obj = $firebaseObject(ref);

  // to take an action after the data loads, use the $loaded() promise
  //obj.$loaded().then(function() {
    //console.log("loaded record:", obj.$id, obj.someOtherKeyInData);

    // To iterate the key/value pairs of the object, use angular.forEach()
    //angular.forEach(obj, function(value, key) {
    //  console.log(key, value);
    //});

    //obj.$add({
    //  'add' : 'added',
    //});

  //})

  firebase.auth().createUserWithEmailAndPassword('aselromaldemodulo@gmail.com', 'Virtual15').catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });

  firebase.auth().signInWithEmailAndPassword('aselromaldemodulo@gmail.com', 'Virtual15').catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //User is signed in.
      var user = firebase.auth().currentUser;

      console.log("  Provider-specific UID: "+user.uid);
      console.log("  Name: "+user.displayName);
      console.log("  Email: "+user.email);
      console.log("  Photo URL: "+user.photoURL);

      $scope.teachers.$add({
        'avatar' : 'none',
        'name' : user.displayName,
        'surname' : 'Pirulon',
        'userId' : user.uid,
      });

      var newUser = {
        'avatar' : 'none',
        'name' : user.displayName,
        'surname' : 'Pirulon',
        'userId' : user.uid,
      }

      rootRef.child('Users').setValue(user.uid + ' : ' + newUser);

    } else {
      //No user is signed in.
    }
  });


  $scope.getClassrooms = function() {
    var teacherClassroomsRef = firebase.database().ref('teachers/' + $scope.teacher.$id + '/classrooms');
    var classroomKeys = $firebaseArray(teacherClassroomsRef);
    classroomKeys.$loaded(function() {
      $scope.classrooms = [];
      for (i = 0 ; i < classroomKeys.length ; i++) {
      var classKey = classroomKeys.$keyAt(i);
      var loopClassroom = firebase.database().ref('classrooms/' + classKey);
      loopClassroom.on('value', function(snapshot) {
        $scope.classrooms.push(snapshot.val());
      });
    }
    }).then(function() {
      $scope.getClassroomsForSelection();
    });
  }









  var millisecondsToWait = 500;
  setTimeout(function() {
    // Whatever you want to do after the wait
  }, millisecondsToWait);





  $scope.secondaryMenuSelection = function() {
    var teamIndex = document.getElementById("selectTeam").selectedIndex;
    var classroomIndex = document.getElementById("selectCopy").selectedIndex;

    var team = $scope.teams[teamIndex - 1];
    var classroom = $scope.classrooms[classroomIndex - 1];

    if(team != undefined && classroom != undefined) {
      $scope.addStudentToTeam(team, $scope.student);
      $scope.copyStudentToClass(classroom, $scope.student);
    } else {
      if (team != undefined) {
        $scope.addStudentToTeam(team, $scope.student);
      }

      if (classroom != undefined) {
        $scope.copyStudentToClass(classroom, $scope.student);
      }
    }
    $scope.closeModalSecondary();
  }

  $scope.getItems = function() {
    var classroomItemsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/items');
    var itemKeys = $firebaseArray(classroomItemsRef);
    itemKeys.$loaded(function() {
      $scope.items = [];
      $scope.itemsLocked = [];
      $scope.itemsUnlocked = [];
      for(i = 0 ; i < itemKeys.length ; i++) {
        var itemKey = itemKeys.$keyAt(i);
        var loopItemsRef = firebase.database().ref('items/' + itemKey);
        loopItemsRef.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var item = snapshot.val();
            var change = false;
            var index = -1;
            if($scope.student.items == undefined) {
              for(j = 0 ; j < $scope.itemsLocked.length ; j++){
                if(item.id == $scope.itemsLocked[j].id){
                  change = true;
                  index = j;
                  item.studentPoints = 0;
                }
              }
              if (!change) {
                item.studentPoints = 0;
                $scope.itemsLocked.push(item);
              } else {
                $scope.itemsLocked[index] = item;
              }
            } else {
              if(!(item.id in $scope.student.items)) {
                for(j = 0 ; j < $scope.itemsLocked.length ; j++){
                  if(item.id == $scope.itemsLocked[j].id){
                    change = true;
                    index = j;
                    item.studentPoints = 0;
                  }
                }
                if (!change) {
                  item.studentPoints = 0;
                  $scope.itemsLocked.push(item);
                } else {
                  $scope.itemsLocked[index] = item;
                }
              } else {
                for(j = 0 ; j < $scope.itemsUnlocked.length ; j++){
                  if(item.id == $scope.itemsUnlocked[j].id){
                    change = true;
                    index = j;
                    item.studentPoints = $scope.student.items[item.id].points;
                  }
                }
                if (!change) {
                  item.studentPoints = $scope.student.items[item.id].points;
                  $scope.itemsUnlocked.push(item);
                } else {
                  $scope.itemsUnlocked[index] = item;
                }
              }
            }
          }
          if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
          }
          $scope.getStudentLevel();
        });
      }
    });
  }