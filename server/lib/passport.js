// lib/passport.js

// load all the things we need
var AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2')

// load up the user model
var User = require('../models/user');

var jwt = require('jsonwebtoken');

// load the auth variables
var config = require('../../config/config.env.js');
var configAuth = new config();
var configRole = require('../../config/role');

var userRole;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // Azure AD ==================================================================
    // =========================================================================
    try{
        passport.use(new AzureAdOAuth2Strategy({

            clientID        : configAuth.azureADAuth.clientID,
            clientSecret    : configAuth.azureADAuth.clientSecret,
            callbackURL     : configAuth.azureADAuth.callbackURL,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, refreshToken, params, profile, done) {

            // asynchronous
            process.nextTick(function() {
                // check if the user is already logged in
                // user is NOT logged in
                profile = jwt.decode(params.id_token);

                if (!req.user) {
                    User.findOne({ 'azure_ad.id' : profile.oid }, function(err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            console.log('Found user')
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.azure_ad.token) {
                                user.azure_ad.token = token;
                                user.azure_ad.name  = initCaps(profile.name);
                                user.azure_ad.email = (profile.upn || '').toLowerCase(); // pull the first email

                                user.save(function(err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            console.log('Found no user')
                            var newUser          = new User();

                            newUser.azure_ad.id    = profile.oid;
                            newUser.azure_ad.token = token;
                            newUser.azure_ad.name  = initCaps(profile.name);
                            newUser.azure_ad.email = (profile.upn || '').toLowerCase(); // pull the first email

                            newUser.save(function(err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    console.log('User already exists')
                    // user already exists and is logged in, we have to link accounts
                    var user               = req.user; // pull the user out of the session

                    user.azure_ad.id    = profile.oid;
                    user.azure_ad.token = token;
                    user.azure_ad.name  = initCaps(profile.name);
                    user.azure_ad.email = (profile.upn || '').toLowerCase(); // pull the first email

                    user.save(function(err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }
            });
        }));
    } catch(e){
        console.log("Error creating AzureADStrategy " + e);
    }

};

//capitalise first letter of each word
function initCaps(str){
    words = str.toLowerCase().split(' ');

     for(var i = 0; i < words.length; i++) {
          var letters = words[i].split('');
          letters[0] = letters[0].toUpperCase();
          words[i] = letters.join('');
     }
     return words.join(' ');
}
