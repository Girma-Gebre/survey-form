// diplaying the result message and sinner element
const dataCheck = document.getElementById("dataCheck");
const spinner = document.getElementById("spinner");
const dataCheckName = document.getElementById("dataCheckName")
const dataCheckEmail = document.getElementById("dataCheckEmail")
// Contact form handler (demo)
document.getElementById("survey-form").addEventListener("submit", async function(e){
  e.preventDefault(); //event handler to stop the browser’s default action for that event.
  dataCheck.style.display = "none" // changing one style 
  dataCheckName.style.display = "none" // changing one style 
  dataCheckEmail.style.display = "none" // changing one style 
  spinner.style.display = "block" // show spinner

  // getting the value of input element from client side 
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const employ = document.getElementById("employ").value;

  // radio input value
  const likeWeb =
    document.querySelector('input[name="likeWeb"]:checked')?.value;

// check input value
  const tools =
    [...document.querySelectorAll('input[name="tools"]:checked')]
    .map(el => el.value);

  const comment = document.getElementById("comment").value; 

  try {
    // checking the client is fill the required data of "likweb" and "tools" or not  
     // checking the radio input is selected or not from the client side 
     const errMsgWeb = document.getElementById("errMsgWeb");
    if(!likeWeb){
      errMsgWeb.textContent = "Please select your preferred web development option";
      Object.assign(errMsgWeb.style, {
          display: "block",
          backgroundColor: "rgb(207, 152, 152)",
          margin: "-12px 0 12px 0",
          padding:"4px 0 4px 12px",
          color: "rgb(255, 0, 0)",
          fontFamily:"sans-serif",
          fontSize: "16px",
          borderRadius: "4px"
       });
       errMsgWeb.focus(); // to focus the error message element for better user exprience 
    return;
  }
  errMsgWeb.style.display = "none";
// checking the checkbox inputs are selected or not from the client side 
  const errMsgTools = document.getElementById("toolsNotselected");
  if(tools.length === 0){
      errMsgTools.textContent = "Please select your preferred tools at least one option";
      Object.assign(errMsgTools.style, {
          display: "block",          
          backgroundColor: "rgb(207, 152, 152)",
          margin: "12px 0 0 0",
          padding:"4px 0 4px 12px",
          color: "rgb(255, 0, 0)",
          fontFamily:"sans-serif",
          fontSize: "16px",
          borderRadius: "4px"
       });
       errMsgTools.focus(); // to focus the error message element for better user exprience 
    return;
  }
  // to remove the error message if the client select at least one tools
  errMsgTools.style.display = "none";
    // collecting data from html input element
    const sendData = { name, email, age, employ, likeWeb, tools, comment }; // using ES6 shorthand object syntax.
    // const url = "http://localhost:2000/surveyForm"; // this url is for local database managment 
    const url = "https://survey-form-backend-web.onrender.com/surveyform"; 
    //this url is for cloud database managment in mongodb atlas and render server. note: the  url must be in lowercase letter 
    const endpointObject = {
      method: "POST", 
      headers: {"Content-Type": "application/json"}, 
      body: JSON.stringify(sendData) // making the data sitring 
    };

    const res = await fetch(url, endpointObject); 
    const data = await res.json(); //chaning data into Json format
    const userName = sendData.name.trim().split(/\s+/); // changing the string into array by separating with space

   const submitted = "Data is submitted successfully"
    if(data.Msg === submitted){
      this.reset();
      if(userName[1]){
       alert(`Thanks "${userName[0]} ${userName[1]}" for your interest! I’ll contact you soon.`)
      }else{
        alert(`Thanks "${userName[0]}" for your interest! I’ll contact you soon.`)
      }
       
       // changing more than one style at once in Js
       Object.assign(dataCheck.style, {
        backgroundColor: "rgb(112, 219, 117)",
         marginTop: "12px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(21, 90, 3)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block"
       });
       dataCheck.textContent = data.Msg;
        
    } else {
      const nameEmailDublicate = "Your name and email are already exist!"
      const nameDublicate = "Your name is already exists!"
      const emailDublicate = "Your email is already exists!"
      if (nameEmailDublicate === data.Msg) {
        // when both the name and email is already exsit on the database in the mongoDB atlas
        Object.assign(dataCheckName.style, {
        backgroundColor: "rgb(230, 171, 171)",
         marginTop: "-12px",
         marginBottom: "12px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block",
         width: "96%"
       });
       dataCheckName.textContent = "Your name is already exists!"
       dataCheckName.focus()

       Object.assign(dataCheckEmail.style, {
        backgroundColor: "rgb(230, 171, 171)",
         marginTop: "-12px",
         marginBottom: "2px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block",
         width: "96%"
       });
       dataCheckEmail.textContent = "Your email is already exists!"
       dataCheckEmail.focus();
      } else if(nameDublicate === data.Msg){
        // when the name only is already exist on the database in the mongoDB atlas
         Object.assign(dataCheckName.style, {
         backgroundColor: "rgb(230, 171, 171)",
         marginTop: "-6px",
         marginBottom: "12px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block",
         width: "96%"
       });
       dataCheckName.textContent = data.Msg;
       dataCheckName.focus()
      } else if (emailDublicate === data.Msg){
        // when the email only is already exist on the database in the mongoDB atlas
        Object.assign(dataCheckEmail.style, {
         backgroundColor: "rgb(230, 171, 171)",
         marginTop: "-12px",
         marginBottom: "2px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block",
         width: "96%"
       });
       dataCheckEmail.textContent = data.Msg;
       dataCheckEmail.focus();

      } else {
     Object.assign(dataCheck.style, {
        backgroundColor: "rgb(230, 171, 171)",
         marginTop: "12px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block"
       });
      dataCheck.textContent = data.Msg; 
      }
      
    }

  }catch(err){
    console.error(err);
    dataCheck.textContent = data.Msg;  
     Object.assign(dataCheck.style, {
         backgroundColor: "rgb(235, 61, 61)",
         marginTop: "12px",
         padding: "4px 0 4px 12px",
         textAlign: "center",
         color: "rgb(255, 0, 0)",
         fontFamily:"sans-serif",
         fontWeight: "bold",
         fontSize: "16px",
         borderRadius: "4px",
         display: "block"
       });
  }finally{
   spinner.style.display = "none" // hidden spinner
  }

});
