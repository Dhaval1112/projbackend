const stripe = require("stripe")(
  "sk_test_51IRYW7DjrsH9s6U73D9LAMQgwlaNmAe9WEz5Jq3Cf9dq75WXTduWkplnAEBIOFSnUzQCjxQ9RaCcZGnL3iuOdOFc00mtxY5XIW"
);
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map((product) => {
    amount += product.price;
  });

  const idempotencyKey = uuid();
  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test Account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => console.log("ERR", err));
    });
};
