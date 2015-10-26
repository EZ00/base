var LocalStrategy   = require('passport-local').Strategy;
var Users = require('../models/users');


module.exports = function(passport){

	passport.use('root', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                Users.collection.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user || username === 'root') {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        //var newUser = new User();

                        // set the user's local credentials
                        Users.props.username = username;
                        Users.props.password = password;
                        Users.props.creatorId = null;
												Users.props.creatorName = 'root';
                        Users.props.isAdmin = true;
                        //Users.props.email = req.body.email;
                        //Users.props.firstName = req.body.firstName;
                        //Users.props.lastName = req.body.lastName;

                        // save the user
                        Users.insert(function(err,user) {
                            if (err){
                                console.log('Error in Saving user: '+err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, user);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    // var createHash = function(password){
    //     return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    // }

}
