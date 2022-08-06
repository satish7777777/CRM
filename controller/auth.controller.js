/***This file contain the logic for the registration of the user and login of the user
 *
 * *User:
 * 
 * Customer
 * 1. Register and is approved by default
 * 2. should be able to login immediatly
 * 
 * Engineer
 * 1.Should be register
 * 2. Initially he/she will be status will be pending
 * 3. ADMIN should be approve the role
 * 
 * ADMIN
 * 1. ADMIN user should be only created from the baackednd. No API should be used for it 

 */
/** logic to appcept the registration and signup
 * 
 * req --->WHAT will we get from client
 * res --->WHAT is returning from server
 */

const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
const constants = require("../utils/constants");





exports.signup = async (req, res) =>{
    /**I need to read the data from the request body */

    if(req.body.userType != constants.userTypes.customer){
        req.body.userStatus = "PENDING";
    }
    //CONVERTING that into JS object for inserting data into mongo db

    const UserObj = {
        name : req.body.name,
        userId : req.body.userId,
        email : req.body.email,
        userType : req.body.userType,
        password : bcrypt.hashSync(req.body.password, 8),
        userStatus : req.body.userStatus
    };
    //insert the data and return the response

    try{
        const userCreated = await User.create(UserObj);
        /**
         * We need to return newly created user as the response
         * 
         * 
         * 
         * 
         * 
         * 
         */

        const response = {
            name : userCreated.name,
            userid : userCreated.userId,
            email : userCreated.email,
            userType : userCreated.userType,
            userStatus : userCreated.userStatus,
            createdAt : userCreated.createdAt,
            updatedAt : userCreated.updatedAt
        }

        res.status(201).send(response);
    }catch(err){
        console.log("Some error happen", err.message);
        res.status(500).send({
            message : "Some internal server error"
        });
    }
}
 

//Logic to signin

exports.signin = async (req,res) =>{
    //If the userId is correct
    try{
    const user = await User.findOne({userId : req.body.userId});
    if(user == null){
        return res.status(400).send({
            message : "Failed : UserId passed does't exist"
        });
    }
    //If the password is correct
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if(!passwordIsValid){
        return res.status(401).send(({
            message : "Wrong password"
        }))
    }
    //Create the JWT token
    const token = jwt.sign({
        id : user.userId
    }, authConfig.secret,{
        expiredIn : 600
    });

    //Send the successfull login response
    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken : token
    });
}catch(err){
        console.log("Internal error ," , err.message);
        res.status(500).send({
            message : "Some internal error while signin"
        });
    }

}