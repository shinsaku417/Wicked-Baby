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
  });
