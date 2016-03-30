exports.ensureLoggedInUser = function(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    }
    else {
        next();
    }
}

exports.redirectHomeIfLoggedIn = function(req, res) {
    if (req.session.user)
        res.redirect("/home");
};
