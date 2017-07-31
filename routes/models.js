var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var Model = db.collection('Model');
var Manufacturer = db.collection('Manufacturer');
var ObjectId = require('mongojs').ObjectID;
 

// Save model
router.route('/model').post(function (req, res) {
    try {
        if (!req.body.name || !req.body.description || !req.body.manufacturerId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save model" });
        }
        else {
            Manufacturer.findOne({ '_id': new ObjectId(req.body.manufacturerId), 'isDeleted': false }, function (err, manufacturer) {
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "Manufacturer not found.", "manufacturerId": req.body.manufacturerId, "messageCode": "109", "methodName": "Save model" });
                }
                else {
                    Model.findOne({ 'name': req.body.name, 'manufacturerId': req.body.manufacturerId, 'isDeleted': false }, function (err, model) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save model" });
                        if (model) {
                            return res.send({ "status": "Error", "message": "model already exits.", "messageCode": "103", "methodName": "Save model" });
                                }
                                else {
                                    var modelCollection = {
                                        name: req.body.name,
                                        description: req.body.description,
                                        manufacturerId: manufacturer._id,
                                        manufacturerName: manufacturer.name,
                                        createdBy: req.body.createdBy,
                                        createdDate: new Date(),
                                        modifiedBy: req.body.createdBy,
                                        modifiedDate: new Date(),
                                        isDeleted: false
                                    }
                                    Model.save(modelCollection, function (err, results) {
                                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save model" });
                                        else {
                                            return res.send({ "status": "Success", "message": "Model saved successfully", "results": results, "messageCode": "107", "methodName": "Save model" });
                                        }
                                    });
                                }

                            });
                        } 
                    });

                 };
       
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Save model" });
    }
});

// update model by id
router.route('/model/:id').put(function (req, res) {
    try {
        if (!req.params.id || !req.body.name || !req.body.description || !req.body.manufacturerId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update model by id" });
        }
        else {
            Model.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, model) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update model by id" });
                if (!model) {
                    return res.send({ "status": "Error", "message": "Model not found with model id", "messageCode": "109", "methodName": "update model by id" });
                }
                else {
                    Manufacturer.findOne({ '_id': new ObjectId(req.body.manufacturerId), 'isDeleted': false }, function (err, manufacturer) {
                        if (!manufacturer) {
                            return res.send({ "status": "Error", "message": "Manufacturer not found.", "manufacturerId": req.body.manufacturerId, "messageCode": "109", "methodName": "update model by id" });
                        }
                        else {

                            Model.findOne({ 'name': req.body.name, 'manufacturerId': req.body.manufacturerId, 'isDeleted': false }, function (err, model) {
                               if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update model by id" });
                                if (model && model._id != req.params.id) {
                                    return res.send({ "status": "Error", "message": "model already exits with name '" + req.body.name + "'", "messageCode": "104", "methodName": "update model by id" });
                                }
                                else {
                                    var modelCollection = {
                                        name: req.body.name,
                                        description: req.body.description,
                                        manufacturerId: manufacturer._id,
                                        manufacturerName: manufacturer.name,                                                                             
                                        modifiedBy: req.body.modifiedBy,
                                        modifiedDate: new Date(),
                                    }
                                    Model.update({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, { $set: modelCollection }, function (err, results) {
                                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update model by id" });
                                        else {
                                            return res.send({ "status": "Success", "message": "Model updated successfully", "results": results, "messageCode": "106", "methodName": "update model by id" });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "update model by id" });
    }
});

// get all models
router.route('/models').get(function (req, res) {
    try {
        Model.find({ 'isDeleted': false }).sort({ 'createdDate': -1 }, function (err, models) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all models" });
            return res.send({ "status": "Success", "message": "model list", "models": models, "messageCode": "113", "methodName": "get all models" });
    });
    }catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get all models" });
    }
});

// get  models by manufacturer
router.route('/modelsByManufacturer/:id').get(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "get model by id" });
        }
        else {
            Model.find({ 'isDeleted': false, 'manufacturerId': new ObjectId(req.params.id) }).sort({ 'createdDate': -1 }, function (err, models) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all models" });
                return res.send({ "status": "Success", "message": "model list", "models": models, "messageCode": "113", "methodName": "get all models" });
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get all models" });
    }
});


// get model by id
router.route('/model/:id').get(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "get model by id" });
        }
        else {
            Model.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, model) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get model by id" });
                if (!model) {
                    return res.send({ "status": "Error", "message": "model not found", "messageCode": "109", "methodName": "get model by id" });
                }
                else {
                    return res.send({ "status": "Success", "message": "model found by  id", "model": model, "messageCode": "110", "methodName": "get model by id" });
                }

            });
        }
    }catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get model by id" });
    }
});




// delete model by id
router.route('/model/:id').delete(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "delete model by id" });
        }
        else {
            Model.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, model) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete model by id" });
                if (!model) {
                    return res.send({ "status": "Error", "message": "Model not found", "model": model, "messageCode": "109", "methodName": "delete model by id" });
                }
                else {
                    Model.update({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, { $set: { 'isDeleted': true } }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete model by id" });
                        else {
                            return res.send({ "status": "Success", "message": "Model deleted successfully", "results": results, "messageCode": "105", "methodName": "delete model by id" });
                        }
                    });
                }
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "delete model by id" });
    }
});


module.exports = router;