var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var ObjectId = require('mongojs').ObjectID;
var async = require('async');
var tags = db.collection('tags');

//get tags all by status
router.route('/tags/:status').get(function (req, res) {
    try {        
        tags.find({ "status": req.params.status, "isused": false,"isdeleted":"N" }).sort({ createon: -1 }, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tags" });
            return res.send({ "status": "Success", "message": "tags list", "tags": result, "messageCode": "113", "methodName": "get all tags" });
            });
        
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all tags" });
    }
});
router.route('/tagsall/:status').get(function (req, res) {
    try {
        tags.find({ "status": req.params.status,"isdeleted":"N"}).sort({ createon: -1 }, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tags" });
            return res.send({ "status": "Success", "message": "tags list", "tags": result, "messageCode": "113", "methodName": "get all tags" });
        });

    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all tags" });
    }
});
//get tags all by status
router.route('/tagsshhowall/:status').get(function (req, res) {
    try {
        tags.find({ "status": req.params.status,"isdeleted":"N" }).sort({ name: 1 }, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tags" });
            return res.send({ "status": "Success", "message": "tags list", "tags": result, "messageCode": "113", "methodName": "get all tags" });
        });

    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all tags" });
    }
});

//Add user by id

router.route('/tags/adduser/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "add user in tags by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            console.log(req.body.users.id);
            tags.findOne({ '_id': styleid }, function (err, styledata) {
                console.log(styledata);
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "add user in tags by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "user already exist", "messageCode": "109", "methodName": "add user in tags by id" });
                }
                else {
                    
                    tags.update({ '_id': styleid },
                        {
                            $push: { "users": req.body.users }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "add user in tags by id" });
                            else {
                                return res.send({ "status": "Success", "message": "tags updated successfully", "messageCode": "106", "methodName": "add user in tags id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "add user in tags by id" });
    }
});

//Remove user by id

router.route('/tags/removeuser/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update style by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            tags.findOne({ '_id': styleid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {

                    tags.update({ '_id': styleid },
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

//Remove users by catid from tags table

router.route('/tags/removetag/:catid').post(function (req, res) {
    try {
        if (!req.params.catid) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Remove users by category id" });
        }
        else {
            var ctid = parseInt(req.params.catid);
            tags.find({ 'catid': ctid }, function (err, tagsdata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Remove users by category id" });
                if (!tagsdata) {
                    return res.send({ "status": "Error", "message": "style not found with id", "messageCode": "109", "methodName": "Remove users by category id" });
                }
                else {
                    var tagid = parseInt(tagsdata._id);
                    tags.update({ '_id': tagid },
                        {
                            $set: {
                                'users': {},
                                'catid':""
                            }

                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Remove users by category id" });
                            else {
                                return res.send({ "status": "Success", "message": "Remove users by category successfully done", "messageCode": "106", "methodName": "Remove users by category id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Remove users by category id" });
    }
});

// Save style
router.route('/tags/save').post(function (req, res) {
    try {
        if (!req.body.name) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save tags" });
        }
        else {

            tags.findOne({ 'name': req.body.name }, function (err, categoriesresult) {
                if (categoriesresult) {
                    return res.send({ "status": "Error", "message": "tag already exist.", "messageCode": "109", "methodName": "Save tags" });
                }
                else {
                    tags.find().count(function (err, categoriescount) {
                        console.log(categoriescount);
                        categoriescount = categoriescount + 1;
                        console.log(categoriescount);
                        var categoriesCollection = {
                            '_id': categoriescount,
                            "name": req.body.name,
                            "createon": new Date(),
                            "isdeleted": "N",
                            "status": 'Active',
                            "isused": false,
                            "users": []                       

                        }
                        tags.save(categoriesCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save tags" });
                            else {

                                return res.send({ "status": "Success", "message": "tag added successfully", "results": results, "messageCode": "107", "methodName": "Save tags" });
                            }
                        });
                    });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save tags" });
    }
});


//tag update by id

router.route('/tags/addcat/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "add user in tags by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            
            tags.findOne({ '_id': styleid }, function (err, styledata) {
                console.log(styledata);
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "add user in tags by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "user already exist", "messageCode": "109", "methodName": "add user in tags by id" });
                }
                else {

                    tags.update({ '_id': styleid },
                        {
                            $set: { "catid": req.body.catid }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "add user in tags by id" });
                            else {
                                return res.send({ "status": "Success", "message": "tags updated successfully", "messageCode": "106", "methodName": "add user in tags id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "add user in tags by id" });
    }
});
module.exports = router;