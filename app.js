var http = require('http')
var express = require('express')
var ServeStatic = require('serve-static')
var WebSocketServer = require('ws').Server

var server = http.createServer()
var app = express()
var wss = new WebSocketServer({ server: server })
var PORT = 80

app.use(ServeStatic('app', {index: ['index.html']}));

var IncomeMessageTypes = {
	Chat: 0,
	Login: 2
}

var OutputMessageTypes = {
	Chat: 0,
	Error: 1,
	Login: 2
}

wss.on('connection', function connection(client) {
	client.on('message', function (msg) {
		console.log('%s: %s', client.user, msg)

		try {
			var message = JSON.parse(msg)
		} catch (e) {
			client.send(JSON.stringify({
				type: OutputMessageTypes.Error,
				body: 'invalid message'
			}))
		}

		switch (message.type) {
			case IncomeMessageTypes.Login:
				client.user = message.user
				broadcast({
					type: OutputMessageTypes.Login,
					user: client.user
				})
				break
			case IncomeMessageTypes.Chat:
				var body = message.body
				broadcast({
					type: OutputMessageTypes.Chat,
					user: client.user,
					body: body
				})
				break
			default:
				client.send(JSON.stringify({
					type: OutputMessageTypes.Error,
					body: 'unkown message'
				}))
				break
		}
	})
})

function broadcast(message) {
	if (typeof message !== 'string') {
		message = JSON.stringify(message)
	}
	wss.clients.forEach(function (c) {
		c.send(message)
	})
}

server.on('request', app)
server.listen(PORT, function () {
	console.log('Listening on ' + server.address().port)
})