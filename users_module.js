var User = require("./models/user");

exports.newUserView = function(req, res) {
  var users = User.distinct("employeeEmail");
  users.then(
    function(data){
      res.render("user/new", {
        allUsers : data
      });
    },
    function(err){
       res.render("error", {
         msg : err.errmsg,
         data : err
       });
    }
  );
};

exports.getUserData = function(req, res) {
  var getUser = findByemployeeEmail(req.query.employeeEmail);
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
};

exports.newUserSave = function(req, res) {
  var user = new User({
    name: req.body.name,
    password: req.body.password,
    employeeEmail: req.body.employeeEmail,
    role: req.body.role,
    managerEmail: req.body.managerEmail,
    phone: req.body.phone,
    isAdmin: false // false because admin is created directly not from web.
  });
  user.save(function(err, data) {
    if (err) {
      res.render("error", {
         msg : err.errmsg,
         data : err
       });
    } else {
      res.redirect('/users');
    }
  });
};

exports.updateUserView = function(req, res) {
  var promiseArray = [getUsers(), findByEmployeeId(req.params.user_id)];
  Promise.all(promiseArray).then(
    function(values) {
      res.render('user/update', {
        allUsers: values[0],
        userData: values[1] ? values[1][0] : {}
      });
    },
    function(err) {
      res.render("error", {
         msg : err.errmsg,
         data : err
      });
    }
  );
};

exports.updateUserSave = function(req, res) {
  var updateUser = User.update({
    _id: req.body._id
  }, {
    '$set': {
      name: req.body.name,
      role: req.body.role,
      managerEmail: req.body.managerEmail,
      phone: req.body.phone
    }
  });

  updateUser.then(
    function(data){
       res.redirect("/users/"+req.body._id);
    },
    function(err){
      res.render("error", {
         msg : err.errmsg,
         data : err
      });
    }
  );
};

exports.deleteUser = function(req, res) {
  var deleteUser = User.remove({
    _id: req.params.user_id
  });
  var promiseArray = [deleteUser, findByEmployeeId(req.params.user_id)] ;
    
  Promise.all(promiseArray).then(
    function(values){
      res.redirect('/users?optn=deleted&sts=1&usr='+values[1][0]["name"]);
    },
    function(err) {
      res.render("error", {
         msg : err.errmsg,
         data : err
      });
    }
  );
};

exports.getUserView = function(req, res){
   findByEmployeeId(req.params.user_id).then(
     function(data){
        res.render("user/user", {
          userData : data[0]
        });
     },
     function(err){
       res.render("error", {
         msg : err.errmsg,
         data : err
       });
     }
   );
};

exports.getAllUsers = function(req, res) {
  var pageNo = req.query.pageNo || 1 ;
  var promiseArray = [getUsers(pageNo,10, req.query.sort, req.query.field), getUsersCount()];
  Promise.all(promiseArray).then(
    function(values){
      res.render('user/users', {
        allUsers: values[0],
        total : values[1],
        pageNo : pageNo,
        sort : req.query.sort,
        field : req.query.field,
        msg : req.query.optn ? (req.query.usr + " " + req.query.optn + " successfully") : ""     
      });
    },
    function(err){
      res.render("error", {
         msg : err.errmsg,
         data : err
      });
    }
  );
};

function getUsers(pageNo, perPage, sort, field) {
    var sortCriterea = {};
    if(field == "managerName")
       sortCriterea["managerDetails.name"] = sort ? parseInt(sort) : undefined;
    else
       sortCriterea[field] = sort ? parseInt(sort) : undefined;
    if (pageNo && perPage){
        return User.aggregate([
            {
                $lookup: { from: 'users', localField: 'managerEmail', foreignField: 'employeeEmail', as: 'managerDetails' }
            }
        ]).sort(sortCriterea).skip(pageNo > 0 ? ((pageNo - 1) * perPage) : 0).limit(perPage).exec();
    }
    else{
        return User.aggregate([
            {
                $lookup: { from: 'users', localField: 'managerEmail', foreignField: 'employeeEmail', as: 'managerDetails' }
            }
        ]).sort(sortCriterea).exec();
    }
         
   
//   if(pageNo && perPage)
//     return User.find().skip(pageNo > 0 ? ((pageNo-1)*perPage) : 0).limit(perPage).exec();
//   else
//     return User.find().exec();
}

function getUsersCount(){
  return User.count().exec();
}

function findByemployeeEmail(id) {
  return User.find({
    employeeEmail: id
  }).exec();
}

function findByEmployeeId(id) {
  return User.find({
    _id: id
  }).exec();
}
