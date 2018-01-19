"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var raf = global.requestAnimationFrame = function (cb) {
  setTimeout(cb, 0);
};

exports.default = raf;