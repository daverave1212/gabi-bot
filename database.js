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


module.exports.connectToDatabase = function(callback){connectThen(callback)}
module.exports.getAllQuotes = getAllQuotes
module.exports.addQuote = pushPair


/*
const File = require('fs')
connectThen(()=>{
	File.readFile('./Quotes/quotesList.json', 'utf-8', (err, quotesList)=>{
		quotesList = JSON.parse(quotesList)
		File.readFile('./Quotes/quotesMap.json', 'utf-8', (err, quotesMap)=>{
			quotesMap = JSON.parse(quotesMap)
			console.log(quotesList)
			console.log(quotesMap)
			for(let key of quotesList){
				pushPair(key, quotesMap[key])
			}
		})
	})
})

*/