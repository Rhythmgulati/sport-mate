const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name:String,
    gender:String,
    sports:[String],
    email:String,
    password:String,
    location:String,
    state:String,
    city:String,
    skills:Number,
    tokens:[String]
});

const usermodel = new mongoose.model("Usermodel",user);

module.exports = usermodel;