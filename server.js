var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var User = require("./models/user");
var express_session = require('express-session');
var router = express.Router();
var mongoose = require('mongoose');
var session;

mongoose.connect('mongodb://localhost/leavemanagement');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //serving static files from public folder
app.use(express_session({
  secret: 'invisiblesession',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render('login.ejs');
});

app.get("/user", function(req, res){
  session = req.session;
  if(session.employeeId){
    User.find({ employeeId : session.employeeId}, function(err, data){
      if(err){
          res.send(err);
      }
      else if(data.length){
         res.render('user.ejs', {
           name : data[0].name,
           employeeId : data[0].employeeId,
           isAdmin : data[0].employeeId
         });
      }
    });
  }

});

app.use('/api', router);

router.use(function(req, res, next) { //Middleware Route
   //do validations
    next(); //will goto next routes. will not stop here.
});

router.get('/', function(req, res) {
    res.json({ message: 'Leave Management API!' });
});

router.route('/user').post(function(req, res){

   var user = new User({
     name : req.body.name,
     password : req.body.password,
     employeeId : req.body.employeeId,
     role : req.body.role,
     managerId : req.body.managerId,
     isAdmin : false // false because admin is created directly not from web.
   });
   user.save(function (err, data) {
      if (err)
         return console.error(err);
      res.json({sts : 1, msg : "Successfully Saved"});
   });


});

router.route('/login').post(function(req, res){
   User.find({ employeeId : req.body.employeeId}, function(err, data){
     if(err){
         res.send(err);
     }
     else if(data.length && data[0].password == req.body.password){
         session = req.session;
         session.employeeId = req.body.employeeId;
         res.json({sts: 1, msg : "login success"});
        //  res.render("user.ejs", {
        //    name : data[0].name,
        //    employeeId : data[0].employeeId
        //  })

     }
   });
});

router.route('/logout').get(function(req, res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(8181);
