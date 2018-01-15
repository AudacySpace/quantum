// load the things we need
var mongoose = require('mongoose');

// define the schema for our procedure model
var procedureSchema = mongoose.Schema({

    procedure           : {
        id           : String,
        title        : String,
        lastuse      : Date,
        running      : Number,
        archived     : Number,
        sections     : Array,
        eventname    : String
    },
    runninginstances : Array,
    archivedinstances : Array
});

// create the model for procedures and expose it to our app
module.exports = mongoose.model('procedure', procedureSchema);
