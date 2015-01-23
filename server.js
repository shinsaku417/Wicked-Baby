var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000, function(){
  console.log('Listening on port 8000')
});

// serve up all of client-side the dependencies
app.use(express.static(__dirname + '/public'));

// serve up html files.
app.get('/', function(req, res){
  console.log('serving index.html');
  var path = __dirname + '/public/client/index.html';
  res.sendFile(path);
});

app.get('/student', function(req, res){
  console.log('serving /student');
  var path = __dirname + '/public/client/student.html';
  res.sendFile(path);
});

app.get('/teacher', function(req, res){
  console.log('serving /teacher');
  var path = __dirname + '/public/client/teacher.html';
  res.sendFile(path);
});

io.on('connection', function (socket) {
  // server listens to confused event emitted by the student client
  socket.on('confused', function (data) {
    // broadcasts the add message to all the clients
    socket.broadcast.emit('add');
  });
});
