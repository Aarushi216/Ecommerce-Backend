const dotenv = require("dotenv")
dotenv.config()
const AuthRequest = require("./auth.request");
const mailSvc = require("../../services/mail.service")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authSvc = require("./auth.service");

const {MongoClient, ObjectId} = require('mongodb');
const { generateRandomString } = require("../../helpers/helpers");

// core drive  => mongodb
// ORM -> mongoose 
class AuthController{
    async registerUser(req, res, next) {
        // 
        try{
           
            let mapped = (new AuthRequest(req)).tranformRegisterData()
            // operation
            const response = await authSvc.storeUser(mapped)

            // mailSvc.sendEmail(
            //     mapped.email,
            //     "Activate your account!!",
            //     `<b>Dear ${mapped.name},</b>
            //     <p>Your account has been registered successfully.</p>
            //     <p>Please click the link below or copy the url to activate your account: <p>
            //     <a href="${process.env.FRONTEND_URL}/activate/${mapped.token}">${process.env.FRONTEND_URL}/activate/${mapped.token}</a>
            //     <p>Thank you again for the use.</P>
            //     <p>Regards, </p>
            //     <p>No reply, system</p>
            //     <p><small><em>Do not reply to this email</em></small></p>
            //     `
            // )
            
            res.json({
                // result: response, 
                result: response,
                msg: "User Registerd",
                meta: null
            })
        } catch(exception) {
            next(exception);
        }
       
    }
    // ?key=value
    async activateUser(req, res, next) {
        try {
            let token = req.params.token;
            const userDetail = await authSvc.getUserByFilter({token: token})

            if(userDetail.length === 1) {
                // user exists
                let password = bcrypt.hashSync(req.body.password, 10);

                const updateResponse = await authSvc.updateUser(userDetail[0]._id, {
                    password: password,
                    token: null, 
                    status: "active"
                })

                res.json({
                    result: updateResponse, 
                    message: "Your account has been updated successfully.",
                    meta: null
                })

                
            } else {
                next({code: 400, message: "Token expired or does not exists"})
            }
        } catch(exception) {
            next(exception);
        }
    }
    async login(req, res, next) {
        try {
            let credentials = req.body;  
            let userDetail = await authSvc.getUserByFilter({
                email: credentials.email
            })
            
            if(userDetail.length !== 1) {
                next({code: 400, message: "User does not exists or not activated"})
            }
            userDetail = userDetail[0]

            if(userDetail.token) {
                next({code: 400, message: "User not activated"})
            }
            if(bcrypt.compareSync(credentials.password, userDetail.password)) {
                if(userDetail.status !== 'active') {
                    // not allowed
                    next({code: 401, message: "Your account is suspended or not activated. Contact Admin."})
                } else {
                    // password 
                    // 
                    let token = jwt.sign({
                        id: userDetail._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    })

                    let refreshToken = jwt.sign({
                        id: userDetail._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "7h"
                    })

                    res.json({
                        result: {
                            token: token, 
                            refreshToken: refreshToken,
                            type: "Bearer",
                            detail: {
                                _id: userDetail._id, 
                                name: userDetail.name, 
                                email: userDetail.email, 
                                role: userDetail.role
                            }
                        }, 
                        message: "Login Success",
                        meta: null
                    })
                }
            } else {
                console.log("I am here")
                next({
                    code: 400,
                    message: "Credentials Does not match"
                })
            }
        
        } catch(exception) {
            console.log({exception})
            next(exception)
        }
    }

    getLoggedInUser = (req, res, next) => {
        res.json({
            result: req.authUser,
            message: "Your Profile",
            meta: null
        })
    }

    forgetPassword = async (req, res, next) => {
        try {
            let email = req.body.email
            let userDetail = await authSvc.getUserByFilter({
                email: email
            })
            if(userDetail.length === 1) {
                let user = userDetail[0]

                user.forgetToken = generateRandomString(100);
                let date = new Date();
                date.setUTCHours(date.getUTCHours()+2)
                user.validateTill = date;

                await user.save()

                let message = authSvc.getResetMessage(user.name, user.forgetToken)
                // email send 
                await mailSvc.sendEmail(
                    user.email, 
                    "Reset Password",
                    message
                )
                res.json({
                    result: {
                        user: user
                    },
                    message: "Password reset token sent successfully",
                    meta: null
                })
            } else {
                throw {code: 400, message: "User does not exists"}
            }
        } catch(exception) {
            next(exception)
        }
    }

    resetPassword = async(req, res, next) => {
        try {
            let token = req.params.token;
            const userDetail = await authSvc.getUserByFilter({
                forgetToken: token,
                validateTill: {$gte: (new Date())}
            })

            if(userDetail.length === 1) {
                
                const password = bcrypt.hashSync(req.body.password, 10);

                const updateResponse = await authSvc.updateUser(userDetail[0]._id, {
                    password: password,
                    forgetToken: null, 
                    validateTill: null
                })

                res.json({
                    result: updateResponse, 
                    message: "Your password has been changed successfully.",
                    meta: null
                })

                
            } else {
                next({code: 400, message: "Token expired or does not exists"})
            }
        } catch(exception) {
            next(exception);
        }
    }

}
const authCtrl = new AuthController()

module.exports = authCtrl;