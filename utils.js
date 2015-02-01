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

exports.createUser = function(username, displayName, model){
  model
  .create({
    username: username,
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

exports.userExistsInDB = function(value, model){
  var hasData;
  return model
    .find({ where: { username: value } })
    // .complete(function(err, data) {
    //   if(err){
    //     console.log('error: ' + err)
    //   } else{
    //     data ? hasData = true: hasData = false;
    //     console.log('BEFORE', hasData);
    //   }
    // })
  console.log('AFTER', hasData);       
}

//counts the number of rows for a given username
exports.countsUserRecords = function(value, model){
   model
  .count({where: {username: value}})
  .success(function(count) {
    console.log('Count: ', count);
  })   
};


//http://sequelize.readthedocs.org/en/latest/docs/instances/#incrementing-certain-values-of-an-instance
exports.incrementConfuseCount = function(username, model){
  model
  .find({ where: { username: username } })
  .then(function(user) {
    user.increment('confusionCount');
  })
};

// exports.incrementConfuseCount = function(username, model){
//   model
//   .find({ where: { username: username } })
//   .complete(function(err, student) {
//     if(err){
//       console.log('error: ' + err)
//     } else{
//       //increment the count here
//       var currentCount = student.dataValues.confusionCount;
//       var updatedCount = currentCount += 1;
//       student.updateAttributes({
//         confusionCout: updatedCount
//       }).success(function(data){
//         console.log('increment count was DEF called');
//       })
//     }
//   })
// }


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



// exports.userExistsInDB = function(value, model){
//   var hasData = false;
//   model
//     .find({ where: { username: value } })
//     .complete(function(err, data) {
//       if(err){
//         console.log('error: ' + err)
//       } else{
//         //console.log('//////////////////////////////////////// COMPLETEEEEE');
//         hasData = true;
//       }
//     })
//     .success(function(data){
//       //console.log(data);
//       return true;
//     })
//     //return hasData;
// }


