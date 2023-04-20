const User = require("./../models/user.model");
const Ticket = require("./../models/ticket.model");
const constants = require("./../utils/constants");
const objectConverter = require("./../utils/objectConverter");

/**
 * Create a ticket
 * As soon as the ticket is created, it will be assigned to an available engineer
 */
exports.createTicket = async (req, res) => {
    const ticketObject = {
        title: req.body.title,
        ticketPriority: req.body.priority,
        description: req.body.description,
        status: req.body.status,
        // req.userId is not passed in payload but is added by
        // decoding token of user requesting to create ticket
        reporter: req.userId, 
    };

    const engineer = await User.findOne({
        userType: constants.userTypes.engineer,
        userStatus: constants.userStatus.approved,
    });
    
    ticketObject.assignee = engineer.userId;
    
    try {
        const ticket = await Ticket.create(ticketObject);
        
        if (ticket) {
            const user = await User.findOne({
                userId: req.userId,
            });
            
            user.ticketsCreated.push(ticket._id);
            engineer.ticketsAssigned.push(ticket._id);
            
            await user.save();
            await engineer.save();

            res.status(200).send({
                details: objectConverter.ticketResponse([ticket])
            });
        }
    } catch (err) {
        console.log("Error while creating ticket");
        return res.status(500).send({
            message: "Some internal error seen while creating ticket: " + err.message,
        });
    }
};

/**
 * Only the user who created the ticket is allowed to update the ticket
 */
exports.updateTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });
    
    if (ticket.reporter == req.userId) {
        ticket.title = req.body.title ? req.body.title : ticket.title;
        ticket.description = req.body.description ? req.body.description : ticket.description;
        ticket.ticketPriority = req.body.ticketPriority ? req.body.ticketPriority : ticket.ticketPriority;
        ticket.status = req.body.status ? req.body.status : ticket.status;
        
        var updatedTicket = await ticket.save();
        
        res.status(200).send(objectConverter.ticketResponse([updatedTicket]));
    } else {
        console.log("Unauthorized user tried to update the ticket");
        res.status(400).send({
            message: "Ticket can be updated only by the customer who created it",
        });
    }
};

exports.getAllTickets = async (req, res) => {
    const queryObj = {
        reporter: req.userId,
    }

    if (req.query.status) {
        queryObj.status = req.query.status;
    }
    
    const tickets = await Ticket.find(queryObj);
    
    res.status(200).send(objectConverter.ticketResponse(tickets));
};