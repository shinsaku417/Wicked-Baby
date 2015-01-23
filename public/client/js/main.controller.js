'use strict';

angular.module('wickedBaby', [])
  .controller('MainCtrl', function ($scope, LoginFactory, socket) {

    // emit login messages
    $scope.emitMessage = function(person){
      var personLogin = person + ' login';
      socket.emit(personLogin);
      LoginFactory.login(person);
    };

    $scope.studentLogin = function(){
      $scope.emitMessage('student');
    };

    $scope.teacherLogin = function(){
      $scope.emitMessage('teacher');
    };
  })
  .controller('StudentCtrl', function ($scope, socket) {
    // emit 'confused' event to the server when the confused button is clicked
    $scope.confused = function(){
      socket.emit('confused');
    };

  })
  .controller('TeacherCtrl', function ($scope, socket) {
    // total number, rate, and percentage of confusion
    $scope.counter = 0;
    $scope.confusionRate = $scope.counter / 60;
    $scope.percentage = $scope.confusionRate * 100 + "%";
    // listens to 'add' event emitted by the server
    socket.on('add', function() {
      // this call seems to be executed outside of angular's context, so use
      // $scope.apply here. More info at http://stackoverflow.com/questions/24596056/angular-binding-not-updating-with-socket-io-broadcast
      $scope.$apply(function() {
        $scope.counter++;
        $scope.confusionRate = $scope.counter / 60;
        $scope.percentage = $scope.confusionRate * 100 + "%";
      });
      // if confusion rate is above 0.5, alert the teacher
      if ($scope.confusionRate > 0.5) {
        alert('confused');
      }
    });

  })
  // login Helper
  .factory('LoginFactory', function($http, $location) {
    var login = function(person) {
      // redirect to /student or /teacher
      window.location.href = 'http://127.0.0.1:8000/' + person;
    };

    return {
      login: login
    }
  })
  .factory('socket', function() {
    // connect to the local host and return the socket
    var socket = io.connect('http://127.0.0.1:8000/');
    return socket;
  })
