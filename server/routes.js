module.exports = function(app,passport) {

    var multer = require('multer');
    var XLSX = require("xlsx");
    var User = require('./models/user');
    var ProcedureModel = require('./models/procedure');

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
                    pfiles.procedure.running = 0;
                    pfiles.procedure.archived = 0;
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
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}