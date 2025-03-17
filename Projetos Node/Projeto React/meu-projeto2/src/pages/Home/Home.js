import { Link } from "react-router-dom";

function Home() {
    
    return(
        <div>
            <p>Pagina Home</p>
            <Link to="/sobre">Sobre</Link>
            <Link to="/contato">Contato</Link>
        </div>
    )
}

export default Home;