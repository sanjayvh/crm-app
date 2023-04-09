const jwt = require("jsonwebtoken");
const { secret } = require("../config/auth.config");
const User = require("../models/user.model.js");
const { userTypes } = require("../utils/constants");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    // let token = req.header("x-access-token");

    if (!token) {
        return res.status(403).send({
            message: "Access token not provided",
        });
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized",
            });
        }

        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req, res, next) => {
    const user = await User.findOne({
        userId: req.userId,
    });

    if (user && user.userType == userTypes.admin) {
        next();
    } else {
        return res.status(403).send({
            message: "Require Admin Role",
        });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
};
