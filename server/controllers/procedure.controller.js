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

        ProcedureModel.findOne( { 'procedure.id' : id }, function(err, model) {
            if(err){ 
                console.log(err);
            }
            if(model){
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
            }    
        });
    },
    getLiveInstanceData: function(req,res){
        var id = req.query.procedureID;
        var revision = req.query.currentRevision;

        ProcedureModel.findOne( { 'procedure.id' : id}, function(err, model) {
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

        ProcedureModel.findOne( { 'procedure.id' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }
            var allinstances = {};

            if(model){
                var instances = model.instances;
                var allinstances = {
                    instances : instances,
                    title : model.procedure.title
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

                ProcedureModel.findOne({ 'procedure.id' : filename[0] }, function(err, procs) {
                    if(err){
                        console.log(err);
                    }

                    if(procs){ // Update a procedure
                        for(var i=0;i<sheet1.length;i++){
                            procs.procedure.sections.push(sheet1[i]); 
                        }
                        procs.procedure.updatedBy = userdetails;
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

                        pfiles.procedure.id = filename[0];
                        pfiles.procedure.title = filename[1]+" - "+ptitle[0];
                        pfiles.procedure.lastuse = "";
                        pfiles.instances = [];

                        for(var i=0;i<sheet1.length;i++){
                            pfiles.procedure.sections.push(sheet1[i]); 
                        }

                        pfiles.procedure.eventname = filename[1];
                        pfiles.procedure.uploadedBy = userdetails;
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

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
            if(err){
                console.log(err);
            }
            if(procs){
                var instancesteps = [];
                for(var i=0;i<procs.procedure.sections.length;i++){
                    instancesteps.push({"step":procs.procedure.sections[i].Step,"info":""})
                }
                var revision = procs.instances.length+1;
                procs.instances.push({"openedBy":usernamerole,"Steps":instancesteps,"closedBy":"","startedAt":lastuse,"completedAt":"","revision": procs.instances.length+1,"running":true});
                procs.procedure.lastuse = lastuse;
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

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
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
                        instance[j].recordedValue = recordedValue;
                        break;
                    }
                }

                procs.instances[instanceid].Steps = instance;
                procs.procedure.lastuse = lastuse;
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

        ProcedureModel.findOne({ 'procedure.id' : procid }, function(err, procs) {
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
                procs.procedure.lastuse = lastuse;
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
    }

};
