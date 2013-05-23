
var imp = require('../import');
var util = imp.util;
var Clip = imp.Clip;

exports.publish = function(req, res){
    var tmp = req.session.var;
    res.render('clip/publish', {
        pageTitle: '发布新宣言',
        isLogin : tmp.isLogin,
        user : tmp.user
    });
};

exports.new = function(req, res){
    var tmp = req.session.var;
    Clip.getAll({}, function(list){
        res.render('clip/new', {
            pageTitle : '最新宣言',
            isLogin : tmp.isLogin,
            user : tmp.user,
            clipList : list
        });
    });
};

exports.clip = function(req, res){
    var tmp = req.session.var;
    var clipid = req.params.clipid;
    Clip.getById(clipid, function(rs){
        res.render('clip/clip', {
            pageTitle : rs.title,
            isLogin : tmp.isLogin,
            user : tmp.user,
            clip : rs
        });
    });
};

