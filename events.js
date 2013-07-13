/**
 * @author Cyrill @SchumacherFM
 * @date 11/5/12
 */
'use strict';
var util = require('util');
var events = require("events");

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';

}

function test2() {
  var obj = {'a1': 1, 'a2': 2};
  var arr = [1, 2];

  console.log('%s/%d', typeof arguments, arguments.length);
  console.log('%s/%d', typeof obj, obj.length);
  console.log('%s/%d', isArray(obj), obj.length);
  console.log('%s/%d', isArray(arr), arr.length);

  var args = Array.prototype.slice.call(arguments, 1);
  console.log(args);
}

//test2('arg1', 'arg2', 'arg3');

/*******************************************************/
var timer = function () {
  this._start = 0;
};

timer.prototype = {
  reset       : function () {
    this._start = process.hrtime();
  },
  getMilliDiff: function () {
    return process.hrtime(this._start);
  },
  timeOver    : function (text) {
    var diff = this.getMilliDiff();
    console.log(text + ' / Time: ' + diff[0] + ' sec ' + Math.round(diff[1] / 1000000) + ' ms');
  }
};

// This observer object can be mixed into any object, giving it the basic
// API necessary to add and remove subscribers as well as emit events
var observer1 = function () {

}
observer1.prototype = {
  // 'subscribers' will keep track of subscribers by event name
  // each event name subscribed to will be a member name on
  // this object, w/ the value as an array of objects containing
  // the subscriber callback and optional function context
  subscribers: {},

  name: 'tech.pro',

  // the 'on' method is used by subscribers to add a callback
  // to be invoked when a specific event is emitted
  on  : function (event, cb, context) {
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push({
      callback: cb,
      context : context
    });
  },

  // 'off' allows subscribers to remove their callbacks
  off : function (event, cb, context) {
    var idx, subs, sub;
    if ((subs = this.subscribers[event])) {
      idx = subs.length - 1;
      while (idx >= 0) {
        sub = subs[event][idx];
        if (sub.callback === cb && (!context || sub.context === context)) {
          subs[event].splice(idx, 1);
          break;
        }
        idx--;
      }
    }
  },

  // iterates over the subscriber list for
  // a given event and invokes the callbacks
  emit: function (event) {
    var subs, sub, idx = 0,
      args = Array.prototype.slice.call(arguments, 1);
    if ((subs = this.subscribers[event])) {
      while (idx < subs.length) {
        sub = subs[idx];
        sub.callback.apply(sub.context || this, args);
        idx++;
      }
    }
  }
};

// This observer object can be mixed into any object, giving it the basic
// API necessary to add and remove subscribers as well as emit events
var observer2 = function () {

}
observer2.prototype = {
  // 'subscribers' will keep track of subscribers by event name
  // each event name subscribed to will be a member name on
  // this object, w/ the value as an array of objects containing
  // the subscriber callback and optional function context
  subscribers: {},

  name: 'cys',

  // the 'on' method is used by subscribers to add a callback
  // to be invoked when a specific event is emitted
  on  : function (event, cb, context) {
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push({
      callback: cb,
      context : context
    });
  },

  // 'off' allows subscribers to remove their callbacks
  off : function (event, cb, context) {
    var idx, subs, sub, i;
    subs = this.subscribers[event];
    if (subs) {
      idx = subs.length - 1;
      for (i = 0; i <= idx; i++) {
        sub = subs[event][i];
        if (sub.callback === cb && (!context || sub.context === context)) {
          subs[event].splice(i, 1);
          break;
        }
      }
    }
  },

  // iterates over the subscriber list for
  // a given event and invokes the callbacks
  emit: function (event) {
    var subs, sub, subsLength, i,
      args = Array.prototype.slice.call(arguments, 1);

    if (subs = this.subscribers[event]) {
      subsLength = subs.length;
      for (i = 0; i < subsLength; i++) {
        sub = subs[i];
        sub.callback.apply(sub.context || this, args);
      }
    }
  }
};
/**********************************************************/
var theTimer = new timer();
function testCase(observer) {
  var jim = function () {
  };
  var globalStolen = 0;
  util.inherits(jim, observer);

  jim.prototype.dangItDoug = function (numberStolen) {
    this.emit("stolenkill", numberStolen);
  }

  var jimO = new jim();
  jimO.on("stolenkill", function (numStolen) {
    globalStolen += numStolen;
  });

  theTimer.reset();
  for (var i = 0; i <= 1000000; i++) {
    jimO.dangItDoug(i);
  }
  theTimer.timeOver('End ' + jimO.name);
  console.log(globalStolen);
}
/********************************************************************/
events.EventEmitter.prototype.name = 'events.EventEmitter';

testCase(observer1);
testCase(observer2);
testCase(events.EventEmitter);

