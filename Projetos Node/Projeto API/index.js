const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const sequelize = require("sequelize")
const connection = require("./DataBase/database")
const GamesController = require("./Games/gamesController")
const UsersController = require("./Users/usersController")
const Games = require("./Games/games")
const cors = require("cors");
const path = require("path");


app.use(express.json()); // Para permitir o uso de JSON no corpo das requisições
app.use(UsersController);

app.use(cors());


app.use(express.static("public"));

app.use("/Scripts", express.static(path.join(__dirname, "Scripts")));

// Se os arquivos JS estiverem na pasta 'public/js', use:
app.use("/js", express.static(path.join(__dirname, "public/js")));

app.set('view engine', "ejs") // setando qual a engine vai renderizar nosso html

app.use(bodyParser.urlencoded({extented: false}))
app.use(bodyParser.json())

connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso")
    }).catch((error) =>{
        console.error();
        
    })

app.use("/", GamesController)
app.use("/api", UsersController)

app.listen(8000, () =>{
    console.log("API funcionando")
})
