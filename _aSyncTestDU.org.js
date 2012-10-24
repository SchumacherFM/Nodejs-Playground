#!/usr/bin/env node
/**
 * @author Cyrill @SchumacherFM
 * @date 9/12/12
 * async vs sync demo
 */
var fs = require('fs');

function duSync(path) {
    var total = 0;
    var stat = fs.statSync(path);

    if (stat.isFile()) {
        total += stat.size;
    }
    else if (stat.isDirectory()) {
        var files = fs.readdirSync(path);
        for (var i = 0; i < files.length; i++) {
            total += duSync(path + "/" + files[i]);
            /*recursion*/
        }
//        console.log(path + ": " + total);
    }
    else {
        console.log(path + ": odd file");
    }
    return total;
}

/**
 *
 * @param path string directory name
 * @param callback([object] err,[integer] total)
 */
function duAsync(path, callback) {

    var total = 0;
    fs.stat(path, function cbFsStat(err, stat) {
        if (err) {
            callback(err);
            return;
        }
        if (stat.isFile()) {
            total += stat.size;
            // not executed on the initial call because we have a dir ;-)
            callback(null, total);

        }
        else {
            if (stat.isDirectory()) {

                fs.readdir(path, function (err, files) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    (function _asyncForEach(i, callbacker) {
                        if (i < files.length) {

                            duAsync(path + "/" + files[i], function recursiveCB(err, len) {
                                if (err) {
                                    callbacker(err);
                                    return;
                                }
                                if (len) {
                                    total += len;
                                }
                                _asyncForEach(i + 1, callbacker);
                            });

                        } else {
                            callbacker(null, total);
                        }
                    })(0, callback);


                });

                // (g) what do I do here?
            }
            else {
                console.log(path + ": odd file");
                // (h) and here?
            }
        }
//        console.log(path,total);
    });
    // (i) sounds right, but not in the right place.
    // callback(null, total); misplaced
}

var t0 = Date.now();
duAsync('site', function initialCB(err, totalLen) { /*anon func should have a name for easier debugging */
    if (err) {
        console.log(err);
        return;
    }
    console.log('aSync Result is: %d Kb / Completed in ' + (Date.now() - t0) + 'ms', totalLen / 1024);
});

t0 = Date.now();
var duSyncResult = duSync('site');
console.log('Sync Result is: %d Kb / Completed in ' + (Date.now() - t0) + 'ms', duSyncResult / 1024);


// branching, just testing 8-)
(function (nextFnc, myVal) {
    console.log('a before next() / %s', myVal);
    nextFnc();
    // if or switch statement with branches that may mix sync and async calls.
    // All code paths must end up calling next() or callback(null, result)
})(function () {
    console.log('b after next()');
}, 'Hello World');

/* RESULT IS on my MacBook Air 2011:

 $ ./du.js
 Sync Result is: 21551.8125 Kb / Completed in 49ms
 a before next()
 b after next()
 aSync Result is: 21551.8125 Kb / Completed in 128ms

 */
function error(err, line, cb) {
    if (err) {
        cb(err);
        console.log(err, ': on line ' + line);
        return;
    }
}


function aSyncDu2(path, callback) {
    var totals = 0;

    callback(null, totals);
}

t0 = Date.now();
aSyncDu2('site', function initCb(err, totalLen) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('aSyncDu2 Result is: %d Kb / Completed in ' + (Date.now() - t0) + 'ms', totalLen / 1024);
});