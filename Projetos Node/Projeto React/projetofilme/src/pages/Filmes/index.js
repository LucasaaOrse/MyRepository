import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import "./filme-info.css"

import api from "../../Services/api"

function Filmes() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [filme, setFilme] = useState({})
    const [loading, setloading] = useState(true)

    useEffect(() =>{
        async function loadFilme() {
            await api.get(`movie/${id}`, {
                params: {
                    api_key: "0cd75a062e902fdb91f61c9f1e49cb2d",
                    language: "pt-BR"
                }
            }).then((response) =>{
                console.log(response.data)
                setFilme(response.data)
                setloading(false)
            }).catch(() =>{
                console.log("filme não encontrado")
                navigate("/", {replace: true})
                return;
            })
        }

        loadFilme()

        return(
            console.log("Componente desmontado")
        )
    },[navigate, id])

    function salvarFilme() {
        const minhaLista = localStorage.getItem("@listafilmes")
        
        let filmesSalvos = JSON.parse(minhaLista) || [];

        const hasFilme = filmesSalvos.some( (filmeSalvo) => filmeSalvo.id === filme.id )

        if(hasFilme){
            alert("Esse filme ja esta na sua Lista")
            return;
        }

        filmesSalvos.push(filme)
        localStorage.setItem("@listafilmes", JSON.stringify(filmesSalvos))
        alert("Filme salvo")
    }

    if(loading){
        return(
            <div className="filme-info" >
                <h1>Carregando detalhes do filme</h1>
            </div>
        )
    }

    return(
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>
            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average} / 10</strong>

            <div className="area-button">
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel="external" href={`http://youtube.com/results?search_query=${filme.title} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>
        </div>
    )
}

export default Filmes;