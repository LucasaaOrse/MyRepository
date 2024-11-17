const express = require("express") // importando o express
const app = express() // criando o servidor
const bodyParser = require("body-parser")
const connection = require("./database/database")

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