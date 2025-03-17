import { Link } from "react-router-dom";
function Contato() {
    
    return(
        <div>
            <p>Pagina Contato</p>
            <Link to="/" >Home</Link>
            <Link to="/Sobre">Sobre</Link>
        </div>
    )
}

export default Contato;