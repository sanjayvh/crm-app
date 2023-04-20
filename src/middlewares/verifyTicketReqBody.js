const { ticketStatus } = require("./../utils/constants");

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

validateTicketStatus = async (req, res, next) => {
    const statusReceived = req.body.status;
    const statusTypes = new Set([ticketStatus.open, ticketStatus.closed, ticketStatus.blocked, ticketStatus.inProgress]);

    if (statusReceived && !statusTypes.has(statusReceived)) {
        return res.status(400).send({
            message: `Received invalid status. Valid statusTypes are: ${ticketStatus.open} | ${ticketStatus.closed} | ${ticketStatus.blocked} | ${ticketStatus.inProgress}`,
        });
    }

    next();
};

module.exports = {
    validateTicketRequestBody,
    validateTicketStatus,
}