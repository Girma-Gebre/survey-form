require('dotenv').config(); // to config the .env file 
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Autoincrement = require("mongoose-sequence")(mongoose); // import the autoincrement as-built module
// connect the serer (node Js) with mongoDB atlas
mongoose.connect(process.env.MONGO_URL, {family: 4}) // Forces Mongoose to use IPv4 instead of IPv6
.then(()=>console.log("Conneted to MongoDB Atlas"))
.catch(err=>console.error('Connection failed', err))   

// create shema 
const surveySchema = new mongoose.Schema({ 
    name: {type: String, required: true},
    email: {type: String, required: true},
    age: {type: String, required: true},
    employ: {type: String, required: true},
    likeWeb: {type: String, required: true},
    tools: {type: [String], required: true, default: []},
    comment: {type: String, required: true}   
}); 


// ---- "surveyFormID" will display on the counters collection in monogoDB atlas to indicate the highest number of data is recieved from client in this collection in mongoDB atlas and it will be auto incremented for each document (tabe in MySQL)
surveySchema.plugin(Autoincrement, {inc_field: "surveyFormID"}); 

const survey = mongoose.model("surveyData", surveySchema); 
// This is making "surveyData" collection in the mongoDB database and the name of the collection is the same as the model name but in lowercase and plural form by defualt.
async function resetCounterIfEmpty() {
const count = await survey.countDocuments(); // this shows the value of seq in counters collection it indicates the heighest "surveyFormID" or the number of documents in the "surveyFormID" collection in mongoDB database
  if (count === 0) {
    // Reset the counter for "surveyFormID"
    await mongoose.connection.collection("surveyDataResetSeq").updateOne( // surveyDataResetSeq is the name of the database collection in mongoDb atlas use to reset the value of "surveyData" for each document in the "surveyData" database collection in mongoDb atlas if we remove the document with the "id: surveyFormID" from "counters" database, it (counters) is created automathically when the client insert at first time.
      { _id: `${survey.collection.name}_UserID` }, // to indicate the name of the collection and its field name. 
      { $set: { seq: 0 } },
      { upsert: true } // insert if it is not exist update if it is exist
    );
  }
} 

router.post("/surveyform", async (req,res)=>{
    try{
    const nameNoExtraSpace = req.body.name.trim().replace(/\s+/g, " "); //avoiding extra space from name from client/frontend  
    const {email, age, employ, likeWeb, tools, comment} = req.body;
    // find the email or name
    const existingData = await survey.findOne({
         $or: [
               {name: {$regex: `^${nameNoExtraSpace}$`, $options: "i" }},
                {email: email} 
             ]
             });

    if (existingData) {
      const sameName = existingData.name.toLowerCase() === nameNoExtraSpace.toLowerCase();
      const sameEmail = existingData.email === email

     if (sameName && sameEmail) {
      return res.json({ Msg: "Your name and email are already exist!" });
      } else if (sameName) {
      return res.json({ Msg: "Your name is already exists!" });
       } else if (sameEmail) {
      return res.json({ Msg: "Your email is already exists!" });
      }
     } 
        
        await resetCounterIfEmpty() //calling the function to reset the "UserId"
      // create an instance object template from class and insert data from client e.g: req.body
        const newEmployer = new survey({name: nameNoExtraSpace, email, age, employ, likeWeb, tools, comment}); // creating object from class 
       await newEmployer.save(); // enable the data to save by mongoose and send to mongoDB as BJSON data type.
        res.status(200).json({ Msg: "Data is submitted successfully" }); // ✅send JSON this is manadatory to work the front end correctly nice!
          
    }catch(err){
      console.log(err);
        res.status(500).json({Msg: "internal server error or problem on database connection"});
    }
});


module.exports = router;