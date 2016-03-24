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

// app.get("/", function(req, res) {
//   res.render('login');
// });

app.use('/', router);

router.use(function(req, res, next) { //Middleware Route
  var path = req._parsedOriginalUrl.pathname;
  if(path == "/login"){
    next();
  }
  else{
    if (!req.session.user){
      res.render('login');
    }
    else{
      middleware(req, res, next, path);
    }
  }
});

function middleware(req, res, next, path){
  loggedUserDetails = JSON.parse(req.session.user);
  console.log("1", loggedUserDetails);
  var adminOps = ["/createuser", "/users", "/updateuser", "/deleteuser", "/api/user"];
  var commonOps = ["/user","/home", "/applyleave", "/leavestatus", "/leaverequests"];

  if(path == "/" && loggedUserDetails.employeeId){
    res.redirect("/home");
  } else if ((adminOps.indexOf(path) >= 0 || commonOps.indexOf(path) >= 0 ) && loggedUserDetails.isAdmin) {
    next();
  } else if (adminOps.indexOf(path) >= 0 && !loggedUserDetails.isAdmin) {
    res.redirect("/home");
  } else if (commonOps.indexOf(path) >= 0 && loggedUserDetails.employeeId) {
    next();
  } else {
    res.redirect("/home");
  }
}

app.get("/home", function(req, res, next) {
    res.render('home', {
      name: loggedUserDetails.name
    });
});


router.route('/createuser').get(function(req, res) {
  res.render("actions/createuser");
});

//-----------------------------------------------

router.route('/api/user').get(function(req, res) {
  var getUser = findByEmployeeId(req.query.employeeId);
  getUser.then(
    function(data) {
      res.json({
        sts: 1,
        msg: "Employee details fetched successfully",
        data: data
      });
    },
    function(err) {
      res.json({
        sts: 0,
        msg: err.errmsg,
        data: err
      });
    }
  );
});

router.route('/user').get(function(req, res){
   findByEmployeeId(req.query.employeeId).then(
     function(data){
        res.render("actions/user", {
          userData : data[0]
        });
     },
     function(err){
       res.render("actions/user", {
         msg : err.errmsg,
         userData : []
       });
     }
   );
});

router.route('/users').get(function(req, res) {
  var pageNo = req.query.pageNo || 1 ;
  var promiseArray = [getUsers(pageNo,10), getUsersCount()];
  Promise.all(promiseArray).then(
    function(values){
      res.render('actions/users', {
        allUsers: values[0],
        total : values[1],
        pageNo : pageNo
      });
    },
    function(err){
      res.render('actions/users', {
        msg: err.errmsg
      });
    }
  );
});

router.route('/createuser').post(function(req, res) {
  var user = new User({
    name: req.body.name,
    password: req.body.password,
    employeeId: req.body.employeeId,
    role: req.body.role,
    managerId: req.body.managerId,
    phone: req.body.phone,
    isAdmin: false // false because admin is created directly not from web.
  });
  user.save(function(err, data) {
    if (err) {
      res.render('createuser', {
        sts: 0,
        body: req.body,
        msg: err.errmsg
      });
    } else {
      res.redirect('/users');
    }
  });
});

//-----------------------------------------------

router.route('/updateuser').get(function(req, res) {
  var promiseArray = [getUsers()];
  if (req.query.employeeId) {
    promiseArray.push(findByEmployeeId(req.query.employeeId));
  }
  Promise.all(promiseArray).then(
    function(values) {
      res.render('actions/updateuser', {
        allUsers: values[0],
        userData: values[1] ? values[1][0] : {}
      });
    },
    function(err) {
      res.render('actions/updateuser', {
        msg: err.errmsg
      });
    }
  );
});

router.route('/updateuser').post(function(req, res) {
  var updateUser = User.update({
    employeeId: req.body.employeeId
  }, {
    '$set': {
      name: req.body.name,
      role: req.body.role,
      managerId: req.body.managerId,
      phone: req.body.phone
    }
  });

  updateUser.then(
    function(data){
       res.redirect("/user?employeeId="+req.body.employeeId);
    },
    function(err){
      res.render('/updateuser', {
        sts: 0,
        msg: err.errmsg
      });
    }
  );

/*  updateUser.then(
    function(data) {
      return Promise.all([getUsers(1, 10), getUsersCount()]);
    },
    function(err) {
      res.render('/updateuser', {
        sts: 0,
        msg: err.errmsg
      });
    }
  ).then(
    function(values){
      res.render('actions/users', {
        sts: 1,
        msg: req.body.name + " record successfully updated",
        allUsers: values[0],
        total : values[1]
      });
    },
    function(err) {
      res.render('actions/users', {
        sts: 0,
        msg: err.errmsg
      });
    }
  ); */


});

//-----------------------------------------------

/*
router.route('/deleteuser').get(function(req, res){
   var users = getUsers();
   users.then(
     function(data){
        res.render('actions/deleteuser', {allUsers : data});
     },
     function(err){
        res.render('actions/deleteuser', {msg : err.errmsg});
     }
   );
});
*/

router.route('/deleteuser').get(function(req, res) {
  var deleteUser = User.remove({
    employeeId: req.query.employeeId
  });

  deleteUser.then(
    function(data) {
      return Promise.all([getUsers(1, 10), getUsersCount()]);
    },
    function(err) {
      res.render('actions/users', {
        sts: 0,
        msg: err.errmsg
      });
    }
  ).then(
    function(values){
      res.render('actions/users', {
        sts: 1,
        msg: "Employee Id : "+ req.query.employeeId + " record successfully deleted",
        allUsers: values[0],
        total : values[1]
      });
    },
    function(err) {
      res.render('actions/users', {
        sts: 0,
        msg: err.errmsg
      });
    }
  );


});

router.route('/leave').post(function(req, res) {

  var leave = new Leave({
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    employeeId: req.body.employeeId,
    reason: req.body.reason,
    managerId: req.body.managerId
  });
  leave.save(function(err, data) {
    if (err)
      return console.error(err);
    res.json({
      sts: 1,
      msg: "Successfully Saved"
    });
  });
});

router.route('/login').post(function(req, res) {
  findByEmployeeId(req.body.employeeId).then(
    function(data) {
      if (data.length && data[0].password == req.body.password) {
        session = req.session;
        session.user = JSON.stringify({
          name: data[0].name,
          employeeId: data[0].employeeId,
          managerId: data[0].managerId,
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

router.route('/logout').get(function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(8181);

function getLeaveRequests() {
  return Promise.resolve(true);
}

function getLeavesApplied() {
  return Promise.resolve(true);
}

function getUsers(pageNo, perPage) {
  if(pageNo && perPage)
    return User.find().skip(pageNo > 0 ? ((pageNo-1)*perPage) : 0).limit(perPage).exec();
  else
    return User.find().exec();
}

function getUsersCount(){
  return User.count().exec();
}

function findByEmployeeId(id) {
  return User.find({
    employeeId: id
  }).exec();
}

/*
app.get("/user", function(req, res) {
  loggedUserDetails = JSON.parse(req.session.user);
  if (loggedUserDetails.employeeId) {
    var promiseArray = [getLeaveRequests(loggedUserDetails.employeeId), getLeavesApplied(loggedUserDetails.employeeId)];
    if (loggedUserDetails.isAdmin) {
      promiseArray.push(getUsers(1, 10));
    }
    Promise.all(promiseArray).then(
      function(values) {
        res.render('user.ejs', {
          allUsers: values[2],
          userData: loggedUserDetails
        });
      },
      function(err) {
        console.log(err);
      }
    );
  } else {
    console.log("no session");
  }
});
*/
