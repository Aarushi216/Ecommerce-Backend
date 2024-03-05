const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");
class MailService {
    transporter;
    constructor(){
        try {
            this.transporter =  nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PWD,
                },
            })
        } catch(exception) {
            console.log(exception);
            // throw new Error("Error connecting SMTP...")
            throw {code: 500, msg: "Error Connecting SMTP Server..."}
        }
    }

    sendEmail = async (to, sub, msg) => {
        try {
            let response = await this.transporter.sendMail({
                to: to, 
                from: process.env.SMTP_FROM_ADDR,
                subject: sub, 
                html: msg,
                text: msg
            })
            if(response) {
                return true
            } else {
                return false;
            }
        } catch(exception) {
            console.log(exception);
            throw {code: 500, msg: "Error sending Email"}
        }
    }
}

const mailSvc = new MailService()
module.exports = mailSvc;