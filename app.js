var http = require('http')
var express = require('express')
var ServeStatic = require('serve-static')
var WebSocketServer = require('ws').Server

var server = http.createServer()
var app = express()
var wss = new WebSocketServer({ server: server })
var PORT = 80

app.use(ServeStatic('app', {index: ['index.html']}));

wss.on('connection', function connection(client) {
	var id = client.id = Math.random().toFixed(8).substr(2)
	console.log(id + ' log in')
	client.on('message', function (message) {
		console.log(id + ' said: ' + message)
		message = {
			user: id,
			content: message
		}
		message = JSON.stringify(message)
		wss.clients.forEach(function (c) {
			c.send(message)
		})
	})
})

server.on('request', app)
server.listen(PORT, function () {
	console.log('Listening on ' + server.address().port)
})