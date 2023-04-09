const User = require("./../models/user.model");
const { userTypes, userStatus } = require("./../utils/constants");
const config = require("./../config/auth.config");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// sign-up flow
exports.signup = async (req, res) => {
    let userStatusToBeAssigned = userStatus.pending;
    const userTypeToBeAssigned = req.body.userType || userTypes.customer;

    if (userTypeToBeAssigned == userTypes.customer) {
        userStatusToBeAssigned = userStatus.approved;
    }

    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: userTypeToBeAssigned,
        password: bcrypt.hashSync(req.body.password, 10),
        userStatus: userStatusToBeAssigned,
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
        console.log("Error while creating the user", e.message);
        res.status(500).send({
            message: "Some internal error while creating the user",
        });
    }
};

//sign-in flow
exports.signin = async (req, res) => {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
        return res.status(404).send({
            message: "Failed! USer does not exist",
        });
    }

    if (user.userStatus != "APPROVED") {
        return res.status(200).send({
            message: "Can't allow to login as the user is in status: " + user.userStatus,
        });
    }

    var passwordIsValid = await bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            message: "Invalid password",
        });
    }

    var token = jwt.sign(
        {
            id: user.userId,
        },
        config.secret,
        {
            expiresIn: "1d",
        }
    );

    res.status(200).send({
        name: user.name,
        userId: user.userId,
        accessToken: token,
        userType: user.userType,
        message: "Signed-in successfully"
    });
};