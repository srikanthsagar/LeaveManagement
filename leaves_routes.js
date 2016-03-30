exports.defineRoutes = function(leavesRouter, leavesModule) {
    leavesRouter.route('/applyleave').get(function(req, res) {

    });

    leavesRouter.route('/applyleave').post(function(req, res) {

        var leave = new Leave({
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            employeeEmail: req.body.employeeEmail,
            reason: req.body.reason,
            managerEmail: req.body.managerEmail
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



    function getLeaveRequests() {
        return Promise.resolve(true);
    }

    function getLeavesApplied() {
        return Promise.resolve(true);
    }

}