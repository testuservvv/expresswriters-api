var mongoose = require('mongoose');

var jobroleSchema = {

	name: { type: String, required: true },

	createdon:{type:Date},

	isdeleted:{type: Boolean ,default:true}

};

var schema = new mongoose.Schema( jobroleSchema );


module.exports = schema;
module.exports.jobroleSchema = jobroleSchema;