let mongoose = require('mongoose')
let Schema = mongoose.Schema

var user = new Schema({
    name: { type: String },
    email: {type: String},
    mobileNumber: {type: String, unique: true},
    state: {type: String},
    city: {type: String},
    areaName: {type: String},
    date: {type: Date, default: new Date()}
})

module.exports = mongoose.model('users', user)