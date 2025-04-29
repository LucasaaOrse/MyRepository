const express = require('express');
require('dotenv').config();
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const AdminAuth = require('./middleware/adminAuth')
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:4000', // seu frontend
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(cookieParser())
app.use('/', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
