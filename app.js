
var exports = module.exports = {}; //allows exporting of this module

var Sequelize = require('sequelize');
var mysql = require('mysql');
var mysqlPassword = require(__dirname + '/config.js').mysqlPassword;

//initializes Sequelize with mysql database, listens to port 3306

var db = new Sequelize('thumbs', 'root', mysqlPassword, {//database name, username, mysql root password
      host: process.env.HOST,
      dialect: "mysql",
      port:    process.env.PORT 
    })

//connects database
db
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.');

      //defines a Student model
      exports.Student = db.define('Student', {
        displayName: Sequelize.STRING,
        username: Sequelize.STRING,
        confusionCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0 //sets default count to 0 when a new student is created in the Students table
        }      
      });
      //defines a Teacher model
      exports.Teacher = db.define('Teacher', {
        displayName: Sequelize.STRING,
        username: Sequelize.STRING
      });
      exports.Student.sync() //syncs the model with the database. This creates the Students table.
      exports.Teacher.sync() //syncs the model with the database. This creates the Teacher table.
    }
  })

 
exports.db = db;


