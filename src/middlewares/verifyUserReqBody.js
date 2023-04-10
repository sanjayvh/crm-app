// This file will contain the middlewares for validating the userId and email

const User = require("./../models/user.model");
const { userTypes, userStatus } = require("./../utils/constants");

validateUserReqBody = async (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).send({
            message: "Failed! Username is not provided",
        });
    }
    
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed! UserId is not provided",
        });
    }
    
    const user = await User.findOne({ userId: req.body.userId});

    if (user) {
        return res.status(400).send({
            message: "Failed! UserId already exists",
        });
    }
    
    const email = await User.findOne({ email: req.body.email});
    
    if (email) {
        return res.status(400).send({
            message: "Failed! Email already exists",
        });
    }
    
    const userTypeReceived = req.body.userType;
    const s = new Set([
        userTypes.customer,
        userTypes.engineer,
        userTypes.admin
    ]);
    
    if (userTypeReceived && !s.has(userTypeReceived)) {
        return res.status(400).send({
            message: `Invalid userType. Valid userTypes are: ${userTypes.customer} | ${userTypes.engineer} | ${userTypes.admin}`,
        });
    }
    
    next();
};

validateUserStatusAndUserType = async (req, res, next) => {
    const userTypeReceived = req.body.userType;
    const validUserTypes = new Set([
        userTypes.customer,
        userTypes.engineer,
        userTypes.admin
    ]);
    
    if (userTypeReceived && !validUserTypes.has(userTypeReceived)) {
        return res.status(400).send({
            message: `Invalid userType. Valid userTypes are: ${userTypes.customer} | ${userTypes.engineer} | ${userTypes.admin}`,
        });
    }
    
    const userStatusReceived = req.body.userStatus;
    const validUserStatus = new Set([
        userStatus.approved,
        userStatus.pending,
        userStatus.rejected,
    ]);
    
    if (userStatusReceived && !validUserStatus.has(userStatusReceived)) {
        return res.status(400).send({
            message: `Invalid userStatus. Valid userStatus are: ${userStatus.approved} | ${userStatus.pending} | ${userStatus.rejected}`,
        });
    }

    next();
};

module.exports = {
    validateUserReqBody,
    validateUserStatusAndUserType,
};