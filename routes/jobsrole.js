var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var jobsrole = db.collection('jobrole');
//var Model = db.collection('Model');
//var Manufacturer = db.collection('Manufacturer');
//var User = db.collection('User');
//var ObjectId = require('mongojs').ObjectID; 

// get all Jobs
router.route('/jobsrole').get(function (req, res) {

    try {
        jobsrole.find({},function (err, result) {
		console.log(result);
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all jobsrole" });
            return res.send({ "status": "Success", "message": "jobsrole list", "jobsrole":result, "messageCode": "113", "methodName": "get all jobsrole" });
        });
    } catch (err) {
	console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all jobsrole" });
    }
});
module.exports = router;