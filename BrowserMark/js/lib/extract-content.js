if (typeof ExtractContentJS == 'undefined') {
    var ExtractContentJS = {};
}
if (typeof ExtractContentJS.Lib == 'undefined') {
    ExtractContentJS.Lib = {};
}

ExtractContentJS.Lib.Util = (function() {
    var Util = {};
    Util.BenchmarkTimer = function() {
        var now = function() {
            var d = new Date();
            var t = 0;
            t = d.getHours();
            t = t * 60 + d.getMinutes();
            t = t * 60 + d.getSeconds();
            t = t * 1000 + d.getMilliseconds();
            return t;
        };
        var Timer = function() {
            var self = {
                elapsed: 0
            };
            self.reset = function() {
                self.elapsed = 0;
                return self
            };
            self.start = function() {
                self.msec = now();
                return self
            };
            self.stop = function() {
                self.elapsed += now() - self.msec;
                return self;
            };
            return self.start();
        };

        var self = {
            timers: {}
        };
        self.get = function(name) {
            if (!self.timers[name]) {
                self.timers[name] = new Timer();
            }
            return self.timers[name];
        };
        self.reset = function(name) {
            return self.get(name).reset();
        };
        self.start = function(name) {
            return self.get(name).start();
        };
        self.stop = function(name) {
            return self.get(name).stop();
        };
        return self;
    };
    Util.Token = function(word) {
        var regex = {
            // hiragana: /[あ-んが-ぼぁ-ょゎっー]/,
            hiragana: /[\u3042-\u3093\u304C-\u307C\u3041-\u3087\u308E\u3063\u30FC]/,
            // katakana: /[ア-ンガ-ボァ-ョヮッー]/,
            katakana: /[\u30A2-\u30F3\u30AC-\u30DC\u30A1-\u30E7\u30EE\u30C3\u30FC]/,
            kanji: {
                test: function(w) {
                    // return '一' <= w && w <= '龠' || w === '々';
                    return '\u4E00' <= w && w <= '\u9FA0' || w === '\u3005';
                }
            },
            alphabet: /[a-zA-Z]/,
            digit: /[0-9]/
        };
        var tests = function(w) {
            var match = {};
            for (var r in regex) {
                if (regex[r].test(w)) {
                    match[r] = regex[r];
                }
            }
            return match;
        };
        var self = {
            first: tests(word.charAt(0)),
            last: tests(word.charAt(word.length - 1))
        };
        self.isTokenized = function(prev, next) {
            var p = prev.length ? prev.charAt(prev.length - 1) : '';
            var n = next.length ? next.charAt(0) : '';
            var check = function(w, test) {
                if (w.length) {
                    for (var t in test) {
                        if (test[t].test(w)) return false;
                    }
                }
                return true;
            };
            return check(p, self.first) && check(n, self.last);
        };

        return self;
    };
    Util.inherit = function(child, parent) {
        var obj = child || {};
        for (var prop in parent) {
            if (typeof obj[prop] == 'undefined') {
                obj[prop] = parent[prop];
            }
        }
        return obj;
    };
    Util.countMatch = function(text, regex) {
        return text.split(regex).length - 1;
        //             var n=0;
        //             for (var i=0;;) {
        //                 i = text.search(regex);
        //                 if (i < 0) break;
        //                 n++;
        //                 text = text.substr(i+1);
        //             }
        //             return n;
    };
    Util.countMatchTokenized = function(text, word) {
        var count = 0;
        var prev = null;
        var tok = new Util.Token(word);
        var texts = text.split(word);
        var len = texts.length;
        for (var i = 0; i < len; i++) {
            if (prev && tok.isTokenized(prev, texts[i])) count++;
            prev = texts[i]
        }
        return count;
    };
    Util.indexOfTokenized = function(text, word) {
        var index = text.indexOf(word);
        if (index >= 0) {
            var tok = new Util.Token(word);
            var p = index > 1 ? text.substr(index - 1, 1) : '';
            var n = text.substr(index + word.length, 1);
            if (tok.isTokenized(p, n)) {
                return index;
            }
        }
        return -1;
    };
    Util.dump = function(obj) {
        if (typeof obj == 'undefined') return 'undefined';
        if (typeof obj == 'string') return '"' + obj + '"';
        if (typeof obj != 'object') return '' + obj;
        if (obj === null) return 'null';
        if (obj instanceof Array) {
            return '[' + obj.map(function(v) {
                return 'obj' /*Util.dump(v)*/
                ;
            }).join(',') + ']';
        } else {
            var arr = [];
            for (var prop in obj) {
                arr.push(prop + ':' + 'obj' /*Util.dump(obj[prop])*/ );
            }
            return '{' + arr.join(',') + '}';
        }
    };
    return Util;
})();

ExtractContentJS.Lib.A = (function() {
    var A = {};
    A.indexOf = Array.indexOf || function(self, elt /*, from*/ ) {
        var argi = 2;
        var len = self.length;
        var from = Number(arguments[argi++]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;
        for (; from < len; from++) {
            if (from in self && self[from] === elt) return from;
        }
        return -1;
    };
    A.filter = Array.filter || function(self, fun /*, thisp*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != "function") {
            throw new TypeError('A.filter: not a function');
        }
        var rv = new Array();
        var thisp = arguments[argi++];
        for (var i = 0; i < len; i++) {
            if (i in self) {
                var val = self[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, self)) rv.push(val);
            }
        }
        return rv;
    };
    A.forEach = Array.forEach || function(self, fun /*, thisp*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != 'function') {
            throw new TypeError('A.forEach: not a function');
        }
        var thisp = arguments[argi++];
        for (var i = 0; i < len; i++) {
            if (i in self) fun.call(thisp, self[i], i, self);
        }
    };
    A.every = Array.every || function(self, fun /*, thisp*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != 'function') {
            throw new TypeError('A.every: not a function');
        }
        var thisp = arguments[argi++];
        for (var i = 0; i < len; i++) {
            if (i in self && !fun.call(thisp, self[i], i, self)) {
                return false;
            }
        }
        return true;
    };
    A.map = Array.map || function(self, fun /*, thisp*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != 'function') {
            throw new TypeError('A.map: not a function');
        }
        var rv = new Array(len);
        var thisp = arguments[argi++];
        for (var i = 0; i < len; i++) {
            if (i in self) {
                rv[i] = fun.call(thisp, self[i], i, self);
            }
        }
        return rv;
    };
    A.some = Array.some || function(self, fun /*, thisp*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != "function") {
            throw new TypeError('A.some: not a function');
        }
        var thisp = arguments[argi++];
        for (var i = 0; i < len; i++) {
            if (i in self && fun.call(thisp, self[i], i, self)) {
                return true;
            }
        }
        return false;
    };
    A.reduce = Array.reduce || function(self, fun /*, initial*/ ) {
        var argi = 2;
        var len = self.length;
        if (typeof fun != 'function') {
            throw TypeError('A.reduce: not a function ');
        }
        var i = 0;
        var prev;
        if (arguments.length > argi) {
            var rv = arguments[argi++];
        } else {
            do {
                if (i in self) {
                    rv = self[i++];
                    break;
                }
                if (++i >= len) {
                    throw new TypeError('A.reduce: empty array');
                }
            } while (true);
        }
        for (; i < len; i++) {
            if (i in self) rv = fun.call(null, rv, self[i], i, self);
        }
        return rv;
    };
    A.zip = function(self) {
        if (self[0] instanceof Array) {
            var l = self[0].length;
            var len = self.length;
            var z = new Array(l);
            for (var i = 0; i < l; i++) {
                z[i] = [];
                for (var j = 0; j < len; j++) {
                    z[i].push(self[j][i]);
                }
            }
            return z;
        }
        return [];
    };
    A.first = function(self) {
        return self ? self[0] : null;
    };
    A.last = function(self) {
        return self ? self[self.length - 1] : null;
    };
    A.push = function(self, other) {
        return Array.prototype.push.apply(self, other);
    };
    return A;
})();

ExtractContentJS.Lib.DOM = (function() {
    var A = ExtractContentJS.Lib.A;
    var DOM = {};
    DOM.getElementStyle = function(elem, prop) {
        var style = elem.style ? elem.style[prop] : null;
        if (!style) {
            var dv = elem.ownerDocument.defaultView;
            if (dv && dv.getComputedStyle) {
                try {
                    var styles = dv.getComputedStyle(elem, null);
                } catch (e) {
                    return null;
                }
                prop = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                style = styles ? styles.getPropertyValue(prop) : null;
            } else if (elem.currentStyle) {
                style = elem.currentStyle[prop];
            }
        }
        return style;
    };
    DOM.text = function(node) {
        if (typeof node.textContent != 'undefined') {
            return node.textContent;
        } else if (node.nodeName == '#text') {
            return node.nodeValue;
        } else if (typeof node.innerText != 'undefined') {
            return node.innerText; // IE
        }
        return null;
    };
    DOM.ancestors = function(e) {
        var body = e.ownerDocument.body;
        var r = [];
        var it = e;
        while (it != body) {
            r.push(it);
            it = it.parentNode;
        }
        r.push(body);
        return r; // [e .. document.body]
    };
    DOM.commonAncestor = function(e1, e2) {
        var a1 = DOM.ancestors(e1).reverse();
        var a2 = DOM.ancestors(e2).reverse();
        var r = null;
        for (var i = 0; a1[i] && a2[i] && a1[i] == a2[i]; i++) {
            r = a1[i];
        }
        return r;
    };
    DOM.countMatchTagAttr = function(node, tag, attr, regexs) {
        var test = function(v) {
            return v.test(node[attr]);
        };
        if ((node.tagName || '').toLowerCase() == tag && A.some(regexs, test)) {
            return 1;
        }
        var n = 0;
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; i++) {
            n += DOM.countMatchTagAttr(children[i], tag, attr, regexs);
        }
        return n;
    };
    DOM.matchTag = function(node, pat) {
        return A.some(pat, function(v) {
            if (typeof v == 'string') {
                try {
                    return v == (node.tagName || '').toLowerCase();
                } catch (e) {
                    return ''
                }
            } else if (v instanceof Array) {
                return v[0] == (node.tagName || '').toLowerCase() && DOM.matchAttr(node, v[1]);
            } else {
                return false;
            }
        });
    };
    DOM.matchAttr = function(node, pat) {
        var test = function(pat, val) {
            if (typeof pat == 'string') {
                return pat == val;
            } else if (pat instanceof RegExp) {
                return pat.test(val);
            } else if (pat instanceof Array) {
                return A.some(pat, function(v) {
                    return test(v, val);
                });
            } else if (pat instanceof Object) {
                for (var prop in pat) {
                    var n = node[prop];
                    if (n && DOM.matchAttr(n, pat[prop])) {
                        return true;
                    }
                }
            }
            return false;
        };
        for (var prop in pat) {
            var attr = node[prop];
            var ar = pat[prop];
            if (attr) {
                return test(ar, attr);
            }
        }
        return false;
    };
    DOM.matchStyle = function(node, pat) {
        var test = function(pat, val) {
            if (typeof pat == 'string') {
                return pat == val;
            } else if (pat instanceof RegExp) {
                return pat.test(val);
            } else if (pat instanceof Array) {
                return A.some(pat, function(v) {
                    return test(v, val);
                });
            }
            return false;
        };
        for (var prop in pat) {
            if (test(pat[prop], DOM.getElementStyle(node, prop))) {
                return true;
            }
        }
        return false;
    };
    return DOM;
})();

if (typeof ExtractContentJS == 'undefined') {
    var ExtractContentJS = {};
}

(function(ns) {
    var Util = ns.Lib.Util;
    var A = ns.Lib.A;
    var DOM = ns.Lib.DOM;

    var Leaf = Util.inherit(function(node /*, depth, inside, limit*/ ) {
        var depth = arguments[1] || 0;
        var inside = arguments[2] || {};
        var limit = arguments[3] || 1048576;
        var leaf = {
            node: node,
            depth: depth,
            inside: inside
        };

        leaf.statistics = function() {
            var t = (DOM.text(node) || '').replace(/\s+/g, ' ');
            var l = t.length;
            return {
                text: t.substr(0, limit),
                noLinkText: (inside.link || inside.form) ? '' : t,
                listTextLength: inside.list ? l : 0,
                noListTextLength: inside.list ? 0 : l,
                linkCount: inside.link ? 1 : 0,
                listCount: inside.li ? 1 : 0,
                linkListCount: (inside.li && inside.link) ? 1 : 0
            };
        };

        return leaf;
    }, {
        commonAncestor: function( /* leaves */ ) {
            var ar = A.map(arguments, function(v) {
                return v.node;
            });
            if (ar.length < 2) {
                return ar[0];
            }
            return A.reduce(ar, function(prev, curr) {
                return DOM.commonAncestor(prev, curr);
            });
        },
        mergeStatistics: function(a, b) {
            var r = {};
            for (var prop in a) {
                r[prop] = a[prop] + b[prop];
            }
            return r;
        }
    });

    var Block = function(leaves) {
        leaves = A.filter(leaves, function(v) {
            var s = DOM.text(v.node) || '';
            s = s.replace(/\s+/g, '');
            return s.length != 0;
        });
        var block = {
            score: 0,
            leaves: leaves
        };
        block.commonAncestor = function() {
            return Leaf.commonAncestor.apply(null, block.leaves);
        };
        return block;
    };

    var Content = function(c) {
        var self = {
            _content: c
        };

        self.asLeaves = function() {
            return self._content;
        };
        self.asNode = function() {
            if (self._node) return self._node;
            self._node = Leaf.commonAncestor.apply(null, self._content);
            return self._node;
        };
        self.asTextFragment = function() {
            if (self._textFragment) return self._textFragment;
            if (self._content.length < 1) return '';
            self._textFragment = A.reduce(self._content, function(prev, curr) {
                var s = DOM.text(curr.node);
                s = s.replace(/^\s+/g, '').replace(/\s+$/g, '');
                s = s.replace(/\s+/g, ' ');
                return prev + s;
            }, '');
            return self._textFragment;
        };
        self.asText = function() {
            if (self._text) return self._text;
            // covering node
            var node = self.asNode();
            self._text = node ? DOM.text(node) : '';
            return self._text;
        };
        self.toString = function() {
            return self.asTextFragment();
        };

        return self;
    };

    ns.LayeredExtractor = function( /* handler, filter */ ) {
        var self = {
            handler: arguments[0] || [],
            filter: arguments[1] || {}
        };

        self.factory = {
            getHandler: function(name) {
                if (typeof ns.LayeredExtractor.Handler != 'undefined') {
                    return new ns.LayeredExtractor.Handler[name];
                }
                return null;
            }
        };

        self.addHandler = function(handler) {
            if (typeof handler != 'undefined') {
                self.handler.push(handler);
            }
            return self;
        };

        self.filterFor = function(url) {
            // TODO
        };

        self.extract = function(d) {
            var url = d.location.href;
            var res = {
                title: d.title,
                url: d.location.href
            };
            var len = self.handler.length;
            for (var i = 0; i < len; i++) {
                var content = self.handler[i].extract(d, url, res);
                if (!content) continue;

                var f = self.filterFor(url);
                if (f) {
                    content = f.filter(content);
                }

                content = new Content(content);
                if (!content.toString().length) continue;
                res.content = content;
                res.isSuccess = true;
                res.engine = res.engine || self.handler[i];
                break;
            }
            return res;
        };

        return self;
    };
    ns.LayeredExtractor.Handler = {};

    ns.LayeredExtractor.Handler.Heuristics = function( /*option, pattern*/ ) {
        var self = {
            name: 'Heuristics',
            content: [],
            opt: Util.inherit(arguments[0], {
                threshold: 180,
                minLength: 150,
                factor: {
                    decay: 0.75,
                    noBody: 0.72,
                    continuous: 1.16 //1.62
                },
                punctuationWeight: 10,
                minNoLink: 8,
                noListRatio: 0.2,
                limit: {
                    leaves: 800,
                    recursion: 20,
                    text: 1048576
                },
                debug: false
            }),
            pat: Util.inherit(arguments[1], {
                sep: [
                    'div', 'center', 'td',
                    'h1', 'h2'],
                waste: [
                    /Copyright|All\s*Rights?\s*Reserved?/i],
                affiliate: [
                    /amazon[a-z0-9\.\/\-\?&]+-22/i],
                list: ['ul', 'dl', 'ol'],
                li: ['li', 'dd'],
                a: ['a'],
                form: ['form'],
                noContent: ['frameset'],
                ignore: [
                    'iframe',
                //'img',
                'script',
                    'style',
                    'select',
                    'noscript', ['div', {
                    id: [/more/, /menu/, /side/, /navi/, /foot/],
                    className: [/more/, /menu/, /side/, /navi/, /foot/]
                }]],
                ignoreStyle: {
                    display: 'none',
                    visibility: 'hidden'
                },
                // punctuations: /[。、．，！？]|\.[^A-Za-z0-9]|,[^0-9]|!|\?/
                punctuations: /[\u3002\u3001\uFF0E\uFF0C\uFF01\uFF1F]|\.[^A-Za-z0-9]|,[^0-9]|!|\?/
            })
        };

        var MyBlock = Util.inherit(function(leaves) {
            var block = new Block(leaves);

            block.eliminateLinks = function() {
                var st = A.map(block.leaves, function(v) {
                    return v.statistics();
                });
                if (!st.length) return '';
                if (st.length == 1) {
                    st = st[0];
                } else {
                    st = A.reduce(st, function(prev, curr) {
                        return Leaf.mergeStatistics(prev, curr);
                    });
                }
                var nolinklen = st.noLinkText.length;
                var links = st.linkCount;
                var listlen = st.listTextLength;
                if (nolinklen < self.opt.minNoLink * links) {
                    return '';
                }

                // isLinklist
                var rate = st.linkListCount / (st.listCount || 1);
                rate *= rate;
                var limit = self.opt.noListRatio * rate * listlen;
                if (nolinklen < limit) {
                    return '';
                }

                return st.noLinkText;
            };
            block.noBodyRate = function() {
                var val = 0;
                if (block.leaves.length > 0) {
                    val += A.reduce(block.leaves, function(prev, curr) {
                        return prev + DOM.countMatchTagAttr(curr.node, 'a', 'href',
                        self.pat.affiliate);
                    }, 0);
                }
                val /= 2.0;
                val += A.reduce(self.pat.waste, function(prev, curr) {
                    return prev + Util.countMatch(block._nolink, curr);
                }, 0);
                return val;
            };

            block.calcScore = function(factor, continuous) {
                // ignore link list block
                block._nolink = block.eliminateLinks();
                if (block._nolink.length < self.opt.minLength) return 0;

                var c = Util.countMatch(block._nolink, self.pat.punctuations);
                c *= self.opt.punctuationWeight;
                c += block._nolink.length;
                c *= factor;

                // anti-scoring factors
                var noBodyRate = block.noBodyRate();

                // scores
                c *= Math.pow(self.opt.factor.noBody, noBodyRate);
                block._c = block.score = c;
                block._c1 = c * continuous;
                return c;
            };

            block.isAccepted = function() {
                return block._c > self.opt.threshold;
            };

            block.isContinuous = function() {
                return block._c1 > self.opt.threshold;
            };

            block.merge = function(other) {
                block.score += other._c1;
                block.depth = Math.min(block.depth, other.depth);
                A.push(block.leaves, other.leaves);
                return block;
            };

            return block;
        }, {
            split: function(node) {
                var r = [];
                var buf = [];
                var leaves = 0;
                //mark note
                var limit = self.opt.limit.text;

                var flush = function(flag) {
                    if (flag && buf.length) {
                        r.push(new MyBlock(buf));
                        buf = [];
                    }
                };

                var rec = function(node, depth, inside) {
                    // depth-first recursion
                    if (leaves >= self.opt.limit.leaves) return r;
                    if (depth >= self.opt.limit.recursion) return r;
                    if (node.nodeName == '#comment') return r;
                    if (DOM.matchTag(node, self.pat.ignore)) return r;
                    if (DOM.matchStyle(node, self.pat.ignoreStyle)) return r;
                    var children = node.childNodes;
                    var sep = self.pat.sep;
                    var len = children.length;
                    var flags = {
                        form: inside.form || DOM.matchTag(node, self.pat.form),
                        link: inside.link || DOM.matchTag(node, self.pat.a),
                        list: inside.list || DOM.matchTag(node, self.pat.list),
                        li: inside.li || DOM.matchTag(node, self.pat.li)
                    };
                    for (var i = 0; i < len; i++) {
                        var c = children[i];
                        var f = DOM.matchTag(c, sep);
                        flush(f);
                        rec(c, depth + 1, flags);
                        flush(f);
                    }
                    if (!len) {
                        leaves++;
                        buf.push(new Leaf(node, depth, flags, limit));
                    }
                    return r;
                };

                rec(node, 0, {});
                flush(true);
                return r;
            }
        });

        self.extract = function(d /*, url, res*/ ) {
            var isNoContent = function(v) {
                return d.getElementsByTagName(v).length != 0;
            };
            if (A.some(self.pat.noContent, isNoContent)) return self;

            var factor = 1.0;
            var continuous = 1.0;
            var score = 0;

            var res = [];
            var blocks = MyBlock.split(d.body);
            var last;

            var len = blocks.length;
            for (var i = 0; i < len; i++) {
                var block = blocks[i];
                if (last) {
                    continuous /= self.opt.factor.continuous;
                }

                // score
                if (!block.calcScore(factor, continuous)) continue;
                factor *= self.opt.factor.decay;

                // clustor scoring
                if (block.isAccepted()) {
                    if (block.isContinuous() && last) {
                        last.merge(block);
                    } else {
                        last = block;
                        res.push(block);
                    }
                    continuous = self.opt.factor.continuous;
                } else { // rejected
                    if (!last) {
                        // do not decay if no block is pushed
                        factor = 1.0
                    }
                }
            }

            self.blocks = res.sort(function(a, b) {
                return b.score - a.score;
            });
            var best = A.first(self.blocks);
            if (best) {
                self.content = best.leaves;
            }

            return self.content;
        };

        return self;
    };

    ns.LayeredExtractor.Handler.GoogleAdSection = function( /*opt*/ ) {
        var self = {
            name: 'GoogleAdSection',
            content: [],
            state: [],
            opt: Util.inherit(arguments[0], {
                limit: {
                    leaves: 800,
                    recursion: 20
                },
                debug: false
            })
        };

        var pat = {
            ignore: /google_ad_section_start\(weight=ignore\)/i,
            section: /google_ad_section_start/i,
            end: /google_ad_section_end/i
        };
        var stIgnore = 1;
        var stSection = 2;

        self.inSection = function() {
            return A.last(self.state) == stSection;
        };
        self.ignore = function() {
            self.state.push(stIgnore);
        }
        self.section = function() {
            self.state.push(stSection);
        }
        self.end = function() {
            if (self.state.length) self.state.pop();
        };
        self.parse = function(node /*, depth*/ ) {
            var depth = arguments[1] || 0;
            if (node.nodeName == '#comment') {
                if (pat.ignore.test(node.nodeValue)) {
                    self.ignore();
                } else if (pat.section.test(node.nodeValue)) {
                    self.section();
                } else if (pat.end.test(node.nodeValue)) {
                    self.end();
                }
                return;
            }

            if (self.content.length >= self.opt.limit.leaves) return;
            if (depth >= self.opt.limit.recursion) return;
            var children = node.childNodes;
            var len = children.length;
            for (var i = 0; i < len; i++) {
                var c = children[i];
                self.parse(c, depth + 1);
            }
            if (!len && self.inSection()) {
                self.content.push(new Leaf(node, depth));
            }
            return;
        };

        self.extract = function(d /*, url, res*/ ) {
            self.parse(d);
            self.blocks = [new Block(self.content)];
            return self.content;
        };

        return self;
    };
})(ExtractContentJS);