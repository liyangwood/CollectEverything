var CEStatic = require('./var');

module.exports = {
	//mongoDB
	mongoDBUrl : 'http://127.0.0.1',
	mongoDBPort : '27017',
	mongoDBName : 'CEData',
	
	//global
	version : '0.0.1',
    serverPort : process.env.PORT || 80,

    //cookie
    cookieExpress : 1000*60*60*24*7,
    cookieAuthName : 'CEId',
    sessionSecret : 'cebyjacky1983',
    cookieSecret : 'cebyjacky1983',

    //comment
    aqxyCommentPageNum : 10,

    //site info
    siteName : 'CollectEverything',


    //Global Static
    CEStatic : CEStatic,

    //ahout me
    author : {
        name : 'Jacky',
        email : 'liyangwood@gmail.com'
    }

};