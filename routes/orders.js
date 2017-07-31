var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var orders = db.collection('orders');
var async = require('async');
var tasks = db.collection('tasks');
var items = db.collection('items');
var user = db.collection('user');
var reasonreopen = db.collection('reasonreopen');

// get all orders
router.route('/orders/:status').get(function (req, res) {

    try {
        orders.find({ 'status': (req.params.status), 'isdeleted': false }).sort({ orderdate: -1 }, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all orders by  status" });
            else {
                return res.send({ "status": "Success", "message": "Orders list", "Orders": result, "messageCode": "116", "methodName": "get all orders by  status" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all orders by  status" });
    }
});

//Update status
router.route('/orders/status/:id').post(function (req, res) {

    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update order by id" });
        }
        else {
            orders.findOne({ '_id': req.params.id }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update order by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "order not found with order id", "messageCode": "109", "methodName": "update order by id" });
                }
                else {
                    orders.update({ '_id': req.params.id },
                        {
                            $set: {
                                status: req.body.status,
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update order by id" });
                            else {
                                return res.send({ "status": "Success", "message": "order updated successfully", "messageCode": "106", "methodName": "update order by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  " + err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "update order by id" });
    }
});

// get all orders by client ID
router.route('/orders/:status/:clientID').get(function (req, res) {

    try {
        if (!req.params.clientID || !req.params.status) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Get orders by client id" });
        }
        else {
            orders.find({ 'status': req.params.status, 'clientid': parseInt(req.params.clientID), 'isdeleted': false }).sort({ orderdate: -1 }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Get orders by client id" });
                else {
                    return res.send({ "status": "Success", "message": "Orders list", "Orders": result, "messageCode": "116", "methodName": "Get orders by client id" });
                }
            });
        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "Get orders by client id" });
    }
});


// get all items by order id and client id
router.route('/items/:OrderId/:clientID').get(function (req, res) {

    try {
        if (!req.params.clientID || !req.params.OrderId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Get Items by client id and order id" });
        }
        else {
            items.find({ 'orderId': req.params.OrderId, 'clientId': parseInt(req.params.clientID), 'isdeleted': false }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Get Items by client id and order id" });
                else {
                    return res.send({ "status": "Success", "message": "Items list", "items": result, "messageCode": "116", "methodName": "Get Items by client id and order id" });
                }
            });
        }
    } catch (err) {

        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "Get Items by client id and order id" });
    }
});


// Update status of items by item id
router.route('/items/:ItemId').post(function (req, res) {
    try {
        if (!req.params.ItemId && !req.body.status) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Update status of items by item id" });
        }
        else {
            items.findOne({ '_id': parseInt(req.params.ItemId) }, function (err, itemsrecord) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update status of items by item id" });
                if (!itemsrecord) {
                    return res.send({ "status": "Error", "message": "item not found with item id " + req.params.ItemId, "messageCode": "109", "methodName": "Update status of items by item id" });
                }
                else {
                    items.update({ '_id': parseInt(req.params.ItemId) },
                        {
                            $set: {
                                status: req.body.status,
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update status of items by item id" });
                            else {
                                return res.send({ "status": "Success", "message": "order updated successfully", "messageCode": "106", "methodName": "Update status of items by item id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  " + err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "Update status of items by item id" });
    }
});


// get item by Item ID
router.route('/itemdetail/:ItemId').get(function (req, res) {

    try {
        if (!req.params.ItemId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "get item by Item ID" });
        }
        else {
            items.findOne({ '_id': parseInt(req.params.ItemId), 'isdeleted': false }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get item by Item ID" });
                else {
                    return res.send({ "status": "Success", "message": "Item", "items": result, "messageCode": "116", "methodName": "get item by Item ID" });
                }
            });
        }
    } catch (err) {

        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get item by Item ID" });
    }
});

// get writers by tags assinged to them
router.route('/userbytags/:tagname').get(function (req, res) {

    try {
        if (!req.params.tagname) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "get writers by tags name" });
        }
        else {
            console.log('Tag name ' + req.params.tagname);
            user.find(
                {
                    'roles.role': 'Writer',
                    'isdeleted': 'N',
                    //'categoriestags': { $elemMatch: { 'tags': { $all: [{ 'name': req.params.tagname }] } }},
                    'categoriestags.tags.name': req.params.tagname
                }, function (err, result) {
                    console.log('Error----' + err);
                    console.log('result----' + result);
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get writers by tags name" });
                    else {
                        return res.send({ "status": "Success", "message": "Item", "items": result, "messageCode": "116", "methodName": "get writers by tags name" });
                    }
                });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get writers by tags name" });
    }
});



// get all reasonreopen
router.route('/reasonreopen').get(function (req, res) {

    try {
        reasonreopen.find({}, function (err, result) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all reasons" });
            else {
                return res.send({ "status": "Success", "message": "reasons list", "Reasons": result, "messageCode": "116", "methodName": "get all reasons" });
            }
        });
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all reasons" });
    }
});


// Update item table assign tasks
router.route('/itemsassign/:ItemId').post(function (req, res) {
    try {
        if (!req.params.ItemId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Update items of task assigned" });
        }
        else {
            items.findOne({ '_id': parseInt(req.params.ItemId) }, function (err, itemsrecord) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                if (!itemsrecord) {
                    return res.send({ "status": "Error", "message": "item not found with item id " + req.params.ItemId, "messageCode": "109", "methodName": "Update items of task assigned" });
                }
                else {
                    items.update({ '_id': parseInt(req.params.ItemId) },
                        {
                            $set: {
                                totalassigntasks: req.body.totalassigntasks,
                                writers: req.body.writers,
                                status: "Assigned"
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                            else {
                                orders.update({ '_id': req.body.orderID, "items.id": parseInt(req.params.ItemId) },
                                     {
                                         $set: {
                                             "items.$.totalassigntasks": req.body.totalassigntasks,
                                         }
                                     }, function (err, results) {
                                         if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                                         else {
                                             return res.send({ "status": "Success", "message": "Task assign successfully", "messageCode": "106", "methodName": "Update items of task assigned" });
                                             //user.update({ '_id': parseInt(req.body.userid) },
                                             //    {
                                             //        $set: {
                                             //            "items.$.totalassigntasks": req.body.totalassigntasks,
                                             //        }
                                             //    }, function (err, results) {
                                             //        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                                             //        else {
                                             //            return res.send({ "status": "Success", "message": "Task assign successfully", "messageCode": "106", "methodName": "Update items of task assigned" });
                                             //        }
                                             //    });
                                         }
                                     });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  " + err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "Update items of task assigned" });
    }
});

// Update item table assign tasks
router.route('/itemsassigndesingers/:ItemId').post(function (req, res) {
    try {
        if (!req.params.ItemId) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Update items of task assigned" });
        }
        else {
            items.findOne({ '_id': parseInt(req.params.ItemId) }, function (err, itemsrecord) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                if (!itemsrecord) {
                    return res.send({ "status": "Error", "message": "item not found with item id " + req.params.ItemId, "messageCode": "109", "methodName": "Update items of task assigned" });
                }
                else {
                    items.update({ '_id': parseInt(req.params.ItemId) },
                        {
                            $set: {
                                totalassigntasks: req.body.totalassigntasks,
                                designers: req.body.designers,
                                status: "Assigned"
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                            else {
                                orders.update({ '_id': req.body.orderID, "items.id": parseInt(req.params.ItemId) },
                                     {
                                         $set: {
                                             "items.$.totalassigntasks": req.body.totalassigntasks,
                                         }
                                     }, function (err, results) {
                                         if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                                         else {
                                             return res.send({ "status": "Success", "message": "Task assign successfully", "messageCode": "106", "methodName": "Update items of task assigned" });
                                             //user.update({ '_id': parseInt(req.body.userid) },
                                             //    {
                                             //        $set: {
                                             //            "items.$.totalassigntasks": req.body.totalassigntasks,
                                             //        }
                                             //    }, function (err, results) {
                                             //        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update items of task assigned" });
                                             //        else {
                                             //            return res.send({ "status": "Success", "message": "Task assign successfully", "messageCode": "106", "methodName": "Update items of task assigned" });
                                             //        }
                                             //    });
                                         }
                                     });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  " + err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "Update items of task assigned" });
    }
});

// Update status of items by item id to reassign with reason and thier description
router.route('/itemsreassign/:ItemId').post(function (req, res) {
    try {
        if (!req.params.ItemId && !req.body.status) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Update status of items by item id" });
        }
        else {
            items.findOne({ '_id': parseInt(req.params.ItemId) }, function (err, itemsrecord) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update status of items by item id" });
                if (!itemsrecord) {
                    return res.send({ "status": "Error", "message": "item not found with item id " + req.params.ItemId, "messageCode": "109", "methodName": "Update status of items by item id" });
                }
                else {
                    items.update({ '_id': parseInt(req.params.ItemId) },
                        {
                            $set: {
                                status: req.body.status,
                                reasonforreopen: req.body.reasonforreopen,
                                reasondesc: req.body.reasondesc
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Update status of items by item id" });
                            else {
                                return res.send({ "status": "Success", "message": "order updated successfully", "messageCode": "106", "methodName": "Update status of items by item id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  " + err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "Update status of items by item id" });
    }
});


module.exports = router;