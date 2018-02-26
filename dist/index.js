(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var unfurl = function () {
  var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var pkgOpts, fetchOpts, metadata, oembedData, unwind, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _ref2, _ref3, k, v, camelKey;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pkgOpts = {
              ogp: get$1(init, 'ogp', true),
              twitter: get$1(init, 'twitter', true),
              oembed: get$1(init, 'oembed', true),
              other: get$1(init, 'other', true)
            };
            fetchOpts = {
              timeout: get$1(init, 'timeout', 2000),
              follow: get$1(init, 'follow', 5),
              compress: get$1(init, 'compress', true)
            };
            _context.next = 4;
            return scrape(url, pkgOpts, fetchOpts).then(postProcess);

          case 4:
            metadata = _context.sent;

            if (!(pkgOpts.oembed && metadata.oembed)) {
              _context.next = 42;
              break;
            }

            _context.next = 8;
            return fetch(metadata.oembed, fetchOpts).then(function (res) {
              return res.json();
            });

          case 8:
            oembedData = _context.sent;
            unwind = get$1(oembedData, 'body', oembedData);

            // Even if we don't find valid oembed data we'll return an obj rather than the url string

            metadata.oembed = {};

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 14;
            _iterator = Object.entries(unwind)[Symbol.iterator]();

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 28;
              break;
            }

            _ref2 = _step.value;
            _ref3 = slicedToArray(_ref2, 2);
            k = _ref3[0];
            v = _ref3[1];
            camelKey = camelCase(k);

            if (oembed.includes(camelKey)) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('continue', 25);

          case 24:

            metadata.oembed[camelKey] = v;

          case 25:
            _iteratorNormalCompletion = true;
            _context.next = 16;
            break;

          case 28:
            _context.next = 34;
            break;

          case 30:
            _context.prev = 30;
            _context.t0 = _context['catch'](14);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 34:
            _context.prev = 34;
            _context.prev = 35;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 37:
            _context.prev = 37;

            if (!_didIteratorError) {
              _context.next = 40;
              break;
            }

            throw _iteratorError;

          case 40:
            return _context.finish(37);

          case 41:
            return _context.finish(34);

          case 42:
            return _context.abrupt('return', metadata);

          case 43:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[14, 30, 34, 42], [35,, 37, 41]]);
  }));

  return function unfurl(_x2) {
    return _ref.apply(this, arguments);
  };
}();

var scrape = function () {
  var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(url, pkgOpts, fetchOpts) {
    var _this = this;

    var pkg;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            pkg = Object.create(null);
            return _context3.abrupt('return', new Promise(function () {
              var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(resolve, reject) {
                var parserStream, res, onopentagname, onerror, ontext, onopentag, onclosetag;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        onclosetag = function onclosetag(tag) {
                          debug('</' + tag + '>');

                          this._tagname = '';

                          if (tag === 'head') {
                            res.unpipe(parserStream);
                            parserStream.destroy();
                            res.destroy();
                            parserStream._parser.reset(); // Parse as little as possible.
                          }
                        };

                        onopentag = function onopentag(name, attr) {
                          var prop = attr.property || attr.name || attr.rel;
                          var val = attr.content || attr.value || attr.href;

                          if (!prop) return;

                          debug(prop + '=' + val);

                          if (pkgOpts.oembed && attr.type === 'application/json+oembed') {
                            pkg.oembed = attr.href;
                            return;
                          }

                          if (!val) return;

                          var target = void 0;

                          if (pkgOpts.ogp && ogp.includes(prop)) {
                            target = pkg.ogp || (pkg.ogp = {});
                          } else if (pkgOpts.twitter && twitter.includes(prop)) {
                            target = pkg.twitter || (pkg.twitter = {});
                          } else {
                            target = pkg.other || (pkg.other = {});
                          }

                          rollup(target, prop, val);
                        };

                        ontext = function ontext(text) {
                          if (this._tagname === 'title' && pkgOpts.other) {
                            set$1(pkg, 'other.title', get$1(pkg, 'other.title', '') + text);
                          }
                        };

                        onerror = function onerror(err) {
                          debug('error', err);
                          reject(err);
                        };

                        onopentagname = function onopentagname(tag) {
                          debug('<' + tag + '>');

                          this._tagname = tag;
                        };

                        parserStream = new htmlparser2.WritableStream({
                          onopentag: onopentag,
                          ontext: ontext,
                          onclosetag: onclosetag,
                          onerror: onerror,
                          onopentagname: onopentagname
                        }, { decodeEntities: true });
                        _context2.next = 8;
                        return fetch(url, fetchOpts).then(function (res) {
                          return res.body;
                        });

                      case 8:
                        res = _context2.sent;


                        res.pipe(parserStream);

                        res.on('response', function (_ref6) {
                          var headers = _ref6.headers;

                          var contentType = get$1(headers, 'content-type', '');

                          // Abort if content type is not text/html or varient
                          if (!contentType.includes('html')) {
                            res.unpipe(parserStream);
                            parserStream.destroy();
                            res.destroy();
                            parserStream._parser.reset(); // Parse as little as possible.
                            set$1(pkg, 'other._type', contentType);
                          }
                        });

                        res.on('end', function () {
                          debug('parsed');
                          resolve(pkg);
                        });

                        res.on('error', function (err) {
                          debug('parse error', err.message);
                          reject(err);
                        });

                      case 13:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function (_x6, _x7) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function scrape(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var get$1 = require('lodash.get');
var set$1 = require('lodash.set');
var camelCase = require('lodash.camelcase');

var fetch = require('node-fetch');
var htmlparser2 = require('htmlparser2');

var ogp = require('./lib/ogp');
var twitter = require('./lib/twitter');
var oembed = require('./lib/oembed');

var debug = require('debug')('unfurl');

var shouldRollup = ['og:image', 'twitter:image', 'twitter:player', 'og:video', 'og:audio'];

function rollup(target, name, val) {
  if (!name || !val) return;

  var rollupAs = shouldRollup.find(function (k) {
    return name.startsWith(k);
  });

  if (rollupAs) {
    var namePart = name.slice(rollupAs.length);
    var _prop = !namePart ? 'url' : camelCase(namePart);
    rollupAs = camelCase(rollupAs);

    target = target[rollupAs] || (target[rollupAs] = [{}]);

    var last = target[target.length - 1];
    last = last[_prop] ? target.push({}) && target[target.length - 1] : last;
    last[_prop] = val;

    return;
  }

  var prop = camelCase(name);
  target[prop] = val;
}

function postProcess(obj) {

  var keys = ['ogp.ogImage', 'twitter.twitterImage', 'twitter.twitterPlayer', 'ogp.ogVideo'];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      var val = get$1(obj, key);
      if (!val) continue;

      val = val.sort(function (a, b) {
        return a.width - b.width;
      }); // asc sort

      set$1(obj, key, val);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return obj;
}

module.exports = unfurl;

})));
