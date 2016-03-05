
exports.get = function(req, res) {
    console.log('Get function login');
	//req.logout();
    res.render('business/dashboard',{
        message: req.flash("login")
    });
};


