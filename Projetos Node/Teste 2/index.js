const express = require("express") // importando o express
const app = express() // criando o servidor
const bodyParser = require("body-parser")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriasController")
const articlesController = require("./articles/ArticlesController")

const Category = require("./categories/Category")
const Article = require("./articles/Article")

app.set('view engine', "ejs") // setando qual a engine vai renderizar nosso html

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static("public"))

connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso")
    }).catch((error) =>{
        console.error();
        
    })
app.get("/", (req, res) => {
    res.render("index")


})

app.listen(8080, () =>{
    console.log("O servidor esta rodando")


})

app.use("/",categoriesController )

app.use("/",articlesController)