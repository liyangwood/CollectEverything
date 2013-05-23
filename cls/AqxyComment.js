/**
 * class 爱情宣言 -- aqxy
 *
 */

var util = require('../lib/util');
var config = require('../config/config');
var mdb = require('../lib/mongo').db;
var db = mdb.bind('aqxycomment');

var AqxyComment = function(comment){
    this.id = comment.id;
    if(comment._id){
        this.id = comment._id;
    }
    this.aqxyId = comment.aqxyId;
    this.comment = comment.comment;
    this.uid = comment.uid;
    this.uname = comment.uname;
    this.replyUid = comment.replyUid;
    this.replyUname = comment.replyUname;

    this.createTime = comment.createTime;


};

AqxyComment.prototype.toJSON = function(){
    var self = this;
    if(!self.toJSON){
        return self;
    }
    return {
        id : self.id,
        aqxyId : self.aqxyId,
        comment : self.comment,
        uid : self.uid,
        uname : self.uname,
        replyUid : self.replyUid,
        replyUname : self.replyUname,
        createTime : util.dateFormat(new Date(self.createTime), 'yy-mm-dd h:m:s')
    };
};

AqxyComment.save = function(ct, callback){
    var one = {
        aqxyId : ct.aqxyId,
        comment: ct.comment,
        uid : ct.uid,
        uname : ct.uname,
        replyUid : ct.replyUid || '',
        replyUname : ct.replyUname || '',
        createTime : new Date().getTime()
    };
    db.insert(one, function(err, rs){
        util.handleError(err);
        callback(new AqxyComment(rs[0]));
    });
};

AqxyComment.getAll = function(opts){
    var query = opts.query || {},
        sort = opts.sort || {_id : -1},
        max = opts.maxCount || 50,
        skip = 0;
    db.find(query).sort(sort).limit(max).skip(skip).toArray(function(err, list){
        util.handleError(err);
        var arr = [];
        util.each(list, function(item){
            arr.push(new AqxyComment(item).toJSON());
        });
        opts.callback(arr);
    });
};

module.exports = AqxyComment;