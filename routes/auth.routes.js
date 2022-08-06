//this file will contain the logic for routing request
//this file is dedicated to the routing logic for signup and signin

const authController = require("../controller/auth.controller");
const { verifySignup } = require("../middleware")
module.exports = (app)=>{

    app.post("/crm/api/v1/auth/signup",[ verifySignup.validateSignUpRequestBody], authController.signup);

    /**
     * LOGIN
     * 
     * POST
     */
    app.post("/crm/api/v1/auth/signin",[ verifySignup.validateSignInRequestBody], authController.signin);
}