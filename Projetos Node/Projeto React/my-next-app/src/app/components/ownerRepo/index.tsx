"use client"

import { useState } from "react"

import Image from "next/image"


interface OwnerRepoProps{
    avatar_url: string,
    name: string
}


export function OwnerRepo({avatar_url, name}: OwnerRepoProps ){

    const [show, setShow] = useState(false)

    return(
        <div>

            { show && (
                <>
                <Image
                src={avatar_url}
                alt="Foto avatar"
                width={34}
                height={34}
                style={{borderRadius: 8}}    
            
                />
                <strong>{name}</strong>
                </>
            ) }

            <button onClick={ () => setShow(!show)} >
                {show ? "Ocultar nome" : "Mostrar nome"}
            </button>
            
        </div>

    )
}