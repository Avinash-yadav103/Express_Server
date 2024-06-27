const express = require('express');
const mongoose = require('mongoose');
const users = require('./MOCK_DATA.json')
const fs = require('fs')

const app = express();
const PORT = 8000;

const userSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        // required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },

});

//Middleware - Plugin
// This plugin is used to parse the body of the request by creating json object
app.use(express.urlencoded({extended: false}))

//Creating own middleware
app.use((req,res,next)=>{
    console.log("Middleware is working");
    // return res.json({ msg: "Hello from middleware"});
    next();
})

app.use((req,res,next) =>{
    fs.appendFile('log.txt',` ${Date.now()} Request Method: ${req.method} Request URL: ${req.url} \n`,(err)=>{
        if(err){
            console.log(err);
        }
        next();
    })
})

//Custom headers
app.get('/api/users', (req, res) => {
    res.setHeader('X-Custom-Header', 'Hello');
    //Always add X to custom headers (Just a good practice )
    return res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//Routes
app.get('/users', (req, res) => {
    const html = `
        <ul>
            ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
        </ul>`;
    res.send(html);
});

//Dynamic Routes (Variable URL)
app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})

app.get('/api/users', (req, res) => {
    return res.json(users);
});


//Post
app.post("/api/users", (req, res) => {
    const body = req.body;
    if(!body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({ status: "error", message: "Please provide all the details" });
    }
    users.push({...body,id: users.length+1});
    console.log(body);
    // return res.json({ status: "pending" });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users),(err,data)=>{
        return res.status(201).json({ status: "success", id: users.length });
    })
    
});

//Patch me edit krna mtlb Id to chaiye hi isme
app.patch('/api/users/:id', (req, res) => {
    return res.json({ status: "pending" });
});

//Same as patch for delete
app.patch('/api/users/:id', (req, res) => {
    return res.json({ status: "pending" });
});

// //Summarizing the routes
// app.route('/api/users:id').get((req, res) => { //If there is a get request
//     return res.json({ status: pending });
// }).post((req, res) => {                        //If there is a post request 
//     return res.json({ status: pending });
// }).patch((req, res) => {                       //If there is a patch request
//     return res.json({ status: pending });
// }).delete((req, res) => {                      //If there is a delete request                                               
//     return res.json({ status: pending });
// });