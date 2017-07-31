var mongoose = require('mongoose');

var jobSchema = {
	 
	
    firstname:{type: String,required:true},
    lastname:{type:String,required:true},
	username: { type: String, required: true },
	password:{type:String,required:true},
	createddate:{type:Date},
	updateddate:{type:Date},
	isdeleted:{type:boolean ,default:true},
	roles:{
	role:{type:String,required:true},
	role1:{type:String,required:true},
	}
};

var schema = new mongoose.Schema( jobSchema );


module.exports = schema; 
module.exports.jobSchema = jobSchema; 