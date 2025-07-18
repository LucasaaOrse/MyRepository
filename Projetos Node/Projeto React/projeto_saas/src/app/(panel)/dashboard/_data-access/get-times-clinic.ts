"use server"

import prisma from "@/lib/prisma"

export async function getTimesClinic({userId}: {userId: string}){
  if(!userId){
    return {
      times: [],
      userId: ""
    }
  }

  try {
    
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        times: true,
        id: true
      }
    })

    if(!user){
      return {
        times: [],
        userId: ""
      }
    }

    return {
      times: user.times ? JSON.parse(user.times) as string[] : [],
      userId: user.id
    }

    

  } catch (error) {
    console.log(error)
    return {
        times: [],
        userId: ""
      }
  }
}


