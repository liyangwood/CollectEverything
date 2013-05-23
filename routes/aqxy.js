

var imp = require('../import');
var util = imp.util;
var Aqxy = imp.Aqxy;

exports.publish = function(req, res){
    var tmp = req.session.var;
    res.render('aqxy/publish', {
        pageTitle: '发布新宣言',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};

exports.new = function(req, res){
    var tmp = req.session.var;
    Aqxy.getNewList({
        callback: function(list){
            res.render('aqxy/new', {
                pageTitle : '最新宣言',
                isLogin : tmp.isLogin,
                user : tmp.user,
                xyList : list
            });
        }
    });
}

exports.newForUser = function(req, res){
    var tmp = req.session.var;
    var uid = req.params.uid;
    Aqxy.getAll({
        query : {authorUuid : uid},
        callback : function(list){
            res.render('aqxy/new', {
                pageTitle : '用户的宣言',
                isLogin : tmp.isLogin,
                user : tmp.user,
                xyList : list
            });
        }
    });
}