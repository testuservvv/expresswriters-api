var express = require('express');
var router = express.Router();


router.route('/').get(function (req, res) {
    res.send("Welcome to UVI APIs");
});




module.exports = router;


