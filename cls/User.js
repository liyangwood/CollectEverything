/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-1-11
 * Time: 上午1:33
 * To change this template use File | Settings | File Templates.
 */

var util = require('../lib/util');
var config = require('../config/config');
var db = require('../lib/mongo').db;
db.user = db.bind('user');

var User = function(user){
    this.name = user.name;
    this.uuid = user.uuid;
    this.password = user.password;

    this.nickname = user.nickname || '匿名用户';
    this.age = user.age || '';
    this.email = this.name;

    this.createTime = user.createTime;
};

User.prototype.save = function(callback){
    var user = {
        uuid : util.getUUID(),
        name : this.name,
        password : util.md5(this.password),
        nickname : this.nickname,
        age : this.age,
        email : this.email,

        createTime : new Date().getTime()
    };
    db.user.ensureIndex('name', {unique : true});
    db.user.insert(user, function(err, rs){
        util.handleError(err);
        callback(rs);
    });
};

User.get = function(user){
    if(user.password){
        return {
            uuid : user.uuid,
            name : user.name,
            nickname : user.nickname,
            age : user.age,
            email : user.email,
            createTime : util.dateFormat(new Date(user.createTime), 'yy年mm月dd日 h时m分s秒')
        };
    }
    else{
        return user;
    }
};

User.prototype.setCookie = function(req, res){
    var auth = util.encrypt(this.name+'\t'+this.password, config.cookieSecret);
    res.cookie(config.cookieAuthName, auth, {
        path : '/',
        maxAge : config.cookieExpress
    });
};

User.getUser = function(name, callback){
    db.user.findOne({name:name}, function(err, user){
        util.handleError(err);
        if(user){
            callback(new User(user));
        }
        else{
            callback(null);
        }
    });
};

User.checkPassword = function(name, password, callback){
    User.getUser(name, function(user){
        if(user){
            if(password === user.password || util.md5(password) === user.password){
                callback(true, user);
            }
            else{
                callback(false, '密码不正确');
            }
        }
        else{
            callback(false, '用户名不正确');
        }
    });
};

User.checkIsLogin = function(req, res, callback){
    if(req.session.user){
        return callback(req.session.user);
    }
    var auth = req.cookies[config.cookieAuthName];
    if(!auth) return callback(null);
    auth = util.decrypt(auth, config.cookieSecret).split('\t');
    var name = auth[0],
        password = auth[1];
    User.checkPassword(name, password, function(f, user){
        if(f){
            req.session.user = user;
            return callback(user);
        }
        else{
            return callback(null);
        }
    });
};

User.getAllUser = function(opt){
    var max = opt.maxCount || 50,
        skip = opt.skip || 0;
    db.user.find().limit(max).skip(skip).sort('createTime', -1).toArray(function(err, userList){
        util.handleError(err);
        var arr = [];
        util.each(userList, function(item){
            arr.push(User.get(item));
        });
        opt.callback(arr);
    });
};

module.exports = User;