## MERN Stack Project:  ShopEase
# ShopEase Tech Stack - Reactjs, Tailwindcss, Stripe, Recharges  Nodejs, Expressjs, Mongodb

## Features
Sign Up and SignIn User

Authenticate Using JWT

Generate IdentityId and create User

User can be able to see the sidebar with Dashboard, Products, Profile, Manage addresses

Dashboard shows analytics of orders , carts , wishlist(0 by default not connected dummy wishlist info), orders over time and cart items by category

Products Page listing all products

User can be able to add to cart

In cart user add increase or decrease product quantity also can remove the product

User can select saved address, also can add new address in that cart for shipping

Before allowing user to use stripe, we will send otp to the mobilenumber(mock, later we can connect real sms service) and will allow them to enter otp

After succesfully entered correct OTP, user is allowed to provide payment card info for connecting stripe

Once successfully done the payment, we can see the order success page along with continue shopping which is redirect to products page

In Sidebar section user can see Manage Addresses option to add new addresses,this will be called when we go cart for shipping. In this section, also we can see the list of saved addresses

User can edit the saved addresses, also can add new address, while saving we have option like Home or Work

In the Sidebar Section, we also have Profile section, in this section, UserName and email cannot be edited only mobile can be added or updated

Also we have added dummy user icon as profile image(icon). Later we can connect cloudinary or any package to upload images.

### Setup .env file

```
PORT=5001
MONGO_URI=
STRIPE_SECRET_KEY=
JWT_SECRET_KEY=
IDENTITY_SECRET_KEY=
NODE_ENV=
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```

## AUTHOR
- [@SwethaNatarajan](https://github.com/SwethaNatarajan29-12)

# Hi, I'm Swetha Natarajan, an Engineer.

## 🔗 Links
LinkedIn - https://www.linkedin.com/in/swetha-natarajan-61560a20a
