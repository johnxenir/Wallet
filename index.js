const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/players', db.getWallets)
app.get('/players/:id', db.getWalletById)
app.post('/players', db.createWallet)
app.post('/deposit/:id', db.depositFunds)
app.post('/withdraw/:id', db.withdrawFunds)
/*app.delete('/players/:id', db.deleteUser)
*/
app.listen(port, () => {
  console.log('App running on port ${port}.')
})
