var express = require('express');
var router = express.Router();
var smtp = require('../smtp');
var smtpProtocol = smtp.smtpTransport;

router.route('/sendemail').post(function (req, res) {
    try
    {
var mailData = {
    from: 'testermail4u@gmail.com', // sender address
    to: req.body.toemail, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.body, // plaintext body
    html: '<b>'+req.body.body+'</b>' // html body
};

// send mail with defined transport object
smtpProtocol.sendMail(mailData, function(err, info){
    if (err) return res.send({ "status": "Error","message": err });
	return res.send({ "status": "Success", "message": "Email sent successfully","response":info.response});
});
    } catch (err) {
        return res.send({ "status": "Error", "message": "System Error" });
    }
});
module.exports = router;