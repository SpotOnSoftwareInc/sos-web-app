/**
 * Created by sean on 2/18/2016.
 */
exports.get = function (req, res) {
    console.log('Inside register process get method');
    if (!req.session.companyName) {
        res.render('admin/registerprocess');
    } else {
        res.render('admin/registerprocess', {
            //title: 'Express',
            //companyName: req.session.companyName
        });
    }
};
exports.post = function (req, res) {
    var fname = req.body.fname;
    var companyName = req.body.companyName;
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    console.log('Inside register process post method');

    res.end(fname + companyName + email + password + username);

};
