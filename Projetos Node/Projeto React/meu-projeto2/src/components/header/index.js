import { Link } from "react-router-dom"
import "./style.css"

function Header() {
    
    return(
        <header>
            <h2>Meu site</h2>
            
            <div className="menu">
                <Link to="/">Home</Link>
                <Link to="/contato">Contato</Link>
                <Link to="/sobre">Sobre</Link>
            </div>
        </header>
    )
}

export default Header;