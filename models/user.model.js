const mongoose = require('mongoose');
const constants = require('../utils/constants');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    userId : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    email :{
        type : String,
        require : true,
        unique :true,
        minLength : 10,
        lowercase : true
    },
    createdAt :{
        type : Date,
        immutable : true,
        default : () =>{
            return Date.now();
        }
    },
    updatedAt : {
        type : Date,
        default : () => {
            return Date.now();
        }
    },
    userTypes : {
        type : String,
        require : true,
        default : constants.userTypes.customer,
        enum : [constants.userTypes.customer,constants.userTypes.admin,constants.userTypes.engineer]
    },
    userStatus : {
        type : String,
        require : true,
        default : constants.userTypes.approved,
        enum : [constants.userTypes.customer,constants.userTypes.admin,constants.userTypes.engineer]
    }
    
});

module.exports = mongoose.model("user", userSchema);

