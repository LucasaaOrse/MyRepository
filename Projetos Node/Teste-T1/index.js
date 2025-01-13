const express = require("express") //frameworl principal pra cirar servidor
const bodyParser = require("body-parser") //middleware utilizado para analizar requisições HTTP, como dados de POST e formularios
const path = require("path") //modulo nativo ajuda a manipular e resolver caminhos de arquivos e diretorios

const app = express() //criar instancia do express pra configurar rotas
const port = 3000; //armazena o numero da porta do servidor

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded({ extended: true})) //permite q o express entenda dados enviados no corpo das requisições
app.use(bodyParser.json()) //permite o express entenda e faça parse de requisições com corpo json

app.set("view engine", 'ejs') //diz ao express pra usar EJS como motor template para renderizar as paginas dinamicas HTML
app.set('views', path.join(__dirname, 'views')) //aqui define onde o express vai procurar arquivos template

app.get('/', (req, res) => { //define uma rota HTTP get para o caminho '/'
    res.render('index', { message: "Olá mundo!"}) 
})

app.listen(port, () => { //esse metodo faz com que o servidor escute requisições HTTP
    console.log("servidor rodando em http://localhost:${port}")

})

