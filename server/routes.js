module.exports = function(app,passport) {

    var User = require('./models/user');
    var ProcedureModel = require('./models/procedure');
    var procs =  require('./controllers/procedure.controller');
    var usr =  require('./controllers/user.controller');
    var multer = require('multer');

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '/tmp/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    });

	// show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // DASHBOARD SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {    
        res.render('dashboard.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/dashboard',
                    failureRedirect : '/'
            }));

    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/dashboard');
        });
    });

    //To save procedures
    app.post('/upload',upload.single('file'),procs.uploadFile);

    //Displays all the available procedures in a table
    app.get('/getProcedureList',procs.getProcedureList);

    //Gets all the sections of the procedure
    app.get('/getProcedureData',procs.getProcedureData);

    //save procedure instance
    app.post('/saveProcedureInstance',procs.saveProcedureInstance);

    //Displays all the available procedures in a table
    app.post('/setInfo',procs.setInfo);

    //Displays all the available procedures in a table
    app.post('/setInstanceCompleted',procs.setInstanceCompleted);

    //Gets all the sections of the live instance
    app.get('/getLiveInstanceData',procs.getLiveInstanceData);

    //Gets all running instances and archived instances of a procedure
    app.get('/getAllInstances',procs.getAllInstances);

    //set user's mission property and roles(if needed)
    app.post('/setMissionForUser',usr.setMissionForUser);

    //get current role of the user
    app.get('/getCurrentRole',usr.getCurrentRole);

    //get allowed roles of the user
    app.get('/getAllowedRoles',usr.getAllowedRoles);

    //set user's current role in the database
    app.post('/setUserRole',usr.setUserRole);

    //Get Users list
    app.get('/getUsers',usr.getUsers);

    //get roles configured in server code
    app.get('/getRoles',usr.getRoles);

    //set user's allowed roles in the database
    app.post('/setAllowedRoles',usr.setAllowedRoles);

    //set comments
    app.post('/setComments',procs.setComments);

    //set user status
    app.post('/setUserStatus',procs.setUserStatus);

    //get user current role
    app.get('/getUsersCurrentRole',usr.getUsersCurrentRole);

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


