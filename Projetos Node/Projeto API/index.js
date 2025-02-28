const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const sequelize = require("sequelize")
const connection = require("./DataBase/database")
const GamesController = require("./Games/gamesController")
const Games = require("./Games/games")
const cors = require("cors");

app.use(cors());




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

app.listen(8000, () =>{
    console.log("API funcionando")
})
