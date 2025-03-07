const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");

// Remover o usersController aqui, pois ele é para a API e não o frontend.

app.use(cors()); // Habilita CORS, caso precise consumir a API
app.set('view engine', 'ejs'); // Usando EJS para renderizar as views
app.set('views', path.join(__dirname, '..', 'views')); // Define a pasta de views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/Scripts", express.static(path.join(__dirname, "Scripts")));

// Se os arquivos JS estiverem na pasta 'public/js', use:
app.use("/js", express.static(path.join(__dirname, "public/js")));

// Rota principal do frontend (renderiza o jogo)
app.get("/", (req, res) => {
    res.render("games.ejs"); // Renderiza a página principal do jogo
});

// Rota para exibir o cadastro de usuário
app.get("/user", (req, res) => {
    res.render("newuser.ejs"); // Renderiza a página de cadastro de usuário
});

// Rota para listar usuários (frontend usa esta rota para exibir os dados)
app.get("/users", (req, res) => {
    res.render("./userslist.ejs");  // Retorna uma página HTML
});

app.get("/login", (req, res) =>{
    res.render("login.ejs")
})

// Iniciar o servidor frontend na porta 8001
app.listen(8001, () => {
    console.log("Servidor frontend rodando na porta 8001");
});