

async function getData() {
  
  const response = await fetch("https://api.github.com/users/devfraga/repos");

  return response.json()

}

export default async function Home(){
  const data = await getData()

  return(
    <div>
      <h1>Pagina Home</h1>

    <h3>Repositorios</h3>
    {data.map( (item) => (
      <div key={item.id}>
        <strong>Repositorio: </strong> <a>{item.name}</a>
        <br/>
        <br/>
      </div>
    ) )}
    </div>
  )
}