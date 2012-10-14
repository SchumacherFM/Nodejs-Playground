if (!module.parent) {
    console.log("Please don't call me directly. I am just the main app's minion.");
    process.exit(1);
}

/**
 * based on the sample data from
 * http://docs.basho.com/riak/latest/tutorials/fast-track/Loading-Data-and-Running-MapReduce-Queries/#Sample Data
 */

// Third-party libraries
var _ = require('underscore'),
    CONF = require('config'),
    hbs = require('hbs');

var RiakClient = require('riak');
var clientCon = null;

// list of riak servers you'd like to load balance over (poolee handles this).
var servers = ['127.0.0.1:8098'];
// should be unique, used by riak if you don't supply a vector clock
// default value: random integer
var client_id = 'goog-test-client';
// informative name for logging purposes etc
var pool_name = 'goog-pool';


var getMyClient = function () {
    if (clientCon === null) {
        clientCon = new RiakClient(servers, client_id, pool_name);
        clientCon.debug_mode = false;
    }
    return clientCon;
};

clientCon.on("metrics", function (type, key, val) {
    console.log("riak metric: " + type + ", " + key + "=" + val);
});

var options = {
    http_headers: {},
    mime_types: [], // list of content-types. TODO: never referenced in the code?
    return_body: false,

    // more supported options:
    // r_val: <number>, // default is whatever Riak's default is, usually basic quorum
    // w_val: <number>, // default is whatever Riak's default is, usually basic quorum
    // retry: <bool>,   // default = true, will retry gets with exponential backoff when recieving a 404
    // parse: <bool>,   // default = true, will parse riak response assuming it is json
    // resolver: <fn>,  // no default = used to resolve sibling values
};
client.get('goog', '2010-04-12', options, function(error, response, object){
    console.log(error, response, object);
});

hbs.registerHelper('myHandlebar2', function (myResult, options) {

    var fn = options.fn, inverse = options.inverse;

    var myReturn = [];
//    myResult.forEach(function (row, index) {
//        myReturn[index] = fn(row);
//    });

    return new hbs.SafeString(myReturn.join(''));
});


// Note: if you need to access smth in parent:
// var something = module.parent.exports.something

module.exports.testPage = function (req, res) {

    var name = req.param('name', 'stranger');

    var context = {
        site_title:"Test Page 2",
        name:name
    }

    res.render('myTest/testPageTwo', context);

};
