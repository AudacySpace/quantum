// load the things we need
var mongoose = require('mongoose');

// define the schema for our procedure model
var procedureSchema = mongoose.Schema({
    procedureID: {type:String,required:true},
    title:{type:String,required:true},
    lastuse:{type:String},
    sections:{type:Array,required:true},
    eventname:{type:String,required:true},
    uploadedBy:{type:String},
    updatedBy:{type:String},
    instances:{type:Array}
});

// create the model for procedures and expose it to our app
module.exports = mongoose.model('procedure', procedureSchema);
