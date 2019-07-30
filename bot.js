var Discord		= require('discord.js')
var auth		= require('./auth.json')
var u			= require('./utils.js')
var fs			= require('fs')
var FuzzySet	= require('fuzzyset.js')
var gabiQuotes	= require('./gabiQuotes.js')


// message.reply('hopa')
// message.channel.send("nuj")

const Name = "Gabi"
const SpamChannel = "411992175094530049"

var bot = new Discord.Client()
var currentVoiceChannel = null
var currentConnection = null
var currentChannel = null

var specialSentences = [
	"zi o gluma",
	"hai ba aici",
	"muie gabi"
]

var specialCommands = {
	"hai ba aici" : function(message, callback){
		joinVoiceChannel(message, callback)
	},
	"muie gabi" : function(message, callback){
		leaveVoiceChannel(message, callback)
	},
	"zi o gluma" : function(message, callback){
		gabiQuotes.sendJoke(currentChannel)
	}
}


function joinVoiceChannel(message, callback){
	if(message.member.voiceChannel){
		if(!message.guild.voiceChannel){
			currentVoiceChannel = message.member.voiceChannel
			message.member.voiceChannel.join().then(connection => {
				currentConnection = connection
				if(callback != null) callback(connection)
			})
		}
	}
}

function leaveVoiceChannel(message, callback){
	if(message.guild.voiceConnection){
		message.guild.voiceConnection.disconnect()
		message.channel.send("sugeti pula")
	}
}

function playSound(filePath){
	var dispatcher = currentConnection.playFile(filePath)
}
function analyzeSentence(message){
	var reply = gabiQuotes.getReply(message.content)
	if(reply != null){
		message.channel.send(reply)
	}
}

var alreadySentSomething = false
function startSendingMOTD(){
	setInterval(()=>{
		if(currentChannel != null && !alreadySentSomething){
			currentChannel.send(gabiQuotes.getRandomMOTD())
			alreadySentSomething = true
		}
		if(u.randomInt(0, 25) == 99){
			alreadySentSomething = false
		}
	}, 10000)
}
function startSendingIntendedQuotes(){
	setInterval(()=>{
		if(currentChannel != null){
			gabiQuotes.getIntendedQuote((quote)=>{
				if(quote != null){
					currentChannel.send(quote)
				}
			})
		}
	}, 10000)
}

bot.on('ready', () => {
	console.log("GabiBot started")
	currentChannel = bot.channels.get(SpamChannel)
	gabiQuotes.load(specialSentences, ()=>{
		startSendingMOTD()
		startSendingIntendedQuotes()
	})
})

bot.on('message', message => {
	var msg = ""
	var isCommand = false
	if(u.startTheSame('!gabi', message.content)){
		msg = u.substringFrom(message.content, 6)
		isCommand = true
	} else {
		msg = message.content
	}
	if(message.member.user.username == Name) return	// Dont respond to my own messages
	currentChannel = message.channel
	if(isCommand){
		if(msg.length > 2){
			var args = u.splitArguments(msg)
			var command = args[0]
			console.log(args)
			switch(command){
				case "add":
					console.log(gabiQuotes.getReplyFromExactMessage(args[1]))
					if(gabiQuotes.getReplyFromExactMessage(args[1]) == null){
						gabiQuotes.addReply(args[1], args[2])
						message.channel.send("de acum in colo, o sa raspund cu '" + args[2] + "' la '" + args[1] + "'")
					} else {
						message.channel.send("iei muie, deja raspund cu '" + gabiQuotes.getReplyFromExactMessage(args[1]) + "' la asta")
					}				
					break
				case "remove":
					message.channel.send("apai da vezi tu, asta nu stiu sa fac")
					break
				case "save":
					gabiQuotes.save(currentChannel)
					break
				case "gluma":
					gabiQuotes.sendJoke(currentChannel)
					break
				case "motd":
					gabiQuotes.addMOTD(args[1])
					break
				case "--channel":
					console.log(currentChannel)
					
			}
		}
	} else {
		var sentenceCorrected = gabiQuotes.defuzz(msg)
		if(sentenceCorrected != null){
			let reply = gabiQuotes.getReplyFromExactMessage(sentenceCorrected)
			if(reply != null){
				message.channel.send(reply)
			} else {
				let specialFunc = specialCommands[sentenceCorrected]
				specialFunc(message)
			}
		}
	}
})
console.log(auth.token)
bot.login(auth.token)



