var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);

var Model = db.collection('Model');
var Manufacturer = db.collection('Manufacturer');
var categories = db.collection('categories');
var tags = db.collection('tags');
var ObjectId = require('mongojs').ObjectID;


// get all services
router.route('/categories').get(function (req, res) {
    try {
        categories.find({ 'isdeleted': 'N' }).sort({ createon: -1 }, function (err, categories) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all categories" });
            return res.send({ "status": "Success", "message": "services list", "categories": categories, "messageCode": "113", "methodName": "get all categories" });
        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get all categories" });
    }
});
// Save style
router.route('/categories/save').post(function (req, res) {
    try {
        if (!req.body.name) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save categories" });
        }
        else {

            categories.findOne({ 'name': req.body.name }, function (err, categoriesresult) {
                if (categoriesresult) {
                    return res.send({ "status": "Error", "message": "category already exist.", "messageCode": "109", "methodName": "Save categories" });
                }
                else {
                    categories.find().count(function (err, categoriescount) {
                        console.log(categoriescount);
                        categoriescount = categoriescount + 1;
                        console.log(categoriescount);
                        var categoriesCollection = {
                            '_id': categoriescount,
                            "name": req.body.name,
                            "createon": new Date(),
                            "isdeleted": "N",
                            "status": false,
                            "tags": [],
                            "createby": req.body.createdby,

                        }
                        categories.save(categoriesCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save categories" });
                            else {

                                return res.send({ "status": "Success", "message": "category added successfully", "results": results, "messageCode": "107", "methodName": "Save categories" });
                            }
                        });
                    });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save categories" });
    }
});

//Update style by id

router.route('/categories/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update category by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            categories.findOne({ '_id': styleid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "Category not found with id", "messageCode": "109", "methodName": "update category by id" });
                }
                else {
                    var sts = true;
                    if (styledata.status == true) {
                        sts = false;
                    }
                    categories.update({ '_id': styleid },
                        {
                            $set: {
                                "status": sts,
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                            else {
                                return res.send({ "status": "Success", "message": "category updated successfully", "messageCode": "106", "methodName": "category by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "category by id" });
    }
});
//Delete style by id

router.route('/categories/delete/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Delete category by id" });
        }
        else {
            var styleid = parseInt(req.params.id);
            categories.findOne({ '_id': styleid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Delete category by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "category not found with id", "messageCode": "109", "methodName": "Delete category by id" });
                }
                else {
                    categories.remove({ '_id': styleid },
                        {

                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Delete category by id" });
                            else {
                                return res.send({ "status": "Success", "message": "category Delete successfully", "messageCode": "106", "methodName": "Delete category by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Delete category by id" });
    }
});

//Add tags by id

router.route('/categories/addtag/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update category by id" });
        }
        else {
            var categoryid = parseInt(req.params.id);
            categories.findOne({ '_id': categoryid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "category not found with id", "messageCode": "109", "methodName": "update category by id" });
                }
                else {

                    categories.update({ '_id': categoryid },
                        {
                            $push: { "tags": req.body.tags }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                            else {
                                var tagid = parseInt(req.body.tags.id);
                                console.log(tagid);
                                tags.update({ '_id': tagid },
                                 {
                                     $set: { "isused": true }
                                }, function (err, re) {
                                 if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                                else {
                               return res.send({ "status": "Success", "message": "category updated successfully", "messageCode": "106", "methodName": "category by id" });
                                }
                                });
                                //return res.send({ "status": "Success", "message": "category updated successfully", "messageCode": "106", "methodName": "category by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "category by id" });
    }
});

//Remove tag by id

router.route('/categories/removetag/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update categories by id" });
        }
        else {
            var categoryid = parseInt(req.params.id);
            categories.findOne({ '_id': categoryid }, function (err, styledata) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update categories by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "categories not found with id", "messageCode": "109", "methodName": "update categories by id" });
                }
                else {

                    categories.update({ '_id': categoryid },
                        {
                            $pull: { "tags": { 'id': req.body.tagid } }

                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update categories by id" });
                            else {
                                var tagid = parseInt(req.body.tagid);
                                console.log(tagid);
                                tags.update({ '_id': tagid },
                                 {
                                     $set: { "isused": false, "isdeleted":'Y' }
                                 }, function (err, re) {
                                     if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update category by id" });
                                     else {
                                         return res.send({ "status": "Success", "message": "category updated successfully", "messageCode": "106", "methodName": "category by id" });
                                     }
                                 });
                               // return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "categories by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "categories by id" });
    }
});

//Update tag by id

router.route('/categories/tag/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update categories by id" });
        }
        else {
            var categoryid = parseInt(req.params.id);
            categories.findOne({ '_id': categoryid, 'tags.id': req.body.tagid }, function (err, styledata) {
                console.log(styledata);
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update categories by id" });
                if (!styledata) {
                    return res.send({ "status": "Error", "message": "categories not found with id", "messageCode": "109", "methodName": "update categories by id" });
                }
                else {

                    categories.update({ '_id': categoryid, "tags.id": req.body.tagid },
                        {
                            $set: { 'tags.$.status': 'Active' }

                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update categories by id" });
                            else {
                                return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "categories by id" });
                            }
                        });

                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "categories by id" });
    }
});
module.exports = router;