/***This is going to the starting point of the application */

const express = require('express');
const app = express();
const serverConfig = require('./configs/server.config');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
/**Register the body-parser middleware */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//Initializeing the connection with MongoDB
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () =>{
    console.log("Error while connecting to MongoDB");
});
db.once("open", () =>{
    console.log("Connected to MongoDB");
    init();
});
//create the ADMIN user at the boot line

async function init(){

    //check if Admin user is alrready present
    try{
        //Every time server starts the collection should be refreshed
        await User.collection.drop();
    /**let user = await User.findOne({userId : "admin"});

    if(user){
        console.log("ADMIN user is already present");
        return;
    }*/

    const user = await User.create({
        name: "satish",
        userId : "admin",
        password : bcrypt.hashSync("welcome1", 8),
        email : "satishttt@gmail.com",
        userType : "ADMIN"
    });

    console.log(user);
}catch(err){
    console.log("err in db initialization" + err.message);
}
}
//we need router to connect  to the server

require("./routes/auth.routes");

app.listen(serverConfig.PORT, ()=>{//trying to create a HTTP server on the 8080
    console.log("started at the PORT number: ", serverConfig.PORT);
});