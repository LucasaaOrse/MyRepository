import { Link } from "react-router-dom";
function Sobre() {
    
    return(
        <div>
            <p>Pagina Sobre</p>
            <Link to="/" >Home</Link>
            <Link to="/Contato">Contato</Link>
        </div>
    )
}

export default Sobre;