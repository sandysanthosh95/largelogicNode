const users = require('../model/users')
const responseCtrl = require('../responseCtrl')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

exports.save = async (req, res) => {
    try {
        console.log("users", req.body)
        const userData = req.body
        let user = new users()
        user.name = userData.name
        user.mobileNumber = userData.mobileNumber
        user.password = cryptr.encrypt(userData.password);
        let savedUser = await users.findOne({ mobileNumber: user.mobileNumber }).lean()
        if (savedUser) {
            throw {
                known: true, msg: "User already exists with this mobile number, Please Login"
            }
        } else {
            saveUser()
        }

        function saveUser() {
            user.save((err, data) => {
                if (err) {
                    console.log(err)
                    responseCtrl.SendBadRequest(res, err.message)
                } else {
                    console.log(data)
                    responseCtrl.SendSuccess(res, data)
                }
            })
            return
        }
    } catch (e) {
        console.log(e)
        let msg = e.known ? e.msg : "Unexpected error accessing data"
        return responseCtrl.SendInternalError(res, msg)
    }
}

exports.login = async (req, res) => {
    try {
        const loginData = req.body
        let user = await users.findOne({ mobileNumber: loginData.mobileNumber }).lean()
        if (user) {
            const decryptedPassword = cryptr.decrypt(user.password)
            if (decryptedPassword == loginData.password) {
                responseCtrl.SendSuccess(res, user)
            } else {
                responseCtrl.SendNotFound(res, "Invalid Credentials")
            }
        } else {
            responseCtrl.SendNotFound(res, "User not found, please signup before login")
        }
    } catch (e) {
        console.log(e)
        responseCtrl.SendInternalError(res, "Unexpected error accessing data")
        return
    }
}



