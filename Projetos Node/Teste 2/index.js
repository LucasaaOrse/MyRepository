const express = require("express") // importando o express
const app = express() // criando o servidor
const bodyParser = require("body-parser")

app.set('view engine', "ejs") // setando qual a engine vai renderizar nosso html

app.use(bodyParser.urlencoded({extends: false}))
app.use(bodyParser.json())

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index")


})

app.listen(8080, () =>{
    console.log("O servidor esta rodando")


})