const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://finalproject:finalproject@ds011715.mlab.com:11715/orderlist', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('orderA').find().toArray((err, result) => {
    if (err) return console.log(err)
    // res.render('index.ejs', {quotes: result})
  res.json({ result });
  })
})

app.post('/newOrder', (req, res) => {
  db.collection('orderA').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/order', (req, res) => {
  db.collection('orderA')
  .findOneAndUpdate({name: 'Milk'}, {
    $set: {
      name: req.body.name
      // quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/order', (req, res) => {
  db.collection('orderA').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send("Deleted")
  })
})
