const express = require("express");
const cors = require("cors");
const SSLCommerzPayment = require("sslcommerz-lts");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("server working ok");
});

const store_id = "giveh6544de5293637";
const store_passwd = "giveh6544de5293637@ssl";
const is_live = false; // true for live, false for sandbox

app.post("/donate", async (req, res) => {
  const { selectedPrice: price } = req.body;
  const transactionId =
    Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  const data = {
    total_amount: price,
    currency: "BDT",
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `https://sslcommerz-practice-demo.vercel.app/payment/success/${transactionId}`,
    fail_url: `https://sslcommerz-practice-demo.vercel.app/payment/fail/${transactionId}`,
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);
    let GatewayPageURL = apiResponse.GatewayPageURL;
    // res.redirect(GatewayPageURL);
    res.send({ url: GatewayPageURL });
    console.log("Redirecting to: ", GatewayPageURL);

    app.post("/payment/success/:transactionId", async (req, res) => {
      const transactionId = req.params.transactionId;
      res.redirect(
        `https://give-hope-react.web.app/donate/success/${transactionId}`
      );
    });
    app.post("/payment/fail/:transactionId", async (req, res) => {
      const transactionId = req.params.transactionId;
      res.redirect(
        `https://give-hope-react.web.app/donate/fail/${transactionId}`
      );
    });
  } catch (error) {
    console.error("Error occurred while initializing payment:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
