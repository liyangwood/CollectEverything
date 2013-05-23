/**
 * class Mark
 *
 */

var util = require('../lib/util');
var config = require('../config/config');
var mdb = require('../lib/mongo').db;
var db = mdb.bind('mark');

var Mark = {
    save : function(opts, callback){
        var clip = {
            clipId : opts.clipId,
            text : opts.text || '',
            position : opts.position,

            comment : opts.comment,
            authorName : opts.authorName,
            authorUuid : opts.authorUuid,
            createTime : new Date().getTime(),

            replyNum : 0
        };

        db.insert(clip, function(err, rs){
            util.handleError(err);
            callback(Mark.toJSON(rs[0]));
        });

    },

    toJSON : function(mark){
        return {
            id : mark._id,
            clipId : mark.clipId,
            text : mark.text,
            position : mark.position,

            comment : mark.comment,
            authorName : mark.authorName,
            authorUuid : mark.authorUuid,
            createTime : util.dateFormat(new Date(mark.createTime), 'yy-mm-dd h:m:s'),

            replyNum : mark.replyNum
        };
    },

    getByClipId : function(clipId, callback){
        db.find({clipId : clipId}).sort({createTime : 1}).toArray(function(err, list){
            util.handleError(err);
            var arr = [];
            util.each(list, function(item){
                arr.push(Mark.toJSON(item));

            });
            callback(arr);
        });
    },

    getById : function(id, callback){
        if(id.length !== 24){
            return callback(null);
        }
        db.findOne({_id : mdb.ObjectID.createFromHexString(id)}, function(err, rs){
            util.handleError(err);
            if(rs){
                callback(Mark.toJSON(rs));
            }
            else{
                callback(null);
            }
        });
    },

    replyNumAddOne : function(id, callback){
        db.findAndModify({_id : mdb.ObjectID.createFromHexString(id)}, [], {$inc:{replyNum : 1}}, {new : true}, function(err, rs){
            util.handleError(err);
            util.stringify(rs);
            callback(Mark.toJSON(rs));
        });
    }



};

module.exports = Mark;