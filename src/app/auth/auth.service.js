require('dotenv').config();
const UserModel = require("./user.model");

class AuthService{
    
    async storeUser(data) {
        try {
            let user = new UserModel(data);
            return await user.save();       // existing user => update, new user => insert
        } catch(exception) {
            throw exception
        }
    }

    async getUserByFilter(filter = {}) {
        try {
            let userDetail = await UserModel.find(filter)
            
            return userDetail;
        } catch(exception) {
            throw exception;
        }
    }


    async updateUser(id, data) {
        try {
            let response = await UserModel.findByIdAndUpdate(id, {
                $set: data
            })
            return response;
        } catch(exception) {
            throw exception
        }
    }

    getResetMessage =(name, token) => {
        return `
            <b>Dear ${name}</b><br/>
            <p>If you have tried to reset your password, please click or copy paste the following link in the browser:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password/${token}">${process.env.FRONTEND_URL}/reset-password/${token}</a>
            <br/>
            <p>This token /url is valid only for 2 hours</p>
            <p>If this was mistake, please ignore the message.</p>

            <p>Regards, </p>
            <p>No reply, system</p>
            <p><small><em>Do not reply to this email</em></small></p>
        `
    }
}

const authSvc = new AuthService();
module.exports = authSvc