var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    config = require('./config'),
    i18n = require("i18n"),
    exphbs = require('express-handlebars'),
    handlebars = require('handlebars');

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        __: function(str) {
          return (i18n != undefined ? i18n.t(str) : str);
        },
        foo: function () { return 'BAR!'; }
    }
});

var routes = require('./routes/index');

var app = express();

i18n.configure({
    defaultLocale: "en",
    directory: __dirname + '/locales',
    autoReload: true
});

i18n.setLocale(config.locale);

// default: using 'accept-language' header to guess language settings
app.use(i18n.init);

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
