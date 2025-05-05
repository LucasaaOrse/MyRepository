const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors')
const userRouters = require('./routes/user.routes')

require('dotenv').config();


app.use(cors())
app.use(express.json());
app.use('/', userRouters)


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
