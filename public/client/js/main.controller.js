'use strict';

angular.module('wickedBaby', [])
  .controller('MainCtrl', function ($scope, LoginFactory, socket) {

    // Emit custom login events to the server
    $scope.emitMessage = function(person){
      var personLogin = person + ' login';
      socket.emit(personLogin);
      LoginFactory.login(person);
    };

    // Call emitMessage when a student logs in
    $scope.studentLogin = function(){
      $scope.emitMessage('student');
    };

    // Call emitMessage when a teacher logs in
    $scope.teacherLogin = function(){
      $scope.emitMessage('teacher');
    };
  })
  .controller('StudentCtrl', function ($scope, socket) {
    var loc = window.location.href.split('/');
    var username = loc[loc.length - 1];

    // When 'I'm confused :(' button is clicked
    $scope.confused = function(){
      // emit 'confused' event and student's github username to the server
      socket.emit('confused', {username: username});
      // as of now setTimeout causes a bug where multiple student.html emit
      // not confused message at once, causing counter in teacher.html to go
      // negative
      // setTimeout($scope.cancel, 60000);
    };

    // When 'I'm good now' button is clicked
    $scope.cancel = function() {
      // emit 'not confused' event and student's github usernameto the server
      socket.emit('not confused', {username: username});
    };

    var enableConfused = function() {
      var confused = document.getElementsByClassName('confused')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // Enable 'I'm confused :(' button
      confused.disabled = false;
      // Disable 'I'm good now' button
      cancel.disabled = true;
    }

    // Listen to event emitted by the server for a specific student and
    // enable 'I'm good now' button while disabling 'I'm confused :(' button
    socket.on('enable cancel on ' + username, function(data) {
      var confused = document.getElementsByClassName('confused')[0];
      var cancel = document.getElementsByClassName('cancel')[0];
      // disable 'I'm confused :(' button
      confused.disabled = true;
      // enable 'I'm good now' button
      cancel.disabled = false;
    });

    // Listen to event emitted by the server for a specific student and
    // enable 'I'm confused :(' button while disabling 'I'm good now' button
    socket.on('enable confused on ' + username, function(data) {
      enableConfused();
    });

    socket.on('resolved', function(data) {
      enableConfused();
    });
  })
  .controller('TeacherCtrl', function ($scope, socket) {
    // Counter keeps track of the number of students who are confused (i.e., those have clicked on the 'I'm confused :(' button)
    // If counter exists in teacher's localStorage, set counter to the existing value. Else, set counter to 0
    $scope.counter = localStorage["confusedCounter"] || 0;

    // Set the default confusion threshold. If the proportion of students in the class who have clicked 'I'm confused :(' exceeds
    // the threshold value, the teacher will be alerted.
    $scope.threshold = 50;

    // Sends an error when threshold is above 100 or below 0
    // This is called whenever teacher changes the threshold
    $scope.check = function() {
      if ($scope.threshold > 100 || $scope.threshold < 0) {
        swal({
          title: "Error!",
          text: "Threshold must be between 0-100!",
          confirmButtonText: "I understand"
        },
        function() {
          // Resets the threshold once teacher presses I understand
          $scope.threshold = 50;
        });
      }
    };

    // Track the confused status of students
    var studentConfusedStatus = {};

    // Determine the degree to which to rotate the thumb image in response to student's clicks
    $scope.degree = $scope.confusionRate * 180;

    // When the teacher logs out, reset the confusion counter in the local storage
    $scope.logout = function() {
      localStorage["confusedCounter"] = 0;
    };

    // Calculate confusion rate and percentage
    var confusionCalculator = function() {
      $scope.confusionRate = ($scope.counter / 60).toFixed(4);
      $scope.percentage = $scope.confusionRate * 100 + "%";
    }

    // Initialize the confusion rate and percentage
    confusionCalculator();

    // Listen to 'add' event emitted by the server
    socket.on('add', function(username) {
      // If the student has NOT previously clicked on the 'I'm confused :(' button
      if(!studentConfusedStatus.username){
        // store the student's confused status
        studentConfusedStatus.username = true;
      // Update the confusion rate and rotate the thumb based on the updated confusion rate.
      // This call is executed outside of angular's context, so use
      // $scope.apply here. More info at http://stackoverflow.com/questions/24596056/angular-binding-not-updating-with-socket-io-broadcast
        $scope.$apply(function() {
          $scope.counter++;
          localStorage["confusedCounter"] = $scope.counter;
          confusionCalculator();
          $scope.degree = $scope.confusionRate * 180;
          document.getElementsByClassName('thumb')[0].style.webkitTransform = 'rotate('+ $scope.degree +'deg)';
        });

        // If confusion rate rises above the threshold, (sweet) alert the teacher
        if ($scope.percentage >= $scope.threshold) {
          swal({
            title: "Confused!",
            text: "Students are confused!",
            confirmButtonText: "Help them!"
          },
          // Callback function that is invoked after the teacher addresses the confusion
          function() {
            // Emit 'confusion resolved' message to server
            socket.emit("confusion resolved");
            //
            $scope.$apply(function() {
              // reset the counter to 0, update the confusion rate, and rotate the thumb image based on the updated confusion rate.
              $scope.counter = 0;
              localStorage["confusedCounter"] = $scope.counter;
              confusionCalculator();
              $scope.degree = $scope.confusionRate * 180;
              document.getElementsByClassName('thumb')[0].style.webkitTransform = 'rotate('+ $scope.degree +'deg)';
            });

            // reset the confused status of all students
            for(var key in studentConfusedStatus){
              studentConfusedStatus[key] = false;
            }
          });
        }
      }

    });

    // Listen to 'subtract' event emitted by the server
    socket.on('subtract', function(username) {
      // If the student has previously clicked on the 'I'm confused :(' button and is no longer confused
      if(studentConfusedStatus.username){
        // update the student's confused status
        studentConfusedStatus.username = false;
        // Update the confusion rate and rotate the thumb image based on the updated confusion rate.
        $scope.$apply(function() {
          $scope.counter--;
          localStorage["confusedCounter"] = $scope.counter;
          confusionCalculator();
          $scope.degree = $scope.confusionRate * 180;
          document.getElementsByClassName('thumb')[0].style.webkitTransform = 'rotate('+ $scope.degree +'deg)';
        });
      }

    });


  })
  // create the dashboard view in dashboard.html
  .controller('DashboardCtrl', function(Dashboard){

    // Dashboard.fetchData().then(function(data){
    //   console.log('success!')
    //   Dashboard.render(data);
    // }).catch(function(err){
    //   if (err) throw err;
    // });

     Dashboard.render();

  })
  // login Helper
  .factory('LoginFactory', function($http, $location) {

    var login = function(person) {
      // redirect to /student or /teacher html pages, depending on whether a student or teacher is logging in
      window.location.href = 'http://127.0.0.1:8000/' + person;
    };

    return {
      login: login
    }

  })
  // connect to the local host and return the socket
  .factory('socket', function() {

    var socket = io.connect('http://127.0.0.1:8000/');

    return socket;

  })
  // contain the methods used by DashboardCtrl to render the dashboard view
  .factory('Dashboard', function($http){

  // set the params for the dashboard
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
    var url = '';

    // create an svg canvas
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .style("background-color", bgColor);

    // perform a GET request to the server and returns a dataset containing student names and confused variables
    var fetchData = function(){
      return $http({
        method: 'GET',
        url: url
      });
    };

    var render = function(){
      // create a rectangular block whose height is directly proportional to the number of 'I'm confused :(' clicks for each student
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

      // display each student's name above the rectangular block
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

      // display the number of 'I'm confused :(' clicks inside of each student's rectangular block
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
