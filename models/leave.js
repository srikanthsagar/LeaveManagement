var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LeaveSchema = new Schema({
    fromDate : { type : String, required : true },
    toDate : { type : String, required : true },
    employeeId: { type : Number ,required : true },
    managerId: { type : Number },
    type : { type : String, required : true },
    reason : { type : String, required : true },
    status: { type : Boolean, default : false }
});

module.exports = mongoose.model('leave', LeaveSchema);
