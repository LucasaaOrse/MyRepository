import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home/Home";
import Sobre from "./pages/Sobre/Sobre";
import Contato from "./pages/Contato/Contato";
import Header from "./components/header";
import Produto from "./pages/Produto/Produto";

import Erro from "./pages/Erro/Erro";

function RouterApp(){
    return(
        <BrowserRouter>
            <Header/>
            <Routes>    
                <Route path="/" element={<Home/>}/>
                <Route path="/sobre" element={ <Sobre/>}></Route>
                <Route path="/contato" element={ <Contato/> }></Route>
                <Route path="/produto/:id" element={ <Produto/> }></Route>

                <Route path="*" element={ <Erro/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouterApp;