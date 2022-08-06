/**
 * THIS file will have the logic to validate th incoming request
 */
const User = require("..models/user.model.js");
const constants = require("../utils/constants");
validateSignUpRequestBody = async (req,res,next) =>{
    //Validate if name is present
    if(!req.body.name){
        return res.staus(400).send({
            message : "Failed ! User name is not provided"
        })
    }

    //Validate if userId is present, and it's not duplicate
    if(!req.body.userId){
        return res.staus(400).send({
            message : "Failed ! UserId is not provided"
        })
    }

    try{
        const user = await User.findOne({userId : req.body.userId});
        if(user !=null){
            return res.status(400).send({
                message : "Failed : UserId is already present Try different"
            })
        }
    }catch(err){
        return res.status(500).send({
            message : "Internal error server while validating the request"
        })
    }
    

    //Validate if passsword is present or not
    if(!req.body.password){
        return res.staus(400).send({
            message : "Failed : password is not provided"
        });
    }

    //Validate if email is present, and it,s not dublicate
    if(!req.body.email){
        return res.status(400).send({
            message : "Failed : email is not provided"
        });
    }
    if(!isValidEmail(req.body.email)){
        return res.status(400).send({
            message : "Failed : email is not valid"
        })
    }

    
    //Validate if user type is present or not
    if(!req.body.userType){
        return res.status(400).send({
            message : "Failed : User type is not passed"
        });
    }

    if(req.body.userType == constants.userTypes.admin){
        res.status(400).send({
            message : "ADMIN registration is not allowed"
        })
    }
    const userTypes = [constants.userTypes.customer, constants.userTypes.engineer];

    if(!userTypes.includes(req.body.userType)){
        res.status(400).send({
            message : "UserType provided is not correct.Possible correct values : CUSTOMER | ADMIN | ENGINEER"
        })
    }

    const isValidEmail = (email) => {
        return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    next();//Given control to the next middleware or controller
}

validateSignInRequestBody = (req, res, next) =>{
    //Validate if userId is present
    if(!req.body.userId){
        return res.staus(400).send({
            message : "Failed ! UserId is not provided"
        })
    }

    //Validate if passsword is present or not
    if(!req.body.password){
        return res.staus(400).send({
            message : "Failed : password is not provided"
        });
    }
    next();
}

const verifyRequestBodiesForAuth = {
    validateSignUpRequestBody : validateSignUpRequestBody ,
    validateSignInRequestBody : validateSignInRequestBody
};

module.exports = verifyRequestBodiesForAuth