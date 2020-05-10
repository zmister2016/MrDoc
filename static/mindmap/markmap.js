(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
},{"../helpers/typeof":2}],2:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.map = exports.slice = void 0;
var array = Array.prototype;
var slice = array.slice;
exports.slice = slice;
var map = array.map;
exports.map = map;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.bisectLeft = exports.bisectRight = void 0;

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ascendingBisect = (0, _bisector.default)(_ascending.default);
var bisectRight = ascendingBisect.right;
exports.bisectRight = bisectRight;
var bisectLeft = ascendingBisect.left;
exports.bisectLeft = bisectLeft;
var _default = bisectRight;
exports.default = _default;

},{"./ascending":4,"./bisector":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(compare) {
  if (compare.length === 1) compare = ascendingComparator(compare);
  return {
    left: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) < 0) lo = mid + 1;else hi = mid;
      }

      return lo;
    },
    right: function (a, x, lo, hi) {
      if (lo == null) lo = 0;
      if (hi == null) hi = a.length;

      while (lo < hi) {
        var mid = lo + hi >>> 1;
        if (compare(a[mid], x) > 0) hi = mid;else lo = mid + 1;
      }

      return lo;
    }
  };
}

function ascendingComparator(f) {
  return function (d, x) {
    return (0, _ascending.default)(f(d), x);
  };
}

},{"./ascending":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function () {
    return x;
  };
}

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _pairs = require("./pairs");

function _default(values0, values1, reduce) {
  var n0 = values0.length,
      n1 = values1.length,
      values = new Array(n0 * n1),
      i0,
      i1,
      i,
      value0;
  if (reduce == null) reduce = _pairs.pair;

  for (i0 = i = 0; i0 < n0; ++i0) {
    for (value0 = values0[i0], i1 = 0; i1 < n1; ++i1, ++i) {
      values[i] = reduce(value0, values1[i1]);
    }
  }

  return values;
}

},{"./pairs":21}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _variance = _interopRequireDefault(require("./variance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(array, f) {
  var v = (0, _variance.default)(array, f);
  return v ? Math.sqrt(v) : v;
}

},{"./variance":33}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null) {
            if (min > value) min = value;
            if (max < value) max = value;
          }
        }
      }
    }
  }

  return [min, max];
}

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array");

var _bisect = _interopRequireDefault(require("./bisect"));

var _constant = _interopRequireDefault(require("./constant"));

var _extent = _interopRequireDefault(require("./extent"));

var _identity = _interopRequireDefault(require("./identity"));

var _range = _interopRequireDefault(require("./range"));

var _ticks = require("./ticks");

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var value = _identity.default,
      domain = _extent.default,
      threshold = _sturges.default;

  function histogram(data) {
    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1); // Convert number of thresholds into uniform thresholds.

    if (!Array.isArray(tz)) {
      tz = (0, _ticks.tickStep)(x0, x1, tz);
      tz = (0, _range.default)(Math.ceil(x0 / tz) * tz, x1, tz); // exclusive
    } // Remove any thresholds outside the domain.


    var m = tz.length;

    while (tz[0] <= x0) tz.shift(), --m;

    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin; // Initialize bins.

    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    } // Assign data to bins by value, ignoring any outside the domain.


    for (i = 0; i < n; ++i) {
      x = values[i];

      if (x0 <= x && x <= x1) {
        bins[(0, _bisect.default)(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(_), histogram) : value;
  };

  histogram.domain = function (_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : (0, _constant.default)([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? (0, _constant.default)(_array.slice.call(_)) : (0, _constant.default)(_), histogram) : threshold;
  };

  return histogram;
}

},{"./array":3,"./bisect":5,"./constant":7,"./extent":11,"./identity":13,"./range":24,"./threshold/sturges":30,"./ticks":31}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x;
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "bisect", {
  enumerable: true,
  get: function () {
    return _bisect.default;
  }
});
Object.defineProperty(exports, "bisectRight", {
  enumerable: true,
  get: function () {
    return _bisect.bisectRight;
  }
});
Object.defineProperty(exports, "bisectLeft", {
  enumerable: true,
  get: function () {
    return _bisect.bisectLeft;
  }
});
Object.defineProperty(exports, "ascending", {
  enumerable: true,
  get: function () {
    return _ascending.default;
  }
});
Object.defineProperty(exports, "bisector", {
  enumerable: true,
  get: function () {
    return _bisector.default;
  }
});
Object.defineProperty(exports, "cross", {
  enumerable: true,
  get: function () {
    return _cross.default;
  }
});
Object.defineProperty(exports, "descending", {
  enumerable: true,
  get: function () {
    return _descending.default;
  }
});
Object.defineProperty(exports, "deviation", {
  enumerable: true,
  get: function () {
    return _deviation.default;
  }
});
Object.defineProperty(exports, "extent", {
  enumerable: true,
  get: function () {
    return _extent.default;
  }
});
Object.defineProperty(exports, "histogram", {
  enumerable: true,
  get: function () {
    return _histogram.default;
  }
});
Object.defineProperty(exports, "thresholdFreedmanDiaconis", {
  enumerable: true,
  get: function () {
    return _freedmanDiaconis.default;
  }
});
Object.defineProperty(exports, "thresholdScott", {
  enumerable: true,
  get: function () {
    return _scott.default;
  }
});
Object.defineProperty(exports, "thresholdSturges", {
  enumerable: true,
  get: function () {
    return _sturges.default;
  }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () {
    return _max.default;
  }
});
Object.defineProperty(exports, "mean", {
  enumerable: true,
  get: function () {
    return _mean.default;
  }
});
Object.defineProperty(exports, "median", {
  enumerable: true,
  get: function () {
    return _median.default;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function () {
    return _merge.default;
  }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () {
    return _min.default;
  }
});
Object.defineProperty(exports, "pairs", {
  enumerable: true,
  get: function () {
    return _pairs.default;
  }
});
Object.defineProperty(exports, "permute", {
  enumerable: true,
  get: function () {
    return _permute.default;
  }
});
Object.defineProperty(exports, "quantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "range", {
  enumerable: true,
  get: function () {
    return _range.default;
  }
});
Object.defineProperty(exports, "scan", {
  enumerable: true,
  get: function () {
    return _scan.default;
  }
});
Object.defineProperty(exports, "shuffle", {
  enumerable: true,
  get: function () {
    return _shuffle.default;
  }
});
Object.defineProperty(exports, "sum", {
  enumerable: true,
  get: function () {
    return _sum.default;
  }
});
Object.defineProperty(exports, "ticks", {
  enumerable: true,
  get: function () {
    return _ticks.default;
  }
});
Object.defineProperty(exports, "tickIncrement", {
  enumerable: true,
  get: function () {
    return _ticks.tickIncrement;
  }
});
Object.defineProperty(exports, "tickStep", {
  enumerable: true,
  get: function () {
    return _ticks.tickStep;
  }
});
Object.defineProperty(exports, "transpose", {
  enumerable: true,
  get: function () {
    return _transpose.default;
  }
});
Object.defineProperty(exports, "variance", {
  enumerable: true,
  get: function () {
    return _variance.default;
  }
});
Object.defineProperty(exports, "zip", {
  enumerable: true,
  get: function () {
    return _zip.default;
  }
});

var _bisect = _interopRequireWildcard(require("./bisect"));

var _ascending = _interopRequireDefault(require("./ascending"));

var _bisector = _interopRequireDefault(require("./bisector"));

var _cross = _interopRequireDefault(require("./cross"));

var _descending = _interopRequireDefault(require("./descending"));

var _deviation = _interopRequireDefault(require("./deviation"));

var _extent = _interopRequireDefault(require("./extent"));

var _histogram = _interopRequireDefault(require("./histogram"));

var _freedmanDiaconis = _interopRequireDefault(require("./threshold/freedmanDiaconis"));

var _scott = _interopRequireDefault(require("./threshold/scott"));

var _sturges = _interopRequireDefault(require("./threshold/sturges"));

var _max = _interopRequireDefault(require("./max"));

var _mean = _interopRequireDefault(require("./mean"));

var _median = _interopRequireDefault(require("./median"));

var _merge = _interopRequireDefault(require("./merge"));

var _min = _interopRequireDefault(require("./min"));

var _pairs = _interopRequireDefault(require("./pairs"));

var _permute = _interopRequireDefault(require("./permute"));

var _quantile = _interopRequireDefault(require("./quantile"));

var _range = _interopRequireDefault(require("./range"));

var _scan = _interopRequireDefault(require("./scan"));

var _shuffle = _interopRequireDefault(require("./shuffle"));

var _sum = _interopRequireDefault(require("./sum"));

var _ticks = _interopRequireWildcard(require("./ticks"));

var _transpose = _interopRequireDefault(require("./transpose"));

var _variance = _interopRequireDefault(require("./variance"));

var _zip = _interopRequireDefault(require("./zip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./ascending":4,"./bisect":5,"./bisector":6,"./cross":8,"./descending":9,"./deviation":10,"./extent":11,"./histogram":12,"./max":15,"./mean":16,"./median":17,"./merge":18,"./min":19,"./pairs":21,"./permute":22,"./quantile":23,"./range":24,"./scan":25,"./shuffle":26,"./sum":27,"./threshold/freedmanDiaconis":28,"./threshold/scott":29,"./threshold/sturges":30,"./ticks":31,"./transpose":32,"./variance":33,"./zip":34}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = n,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) sum += value;else --m;
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) sum += value;else --m;
    }
  }

  if (m) return sum / m;
}

},{"./number":20}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

var _number = _interopRequireDefault(require("./number"));

var _quantile = _interopRequireDefault(require("./quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      numbers = [];

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        numbers.push(value);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        numbers.push(value);
      }
    }
  }

  return (0, _quantile.default)(numbers.sort(_ascending.default), 0.5);
}

},{"./ascending":4,"./number":20,"./quantile":23}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(arrays) {
  var n = arrays.length,
      m,
      i = -1,
      j = 0,
      merged,
      array;

  while (++i < n) j += arrays[i].length;

  merged = new Array(j);

  while (--n >= 0) {
    array = arrays[n];
    m = array.length;

    while (--m >= 0) {
      merged[--j] = array[m];
    }
  }

  return merged;
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      min;

  if (valueof == null) {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = values[i]) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = values[i]) != null && min > value) {
            min = value;
          }
        }
      }
    }
  } else {
    while (++i < n) {
      // Find the first comparable value.
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        min = value;

        while (++i < n) {
          // Compare the remaining values.
          if ((value = valueof(values[i], i, values)) != null && min > value) {
            min = value;
          }
        }
      }
    }
  }

  return min;
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return x === null ? NaN : +x;
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.pair = pair;

function _default(array, f) {
  if (f == null) f = pair;
  var i = 0,
      n = array.length - 1,
      p = array[0],
      pairs = new Array(n < 0 ? 0 : n);

  while (i < n) pairs[i] = f(p, p = array[++i]);

  return pairs;
}

function pair(a, b) {
  return [a, b];
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, indexes) {
  var i = indexes.length,
      permutes = new Array(i);

  while (i--) permutes[i] = array[indexes[i]];

  return permutes;
}

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, p, valueof) {
  if (valueof == null) valueof = _number.default;
  if (!(n = values.length)) return;
  if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
  if (p >= 1) return +valueof(values[n - 1], n - 1, values);
  var n,
      i = (n - 1) * p,
      i0 = Math.floor(i),
      value0 = +valueof(values[i0], i0, values),
      value1 = +valueof(values[i0 + 1], i0 + 1, values);
  return value0 + (value1 - value0) * (i - i0);
}

},{"./number":20}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

},{}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, compare) {
  if (!(n = values.length)) return;
  var n,
      i = 0,
      j = 0,
      xi,
      xj = values[j];
  if (compare == null) compare = _ascending.default;

  while (++i < n) {
    if (compare(xi = values[i], xj) < 0 || compare(xj, xj) !== 0) {
      xj = xi, j = i;
    }
  }

  if (compare(xj, xj) === 0) return j;
}

},{"./ascending":4}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(array, i0, i1) {
  var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m + i0];
    array[m + i0] = array[i + i0];
    array[i + i0] = t;
  }

  return array;
}

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (value = +values[i]) sum += value; // Note: zero and null are equivalent.
    }
  } else {
    while (++i < n) {
      if (value = +valueof(values[i], i, values)) sum += value;
    }
  }

  return sum;
}

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("../array");

var _ascending = _interopRequireDefault(require("../ascending"));

var _number = _interopRequireDefault(require("../number"));

var _quantile = _interopRequireDefault(require("../quantile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  values = _array.map.call(values, _number.default).sort(_ascending.default);
  return Math.ceil((max - min) / (2 * ((0, _quantile.default)(values, 0.75) - (0, _quantile.default)(values, 0.25)) * Math.pow(values.length, -1 / 3)));
}

},{"../array":3,"../ascending":4,"../number":20,"../quantile":23}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _deviation = _interopRequireDefault(require("../deviation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, min, max) {
  return Math.ceil((max - min) / (3.5 * (0, _deviation.default)(values) * Math.pow(values.length, -1 / 3)));
}

},{"../deviation":10}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
}

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tickIncrement = tickIncrement;
exports.tickStep = tickStep;
var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

function _default(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;
  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    start = Math.ceil(start / step);
    stop = Math.floor(stop / step);
    ticks = new Array(n = Math.ceil(stop - start + 1));

    while (++i < n) ticks[i] = (start + i) * step;
  } else {
    start = Math.floor(start * step);
    stop = Math.ceil(stop * step);
    ticks = new Array(n = Math.ceil(start - stop + 1));

    while (++i < n) ticks[i] = (start - i) / step;
  }

  if (reverse) ticks.reverse();
  return ticks;
}

function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0 ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power) : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;else if (error >= e5) step1 *= 5;else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

},{}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _min = _interopRequireDefault(require("./min"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(matrix) {
  if (!(n = matrix.length)) return [];

  for (var i = -1, m = (0, _min.default)(matrix, length), transpose = new Array(m); ++i < m;) {
    for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
      row[j] = matrix[j][i];
    }
  }

  return transpose;
}

function length(d) {
  return d.length;
}

},{"./min":19}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(values, valueof) {
  var n = values.length,
      m = 0,
      i = -1,
      mean = 0,
      value,
      delta,
      sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(values[i]))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN(value = (0, _number.default)(valueof(values[i], i, values)))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
}

},{"./number":20}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _transpose = _interopRequireDefault(require("./transpose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return (0, _transpose.default)(arguments);
}

},{"./transpose":32}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = void 0;
var slice = Array.prototype.slice;
exports.slice = slice;

},{}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisTop = axisTop;
exports.axisRight = axisRight;
exports.axisBottom = axisBottom;
exports.axisLeft = axisLeft;

var _array = require("./array");

var _identity = _interopRequireDefault(require("./identity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    epsilon = 1e-6;

function translateX(x) {
  return "translate(" + (x + 0.5) + ",0)";
}

function translateY(y) {
  return "translate(0," + (y + 0.5) + ")";
}

function number(scale) {
  return function (d) {
    return +scale(d);
  };
}

function center(scale) {
  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.

  if (scale.round()) offset = Math.round(offset);
  return function (d) {
    return +scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function axis(orient, scale) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 3,
      k = orient === top || orient === left ? -1 : 1,
      x = orient === left || orient === right ? "x" : "y",
      transform = orient === top || orient === bottom ? translateX : translateY;

  function axis(context) {
    var values = tickValues == null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues,
        format = tickFormat == null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : _identity.default : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        range0 = +range[0] + 0.5,
        range1 = +range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : number)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text");
    path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("stroke", "currentColor"));
    tick = tick.merge(tickEnter);
    line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr(x + "2", k * tickSizeInner));
    text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr(x, k * spacing).attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);
      tickExit = tickExit.transition(context).attr("opacity", epsilon).attr("transform", function (d) {
        return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform");
      });
      tickEnter.attr("opacity", epsilon).attr("transform", function (d) {
        var p = this.parentNode.__axis;
        return transform(p && isFinite(p = p(d)) ? p : position(d));
      });
    }

    tickExit.remove();
    path.attr("d", orient === left || orient == right ? tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter : "M0.5," + range0 + "V" + range1 : tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + ",0.5H" + range1);
    tick.attr("opacity", 1).attr("transform", function (d) {
      return transform(position(d));
    });
    line.attr(x + "2", k * tickSizeInner);
    text.attr(x, k * spacing).text(format);
    selection.filter(entering).attr("fill", "none").attr("font-size", 10).attr("font-family", "sans-serif").attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");
    selection.each(function () {
      this.__axis = position;
    });
  }

  axis.scale = function (_) {
    return arguments.length ? (scale = _, axis) : scale;
  };

  axis.ticks = function () {
    return tickArguments = _array.slice.call(arguments), axis;
  };

  axis.tickArguments = function (_) {
    return arguments.length ? (tickArguments = _ == null ? [] : _array.slice.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function (_) {
    return arguments.length ? (tickValues = _ == null ? null : _array.slice.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function (_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function (_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function (_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function (_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function (_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

function axisTop(scale) {
  return axis(top, scale);
}

function axisRight(scale) {
  return axis(right, scale);
}

function axisBottom(scale) {
  return axis(bottom, scale);
}

function axisLeft(scale) {
  return axis(left, scale);
}

},{"./array":35,"./identity":37}],37:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "axisTop", {
  enumerable: true,
  get: function () {
    return _axis.axisTop;
  }
});
Object.defineProperty(exports, "axisRight", {
  enumerable: true,
  get: function () {
    return _axis.axisRight;
  }
});
Object.defineProperty(exports, "axisBottom", {
  enumerable: true,
  get: function () {
    return _axis.axisBottom;
  }
});
Object.defineProperty(exports, "axisLeft", {
  enumerable: true,
  get: function () {
    return _axis.axisLeft;
  }
});

var _axis = require("./axis");

},{"./axis":36}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brushSelection = brushSelection;
exports.brushX = brushX;
exports.brushY = brushY;
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Drag = require("d3-drag");

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _d3Transition = require("d3-transition");

var _constant = _interopRequireDefault(require("./constant.js"));

var _event = _interopRequireDefault(require("./event.js"));

var _noevent = _interopRequireWildcard(require("./noevent.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MODE_DRAG = {
  name: "drag"
},
    MODE_SPACE = {
  name: "space"
},
    MODE_HANDLE = {
  name: "handle"
},
    MODE_CENTER = {
  name: "center"
};

function number1(e) {
  return [+e[0], +e[1]];
}

function number2(e) {
  return [number1(e[0]), number1(e[1])];
}

function toucher(identifier) {
  return function (target) {
    return (0, _d3Selection.touch)(target, _d3Selection.event.touches, identifier);
  };
}

var X = {
  name: "x",
  handles: ["w", "e"].map(type),
  input: function (x, e) {
    return x == null ? null : [[+x[0], e[0][1]], [+x[1], e[1][1]]];
  },
  output: function (xy) {
    return xy && [xy[0][0], xy[1][0]];
  }
};
var Y = {
  name: "y",
  handles: ["n", "s"].map(type),
  input: function (y, e) {
    return y == null ? null : [[e[0][0], +y[0]], [e[1][0], +y[1]]];
  },
  output: function (xy) {
    return xy && [xy[0][1], xy[1][1]];
  }
};
var XY = {
  name: "xy",
  handles: ["n", "w", "e", "s", "nw", "ne", "sw", "se"].map(type),
  input: function (xy) {
    return xy == null ? null : number2(xy);
  },
  output: function (xy) {
    return xy;
  }
};
var cursors = {
  overlay: "crosshair",
  selection: "move",
  n: "ns-resize",
  e: "ew-resize",
  s: "ns-resize",
  w: "ew-resize",
  nw: "nwse-resize",
  ne: "nesw-resize",
  se: "nwse-resize",
  sw: "nesw-resize"
};
var flipX = {
  e: "w",
  w: "e",
  nw: "ne",
  ne: "nw",
  se: "sw",
  sw: "se"
};
var flipY = {
  n: "s",
  s: "n",
  nw: "sw",
  ne: "se",
  se: "ne",
  sw: "nw"
};
var signsX = {
  overlay: +1,
  selection: +1,
  n: null,
  e: +1,
  s: null,
  w: -1,
  nw: -1,
  ne: +1,
  se: +1,
  sw: -1
};
var signsY = {
  overlay: +1,
  selection: +1,
  n: -1,
  e: null,
  s: +1,
  w: null,
  nw: -1,
  ne: -1,
  se: +1,
  sw: +1
};

function type(t) {
  return {
    type: t
  };
} // Ignore right-click, since that should open the context menu.


function defaultFilter() {
  return !_d3Selection.event.ctrlKey && !_d3Selection.event.button;
}

function defaultExtent() {
  var svg = this.ownerSVGElement || this;

  if (svg.hasAttribute("viewBox")) {
    svg = svg.viewBox.baseVal;
    return [[svg.x, svg.y], [svg.x + svg.width, svg.y + svg.height]];
  }

  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
} // Like d3.local, but with the name “__brush” rather than auto-generated.


function local(node) {
  while (!node.__brush) if (!(node = node.parentNode)) return;

  return node.__brush;
}

function empty(extent) {
  return extent[0][0] === extent[1][0] || extent[0][1] === extent[1][1];
}

function brushSelection(node) {
  var state = node.__brush;
  return state ? state.dim.output(state.selection) : null;
}

function brushX() {
  return brush(X);
}

function brushY() {
  return brush(Y);
}

function _default() {
  return brush(XY);
}

function brush(dim) {
  var extent = defaultExtent,
      filter = defaultFilter,
      touchable = defaultTouchable,
      keys = true,
      listeners = (0, _d3Dispatch.dispatch)("start", "brush", "end"),
      handleSize = 6,
      touchending;

  function brush(group) {
    var overlay = group.property("__brush", initialize).selectAll(".overlay").data([type("overlay")]);
    overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", cursors.overlay).merge(overlay).each(function () {
      var extent = local(this).extent;
      (0, _d3Selection.select)(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
    });
    group.selectAll(".selection").data([type("selection")]).enter().append("rect").attr("class", "selection").attr("cursor", cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
    var handle = group.selectAll(".handle").data(dim.handles, function (d) {
      return d.type;
    });
    handle.exit().remove();
    handle.enter().append("rect").attr("class", function (d) {
      return "handle handle--" + d.type;
    }).attr("cursor", function (d) {
      return cursors[d.type];
    });
    group.each(redraw).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", started).filter(touchable).on("touchstart.brush", started).on("touchmove.brush", touchmoved).on("touchend.brush touchcancel.brush", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  brush.move = function (group, selection) {
    if (group.selection) {
      group.on("start.brush", function () {
        emitter(this, arguments).beforestart().start();
      }).on("interrupt.brush end.brush", function () {
        emitter(this, arguments).end();
      }).tween("brush", function () {
        var that = this,
            state = that.__brush,
            emit = emitter(that, arguments),
            selection0 = state.selection,
            selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent),
            i = (0, _d3Interpolate.interpolate)(selection0, selection1);

        function tween(t) {
          state.selection = t === 1 && selection1 === null ? null : i(t);
          redraw.call(that);
          emit.brush();
        }

        return selection0 !== null && selection1 !== null ? tween : tween(1);
      });
    } else {
      group.each(function () {
        var that = this,
            args = arguments,
            state = that.__brush,
            selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent),
            emit = emitter(that, args).beforestart();
        (0, _d3Transition.interrupt)(that);
        state.selection = selection1 === null ? null : selection1;
        redraw.call(that);
        emit.start().brush().end();
      });
    }
  };

  brush.clear = function (group) {
    brush.move(group, null);
  };

  function redraw() {
    var group = (0, _d3Selection.select)(this),
        selection = local(this).selection;

    if (selection) {
      group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]);
      group.selectAll(".handle").style("display", null).attr("x", function (d) {
        return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
      }).attr("y", function (d) {
        return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
      }).attr("width", function (d) {
        return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize;
      }).attr("height", function (d) {
        return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize;
      });
    } else {
      group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
    }
  }

  function emitter(that, args, clean) {
    return !clean && that.__brush.emitter || new Emitter(that, args);
  }

  function Emitter(that, args) {
    this.that = that;
    this.args = args;
    this.state = that.__brush;
    this.active = 0;
  }

  Emitter.prototype = {
    beforestart: function () {
      if (++this.active === 1) this.state.emitter = this, this.starting = true;
      return this;
    },
    start: function () {
      if (this.starting) this.starting = false, this.emit("start");else this.emit("brush");
      return this;
    },
    brush: function () {
      this.emit("brush");
      return this;
    },
    end: function () {
      if (--this.active === 0) delete this.state.emitter, this.emit("end");
      return this;
    },
    emit: function (type) {
      (0, _d3Selection.customEvent)(new _event.default(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function started() {
    if (touchending && !_d3Selection.event.touches) return;
    if (!filter.apply(this, arguments)) return;
    var that = this,
        type = _d3Selection.event.target.__data__.type,
        mode = (keys && _d3Selection.event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : keys && _d3Selection.event.altKey ? MODE_CENTER : MODE_HANDLE,
        signX = dim === Y ? null : signsX[type],
        signY = dim === X ? null : signsY[type],
        state = local(that),
        extent = state.extent,
        selection = state.selection,
        W = extent[0][0],
        w0,
        w1,
        N = extent[0][1],
        n0,
        n1,
        E = extent[1][0],
        e0,
        e1,
        S = extent[1][1],
        s0,
        s1,
        dx = 0,
        dy = 0,
        moving,
        shifting = signX && signY && keys && _d3Selection.event.shiftKey,
        lockX,
        lockY,
        pointer = _d3Selection.event.touches ? toucher(_d3Selection.event.changedTouches[0].identifier) : _d3Selection.mouse,
        point0 = pointer(that),
        point = point0,
        emit = emitter(that, arguments, true).beforestart();

    if (type === "overlay") {
      if (selection) moving = true;
      state.selection = selection = [[w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]], [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]];
    } else {
      w0 = selection[0][0];
      n0 = selection[0][1];
      e0 = selection[1][0];
      s0 = selection[1][1];
    }

    w1 = w0;
    n1 = n0;
    e1 = e0;
    s1 = s0;
    var group = (0, _d3Selection.select)(that).attr("pointer-events", "none");
    var overlay = group.selectAll(".overlay").attr("cursor", cursors[type]);

    if (_d3Selection.event.touches) {
      emit.moved = moved;
      emit.ended = ended;
    } else {
      var view = (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.brush", moved, true).on("mouseup.brush", ended, true);
      if (keys) view.on("keydown.brush", keydowned, true).on("keyup.brush", keyupped, true);
      (0, _d3Drag.dragDisable)(_d3Selection.event.view);
    }

    (0, _noevent.nopropagation)();
    (0, _d3Transition.interrupt)(that);
    redraw.call(that);
    emit.start();

    function moved() {
      var point1 = pointer(that);

      if (shifting && !lockX && !lockY) {
        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;else lockX = true;
      }

      point = point1;
      moving = true;
      (0, _noevent.default)();
      move();
    }

    function move() {
      var t;
      dx = point[0] - point0[0];
      dy = point[1] - point0[1];

      switch (mode) {
        case MODE_SPACE:
        case MODE_DRAG:
          {
            if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
            if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
            break;
          }

        case MODE_HANDLE:
          {
            if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
            if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
            break;
          }

        case MODE_CENTER:
          {
            if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
            if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
            break;
          }
      }

      if (e1 < w1) {
        signX *= -1;
        t = w0, w0 = e0, e0 = t;
        t = w1, w1 = e1, e1 = t;
        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
      }

      if (s1 < n1) {
        signY *= -1;
        t = n0, n0 = s0, s0 = t;
        t = n1, n1 = s1, s1 = t;
        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
      }

      if (state.selection) selection = state.selection; // May be set by brush.move!

      if (lockX) w1 = selection[0][0], e1 = selection[1][0];
      if (lockY) n1 = selection[0][1], s1 = selection[1][1];

      if (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) {
        state.selection = [[w1, n1], [e1, s1]];
        redraw.call(that);
        emit.brush();
      }
    }

    function ended() {
      (0, _noevent.nopropagation)();

      if (_d3Selection.event.touches) {
        if (_d3Selection.event.touches.length) return;
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function () {
          touchending = null;
        }, 500); // Ghost clicks are delayed!
      } else {
        (0, _d3Drag.dragEnable)(_d3Selection.event.view, moving);
        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
      }

      group.attr("pointer-events", "all");
      overlay.attr("cursor", cursors.overlay);
      if (state.selection) selection = state.selection; // May be set by brush.move (on start)!

      if (empty(selection)) state.selection = null, redraw.call(that);
      emit.end();
    }

    function keydowned() {
      switch (_d3Selection.event.keyCode) {
        case 16:
          {
            // SHIFT
            shifting = signX && signY;
            break;
          }

        case 18:
          {
            // ALT
            if (mode === MODE_HANDLE) {
              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
              mode = MODE_CENTER;
              move();
            }

            break;
          }

        case 32:
          {
            // SPACE; takes priority over ALT
            if (mode === MODE_HANDLE || mode === MODE_CENTER) {
              if (signX < 0) e0 = e1 - dx;else if (signX > 0) w0 = w1 - dx;
              if (signY < 0) s0 = s1 - dy;else if (signY > 0) n0 = n1 - dy;
              mode = MODE_SPACE;
              overlay.attr("cursor", cursors.selection);
              move();
            }

            break;
          }

        default:
          return;
      }

      (0, _noevent.default)();
    }

    function keyupped() {
      switch (_d3Selection.event.keyCode) {
        case 16:
          {
            // SHIFT
            if (shifting) {
              lockX = lockY = shifting = false;
              move();
            }

            break;
          }

        case 18:
          {
            // ALT
            if (mode === MODE_CENTER) {
              if (signX < 0) e0 = e1;else if (signX > 0) w0 = w1;
              if (signY < 0) s0 = s1;else if (signY > 0) n0 = n1;
              mode = MODE_HANDLE;
              move();
            }

            break;
          }

        case 32:
          {
            // SPACE
            if (mode === MODE_SPACE) {
              if (_d3Selection.event.altKey) {
                if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                mode = MODE_CENTER;
              } else {
                if (signX < 0) e0 = e1;else if (signX > 0) w0 = w1;
                if (signY < 0) s0 = s1;else if (signY > 0) n0 = n1;
                mode = MODE_HANDLE;
              }

              overlay.attr("cursor", cursors[type]);
              move();
            }

            break;
          }

        default:
          return;
      }

      (0, _noevent.default)();
    }
  }

  function touchmoved() {
    emitter(this, arguments).moved();
  }

  function touchended() {
    emitter(this, arguments).ended();
  }

  function initialize() {
    var state = this.__brush || {
      selection: null
    };
    state.extent = number2(extent.apply(this, arguments));
    state.dim = dim;
    return state;
  }

  brush.extent = function (_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : (0, _constant.default)(number2(_)), brush) : extent;
  };

  brush.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), brush) : filter;
  };

  brush.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), brush) : touchable;
  };

  brush.handleSize = function (_) {
    return arguments.length ? (handleSize = +_, brush) : handleSize;
  };

  brush.keyModifiers = function (_) {
    return arguments.length ? (keys = !!_, brush) : keys;
  };

  brush.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? brush : value;
  };

  return brush;
}

},{"./constant.js":40,"./event.js":41,"./noevent.js":43,"d3-dispatch":74,"d3-drag":78,"d3-interpolate":236,"d3-selection":355,"d3-transition":482}],40:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(target, type, selection) {
  this.target = target;
  this.type = type;
  this.selection = selection;
}

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "brush", {
  enumerable: true,
  get: function () {
    return _brush.default;
  }
});
Object.defineProperty(exports, "brushX", {
  enumerable: true,
  get: function () {
    return _brush.brushX;
  }
});
Object.defineProperty(exports, "brushY", {
  enumerable: true,
  get: function () {
    return _brush.brushY;
  }
});
Object.defineProperty(exports, "brushSelection", {
  enumerable: true,
  get: function () {
    return _brush.brushSelection;
  }
});

var _brush = _interopRequireWildcard(require("./brush.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./brush.js":39}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nopropagation = nopropagation;
exports.default = _default;

var _d3Selection = require("d3-selection");

function nopropagation() {
  _d3Selection.event.stopImmediatePropagation();
}

function _default() {
  _d3Selection.event.preventDefault();

  _d3Selection.event.stopImmediatePropagation();
}

},{"d3-selection":355}],44:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _math = require("./math");

function compareValue(compare) {
  return function (a, b) {
    return compare(a.source.value + a.target.value, b.source.value + b.target.value);
  };
}

function _default() {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function chord(matrix) {
    var n = matrix.length,
        groupSums = [],
        groupIndex = (0, _d3Array.range)(n),
        subgroupIndex = [],
        chords = [],
        groups = chords.groups = new Array(n),
        subgroups = new Array(n * n),
        k,
        x,
        x0,
        dx,
        i,
        j; // Compute the sum.

    k = 0, i = -1;

    while (++i < n) {
      x = 0, j = -1;

      while (++j < n) {
        x += matrix[i][j];
      }

      groupSums.push(x);
      subgroupIndex.push((0, _d3Array.range)(n));
      k += x;
    } // Sort groups…


    if (sortGroups) groupIndex.sort(function (a, b) {
      return sortGroups(groupSums[a], groupSums[b]);
    }); // Sort subgroups…

    if (sortSubgroups) subgroupIndex.forEach(function (d, i) {
      d.sort(function (a, b) {
        return sortSubgroups(matrix[i][a], matrix[i][b]);
      });
    }); // Convert the sum to scaling factor for [0, 2pi].
    // TODO Allow start and end angle to be specified?
    // TODO Allow padding to be specified as percentage?

    k = (0, _math.max)(0, _math.tau - padAngle * n) / k;
    dx = k ? padAngle : _math.tau / n; // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!

    x = 0, i = -1;

    while (++i < n) {
      x0 = x, j = -1;

      while (++j < n) {
        var di = groupIndex[i],
            dj = subgroupIndex[di][j],
            v = matrix[di][dj],
            a0 = x,
            a1 = x += v * k;
        subgroups[dj * n + di] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }

      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: groupSums[di]
      };
      x += dx;
    } // Generate chords for each (non-empty) subgroup-subgroup link.


    i = -1;

    while (++i < n) {
      j = i - 1;

      while (++j < n) {
        var source = subgroups[j * n + i],
            target = subgroups[i * n + j];

        if (source.value || target.value) {
          chords.push(source.value < target.value ? {
            source: target,
            target: source
          } : {
            source: source,
            target: target
          });
        }
      }
    }

    return sortChords ? chords.sort(sortChords) : chords;
  }

  chord.padAngle = function (_) {
    return arguments.length ? (padAngle = (0, _math.max)(0, _), chord) : padAngle;
  };

  chord.sortGroups = function (_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  chord.sortSubgroups = function (_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function (_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}

},{"./math":48,"d3-array":14}],46:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "chord", {
  enumerable: true,
  get: function () {
    return _chord.default;
  }
});
Object.defineProperty(exports, "ribbon", {
  enumerable: true,
  get: function () {
    return _ribbon.default;
  }
});

var _chord = _interopRequireDefault(require("./chord"));

var _ribbon = _interopRequireDefault(require("./ribbon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./chord":45,"./ribbon":49}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.max = exports.tau = exports.halfPi = exports.pi = exports.sin = exports.cos = void 0;
var cos = Math.cos;
exports.cos = cos;
var sin = Math.sin;
exports.sin = sin;
var pi = Math.PI;
exports.pi = pi;
var halfPi = pi / 2;
exports.halfPi = halfPi;
var tau = pi * 2;
exports.tau = tau;
var max = Math.max;
exports.max = max;

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array");

var _constant = _interopRequireDefault(require("./constant"));

var _math = require("./math");

var _d3Path = require("d3-path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

function _default() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbon() {
    var buffer,
        argv = _array.slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - _math.halfPi,
        sa1 = endAngle.apply(this, argv) - _math.halfPi,
        sx0 = sr * (0, _math.cos)(sa0),
        sy0 = sr * (0, _math.sin)(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - _math.halfPi,
        ta1 = endAngle.apply(this, argv) - _math.halfPi;

    if (!context) context = buffer = (0, _d3Path.path)();
    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1);

    if (sa0 !== ta0 || sa1 !== ta1) {
      // TODO sr !== tr?
      context.quadraticCurveTo(0, 0, tr * (0, _math.cos)(ta0), tr * (0, _math.sin)(ta0));
      context.arc(0, 0, tr, ta0, ta1);
    }

    context.quadraticCurveTo(0, 0, sx0, sy0);
    context.closePath();
    if (buffer) return context = null, buffer + "" || null;
  }

  ribbon.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : (0, _constant.default)(+_), ribbon) : radius;
  };

  ribbon.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), ribbon) : endAngle;
  };

  ribbon.source = function (_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function (_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, ribbon) : context;
  };

  return ribbon;
}

},{"./array":44,"./constant":46,"./math":48,"d3-path":251}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var entries = [];

  for (var key in map) entries.push({
    key: key,
    value: map[key]
  });

  return entries;
}

},{}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nest", {
  enumerable: true,
  get: function () {
    return _nest.default;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _map.default;
  }
});
Object.defineProperty(exports, "keys", {
  enumerable: true,
  get: function () {
    return _keys.default;
  }
});
Object.defineProperty(exports, "values", {
  enumerable: true,
  get: function () {
    return _values.default;
  }
});
Object.defineProperty(exports, "entries", {
  enumerable: true,
  get: function () {
    return _entries.default;
  }
});

var _nest = _interopRequireDefault(require("./nest"));

var _set = _interopRequireDefault(require("./set"));

var _map = _interopRequireDefault(require("./map"));

var _keys = _interopRequireDefault(require("./keys"));

var _values = _interopRequireDefault(require("./values"));

var _entries = _interopRequireDefault(require("./entries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./entries":50,"./keys":52,"./map":53,"./nest":54,"./set":55,"./values":56}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var keys = [];

  for (var key in map) keys.push(key);

  return keys;
}

},{}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.prefix = void 0;
var prefix = "$";
exports.prefix = prefix;

function Map() {}

Map.prototype = map.prototype = {
  constructor: Map,
  has: function (key) {
    return prefix + key in this;
  },
  get: function (key) {
    return this[prefix + key];
  },
  set: function (key, value) {
    this[prefix + key] = value;
    return this;
  },
  remove: function (key) {
    var property = prefix + key;
    return property in this && delete this[property];
  },
  clear: function () {
    for (var property in this) if (property[0] === prefix) delete this[property];
  },
  keys: function () {
    var keys = [];

    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));

    return keys;
  },
  values: function () {
    var values = [];

    for (var property in this) if (property[0] === prefix) values.push(this[property]);

    return values;
  },
  entries: function () {
    var entries = [];

    for (var property in this) if (property[0] === prefix) entries.push({
      key: property.slice(1),
      value: this[property]
    });

    return entries;
  },
  size: function () {
    var size = 0;

    for (var property in this) if (property[0] === prefix) ++size;

    return size;
  },
  empty: function () {
    for (var property in this) if (property[0] === prefix) return false;

    return true;
  },
  each: function (f) {
    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
  }
};

function map(object, f) {
  var map = new Map(); // Copy constructor.

  if (object instanceof Map) object.each(function (value, key) {
    map.set(key, value);
  }); // Index array by numeric index or specified key function.
  else if (Array.isArray(object)) {
      var i = -1,
          n = object.length,
          o;
      if (f == null) while (++i < n) map.set(i, object[i]);else while (++i < n) map.set(f(o = object[i], i, object), o);
    } // Convert object to map.
    else if (object) for (var key in object) map.set(key, object[key]);
  return map;
}

var _default = map;
exports.default = _default;

},{}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _map = _interopRequireDefault(require("./map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var keys = [],
      sortKeys = [],
      sortValues,
      rollup,
      nest;

  function apply(array, depth, createResult, setResult) {
    if (depth >= keys.length) {
      if (sortValues != null) array.sort(sortValues);
      return rollup != null ? rollup(array) : array;
    }

    var i = -1,
        n = array.length,
        key = keys[depth++],
        keyValue,
        value,
        valuesByKey = (0, _map.default)(),
        values,
        result = createResult();

    while (++i < n) {
      if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
        values.push(value);
      } else {
        valuesByKey.set(keyValue, [value]);
      }
    }

    valuesByKey.each(function (values, key) {
      setResult(result, key, apply(values, depth, createResult, setResult));
    });
    return result;
  }

  function entries(map, depth) {
    if (++depth > keys.length) return map;
    var array,
        sortKey = sortKeys[depth - 1];
    if (rollup != null && depth >= keys.length) array = map.entries();else array = [], map.each(function (v, k) {
      array.push({
        key: k,
        values: entries(v, depth)
      });
    });
    return sortKey != null ? array.sort(function (a, b) {
      return sortKey(a.key, b.key);
    }) : array;
  }

  return nest = {
    object: function (array) {
      return apply(array, 0, createObject, setObject);
    },
    map: function (array) {
      return apply(array, 0, createMap, setMap);
    },
    entries: function (array) {
      return entries(apply(array, 0, createMap, setMap), 0);
    },
    key: function (d) {
      keys.push(d);
      return nest;
    },
    sortKeys: function (order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    },
    sortValues: function (order) {
      sortValues = order;
      return nest;
    },
    rollup: function (f) {
      rollup = f;
      return nest;
    }
  };
}

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return (0, _map.default)();
}

function setMap(map, key, value) {
  map.set(key, value);
}

},{"./map":53}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireWildcard(require("./map"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Set() {}

var proto = _map.default.prototype;
Set.prototype = set.prototype = {
  constructor: Set,
  has: proto.has,
  add: function (value) {
    value += "";
    this[_map.prefix + value] = value;
    return this;
  },
  remove: proto.remove,
  clear: proto.clear,
  values: proto.keys,
  size: proto.size,
  empty: proto.empty,
  each: proto.each
};

function set(object, f) {
  var set = new Set(); // Copy constructor.

  if (object instanceof Set) object.each(function (value) {
    set.add(value);
  }); // Otherwise, assume it’s an array.
  else if (object) {
      var i = -1,
          n = object.length;
      if (f == null) while (++i < n) set.add(object[i]);else while (++i < n) set.add(f(object[i], i, object));
    }
  return set;
}

var _default = set;
exports.default = _default;

},{"./map":53}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(map) {
  var values = [];

  for (var key in map) values.push(map[key]);

  return values;
}

},{}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = Color;
exports.default = color;
exports.rgbConvert = rgbConvert;
exports.rgb = rgb;
exports.Rgb = Rgb;
exports.hslConvert = hslConvert;
exports.hsl = hsl;
exports.brighter = exports.darker = void 0;

var _define = _interopRequireWildcard(require("./define.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function Color() {}

var darker = 0.7;
exports.darker = darker;
var brighter = 1 / darker;
exports.brighter = brighter;
var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");
var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};
(0, _define.default)(Color, color, {
  copy: function (channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
  : l === 3 ? new Rgb(m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, (m & 0xf) << 4 | m & 0xf, 1) // #f00
  : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
  : l === 4 ? rgba(m >> 12 & 0xf | m >> 8 & 0xf0, m >> 8 & 0xf | m >> 4 & 0xf0, m >> 4 & 0xf | m & 0xf0, ((m & 0xf) << 4 | m & 0xf) / 0xff) // #f000
  : null // invalid hex
  ) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
  : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Rgb, rgb, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function () {
    return this;
  },
  displayable: function () {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity;
  a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;else if (l <= 0 || l >= 1) h = s = NaN;else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;

  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;else if (g === max) h = (b - r) / s + 2;else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }

  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Hsl, hsl, (0, _define.extend)(Color, {
  brighter: function (k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), hsl2rgb(h, m1, m2), hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
  },
  displayable: function () {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl: function () {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
  }
}));
/* From FvD 13.37, CSS Color Module Level 3 */

function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

},{"./define.js":59}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cubehelix;
exports.Cubehelix = Cubehelix;

var _define = _interopRequireWildcard(require("./define.js"));

var _color = require("./color.js");

var _math = require("./math.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var A = -0.14861,
    B = +1.78277,
    C = -0.29227,
    D = -0.90649,
    E = +1.97294,
    ED = E * D,
    EB = E * B,
    BC_DA = B * C - D * A;

function cubehelixConvert(o) {
  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
      bl = b - l,
      k = (E * (g - l) - C * bl) / D,
      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)),
      // NaN if l=0 or l=1
  h = s ? Math.atan2(k, bl) * _math.rad2deg - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}

function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}

function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

(0, _define.default)(Cubehelix, cubehelix, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    k = k == null ? _color.brighter : Math.pow(_color.brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function (k) {
    k = k == null ? _color.darker : Math.pow(_color.darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function () {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * _math.deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new _color.Rgb(255 * (l + a * (A * cosh + B * sinh)), 255 * (l + a * (C * cosh + D * sinh)), 255 * (l + a * (E * cosh)), this.opacity);
  }
}));

},{"./color.js":57,"./define.js":59,"./math.js":62}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.extend = extend;

function _default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);

  for (var key in definition) prototype[key] = definition[key];

  return prototype;
}

},{}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "rgb", {
  enumerable: true,
  get: function () {
    return _color.rgb;
  }
});
Object.defineProperty(exports, "hsl", {
  enumerable: true,
  get: function () {
    return _color.hsl;
  }
});
Object.defineProperty(exports, "lab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "hcl", {
  enumerable: true,
  get: function () {
    return _lab.hcl;
  }
});
Object.defineProperty(exports, "lch", {
  enumerable: true,
  get: function () {
    return _lab.lch;
  }
});
Object.defineProperty(exports, "gray", {
  enumerable: true,
  get: function () {
    return _lab.gray;
  }
});
Object.defineProperty(exports, "cubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});

var _color = _interopRequireWildcard(require("./color.js"));

var _lab = _interopRequireWildcard(require("./lab.js"));

var _cubehelix = _interopRequireDefault(require("./cubehelix.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./color.js":57,"./cubehelix.js":58,"./lab.js":61}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gray = gray;
exports.default = lab;
exports.Lab = Lab;
exports.lch = lch;
exports.hcl = hcl;
exports.Hcl = Hcl;

var _define = _interopRequireWildcard(require("./define.js"));

var _color = require("./color.js");

var _math = require("./math.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// https://observablehq.com/@mbostock/lab-and-rgb
var K = 18,
    Xn = 0.96422,
    Yn = 1,
    Zn = 0.82521,
    t0 = 4 / 29,
    t1 = 6 / 29,
    t2 = 3 * t1 * t1,
    t3 = t1 * t1 * t1;

function labConvert(o) {
  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl) return hcl2lab(o);
  if (!(o instanceof _color.Rgb)) o = (0, _color.rgbConvert)(o);
  var r = rgb2lrgb(o.r),
      g = rgb2lrgb(o.g),
      b = rgb2lrgb(o.b),
      y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn),
      x,
      z;
  if (r === g && g === b) x = z = y;else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}

function gray(l, opacity) {
  return new Lab(l, 0, 0, opacity == null ? 1 : opacity);
}

function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}

function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}

(0, _define.default)(Lab, lab, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker: function (k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb: function () {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new _color.Rgb(lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z), lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z), lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z), this.opacity);
  }
}));

function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}

function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}

function lrgb2rgb(x) {
  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}

function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function hclConvert(o) {
  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab)) o = labConvert(o);
  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);

  var h = Math.atan2(o.b, o.a) * _math.rad2deg;

  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}

function lch(l, c, h, opacity) {
  return arguments.length === 1 ? hclConvert(l) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}

function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}

function hcl2lab(o) {
  if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * _math.deg2rad;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}

(0, _define.default)(Hcl, hcl, (0, _define.extend)(_color.Color, {
  brighter: function (k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker: function (k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb: function () {
    return hcl2lab(this).rgb();
  }
}));

},{"./color.js":57,"./define.js":59,"./math.js":62}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rad2deg = exports.deg2rad = void 0;
var deg2rad = Math.PI / 180;
exports.deg2rad = deg2rad;
var rad2deg = 180 / Math.PI;
exports.rad2deg = rad2deg;

},{}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(ring) {
  var i = 0,
      n = ring.length,
      area = ring[n - 1][1] * ring[0][0] - ring[n - 1][0] * ring[0][1];

  while (++i < n) area += ring[i - 1][1] * ring[i][0] - ring[i - 1][0] * ring[i][1];

  return area;
}

},{}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = void 0;
var array = Array.prototype;
var slice = array.slice;
exports.slice = slice;

},{}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a - b;
}

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blurX = blurX;
exports.blurY = blurY;

// TODO Optimize edge cases.
// TODO Optimize index calculation.
// TODO Optimize arguments.
function blurX(source, target, r) {
  var n = source.width,
      m = source.height,
      w = (r << 1) + 1;

  for (var j = 0; j < m; ++j) {
    for (var i = 0, sr = 0; i < n + r; ++i) {
      if (i < n) {
        sr += source.data[i + j * n];
      }

      if (i >= r) {
        if (i >= w) {
          sr -= source.data[i - w + j * n];
        }

        target.data[i - r + j * n] = sr / Math.min(i + 1, n - 1 + w - i, w);
      }
    }
  }
} // TODO Optimize edge cases.
// TODO Optimize index calculation.
// TODO Optimize arguments.


function blurY(source, target, r) {
  var n = source.width,
      m = source.height,
      w = (r << 1) + 1;

  for (var i = 0; i < n; ++i) {
    for (var j = 0, sr = 0; j < m + r; ++j) {
      if (j < m) {
        sr += source.data[i + j * n];
      }

      if (j >= r) {
        if (j >= w) {
          sr -= source.data[i + (j - w) * n];
        }

        target.data[i + (j - r) * n] = sr / Math.min(j + 1, m - 1 + w - j, w);
      }
    }
  }
}

},{}],67:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],68:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(ring, hole) {
  var i = -1,
      n = hole.length,
      c;

  while (++i < n) if (c = ringContains(ring, hole[i])) return c;

  return 0;
}

function ringContains(ring, point) {
  var x = point[0],
      y = point[1],
      contains = -1;

  for (var i = 0, n = ring.length, j = n - 1; i < n; j = i++) {
    var pi = ring[i],
        xi = pi[0],
        yi = pi[1],
        pj = ring[j],
        xj = pj[0],
        yj = pj[1];
    if (segmentContains(pi, pj, point)) return 0;
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) contains = -contains;
  }

  return contains;
}

function segmentContains(a, b, c) {
  var i;
  return collinear(a, b, c) && within(a[i = +(a[0] === b[0])], c[i], b[i]);
}

function collinear(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) === (c[0] - a[0]) * (b[1] - a[1]);
}

function within(p, q, r) {
  return p <= q && q <= r || r <= q && q <= p;
}

},{}],69:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _array = require("./array");

var _ascending = _interopRequireDefault(require("./ascending"));

var _area = _interopRequireDefault(require("./area"));

var _constant = _interopRequireDefault(require("./constant"));

var _contains = _interopRequireDefault(require("./contains"));

var _noop = _interopRequireDefault(require("./noop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cases = [[], [[[1.0, 1.5], [0.5, 1.0]]], [[[1.5, 1.0], [1.0, 1.5]]], [[[1.5, 1.0], [0.5, 1.0]]], [[[1.0, 0.5], [1.5, 1.0]]], [[[1.0, 1.5], [0.5, 1.0]], [[1.0, 0.5], [1.5, 1.0]]], [[[1.0, 0.5], [1.0, 1.5]]], [[[1.0, 0.5], [0.5, 1.0]]], [[[0.5, 1.0], [1.0, 0.5]]], [[[1.0, 1.5], [1.0, 0.5]]], [[[0.5, 1.0], [1.0, 0.5]], [[1.5, 1.0], [1.0, 1.5]]], [[[1.5, 1.0], [1.0, 0.5]]], [[[0.5, 1.0], [1.5, 1.0]]], [[[1.0, 1.5], [1.5, 1.0]]], [[[0.5, 1.0], [1.0, 1.5]]], []];

function _default() {
  var dx = 1,
      dy = 1,
      threshold = _d3Array.thresholdSturges,
      smooth = smoothLinear;

  function contours(values) {
    var tz = threshold(values); // Convert number of thresholds into uniform thresholds.

    if (!Array.isArray(tz)) {
      var domain = (0, _d3Array.extent)(values),
          start = domain[0],
          stop = domain[1];
      tz = (0, _d3Array.tickStep)(start, stop, tz);
      tz = (0, _d3Array.range)(Math.floor(start / tz) * tz, Math.floor(stop / tz) * tz, tz);
    } else {
      tz = tz.slice().sort(_ascending.default);
    }

    return tz.map(function (value) {
      return contour(values, value);
    });
  } // Accumulate, smooth contour rings, assign holes to exterior rings.
  // Based on https://github.com/mbostock/shapefile/blob/v0.6.2/shp/polygon.js


  function contour(values, value) {
    var polygons = [],
        holes = [];
    isorings(values, value, function (ring) {
      smooth(ring, values, value);
      if ((0, _area.default)(ring) > 0) polygons.push([ring]);else holes.push(ring);
    });
    holes.forEach(function (hole) {
      for (var i = 0, n = polygons.length, polygon; i < n; ++i) {
        if ((0, _contains.default)((polygon = polygons[i])[0], hole) !== -1) {
          polygon.push(hole);
          return;
        }
      }
    });
    return {
      type: "MultiPolygon",
      value: value,
      coordinates: polygons
    };
  } // Marching squares with isolines stitched into rings.
  // Based on https://github.com/topojson/topojson-client/blob/v3.0.0/src/stitch.js


  function isorings(values, value, callback) {
    var fragmentByStart = new Array(),
        fragmentByEnd = new Array(),
        x,
        y,
        t0,
        t1,
        t2,
        t3; // Special case for the first row (y = -1, t2 = t3 = 0).

    x = y = -1;
    t1 = values[0] >= value;
    cases[t1 << 1].forEach(stitch);

    while (++x < dx - 1) {
      t0 = t1, t1 = values[x + 1] >= value;
      cases[t0 | t1 << 1].forEach(stitch);
    }

    cases[t1 << 0].forEach(stitch); // General case for the intermediate rows.

    while (++y < dy - 1) {
      x = -1;
      t1 = values[y * dx + dx] >= value;
      t2 = values[y * dx] >= value;
      cases[t1 << 1 | t2 << 2].forEach(stitch);

      while (++x < dx - 1) {
        t0 = t1, t1 = values[y * dx + dx + x + 1] >= value;
        t3 = t2, t2 = values[y * dx + x + 1] >= value;
        cases[t0 | t1 << 1 | t2 << 2 | t3 << 3].forEach(stitch);
      }

      cases[t1 | t2 << 3].forEach(stitch);
    } // Special case for the last row (y = dy - 1, t0 = t1 = 0).


    x = -1;
    t2 = values[y * dx] >= value;
    cases[t2 << 2].forEach(stitch);

    while (++x < dx - 1) {
      t3 = t2, t2 = values[y * dx + x + 1] >= value;
      cases[t2 << 2 | t3 << 3].forEach(stitch);
    }

    cases[t2 << 3].forEach(stitch);

    function stitch(line) {
      var start = [line[0][0] + x, line[0][1] + y],
          end = [line[1][0] + x, line[1][1] + y],
          startIndex = index(start),
          endIndex = index(end),
          f,
          g;

      if (f = fragmentByEnd[startIndex]) {
        if (g = fragmentByStart[endIndex]) {
          delete fragmentByEnd[f.end];
          delete fragmentByStart[g.start];

          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[f.start] = fragmentByEnd[g.end] = {
              start: f.start,
              end: g.end,
              ring: f.ring.concat(g.ring)
            };
          }
        } else {
          delete fragmentByEnd[f.end];
          f.ring.push(end);
          fragmentByEnd[f.end = endIndex] = f;
        }
      } else if (f = fragmentByStart[endIndex]) {
        if (g = fragmentByEnd[startIndex]) {
          delete fragmentByStart[f.start];
          delete fragmentByEnd[g.end];

          if (f === g) {
            f.ring.push(end);
            callback(f.ring);
          } else {
            fragmentByStart[g.start] = fragmentByEnd[f.end] = {
              start: g.start,
              end: f.end,
              ring: g.ring.concat(f.ring)
            };
          }
        } else {
          delete fragmentByStart[f.start];
          f.ring.unshift(start);
          fragmentByStart[f.start = startIndex] = f;
        }
      } else {
        fragmentByStart[startIndex] = fragmentByEnd[endIndex] = {
          start: startIndex,
          end: endIndex,
          ring: [start, end]
        };
      }
    }
  }

  function index(point) {
    return point[0] * 2 + point[1] * (dx + 1) * 4;
  }

  function smoothLinear(ring, values, value) {
    ring.forEach(function (point) {
      var x = point[0],
          y = point[1],
          xt = x | 0,
          yt = y | 0,
          v0,
          v1 = values[yt * dx + xt];

      if (x > 0 && x < dx && xt === x) {
        v0 = values[yt * dx + xt - 1];
        point[0] = x + (value - v0) / (v1 - v0) - 0.5;
      }

      if (y > 0 && y < dy && yt === y) {
        v0 = values[(yt - 1) * dx + xt];
        point[1] = y + (value - v0) / (v1 - v0) - 0.5;
      }
    });
  }

  contours.contour = contour;

  contours.size = function (_) {
    if (!arguments.length) return [dx, dy];

    var _0 = Math.ceil(_[0]),
        _1 = Math.ceil(_[1]);

    if (!(_0 > 0) || !(_1 > 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, contours;
  };

  contours.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? (0, _constant.default)(_array.slice.call(_)) : (0, _constant.default)(_), contours) : threshold;
  };

  contours.smooth = function (_) {
    return arguments.length ? (smooth = _ ? smoothLinear : _noop.default, contours) : smooth === smoothLinear;
  };

  return contours;
}

},{"./area":63,"./array":64,"./ascending":65,"./constant":67,"./contains":68,"./noop":72,"d3-array":14}],70:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _array = require("./array");

var _blur = require("./blur");

var _constant = _interopRequireDefault(require("./constant"));

var _contours = _interopRequireDefault(require("./contours"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultX(d) {
  return d[0];
}

function defaultY(d) {
  return d[1];
}

function defaultWeight() {
  return 1;
}

function _default() {
  var x = defaultX,
      y = defaultY,
      weight = defaultWeight,
      dx = 960,
      dy = 500,
      r = 20,
      // blur radius
  k = 2,
      // log2(grid cell size)
  o = r * 3,
      // grid offset, to pad for blur
  n = dx + o * 2 >> k,
      // grid width
  m = dy + o * 2 >> k,
      // grid height
  threshold = (0, _constant.default)(20);

  function density(data) {
    var values0 = new Float32Array(n * m),
        values1 = new Float32Array(n * m);
    data.forEach(function (d, i, data) {
      var xi = +x(d, i, data) + o >> k,
          yi = +y(d, i, data) + o >> k,
          wi = +weight(d, i, data);

      if (xi >= 0 && xi < n && yi >= 0 && yi < m) {
        values0[xi + yi * n] += wi;
      }
    }); // TODO Optimize.

    (0, _blur.blurX)({
      width: n,
      height: m,
      data: values0
    }, {
      width: n,
      height: m,
      data: values1
    }, r >> k);
    (0, _blur.blurY)({
      width: n,
      height: m,
      data: values1
    }, {
      width: n,
      height: m,
      data: values0
    }, r >> k);
    (0, _blur.blurX)({
      width: n,
      height: m,
      data: values0
    }, {
      width: n,
      height: m,
      data: values1
    }, r >> k);
    (0, _blur.blurY)({
      width: n,
      height: m,
      data: values1
    }, {
      width: n,
      height: m,
      data: values0
    }, r >> k);
    (0, _blur.blurX)({
      width: n,
      height: m,
      data: values0
    }, {
      width: n,
      height: m,
      data: values1
    }, r >> k);
    (0, _blur.blurY)({
      width: n,
      height: m,
      data: values1
    }, {
      width: n,
      height: m,
      data: values0
    }, r >> k);
    var tz = threshold(values0); // Convert number of thresholds into uniform thresholds.

    if (!Array.isArray(tz)) {
      var stop = (0, _d3Array.max)(values0);
      tz = (0, _d3Array.tickStep)(0, stop, tz);
      tz = (0, _d3Array.range)(0, Math.floor(stop / tz) * tz, tz);
      tz.shift();
    }

    return (0, _contours.default)().thresholds(tz).size([n, m])(values0).map(transform);
  }

  function transform(geometry) {
    geometry.value *= Math.pow(2, -2 * k); // Density in points per square pixel.

    geometry.coordinates.forEach(transformPolygon);
    return geometry;
  }

  function transformPolygon(coordinates) {
    coordinates.forEach(transformRing);
  }

  function transformRing(coordinates) {
    coordinates.forEach(transformPoint);
  } // TODO Optimize.


  function transformPoint(coordinates) {
    coordinates[0] = coordinates[0] * Math.pow(2, k) - o;
    coordinates[1] = coordinates[1] * Math.pow(2, k) - o;
  }

  function resize() {
    o = r * 3;
    n = dx + o * 2 >> k;
    m = dy + o * 2 >> k;
    return density;
  }

  density.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), density) : x;
  };

  density.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), density) : y;
  };

  density.weight = function (_) {
    return arguments.length ? (weight = typeof _ === "function" ? _ : (0, _constant.default)(+_), density) : weight;
  };

  density.size = function (_) {
    if (!arguments.length) return [dx, dy];

    var _0 = Math.ceil(_[0]),
        _1 = Math.ceil(_[1]);

    if (!(_0 >= 0) && !(_0 >= 0)) throw new Error("invalid size");
    return dx = _0, dy = _1, resize();
  };

  density.cellSize = function (_) {
    if (!arguments.length) return 1 << k;
    if (!((_ = +_) >= 1)) throw new Error("invalid cell size");
    return k = Math.floor(Math.log(_) / Math.LN2), resize();
  };

  density.thresholds = function (_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? (0, _constant.default)(_array.slice.call(_)) : (0, _constant.default)(_), density) : threshold;
  };

  density.bandwidth = function (_) {
    if (!arguments.length) return Math.sqrt(r * (r + 1));
    if (!((_ = +_) >= 0)) throw new Error("invalid bandwidth");
    return r = Math.round((Math.sqrt(4 * _ * _ + 1) - 1) / 2), resize();
  };

  return density;
}

},{"./array":64,"./blur":66,"./constant":67,"./contours":69,"d3-array":14}],71:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "contours", {
  enumerable: true,
  get: function () {
    return _contours.default;
  }
});
Object.defineProperty(exports, "contourDensity", {
  enumerable: true,
  get: function () {
    return _density.default;
  }
});

var _contours = _interopRequireDefault(require("./contours"));

var _density = _interopRequireDefault(require("./density"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./contours":69,"./density":70}],72:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {}

},{}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var noop = {
  value: function () {}
};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }

  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {
      type: t,
      name: name
    };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function (typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length; // If no callback was specified, return the callback of the given type and name.

    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;

      return;
    } // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.


    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);

    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function () {
    var copy = {},
        _ = this._;

    for (var t in _) copy[t] = _[t].slice();

    return new Dispatch(copy);
  },
  call: function (type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function (type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);

    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }

  if (callback != null) type.push({
    name: name,
    value: callback
  });
  return type;
}

var _default = dispatch;
exports.default = _default;

},{}],74:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dispatch", {
  enumerable: true,
  get: function () {
    return _dispatch.default;
  }
});

var _dispatch = _interopRequireDefault(require("./dispatch.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./dispatch.js":73}],75:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Selection = require("d3-selection");

var _nodrag = _interopRequireWildcard(require("./nodrag.js"));

var _noevent = _interopRequireWildcard(require("./noevent.js"));

var _constant = _interopRequireDefault(require("./constant.js"));

var _event = _interopRequireDefault(require("./event.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !_d3Selection.event.ctrlKey && !_d3Selection.event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {
    x: _d3Selection.event.x,
    y: _d3Selection.event.y
  } : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}

function _default() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = (0, _d3Dispatch.dispatch)("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), _d3Selection.mouse, this, arguments);
    if (!gesture) return;
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    (0, _nodrag.default)(_d3Selection.event.view);
    (0, _noevent.nopropagation)();
    mousemoving = false;
    mousedownx = _d3Selection.event.clientX;
    mousedowny = _d3Selection.event.clientY;
    gesture("start");
  }

  function mousemoved() {
    (0, _noevent.default)();

    if (!mousemoving) {
      var dx = _d3Selection.event.clientX - mousedownx,
          dy = _d3Selection.event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }

    gestures.mouse("drag");
  }

  function mouseupped() {
    (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
    (0, _nodrag.yesdrag)(_d3Selection.event.view, mousemoving);
    (0, _noevent.default)();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = _d3Selection.event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, _d3Selection.touch, this, arguments)) {
        (0, _noevent.nopropagation)();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.default)();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, 500); // Ghost clicks are delayed!

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        (0, _noevent.nopropagation)();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id),
        s,
        dx,
        dy,
        sublisteners = listeners.copy();
    if (!(0, _d3Selection.customEvent)(new _event.default(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function () {
      if ((_d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;
    return function gesture(type) {
      var p0 = p,
          n;

      switch (type) {
        case "start":
          gestures[id] = gesture, n = active++;
          break;

        case "end":
          delete gestures[id], --active;
        // nobreak

        case "drag":
          p = point(container, id), n = active;
          break;
      }

      (0, _d3Selection.customEvent)(new _event.default(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : filter;
  };

  drag.container = function (_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : container;
  };

  drag.subject = function (_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : (0, _constant.default)(_), drag) : subject;
  };

  drag.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), drag) : touchable;
  };

  drag.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

},{"./constant.js":75,"./event.js":77,"./nodrag.js":79,"./noevent.js":80,"d3-dispatch":74,"d3-selection":355}],77:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DragEvent;

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function () {
  var value = this._.on.apply(this._, arguments);

  return value === this._ ? this : value;
};

},{}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "drag", {
  enumerable: true,
  get: function () {
    return _drag.default;
  }
});
Object.defineProperty(exports, "dragDisable", {
  enumerable: true,
  get: function () {
    return _nodrag.default;
  }
});
Object.defineProperty(exports, "dragEnable", {
  enumerable: true,
  get: function () {
    return _nodrag.yesdrag;
  }
});

var _drag = _interopRequireDefault(require("./drag.js"));

var _nodrag = _interopRequireWildcard(require("./nodrag.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./drag.js":76,"./nodrag.js":79}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.yesdrag = yesdrag;

var _d3Selection = require("d3-selection");

var _noevent = _interopRequireDefault(require("./noevent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(view) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", _noevent.default, true);

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", _noevent.default, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = (0, _d3Selection.select)(view).on("dragstart.drag", null);

  if (noclick) {
    selection.on("click.drag", _noevent.default, true);
    setTimeout(function () {
      selection.on("click.drag", null);
    }, 0);
  }

  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

},{"./noevent.js":80,"d3-selection":355}],80:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"d3-selection":355,"dup":43}],81:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = autoType;

function autoType(object) {
  for (var key in object) {
    var value = object[key].trim(),
        number,
        m;
    if (!value) value = null;else if (value === "true") value = true;else if (value === "false") value = false;else if (value === "NaN") value = NaN;else if (!isNaN(number = +value)) value = number;else if (m = value.match(/^([-+]\d{2})?\d{4}(-\d{2}(-\d{2})?)?(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[-+]\d{2}:\d{2})?)?$/)) {
      if (fixtz && !!m[4] && !m[7]) value = value.replace(/-/g, "/").replace(/T/, " ");
      value = new Date(value);
    } else continue;
    object[key] = value;
  }

  return object;
} // https://github.com/d3/d3-dsv/issues/45


var fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

},{}],82:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.csvFormatValue = exports.csvFormatRow = exports.csvFormatRows = exports.csvFormatBody = exports.csvFormat = exports.csvParseRows = exports.csvParse = void 0;

var _dsv = _interopRequireDefault(require("./dsv.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var csv = (0, _dsv.default)(",");
var csvParse = csv.parse;
exports.csvParse = csvParse;
var csvParseRows = csv.parseRows;
exports.csvParseRows = csvParseRows;
var csvFormat = csv.format;
exports.csvFormat = csvFormat;
var csvFormatBody = csv.formatBody;
exports.csvFormatBody = csvFormatBody;
var csvFormatRows = csv.formatRows;
exports.csvFormatRows = csvFormatRows;
var csvFormatRow = csv.formatRow;
exports.csvFormatRow = csvFormatRow;
var csvFormatValue = csv.formatValue;
exports.csvFormatValue = csvFormatValue;

},{"./dsv.js":83}],83:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function (name, i) {
    return JSON.stringify(name) + ": d[" + i + "] || \"\"";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
} // Compute unique columns in order of discovery.


function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];
  rows.forEach(function (row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });
  return columns;
}

function pad(value, width) {
  var s = value + "",
      length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6) : year > 9999 ? "+" + pad(year, 6) : pad(year, 4);
}

function formatDate(date) {
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();
  return isNaN(date) ? "Invalid Date" : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2) + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z" : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z" : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z" : "");
}

function _default(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
        columns,
        rows = parseRows(text, function (row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [],
        // output rows
    N = text.length,
        I = 0,
        // current character index
    n = 0,
        // current line number
    t,
        // current token
    eof = N <= 0,
        // current token followed by EOF?
    eol = false; // current token followed by EOL?
    // Strip the trailing newline.

    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL; // Unescape quotes.

      var i,
          j = I,
          c;

      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);

        if ((i = I) >= N) eof = true;else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      } // Find next delimiter or newline.


      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        } else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      } // Return last token before EOF.


      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];

      while (t !== EOL && t !== EOF) row.push(t), t = token();

      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function preformatBody(rows, columns) {
    return rows.map(function (row) {
      return columns.map(function (column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
  }

  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(value) {
    return value == null ? "" : value instanceof Date ? formatDate(value) : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\"" : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows,
    formatRow: formatRow,
    formatValue: formatValue
  };
}

},{}],84:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dsvFormat", {
  enumerable: true,
  get: function () {
    return _dsv.default;
  }
});
Object.defineProperty(exports, "csvParse", {
  enumerable: true,
  get: function () {
    return _csv.csvParse;
  }
});
Object.defineProperty(exports, "csvParseRows", {
  enumerable: true,
  get: function () {
    return _csv.csvParseRows;
  }
});
Object.defineProperty(exports, "csvFormat", {
  enumerable: true,
  get: function () {
    return _csv.csvFormat;
  }
});
Object.defineProperty(exports, "csvFormatBody", {
  enumerable: true,
  get: function () {
    return _csv.csvFormatBody;
  }
});
Object.defineProperty(exports, "csvFormatRows", {
  enumerable: true,
  get: function () {
    return _csv.csvFormatRows;
  }
});
Object.defineProperty(exports, "csvFormatRow", {
  enumerable: true,
  get: function () {
    return _csv.csvFormatRow;
  }
});
Object.defineProperty(exports, "csvFormatValue", {
  enumerable: true,
  get: function () {
    return _csv.csvFormatValue;
  }
});
Object.defineProperty(exports, "tsvParse", {
  enumerable: true,
  get: function () {
    return _tsv.tsvParse;
  }
});
Object.defineProperty(exports, "tsvParseRows", {
  enumerable: true,
  get: function () {
    return _tsv.tsvParseRows;
  }
});
Object.defineProperty(exports, "tsvFormat", {
  enumerable: true,
  get: function () {
    return _tsv.tsvFormat;
  }
});
Object.defineProperty(exports, "tsvFormatBody", {
  enumerable: true,
  get: function () {
    return _tsv.tsvFormatBody;
  }
});
Object.defineProperty(exports, "tsvFormatRows", {
  enumerable: true,
  get: function () {
    return _tsv.tsvFormatRows;
  }
});
Object.defineProperty(exports, "tsvFormatRow", {
  enumerable: true,
  get: function () {
    return _tsv.tsvFormatRow;
  }
});
Object.defineProperty(exports, "tsvFormatValue", {
  enumerable: true,
  get: function () {
    return _tsv.tsvFormatValue;
  }
});
Object.defineProperty(exports, "autoType", {
  enumerable: true,
  get: function () {
    return _autoType.default;
  }
});

var _dsv = _interopRequireDefault(require("./dsv.js"));

var _csv = require("./csv.js");

var _tsv = require("./tsv.js");

var _autoType = _interopRequireDefault(require("./autoType.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./autoType.js":81,"./csv.js":82,"./dsv.js":83,"./tsv.js":85}],85:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tsvFormatValue = exports.tsvFormatRow = exports.tsvFormatRows = exports.tsvFormatBody = exports.tsvFormat = exports.tsvParseRows = exports.tsvParse = void 0;

var _dsv = _interopRequireDefault(require("./dsv.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tsv = (0, _dsv.default)("\t");
var tsvParse = tsv.parse;
exports.tsvParse = tsvParse;
var tsvParseRows = tsv.parseRows;
exports.tsvParseRows = tsvParseRows;
var tsvFormat = tsv.format;
exports.tsvFormat = tsvFormat;
var tsvFormatBody = tsv.formatBody;
exports.tsvFormatBody = tsvFormatBody;
var tsvFormatRows = tsv.formatRows;
exports.tsvFormatRows = tsvFormatRows;
var tsvFormatRow = tsv.formatRow;
exports.tsvFormatRow = tsvFormatRow;
var tsvFormatValue = tsv.formatValue;
exports.tsvFormatValue = tsvFormatValue;

},{"./dsv.js":83}],86:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backInOut = exports.backOut = exports.backIn = void 0;
var overshoot = 1.70158;

var backIn = function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;
  return backIn;
}(overshoot);

exports.backIn = backIn;

var backOut = function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;
  return backOut;
}(overshoot);

exports.backOut = backOut;

var backInOut = function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;
  return backInOut;
}(overshoot);

exports.backInOut = backInOut;

},{}],87:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bounceIn = bounceIn;
exports.bounceOut = bounceOut;
exports.bounceInOut = bounceInOut;
var b1 = 4 / 11,
    b2 = 6 / 11,
    b3 = 8 / 11,
    b4 = 3 / 4,
    b5 = 9 / 11,
    b6 = 10 / 11,
    b7 = 15 / 16,
    b8 = 21 / 22,
    b9 = 63 / 64,
    b0 = 1 / b1 / b1;

function bounceIn(t) {
  return 1 - bounceOut(1 - t);
}

function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

function bounceInOut(t) {
  return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
}

},{}],88:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIn = circleIn;
exports.circleOut = circleOut;
exports.circleInOut = circleInOut;

function circleIn(t) {
  return 1 - Math.sqrt(1 - t * t);
}

function circleOut(t) {
  return Math.sqrt(1 - --t * t);
}

function circleInOut(t) {
  return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
}

},{}],89:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubicIn = cubicIn;
exports.cubicOut = cubicOut;
exports.cubicInOut = cubicInOut;

function cubicIn(t) {
  return t * t * t;
}

function cubicOut(t) {
  return --t * t * t + 1;
}

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

},{}],90:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elasticInOut = exports.elasticOut = exports.elasticIn = void 0;
var tau = 2 * Math.PI,
    amplitude = 1,
    period = 0.3;

var elasticIn = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticIn.period = function (p) {
    return custom(a, p);
  };

  return elasticIn;
}(amplitude, period);

exports.elasticIn = elasticIn;

var elasticOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticOut.period = function (p) {
    return custom(a, p);
  };

  return elasticOut;
}(amplitude, period);

exports.elasticOut = elasticOut;

var elasticInOut = function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0 ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p) : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function (a) {
    return custom(a, p * tau);
  };

  elasticInOut.period = function (p) {
    return custom(a, p);
  };

  return elasticInOut;
}(amplitude, period);

exports.elasticInOut = elasticInOut;

},{}],91:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expIn = expIn;
exports.expOut = expOut;
exports.expInOut = expInOut;

function expIn(t) {
  return Math.pow(2, 10 * t - 10);
}

function expOut(t) {
  return 1 - Math.pow(2, -10 * t);
}

function expInOut(t) {
  return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
}

},{}],92:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "easeLinear", {
  enumerable: true,
  get: function () {
    return _linear.linear;
  }
});
Object.defineProperty(exports, "easeQuad", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeQuadIn", {
  enumerable: true,
  get: function () {
    return _quad.quadIn;
  }
});
Object.defineProperty(exports, "easeQuadOut", {
  enumerable: true,
  get: function () {
    return _quad.quadOut;
  }
});
Object.defineProperty(exports, "easeQuadInOut", {
  enumerable: true,
  get: function () {
    return _quad.quadInOut;
  }
});
Object.defineProperty(exports, "easeCubic", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easeCubicIn", {
  enumerable: true,
  get: function () {
    return _cubic.cubicIn;
  }
});
Object.defineProperty(exports, "easeCubicOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicOut;
  }
});
Object.defineProperty(exports, "easeCubicInOut", {
  enumerable: true,
  get: function () {
    return _cubic.cubicInOut;
  }
});
Object.defineProperty(exports, "easePoly", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easePolyIn", {
  enumerable: true,
  get: function () {
    return _poly.polyIn;
  }
});
Object.defineProperty(exports, "easePolyOut", {
  enumerable: true,
  get: function () {
    return _poly.polyOut;
  }
});
Object.defineProperty(exports, "easePolyInOut", {
  enumerable: true,
  get: function () {
    return _poly.polyInOut;
  }
});
Object.defineProperty(exports, "easeSin", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeSinIn", {
  enumerable: true,
  get: function () {
    return _sin.sinIn;
  }
});
Object.defineProperty(exports, "easeSinOut", {
  enumerable: true,
  get: function () {
    return _sin.sinOut;
  }
});
Object.defineProperty(exports, "easeSinInOut", {
  enumerable: true,
  get: function () {
    return _sin.sinInOut;
  }
});
Object.defineProperty(exports, "easeExp", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeExpIn", {
  enumerable: true,
  get: function () {
    return _exp.expIn;
  }
});
Object.defineProperty(exports, "easeExpOut", {
  enumerable: true,
  get: function () {
    return _exp.expOut;
  }
});
Object.defineProperty(exports, "easeExpInOut", {
  enumerable: true,
  get: function () {
    return _exp.expInOut;
  }
});
Object.defineProperty(exports, "easeCircle", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeCircleIn", {
  enumerable: true,
  get: function () {
    return _circle.circleIn;
  }
});
Object.defineProperty(exports, "easeCircleOut", {
  enumerable: true,
  get: function () {
    return _circle.circleOut;
  }
});
Object.defineProperty(exports, "easeCircleInOut", {
  enumerable: true,
  get: function () {
    return _circle.circleInOut;
  }
});
Object.defineProperty(exports, "easeBounce", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceIn", {
  enumerable: true,
  get: function () {
    return _bounce.bounceIn;
  }
});
Object.defineProperty(exports, "easeBounceOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceOut;
  }
});
Object.defineProperty(exports, "easeBounceInOut", {
  enumerable: true,
  get: function () {
    return _bounce.bounceInOut;
  }
});
Object.defineProperty(exports, "easeBack", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeBackIn", {
  enumerable: true,
  get: function () {
    return _back.backIn;
  }
});
Object.defineProperty(exports, "easeBackOut", {
  enumerable: true,
  get: function () {
    return _back.backOut;
  }
});
Object.defineProperty(exports, "easeBackInOut", {
  enumerable: true,
  get: function () {
    return _back.backInOut;
  }
});
Object.defineProperty(exports, "easeElastic", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticIn", {
  enumerable: true,
  get: function () {
    return _elastic.elasticIn;
  }
});
Object.defineProperty(exports, "easeElasticOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticOut;
  }
});
Object.defineProperty(exports, "easeElasticInOut", {
  enumerable: true,
  get: function () {
    return _elastic.elasticInOut;
  }
});

var _linear = require("./linear.js");

var _quad = require("./quad.js");

var _cubic = require("./cubic.js");

var _poly = require("./poly.js");

var _sin = require("./sin.js");

var _exp = require("./exp.js");

var _circle = require("./circle.js");

var _bounce = require("./bounce.js");

var _back = require("./back.js");

var _elastic = require("./elastic.js");

},{"./back.js":86,"./bounce.js":87,"./circle.js":88,"./cubic.js":89,"./elastic.js":90,"./exp.js":91,"./linear.js":93,"./poly.js":94,"./quad.js":95,"./sin.js":96}],93:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;

function linear(t) {
  return +t;
}

},{}],94:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polyInOut = exports.polyOut = exports.polyIn = void 0;
var exponent = 3;

var polyIn = function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;
  return polyIn;
}(exponent);

exports.polyIn = polyIn;

var polyOut = function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;
  return polyOut;
}(exponent);

exports.polyOut = polyOut;

var polyInOut = function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;
  return polyInOut;
}(exponent);

exports.polyInOut = polyInOut;

},{}],95:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.quadIn = quadIn;
exports.quadOut = quadOut;
exports.quadInOut = quadInOut;

function quadIn(t) {
  return t * t;
}

function quadOut(t) {
  return t * (2 - t);
}

function quadInOut(t) {
  return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
}

},{}],96:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sinIn = sinIn;
exports.sinOut = sinOut;
exports.sinInOut = sinInOut;
var pi = Math.PI,
    halfPi = pi / 2;

function sinIn(t) {
  return 1 - Math.cos(t * halfPi);
}

function sinOut(t) {
  return Math.sin(t * halfPi);
}

function sinInOut(t) {
  return (1 - Math.cos(pi * t)) / 2;
}

},{}],97:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function responseBlob(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.blob();
}

function _default(input, init) {
  return fetch(input, init).then(responseBlob);
}

},{}],98:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function responseArrayBuffer(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.arrayBuffer();
}

function _default(input, init) {
  return fetch(input, init).then(responseArrayBuffer);
}

},{}],99:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dsv;
exports.tsv = exports.csv = void 0;

var _d3Dsv = require("d3-dsv");

var _text = _interopRequireDefault(require("./text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dsvParse(parse) {
  return function (input, init, row) {
    if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
    return (0, _text.default)(input, init).then(function (response) {
      return parse(response, row);
    });
  };
}

function dsv(delimiter, input, init, row) {
  if (arguments.length === 3 && typeof init === "function") row = init, init = undefined;
  var format = (0, _d3Dsv.dsvFormat)(delimiter);
  return (0, _text.default)(input, init).then(function (response) {
    return format.parse(response, row);
  });
}

var csv = dsvParse(_d3Dsv.csvParse);
exports.csv = csv;
var tsv = dsvParse(_d3Dsv.tsvParse);
exports.tsv = tsv;

},{"./text":103,"d3-dsv":84}],100:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(input, init) {
  return new Promise(function (resolve, reject) {
    var image = new Image();

    for (var key in init) image[key] = init[key];

    image.onerror = reject;

    image.onload = function () {
      resolve(image);
    };

    image.src = input;
  });
}

},{}],101:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "blob", {
  enumerable: true,
  get: function () {
    return _blob.default;
  }
});
Object.defineProperty(exports, "buffer", {
  enumerable: true,
  get: function () {
    return _buffer.default;
  }
});
Object.defineProperty(exports, "dsv", {
  enumerable: true,
  get: function () {
    return _dsv.default;
  }
});
Object.defineProperty(exports, "csv", {
  enumerable: true,
  get: function () {
    return _dsv.csv;
  }
});
Object.defineProperty(exports, "tsv", {
  enumerable: true,
  get: function () {
    return _dsv.tsv;
  }
});
Object.defineProperty(exports, "image", {
  enumerable: true,
  get: function () {
    return _image.default;
  }
});
Object.defineProperty(exports, "json", {
  enumerable: true,
  get: function () {
    return _json.default;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function () {
    return _text.default;
  }
});
Object.defineProperty(exports, "xml", {
  enumerable: true,
  get: function () {
    return _xml.default;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _xml.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _xml.svg;
  }
});

var _blob = _interopRequireDefault(require("./blob"));

var _buffer = _interopRequireDefault(require("./buffer"));

var _dsv = _interopRequireWildcard(require("./dsv"));

var _image = _interopRequireDefault(require("./image"));

var _json = _interopRequireDefault(require("./json"));

var _text = _interopRequireDefault(require("./text"));

var _xml = _interopRequireWildcard(require("./xml"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./blob":97,"./buffer":98,"./dsv":99,"./image":100,"./json":102,"./text":103,"./xml":104}],102:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function responseJson(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.json();
}

function _default(input, init) {
  return fetch(input, init).then(responseJson);
}

},{}],103:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function responseText(response) {
  if (!response.ok) throw new Error(response.status + " " + response.statusText);
  return response.text();
}

function _default(input, init) {
  return fetch(input, init).then(responseText);
}

},{}],104:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.svg = exports.html = exports.default = void 0;

var _text = _interopRequireDefault(require("./text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parser(type) {
  return function (input, init) {
    return (0, _text.default)(input, init).then(function (text) {
      return new DOMParser().parseFromString(text, type);
    });
  };
}

var _default = parser("application/xml");

exports.default = _default;
var html = parser("text/html");
exports.html = html;
var svg = parser("image/svg+xml");
exports.svg = svg;

},{"./text":103}],105:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "flextree", {
  enumerable: true,
  get: function () {
    return _flextree.default;
  }
});

var _flextree = _interopRequireDefault(require("./src/flextree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./src/flextree":107}],106:[function(require,module,exports){
module.exports={
  "_from": "d3-flextree@^2.1.1",
  "_id": "d3-flextree@2.1.1",
  "_inBundle": false,
  "_integrity": "sha1-DmuLibBgKwc9svSItbgDDOMY3ek=",
  "_location": "/d3-flextree",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "d3-flextree@^2.1.1",
    "name": "d3-flextree",
    "escapedName": "d3-flextree",
    "rawSpec": "^2.1.1",
    "saveSpec": null,
    "fetchSpec": "^2.1.1"
  },
  "_requiredBy": [
    "/markmap-lib"
  ],
  "_resolved": "https://registry.npm.taobao.org/d3-flextree/download/d3-flextree-2.1.1.tgz",
  "_shasum": "0e6b8b89b0602b073db2f488b5b8030ce318dde9",
  "_spec": "d3-flextree@^2.1.1",
  "_where": "E:\\markmap\\node_modules\\markmap-lib",
  "author": {
    "name": "Chris Maloney",
    "url": "http://chrismaloney.org"
  },
  "bugs": {
    "url": "https://github.com/klortho/d3-flextree/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "d3-hierarchy": "^1.1.5"
  },
  "deprecated": false,
  "description": "Flexible tree layout algorithm that allows for variable node sizes.",
  "devDependencies": {
    "babel-plugin-external-helpers": "^6.22.0",
    "babel-preset-es2015-rollup": "^3.0.0",
    "d3": "^4.13.0",
    "d3-selection-multi": "^1.0.1",
    "eslint": "^4.19.1",
    "jsdom": "^11.6.2",
    "npm-run-all": "^4.1.2",
    "rollup": "^0.55.3",
    "rollup-plugin-babel": "^2.7.1",
    "rollup-plugin-commonjs": "^8.0.2",
    "rollup-plugin-copy": "^0.2.3",
    "rollup-plugin-json": "^2.3.0",
    "rollup-plugin-node-resolve": "^3.0.2",
    "rollup-plugin-uglify": "^3.0.0",
    "uglify-es": "^3.3.9"
  },
  "homepage": "https://github.com/klortho/d3-flextree",
  "jsnext:main": "index",
  "keywords": [
    "d3",
    "d3-module",
    "layout",
    "tree",
    "hierarchy",
    "d3-hierarchy",
    "plugin",
    "d3-plugin",
    "infovis",
    "visualization",
    "2d"
  ],
  "license": "WTFPL",
  "main": "build/d3-flextree.js",
  "module": "index",
  "name": "d3-flextree",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/klortho/d3-flextree.git"
  },
  "scripts": {
    "build": "rollup -c",
    "build:demo": "rollup -c --environment BUILD:demo",
    "build:dev": "rollup -c --environment BUILD:dev",
    "build:prod": "rollup -c --environment BUILD:prod",
    "build:test": "rollup -c --environment BUILD:test",
    "clean": "rm -rf build demo test",
    "lint": "eslint index.js src",
    "prepare": "npm-run-all clean build lint test",
    "test": "npm-run-all test:*",
    "test:browser": "node test/browser-tests.js",
    "test:main": "node test/bundle.js"
  },
  "version": "2.1.1"
}

},{}],107:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flextree;

var _d3Hierarchy = require("d3-hierarchy");

var _package = require("../package.json");

const defaults = Object.freeze({
  children: data => data.children,
  nodeSize: node => node.data.size,
  spacing: 0
}); // Create a layout function with customizable options. Per D3-style, the
// options can be set at any time using setter methods. The layout function
// will compute the tree node positions based on the options in effect at the
// time it is called.

function flextree(options) {
  const opts = Object.assign({}, defaults, options);

  function accessor(name) {
    const opt = opts[name];
    return typeof opt === 'function' ? opt : () => opt;
  }

  function layout(tree) {
    const wtree = wrap(getWrapper(), tree, node => node.children);
    wtree.update();
    return wtree.data;
  }

  function getFlexNode() {
    const nodeSize = accessor('nodeSize');
    const spacing = accessor('spacing');
    return class FlexNode extends _d3Hierarchy.hierarchy.prototype.constructor {
      constructor(data) {
        super(data);
      }

      copy() {
        const c = wrap(this.constructor, this, node => node.children);
        c.each(node => node.data = node.data.data);
        return c;
      }

      get size() {
        return nodeSize(this);
      }

      spacing(oNode) {
        return spacing(this, oNode);
      }

      get nodes() {
        return this.descendants();
      }

      get xSize() {
        return this.size[0];
      }

      get ySize() {
        return this.size[1];
      }

      get top() {
        return this.y;
      }

      get bottom() {
        return this.y + this.ySize;
      }

      get left() {
        return this.x - this.xSize / 2;
      }

      get right() {
        return this.x + this.xSize / 2;
      }

      get root() {
        const ancs = this.ancestors();
        return ancs[ancs.length - 1];
      }

      get numChildren() {
        return this.hasChildren ? this.children.length : 0;
      }

      get hasChildren() {
        return !this.noChildren;
      }

      get noChildren() {
        return this.children === null;
      }

      get firstChild() {
        return this.hasChildren ? this.children[0] : null;
      }

      get lastChild() {
        return this.hasChildren ? this.children[this.numChildren - 1] : null;
      }

      get extents() {
        return (this.children || []).reduce((acc, kid) => FlexNode.maxExtents(acc, kid.extents), this.nodeExtents);
      }

      get nodeExtents() {
        return {
          top: this.top,
          bottom: this.bottom,
          left: this.left,
          right: this.right
        };
      }

      static maxExtents(e0, e1) {
        return {
          top: Math.min(e0.top, e1.top),
          bottom: Math.max(e0.bottom, e1.bottom),
          left: Math.min(e0.left, e1.left),
          right: Math.max(e0.right, e1.right)
        };
      }

    };
  }

  function getWrapper() {
    const FlexNode = getFlexNode();
    const nodeSize = accessor('nodeSize');
    const spacing = accessor('spacing');
    return class extends FlexNode {
      constructor(data) {
        super(data);
        Object.assign(this, {
          x: 0,
          y: 0,
          relX: 0,
          prelim: 0,
          shift: 0,
          change: 0,
          lExt: this,
          lExtRelX: 0,
          lThr: null,
          rExt: this,
          rExtRelX: 0,
          rThr: null
        });
      }

      get size() {
        return nodeSize(this.data);
      }

      spacing(oNode) {
        return spacing(this.data, oNode.data);
      }

      get x() {
        return this.data.x;
      }

      set x(v) {
        this.data.x = v;
      }

      get y() {
        return this.data.y;
      }

      set y(v) {
        this.data.y = v;
      }

      update() {
        layoutChildren(this);
        resolveX(this);
        return this;
      }

    };
  }

  function wrap(FlexClass, treeData, children) {
    const _wrap = (data, parent) => {
      const node = new FlexClass(data);
      Object.assign(node, {
        parent,
        depth: parent === null ? 0 : parent.depth + 1,
        height: 0,
        length: 1
      });
      const kidsData = children(data) || [];
      node.children = kidsData.length === 0 ? null : kidsData.map(kd => _wrap(kd, node));

      if (node.children) {
        Object.assign(node, node.children.reduce((hl, kid) => ({
          height: Math.max(hl.height, kid.height + 1),
          length: hl.length + kid.length
        }), node));
      }

      return node;
    };

    return _wrap(treeData, null);
  }

  Object.assign(layout, {
    nodeSize(arg) {
      return arguments.length ? (opts.nodeSize = arg, layout) : opts.nodeSize;
    },

    spacing(arg) {
      return arguments.length ? (opts.spacing = arg, layout) : opts.spacing;
    },

    children(arg) {
      return arguments.length ? (opts.children = arg, layout) : opts.children;
    },

    hierarchy(treeData, children) {
      const kids = typeof children === 'undefined' ? opts.children : children;
      return wrap(getFlexNode(), treeData, kids);
    },

    dump(tree) {
      const nodeSize = accessor('nodeSize');

      const _dump = i0 => node => {
        const i1 = i0 + '  ';
        const i2 = i0 + '    ';
        const {
          x,
          y
        } = node;
        const size = nodeSize(node);
        const kids = node.children || [];
        const kdumps = kids.length === 0 ? ' ' : `,${i1}children: [${i2}${kids.map(_dump(i2)).join(i2)}${i1}],${i0}`;
        return `{ size: [${size.join(', ')}],${i1}x: ${x}, y: ${y}${kdumps}},`;
      };

      return _dump('\n')(tree);
    }

  });
  return layout;
}

flextree.version = _package.version;

const layoutChildren = (w, y = 0) => {
  w.y = y;
  (w.children || []).reduce((acc, kid) => {
    const [i, lastLows] = acc;
    layoutChildren(kid, w.y + w.ySize); // The lowest vertical coordinate while extreme nodes still point
    // in current subtree.

    const lowY = (i === 0 ? kid.lExt : kid.rExt).bottom;
    if (i !== 0) separate(w, i, lastLows);
    const lows = updateLows(lowY, i, lastLows);
    return [i + 1, lows];
  }, [0, null]);
  shiftChange(w);
  positionRoot(w);
  return w;
}; // Resolves the relative coordinate properties - relX and prelim --
// to set the final, absolute x coordinate for each node. This also sets
// `prelim` to 0, so that `relX` for each node is its x-coordinate relative
// to its parent.


const resolveX = (w, prevSum, parentX) => {
  // A call to resolveX without arguments is assumed to be for the root of
  // the tree. This will set the root's x-coord to zero.
  if (typeof prevSum === 'undefined') {
    prevSum = -w.relX - w.prelim;
    parentX = 0;
  }

  const sum = prevSum + w.relX;
  w.relX = sum + w.prelim - parentX;
  w.prelim = 0;
  w.x = parentX + w.relX;
  (w.children || []).forEach(k => resolveX(k, sum, w.x));
  return w;
}; // Process shift and change for all children, to add intermediate spacing to
// each child's modifier.


const shiftChange = w => {
  (w.children || []).reduce((acc, child) => {
    const [lastShiftSum, lastChangeSum] = acc;
    const shiftSum = lastShiftSum + child.shift;
    const changeSum = lastChangeSum + shiftSum + child.change;
    child.relX += changeSum;
    return [shiftSum, changeSum];
  }, [0, 0]);
}; // Separates the latest child from its previous sibling

/* eslint-disable complexity */


const separate = (w, i, lows) => {
  const lSib = w.children[i - 1];
  const curSubtree = w.children[i];
  let rContour = lSib;
  let rSumMods = lSib.relX;
  let lContour = curSubtree;
  let lSumMods = curSubtree.relX;
  let isFirst = true;

  while (rContour && lContour) {
    if (rContour.bottom > lows.lowY) lows = lows.next; // How far to the left of the right side of rContour is the left side
    // of lContour? First compute the center-to-center distance, then add
    // the "spacing"

    const dist = rSumMods + rContour.prelim - (lSumMods + lContour.prelim) + rContour.xSize / 2 + lContour.xSize / 2 + rContour.spacing(lContour);

    if (dist > 0 || dist < 0 && isFirst) {
      lSumMods += dist; // Move subtree by changing relX.

      moveSubtree(curSubtree, dist);
      distributeExtra(w, i, lows.index, dist);
    }

    isFirst = false; // Advance highest node(s) and sum(s) of modifiers

    const rightBottom = rContour.bottom;
    const leftBottom = lContour.bottom;

    if (rightBottom <= leftBottom) {
      rContour = nextRContour(rContour);
      if (rContour) rSumMods += rContour.relX;
    }

    if (rightBottom >= leftBottom) {
      lContour = nextLContour(lContour);
      if (lContour) lSumMods += lContour.relX;
    }
  } // Set threads and update extreme nodes. In the first case, the
  // current subtree is taller than the left siblings.


  if (!rContour && lContour) setLThr(w, i, lContour, lSumMods); // In the next case, the left siblings are taller than the current subtree
  else if (rContour && !lContour) setRThr(w, i, rContour, rSumMods);
};
/* eslint-enable complexity */
// Move subtree by changing relX.


const moveSubtree = (subtree, distance) => {
  subtree.relX += distance;
  subtree.lExtRelX += distance;
  subtree.rExtRelX += distance;
};

const distributeExtra = (w, curSubtreeI, leftSibI, dist) => {
  const curSubtree = w.children[curSubtreeI];
  const n = curSubtreeI - leftSibI; // Are there intermediate children?

  if (n > 1) {
    const delta = dist / n;
    w.children[leftSibI + 1].shift += delta;
    curSubtree.shift -= delta;
    curSubtree.change -= dist - delta;
  }
};

const nextLContour = w => {
  return w.hasChildren ? w.firstChild : w.lThr;
};

const nextRContour = w => {
  return w.hasChildren ? w.lastChild : w.rThr;
};

const setLThr = (w, i, lContour, lSumMods) => {
  const firstChild = w.firstChild;
  const lExt = firstChild.lExt;
  const curSubtree = w.children[i];
  lExt.lThr = lContour; // Change relX so that the sum of modifier after following thread is correct.

  const diff = lSumMods - lContour.relX - firstChild.lExtRelX;
  lExt.relX += diff; // Change preliminary x coordinate so that the node does not move.

  lExt.prelim -= diff; // Update extreme node and its sum of modifiers.

  firstChild.lExt = curSubtree.lExt;
  firstChild.lExtRelX = curSubtree.lExtRelX;
}; // Mirror image of setLThr.


const setRThr = (w, i, rContour, rSumMods) => {
  const curSubtree = w.children[i];
  const rExt = curSubtree.rExt;
  const lSib = w.children[i - 1];
  rExt.rThr = rContour;
  const diff = rSumMods - rContour.relX - curSubtree.rExtRelX;
  rExt.relX += diff;
  rExt.prelim -= diff;
  curSubtree.rExt = lSib.rExt;
  curSubtree.rExtRelX = lSib.rExtRelX;
}; // Position root between children, taking into account their modifiers


const positionRoot = w => {
  if (w.hasChildren) {
    const k0 = w.firstChild;
    const kf = w.lastChild;
    const prelim = (k0.prelim + k0.relX - k0.xSize / 2 + kf.relX + kf.prelim + kf.xSize / 2) / 2;
    Object.assign(w, {
      prelim,
      lExt: k0.lExt,
      lExtRelX: k0.lExtRelX,
      rExt: kf.rExt,
      rExtRelX: kf.rExtRelX
    });
  }
}; // Make/maintain a linked list of the indexes of left siblings and their
// lowest vertical coordinate.


const updateLows = (lowY, index, lastLows) => {
  // Remove siblings that are hidden by the new subtree.
  while (lastLows !== null && lowY >= lastLows.lowY) lastLows = lastLows.next; // Prepend the new subtree.


  return {
    lowY,
    index,
    next: lastLows
  };
};

},{"../package.json":106,"d3-hierarchy":210}],108:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x, y) {
  var nodes;
  if (x == null) x = 0;
  if (y == null) y = 0;

  function force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x, sy += node.y;
    }

    for (sx = sx / n - x, sy = sy / n - y, i = 0; i < n; ++i) {
      node = nodes[i], node.x -= sx, node.y -= sy;
    }
  }

  force.initialize = function (_) {
    nodes = _;
  };

  force.x = function (_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function (_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}

},{}],109:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

var _jiggle = _interopRequireDefault(require("./jiggle"));

var _d3Quadtree = require("d3-quadtree");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function x(d) {
  return d.x + d.vx;
}

function y(d) {
  return d.y + d.vy;
}

function _default(radius) {
  var nodes,
      radii,
      strength = 1,
      iterations = 1;
  if (typeof radius !== "function") radius = (0, _constant.default)(radius == null ? 1 : +radius);

  function force() {
    var i,
        n = nodes.length,
        tree,
        node,
        xi,
        yi,
        ri,
        ri2;

    for (var k = 0; k < iterations; ++k) {
      tree = (0, _d3Quadtree.quadtree)(nodes, x, y).visitAfter(prepare);

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        ri = radii[node.index], ri2 = ri * ri;
        xi = node.x + node.vx;
        yi = node.y + node.vy;
        tree.visit(apply);
      }
    }

    function apply(quad, x0, y0, x1, y1) {
      var data = quad.data,
          rj = quad.r,
          r = ri + rj;

      if (data) {
        if (data.index > node.index) {
          var x = xi - data.x - data.vx,
              y = yi - data.y - data.vy,
              l = x * x + y * y;

          if (l < r * r) {
            if (x === 0) x = (0, _jiggle.default)(), l += x * x;
            if (y === 0) y = (0, _jiggle.default)(), l += y * y;
            l = (r - (l = Math.sqrt(l))) / l * strength;
            node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
            node.vy += (y *= l) * r;
            data.vx -= x * (r = 1 - r);
            data.vy -= y * r;
          }
        }

        return;
      }

      return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r;
    }
  }

  function prepare(quad) {
    if (quad.data) return quad.r = radii[quad.data.index];

    for (var i = quad.r = 0; i < 4; ++i) {
      if (quad[i] && quad[i].r > quad.r) {
        quad.r = quad[i].r;
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length,
        node;
    radii = new Array(n);

    for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.iterations = function (_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function (_) {
    return arguments.length ? (strength = +_, force) : strength;
  };

  force.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : radius;
  };

  return force;
}

},{"./constant":110,"./jiggle":112,"d3-quadtree":265}],110:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],111:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "forceCenter", {
  enumerable: true,
  get: function () {
    return _center.default;
  }
});
Object.defineProperty(exports, "forceCollide", {
  enumerable: true,
  get: function () {
    return _collide.default;
  }
});
Object.defineProperty(exports, "forceLink", {
  enumerable: true,
  get: function () {
    return _link.default;
  }
});
Object.defineProperty(exports, "forceManyBody", {
  enumerable: true,
  get: function () {
    return _manyBody.default;
  }
});
Object.defineProperty(exports, "forceRadial", {
  enumerable: true,
  get: function () {
    return _radial.default;
  }
});
Object.defineProperty(exports, "forceSimulation", {
  enumerable: true,
  get: function () {
    return _simulation.default;
  }
});
Object.defineProperty(exports, "forceX", {
  enumerable: true,
  get: function () {
    return _x.default;
  }
});
Object.defineProperty(exports, "forceY", {
  enumerable: true,
  get: function () {
    return _y.default;
  }
});

var _center = _interopRequireDefault(require("./center"));

var _collide = _interopRequireDefault(require("./collide"));

var _link = _interopRequireDefault(require("./link"));

var _manyBody = _interopRequireDefault(require("./manyBody"));

var _radial = _interopRequireDefault(require("./radial"));

var _simulation = _interopRequireDefault(require("./simulation"));

var _x = _interopRequireDefault(require("./x"));

var _y = _interopRequireDefault(require("./y"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./center":108,"./collide":109,"./link":113,"./manyBody":114,"./radial":115,"./simulation":116,"./x":117,"./y":118}],112:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return (Math.random() - 0.5) * 1e-6;
}

},{}],113:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

var _jiggle = _interopRequireDefault(require("./jiggle"));

var _d3Collection = require("d3-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function index(d) {
  return d.index;
}

function find(nodeById, nodeId) {
  var node = nodeById.get(nodeId);
  if (!node) throw new Error("missing: " + nodeId);
  return node;
}

function _default(links) {
  var id = index,
      strength = defaultStrength,
      strengths,
      distance = (0, _constant.default)(30),
      distances,
      nodes,
      count,
      bias,
      iterations = 1;
  if (links == null) links = [];

  function defaultStrength(link) {
    return 1 / Math.min(count[link.source.index], count[link.target.index]);
  }

  function force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x, y, l, b; i < n; ++i) {
        link = links[i], source = link.source, target = link.target;
        x = target.x + target.vx - source.x - source.vx || (0, _jiggle.default)();
        y = target.y + target.vy - source.y - source.vy || (0, _jiggle.default)();
        l = Math.sqrt(x * x + y * y);
        l = (l - distances[i]) / l * alpha * strengths[i];
        x *= l, y *= l;
        target.vx -= x * (b = bias[i]);
        target.vy -= y * b;
        source.vx += x * (b = 1 - b);
        source.vy += y * b;
      }
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length,
        m = links.length,
        nodeById = (0, _d3Collection.map)(nodes, id),
        link;

    for (i = 0, count = new Array(n); i < m; ++i) {
      link = links[i], link.index = i;
      if (typeof link.source !== "object") link.source = find(nodeById, link.source);
      if (typeof link.target !== "object") link.target = find(nodeById, link.target);
      count[link.source.index] = (count[link.source.index] || 0) + 1;
      count[link.target.index] = (count[link.target.index] || 0) + 1;
    }

    for (i = 0, bias = new Array(m); i < m; ++i) {
      link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
    }

    strengths = new Array(m), initializeStrength();
    distances = new Array(m), initializeDistance();
  }

  function initializeStrength() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      strengths[i] = +strength(links[i], i, links);
    }
  }

  function initializeDistance() {
    if (!nodes) return;

    for (var i = 0, n = links.length; i < n; ++i) {
      distances[i] = +distance(links[i], i, links);
    }
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.links = function (_) {
    return arguments.length ? (links = _, initialize(), force) : links;
  };

  force.id = function (_) {
    return arguments.length ? (id = _, force) : id;
  };

  force.iterations = function (_) {
    return arguments.length ? (iterations = +_, force) : iterations;
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : (0, _constant.default)(+_), initializeStrength(), force) : strength;
  };

  force.distance = function (_) {
    return arguments.length ? (distance = typeof _ === "function" ? _ : (0, _constant.default)(+_), initializeDistance(), force) : distance;
  };

  return force;
}

},{"./constant":110,"./jiggle":112,"d3-collection":51}],114:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

var _jiggle = _interopRequireDefault(require("./jiggle"));

var _d3Quadtree = require("d3-quadtree");

var _simulation = require("./simulation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var nodes,
      node,
      alpha,
      strength = (0, _constant.default)(-30),
      strengths,
      distanceMin2 = 1,
      distanceMax2 = Infinity,
      theta2 = 0.81;

  function force(_) {
    var i,
        n = nodes.length,
        tree = (0, _d3Quadtree.quadtree)(nodes, _simulation.x, _simulation.y).visitAfter(accumulate);

    for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length,
        node;
    strengths = new Array(n);

    for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
  }

  function accumulate(quad) {
    var strength = 0,
        q,
        c,
        weight = 0,
        x,
        y,
        i; // For internal nodes, accumulate forces from child quadrants.

    if (quad.length) {
      for (x = y = i = 0; i < 4; ++i) {
        if ((q = quad[i]) && (c = Math.abs(q.value))) {
          strength += q.value, weight += c, x += c * q.x, y += c * q.y;
        }
      }

      quad.x = x / weight;
      quad.y = y / weight;
    } // For leaf nodes, accumulate forces from coincident quadrants.
    else {
        q = quad;
        q.x = q.data.x;
        q.y = q.data.y;

        do strength += strengths[q.data.index]; while (q = q.next);
      }

    quad.value = strength;
  }

  function apply(quad, x1, _, x2) {
    if (!quad.value) return true;
    var x = quad.x - node.x,
        y = quad.y - node.y,
        w = x2 - x1,
        l = x * x + y * y; // Apply the Barnes-Hut approximation if possible.
    // Limit forces for very close nodes; randomize direction if coincident.

    if (w * w / theta2 < l) {
      if (l < distanceMax2) {
        if (x === 0) x = (0, _jiggle.default)(), l += x * x;
        if (y === 0) y = (0, _jiggle.default)(), l += y * y;
        if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        node.vx += x * quad.value * alpha / l;
        node.vy += y * quad.value * alpha / l;
      }

      return true;
    } // Otherwise, process points directly.
    else if (quad.length || l >= distanceMax2) return; // Limit forces for very close nodes; randomize direction if coincident.


    if (quad.data !== node || quad.next) {
      if (x === 0) x = (0, _jiggle.default)(), l += x * x;
      if (y === 0) y = (0, _jiggle.default)(), l += y * y;
      if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
    }

    do if (quad.data !== node) {
      w = strengths[quad.data.index] * alpha / l;
      node.vx += x * w;
      node.vy += y * w;
    } while (quad = quad.next);
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : strength;
  };

  force.distanceMin = function (_) {
    return arguments.length ? (distanceMin2 = _ * _, force) : Math.sqrt(distanceMin2);
  };

  force.distanceMax = function (_) {
    return arguments.length ? (distanceMax2 = _ * _, force) : Math.sqrt(distanceMax2);
  };

  force.theta = function (_) {
    return arguments.length ? (theta2 = _ * _, force) : Math.sqrt(theta2);
  };

  return force;
}

},{"./constant":110,"./jiggle":112,"./simulation":116,"d3-quadtree":265}],115:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(radius, x, y) {
  var nodes,
      strength = (0, _constant.default)(0.1),
      strengths,
      radiuses;
  if (typeof radius !== "function") radius = (0, _constant.default)(+radius);
  if (x == null) x = 0;
  if (y == null) y = 0;

  function force(alpha) {
    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i],
          dx = node.x - x || 1e-6,
          dy = node.y - y || 1e-6,
          r = Math.sqrt(dx * dx + dy * dy),
          k = (radiuses[i] - r) * strengths[i] * alpha / r;
      node.vx += dx * k;
      node.vy += dy * k;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length;
    strengths = new Array(n);
    radiuses = new Array(n);

    for (i = 0; i < n; ++i) {
      radiuses[i] = +radius(nodes[i], i, nodes);
      strengths[i] = isNaN(radiuses[i]) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _, initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : strength;
  };

  force.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : radius;
  };

  force.x = function (_) {
    return arguments.length ? (x = +_, force) : x;
  };

  force.y = function (_) {
    return arguments.length ? (y = +_, force) : y;
  };

  return force;
}

},{"./constant":110}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = x;
exports.y = y;
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Collection = require("d3-collection");

var _d3Timer = require("d3-timer");

function x(d) {
  return d.x;
}

function y(d) {
  return d.y;
}

var initialRadius = 10,
    initialAngle = Math.PI * (3 - Math.sqrt(5));

function _default(nodes) {
  var simulation,
      alpha = 1,
      alphaMin = 0.001,
      alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
      alphaTarget = 0,
      velocityDecay = 0.6,
      forces = (0, _d3Collection.map)(),
      stepper = (0, _d3Timer.timer)(step),
      event = (0, _d3Dispatch.dispatch)("tick", "end");
  if (nodes == null) nodes = [];

  function step() {
    tick();
    event.call("tick", simulation);

    if (alpha < alphaMin) {
      stepper.stop();
      event.call("end", simulation);
    }
  }

  function tick(iterations) {
    var i,
        n = nodes.length,
        node;
    if (iterations === undefined) iterations = 1;

    for (var k = 0; k < iterations; ++k) {
      alpha += (alphaTarget - alpha) * alphaDecay;
      forces.each(function (force) {
        force(alpha);
      });

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        if (node.fx == null) node.x += node.vx *= velocityDecay;else node.x = node.fx, node.vx = 0;
        if (node.fy == null) node.y += node.vy *= velocityDecay;else node.y = node.fy, node.vy = 0;
      }
    }

    return simulation;
  }

  function initializeNodes() {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.index = i;
      if (node.fx != null) node.x = node.fx;
      if (node.fy != null) node.y = node.fy;

      if (isNaN(node.x) || isNaN(node.y)) {
        var radius = initialRadius * Math.sqrt(i),
            angle = i * initialAngle;
        node.x = radius * Math.cos(angle);
        node.y = radius * Math.sin(angle);
      }

      if (isNaN(node.vx) || isNaN(node.vy)) {
        node.vx = node.vy = 0;
      }
    }
  }

  function initializeForce(force) {
    if (force.initialize) force.initialize(nodes);
    return force;
  }

  initializeNodes();
  return simulation = {
    tick: tick,
    restart: function () {
      return stepper.restart(step), simulation;
    },
    stop: function () {
      return stepper.stop(), simulation;
    },
    nodes: function (_) {
      return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
    },
    alpha: function (_) {
      return arguments.length ? (alpha = +_, simulation) : alpha;
    },
    alphaMin: function (_) {
      return arguments.length ? (alphaMin = +_, simulation) : alphaMin;
    },
    alphaDecay: function (_) {
      return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
    },
    alphaTarget: function (_) {
      return arguments.length ? (alphaTarget = +_, simulation) : alphaTarget;
    },
    velocityDecay: function (_) {
      return arguments.length ? (velocityDecay = 1 - _, simulation) : 1 - velocityDecay;
    },
    force: function (name, _) {
      return arguments.length > 1 ? (_ == null ? forces.remove(name) : forces.set(name, initializeForce(_)), simulation) : forces.get(name);
    },
    find: function (x, y, radius) {
      var i = 0,
          n = nodes.length,
          dx,
          dy,
          d2,
          node,
          closest;
      if (radius == null) radius = Infinity;else radius *= radius;

      for (i = 0; i < n; ++i) {
        node = nodes[i];
        dx = x - node.x;
        dy = y - node.y;
        d2 = dx * dx + dy * dy;
        if (d2 < radius) closest = node, radius = d2;
      }

      return closest;
    },
    on: function (name, _) {
      return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
    }
  };
}

},{"d3-collection":51,"d3-dispatch":74,"d3-timer":477}],117:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x) {
  var strength = (0, _constant.default)(0.1),
      nodes,
      strengths,
      xz;
  if (typeof x !== "function") x = (0, _constant.default)(x == null ? 0 : +x);

  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length;
    strengths = new Array(n);
    xz = new Array(n);

    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : strength;
  };

  force.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : x;
  };

  return force;
}

},{"./constant":110}],118:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(y) {
  var strength = (0, _constant.default)(0.1),
      nodes,
      strengths,
      yz;
  if (typeof y !== "function") y = (0, _constant.default)(y == null ? 0 : +y);

  function force(alpha) {
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
    }
  }

  function initialize() {
    if (!nodes) return;
    var i,
        n = nodes.length;
    strengths = new Array(n);
    yz = new Array(n);

    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
    }
  }

  force.initialize = function (_) {
    nodes = _;
    initialize();
  };

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : strength;
  };

  force.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), initialize(), force) : y;
  };

  return force;
}

},{"./constant":110}],119:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.formatPrefix = exports.format = void 0;

var _locale = _interopRequireDefault(require("./locale.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var format;
exports.format = format;
var formatPrefix;
exports.formatPrefix = formatPrefix;
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.format = format = locale.format;
  exports.formatPrefix = formatPrefix = locale.formatPrefix;
  return locale;
}

},{"./locale.js":131}],120:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x) {
  return x = (0, _formatDecimal.default)(Math.abs(x)), x ? x[1] : NaN;
}

},{"./formatDecimal.js":121}],121:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Computes the decimal coefficient and exponent of the specified number x with
// significant digits p, where x is positive and p is in [1, 21] or undefined.
// For example, formatDecimal(1.23) returns ["123", 0].
function _default(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity

  var i,
      coefficient = x.slice(0, i); // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).

  return [coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient, +x.slice(i + 1)];
}

},{}],122:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(grouping, thousands) {
  return function (value, width) {
    var i = value.length,
        t = [],
        j = 0,
        g = grouping[0],
        length = 0;

    while (i > 0 && g > 0) {
      if (length + g + 1 > width) g = Math.max(1, width - length);
      t.push(value.substring(i -= g, i + g));
      if ((length += g + 1) > width) break;
      g = grouping[j = (j + 1) % grouping.length];
    }

    return t.reverse().join(thousands);
  };
}

},{}],123:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(numerals) {
  return function (value) {
    return value.replace(/[0-9]/g, function (i) {
      return numerals[+i];
    });
  };
}

},{}],124:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.prefixExponent = void 0;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixExponent;
exports.prefixExponent = prefixExponent;

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1],
      i = exponent - (exports.prefixExponent = prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
      n = coefficient.length;
  return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + (0, _formatDecimal.default)(x, Math.max(0, p + i - 1))[0]; // less than 1y!
}

},{"./formatDecimal.js":121}],125:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _formatDecimal = _interopRequireDefault(require("./formatDecimal.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x, p) {
  var d = (0, _formatDecimal.default)(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

},{"./formatDecimal.js":121}],126:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatSpecifier;
exports.FormatSpecifier = FormatSpecifier;
// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}

formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

function FormatSpecifier(specifier) {
  this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
  this.align = specifier.align === undefined ? ">" : specifier.align + "";
  this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === undefined ? undefined : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === undefined ? "" : specifier.type + "";
}

FormatSpecifier.prototype.toString = function () {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === undefined ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

},{}],127:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
function _default(s) {
  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (s[i]) {
      case ".":
        i0 = i1 = i;
        break;

      case "0":
        if (i0 === 0) i0 = i;
        i1 = i;
        break;

      default:
        if (!+s[i]) break out;
        if (i0 > 0) i0 = 0;
        break;
    }
  }

  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
}

},{}],128:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatPrefixAuto = _interopRequireDefault(require("./formatPrefixAuto.js"));

var _formatRounded = _interopRequireDefault(require("./formatRounded.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  "%": function (x, p) {
    return (x * 100).toFixed(p);
  },
  "b": function (x) {
    return Math.round(x).toString(2);
  },
  "c": function (x) {
    return x + "";
  },
  "d": function (x) {
    return Math.round(x).toString(10);
  },
  "e": function (x, p) {
    return x.toExponential(p);
  },
  "f": function (x, p) {
    return x.toFixed(p);
  },
  "g": function (x, p) {
    return x.toPrecision(p);
  },
  "o": function (x) {
    return Math.round(x).toString(8);
  },
  "p": function (x, p) {
    return (0, _formatRounded.default)(x * 100, p);
  },
  "r": _formatRounded.default,
  "s": _formatPrefixAuto.default,
  "X": function (x) {
    return Math.round(x).toString(16).toUpperCase();
  },
  "x": function (x) {
    return Math.round(x).toString(16);
  }
};
exports.default = _default;

},{"./formatPrefixAuto.js":124,"./formatRounded.js":125}],129:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],130:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "formatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function () {
    return _defaultLocale.format;
  }
});
Object.defineProperty(exports, "formatPrefix", {
  enumerable: true,
  get: function () {
    return _defaultLocale.formatPrefix;
  }
});
Object.defineProperty(exports, "formatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "formatSpecifier", {
  enumerable: true,
  get: function () {
    return _formatSpecifier.default;
  }
});
Object.defineProperty(exports, "FormatSpecifier", {
  enumerable: true,
  get: function () {
    return _formatSpecifier.FormatSpecifier;
  }
});
Object.defineProperty(exports, "precisionFixed", {
  enumerable: true,
  get: function () {
    return _precisionFixed.default;
  }
});
Object.defineProperty(exports, "precisionPrefix", {
  enumerable: true,
  get: function () {
    return _precisionPrefix.default;
  }
});
Object.defineProperty(exports, "precisionRound", {
  enumerable: true,
  get: function () {
    return _precisionRound.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale.js"));

var _locale = _interopRequireDefault(require("./locale.js"));

var _formatSpecifier = _interopRequireWildcard(require("./formatSpecifier.js"));

var _precisionFixed = _interopRequireDefault(require("./precisionFixed.js"));

var _precisionPrefix = _interopRequireDefault(require("./precisionPrefix.js"));

var _precisionRound = _interopRequireDefault(require("./precisionRound.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./defaultLocale.js":119,"./formatSpecifier.js":126,"./locale.js":131,"./precisionFixed.js":132,"./precisionPrefix.js":133,"./precisionRound.js":134}],131:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

var _formatGroup = _interopRequireDefault(require("./formatGroup.js"));

var _formatNumerals = _interopRequireDefault(require("./formatNumerals.js"));

var _formatSpecifier = _interopRequireDefault(require("./formatSpecifier.js"));

var _formatTrim = _interopRequireDefault(require("./formatTrim.js"));

var _formatTypes = _interopRequireDefault(require("./formatTypes.js"));

var _formatPrefixAuto = require("./formatPrefixAuto.js");

var _identity = _interopRequireDefault(require("./identity.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var map = Array.prototype.map,
    prefixes = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];

function _default(locale) {
  var group = locale.grouping === undefined || locale.thousands === undefined ? _identity.default : (0, _formatGroup.default)(map.call(locale.grouping, Number), locale.thousands + ""),
      currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
      currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
      decimal = locale.decimal === undefined ? "." : locale.decimal + "",
      numerals = locale.numerals === undefined ? _identity.default : (0, _formatNumerals.default)(map.call(locale.numerals, String)),
      percent = locale.percent === undefined ? "%" : locale.percent + "",
      minus = locale.minus === undefined ? "-" : locale.minus + "",
      nan = locale.nan === undefined ? "NaN" : locale.nan + "";

  function newFormat(specifier) {
    specifier = (0, _formatSpecifier.default)(specifier);
    var fill = specifier.fill,
        align = specifier.align,
        sign = specifier.sign,
        symbol = specifier.symbol,
        zero = specifier.zero,
        width = specifier.width,
        comma = specifier.comma,
        precision = specifier.precision,
        trim = specifier.trim,
        type = specifier.type; // The "n" type is an alias for ",g".

    if (type === "n") comma = true, type = "g"; // The "" type, and any invalid type, is an alias for ".12~g".
    else if (!_formatTypes.default[type]) precision === undefined && (precision = 12), trim = true, type = "g"; // If zero fill is specified, padding goes after sign and before digits.

    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "="; // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.

    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : ""; // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?

    var formatType = _formatTypes.default[type],
        maybeSuffix = /[defgprs%]/.test(type); // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].

    precision = precision === undefined ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));

    function format(value) {
      var valuePrefix = prefix,
          valueSuffix = suffix,
          i,
          n,
          c;

      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value; // Determine the sign. -0 is not less than 0, but 1 / -0 is!

        var valueNegative = value < 0 || 1 / value < 0; // Perform the initial formatting.

        value = isNaN(value) ? nan : formatType(Math.abs(value), precision); // Trim insignificant zeros.

        if (trim) value = (0, _formatTrim.default)(value); // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.

        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false; // Compute the prefix and suffix.

        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes[8 + _formatPrefixAuto.prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : ""); // Break the formatted value into the integer “value” part that can be
        // grouped, and fractional or exponential “suffix” part that is not.

        if (maybeSuffix) {
          i = -1, n = value.length;

          while (++i < n) {
            if (c = value.charCodeAt(i), 48 > c || c > 57) {
              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
              value = value.slice(0, i);
              break;
            }
          }
        }
      } // If the fill character is not "0", grouping is applied before padding.


      if (comma && !zero) value = group(value, Infinity); // Compute the padding.

      var length = valuePrefix.length + value.length + valueSuffix.length,
          padding = length < width ? new Array(width - length + 1).join(fill) : ""; // If the fill character is "0", grouping is applied after padding.

      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = ""; // Reconstruct the final output based on the desired alignment.

      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;

        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;

        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;

        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }

      return numerals(value);
    }

    format.toString = function () {
      return specifier + "";
    };

    return format;
  }

  function formatPrefix(specifier, value) {
    var f = newFormat((specifier = (0, _formatSpecifier.default)(specifier), specifier.type = "f", specifier)),
        e = Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3,
        k = Math.pow(10, -e),
        prefix = prefixes[8 + e / 3];
    return function (value) {
      return f(k * value) + prefix;
    };
  }

  return {
    format: newFormat,
    formatPrefix: formatPrefix
  };
}

},{"./exponent.js":120,"./formatGroup.js":122,"./formatNumerals.js":123,"./formatPrefixAuto.js":124,"./formatSpecifier.js":126,"./formatTrim.js":127,"./formatTypes.js":128,"./identity.js":129}],132:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step) {
  return Math.max(0, -(0, _exponent.default)(Math.abs(step)));
}

},{"./exponent.js":120}],133:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor((0, _exponent.default)(value) / 3))) * 3 - (0, _exponent.default)(Math.abs(step)));
}

},{"./exponent.js":120}],134:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _exponent = _interopRequireDefault(require("./exponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, (0, _exponent.default)(max) - (0, _exponent.default)(step)) + 1;
}

},{"./exponent.js":120}],135:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/
function _default() {
  return new Adder();
}

function Adder() {
  this.reset();
}

Adder.prototype = {
  constructor: Adder,
  reset: function () {
    this.s = // rounded value
    this.t = 0; // exact error
  },
  add: function (y) {
    add(temp, y, this.t);
    add(this, temp.s, this.s);
    if (this.s) this.t += temp.t;else this.s = temp.t;
  },
  valueOf: function () {
    return this.s;
  }
};
var temp = new Adder();

function add(adder, a, b) {
  var x = adder.s = a + b,
      bv = x - a,
      av = x - bv;
  adder.t = a - av + (b - bv);
}

},{}],136:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.areaStream = exports.areaRingSum = void 0;

var _adder = _interopRequireDefault(require("./adder.js"));

var _math = require("./math.js");

var _noop = _interopRequireDefault(require("./noop.js"));

var _stream = _interopRequireDefault(require("./stream.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var areaRingSum = (0, _adder.default)();
exports.areaRingSum = areaRingSum;
var areaSum = (0, _adder.default)(),
    lambda00,
    phi00,
    lambda0,
    cosPhi0,
    sinPhi0;
var areaStream = {
  point: _noop.default,
  lineStart: _noop.default,
  lineEnd: _noop.default,
  polygonStart: function () {
    areaRingSum.reset();
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function () {
    var areaRing = +areaRingSum;
    areaSum.add(areaRing < 0 ? _math.tau + areaRing : areaRing);
    this.lineStart = this.lineEnd = this.point = _noop.default;
  },
  sphere: function () {
    areaSum.add(_math.tau);
  }
};
exports.areaStream = areaStream;

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaRingEnd() {
  areaPoint(lambda00, phi00);
}

function areaPointFirst(lambda, phi) {
  areaStream.point = areaPoint;
  lambda00 = lambda, phi00 = phi;
  lambda *= _math.radians, phi *= _math.radians;
  lambda0 = lambda, cosPhi0 = (0, _math.cos)(phi = phi / 2 + _math.quarterPi), sinPhi0 = (0, _math.sin)(phi);
}

function areaPoint(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  phi = phi / 2 + _math.quarterPi; // half the angular distance from south pole
  // Spherical excess E for a spherical triangle with vertices: south pole,
  // previous point, current point.  Uses a formula derived from Cagnoli’s
  // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).

  var dLambda = lambda - lambda0,
      sdLambda = dLambda >= 0 ? 1 : -1,
      adLambda = sdLambda * dLambda,
      cosPhi = (0, _math.cos)(phi),
      sinPhi = (0, _math.sin)(phi),
      k = sinPhi0 * sinPhi,
      u = cosPhi0 * cosPhi + k * (0, _math.cos)(adLambda),
      v = k * sdLambda * (0, _math.sin)(adLambda);
  areaRingSum.add((0, _math.atan2)(v, u)); // Advance the previous points.

  lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
}

function _default(object) {
  areaSum.reset();
  (0, _stream.default)(object, areaStream);
  return areaSum * 2;
}

},{"./adder.js":135,"./math.js":158,"./noop.js":159,"./stream.js":192}],137:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _adder = _interopRequireDefault(require("./adder.js"));

var _area = require("./area.js");

var _cartesian = require("./cartesian.js");

var _math = require("./math.js");

var _stream = _interopRequireDefault(require("./stream.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lambda0,
    phi0,
    lambda1,
    phi1,
    // bounds
lambda2,
    // previous lambda-coordinate
lambda00,
    phi00,
    // first point
p0,
    // previous 3D point
deltaSum = (0, _adder.default)(),
    ranges,
    range;
var boundsStream = {
  point: boundsPoint,
  lineStart: boundsLineStart,
  lineEnd: boundsLineEnd,
  polygonStart: function () {
    boundsStream.point = boundsRingPoint;
    boundsStream.lineStart = boundsRingStart;
    boundsStream.lineEnd = boundsRingEnd;
    deltaSum.reset();

    _area.areaStream.polygonStart();
  },
  polygonEnd: function () {
    _area.areaStream.polygonEnd();

    boundsStream.point = boundsPoint;
    boundsStream.lineStart = boundsLineStart;
    boundsStream.lineEnd = boundsLineEnd;
    if (_area.areaRingSum < 0) lambda0 = -(lambda1 = 180), phi0 = -(phi1 = 90);else if (deltaSum > _math.epsilon) phi1 = 90;else if (deltaSum < -_math.epsilon) phi0 = -90;
    range[0] = lambda0, range[1] = lambda1;
  },
  sphere: function () {
    lambda0 = -(lambda1 = 180), phi0 = -(phi1 = 90);
  }
};

function boundsPoint(lambda, phi) {
  ranges.push(range = [lambda0 = lambda, lambda1 = lambda]);
  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
}

function linePoint(lambda, phi) {
  var p = (0, _cartesian.cartesian)([lambda * _math.radians, phi * _math.radians]);

  if (p0) {
    var normal = (0, _cartesian.cartesianCross)(p0, p),
        equatorial = [normal[1], -normal[0], 0],
        inflection = (0, _cartesian.cartesianCross)(equatorial, normal);
    (0, _cartesian.cartesianNormalizeInPlace)(inflection);
    inflection = (0, _cartesian.spherical)(inflection);
    var delta = lambda - lambda2,
        sign = delta > 0 ? 1 : -1,
        lambdai = inflection[0] * _math.degrees * sign,
        phii,
        antimeridian = (0, _math.abs)(delta) > 180;

    if (antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = inflection[1] * _math.degrees;
      if (phii > phi1) phi1 = phii;
    } else if (lambdai = (lambdai + 360) % 360 - 180, antimeridian ^ (sign * lambda2 < lambdai && lambdai < sign * lambda)) {
      phii = -inflection[1] * _math.degrees;
      if (phii < phi0) phi0 = phii;
    } else {
      if (phi < phi0) phi0 = phi;
      if (phi > phi1) phi1 = phi;
    }

    if (antimeridian) {
      if (lambda < lambda2) {
        if (angle(lambda0, lambda) > angle(lambda0, lambda1)) lambda1 = lambda;
      } else {
        if (angle(lambda, lambda1) > angle(lambda0, lambda1)) lambda0 = lambda;
      }
    } else {
      if (lambda1 >= lambda0) {
        if (lambda < lambda0) lambda0 = lambda;
        if (lambda > lambda1) lambda1 = lambda;
      } else {
        if (lambda > lambda2) {
          if (angle(lambda0, lambda) > angle(lambda0, lambda1)) lambda1 = lambda;
        } else {
          if (angle(lambda, lambda1) > angle(lambda0, lambda1)) lambda0 = lambda;
        }
      }
    }
  } else {
    ranges.push(range = [lambda0 = lambda, lambda1 = lambda]);
  }

  if (phi < phi0) phi0 = phi;
  if (phi > phi1) phi1 = phi;
  p0 = p, lambda2 = lambda;
}

function boundsLineStart() {
  boundsStream.point = linePoint;
}

function boundsLineEnd() {
  range[0] = lambda0, range[1] = lambda1;
  boundsStream.point = boundsPoint;
  p0 = null;
}

function boundsRingPoint(lambda, phi) {
  if (p0) {
    var delta = lambda - lambda2;
    deltaSum.add((0, _math.abs)(delta) > 180 ? delta + (delta > 0 ? 360 : -360) : delta);
  } else {
    lambda00 = lambda, phi00 = phi;
  }

  _area.areaStream.point(lambda, phi);

  linePoint(lambda, phi);
}

function boundsRingStart() {
  _area.areaStream.lineStart();
}

function boundsRingEnd() {
  boundsRingPoint(lambda00, phi00);

  _area.areaStream.lineEnd();

  if ((0, _math.abs)(deltaSum) > _math.epsilon) lambda0 = -(lambda1 = 180);
  range[0] = lambda0, range[1] = lambda1;
  p0 = null;
} // Finds the left-right distance between two longitudes.
// This is almost the same as (lambda1 - lambda0 + 360°) % 360°, except that we want
// the distance between ±180° to be 360°.


function angle(lambda0, lambda1) {
  return (lambda1 -= lambda0) < 0 ? lambda1 + 360 : lambda1;
}

function rangeCompare(a, b) {
  return a[0] - b[0];
}

function rangeContains(range, x) {
  return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
}

function _default(feature) {
  var i, n, a, b, merged, deltaMax, delta;
  phi1 = lambda1 = -(lambda0 = phi0 = Infinity);
  ranges = [];
  (0, _stream.default)(feature, boundsStream); // First, sort ranges by their minimum longitudes.

  if (n = ranges.length) {
    ranges.sort(rangeCompare); // Then, merge any ranges that overlap.

    for (i = 1, a = ranges[0], merged = [a]; i < n; ++i) {
      b = ranges[i];

      if (rangeContains(a, b[0]) || rangeContains(a, b[1])) {
        if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
        if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
      } else {
        merged.push(a = b);
      }
    } // Finally, find the largest gap between the merged ranges.
    // The final bounding box will be the inverse of this gap.


    for (deltaMax = -Infinity, n = merged.length - 1, i = 0, a = merged[n]; i <= n; a = b, ++i) {
      b = merged[i];
      if ((delta = angle(a[1], b[0])) > deltaMax) deltaMax = delta, lambda0 = b[0], lambda1 = a[1];
    }
  }

  ranges = range = null;
  return lambda0 === Infinity || phi0 === Infinity ? [[NaN, NaN], [NaN, NaN]] : [[lambda0, phi0], [lambda1, phi1]];
}

},{"./adder.js":135,"./area.js":136,"./cartesian.js":138,"./math.js":158,"./stream.js":192}],138:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spherical = spherical;
exports.cartesian = cartesian;
exports.cartesianDot = cartesianDot;
exports.cartesianCross = cartesianCross;
exports.cartesianAddInPlace = cartesianAddInPlace;
exports.cartesianScale = cartesianScale;
exports.cartesianNormalizeInPlace = cartesianNormalizeInPlace;

var _math = require("./math.js");

function spherical(cartesian) {
  return [(0, _math.atan2)(cartesian[1], cartesian[0]), (0, _math.asin)(cartesian[2])];
}

function cartesian(spherical) {
  var lambda = spherical[0],
      phi = spherical[1],
      cosPhi = (0, _math.cos)(phi);
  return [cosPhi * (0, _math.cos)(lambda), cosPhi * (0, _math.sin)(lambda), (0, _math.sin)(phi)];
}

function cartesianDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cartesianCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
} // TODO return a


function cartesianAddInPlace(a, b) {
  a[0] += b[0], a[1] += b[1], a[2] += b[2];
}

function cartesianScale(vector, k) {
  return [vector[0] * k, vector[1] * k, vector[2] * k];
} // TODO return d


function cartesianNormalizeInPlace(d) {
  var l = (0, _math.sqrt)(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
  d[0] /= l, d[1] /= l, d[2] /= l;
}

},{"./math.js":158}],139:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _math = require("./math.js");

var _noop = _interopRequireDefault(require("./noop.js"));

var _stream = _interopRequireDefault(require("./stream.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var W0, W1, X0, Y0, Z0, X1, Y1, Z1, X2, Y2, Z2, lambda00, phi00, // first point
x0, y0, z0; // previous point

var centroidStream = {
  sphere: _noop.default,
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function () {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function () {
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  }
}; // Arithmetic mean of Cartesian vectors.

function centroidPoint(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  var cosPhi = (0, _math.cos)(phi);
  centroidPointCartesian(cosPhi * (0, _math.cos)(lambda), cosPhi * (0, _math.sin)(lambda), (0, _math.sin)(phi));
}

function centroidPointCartesian(x, y, z) {
  ++W0;
  X0 += (x - X0) / W0;
  Y0 += (y - Y0) / W0;
  Z0 += (z - Z0) / W0;
}

function centroidLineStart() {
  centroidStream.point = centroidLinePointFirst;
}

function centroidLinePointFirst(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  var cosPhi = (0, _math.cos)(phi);
  x0 = cosPhi * (0, _math.cos)(lambda);
  y0 = cosPhi * (0, _math.sin)(lambda);
  z0 = (0, _math.sin)(phi);
  centroidStream.point = centroidLinePoint;
  centroidPointCartesian(x0, y0, z0);
}

function centroidLinePoint(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  var cosPhi = (0, _math.cos)(phi),
      x = cosPhi * (0, _math.cos)(lambda),
      y = cosPhi * (0, _math.sin)(lambda),
      z = (0, _math.sin)(phi),
      w = (0, _math.atan2)((0, _math.sqrt)((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
} // See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).


function centroidRingStart() {
  centroidStream.point = centroidRingPointFirst;
}

function centroidRingEnd() {
  centroidRingPoint(lambda00, phi00);
  centroidStream.point = centroidPoint;
}

function centroidRingPointFirst(lambda, phi) {
  lambda00 = lambda, phi00 = phi;
  lambda *= _math.radians, phi *= _math.radians;
  centroidStream.point = centroidRingPoint;
  var cosPhi = (0, _math.cos)(phi);
  x0 = cosPhi * (0, _math.cos)(lambda);
  y0 = cosPhi * (0, _math.sin)(lambda);
  z0 = (0, _math.sin)(phi);
  centroidPointCartesian(x0, y0, z0);
}

function centroidRingPoint(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  var cosPhi = (0, _math.cos)(phi),
      x = cosPhi * (0, _math.cos)(lambda),
      y = cosPhi * (0, _math.sin)(lambda),
      z = (0, _math.sin)(phi),
      cx = y0 * z - z0 * y,
      cy = z0 * x - x0 * z,
      cz = x0 * y - y0 * x,
      m = (0, _math.sqrt)(cx * cx + cy * cy + cz * cz),
      w = (0, _math.asin)(m),
      // line weight = angle
  v = m && -w / m; // area weight multiplier

  X2 += v * cx;
  Y2 += v * cy;
  Z2 += v * cz;
  W1 += w;
  X1 += w * (x0 + (x0 = x));
  Y1 += w * (y0 + (y0 = y));
  Z1 += w * (z0 + (z0 = z));
  centroidPointCartesian(x0, y0, z0);
}

function _default(object) {
  W0 = W1 = X0 = Y0 = Z0 = X1 = Y1 = Z1 = X2 = Y2 = Z2 = 0;
  (0, _stream.default)(object, centroidStream);
  var x = X2,
      y = Y2,
      z = Z2,
      m = x * x + y * y + z * z; // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.

  if (m < _math.epsilon2) {
    x = X1, y = Y1, z = Z1; // If the feature has zero length, fall back to arithmetic mean of point vectors.

    if (W1 < _math.epsilon) x = X0, y = Y0, z = Z0;
    m = x * x + y * y + z * z; // If the feature still has an undefined ccentroid, then return.

    if (m < _math.epsilon2) return [NaN, NaN];
  }

  return [(0, _math.atan2)(y, x) * _math.degrees, (0, _math.asin)(z / (0, _math.sqrt)(m)) * _math.degrees];
}

},{"./math.js":158,"./noop.js":159,"./stream.js":192}],140:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleStream = circleStream;
exports.default = _default;

var _cartesian = require("./cartesian.js");

var _constant = _interopRequireDefault(require("./constant.js"));

var _math = require("./math.js");

var _rotation = require("./rotation.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(stream, radius, delta, direction, t0, t1) {
  if (!delta) return;
  var cosRadius = (0, _math.cos)(radius),
      sinRadius = (0, _math.sin)(radius),
      step = direction * delta;

  if (t0 == null) {
    t0 = radius + direction * _math.tau;
    t1 = radius - step / 2;
  } else {
    t0 = circleRadius(cosRadius, t0);
    t1 = circleRadius(cosRadius, t1);
    if (direction > 0 ? t0 < t1 : t0 > t1) t0 += direction * _math.tau;
  }

  for (var point, t = t0; direction > 0 ? t > t1 : t < t1; t -= step) {
    point = (0, _cartesian.spherical)([cosRadius, -sinRadius * (0, _math.cos)(t), -sinRadius * (0, _math.sin)(t)]);
    stream.point(point[0], point[1]);
  }
} // Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].


function circleRadius(cosRadius, point) {
  point = (0, _cartesian.cartesian)(point), point[0] -= cosRadius;
  (0, _cartesian.cartesianNormalizeInPlace)(point);
  var radius = (0, _math.acos)(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + _math.tau - _math.epsilon) % _math.tau;
}

function _default() {
  var center = (0, _constant.default)([0, 0]),
      radius = (0, _constant.default)(90),
      precision = (0, _constant.default)(6),
      ring,
      rotate,
      stream = {
    point: point
  };

  function point(x, y) {
    ring.push(x = rotate(x, y));
    x[0] *= _math.degrees, x[1] *= _math.degrees;
  }

  function circle() {
    var c = center.apply(this, arguments),
        r = radius.apply(this, arguments) * _math.radians,
        p = precision.apply(this, arguments) * _math.radians;

    ring = [];
    rotate = (0, _rotation.rotateRadians)(-c[0] * _math.radians, -c[1] * _math.radians, 0).invert;
    circleStream(stream, r, p, 1);
    c = {
      type: "Polygon",
      coordinates: [ring]
    };
    ring = rotate = null;
    return c;
  }

  circle.center = function (_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : (0, _constant.default)([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function (_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : (0, _constant.default)(+_), circle) : radius;
  };

  circle.precision = function (_) {
    return arguments.length ? (precision = typeof _ === "function" ? _ : (0, _constant.default)(+_), circle) : precision;
  };

  return circle;
}

},{"./cartesian.js":138,"./constant.js":150,"./math.js":158,"./rotation.js":191}],141:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./index.js"));

var _math = require("../math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _index.default)(function () {
  return true;
}, clipAntimeridianLine, clipAntimeridianInterpolate, [-_math.pi, -_math.halfPi]); // Takes a line and cuts into visible segments. Return values: 0 - there were
// intersections or the line was empty; 1 - no intersections; 2 - there were
// intersections, and the first and last segments should be rejoined.


exports.default = _default;

function clipAntimeridianLine(stream) {
  var lambda0 = NaN,
      phi0 = NaN,
      sign0 = NaN,
      clean; // no intersections

  return {
    lineStart: function () {
      stream.lineStart();
      clean = 1;
    },
    point: function (lambda1, phi1) {
      var sign1 = lambda1 > 0 ? _math.pi : -_math.pi,
          delta = (0, _math.abs)(lambda1 - lambda0);

      if ((0, _math.abs)(delta - _math.pi) < _math.epsilon) {
        // line crosses a pole
        stream.point(lambda0, phi0 = (phi0 + phi1) / 2 > 0 ? _math.halfPi : -_math.halfPi);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        stream.point(lambda1, phi0);
        clean = 0;
      } else if (sign0 !== sign1 && delta >= _math.pi) {
        // line crosses antimeridian
        if ((0, _math.abs)(lambda0 - sign0) < _math.epsilon) lambda0 -= sign0 * _math.epsilon; // handle degeneracies

        if ((0, _math.abs)(lambda1 - sign1) < _math.epsilon) lambda1 -= sign1 * _math.epsilon;
        phi0 = clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1);
        stream.point(sign0, phi0);
        stream.lineEnd();
        stream.lineStart();
        stream.point(sign1, phi0);
        clean = 0;
      }

      stream.point(lambda0 = lambda1, phi0 = phi1);
      sign0 = sign1;
    },
    lineEnd: function () {
      stream.lineEnd();
      lambda0 = phi0 = NaN;
    },
    clean: function () {
      return 2 - clean; // if intersections, rejoin first and last segments
    }
  };
}

function clipAntimeridianIntersect(lambda0, phi0, lambda1, phi1) {
  var cosPhi0,
      cosPhi1,
      sinLambda0Lambda1 = (0, _math.sin)(lambda0 - lambda1);
  return (0, _math.abs)(sinLambda0Lambda1) > _math.epsilon ? (0, _math.atan)(((0, _math.sin)(phi0) * (cosPhi1 = (0, _math.cos)(phi1)) * (0, _math.sin)(lambda1) - (0, _math.sin)(phi1) * (cosPhi0 = (0, _math.cos)(phi0)) * (0, _math.sin)(lambda0)) / (cosPhi0 * cosPhi1 * sinLambda0Lambda1)) : (phi0 + phi1) / 2;
}

function clipAntimeridianInterpolate(from, to, direction, stream) {
  var phi;

  if (from == null) {
    phi = direction * _math.halfPi;
    stream.point(-_math.pi, phi);
    stream.point(0, phi);
    stream.point(_math.pi, phi);
    stream.point(_math.pi, 0);
    stream.point(_math.pi, -phi);
    stream.point(0, -phi);
    stream.point(-_math.pi, -phi);
    stream.point(-_math.pi, 0);
    stream.point(-_math.pi, phi);
  } else if ((0, _math.abs)(from[0] - to[0]) > _math.epsilon) {
    var lambda = from[0] < to[0] ? _math.pi : -_math.pi;
    phi = direction * lambda / 2;
    stream.point(-lambda, phi);
    stream.point(0, phi);
    stream.point(lambda, phi);
  } else {
    stream.point(to[0], to[1]);
  }
}

},{"../math.js":158,"./index.js":145}],142:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var lines = [],
      line;
  return {
    point: function (x, y) {
      line.push([x, y]);
    },
    lineStart: function () {
      lines.push(line = []);
    },
    lineEnd: _noop.default,
    rejoin: function () {
      if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
    },
    result: function () {
      var result = lines;
      lines = [];
      line = null;
      return result;
    }
  };
}

},{"../noop.js":159}],143:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _cartesian = require("../cartesian.js");

var _circle = require("../circle.js");

var _math = require("../math.js");

var _pointEqual = _interopRequireDefault(require("../pointEqual.js"));

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(radius) {
  var cr = (0, _math.cos)(radius),
      delta = 6 * _math.radians,
      smallRadius = cr > 0,
      notHemisphere = (0, _math.abs)(cr) > _math.epsilon; // TODO optimise for this common case


  function interpolate(from, to, direction, stream) {
    (0, _circle.circleStream)(stream, radius, delta, direction, from, to);
  }

  function visible(lambda, phi) {
    return (0, _math.cos)(lambda) * (0, _math.cos)(phi) > cr;
  } // Takes a line and cuts into visible segments. Return values used for polygon
  // clipping: 0 - there were intersections or the line was empty; 1 - no
  // intersections 2 - there were intersections, and the first and last segments
  // should be rejoined.


  function clipLine(stream) {
    var point0, // previous point
    c0, // code for previous point
    v0, // visibility of previous point
    v00, // visibility of first point
    clean; // no intersections

    return {
      lineStart: function () {
        v00 = v0 = false;
        clean = 1;
      },
      point: function (lambda, phi) {
        var point1 = [lambda, phi],
            point2,
            v = visible(lambda, phi),
            c = smallRadius ? v ? 0 : code(lambda, phi) : v ? code(lambda + (lambda < 0 ? _math.pi : -_math.pi), phi) : 0;
        if (!point0 && (v00 = v0 = v)) stream.lineStart(); // Handle degeneracies.
        // TODO ignore if not clipping polygons.

        if (v !== v0) {
          point2 = intersect(point0, point1);

          if (!point2 || (0, _pointEqual.default)(point0, point2) || (0, _pointEqual.default)(point1, point2)) {
            point1[0] += _math.epsilon;
            point1[1] += _math.epsilon;
            v = visible(point1[0], point1[1]);
          }
        }

        if (v !== v0) {
          clean = 0;

          if (v) {
            // outside going in
            stream.lineStart();
            point2 = intersect(point1, point0);
            stream.point(point2[0], point2[1]);
          } else {
            // inside going out
            point2 = intersect(point0, point1);
            stream.point(point2[0], point2[1]);
            stream.lineEnd();
          }

          point0 = point2;
        } else if (notHemisphere && point0 && smallRadius ^ v) {
          var t; // If the codes for two points are different, or are both zero,
          // and there this segment intersects with the small circle.

          if (!(c & c0) && (t = intersect(point1, point0, true))) {
            clean = 0;

            if (smallRadius) {
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
            } else {
              stream.point(t[1][0], t[1][1]);
              stream.lineEnd();
              stream.lineStart();
              stream.point(t[0][0], t[0][1]);
            }
          }
        }

        if (v && (!point0 || !(0, _pointEqual.default)(point0, point1))) {
          stream.point(point1[0], point1[1]);
        }

        point0 = point1, v0 = v, c0 = c;
      },
      lineEnd: function () {
        if (v0) stream.lineEnd();
        point0 = null;
      },
      // Rejoin first and last segments if there were intersections and the first
      // and last points were visible.
      clean: function () {
        return clean | (v00 && v0) << 1;
      }
    };
  } // Intersects the great circle between a and b with the clip circle.


  function intersect(a, b, two) {
    var pa = (0, _cartesian.cartesian)(a),
        pb = (0, _cartesian.cartesian)(b); // We have two planes, n1.p = d1 and n2.p = d2.
    // Find intersection line p(t) = c1 n1 + c2 n2 + t (n1 ⨯ n2).

    var n1 = [1, 0, 0],
        // normal
    n2 = (0, _cartesian.cartesianCross)(pa, pb),
        n2n2 = (0, _cartesian.cartesianDot)(n2, n2),
        n1n2 = n2[0],
        // cartesianDot(n1, n2),
    determinant = n2n2 - n1n2 * n1n2; // Two polar points.

    if (!determinant) return !two && a;
    var c1 = cr * n2n2 / determinant,
        c2 = -cr * n1n2 / determinant,
        n1xn2 = (0, _cartesian.cartesianCross)(n1, n2),
        A = (0, _cartesian.cartesianScale)(n1, c1),
        B = (0, _cartesian.cartesianScale)(n2, c2);
    (0, _cartesian.cartesianAddInPlace)(A, B); // Solve |p(t)|^2 = 1.

    var u = n1xn2,
        w = (0, _cartesian.cartesianDot)(A, u),
        uu = (0, _cartesian.cartesianDot)(u, u),
        t2 = w * w - uu * ((0, _cartesian.cartesianDot)(A, A) - 1);
    if (t2 < 0) return;
    var t = (0, _math.sqrt)(t2),
        q = (0, _cartesian.cartesianScale)(u, (-w - t) / uu);
    (0, _cartesian.cartesianAddInPlace)(q, A);
    q = (0, _cartesian.spherical)(q);
    if (!two) return q; // Two intersection points.

    var lambda0 = a[0],
        lambda1 = b[0],
        phi0 = a[1],
        phi1 = b[1],
        z;
    if (lambda1 < lambda0) z = lambda0, lambda0 = lambda1, lambda1 = z;

    var delta = lambda1 - lambda0,
        polar = (0, _math.abs)(delta - _math.pi) < _math.epsilon,
        meridian = polar || delta < _math.epsilon;

    if (!polar && phi1 < phi0) z = phi0, phi0 = phi1, phi1 = z; // Check that the first point is between a and b.

    if (meridian ? polar ? phi0 + phi1 > 0 ^ q[1] < ((0, _math.abs)(q[0] - lambda0) < _math.epsilon ? phi0 : phi1) : phi0 <= q[1] && q[1] <= phi1 : delta > _math.pi ^ (lambda0 <= q[0] && q[0] <= lambda1)) {
      var q1 = (0, _cartesian.cartesianScale)(u, (-w + t) / uu);
      (0, _cartesian.cartesianAddInPlace)(q1, A);
      return [q, (0, _cartesian.spherical)(q1)];
    }
  } // Generates a 4-bit vector representing the location of a point relative to
  // the small circle's bounding box.


  function code(lambda, phi) {
    var r = smallRadius ? radius : _math.pi - radius,
        code = 0;
    if (lambda < -r) code |= 1; // left
    else if (lambda > r) code |= 2; // right

    if (phi < -r) code |= 4; // below
    else if (phi > r) code |= 8; // above

    return code;
  }

  return (0, _index.default)(visible, clipLine, interpolate, smallRadius ? [0, -radius] : [-_math.pi, radius - _math.pi]);
}

},{"../cartesian.js":138,"../circle.js":140,"../math.js":158,"../pointEqual.js":167,"./index.js":145}],144:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _rectangle = _interopRequireDefault(require("./rectangle.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      cache,
      cacheStream,
      clip;
  return clip = {
    stream: function (stream) {
      return cache && cacheStream === stream ? cache : cache = (0, _rectangle.default)(x0, y0, x1, y1)(cacheStream = stream);
    },
    extent: function (_) {
      return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], cache = cacheStream = null, clip) : [[x0, y0], [x1, y1]];
    }
  };
}

},{"./rectangle.js":147}],145:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _buffer = _interopRequireDefault(require("./buffer.js"));

var _rejoin = _interopRequireDefault(require("./rejoin.js"));

var _math = require("../math.js");

var _polygonContains = _interopRequireDefault(require("../polygonContains.js"));

var _d3Array = require("d3-array");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(pointVisible, clipLine, interpolate, start) {
  return function (sink) {
    var line = clipLine(sink),
        ringBuffer = (0, _buffer.default)(),
        ringSink = clipLine(ringBuffer),
        polygonStarted = false,
        polygon,
        segments,
        ring;
    var clip = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function () {
        clip.point = pointRing;
        clip.lineStart = ringStart;
        clip.lineEnd = ringEnd;
        segments = [];
        polygon = [];
      },
      polygonEnd: function () {
        clip.point = point;
        clip.lineStart = lineStart;
        clip.lineEnd = lineEnd;
        segments = (0, _d3Array.merge)(segments);
        var startInside = (0, _polygonContains.default)(polygon, start);

        if (segments.length) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          (0, _rejoin.default)(segments, compareIntersection, startInside, interpolate, sink);
        } else if (startInside) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();
          interpolate(null, null, 1, sink);
          sink.lineEnd();
        }

        if (polygonStarted) sink.polygonEnd(), polygonStarted = false;
        segments = polygon = null;
      },
      sphere: function () {
        sink.polygonStart();
        sink.lineStart();
        interpolate(null, null, 1, sink);
        sink.lineEnd();
        sink.polygonEnd();
      }
    };

    function point(lambda, phi) {
      if (pointVisible(lambda, phi)) sink.point(lambda, phi);
    }

    function pointLine(lambda, phi) {
      line.point(lambda, phi);
    }

    function lineStart() {
      clip.point = pointLine;
      line.lineStart();
    }

    function lineEnd() {
      clip.point = point;
      line.lineEnd();
    }

    function pointRing(lambda, phi) {
      ring.push([lambda, phi]);
      ringSink.point(lambda, phi);
    }

    function ringStart() {
      ringSink.lineStart();
      ring = [];
    }

    function ringEnd() {
      pointRing(ring[0][0], ring[0][1]);
      ringSink.lineEnd();
      var clean = ringSink.clean(),
          ringSegments = ringBuffer.result(),
          i,
          n = ringSegments.length,
          m,
          segment,
          point;
      ring.pop();
      polygon.push(ring);
      ring = null;
      if (!n) return; // No intersections.

      if (clean & 1) {
        segment = ringSegments[0];

        if ((m = segment.length - 1) > 0) {
          if (!polygonStarted) sink.polygonStart(), polygonStarted = true;
          sink.lineStart();

          for (i = 0; i < m; ++i) sink.point((point = segment[i])[0], point[1]);

          sink.lineEnd();
        }

        return;
      } // Rejoin connected segments.
      // TODO reuse ringBuffer.rejoin()?


      if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
      segments.push(ringSegments.filter(validSegment));
    }

    return clip;
  };
}

function validSegment(segment) {
  return segment.length > 1;
} // Intersections are sorted along the clip edge. For both antimeridian cutting
// and circle clipping, the same comparison is used.


function compareIntersection(a, b) {
  return ((a = a.x)[0] < 0 ? a[1] - _math.halfPi - _math.epsilon : _math.halfPi - a[1]) - ((b = b.x)[0] < 0 ? b[1] - _math.halfPi - _math.epsilon : _math.halfPi - b[1]);
}

},{"../math.js":158,"../polygonContains.js":168,"./buffer.js":142,"./rejoin.js":148,"d3-array":14}],146:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b, x0, y0, x1, y1) {
  var ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;
  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;

  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;

  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;

  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;

  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (t0 > 0) a[0] = ax + t0 * dx, a[1] = ay + t0 * dy;
  if (t1 < 1) b[0] = ax + t1 * dx, b[1] = ay + t1 * dy;
  return true;
}

},{}],147:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clipRectangle;

var _math = require("../math.js");

var _buffer = _interopRequireDefault(require("./buffer.js"));

var _line = _interopRequireDefault(require("./line.js"));

var _rejoin = _interopRequireDefault(require("./rejoin.js"));

var _d3Array = require("d3-array");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clipMax = 1e9,
    clipMin = -clipMax; // TODO Use d3-polygon’s polygonContains here for the ring check?
// TODO Eliminate duplicate buffering in clipBuffer and polygon.push?

function clipRectangle(x0, y0, x1, y1) {
  function visible(x, y) {
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
  }

  function interpolate(from, to, direction, stream) {
    var a = 0,
        a1 = 0;

    if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoint(from, to) < 0 ^ direction > 0) {
      do stream.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0); while ((a = (a + direction + 4) % 4) !== a1);
    } else {
      stream.point(to[0], to[1]);
    }
  }

  function corner(p, direction) {
    return (0, _math.abs)(p[0] - x0) < _math.epsilon ? direction > 0 ? 0 : 3 : (0, _math.abs)(p[0] - x1) < _math.epsilon ? direction > 0 ? 2 : 1 : (0, _math.abs)(p[1] - y0) < _math.epsilon ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2; // abs(p[1] - y1) < epsilon
  }

  function compareIntersection(a, b) {
    return comparePoint(a.x, b.x);
  }

  function comparePoint(a, b) {
    var ca = corner(a, 1),
        cb = corner(b, 1);
    return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
  }

  return function (stream) {
    var activeStream = stream,
        bufferStream = (0, _buffer.default)(),
        segments,
        polygon,
        ring,
        x__,
        y__,
        v__,
        // first point
    x_,
        y_,
        v_,
        // previous point
    first,
        clean;
    var clipStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: polygonStart,
      polygonEnd: polygonEnd
    };

    function point(x, y) {
      if (visible(x, y)) activeStream.point(x, y);
    }

    function polygonInside() {
      var winding = 0;

      for (var i = 0, n = polygon.length; i < n; ++i) {
        for (var ring = polygon[i], j = 1, m = ring.length, point = ring[0], a0, a1, b0 = point[0], b1 = point[1]; j < m; ++j) {
          a0 = b0, a1 = b1, point = ring[j], b0 = point[0], b1 = point[1];

          if (a1 <= y1) {
            if (b1 > y1 && (b0 - a0) * (y1 - a1) > (b1 - a1) * (x0 - a0)) ++winding;
          } else {
            if (b1 <= y1 && (b0 - a0) * (y1 - a1) < (b1 - a1) * (x0 - a0)) --winding;
          }
        }
      }

      return winding;
    } // Buffer geometry within a polygon and then clip it en masse.


    function polygonStart() {
      activeStream = bufferStream, segments = [], polygon = [], clean = true;
    }

    function polygonEnd() {
      var startInside = polygonInside(),
          cleanInside = clean && startInside,
          visible = (segments = (0, _d3Array.merge)(segments)).length;

      if (cleanInside || visible) {
        stream.polygonStart();

        if (cleanInside) {
          stream.lineStart();
          interpolate(null, null, 1, stream);
          stream.lineEnd();
        }

        if (visible) {
          (0, _rejoin.default)(segments, compareIntersection, startInside, interpolate, stream);
        }

        stream.polygonEnd();
      }

      activeStream = stream, segments = polygon = ring = null;
    }

    function lineStart() {
      clipStream.point = linePoint;
      if (polygon) polygon.push(ring = []);
      first = true;
      v_ = false;
      x_ = y_ = NaN;
    } // TODO rather than special-case polygons, simply handle them separately.
    // Ideally, coincident intersection points should be jittered to avoid
    // clipping issues.


    function lineEnd() {
      if (segments) {
        linePoint(x__, y__);
        if (v__ && v_) bufferStream.rejoin();
        segments.push(bufferStream.result());
      }

      clipStream.point = point;
      if (v_) activeStream.lineEnd();
    }

    function linePoint(x, y) {
      var v = visible(x, y);
      if (polygon) ring.push([x, y]);

      if (first) {
        x__ = x, y__ = y, v__ = v;
        first = false;

        if (v) {
          activeStream.lineStart();
          activeStream.point(x, y);
        }
      } else {
        if (v && v_) activeStream.point(x, y);else {
          var a = [x_ = Math.max(clipMin, Math.min(clipMax, x_)), y_ = Math.max(clipMin, Math.min(clipMax, y_))],
              b = [x = Math.max(clipMin, Math.min(clipMax, x)), y = Math.max(clipMin, Math.min(clipMax, y))];

          if ((0, _line.default)(a, b, x0, y0, x1, y1)) {
            if (!v_) {
              activeStream.lineStart();
              activeStream.point(a[0], a[1]);
            }

            activeStream.point(b[0], b[1]);
            if (!v) activeStream.lineEnd();
            clean = false;
          } else if (v) {
            activeStream.lineStart();
            activeStream.point(x, y);
            clean = false;
          }
        }
      }

      x_ = x, y_ = y, v_ = v;
    }

    return clipStream;
  };
}

},{"../math.js":158,"./buffer.js":142,"./line.js":146,"./rejoin.js":148,"d3-array":14}],148:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _pointEqual = _interopRequireDefault(require("../pointEqual.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection

  this.e = entry; // is an entry?

  this.v = false; // visited

  this.n = this.p = null; // next & previous
} // A generalized polygon clipping algorithm: given a polygon that has been cut
// into its visible line segments, and rejoins the segments by interpolating
// along the clip edge.


function _default(segments, compareIntersection, startInside, interpolate, stream) {
  var subject = [],
      clip = [],
      i,
      n;
  segments.forEach(function (segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n,
        p0 = segment[0],
        p1 = segment[n],
        x; // If the first and last points of a segment are coincident, then treat as a
    // closed ring. TODO if all rings are closed, then the winding order of the
    // exterior ring should be checked.

    if ((0, _pointEqual.default)(p0, p1)) {
      stream.lineStart();

      for (i = 0; i < n; ++i) stream.point((p0 = segment[i])[0], p0[1]);

      stream.lineEnd();
      return;
    }

    subject.push(x = new Intersection(p0, segment, null, true));
    clip.push(x.o = new Intersection(p0, null, x, false));
    subject.push(x = new Intersection(p1, segment, null, false));
    clip.push(x.o = new Intersection(p1, null, x, true));
  });
  if (!subject.length) return;
  clip.sort(compareIntersection);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = startInside = !startInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;

    while (current.v) if ((current = current.n) === start) return;

    points = current.z;
    stream.lineStart();

    do {
      current.v = current.o.v = true;

      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, stream);
        }

        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;

          for (i = points.length - 1; i >= 0; --i) stream.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, stream);
        }

        current = current.p;
      }

      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);

    stream.lineEnd();
  }
}

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;

  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }

  a.n = b = array[0];
  b.p = a;
}

},{"../pointEqual.js":167}],149:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  function compose(x, y) {
    return x = a(x, y), b(x[0], x[1]);
  }

  if (a.invert && b.invert) compose.invert = function (x, y) {
    return x = b.invert(x, y), x && a.invert(x[0], x[1]);
  };
  return compose;
}

},{}],150:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],151:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _polygonContains = _interopRequireDefault(require("./polygonContains.js"));

var _distance = _interopRequireDefault(require("./distance.js"));

var _math = require("./math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var containsObjectType = {
  Feature: function (object, point) {
    return containsGeometry(object.geometry, point);
  },
  FeatureCollection: function (object, point) {
    var features = object.features,
        i = -1,
        n = features.length;

    while (++i < n) if (containsGeometry(features[i].geometry, point)) return true;

    return false;
  }
};
var containsGeometryType = {
  Sphere: function () {
    return true;
  },
  Point: function (object, point) {
    return containsPoint(object.coordinates, point);
  },
  MultiPoint: function (object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) if (containsPoint(coordinates[i], point)) return true;

    return false;
  },
  LineString: function (object, point) {
    return containsLine(object.coordinates, point);
  },
  MultiLineString: function (object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) if (containsLine(coordinates[i], point)) return true;

    return false;
  },
  Polygon: function (object, point) {
    return containsPolygon(object.coordinates, point);
  },
  MultiPolygon: function (object, point) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) if (containsPolygon(coordinates[i], point)) return true;

    return false;
  },
  GeometryCollection: function (object, point) {
    var geometries = object.geometries,
        i = -1,
        n = geometries.length;

    while (++i < n) if (containsGeometry(geometries[i], point)) return true;

    return false;
  }
};

function containsGeometry(geometry, point) {
  return geometry && containsGeometryType.hasOwnProperty(geometry.type) ? containsGeometryType[geometry.type](geometry, point) : false;
}

function containsPoint(coordinates, point) {
  return (0, _distance.default)(coordinates, point) === 0;
}

function containsLine(coordinates, point) {
  var ao, bo, ab;

  for (var i = 0, n = coordinates.length; i < n; i++) {
    bo = (0, _distance.default)(coordinates[i], point);
    if (bo === 0) return true;

    if (i > 0) {
      ab = (0, _distance.default)(coordinates[i], coordinates[i - 1]);
      if (ab > 0 && ao <= ab && bo <= ab && (ao + bo - ab) * (1 - Math.pow((ao - bo) / ab, 2)) < _math.epsilon2 * ab) return true;
    }

    ao = bo;
  }

  return false;
}

function containsPolygon(coordinates, point) {
  return !!(0, _polygonContains.default)(coordinates.map(ringRadians), pointRadians(point));
}

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * _math.radians, point[1] * _math.radians];
}

function _default(object, point) {
  return (object && containsObjectType.hasOwnProperty(object.type) ? containsObjectType[object.type] : containsGeometry)(object, point);
}

},{"./distance.js":152,"./math.js":158,"./polygonContains.js":168}],152:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _length = _interopRequireDefault(require("./length.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var coordinates = [null, null],
    object = {
  type: "LineString",
  coordinates: coordinates
};

function _default(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return (0, _length.default)(object);
}

},{"./length.js":157}],153:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = graticule;
exports.graticule10 = graticule10;

var _d3Array = require("d3-array");

var _math = require("./math.js");

function graticuleX(y0, y1, dy) {
  var y = (0, _d3Array.range)(y0, y1 - _math.epsilon, dy).concat(y1);
  return function (x) {
    return y.map(function (y) {
      return [x, y];
    });
  };
}

function graticuleY(x0, x1, dx) {
  var x = (0, _d3Array.range)(x0, x1 - _math.epsilon, dx).concat(x1);
  return function (y) {
    return x.map(function (x) {
      return [x, y];
    });
  };
}

function graticule() {
  var x1,
      x0,
      X1,
      X0,
      y1,
      y0,
      Y1,
      Y0,
      dx = 10,
      dy = dx,
      DX = 90,
      DY = 360,
      x,
      y,
      X,
      Y,
      precision = 2.5;

  function graticule() {
    return {
      type: "MultiLineString",
      coordinates: lines()
    };
  }

  function lines() {
    return (0, _d3Array.range)((0, _math.ceil)(X0 / DX) * DX, X1, DX).map(X).concat((0, _d3Array.range)((0, _math.ceil)(Y0 / DY) * DY, Y1, DY).map(Y)).concat((0, _d3Array.range)((0, _math.ceil)(x0 / dx) * dx, x1, dx).filter(function (x) {
      return (0, _math.abs)(x % DX) > _math.epsilon;
    }).map(x)).concat((0, _d3Array.range)((0, _math.ceil)(y0 / dy) * dy, y1, dy).filter(function (y) {
      return (0, _math.abs)(y % DY) > _math.epsilon;
    }).map(y));
  }

  graticule.lines = function () {
    return lines().map(function (coordinates) {
      return {
        type: "LineString",
        coordinates: coordinates
      };
    });
  };

  graticule.outline = function () {
    return {
      type: "Polygon",
      coordinates: [X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1))]
    };
  };

  graticule.extent = function (_) {
    if (!arguments.length) return graticule.extentMinor();
    return graticule.extentMajor(_).extentMinor(_);
  };

  graticule.extentMajor = function (_) {
    if (!arguments.length) return [[X0, Y0], [X1, Y1]];
    X0 = +_[0][0], X1 = +_[1][0];
    Y0 = +_[0][1], Y1 = +_[1][1];
    if (X0 > X1) _ = X0, X0 = X1, X1 = _;
    if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
    return graticule.precision(precision);
  };

  graticule.extentMinor = function (_) {
    if (!arguments.length) return [[x0, y0], [x1, y1]];
    x0 = +_[0][0], x1 = +_[1][0];
    y0 = +_[0][1], y1 = +_[1][1];
    if (x0 > x1) _ = x0, x0 = x1, x1 = _;
    if (y0 > y1) _ = y0, y0 = y1, y1 = _;
    return graticule.precision(precision);
  };

  graticule.step = function (_) {
    if (!arguments.length) return graticule.stepMinor();
    return graticule.stepMajor(_).stepMinor(_);
  };

  graticule.stepMajor = function (_) {
    if (!arguments.length) return [DX, DY];
    DX = +_[0], DY = +_[1];
    return graticule;
  };

  graticule.stepMinor = function (_) {
    if (!arguments.length) return [dx, dy];
    dx = +_[0], dy = +_[1];
    return graticule;
  };

  graticule.precision = function (_) {
    if (!arguments.length) return precision;
    precision = +_;
    x = graticuleX(y0, y1, 90);
    y = graticuleY(x0, x1, precision);
    X = graticuleX(Y0, Y1, 90);
    Y = graticuleY(X0, X1, precision);
    return graticule;
  };

  return graticule.extentMajor([[-180, -90 + _math.epsilon], [180, 90 - _math.epsilon]]).extentMinor([[-180, -80 - _math.epsilon], [180, 80 + _math.epsilon]]);
}

function graticule10() {
  return graticule()();
}

},{"./math.js":158,"d3-array":14}],154:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],155:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "geoArea", {
  enumerable: true,
  get: function () {
    return _area.default;
  }
});
Object.defineProperty(exports, "geoBounds", {
  enumerable: true,
  get: function () {
    return _bounds.default;
  }
});
Object.defineProperty(exports, "geoCentroid", {
  enumerable: true,
  get: function () {
    return _centroid.default;
  }
});
Object.defineProperty(exports, "geoCircle", {
  enumerable: true,
  get: function () {
    return _circle.default;
  }
});
Object.defineProperty(exports, "geoClipAntimeridian", {
  enumerable: true,
  get: function () {
    return _antimeridian.default;
  }
});
Object.defineProperty(exports, "geoClipCircle", {
  enumerable: true,
  get: function () {
    return _circle2.default;
  }
});
Object.defineProperty(exports, "geoClipExtent", {
  enumerable: true,
  get: function () {
    return _extent.default;
  }
});
Object.defineProperty(exports, "geoClipRectangle", {
  enumerable: true,
  get: function () {
    return _rectangle.default;
  }
});
Object.defineProperty(exports, "geoContains", {
  enumerable: true,
  get: function () {
    return _contains.default;
  }
});
Object.defineProperty(exports, "geoDistance", {
  enumerable: true,
  get: function () {
    return _distance.default;
  }
});
Object.defineProperty(exports, "geoGraticule", {
  enumerable: true,
  get: function () {
    return _graticule.default;
  }
});
Object.defineProperty(exports, "geoGraticule10", {
  enumerable: true,
  get: function () {
    return _graticule.graticule10;
  }
});
Object.defineProperty(exports, "geoInterpolate", {
  enumerable: true,
  get: function () {
    return _interpolate.default;
  }
});
Object.defineProperty(exports, "geoLength", {
  enumerable: true,
  get: function () {
    return _length.default;
  }
});
Object.defineProperty(exports, "geoPath", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "geoAlbers", {
  enumerable: true,
  get: function () {
    return _albers.default;
  }
});
Object.defineProperty(exports, "geoAlbersUsa", {
  enumerable: true,
  get: function () {
    return _albersUsa.default;
  }
});
Object.defineProperty(exports, "geoAzimuthalEqualArea", {
  enumerable: true,
  get: function () {
    return _azimuthalEqualArea.default;
  }
});
Object.defineProperty(exports, "geoAzimuthalEqualAreaRaw", {
  enumerable: true,
  get: function () {
    return _azimuthalEqualArea.azimuthalEqualAreaRaw;
  }
});
Object.defineProperty(exports, "geoAzimuthalEquidistant", {
  enumerable: true,
  get: function () {
    return _azimuthalEquidistant.default;
  }
});
Object.defineProperty(exports, "geoAzimuthalEquidistantRaw", {
  enumerable: true,
  get: function () {
    return _azimuthalEquidistant.azimuthalEquidistantRaw;
  }
});
Object.defineProperty(exports, "geoConicConformal", {
  enumerable: true,
  get: function () {
    return _conicConformal.default;
  }
});
Object.defineProperty(exports, "geoConicConformalRaw", {
  enumerable: true,
  get: function () {
    return _conicConformal.conicConformalRaw;
  }
});
Object.defineProperty(exports, "geoConicEqualArea", {
  enumerable: true,
  get: function () {
    return _conicEqualArea.default;
  }
});
Object.defineProperty(exports, "geoConicEqualAreaRaw", {
  enumerable: true,
  get: function () {
    return _conicEqualArea.conicEqualAreaRaw;
  }
});
Object.defineProperty(exports, "geoConicEquidistant", {
  enumerable: true,
  get: function () {
    return _conicEquidistant.default;
  }
});
Object.defineProperty(exports, "geoConicEquidistantRaw", {
  enumerable: true,
  get: function () {
    return _conicEquidistant.conicEquidistantRaw;
  }
});
Object.defineProperty(exports, "geoEqualEarth", {
  enumerable: true,
  get: function () {
    return _equalEarth.default;
  }
});
Object.defineProperty(exports, "geoEqualEarthRaw", {
  enumerable: true,
  get: function () {
    return _equalEarth.equalEarthRaw;
  }
});
Object.defineProperty(exports, "geoEquirectangular", {
  enumerable: true,
  get: function () {
    return _equirectangular.default;
  }
});
Object.defineProperty(exports, "geoEquirectangularRaw", {
  enumerable: true,
  get: function () {
    return _equirectangular.equirectangularRaw;
  }
});
Object.defineProperty(exports, "geoGnomonic", {
  enumerable: true,
  get: function () {
    return _gnomonic.default;
  }
});
Object.defineProperty(exports, "geoGnomonicRaw", {
  enumerable: true,
  get: function () {
    return _gnomonic.gnomonicRaw;
  }
});
Object.defineProperty(exports, "geoIdentity", {
  enumerable: true,
  get: function () {
    return _identity.default;
  }
});
Object.defineProperty(exports, "geoProjection", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "geoProjectionMutator", {
  enumerable: true,
  get: function () {
    return _index2.projectionMutator;
  }
});
Object.defineProperty(exports, "geoMercator", {
  enumerable: true,
  get: function () {
    return _mercator.default;
  }
});
Object.defineProperty(exports, "geoMercatorRaw", {
  enumerable: true,
  get: function () {
    return _mercator.mercatorRaw;
  }
});
Object.defineProperty(exports, "geoNaturalEarth1", {
  enumerable: true,
  get: function () {
    return _naturalEarth.default;
  }
});
Object.defineProperty(exports, "geoNaturalEarth1Raw", {
  enumerable: true,
  get: function () {
    return _naturalEarth.naturalEarth1Raw;
  }
});
Object.defineProperty(exports, "geoOrthographic", {
  enumerable: true,
  get: function () {
    return _orthographic.default;
  }
});
Object.defineProperty(exports, "geoOrthographicRaw", {
  enumerable: true,
  get: function () {
    return _orthographic.orthographicRaw;
  }
});
Object.defineProperty(exports, "geoStereographic", {
  enumerable: true,
  get: function () {
    return _stereographic.default;
  }
});
Object.defineProperty(exports, "geoStereographicRaw", {
  enumerable: true,
  get: function () {
    return _stereographic.stereographicRaw;
  }
});
Object.defineProperty(exports, "geoTransverseMercator", {
  enumerable: true,
  get: function () {
    return _transverseMercator.default;
  }
});
Object.defineProperty(exports, "geoTransverseMercatorRaw", {
  enumerable: true,
  get: function () {
    return _transverseMercator.transverseMercatorRaw;
  }
});
Object.defineProperty(exports, "geoRotation", {
  enumerable: true,
  get: function () {
    return _rotation.default;
  }
});
Object.defineProperty(exports, "geoStream", {
  enumerable: true,
  get: function () {
    return _stream.default;
  }
});
Object.defineProperty(exports, "geoTransform", {
  enumerable: true,
  get: function () {
    return _transform.default;
  }
});

var _area = _interopRequireDefault(require("./area.js"));

var _bounds = _interopRequireDefault(require("./bounds.js"));

var _centroid = _interopRequireDefault(require("./centroid.js"));

var _circle = _interopRequireDefault(require("./circle.js"));

var _antimeridian = _interopRequireDefault(require("./clip/antimeridian.js"));

var _circle2 = _interopRequireDefault(require("./clip/circle.js"));

var _extent = _interopRequireDefault(require("./clip/extent.js"));

var _rectangle = _interopRequireDefault(require("./clip/rectangle.js"));

var _contains = _interopRequireDefault(require("./contains.js"));

var _distance = _interopRequireDefault(require("./distance.js"));

var _graticule = _interopRequireWildcard(require("./graticule.js"));

var _interpolate = _interopRequireDefault(require("./interpolate.js"));

var _length = _interopRequireDefault(require("./length.js"));

var _index = _interopRequireDefault(require("./path/index.js"));

var _albers = _interopRequireDefault(require("./projection/albers.js"));

var _albersUsa = _interopRequireDefault(require("./projection/albersUsa.js"));

var _azimuthalEqualArea = _interopRequireWildcard(require("./projection/azimuthalEqualArea.js"));

var _azimuthalEquidistant = _interopRequireWildcard(require("./projection/azimuthalEquidistant.js"));

var _conicConformal = _interopRequireWildcard(require("./projection/conicConformal.js"));

var _conicEqualArea = _interopRequireWildcard(require("./projection/conicEqualArea.js"));

var _conicEquidistant = _interopRequireWildcard(require("./projection/conicEquidistant.js"));

var _equalEarth = _interopRequireWildcard(require("./projection/equalEarth.js"));

var _equirectangular = _interopRequireWildcard(require("./projection/equirectangular.js"));

var _gnomonic = _interopRequireWildcard(require("./projection/gnomonic.js"));

var _identity = _interopRequireDefault(require("./projection/identity.js"));

var _index2 = _interopRequireWildcard(require("./projection/index.js"));

var _mercator = _interopRequireWildcard(require("./projection/mercator.js"));

var _naturalEarth = _interopRequireWildcard(require("./projection/naturalEarth1.js"));

var _orthographic = _interopRequireWildcard(require("./projection/orthographic.js"));

var _stereographic = _interopRequireWildcard(require("./projection/stereographic.js"));

var _transverseMercator = _interopRequireWildcard(require("./projection/transverseMercator.js"));

var _rotation = _interopRequireDefault(require("./rotation.js"));

var _stream = _interopRequireDefault(require("./stream.js"));

var _transform = _interopRequireDefault(require("./transform.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./area.js":136,"./bounds.js":137,"./centroid.js":139,"./circle.js":140,"./clip/antimeridian.js":141,"./clip/circle.js":143,"./clip/extent.js":144,"./clip/rectangle.js":147,"./contains.js":151,"./distance.js":152,"./graticule.js":153,"./interpolate.js":156,"./length.js":157,"./path/index.js":164,"./projection/albers.js":169,"./projection/albersUsa.js":170,"./projection/azimuthalEqualArea.js":172,"./projection/azimuthalEquidistant.js":173,"./projection/conicConformal.js":175,"./projection/conicEqualArea.js":176,"./projection/conicEquidistant.js":177,"./projection/equalEarth.js":179,"./projection/equirectangular.js":180,"./projection/gnomonic.js":182,"./projection/identity.js":183,"./projection/index.js":184,"./projection/mercator.js":185,"./projection/naturalEarth1.js":186,"./projection/orthographic.js":187,"./projection/stereographic.js":189,"./projection/transverseMercator.js":190,"./rotation.js":191,"./stream.js":192,"./transform.js":193}],156:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _math = require("./math.js");

function _default(a, b) {
  var x0 = a[0] * _math.radians,
      y0 = a[1] * _math.radians,
      x1 = b[0] * _math.radians,
      y1 = b[1] * _math.radians,
      cy0 = (0, _math.cos)(y0),
      sy0 = (0, _math.sin)(y0),
      cy1 = (0, _math.cos)(y1),
      sy1 = (0, _math.sin)(y1),
      kx0 = cy0 * (0, _math.cos)(x0),
      ky0 = cy0 * (0, _math.sin)(x0),
      kx1 = cy1 * (0, _math.cos)(x1),
      ky1 = cy1 * (0, _math.sin)(x1),
      d = 2 * (0, _math.asin)((0, _math.sqrt)((0, _math.haversin)(y1 - y0) + cy0 * cy1 * (0, _math.haversin)(x1 - x0))),
      k = (0, _math.sin)(d);
  var interpolate = d ? function (t) {
    var B = (0, _math.sin)(t *= d) / k,
        A = (0, _math.sin)(d - t) / k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [(0, _math.atan2)(y, x) * _math.degrees, (0, _math.atan2)(z, (0, _math.sqrt)(x * x + y * y)) * _math.degrees];
  } : function () {
    return [x0 * _math.degrees, y0 * _math.degrees];
  };
  interpolate.distance = d;
  return interpolate;
}

},{"./math.js":158}],157:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _adder = _interopRequireDefault(require("./adder.js"));

var _math = require("./math.js");

var _noop = _interopRequireDefault(require("./noop.js"));

var _stream = _interopRequireDefault(require("./stream.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lengthSum = (0, _adder.default)(),
    lambda0,
    sinPhi0,
    cosPhi0;
var lengthStream = {
  sphere: _noop.default,
  point: _noop.default,
  lineStart: lengthLineStart,
  lineEnd: _noop.default,
  polygonStart: _noop.default,
  polygonEnd: _noop.default
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = _noop.default;
}

function lengthPointFirst(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  lambda0 = lambda, sinPhi0 = (0, _math.sin)(phi), cosPhi0 = (0, _math.cos)(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= _math.radians, phi *= _math.radians;
  var sinPhi = (0, _math.sin)(phi),
      cosPhi = (0, _math.cos)(phi),
      delta = (0, _math.abs)(lambda - lambda0),
      cosDelta = (0, _math.cos)(delta),
      sinDelta = (0, _math.sin)(delta),
      x = cosPhi * sinDelta,
      y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
      z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
  lengthSum.add((0, _math.atan2)((0, _math.sqrt)(x * x + y * y), z));
  lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
}

function _default(object) {
  lengthSum.reset();
  (0, _stream.default)(object, lengthStream);
  return +lengthSum;
}

},{"./adder.js":135,"./math.js":158,"./noop.js":159,"./stream.js":192}],158:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acos = acos;
exports.asin = asin;
exports.haversin = haversin;
exports.tan = exports.sqrt = exports.sign = exports.sin = exports.pow = exports.log = exports.floor = exports.exp = exports.ceil = exports.cos = exports.atan2 = exports.atan = exports.abs = exports.radians = exports.degrees = exports.tau = exports.quarterPi = exports.halfPi = exports.pi = exports.epsilon2 = exports.epsilon = void 0;
var epsilon = 1e-6;
exports.epsilon = epsilon;
var epsilon2 = 1e-12;
exports.epsilon2 = epsilon2;
var pi = Math.PI;
exports.pi = pi;
var halfPi = pi / 2;
exports.halfPi = halfPi;
var quarterPi = pi / 4;
exports.quarterPi = quarterPi;
var tau = pi * 2;
exports.tau = tau;
var degrees = 180 / pi;
exports.degrees = degrees;
var radians = pi / 180;
exports.radians = radians;
var abs = Math.abs;
exports.abs = abs;
var atan = Math.atan;
exports.atan = atan;
var atan2 = Math.atan2;
exports.atan2 = atan2;
var cos = Math.cos;
exports.cos = cos;
var ceil = Math.ceil;
exports.ceil = ceil;
var exp = Math.exp;
exports.exp = exp;
var floor = Math.floor;
exports.floor = floor;
var log = Math.log;
exports.log = log;
var pow = Math.pow;
exports.pow = pow;
var sin = Math.sin;
exports.sin = sin;

var sign = Math.sign || function (x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
};

exports.sign = sign;
var sqrt = Math.sqrt;
exports.sqrt = sqrt;
var tan = Math.tan;
exports.tan = tan;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

function haversin(x) {
  return (x = sin(x / 2)) * x;
}

},{}],159:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = noop;

function noop() {}

},{}],160:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _adder = _interopRequireDefault(require("../adder.js"));

var _math = require("../math.js");

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var areaSum = (0, _adder.default)(),
    areaRingSum = (0, _adder.default)(),
    x00,
    y00,
    x0,
    y0;
var areaStream = {
  point: _noop.default,
  lineStart: _noop.default,
  lineEnd: _noop.default,
  polygonStart: function () {
    areaStream.lineStart = areaRingStart;
    areaStream.lineEnd = areaRingEnd;
  },
  polygonEnd: function () {
    areaStream.lineStart = areaStream.lineEnd = areaStream.point = _noop.default;
    areaSum.add((0, _math.abs)(areaRingSum));
    areaRingSum.reset();
  },
  result: function () {
    var area = areaSum / 2;
    areaSum.reset();
    return area;
  }
};

function areaRingStart() {
  areaStream.point = areaPointFirst;
}

function areaPointFirst(x, y) {
  areaStream.point = areaPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function areaPoint(x, y) {
  areaRingSum.add(y0 * x - x0 * y);
  x0 = x, y0 = y;
}

function areaRingEnd() {
  areaPoint(x00, y00);
}

var _default = areaStream;
exports.default = _default;

},{"../adder.js":135,"../math.js":158,"../noop.js":159}],161:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var x0 = Infinity,
    y0 = x0,
    x1 = -x0,
    y1 = x1;
var boundsStream = {
  point: boundsPoint,
  lineStart: _noop.default,
  lineEnd: _noop.default,
  polygonStart: _noop.default,
  polygonEnd: _noop.default,
  result: function () {
    var bounds = [[x0, y0], [x1, y1]];
    x1 = y1 = -(y0 = x0 = Infinity);
    return bounds;
  }
};

function boundsPoint(x, y) {
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}

var _default = boundsStream;
exports.default = _default;

},{"../noop.js":159}],162:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _math = require("../math.js");

// TODO Enforce positive area for exterior, negative area for interior?
var X0 = 0,
    Y0 = 0,
    Z0 = 0,
    X1 = 0,
    Y1 = 0,
    Z1 = 0,
    X2 = 0,
    Y2 = 0,
    Z2 = 0,
    x00,
    y00,
    x0,
    y0;
var centroidStream = {
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function () {
    centroidStream.lineStart = centroidRingStart;
    centroidStream.lineEnd = centroidRingEnd;
  },
  polygonEnd: function () {
    centroidStream.point = centroidPoint;
    centroidStream.lineStart = centroidLineStart;
    centroidStream.lineEnd = centroidLineEnd;
  },
  result: function () {
    var centroid = Z2 ? [X2 / Z2, Y2 / Z2] : Z1 ? [X1 / Z1, Y1 / Z1] : Z0 ? [X0 / Z0, Y0 / Z0] : [NaN, NaN];
    X0 = Y0 = Z0 = X1 = Y1 = Z1 = X2 = Y2 = Z2 = 0;
    return centroid;
  }
};

function centroidPoint(x, y) {
  X0 += x;
  Y0 += y;
  ++Z0;
}

function centroidLineStart() {
  centroidStream.point = centroidPointFirstLine;
}

function centroidPointFirstLine(x, y) {
  centroidStream.point = centroidPointLine;
  centroidPoint(x0 = x, y0 = y);
}

function centroidPointLine(x, y) {
  var dx = x - x0,
      dy = y - y0,
      z = (0, _math.sqrt)(dx * dx + dy * dy);
  X1 += z * (x0 + x) / 2;
  Y1 += z * (y0 + y) / 2;
  Z1 += z;
  centroidPoint(x0 = x, y0 = y);
}

function centroidLineEnd() {
  centroidStream.point = centroidPoint;
}

function centroidRingStart() {
  centroidStream.point = centroidPointFirstRing;
}

function centroidRingEnd() {
  centroidPointRing(x00, y00);
}

function centroidPointFirstRing(x, y) {
  centroidStream.point = centroidPointRing;
  centroidPoint(x00 = x0 = x, y00 = y0 = y);
}

function centroidPointRing(x, y) {
  var dx = x - x0,
      dy = y - y0,
      z = (0, _math.sqrt)(dx * dx + dy * dy);
  X1 += z * (x0 + x) / 2;
  Y1 += z * (y0 + y) / 2;
  Z1 += z;
  z = y0 * x - x0 * y;
  X2 += z * (x0 + x);
  Y2 += z * (y0 + y);
  Z2 += z * 3;
  centroidPoint(x0 = x, y0 = y);
}

var _default = centroidStream;
exports.default = _default;

},{"../math.js":158}],163:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PathContext;

var _math = require("../math.js");

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PathContext(context) {
  this._context = context;
}

PathContext.prototype = {
  _radius: 4.5,
  pointRadius: function (_) {
    return this._radius = _, this;
  },
  polygonStart: function () {
    this._line = 0;
  },
  polygonEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line === 0) this._context.closePath();
    this._point = NaN;
  },
  point: function (x, y) {
    switch (this._point) {
      case 0:
        {
          this._context.moveTo(x, y);

          this._point = 1;
          break;
        }

      case 1:
        {
          this._context.lineTo(x, y);

          break;
        }

      default:
        {
          this._context.moveTo(x + this._radius, y);

          this._context.arc(x, y, this._radius, 0, _math.tau);

          break;
        }
    }
  },
  result: _noop.default
};

},{"../math.js":158,"../noop.js":159}],164:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _identity = _interopRequireDefault(require("../identity.js"));

var _stream = _interopRequireDefault(require("../stream.js"));

var _area = _interopRequireDefault(require("./area.js"));

var _bounds = _interopRequireDefault(require("./bounds.js"));

var _centroid = _interopRequireDefault(require("./centroid.js"));

var _context = _interopRequireDefault(require("./context.js"));

var _measure = _interopRequireDefault(require("./measure.js"));

var _string = _interopRequireDefault(require("./string.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(projection, context) {
  var pointRadius = 4.5,
      projectionStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      (0, _stream.default)(object, projectionStream(contextStream));
    }

    return contextStream.result();
  }

  path.area = function (object) {
    (0, _stream.default)(object, projectionStream(_area.default));
    return _area.default.result();
  };

  path.measure = function (object) {
    (0, _stream.default)(object, projectionStream(_measure.default));
    return _measure.default.result();
  };

  path.bounds = function (object) {
    (0, _stream.default)(object, projectionStream(_bounds.default));
    return _bounds.default.result();
  };

  path.centroid = function (object) {
    (0, _stream.default)(object, projectionStream(_centroid.default));
    return _centroid.default.result();
  };

  path.projection = function (_) {
    return arguments.length ? (projectionStream = _ == null ? (projection = null, _identity.default) : (projection = _).stream, path) : projection;
  };

  path.context = function (_) {
    if (!arguments.length) return context;
    contextStream = _ == null ? (context = null, new _string.default()) : new _context.default(context = _);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function (_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(projection).context(context);
}

},{"../identity.js":154,"../stream.js":192,"./area.js":160,"./bounds.js":161,"./centroid.js":162,"./context.js":163,"./measure.js":165,"./string.js":166}],165:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _adder = _interopRequireDefault(require("../adder.js"));

var _math = require("../math.js");

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lengthSum = (0, _adder.default)(),
    lengthRing,
    x00,
    y00,
    x0,
    y0;
var lengthStream = {
  point: _noop.default,
  lineStart: function () {
    lengthStream.point = lengthPointFirst;
  },
  lineEnd: function () {
    if (lengthRing) lengthPoint(x00, y00);
    lengthStream.point = _noop.default;
  },
  polygonStart: function () {
    lengthRing = true;
  },
  polygonEnd: function () {
    lengthRing = null;
  },
  result: function () {
    var length = +lengthSum;
    lengthSum.reset();
    return length;
  }
};

function lengthPointFirst(x, y) {
  lengthStream.point = lengthPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function lengthPoint(x, y) {
  x0 -= x, y0 -= y;
  lengthSum.add((0, _math.sqrt)(x0 * x0 + y0 * y0));
  x0 = x, y0 = y;
}

var _default = lengthStream;
exports.default = _default;

},{"../adder.js":135,"../math.js":158,"../noop.js":159}],166:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PathString;

function PathString() {
  this._string = [];
}

PathString.prototype = {
  _radius: 4.5,
  _circle: circle(4.5),
  pointRadius: function (_) {
    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
    return this;
  },
  polygonStart: function () {
    this._line = 0;
  },
  polygonEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line === 0) this._string.push("Z");
    this._point = NaN;
  },
  point: function (x, y) {
    switch (this._point) {
      case 0:
        {
          this._string.push("M", x, ",", y);

          this._point = 1;
          break;
        }

      case 1:
        {
          this._string.push("L", x, ",", y);

          break;
        }

      default:
        {
          if (this._circle == null) this._circle = circle(this._radius);

          this._string.push("M", x, ",", y, this._circle);

          break;
        }
    }
  },
  result: function () {
    if (this._string.length) {
      var result = this._string.join("");

      this._string = [];
      return result;
    } else {
      return null;
    }
  }
};

function circle(radius) {
  return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
}

},{}],167:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _math = require("./math.js");

function _default(a, b) {
  return (0, _math.abs)(a[0] - b[0]) < _math.epsilon && (0, _math.abs)(a[1] - b[1]) < _math.epsilon;
}

},{"./math.js":158}],168:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _adder = _interopRequireDefault(require("./adder.js"));

var _cartesian = require("./cartesian.js");

var _math = require("./math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sum = (0, _adder.default)();

function longitude(point) {
  if ((0, _math.abs)(point[0]) <= _math.pi) return point[0];else return (0, _math.sign)(point[0]) * (((0, _math.abs)(point[0]) + _math.pi) % _math.tau - _math.pi);
}

function _default(polygon, point) {
  var lambda = longitude(point),
      phi = point[1],
      sinPhi = (0, _math.sin)(phi),
      normal = [(0, _math.sin)(lambda), -(0, _math.cos)(lambda), 0],
      angle = 0,
      winding = 0;
  sum.reset();
  if (sinPhi === 1) phi = _math.halfPi + _math.epsilon;else if (sinPhi === -1) phi = -_math.halfPi - _math.epsilon;

  for (var i = 0, n = polygon.length; i < n; ++i) {
    if (!(m = (ring = polygon[i]).length)) continue;
    var ring,
        m,
        point0 = ring[m - 1],
        lambda0 = longitude(point0),
        phi0 = point0[1] / 2 + _math.quarterPi,
        sinPhi0 = (0, _math.sin)(phi0),
        cosPhi0 = (0, _math.cos)(phi0);

    for (var j = 0; j < m; ++j, lambda0 = lambda1, sinPhi0 = sinPhi1, cosPhi0 = cosPhi1, point0 = point1) {
      var point1 = ring[j],
          lambda1 = longitude(point1),
          phi1 = point1[1] / 2 + _math.quarterPi,
          sinPhi1 = (0, _math.sin)(phi1),
          cosPhi1 = (0, _math.cos)(phi1),
          delta = lambda1 - lambda0,
          sign = delta >= 0 ? 1 : -1,
          absDelta = sign * delta,
          antimeridian = absDelta > _math.pi,
          k = sinPhi0 * sinPhi1;
      sum.add((0, _math.atan2)(k * sign * (0, _math.sin)(absDelta), cosPhi0 * cosPhi1 + k * (0, _math.cos)(absDelta)));
      angle += antimeridian ? delta + sign * _math.tau : delta; // Are the longitudes either side of the point’s meridian (lambda),
      // and are the latitudes smaller than the parallel (phi)?

      if (antimeridian ^ lambda0 >= lambda ^ lambda1 >= lambda) {
        var arc = (0, _cartesian.cartesianCross)((0, _cartesian.cartesian)(point0), (0, _cartesian.cartesian)(point1));
        (0, _cartesian.cartesianNormalizeInPlace)(arc);
        var intersection = (0, _cartesian.cartesianCross)(normal, arc);
        (0, _cartesian.cartesianNormalizeInPlace)(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * (0, _math.asin)(intersection[2]);

        if (phi > phiArc || phi === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }
    }
  } // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a lambda
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.


  return (angle < -_math.epsilon || angle < _math.epsilon && sum < -_math.epsilon) ^ winding & 1;
}

},{"./adder.js":135,"./cartesian.js":138,"./math.js":158}],169:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _conicEqualArea = _interopRequireDefault(require("./conicEqualArea.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return (0, _conicEqualArea.default)().parallels([29.5, 45.5]).scale(1070).translate([480, 250]).rotate([96, 0]).center([-0.6, 38.7]);
}

},{"./conicEqualArea.js":176}],170:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _math = require("../math.js");

var _albers = _interopRequireDefault(require("./albers.js"));

var _conicEqualArea = _interopRequireDefault(require("./conicEqualArea.js"));

var _fit = require("./fit.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  var n = streams.length;
  return {
    point: function (x, y) {
      var i = -1;

      while (++i < n) streams[i].point(x, y);
    },
    sphere: function () {
      var i = -1;

      while (++i < n) streams[i].sphere();
    },
    lineStart: function () {
      var i = -1;

      while (++i < n) streams[i].lineStart();
    },
    lineEnd: function () {
      var i = -1;

      while (++i < n) streams[i].lineEnd();
    },
    polygonStart: function () {
      var i = -1;

      while (++i < n) streams[i].polygonStart();
    },
    polygonEnd: function () {
      var i = -1;

      while (++i < n) streams[i].polygonEnd();
    }
  };
} // A composite projection for the United States, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers


function _default() {
  var cache,
      cacheStream,
      lower48 = (0, _albers.default)(),
      lower48Point,
      alaska = (0, _conicEqualArea.default)().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65]),
      alaskaPoint,
      // EPSG:3338
  hawaii = (0, _conicEqualArea.default)().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18]),
      hawaiiPoint,
      // ESRI:102007
  point,
      pointStream = {
    point: function (x, y) {
      point = [x, y];
    }
  };

  function albersUsa(coordinates) {
    var x = coordinates[0],
        y = coordinates[1];
    return point = null, (lower48Point.point(x, y), point) || (alaskaPoint.point(x, y), point) || (hawaiiPoint.point(x, y), point);
  }

  albersUsa.invert = function (coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? alaska : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? hawaii : lower48).invert(coordinates);
  };

  albersUsa.stream = function (stream) {
    return cache && cacheStream === stream ? cache : cache = multiplex([lower48.stream(cacheStream = stream), alaska.stream(stream), hawaii.stream(stream)]);
  };

  albersUsa.precision = function (_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_), alaska.precision(_), hawaii.precision(_);
    return reset();
  };

  albersUsa.scale = function (_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_), alaska.scale(_ * 0.35), hawaii.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function (_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(),
        x = +_[0],
        y = +_[1];
    lower48Point = lower48.translate(_).clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]]).stream(pointStream);
    alaskaPoint = alaska.translate([x - 0.307 * k, y + 0.201 * k]).clipExtent([[x - 0.425 * k + _math.epsilon, y + 0.120 * k + _math.epsilon], [x - 0.214 * k - _math.epsilon, y + 0.234 * k - _math.epsilon]]).stream(pointStream);
    hawaiiPoint = hawaii.translate([x - 0.205 * k, y + 0.212 * k]).clipExtent([[x - 0.214 * k + _math.epsilon, y + 0.166 * k + _math.epsilon], [x - 0.115 * k - _math.epsilon, y + 0.234 * k - _math.epsilon]]).stream(pointStream);
    return reset();
  };

  albersUsa.fitExtent = function (extent, object) {
    return (0, _fit.fitExtent)(albersUsa, extent, object);
  };

  albersUsa.fitSize = function (size, object) {
    return (0, _fit.fitSize)(albersUsa, size, object);
  };

  albersUsa.fitWidth = function (width, object) {
    return (0, _fit.fitWidth)(albersUsa, width, object);
  };

  albersUsa.fitHeight = function (height, object) {
    return (0, _fit.fitHeight)(albersUsa, height, object);
  };

  function reset() {
    cache = cacheStream = null;
    return albersUsa;
  }

  return albersUsa.scale(1070);
}

},{"../math.js":158,"./albers.js":169,"./conicEqualArea.js":176,"./fit.js":181}],171:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.azimuthalRaw = azimuthalRaw;
exports.azimuthalInvert = azimuthalInvert;

var _math = require("../math.js");

function azimuthalRaw(scale) {
  return function (x, y) {
    var cx = (0, _math.cos)(x),
        cy = (0, _math.cos)(y),
        k = scale(cx * cy);
    return [k * cy * (0, _math.sin)(x), k * (0, _math.sin)(y)];
  };
}

function azimuthalInvert(angle) {
  return function (x, y) {
    var z = (0, _math.sqrt)(x * x + y * y),
        c = angle(z),
        sc = (0, _math.sin)(c),
        cc = (0, _math.cos)(c);
    return [(0, _math.atan2)(x * sc, z * cc), (0, _math.asin)(z && y * sc / z)];
  };
}

},{"../math.js":158}],172:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.azimuthalEqualAreaRaw = void 0;

var _math = require("../math.js");

var _azimuthal = require("./azimuthal.js");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var azimuthalEqualAreaRaw = (0, _azimuthal.azimuthalRaw)(function (cxcy) {
  return (0, _math.sqrt)(2 / (1 + cxcy));
});
exports.azimuthalEqualAreaRaw = azimuthalEqualAreaRaw;
azimuthalEqualAreaRaw.invert = (0, _azimuthal.azimuthalInvert)(function (z) {
  return 2 * (0, _math.asin)(z / 2);
});

function _default() {
  return (0, _index.default)(azimuthalEqualAreaRaw).scale(124.75).clipAngle(180 - 1e-3);
}

},{"../math.js":158,"./azimuthal.js":171,"./index.js":184}],173:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.azimuthalEquidistantRaw = void 0;

var _math = require("../math.js");

var _azimuthal = require("./azimuthal.js");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var azimuthalEquidistantRaw = (0, _azimuthal.azimuthalRaw)(function (c) {
  return (c = (0, _math.acos)(c)) && c / (0, _math.sin)(c);
});
exports.azimuthalEquidistantRaw = azimuthalEquidistantRaw;
azimuthalEquidistantRaw.invert = (0, _azimuthal.azimuthalInvert)(function (z) {
  return z;
});

function _default() {
  return (0, _index.default)(azimuthalEquidistantRaw).scale(79.4188).clipAngle(180 - 1e-3);
}

},{"../math.js":158,"./azimuthal.js":171,"./index.js":184}],174:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conicProjection = conicProjection;

var _math = require("../math.js");

var _index = require("./index.js");

function conicProjection(projectAt) {
  var phi0 = 0,
      phi1 = _math.pi / 3,
      m = (0, _index.projectionMutator)(projectAt),
      p = m(phi0, phi1);

  p.parallels = function (_) {
    return arguments.length ? m(phi0 = _[0] * _math.radians, phi1 = _[1] * _math.radians) : [phi0 * _math.degrees, phi1 * _math.degrees];
  };

  return p;
}

},{"../math.js":158,"./index.js":184}],175:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conicConformalRaw = conicConformalRaw;
exports.default = _default;

var _math = require("../math.js");

var _conic = require("./conic.js");

var _mercator = require("./mercator.js");

function tany(y) {
  return (0, _math.tan)((_math.halfPi + y) / 2);
}

function conicConformalRaw(y0, y1) {
  var cy0 = (0, _math.cos)(y0),
      n = y0 === y1 ? (0, _math.sin)(y0) : (0, _math.log)(cy0 / (0, _math.cos)(y1)) / (0, _math.log)(tany(y1) / tany(y0)),
      f = cy0 * (0, _math.pow)(tany(y0), n) / n;
  if (!n) return _mercator.mercatorRaw;

  function project(x, y) {
    if (f > 0) {
      if (y < -_math.halfPi + _math.epsilon) y = -_math.halfPi + _math.epsilon;
    } else {
      if (y > _math.halfPi - _math.epsilon) y = _math.halfPi - _math.epsilon;
    }

    var r = f / (0, _math.pow)(tany(y), n);
    return [r * (0, _math.sin)(n * x), f - r * (0, _math.cos)(n * x)];
  }

  project.invert = function (x, y) {
    var fy = f - y,
        r = (0, _math.sign)(n) * (0, _math.sqrt)(x * x + fy * fy),
        l = (0, _math.atan2)(x, (0, _math.abs)(fy)) * (0, _math.sign)(fy);
    if (fy * n < 0) l -= _math.pi * (0, _math.sign)(x) * (0, _math.sign)(fy);
    return [l / n, 2 * (0, _math.atan)((0, _math.pow)(f / r, 1 / n)) - _math.halfPi];
  };

  return project;
}

function _default() {
  return (0, _conic.conicProjection)(conicConformalRaw).scale(109.5).parallels([30, 30]);
}

},{"../math.js":158,"./conic.js":174,"./mercator.js":185}],176:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conicEqualAreaRaw = conicEqualAreaRaw;
exports.default = _default;

var _math = require("../math.js");

var _conic = require("./conic.js");

var _cylindricalEqualArea = require("./cylindricalEqualArea.js");

function conicEqualAreaRaw(y0, y1) {
  var sy0 = (0, _math.sin)(y0),
      n = (sy0 + (0, _math.sin)(y1)) / 2; // Are the parallels symmetrical around the Equator?

  if ((0, _math.abs)(n) < _math.epsilon) return (0, _cylindricalEqualArea.cylindricalEqualAreaRaw)(y0);
  var c = 1 + sy0 * (2 * n - sy0),
      r0 = (0, _math.sqrt)(c) / n;

  function project(x, y) {
    var r = (0, _math.sqrt)(c - 2 * n * (0, _math.sin)(y)) / n;
    return [r * (0, _math.sin)(x *= n), r0 - r * (0, _math.cos)(x)];
  }

  project.invert = function (x, y) {
    var r0y = r0 - y,
        l = (0, _math.atan2)(x, (0, _math.abs)(r0y)) * (0, _math.sign)(r0y);
    if (r0y * n < 0) l -= _math.pi * (0, _math.sign)(x) * (0, _math.sign)(r0y);
    return [l / n, (0, _math.asin)((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

function _default() {
  return (0, _conic.conicProjection)(conicEqualAreaRaw).scale(155.424).center([0, 33.6442]);
}

},{"../math.js":158,"./conic.js":174,"./cylindricalEqualArea.js":178}],177:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conicEquidistantRaw = conicEquidistantRaw;
exports.default = _default;

var _math = require("../math.js");

var _conic = require("./conic.js");

var _equirectangular = require("./equirectangular.js");

function conicEquidistantRaw(y0, y1) {
  var cy0 = (0, _math.cos)(y0),
      n = y0 === y1 ? (0, _math.sin)(y0) : (cy0 - (0, _math.cos)(y1)) / (y1 - y0),
      g = cy0 / n + y0;
  if ((0, _math.abs)(n) < _math.epsilon) return _equirectangular.equirectangularRaw;

  function project(x, y) {
    var gy = g - y,
        nx = n * x;
    return [gy * (0, _math.sin)(nx), g - gy * (0, _math.cos)(nx)];
  }

  project.invert = function (x, y) {
    var gy = g - y,
        l = (0, _math.atan2)(x, (0, _math.abs)(gy)) * (0, _math.sign)(gy);
    if (gy * n < 0) l -= _math.pi * (0, _math.sign)(x) * (0, _math.sign)(gy);
    return [l / n, g - (0, _math.sign)(n) * (0, _math.sqrt)(x * x + gy * gy)];
  };

  return project;
}

function _default() {
  return (0, _conic.conicProjection)(conicEquidistantRaw).scale(131.154).center([0, 13.9389]);
}

},{"../math.js":158,"./conic.js":174,"./equirectangular.js":180}],178:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cylindricalEqualAreaRaw = cylindricalEqualAreaRaw;

var _math = require("../math.js");

function cylindricalEqualAreaRaw(phi0) {
  var cosPhi0 = (0, _math.cos)(phi0);

  function forward(lambda, phi) {
    return [lambda * cosPhi0, (0, _math.sin)(phi) / cosPhi0];
  }

  forward.invert = function (x, y) {
    return [x / cosPhi0, (0, _math.asin)(y * cosPhi0)];
  };

  return forward;
}

},{"../math.js":158}],179:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equalEarthRaw = equalEarthRaw;
exports.default = _default;

var _index = _interopRequireDefault(require("./index.js"));

var _math = require("../math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var A1 = 1.340264,
    A2 = -0.081106,
    A3 = 0.000893,
    A4 = 0.003796,
    M = (0, _math.sqrt)(3) / 2,
    iterations = 12;

function equalEarthRaw(lambda, phi) {
  var l = (0, _math.asin)(M * (0, _math.sin)(phi)),
      l2 = l * l,
      l6 = l2 * l2 * l2;
  return [lambda * (0, _math.cos)(l) / (M * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2))), l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2))];
}

equalEarthRaw.invert = function (x, y) {
  var l = y,
      l2 = l * l,
      l6 = l2 * l2 * l2;

  for (var i = 0, delta, fy, fpy; i < iterations; ++i) {
    fy = l * (A1 + A2 * l2 + l6 * (A3 + A4 * l2)) - y;
    fpy = A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2);
    l -= delta = fy / fpy, l2 = l * l, l6 = l2 * l2 * l2;
    if ((0, _math.abs)(delta) < _math.epsilon2) break;
  }

  return [M * x * (A1 + 3 * A2 * l2 + l6 * (7 * A3 + 9 * A4 * l2)) / (0, _math.cos)(l), (0, _math.asin)((0, _math.sin)(l) / M)];
};

function _default() {
  return (0, _index.default)(equalEarthRaw).scale(177.158);
}

},{"../math.js":158,"./index.js":184}],180:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equirectangularRaw = equirectangularRaw;
exports.default = _default;

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function equirectangularRaw(lambda, phi) {
  return [lambda, phi];
}

equirectangularRaw.invert = equirectangularRaw;

function _default() {
  return (0, _index.default)(equirectangularRaw).scale(152.63);
}

},{"./index.js":184}],181:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fitExtent = fitExtent;
exports.fitSize = fitSize;
exports.fitWidth = fitWidth;
exports.fitHeight = fitHeight;

var _stream = _interopRequireDefault(require("../stream.js"));

var _bounds = _interopRequireDefault(require("../path/bounds.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fit(projection, fitBounds, object) {
  var clip = projection.clipExtent && projection.clipExtent();
  projection.scale(150).translate([0, 0]);
  if (clip != null) projection.clipExtent(null);
  (0, _stream.default)(object, projection.stream(_bounds.default));
  fitBounds(_bounds.default.result());
  if (clip != null) projection.clipExtent(clip);
  return projection;
}

function fitExtent(projection, extent, object) {
  return fit(projection, function (b) {
    var w = extent[1][0] - extent[0][0],
        h = extent[1][1] - extent[0][1],
        k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
        x = +extent[0][0] + (w - k * (b[1][0] + b[0][0])) / 2,
        y = +extent[0][1] + (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

function fitWidth(projection, width, object) {
  return fit(projection, function (b) {
    var w = +width,
        k = w / (b[1][0] - b[0][0]),
        x = (w - k * (b[1][0] + b[0][0])) / 2,
        y = -k * b[0][1];
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

function fitHeight(projection, height, object) {
  return fit(projection, function (b) {
    var h = +height,
        k = h / (b[1][1] - b[0][1]),
        x = -k * b[0][0],
        y = (h - k * (b[1][1] + b[0][1])) / 2;
    projection.scale(150 * k).translate([x, y]);
  }, object);
}

},{"../path/bounds.js":161,"../stream.js":192}],182:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gnomonicRaw = gnomonicRaw;
exports.default = _default;

var _math = require("../math.js");

var _azimuthal = require("./azimuthal.js");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function gnomonicRaw(x, y) {
  var cy = (0, _math.cos)(y),
      k = (0, _math.cos)(x) * cy;
  return [cy * (0, _math.sin)(x) / k, (0, _math.sin)(y) / k];
}

gnomonicRaw.invert = (0, _azimuthal.azimuthalInvert)(_math.atan);

function _default() {
  return (0, _index.default)(gnomonicRaw).scale(144.049).clipAngle(60);
}

},{"../math.js":158,"./azimuthal.js":171,"./index.js":184}],183:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _rectangle = _interopRequireDefault(require("../clip/rectangle.js"));

var _identity = _interopRequireDefault(require("../identity.js"));

var _transform = require("../transform.js");

var _fit = require("./fit.js");

var _math = require("../math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var k = 1,
      tx = 0,
      ty = 0,
      sx = 1,
      sy = 1,
      // scale, translate and reflect
  alpha = 0,
      ca,
      sa,
      // angle
  x0 = null,
      y0,
      x1,
      y1,
      // clip extent
  kx = 1,
      ky = 1,
      transform = (0, _transform.transformer)({
    point: function (x, y) {
      var p = projection([x, y]);
      this.stream.point(p[0], p[1]);
    }
  }),
      postclip = _identity.default,
      cache,
      cacheStream;

  function reset() {
    kx = k * sx;
    ky = k * sy;
    cache = cacheStream = null;
    return projection;
  }

  function projection(p) {
    var x = p[0] * kx,
        y = p[1] * ky;

    if (alpha) {
      var t = y * ca - x * sa;
      x = x * ca + y * sa;
      y = t;
    }

    return [x + tx, y + ty];
  }

  projection.invert = function (p) {
    var x = p[0] - tx,
        y = p[1] - ty;

    if (alpha) {
      var t = y * ca + x * sa;
      x = x * ca - y * sa;
      y = t;
    }

    return [x / kx, y / ky];
  };

  projection.stream = function (stream) {
    return cache && cacheStream === stream ? cache : cache = transform(postclip(cacheStream = stream));
  };

  projection.postclip = function (_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };

  projection.clipExtent = function (_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, _identity.default) : (0, _rectangle.default)(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function (_) {
    return arguments.length ? (k = +_, reset()) : k;
  };

  projection.translate = function (_) {
    return arguments.length ? (tx = +_[0], ty = +_[1], reset()) : [tx, ty];
  };

  projection.angle = function (_) {
    return arguments.length ? (alpha = _ % 360 * _math.radians, sa = (0, _math.sin)(alpha), ca = (0, _math.cos)(alpha), reset()) : alpha * _math.degrees;
  };

  projection.reflectX = function (_) {
    return arguments.length ? (sx = _ ? -1 : 1, reset()) : sx < 0;
  };

  projection.reflectY = function (_) {
    return arguments.length ? (sy = _ ? -1 : 1, reset()) : sy < 0;
  };

  projection.fitExtent = function (extent, object) {
    return (0, _fit.fitExtent)(projection, extent, object);
  };

  projection.fitSize = function (size, object) {
    return (0, _fit.fitSize)(projection, size, object);
  };

  projection.fitWidth = function (width, object) {
    return (0, _fit.fitWidth)(projection, width, object);
  };

  projection.fitHeight = function (height, object) {
    return (0, _fit.fitHeight)(projection, height, object);
  };

  return projection;
}

},{"../clip/rectangle.js":147,"../identity.js":154,"../math.js":158,"../transform.js":193,"./fit.js":181}],184:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = projection;
exports.projectionMutator = projectionMutator;

var _antimeridian = _interopRequireDefault(require("../clip/antimeridian.js"));

var _circle = _interopRequireDefault(require("../clip/circle.js"));

var _rectangle = _interopRequireDefault(require("../clip/rectangle.js"));

var _compose = _interopRequireDefault(require("../compose.js"));

var _identity = _interopRequireDefault(require("../identity.js"));

var _math = require("../math.js");

var _rotation = require("../rotation.js");

var _transform = require("../transform.js");

var _fit = require("./fit.js");

var _resample = _interopRequireDefault(require("./resample.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transformRadians = (0, _transform.transformer)({
  point: function (x, y) {
    this.stream.point(x * _math.radians, y * _math.radians);
  }
});

function transformRotate(rotate) {
  return (0, _transform.transformer)({
    point: function (x, y) {
      var r = rotate(x, y);
      return this.stream.point(r[0], r[1]);
    }
  });
}

function scaleTranslate(k, dx, dy, sx, sy) {
  function transform(x, y) {
    x *= sx;
    y *= sy;
    return [dx + k * x, dy - k * y];
  }

  transform.invert = function (x, y) {
    return [(x - dx) / k * sx, (dy - y) / k * sy];
  };

  return transform;
}

function scaleTranslateRotate(k, dx, dy, sx, sy, alpha) {
  var cosAlpha = (0, _math.cos)(alpha),
      sinAlpha = (0, _math.sin)(alpha),
      a = cosAlpha * k,
      b = sinAlpha * k,
      ai = cosAlpha / k,
      bi = sinAlpha / k,
      ci = (sinAlpha * dy - cosAlpha * dx) / k,
      fi = (sinAlpha * dx + cosAlpha * dy) / k;

  function transform(x, y) {
    x *= sx;
    y *= sy;
    return [a * x - b * y + dx, dy - b * x - a * y];
  }

  transform.invert = function (x, y) {
    return [sx * (ai * x - bi * y + ci), sy * (fi - bi * x - ai * y)];
  };

  return transform;
}

function projection(project) {
  return projectionMutator(function () {
    return project;
  })();
}

function projectionMutator(projectAt) {
  var project,
      k = 150,
      // scale
  x = 480,
      y = 250,
      // translate
  lambda = 0,
      phi = 0,
      // center
  deltaLambda = 0,
      deltaPhi = 0,
      deltaGamma = 0,
      rotate,
      // pre-rotate
  alpha = 0,
      // post-rotate angle
  sx = 1,
      // reflectX
  sy = 1,
      // reflectX
  theta = null,
      preclip = _antimeridian.default,
      // pre-clip angle
  x0 = null,
      y0,
      x1,
      y1,
      postclip = _identity.default,
      // post-clip extent
  delta2 = 0.5,
      // precision
  projectResample,
      projectTransform,
      projectRotateTransform,
      cache,
      cacheStream;

  function projection(point) {
    return projectRotateTransform(point[0] * _math.radians, point[1] * _math.radians);
  }

  function invert(point) {
    point = projectRotateTransform.invert(point[0], point[1]);
    return point && [point[0] * _math.degrees, point[1] * _math.degrees];
  }

  projection.stream = function (stream) {
    return cache && cacheStream === stream ? cache : cache = transformRadians(transformRotate(rotate)(preclip(projectResample(postclip(cacheStream = stream)))));
  };

  projection.preclip = function (_) {
    return arguments.length ? (preclip = _, theta = undefined, reset()) : preclip;
  };

  projection.postclip = function (_) {
    return arguments.length ? (postclip = _, x0 = y0 = x1 = y1 = null, reset()) : postclip;
  };

  projection.clipAngle = function (_) {
    return arguments.length ? (preclip = +_ ? (0, _circle.default)(theta = _ * _math.radians) : (theta = null, _antimeridian.default), reset()) : theta * _math.degrees;
  };

  projection.clipExtent = function (_) {
    return arguments.length ? (postclip = _ == null ? (x0 = y0 = x1 = y1 = null, _identity.default) : (0, _rectangle.default)(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reset()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  projection.scale = function (_) {
    return arguments.length ? (k = +_, recenter()) : k;
  };

  projection.translate = function (_) {
    return arguments.length ? (x = +_[0], y = +_[1], recenter()) : [x, y];
  };

  projection.center = function (_) {
    return arguments.length ? (lambda = _[0] % 360 * _math.radians, phi = _[1] % 360 * _math.radians, recenter()) : [lambda * _math.degrees, phi * _math.degrees];
  };

  projection.rotate = function (_) {
    return arguments.length ? (deltaLambda = _[0] % 360 * _math.radians, deltaPhi = _[1] % 360 * _math.radians, deltaGamma = _.length > 2 ? _[2] % 360 * _math.radians : 0, recenter()) : [deltaLambda * _math.degrees, deltaPhi * _math.degrees, deltaGamma * _math.degrees];
  };

  projection.angle = function (_) {
    return arguments.length ? (alpha = _ % 360 * _math.radians, recenter()) : alpha * _math.degrees;
  };

  projection.reflectX = function (_) {
    return arguments.length ? (sx = _ ? -1 : 1, recenter()) : sx < 0;
  };

  projection.reflectY = function (_) {
    return arguments.length ? (sy = _ ? -1 : 1, recenter()) : sy < 0;
  };

  projection.precision = function (_) {
    return arguments.length ? (projectResample = (0, _resample.default)(projectTransform, delta2 = _ * _), reset()) : (0, _math.sqrt)(delta2);
  };

  projection.fitExtent = function (extent, object) {
    return (0, _fit.fitExtent)(projection, extent, object);
  };

  projection.fitSize = function (size, object) {
    return (0, _fit.fitSize)(projection, size, object);
  };

  projection.fitWidth = function (width, object) {
    return (0, _fit.fitWidth)(projection, width, object);
  };

  projection.fitHeight = function (height, object) {
    return (0, _fit.fitHeight)(projection, height, object);
  };

  function recenter() {
    var center = scaleTranslateRotate(k, 0, 0, sx, sy, alpha).apply(null, project(lambda, phi)),
        transform = (alpha ? scaleTranslateRotate : scaleTranslate)(k, x - center[0], y - center[1], sx, sy, alpha);
    rotate = (0, _rotation.rotateRadians)(deltaLambda, deltaPhi, deltaGamma);
    projectTransform = (0, _compose.default)(project, transform);
    projectRotateTransform = (0, _compose.default)(rotate, projectTransform);
    projectResample = (0, _resample.default)(projectTransform, delta2);
    return reset();
  }

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return function () {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return recenter();
  };
}

},{"../clip/antimeridian.js":141,"../clip/circle.js":143,"../clip/rectangle.js":147,"../compose.js":149,"../identity.js":154,"../math.js":158,"../rotation.js":191,"../transform.js":193,"./fit.js":181,"./resample.js":188}],185:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mercatorRaw = mercatorRaw;
exports.default = _default;
exports.mercatorProjection = mercatorProjection;

var _math = require("../math.js");

var _rotation = _interopRequireDefault(require("../rotation.js"));

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mercatorRaw(lambda, phi) {
  return [lambda, (0, _math.log)((0, _math.tan)((_math.halfPi + phi) / 2))];
}

mercatorRaw.invert = function (x, y) {
  return [x, 2 * (0, _math.atan)((0, _math.exp)(y)) - _math.halfPi];
};

function _default() {
  return mercatorProjection(mercatorRaw).scale(961 / _math.tau);
}

function mercatorProjection(project) {
  var m = (0, _index.default)(project),
      center = m.center,
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null,
      y0,
      x1,
      y1; // clip extent

  m.scale = function (_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function (_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.center = function (_) {
    return arguments.length ? (center(_), reclip()) : center();
  };

  m.clipExtent = function (_) {
    return arguments.length ? (_ == null ? x0 = y0 = x1 = y1 = null : (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]), reclip()) : x0 == null ? null : [[x0, y0], [x1, y1]];
  };

  function reclip() {
    var k = _math.pi * scale(),
        t = m((0, _rotation.default)(m.rotate()).invert([0, 0]));
    return clipExtent(x0 == null ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]] : project === mercatorRaw ? [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]] : [[x0, Math.max(t[1] - k, y0)], [x1, Math.min(t[1] + k, y1)]]);
  }

  return reclip();
}

},{"../math.js":158,"../rotation.js":191,"./index.js":184}],186:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.naturalEarth1Raw = naturalEarth1Raw;
exports.default = _default;

var _index = _interopRequireDefault(require("./index.js"));

var _math = require("../math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function naturalEarth1Raw(lambda, phi) {
  var phi2 = phi * phi,
      phi4 = phi2 * phi2;
  return [lambda * (0.8707 - 0.131979 * phi2 + phi4 * (-0.013791 + phi4 * (0.003971 * phi2 - 0.001529 * phi4))), phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4)))];
}

naturalEarth1Raw.invert = function (x, y) {
  var phi = y,
      i = 25,
      delta;

  do {
    var phi2 = phi * phi,
        phi4 = phi2 * phi2;
    phi -= delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.015085 * 3 + phi4 * (-0.044475 * 7 + 0.028874 * 9 * phi2 - 0.005916 * 11 * phi4)));
  } while ((0, _math.abs)(delta) > _math.epsilon && --i > 0);

  return [x / (0.8707 + (phi2 = phi * phi) * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2)))), phi];
};

function _default() {
  return (0, _index.default)(naturalEarth1Raw).scale(175.295);
}

},{"../math.js":158,"./index.js":184}],187:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orthographicRaw = orthographicRaw;
exports.default = _default;

var _math = require("../math.js");

var _azimuthal = require("./azimuthal.js");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function orthographicRaw(x, y) {
  return [(0, _math.cos)(y) * (0, _math.sin)(x), (0, _math.sin)(y)];
}

orthographicRaw.invert = (0, _azimuthal.azimuthalInvert)(_math.asin);

function _default() {
  return (0, _index.default)(orthographicRaw).scale(249.5).clipAngle(90 + _math.epsilon);
}

},{"../math.js":158,"./azimuthal.js":171,"./index.js":184}],188:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _cartesian = require("../cartesian.js");

var _math = require("../math.js");

var _transform = require("../transform.js");

var maxDepth = 16,
    // maximum depth of subdivision
cosMinDistance = (0, _math.cos)(30 * _math.radians); // cos(minimum angular distance)

function _default(project, delta2) {
  return +delta2 ? resample(project, delta2) : resampleNone(project);
}

function resampleNone(project) {
  return (0, _transform.transformer)({
    point: function (x, y) {
      x = project(x, y);
      this.stream.point(x[0], x[1]);
    }
  });
}

function resample(project, delta2) {
  function resampleLineTo(x0, y0, lambda0, a0, b0, c0, x1, y1, lambda1, a1, b1, c1, depth, stream) {
    var dx = x1 - x0,
        dy = y1 - y0,
        d2 = dx * dx + dy * dy;

    if (d2 > 4 * delta2 && depth--) {
      var a = a0 + a1,
          b = b0 + b1,
          c = c0 + c1,
          m = (0, _math.sqrt)(a * a + b * b + c * c),
          phi2 = (0, _math.asin)(c /= m),
          lambda2 = (0, _math.abs)((0, _math.abs)(c) - 1) < _math.epsilon || (0, _math.abs)(lambda0 - lambda1) < _math.epsilon ? (lambda0 + lambda1) / 2 : (0, _math.atan2)(b, a),
          p = project(lambda2, phi2),
          x2 = p[0],
          y2 = p[1],
          dx2 = x2 - x0,
          dy2 = y2 - y0,
          dz = dy * dx2 - dx * dy2;

      if (dz * dz / d2 > delta2 // perpendicular projected distance
      || (0, _math.abs)((dx * dx2 + dy * dy2) / d2 - 0.5) > 0.3 // midpoint close to an end
      || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
        // angular distance
        resampleLineTo(x0, y0, lambda0, a0, b0, c0, x2, y2, lambda2, a /= m, b /= m, c, depth, stream);
        stream.point(x2, y2);
        resampleLineTo(x2, y2, lambda2, a, b, c, x1, y1, lambda1, a1, b1, c1, depth, stream);
      }
    }
  }

  return function (stream) {
    var lambda00, x00, y00, a00, b00, c00, // first point
    lambda0, x0, y0, a0, b0, c0; // previous point

    var resampleStream = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function () {
        stream.polygonStart();
        resampleStream.lineStart = ringStart;
      },
      polygonEnd: function () {
        stream.polygonEnd();
        resampleStream.lineStart = lineStart;
      }
    };

    function point(x, y) {
      x = project(x, y);
      stream.point(x[0], x[1]);
    }

    function lineStart() {
      x0 = NaN;
      resampleStream.point = linePoint;
      stream.lineStart();
    }

    function linePoint(lambda, phi) {
      var c = (0, _cartesian.cartesian)([lambda, phi]),
          p = project(lambda, phi);
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x0 = p[0], y0 = p[1], lambda0 = lambda, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
      stream.point(x0, y0);
    }

    function lineEnd() {
      resampleStream.point = point;
      stream.lineEnd();
    }

    function ringStart() {
      lineStart();
      resampleStream.point = ringPoint;
      resampleStream.lineEnd = ringEnd;
    }

    function ringPoint(lambda, phi) {
      linePoint(lambda00 = lambda, phi), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
      resampleStream.point = linePoint;
    }

    function ringEnd() {
      resampleLineTo(x0, y0, lambda0, a0, b0, c0, x00, y00, lambda00, a00, b00, c00, maxDepth, stream);
      resampleStream.lineEnd = lineEnd;
      lineEnd();
    }

    return resampleStream;
  };
}

},{"../cartesian.js":138,"../math.js":158,"../transform.js":193}],189:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stereographicRaw = stereographicRaw;
exports.default = _default;

var _math = require("../math.js");

var _azimuthal = require("./azimuthal.js");

var _index = _interopRequireDefault(require("./index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stereographicRaw(x, y) {
  var cy = (0, _math.cos)(y),
      k = 1 + (0, _math.cos)(x) * cy;
  return [cy * (0, _math.sin)(x) / k, (0, _math.sin)(y) / k];
}

stereographicRaw.invert = (0, _azimuthal.azimuthalInvert)(function (z) {
  return 2 * (0, _math.atan)(z);
});

function _default() {
  return (0, _index.default)(stereographicRaw).scale(250).clipAngle(142);
}

},{"../math.js":158,"./azimuthal.js":171,"./index.js":184}],190:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transverseMercatorRaw = transverseMercatorRaw;
exports.default = _default;

var _math = require("../math.js");

var _mercator = require("./mercator.js");

function transverseMercatorRaw(lambda, phi) {
  return [(0, _math.log)((0, _math.tan)((_math.halfPi + phi) / 2)), -lambda];
}

transverseMercatorRaw.invert = function (x, y) {
  return [-y, 2 * (0, _math.atan)((0, _math.exp)(x)) - _math.halfPi];
};

function _default() {
  var m = (0, _mercator.mercatorProjection)(transverseMercatorRaw),
      center = m.center,
      rotate = m.rotate;

  m.center = function (_) {
    return arguments.length ? center([-_[1], _[0]]) : (_ = center(), [_[1], -_[0]]);
  };

  m.rotate = function (_) {
    return arguments.length ? rotate([_[0], _[1], _.length > 2 ? _[2] + 90 : 90]) : (_ = rotate(), [_[0], _[1], _[2] - 90]);
  };

  return rotate([0, 0, 90]).scale(159.155);
}

},{"../math.js":158,"./mercator.js":185}],191:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotateRadians = rotateRadians;
exports.default = _default;

var _compose = _interopRequireDefault(require("./compose.js"));

var _math = require("./math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rotationIdentity(lambda, phi) {
  return [(0, _math.abs)(lambda) > _math.pi ? lambda + Math.round(-lambda / _math.tau) * _math.tau : lambda, phi];
}

rotationIdentity.invert = rotationIdentity;

function rotateRadians(deltaLambda, deltaPhi, deltaGamma) {
  return (deltaLambda %= _math.tau) ? deltaPhi || deltaGamma ? (0, _compose.default)(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma)) : rotationLambda(deltaLambda) : deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma) : rotationIdentity;
}

function forwardRotationLambda(deltaLambda) {
  return function (lambda, phi) {
    return lambda += deltaLambda, [lambda > _math.pi ? lambda - _math.tau : lambda < -_math.pi ? lambda + _math.tau : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = (0, _math.cos)(deltaPhi),
      sinDeltaPhi = (0, _math.sin)(deltaPhi),
      cosDeltaGamma = (0, _math.cos)(deltaGamma),
      sinDeltaGamma = (0, _math.sin)(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = (0, _math.cos)(phi),
        x = (0, _math.cos)(lambda) * cosPhi,
        y = (0, _math.sin)(lambda) * cosPhi,
        z = (0, _math.sin)(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [(0, _math.atan2)(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi), (0, _math.asin)(k * cosDeltaGamma + y * sinDeltaGamma)];
  }

  rotation.invert = function (lambda, phi) {
    var cosPhi = (0, _math.cos)(phi),
        x = (0, _math.cos)(lambda) * cosPhi,
        y = (0, _math.sin)(lambda) * cosPhi,
        z = (0, _math.sin)(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [(0, _math.atan2)(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi), (0, _math.asin)(k * cosDeltaPhi - x * sinDeltaPhi)];
  };

  return rotation;
}

function _default(rotate) {
  rotate = rotateRadians(rotate[0] * _math.radians, rotate[1] * _math.radians, rotate.length > 2 ? rotate[2] * _math.radians : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * _math.radians, coordinates[1] * _math.radians);
    return coordinates[0] *= _math.degrees, coordinates[1] *= _math.degrees, coordinates;
  }

  forward.invert = function (coordinates) {
    coordinates = rotate.invert(coordinates[0] * _math.radians, coordinates[1] * _math.radians);
    return coordinates[0] *= _math.degrees, coordinates[1] *= _math.degrees, coordinates;
  };

  return forward;
}

},{"./compose.js":149,"./math.js":158}],192:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function streamGeometry(geometry, stream) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, stream);
  }
}

var streamObjectType = {
  Feature: function (object, stream) {
    streamGeometry(object.geometry, stream);
  },
  FeatureCollection: function (object, stream) {
    var features = object.features,
        i = -1,
        n = features.length;

    while (++i < n) streamGeometry(features[i].geometry, stream);
  }
};
var streamGeometryType = {
  Sphere: function (object, stream) {
    stream.sphere();
  },
  Point: function (object, stream) {
    object = object.coordinates;
    stream.point(object[0], object[1], object[2]);
  },
  MultiPoint: function (object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
  },
  LineString: function (object, stream) {
    streamLine(object.coordinates, stream, 0);
  },
  MultiLineString: function (object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) streamLine(coordinates[i], stream, 0);
  },
  Polygon: function (object, stream) {
    streamPolygon(object.coordinates, stream);
  },
  MultiPolygon: function (object, stream) {
    var coordinates = object.coordinates,
        i = -1,
        n = coordinates.length;

    while (++i < n) streamPolygon(coordinates[i], stream);
  },
  GeometryCollection: function (object, stream) {
    var geometries = object.geometries,
        i = -1,
        n = geometries.length;

    while (++i < n) streamGeometry(geometries[i], stream);
  }
};

function streamLine(coordinates, stream, closed) {
  var i = -1,
      n = coordinates.length - closed,
      coordinate;
  stream.lineStart();

  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);

  stream.lineEnd();
}

function streamPolygon(coordinates, stream) {
  var i = -1,
      n = coordinates.length;
  stream.polygonStart();

  while (++i < n) streamLine(coordinates[i], stream, 1);

  stream.polygonEnd();
}

function _default(object, stream) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, stream);
  } else {
    streamGeometry(object, stream);
  }
}

},{}],193:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.transformer = transformer;

function _default(methods) {
  return {
    stream: transformer(methods)
  };
}

function transformer(methods) {
  return function (stream) {
    var s = new TransformStream();

    for (var key in methods) s[key] = methods[key];

    s.stream = stream;
    return s;
  };
}

function TransformStream() {}

TransformStream.prototype = {
  constructor: TransformStream,
  point: function (x, y) {
    this.stream.point(x, y);
  },
  sphere: function () {
    this.stream.sphere();
  },
  lineStart: function () {
    this.stream.lineStart();
  },
  lineEnd: function () {
    this.stream.lineEnd();
  },
  polygonStart: function () {
    this.stream.polygonStart();
  },
  polygonEnd: function () {
    this.stream.polygonEnd();
  }
};

},{}],194:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optional = optional;
exports.required = required;

function optional(f) {
  return f == null ? null : required(f);
}

function required(f) {
  if (typeof f !== "function") throw new Error();
  return f;
}

},{}],195:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = shuffle;
exports.slice = void 0;
var slice = Array.prototype.slice;
exports.slice = slice;

function shuffle(array) {
  var m = array.length,
      t,
      i;

  while (m) {
    i = Math.random() * m-- | 0;
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

},{}],196:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
}

function meanX(children) {
  return children.reduce(meanXReduce, 0) / children.length;
}

function meanXReduce(x, c) {
  return x + c.x;
}

function maxY(children) {
  return 1 + children.reduce(maxYReduce, 0);
}

function maxYReduce(y, c) {
  return Math.max(y, c.y);
}

function leafLeft(node) {
  var children;

  while (children = node.children) node = children[0];

  return node;
}

function leafRight(node) {
  var children;

  while (children = node.children) node = children[children.length - 1];

  return node;
}

function _default() {
  var separation = defaultSeparation,
      dx = 1,
      dy = 1,
      nodeSize = false;

  function cluster(root) {
    var previousNode,
        x = 0; // First walk, computing the initial x & y values.

    root.eachAfter(function (node) {
      var children = node.children;

      if (children) {
        node.x = meanX(children);
        node.y = maxY(children);
      } else {
        node.x = previousNode ? x += separation(node, previousNode) : 0;
        node.y = 0;
        previousNode = node;
      }
    });
    var left = leafLeft(root),
        right = leafRight(root),
        x0 = left.x - separation(left, right) / 2,
        x1 = right.x + separation(right, left) / 2; // Second walk, normalizing x & y to the desired size.

    return root.eachAfter(nodeSize ? function (node) {
      node.x = (node.x - root.x) * dx;
      node.y = (root.y - node.y) * dy;
    } : function (node) {
      node.x = (node.x - x0) / (x1 - x0) * dx;
      node.y = (1 - (root.y ? node.y / root.y : 1)) * dy;
    });
  }

  cluster.separation = function (x) {
    return arguments.length ? (separation = x, cluster) : separation;
  };

  cluster.size = function (x) {
    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], cluster) : nodeSize ? null : [dx, dy];
  };

  cluster.nodeSize = function (x) {
    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], cluster) : nodeSize ? [dx, dy] : null;
  };

  return cluster;
}

},{}],197:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constantZero = constantZero;
exports.default = _default;

function constantZero() {
  return 0;
}

function _default(x) {
  return function () {
    return x;
  };
}

},{}],198:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var node = this,
      nodes = [node];

  while (node = node.parent) {
    nodes.push(node);
  }

  return nodes;
}

},{}],199:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function count(node) {
  var sum = 0,
      children = node.children,
      i = children && children.length;
  if (!i) sum = 1;else while (--i >= 0) sum += children[i].value;
  node.value = sum;
}

function _default() {
  return this.eachAfter(count);
}

},{}],200:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var nodes = [];
  this.each(function (node) {
    nodes.push(node);
  });
  return nodes;
}

},{}],201:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  var node = this,
      current,
      next = [node],
      children,
      i,
      n;

  do {
    current = next.reverse(), next = [];

    while (node = current.pop()) {
      callback(node), children = node.children;
      if (children) for (i = 0, n = children.length; i < n; ++i) {
        next.push(children[i]);
      }
    }
  } while (next.length);

  return this;
}

},{}],202:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  var node = this,
      nodes = [node],
      next = [],
      children,
      i,
      n;

  while (node = nodes.pop()) {
    next.push(node), children = node.children;
    if (children) for (i = 0, n = children.length; i < n; ++i) {
      nodes.push(children[i]);
    }
  }

  while (node = next.pop()) {
    callback(node);
  }

  return this;
}

},{}],203:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  var node = this,
      nodes = [node],
      children,
      i;

  while (node = nodes.pop()) {
    callback(node), children = node.children;
    if (children) for (i = children.length - 1; i >= 0; --i) {
      nodes.push(children[i]);
    }
  }

  return this;
}

},{}],204:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hierarchy;
exports.computeHeight = computeHeight;
exports.Node = Node;

var _count = _interopRequireDefault(require("./count.js"));

var _each = _interopRequireDefault(require("./each.js"));

var _eachBefore = _interopRequireDefault(require("./eachBefore.js"));

var _eachAfter = _interopRequireDefault(require("./eachAfter.js"));

var _sum = _interopRequireDefault(require("./sum.js"));

var _sort = _interopRequireDefault(require("./sort.js"));

var _path = _interopRequireDefault(require("./path.js"));

var _ancestors = _interopRequireDefault(require("./ancestors.js"));

var _descendants = _interopRequireDefault(require("./descendants.js"));

var _leaves = _interopRequireDefault(require("./leaves.js"));

var _links = _interopRequireDefault(require("./links.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hierarchy(data, children) {
  var root = new Node(data),
      valued = +data.value && (root.value = data.value),
      node,
      nodes = [root],
      child,
      childs,
      i,
      n;
  if (children == null) children = defaultChildren;

  while (node = nodes.pop()) {
    if (valued) node.value = +node.data.value;

    if ((childs = children(node.data)) && (n = childs.length)) {
      node.children = new Array(n);

      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new Node(childs[i]));
        child.parent = node;
        child.depth = node.depth + 1;
      }
    }
  }

  return root.eachBefore(computeHeight);
}

function node_copy() {
  return hierarchy(this).eachBefore(copyData);
}

function defaultChildren(d) {
  return d.children;
}

function copyData(node) {
  node.data = node.data.data;
}

function computeHeight(node) {
  var height = 0;

  do node.height = height; while ((node = node.parent) && node.height < ++height);
}

function Node(data) {
  this.data = data;
  this.depth = this.height = 0;
  this.parent = null;
}

Node.prototype = hierarchy.prototype = {
  constructor: Node,
  count: _count.default,
  each: _each.default,
  eachAfter: _eachAfter.default,
  eachBefore: _eachBefore.default,
  sum: _sum.default,
  sort: _sort.default,
  path: _path.default,
  ancestors: _ancestors.default,
  descendants: _descendants.default,
  leaves: _leaves.default,
  links: _links.default,
  copy: node_copy
};

},{"./ancestors.js":198,"./count.js":199,"./descendants.js":200,"./each.js":201,"./eachAfter.js":202,"./eachBefore.js":203,"./leaves.js":205,"./links.js":206,"./path.js":207,"./sort.js":208,"./sum.js":209}],205:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var leaves = [];
  this.eachBefore(function (node) {
    if (!node.children) {
      leaves.push(node);
    }
  });
  return leaves;
}

},{}],206:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var root = this,
      links = [];
  root.each(function (node) {
    if (node !== root) {
      // Don’t include the root’s parent, if any.
      links.push({
        source: node.parent,
        target: node
      });
    }
  });
  return links;
}

},{}],207:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(end) {
  var start = this,
      ancestor = leastCommonAncestor(start, end),
      nodes = [start];

  while (start !== ancestor) {
    start = start.parent;
    nodes.push(start);
  }

  var k = nodes.length;

  while (end !== ancestor) {
    nodes.splice(k, 0, end);
    end = end.parent;
  }

  return nodes;
}

function leastCommonAncestor(a, b) {
  if (a === b) return a;
  var aNodes = a.ancestors(),
      bNodes = b.ancestors(),
      c = null;
  a = aNodes.pop();
  b = bNodes.pop();

  while (a === b) {
    c = a;
    a = aNodes.pop();
    b = bNodes.pop();
  }

  return c;
}

},{}],208:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(compare) {
  return this.eachBefore(function (node) {
    if (node.children) {
      node.children.sort(compare);
    }
  });
}

},{}],209:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(value) {
  return this.eachAfter(function (node) {
    var sum = +value(node.data) || 0,
        children = node.children,
        i = children && children.length;

    while (--i >= 0) sum += children[i].value;

    node.value = sum;
  });
}

},{}],210:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "cluster", {
  enumerable: true,
  get: function () {
    return _cluster.default;
  }
});
Object.defineProperty(exports, "hierarchy", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "pack", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "packSiblings", {
  enumerable: true,
  get: function () {
    return _siblings.default;
  }
});
Object.defineProperty(exports, "packEnclose", {
  enumerable: true,
  get: function () {
    return _enclose.default;
  }
});
Object.defineProperty(exports, "partition", {
  enumerable: true,
  get: function () {
    return _partition.default;
  }
});
Object.defineProperty(exports, "stratify", {
  enumerable: true,
  get: function () {
    return _stratify.default;
  }
});
Object.defineProperty(exports, "tree", {
  enumerable: true,
  get: function () {
    return _tree.default;
  }
});
Object.defineProperty(exports, "treemap", {
  enumerable: true,
  get: function () {
    return _index3.default;
  }
});
Object.defineProperty(exports, "treemapBinary", {
  enumerable: true,
  get: function () {
    return _binary.default;
  }
});
Object.defineProperty(exports, "treemapDice", {
  enumerable: true,
  get: function () {
    return _dice.default;
  }
});
Object.defineProperty(exports, "treemapSlice", {
  enumerable: true,
  get: function () {
    return _slice.default;
  }
});
Object.defineProperty(exports, "treemapSliceDice", {
  enumerable: true,
  get: function () {
    return _sliceDice.default;
  }
});
Object.defineProperty(exports, "treemapSquarify", {
  enumerable: true,
  get: function () {
    return _squarify.default;
  }
});
Object.defineProperty(exports, "treemapResquarify", {
  enumerable: true,
  get: function () {
    return _resquarify.default;
  }
});

var _cluster = _interopRequireDefault(require("./cluster.js"));

var _index = _interopRequireDefault(require("./hierarchy/index.js"));

var _index2 = _interopRequireDefault(require("./pack/index.js"));

var _siblings = _interopRequireDefault(require("./pack/siblings.js"));

var _enclose = _interopRequireDefault(require("./pack/enclose.js"));

var _partition = _interopRequireDefault(require("./partition.js"));

var _stratify = _interopRequireDefault(require("./stratify.js"));

var _tree = _interopRequireDefault(require("./tree.js"));

var _index3 = _interopRequireDefault(require("./treemap/index.js"));

var _binary = _interopRequireDefault(require("./treemap/binary.js"));

var _dice = _interopRequireDefault(require("./treemap/dice.js"));

var _slice = _interopRequireDefault(require("./treemap/slice.js"));

var _sliceDice = _interopRequireDefault(require("./treemap/sliceDice.js"));

var _squarify = _interopRequireDefault(require("./treemap/squarify.js"));

var _resquarify = _interopRequireDefault(require("./treemap/resquarify.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./cluster.js":196,"./hierarchy/index.js":204,"./pack/enclose.js":211,"./pack/index.js":212,"./pack/siblings.js":213,"./partition.js":214,"./stratify.js":215,"./tree.js":216,"./treemap/binary.js":217,"./treemap/dice.js":218,"./treemap/index.js":219,"./treemap/resquarify.js":220,"./treemap/slice.js":222,"./treemap/sliceDice.js":223,"./treemap/squarify.js":224}],211:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("../array.js");

function _default(circles) {
  var i = 0,
      n = (circles = (0, _array.shuffle)(_array.slice.call(circles))).length,
      B = [],
      p,
      e;

  while (i < n) {
    p = circles[i];
    if (e && enclosesWeak(e, p)) ++i;else e = encloseBasis(B = extendBasis(B, p)), i = 0;
  }

  return e;
}

function extendBasis(B, p) {
  var i, j;
  if (enclosesWeakAll(p, B)) return [p]; // If we get here then B must have at least one element.

  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  } // If we get here then B must have at least two elements.


  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (enclosesNot(encloseBasis2(B[i], B[j]), p) && enclosesNot(encloseBasis2(B[i], p), B[j]) && enclosesNot(encloseBasis2(B[j], p), B[i]) && enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)) {
        return [B[i], B[j], p];
      }
    }
  } // If we get here then something is very wrong.


  throw new Error();
}

function enclosesNot(a, b) {
  var dr = a.r - b.r,
      dx = b.x - a.x,
      dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

function enclosesWeak(a, b) {
  var dr = a.r - b.r + 1e-6,
      dx = b.x - a.x,
      dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function enclosesWeakAll(a, B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }

  return true;
}

function encloseBasis(B) {
  switch (B.length) {
    case 1:
      return encloseBasis1(B[0]);

    case 2:
      return encloseBasis2(B[0], B[1]);

    case 3:
      return encloseBasis3(B[0], B[1], B[2]);
  }
}

function encloseBasis1(a) {
  return {
    x: a.x,
    y: a.y,
    r: a.r
  };
}

function encloseBasis2(a, b) {
  var x1 = a.x,
      y1 = a.y,
      r1 = a.r,
      x2 = b.x,
      y2 = b.y,
      r2 = b.r,
      x21 = x2 - x1,
      y21 = y2 - y1,
      r21 = r2 - r1,
      l = Math.sqrt(x21 * x21 + y21 * y21);
  return {
    x: (x1 + x2 + x21 / l * r21) / 2,
    y: (y1 + y2 + y21 / l * r21) / 2,
    r: (l + r1 + r2) / 2
  };
}

function encloseBasis3(a, b, c) {
  var x1 = a.x,
      y1 = a.y,
      r1 = a.r,
      x2 = b.x,
      y2 = b.y,
      r2 = b.r,
      x3 = c.x,
      y3 = c.y,
      r3 = c.r,
      a2 = x1 - x2,
      a3 = x1 - x3,
      b2 = y1 - y2,
      b3 = y1 - y3,
      c2 = r2 - r1,
      c3 = r3 - r1,
      d1 = x1 * x1 + y1 * y1 - r1 * r1,
      d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
      d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
      ab = a3 * b2 - a2 * b3,
      xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
      xb = (b3 * c2 - b2 * c3) / ab,
      ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
      yb = (a2 * c3 - a3 * c2) / ab,
      A = xb * xb + yb * yb - 1,
      B = 2 * (r1 + xa * xb + ya * yb),
      C = xa * xa + ya * ya - r1 * r1,
      r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return {
    x: x1 + xa + xb * r,
    y: y1 + ya + yb * r,
    r: r
  };
}

},{"../array.js":195}],212:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _siblings = require("./siblings.js");

var _accessors = require("../accessors.js");

var _constant = _interopRequireWildcard(require("../constant.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function defaultRadius(d) {
  return Math.sqrt(d.value);
}

function _default() {
  var radius = null,
      dx = 1,
      dy = 1,
      padding = _constant.constantZero;

  function pack(root) {
    root.x = dx / 2, root.y = dy / 2;

    if (radius) {
      root.eachBefore(radiusLeaf(radius)).eachAfter(packChildren(padding, 0.5)).eachBefore(translateChild(1));
    } else {
      root.eachBefore(radiusLeaf(defaultRadius)).eachAfter(packChildren(_constant.constantZero, 1)).eachAfter(packChildren(padding, root.r / Math.min(dx, dy))).eachBefore(translateChild(Math.min(dx, dy) / (2 * root.r)));
    }

    return root;
  }

  pack.radius = function (x) {
    return arguments.length ? (radius = (0, _accessors.optional)(x), pack) : radius;
  };

  pack.size = function (x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], pack) : [dx, dy];
  };

  pack.padding = function (x) {
    return arguments.length ? (padding = typeof x === "function" ? x : (0, _constant.default)(+x), pack) : padding;
  };

  return pack;
}

function radiusLeaf(radius) {
  return function (node) {
    if (!node.children) {
      node.r = Math.max(0, +radius(node) || 0);
    }
  };
}

function packChildren(padding, k) {
  return function (node) {
    if (children = node.children) {
      var children,
          i,
          n = children.length,
          r = padding(node) * k || 0,
          e;
      if (r) for (i = 0; i < n; ++i) children[i].r += r;
      e = (0, _siblings.packEnclose)(children);
      if (r) for (i = 0; i < n; ++i) children[i].r -= r;
      node.r = e + r;
    }
  };
}

function translateChild(k) {
  return function (node) {
    var parent = node.parent;
    node.r *= k;

    if (parent) {
      node.x = parent.x + k * node.x;
      node.y = parent.y + k * node.y;
    }
  };
}

},{"../accessors.js":194,"../constant.js":197,"./siblings.js":213}],213:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packEnclose = packEnclose;
exports.default = _default;

var _enclose = _interopRequireDefault(require("./enclose.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function place(b, a, c) {
  var dx = b.x - a.x,
      x,
      a2,
      dy = b.y - a.y,
      y,
      b2,
      d2 = dx * dx + dy * dy;

  if (d2) {
    a2 = a.r + c.r, a2 *= a2;
    b2 = b.r + c.r, b2 *= b2;

    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

function intersects(a, b) {
  var dr = a.r + b.r - 1e-6,
      dx = b.x - a.x,
      dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function score(node) {
  var a = node._,
      b = node.next._,
      ab = a.r + b.r,
      dx = (a.x * b.r + b.x * a.r) / ab,
      dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

function Node(circle) {
  this._ = circle;
  this.next = null;
  this.previous = null;
}

function packEnclose(circles) {
  if (!(n = circles.length)) return 0;
  var a, b, c, n, aa, ca, i, j, k, sj, sk; // Place the first circle.

  a = circles[0], a.x = 0, a.y = 0;
  if (!(n > 1)) return a.r; // Place the second circle.

  b = circles[1], a.x = -b.r, b.x = a.r, b.y = 0;
  if (!(n > 2)) return a.r + b.r; // Place the third circle.

  place(b, a, c = circles[2]); // Initialize the front-chain using the first three circles a, b and c.

  a = new Node(a), b = new Node(b), c = new Node(c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a; // Attempt to place each remaining circle…

  pack: for (i = 3; i < n; ++i) {
    place(a._, b._, c = circles[i]), c = new Node(c); // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.

    j = b.next, k = a.previous, sj = b._.r, sk = a._.r;

    do {
      if (sj <= sk) {
        if (intersects(j._, c._)) {
          b = j, a.next = b, b.previous = a, --i;
          continue pack;
        }

        sj += j._.r, j = j.next;
      } else {
        if (intersects(k._, c._)) {
          a = k, a.next = b, b.previous = a, --i;
          continue pack;
        }

        sk += k._.r, k = k.previous;
      }
    } while (j !== k.next); // Success! Insert the new circle c between a and b.


    c.previous = a, c.next = b, a.next = b.previous = b = c; // Compute the new closest circle pair to the centroid.

    aa = score(a);

    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c, aa = ca;
      }
    }

    b = a.next;
  } // Compute the enclosing circle of the front chain.


  a = [b._], c = b;

  while ((c = c.next) !== b) a.push(c._);

  c = (0, _enclose.default)(a); // Translate the circles to put the enclosing circle around the origin.

  for (i = 0; i < n; ++i) a = circles[i], a.x -= c.x, a.y -= c.y;

  return c.r;
}

function _default(circles) {
  packEnclose(circles);
  return circles;
}

},{"./enclose.js":211}],214:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _round = _interopRequireDefault(require("./treemap/round.js"));

var _dice = _interopRequireDefault(require("./treemap/dice.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var dx = 1,
      dy = 1,
      padding = 0,
      round = false;

  function partition(root) {
    var n = root.height + 1;
    root.x0 = root.y0 = padding;
    root.x1 = dx;
    root.y1 = dy / n;
    root.eachBefore(positionNode(dy, n));
    if (round) root.eachBefore(_round.default);
    return root;
  }

  function positionNode(dy, n) {
    return function (node) {
      if (node.children) {
        (0, _dice.default)(node, node.x0, dy * (node.depth + 1) / n, node.x1, dy * (node.depth + 2) / n);
      }

      var x0 = node.x0,
          y0 = node.y0,
          x1 = node.x1 - padding,
          y1 = node.y1 - padding;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      node.x0 = x0;
      node.y0 = y0;
      node.x1 = x1;
      node.y1 = y1;
    };
  }

  partition.round = function (x) {
    return arguments.length ? (round = !!x, partition) : round;
  };

  partition.size = function (x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], partition) : [dx, dy];
  };

  partition.padding = function (x) {
    return arguments.length ? (padding = +x, partition) : padding;
  };

  return partition;
}

},{"./treemap/dice.js":218,"./treemap/round.js":221}],215:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _accessors = require("./accessors.js");

var _index = require("./hierarchy/index.js");

var keyPrefix = "$",
    // Protect against keys like “__proto__”.
preroot = {
  depth: -1
},
    ambiguous = {};

function defaultId(d) {
  return d.id;
}

function defaultParentId(d) {
  return d.parentId;
}

function _default() {
  var id = defaultId,
      parentId = defaultParentId;

  function stratify(data) {
    var d,
        i,
        n = data.length,
        root,
        parent,
        node,
        nodes = new Array(n),
        nodeId,
        nodeKey,
        nodeByKey = {};

    for (i = 0; i < n; ++i) {
      d = data[i], node = nodes[i] = new _index.Node(d);

      if ((nodeId = id(d, i, data)) != null && (nodeId += "")) {
        nodeKey = keyPrefix + (node.id = nodeId);
        nodeByKey[nodeKey] = nodeKey in nodeByKey ? ambiguous : node;
      }
    }

    for (i = 0; i < n; ++i) {
      node = nodes[i], nodeId = parentId(data[i], i, data);

      if (nodeId == null || !(nodeId += "")) {
        if (root) throw new Error("multiple roots");
        root = node;
      } else {
        parent = nodeByKey[keyPrefix + nodeId];
        if (!parent) throw new Error("missing: " + nodeId);
        if (parent === ambiguous) throw new Error("ambiguous: " + nodeId);
        if (parent.children) parent.children.push(node);else parent.children = [node];
        node.parent = parent;
      }
    }

    if (!root) throw new Error("no root");
    root.parent = preroot;
    root.eachBefore(function (node) {
      node.depth = node.parent.depth + 1;
      --n;
    }).eachBefore(_index.computeHeight);
    root.parent = null;
    if (n > 0) throw new Error("cycle");
    return root;
  }

  stratify.id = function (x) {
    return arguments.length ? (id = (0, _accessors.required)(x), stratify) : id;
  };

  stratify.parentId = function (x) {
    return arguments.length ? (parentId = (0, _accessors.required)(x), stratify) : parentId;
  };

  return stratify;
}

},{"./accessors.js":194,"./hierarchy/index.js":204}],216:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./hierarchy/index.js");

function defaultSeparation(a, b) {
  return a.parent === b.parent ? 1 : 2;
} // function radialSeparation(a, b) {
//   return (a.parent === b.parent ? 1 : 2) / a.depth;
// }
// This function is used to traverse the left contour of a subtree (or
// subforest). It returns the successor of v on this contour. This successor is
// either given by the leftmost child of v or by the thread of v. The function
// returns null if and only if v is on the highest level of its subtree.


function nextLeft(v) {
  var children = v.children;
  return children ? children[0] : v.t;
} // This function works analogously to nextLeft.


function nextRight(v) {
  var children = v.children;
  return children ? children[children.length - 1] : v.t;
} // Shifts the current subtree rooted at w+. This is done by increasing
// prelim(w+) and mod(w+) by shift.


function moveSubtree(wm, wp, shift) {
  var change = shift / (wp.i - wm.i);
  wp.c -= change;
  wp.s += shift;
  wm.c += change;
  wp.z += shift;
  wp.m += shift;
} // All other shifts, applied to the smaller subtrees between w- and w+, are
// performed by this function. To prepare the shifts, we have to adjust
// change(w+), shift(w+), and change(w-).


function executeShifts(v) {
  var shift = 0,
      change = 0,
      children = v.children,
      i = children.length,
      w;

  while (--i >= 0) {
    w = children[i];
    w.z += shift;
    w.m += shift;
    shift += w.s + (change += w.c);
  }
} // If vi-’s ancestor is a sibling of v, returns vi-’s ancestor. Otherwise,
// returns the specified (default) ancestor.


function nextAncestor(vim, v, ancestor) {
  return vim.a.parent === v.parent ? vim.a : ancestor;
}

function TreeNode(node, i) {
  this._ = node;
  this.parent = null;
  this.children = null;
  this.A = null; // default ancestor

  this.a = this; // ancestor

  this.z = 0; // prelim

  this.m = 0; // mod

  this.c = 0; // change

  this.s = 0; // shift

  this.t = null; // thread

  this.i = i; // number
}

TreeNode.prototype = Object.create(_index.Node.prototype);

function treeRoot(root) {
  var tree = new TreeNode(root, 0),
      node,
      nodes = [tree],
      child,
      children,
      i,
      n;

  while (node = nodes.pop()) {
    if (children = node._.children) {
      node.children = new Array(n = children.length);

      for (i = n - 1; i >= 0; --i) {
        nodes.push(child = node.children[i] = new TreeNode(children[i], i));
        child.parent = node;
      }
    }
  }

  (tree.parent = new TreeNode(null, 0)).children = [tree];
  return tree;
} // Node-link tree diagram using the Reingold-Tilford "tidy" algorithm


function _default() {
  var separation = defaultSeparation,
      dx = 1,
      dy = 1,
      nodeSize = null;

  function tree(root) {
    var t = treeRoot(root); // Compute the layout using Buchheim et al.’s algorithm.

    t.eachAfter(firstWalk), t.parent.m = -t.z;
    t.eachBefore(secondWalk); // If a fixed node size is specified, scale x and y.

    if (nodeSize) root.eachBefore(sizeNode); // If a fixed tree size is specified, scale x and y based on the extent.
    // Compute the left-most, right-most, and depth-most nodes for extents.
    else {
        var left = root,
            right = root,
            bottom = root;
        root.eachBefore(function (node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var s = left === right ? 1 : separation(left, right) / 2,
            tx = s - left.x,
            kx = dx / (right.x + s + tx),
            ky = dy / (bottom.depth || 1);
        root.eachBefore(function (node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
    return root;
  } // Computes a preliminary x-coordinate for v. Before that, FIRST WALK is
  // applied recursively to the children of v, as well as the function
  // APPORTION. After spacing out the children by calling EXECUTE SHIFTS, the
  // node v is placed to the midpoint of its outermost children.


  function firstWalk(v) {
    var children = v.children,
        siblings = v.parent.children,
        w = v.i ? siblings[v.i - 1] : null;

    if (children) {
      executeShifts(v);
      var midpoint = (children[0].z + children[children.length - 1].z) / 2;

      if (w) {
        v.z = w.z + separation(v._, w._);
        v.m = v.z - midpoint;
      } else {
        v.z = midpoint;
      }
    } else if (w) {
      v.z = w.z + separation(v._, w._);
    }

    v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
  } // Computes all real x-coordinates by summing up the modifiers recursively.


  function secondWalk(v) {
    v._.x = v.z + v.parent.m;
    v.m += v.parent.m;
  } // The core of the algorithm. Here, a new subtree is combined with the
  // previous subtrees. Threads are used to traverse the inside and outside
  // contours of the left and right subtree up to the highest common level. The
  // vertices used for the traversals are vi+, vi-, vo-, and vo+, where the
  // superscript o means outside and i means inside, the subscript - means left
  // subtree and + means right subtree. For summing up the modifiers along the
  // contour, we use respective variables si+, si-, so-, and so+. Whenever two
  // nodes of the inside contours conflict, we compute the left one of the
  // greatest uncommon ancestors using the function ANCESTOR and call MOVE
  // SUBTREE to shift the subtree and prepare the shifts of smaller subtrees.
  // Finally, we add a new thread (if necessary).


  function apportion(v, w, ancestor) {
    if (w) {
      var vip = v,
          vop = v,
          vim = w,
          vom = vip.parent.children[0],
          sip = vip.m,
          sop = vop.m,
          sim = vim.m,
          som = vom.m,
          shift;

      while (vim = nextRight(vim), vip = nextLeft(vip), vim && vip) {
        vom = nextLeft(vom);
        vop = nextRight(vop);
        vop.a = v;
        shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);

        if (shift > 0) {
          moveSubtree(nextAncestor(vim, v, ancestor), v, shift);
          sip += shift;
          sop += shift;
        }

        sim += vim.m;
        sip += vip.m;
        som += vom.m;
        sop += vop.m;
      }

      if (vim && !nextRight(vop)) {
        vop.t = vim;
        vop.m += sim - sop;
      }

      if (vip && !nextLeft(vom)) {
        vom.t = vip;
        vom.m += sip - som;
        ancestor = v;
      }
    }

    return ancestor;
  }

  function sizeNode(node) {
    node.x *= dx;
    node.y = node.depth * dy;
  }

  tree.separation = function (x) {
    return arguments.length ? (separation = x, tree) : separation;
  };

  tree.size = function (x) {
    return arguments.length ? (nodeSize = false, dx = +x[0], dy = +x[1], tree) : nodeSize ? null : [dx, dy];
  };

  tree.nodeSize = function (x) {
    return arguments.length ? (nodeSize = true, dx = +x[0], dy = +x[1], tree) : nodeSize ? [dx, dy] : null;
  };

  return tree;
}

},{"./hierarchy/index.js":204}],217:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      i,
      n = nodes.length,
      sum,
      sums = new Array(n + 1);

  for (sums[0] = sum = i = 0; i < n; ++i) {
    sums[i + 1] = sum += nodes[i].value;
  }

  partition(0, n, parent.value, x0, y0, x1, y1);

  function partition(i, j, value, x0, y0, x1, y1) {
    if (i >= j - 1) {
      var node = nodes[i];
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      return;
    }

    var valueOffset = sums[i],
        valueTarget = value / 2 + valueOffset,
        k = i + 1,
        hi = j - 1;

    while (k < hi) {
      var mid = k + hi >>> 1;
      if (sums[mid] < valueTarget) k = mid + 1;else hi = mid;
    }

    if (valueTarget - sums[k - 1] < sums[k] - valueTarget && i + 1 < k) --k;
    var valueLeft = sums[k] - valueOffset,
        valueRight = value - valueLeft;

    if (x1 - x0 > y1 - y0) {
      var xk = (x0 * valueRight + x1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {
      var yk = (y0 * valueRight + y1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  }
}

},{}],218:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (x1 - x0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.y0 = y0, node.y1 = y1;
    node.x0 = x0, node.x1 = x0 += node.value * k;
  }
}

},{}],219:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _round = _interopRequireDefault(require("./round.js"));

var _squarify = _interopRequireDefault(require("./squarify.js"));

var _accessors = require("../accessors.js");

var _constant = _interopRequireWildcard(require("../constant.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var tile = _squarify.default,
      round = false,
      dx = 1,
      dy = 1,
      paddingStack = [0],
      paddingInner = _constant.constantZero,
      paddingTop = _constant.constantZero,
      paddingRight = _constant.constantZero,
      paddingBottom = _constant.constantZero,
      paddingLeft = _constant.constantZero;

  function treemap(root) {
    root.x0 = root.y0 = 0;
    root.x1 = dx;
    root.y1 = dy;
    root.eachBefore(positionNode);
    paddingStack = [0];
    if (round) root.eachBefore(_round.default);
    return root;
  }

  function positionNode(node) {
    var p = paddingStack[node.depth],
        x0 = node.x0 + p,
        y0 = node.y0 + p,
        x1 = node.x1 - p,
        y1 = node.y1 - p;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;

    if (node.children) {
      p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
      x0 += paddingLeft(node) - p;
      y0 += paddingTop(node) - p;
      x1 -= paddingRight(node) - p;
      y1 -= paddingBottom(node) - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  treemap.round = function (x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function (x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function (x) {
    return arguments.length ? (tile = (0, _accessors.required)(x), treemap) : tile;
  };

  treemap.padding = function (x) {
    return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
  };

  treemap.paddingInner = function (x) {
    return arguments.length ? (paddingInner = typeof x === "function" ? x : (0, _constant.default)(+x), treemap) : paddingInner;
  };

  treemap.paddingOuter = function (x) {
    return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
  };

  treemap.paddingTop = function (x) {
    return arguments.length ? (paddingTop = typeof x === "function" ? x : (0, _constant.default)(+x), treemap) : paddingTop;
  };

  treemap.paddingRight = function (x) {
    return arguments.length ? (paddingRight = typeof x === "function" ? x : (0, _constant.default)(+x), treemap) : paddingRight;
  };

  treemap.paddingBottom = function (x) {
    return arguments.length ? (paddingBottom = typeof x === "function" ? x : (0, _constant.default)(+x), treemap) : paddingBottom;
  };

  treemap.paddingLeft = function (x) {
    return arguments.length ? (paddingLeft = typeof x === "function" ? x : (0, _constant.default)(+x), treemap) : paddingLeft;
  };

  return treemap;
}

},{"../accessors.js":194,"../constant.js":197,"./round.js":221,"./squarify.js":224}],220:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dice = _interopRequireDefault(require("./dice.js"));

var _slice = _interopRequireDefault(require("./slice.js"));

var _squarify = require("./squarify.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function custom(ratio) {
  function resquarify(parent, x0, y0, x1, y1) {
    if ((rows = parent._squarify) && rows.ratio === ratio) {
      var rows,
          row,
          nodes,
          i,
          j = -1,
          n,
          m = rows.length,
          value = parent.value;

      while (++j < m) {
        row = rows[j], nodes = row.children;

        for (i = row.value = 0, n = nodes.length; i < n; ++i) row.value += nodes[i].value;

        if (row.dice) (0, _dice.default)(row, x0, y0, x1, y0 += (y1 - y0) * row.value / value);else (0, _slice.default)(row, x0, y0, x0 += (x1 - x0) * row.value / value, y1);
        value -= row.value;
      }
    } else {
      parent._squarify = rows = (0, _squarify.squarifyRatio)(ratio, parent, x0, y0, x1, y1);
      rows.ratio = ratio;
    }
  }

  resquarify.ratio = function (x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return resquarify;
}(_squarify.phi);

exports.default = _default;

},{"./dice.js":218,"./slice.js":222,"./squarify.js":224}],221:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node) {
  node.x0 = Math.round(node.x0);
  node.y0 = Math.round(node.y0);
  node.x1 = Math.round(node.x1);
  node.y1 = Math.round(node.y1);
}

},{}],222:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.x0 = x0, node.x1 = x1;
    node.y0 = y0, node.y1 = y0 += node.value * k;
  }
}

},{}],223:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _dice = _interopRequireDefault(require("./dice.js"));

var _slice = _interopRequireDefault(require("./slice.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? _slice.default : _dice.default)(parent, x0, y0, x1, y1);
}

},{"./dice.js":218,"./slice.js":222}],224:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.squarifyRatio = squarifyRatio;
exports.default = exports.phi = void 0;

var _dice = _interopRequireDefault(require("./dice.js"));

var _slice = _interopRequireDefault(require("./slice.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var phi = (1 + Math.sqrt(5)) / 2;
exports.phi = phi;

function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx,
      dy,
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {
    dx = x1 - x0, dy = y1 - y0; // Find the next non-empty node.

    do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);

    minValue = maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue); // Keep adding nodes while the aspect ratio maintains or improves.

    for (; i1 < n; ++i1) {
      sumValue += nodeValue = nodes[i1].value;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);

      if (newRatio > minRatio) {
        sumValue -= nodeValue;
        break;
      }

      minRatio = newRatio;
    } // Position and record the row orientation.


    rows.push(row = {
      value: sumValue,
      dice: dx < dy,
      children: nodes.slice(i0, i1)
    });
    if (row.dice) (0, _dice.default)(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);else (0, _slice.default)(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
    value -= sumValue, i0 = i1;
  }

  return rows;
}

var _default = function custom(ratio) {
  function squarify(parent, x0, y0, x1, y1) {
    squarifyRatio(ratio, parent, x0, y0, x1, y1);
  }

  squarify.ratio = function (x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
}(phi);

exports.default = _default;

},{"./dice.js":218,"./slice.js":222}],225:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.genericArray = genericArray;

var _value = _interopRequireDefault(require("./value.js"));

var _numberArray = _interopRequireWildcard(require("./numberArray.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  return ((0, _numberArray.isNumberArray)(b) ? _numberArray.default : genericArray)(a, b);
}

function genericArray(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(na),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = (0, _value.default)(a[i], b[i]);

  for (; i < nb; ++i) c[i] = b[i];

  return function (t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);

    return c;
  };
}

},{"./numberArray.js":239,"./value.js":249}],226:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basis = basis;
exports.default = _default;

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1,
      t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}

function _default(values) {
  var n = values.length - 1;
  return function (t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

},{}],227:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis.js");

function _default(values) {
  var n = values.length;
  return function (t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
        v0 = values[(i + n - 1) % n],
        v1 = values[i % n],
        v2 = values[(i + 1) % n],
        v3 = values[(i + 2) % n];
    return (0, _basis.basis)((t - i / n) * n, v0, v1, v2, v3);
  };
}

},{"./basis.js":226}],228:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hue = hue;
exports.gamma = gamma;
exports.default = nogamma;

var _constant = _interopRequireDefault(require("./constant.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linear(a, d) {
  return function (t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function (t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : (0, _constant.default)(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function (a, b) {
    return b - a ? exponential(a, b, y) : (0, _constant.default)(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : (0, _constant.default)(isNaN(a) ? b : a);
}

},{"./constant.js":229}],229:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],230:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cubehelixLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function cubehelix(hue) {
  return function cubehelixGamma(y) {
    y = +y;

    function cubehelix(start, end) {
      var h = hue((start = (0, _d3Color.cubehelix)(start)).h, (end = (0, _d3Color.cubehelix)(end)).h),
          s = (0, _color.default)(start.s, end.s),
          l = (0, _color.default)(start.l, end.l),
          opacity = (0, _color.default)(start.opacity, end.opacity);
      return function (t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix.gamma = cubehelixGamma;
    return cubehelix;
  }(1);
}

var _default = cubehelix(_color.hue);

exports.default = _default;
var cubehelixLong = cubehelix(_color.default);
exports.cubehelixLong = cubehelixLong;

},{"./color.js":228,"d3-color":60}],231:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  var d = new Date();
  return a = +a, b = +b, function (t) {
    return d.setTime(a * (1 - t) + b * t), d;
  };
}

},{}],232:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

},{}],233:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hclLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hcl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hcl)(start)).h, (end = (0, _d3Color.hcl)(end)).h),
        c = (0, _color.default)(start.c, end.c),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.c = c(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hcl(_color.hue);

exports.default = _default;
var hclLong = hcl(_color.default);
exports.hclLong = hclLong;

},{"./color.js":228,"d3-color":60}],234:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hslLong = exports.default = void 0;

var _d3Color = require("d3-color");

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function hsl(hue) {
  return function (start, end) {
    var h = hue((start = (0, _d3Color.hsl)(start)).h, (end = (0, _d3Color.hsl)(end)).h),
        s = (0, _color.default)(start.s, end.s),
        l = (0, _color.default)(start.l, end.l),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.h = h(t);
      start.s = s(t);
      start.l = l(t);
      start.opacity = opacity(t);
      return start + "";
    };
  };
}

var _default = hsl(_color.hue);

exports.default = _default;
var hslLong = hsl(_color.default);
exports.hslLong = hslLong;

},{"./color.js":228,"d3-color":60}],235:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _color = require("./color.js");

function _default(a, b) {
  var i = (0, _color.hue)(+a, +b);
  return function (t) {
    var x = i(t);
    return x - 360 * Math.floor(x / 360);
  };
}

},{"./color.js":228}],236:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "interpolate", {
  enumerable: true,
  get: function () {
    return _value.default;
  }
});
Object.defineProperty(exports, "interpolateArray", {
  enumerable: true,
  get: function () {
    return _array.default;
  }
});
Object.defineProperty(exports, "interpolateBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "interpolateBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "interpolateDate", {
  enumerable: true,
  get: function () {
    return _date.default;
  }
});
Object.defineProperty(exports, "interpolateDiscrete", {
  enumerable: true,
  get: function () {
    return _discrete.default;
  }
});
Object.defineProperty(exports, "interpolateHue", {
  enumerable: true,
  get: function () {
    return _hue.default;
  }
});
Object.defineProperty(exports, "interpolateNumber", {
  enumerable: true,
  get: function () {
    return _number.default;
  }
});
Object.defineProperty(exports, "interpolateNumberArray", {
  enumerable: true,
  get: function () {
    return _numberArray.default;
  }
});
Object.defineProperty(exports, "interpolateObject", {
  enumerable: true,
  get: function () {
    return _object.default;
  }
});
Object.defineProperty(exports, "interpolateRound", {
  enumerable: true,
  get: function () {
    return _round.default;
  }
});
Object.defineProperty(exports, "interpolateString", {
  enumerable: true,
  get: function () {
    return _string.default;
  }
});
Object.defineProperty(exports, "interpolateTransformCss", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformCss;
  }
});
Object.defineProperty(exports, "interpolateTransformSvg", {
  enumerable: true,
  get: function () {
    return _index.interpolateTransformSvg;
  }
});
Object.defineProperty(exports, "interpolateZoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "interpolateRgb", {
  enumerable: true,
  get: function () {
    return _rgb.default;
  }
});
Object.defineProperty(exports, "interpolateRgbBasis", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasis;
  }
});
Object.defineProperty(exports, "interpolateRgbBasisClosed", {
  enumerable: true,
  get: function () {
    return _rgb.rgbBasisClosed;
  }
});
Object.defineProperty(exports, "interpolateHsl", {
  enumerable: true,
  get: function () {
    return _hsl.default;
  }
});
Object.defineProperty(exports, "interpolateHslLong", {
  enumerable: true,
  get: function () {
    return _hsl.hslLong;
  }
});
Object.defineProperty(exports, "interpolateLab", {
  enumerable: true,
  get: function () {
    return _lab.default;
  }
});
Object.defineProperty(exports, "interpolateHcl", {
  enumerable: true,
  get: function () {
    return _hcl.default;
  }
});
Object.defineProperty(exports, "interpolateHclLong", {
  enumerable: true,
  get: function () {
    return _hcl.hclLong;
  }
});
Object.defineProperty(exports, "interpolateCubehelix", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixLong", {
  enumerable: true,
  get: function () {
    return _cubehelix.cubehelixLong;
  }
});
Object.defineProperty(exports, "piecewise", {
  enumerable: true,
  get: function () {
    return _piecewise.default;
  }
});
Object.defineProperty(exports, "quantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});

var _value = _interopRequireDefault(require("./value.js"));

var _array = _interopRequireDefault(require("./array.js"));

var _basis = _interopRequireDefault(require("./basis.js"));

var _basisClosed = _interopRequireDefault(require("./basisClosed.js"));

var _date = _interopRequireDefault(require("./date.js"));

var _discrete = _interopRequireDefault(require("./discrete.js"));

var _hue = _interopRequireDefault(require("./hue.js"));

var _number = _interopRequireDefault(require("./number.js"));

var _numberArray = _interopRequireDefault(require("./numberArray.js"));

var _object = _interopRequireDefault(require("./object.js"));

var _round = _interopRequireDefault(require("./round.js"));

var _string = _interopRequireDefault(require("./string.js"));

var _index = require("./transform/index.js");

var _zoom = _interopRequireDefault(require("./zoom.js"));

var _rgb = _interopRequireWildcard(require("./rgb.js"));

var _hsl = _interopRequireWildcard(require("./hsl.js"));

var _lab = _interopRequireDefault(require("./lab.js"));

var _hcl = _interopRequireWildcard(require("./hcl.js"));

var _cubehelix = _interopRequireWildcard(require("./cubehelix.js"));

var _piecewise = _interopRequireDefault(require("./piecewise.js"));

var _quantize = _interopRequireDefault(require("./quantize.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./array.js":225,"./basis.js":226,"./basisClosed.js":227,"./cubehelix.js":230,"./date.js":231,"./discrete.js":232,"./hcl.js":233,"./hsl.js":234,"./hue.js":235,"./lab.js":237,"./number.js":238,"./numberArray.js":239,"./object.js":240,"./piecewise.js":241,"./quantize.js":242,"./rgb.js":243,"./round.js":244,"./string.js":245,"./transform/index.js":247,"./value.js":249,"./zoom.js":250}],237:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lab;

var _d3Color = require("d3-color");

var _color = _interopRequireDefault(require("./color.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lab(start, end) {
  var l = (0, _color.default)((start = (0, _d3Color.lab)(start)).l, (end = (0, _d3Color.lab)(end)).l),
      a = (0, _color.default)(start.a, end.a),
      b = (0, _color.default)(start.b, end.b),
      opacity = (0, _color.default)(start.opacity, end.opacity);
  return function (t) {
    start.l = l(t);
    start.a = a(t);
    start.b = b(t);
    start.opacity = opacity(t);
    return start + "";
  };
}

},{"./color.js":228,"d3-color":60}],238:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b = +b, function (t) {
    return a * (1 - t) + b * t;
  };
}

},{}],239:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.isNumberArray = isNumberArray;

function _default(a, b) {
  if (!b) b = [];
  var n = a ? Math.min(b.length, a.length) : 0,
      c = b.slice(),
      i;
  return function (t) {
    for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;

    return c;
  };
}

function isNumberArray(x) {
  return ArrayBuffer.isView(x) && !(x instanceof DataView);
}

},{}],240:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _value = _interopRequireDefault(require("./value.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var i = {},
      c = {},
      k;
  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = (0, _value.default)(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function (t) {
    for (k in i) c[k] = i[k](t);

    return c;
  };
}

},{"./value.js":249}],241:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = piecewise;

function piecewise(interpolate, values) {
  var i = 0,
      n = values.length - 1,
      v = values[0],
      I = new Array(n < 0 ? 0 : n);

  while (i < n) I[i] = interpolate(v, v = values[++i]);

  return function (t) {
    var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
    return I[i](t - i);
  };
}

},{}],242:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(interpolator, n) {
  var samples = new Array(n);

  for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));

  return samples;
}

},{}],243:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rgbBasisClosed = exports.rgbBasis = exports.default = void 0;

var _d3Color = require("d3-color");

var _basis = _interopRequireDefault(require("./basis.js"));

var _basisClosed = _interopRequireDefault(require("./basisClosed.js"));

var _color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function rgbGamma(y) {
  var color = (0, _color.gamma)(y);

  function rgb(start, end) {
    var r = color((start = (0, _d3Color.rgb)(start)).r, (end = (0, _d3Color.rgb)(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = (0, _color.default)(start.opacity, end.opacity);
    return function (t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb.gamma = rgbGamma;
  return rgb;
}(1);

exports.default = _default;

function rgbSpline(spline) {
  return function (colors) {
    var n = colors.length,
        r = new Array(n),
        g = new Array(n),
        b = new Array(n),
        i,
        color;

    for (i = 0; i < n; ++i) {
      color = (0, _d3Color.rgb)(colors[i]);
      r[i] = color.r || 0;
      g[i] = color.g || 0;
      b[i] = color.b || 0;
    }

    r = spline(r);
    g = spline(g);
    b = spline(b);
    color.opacity = 1;
    return function (t) {
      color.r = r(t);
      color.g = g(t);
      color.b = b(t);
      return color + "";
    };
  };
}

var rgbBasis = rgbSpline(_basis.default);
exports.rgbBasis = rgbBasis;
var rgbBasisClosed = rgbSpline(_basisClosed.default);
exports.rgbBasisClosed = rgbBasisClosed;

},{"./basis.js":226,"./basisClosed.js":227,"./color.js":228,"d3-color":60}],244:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(a, b) {
  return a = +a, b = +b, function (t) {
    return Math.round(a * (1 - t) + b * t);
  };
}

},{}],245:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _number = _interopRequireDefault(require("./number.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function () {
    return b;
  };
}

function one(b) {
  return function (t) {
    return b(t) + "";
  };
}

function _default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0,
      // scan index for next number in b
  am,
      // current match in a
  bm,
      // current match in b
  bs,
      // string preceding current number in b, if any
  i = -1,
      // index in s
  s = [],
      // string constants and placeholders
  q = []; // number interpolators
  // Coerce inputs to strings.

  a = a + "", b = b + ""; // Interpolate pairs of numbers in a & b.

  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    if ((am = am[0]) === (bm = bm[0])) {
      // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else {
      // interpolate non-matching numbers
      s[++i] = null;
      q.push({
        i: i,
        x: (0, _number.default)(am, bm)
      });
    }

    bi = reB.lastIndex;
  } // Add remains of b.


  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  } // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.


  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function (t) {
    for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);

    return s.join("");
  });
}

},{"./number.js":238}],246:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.identity = void 0;
var degrees = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
exports.identity = identity;

function _default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

},{}],247:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interpolateTransformSvg = exports.interpolateTransformCss = void 0;

var _number = _interopRequireDefault(require("../number.js"));

var _parse = require("./parse.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360;else if (b - a > 180) a += 360; // shortest path

      q.push({
        i: s.push(pop(s) + "rotate(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({
        i: s.push(pop(s) + "skewX(", null, degParen) - 2,
        x: (0, _number.default)(a, b)
      });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: (0, _number.default)(xa, xb)
      }, {
        i: i - 2,
        x: (0, _number.default)(ya, yb)
      });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function (a, b) {
    var s = [],
        // string constants and placeholders
    q = []; // number interpolators

    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc

    return function (t) {
      var i = -1,
          n = q.length,
          o;

      while (++i < n) s[(o = q[i]).i] = o.x(t);

      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(_parse.parseCss, "px, ", "px)", "deg)");
exports.interpolateTransformCss = interpolateTransformCss;
var interpolateTransformSvg = interpolateTransform(_parse.parseSvg, ", ", ")", ")");
exports.interpolateTransformSvg = interpolateTransformSvg;

},{"../number.js":238,"./parse.js":248}],248:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseCss = parseCss;
exports.parseSvg = parseSvg;

var _decompose = _interopRequireWildcard(require("./decompose.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var cssNode, cssRoot, cssView, svgNode;

function parseCss(value) {
  if (value === "none") return _decompose.identity;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return (0, _decompose.default)(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return _decompose.identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return _decompose.identity;
  value = value.matrix;
  return (0, _decompose.default)(value.a, value.b, value.c, value.d, value.e, value.f);
}

},{"./decompose.js":246}],249:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _rgb = _interopRequireDefault(require("./rgb.js"));

var _array = require("./array.js");

var _date = _interopRequireDefault(require("./date.js"));

var _number = _interopRequireDefault(require("./number.js"));

var _object = _interopRequireDefault(require("./object.js"));

var _string = _interopRequireDefault(require("./string.js"));

var _constant = _interopRequireDefault(require("./constant.js"));

var _numberArray = _interopRequireWildcard(require("./numberArray.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(a, b) {
  var t = typeof b,
      c;
  return b == null || t === "boolean" ? (0, _constant.default)(b) : (t === "number" ? _number.default : t === "string" ? (c = (0, _d3Color.color)(b)) ? (b = c, _rgb.default) : _string.default : b instanceof _d3Color.color ? _rgb.default : b instanceof Date ? _date.default : (0, _numberArray.isNumberArray)(b) ? _numberArray.default : Array.isArray(b) ? _array.genericArray : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? _object.default : _number.default)(a, b);
}

},{"./array.js":225,"./constant.js":229,"./date.js":231,"./number.js":238,"./numberArray.js":239,"./object.js":240,"./rgb.js":243,"./string.js":245,"d3-color":60}],250:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var rho = Math.SQRT2,
    rho2 = 2,
    rho4 = 4,
    epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
} // p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]


function _default(p0, p1) {
  var ux0 = p0[0],
      uy0 = p0[1],
      w0 = p0[2],
      ux1 = p1[0],
      uy1 = p1[1],
      w1 = p1[2],
      dx = ux1 - ux0,
      dy = uy1 - uy0,
      d2 = dx * dx + dy * dy,
      i,
      S; // Special case for u0 ≅ u1.

  if (d2 < epsilon2) {
    S = Math.log(w1 / w0) / rho;

    i = function (t) {
      return [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
    };
  } // General case.
  else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;

      i = function (t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(rho * s + r0)];
      };
    }

  i.duration = S * 1000;
  return i;
}

},{}],251:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "path", {
  enumerable: true,
  get: function () {
    return _path.default;
  }
});

var _path = _interopRequireDefault(require("./path.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./path.js":252}],252:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath

  this._ = "";
}

function path() {
  return new Path();
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function (x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function () {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function (x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function (x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function (x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01; // Is the radius negative? Error.

    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x1,y1).

    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    } // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon)) ; // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        } // Otherwise, draw an arc!
        else {
            var x20 = x2 - x0,
                y20 = y2 - y0,
                l21_2 = x21 * x21 + y21 * y21,
                l20_2 = x20 * x20 + y20 * y20,
                l21 = Math.sqrt(l21_2),
                l01 = Math.sqrt(l01_2),
                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21; // If the start tangent is not coincident with (x0,y0), line to.

            if (Math.abs(t01 - 1) > epsilon) {
              this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }

            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
          }
  },
  arc: function (x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0; // Is the radius negative? Error.

    if (r < 0) throw new Error("negative radius: " + r); // Is this path empty? Move to (x0,y0).

    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    } // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      } // Is this arc empty? We’re done.


    if (!r) return; // Does the angle go the wrong way? Flip the direction.

    if (da < 0) da = da % tau + tau; // Is this a complete circle? Draw two arcs to complete the circle.

    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    } // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
        this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
  },
  rect: function (x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function () {
    return this._;
  }
};
var _default = path;
exports.default = _default;

},{}],253:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(polygon) {
  var i = -1,
      n = polygon.length,
      a,
      b = polygon[n - 1],
      area = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}

},{}],254:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(polygon) {
  var i = -1,
      n = polygon.length,
      x = 0,
      y = 0,
      a,
      b = polygon[n - 1],
      c,
      k = 0;

  while (++i < n) {
    a = b;
    b = polygon[i];
    k += c = a[0] * b[1] - b[0] * a[1];
    x += (a[0] + b[0]) * c;
    y += (a[1] + b[1]) * c;
  }

  return k *= 3, [x / k, y / k];
}

},{}],255:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(polygon, point) {
  var n = polygon.length,
      p = polygon[n - 1],
      x = point[0],
      y = point[1],
      x0 = p[0],
      y0 = p[1],
      x1,
      y1,
      inside = false;

  for (var i = 0; i < n; ++i) {
    p = polygon[i], x1 = p[0], y1 = p[1];
    if (y1 > y !== y0 > y && x < (x0 - x1) * (y - y1) / (y0 - y1) + x1) inside = !inside;
    x0 = x1, y0 = y1;
  }

  return inside;
}

},{}],256:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// Returns the 2D cross product of AB and AC vectors, i.e., the z-component of
// the 3D cross product in a quadrant I Cartesian coordinate system (+x is
// right, +y is up). Returns a positive value if ABC is counter-clockwise,
// negative if clockwise, and zero if the points are collinear.
function _default(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

},{}],257:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _cross = _interopRequireDefault(require("./cross.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lexicographicOrder(a, b) {
  return a[0] - b[0] || a[1] - b[1];
} // Computes the upper convex hull per the monotone chain algorithm.
// Assumes points.length >= 3, is sorted by x, unique in y.
// Returns an array of indices into points in left-to-right order.


function computeUpperHullIndexes(points) {
  var n = points.length,
      indexes = [0, 1],
      size = 2;

  for (var i = 2; i < n; ++i) {
    while (size > 1 && (0, _cross.default)(points[indexes[size - 2]], points[indexes[size - 1]], points[i]) <= 0) --size;

    indexes[size++] = i;
  }

  return indexes.slice(0, size); // remove popped points
}

function _default(points) {
  if ((n = points.length) < 3) return null;
  var i,
      n,
      sortedPoints = new Array(n),
      flippedPoints = new Array(n);

  for (i = 0; i < n; ++i) sortedPoints[i] = [+points[i][0], +points[i][1], i];

  sortedPoints.sort(lexicographicOrder);

  for (i = 0; i < n; ++i) flippedPoints[i] = [sortedPoints[i][0], -sortedPoints[i][1]];

  var upperIndexes = computeUpperHullIndexes(sortedPoints),
      lowerIndexes = computeUpperHullIndexes(flippedPoints); // Construct the hull polygon, removing possible duplicate endpoints.

  var skipLeft = lowerIndexes[0] === upperIndexes[0],
      skipRight = lowerIndexes[lowerIndexes.length - 1] === upperIndexes[upperIndexes.length - 1],
      hull = []; // Add upper hull in right-to-l order.
  // Then add lower hull in left-to-right order.

  for (i = upperIndexes.length - 1; i >= 0; --i) hull.push(points[sortedPoints[upperIndexes[i]][2]]);

  for (i = +skipLeft; i < lowerIndexes.length - skipRight; ++i) hull.push(points[sortedPoints[lowerIndexes[i]][2]]);

  return hull;
}

},{"./cross.js":256}],258:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "polygonArea", {
  enumerable: true,
  get: function () {
    return _area.default;
  }
});
Object.defineProperty(exports, "polygonCentroid", {
  enumerable: true,
  get: function () {
    return _centroid.default;
  }
});
Object.defineProperty(exports, "polygonHull", {
  enumerable: true,
  get: function () {
    return _hull.default;
  }
});
Object.defineProperty(exports, "polygonContains", {
  enumerable: true,
  get: function () {
    return _contains.default;
  }
});
Object.defineProperty(exports, "polygonLength", {
  enumerable: true,
  get: function () {
    return _length.default;
  }
});

var _area = _interopRequireDefault(require("./area.js"));

var _centroid = _interopRequireDefault(require("./centroid.js"));

var _hull = _interopRequireDefault(require("./hull.js"));

var _contains = _interopRequireDefault(require("./contains.js"));

var _length = _interopRequireDefault(require("./length.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./area.js":253,"./centroid.js":254,"./contains.js":255,"./hull.js":257,"./length.js":259}],259:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(polygon) {
  var i = -1,
      n = polygon.length,
      b = polygon[n - 1],
      xa,
      ya,
      xb = b[0],
      yb = b[1],
      perimeter = 0;

  while (++i < n) {
    xa = xb;
    ya = yb;
    b = polygon[i];
    xb = b[0];
    yb = b[1];
    xa -= xb;
    ya -= yb;
    perimeter += Math.sqrt(xa * xa + ya * ya);
  }

  return perimeter;
}

},{}],260:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.addAll = addAll;

function _default(d) {
  var x = +this._x.call(null, d),
      y = +this._y.call(null, d);
  return add(this.cover(x, y), x, y, d);
}

function add(tree, x, y, d) {
  if (isNaN(x) || isNaN(y)) return tree; // ignore invalid points

  var parent,
      node = tree._root,
      leaf = {
    data: d
  },
      x0 = tree._x0,
      y0 = tree._y0,
      x1 = tree._x1,
      y1 = tree._y1,
      xm,
      ym,
      xp,
      yp,
      right,
      bottom,
      i,
      j; // If the tree is empty, initialize the root as a leaf.

  if (!node) return tree._root = leaf, tree; // Find the existing leaf for the new point, or add it.

  while (node.length) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
    if (parent = node, !(node = node[i = bottom << 1 | right])) return parent[i] = leaf, tree;
  } // Is the new point is exactly coincident with the existing point?


  xp = +tree._x.call(null, node.data);
  yp = +tree._y.call(null, node.data);
  if (x === xp && y === yp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree; // Otherwise, split the leaf node until the old and new point are separated.

  do {
    parent = parent ? parent[i] = new Array(4) : tree._root = new Array(4);
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
  } while ((i = bottom << 1 | right) === (j = (yp >= ym) << 1 | xp >= xm));

  return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
  var d,
      i,
      n = data.length,
      x,
      y,
      xz = new Array(n),
      yz = new Array(n),
      x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity; // Compute the points and their extent.

  for (i = 0; i < n; ++i) {
    if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d))) continue;
    xz[i] = x;
    yz[i] = y;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  } // If there were no (valid) points, abort.


  if (x0 > x1 || y0 > y1) return this; // Expand the tree to cover the new points.

  this.cover(x0, y0).cover(x1, y1); // Add the new points.

  for (i = 0; i < n; ++i) {
    add(this, xz[i], yz[i], data[i]);
  }

  return this;
}

},{}],261:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x, y) {
  if (isNaN(x = +x) || isNaN(y = +y)) return this; // ignore invalid points

  var x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1; // If the quadtree has no extent, initialize them.
  // Integer extent are necessary so that if we later double the extent,
  // the existing quadrant boundaries don’t change due to floating point error!

  if (isNaN(x0)) {
    x1 = (x0 = Math.floor(x)) + 1;
    y1 = (y0 = Math.floor(y)) + 1;
  } // Otherwise, double repeatedly to cover.
  else {
      var z = x1 - x0,
          node = this._root,
          parent,
          i;

      while (x0 > x || x >= x1 || y0 > y || y >= y1) {
        i = (y < y0) << 1 | x < x0;
        parent = new Array(4), parent[i] = node, node = parent, z *= 2;

        switch (i) {
          case 0:
            x1 = x0 + z, y1 = y0 + z;
            break;

          case 1:
            x0 = x1 - z, y1 = y0 + z;
            break;

          case 2:
            x1 = x0 + z, y0 = y1 - z;
            break;

          case 3:
            x0 = x1 - z, y0 = y1 - z;
            break;
        }
      }

      if (this._root && this._root.length) this._root = node;
    }

  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  return this;
}

},{}],262:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var data = [];
  this.visit(function (node) {
    if (!node.length) do data.push(node.data); while (node = node.next);
  });
  return data;
}

},{}],263:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(_) {
  return arguments.length ? this.cover(+_[0][0], +_[0][1]).cover(+_[1][0], +_[1][1]) : isNaN(this._x0) ? undefined : [[this._x0, this._y0], [this._x1, this._y1]];
}

},{}],264:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _quad = _interopRequireDefault(require("./quad.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(x, y, radius) {
  var data,
      x0 = this._x0,
      y0 = this._y0,
      x1,
      y1,
      x2,
      y2,
      x3 = this._x1,
      y3 = this._y1,
      quads = [],
      node = this._root,
      q,
      i;
  if (node) quads.push(new _quad.default(node, x0, y0, x3, y3));
  if (radius == null) radius = Infinity;else {
    x0 = x - radius, y0 = y - radius;
    x3 = x + radius, y3 = y + radius;
    radius *= radius;
  }

  while (q = quads.pop()) {
    // Stop searching if this quadrant can’t contain a closer node.
    if (!(node = q.node) || (x1 = q.x0) > x3 || (y1 = q.y0) > y3 || (x2 = q.x1) < x0 || (y2 = q.y1) < y0) continue; // Bisect the current quadrant.

    if (node.length) {
      var xm = (x1 + x2) / 2,
          ym = (y1 + y2) / 2;
      quads.push(new _quad.default(node[3], xm, ym, x2, y2), new _quad.default(node[2], x1, ym, xm, y2), new _quad.default(node[1], xm, y1, x2, ym), new _quad.default(node[0], x1, y1, xm, ym)); // Visit the closest quadrant first.

      if (i = (y >= ym) << 1 | x >= xm) {
        q = quads[quads.length - 1];
        quads[quads.length - 1] = quads[quads.length - 1 - i];
        quads[quads.length - 1 - i] = q;
      }
    } // Visit this point. (Visiting coincident points isn’t necessary!)
    else {
        var dx = x - +this._x.call(null, node.data),
            dy = y - +this._y.call(null, node.data),
            d2 = dx * dx + dy * dy;

        if (d2 < radius) {
          var d = Math.sqrt(radius = d2);
          x0 = x - d, y0 = y - d;
          x3 = x + d, y3 = y + d;
          data = node.data;
        }
      }
  }

  return data;
}

},{"./quad.js":266}],265:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "quadtree", {
  enumerable: true,
  get: function () {
    return _quadtree.default;
  }
});

var _quadtree = _interopRequireDefault(require("./quadtree.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./quadtree.js":267}],266:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node, x0, y0, x1, y1) {
  this.node = node;
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
}

},{}],267:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quadtree;

var _add = _interopRequireWildcard(require("./add.js"));

var _cover = _interopRequireDefault(require("./cover.js"));

var _data = _interopRequireDefault(require("./data.js"));

var _extent = _interopRequireDefault(require("./extent.js"));

var _find = _interopRequireDefault(require("./find.js"));

var _remove = _interopRequireWildcard(require("./remove.js"));

var _root = _interopRequireDefault(require("./root.js"));

var _size = _interopRequireDefault(require("./size.js"));

var _visit = _interopRequireDefault(require("./visit.js"));

var _visitAfter = _interopRequireDefault(require("./visitAfter.js"));

var _x = _interopRequireWildcard(require("./x.js"));

var _y = _interopRequireWildcard(require("./y.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function quadtree(nodes, x, y) {
  var tree = new Quadtree(x == null ? _x.defaultX : x, y == null ? _y.defaultY : y, NaN, NaN, NaN, NaN);
  return nodes == null ? tree : tree.addAll(nodes);
}

function Quadtree(x, y, x0, y0, x1, y1) {
  this._x = x;
  this._y = y;
  this._x0 = x0;
  this._y0 = y0;
  this._x1 = x1;
  this._y1 = y1;
  this._root = undefined;
}

function leaf_copy(leaf) {
  var copy = {
    data: leaf.data
  },
      next = copy;

  while (leaf = leaf.next) next = next.next = {
    data: leaf.data
  };

  return copy;
}

var treeProto = quadtree.prototype = Quadtree.prototype;

treeProto.copy = function () {
  var copy = new Quadtree(this._x, this._y, this._x0, this._y0, this._x1, this._y1),
      node = this._root,
      nodes,
      child;
  if (!node) return copy;
  if (!node.length) return copy._root = leaf_copy(node), copy;
  nodes = [{
    source: node,
    target: copy._root = new Array(4)
  }];

  while (node = nodes.pop()) {
    for (var i = 0; i < 4; ++i) {
      if (child = node.source[i]) {
        if (child.length) nodes.push({
          source: child,
          target: node.target[i] = new Array(4)
        });else node.target[i] = leaf_copy(child);
      }
    }
  }

  return copy;
};

treeProto.add = _add.default;
treeProto.addAll = _add.addAll;
treeProto.cover = _cover.default;
treeProto.data = _data.default;
treeProto.extent = _extent.default;
treeProto.find = _find.default;
treeProto.remove = _remove.default;
treeProto.removeAll = _remove.removeAll;
treeProto.root = _root.default;
treeProto.size = _size.default;
treeProto.visit = _visit.default;
treeProto.visitAfter = _visitAfter.default;
treeProto.x = _x.default;
treeProto.y = _y.default;

},{"./add.js":260,"./cover.js":261,"./data.js":262,"./extent.js":263,"./find.js":264,"./remove.js":268,"./root.js":269,"./size.js":270,"./visit.js":271,"./visitAfter.js":272,"./x.js":273,"./y.js":274}],268:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.removeAll = removeAll;

function _default(d) {
  if (isNaN(x = +this._x.call(null, d)) || isNaN(y = +this._y.call(null, d))) return this; // ignore invalid points

  var parent,
      node = this._root,
      retainer,
      previous,
      next,
      x0 = this._x0,
      y0 = this._y0,
      x1 = this._x1,
      y1 = this._y1,
      x,
      y,
      xm,
      ym,
      right,
      bottom,
      i,
      j; // If the tree is empty, initialize the root as a leaf.

  if (!node) return this; // Find the leaf node for the point.
  // While descending, also retain the deepest parent with a non-removed sibling.

  if (node.length) while (true) {
    if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm;else x1 = xm;
    if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym;else y1 = ym;
    if (!(parent = node, node = node[i = bottom << 1 | right])) return this;
    if (!node.length) break;
    if (parent[i + 1 & 3] || parent[i + 2 & 3] || parent[i + 3 & 3]) retainer = parent, j = i;
  } // Find the point to remove.

  while (node.data !== d) if (!(previous = node, node = node.next)) return this;

  if (next = node.next) delete node.next; // If there are multiple coincident points, remove just the point.

  if (previous) return next ? previous.next = next : delete previous.next, this; // If this is the root point, remove it.

  if (!parent) return this._root = next, this; // Remove this leaf.

  next ? parent[i] = next : delete parent[i]; // If the parent now contains exactly one leaf, collapse superfluous parents.

  if ((node = parent[0] || parent[1] || parent[2] || parent[3]) && node === (parent[3] || parent[2] || parent[1] || parent[0]) && !node.length) {
    if (retainer) retainer[j] = node;else this._root = node;
  }

  return this;
}

function removeAll(data) {
  for (var i = 0, n = data.length; i < n; ++i) this.remove(data[i]);

  return this;
}

},{}],269:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return this._root;
}

},{}],270:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var size = 0;
  this.visit(function (node) {
    if (!node.length) do ++size; while (node = node.next);
  });
  return size;
}

},{}],271:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _quad = _interopRequireDefault(require("./quad.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(callback) {
  var quads = [],
      q,
      node = this._root,
      child,
      x0,
      y0,
      x1,
      y1;
  if (node) quads.push(new _quad.default(node, this._x0, this._y0, this._x1, this._y1));

  while (q = quads.pop()) {
    if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
      var xm = (x0 + x1) / 2,
          ym = (y0 + y1) / 2;
      if (child = node[3]) quads.push(new _quad.default(child, xm, ym, x1, y1));
      if (child = node[2]) quads.push(new _quad.default(child, x0, ym, xm, y1));
      if (child = node[1]) quads.push(new _quad.default(child, xm, y0, x1, ym));
      if (child = node[0]) quads.push(new _quad.default(child, x0, y0, xm, ym));
    }
  }

  return this;
}

},{"./quad.js":266}],272:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _quad = _interopRequireDefault(require("./quad.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(callback) {
  var quads = [],
      next = [],
      q;
  if (this._root) quads.push(new _quad.default(this._root, this._x0, this._y0, this._x1, this._y1));

  while (q = quads.pop()) {
    var node = q.node;

    if (node.length) {
      var child,
          x0 = q.x0,
          y0 = q.y0,
          x1 = q.x1,
          y1 = q.y1,
          xm = (x0 + x1) / 2,
          ym = (y0 + y1) / 2;
      if (child = node[0]) quads.push(new _quad.default(child, x0, y0, xm, ym));
      if (child = node[1]) quads.push(new _quad.default(child, xm, y0, x1, ym));
      if (child = node[2]) quads.push(new _quad.default(child, x0, ym, xm, y1));
      if (child = node[3]) quads.push(new _quad.default(child, xm, ym, x1, y1));
    }

    next.push(q);
  }

  while (q = next.pop()) {
    callback(q.node, q.x0, q.y0, q.x1, q.y1);
  }

  return this;
}

},{"./quad.js":266}],273:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultX = defaultX;
exports.default = _default;

function defaultX(d) {
  return d[0];
}

function _default(_) {
  return arguments.length ? (this._x = _, this) : this._x;
}

},{}],274:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultY = defaultY;
exports.default = _default;

function defaultY(d) {
  return d[1];
}

function _default(_) {
  return arguments.length ? (this._y = _, this) : this._y;
}

},{}],275:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

var _irwinHall = _interopRequireDefault(require("./irwinHall"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomBates(source) {
  function randomBates(n) {
    var randomIrwinHall = _irwinHall.default.source(source)(n);

    return function () {
      return randomIrwinHall() / n;
    };
  }

  randomBates.source = sourceRandomBates;
  return randomBates;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276,"./irwinHall":279}],276:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return Math.random();
}

},{}],277:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomExponential(source) {
  function randomExponential(lambda) {
    return function () {
      return -Math.log(1 - source()) / lambda;
    };
  }

  randomExponential.source = sourceRandomExponential;
  return randomExponential;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276}],278:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "randomUniform", {
  enumerable: true,
  get: function () {
    return _uniform.default;
  }
});
Object.defineProperty(exports, "randomNormal", {
  enumerable: true,
  get: function () {
    return _normal.default;
  }
});
Object.defineProperty(exports, "randomLogNormal", {
  enumerable: true,
  get: function () {
    return _logNormal.default;
  }
});
Object.defineProperty(exports, "randomBates", {
  enumerable: true,
  get: function () {
    return _bates.default;
  }
});
Object.defineProperty(exports, "randomIrwinHall", {
  enumerable: true,
  get: function () {
    return _irwinHall.default;
  }
});
Object.defineProperty(exports, "randomExponential", {
  enumerable: true,
  get: function () {
    return _exponential.default;
  }
});

var _uniform = _interopRequireDefault(require("./uniform"));

var _normal = _interopRequireDefault(require("./normal"));

var _logNormal = _interopRequireDefault(require("./logNormal"));

var _bates = _interopRequireDefault(require("./bates"));

var _irwinHall = _interopRequireDefault(require("./irwinHall"));

var _exponential = _interopRequireDefault(require("./exponential"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./bates":275,"./exponential":277,"./irwinHall":279,"./logNormal":280,"./normal":281,"./uniform":282}],279:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomIrwinHall(source) {
  function randomIrwinHall(n) {
    return function () {
      for (var sum = 0, i = 0; i < n; ++i) sum += source();

      return sum;
    };
  }

  randomIrwinHall.source = sourceRandomIrwinHall;
  return randomIrwinHall;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276}],280:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

var _normal = _interopRequireDefault(require("./normal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomLogNormal(source) {
  function randomLogNormal() {
    var randomNormal = _normal.default.source(source).apply(this, arguments);

    return function () {
      return Math.exp(randomNormal());
    };
  }

  randomLogNormal.source = sourceRandomLogNormal;
  return randomLogNormal;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276,"./normal":281}],281:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomNormal(source) {
  function randomNormal(mu, sigma) {
    var x, r;
    mu = mu == null ? 0 : +mu;
    sigma = sigma == null ? 1 : +sigma;
    return function () {
      var y; // If available, use the second previously-generated uniform random.

      if (x != null) y = x, x = null; // Otherwise, generate a new x and y.
      else do {
          x = source() * 2 - 1;
          y = source() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
      return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
    };
  }

  randomNormal.source = sourceRandomNormal;
  return randomNormal;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276}],282:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultSource = _interopRequireDefault(require("./defaultSource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function sourceRandomUniform(source) {
  function randomUniform(min, max) {
    min = min == null ? 0 : +min;
    max = max == null ? 1 : +max;
    if (arguments.length === 1) max = min, min = 0;else max -= min;
    return function () {
      return source() * max + min;
    };
  }

  randomUniform.source = sourceRandomUniform;
  return randomUniform;
}(_defaultSource.default);

exports.default = _default;

},{"./defaultSource":276}],283:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("7fc97fbeaed4fdc086ffff99386cb0f0027fbf5b17666666");

exports.default = _default;

},{"../colors.js":293}],284:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("1b9e77d95f027570b3e7298a66a61ee6ab02a6761d666666");

exports.default = _default;

},{"../colors.js":293}],285:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("a6cee31f78b4b2df8a33a02cfb9a99e31a1cfdbf6fff7f00cab2d66a3d9affff99b15928");

exports.default = _default;

},{"../colors.js":293}],286:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("fbb4aeb3cde3ccebc5decbe4fed9a6ffffcce5d8bdfddaecf2f2f2");

exports.default = _default;

},{"../colors.js":293}],287:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("b3e2cdfdcdaccbd5e8f4cae4e6f5c9fff2aef1e2cccccccc");

exports.default = _default;

},{"../colors.js":293}],288:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("e41a1c377eb84daf4a984ea3ff7f00ffff33a65628f781bf999999");

exports.default = _default;

},{"../colors.js":293}],289:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("66c2a5fc8d628da0cbe78ac3a6d854ffd92fe5c494b3b3b3");

exports.default = _default;

},{"../colors.js":293}],290:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("8dd3c7ffffb3bebadafb807280b1d3fdb462b3de69fccde5d9d9d9bc80bdccebc5ffed6f");

exports.default = _default;

},{"../colors.js":293}],291:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("4e79a7f28e2ce1575976b7b259a14fedc949af7aa1ff9da79c755fbab0ab");

exports.default = _default;

},{"../colors.js":293}],292:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _colors.default)("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

exports.default = _default;

},{"../colors.js":293}],293:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(specifier) {
  var n = specifier.length / 6 | 0,
      colors = new Array(n),
      i = 0;

  while (i < n) colors[i] = "#" + specifier.slice(i * 6, ++i * 6);

  return colors;
}

},{}],294:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("d8b365f5f5f55ab4ac", "a6611adfc27d80cdc1018571", "a6611adfc27df5f5f580cdc1018571", "8c510ad8b365f6e8c3c7eae55ab4ac01665e", "8c510ad8b365f6e8c3f5f5f5c7eae55ab4ac01665e", "8c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e", "8c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e", "5430058c510abf812ddfc27df6e8c3c7eae580cdc135978f01665e003c30", "5430058c510abf812ddfc27df6e8c3f5f5f5c7eae580cdc135978f01665e003c30").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],295:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("af8dc3f7f7f77fbf7b", "7b3294c2a5cfa6dba0008837", "7b3294c2a5cff7f7f7a6dba0008837", "762a83af8dc3e7d4e8d9f0d37fbf7b1b7837", "762a83af8dc3e7d4e8f7f7f7d9f0d37fbf7b1b7837", "762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b7837", "762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b7837", "40004b762a839970abc2a5cfe7d4e8d9f0d3a6dba05aae611b783700441b", "40004b762a839970abc2a5cfe7d4e8f7f7f7d9f0d3a6dba05aae611b783700441b").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],296:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e9a3c9f7f7f7a1d76a", "d01c8bf1b6dab8e1864dac26", "d01c8bf1b6daf7f7f7b8e1864dac26", "c51b7de9a3c9fde0efe6f5d0a1d76a4d9221", "c51b7de9a3c9fde0eff7f7f7e6f5d0a1d76a4d9221", "c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221", "c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221", "8e0152c51b7dde77aef1b6dafde0efe6f5d0b8e1867fbc414d9221276419", "8e0152c51b7dde77aef1b6dafde0eff7f7f7e6f5d0b8e1867fbc414d9221276419").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],297:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("998ec3f7f7f7f1a340", "5e3c99b2abd2fdb863e66101", "5e3c99b2abd2f7f7f7fdb863e66101", "542788998ec3d8daebfee0b6f1a340b35806", "542788998ec3d8daebf7f7f7fee0b6f1a340b35806", "5427888073acb2abd2d8daebfee0b6fdb863e08214b35806", "5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b35806", "2d004b5427888073acb2abd2d8daebfee0b6fdb863e08214b358067f3b08", "2d004b5427888073acb2abd2d8daebf7f7f7fee0b6fdb863e08214b358067f3b08").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],298:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("ef8a62f7f7f767a9cf", "ca0020f4a58292c5de0571b0", "ca0020f4a582f7f7f792c5de0571b0", "b2182bef8a62fddbc7d1e5f067a9cf2166ac", "b2182bef8a62fddbc7f7f7f7d1e5f067a9cf2166ac", "b2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac", "b2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac", "67001fb2182bd6604df4a582fddbc7d1e5f092c5de4393c32166ac053061", "67001fb2182bd6604df4a582fddbc7f7f7f7d1e5f092c5de4393c32166ac053061").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],299:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("ef8a62ffffff999999", "ca0020f4a582bababa404040", "ca0020f4a582ffffffbababa404040", "b2182bef8a62fddbc7e0e0e09999994d4d4d", "b2182bef8a62fddbc7ffffffe0e0e09999994d4d4d", "b2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d", "b2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d", "67001fb2182bd6604df4a582fddbc7e0e0e0bababa8787874d4d4d1a1a1a", "67001fb2182bd6604df4a582fddbc7ffffffe0e0e0bababa8787874d4d4d1a1a1a").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],300:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fc8d59ffffbf91bfdb", "d7191cfdae61abd9e92c7bb6", "d7191cfdae61ffffbfabd9e92c7bb6", "d73027fc8d59fee090e0f3f891bfdb4575b4", "d73027fc8d59fee090ffffbfe0f3f891bfdb4575b4", "d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4", "d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4", "a50026d73027f46d43fdae61fee090e0f3f8abd9e974add14575b4313695", "a50026d73027f46d43fdae61fee090ffffbfe0f3f8abd9e974add14575b4313695").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],301:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fc8d59ffffbf91cf60", "d7191cfdae61a6d96a1a9641", "d7191cfdae61ffffbfa6d96a1a9641", "d73027fc8d59fee08bd9ef8b91cf601a9850", "d73027fc8d59fee08bffffbfd9ef8b91cf601a9850", "d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850", "d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850", "a50026d73027f46d43fdae61fee08bd9ef8ba6d96a66bd631a9850006837", "a50026d73027f46d43fdae61fee08bffffbfd9ef8ba6d96a66bd631a9850006837").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],302:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fc8d59ffffbf99d594", "d7191cfdae61abdda42b83ba", "d7191cfdae61ffffbfabdda42b83ba", "d53e4ffc8d59fee08be6f59899d5943288bd", "d53e4ffc8d59fee08bffffbfe6f59899d5943288bd", "d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd", "d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd", "9e0142d53e4ff46d43fdae61fee08be6f598abdda466c2a53288bd5e4fa2", "9e0142d53e4ff46d43fdae61fee08bffffbfe6f598abdda466c2a53288bd5e4fa2").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],303:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "schemeCategory10", {
  enumerable: true,
  get: function () {
    return _category.default;
  }
});
Object.defineProperty(exports, "schemeAccent", {
  enumerable: true,
  get: function () {
    return _Accent.default;
  }
});
Object.defineProperty(exports, "schemeDark2", {
  enumerable: true,
  get: function () {
    return _Dark.default;
  }
});
Object.defineProperty(exports, "schemePaired", {
  enumerable: true,
  get: function () {
    return _Paired.default;
  }
});
Object.defineProperty(exports, "schemePastel1", {
  enumerable: true,
  get: function () {
    return _Pastel.default;
  }
});
Object.defineProperty(exports, "schemePastel2", {
  enumerable: true,
  get: function () {
    return _Pastel2.default;
  }
});
Object.defineProperty(exports, "schemeSet1", {
  enumerable: true,
  get: function () {
    return _Set.default;
  }
});
Object.defineProperty(exports, "schemeSet2", {
  enumerable: true,
  get: function () {
    return _Set2.default;
  }
});
Object.defineProperty(exports, "schemeSet3", {
  enumerable: true,
  get: function () {
    return _Set3.default;
  }
});
Object.defineProperty(exports, "schemeTableau10", {
  enumerable: true,
  get: function () {
    return _Tableau.default;
  }
});
Object.defineProperty(exports, "interpolateBrBG", {
  enumerable: true,
  get: function () {
    return _BrBG.default;
  }
});
Object.defineProperty(exports, "schemeBrBG", {
  enumerable: true,
  get: function () {
    return _BrBG.scheme;
  }
});
Object.defineProperty(exports, "interpolatePRGn", {
  enumerable: true,
  get: function () {
    return _PRGn.default;
  }
});
Object.defineProperty(exports, "schemePRGn", {
  enumerable: true,
  get: function () {
    return _PRGn.scheme;
  }
});
Object.defineProperty(exports, "interpolatePiYG", {
  enumerable: true,
  get: function () {
    return _PiYG.default;
  }
});
Object.defineProperty(exports, "schemePiYG", {
  enumerable: true,
  get: function () {
    return _PiYG.scheme;
  }
});
Object.defineProperty(exports, "interpolatePuOr", {
  enumerable: true,
  get: function () {
    return _PuOr.default;
  }
});
Object.defineProperty(exports, "schemePuOr", {
  enumerable: true,
  get: function () {
    return _PuOr.scheme;
  }
});
Object.defineProperty(exports, "interpolateRdBu", {
  enumerable: true,
  get: function () {
    return _RdBu.default;
  }
});
Object.defineProperty(exports, "schemeRdBu", {
  enumerable: true,
  get: function () {
    return _RdBu.scheme;
  }
});
Object.defineProperty(exports, "interpolateRdGy", {
  enumerable: true,
  get: function () {
    return _RdGy.default;
  }
});
Object.defineProperty(exports, "schemeRdGy", {
  enumerable: true,
  get: function () {
    return _RdGy.scheme;
  }
});
Object.defineProperty(exports, "interpolateRdYlBu", {
  enumerable: true,
  get: function () {
    return _RdYlBu.default;
  }
});
Object.defineProperty(exports, "schemeRdYlBu", {
  enumerable: true,
  get: function () {
    return _RdYlBu.scheme;
  }
});
Object.defineProperty(exports, "interpolateRdYlGn", {
  enumerable: true,
  get: function () {
    return _RdYlGn.default;
  }
});
Object.defineProperty(exports, "schemeRdYlGn", {
  enumerable: true,
  get: function () {
    return _RdYlGn.scheme;
  }
});
Object.defineProperty(exports, "interpolateSpectral", {
  enumerable: true,
  get: function () {
    return _Spectral.default;
  }
});
Object.defineProperty(exports, "schemeSpectral", {
  enumerable: true,
  get: function () {
    return _Spectral.scheme;
  }
});
Object.defineProperty(exports, "interpolateBuGn", {
  enumerable: true,
  get: function () {
    return _BuGn.default;
  }
});
Object.defineProperty(exports, "schemeBuGn", {
  enumerable: true,
  get: function () {
    return _BuGn.scheme;
  }
});
Object.defineProperty(exports, "interpolateBuPu", {
  enumerable: true,
  get: function () {
    return _BuPu.default;
  }
});
Object.defineProperty(exports, "schemeBuPu", {
  enumerable: true,
  get: function () {
    return _BuPu.scheme;
  }
});
Object.defineProperty(exports, "interpolateGnBu", {
  enumerable: true,
  get: function () {
    return _GnBu.default;
  }
});
Object.defineProperty(exports, "schemeGnBu", {
  enumerable: true,
  get: function () {
    return _GnBu.scheme;
  }
});
Object.defineProperty(exports, "interpolateOrRd", {
  enumerable: true,
  get: function () {
    return _OrRd.default;
  }
});
Object.defineProperty(exports, "schemeOrRd", {
  enumerable: true,
  get: function () {
    return _OrRd.scheme;
  }
});
Object.defineProperty(exports, "interpolatePuBuGn", {
  enumerable: true,
  get: function () {
    return _PuBuGn.default;
  }
});
Object.defineProperty(exports, "schemePuBuGn", {
  enumerable: true,
  get: function () {
    return _PuBuGn.scheme;
  }
});
Object.defineProperty(exports, "interpolatePuBu", {
  enumerable: true,
  get: function () {
    return _PuBu.default;
  }
});
Object.defineProperty(exports, "schemePuBu", {
  enumerable: true,
  get: function () {
    return _PuBu.scheme;
  }
});
Object.defineProperty(exports, "interpolatePuRd", {
  enumerable: true,
  get: function () {
    return _PuRd.default;
  }
});
Object.defineProperty(exports, "schemePuRd", {
  enumerable: true,
  get: function () {
    return _PuRd.scheme;
  }
});
Object.defineProperty(exports, "interpolateRdPu", {
  enumerable: true,
  get: function () {
    return _RdPu.default;
  }
});
Object.defineProperty(exports, "schemeRdPu", {
  enumerable: true,
  get: function () {
    return _RdPu.scheme;
  }
});
Object.defineProperty(exports, "interpolateYlGnBu", {
  enumerable: true,
  get: function () {
    return _YlGnBu.default;
  }
});
Object.defineProperty(exports, "schemeYlGnBu", {
  enumerable: true,
  get: function () {
    return _YlGnBu.scheme;
  }
});
Object.defineProperty(exports, "interpolateYlGn", {
  enumerable: true,
  get: function () {
    return _YlGn.default;
  }
});
Object.defineProperty(exports, "schemeYlGn", {
  enumerable: true,
  get: function () {
    return _YlGn.scheme;
  }
});
Object.defineProperty(exports, "interpolateYlOrBr", {
  enumerable: true,
  get: function () {
    return _YlOrBr.default;
  }
});
Object.defineProperty(exports, "schemeYlOrBr", {
  enumerable: true,
  get: function () {
    return _YlOrBr.scheme;
  }
});
Object.defineProperty(exports, "interpolateYlOrRd", {
  enumerable: true,
  get: function () {
    return _YlOrRd.default;
  }
});
Object.defineProperty(exports, "schemeYlOrRd", {
  enumerable: true,
  get: function () {
    return _YlOrRd.scheme;
  }
});
Object.defineProperty(exports, "interpolateBlues", {
  enumerable: true,
  get: function () {
    return _Blues.default;
  }
});
Object.defineProperty(exports, "schemeBlues", {
  enumerable: true,
  get: function () {
    return _Blues.scheme;
  }
});
Object.defineProperty(exports, "interpolateGreens", {
  enumerable: true,
  get: function () {
    return _Greens.default;
  }
});
Object.defineProperty(exports, "schemeGreens", {
  enumerable: true,
  get: function () {
    return _Greens.scheme;
  }
});
Object.defineProperty(exports, "interpolateGreys", {
  enumerable: true,
  get: function () {
    return _Greys.default;
  }
});
Object.defineProperty(exports, "schemeGreys", {
  enumerable: true,
  get: function () {
    return _Greys.scheme;
  }
});
Object.defineProperty(exports, "interpolatePurples", {
  enumerable: true,
  get: function () {
    return _Purples.default;
  }
});
Object.defineProperty(exports, "schemePurples", {
  enumerable: true,
  get: function () {
    return _Purples.scheme;
  }
});
Object.defineProperty(exports, "interpolateReds", {
  enumerable: true,
  get: function () {
    return _Reds.default;
  }
});
Object.defineProperty(exports, "schemeReds", {
  enumerable: true,
  get: function () {
    return _Reds.scheme;
  }
});
Object.defineProperty(exports, "interpolateOranges", {
  enumerable: true,
  get: function () {
    return _Oranges.default;
  }
});
Object.defineProperty(exports, "schemeOranges", {
  enumerable: true,
  get: function () {
    return _Oranges.scheme;
  }
});
Object.defineProperty(exports, "interpolateCividis", {
  enumerable: true,
  get: function () {
    return _cividis.default;
  }
});
Object.defineProperty(exports, "interpolateCubehelixDefault", {
  enumerable: true,
  get: function () {
    return _cubehelix.default;
  }
});
Object.defineProperty(exports, "interpolateRainbow", {
  enumerable: true,
  get: function () {
    return _rainbow.default;
  }
});
Object.defineProperty(exports, "interpolateWarm", {
  enumerable: true,
  get: function () {
    return _rainbow.warm;
  }
});
Object.defineProperty(exports, "interpolateCool", {
  enumerable: true,
  get: function () {
    return _rainbow.cool;
  }
});
Object.defineProperty(exports, "interpolateSinebow", {
  enumerable: true,
  get: function () {
    return _sinebow.default;
  }
});
Object.defineProperty(exports, "interpolateTurbo", {
  enumerable: true,
  get: function () {
    return _turbo.default;
  }
});
Object.defineProperty(exports, "interpolateViridis", {
  enumerable: true,
  get: function () {
    return _viridis.default;
  }
});
Object.defineProperty(exports, "interpolateMagma", {
  enumerable: true,
  get: function () {
    return _viridis.magma;
  }
});
Object.defineProperty(exports, "interpolateInferno", {
  enumerable: true,
  get: function () {
    return _viridis.inferno;
  }
});
Object.defineProperty(exports, "interpolatePlasma", {
  enumerable: true,
  get: function () {
    return _viridis.plasma;
  }
});

var _category = _interopRequireDefault(require("./categorical/category10.js"));

var _Accent = _interopRequireDefault(require("./categorical/Accent.js"));

var _Dark = _interopRequireDefault(require("./categorical/Dark2.js"));

var _Paired = _interopRequireDefault(require("./categorical/Paired.js"));

var _Pastel = _interopRequireDefault(require("./categorical/Pastel1.js"));

var _Pastel2 = _interopRequireDefault(require("./categorical/Pastel2.js"));

var _Set = _interopRequireDefault(require("./categorical/Set1.js"));

var _Set2 = _interopRequireDefault(require("./categorical/Set2.js"));

var _Set3 = _interopRequireDefault(require("./categorical/Set3.js"));

var _Tableau = _interopRequireDefault(require("./categorical/Tableau10.js"));

var _BrBG = _interopRequireWildcard(require("./diverging/BrBG.js"));

var _PRGn = _interopRequireWildcard(require("./diverging/PRGn.js"));

var _PiYG = _interopRequireWildcard(require("./diverging/PiYG.js"));

var _PuOr = _interopRequireWildcard(require("./diverging/PuOr.js"));

var _RdBu = _interopRequireWildcard(require("./diverging/RdBu.js"));

var _RdGy = _interopRequireWildcard(require("./diverging/RdGy.js"));

var _RdYlBu = _interopRequireWildcard(require("./diverging/RdYlBu.js"));

var _RdYlGn = _interopRequireWildcard(require("./diverging/RdYlGn.js"));

var _Spectral = _interopRequireWildcard(require("./diverging/Spectral.js"));

var _BuGn = _interopRequireWildcard(require("./sequential-multi/BuGn.js"));

var _BuPu = _interopRequireWildcard(require("./sequential-multi/BuPu.js"));

var _GnBu = _interopRequireWildcard(require("./sequential-multi/GnBu.js"));

var _OrRd = _interopRequireWildcard(require("./sequential-multi/OrRd.js"));

var _PuBuGn = _interopRequireWildcard(require("./sequential-multi/PuBuGn.js"));

var _PuBu = _interopRequireWildcard(require("./sequential-multi/PuBu.js"));

var _PuRd = _interopRequireWildcard(require("./sequential-multi/PuRd.js"));

var _RdPu = _interopRequireWildcard(require("./sequential-multi/RdPu.js"));

var _YlGnBu = _interopRequireWildcard(require("./sequential-multi/YlGnBu.js"));

var _YlGn = _interopRequireWildcard(require("./sequential-multi/YlGn.js"));

var _YlOrBr = _interopRequireWildcard(require("./sequential-multi/YlOrBr.js"));

var _YlOrRd = _interopRequireWildcard(require("./sequential-multi/YlOrRd.js"));

var _Blues = _interopRequireWildcard(require("./sequential-single/Blues.js"));

var _Greens = _interopRequireWildcard(require("./sequential-single/Greens.js"));

var _Greys = _interopRequireWildcard(require("./sequential-single/Greys.js"));

var _Purples = _interopRequireWildcard(require("./sequential-single/Purples.js"));

var _Reds = _interopRequireWildcard(require("./sequential-single/Reds.js"));

var _Oranges = _interopRequireWildcard(require("./sequential-single/Oranges.js"));

var _cividis = _interopRequireDefault(require("./sequential-multi/cividis.js"));

var _cubehelix = _interopRequireDefault(require("./sequential-multi/cubehelix.js"));

var _rainbow = _interopRequireWildcard(require("./sequential-multi/rainbow.js"));

var _sinebow = _interopRequireDefault(require("./sequential-multi/sinebow.js"));

var _turbo = _interopRequireDefault(require("./sequential-multi/turbo.js"));

var _viridis = _interopRequireWildcard(require("./sequential-multi/viridis.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./categorical/Accent.js":283,"./categorical/Dark2.js":284,"./categorical/Paired.js":285,"./categorical/Pastel1.js":286,"./categorical/Pastel2.js":287,"./categorical/Set1.js":288,"./categorical/Set2.js":289,"./categorical/Set3.js":290,"./categorical/Tableau10.js":291,"./categorical/category10.js":292,"./diverging/BrBG.js":294,"./diverging/PRGn.js":295,"./diverging/PiYG.js":296,"./diverging/PuOr.js":297,"./diverging/RdBu.js":298,"./diverging/RdGy.js":299,"./diverging/RdYlBu.js":300,"./diverging/RdYlGn.js":301,"./diverging/Spectral.js":302,"./sequential-multi/BuGn.js":305,"./sequential-multi/BuPu.js":306,"./sequential-multi/GnBu.js":307,"./sequential-multi/OrRd.js":308,"./sequential-multi/PuBu.js":309,"./sequential-multi/PuBuGn.js":310,"./sequential-multi/PuRd.js":311,"./sequential-multi/RdPu.js":312,"./sequential-multi/YlGn.js":313,"./sequential-multi/YlGnBu.js":314,"./sequential-multi/YlOrBr.js":315,"./sequential-multi/YlOrRd.js":316,"./sequential-multi/cividis.js":317,"./sequential-multi/cubehelix.js":318,"./sequential-multi/rainbow.js":319,"./sequential-multi/sinebow.js":320,"./sequential-multi/turbo.js":321,"./sequential-multi/viridis.js":322,"./sequential-single/Blues.js":323,"./sequential-single/Greens.js":324,"./sequential-single/Greys.js":325,"./sequential-single/Oranges.js":326,"./sequential-single/Purples.js":327,"./sequential-single/Reds.js":328}],304:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

function _default(scheme) {
  return (0, _d3Interpolate.interpolateRgbBasis)(scheme[scheme.length - 1]);
}

},{"d3-interpolate":236}],305:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e5f5f999d8c92ca25f", "edf8fbb2e2e266c2a4238b45", "edf8fbb2e2e266c2a42ca25f006d2c", "edf8fbccece699d8c966c2a42ca25f006d2c", "edf8fbccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45005824", "f7fcfde5f5f9ccece699d8c966c2a441ae76238b45006d2c00441b").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],306:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e0ecf49ebcda8856a7", "edf8fbb3cde38c96c688419d", "edf8fbb3cde38c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68856a7810f7c", "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b", "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],307:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e0f3dba8ddb543a2ca", "f0f9e8bae4bc7bccc42b8cbe", "f0f9e8bae4bc7bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc443a2ca0868ac", "f0f9e8ccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe08589e", "f7fcf0e0f3dbccebc5a8ddb57bccc44eb3d32b8cbe0868ac084081").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],308:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fee8c8fdbb84e34a33", "fef0d9fdcc8afc8d59d7301f", "fef0d9fdcc8afc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59e34a33b30000", "fef0d9fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301f990000", "fff7ecfee8c8fdd49efdbb84fc8d59ef6548d7301fb300007f0000").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],309:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("ece7f2a6bddb2b8cbe", "f1eef6bdc9e174a9cf0570b0", "f1eef6bdc9e174a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf2b8cbe045a8d", "f1eef6d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0034e7b", "fff7fbece7f2d0d1e6a6bddb74a9cf3690c00570b0045a8d023858").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],310:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("ece2f0a6bddb1c9099", "f6eff7bdc9e167a9cf02818a", "f6eff7bdc9e167a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf1c9099016c59", "f6eff7d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016450", "fff7fbece2f0d0d1e6a6bddb67a9cf3690c002818a016c59014636").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],311:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e7e1efc994c7dd1c77", "f1eef6d7b5d8df65b0ce1256", "f1eef6d7b5d8df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0dd1c77980043", "f1eef6d4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125691003f", "f7f4f9e7e1efd4b9dac994c7df65b0e7298ace125698004367001f").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],312:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fde0ddfa9fb5c51b8a", "feebe2fbb4b9f768a1ae017e", "feebe2fbb4b9f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1c51b8a7a0177", "feebe2fcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a0177", "fff7f3fde0ddfcc5c0fa9fb5f768a1dd3497ae017e7a017749006a").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],313:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("f7fcb9addd8e31a354", "ffffccc2e69978c679238443", "ffffccc2e69978c67931a354006837", "ffffccd9f0a3addd8e78c67931a354006837", "ffffccd9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443005a32", "ffffe5f7fcb9d9f0a3addd8e78c67941ab5d238443006837004529").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],314:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("edf8b17fcdbb2c7fb8", "ffffcca1dab441b6c4225ea8", "ffffcca1dab441b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c42c7fb8253494", "ffffccc7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea80c2c84", "ffffd9edf8b1c7e9b47fcdbb41b6c41d91c0225ea8253494081d58").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],315:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fff7bcfec44fd95f0e", "ffffd4fed98efe9929cc4c02", "ffffd4fed98efe9929d95f0e993404", "ffffd4fee391fec44ffe9929d95f0e993404", "ffffd4fee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c028c2d04", "ffffe5fff7bcfee391fec44ffe9929ec7014cc4c02993404662506").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],316:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("ffeda0feb24cf03b20", "ffffb2fecc5cfd8d3ce31a1c", "ffffb2fecc5cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cf03b20bd0026", "ffffb2fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cb10026", "ffffccffeda0fed976feb24cfd8d3cfc4e2ae31a1cbd0026800026").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],317:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(-4.54 - t * (35.34 - t * (2381.73 - t * (6402.7 - t * (7024.72 - t * 2710.57))))))) + ", " + Math.max(0, Math.min(255, Math.round(32.49 + t * (170.73 + t * (52.82 - t * (131.46 - t * (176.58 - t * 67.37))))))) + ", " + Math.max(0, Math.min(255, Math.round(81.24 + t * (442.36 - t * (2482.43 - t * (6167.24 - t * (6614.94 - t * 2475.67))))))) + ")";
}

},{}],318:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

var _default = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(300, 0.5, 0.0), (0, _d3Color.cubehelix)(-240, 0.5, 1.0));

exports.default = _default;

},{"d3-color":60,"d3-interpolate":236}],319:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.cool = exports.warm = void 0;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

var warm = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(-100, 0.75, 0.35), (0, _d3Color.cubehelix)(80, 1.50, 0.8));
exports.warm = warm;
var cool = (0, _d3Interpolate.interpolateCubehelixLong)((0, _d3Color.cubehelix)(260, 0.75, 0.35), (0, _d3Color.cubehelix)(80, 1.50, 0.8));
exports.cool = cool;
var c = (0, _d3Color.cubehelix)();

function _default(t) {
  if (t < 0 || t > 1) t -= Math.floor(t);
  var ts = Math.abs(t - 0.5);
  c.h = 360 * t - 100;
  c.s = 1.5 - 1.5 * ts;
  c.l = 0.8 - 0.9 * ts;
  return c + "";
}

},{"d3-color":60,"d3-interpolate":236}],320:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var c = (0, _d3Color.rgb)(),
    pi_1_3 = Math.PI / 3,
    pi_2_3 = Math.PI * 2 / 3;

function _default(t) {
  var x;
  t = (0.5 - t) * Math.PI;
  c.r = 255 * (x = Math.sin(t)) * x;
  c.g = 255 * (x = Math.sin(t + pi_1_3)) * x;
  c.b = 255 * (x = Math.sin(t + pi_2_3)) * x;
  return c + "";
}

},{"d3-color":60}],321:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(t) {
  t = Math.max(0, Math.min(1, t));
  return "rgb(" + Math.max(0, Math.min(255, Math.round(34.61 + t * (1172.33 - t * (10793.56 - t * (33300.12 - t * (38394.49 - t * 14825.05))))))) + ", " + Math.max(0, Math.min(255, Math.round(23.31 + t * (557.33 + t * (1225.33 - t * (3574.96 - t * (1073.77 + t * 707.56))))))) + ", " + Math.max(0, Math.min(255, Math.round(27.2 + t * (3211.1 - t * (15327.97 - t * (27814 - t * (22569.18 - t * 6838.66))))))) + ")";
}

},{}],322:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plasma = exports.inferno = exports.magma = exports.default = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ramp(range) {
  var n = range.length;
  return function (t) {
    return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
  };
}

var _default = ramp((0, _colors.default)("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

exports.default = _default;
var magma = ramp((0, _colors.default)("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));
exports.magma = magma;
var inferno = ramp((0, _colors.default)("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));
exports.inferno = inferno;
var plasma = ramp((0, _colors.default)("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));
exports.plasma = plasma;

},{"../colors.js":293}],323:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("deebf79ecae13182bd", "eff3ffbdd7e76baed62171b5", "eff3ffbdd7e76baed63182bd08519c", "eff3ffc6dbef9ecae16baed63182bd08519c", "eff3ffc6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b5084594", "f7fbffdeebf7c6dbef9ecae16baed64292c62171b508519c08306b").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],324:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("e5f5e0a1d99b31a354", "edf8e9bae4b374c476238b45", "edf8e9bae4b374c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47631a354006d2c", "edf8e9c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45005a32", "f7fcf5e5f5e0c7e9c0a1d99b74c47641ab5d238b45006d2c00441b").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],325:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("f0f0f0bdbdbd636363", "f7f7f7cccccc969696525252", "f7f7f7cccccc969696636363252525", "f7f7f7d9d9d9bdbdbd969696636363252525", "f7f7f7d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525", "fffffff0f0f0d9d9d9bdbdbd969696737373525252252525000000").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],326:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fee6cefdae6be6550d", "feeddefdbe85fd8d3cd94701", "feeddefdbe85fd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3ce6550da63603", "feeddefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d948018c2d04", "fff5ebfee6cefdd0a2fdae6bfd8d3cf16913d94801a636037f2704").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],327:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("efedf5bcbddc756bb1", "f2f0f7cbc9e29e9ac86a51a3", "f2f0f7cbc9e29e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8756bb154278f", "f2f0f7dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a34a1486", "fcfbfdefedf5dadaebbcbddc9e9ac8807dba6a51a354278f3f007d").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],328:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.scheme = void 0;

var _colors = _interopRequireDefault(require("../colors.js"));

var _ramp = _interopRequireDefault(require("../ramp.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scheme = new Array(3).concat("fee0d2fc9272de2d26", "fee5d9fcae91fb6a4acb181d", "fee5d9fcae91fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4ade2d26a50f15", "fee5d9fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181d99000d", "fff5f0fee0d2fcbba1fc9272fb6a4aef3b2ccb181da50f1567000d").map(_colors.default);
exports.scheme = scheme;

var _default = (0, _ramp.default)(scheme);

exports.default = _default;

},{"../colors.js":293,"../ramp.js":304}],329:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slice = exports.map = void 0;
var array = Array.prototype;
var map = array.map;
exports.map = map;
var slice = array.slice;
exports.slice = slice;

},{}],330:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = band;
exports.point = point;

var _d3Array = require("d3-array");

var _init = require("./init");

var _ordinal = _interopRequireDefault(require("./ordinal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function band() {
  var scale = (0, _ordinal.default)().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      range = [0, 1],
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;
  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = range[1] < range[0],
        start = range[reverse - 0],
        stop = range[1 - reverse];
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = (0, _d3Array.range)(n).map(function (i) {
      return start + step * i;
    });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function (_) {
    return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = [+_[0], +_[1]], round = true, rescale();
  };

  scale.bandwidth = function () {
    return bandwidth;
  };

  scale.step = function () {
    return step;
  };

  scale.round = function (_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function (_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function (_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function (_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function () {
    return band(domain(), range).round(round).paddingInner(paddingInner).paddingOuter(paddingOuter).align(align);
  };

  return _init.initRange.apply(rescale(), arguments);
}

function pointish(scale) {
  var copy = scale.copy;
  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function () {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}

},{"./init":336,"./ordinal":341,"d3-array":14}],331:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],332:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = identity;
exports.copy = copy;
exports.transformer = transformer;
exports.default = continuous;

var _d3Array = require("d3-array");

var _d3Interpolate = require("d3-interpolate");

var _array = require("./array");

var _constant = _interopRequireDefault(require("./constant"));

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unit = [0, 1];

function identity(x) {
  return x;
}

function normalize(a, b) {
  return (b -= a = +a) ? function (x) {
    return (x - a) / b;
  } : (0, _constant.default)(isNaN(b) ? NaN : 0.5);
}

function clamper(domain) {
  var a = domain[0],
      b = domain[domain.length - 1],
      t;
  if (a > b) t = a, a = b, b = t;
  return function (x) {
    return Math.max(a, Math.min(b, x));
  };
} // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].


function bimap(domain, range, interpolate) {
  var d0 = domain[0],
      d1 = domain[1],
      r0 = range[0],
      r1 = range[1];
  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
  return function (x) {
    return r0(d0(x));
  };
}

function polymap(domain, range, interpolate) {
  var j = Math.min(domain.length, range.length) - 1,
      d = new Array(j),
      r = new Array(j),
      i = -1; // Reverse descending domains.

  if (domain[j] < domain[0]) {
    domain = domain.slice().reverse();
    range = range.slice().reverse();
  }

  while (++i < j) {
    d[i] = normalize(domain[i], domain[i + 1]);
    r[i] = interpolate(range[i], range[i + 1]);
  }

  return function (x) {
    var i = (0, _d3Array.bisect)(domain, x, 1, j) - 1;
    return r[i](d[i](x));
  };
}

function copy(source, target) {
  return target.domain(source.domain()).range(source.range()).interpolate(source.interpolate()).clamp(source.clamp()).unknown(source.unknown());
}

function transformer() {
  var domain = unit,
      range = unit,
      interpolate = _d3Interpolate.interpolate,
      transform,
      untransform,
      unknown,
      clamp = identity,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
  }

  scale.invert = function (y) {
    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), _d3Interpolate.interpolateNumber)))(y)));
  };

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), clamp === identity || (clamp = clamper(domain)), rescale()) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.rangeRound = function (_) {
    return range = _array.slice.call(_), interpolate = _d3Interpolate.interpolateRound, rescale();
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
  };

  scale.interpolate = function (_) {
    return arguments.length ? (interpolate = _, rescale()) : interpolate;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t, u) {
    transform = t, untransform = u;
    return rescale();
  };
}

function continuous(transform, untransform) {
  return transformer()(transform, untransform);
}

},{"./array":329,"./constant":331,"./number":340,"d3-array":14,"d3-interpolate":236}],333:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diverging;
exports.divergingLog = divergingLog;
exports.divergingSymlog = divergingSymlog;
exports.divergingPow = divergingPow;
exports.divergingSqrt = divergingSqrt;

var _continuous = require("./continuous");

var _init = require("./init");

var _linear = require("./linear");

var _log = require("./log");

var _sequential = require("./sequential");

var _symlog = require("./symlog");

var _pow = require("./pow");

function transformer() {
  var x0 = 0,
      x1 = 0.5,
      x2 = 1,
      t0,
      t1,
      t2,
      k10,
      k21,
      interpolator = _continuous.identity,
      transform,
      clamp = false,
      unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : (x = 0.5 + ((x = +transform(x)) - t1) * (x < t1 ? k10 : k21), interpolator(clamp ? Math.max(0, Math.min(1, x)) : x));
  }

  scale.domain = function (_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), t2 = transform(x2 = +_[2]), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1), scale) : [x0, x1, x2];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), t2 = t(x2), k10 = t0 === t1 ? 0 : 0.5 / (t1 - t0), k21 = t1 === t2 ? 0 : 0.5 / (t2 - t1);
    return scale;
  };
}

function diverging() {
  var scale = (0, _linear.linearish)(transformer()(_continuous.identity));

  scale.copy = function () {
    return (0, _sequential.copy)(scale, diverging());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingLog() {
  var scale = (0, _log.loggish)(transformer()).domain([0.1, 1, 10]);

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingLog()).base(scale.base());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingSymlog() {
  var scale = (0, _symlog.symlogish)(transformer());

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingSymlog()).constant(scale.constant());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingPow() {
  var scale = (0, _pow.powish)(transformer());

  scale.copy = function () {
    return (0, _sequential.copy)(scale, divergingPow()).exponent(scale.exponent());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function divergingSqrt() {
  return divergingPow.apply(null, arguments).exponent(0.5);
}

},{"./continuous":332,"./init":336,"./linear":337,"./log":338,"./pow":342,"./sequential":345,"./symlog":347}],334:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = identity;

var _array = require("./array");

var _linear = require("./linear");

var _number = _interopRequireDefault(require("./number"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function identity(domain) {
  var unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function (_) {
    return arguments.length ? (domain = _array.map.call(_, _number.default), scale) : domain.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return identity(domain).unknown(unknown);
  };

  domain = arguments.length ? _array.map.call(domain, _number.default) : [0, 1];
  return (0, _linear.linearish)(scale);
}

},{"./array":329,"./linear":337,"./number":340}],335:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "scaleBand", {
  enumerable: true,
  get: function () {
    return _band.default;
  }
});
Object.defineProperty(exports, "scalePoint", {
  enumerable: true,
  get: function () {
    return _band.point;
  }
});
Object.defineProperty(exports, "scaleIdentity", {
  enumerable: true,
  get: function () {
    return _identity.default;
  }
});
Object.defineProperty(exports, "scaleLinear", {
  enumerable: true,
  get: function () {
    return _linear.default;
  }
});
Object.defineProperty(exports, "scaleLog", {
  enumerable: true,
  get: function () {
    return _log.default;
  }
});
Object.defineProperty(exports, "scaleSymlog", {
  enumerable: true,
  get: function () {
    return _symlog.default;
  }
});
Object.defineProperty(exports, "scaleOrdinal", {
  enumerable: true,
  get: function () {
    return _ordinal.default;
  }
});
Object.defineProperty(exports, "scaleImplicit", {
  enumerable: true,
  get: function () {
    return _ordinal.implicit;
  }
});
Object.defineProperty(exports, "scalePow", {
  enumerable: true,
  get: function () {
    return _pow.default;
  }
});
Object.defineProperty(exports, "scaleSqrt", {
  enumerable: true,
  get: function () {
    return _pow.sqrt;
  }
});
Object.defineProperty(exports, "scaleQuantile", {
  enumerable: true,
  get: function () {
    return _quantile.default;
  }
});
Object.defineProperty(exports, "scaleQuantize", {
  enumerable: true,
  get: function () {
    return _quantize.default;
  }
});
Object.defineProperty(exports, "scaleThreshold", {
  enumerable: true,
  get: function () {
    return _threshold.default;
  }
});
Object.defineProperty(exports, "scaleTime", {
  enumerable: true,
  get: function () {
    return _time.default;
  }
});
Object.defineProperty(exports, "scaleUtc", {
  enumerable: true,
  get: function () {
    return _utcTime.default;
  }
});
Object.defineProperty(exports, "scaleSequential", {
  enumerable: true,
  get: function () {
    return _sequential.default;
  }
});
Object.defineProperty(exports, "scaleSequentialLog", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialLog;
  }
});
Object.defineProperty(exports, "scaleSequentialPow", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialPow;
  }
});
Object.defineProperty(exports, "scaleSequentialSqrt", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialSqrt;
  }
});
Object.defineProperty(exports, "scaleSequentialSymlog", {
  enumerable: true,
  get: function () {
    return _sequential.sequentialSymlog;
  }
});
Object.defineProperty(exports, "scaleSequentialQuantile", {
  enumerable: true,
  get: function () {
    return _sequentialQuantile.default;
  }
});
Object.defineProperty(exports, "scaleDiverging", {
  enumerable: true,
  get: function () {
    return _diverging.default;
  }
});
Object.defineProperty(exports, "scaleDivergingLog", {
  enumerable: true,
  get: function () {
    return _diverging.divergingLog;
  }
});
Object.defineProperty(exports, "scaleDivergingPow", {
  enumerable: true,
  get: function () {
    return _diverging.divergingPow;
  }
});
Object.defineProperty(exports, "scaleDivergingSqrt", {
  enumerable: true,
  get: function () {
    return _diverging.divergingSqrt;
  }
});
Object.defineProperty(exports, "scaleDivergingSymlog", {
  enumerable: true,
  get: function () {
    return _diverging.divergingSymlog;
  }
});
Object.defineProperty(exports, "tickFormat", {
  enumerable: true,
  get: function () {
    return _tickFormat.default;
  }
});

var _band = _interopRequireWildcard(require("./band"));

var _identity = _interopRequireDefault(require("./identity"));

var _linear = _interopRequireDefault(require("./linear"));

var _log = _interopRequireDefault(require("./log"));

var _symlog = _interopRequireDefault(require("./symlog"));

var _ordinal = _interopRequireWildcard(require("./ordinal"));

var _pow = _interopRequireWildcard(require("./pow"));

var _quantile = _interopRequireDefault(require("./quantile"));

var _quantize = _interopRequireDefault(require("./quantize"));

var _threshold = _interopRequireDefault(require("./threshold"));

var _time = _interopRequireDefault(require("./time"));

var _utcTime = _interopRequireDefault(require("./utcTime"));

var _sequential = _interopRequireWildcard(require("./sequential"));

var _sequentialQuantile = _interopRequireDefault(require("./sequentialQuantile"));

var _diverging = _interopRequireWildcard(require("./diverging"));

var _tickFormat = _interopRequireDefault(require("./tickFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./band":330,"./diverging":333,"./identity":334,"./linear":337,"./log":338,"./ordinal":341,"./pow":342,"./quantile":343,"./quantize":344,"./sequential":345,"./sequentialQuantile":346,"./symlog":347,"./threshold":348,"./tickFormat":349,"./time":350,"./utcTime":351}],336:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRange = initRange;
exports.initInterpolator = initInterpolator;

function initRange(domain, range) {
  switch (arguments.length) {
    case 0:
      break;

    case 1:
      this.range(domain);
      break;

    default:
      this.range(range).domain(domain);
      break;
  }

  return this;
}

function initInterpolator(domain, interpolator) {
  switch (arguments.length) {
    case 0:
      break;

    case 1:
      this.interpolator(domain);
      break;

    default:
      this.interpolator(interpolator).domain(domain);
      break;
  }

  return this;
}

},{}],337:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearish = linearish;
exports.default = linear;

var _d3Array = require("d3-array");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _init = require("./init");

var _tickFormat = _interopRequireDefault(require("./tickFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function linearish(scale) {
  var domain = scale.domain;

  scale.ticks = function (count) {
    var d = domain();
    return (0, _d3Array.ticks)(d[0], d[d.length - 1], count == null ? 10 : count);
  };

  scale.tickFormat = function (count, specifier) {
    var d = domain();
    return (0, _tickFormat.default)(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
  };

  scale.nice = function (count) {
    if (count == null) count = 10;
    var d = domain(),
        i0 = 0,
        i1 = d.length - 1,
        start = d[i0],
        stop = d[i1],
        step;

    if (stop < start) {
      step = start, start = stop, stop = step;
      step = i0, i0 = i1, i1 = step;
    }

    step = (0, _d3Array.tickIncrement)(start, stop, count);

    if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
      step = (0, _d3Array.tickIncrement)(start, stop, count);
    }

    if (step > 0) {
      d[i0] = Math.floor(start / step) * step;
      d[i1] = Math.ceil(stop / step) * step;
      domain(d);
    } else if (step < 0) {
      d[i0] = Math.ceil(start * step) / step;
      d[i1] = Math.floor(stop * step) / step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = (0, _continuous.default)(_continuous.identity, _continuous.identity);

  scale.copy = function () {
    return (0, _continuous.copy)(scale, linear());
  };

  _init.initRange.apply(scale, arguments);

  return linearish(scale);
}

},{"./continuous":332,"./init":336,"./tickFormat":349,"d3-array":14}],338:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loggish = loggish;
exports.default = log;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

var _nice = _interopRequireDefault(require("./nice"));

var _continuous = require("./continuous");

var _init = require("./init");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformLog(x) {
  return Math.log(x);
}

function transformExp(x) {
  return Math.exp(x);
}

function transformLogn(x) {
  return -Math.log(-x);
}

function transformExpn(x) {
  return -Math.exp(-x);
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10 : base === Math.E ? Math.exp : function (x) {
    return Math.pow(base, x);
  };
}

function logp(base) {
  return base === Math.E ? Math.log : base === 10 && Math.log10 || base === 2 && Math.log2 || (base = Math.log(base), function (x) {
    return Math.log(x) / base;
  });
}

function reflect(f) {
  return function (x) {
    return -f(-x);
  };
}

function loggish(transform) {
  var scale = transform(transformLog, transformExp),
      domain = scale.domain,
      base = 10,
      logs,
      pows;

  function rescale() {
    logs = logp(base), pows = powp(base);

    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }

    return scale;
  }

  scale.base = function (_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function (_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function (count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;
    if (r = v < u) i = u, u = v, v = i;
    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = (0, _d3Array.ticks)(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function (count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = (0, _d3Format.format)(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?

    return function (d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function () {
    return domain((0, _nice.default)(domain(), {
      floor: function (x) {
        return pows(Math.floor(logs(x)));
      },
      ceil: function (x) {
        return pows(Math.ceil(logs(x)));
      }
    }));
  };

  return scale;
}

function log() {
  var scale = loggish((0, _continuous.transformer)()).domain([1, 10]);

  scale.copy = function () {
    return (0, _continuous.copy)(scale, log()).base(scale.base());
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}

},{"./continuous":332,"./init":336,"./nice":339,"d3-array":14,"d3-format":130}],339:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(domain, interval) {
  domain = domain.slice();
  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

},{}],340:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return +x;
}

},{}],341:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ordinal;
exports.implicit = void 0;

var _d3Collection = require("d3-collection");

var _array = require("./array");

var _init = require("./init");

var implicit = {
  name: "implicit"
};
exports.implicit = implicit;

function ordinal() {
  var index = (0, _d3Collection.map)(),
      domain = [],
      range = [],
      unknown = implicit;

  function scale(d) {
    var key = d + "",
        i = index.get(key);

    if (!i) {
      if (unknown !== implicit) return unknown;
      index.set(key, i = domain.push(d));
    }

    return range[(i - 1) % range.length];
  }

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [], index = (0, _d3Collection.map)();
    var i = -1,
        n = _.length,
        d,
        key;

    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));

    return scale;
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), scale) : range.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return ordinal(domain, range).unknown(unknown);
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}

},{"./array":329,"./init":336,"d3-collection":51}],342:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.powish = powish;
exports.default = pow;
exports.sqrt = sqrt;

var _linear = require("./linear");

var _continuous = require("./continuous");

var _init = require("./init");

function transformPow(exponent) {
  return function (x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function transformSqrt(x) {
  return x < 0 ? -Math.sqrt(-x) : Math.sqrt(x);
}

function transformSquare(x) {
  return x < 0 ? -x * x : x * x;
}

function powish(transform) {
  var scale = transform(_continuous.identity, _continuous.identity),
      exponent = 1;

  function rescale() {
    return exponent === 1 ? transform(_continuous.identity, _continuous.identity) : exponent === 0.5 ? transform(transformSqrt, transformSquare) : transform(transformPow(exponent), transformPow(1 / exponent));
  }

  scale.exponent = function (_) {
    return arguments.length ? (exponent = +_, rescale()) : exponent;
  };

  return (0, _linear.linearish)(scale);
}

function pow() {
  var scale = powish((0, _continuous.transformer)());

  scale.copy = function () {
    return (0, _continuous.copy)(scale, pow()).exponent(scale.exponent());
  };

  _init.initRange.apply(scale, arguments);

  return scale;
}

function sqrt() {
  return pow.apply(null, arguments).exponent(0.5);
}

},{"./continuous":332,"./init":336,"./linear":337}],343:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantile;

var _d3Array = require("d3-array");

var _array = require("./array");

var _init = require("./init");

function quantile() {
  var domain = [],
      range = [],
      thresholds = [],
      unknown;

  function rescale() {
    var i = 0,
        n = Math.max(1, range.length);
    thresholds = new Array(n - 1);

    while (++i < n) thresholds[i - 1] = (0, _d3Array.quantile)(domain, i / n);

    return scale;
  }

  function scale(x) {
    return isNaN(x = +x) ? unknown : range[(0, _d3Array.bisect)(thresholds, x)];
  }

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : [i > 0 ? thresholds[i - 1] : domain[0], i < thresholds.length ? thresholds[i] : domain[domain.length - 1]];
  };

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];

    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);

    domain.sort(_d3Array.ascending);
    return rescale();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), rescale()) : range.slice();
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.quantiles = function () {
    return thresholds.slice();
  };

  scale.copy = function () {
    return quantile().domain(domain).range(range).unknown(unknown);
  };

  return _init.initRange.apply(scale, arguments);
}

},{"./array":329,"./init":336,"d3-array":14}],344:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = quantize;

var _d3Array = require("d3-array");

var _array = require("./array");

var _linear = require("./linear");

var _init = require("./init");

function quantize() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range = [0, 1],
      unknown;

  function scale(x) {
    return x <= x ? range[(0, _d3Array.bisect)(domain, x, 0, n)] : unknown;
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);

    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);

    return scale;
  }

  scale.domain = function (_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function (_) {
    return arguments.length ? (n = (range = _array.slice.call(_)).length - 1, rescale()) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return i < 0 ? [NaN, NaN] : i < 1 ? [x0, domain[0]] : i >= n ? [domain[n - 1], x1] : [domain[i - 1], domain[i]];
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : scale;
  };

  scale.thresholds = function () {
    return domain.slice();
  };

  scale.copy = function () {
    return quantize().domain([x0, x1]).range(range).unknown(unknown);
  };

  return _init.initRange.apply((0, _linear.linearish)(scale), arguments);
}

},{"./array":329,"./init":336,"./linear":337,"d3-array":14}],345:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;
exports.default = sequential;
exports.sequentialLog = sequentialLog;
exports.sequentialSymlog = sequentialSymlog;
exports.sequentialPow = sequentialPow;
exports.sequentialSqrt = sequentialSqrt;

var _continuous = require("./continuous");

var _init = require("./init");

var _linear = require("./linear");

var _log = require("./log");

var _symlog = require("./symlog");

var _pow = require("./pow");

function transformer() {
  var x0 = 0,
      x1 = 1,
      t0,
      t1,
      k10,
      transform,
      interpolator = _continuous.identity,
      clamp = false,
      unknown;

  function scale(x) {
    return isNaN(x = +x) ? unknown : interpolator(k10 === 0 ? 0.5 : (x = (transform(x) - t0) * k10, clamp ? Math.max(0, Math.min(1, x)) : x));
  }

  scale.domain = function (_) {
    return arguments.length ? (t0 = transform(x0 = +_[0]), t1 = transform(x1 = +_[1]), k10 = t0 === t1 ? 0 : 1 / (t1 - t0), scale) : [x0, x1];
  };

  scale.clamp = function (_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  return function (t) {
    transform = t, t0 = t(x0), t1 = t(x1), k10 = t0 === t1 ? 0 : 1 / (t1 - t0);
    return scale;
  };
}

function copy(source, target) {
  return target.domain(source.domain()).interpolator(source.interpolator()).clamp(source.clamp()).unknown(source.unknown());
}

function sequential() {
  var scale = (0, _linear.linearish)(transformer()(_continuous.identity));

  scale.copy = function () {
    return copy(scale, sequential());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialLog() {
  var scale = (0, _log.loggish)(transformer()).domain([1, 10]);

  scale.copy = function () {
    return copy(scale, sequentialLog()).base(scale.base());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialSymlog() {
  var scale = (0, _symlog.symlogish)(transformer());

  scale.copy = function () {
    return copy(scale, sequentialSymlog()).constant(scale.constant());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialPow() {
  var scale = (0, _pow.powish)(transformer());

  scale.copy = function () {
    return copy(scale, sequentialPow()).exponent(scale.exponent());
  };

  return _init.initInterpolator.apply(scale, arguments);
}

function sequentialSqrt() {
  return sequentialPow.apply(null, arguments).exponent(0.5);
}

},{"./continuous":332,"./init":336,"./linear":337,"./log":338,"./pow":342,"./symlog":347}],346:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sequentialQuantile;

var _d3Array = require("d3-array");

var _continuous = require("./continuous");

var _init = require("./init");

function sequentialQuantile() {
  var domain = [],
      interpolator = _continuous.identity;

  function scale(x) {
    if (!isNaN(x = +x)) return interpolator(((0, _d3Array.bisect)(domain, x) - 1) / (domain.length - 1));
  }

  scale.domain = function (_) {
    if (!arguments.length) return domain.slice();
    domain = [];

    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);

    domain.sort(_d3Array.ascending);
    return scale;
  };

  scale.interpolator = function (_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function () {
    return sequentialQuantile(interpolator).domain(domain);
  };

  return _init.initInterpolator.apply(scale, arguments);
}

},{"./continuous":332,"./init":336,"d3-array":14}],347:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.symlogish = symlogish;
exports.default = symlog;

var _linear = require("./linear");

var _continuous = require("./continuous");

var _init = require("./init");

function transformSymlog(c) {
  return function (x) {
    return Math.sign(x) * Math.log1p(Math.abs(x / c));
  };
}

function transformSymexp(c) {
  return function (x) {
    return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
  };
}

function symlogish(transform) {
  var c = 1,
      scale = transform(transformSymlog(c), transformSymexp(c));

  scale.constant = function (_) {
    return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
  };

  return (0, _linear.linearish)(scale);
}

function symlog() {
  var scale = symlogish((0, _continuous.transformer)());

  scale.copy = function () {
    return (0, _continuous.copy)(scale, symlog()).constant(scale.constant());
  };

  return _init.initRange.apply(scale, arguments);
}

},{"./continuous":332,"./init":336,"./linear":337}],348:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = threshold;

var _d3Array = require("d3-array");

var _array = require("./array");

var _init = require("./init");

function threshold() {
  var domain = [0.5],
      range = [0, 1],
      unknown,
      n = 1;

  function scale(x) {
    return x <= x ? range[(0, _d3Array.bisect)(domain, x, 0, n)] : unknown;
  }

  scale.domain = function (_) {
    return arguments.length ? (domain = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
  };

  scale.range = function (_) {
    return arguments.length ? (range = _array.slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
  };

  scale.invertExtent = function (y) {
    var i = range.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.unknown = function (_) {
    return arguments.length ? (unknown = _, scale) : unknown;
  };

  scale.copy = function () {
    return threshold().domain(domain).range(range).unknown(unknown);
  };

  return _init.initRange.apply(scale, arguments);
}

},{"./array":329,"./init":336,"d3-array":14}],349:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Format = require("d3-format");

function _default(start, stop, count, specifier) {
  var step = (0, _d3Array.tickStep)(start, stop, count),
      precision;
  specifier = (0, _d3Format.formatSpecifier)(specifier == null ? ",f" : specifier);

  switch (specifier.type) {
    case "s":
      {
        var value = Math.max(Math.abs(start), Math.abs(stop));
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionPrefix)(step, value))) specifier.precision = precision;
        return (0, _d3Format.formatPrefix)(specifier, value);
      }

    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionRound)(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
        break;
      }

    case "f":
    case "%":
      {
        if (specifier.precision == null && !isNaN(precision = (0, _d3Format.precisionFixed)(step))) specifier.precision = precision - (specifier.type === "%") * 2;
        break;
      }
  }

  return (0, _d3Format.format)(specifier);
}

},{"d3-array":14,"d3-format":130}],350:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendar = calendar;
exports.default = _default;

var _d3Array = require("d3-array");

var _d3Time = require("d3-time");

var _d3TimeFormat = require("d3-time-format");

var _array = require("./array");

var _continuous = _interopRequireWildcard(require("./continuous"));

var _init = require("./init");

var _nice = _interopRequireDefault(require("./nice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var durationSecond = 1000,
    durationMinute = durationSecond * 60,
    durationHour = durationMinute * 60,
    durationDay = durationHour * 24,
    durationWeek = durationDay * 7,
    durationMonth = durationDay * 30,
    durationYear = durationDay * 365;

function date(t) {
  return new Date(t);
}

function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(year, month, week, day, hour, minute, second, millisecond, format) {
  var scale = (0, _continuous.default)(_continuous.identity, _continuous.identity),
      invert = scale.invert,
      domain = scale.domain;
  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");
  var tickIntervals = [[second, 1, durationSecond], [second, 5, 5 * durationSecond], [second, 15, 15 * durationSecond], [second, 30, 30 * durationSecond], [minute, 1, durationMinute], [minute, 5, 5 * durationMinute], [minute, 15, 15 * durationMinute], [minute, 30, 30 * durationMinute], [hour, 1, durationHour], [hour, 3, 3 * durationHour], [hour, 6, 6 * durationHour], [hour, 12, 12 * durationHour], [day, 1, durationDay], [day, 2, 2 * durationDay], [week, 1, durationWeek], [month, 1, durationMonth], [month, 3, 3 * durationMonth], [year, 1, durationYear]];

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond : minute(date) < date ? formatSecond : hour(date) < date ? formatMinute : day(date) < date ? formatHour : month(date) < date ? week(date) < date ? formatDay : formatWeek : year(date) < date ? formatMonth : formatYear)(date);
  }

  function tickInterval(interval, start, stop, step) {
    if (interval == null) interval = 10; // If a desired tick count is specified, pick a reasonable tick interval
    // based on the extent of the domain and a rough estimate of tick size.
    // Otherwise, assume interval is already a time interval and use it.

    if (typeof interval === "number") {
      var target = Math.abs(stop - start) / interval,
          i = (0, _d3Array.bisector)(function (i) {
        return i[2];
      }).right(tickIntervals, target);

      if (i === tickIntervals.length) {
        step = (0, _d3Array.tickStep)(start / durationYear, stop / durationYear, interval);
        interval = year;
      } else if (i) {
        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
        step = i[1];
        interval = i[0];
      } else {
        step = Math.max((0, _d3Array.tickStep)(start, stop, interval), 1);
        interval = millisecond;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function (y) {
    return new Date(invert(y));
  };

  scale.domain = function (_) {
    return arguments.length ? domain(_array.map.call(_, number)) : domain().map(date);
  };

  scale.ticks = function (interval, step) {
    var d = domain(),
        t0 = d[0],
        t1 = d[d.length - 1],
        r = t1 < t0,
        t;
    if (r) t = t0, t0 = t1, t1 = t;
    t = tickInterval(interval, t0, t1, step);
    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop

    return r ? t.reverse() : t;
  };

  scale.tickFormat = function (count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function (interval, step) {
    var d = domain();
    return (interval = tickInterval(interval, d[0], d[d.length - 1], step)) ? domain((0, _nice.default)(d, interval)) : scale;
  };

  scale.copy = function () {
    return (0, _continuous.copy)(scale, calendar(year, month, week, day, hour, minute, second, millisecond, format));
  };

  return scale;
}

function _default() {
  return _init.initRange.apply(calendar(_d3Time.timeYear, _d3Time.timeMonth, _d3Time.timeWeek, _d3Time.timeDay, _d3Time.timeHour, _d3Time.timeMinute, _d3Time.timeSecond, _d3Time.timeMillisecond, _d3TimeFormat.timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
}

},{"./array":329,"./continuous":332,"./init":336,"./nice":339,"d3-array":14,"d3-time":463,"d3-time-format":456}],351:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _time = require("./time");

var _d3TimeFormat = require("d3-time-format");

var _d3Time = require("d3-time");

var _init = require("./init");

function _default() {
  return _init.initRange.apply((0, _time.calendar)(_d3Time.utcYear, _d3Time.utcMonth, _d3Time.utcWeek, _d3Time.utcDay, _d3Time.utcHour, _d3Time.utcMinute, _d3Time.utcSecond, _d3Time.utcMillisecond, _d3TimeFormat.utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]), arguments);
}

},{"./init":336,"./time":350,"d3-time":463,"d3-time-format":456}],352:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],353:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("./creator"));

var _select = _interopRequireDefault(require("./select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return (0, _select.default)((0, _creator.default)(name).call(document.documentElement));
}

},{"./creator":354,"./select":362}],354:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = require("./namespaces");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces.xhtml && document.documentElement.namespaceURI === _namespaces.xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function _default(name) {
  var fullname = (0, _namespace.default)(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

},{"./namespace":359,"./namespaces":360}],355:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "creator", {
  enumerable: true,
  get: function () {
    return _creator.default;
  }
});
Object.defineProperty(exports, "local", {
  enumerable: true,
  get: function () {
    return _local.default;
  }
});
Object.defineProperty(exports, "matcher", {
  enumerable: true,
  get: function () {
    return _matcher.default;
  }
});
Object.defineProperty(exports, "mouse", {
  enumerable: true,
  get: function () {
    return _mouse.default;
  }
});
Object.defineProperty(exports, "namespace", {
  enumerable: true,
  get: function () {
    return _namespace.default;
  }
});
Object.defineProperty(exports, "namespaces", {
  enumerable: true,
  get: function () {
    return _namespaces.default;
  }
});
Object.defineProperty(exports, "clientPoint", {
  enumerable: true,
  get: function () {
    return _point.default;
  }
});
Object.defineProperty(exports, "select", {
  enumerable: true,
  get: function () {
    return _select.default;
  }
});
Object.defineProperty(exports, "selectAll", {
  enumerable: true,
  get: function () {
    return _selectAll.default;
  }
});
Object.defineProperty(exports, "selection", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "selector", {
  enumerable: true,
  get: function () {
    return _selector.default;
  }
});
Object.defineProperty(exports, "selectorAll", {
  enumerable: true,
  get: function () {
    return _selectorAll.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.styleValue;
  }
});
Object.defineProperty(exports, "touch", {
  enumerable: true,
  get: function () {
    return _touch.default;
  }
});
Object.defineProperty(exports, "touches", {
  enumerable: true,
  get: function () {
    return _touches.default;
  }
});
Object.defineProperty(exports, "window", {
  enumerable: true,
  get: function () {
    return _window.default;
  }
});
Object.defineProperty(exports, "event", {
  enumerable: true,
  get: function () {
    return _on.event;
  }
});
Object.defineProperty(exports, "customEvent", {
  enumerable: true,
  get: function () {
    return _on.customEvent;
  }
});

var _create = _interopRequireDefault(require("./create"));

var _creator = _interopRequireDefault(require("./creator"));

var _local = _interopRequireDefault(require("./local"));

var _matcher = _interopRequireDefault(require("./matcher"));

var _mouse = _interopRequireDefault(require("./mouse"));

var _namespace = _interopRequireDefault(require("./namespace"));

var _namespaces = _interopRequireDefault(require("./namespaces"));

var _point = _interopRequireDefault(require("./point"));

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _index = _interopRequireDefault(require("./selection/index"));

var _selector = _interopRequireDefault(require("./selector"));

var _selectorAll = _interopRequireDefault(require("./selectorAll"));

var _style = require("./selection/style");

var _touch = _interopRequireDefault(require("./touch"));

var _touches = _interopRequireDefault(require("./touches"));

var _window = _interopRequireDefault(require("./window"));

var _on = require("./selection/on");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./create":353,"./creator":354,"./local":356,"./matcher":357,"./mouse":358,"./namespace":359,"./namespaces":360,"./point":361,"./select":362,"./selectAll":363,"./selection/index":378,"./selection/on":385,"./selection/style":395,"./selector":397,"./selectorAll":398,"./touch":400,"./touches":401,"./window":402}],356:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = local;
var nextId = 0;

function local() {
  return new Local();
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function (node) {
    var id = this._;

    while (!(id in node)) if (!(node = node.parentNode)) return;

    return node[id];
  },
  set: function (node, value) {
    return node[this._] = value;
  },
  remove: function (node) {
    return this._ in node && delete node[this._];
  },
  toString: function () {
    return this._;
  }
};

},{}],357:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(selector) {
  return function () {
    return this.matches(selector);
  };
}

},{}],358:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node) {
  var event = (0, _sourceEvent.default)();
  if (event.changedTouches) event = event.changedTouches[0];
  return (0, _point.default)(node, event);
}

},{"./point":361,"./sourceEvent":399}],359:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespaces = _interopRequireDefault(require("./namespaces"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces.default.hasOwnProperty(prefix) ? {
    space: _namespaces.default[prefix],
    local: name
  } : name;
}

},{"./namespaces":360}],360:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.xhtml = void 0;
var xhtml = "http://www.w3.org/1999/xhtml";
exports.xhtml = xhtml;
var _default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
exports.default = _default;

},{}],361:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

},{}],362:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([[document.querySelector(selector)]], [document.documentElement]) : new _index.Selection([[selector]], _index.root);
}

},{"./selection/index":378}],363:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./selection/index");

function _default(selector) {
  return typeof selector === "string" ? new _index.Selection([document.querySelectorAll(selector)], [document.documentElement]) : new _index.Selection([selector == null ? [] : selector], _index.root);
}

},{"./selection/index":378}],364:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
}

},{"../creator":354}],365:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _namespace = _interopRequireDefault(require("../namespace"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function _default(name, value) {
  var fullname = (0, _namespace.default)(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

},{"../namespace":359}],366:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

},{}],367:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function (name) {
    var i = this._names.indexOf(name);

    if (i < 0) {
      this._names.push(name);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function (name) {
    var i = this._names.indexOf(name);

    if (i >= 0) {
      this._names.splice(i, 1);

      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function (name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;

  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function _default(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;

    while (++i < n) if (!list.contains(names[i])) return false;

    return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

},{}],368:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function selection_cloneShallow() {
  var clone = this.cloneNode(false),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true),
      parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function _default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

},{}],369:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _enter = require("./enter");

var _constant = _interopRequireDefault(require("../constant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length; // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.

  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Put any non-null nodes that don’t fit into exit.


  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue; // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.

  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);

      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  } // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.


  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);

    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new _enter.EnterNode(parent, data[i]);
    }
  } // Add any remaining nodes that were not bound to data to exit.


  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

function _default(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;
  if (typeof value !== "function") value = (0, _constant.default)(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key); // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.

    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;

        while (!(next = updateGroup[i1]) && ++i1 < dataLength);

        previous._next = next || null;
      }
    }
  }

  update = new _index.Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

},{"../constant":352,"./enter":374,"./index":378}],370:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

},{}],371:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatchEvent(node, type, params) {
  var window = (0, _window.default)(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function _default(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

},{"../window":402}],372:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

},{}],373:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return !this.node();
}

},{}],374:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.EnterNode = EnterNode;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._enter || this._groups.map(_sparse.default), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function (child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function (child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function (selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function (selector) {
    return this._parent.querySelectorAll(selector);
  }
};

},{"./index":378,"./sparse":394}],375:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sparse = _interopRequireDefault(require("./sparse"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return new _index.Selection(this._exit || this._groups.map(_sparse.default), this._parents);
}

},{"./index":378,"./sparse":394}],376:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _matcher = _interopRequireDefault(require("../matcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(match) {
  if (typeof match !== "function") match = (0, _matcher.default)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}

},{"../matcher":357,"./index":378}],377:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

},{}],378:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Selection = Selection;
exports.default = exports.root = void 0;

var _select = _interopRequireDefault(require("./select"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _filter = _interopRequireDefault(require("./filter"));

var _data = _interopRequireDefault(require("./data"));

var _enter = _interopRequireDefault(require("./enter"));

var _exit = _interopRequireDefault(require("./exit"));

var _join = _interopRequireDefault(require("./join"));

var _merge = _interopRequireDefault(require("./merge"));

var _order = _interopRequireDefault(require("./order"));

var _sort = _interopRequireDefault(require("./sort"));

var _call = _interopRequireDefault(require("./call"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _node = _interopRequireDefault(require("./node"));

var _size = _interopRequireDefault(require("./size"));

var _empty = _interopRequireDefault(require("./empty"));

var _each = _interopRequireDefault(require("./each"));

var _attr = _interopRequireDefault(require("./attr"));

var _style = _interopRequireDefault(require("./style"));

var _property = _interopRequireDefault(require("./property"));

var _classed = _interopRequireDefault(require("./classed"));

var _text = _interopRequireDefault(require("./text"));

var _html = _interopRequireDefault(require("./html"));

var _raise = _interopRequireDefault(require("./raise"));

var _lower = _interopRequireDefault(require("./lower"));

var _append = _interopRequireDefault(require("./append"));

var _insert = _interopRequireDefault(require("./insert"));

var _remove = _interopRequireDefault(require("./remove"));

var _clone = _interopRequireDefault(require("./clone"));

var _datum = _interopRequireDefault(require("./datum"));

var _on = _interopRequireDefault(require("./on"));

var _dispatch = _interopRequireDefault(require("./dispatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = [null];
exports.root = root;

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  data: _data.default,
  enter: _enter.default,
  exit: _exit.default,
  join: _join.default,
  merge: _merge.default,
  order: _order.default,
  sort: _sort.default,
  call: _call.default,
  nodes: _nodes.default,
  node: _node.default,
  size: _size.default,
  empty: _empty.default,
  each: _each.default,
  attr: _attr.default,
  style: _style.default,
  property: _property.default,
  classed: _classed.default,
  text: _text.default,
  html: _html.default,
  raise: _raise.default,
  lower: _lower.default,
  append: _append.default,
  insert: _insert.default,
  remove: _remove.default,
  clone: _clone.default,
  datum: _datum.default,
  on: _on.default,
  dispatch: _dispatch.default
};
var _default = selection;
exports.default = _default;

},{"./append":364,"./attr":365,"./call":366,"./classed":367,"./clone":368,"./data":369,"./datum":370,"./dispatch":371,"./each":372,"./empty":373,"./enter":374,"./exit":375,"./filter":376,"./html":377,"./insert":379,"./join":380,"./lower":381,"./merge":382,"./node":383,"./nodes":384,"./on":385,"./order":386,"./property":387,"./raise":388,"./remove":389,"./select":390,"./selectAll":391,"./size":392,"./sort":393,"./style":395,"./text":396}],379:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _creator = _interopRequireDefault(require("../creator"));

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constantNull() {
  return null;
}

function _default(name, before) {
  var create = typeof name === "function" ? name : (0, _creator.default)(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0, _selector.default)(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

},{"../creator":354,"../selector":397}],380:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

},{}],381:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function _default() {
  return this.each(lower);
}

},{}],382:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(selection) {
  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Selection(merges, this._parents);
}

},{"./index":378}],383:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

},{}],384:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
}

},{}],385:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.customEvent = customEvent;
exports.event = void 0;
var filterEvents = {};
var event = null;
exports.event = event;

if (typeof document !== "undefined") {
  var element = document.documentElement;

  if (!("onmouseenter" in element)) {
    filterEvents = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;

    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).

    exports.event = event = event1;

    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {
      type: t,
      name: name
    };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;

    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }

    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {
      type: typename.type,
      name: typename.name,
      value: value,
      listener: listener,
      capture: capture
    };
    if (!on) this.__on = [o];else on.push(o);
  };
}

function _default(typename, value, capture) {
  var typenames = parseTypenames(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;

    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;

  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));

  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  exports.event = event = event1;

  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event = event0;
  }
}

},{}],386:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

},{}],387:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

function _default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

},{}],388:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function _default() {
  return this.each(raise);
}

},{}],389:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function _default() {
  return this.each(remove);
}

},{}],390:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selector = _interopRequireDefault(require("../selector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selector.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index.Selection(subgroups, this._parents);
}

},{"../selector":397,"./index":378}],391:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

var _selectorAll = _interopRequireDefault(require("../selectorAll"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(select) {
  if (typeof select !== "function") select = (0, _selectorAll.default)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index.Selection(subgroups, parents);
}

},{"../selectorAll":398,"./index":378}],392:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
}

},{}],393:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index");

function _default(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }

    sortgroup.sort(compareNode);
  }

  return new _index.Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

},{"./index":378}],394:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(update) {
  return new Array(update.length);
}

},{}],395:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.styleValue = styleValue;

var _window = _interopRequireDefault(require("../window"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

function _default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name) || (0, _window.default)(node).getComputedStyle(node, null).getPropertyValue(name);
}

},{"../window":402}],396:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function _default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

},{}],397:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function none() {}

function _default(selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
}

},{}],398:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function empty() {
  return [];
}

function _default(selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
}

},{}],399:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _on = require("./selection/on");

function _default() {
  var current = _on.event,
      source;

  while (source = current.sourceEvent) current = source;

  return current;
}

},{"./selection/on":385}],400:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = (0, _sourceEvent.default)().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return (0, _point.default)(node, touch);
    }
  }

  return null;
}

},{"./point":361,"./sourceEvent":399}],401:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _sourceEvent = _interopRequireDefault(require("./sourceEvent"));

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(node, touches) {
  if (touches == null) touches = (0, _sourceEvent.default)().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = (0, _point.default)(node, touches[i]);
  }

  return points;
}

},{"./point":361,"./sourceEvent":399}],402:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
  node.document && node // node is a Window
  || node.defaultView; // node is a Document
}

},{}],403:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant.js"));

var _math = require("./math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0,
      y10 = y1 - y0,
      x32 = x3 - x2,
      y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < _math.epsilon) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
} // Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html


function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / (0, _math.sqrt)(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * (0, _math.sqrt)((0, _math.max)(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00; // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?

  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function _default() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = (0, _constant.default)(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - _math.halfPi,
        a1 = endAngle.apply(this, arguments) - _math.halfPi,
        da = (0, _math.abs)(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = (0, _d3Path.path)(); // Ensure that the outer radius is always larger than the inner radius.

    if (r1 < r0) r = r1, r1 = r0, r0 = r; // Is it a point?

    if (!(r1 > _math.epsilon)) context.moveTo(0, 0); // Or is it a circle or annulus?
    else if (da > _math.tau - _math.epsilon) {
        context.moveTo(r1 * (0, _math.cos)(a0), r1 * (0, _math.sin)(a0));
        context.arc(0, 0, r1, a0, a1, !cw);

        if (r0 > _math.epsilon) {
          context.moveTo(r0 * (0, _math.cos)(a1), r0 * (0, _math.sin)(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      } // Or is it a circular or annular sector?
      else {
          var a01 = a0,
              a11 = a1,
              a00 = a0,
              a10 = a1,
              da0 = da,
              da1 = da,
              ap = padAngle.apply(this, arguments) / 2,
              rp = ap > _math.epsilon && (padRadius ? +padRadius.apply(this, arguments) : (0, _math.sqrt)(r0 * r0 + r1 * r1)),
              rc = (0, _math.min)((0, _math.abs)(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1; // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.

          if (rp > _math.epsilon) {
            var p0 = (0, _math.asin)(rp / r0 * (0, _math.sin)(ap)),
                p1 = (0, _math.asin)(rp / r1 * (0, _math.sin)(ap));
            if ((da0 -= p0 * 2) > _math.epsilon) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > _math.epsilon) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * (0, _math.cos)(a01),
              y01 = r1 * (0, _math.sin)(a01),
              x10 = r0 * (0, _math.cos)(a10),
              y10 = r0 * (0, _math.sin)(a10); // Apply rounded corners?

          if (rc > _math.epsilon) {
            var x11 = r1 * (0, _math.cos)(a11),
                y11 = r1 * (0, _math.sin)(a11),
                x00 = r0 * (0, _math.cos)(a00),
                y00 = r0 * (0, _math.sin)(a00),
                oc; // Restrict the corner radius according to the sector angle.

            if (da < _math.pi && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
              var ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / (0, _math.sin)((0, _math.acos)((ax * bx + ay * by) / ((0, _math.sqrt)(ax * ax + ay * ay) * (0, _math.sqrt)(bx * bx + by * by))) / 2),
                  lc = (0, _math.sqrt)(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = (0, _math.min)(rc, (r0 - lc) / (kc - 1));
              rc1 = (0, _math.min)(rc, (r1 - lc) / (kc + 1));
            }
          } // Is the sector collapsed to a line?


          if (!(da1 > _math.epsilon)) context.moveTo(x01, y01); // Does the sector’s outer ring have rounded corners?
          else if (rc1 > _math.epsilon) {
              t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
              t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
              context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

              if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, (0, _math.atan2)(t0.y01, t0.x01), (0, _math.atan2)(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc1, (0, _math.atan2)(t0.y01, t0.x01), (0, _math.atan2)(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r1, (0, _math.atan2)(t0.cy + t0.y11, t0.cx + t0.x11), (0, _math.atan2)(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                  context.arc(t1.cx, t1.cy, rc1, (0, _math.atan2)(t1.y11, t1.x11), (0, _math.atan2)(t1.y01, t1.x01), !cw);
                }
            } // Or is the outer ring just a circular arc?
            else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw); // Is there no inner ring, and it’s a circular sector?
          // Or perhaps it’s an annular sector collapsed due to padding?

          if (!(r0 > _math.epsilon) || !(da0 > _math.epsilon)) context.lineTo(x10, y10); // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > _math.epsilon) {
              t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
              t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
              context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01); // Have the corners merged?

              if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, (0, _math.atan2)(t0.y01, t0.x01), (0, _math.atan2)(t1.y01, t1.x01), !cw); // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc0, (0, _math.atan2)(t0.y01, t0.x01), (0, _math.atan2)(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r0, (0, _math.atan2)(t0.cy + t0.y11, t0.cx + t0.x11), (0, _math.atan2)(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                  context.arc(t1.cx, t1.cy, rc0, (0, _math.atan2)(t1.y11, t1.x11), (0, _math.atan2)(t1.y01, t1.x01), !cw);
                }
            } // Or is the inner ring just a circular arc?
            else context.arc(0, 0, r0, a10, a00, cw);
        }
    context.closePath();
    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function () {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - _math.pi / 2;
    return [(0, _math.cos)(a) * r, (0, _math.sin)(a) * r];
  };

  arc.innerRadius = function (_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), arc) : padAngle;
  };

  arc.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };

  return arc;
}

},{"./constant.js":407,"./math.js":430,"d3-path":251}],404:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant.js"));

var _linear = _interopRequireDefault(require("./curve/linear.js"));

var _line = _interopRequireDefault(require("./line.js"));

var _point = require("./point.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x0 = _point.x,
      x1 = null,
      y0 = (0, _constant.default)(0),
      y1 = _point.y,
      defined = (0, _constant.default)(true),
      context = null,
      curve = _linear.default,
      output = null;

  function area(data) {
    var i,
        j,
        k,
        n = data.length,
        d,
        defined0 = false,
        buffer,
        x0z = new Array(n),
        y0z = new Array(n);
    if (context == null) output = curve(buffer = (0, _d3Path.path)());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) {
          j = i;
          output.areaStart();
          output.lineStart();
        } else {
          output.lineEnd();
          output.lineStart();

          for (k = i - 1; k >= j; --k) {
            output.point(x0z[k], y0z[k]);
          }

          output.lineEnd();
          output.areaEnd();
        }
      }

      if (defined0) {
        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
      }
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  function arealine() {
    return (0, _line.default)().defined(defined).curve(curve).context(context);
  }

  area.x = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), x1 = null, area) : x0;
  };

  area.x0 = function (_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : x0;
  };

  area.x1 = function (_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : x1;
  };

  area.y = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), y1 = null, area) : y0;
  };

  area.y0 = function (_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : y0;
  };

  area.y1 = function (_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : (0, _constant.default)(+_), area) : y1;
  };

  area.lineX0 = area.lineY0 = function () {
    return arealine().x(x0).y(y0);
  };

  area.lineY1 = function () {
    return arealine().x(x0).y(y1);
  };

  area.lineX1 = function () {
    return arealine().x(x1).y(y0);
  };

  area.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : (0, _constant.default)(!!_), area) : defined;
  };

  area.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
}

},{"./constant.js":407,"./curve/linear.js":418,"./line.js":427,"./point.js":444,"d3-path":251}],405:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _radial = _interopRequireWildcard(require("./curve/radial.js"));

var _area = _interopRequireDefault(require("./area.js"));

var _lineRadial = require("./lineRadial.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default() {
  var a = (0, _area.default)().curve(_radial.curveRadialLinear),
      c = a.curve,
      x0 = a.lineX0,
      x1 = a.lineX1,
      y0 = a.lineY0,
      y1 = a.lineY1;
  a.angle = a.x, delete a.x;
  a.startAngle = a.x0, delete a.x0;
  a.endAngle = a.x1, delete a.x1;
  a.radius = a.y, delete a.y;
  a.innerRadius = a.y0, delete a.y0;
  a.outerRadius = a.y1, delete a.y1;
  a.lineStartAngle = function () {
    return (0, _lineRadial.lineRadial)(x0());
  }, delete a.lineX0;
  a.lineEndAngle = function () {
    return (0, _lineRadial.lineRadial)(x1());
  }, delete a.lineX1;
  a.lineInnerRadius = function () {
    return (0, _lineRadial.lineRadial)(y0());
  }, delete a.lineY0;
  a.lineOuterRadius = function () {
    return (0, _lineRadial.lineRadial)(y1());
  }, delete a.lineY1;

  a.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };

  return a;
}

},{"./area.js":404,"./curve/radial.js":422,"./lineRadial.js":428}],406:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],407:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x) {
  return function constant() {
    return x;
  };
}

},{}],408:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.Basis = Basis;
exports.default = _default;

function point(that, x, y) {
  that._context.bezierCurveTo((2 * that._x0 + that._x1) / 3, (2 * that._y0 + that._y1) / 3, (that._x0 + 2 * that._x1) / 3, (that._y0 + 2 * that._y1) / 3, (that._x0 + 4 * that._x1 + x) / 6, (that._y0 + 4 * that._y1 + y) / 6);
}

function Basis(context) {
  this._context = context;
}

Basis.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        point(this, this._x1, this._y1);
      // proceed

      case 2:
        this._context.lineTo(this._x1, this._y1);

        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;

        this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);

      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new Basis(context);
}

},{}],409:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _noop = _interopRequireDefault(require("../noop.js"));

var _basis = require("./basis.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BasisClosed(context) {
  this._context = context;
}

BasisClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x2, this._y2);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3);

          this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x2, this._y2);
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x2 = x, this._y2 = y;
        break;

      case 1:
        this._point = 2;
        this._x3 = x, this._y3 = y;
        break;

      case 2:
        this._point = 3;
        this._x4 = x, this._y4 = y;

        this._context.moveTo((this._x0 + 4 * this._x1 + x) / 6, (this._y0 + 4 * this._y1 + y) / 6);

        break;

      default:
        (0, _basis.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new BasisClosed(context);
}

},{"../noop.js":431,"./basis.js":408}],410:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _basis = require("./basis.js");

function BasisOpen(context) {
  this._context = context;
}

BasisOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        var x0 = (this._x0 + 4 * this._x1 + x) / 6,
            y0 = (this._y0 + 4 * this._y1 + y) / 6;
        this._line ? this._context.lineTo(x0, y0) : this._context.moveTo(x0, y0);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _basis.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
  }
};

function _default(context) {
  return new BasisOpen(context);
}

},{"./basis.js":408}],411:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _basis = require("./basis.js");

function Bundle(context, beta) {
  this._basis = new _basis.Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function () {
    this._x = [];
    this._y = [];

    this._basis.lineStart();
  },
  lineEnd: function () {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;

        this._basis.point(this._beta * x[i] + (1 - this._beta) * (x0 + t * dx), this._beta * y[i] + (1 - this._beta) * (y0 + t * dy));
      }
    }

    this._x = this._y = null;

    this._basis.lineEnd();
  },
  point: function (x, y) {
    this._x.push(+x);

    this._y.push(+y);
  }
};

var _default = function custom(beta) {
  function bundle(context) {
    return beta === 1 ? new _basis.Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function (beta) {
    return custom(+beta);
  };

  return bundle;
}(0.85);

exports.default = _default;

},{"./basis.js":408}],412:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.Cardinal = Cardinal;
exports.default = void 0;

function point(that, x, y) {
  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);

        break;

      case 3:
        point(this, this._x1, this._y1);
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        this._x1 = x, this._y1 = y;
        break;

      case 2:
        this._point = 3;
      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;

},{}],413:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardinalClosed = CardinalClosed;
exports.default = void 0;

var _noop = _interopRequireDefault(require("../noop.js"));

var _cardinal = require("./cardinal.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.lineTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x, this._y3 = y;
        break;

      case 1:
        this._point = 2;

        this._context.moveTo(this._x4 = x, this._y4 = y);

        break;

      case 2:
        this._point = 3;
        this._x5 = x, this._y5 = y;
        break;

      default:
        (0, _cardinal.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;

},{"../noop.js":431,"./cardinal.js":412}],414:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CardinalOpen = CardinalOpen;
exports.default = void 0;

var _cardinal = require("./cardinal.js");

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _cardinal.point)(this, x, y);
        break;
    }

    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(tension) {
  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal.tension = function (tension) {
    return custom(+tension);
  };

  return cardinal;
}(0);

exports.default = _default;

},{"./cardinal.js":412}],415:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.point = point;
exports.default = void 0;

var _math = require("../math.js");

var _cardinal = require("./cardinal.js");

function point(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > _math.epsilon) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > _math.epsilon) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);

        break;

      case 3:
        this.point(this._x2, this._y2);
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
      // proceed

      default:
        point(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new _cardinal.Cardinal(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;

},{"../math.js":430,"./cardinal.js":412}],416:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cardinalClosed = require("./cardinalClosed.js");

var _noop = _interopRequireDefault(require("../noop.js"));

var _catmullRom = require("./catmullRom.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        {
          this._context.moveTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 2:
        {
          this._context.lineTo(this._x3, this._y3);

          this._context.closePath();

          break;
        }

      case 3:
        {
          this.point(this._x3, this._y3);
          this.point(this._x4, this._y4);
          this.point(this._x5, this._y5);
          break;
        }
    }
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = x, this._y3 = y;
        break;

      case 1:
        this._point = 2;

        this._context.moveTo(this._x4 = x, this._y4 = y);

        break;

      case 2:
        this._point = 3;
        this._x5 = x, this._y5 = y;
        break;

      default:
        (0, _catmullRom.point)(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new _cardinalClosed.CardinalClosed(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;

},{"../noop.js":431,"./cardinalClosed.js":413,"./catmullRom.js":415}],417:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cardinalOpen = require("./cardinalOpen.js");

var _catmullRom = require("./catmullRom.js");

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 3) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;

      case 3:
        this._point = 4;
      // proceed

      default:
        (0, _catmullRom.point)(this, x, y);
        break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var _default = function custom(alpha) {
  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new _cardinalOpen.CardinalOpen(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}(0.5);

exports.default = _default;

},{"./cardinalOpen.js":414,"./catmullRom.js":415}],418:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
      // proceed

      default:
        this._context.lineTo(x, y);

        break;
    }
  }
};

function _default(context) {
  return new Linear(context);
}

},{}],419:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _noop = _interopRequireDefault(require("../noop.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LinearClosed(context) {
  this._context = context;
}

LinearClosed.prototype = {
  areaStart: _noop.default,
  areaEnd: _noop.default,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    if (this._point) this._context.closePath();
  },
  point: function (x, y) {
    x = +x, y = +y;
    if (this._point) this._context.lineTo(x, y);else this._point = 1, this._context.moveTo(x, y);
  }
};

function _default(context) {
  return new LinearClosed(context);
}

},{"../noop.js":431}],420:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monotoneX = monotoneX;
exports.monotoneY = monotoneY;

function sign(x) {
  return x < 0 ? -1 : 1;
} // Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.


function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
} // Calculate a one-sided slope.


function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
} // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".


function point(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;

  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);

        break;

      case 3:
        point(this, this._t0, slope2(this, this._t0));
        break;
    }

    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (x, y) {
    var t1 = NaN;
    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
        break;

      case 2:
        this._point = 3;
        point(this, slope2(this, t1 = slope3(this, x, y)), t1);
        break;

      default:
        point(this, this._t0, t1 = slope3(this, x, y));
        break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function (x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function (x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  }
};

function monotoneX(context) {
  return new MonotoneX(context);
}

function monotoneY(context) {
  return new MonotoneY(context);
}

},{}],421:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function Natural(context) {
  this._context = context;
}

Natural.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = [];
    this._y = [];
  },
  lineEnd: function () {
    var x = this._x,
        y = this._y,
        n = x.length;

    if (n) {
      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);

      if (n === 2) {
        this._context.lineTo(x[1], y[1]);
      } else {
        var px = controlPoints(x),
            py = controlPoints(y);

        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
        }
      }
    }

    if (this._line || this._line !== 0 && n === 1) this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function (x, y) {
    this._x.push(+x);

    this._y.push(+y);
  }
}; // See https://www.particleincell.com/2012/bezier-splines/ for derivation.

function controlPoints(x) {
  var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];

  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];

  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];

  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];

  a[n - 1] = r[n - 1] / b[n - 1];

  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];

  b[n - 1] = (x[n] + a[n - 1]) / 2;

  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];

  return [a, b];
}

function _default(context) {
  return new Natural(context);
}

},{}],422:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = curveRadial;
exports.curveRadialLinear = void 0;

var _linear = _interopRequireDefault(require("./linear.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var curveRadialLinear = curveRadial(_linear.default);
exports.curveRadialLinear = curveRadialLinear;

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function () {
    this._curve.areaStart();
  },
  areaEnd: function () {
    this._curve.areaEnd();
  },
  lineStart: function () {
    this._curve.lineStart();
  },
  lineEnd: function () {
    this._curve.lineEnd();
  },
  point: function (a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {
  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;
  return radial;
}

},{"./linear.js":418}],423:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.stepBefore = stepBefore;
exports.stepAfter = stepAfter;

function Step(context, t) {
  this._context = context;
  this._t = t;
}

Step.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
  },
  point: function (x, y) {
    x = +x, y = +y;

    switch (this._point) {
      case 0:
        this._point = 1;
        this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
        break;

      case 1:
        this._point = 2;
      // proceed

      default:
        {
          if (this._t <= 0) {
            this._context.lineTo(this._x, y);

            this._context.lineTo(x, y);
          } else {
            var x1 = this._x * (1 - this._t) + x * this._t;

            this._context.lineTo(x1, this._y);

            this._context.lineTo(x1, y);
          }

          break;
        }
    }

    this._x = x, this._y = y;
  }
};

function _default(context) {
  return new Step(context, 0.5);
}

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

},{}],424:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],425:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(d) {
  return d;
}

},{}],426:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "arc", {
  enumerable: true,
  get: function () {
    return _arc.default;
  }
});
Object.defineProperty(exports, "area", {
  enumerable: true,
  get: function () {
    return _area.default;
  }
});
Object.defineProperty(exports, "line", {
  enumerable: true,
  get: function () {
    return _line.default;
  }
});
Object.defineProperty(exports, "pie", {
  enumerable: true,
  get: function () {
    return _pie.default;
  }
});
Object.defineProperty(exports, "areaRadial", {
  enumerable: true,
  get: function () {
    return _areaRadial.default;
  }
});
Object.defineProperty(exports, "radialArea", {
  enumerable: true,
  get: function () {
    return _areaRadial.default;
  }
});
Object.defineProperty(exports, "lineRadial", {
  enumerable: true,
  get: function () {
    return _lineRadial.default;
  }
});
Object.defineProperty(exports, "radialLine", {
  enumerable: true,
  get: function () {
    return _lineRadial.default;
  }
});
Object.defineProperty(exports, "pointRadial", {
  enumerable: true,
  get: function () {
    return _pointRadial.default;
  }
});
Object.defineProperty(exports, "linkHorizontal", {
  enumerable: true,
  get: function () {
    return _index.linkHorizontal;
  }
});
Object.defineProperty(exports, "linkVertical", {
  enumerable: true,
  get: function () {
    return _index.linkVertical;
  }
});
Object.defineProperty(exports, "linkRadial", {
  enumerable: true,
  get: function () {
    return _index.linkRadial;
  }
});
Object.defineProperty(exports, "symbol", {
  enumerable: true,
  get: function () {
    return _symbol.default;
  }
});
Object.defineProperty(exports, "symbols", {
  enumerable: true,
  get: function () {
    return _symbol.symbols;
  }
});
Object.defineProperty(exports, "symbolCircle", {
  enumerable: true,
  get: function () {
    return _circle.default;
  }
});
Object.defineProperty(exports, "symbolCross", {
  enumerable: true,
  get: function () {
    return _cross.default;
  }
});
Object.defineProperty(exports, "symbolDiamond", {
  enumerable: true,
  get: function () {
    return _diamond.default;
  }
});
Object.defineProperty(exports, "symbolSquare", {
  enumerable: true,
  get: function () {
    return _square.default;
  }
});
Object.defineProperty(exports, "symbolStar", {
  enumerable: true,
  get: function () {
    return _star.default;
  }
});
Object.defineProperty(exports, "symbolTriangle", {
  enumerable: true,
  get: function () {
    return _triangle.default;
  }
});
Object.defineProperty(exports, "symbolWye", {
  enumerable: true,
  get: function () {
    return _wye.default;
  }
});
Object.defineProperty(exports, "curveBasisClosed", {
  enumerable: true,
  get: function () {
    return _basisClosed.default;
  }
});
Object.defineProperty(exports, "curveBasisOpen", {
  enumerable: true,
  get: function () {
    return _basisOpen.default;
  }
});
Object.defineProperty(exports, "curveBasis", {
  enumerable: true,
  get: function () {
    return _basis.default;
  }
});
Object.defineProperty(exports, "curveBundle", {
  enumerable: true,
  get: function () {
    return _bundle.default;
  }
});
Object.defineProperty(exports, "curveCardinalClosed", {
  enumerable: true,
  get: function () {
    return _cardinalClosed.default;
  }
});
Object.defineProperty(exports, "curveCardinalOpen", {
  enumerable: true,
  get: function () {
    return _cardinalOpen.default;
  }
});
Object.defineProperty(exports, "curveCardinal", {
  enumerable: true,
  get: function () {
    return _cardinal.default;
  }
});
Object.defineProperty(exports, "curveCatmullRomClosed", {
  enumerable: true,
  get: function () {
    return _catmullRomClosed.default;
  }
});
Object.defineProperty(exports, "curveCatmullRomOpen", {
  enumerable: true,
  get: function () {
    return _catmullRomOpen.default;
  }
});
Object.defineProperty(exports, "curveCatmullRom", {
  enumerable: true,
  get: function () {
    return _catmullRom.default;
  }
});
Object.defineProperty(exports, "curveLinearClosed", {
  enumerable: true,
  get: function () {
    return _linearClosed.default;
  }
});
Object.defineProperty(exports, "curveLinear", {
  enumerable: true,
  get: function () {
    return _linear.default;
  }
});
Object.defineProperty(exports, "curveMonotoneX", {
  enumerable: true,
  get: function () {
    return _monotone.monotoneX;
  }
});
Object.defineProperty(exports, "curveMonotoneY", {
  enumerable: true,
  get: function () {
    return _monotone.monotoneY;
  }
});
Object.defineProperty(exports, "curveNatural", {
  enumerable: true,
  get: function () {
    return _natural.default;
  }
});
Object.defineProperty(exports, "curveStep", {
  enumerable: true,
  get: function () {
    return _step.default;
  }
});
Object.defineProperty(exports, "curveStepAfter", {
  enumerable: true,
  get: function () {
    return _step.stepAfter;
  }
});
Object.defineProperty(exports, "curveStepBefore", {
  enumerable: true,
  get: function () {
    return _step.stepBefore;
  }
});
Object.defineProperty(exports, "stack", {
  enumerable: true,
  get: function () {
    return _stack.default;
  }
});
Object.defineProperty(exports, "stackOffsetExpand", {
  enumerable: true,
  get: function () {
    return _expand.default;
  }
});
Object.defineProperty(exports, "stackOffsetDiverging", {
  enumerable: true,
  get: function () {
    return _diverging.default;
  }
});
Object.defineProperty(exports, "stackOffsetNone", {
  enumerable: true,
  get: function () {
    return _none.default;
  }
});
Object.defineProperty(exports, "stackOffsetSilhouette", {
  enumerable: true,
  get: function () {
    return _silhouette.default;
  }
});
Object.defineProperty(exports, "stackOffsetWiggle", {
  enumerable: true,
  get: function () {
    return _wiggle.default;
  }
});
Object.defineProperty(exports, "stackOrderAppearance", {
  enumerable: true,
  get: function () {
    return _appearance.default;
  }
});
Object.defineProperty(exports, "stackOrderAscending", {
  enumerable: true,
  get: function () {
    return _ascending.default;
  }
});
Object.defineProperty(exports, "stackOrderDescending", {
  enumerable: true,
  get: function () {
    return _descending.default;
  }
});
Object.defineProperty(exports, "stackOrderInsideOut", {
  enumerable: true,
  get: function () {
    return _insideOut.default;
  }
});
Object.defineProperty(exports, "stackOrderNone", {
  enumerable: true,
  get: function () {
    return _none2.default;
  }
});
Object.defineProperty(exports, "stackOrderReverse", {
  enumerable: true,
  get: function () {
    return _reverse.default;
  }
});

var _arc = _interopRequireDefault(require("./arc.js"));

var _area = _interopRequireDefault(require("./area.js"));

var _line = _interopRequireDefault(require("./line.js"));

var _pie = _interopRequireDefault(require("./pie.js"));

var _areaRadial = _interopRequireDefault(require("./areaRadial.js"));

var _lineRadial = _interopRequireDefault(require("./lineRadial.js"));

var _pointRadial = _interopRequireDefault(require("./pointRadial.js"));

var _index = require("./link/index.js");

var _symbol = _interopRequireWildcard(require("./symbol.js"));

var _circle = _interopRequireDefault(require("./symbol/circle.js"));

var _cross = _interopRequireDefault(require("./symbol/cross.js"));

var _diamond = _interopRequireDefault(require("./symbol/diamond.js"));

var _square = _interopRequireDefault(require("./symbol/square.js"));

var _star = _interopRequireDefault(require("./symbol/star.js"));

var _triangle = _interopRequireDefault(require("./symbol/triangle.js"));

var _wye = _interopRequireDefault(require("./symbol/wye.js"));

var _basisClosed = _interopRequireDefault(require("./curve/basisClosed.js"));

var _basisOpen = _interopRequireDefault(require("./curve/basisOpen.js"));

var _basis = _interopRequireDefault(require("./curve/basis.js"));

var _bundle = _interopRequireDefault(require("./curve/bundle.js"));

var _cardinalClosed = _interopRequireDefault(require("./curve/cardinalClosed.js"));

var _cardinalOpen = _interopRequireDefault(require("./curve/cardinalOpen.js"));

var _cardinal = _interopRequireDefault(require("./curve/cardinal.js"));

var _catmullRomClosed = _interopRequireDefault(require("./curve/catmullRomClosed.js"));

var _catmullRomOpen = _interopRequireDefault(require("./curve/catmullRomOpen.js"));

var _catmullRom = _interopRequireDefault(require("./curve/catmullRom.js"));

var _linearClosed = _interopRequireDefault(require("./curve/linearClosed.js"));

var _linear = _interopRequireDefault(require("./curve/linear.js"));

var _monotone = require("./curve/monotone.js");

var _natural = _interopRequireDefault(require("./curve/natural.js"));

var _step = _interopRequireWildcard(require("./curve/step.js"));

var _stack = _interopRequireDefault(require("./stack.js"));

var _expand = _interopRequireDefault(require("./offset/expand.js"));

var _diverging = _interopRequireDefault(require("./offset/diverging.js"));

var _none = _interopRequireDefault(require("./offset/none.js"));

var _silhouette = _interopRequireDefault(require("./offset/silhouette.js"));

var _wiggle = _interopRequireDefault(require("./offset/wiggle.js"));

var _appearance = _interopRequireDefault(require("./order/appearance.js"));

var _ascending = _interopRequireDefault(require("./order/ascending.js"));

var _descending = _interopRequireDefault(require("./order/descending.js"));

var _insideOut = _interopRequireDefault(require("./order/insideOut.js"));

var _none2 = _interopRequireDefault(require("./order/none.js"));

var _reverse = _interopRequireDefault(require("./order/reverse.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./arc.js":403,"./area.js":404,"./areaRadial.js":405,"./curve/basis.js":408,"./curve/basisClosed.js":409,"./curve/basisOpen.js":410,"./curve/bundle.js":411,"./curve/cardinal.js":412,"./curve/cardinalClosed.js":413,"./curve/cardinalOpen.js":414,"./curve/catmullRom.js":415,"./curve/catmullRomClosed.js":416,"./curve/catmullRomOpen.js":417,"./curve/linear.js":418,"./curve/linearClosed.js":419,"./curve/monotone.js":420,"./curve/natural.js":421,"./curve/step.js":423,"./line.js":427,"./lineRadial.js":428,"./link/index.js":429,"./offset/diverging.js":432,"./offset/expand.js":433,"./offset/none.js":434,"./offset/silhouette.js":435,"./offset/wiggle.js":436,"./order/appearance.js":437,"./order/ascending.js":438,"./order/descending.js":439,"./order/insideOut.js":440,"./order/none.js":441,"./order/reverse.js":442,"./pie.js":443,"./pointRadial.js":445,"./stack.js":446,"./symbol.js":447,"./symbol/circle.js":448,"./symbol/cross.js":449,"./symbol/diamond.js":450,"./symbol/square.js":451,"./symbol/star.js":452,"./symbol/triangle.js":453,"./symbol/wye.js":454}],427:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Path = require("d3-path");

var _constant = _interopRequireDefault(require("./constant.js"));

var _linear = _interopRequireDefault(require("./curve/linear.js"));

var _point = require("./point.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x = _point.x,
      y = _point.y,
      defined = (0, _constant.default)(true),
      context = null,
      curve = _linear.default,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;
    if (context == null) output = curve(buffer = (0, _d3Path.path)());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }

      if (defined0) output.point(+x(d, i, data), +y(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : x;
  };

  line.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), line) : y;
  };

  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : (0, _constant.default)(!!_), line) : defined;
  };

  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
}

},{"./constant.js":407,"./curve/linear.js":418,"./point.js":444,"d3-path":251}],428:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineRadial = lineRadial;
exports.default = _default;

var _radial = _interopRequireWildcard(require("./curve/radial.js"));

var _line = _interopRequireDefault(require("./line.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function lineRadial(l) {
  var c = l.curve;
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function (_) {
    return arguments.length ? c((0, _radial.default)(_)) : c()._curve;
  };

  return l;
}

function _default() {
  return lineRadial((0, _line.default)().curve(_radial.curveRadialLinear));
}

},{"./curve/radial.js":422,"./line.js":427}],429:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkHorizontal = linkHorizontal;
exports.linkVertical = linkVertical;
exports.linkRadial = linkRadial;

var _d3Path = require("d3-path");

var _array = require("../array.js");

var _constant = _interopRequireDefault(require("../constant.js"));

var _point = require("../point.js");

var _pointRadial = _interopRequireDefault(require("../pointRadial.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function linkSource(d) {
  return d.source;
}

function linkTarget(d) {
  return d.target;
}

function link(curve) {
  var source = linkSource,
      target = linkTarget,
      x = _point.x,
      y = _point.y,
      context = null;

  function link() {
    var buffer,
        argv = _array.slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv);

    if (!context) context = buffer = (0, _d3Path.path)();
    curve(context, +x.apply(this, (argv[0] = s, argv)), +y.apply(this, argv), +x.apply(this, (argv[0] = t, argv)), +y.apply(this, argv));
    if (buffer) return context = null, buffer + "" || null;
  }

  link.source = function (_) {
    return arguments.length ? (source = _, link) : source;
  };

  link.target = function (_) {
    return arguments.length ? (target = _, link) : target;
  };

  link.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), link) : x;
  };

  link.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), link) : y;
  };

  link.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, link) : context;
  };

  return link;
}

function curveHorizontal(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0 = (x0 + x1) / 2, y0, x0, y1, x1, y1);
}

function curveVertical(context, x0, y0, x1, y1) {
  context.moveTo(x0, y0);
  context.bezierCurveTo(x0, y0 = (y0 + y1) / 2, x1, y0, x1, y1);
}

function curveRadial(context, x0, y0, x1, y1) {
  var p0 = (0, _pointRadial.default)(x0, y0),
      p1 = (0, _pointRadial.default)(x0, y0 = (y0 + y1) / 2),
      p2 = (0, _pointRadial.default)(x1, y0),
      p3 = (0, _pointRadial.default)(x1, y1);
  context.moveTo(p0[0], p0[1]);
  context.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
}

function linkHorizontal() {
  return link(curveHorizontal);
}

function linkVertical() {
  return link(curveVertical);
}

function linkRadial() {
  var l = link(curveRadial);
  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;
  return l;
}

},{"../array.js":406,"../constant.js":407,"../point.js":444,"../pointRadial.js":445,"d3-path":251}],430:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.acos = acos;
exports.asin = asin;
exports.tau = exports.halfPi = exports.pi = exports.epsilon = exports.sqrt = exports.sin = exports.min = exports.max = exports.cos = exports.atan2 = exports.abs = void 0;
var abs = Math.abs;
exports.abs = abs;
var atan2 = Math.atan2;
exports.atan2 = atan2;
var cos = Math.cos;
exports.cos = cos;
var max = Math.max;
exports.max = max;
var min = Math.min;
exports.min = min;
var sin = Math.sin;
exports.sin = sin;
var sqrt = Math.sqrt;
exports.sqrt = sqrt;
var epsilon = 1e-12;
exports.epsilon = epsilon;
var pi = Math.PI;
exports.pi = pi;
var halfPi = pi / 2;
exports.halfPi = halfPi;
var tau = 2 * pi;
exports.tau = tau;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

},{}],431:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"dup":72}],432:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(series, order) {
  if (!((n = series.length) > 0)) return;

  for (var i, j = 0, d, dy, yp, yn, n, m = series[order[0]].length; j < m; ++j) {
    for (yp = yn = 0, i = 0; i < n; ++i) {
      if ((dy = (d = series[order[i]][j])[1] - d[0]) > 0) {
        d[0] = yp, d[1] = yp += dy;
      } else if (dy < 0) {
        d[1] = yn, d[0] = yn += dy;
      } else {
        d[0] = 0, d[1] = dy;
      }
    }
  }
}

},{}],433:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0)) return;

  for (var i, n, j = 0, m = series[0].length, y; j < m; ++j) {
    for (y = i = 0; i < n; ++i) y += series[i][j][1] || 0;

    if (y) for (i = 0; i < n; ++i) series[i][j][1] /= y;
  }

  (0, _none.default)(series, order);
}

},{"./none.js":434}],434:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(series, order) {
  if (!((n = series.length) > 1)) return;

  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];

    for (j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
}

},{}],435:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0)) return;

  for (var j = 0, s0 = series[order[0]], n, m = s0.length; j < m; ++j) {
    for (var i = 0, y = 0; i < n; ++i) y += series[i][j][1] || 0;

    s0[j][1] += s0[j][0] = -y / 2;
  }

  (0, _none.default)(series, order);
}

},{"./none.js":434}],436:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series, order) {
  if (!((n = series.length) > 0) || !((m = (s0 = series[order[0]]).length) > 0)) return;

  for (var y = 0, j = 1, s0, m, n; j < m; ++j) {
    for (var i = 0, s1 = 0, s2 = 0; i < n; ++i) {
      var si = series[order[i]],
          sij0 = si[j][1] || 0,
          sij1 = si[j - 1][1] || 0,
          s3 = (sij0 - sij1) / 2;

      for (var k = 0; k < i; ++k) {
        var sk = series[order[k]],
            skj0 = sk[j][1] || 0,
            skj1 = sk[j - 1][1] || 0;
        s3 += skj0 - skj1;
      }

      s1 += sij0, s2 += s3 * sij0;
    }

    s0[j - 1][1] += s0[j - 1][0] = y;
    if (s1) y -= s2 / s1;
  }

  s0[j - 1][1] += s0[j - 1][0] = y;
  (0, _none.default)(series, order);
}

},{"./none.js":434}],437:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  var peaks = series.map(peak);
  return (0, _none.default)(series).sort(function (a, b) {
    return peaks[a] - peaks[b];
  });
}

function peak(series) {
  var i = -1,
      j = 0,
      n = series.length,
      vi,
      vj = -Infinity;

  while (++i < n) if ((vi = +series[i][1]) > vj) vj = vi, j = i;

  return j;
}

},{"./none.js":441}],438:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.sum = sum;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  var sums = series.map(sum);
  return (0, _none.default)(series).sort(function (a, b) {
    return sums[a] - sums[b];
  });
}

function sum(series) {
  var s = 0,
      i = -1,
      n = series.length,
      v;

  while (++i < n) if (v = +series[i][1]) s += v;

  return s;
}

},{"./none.js":441}],439:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _ascending = _interopRequireDefault(require("./ascending.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  return (0, _ascending.default)(series).reverse();
}

},{"./ascending.js":438}],440:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _appearance = _interopRequireDefault(require("./appearance.js"));

var _ascending = require("./ascending.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  var n = series.length,
      i,
      j,
      sums = series.map(_ascending.sum),
      order = (0, _appearance.default)(series),
      top = 0,
      bottom = 0,
      tops = [],
      bottoms = [];

  for (i = 0; i < n; ++i) {
    j = order[i];

    if (top < bottom) {
      top += sums[j];
      tops.push(j);
    } else {
      bottom += sums[j];
      bottoms.push(j);
    }
  }

  return bottoms.reverse().concat(tops);
}

},{"./appearance.js":437,"./ascending.js":438}],441:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(series) {
  var n = series.length,
      o = new Array(n);

  while (--n >= 0) o[n] = n;

  return o;
}

},{}],442:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _none = _interopRequireDefault(require("./none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(series) {
  return (0, _none.default)(series).reverse();
}

},{"./none.js":441}],443:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant.js"));

var _descending = _interopRequireDefault(require("./descending.js"));

var _identity = _interopRequireDefault(require("./identity.js"));

var _math = require("./math.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var value = _identity.default,
      sortValues = _descending.default,
      sort = null,
      startAngle = (0, _constant.default)(0),
      endAngle = (0, _constant.default)(_math.tau),
      padAngle = (0, _constant.default)(0);

  function pie(data) {
    var i,
        n = data.length,
        j,
        k,
        sum = 0,
        index = new Array(n),
        arcs = new Array(n),
        a0 = +startAngle.apply(this, arguments),
        da = Math.min(_math.tau, Math.max(-_math.tau, endAngle.apply(this, arguments) - a0)),
        a1,
        p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
        pa = p * (da < 0 ? -1 : 1),
        v;

    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    } // Optionally sort the arcs by previously-computed values or by data.


    if (sortValues != null) index.sort(function (i, j) {
      return sortValues(arcs[i], arcs[j]);
    });else if (sort != null) index.sort(function (i, j) {
      return sort(data[i], data[j]);
    }); // Compute the arcs! They are stored in the original data's order.

    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }

    return arcs;
  }

  pie.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : value;
  };

  pie.sortValues = function (_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };

  pie.sort = function (_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };

  pie.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : startAngle;
  };

  pie.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : endAngle;
  };

  pie.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : (0, _constant.default)(+_), pie) : padAngle;
  };

  return pie;
}

},{"./constant.js":407,"./descending.js":424,"./identity.js":425,"./math.js":430}],444:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = x;
exports.y = y;

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

},{}],445:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(x, y) {
  return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
}

},{}],446:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _array = require("./array.js");

var _constant = _interopRequireDefault(require("./constant.js"));

var _none = _interopRequireDefault(require("./offset/none.js"));

var _none2 = _interopRequireDefault(require("./order/none.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stackValue(d, key) {
  return d[key];
}

function _default() {
  var keys = (0, _constant.default)([]),
      order = _none2.default,
      offset = _none.default,
      value = stackValue;

  function stack(data) {
    var kz = keys.apply(this, arguments),
        i,
        m = data.length,
        n = kz.length,
        sz = new Array(n),
        oz;

    for (i = 0; i < n; ++i) {
      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
        si[j] = sij = [0, +value(data[j], ki, j, data)];
        sij.data = data[j];
      }

      si.key = ki;
    }

    for (i = 0, oz = order(sz); i < n; ++i) {
      sz[oz[i]].index = i;
    }

    offset(sz, oz);
    return sz;
  }

  stack.keys = function (_) {
    return arguments.length ? (keys = typeof _ === "function" ? _ : (0, _constant.default)(_array.slice.call(_)), stack) : keys;
  };

  stack.value = function (_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : (0, _constant.default)(+_), stack) : value;
  };

  stack.order = function (_) {
    return arguments.length ? (order = _ == null ? _none2.default : typeof _ === "function" ? _ : (0, _constant.default)(_array.slice.call(_)), stack) : order;
  };

  stack.offset = function (_) {
    return arguments.length ? (offset = _ == null ? _none.default : _, stack) : offset;
  };

  return stack;
}

},{"./array.js":406,"./constant.js":407,"./offset/none.js":434,"./order/none.js":441}],447:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.symbols = void 0;

var _d3Path = require("d3-path");

var _circle = _interopRequireDefault(require("./symbol/circle.js"));

var _cross = _interopRequireDefault(require("./symbol/cross.js"));

var _diamond = _interopRequireDefault(require("./symbol/diamond.js"));

var _star = _interopRequireDefault(require("./symbol/star.js"));

var _square = _interopRequireDefault(require("./symbol/square.js"));

var _triangle = _interopRequireDefault(require("./symbol/triangle.js"));

var _wye = _interopRequireDefault(require("./symbol/wye.js"));

var _constant = _interopRequireDefault(require("./constant.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var symbols = [_circle.default, _cross.default, _diamond.default, _square.default, _star.default, _triangle.default, _wye.default];
exports.symbols = symbols;

function _default() {
  var type = (0, _constant.default)(_circle.default),
      size = (0, _constant.default)(64),
      context = null;

  function symbol() {
    var buffer;
    if (!context) context = buffer = (0, _d3Path.path)();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }

  symbol.type = function (_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : (0, _constant.default)(_), symbol) : type;
  };

  symbol.size = function (_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : (0, _constant.default)(+_), symbol) : size;
  };

  symbol.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };

  return symbol;
}

},{"./constant.js":407,"./symbol/circle.js":448,"./symbol/cross.js":449,"./symbol/diamond.js":450,"./symbol/square.js":451,"./symbol/star.js":452,"./symbol/triangle.js":453,"./symbol/wye.js":454,"d3-path":251}],448:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _math = require("../math.js");

var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / _math.pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, _math.tau);
  }
};
exports.default = _default;

},{"../math.js":430}],449:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};
exports.default = _default;

},{}],450:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var tan30 = Math.sqrt(1 / 3),
    tan30_2 = tan30 * 2;
var _default = {
  draw: function (context, size) {
    var y = Math.sqrt(size / tan30_2),
        x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};
exports.default = _default;

},{}],451:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  draw: function (context, size) {
    var w = Math.sqrt(size),
        x = -w / 2;
    context.rect(x, x, w, w);
  }
};
exports.default = _default;

},{}],452:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _math = require("../math.js");

var ka = 0.89081309152928522810,
    kr = Math.sin(_math.pi / 10) / Math.sin(7 * _math.pi / 10),
    kx = Math.sin(_math.tau / 10) * kr,
    ky = -Math.cos(_math.tau / 10) * kr;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size * ka),
        x = kx * r,
        y = ky * r;
    context.moveTo(0, -r);
    context.lineTo(x, y);

    for (var i = 1; i < 5; ++i) {
      var a = _math.tau * i / 5,
          c = Math.cos(a),
          s = Math.sin(a);
      context.lineTo(s * r, -c * r);
      context.lineTo(c * x - s * y, s * x + c * y);
    }

    context.closePath();
  }
};
exports.default = _default;

},{"../math.js":430}],453:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var sqrt3 = Math.sqrt(3);
var _default = {
  draw: function (context, size) {
    var y = -Math.sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};
exports.default = _default;

},{}],454:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var c = -0.5,
    s = Math.sqrt(3) / 2,
    k = 1 / Math.sqrt(12),
    a = (k / 2 + 1) * 3;
var _default = {
  draw: function (context, size) {
    var r = Math.sqrt(size / a),
        x0 = r / 2,
        y0 = r * k,
        x1 = x0,
        y1 = r * k + r,
        x2 = -x1,
        y2 = y1;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
    context.closePath();
  }
};
exports.default = _default;

},{}],455:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultLocale;
exports.utcParse = exports.utcFormat = exports.timeParse = exports.timeFormat = void 0;

var _locale = _interopRequireDefault(require("./locale.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locale;
var timeFormat;
exports.timeFormat = timeFormat;
var timeParse;
exports.timeParse = timeParse;
var utcFormat;
exports.utcFormat = utcFormat;
var utcParse;
exports.utcParse = utcParse;
defaultLocale({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
});

function defaultLocale(definition) {
  locale = (0, _locale.default)(definition);
  exports.timeFormat = timeFormat = locale.format;
  exports.timeParse = timeParse = locale.parse;
  exports.utcFormat = utcFormat = locale.utcFormat;
  exports.utcParse = utcParse = locale.utcParse;
  return locale;
}

},{"./locale.js":459}],456:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeFormatDefaultLocale", {
  enumerable: true,
  get: function () {
    return _defaultLocale.default;
  }
});
Object.defineProperty(exports, "timeFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeFormat;
  }
});
Object.defineProperty(exports, "timeParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.timeParse;
  }
});
Object.defineProperty(exports, "utcFormat", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcFormat;
  }
});
Object.defineProperty(exports, "utcParse", {
  enumerable: true,
  get: function () {
    return _defaultLocale.utcParse;
  }
});
Object.defineProperty(exports, "timeFormatLocale", {
  enumerable: true,
  get: function () {
    return _locale.default;
  }
});
Object.defineProperty(exports, "isoFormat", {
  enumerable: true,
  get: function () {
    return _isoFormat.default;
  }
});
Object.defineProperty(exports, "isoParse", {
  enumerable: true,
  get: function () {
    return _isoParse.default;
  }
});

var _defaultLocale = _interopRequireWildcard(require("./defaultLocale.js"));

var _locale = _interopRequireDefault(require("./locale.js"));

var _isoFormat = _interopRequireDefault(require("./isoFormat.js"));

var _isoParse = _interopRequireDefault(require("./isoParse.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

},{"./defaultLocale.js":455,"./isoFormat.js":457,"./isoParse.js":458,"./locale.js":459}],457:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isoSpecifier = void 0;

var _defaultLocale = require("./defaultLocale.js");

var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
exports.isoSpecifier = isoSpecifier;

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString ? formatIsoNative : (0, _defaultLocale.utcFormat)(isoSpecifier);
var _default = formatIso;
exports.default = _default;

},{"./defaultLocale.js":455}],458:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isoFormat = require("./isoFormat.js");

var _defaultLocale = require("./defaultLocale.js");

function parseIsoNative(string) {
  var date = new Date(string);
  return isNaN(date) ? null : date;
}

var parseIso = +new Date("2000-01-01T00:00:00.000Z") ? parseIsoNative : (0, _defaultLocale.utcParse)(_isoFormat.isoSpecifier);
var _default = parseIso;
exports.default = _default;

},{"./defaultLocale.js":455,"./isoFormat.js":457}],459:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formatLocale;

var _d3Time = require("d3-time");

function localDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
    date.setFullYear(d.y);
    return date;
  }

  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
}

function utcDate(d) {
  if (0 <= d.y && d.y < 100) {
    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
    date.setUTCFullYear(d.y);
    return date;
  }

  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
}

function newDate(y, m, d) {
  return {
    y: y,
    m: m,
    d: d,
    H: 0,
    M: 0,
    S: 0,
    L: 0
  };
}

function formatLocale(locale) {
  var locale_dateTime = locale.dateTime,
      locale_date = locale.date,
      locale_time = locale.time,
      locale_periods = locale.periods,
      locale_weekdays = locale.days,
      locale_shortWeekdays = locale.shortDays,
      locale_months = locale.months,
      locale_shortMonths = locale.shortMonths;
  var periodRe = formatRe(locale_periods),
      periodLookup = formatLookup(locale_periods),
      weekdayRe = formatRe(locale_weekdays),
      weekdayLookup = formatLookup(locale_weekdays),
      shortWeekdayRe = formatRe(locale_shortWeekdays),
      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
      monthRe = formatRe(locale_months),
      monthLookup = formatLookup(locale_months),
      shortMonthRe = formatRe(locale_shortMonths),
      shortMonthLookup = formatLookup(locale_shortMonths);
  var formats = {
    "a": formatShortWeekday,
    "A": formatWeekday,
    "b": formatShortMonth,
    "B": formatMonth,
    "c": null,
    "d": formatDayOfMonth,
    "e": formatDayOfMonth,
    "f": formatMicroseconds,
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "q": formatQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatSeconds,
    "u": formatWeekdayNumberMonday,
    "U": formatWeekNumberSunday,
    "V": formatWeekNumberISO,
    "w": formatWeekdayNumberSunday,
    "W": formatWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatYear,
    "Y": formatFullYear,
    "Z": formatZone,
    "%": formatLiteralPercent
  };
  var utcFormats = {
    "a": formatUTCShortWeekday,
    "A": formatUTCWeekday,
    "b": formatUTCShortMonth,
    "B": formatUTCMonth,
    "c": null,
    "d": formatUTCDayOfMonth,
    "e": formatUTCDayOfMonth,
    "f": formatUTCMicroseconds,
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "q": formatUTCQuarter,
    "Q": formatUnixTimestamp,
    "s": formatUnixTimestampSeconds,
    "S": formatUTCSeconds,
    "u": formatUTCWeekdayNumberMonday,
    "U": formatUTCWeekNumberSunday,
    "V": formatUTCWeekNumberISO,
    "w": formatUTCWeekdayNumberSunday,
    "W": formatUTCWeekNumberMonday,
    "x": null,
    "X": null,
    "y": formatUTCYear,
    "Y": formatUTCFullYear,
    "Z": formatUTCZone,
    "%": formatLiteralPercent
  };
  var parses = {
    "a": parseShortWeekday,
    "A": parseWeekday,
    "b": parseShortMonth,
    "B": parseMonth,
    "c": parseLocaleDateTime,
    "d": parseDayOfMonth,
    "e": parseDayOfMonth,
    "f": parseMicroseconds,
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "q": parseQuarter,
    "Q": parseUnixTimestamp,
    "s": parseUnixTimestampSeconds,
    "S": parseSeconds,
    "u": parseWeekdayNumberMonday,
    "U": parseWeekNumberSunday,
    "V": parseWeekNumberISO,
    "w": parseWeekdayNumberSunday,
    "W": parseWeekNumberMonday,
    "x": parseLocaleDate,
    "X": parseLocaleTime,
    "y": parseYear,
    "Y": parseFullYear,
    "Z": parseZone,
    "%": parseLiteralPercent
  }; // These recursive directive definitions must be deferred.

  formats.x = newFormat(locale_date, formats);
  formats.X = newFormat(locale_time, formats);
  formats.c = newFormat(locale_dateTime, formats);
  utcFormats.x = newFormat(locale_date, utcFormats);
  utcFormats.X = newFormat(locale_time, utcFormats);
  utcFormats.c = newFormat(locale_dateTime, utcFormats);

  function newFormat(specifier, formats) {
    return function (date) {
      var string = [],
          i = -1,
          j = 0,
          n = specifier.length,
          c,
          pad,
          format;
      if (!(date instanceof Date)) date = new Date(+date);

      while (++i < n) {
        if (specifier.charCodeAt(i) === 37) {
          string.push(specifier.slice(j, i));
          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);else pad = c === "e" ? " " : "0";
          if (format = formats[c]) c = format(date, pad);
          string.push(c);
          j = i + 1;
        }
      }

      string.push(specifier.slice(j, i));
      return string.join("");
    };
  }

  function newParse(specifier, Z) {
    return function (string) {
      var d = newDate(1900, undefined, 1),
          i = parseSpecifier(d, specifier, string += "", 0),
          week,
          day;
      if (i != string.length) return null; // If a UNIX timestamp is specified, return it.

      if ("Q" in d) return new Date(d.Q);
      if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0)); // If this is utcParse, never use the local timezone.

      if (Z && !("Z" in d)) d.Z = 0; // The am-pm flag is 0 for AM, and 1 for PM.

      if ("p" in d) d.H = d.H % 12 + d.p * 12; // If the month was not specified, inherit from the quarter.

      if (d.m === undefined) d.m = "q" in d ? d.q : 0; // Convert day-of-week and week-of-year to day-of-year.

      if ("V" in d) {
        if (d.V < 1 || d.V > 53) return null;
        if (!("w" in d)) d.w = 1;

        if ("Z" in d) {
          week = utcDate(newDate(d.y, 0, 1)), day = week.getUTCDay();
          week = day > 4 || day === 0 ? _d3Time.utcMonday.ceil(week) : (0, _d3Time.utcMonday)(week);
          week = _d3Time.utcDay.offset(week, (d.V - 1) * 7);
          d.y = week.getUTCFullYear();
          d.m = week.getUTCMonth();
          d.d = week.getUTCDate() + (d.w + 6) % 7;
        } else {
          week = localDate(newDate(d.y, 0, 1)), day = week.getDay();
          week = day > 4 || day === 0 ? _d3Time.timeMonday.ceil(week) : (0, _d3Time.timeMonday)(week);
          week = _d3Time.timeDay.offset(week, (d.V - 1) * 7);
          d.y = week.getFullYear();
          d.m = week.getMonth();
          d.d = week.getDate() + (d.w + 6) % 7;
        }
      } else if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
        day = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
        d.m = 0;
        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
      } // If a time zone is specified, all fields are interpreted as UTC and then
      // offset according to the specified time zone.


      if ("Z" in d) {
        d.H += d.Z / 100 | 0;
        d.M += d.Z % 100;
        return utcDate(d);
      } // Otherwise, all fields are in local time.


      return localDate(d);
    };
  }

  function parseSpecifier(d, specifier, string, j) {
    var i = 0,
        n = specifier.length,
        m = string.length,
        c,
        parse;

    while (i < n) {
      if (j >= m) return -1;
      c = specifier.charCodeAt(i++);

      if (c === 37) {
        c = specifier.charAt(i++);
        parse = parses[c in pads ? specifier.charAt(i++) : c];
        if (!parse || (j = parse(d, string, j)) < 0) return -1;
      } else if (c != string.charCodeAt(j++)) {
        return -1;
      }
    }

    return j;
  }

  function parsePeriod(d, string, i) {
    var n = periodRe.exec(string.slice(i));
    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortWeekday(d, string, i) {
    var n = shortWeekdayRe.exec(string.slice(i));
    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseWeekday(d, string, i) {
    var n = weekdayRe.exec(string.slice(i));
    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseShortMonth(d, string, i) {
    var n = shortMonthRe.exec(string.slice(i));
    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseMonth(d, string, i) {
    var n = monthRe.exec(string.slice(i));
    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
  }

  function parseLocaleDateTime(d, string, i) {
    return parseSpecifier(d, locale_dateTime, string, i);
  }

  function parseLocaleDate(d, string, i) {
    return parseSpecifier(d, locale_date, string, i);
  }

  function parseLocaleTime(d, string, i) {
    return parseSpecifier(d, locale_time, string, i);
  }

  function formatShortWeekday(d) {
    return locale_shortWeekdays[d.getDay()];
  }

  function formatWeekday(d) {
    return locale_weekdays[d.getDay()];
  }

  function formatShortMonth(d) {
    return locale_shortMonths[d.getMonth()];
  }

  function formatMonth(d) {
    return locale_months[d.getMonth()];
  }

  function formatPeriod(d) {
    return locale_periods[+(d.getHours() >= 12)];
  }

  function formatQuarter(d) {
    return 1 + ~~(d.getMonth() / 3);
  }

  function formatUTCShortWeekday(d) {
    return locale_shortWeekdays[d.getUTCDay()];
  }

  function formatUTCWeekday(d) {
    return locale_weekdays[d.getUTCDay()];
  }

  function formatUTCShortMonth(d) {
    return locale_shortMonths[d.getUTCMonth()];
  }

  function formatUTCMonth(d) {
    return locale_months[d.getUTCMonth()];
  }

  function formatUTCPeriod(d) {
    return locale_periods[+(d.getUTCHours() >= 12)];
  }

  function formatUTCQuarter(d) {
    return 1 + ~~(d.getUTCMonth() / 3);
  }

  return {
    format: function (specifier) {
      var f = newFormat(specifier += "", formats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    parse: function (specifier) {
      var p = newParse(specifier += "", false);

      p.toString = function () {
        return specifier;
      };

      return p;
    },
    utcFormat: function (specifier) {
      var f = newFormat(specifier += "", utcFormats);

      f.toString = function () {
        return specifier;
      };

      return f;
    },
    utcParse: function (specifier) {
      var p = newParse(specifier += "", true);

      p.toString = function () {
        return specifier;
      };

      return p;
    }
  };
}

var pads = {
  "-": "",
  "_": " ",
  "0": "0"
},
    numberRe = /^\s*\d+/,
    // note: ignores next directive
percentRe = /^%/,
    requoteRe = /[\\^$*+?|[\]().{}]/g;

function pad(value, fill, width) {
  var sign = value < 0 ? "-" : "",
      string = (sign ? -value : value) + "",
      length = string.length;
  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
}

function requote(s) {
  return s.replace(requoteRe, "\\$&");
}

function formatRe(names) {
  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
}

function formatLookup(names) {
  var map = {},
      i = -1,
      n = names.length;

  while (++i < n) map[names[i].toLowerCase()] = i;

  return map;
}

function parseWeekdayNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekdayNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.u = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberISO(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.V = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.W = +n[0], i + n[0].length) : -1;
}

function parseFullYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 4));
  return n ? (d.y = +n[0], i + n[0].length) : -1;
}

function parseYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
}

function parseZone(d, string, i) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
}

function parseQuarter(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
}

function parseMonthNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
}

function parseDayOfMonth(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.d = +n[0], i + n[0].length) : -1;
}

function parseDayOfYear(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
}

function parseHour24(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.H = +n[0], i + n[0].length) : -1;
}

function parseMinutes(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.M = +n[0], i + n[0].length) : -1;
}

function parseSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 2));
  return n ? (d.S = +n[0], i + n[0].length) : -1;
}

function parseMilliseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 3));
  return n ? (d.L = +n[0], i + n[0].length) : -1;
}

function parseMicroseconds(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 6));
  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
}

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
}

function parseUnixTimestamp(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.Q = +n[0], i + n[0].length) : -1;
}

function parseUnixTimestampSeconds(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.s = +n[0], i + n[0].length) : -1;
}

function formatDayOfMonth(d, p) {
  return pad(d.getDate(), p, 2);
}

function formatHour24(d, p) {
  return pad(d.getHours(), p, 2);
}

function formatHour12(d, p) {
  return pad(d.getHours() % 12 || 12, p, 2);
}

function formatDayOfYear(d, p) {
  return pad(1 + _d3Time.timeDay.count((0, _d3Time.timeYear)(d), d), p, 3);
}

function formatMilliseconds(d, p) {
  return pad(d.getMilliseconds(), p, 3);
}

function formatMicroseconds(d, p) {
  return formatMilliseconds(d, p) + "000";
}

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekdayNumberMonday(d) {
  var day = d.getDay();
  return day === 0 ? 7 : day;
}

function formatWeekNumberSunday(d, p) {
  return pad(_d3Time.timeSunday.count((0, _d3Time.timeYear)(d) - 1, d), p, 2);
}

function formatWeekNumberISO(d, p) {
  var day = d.getDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.timeThursday)(d) : _d3Time.timeThursday.ceil(d);
  return pad(_d3Time.timeThursday.count((0, _d3Time.timeYear)(d), d) + ((0, _d3Time.timeYear)(d).getDay() === 4), p, 2);
}

function formatWeekdayNumberSunday(d) {
  return d.getDay();
}

function formatWeekNumberMonday(d, p) {
  return pad(_d3Time.timeMonday.count((0, _d3Time.timeYear)(d) - 1, d), p, 2);
}

function formatYear(d, p) {
  return pad(d.getFullYear() % 100, p, 2);
}

function formatFullYear(d, p) {
  return pad(d.getFullYear() % 10000, p, 4);
}

function formatZone(d) {
  var z = d.getTimezoneOffset();
  return (z > 0 ? "-" : (z *= -1, "+")) + pad(z / 60 | 0, "0", 2) + pad(z % 60, "0", 2);
}

function formatUTCDayOfMonth(d, p) {
  return pad(d.getUTCDate(), p, 2);
}

function formatUTCHour24(d, p) {
  return pad(d.getUTCHours(), p, 2);
}

function formatUTCHour12(d, p) {
  return pad(d.getUTCHours() % 12 || 12, p, 2);
}

function formatUTCDayOfYear(d, p) {
  return pad(1 + _d3Time.utcDay.count((0, _d3Time.utcYear)(d), d), p, 3);
}

function formatUTCMilliseconds(d, p) {
  return pad(d.getUTCMilliseconds(), p, 3);
}

function formatUTCMicroseconds(d, p) {
  return formatUTCMilliseconds(d, p) + "000";
}

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekdayNumberMonday(d) {
  var dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(_d3Time.utcSunday.count((0, _d3Time.utcYear)(d) - 1, d), p, 2);
}

function formatUTCWeekNumberISO(d, p) {
  var day = d.getUTCDay();
  d = day >= 4 || day === 0 ? (0, _d3Time.utcThursday)(d) : _d3Time.utcThursday.ceil(d);
  return pad(_d3Time.utcThursday.count((0, _d3Time.utcYear)(d), d) + ((0, _d3Time.utcYear)(d).getUTCDay() === 4), p, 2);
}

function formatUTCWeekdayNumberSunday(d) {
  return d.getUTCDay();
}

function formatUTCWeekNumberMonday(d, p) {
  return pad(_d3Time.utcMonday.count((0, _d3Time.utcYear)(d) - 1, d), p, 2);
}

function formatUTCYear(d, p) {
  return pad(d.getUTCFullYear() % 100, p, 2);
}

function formatUTCFullYear(d, p) {
  return pad(d.getUTCFullYear() % 10000, p, 4);
}

function formatUTCZone() {
  return "+0000";
}

function formatLiteralPercent() {
  return "%";
}

function formatUnixTimestamp(d) {
  return +d;
}

function formatUnixTimestampSeconds(d) {
  return Math.floor(+d / 1000);
}

},{"d3-time":463}],460:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.days = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var day = (0, _interval.default)(function (date) {
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setDate(date.getDate() + step);
}, function (start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationDay;
}, function (date) {
  return date.getDate() - 1;
});
var _default = day;
exports.default = _default;
var days = day.range;
exports.days = days;

},{"./duration.js":461,"./interval.js":464}],461:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationWeek = exports.durationDay = exports.durationHour = exports.durationMinute = exports.durationSecond = void 0;
var durationSecond = 1e3;
exports.durationSecond = durationSecond;
var durationMinute = 6e4;
exports.durationMinute = durationMinute;
var durationHour = 36e5;
exports.durationHour = durationHour;
var durationDay = 864e5;
exports.durationDay = durationDay;
var durationWeek = 6048e5;
exports.durationWeek = durationWeek;

},{}],462:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hour = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond - date.getMinutes() * _duration.durationMinute);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getHours();
});
var _default = hour;
exports.default = _default;
var hours = hour.range;
exports.hours = hours;

},{"./duration.js":461,"./interval.js":464}],463:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "timeInterval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});
Object.defineProperty(exports, "timeMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "timeMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "utcMillisecond", {
  enumerable: true,
  get: function () {
    return _millisecond.default;
  }
});
Object.defineProperty(exports, "utcMilliseconds", {
  enumerable: true,
  get: function () {
    return _millisecond.milliseconds;
  }
});
Object.defineProperty(exports, "timeSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "timeSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "utcSecond", {
  enumerable: true,
  get: function () {
    return _second.default;
  }
});
Object.defineProperty(exports, "utcSeconds", {
  enumerable: true,
  get: function () {
    return _second.seconds;
  }
});
Object.defineProperty(exports, "timeMinute", {
  enumerable: true,
  get: function () {
    return _minute.default;
  }
});
Object.defineProperty(exports, "timeMinutes", {
  enumerable: true,
  get: function () {
    return _minute.minutes;
  }
});
Object.defineProperty(exports, "timeHour", {
  enumerable: true,
  get: function () {
    return _hour.default;
  }
});
Object.defineProperty(exports, "timeHours", {
  enumerable: true,
  get: function () {
    return _hour.hours;
  }
});
Object.defineProperty(exports, "timeDay", {
  enumerable: true,
  get: function () {
    return _day.default;
  }
});
Object.defineProperty(exports, "timeDays", {
  enumerable: true,
  get: function () {
    return _day.days;
  }
});
Object.defineProperty(exports, "timeWeek", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeWeeks", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeSunday", {
  enumerable: true,
  get: function () {
    return _week.sunday;
  }
});
Object.defineProperty(exports, "timeSundays", {
  enumerable: true,
  get: function () {
    return _week.sundays;
  }
});
Object.defineProperty(exports, "timeMonday", {
  enumerable: true,
  get: function () {
    return _week.monday;
  }
});
Object.defineProperty(exports, "timeMondays", {
  enumerable: true,
  get: function () {
    return _week.mondays;
  }
});
Object.defineProperty(exports, "timeTuesday", {
  enumerable: true,
  get: function () {
    return _week.tuesday;
  }
});
Object.defineProperty(exports, "timeTuesdays", {
  enumerable: true,
  get: function () {
    return _week.tuesdays;
  }
});
Object.defineProperty(exports, "timeWednesday", {
  enumerable: true,
  get: function () {
    return _week.wednesday;
  }
});
Object.defineProperty(exports, "timeWednesdays", {
  enumerable: true,
  get: function () {
    return _week.wednesdays;
  }
});
Object.defineProperty(exports, "timeThursday", {
  enumerable: true,
  get: function () {
    return _week.thursday;
  }
});
Object.defineProperty(exports, "timeThursdays", {
  enumerable: true,
  get: function () {
    return _week.thursdays;
  }
});
Object.defineProperty(exports, "timeFriday", {
  enumerable: true,
  get: function () {
    return _week.friday;
  }
});
Object.defineProperty(exports, "timeFridays", {
  enumerable: true,
  get: function () {
    return _week.fridays;
  }
});
Object.defineProperty(exports, "timeSaturday", {
  enumerable: true,
  get: function () {
    return _week.saturday;
  }
});
Object.defineProperty(exports, "timeSaturdays", {
  enumerable: true,
  get: function () {
    return _week.saturdays;
  }
});
Object.defineProperty(exports, "timeMonth", {
  enumerable: true,
  get: function () {
    return _month.default;
  }
});
Object.defineProperty(exports, "timeMonths", {
  enumerable: true,
  get: function () {
    return _month.months;
  }
});
Object.defineProperty(exports, "timeYear", {
  enumerable: true,
  get: function () {
    return _year.default;
  }
});
Object.defineProperty(exports, "timeYears", {
  enumerable: true,
  get: function () {
    return _year.years;
  }
});
Object.defineProperty(exports, "utcMinute", {
  enumerable: true,
  get: function () {
    return _utcMinute.default;
  }
});
Object.defineProperty(exports, "utcMinutes", {
  enumerable: true,
  get: function () {
    return _utcMinute.utcMinutes;
  }
});
Object.defineProperty(exports, "utcHour", {
  enumerable: true,
  get: function () {
    return _utcHour.default;
  }
});
Object.defineProperty(exports, "utcHours", {
  enumerable: true,
  get: function () {
    return _utcHour.utcHours;
  }
});
Object.defineProperty(exports, "utcDay", {
  enumerable: true,
  get: function () {
    return _utcDay.default;
  }
});
Object.defineProperty(exports, "utcDays", {
  enumerable: true,
  get: function () {
    return _utcDay.utcDays;
  }
});
Object.defineProperty(exports, "utcWeek", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcWeeks", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcSunday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSunday;
  }
});
Object.defineProperty(exports, "utcSundays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSundays;
  }
});
Object.defineProperty(exports, "utcMonday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMonday;
  }
});
Object.defineProperty(exports, "utcMondays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcMondays;
  }
});
Object.defineProperty(exports, "utcTuesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesday;
  }
});
Object.defineProperty(exports, "utcTuesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcTuesdays;
  }
});
Object.defineProperty(exports, "utcWednesday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesday;
  }
});
Object.defineProperty(exports, "utcWednesdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcWednesdays;
  }
});
Object.defineProperty(exports, "utcThursday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursday;
  }
});
Object.defineProperty(exports, "utcThursdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcThursdays;
  }
});
Object.defineProperty(exports, "utcFriday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFriday;
  }
});
Object.defineProperty(exports, "utcFridays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcFridays;
  }
});
Object.defineProperty(exports, "utcSaturday", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturday;
  }
});
Object.defineProperty(exports, "utcSaturdays", {
  enumerable: true,
  get: function () {
    return _utcWeek.utcSaturdays;
  }
});
Object.defineProperty(exports, "utcMonth", {
  enumerable: true,
  get: function () {
    return _utcMonth.default;
  }
});
Object.defineProperty(exports, "utcMonths", {
  enumerable: true,
  get: function () {
    return _utcMonth.utcMonths;
  }
});
Object.defineProperty(exports, "utcYear", {
  enumerable: true,
  get: function () {
    return _utcYear.default;
  }
});
Object.defineProperty(exports, "utcYears", {
  enumerable: true,
  get: function () {
    return _utcYear.utcYears;
  }
});

var _interval = _interopRequireDefault(require("./interval.js"));

var _millisecond = _interopRequireWildcard(require("./millisecond.js"));

var _second = _interopRequireWildcard(require("./second.js"));

var _minute = _interopRequireWildcard(require("./minute.js"));

var _hour = _interopRequireWildcard(require("./hour.js"));

var _day = _interopRequireWildcard(require("./day.js"));

var _week = require("./week.js");

var _month = _interopRequireWildcard(require("./month.js"));

var _year = _interopRequireWildcard(require("./year.js"));

var _utcMinute = _interopRequireWildcard(require("./utcMinute.js"));

var _utcHour = _interopRequireWildcard(require("./utcHour.js"));

var _utcDay = _interopRequireWildcard(require("./utcDay.js"));

var _utcWeek = require("./utcWeek.js");

var _utcMonth = _interopRequireWildcard(require("./utcMonth.js"));

var _utcYear = _interopRequireWildcard(require("./utcYear.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./day.js":460,"./hour.js":462,"./interval.js":464,"./millisecond.js":465,"./minute.js":466,"./month.js":467,"./second.js":468,"./utcDay.js":469,"./utcHour.js":470,"./utcMinute.js":471,"./utcMonth.js":472,"./utcWeek.js":473,"./utcYear.js":474,"./week.js":475,"./year.js":476}],464:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newInterval;
var t0 = new Date(),
    t1 = new Date();

function newInterval(floori, offseti, count, field) {
  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date() : new Date(+date)), date;
  }

  interval.floor = function (date) {
    return floori(date = new Date(+date)), date;
  };

  interval.ceil = function (date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function (date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function (date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function (start, stop, step) {
    var range = [],
        previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date

    do range.push(previous = new Date(+start)), offseti(start, step), floori(start); while (previous < start && start < stop);

    return range;
  };

  interval.filter = function (test) {
    return newInterval(function (date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function (date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty

        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty

        }
      }
    });
  };

  if (count) {
    interval.count = function (start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function (step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null : !(step > 1) ? interval : interval.filter(field ? function (d) {
        return field(d) % step === 0;
      } : function (d) {
        return interval.count(0, d) % step === 0;
      });
    };
  }

  return interval;
}

},{}],465:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.milliseconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var millisecond = (0, _interval.default)(function () {// noop
}, function (date, step) {
  date.setTime(+date + step);
}, function (start, end) {
  return end - start;
}); // An optimized implementation for this simple case.

millisecond.every = function (k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return (0, _interval.default)(function (date) {
    date.setTime(Math.floor(date / k) * k);
  }, function (date, step) {
    date.setTime(+date + step * k);
  }, function (start, end) {
    return (end - start) / k;
  });
};

var _default = millisecond;
exports.default = _default;
var milliseconds = millisecond.range;
exports.milliseconds = milliseconds;

},{"./interval.js":464}],466:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.minutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var minute = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * _duration.durationSecond);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getMinutes();
});
var _default = minute;
exports.default = _default;
var minutes = minute.range;
exports.minutes = minutes;

},{"./duration.js":461,"./interval.js":464}],467:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.months = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var month = (0, _interval.default)(function (date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setMonth(date.getMonth() + step);
}, function (start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function (date) {
  return date.getMonth();
});
var _default = month;
exports.default = _default;
var months = month.range;
exports.months = months;

},{"./interval.js":464}],468:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seconds = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var second = (0, _interval.default)(function (date) {
  date.setTime(date - date.getMilliseconds());
}, function (date, step) {
  date.setTime(+date + step * _duration.durationSecond);
}, function (start, end) {
  return (end - start) / _duration.durationSecond;
}, function (date) {
  return date.getUTCSeconds();
});
var _default = second;
exports.default = _default;
var seconds = second.range;
exports.seconds = seconds;

},{"./duration.js":461,"./interval.js":464}],469:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcDays = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcDay = (0, _interval.default)(function (date) {
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function (start, end) {
  return (end - start) / _duration.durationDay;
}, function (date) {
  return date.getUTCDate() - 1;
});
var _default = utcDay;
exports.default = _default;
var utcDays = utcDay.range;
exports.utcDays = utcDays;

},{"./duration.js":461,"./interval.js":464}],470:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcHours = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcHour = (0, _interval.default)(function (date) {
  date.setUTCMinutes(0, 0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationHour);
}, function (start, end) {
  return (end - start) / _duration.durationHour;
}, function (date) {
  return date.getUTCHours();
});
var _default = utcHour;
exports.default = _default;
var utcHours = utcHour.range;
exports.utcHours = utcHours;

},{"./duration.js":461,"./interval.js":464}],471:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMinutes = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMinute = (0, _interval.default)(function (date) {
  date.setUTCSeconds(0, 0);
}, function (date, step) {
  date.setTime(+date + step * _duration.durationMinute);
}, function (start, end) {
  return (end - start) / _duration.durationMinute;
}, function (date) {
  return date.getUTCMinutes();
});
var _default = utcMinute;
exports.default = _default;
var utcMinutes = utcMinute.range;
exports.utcMinutes = utcMinutes;

},{"./duration.js":461,"./interval.js":464}],472:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcMonths = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcMonth = (0, _interval.default)(function (date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function (start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function (date) {
  return date.getUTCMonth();
});
var _default = utcMonth;
exports.default = _default;
var utcMonths = utcMonth.range;
exports.utcMonths = utcMonths;

},{"./interval.js":464}],473:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcSaturdays = exports.utcFridays = exports.utcThursdays = exports.utcWednesdays = exports.utcTuesdays = exports.utcMondays = exports.utcSundays = exports.utcSaturday = exports.utcFriday = exports.utcThursday = exports.utcWednesday = exports.utcTuesday = exports.utcMonday = exports.utcSunday = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function utcWeekday(i) {
  return (0, _interval.default)(function (date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function (start, end) {
    return (end - start) / _duration.durationWeek;
  });
}

var utcSunday = utcWeekday(0);
exports.utcSunday = utcSunday;
var utcMonday = utcWeekday(1);
exports.utcMonday = utcMonday;
var utcTuesday = utcWeekday(2);
exports.utcTuesday = utcTuesday;
var utcWednesday = utcWeekday(3);
exports.utcWednesday = utcWednesday;
var utcThursday = utcWeekday(4);
exports.utcThursday = utcThursday;
var utcFriday = utcWeekday(5);
exports.utcFriday = utcFriday;
var utcSaturday = utcWeekday(6);
exports.utcSaturday = utcSaturday;
var utcSundays = utcSunday.range;
exports.utcSundays = utcSundays;
var utcMondays = utcMonday.range;
exports.utcMondays = utcMondays;
var utcTuesdays = utcTuesday.range;
exports.utcTuesdays = utcTuesdays;
var utcWednesdays = utcWednesday.range;
exports.utcWednesdays = utcWednesdays;
var utcThursdays = utcThursday.range;
exports.utcThursdays = utcThursdays;
var utcFridays = utcFriday.range;
exports.utcFridays = utcFridays;
var utcSaturdays = utcSaturday.range;
exports.utcSaturdays = utcSaturdays;

},{"./duration.js":461,"./interval.js":464}],474:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utcYears = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var utcYear = (0, _interval.default)(function (date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function (date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function (start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function (date) {
  return date.getUTCFullYear();
}); // An optimized implementation for this simple case.

utcYear.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

var _default = utcYear;
exports.default = _default;
var utcYears = utcYear.range;
exports.utcYears = utcYears;

},{"./interval.js":464}],475:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saturdays = exports.fridays = exports.thursdays = exports.wednesdays = exports.tuesdays = exports.mondays = exports.sundays = exports.saturday = exports.friday = exports.thursday = exports.wednesday = exports.tuesday = exports.monday = exports.sunday = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

var _duration = require("./duration.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function weekday(i) {
  return (0, _interval.default)(function (date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function (start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * _duration.durationMinute) / _duration.durationWeek;
  });
}

var sunday = weekday(0);
exports.sunday = sunday;
var monday = weekday(1);
exports.monday = monday;
var tuesday = weekday(2);
exports.tuesday = tuesday;
var wednesday = weekday(3);
exports.wednesday = wednesday;
var thursday = weekday(4);
exports.thursday = thursday;
var friday = weekday(5);
exports.friday = friday;
var saturday = weekday(6);
exports.saturday = saturday;
var sundays = sunday.range;
exports.sundays = sundays;
var mondays = monday.range;
exports.mondays = mondays;
var tuesdays = tuesday.range;
exports.tuesdays = tuesdays;
var wednesdays = wednesday.range;
exports.wednesdays = wednesdays;
var thursdays = thursday.range;
exports.thursdays = thursdays;
var fridays = friday.range;
exports.fridays = fridays;
var saturdays = saturday.range;
exports.saturdays = saturdays;

},{"./duration.js":461,"./interval.js":464}],476:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.years = exports.default = void 0;

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var year = (0, _interval.default)(function (date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function (date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function (start, end) {
  return end.getFullYear() - start.getFullYear();
}, function (date) {
  return date.getFullYear();
}); // An optimized implementation for this simple case.

year.every = function (k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : (0, _interval.default)(function (date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function (date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

var _default = year;
exports.default = _default;
var years = year.range;
exports.years = years;

},{"./interval.js":464}],477:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "now", {
  enumerable: true,
  get: function () {
    return _timer.now;
  }
});
Object.defineProperty(exports, "timer", {
  enumerable: true,
  get: function () {
    return _timer.timer;
  }
});
Object.defineProperty(exports, "timerFlush", {
  enumerable: true,
  get: function () {
    return _timer.timerFlush;
  }
});
Object.defineProperty(exports, "timeout", {
  enumerable: true,
  get: function () {
    return _timeout.default;
  }
});
Object.defineProperty(exports, "interval", {
  enumerable: true,
  get: function () {
    return _interval.default;
  }
});

var _timer = require("./timer.js");

var _timeout = _interopRequireDefault(require("./timeout.js"));

var _interval = _interopRequireDefault(require("./interval.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./interval.js":478,"./timeout.js":479,"./timer.js":480}],478:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer.js");

function _default(callback, delay, time) {
  var t = new _timer.Timer(),
      total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? (0, _timer.now)() : +time;
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}

},{"./timer.js":480}],479:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _timer = require("./timer.js");

function _default(callback, delay, time) {
  var t = new _timer.Timer();
  delay = delay == null ? 0 : +delay;
  t.restart(function (elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

},{"./timer.js":480}],480:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = now;
exports.Timer = Timer;
exports.timer = timer;
exports.timerFlush = timerFlush;
var frame = 0,
    // is an animation frame pending?
timeout = 0,
    // is a timeout pending?
interval = 0,
    // are any timers active?
pokeDelay = 1000,
    // how frequently we check for clock skew
taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) {
  setTimeout(f, 17);
};

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call = this._time = this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function (callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);

    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;else taskHead = this;
      taskTail = this;
    }

    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function () {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.

  ++frame; // Pretend we’ve set an alarm, if we haven’t already.

  var t = taskHead,
      e;

  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }

  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;

  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(),
      delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0,
      t1 = taskHead,
      t2,
      time = Infinity;

  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }

  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.

  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.

  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

},{}],481:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./transition/index.js");

var _schedule = require("./transition/schedule.js");

var root = [null];

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";

    for (i in schedules) {
      if ((schedule = schedules[i]).state > _schedule.SCHEDULED && schedule.name === name) {
        return new _index.Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}

},{"./transition/index.js":494,"./transition/schedule.js":499}],482:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "transition", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "active", {
  enumerable: true,
  get: function () {
    return _active.default;
  }
});
Object.defineProperty(exports, "interrupt", {
  enumerable: true,
  get: function () {
    return _interrupt.default;
  }
});

require("./selection/index.js");

var _index2 = _interopRequireDefault(require("./transition/index.js"));

var _active = _interopRequireDefault(require("./active.js"));

var _interrupt = _interopRequireDefault(require("./interrupt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./active.js":481,"./interrupt.js":483,"./selection/index.js":484,"./transition/index.js":494}],483:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./transition/schedule.js");

function _default(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;
  if (!schedules) return;
  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty = false;
      continue;
    }

    active = schedule.state > _schedule.STARTING && schedule.state < _schedule.ENDING;
    schedule.state = _schedule.ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

},{"./transition/schedule.js":499}],484:[function(require,module,exports){
"use strict";

var _d3Selection = require("d3-selection");

var _interrupt = _interopRequireDefault(require("./interrupt.js"));

var _transition = _interopRequireDefault(require("./transition.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_d3Selection.selection.prototype.interrupt = _interrupt.default;
_d3Selection.selection.prototype.transition = _transition.default;

},{"./interrupt.js":485,"./transition.js":486,"d3-selection":355}],485:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _interrupt = _interopRequireDefault(require("../interrupt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(name) {
  return this.each(function () {
    (0, _interrupt.default)(this, name);
  });
}

},{"../interrupt.js":483}],486:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("../transition/index.js");

var _schedule = _interopRequireDefault(require("../transition/schedule.js"));

var _d3Ease = require("d3-ease");

var _d3Timer = require("d3-timer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: _d3Ease.easeCubicInOut
};

function inherit(node, id) {
  var timing;

  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = (0, _d3Timer.now)(), defaultTiming;
    }
  }

  return timing;
}

function _default(name) {
  var id, timing;

  if (name instanceof _index.Transition) {
    id = name._id, name = name._name;
  } else {
    id = (0, _index.newId)(), (timing = defaultTiming).time = (0, _d3Timer.now)(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        (0, _schedule.default)(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id);
}

},{"../transition/index.js":494,"../transition/schedule.js":499,"d3-ease":92,"d3-timer":477}],487:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _tween = require("./tween.js");

var _interpolate = _interopRequireDefault(require("./interpolate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0,
        value1 = value(this),
        string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function _default(name, value) {
  var fullname = (0, _d3Selection.namespace)(name),
      i = fullname === "transform" ? _d3Interpolate.interpolateTransformSvg : _interpolate.default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, (0, _tween.tweenValue)(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

},{"./interpolate.js":495,"./tween.js":508,"d3-interpolate":236,"d3-selection":355}],488:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

function attrInterpolate(name, i) {
  return function (t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function (t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function _default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = (0, _d3Selection.namespace)(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

},{"d3-selection":355}],489:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function delayFunction(id, value) {
  return function () {
    (0, _schedule.init)(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.init)(this, id).delay = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id, value)) : (0, _schedule.get)(this.node(), id).delay;
}

},{"./schedule.js":499}],490:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function durationFunction(id, value) {
  return function () {
    (0, _schedule.set)(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function () {
    (0, _schedule.set)(this, id).duration = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id, value)) : (0, _schedule.get)(this.node(), id).duration;
}

},{"./schedule.js":499}],491:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error();
  return function () {
    (0, _schedule.set)(this, id).ease = value;
  };
}

function _default(value) {
  var id = this._id;
  return arguments.length ? this.each(easeConstant(id, value)) : (0, _schedule.get)(this.node(), id).ease;
}

},{"./schedule.js":499}],492:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function _default() {
  var on0,
      on1,
      that = this,
      id = that._id,
      size = that.size();
  return new Promise(function (resolve, reject) {
    var cancel = {
      value: reject
    },
        end = {
      value: function () {
        if (--size === 0) resolve();
      }
    };
    that.each(function () {
      var schedule = (0, _schedule.set)(this, id),
          on = schedule.on; // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.

      if (on !== on0) {
        on1 = (on0 = on).copy();

        on1._.cancel.push(cancel);

        on1._.interrupt.push(cancel);

        on1._.end.push(end);
      }

      schedule.on = on1;
    });
  });
}

},{"./schedule.js":499}],493:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

function _default(match) {
  if (typeof match !== "function") match = (0, _d3Selection.matcher)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, this._name, this._id);
}

},{"./index.js":494,"d3-selection":355}],494:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transition = Transition;
exports.default = transition;
exports.newId = newId;

var _d3Selection = require("d3-selection");

var _attr = _interopRequireDefault(require("./attr.js"));

var _attrTween = _interopRequireDefault(require("./attrTween.js"));

var _delay = _interopRequireDefault(require("./delay.js"));

var _duration = _interopRequireDefault(require("./duration.js"));

var _ease = _interopRequireDefault(require("./ease.js"));

var _filter = _interopRequireDefault(require("./filter.js"));

var _merge = _interopRequireDefault(require("./merge.js"));

var _on = _interopRequireDefault(require("./on.js"));

var _remove = _interopRequireDefault(require("./remove.js"));

var _select = _interopRequireDefault(require("./select.js"));

var _selectAll = _interopRequireDefault(require("./selectAll.js"));

var _selection = _interopRequireDefault(require("./selection.js"));

var _style = _interopRequireDefault(require("./style.js"));

var _styleTween = _interopRequireDefault(require("./styleTween.js"));

var _text = _interopRequireDefault(require("./text.js"));

var _textTween = _interopRequireDefault(require("./textTween.js"));

var _transition = _interopRequireDefault(require("./transition.js"));

var _tween = _interopRequireDefault(require("./tween.js"));

var _end = _interopRequireDefault(require("./end.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return (0, _d3Selection.selection)().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = _d3Selection.selection.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: _select.default,
  selectAll: _selectAll.default,
  filter: _filter.default,
  merge: _merge.default,
  selection: _selection.default,
  transition: _transition.default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: _on.default,
  attr: _attr.default,
  attrTween: _attrTween.default,
  style: _style.default,
  styleTween: _styleTween.default,
  text: _text.default,
  textTween: _textTween.default,
  remove: _remove.default,
  tween: _tween.default,
  delay: _delay.default,
  duration: _duration.default,
  ease: _ease.default,
  end: _end.default
};

},{"./attr.js":487,"./attrTween.js":488,"./delay.js":489,"./duration.js":490,"./ease.js":491,"./end.js":492,"./filter.js":493,"./merge.js":496,"./on.js":497,"./remove.js":498,"./select.js":500,"./selectAll.js":501,"./selection.js":502,"./style.js":503,"./styleTween.js":504,"./text.js":505,"./textTween.js":506,"./transition.js":507,"./tween.js":508,"d3-selection":355}],495:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Color = require("d3-color");

var _d3Interpolate = require("d3-interpolate");

function _default(a, b) {
  var c;
  return (typeof b === "number" ? _d3Interpolate.interpolateNumber : b instanceof _d3Color.color ? _d3Interpolate.interpolateRgb : (c = (0, _d3Color.color)(b)) ? (b = c, _d3Interpolate.interpolateRgb) : _d3Interpolate.interpolateString)(a, b);
}

},{"d3-color":60,"d3-interpolate":236}],496:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index.js");

function _default(transition) {
  if (transition._id !== this._id) throw new Error();

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index.Transition(merges, this._parents, this._name, this._id);
}

},{"./index.js":494}],497:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _schedule = require("./schedule.js");

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function (t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0,
      on1,
      sit = start(name) ? _schedule.init : _schedule.set;
  return function () {
    var schedule = sit(this, id),
        on = schedule.on; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}

function _default(name, listener) {
  var id = this._id;
  return arguments.length < 2 ? (0, _schedule.get)(this.node(), id).on.on(name) : this.each(onFunction(id, name, listener));
}

},{"./schedule.js":499}],498:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function removeFunction(id) {
  return function () {
    var parent = this.parentNode;

    for (var i in this.__transition) if (+i !== id) return;

    if (parent) parent.removeChild(this);
  };
}

function _default() {
  return this.on("end.remove", removeFunction(this._id));
}

},{}],499:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.init = init;
exports.set = set;
exports.get = get;
exports.ENDED = exports.ENDING = exports.RUNNING = exports.STARTED = exports.STARTING = exports.SCHEDULED = exports.CREATED = void 0;

var _d3Dispatch = require("d3-dispatch");

var _d3Timer = require("d3-timer");

var emptyOn = (0, _d3Dispatch.dispatch)("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
exports.CREATED = CREATED;
var SCHEDULED = 1;
exports.SCHEDULED = SCHEDULED;
var STARTING = 2;
exports.STARTING = STARTING;
var STARTED = 3;
exports.STARTED = STARTED;
var RUNNING = 4;
exports.RUNNING = RUNNING;
var ENDING = 5;
exports.ENDING = ENDING;
var ENDED = 6;
exports.ENDED = ENDED;

function _default(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index,
    // For context during callback.
    group: group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set(node, id) {
  var schedule = get(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween; // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!

  schedules[id] = self;
  self.timer = (0, _d3Timer.timer)(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time); // If the elapsed delay is less than our first sleep, start immediately.

    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o; // If the state is not SCHEDULED, then we previously errored on start.

    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue; // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!

      if (o.state === STARTED) return (0, _d3Timer.timeout)(start); // Interrupt the active transition, if any.

      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } // Cancel any pre-empted transitions.
      else if (+i < id) {
          o.state = ENDED;
          o.timer.stop();
          o.on.call("cancel", node, node.__data__, o.index, o.group);
          delete schedules[i];
        }
    } // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.


    (0, _d3Timer.timeout)(function () {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    }); // Dispatch the start event.
    // Note this must be done before the tween are initialized.

    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted

    self.state = STARTED; // Initialize the tween, deleting null tween.

    tween = new Array(n = self.tween.length);

    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }

    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    } // Dispatch the end event.


    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];

    for (var i in schedules) return; // eslint-disable-line no-unused-vars


    delete node.__transition;
  }
}

},{"d3-dispatch":74,"d3-timer":477}],500:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selector)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        (0, _schedule.default)(subgroup[i], name, id, i, subgroup, (0, _schedule.get)(node, id));
      }
    }
  }

  return new _index.Transition(subgroups, this._parents, name, id);
}

},{"./index.js":494,"./schedule.js":499,"d3-selection":355}],501:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default(select) {
  var name = this._name,
      id = this._id;
  if (typeof select !== "function") select = (0, _d3Selection.selectorAll)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = (0, _schedule.get)(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            (0, _schedule.default)(child, name, id, k, children, inherit);
          }
        }

        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new _index.Transition(subgroups, parents, name, id);
}

},{"./index.js":494,"./schedule.js":499,"d3-selection":355}],502:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Selection = require("d3-selection");

var Selection = _d3Selection.selection.prototype.constructor;

function _default() {
  return new Selection(this._groups, this._parents);
}

},{"d3-selection":355}],503:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _schedule = require("./schedule.js");

var _tween = require("./tween.js");

var _interpolate = _interopRequireDefault(require("./interpolate.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        string1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function () {
    var string0 = (0, _d3Selection.style)(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), (0, _d3Selection.style)(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0,
      on1,
      listener0,
      key = "style." + name,
      event = "end." + key,
      remove;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined; // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.

    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}

function _default(name, value, priority) {
  var i = (name += "") === "transform" ? _d3Interpolate.interpolateTransformCss : _interpolate.default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, (0, _tween.tweenValue)(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}

},{"./interpolate.js":495,"./schedule.js":499,"./tween.js":508,"d3-interpolate":236,"d3-selection":355}],504:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function styleInterpolate(name, i, priority) {
  return function (t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }

  tween._value = value;
  return tween;
}

function _default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

},{}],505:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _tween = require("./tween.js");

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function _default(value) {
  return this.tween("text", typeof value === "function" ? textFunction((0, _tween.tweenValue)(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}

},{"./tween.js":508}],506:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function textInterpolate(i) {
  return function (t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;

  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }

  tween._value = value;
  return tween;
}

function _default(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}

},{}],507:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _index = require("./index.js");

var _schedule = _interopRequireWildcard(require("./schedule.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _default() {
  var name = this._name,
      id0 = this._id,
      id1 = (0, _index.newId)();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = (0, _schedule.get)(node, id0);
        (0, _schedule.default)(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new _index.Transition(groups, this._parents, name, id1);
}

},{"./index.js":494,"./schedule.js":499}],508:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.tweenValue = tweenValue;

var _schedule = require("./schedule.js");

function tweenRemove(id, name) {
  var tween0, tween1;
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = tween0 = tween;

      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function () {
    var schedule = (0, _schedule.set)(this, id),
        tween = schedule.tween; // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.

    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();

      for (var t = {
        name: name,
        value: value
      }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }

      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function _default(name, value) {
  var id = this._id;
  name += "";

  if (arguments.length < 2) {
    var tween = (0, _schedule.get)(this.node(), id).tween;

    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }

    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;
  transition.each(function () {
    var schedule = (0, _schedule.set)(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function (node) {
    return (0, _schedule.get)(node, id).value[name];
  };
}

},{"./schedule.js":499}],509:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeBeach = removeBeach;
exports.addBeach = addBeach;

var _RedBlackTree = require("./RedBlackTree");

var _Cell = require("./Cell");

var _Circle = require("./Circle");

var _Edge = require("./Edge");

var _Diagram = require("./Diagram");

var beachPool = [];

function Beach() {
  (0, _RedBlackTree.RedBlackNode)(this);
  this.edge = this.site = this.circle = null;
}

function createBeach(site) {
  var beach = beachPool.pop() || new Beach();
  beach.site = site;
  return beach;
}

function detachBeach(beach) {
  (0, _Circle.detachCircle)(beach);

  _Diagram.beaches.remove(beach);

  beachPool.push(beach);
  (0, _RedBlackTree.RedBlackNode)(beach);
}

function removeBeach(beach) {
  var circle = beach.circle,
      x = circle.x,
      y = circle.cy,
      vertex = [x, y],
      previous = beach.P,
      next = beach.N,
      disappearing = [beach];
  detachBeach(beach);
  var lArc = previous;

  while (lArc.circle && Math.abs(x - lArc.circle.x) < _Diagram.epsilon && Math.abs(y - lArc.circle.cy) < _Diagram.epsilon) {
    previous = lArc.P;
    disappearing.unshift(lArc);
    detachBeach(lArc);
    lArc = previous;
  }

  disappearing.unshift(lArc);
  (0, _Circle.detachCircle)(lArc);
  var rArc = next;

  while (rArc.circle && Math.abs(x - rArc.circle.x) < _Diagram.epsilon && Math.abs(y - rArc.circle.cy) < _Diagram.epsilon) {
    next = rArc.N;
    disappearing.push(rArc);
    detachBeach(rArc);
    rArc = next;
  }

  disappearing.push(rArc);
  (0, _Circle.detachCircle)(rArc);
  var nArcs = disappearing.length,
      iArc;

  for (iArc = 1; iArc < nArcs; ++iArc) {
    rArc = disappearing[iArc];
    lArc = disappearing[iArc - 1];
    (0, _Edge.setEdgeEnd)(rArc.edge, lArc.site, rArc.site, vertex);
  }

  lArc = disappearing[0];
  rArc = disappearing[nArcs - 1];
  rArc.edge = (0, _Edge.createEdge)(lArc.site, rArc.site, null, vertex);
  (0, _Circle.attachCircle)(lArc);
  (0, _Circle.attachCircle)(rArc);
}

function addBeach(site) {
  var x = site[0],
      directrix = site[1],
      lArc,
      rArc,
      dxl,
      dxr,
      node = _Diagram.beaches._;

  while (node) {
    dxl = leftBreakPoint(node, directrix) - x;
    if (dxl > _Diagram.epsilon) node = node.L;else {
      dxr = x - rightBreakPoint(node, directrix);

      if (dxr > _Diagram.epsilon) {
        if (!node.R) {
          lArc = node;
          break;
        }

        node = node.R;
      } else {
        if (dxl > -_Diagram.epsilon) {
          lArc = node.P;
          rArc = node;
        } else if (dxr > -_Diagram.epsilon) {
          lArc = node;
          rArc = node.N;
        } else {
          lArc = rArc = node;
        }

        break;
      }
    }
  }

  (0, _Cell.createCell)(site);
  var newArc = createBeach(site);

  _Diagram.beaches.insert(lArc, newArc);

  if (!lArc && !rArc) return;

  if (lArc === rArc) {
    (0, _Circle.detachCircle)(lArc);
    rArc = createBeach(lArc.site);

    _Diagram.beaches.insert(newArc, rArc);

    newArc.edge = rArc.edge = (0, _Edge.createEdge)(lArc.site, newArc.site);
    (0, _Circle.attachCircle)(lArc);
    (0, _Circle.attachCircle)(rArc);
    return;
  }

  if (!rArc) {
    // && lArc
    newArc.edge = (0, _Edge.createEdge)(lArc.site, newArc.site);
    return;
  } // else lArc !== rArc


  (0, _Circle.detachCircle)(lArc);
  (0, _Circle.detachCircle)(rArc);
  var lSite = lArc.site,
      ax = lSite[0],
      ay = lSite[1],
      bx = site[0] - ax,
      by = site[1] - ay,
      rSite = rArc.site,
      cx = rSite[0] - ax,
      cy = rSite[1] - ay,
      d = 2 * (bx * cy - by * cx),
      hb = bx * bx + by * by,
      hc = cx * cx + cy * cy,
      vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];
  (0, _Edge.setEdgeEnd)(rArc.edge, lSite, rSite, vertex);
  newArc.edge = (0, _Edge.createEdge)(lSite, site, null, vertex);
  rArc.edge = (0, _Edge.createEdge)(site, rSite, null, vertex);
  (0, _Circle.attachCircle)(lArc);
  (0, _Circle.attachCircle)(rArc);
}

function leftBreakPoint(arc, directrix) {
  var site = arc.site,
      rfocx = site[0],
      rfocy = site[1],
      pby2 = rfocy - directrix;
  if (!pby2) return rfocx;
  var lArc = arc.P;
  if (!lArc) return -Infinity;
  site = lArc.site;
  var lfocx = site[0],
      lfocy = site[1],
      plby2 = lfocy - directrix;
  if (!plby2) return lfocx;
  var hl = lfocx - rfocx,
      aby2 = 1 / pby2 - 1 / plby2,
      b = hl / plby2;
  if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
  return (rfocx + lfocx) / 2;
}

function rightBreakPoint(arc, directrix) {
  var rArc = arc.N;
  if (rArc) return leftBreakPoint(rArc, directrix);
  var site = arc.site;
  return site[1] === directrix ? site[0] : Infinity;
}

},{"./Cell":510,"./Circle":511,"./Diagram":512,"./Edge":513,"./RedBlackTree":514}],510:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCell = createCell;
exports.cellHalfedgeStart = cellHalfedgeStart;
exports.cellHalfedgeEnd = cellHalfedgeEnd;
exports.sortCellHalfedges = sortCellHalfedges;
exports.clipCells = clipCells;

var _Edge = require("./Edge");

var _Diagram = require("./Diagram");

function createCell(site) {
  return _Diagram.cells[site.index] = {
    site: site,
    halfedges: []
  };
}

function cellHalfedgeAngle(cell, edge) {
  var site = cell.site,
      va = edge.left,
      vb = edge.right;
  if (site === vb) vb = va, va = site;
  if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
  if (site === va) va = edge[1], vb = edge[0];else va = edge[0], vb = edge[1];
  return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
}

function cellHalfedgeStart(cell, edge) {
  return edge[+(edge.left !== cell.site)];
}

function cellHalfedgeEnd(cell, edge) {
  return edge[+(edge.left === cell.site)];
}

function sortCellHalfedges() {
  for (var i = 0, n = _Diagram.cells.length, cell, halfedges, j, m; i < n; ++i) {
    if ((cell = _Diagram.cells[i]) && (m = (halfedges = cell.halfedges).length)) {
      var index = new Array(m),
          array = new Array(m);

      for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, _Diagram.edges[halfedges[j]]);

      index.sort(function (i, j) {
        return array[j] - array[i];
      });

      for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];

      for (j = 0; j < m; ++j) halfedges[j] = array[j];
    }
  }
}

function clipCells(x0, y0, x1, y1) {
  var nCells = _Diagram.cells.length,
      iCell,
      cell,
      site,
      iHalfedge,
      halfedges,
      nHalfedges,
      start,
      startX,
      startY,
      end,
      endX,
      endY,
      cover = true;

  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = _Diagram.cells[iCell]) {
      site = cell.site;
      halfedges = cell.halfedges;
      iHalfedge = halfedges.length; // Remove any dangling clipped edges.

      while (iHalfedge--) {
        if (!_Diagram.edges[halfedges[iHalfedge]]) {
          halfedges.splice(iHalfedge, 1);
        }
      } // Insert any border edges as necessary.


      iHalfedge = 0, nHalfedges = halfedges.length;

      while (iHalfedge < nHalfedges) {
        end = cellHalfedgeEnd(cell, _Diagram.edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
        start = cellHalfedgeStart(cell, _Diagram.edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];

        if (Math.abs(endX - startX) > _Diagram.epsilon || Math.abs(endY - startY) > _Diagram.epsilon) {
          halfedges.splice(iHalfedge, 0, _Diagram.edges.push((0, _Edge.createBorderEdge)(site, end, Math.abs(endX - x0) < _Diagram.epsilon && y1 - endY > _Diagram.epsilon ? [x0, Math.abs(startX - x0) < _Diagram.epsilon ? startY : y1] : Math.abs(endY - y1) < _Diagram.epsilon && x1 - endX > _Diagram.epsilon ? [Math.abs(startY - y1) < _Diagram.epsilon ? startX : x1, y1] : Math.abs(endX - x1) < _Diagram.epsilon && endY - y0 > _Diagram.epsilon ? [x1, Math.abs(startX - x1) < _Diagram.epsilon ? startY : y0] : Math.abs(endY - y0) < _Diagram.epsilon && endX - x0 > _Diagram.epsilon ? [Math.abs(startY - y0) < _Diagram.epsilon ? startX : x0, y0] : null)) - 1);
          ++nHalfedges;
        }
      }

      if (nHalfedges) cover = false;
    }
  } // If there weren’t any edges, have the closest site cover the extent.
  // It doesn’t matter which corner of the extent we measure!


  if (cover) {
    var dx,
        dy,
        d2,
        dc = Infinity;

    for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
      if (cell = _Diagram.cells[iCell]) {
        site = cell.site;
        dx = site[0] - x0;
        dy = site[1] - y0;
        d2 = dx * dx + dy * dy;
        if (d2 < dc) dc = d2, cover = cell;
      }
    }

    if (cover) {
      var v00 = [x0, y0],
          v01 = [x0, y1],
          v11 = [x1, y1],
          v10 = [x1, y0];
      cover.halfedges.push(_Diagram.edges.push((0, _Edge.createBorderEdge)(site = cover.site, v00, v01)) - 1, _Diagram.edges.push((0, _Edge.createBorderEdge)(site, v01, v11)) - 1, _Diagram.edges.push((0, _Edge.createBorderEdge)(site, v11, v10)) - 1, _Diagram.edges.push((0, _Edge.createBorderEdge)(site, v10, v00)) - 1);
    }
  } // Lastly delete any cells with no edges; these were entirely clipped.


  for (iCell = 0; iCell < nCells; ++iCell) {
    if (cell = _Diagram.cells[iCell]) {
      if (!cell.halfedges.length) {
        delete _Diagram.cells[iCell];
      }
    }
  }
}

},{"./Diagram":512,"./Edge":513}],511:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachCircle = attachCircle;
exports.detachCircle = detachCircle;
exports.firstCircle = void 0;

var _RedBlackTree = require("./RedBlackTree");

var _Diagram = require("./Diagram");

var circlePool = [];
var firstCircle;
exports.firstCircle = firstCircle;

function Circle() {
  (0, _RedBlackTree.RedBlackNode)(this);
  this.x = this.y = this.arc = this.site = this.cy = null;
}

function attachCircle(arc) {
  var lArc = arc.P,
      rArc = arc.N;
  if (!lArc || !rArc) return;
  var lSite = lArc.site,
      cSite = arc.site,
      rSite = rArc.site;
  if (lSite === rSite) return;
  var bx = cSite[0],
      by = cSite[1],
      ax = lSite[0] - bx,
      ay = lSite[1] - by,
      cx = rSite[0] - bx,
      cy = rSite[1] - by;
  var d = 2 * (ax * cy - ay * cx);
  if (d >= -_Diagram.epsilon2) return;
  var ha = ax * ax + ay * ay,
      hc = cx * cx + cy * cy,
      x = (cy * ha - ay * hc) / d,
      y = (ax * hc - cx * ha) / d;
  var circle = circlePool.pop() || new Circle();
  circle.arc = arc;
  circle.site = cSite;
  circle.x = x + bx;
  circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

  arc.circle = circle;
  var before = null,
      node = _Diagram.circles._;

  while (node) {
    if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
      if (node.L) node = node.L;else {
        before = node.P;
        break;
      }
    } else {
      if (node.R) node = node.R;else {
        before = node;
        break;
      }
    }
  }

  _Diagram.circles.insert(before, circle);

  if (!before) exports.firstCircle = firstCircle = circle;
}

function detachCircle(arc) {
  var circle = arc.circle;

  if (circle) {
    if (!circle.P) exports.firstCircle = firstCircle = circle.N;

    _Diagram.circles.remove(circle);

    circlePool.push(circle);
    (0, _RedBlackTree.RedBlackNode)(circle);
    arc.circle = null;
  }
}

},{"./Diagram":512,"./RedBlackTree":514}],512:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Diagram;
exports.edges = exports.circles = exports.cells = exports.beaches = exports.epsilon2 = exports.epsilon = void 0;

var _Beach = require("./Beach");

var _Cell = require("./Cell");

var _Circle = require("./Circle");

var _Edge = require("./Edge");

var _RedBlackTree = _interopRequireDefault(require("./RedBlackTree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var epsilon = 1e-6;
exports.epsilon = epsilon;
var epsilon2 = 1e-12;
exports.epsilon2 = epsilon2;
var beaches;
exports.beaches = beaches;
var cells;
exports.cells = cells;
var circles;
exports.circles = circles;
var edges;
exports.edges = edges;

function triangleArea(a, b, c) {
  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
}

function lexicographic(a, b) {
  return b[1] - a[1] || b[0] - a[0];
}

function Diagram(sites, extent) {
  var site = sites.sort(lexicographic).pop(),
      x,
      y,
      circle;
  exports.edges = edges = [];
  exports.cells = cells = new Array(sites.length);
  exports.beaches = beaches = new _RedBlackTree.default();
  exports.circles = circles = new _RedBlackTree.default();

  while (true) {
    circle = _Circle.firstCircle;

    if (site && (!circle || site[1] < circle.y || site[1] === circle.y && site[0] < circle.x)) {
      if (site[0] !== x || site[1] !== y) {
        (0, _Beach.addBeach)(site);
        x = site[0], y = site[1];
      }

      site = sites.pop();
    } else if (circle) {
      (0, _Beach.removeBeach)(circle.arc);
    } else {
      break;
    }
  }

  (0, _Cell.sortCellHalfedges)();

  if (extent) {
    var x0 = +extent[0][0],
        y0 = +extent[0][1],
        x1 = +extent[1][0],
        y1 = +extent[1][1];
    (0, _Edge.clipEdges)(x0, y0, x1, y1);
    (0, _Cell.clipCells)(x0, y0, x1, y1);
  }

  this.edges = edges;
  this.cells = cells;
  exports.beaches = beaches = exports.circles = circles = exports.edges = edges = exports.cells = cells = null;
}

Diagram.prototype = {
  constructor: Diagram,
  polygons: function () {
    var edges = this.edges;
    return this.cells.map(function (cell) {
      var polygon = cell.halfedges.map(function (i) {
        return (0, _Cell.cellHalfedgeStart)(cell, edges[i]);
      });
      polygon.data = cell.site.data;
      return polygon;
    });
  },
  triangles: function () {
    var triangles = [],
        edges = this.edges;
    this.cells.forEach(function (cell, i) {
      if (!(m = (halfedges = cell.halfedges).length)) return;
      var site = cell.site,
          halfedges,
          j = -1,
          m,
          s0,
          e1 = edges[halfedges[m - 1]],
          s1 = e1.left === site ? e1.right : e1.left;

      while (++j < m) {
        s0 = s1;
        e1 = edges[halfedges[j]];
        s1 = e1.left === site ? e1.right : e1.left;

        if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
          triangles.push([site.data, s0.data, s1.data]);
        }
      }
    });
    return triangles;
  },
  links: function () {
    return this.edges.filter(function (edge) {
      return edge.right;
    }).map(function (edge) {
      return {
        source: edge.left.data,
        target: edge.right.data
      };
    });
  },
  find: function (x, y, radius) {
    var that = this,
        i0,
        i1 = that._found || 0,
        n = that.cells.length,
        cell; // Use the previously-found cell, or start with an arbitrary one.

    while (!(cell = that.cells[i1])) if (++i1 >= n) return null;

    var dx = x - cell.site[0],
        dy = y - cell.site[1],
        d2 = dx * dx + dy * dy; // Traverse the half-edges to find a closer cell, if any.

    do {
      cell = that.cells[i0 = i1], i1 = null;
      cell.halfedges.forEach(function (e) {
        var edge = that.edges[e],
            v = edge.left;
        if ((v === cell.site || !v) && !(v = edge.right)) return;
        var vx = x - v[0],
            vy = y - v[1],
            v2 = vx * vx + vy * vy;
        if (v2 < d2) d2 = v2, i1 = v.index;
      });
    } while (i1 !== null);

    that._found = i0;
    return radius == null || d2 <= radius * radius ? cell.site : null;
  }
};

},{"./Beach":509,"./Cell":510,"./Circle":511,"./Edge":513,"./RedBlackTree":514}],513:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEdge = createEdge;
exports.createBorderEdge = createBorderEdge;
exports.setEdgeEnd = setEdgeEnd;
exports.clipEdges = clipEdges;

var _Diagram = require("./Diagram");

function createEdge(left, right, v0, v1) {
  var edge = [null, null],
      index = _Diagram.edges.push(edge) - 1;
  edge.left = left;
  edge.right = right;
  if (v0) setEdgeEnd(edge, left, right, v0);
  if (v1) setEdgeEnd(edge, right, left, v1);

  _Diagram.cells[left.index].halfedges.push(index);

  _Diagram.cells[right.index].halfedges.push(index);

  return edge;
}

function createBorderEdge(left, v0, v1) {
  var edge = [v0, v1];
  edge.left = left;
  return edge;
}

function setEdgeEnd(edge, left, right, vertex) {
  if (!edge[0] && !edge[1]) {
    edge[0] = vertex;
    edge.left = left;
    edge.right = right;
  } else if (edge.left === right) {
    edge[1] = vertex;
  } else {
    edge[0] = vertex;
  }
} // Liang–Barsky line clipping.


function clipEdge(edge, x0, y0, x1, y1) {
  var a = edge[0],
      b = edge[1],
      ax = a[0],
      ay = a[1],
      bx = b[0],
      by = b[1],
      t0 = 0,
      t1 = 1,
      dx = bx - ax,
      dy = by - ay,
      r;
  r = x0 - ax;
  if (!dx && r > 0) return;
  r /= dx;

  if (dx < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dx > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = x1 - ax;
  if (!dx && r < 0) return;
  r /= dx;

  if (dx < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dx > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  r = y0 - ay;
  if (!dy && r > 0) return;
  r /= dy;

  if (dy < 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  } else if (dy > 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  }

  r = y1 - ay;
  if (!dy && r < 0) return;
  r /= dy;

  if (dy < 0) {
    if (r > t1) return;
    if (r > t0) t0 = r;
  } else if (dy > 0) {
    if (r < t0) return;
    if (r < t1) t1 = r;
  }

  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
  return true;
}

function connectEdge(edge, x0, y0, x1, y1) {
  var v1 = edge[1];
  if (v1) return true;
  var v0 = edge[0],
      left = edge.left,
      right = edge.right,
      lx = left[0],
      ly = left[1],
      rx = right[0],
      ry = right[1],
      fx = (lx + rx) / 2,
      fy = (ly + ry) / 2,
      fm,
      fb;

  if (ry === ly) {
    if (fx < x0 || fx >= x1) return;

    if (lx > rx) {
      if (!v0) v0 = [fx, y0];else if (v0[1] >= y1) return;
      v1 = [fx, y1];
    } else {
      if (!v0) v0 = [fx, y1];else if (v0[1] < y0) return;
      v1 = [fx, y0];
    }
  } else {
    fm = (lx - rx) / (ry - ly);
    fb = fy - fm * fx;

    if (fm < -1 || fm > 1) {
      if (lx > rx) {
        if (!v0) v0 = [(y0 - fb) / fm, y0];else if (v0[1] >= y1) return;
        v1 = [(y1 - fb) / fm, y1];
      } else {
        if (!v0) v0 = [(y1 - fb) / fm, y1];else if (v0[1] < y0) return;
        v1 = [(y0 - fb) / fm, y0];
      }
    } else {
      if (ly < ry) {
        if (!v0) v0 = [x0, fm * x0 + fb];else if (v0[0] >= x1) return;
        v1 = [x1, fm * x1 + fb];
      } else {
        if (!v0) v0 = [x1, fm * x1 + fb];else if (v0[0] < x0) return;
        v1 = [x0, fm * x0 + fb];
      }
    }
  }

  edge[0] = v0;
  edge[1] = v1;
  return true;
}

function clipEdges(x0, y0, x1, y1) {
  var i = _Diagram.edges.length,
      edge;

  while (i--) {
    if (!connectEdge(edge = _Diagram.edges[i], x0, y0, x1, y1) || !clipEdge(edge, x0, y0, x1, y1) || !(Math.abs(edge[0][0] - edge[1][0]) > _Diagram.epsilon || Math.abs(edge[0][1] - edge[1][1]) > _Diagram.epsilon)) {
      delete _Diagram.edges[i];
    }
  }
}

},{"./Diagram":512}],514:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedBlackNode = RedBlackNode;
exports.default = void 0;

function RedBlackTree() {
  this._ = null; // root node
}

function RedBlackNode(node) {
  node.U = // parent node
  node.C = // color - true for red, false for black
  node.L = // left node
  node.R = // right node
  node.P = // previous node
  node.N = null; // next node
}

RedBlackTree.prototype = {
  constructor: RedBlackTree,
  insert: function (after, node) {
    var parent, grandpa, uncle;

    if (after) {
      node.P = after;
      node.N = after.N;
      if (after.N) after.N.P = node;
      after.N = node;

      if (after.R) {
        after = after.R;

        while (after.L) after = after.L;

        after.L = node;
      } else {
        after.R = node;
      }

      parent = after;
    } else if (this._) {
      after = RedBlackFirst(this._);
      node.P = null;
      node.N = after;
      after.P = after.L = node;
      parent = after;
    } else {
      node.P = node.N = null;
      this._ = node;
      parent = null;
    }

    node.L = node.R = null;
    node.U = parent;
    node.C = true;
    after = node;

    while (parent && parent.C) {
      grandpa = parent.U;

      if (parent === grandpa.L) {
        uncle = grandpa.R;

        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.R) {
            RedBlackRotateLeft(this, parent);
            after = parent;
            parent = after.U;
          }

          parent.C = false;
          grandpa.C = true;
          RedBlackRotateRight(this, grandpa);
        }
      } else {
        uncle = grandpa.L;

        if (uncle && uncle.C) {
          parent.C = uncle.C = false;
          grandpa.C = true;
          after = grandpa;
        } else {
          if (after === parent.L) {
            RedBlackRotateRight(this, parent);
            after = parent;
            parent = after.U;
          }

          parent.C = false;
          grandpa.C = true;
          RedBlackRotateLeft(this, grandpa);
        }
      }

      parent = after.U;
    }

    this._.C = false;
  },
  remove: function (node) {
    if (node.N) node.N.P = node.P;
    if (node.P) node.P.N = node.N;
    node.N = node.P = null;
    var parent = node.U,
        sibling,
        left = node.L,
        right = node.R,
        next,
        red;
    if (!left) next = right;else if (!right) next = left;else next = RedBlackFirst(right);

    if (parent) {
      if (parent.L === node) parent.L = next;else parent.R = next;
    } else {
      this._ = next;
    }

    if (left && right) {
      red = next.C;
      next.C = node.C;
      next.L = left;
      left.U = next;

      if (next !== right) {
        parent = next.U;
        next.U = node.U;
        node = next.R;
        parent.L = node;
        next.R = right;
        right.U = next;
      } else {
        next.U = parent;
        parent = next;
        node = next.R;
      }
    } else {
      red = node.C;
      node = next;
    }

    if (node) node.U = parent;
    if (red) return;

    if (node && node.C) {
      node.C = false;
      return;
    }

    do {
      if (node === this._) break;

      if (node === parent.L) {
        sibling = parent.R;

        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateLeft(this, parent);
          sibling = parent.R;
        }

        if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
          if (!sibling.R || !sibling.R.C) {
            sibling.L.C = false;
            sibling.C = true;
            RedBlackRotateRight(this, sibling);
            sibling = parent.R;
          }

          sibling.C = parent.C;
          parent.C = sibling.R.C = false;
          RedBlackRotateLeft(this, parent);
          node = this._;
          break;
        }
      } else {
        sibling = parent.L;

        if (sibling.C) {
          sibling.C = false;
          parent.C = true;
          RedBlackRotateRight(this, parent);
          sibling = parent.L;
        }

        if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
          if (!sibling.L || !sibling.L.C) {
            sibling.R.C = false;
            sibling.C = true;
            RedBlackRotateLeft(this, sibling);
            sibling = parent.L;
          }

          sibling.C = parent.C;
          parent.C = sibling.L.C = false;
          RedBlackRotateRight(this, parent);
          node = this._;
          break;
        }
      }

      sibling.C = true;
      node = parent;
      parent = parent.U;
    } while (!node.C);

    if (node) node.C = false;
  }
};

function RedBlackRotateLeft(tree, node) {
  var p = node,
      q = node.R,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.R = q.L;
  if (p.R) p.R.U = p;
  q.L = p;
}

function RedBlackRotateRight(tree, node) {
  var p = node,
      q = node.L,
      parent = p.U;

  if (parent) {
    if (parent.L === p) parent.L = q;else parent.R = q;
  } else {
    tree._ = q;
  }

  q.U = parent;
  p.U = q;
  p.L = q.R;
  if (p.L) p.L.U = p;
  q.R = p;
}

function RedBlackFirst(node) {
  while (node.L) node = node.L;

  return node;
}

var _default = RedBlackTree;
exports.default = _default;

},{}],515:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],516:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "voronoi", {
  enumerable: true,
  get: function () {
    return _voronoi.default;
  }
});

var _voronoi = _interopRequireDefault(require("./voronoi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./voronoi":518}],517:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.x = x;
exports.y = y;

function x(d) {
  return d[0];
}

function y(d) {
  return d[1];
}

},{}],518:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constant = _interopRequireDefault(require("./constant"));

var _point = require("./point");

var _Diagram = _interopRequireWildcard(require("./Diagram"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var x = _point.x,
      y = _point.y,
      extent = null;

  function voronoi(data) {
    return new _Diagram.default(data.map(function (d, i) {
      var s = [Math.round(x(d, i, data) / _Diagram.epsilon) * _Diagram.epsilon, Math.round(y(d, i, data) / _Diagram.epsilon) * _Diagram.epsilon];
      s.index = i;
      s.data = d;
      return s;
    }), extent);
  }

  voronoi.polygons = function (data) {
    return voronoi(data).polygons();
  };

  voronoi.links = function (data) {
    return voronoi(data).links();
  };

  voronoi.triangles = function (data) {
    return voronoi(data).triangles();
  };

  voronoi.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : (0, _constant.default)(+_), voronoi) : x;
  };

  voronoi.y = function (_) {
    return arguments.length ? (y = typeof _ === "function" ? _ : (0, _constant.default)(+_), voronoi) : y;
  };

  voronoi.extent = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
  };

  voronoi.size = function (_) {
    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
  };

  return voronoi;
}

},{"./Diagram":512,"./constant":515,"./point":517}],519:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],520:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ZoomEvent;

function ZoomEvent(target, type, transform) {
  this.target = target;
  this.type = type;
  this.transform = transform;
}

},{}],521:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "zoom", {
  enumerable: true,
  get: function () {
    return _zoom.default;
  }
});
Object.defineProperty(exports, "zoomTransform", {
  enumerable: true,
  get: function () {
    return _transform.default;
  }
});
Object.defineProperty(exports, "zoomIdentity", {
  enumerable: true,
  get: function () {
    return _transform.identity;
  }
});

var _zoom = _interopRequireDefault(require("./zoom.js"));

var _transform = _interopRequireWildcard(require("./transform.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./transform.js":523,"./zoom.js":524}],522:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"d3-selection":355,"dup":43}],523:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = Transform;
exports.default = transform;
exports.identity = void 0;

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function (k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function (x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function (point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function (x) {
    return x * this.k + this.x;
  },
  applyY: function (y) {
    return y * this.k + this.y;
  },
  invert: function (location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function (x) {
    return (x - this.x) / this.k;
  },
  invertY: function (y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function (x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function (y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function () {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity = new Transform(1, 0, 0);
exports.identity = identity;
transform.prototype = Transform.prototype;

function transform(node) {
  while (!node.__zoom) if (!(node = node.parentNode)) return identity;

  return node.__zoom;
}

},{}],524:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _d3Dispatch = require("d3-dispatch");

var _d3Drag = require("d3-drag");

var _d3Interpolate = require("d3-interpolate");

var _d3Selection = require("d3-selection");

var _d3Transition = require("d3-transition");

var _constant = _interopRequireDefault(require("./constant.js"));

var _event = _interopRequireDefault(require("./event.js"));

var _transform = require("./transform.js");

var _noevent = _interopRequireWildcard(require("./noevent.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !_d3Selection.event.ctrlKey && !_d3Selection.event.button;
}

function defaultExtent() {
  var e = this;

  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;

    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }

    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }

  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || _transform.identity;
}

function defaultWheelDelta() {
  return -_d3Selection.event.deltaY * (_d3Selection.event.deltaMode === 1 ? 0.05 : _d3Selection.event.deltaMode ? 1 : 0.002);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}

function _default() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = _d3Interpolate.interpolateZoom,
      listeners = (0, _d3Dispatch.dispatch)("start", "zoom", "end"),
      touchstarting,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0;

  function zoom(selection) {
    selection.property("__zoom", defaultTransform).on("wheel.zoom", wheeled).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function (collection, transform, point) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);

    if (collection !== selection) {
      schedule(collection, transform, point);
    } else {
      selection.interrupt().each(function () {
        gesture(this, arguments).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
      });
    }
  };

  zoom.scaleBy = function (selection, k, p) {
    zoom.scaleTo(selection, function () {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p);
  };

  zoom.scaleTo = function (selection, k, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p);
  };

  zoom.translateBy = function (selection, x, y) {
    zoom.transform(selection, function () {
      return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent.apply(this, arguments), translateExtent);
    });
  };

  zoom.translateTo = function (selection, x, y, p) {
    zoom.transform(selection, function () {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(_transform.identity.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
    }, p);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new _transform.Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k,
        y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new _transform.Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point) {
    transition.on("start.zoom", function () {
      gesture(this, arguments).start();
    }).on("interrupt.zoom end.zoom", function () {
      gesture(this, arguments).end();
    }).tween("zoom", function () {
      var that = this,
          args = arguments,
          g = gesture(that, args),
          e = extent.apply(that, args),
          p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
          w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
          a = that.__zoom,
          b = typeof transform === "function" ? transform.apply(that, args) : transform,
          i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function (t) {
        if (t === 1) t = b; // Avoid rounding error on end.
        else {
            var l = i(t),
                k = w / l[2];
            t = new _transform.Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
          }
        g.zoom(null, t);
      };
    });
  }

  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    start: function () {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }

      return this;
    },
    zoom: function (key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function () {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }

      return this;
    },
    emit: function (type) {
      (0, _d3Selection.customEvent)(new _event.default(zoom, type, this.that.__zoom), listeners.apply, listeners, [type, this.that, this.args]);
    }
  };

  function wheeled() {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, arguments),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = (0, _d3Selection.mouse)(this); // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.

    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }

      clearTimeout(g.wheel);
    } // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return; // Otherwise, capture the mouse point and location at the start.
      else {
          g.mouse = [p, t.invert(p)];
          (0, _d3Transition.interrupt)(this);
          g.start();
        }

    (0, _noevent.default)();
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var g = gesture(this, arguments, true),
        v = (0, _d3Selection.select)(_d3Selection.event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = (0, _d3Selection.mouse)(this),
        x0 = _d3Selection.event.clientX,
        y0 = _d3Selection.event.clientY;
    (0, _d3Drag.dragDisable)(_d3Selection.event.view);
    (0, _noevent.nopropagation)();
    g.mouse = [p, this.__zoom.invert(p)];
    (0, _d3Transition.interrupt)(this);
    g.start();

    function mousemoved() {
      (0, _noevent.default)();

      if (!g.moved) {
        var dx = _d3Selection.event.clientX - x0,
            dy = _d3Selection.event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }

      g.zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = (0, _d3Selection.mouse)(g.that), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped() {
      v.on("mousemove.zoom mouseup.zoom", null);
      (0, _d3Drag.dragEnable)(_d3Selection.event.view, g.moved);
      (0, _noevent.default)();
      g.end();
    }
  }

  function dblclicked() {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = (0, _d3Selection.mouse)(this),
        p1 = t0.invert(p0),
        k1 = t0.k * (_d3Selection.event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, arguments), translateExtent);
    (0, _noevent.default)();
    if (duration > 0) (0, _d3Selection.select)(this).transition().duration(duration).call(schedule, t1, p0);else (0, _d3Selection.select)(this).call(zoom.transform, t1);
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = _d3Selection.event.touches,
        n = touches.length,
        g = gesture(this, arguments, _d3Selection.event.changedTouches.length === n),
        started,
        i,
        t,
        p;
    (0, _noevent.nopropagation)();

    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0, _d3Selection.touch)(this, touches, t.identifier);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchstarting = setTimeout(function () {
        touchstarting = null;
      }, touchDelay);
      (0, _d3Transition.interrupt)(this);
      g.start();
    }
  }

  function touchmoved() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        t,
        p,
        l;
    (0, _noevent.default)();
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    g.taps = 0;

    for (i = 0; i < n; ++i) {
      t = touches[i], p = (0, _d3Selection.touch)(this, touches, t.identifier);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }

    t = g.that.__zoom;

    if (g.touch1) {
      var p0 = g.touch0[0],
          l0 = g.touch0[1],
          p1 = g.touch1[0],
          l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended() {
    if (!this.__zooming) return;
    var g = gesture(this, arguments),
        touches = _d3Selection.event.changedTouches,
        n = touches.length,
        i,
        t;
    (0, _noevent.nopropagation)();
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, touchDelay);

    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }

    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);else {
      g.end(); // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.

      if (g.taps === 2) {
        var p = (0, _d3Selection.select)(this).on("dblclick.zoom");
        if (p) p.apply(this, arguments);
      }
    }
  }

  zoom.wheelDelta = function (_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : (0, _constant.default)(+_), zoom) : wheelDelta;
  };

  zoom.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constant.default)(!!_), zoom) : filter;
  };

  zoom.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constant.default)(!!_), zoom) : touchable;
  };

  zoom.extent = function (_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : (0, _constant.default)([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function (_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function (_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function (_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function (_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function (_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  return zoom;
}

},{"./constant.js":519,"./event.js":520,"./noevent.js":522,"./transform.js":523,"d3-dispatch":74,"d3-drag":78,"d3-interpolate":236,"d3-selection":355,"d3-transition":482}],525:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dependencies = exports.devDependencies = exports.scripts = exports.files = exports.repository = exports.module = exports.jsdelivr = exports.unpkg = exports.main = exports.author = exports.license = exports.homepage = exports.keywords = exports.description = exports.version = exports.name = void 0;
var name = "d3";
exports.name = name;
var version = "5.16.0";
exports.version = version;
var description = "Data-Driven Documents";
exports.description = description;
var keywords = ["dom", "visualization", "svg", "animation", "canvas"];
exports.keywords = keywords;
var homepage = "https://d3js.org";
exports.homepage = homepage;
var license = "BSD-3-Clause";
exports.license = license;
var author = {
  "name": "Mike Bostock",
  "url": "https://bost.ocks.org/mike"
};
exports.author = author;
var main = "dist/d3.node.js";
exports.main = main;
var unpkg = "dist/d3.min.js";
exports.unpkg = unpkg;
var jsdelivr = "dist/d3.min.js";
exports.jsdelivr = jsdelivr;
var _module = "index.js";
exports.module = _module;
var repository = {
  "type": "git",
  "url": "https://github.com/d3/d3.git"
};
exports.repository = repository;
var files = ["dist/**/*.js", "index.js"];
exports.files = files;
var scripts = {
  "pretest": "rimraf dist && mkdir dist && json2module package.json > dist/package.js && rollup -c",
  "test": "tape 'test/**/*-test.js'",
  "prepublishOnly": "yarn test",
  "postpublish": "git push && git push --tags && cd ../d3.github.com && git pull && cp ../d3/dist/d3.js d3.v5.js && cp ../d3/dist/d3.min.js d3.v5.min.js && git add d3.v5.js d3.v5.min.js && git commit -m \"d3 ${npm_package_version}\" && git push && cd - && cd ../d3-bower && git pull && cp ../d3/LICENSE ../d3/README.md ../d3/dist/d3.js ../d3/dist/d3.min.js . && git add -- LICENSE README.md d3.js d3.min.js && git commit -m \"${npm_package_version}\" && git tag -am \"${npm_package_version}\" v${npm_package_version} && git push && git push --tags && cd - && zip -j dist/d3.zip -- LICENSE README.md API.md CHANGES.md dist/d3.js dist/d3.min.js"
};
exports.scripts = scripts;
var devDependencies = {
  "json2module": "0.0",
  "rimraf": "2",
  "rollup": "1",
  "rollup-plugin-ascii": "0.0",
  "rollup-plugin-node-resolve": "3",
  "rollup-plugin-terser": "5",
  "tape": "4"
};
exports.devDependencies = devDependencies;
var dependencies = {
  "d3-array": "1",
  "d3-axis": "1",
  "d3-brush": "1",
  "d3-chord": "1",
  "d3-collection": "1",
  "d3-color": "1",
  "d3-contour": "1",
  "d3-dispatch": "1",
  "d3-drag": "1",
  "d3-dsv": "1",
  "d3-ease": "1",
  "d3-fetch": "1",
  "d3-force": "1",
  "d3-format": "1",
  "d3-geo": "1",
  "d3-hierarchy": "1",
  "d3-interpolate": "1",
  "d3-path": "1",
  "d3-polygon": "1",
  "d3-quadtree": "1",
  "d3-random": "1",
  "d3-scale": "2",
  "d3-scale-chromatic": "1",
  "d3-selection": "1",
  "d3-shape": "1",
  "d3-time": "1",
  "d3-time-format": "2",
  "d3-timer": "1",
  "d3-transition": "1",
  "d3-voronoi": "1",
  "d3-zoom": "1"
};
exports.dependencies = dependencies;

},{}],526:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  version: true
};
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _package.version;
  }
});

var _package = require("./dist/package.js");

var _d3Array = require("d3-array");

Object.keys(_d3Array).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Array[key];
    }
  });
});

var _d3Axis = require("d3-axis");

Object.keys(_d3Axis).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Axis[key];
    }
  });
});

var _d3Brush = require("d3-brush");

Object.keys(_d3Brush).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Brush[key];
    }
  });
});

var _d3Chord = require("d3-chord");

Object.keys(_d3Chord).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Chord[key];
    }
  });
});

var _d3Collection = require("d3-collection");

Object.keys(_d3Collection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Collection[key];
    }
  });
});

var _d3Color = require("d3-color");

Object.keys(_d3Color).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Color[key];
    }
  });
});

var _d3Contour = require("d3-contour");

Object.keys(_d3Contour).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Contour[key];
    }
  });
});

var _d3Dispatch = require("d3-dispatch");

Object.keys(_d3Dispatch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Dispatch[key];
    }
  });
});

var _d3Drag = require("d3-drag");

Object.keys(_d3Drag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Drag[key];
    }
  });
});

var _d3Dsv = require("d3-dsv");

Object.keys(_d3Dsv).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Dsv[key];
    }
  });
});

var _d3Ease = require("d3-ease");

Object.keys(_d3Ease).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Ease[key];
    }
  });
});

var _d3Fetch = require("d3-fetch");

Object.keys(_d3Fetch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Fetch[key];
    }
  });
});

var _d3Force = require("d3-force");

Object.keys(_d3Force).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Force[key];
    }
  });
});

var _d3Format = require("d3-format");

Object.keys(_d3Format).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Format[key];
    }
  });
});

var _d3Geo = require("d3-geo");

Object.keys(_d3Geo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Geo[key];
    }
  });
});

var _d3Hierarchy = require("d3-hierarchy");

Object.keys(_d3Hierarchy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Hierarchy[key];
    }
  });
});

var _d3Interpolate = require("d3-interpolate");

Object.keys(_d3Interpolate).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Interpolate[key];
    }
  });
});

var _d3Path = require("d3-path");

Object.keys(_d3Path).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Path[key];
    }
  });
});

var _d3Polygon = require("d3-polygon");

Object.keys(_d3Polygon).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Polygon[key];
    }
  });
});

var _d3Quadtree = require("d3-quadtree");

Object.keys(_d3Quadtree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Quadtree[key];
    }
  });
});

var _d3Random = require("d3-random");

Object.keys(_d3Random).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Random[key];
    }
  });
});

var _d3Scale = require("d3-scale");

Object.keys(_d3Scale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Scale[key];
    }
  });
});

var _d3ScaleChromatic = require("d3-scale-chromatic");

Object.keys(_d3ScaleChromatic).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3ScaleChromatic[key];
    }
  });
});

var _d3Selection = require("d3-selection");

Object.keys(_d3Selection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Selection[key];
    }
  });
});

var _d3Shape = require("d3-shape");

Object.keys(_d3Shape).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Shape[key];
    }
  });
});

var _d3Time = require("d3-time");

Object.keys(_d3Time).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Time[key];
    }
  });
});

var _d3TimeFormat = require("d3-time-format");

Object.keys(_d3TimeFormat).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3TimeFormat[key];
    }
  });
});

var _d3Timer = require("d3-timer");

Object.keys(_d3Timer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Timer[key];
    }
  });
});

var _d3Transition = require("d3-transition");

Object.keys(_d3Transition).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Transition[key];
    }
  });
});

var _d3Voronoi = require("d3-voronoi");

Object.keys(_d3Voronoi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Voronoi[key];
    }
  });
});

var _d3Zoom = require("d3-zoom");

Object.keys(_d3Zoom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _d3Zoom[key];
    }
  });
});

},{"./dist/package.js":525,"d3-array":14,"d3-axis":38,"d3-brush":42,"d3-chord":47,"d3-collection":51,"d3-color":60,"d3-contour":71,"d3-dispatch":74,"d3-drag":78,"d3-dsv":84,"d3-ease":92,"d3-fetch":101,"d3-force":111,"d3-format":130,"d3-geo":155,"d3-hierarchy":210,"d3-interpolate":236,"d3-path":251,"d3-polygon":258,"d3-quadtree":265,"d3-random":278,"d3-scale":335,"d3-scale-chromatic":303,"d3-selection":355,"d3-shape":426,"d3-time":463,"d3-time-format":456,"d3-timer":477,"d3-transition":482,"d3-voronoi":516,"d3-zoom":521}],527:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.prism = exports.mathJax = void 0;

var _mathJax = _interopRequireWildcard(require("./mathjax"));

exports.mathJax = _mathJax;

var _prism = _interopRequireWildcard(require("./prism"));

exports.prism = _prism;
},{"./mathjax":528,"./prism":529,"@babel/runtime/helpers/interopRequireWildcard":1}],528:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.transform = transform;
exports.scripts = exports.styles = void 0;
const styles = [];
exports.styles = styles;
const scripts = [{
  type: 'iife',
  data: {
    fn: mathJax => {
      mathJax.options = Object.assign({
        skipHtmlTags: {
          '[-]': ['code', 'pre']
        }
      }, mathJax.options);
      mathJax.startup = Object.assign({
        typeset: false
      }, mathJax.startup);
      window.MathJax = mathJax;
    },
    getParams: context => [Object.assign({}, context.mathJax)]
  }
}, {
  type: 'script',
  data: {
    src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
  }
}];
exports.scripts = scripts;

function transform(nodes, mm) {
  var _MathJax$typeset, _MathJax;

  (_MathJax$typeset = (_MathJax = window.MathJax).typeset) == null ? void 0 : _MathJax$typeset.call(_MathJax, nodes);
}
},{}],529:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.transform = transform;
exports.scripts = exports.styles = void 0;
const styles = [{
  type: 'stylesheet',
  data: {
    href: 'https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.css'
  }
}];
exports.styles = styles;
const scripts = [{
  type: 'iife',
  data: {
    fn: () => {
      window.Prism = {
        manual: true
      };
    }
  }
}, {
  type: 'script',
  data: {
    src: 'https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js'
  }
}, // components will be added by paths relative to path of autoloader
{
  type: 'script',
  data: {
    src: 'https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js'
  }
}];
exports.scripts = scripts;

function transform(nodes, mm) {
  const {
    Prism
  } = window;
  const langs = nodes.flatMap(node => Array.from(node.querySelectorAll('code[class*=language-]'))).map(code => {
    const lang = code.className.match(/(?:^|\s)language-(\S+)|$/)[1];

    if (Prism.languages[lang]) {
      Prism.highlightElement(code);
    } else {
      return lang;
    }
  }).filter(Boolean);

  if (langs.length) {
    Prism.plugins.autoloader.loadLanguages(langs, () => {
      mm.setData();
      mm.fit();
    });
  }
}
},{}],530:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.buildTree = buildTree;
exports.transform = transform;

var _remarkable = require("remarkable");

var _util = require("./util");

const md = new _remarkable.Remarkable();
md.block.ruler.enable(['deflist']);

function extractInline(token) {
  const html = [];
  let style = {};

  for (const child of token.children) {
    if (child.type === 'text') {
      html.push((0, _util.wrapStyle)((0, _util.escapeHtml)(child.content), style));
    } else if (child.type === 'code') {
      html.push((0, _util.wrapHtml)('code', (0, _util.wrapStyle)((0, _util.escapeHtml)(child.content), style)));
    } else if (child.type === 'softbreak') {
      html.push('<br/>');
    } else if (child.type.endsWith('_open')) {
      const type = child.type.slice(0, -5);

      if (type === 'link') {
        html.push((0, _util.htmlOpen)('a', {
          href: child.href,
          title: child.title,
          target: '_blank',
          rel: 'noopener noreferrer'
        }));
      } else {
        style = Object.assign(Object.assign({}, style), {}, {
          [type]: true
        });
      }
    } else if (child.type.endsWith('_close')) {
      const type = child.type.slice(0, -6);

      if (type === 'link') {
        html.push((0, _util.htmlClose)('a'));
      } else {
        style = Object.assign(Object.assign({}, style), {}, {
          [type]: false
        });
      }
    }
  }

  return html.join('');
}

function cleanNode(node, depth = 0) {
  if (node.t === 'heading') {
    // drop all paragraphs
    node.c = node.c.filter(item => item.t !== 'paragraph');
  } else if (node.t === 'list_item') {
    var _node$p;

    // keep first paragraph as content of list_item, drop others
    node.c = node.c.filter(item => {
      if (['paragraph', 'fence'].includes(item.t)) {
        if (!node.v) node.v = item.v;
        return false;
      }

      return true;
    });

    if (((_node$p = node.p) == null ? void 0 : _node$p.index) != null) {
      node.v = `${node.p.index}. ${node.v}`;
    }
  } else if (node.t === 'ordered_list') {
    var _node$p$start, _node$p2;

    let index = (_node$p$start = (_node$p2 = node.p) == null ? void 0 : _node$p2.start) != null ? _node$p$start : 1;
    node.c.forEach(item => {
      if (item.t === 'list_item') {
        item.p = Object.assign(Object.assign({}, item.p), {}, {
          index: index
        });
        index += 1;
      }
    });
  }

  if (node.c.length === 0) {
    delete node.c;
  } else {
    if (node.c.length === 1 && !node.c[0].v) {
      node.c = node.c[0].c;
    }

    node.c.forEach(child => cleanNode(child, depth + 1));
  }

  node.d = depth;
  delete node.p;
}

function buildTree(tokens) {
  // TODO deal with <dl><dt>
  const root = {
    t: 'root',
    d: 0,
    v: '',
    c: []
  };
  const stack = [root];
  let depth = 0;

  for (const token of tokens) {
    let current = stack[stack.length - 1];

    if (token.type.endsWith('_open')) {
      const type = token.type.slice(0, -5);
      const payload = {};

      if (type === 'heading') {
        depth = token.hLevel;

        while (((_current = current) == null ? void 0 : _current.d) >= depth) {
          var _current;

          stack.pop();
          current = stack[stack.length - 1];
        }
      } else {
        var _current2;

        depth = Math.max(depth, ((_current2 = current) == null ? void 0 : _current2.d) || 0) + 1;

        if (type === 'ordered_list') {
          payload.start = token.order;
        }
      }

      const item = {
        t: type,
        d: depth,
        p: payload,
        v: '',
        c: []
      };
      current.c.push(item);
      stack.push(item);
    } else if (!current) {
      continue;
    } else if (token.type === `${current.t}_close`) {
      if (current.t === 'heading') {
        depth = current.d;
      } else {
        stack.pop();
        depth = 0;
      }
    } else if (token.type === 'inline') {
      current.v = `${current.v || ''}${extractInline(token)}`;
    } else if (token.type === 'fence') {
      current.c.push({
        t: token.type,
        d: depth + 1,
        v: `<pre><code class="language-${token.params}">${(0, _util.escapeHtml)(token.content)}</code></pre>`,
        c: []
      });
    } else {// ignore other nodes
    }
  }

  return root;
}

function transform(content) {
  var _root$c;

  const tokens = md.parse(content || '', {});
  let root = buildTree(tokens);
  cleanNode(root);
  if (((_root$c = root.c) == null ? void 0 : _root$c.length) === 1) root = root.c[0];
  return root;
}
},{"./util":532,"remarkable":535}],531:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.escapeHtml = escapeHtml;
exports.escapeScript = escapeScript;
exports.htmlOpen = htmlOpen;
exports.htmlClose = htmlClose;
exports.wrapHtml = wrapHtml;
exports.wrapStyle = wrapStyle;

function escapeHtml(html) {
  return html.replace(/[&<"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;'
  })[m]);
}

function escapeScript(content) {
  return content.replace(/<(\/script>)/g, '\\x3c$2');
}

function htmlOpen(tagName, attrs) {
  const attrStr = attrs ? Object.entries(attrs).map(([key, value]) => {
    if (value == null || value === false) return;
    key = ` ${escapeHtml(key)}`;
    if (value === true) return key;
    return `${key}="${escapeHtml(value)}"`;
  }).filter(Boolean).join('') : '';
  return `<${tagName}${attrStr}>`;
}

function htmlClose(tagName) {
  return `</${tagName}>`;
}

function wrapHtml(tagName, content, attrs) {
  if (content == null) return htmlOpen(tagName, attrs);
  return htmlOpen(tagName, attrs) + (content || '') + htmlClose(tagName);
}

function wrapStyle(text, style) {
  if (style.code) text = wrapHtml('code', text);
  if (style.del) text = wrapHtml('del', text);
  if (style.em) text = wrapHtml('em', text);
  if (style.strong) text = wrapHtml('strong', text);
  return text;
}
},{}],532:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _html = require("./html");

Object.keys(_html).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _html[key];
});

var _loader = require("./loader");

Object.keys(_loader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _loader[key];
});
},{"./html":531,"./loader":533}],533:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.buildCode = buildCode;
exports.memoize = memoize;
exports.loadJS = loadJS;
exports.loadCSS = loadCSS;
exports.initializePlugins = initializePlugins;
exports.persistJS = persistJS;
exports.persistCSS = persistCSS;
exports.persistPlugins = persistPlugins;

var _html = require("./html");

function buildCode(fn, ...args) {
  const params = args.map(arg => {
    if (typeof arg === 'function') return arg.toString();
    return JSON.stringify(arg != null ? arg : null);
  }).join(',');
  return `(${fn.toString()})(${params})`;
}

function memoize(fn) {
  const cache = {};
  return function memoized(...args) {
    const key = `${args[0]}`;
    let data = cache[key];

    if (!data) {
      data = {
        value: fn(...args)
      };
      cache[key] = data;
    }

    return data.value;
  };
}

function createElement(tagName, props, attrs) {
  const el = document.createElement(tagName);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      el[key] = value;
    });
  }

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  return el;
}

const memoizedPreloadJS = memoize(url => {
  document.head.append(createElement('link', {
    rel: 'preload',
    as: 'script',
    href: url
  }));
});

function loadJSItem(item, context) {
  if (item.type === 'script') {
    return new Promise((resolve, reject) => {
      document.head.append(createElement('script', Object.assign(Object.assign({}, item.data), {}, {
        onload: resolve,
        onerror: reject
      })));
    });
  } else if (item.type === 'iife') {
    const {
      fn,
      getParams
    } = item.data;
    fn(...((getParams == null ? void 0 : getParams(context)) || []));
  }
}

function loadCSSItem(item) {
  if (item.type === 'style') {
    document.head.append(createElement('style', {
      textContent: item.data
    }));
  } else if (item.type === 'stylesheet') {
    document.head.append(createElement('link', Object.assign({
      rel: 'stylesheet'
    }, item.data)));
  }
}

async function loadJS(items, options) {
  const needPreload = items.filter(item => item.type === 'script');
  if (needPreload.length > 1) needPreload.forEach(item => memoizedPreloadJS(item.data.src));

  for (const item of items) {
    await loadJSItem(item, options);
  }
}

function loadCSS(items) {
  for (const item of items) {
    loadCSSItem(item);
  }
}

async function initializePlugins(plugins, options) {
  options = Object.assign({}, options);
  await Promise.all(plugins.map(plugin => {
    loadCSS(plugin.styles);
    return loadJS(plugin.scripts, options);
  }));
  return plugins.map(({
    transform
  }) => transform);
}

function persistJS(items, context) {
  return items.map(item => {
    if (item.type === 'script') return (0, _html.wrapHtml)('script', '', item.data);

    if (item.type === 'iife') {
      const {
        fn,
        getParams
      } = item.data;
      return (0, _html.wrapHtml)('script', (0, _html.escapeScript)(buildCode(fn, ...((getParams == null ? void 0 : getParams(context)) || []))));
    }
  });
}

function persistCSS(items) {
  return items.map(item => {
    if (item.type === 'stylesheet') {
      return (0, _html.wrapHtml)('link', null, Object.assign({
        rel: 'stylesheet'
      }, item.data));
    }
    /* else if (item.type === 'style') */


    return (0, _html.wrapHtml)('style', item.data);
  });
}

function persistPlugins(plugins, context) {
  const js = plugins.flatMap(plugin => persistJS(plugin.scripts, context)).join('');
  const css = plugins.flatMap(plugin => persistCSS(plugin.styles)).join('');
  const processors = plugins.map(({
    transform
  }) => transform);
  return {
    js,
    css,
    processors
  };
}
},{"./html":531}],534:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.loadPlugins = loadPlugins;
exports.plugins = exports.markmap = void 0;

var d3 = _interopRequireWildcard(require("d3"));

var _d3Flextree = require("d3-flextree");

var _util = require("./util");

var plugins = _interopRequireWildcard(require("./plugins"));

exports.plugins = plugins;
const uniqId = Math.random().toString(36).slice(2, 8);
let globalIndex = 0;

function getId() {
  globalIndex += 1;
  return `mm-${uniqId}-${globalIndex}`;
}

function walkTree(tree, callback, key = 'c') {
  const walk = (item, parent) => callback(item, () => {
    var _item$key;

    (_item$key = item[key]) == null ? void 0 : _item$key.forEach(child => {
      walk(child, item);
    });
  }, parent);

  walk(tree);
}

function linkWidth(nodeData) {
  const data = nodeData.data;
  return Math.max(6 - 2 * data.d, 1.5);
}

function adjustSpacing(tree, spacing) {
  walkTree(tree, (d, next) => {
    d.ySizeInner = d.ySize - spacing;
    d.y += spacing;
    next();
  }, 'children');
}

function arrayFrom(arrayLike) {
  const array = [];

  for (let i = 0; i < arrayLike.length; i += 1) {
    array.push(arrayLike[i]);
  }

  return array;
}

function childSelector(filter) {
  if (typeof filter === 'string') {
    const tagName = filter;

    filter = el => el.tagName === tagName;
  }

  const filterFn = filter;
  return function selector() {
    let nodes = arrayFrom(this.childNodes);
    if (filterFn) nodes = nodes.filter(node => filterFn(node));
    return nodes;
  };
}

function addClass(className, ...rest) {
  const classList = (className || '').split(' ').filter(Boolean);
  rest.forEach(item => {
    if (item && classList.indexOf(item) < 0) classList.push(item);
  });
  return classList.join(' ');
}

const markmap = Object.assign(markmapCreate, {
  processors: []
});
exports.markmap = markmap;

function markmapCreate(svg, data, opts) {
  svg = svg.datum ? svg : d3.select(svg);
  const styleNode = svg.append('style');
  const zoom = d3.zoom().on('zoom', handleZoom);
  const svgNode = svg.node();
  const options = Object.assign({
    duration: 500,
    nodeFont: '300 16px/20px sans-serif',
    nodeMinHeight: 16,
    spacingVertical: 5,
    spacingHorizontal: 80,
    autoFit: false,
    fitRatio: 0.95,
    color: d3.scaleOrdinal(d3.schemeCategory10),
    colorDepth: 0,
    paddingX: 8
  }, opts);
  const state = {
    id: options.id || getId()
  };
  const g = svg.append('g').attr('class', `${state.id}-g`);
  updateStyle();
  svg.call(zoom);
  const mm = {
    setData,
    setOptions,
    fit
  };

  if (data) {
    setData(data);
    fit(); // always fit for the first render
  }

  return mm;

  function getStyleContent() {
    const {
      style
    } = options;
    const styleText = `\
.${state.id} a { color: #0097e6; }
.${state.id} a:hover { color: #00a8ff; }
.${state.id}-g > path { fill: none; }
.${state.id}-fo > div { font: ${options.nodeFont}; white-space: nowrap; }
.${state.id}-fo code { padding: .2em .4em; font-size: calc(1em - 2px); color: #555; background-color: #f0f0f0; border-radius: 2px; }
.${state.id}-fo del { text-decoration: line-through; }
.${state.id}-fo em { font-style: italic; }
.${state.id}-fo strong { font-weight: 500; }
.${state.id}-fo pre { margin: 0; }
.${state.id}-fo pre[class*=language-] { padding: 0; }
.${state.id}-g > g { cursor: pointer; }
${style ? style(state.id) : ''}
`;
    return styleText;
  }

  function updateStyle() {
    svg.attr('class', addClass(svg.attr('class'), state.id));
    styleNode.text(getStyleContent());
  }

  function handleZoom() {
    const {
      transform
    } = d3.event;
    g.attr('transform', transform);
  }

  function initializeData(node) {
    var _markmap$processors;

    let i = 0;
    let c = 0;
    const {
      colorDepth
    } = options;
    const container = document.createElement('div');
    const containerClass = `${state.id}-container`;
    container.className = addClass(container.className, `${state.id}-fo`, containerClass);
    const style = document.createElement('style');
    style.textContent = `
${getStyleContent()}
.${containerClass} {
  position: absolute;
  width: 0;
  height: 0;
  top: -100px;
  left: -100px;
  overflow: hidden;
  font: ${options.nodeFont};
}
.${containerClass} > div {
  display: inline-block;
}
`;
    document.body.append(style, container);
    walkTree(node, (item, next) => {
      var _item$c;

      item.c = (_item$c = item.c) == null ? void 0 : _item$c.map(child => Object.assign({}, child));
      i += 1;
      options.color(`${c}`); // preload colors

      const el = document.createElement('div');
      el.innerHTML = item.v;
      container.append(el);
      item.p = Object.assign(Object.assign({}, item.p), {}, {
        // unique ID
        i,
        // color key
        c,
        el
      });
      next();
      if (!colorDepth || item.d === colorDepth) c += 1;
    });

    if ((_markmap$processors = markmap.processors) == null ? void 0 : _markmap$processors.length) {
      const nodes = arrayFrom(container.childNodes);
      markmap.processors.forEach(processor => {
        processor(nodes, mm);
      });
    }

    walkTree(node, (item, next, parent) => {
      var _parent$p;

      const rect = item.p.el.getBoundingClientRect();
      item.v = item.p.el.innerHTML;
      item.p.s = [Math.ceil(rect.width), Math.max(Math.ceil(rect.height), options.nodeMinHeight)]; // TODO keep keys for unchanged objects
      // unique key, should be based on content

      item.p.k = `${(parent == null ? void 0 : (_parent$p = parent.p) == null ? void 0 : _parent$p.i) || ''}.${item.p.i}:${item.v}`;
      next();
    });
    container.remove();
    style.remove();
  }

  function setOptions(opts) {
    Object.assign(options, opts);
  }

  function setData(data, opts) {
    if (!data) data = Object.assign({}, state.data);
    state.data = data;
    initializeData(data);
    if (opts) setOptions(opts);
    renderData();
  }

  function transition(sel) {
    if (options.duration) {
      return sel.transition().duration(options.duration);
    }

    return sel;
  }

  function fit() {
    const {
      width: offsetWidth,
      height: offsetHeight
    } = svgNode.getBoundingClientRect();
    const {
      minX,
      maxX,
      minY,
      maxY
    } = state;
    const naturalWidth = maxY - minY;
    const naturalHeight = maxX - minX;
    const scale = Math.min(offsetWidth / naturalWidth * options.fitRatio, offsetHeight / naturalHeight * options.fitRatio, 2);
    const initialZoom = d3.zoomIdentity.translate((offsetWidth - naturalWidth * scale) / 2 - minY * scale, (offsetHeight - naturalHeight * scale) / 2 - minX * scale).scale(scale);
    transition(svg).call(zoom.transform, initialZoom);
  }

  function handleClick(d) {
    var _data$p;

    const {
      data
    } = d;
    data.p = Object.assign(Object.assign({}, data.p), {}, {
      f: !((_data$p = data.p) == null ? void 0 : _data$p.f)
    });
    renderData(d.data);
  }

  function renderData(originData) {
    var _origin$data$x, _origin$data$y;

    if (!state.data) return;
    const {
      spacingHorizontal
    } = options;
    const layout = (0, _d3Flextree.flextree)().children(d => {
      var _d$p;

      return !((_d$p = d.p) == null ? void 0 : _d$p.f) && d.c;
    }).nodeSize(d => {
      const [width, height] = d.data.p.s;
      return [height, width + (width ? options.paddingX * 2 : 0) + spacingHorizontal];
    }).spacing((a, b) => {
      return a.parent === b.parent ? options.spacingVertical : options.spacingVertical * 2;
    });
    const tree = layout.hierarchy(state.data);
    layout(tree);
    adjustSpacing(tree, spacingHorizontal);
    const descendants = tree.descendants().reverse();
    const links = tree.links();
    const linkShape = d3.linkHorizontal();
    const minX = d3.min(descendants, d => d.x - d.xSize / 2);
    const maxX = d3.max(descendants, d => d.x + d.xSize / 2);
    const minY = d3.min(descendants, d => d.y);
    const maxY = d3.max(descendants, d => d.y + d.ySizeInner);
    state.minX = minX;
    state.maxX = maxX;
    state.minY = minY;
    state.maxY = maxY;
    if (options.autoFit) fit();
    const origin = originData && descendants.find(item => item.data === originData) || tree;
    const x0 = (_origin$data$x = origin.data.x0) != null ? _origin$data$x : origin.x;
    const y0 = (_origin$data$y = origin.data.y0) != null ? _origin$data$y : origin.y; // Update the nodes

    const node = g.selectAll(childSelector('g')).data(descendants, d => d.data.p.k);
    const nodeEnter = node.enter().append('g').attr('transform', d => `translate(${y0 + origin.ySizeInner - d.ySizeInner},${x0 + origin.xSize / 2 - d.xSize})`).on('click', handleClick);
    const nodeExit = transition(node.exit());
    nodeExit.select('rect').attr('width', 0).attr('x', d => d.ySizeInner);
    nodeExit.select('foreignObject').style('opacity', 0);
    nodeExit.attr('transform', d => `translate(${origin.y + origin.ySizeInner - d.ySizeInner},${origin.x + origin.xSize / 2 - d.xSize})`).remove();
    const nodeMerge = node.merge(nodeEnter);
    transition(nodeMerge).attr('transform', d => `translate(${d.y},${d.x - d.xSize / 2})`);
    const rect = nodeMerge.selectAll(childSelector('rect')).data(d => [d], d => d.data.p.k).join(enter => {
      return enter.append('rect').attr('x', d => d.ySizeInner).attr('y', d => d.xSize - linkWidth(d) / 2).attr('width', 0).attr('height', linkWidth);
    }, update => update, exit => exit.remove());
    transition(rect).attr('x', -1).attr('width', d => d.ySizeInner + 2).attr('fill', d => options.color(d.data.p.c));
    const circle = nodeMerge.selectAll(childSelector('circle')).data(d => d.data.c ? [d] : [], d => d.data.p.k).join(enter => {
      return enter.append('circle').attr('stroke-width', '1.5').attr('cx', d => d.ySizeInner).attr('cy', d => d.xSize).attr('r', 0);
    }, update => update, exit => exit.remove());
    transition(circle).attr('r', 6).attr('stroke', d => options.color(d.data.p.c)).attr('fill', d => {
      var _d$data$p;

      return ((_d$data$p = d.data.p) == null ? void 0 : _d$data$p.f) ? options.color(d.data.p.c) : '#fff';
    });
    const foreignObject = nodeMerge.selectAll(childSelector('foreignObject')).data(d => [d], d => d.data.p.k).join(enter => {
      const fo = enter.append('foreignObject').attr('class', `${state.id}-fo`).attr('x', options.paddingX).attr('y', 0).style('opacity', 0).attr('height', d => d.xSize);
      fo.append('xhtml:div').select(function (d) {
        const node = d.data.p.el.cloneNode(true);
        this.replaceWith(node);
        return node;
      }).attr('xmlns', 'http://www.w3.org/1999/xhtml');
      return fo;
    }, update => update, exit => exit.remove()).attr('width', d => Math.max(0, d.ySizeInner - options.paddingX * 2));
    transition(foreignObject).style('opacity', 1); // Update the links

    const path = g.selectAll(childSelector('path')).data(links, d => d.target.data.p.k).join(enter => {
      const source = [y0 + origin.ySizeInner, x0 + origin.xSize / 2];
      return enter.insert('path', 'g').attr('d', linkShape({
        source,
        target: source
      }));
    }, update => update, exit => {
      const source = [origin.y + origin.ySizeInner, origin.x + origin.xSize / 2];
      return transition(exit).attr('d', linkShape({
        source,
        target: source
      })).remove();
    });
    transition(path).attr('stroke', d => options.color(d.target.data.p.c)).attr('stroke-width', d => linkWidth(d.target)).attr('d', d => {
      const source = [d.source.y + d.source.ySizeInner, d.source.x + d.source.xSize / 2];
      const target = [d.target.y, d.target.x + d.target.xSize / 2];
      return linkShape({
        source,
        target
      });
    });
    descendants.forEach(d => {
      d.data.x0 = d.x;
      d.data.y0 = d.y;
    });
  }
}

async function loadPlugins(items, options) {
  items = items.map(item => {
    if (typeof item === 'string') {
      const name = item;
      item = plugins[name];

      if (!item) {
        console.warn(`[markmap] Unknown plugin: ${name}`);
      }
    }

    return item;
  }).filter(Boolean);
  markmap.processors = [...markmap.processors, ...(await (0, _util.initializePlugins)(items, options))];
}
},{"./plugins":527,"./util":532,"@babel/runtime/helpers/interopRequireWildcard":1,"d3":526,"d3-flextree":105}],535:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var textarea;

function decodeEntity(name) {
  textarea = textarea || document.createElement('textarea');
  textarea.innerHTML = '&' + name;
  return textarea.value;
}
/**
 * Utility functions
 */


function typeOf(obj) {
  return Object.prototype.toString.call(obj);
}

function isString(obj) {
  return typeOf(obj) === '[object String]';
}

var hasOwn = Object.prototype.hasOwnProperty;

function has(object, key) {
  return object ? hasOwn.call(object, key) : false;
} // Extend objects
//


function assign(obj
/*from1, from2, from3, ...*/
) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    if (!source) {
      return;
    }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be object');
    }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });
  return obj;
} ////////////////////////////////////////////////////////////////////////////////


var UNESCAPE_MD_RE = /\\([\\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) {
    return str;
  }

  return str.replace(UNESCAPE_MD_RE, '$1');
} ////////////////////////////////////////////////////////////////////////////////


function isValidEntityCode(c) {
  /*eslint no-bitwise:0*/
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) {
    return false;
  } // never used


  if (c >= 0xFDD0 && c <= 0xFDEF) {
    return false;
  }

  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) {
    return false;
  } // control codes


  if (c >= 0x00 && c <= 0x08) {
    return false;
  }

  if (c === 0x0B) {
    return false;
  }

  if (c >= 0x0E && c <= 0x1F) {
    return false;
  }

  if (c >= 0x7F && c <= 0x9F) {
    return false;
  } // out of range


  if (c > 0x10FFFF) {
    return false;
  }

  return true;
}

function fromCodePoint(c) {
  /*eslint no-bitwise:0*/
  if (c > 0xffff) {
    c -= 0x10000;
    var surrogate1 = 0xd800 + (c >> 10),
        surrogate2 = 0xdc00 + (c & 0x3ff);
    return String.fromCharCode(surrogate1, surrogate2);
  }

  return String.fromCharCode(c);
}

var NAMED_ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

function replaceEntityPattern(match, name) {
  var code = 0;
  var decoded = decodeEntity(name);

  if (name !== decoded) {
    return decoded;
  } else if (name.charCodeAt(0) === 0x23
  /* # */
  && DIGITAL_ENTITY_TEST_RE.test(name)) {
    code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }
  }

  return match;
}

function replaceEntities(str) {
  if (str.indexOf('&') < 0) {
    return str;
  }

  return str.replace(NAMED_ENTITY_RE, replaceEntityPattern);
} ////////////////////////////////////////////////////////////////////////////////


var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }

  return str;
}

var utils = /*#__PURE__*/Object.freeze({
  isString: isString,
  has: has,
  assign: assign,
  unescapeMd: unescapeMd,
  isValidEntityCode: isValidEntityCode,
  fromCodePoint: fromCodePoint,
  replaceEntities: replaceEntities,
  escapeHtml: escapeHtml
});
/**
 * Renderer rules cache
 */

var rules = {};
/**
 * Blockquotes
 */

rules.blockquote_open = function ()
/* tokens, idx, options, env */
{
  return '<blockquote>\n';
};

rules.blockquote_close = function (tokens, idx
/*, options, env */
) {
  return '</blockquote>' + getBreak(tokens, idx);
};
/**
 * Code
 */


rules.code = function (tokens, idx
/*, options, env */
) {
  if (tokens[idx].block) {
    return '<pre><code>' + escapeHtml(tokens[idx].content) + '</code></pre>' + getBreak(tokens, idx);
  }

  return '<code>' + escapeHtml(tokens[idx].content) + '</code>';
};
/**
 * Fenced code blocks
 */


rules.fence = function (tokens, idx, options, env, instance) {
  var token = tokens[idx];
  var langClass = '';
  var langPrefix = options.langPrefix;
  var langName = '',
      fences,
      fenceName;
  var highlighted;

  if (token.params) {
    //
    // ```foo bar
    //
    // Try custom renderer "foo" first. That will simplify overwrite
    // for diagrams, latex, and any other fenced block with custom look
    //
    fences = token.params.split(/\s+/g);
    fenceName = fences.join(' ');

    if (has(instance.rules.fence_custom, fences[0])) {
      return instance.rules.fence_custom[fences[0]](tokens, idx, options, env, instance);
    }

    langName = escapeHtml(replaceEntities(unescapeMd(fenceName)));
    langClass = ' class="' + langPrefix + langName + '"';
  }

  if (options.highlight) {
    highlighted = options.highlight.apply(options.highlight, [token.content].concat(fences)) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  return '<pre><code' + langClass + '>' + highlighted + '</code></pre>' + getBreak(tokens, idx);
};

rules.fence_custom = {};
/**
 * Headings
 */

rules.heading_open = function (tokens, idx
/*, options, env */
) {
  return '<h' + tokens[idx].hLevel + '>';
};

rules.heading_close = function (tokens, idx
/*, options, env */
) {
  return '</h' + tokens[idx].hLevel + '>\n';
};
/**
 * Horizontal rules
 */


rules.hr = function (tokens, idx, options
/*, env */
) {
  return (options.xhtmlOut ? '<hr />' : '<hr>') + getBreak(tokens, idx);
};
/**
 * Bullets
 */


rules.bullet_list_open = function ()
/* tokens, idx, options, env */
{
  return '<ul>\n';
};

rules.bullet_list_close = function (tokens, idx
/*, options, env */
) {
  return '</ul>' + getBreak(tokens, idx);
};
/**
 * List items
 */


rules.list_item_open = function ()
/* tokens, idx, options, env */
{
  return '<li>';
};

rules.list_item_close = function ()
/* tokens, idx, options, env */
{
  return '</li>\n';
};
/**
 * Ordered list items
 */


rules.ordered_list_open = function (tokens, idx
/*, options, env */
) {
  var token = tokens[idx];
  var order = token.order > 1 ? ' start="' + token.order + '"' : '';
  return '<ol' + order + '>\n';
};

rules.ordered_list_close = function (tokens, idx
/*, options, env */
) {
  return '</ol>' + getBreak(tokens, idx);
};
/**
 * Paragraphs
 */


rules.paragraph_open = function (tokens, idx
/*, options, env */
) {
  return tokens[idx].tight ? '' : '<p>';
};

rules.paragraph_close = function (tokens, idx
/*, options, env */
) {
  var addBreak = !(tokens[idx].tight && idx && tokens[idx - 1].type === 'inline' && !tokens[idx - 1].content);
  return (tokens[idx].tight ? '' : '</p>') + (addBreak ? getBreak(tokens, idx) : '');
};
/**
 * Links
 */


rules.link_open = function (tokens, idx, options
/* env */
) {
  var title = tokens[idx].title ? ' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"' : '';
  var target = options.linkTarget ? ' target="' + options.linkTarget + '"' : '';
  return '<a href="' + escapeHtml(tokens[idx].href) + '"' + title + target + '>';
};

rules.link_close = function ()
/* tokens, idx, options, env */
{
  return '</a>';
};
/**
 * Images
 */


rules.image = function (tokens, idx, options
/*, env */
) {
  var src = ' src="' + escapeHtml(tokens[idx].src) + '"';
  var title = tokens[idx].title ? ' title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '"' : '';
  var alt = ' alt="' + (tokens[idx].alt ? escapeHtml(replaceEntities(unescapeMd(tokens[idx].alt))) : '') + '"';
  var suffix = options.xhtmlOut ? ' /' : '';
  return '<img' + src + alt + title + suffix + '>';
};
/**
 * Tables
 */


rules.table_open = function ()
/* tokens, idx, options, env */
{
  return '<table>\n';
};

rules.table_close = function ()
/* tokens, idx, options, env */
{
  return '</table>\n';
};

rules.thead_open = function ()
/* tokens, idx, options, env */
{
  return '<thead>\n';
};

rules.thead_close = function ()
/* tokens, idx, options, env */
{
  return '</thead>\n';
};

rules.tbody_open = function ()
/* tokens, idx, options, env */
{
  return '<tbody>\n';
};

rules.tbody_close = function ()
/* tokens, idx, options, env */
{
  return '</tbody>\n';
};

rules.tr_open = function ()
/* tokens, idx, options, env */
{
  return '<tr>';
};

rules.tr_close = function ()
/* tokens, idx, options, env */
{
  return '</tr>\n';
};

rules.th_open = function (tokens, idx
/*, options, env */
) {
  var token = tokens[idx];
  return '<th' + (token.align ? ' style="text-align:' + token.align + '"' : '') + '>';
};

rules.th_close = function ()
/* tokens, idx, options, env */
{
  return '</th>';
};

rules.td_open = function (tokens, idx
/*, options, env */
) {
  var token = tokens[idx];
  return '<td' + (token.align ? ' style="text-align:' + token.align + '"' : '') + '>';
};

rules.td_close = function ()
/* tokens, idx, options, env */
{
  return '</td>';
};
/**
 * Bold
 */


rules.strong_open = function ()
/* tokens, idx, options, env */
{
  return '<strong>';
};

rules.strong_close = function ()
/* tokens, idx, options, env */
{
  return '</strong>';
};
/**
 * Italicize
 */


rules.em_open = function ()
/* tokens, idx, options, env */
{
  return '<em>';
};

rules.em_close = function ()
/* tokens, idx, options, env */
{
  return '</em>';
};
/**
 * Strikethrough
 */


rules.del_open = function ()
/* tokens, idx, options, env */
{
  return '<del>';
};

rules.del_close = function ()
/* tokens, idx, options, env */
{
  return '</del>';
};
/**
 * Insert
 */


rules.ins_open = function ()
/* tokens, idx, options, env */
{
  return '<ins>';
};

rules.ins_close = function ()
/* tokens, idx, options, env */
{
  return '</ins>';
};
/**
 * Highlight
 */


rules.mark_open = function ()
/* tokens, idx, options, env */
{
  return '<mark>';
};

rules.mark_close = function ()
/* tokens, idx, options, env */
{
  return '</mark>';
};
/**
 * Super- and sub-script
 */


rules.sub = function (tokens, idx
/*, options, env */
) {
  return '<sub>' + escapeHtml(tokens[idx].content) + '</sub>';
};

rules.sup = function (tokens, idx
/*, options, env */
) {
  return '<sup>' + escapeHtml(tokens[idx].content) + '</sup>';
};
/**
 * Breaks
 */


rules.hardbreak = function (tokens, idx, options
/*, env */
) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};

rules.softbreak = function (tokens, idx, options
/*, env */
) {
  return options.breaks ? options.xhtmlOut ? '<br />\n' : '<br>\n' : '\n';
};
/**
 * Text
 */


rules.text = function (tokens, idx
/*, options, env */
) {
  return escapeHtml(tokens[idx].content);
};
/**
 * Content
 */


rules.htmlblock = function (tokens, idx
/*, options, env */
) {
  return tokens[idx].content;
};

rules.htmltag = function (tokens, idx
/*, options, env */
) {
  return tokens[idx].content;
};
/**
 * Abbreviations, initialism
 */


rules.abbr_open = function (tokens, idx
/*, options, env */
) {
  return '<abbr title="' + escapeHtml(replaceEntities(tokens[idx].title)) + '">';
};

rules.abbr_close = function ()
/* tokens, idx, options, env */
{
  return '</abbr>';
};
/**
 * Footnotes
 */


rules.footnote_ref = function (tokens, idx) {
  var n = Number(tokens[idx].id + 1).toString();
  var id = 'fnref' + n;

  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }

  return '<sup class="footnote-ref"><a href="#fn' + n + '" id="' + id + '">[' + n + ']</a></sup>';
};

rules.footnote_block_open = function (tokens, idx, options) {
  var hr = options.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n';
  return hr + '<section class="footnotes">\n<ol class="footnotes-list">\n';
};

rules.footnote_block_close = function () {
  return '</ol>\n</section>\n';
};

rules.footnote_open = function (tokens, idx) {
  var id = Number(tokens[idx].id + 1).toString();
  return '<li id="fn' + id + '"  class="footnote-item">';
};

rules.footnote_close = function () {
  return '</li>\n';
};

rules.footnote_anchor = function (tokens, idx) {
  var n = Number(tokens[idx].id + 1).toString();
  var id = 'fnref' + n;

  if (tokens[idx].subId > 0) {
    id += ':' + tokens[idx].subId;
  }

  return ' <a href="#' + id + '" class="footnote-backref">↩</a>';
};
/**
 * Definition lists
 */


rules.dl_open = function () {
  return '<dl>\n';
};

rules.dt_open = function () {
  return '<dt>';
};

rules.dd_open = function () {
  return '<dd>';
};

rules.dl_close = function () {
  return '</dl>\n';
};

rules.dt_close = function () {
  return '</dt>\n';
};

rules.dd_close = function () {
  return '</dd>\n';
};
/**
 * Helper functions
 */


function nextToken(tokens, idx) {
  if (++idx >= tokens.length - 2) {
    return idx;
  }

  if (tokens[idx].type === 'paragraph_open' && tokens[idx].tight && tokens[idx + 1].type === 'inline' && tokens[idx + 1].content.length === 0 && tokens[idx + 2].type === 'paragraph_close' && tokens[idx + 2].tight) {
    return nextToken(tokens, idx + 2);
  }

  return idx;
}
/**
 * Check to see if `\n` is needed before the next token.
 *
 * @param  {Array} `tokens`
 * @param  {Number} `idx`
 * @return {String} Empty string or newline
 * @api private
 */


var getBreak = rules.getBreak = function getBreak(tokens, idx) {
  idx = nextToken(tokens, idx);

  if (idx < tokens.length && tokens[idx].type === 'list_item_close') {
    return '';
  }

  return '\n';
};
/**
 * Renderer class. Renders HTML and exposes `rules` to allow
 * local modifications.
 */


function Renderer() {
  this.rules = assign({}, rules); // exported helper, for custom rules only

  this.getBreak = rules.getBreak;
}
/**
 * Render a string of inline HTML with the given `tokens` and
 * `options`.
 *
 * @param  {Array} `tokens`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @return {String}
 * @api public
 */


Renderer.prototype.renderInline = function (tokens, options, env) {
  var _rules = this.rules;
  var len = tokens.length,
      i = 0;
  var result = '';

  while (len--) {
    result += _rules[tokens[i].type](tokens, i++, options, env, this);
  }

  return result;
};
/**
 * Render a string of HTML with the given `tokens` and
 * `options`.
 *
 * @param  {Array} `tokens`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @return {String}
 * @api public
 */


Renderer.prototype.render = function (tokens, options, env) {
  var _rules = this.rules;
  var len = tokens.length,
      i = -1;
  var result = '';

  while (++i < len) {
    if (tokens[i].type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else {
      result += _rules[tokens[i].type](tokens, i, options, env, this);
    }
  }

  return result;
};
/**
 * Ruler is a helper class for building responsibility chains from
 * parse rules. It allows:
 *
 *   - easy stack rules chains
 *   - getting main chain and named chains content (as arrays of functions)
 *
 * Helper methods, should not be used directly.
 * @api private
 */


function Ruler() {
  // List of added rules. Each element is:
  //
  // { name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ] }
  //
  this.__rules__ = []; // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - digital anchor for fast filtering by charcodes.
  //

  this.__cache__ = null;
}
/**
 * Find the index of a rule by `name`.
 *
 * @param  {String} `name`
 * @return {Number} Index of the given `name`
 * @api private
 */


Ruler.prototype.__find__ = function (name) {
  var len = this.__rules__.length;
  var i = -1;

  while (len--) {
    if (this.__rules__[++i].name === name) {
      return i;
    }
  }

  return -1;
};
/**
 * Build the rules lookup cache
 *
 * @api private
 */


Ruler.prototype.__compile__ = function () {
  var self = this;
  var chains = ['']; // collect unique names

  self.__rules__.forEach(function (rule) {
    if (!rule.enabled) {
      return;
    }

    rule.alt.forEach(function (altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });

  self.__cache__ = {};
  chains.forEach(function (chain) {
    self.__cache__[chain] = [];

    self.__rules__.forEach(function (rule) {
      if (!rule.enabled) {
        return;
      }

      if (chain && rule.alt.indexOf(chain) < 0) {
        return;
      }

      self.__cache__[chain].push(rule.fn);
    });
  });
};
/**
 * Ruler public methods
 * ------------------------------------------------
 */

/**
 * Replace rule function
 *
 * @param  {String} `name` Rule name
 * @param  {Function `fn`
 * @param  {Object} `options`
 * @api private
 */


Ruler.prototype.at = function (name, fn, options) {
  var idx = this.__find__(name);

  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + name);
  }

  this.__rules__[idx].fn = fn;
  this.__rules__[idx].alt = opt.alt || [];
  this.__cache__ = null;
};
/**
 * Add a rule to the chain before given the `ruleName`.
 *
 * @param  {String}   `beforeName`
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @api private
 */


Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var idx = this.__find__(beforeName);

  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + beforeName);
  }

  this.__rules__.splice(idx, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};
/**
 * Add a rule to the chain after the given `ruleName`.
 *
 * @param  {String}   `afterName`
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @api private
 */


Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var idx = this.__find__(afterName);

  var opt = options || {};

  if (idx === -1) {
    throw new Error('Parser rule not found: ' + afterName);
  }

  this.__rules__.splice(idx + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};
/**
 * Add a rule to the end of chain.
 *
 * @param  {String}   `ruleName`
 * @param  {Function} `fn`
 * @param  {Object}   `options`
 * @return {String}
 */


Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};
/**
 * Enable a rule or list of rules.
 *
 * @param  {String|Array} `list` Name or array of rule names to enable
 * @param  {Boolean} `strict` If `true`, all non listed rules will be disabled.
 * @api private
 */


Ruler.prototype.enable = function (list, strict) {
  list = !Array.isArray(list) ? [list] : list; // In strict mode disable all existing rules first

  if (strict) {
    this.__rules__.forEach(function (rule) {
      rule.enabled = false;
    });
  } // Search by name and enable


  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      throw new Error('Rules manager: invalid rule name ' + name);
    }

    this.__rules__[idx].enabled = true;
  }, this);
  this.__cache__ = null;
};
/**
 * Disable a rule or list of rules.
 *
 * @param  {String|Array} `list` Name or array of rule names to disable
 * @api private
 */


Ruler.prototype.disable = function (list) {
  list = !Array.isArray(list) ? [list] : list; // Search by name and disable

  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      throw new Error('Rules manager: invalid rule name ' + name);
    }

    this.__rules__[idx].enabled = false;
  }, this);
  this.__cache__ = null;
};
/**
 * Get a rules list as an array of functions.
 *
 * @param  {String} `chainName`
 * @return {Object}
 * @api private
 */


Ruler.prototype.getRules = function (chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }

  return this.__cache__[chainName] || [];
};

function block(state) {
  if (state.inlineMode) {
    state.tokens.push({
      type: 'inline',
      content: state.src.replace(/\n/g, ' ').trim(),
      level: 0,
      lines: [0, 1],
      children: []
    });
  } else {
    state.block.parse(state.src, state.options, state.env, state.tokens);
  }
} // Inline parser state


function StateInline(src, parserInline, options, env, outTokens) {
  this.src = src;
  this.env = env;
  this.options = options;
  this.parser = parserInline;
  this.tokens = outTokens;
  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = '';
  this.pendingLevel = 0;
  this.cache = []; // Stores { start: end } pairs. Useful for backtrack
  // optimization of pairs parse (emphasis, strikes).
  // Link parser state vars

  this.isInLabel = false; // Set true when seek link label - we should disable
  // "paired" rules (emphasis, strikes) to not skip
  // tailing `]`

  this.linkLevel = 0; // Increment for each nesting link. Used to prevent
  // nesting in definitions

  this.linkContent = ''; // Temporary storage for link url

  this.labelUnmatchedScopes = 0; // Track unpaired `[` for link labels
  // (backtrack optimization)
} // Flush pending text
//


StateInline.prototype.pushPending = function () {
  this.tokens.push({
    type: 'text',
    content: this.pending,
    level: this.pendingLevel
  });
  this.pending = '';
}; // Push new token to "stream".
// If pending text exists - flush it as text token
//


StateInline.prototype.push = function (token) {
  if (this.pending) {
    this.pushPending();
  }

  this.tokens.push(token);
  this.pendingLevel = this.level;
}; // Store value to cache.
// !!! Implementation has parser-specific optimizations
// !!! keys MUST be integer, >= 0; values MUST be integer, > 0
//


StateInline.prototype.cacheSet = function (key, val) {
  for (var i = this.cache.length; i <= key; i++) {
    this.cache.push(0);
  }

  this.cache[key] = val;
}; // Get cache value
//


StateInline.prototype.cacheGet = function (key) {
  return key < this.cache.length ? this.cache[key] : 0;
};
/**
 * Parse link labels
 *
 * This function assumes that first character (`[`) already matches;
 * returns the end of the label.
 *
 * @param  {Object} state
 * @param  {Number} start
 * @api private
 */


function parseLinkLabel(state, start) {
  var level,
      found,
      marker,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos,
      oldFlag = state.isInLabel;

  if (state.isInLabel) {
    return -1;
  }

  if (state.labelUnmatchedScopes) {
    state.labelUnmatchedScopes--;
    return -1;
  }

  state.pos = start + 1;
  state.isInLabel = true;
  level = 1;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);

    if (marker === 0x5B
    /* [ */
    ) {
        level++;
      } else if (marker === 0x5D
    /* ] */
    ) {
        level--;

        if (level === 0) {
          found = true;
          break;
        }
      }

    state.parser.skipToken(state);
  }

  if (found) {
    labelEnd = state.pos;
    state.labelUnmatchedScopes = 0;
  } else {
    state.labelUnmatchedScopes = level - 1;
  } // restore old state


  state.pos = oldPos;
  state.isInLabel = oldFlag;
  return labelEnd;
} // Parse abbreviation definitions, i.e. `*[abbr]: description`


function parseAbbr(str, parserInline, options, env) {
  var state, labelEnd, pos, max, label, title;

  if (str.charCodeAt(0) !== 0x2A
  /* * */
  ) {
      return -1;
    }

  if (str.charCodeAt(1) !== 0x5B
  /* [ */
  ) {
      return -1;
    }

  if (str.indexOf(']:') === -1) {
    return -1;
  }

  state = new StateInline(str, parserInline, options, env, []);
  labelEnd = parseLinkLabel(state, 1);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A
  /* : */
  ) {
      return -1;
    }

  max = state.posMax; // abbr title is always one line, so looking for ending "\n" here

  for (pos = labelEnd + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x0A) {
      break;
    }
  }

  label = str.slice(2, labelEnd);
  title = str.slice(labelEnd + 2, pos).trim();

  if (title.length === 0) {
    return -1;
  }

  if (!env.abbreviations) {
    env.abbreviations = {};
  } // prepend ':' to avoid conflict with Object.prototype members


  if (typeof env.abbreviations[':' + label] === 'undefined') {
    env.abbreviations[':' + label] = title;
  }

  return pos;
}

function abbr(state) {
  var tokens = state.tokens,
      i,
      l,
      content,
      pos;

  if (state.inlineMode) {
    return;
  } // Parse inlines


  for (i = 1, l = tokens.length - 1; i < l; i++) {
    if (tokens[i - 1].type === 'paragraph_open' && tokens[i].type === 'inline' && tokens[i + 1].type === 'paragraph_close') {
      content = tokens[i].content;

      while (content.length) {
        pos = parseAbbr(content, state.inline, state.options, state.env);

        if (pos < 0) {
          break;
        }

        content = content.slice(pos).trim();
      }

      tokens[i].content = content;

      if (!content.length) {
        tokens[i - 1].tight = true;
        tokens[i + 1].tight = true;
      }
    }
  }
}

function normalizeLink(url) {
  var normalized = replaceEntities(url); // We shouldn't care about the result of malformed URIs,
  // and should not throw an exception.

  try {
    normalized = decodeURI(normalized);
  } catch (err) {}

  return encodeURI(normalized);
}
/**
 * Parse link destination
 *
 *   - on success it returns a string and updates state.pos;
 *   - on failure it returns null
 *
 * @param  {Object} state
 * @param  {Number} pos
 * @api private
 */


function parseLinkDestination(state, pos) {
  var code,
      level,
      link,
      start = pos,
      max = state.posMax;

  if (state.src.charCodeAt(pos) === 0x3C
  /* < */
  ) {
      pos++;

      while (pos < max) {
        code = state.src.charCodeAt(pos);

        if (code === 0x0A
        /* \n */
        ) {
            return false;
          }

        if (code === 0x3E
        /* > */
        ) {
            link = normalizeLink(unescapeMd(state.src.slice(start + 1, pos)));

            if (!state.parser.validateLink(link)) {
              return false;
            }

            state.pos = pos + 1;
            state.linkContent = link;
            return true;
          }

        if (code === 0x5C
        /* \ */
        && pos + 1 < max) {
          pos += 2;
          continue;
        }

        pos++;
      } // no closing '>'


      return false;
    } // this should be ... } else { ... branch


  level = 0;

  while (pos < max) {
    code = state.src.charCodeAt(pos);

    if (code === 0x20) {
      break;
    } // ascii control chars


    if (code < 0x20 || code === 0x7F) {
      break;
    }

    if (code === 0x5C
    /* \ */
    && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28
    /* ( */
    ) {
        level++;

        if (level > 1) {
          break;
        }
      }

    if (code === 0x29
    /* ) */
    ) {
        level--;

        if (level < 0) {
          break;
        }
      }

    pos++;
  }

  if (start === pos) {
    return false;
  }

  link = unescapeMd(state.src.slice(start, pos));

  if (!state.parser.validateLink(link)) {
    return false;
  }

  state.linkContent = link;
  state.pos = pos;
  return true;
}
/**
 * Parse link title
 *
 *   - on success it returns a string and updates state.pos;
 *   - on failure it returns null
 *
 * @param  {Object} state
 * @param  {Number} pos
 * @api private
 */


function parseLinkTitle(state, pos) {
  var code,
      start = pos,
      max = state.posMax,
      marker = state.src.charCodeAt(pos);

  if (marker !== 0x22
  /* " */
  && marker !== 0x27
  /* ' */
  && marker !== 0x28
  /* ( */
  ) {
      return false;
    }

  pos++; // if opening marker is "(", switch it to closing marker ")"

  if (marker === 0x28) {
    marker = 0x29;
  }

  while (pos < max) {
    code = state.src.charCodeAt(pos);

    if (code === marker) {
      state.pos = pos + 1;
      state.linkContent = unescapeMd(state.src.slice(start + 1, pos));
      return true;
    }

    if (code === 0x5C
    /* \ */
    && pos + 1 < max) {
      pos += 2;
      continue;
    }

    pos++;
  }

  return false;
}

function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
}

function parseReference(str, parser, options, env) {
  var state, labelEnd, pos, max, code, start, href, title, label;

  if (str.charCodeAt(0) !== 0x5B
  /* [ */
  ) {
      return -1;
    }

  if (str.indexOf(']:') === -1) {
    return -1;
  }

  state = new StateInline(str, parser, options, env, []);
  labelEnd = parseLinkLabel(state, 0);

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A
  /* : */
  ) {
      return -1;
    }

  max = state.posMax; // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here

  for (pos = labelEnd + 2; pos < max; pos++) {
    code = state.src.charCodeAt(pos);

    if (code !== 0x20 && code !== 0x0A) {
      break;
    }
  } // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this


  if (!parseLinkDestination(state, pos)) {
    return -1;
  }

  href = state.linkContent;
  pos = state.pos; // [label]:   destination   'title'
  //                       ^^^ skipping those spaces

  start = pos;

  for (pos = pos + 1; pos < max; pos++) {
    code = state.src.charCodeAt(pos);

    if (code !== 0x20 && code !== 0x0A) {
      break;
    }
  } // [label]:   destination   'title'
  //                          ^^^^^^^ parse this


  if (pos < max && start !== pos && parseLinkTitle(state, pos)) {
    title = state.linkContent;
    pos = state.pos;
  } else {
    title = '';
    pos = start;
  } // ensure that the end of the line is empty


  while (pos < max && state.src.charCodeAt(pos) === 0x20
  /* space */
  ) {
    pos++;
  }

  if (pos < max && state.src.charCodeAt(pos) !== 0x0A) {
    return -1;
  }

  label = normalizeReference(str.slice(1, labelEnd));

  if (typeof env.references[label] === 'undefined') {
    env.references[label] = {
      title: title,
      href: href
    };
  }

  return pos;
}

function references(state) {
  var tokens = state.tokens,
      i,
      l,
      content,
      pos;
  state.env.references = state.env.references || {};

  if (state.inlineMode) {
    return;
  } // Scan definitions in paragraph inlines


  for (i = 1, l = tokens.length - 1; i < l; i++) {
    if (tokens[i].type === 'inline' && tokens[i - 1].type === 'paragraph_open' && tokens[i + 1].type === 'paragraph_close') {
      content = tokens[i].content;

      while (content.length) {
        pos = parseReference(content, state.inline, state.options, state.env);

        if (pos < 0) {
          break;
        }

        content = content.slice(pos).trim();
      }

      tokens[i].content = content;

      if (!content.length) {
        tokens[i - 1].tight = true;
        tokens[i + 1].tight = true;
      }
    }
  }
}

function inline(state) {
  var tokens = state.tokens,
      tok,
      i,
      l; // Parse inlines

  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];

    if (tok.type === 'inline') {
      state.inline.parse(tok.content, state.options, state.env, tok.children);
    }
  }
}

function footnote_block(state) {
  var i,
      l,
      j,
      t,
      lastParagraph,
      list,
      tokens,
      current,
      currentLabel,
      level = 0,
      insideRef = false,
      refTokens = {};

  if (!state.env.footnotes) {
    return;
  }

  state.tokens = state.tokens.filter(function (tok) {
    if (tok.type === 'footnote_reference_open') {
      insideRef = true;
      current = [];
      currentLabel = tok.label;
      return false;
    }

    if (tok.type === 'footnote_reference_close') {
      insideRef = false; // prepend ':' to avoid conflict with Object.prototype members

      refTokens[':' + currentLabel] = current;
      return false;
    }

    if (insideRef) {
      current.push(tok);
    }

    return !insideRef;
  });

  if (!state.env.footnotes.list) {
    return;
  }

  list = state.env.footnotes.list;
  state.tokens.push({
    type: 'footnote_block_open',
    level: level++
  });

  for (i = 0, l = list.length; i < l; i++) {
    state.tokens.push({
      type: 'footnote_open',
      id: i,
      level: level++
    });

    if (list[i].tokens) {
      tokens = [];
      tokens.push({
        type: 'paragraph_open',
        tight: false,
        level: level++
      });
      tokens.push({
        type: 'inline',
        content: '',
        level: level,
        children: list[i].tokens
      });
      tokens.push({
        type: 'paragraph_close',
        tight: false,
        level: --level
      });
    } else if (list[i].label) {
      tokens = refTokens[':' + list[i].label];
    }

    state.tokens = state.tokens.concat(tokens);

    if (state.tokens[state.tokens.length - 1].type === 'paragraph_close') {
      lastParagraph = state.tokens.pop();
    } else {
      lastParagraph = null;
    }

    t = list[i].count > 0 ? list[i].count : 1;

    for (j = 0; j < t; j++) {
      state.tokens.push({
        type: 'footnote_anchor',
        id: i,
        subId: j,
        level: level
      });
    }

    if (lastParagraph) {
      state.tokens.push(lastParagraph);
    }

    state.tokens.push({
      type: 'footnote_close',
      level: --level
    });
  }

  state.tokens.push({
    type: 'footnote_block_close',
    level: --level
  });
} // Enclose abbreviations in <abbr> tags
//


var PUNCT_CHARS = ' \n()[]\'".,!?-'; // from Google closure library
// http://closure-library.googlecode.com/git-history/docs/local_closure_goog_string_string.js.source.html#line1021

function regEscape(s) {
  return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');
}

function abbr2(state) {
  var i,
      j,
      l,
      tokens,
      token,
      text,
      nodes,
      pos,
      level,
      reg,
      m,
      regText,
      blockTokens = state.tokens;

  if (!state.env.abbreviations) {
    return;
  }

  if (!state.env.abbrRegExp) {
    regText = '(^|[' + PUNCT_CHARS.split('').map(regEscape).join('') + '])' + '(' + Object.keys(state.env.abbreviations).map(function (x) {
      return x.substr(1);
    }).sort(function (a, b) {
      return b.length - a.length;
    }).map(regEscape).join('|') + ')' + '($|[' + PUNCT_CHARS.split('').map(regEscape).join('') + '])';
    state.env.abbrRegExp = new RegExp(regText, 'g');
  }

  reg = state.env.abbrRegExp;

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline') {
      continue;
    }

    tokens = blockTokens[j].children; // We scan from the end, to keep position when new tags added.

    for (i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];

      if (token.type !== 'text') {
        continue;
      }

      pos = 0;
      text = token.content;
      reg.lastIndex = 0;
      level = token.level;
      nodes = [];

      while (m = reg.exec(text)) {
        if (reg.lastIndex > pos) {
          nodes.push({
            type: 'text',
            content: text.slice(pos, m.index + m[1].length),
            level: level
          });
        }

        nodes.push({
          type: 'abbr_open',
          title: state.env.abbreviations[':' + m[2]],
          level: level++
        });
        nodes.push({
          type: 'text',
          content: m[2],
          level: level
        });
        nodes.push({
          type: 'abbr_close',
          level: --level
        });
        pos = reg.lastIndex - m[3].length;
      }

      if (!nodes.length) {
        continue;
      }

      if (pos < text.length) {
        nodes.push({
          type: 'text',
          content: text.slice(pos),
          level: level
        });
      } // replace current node


      blockTokens[j].children = tokens = [].concat(tokens.slice(0, i), nodes, tokens.slice(i + 1));
    }
  }
} // Simple typographical replacements
//
// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4


var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  'c': '©',
  'r': '®',
  'p': '§',
  'tm': '™'
};

function replaceScopedAbbr(str) {
  if (str.indexOf('(') < 0) {
    return str;
  }

  return str.replace(SCOPED_ABBR_RE, function (match, name) {
    return SCOPED_ABBR[name.toLowerCase()];
  });
}

function replace(state) {
  var i, token, text, inlineTokens, blkIdx;

  if (!state.options.typographer) {
    return;
  }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== 'inline') {
      continue;
    }

    inlineTokens = state.tokens[blkIdx].children;

    for (i = inlineTokens.length - 1; i >= 0; i--) {
      token = inlineTokens[i];

      if (token.type === 'text') {
        text = token.content;
        text = replaceScopedAbbr(text);

        if (RARE_RE.test(text)) {
          text = text.replace(/\+-/g, '±') // .., ..., ....... -> …
          // but ?..... & !..... -> ?.. & !..
          .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..').replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',') // em-dash
          .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2') // en-dash
          .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2').replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
        }

        token.content = text;
      }
    }
  }
} // Convert straight quotation marks to typographic ones
//


var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var PUNCT_RE = /[-\s()\[\]]/;
var APOSTROPHE = '’'; // This function returns true if the character at `pos`
// could be inside a word.

function isLetter(str, pos) {
  if (pos < 0 || pos >= str.length) {
    return false;
  }

  return !PUNCT_RE.test(str[pos]);
}

function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}

function smartquotes(state) {
  /*eslint max-depth:0*/
  var i, token, text, t, pos, max, thisLevel, lastSpace, nextSpace, item, canOpen, canClose, j, isSingle, blkIdx, tokens, stack;

  if (!state.options.typographer) {
    return;
  }

  stack = [];

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
    if (state.tokens[blkIdx].type !== 'inline') {
      continue;
    }

    tokens = state.tokens[blkIdx].children;
    stack.length = 0;

    for (i = 0; i < tokens.length; i++) {
      token = tokens[i];

      if (token.type !== 'text' || QUOTE_TEST_RE.test(token.text)) {
        continue;
      }

      thisLevel = tokens[i].level;

      for (j = stack.length - 1; j >= 0; j--) {
        if (stack[j].level <= thisLevel) {
          break;
        }
      }

      stack.length = j + 1;
      text = token.content;
      pos = 0;
      max = text.length;
      /*eslint no-labels:0,block-scoped-var:0*/

      OUTER: while (pos < max) {
        QUOTE_RE.lastIndex = pos;
        t = QUOTE_RE.exec(text);

        if (!t) {
          break;
        }

        lastSpace = !isLetter(text, t.index - 1);
        pos = t.index + 1;
        isSingle = t[0] === "'";
        nextSpace = !isLetter(text, pos);

        if (!nextSpace && !lastSpace) {
          // middle of word
          if (isSingle) {
            token.content = replaceAt(token.content, t.index, APOSTROPHE);
          }

          continue;
        }

        canOpen = !nextSpace;
        canClose = !lastSpace;

        if (canClose) {
          // this could be a closing quote, rewind the stack to get a match
          for (j = stack.length - 1; j >= 0; j--) {
            item = stack[j];

            if (stack[j].level < thisLevel) {
              break;
            }

            if (item.single === isSingle && stack[j].level === thisLevel) {
              item = stack[j];

              if (isSingle) {
                tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, state.options.quotes[2]);
                token.content = replaceAt(token.content, t.index, state.options.quotes[3]);
              } else {
                tokens[item.token].content = replaceAt(tokens[item.token].content, item.pos, state.options.quotes[0]);
                token.content = replaceAt(token.content, t.index, state.options.quotes[1]);
              }

              stack.length = j;
              continue OUTER;
            }
          }
        }

        if (canOpen) {
          stack.push({
            token: i,
            pos: t.index,
            single: isSingle,
            level: thisLevel
          });
        } else if (canClose && isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
      }
    }
  }
}
/**
 * Core parser `rules`
 */


var _rules = [['block', block], ['abbr', abbr], ['references', references], ['inline', inline], ['footnote_tail', footnote_block], ['abbr2', abbr2], ['replacements', replace], ['smartquotes', smartquotes]];
/**
 * Class for top level (`core`) parser rules
 *
 * @api private
 */

function Core() {
  this.options = {};
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}
/**
 * Process rules with the given `state`
 *
 * @param  {Object} `state`
 * @api private
 */


Core.prototype.process = function (state) {
  var i, l, rules;
  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
}; // Parser state class


function StateBlock(src, parser, options, env, tokens) {
  var ch, s, start, pos, len, indent, indent_found;
  this.src = src; // Shortcuts to simplify nested calls

  this.parser = parser;
  this.options = options;
  this.env = env; //
  // Internal state vartiables
  //

  this.tokens = tokens;
  this.bMarks = []; // line begin offsets for fast jumps

  this.eMarks = []; // line end offsets for fast jumps

  this.tShift = []; // indent for each line
  // block parser variables

  this.blkIndent = 0; // required block content indent
  // (for example, if we are in list)

  this.line = 0; // line index in src

  this.lineMax = 0; // lines count

  this.tight = false; // loose/tight mode for lists

  this.parentType = 'root'; // if `list`, block parser stops on two newlines

  this.ddIndent = -1; // indent of the current dd block (-1 if there isn't any)

  this.level = 0; // renderer

  this.result = ''; // Create caches
  // Generate markers.

  s = this.src;
  indent = 0;
  indent_found = false;

  for (start = pos = indent = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (ch === 0x20
      /* space */
      ) {
          indent++;
          continue;
        } else {
        indent_found = true;
      }
    }

    if (ch === 0x0A || pos === len - 1) {
      if (ch !== 0x0A) {
        pos++;
      }

      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      indent_found = false;
      indent = 0;
      start = pos + 1;
    }
  } // Push fake entry to simplify cache bounds checks


  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);
  this.lineMax = this.bMarks.length - 1; // don't count last fake line
}

StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }

  return from;
}; // Skip spaces from given position.


StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== 0x20
    /* space */
    ) {
        break;
      }
  }

  return pos;
}; // Skip char codes from given position


StateBlock.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) {
      break;
    }
  }

  return pos;
}; // Skip char codes reverse from given position - 1


StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) {
    return pos;
  }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) {
      return pos + 1;
    }
  }

  return pos;
}; // cut lines range from source.


StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i,
      first,
      last,
      queue,
      shift,
      line = begin;

  if (begin >= end) {
    return '';
  } // Opt: don't use push queue for single line;


  if (line + 1 === end) {
    first = this.bMarks[line] + Math.min(this.tShift[line], indent);
    last = keepLastLF ? this.eMarks[line] + 1 : this.eMarks[line];
    return this.src.slice(first, last);
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    shift = this.tShift[line];

    if (shift > indent) {
      shift = indent;
    }

    if (shift < 0) {
      shift = 0;
    }

    first = this.bMarks[line] + shift;

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    queue[i] = this.src.slice(first, last);
  }

  return queue.join('');
}; // Code block (4 spaces padded)


function code(state, startLine, endLine
/*, silent*/
) {
  var nextLine, last;

  if (state.tShift[startLine] - state.blkIndent < 4) {
    return false;
  }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }

    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }

    break;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'code',
    content: state.getLines(startLine, last, 4 + state.blkIndent, true),
    block: true,
    lines: [startLine, state.line],
    level: state.level
  });
  return true;
} // fences (``` lang, ~~~ lang)


function fences(state, startLine, endLine, silent) {
  var marker,
      len,
      params,
      nextLine,
      mem,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 3 > max) {
    return false;
  }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E
  /* ~ */
  && marker !== 0x60
  /* ` */
  ) {
      return false;
    } // scan marker length


  mem = pos;
  pos = state.skipChars(pos, marker);
  len = pos - mem;

  if (len < 3) {
    return false;
  }

  params = state.src.slice(pos, max).trim();

  if (params.indexOf('`') >= 0) {
    return false;
  } // Since start is found, we can report success here in validation mode


  if (silent) {
    return true;
  } // search end of block


  nextLine = startLine;

  for (;;) {
    nextLine++;

    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.tShift[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) {
      continue;
    }

    if (state.tShift[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker); // closing code fence must be at least as long as the opening one

    if (pos - mem < len) {
      continue;
    } // make sure tail has spaces only


    pos = state.skipSpaces(pos);

    if (pos < max) {
      continue;
    }

    haveEndMarker = true; // found!

    break;
  } // If a fence has heading spaces, they should be removed from its inner block


  len = state.tShift[startLine];
  state.line = nextLine + (haveEndMarker ? 1 : 0);
  state.tokens.push({
    type: 'fence',
    params: params,
    content: state.getLines(startLine + 1, nextLine, len, true),
    lines: [startLine, state.line],
    level: state.level
  });
  return true;
} // Block quotes


function blockquote(state, startLine, endLine, silent) {
  var nextLine,
      lastLineEmpty,
      oldTShift,
      oldBMarks,
      oldIndent,
      oldParentType,
      lines,
      terminatorRules,
      i,
      l,
      terminate,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos > max) {
    return false;
  } // check the block quote marker


  if (state.src.charCodeAt(pos++) !== 0x3E
  /* > */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  } // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode


  if (silent) {
    return true;
  } // skip one optional space after '>'


  if (state.src.charCodeAt(pos) === 0x20) {
    pos++;
  }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;
  oldBMarks = [state.bMarks[startLine]];
  state.bMarks[startLine] = pos; // check if we have an empty blockquote

  pos = pos < max ? state.skipSpaces(pos) : pos;
  lastLineEmpty = pos >= max;
  oldTShift = [state.tShift[startLine]];
  state.tShift[startLine] = pos - state.bMarks[startLine];
  terminatorRules = state.parser.ruler.getRules('blockquote'); // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag
  //     ```
  //     > test
  //      - - -
  //     ```

  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E
    /* > */
    ) {
        // This line is inside the blockquote.
        // skip one optional space after '>'
        if (state.src.charCodeAt(pos) === 0x20) {
          pos++;
        }

        oldBMarks.push(state.bMarks[nextLine]);
        state.bMarks[nextLine] = pos;
        pos = pos < max ? state.skipSpaces(pos) : pos;
        lastLineEmpty = pos >= max;
        oldTShift.push(state.tShift[nextLine]);
        state.tShift[nextLine] = pos - state.bMarks[nextLine];
        continue;
      } // Case 2: line is not inside the blockquote, and the last line was empty.


    if (lastLineEmpty) {
      break;
    } // Case 3: another tag found.


    terminate = false;

    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      break;
    }

    oldBMarks.push(state.bMarks[nextLine]);
    oldTShift.push(state.tShift[nextLine]); // A negative number means that this is a paragraph continuation;
    //
    // Any negative number will do the job here, but it's better for it
    // to be large enough to make any bugs obvious.

    state.tShift[nextLine] = -1337;
  }

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  state.tokens.push({
    type: 'blockquote_open',
    lines: lines = [startLine, 0],
    level: state.level++
  });
  state.parser.tokenize(state, startLine, nextLine);
  state.tokens.push({
    type: 'blockquote_close',
    level: --state.level
  });
  state.parentType = oldParentType;
  lines[1] = state.line; // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.

  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
  }

  state.blkIndent = oldIndent;
  return true;
} // Horizontal rule


function hr(state, startLine, endLine, silent) {
  var marker,
      cnt,
      ch,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine];
  pos += state.tShift[startLine];

  if (pos > max) {
    return false;
  }

  marker = state.src.charCodeAt(pos++); // Check hr marker

  if (marker !== 0x2A
  /* * */
  && marker !== 0x2D
  /* - */
  && marker !== 0x5F
  /* _ */
  ) {
      return false;
    } // markers can be mixed with spaces, but there should be at least 3 one


  cnt = 1;

  while (pos < max) {
    ch = state.src.charCodeAt(pos++);

    if (ch !== marker && ch !== 0x20
    /* space */
    ) {
        return false;
      }

    if (ch === marker) {
      cnt++;
    }
  }

  if (cnt < 3) {
    return false;
  }

  if (silent) {
    return true;
  }

  state.line = startLine + 1;
  state.tokens.push({
    type: 'hr',
    lines: [startLine, state.line],
    level: state.level
  });
  return true;
} // Lists
// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.


function skipBulletListMarker(state, startLine) {
  var marker, pos, max;
  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  if (pos >= max) {
    return -1;
  }

  marker = state.src.charCodeAt(pos++); // Check bullet

  if (marker !== 0x2A
  /* * */
  && marker !== 0x2D
  /* - */
  && marker !== 0x2B
  /* + */
  ) {
      return -1;
    }

  if (pos < max && state.src.charCodeAt(pos) !== 0x20) {
    // " 1.test " - is not a list item
    return -1;
  }

  return pos;
} // Search `\d+[.)][\n ]`, returns next pos arter marker on success
// or -1 on fail.


function skipOrderedListMarker(state, startLine) {
  var ch,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos + 1 >= max) {
    return -1;
  }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30
  /* 0 */
  || ch > 0x39
  /* 9 */
  ) {
      return -1;
    }

  for (;;) {
    // EOL -> fail
    if (pos >= max) {
      return -1;
    }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30
    /* 0 */
    && ch <= 0x39
    /* 9 */
    ) {
        continue;
      } // found valid marker


    if (ch === 0x29
    /* ) */
    || ch === 0x2e
    /* . */
    ) {
        break;
      }

    return -1;
  }

  if (pos < max && state.src.charCodeAt(pos) !== 0x20
  /* space */
  ) {
      // " 1.test " - is not a list item
      return -1;
    }

  return pos;
}

function markTightParagraphs(state, idx) {
  var i,
      l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].tight = true;
      state.tokens[i].tight = true;
      i += 2;
    }
  }
}

function list(state, startLine, endLine, silent) {
  var nextLine,
      indent,
      oldTShift,
      oldIndent,
      oldTight,
      oldParentType,
      start,
      posAfterMarker,
      max,
      indentAfterMarker,
      markerValue,
      markerCharCode,
      isOrdered,
      contentStart,
      listTokIdx,
      prevEmptyEnd,
      listLines,
      itemLines,
      tight = true,
      terminatorRules,
      i,
      l,
      terminate; // Detect list type and position after marker

  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;
  } else {
    return false;
  }

  if (state.level >= state.options.maxNesting) {
    return false;
  } // We should terminate list on style change. Remember first one to compare.


  markerCharCode = state.src.charCodeAt(posAfterMarker - 1); // For validation mode we can terminate immediately

  if (silent) {
    return true;
  } // Start list


  listTokIdx = state.tokens.length;

  if (isOrdered) {
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));
    state.tokens.push({
      type: 'ordered_list_open',
      order: markerValue,
      lines: listLines = [startLine, 0],
      level: state.level++
    });
  } else {
    state.tokens.push({
      type: 'bullet_list_open',
      lines: listLines = [startLine, 0],
      level: state.level++
    });
  } //
  // Iterate list items
  //


  nextLine = startLine;
  prevEmptyEnd = false;
  terminatorRules = state.parser.ruler.getRules('list');

  while (nextLine < endLine) {
    contentStart = state.skipSpaces(posAfterMarker);
    max = state.eMarks[nextLine];

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = contentStart - posAfterMarker;
    } // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)


    if (indentAfterMarker > 4) {
      indentAfterMarker = 1;
    } // If indent is less than 1, assume that it's one, example:
    //  "-\n  test"


    if (indentAfterMarker < 1) {
      indentAfterMarker = 1;
    } // "  -  test"
    //  ^^^^^ - calculating total length of this thing


    indent = posAfterMarker - state.bMarks[nextLine] + indentAfterMarker; // Run subparser & write tokens

    state.tokens.push({
      type: 'list_item_open',
      lines: itemLines = [startLine, 0],
      level: state.level++
    });
    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldParentType = state.parentType;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.parentType = 'list';
    state.parser.tokenize(state, startLine, endLine, true); // If any of list item is tight, mark list as tight

    if (!state.tight || prevEmptyEnd) {
      tight = false;
    } // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish


    prevEmptyEnd = state.line - startLine > 1 && state.isEmpty(state.line - 1);
    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.tight = oldTight;
    state.parentType = oldParentType;
    state.tokens.push({
      type: 'list_item_close',
      level: --state.level
    });
    nextLine = startLine = state.line;
    itemLines[1] = nextLine;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) {
      break;
    }

    if (state.isEmpty(nextLine)) {
      break;
    } //
    // Try to check if list is terminated or continued.
    //


    if (state.tShift[nextLine] < state.blkIndent) {
      break;
    } // fail if terminating block found


    terminate = false;

    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      break;
    } // fail if list has another type


    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);

      if (posAfterMarker < 0) {
        break;
      }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);

      if (posAfterMarker < 0) {
        break;
      }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
      break;
    }
  } // Finilize list


  state.tokens.push({
    type: isOrdered ? 'ordered_list_close' : 'bullet_list_close',
    level: --state.level
  });
  listLines[1] = nextLine;
  state.line = nextLine; // mark paragraphs tight if needed

  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
} // Process footnote reference list


function footnote(state, startLine, endLine, silent) {
  var oldBMark,
      oldTShift,
      oldParentType,
      pos,
      label,
      start = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine]; // line should be at least 5 chars - "[^x]:"

  if (start + 4 > max) {
    return false;
  }

  if (state.src.charCodeAt(start) !== 0x5B
  /* [ */
  ) {
      return false;
    }

  if (state.src.charCodeAt(start + 1) !== 0x5E
  /* ^ */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) {
      return false;
    }

    if (state.src.charCodeAt(pos) === 0x5D
    /* ] */
    ) {
        break;
      }
  }

  if (pos === start + 2) {
    return false;
  } // no empty footnote labels


  if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A
  /* : */
  ) {
      return false;
    }

  if (silent) {
    return true;
  }

  pos++;

  if (!state.env.footnotes) {
    state.env.footnotes = {};
  }

  if (!state.env.footnotes.refs) {
    state.env.footnotes.refs = {};
  }

  label = state.src.slice(start + 2, pos - 2);
  state.env.footnotes.refs[':' + label] = -1;
  state.tokens.push({
    type: 'footnote_reference_open',
    label: label,
    level: state.level++
  });
  oldBMark = state.bMarks[startLine];
  oldTShift = state.tShift[startLine];
  oldParentType = state.parentType;
  state.tShift[startLine] = state.skipSpaces(pos) - pos;
  state.bMarks[startLine] = pos;
  state.blkIndent += 4;
  state.parentType = 'footnote';

  if (state.tShift[startLine] < state.blkIndent) {
    state.tShift[startLine] += state.blkIndent;
    state.bMarks[startLine] -= state.blkIndent;
  }

  state.parser.tokenize(state, startLine, endLine, true);
  state.parentType = oldParentType;
  state.blkIndent -= 4;
  state.tShift[startLine] = oldTShift;
  state.bMarks[startLine] = oldBMark;
  state.tokens.push({
    type: 'footnote_reference_close',
    level: --state.level
  });
  return true;
} // heading (#, ##, ...)


function heading(state, startLine, endLine, silent) {
  var ch,
      level,
      tmp,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (pos >= max) {
    return false;
  }

  ch = state.src.charCodeAt(pos);

  if (ch !== 0x23
  /* # */
  || pos >= max) {
    return false;
  } // count heading level


  level = 1;
  ch = state.src.charCodeAt(++pos);

  while (ch === 0x23
  /* # */
  && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || pos < max && ch !== 0x20
  /* space */
  ) {
    return false;
  }

  if (silent) {
    return true;
  } // Let's cut tails like '    ###  ' from the end of string


  max = state.skipCharsBack(max, 0x20, pos); // space

  tmp = state.skipCharsBack(max, 0x23, pos); // #

  if (tmp > pos && state.src.charCodeAt(tmp - 1) === 0x20
  /* space */
  ) {
      max = tmp;
    }

  state.line = startLine + 1;
  state.tokens.push({
    type: 'heading_open',
    hLevel: level,
    lines: [startLine, state.line],
    level: state.level
  }); // only if header is not empty

  if (pos < max) {
    state.tokens.push({
      type: 'inline',
      content: state.src.slice(pos, max).trim(),
      level: state.level + 1,
      lines: [startLine, state.line],
      children: []
    });
  }

  state.tokens.push({
    type: 'heading_close',
    hLevel: level,
    level: state.level
  });
  return true;
} // lheading (---, ===)


function lheading(state, startLine, endLine
/*, silent*/
) {
  var marker,
      pos,
      max,
      next = startLine + 1;

  if (next >= endLine) {
    return false;
  }

  if (state.tShift[next] < state.blkIndent) {
    return false;
  } // Scan next line


  if (state.tShift[next] - state.blkIndent > 3) {
    return false;
  }

  pos = state.bMarks[next] + state.tShift[next];
  max = state.eMarks[next];

  if (pos >= max) {
    return false;
  }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x2D
  /* - */
  && marker !== 0x3D
  /* = */
  ) {
      return false;
    }

  pos = state.skipChars(pos, marker);
  pos = state.skipSpaces(pos);

  if (pos < max) {
    return false;
  }

  pos = state.bMarks[startLine] + state.tShift[startLine];
  state.line = next + 1;
  state.tokens.push({
    type: 'heading_open',
    hLevel: marker === 0x3D
    /* = */
    ? 1 : 2,
    lines: [startLine, state.line],
    level: state.level
  });
  state.tokens.push({
    type: 'inline',
    content: state.src.slice(pos, state.eMarks[startLine]).trim(),
    level: state.level + 1,
    lines: [startLine, state.line - 1],
    children: []
  });
  state.tokens.push({
    type: 'heading_close',
    hLevel: marker === 0x3D
    /* = */
    ? 1 : 2,
    level: state.level
  });
  return true;
} // List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks


var html_blocks = {};
['article', 'aside', 'button', 'blockquote', 'body', 'canvas', 'caption', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'iframe', 'li', 'map', 'object', 'ol', 'output', 'p', 'pre', 'progress', 'script', 'section', 'style', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'tr', 'thead', 'ul', 'video'].forEach(function (name) {
  html_blocks[name] = true;
}); // HTML block

var HTML_TAG_OPEN_RE = /^<([a-zA-Z]{1,15})[\s\/>]/;
var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z]{1,15})[\s>]/;

function isLetter$1(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case

  return lc >= 0x61
  /* a */
  && lc <= 0x7a
  /* z */
  ;
}

function htmlblock(state, startLine, endLine, silent) {
  var ch,
      match,
      nextLine,
      pos = state.bMarks[startLine],
      max = state.eMarks[startLine],
      shift = state.tShift[startLine];
  pos += shift;

  if (!state.options.html) {
    return false;
  }

  if (shift > 3 || pos + 2 >= max) {
    return false;
  }

  if (state.src.charCodeAt(pos) !== 0x3C
  /* < */
  ) {
      return false;
    }

  ch = state.src.charCodeAt(pos + 1);

  if (ch === 0x21
  /* ! */
  || ch === 0x3F
  /* ? */
  ) {
      // Directive start / comment start / processing instruction start
      if (silent) {
        return true;
      }
    } else if (ch === 0x2F
  /* / */
  || isLetter$1(ch)) {
    // Probably start or end of tag
    if (ch === 0x2F
    /* \ */
    ) {
        // closing tag
        match = state.src.slice(pos, max).match(HTML_TAG_CLOSE_RE);

        if (!match) {
          return false;
        }
      } else {
      // opening tag
      match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);

      if (!match) {
        return false;
      }
    } // Make sure tag name is valid


    if (html_blocks[match[1].toLowerCase()] !== true) {
      return false;
    }

    if (silent) {
      return true;
    }
  } else {
    return false;
  } // If we are here - we detected HTML block.
  // Let's roll down till empty line (block end).


  nextLine = startLine + 1;

  while (nextLine < state.lineMax && !state.isEmpty(nextLine)) {
    nextLine++;
  }

  state.line = nextLine;
  state.tokens.push({
    type: 'htmlblock',
    level: state.level,
    lines: [startLine, state.line],
    content: state.getLines(startLine, nextLine, 0, true)
  });
  return true;
} // GFM table, non-standard


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];
  return state.src.substr(pos, max - pos);
}

function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, rows, cell, aligns, t, tableLines, tbodyLines; // should have at least three lines

  if (startLine + 2 > endLine) {
    return false;
  }

  nextLine = startLine + 1;

  if (state.tShift[nextLine] < state.blkIndent) {
    return false;
  } // first character of the second line should be '|' or '-'


  pos = state.bMarks[nextLine] + state.tShift[nextLine];

  if (pos >= state.eMarks[nextLine]) {
    return false;
  }

  ch = state.src.charCodeAt(pos);

  if (ch !== 0x7C
  /* | */
  && ch !== 0x2D
  /* - */
  && ch !== 0x3A
  /* : */
  ) {
      return false;
    }

  lineText = getLine(state, startLine + 1);

  if (!/^[-:| ]+$/.test(lineText)) {
    return false;
  }

  rows = lineText.split('|');

  if (rows <= 2) {
    return false;
  }

  aligns = [];

  for (i = 0; i < rows.length; i++) {
    t = rows[i].trim();

    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === rows.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) {
      return false;
    }

    if (t.charCodeAt(t.length - 1) === 0x3A
    /* : */
    ) {
        aligns.push(t.charCodeAt(0) === 0x3A
        /* : */
        ? 'center' : 'right');
      } else if (t.charCodeAt(0) === 0x3A
    /* : */
    ) {
        aligns.push('left');
      } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();

  if (lineText.indexOf('|') === -1) {
    return false;
  }

  rows = lineText.replace(/^\||\|$/g, '').split('|');

  if (aligns.length !== rows.length) {
    return false;
  }

  if (silent) {
    return true;
  }

  state.tokens.push({
    type: 'table_open',
    lines: tableLines = [startLine, 0],
    level: state.level++
  });
  state.tokens.push({
    type: 'thead_open',
    lines: [startLine, startLine + 1],
    level: state.level++
  });
  state.tokens.push({
    type: 'tr_open',
    lines: [startLine, startLine + 1],
    level: state.level++
  });

  for (i = 0; i < rows.length; i++) {
    state.tokens.push({
      type: 'th_open',
      align: aligns[i],
      lines: [startLine, startLine + 1],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: rows[i].trim(),
      lines: [startLine, startLine + 1],
      level: state.level,
      children: []
    });
    state.tokens.push({
      type: 'th_close',
      level: --state.level
    });
  }

  state.tokens.push({
    type: 'tr_close',
    level: --state.level
  });
  state.tokens.push({
    type: 'thead_close',
    level: --state.level
  });
  state.tokens.push({
    type: 'tbody_open',
    lines: tbodyLines = [startLine + 2, 0],
    level: state.level++
  });

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.tShift[nextLine] < state.blkIndent) {
      break;
    }

    lineText = getLine(state, nextLine).trim();

    if (lineText.indexOf('|') === -1) {
      break;
    }

    rows = lineText.replace(/^\||\|$/g, '').split('|');
    state.tokens.push({
      type: 'tr_open',
      level: state.level++
    });

    for (i = 0; i < rows.length; i++) {
      state.tokens.push({
        type: 'td_open',
        align: aligns[i],
        level: state.level++
      }); // 0x7c === '|'

      cell = rows[i].substring(rows[i].charCodeAt(0) === 0x7c ? 1 : 0, rows[i].charCodeAt(rows[i].length - 1) === 0x7c ? rows[i].length - 1 : rows[i].length).trim();
      state.tokens.push({
        type: 'inline',
        content: cell,
        level: state.level,
        children: []
      });
      state.tokens.push({
        type: 'td_close',
        level: --state.level
      });
    }

    state.tokens.push({
      type: 'tr_close',
      level: --state.level
    });
  }

  state.tokens.push({
    type: 'tbody_close',
    level: --state.level
  });
  state.tokens.push({
    type: 'table_close',
    level: --state.level
  });
  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
} // Definition lists
// Search `[:~][\n ]`, returns next pos after marker on success
// or -1 on fail.


function skipMarker(state, line) {
  var pos,
      marker,
      start = state.bMarks[line] + state.tShift[line],
      max = state.eMarks[line];

  if (start >= max) {
    return -1;
  } // Check bullet


  marker = state.src.charCodeAt(start++);

  if (marker !== 0x7E
  /* ~ */
  && marker !== 0x3A
  /* : */
  ) {
      return -1;
    }

  pos = state.skipSpaces(start); // require space after ":"

  if (start === pos) {
    return -1;
  } // no empty definitions, e.g. "  : "


  if (pos >= max) {
    return -1;
  }

  return pos;
}

function markTightParagraphs$1(state, idx) {
  var i,
      l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].tight = true;
      state.tokens[i].tight = true;
      i += 2;
    }
  }
}

function deflist(state, startLine, endLine, silent) {
  var contentStart, ddLine, dtLine, itemLines, listLines, listTokIdx, nextLine, oldIndent, oldDDIndent, oldParentType, oldTShift, oldTight, prevEmptyEnd, tight;

  if (silent) {
    // quirk: validation mode validates a dd block only, not a whole deflist
    if (state.ddIndent < 0) {
      return false;
    }

    return skipMarker(state, startLine) >= 0;
  }

  nextLine = startLine + 1;

  if (state.isEmpty(nextLine)) {
    if (++nextLine > endLine) {
      return false;
    }
  }

  if (state.tShift[nextLine] < state.blkIndent) {
    return false;
  }

  contentStart = skipMarker(state, nextLine);

  if (contentStart < 0) {
    return false;
  }

  if (state.level >= state.options.maxNesting) {
    return false;
  } // Start list


  listTokIdx = state.tokens.length;
  state.tokens.push({
    type: 'dl_open',
    lines: listLines = [startLine, 0],
    level: state.level++
  }); //
  // Iterate list items
  //

  dtLine = startLine;
  ddLine = nextLine; // One definition list can contain multiple DTs,
  // and one DT can be followed by multiple DDs.
  //
  // Thus, there is two loops here, and label is
  // needed to break out of the second one
  //

  /*eslint no-labels:0,block-scoped-var:0*/

  OUTER: for (;;) {
    tight = true;
    prevEmptyEnd = false;
    state.tokens.push({
      type: 'dt_open',
      lines: [dtLine, dtLine],
      level: state.level++
    });
    state.tokens.push({
      type: 'inline',
      content: state.getLines(dtLine, dtLine + 1, state.blkIndent, false).trim(),
      level: state.level + 1,
      lines: [dtLine, dtLine],
      children: []
    });
    state.tokens.push({
      type: 'dt_close',
      level: --state.level
    });

    for (;;) {
      state.tokens.push({
        type: 'dd_open',
        lines: itemLines = [nextLine, 0],
        level: state.level++
      });
      oldTight = state.tight;
      oldDDIndent = state.ddIndent;
      oldIndent = state.blkIndent;
      oldTShift = state.tShift[ddLine];
      oldParentType = state.parentType;
      state.blkIndent = state.ddIndent = state.tShift[ddLine] + 2;
      state.tShift[ddLine] = contentStart - state.bMarks[ddLine];
      state.tight = true;
      state.parentType = 'deflist';
      state.parser.tokenize(state, ddLine, endLine, true); // If any of list item is tight, mark list as tight

      if (!state.tight || prevEmptyEnd) {
        tight = false;
      } // Item become loose if finish with empty line,
      // but we should filter last element, because it means list finish


      prevEmptyEnd = state.line - ddLine > 1 && state.isEmpty(state.line - 1);
      state.tShift[ddLine] = oldTShift;
      state.tight = oldTight;
      state.parentType = oldParentType;
      state.blkIndent = oldIndent;
      state.ddIndent = oldDDIndent;
      state.tokens.push({
        type: 'dd_close',
        level: --state.level
      });
      itemLines[1] = nextLine = state.line;

      if (nextLine >= endLine) {
        break OUTER;
      }

      if (state.tShift[nextLine] < state.blkIndent) {
        break OUTER;
      }

      contentStart = skipMarker(state, nextLine);

      if (contentStart < 0) {
        break;
      }

      ddLine = nextLine; // go to the next loop iteration:
      // insert DD tag and repeat checking
    }

    if (nextLine >= endLine) {
      break;
    }

    dtLine = nextLine;

    if (state.isEmpty(dtLine)) {
      break;
    }

    if (state.tShift[dtLine] < state.blkIndent) {
      break;
    }

    ddLine = dtLine + 1;

    if (ddLine >= endLine) {
      break;
    }

    if (state.isEmpty(ddLine)) {
      ddLine++;
    }

    if (ddLine >= endLine) {
      break;
    }

    if (state.tShift[ddLine] < state.blkIndent) {
      break;
    }

    contentStart = skipMarker(state, ddLine);

    if (contentStart < 0) {
      break;
    } // go to the next loop iteration:
    // insert DT and DD tags and repeat checking

  } // Finilize list


  state.tokens.push({
    type: 'dl_close',
    level: --state.level
  });
  listLines[1] = nextLine;
  state.line = nextLine; // mark paragraphs tight if needed

  if (tight) {
    markTightParagraphs$1(state, listTokIdx);
  }

  return true;
} // Paragraph


function paragraph(state, startLine
/*, endLine*/
) {
  var endLine,
      content,
      terminate,
      i,
      l,
      nextLine = startLine + 1,
      terminatorRules;
  endLine = state.lineMax; // jump line-by-line until empty one or EOF

  if (nextLine < endLine && !state.isEmpty(nextLine)) {
    terminatorRules = state.parser.ruler.getRules('paragraph');

    for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
      // this would be a code block normally, but after paragraph
      // it's considered a lazy continuation regardless of what's there
      if (state.tShift[nextLine] - state.blkIndent > 3) {
        continue;
      } // Some tags can terminate paragraph without empty line.


      terminate = false;

      for (i = 0, l = terminatorRules.length; i < l; i++) {
        if (terminatorRules[i](state, nextLine, endLine, true)) {
          terminate = true;
          break;
        }
      }

      if (terminate) {
        break;
      }
    }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  state.line = nextLine;

  if (content.length) {
    state.tokens.push({
      type: 'paragraph_open',
      tight: false,
      lines: [startLine, state.line],
      level: state.level
    });
    state.tokens.push({
      type: 'inline',
      content: content,
      level: state.level + 1,
      lines: [startLine, state.line],
      children: []
    });
    state.tokens.push({
      type: 'paragraph_close',
      tight: false,
      level: state.level
    });
  }

  return true;
}
/**
 * Parser rules
 */


var _rules$1 = [['code', code], ['fences', fences, ['paragraph', 'blockquote', 'list']], ['blockquote', blockquote, ['paragraph', 'blockquote', 'list']], ['hr', hr, ['paragraph', 'blockquote', 'list']], ['list', list, ['paragraph', 'blockquote']], ['footnote', footnote, ['paragraph']], ['heading', heading, ['paragraph', 'blockquote']], ['lheading', lheading], ['htmlblock', htmlblock, ['paragraph', 'blockquote']], ['table', table, ['paragraph']], ['deflist', deflist, ['paragraph']], ['paragraph', paragraph]];
/**
 * Block Parser class
 *
 * @api private
 */

function ParserBlock() {
  this.ruler = new Ruler();

  for (var i = 0; i < _rules$1.length; i++) {
    this.ruler.push(_rules$1[i][0], _rules$1[i][1], {
      alt: (_rules$1[i][2] || []).slice()
    });
  }
}
/**
 * Generate tokens for the given input range.
 *
 * @param  {Object} `state` Has properties like `src`, `parser`, `options` etc
 * @param  {Number} `startLine`
 * @param  {Number} `endLine`
 * @api private
 */


ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var line = startLine;
  var hasEmptyLines = false;
  var ok, i;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);

    if (line >= endLine) {
      break;
    } // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists


    if (state.tShift[line] < state.blkIndent) {
      break;
    } // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true


    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);

      if (ok) {
        break;
      }
    } // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count


    state.tight = !hasEmptyLines; // paragraph might "eat" one newline after it in nested lists

    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++; // two empty lines should stop the parser in list mode

      if (line < endLine && state.parentType === 'list' && state.isEmpty(line)) {
        break;
      }

      state.line = line;
    }
  }
};

var TABS_SCAN_RE = /[\n\t]/g;
var NEWLINES_RE = /\r[\n\u0085]|[\u2424\u2028\u0085]/g;
var SPACES_RE = /\u00a0/g;
/**
 * Tokenize the given `str`.
 *
 * @param  {String} `str` Source string
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @param  {Array} `outTokens`
 * @api private
 */

ParserBlock.prototype.parse = function (str, options, env, outTokens) {
  var state,
      lineStart = 0,
      lastTabPos = 0;

  if (!str) {
    return [];
  } // Normalize spaces


  str = str.replace(SPACES_RE, ' '); // Normalize newlines

  str = str.replace(NEWLINES_RE, '\n'); // Replace tabs with proper number of spaces (1..4)

  if (str.indexOf('\t') >= 0) {
    str = str.replace(TABS_SCAN_RE, function (match, offset) {
      var result;

      if (str.charCodeAt(offset) === 0x0A) {
        lineStart = offset + 1;
        lastTabPos = 0;
        return match;
      }

      result = '    '.slice((offset - lineStart - lastTabPos) % 4);
      lastTabPos = offset - lineStart + 1;
      return result;
    });
  }

  state = new StateBlock(str, this, options, env, outTokens);
  this.tokenize(state, state.line, state.lineMax);
}; // Skip text characters for text token, place those to pending buffer
// and increment current pos
// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions


function isTerminatorChar(ch) {
  switch (ch) {
    case 0x0A
    /* \n */
    :
    case 0x5C
    /* \ */
    :
    case 0x60
    /* ` */
    :
    case 0x2A
    /* * */
    :
    case 0x5F
    /* _ */
    :
    case 0x5E
    /* ^ */
    :
    case 0x5B
    /* [ */
    :
    case 0x5D
    /* ] */
    :
    case 0x21
    /* ! */
    :
    case 0x26
    /* & */
    :
    case 0x3C
    /* < */
    :
    case 0x3E
    /* > */
    :
    case 0x7B
    /* { */
    :
    case 0x7D
    /* } */
    :
    case 0x24
    /* $ */
    :
    case 0x25
    /* % */
    :
    case 0x40
    /* @ */
    :
    case 0x7E
    /* ~ */
    :
    case 0x2B
    /* + */
    :
    case 0x3D
    /* = */
    :
    case 0x3A
    /* : */
    :
      return true;

    default:
      return false;
  }
}

function text(state, silent) {
  var pos = state.pos;

  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }

  if (pos === state.pos) {
    return false;
  }

  if (!silent) {
    state.pending += state.src.slice(state.pos, pos);
  }

  state.pos = pos;
  return true;
} // Proceess '\n'


function newline(state, silent) {
  var pmax,
      max,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A
  /* \n */
  ) {
      return false;
    }

  pmax = state.pending.length - 1;
  max = state.posMax; // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.

  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
        // Strip out all trailing spaces on this line.
        for (var i = pmax - 2; i >= 0; i--) {
          if (state.pending.charCodeAt(i) !== 0x20) {
            state.pending = state.pending.substring(0, i + 1);
            break;
          }
        }

        state.push({
          type: 'hardbreak',
          level: state.level
        });
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push({
          type: 'softbreak',
          level: state.level
        });
      }
    } else {
      state.push({
        type: 'softbreak',
        level: state.level
      });
    }
  }

  pos++; // skip heading spaces for next line

  while (pos < max && state.src.charCodeAt(pos) === 0x20) {
    pos++;
  }

  state.pos = pos;
  return true;
} // Proceess escaped chars and hardbreaks


var ESCAPED = [];

for (var i = 0; i < 256; i++) {
  ESCAPED.push(0);
}

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'.split('').forEach(function (ch) {
  ESCAPED[ch.charCodeAt(0)] = 1;
});

function escape(state, silent) {
  var ch,
      pos = state.pos,
      max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C
  /* \ */
  ) {
      return false;
    }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ch < 256 && ESCAPED[ch] !== 0) {
      if (!silent) {
        state.pending += state.src[pos];
      }

      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push({
          type: 'hardbreak',
          level: state.level
        });
      }

      pos++; // skip leading whitespaces from next line

      while (pos < max && state.src.charCodeAt(pos) === 0x20) {
        pos++;
      }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) {
    state.pending += '\\';
  }

  state.pos++;
  return true;
} // Parse backticks


function backticks(state, silent) {
  var start,
      max,
      marker,
      matchStart,
      matchEnd,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60
  /* ` */
  ) {
      return false;
    }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60
  /* ` */
  ) {
    pos++;
  }

  marker = state.src.slice(start, pos);
  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60
    /* ` */
    ) {
      matchEnd++;
    }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        state.push({
          type: 'code',
          content: state.src.slice(pos, matchStart).replace(/[ \n]+/g, ' ').trim(),
          block: false,
          level: state.level
        });
      }

      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) {
    state.pending += marker;
  }

  state.pos += marker.length;
  return true;
} // Process ~~deleted text~~


function del(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x7E
  /* ~ */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  if (start + 4 >= max) {
    return false;
  }

  if (state.src.charCodeAt(start + 1) !== 0x7E
  /* ~ */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x7E
  /* ~ */
  ) {
      return false;
    }

  if (nextChar === 0x7E
  /* ~ */
  ) {
      return false;
    }

  if (nextChar === 0x20 || nextChar === 0x0A) {
    return false;
  }

  pos = start + 2;

  while (pos < max && state.src.charCodeAt(pos) === 0x7E
  /* ~ */
  ) {
    pos++;
  }

  if (pos > start + 3) {
    // sequence of 4+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;

    if (!silent) {
      state.pending += state.src.slice(start, pos);
    }

    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x7E
    /* ~ */
    ) {
        if (state.src.charCodeAt(state.pos + 1) === 0x7E
        /* ~ */
        ) {
            lastChar = state.src.charCodeAt(state.pos - 1);
            nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;

            if (nextChar !== 0x7E
            /* ~ */
            && lastChar !== 0x7E
            /* ~ */
            ) {
                if (lastChar !== 0x20 && lastChar !== 0x0A) {
                  // closing '~~'
                  stack--;
                } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
                  // opening '~~'
                  stack++;
                } // else {
                //  // standalone ' ~~ ' indented with spaces
                // }


                if (stack <= 0) {
                  found = true;
                  break;
                }
              }
          }
      }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({
      type: 'del_open',
      level: state.level++
    });
    state.parser.tokenize(state);
    state.push({
      type: 'del_close',
      level: --state.level
    });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
} // Process ++inserted text++


function ins(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x2B
  /* + */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  if (start + 4 >= max) {
    return false;
  }

  if (state.src.charCodeAt(start + 1) !== 0x2B
  /* + */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x2B
  /* + */
  ) {
      return false;
    }

  if (nextChar === 0x2B
  /* + */
  ) {
      return false;
    }

  if (nextChar === 0x20 || nextChar === 0x0A) {
    return false;
  }

  pos = start + 2;

  while (pos < max && state.src.charCodeAt(pos) === 0x2B
  /* + */
  ) {
    pos++;
  }

  if (pos !== start + 2) {
    // sequence of 3+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;

    if (!silent) {
      state.pending += state.src.slice(start, pos);
    }

    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x2B
    /* + */
    ) {
        if (state.src.charCodeAt(state.pos + 1) === 0x2B
        /* + */
        ) {
            lastChar = state.src.charCodeAt(state.pos - 1);
            nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;

            if (nextChar !== 0x2B
            /* + */
            && lastChar !== 0x2B
            /* + */
            ) {
                if (lastChar !== 0x20 && lastChar !== 0x0A) {
                  // closing '++'
                  stack--;
                } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
                  // opening '++'
                  stack++;
                } // else {
                //  // standalone ' ++ ' indented with spaces
                // }


                if (stack <= 0) {
                  found = true;
                  break;
                }
              }
          }
      }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({
      type: 'ins_open',
      level: state.level++
    });
    state.parser.tokenize(state);
    state.push({
      type: 'ins_close',
      level: --state.level
    });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
} // Process ==highlighted text==


function mark(state, silent) {
  var found,
      pos,
      stack,
      max = state.posMax,
      start = state.pos,
      lastChar,
      nextChar;

  if (state.src.charCodeAt(start) !== 0x3D
  /* = */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  if (start + 4 >= max) {
    return false;
  }

  if (state.src.charCodeAt(start + 1) !== 0x3D
  /* = */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 0x3D
  /* = */
  ) {
      return false;
    }

  if (nextChar === 0x3D
  /* = */
  ) {
      return false;
    }

  if (nextChar === 0x20 || nextChar === 0x0A) {
    return false;
  }

  pos = start + 2;

  while (pos < max && state.src.charCodeAt(pos) === 0x3D
  /* = */
  ) {
    pos++;
  }

  if (pos !== start + 2) {
    // sequence of 3+ markers taking as literal, same as in a emphasis
    state.pos += pos - start;

    if (!silent) {
      state.pending += state.src.slice(start, pos);
    }

    return true;
  }

  state.pos = start + 2;
  stack = 1;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 0x3D
    /* = */
    ) {
        if (state.src.charCodeAt(state.pos + 1) === 0x3D
        /* = */
        ) {
            lastChar = state.src.charCodeAt(state.pos - 1);
            nextChar = state.pos + 2 < max ? state.src.charCodeAt(state.pos + 2) : -1;

            if (nextChar !== 0x3D
            /* = */
            && lastChar !== 0x3D
            /* = */
            ) {
                if (lastChar !== 0x20 && lastChar !== 0x0A) {
                  // closing '=='
                  stack--;
                } else if (nextChar !== 0x20 && nextChar !== 0x0A) {
                  // opening '=='
                  stack++;
                } // else {
                //  // standalone ' == ' indented with spaces
                // }


                if (stack <= 0) {
                  found = true;
                  break;
                }
              }
          }
      }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({
      type: 'mark_open',
      level: state.level++
    });
    state.parser.tokenize(state);
    state.push({
      type: 'mark_close',
      level: --state.level
    });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
} // Process *this* and _that_


function isAlphaNum(code) {
  return code >= 0x30
  /* 0 */
  && code <= 0x39
  /* 9 */
  || code >= 0x41
  /* A */
  && code <= 0x5A
  /* Z */
  || code >= 0x61
  /* a */
  && code <= 0x7A
  /* z */
  ;
} // parse sequence of emphasis markers,
// "start" should point at a valid marker


function scanDelims(state, start) {
  var pos = start,
      lastChar,
      nextChar,
      count,
      can_open = true,
      can_close = true,
      max = state.posMax,
      marker = state.src.charCodeAt(start);
  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;

  while (pos < max && state.src.charCodeAt(pos) === marker) {
    pos++;
  }

  if (pos >= max) {
    can_open = false;
  }

  count = pos - start;

  if (count >= 4) {
    // sequence of four or more unescaped markers can't start/end an emphasis
    can_open = can_close = false;
  } else {
    nextChar = pos < max ? state.src.charCodeAt(pos) : -1; // check whitespace conditions

    if (nextChar === 0x20 || nextChar === 0x0A) {
      can_open = false;
    }

    if (lastChar === 0x20 || lastChar === 0x0A) {
      can_close = false;
    }

    if (marker === 0x5F
    /* _ */
    ) {
        // check if we aren't inside the word
        if (isAlphaNum(lastChar)) {
          can_open = false;
        }

        if (isAlphaNum(nextChar)) {
          can_close = false;
        }
      }
  }

  return {
    can_open: can_open,
    can_close: can_close,
    delims: count
  };
}

function emphasis(state, silent) {
  var startCount,
      count,
      found,
      oldCount,
      newCount,
      stack,
      res,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker !== 0x5F
  /* _ */
  && marker !== 0x2A
  /* * */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  res = scanDelims(state, start);
  startCount = res.delims;

  if (!res.can_open) {
    state.pos += startCount;

    if (!silent) {
      state.pending += state.src.slice(start, state.pos);
    }

    return true;
  }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  state.pos = start + startCount;
  stack = [startCount];

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === marker) {
      res = scanDelims(state, state.pos);
      count = res.delims;

      if (res.can_close) {
        oldCount = stack.pop();
        newCount = count;

        while (oldCount !== newCount) {
          if (newCount < oldCount) {
            stack.push(oldCount - newCount);
            break;
          } // assert(newCount > oldCount)


          newCount -= oldCount;

          if (stack.length === 0) {
            break;
          }

          state.pos += oldCount;
          oldCount = stack.pop();
        }

        if (stack.length === 0) {
          startCount = oldCount;
          found = true;
          break;
        }

        state.pos += count;
        continue;
      }

      if (res.can_open) {
        stack.push(count);
      }

      state.pos += count;
      continue;
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + startCount;

  if (!silent) {
    if (startCount === 2 || startCount === 3) {
      state.push({
        type: 'strong_open',
        level: state.level++
      });
    }

    if (startCount === 1 || startCount === 3) {
      state.push({
        type: 'em_open',
        level: state.level++
      });
    }

    state.parser.tokenize(state);

    if (startCount === 1 || startCount === 3) {
      state.push({
        type: 'em_close',
        level: --state.level
      });
    }

    if (startCount === 2 || startCount === 3) {
      state.push({
        type: 'strong_close',
        level: --state.level
      });
    }
  }

  state.pos = state.posMax + startCount;
  state.posMax = max;
  return true;
} // Process ~subscript~
// same as UNESCAPE_MD_RE plus a space


var UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function sub(state, silent) {
  var found,
      content,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== 0x7E
  /* ~ */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  if (start + 2 >= max) {
    return false;
  }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x7E
    /* ~ */
    ) {
        found = true;
        break;
      }

    state.parser.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos); // don't allow unescaped spaces/newlines inside

  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + 1;

  if (!silent) {
    state.push({
      type: 'sub',
      level: state.level,
      content: content.replace(UNESCAPE_RE, '$1')
    });
  }

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
} // Process ^superscript^
// same as UNESCAPE_MD_RE plus a space


var UNESCAPE_RE$1 = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function sup(state, silent) {
  var found,
      content,
      max = state.posMax,
      start = state.pos;

  if (state.src.charCodeAt(start) !== 0x5E
  /* ^ */
  ) {
      return false;
    }

  if (silent) {
    return false;
  } // don't run any pairs in validation mode


  if (start + 2 >= max) {
    return false;
  }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x5E
    /* ^ */
    ) {
        found = true;
        break;
      }

    state.parser.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos); // don't allow unescaped spaces/newlines inside

  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  } // found!


  state.posMax = state.pos;
  state.pos = start + 1;

  if (!silent) {
    state.push({
      type: 'sup',
      level: state.level,
      content: content.replace(UNESCAPE_RE$1, '$1')
    });
  }

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
} // Process [links](<to> "stuff")


function links(state, silent) {
  var labelStart,
      labelEnd,
      label,
      href,
      title,
      pos,
      ref,
      code,
      isImage = false,
      oldPos = state.pos,
      max = state.posMax,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (marker === 0x21
  /* ! */
  ) {
      isImage = true;
      marker = state.src.charCodeAt(++start);
    }

  if (marker !== 0x5B
  /* [ */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  labelStart = start + 1;
  labelEnd = parseLinkLabel(state, start); // parser failed to find ']', so it's not a valid link

  if (labelEnd < 0) {
    return false;
  }

  pos = labelEnd + 1;

  if (pos < max && state.src.charCodeAt(pos) === 0x28
  /* ( */
  ) {
      //
      // Inline link
      //
      // [link](  <href>  "title"  )
      //        ^^ skipping these spaces
      pos++;

      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);

        if (code !== 0x20 && code !== 0x0A) {
          break;
        }
      }

      if (pos >= max) {
        return false;
      } // [link](  <href>  "title"  )
      //          ^^^^^^ parsing link destination


      start = pos;

      if (parseLinkDestination(state, pos)) {
        href = state.linkContent;
        pos = state.pos;
      } else {
        href = '';
      } // [link](  <href>  "title"  )
      //                ^^ skipping these spaces


      start = pos;

      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);

        if (code !== 0x20 && code !== 0x0A) {
          break;
        }
      } // [link](  <href>  "title"  )
      //                  ^^^^^^^ parsing link title


      if (pos < max && start !== pos && parseLinkTitle(state, pos)) {
        title = state.linkContent;
        pos = state.pos; // [link](  <href>  "title"  )
        //                         ^^ skipping these spaces

        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos);

          if (code !== 0x20 && code !== 0x0A) {
            break;
          }
        }
      } else {
        title = '';
      }

      if (pos >= max || state.src.charCodeAt(pos) !== 0x29
      /* ) */
      ) {
          state.pos = oldPos;
          return false;
        }

      pos++;
    } else {
    //
    // Link reference
    //
    // do not allow nested reference links
    if (state.linkLevel > 0) {
      return false;
    } // [foo]  [bar]
    //      ^^ optional whitespace (can include newlines)


    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);

      if (code !== 0x20 && code !== 0x0A) {
        break;
      }
    }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B
    /* [ */
    ) {
        start = pos + 1;
        pos = parseLinkLabel(state, pos);

        if (pos >= 0) {
          label = state.src.slice(start, pos++);
        } else {
          pos = start - 1;
        }
      } // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)


    if (!label) {
      if (typeof label === 'undefined') {
        pos = labelEnd + 1;
      }

      label = state.src.slice(labelStart, labelEnd);
    }

    ref = state.env.references[normalizeReference(label)];

    if (!ref) {
      state.pos = oldPos;
      return false;
    }

    href = ref.href;
    title = ref.title;
  } //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //


  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    if (isImage) {
      state.push({
        type: 'image',
        src: href,
        title: title,
        alt: state.src.substr(labelStart, labelEnd - labelStart),
        level: state.level
      });
    } else {
      state.push({
        type: 'link_open',
        href: href,
        title: title,
        level: state.level++
      });
      state.linkLevel++;
      state.parser.tokenize(state);
      state.linkLevel--;
      state.push({
        type: 'link_close',
        level: --state.level
      });
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
} // Process inline footnotes (^[...])


function footnote_inline(state, silent) {
  var labelStart,
      labelEnd,
      footnoteId,
      oldLength,
      max = state.posMax,
      start = state.pos;

  if (start + 2 >= max) {
    return false;
  }

  if (state.src.charCodeAt(start) !== 0x5E
  /* ^ */
  ) {
      return false;
    }

  if (state.src.charCodeAt(start + 1) !== 0x5B
  /* [ */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  labelStart = start + 2;
  labelEnd = parseLinkLabel(state, start + 1); // parser failed to find ']', so it's not a valid note

  if (labelEnd < 0) {
    return false;
  } // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //


  if (!silent) {
    if (!state.env.footnotes) {
      state.env.footnotes = {};
    }

    if (!state.env.footnotes.list) {
      state.env.footnotes.list = [];
    }

    footnoteId = state.env.footnotes.list.length;
    state.pos = labelStart;
    state.posMax = labelEnd;
    state.push({
      type: 'footnote_ref',
      id: footnoteId,
      level: state.level
    });
    state.linkLevel++;
    oldLength = state.tokens.length;
    state.parser.tokenize(state);
    state.env.footnotes.list[footnoteId] = {
      tokens: state.tokens.splice(oldLength)
    };
    state.linkLevel--;
  }

  state.pos = labelEnd + 1;
  state.posMax = max;
  return true;
} // Process footnote references ([^...])


function footnote_ref(state, silent) {
  var label,
      pos,
      footnoteId,
      footnoteSubId,
      max = state.posMax,
      start = state.pos; // should be at least 4 chars - "[^x]"

  if (start + 3 > max) {
    return false;
  }

  if (!state.env.footnotes || !state.env.footnotes.refs) {
    return false;
  }

  if (state.src.charCodeAt(start) !== 0x5B
  /* [ */
  ) {
      return false;
    }

  if (state.src.charCodeAt(start + 1) !== 0x5E
  /* ^ */
  ) {
      return false;
    }

  if (state.level >= state.options.maxNesting) {
    return false;
  }

  for (pos = start + 2; pos < max; pos++) {
    if (state.src.charCodeAt(pos) === 0x20) {
      return false;
    }

    if (state.src.charCodeAt(pos) === 0x0A) {
      return false;
    }

    if (state.src.charCodeAt(pos) === 0x5D
    /* ] */
    ) {
        break;
      }
  }

  if (pos === start + 2) {
    return false;
  } // no empty footnote labels


  if (pos >= max) {
    return false;
  }

  pos++;
  label = state.src.slice(start + 2, pos - 1);

  if (typeof state.env.footnotes.refs[':' + label] === 'undefined') {
    return false;
  }

  if (!silent) {
    if (!state.env.footnotes.list) {
      state.env.footnotes.list = [];
    }

    if (state.env.footnotes.refs[':' + label] < 0) {
      footnoteId = state.env.footnotes.list.length;
      state.env.footnotes.list[footnoteId] = {
        label: label,
        count: 0
      };
      state.env.footnotes.refs[':' + label] = footnoteId;
    } else {
      footnoteId = state.env.footnotes.refs[':' + label];
    }

    footnoteSubId = state.env.footnotes.list[footnoteId].count;
    state.env.footnotes.list[footnoteId].count++;
    state.push({
      type: 'footnote_ref',
      id: footnoteId,
      subId: footnoteSubId,
      level: state.level
    });
  }

  state.pos = pos;
  state.posMax = max;
  return true;
} // List of valid url schemas, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#autolinks


var url_schemas = ['coap', 'doi', 'javascript', 'aaa', 'aaas', 'about', 'acap', 'cap', 'cid', 'crid', 'data', 'dav', 'dict', 'dns', 'file', 'ftp', 'geo', 'go', 'gopher', 'h323', 'http', 'https', 'iax', 'icap', 'im', 'imap', 'info', 'ipp', 'iris', 'iris.beep', 'iris.xpc', 'iris.xpcs', 'iris.lwz', 'ldap', 'mailto', 'mid', 'msrp', 'msrps', 'mtqp', 'mupdate', 'news', 'nfs', 'ni', 'nih', 'nntp', 'opaquelocktoken', 'pop', 'pres', 'rtsp', 'service', 'session', 'shttp', 'sieve', 'sip', 'sips', 'sms', 'snmp', 'soap.beep', 'soap.beeps', 'tag', 'tel', 'telnet', 'tftp', 'thismessage', 'tn3270', 'tip', 'tv', 'urn', 'vemmi', 'ws', 'wss', 'xcon', 'xcon-userid', 'xmlrpc.beep', 'xmlrpc.beeps', 'xmpp', 'z39.50r', 'z39.50s', 'adiumxtra', 'afp', 'afs', 'aim', 'apt', 'attachment', 'aw', 'beshare', 'bitcoin', 'bolo', 'callto', 'chrome', 'chrome-extension', 'com-eventbrite-attendee', 'content', 'cvs', 'dlna-playsingle', 'dlna-playcontainer', 'dtn', 'dvb', 'ed2k', 'facetime', 'feed', 'finger', 'fish', 'gg', 'git', 'gizmoproject', 'gtalk', 'hcp', 'icon', 'ipn', 'irc', 'irc6', 'ircs', 'itms', 'jar', 'jms', 'keyparc', 'lastfm', 'ldaps', 'magnet', 'maps', 'market', 'message', 'mms', 'ms-help', 'msnim', 'mumble', 'mvn', 'notes', 'oid', 'palm', 'paparazzi', 'platform', 'proxy', 'psyc', 'query', 'res', 'resource', 'rmi', 'rsync', 'rtmp', 'secondlife', 'sftp', 'sgn', 'skype', 'smb', 'soldat', 'spotify', 'ssh', 'steam', 'svn', 'teamspeak', 'things', 'udp', 'unreal', 'ut2004', 'ventrilo', 'view-source', 'webcal', 'wtai', 'wyciwyg', 'xfire', 'xri', 'ymsgr']; // Process autolinks '<protocol:...>'

/*eslint max-len:0*/

var EMAIL_RE = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z.\-]{1,25}):([^<>\x00-\x20]*)>/;

function autolink(state, silent) {
  var tail,
      linkMatch,
      emailMatch,
      url,
      fullUrl,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C
  /* < */
  ) {
      return false;
    }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) {
    return false;
  }

  linkMatch = tail.match(AUTOLINK_RE);

  if (linkMatch) {
    if (url_schemas.indexOf(linkMatch[1].toLowerCase()) < 0) {
      return false;
    }

    url = linkMatch[0].slice(1, -1);
    fullUrl = normalizeLink(url);

    if (!state.parser.validateLink(url)) {
      return false;
    }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({
        type: 'link_close',
        level: state.level
      });
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  emailMatch = tail.match(EMAIL_RE);

  if (emailMatch) {
    url = emailMatch[0].slice(1, -1);
    fullUrl = normalizeLink('mailto:' + url);

    if (!state.parser.validateLink(fullUrl)) {
      return false;
    }

    if (!silent) {
      state.push({
        type: 'link_open',
        href: fullUrl,
        level: state.level
      });
      state.push({
        type: 'text',
        content: url,
        level: state.level + 1
      });
      state.push({
        type: 'link_close',
        level: state.level
      });
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
} // Regexps to match html elements


function replace$1(regex, options) {
  regex = regex.source;
  options = options || '';
  return function self(name, val) {
    if (!name) {
      return new RegExp(regex, options);
    }

    val = val.source || val;
    regex = regex.replace(name, val);
    return self;
  };
}

var attr_name = /[a-zA-Z_:][a-zA-Z0-9:._-]*/;
var unquoted = /[^"'=<>`\x00-\x20]+/;
var single_quoted = /'[^']*'/;
var double_quoted = /"[^"]*"/;
/*eslint no-spaced-func:0*/

var attr_value = replace$1(/(?:unquoted|single_quoted|double_quoted)/)('unquoted', unquoted)('single_quoted', single_quoted)('double_quoted', double_quoted)();
var attribute = replace$1(/(?:\s+attr_name(?:\s*=\s*attr_value)?)/)('attr_name', attr_name)('attr_value', attr_value)();
var open_tag = replace$1(/<[A-Za-z][A-Za-z0-9]*attribute*\s*\/?>/)('attribute', attribute)();
var close_tag = /<\/[A-Za-z][A-Za-z0-9]*\s*>/;
var comment = /<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->/;
var processing = /<[?].*?[?]>/;
var declaration = /<![A-Z]+\s+[^>]*>/;
var cdata = /<!\[CDATA\[[\s\S]*?\]\]>/;
var HTML_TAG_RE = replace$1(/^(?:open_tag|close_tag|comment|processing|declaration|cdata)/)('open_tag', open_tag)('close_tag', close_tag)('comment', comment)('processing', processing)('declaration', declaration)('cdata', cdata)(); // Process html tags

function isLetter$2(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case

  return lc >= 0x61
  /* a */
  && lc <= 0x7a
  /* z */
  ;
}

function htmltag(state, silent) {
  var ch,
      match,
      max,
      pos = state.pos;

  if (!state.options.html) {
    return false;
  } // Check start


  max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x3C
  /* < */
  || pos + 2 >= max) {
    return false;
  } // Quick fail on second char


  ch = state.src.charCodeAt(pos + 1);

  if (ch !== 0x21
  /* ! */
  && ch !== 0x3F
  /* ? */
  && ch !== 0x2F
  /* / */
  && !isLetter$2(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);

  if (!match) {
    return false;
  }

  if (!silent) {
    state.push({
      type: 'htmltag',
      content: state.src.slice(pos, pos + match[0].length),
      level: state.level
    });
  }

  state.pos += match[0].length;
  return true;
} // Process html entity - &#123;, &#xAF;, &quot;, ...


var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;

function entity(state, silent) {
  var ch,
      code,
      match,
      pos = state.pos,
      max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26
  /* & */
  ) {
      return false;
    }

  if (pos + 1 < max) {
    ch = state.src.charCodeAt(pos + 1);

    if (ch === 0x23
    /* # */
    ) {
        match = state.src.slice(pos).match(DIGITAL_RE);

        if (match) {
          if (!silent) {
            code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
            state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
          }

          state.pos += match[0].length;
          return true;
        }
      } else {
      match = state.src.slice(pos).match(NAMED_RE);

      if (match) {
        var decoded = decodeEntity(match[1]);

        if (match[1] !== decoded) {
          if (!silent) {
            state.pending += decoded;
          }

          state.pos += match[0].length;
          return true;
        }
      }
    }
  }

  if (!silent) {
    state.pending += '&';
  }

  state.pos++;
  return true;
}
/**
 * Inline Parser `rules`
 */


var _rules$2 = [['text', text], ['newline', newline], ['escape', escape], ['backticks', backticks], ['del', del], ['ins', ins], ['mark', mark], ['emphasis', emphasis], ['sub', sub], ['sup', sup], ['links', links], ['footnote_inline', footnote_inline], ['footnote_ref', footnote_ref], ['autolink', autolink], ['htmltag', htmltag], ['entity', entity]];
/**
 * Inline Parser class. Note that link validation is stricter
 * in Remarkable than what is specified by CommonMark. If you
 * want to change this you can use a custom validator.
 *
 * @api private
 */

function ParserInline() {
  this.ruler = new Ruler();

  for (var i = 0; i < _rules$2.length; i++) {
    this.ruler.push(_rules$2[i][0], _rules$2[i][1]);
  } // Can be overridden with a custom validator


  this.validateLink = validateLink;
}
/**
 * Skip a single token by running all rules in validation mode.
 * Returns `true` if any rule reports success.
 *
 * @param  {Object} `state`
 * @api privage
 */


ParserInline.prototype.skipToken = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var pos = state.pos;
  var i, cached_pos;

  if ((cached_pos = state.cacheGet(pos)) > 0) {
    state.pos = cached_pos;
    return;
  }

  for (i = 0; i < len; i++) {
    if (rules[i](state, true)) {
      state.cacheSet(pos, state.pos);
      return;
    }
  }

  state.pos++;
  state.cacheSet(pos, state.pos);
};
/**
 * Generate tokens for the given input range.
 *
 * @param  {Object} `state`
 * @api private
 */


ParserInline.prototype.tokenize = function (state) {
  var rules = this.ruler.getRules('');
  var len = rules.length;
  var end = state.posMax;
  var ok, i;

  while (state.pos < end) {
    // Try all possible rules.
    // On success, the rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true
    for (i = 0; i < len; i++) {
      ok = rules[i](state, false);

      if (ok) {
        break;
      }
    }

    if (ok) {
      if (state.pos >= end) {
        break;
      }

      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};
/**
 * Parse the given input string.
 *
 * @param  {String} `str`
 * @param  {Object} `options`
 * @param  {Object} `env`
 * @param  {Array} `outTokens`
 * @api private
 */


ParserInline.prototype.parse = function (str, options, env, outTokens) {
  var state = new StateInline(str, this, options, env, outTokens);
  this.tokenize(state);
};
/**
 * Validate the given `url` by checking for bad protocols.
 *
 * @param  {String} `url`
 * @return {Boolean}
 */


function validateLink(url) {
  var BAD_PROTOCOLS = ['vbscript', 'javascript', 'file', 'data'];
  var str = url.trim().toLowerCase(); // Care about digital entities "javascript&#x3A;alert(1)"

  str = replaceEntities(str);

  if (str.indexOf(':') !== -1 && BAD_PROTOCOLS.indexOf(str.split(':')[0]) !== -1) {
    return false;
  }

  return true;
} // Remarkable default options


var defaultConfig = {
  options: {
    html: false,
    // Enable HTML tags in source
    xhtmlOut: false,
    // Use '/' to close single tags (<br />)
    breaks: false,
    // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',
    // CSS language prefix for fenced blocks
    linkTarget: '',
    // set target to open link in
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',
    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20 // Internal protection, recursion limit

  },
  components: {
    core: {
      rules: ['block', 'inline', 'references', 'replacements', 'smartquotes', 'references', 'abbr2', 'footnote_tail']
    },
    block: {
      rules: ['blockquote', 'code', 'fences', 'footnote', 'heading', 'hr', 'htmlblock', 'lheading', 'list', 'paragraph', 'table']
    },
    inline: {
      rules: ['autolink', 'backticks', 'del', 'emphasis', 'entity', 'escape', 'footnote_ref', 'htmltag', 'links', 'newline', 'text']
    }
  }
}; // Remarkable default options

var fullConfig = {
  options: {
    html: false,
    // Enable HTML tags in source
    xhtmlOut: false,
    // Use '/' to close single tags (<br />)
    breaks: false,
    // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',
    // CSS language prefix for fenced blocks
    linkTarget: '',
    // set target to open link in
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',
    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20 // Internal protection, recursion limit

  },
  components: {
    // Don't restrict core/block/inline rules
    core: {},
    block: {},
    inline: {}
  }
}; // Commonmark default options

var commonmarkConfig = {
  options: {
    html: true,
    // Enable HTML tags in source
    xhtmlOut: true,
    // Use '/' to close single tags (<br />)
    breaks: false,
    // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-',
    // CSS language prefix for fenced blocks
    linkTarget: '',
    // set target to open link in
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: '“”‘’',
    // Highlighter function. Should return escaped HTML,
    // or '' if input not changed
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20 // Internal protection, recursion limit

  },
  components: {
    core: {
      rules: ['block', 'inline', 'references', 'abbr2']
    },
    block: {
      rules: ['blockquote', 'code', 'fences', 'heading', 'hr', 'htmlblock', 'lheading', 'list', 'paragraph']
    },
    inline: {
      rules: ['autolink', 'backticks', 'emphasis', 'entity', 'escape', 'htmltag', 'links', 'newline', 'text']
    }
  }
};
/**
 * Preset configs
 */

var config = {
  'default': defaultConfig,
  'full': fullConfig,
  'commonmark': commonmarkConfig
};
/**
 * The `StateCore` class manages state.
 *
 * @param {Object} `instance` Remarkable instance
 * @param {String} `str` Markdown string
 * @param {Object} `env`
 */

function StateCore(instance, str, env) {
  this.src = str;
  this.env = env;
  this.options = instance.options;
  this.tokens = [];
  this.inlineMode = false;
  this.inline = instance.inline;
  this.block = instance.block;
  this.renderer = instance.renderer;
  this.typographer = instance.typographer;
}
/**
 * The main `Remarkable` class. Create an instance of
 * `Remarkable` with a `preset` and/or `options`.
 *
 * @param {String} `preset` If no preset is given, `default` is used.
 * @param {Object} `options`
 */


function Remarkable(preset, options) {
  if (typeof preset !== 'string') {
    options = preset;
    preset = 'default';
  }

  if (options && options.linkify != null) {
    console.warn('linkify option is removed. Use linkify plugin instead:\n\n' + 'import Remarkable from \'remarkable\';\n' + 'import linkify from \'remarkable/linkify\';\n' + 'new Remarkable().use(linkify)\n');
  }

  this.inline = new ParserInline();
  this.block = new ParserBlock();
  this.core = new Core();
  this.renderer = new Renderer();
  this.ruler = new Ruler();
  this.options = {};
  this.configure(config[preset]);
  this.set(options || {});
}
/**
 * Set options as an alternative to passing them
 * to the constructor.
 *
 * ```js
 * md.set({typographer: true});
 * ```
 * @param {Object} `options`
 * @api public
 */


Remarkable.prototype.set = function (options) {
  assign(this.options, options);
};
/**
 * Batch loader for components rules states, and options
 *
 * @param  {Object} `presets`
 */


Remarkable.prototype.configure = function (presets) {
  var self = this;

  if (!presets) {
    throw new Error('Wrong `remarkable` preset, check name/content');
  }

  if (presets.options) {
    self.set(presets.options);
  }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enable(presets.components[name].rules, true);
      }
    });
  }
};
/**
 * Use a plugin.
 *
 * ```js
 * var md = new Remarkable();
 *
 * md.use(plugin1)
 *   .use(plugin2, opts)
 *   .use(plugin3);
 * ```
 *
 * @param  {Function} `plugin`
 * @param  {Object} `options`
 * @return {Object} `Remarkable` for chaining
 */


Remarkable.prototype.use = function (plugin, options) {
  plugin(this, options);
  return this;
};
/**
 * Parse the input `string` and return a tokens array.
 * Modifies `env` with definitions data.
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {Array} Array of tokens
 */


Remarkable.prototype.parse = function (str, env) {
  var state = new StateCore(this, str, env);
  this.core.process(state);
  return state.tokens;
};
/**
 * The main `.render()` method that does all the magic :)
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {String} Rendered HTML.
 */


Remarkable.prototype.render = function (str, env) {
  env = env || {};
  return this.renderer.render(this.parse(str, env), this.options, env);
};
/**
 * Parse the given content `string` as a single string.
 *
 * @param  {String} `string`
 * @param  {Object} `env`
 * @return {Array} Array of tokens
 */


Remarkable.prototype.parseInline = function (str, env) {
  var state = new StateCore(this, str, env);
  state.inlineMode = true;
  this.core.process(state);
  return state.tokens;
};
/**
 * Render a single content `string`, without wrapping it
 * to paragraphs
 *
 * @param  {String} `str`
 * @param  {Object} `env`
 * @return {String}
 */


Remarkable.prototype.renderInline = function (str, env) {
  env = env || {};
  return this.renderer.render(this.parseInline(str, env), this.options, env);
};

exports.Remarkable = Remarkable;
exports.utils = utils;

},{}],536:[function(require,module,exports){
"use strict";

var _view = require("markmap-lib/dist/view");

var _transform = require("markmap-lib/dist/transform");

window.markmap_markmap = _view.markmap;
window.markmap_transform = _transform.transform;
// console.log(_view.markmap);
// console.log(_transform.transform);

},{"markmap-lib/dist/transform":530,"markmap-lib/dist/view":534}]},{},[536]);
