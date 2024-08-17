const express = require('express')
const { Server } = require('socket.io')

const app = express()

const server = app.listen(
	8080,
	() => {
		console.log('Server is running on 8080 port')
	}
)

const io = new Server(
	server,
	{
		cors: {
			origin: 'http://localhost:3000'
		}
	}
)

//? I do not think that this solution is optimal and good
let currentDrawInfo = []

io.on(
	'connection',
	(socket) => {
		console.log('New websocket connection - ', socket.id)

		socket.emit('set_draw_info', currentDrawInfo)

		socket.on(
			'update_draw_info',
			(drawObject) => {
				socket.broadcast.emit('add_new_draw_object', drawObject)

				currentDrawInfo.push(drawObject)
			}
		)

		socket.on(
			'clear_canvas',
			() => {
				currentDrawInfo = []

				socket.broadcast.emit('set_draw_info', [])
			}
		)
	}
)
