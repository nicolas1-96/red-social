const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2')



app.use(cors())
app.use(express.json())
app.use(express.static('public'))

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234567',
  database : 'artgram'
  
});
//la conexion a la base de datos
connection.connect((err) => {
    if(err){
        console.log(`error connecting: ${err.stack}`);
    } else{
        console.log("conectado a la base de datos");
        console.log(`connected as id ${connection.threadId}`);
    }
})
const protectedRoute = (req, res, next) => {
  const token = req.headers["authorization"]
  if(!token)
    return res.status(401).json({ error: "Unauthorized" })

  jwt.verify(token, 'llavesecreta', (err, decoded) => {
    if(err)
      return res.status(401).json({ error: "Unauthorized" })
    
    req.decoded = decoded
    next()
  })
}

require('./resources/users.js')(app, connection, protectedRoute)
require('./resources/posts.js')(app, connection, protectedRoute)


app.listen(4000, () => {
  console.log("El servidor esta funcionando en el puerto 4000 :)")
})
