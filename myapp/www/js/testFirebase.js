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


  $scope.getStudentsForTeamSelection = function() {
    $scope.studentsForTeamSelection = angular.copy($scope.students);
    if ($scope.editMembers) {
      for (var element in $scope.studentsForTeamSelection) {
        $scope.studentsForTeamSelection[element].inTeam = false;
      }
      if ($scope.team.students != undefined) {
        for (var student in $scope.studentsForTeamSelection) {
          if ($scope.team.students[$scope.studentsForTeamSelection[student].id] === true) {
            $scope.studentsForTeamSelection[student].inTeam = true;
          }
        }
      }
      $scope.editMembers = false;
    } else {
      for (var element in $scope.studentsForTeamSelection) {
        $scope.studentsForTeamSelection[element].selected = false;
      }
    }
  }

  $scope.editTeamMembers = function() {
    $scope.closeModalEditMembers();
    for (var element in $scope.studentsForTeamSelection) {
      var studentTeamRef = firebase.database().ref('students/' + $scope.studentsForTeamSelection[element].id + '/teams/' + $scope.team.id);
      var teamStudentRef = firebase.database().ref('teams/' + $scope.team.id + '/students/' + $scope.studentsForTeamSelection[element].id);
      if ($scope.studentsForTeamSelection[element].inTeam === false) {
        studentTeamRef.remove();
        teamStudentRef.remove();
      } else {
        studentTeamRef.set(true);
        teamStudentRef.set(true);
      }
    }
    $scope.closeModalTeamDialog();


  $scope.editItemsMissionModal = '<ion-modal-view>'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>EDITAR MIEMBROS</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team" ng-repeat="itemForMissionSelection in itemsForMissionSelection" ng-checked="itemForMissionSelection.inMission">{{itemForMissionSelection.name}} {{itemForMissionSelection.score}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalEditMissionItems()" class="button button-calm  button-block">{{ \'CANCEL\' | translate }}</button>'+
        '<button ng-click="editMissionItems()" class="button button-calm  button-block">EDITAR MIEMBROS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.editRewardsMissionModal = '<ion-modal-view>'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>EDITAR MIEMBROS</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team" ng-repeat="rewardForMissionSelection in rewardsForMissionSelection" ng-checked="rewardForMissionSelection.inMission">{{rewardForMissionSelection.name}} {{rewardForMissionSelection.price}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalEditMissionRewards()" class="button button-calm  button-block">{{ \'CANCEL\' | translate }}</button>'+
        '<button ng-click="editMissionRewards()" class="button button-calm  button-block">EDITAR MIEMBROS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.editMembersMissionModal = '<ion-modal-view>'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>EDITAR MIEMBROS</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team" ng-repeat="studentForMissionSelection in studentsForMissionSelection" ng-checked="studentForMissionSelection.inMission">{{studentForMissionSelection.name}} {{studentForMissionSelection.surname}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalEditMissionMembers()" class="button button-calm  button-block">{{ \'CANCEL\' | translate }}</button>'+
        '<button ng-click="editMissionMembers()" class="button button-calm  button-block">EDITAR MIEMBROS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';