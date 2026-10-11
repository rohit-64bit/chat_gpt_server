const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', require('./routes/user.routes'))
app.use('/api/v1/projects', require('./routes/project.routes'))

module.exports = app