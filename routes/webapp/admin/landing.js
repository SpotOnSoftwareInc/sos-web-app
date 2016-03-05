exports.get = function (req, res, next) {
    console.log('Get function LANDING');
	req.session.companyName = null;
    req.session.fname = null;
    req.session.email = null;

	req.session.save(function (err) {

            if (err) {

                return next(err);
            }
        });

    res.render('admin/landing', {title: 'Landing Page'});
};

exports.post = function (req, res, next) {
    console.log('POST function LANDING');
    var companyName = req.body.companyName;
    var fname = req.body.fname;
    var email = req.body.email;

    if (companyName === '' || fname === '' || email === '') {

        res.redirect('/register');
    } else {

        req.session.companyName = companyName;
        req.session.companyName = fname;
        req.session.companyName = email;

        req.session.save(function (err) {

            if (err) {

                return next(err);
            }

            res.redirect('/register');
        });
    }
};
