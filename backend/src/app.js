const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const braintree = require("braintree");

const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// app.use(app.logger());

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "65smb65yhv9ypytp",
  publicKey: "897dp8qqrrysx2j9",
  privateKey: "0ee59309dd57b4c7156c08cdb8d28026",
});

app.post("/token", (req, res) => {
  const token = Object.keys(req.body);
  const clearToken = JSON.parse(token);
  console.log(clearToken);

  gateway.transaction.sale(
    {
      amount: "199.00",
      paymentMethodNonce: clearToken,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (result) {
        console.log(result.transaction.id);
        app.locals.successId = result.transaction.id;
        app.locals.status = result.transaction.status;
        app.locals.amount = result.transaction.amount;
        app.locals.createdAt = result.transaction.createdAt;
        app.locals.cardType = result.transaction.creditCard.cardType;
      } else {
        res.status(500).send(err);
        console.log(err);
        app.locals.error = err;
      }
    }
  );
});

app.get("/success", (req, res) => {
  res.responseType = "text";
  res.json({
    successId: app.locals.successId,
    status: app.locals.status,
    amount: app.locals.amount,
    createdAt: app.locals.createdAt,
    card: app.locals.cardType,
    error: app.locals.error,
  });
});

app.use("/", (req, res) => {
  res.send("Server running!");
});

const server = app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
