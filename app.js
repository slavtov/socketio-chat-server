const express = require('express')
const app = express()

app.use(require('cors')({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST'
}))

module.exports = app
