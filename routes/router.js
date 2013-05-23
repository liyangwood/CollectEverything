/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-1-10
 * Time: 上午12:04
 * To change this template use File | Settings | File Templates.
 */

var index = require('./index');
var rdo = require('./do');
var user = require('./user');
var team = require('./team');
var User = require('../cls/User');
var aqxy = require('./aqxy');
var clip = require('./clip');
module.exports = function(app){

    //common interface
    app.all('/do', checkUserLogin, rdo.get);

    //user
    app.get('/', checkUserLogin, index.render);
    app.get('/reg', checkUserLogin, user.reg);
    app.get('/login', checkUserLogin, user.login);
    app.get('/logout', user.logout);

    //aqxy
    app.get('/aqxy/publish', checkUserLogin, aqxy.publish);
    app.get('/aqxy/new', checkUserLogin, aqxy.new);
    app.get('/aqxy/:uid', checkUserLogin, aqxy.newForUser);

    //clip
    app.get('/clip/publish', checkUserLogin, clip.publish);
    app.get('/clip/new', checkUserLogin, clip.new);
    app.get('/clip/:clipid', checkUserLogin, clip.clip);

    // team
    app.get('/team/aboutus', checkUserLogin, team.aboutus);
    app.get('/team/contractus',checkUserLogin, team.contractus);
};


function checkUserLogin(req, res, next){
    User.checkIsLogin(req, res, function(user){
        if(user){
            req.session.var = {
                user : User.get(user),
                isLogin : true
            };
        }
        else{
            req.session.var = {
                user : null,
                isLogin : false
            };
        }
        next();
    });
}