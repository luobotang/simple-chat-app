(function () {

var socket = new WebSocket('ws://localhost/')
var opening

socket.onopen = function () {
	opening = true

	socket.onmessage = function (e) {
		var p = document.createElement('p')
		p.innerHTML = renderMessage(parseMessage(e.data))
		$messages.insertBefore(p, $messages.firstChild)
	}

	socket.onclose = function () {
		opening = false
		console.log('server close')
	}

	socket.send('hello')
}

var $messages = document.querySelector('#messages')
var $message = document.querySelector('#message')
var $send = document.querySelector('#send')

$send.addEventListener('click', function () {
	if (opening) {
		socket.send($message.textContent)
	}
}, false)

function renderMessage(message) {
	// ES6 template string
	return message ?
		`<span class="message-from">${message.user}</span>
		<span class="message-content">${message.content}</span>` :
		'not valid message'
}

function parseMessage(str) {
	try {
		return JSON.parse(str)
	} catch(e) {
		return null
	}
}
})()