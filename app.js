
/**
 * site
 */

var express = require('express'),
	http = require('http'),
    router = require('./routes/router'),
    config = require('./config/config'),
    MongoStore = require('connect-mongo')(express),
    util = require('./lib/util'),
	path = require('path');

var fs = require('fs'),
    accessLogFile = fs.createWriteStream('./log/access.log', {flags : 'a'}),
    errorLogFile = fs.createWriteStream('./log/error.log', {flags : 'a'});

var app = express();

app.configure(function(){
    app.set('port', config.serverPort);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    //app.use(express.logger({stream : accessLogFile}));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    app.use(express.session({
        secret : config.sessionSecret,
        store : new MongoStore({
            db : config.mongoDBName
        })
    }));

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(function(err,req,res,next){
        errorLogFile.write('['+ util.dateFormat(new Date(), 'yy年mm月dd日 h时m分s秒') +']' + err.stack + '\n');
        express.errorHandler()(err, req, res, next);
        res.send(500, err.stack);
        next();
    });

    app.locals({
        static : require('./config/localStatic')
    });
});

router(app);



//app.configure('development', function(){
    //app.use(express.errorHandler());
//});



http.createServer(app).listen(app.get('port'), function(){
  console.log("----------------- "+config.siteName+" server is start at port " + app.get('port')+'---------------------');
});
