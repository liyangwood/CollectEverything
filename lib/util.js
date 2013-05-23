

//date format  yy/mm/dd h/m/s
function dateFormat(date, format){
    var d = date;
    var yy = d.getFullYear(),
        mm = d.getMonth()+ 1,
        dd = d.getDate(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds();
    return format.replace('yy', yy).replace('mm', mm).replace('dd', dd).replace('h', h).replace('m', m).replace('s', s);
}



var crypto = require('crypto');

exports.md5 = function md5(str){
    return crypto.createHash('md5').update(str).digest('base64');
}

/**
 * 加密方法
 * @param str
 * @param secret
 */
exports.encrypt = function encrypt(str, secret){
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

/**
 * 解密函数
 * @param str
 * @param secret
 * @return {*|Progress}
 */
exports.decrypt = function decrypt(str, secret){
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

var fs = require('fs');
var debugLogFile = fs.createWriteStream('./log/debug.log', {flags : 'a'});
/**
 *  log function
 * @param str
 */
exports.log = function log(str){
    str = str+' -- [' + dateFormat(new Date(), 'yy年mm月dd日 h时m分s秒') + ']'+'\n';
    console.log(str);
    //debugLogFile.write(str);
}
exports.stringify = function(json){
    exports.log(require('util').inspect(json));
}

exports.handleError = function(err){
    if(err){
        throw err;
    }
};

exports.dateFormat = dateFormat;

var uuid = require('node-uuid');
exports.getUUID = function(){
    return uuid.v4().replace(/-/g, '');
};

exports.each = function(obj, callback){
    for(var x in obj){
        callback(obj[x], x);
    }
};