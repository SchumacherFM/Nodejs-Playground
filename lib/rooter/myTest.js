if (!module.parent) {
    console.log("Please don't call me directly. I am just the main app's minion.");
    process.exit(1);
}

// Third-party libraries
var _ = require('underscore')
,CONF = require('config')
,hbs = require('hbs');

var mysql = require('mysql');

var TEST_DATABASE = 'test';
var myClient = null;


var getMyClient = function(){ /* singleton */
    if( myClient === null ){
        myClient = mysql.createClient({
            host: 'localhost',
            user: 'test',
            password: 'tester2012',
            database: TEST_DATABASE
        });
    }
    return myClient;
}

hbs.registerHelper('myHandlebar',function(myResult,options){

    var fn = options.fn, inverse = options.inverse;

    var myReturn = [];
    myResult.forEach(function(row,index){
        myReturn[index] = fn( row );
    });

    return new hbs.SafeString( myReturn.join('') );
});


var getMySelect = function( table, fields, extra ) {

    extra = extra ? ' ' + extra : '';

    return function( req, res, next ) {

        req.qResult = req.qResult || [];

        getMyClient().query(

            'SELECT `' + fields.join( '`, `' )
            + '` FROM `' + table + '`' + extra,

            function( err, results, fields ) {

                if ( err ) {
                    console.log(err);
                    if ( next ){ next( err ); }

                }

                req.qResult.push( results );

                 if ( next ){ next(); }

            });
    }
}

var myClose = function( req, res, next ) {
    getMyClient().end();
    myClient = null;
    if ( next ){ next(); }
}


// Note: if you need to access smth in parent:
// var something = module.parent.exports.something

var mod_myTest = module.exports;

mod_myTest.prepare = [
    getMySelect('tx_magenerator_domain_model_extname',['uid','name'],'order by rand()'),
    myClose
];

mod_myTest.root = function(req, res) {

    var name = req.param('name', 'stranger');

    var result = req.qResult[0];

    var context = {
        site_title: "myTest Node.js Bootstrap Demo Page",
        name: name,
        rows: result
    }

    res.render('myTest/index', context);

};



mod_myTest.testPage2 = function(req, res) {

    var name = req.param('name', 'stranger');

    var context = {
        site_title: "Test Page 2",
        name: name
    }

    res.render('myTest/testPageTwo', context);

};
