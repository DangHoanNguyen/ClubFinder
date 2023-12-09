import express from "express";
import initPublicWebRoutes from "./route/index.js";
import initUserWebRoutes from "./route/user.js"
import configViewEngine from "./config/viewEngine.js";
import bodyParser from "body-parser";
require("dotenv").config();
const mysql = require("mysql2");
const cookieParser = require('cookie-parser');

var session = require("express-session");

let app = express();

const connection = mysql.createPool({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12668851',
    password: 'CNxG34HwHL',
    database: 'sql12668851',
    port: 3306
});

app.use(function(req, res, next) {
    req.pool = connection;
    next(); 
});

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'loveurlife',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

configViewEngine(app);
initPublicWebRoutes(app);
initUserWebRoutes(app);


let port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log("Running on port: " + port);
});