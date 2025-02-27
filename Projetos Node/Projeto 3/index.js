const fs = require("fs")
var Reader = require("./Reader")
var Processor = require("./Processor")
var Table = require("./Table")
const HtmlParser = require("./HtmlParser")
var Writer = require("./Writer")
var PDFWriter = require("./PDFWriter")

fs.writeFile("./texto.txt", "Reescrevi esse texto :D", (error) =>{
    if(error){
        console.log("Deu erro")
    }
})

fs.readFile("./texto.txt", {encoding: "utf-8"}, (error, dados) =>{
    if(error){
        console.log("Deu erro")
    
    }else{
        console.log(dados)

    }

})

function mudarUser(nome, idade, curso){
    fs.readFile("./lista.json", {encoding: "utf-8"}, (error, dados) =>{
        if(error){
            console.log("deu erro")
        }else{
            var conteudo = JSON.parse(dados)
            conteudo.nome = nome
            conteudo.Idade = idade
            conteudo.Curso = curso

            fs.writeFile("./lista.json", JSON.stringify(conteudo), (error) =>{
                if(error){
                    console.log("deu erro na inscrição")
                }

                
            })
        }
    })
}

var leitor = new Reader()
var escritor = new Writer()

async function main(){
    var dados = await leitor.Read("./planilha.csv")
    var dadosProcessdos = Processor.Process(dados)
    var usuarios = new Table(dadosProcessdos)

    var html = await HtmlParser.parser(usuarios)

    escritor.write(Date.now() + ".html", html)
    PDFWriter.WritePDF(Date.now() + ".pdf",html)

}

main()

mudarUser("Gabriel", "25", "Java")