'use strict';

angular.module('wickedBaby', [])
  .controller('MainCtrl', function ($scope) {

    $scope.emitMessage = function(person){
      var socket = io();
      var personLogin = person + ' login';
      socket.emit(personLogin);
    };

    $scope.studentLogin = function(){
      $scope.emitMessage('student');
    };

    $scope.teacherLogin = function(){
      $scope.emitMessage('teacher');
    };
  })
  .controller('StudentCtrl', function ($scope) {

    $scope.confused = function(){
      var socket = io();
      socket.emit('confused');
    };

  })
  .controller('TeacherCtrl', function ($scope) {
    $scope.counter = 0;
    $scope.confusionRate = $scope.counter / 60;
    $scope.percentage = $scope.confusionRate * 100 + "%";

    var socket = io();
    socket.on('confused', function() {
      $scope.counter++;
      if ($scope.confusionRate > 0.5) {
        alert('confused');
      }
    });

  });
