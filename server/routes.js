module.exports = function(app,passport) {

    var multer = require('multer');
    var XLSX = require("xlsx");
    var User = require('./models/user');
    var ProcedureModel = require('./models/procedure');
    var configRole = require('../config/role');
    var procs =  require('./controllers/procedure.controller');
    var usr =  require('./controllers/user.controller');

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '/tmp/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    var upload = multer({ //multer settings
        storage: storage,
        fileFilter : function(req, file, callback) { //file filter
            if (['xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                return callback(new Error('Wrong extension. Please upload an xlsx file.'));
            }
            callback(null, true);
        }
    }).single('file');


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
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                console.log(err);
                res.json({error_code:1,err_desc:err});
            }

            var filename = req.file.originalname.split(" - ");
            try{
                var filepath = req.file.path;
                var workbook = XLSX.readFile(filepath);
                var sheet1 = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);

                var fileverify = 0
                for(var a=0;a<sheet1.length;a++){
                    if(sheet1[a].Step && sheet1[a].Role && sheet1[a].Type && sheet1[a].Content){
                        fileverify++;
                    }
                }

                if(fileverify === sheet1.length-1){

                    ProcedureModel.find({},{},function(err, procfiles) {
                        if(err){
                            console.log(err);
                            res.json({error_code:0,err_desc:null});
                        }
                        
                        var pfiles = new ProcedureModel();
                        var ptitle = filename[2].split(".");
                        pfiles.procedure.id = filename[0];
                        pfiles.procedure.title = filename[1]+" - "+ptitle[0];
                        pfiles.procedure.lastuse = "";
                        pfiles.instances = [];
                        for(var i=0;i<sheet1.length;i++){
                            pfiles.procedure.sections.push(sheet1[i]); 
                        }
                        pfiles.procedure.eventname = filename[1];
                        pfiles.save(function(err,result){
                            if(err){
                                console.log(err);
                            }
                            if(result){
                                console.log('procedure data saved successfully');
                            }
                        });
                    });
                    res.json({error_code:0,err_desc:null});
                }else{
                    res.json({error_code:0,err_desc:"Not a valid file"});
                }
            }catch(e){
                console.log(e);
            }
        });
    });


    //Displays all the available procedures in a table
    app.get('/getProcedureList',procs.getProcedureList);

    //Gets all the sections of the procedure
    app.get('/getProcedureData',procs.getProcedureData);

    //save procedure instance
    app.post('/saveProcedureInstance', function(req,res){
        var procid = req.body.id;
        var usernamerole = req.body.usernamerole;
        var lastuse = req.body.lastuse;//start time

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }
            var instancesteps = [];
            for(var i=0;i<procs.procedure.sections.length;i++){
                instancesteps.push({"step":procs.procedure.sections[i].Step,"info":""})
            }
            var revision = procs.instances.length+1;
            procs.instances.push({"openedBy":usernamerole,"Steps":instancesteps,"closedBy":"","startedAt":lastuse,"completedAt":"","revision": procs.instances.length+1,"running":true});
            procs.procedure.lastuse = lastuse;
            procs.save(function(err) {
                if (err) throw err;
                res.send({"revision":revision});
            });
        });
    });

    //Displays all the available procedures in a table
    app.post('/setInfo', function(req,res){
        var info = req.body.info;
        var procid = req.body.id;
        var step = req.body.step;
        var usernamerole = req.body.usernamerole;
        var procrevision = req.body.revision;
        var lastuse = req.body.lastuse; //time when the step was completed

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            var instance = [];
            var instanceid;
            //get procedure instance with the revision num
            for(var i=0;i<procs.instances.length;i++){
                if(procs.instances[i].revision === procrevision){
                    instance = procs.instances[i].Steps;
                    instanceid = i;
                    break;
                }
            }

            //Set info for the step of that revision
            for(var j=0;j<instance.length;j++){
                if(j === step){
                    instance[j].info = info;
                    break;
                }
            }

            procs.instances[instanceid].Steps = instance;
            procs.procedure.lastuse = lastuse;
            procs.markModified('procedure');
            procs.markModified('instances');

            procs.save(function(err) {
                if (err) throw err;
                res.send(procs);
            });
        });
    });

    //Displays all the available procedures in a table
    app.post('/setInstanceCompleted', function(req,res){
        var info = req.body.info;
        var procid = req.body.id;
        var step = req.body.step;
        var usernamerole = req.body.usernamerole;
        var procrevision = req.body.revision;
        var lastuse = req.body.lastuse; // time when the procedure instance is completed

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            //get procedure instance with the revision num
            for(var i=0;i<procs.instances.length;i++){
                if(procs.instances[i].revision === procrevision){
                    procs.instances[i].closedBy = usernamerole;
                    procs.instances[i].completedAt = lastuse;
                    procs.instances[i].running = false;
                    break;
                }
            }
            procs.procedure.lastuse = lastuse;
            procs.markModified('procedure');
            procs.markModified('instances');
            procs.save(function(err) {
                if (err) throw err;
                res.send(procs);
            });
        });
    });

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

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


