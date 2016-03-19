var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    password: String,
    employeeId: { type : Number , unique : true, required : true, dropDups: true },
    role: String,
    managerId: String,
    isAdmin: { type : Boolean, default : false }
});

module.exports = mongoose.model('user', UserSchema);
