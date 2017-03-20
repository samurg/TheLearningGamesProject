angular.module('app.controllers', ['pascalprecht.translate'])
     
.controller('loginCtrl', ['$scope', '$stateParams', '$cookies', '$http', 'Backand', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cookies, $http, Backand,$state) {
	
	$scope.clearForm1 = function(){
    var form = document.getElementById("login-form1");
    form.reset();
  }

  $scope.clearForm2 = function(){
    var form = document.getElementById("login-form2");
    form.reset();
  }

  $scope.loginType=false;
  $scope.loginType2=false;

  $scope.teacherForm = function(){
      $scope.loginType=true;
      $scope.loginType2=false;
      $scope.clearForm2();
  }
  $scope.studentForm = function(){
      $scope.loginType=false;
      $scope.loginType2=true;
      $scope.clearForm1();
  }

  $scope.getTeacher = function(email, password) {
    $http.get(Backand.getApiUrl()+'/1/query/data/getTeacher'+'?parameters={ "email" : \"'+CryptoJS.SHA256(email).toString()+'\" , "password" : \"'+CryptoJS.SHA256(password).toString()+'\"}')
        .then(function (response) {
          if (response.data.length > 0) {
            $cookies.put('teacherId', response.data[0].id);
            $cookies.put('teacherName', CryptoJS.AES.decrypt(response.data[0].name, email).toString(CryptoJS.enc.Utf8));
            $cookies.put('teacherSurname', CryptoJS.AES.decrypt(response.data[0].surname, email).toString(CryptoJS.enc.Utf8));
            $cookies.put('teacherAvatar', response.data[0].avatar);
            $cookies.put('teacherEmail', email);
            $cookies.put('teacherPassword', password);
            $scope.teacherId = $cookies.get('teacherId');
            $state.go('teacherHome', {teacherId: $scope.teacherId});
          } else {
            alert('Wrong credentials');
          }
        });
  }


  /*
    This function returns the student's data when it is logged, 
    decrypts personal data, saves personal data in cookies 
    and goes to studentHome.
  */
  $scope.getStudent = function(hashCode) {
    $http.get(Backand.getApiUrl()+'/1/query/data/getStudentData'+'?parameters={ "hashCode" : \"'+hashCode+'\"}')
        .then(function (response) {
          if (response.data.length > 0) {
            $cookies.put('studentId', response.data[0].id);
            $cookies.put('studentName', CryptoJS.AES.decrypt(response.data[0].name, hashCode).toString(CryptoJS.enc.Utf8));
            $cookies.put('studentSurname', CryptoJS.AES.decrypt(response.data[0].surname, hashCode).toString(CryptoJS.enc.Utf8));
            $cookies.put('hashCode', response.data[0].hashCode)
            $cookies.put('studentAvatar', response.data[0].avatar);
            $scope.studentId = $cookies.get('studentId');
            $state.go('studentHome', {studentId: $scope.studentId});
          } else {
            alert('Wrong credentials');
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



.controller('signUpCtrl', ['$scope', '$stateParams', '$cookies', '$http', 'Backand', '$state',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cookies, $http, Backand, $state) {

	$scope.clearForm = function(){
    var form = document.getElementById("signUp-form2");
    form.reset();
  }

  $scope.checkTeacherEmail = function(name, surname, email, password, avatar) {
    $http.get(Backand.getApiUrl()+'/1/query/data/checkTeacherEmail'+'?parameters={ "email" : \"'+CryptoJS.SHA256(email).toString()+'\"}')
        .success(function (response) {
          if (response.length > 0) {
            $scope.permission = false;
            alert('Email already used');
          } else {
            $scope.permission = true;
            $scope.createTeacher(name, surname, email, password, avatar);
          }
        });
  }

  $scope.createTeacher = function(name, surname, email, password, avatar) {

    if (avatar == null) {
      avatar = 'https://easyeda.com/assets/static/images/avatar-default.png';
    }

    var teacher = {
      "name" : CryptoJS.AES.encrypt(name,email).toString(),
      "surname" : CryptoJS.AES.encrypt(surname,email).toString(),
      "email" : CryptoJS.SHA256(email).toString(),
      "password" : CryptoJS.SHA256(password).toString(),
      "avatar" : avatar
    }

    $http.post(Backand.getApiUrl()+'/1/objects/'+'teachers', teacher)
      .success(function(response){
        $state.go('login');
      })
    
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



.controller('teacherHomeCtrl', ['$scope', '$stateParams', '$ionicModal', '$http', 'Backand', '$cookies', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $http, Backand, $cookies, $state, NgTableParams) {

  /*
    *************************************DECLARE FUNCTIONS FOR NG-SHOW********************************
  */

  $scope.loginTypeTeacherHome=true;
  $scope.loginTypeTeacherProfile=false;
  $scope.loginTypeTeacherSettings=false;
    $scope.loginTypeSecondButtonBar=false;
      $scope.loginTypeClass=false;
      $scope.loginTypeTeam=false;
      $scope.loginTypeRules=false;
        $scope.loginTypeItems=false;
        $scope.loginTypeAchievements=false;
        $scope.loginTypeBadges=false;
      $scope.loginTypeMissions=false;

  $scope.teacherHomeForm = function(){
    $scope.loginTypeTeacherHome=true;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=false;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.teacherProfileForm = function(){
    $scope.initData();
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=true;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=false;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.teacherSettingsForm = function(){
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=true;
      $scope.loginTypeSecondButtonBar=false;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.secondButtonBarForm = function() {
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=true;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.classForm = function(){
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=true;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.teamsForm = function(){
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=true;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.rulesForm = function() {
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=true;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.itemsForm = function() {
    $scope.getItems();
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=true;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.achievementsForm = function() {
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=true;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=false;
  }

  $scope.badgesForm = function() {
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=true;
        $scope.loginTypeMissions=false;
  }

  $scope.missionsForm = function() {
    $scope.loginTypeTeacherHome=false;
    $scope.loginTypeTeacherProfile=false;
    $scope.loginTypeTeacherSettings=false;
      $scope.loginTypeSecondButtonBar=true;
        $scope.loginTypeClass=false;
        $scope.loginTypeTeam=false;
        $scope.loginTypeRules=false;
          $scope.loginTypeItems=false;
          $scope.loginTypeAchievements=false;
          $scope.loginTypeBadges=false;
        $scope.loginTypeMissions=true;
  }

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
    *************************************SAVE EVERY MODAL INTO $COOKIES*******************************
  */

  $cookies.put('attendanceModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3 id="attendance-heading3" class="attendance-hdg3">{{classroomName}}</h3>'+
      '<input class="dateInput" type="text" value="{{date | date:\'dd-MM-yyyy\'}}" readonly />'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkStudent" class="list-student" ng-repeat="student in students" ng-checked="student.inClass" ng-click="inClass(student)">{{student.name}}</ion-checkbox>'+
      '</ion-list>'+
      '<div class="button-bar action_buttons">'+
        '<button id="attendance-button123" ng-click="editStudentsAttendance(); closeAttendanceModal()" id="attendance-btn123" class="button button-calm  button-block">{{ \'SET_ATTENDANCE_FOR_TODAY\' | translate }}</button>'+
      '</div>'+
      '</ion-contentw>'+
      '</ion-modal-view>');

  $cookies.put('newClassModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_CLASS\' | translate }}</h3>'+
      '<form id="dataClassForm" class="list">'+
        '<label class="item item-input">'+
          '<span class="input-label">{{ \'CLASS_NAME\' | translate }}</span>'+
          '<input type="text" placeholder="" ng-model="name">'+
        "</label>"+
      "</form>"+
      "<div>"+
        '<form class="list">'+
          '<label class="item item-select">'+
            '<span class="input-label">{{ \'IMPORT_PREFERENCES_FROM\' | translate }}</span>'+
            '<select id="selectClass">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
              '<option>{classroom.name}</option>'+
            '</select>'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewClass() ; clearForm()">{{ \'CANCEL\' | translate }}</button>'+
            ''+
            '<button class="button button-calm  button-block" ng-click="createClassroom(name) ; closeModalNewClass() ; clearForm()">{{ \'CREATE\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '</ion-content>'+
      '</ion-modal-view>');

  $cookies.put('secondaryMenuModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'ASSIGN_STUDENT_TO_TEAM\' | translate }}</h3>'+
      '<form class="list">'+
        '<label class="item item-select">'+
          '<span class="input-label">{{ \'SELECT\' | translate }}</span>'+
          '<select id="selectTeam">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
          '</select>'+
        '</label>'+
        '<h3>{{ \'COPY_STUDENT_TO_ANOTHER_CLASS\' | translate }}</h3>'+
        '<label class="item item-select">'+
          '<span class="input-label">{{ \'SELECT\' | translate }}</span>'+
          '<select id="selectCopy">'+
              '<option>{{ \'NONE\' | translate }}</option>'+
              '<option ng-repat="class in classrooms">{{classroom.name}}</option>'+
          '</select>'+
        '</label>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalSecondary() ; clearFormModal()">{{ \'CANCEL\' | translate }}</button>'+
        ''+
        '<button class="button button-calm  button-block" ng-click="closeModalSecondary() ; clearFormModal()">{{ \'ACCEPT\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
      '</ion-modal-view>');

  $cookies.put('studentDialogModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h2>{{studentName}} {{studentSurname}}</h2>'+
      '<h3>{{studentHashCode}}</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'TAKE_PICTURE\' | translate }}</button>'+
        '<button  class="button button-light  button-block button-outline">{{ \'VIEW_PROFILE\' | translate }}</button>'+
        '<button ng-click="closeModalStudentDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
      '</div>'+
      '<div class="list-student list-elements">'+
        '<ion-list>'+
          '<ion-item class="list-student-dialog" ng-repeat="item in itemsStudent">'+
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
  '</ion-modal-view>');

  $cookies.put('newStudentModal', '<ion-modal-view hide-nav-bar="true" class="fondo" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_STUDENT\' | translate }}</h3>'+
      '<div class="list-student list-elements">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image"></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'TAKE_PICTURE\' | translate }}</button>'+
        '<form class="list">'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewStudentDialog() ; clearFormStudent()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-click="createStudent(name, surname) ; closeModalNewStudentDialog() ; clearFormStudent()">{{ \'GENERATE\' | translate }}</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
      '<div class="list-team list-elements">'+
        '<ion-list>'+
          '<form id="nameStudentForm" class="list">'+
            '<label class="item item-input">'+
              '<input type="text" ng-model="name" placeholder="{{ \'NAME\' | translate }}">'+
            '</label>'+
            '<label class="item item-input">'+
              '<input type="text" ng-model="surname" placeholder="{{ \'SURNAME\' | translate }}">'+
            '</label>'+
          '</form>'+
        '</ion-list>'+
        '<button class="button button-positive  button-block icon ion-android-more-horizontal" ng-click="showModalSecondary()"></button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>)');

  $cookies.put('teamDialogModal', '<ion-modal-view title="Team Dialog" hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{team.name}</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'CHANGE_AVATAR\' | translate }}</button>'+
        '<button  class="button button-light  button-block button-outline" ng-click="showModalEditTeam()">{{ \'EDIT_TEAM\' | translate }}</button>'+
        '<button ng-click="closeModalTeamDialog()" class="button button-positive  button-block icon ion-arrow-return-left"></button>'+
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
  '</ion-modal-view>');

  $cookies.put('newTeamDialogModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>New Team</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'UPLOAD_AVATAR\' | translate }}</button>'+
        '<form id="teamNameForm" class="list">'+
          '<label class="item item-input list-elements">'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}">'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewTeamDialog() ; clearFormTeam()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-click="closeModalNewTeamDialog() ; clearFormTeam()">{{ \'ACCEPT\' | translate }}</button>'+
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
  '</ion-modal-view>');

  $cookies.put('addStudentModal', '<ion-modal-view title="Add Student" hide-nav-bar="true" >'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>Add Students</h3>'+
      '<ion-list>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
        '<ion-checkbox class="list-student-team">{student.name}</ion-checkbox>'+
      '</ion-list>'+
      '<button ng-click="closeModalAddStudent()" class="button button-calm  button-block">{{ \'ADD_STUDENTS\' | translate }}</button>'+
    '</ion-content>'+
  '</ion-modal-view>');

  $cookies.put('editTeamModal', '<ion-modal-view title="Edit Team" hide-nav-bar="true" >'+
    '<ion-content padding="true" class="manual-ios-statusbar-padding">'+
      '<h3>{team.name}</h3>'+
      '<div class="list-student">'+
        '<div class="avatar_content">'+
          '<i class="icon ion-image" ></i>'+
        '</div>'+
        '<button  class="button button-light  button-block button-outline">{{ \'UPLOAD_AVATAR\' | translate }}</button>'+
        '<form id="teamNameForm" class="list">'+
          '<label class="item item-input list-elements">'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}">'+
          '</label>'+
          '<div class="button-bar action_buttons">'+
            '<button class="button button-calm  button-block" ng-click="closeModalEditTeam() ; clearFormTeam()">{{ \'CANCEL\' | translate }}</button>'+
            '<button class="button button-calm  button-block" ng-click="closeModalEditTeam() ; clearFormTeam()">{{ \'ACCEPT\' | translate }}</button>'+
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
  '</ion-modal-view>');

  $cookies.put('newMissionModal', '<ion-modal-view title="New Mission" hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<form id="missionDataForm" class="list">'+
        '<h3>{{ \'NEW_MISSION\' | translate }}</h3>'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{{ \'NAME\' | translate }}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'DESCRIPTION\' | translate }}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'PHASES\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'NUMBER_OF_PHASES\' | translate }}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'SCORES\' | translate }}</span>'+
            '<input type="text" placeholder="{{ \'SCORES_DESCRIPTION\' | translate }}">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button ng-click="closeModalNewMission() ; clearFormNewMission()" class="button button-calm  button-block">{{ \'CANCEL\' | translate }}</button>'+
        ''+
        '<button ng-click="closeModalNewMission() ; clearFormNewMission()" class="button button-calm  button-block">{{ \'ACCEPT\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>');

  $cookies.put('newItemModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
     '<h3>{{ \'NEW_ITEM\' | translate }}</h3>'+
      '<form id="itemDataForm" class="list list-student fullScreen">'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }}</span>'+
            '<input type="text" placeholder="{item.name}" ng-model="name">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{item.description}" ng-model="description">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
            '<input type="text" placeholder="{item.requirements}" ng-model="requirements">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'MAX_SCORE\' | translate }}</span>'+
            '<input type="text" placeholder="{item.name}" ng-model="maxPoints">'+
          '</label>'+
          '<span class="input-label">{{ \'SCORE\' | translate }}</span>'+
          '<div class="item range">'+
            '<i class="icon ion-thumbsup"></i>'+
            '<input type="range" name="volume" min="0" max="maxPoints" step="1" default="(maxPoints/2)" ng-model="scoreRange">&nbsp;{{scoreRange}}'+
          '</div>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewItem() ; clearFormItems() ; createItem(name, description, requirements, maxPoints, scoreRange)"">{{ \'ADD_ITEM\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewItem() ; clearFormItems()">{{ \'CANCEL\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>');

  $cookies.put('newAchievementModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_ACHIEVEMENT\' | translate }}</h3>'+
      '<form id="achievementDataForm" class="list list-student">'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{achievement.name}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{achievement.description}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
            '<input type="text" placeholder="{achievement.requirements}">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewAchievement() ; clearFormAchievements()">{{ \'ADD_ACHIEVEMENT\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewAchievement() ; clearFormAchievements()">{{ \'CANCEL\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>');

  $cookies.put('newBadgeModal', '<ion-modal-view hide-nav-bar="true" >'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
      '<h3>{{ \'NEW_BADGE\' | translate }}</h3>'+
      '<form id="badgeDataForm" class="list list-student">'+
        '<ion-list>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'NAME\' | translate }} </span>'+
            '<input type="text" placeholder="{badge.name}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'DESCRIPTION\' | translate }}</span>'+
            '<input type="text" placeholder="{badge.description}">'+
          '</label>'+
          '<label class="item item-input list-elements">'+
            '<span class="input-label">{{ \'REQUIREMENTS\' | translate }}</span>'+
            '<input type="text" placeholder="{badge.requirements}">'+
          '</label>'+
        '</ion-list>'+
      '</form>'+
      '<div class="button-bar action_buttons">'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewBadge() ; clearFormBadges()">{{ \'ADD_BADGE\' | translate }}</button>'+
        '<button class="button button-calm  button-block" ng-click="closeModalNewBadge() ; clearFormBadges()">{{ \'CANCEL\' | translate }}</button>'+
      '</div>'+
    '</ion-content>'+
  '</ion-modal-view>');

  $cookies.put('studentsEvaluateModal', '<ion-modal-view hide-nav-bar="true" id="page11">'+
    '<ion-content padding="false" class="manual-ios-statusbar-padding">'+
    '<div ng-show="loginTypeSelectItem">'+
      '<ion-list id="evaluate-list1" class="item list_tests">'+
        '<ion-item class="list-student-dialog" ng-repeat="item in items" ng-click="setItemSelected(item); selectStudentForm()">'+
          '{{item.name}}&nbsp;({{item.defaultPoints}})'+
        '</ion-item>'+
      '</ion-list>'+
    '</div>'+
    '<div ng-show="loginTypeSelectStudent">'+
      '<ion-list id="attendance-list7" class="list-elements">'+
        '<ion-checkbox id="attendance-checkbox2" name="checkStudent" class="list-student" ng-repeat="student in students" ng-checked="false" ng-click="toEvaluate(student)">{{student.name}}</ion-checkbox>'+
      '</ion-list>'+
    '</div>'+
    '<div class="button-bar action_buttons">'+
    '<button class="button button-calm" ng-click="closeModalEvaluateStudent()">{{ \'CANCEL\' | translate }}</button>'+
    '<button class="button button-calm" ng-click="setScore(); closeModalEvaluateStudent()">{{ \'SET_ITEM\' | translate }}</button>'+
    '</div></ion-content>'+
    '</ion-modal-view>');

  /*
    *************************************EVERY MODAL FUNCTION GOES HERE*******************************
  */
                                        /* ATTENDANCE MODAL */
  $scope.attendanceModal = $ionicModal.fromTemplate($cookies.get('attendanceModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showAttendanceModal = function(){
    $scope.classroomName = $cookies.get('classroomName');
    $scope.getStudents();
    if ($scope.students.length > 0) {
      $scope.attendanceModal.show();
    }
    $scope.date = Date.now(); 
  }
    
  $scope.closeAttendanceModal = function(){
    $scope.attendanceModal.hide();
  }

                                        /* NEW CLASS MODAL */
  $scope.newClassModal = $ionicModal.fromTemplate($cookies.get('newClassModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  })

  $scope.showModalNewClass = function(){
    $scope.newClassModal.show();  
  }
    
  $scope.closeModalNewClass = function(){
    $scope.newClassModal.hide();
  }

                                        /* SECONDARY MENU MODAL */

  $scope.secondaryMenuModal = $ionicModal.fromTemplate( $cookies.get('secondaryMenuModal'), {
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
    $scope.secondaryMenuModal.hide();
    if(modalFirst == 1)
      $scope.studentDialogModal.show(); 
    if(modalFirst == 2)
      $scope.newStudentModal.show();
  }

                                        /* STUDENT DIALOG MODAL */

  $scope.studentDialogModal = $ionicModal.fromTemplate($cookies.get('studentDialogModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });
 
  $scope.showModalStudentDialog = function(student){
    $scope.studentProfileId = student.id;
    $scope.studentDialogModal.show();  
  }
    
  $scope.closeModalStudentDialog = function(){
    $scope.studentDialogModal.hide();
  }

                                        /* NEW STUDENT DIALOG MODAL */

  $scope.newStudentModal = $ionicModal.fromTemplate($cookies.get('newStudentModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });
    
  $scope.showModalNewStudentDialog = function(){
    $scope.newStudentModal.show();  
  }
    
  $scope.closeModalNewStudentDialog = function(){
    $scope.newStudentModal.hide();
  }

                                        /* TEAM DIALOG MODAL */  

  $scope.teamDialogModal = $ionicModal.fromTemplate($cookies.get('teamDialogModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalTeamDialog = function(){
    $scope.teamDialogModal.show();  
  }
    
  $scope.closeModalTeamDialog = function(){
    $scope.teamDialogModal.hide();
  }

                                        /* NEW TEAM DIALOG MODAL */

  $scope.newTeamDialogModal = $ionicModal.fromTemplate($cookies.get('newTeamDialogModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewTeamDialog = function(){
    $scope.newTeamDialogModal.show();  
  }
    
  $scope.closeModalNewTeamDialog = function(){
    $scope.newTeamDialogModal.hide();
  }

                                        /* ADD STUDENT MODAL */

  $scope.addStudentModal = $ionicModal.fromTemplate($cookies.get('addStudentModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });
    
  $scope.showModalAddStudent = function(){
    $scope.addStudentModal.show();  
  }
    
  $scope.closeModalAddStudent = function(){
    $scope.addStudentModal.hide();
  }

                                        /* EDIT TEAM MODAL */

  $scope.editTeamModal = $ionicModal.fromTemplate($cookies.get('editTeamModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalEditTeam = function(){
    $scope.editTeamModal.show();  
  }
    
  $scope.closeModalEditTeam = function(){
    $scope.editTeamModal.hide();
  }

                                        /* NEW MISSION MODAL */

  $scope.newMissionModal = $ionicModal.fromTemplate($cookies.get('newMissionModal'),  {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewMission = function(){
    $scope.newMissionModal.show();  
  }
    
  $scope.closeModalNewMission = function(){
    $scope.newMissionModal.hide();
  }

                                        /* NEW ITEM MODAL */

  $scope.newItemModal = $ionicModal.fromTemplate($cookies.get('newItemModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewItem = function(){
    $scope.newItemModal.show();  
  }
    
  $scope.closeModalNewItem = function(){
    $scope.newItemModal.hide();
  }

                                        /* NEW ACHIEVEMENT MODAL */

  $scope.newAchievementModal = $ionicModal.fromTemplate($cookies.get('newAchievementModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewAchievement = function(){
    $scope.newAchievementModal.show();  
  }
    
  $scope.closeModalNewAchievement = function(){
    $scope.newAchievementModal.hide();
  }

                                        /* NEW BADGE MODAL */
  $scope.newBadgeModal = $ionicModal.fromTemplate($cookies.get('newBadgeModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalNewBadge = function(){
    $scope.newBadgeModal.show();  
  }
    
  $scope.closeModalNewBadge = function(){
    $scope.newBadgeModal.hide();
  }

                                       /* STUDENTS EVALUATE MODAL */
  $scope.studentsEvaluateModal = $ionicModal.fromTemplate($cookies.get('studentsEvaluateModal'), {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.showModalEvaluateStudent = function(){
      //To clear the array of students to evaluate
      $scope.studentsToEvaluate = [];
      $scope.loginTypeSelectItem=true;
      $scope.loginTypeSelectStudent=false;
      $scope.studentsEvaluateModal.show();  
  }
    
  $scope.closeModalEvaluateStudent = function(){
      $scope.studentsEvaluateModal.hide();
  }

  /*
    *************************************CLEAN FORM FUNCTIONS GOES HERE*******************************
  */

  $scope.clearForm = function(){
    var form = document.getElementById("dataClassForm");
    form.reset();
    document.getElementById("selectClass").selectedIndex = 0;
  }

  $scope.clearFormModal = function(){
    var selectTeam = document.getElementById("selectTeam").selectedIndex = 0;
    var selectCopy = document.getElementById("selectCopy").selectedIndex = 0;
  }

  $scope.clearFormStudent = function(){
    var form = document.getElementById("nameStudentForm");
    form.reset();
  }

  $scope.clearFormTeam = function(){
    var form = document.getElementById("teamNameForm");
    form.reset();
  }

  $scope.clearFormTeacherProfile  = function(){
    var form = document.getElementById('teacherProfile-form1');
    form.reset();
    $scope.initData();
  }

  $scope.clearFormNewMission = function(){
    var form = document.getElementById("missionDataForm");
    form.reset();
  }

  $scope.clearFormItems = function(){
    var form = document.getElementById("itemDataForm");
    form.reset();
  }

  $scope.clearFormAchievements = function(){
    var form = document.getElementById("achievementDataForm");
    form.reset();
  }

  $scope.clearFormBadges = function(){
    var form = document.getElementById("badgeDataForm");
    form.reset();
  }

  /*
    *************************************DECLARE VARIABLES & GIVE TO $SCOPE ALL THE VALUES WE NEED****
  */

  $scope.teacherId = $cookies.get('teacherId');
  $scope.classroomId = $cookies.get('classroomId');
  $scope.classroomName = $cookies.get('classroomName');

  $scope.classrooms = $cookies.get('classrooms');

  var modalFirst;

  $scope.students = [];
  $scope.items = [];
  $scope.studentsToEvaluate = [];

  //Item that the teacher select when he is going to evaluate
  $scope.selectedItem;

  $scope.itemsStudent =[];

  //For the student selected, used as a parameter in a query for hir items
  $scope.studentProfileId;

  $scope.studentId;
  $scope.studentName;

  /*
    *************************************EVERY FUNCTIONALITY FUNCTION GOES HERE***********************
  */
                                        /* FUNCTIONS IN TEACHER HOME */

  $scope.getClassrooms = function() {
    $http.get(Backand.getApiUrl()+'/1/query/data/getClassrooms'+'?parameters={ "teacher" : \"'+$scope.teacherId+'\"}')
      .then(function (response) {
        $scope.classrooms = response.data;
        $cookies.put('classrooms', response.data);
      });
  }

  $scope.getStudents = function() {
    $http.get(Backand.getApiUrl()+'/1/query/data/getStudents'+'?parameters={ "classroomId" : \"'+$scope.classroomId+'\"}')
      .then(function (response) {
        $scope.students = response.data;
      });
  }

  $scope.getStudentsAttendance = function() {
    checked = [];
    $http.get(Backand.getApiUrl()+'/1/query/data/getStudents'+'?parameters={ "classroomId" : \"'+$scope.classroomId+'\"}')
      .then(function (response) {
        $scope.studentsAttendance = response.data;
        for(var i = 0; i< $scope.studentsAttendance.length; i++){
          checked.push(response.data[i].hashCode);
        }
        $cookies.put('studentsAttendance',response.data);
      });
  }

  $scope.setClassroomId = function(value) {
    $scope.classroomId = value;
    $cookies.put('classroomId', value);
  }

  $scope.setClassroomName = function(value) {
    $scope.classroomName = value;
    $cookies.put('classroomName', value);
  }

  $scope.setStudent = function(value) {
    $scope.studentId = value.id;
    $scope.studentHashCode = value.hashCode;
    $cookies.put('studentId', value.id);
    $cookies.put('studentHashCode', value.hashCode);
  }

  $scope.setStudentName = function(name, surname, hashCode) {
    $scope.studentName = name;
    $scope.studentSurname = surname;
    $scope.studentHashCode = hashCode;
    $cookies.put('studentName', name);
    $cookies.put('studentSurname', surname);
    $cookies.put('studentHashCode', hashCode);
  }
  
  $scope.createClassroom = function(name) {

    var classroom = {
      "name" : name,
      "description" : " ",
      "teacher" : $scope.teacherId
    }

    $http.post(Backand.getApiUrl()+'/1/objects/'+'classrooms', classroom)
      .success(function(response){
        $scope.getClassrooms();
      })
  }

  $scope.deleteClassroom = function() {
    $http.delete(Backand.getApiUrl()+'/1/objects/'+'classrooms/' + $scope.classroomId)
      .success(function(response){
        $scope.getClassrooms()
      })
  }

                                        /* FUNCTIONS IN TEACHER PROFILE */

    $scope.initData = function(){
      $scope.teacherId = $cookies.get('teacherId');
      $scope.teacherAvatar = $cookies.get('teacherAvatar');
      $scope.teacherName = $cookies.get('teacherName');
      $scope.teacherSurname = $cookies.get('teacherSurname');
      $scope.teacherEmail = $cookies.get('teacherEmail');
      $scope.teacherPassword = $cookies.get('teacherPassword');

      //Getting all the inputs for change their placeholders
      var input1 = document.getElementById ("inputName");
      input1.placeholder = $scope.teacherName;

      var input2 = document.getElementById ("inputSurname");
      input2.placeholder = $scope.teacherSurname;

      var input3 = document.getElementById ("inputEmail");
      input3.placeholder = $scope.teacherEmail;

      var input4 = document.getElementById ("inputPassword");
      input4.placeholder = $scope.teacherPassword;

      var input5 = document.getElementById ("inputRepeatpassword");
      input5.placeholder = $scope.teacherPassword;

      var input6 = document.getElementById ("inputAvatar");
      input6.placeholder = $scope.teacherAvatar;
    }

    $scope.getTeacherData = function() {
        $http.get(Backand.getApiUrl()+'/1/query/data/getStudents'+'/'+$scope.teacherId)
          .then(function (response) {
            $scope.teacherAvatar = response.data[0].avatar;
            $scope.teacherName = response.data[0].name;
            $scope.teacherSurname = response.data[0].surname;
            $scope.teacherEmail = response.data[0].email;
            $scope.teacherPassword = response.data[0].password;
            $cookies.put('teacherName', CryptoJS.AES.decrypt(response.data[0].name, email).toString(CryptoJS.enc.Utf8));
            $cookies.put('teacherSurname', CryptoJS.AES.decrypt(response.data[0].surname, email).toString(CryptoJS.enc.Utf8));
            $cookies.put('teacherAvatar', response.data[0].Avatar);
          });
    }

    $scope.checkTeacherEmail = function(name, surname, email, password, avatar) {

      if (email == null || email == $cookies.get('teacherEmail')) {
        email = $cookies.get('teacherEmail');
        $scope.editTeacher(name, surname, email, password, avatar);
        $scope.getTeacherData();
      } else {
        $http.get(Backand.getApiUrl()+'/1/query/data/checkTeacherEmail'+'?parameters={ "email" : \"'+CryptoJS.SHA256(email).toString()+'\"}')
          .success(function (response) {
            if (response.length > 0) {
              $scope.permission = false;
              alert('Email already used');
            } else {
              $scope.permission = true;
              $scope.editTeacher(name, surname, email, password, avatar);
              $scope.getTeacherData();
            }
          });
      }
    }

    $scope.editTeacher = function(name, surname, email, password, avatar) {

      $scope.teacherId = $cookies.get('teacherId');

      if (avatar == null) {
        avatar = $cookies.get('teacherAvatar');
      }

      var teacher = {
        "name" : CryptoJS.AES.encrypt(name,email).toString(),
        "surname" : CryptoJS.AES.encrypt(surname,email).toString(),
        "email" : CryptoJS.SHA256(email).toString(),
        "password" : CryptoJS.SHA256(password).toString(),
        "avatar" : avatar
      }
      
      $http.put(Backand.getApiUrl()+'/1/objects/'+'teachers/'+$scope.teacherId, teacher)
        .success(function(response) {
          $cookies.put('teacherEmail', email);
          $cookies.put('teacherPassword', password);
          $cookies.put('teacherName', name);
          $cookies.put('teacherSurname', surname);
          $cookies.put('teacherAvatar', avatar);
          $scope.clearFormTeacherProfile();
        })

      }

                                        /* FUNCTIONS IN CLASS */

    $scope.getItems = function() {
      $http.get(Backand.getApiUrl()+'/1/query/data/getItems'+'?parameters={ "classroom" : \"'+$scope.classroomId+'\"}')
        .then(function (response) {
          $scope.items = response.data;
          $cookies.put('items', response.data);
        });
    }

    $scope.getItemsStudent = function(){
      $http.get(Backand.getApiUrl()+'/1/query/data/getStudentItems'+'?parameters={ "classroom" : \"'+$scope.studentProfileId+'\"}')
          .then(function (response) {
            $scope.itemsStudent = response.data;
          });
    }

    $scope.addStudentToArray = function(student){
      if($scope.studentsToEvaluate.length > 0)
        $scope.studentToEvaluate = [];
      $scope.studentsToEvaluate.push(student);
    }

    $scope.inClass = function (student) {
      var pos = $scope.students.indexOf(student);
      if ($scope.students[pos].inClass === false) {
        $scope.students[pos].inClass = true;
      } else {
        $scope.students[pos].inClass = false;
      }
    }

    $scope.toEvaluate = function(student){
      if ($scope.studentsToEvaluate.indexOf(student) >= 0) {
        var pos = $scope.studentsToEvaluate.indexOf(student);
        $scope.studentsToEvaluate.splice(pos, 1);
      } else {
        $scope.studentsToEvaluate.push(student);
      }
    }

    $scope.setScore = function(){

      for (var i = 0; i < $scope.studentsToEvaluate.length; i++) {
        if($scope.studentsToEvaluate[i].items >= 0){
          var studentId = $scope.studentsToEvaluate[i].id;
          var teacherStudent = { 
            "name" : studentsToEvaluate.length[i].name,
            "surname" : studentsToEvaluate.length[i].surname,
            "classroom" : classroomId,
            "hashCode" : studentsToEvaluate.length[i].hash,
            "avatar" : 'https://easyeda.com/assets/static/images/avatar-default.png',
            "inClass" : true,
            "items" : $scope.studentsToEvaluate[i].items.push($scope.selectedItem)
          }
        }
        $http.put(Backand.getApiUrl()+'/1/objects/'+'teacherStudents/'+studentId, $scope.studentsToEvaluate[i])
          .success(function(response) {
            $scope.getStudents();
          })
      }
      }

    $scope.createStudent = function(name, surname) {
      var a = CryptoJS.SHA1($scope.studentName + $scope.classroomId + Date.now().toString()).toString();
      var hash = a.substr(0, 10).toUpperCase();

      var teacherStudent = { 
        "name" : name,
        "surname" : surname,
        "classroom" : $scope.classroomId,
        "hashCode" : hash,
        "avatar" : 'https://easyeda.com/assets/static/images/avatar-default.png',
        "inClass" : true
      }

      var student = {
        "name" : CryptoJS.AES.encrypt(name,hash).toString(),
        "surname": CryptoJS.AES.encrypt(surname,hash).toString(),
        "hashCode" : hash,
        "avatar" : 'https://easyeda.com/assets/static/images/avatar-default.png'
      }

      $http.post(Backand.getApiUrl()+'/1/objects/'+'teacherStudents', teacherStudent)
        .success(function(response){
          $scope.getStudents();
      })

      $http.post(Backand.getApiUrl()+'/1/objects/'+'students', student)
        .success(function(response){
      })

    }
    
    $scope.editStudentsAttendance = function() {
      for (var i = 0; i < $scope.students.length; i++) {
        var studentId = $scope.students[i].id;
        $http.put(Backand.getApiUrl()+'/1/objects/'+'teacherStudents/'+studentId, $scope.students[i])
          .success(function(response) {
            $scope.getStudents();
          })
      }
      
    }
    
    $scope.deleteStudent = function() {
      $http.delete(Backand.getApiUrl()+'/1/objects/'+'teacherStudents/'+$scope.studentId)
        .success(function(response){
          $scope.getStudents();
        })

      $http.get(Backand.getApiUrl()+'/1/query/data/getStudentsByHashCode'+'?parameters={ "hashCode" : \"'+$scope.studentHashCode+'\"}')
        .then(function (response) {
          $scope.studentForDelete = response.data[0].id;

          $http.delete(Backand.getApiUrl()+'/1/objects/'+'students/'+$scope.studentForDelete)
            .success(function(response){
            
            })
        });
    }

                                            /* FUNCTIONS IN ITEMS */
    $scope.createItem = function(name, description, requirements, maxPoints, scoreRange){
        var item = {
          "name" : name,
          "description" : description,
          "defaultPoints" : scoreRange,
          "maxPoints" : maxPoints,
          "classroom" : $scope.classroomId
        }

        $http.post(Backand.getApiUrl()+'/1/objects/'+'items/', item)
        .success(function(response){
          $scope.getItems();
          $scope.clearForm();
        })
    }

    $scope.setItemSelected = function(item) {
      $scope.selectedItem = item;
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



.controller('studentHomeCtrl', ['$scope', '$stateParams', '$cookies', '$http', 'Backand', '$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $cookies, $http, Backand, $state) {

  $scope.loginTypeStudentHome=true;
  $scope.loginTypeStudentAchievements=false;
  $scope.loginTypeStudentBadges=false;

  $scope.studentHomeForm = function(){
    $scope.loginTypeStudentHome=true;
    $scope.loginTypeStudentAchievements=false;
    $scope.loginTypeStudentBadges=false;
  }

  $scope.studentAchievementsForm = function(){
    $scope.loginTypeStudentHome=false;
    $scope.loginTypeStudentAchievements=true;
    $scope.loginTypeStudentBadges=false;
  }

  $scope.studentBadgesForm = function(){
    $scope.loginTypeStudentHome=false;
    $scope.loginTypeStudentAchievements=false;
    $scope.loginTypeStudentBadges=true;
  }

  $scope.initData = function(){
    $scope.studentAvatar = $cookies.get('studentAvatar');
    $scope.studentName = $cookies.get('studentName');
    $scope.studentSurname = $cookies.get('studentSurname');
    $scope.hashCode = $cookies.get('hashCode');

      //Getting all the inputs for change their placeholders
      var input1 = document.getElementById ("inputName");
      input1.placeholder = $scope.studentName;

      var input2 = document.getElementById ("inputSurname");
      input2.placeholder = $scope.studentSurname;

      var input6 = document.getElementById ("inputAvatar");
      input6.placeholder = $scope.studentAvatar;

      $scope.getClassroomByHashCode();

  }

  $scope.clearForm  = function(){
    var form = document.getElementById('studentHome-form1');
    form.reset();
    $state.go('studentHome', {"studentFullName": $scope.studentName + $scope.studentSurname});
  }

  $scope.getClassroomByHashCode = function() {
    $http.get(Backand.getApiUrl()+'/1/query/data/getClassroomByHashCode'+'?parameters={ "hashCode" : \"'+$scope.hashCode+'\"}')
      .success(function (response) {
        $scope.classroomId = response[0].id;
        $cookies.put('classroomId', response[0].id);

        $scope.getItems(response[0].id);

      });
  }

  $scope.getItems = function(classroomId) {
    $http.get(Backand.getApiUrl()+'/1/query/data/getItems'+'?parameters={ "classroom" : \"'+classroomId+'\"}')
      .then(function (response) {
        $scope.items = response;
        $cookies.put('items', response);
      });
  }

  $scope.editStudent = function(name, surname, avatar) {

    $scope.studentId = $cookies.get('studentId');

    if (avatar == null) {
      avatar = $cookies.get('studentAvatar');
    }

    var student = {
      "name" : CryptoJS.AES.encrypt(name, $scope.hashCode).toString(),
      "surname" : CryptoJS.AES.encrypt(surname, $scope.hashCode).toString(),
      "avatar" : avatar
    }

    $http.put(Backand.getApiUrl()+'/1/objects/'+'students/'+$scope.studentId, student)
      .success(function(response) {
        $cookies.put('studentName', name);
        $cookies.put('studentSurname', surname);
        $cookies.put('studentAvatar', avatar);
        $scope.clearForm();
      })
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



.controller('changeLanguageCtrl', ['$translate', '$scope', '$cookies', 
  function ($translate, $scope, $cookies) {
 
      $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
      };
}])