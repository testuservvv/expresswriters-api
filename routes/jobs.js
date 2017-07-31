var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var jobs = db.collection('jobs');
var applicanttests = db.collection('applicanttests');
var multer = require('multer')
var async = require('async');
//var upload = multer({ dest: 'uploads/' })
var crypto = require("crypto");
var ObjectId = require('mongojs').ObjectID;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname);
    }
});
var upload = multer({ storage: storage });



// get all Jobs
router.route('/jobs/:status').get(function (req, res) {

    try {
        jobs.find({ 'status': (req.params.status) }).sort({ createddate: -1 }, function (err, result) {
            console.log(result);
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all jobs" });
            var count = 1;
            if (result.length>0) {
                 async.forEach(result, function (item) {

                applicanttests.find({ 'jobid': (item._id).toString() }).count(function (err, appcount) {

                    item.Applicants = appcount;
                    console.log(item._id + '----' + appcount);
                    //  console.log(appcount);
                    //  console.log(item.Applicants);


                    if (result.length == count) {
                        // result = result;
                        // 
                        console.log("DON");
                        // callback();
                        // callback(null)
                        return res.send({ "status": "Success", "message": "jobs list", "jobs": result, "messageCode": "113", "methodName": "get all jobs" });
                    }
                    count++;
                });
                //questionwi.find({ 'testid': (item._id).toString() }).count(function (err, queswi) {

                //});
                //console.log(item);


            }, function (err) {
                console.log(err);


            });
            }
            else {
                return res.send({ "status": "Success", "message": "jobs list", "jobs": result, "messageCode": "113", "methodName": "get all jobs" });
            }
           
           // 
        });
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all jobs" });
    }
});

// get jobs by id
router.route('/jobs/id/:id').get(function (req, res) {
    if (!req.params.id) {
        return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id });
    }
    jobs.findOne({ '_id': new ObjectId(req.params.id) }, function (err, result) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!result) {
            return res.send({ "status": "Error", "message": "job not found" });
        }
        else {
            return res.send({ "status": "Success", "message": "jobs found by user id", "user": result });
        }

    });
});

// Save jobs
router.route('/jobs').post(function (req, res) {
    try {
        if (!req.body.jobname || !req.body.availibility || !req.body.status || !req.body.mincompensation || !req.body.maxcompensation || !req.body.compensationtype) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save jobs" });
        }
        else {
            var jobCollection = {
                jobname: req.body.jobname,
                availibility: req.body.availibility,
                status: req.body.status,
                mincompensation: req.body.mincompensation,
                maxcompensation: req.body.maxcompensation,
                compensationtype: req.body.compensationtype,               
                createddate: new Date(),
                enddate: req.body.enddate,
                role: req.body.role,
                description: req.body.description,
                testid:req.body.testid,
                filename:"",
                createdby: {
                    firstname: "neeraj",
                    lastname: "k",
                    username: "test@test.com",
                    userid: "Zdf124_hdug%njuxac"
                }
            }
            jobs.save(jobCollection, function (err, results) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save job" });
                else {
                    return res.send({ "status": "Success", "message": "job added successfully", "results": results, "messageCode": "107", "methodName": "Save job" });
                }
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Save jobs" });
    }
});

//upload photo
router.post('/userPhoto/:id', upload.single('userPhoto'), function (req, res, next) {
    //res.end("File is uploaded");
    jobs.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
        if (!manufacturer) {
            return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update job by id" });
        }
        else {
            jobs.update({ '_id': new ObjectId(req.params.id) },
                {
                    $set: {
                        filename: ObjectId(req.params.id) + '-' + Date.now() + '.' + req.file.originalname,
                    }
                }, function (err, results) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                    else {
                        return res.send({ "status": "Success", "message": "Job updated successfully", "messageCode": "106", "methodName": "update job by id" });
                    }
                });
        }

    });
   
})


// update jobs by id
router.route('/jobs/update/:id').put(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update job by id" });
        }
        else {
            jobs.findOne({ '_id': new ObjectId(req.params.id)}, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update job by id" });
                }
                else {
                    jobs.update({ '_id': new ObjectId(req.params.id) },
                        {
                            $set: { jobname: req.body.jobname, 
                                availibility: req.body.availibility,
                                status: req.body.status,
                                mincompensation: req.body.mincompensation,
                                maxcompensation: req.body.maxcompensation,
                                compensationtype: req.body.compensationtype,
                                createddate: new Date(),
                                enddate: req.body.enddate,
                                role: req.body.role,
                                testid: req.body.testid,
                                description: req.body.description,
                            }                      
                           
                            
                        }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                        else {
                            return res.send({ "status": "Success", "message": "Job updated successfully", "messageCode": "106", "methodName": "update job by id" });
                        }
                    });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "update job by id" });
    }
});

//Update status
router.route('/jobs/status/:id').put(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update job by id" });
        }
        else {
            console.log("message:  " + req.params.id)
            jobs.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update job by id" });
                }
                else {
                    jobs.update({ '_id': new ObjectId(req.params.id) },
                        {
                            $set: {                                
                                status: req.body.status,                               
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                            else {
                                return res.send({ "status": "Success", "message": "Job updated successfully", "messageCode": "106", "methodName": "update job by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        console.log("message:  "+ err)
        return res.send({ "status": "Error", "message": err, "messageCode": "102", "methodName": "update job by id" });
    }
});

//create duplicate save as draft
router.route('/jobs/duplicate/:id').post(function (req, res) {
    if (!req.params.id) {
        return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id });
    }
    jobs.findOne({ '_id': new ObjectId(req.params.id) }, function (err, result) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!result) {
            return res.send({ "status": "Error", "message": "job not found" });
        }
        
        else {
            console.log(result);
            var jobCollection = {
                jobname: result.jobname,
                availibility: result.availibility,
                status: "Draft",
                mincompensation: result.mincompensation,
                maxcompensation: result.maxcompensation,
                compensationtype: result.compensationtype,
                createddate: new Date(),
                enddate: result.enddate,
                role: result.role,
                testid: result.testid,
                description: result.description,
                createdby: {
                    firstname: "neeraj",
                    lastname: "k",
                    username: "test@test.com",
                    userid: "Zdf124_hdug%njuxac"
                }
            }
            jobs.save(jobCollection, function (err, results) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save job" });
                else {
                    return res.send({ "status": "Success", "message": "job added successfully", "results": results, "messageCode": "107", "methodName": "Save job" });
                }
            });
        }

    });
});

module.exports = router;