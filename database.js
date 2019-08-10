const mysql = require('mysql')
const u = require('./utils.js')

// Hosted on https://remotemysql.com/databases.php

var con = mysql.createConnection({
	host: "remotemysql.com",
	user: "OdLpwVqUBa",
	password: "XjDJwkdw71",
	database: "OdLpwVqUBa"
});

function connectThen(callback){
	con.connect(function(err) {
		if (err){
			console.log(err)
			process.exit()
		} else {
			if(callback != null) callback()
		}
	});
}

function getAllQuotes(callback){
	let query = `select * from GABI_QUOTES`
	let quotesList = []
	let quotesMap = {}
	con.query(query, function (err, result, fields) {
		if (err) {
			console.log(err)
			process.exit()
		} else {
			for(let pair of result){
				quotesList.push(pair['sentence'])
				quotesMap[pair['sentence']] = pair['reply']
			}
			callback(quotesList, quotesMap)
		}
	});
}

function getAllGames(callback){
	let query = `select * from GABI_GAMES`
	let gamesList = []
	con.query(query, function (err, result, fields) {
		if (err) {
			console.log(err)
			process.exit()
		} else {
			gamesList = result
			callback(gamesList)
		}
	});
}

function pushPair(key, value, callback){
	let query = `insert into GABI_QUOTES values( '${key}' , '${value}' )`
	con.query(query, function (err, result, fields) {
		if (err) {
			console.log(err)
			process.exit()
		} else {
			console.log(`Pushed ${key} ${value}`)
			if(callback != null){
				callback()
			}
		}
	});
}

function pushGame(gameName, callback){
	let query = `insert into GABI_GAMES values( '${gameName}' )`
	con.query(query, function(err, result, fields){
		if(err){
			console.log(err)
			process.exit()
		} else {
			console.log(`Pushed ${gameName}`)
			if(callback != null){
				callback()
			}
		}
	})
}


module.exports.connectToDatabase = function(callback){connectThen(callback)}
module.exports.getAllQuotes = getAllQuotes
module.exports.getAllGames = getAllGames
module.exports.addQuote = pushPair
module.exports.addGame = pushGame

