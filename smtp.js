var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 587,
    auth: {
        user: "testermail4u@gmail.com",
        pass: "micr0s0ft"
    }
}));

module.exports = {

    'smtpTransport': smtpTransport,
   
};