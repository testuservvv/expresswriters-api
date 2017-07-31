var mongoose = require('mongoose');

var availibilitySchema = {
	description:{type:String, required: true}
	
};

var schema = new mongoose.Schema( availibilitySchema );


module.exports = schema; 
module.exports.availibilitySchema = availibilitySchema; 