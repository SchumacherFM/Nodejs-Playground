/**
 * @author Cyrill @SchumacherFM
 * @date 11/5/12
 */

var async = require('async'),
    fs = require('fs');

async.map(['server.js', 'start.sh', 'package.json'], fs.stat, function (err, results) {
    results.forEach(function(value,index){
        console.log(index,value.size);
    });
});
