import getSession  from "@/lib/getSession"
import { redirect } from "next/navigation"
import { getUserData } from "./_data-access/get-data-info"
import { ProfileContent } from "./_components/profile"


export default async function Perfil(){
  const session = await getSession()

  if(!session){
    redirect('/')
  }

  const user = await getUserData({userId: session.user?.id})

  if(!user){
    redirect('/')
  }

  return(
   <ProfileContent user={user}/>
  )
}