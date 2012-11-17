#!/usr/bin/env node
/**
 * @author Cyrill @SchumacherFM
 * @date 10/23/12
 * function performance demo
 */

/****
 * Result:
 Loop1 / Time: x sec 276ms T2
 Loop2 / Time: 0 sec 219 ms
 Loop3 / Time: 0 sec 553 ms
 Loop4 / Time: 0 sec 374 ms
 Loop5 / Time: 0 sec 221 ms
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
    'reset'    : reset,
    'timeOver' : timeOver
  };
})();

/*******************************************************/
// using parseInt just for fun
var calculations = function (calc) {
  calc = parseInt(calc);
  return Math.sqrt(calc);
}

var aFunc = function (c) {
    count += parseInt(c);
    count = Math.sqrt(count);
  },
  count = 0,
  iterations = 7000000;

/*******************************************************/
var theTimer = new timer(),
  theTimer2 = timer2;

theTimer.reset();
for (var i = 0; i < iterations; ++i) {
  aFunc(i);
}
theTimer2.timeOver('Loop1');

theTimer.reset();
count = 0;
for (var i = 0; i < iterations; ++i) {
  count += calculations(i);
}
theTimer.timeOver('Loop2');

theTimer.reset();
count = 0;
for (var i = 0; i < iterations; ++i) {
  (function (c) {
    count += parseInt(c);
    count = Math.sqrt(count);
  })(i);
}
theTimer.timeOver('Loop3');

theTimer.reset();
count = 0;
for (var i = 0; i < iterations; ++i) {
  (function (c) {
    count += calculations(i);
  })(i);
}
theTimer.timeOver('Loop4');

theTimer.reset();
count = 0;
for (var i = 0; i < iterations; ++i) {
  count += parseInt(i);
  count = Math.sqrt(count);
}
theTimer.timeOver('Loop5');

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var value = 500; //Global variable
var obj = {
  value     : 0,
  increment : function () {
    this.value++;
    var that = this;

    var innerFunction = function () {
      console.log('innerFunction: ' + value);
      console.log('innerFunction this: ' + this.value);
      console.log('innerFunction that: ' + that.value);
    }

    innerFunction(); //Function invocation pattern
    console.log('outer: ' + this.value);
  }
}
obj.increment(); //Method invocation pattern

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
obj.data = 'Hello World'

console.log("\n");
var displayData = function (a, b) {
  console.log(this.data, a + b);
}

displayData(3, 4); //undefined
displayData.apply(obj, [3, 4]); //Hello World 7
displayData.call(obj, 3, 4); //Hello World 7

var anon = (function () {
  return this;
}).apply(null, null);
console.log('anon func: ' + anon);


