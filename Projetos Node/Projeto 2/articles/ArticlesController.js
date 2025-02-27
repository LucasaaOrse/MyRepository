const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req,res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles})
    })
    
    

})

router.get("/admin/articles/new", adminAuth, (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
    

})

router.post("/articles/save", adminAuth,(req,res) => {
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");

    })

})

router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id
    if (id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }else{
        res.redirect("/admin/articles")
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id
    Article.findByPk(id).then(article =>{
        if(article != undefined){

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article})
            })
            

        }else{
            res.redirect("/")
        }

    }).catch(err =>{
        res.redirect("/")
    })

})

router.post("/article/update", adminAuth, (req, res) => {
  var id = req.body.id 
  var title = req.body.title
  var body = req.body.body
  var category = req.body.category

  Article.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
    where: {
        id: id
    }
    }).then(() =>{
        res.redirect("/admin/articles")
    }).catch(err => {
        res.redirect("/")

  } )
})

router.get("/articles/page/:num", (req, res) => {
    var page = parseInt(req.params.num);
    var limit = 6; // Número de artigos por página

    if (isNaN(page) || page < 1) {
        page = 1; // Garante que a primeira página seja usada se um valor inválido for passado
    }

    var offset = (page - 1) * limit;
    var selectedCategory = req.query.categoryId || ""; // Obtém categoria selecionada

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [
            ['id', 'DESC']  // Ordena os artigos pela data de criação (do mais recente ao mais antigo)
            
        ]
    }).then(articles => {
        var next = offset + limit < articles.count; // Verifica se há próxima página

        Category.findAll().then(categories => {
            res.render("admin/articles/page", { 
                result: { next: next, articles: articles }, 
                categories: categories, 
                currentPage: page,
                selectedCategory: selectedCategory // Passa a variável para a view
            });
        });

    }).catch(err => {
        console.log(err);
        res.redirect("/");
    });
});



module.exports = router