var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var GeneralSetting = db.collection('GeneralSetting');

// save setting key
router.route('/setting').post(function (req, res) {
    try{
    if (!req.body.key || !req.body.value) {
        return res.send({ "status": "Error", "message": "missing a parameter" });
    } 
    else {
        GeneralSetting.findOne({ 'key': req.body.key }, function (err, setting) {
            console.log(setting)
            if (!setting) {

                var settingcollection = {
                    key: req.body.key,
                    value: req.body.value
                }
                GeneralSetting.save(settingcollection, function (err, setting) {
               if (err) return res.send({ "message": err });
               else {
                   return res.send({ "status": "Success", "message": "Setting saved successfully" });
               }
           });

            }
            else {
                return res.send({ "status": "Error", "message": "Setting already exist with this setting key: " + req.body.key });
            }
        });

    }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});

// update setting by key
router.route('/settings/:key').put(function (req, res) {
    try {
        if (!req.params.key || !req.body.value) {
            return res.send({ "status": "Error", "message": "missing a parameter" });
        }
        else {
            GeneralSetting.findOne({ 'key':req.params.key }, function (err, setting) {
                if (!setting) {
                    return res.send({ "status": "Error", "message": "setting not found by setting key" });
                }
                else {
                    GeneralSetting.update({ 'key': req.params.key }, { $set: { value: req.body.value } }, function (err, results) {
                                if (err) return res.send({ "status": "Error", "message": err });
                                else {
                                    return res.send({ "status": "Success", "message": "Setting updated successfully", "results": results });
                                }
                            });
                        }
            });
        }
    }
    catch (err) {
        return res.send({ "status": "Error", "message": "System Error" ,"Error":err});
    }
});

// delete setting by key
router.route('/settings/:key').delete(function (req, res) {
    try {
        if (!req.params.key) {
            return res.send({ "status": "Error", "message": "missing a parameter" });
        }
        else {
            GeneralSetting.findOne({ 'key': req.params.key }, function (err, setting) {
                if (!setting) {
                    return res.send({ "status": "Error", "message": "Setting not found by setting key" });
                }
                else {

                    GeneralSetting.remove({ 'key': req.params.key }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err });
                        else {
                            return res.send({ "status": "Success", "message": "Setting deleted successfully", "results": results });
                        }
                    });
                }
            });
        }
    }
    catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "Error": err });
    }
});

// get all setting
router.route('/settings').get(function (req, res) {
    try {
        GeneralSetting.find(function (err, setting) {
            if (err) return res.send({ "status": "Error", "message": err });
            return res.send({ "status": "Success", "message": "GeneralSetting list", "GeneralSettings": setting });
        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});

// get setting by setting key
router.route('/settings/:key').get(function (req, res) {
    try
    {
    if (!req.params.key) {
        return res.send({ "status": "Error", "message": "missing a parameter", "key": req.params.key });
    }
    GeneralSetting.findOne({ 'key': req.params.key }, function (err, setting) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!setting) {
            return res.send({ "status": "Error", "message": "Setting key not found" });
        }
        else {
            return res.send({ "status": "Success", "message": "Setting found by setting key", "settings": setting });
        }

    });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});
module.exports = router;