import { Link } from "react-router-dom"

function Home () {
    return(
        <div>
            <h2>Pagina home</h2>
            <Link to="/sobre"></Link>
        </div>
    )
}

export default Home