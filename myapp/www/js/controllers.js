angular.module('app.controllers', ['pascalprecht.translate'])
     
.controller('loginCtrl', ['$scope', '$stateParams', '$http', '$state', 'sharedData', '$firebaseArray',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, sharedData, $firebaseArray) {

  /*
    *************************************DECLARE FUNCTIONS FOR NG-SHOW********************************
  */

  $scope.loginType=false;
  $scope.loginType2=false;

  $scope.teacherForm = function(){
    $scope.loginType=true;
    $scope.loginType2=false;
    $scope.clearFormTeacher();
    sharedData.setData('teacher');
  }
  $scope.studentForm = function(){
    $scope.loginType=false;
    $scope.loginType2=true;
    $scope.clearFormStudent();
    sharedData.setData('student');
  }

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */
	
	$scope.clearFormTeacher = function(){
    var form = document.getElementById("teacherLoginForm");
    form.reset();
  }

  $scope.clearFormStudent = function(){
    var form = document.getElementById("studentLoginForm");
    form.reset();
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  var rootRef = firebase.database().ref();

  var teachersRef = firebase.database().ref('teachers');
  var studentsRef = firebase.database().ref('students');
  
  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */

  $scope.logInTeacher = function(email, password) {

    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      var sessionUser = firebase.auth().currentUser;
      if (sessionUser) {
        //User is signed in.
        var teachersArray = $firebaseArray(teachersRef);
        teachersArray.$loaded(function() {
          if (teachersArray.$getRecord(sessionUser.uid)) {
            $state.go('teacherHome', {teacherId : sessionUser.uid});
            $scope.clearFormTeacher();
          } else {
            alert('NO EXISTE CUENTA DE PROFESOR');
          }
        });
      } else {
        //No user is signed in.
      }
    }).catch(function(error) {
      if (error) {
        switch (error.code) {
			case "auth/wrong-password":
				alert("EL EMAIL O CONTRASEÑA SON INCORRECTOS");
				break;
			case "auth/user-not-found":
				alert("EL EMAIL O CONTRASEÑA NO SON INCORRECTOS");
				break;
			case "auth/invalid-email":
				alert("EMAIL INVALIDO");
				break;
			default:
				alert("ERROR DESCONOCIDO");
				break;
			}
		}
    });

    

  }

  $scope.logInStudent = function(email, password) {

    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
      var sessionUser = firebase.auth().currentUser;
      if (sessionUser) {
        //User is signed in.
        var studentsArray = $firebaseArray(studentsRef);
        studentsArray.$loaded(function() {
          if (studentsArray.$getRecord(sessionUser.uid)) {
            $scope.finishLoader();
            $state.go('studentHome', {studentId : sessionUser.uid});
            $scope.clearFormStudent();
          } else {
            alert('NO EXISTE CUENTA DE ALUMNO');
          }
        });
      } else {
        //No user is signed in.
      }
    }).catch(function(error) {
      if (error) {
        switch (error.code) {
			case "auth/wrong-password":
				alert("EL EMAIL O CONTRASEÑA SON INCORRECTOS");
				break;
			case "auth/user-not-found":
				alert("EL EMAIL O CONTRASEÑA NO SON INCORRECTOS");
				break;
			case "auth/invalid-email":
				alert("EMAIL INVALIDO");
				break;
			default:
				alert("ERROR DESCONOCIDO");
				break;
			}
		}
    });

  }

  $scope.startLoader = function(){
    $scope.isVisible = true;
  }
  $scope.finishLoader = function(){
    $scope.isVisible = false;
  }

}])



//                                  []
//                                  []
//                                  []
//                                  []
//                        [][][][][][][][][][][]
//                                  []
//                                  []
//                                  []
//                                  []
//                                  []



.controller('signUpCtrl', ['$scope', '$stateParams', '$http', '$state', 'sharedData',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, sharedData) {

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */

	$scope.clearForm = function(){
    var form = document.getElementById("signUp-form2");
    form.reset();
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  var signUpType = sharedData.getData();

  var rootRef = firebase.database().ref();

  var teachersRef = firebase.database().ref('teachers');
  var studentsRef = firebase.database().ref('students');

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */

  $scope.registerUser = function(name, surname, email, password, school, avatar) {

    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
      var signUpType = sharedData.getData();
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
          if (signUpType === 'teacher') { //TEACHER
            var newTeacherRef = firebase.database().ref('teachers/'+sessionUser.uid);
            newTeacherRef.set({
              'name' : CryptoJS.AES.encrypt(name,sessionUser.uid).toString(),
              'surname' : CryptoJS.AES.encrypt(name,sessionUser.uid).toString(),
              'school' : school,
            }).then(function() {
              $state.go('teacherHome', {teacherId : sessionUser.uid});
              $scope.clearForm();
            });
          } else if (signUpType === 'student') { //STUDENT
            var newStudentRef = firebase.database().ref('students/'+sessionUser.uid);
            newStudentRef.set({
              'name' : CryptoJS.AES.encrypt(name,sessionUser.uid).toString(),
              'surname' : CryptoJS.AES.encrypt(name,sessionUser.uid).toString(),
              'school' : school,
            }).then(function() {
              $state.go('studentHome', {studentId : sessionUser.uid});
              $scope.clearForm();
            });
          }
        });
      } else {
        //No user is signed in.
      }
    }).catch(function(error) {
      if (error) {
        switch (error.code) {
			case "auth/weak-password":
				alert("CORREO INVALIDO O NO EXISTENTE");
				break;
			case "auth/email-already-in-use":
				alert("EL CORREO INDICADO YA SE ENCUETNRA EN USO");
				break;
			case "auth/invalid-email":
				alert("EL CORREO INDICADO NO ES VALIDO");
				break;
			default:
				alert("ERROR DESCONOCIDO");
			}
		}
    });

  }

}])



//                                  []
//                                  []
//                                  []
//                                  []
//                        [][][][][][][][][][][]
//                                  []
//                                  []
//                                  []
//                                  []
//                                  []



.controller('teacherHomeCtrl', ['$scope', '$stateParams', '$ionicModal', '$http', '$state', '$ionicPopover', '$ionicActionSheet', '$firebaseObject', '$firebaseArray', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $http, $state, $ionicPopover, $ionicActionSheet, $firebaseObject, $firebaseArray) {

  /*
    *************************************DECLARE FUNCTIONS FOR NG-SHOW********************************
  */

  $scope.allFalse = function() {
    $scope.teacherHomeView = false;
    $scope.profileView = false;
    $scope.settingsView = false;
    $scope.classStudentsView = false;
    $scope.classTeamsView = false;
    $scope.rulesView = false;
    $scope.itemsView = false;
    $scope.achievementsView = false;
    $scope.missionsView = false;
    $scope.rewardShopView = false;
  }

  $scope.teacherHomeForm = function(){
    $scope.allFalse();
    $scope.teacherHomeView = true;
  }

  $scope.profileForm = function(){
    $scope.allFalse();
    $scope.profileView = true;
    $scope.clearFormTeacherProfile();
  }

  $scope.settingsForm = function(){
    $scope.allFalse();
    $scope.settingsView = true;
  }

  $scope.classForm = function(){
    $scope.allFalse();
    $scope.classStudentsView = true;
  }

  $scope.teamsForm = function(){
    $scope.allFalse();
    $scope.classTeamsView = true;
  }

  $scope.rulesForm = function() {
    $scope.allFalse();
    $scope.rulesView = true;
  }

  $scope.itemsForm = function() {
    $scope.allFalse();
    $scope.itemsView = true;
    $scope.clearFormEditItem();
  }

  $scope.achievementsForm = function() {
    $scope.allFalse();
    $scope.achievementsView = true;
    $scope.clearFormEditAchievement();
  }

  $scope.missionsForm = function() {
    $scope.allFalse();
    $scope.missionsView = true;
  }

  $scope.rewardShopForm = function() {
    $scope.allFalse();
    $scope.rewardShopView = true;
  }

  $scope.teacherHomeForm();

  $scope.loginTypeSelectItem=true;
  $scope.loginTypeSelectStudent=false;

  $scope.selectItemForm = function() {
    $scope.loginTypeSelectItem=true;
    $scope.loginTypeSelectStudent=false;
  }

  $scope.selectStudentForm = function() {
    $scope.loginTypeSelectItem=false;
    $scope.loginTypeSelectStudent=true;
  }

  /*
    *************************************EVERY ACTIONSHEET GOES HERE*******************************
  */

                                        /* TEACHERHOME ACTIONSHEET */

  $scope.showActionsheetTeacherHome = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES TEACHERHOME',
      buttons: [
        { text: 'ARCHIVAR CLASES' },
        { text: 'DUPLICAR CLASES' },
        { text: 'COPIA DE SEGURIDAD' },
      ],
      destructiveText: 'BORRAR CLASE(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //ARCHIVE CLASSES ACTION
        } else if (index === 1) {
          //DUPLICATE CLASSES ACTION
        } else if (index === 2) {
          //BACKUP ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE CLASSROOMS ACTION
        return true;
      }
    });
  };

                                          /* CLASS STUDENTS ACTIONSHEET */

  $scope.showActionsheetClassStudents = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES CLASS STUDENTS',
      buttons: [
        { text: 'TOMAR ASISTENCIA' },
        { text: 'EVALUAR ESTUDIANTE(S)' },
        { text: 'ENVIAR MENSAJE' },
      ],
      destructiveText: 'BORRAR ESTUDIANTE(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //TAKE ATTENDANCE ACTION
          $scope.showAttendanceModal();
        } else if (index === 1) {
          //EVALUATE STUDENTS ACTION
          $scope.showSelectStudentsModal();
        } else if (index === 2) {
          //SEND MESSAGE ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE STUDENTS ACTION
        return true;
      }
    });
  };

                                          /* CLASS TEAMS ACTIONSHEET */

  $scope.showActionsheetClassTeams = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES CLASS TEAMS',
      buttons: [
        { text: 'TOMAR ASISTENCIA' },
        { text: 'EVALUAR EQUIPO(S)' },
        { text: 'DUPLICAR EQUIPO(S)' },
        { text: 'ENVIAR MENSAJE' },
      ],
      destructiveText: 'BORRAR EQUIPO(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //TAKE ATTENDANCE ACTION
        } else if (index === 1) {
          //EVALUATE TEAMS ACTION
        } else if (index === 2) {
          //DUPLICATE TEAMS ACTION
        } else if (index === 3) {
          //SEND MESSAGE ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE TEAMS ACTION
        return true;
      }
    });
  };

                                          /* ITEMS ACTIONSHEET */

  $scope.showActionsheetItems = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES ITEMS',
      buttons: [
        { text: 'DUPLICAR ITEM(S)' },
      ],
      destructiveText: 'BORRAR ITEM(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //DUPLICATE ITEMS ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE ITEMS ACTION
        return true;
      }
    });
  };

                                          /* ACHIEVEMENT ACTIONSHEET */

  $scope.showActionsheetAchievements = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES LOGROS',
      buttons: [
        { text: 'DUPLICAR LOGRO(S)' },
      ],
      destructiveText: 'BORRAR LOGRO(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //DUPLICATE ACHIEVEMENT ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE ACHIEVEMENT ACTION
        return true;
      }
    });
  };

                                          /* MISSIONS ACTIONSHEET */

  $scope.showActionsheetMissions = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES MISIONES',
      buttons: [
        { text: 'DUPLICAR MISION(S)' },
      ],
      destructiveText: 'BORRAR MISION(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //DUPLICATE MISSION ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE MISSION ACTION
        return true;
      }
    });
  };

                                          /* REWARDS ACTIONSHEET */

  $scope.showActionsheetRewards = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES RECOMPENSAS',
      buttons: [
        { text: 'DUPLICAR RECOMPENSA(S)' },
      ],
      destructiveText: 'BORRAR RECOMPENSA(S)',
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //DUPLICATE REWARD ACTION
        }

        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE REWARD ACTION
        return true;
      }
    });
  };

                                          /* REWARDS (STUDENT PART) ACTIONSHEET */

  $scope.showActionsheetRewardsStudent = function() {
    
    $ionicActionSheet.show({
      titleText: 'ACCIONES RECOMPENSAS',
      buttons: [
        { text: 'COMPRAR SELECCIONADO(S)' },
      ],
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //BUY SELECTED REWARDS ACTION
        }

        return true;
      }
    });
  };

  /*
    *************************************SAVE EVERY POPOVER INTO $SCOPE*******************************
  */

  $scope.templateLanguagesPopover = '<ion-popover-view>'+
    '<div ng-controller="changeLanguageCtrl">'+
      '<ion-list class="list-elements">'+
        '<ion-item ng-click="changeLanguage(\'es\'); closePopoverLanguages()">{{ \'BUTTON_LANG_ES\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'en\'); closePopoverLanguages()">{{ \'BUTTON_LANG_EN\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'it\'); closePopoverLanguages()">{{ \'BUTTON_LANG_IT\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'tr\'); closePopoverLanguages()">{{ \'BUTTON_LANG_TR\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'de\'); closePopoverLanguages()">{{ \'BUTTON_LANG_DE\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'hu\'); closePopoverLanguages()">{{ \'BUTTON_LANG_HU\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'ru\'); closePopoverLanguages()">{{ \'BUTTON_LANG_RU\' | translate }}</ion-item>'+
      '</ion-list>'+
    '</div>'+
  '</ion-popover-view>';

  $scope.templateTeacherHomePopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item>IMPORTAR</ion-item>'+
      '<ion-item>EXPORTAR</ion-item>'+
      '<ion-item>VER ARCHIVADAS</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverTeacherHome()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  $scope.templateClassStudentsPopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="closePopoverClassStudents()()">IMPORTAR</ion-item>'+
      '<ion-item ng-click="closePopoverClassStudents()()">EXPORTAR</ion-item>'+
      '<ion-item class="item item-input item-select">'+
        '<div class="input-label">VISTA DE ALUMNOS'+
        '</div>'+
        '<select>'+
          '<option selected>AVATAR</option>'+
          '<option>IMAGEN</option>'+
        '</select>'+
      '</ion-item>'+
      '<ion-item class="item item-toggle">NOTIFICACIONES'+
        '<label class="toggle toggle-assertive">'+
          '<input type="checkbox">'+
          '<div class="track"><div class="handle"></div></div>'+
        '</label>'+
      '</ion-item>'+
      '<ion-item class="item item-toggle">APERTURA'+
        '<label class="toggle toggle-assertive">'+
          '<input type="checkbox">'+
          '<div class="track"><div class="handle"></div></div>'+
        '</label>'+
      '</ion-item>'+
      '<ion-item ng-click="closePopoverClassStudents()">VER HASHCODE DE LA CLASE</ion-item>'+
      '<ion-item ng-click="rulesForm(); closePopoverClassStudents()">VER REGLAS</ion-item>'+
      '<ion-item ng-click="rewardShopForm(); closePopoverClassStudents()">VER TIENDA DE CLASE</ion-item>'+
      '<ion-item ng-click="missionsForm(); closePopoverClassStudents()">VER MISIONES</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverClassStudents()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  $scope.templateClassTeamsPopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="closePopoverClassTeams()">IMPORTAR</ion-item>'+
      '<ion-item ng-click="closePopoverClassTeams()">EXPORTAR</ion-item>'+
      '<ion-item class="item item-toggle">NOTIFICACIONES'+
        '<label class="toggle toggle-assertive">'+
          '<input type="checkbox">'+
          '<div class="track"><div class="handle"></div></div>'+
        '</label>'+
      '</ion-item>'+
      '<ion-item ng-click="closePopoverClassTeams()">VER HASHCODES</ion-item>'+
      '<ion-item ng-click="rulesForm(); closePopoverClassTeams()">VER REGLAS</ion-item>'+
      '<ion-item ng-click="rewardShopForm(); closePopoverClassTeams()">VER TIENDA DE CLASE</ion-item>'+
      '<ion-item ng-click="missionsForm(); closePopoverClassTeams()">VER MISIONES</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverClassTeams()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  $scope.templateTeacherDefaultPopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="closePopoverTeacherDefault()">IMPORTAR</ion-item>'+
      '<ion-item ng-click="closePopoverTeacherDefault()">EXPORTAR</ion-item>'+
      '<ion-item ng-click="rulesForm(); closePopoverTeacherDefault()">VER REGLAS</ion-item>'+
      '<ion-item ng-click="rewardShopForm(); closePopoverTeacherDefault()">VER TIENDA DE CLASE</ion-item>'+
      '<ion-item ng-click="missionsForm(); closePopoverTeacherDefault()">VER MISIONES</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverTeacherDefault()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  /*
    *************************************EVERY POPOVER FUNCTION GOES HERE*******************************
  */

                                        /* LANGUAGES POPOVER */

  $scope.popoverLanguages = $ionicPopover.fromTemplate($scope.templateLanguagesPopover, {
    scope: $scope
  });

  $scope.openPopoverLanguages = function($event) {
    $scope.popoverLanguages.show($event);
  };
  $scope.closePopoverLanguages = function() {
    $scope.popoverLanguages.hide();
  }
  $scope.$on('$destroy', function() {
    $scope.popoverLanguages.remove();
  });
  $scope.$on('popoverLanguages.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverLanguages.removed', function() {
    // Execute action
  });

                                        /* TEACHERHOME POPOVER */

  $scope.popoverTeacherHome = $ionicPopover.fromTemplate($scope.templateTeacherHomePopover, {
    scope: $scope
  });

  $scope.openPopoverTeacherHome = function($event) {
    $scope.popoverTeacherHome.show($event);
  };
  $scope.closePopoverTeacherHome = function() {
    $scope.popoverTeacherHome.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverTeacherHome.remove();
  });
  $scope.$on('popoverTeacherHome.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverTeacherHome.removed', function() {
    // Execute action
  });

                                        /* CLASS STUDENTS POPOVER */

  $scope.popoverClassStudents = $ionicPopover.fromTemplate($scope.templateClassStudentsPopover, {
    scope: $scope
  });

  $scope.openPopoverClassStudents = function($event) {
    $scope.popoverClassStudents.show($event);
  };
  $scope.closePopoverClassStudents = function() {
    $scope.popoverClassStudents.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverClassStudents.remove();
  });
  $scope.$on('popoverClassStudents.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverClassStudents.removed', function() {
    // Execute action
  });

                                        /* CLASS TEAMS POPOVER */

  $scope.popoverClassTeams = $ionicPopover.fromTemplate($scope.templateClassTeamsPopover, {
    scope: $scope
  });

  $scope.openPopoverClassTeams = function($event) {
    $scope.popoverClassTeams.show($event);
  };
  $scope.closePopoverClassTeams = function() {
    $scope.popoverClassTeams.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverClassTeams.remove();
  });
  $scope.$on('popoverClassTeams.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverClassTeams.removed', function() {
    // Execute action
  });

                                        /* DEFAULT POPOVER */

  $scope.popoverteacherDefault = $ionicPopover.fromTemplate($scope.templateTeacherDefaultPopover, {
    scope: $scope
  });

  $scope.openPopoverTeacherDefault = function($event) {
    $scope.popoverteacherDefault.show($event);
  };
  $scope.closePopoverTeacherDefault = function() {
    $scope.popoverteacherDefault.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverteacherDefault.remove();
  });
  $scope.$on('popoverteacherDefault.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverteacherDefault.removed', function() {
    // Execute action
  });

                                        /* DEFAULT POPOVER */

  $scope.popoverDefault = $ionicPopover.fromTemplate($scope.templateTeacherDefaultPopover, {
    scope: $scope
  });

  $scope.openPopoverDefault = function($event) {
    $scope.popoverDefault.show($event);
  };
  $scope.closePopoverDefault = function() {
    $scope.popoverDefault.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverDefault.remove();
  });
  $scope.$on('popoverDefault.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverDefault.removed', function() {
    // Execute action
  });

  /*
    *************************************SAVE EVERY MODAL INTO $SCOPE*******************************
  */

  $scope.attendanceModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">{{classroomName}}</h3>'+
      '<input class="dateInput" type="text" value="{{date | date:\'dd-MM-yyyy\'}}" readonly />'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkStudent" class="list-student" ng-repeat="student in students" ng-checked="student.inClass" ng-click="inClass(student)">{{student.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="attendance-button123" ng-click="getSelectedStudents(); editStudentsAttendance(); closeAttendanceModal()" id="attendance-btn123" class="button button-calm  button-block">{{ \'SET_ATTENDANCE_FOR_TODAY\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectStudentsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">{{classroomName}}</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox  ng-if="student.inClass" id="attendance-checkbox2" name="checkStudent" class="list-student" ng-repeat="student in studentsEvaluation" ng-checked="student.inClass">{{student.name}}{{student.surname}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="attendance-button123" ng-click="getItemsForSelection(); showSelectItemsModal(); closeSelectStudentsModal()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR ALUMNOS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectItemsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkItem" class="list-student" ng-repeat="item in itemsForSelection" ng-click="changeSelectItem(item)" ng-checked="item.selected">{{item.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="attendance-button123" ng-click="closeSelectItemsModal()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR ITEMS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newClassModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_CLASS\' | translate }}</h3>'+
      '<form id="dataClassForm" class="list">'+
        '<label class="item item-input">'+
          '<span class="input-label">{{ \'CLASS_NAME\' | translate }}</span>'+
          '<input type="text" placeholder="" ng-model="className">'+
        "</label>"+
      "</form>"+
      "<div>"+
        '<form class="list">'+
          '<label class="item item-input item-select">'+
            '<span class="input-label">{{ \'IMPORT_PREFERENCES_FROM\' | translate }}</span>'+
            '<select id="selectClass">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
              '<option>{classroom.name}</option>'+
            '</select>'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewClass()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-click="createClassroom(className) ; closeModalNewClass()">{{ \'CREATE\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.secondaryMenuModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'ASSIGN_STUDENT_TO_TEAM\' | translate }}</h3>'+
      '<form class="list">'+
        '<label class="item item-input item-select">'+
          '<span class="input-label">{{ \'SELECT\' | translate }}</span>'+
          '<select id="selectTeam">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
          '</select>'+
        '</label>'+
        '<h3>{{ \'COPY_STUDENT_TO_ANOTHER_CLASS\' | translate }}</h3>'+
        '<label class="item item-input item-select">'+
          '<span class="input-label">{{ \'SELECT\' | translate }}</span>'+
          '<select id="selectCopy">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
              '<option ng-repat="class in classrooms">{{classroom.name}}</option>'+
          '</select>'+
        '</label>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalSecondary()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalSecondary()">{{ \'ACCEPT\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
      '</ion-modal-view>';

  $scope.studentDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h2>{studentName} {studentSurname}</h2>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'VIEW_PROFILE\' | translate }}</button>'+
        '<button ng-click="closeModalStudentDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
      '<div class="list-student list-elements">'+
        '<ion-list>'+
          '<ion-item class="list-student-dialog">'+
            '<i class="icon ion-clipboard"></i>&nbsp;&nbsp;{{ \'ATTENDANCE\' | translate }}'+
            '<span class="item-note">{??}%</span>'+
            '<ion-option-button class="button-assertive">'+
              '<i class="icon ion-minus-round"></i>'+
            '</ion-option-button>'+
            '<ion-option-button class="button-calm">'+
              '<i class="icon ion-plus-round"></i>'+
            '</ion-option-button>'+
        '</ion-list>'+
        '<button ng-click="showModalSecondary()" class="button button-positive  button-block icon ion-android-more-horizontal"></button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.quantityRandomTeamsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>SELECCIONA CANTIDAD DE QUIPOS A CREAR</h3>'+
	  '<input class="item item-input" id="quantityInput" type="number" ng-model="quantity">'+
	  '<div class="button-bar action_buttons">'+
		'<button class="button button-calm  button-block" ng-click="closeModalQuantityRandomTeams()">{{ \'CANCEL\' | translate }}</button>'+
		'<button class="button button-calm  button-block" ng-click="closeModalQuantityRandomTeams()">{{ \'EDIT_TEAM\' | translate }}</button>'+
	  '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.teamDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{team.name}</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
		'<form id="teamDialogForm">'+
			'<button class="button button-light  button-block button-outline">{{ \'CHANGE_AVATAR\' | translate }}</button>'+
			  '<label class="item item-input list-elements">'+
				'<span class="input-label">{{ \'NAME\' | translate }}</span>'+
				'<input type="text" placeholder="{teamName}" ng-model="name">'+
			  '</label>'+
			  '<label class="item item-input list-elements">'+
				'<span class="input-label">OBJETIVO</span>'+
				'<input type="text" placeholder="{teamObjective}" ng-model="objective">'+
			  '</label>'+
			  '<div class="button-bar action_buttons">'+
				'<button class="button button-calm  button-block" ng-click="closeModalTeamDialog()">{{ \'CANCEL\' | translate }}</button>'+
				'<button class="button button-calm  button-block" ng-disabled="!name && !objective" ng-click="closeModalTeamDialog()">{{ \'EDIT_TEAM\' | translate }}</button>'+
			  '</div>'+
		'</form>'+
      '</div>'+
      '<div class="list-team">'+
        '<ion-list>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '</ion-list>'+
        '<button ng-click="showModalAddStudent()" class="button button-calm  button-block">{{ \'ADD_STUDENTS\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newTeamDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>New Team</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'UPLOAD_AVATAR\' | translate }}</button>'+
        '<form id="newTeamForm" class="list">'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{teamName}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">OBJETIVO</span>'+
            '<input type="text" placeholder="{teamObjective}" ng-model="objective">'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewTeamDialog()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-disabled="!name || !objective" ng-click="closeModalNewTeamDialog()">{{ \'ACCEPT\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="list-team">'+
        '<ion-list>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
          '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '</ion-list>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.addStudentModal = '<ion-modal-view>'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>Add Students</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
      '</ion-list>'+
      '<button ng-click="closeModalAddStudent()" class="button button-calm  button-block">{{ \'ADD_STUDENTS\' | translate }}</button>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newMissionModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_MISSION\' | translate }}</h3>'+
        '<form id="newMissionForm" class="list">'+
          '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{missionName}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">RECOMPENSA</span>'+
            '<input type="text" placeholder="{missionReward}" ng-model="reward">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PUNTOS ADICIONALES (OPCIONAL)</span>'+
            '<input type="text" placeholder="{missionAdditionalPoints}" ng-model="additionalPoints">'+
          '</label>'+
        '</form>'+
      '<h3 id="teams-heading5" class="teams-hdg5">{{ \'ITEMS\' | translate }}</h3>'+
      '<ion-list id="items-list9" class="list-student">'+
        '<ion-item id="items-list-item15">{itemName}</ion-item>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="achievements-button91" class="button button-calm  button-block" ng-click="showSelectItemsModal()">{{ \'ADD_ITEM\' | translate }}</button>'+
      '</div>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewMission()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-disabled="!name || !reward || !additionalPoints" ng-click="closeModalNewMission()">{{ \'ADD_MISSION\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.editMissionModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{missionName}</h3>'+
        '<form id="editMissionForm" class="list">'+
          '<ion-list>'+
            '<label class="item item-input list-elements">'+
              '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
              '<input type="text" placeholder="{missionName}" ng-model="name">'+
            '</label>'+
            '<label class="item item-input list-elements">'+
              '<span class="input-label">RECOMPENSA</span>'+
              '<input type="text" placeholder="{missionReward}" ng-model="reward">'+
            '</label>'+
            '<label class="item item-input list-elements">'+
              '<span class="input-label">PUNTOS ADICIONALES (OPCIONAL)</span>'+
              '<input type="text" placeholder="{missionAdditionalPoints}" ng-model="additionalPoints">'+
            '</label>'+
          '</ion-list>'+
        '</form>'+
      '<h3 id="teams-heading5" class="teams-hdg5">{{ \'ITEMS\' | translate }}</h3>'+
      '<ion-list id="items-list9" class="list-student">'+
        '<ion-item id="items-list-item15" ng-click="itemsForm(); closeModalEditMission()">{itemName}</ion-item>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="achievements-button91" class="button button-calm button-block" ng-click="showSelectItemsModal()">{{ \'ADD_ITEM\' | translate }}</button>'+
      '</div>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalEditMission()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-disabled="!name && !reward && !additionalPoints" ng-click="closeModalEditMission()">EDITAR MISIÓN</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newItemModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
     '<h3>{{ \'NEW_ITEM\' | translate }}</h3>'+
      '<form id="newItemForm" class="list list-student fullScreen">'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{itemName}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{itemDescription}" ng-model="description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
            '<input type="text" placeholder="{itemRequirements}" ng-model="requirements">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'SCORE\' | translate }}</span>'+
            '<input type="text" placeholder="{itemScore}" ng-model="score">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'MAX_SCORE\' | translate }}</span>'+
            '<input type="text" placeholder="{itemMaxScore}" ng-model="maxPoints">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewItem()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewItem()" ng-disabled="!name || !description || !requirements || !score || !maxPoints">{{ \'ADD_ITEM\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newAchievementModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_ACHIEVEMENT\' | translate }}</h3>'+
      '<form id="newAchievementForm" class="list">'+
        '<ion-list>'+
        '<ion-item class ="teacherAvatar">'+
          '<img src={achievementBadge} class="avatar">'+
        '</ion-item>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
          '<input type="text" placeholder="{achievementName}" ng-model="name">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
          '<input type="text" placeholder="{achievementDescription}" ng-model="description">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
          '<input type="text" placeholder="{achievementRequirements}" ng-model="requirements">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">MÁXIMO NIVEL</span>'+
          '<input type="text" placeholder="{achievementMaxLevel}" ng-model="maxLevel">'+
        '</label>'+
      '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
    '<button class="button button-calm  button-block" ng-click="closeModalNewAchievement()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewAchievement()" ng-disabled="!name || !description || !requirements || !maxLevel">{{ \'ADD_ACHIEVEMENT\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newRewardModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<form id="newRewardForm" class="list">'+
        '<h3>NUEVA RECOMPENSA</h3>'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'DESCRIPTION\' | translate }}" ng-model="description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PERMISO</span>'+
            '<input type="text" placeholder="PERMISO" ng-model="permission">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PRECIO</span>'+
            '<input type="text" placeholder="PRECIO" ng-model="price">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewReward()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewReward()" ng-disabled=" !name || !description || !permission || !price">{{ \'ACCEPT\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.editRewardModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<form id="editRewardForm" class="list">'+
        '<h3>{rewardName}</h3>'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{rewardName}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{rewardDescription}" ng-model="description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PERMISO</span>'+
            '<input type="text" placeholder="{rewardPermission}" ng-model="permission">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PRECIO</span>'+
            '<input type="text" placeholder="{rewardPrice}" ng-model="price">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalEditReward()">{{ \'CANCEL\' | translate }}</button>'+
        ''+
        '<button class="button button-calm  button-block" ng-disabled="!name && !description && !permission && !price" ng-click="closeModalEditReward()">EDITAR RECOMPENSA</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  /*
    *************************************EVERY MODAL FUNCTION GOES HERE*******************************
  */

                                        /* ATTENDANCE MODAL */
  $scope.attendanceModal = $ionicModal.fromTemplate($scope.attendanceModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showAttendanceModal = function(){
    //$scope.classroomName = $cookies.get('classroomName');
    //$scope.getStudents();
    //if ($scope.students.length > 0) {
      $scope.attendanceModal.show();
    //}
    $scope.date = Date.now(); 
  }
    
  $scope.closeAttendanceModal = function(){
    $scope.attendanceModal.hide();
  }

                                        /* SELECT STUDENTS MODAL */
  $scope.selectStudentsModal = $ionicModal.fromTemplate($scope.selectStudentsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showSelectStudentsModal = function(){
    $scope.selectStudentsModal.show();
  }
    
  $scope.closeSelectStudentsModal = function(){
    $scope.selectStudentsModal.hide();
  }

                                        /* SELECT ITEMS MODAL */

  $scope.selectItemsModal = $ionicModal.fromTemplate($scope.selectItemsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showSelectItemsModal = function(){
	  if($scope.newMissionModal.isShown()){
		$scope.newMissionModal.hide();
		modalMissions = 1;
	  }
	  if($scope.editMissionModal.isShown()){
		$scope.editMissionModal.hide();
		modalMissions = 2;
	  }
    $scope.selectItemsModal.show();
  }
    
  $scope.closeSelectItemsModal = function(){
    $scope.selectItemsModal.hide();
	if(modalMissions == 1)
		$scope.newMissionModal.show();
	if(modalMissions == 2)
		$scope.editMissionModal.show();
  }

                                        /* NEW CLASS MODAL */

  $scope.newClassModal = $ionicModal.fromTemplate($scope.newClassModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showModalNewClass = function(){
    $scope.newClassModal.show();  
  }
    
  $scope.closeModalNewClass = function(){
	$scope.clearFormNewClass();
    $scope.newClassModal.hide();
  }

                                        /* SECONDARY MENU MODAL */

  $scope.secondaryMenuModal = $ionicModal.fromTemplate( $scope.secondaryMenuModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalSecondary = function(){
    if ($scope.studentDialogModal.isShown()){
      $scope.studentDialogModal.hide();
      modalFirst = 1;
    }
    if ($scope.newStudentModal.isShown()){
      $scope.newStudentModal.hide();
      modalFirst = 2;
    }
    $scope.secondaryMenuModal.show();  
  }
    
  $scope.closeModalSecondary = function(){
	$scope.clearFormSecundaryModal();
    $scope.secondaryMenuModal.hide();
    if(modalFirst == 1)
      $scope.studentDialogModal.show(); 
    if(modalFirst == 2)
      $scope.newStudentModal.show();
  }

                                        /* STUDENT DIALOG MODAL */

  $scope.studentDialogModal = $ionicModal.fromTemplate($scope.studentDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalStudentDialog = function(){
    $scope.studentDialogModal.show();  
  }
    
  $scope.closeModalStudentDialog = function(){
    $scope.studentDialogModal.hide();
  }
  
                                          /* QUANTITY RANDOM TEAMS MODAL */

  $scope.quantityRandomTeamsModal = $ionicModal.fromTemplate($scope.quantityRandomTeamsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
    
  $scope.showModalQuantityRandomTeams = function(){
    $scope.quantityRandomTeamsModal.show();  
  }
    
  $scope.closeModalQuantityRandomTeams = function(){
	$scope.clearFormQuantityRandomTeams();
    $scope.quantityRandomTeamsModal.hide();
  }

                                        /* TEAM DIALOG MODAL */  

  $scope.teamDialogModal = $ionicModal.fromTemplate($scope.teamDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalTeamDialog = function(){
    $scope.teamDialogModal.show();  
  }
    
  $scope.closeModalTeamDialog = function(){
	$scope.clearFormDialogTeam();
    $scope.teamDialogModal.hide();
  }

                                        /* NEW TEAM DIALOG MODAL */

  $scope.newTeamDialogModal = $ionicModal.fromTemplate($scope.newTeamDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewTeamDialog = function(){
    $scope.newTeamDialogModal.show();  
  }
    
  $scope.closeModalNewTeamDialog = function(){
	$scope.clearFormNewTeam();
    $scope.newTeamDialogModal.hide();
  }

                                        /* ADD STUDENT MODAL */

  $scope.addStudentModal = $ionicModal.fromTemplate($scope.addStudentModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
    
  $scope.showModalAddStudent = function(){
    $scope.addStudentModal.show();  
  }
    
  $scope.closeModalAddStudent = function(){
    $scope.addStudentModal.hide();
  }

                                        /* NEW MISSION MODAL */

  $scope.newMissionModal = $ionicModal.fromTemplate($scope.newMissionModal,  {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewMission = function(){
    $scope.newMissionModal.show();  
  }
    
  $scope.closeModalNewMission = function(){
	$scope.clearFormNewMission();
    $scope.newMissionModal.hide();
  }

                                        /* EDIT MISSION MODAL */

  $scope.editMissionModal = $ionicModal.fromTemplate($scope.editMissionModal,  {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalEditMission = function(){
    $scope.editMissionModal.show();  
  }
    
  $scope.closeModalEditMission = function(){
	$scope.clearFormEditMission();
    $scope.editMissionModal.hide();
  }

                                        /* NEW ITEM MODAL */

  $scope.newItemModal = $ionicModal.fromTemplate($scope.newItemModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewItem = function(){
    $scope.newItemModal.show();  
  }
    
  $scope.closeModalNewItem = function(){
	$scope.clearFormNewItem();
    $scope.newItemModal.hide();
  }

                                        /* NEW ACHIEVEMENT MODAL */

  $scope.newAchievementModal = $ionicModal.fromTemplate($scope.newAchievementModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewAchievement = function(){
    $scope.newAchievementModal.show();  
  }
    
  $scope.closeModalNewAchievement = function(){
	$scope.clearFormNewAchievement();
    $scope.newAchievementModal.hide();
  }

                                       /* NEW REWARD MODAL */
  $scope.newRewardModal = $ionicModal.fromTemplate($scope.newRewardModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewReward = function(){
    $scope.newRewardModal.show();  
  }
    
  $scope.closeModalNewReward = function(){
	$scope.clearFormNewReward();
    $scope.newRewardModal.hide();
  }

                                        /* EDIT REWARD MODAL */

  $scope.editRewardModal = $ionicModal.fromTemplate($scope.editRewardModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalEditReward = function(){
    $scope.editRewardModal.show();  
  }
    
  $scope.closeModalEditReward = function(){
	$scope.clearFormEditReward();
    $scope.editRewardModal.hide();
  }

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */

  $scope.clearFormNewClass = function(){
    var form = document.getElementById("dataClassForm");
    form.reset();
    document.getElementById("selectClass").selectedIndex = 0;
  }

  $scope.clearFormSecundaryModal = function(){
    var selectTeam = document.getElementById("selectTeam").selectedIndex = 0;
    var selectCopy = document.getElementById("selectCopy").selectedIndex = 0;
  }

  $scope.clearFormNewStudent = function(){
    var form = document.getElementById("newStudentForm");
    form.reset();
  }
  
  $scope.clearFormQuantityRandomTeams = function(){
	  var input = document.getElementById("quantityInput");
	  input.value = "";
  }

  $scope.clearFormDialogTeam = function(){
    var form = document.getElementById("teamDialogForm");
    form.reset();
  }
  
  $scope.clearFormNewTeam = function(){
	  var form = document.getElementById("newTeamForm");
	  form.reset();
  }

  $scope.clearFormTeacherProfile  = function(){
    var form = document.getElementById('teacherProfileForm');
    form.reset();
  }

  $scope.clearFormNewMission = function(){
    var form = document.getElementById("newMissionForm");
    form.reset();
  }
  
  $scope.clearFormEditMission = function(){
	  var form = document.getElementById("editMissionForm");
	  form.reset();
  }

  $scope.clearFormNewItem = function(){
    var form = document.getElementById("newItemForm");
    form.reset();
  }
  
  $scope.clearFormEditItem = function(){
	  var form = document.getElementById("editItemForm");
	  form.reset();
  }

  $scope.clearFormNewAchievement = function(){
    var form = document.getElementById("newAchievementForm");
    form.reset();
  }
  
  $scope.clearFormEditAchievement = function(){
	  var form = document.getElementById("editAchievementForm");
	  form.reset();
  }

  $scope.clearFormNewReward = function(){
    var form = document.getElementById("newRewardForm");
    form.reset();
  }
  
  $scope.clearFormEditReward = function(){
	  var form = document.getElementById("editRewardForm");
	  form.reset();
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  if (firebase.auth().currentUser === null) {
    $state.go('login');
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var sessionUser = firebase.auth().currentUser;
      var teachersArray = $firebaseArray(teachersRef);
      teachersArray.$loaded(function() {
        $scope.teacher = teachersArray.$getRecord(sessionUser.uid);
        $scope.getClassrooms();
      })
      console.log($scope.teacher);
    } else {
      
    }
  });

  var modalFirst;
  var modalMissions;

  var rootRef = firebase.database().ref();

  var teachersRef = firebase.database().ref('teachers');
  var studentsRef = firebase.database().ref('students');
  var classroomsRef = firebase.database().ref('classrooms');

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */

                                        /* FUNCTIONS IN SETTINGS */

  $scope.logOut = function() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      $state.go('login');
      $scope.teacherHomeForm();
    }
  }

                                        /* FUNCTIONS IN TEACHER HOME */

  $scope.getClassrooms = function() {
    $scope.classrooms = [];
    var teacherClassroomsRef = firebase.database().ref('teachers/' + $scope.teacher.$id + '/classrooms');
    var classroomKeys = $firebaseArray(teacherClassroomsRef);
    classroomKeys.$loaded(function() {
      for (i = 0 ; i < classroomKeys.length ; i++) {
      var classKey = classroomKeys.$keyAt(i);
      var loopClassroom = firebase.database().ref('classrooms/' + classKey);
      loopClassroom.on('value', function(snapshot) {
        $scope.classrooms.push(snapshot.val());
      });
    }
    });
  }

  $scope.createClassroom = function(name) {
    var classroomsNode = $firebaseArray(classroomsRef);
    classroomsNode.$loaded(function() {
      classroomsNode.$add({
        'name' : name,
        'teacher' : $scope.teacher.$id,
      }).then(function(ref) {
        var id = ref.key;

        var idForClassroomRef = firebase.database().ref('classrooms/' + id + '/id');
        idForClassroomRef.set(id);

        var a = CryptoJS.SHA1(id + Date.now().toString()).toString();
        var hash = a.substr(0, 10).toUpperCase();
        var hashCodeForClassroomRef = firebase.database().ref('classrooms/' + id + '/hashcode');
        hashCodeForClassroomRef.set(hash);

        var hashCodeRef = firebase.database().ref('hashcodes/' + hash + '/' + id);
        hashCodeRef.set(true);

        var newteacherClassroomRef = firebase.database().ref('teachers/' + $scope.teacher.$id + '/classrooms/' + id);
        newteacherClassroomRef.set(true);

        $scope.getClassrooms();
      });  
    });
  }

  /*SAMU**************************************************************************/
  $scope.students = [
     {
      name: "Adolfo",
      surname: "A",
      inClass: "true"
    },
    {
      name: "Rodolfo",
      surname: "B",
      inClass: "true"
    },
    {
      name: "Hitler",
      surname: "C",
      inClass: "true"
    }
  ];
  $scope.studentsEvaluation=$scope.students;
  $scope.items = [
     {
      name: "Item1",
      defaultPoints: 4
    },
    {
      name: "Item2",
      defaultPoints: 5
    },
    {
      name: "Item3",
      defaultPoints: 8
    }
  ];
  $scope.itemsForSelection = $scope.items;

  $scope.inClass = function (student) {
      var pos = $scope.students.indexOf(student);
      if ($scope.students[pos].inClass === false) {
        $scope.students[pos].inClass = true;
      } else {
        $scope.students[pos].inClass = false;
      }
}
$scope.getSelectedStudents = function(){
  $scope.studentsEvaluation=[];
  for (var i = 0; i < $scope.students.length; i++) {
      if($scope.students[i].inClass){
          $scope.studentsEvaluation.push($scope.students[i]);
      }
      
  }
}

$scope.getItemsForSelection = function(){
  $scope.itemsForSelection=[];
  for (var i = 0; i < $scope.items.length; i++) {
      $scope.items[i].selected = true;
      $scope.itemsForSelection.push($scope.items[i]);
      
      
  }
} 

$scope.changeSelectItem = function(item){
    var pos = $scope.itemsForSelection.indexOf(item);
      if ($scope.itemsForSelection[pos].selected === false) {
        $scope.itemsForSelection[pos].selected = true;
      } else {
        $scope.itemsForSelection[pos].selected = false;
      }
}

$scope.itemsSelected = function(){
    for (var i = 0; i < $scope.studentsEvaluation.length; i++){
        for (var j = 0; j < $scope.itemsForSelection.length; j++){
            //EVALUATION ACTION HERE
        }
    }
}
  /*FIN_SAMU******************************************************************************/




                                        /* FUNCTIONS IN TEACHER PROFILE */


                                        /* FUNCTIONS IN CLASS */


                                        /* FUNCTIONS IN ITEMS */


}])



//                                  []
//                                  []
//                                  []
//                                  []
//                        [][][][][][][][][][][]
//                                  []
//                                  []
//                                  []
//                                  []
//                                  []



.controller('studentHomeCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicModal', '$ionicPopover',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, $ionicModal, $ionicPopover) {

  /*
    *************************************DECLARE FUNCTIONS FOR NG-SHOW********************************
  */

  $scope.allFalse = function() {
    $scope.studentHomeView = false;
    $scope.settingsView = false;
    $scope.classView = false;
    $scope.rulesItemsView = false;
    $scope.rulesAchievementsView = false;
    $scope.rewardShopView = false;
    $scope.missionsView = false;
  }

  $scope.studentHomeForm = function(){
    $scope.allFalse();
    $scope.studentHomeView = true;
  }

  $scope.settingsForm = function() {
    $scope.allFalse();
    $scope.settingsView = true;
    $scope.clearStudentProfileForm();
  }

  $scope.rulesItemsForm = function(){
    $scope.allFalse();
    $scope.rulesItemsView = true;
  }

  $scope.rulesAchievementsForm = function() {
    $scope.allFalse();
    $scope.rulesAchievementsView = true;
  }

  $scope.rewardShopForm = function() {
    $scope.allFalse();
    $scope.rewardShopView = true;
  }

  $scope.missionsForm = function() {
    $scope.allFalse();
    $scope.missionsView = true;
  }

  $scope.studentHomeForm();

  /*
    *************************************SAVE EVERY POPOVER INTO $SCOPE*******************************
  */

  $scope.templateLanguagesPopover = '<ion-popover-view>'+
    '<div ng-controller="changeLanguageCtrl">'+
      '<ion-list class="list-elements">'+
        '<ion-item ng-click="changeLanguage(\'es\'); closePopoverLanguages()">{{ \'BUTTON_LANG_ES\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'en\'); closePopoverLanguages()">{{ \'BUTTON_LANG_EN\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'it\'); closePopoverLanguages()">{{ \'BUTTON_LANG_IT\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'tr\'); closePopoverLanguages()">{{ \'BUTTON_LANG_TR\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'de\'); closePopoverLanguages()">{{ \'BUTTON_LANG_DE\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'hu\'); closePopoverLanguages()">{{ \'BUTTON_LANG_HU\' | translate }}</ion-item>'+
        '<ion-item ng-click="changeLanguage(\'ru\'); closePopoverLanguages()">{{ \'BUTTON_LANG_RU\' | translate }}</ion-item>'+
      '</ion-list>'+
    '</div>'+
  '</ion-popover-view>';

  $scope.templateStudentHomePopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="closePopoverStudentHome()">VER ARCHIVADAS</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverStudentHome()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  $scope.templateMissionsPopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="closePopoverMissions()">VER FINALIZADAS</ion-item>'+
      '<ion-item ng-click="rulesItemsForm(); closePopoverMissions()">VER REGLAS</ion-item>'+
      '<ion-item ng-click="rewardShopForm(); closePopoverMissions()">VER TIENDA DE CLASE</ion-item>'+
      '<ion-item ng-click="missionsForm(); closePopoverMissions()">VER MISIONES</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverMissions()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  $scope.templateStudentDefaultPopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-click="rulesItemsForm(); closePopoverStudentDefault()">VER REGLAS</ion-item>'+
      '<ion-item ng-click="rewardShopForm(); closePopoverStudentDefault()">VER TIENDA DE CLASE</ion-item>'+
      '<ion-item ng-click="missionsForm(); closePopoverStudentDefault()">VER MISIONES</ion-item>'+
      '<ion-item ng-click="settingsForm(); closePopoverStudentDefault()">{{ \'SETTINGS\' | translate }}</ion-item>'+
    '</ion-list>'+
  '</ion-popover-view>';

  /*
    *************************************EVERY POPOVER FUNCTION GOES HERE*******************************
  */

                                        /* LANGUAGES POPOVER */

  $scope.popoverLanguages = $ionicPopover.fromTemplate($scope.templateLanguagesPopover, {
    scope: $scope
  });

  $scope.openPopoverLanguages = function($event) {
    $scope.popoverLanguages.show($event);
  };
  $scope.closePopoverLanguages = function() {
    $scope.popoverLanguages.hide();
  }
  $scope.$on('$destroy', function() {
    $scope.popoverLanguages.remove();
  });
  $scope.$on('popoverLanguages.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverLanguages.removed', function() {
    // Execute action
  });

                                        /* STUDENTHOME POPOVER */

  $scope.popoverStudentHome = $ionicPopover.fromTemplate($scope.templateStudentHomePopover, {
    scope: $scope
  });

  $scope.openPopoverStudentHome = function($event) {
    $scope.popoverStudentHome.show($event);
  };
  $scope.closePopoverStudentHome = function() {
    $scope.popoverStudentHome.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverStudentHome.remove();
  });
  $scope.$on('popoverStudentHome.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverStudentHome.removed', function() {
    // Execute action
  });

                                        /* MISSIONS POPOVER */

  $scope.popoverMissions = $ionicPopover.fromTemplate($scope.templateMissionsPopover, {
    scope: $scope
  });

  $scope.openPopoverMissions = function($event) {
    $scope.popoverMissions.show($event);
  };
  $scope.closePopoverMissions = function() {
    $scope.popoverMissions.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverMissions.remove();
  });
  $scope.$on('popoverMissions.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverMissions.removed', function() {
    // Execute action
  });

                                        /* DEFAULT POPOVER */

  $scope.popoverDefault = $ionicPopover.fromTemplate($scope.templateStudentDefaultPopover, {
    scope: $scope
  });

  $scope.openPopoverStudentDefault = function($event) {
    $scope.popoverDefault.show($event);
  };
  $scope.closePopoverStudentDefault = function() {
    $scope.popoverDefault.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.popoverDefault.remove();
  });
  $scope.$on('popoverDefault.hidden', function() {
    // Execute action
  });
  $scope.$on('popoverDefault.removed', function() {
    // Execute action
  });

  /*
    *************************************SAVE EVERY MODAL INTO $SCOPE*******************************
  */

  $scope.addClassModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">INTRODUCE UN CODIGO DE CLASE</h3>'+
      '<form id="addClassHashCodeForm" class="list">'+
        '<label class="item item-input">'+
          '<input type="text" ng-model="hashCode" placeholder="CODIGO DE CLASE">'+
        '</label>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalAddClass() ; clearHashcodeForm()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-disabled="!hashCode" ng-click="closeModalAddClass() ; clearHashcodeForm()">AÑADIR CLASE</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.itemDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{itemName}</h3>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'DESCRIPTION\' | translate }}'+
          '<p>{itemDescription}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'REQUIREMENTS\' | translate }}'+
          '<p>{itemRequirements}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'MAX_SCORE\' | translate }}'+
          '<p>{itemMaxScore}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'SCORE\' | translate }}'+
          '<p>{itemScore}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;USAR PARA NIVEL'+
          '<label class="toggle toggle-assertive">'+
            '<input type="checkbox" onclick="return false;">'+
            '<div class="track"><div class="handle"></div></div>'+
          '</label>'+
        '</span>'+
      '</label>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalItemDialog()" class="button button-positive button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
    '<ion-content>'+
  '</ion-modal-view>';

  $scope.achievementDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{achievementName}</h3>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'DESCRIPTION\' | translate }}'+
          '<p>{achievementDescription}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'REQUIREMENTS\' | translate }}'+
          '<p>{achievementRequirements}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements" id="signUp-input3">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;MAXIMO NIVEL'+
          '<p>{achievementMaxLevel}</p>'+
        '</span>'+
      '</label>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalAchievementDialog()" class="button button-positive button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
    '<ion-content>'+
  '</ion-modal-view>';

  $scope.missionDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{missionName}</h3>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;RECOMPENSA'+
          '<p>{missionReward}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PUNTOS ADICIONALES'+
          '<p>{missionAdditionalPoints}</p>'+
        '</span>'+
      '</label>'+
      '<h3 id="teams-heading5" class="teams-hdg5">{{ \'ITEMS\' | translate }}</h3>'+
      '<ion-list id="items-list9" class="list-student">'+
        '<ion-item id="items-list-item15" ng-click="showModalItemDialog()">{itemName}</ion-item>'+
      '</ion-list>'+
      
      '<div class="list-student">'+
        '<button ng-click="closeModalMissionDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
      '</div>'+

    '<ion-content>'+
  '</ion-modal-view>';

  $scope.rewardDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{rewardName}</h3>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'DESCRIPTION\' | translate }}'+
          '<p>{rewardDescription}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PERMISO'+
          '<p>{rewardPermission}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PRECIO'+
          '<p>{rewardPrice}</p>'+
        '</span>'+
      '</label>'+
      '<div class="list-student">'+
        '<button ng-click="closeModalRewardDialog()" class="button button-positive button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
    '<ion-content>'+
  '</ion-modal-view>';

  /*
    *************************************EVERY MODAL FUNCTION GOES HERE*******************************
  */

                                        /* STUDENT DIALOG MODAL */

  $scope.addClassModal = $ionicModal.fromTemplate($scope.addClassModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalAddClass = function(){
    $scope.addClassModal.show();  
  }
    
  $scope.closeModalAddClass = function(){
    $scope.addClassModal.hide();
  }

                                        /* ITEM DIALOG MODAL */

  $scope.itemDialogModal = $ionicModal.fromTemplate($scope.itemDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalItemDialog = function(){
	  if($scope.missionDialogModal.isShown()){
		  $scope.missionDialogModal.hide();
		  itemModal = 1;
	  }
    $scope.itemDialogModal.show();  
  }
    
  $scope.closeModalItemDialog = function(){
	  if(itemModal == 1){
		  $scope.missionDialogModal.show();
		  itemModal = 0;
	  }
    $scope.itemDialogModal.hide();
  }

                                        /* ACHIEVEMENT DIALOG MODAL */

  $scope.achievementDialogModal = $ionicModal.fromTemplate($scope.achievementDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalAchievementDialog = function(){
    $scope.achievementDialogModal.show();  
  }
    
  $scope.closeModalAchievementDialog = function(){
    $scope.achievementDialogModal.hide();
  }

                                        /* MISSION DIALOG MODAL */

  $scope.missionDialogModal = $ionicModal.fromTemplate($scope.missionDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalMissionDialog = function(){
    $scope.missionDialogModal.show();  
  }
    
  $scope.closeModalMissionDialog = function(){
    $scope.missionDialogModal.hide();
  }

                                        /* REWARD DIALOG MODAL */

  $scope.rewardDialogModal = $ionicModal.fromTemplate($scope.rewardDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalRewardDialog = function(){
    $scope.rewardDialogModal.show();  
  }
    
  $scope.closeModalRewardDialog = function(){
    $scope.rewardDialogModal.hide();
  }

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */

  $scope.clearForm  = function(){
    var form = document.getElementById('studentHome-form1');
    form.reset();
    $state.go('studentHome', {"studentFullName": $scope.studentName + $scope.studentSurname});
  }
  
  $scope.clearHashcodeForm = function(){
	  var form = document.getElementById("addClassHashCodeForm");
	  form.reset();
  }
  
  $scope.clearStudentProfileForm = function(){
	  var form = document.getElementById("studentProfileForm");
	  form.reset();
  }
  
  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */
  
  var itemModal;

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */

                                        /* FUNCTIONS IN SETTINGS */

  $scope.logOut = function() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      $state.go('login');
      $scope.studentHomeForm();
    }
  }


}])



//                                  []
//                                  []
//                                  []
//                                  []
//                        [][][][][][][][][][][]
//                                  []
//                                  []
//                                  []
//                                  []
//                                  []



.controller('changeLanguageCtrl', ['$translate', '$scope',
  function ($translate, $scope) {
 
      $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
      };

      $scope.$on('changeLanguageEvent', function(event, args) {
        console.log('He llegado al receptor de eventos');
        $scope.changeLanguage(args.language);
      });

}])