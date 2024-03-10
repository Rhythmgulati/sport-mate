const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require("../db/conn");
const user = require("../db/models/user");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser');
const { log } = require('handlebars');

const PORT = process.env.PORT || 3000;
app.use(cookieParser());
app.use(session({
  secret: 'wjadnakbd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname,"../public")
console.log(staticPath);

app.use(express.static(staticPath));

const templatepath = path.join(__dirname,"../templates/views");
app.set("view engine","hbs");
app.set("views",templatepath);




const islogin = async (req, res, next) => {
  try {
    if (req.cookies.token){
     next(); 
    }
     else {
       res.redirect("/login2");
      }
     
  } catch (error) {
    console.log(error.message);
  }
};

app.get("/",(req,res)=>{
   res.render("index")
})
app.post("/register", async (req, res) => {
  try {
    const { username, gender, sports, email, password, location, city, state , skills } = req.body;

    // Check if the email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const Hashedpassword = await bcrypt.hash(password, 10);
    const newuser = new user({
      name: username,
      gender,
      sports,
      email,
      password: Hashedpassword,
      location,
      state,
      city,
      skills
    });

    await newuser.save();
    res.cookie.username = email;
   
    res.status(201).redirect("/homepage");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post("/login",async (req,res)=>{
    try {
      const {email,password} = req.body;
      
      const existinguser = await user.findOne({email:email});
      console.log(existinguser);
      if(!existinguser){
        return res.status(400).json({message:"invalid email or password"});
      }
      const isvalid = await bcrypt.compare(password,existinguser.password);
      if(!isvalid){
        return res.status(400).json({message:"invalid  password"});
      }
      const token = jwt.sign({userId:existinguser._id},"our-secret-key");
      existinguser.tokens.push(token);
      await existinguser.save();
      res.cookie('token', token, { httpOnly: true });
      res.cookie('username' , email,{httpOnly: true});
      
      res.status(201).redirect("/homepage",);
      
    } catch (error) {
      console.log(error);
    }
});


app.get("/homepage",islogin ,async (req, res) => {
  try {
  
    const userEmail = req.cookies.username;
 
    
    const userData = await user.findOne({ email: userEmail });
    console.log(userData);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }


    res.render("homepage", { userEmail, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/login",(req,res)=>{
  res.render("register");
})

app.get("/login2",(req,res)=>{
  res.render("login");
})
app.get("/teams",(req,res)=>{
    res.render("teams");
})


app.get("/dashboard", islogin,async (req, res) => {
  try {
    const userEmail = req.cookies.username;

    // Use Mongoose to find a user based on the provided email
    const userData = await user.findOne({ email: userEmail });

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // You can send the user data as a JSON response
    res.render("dashboard", { userEmail, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/updatesport',islogin ,async (req, res) => {
  try {
      const { selectedSport ,selectedexp} = req.body;
     

      // Assuming you have the user's email in the session
      const userEmail = req.cookies.username;

      // Update the user's document in the database with the selected sport
      await user.updateOne({ email: userEmail }, { sports: selectedSport ,skills: selectedexp});

      res.send('Sport updated successfully!');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});






app.get("/search",async(req,res)=>{
  try {
   const {location,sport} = req.query;
   console.log(req.query);
   const query = {};
   if(location){
     query.location=location;
   }
   if(sport){
     query.sports = sport;
   }
   console.log(query);
   const players = await user.find(query);
   res.render("players",{players});
  } catch (error) {
      console.log(error);
 }
});
app.get("/players", islogin,async (req, res) => {
  try {
    const players = await user.find();
    
    // Check if the 'format' query parameter is present
    const responseFormat = req.query.format;

    if (responseFormat && responseFormat.toLowerCase() === 'json') {
      // Respond with JSON data
      res.json({ players });
    } else {
      // Render the HTML page with the player data
      res.render("players", { players });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT,()=>{console.log(`LISTENING TO PORT: ${PORT}`);});