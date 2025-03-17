const express = require("express")
var app = express()
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("express-flash")
const cookieParser = require("cookie-parser")


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cookieParser("nefmfemoefmkf"))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000}
}))

app.use(flash())

app.get("/", (req, res) =>{

    var emailError = req.flash("emailError")
    var nomeError = req.flash("nomeError")
    var pontosError = req.flash("pontosError")
    var email = req.flash("email")
    var nome = req.flash("nome")
    var pontos = req.flash("pontos")


    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    nomeError = (nomeError == undefined || nomeError.length == 0) ? undefined : nomeError
    pontosError = (pontosError == undefined || pontosError.length == 0) ? undefined : pontosError
    email = (email == undefined || email.length == "") ? undefined : email
    nome = (nome == undefined || nome.length == "") ? undefined : nome
    pontos = (pontos == undefined || pontos.length == "") ? undefined : pontos


    res.render("index", {emailError, nomeError, pontosError, email: email, nome: nome, pontos: pontos})
})

app.post("/form", (req, res) =>{
    var {email, nome, pontos} = req.body

    var emailError
    var nomeError
    var pontosError

    if(email == undefined || email == ""){
        emailError = "O email é obrigatorio"
    }
    if(nome == undefined || nome == ""){
        nomeError = "O nome é obrigatorio"
    }
    if(pontos == undefined || pontos == ""){
        pontosError = "Os pontos são obrigatorios"
    }

    if(emailError != undefined || pontosError != undefined || nomeError != undefined){
        req.flash("emailError", emailError)
        req.flash("nomeError", nomeError)
        req.flash("pontosError", pontosError)
        req.flash("email", email)
        req.flash("nome", nome)
        req.flash("pontos", pontos)

        res.redirect("/")
    }else{
        res.send("Formulario enviado")
    }

})

app.listen(5050, (req, res) =>{
    console.log("Servidor rodando")
})

