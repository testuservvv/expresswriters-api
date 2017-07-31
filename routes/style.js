var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var style = db.collection('styles');

var ObjectId = mongojs.ObjectID;
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------


// Save style
router.route('/style').post(function (req, res) {
    try {
        if (!req.body.stylename ) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save User" });
        }
        else {

            style.findOne({ 'stylename': req.body.stylename }, function (err, styleresult) {
                if (styleresult) {
                    return res.send({ "status": "Error", "message": "style already exist.", "messageCode": "109", "methodName": "Save style" });
                }
                else {
                    style.find().count(function (err, stylecount) {
                        console.log(stylecount);
                        stylecount = stylecount + 1;
                        console.log(stylecount);
                        var styleCollection = {
                            '_id': stylecount,                           
                            "stylename": req.body.stylename,
                            "createon": new Date(),
                            "Isdeleted": "N",
                            "users": [],
                            "status":false,
                            "createdby": req.body.createdby
                        }
                        style.save(styleCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save style" });
                            else {
                               
                                return res.send({ "status": "Success", "message": "style added successfully", "results": results, "messageCode": "107", "methodName": "Save style" });
                            }
                        });
                    });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save style" });
    }
});

//Delete style by id

router.route('/style/delete/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Delete style by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            style.findOne({ '_id': styleid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Delete style by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "Delete style by id" });
                }
                else {
                    style.remove({ '_id': styleid },
                        {
                           
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Delete style by id" });
                            else {
                                return res.send({ "status": "Success", "message": "style Delete successfully", "messageCode": "106", "methodName": "Delete style by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Delete style by id" });
    }
});

//Get All style
router.route('/style/all').get(function (req, res) {
    try {       
        style.find({ 'Isdeleted': 'N' }).sort({ createon: -1 }, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all styles" });
            return res.send({ "status": "Success", "message": "styles list", "style": result, "messageCode": "113", "methodName": "get all styles" });
                });
           
       
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all styles" });
    }
});

//Update style by id

router.route('/style/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update style by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            style.findOne({ '_id': styleid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                    var sts = true;
                    if (styledata.status == true)
                    {
                        sts = false;
                    }
                    style.update({ '_id': styleid },
                        {
                            $set: {
                                "status": sts,
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                            else {
                                return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});

//Add user by id

router.route('/style/adduser/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update style by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            style.findOne({ '_id': styleid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                   
                    style.update({ '_id': styleid },
                        {
                            $push: { "users": req.body.users }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                            else {
                                return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});

//Remove user by id

router.route('/style/removeuser/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update style by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            style.findOne({ '_id': styleid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {

                    style.update({ '_id': styleid },
                        {
                            $pull: { "users": { 'id': req.body.writerid } }
                              
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                            else {
                                return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});

//
module.exports = router;


