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
    var loc = window.location.href.split('/');
    var username = loc[loc.length - 1];

    // when confused button is clicked
    $scope.confused = function(){
      // emit not confused message to the server with username of this student
      socket.emit('confused', {username: username});
      // as of now setTimeout causes a bug where multiple student.html emit
      // not confused message at once, causing counter in teacher.html to go
      // negative
      // setTimeout($scope.cancel, 60000);
    };

    // when cancel button is clicked
    $scope.cancel = function() {
      // emit not confused message to the server with username of this student
      socket.emit('not confused', {username: username});
    };

    var enableConfused = function() {
      var confused = document.getElementsByClassName('confused')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // enable confused button
      confused.className = "confused enabled";
      confused.disabled = false;
      // disable cancel button
      cancel.disabled = true;
    }

    // listens to event emitted by the server for this specific student and
    // enable cancel button while disabling confused button
    socket.on('enable cancel on ' + username, function(data) {
      var confused = document.getElementsByClassName('confused')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // disable confused button
      confused.className = "confused disabled";
      confused.disabled = true;
      // enable cancel button
      cancel.disabled = false;
    });

    // listens to event emitted by the server for this specific student and
    // enable confused button while disabling cancel button
    socket.on('enable confused on ' + username, function(data) {
      enableConfused();
    });

    socket.on('resolved', function(data) {
      enableConfused();
    });
  })
  .controller('TeacherCtrl', function ($scope, socket) {
    // Calculates confusion rate and percentage
    var confusionCalculator = function() {
      $scope.confusionRate = ($scope.counter / 60).toFixed(4);
      $scope.percentage = $scope.confusionRate * 100 + "%";
    }

    // total number, rate, and percentage of confusion
    // if counter is stored, set counter to that or 0 if not
    $scope.counter = localStorage["confusedCounter"] || 0;
    confusionCalculator();

    // default threshold
    $scope.threshold = 50;

    // listens to 'add' event emitted by the server
    socket.on('add', function() {
      // this call seems to be executed outside of angular's context, so use
      // $scope.apply here. More info at http://stackoverflow.com/questions/24596056/angular-binding-not-updating-with-socket-io-broadcast
      $scope.$apply(function() {
        $scope.counter++;
        localStorage["confusedCounter"] = $scope.counter;
        confusionCalculator();
      });
      // if confusion rate is above 0.5, alert the teacher
      if ($scope.percentage > $scope.threshold) {
        swal({
          title: "Confused!",
          text: "Students are confused!",
          confirmButtonText: "Help them!"
        },
        // callback function that happens when teacher addresses a confusion
        function() {
          // emit confusion resolved message to server
          socket.emit("confusion resolved");
          // use $scope.apply to change counter
          $scope.$apply(function() {
            // reset the counter
            $scope.counter = 0;
            localStorage["confusedCounter"] = $scope.counter;
            confusionCalculator();
          });
        });
      }
    });

    socket.on('subtract', function() {
      $scope.$apply(function() {
        $scope.counter--;
        localStorage["confusedCounter"] = $scope.counter;
        confusionCalculator();
      });
    });

    // when teacher logs out, reset the confusion counter in local storage
    $scope.logout = function() {
      localStorage["confusedCounter"] = 0;
    };
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
