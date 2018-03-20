var mongoose = require('mongoose');
var ProcedureModel = mongoose.model('procedure');
var multer = require('multer');
var XLSX = require("xlsx");

module.exports = {
    getProcedureList: function(req, res){
        ProcedureModel.find({}, {}, function(err, procdata) {
            if (err) {
                console.log("Error finding procedures data in DB: " + err);
                // throw err;
            }
           res.send(procdata); 
        });
    },
    getProcedureData: function(req,res){
        var id = req.query.id;

        ProcedureModel.findOne( { 'procedure.id' : id }, function(err, model) {
            if(err){ 
                console.log(err);
            }

            var wbout = {};
            if(model.procedure){
                if(model.procedure.sections){
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
                    wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
                }
            }
            res.send(wbout);
        });
    },
    getLiveInstanceData: function(req,res){
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

    },
    getAllInstances: function(req,res){
        var id = req.query.procedureID;

        ProcedureModel.findOne( { 'procedure.id' : id}, function(err, model) {
            if(err){ 
                console.log(err);
            }
            var allinstances = {};

            if(model.instances){
                var instances = model.instances;
                var allinstances = {
                    instances : instances,
                    title : model.procedure.title
                }
            }
            res.send(allinstances);
        });

    },
    upload: function(req,res){

    },
    saveProcedureInstance: function(req,res){

    },
    setInfo: function(req,res){

    },
    setInstanceCompleted: function(req,res){

    }
};
