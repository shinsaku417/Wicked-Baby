var Sequelize = require('sequelize');
var mysql = require('mysql');

//initializes Sequelize with mysql database, listens to port 3306
exports.db = new Sequelize('database', 'username', 'password', {
      dialect: "mysql",
      port:    3306, 
    })

exports.db
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  })

//defines a Student model
exports.Student = exports.db.define('Student', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
})



