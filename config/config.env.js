
module.exports = function(){
	//values of NODE_ENV - 'staging', 'production', 'development'
	if(process.env.NODE_ENV && process.env.NODE_ENV != 'development') {
		return {
        	'azureADAuth' : {
		        'clientID'         : process.env.OAUTH_CLIENT_ID,
		        'clientSecret'     : process.env.OAUTH_CLIENT_SECRET,
		        'tenantID'         : process.env.OAUTH_TENANT_ID,
		        'callbackURL'      : `https://${process.env.QUANTUM_HOST}/auth/azureadoauth2/callback`
		    },
		    'databaseURL' : `mongodb://${process.env.MONGO_DB_HOST}:27017/${process.env.MONGO_DB_DATABASE}`,
		    'databaseOpts' : {
				useMongoClient : true, authSource: 'admin',
				user: process.env.MONGO_DB_USER, pass: process.env.MONGO_DB_PASSWORD
			}
        };
	} else { //return values for development environment in case NODE_ENV not set
		return {
        	'azureADAuth' : {
		        'clientID'         : process.env.OAUTH_CLIENT_ID,
		        'clientSecret'     : process.env.OAUTH_CLIENT_SECRET,
		        'tenantID'         : process.env.OAUTH_TENANT_ID,
		        'callbackURL'      : 'https://localhost/auth/azureadoauth2/callback'
		    },
		    'databaseURL' : 'mongodb://host.docker.internal:27017/quantum',
		    'databaseOpts' : { useMongoClient: true }
        };
	}
};

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
