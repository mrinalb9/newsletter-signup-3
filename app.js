import express from "express";
const app = express();
import request from "request";
import https from "https";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '/')))  //some imp line to load css

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/signup.html`);
})

app.post("/failure", (req,res) => {
    res.redirect("/")
})

// app.get("/failure", (req, res)=>{
//     res.redirect("/")
// })

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName, lastName, email);
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/08214ccad1"

    const options = {
        method: "POST",
        auth: "mrinal1:3ef944e60f39945b279cb837fd0f995b-us14"
        
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
            console.log(response.statusCode);
        })
    })

    request.write(jsonData)     // to pass the data to mailchimp server, post data to the external resource
    request.end()
})

app.listen( process.env.PORT || 3000,function(){
    console.log("Server running on 3000 port");
    // console.log(__dirname);
})

/* You do not serve static files as a express middleware. I found out that we need to include the path module. Enter this in your code.  Also view the image as reference. This should get your external css and image to load!

import path from "path";
app.use(express.static(path.join(__dirname, '/'))); 

*/


// API key
// 3ef944e60f39945b279cb837fd0f995b-us14

// List Id 
// 08214ccad1

// https.request(url, options, (response){ 
// })