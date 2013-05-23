var imp = require('../import');

var User = imp.User;
var util = imp.util;
var Aqxy = imp.Aqxy;
var AqxyComment = imp.AqxyComment;
var Clip = imp.Clip;
var Mark = imp.Mark;
var MarkComment = imp.MarkComment;


exports.get = function(req, res){
    var method = req.method.toLowerCase();
    var param = '';
    if(method == 'get'){
        param = req.query;
    }
    else if(method == 'post'){
        param = req.body;
    }

    if(param.MsgType){
        var type = param.MsgType;
        delete param.MsgType;
        twttr({
            MsgType : type,
            Param : param,
            Request : req,
            Response : res
        });
    }
    else{
        res.jsonp(format(false, '没有MsgType参数！'));
    }

};

function format(status, de, statusText){
    statusText = statusText || '';
    if(status){
        return {
            Status : 1,
            Data : de,
            StatusText : statusText,
            Error : ''
        };
    }
    else{
        return {
            Status : -1,
            Data : '',
            StatusText : '',
            Error : de
        };
    }

}

function twttr(opt){
    var type = opt.MsgType,
        param = opt.Param,
        req = opt.Request,
        res = opt.Response;

    switch(type){
        //user
        case 'RegUser':
			regUser(param, req, res);
            break;
        case 'GetUser':
            getUser(param, req, res);
            break;
        case 'Login':
            login(param, req, res);
            break;

        //aqxy
        case 'PublishAqxy':
            publishAqxy(param, req, res);
            break;
        case 'ReplyAqxy':
            replyAqxy(param, req, res);
            break;

        //upload image
        case 'UploadImage':
            uploadImage(param, req, res);
            break;

        //clip
        case 'PublishClip':
            publishClip(param, req, res);
            break;
        case 'ReplyClip':
            replyClip(param, req, res);
            break;

        //mark
        case 'AddClipMark':
            addClipMark(param, req, res);
            break;
        case 'GetMarkByClipId':
            getMarkByClipId(param, req, res);
            break;
        case 'GetMarkById':
            getMarkById(param, req, res);
            break;
        case 'GetCommentByMid':
            getCommentByMid(param, req, res);
            break;
        case 'AddClipMarkComment':
            addClipMarkComment(param, req, res);
            break;

        default :
            res.jsonp(format(false, type+'还没有被支持！'));
    }
}

function checkLogin(tmp, res){
    if(!tmp.isLogin){
        res.jsonp(format(false, '没有登录'));
        return false;
    }
    return true;
}

function regUser(param, req, res){
	var name = param.name,
        password = param.password,
        nickname = param.nickname;
    User.getUser(name, function(user){
        if(user){
            res.jsonp(format(false, '该用户名已经被使用'));
        }
        else{
            var user = new User({
                name : name,
                password : password,
                nickname : nickname
            });
            user.save(function(rs){
                res.jsonp(format(true, {}, '注册成功'));
            });
        }
    });
}

function login(param, req, res){
    var name = param.name,
        password = param.password;
    User.checkPassword(name, password, function(flag, textoruser){
        if(flag){
            //login success
            textoruser.setCookie(req, res);
            req.session.user = textoruser;
            res.jsonp(format(true, User.get(textoruser), '登录成功'));
        }
        else{
            res.jsonp(format(false, textoruser));
        }
    });
}

function publishAqxy(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var content = param.content;
    if(content.length < 20){
        res.jsonp(format(false, '发布内容少于20字'));
        return;
    }
    var xy = new Aqxy({
        content : content,
        authorUuid: tmp.user.uuid,
        authorName: tmp.user.nickname
    }).save(function(rs){
        res.jsonp(format(true, rs.toJSON(), '发布成功'));
    });
}

function replyAqxy(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var comment = param.comment || 'Good';
    AqxyComment.save({
        aqxyId : param.aqxyId,
        comment : comment,
        uid : tmp.user.uuid,
        uname : tmp.user.nickname,
        replyUid : param.replyUid || null,
        replyUname : param.replyUname || null
    }, function(rs){
        Aqxy.replyNumAddOne(param.aqxyId, function(rs){
            res.jsonp(format(true, rs.toJSON(), '评论成功'));
        });
    });

}

function uploadImage(param, req, res){
    

}

function publishClip(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var title = param.title;
    if(!title){
        res.jsonp(format(false, '没有题目'));
        return;
    }

    var content = param.content;
    if(!content){
        res.jsonp(format(false, '没有正文'));
        return;
    }

    var tagReg = /<(?:.|\s)*?>/g;
    var tp = content.replace(tagReg, "");
    var brief = tp.substring(0, tp.length>50?50:tp.length);

    Clip.save({
        title : title,
        brief : brief,
        content : content,
        authorUuid: tmp.user.uuid,
        authorName: tmp.user.nickname
    }, function(rs){
        res.jsonp(format(true, {}, '发布成功'));
    });
}

function replyClip(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var comment = param.comment || 'Good';
    var id = param.clipid;
    var time = new Date().getTime();

    Clip.addComment({
        id : id,
        lastReplyUuid : tmp.user.uuid,
        lastReplyName: tmp.user.nickname,
        lastReplyTime: time
    }, function(rs){
        res.jsonp(format(true, rs, '评论成功'));
    });

}

function addClipMark(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var comment = param.comment || 'this is a test mark';

    Mark.save({
        clipId : param.clipId,
        text : param.text,
        position : param.position,

        comment : comment,
        authorName : tmp.user.nickname,
        authorUuid : tmp.user.uuid

    }, function(rs){
        MarkComment.addComment({
            mid : rs.id.toString(),
            comment : comment,
            authorName : tmp.user.nickname,
            authorUuid : tmp.user.uuid
        }, function(rs1){
            Mark.replyNumAddOne(rs.id.toString(), function(rs2){
                res.jsonp(format(true, rs2, '发布Mark成功'));
            });
        });

    });
}

function getMarkByClipId(param, req, res){
    Mark.getByClipId(param.clipId, function(rs){
        res.jsonp(format(true, rs, 'ok'));
    });
}

function getMarkById(param, req, res){
    Mark.getById(param.id, function(rs){
        res.jsonp(format(true, rs, 'ok'));
    });
}

function addClipMarkComment(param, req, res){
    var tmp = req.session.var;
    if(!checkLogin(tmp, res)) return;

    var comment = param.comment;
    MarkComment.addComment({
        mid : param.mid,
        comment : comment,
        authorName : tmp.user.nickname,
        authorUuid : tmp.user.uuid
    }, function(rs){
        Mark.replyNumAddOne(param.mid, function(rs2){
            res.jsonp(format(true, rs, '评论成功'));
        });
    });

}

function getCommentByMid(param, req, res){
    MarkComment.getCommentByMid(param.mid, function(list){
        util.stringify(list);
        res.jsonp(format(true, list, 'ok'));
    });
}