// const express = require("express")
// const router = express.Router()
const router = require("express").Router();
const validateRequest = require("../../middlewares/validator.middleware");
const authCtrl = require("./auth.controller");
const { registerSchema, userPasswordSchema, loginSchema, forgetPasswordSchema } = require("./auth.validator");
const uploader = require("../../middlewares/uploader.milddleware");
const checkLogin = require("../../middlewares/auth.middleware");
const checkPermission = require('../../middlewares/rbac.middleware')
//  http://localhost:3000/auth/register?key=value
router.post("/register",uploader.single('image'), validateRequest(registerSchema), authCtrl.registerUser)

router.post("/activate/:token",validateRequest(userPasswordSchema), authCtrl.activateUser)

router.post("/login", validateRequest(loginSchema), authCtrl.login)

router.get("/me", checkLogin, authCtrl.getLoggedInUser)
// router.get("/refresh-token", checkLogin, authCtrl.refreshToken)


router.get("/admin",checkLogin, checkPermission('admin'), (req, res, next) => {
    res.send("I am admin control")
})
router.post("/forget-password",validateRequest(forgetPasswordSchema), authCtrl.forgetPassword)

router.post("/reset-password/:token", validateRequest(userPasswordSchema), authCtrl.resetPassword)
module.exports = router;