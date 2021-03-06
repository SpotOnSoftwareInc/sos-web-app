// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;

//need this since we are passing in a passport dependency in app.js line 58
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


    passport.use('local-signup', new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
                var db = req.db;
                var companyName = req.body.companyName;
                var fname = req.body.fname;
            var lname = req.body.lname;
            //var phone = req.body.phone;

            // Check if any field has been left blank
            console.log('check if fields filled');
            if (fname === '' || companyName === '' || email === '' || password === '' || lname === '') {
                console.log('Is this working????');
                req.flash('Missing Parameters', 'Please fill in all fields');
            } else {
                console.log('grab data from database');
                var businesses = db.get('businesses');
                var employees = db.get('employees');
                //TODO: Get visitors too
                //var visitors = db.get('visitors');
                //var staff = db.get('staff');
                //var

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                businesses.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error

                    if (err) {
                        console.log('error in call');
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        console.log('user exists');
                        console.log(user);
                        return done(null, false);
                    } else {

                        // if there is no user with that email
                        // create the user
                        console.log('creating user');
                        // set the user's local credentials
                        password = auth.hashPassword(password);
                        console.log('business user is');
                        console.log(user);
                        // save the user
                        businesses.insert({
                            email: email,
                            password: password,
                            companyName: companyName,
                            phone: '',
                            fname: fname,
                            //username: username,
                            lname: lname,
                            logo: '',
                            walkins: false
                        }, function (err, result) {
                            if (err) {
                                throw err;
                            }

                            var businessID = result._id.toString();

                            employees.insert({
                                business: ObjectId(businessID),
                                password: result.password,
                                phone: result.phone,
                                fname: result.fname,
                                lname: result.lname,
                                email: result.email,
                                smsNotify: true,
                                emailNotify: true,
                                //values of role saasAdmin, busAdmin, provider, staff, visitor
                                role: 'busAdmin'
                            },function(err, user){
                                if (err) {
                                    throw err;
                                }
                                console.log('employee user is');
                                console.log(user);
                                return done(null, user);
                            });
                        });
                    }
                });
            }

        }
    ));



    passport.use('local-signup-employee',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req,email,password,done) {



            var db =req.db;
            var employee = db.get('employees');

            password = auth.hashPassword(password);

            employee.findAndModify({
             query: {registrationToken: req.query.token},
             update: { $unset: {registrationToken: 1},
                $set: {password: password} },
             new: true},
                function (err,user){
                if (err) {
                     throw err; }
                return done(null,user);

                 }
            );
        }
    ));



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    //CALL THIS FUNCTION AT THE END OF REGISTER PROCESS
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            console.log('LOCAL-LOGIN');

            auth.validateLogin(req.db, email, password, function (user) {
                if (!user) {
                    return done(null, false, req.flash("login", "Invalid Email/Password Combo"));
                }
                else {
                    console.log('LOCAL-LOGIN SUCCESS');
                    return done(null,user);
                    }
            });
        }
    ));


};
