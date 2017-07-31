var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var client = db.collection('client');

var ObjectId = mongojs.ObjectID;
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
// Generates hash using bCrypt

// Save client
router.route('/client/Admin').post(function (req, res) {
    try {
        if (!req.body.firstname || !req.body.lastname || !req.body.username) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save client" });
        }
        else {
            client.find().count(function (err, clientcount) {
                console.log(clientcount);
                if (clientcount > 0) {
                    clientcount++;
                }
                else {
                    clientcount = 1;
                }               
                console.log(clientcount);
                client.findOne({ 'username': req.body.username }, function (err, user) {
                    if (user) {
                        return res.send({ "status": "Error", "message": "client already exist.", "messageCode": "109", "methodName": "Save client" });
                    }
                    else {

                        var clientCollection = {
                            "_id":clientcount,
                            "firstname": req.body.firstname,
                            "lastname": req.body.lastname,
                            "username": req.body.username,
                            "secondaryemail": req.body.secondaryemail,
                            "title": req.body.title,
                            "phone": req.body.phone,
                            "extphone": req.body.extphone,
                            "companyname": req.body.companyname,
                            "street": req.body.street,
                            "city": req.body.city,
                            "state": req.body.state,
                            "country": req.body.country,
                            "zip": req.body.zip,
                            "teammember": req.body.teammember,
                            "notes": req.body.notes,
                            "createddate": new Date(),
                            "updateddate": new Date(),
                            "isdeleted": "N",
                            "status": "Active",
                            "IPaddress": req.body.IPaddress,
                            "flagged": 0,
                            "orders": 0,
                            "lifetimespend": 0

                        }
                        client.save(clientCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save client" });
                            else {

                                return res.send({ "status": "Success", "message": "user added successfully", "clients": results, "messageCode": "107", "methodName": "Save client" });
                            }
                        });

                    }
                });
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save user" });
    }
});

//Get All client
router.route('/client/:status').get(function (req, res) {
    try {
        if (!req.params.status) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Get all client" });
        }
        else {
           
            client.find({ 'status': req.params.status }).sort({ createddate: -1 }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all client" });
                return res.send({ "status": "Success", "message": "client list", "client": result, "messageCode": "113", "methodName": "get all client" });
                });
           
        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all client" });
    }
});

//Update client status by id

router.route('/client/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update client by id" });
        }
        else {
            var clientid = parseInt(req.params.id);
            client.findOne({ '_id': clientid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update client by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "client not found with id" + clientid, "messageCode": "109", "methodName": "update client by id" });
                }
                else {
                    client.update({ '_id': clientid },
                        {
                            $set: {
                                "status": req.body.status
                               
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update client by id" });
                            else {
                                return res.send({ "status": "Success", "message": "client updated successfully", "messageCode": "106", "methodName": "client by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "client by id" });
    }
});

//Get client by id
router.route('/client/get/:id').get(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Get client by id" });
        }
        else {
            var clientid = parseInt(req.params.id);
            client.findOne({ '_id': clientid }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all client" });
                return res.send({ "status": "Success", "message": "client result", "client": result, "messageCode": "113", "methodName": "Get client by id" });
            });

        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "Get client by id" });
    }
});


//Update client by id

router.route('/client/updateclient/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update client by id" });
        }
        else {
            var clientid = parseInt(req.params.id);
            client.findOne({ '_id': clientid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update client by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "client not found with id" + clientid, "messageCode": "109", "methodName": "update client by id" });
                }
                else {
                    client.update({ '_id': clientid },
                        {
                            $set: {
                                "firstname": req.body.firstname,
                                "lastname": req.body.lastname,
                                "username": req.body.username,
                                "secondaryemail": req.body.secondaryemail,
                                "title": req.body.title,
                                "phone": req.body.phone,
                                "extphone": req.body.extphone,
                                "companyname": req.body.companyname,
                                "street": req.body.street,
                                "city": req.body.city,
                                "state": req.body.state,
                                "country": req.body.country,
                                "zip": req.body.zip,
                                "teammember": req.body.teammember,
                                "notes": req.body.notes,                                
                                "updateddate": new Date(),                                
                                "flagged": 0,
                                "orders": 0,
                                "lifetimespend": 0

                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update client by id" });
                            else {
                                return res.send({ "status": "Success", "message": "client updated successfully", "messageCode": "106", "methodName": "client by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "client by id" });
    }
});
module.exports = router;


