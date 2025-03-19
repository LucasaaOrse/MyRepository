import "./favoritos.css"

import { useState, useEffect} from "react"
import { Link } from "react-router-dom"
function Favoritos() {
    const [filmes, setFilmes] = useState([])

    useEffect(() => {
      const minhalista = localStorage.getItem("@listafilmes")
      setFilmes(JSON.parse(minhalista) || [])

    
      return () => {
        
      }
    }, [])
    
    function excluirFilmes(id) {
        let filtrofilmes = filmes.filter((item) =>{
            return (item.id !== id) 
        })

        setFilmes(filtrofilmes)
        localStorage.setItem("@listafilmes", JSON.stringify(filtrofilmes))
    }

    return(
        

        <div className="meus-filmes">

            <h1>Meus Filmes</h1>

            {filmes.length === 0 && <span>Você não possui nenhum filme salvo</span>}
            <ul>
                {filmes.map((item) =>{
                    return(
                        <li key={item.id}>
                            <span>{item.title}</span>
                            <div>
                                <Link to={`/filmes/${item.id}`}>Ver detalhes</Link>
                                <button onClick={() => excluirFilmes(item.id)}>Excluir</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Favoritos;