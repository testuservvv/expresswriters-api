var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var Manufacturer = db.collection('Manufacturer');
var ObjectId = require('mongojs').ObjectID;
 


// Save manufacturer by
router.route('/manufacturer').post(function (req, res) {
    try {
        if (!req.body.name) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save manufacturer by" });
        }

        Manufacturer.findOne({'name': req.body.name, 'isDeleted': false}, function (err, manufacturer) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save Manufacturer by" });
            if (manufacturer) {
                return res.send({ "status": "Error", "message": "Manufacturer already exist.", "messageCode": "103", "methodName": "Save Manufacturer by" });
            }
            else {
                Manufacturer.save({ name: req.body.name, description: req.body.description, imagePath: req.body.imagePath, isDeleted: false,createdDate: new Date(), modifiedDate: new Date() }, function (err, results) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save Manufacturer by" });
                    else {
                        return res.send({ "status": "Success", "message": "Manufacturer saved successfully", "messageCode": "107", "methodName": "Save Manufacturer by" });
                    }
                });
            }

        });

    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Save Manufacturer by" });
    }
});

// update Manufacturer by id
router.route('/manufacturer/:id').put(function (req, res) {
    try {
        if (!req.params.id || !req.body.name) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update Manufacturer by id" });
        }
        else {
            Manufacturer.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update Manufacturer by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "Manufacturer not found with manufacturer id", "messageCode": "109", "methodName": "update Manufacturer by id" });
                }
                else {
                    Manufacturer.findOne({ 'name': req.body.name, 'isDeleted': false, modifiedDate: new Date() }, function (err, manufacturer) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update Manufacturer by id" });
                        if (manufacturer && manufacturer._id != req.params.id) {
                            return res.send({ "status": "Error", "message": "Manufacturer already exist with this name.", "messageCode": "104", "methodName": "update Manufacturer by id" });
                        }
                        else {
                            Manufacturer.update({ '_id': new ObjectId(req.params.id) }, { $set: { name: req.body.name, description: req.body.description } }, function (err, results) {
                                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update Manufacturer by id" });
                                else {
                                    return res.send({ "status": "Success", "message": "Manufacturer updated successfully", "messageCode": "106", "methodName": "update Manufacturer by id" });
                                }
                            });
                        }
                    });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "update Manufacturer by id" });
    }
});

// get all Manufacturers
router.route('/manufacturers').get(function (req, res) {
    try {
        Manufacturer.find({ 'isDeleted': false }, function (err, manufacturer) {
	if (err) return res.send({ "status": "Error","message": err, "messageCode": "101","methodName":"get all Manufacturers" });
	return res.send({ "status": "Success", "message": "Manufacturer list", "Manufacturers": manufacturer, "messageCode": "113", "methodName": "get all Manufacturers" });
    });
    }catch (err) {
        return res.send({ "status": "Error", "message": "System Error","messageCode": "102" ,"methodName":"get all Manufacturers" });
    }
}); 


// get Manufacturer by id
router.route('/manufacturer/:id').get(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "get Manufacturer by id" });
        }
        Manufacturer.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, manufacturer) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get Manufacturer by id" });
            if (!manufacturer) {
                return res.send({ "status": "Error", "message": "Manufacturer not found", "messageCode": "109", "methodName": "get Manufacturer by id" });
            }
            else {
                return res.send({ "status": "Success", "message": "Manufacturer found by manufacturer id", "Manufacturer": manufacturer, "messageCode": "110", "methodName": "get Manufacturer by id" });
            }

        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get Manufacturer by id" });
    }
});

// delete Manufacturer by id
router.route('/manufacturer/:id').delete(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "delete Manufacturer by id" });
        }
        Manufacturer.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, manufacturer) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete Manufacturer by id" });
            if (!manufacturer) {
                return res.send({ "status": "Error", "message": "manufacturer not found", "manufacturer": manufacturer, "messageCode": "109", "methodName": "delete Manufacturer by id" });
            }
            else {
                Model.find({ 'manufacturerId': req.params.id, 'isDeleted': false }, function (err, model) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete Manufacturer by id" });
                    if (model.length > 0) {
                        return res.send({ "status": "Error", "message": "You can't delete this manufacturer because there are model(s) exists in this manufacturer", "messageCode": "109", "methodName": "delete Manufacturer by id" });
                    }
                    else {

                        Manufacturer.update({ '_id': new ObjectId(req.params.id) }, { $set: { 'isDeleted': true } }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete Manufacturer by id" });
                            else {
                                return res.send({ "status": "Success", "message": "Manufacturer deleted successfully", "messageCode": "105", "methodName": "delete Manufacturer by id" });
                            }
                        });
                    }

                });

            }
        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "delete Manufacturer by id" });
    }
});


module.exports = router;