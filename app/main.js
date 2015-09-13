(function () {
var UserName = 'luobo'

var socket = new WebSocket('ws://localhost/')
var opening

socket.onopen = function () {
	opening = true

	socket.onmessage = function (e) {
		handleMessage(parseMessage(e.data))
	}

	socket.onclose = function () {
		opening = false
		console.log('server close')
	}
}

function login(userName) {
	UserName = userName
	socket.send(JSON.stringify({
		type: MessageTypes.Login,
		user: UserName
	}))
}

var $messages = document.querySelector('#messages')
var $message = document.querySelector('#message')
var $send = document.querySelector('#send')

var MessageTypes = {
	Chat: 0,
	Error: 1,
	Login: 2
}

$send.addEventListener('click', function () {
	if (opening) {
		socket.send(JSON.stringify({
			type: MessageTypes.Chat,
			body: $message.textContent
		}))
	}
}, false)

function handleMessage(message) {
	switch (message.type) {
		case MessageTypes.Chat:
			var p = document.createElement('p')
			p.innerHTML = renderMessage(message)
			$messages.insertBefore(p, $messages.firstChild)
			break
		case MessageTypes.Login:
			// todo
		default:
			// todo
			break
	}
}

function renderMessage(message) {
	// ES6 template string
	return message ?
		`<span class="message-from">${message.user}</span>
		<span class="message-content">${message.body}</span>` :
		'not valid message'
}

function parseMessage(str) {
	try {
		return JSON.parse(str)
	} catch(e) {
		return null
	}
}

document.querySelector('#username').addEventListener('keydown', function (e) {
	if (e.keyCode === 13) { // Enter
		login(this.textContent)
		document.querySelector('#login').style.display = 'none'
	}
}, false)
})()