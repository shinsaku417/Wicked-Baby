//////////////////HELPER FUNCTIONS///////////////////////
var exports = module.exports = {};

exports.isTeacher = function(displayName, teachers){
  for (var teacher in teachers) {
    if (teachers[teacher] === displayName){
      return true;
    }
  }
  return false;
};

exports.createUser = function(displayName, model){
  model
  .create({
    displayName: displayName
  })
  .complete(function(err, user) {
    if(err){
      console.log('error: ' + err)
    } else{
      console.log('user is saved! ' + user)
    }
  })
};

//Not used in current implementation
var getUsersEmails = function(username, accessToken) {
  var options = {
    headers: {
      'User-Agent':    'JavaScript.ru',
      'Authorization': 'token ' + accessToken
    },

    json:    true,
    url:  'https://api.github.com/users:' + username // or 'https://api.github.com/user/emails' ?
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response); 
    } 
    console.log(response.statusCode)
  })  
};


