var login = require('./login');
var signup = require('./signup');
var root = require('./root');
var Users = require('../models/users');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
      // console.log('serializing user: ');console.log(user);
	    // console.log('serializing id: ',user._id);
      done(null, {_id:user._id,username:user.username});
    });

    passport.deserializeUser(function(id, done) {
		// console.log('deserializing id:',id);
        Users.findOneById(id._id, function(err, user) {
            // console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    root(passport);

}
