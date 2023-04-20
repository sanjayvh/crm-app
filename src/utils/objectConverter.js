exports.userResponse = (users) => {
    let userResult = [];
    users.forEach((user) => {
        userResult.push({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userType: user.userType,
            userStatus: user.userStatus,
        });
    });

    return userResult;
};

exports.ticketResponse = (tickets) => {
    let ticketResult = [];
    tickets.forEach((ticket) => {
        ticketResult.push({
            name: ticket.title,
            ticketPriority: ticket.ticketPriority,
            description: ticket.description,
            status: ticket.status,
            reporter: ticket.reporter,
            assignee: ticket.assignee,
            id: ticket._id,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
        });
    });

    return ticketResult;
};
