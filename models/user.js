var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    name: { type : String, required : true },
    password: { type : String, required : true },
    employeeEmail: { type : String , unique : true, required : true, dropDups: true },
    role: String,
    managerEmail:{ type : String },
    phone : String,
    isAdmin: { type : Boolean, default : false }
});

module.exports = mongoose.model('user', UserSchema);
