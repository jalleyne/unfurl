'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lodash = _interopDefault(require('lodash.get'));
var lodash$1 = _interopDefault(require('lodash.set'));
var lodash$2 = _interopDefault(require('lodash.camelcase'));
var nodeFetch = _interopDefault(require('node-fetch'));
var htmlparser2 = _interopDefault(require('htmlparser2'));
var debug = _interopDefault(require('debug'));
var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _slicedToArray = _interopDefault(require('babel-runtime/helpers/slicedToArray'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));

var ogp = ['og:title', 'og:type', 'og:image', 'og:image:url', 'og:image:secure_url', 'og:image:width', 'og:image:height', 'og:image:type', 'og:url', 'og:audio', 'og:audio:url', 'og:audio:secure_url', 'og:audio:type', 'og:description', 'og:determiner', 'og:locale', 'og:locale:alternate', 'og:site_name', 'og:video', 'og:video:url', 'og:video:secure_url', 'og:video:width', 'og:video:height', 'og:video:type', 'og:video:tag'];

var twitter = ['twitter:url', 'twitter:card', 'twitter:site', 'twitter:site:id', 'twitter:creator', 'twitter:creator:id', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:src', 'twitter:image:height', 'twitter:image:width', 'twitter:image:alt', 'twitter:player', 'twitter:player:width', 'twitter:player:height', 'twitter:player:stream', 'twitter:player:stream:content_type', 'twitter:app:name:iphone', 'twitter:app:id:iphone', 'twitter:app:url:iphone', 'twitter:app:name:ipad', 'twitter:app:id:ipad', 'twitter:app:url:ipad', 'twitter:app:name:googleplay', 'twitter:app:id:googleplay', 'twitter:app:url:googleplay', 'twitter:label1', 'twitter:data1', 'twitter:label2', 'twitter:data2'];

var oembed = ['type', 'version', 'title', 'author_name', 'author_url', 'provider_name', 'provider_url', 'cache_age', 'thumbnail_url', 'thumbnail_width', 'thumbnail_height', 'url', 'html', 'width', 'height'];

var unfurl = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(url) {
    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var pkgOpts, fetchOpts, metadata, oembedData, unwind, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _ref2, _ref3, k, v, camelKey;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pkgOpts = {
              ogp: lodash(init, 'ogp', true),
              twitter: lodash(init, 'twitter', true),
              oembed: lodash(init, 'oembed', true),
              other: lodash(init, 'other', true)
            };
            fetchOpts = {
              timeout: lodash(init, 'timeout', 2000),
              follow: lodash(init, 'follow', 5),
              compress: lodash(init, 'compress', true)
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
            return nodeFetch(metadata.oembed, fetchOpts).then(function (res) {
              return res.json();
            });

          case 8:
            oembedData = _context.sent;
            unwind = lodash(oembedData, 'body', oembedData);

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
            _ref3 = _slicedToArray(_ref2, 2);
            k = _ref3[0];
            v = _ref3[1];
            camelKey = lodash$2(k);

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
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(url, pkgOpts, fetchOpts) {
    var _this = this;

    var pkg;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            pkg = Object.create(null);
            return _context3.abrupt('return', new Promise(function () {
              var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(resolve, reject) {
                var parserStream, res, onopentagname, onerror, ontext, onopentag, onclosetag;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        onclosetag = function onclosetag(tag) {
                          debug$1('</' + tag + '>');

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

                          debug$1(prop + '=' + val);

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
                            lodash$1(pkg, 'other.title', lodash(pkg, 'other.title', '') + text);
                          }
                        };

                        onerror = function onerror(err) {
                          debug$1('error', err);
                          reject(err);
                        };

                        onopentagname = function onopentagname(tag) {
                          debug$1('<' + tag + '>');

                          this._tagname = tag;
                        };

                        parserStream = new htmlparser2.WritableStream({
                          onopentag,
                          ontext,
                          onclosetag,
                          onerror,
                          onopentagname
                        }, { decodeEntities: true });
                        _context2.next = 8;
                        return nodeFetch(url, fetchOpts).then(function (res) {
                          return res.body;
                        });

                      case 8:
                        res = _context2.sent;


                        res.pipe(parserStream);

                        res.on('response', function (_ref6) {
                          var headers = _ref6.headers;

                          var contentType = lodash(headers, 'content-type', '');

                          // Abort if content type is not text/html or varient
                          if (!contentType.includes('html')) {
                            res.unpipe(parserStream);
                            parserStream.destroy();
                            res.destroy();
                            parserStream._parser.reset(); // Parse as little as possible.
                            lodash$1(pkg, 'other._type', contentType);
                          }
                        });

                        res.on('end', function () {
                          debug$1('parsed');
                          resolve(pkg);
                        });

                        res.on('error', function (err) {
                          debug$1('parse error', err.message);
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

var debug$1 = debug('unfurl');

var shouldRollup = ['og:image', 'twitter:image', 'twitter:player', 'og:video', 'og:audio'];

function rollup(target, name, val) {
  if (!name || !val) return;

  var rollupAs = shouldRollup.find(function (k) {
    return name.startsWith(k);
  });

  if (rollupAs) {
    var namePart = name.slice(rollupAs.length);
    var _prop = !namePart ? 'url' : lodash$2(namePart);
    rollupAs = lodash$2(rollupAs);

    target = target[rollupAs] || (target[rollupAs] = [{}]);

    var last = target[target.length - 1];
    last = last[_prop] ? target.push({}) && target[target.length - 1] : last;
    last[_prop] = val;

    return;
  }

  var prop = lodash$2(name);
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

      var val = lodash(obj, key);
      if (!val) continue;

      val = val.sort(function (a, b) {
        return a.width - b.width;
      }); // asc sort

      lodash$1(obj, key, val);
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

var unfurl_1 = unfurl;

module.exports = unfurl_1;
