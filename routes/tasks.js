var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var async = require('async');
var tasks = db.collection('tasks');
// get all orders
router.route('/tasks/:itemId').get(function (req, res) {
    try {
        if (!req.params.itemId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "get all tasks" });
        }
        else {
            tasks.find({ 'itemid': parseInt(req.params.itemId) }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tasks" });
                else {
                    return res.send({ "status": "Success", "message": "Tasks list", "Tasks": result, "messageCode": "116", "methodName": "get all tasks" });
                }
            });
        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all tasks" });
    }
});

module.exports = router;