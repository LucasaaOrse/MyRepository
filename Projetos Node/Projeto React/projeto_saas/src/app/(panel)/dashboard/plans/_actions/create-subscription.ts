"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { stripe } from "@/utils/stripe"
import { Plan } from "@/generated/prisma"



interface SubscriptionProps {
  type: Plan
}

export async function createSubscription({type}: SubscriptionProps) {
  
  const session = await auth()
  const userId = session?.user?.id

  if(!userId){
    return {
      sessionId: "",
      error: "Nao autorizado"
    }
  }

  const findUser = await prisma.user.findUnique({where: {id: userId}})

  if(!findUser){
    return {
      sessionId: "",
      error: "Nao autorizado"
    }
  }

  let custumerId = findUser.stripe_customer_id

  if(!custumerId){
    const stripeCustomer = await stripe.customers.create({
      email: findUser.email!
    })

    await prisma.user.update({where: {id: userId}, data: {stripe_customer_id: stripeCustomer.id}})

    custumerId = stripeCustomer.id
  }

  try {

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: custumerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: type === "BASIC" ? process.env.STRIPE_PLAN_BASIC : process.env.STRIPE_PLAN_PROFISSIONAL,
          quantity: 1
        }
      ],
      metadata: {
        type: type
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })

    return {
      sessionId: stripeCheckoutSession.id
    }
    
  } catch (error) {
    console.log(error)
    return {
      sessionId: "",
      error: "Nao autorizado"
    }

  }


}