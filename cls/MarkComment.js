/**
 * class MarkComment
 *
 */

var util = require('../lib/util');
var config = require('../config/config');
var mdb = require('../lib/mongo').db;
var db = mdb.bind('markComment');

var MarkComment = {
    addComment : function(opts, callback){
        var clip = {
            mid : opts.mid,
            comment : opts.comment,
            authorName : opts.authorName,
            authorUuid : opts.authorUuid,
            createTime : new Date().getTime()
        };

        db.insert(clip, function(err, rs){
            util.handleError(err);
            callback(MarkComment.toJSON(rs[0]));
        });

    },

    toJSON : function(mc){
        return {
            id : mc._id,
            mid : mc.mid,

            comment : mc.comment,
            authorName : mc.authorName,
            authorUuid : mc.authorUuid,
            createTime : util.dateFormat(new Date(mc.createTime), 'yy-mm-dd h:m:s')
        };
    },

    getCommentByMid : function(mid, callback){
        db.find({mid : mid}).sort({createTime : -1}).toArray(function(err, list){
            util.handleError(err);
            var arr = [];
            util.each(list, function(item){
                arr.push(MarkComment.toJSON(item));

            });
            callback(arr);
        });
    }





};

module.exports = MarkComment;