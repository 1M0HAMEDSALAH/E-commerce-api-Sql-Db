const express = require("express");
const router = express.Router();
const { signUpValidator } = require("../helpers/valaditor");
const userController = require("../controllers/userController");
const authorization = require("../middleware/verifyToken");



router.post("/Register", signUpValidator, userController.register);

router.post("/Register1", signUpValidator, userController.NewRegister);

router.post("/Login", userController.login);

router.get('/verify-email', authorization , userController.verifyEmail);

router.post('/send-reset-code', userController.sendResetCode);

router.post('/reset-password', userController.resetPassword);



module.exports = router;