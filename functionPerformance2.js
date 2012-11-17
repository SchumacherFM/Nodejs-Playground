/**
 * @author Cyrill @SchumacherFM
 * @date 11/16/12
 */

var util = require('util'),
  _ = require('underscore');

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

var columns = [];
for (var i = 0; i < 10000; ++i) {
  columns[i] = {
    name  : 'name' + i,
    value : 'value' + i
  };
}

var parseRow1 = function (columns) {
  var row = {};
  var length = Object.keys(columns).length;
  for (var i = 0; i < length; i++) {
    row[columns[i]['name']] = columns[i]['value'];
  }
  return row;
}

var code = 'return {\n';
columns.forEach(function (column) {
  code += '"' + column.name + '":' + '"' + column.value + '",\n';
});
code += '0:1};\n';
var parseRow2 = new Function('columns', code);
//////////////////////////////////////////////////////////////////////////
var theTimer = new timer();
theTimer.reset();

var res1 = parseRow1(columns);
theTimer.timeOver('parseRow1');
console.log('Length res1: ' + Object.keys(res1).length);

theTimer.reset();
var res2 = parseRow2(columns);
theTimer.timeOver('parseRow2');
console.log('Length res2: ' + Object.keys(res2).length);

//////////////////////////////////

console.log('Without function scope:');
var arr = [10, 20, 30, 'dd'];
var out = [];
for (var i = 0; i < arr.length; i++) {
  var item = arr[i];
  out.push(function () {
    console.log(item + ' i:' + i);
  });
}
out.forEach(function (func) {
  func();
});

var innerLoopFnc = function (index, item) {
  out.push(function () {
    console.log(item + ' i:' + index);
  });
}

console.log('Now with function scope:');
out = [];
for (var i = 0; i < arr.length; i++) {
  innerLoopFnc(i, arr[i]);
}
out.forEach(function (func) {
  func();
});

var hello = (false === true)
  ? 1
  : 0;