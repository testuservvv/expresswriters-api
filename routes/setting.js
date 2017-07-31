var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var setting = db.collection('setting');




// get all Jobs
router.route('/setting').get(function (req, res) {

    try {
        setting.find({ 'status': (req.params.status) }).sort({ createddate: -1 }, function (err, result) {
            console.log(result);
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all Admin setting" });
            return res.send({ "status": "Success", "message": "Admin setting list", "setting": result, "messageCode": "113", "methodName": "get all Admin setting" });
        });
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all Admin setting" });
    }
});

module.exports = router;