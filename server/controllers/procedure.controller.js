var mongoose = require('mongoose');
var ProcedureModel = mongoose.model('procedure');
var XLSX = require("xlsx");

module.exports = {
    getProcedureList: function(req, res){
        ProcedureModel.find({}, {}, function(err, procdata) {
            if (err) {
                console.log("Error finding procedures data in DB: " + err);
            }
            if(procdata){
                res.send(procdata); 
            }
           
        });
    },
    getProcedureData: function(req,res){
        var id = req.query.id;

        ProcedureModel.findOne( { 'procedureID' : id }, function(err, model) {
            if(err){ 
                console.log(err);
            }
            if(model){
                var sections = model.sections;
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
            }    
        });
    },
    getLiveInstanceData: function(req,res){
        var id = req.query.procedureID;
        var revision = req.query.currentRevision;

        ProcedureModel.findOne( { 'procedureID' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }

            if(model){
                var instances = model.instances;
                var liveinstance = [];

                for(var i=0;i<instances.length;i++){
                    if(instances[i].revision === parseInt(revision)){
                        liveinstance = instances[i];
                    }
                }
                res.send(liveinstance);
            }

        });

    },
    getAllInstances: function(req,res){
        var id = req.query.procedureID;

        ProcedureModel.findOne( { 'procedureID' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }
            var allinstances = {};

            if(model){
                var instances = model.instances;
                var allinstances = {
                    instances : instances,
                    title : model.title
                }
                res.send(allinstances);
            }

        });

    },
    uploadFile: function(req,res){
        try{
            var filename = req.file.originalname.split(" - ");
            var filepath = req.file.path;
            var workbook = XLSX.readFile(filepath);
            var sheet1 = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
            var userdetails = req.body.userdetails;

            var fileverify = 0

            for(var a=0;a<sheet1.length;a++){
                if(sheet1[a].Step && sheet1[a].Role && sheet1[a].Type && sheet1[a].Content){
                    fileverify++;
                }
            }

            if(fileverify === sheet1.length){

                ProcedureModel.findOne({ 'procedureID' : filename[0] }, function(err, procs) {
                    if(err){
                        console.log(err);
                    }

                    if(procs){ // Update a procedure
                        procs.sections = [];
                        for(var i=0;i<sheet1.length;i++){
                            procs.sections.push(sheet1[i]); 
                        }
                        procs.updatedBy = userdetails;
                        procs.save(function(err,result) {
                            if (err){
                                // throw err;
                                console.log(err);
                            }
                            if(result){
                                console.log('procedure data updated successfully!');
                                res.json({error_code:0,err_desc:"file updated"});
                            }
                        });

                    }else { //Save a new procedure

                        var pfiles = new ProcedureModel();
                        var ptitle = filename[2].split(".");

                        pfiles.procedureID = filename[0];
                        pfiles.title = filename[1]+" - "+ptitle[0];
                        pfiles.lastuse = "";
                        pfiles.instances = [];

                        for(var i=0;i<sheet1.length;i++){
                            pfiles.sections.push(sheet1[i]); 
                        }

                        pfiles.eventname = filename[1];
                        pfiles.uploadedBy = userdetails;
                        pfiles.save(function(err,result){
                            if(err){
                                console.log(err);
                            }
                            if(result){
                                console.log('procedure data saved successfully!');
                                res.json({error_code:0,err_desc:null});
                            }
                        });
                    }
                });
            }else{
                res.json({error_code:0,err_desc:"Not a valid file"});
            }

        }catch(e){
            console.log(e);
        }
    },
    saveProcedureInstance: function(req,res){
        var procid = req.body.id;
        var usernamerole = req.body.usernamerole;
        var lastuse = req.body.lastuse;//start time
        var username = req.body.username;
        var useremail = req.body.email;

        ProcedureModel.findOne({ 'procedureID' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }
            if(procs){
                var instancesteps = [];
                for(var i=0;i<procs.sections.length;i++){
                    instancesteps.push({"step":procs.sections[i].Step,"info":""})
                }
                var revision = procs.instances.length+1;
                procs.instances.push({"openedBy":usernamerole,"Steps":instancesteps,"closedBy":"","startedAt":lastuse,"completedAt":"","revision": procs.instances.length+1,"running":true,users:[{
                    "name":username,
                    "email":useremail,
                    "status":true
                }]});
                procs.lastuse = lastuse;
                procs.save(function(err,result) {
                    if (err){
                        // throw err;
                        console.log(err);
                    }
                    if(result){
                        res.send({"revision":revision});
                    }
                });
            }

        });

    },
    setInfo: function(req,res){
        var info = req.body.info;
        var procid = req.body.id;
        var step = req.body.step;
        var usernamerole = req.body.usernamerole;
        var procrevision = req.body.revision;
        var lastuse = req.body.lastuse; //time when the step was completed
        var recordedValue = req.body.recordedValue;
        var steptype = req.body.steptype;

        ProcedureModel.findOne({ 'procedureID' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            if(procs){
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
                        if(steptype === 'Input'){
                           instance[j].recordedValue = recordedValue; 
                        }
                        break;
                    }
                }

                procs.instances[instanceid].Steps = instance;
                procs.lastuse = lastuse;
                procs.markModified('procedure');
                procs.markModified('instances');

                procs.save(function(err,result) {
                    if (err){
                        console.log(err);
                    }
                    if(result){
                        res.send(result);
                    }
                    
                });

            }
        });
    },
    setInstanceCompleted: function(req,res){
        var info = req.body.info;
        var procid = req.body.id;
        var step = req.body.step;
        var usernamerole = req.body.usernamerole;
        var procrevision = req.body.revision;
        var lastuse = req.body.lastuse; // time when the procedure instance is completed

        ProcedureModel.findOne({ 'procedureID' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            if(procs){
                //get procedure instance with the revision num
                for(var i=0;i<procs.instances.length;i++){
                    if(procs.instances[i].revision === procrevision){
                        procs.instances[i].closedBy = usernamerole;
                        procs.instances[i].completedAt = lastuse;
                        procs.instances[i].running = false;
                        break;
                    }
                }
                procs.lastuse = lastuse;
                procs.markModified('procedure');
                procs.markModified('instances');
                procs.save(function(err,result) {
                    if (err){
                        console.log(err);
                    }
                    if(result){
                        res.send(result);
                    }
                    
                });
            }

        });
    },
    setComments: function(req,res){
        var procid = req.body.pid;
        var procrevision = req.body.prevision;
        var step = req.body.index;
        var comments = req.body.comments;
        var lastuse = req.body.lastuse; // time when the procedure instance is completed

        ProcedureModel.findOne({ 'procedureID' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }

            if(procs){
                //get procedure instance with the revision num
                var instance = [];
                var instanceid;
                //get procedure instance with the revision num
                for(var i=0;i<procs.instances.length;i++){
                    if(parseInt(procs.instances[i].revision) === parseInt(procrevision)){
                        instance = procs.instances[i].Steps;
                        instanceid = i;
                        break;
                    }
                }

                //Set info for the step of that revision
                for(var j=0;j<instance.length;j++){
                    if(j === step){
                        instance[j].comments = comments;
                        break;
                    }
                }

                procs.instances[instanceid].Steps = instance;
                procs.lastuse = lastuse;
                procs.markModified('procedure');
                procs.markModified('instances');
                procs.save(function(err,result) {
                    if (err){
                        console.log(err);
                    }
                    if(result){
                       res.send(result);
                    }
                    
                });
            }

        });
    },
    setUserStatus: function(req,res){
        var email = req.body.email;
        var status = req.body.status;
        var procid = req.body.pid;
        var username = req.body.username;
        var revision = req.body.revision;

        ProcedureModel.findOne( { 'procedureID' : procid}, function(err, procs) {
            if(err){ 
                console.log(err);
            }

            if(procs){
                var liveinstanceID;
                for(var i=0;i<procs.instances.length;i++){
                    if(parseInt(procs.instances[i].revision) === parseInt(revision)){
                        liveinstanceID = i;
                        break;
                    }
                }

                if(procs.instances[liveinstanceID].users.length > 0){
                    var len = procs.instances[liveinstanceID].users.length;
                    for(var i=0;i<len;i++){
                        if(procs.instances[liveinstanceID].users[i].emailaddress === email){
                            // when the user object exits already
                            procs.instances[liveinstanceID].users[i].status = status;
                            break;
                        }
                    }
                }else {
                    procs.instances[liveinstanceID].users.push({
                        "name":username,
                        "email":email,
                        "status":status
                    });
                }

                procs.markModified('instances');
                procs.save(function(err,result) {
                    if (err){
                        console.log(err);
                    }
                    if(result){
                       res.send(result);
                    }
                    
                });
            }
        });
    }
};

