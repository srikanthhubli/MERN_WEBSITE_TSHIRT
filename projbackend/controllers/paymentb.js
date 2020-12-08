const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "x366rmsnkr9pf69v",
  publicKey: "2zzgxd34mcqtdmxw",
  privateKey: "bb827d950ee51b879705fd921b96cd1f"
});


exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        // pass clientToken to your front-end
        if(err){
            res.status(500).send(err)
        }
        else {
            res.send(response)
        }
      });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: req.body.amount,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
              res.status(500).json(err)
          }
          else {
              res.json(result)
          }
      });
}
