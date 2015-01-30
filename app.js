var exports = module.exports = {}; //allows exporting of this module

var Sequelize = require('sequelize');
var mysql = require('mysql');
var mysqlPassword = require('./config.js').mysqlPassword;

//initializes Sequelize with mysql database, listens to port 3306

var sequelize = new Sequelize('thumbs', 'root', mysqlPassword, {//database name, username, mysql root password
      host: '127.0.0.1',
      dialect: "mysql",
      port:    3306, 
    })

//connects database
sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.');

      //defines a Student model
      exports.Student = sequelize.define('Student', {
        username: Sequelize.STRING,
        password: Sequelize.STRING
      })
      exports.Student.sync() //syncs the model with the database. This creates the Students table.
    }
  })






exports.db = sequelize;

