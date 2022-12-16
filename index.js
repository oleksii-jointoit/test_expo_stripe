require('dotenv').config();
const express = require('express')
const cors = require('cors')
const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.post('/pay', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status('400').json({ message: 'Please enter name' })
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(25 * 100),
      currency: 'GBP',
      payment_method_types: ["card"],
      metadata: { name }
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: 'Payment initiated', clientSecret });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Internal server error'})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
