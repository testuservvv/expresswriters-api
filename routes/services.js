var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);

var Model = db.collection('Model');
var Manufacturer = db.collection('Manufacturer');
var Services = db.collection('Services');
var ObjectId = require('mongojs').ObjectID;
 


// get all services
router.route('/services/:type').get(function (req, res) {
    try {
        Services.find({ 'isDeleted': false, 'Type': req.params.type }, function (err, services) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all services" });
            return res.send({ "status": "Success", "message": "services list", "services": services, "messageCode": "113", "methodName": "get all services" });
        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get all services" });
    }
});


//Update user by id

router.route('/service/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update Service by id" });
        }
        else {
            Services.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update Service by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "service not found with id", "messageCode": "109", "methodName": "update service by id" });
                }
                else {
                    Services.update({ '_id': new ObjectId(req.params.id) },
                        {
                            $set: {
                                "status": req.body.status                               
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update service by id" });
                            else {
                                return res.send({ "status": "Success", "message": "service updated successfully", "messageCode": "106", "methodName": "service by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "service update by id" });
    }
});



module.exports = router;