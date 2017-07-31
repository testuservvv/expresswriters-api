var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config'); // get our config file
var cors = require('cors');

//var cors = require('./cors'); // get our config file
// Model path
var mongoose = require('mongoose');
var jobSchema = require('./models/job');
var roleSchema = require('./models/role');
var jobRoleSchema = require('./models/jobrole');
var jobSchema = require('./models/availibility');
//  'mongodb://127.0.0.1:27017/test'
mongoose.connect(process.env.MONGOLAB_URI || config.database, function (error) {
   if (error) console.error(error);
   else console.log('mongo connected');
});
var jwt = require('jsonwebtoken');

var app = module.exports = express();






app.set('superSecret', config.secret); // secret variable

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var jobs = require('./routes/jobs.js');
var availibility = require('./routes/availibility.js');
var jobsrole=require('./routes/jobsrole.js');
var users = require('./routes/users.js');
var tests = require('./routes/tests.js');
var setting = require('./routes/setting.js');
var services = require('./routes/services.js');
var categories = require('./routes/categories.js');
var clients = require('./routes/clients.js');
var style = require('./routes/style.js');
var tags = require('./routes/tags.js');
var orders = require('./routes/orders.js');
var tasks = require('./routes/tasks.js');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
res.header('access-control-allow-origin', '*');
  res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');
  res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');

    // Pass to next layer of middleware
    next();
});
app.use('/api/v1', jobs);
app.use('/api/v1', availibility);
app.use('/api/v1', jobsrole);
app.use('/api/v1', users);
app.use('/api/v1', tests);
app.use('/api/v1', setting);
app.use('/api/v1', services);
app.use('/api/v1', categories);
app.use('/api/v1', clients);
app.use('/api/v1', style);
app.use('/api/v1', tags);
app.use('/api/v1', orders);
app.use('/api/v1', tasks);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({ "status": "Error", "message": err.message, "error": err });
    });
}



// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({ "status": "Error", "message": err.message,  "error": err });
});

app.use(function (err, req, res, next) {
    res.send({ "status": "Error", "message": err.message,  "error": err });
});


//
// var jRole = jobRoleSchema({
//     name: 'User',
//     isdeleted: false
// });
//
// // save the user
// jRole.save(function(err) {
//     if (err) throw err;
//
//     console.log('jRole created!');
// });



module.exports = app;
