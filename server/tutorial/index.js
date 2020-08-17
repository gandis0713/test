// require
const express = require('express')
const app = express()
const router = require('./router/main')(app)

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static('public'))

const server = app.listen(3000, function() {
  console.log("3000")
})