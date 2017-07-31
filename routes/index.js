var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var config = require('../config'); // get our config file
var db = mongojs(config.database);
var User = db.collection('User');
var Role = db.collection('Role');
var ObjectId = mongojs.ObjectID;
var app = require('../app');
var jwt = require('jsonwebtoken');
var bCrypt = require('bcrypt-nodejs');
var smtp = require('../smtp');
var smtpProtocol = smtp.smtpTransport;
var crypto = require('crypto');
var ForgotRequest = db.collection('ForgotRequest');

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}    
router.route('/account').get(function(req, res) {
    res.send("Hello ALL account");
});

function cryptoRandomNumber(minimum, maximum) {
    var distance = maximum - minimum;
    var maxBytes = 6;
    var maxDec = 281474976710656;
    var randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
    var result = Math.floor(randbytes / maxDec * (maximum - minimum + 1) + minimum);

    if (result > maximum) {
        result = maximum;
    }
    return result;
}

// test api
router.route('/').get(function (req, res) {
    res.send("Hi, Welcome to UVI app APIs");
});

// check userName already exists or not
router.route('/checkUsername').post(function (req, res) {
    try {
        if (!req.body.userName) {
            return res.send({ "status": "Error", "message": "missing a parameter" });
        }
        else {
            User.findOne({ 'userName': req.body.userName }, function (err, user1) {
                if (!user1) {
                    return res.send({ "status": "Success", "message": "User not exist with this user name " + req.body.userName });
                }
                else{
                    return res.send({ "status": "Error", "message": "User already exist with this user name " + req.body.userName });
                }
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});

// register user
router.route('/signUp').post(function (req, res) {
try {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.phoneNo || !req.body.userName) {
        return res.send({ "status": "Error", "message": "missing a parameter" });
    }
    else {
	//Role.findOne({ 'role': "user" }, function (err, role) {
	//console.log(role);
	//if (!role) {
	// return res.send({ "status": "Error", "message": "Role not found." });
	//}
	//else
	//{
	    User.findOne({ 'email': req.body.email }, function (err, user) {
	       
	        if (!user) {
	            User.findOne({ 'userName': req.body.userName }, function (err, user1) {
	                if (!user1) {
	                    var usercollection = {
	                        userName: req.body.userName,
	                        name: req.body.name,
	                        email: req.body.email,
	                        phoneNo: req.body.phoneNo,
	                        dob: req.body.dob,
	                        password: createHash(req.body.password),
	                        role: "user",
	                        deviceId: req.body.deviceId,
	                        deviceType: req.body.deviceType,
	                        udId: req.body.udId,
	                        isLogin: true,
	                        createdDate: new Date(),
	                        'isDeleted': false
	                    }
	                    User.save(usercollection, function (err, user) {
	                        if (err) return res.send({ "message": err });
	                        else {
	                            var token = jwt.sign(user, req.app.get('superSecret'), {
	                                expiresIn: 86400 * 15 // expires in 24 hours
	                            });
	                            user.token = token;
	                            return res.send({ "status": "Success", "message": "User saved successfully", "user": user, "messageCode": "107", "methodName": "register user" });
	                        }
	                    });
	                }
	                else {
	                    return res.send({ "status": "Error", "message": "User already exist with this user name " + req.body.userName });

	                }
	            });
            }
            else {
                return res.send({ "status": "Error", "message": "User already exist with this email id " + req.body.email });
            }
        });		
    }
	
	} catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});



// login api
router.route('/login').post(function (req, res) {

    try {
        if (!req.body.userName || !req.body.password) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "login api" });
        }
        else {
            User.findOne({ 'userName': req.body.userName, 'isDeleted': false }, function (err, user) {

                // In case of any error, return using the done method
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "login api" });
                // Username does not exist, log the error and redirect back
                if (!user) {
                    return res.send({ "status": "Error", "message": "This user name is not register with UVI.", "messageCode": "119", "methodName": "login api" });
                }
                // User exists but wrong password, log the error 
                try {
                    if (!isValidPassword(user, req.body.password)) {
                        return res.send({ "status": "Error", "message": "Invalid Password", "messageCode": "118", "methodName": "login api" });
                    }
                } catch (e) {
                    return res.send({ "status": "Error", "message": e, "messageCode": "101", "methodName": "login api" });
                }

                // User and password both match, return user from done method which will be treated like success

                var token = jwt.sign(user, req.app.get('superSecret'), {
                    expiresIn: 86400 * 15 // expires in 24 hours
                });

                User.update({ 'userName': req.body.userName }, {
                    $set: {
                        deviceId: req.body.deviceId,
                        deviceType: req.body.deviceType,
                        udId: req.body.udId,
                        isLogin: true
                    }
                }, function (err, results) {
                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "login api" });
                    else {
                        User.findOne({ 'userName': req.body.userName, 'isDeleted': false }, function (err, user) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "login api" });
                            else {
                                user.token = token;
                                return res.send({ "status": "Success", "message": "User Found", "user": user, "messageCode": "110", "methodName": "login api" });
                            }
                        });
                    }
                });
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "login api" });
    }

});

// logout api
router.route('/logout').post(function (req, res) {

    try {
        if (!req.body.email) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "logout api" });
        }
        else {
            User.findOne({ 'email': req.body.email }, function (err, user) {
                if (!user) {
                    return res.send({ "status": "Success", "message": "Logout successfully", "messageCode": "110", "methodName": "logout api" });
                }
                else {
                    User.update({ 'email': req.body.email }, {
                        $set: {
                            isLogin: false,
                            deviceId: '',
                            deviceType: ''
                        }
                    }, function (err, results) {
                        if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "logout api" });
                        else {

                            return res.send({ "status": "Success", "message": "Logout successfully", "messageCode": "110", "methodName": "logout api" });
                        }
                    });
                }
            });
        }
    }

    catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "logout api" });
    }

});

// Forget Password
router.route('/forgot/:id').get(function (req, res) {
    try {
        console.log(req.params.id)
        if (!req.params.id) {
            return res.send({ "status": "Error", "message": "missing email", "messageCode": "117", "methodName": "Forget Password" });
        }
        User.findOne({ 'email': req.params.id, 'isDeleted': false }, function (err, user) {
            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Forget Password" });
            if (!user) {
                return res.send({ "status": "Error", "message": "User not found", "messageCode": "109", "methodName": "Forget Password" });
            }
            else {
                //  return res.send({ "status": "Success", "message": "User found by user id", "user": user });

                var getToken = cryptoRandomNumber((Number.MAX_SAFE_INTEGER - 281474976710655), Number.MAX_SAFE_INTEGER);
                // var getToken = randomValueHex(12);
                var forgotCollection = {
                    email: req.params.id,
                    requeston: new Date(),
                    validhours: 1,
                    token: getToken,
                    isactive: true
                };
                var mailData = {
                    from: 'donotreply@customerdemourl.com', // sender address
                    // from: 'eata.12@outlook.com', // sender address
                    to: req.params.id, // list of receivers
                    subject: "Forgot Password Request", // Subject line
                    text: "Forgot Password", // plaintext body
                    html: '<p><b>Hi ' + user.name + '</b>,<br /><br />Your Forgot Password Request Token is: ' + getToken + '<br />This token is valid for one time use and for one hour only.<br /> <br /> Thanks </p>' // html body
                };

                ForgotRequest.save(forgotCollection, function (err, user) {
                    smtpProtocol.sendMail(mailData, function (err, info) {
                        if (err) return res.send({ "status": "Error", "message": 'Email not sent', "error": err, "messageCode": "101", "methodName": "Forget Password" });
                        return res.send({ "status": "Success", "message": "Email sent successfully", "response": info.response, "messageCode": "121", "methodName": "Forget Password" });
                    });
                });
            }

        });
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Forget Password" });
    }
});

//
router.route('/forgot').post(function (req, res) {

    try {
        if (!req.body.email || !req.body.token || !req.body.password) {
            return res.send({ "status": "Error", "message": "missing a parameter", "messageCode": "100", "methodName": "Forget Password" });
        }
        else {
            console.log('token: ' + req.body.token)
            ForgotRequest.findOne({ 'email': req.body.email, 'token': req.body.token }, function (err, frequest) {
                // In case of any error, return using the done method
                if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Forget Password" });
                // Username does not exist, log the error and redirect back
                if (!frequest) {
                    return res.send({ "status": "Error", "message": "Invalid Request!", "messageCode": "115", "methodName": "Forget Password" });
                }
                else {
                    var validhours = frequest.validhours;
                    var createdon = new Date(frequest.requeston);
                    createdon.setHours(createdon.getHours() + 1);
                    var startDate = new Date();
                    console.log(createdon)
                    console.log(startDate)
                    console.log(frequest);
                    if (startDate <= createdon && frequest.isactive) {
                        User.findOne({ 'email': req.body.email, 'isDeleted': false }, function (err, user) {
                            if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Forget Password" });
                            if (!user) {
                                return res.send({ "status": "Error", "message": "User not found", "user": user, "messageCode": "109", "methodName": "Forget Password" });
                            }
                            else {
                                User.update({ 'email': req.body.email }, { $set: { 'password': createHash(req.body.password) } }, function (err, results) {
                                    if (err) return res.send({ "status": "Error", "message": err, "messageCode": "101", "methodName": "Forget Password" });
                                    else {
                                        ForgotRequest.update({ 'email': req.body.email, 'token': req.body.token }, { $set: { 'isactive': false } }, function (err, forgotreq) {

                                        });
                                        return res.send({ "status": "Success", "message": "User password updated successfully", "messageCode": "106", "methodName": "Forget Password" });
                                    }
                                });

                            }
                        });
                    }
                    else {
                        return res.send({ "status": "Error", "message": "Token has been expired !", "messageCode": "116", "methodName": "Forget Password" });
                    }
                }
            });
        }
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error", "messageCode": "102", "methodName": "Forget Password" });
    }
});

module.exports = router;


