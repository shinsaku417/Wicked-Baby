var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
//EXAMPLE OF PASSPORT IN ACTION: 
//https://github.com/jaredhanson/passport-github/blob/master/examples/login/app.js
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var GITHUB_CLIENT_ID = "";
var GITHUB_CLIENT_SECRET = "";

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

// serve up all of client-side the dependencies
app.use(express.static(__dirname + '/public'));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.get('/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

// GET /github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    console.log(req.user)
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

server.listen(8000, function(){
  console.log('Listening on port 8000')
});

// serve up html files.
app.get('/', function(req, res){
  console.log('serving index.html');
  var path = __dirname + '/public/client/index.html';
  res.sendFile(path);
});

app.post('/login', function(req, res){
  res.redirect('/github');
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

  // when student presses cancel or 60 seconds have passed after pressing the button
  socket.on('not confused', function (data) {
    // broadcasts the subtract message to all the clients
    socket.broadcast.emit('subtract');
  });
});


