const express = require("express") //frameworl principal pra cirar servidor
const bodyParser = require("body-parser") //middleware utilizado para analizar requisições HTTP, como dados de POST e formularios
const path = require("path") //modulo nativo ajuda a manipular e resolver caminhos de arquivos e diretorios
const connection = require("./database/database")


const app = express() //criar instancia do express pra configurar rotas
const port = 3000; //armazena o numero da porta do servidor

const Task = require("./controllers/tasksControl")

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.urlencoded({ extended: true})) //permite q o express entenda dados enviados no corpo das requisições
app.use(bodyParser.json()) //permite o express entenda e faça parse de requisições com corpo json

app.set("view engine", 'ejs') //diz ao express pra usar EJS como motor template para renderizar as paginas dinamicas HTML
app.set('views', path.join(__dirname, 'views')) //aqui define onde o express vai procurar arquivos template

app.get('/', (req, res) => { //define uma rota HTTP get para o caminho '/'
    res.render('index')
    
    Task.findAll({
        order: [['createdAt', 'DESC']] // Ordena pela coluna "createdAt" em ordem decrescente
    }).then(task =>{
    
        

    })
})

app.listen(port, () => { //esse metodo faz com que o servidor escute requisições HTTP
    console.log("servidor rodando em http://localhost:${port}")

})

app.get('/add-task', (req, res) => {
    res.render('admin/taskAdd', { title: 'Adicionar Task' });
});

app.post('/add-task', async (req, res) => {
    try {
        const { designacao, client, typeTask } = req.body;

        await Task.create({
            designacao,
            client,
            typeTask,
            status: false,
        });

        res.redirect("/");
    } catch (error) {
        console.error("Erro ao adicionar task:", error);
        res.status(500).send("Erro ao processar a solicitação.");
    }
});



// Sincronizar o modelo com o banco de dados
Task.sync({ force: false }) // Use `force: true` apenas se quiser recriar a tabela
    .then(() => {
        console.log('Tabela tasks sincronizada com sucesso!');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar a tabela tasks:', error);
    });
