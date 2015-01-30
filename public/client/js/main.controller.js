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
  .controller('TeacherCtrl', function ($scope, socket, Dashboard) {
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
    
    Dashboard.fetchData().then(function(data){
      console.log('success!')
      Dashboard.render(data);
    }).catch(function(err){
      if (err) throw err;
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
  .factory('Dashboard', function($http){
    // creates dashboard in teacher view
    var dataset = [
      {name: 'Shu', confused: 60},
      {name: 'Shin', confused: 80},
      {name: 'Alice', confused: 70},
      {name: 'Fred', confused: 5},
      {name: 'Phillip', confused: 30},
      {name: 'Marcus', confused: 50},
      {name: 'Tony', confused: 20},
      {name: 'Pamela', confused: 60},
      {name: 'Dan', confused: 8},
      {name: 'Tessa', confused: 17},
      {name: 'Scott', confused: 32},
      {name: 'Adrian', confused: 54},
      {name: 'Pira', confused: 49},
      {name: 'Josh', confused: 33}
    ];

    var w = 1024;
    var h = 612;
    var bgColor = "#FFFFE6"
    var barW = 25;
    var margin = 25;
    var scale = 6;
    var url = //

    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .style("background-color", bgColor);
  
    // does a GET request to the server and returns a dataset containing student names and confused variables
    var fetchData = function(){
      return $http({
        method: 'GET',
        url: url
      });
    };

    var render = function(dataset){
      svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          return margin + i * (w / dataset.length);
        })
        .attr("y", function(d) {
          return h - (d.confused * scale);
        })
        .attr("width", barW)
        .attr("height", function(d) {
          return d.confused * scale;
        })
        .attr("fill", "lightgreen");

      svg.selectAll(".name")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "name")
        .text(function(d) {
          return d.name
        })
        .attr("x", function(d, i) {
          return margin + i * (w / dataset.length) + barW / 2;
        })
        .attr("y", function(d) {
          return h - (d.confused * scale) - 10;
        })
        .attr("text-anchor", "middle");

      svg.selectAll(".num")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "num")
        .text(function(d) {
          return d.confused;
        })
        .attr("x", function(d, i) {
          return margin + i * (w / dataset.length) + barW / 2;
        })
        .attr("y", function(d) {
          return h - (d.confused * scale) + 20;
        })
        .attr("text-anchor", "middle");
    };

    return {
      render:render,
      fetchData:fetchData
    };
  });








