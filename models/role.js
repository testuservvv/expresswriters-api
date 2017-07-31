var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema =  new Schema({
	 
	role: { type: String, required: true },	
	isdeleted: {type: Boolean ,default:true},
	createddate: {type: Date}
	
});

var Role = mongoose.model('Role', roleSchema);


module.exports = Role;