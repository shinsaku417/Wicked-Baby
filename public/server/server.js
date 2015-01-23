var express = require('express');
var app = express();
var server = require('http').Server(app);
var socket = require('socket.io')(server);

//serve up all of client-side the dependencies
app.use(express.static(__dirname + '/public'));
console.log(__dirname);

app.get('/', function(req, res){
  var path = '/Users/shinsakuuesugi/Wicked-Baby/public/client/index.html'
  res.sendFile(path);
  //res.sendfile('./index.html'); //this will work, but only within the same directory. Not sure why. Also
                                //sendfile is deprecated. Should be using sendFile() which requires more.

});

app.get('/student', function(req, res){
  var path = '/Users/shinsakuuesugi/Wicked-Baby/public/client/student.html'
  res.sendFile(path);
});

app.get('/teacher', function(req, res){
  res.write('you should be getting teachers page');
});

socket.on('confused', function() {
  console.log('confused');
})

server.listen(8000, function(){
  console.log('Listening on port 8000')
});
