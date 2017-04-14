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
    $scope.modelLoginTeacher = {};
    sharedData.setData('teacher');
  }
  $scope.studentForm = function(){
    $scope.loginType=false;
    $scope.loginType2=true;
    $scope.modelLoginStudent = {};
    sharedData.setData('student');
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
            $state.go('teacherHome');
            $scope.modelLoginTeacher = {};
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
            $state.go('studentHome');
            $scope.modelLoginStudent = {};
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

  $scope.clearForm = function() {
    $scope.modelSignUp = {};
    $state.go('login');
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  var signUpType = sharedData.getData();

  if (signUpType != 'teacher' && signUpType != 'student') {
    $state.go('login');
  }

  $scope.modelSignUp = {};

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
              'name' : CryptoJS.AES.encrypt(name, sessionUser.uid).toString(),
              'surname' : CryptoJS.AES.encrypt(surname, sessionUser.uid).toString(),
              'email' : sessionUser.email,
              'school' : school,
              'avatar' : avatar,
            }).then(function() {
              $state.go('teacherHome');
              $scope.modelSignUp = {};
            });
          } else if (signUpType === 'student') { //STUDENT
            var newStudentRef = firebase.database().ref('students/'+sessionUser.uid);
            newStudentRef.set({
              'id' : sessionUser.uid,
              'name' : CryptoJS.AES.encrypt(name, sessionUser.uid).toString(),
              'surname' : CryptoJS.AES.encrypt(surname, sessionUser.uid).toString(),
              'email' : sessionUser.email,
              'school' : school,
              'avatar' : avatar,
            }).then(function() {
              $state.go('studentHome');
              $scope.modelSignUp = {};
            });
          }
        });
      }
    }).catch(function(error) {
      if (error) {
        switch (error.code) {
			case "auth/weak-password":
				alert("LA CONTRASEÑA DEBE SER DE AL MENOS 6 CARACTERES");
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



.controller('teacherHomeCtrl', ['$scope', '$stateParams', '$ionicModal', '$http', '$state', '$ionicPopover', '$ionicActionSheet', '$firebaseObject', '$firebaseArray', '$ionicPopup', 'sharedData', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $http, $state, $ionicPopover, $ionicActionSheet, $firebaseObject, $firebaseArray, $ionicPopup, sharedData) {

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
    $scope.archivedClassroomsToShow = false;
  }

  $scope.teacherHomeForm = function(){
    $scope.allFalse();
    $scope.teacherHomeView = true;
  }

  $scope.profileForm = function(){
    $scope.allFalse();
    $scope.modelProfile = {};
    $scope.profileView = true;
    if($scope.teacher.name.length > 32){
      $scope.teacher.name = CryptoJS.AES.decrypt($scope.teacher.name, sessionUser.uid).toString(CryptoJS.enc.Utf8);
      $scope.teacher.surname = CryptoJS.AES.decrypt($scope.teacher.surname, sessionUser.uid).toString(CryptoJS.enc.Utf8);
    }
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
    $scope.modelItem = {};
    $scope.itemsView = true;
  }

  $scope.achievementsForm = function() {
    $scope.allFalse();
    $scope.modelAchievement = {};
    $scope.achievementsView = true;
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
        { text: 'DESARCHIVAR CLASES' },
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
          $scope.actionSheetTeacherHomeType = 'archive';
          $scope.toShow = true;
          $scope.showSelectClassroomsModal();
        } else if (index === 1) {
          //UNARCHIVE CLASSES ACTION
          $scope.actionSheetTeacherHomeType = 'unArchive';
          $scope.toShow = false;
          $scope.showSelectClassroomsModal();
        } else if (index === 2) {
          //DUPLICATE CLASSES ACTION
          $scope.actionSheetTeacherHomeType = 'duplicate';
          $scope.toShow = true;
          $scope.showSelectClassroomsModal();
        } else if (index === 3) {
          //BACKUP ACTION
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE CLASSROOMS 
        $scope.actionSheetTeacherHomeType = 'delete';
        $scope.toShow = true;
        $scope.showSelectClassroomsModal();
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
          $scope.actionsheetClassStudentsType = 'attendance';
          $scope.showAttendanceModal();
        } else if (index === 1) {
          //EVALUATE STUDENTS ACTION
          $scope.actionsheetClassStudentsType = 'evaluate';
          $scope.showSelectStudentsModal();
        } else if (index === 2) {
          //SEND MESSAGE ACTION
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE STUDENTS ACTION
        $scope.actionsheetClassStudentsType = 'delete';
        $scope.showSelectStudentsModal();
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
          $scope.showAttendanceModal();
        } else if (index === 1) {
          //EVALUATE TEAMS ACTION
          $scope.actionsheetClassTeamsType = 'evaluate';
          $scope.showSelectTeamsModal();
        } else if (index === 2) {
          //DUPLICATE TEAMS ACTION
          $scope.actionsheetClassTeamsType = 'duplicate';
          $scope.showSelectTeamsModal();
        } else if (index === 3) {
          //SEND MESSAGE ACTION
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE TEAMS ACTION
        $scope.actionsheetClassTeamsType = 'delete';
        $scope.showSelectTeamsModal();
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
          $scope.actionSheetItemsType = 'duplicate';
          $scope.showSelectItemsModal();
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE ITEMS ACTION
        $scope.actionSheetItemsType = 'delete';
        $scope.showSelectItemsModal();
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
          $scope.actionSheetAchievementsType = 'duplicate';
          $scope.showSelectAchievementsModal();
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE ACHIEVEMENT ACTION
        $scope.actionSheetAchievementsType = 'delete';
        $scope.showSelectAchievementsModal();
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
          //DUPLICATE REWARDS ACTION
          $scope.actionSheetRewardsType = 'duplicate';
          $scope.showSelectRewardsModal();
        }
        return true;
      },
      destructiveButtonClicked: function() {
        //DELETE REWARD ACTION
        $scope.actionSheetRewardsType = 'delete';
        $scope.showSelectRewardsModal();
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
      '<ion-item ng-hide="archivedClassroomsToShow" ng-click="showArchivedClassrooms(true)">VER ARCHIVADAS</ion-item>'+
      '<ion-item ng-show="archivedClassroomsToShow" ng-click="showArchivedClassrooms(false)">OCULTAR ARCHIVADAS</ion-item>'+
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
      '<ion-toggle ng-model="checkboxNotifications" ng-checked="classroom.notifications" ng-click="setNotifications(checkboxNotifications)" toggle-class="toggle-calm">NOTIFICACIONES</ion-toggle>'+
      '<ion-toggle ng-model="checkboxOpening" ng-checked="classroom.open" ng-click="setOpening(checkboxOpening)" toggle-class="toggle-calm">APERTURA</ion-toggle>'+
      '<ion-item ng-click="showHashcodePopup()">VER HASHCODE DE LA CLASE</ion-item>'+
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
      '<ion-toggle ng-model="modelcheckboxotifications" ng-checked="classroom.notifications" ng-click="setNotifications(checkboxNotifications)" toggle-class="toggle-calm">NOTIFICACIONES</ion-toggle>'+
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
        '<button id="attendance-button123" ng-click="selectStudents()" id="attendance-btn123" class="button button-calm  button-block">{{ \'SET_ATTENDANCE_FOR_TODAY\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectClassroomsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA CLASES</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkClassroom" ng-repeat="classForSelection in classroomsForSelection" ng-click="changeSelectedClassroom(classForSelection)" ng-checked="classForSelection.selected" ng-hide="classForSelection.archived === toShow">{{classForSelection.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectClassroomsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectClassrooms()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR CLASES</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectStudentsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">{{classroomName}}</h3>'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA ESTUDIANTES</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkStudent" class="list-student" ng-repeat="studentForSelection in studentsForSelection" ng-click="changeSelectedStudent(studentForSelection)" ng-checked="studentForSelection.selected">{{studentForSelection.name}} {{studentForSelection.surname}}</ion-checkbox>'+  
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectStudentsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectStudents()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR ALUMNOS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectItemsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">{{classroomName}}</h3>'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA ITEMS</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkItem" ng-repeat="itemForSelection in itemsForSelection" ng-click="changeSelectedItem(itemForSelection)" ng-checked="itemForSelection.selected">{{itemForSelection.name}} {{itemForSelection.score}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
      '<button class="button button-calm  button-block" ng-click="closeSelectItemsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectItems()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR ITEMS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectAchievementsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA LOGROS</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkAchievement" ng-repeat="achievementForSelection in achievementsForSelection" ng-click="changeSelectedAchievement(achievementForSelection)" ng-checked="achievementForSelection.selected">{{achievementForSelection.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectAchievementsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectAchievements()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR LOGROS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectTeamsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA EQUIPOS</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkTeam" ng-repeat="teamForSelection in teamsForSelection" ng-click="changeSelectedTeam(teamForSelection)" ng-checked="teamForSelection.selected">{{teamForSelection.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectTeamsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectTeams()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR EQUIPOS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.selectRewardsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA RECOMPENSAS</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkReward" ng-repeat="rewardForSelection in rewardsForSelection" ng-click="changeSelectedReward(rewardForSelection)" ng-checked="rewardForSelection.selected">{{rewardForSelection.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectRewardsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectRewards()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR RECOMPENSAS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newClassModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_CLASS\' | translate }}</h3>'+
      '<form id="dataClassForm" class="list">'+
        '<label class="item item-input">'+
          '<span class="input-label">{{ \'CLASS_NAME\' | translate }}</span>'+
          '<input type="text" placeholder="{{ \'CLASS_NAME\' | translate }}" ng-model="modelNewClass.name">'+
        "</label>"+
      "</form>"+
      "<div>"+
        '<form class="list">'+
          '<label class="item item-input item-select">'+
            '<span class="input-label">{{ \'IMPORT_PREFERENCES_FROM\' | translate }}</span>'+
            '<select id="selectClass">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
              '<option ng-repeat="class in classrooms">{{class.name}}</option>'+
            '</select>'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewClass()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-click="createClassroom(modelNewClass.name) ; closeModalNewClass()">{{ \'CREATE\' | translate }}</button>'+
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

  $scope.newStudentModal = '<ion-modal-view class="fondo">'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_STUDENT\' | translate }}</h3>'+
      '<div class="list-student list-elements">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image"></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'TAKE_PICTURE\' | translate }}</button>'+
        '<form class="list">'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewStudentDialog()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-disabled="!modelNewStudent.name || !modelNewStudent.surname || !modelNewStudent.email || !modelNewStudent.password || modelNewStudent.password != modelNewStudent.passwordRepeat || !modelNewStudent.passwordRepeat" ng-click="createNewStudent(modelNewStudent.name, modelNewStudent.surname, modelNewStudent.email, modelNewStudent.password)">{{ \'GENERATE\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="list-team list-elements">'+
        '<ion-list>'+
          '<form id="newStudentForm" class="list">'+
            '<label class="item item-input list-elements" id="signUp-input3">'+
              '<span class="input-label">'+
                '<i class="icon ion-person"></i>&nbsp;&nbsp;{{ \'NAME\' | translate }}</span>'+
              '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewStudent.name">'+
            '</label>'+
            '<label class="item item-input list-elements" id="signUp-input3">'+
              '<span class="input-label">'+
                '<i class="icon ion-person"></i>&nbsp;&nbsp;{{ \'SURNAME\' | translate }}</span>'+
              '<input type="text" placeholder="{{ \'SURNAME\' | translate }}" ng-model="modelNewStudent.surname">'+
            '</label>'+
            '<label class="item item-input list-elements" id="signUp-input5">'+
              '<span class="input-label">'+
                '<i class="icon ion-at"></i>&nbsp;&nbsp;{{ \'EMAIL\' | translate }}</span>'+
              '<input type="email" placeholder="{{ \'EMAIL\' | translate }}" ng-model="modelNewStudent.email">'+
            '</label>'+
            '<label class="item item-input list-elements" id="signUp-input6">'+
              '<span class="input-label">'+
                '<i class="icon ion-locked"></i>&nbsp;&nbsp;{{ \'PASSWORD\' | translate }}</span>'+
              '<input type="password" placeholder="{{ \'PASSWORD\' | translate }}" ng-model="modelNewStudent.password">'+
            '</label>'+
            '<label class="item item-input list-elements" id="signUp-input7">'+
              '<span class="input-label">'+
                '<i class="icon ion-locked"></i>&nbsp;&nbsp;{{ \'CONFIRM_PASSWORD\' | translate }}</span>'+
                '<input type="password" placeholder="{{ \'CONFIRM_PASSWORD\' | translate }}" ng-model="modelNewStudent.passwordRepeat">'+
            '</label>'+
          '</form>'+
        '</ion-list>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>)';

  $scope.studentDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h2>{{student.name}} {{student.surname}}</h2>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline" ng-click="showModalStudentProfile()">{{ \'VIEW_PROFILE\' | translate }}</button>'+
        '<button ng-click="closeModalStudentDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
      '<div class="list-student list-elements">'+
        '<ion-list>'+
          '<ion-item class="list-student-dialog" ng-repeat="item in studentItems">'+
            '<i class="icon ion-clipboard"></i>&nbsp;&nbsp;{{item.name}}'+
            '<span class="item-note">{{item.points}} / {{item.maxScore}}</span>'+
            '<ion-option-button class="button-assertive" ng-click="removePoints(item)">'+
              '<i class="icon ion-minus-round"></i>'+
            '</ion-option-button>'+
            '<ion-option-button class="button-calm" ng-click="addPoints(item)">'+
              '<i class="icon ion-plus-round"></i>'+
            '</ion-option-button>'+
        '</ion-list>'+
        '<button ng-click="showModalSecondary()" class="button button-positive  button-block icon ion-android-more-horizontal"></button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.studentProfileModal = '<ion-modal-view>'+
    '<ion-content>'+
      '<h3 id="teams-heading5" class="teams-hdg5">'+
        '<a id="teacherHome-dropdown" class="button button-light icon ion-home" ng-click="teacherHomeForm() ; closeModalStudentProfile() ; closeModalStudentDialog()"></a>'+
        '<h2>{{student.name}} {{student.surname}}</h2>'+
      '</h3>'+
      '<form id="studentProfileFormData" class="list">'+
        '<ion-list id="signUp-list2">'+
          '<ion-item class ="teacherAvatar">'+
            '<img src={{student.avatar}} class="avatar">'+
          '</ion-item>'+
          '<label class="item item-input list-elements" id="signUp-input3">'+
            '<span class="inputLabelProfile">'+
              '<i class="icon ion-clipboard"></i>&nbsp;&nbsp;ESCUELA'+
              '<p>{{student.school}}</p>'+
            '</span>'+
          '</label>'+
          '<label class="item item-input list-elements" id="signUp-input5">'+
            '<span class="inputLabelProfile">'+
              '<i class="icon ion-at"></i>&nbsp;&nbsp;{{ \'EMAIL\' | translate }}'+
              '<p>{{student.email}}</p>'+
            '</span>'+
          '</label>'+
          '<button id="signUp-button8" class="button button-positive  button-block icon ion-arrow-return-left" ng-click="closeModalStudentProfile()"></button>'+
        '</ion-list>'+
      '</form>'
    '</ion-content>'+
  '</ion-modal-view>'

  $scope.quantityRandomTeamsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>SELECCIONA CANTIDAD DE QUIPOS A CREAR</h3>'+
	  '<input class="item item-input" id="quantityInput" type="number" ng-model="modelQuantity.quantity">'+
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
        '<div class="teacherAvatar">'+
          '<img src={{team.picture}} class="avatar">'+
        '</div>'+
        '<form id="teamDialogForm">'+
          '<button class="button button-light  button-block button-outline">{{ \'CHANGE_AVATAR\' | translate }}</button>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{{team.name}}" ng-model="modelTeamDialog.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">OBJETIVO</span>'+
            '<input type="text" placeholder="{{team.objective}}" ng-model="modelTeamDialog.objective">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">IMAGEN</span>'+
            '<input type="text" placeholder="{{team.picture}}" ng-model="modelTeamDialog.picture">'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalTeamDialog()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-disabled="!modelTeamDialog.name && !modelTeamDialog.objective && !modelTeamDialog.picture" ng-click="editTeam(modelTeamDialog.name, modelTeamDialog.objective, modelTeamDialog.picture)">{{ \'EDIT_TEAM\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="list-team">'+
        '<ion-list>'+
          '<ion-item class="list-student-team" ng-repeat="teamMember in teamMembers">{{teamMember.name}} {{teamMember.surname}}</ion-item>'+
        '</ion-list>'+
        '<button ng-click="showModalAddStudent()" class="button button-calm  button-block">EDITAR MIEMBROS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newTeamDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>New Team</h3>'+
      '<div class="list-student">'+
        '<button  class="button button-light  button-block button-outline">{{ \'UPLOAD_AVATAR\' | translate }}</button>'+
        '<form id="newTeamForm" class="list">'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewTeamDialog.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">OBJETIVO</span>'+
            '<input type="text" placeholder="OBJETIVO" ng-model="modelNewTeamDialog.objective">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">IMAGEN</span>'+
            '<input type="text" placeholder="IMAGEN" ng-model="modelNewTeamDialog.picture">'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewTeamDialog()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-disabled="!modelNewTeamDialog.name || !modelNewTeamDialog.objective" ng-click="createTeam(modelNewTeamDialog.name, modelNewTeamDialog.objective, modelNewTeamDialog.picture)">{{ \'ACCEPT\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="list-team">'+
        '<ion-list>'+
          '<ion-checkbox class="list-student-team" ng-repeat="studentForTeamSelection in studentsForTeamSelection" ng-checked="studentForTeamSelection.selected" ng-click="changeSelectedStudentForTeam(studentForTeamSelection)">{{studentForTeamSelection.name}} {{studentForTeamSelection.surname}}</ion-checkbox>'+
        '</ion-list>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.addStudentModal = '<ion-modal-view>'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>Add Students</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team" ng-repeat="student in students">{{student.name}}</ion-checkbox>'+
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
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewMission.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">RECOMPENSA</span>'+
            '<input type="text" placeholder="RECOMPENSA" ng-model="modelNewMission.reward">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PUNTOS ADICIONALES (OPCIONAL)</span>'+
            '<input type="text" placeholder="PUNTOS ADICIONALES (OPCIONAL)" ng-model="modelNewMission.additionalPoints">'+
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
        '<button class="button button-calm  button-block" ng-disabled="!modelNewMission.name || !modelNewMission.reward || !modelNewMission.additionalPoints" ng-click="closeModalNewMission()">{{ \'ADD_MISSION\' | translate }}</button>'+
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
              '<input type="text" placeholder="{mission.name}" ng-model="modelEditMission.name">'+
            '</label>'+
            '<label class="item item-input list-elements">'+
              '<span class="input-label">RECOMPENSA</span>'+
              '<input type="text" placeholder="{mission.reward}" ng-model="modelEditMission.reward">'+
            '</label>'+
            '<label class="item item-input list-elements">'+
              '<span class="input-label">PUNTOS ADICIONALES (OPCIONAL)</span>'+
              '<input type="text" placeholder="{mission.additionalPoints}" ng-model="modelEditMission.additionalPoints">'+
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
        '<button class="button button-calm  button-block" ng-disabled="!modelEditMission.name && !modelEditMission.reward && !modelEditMission.additionalPoints" ng-click="closeModalEditMission()">EDITAR MISIÓN</button>'+
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
            '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewItem.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'DESCRIPTION\' | translate }}" ng-model="modelNewItem.description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'REQUIREMENTS\' | translate }}" ng-model="modelNewItem.requirements">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'SCORE\' | translate }}</span>'+
            '<input type="number" placeholder="{{ \'SCORE\' | translate }}" ng-model="modelNewItem.score">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'MAX_SCORE\' | translate }}</span>'+
            '<input type="number" placeholder="{{ \'MAX_SCORE\' | translate }}" ng-model="modelNewItem.maxScore">'+
          '</label>'+
          '<ion-toggle toggle-class="toggle-calm" ng-model="modelNewItem.useForLevel">USAR PARA NIVEL</ion-toggle>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewItem()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="createItem(modelNewItem.name, modelNewItem.description, modelNewItem.requirements, modelNewItem.score, modelNewItem.maxScore, modelNewItem.useForLevel)" ng-disabled="!modelNewItem.name || !modelNewItem.description || !modelNewItem.requirements || !modelNewItem.score || !modelNewItem.maxScore">{{ \'ADD_ITEM\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.newAchievementModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_ACHIEVEMENT\' | translate }}</h3>'+
      '<form id="newAchievementForm" class="list">'+
        '<ion-list>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
          '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewAchievement.name">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
          '<input type="text" placeholder="{{ \'DESCRIPTION\' | translate }}" ng-model="modelNewAchievement.description">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
          '<input type="text" placeholder="{{ \'REQUIREMENTS\' | translate }}" ng-model="modelNewAchievement.requirements">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">PUNTOS NECESARIOS PARA PASAR DE NIVEL</span>'+
          '<input type="number" placeholder="PUNTOS NECESARIOS PARA PASAR DE NIVEL" ng-model="modelNewAchievement.pointsToLevel">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">MÁXIMO NIVEL</span>'+
          '<input type="number" placeholder="MÁXIMO NIVEL" ng-model="modelNewAchievement.maxLevel">'+
        '</label>'+
        '<label class="item item-input list-elements">'+
          '<span class="input-label">MEDALLA</span>'+
          '<input type="number" placeholder="MEDALLA" ng-model="modelNewAchievement.badge">'+
        '</label>'+
      '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewAchievement()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block"  ng-click="createAchievement(modelNewAchievement.name, modelNewAchievement.description, modelNewAchievement.requirements, modelNewAchievement.pointsToLevel, modelNewAchievement.maxLevel, modelNewAchievement.badge)" ng-disabled="!modelNewAchievement.name || !modelNewAchievement.description || !modelNewAchievement.requirements || !modelNewAchievement.pointsToLevel || !modelNewAchievement.maxLevel">{{ \'ADD_ACHIEVEMENT\' | translate }}</button>'+
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
            '<input type="text" placeholder="{{ \'NAME\' | translate }}" ng-model="modelNewReward.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'DESCRIPTION\' | translate }}" ng-model="modelNewReward.description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PERMISO</span>'+
            '<input type="text" placeholder="PERMISO" ng-model="modelNewReward.permission">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PRECIO</span>'+
            '<input type="number" placeholder="PRECIO" ng-model="modelNewReward.price">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewReward()" >{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="createReward(modelNewReward.name, modelNewReward.description, modelNewReward.permission, modelNewReward.price)" ng-disabled=" !modelNewReward.name || !modelNewReward.description || !modelNewReward.permission || !modelNewReward.price">{{ \'ACCEPT\' | translate }}</button>'+
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
            '<input type="text" placeholder="{{reward.name}}" ng-model="modelEditReward.name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{{reward.description}}" ng-model="modelEditReward.description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PERMISO</span>'+
            '<input type="text" placeholder="{{reward.permission}}" ng-model="modelEditReward.permission">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">PRECIO</span>'+
            '<input type="number" placeholder="{{reward.price}}" ng-model="modelEditReward.price">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalEditReward()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-disabled="!modelEditReward.name && !modelEditReward.description && !modelEditReward.permission && !modelEditReward.price" ng-click="editReward(modelEditReward.name, modelEditReward.description, modelEditReward.permission, modelEditReward.price)">EDITAR RECOMPENSA</button>'+
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
    $scope.attendanceModal.show();
    $scope.date = Date.now(); 
  }
  $scope.closeAttendanceModal = function(){
    $scope.attendanceModal.hide();
  }

                                        /* SELECT CLASSROOMS MODAL */

  $scope.selectClassroomsModal = $ionicModal.fromTemplate($scope.selectClassroomsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectClassroomsModal = function(){
    $scope.getClassroomsForSelection();
    $scope.selectClassroomsModal.show();
  }
  $scope.closeSelectClassroomsModal = function(){
    $scope.selectClassroomsModal.hide();
  }

                                        /* SELECT STUDENTS MODAL */

  $scope.selectStudentsModal = $ionicModal.fromTemplate($scope.selectStudentsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectStudentsModal = function(){
    $scope.getStudentsForSelection();
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
    $scope.getItemsForSelection();
    $scope.selectItemsModal.show();
  }
  $scope.closeSelectItemsModal = function(){
    $scope.selectItemsModal.hide();
  	if(modalMissions == 1) {
  		$scope.newMissionModal.show();
    }
  	if(modalMissions == 2) {
  		$scope.editMissionModal.show();
    }
  }

                                        /* SELECT ACHIEVEMENTS MODAL */

  $scope.selectAchievementsModal = $ionicModal.fromTemplate($scope.selectAchievementsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectAchievementsModal = function(){
    $scope.getAchievementsForSelection();
    $scope.selectAchievementsModal.show();
  }
  $scope.closeSelectAchievementsModal = function(){
    $scope.selectAchievementsModal.hide();
  }
  
                                        /* SELECT TEAMS MODAL */

  $scope.selectTeamsModal = $ionicModal.fromTemplate($scope.selectTeamsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectTeamsModal = function(){
    $scope.getTeamsForSelection();
    $scope.selectTeamsModal.show();
  } 
  $scope.closeSelectTeamsModal = function(){
    $scope.selectTeamsModal.hide();
  }

                                        /* SELECT REWARDS MODAL */

  $scope.selectRewardsModal = $ionicModal.fromTemplate($scope.selectRewardsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectRewardsModal = function(){
    $scope.getRewardsForSelection();
    $scope.selectRewardsModal.show();
  }
  $scope.closeSelectRewardsModal = function(){
    $scope.selectRewardsModal.hide();
  }

                                        /* NEW CLASS MODAL */

  $scope.newClassModal = $ionicModal.fromTemplate($scope.newClassModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showModalNewClass = function(){
    $scope.modelNewClass = {};
    $scope.newClassModal.show();  
  }
  $scope.closeModalNewClass = function(){
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

                                        /* NEW STUDENT DIALOG MODAL */

  $scope.newStudentModal = $ionicModal.fromTemplate($scope.newStudentModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalNewStudentDialog = function(){
    $scope.modelNewStudent = {};
    $scope.newStudentModal.show();  
  }
  $scope.closeModalNewStudentDialog = function(){
    $scope.newStudentModal.hide();
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

                                        /* STUDENT PROFILE MODAL */

  $scope.studentProfileModal = $ionicModal.fromTemplate($scope.studentProfileModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalStudentProfile = function(){
    $scope.studentProfileModal.show();  
  }
  $scope.closeModalStudentProfile = function(){
    $scope.studentProfileModal.hide();
  }
  
                                          /* QUANTITY RANDOM TEAMS MODAL */

  $scope.quantityRandomTeamsModal = $ionicModal.fromTemplate($scope.quantityRandomTeamsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalQuantityRandomTeams = function(){
    $scope.modelQuantity = {};
    $scope.quantityRandomTeamsModal.show();  
  }
  $scope.closeModalQuantityRandomTeams = function(){
    $scope.quantityRandomTeamsModal.hide();
  }

                                        /* TEAM DIALOG MODAL */  

  $scope.teamDialogModal = $ionicModal.fromTemplate($scope.teamDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalTeamDialog = function(){
    $scope.modelTeamDialog = {};
    $scope.teamDialogModal.show();  
  }
  $scope.closeModalTeamDialog = function(){
    $scope.teamDialogModal.hide();
  }

                                        /* NEW TEAM DIALOG MODAL */

  $scope.newTeamDialogModal = $ionicModal.fromTemplate($scope.newTeamDialogModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalNewTeamDialog = function(){
    $scope.modelNewTeamDialog = {};
    $scope.getStudentsForTeamSelection()
    $scope.newTeamDialogModal.show();  
  }
  $scope.closeModalNewTeamDialog = function(){
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
    if(modalMissions == 0){
      $scope.modelNewMission = {};  
    }
    $scope.newMissionModal.show();  
  }
  $scope.closeModalNewMission = function(){
    $scope.newMissionModal.hide();
    modalMissions == 0;
  }

                                        /* EDIT MISSION MODAL */

  $scope.editMissionModal = $ionicModal.fromTemplate($scope.editMissionModal,  {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalEditMission = function(){
    if(modalMissions == 0){
      $scope.modelEditMission = {};  
    }
    $scope.editMissionModal.show();  
  }
  $scope.closeModalEditMission = function(){
    $scope.editMissionModal.hide();
    modalMissions = 0;
  }

                                        /* NEW ITEM MODAL */

  $scope.newItemModal = $ionicModal.fromTemplate($scope.newItemModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalNewItem = function(){
    $scope.modelNewItem = {};
    $scope.newItemModal.show();  
  }
  $scope.closeModalNewItem = function(){
    $scope.newItemModal.hide();
  }

                                        /* NEW ACHIEVEMENT MODAL */

  $scope.newAchievementModal = $ionicModal.fromTemplate($scope.newAchievementModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalNewAchievement = function(){
    $scope.modelNewAchievement = {};
    $scope.newAchievementModal.show();  
  }
  $scope.closeModalNewAchievement = function(){
    $scope.newAchievementModal.hide();
  }

                                       /* NEW REWARD MODAL */
  $scope.newRewardModal = $ionicModal.fromTemplate($scope.newRewardModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalNewReward = function(){
    $scope.modelNewReward = {};
    $scope.newRewardModal.show();  
  } 
  $scope.closeModalNewReward = function(){
    $scope.newRewardModal.hide();
  }

                                        /* EDIT REWARD MODAL */

  $scope.editRewardModal = $ionicModal.fromTemplate($scope.editRewardModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalEditReward = function(){
    $scope.modelEditReward = {};
    $scope.editRewardModal.show();  
  }
  $scope.closeModalEditReward = function(){
    $scope.editRewardModal.hide();
  }

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */

  $scope.clearFormSecundaryModal = function(){
    var selectTeam = document.getElementById("selectTeam").selectedIndex = 0;
    var selectCopy = document.getElementById("selectCopy").selectedIndex = 0;
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  if (firebase.auth().currentUser === null) {
    $state.go('login');
  }

  firebase.auth().onAuthStateChanged(function(user) {
    if (user && sharedData.getData() === 'teacher') {
      sessionUser = firebase.auth().currentUser;
      var teachersArray = $firebaseArray(teachersRef);
      teachersArray.$loaded(function() {
        $scope.teacher = teachersArray.$getRecord(sessionUser.uid);
        $scope.teacher.name = CryptoJS.AES.decrypt($scope.teacher.name, sessionUser.uid).toString(CryptoJS.enc.Utf8);
        $scope.teacher.surname = CryptoJS.AES.decrypt($scope.teacher.surname, sessionUser.uid).toString(CryptoJS.enc.Utf8);
        $scope.getClassrooms();
      })
    }
  });

  var modalFirst;
  var modalMissions = 0;

  var sessionUser;
  var secondaryConnection = null;

  var rootRef = firebase.database().ref();

  var teachersRef = firebase.database().ref('teachers');
  var studentsRef = firebase.database().ref('students');
  var classroomsRef = firebase.database().ref('classrooms');
  var itemsRef = firebase.database().ref('items');
  var achievementsRef = firebase.database().ref('achievements');
  var teamsRef = firebase.database().ref('teams');
  var rewardsRef = firebase.database().ref('rewards');

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */




                                        /* HASHCODE POPUP */

  $scope.showHashcodePopup = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'CODIGO DE LA CLASE',
      template: $scope.classroom.hashcode,
    });

    alertPopup.then(function(res) {
      $scope.closePopoverClassStudents();
    });
  };




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
    var teacherClassroomsRef = firebase.database().ref('teachers/' + $scope.teacher.$id + '/classrooms');
    var classroomKeys = $firebaseArray(teacherClassroomsRef);
    classroomKeys.$loaded(function() {
      $scope.classrooms = [];
      for (i = 0 ; i < classroomKeys.length ; i++) {
        var classKey = classroomKeys.$keyAt(i);
        var loopClassroom = firebase.database().ref('classrooms/' + classKey);
        loopClassroom.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            for(j = 0 ; j < $scope.classrooms.length ; j++) {
                if($scope.classrooms[j].id == snapshot.val().id) {
                  change = true;
                  index = j;
                }              
            }
            if(!change) {
              $scope.classrooms.push(snapshot.val());            
            } else {
              $scope.classrooms[index] = snapshot.val();
            }
            if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
            }
            $scope.getClassroomsForSelection();
          }
        });
      }
    });
  }

  $scope.getClassroomsForSelection = function() {
    $scope.classroomsForSelection = angular.copy($scope.classrooms);
    for (var element in $scope.classroomsForSelection) {
      $scope.classroomsForSelection[element].selected = false;
    }
  }

  $scope.createClassroom = function(name) {
    var classroomsNode = $firebaseArray(classroomsRef);
    classroomsNode.$loaded(function() {
      classroomsNode.$add({
        'name' : name,
        'open' : true,
        'archived' : false,
        'notifications' : true,
        'teacher' : $scope.teacher.$id,
      }).then(function(ref) {
        var id = ref.key;

        var idForClassroomRef = firebase.database().ref('classrooms/' + id + '/id');
        idForClassroomRef.set(id);

        var a = CryptoJS.SHA1(id + Date.now().toString()).toString();
        var hash = a.substr(0, 10).toUpperCase();
        var hashCodeForClassroomRef = firebase.database().ref('classrooms/' + id + '/hashcode');
        hashCodeForClassroomRef.set(hash);

        var hashCodeRef = firebase.database().ref('hashcodes/' + hash + '/id');
        hashCodeRef.set(id);

        var newteacherClassroomRef = firebase.database().ref('teachers/' + $scope.teacher.$id + '/classrooms/' + id);
        newteacherClassroomRef.set(true);

        $scope.getClassrooms();
      });  
    });
  }

  $scope.deleteClassroom = function(classroom) {
    for (var student in classroom.students) {
      var studentClassToDeleteRef = firebase.database().ref('students/' + student + '/classrooms/' + classroom.id);
      studentClassToDeleteRef.remove();
    }

    var teacherClassToDelefeRef = firebase.database().ref('teachers/' + sessionUser.uid + '/classrooms/' + classroom.id);
    teacherClassToDelefeRef.remove();

    var classroomHascodeRef = firebase.database().ref('hashcodes/' + classroom.hashcode);
    classroomHascodeRef.remove();

    var classToDeleteRef = firebase.database().ref('classrooms/' + classroom.id);
    classToDeleteRef.remove();
    
    for (var item in classroom.items) {
      var classItemToDeleteRef = firebase.database().ref('items/' + item);
      classItemToDeleteRef.remove();
    }

    for (var reward in classroom.rewards) {
      var classRewardToDeleteRef = firebase.database().ref('rewards/' + reward);
      classRewardToDeleteRef.remove();
    }

    //THINGS TO DO
    /*for (var team in classroom.teams) {
      var classTeamToDeleteRef = firebase.database().ref('teams/' + team);
      classTeamToDeleteRef.remove();
    }*/
    /*for (var mission in classroom.missions) {
      var classMissionToDeleteRef = firebase.database().ref('missions/' + mission);
      classMissionToDeleteRef.remove();
    }*/

    $scope.getClassrooms();
  }

  $scope.setClassroom = function(classroom) {
    $scope.classroom = classroom;
    $scope.getStudents();
    $scope.getItems();
    $scope.getTeams();
    $scope.getRewards();
  }

  $scope.archiveClassroom = function(classroom) {
    var classroomToArchiveRef = firebase.database().ref('classrooms/' + classroom.id + '/archived');
    classroomToArchiveRef.set(true).then(function() {
    });
  }

  $scope.unArchiveClassroom = function(classroom) {
    var classroomToArchiveRef = firebase.database().ref('classrooms/' + classroom.id + '/archived');
    classroomToArchiveRef.set(false).then(function() {
    });
  }

  $scope.showArchivedClassrooms = function(value) {
    $scope.archivedClassroomsToShow = value;
    $scope.closePopoverTeacherHome();
  }

  $scope.duplicateClassroom = function(classroom) {
    //DUPLICATE ACTION GOES HERE
    //THINGS TO DO
  }

  $scope.selectClassrooms = function() {
    $scope.closeSelectClassroomsModal();
    if ($scope.actionSheetTeacherHomeType === 'delete') {
      for (var element in $scope.classroomsForSelection) {
        if ($scope.classroomsForSelection[element].selected === true) {
          $scope.deleteClassroom($scope.classroomsForSelection[element]);
        }
      }
      $scope.classroomsForSelection = $scope.classrooms;
    } else if ($scope.actionSheetTeacherHomeType === 'archive') {
      for (var element in $scope.classroomsForSelection) {
        if ($scope.classroomsForSelection[element].selected === true) {
          $scope.archiveClassroom($scope.classroomsForSelection[element]);
        }
      }
    } else if ($scope.actionSheetTeacherHomeType === 'unArchive') {
      for (var element in $scope.classroomsForSelection) {
        if ($scope.classroomsForSelection[element].selected === true) {
          $scope.unArchiveClassroom($scope.classroomsForSelection[element]);
        }
      }
    } else if ($scope.actionSheetTeacherHomeType === 'duplicate') {
      for (var element in $scope.classroomsForSelection) {
        if ($scope.classroomsForSelection[element].selected === true) {
          $scope.duplicateClassroom($scope.classroomsForSelection[element]); //THINGS TO DO
        }
      }
    }
  }

  $scope.changeSelectedClassroom = function(classroom){
    if (classroom.selected === false) {
      classroom.selected = true;
    } else {
      classroom.selected = false;
    }
  }

  


                                        /* FUNCTIONS IN TEACHER PROFILE */

  $scope.editTeacherData = function(name, surname, school, avatar) {
    if (name != undefined) {
      $scope.teacher.name = name;
      var teacherNameRef = firebase.database().ref('teachers/' + sessionUser.uid + '/name');
      teacherNameRef.set(CryptoJS.AES.encrypt(name,sessionUser.uid).toString());
      sessionUser.updateProfile ({
        displayName : name + ' ' + $scope.teacher.surname,
      });
    }

    if (surname != undefined) {
      $scope.teacher.surname = surname;
      var teacherSurnameRef = firebase.database().ref('teachers/' + sessionUser.uid + '/surname');
      teacherSurnameRef.set(CryptoJS.AES.encrypt(surname,sessionUser.uid).toString());
      sessionUser.updateProfile ({
        displayName : $scope.teacher.name + ' ' + surname,
      });
    }

    if (school != undefined) {
      $scope.teacher.school = school;
      var teacherSchoolRef = firebase.database().ref('teachers/' + sessionUser.uid + '/school');
      teacherSchoolRef.set(school);
    }

    if (avatar != undefined) {
      $scope.teacher.avatar = avatar;
      var teacherAvatarRef = firebase.database().ref('teachers/' + sessionUser.uid + '/avatar');
      teacherAvatarRef.set(avatar);
      sessionUser.updateProfile ({
        photoURL : avatar,
      });
    }
    $scope.settingsForm();
    alert('DATOS CAMBIADOS');
  }

  $scope.updateTeacherPassword = function(newPassword) {
    sessionUser.updatePassword(newPassword).then(function() {
      $scope.settingsForm();
      alert('CONTRASEÑA CAMBIADA');
    });
  }

  $scope.updateTeacherEmail = function(email) {
    sessionUser.updateEmail(email).then(function() {
      var teacherEmailRef = firebase.database().ref('teachers/' + sessionUser.uid + '/email');
      teacherEmailRef.set(email);
      $scope.settingsForm();
      alert('EMAIL CAMBIADO');
    });
  }




                                        /* FUNCTIONS IN CLASS */

  $scope.getStudents = function() {
    var classroomStudentsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/students');
    var studentKeys = $firebaseArray(classroomStudentsRef);
    studentKeys.$loaded(function() {
      $scope.students = [];
      for (i = 0 ; i < studentKeys.length ; i++) {
        var studentKey = studentKeys.$keyAt(i);
        var loopStudent = firebase.database().ref('students/' + studentKey);
        loopStudent.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            var student = snapshot.val();
            student.name = CryptoJS.AES.decrypt(student.name, student.id).toString(CryptoJS.enc.Utf8);
            student.surname =CryptoJS.AES.decrypt(student.surname, student.id).toString(CryptoJS.enc.Utf8);
            student.inClass = student.classrooms[$scope.classroom.id].inClass;
            for(j = 0 ; j < $scope.students.length ; j++) {
              if($scope.students[j].id == student.id) {
                change = true;
                index = j;
              }
            }
            if(!change) {
              $scope.students.push(student);
            } else {
              $scope.students[index] = student
            }
            if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
            }
            $scope.getStudentsForSelection();
          }
        });
      }
    }).then(function() {
      $scope.classForm();
    });
  }

  $scope.getStudentsForSelection = function() {
    $scope.studentsForSelection = [];
    if($scope.actionsheetClassStudentsType == 'evaluate') {
      for (var element in $scope.students) {
        if($scope.students[element].classrooms[$scope.classroom.id].inClass){
          $scope.studentsForSelection.push($scope.students[element]);
        }
      }
      for (var element in $scope.studentsForSelection) {
        $scope.studentsForSelection[element].selected = false;
      }
    } else {
      $scope.studentsForSelection = angular.copy($scope.students);
      for (var element in $scope.studentsForSelection) {
        $scope.studentsForSelection[element].selected = false;
      }
    }
  }

  $scope.createNewStudent = function(name, surname, email, password) {
    if (secondaryConnection == null) {
      var config = {
        apiKey: "AIzaSyBBKqBEuzK2MF9zm4V6u5BoqWWfdtQEF94",
        authDomain: "thelearninggamesproject-99882.firebaseapp.com",
        databaseURL: "https://thelearninggamesproject-99882.firebaseio.com",
        storageBucket: "thelearninggamesproject-99882.appspot.com",
        messagingSenderId: "451254044984",
      };
      secondaryConnection = firebase.initializeApp(config, "Secondary");
    }

    secondaryConnection.auth().createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
      var sessionStudent = secondaryConnection.auth().currentUser;
      if (sessionStudent) {
        //User is signed in.
        sessionStudent.updateProfile({
          displayName : name + ' ' + surname,
          photoURL : 'https://easyeda.com/assets/static/images/avatar-default.png'
        }).then(function() {
          //Update successful.
          var newStudentRef = firebase.database().ref('students/'+sessionStudent.uid);
          newStudentRef.set({
            'id' : sessionStudent.uid,
            'name' : CryptoJS.AES.encrypt(name, sessionStudent.uid).toString(),
            'surname' : CryptoJS.AES.encrypt(surname, sessionStudent.uid).toString(),
            'email' : sessionStudent.email,
            'school' : $scope.teacher.school,
            'avatar' : sessionStudent.photoURL,
          }).then(function() {
            var newClassStudentRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/students/' + sessionStudent.uid);
            newClassStudentRef.set(true);

            var newStudentClassRef = firebase.database().ref('students/' + sessionStudent.uid + '/classrooms/' + $scope.classroom.id);
            newStudentClassRef.set({
              'id' : $scope.classroom.id,
              'totalPoints' : 0,
              'studentLevel' : 1,
              'inClass' : true,
            });

            secondaryConnection.auth().signOut();
            $scope.closeModalNewStudentDialog();
            $scope.getStudents();
          });
        });
      }
    }).catch(function(error) {
      if (error) {
        switch (error.code) {
      case "auth/weak-password":
        alert("LA CONTRASEÑA DEBE SER DE AL MENOS 6 CARACTERES");
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

  $scope.deleteStudent = function(student) {
    var studentClassRef = firebase.database().ref('students/' + student.id + '/classrooms/' + $scope.classroom.id);
    studentClassRef.remove();

    var classStudentRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/students/' + student.id);
    classStudentRef.remove();

    for (var item in $scope.items) {
      var studentItemToDeleteRef = firebase.database().ref('students/' + student.id + '/items/' + $scope.items[item].id);
      studentItemToDeleteRef.remove();
    }

    for (var team in $scope.teams) {
      var teamStudentsToDeleteRef = firebase.database().ref('teams/' + $scope.teams[team].id + '/students/' + student.id);
      teamStudentsToDeleteRef.remove();

      var studentTeamsToDelete = firebase.database().ref('students/' + student.id + '/teams/' + $scope.teams[team].id);
      studentTeamsToDelete.remove();
    }
    
    //THINGS TO DO
    //ELIMINAR LOS LOGROS DE LA CLASE DEL ESTUDIANTE students/studentID/achievements/'EACHachievementINCLASS'

    $scope.getStudents();
  }

  $scope.setStudent = function(student) {
    $scope.student = student;
    $scope.studentItems = [];
    for (var item in student.items) {
      for(i = 0 ; i < $scope.items.length ; i++){
        if(student.items[item].id == $scope.items[i].id){
          $scope.studentItems.push({
            'id' : student.items[item].id,
            'points' : student.items[item].points,
            'name' : $scope.items[i].name,
            'score' : $scope.items[i].score,
            'maxScore' : $scope.items[i].maxScore,
            'useForLevel' : $scope.items[i].useForLevel,
          });
        }
      }
    }
    $scope.showModalStudentDialog();
  }

  $scope.setOpening = function(opening) {
    if(opening == undefined){
      opening = false;
    }
    var classOpeningRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/open');
    classOpeningRef.set(opening);
    $scope.classroom.open = opening;
  }

  $scope.setNotifications = function(notification) {
    if(notification == undefined){
      notification = false;
    }
    var classNotificationsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/notifications');
    classNotificationsRef.set(notification);
    $scope.classroom.notifications = notification;
  }

  $scope.selectStudents = function() {
    $scope.closeSelectStudentsModal();
    $scope.closeAttendanceModal();
    if ($scope.actionsheetClassStudentsType === 'delete') {
      for (var element in $scope.studentsForSelection) {
        if ($scope.studentsForSelection[element].selected === true) {
          $scope.deleteStudent($scope.studentsForSelection[element]);
        }
      }
    } else if ($scope.actionsheetClassStudentsType === 'evaluate') {
      $scope.studentsToEvaluate = [];
      for (var element in $scope.studentsForSelection) {
        if ($scope.studentsForSelection[element].selected === true) {
          $scope.studentsToEvaluate.push($scope.studentsForSelection[element]);
          $scope.actionSheetItemsType = 'evaluateStudents';
          $scope.showSelectItemsModal();
        }
      }
    } else if ($scope.actionsheetClassStudentsType === 'attendance') {
      for (var element in $scope.students) {
        $scope.editStudentsAttendance($scope.students[element]);
      }
    }
  }
  
  $scope.changeSelectedStudent = function(student){
    if (student.selected === false) {
      student.selected = true;
    } else {
      student.selected = false;
    }
  }

  $scope.inClass = function(student) {
    if (student.classrooms[$scope.classroom.id].inClass === true) {
      student.classrooms[$scope.classroom.id].inClass = false;
    } else {
      student.classrooms[$scope.classroom.id].inClass = true;
    }
  }

  $scope.editStudentsAttendance = function(student) {
    var studentAttendanceRef = firebase.database().ref('students/' + student.id + '/classrooms/' + $scope.classroom.id + '/inClass');
    studentAttendanceRef.set(student.classrooms[$scope.classroom.id].inClass);
  }  
  
  


                                        /* FUNCTIONS IN ITEMS */

  $scope.getItems = function() {
    var classroomItemsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/items');
    var itemKeys = $firebaseArray(classroomItemsRef);
    itemKeys.$loaded(function() {
      $scope.items = [];
      for (i = 0 ; i < itemKeys.length ; i++) {
        var itemKey = itemKeys.$keyAt(i);
        var loopItem = firebase.database().ref('items/' + itemKey);
        loopItem.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            var item = snapshot.val();
            for(j = 0 ; j < $scope.items.length ; j++){
              if(item.id == $scope.items[j].id){
                change = true;
                index = j;
              }
            }
            if(!change){
              $scope.items.push(item);  
            } else {
              $scope.items[index] = item;
            }
            $scope.getItemsForSelection();
          }
        });
      }
    });
  }

  $scope.getItemsForSelection = function() {
    $scope.itemsForSelection = angular.copy($scope.items);
    for (var element in $scope.itemsForSelection) {
      $scope.itemsForSelection[element].selected = false;
    }
  }

  $scope.createItem = function (name, description, requirements, score, maxScore, useForLevel) {
    if (useForLevel == undefined) {
      useForLevel = false;
    }
    var itemsNode = $firebaseArray(itemsRef);
    itemsNode.$loaded(function() {
      itemsNode.$add({
        'name' : name,
        'description' : description,
        'requirements' : requirements,
        'score' : score,
        'maxScore' : maxScore,
        'useForLevel' : useForLevel
      }).then(function(ref) {
        var id = ref.key;

        var idForItemRef = firebase.database().ref('items/' + id + '/id');
        idForItemRef.set(id);

        var classroomRef = firebase.database().ref('classrooms/' + $scope.classroom.id  + '/items/' + id);
        classroomRef.set(true);

        $scope.closeModalNewItem();
        $scope.getItems();
      });  
    });
  }

  $scope.deleteItem = function(item) {
    var itemRef = firebase.database().ref('items/' + item.id);
    itemRef.remove();

    var classItemRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/items/' + item.id);
    classItemRef.remove();

    for (var student in $scope.students) {
      var studentItemsToDeleteRef = firebase.database().ref('students/' + $scope.students[student].id + '/items/' + item.id);
      studentItemsToDeleteRef.remove();

      /* PARA CUANDO SE DESBLOQUEEN LOGROS EN EL ALUMNO //THINGS TO DO
      for (var achievement in item.achievements) {
        var studentAchievementsToDeleteRef = firebase.database().ref('students/' + $scope.students[student].id + '/achievements/' + achievement);
        studentAchievementsToDeleteRef.remove();
      }*/
    }
    
    for (var achievement in item.achievements) {
      var itemAchievementsToDeleteRef = firebase.database().ref('achievements/' + achievement);
      itemAchievementsToDeleteRef.remove();
    }

    $scope.getItems();
  }

  $scope.setItem = function(item) {
    $scope.item = item;
    $scope.getAchievements();
    $scope.itemsForm();
  }

  $scope.editItem = function(name, description, requirements, score, maxScore, useForLevel) {
    if(name != undefined && description != undefined && requirements != undefined && score != undefined && maxScore != undefined){
      var itemRef = firebase.database().ref('items/' + $scope.item.id);
      if(useForLevel != $scope.item.useForLevel && useForLevel != undefined) {
        var itemUse = useForLevel
      } else {
        var itemUse = $scope.item.useForLevel
      }
      var itemEdit = {
        'id' : $scope.item.id,
        'name' : name,
        'description' : description,
        'requirements' : requirements,
        'score' : score,
        'maxScore' : maxScore,
        'useForLevel' : itemUse,
      };
      itemRef.set(itemEdit);
    } else {
      if(name != undefined) {
        var itemNameRef = firebase.database().ref('items/' + $scope.item.id + '/name');
        itemNameRef.set(name);
      }

      if(description != undefined) {
        var itemDescriptionRef = firebase.database().ref('items/' + $scope.item.id + '/description');
        itemDescriptionRef.set(description);
      }

      if(requirements != undefined) {
        var itemRequirementsRef = firebase.database().ref('items/' + $scope.item.id + '/requirements');
        itemRequirementsRef.set(requirements);
      }

      if(score != undefined) {
        var itemScoreRef = firebase.database.ref('items/' + $scope.item.id + '/score');
        itemScoreRef.set(score);
      }

      if(maxScore != undefined) {
        var itemMaxScoreRef = firebase.database().ref('items/' + $scope.item.id + '/maxScore');
        itemMaxScoreRef.set(maxScore);
      }

      if(useForLevel != $scope.item.useForLevel && useForLevel != undefined) {
        var itemUseLevelRef = firebase.database().ref('items/' + $scope.item.id + '/useForLevel');
        itemUseLevelRef.set(useForLevel);
      }
    }
    $scope.rulesForm();
  }

  $scope.evaluateStudents = function(item) {
    /*
    **Hay que comprobar si la puntuacion que se le va a asignar al alumno es la puntuacion maxima de cada item.
    **Hay que comprobar si con la puntuacion que se le va a asignar al alumno, los logros del item suben de nivel o se desbloquean.
    **Hay que comprobar si con la puntuacion que se le va a asignar al alumno y los logros que quiza desbloquee, completará una mision.
    **Hay que comprobar si con la puntuacion que se le va a asignar al alumno en la puntuacion de la clase sube de nivel. 
    **(Para la claridad del codigo, todas estas comprobaciones quiza se deberian hacer en diferentes metodos. Con su consiguiente codigo de introduccion en la base de datos en caso de cumplirse las condiciones),
    **/
    for(var pos in $scope.studentsToEvaluate) {
      if($scope.studentsToEvaluate[pos].items != undefined) {
        var studentItems = $scope.studentsToEvaluate[pos].items;
        var studentItemRef = firebase.database().ref('students/' + $scope.studentsToEvaluate[pos].id + '/items/' + item.id);
        if (!(item.id in studentItems)) {
          studentItemRef.set({
            'id' : item.id,
            'points' : item.score,
          });

        } else {
          var studentPoints = $scope.studentsToEvaluate[pos].items[item.id].points;
          if((Number(studentPoints) + Number(item.score)) > Number(item.maxScore)) {
            studentItemRef.set({
              'id' : item.id,
              'points' : item.maxScore,
            });
            alert('EL ALUMNO: ' + $scope.studentsToEvaluate[pos].name + ' ' + $scope.studentsToEvaluate[pos].surname + ' HA RECIBIDO MAS PUNTUACION DE LA MAXIMA ESTABLECIDA EN EL ITEM ' + item.name + ' , SE HA ESTABLECIDO LA PUNTUACION MAXIMA');
          } else {
            studentItemRef.set({
              'id' : item.id,
              'points' : Number(studentPoints) + Number(item.score),
            });
            if ((Number(studentPoints) + Number(item.score)) < 0) {
              alert('EL ALUMNO: ' + $scope.studentsToEvaluate[pos].name + ' ' + $scope.studentsToEvaluate[pos].surname + ' HA PERDIDO MAS PUNTUACION DE LA MAXIMA ESTABLECIDA EN EL ITEM ' + item.name + ' , SE HA ESTABLECIDO LA PUNTUACION A 0');
            }
          }
        }   
      } else {
        var studentItemRef = firebase.database().ref('students/' + $scope.studentsToEvaluate[pos].id + '/items/' + item.id);
        studentItemRef.set({
          'id' : item.id,
          'points' : item.score,
        });
      }    
    }
    if (item.useForLevel) {
      //Comprobar el nivel THINGS TO DO
      //Profundizar en achievements (como comprobar los requisitos y los niveles?)
      //PREGUNTAR A OSCAR: esto añade puntos a la clase a pesar de que el item ya tenga la puntuacion al maximo, asi como el nivel de la clase
      var pointsAdded = Number($scope.studentsToEvaluate[pos].classrooms[$scope.classroom.id].totalPoints) + Number(item.score);
      var studentClassroomTotalPointsRef = firebase.database().ref('students/' + $scope.studentsToEvaluate[pos].id + '/classrooms/' + $scope.classroom.id + '/totalPoints');
      if(pointsAdded < 0){
        studentClassroomTotalPointsRef.set(0);
      } else {
        studentClassroomTotalPointsRef.set(pointsAdded);  
      }
    }   
  }

  $scope.selectItems = function() {
    $scope.closeSelectItemsModal();
    if ($scope.actionSheetItemsType === 'delete') {
      for (var element in $scope.itemsForSelection) {
        if ($scope.itemsForSelection[element].selected === true) {
          $scope.deleteItem($scope.itemsForSelection[element]);
        }
      }
    } else if ($scope.actionSheetItemsType === 'duplicate') {
      for (var element in $scope.itemsForSelection) {
        if ($scope.itemsForSelection[element].selected === true) {
          $scope.duplicateItem($scope.itemsForSelection[element]); //THINGS TO DO
        }
      }
    } else if ($scope.actionSheetItemsType === 'evaluateStudents') {
      for(var element in $scope.itemsForSelection) {
        if($scope.itemsForSelection[element].selected === true) {
          $scope.evaluateStudents($scope.itemsForSelection[element]);    
        }
      }
      $scope.getStudents();
    }
  }

  $scope.changeSelectedItem = function(item){
      if (item.selected === false) {
        item.selected = true;

        if($scope.actionSheetItemsType === 'evaluateStudents'){ 
        $scope.points = item.score;
        $scope.popupChooseScore = $ionicPopup.show({
          template: '<input id="inputScore" type="number" ng-model="points">',
          scope: $scope,
          buttons: [
            {
              text: 'CANCELAR',
              onTap: function() {
                item.selected = false;
              }
            },
            { text: 'USAR PUNTOS POR DEFECTO',
              type: 'button-positive',
            },
            {
              text: 'CAMBIAR PUNTUACION',
              type: 'button-positive',
              onTap: function(e) {
                var actualScore = document.getElementById("inputScore").value;
                if(actualScore > item.maxScore){
                  e.preventDefault();
                } else if (-(actualScore) > item.maxScore) {
                  e.preventDefault();
                } else {
                  item.score = actualScore;
                }
              }
            }
          ]
        });
      }
    } else {
      item.selected = false;
    }
  }

  $scope.removePoints = function(item) {
    var studentItemPointsToRemoveRef = firebase.database().ref('students/' + $scope.student.id + '/items/' + item.id + '/points');
    var studentClassPointsToRemoveRef = firebase.database().ref('students/' + $scope.student.id + '/classrooms/' + $scope.classroom.id + '/totalPoints');
    if ((Number($scope.student.items[item.id].points) - Number(item.score)) < 0) {
      alert ('EL ALUMNO NO DISPONE DE SUFICIENTES PUNTOS PARA RESTAR, LA PUNTUACION SERA ESTABLECIDA A 0');
      studentItemPointsToRemoveRef.set(0);
      $scope.student.items[item.id].points = 0;
    } else {
      studentItemPointsToRemoveRef.set((Number($scope.student.items[item.id].points) - Number(item.score)));
      $scope.student.items[item.id].points = (Number($scope.student.items[item.id].points) - Number(item.score));
    }

    item.points = $scope.student.items[item.id].points;

    if(item.useForLevel) {
      if(($scope.student.classrooms[$scope.classroom.id].totalPoints - item.score) < 0) {
        studentClassPointsToRemoveRef.set(0);
        $scope.student.classrooms[$scope.classroom.id].totalPoints = 0;
      } else {
        studentClassPointsToRemoveRef.set($scope.student.classrooms[$scope.classroom.id].totalPoints - item.score); 
        $scope.student.classrooms[$scope.classroom.id].totalPoints = Number($scope.student.classrooms[$scope.classroom.id].totalPoints) - Number(item.score);
      }
    }
  }

  $scope.addPoints = function(item) {
    var studentItemPointsToAddRef = firebase.database().ref('students/' + $scope.student.id + '/items/' + item.id + '/points');
    var studentClassPointsToAddRef = firebase.database().ref('students/' + $scope.student.id + '/classrooms/' + $scope.classroom.id + '/totalPoints');
    if ((Number($scope.student.items[item.id].points) + Number(item.score)) > item.maxScore) {
      alert('EL ALUMNO HA RECIBIDO MAS PUNTUACION DE LA MAXIMA ESTABLECIDA EN EL ITEM, LA PUNTUACION SERA ESTABLECIDA AL MAXIMO');
      studentItemPointsToAddRef.set(item.maxScore);
      $scope.student.items[item.id].points = item.maxScore;
    } else {
      studentItemPointsToAddRef.set((Number($scope.student.items[item.id].points) + Number(item.score)));
      $scope.student.items[item.id].points = (Number($scope.student.items[item.id].points) + Number(item.score));
    }

    item.points = $scope.student.items[item.id].points;

    if(item.useForLevel) {
      studentClassPointsToAddRef.set($scope.student.classrooms[$scope.classroom.id].totalPoints + item.score);
      $scope.student.classrooms[$scope.classroom.id].totalPoints = $scope.student.classrooms[$scope.classroom.id].totalPoints + item.score;
    }
  }

  
  

                                        /* FUNCTIONS IN ACHIEVEMENTS */

  $scope.getAchievements = function() {
    var itemAchievemntsRef = firebase.database().ref('items/' + $scope.item.id + '/achievements');
    var achievementKeys = $firebaseArray(itemAchievemntsRef);
    achievementKeys.$loaded(function() {
      $scope.achievements = [];
      for (i = 0 ; i < achievementKeys.length ; i++) {
        var achievementKey = achievementKeys.$keyAt(i);
        var loopAchievemnt = firebase.database().ref('achievements/' + achievementKey);
        loopAchievemnt.on('value', function(snapshot) {
          if(snapshot.val() != null) {
            var change = false;
            var index = -1;
            var achievement = snapshot.val();
            for(j = 0 ; j < $scope.achievements.length ; j++) {
              if(achievement.id == $scope.achievements[j].id) {
                change = true;
                index = j;
              }
            }
            if(!change) {
              $scope.achievements.push(achievement);
            } else {
              $scope.achievements[index] = achievement;
            }
            if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
            }
            $scope.getAchievementsForSelection();
          }
        });
      }
    });
  }

  $scope.getAchievementsForSelection = function() {
    $scope.achievementsForSelection = angular.copy($scope.achievements);
    for (var element in $scope.achievementsForSelection) {
      $scope.achievementsForSelection[element].selected = false;
    }
  }

  $scope.createAchievement = function(name, description, requirements, pointsToLevel, maxLevel, badge) {
    if(badge == undefined){
      badge = 'https://easyeda.com/assets/static/images/avatar-default.png'
    }

    var achievementsNode = $firebaseArray(achievementsRef);
    achievementsNode.$loaded(function() {
      achievementsNode.$add({
        'name' : name,
        'description' : description,
        'requirements' : requirements,
        'pointsToLevel' : pointsToLevel,
        'maxLevel' : maxLevel,
        'badge' : badge,
      }).then(function(ref) {
        var id = ref.key;

        var idForAchievementRef = firebase.database().ref('achievements/' + id + '/id');
        idForAchievementRef.set(id);

        var itemsAchievementsRef = firebase.database().ref('items/' + $scope.item.id + '/achievements/' + id);
        itemsAchievementsRef.set(true);

        $scope.closeModalNewAchievement();
        $scope.getAchievements();
      });  
    });
  }

  $scope.deleteAchievement = function(achievement) {
    var itemAchievementRef = firebase.database().ref('items/' + $scope.item.id + '/achievements/' + achievement.id);
    itemAchievementRef.remove();

    var achievementToDeleteRef = firebase.database().ref('achievements/' + achievement.id);
    achievementToDeleteRef.remove();

    //THINGS TO DO
    //ELIMINAR LOS LOGROS DEL ESTUDIANTE

    $scope.getAchievements();
  }

  $scope.setAchievement = function(achievement) {
    $scope.achievement = achievement;
    $scope.achievementsForm();
  }

  $scope.editAchievement = function(name, description, requirements, pointsToLevel, maxLevel, badge) {
    if(name != undefined && description != undefined && requirements != undefined && pointsToLevel != undefined && maxLevel != undefined && badge != undefined){
      var achievementRef = firebase.database().ref('achievements/' + $scope.achievement.id);
      var achievementEdit = {
        'id' : $scope.achievement.id,
        'name' : name,
        'description' : description,
        'requirements' : requirements,
        'pointsToLevel' : pointsToLevel,
        'maxLevel' : maxLevel,
        'badge' : badge,
      };
      achievementRef.set(achievementEdit);
    } else {
      if(name != undefined) {
        var achievementNameRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/name');
        achievementNameRef.set(name);
      }

      if(description != undefined) {
        var achievementDescriptionRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/description');
        achievementDescriptionRef.set(description);
      }

      if(requirements != undefined) {
        var achievementRequirementsRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/requirements');
        achievementRequirementsRef.set(requirements);
      }

      if(pointsToLevel != undefined) {
        var achievementPointsToLevelRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/pointsToLevel');
        achievementPointsToLevelRef.set(pointsToLevel);
      }

      if(maxLevel != undefined) {
        var achievementMaxLevelRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/maxLevel');
        achievementMaxLevelRef.set(maxLevel);
      }

      if(badge != undefined) {
        var achievementBadgeRef = firebase.database().ref('achievements/' + $scope.achievement.id + '/badge');
        achievementBadgeRef.set(badge);
      }
    }
    $scope.itemsForm();
  }

  $scope.selectAchievements = function() {
    $scope.closeSelectAchievementsModal();
    if ($scope.actionSheetAchievementsType === 'delete') {
      for (var element in $scope.achievementsForSelection) {
        if ($scope.achievementsForSelection[element].selected === true) {
          $scope.deleteAchievement($scope.achievementsForSelection[element]);
        }
      }
    $scope.achievementsForSelection = $scope.achievements;
    } else if ($scope.actionSheetAchievementsType === 'duplicate') {
      for (var element in $scope.achievementsForSelection) {
        if ($scope.achievementsForSelection[element].selected === true) {
          $scope.duplicateAchievement($scope.achievementsForSelection[element]); //THINGS TO DO
        }
      }
    }
  }
  
  $scope.changeSelectedAchievement = function(achievement){
    if (achievement.selected === false) {
      achievement.selected = true;
    } else {
      achievement.selected = false;
    }
  }




                                       /* FUNCTIONS IN TEAMS */

  $scope.getTeams = function() {
    var classroomTeamsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/teams');
    var teamKeys = $firebaseArray(classroomTeamsRef);
    teamKeys.$loaded(function() {
      $scope.teams = [];
      for (i = 0 ; i < teamKeys.length ; i++) {
        var teamKey = teamKeys.$keyAt(i);
        var loopTeam = firebase.database().ref('teams/' + teamKey);
        loopTeam.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            var team = snapshot.val();
            for(j = 0 ; j < $scope.teams.length ; j++) {
              if($scope.teams[j].id == team.id) {
                change = true;
                index = j;
              }
            }
            if(!change) {
              $scope.teams.push(team);
            } else {
              $scope.teams[index] = team;
            }
            if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
              $scope.$apply();
            }
            $scope.getTeamsForSelection();
          }
        });
      }
    });
  }

  $scope.getStudentsForTeamSelection = function() {
    $scope.studentsForTeamSelection = $scope.students;
    for (var element in $scope.studentsForTeamSelection) {
      $scope.studentsForTeamSelection[element].selected = false;
    }
  }

  $scope.getTeamsForSelection = function() {
    $scope.teamsForSelection = $scope.teams;
    for (var element in $scope.teamsForSelection) {
      $scope.teamsForSelection[element].selected = false;
    }
  }

  $scope.createTeam = function(name, objective, picture) {
    if(picture == undefined){
      picture = 'https://d30y9cdsu7xlg0.cloudfront.net/png/14261-200.png'
    }

    var teamsNode = $firebaseArray(teamsRef);
    teamsNode.$loaded(function() {
      teamsNode.$add({
        'name' : name,
        'objective' : objective,
        'picture' : picture,
      }).then(function(ref) {
        var id = ref.key;

        var idForTeamRef = firebase.database().ref('teams/' + id + '/id');
        idForTeamRef.set(id);

        var classroomRef = firebase.database().ref('classrooms/' + $scope.classroom.id  + '/teams/' + id);
        classroomRef.set(true);

        for (var element in $scope.studentsForTeamSelection) {
          if ($scope.studentsForTeamSelection[element].selected === true) {

            var studentId = $scope.studentsForTeamSelection[element].id;

            var studentTeamsRef = firebase.database().ref('students/' + studentId + '/teams/' + id);
            studentTeamsRef.set(true);

            var teamStudentsRef = firebase.database().ref('teams/' + id + '/students/' + studentId);
            teamStudentsRef.set(true);
          }
        }
        $scope.closeModalNewTeamDialog();
        $scope.getStudentsForTeamSelection();
        $scope.getTeams();
      });  
    });
  }

  $scope.deleteTeam = function(team) {
    var teamToDeleteRef = firebase.database().ref('teams/' + team.id);
    teamToDeleteRef.remove();

    for (var student in $scope.students) {
      var studentTeamToDeleteRef = firebase.database().ref('students/' + $scope.students[student].id + '/teams/' + team.id);
      studentTeamToDeleteRef.remove();
    }

    var classroomTeamToDelete = firebase.database().ref('classrooms/' + $scope.classroom.id + '/teams/' + team.id);
    classroomTeamToDelete.remove();

    $scope.getTeams();
  }

  $scope.setTeam = function(team) {
    $scope.team = team;
    $scope.teamMembers = [];
    for (var student in $scope.students) {
      for (var teamMember in team.students) {
        if ($scope.students[student].id == teamMember) {
          $scope.teamMembers.push({
            'id' : $scope.students[student].id,
            'name' : $scope.students[student].name,
            'surname' : $scope.students[student].surname,
            'avatar' : $scope.students[student].avatar,
          });
        }
      }
    }
    $scope.showModalTeamDialog();
  }

  $scope.editTeam = function(name, objective, picture) {
    if (name != undefined && objective != undefined && picture != undefined) {
      var team = {
        'id' : $scope.team.id,
        'name' : name,
        'objective' : objective,
        'picture' : picture,
        'students' : $scope.team.students,
      }
      var teamRef = firebase.database().ref('teams/' + $scope.team.id);
      teamRef.set(team);
    } else {
      if (name != undefined) {
        $scope.team.name = name;
        var teamNameRef = firebase.database().ref('teams/' + $scope.team.id + '/name');
        teamNameRef.set(name);
      }

      if (objective != undefined) {
        $scope.team.objective = objective;
        var teamObjectiveRef = firebase.database().ref('teams/' + $scope.team.id + '/objective');
        teamObjectiveRef.set(objective);
      }

      if (picture != undefined) {
        $scope.team.picture = picture;
        var teamPictureRef = firebase.database().ref('teams/' + $scope.team.id + '/picture');
        teamPictureRef.set(picture);
      }
    }
    $scope.closeModalTeamDialog();
    alert('DATOS CAMBIADOS');
  }

  $scope.selectTeams = function() {
    $scope.closeSelectTeamsModal();
    if ($scope.actionsheetClassTeamsType === 'delete') {
      for (var element in $scope.teamsForSelection) {
        if ($scope.teamsForSelection[element].selected === true) {
          $scope.deleteTeam($scope.teamsForSelection[element]);
        }
      }
    $scope.teamsForSelection = $scope.teams;
    } else if ($scope.actionsheetClassTeamsType === 'duplicate') {
      for (var element in $scope.teamsForSelection) {
        if ($scope.teamsForSelection[element].selected === true) {
          $scope.duplicateTeam($scope.teamsForSelection[element]); //THINGS TO DO
        }
      }
    }
  }

  $scope.changeSelectedStudentForTeam = function(student) {
    if (student.selected === false) {
      student.selected = true;
    } else {
      student.selected = false;
    }
  }

  $scope.changeSelectedTeam = function(team) {
    if (team.selected === false) {
      team.selected = true;
    } else {
      team.selected = false;
    }
  }

  


                                        /* FUNCTIONS IN REWARDS */

  $scope.getRewards = function() {
    var classroomRewardsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/rewards');
    var rewardKeys = $firebaseArray(classroomRewardsRef);
    rewardKeys.$loaded(function() {
      $scope.rewards = [];
      for (i = 0 ; i < rewardKeys.length ; i++) {
        var rewardKey = rewardKeys.$keyAt(i);
        var loopReward = firebase.database().ref('rewards/' + rewardKey);
        loopReward.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            var reward = snapshot.val();
            for(j = 0 ; j < $scope.rewards.length ; j++){
              if(reward.id == $scope.rewards[j].id){
                change = true;
                index = j;
              }
            }
            if(!change){
              $scope.rewards.push(reward);  
            } else {
              $scope.rewards[index] = reward;
            }
            $scope.getRewardsForSelection();
          }
        });
      }
    });
  }

  $scope.getRewardsForSelection = function() {
    $scope.rewardsForSelection = angular.copy($scope.rewards);
    for (var element in $scope.rewardsForSelection) {
      $scope.rewardsForSelection[element].selected = false;
    }
  }

  $scope.createReward = function(name, description, permission, price) {
    var rewardsNode = $firebaseArray(rewardsRef);
    rewardsNode.$loaded(function() {
      rewardsNode.$add({
        'name' : name,
        'description' : description,
        'permission' : permission,
        'price' : price,
      }).then(function(ref) {
        var id = ref.key;

        var idForRewardRef = firebase.database().ref('rewards/' + id + '/id');
        idForRewardRef.set(id);

        var classroomRewardsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/rewards/' + id);
        classroomRewardsRef.set(id);

        $scope.closeModalNewReward();
        $scope.getRewards();
      });  
    });
  }

  $scope.deleteReward = function(reward) {
    var classroomRewardRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/rewards/' + reward.id);
    classroomRewardRef.remove();

    var rewardToDeleteRef = firebase.database().ref('rewards/' + reward.id);
    rewardToDeleteRef.remove();

    //THINGS TO DO
    /* CUANDO EL ALUMNO TENGA RECOMPENSAS DESBLOQUEADAS 
    for (var student in $scope.classroom.students) {
      var studentRewardToDeleteRef = firebase.database().ref('students/' + student + '/rewards/' + reward.id);
      studentRewardToDeleteRef.remove();
    }*/

    $scope.getRewards();
  }

  $scope.setReward = function(reward) {
    $scope.reward = reward;
    $scope.showModalEditReward();
  }

  $scope.editReward = function(name, description, permission, price) {
    if (name != undefined && description != undefined && permission != undefined && price != undefined) {
      var reward = {
        'id' : $scope.reward.id,
        'name' : name,
        'description' : description,
        'permission' : permission,
        'price' : price,
      }
      var rewardRef = firebase.database().ref('rewards/' + $scope.reward.id);
      rewardRef.set(reward);
    } else {
      if (name != undefined) {
        $scope.reward.name = name;
        var rewardNameRef = firebase.database().ref('rewards/' + $scope.reward.id + '/name');
        rewardNameRef.set(name);
      }

      if (description != undefined) {
        $scope.reward.description = description;
        var rewardDescriptionRef = firebase.database().ref('rewards/' + $scope.reward.id + '/description');
        rewardDescriptionRef.set(description);
      }

      if (permission != undefined) {
        $scope.reward.permission = permission;
        var rewardPermissionRef = firebase.database().ref('rewards/' + $scope.reward.id + '/permission');
        rewardPermissionRef.set(permission);
      }

      if (price != undefined) {
        $scope.reward.price = price;
        var rewardPriceRef = firebase.database().ref('rewards/' + $scope.reward.id + '/price');
        rewardPriceRef.set(price);
      }
    }
    $scope.closeModalEditReward();
    alert('DATOS CAMBIADOS');
  }

  $scope.selectRewards = function() {
    $scope.closeSelectRewardsModal();
    if ($scope.actionSheetRewardsType === 'delete') {
      for (var element in $scope.rewardsForSelection) {
        if ($scope.rewardsForSelection[element].selected === true) {
          $scope.deleteReward($scope.rewardsForSelection[element]);
        }
      }
    $scope.rewardsForSelection = $scope.rewards;
    } else if ($scope.actionSheetRewardsType === 'duplicate') {
      for (var element in $scope.rewardsForSelection) {
        if ($scope.rewardsForSelection[element].selected === true) {
          $scope.duplicateReward($scope.rewardsForSelection[element]); //THINGS TO DO
        }
      }
    }
  }

  $scope.changeSelectedReward = function(reward){
    if (reward.selected === false) {
      reward.selected = true;
    } else {
      reward.selected = false;
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



.controller('studentHomeCtrl', ['$scope', '$stateParams', '$http', '$state', '$ionicModal', '$ionicActionSheet', '$ionicPopover', '$firebaseArray', 'sharedData',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $http, $state, $ionicModal, $ionicActionSheet, $ionicPopover, $firebaseArray, sharedData) {

  /*
    *************************************DECLARE FUNCTIONS FOR NG-SHOW********************************
  */

  $scope.allFalse = function() {
    $scope.studentHomeView = false;
    $scope.profileView = false;
    $scope.settingsView = false;
    $scope.classView = false;
    $scope.rulesItemsView = false;
    $scope.itemsView = false;
    $scope.rewardShopView = false;
    $scope.missionsView = false;
    $scope.archivedClassroomsToShow = false;
  }

  $scope.studentHomeForm = function() {
    $scope.allFalse();
    $scope.studentHomeView = true;
  }

  $scope.profileForm = function() {
    $scope.allFalse();
    if($scope.student.name.length > 32){
      $scope.student.name = CryptoJS.AES.decrypt($scope.student.name, sessionUser.uid).toString(CryptoJS.enc.Utf8);
      $scope.student.surname = CryptoJS.AES.decrypt($scope.student.surname, sessionUser.uid).toString(CryptoJS.enc.Utf8);
    }
    $scope.modelProfile = {};
    $scope.profileView = true;
  }

  $scope.settingsForm = function() {
    $scope.allFalse();
    $scope.settingsView = true;
  }

  $scope.rulesItemsForm = function(){
    $scope.allFalse();
    $scope.rulesItemsView = true;
  }

  $scope.itemsForm = function() {
    $scope.allFalse();
    $scope.itemsView = true;
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
    *************************************EVERY ACTIONSHEET GOES HERE*******************************
  */

                                          /* REWARDS (STUDENT PART) ACTIONSHEET */

  $scope.showActionsheetRewards = function() {
    $ionicActionSheet.show({
      titleText: 'ACCIONES RECOMPENSAS',
      buttons: [
        { text: 'COMPRAR RECOMPENSA(S)' },
      ],
      cancelText: 'CANCELAR',
      cancel: function() {
        //CANCEL ACTION
      },
      buttonClicked: function(index) {
        if (index === 0) {
          //BUY REWARDS ACTION
          $scope.showSelectRewardsModal();
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

  $scope.templateStudentHomePopover = '<ion-popover-view>'+
    '<ion-list class="list-elements">'+
      '<ion-item ng-hide="archivedClassroomsToShow" ng-click="showArchivedClassrooms(true)">VER ARCHIVADAS</ion-item>'+
      '<ion-item ng-show="archivedClassroomsToShow" ng-click="showArchivedClassrooms(false)">OCULTAR ARCHIVADAS</ion-item>'+
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

  $scope.selectRewardsModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">SELECCIONA RECOMPENSAS</h3>'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkReward" ng-repeat="rewardForSelection in rewardsForSelection" ng-click="changeSelectedReward(rewardForSelection)" ng-checked="rewardForSelection.selected">{{rewardForSelection.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeSelectRewardsModal()">{{ \'CANCEL\' | translate }}</button>'+
        '<button id="attendance-button123" ng-click="selectRewards()" id="attendance-btn123" class="button button-calm  button-block">SELECCIONAR RECOMPENSAS</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.addClassModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">INTRODUCE UN CODIGO DE CLASE</h3>'+
      '<form id="addClassHashCodeForm" class="list">'+
        '<label class="item item-input">'+
          '<input type="text" ng-model="modelAddClass.hashCode" placeholder="CODIGO DE CLASE">'+
        '</label>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalAddClass()">{{ \'CANCEL\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-disabled="!modelAddClass.hashCode" ng-click="addClass(modelAddClass.hashCode)">AÑADIR CLASE</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.achievementDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{achievement.name}}</h3>'+
      '<ion-list>'+
        '<ion-item class ="teacherAvatar">'+
          '<img src={{achievement.badge}} class="avatar">'+
        '</ion-item>'+
        '<label class="item item-input list-elements" id="signUp-input3">'+
          '<span class="inputLabelProfile">'+
            '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'DESCRIPTION\' | translate }}'+
            '<p>{{achievement.description}}</p>'+
          '</span>'+
        '</label>'+
        '<label class="item item-input list-elements" id="signUp-input3">'+
          '<span class="inputLabelProfile">'+
            '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'REQUIREMENTS\' | translate }}'+
            '<p>{{achievement.requirements}}</p>'+
          '</span>'+
        '</label>'+
        '<label class="item item-input list-elements" id="signUp-input3">'+
          '<span class="inputLabelProfile">'+
            '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PUNTOS NECESARIOS PARA PASAR DE NIVEL'+
            '<p>{{achievement.pointsToLevel}}</p>'+
          '</span>'+
        '</label>'+
        '<label class="item item-input list-elements" id="signUp-input3">'+
          '<span class="inputLabelProfile">'+
            '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;MAXIMO NIVEL'+
            '<p>{{achievement.maxLevel}}</p>'+
          '</span>'+
        '</label>'+
      '</ion-list>'+
      '<button ng-click="closeModalAchievementDialog()" class="button button-positive button-block icon ion-arrow-return-left"></button>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.missionDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{mission.name}</h3>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;RECOMPENSA'+
          '<p>{mission.reward}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PUNTOS ADICIONALES'+
          '<p>{mission.additionalPoints}</p>'+
        '</span>'+
      '</label>'+
      '<h3 id="teams-heading5" class="teams-hdg5">{{ \'ITEMS\' | translate }}</h3>'+
      '<ion-list id="items-list9" class="list-student">'+
        '<ion-item id="items-list-item15" ng-click="showModalItemDialog()">{item.name}</ion-item>'+
      '</ion-list>'+
      '<button ng-click="closeModalMissionDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
    '</ion-content>'+
  '</ion-modal-view>';

  $scope.rewardDialogModal = '<ion-modal-view>'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{reward.name}}</h3>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;{{ \'DESCRIPTION\' | translate }}'+
          '<p>{{reward.description}}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PERMISO'+
          '<p>{{reward.permission}}</p>'+
        '</span>'+
      '</label>'+
      '<label class="item item-input list-elements">'+
        '<span class="inputLabelProfile">'+
          '<i class="icon ion-minus-round"></i>&nbsp;&nbsp;PRECIO'+
          '<p>{{reward.price}}</p>'+
        '</span>'+
      '</label>'+
      '<button ng-click="closeModalRewardDialog()" class="button button-positive button-block icon ion-arrow-return-left"></button>'+
    '</ion-content>'+
  '</ion-modal-view>';

  /*
    *************************************EVERY MODAL FUNCTION GOES HERE*******************************
  */

                                        /* SELECT REWARDS MODAL */

  $scope.selectRewardsModal = $ionicModal.fromTemplate($scope.selectRewardsModal, {
    scope: $scope,
    animation: 'slide-in-up'
  })
  $scope.showSelectRewardsModal = function(){
    $scope.selectRewardsModal.show();
  }
  $scope.closeSelectRewardsModal = function(){
    $scope.selectRewardsModal.hide();
  }

                                        /* ADD CLASS MODAL */

  $scope.addClassModal = $ionicModal.fromTemplate($scope.addClassModal, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.showModalAddClass = function(){
    $scope.modelAddClass = {};
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
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */
  
  if (firebase.auth().currentUser === null) {
    $state.go('login');
  }
  
  firebase.auth().onAuthStateChanged(function(user) {
    if (user && sharedData.getData() === 'student') {
      sessionUser = firebase.auth().currentUser;
      var studentsArray = $firebaseArray(studentsRef);
      studentsArray.$loaded(function() {
        $scope.student = studentsArray.$getRecord(sessionUser.uid);
        $scope.student.name = CryptoJS.AES.decrypt($scope.student.name, sessionUser.uid).toString(CryptoJS.enc.Utf8);
        $scope.student.surname = CryptoJS.AES.decrypt($scope.student.surname, sessionUser.uid).toString(CryptoJS.enc.Utf8);
		    $scope.getClassrooms();
      })
    }
  });
  
  var itemModal;
  var sessionUser
  
  var rootRef = firebase.database().ref();

  var teachersRef = firebase.database().ref('teachers');
  var studentsRef = firebase.database().ref('students');
  var hashcodesRef = firebase.database().ref('hashcodes');
  var classroomsRef = firebase.database().ref('classrooms');

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */




                                          /* FUNCTIONS IN PROFILE */

  $scope.editStudentData = function(name, surname, school, avatar) {
    if (name != undefined) {
      $scope.student.name = name;
      var studentNameRef = firebase.database().ref('students/' + sessionUser.uid + '/name');
      studentNameRef.set(CryptoJS.AES.encrypt(name,sessionUser.uid).toString());
      sessionUser.updateProfile ({
        displayName : name + ' ' + $scope.student.surname,
      });
    }

    if (surname != undefined) {
      $scope.student.surname = surname;
      var studentSurnameRef = firebase.database().ref('students/' + sessionUser.uid + '/surname');
      studentSurnameRef.set(CryptoJS.AES.encrypt(surname,sessionUser.uid).toString());
      sessionUser.updateProfile ({
        displayName : $scope.student.name + ' ' + surname,
      });
    }

    if (school != undefined) {
      $scope.student.school = school;
      var studentSchoolRef = firebase.database().ref('students/' + sessionUser.uid + '/school');
      studentSchoolRef.set(school);
    }

    if (avatar != undefined) {
      $scope.student.avatar = avatar;
      var studentAvatarRef = firebase.database().ref('students/' + sessionUser.uid + '/avatar');
      studentAvatarRef.set(avatar);
      sessionUser.updateProfile ({
        photoURL : avatar,
      });
    }
    $scope.settingsForm();
    alert('DATOS CAMBIADOS');
  }

  $scope.updateStudentPassword = function(newPassword) {
    sessionUser.updatePassword(newPassword).then(function() {
      $scope.settingsForm();
      alert('CONTRASEÑA CAMBIADA');
    });
  }

  $scope.updateStudentEmail = function(email) {
    sessionUser.updateEmail(email).then(function() {
      var studentEmailRef = firebase.database().ref('students/' + sessionUser.uid + '/email');
      studentEmailRef.set(email);
      $scope.settingsForm();
      alert('EMAIL CAMBIADO');
    });
  }




                                        /* FUNCTIONS IN SETTINGS */

  $scope.logOut = function() {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
      $state.go('login');
      $scope.studentHomeForm();
    }
  }




                                          /* FUNCTIONS IN HOME */

  $scope.getClassrooms = function() {
    var studentClassroomsRef = firebase.database().ref('students/' + $scope.student.$id + '/classrooms');
    var classroomKeys = $firebaseArray(studentClassroomsRef);
    classroomKeys.$loaded(function() {
      $scope.classrooms = [];
      for (i = 0 ; i < classroomKeys.length ; i++) {
        var classKey = classroomKeys.$keyAt(i);
        var loopClassroom = firebase.database().ref('classrooms/' + classKey);
        loopClassroom.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            for(j = 0 ; j < $scope.classrooms.length ; j++) {
              if($scope.classrooms[j].id == snapshot.val().id) {
                change = true;
                index = j;
              }
            }
            if(!change) {
              $scope.classrooms.push(snapshot.val());            
            } else {
              $scope.classrooms[index] = snapshot.val();
            }
          }
        });
      }
    });
  }

  $scope.addClass = function(hashcode){
    var hashcodesArray = $firebaseArray(hashcodesRef);
    hashcodesArray.$loaded(function() {
      var classToAdd = hashcodesArray.$getRecord(hashcode);
      
      var classesRef = firebase.database().ref('classrooms/');
      var classesArray = $firebaseArray(classesRef);
      classesArray.$loaded(function() {
        var classroom = classesArray.$getRecord(classToAdd.id);
        if(classroom.open){
          var studentToEditRef = firebase.database().ref('students/' + $scope.student.$id + '/classrooms/' + classToAdd.id);
          studentToEditRef.set({
            'id' : classToAdd.id,
            'totalPoints' : 0,
            'studentLevel' : 1,
            'inClass' : true,
          });
          
          var classToEditRef = firebase.database().ref('classrooms/' + classToAdd.id + '/students/' + $scope.student.$id);
          classToEditRef.set(true);
        } else {
          alert('LA CLASE SE ENCUENTRA CERRADA');
        }
      }).then(function(){
        $scope.getClassrooms();
      })
    })
    $scope.closeModalAddClass();
  }

  $scope.setClassroom = function(classroom) {
    $scope.classroom = classroom;
    $scope.classroomData = null;
    var loopClassroom = firebase.database().ref('students/' + sessionUser.uid + '/classrooms/' + $scope.classroom.id);
      loopClassroom.on('value', function(snapshot) {
        $scope.classroomData = snapshot.val();
    });
    $scope.getItems();
    $scope.getTeams();
    $scope.getRewards();
    $scope.rulesItemsForm();
  }

  $scope.showArchivedClassrooms = function(value) {
    $scope.archivedClassroomsToShow = value;
    $scope.closePopoverStudentHome();
  }
                    
  
  

                                        /* FUNCTIONS IN ITEMS */

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
          if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
            $scope.$apply();
          }
        });
      }
    });
  }

  $scope.setItem = function(item) {
    $scope.item = item;
    $scope.getAchievements();
    $scope.itemsForm();
  }
                    
  
  

                                        /* FUNCTIONS IN ACHIEVEMENTS */

  $scope.getAchievements = function() {
    var itemAchievemntsRef = firebase.database().ref('items/' + $scope.item.id + '/achievements');
    var achievementKeys = $firebaseArray(itemAchievemntsRef);
    achievementKeys.$loaded(function() {
      $scope.achievements = [];
      for (i = 0 ; i < achievementKeys.length ; i++) {
        var achievementKey = achievementKeys.$keyAt(i);
        var loopAchievemnt = firebase.database().ref('achievements/' + achievementKey);
        loopAchievemnt.on('value', function(snapshot) {
          if(snapshot.val() != null) {
            var change = false;
            var index = -1;
            var achievement = snapshot.val();
            for(j = 0 ; j < $scope.achievements.length ; j++) {
              if(achievement.id == $scope.achievements[j].id) {
                change = true;
                index = j;
              }
            }
            if(!change) {
              $scope.achievements.push(achievement);
            } else {
              $scope.achievements[index] = achievement;
            }
          }
        });

      }
    });
  }

   $scope.setAchievement = function(achievement) {
    $scope.achievement = achievement;
    $scope.showModalAchievementDialog();
  }




                                          /* FUNCTIONS IN REWARDS */

  $scope.getRewards = function() {
    var classroomRewardsRef = firebase.database().ref('classrooms/' + $scope.classroom.id + '/rewards');
    var rewardKeys = $firebaseArray(classroomRewardsRef);
    rewardKeys.$loaded(function() {
      $scope.rewards = [];
      for (i = 0 ; i < rewardKeys.length ; i++) {
        var rewardKey = rewardKeys.$keyAt(i);
        var loopReward = firebase.database().ref('rewards/' + rewardKey);
        loopReward.on('value', function(snapshot) {
          if (snapshot.val() != null) {
            var change = false;
            var index = -1;
            var reward = snapshot.val();
            for(j = 0 ; j < $scope.rewards.length ; j++){
              if(reward.id == $scope.rewards[j].id){
                change = true;
                index = j;
              }
            }
            if(!change){
              $scope.rewards.push(reward);  
            } else {
              $scope.rewards[index] = reward;
            }
            $scope.getRewardsForSelection();
          }
        });
      }
    });
  }

  $scope.getRewardsForSelection = function() {
    $scope.rewardsForSelection = angular.copy($scope.rewards);
    for (var element in $scope.rewardsForSelection) {
      $scope.rewardsForSelection[element].selected = false;
    }
  }

  $scope.setReward = function(reward) {
    $scope.reward = reward;
    $scope.showModalRewardDialog();
  }

  $scope.buyReward = function(reward) {
    //THINGS TO DO
  }

  $scope.selectRewards = function() {
    $scope.closeSelectRewardsModal();
      for (var element in $scope.rewardsForSelection) {
        if ($scope.rewardsForSelection[element].selected === true) {
          $scope.buyReward($scope.rewardsForSelection[element]);
        }
      }
    $scope.rewardsForSelection = $scope.rewards;
  }

  $scope.changeSelectedReward = function(reward) {
    if (reward.selected === false) {
      reward.selected = true;
    } else {
      reward.selected = false;
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



.controller('settingsCtrl', ['$scope', '$ionicPopup',
  function($scope, $ionicPopup) {

    $scope.showHelpPopup = function() {
      $ionicPopup.alert({
        title: 'AYUDA',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu tristique nulla. Vestibulum nulla risus, tincidunt a ante at, euismod auctor diam. Etiam blandit velit ipsum, non accumsan ligula mattis facilisis. Nulla tristique facilisis nisl. Maecenas venenatis ipsum quis metus ultrices faucibus. Donec arcu risus, mollis facilisis massa sit amet, posuere efficitur mi. Praesent elementum justo nec felis accumsan consectetur. Cras rutrum lacinia magna, eu bibendum erat finibus vitae. Vestibulum iaculis sem sit amet ex ornare ornare. Vestibulum sodales velit non mauris pretium finibus.',
        buttons: [{
            text: 'Okay',
            type: 'button-positive'
          },
        ]
      }).then(function(res) {
        if(res) {
        } else {
        }
      });
    }

    $scope.showTermsPopup = function() {
      $ionicPopup.alert({
        title: 'TERMINOS Y CONDICIONES',
        content: 'Sed cursus rhoncus porta. Aenean sed ante a sem molestie posuere. In maximus sem justo, eu ultrices leo tincidunt sed. Nulla feugiat convallis luctus. Donec vitae sodales augue. Fusce tortor neque, tincidunt id felis vel, tincidunt aliquam nisl. Fusce maximus aliquam sodales.',
        buttons: [{
            text: 'Okay',
            type: 'button-positive'
          },
        ]
      }).then(function(res) {
        if(res) {
        } else {
        }
      });
    }

    $scope.showAboutPopup = function() {
      $ionicPopup.alert({
        title: 'ACERCA DE',
        content: 'Quisque convallis scelerisque lorem, et accumsan erat porttitor quis. Aenean tincidunt iaculis risus, eu aliquet turpis scelerisque at. Etiam est nisi, maximus sed ultricies quis, ornare et ex. Nam at fermentum arcu. Nullam risus ipsum, convallis et tortor in, tempor blandit tortor. Cras non viverra est, vel pellentesque lectus. Sed libero mi, tristique quis interdum sit amet, ornare at libero. Suspendisse cursus rutrum lectus, sit amet interdum nunc egestas in. Maecenas vitae luctus ligula. Donec vehicula mi sed leo elementum dictum. In magna dui, lobortis vitae dui at, viverra mattis erat. Aenean sit amet justo a ex porta scelerisque. Praesent nec rutrum urna, sed accumsan lorem.'
        +''
        +'Nullam ultrices tempor sem, ac lacinia ligula consectetur at. Quisque non elit sit amet dui tincidunt accumsan non ac lectus. Donec sit amet arcu finibus, commodo elit finibus, tincidunt dolor. Cras nec velit eget nibh sodales faucibus a pellentesque diam. Etiam volutpat tortor at varius euismod. Suspendisse eget justo quis enim ornare pellentesque. Vestibulum congue sed orci vel scelerisque. Vivamus ac accumsan nulla. Etiam euismod tortor in velit facilisis tristique.',
        buttons: [{
            text: 'Okay',
            type: 'button-positive'
          },
        ]
      }).then(function(res) {
        if(res) {
        } else {
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



.controller('changeLanguageCtrl', ['$translate', '$scope',
  function ($translate, $scope) {
 
    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey);
    };

    $scope.$on('changeLanguageEvent', function(event, args) {
      $scope.changeLanguage(args.language);
    });

}])