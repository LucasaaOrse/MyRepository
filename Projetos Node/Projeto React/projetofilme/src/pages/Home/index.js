import { useState, useEffect } from "react"
import api from "../../Services/api"
import { Link } from "react-router-dom"
import "./home.css"

function Home() {
    
    const [filmes, setFilmes] = useState([])
    const [loading, setloading] = useState(true)

    useEffect(() =>{
        async function loadFilmes() {
            const response = await api.get("movie/now_playing",{
                params:{
                    api_key: "0cd75a062e902fdb91f61c9f1e49cb2d",
                    language: "pt-BR",
                    page: 1
                }
            })

            //console.log(response.data.results.slice(0,10))
            setFilmes(response.data.results.slice(0,10))
            setloading(false)
        }

        loadFilmes()
        
    }, [])

    if(loading){
        return(
            <div className="loading">
                <h2>Carregando filmes...</h2>
            </div>
        )

    }

    return(
        <div className="container">
            <div className="lista-filmes">
                {filmes.map((filmes) =>{
                    return(
                        <article key={filmes.id}>
                            <strong>{filmes.title}</strong>
                            <img src={`https://image.tmdb.org/t/p/original/${filmes.poster_path}`} alt={filmes.title}/>
                            <Link to={`/filmes/${filmes.id}`}>Acessar</Link>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;