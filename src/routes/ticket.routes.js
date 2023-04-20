const ticketController = require("./../controllers/ticket.controller");
const { authJwt, verifyTicketReqBody } = require("./../middlewares");

module.exports = function(app) {
    app.post('/crm/api/v1/tickets/create', [authJwt.verifyToken, verifyTicketReqBody.validateTicketRequestBody], ticketController.createTicket);
    app.put('/crm/api/v1/tickets/:id', [authJwt.verifyToken, verifyTicketReqBody.validateTicketStatus], ticketController.updateTicket);
    app.get('/crm/api/v1/tickets', [authJwt.verifyToken], ticketController.getAllTickets);
    app.get('/crm/api/v1/tickets/:id', [authJwt.verifyToken], ticketController.getATicket);
}