var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var availibility = db.collection('availibility');


// get all availibility
router.route('/availibility').get(function (req, res) {

    try {
        availibility.find({},function (err, result) {
		console.log(result);
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all availibility" });
            return res.send({ "status": "Success", "message": "availibility list", "availibility":result, "messageCode": "113", "methodName": "get all availibility" });
        });
    } catch (err) {
	console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all availibility" });
    }
});
module.exports = router;