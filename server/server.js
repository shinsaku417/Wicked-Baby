var express = require('express');
var app = express();

//serve up all of client-side the dependencies
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res){
  var path = '/Users/SashaBayan/Desktop/Wicked-Baby/index.html'
  res.sendFile(path)
  //res.sendfile('./index.html'); //this will work, but only within the same directory. Not sure why. Also
                                //sendfile is deprecated. Should be using sendFile() which requires more.

})

app.get('/student', function(req, res){
  res.write('you should be getting the students page');
})

app.get('/teacher', function(req, res){
  res.write('you should be getting teachers page');
})

app.listen(8000, function(){
  console.log('Listening on port 8000')
});