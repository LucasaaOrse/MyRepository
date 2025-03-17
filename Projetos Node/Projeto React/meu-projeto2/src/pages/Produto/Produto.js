import { useParams } from "react-router-dom"

function Produto() {
    
    const { id } = useParams();

    return(
        <div>
            <h2>Pagina do produto {id}</h2>
        </div>

    )
}

export default Produto;
