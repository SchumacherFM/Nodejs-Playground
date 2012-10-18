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

var riak = require('riak-js').getClient({host : '127.0.0.1', port : 8098, debug : true});

// http://riakjs.com/

module.exports.riakGet = function (req, res) {

    riak.get('goog', '2010-04-12', function riakClientGet(error, response, meta) {
        if (error) {
            return console.log(error);
        }
//        console.log(response);
//        console.log(meta);

        var rrHtml = [];
        _.each(response, function (v, k) {
            rrHtml.push(k + ' = ' + v);
        });

        var context = {
            site_title : "Test Page 2",
            'riakRes' : rrHtml.join('<br>')
        };

//        console.log(context);

        res.render('myTest/testRiak', context);

    });
};

module.exports.riakMapReduce = function (req, res) {


    // runs in riak env
    function mapper(value, keyData, arg) {
        var data = Riak.mapValuesJson(value)[0];
        if (data.High && data.High > 600.00) {
            return [value.key];
        } else {
            return [];
        }
    }

    // runs in riak env
    function reducer(value, count, arg) {

    }

    function runner(error, data, meta) {
        if (error) {
            return console.log(error);
        }

        console.log(data);
    }

    riak.add('goog').map(mapper).reduce(reducer).run(runner);


    var context = {
        site_title : "Test Page 2",
        'riakRes' : 'Hello'
    };

//        console.log(context);

    res.render('myTest/testRiakMapReduce', context);

};


module.exports.riakGetAll = function (req, res) {

    var counter = 0;
    riak.count('goog', function (err, data, meta) {
        counter = data;
        console.log('CB: ' + counter);
    });


    riak.getAll('goog', function riakClientGet(error, response, meta) {
        if (error) {
            return console.log(error);
        }
        console.log('Not CB: ' + counter);

//        console.log(response);
//        console.log(meta);

        var context = {
            site_title : "Test Page 2",
            'riakAll' : response
        };

        res.render('myTest/testRiak', context);

    });


};
