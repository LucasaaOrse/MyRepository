const express = require('express')
const Games = require("../Games/games")
const router = express.Router()
const cors = require("cors");
const auth = require("../middleware/Authenticator")

router.use(cors());


router.get("/games", auth, (req, res) =>{
    Games.findAll().then(games =>{
        res.json(games)
    })
    
})

router.get("/game/:id", auth, async (req, res) =>{
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

router.get("/game", auth, (req, res) =>{
    res.render("../views/newgame.ejs")
})

router.post("/game", auth, (req, res) =>{
    var title = req.body.title
    var year = req.body.year
    var price = req.body.price

    if(title != undefined && year != undefined && price != undefined){
        Games.create({
            title: title,
            year: parseFloat(year),
            price: parseInt(price) 
        }).then(() =>{
            res.redirect("/games")
        }).catch(err =>{
            res.redirect("/game") 
        })
    }else{
        res.redirect("/game")
    }
})

router.delete("/game/:id", auth, async (req, res) => {
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

router.put("/game/:id", async (req, res) =>{
    var id = req.params.id
    var {title, year, price} = req.body

    try {
        let game = await Games.findByPk(id)

        if(game){
            await game.update({
                title: title,
                year: parseInt(year),
                price: parseInt(price)
            })
            res.status(200).json({message: "Game Atualizado"})
        }else{
            res.status(400).json({message: "Game não encontrado"})
        }

    } catch (error) {
        console.log("Erro ao atualizar o Game", error)
        res.status(500).json({message: "Erro do servidor"})
    }
    

    
})

module.exports = router