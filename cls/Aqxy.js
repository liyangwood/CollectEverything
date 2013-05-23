/**
 * class 爱情宣言 -- aqxy
 *
 */

var util = require('../lib/util');
var config = require('../config/config');
var mdb = require('../lib/mongo').db;
var db = mdb.bind('aqxy');

var Aqxy = function(xy){
    this.id = xy.id || '';
    if(xy._id){
        this.id = xy._id;
    }
    this.content = xy.content;
    this.authorUuid = xy.authorUuid;
    this.authorName = xy.authorName;

    this.createTime = xy.createTime;

    this.replyNum = xy.replyNum;
    this.lastReplyUuid = xy.lastReplyUuid;
    this.lastReplyName = xy.lastReplyName;


};

Aqxy.prototype.save = function(callback){
    var xy = {
        content : this.content,
        authorUuid : this.authorUuid,
        authorName : this.authorName,
        createTime : new Date().getTime(),
        replyNum : 0,
        lastReplyName : '',
        lastReplyUuid : ''
    };

    db.insert(xy, function(err, rs){
        util.handleError(err);
        callback(new Aqxy(rs[0]));
    });
};

Aqxy.prototype.toJSON = function(){
    var xy = this;
    if(!xy.toJSON){
        return xy;
    }
    return {
        id : xy.id,
        content : xy.content,
        authorUuid : xy.authorUuid,
        authorName : xy.authorName,
        createTime : util.dateFormat(new Date(xy.createTime), 'yy-mm-dd h:m:s'),
        replyNum : xy.replyNum,
        lastReplyName: xy.lastReplyName,
        lastReplyUuid: xy.lastReplyUuid
    };
};

Aqxy.getById = function(id, callback){
    if(id.length !== 24){
        return callback(null);
    }
    db.findOne({_id : mdb.ObjectID.createFromHexString(id)}, function(err, xy){
        util.handleError(err);
        if(xy){
            callback(new Aqxy(xy));
        }
        else{
            callback(null);
        }
    });
};

Aqxy.getAll = function(opts){
    var query = opts.query || {},
        sort = opts.sort || {_id : -1},
        max = opts.maxCount || 50,
        skip = 0;
    db.find(query).sort(sort).limit(max).skip(skip).toArray(function(err, list){
        util.handleError(err);
        var arr = [];
        util.each(list, function(item){
            arr.push(new Aqxy(item).toJSON());
        });
        opts.callback(arr);
    });
};
Aqxy.getNewList = function(opts){
    Aqxy.getAll({
        maxCount : opts.maxCount,
        callback : opts.callback
    });
};

Aqxy.replyNumAddOne = function(id, callback){
    //TODO 没有更新最后的评论者和评论时间，会在Clip class 中处理。

    db.findAndModify({_id : mdb.ObjectID.createFromHexString(id)}, [], {$inc:{replyNum : 1}}, {new : true}, function(err, rs){
        util.handleError(err);
        callback(new Aqxy(rs));
    });
};

module.exports = Aqxy;