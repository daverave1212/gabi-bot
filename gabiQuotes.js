var File = require('fs')
var FuzzySet = require('fuzzyset.js')
var https = require('https')
var u = require('./utils.js')
var database = require('./database.js')

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomOfArray(arr){
	return arr[randomInt(0, arr.length - 1)]
}

function getJoke(callback){
	u.doGet("https://perspico.net/bancuri/random_joke.php", (res)=>{
		let jokeStart = res.indexOf("<p>&nbsp</p>") + "<p>&nbsp</p><div class='quote'>".length
		let jokePart = res.substring(jokeStart, res.length)
		let jokeEnd = jokePart.indexOf("<br /><br")
		let joke = jokePart.substring(0, jokeEnd)
		joke = u.replaceAll(joke, "<br />", "")
		callback(joke)
	})
}

const MyName = "Gabi"

var quotesList = []
var quotesMap  = {}
var quotesFuzzySet = null
var quotesMOTD = []
var gamesAvailable = []

function load(specialSentences, callback){
	database.connectToDatabase(()=>{
		database.getAllGames((games)=>{
			gamesAvailable = games
			database.getAllQuotes((ql, qm)=>{
				quotesList = ql
				quotesMap = qm
				console.log("Loaded quotes from database successfully.")
				File.readFile('./Quotes/quotesMOTD.json', 'utf8', (err, content)=>{
					quotesMOTD = JSON.parse(content)
					//console.log(quotesMOTD)
					console.log("Read motd.")
					console.log("Building fuzz...")
					quotesFuzzySet = FuzzySet(quotesList.concat(specialSentences))
					console.log("Gabi bot is ready!")
					if(callback != null){
						callback()
					}
				})
			})
		})
	})
}


function save(channel){
	var quotesListText = JSON.stringify(quotesList)
	var quotesMapText = JSON.stringify(quotesMap)
	var quotesMOTDText = JSON.stringify(quotesMOTD)
	channel.send("esti prost, ma salvez automat pe cloud")
	return
	File.writeFile('./Quotes/quotesList.json', quotesListText, err => {
		File.writeFile('./Quotes/quotesMap.json', quotesMapText, err => {
			File.writeFile('./Quotes/quotesMOTD.json', quotesMOTDText, err => {			
				channel.send("gata")
			})
		})
	})
}

function defuzz(message){	// Either command or sentence
	var rep = quotesFuzzySet.get(message)
	if(rep != null){
		return rep[0][1]
	} else return null
}

function getReplyFromExactMessage(message){
	return quotesMap[message]
}

function addReply(message, reply){
	database.addQuote(message, reply, ()=>{
		quotesList.push(message)
		quotesMap[message] = reply
		quotesFuzzySet.add(message)
	})
}

function getRandomGame(){
	return u.randomOfArray(gamesAvailable).GAME_NAME
}

function addGame(gameName){
	database.addGame(gameName, ()=>{
		gamesAvailable.push(gameName)
	})
}

function addMOTD(message){
	quotesMOTD.push(message)
}

function sendJoke(channel){
	getJoke(joke => {
		channel.send(joke)
	})
}

function getRandomMOTD(){
	return randomOfArray(quotesMOTD)
}

function getIntendedQuote(callback){
	File.readFile("./Quotes/IntendedQuotes.txt", 'utf-8', (err, content)=>{
		if(content != "none"){
			File.writeFile("./Quotes/IntendedQuotes.txt", "none", err => {
				if(err){
					console.log(err)
				} else {
					callback(content)
				}
			})
		} else {
			callback(null)
		}
	})
}

module.exports.load = load
module.exports.getReplyFromExactMessage = getReplyFromExactMessage
module.exports.addReply = addReply
module.exports.save = save
module.exports.sendJoke = sendJoke
module.exports.getRandomMOTD = getRandomMOTD
module.exports.addMOTD = addMOTD
module.exports.addGame = addGame
module.exports.defuzz = defuzz
module.exports.getIntendedQuote = getIntendedQuote
module.exports.getRandomGame = getRandomGame
























/*
function load(specialSentences, callback){
	File.readFile('./Quotes/quotesList.json', 'utf8', (err, content)=>{
		quotesListText = content
		quotesList = JSON.parse(quotesListText)
		console.log("Read quotesList, identified " + quotesList.length + " quotes")
		console.log("Now reading map...")
		File.readFile('./Quotes/quotesMap.json', 'utf8', (err, content)=>{
			quotesMapText = content
			quotesMap = JSON.parse(quotesMapText)
			console.log("Read quotesMap successfully.")
			console.log("Reading MOTD's")
			File.readFile('./Quotes/quotesMOTD.json', 'utf8', (err, content)=>{
				quotesMOTD = JSON.parse(content)
				console.log(quotesMOTD)
				console.log("Read motd.")
				console.log("Building fuzz...")
				quotesFuzzySet = FuzzySet(quotesList.concat(specialSentences))
				console.log("Gabi bot is ready!")
				if(callback != null){
					callback()
				}
			})
		})
	})
}
*/