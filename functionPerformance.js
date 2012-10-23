#!/usr/bin/env node
/**
 * @author Cyrill @SchumacherFM
 * @date 10/23/12
 * function performance demo
 */
var fs = require('fs');

/*******************************************************/
var timer = function () {
    this._start = 0;
};

timer.prototype.reset = function () {
    this._start = new Date().getUTCMilliseconds();
}

timer.prototype.getTime = function () {
    this._end = new Date().getUTCMilliseconds();
    return (this._end - this._start );
};

timer.prototype.timeOver = function (text) {
    console.log(text + ' / Time: ' + this.getTime() + 'ms');
};

/*******************************************************/
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
    iterations = 5000000;

/*******************************************************/
var theTimer = new timer();

theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    aFunc(i);
}
theTimer.timeOver('Loop1');

theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    (function (c) {
        count2 += parseInt(c);
        count2 = Math.sqrt(count2);
    })(i);
}
theTimer.timeOver('Loop2');


theTimer.reset();
for (var i = 0; i < iterations; ++i) {
    (function (c) {
        count3 += calculations(i);
    })(i);
}
theTimer.timeOver('Loop3');

