var File = require('fs')
var FuzzySet = require('fuzzyset.js')
var https = require('https')

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomOfArray(arr){
	return arr[randomInt(0, arr.length - 1)]
}

function getJoke(callback){
	https.get('https://api.chucknorris.io/jokes/random', res => {
		let data = ''
		res.on('data', chunk => {
			data += chunk
		})
		res.on('end', () => {
			data = JSON.parse(data)
			callback(data)
		})
	}).on('error', err=>{
		console.log("FAILED TO GET JOKE")
	})
}

const MyName = "Gabi"

var quotesList = []
var quotesMap  = {}
var quotesFuzzySet = null
var quotesMOTD = []

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

function save(channel){
	var quotesListText = JSON.stringify(quotesList)
	var quotesMapText = JSON.stringify(quotesMap)
	var quotesMOTDText = JSON.stringify(quotesMOTD)
	channel.send("ma salvez... nu apasati pe nimic")
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
	quotesList.push(message)
	quotesMap[message] = reply
	quotesFuzzySet.add(message)
}

function addMOTD(message){
	quotesMOTD.push(message)
}

function sendJoke(channel){
	getJoke(joke => {
		joke = joke.value
		channel.send(joke)
	})
}

function getRandomMOTD(){
	return randomOfArray(quotesMOTD)
}

module.exports.load = load
module.exports.getReplyFromExactMessage = getReplyFromExactMessage
module.exports.addReply = addReply
module.exports.save = save
module.exports.sendJoke = sendJoke
module.exports.getRandomMOTD = getRandomMOTD
module.exports.addMOTD = addMOTD
module.exports.defuzz = defuzz