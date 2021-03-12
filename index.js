require('dotenv').config()

const http = require('http')
const app = require('./app')
const { msg } = require('./helpers/messages')

const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST']
    }
})

const rooms = ['default', 'one', 'two', 'three']
let clients = []

io.on('connection', socket => {
    let currentRoom = rooms[0]

    socket.join(currentRoom)
    socket.emit('rooms', rooms)

    socket.on('new user', username => {
        clients.push({ id: socket.id, username })

        socket.emit('message', msg(socket.id, `Welcome to the chat, ${username}!`))
        socket.broadcast.emit('message', msg(socket.id, `${username} joined`))
        io.emit('users', clients)
    })

    socket.on('new message', message => {
        const { username } = clients.find(client => client.id === socket.id)
        io.to(currentRoom).emit('message', msg(socket.id, message, username))
    })

    socket.on('new room', room => {
        if (rooms.includes(room)) {
            socket.leave(currentRoom)
            socket.join(room)

            currentRoom = room
            socket.emit('message', msg(socket.id, `You entered the room: ${currentRoom}`))
        }
    })

    socket.on('disconnect', () => {
        const { username } = clients.find(client => client.id === socket.id)
        clients = clients.filter(client => client.id !== socket.id)

        username && io.emit('message', msg(socket.id, `${username} left`))
        io.emit('users', clients)
    })
})

server.listen(port, () => console.log(`Server listening on port ${port}`))
