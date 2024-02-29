require('dotenv').config();
const express = require('express');
const app = express();
const {logger} = require("./middleware/logEvents");
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3500;
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require("./config/corsOptions");
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');

connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use('/subdir',require('./routes/rootRouter'));
app.use('/auth',require('./routes/authRouter'));
app.use('/register',require('./routes/registerRouter'));
app.use('/refresh', require('./routes/refreshRouter'));
app.use('/logout', require('./routes/logoutRouter'));
app.use(verifyJWT);
app.use('/users',require('./routes/api/users'));
app.use('/student',require('./routes/api/students'));


app.all('*', (req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }
    else if(res.accepts("json")){
        res.json({message:'404, Not Found'})
    }
    else{
        res.type('txt').send('404, Not Found');
    }
});

app.use(errorHandler);

mongoose.connection.once('open', ()=>{
    console.log('Connected to Database');
    app.listen(port, ()=>{
        console.log(`Server running at ${port}`);
    });
})


// Routes with regex

// app.get('*/$|/index(.html)?', (req,res,next)=>{
//     res.sendFile(path.join(__dirname,'views','index.html'));
//     next();
// }, (req,res)=>{
//     console.log("Index file rendered.");
// });

// app.get('/about(.html)?', (req,res)=>{
//     res.sendFile(path.join(__dirname,'views','about.html'));
// });

// app.get('/About(.html)?',(req,res)=>{
//     res.redirect(301,'/about.html');
// });