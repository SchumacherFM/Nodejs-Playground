#!/usr/bin/env node
/**
 * @author Cyrill @SchumacherFM
 * @date 10/23/12
 * function performance demo
 */

/****
* Result:
         Loop1 / Time: 0 sec 237 ms
         Loop2 / Time: 0 sec 129 ms
         Loop3 / Time: 0 sec 516 ms
         Loop4 / Time: 0 sec 362 ms
*/

 /*******************************************************/
var timer = function () {
    this._start = 0;
};

timer.prototype.reset = function () {
    this._start = process.hrtime();
}

timer.prototype.getMilliDiff = function () {
    return process.hrtime(this._start);
};

timer.prototype.timeOver = function (text) {
    var diff = this.getMilliDiff();
    console.log(text + ' / Time: ' + diff[0] + ' sec ' + Math.round(diff[1] / 1000000) + ' ms');
};

/*******************************************************/
// using parseInt just for fun
var calculations = function (calc) {
    calc = parseInt(calc);
    return Math.sqrt(calc);
}

var aFunc = function (c) {
        count1 += parseInt(c);
        count1 = Math.sqrt(count1);
    },
    count1 = 0,
    count2 = 0,
    count3 = 0,
    count4 = 0,
    iterations = 7000000;

/*******************************************************/
var theTimer = new timer();

theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    aFunc(i);
}
theTimer.timeOver('Loop1');

theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    count2 += calculations(i);
}
theTimer.timeOver('Loop2');


theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    (function (c) {
        count3 += parseInt(c);
        count3 = Math.sqrt(count3);
    })(i);
}
theTimer.timeOver('Loop3');


theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    (function (c) {
        count4 += calculations(i);
    })(i);
}
theTimer.timeOver('Loop4');
