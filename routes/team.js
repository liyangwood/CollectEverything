/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-1-10
 * Time: 上午12:12
 * To change this template use File | Settings | File Templates.
 */

var util = require('../lib/util');
exports.aboutus = function(req, res){
    var tmp = req.session.var;
    res.render('aboutus', {
        pageTitle: '关于我们',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};

exports.contractus = function(req, res){
    var tmp = req.session.var;
    res.render('contractus', {
        pageTitle: '联系我们',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};