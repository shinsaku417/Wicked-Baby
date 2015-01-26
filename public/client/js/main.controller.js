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

    // when confused button is clicked
    $scope.confused = function(){
      var confused = document.getElementsByClassName('confused')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // disable confused button
      confused.className = "disabled";
      confused.disabled = true;
      // enable cancel button
      cancel.disabled = false;
      // emit message to the server
      socket.emit('confused');
      // confusion automatically disappears 1 min after pressing the button
      setTimeout($scope.cancel, 60000);
    };

    // when cancel button is clicked
    $scope.cancel = function() {
      var confused = document.getElementsByClassName('disabled')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // enable confused button
      confused.className = "confused";
      confused.disabled = false;
      // disable cancel button
      cancel.disabled = true;
      // emit message to the server
      socket.emit('not confused');
    };
  })
  .controller('TeacherCtrl', function ($scope, socket) {
    // Calculates confusion rate and percentage
    var confusionCalculator = function() {
      $scope.confusionRate = ($scope.counter / 60).toFixed(2);
      $scope.percentage = $scope.confusionRate * 100 + "%";
    }
    
    // total number, rate, and percentage of confusion
    $scope.counter = 0;
    confusionCalculator();

    // default threshold
    $scope.threshold = 50;

    // listens to 'add' event emitted by the server
    socket.on('add', function() {
      // this call seems to be executed outside of angular's context, so use
      // $scope.apply here. More info at http://stackoverflow.com/questions/24596056/angular-binding-not-updating-with-socket-io-broadcast
      $scope.$apply(function() {
        $scope.counter++;
        confusionCalculator();
      });
      // if confusion rate is above 0.5, alert the teacher
      if ($scope.percentage > $scope.threshold) {
        swal({
          title: "Confused!",
          text: "Students are confused!",
          confirmButtonText: "Help them!"
        });
      }
    });

    socket.on('subtract', function() {
      $scope.$apply(function() {
        $scope.counter--;
        confusionCalculator();
      });
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
  });
