var express = require('express')
var app = express()

/*
app.use('/src', express.static('../src'))

// for image path
app.use('/src/assets/css/~@/assets/images', express.static('../src/assets/images'))
app.use('/src/assets/css/~@/assets/images/common', express.static('../src/assets/images/common'))
app.use('/src/assets/css/~@/assets/images/main', express.static('../src/assets/images/main'))
app.use('/src/assets/css/~@/assets/images/mo', express.static('../src/assets/images/mo'))
app.use('/src/assets/css/~@/assets/images/sub', express.static('../src/assets/images/sub'))
*/

app.use(express.static(__dirname))
console.log(__dirname)

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(3001, function () {
  console.log('Style Guide listening on port 3001!')
})
