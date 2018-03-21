// config/auth.js
// when committing change callbackURL      : 'https://quantum.audacy.space/auth/google/callback'
// when working locally change callbackURL  : 'https://localhost/auth/google/callback'

// expose our config directly to our application using module.exports
module.exports = {

    'googleAuth' : {
        'clientID'         : '615485532605-22v29drsct2cf76dnhd5hbhnl8h0i0gp.apps.googleusercontent.com',
        'clientSecret'     : '1E3Dh5tTzlEW58e5cWuMdgy1',
        'callbackURL'      : 'https://localhost/auth/google/callback'
    }

};
