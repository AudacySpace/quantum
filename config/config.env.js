var fs = require('fs-extra');

module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'staging':
            return {
            	'googleAuth' : {
			        'clientID'         : '',
			        'clientSecret'     : '',
			        'callbackURL'      : ''
			    },
			    'databaseURL' : ''
            };

        case 'production':
            return {
            	'googleAuth' : {
			        'clientID'         : '615485532605-22v29drsct2cf76dnhd5hbhnl8h0i0gp.apps.googleusercontent.com',
			        'clientSecret'     : '1E3Dh5tTzlEW58e5cWuMdgy1',
			        'callbackURL'      : 'https://quantum.audacy.space/auth/google/callback'
			    },
			    'databaseURL' : 'mongodb://audacy:race2space@10.0.22.236:27017/quindar',
			    'databaseOpts' : {
					useMongoClient: true,
					ssl: true,
					sslValidate: false,
					sslKey: fs.readFileSync('./config/ssl/mongodb.pem'),
					sslCert: fs.readFileSync('./config/ssl/mongodb-prod.crt')
				}
            };

        default:
            return {
            	'googleAuth' : {
			        'clientID'         : '615485532605-22v29drsct2cf76dnhd5hbhnl8h0i0gp.apps.googleusercontent.com',
			        'clientSecret'     : '1E3Dh5tTzlEW58e5cWuMdgy1',
			        'callbackURL'      : 'https://localhost/auth/google/callback'
			    },
			    'databaseURL' : 'mongodb://54.184.232.90:27017/quindar',
			    'databaseOpts' :  {
					useMongoClient: true,
				}
            };
    }
};