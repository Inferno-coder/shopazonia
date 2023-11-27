const stripe = require('stripe')("sk_test_51OGOIzSBeZIW0tLRH25t14BrnIvO8L0oDKkizHqoB6wmmnFdD4YH4o1HFTsCXt65Pyz4XU7jMjRdBILiGKMHutm000ZYAGThxE");

exports.processPayment = async (req, res, next) => {
    try {
        // Input validation
        const { amount, shipping } = req.body;
        if (!amount || !shipping) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            description: "TEST PAYMENT",
            metadata: { integration_check: "accept_payment" },
            shipping,
        });

   
        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred' });
    }
};

exports.sendStripeApi = async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE
    });
};
