import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string)
// function to get the stripe session
export async function GET() {

  console.log(process.env.STRIPE_CLIENT_SECRET, 'GEt endpoint hit👉🏻')
  const user = await currentUser()
  if (!user) return NextResponse.json({ status: 404 })
  // get the price id from the env file
    const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID
  // The session object in the code represents a Stripe Checkout session. It is created to facilitate the 
  // subscription process for a user. The session includes details such as the mode (subscription), line items 
  // (the subscription plan), and URLs for success and cancellation. When the session is successfully created,
  //  it provides a URL where the user can complete the payment process and a customer ID associated with the session.
    const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/payment?cancel=true`,
  })

  if (session) {
    return NextResponse.json({
      status: 200,
      session_url: session.url,
      customer_id: session.customer,
    })
  }

  return NextResponse.json({ status: 400 })
}
