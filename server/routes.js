module.exports = function(app,passport) {

    var multer = require('multer');
    var XLSX = require("xlsx");
    var User = require('./models/user');
    var ProcedureModel = require('./models/procedure');
    var Telemetry = require('./models/telemetry');

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

    //get current role of the user
    app.get('/getCurrentRole', function(req,res){
        var email = req.query.email;

        //update the current role of the user
        User.findOne({ 'google.email' : email }, { currentRole : 1 }, function(err, user) {
            if(err){
                console.log(err);
            }
            res.send(user.currentRole);
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

                console.log(sheet1);
                var fileverify = 0
                for(var a=0;a<sheet1.length;a++){
                    if(sheet1[a].Step && sheet1[a].Role && sheet1[a].Type && sheet1[a].Content){
                        fileverify++;
                    }
                }
                console.log(fileverify);
                console.log(sheet1.length-1);
                if(fileverify === sheet1.length-1){

              //  }
                //else {
                     //res.json({error_code:0,err_desc:"Not a valid file"});
                //}
            
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
    app.get('/getProcedureList', function(req,res){
        ProcedureModel.find({}, {}, function(err, procdata) {
            if (err) {
                console.log("Error finding procedures data in DB: " + err);
                throw err;
            }
           res.send(procdata); 
        });
    });

    //Gets all the sections of the procedure
    app.get('/getProcedureData', function(req,res){
        var id = req.query.id;

        ProcedureModel.findOne( { 'procedure.id' : id }, function(err, model) {
            if(err){ 
                console.log(err);
            }

            var sections = model.procedure.sections;
            //convert json to worksheet
            var ws = XLSX.utils.json_to_sheet(sections, {header:["Step","Role","Type","Content","Reference"]});
            //Give name to the worksheet
            var ws_name = "Sheet1";
            //Create a workbook object
            var wb = { SheetNames:[], Sheets:{} };

             // add worksheet to workbook 
            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;
            // write workbook object into a xlsx file
            var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

            res.send(wbout);
        });
    });

    //save procedure instance
    app.post('/saveProcedureInstance', function(req,res){
        var procid = req.body.id;
        var usernamerole = req.body.usernamerole;
        var starttime = req.body.starttime;

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }
            var instancesteps = [];
            for(var i=0;i<procs.procedure.sections.length;i++){
                instancesteps.push({"step":procs.procedure.sections[i].Step,"info":""})
            }
            var revision = procs.instances.length+1;
            procs.instances.push({"openedBy":usernamerole,"Steps":instancesteps,"closedBy":"","startedAt":starttime,"completedAt":"","revision": procs.instances.length+1,"running":true});

            procs.save(function(err) {
                if (err) throw err;
                res.send({"revision":revision});
            });
        });
    });

    //Get telemetry data for the mission passed as a parameter
    app.get('/getTimestamp', function(req, res){
        var mission = req.query.mission;

        if(mission) {
            Telemetry.findOne( 
                {'mission' : mission }, 
                {}, 
                { sort: { 'timestamp' : -1 }},
                function(err, telemetry) {
                    if(err) throw err;

                    res.send(telemetry);
                }
            );
        }
    });

    //Displays all the available procedures in a table
    app.post('/setInfo', function(req,res){
        var info = req.body.info;
        var procid = req.body.id;
        var step = req.body.step;
        var usernamerole = req.body.usernamerole;
        var procrevision = req.body.revision;

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
        var completedtime = req.body.completedtime;

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            //get procedure instance with the revision num
            for(var i=0;i<procs.instances.length;i++){
                if(procs.instances[i].revision === procrevision){
                    procs.instances[i].closedBy = usernamerole;
                    procs.instances[i].completedAt = completedtime;
                    procs.instances[i].running = false;
                    break;
                }
            }

            procs.markModified('instances');
            procs.save(function(err) {
                if (err) throw err;
                res.send(procs);
            });
        });
    });

    //Gets all the sections of the live instance
    app.get('/getLiveInstanceData', function(req,res){
        var id = req.query.procedureID;
        var revision = req.query.currentRevision;

        ProcedureModel.findOne( { 'procedure.id' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }

            var instances = model.instances;
            var liveinstance = [];

            for(var i=0;i<instances.length;i++){
                if(instances[i].revision === parseInt(revision)){
                    liveinstance = instances[i];
                }
            }
            res.send(liveinstance);
        });
    });

    //Gets all running instances and archived instances of a procedure
    app.get('/getAllInstances', function(req,res){
        var id = req.query.procedureID;

        ProcedureModel.findOne( { 'procedure.id' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }

            var instances = model.instances;
            var allinstances = {
                instances : instances,
                title : model.procedure.title
            }
            res.send(allinstances);
        });
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}