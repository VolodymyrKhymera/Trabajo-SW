'use strict';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(
    'wfp.sqlite',
    function(err) {
        if (err)
            console.log(err);
    });

var express = require('express');
var app = express();

var session = require('express-session');
var sesscfg = {
    secret: '86af5280-ba7c-11eb-9b2c-bd5f7b098ef0',
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: true,
        maxAge: 8*60*60*1000 // 8 working hours
    }
};
app.use(session(sesscfg));

const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();
router.post('/handle',(request,response) => {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    console.log(request.body);
});

// add router in the Express app.
app.use("/", router);

var login = require('./login');
//var users = require('./users');
//var tasks = require('./tasks');
//var workflows = require('./workflows');
//var runs = require('./runs');
var todo = require('./todo');

login.init(router, db);
//users.init(router, db);
//tasks.init(router, db);
//workflows.init(router, db);
//runs.init(router, db);
todo.init(router, db);

const port = 8888;

app.use(express.static('.'));

app.listen(port, () => {
    console.log('Servidor atendiendo en http://localhost:' + port);
});
