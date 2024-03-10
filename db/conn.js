const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://teamtitans:teamtitans11@cluster0.cwbmtny.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>console.log("db connceted"))
.catch(()=>console.log("db conncetion error"));

