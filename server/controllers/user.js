const users = require('../model/users')
const responseCtrl = require('../responseCtrl')

exports.save = async (req, res) => {
    try {
        const userData = req.body
        const user = new users()
        user.name = userData.name;
        user.email = userData.email;
        user.mobileNumber = userData.mobileNumber;
        user.state = userData.state;
        user.city = userData.city;
        user.areaName = userData.areaName;

        let savedUser = await users.findOne({ mobileNumber: user.mobileNumber }).lean()
        if (savedUser) {
            throw {
                known: true, msg: "User already exists with this mobile number"
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

exports.getuser = async (req, res) => {
    try {
        console.log("gettting user data+++++++++++++++++++++++++")
        let userData = await users.find({}).lean()
        if (userData) {
            responseCtrl.SendSuccess(res, userData)
        } else {
            throw "unexepected error getting data"
        }
    } catch (e) {
        console.log(e)
    }
}