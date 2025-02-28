const express = require('express')
const Games = require("../Games/games")
const router = express.Router()
const cors = require("cors");

router.use(cors());


router.get("/games", (req, res) =>{
    Games.findAll().then(games =>{
        res.json(games)
    })
    
})

router.get("/game/:id", async (req, res) =>{
    var id = req.params.id
    let {title, price, year} = req.body

    if(isNaN (id)){
        return res.status(400).json({error: "ID INVALIDO"})
    }else{
        var game = Games.findByPk(id)

    try {
        let game = await Games.findByPk(id)
        
        if(!game){
            return res.status(404).json({error: "Game não encontrado"})
        }
        
        await Games.update(
            {title, price, year},
            {where: {id: id}}
        )
        return res.status(200).json({message: "Game atualizado com sucesso"})

    } catch (error) {
        return res.status(500).json({error: "Erro ao atualizar o Game"})
    }


    }
})

router.get("/game", (req, res) =>{
    res.render("../views/newgame.ejs")
})

router.post("/game/new", (req, res) =>{
    var title = req.body.title
    var year = req.body.year
    var price = req.body.price

    if(title != undefined && year != undefined && price != undefined){
        Games.create({
            title: title,
            year: year,
            price: price
        }).then(() =>{
            res.redirect("/games")
        }).catch(err =>{
            res.redirect("/game") 
        })
    }else{
        res.redirect("/game")
    }
})

router.delete("/game/:id", async (req, res) => {
    let id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" }); // 🔹 Retorna para evitar múltiplas respostas
    }

    try {
        let game = await Games.findByPk(id);

        if (!game) {
            return res.status(404).json({ error: "Game não encontrado" }); // 🔹 Retorna para evitar múltiplas respostas
        }

        await Games.destroy({ where: { id: id } });
        return res.status(200).json({ message: "Game deletado com sucesso" }); // 🔹 Retorna a única resposta
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar game" }); // 🔹 Garante que só há uma resposta
    }
});

router.put("/game/:id",(req, res) =>{

})

module.exports = router