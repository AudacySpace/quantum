// load the things we need
var mongoose = require('mongoose');

// define the schema for our procedure model
var procedureregistrySchema = mongoose.Schema({
    catalog:{type:Array}
});

// create the model for procedures and expose it to our app
module.exports = mongoose.model('procedureregistry', procedureregistrySchema);