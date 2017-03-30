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














  














  $scope.registerTeacher = function(name, surname, email, password, school, avatar) {

    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      if (error) {
        console.log(error.code);
        console.log(error.message);
      }
    });

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      if (error) {
        console.log(error.code);
        console.log(error.message);
      }
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
        var sessionUser = firebase.auth().currentUser;
        if (sessionUser) {
          //User is signed in.
          if (avatar == null) {
            avatar = 'https://easyeda.com/assets/static/images/avatar-default.png';
          }
          if (school === ' ' || school === '' || school == null) {
            school = 'Not established';
          }
          sessionUser.updateProfile({
            displayName : name + ' ' + surname,
            photoURL : avatar
          }).then(function() {
            //Update successful.
            var newTeacherRef = firebase.database().ref('teachers/'+sessionUser.uid);
            newTeacherRef.set({
              'school' : school,
              'pirula' : 'sangre',
            }).then(function() {
              console.log('SET EXISTING USER DONE');
              $state.go('teacherHome', {teacherId : sessionUser.uid});
            });
          }, function(error){
            //An error happened.
            console.log(error.code);
            console.log(error.message);
          });
        } else {
          //No user is signed in.
        }
      } else {
        
      }
    });

  }