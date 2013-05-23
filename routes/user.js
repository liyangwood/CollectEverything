
var util = require('../lib/util');
var config = require('../config/config');

exports.reg = function(req, res){
    var tmp = req.session.var;
    res.render('reg', {
        pageTitle: '注册新用户',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};

exports.login = function(req, res){
    var tmp = req.session.var;
    res.render('login', {
        pageTitle: '用户登录',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};

exports.logout = function(req, res){
    req.session.user = null;
    res.clearCookie(config.cookieAuthName, {path : '/'});
    res.redirect('/');
}