const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const connection = require('./database/database'); // Importar a conexão com o banco
const Pergunta = require("./database/perguntas");

connection.authenticate()
    .then(() => {
        console.log('Conexão com a base de dados realizada com sucesso!');
    })
    .catch(err => {
        console.error('Não foi possível conectar à base de dados:', err);
    });

// Configurar o EJS como o motor de visualização
app.set('view engine', 'ejs');

// Usar o body-parser para interpretar dados de formulários e JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para dados de formulários (application/x-www-form-urlencoded)
app.use(bodyParser.json()); // Para dados em JSON (application/json)

// Rota para renderizar a página inicial com perguntas
app.get('/', async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll({raw: true, order:[
            ['id','DESC']
        ]}); // Busca todas as perguntas do banco
        res.render('home', { perguntas }); // Passa as perguntas para a view
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        res.status(500).send('Erro ao buscar perguntas');
    }
});

// Rota para renderizar a página do formulário de perguntas
app.get('/perguntas', (req, res) => {
    res.render('index');
});

// Rota para processar o formulário
app.post('/submit', (req, res) => {
    var pergunta = req.body.pergunta; // Captura a pergunta
    var descricao = req.body.descricao; // Captura a descrição

    Pergunta.create({
        pergunta: pergunta, // Salva a pergunta no banco
        descricao: descricao // Salva a descrição no banco
    }).then(() => {
        res.redirect('/'); // Redireciona para a página inicial após salvar
    }).catch(err => {
        console.error('Erro ao salvar pergunta:', err);
        res.status(500).send('Erro ao salvar pergunta');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/pergunta/:id", (req, res) =>{
    const id = req.params.id;

    Pergunta.findByPk(id)
        .then(pergunta =>{
            if (pergunta) {
                res.render('pergunta', {pergunta});

            } else {
                res.status(404).send('Pergunta não encontrada')
            }
        })
        .catch(err => {
            console.error("erro ao buscar a pergunta", err )
            res.status(500).send('Erro no servidor');
        })

})