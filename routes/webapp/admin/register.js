
exports.get = function (req, res) {
    console.log('Get function REGISTER');
	if (!req.session.companyName) {
        console.log('Get function company name not found');
        res.render('admin/register');
    } else {
        console.log('Get function company found');
        res.render('admin/register', {
            title: 'Express',
            companyName: req.session.companyName
        });
    }
};
