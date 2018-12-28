var mongoose = require('mongoose');
var ProcedureModel = mongoose.model('procedure');
var XLSX = require("xlsx");
var configRole = require('../../config/role');
var validTypes = ['ACTION','CAUTION','DECISION','HEADING','INFO','RECORD','VERIFY','WARNING'];

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

        ProcedureModel.findOne( { 'procedureID' : id }, function(err, model) {
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

            // File Upload Validations
            var fileverify = 0

            // check if all steps have step,type,content
            for(var a=0;a<sheet1.length;a++){
                //if(sheet1[a].Step && sheet1[a].Role && sheet1[a].Type && sheet1[a].Content){
                if(sheet1[a].Step && sheet1[a].Type && sheet1[a].Content){
                    fileverify++;
                }
            }


            //To check if Type is valid
               //Check spellings and ignore case
                    //It Should be one of 'Action','Caution','Decision','Heading','Info','Record','Verify','Warning'.
            var stepsValidity = 0;
            var errorTypeSteps = [];
            for(var b=0;b<sheet1.length;b++){
                var isValid = checkTypeValidity(sheet1[b].Type);
                if(isValid === true){
                    stepsValidity++;
                }else {
                    errorTypeSteps.push({"Step":sheet1[b].Step,"Type":sheet1[b].Type});
                }
            }

            var roleValidity = 0;
            var roleErrSteps = [];
            for(var r=0;r<sheet1.length;r++){
                if(sheet1[r].Type.toUpperCase !== 'HEADING'){
                    if(sheet1[r].Role){
                        var isRoleValid = checkRoleValidity(sheet1[r].Role);
                        if(isRoleValid === true){
                            roleValidity++;
                        }else {
                            roleErrSteps.push({"Step":sheet1[r].Step,"Role":sheet1[r].Role});
                        }
                    }else {
                        roleErrSteps.push({"Step":sheet1[r].Step,"Role":""});
                    }
                }
            }

            var headingSteps = 0;
            var headingErr = [];
            var nonheadingSteps = 0;
            var nonHeadingErr = [];
            if(errorTypeSteps.length === 0){
                if(roleErrSteps.length > 0){
                    res.json({error_code:6,err_desc:"Invalid Role",err_data:roleErrSteps});
                }

                if(sheet1[sheet1.length-1].Type.toUpperCase() === 'HEADING'){
                    res.json({error_code:7,err_desc:"Last Step Invalid",err_data:[{"Step":sheet1[sheet1.length-1].Step,"Type":sheet1[sheet1.length-1].Type}]});
                }

                if(fileverify === sheet1.length){
                    for(var c=0;c<sheet1.length;c++){
                        if(sheet1[c].Type.toUpperCase() === 'HEADING'){
                            //Get Heading type steps
                            var isHeading = getSteps(sheet1[c],true);
                            if(isHeading === true){
                                headingSteps++;
                            }else {
                                headingErr.push({"Step":sheet1[c].Step,"Type":sheet1[c].Type});
                            }
                        }else {
                            //Get Non Heading type steps
                            var isNonHeading = getSteps(sheet1[c],false);
                            if(isNonHeading === true){
                                nonheadingSteps++;
                            }else {
                                nonHeadingErr.push({"Step":sheet1[c].Step,"Type":sheet1[c].Type});
                            }
                        }
                    }
                


                    if(headingErr.length > 0 && nonHeadingErr.length > 0){
                        res.json({error_code:3,err_desc:"Not a valid Step",err_dataHeading:headingErr,err_dataNonHeading:nonHeadingErr});
                    }else if(headingErr.length > 0){
                        res.json({error_code:4,err_desc:"Invalid Heading",err_data:headingErr});
                    }else if(nonHeadingErr.length > 0){
                        res.json({error_code:5,err_desc:"Invalid Other Type",err_data:nonHeadingErr});
                    }
                // else if(roleErrSteps.length > 0){
                //     res.json({error_code:6,err_desc:"Invalid Role",err_data:roleErrSteps});
                // }
                // else if(sheet1[sheet1.length-1].Type.toUpperCase() === 'HEADING'){
                //     res.json({error_code:7,err_desc:"Last Step Invalid",err_data:[{"Step":sheet1[sheet1.length-1].Step,"Type":sheet1[sheet1.length-1].Type}]});
                // }
                }else {
                    res.json({error_code:0,err_desc:"Not a valid file"});
                }
            }else if(errorTypeSteps.length > 0){
                res.json({error_code:2,err_desc:"Step Type invalid",err_data:errorTypeSteps});
            }else if(roleErrSteps.length > 0){
                res.json({error_code:6,err_desc:"Invalid Role",err_data:roleErrSteps});
            }else if(sheet1[sheet1.length-1].Type.toUpperCase() === 'HEADING'){
                res.json({error_code:7,err_desc:"Last Step Invalid",err_data:[{"Step":sheet1[sheet1.length-1].Step,"Type":sheet1[sheet1.length-1].Type}]});
            }else {
                res.json({error_code:0,err_desc:"Not a valid file"});
            }
            //End of Validations


            //If everything is valid 
            if(fileverify === sheet1.length && errorTypeSteps.length === 0 && headingErr.length === 0 && nonHeadingErr.length === 0 && roleErrSteps.length === 0 && sheet1[sheet1.length-1].Type.toUpperCase() !== 'HEADING'){

                ProcedureModel.findOne({ 'procedureID' : filename[0] }, function(err, procs) {
                    if(err){
                        console.log(err);
                    }

                    if(procs){ // Update a procedure
                        var ptitle = filename[2].split(".");
                        procs.procedureID = filename[0];
                        procs.title = filename[1]+" - "+ptitle[0];
                        
                        if(procs.versions && procs.versions.length > 0){
                            procs.versions.push(sheet1);
                        }else if(procs.versions && procs.versions.length === 0){
                            procs.versions = [];
                            procs.versions.push(procs.sections);
                            procs.versions.push(sheet1);
                        }else if(!procs.versions){
                            procs.versions = [];
                            procs.versions.push(procs.sections);
                            procs.versions.push(sheet1);
                        }
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
                        pfiles.versions = [];

                        for(var i=0;i<sheet1.length;i++){
                            pfiles.sections.push(sheet1[i]); 
                        }
                        
                        pfiles.versions.push(pfiles.sections);

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
            }else if(fileverify !== sheet1.length){
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
        var userstatus = req.body.status;

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
                var versionNum = procs.versions.length;

                procs.instances.push({"openedBy":usernamerole,"Steps":instancesteps,"closedBy":"","startedAt":lastuse,"completedAt":"","revision": procs.instances.length+1,"running":true,users:[{
                    "name":username,
                    "email":useremail,
                    "status":userstatus
                }],"version":versionNum});

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
        var liveinstanceID;

        ProcedureModel.findOne( { 'procedureID' : procid }, function(err, procs) {
            if(err){ 
                console.log(err);
            }

            if(procs){

                for(var i=0;i<procs.instances.length;i++){
                    if(parseInt(procs.instances[i].revision) === parseInt(revision) && revision !== ""){
                        liveinstanceID = i;
                        break;
                    }else if(revision === ""){
                        liveinstanceID = "";
                    }
                }

                if(liveinstanceID !== ""){
                    if(procs.instances[liveinstanceID].users && procs.instances[liveinstanceID].users.length > 0){
                        var len = procs.instances[liveinstanceID].users.length;
                        for(var i=0;i<len;i++){
                            if(procs.instances[liveinstanceID].users[i].email === email){
                                // when the user object exits already
                                procs.instances[liveinstanceID].users[i].status = status;
                                break;
                            }else if(i === len-1){
                                procs.instances[liveinstanceID].users.push({
                                    'name':username,
                                    'email':email,
                                    'status':status
                                });
                            }
                        }
                    }else {
                        procs.instances[liveinstanceID].users = [];
                        procs.instances[liveinstanceID].users.push({
                            'name':username,
                            'email':email,
                            'status':status
                        });
                    }
                }else {
                    //when in dashboard page or any other index page;there exists no revision num
                    //then set the status of user as false for all the revisions available in the procedure.
                    for(var i=0;i<procs.instances.length;i++){
                        for(var j=0;j<procs.instances[i].users.length;j++){
                            if(procs.instances[i].users[j].email === email){
                                // when the user object exits already
                                procs.instances[i].users[j].status = status;
                            }
                        }
                    }
                }


                procs.markModified('instances');
                procs.save(function(err,result) {
                    if (err){
                        console.log(err);
                    }
                    if(result){
                       res.send({status:status});
                    }
                    
                });
            }
        });
    },
    updateProcedureName: function(req,res){
        var newprocedurename = req.body.newprocedurename;
        var prevProcId = req.body.procId

        ProcedureModel.findOne( { 'procedureID' : prevProcId }, function(err, procs) {
            if(err){ 
                console.log(err);
            }

            if(procs){
                procs.procedureID = newprocedurename.id;
                procs.eventname = newprocedurename.gname;
                procs.title = newprocedurename.gname+" - "+newprocedurename.title;

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

function checkTypeValidity(stepType){
    if(validTypes.includes(stepType.toUpperCase())){
        return true
    }else {
        return false;
    }
}

function getSteps(step,isHeading){
    if(isHeading === true){
       // psteps[j].Step.includes(".0") === true && psteps[j].Step.indexOf(".") === psteps[j].Step.lastIndexOf(".")
        if(step.Step.includes(".0") === true){
            return true;
        }else {
            return false;
        }
    }else if(isHeading === false){
        if(step.Step.includes(".0") === false){
            return true;
        }else {
            return false;
        }
    }
}

function getAllCallSigns(){
    var callSigns = [];
    var roleKeys = Object.keys(configRole.roles);
    for(var i=0;i<roleKeys.length;i++){
        callSigns.push(configRole.roles[roleKeys[i]].callsign);
    }
    return callSigns;
}

function checkRoleValidity(stepRole){
    var callSigns = getAllCallSigns();
    var tempRoles = [];
    var str = stepRole.replace(/\s/g, '');
    if(stepRole.includes(",")){
        tempRoles = str.split(',');

    }else {
        tempRoles.push(str);
    }
    if(tempRoles.length === 1){
        if(callSigns.includes(str)){
            return true;
        }else {
            return false;
        }
    }else if(tempRoles.length > 1){
        var roleCount = 0;
        for(var a=0;a<tempRoles.length;a++){
            if(callSigns.includes(tempRoles[a].toUpperCase())){
                roleCount++;
            }else {
                return false;
            }
        }

        if(roleCount === tempRoles.length){
            return true;
        }
    }

}

