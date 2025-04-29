import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

import { OwnerRepo } from "./components/ownerRepo";

interface DataProps{
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string
    id: number
    avatar_url: string
    url: string
  }
}


async function getData() {
  
  const response = await fetch("https://api.github.com/users/devfraga/repos");

  return response.json()

} 

export default async function Home(){
  const data: DataProps[] = await getData()

  return(
    <div>
      <h1>Pagina Home</h1>

    <h3>Repositorios</h3>
    {data.map( (item: DataProps ) => (
      <div key={item.id}>
        <strong>Repositorio: </strong> <a>{item.name}</a>
        <OwnerRepo
          avatar_url={item.owner.avatar_url}
          name={item.owner.login}
        />
        <br/>
        <br/>
      </div>
    ) )}
    </div>
  )
}