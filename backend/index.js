require("dotenv").config();  
const cors = require('cors');
const express = require('express');
const postRouter = require('./crude operation/router-post');
const path = require('path');
const APP = express(); 
 
const port = 2000
APP.use(cors())
// APP.use(express.static); // keeping files in the public folder for local
APP.use(express.json()); // to handle the json() caming data
APP.use(express.urlencoded({extended: true})); 
APP.use(express.static(path.join(__dirname, "../frontend"))); // keeping files in the public folder and the html file must be named as "index.html" for local and cloud base management
APP.use('/',postRouter); // enable the router to run

APP.listen(process.env.PORT || port,()=>{
    console.log(`Server is running on port ${port}`)        
})          

