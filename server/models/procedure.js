// load the things we need
var mongoose = require('mongoose');

// define the schema for our procedure model
var procedureSchema = mongoose.Schema({

    procedure           : {
        id           : String,
        title        : String,
        lastuse      : String,
        sections     : Array,
        eventname    : String
    },
    instances : Array
});

// create the model for procedures and expose it to our app
module.exports = mongoose.model('procedure', procedureSchema);
