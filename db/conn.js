const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sportsapp')
.then(()=>console.log("db connceted"))
.catch(()=>console.log("db conncetion error"));

