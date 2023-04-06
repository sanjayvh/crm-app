const User = require("./../models/user.model");
const { userType, userStatus } = require("./../utils/constants");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup flow
exports.signup = async (req, res) => {
    const userStatusReceived = req.body.userStatus;
    const userTypeReceived = req.body.userType;

    if (!req.body.userStatus) {
        if (!userTypeReceived || userTypeReceived == userType.customer) {
            userStatusReceived = userStatus.approved;
        } else {
            userStatusReceived = userStatus.pending;
        }
    }

    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 10),
        userStatus: userStatusReceived,
    };

    try {
        const userCreated = await User.create(userObj);
        const postResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userType: userCreated.userType,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt,
        };

        res.status(201).send(postResponse);
    } catch (e) {
        console.err("Error while creating the user", e.message);
        res.status(500).send({
            message: "Some internal error while creating the user",
        });
    }
};
