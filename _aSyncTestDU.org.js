#!/usr/bin/env node
/**
 * @author Cyrill @SchumacherFM
 * @date 9/12/12
 * async vs sync demo
 */
var fs = require('fs');

// module pattern
// start is not accessible from outside
var timer2 = (function () {

    var _start = process.hrtime();

    var reset = function () {
        _start = process.hrtime();
    };

    var _getMilliDiff = function () {
        var _diff = process.hrtime(_start);
        return Math.round(_diff[1] / 1000000);
    };
    var timeOver = function (text) {
        console.log(text + ' / Time: x sec ' + _getMilliDiff() + 'ms T2');
    };

    return {
        'reset' : reset,
        'timeOver' : timeOver
    };
})();


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

                    // Immediately-Invoked Function Expression (IIFE)
                    (function _asyncForEachIIFE(i, callbacker) {
                        if (i < files.length) {

                            duAsync(path + "/" + files[i], function recursiveCB(err, len) {
                                if (err) {
                                    callbacker(err);
                                    return;
                                }
                                if (len) {
                                    total += len;
                                }
                                _asyncForEachIIFE(i + 1, callbacker);
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


timer2.reset();
duAsync('node_modules', function initialCB(err, totalLen) { /*anon func should have a name for easier debugging */
    if (err) {
        console.log(err);
        return;
    }
    console.log('aSync IIFE Result is: %d Kb', Math.round(totalLen / 1024));
    timer2.timeOver('aSync IFFE Timer');
});

timer2.reset();
var duSyncResult = duSync('node_modules');
console.log('Sync Result is: %d Kb', Math.round(duSyncResult / 1024));
timer2.timeOver('Sync Timer');


/* RESULT IS on my MacBook Air 2011:
 Sync Result is: 10201 Kb
 _Sync Timer / Time: x sec 58ms T2
 aSync Result is: 10201 Kb
 aSync Timer / Time: x sec 141ms T2 // IIFE
 */
function error(err, line, cb) {
    if (err) {
        cb(err);
        console.log(err, ': on line ' + line);
        return;
    }
}
