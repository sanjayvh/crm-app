// const { ticketStatus } = require("./../utils/constants");

validateTicketRequestBody = async (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).send({
            message: "Failed! Title not provided",
        });
    }

    if (!req.body.description) {
        return res.status(400).send({
            message: "Failed! Decription not provided",
        });
    }

    next();
};

module.exports = {
    validateTicketRequestBody,
}