/**
 * class Clip
 *
 */

var util = require('../lib/util');
var config = require('../config/config');
var mdb = require('../lib/mongo').db;
var db = mdb.bind('clip');

var Clip = {
    save : function(opts, callback){
        var clip = {
            title : opts.title,
            brief : opts.brief,
            content : opts.content,
            authorUuid : opts.authorUuid,
            authorName : opts.authorName,
            createTime : new Date().getTime(),

            replyNum : 0,
            lastReplyName : '',
            lastReplyUuid : '',
            lastReplyTime : ''
        };

        db.insert(clip, function(err, rs){
            util.handleError(err);
            callback(Clip.getClip(rs));
        });

    },

    getAll : function(opts, callback){
        var query = opts.query || {},
            sort = opts.sort || {_id : -1},
            max = opts.maxCount || 50,
            skip = 0;
        db.find(query).sort(sort).limit(max).skip(skip).toArray(function(err, list){
            util.handleError(err);
            var arr = [];
            util.each(list, function(item){
                arr.push(Clip.getClipOfNoContent(item));
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
                callback(Clip.getClip(rs));
            }
            else{
                callback(null);
            }
        });
    },

    addComment : function(opts, callback){
        var id = opts.id;
        db.findAndModify({_id : mdb.ObjectID.createFromHexString(id)}, [], {
            $inc:{replyNum : 1},
            $set:{
                lastReplyUuid : opts.lastReplyUuid,
                lastReplyName : opts.lastReplyName,
                lastReplyTime : opts.lastReplyTime
            }
        }, {new : true}, function(err, rs){
            util.handleError(err);
            util.stringify(rs);
            callback({replyNum : rs.replyNum});
        });
    },



    getClip : function(clip){
        return {
            id : clip._id,
            title : clip.title,
            brief : clip.brief,
            content : clip.content,
            authorUuid : clip.authorUuid,
            authorName : clip.authorName,
            createTime : util.dateFormat(new Date(clip.createTime), 'yy-mm-dd h:m:s'),

            replyNum : clip.replyNum,
            lastReplyName: clip.lastReplyName,
            lastReplyUuid: clip.lastReplyUuid,
            lastReplyTime: util.dateFormat(new Date(clip.lastReplyTime), 'yy-mm-dd h:m:s')
        };

    },
    getClipOfNoContent : function(clip){
        var rs = Clip.getClip(clip);
        delete rs.content;
        return rs;
    }

};

module.exports = Clip;