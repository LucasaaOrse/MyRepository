
import { useState, useEffect } from 'react';
import RouterApp from './routers';

function App() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [idade, setIdade] = useState("")

  const [user, setUser] = useState({})
  const [input, setInput] = useState("")
  const [tarefas, setTarefas] = useState([])

  useEffect(() =>{
    const localStorageTarefas = localStorage.getItem('@tarefas')

    if(localStorageTarefas){
      setTarefas(JSON.parse(localStorageTarefas))
    }

  },[])

  useEffect(() => {
    localStorage.setItem('@tarefas', JSON.stringify(tarefas))
  }, [tarefas])

  function enviar(e){
    e.preventDefault()

    setTarefas((prevtarefas) => [...prevtarefas, input]);
    setInput("")
  }

  function register(e) {
    e.preventDefault();
    
    setUser({
      nome: nome,
      email: email,
      idade: idade
      
    })

  }

  return (
    <div>
        <RouterApp/>
      <form onSubmit={ register }>
        <label>Nome</label><br></br>
        <input placeholder='Digite seu Nome' value={nome} onChange={(e) => setNome(e.target.value)}></input> <br></br>
        <label>Email</label><br></br> 
        <input placeholder='Digite seu Email'value={email} onChange={(e) => setEmail(e.target.value)}></input><br></br>
        <label>Idade</label><br></br>
        <input placeholder='Digite sua Idade' value={idade} onChange={(e) => setIdade(e.target.value)}></input><br></br>
        <button type='submit'>Enviar</button><br></br> <br></br>
      </form>
      <div>
        <span>Bem vindo: {user.nome} </span><br></br>
        <span>Email: {user.email} </span><br></br>
        <span>Idade: {user.idade} </span><br></br><br></br><br></br>

        <form onSubmit={ enviar} >
          <label>Tarefa</label><br></br>
          <input placeholder="Digite sua tarefa" value={input} onChange={ (e) => setInput(e.target.value)}></input><br></br>
          <button type='submit'>Enviar</button>
        </form>
        <ul>
          {tarefas.map( tarefa =>(
            <li key={tarefa} >{tarefa}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
