var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var User = db.collection('user');
var userrole = db.collection('userrole');
var ObjectId = mongojs.ObjectID;
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
// Save User
router.route('/users').post(function (req, res) {
    try {
        if (!req.body.firstname || !req.body.lastname || !req.body.username || !req.body.password ) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save User" });
        }
        else {
            User.findOne({ 'username': req.body.username }, function (err, user) {
                if (user) {
                    return res.send({ "status": "Error", "message": "user already exist.", "messageCode": "109", "methodName": "Save car" });
                }
                else {
                    User.find().count(function (err, usercount) {
                        usercount++;
                        var carCollection = {
                            '_id':usercount,
                            "firstname": req.body.firstname,
                            "lastname": req.body.lastname,
                            "username": req.body.username,
                            "password": req.body.password,
                            "createddate": new Date(),
                            "updateddate": new Date(),
                            "isdeleted": "N",
                            "ipAddress": req.body.ipAddress,
                            "country": req.body.country,
                            "roles": req.body.roles,
                            "Status": 'Active'
                        }
                        User.save(carCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save car" });
                            else {
                                var token = jwt.sign(results, req.app.get('superSecret'), {
                                    expiresIn: 86400 * 15 // expires in 24 hours
                                });
                                results.token = token;
                                return res.send({ "status": "Success", "message": "user added successfully", "results": results, "messageCode": "107", "methodName": "Save user" });
                            }
                        });
                    });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save user" });
    }
});

// Save User
router.route('/users/Admin').post(function (req, res) {
    try {
        if (!req.body.firstname || !req.body.lastname || !req.body.username) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save User" });
        }
        else {

            User.findOne({ 'username': req.body.username }, function (err, user) {
                if (user) {
                    return res.send({ "status": "Error", "message": "user already exist.", "messageCode": "109", "methodName": "Save car" });
                }
                else {
                    User.find().count(function (err, usercount) {
                        usercount++;
                        var carCollection = {
                            '_id':usercount,
                            "firstname": req.body.firstname,
                            "lastname": req.body.lastname,
                            "username": req.body.username,
                            "paymentemail": req.body.paymentemail,
                            "phone": req.body.phone,
                            "extphone": req.body.extphone,
                            "street": req.body.street,
                            "city": req.body.city,
                            "state": req.body.state,
                            "country": req.body.country,
                            "postalcode": req.body.postalcode,
                            "taxinfo": req.body.taxinfo,
                            "availability": req.body.availability,
                            "availableword": req.body.availableword,
                            "Bookedoutfor": req.body.Bookedoutfor,
                            "services": req.body.services,
                            "servicesselcted": req.body.servicesselcted,
                            "writingstyles": req.body.writingstyles,
                            "categoriestags": req.body.categoriestags,
                            "createddate": new Date(),
                            "updateddate": new Date(),
                            "isdeleted": "N",
                            "roles": req.body.roles,
                            "Status": req.body.Status,
                            "totalhrperday": req.body.totalhrperday,
                            "hrperdaycat": req.body.hrperdaycat,
                            "avaldays": req.body.avaldays,
                            "noofdayswork": req.body.noofdayswork,
                            "customusertype": req.body.customusertype
                        }
                        User.save(carCollection, function (err, results) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Save car" });
                            else {
                                var token = jwt.sign(results, req.app.get('superSecret'), {
                                    expiresIn: 86400 * 15 // expires in 24 hours
                                });
                                results.token = token;
                                return res.send({ "status": "Success", "message": "user added successfully", "results": results, "messageCode": "107", "methodName": "Save user" });
                            }
                        });
                    });
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save user" });
    }
});

//login
router.route('/users/login').post(function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save User" });
    }
    else {
        User.findOne({ 'username': req.body.username,'isdeleted': 'N' }, function (err, user) {
            if (user) {
                User.findOne({ 'password': req.body.password }, function (err, result) {
                    if (result) {
                        var token = jwt.sign(result, req.app.get('superSecret'), {
                            expiresIn: 86400 * 15 // expires in 24 hours
                        });
                        user.token = token;
                        return res.send({ "status": "Succes", "result": user, "messageCode": "200", "methodName": "Login" });
                    }
                    else {
                        return res.send({ "status": "Error", "message": "Invalid Password.", "messageCode": "101", "methodName": "login" });
                    }
                });                
            }
            else {
                return res.send({ "status": "Error", "message": "Invalid User name.", "messageCode": "101", "methodName": "login" });
            }
        });
    }
});
//Reset password
router.route('/users/reset').post(function (req, res) {
    try {
        if (!req.body.username) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Forget Password" });
        }
        else {
            User.findOne({ 'username': req.body.username }, function (err, user) {
                if (user) {
                    User.update({ 'username': req.body.username }, { $set: { 'password': req.body.password } }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Forget Password" });
                        else {
                            var token = jwt.sign(results, req.app.get('superSecret'), {
                                expiresIn: 86400 * 15 // expires in 24 hours
                            });
                            user.token = token;
                            return res.send({ "status": "Succes", "result": user, "messageCode": "200", "methodName": "Forget Password" });
                        }
                    });   
                }
                else {
                    return res.send({ "status": "Error", "message": "Invalid User name.", "messageCode": "101", "methodName": "Forget Password" });
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "Forget Password" });
    }
});


//Get All users
router.route('/users/:status/:role').get(function (req, res) {
    try {
        if (!req.params.status) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Save User" });
        }
        else {
           
                User.find({ 'Status': req.params.status, 'roles.role': req.params.role }).sort({ createddate: -1 }, function (err, result) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all Users" });
                    return res.send({ "status": "Success", "message": "Users list", "Users": result, "messageCode": "113", "methodName": "get all Users" });
                });
           
        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all Users" });
    }
});

//Update user by id

router.route('/users/update/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update user by id" });
        }
        else {
            var clientid = parseInt(req.params.id);
            User.findOne({ '_id': clientid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "user not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                    User.update({ '_id': clientid },
                        {
                            $set: {
                                "Status": req.body.status,
                                "isdeleted": req.body.isdeleted
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

//Get All userrole
router.route('/userrole').get(function (req, res) {
    try {
       
            userrole.find( function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "get all userrole" });
                return res.send({ "status": "Success", "message": "Users list", "userrole": result, "messageCode": "113", "methodName": "get all userrole" });
            });

        
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "get all userrole" });
    }
});


//Update user styles by id

router.route('/users/styleupdate/:id').post(function (req, res) {
    console.log('----Called-----');
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update user by id" });
        }
        else {
            var clientid = parseInt(req.params.id);
            console.log(clientid);
            User.findOne({ '_id': clientid }, function (err, manufacturer) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                if (!manufacturer) {
                    return res.send({ "status": "Error", "message": "user not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                    if (req.body.addremove == 'remove') {
                        User.update({ '_id': clientid },
                            {
                               
                                    $pull: { "writingstyles": { 'id': req.body.stid } }
                                
                            }, function (err, results) {
                                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                else {
                                    return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                                }
                            });
                    }
                    else {
                        User.update({ '_id': clientid },
                            {
                                
                                    $push: { "writingstyles": req.body.writingstyles}
                               
                            }, function (err, results) {
                                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                else {
                                    return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                                }
                            });
                    }
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});


//Update user tags by id

router.route('/users/tagsupdate/:id').post(function (req, res) {
    console.log('----Called-----');
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update user by id" });
        }
        else {
            var userid = parseInt(req.params.id);
            var ctid = parseInt(req.body.catid);
            var tdid = parseInt(req.body.tagid);
            User.findOne({ '_id': userid, 'categoriestags._id': ctid }, function (err, users) {
               
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                
                if (!users) {
                    return res.send({ "status": "Error", "message": "user not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                    if (req.body.addremove == 'remove') {
                        var categories = users.categoriestags;
                        console.log(categories.length);
                        for (var f = 0; f < categories.length; f++)
                        {
                            console.log('called 1');
                            if (categories[f]._id == ctid)
                            {
                                console.log('called 2');
                                var tagss = categories[f].tags;
                                for (var g = 0; g < tagss.length; g++)
                                {
                                    console.log('called 3');
                                    if (tagss[g].id == tdid)
                                    {
                                        
                                        tagss.splice(g, 1);
                                        categories[f].tags = tagss;
                                        
                                        User.update({ '_id': userid },
                                            {                               
                                                $set: { 'categoriestags': categories }
                                            }, function (err, results) {
                                                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                                else {
                                                    return res.send({ "status": "Success", "message": "user updated successfully","results":results, "messageCode": "106", "methodName": "user by id" });
                                                }
                                            });
                                    }
                                }
                            }
                        }
                      
                    }
                    else {
                        var categories = users.categoriestags;
                        console.log(categories.length);
                        for (var f = 0; f < categories.length; f++) {
                            console.log('called 1');
                            if (categories[f]._id == ctid) {
                                console.log('called 2');
                                var tagss = categories[f].tags;
                               
                                    tagss.push(req.body.tags);
                                    categories[f].tags = tagss;

                                        User.update({ '_id': userid },
                                            {
                                                $set: { 'categoriestags': categories }
                                            }, function (err, results) {
                                                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                                else {
                                                    return res.send({ "status": "Success", "message": "user updated successfully", "results": results, "messageCode": "106", "methodName": "user by id" });
                                                }
                                            });
                                   
                            }
                        }

                        //User.update({ '_id': userid },
                        //    {

                        //        $push: { "categoriestags.$.tags": req.body.tags }

                        //    }, function (err, results) {
                        //        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                        //        else {
                        //            return res.send({ "status": "Success", "message": "user updated successfully", "messageCode": "106", "methodName": "user by id" });
                        //        }
                        //    });
                    }
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});


//Get user by id
router.route('/users/:id').get(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Get user by id" });
        }
        else {
            var userid = parseInt(req.params.id);
            User.findOne({ '_id': userid }, function (err, result) {
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Get user by id" });
                return res.send({ "status": "Success", "message": "Users list", "User": result, "messageCode": "113", "methodName": "Get user by id" });
            });

        }
    } catch (err) {
        console.log(err);
        return res.send({ "status": "Error", "message": "System Error", "messageCode": err, "methodName": "Get user by id" });
    }
});

// Update User
router.route('/users/Admin/:id').post(function (req, res) {
    try {
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Update User" });
        }
        else {
            var userid = parseInt(req.params.id);
            User.findOne({ '_id': userid }, function (err, user) {
                if (!user) {
                    return res.send({ "status": "Error", "message": "user not found.", "messageCode": "109", "methodName": "Update car" });
                }
                else {  
                    User.update({ '_id': userid },
                       {
                           $set: {
                               "firstname": req.body.firstname,
                               "lastname": req.body.lastname,
                               "username": req.body.username,
                               "paymentemail": req.body.paymentemail,
                               "phone": req.body.phone,
                               "extphone": req.body.extphone,
                               "street": req.body.street,
                               "city": req.body.city,
                               "state": req.body.state,
                               "country": req.body.country,
                               "postalcode": req.body.postalcode,
                               "taxinfo": req.body.taxinfo,
                               "availability": req.body.availability,
                               "availableword": req.body.availableword,
                               "Bookedoutfor": req.body.Bookedoutfor,
                               "services": req.body.services,
                               "servicesselcted": req.body.servicesselcted,
                               "writingstyles": req.body.writingstyles,
                               "categoriestags": req.body.categoriestags,
                               "createddate": new Date(),
                               "updateddate": new Date(),
                               "isdeleted": "N",
                               "roles": req.body.roles,
                               "Status": req.body.Status,
                               "totalhrperday": req.body.totalhrperday,
                               "hrperdaycat": req.body.hrperdaycat,
                               "avaldays": req.body.avaldays,
                               "noofdayswork": req.body.noofdayswork,
                               "customusertype": req.body.customusertype
                           }
                       }, function (err, results) {
                           if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "User Update by id" });
                           else {
                               return res.send({ "status": "Success", "message": "User updated successfully","results":results, "messageCode": "106", "methodName": "User Update by id" });
                           }
                       });
                   
                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Save user" });
    }
});

// Remove category from users
router.route('/users/categories/:catid').post(function (req, res) {
    try {
        if (!req.params.catid) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Remove category from users" });
        }
        else {
            var ctid = parseInt(req.params.catid);
           
            User.find({ 'roles.role': 'Writer' }, function (err, user) {
                if (!user) {
                    return res.send({ "status": "Error", "message": "category not found.", "messageCode": "109", "methodName": "Remove category from users" });
                }
                else {
                    console.log(user.length);
                    for (var i = 0; i < user.length; i++)
                    {
                        console.log('i:----'+i);
                        for (var j = 0; j < user[i].categoriestags.length; j++) {
                            console.log('j-------' + j);
                            var chk = user[i].categoriestags[j]._id;
                            console.log('cat id:-' + chk);
                            var userlength = (user.length - 1);
                            if (i == userlength) {
                                return res.send({ "status": "Success", "message": "Remove category from users successfully", "messageCode": "106", "methodName": "Remove category from users" });
                            }
                            else{
                                if (chk == ctid) {
                                    var usid = parseInt(user[i]._id);
                                    console.log('user id:- ' + usid);
                                   
                                    User.update({ '_id': usid },
                                       {
                                           $pull: { "categoriestags": { '_id': ctid } }

                                       }, function (err, results) {
                                           if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Remove category from users" });
                                           else {

                                           }
                                       });
                                }
                            }
                        }
                    }
                    //User.update({ '_id': userid },
                    //   {
                    //       $set: {
                              
                    //           "categoriestags": req.body.categoriestags,
                              
                    //       }
                    //   }, function (err, results) {
                    //       if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Remove category from users" });
                    //       else {
                    //           return res.send({ "status": "Success", "message": "Remove category from users successfully", "results": results, "messageCode": "106", "methodName": "Remove category from users" });
                    //       }
                    //   });

                }
            });
        }

    } catch (err) {
        return res.send({ "status": "Error", "message": err.message, "messageCode": "102", "methodName": "Remove category from users" });
    }
});

//Update user cat tag by id

router.route('/users/tagsupdatebycat/:catid').post(function (req, res) {
    console.log('----Called-----');
    try {
        if (!req.params.catid) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "update user by id" });
        }
        else {
           
            var ctid = parseInt(req.params.catid);
            
            User.find({ 'roles.role': 'Writer' }, function (err, users) {

                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });

                if (!users) {
                    return res.send({ "status": "Error", "message": "user not found with id", "messageCode": "109", "methodName": "update user by id" });
                }
                else {
                    console.log(users);
                    console.log(users.length);
                    if (req.body.addremove == 'remove') {
                        var tdid = parseInt(req.body.tdid);
                        for (var b = 0; b < users.length; b++) {
                            var categories = users[b].categoriestags;
                            var userid = parseInt(users[b]._id);
                            console.log(categories.length);
                            for (var f = 0; f < categories.length; f++) {
                                console.log('called 1');
                                if (categories[f]._id == ctid) {
                                    console.log('called 2');
                                    var tagss = categories[f].tags;
                                    for (var g = 0; g < tagss.length; g++) {
                                        console.log('called 3');
                                        if (tagss[g].id == tdid) {

                                            tagss.splice(g, 1);
                                            categories[f].tags = tagss;

                                            User.update({ '_id': userid },
                                                {
                                                    $set: { 'categoriestags': categories }
                                                }, function (err, results) {
                                                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                                    else {
                                                        return res.send({ "status": "Success", "message": "user updated successfully", "results": results, "messageCode": "106", "methodName": "user by id" });
                                                    }
                                                });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        for (var b = 0; b < users.length; b++) {
                            var categories = users[b].categoriestags;
                            var userid = parseInt(users[b]._id);
                            console.log(categories.length);
                            for (var f = 0; f < categories.length; f++) {
                                console.log('called 1');
                                if (categories[f]._id == ctid) {
                                    console.log('called 2');
                                    var tagss = categories[f].tags;

                                    tagss.push(req.body.tags);
                                    categories[f].tags = tagss;

                                    User.update({ '_id': userid },
                                        {
                                            $set: { 'categoriestags': categories }
                                        }, function (err, results) {
                                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "update user by id" });
                                            else {
                                                return res.send({ "status": "Success", "message": "user updated successfully", "results": results, "messageCode": "106", "methodName": "user by id" });
                                            }
                                        });

                                }
                            }
                        }
              
                    }
                }

            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "user by id" });
    }
});



module.exports = router;


