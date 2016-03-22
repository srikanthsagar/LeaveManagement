var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var User = require("./models/user");
var Leave = require("./models/leave");
var express_session = require('express-session');
var router = express.Router();
var mongoose = require('mongoose');
var session, loggedUserDetails = {};


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
  loggedUserDetails = JSON.parse(req.session.user);
  if(loggedUserDetails.employeeId){
    var promiseArray = [getLeaveRequests(loggedUserDetails.employeeId), getLeavesApplied(loggedUserDetails.employeeId)];
    if(loggedUserDetails.isAdmin){
       promiseArray.push(getAllUsers(loggedUserDetails.employeeId));
    }
    Promise.all(promiseArray).then(
      function(values) {
        res.render('user.ejs', {
          allUsers : values[2],
          userData : loggedUserDetails
        });
    },
    function(err){
      console.log(err);
    }
  );
  }
  else{
    console.log("no session");
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

router.route('/user').put(function(req, res){
    console.log("test");
    User.update({employeeId : req.body.employeeId}, {
      '$set' :{
        name : req.body.name,
        role : req.body.role,
        managerId : req.body.managerId,
      }
    },
    function(err, data){
      if (err)
         return console.error(err);
      res.json({sts : 1, msg : "Successfully Updated"});
    }
  );
});


router.route('/user').delete(function(req, res){
   User.remove({employeeId : req.body.employeeId},
   function(err, data){
     if (err)
        return console.error(err);
     res.json({sts : 1, msg : "Successfully Deleted"});
   });
});

router.route('/leave').post(function(req, res){

   var leave = new Leave({
     fromDate : req.body.fromDate,
     toDate : req.body.toDate,
     employeeId : req.body.employeeId,
     reason : req.body.reason,
     managerId : req.body.managerId
   });
   leave.save(function (err, data) {
      if (err)
         return console.error(err);
      res.json({sts : 1, msg : "Successfully Saved"});
   });
});

router.route('/login').post(function(req, res){
   findByEmployeeId(req.body.employeeId).then(
     function(data){
       if(data.length && data[0].password == req.body.password){
           session = req.session;
           session.user = JSON.stringify({
             name : data[0].name,
             employeeId : data[0].employeeId,
             managerId :data[0].managerId,
             isAdmin : data[0].isAdmin
           });
           res.json({sts: 1, msg : "login success"});
       }
       else {
         res.json({sts: 0, msg : "No records found"});
       }
     },
     function(err){
       res.send(err);
     }
   );
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

function getLeaveRequests(){
   return Promise.resolve(true);
}

function getLeavesApplied(){
  return Promise.resolve(true);
}

function getAllUsers(id){
  return User.find( { employeeId : { $ne: id } }).exec();
}

function findByEmployeeId(id){
  return User.find( { employeeId : id} ).exec();
}
