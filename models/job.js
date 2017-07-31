var mongoose = require('mongoose');

var jobSchema = {
	jobname:{type:String, required: true},
	availibility: { type: String, required: true },	
	status:{type:String , required: true},
	mincompensation:{type:Number  , required: true},
	maxcompensation:{type:Number , required: true},
	compensationtype :{type:String , required: true},	
	createddate:{type:Date},
	enddate:{type:Date},
	createdby :{
	firstname:{ type: String, required: true },
	lastname:{ type: String, required: true },
	username:{ type: String, required: true },
	userid:{ type: String, required: true },
	}
};

var schema = new mongoose.Schema( jobSchema );


module.exports = schema; 
module.exports.jobSchema = jobSchema; 