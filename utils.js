
function getFirstNull(arr){
	for(let i = 0; i<arr.length; i++){
		if(arr[i] == null) return i
	}
	return -1
}

function findInArray(arr, prop, val){
	for(let i = 0; i<arr.length; i++){
		if(arr[i][prop] == val) return i
	}
	return null
}

function randomOf(...args){
	return args[randomInt(0, args.length - 1)];
}

function randomInt(low, high){
	return Math.floor(Math.random() * (high - low + 1) + low);
}

function randomOfArray(arr){
	return arr[randomInt(0, arr.length - 1)]
}

function shuffleArray(ar){
	for(let i = 0; i<ar.length; i++){
		let swapIndex = randomInt(0, ar.length - 1)
		let aux = ar[swapIndex]
		ar[swapIndex] = ar[i]
		ar[i] = aux
	}
}

function has(){
	let obj = arguments[0]
	console.log("\t > Does:")
	console.log(obj)
	console.log("\t > Have:")
	console.log(arguments.length)
	console.log(arguments)
	for(let i = 1; i<arguments.length; i++){
		console.log(arguments[i])
		console.log("ADADAS")
		if(obj[arguments[i]] == null) return false
	}
	return true
}

function hasnt(){
	let obj = arguments[0]
	for(let i = 1; i<arguments.length; i++){
		if(obj[arguments[i]] == null) return true
	}
	return false
}

function forEachKey(object, func){
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		func(key);
	}
}

function printKeys(object){
	forEachKey(object, key => {
		console.log("  - " + key)
	})
}

function startTheSame(smallString, bigString, fromIndex){
	if(fromIndex == null) fromIndex = 0
	for(let i = 0; i<smallString.length; i++){
		if(smallString[i] != bigString[fromIndex]) return false
		fromIndex++
	}
	return true
}

function substringFrom(str, index){
	return str.substring(index, str.length)
}

function isBlank(chr){
	if(chr == ' ' || chr == '\t') return true
	return false
}

const READING_BLANK = 0
const READING_WORD = 1
const READING_QUOTES = 2

function splitArguments(string){
	let ret = []
	let i = 0
	let start = 0
	let state = READING_BLANK
	while(i < string.length){
		let letter = string[i]
		switch(state){
			case READING_BLANK:
				if(isBlank(letter)){
					// do nothing
				} else if(letter == '"'){
					start = i + 1
					state = READING_QUOTES
				} else {
					start = i
					state = READING_WORD
				}
				break
			case READING_WORD:
				if(isBlank(letter)){
					ret.push(string.substring(start, i))
					state = READING_BLANK
				} else {
					// do nothing
				}
				break
			case READING_QUOTES:
				if(letter == '"'){
					ret.push(string.substring(start, i))
					state = READING_BLANK
				}
		}
		i++
	}
	if(state == READING_WORD){
		ret.push(substringFrom(string, start))
	}
	return ret
}

module.exports.findInArray = findInArray
module.exports.randomOf = randomOf
module.exports.randomOfArray = randomOfArray
module.exports.randomInt = randomInt
module.exports.has = has
module.exports.hasnt = hasnt
module.exports.forEachKey = forEachKey
module.exports.getFirstNull = getFirstNull
module.exports.printKeys = printKeys
module.exports.startTheSame = startTheSame
module.exports.substringFrom = substringFrom
module.exports.splitArguments = splitArguments









