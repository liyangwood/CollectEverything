
var util = require('../lib/util');
var User = require('../cls/User');
exports.render = function(req, res){
    var tmp = req.session.var;
    User.getAllUser({
        callback : function(userList){
            res.render('index', { pageTitle: '首页', isLogin : tmp.isLogin, user: tmp.user, userList: userList});
        }
    });

};

