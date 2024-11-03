const express = require('express');
const app = express();
const bodyParser = require("body-parser")

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyParser.urlecoded({extended: false}))
app.use(bodyParser.json());

app.get("/",(req, res) => {
    res.send("Bem vindo ao meu site");

});

app.get('perguntar',(req, res) => {
    res.render()

})

app.listen(8000,()=> {console.log("app rodando");});