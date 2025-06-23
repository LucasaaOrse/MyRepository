const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors')
const userRouters = require('./routes/user.routes')
const cookieParser = require("cookie-parser");
const specialtiesRouters = require('./routes/specialties.routes')
const associeteDoctor = require('./routes/doctor.routes')
const appointmentsRouter = require('./routes/appointment.routes')

require('dotenv').config();

app.use(cookieParser()); // <-- Adicione esta linha aqui antes das rotas
app.use(cors({
    origin: ['http://localhost:3001', 'http://192.168.95.127:3001'], // frontend URL
    credentials: true, // necessário para permitir cookies
  }))
app.use(express.json());
app.use('/', userRouters)
app.use('/', specialtiesRouters)
app.use('/', associeteDoctor)
app.use('/', appointmentsRouter)


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})
