 var exports = module.exports = {};

exports.GITHUB_CLIENT_ID = "5490ca3123aa702c0b5f";
exports.GITHUB_CLIENT_SECRET = "d8a9ca8a81b6ba68156fe46864caf809de2b2b5d";

var password = 'rock'; //save your mySQL server root password in this variable if you have one
exports.mysqlPassword = password || null; //defaults to null if no mySQL root password is provided

exports.teachers = {
	Phillip: 'phillipalexander',
	Marcus: 'Marcus Phillips',
	Fred: 'Fred Zirdung',
	Sasha: 'Sasha Bayan'
};