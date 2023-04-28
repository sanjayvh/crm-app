const { userStatus } = require("../utils/constants");
const User = require("./../models/user.model");
const objectConverter = require("./../utils/objectConverter");

exports.findAll = async (req, res) => {
    const userTypeReq = req.query.userType;
    const userStatusReq = req.query.userStatus;
    const userNameReq = req.query.name;

    var users;

    if (userNameReq) {
        try {
            users = await User.find({
                name: userNameReq,
            });
        } catch (err) {
            console.log("Error while fetching users with name: " + userNameReq);
            return res.status(500).send({
                message: "Some internal error occured while fetching users with name: " + userNameReq,
            });
        }
    } else if (userTypeReq && userStatusReq) {
        try {
            users = await User.find({
                userType: userTypeReq,
                userStatus: userStatusReq,
            });
        } catch (err) {
            console.log(`Error while fetching users with userType: ${userTypeReq} and userStatus: ${userStatusReq}`);
            return res.status(500).send({
                message: `Some internal error occured while fetching users with userType: ${userTypeReq} and userStatus: ${userStatusReq}`,
            });
        }
    } else if (userTypeReq) {
        try {
            users = await User.find({
                userType: userTypeReq,
            });
        } catch (err) {
            console.log(`Error while fetching users with userType: ${userTypeReq}`);
            return res.status(500).send({
                message: `Some internal error occured while fetching users with userType: ${userTypeReq}`,
            });
        }
    } else if (userStatusReq) {
        try {
            users = await User.find({
                userStatus: userStatusReq,
            });
        } catch (err) {
            console.log(`Error while fetching users with userStatus: ${userStatusReq}`);
            return res.status(500).send({
                message: `Some internal error occured while fetching users with userStatus: ${userStatusReq}`,
            });
        }
    } else {
        try {
            users = await User.find();
        } catch (err) {
            console.log(`Error while fetching users`);
            return res.status(500).send({
                message: `Some internal error occured while fetching users`,
            });
        }
    }
    
    return res.status(200).send(objectConverter.userResponse(users));
};

exports.findById = async (req, res) => {
    const userReq = req.params.userId;
    
    const user = await User.findOne({
        userId: userReq,
    });
    
    console.log(user);
    if (user) {
        return res.status(200).send(objectConverter.userResponse(user));
    } else {
        return res.status(200).send({
            message: `User with this id: ${userReq} is not present`,
        });
    }
};

exports.update = async (req, res) => {
    const userReq = req.params.userId;
    
    let itemsToBeUpdated = {};
    req.body.name ? itemsToBeUpdated["name"] = req.body.name: "";
    req.body.userStatus ? itemsToBeUpdated["userStatus"] = req.body.userStatus: "";
    req.body.userType ? itemsToBeUpdated["userType"] = req.body.userType: "";

    try {
        const user = await User.findOneAndUpdate({
            userId: userReq
        }, itemsToBeUpdated, {
            new: true
        }).exec();

        return res.status(200).send({
            message: "User details updated successfully",
            // data: objectConverter.userResponse([user]),
        });
    } catch (err) {
        console.log(`Error while updating user`, err.message);
        return res.status(500).send({
            message: `Some internal error occured while updating user`,
        });
    }
};