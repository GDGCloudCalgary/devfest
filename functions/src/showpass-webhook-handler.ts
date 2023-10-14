import * as functions from "firebase-functions";

export const showpassWebhookHandler = functions.runWith({
    maxInstances: 50
}).https.onRequest(async (req, res) => {
    const webhookHeaders = req.headers;
    const webhookData = req.body;

    const headerKeySignature = webhookHeaders?.['X-SHOWPASS-SIGNATURE'];
    const secretKey = functions.config()?.showpass?.secret_key;

    if (headerKeySignature !== secretKey) {
        //
    }

    functions.logger.log(JSON.stringify(webhookHeaders, null, 2));
    functions.logger.log(JSON.stringify(webhookData, null, 2));

    res.status(200).send();
    return;
});
