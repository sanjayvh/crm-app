const User = require("./../models/user.model");
const Ticket = require("./../models/ticket.model");
const { userTypes, userStatus } = require("./../utils/constants");
const objectConverter = require("./../utils/objectConverter");
const sendEmail = require("../utils/notificationClient");

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
        userType: userTypes.engineer,
        userStatus: userStatus.approved,
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

            /**
             *  Sending the notification to the assigned engineer in async manner.
             */
            sendEmail(ticket._id, "Ticket with id: " + ticket._id + " created", ticket.description, user.email + "," + engineer.email, user.email);
            
            res.status(200).send({
                details: objectConverter.ticketResponse([ticket]),
            });
        }
    } catch (err) {
        console.log("Error while creating ticket");
        return res.status(500).send({
            message:
                "Some internal error seen while creating ticket: " + 
                err.message,
        });
    }
};

/**
 * Only the user who created the ticket is allowed to update the ticket
*/
exports.updateTicket = async (req, res) => {
    let ticket;
    
    try {
        ticket = await Ticket.findOne({
            _id: req.params.id,
        });
        
        if (!ticket) {
            return res.status(404).send({
                message: "Ticket not found",
            });
        }
    } catch (err) {
        console.log("Error while fetching ticket: " + err.message);
        return res.status(500).send({
            message: "Internal error while fetching ticket",
        });
    }
    
    const user = await User.findOne({
        userId: req.userId,
    });
    
    if (
        ticket.reporter == req.userId ||
        ticket.assignee == req.userId ||
        userTypes.admin == user.userType
        ) {
            // Allowed to update the ticket
            ticket.title = req.body.title ? req.body.title : ticket.title;
            ticket.description = req.body.description
            ? req.body.description
            : ticket.description;
            ticket.ticketPriority = req.body.ticketPriority
            ? req.body.ticketPriority
            : ticket.ticketPriority;
            ticket.status = req.body.status ? req.body.status : ticket.status;
            
            // Only engineer or admin can reassign the ticket to another engineer
            if (req.body.assignee && (userTypes.engineer == user.userType || userTypes.admin == user.userType))
            ticket.assignee = req.body.assignee ? req.body.assignee : ticket.assignee;
            
            var updatedTicket = await ticket.save();
            
            const engineer = await User.findOne({
                userId: ticket.assignee
            });
            
            const reporter = await User.findOne({
                userId: ticket.reporter
            });
            
            sendEmail(ticket._id, "Ticket with id: " + ticket._id + " updated", ticket.description, user.email + "," + engineer.email + "," + reporter.email, user.email);
            
            res.status(200).send(objectConverter.ticketResponse([updatedTicket]));
    } else {
        console.log("Unauthorized user tried to update the ticket");
        res.status(400).send({
            message:
                "Ticket can be updated only by the customer who created it or engineer assigned to it",
        });
    }
};

exports.getAllTickets = async (req, res) => {
    /**
     * First find the type of user
     * 1. ADMIN should get the list of all the tickets in the decreasing order of creation time
     * 2. Customer should only get the tickets created by the him/her.
     * 3. Engineer should be able to get the tickets assigned to him/her or created by him/her.
     */

    const queryObj = {};

    if (req.query.status) {
        queryObj.status = req.query.status;
    }

    const savedUser = await User.findOne({
        userId: req.userId,
    });

    if (savedUser.userType == userTypes.engineer) {
        queryObj.assignee = req.userId;
    } else if (savedUser.userType == userTypes.customer) {
        queryObj.reporter = req.userId;
    }

    const tickets = await Ticket.find(queryObj);

    res.status(200).send(objectConverter.ticketResponse(tickets));
};

exports.getATicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id,
    });

    res.status(200).send(objectConverter.ticketResponse([ticket]));
};
