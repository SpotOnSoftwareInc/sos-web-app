exports.get = function(req, res) {
    console.log('Get function admin');
    res.render('admin/admin', {
        title: 'sassyadmin'
    });
}
