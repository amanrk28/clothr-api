const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'useMerchantId',
    publicKey: 'usePublicKey',
    privateKey: 'usePrivateKey',
});

const getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

const processPayment = (req, res) => {
    const nonceFromTheClient = req.body.paymentMethodNonce;
    const amountFromTheClient = req.body.amount;
    gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true,
            },
        },
        (err, result) => {
            if (err) {
                res.status(500).json(err);
            } else {
                res.send(result);
            }
        }
    );
};

module.exports = { getToken, processPayment };
