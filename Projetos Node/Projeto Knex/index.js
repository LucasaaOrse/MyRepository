var database = require("./database")

/*
var dados = [
    {
        game_id: 1,
        estudio_id: 2
    },
    {
        game_id: 1,
        estudio_id: 3
    },
    {
        game_id: 1,
        estudio_id: 4
    },
    {
        game_id: 2,
        estudio_id: 1
    },
    {
        game_id: 2,
        estudio_id: 4
    },
    {
        game_id: 5,
        estudio_id: 4
    },
    {
        game_id: 5,
        estudio_id: 5
    },
    {
        game_id: 5,
        estudio_id: 6
    },
]


 //inserir dados na tabela
database.insert(dados).into("game_estudio").then(data =>{
    console.log(data)
}).catch(error =>{
    console.log(error)
})
*/


/* //selecionando dados da tabela
database.select().table("games").then(data =>{
    console.log(data)
}).catch(error =>{
    console.log(error)
})

*/

 //inserir dados associados
/* 
database.insert({
    nome: "Bandai"
}).table("estudios").then(data =>{
    console.log(data)
}).catch(error =>{
    console.log(error)
})


/* //Selecionar dados de tabelas associadas
database.select("games.*", "estudios.nome as estudio_nome").table("games").innerJoin("estudios", "estudios.game_id", "games.id").then(data =>{
    console.log(data)
}).catch(error =>{
    console.log(error)
})
*/

/*
database.select("games.*", "estudios.nome as estudio_nome").table("games").innerJoin("estudios", "estudios.game_id", "games.id").then(data =>{
    var estudiosGamesArray = data
    var game = {

            id: data[0].id,
            nome: data[0].id,
            estudios: []
        }


    data.forEach(estudio =>{
        game.estudios.push({nome: estudio.estudio_nome})
    })

    console.log(game)
}).catch(error =>{
    console.log(error)
})
*/

/*
database.select([
    "estudios.nome as estudio_nome",
    "games.nome as game_nome",
    "games.preco"
    ]).table("game_estudio")
    .innerJoin("games", "games.id", "game_estudio.game_id")
    .innerJoin("estudios", "estudios.id", "game_estudio.estudio_id")
    .then(data =>{
        console.log(data)
    }).catch(error =>{
        console.log(error)
    })

*/
/*
async function testeTransaction() {
    try {
        await database.transaction(async trans =>{
            await database.insert({nome: "Capcom"}).table("estudios")
        })
    } catch (error) {
        console.log(error)
    }
}
*/