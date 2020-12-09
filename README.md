## Getting Started

This is an simple and lightweight example application that implements Stripe Billing.  In this example, the user begins the sign up process and selects the monthly plan of their choice.  In this case, there are three different plans to choose from.  

You will need the following to use this app:

[Node.js](https://nodejs.org/en/) - Ensure your machine has the latest version of Node.js installed

If you have any questions along the way, simply [email me](mailto:karljr79@gmail.com)

## Stripe account

You will need a Stripe account to use this app.  You can sign up for one [here](https://dashboard.stripe.com/register)

## Stripe Billing Setup

Before you use this app, you will need to create some products.  To do so, log into the Stripe Dashboard and head to the [products page](https://dashboard.stripe.com/test/products).  Once there, use the "Add Product" button to add the following three products: 

1. Gold plan
2. Silver plan 
3. Basic plan

There is no need to enter descriptions or images, but make sure you set a monthly price and make sure "Recurring" is selected. 

You can create more products, but this app is configured to dynamically display 3.

## Customer Portal Setup (optional)

This app makes use of the [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal) after the payment is complete.  To ensure the portal is rendered properly, there is some setup you will need to do in the Stripe Dashboard.  

On the home page, there is also a simple text input at the top where you can go directly to the Customer Portal for a given customer ID.  This is just a shortcut for demonstration purposes.  

Follow Step 1 of the guide in the Stripe Documentation [here](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal#configure)

## Running the Application

In order to run this demo on your local machine, please follow the steps below:

1. Clone or Download the source code in this repo. If you plan on cloning, open a terminal window, navigate to the folder where you want this project to live and enter the following command:
```bash
$ git clone https://github.com/Karljr79/stripe-billing-example
```

2. Once you have cloned/downloaded the source, you will need to use npm to install project dependencies prior to running the code.  
```bash
$ cd stripe-billing-example
$ npm install
```

3. In the root directory, there is a file named 'sample.env'. Open this up in your favorite text editor and enter values for the following keys. These can be found from your Stripe account's dashboard.  If you don't intend to use the customer portal, leave the return url blank. When you are done, be sure to rename the file to ".env":
```
STRIPE_PUBLISHABLE_KEY=YOUR_PK_HERE
STRIPE_SECRET_KEY=YOUR_SK_HERE
RETURN_URL=YOUR_RETURN_URL
```

4. Once the dependencies have completed installing and your Stripe credentials are in place, you are now ready to run the project.  To start the server,
```bash
$ npm start
```

5. Now that the code is running, open a browser and navigate to: [http://localhost:3000/](http://127.0.0.1:3000/)

## Using the Application

Start off by entering your Name and Email address.  These attributes are used to create a [Stripe customer object](https://stripe.com/docs/api/customers/object).  The next step is to select one of the plans.  The pricing is pulled down dynamically based on the [products](https://stripe.com/docs/api/products/object) you created in your Stripe account above.  Selecting a plan brings the user to the payment page.  You can guess what happens there :) The payment page utilizes [Stripe Elements](https://stripe.com/docs/stripe-js) for a secure and easy to implement credit card form.  In case this test card is not burned into your memory, you can use the sample successful credit card below.  

__Card__ #: 4242 4242 4242 4242  
__Exp__: Any date in the future  
__CVV__: Any three digits  
__Zip__: Any 5 digits (For US)  

After you click purchase, a simple confirmation pane will be displayed witrh the following information:

-payment intent ID  
-charge ID  
-amount paid  
-link to the Stripe invoice for the first billing period  
-A button which will take you to the Stripe Customer Portal to manage the newly minted subscription  


