const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', require('./routes/user.routes'))
app.use('/api/v1/projects', require('./routes/project.routes'))
app.use('/api/v1/chats', require('./routes/chat.routes'))

module.exports = app