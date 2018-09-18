// set up =======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
// set the port
app.set('port', (process.env.PORT || 3000));
var mongoose = require('mongoose'); 					// mongoose for mongodb
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var session      = require('express-session');

// app.use(express.static(__dirname + '/config'));
app.use(express.static(__dirname + '/app')); 		// set the static files location

//Get database URL from config and connect
mongoose.plugin(schema => { schema.options.usePushEach = true });
var config = require('./config/config.env.js'),
    configDB = new config();
mongoose.Promise = global.Promise;
mongoose.connect(configDB.databaseURL, { useMongoClient: true }); 	// connect to mongoDB database

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open\n');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err + '\n');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

require('./server/lib/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ 
		secret: 'ilovequantum',
    	resave: true,
    	saveUninitialized: true 
    })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes =======================================================================
require('./server/routes.js')(app,passport); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {
  console.log("Node app is running at port " + app.get('port'));
});
