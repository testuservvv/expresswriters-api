var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var tests = db.collection('tests');
var questiontf = db.collection('questiontf');
var questionwi = db.collection('questionwi');
var ObjectId = require('mongojs').ObjectID;
var questionwc = db.collection('questionwc');
var async = require('async');
var Questions = db.collection('Questions');
var applicanttests = db.collection('applicanttests');
//Save applicanttests
router.route('/applicanttests/:attempts').post(function (req, res) {

    try {
        if (!req.body.userid || !req.body.testid || !req.body.jobid) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save Applicant test" });
        }
        else {
            applicanttests.find().count(function (err, countapp) {
                countapp++;
                applicanttests.findOne({ 'userid': req.body.userid, 'testid': req.body.testid }, function (err, getResult) {
                    var resultchk = getResult;
                    if (resultchk != null) {
                        var testid = resultchk._id;
                    }
                    var questions = [];

                    if (resultchk == null) {
                        questions.push(req.body.questions);
                        console.log("saved new");
                        console.log(req.body.grade);
                        var applicanttestcollection = {
                            '_id': countapp,
                            "userid": req.body.userid,
                            "testid": req.body.testid,
                            "jobid": req.body.jobid,
                            "questions": questions,
                            "status": req.body.status,
                            "totalquestion": req.body.totalquestion,
                            "attemptsquestion": req.body.attemptsquestion,
                            "ipaddress": req.body.ipaddress,
                            "username": req.body.username,
                            "email": req.body.email,
                            "attempts": 1,
                            "attempttime": req.body.attempttime,
                            "createddate": new Date(),
                            "locked": req.body.locked,
                            "role": req.body.role,
                            "country": req.body.country,
                            "grade": req.body.grade,
                            "passpercentage": req.body.passpercentage
                        }
                        applicanttests.save(applicanttestcollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save Applicant" });
                            else {

                                return res.send({ "status": "Success", "message": "Applicant test added successfully", "results": "", "messageCode": "107", "methodName": "Applicant" });

                            }
                        });
                    }
                    else {
                        if (resultchk.attempts == req.params.attempts) {
                            console.log("Not saved saved");
                            return res.send({ "status": "MaxAttampts", "message": "Your limit for this test is exceeded choose another job for test", "results": "", "messageCode": "100", "methodName": "Applicant" });
                        }
                        else {
                           
                            var attempts = resultchk.attempts;
                            attempts++;
                            console.log("Update");
                            console.log(req.body.grade);
                            questions.push(req.body.questions);
                           
                            applicanttests.update({ '_id': testid },
                           {
                               $set: {
                                   "userid": req.body.userid,
                                   "testid": req.body.testid,
                                   "jobid": req.body.jobid,
                                   "grade": req.body.grade,
                                   "status": req.body.status,
                                   "totalquestion": req.body.totalquestion,
                                   "attemptsquestion": req.body.attemptsquestion,
                                   "ipaddress": req.body.ipaddress,
                                   "username": req.body.username,
                                   "email": req.body.email,
                                   "attempts": attempts,
                                   "attempttime": req.body.attempttime,
                                   "locked": req.body.locked,
                                   "role": req.body.role,
                                   "passpercentage": req.body.passpercentage,
                                   "createddate": new Date()
                               },
                               $push: { "questions": req.body.questions }
                           }, function (err, results) {
                               if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                               else {
                                   return res.send({ "status": "Success", "message": "Job updated successfully", "messageCode": "106", "methodName": "update job by id" });
                               }
                           });
                        }
                    }
                });
            });


        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Applicant test" });
    }
});
//get applicanttests all by status also handel if status is undefined it show all
router.route('/applicanttests/:status').get(function (req, res) {
    try {
        console.log(req.params.status);
        if (req.params.status != 'undefined') {
            applicanttests.find({ 'status': req.params.status }).sort({ createddate: -1 }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all applicanttests" });
                return res.send({ "status": "Success", "message": "applicanttests list", "tests": result, "messageCode": "113", "methodName": "get all applicanttests" });
            });
        }
        else {
            applicanttests.find().sort({ createddate: -1 }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all applicanttests" });
                return res.send({ "status": "Success", "message": "applicanttests list", "tests": result, "messageCode": "113", "methodName": "get all applicanttests" });
            });
        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all applicanttests" });
    }
});
//Update tests
router.route('/applicanttests/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update applicanttests by id" });
        }
        else {
            applicanttests.findOne({ '_id': parseInt(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update applicanttests by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "applicanttests not found with applicanttests id", "messageCode": "109", "methodName": "update applicanttests by id" });
                }
                else {
                    applicanttests.update({ '_id': parseInt(req.params.id) },
                        {
                            $set: {                                
                                "status": req.body.status,
                                "grade": req.body.grade
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "test job by id" });
                            else {
                                return res.send({ "status": "Success", "message": "applicanttests updated successfully", "messageCode": "106", "methodName": "applicanttests by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "test by id" });
    }
});

//get applicanttests by id
router.route('/applicanttests/single/:id').get(function (req, res) {
    if (!req.params.id) {
        return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id });
    }
    applicanttests.findOne({ '_id': new ObjectId(req.params.id) }, function (err, result) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!result) {
            return res.send({ "status": "Error", "message": "applicanttests not found" });
        }
        else {
            return res.send({ "status": "Success", "message": "applicanttests found by applicanttests id", "user": result });
        }

    });
});





//Save questions
router.route('/questions/:testid').post(function (req, res) {

    console.log(req.body);
    var test_id = req.params.testid;
    try {
        if (!req.body.questionsansresulttype) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save Test" });
        }
        else {
            async.forEach(req.body.questionsansresulttype, function (item, callback) {
                console.log(item);
                var index = req.body.questionsansresulttype.indexOf(item);
                var testCollection = {

                    "questiontitle": item.Qtitle,
                    "testid": test_id,
                    "options": item.options,

                    "answer": item.answer,
                    "type": item.type,
                    "createddate": new Date()
                }
                Questions.save(testCollection, function (err, results) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save Questions" });
                    else {
                        callback();
                        if (req.body.questionsansresulttype.length - 1 == index) {
                            return res.send({ "status": "Success", "message": "Questions added successfully", "results": "", "messageCode": "107", "methodName": "Questions" });
                        }
                    }
                });
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Test user" });
    }
});
// get all tests
router.route('/tests/:status').get(function (req, res) {

    try {
        tests.find({ 'status': (req.params.status) }).sort({ createddate: -1 }, function (err, result) {

            var cou = 0;

            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tests" });
            var count = 1;
            if (result.length>0) {
            async.forEach(result, function (item) {
                applicanttests.find({ 'testid': (item._id).toString(), 'status': 'Passed' }).count(function (err, passedcount) {

                    item.pass = passedcount;
                    console.log(item._id + '----' + passedcount);
                    
                });
               
                applicanttests.find({ 'testid': (item._id).toString() }).count(function (err, appcount) {
                  
                    item.Applicants = appcount;
                    console.log('-----------------------');
                    console.log(item.Applicants);
                    console.log(item.pass);
                     console.log('-----------------------');
                    if (item.pass > 0) {
                        item.Passrate = (item.pass / item.Applicants) * 100;
                    }
                    else {
                        item.Passrate = 0;
                    }
                    
                    if (result.length == count) {
                       
                        console.log("DON");
                      
                        return res.send({ "status": "Success", "message": "tests list", "tests": result, "messageCode": "113", "methodName": "get all tests" });
                    }
                    count++;
                });
             
             

            }, function (err) {
                console.log('iterating done');
               
               
            });
            }
            else {
                return res.send({ "status": "Success", "message": "jobs list", "jobs": result, "messageCode": "113", "methodName": "get all jobs" });
            }
           
        });
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all tests" });
    }
});
// Save Tests
router.route('/tests').post(function (req, res) {
    try {
        if (!req.body.testname) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save Test" });
        }
        else {
            var testCollection = {
                "testname": req.body.testname,
                "status": req.body.status,
                "createddate": new Date(),
                "Questions": req.body.Questions,
                "Time": req.body.Time,
                "Attempts": req.body.Attempts,
                "Randomize": req.body.Randomize,
                "Locked": req.body.Locked,
                "Applicants": req.body.Applicants,
                "Passrate": req.body.Passrate,
                "role": req.body.role,
                "passpercentage": req.body.passpercentage,
                "contentType": req.body.contentType
            }
            tests.save(testCollection, function (err, results) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save Test" });
                else {

                    return res.send({ "status": "Success", "message": "Test added successfully", "results": results, "messageCode": "107", "methodName": "Test user" });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Test user" });
    }
});
//Update tests
router.route('/tests/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update test by id" });
        }
        else {
            tests.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update test by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update test by id" });
                }
                else {
                    tests.update({ '_id': new ObjectId(req.params.id) },
                        {
                            $set: {
                                "testname": req.body.testname,
                                "status": req.body.status,
                                "createddate": new Date(),
                                "Questions": req.body.Questions,
                                "Time": req.body.Time,
                                "Attempts": req.body.Attempts,
                                "Randomize": req.body.Randomize,
                                "Locked": req.body.Locked,
                                "Applicants": req.body.Applicants,
                                "Passrate": req.body.Passrate,
                                "role": req.body.role,
                                "passpercentage": req.body.passpercentage,
                                "contentType": req.body.contentType
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "test job by id" });
                            else {
                                //return res.send({ "status": "Success", "message": "test updated successfully", "messageCode": "106", "methodName": "test by id" });
                                applicanttests.update({ 'testid': req.params.id },
                       {
                           $set: {
                              
                               "locked": req.body.Locked
                              
                           }
                       }, function (err, results) {
                           if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "test job by id" });
                           else {
                               return res.send({ "status": "Success", "message": "test updated successfully", "messageCode": "106", "methodName": "test by id" });
                           }
                       });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "test by id" });
    }
});


//Update Tests
router.route('/tests/status/:id').put(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update job by id" });
        }
        else {
            tests.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update job by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update job by id" });
                }
                else {
                    tests.update({ '_id': new ObjectId(req.params.id) },
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
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "update job by id" });
    }
});

//Get tests by id
router.route('/tests/id/:id').get(function (req, res) {
    if (!req.params.id) {
        return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id });
    }
    tests.findOne({ '_id': new ObjectId(req.params.id) }, function (err, result) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!result) {
            return res.send({ "status": "Error", "message": "test not found" });
        }
        else {
            var questionsanswer = [];

            Questions.find({ 'testid': req.params.id }).sort({ createddate: -1 }, function (err, resultWI) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tests" });
                for (var i = 0; i < resultWI.length; i++) {

                    questionsanswer.push(resultWI[i]);
                }

                result.quesans = questionsanswer;
                console.log(result);
                return res.send({ "status": "Success", "message": "jobs found by user id", "tests": result });

            });
            //questionwc.find({ 'testid': req.params.id }).sort({ createddate: -1 }, function (err, resultWC) {

            //    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tests" });
            //    for (var i = 0; i < resultWC.length; i++) {
            //        resultWC[i].type = "MC";
            //        questionsanswer.push(resultWC[i]);
            //    }
            //    questiontf.find({ 'testid': req.params.id }).sort({ createddate: -1 }, function (err, resultTF) {

            //        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tests" });

            //        for (var i = 0; i < resultTF.length; i++) {
            //            resultTF[i].type = "TF";
            //            questionsanswer.push(resultTF[i]);
            //        }

            //        questionwi.find({ 'testid': req.params.id }).sort({ createddate: -1 }, function (err, resultWI) {

            //            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all tests" });
            //            for (var i = 0; i < resultWI.length; i++) {
            //                resultWI[i].type = "WI";
            //                questionsanswer.push(resultWI[i]);
            //            }

            //            result.quesans = questionsanswer;
            //            return res.send({ "status": "Success", "message": "jobs found by user id", "tests": result });

            //        });

            //    });

            //});



        }

    });
});



//Update questiontf
router.route('/question/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update test by id" });
        }
        else {
            Questions.findOne({ '_id': new ObjectId(req.params.id) }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update test by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "job not found with job id", "messageCode": "109", "methodName": "update test by id" });
                }
                else {
                    Questions.update({ '_id': new ObjectId(req.params.id) },
                        {
                            $set: {
                                "questiontitle": req.body.questiontitle,
                                "testid": req.body.testid,
                                "answer": req.body.answer,
                                "options": req.body.question,
                                "type": req.body.type,
                                "createddate": new Date()
                            }
                        }, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "test job by id" });
                            else {
                                return res.send({ "status": "Success", "message": "test updated successfully", "messageCode": "106", "methodName": "test by id" });
                            }
                        });
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "test by id" });
    }
});




//Get questiontf by id
router.route('/question/:id').get(function (req, res) {
    if (!req.params.id) {
        return res.send({ "status": "Error", "message": "missing a parameter", "id": req.params.id });
    }
    Questions.findOne({ '_id': new ObjectId(req.params.id) }, function (err, result) {
        if (err) return res.send({ "status": "Error", "message": err });
        if (!result) {
            return res.send({ "status": "Error", "message": "Question not found" });
        }
        else {
            return res.send({ "status": "Success", "message": "Question found by id", "result": result });
        }

    });
});
//Get questionWI by id


module.exports = router;