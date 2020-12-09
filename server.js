// server.js

// init project
require('dotenv').config({path: __dirname + '/.env'});
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const ejs = require("ejs");
const util = require("util");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.set("view engine", "ejs");

//Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret: "supersecret",
    resave: true,
    saveUninitialized: true
}));

var globalSession; //global session for demo purposes

//routes
app.get("/", function(request, response) {
  globalSession = request.session;
  //Since this isn't real, destroy the session on homepage load
  if(globalSession.customer){
    request.session.destroy();
  }
  response.render(__dirname + "/views/index.ejs");
});

//Step 1 - Sign Up
app.post("/sign_up", async (request, response) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: request.body.inputEmail,
    name: request.body.inputName
  });
  
  //populate the session
  globalSession = request.session;
  globalSession.customer = customer;

  // Retreive the 3 available plans from Stripe
  const prices = await stripe.prices.list({
    limit: 3, //Only grab the first three for purposes of this example
    expand: ["data.product"] //Expand the product attribute for each
  });
  
  //console.log("Active Prices= " + util.inspect(prices, {showHidden: false, depth: null}));

  // Render the Subscrige Page
  response.render(__dirname + "/views/subscribe.ejs", {
    customer: customer,
    prices: prices
  });
});

//Step 2 - Send user to payment page after they select a plan
app.post("/payment_page", function(request, response) {
  //console message
  console.log("Taking " + globalSession.customer.id + " to the payment page!");
  
  //render the payment page and send down any vars
  response.render(__dirname + "/views/payment.ejs", {
    key: process.env.STRIPE_PUBLISHABLE_KEY,
    priceId: request.body.priceId,
    priceAmount: request.body.priceAmount,
    customer: globalSession.customer
  });
});

//Step 3 - Create the subscription using the paymentMethod created by Elements
app.post("/create_subscription", async (request, response) => {
  console.log(request.body);
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(request.body.paymentMethodId, {
      customer: request.body.customerId
    });
  } catch (error) {
    return response.status("402").send({ error: { message: error.message } });
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(request.body.customerId, {
    invoice_settings: {
      default_payment_method: request.body.paymentMethodId
    }
  });

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: request.body.customerId,
    items: [{ price: request.body.priceId }],
    expand: ["latest_invoice.payment_intent"]
  });
  console.log("New Subscription! ID: " + subscription.id);
  response.send(subscription);
});

//Step 4 - Handle sending user to the Customer Portal
app.get("/customer_portal", async (request, response) => {
  //Load the Customer Portal
  const session = await stripe.billingPortal.sessions.create({
    customer: request.query.id,
    return_url: process.env.RETURN_URL
  });

  response.redirect(session.url);
});

//TODO This app really needs to handle Webhooks!

//helper for formatting price in views
app.locals.toFixed = function(price) {
  let newPrice = price / 100;
  return newPrice.toFixed(2);
};

// listen for requests :)
const listener = app.listen(3000, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
