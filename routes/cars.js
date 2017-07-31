var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var Car = db.collection('Car');
var Model = db.collection('Model');
var Manufacturer = db.collection('Manufacturer');
var User = db.collection('User');
var ObjectId = require('mongojs').ObjectID;
 

// Save car
router.route('/car').post(function (req, res) {
    try {
        if (!req.body.modelYear || !req.body.manufacturerId || !req.body.userId || !req.body.modelId || !req.body.kilometerTravelled) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save car" });
        }
        else {
            User.findOne({ '_id': new ObjectId(req.body.userId), 'isDeleted': false }, function (err, user) {
                if (!user) {
                    return res.send({ "status": "Error", "message": "user not found.", "messageCode": "109", "methodName": "Save car" });
                }
                else {
                    Manufacturer.findOne({ '_id': new ObjectId(req.body.manufacturerId), 'isDeleted': false }, function (err, manufacturer) {
                        if (!manufacturer) {
                            return res.send({ "status": "Error", "message": "Manufacturer not found.", "messageCode": "109", "methodName": "Save car" });
                        }
                        else {
                            Model.findOne({ '_id': new ObjectId(req.body.modelId), 'isDeleted': false }, function (err, model) {
                                if (!model) {
                                    return res.send({ "status": "Error", "message": "Model not found.", "messageCode": "103", "methodName": "Save car" });
                                }
                                else {
                                    var carCollection = {
                                        userId: user._id,
                                        userName: user.name,
                                        manufacturerId: manufacturer._id,
                                        manufacturerName: manufacturer.name,
                                        imagePath:manufacturer.imagePath,
                                        modelId: model._id,
                                        modelName: model.name,
                                        modelYear: req.body.modelYear,
                                        kilometerTravelled: req.body.kilometerTravelled,
                                        createdDate: new Date(),
                                        modifiedDate: new Date(),
                                        isDeleted: false
                                    }
                                    Car.save(carCollection, function (err, results) {
                                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save car" });
                                        else {
                                            return res.send({ "status": "Success", "message": "Car added successfully", "results": results, "messageCode": "107", "methodName": "Save car" });
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
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Save car" });
    }
});

// get all cars
router.route('/cars').get(function (req, res) {
    try {
        Car.find({ 'isDeleted': false }, function (err, cars) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all cars" });
            return res.send({ "status": "Success", "message": "cars list", "cars": cars, "messageCode": "113", "methodName": "get all cars" });
        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "get all cars" });
    }
});



 //delete car by id
router.route('/car/:id').delete(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id, "messageCode": "100", "methodName": "delete car by id" });
        }
        else {
            Car.findOne({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, function (err, car) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete car by id" });
                if (!car) {
                    return res.send({ "status": "Error", "message": "car not found", "car": car, "messageCode": "109", "methodName": "delete car by id" });
                }
                else {
                    Car.update({ '_id': new ObjectId(req.params.id), 'isDeleted': false }, { $set: { 'isDeleted': true } }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "delete car by id" });
                        else {
                            return res.send({ "status": "Success", "message": "Car deleted successfully", "results": results, "messageCode": "105", "methodName": "delete car by id" });
                        }
                    });
                }
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "delete car by id" });
    }
});


module.exports = router;