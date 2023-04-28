var Client = require("node-rest-client").Client;
var client = new Client();

const sendEmail = (ticketId, subject, content, emailIds, requestor) => {
    var reqBody = {
        subject: subject,
        content: content,
        recipientEmails: emailIds,
        requestor: requestor,
        ticketId: ticketId
    };

    var args = {
        data: reqBody,
        headers: {"Content-Type": "application/json"}
    };

    /**
     * Now we will send post request to the notification service
     */

    client.post(process.env.NOTIFICATION_URL, args, function (data, response) {
        console.log("Post Request Sent to the Notification Service");
        console.log(data);
    });
};

module.exports = {
    sendEmail,
    client,
};