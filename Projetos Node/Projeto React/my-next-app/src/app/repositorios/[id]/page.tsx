
interface PageDetailProps{
    params: {
        id: string
    }

}


export default function RepositorioId( { params }: PageDetailProps ){

    return(
        <div>
            <h1>Esse é o repositorio do {params.id}</h1>

        </div>

    )

}