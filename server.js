var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var User = require("./models/user");
var Leave = require("./models/leave");
var express_session = require('express-session');
var baseRouter = express.Router();
var usersRouter = express.Router();
var leavesRouter = express.Router();
var mongoose = require('mongoose');
var session, loggedUserDetails = {};
var authenticationUtils = require('./auth_utils');
var usersModule = require('./users_module');
var leavesModule = require('./leaves_module');
var usersRoutes = require('./users_routes');
var leavesRoutes = require('./leaves_routes');

mongoose.connect('mongodb://localhost/leavemanagement');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //serving static files from public folder
app.use(express_session({
  secret: 'invisiblesession',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

app.set("view engine", "ejs");

app.get('/', authenticationUtils.ensureLoggedInUser, authenticationUtils.redirectHomeIfLoggedIn);

app.get('/login', function(req, res, next){
  if (!req.session.user)
     res.render('login');
  else
     res.redirect("/home");
});

app.post('/login', function(req, res) {
  var findByemployeeEmail = User.find({
    employeeEmail: req.body.employeeEmail
  }).exec();

  findByemployeeEmail.then(
    function(data) {
      if (data.length && data[0].password == req.body.password) {
        session = req.session;
        session.user = JSON.stringify({
          name: data[0].name,
          employeeEmail: data[0].employeeEmail,
          managerEmail: data[0].managerEmail,
          isAdmin: data[0].isAdmin
        });
        res.redirect('/home');
      } else {
        res.render('login', {
          sts: 0,
          msg: "Username or password invalid"
        });
      }
    },
    function(err) {
      res.render('login', {
        sts: 0,
        msg: "Username or password invalid"
      });
    }
  );
});

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      res.json({msg : err.errmsg, data : err});
    } else {
      res.redirect('/');
    }
  });
});

app.get("/home", authenticationUtils.ensureLoggedInUser, function(req, res, next) {
    res.render('home', {
      name: loggedUserDetails.name
    });
});

app.use('/', authenticationUtils.ensureLoggedInUser, baseRouter);
app.use('/users/', authenticationUtils.ensureLoggedInUser, usersRouter);
app.use('/leaves/', leavesRouter);

usersRoutes.defineRoutes(usersRouter, usersModule);
leavesRoutes.defineRoutes(leavesRouter, leavesModule);

app.get("/*", authenticationUtils.redirectHomeIfLoggedIn);

app.listen(8181);
        
        