const express = require("express") // importando o express
const app = express() // criando o servidor
const bodyParser = require("body-parser")
const session = require("express-session")
const connection = require("./database/database")

const categoriesController = require("./categories/CategoriasController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./Users/usersController")

const Category = require("./categories/Category")
const Article = require("./articles/Article")
const User = require("./Users/user")

app.set('view engine', "ejs") // setando qual a engine vai renderizar nosso html

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    secret: "Qualquercoisa", cookie: { maxAge: 3000000}
}))

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(express.static("public"))
app.use("/", usersController)

connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com sucesso")
    }).catch((error) =>{
        console.error();
        
    })
    app.get("/", (req, res) => {
        const categoryId = req.query.categoryId;  // Obtém o ID da categoria da query string, se houver
    
        // Condicional para aplicar o filtro de categoria
        const filterOptions = categoryId ? { where: { categoryId: categoryId } } : {};
    
        Article.findAll({
            ...filterOptions,  // Aplica o filtro de categoria, se existir
            order: [
                ['id', 'DESC']  // Ordena os artigos pela data de criação (do mais recente ao mais antigo)
                
            ],
            limit: 6
        }).then(articles => {
    
            Category.findAll().then(categories => {
                console.log(categories); // Verifique no console se as categorias estão corretas
                res.render("index", { 
                    articles: articles, 
                    categories: categories, 
                    selectedCategory: categoryId 
                });
            });
            
    
        }).catch((error) => {
            console.error(error);
            res.redirect('/');  // Redireciona para a página inicial em caso de erro
        });
    });
    

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            })
        }else {
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })

})

app.listen(8080, () =>{
    console.log("O servidor esta rodando")


})

app.use("/",categoriesController )

app.use("/",articlesController)