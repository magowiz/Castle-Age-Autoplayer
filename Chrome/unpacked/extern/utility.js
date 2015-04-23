/*!
 * Utility v0.2.3
 * http://code.google.com/p/utility-js/
 *
 * Developed by:
 * - Xotic750
 *
 * GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
 */

/*jslint sub: true, white: true, browser: true, devel: true, undef: true, nomen: true, bitwise: true, plusplus: true, immed: true, regexp: true, eqeqeq: true, newcap: true, onevar: true, maxerr: 50, maxlen: 280, indent: 4 */
/*global window,jQuery,GM_getValue,GM_setValue,GM_deleteValue,GM_listValues,localStorage,sessionStorage,rison */
/*jslint maxlen: 310 */

////////////////////////////////////////////////////////////////////
//                          utility library
// Small functions called a lot to reduce duplicate code
/////////////////////////////////////////////////////////////////////

(function () {
    var uversion = "0.2.3",
        is_chrome = false,
        is_firefox = false,
        is_opera = false,
        chrome_major_version = 0,
        firefox_major_version = 0,
        utility_ref = window['utility'],
        $u_ref = window['$u'],
        owl,
        JSON2 = {},
        RISON = {},
        utility = {},
        internal,
        /**
         * Base64 characters
         * @const
         * @type {string}
         * @private
         */
        b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        /**
         * JSON unicode character escape sequences
         * @const
         * @type {RegExp}
         * @private
         */
        cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        /**
         * JSON safe escape sequences
         * @const
         * @type {RegExp}
         * @private
         */
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        /**
         * JSON table of character substitutions
         * @const
         * @type {Object.<string, string>}
         * @private
         */
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep,
        /**
         * @const
         * @type {Object.<string, string>}
         * @private
         */
        class2type = {
            "[object Boolean]"  : 'boolean',
            "[object Number]"   : 'number',
            "[object String]"   : 'string',
            "[object Function]" : 'function',
            "[object Array]"    : 'array',
            "[object Date]"     : 'date',
            "[object RegExp]"   : 'regexp',
            "[object Object]"   : 'object'
        },
        inheriting = {},
        isArray,
        storageTypes = {},
        inputTypes = {},
        mutationTypes = {};

    ///////////////////////////
    //       Object
    ///////////////////////////

    if (!('create' in Object)) {
        Object['create'] = (function () {
            // created only once
            function F() {}
            return function (o) {
                // reused on each invocation
                F.prototype = o;
                return new F();
            };
        }());
    }

    //////////////////////////////////////////////////////
    //                   noConflict
    // To resolve library conflicts
    //////////////////////////////////////////////////////

    /**
     * To resolve library conflicts
     * @param {boolean} deep Flag that specifies the depth of conflict resolution.
     * @return {!Object} The utility object
     */
    function noConflict(deep) {
        if (window['$u'] === utility) {
            window['$u'] = $u_ref;
        }

        if (deep && window['utility'] === utility) {
            window['utility'] = utility_ref;
        }

        return utility;
    }

    /**
     * ui32
     * @const
     * @param {number} n
     * @return {number}
     * @private
     */
    function ui32(n) {
        n = isFinite(n) ? Math.floor(n) : 0;
        return n >= 0 ? n : 0;
    }

    ///////////////////////////
    //       Function
    ///////////////////////////

    if (!('swiss' in Function.prototype)) {
        Function.prototype['swiss'] = function (parent) {
            var l = ui32(arguments.length),
                i = 1,
                n;

            for (i = 1; i < l; i += 1) {
                n = arguments[i];
                this.prototype[n] = parent.prototype[n];
            }

            return this;
        };
    }

    /**
     * typeOf
     * @const
     * @param {*} o
     * @return {string}
     * @private
     */
    function typeOf(o) {
        return o === null || o === undefined ? String(o) : class2type[Object.prototype.toString.call(o)] || "object";
    }

    /**
     * isArray
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    isArray = Array.isArray || function (o) {
        return typeOf(o) === 'array';
    };

    /**
     * isObject
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isObject(o) {
        return typeOf(o) === 'object';
    }

    /**
     * isWindow
     * A crude way of determining if an object is a window
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isWindow(o) {
        return o && isObject(o) && "setInterval" in o;
    }

    /**
     * isBoolean
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isBoolean(o) {
        return typeOf(o) === 'boolean';
    }

    /**
     * isFunction
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isFunction(o) {
        return typeOf(o) === 'function';
    }

    /**
     * isDate
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isDate(o) {
        return typeOf(o) === 'date';
    }

    /**
     * isRegExp
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isRegExp(o) {
        return typeOf(o) === 'regexp';
    }

    /**
     * isNumber
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isNumber(o) {
        return typeOf(o) === 'number';
    }

    /**
     * isString
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isString(o) {
        return typeOf(o) === 'string';
    }

    /**
     * isUndefined
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isUndefined(o) {
        return typeOf(o) === 'undefined';
    }

    /**
     * isNull
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isNull(o) {
        return typeOf(o) === 'null';
    }

    /**
     * isDefined
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isDefined(o) {
        return !isUndefined(o) && !isNull(o);
    }

    /**
     * isNaN2
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isNaN2(o) {
        return !isDefined(o) || !/\d/.test(o) || isNaN(o);
    }

    /**
     * isPlainObject
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isPlainObject(o) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!o || !isObject(o) || o.nodeType || isWindow(o)) {
            return false;
        }

        // Not own constructor property must be Object
        if (o.constructor && !Object.prototype.hasOwnProperty.call(o, "constructor") && !Object.prototype.hasOwnProperty.call(o.constructor.prototype, "isPrototypeOf")) {
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        var key;
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                continue;
            }
        }

        return isUndefined(key) || Object.prototype.hasOwnProperty.call(o, key);
    }

    /**
     * isEmptyObject
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function isEmptyObject(o) {
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Library error catcher
     * @param {boolean} deep Flag that specifies the depth of conflict resolution.
     * @return {!Object} The utility object
     */
    function throwError(ref, error) {
        ref = isString(ref) ? ref + ": " : "";
        if (ui32(arguments.length) > 2) {
            internal['error'](ref + error, Array.prototype.slice.call(arguments, 2));
        } else {
            internal['error'](ref + error);
        }

        throw error;
    }

    /**
     * canCall
     * @const
     * @param {Function} fn
     * @private
     */
    function canCall(fn) {
        if (!isFunction(fn)) {
            throwError(new TypeError(fn + " is not a function"));
        }
    }

    /**
     * Find the number of entries in an object (also works on arrays)
     * @const
     * @param {(Object|Array)} obj
     * @return {number}
     * @private
     */
    function lengthOf(obj) {
        if (isArray(obj)) {
            return ui32(obj.length);
        } else if (isPlainObject(obj)) {
            var l = 0,
                i;

            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    l += 1;
                }
            }

            return l;
        }

        return 0;
    }

    /**
     * Compare two unknown variables, and return if they are functionally the same (ignoring order of object keys etc)
     * @const
     * @param {*} left The left-hand variable
     * @param {*} right The right-hand variable
     * @return {boolean}
     * @private
     */
    function compare(left, right) {
        var i;
        if (typeOf(left) !== typeOf(right)) {
            return false;
        }

        switch (typeOf(left)) {
        case "object":
            if (lengthOf(left) !== lengthOf(right)) {
                return false;
            }

            for (i in left) {
                if (left.hasOwnProperty(i)) {
                    if (!right.hasOwnProperty(i) || !compare(left[i], right[i])) {
                        return false;
                    }
                }
            }

            for (i in right) {
                if (right.hasOwnProperty(i) && !left.hasOwnProperty(i)) {
                    return false;
                }
            }

            break;
        case "array":
            i = ui32(left.length);
            if (i !== ui32(right.length)) {
                return false;
            }

            i -= 1;
            while (i >= 0) {
                if (!compare(left[i], right[i])) {
                    return false;
                }

                i -= 1;
            }

            break;
        default:
            return left === right;
        }

        return true;
    }

    /**
     * hasContent
     * @const
     * @param {*} o
     * @return {boolean}
     * @private
     */
    function hasContent(o) {
        var h = false;
        switch (typeOf(o)) {
        case "string":
            h = ui32(o.length) ? true : false;
            break;
        case "number":
            h = true;
            break;
        case "object":
            h = isDefined(o.length) ? (ui32(o.length) ? true : false): !isEmptyObject(o);
            break;
        case "array":
            h = ui32(o.length) ? true : false;
            break;
        case "boolean":
            h = true;
            break;
        case "function":
            h = true;
            break;
        case "regexp":
            h = true;
            break;
        case "date":
            h = true;
            break;
        default:
        }

        return h;
    }

    /**
     * setContent
     * @const
     * @param {*} o
     * @param {*} v
     * @return {*}
     * @private
     */

	 function setContent() {
		for (var i = 0; i < arguments.length - 1; i += 1) {
			if (hasContent(arguments[i])) {
				return arguments[i];
			}
		}
		return arguments[i];
    }

    /**
     * extend
     * @const
     * @return {Object}
     * @private
     */
    function extend() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = ui32(arguments.length),
            deep = false;

        // Handle a deep copy situation
        if (isBoolean(target)) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (!isObject(target) && !isFunction(target)) {
            target = {};
        }

        /*
        // extend utility itself if only one argument is passed
        if (length === i) {
            target = utility;
            i -= 1;
        }
        */

        for (; i < length; i += 1) {
            // Only deal with non-null/undefined values
            options = arguments[i];
            if (isDefined(options)) {
                // Extend the base object
                for (name in options) {
                    if (options.hasOwnProperty(name)) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        copyIsArray = isArray(copy);
                        if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && isArray(src) ? src : [];
                            } else {
                                clone = src && isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = extend(deep, clone, copy);

                        // Don't bring in undefined values
                        } else if (!isUndefined(copy)) {
                            target[name] = copy;
                        }
                    }
                }
            }
        }

        // Return the modified object
        return target;

    }

    function addEvent(obj, type, fn) {
        canCall(fn);
        if (obj.attachEvent) {
            obj['e' + type + fn] = fn;
            obj[type + fn] = function () {
                obj['e' + type + fn](window.event);
            };

            obj.attachEvent('on' + type, obj[type + fn]);
        } else {
            obj.addEventListener(type, fn, false);
        }
    }

    function removeEvent(obj, type, fn) {
        canCall(fn);
        if (obj.detachEvent) {
            obj.detachEvent('on' + type, obj[type + fn]);
            obj[type + fn] = null;
        } else {
            obj.removeEventListener(type, fn, false);
        }
    }

    //////////////////////////////////////////////////////
    //                   mutationTypes
    // Discover which Mutation Event types are available
    //////////////////////////////////////////////////////

    (function (events) {
	try {
        var f = document.createElement('div'),
            c = f['cloneNode'](true),
            n = document.createTextNode("text"),
            e,
            d,
            t;

        function passed(event) {
            mutationTypes[event.type] = true;
        }

        f['id'] = "MET";
        f['style']['display'] = "none";
        document.body.appendChild(f);
        d = document.getElementById(f['id']);

        e = 'DOMNodeInsertedIntoDocument';
        mutationTypes[e] = false;
        addEvent(n, e, passed);
        d.appendChild(n);
        removeEvent(n, e, passed);
        n = null;

        e = 'DOMCharacterDataModified';
        mutationTypes[e] = false;
        t = d['firstChild'];
        addEvent(t, e, passed);
        t.deleteData(0, 2);
        removeEvent(t, e, passed);
        t = null;

        e = 'DOMSubtreeModified';
        mutationTypes[e] = false;
        addEvent(d, e, passed);
        d.innerHTML = "DSM";
        removeEvent(d, e, passed);

        e = 'DOMNodeInserted';
        mutationTypes[e] = false;
        addEvent(d, e, passed);
        d.appendChild(c);
        removeEvent(d, e, passed);

        e = 'DOMNodeRemoved';
        mutationTypes[e] = false;
        addEvent(d, e, passed);
        d.removeChild(c);
        removeEvent(d, e, passed);
        c = null;

        e = 'DOMAttrModified';
        mutationTypes[e] = false;
        addEvent(d, e, passed);
        d['id'] = "DAM";
        removeEvent(d, e, passed);

        e = 'DOMNodeRemovedFromDocument';
        mutationTypes[e] = false;
        addEvent(d, e, passed);
        document.body.removeChild(d);
        removeEvent(d, e, passed);
        d = null;
	}
	
	catch (err) {} 


    }());

    function plural(i) {
        return i === 1 || i === -1 ? '' : 's';
    }

    function injectScript(data, isText, inBody) {
        isText = isText || false;
        inBody = inBody || false;
        var inject = document.createElement('script');
        inject.setAttribute('type', 'text/javascript');
        if (isText) {
            inject.textContent = data;
        } else {
            inject.setAttribute('src', data);
        }

        return inBody ? document.body.appendChild(inject) : (document.head || document.getElementsByTagName('head')[0] || document.documentElement).appendChild(inject);
    }

    function sortBy(reverse, name, minor) {
        return function (o, p) {
            if (isPlainObject(o) && isPlainObject(p) && o && p) {
                var a = o[name],
                    b = p[name];

                if (a === b) {
                    return isFunction(minor) ? minor(o, p) : o;
                }

                if (typeOf(a) === typeOf(b)) {
                    return reverse ? (a < b ? 1 : -1) : (a < b ? -1 : 1);
                }

                return reverse ? (typeOf(a) < typeOf(b) ? 1 : -1) : (typeOf(a) < typeOf(b) ? -1 : 1);
            } else {
                return throwError("sortBy", new TypeError('Expected an object when sorting by ' + name));
            }
        };
    }

    function sortObjectBy(obj, sortfunc, deep) {
        var list   = [],
            output = {},
            i      = 0,
            j      = '',
            len    = 0;

        deep = deep ? deep : false;
        for (j in obj) {
            if (obj.hasOwnProperty(j)) {
                list.push(j);
            }
        }

        list.sort(sortfunc);
        for (i = 0, len = ui32(list.length); i < len; i += 1) {
            output[list[i]] = deep && isPlainObject(obj[list[i]]) ? sortObjectBy(obj[list[i]], sortfunc, deep) : output[list[i]] = obj[list[i]];
        }

        return output;
    }

    function makeTime(time, format) {
        return new Date(time)['format'](format !== undefined && format ? format : 'l g:i a');
    }

    function minutes2hours(num) {
        num = isNaN2(num) ? 0 : num;
        num = isString(num) ? num['parseFloat']() : num;
        var h = Math.floor(num),
            m = Math.floor((num - h) * 60);

        return h + ':' + m['lpad']("0", 2);
    }

    function reload() {
        if ("reload" in window.location) {
            window.location.reload();
        } else if ("history" in window && "go" in window.history) {
            window.history.go(0);
        } else {
            window.location.href = window.location.href;
        }
    }

    //////////////////////////////////////////////////////
    //            Hex an Color helper functions
    //////////////////////////////////////////////////////

    /**
     * Remove the # from the beginning of a string if exists
     * @param {!string} h A hex string
     * @return {string} The cut string
     */
    function cutSharp(h) {
        return hasContent(h) ? (h.charAt(0) === "#" ? h.slice(1) : h) : '';
    }

    /**
     * Add a # to the beginning of a string if not exists already
     * @param {!string} h A hex string
     * @return {string} The prepended string
     */
    function addSharp(h) {
        return h.charAt(0) === "#" ? h : "#" + h;
    }

    /**
     * Convert a hex string to RGB object
     * @param {!string} h A hex string to convert
     * @return {Object} The RGB object
     */
    function hex2rgb(h) {
        h = cutSharp(h);
        h = ui32(h.length) === 3 ? h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2) : h['rpad']('0', 6);

        return {
            'r': h.slice(0, 2)['parseInt'](16),
            'g': h.slice(2, 4)['parseInt'](16),
            'b': h.slice(4, 6)['parseInt'](16)
        };
    }

    /**
     * Calculate a brightness value of a color
     * @param {!string} h A hex string
     * @return {number} The decimal value
     */
    function brightness(h) {
        var rgb = hex2rgb(h);
        return (rgb['r'] * 299 + rgb['g'] * 587 + rgb['b'] * 114) / 1000;
    }

    /**
     * Convert a decimal number to hex string
     * @param {!number} n A decimal number to convert
     * @return {string} The hex string
     */
    function dec2hex(n) {
        return (n < 0 ? 0xFFFFFFFF + n + 1 : n).toString(16).toUpperCase();
    }

    /**
     * Convert a hex string to decimal number
     * @param {!string} h A hex string to convert
     * @return {number} The decimal value
     */
    function hex2dec(h) {
        return cutSharp(h)['parseInt'](16);
    }

    /**
     * Gives us a best composite color
     * @param {!string} h A hex string to compare
     * @param {?string} d The hex for dark color (optional)
     * @param {?string} l The hex for light color (optional)
     * @return {string} The chosen best composite color
     */
    function bestTextColor(h, d, l) {
        return brightness(h) <= 125 ? (l ? l : '#FFFFFF') : (d ? d : '#000000');
    }

    //////////////////////////////////////////////////////
    //                   ColorConv
    // Converts between different color representations
    //////////////////////////////////////////////////////

    /**
     * Converts between different color representations
     * @constructor
     * @param {*} options For setting conversion options, only one presently if object 'rgb': 'string'
     */
    function ColorConv(options) {
        if (arguments[0] === inheriting) {
            return;
        }

        this['h'] = '#000000';
        this['d'] = 0;
        this['r'] = {'r': 0, 'g': 0, 'b': 0};
        this['o'] = isPlainObject(options) ? options : {};
    }

    /**
     * Set options
     * @param {*} options For setting conversion options, only one presently if object 'rgb': 'string'
     */
    ColorConv.prototype['setOpt'] = function (opt) {
        this['o'] = isPlainObject(opt) ? opt : {};
    };

    /**
     * Get options
     * @return {!Object} The queried options
     */
    ColorConv.prototype['getOpt'] = function () {
        return this['o'];
    };

    /**
     * Convert a hex string
     * @param {!string} hex The hex string to be converted into other forms
     */
    ColorConv.prototype['setHex'] = function (hex) {
        this['h'] = addSharp(hex);
        this['d'] = hex2dec(hex);
        this['r'] = hex2rgb(hex);
    };

    /**
     * Read the current hex string
     * @return {!string} The current hex string
     */
    ColorConv.prototype['getHex'] = function () {
        return this['h'];
    };

    /**
     * Convert a decimal value
     * @param {!number} dec The decimal number to be converted into other forms
     */
    ColorConv.prototype['setDec'] = this.setDec = function (dec) {
        this['h'] = addSharp(dec2hex(dec));
        this['d'] = dec;
        this['r'] = hex2rgb(this['h']);
    };

    /**
     * Read the current decimal number
     * @return {!number} The current decimal number
     */
    ColorConv.prototype['getDec'] = function () {
        return this['d'];
    };

    /**
     * Convert a RGB representation
     * @param {(!Object|!string)} rgb The RGB value as an object or string value
     */
    ColorConv.prototype['setRgb'] = function (rgb) {
        var t;
        if (isPlainObject(rgb)) {
            this['r'] = rgb;
        } else if (isString(rgb)) {
            t = rgb['regex'](/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
            this['r'] = t && ui32(t.length) === 3 ? {'r': t[0], 'g': t[1], 'b': t[2]} : {'r': 0, 'g': 0, 'b': 0};
        }

        function padHex(p) {
            return p && ui32(p.length) === 1 ? '0' + p : p;
        }

        this['h'] = addSharp(padHex(dec2hex(this['r']['r'])) + padHex(dec2hex(this['r']['g'])) + padHex(dec2hex(this['r']['b'])));
        this['d'] = hex2dec(this['h']);
    };

    /**
     * Read the current RGB string in one of the 2 formats
     * @return {!string} The current RGB string
     */
    ColorConv.prototype['getRgb'] = function () {
        return this['o']['rgb'] === 'string' ? "rgb(" + this['r']['r'] + "," + this['r']['g'] + "," + this['r']['b'] + ")" : this['h'];
    };

    ///////////////////////////
    //       owl
    ///////////////////////////

    /* This file is part of OWL JavaScript Utilities.

    OWL JavaScript Utilities is free software: you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public License
    as published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    OWL JavaScript Utilities is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with OWL JavaScript Utilities.  If not, see
    <http://www.gnu.org/licenses/>.
    */

    /**
     * owl
     * @type {Object.<string, Function>}
     */
    owl = (function () {
        /**
         * clone objects, skip other types.
         * @param {*} target
         * @return {*}
         */
        function clone(target) {
            return isObject(target) ? Object['create'](target) : target;
        }

        /**
         * Shallow Copy.
         * @param {*} target
         * @return {*}
         */
        function copy(target) {
            var value,
                c,
                property;

            if (!isObject(target)) {
                return target;  // non-object have value sematics, so target is already a copy.
            } else {
                value = target.valueOf();
                if (target !== value) {
                    // the object is a standard object wrapper for a native type, say String.
                    // we can make a copy by instantiating a new object around the value.
                    return new target.constructor(value);
                } else {
                    // ok, we have a normal object. If possible, we'll clone the original's prototype
                    // (not the original) to get an empty object with the same prototype chain as
                    // the original.  If just copy the instance properties.  Otherwise, we have to
                    // copy the whole thing, property-by-property.
                    //if (target instanceof target.constructor && target.constructor !== Object) {
                    c = !isPlainObject(target) ? clone(target.constructor.prototype) : {};

                    // give the copy all the instance properties of target.  It has the same
                    // prototype as target, so inherited properties are already there.
                    for (property in target) {
                        if (target.hasOwnProperty(property)) {
                            c[property] = target[property];
                        }
                    }

                    return c;
                }
            }
        }

        /**
         * deepCopiers.
         * @type {Array.<Object.<string, Function>>}
         */
        var deepCopiers = [];

        /**
         * Deep Copy.
         * @constructor
         * @param {*} config
         */
        function DeepCopier(config) {
            for (var key in config ) {
                if (config.hasOwnProperty(key)) {
                    this[key] = config[key];
                }
            }
        }

        /**
         * DeepCopier prototype
         * @type {Object.<string, Function>}
         */
        DeepCopier.prototype = {
            /**
             * DeepCopier prototype constructor
             * @type {Function}
             */
            constructor: DeepCopier,

            /**
             * determines if this DeepCopier can handle the given object.
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return false;
            },

            /**
             * starts the deep copying process by creating the copy object.  You
             * can initialize any properties you want, but you can't call recursively
             * into the DeeopCopyAlgorithm.
             * @param {*} source
             */
            'create': function (source) {},

            /**
             * Completes the deep copy of the source object by populating any properties
             * that need to be recursively deep copied.  You can do this by using the
             * provided deepCopyAlgorithm instance's deepCopy() method.  This will handle
             * cyclic references for objects already deepCopied, including the source object
             * itself.  The "result" passed in is the object returned from create().
             * @param {Function} deepCopyAlgorithm
             * @param {*} source
             * @param {*} result
             */
            'populate': function (deepCopyAlgorithm, source, result) {}
        };

        /**
         * Deep Copy Algorithm.
         * @constructor
         */
        function DeepCopyAlgorithm() {
            try {
                /**
                 * copiedObjects keeps track of objects already copied by this
                 * deepCopy operation, so we can correctly handle cyclic references.
                 * @type {Array.<*>}
                 * @private
                 */
                this.copiedObjects = [];

                    /**
                     * thisPass
                     * @private
                     */
                var thisPass = this;

                /**
                 * recursiveDeepCopy
                 * @param {*} source
                 * @return {*}
                 * @private
                 */
                this.recursiveDeepCopy = function (source) {
                    return thisPass.deepCopy(source);
                };

                /**
                 * depth.
                 * @type {number}
                 * @private
                 */
                this.depth = 0;
            } catch (err) {
                throwError("owl.DeepCopyAlgorithm", err);
            }
        }

        /**
         * DeepCopyAlgorithm prototype
         * @type {Object.<string, (Function|number)>}
         */
        DeepCopyAlgorithm.prototype = {
            /**
             * DeepCopyAlgorithm constructor
             * @type {Function}
             */
            constructor: DeepCopyAlgorithm,

            /**
             * maxDepth.
             * @type {number}
             */
            maxDepth: 256,

            /**
             * add an object to the cache.  No attempt is made to filter duplicates;
             * we always check getCachedResult() before calling it.
             * @param {*} source
             * @param {*} result
             */
            cacheResult: function (source, result) {
                this.copiedObjects.push([source, result]);
            },

            /**
             * Returns the cached copy of a given object, or undefined if it's an
             * object we haven't seen before.
             * @param {*} source
             * @return {*}
             */
            getCachedResult: function (source) {
                try {
                        /**
                         * copiedObjects
                         * @type {Array.<*>}
                         * @private
                         */
                    var copiedObjects = this.copiedObjects,
                        /**
                         * length
                         * @type {number}
                         * @private
                         */
                        length = ui32(copiedObjects.length),
                        /**
                         * i
                         * @type {number}
                         * @private
                         */
                        i = 0;

                    for (i = 0; i < length; i += 1) {
                        if (copiedObjects[i][0] === source) {
                            return copiedObjects[i][1];
                        }
                    }

                    return undefined;
                } catch (err) {
                    return throwError("owl.DeepCopyAlgorithm.getCachedResult", err);
                }
            },

            /**
             * deepCopy handles the simple cases itself: non-objects and object's we've seen before.
             * For complex cases, it first identifies an appropriate DeepCopier, then calls
             * applyDeepCopier() to delegate the details of copying the object to that DeepCopier.
             * @param {*} source
             * @return {*}
             */
            deepCopy: function (source) {
                try {
                    // null is a special case: it's the only value of type 'object' without properties.
                    if (isNull(source)) {
                        return null;
                    }

                    // All non-objects use value semantics and don't need explict copying.
                    if (!isObject(source)) {
                        return source;
                    }

                        /**
                         * cachedResult.
                         * @type {*}
                         * @private
                         */
                    var cachedResult = this.getCachedResult(source),
                        /**
                         * i
                         * @type {number}
                         * @private
                         */
                        i = 0,
                        /**
                         * l
                         * @type {number}
                         * @private
                         */
                        l = ui32(deepCopiers.length),
                        /**
                         * deepCopier.
                         * @type {Object.<string, Function>}
                         * @private
                         */
                        deepCopier;

                    // we've already seen this object during this deep copy operation
                    // so can immediately return the result.  This preserves the cyclic
                    // reference structure and protects us from infinite recursion.
                    if (cachedResult) {
                        return cachedResult;
                    }

                    // objects may need special handling depending on their class.  There is
                    // a class of handlers call "DeepCopiers"  that know how to copy certain
                    // objects.  There is also a final, generic deep copier that can handle any object.
                    for (i = 0; i < l; i += 1) {
                        deepCopier = deepCopiers[i];
                        if (deepCopier['canCopy'](source)) {
                            return this.applyDeepCopier(deepCopier, source);
                        }
                    }

                    // the generic copier can handle anything, so we should never reach this line.
                    throw new Error("no DeepCopier is able to copy " + source);
                } catch (err) {
                    return throwError("owl.DeepCopyAlgorithm.deepCopy", err);
                }
            },

            /**
             * once we've identified which DeepCopier to use, we need to call it in a very
             * particular order: create, cache, populate.  This is the key to detecting cycles.
             * We also keep track of recursion depth when calling the potentially recursive
             * populate(): this is a fail-fast to prevent an infinite loop from consuming all
             * available memory and crashing or slowing down the browser.
             * @param {*} deepCopier
             * @param {*} source
             * @return {*}
             */
            applyDeepCopier: function (deepCopier, source) {
                try {
                        /**
                         * Start by creating a stub object that represents the copy.
                         * @type {*}
                         * @private
                         */
                    var result = deepCopier['create'](source);

                    // we now know the deep copy of source should always be result, so if we encounter
                    // source again during this deep copy we can immediately use result instead of
                    // descending into it recursively.
                    this.cacheResult(source, result);

                    // only DeepCopier::populate() can recursively deep copy.  So, to keep track
                    // of recursion depth, we increment this shared counter before calling it,
                    // and decrement it afterwards.
                    this.depth += 1;
                    if (this.depth > this.maxDepth) {
                        throw new Error("Exceeded max recursion depth in deep copy.");
                    }

                    // It's now safe to let the deepCopier recursively deep copy its properties.
                    deepCopier['populate'](this.recursiveDeepCopy, source, result);
                    this.depth -= 1;
                    return result;
                } catch (err) {
                    return throwError("owl.DeepCopyAlgorithm.applyDeepCopier", err);
                }
            }
        };

        /**
         * entry point for deep copy.
         * source is the object to be deep copied.
         * maxDepth is an optional recursion limit. Defaults to 256.
         * @param {*} source
         * @param {number=} maxDepth
         * @return {*}
         */
        function deepCopy(source, maxDepth) {
            try {
                    /**
                     * deepCopyAlgorithm.
                     * @type {*}
                     * @private
                     */
                var deepCopyAlgorithm = new DeepCopyAlgorithm();
                if (maxDepth) {
                    deepCopyAlgorithm.maxDepth = maxDepth;
                }

                return deepCopyAlgorithm.deepCopy(source);
            } catch (err) {
                return throwError("owl.deepCopy", err);
            }
        }

        /**
         * publicly expose the DeepCopier class.
         * @type {Function}
         */
        deepCopy['DeepCopier'] = DeepCopier;

        /**
         * publicly expose the list of deepCopiers.
         * @type {Array.<Object.<string, Function>>}
         */
        deepCopy['deepCopiers'] = deepCopiers;

        /**
         * make deepCopy() extensible by allowing others to
         * register their own custom DeepCopiers.
         * @param {Object.<string, Function>} deepCopier
         */
        deepCopy['register'] = function (deepCopier) {
            if (!(deepCopier instanceof DeepCopier)) {
                deepCopier = new DeepCopier(deepCopier);
            }

            deepCopiers.unshift(deepCopier);
        };

        // Generic Object copier
        // the ultimate fallback DeepCopier, which tries to handle the generic case.  This
        // should work for base Objects and many user-defined classes.
        deepCopy['register'](/** @type {Object.<string, Function>} */{
            /**
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return true;
            },

            /**
             * @param {*} source
             * @return {*}
             */
            'create': function (source) {
                return source instanceof source.constructor ? clone(source.constructor.prototype) : {};
            },

            /**
             * @param {*} deepCopy
             * @param {*} source
             * @param {*} result
             * @return {*}
             */
            'populate': function (deepCopy, source, result) {
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        result[key] = deepCopy(source[key]);
                    }
                }

                return result;
            }
        });

        // Array copier
        deepCopy['register'](/** @type {Object.<string, Function>} */{
            /**
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return (source instanceof Array);
            },

            /**
             * @param {*} source
             * @return {*}
             */
            'create': function (source) {
                return new source.constructor();
            },

            /**
             * @param {*} deepCopy
             * @param {*} source
             * @param {*} result
             * @return {*}
             */
            'populate': function (deepCopy, source, result) {
                var i = 0,
                    l = ui32(source.length);

                for (i = 0; i < l; i += 1) {
                    result.push(deepCopy(source[i]));
                }

                return result;
            }
        });

        // Date copier
        deepCopy['register'](/** @type {Object.<string, Function>} */{
            /**
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return (source instanceof Date);
            },

            /**
             * @param {*} source
             * @return {*}
             */
            'create': function (source) {
                return new Date(source);
            }
        });

        // HTML DOM Node
        /**
         * utility function to detect Nodes.  In particular, we're looking
         * for the cloneNode method.  The global document is also defined to
         * be a Node, but is a special case in many ways.
         * @param {*} source
         * @return {*}
         */
        function isNode(source) {
            if (window['Node']) {
                return source instanceof window['Node'];
            } else {
                // the document is a special Node and doesn't have many of
                // the common properties so we use an identity check instead.
                if (source === document) {
                    return true;
                }

                return isNumber(source['nodeType']) && source['attributes'] && source['childNodes'] && source['cloneNode'];
            }
        }

        // Node copier
        deepCopy['register']({
            /**
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return isNode(source);
            },

            /**
             * @param {*} source
             * @return {*}
             */
            'create': function (source) {
                // there can only be one (document).
                if (source === document) {
                    return document;
                }

                // start with a shallow copy.  We'll handle the deep copy of
                // its children ourselves.
                return source['cloneNode'](false);
            },

            /**
             * @param {*} deepCopy
             * @param {*} source
             * @param {*} result
             * @return {*}
             */
            'populate': function (deepCopy, source, result) {
                // we're not copying the global document, so don't have to populate it either.
                if (source === document) {
                    return document;
                }

                var i = 0,
                    l = source['childNodes'] ? ui32(source['childNodes']['length']) : 0,
                    childCopy;

                // if this Node has children, deep copy them one-by-one.
                for (i = 0; i < l; i += 1) {
                    childCopy = deepCopy(source['childNodes'][i]);
                    result['appendChild'](childCopy);
                }

                return undefined;
            }
        });

        // jQuery copier
        deepCopy['register'](/** @type {Object.<string, Function>} */{
            /**
             * @param {*} source
             * @return {boolean}
             */
            'canCopy': function (source) {
                return (source instanceof jQuery);
            },

            /**
             * @param {*} source
             * @return {*}
             */
            'create': function (source) {
                return new source.constructor();
            },

            /**
             * @param {*} deepCopy
             * @param {*} source
             * @param {*} result
             * @return {*}
             */
            'populate': function (deepCopy, source, result) {
                extend(true, result, source);
                return result;
            }
        });

        return {
            'copy'              : copy,
            'clone'             : clone,
            'deepCopy'          : deepCopy
        };
    }());

    ///////////////////////////////////////////////////////////
    //            AES Advanced Encryption Standard
    // AES is a ‘symmetric block cipher’ for encrypting texts
    // which can be decrypted with the original encryption key.
    ///////////////////////////////////////////////////////////

    /*jslint bitwise: false */
    /**
     * @param {string} password
     * @param {number} nBits
     * @param {boolean} utf8encode
     */
    function Aes(password, nBits, utf8encode) {
        if (arguments[0] === inheriting) {
            return;
        }

        this['utf8encode'] = isUndefined(utf8encode) ? true : utf8encode;
        this['password'] = utf8encode ? password['Utf8encode']() : password;
        this['nBits'] = (nBits === 128 || nBits === 192 || nBits === 256) ? nBits : 256;
    }

    /**
     * @const
     * @type {Array.<number>}
     */
    Aes['sBox'] = [
            0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
            0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
            0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
            0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
            0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
            0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
            0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
            0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
            0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
            0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
            0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
            0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
            0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
            0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
            0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
            0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
        ];

    /**
     * @const
     * @type {Array.<number>}
     */
    Aes['rCon'] = [
        [0x00, 0x00, 0x00, 0x00],
        [0x01, 0x00, 0x00, 0x00],
        [0x02, 0x00, 0x00, 0x00],
        [0x04, 0x00, 0x00, 0x00],
        [0x08, 0x00, 0x00, 0x00],
        [0x10, 0x00, 0x00, 0x00],
        [0x20, 0x00, 0x00, 0x00],
        [0x40, 0x00, 0x00, 0x00],
        [0x80, 0x00, 0x00, 0x00],
        [0x1b, 0x00, 0x00, 0x00],
        [0x36, 0x00, 0x00, 0x00]
    ];

    /**
     * @private
     */
    Aes.prototype['_subBytes'] = function (s, Nb) {
        var r = 0,
            c = 0;

        for (r = 0; r < 4; r += 1) {
            for (c = 0; c < Nb; c += 1) {
                s[r][c] = Aes['sBox'][s[r][c]];
            }
        }

        return s;
    };

    /**
     * @private
     */
    Aes.prototype['_shiftRows'] = function (s, Nb) {
        var t = [],
            r = 1,
            c = 0;

        for (r = 1; r < 4; r += 1) {
            for (c = 0; c < 4; c += 1) {
                t[c] = s[r][(c + r) % Nb];
            }

            for (c = 0; c < 4; c += 1) {
                s[r][c] = t[c];
            }
        }

        return s;
    };

    /**
     * @private
     */
    Aes.prototype['_mixColumns'] = function (s, Nb) {
        var c = 0,
            a = [],
            b = [],
            i = 0;

        for (c = 0; c < 4; c += 1) {
            a = [];
            b = [];
            for (i = 0; i < 4; i += 1) {
                a[i] = s[i][c];
                b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;
            }

            s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3];
            s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3];
            s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3];
            s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3];
        }

        return s;
    };

    /**
     * @private
     */
    Aes.prototype['_addRoundKey'] = function (state, w, rnd, Nb) {
        var r = 0,
            c = 0;

        for (r = 0; r < 4; r += 1) {
            for (c = 0; c < Nb; c += 1) {
                state[r][c] ^= w[rnd * 4 + c][r];
            }
        }

        return state;
    };

    /**
     * @private
     */
    Aes.prototype['_cipher'] = function (input, w) {
        var Nb     = 4,
            Nr     = ui32(w.length) / Nb - 1,
            state  = [[], [], [], []],
            i      = 0,
            round  = 1,
            output = [];

        for (i = 0; i < 4 * Nb; i += 1) {
            state[i % 4][Math.floor(i / 4)] = input[i];
        }

        state = this['_addRoundKey'](state, w, 0, Nb);
        for (round = 1; round < Nr; round += 1) {
            state = this['_subBytes'](state, Nb);
            state = this['_shiftRows'](state, Nb);
            state = this['_mixColumns'](state, Nb);
            state = this['_addRoundKey'](state, w, round, Nb);
        }

        state = this['_subBytes'](state, Nb);
        state = this['_shiftRows'](state, Nb);
        state = this['_addRoundKey'](state, w, Nr, Nb);
        output = [];
        for (i = 0; i < 4 * Nb; i += 1) {
            output[i] = state[i % 4][Math.floor(i / 4)];
        }

        return output;
    };

    /**
     * @private
     */
    Aes.prototype['_subWord'] = function (w) {
        var i = 0;
        for (i = 0; i < 4; i += 1) {
            w[i] = Aes['sBox'][w[i]];
        }

        return w;
    };

    /**
     * @private
     */
    Aes.prototype['_rotWord'] = function (w) {
        var tmp = w[0],
            i   = 0;

        for (i = 0; i < 3; i += 1) {
            w[i] = w[i + 1];
        }

        w[3] = tmp;
        return w;
    };

    /**
     * @private
     */
    Aes.prototype['_keyExpansion'] = function (key) {
        var Nb   = 4,
            Nk   = ui32(key.length) / 4,
            Nr   = Nk + 6,
            w    = [],
            temp = [],
            i    = 0,
            t    = 0;

        for (i = 0; i < Nk; i += 1) {
            w[i] = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
        }

        for (i = Nk; i < (Nb * (Nr + 1)); i += 1) {
            w[i] = [];
            for (t = 0; t < 4; t += 1) {
                temp[t] = w[i - 1][t];
            }

            if (i % Nk === 0) {
                temp = this['_subWord'](this['_rotWord'](temp));
                for (t = 0; t < 4; t += 1) {
                    temp[t] ^= Aes['rCon'][i / Nk][t];
                }

            } else if (Nk > 6 && i % Nk === 4) {
                temp = this['_subWord'](temp);
            }

            for (t = 0; t < 4; t += 1) {
                w[i][t] = w[i - Nk][t] ^ temp[t];
            }
        }

        return w;
    };

    /**
     * @param {string} plaintext
     * @returns {string}
     */
    Aes.prototype['encrypt'] = function (plaintext) {
        try {
            plaintext = this['utf8encode'] ? plaintext['Utf8encode']() : plaintext;
            var blockSize    = 16,
                nBytes       = this['nBits'] / 8,
                pwBytes      = [],
                i            = 0,
                counterBlock = [],
                nonce        = [],
                nonceSec     = Math.floor(nonce / 1000),
                nonceMs      = nonce % 1000,
                key          = [],
                ctrTxt       = '',
                keySchedule  = [],
                blockCount   = 0,
                ciphertxt    = [],
                b            = 0,
                c            = 0,
                cipherCntr   = [],
                blockLength  = 0,
                cipherChar   = [],
                ciphertext   = '';

            for (i = 0; i < nBytes; i += 1) {
                pwBytes[i] = isNaN2(this['password'].charCodeAt(i)) ? 0 : this['password'].charCodeAt(i);
            }

            key = this['_cipher'](pwBytes, this['_keyExpansion'](pwBytes));
            key = key.concat(key.slice(0, nBytes - 16));
            for (i = 0; i < 4; i += 1) {
                counterBlock[i] = (nonceSec >>> i * 8) & 0xff;
            }

            for (i = 0; i < 4; i += 1) {
                counterBlock[i + 4] = nonceMs & 0xff;
            }

            for (i = 0; i < 8; i += 1) {
                ctrTxt += String.fromCharCode(counterBlock[i]);
            }

            keySchedule = this['_keyExpansion'](key);
            blockCount = Math.ceil(ui32(plaintext.length) / blockSize);
            ciphertxt = [];
            for (b = 0; b < blockCount; b += 1) {
                for (c = 0; c < 4; c += 1) {
                    counterBlock[15 - c] = (b >>> c * 8) & 0xff;
                }

                for (c = 0; c < 4; c += 1) {
                    counterBlock[15 - c - 4] = (b / 0x100000000 >>> c * 8);
                }

                cipherCntr = this['_cipher'](counterBlock, keySchedule);
                blockLength = b < blockCount - 1 ? blockSize : (ui32(plaintext.length) - 1) % blockSize + 1;
                cipherChar = [];
                for (i = 0; i < blockLength; i += 1) {
                    cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
                    cipherChar[i] = String.fromCharCode(cipherChar[i]);
                }

                ciphertxt[b] = cipherChar.join('');
            }

            ciphertext = ctrTxt + ciphertxt.join('');
            ciphertext = ciphertext['Base64encode']();
            return ciphertext;
        } catch (err) {
            return throwError("Aes.encrypt", err);
        }
    };

    /**
     * @param {string} plaintext
     * @returns {string}
     */
    Aes.prototype['decrypt'] = function (ciphertext) {
        try {
            ciphertext = ciphertext['Base64decode']();
            var blockSize    = 16,
                nBytes       = this['nBits'] / 8,
                pwBytes      = [],
                i            = 0,
                l            = 0,
                key          = [],
                counterBlock = [],
                ctrTxt       = [],
                keySchedule  = [],
                nBlocks      = 0,
                ct           = [],
                b            = 0,
                plaintxt     = [],
                c            = 0,
                cipherCntr   = [],
                plaintxtByte = [],
                plaintext    = '';

            for (i = 0; i < nBytes; i += 1) {
                pwBytes[i] = isNaN2(this['password'].charCodeAt(i)) ? 0 : this['password'].charCodeAt(i);
            }

            key = this['_cipher'](pwBytes, this['_keyExpansion'](pwBytes));
            key = key.concat(key.slice(0, nBytes - 16));
            counterBlock = [];
            ctrTxt = ciphertext.slice(0, 8);
            for (i = 0; i < 8; i += 1) {
                counterBlock[i] = ctrTxt.charCodeAt(i);
            }

            keySchedule = this['_keyExpansion'](key);
            nBlocks = Math.ceil((ui32(ciphertext.length) - 8) / blockSize);
            ct = [];
            for (b = 0; b < nBlocks; b += 1) {
                ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
            }

            ciphertext = ct;
            plaintxt = [];

            for (b = 0; b < nBlocks; b += 1) {
                for (c = 0; c < 4; c += 1) {
                    counterBlock[15 - c] = ((b) >>> c * 8) & 0xff;
                }

                for (c = 0; c < 4; c += 1) {
                    counterBlock[15 - c - 4] = (((b + 1) / 0x100000000 - 1) >>> c * 8) & 0xff;
                }

                cipherCntr = this['_cipher'](counterBlock, keySchedule);
                plaintxtByte = []; // new Array(ciphertext[b].length);
                l = ui32(ciphertext[b].length);
                for (i = 0; i < l; i += 1) {
                    plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
                    plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
                }

                plaintxt[b] = plaintxtByte.join('');
            }

            plaintext = plaintxt.join('');
            plaintext = this['utf8encode'] ? plaintext['Utf8decode']() : plaintext;
            return plaintext;
        } catch (err) {
            return throwError("Aes.decrypt", err);
        }
    };
    /*jslint bitwise: true */

    //////////////////////////////////////////////////////
    //                   LogHelper
    // Wrapper for console logging
    //////////////////////////////////////////////////////

    function LogHelper(settings) {
        if (arguments[0] === inheriting) {
            return;
        }

        settings = isPlainObject(settings) && hasContent(settings) ? settings : {};
        this['log_version'] = setContent(settings['log_version'], "");
        this['log_level'] = setContent(settings['log_version'], 1);
    }

    LogHelper.prototype['log_common'] = function (type, level, text) {
        var m,
            t,
            i,
            l;

        if (this['log_level'] >= 1 && !isNaN2(level) && this['log_level'] >= level) {
            m = this['log_version'] + ' |' + (new Date()).toLocaleTimeString() + '| ' + text;
            t = [];
            i = 0;
            l = 0;

            type = setContent(type, "log");
            type = type in window.console ? type : ("log" in window.console ? "log" : '');
            if (hasContent(type)) {
                if (ui32(arguments.length) === 4) {
                    for (i = 0, l = ui32(arguments[3].length); i < l; i += 1) {
                        t.push(arguments[3][i] === window || arguments[3][i] === document ? arguments[3][i] : owl['deepCopy'](arguments[3][i]));
                    }

                    window.console[type](m, t);
                } else {
                    window.console[type](m);
                }
            }
        }
    };

    LogHelper.prototype['log'] = function (level, text) {
        if (ui32(arguments.length) > 2) {
            this['log_common']("log", level, text, Array.prototype.slice.call(arguments, 2));
        } else {
            this['log_common']("log", level, text);
        }

        return Array.prototype.slice.call(arguments, 1);
    };

    LogHelper.prototype['warn'] = function (text) {
        if (ui32(arguments.length) > 1) {
            this['log_common']("warn", 1, text, Array.prototype.slice.call(arguments, 1));
        } else {
            this['log_common']("warn", 1, text);
        }

        return Array.prototype.slice.call(arguments);
    };

    LogHelper.prototype['error'] = function (text) {
        if (ui32(arguments.length) > 1) {
            this['log_common']("error", 1, text, Array.prototype.slice.call(arguments, 1));
        } else {
            this['log_common']("error", 1, text);
        }

        return Array.prototype.slice.call(arguments);
    };

    ////////////////////////////////////////////////////////
    //                   LZ77
    // Compress and Decompress strings using the LZ77 format
    ////////////////////////////////////////////////////////

    function LZ77(settings) {
        if (arguments[0] === inheriting) {
            return;
        }

        settings = isPlainObject(settings) && hasContent(settings) ? settings : {};
        this['referencePrefix']       = "`";
        this['referenceIntBase']      = setContent(settings['referenceIntBase'], 96);
        this['referenceIntFloorCode'] = " ".charCodeAt(0);
        this['referenceIntCeilCode']  = this['referenceIntFloorCode'] + this['referenceIntBase'] - 1;
        this['maxStringDistance']     = Math.pow(this['referenceIntBase'], 2) - 1;
        this['minStringLength']       = setContent(settings['minStringLength'], 5);
        this['maxStringLength']       = Math.pow(this['referenceIntBase'], 1) - 1 + this['minStringLength'];
        this['defaultWindowLength']   = setContent(settings['defaultWindowLength'], 144);
        this['maxWindowLength']       = this['maxStringDistance'] + this['minStringLength'];
    }

    LZ77.prototype['_encodeReferenceInt'] = function (value, width) {
        if ((value >= 0) && (value < (Math.pow(this['referenceIntBase'], width) - 1))) {
            var encoded       = "",
                i             = 0,
                missingLength = 0,
                mf            = Math.floor,
                sc            = String.fromCharCode;

            while (value > 0) {
                encoded = sc((value % this['referenceIntBase']) + this['referenceIntFloorCode']) + encoded;
                value = mf(value / this['referenceIntBase']);
            }

            missingLength = width - encoded.length;
            for (i = 0; i < missingLength; i += 1) {
                encoded = sc(this['referenceIntFloorCode']) + encoded;
            }

            return encoded;
        } else {
            return throwError("LZ77.compress", new Error("Reference int out of range: " + value + " (width = " + width + ")"));
        }
    };

    LZ77.prototype['_decodeReferenceInt'] = function (data, width) {
        var value    = 0,
            i        = 0,
            charCode = 0;

        for (i = 0; i < width; i += 1) {
            value *= this['referenceIntBase'];
            charCode = data.charCodeAt(i);
            if ((charCode >= this['referenceIntFloorCode']) && (charCode <= this['referenceIntCeilCode'])) {
                value += charCode - this['referenceIntFloorCode'];
            } else {
                return throwError("LZ77.compress", new Error("Invalid char code in reference int: " + charCode));
            }
        }

        return value;
    };

    LZ77.prototype['compress'] = function (data, windowLength) {
        windowLength = windowLength || this['defaultWindowLength'];
        if (windowLength > this['maxWindowLength']) {
            return throwError("LZ77.compress", new Error("Window length too large"));
        }

        var compressed      = "",
            pos             = 0,
            lastPos         = data.length - this['minStringLength'],
            searchStart     = 0,
            matchLength     = 0,
            foundMatch      = false,
            bestMatch       = {},
            newCompressed   = null,
            realMatchLength = 0,
            mm              = Math.max,
            dataCharAt      = 0;

        while (pos < lastPos) {
            searchStart = mm(pos - windowLength, 0);
            matchLength = this['minStringLength'];
            foundMatch = false;
            bestMatch = {
                distance : this['maxStringDistance'],
                length   : 0
            };

            newCompressed = null;
            while ((searchStart + matchLength) < pos) {
                if ((matchLength < this['maxStringLength']) && (data.substr(searchStart, matchLength) === data.substr(pos, matchLength))) {
                    matchLength += 1;
                    foundMatch = true;
                } else {
                    realMatchLength = matchLength - 1;
                    if (foundMatch && (realMatchLength > bestMatch.length)) {
                        bestMatch.distance = pos - searchStart - realMatchLength;
                        bestMatch.length = realMatchLength;
                    }

                    matchLength = this['minStringLength'];
                    searchStart += 1;
                    foundMatch = false;
                }
            }

            if (bestMatch.length) {
                newCompressed = this['referencePrefix'] + this['_encodeReferenceInt'](bestMatch.distance, 2) + this['_encodeReferenceInt'](bestMatch.length - this['minStringLength'], 1);
                pos += bestMatch.length;
            } else {
                dataCharAt = data.charAt(pos);
                if (dataCharAt !== this['referencePrefix']) {
                    newCompressed = dataCharAt;
                } else {
                    newCompressed = this['referencePrefix'] + this['referencePrefix'];
                }

                pos += 1;
            }

            compressed += newCompressed;
        }

        return compressed + data.slice(pos).replace(/`/g, "``");
    };

    LZ77.prototype['decompress'] = function (data) {
        var decompressed = "",
            pos          = 0,
            currentChar  = '',
            nextChar     = '',
            distance     = 0,
            length       = 0,
            minStrLength = this['minStringLength'] - 1,
            dataLength   = data.length,
            posPlusOne   = 0;

        while (pos < dataLength) {
            currentChar = data.charAt(pos);
            if (currentChar !== this['referencePrefix']) {
                decompressed += currentChar;
                pos += 1;
            } else {
                posPlusOne = pos + 1;
                nextChar = data.charAt(posPlusOne);
                if (nextChar !== this['referencePrefix']) {
                    distance = this['_decodeReferenceInt'](data.substr(posPlusOne, 2), 2);
                    length = this['_decodeReferenceInt'](data.charAt(pos + 3), 1) + this['minStringLength'];
                    decompressed += decompressed.substr(decompressed.length - distance - length, length);
                    pos += minStrLength;
                } else {
                    decompressed += this['referencePrefix'];
                    pos += 2;
                }
            }
        }

        return decompressed;
    };

    if (!('LZ77Compress' in String.prototype)) {
        String.prototype['LZ77Compress'] = (function () {
            var c = new LZ77();
            return function () {
                return c['compress'](this);
            };
        }());
    }

    if (!('LZ77Decompress' in String.prototype)) {
        String.prototype['LZ77Decompress'] = (function () {
            var c = new LZ77();
            return function () {
                return c['decompress'](this);
            };
        }());
    }

    //////////////////////////////////////////////////////
    //                   Storage tests
    // Checks for available storage types
    //////////////////////////////////////////////////////

    storageTypes = {
        'localStorage'   : ('localStorage' in window) && isObject(window['localStorage']),
        'sessionStorage' : ('sessionStorage' in window) && isObject(window['sessionStorage']),
        'greaseMonkey'   : ('unsafeWindow' in this) && isObject(this['unsafeWindow'])
    };

    //////////////////////////////////////////////////////
    //                   StorageHelper
    // Wrapper for localStorage, sessionStorage and
    // Greasemonkey storage functions
    //////////////////////////////////////////////////////

    function StorageHelper(settings) {
        if (arguments[0] === inheriting) {
            return;
        }

        settings = isPlainObject(settings) && hasContent(settings) ? settings : {};
        this['namespace'] = isString(settings['namespace']) ? settings['namespace'] : '';
        this['useRison'] = isBoolean(settings['useRison']) ? settings['useRison'] : "RISON" in window;
        this['storage_id'] = isString(settings['storage_id']) ? settings['storage_id'] : '';
        var storage_type = isString(settings['storage_type']) ? settings['storage_type'] : 'localStorage';
        this['storage_type'] = storageTypes[storage_type] ? storage_type : (storageTypes["greaseMonkey"] ? "greaseMonkey" : "None available");
    }

    StorageHelper.prototype['storage_ref'] = function (id) {
        return (this['namespace'] ? this['namespace'] + "." : '') + (id ? id + "." : (this['storage_id'] ? this['storage_id'] + "." : ''));
    };

    // use these to set/get values in a way that prepends the namespace & storage_id
    StorageHelper.prototype['setItem'] = function (name, value, hpack, compress) {
        try {
            name = isString(name) ? name : (isNumber(name) ? name.toString() : '');
            if (!hasContent(name)) {
                throw new TypeError("Invalid identifying name! (" + name + ")");
            }

            if (!isDefined(value)) {
                throw new TypeError("Value supplied is 'undefined' or 'null'! (" + value + ")");
            }

            hpack = isNumber(hpack) ? hpack : false;
            var doHpack      = hpack !== false && hpack >= 0 && hpack <= 3,
                stringified  = '',
                storageStr   = '',
                tempVal      = doHpack ? JSON['hpack'](value, hpack) : [],
                reportEnc    = this['useRison'] ? "RISON.encode" : 'JSON.stringify',
                storage_ref  = this['storage_ref']() + name;

            tempVal = doHpack ? (isArray(tempVal) ? tempVal : []) : value;
            stringified = this['useRison'] ? RISON['encode'](tempVal) : JSON.stringify(tempVal);
            if (!isString(stringified)) {
                throw new TypeError(reportEnc + " returned (" + typeOf(stringified) + ")");
            }

            stringified = (doHpack ? (this['useRison'] ? "R-HPACK " : "HPACK ") : (this['useRison'] ? "RISON " : "")) + stringified;
            if (isBoolean(compress) ? compress : false) {
                storageStr = "LZ77 " + stringified['LZ77Compress']();
                //internal['log'](1, "Compressed storage", name, ((ui32(storageStr.length) / ui32(stringified.length)) * 100)['dp'](2));
            } else {
                storageStr = stringified;
            }

            switch (this['storage_type']) {
            case "localStorage":
            case "sessionStorage":
                window[this['storage_type']]['setItem'](storage_ref, storageStr);
                break;
            case "greaseMonkey":
                /*jslint newcap: false */
                GM_setValue(storage_ref, storageStr);
                /*jslint newcap: true */
                break;
            default:
                throw new Error("No storage type available!");
            }

            return value;
        } catch (error) {
            return throwError("StorageHelper.setItem", error, {'name': name, 'value': value});
        }
    };

    StorageHelper.prototype['getItem'] = function (name, value, hidden) {
        try {
            name = isString(name) ? name : (isNumber(name) ? name.toString() : '');
            if (!hasContent(name)) {
                throw new TypeError("Invalid identifying name! (" + name + ")");
            }

            var jsObj        = null,
                storageStr   = '',
                storage_ref  = this['storage_ref']() + name;

            switch (this['storage_type']) {
            case "localStorage":
            case "sessionStorage":
                storageStr = window[this['storage_type']]['getItem'](storage_ref);
                break;
            case "greaseMonkey":
                /*jslint newcap: false */
                storageStr = GM_getValue(storage_ref);
                /*jslint newcap: true */
                break;
            default:
                throw new Error("No storage type available!");
            }

            if (isString(storageStr)) {
                if (storageStr.match(/^LZ77 /)) {
                    storageStr = storageStr.slice(5)['LZ77Decompress']();
                    //internal['log'](1, "Decompressed storage", name);
                }

                if (isString(storageStr)) {
                    if (storageStr.match(/^R-HPACK /)) {
                        jsObj = JSON['hunpack'](RISON['decode'](storageStr.slice(8)));
                    } else if (storageStr.match(/^RISON /)) {
                        jsObj = RISON['decode'](storageStr.slice(6));
                    } else if (storageStr.match(/^HPACK /)) {
                        jsObj = JSON['hunpack'](JSON.parse(storageStr.slice(6)));
                    } else {
                        jsObj = JSON.parse(storageStr);
                    }
                }
            }

            if (!isDefined(jsObj)) {
                hidden = isBoolean(hidden) ? hidden : false;
                if (!hidden) {
                    internal['warn']("utility.StorageHelper.getItem parsed string returned 'undefined' or 'null' for ", name);
                }

                if (isDefined(value)) {
                    if (!hidden) {
                        internal['warn']("utility.StorageHelper.getItem using default value ", value);
                    }

                    jsObj = value;
                } else {
                    throw "No default value supplied! (" + value + ")";
                }
            }

            return jsObj;
        } catch (error) {
            throwError("StorageHelper.getItem", error);
            if (error.match(/Invalid JSON/) && isString(name) && hasContent(name)) {
                if (isDefined(value)) {
                    this['setItem'](name, value);
                    return value;
                } else {
                    this['deleteItem'](name);
                }
            }

            return undefined;
        }
    };

    StorageHelper.prototype['deleteItem'] = function (name) {
        try {
            name = isString(name) ? name : (isNumber(name) ? name.toString() : '');
            if (!hasContent(name)) {
                throw new TypeError("Invalid identifying name! (" + name + ")");
            }

            var storage_ref  = this['storage_ref']() + name;
            switch (this['storage_type']) {
            case "localStorage":
            case "sessionStorage":
                window[this['storage_type']]['removeItem'](storage_ref);
                break;
            case "greaseMonkey":
                /*jslint newcap: false */
                GM_deleteValue(storage_ref);
                /*jslint newcap: true */
                break;
            default:
                throw new Error("No storage type available!");
            }

            return true;
        } catch (error) {
            return throwError("StorageHelper.deleteItem", error);
        }
    };

    StorageHelper.prototype['clear'] = function (id) {
        try {
            id = isString(id) ? id : (isNumber(id) ? id.toString() : '');
            var storageKeys  = [],
                key          = 0,
                len          = 0,
                done         = false,
                storage_ref  = this['storage_ref'](id),
                nameRegExp   = new RegExp("^" + storage_ref);

            switch (this['storage_type']) {
            case "localStorage":
            case "sessionStorage":
                if (is_firefox) {
                    while (!done) {
                        try {
                            if (window[this['storage_type']]['key'](key) && window[this['storage_type']]['key'](key).match(nameRegExp)) {
                                window[this['storage_type']]['removeItem'](window[this['storage_type']]['key'](key));
                            }

                            key += 1;
                        } catch (e) {
                            done = true;
                        }
                    }
                } else {
                    for (key = 0, len = ui32(window[this['storage_type']].length); key < len; key += 1) {
                        if (window[this['storage_type']]['key'](key) && window[this['storage_type']]['key'](key).match(nameRegExp)) {
                            window[this['storage_type']]['removeItem'](window[this['storage_type']]['key'](key));
                        }
                    }
                }

                break;
            case "greaseMonkey":
                /*jslint newcap: false */
                storageKeys = GM_listValues();
                /*jslint newcap: true */
                for (key = 0, len = ui32(storageKeys.length); key < len; key += 1) {
                    if (storageKeys[key] && storageKeys[key].match(nameRegExp)) {
                        /*jslint newcap: false */
                        GM_deleteValue(storageKeys[key]);
                        /*jslint newcap: true */
                    }
                }

                break;
            default:
                throw new Error("No storage type available!");
            }

            return true;
        } catch (error) {
            return throwError("StorageHelper.clear", error);
        }
    };

    StorageHelper.prototype['used'] = function (id) {
        try {
            id = isString(id) ? id : (isNumber(id) ? id.toString() : '');
            var storageKeys  = [],
                key          = 0,
                len          = 0,
                charCnt      = 0,
                chars        = 0,
                done         = false,
                storage_ref  = this['storage_ref'](id),
                nameRegExp   = new RegExp("^" + storage_ref);

            switch (this['storage_type']) {
            case "localStorage":
            case "sessionStorage":
                if (is_firefox) {
                    while (!done) {
                        try {
                            chars += ui32(window[this['storage_type']]['getItem'](window[this['storage_type']]['key'](key)).length);
                            if (window[this['storage_type']]['key'](key).match(nameRegExp)) {
                                charCnt += ui32(window[this['storage_type']]['getItem'](window[this['storage_type']]['key'](key)).length);
                            }

                            key += 1;
                        } catch (e) {
                            done = true;
                        }
                    }

                } else {
                    for (key = 0, len = ui32(window[this['storage_type']].length); key < len; key += 1) {
                        chars += ui32(window[this['storage_type']]['getItem'](window[this['storage_type']]['key'](key)).length);
                        if (window[this['storage_type']]['key'](key).match(nameRegExp)) {
                            charCnt += ui32(window[this['storage_type']]['getItem'](window[this['storage_type']]['key'](key)).length);
                        }
                    }
                }

                break;
            case "greaseMonkey":
                /*jslint newcap: false */
                storageKeys = GM_listValues();
                /*jslint newcap: true */
                for (key = 0, len = ui32(storageKeys.length); key < len; key += 1) {
                    /*jslint newcap: false */
                    chars += ui32(GM_getValue(storageKeys[key]).length);
                    /*jslint newcap: true */
                    if (storageKeys[key] && storageKeys[key].match(nameRegExp)) {
                        /*jslint newcap: false */
                        charCnt += ui32(GM_getValue(storageKeys[key]).length);
                        /*jslint newcap: true */
                    }
                }

                break;
            default:
                throw new Error("No storage type available!");
            }

            return {'type': this['storage_type'], 'match': charCnt, 'total': chars};
        } catch (error) {
            return throwError("StorageHelper.used", error);
        }
    };

    //////////////////////////////////////////////////////
    //                   IDBHelperAsync
    // A wrapper to help with Asynchronous Indexed DB
    //////////////////////////////////////////////////////

    if (!('indexedDB' in window)) {
        window['indexedDB'] = window['webkitIndexedDB'] || window['mozIndexedDB'] || {};
    }

    if (!('IDBCursor' in window)) {
        window['IDBCursor'] = window['webkitIDBCursor'] || window['mozIDBCursor'] || {};
    }

    if (!('IDBKeyRange' in window)) {
        window['IDBKeyRange'] = window['webkitIDBKeyRange'] || window['mozIDBKeyRange'] || {};
    }

    if (!('IDBTransaction' in window)) {
        window['IDBTransaction'] = window['webkitIDBTransaction'] || window['mozIDBTransaction'] || {};
    }

    function IDBHelperAsync() {
        if (arguments[0] === inheriting) {
            return;
        }

        this['available'] = "open" in window['indexedDB'];
        this['ready'] = false;
        this['adelay'] = 5000;
        this['rdelay'] = 10;
        this['db'] = null;
    }

    IDBHelperAsync.prototype['transaction'] = function (store, mode) {
        try {
            store = store ? store : "default";
            mode = mode ? mode : "READ_ONLY";
            var oncomplete  = this['onsuccess'],
                onabort     = this['onabort'],
                onerror     = this['onerror'],
                request,
                objectStore;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            request = this['db']['transaction']([store], window['IDBTransaction'][mode], this['adelay']);
            objectStore = request['objectStore'](store);
            request['oncomplete'] = function (event) {
                internal['log'](2, "Complete: transaction", store, event);
                if (isFunction(oncomplete)) {
                    oncomplete(event);
                }
            };

            request['onabort'] = function (event) {
                internal['error']("Abort: transaction", store, event);
                if (isFunction(onabort)) {
                    onabort(event);
                }
            };

            request['onerror'] = function (event) {
                internal['error']("Error: transaction", store, event);
                if (isFunction(onerror)) {
                    onerror(event);
                }
            };

            return objectStore;
        } catch (err) {
            return throwError("IDBHelperAsync.transaction", err);
        }
    };

    IDBHelperAsync.prototype['createObjectStore'] = function (store, key) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                onblocked = this['onblocked'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    store = store ? store : "default";
                    if (!that['db']['objectStoreNames']['contains'](store)) {
                        that['ready'] = false;
                        key = key ? {"keyPath": key} : {"autoIncrement": true};
                        var version = that['db']['version'] ? that['db']['version'] : "1",
                            request = that['db']['setVersion'](version);

                        request['onsuccess'] = function (event) {
                            that['db']['createObjectStore'](store, key);
                            that['ready'] = true;
                            if (isFunction(onsuccess)) {
                                onsuccess(event);
                            }
                        };

                        request['onblocked'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Blocked: createObjectStore", event);
                            if (isFunction(onblocked)) {
                                onblocked(event);
                            }
                        };

                        request['onabort'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Abort: createObjectStore", event);
                            if (isFunction(onabort)) {
                                onabort(event);
                            }
                        };

                        request['onerror'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Error: createObjectStore", event);
                            if (isFunction(onerror)) {
                                onerror(event);
                            }
                        };
                    } else if (isFunction(onsuccess)) {
                        onsuccess({"message": "Object store already exists: " + store});
                    }
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.createObjectStore", err);
        }
    };

    IDBHelperAsync.prototype['deleteObjectStore'] = function (store) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                onblocked = this['onblocked'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    if (that['db']['objectStoreNames']['contains'](store)) {
                        that['ready'] = false;
                        var version = that['db']['version'] ? that['db']['version'] : "1",
                            request = that['db']['setVersion'](version);

                        request['onsuccess'] = function (event) {
                            that['db']['deleteObjectStore'](store);
                            that['ready'] = true;
                            if (isFunction(onsuccess)) {
                                onsuccess(event);
                            }
                        };

                        request['onblocked'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Blocked: deleteObjectStore", event);
                            if (isFunction(onabort)) {
                                onblocked(event);
                            }
                        };

                        request['onabort'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Abort: deleteObjectStore", event);
                            if (isFunction(onabort)) {
                                onabort(event);
                            }
                        };

                        request['onerror'] = function (event) {
                            that['ready'] = true;
                            internal['error']("Error: deleteObjectStore", event);
                            if (isFunction(onerror)) {
                                onerror(event);
                            }
                        };
                    } else if (isFunction(onsuccess)) {
                        onsuccess({"message": "No object store to delete: " + store});
                    }
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.deleteObjectStore", err);
        }
    };

    IDBHelperAsync.prototype['close'] = function () {
        try {
            var onabort = this['onabort'],
                that    = this,
                retry   = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            delete this['onversionchange'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    that['ready'] = false;
                    that['db']['close']();
                    that['db'] = null;
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.close", err);
        }
    };

    IDBHelperAsync.prototype['open'] = function (name, description, version) {
        try {
            var onsuccess       = this['onsuccess'],
                onabort         = this['onabort'],
                onerror         = this['onerror'],
                onblocked       = this['onblocked'],
                onversionchange = this['onversionchange'],
                that            = this,
                request;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            if (this['db']) {
                return isFunction(onabort) ? onabort({"message": "DB is already opened"}) : false;
            }

            name = name ? name : "defaultDB";
            description = description ? description : "Default Database";
            version = version ? version : "1";
            if ((is_chrome && chrome_major_version < 23) || (is_firefox && firefox_major_version < 10)) {
                internal['log'](1, 'Old idb open v' + version);
                request = window['indexedDB']['open'](name, description);
            } else {
                internal['log'](1, 'New idb open v' + version);
                request = window['indexedDB']['open'](name, version);

                request['onupgradeneeded'] = function(evt) {
                    internal['warn']('Upgrade needed on open v' + version);
                    if (isFunction(onversionchange)) {
                        onversionchange(evt);
                    }
                }
            }

            request['onsuccess'] = function (event) {
                internal['log'](2, 'Success: open');
                that['db'] = event['target']['result'];

                // old open/setVersion handling - deprecated
                if ((is_chrome && chrome_major_version < 23) || (is_firefox && firefox_major_version < 10)) {
                    that['db']['onversionchange'] = function (evt) {
                        internal['warn']("Version changed", evt);
                        that['close']();
                        if (isFunction(onversionchange)) {
                            onversionchange(evt);
                        }
                    };

                    if (that['db']['version'] !== version) {
                        // User's first visit, initialize database.
                        request = that['db']['setVersion'](version);
                        request['onsuccess'] = function (evt) {
                            that['ready'] = true;
                            if (isFunction(onsuccess) === "function") {
                                onsuccess(evt);
                            }
                        };

                        request['onabort'] = function (evt) {
                            internal['error']("Abort: init");
                            if (isFunction(onabort)) {
                                onabort(evt);
                            }
                        };

                        request['onerror'] = function (evt) {
                            internal['error']("Error: init");
                            if (isFunction(onerror)) {
                                onerror(evt);
                            }
                        };
                    } else {
                        // User has been here before, no initialization required.
                        that['ready'] = true;
                        if (isFunction(onsuccess)) {
                            onsuccess(event);
                        }
                    }
                } else {
                    that['ready'] = true;
                    if (isFunction(onsuccess)) {
                        onsuccess(event);
                    }
                }
            };

            request['onblocked'] = function (event) {
                internal['error']("Blocked: open", event);
                if (isFunction(onblocked)) {
                    onblocked(event);
                } else {
                    alert('Please close all other tabs with this site open!');
                }
            };

            request['onabort'] = function (event) {
                internal['error']("Abort: open", event);
                if (isFunction(onabort)) {
                    onabort(event);
                }
            };

            request['onerror'] = function (event) {
                internal['error']("Error: open", event);
                if (isFunction(onerror)) {
                    onerror(event);
                }
            };

            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.open", err);
        }
    };

    IDBHelperAsync.prototype['deleteItem'] = function (store, key) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = this['transaction'](store, "READ_WRITE"),
                        request;

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    request = objectStore['delete'](key);
                    request['onsuccess'] = function (event) {
                        if (isFunction(onsuccess)) {
                            onsuccess(event);
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: deleteItem", key);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: deleteItem", key);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.deleteItem", err);
        }
    };

    IDBHelperAsync.prototype['getAllSubset'] = function (store, subset) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store),
                        request,
                        valueArray  = [];

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    request = objectStore['openCursor']();
                    request['onsuccess'] = function (event) {
                        var cursor = event['target']['result'],
                            obj    = {},
                            it;

                        if (cursor) {
                            for (it in subset) {
                                if (subset.hasOwnProperty(it)) {
                                    obj[it] = cursor['value'][it];
                                }
                            }

                            valueArray.push(obj);
                            cursor['continue']();
                        } else {
                            if (isFunction(onsuccess)) {
                                onsuccess(valueArray);
                            }
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: getAllSubset", store);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: getAllSubset", store);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.getAllSubset", err);
        }
    };

    IDBHelperAsync.prototype['getAllKeys'] = function (store, key) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store),
                        request,
                        valueArray  = [];

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    key = key ? key : objectStore['keyPath'];
                    request = objectStore['openCursor']();
                    request['onsuccess'] = function (event) {
                        var cursor = event['target']['result'];
                        if (cursor) {
                            valueArray.push(cursor['value'][key]);
                            cursor['continue']();
                        } else {
                            if (isFunction(onsuccess)) {
                                onsuccess(valueArray);
                            }
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: getAllKeys", store);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: getAllKeys", store);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.getAllKeys", err);
        }
    };

    IDBHelperAsync.prototype['getAll'] = function (store) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store),
                        hasGetAll,
                        request,
                        valueArray  = [];

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    hasGetAll = "getAll" in objectStore;
                    request = hasGetAll ? objectStore['getAll']() : objectStore['openCursor']();
                    request['onsuccess'] = function (event) {
                        var cursor = event['target']['result'];
                        if (!hasGetAll && cursor) {
                            valueArray.push(cursor['value']);
                            cursor['continue']();
                        } else {
                            if (isFunction(onsuccess)) {
                                onsuccess(hasGetAll ? cursor : valueArray);
                            }
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: getAll", store);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: getAll", store);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.getAll", err);
        }
    };

    IDBHelperAsync.prototype['getItemSubset'] = function (store, key, subset) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store),
                        request;

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    request = objectStore['get'](key);
                    request['onsuccess'] = function (event) {
                        var obj = {},
                            it;

                        for (it in subset) {
                            if (subset.hasOwnProperty(it)) {
                                obj[it] = event['target']['result'][it];
                            }
                        }

                        if (isFunction(onsuccess)) {
                            onsuccess(obj);
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: getItemSubset", key);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: getItemSubset", key);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.getItemSubset", err);
        }
    };

    IDBHelperAsync.prototype['getItem'] = function (store, key) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store),
                        request;

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    request = objectStore['get'](key);
                    request['onsuccess'] = function (event) {
                        if (isFunction(onsuccess)) {
                            onsuccess(event['target']['result']);
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: getItem", key);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: getItem", key);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.getItem", err);
        }
    };

    IDBHelperAsync.prototype['setItem'] = function (store, obj) {
        try {
            var onsuccess = this['onsuccess'],
                onabort   = this['onabort'],
                onerror   = this['onerror'],
                that      = this,
                retry     = true,
                timeout;

            delete this['onsuccess'];
            delete this['onblocked'];
            delete this['onabort'];
            delete this['onerror'];
            delete this['oncomplete'];
            if (!this['available']) {
                if (isFunction(onabort)) {
                    onabort({"message": "Indexed DB is not available"});
                }

                return false;
            }

            function waiting() {
                if (that['ready']) {
                    if (timeout) {
                        window.clearTimeout(timeout);
                    }

                    var objectStore = that['transaction'](store, "READ_WRITE"),
                        request;

                    if (!objectStore) {
                        internal['error']("Error: transaction failure");
                        return isFunction(onerror) ? onerror({"message": "Transaction was undefined or null"}) : false;
                    }

                    request = objectStore['put'](obj);
                    request['onsuccess'] = function (event) {
                        if (isFunction(onsuccess)) {
                            onsuccess(event);
                        }
                    };

                    request['onabort'] = function (event) {
                        internal['error']("Abort: setItem", obj);
                        if (isFunction(onabort)) {
                            onabort(event);
                        }
                    };

                    request['onerror'] = function (event) {
                        internal['error']("Error: setItem", obj);
                        if (isFunction(onerror)) {
                            onerror(event);
                        }
                    };
                } else {
                    if (!timeout) {
                        timeout = window.setTimeout(function () {
                            retry = false;
                            internal['warn']("DB action timeout");
                            if (isFunction(onabort)) {
                                onabort({"message": "DB action timeout"});
                            }
                        }, that['adelay']);
                    }

                    if (retry) {
                        window.setTimeout(waiting, that['rdelay']);
                    }
                }

                return true;
            }

            waiting();
            return true;
        } catch (err) {
            return throwError("IDBHelperAsync.setItem", err);
        }
    };

    //////////////////////////////////////////////////////
    //                   Variables Object Helper
    // Getters and setters for dealing with private variables
    //////////////////////////////////////////////////////

    function VarsHelper() {
        if (arguments[0] === inheriting) {
            return;
        }

        this['vars'] = {};
        this['length'] = 0;
    }

    VarsHelper.prototype['setAll'] = function (obj) {
        if (!isPlainObject(obj)) {
            throwError("VarsHelper.setAll", new TypeError(obj + " is not a plain object"));
        }

        this['vars'] = obj;
        this['length'] = lengthOf(this['vars']);
        return this;
    };

    VarsHelper.prototype['getAll'] = function () {
        return this['vars'];
    };

    VarsHelper.prototype['deleteAll'] = function () {
        this['vars'] = {};
        this['length'] = 0;
        return this;
    };

    VarsHelper.prototype['setItem'] = function (name, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.setItem", new TypeError(name + " is an invalid identifier"));
        }

        this['vars'][name] = value;
        this['length'] = lengthOf(this['vars']);
        return this['vars'][name];
    };

    VarsHelper.prototype['getItem'] = function (name, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.getItem", new TypeError(name + " is an invalid identifier"));
        }

        return name in this['vars'] ? this['vars'][name] : value;
    };

    VarsHelper.prototype['getList'] = function (name, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.getList", new TypeError(name + " is an invalid identifier"));
        }

        value = setContent(value, "");
        if (!isString(value) && hasContent(value)) {
            throwError("VarsHelper.getList", new TypeError(value + " is an invalid value"));
        }

        var item = this['getItem'](name, value);
        if (!isString(item) && hasContent(item)) {
            throwError("VarsHelper.getList", new TypeError(item + " is an invalid item"));
        }

        return item['toList']();
    };

    VarsHelper.prototype['deleteItem'] = function (name) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.deleteItem", new TypeError(name + " is an invalid identifier"));
        }

        delete this['vars'][name];
        this['length'] = lengthOf(this['vars']);
        return this;
    };

    VarsHelper.prototype['incItem'] = function (name, step, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.incItem", new TypeError(name + " is an invalid identifier"));
        }

        step = setContent(step, 1);
        if (!isNumber(step) || !hasContent(step)) {
            throwError("VarsHelper.incItem", new TypeError(step + " is not a number"));
        }

        var item = name in this['vars'] ? this['getItem'](name, value) : setContent(value, 0);
        if (!isNumber(item) || !hasContent(item)) {
            throwError("VarsHelper.incItem", new TypeError(name + ": " + item + " is not a number"));
        }

        return this['setItem'](name, item += step);
    };

    VarsHelper.prototype['decItem'] = function (name, step, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.decItem", new TypeError(name + " is an invalid identifier"));
        }

        step = setContent(step, 1);
        if (!isNumber(step) || !hasContent(step)) {
            throwError("VarsHelper.decItem", new TypeError(step + " is not a number"));
        }

        var item = name in this['vars'] ? this['getItem'](name, value) : setContent(value, 0);
        if (!isNumber(item) || !hasContent(item)) {
            throwError("VarsHelper.decItem", new TypeError(name + ": " + item + " is not a number"));
        }

        return this['setItem'](name, item -= step);
    };

    VarsHelper.prototype['copyItem'] = function (name, value) {
        if (!isString(name) || !hasContent(name)) {
            throwError("VarsHelper.copyItem", new TypeError(name + " is an invalid identifier"));
        }

        var item = this['getItem'](name, value);
        if (isDefined(item)) {
            try {
                return JSON.copy(this['getItem'](name, value));
            } catch (err) {
                return throwError("VarsHelper.copyItem", new TypeError("Can not copy item " + name), err);
            }
        } else {
            return item;
        }
    };

    VarsHelper.prototype['copyAll'] = function () {
        if (isPlainObject(this['vars'])) {
            try {
                return JSON.copy(this['vars']);
            } catch (err) {
                return throwError("VarsHelper.copyAll", new TypeError("Can not copy internal object"), err);
            }
        } else {
            return throwError("VarsHelper.copyAll", new TypeError("Invalid internal object"), this['vars']);
        }
    };

    //////////////////////////////////////////////////////
    //                   Schedule Vars Helper
    // Getters and setters for dealing with schedule variables
    //////////////////////////////////////////////////////

    function ScheduleVarsHelper() {
        if (arguments[0] === inheriting) {
            return;
        }

        VarsHelper.call(this);
    }

    //ScheduleVarsHelper.prototype = new VarsHelper(inheriting);
    ScheduleVarsHelper['swiss'](VarsHelper, 'setAll', 'getAll', 'deleteAll', 'setItem', 'getItem', 'deleteItem', 'copyItem', 'copyAll');

    ScheduleVarsHelper['base'] = VarsHelper.prototype;

    ScheduleVarsHelper.prototype['_setItem'] = ScheduleVarsHelper['base']['setItem'];

    ScheduleVarsHelper.prototype['setItem'] = function (name, seconds, randomSecs) {
        if (!isNumber(seconds) || seconds < 0) {
            throwError("ScheduleVarsHelper.setItem", new TypeError(seconds + " is an invalid number"));
        }

        var now = Date.now();
        return ScheduleVarsHelper['base']['setItem'].call(this, name, {
                'last': now,
                'next': now + (seconds * 1000) + (Math.floor(Math.random() * (!isNumber(randomSecs) || randomSecs < 0 ? 0 : randomSecs)) * 1000)
            });
    };

    ScheduleVarsHelper.prototype['check'] = function (name) {
        var item = ScheduleVarsHelper['base']['getItem'].call(this, name);
        return isPlainObject(item) ? item['next'] < Date.now() : true;
    };

    ScheduleVarsHelper.prototype['since'] = function (name_or_number, seconds) {
        var item,
            value;

        if (isNaN2(name_or_number)) {
            item = ScheduleVarsHelper['base']['getItem'].call(this, name_or_number);
            value = isPlainObject(item) ? item['last'] : 0;
        } else {
            value = name_or_number;
        }

        return value < (Date.now() - 1000 * seconds);
    };

    //////////////////////////////////////////////////////
    //                   Schedule Storage Helper
    // Getters and setters for dealing with schedule storage
    //////////////////////////////////////////////////////

    function ScheduleStorageHelper(id, key, options, keyName) {
        if (arguments[0] === inheriting) {
            return;
        }

        if (!isString(id) || !hasContent(id)) {
            throwError("ScheduleStorageHelper", new TypeError(id + " is an invalid identifier"));
        }

        if (!isString(key) || !hasContent(key)) {
            throwError("ScheduleStorageHelper", new TypeError(key + " is an invalid key"));
        }

        if (!isPlainObject(options)) {
            throwError("ScheduleStorageHelper", new TypeError(options + " is an invalid option type"));
        }

        ScheduleVarsHelper.call(this);
        this['id'] = id;
        keyName = hasContent(keyName) && isString(keyName) ? keyName : "key";
        this['keyName'] = keyName;
        this[keyName] = key;
        this['storage'] = new StorageHelper(options);
        this['load']();
    }

    ScheduleStorageHelper.prototype = new ScheduleVarsHelper(inheriting);

    ScheduleStorageHelper['base'] = ScheduleVarsHelper.prototype;

    ScheduleStorageHelper.prototype['load'] = function () {
        ScheduleStorageHelper['base']['setAll'].call(this, this['storage']['getItem'](this['id'], {}));
        if (!isPlainObject(ScheduleStorageHelper['base']['getAll'].call(this)) || isEmptyObject(ScheduleStorageHelper['base']['getAll'].call(this))) {
            ScheduleStorageHelper['base']['deleteAll'].call(this);
        }

        if (!hasContent(ScheduleStorageHelper['base']['getItem'].call(this, this['keyName']))) {
            ScheduleStorageHelper['base']['_setItem'].call(this, this['keyName'], this[this['keyName']]);
            this['save']();
        }

        return this;
    };

    ScheduleStorageHelper.prototype['save'] = function () {
        this['storage']['setItem'](this['id'], ScheduleStorageHelper['base']['getAll'].call(this));
        return this;
    };

    ScheduleStorageHelper.prototype['erase'] = function () {
        ScheduleStorageHelper['base']['deleteAll'].call(this);
        ScheduleStorageHelper['base']['setItem'].call(this, this['keyName'], this[this['keyName']]);
        this['save']();
        return this;
    };

    ScheduleStorageHelper.prototype['setAll'] = function (obj) {
        ScheduleStorageHelper['base']['setAll'].call(this, obj);
        this['save']();
        return this;
    };

    ScheduleStorageHelper.prototype['setItem'] = function (name, seconds, randomSecs) {
        if (name === this['keyName']) {
            throwError("ScheduleStorageHelper.setItem", new TypeError(name + " is a reserved identifier"));
        }

        var schedule = ScheduleStorageHelper['base']['setItem'].call(this, name, seconds, randomSecs);
        this['save']();
        return schedule;
    };

    ScheduleStorageHelper.prototype['setKey'] = function (value) {
        if (!isDefined(value)) {
            throwError("ScheduleStorageHelper.setKey", new TypeError(value + " is 'undefined' or 'null'"));
        }

        if (!compare(ScheduleStorageHelper['base']['getItem'].call(this, this['keyName']), value)) {
            ScheduleStorageHelper['base']['_setItem'].call(this, this['keyName'], value);
            this['save']();
        }

        return this;
    };

    ScheduleStorageHelper.prototype['getKey'] = function () {
        return ScheduleStorageHelper['base']['getItem'].call(this, this['keyName']);
    };

    ScheduleStorageHelper.prototype['deleteItem'] = function (name) {
        ScheduleStorageHelper['base']['deleteItem'].call(this, name);
        this['save']();
        return this;
    };

    //////////////////////////////////////////////////////
    //                   Local Storage Config Helper
    // Getters and setters for dealing with configuration options
    //////////////////////////////////////////////////////

    function ConfigHelper(id, key, options, keyName) {
        if (arguments[0] === inheriting) {
            return;
        }

        if (!isString(id) || !hasContent(id)) {
            throwError("ConfigHelper", new TypeError(id + " is an invalid identifier"));
        }

        if (!isString(key) || !hasContent(key)) {
            throwError("ConfigHelper", new TypeError(key + " is an invalid key"));
        }

        if (!isPlainObject(options)) {
            throwError("ConfigHelper", new TypeError(options + " is an invalid option type"));
        }

        VarsHelper.call(this);
        this['id'] = id;
        keyName = hasContent(keyName) && isString(keyName) ? keyName : "key";
        this['keyName'] = keyName;
        this[keyName] = key;
        this['storage'] = new StorageHelper(options);
        this['load']();
    }

    ConfigHelper.prototype = new VarsHelper(inheriting);

    ConfigHelper['base'] = VarsHelper.prototype;

    ConfigHelper.prototype['load'] = function () {
        ConfigHelper['base']['setAll'].call(this, this['storage']['getItem'](this['id'], {}));
        if (!isPlainObject(ConfigHelper['base']['getAll'].call(this)) || isEmptyObject(ConfigHelper['base']['getAll'].call(this))) {
            ConfigHelper['base']['deleteAll'].call(this);
        }

        if (!hasContent(ConfigHelper['base']['getItem'].call(this, this['keyName']))) {
            ConfigHelper['base']['setItem'].call(this, this['keyName'], this[this['keyName']]);
            this['save']();
        }

        return this;
    };

    ConfigHelper.prototype['save'] = function () {
        this['storage']['setItem'](this['id'], ConfigHelper['base']['getAll'].call(this));
        return this;
    };

    ConfigHelper.prototype['erase'] = function () {
        ConfigHelper['base']['deleteAll'].call(this);
        ConfigHelper['base']['setItem'].call(this, this['keyName'], this[this['keyName']]);
        this['save']();
        return this;
    };

    ConfigHelper.prototype['setAll'] = function (obj) {
        ConfigHelper['base']['setAll'].call(this, obj);
        this['save']();
        return this;
    };

    ConfigHelper.prototype['setItem'] = function (name, value) {
        if (name === this['keyName']) {
            throwError("ConfigHelper.setItem", new TypeError(name + " is a reserved identifier"));
        }

        if (!isDefined(value)) {
            throwError("ConfigHelper.setItem", new TypeError(value + " is 'undefined' or 'null'"));
        }

        if (!compare(ConfigHelper['base']['getItem'].call(this, name), value)) {
            ConfigHelper['base']['setItem'].call(this, name, value);
            this['save']();
        }

        return value;
    };

    ConfigHelper.prototype['setKey'] = function (value) {
        if (!isDefined(value)) {
            throwError("ConfigHelper.setKey", new TypeError(value + " is 'undefined' or 'null'"));
        }

        if (!compare(this['getKey'](), value)) {
            ConfigHelper['base']['setItem'].call(this, this['keyName'], value);
            this['save']();
        }

        return this;
    };

    ConfigHelper.prototype['getKey'] = function () {
        return ConfigHelper['base']['getItem'].call(this, this['keyName']);
    };

    ConfigHelper.prototype['deleteItem'] = function (name) {
        ConfigHelper['base']['deleteItem'].call(this, name);
        this['save']();
        return this;
    };

    ConfigHelper.prototype['incItem'] = function (name, step, value) {
        var item = ConfigHelper['base']['incItem'].call(this, name, step, value);
        this['save']();

        return item;
    };

    ConfigHelper.prototype['decItem'] = function (name, step, value) {
        var item = ConfigHelper['base']['decItem'].call(this, name, step, value);
        this['save']();

        return item;
    };

    //////////////////////////////////////////////////////
    //                   inputTypes
    // Discover which HTML5 input types are available
    //////////////////////////////////////////////////////

    inputTypes = (function (props) {
        var i    = 0,
            bool = false,
            len  = ui32(props.length),
            f    = document.createElement("input"),
            it   = {},
            defaultView;

        for (i = 0; i < len ; i += 1) {
            f.setAttribute('type', props[i]);
            bool = f.type !== 'text';
            // Chrome likes to falsely purport support, so we feed it a textual value;
            // if that doesnt succeed then we know there's a custom UI
            if (bool) {
                f.value = ":)";
                if (/^range$/.test(f.type) && !isUndefined(f.style.WebkitAppearance)) {
                    document.documentElement.appendChild(f);
                    defaultView = document.defaultView;
                    // Safari 2-4 allows the smiley as a value, despite making a slider
                    // Mobile android web browser has false positive, so must
                    // check the height to see if the widget is actually there.
                    bool = defaultView.getComputedStyle && defaultView.getComputedStyle(f, null).WebkitAppearance !== 'textfield' && (f.offsetHeight !== 0);
                    document.documentElement.removeChild(f);
                /*
                } else if (/^(search|tel)$/.test(f.type)) {
                    // Spec doesnt define any special parsing or detectable UI behaviors so we pass these through as true
                    // Interestingly, opera fails the earlier test, so it doesn't even make it here.
                */
                } else if (/^(url|email)$/.test(f.type)) {
                    // Real url and email support comes with prebaked validation.
                    bool = f.checkValidity && f.checkValidity() === false;
                } else {
                    // If the upgraded input compontent rejects the :) text, we got a winner
                    bool = f.value !== ":)";
                }
            }

            it[props[i]] = !!bool;
        }

        return it;
    }('search tel url email datetime date month week time datetime-local number range color'.split(' ')));

    ///////////////////////////
    //       Prototypes
    ///////////////////////////

    ///////////////////////////
    //       String
    ///////////////////////////

    if (!('ucFirst' in String.prototype)) {
        String.prototype['ucFirst'] = function () {
            return this.charAt(0).toUpperCase() + this.substr(1);
        };
    }

    if (!('ucWords' in String.prototype)) {
        String.prototype['ucWords'] = function () {
            return this.replace(new RegExp("^(.)|\\s(.)", "g"), function ($1) {
                return $1.toUpperCase();
            });
        };
    }

    if (!('stripHTML' in String.prototype)) {
        String.prototype['stripHTML'] = function () {
            return this.replace(new RegExp("<[^>]+>", "g"), '').replace(/&nbsp;/g, '');
        };
    }

    if (!('stripHtmlJunk' in String.prototype)) {
        String.prototype['stripHtmlJunk'] = function () {
            return this.replace(new RegExp("\\&[^;]+;", "g"), '');
        };
    }

    if (!('stripTRN' in String.prototype)) {
        String.prototype['stripTRN'] = function () {
            return this.replace(/[\t\r\n]/g, '');
        };
    }

    if (!('uniConv' in String.prototype)) {
        String.prototype['uniConv'] = function () {
            return this.replace(/\\u([0-9a-f]{4})/gmi, function ($1, $2) {
                return String.fromCharCode(parseInt($2, 16));
            });
        };
    }

    if (!('unescapeDouble' in String.prototype)) {
        String.prototype['unescapeDouble'] = function () {
                /**
                 * @const
                 * @type {Object.<string, string>}
                 */
            var meta = {
                    "t": "\t",
                    "n": "\n",
                    "r": "\r",
                    "f": "\f",
                    "b": "\b",
                    '"': '"',
                    "'": "'",
                    "/": "/"
                };

            return this.replace(new RegExp("\\\\(.)", "gm"), function ($1, $2) {
                return meta[$2];
            });
        };
    }

    if (!('escapeHTML' in String.prototype)) {
        String.prototype['escapeHTML'] = function (method) {
            method = method === true ? method : false;
                /**
                 * The escaped string.
                 * @type {string}
                 */
            var str = '',
                div;

            if (method) {
                // This method uses standard Javascript replace method
                str = this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            } else {
                // This method uses the browsers own HTML rendering engine
                div = document.createElement('div');
                div.textContent = this;
                str = div.innerHTML;
            }

            return str;
        };
    }

    if (!('unescapeHTML' in String.prototype)) {
        String.prototype['unescapeHTML'] = function (method) {
            method = method === true ? method : false;
                /**
                 * The unescaped string.
                 * @type {string}
                 */
            var str = '',
                div;

            if (method) {
                // This method uses standard Javascript replace method
                str = this.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
            } else {
                // This method uses the browsers own HTML rendering engine
                div = document.createElement('div');
                div.innerHTML = this;
                str = div.textContent;
            }

            return str;
        };
    }

    // outerTrim recognises more Unicode whitespaces than native trim implimentations
    // see ECMA-262 5th edition about BOM as whitespace
    /**
     * trim whiteSpace lookup table
     * @const
     * @type {Object.<number, number>}
     */
    String['whiteSpace'] = {
        0x0009 : 1, // Tab
        0x000a : 1, // Line Feed
        0x000b : 1, // Vertical Tab
        0x000c : 1, // Form Feed
        0x000d : 1, // Carriage Return
        0x0020 : 1, // Space
        0x0085 : 1, // Next line
        0x00a0 : 1, // No-break space
        0x1680 : 1, // Ogham space mark
        0x180e : 1, // Mongolian vowel separator
        0x2000 : 1, // En quad
        0x2001 : 1, // Em quad
        0x2002 : 1, // En space
        0x2003 : 1, // Em space
        0x2004 : 1, // Three-per-em space
        0x2005 : 1, // Four-per-em space
        0x2006 : 1, // Six-per-em space
        0x2007 : 1, // Figure space
        0x2008 : 1, // Punctuation space
        0x2009 : 1, // Thin space
        0x200a : 1, // Hair space
        0x200b : 1, // Zero width space
        0x2028 : 1, // Line separator
        0x2029 : 1, // Paragraph separator
        0x202f : 1, // Narrow no-break space
        0x205f : 1, // Medium mathematical space
        0x3000 : 1, // Ideographic space
        0xfeff : 1  // Byte Order Mark
    };

    /**
     * trim whiteSpace unicoded string for RegExp
     * @const
     * @type {string}
     */
    String['whiteSpaceRX'] = "\\u0009\\u000a\\u000b\\u000c\\u000d\\u0020\\u0085\\u00a0\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u200b\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff";

    // Emulates a native trim plus options.
    // arg.rx is set to true, then a RegExp is used
    // arg.end takes 'both' (default), left', 'right'
    // arg.list takes an array of character code strings to trim otherwise the default is used
    // e.g arg.list = ["0009", "000a", "000b", "000c"]
    if (!('outerTrim' in String.prototype)) {
        String.prototype['outerTrim'] = function (arg) {
            arg = arg ? arg : {};
            var s = '',
                b = 0,
                c = ui32(this.length),
                e = c - 1,
                l,
                r,
                w,
                i = 0;

            if (e > -1) {
                if (arg['rx']) {
                    if (arg['list']) {
                        w = '';
                        for (i = ui32(arg['list'].length) - 1; i >= 0; i -= 1) {
                            w += "\\u" + arg['list'][i];
                        }
                    } else {
                        w = String['whiteSpaceRX'];
                    }

                    l = new RegExp("^[" + w + "]*");
                    r = new RegExp("[" + w + "]*$");
                    switch (arg['end']) {
                    case 'left':
                        s = this.replace(l, '');
                        break;
                    case 'right':
                        s = this.replace(r, '');
                        break;
                    default:
                        s = this.replace(l, '').replace(r, '');
                    }
                } else {
                    if (arg['list']) {
                        w = {};
                        for (i = ui32(arg['list'].length) - 1; i >= 0; i -= 1) {
                            w[parseInt(arg['list'][i], 16)] = 1;
                        }
                    } else {
                        w = String['whiteSpace'];
                    }

                    // trim end
                    while (w[this.charCodeAt(e)]) {
                        e -= 1;
                    }

                    // trim start
                    e += 1;
                    if (e) {
                        while (w[this.charCodeAt(b)]) {
                            b += 1;
                        }
                    }

                    switch (arg['end']) {
                    case 'left':
                        s = this.substring(b, c);
                        break;
                    case 'right':
                        s = this.substring(0, e);
                        break;
                    default:
                        s = this.substring(b, e);
                    }
                }
            }

            return s;
        };
    }

    if (!('hasIndexOf' in String.prototype)) {
        String.prototype['hasIndexOf'] = function (o) {
            return this.indexOf(o) >= 0 ? true : false;
        };
    }

    // No native trimRight then use outerTrim
    if (!('trimLeft' in String.prototype)) {
        String.prototype['trimLeft'] = function (arg) {
            arg = arg ? arg : {};
            arg['end'] = 'left';
            return this['outerTrim'](arg);
        };
    }

    // No native trimRight then use outerTrim
    if (!('trimRight' in String.prototype)) {
        String.prototype['trimRight'] = function (arg) {
            arg = arg ? arg : {};
            arg['end'] = 'right';
            return this['outerTrim'](arg);
        };
    }

    // Trims all inner whitespace to just a single space
    if (!('innerTrim' in String.prototype)) {
        String.prototype['innerTrim'] = function (arg) {
            arg = arg ? arg : {};
            arg['end'] = 'both';
            delete arg['list'];
            var i = this['outerTrim'](arg);
            return this.replace(i, i.replace(new RegExp("[" + String['whiteSpaceRX'] + "]+", "g"), ' '));
        };
    }

    // No native trim then use outerTrim
    if (!('trim' in String.prototype)) {
        String.prototype['trim'] = String.prototype['outerTrim'];
    }

    if (!('parseFloat' in String.prototype)) {
        String.prototype['parseFloat'] = function (x) {
            return x >= 0 ? parseFloat(parseFloat(this).toFixed(x >= 0 && x <= 20 ? x : 20)) : parseFloat(this);
        };
    }

    if (!('parseInt' in String.prototype)) {
        String.prototype['parseInt'] = function (x) {
            return parseInt(this, (x >= 2 && x <= 36) ? x : 10);
        };
    }

    // pads a string left with a char until length reached
    if (!('lpad' in String.prototype)) {
        String.prototype['lpad'] = function (s, l) {
            var t = this.toString();
            while (ui32(t.length) < l) {
                t = s + t;
            }

            return t;
        };
    }

    // pads a string right with a char until length reached
    if (!('rpad' in String.prototype)) {
        String.prototype['rpad'] = function (s, l) {
            var t = this.toString();
            while (ui32(t.length) < l) {
                t = t + s;
            }

            return t;
        };
    }

    // Return the URL query of a string
    if (!('getUrlQuery' in String.prototype)) {
        String.prototype['getUrlQuery'] = function () {
            var t = this.toString(),
                q = -1,
                x = -1;

            x = t.indexOf('?');
            q = x >= 0 ? x : q;
            x = t.indexOf('&');
            q = x >= 0 && (q < 0 || (q >= 0 && x < q)) ? x : q;
            x = t.indexOf('#');
            q = x >= 0 && (q < 0 || (q >= 0 && x < q)) ? x : q;
            t = q >= 0 ? t.substr(q) : '';
            return t;
        };
    }

    // Strip the URL query from a string
    if (!('stripUrlQuery' in String.prototype)) {
        String.prototype['stripUrlQuery'] = function () {
            var t = this.toString(),
                x = -1;

            x = t.indexOf('?');
            t = x >= 0 ? t.substr(0, x) : t;
            x = t.indexOf('&');
            t = x >= 0 ? t.substr(0, x) : t;
            x = t.indexOf('#');
            t = x >= 0 ? t.substr(0, x) : t;
            return t;
        };
    }

    // Returns the basename of a string and optionally trim an extension
    if (!('basename' in String.prototype)) {
        String.prototype['basename'] = function (s) {
            var t = this.toString(),
                x = -1;

            t = t[ui32(t.length) - 1] === '/' ? t.substr(0, ui32(t.length) - 1) : t;
            x = t['stripUrlQuery']().lastIndexOf('/');
            t = x >= 0 ? t.substr(x + 1) : t;
            x = isDefined(s) && !isUndefined(s.toString) ? t.lastIndexOf(s.toString()) : -1;
            t = x >= 0 ? t.substr(0, x) : t;
            return t;
        };
    }

    // Returns the directory part of a string
    if (!('dirname' in String.prototype)) {
        String.prototype['dirname'] = function () {
            var t = this.toString(),
                x = -1;

            t = t['stripUrlQuery']();
            x = t.lastIndexOf('/');
            t = x >= 0 ? t.substr(0, x + 1) : t;
            return t;
        };
    }

    // Returns the file extension part of a string
    if (!('fileext' in String.prototype)) {
        String.prototype['fileext'] = function () {
            var t = this.toString(),
                x = -1;

            t = t['basename']();
            t = t['stripUrlQuery']();
            x = t.lastIndexOf('.');
            t = x >= 0 ? t.substr(x) : '';
            return t;
        };
    }

    if (!('regex' in String.prototype)) {
        String.prototype['regex'] = function (r) {
            var a  = this.match(r),
                i  = 0,
                l  = 0,
                rx = null;

            if (a) {
                if (r.global) {
                    // Try to match '(blah' but not '\(blah' or '(?:blah' - ignore invalid regexp
                    if (new RegExp("(^|[^\\\\]|[^\\\\](\\\\\\\\)*)\\([^?]").test(r.source)) {
                        rx = new RegExp(r.source, (r.ignoreCase ? 'i' : '') + (r.multiline ? 'm' : ''));
                    }
                } else {
                    a.shift();
                }

                l = ui32(a.length);
                for (i = l - 1; i >= 0; i -= 1) {
                    if (a[i]) {
                        if (rx) {
                            a[i] = String.prototype['regex'].call(a[i], rx);
                        } else {
                            if (a[i].search(/^[\-+]?\d*\.?\d+(?:e[\-+]?\d+)?$/i) >= 0) {
                                a[i] = parseFloat(a[i]);
                            }
                        }
                    }
                }
            }

            return !rx && l === 1 ? a[0] : a;
        };
    }

    // Turns text delimited with new lines and commas into an array.
    // Primarily for use with user input text boxes.
    if (!('toList' in String.prototype)) {
        String.prototype['toList'] = function () {
            var a = [],
                t = this.replace(/,/g, '\n').split('\n'),
                i = 0,
                l = ui32(t.length);

            for (i = 0; i < l; i += 1) {
                if (t[i] !== '') {
                    a.push(isNaN2(t[i]) ? t[i].trim() : parseFloat(t[i]));
                }
            }

            return a;
        };
    }

    /*jslint bitwise: false */
    if (!('Utf8encode' in String.prototype)) {
        String.prototype['Utf8encode'] = function () {
            var s = '';
            s = this.replace(/[\u0080-\u07ff]/g, function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            });

            s = s.replace(/[\u0800-\uffff]/g, function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });

            return s;
        };
    }

    if (!('Utf8decode' in String.prototype)) {
        String.prototype['Utf8decode'] = function () {
            var s = '';
            s = this.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (c) {
                return String.fromCharCode(((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f));
            });

            s = s.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (c) {
                return String.fromCharCode((c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f);
            });

            return s;
        };
    }

    if (!('AESEncrypt' in String.prototype)) {
        String.prototype['AESEncrypt'] = function (password, nBits, utf8encode) {
            return (new Aes(password, nBits, utf8encode))['encrypt'](this);
        };
    }

    if (!('AESDecrypt' in String.prototype)) {
        String.prototype['AESDecrypt'] = function (password, nBits, utf8encode) {
            return (new Aes(password, nBits, utf8encode))['decrypt'](this);
        };
    }

    if (!('Base64encode' in String.prototype)) {
        String.prototype['Base64encode'] = function (utf8encode) {
            var o1, o2, o3, bits, h1, h2, h3, h4,
                c     = 0,
                l     = 0,
                coded = '',
                plain = '',
                e     = [],
                pad   = '',
                nChar = String.fromCharCode(0);

            utf8encode = isUndefined(utf8encode) ? false : utf8encode;
            plain = utf8encode ? this['Utf8encode']() : this;
            c = ui32(plain.length) % 3;
            if (c > 0) {
                while (c < 3) {
                    pad += '=';
                    plain += nChar;
                    c += 1;
                }
            }

            l = ui32(plain.length);
            for (c = 0; c < l; c += 3) {
                o1 = plain.charCodeAt(c);
                o2 = plain.charCodeAt(c + 1);
                o3 = plain.charCodeAt(c + 2);
                bits = o1 << 16 | o2 << 8 | o3;
                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;
                e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            }

            coded = e.join('');
            coded = coded.slice(0, ui32(coded.length) - ui32(pad.length)) + pad;
            return coded;
        };
    }

    if (!('Base64decode' in String.prototype)) {
        String.prototype['Base64decode'] = function (utf8decode) {
            var o1, o2, o3, h1, h2, h3, h4, bits,
                d     = [],
                plain = '',
                coded = '',
                c     = 0,
                l     = 0;

            utf8decode = isUndefined(utf8decode) ? false : utf8decode;
            coded = utf8decode ? this['Utf8decode']() : this;
            l = ui32(coded.length);
            for (c = 0; c < l; c += 4) {
                h1 = b64.indexOf(coded.charAt(c));
                h2 = b64.indexOf(coded.charAt(c + 1));
                h3 = b64.indexOf(coded.charAt(c + 2));
                h4 = b64.indexOf(coded.charAt(c + 3));
                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                o1 = bits >>> 16 & 0xff;
                o2 = bits >>> 8 & 0xff;
                o3 = bits & 0xff;
                d[c / 4] = String.fromCharCode(o1, o2, o3);
                if (h4 === 0x40) {
                    d[c / 4] = String.fromCharCode(o1, o2);
                }

                if (h3 === 0x40) {
                    d[c / 4] = String.fromCharCode(o1);
                }
            }

            plain = d.join('');
            return utf8decode ? plain['Utf8decode']() : plain;
        };
    }

    if (!('MD5' in String.prototype)) {
        String.prototype['MD5'] = function (utf8encode) {
            function addUnsigned(lX, lY) {
                var lX4     = (lX & 0x40000000),
                    lY4     = (lY & 0x40000000),
                    lX8     = (lX & 0x80000000),
                    lY8     = (lY & 0x80000000),
                    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);

                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }

                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function fF(x, y, z) {
                return (x & y) | ((~x) & z);
            }

            function fG(x, y, z) {
                return (x & z) | (y & (~z));
            }

            function fH(x, y, z) {
                return (x ^ y ^ z);
            }

            function fI(x, y, z) {
                return (y ^ (x | (~z)));
            }

            function fFF(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(fF(b, c, d), x), ac));
                return addUnsigned(a['ROTL'](s), b);
            }

            function fGG(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(fG(b, c, d), x), ac));
                return addUnsigned(a['ROTL'](s), b);
            }

            function fHH(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(fH(b, c, d), x), ac));
                return addUnsigned(a['ROTL'](s), b);
            }

            function fII(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(fI(b, c, d), x), ac));
                return addUnsigned(a['ROTL'](s), b);
            }

            function convertToWordArray(textMsg) {
                var lWordCount           = 0,
                    lMessageLength       = ui32(textMsg.length),
                    lNumberOfWords_temp1 = lMessageLength + 8,
                    lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
                    lNumberOfWords       = (lNumberOfWords_temp2 + 1) * 16,
                    lWordArray           = [], //Array(lNumberOfWords - 1),
                    lBytePosition        = 0,
                    lByteCount           = 0;

                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (textMsg.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount += 1;
                }

                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            }

            function wordToHex(lValue) {
                var WordToHexValue      = "",
                    WordToHexValue_temp = "",
                    lByte               = 0,
                    lCount              = 0;

                for (lCount = 0; lCount <= 3; lCount += 1) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue += WordToHexValue_temp.substr(ui32(WordToHexValue_temp.length) - 2, 2);
                }

                return WordToHexValue;
            }

            var x   = [],
                a   = 0x67452301,
                b   = 0xEFCDAB89,
                c   = 0x98BADCFE,
                d   = 0x10325476,
                S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21,
                k   = 0,
                l   = 0,
                AA  = 0x00000000,
                BB  = 0x00000000,
                CC  = 0x00000000,
                DD  = 0x00000000,
                msg = '';

            utf8encode = isUndefined(utf8encode) ? true : utf8encode;
            msg = utf8encode ? this['Utf8encode']() : this;
            x = convertToWordArray(msg);
            for (k = 0, l = ui32(x.length); k < l; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = fFF(a, b, c, d, x[k + 0],  S11, 0xD76AA478);
                d = fFF(d, a, b, c, x[k + 1],  S12, 0xE8C7B756);
                c = fFF(c, d, a, b, x[k + 2],  S13, 0x242070DB);
                b = fFF(b, c, d, a, x[k + 3],  S14, 0xC1BDCEEE);
                a = fFF(a, b, c, d, x[k + 4],  S11, 0xF57C0FAF);
                d = fFF(d, a, b, c, x[k + 5],  S12, 0x4787C62A);
                c = fFF(c, d, a, b, x[k + 6],  S13, 0xA8304613);
                b = fFF(b, c, d, a, x[k + 7],  S14, 0xFD469501);
                a = fFF(a, b, c, d, x[k + 8],  S11, 0x698098D8);
                d = fFF(d, a, b, c, x[k + 9],  S12, 0x8B44F7AF);
                c = fFF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = fFF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = fFF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = fFF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = fFF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = fFF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = fGG(a, b, c, d, x[k + 1],  S21, 0xF61E2562);
                d = fGG(d, a, b, c, x[k + 6],  S22, 0xC040B340);
                c = fGG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = fGG(b, c, d, a, x[k + 0],  S24, 0xE9B6C7AA);
                a = fGG(a, b, c, d, x[k + 5],  S21, 0xD62F105D);
                d = fGG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = fGG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = fGG(b, c, d, a, x[k + 4],  S24, 0xE7D3FBC8);
                a = fGG(a, b, c, d, x[k + 9],  S21, 0x21E1CDE6);
                d = fGG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = fGG(c, d, a, b, x[k + 3],  S23, 0xF4D50D87);
                b = fGG(b, c, d, a, x[k + 8],  S24, 0x455A14ED);
                a = fGG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = fGG(d, a, b, c, x[k + 2],  S22, 0xFCEFA3F8);
                c = fGG(c, d, a, b, x[k + 7],  S23, 0x676F02D9);
                b = fGG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = fHH(a, b, c, d, x[k + 5],  S31, 0xFFFA3942);
                d = fHH(d, a, b, c, x[k + 8],  S32, 0x8771F681);
                c = fHH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = fHH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = fHH(a, b, c, d, x[k + 1],  S31, 0xA4BEEA44);
                d = fHH(d, a, b, c, x[k + 4],  S32, 0x4BDECFA9);
                c = fHH(c, d, a, b, x[k + 7],  S33, 0xF6BB4B60);
                b = fHH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = fHH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = fHH(d, a, b, c, x[k + 0],  S32, 0xEAA127FA);
                c = fHH(c, d, a, b, x[k + 3],  S33, 0xD4EF3085);
                b = fHH(b, c, d, a, x[k + 6],  S34, 0x4881D05);
                a = fHH(a, b, c, d, x[k + 9],  S31, 0xD9D4D039);
                d = fHH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = fHH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = fHH(b, c, d, a, x[k + 2],  S34, 0xC4AC5665);
                a = fII(a, b, c, d, x[k + 0],  S41, 0xF4292244);
                d = fII(d, a, b, c, x[k + 7],  S42, 0x432AFF97);
                c = fII(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = fII(b, c, d, a, x[k + 5],  S44, 0xFC93A039);
                a = fII(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = fII(d, a, b, c, x[k + 3],  S42, 0x8F0CCC92);
                c = fII(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = fII(b, c, d, a, x[k + 1],  S44, 0x85845DD1);
                a = fII(a, b, c, d, x[k + 8],  S41, 0x6FA87E4F);
                d = fII(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = fII(c, d, a, b, x[k + 6],  S43, 0xA3014314);
                b = fII(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = fII(a, b, c, d, x[k + 4],  S41, 0xF7537E82);
                d = fII(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = fII(c, d, a, b, x[k + 2],  S43, 0x2AD7D2BB);
                b = fII(b, c, d, a, x[k + 9],  S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }

            return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        };
    }

    if (!('SHA1' in String.prototype)) {
        String.prototype['SHA1'] = function (utf8encode) {
            var blockstart = 0,
                i          = 0,
                j          = 0,
                W          = [80],
                H0         = 0x67452301,
                H1         = 0xEFCDAB89,
                H2         = 0x98BADCFE,
                H3         = 0x10325476,
                H4         = 0xC3D2E1F0,
                A          = null,
                B          = null,
                C          = null,
                D          = null,
                E          = null,
                temp       = null,
                msg        = '',
                msg_len    = 0,
                len        = 0,
                word_array = [];

            utf8encode = isUndefined(utf8encode) ? true : utf8encode;
            msg = utf8encode ? this['Utf8encode']() : this;
            msg_len = ui32(msg.length);
            for (i = 0; i < msg_len - 3; i += 4) {
                j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
                word_array.push(j);
            }

            switch (msg_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
                break;
            default:
            }

            word_array.push(i);
            while ((ui32(word_array.length) % 16) !== 14) {
                word_array.push(0);
            }

            word_array.push(msg_len >>> 29);
            word_array.push((msg_len << 3) & 0x0ffffffff);
            for (blockstart = 0, len = ui32(word_array.length); blockstart < len; blockstart += 16) {
                for (i = 0; i < 16; i += 1) {
                    W[i] = word_array[blockstart + i];
                }

                for (i = 16; i <= 79; i += 1) {
                    W[i] = (W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])['ROTL'](1);
                }

                A = H0;
                B = H1;
                C = H2;
                D = H3;
                E = H4;
                for (i = 0; i <= 19; i += 1) {
                    temp = (A['ROTL'](5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = B['ROTL'](30);
                    B = A;
                    A = temp;
                }

                for (i = 20; i <= 39; i += 1) {
                    temp = (A['ROTL'](5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = B['ROTL'](30);
                    B = A;
                    A = temp;
                }

                for (i = 40; i <= 59; i += 1) {
                    temp = (A['ROTL'](5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = B['ROTL'](30);
                    B = A;
                    A = temp;
                }

                for (i = 60; i <= 79; i += 1) {
                    temp = (A['ROTL'](5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = B['ROTL'](30);
                    B = A;
                    A = temp;
                }

                H0 = (H0 + A) & 0x0ffffffff;
                H1 = (H1 + B) & 0x0ffffffff;
                H2 = (H2 + C) & 0x0ffffffff;
                H3 = (H3 + D) & 0x0ffffffff;
                H4 = (H4 + E) & 0x0ffffffff;
            }

            temp = H0['toHexStr']() + H1['toHexStr']() + H2['toHexStr']() + H3['toHexStr']() + H4['toHexStr']();
            return temp.toLowerCase();
        };
    }

    if (!('SHA256' in String.prototype)) {
        String.prototype['SHA256'] = function (utf8encode) {
            function fSigma0(x) {
                return Number(2)['ROTR'](x) ^ Number(13)['ROTR'](x) ^ Number(22)['ROTR'](x);
            }

            function fSigma1(x) {
                return Number(6)['ROTR'](x) ^ Number(11)['ROTR'](x) ^ Number(25)['ROTR'](x);
            }

            function sigma0(x) {
                return Number(7)['ROTR'](x) ^ Number(18)['ROTR'](x) ^ (x >>> 3);
            }

            function sigma1(x) {
                return Number(17)['ROTR'](x) ^ Number(19)['ROTR'](x) ^ (x >>> 10);
            }

            function fCh(x, y, z)  {
                return (x & y) ^ (~x & z);
            }

            function fMaj(x, y, z) {
                return (x & y) ^ (x & z) ^ (y & z);
            }

                /**
                 * @const
                 * @type {Array.<number>}
                 */
            var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
                     0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
                     0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
                     0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
                     0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                     0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
                     0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
                     0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2],
                H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19],
                msg = '',
                l = 0,
                N = 0,
                M = [],
                i = 0,
                j = 0,
                W = [],
                t = 0,
                a = 0,
                b = 0,
                c = 0,
                d = 0,
                e = 0,
                f = 0,
                g = 0,
                h = 0,
                T1,
                T2;

            utf8encode = isUndefined(utf8encode) ? true : utf8encode;
            msg = utf8encode ? this['Utf8encode']() : this;
            msg += String.fromCharCode(0x80);
            l = ui32(msg.length) / 4 + 2;
            N = Math.ceil(l / 16);
            M = [];

            for (i = 0; i < N; i += 1) {
                M[i] = [];
                for (j = 0; j < 16; j += 1) {
                    M[i][j] = (msg.charCodeAt(i * 64 + j * 4) << 24) | (msg.charCodeAt(i * 64 + j * 4 + 1) << 16) | (msg.charCodeAt(i * 64 + j * 4 + 2) << 8) | (msg.charCodeAt(i * 64 + j * 4 + 3));
                }
            }

            M[N - 1][14] = ((ui32(msg.length) - 1) * 8) / Math.pow(2, 32);
            M[N - 1][14] = Math.floor(M[N - 1][14]);
            M[N - 1][15] = ((ui32(msg.length) - 1) * 8) & 0xffffffff;
            W = [];
            for (i = 0; i < N; i += 1) {
                for (t = 0; t < 16; t += 1) {
                    W[t] = M[i][t];
                }

                for (t = 16; t < 64; t += 1) {
                    W[t] = (sigma1(W[t - 2]) + W[t - 7] + sigma0(W[t - 15]) + W[t - 16]) & 0xffffffff;
                }

                a = H[0];
                b = H[1];
                c = H[2];
                d = H[3];
                e = H[4];
                f = H[5];
                g = H[6];
                h = H[7];
                for (t = 0; t < 64; t += 1) {
                    T1 = h + fSigma1(e) + fCh(e, f, g) + K[t] + W[t];
                    T2 = fSigma0(a) + fMaj(a, b, c);
                    h = g;
                    g = f;
                    f = e;
                    e = (d + T1) & 0xffffffff;
                    d = c;
                    c = b;
                    b = a;
                    a = (T1 + T2) & 0xffffffff;
                }

                H[0] = (H[0] + a) & 0xffffffff;
                H[1] = (H[1] + b) & 0xffffffff;
                H[2] = (H[2] + c) & 0xffffffff;
                H[3] = (H[3] + d) & 0xffffffff;
                H[4] = (H[4] + e) & 0xffffffff;
                H[5] = (H[5] + f) & 0xffffffff;
                H[6] = (H[6] + g) & 0xffffffff;
                H[7] = (H[7] + h) & 0xffffffff;
            }

            return H[0]['toHexStr']() + H[1]['toHexStr']() + H[2]['toHexStr']() + H[3]['toHexStr']() + H[4]['toHexStr']() + H[5]['toHexStr']() + H[6]['toHexStr']() + H[7]['toHexStr']();
        };
    }

    ///////////////////////////
    //       Number
    ///////////////////////////

    // pads a number left with a char until length reached
    if (!('lpad' in Number.prototype)) {
        Number.prototype['lpad'] = function (s, l) {
            return this.toString()['lpad'](s, l);
        };
    }

    // pads a number right with a char until length reached
    if (!('rpad' in Number.prototype)) {
        Number.prototype['rpad'] = function (s, l) {
            return this.toString()['rpad'](s, l);
        };
    }

    // Set x decimal points of a number
    if (!('dp' in Number.prototype)) {
        Number.prototype['dp'] = function (x) {
            return parseFloat(this.toFixed(x >= 0 && x <= 20 ? x : 0));
        };
    }

    /*jslint bitwise: false */
    // For use with SHA1 and SHA256
    if (!('toHexStr' in Number.prototype)) {
        Number.prototype['toHexStr'] = function () {
            var s = "",
                v = 0,
                i = 0;

            for (i = 7; i >= 0; i -= 1) {
                v = (this >>> (i * 4)) & 0xf;
                s += v.toString(16);
            }

            return s;
        };
    }

    // For use with SHA1 and MD5
    if (!('ROTL' in Number.prototype)) {
        Number.prototype['ROTL'] = function (x) {
            return (this << x) | (this >>> (32 - x));
        };
    }

    // For use with SHA256
    if (!('ROTR' in Number.prototype)) {
        Number.prototype['ROTR'] = function (x) {
            return (x >>> this) | (x << (32 - this));
        };
    }
    /*jslint bitwise: true */

    // Determine if a number is an integer
    if (!('isInt' in Number.prototype)) {
        Number.prototype['isInt'] = function () {
            var y = parseInt(this, 10);
            if (isNaN2(y)) {
                return false;
            }

            return this === y && this.toString() === y.toString();
        };
    }

    // Returns the SI value of a number
    if (!('SI' in Number.prototype)) {
        Number.prototype['SI'] = function (x) {
            x = x >= 0 && x <= 20 ? x : 1;
            var a = Math.abs(this);
            if (a >= 1e12) {
                return (this / 1e12).toFixed(x) + 'T';
            }

            if (a >= 1e9) {
                return (this / 1e9).toFixed(x) + 'B';
            }

            if (a >= 1e6) {
                return (this / 1e6).toFixed(x) + 'M';
            }

            if (a >= 1e3) {
                return (this / 1e3).toFixed(x) + 'k';
            }

            return this;
        };
    }

    // Add commas to a number, optionally converting to a Fixed point number
    if (!('addCommas' in Number.prototype)) {
        Number.prototype['addCommas'] = function (x) {
            var n = isNumber(x) ? this.toFixed(x) : this.toString(),
                d = n.indexOf('.'),
                e = '',
                r = /(\d+)(\d{3})/;

            if (d !== -1) {
                e = '.' + n.substring(d + 1, ui32(n.length));
                n = n.substring(0, d);
            }

            while (r.test(n)) {
                n = n.replace(r, '$1' + ',' + '$2');
            }

            return n + e;
        };
    }

    ///////////////////////////
    //       Date
    ///////////////////////////

    if (!('now' in Date)) {
        Date['now'] = function () {
            return +new Date();
        };
    }

    if (!('toISOString' in Date.prototype)) {
        Date.prototype['toISOString'] = function () {
            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()                       + '-' +
                (this.getUTCMonth() + 1)['lpad']("0", 2)    + '-' +
                (this.getUTCDate())['lpad']("0", 2)         + 'T' +
                (this.getUTCHours())['lpad']("0", 2)        + ':' +
                (this.getUTCMinutes())['lpad']("0", 2)      + ':' +
                (this.getUTCSeconds())['lpad']("0", 2)      + '.' +
                (this.getUTCMilliseconds())['lpad']("0", 2) + 'Z' : null;
        };
    }

    // For use with the Date['format'] prototype
    Date['replaceChars'] = {
        'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

        'longMonths': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

        'shortDays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

        'longDays': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

        // Day
        'd': function () {
            return this.getDate()['lpad']("0", 2);
        },

        'D': function () {
            return Date['replaceChars']['shortDays'][this.getDay()];
        },

        'j': function () {
            return this.getDate();
        },

        'l': function () {
            return Date['replaceChars']['longDays'][this.getDay()];
        },

        'N': function () {
            return this.getDay() + 1;
        },

        'S': function () {
            return (this.getDate() % 10 === 1 && this.getDate() !== 11 ? 'st' : (this.getDate() % 10 === 2 && this.getDate() !== 12 ? 'nd' : (this.getDate() % 10 === 3 && this.getDate() !== 13 ? 'rd' : 'th')));
        },

        'w': function () {
            return this.getDay();
        },

        'z': function () {
            return "Not Yet Supported";
        },

        // Week
        'W': function () {
            return "Not Yet Supported";
        },

        // Month
        'F': function () {
            return Date['replaceChars']['longMonths'][this.getMonth()];
        },

        'm': function () {
            return (this.getMonth() + 1)['lpad']("0", 2);
        },

        'M': function () {
            return Date['replaceChars']['shortMonths'][this.getMonth()];
        },

        'n': function () {
            return this.getMonth() + 1;
        },

        't': function () {
            return "Not Yet Supported";
        },

        // Year
        'L': function () {
            return (((this.getFullYear() % 4 === 0) && (this.getFullYear() % 100 !== 0)) || (this.getFullYear() % 400 === 0)) ? '1' : '0';
        },

        'o': function () {
            return "Not Supported";
        },

        'Y': function () {
            return this.getFullYear();
        },

        'y': function () {
            return ('' + this.getFullYear()).substr(2);
        },

        // Time
        'a': function () {
            return this.getHours() < 12 ? 'am' : 'pm';
        },

        'A': function () {
            return this.getHours() < 12 ? 'AM' : 'PM';
        },

        'B': function () {
            return "Not Yet Supported";
        },

        'g': function () {
            return this.getHours() % 12 || 12;
        },

        'G': function () {
            return this.getHours();
        },

        'h': function () {
            return (this.getHours() % 12 || 12)['lpad']("0", 2);
        },

        'H': function () {
            return this.getHours()['lpad']("0", 2);
        },

        'i': function () {
            return this.getMinutes()['lpad']("0", 2);
        },

        's': function () {
            return this.getSeconds()['lpad']("0", 2);
        },

        // Timezone
        'e': function () {
            return "Not Yet Supported";
        },

        'I': function () {
            return "Not Supported";
        },

        'O': function () {
            return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60))['lpad']("0", 2) + '00';
        },

        'P': function () {
            return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60))['lpad']("0", 2) + ':' + (Math.abs(this.getTimezoneOffset() % 60))['lpad']("0", 2);
        },

        'T': function () {
            var m = this.getMonth(),
                r = '';

            this.setMonth(0);
            r = this.toTimeString().replace(new RegExp("^.+ \\(?([^\\)]+)\\)?$"), '$1');
            this.setMonth(m);
            return r;
        },

        'Z': function () {
            return -this.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        'c': function () {
            return this['format']("Y-m-d") + "T" + this['format']("H:i:sP");
        },

        'r': function () {
            return this.toString();
        },

        'U': function () {
            return this.getTime() / 1000;
        }
    };

    // Simulates PHP's date function
    if (!('format' in Date.prototype)) {
        Date.prototype['format'] = function (format) {
            var i = 0,
                l = 0,
                c = '',
                s = '',
                r = Date['replaceChars'];

            for (i = 0, l = ui32(format.length); i < l; i += 1) {
                c = format.charAt(i);
                if (r[c]) {
                    s += r[c].call(this);
                } else {
                    s += c;
                }
            }

            return s;
        };
    }

    ///////////////////////////
    //       Object
    ///////////////////////////

    ///////////////////////////
    //       Array
    ///////////////////////////

    // Returns true if the array contains the search value else false
    if (!('hasIndexOf' in Array.prototype)) {
        Array.prototype['hasIndexOf'] = String.prototype['hasIndexOf'];
    }

    // Sort array by number
    if (!('sortNum' in Array.prototype)) {
        Array.prototype['sortNum'] = function () {
            return this.sort(function (a, b) {
                return a - b;
            });
        };
    }

    // The anti-sort, this shuffle() method will take the contents of the array and randomize them.
    // This method is surprisingly useful and not just for shuffling an array of virtual cards.
    if (!('shuffle' in Array.prototype)) {
        Array.prototype['shuffle'] = function () {
            var rnd = 0,
                i = 0,
                tmp;

            for (i = ui32(this.length); i > 0; i -= 1) {
                rnd = parseInt(Math.random() * i, 10);
                i -= 1;
                tmp = this[i];
                this[i] = this[rnd];
                this[rnd] = tmp;
            }
        };
    }

    // If you need to be able to compare Arrays this is the prototype to do it.
    // Pass an Array you want to compare and if they are identical the method will return true.
    // If there's a difference it will return false.
    // The match must be identical so '80' is not the same as 80.
    // Does not handle array of objects
    if (!('compare' in Array.prototype)) {
        Array.prototype['compare'] = function (testArr) {
            var i = 0,
                l = ui32(testArr.length);

            if (ui32(this.length) !== l) {
                return false;
            }

            for (i = 0; i < l; i += 1) {
                if (this[i]['compare']) {
                    if (!this[i]['compare'](testArr[i])) {
                        return false;
                    }
                }

                if (this[i] !== testArr[i]) {
                    return false;
                }
            }

            return true;
        };
    }

    // Array.indexOf() is a nice method but this extension is a little more powerful and flexible.
    // First it will return an array of all the indexes it found (it will return false if it doesn't find anything).
    // Second in addition to passing the usual string or number to look for you can actually pass a regular expression,
    // which makes this the ultimate Array prototype in my book.
    if (!('find' in Array.prototype)) {
        Array.prototype['find'] = function (searchStr) {
            var r = false,
                i = 0,
                l = ui32(this.length);

            for (i = 0; i < l; i += 1) {
                if (isFunction(searchStr)) {
                    if (searchStr.test(this[i])) {
                        if (!r) {
                            r = [];
                        }

                        r.push(i);
                    }
                } else {
                    if (this[i] === searchStr) {
                        if (!r) {
                            r = [];
                        }

                        r.push(i);
                    }
                }
            }

            return r;
        };
    }

    // Return an array with no duplicates
    if (!('unique' in Array.prototype)) {
        Array.prototype['unique'] = function () {
            var o = {},
                i = 0,
                l = ui32(this.length),
                r = [];

            for (i = 0; i < l; i += 1) {
                o[this[i]] = this[i];
            }

            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    r.push(o[i]);
                }
            }

            return r;
        };
    }

    // Array support for older browsers
    if (!('indexOf' in Array.prototype)) {
        Array.prototype['indexOf'] = function (sEl) {
            /*jslint newcap: false, bitwise: false */
            var t = Object(this),
                l = ui32(t.length) >>> 0,
            /*jslint newcap: true, bitwise: true */
                n = 0,
                k = 0;

            if (l === 0) {
                return -1;
            }

            if (ui32(arguments.length) > 0) {
                n = Number(arguments[1]);
                if (n !== n) { // shortcut for verifying if it's NaN
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= l) {
                return -1;
            }

            for (k = n >= 0 ? n : Math.max(l - Math.abs(n), 0); k < l; k += 1) {
                if (k in t && t[k] === sEl) {
                    return k;
                }
            }

            return -1;
        };
    }

    if (!('lastIndexOf' in Array.prototype)) {
        Array.prototype['lastIndexOf'] = function (sEl) {
            /*jslint newcap: false, bitwise: false */
            var t = Object(this),
                l = ui32(t.length) >>> 0,
            /*jslint newcap: true, bitwise: true */
                n = l,
                k = 0;

            if (l === 0) {
                return -1;
            }

            if (ui32(arguments.length) > 0) {
                n = Number(arguments[1]);
                if (n !== n) {
                    n = 0;
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            k = n >= 0 ? Math.min(n, l - 1) : l - Math.abs(n);
            while (k >= 0) {
                if (k in t && t[k] === sEl) {
                    return k;
                }
            }

            return -1;
        };
    }

    if (!('shift' in Array.prototype)) {
        Array.prototype['shift'] = function () {
            var f = this[0];
            this.reverse();
            this.length = Math.max(ui32(this.length) - 1, 0);
            this.reverse();
            return f;
        };
    }

    if (!('unshift' in Array.prototype)) {
        Array.prototype['unshift'] = function () {
            this.reverse();
            for (var i = ui32(arguments.length) - 1; i >= 0; i -= 1) {
                this[ui32(this.length)] = arguments[i];
            }

            this.reverse();
            return ui32(this.length);
        };
    }

    if (!('filter' in Array.prototype)) {
        Array.prototype['filter'] = function (fn) {
            canCall(fn);
            var l = ui32(this.length),
                r = [],
                t = arguments[1],
                i = 0,
                v;

            for (i = 0; i < l; i += 1) {
                if (i in this) {
                    v = this[i]; // in case fn mutates this
                    if (fn.call(t, v, i, this)) {
                        r.push(v);
                    }
                }
            }

            return r;
        };
    }

    if (!('forEach' in Array.prototype)) {
        Array.prototype['forEach'] = function (fn) {
            canCall(fn);
            var l = ui32(this.length),
                t = arguments[1],
                i = 0;

            for (i = 0; i < l; i += 1) {
                if (i in this) {
                    fn.call(t, this[i], i, this);
                }
            }
        };
    }

    if (!('map' in Array.prototype)) {
        Array.prototype['map'] = function (fn) {
            canCall(fn);
            var l = ui32(this.length),
                r = [],
                t = arguments[1],
                i = 0;

            for (i = 0; i < l; i += 1) {
                if (i in this) {
                    r[i] = fn.call(t, this[i], i, this);
                }
            }

            return r;
        };
    }

    if (!('some' in Array.prototype)) {
        Array.prototype['some'] = function (fn) {
            canCall(fn);
            var l = ui32(this.length),
                t = arguments[1],
                i = 0;

            for (i = 0; i < l; i += 1) {
                if (i in this && fn.call(t, this[i], i, this)) {
                    return true;
                }
            }

            return false;
        };
    }

    if (!('every' in Array.prototype)) {
        Array.prototype['every'] = function (fn) {
            canCall(fn);
            var l = ui32(this.length),
                t = arguments[1],
                i = 0,
                /*jslint newcap: false */
                a = Object(this);
                /*jslint newcap: true */

            for (i = 0; i < l; i += 1) {
                if (i in a) {
                    if (!fn.call(t, a[i], i, a)) {
                        return false;
                    }
                }
            }

            return true;
        };
    }

    if (!('remove' in Array.prototype)) {
        Array.prototype.remove = function (from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
    }

    if (!('removeByValue' in Array.prototype)) {
        Array.prototype['removeByValue'] = function (v) {
            if (this.hasIndexOf(v)) {
                for (var i = ui32(this.length) - 1; i >= 0 ; i -= 1) {
                    if (this[i] === v) {
                        this.splice(i, 1);
                    }
                }
            }

            return this;
        };
    }

    if (!('removeFirstValue' in Array.prototype)) {
        Array.prototype['removeFirstValue'] = function (v) {
            var i = this.indexOf(v);
            if (i >= 0) {
                this.splice(i, 1);
            }

            return this;
        };
    }

    if (!('removeLastValue' in Array.prototype)) {
        Array.prototype['removeLastValue'] = function (v) {
            var i = this.lastIndexOf(v);
            if (i >= 0) {
                this.splice(i, 1);
            }

            return this;
        };
    }

    ///////////////////////////
    //       JSON2
    ///////////////////////////

    /*
    Modification is based on
    http://www.JSON.org/json2.js
    2010-03-20
    Public Domain.

    Creates a global JSON2 object containing two methods: stringify and parse.
    Copied to JSON object if it does not exist natively in the browser.

        JSON2.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    function g(n) {
                        // Format integers to have at least three digits.
                        return n < 100 ? '0' + n : n;
                    }

                    return isFinite(this.valueOf()) ?
                        this.getUTCFullYear()        + '-' +
                        f(this.getUTCMonth() + 1)    + '-' +
                        f(this.getUTCDate())         + 'T' +
                        f(this.getUTCHours())        + ':' +
                        f(this.getUTCMinutes())      + ':' +
                        f(this.getUTCSeconds())      + '.' +
                        g(this.getUTCMilliseconds()) + 'Z' : null;
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON2.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON2.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON2.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON2.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON2.parse(text, function (key, value) {
                var a;
                if (isString(value)) {
                    a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON2.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (isString(value) && value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    */

    if (!('toJSON' in Date.prototype)) {
        Date.prototype['toJSON'] = Date.prototype['toISOString'];
    }

    if (!('toJSON' in String.prototype)) {
        String.prototype['toJSON'] = function () {
            return this.valueOf();
        };
    }

    if (!('toJSON' in Number.prototype)) {
        Number.prototype['toJSON'] = function () {
            return isFinite(this) ? this.valueOf() : null;
        };
    }

    if (!('toJSON' in Boolean.prototype)) {
        Boolean.prototype['toJSON'] = function () {
            return this.valueOf();
        };
    }

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return isString(c) ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }

    // Produce a string from holder[key].
    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.
        if (isDefined(value) && isFunction(value['toJSON'])) {
            value = value['toJSON'](key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (isFunction(rep)) {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.
        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
        case 'object':
            // If the type is 'object', we might be dealing with an object or an array or null.
            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.
            if (!value) {
                return 'null';
            }

            // Make an array to hold the partial results of stringifying this object value.
            gap += indent;
            partial = [];
            // Is the value an array?
            if (isArray(value)) {
                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-JSON values.
                length = ui32(value.length);
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                // Join all of the elements together, separated with commas, and wrap them in brackets.
                v = ui32(partial.length) === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            // If the replacer is an array, use it to select the members to be stringified.
            if (isArray(rep)) {
                length = ui32(rep.length);
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (isString(k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            // Otherwise, iterate through all of the keys in the object.
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            // Join all of the member texts together, separated with commas, and wrap them in braces.
            v = ui32(partial.length) === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }

        return undefined;
    }

    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.
    JSON2['stringify'] = function (value, replacer, space) {
        var i;
        gap = '';
        indent = '';

        // If the space parameter is a number, make an indent string containing that many spaces.
        if (isNumber(space)) {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }
        } else if (isString(space)) {
            indent = space;
        }

        // If there is a replacer, it must be a function or an array. Otherwise, throw an error.
        rep = replacer;
        if (isDefined(replacer) && (!isFunction(replacer) || !isArray(replacer))) {
            throwError("JSON2.stringify", new TypeError(replacer + " is not a function or array'"));
        }

        // Make a fake root object containing our value under the key of ''. Return the result of stringifying the value.
        return str('', {'': value});
    };

    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.
    JSON2['parse'] = function (text, reviver) {
        var j,
            rx1 = new RegExp("^[\\],:{}\\s]*$"),
            rx2 = new RegExp("\\\\(?:[\"\\\\\\/bfnrt]|u[0-9a-fA-F]{4})", "g"),
            rx3 = new RegExp("\"[^\"\\\\\\n\\r]*\"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?", "g"),
            rx4 = new RegExp("(?:^|:|,)(?:\\s*\\[)+", "g");

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.
        function walk(holder, key) {
            var k, v, value = holder[key];
            if (isObject(value)) {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (!isUndefined(v)) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }

            return reviver.call(holder, key, value);
        }

        // Parsing happens in four stages. In the first stage, we replace certain
        // Unicode characters with escape sequences. JavaScript handles many characters
        // incorrectly, either silently deleting them, or treating them as line endings.
        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '", "\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

        // In the second stage, we run the text against regular expressions that look
        // for non-JSON patterns. We are especially concerned with '()' and 'new'
        // because they can cause invocation, and '=' because it can cause mutation.
        // But just to be safe, we want to reject all unexpected forms.

        // We split the second stage into 4 regexp operations in order to work around
        // crippling inefficiencies in IE's and Safari's regexp engines. First we
        // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
        // replace all simple value tokens with ']' characters. Third, we delete all
        // open brackets that follow a colon or comma or that begin the text. Finally,
        // we look to see that the remaining characters are only whitespace or ']' or
        // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
        if (rx1.test(text.replace(rx2, '@').replace(rx3, ']').replace(rx4, ''))) {
            // In the third stage we use the eval function to compile the text into a
            // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
            // in JavaScript: it can begin a block or an object literal. We wrap the text
            // in parens to eliminate the ambiguity.
            /*jslint evil: true */
            j = eval('(' + text + ')');
            /*jslint evil: false */
            // In the optional fourth stage, we recursively walk the new structure, passing
            // each name/value pair to a reviver function for possible transformation.
            return isFunction(reviver) ? walk({'': j}, '') : j;
        }

        // If the text is not JSON parseable, then a SyntaxError is thrown.
        return throwError("JSON2.parse", new SyntaxError('text is not JSON parseable'));
    };

    /*
    // Create a JSON2 object only if one does not already exist.
    if (!('JSON2' in window)) {
        window['JSON2'] = JSON2;
    }
    */

    // Create a JSON object only if one does not already exist.
    if (!('JSON' in window)) {
        window['JSON'] = JSON2;
    }

    // Create a JSON copy object only if one does not already exist.
    if (!('copy' in window['JSON'])) {
        window['JSON']['copy'] = function (obj) {
            return JSON['parse'](JSON['stringify'](obj));
        };
    }

    ///////////////////////////
    //       JSON.hpack
    ///////////////////////////

    /** json.hpack
     * description JSON Homogeneous Collection Packer
     * version     1.0.1
     * author      Andrea Giammarchi
     * license     Mit Style License
     * project     http://github.com/WebReflection/json.hpack/tree/master
     * blog        http://webreflection.blogspot.com/
     */

    // @author  Andrea Giammarchi
    (function (cache) {
        /** JSON.hpack(homogeneousCollection:Array[, compression:Number]):Array
         * @param   {Array}   collection   mono dimensional homogeneous collection of objects to pack
         * @param   {?number} compression  optional compression level from 0 to 4 - default 0
         * @return  {Array}   optimized collection
         */
        JSON['hpack'] = function (collection, compression) {
            try {
                var i       = 0,
                    //indexOf = Array.prototype.indexOf,
                    header  = [],
                    index   = 0,
                    k       = 0,
                    length  = 0,
                    len     = 0,
                    row     = [],
                    j       = 0,
                    l       = 0,
                    value,
                    item,
                    key,
                    first,
                    result;

                if (3 < compression) {    // try every compression level and returns the best option
                    i = JSON['hbest'](collection);
                    result = cache[i];
                    cache = [];
                } else {                // compress via specified level (default 0)
                    result = [header];
                    first = collection[0];
                    // create list of property names
                    for (key in first) {
                        if (first.hasOwnProperty(key)) {
                            header[index] = key;
                            index += 1;
                        }
                    }

                    len = index;
                    index = 0;
                    // replace objects using arrays respecting header indexes order
                    for (i = 0, length = ui32(collection.length); i < length; i += 1) {
                        item = collection[i];
                        row = [];
                        for (j = 0; j < len; j += 1) {
                            row[j] = item[header[j]];
                        }

                        index += 1;
                        result[index] = row;
                    }

                    index += 1;
                    // compression 1, 2 or 3
                    if (0 < compression) {
                        // create a fixed enum type for each property (except numbers)
                        row = result[1];
                        for (j = 0; j < len; j += 1) {
                            if (!isNumber(row[j])) {
                                first = [];
                                header[j] = [header[j], first];
                                //first.indexOf = indexOf;
                                // replace property values with enum index (create entry in enum list if not present)
                                for (i = 1; i < index; i += 1) {
                                    value = result[i][j];
                                    l = first.indexOf(value);
                                    result[i][j] = l < 0 ? first.push(value) - 1 : l;
                                }
                            }
                        }
                    }

                    // compression 3 only
                    if (2 < compression) {
                        // Second Attemp:
                        // This compression is quite expensive.
                        // It calculates the length of all indexes plus the lenght
                        // of the enum against the length of values rather than indexes and without enum for each column
                        // In this way the manipulation will be hibryd but hopefully worthy in certain situation.
                        // not truly suitable for old client CPUs cause it could cost too much
                        for (j = 0; j < len; j += 1) {
                            if (isArray(header[j])) {
                                row = header[j][1];
                                value = [];
                                first = [];
                                k = 0;
                                for (i = 1; i < index; i += 1) {
                                    first[k] = result[i][j];
                                    value[k] = row[first[k]];
                                    k += 1;
                                }

                                if (ui32(JSON['stringify'](value).length) < ui32(JSON['stringify'](first.concat(row)).length)) {
                                    k = 0;
                                    for (i = 1; i < index; i += 1) {
                                        result[i][j] = value[k];
                                        k += 1;
                                    }

                                    header[j] = header[j][0];
                                }
                            }
                        }
                    } else if (1 < compression) { // compression 2 only
                        // compare the lenght of the entire collection with the length of the enum, if present
                        length -= Math.floor(length / 2);
                        for (j = 0; j < len; j += 1) {
                            if (isArray(header[j])) {
                                // if the collection length - (collection lenght / 2) is lower than enum length
                                // maybe it does not make sense to create extra characters in the string for each
                                // index representation
                                first = header[j][1];
                                if (length < ui32(first.length)) {
                                    for (i = 1; i < index; i += 1) {
                                        value = result[i][j];
                                        result[i][j] = first[value];
                                    }

                                    header[j] = header[j][0];
                                }
                            }
                        }
                    }

                    // if compression is at least greater than 0
                    if (0 < compression) {
                        // flat the header Array to remove useless brackets
                        for (j = 0; j < len; j += 1) {
                            if (isArray(header[j])) {
                                header.splice(j, 1, header[j][0], header[j][1]);
                                len += 1;
                                j += 1;
                            }
                        }
                    }
                }

                return result;
            } catch (err) {
                return throwError("JSON.hpack", err);
            }
        };

        /** JSON.hunpack(packedCollection:Array):Array
         * @param   {Array} collection   optimized collection to unpack
         * @return  {Array} original mono dimensional homogeneous collection of objects
         */
        JSON['hunpack'] = function (collection) {
            try {
                var result = [],
                    keys   = [],
                    header = collection[0],
                    len    = ui32(header.length),
                    length = ui32(collection.length),
                    index  = -1,
                    k      = -1,
                    i      = 0,
                    l      = 0,
                    j,
                    row,
                    anonymous;

                // compatible with every hpack compressed array
                // simply swaps arrays with key/values objects
                for (i = 0; i < len; i += 1) {
                    // list of keys
                    k += 1;
                    keys[k] = header[i];
                    // if adjacent value is an array (enum)
                    if (isArray(header[i + 1])) {
                        i += 1;
                        // replace indexes in the column
                        // using enum as collection
                        for (j = 1; j < length; j += 1) {
                            row = collection[j];
                            row[l] = header[i][row[l]];
                        }
                    }

                    l += 1;
                }

                for (i = 0, len = ui32(keys.length); i < len; i += 1) {
                    // replace keys with assignment operation ( test becomes o["test"]=a[index]; )
                    // make properties safe replacing " char
                    keys[i] = 'o["'.concat(keys[i].replace('"', "\\x22"), '"]=a[', i, '];');
                }

                // one shot anonymous function with "precompiled replacements"
                /*jslint evil: true */
                anonymous = new Function("o,a", keys.join("") + "return o;");
                /*jslint evil: false */
                for (j = 1; j < length; j += 1) {
                    // replace each item with runtime key/value pairs object
                    index += 1;
                    result[index] = anonymous({}, collection[j]);
                }

                return result;
            } catch (err) {
                return throwError("JSON.hunpack", err);
            }
        };

        /** JSON.hclone(packedCollection:Array):Array
         * @param   {Array} collection    optimized collection to clone
         * @return  {Array} a clone of the original collection
         */
        JSON['hclone'] = function (collection) {
            try {
                var clone  = [],
                    i      = 0,
                    length = ui32(collection.length);

                // avoid array modifications
                // it could be useful but not that frequent in "real life cases"
                for (i = 0; i < length; i += 1) {
                    clone[i] = collection[i].slice(0);
                }

                return clone;
            } catch (err) {
                return throwError("JSON.hclone", err);
            }
        };

        /** JSON.hbest(packedCollection:Array):Number
         * @param   {Array} collection   optimized collection to clone
         * @return  {number} best compression option
         */
        JSON['hbest'] = function (collection) {
            try {
                var i      = 0,
                    j      = 0,
                    len    = 0,
                    length = 0;

                // for each compression level [0-4] ...
                for (i = 0; i < 4; i += 1) {
                    // cache result
                    cache[i] = JSON['hpack'](collection, i);
                    // retrieve the JSON length
                    len = ui32(JSON['stringify'](cache[i]).length);
                    if (length === 0) {
                        length = len;
                    } else if (len < length) { // choose which one is more convenient
                        length = len;
                        j = i;
                    }
                }

                // return most convenient convertion
                // please note that with small amount of data
                // native JSON convertion could be smaller
                // [{"k":0}] ==> [["k"],[0]] (9 chars against 11)
                // above example is not real life example and as soon
                // as the list will have more than an object
                // hpack will start to make the difference:
                // [{"k":0},{"k":0}] ==> [["k"],[0],[0]] (17 chars against 15)
                return j;
            } catch (err) {
                return throwError("JSON.hbest", err);
            }
        };
    }([]));

    ///////////////////////////
    //       RISON
    ///////////////////////////

    /*
    Modification is based on
    http://www.RISON.org/RISON.js
    2010-03-20
    Public Domain.

    Creates a global RISON object containing two methods: stringify and parse.
    Copied to RISON object if it does not exist natively in the browser.

        RISON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a RISON text from a JavaScript value.

            When an object value is found, if the object contains a toRISON
            method, its toRISON method will be called and the result will be
            stringified. A toRISON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toRISON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toRISON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    function g(n) {
                        // Format integers to have at least three digits.
                        return n < 100 ? '0' + n : n;
                    }

                    return isFinite(this.valueOf()) ?
                        this.getUTCFullYear()        + '-' +
                        f(this.getUTCMonth() + 1)    + '-' +
                        f(this.getUTCDate())         + 'T' +
                        f(this.getUTCHours())        + ':' +
                        f(this.getUTCMinutes())      + ':' +
                        f(this.getUTCSeconds())      + '.' +
                        g(this.getUTCMilliseconds()) + 'Z' : null;
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have RISON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with RISON values.
            RISON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = RISON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = RISON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = RISON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        RISON.parse(text, reviver)
            This method parses a RISON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = RISON.parse(text, function (key, value) {
                var a;
                if (isString(value)) {
                    a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = RISON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (isString(value) && value.slice(0, 5) === 'Date(' && value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });
    */

    if (!('toRISON' in Date.prototype)) {
        Date.prototype['toRISON'] = Date.prototype['toJSON'];
    }

    if (!('toRISON' in String.prototype)) {
        String.prototype['toRISON'] = String.prototype['toJSON'];
    }

    if (!('toRISON' in Number.prototype)) {
        Number.prototype['toRISON'] = Number.prototype['toJSON'];
    }

    if (!('toRISON' in Boolean.prototype)) {
        Boolean.prototype['toRISON'] = Boolean.prototype['toJSON'];
    }

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    function quoteRison(string) {
        if (ui32(string.length) === 0) {
            return "''";
        }

        // Check if it's a valid ident
        if (RISON['id_ok'].test(string)) {
            return string;
        }

        // Escape special chars
        string = string.replace(/(['!])/mg, '!$1');
        return "'" + string + "'";
    }

    // Produce a string from holder[key].
    function encodeRison(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            value = holder[key];

        // If the value has a toRISON method, call it to obtain a replacement value.
        if (isDefined(value) && isFunction(value['toRISON'])) {
            value = value['toRISON'](key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.
        if (isFunction(rep)) {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.
        switch (typeof value) {
        case 'string':
            return quoteRison(value);
        case 'number':
            // RISON numbers must be finite. Encode non-finite numbers as null.
            // strip '+' out of exponent, '-' is ok though
            return isFinite(value) ? String(value).replace('+', '') : '!n';
        case 'boolean':
            return value ? '!t' : '!f';
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return '!n';
        case 'object':
            // If the type is 'object', we might be dealing with an object or an array or null.
            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.
            if (!value) {
                return '!n';
            }

            // Make an array to hold the partial results of stringifying this object value.
            //gap += indent;
            partial = [];
            // Is the value an array?
            if (isArray(value)) {
                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-RISON values.
                length = ui32(value.length);
                for (i = 0; i < length; i += 1) {
                    partial[i] = encodeRison(i, value) || '!n';
                }

                // Join all of the elements together, separated with commas, and wrap them in brackets.
                v = ui32(partial.length) === 0 ? '!()' : '!(' + partial.join(',') + ')';
                //gap = mind;
                return v;
            }

            // If the replacer is an array, use it to select the members to be stringified.
            if (isArray(rep)) {
                length = ui32(rep.length);
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (isString(k)) {
                        v = encodeRison(k, value);
                        if (v) {
                            partial.push(quoteRison(k) + ':' + v);
                        }
                    }
                }
            // Otherwise, iterate through all of the keys in the object.
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = encodeRison(k, value);
                        if (v) {
                            partial.push(quoteRison(k) + ':' + v);
                        }
                    }
                }
            }

            // The RISON spec recommends to sort the dictionaries by its keys to improve caching
            partial.sort(function (a, b) {
                a = a.split(':')[0];
                b = b.split(':')[0];
                return (a > b) - (a < b);
            });

            // Join all of the member texts together, separated with commas, and wrap them in braces.
            v = ui32(partial.length) === 0 ? '()' : '(' + partial.join(',') + ')';
            //gap = mind;
            return v;
        }

        return undefined;
    }

    // The stringify method takes a value and an optional replacer, and returns a RISON text.
    // The replacer can be a function that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided.
    RISON['encode'] = RISON['stringify'] = function (value, replacer) {
        // If there is a replacer, it must be a function or an array. Otherwise, throw an error.
        rep = replacer;
        if (isDefined(replacer) && (!isFunction(replacer) || !isArray(replacer))) {
            throwError("RISON.stringify", new TypeError(replacer + " is not a function or array'"));
        }

        // Make a fake root object containing our value under the key of ''. Return the result of stringifying the value.
        return encodeRison('', {'': value});
    };

    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid RISON text.
    RISON['parse'] = function (text, reviver) {
        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.
        function walk(holder, key) {
            var k, v, value = holder[key];
            if (isObject(value)) {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (!isUndefined(v)) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }

            return reviver.call(holder, key, value);
        }

        var j = RISON['decode'](text);
        if (!isUndefined(j)) {
            return isFunction(reviver) ? walk({'': j}, '') : j;
        }

        // If the text is not RISON parseable, then a SyntaxError is thrown.
        return throwError("RISON.parse", new SyntaxError('text is not RISON parseable'));
    };

    /*
     * we divide the uri-safe glyphs into three sets
     *   <rison> - used by rison                         ' ! : ( ) ,
     *   <reserved> - not common in strings, reserved    * @ $ & ; =
     *
     * we define <identifier> as anything that's not forbidden
     */

    /**
     * characters that are illegal as the start of an id
     * this is so ids can't look like numbers.
     */
    RISON['not_idstart'] = "-0123456789";

    /*
    not_idchar: risonList,

    id_ok: new RegExp('^[^\\-\\d' + risonList + '][^' + risonList + ']*$'),

    next_id: new RegExp('[^\\-\\d' + risonList + '][^' + risonList + ']*', 'g'),
    */

    /**
     *  rules for an uri encoder that is more tolerant than encodeURIComponent
     *
     *  encodeURIComponent passes  ~!*()-_.'
     *
     *  we also allow              ,:@$/
     *
     */
    RISON['uri_ok'] = {  // ok in url paths and in form query args
        '~': true,
        '!': true,
        '*': true,
        '(': true,
        ')': true,
        '-': true,
        '_': true,
        '.': true,
        ',': true,
        ':': true,
        '@': true,
        '$': true,
        "'": true,
        '/': true
    };

    /**
     * this is like encodeURIComponent() but quotes fewer characters.
     *
     * @see RISON.uri_ok
     *
     * encodeURIComponent passes   ~!*()-_.'
     * RISON.quote also passes   ,:@$/
     *   and quotes " " as "+" instead of "%20"
     */
    RISON['quote'] = function (x) {
        if (/^[\-A-Za-z0-9~!*()_.',:@$\/]*$/.test(x)) {
            return x;
        }

        return encodeURIComponent(x)
            .replace('%2C', ',', 'g')
            .replace('%3A', ':', 'g')
            .replace('%40', '@', 'g')
            .replace('%24', '$', 'g')
            .replace('%2F', '/', 'g')
            .replace('%20', '+', 'g');
    };

    /**
     * RISON-encode a javascript object without surrounding parens
     *
     */
    RISON['encode_object'] = function (v) {
        if (!isPlainObject(v)) {
            throwError("RISON.encode_object", new Error("expects an object argument"), v);
        }

        var r = encodeRison('', {'': v});
        return r.substring(1, ui32(r.length) - 1);
    };

    /**
     * RISON-encode a javascript array without surrounding parens
     *
     */
    RISON['encode_array'] = function (v) {
        if (!isArray(v)) {
            throwError("RISON.encode_array", new Error("expects an array argument"), v);
        }

        var r = encodeRison('', {'': v});
        return r.substring(2, ui32(r.length) - 1);
    };

    /**
     * RISON-encode and uri-encode a javascript structure
     *
     */
    RISON['encode_uri'] = function (v) {
        return RISON['quote'](encodeRison('', {'': v}));
    };

    /**
     * parse a RISON string into a javascript structure.
     *
     * this is the simplest decoder entry point.
     *
     *  based on Oliver Steele's OpenLaszlo-JSON
     *     http://osteele.com/sources/openlaszlo/json
     */
    RISON['decode'] = function (r) {
        var errcb = function (e) {
                throwError("RISON.decode", e);
            },
            p = new RISON['parser'](errcb);

        return p['parse'](r);
    };

    /**
     * parse an o-RISON string into a javascript structure.
     *
     * this simply adds parentheses around the string before parsing.
     */
    RISON['decode_object'] = function (r) {
        return RISON['decode']('(' + r + ')');
    };

    /**
     * parse an a-RISON string into a javascript structure.
     *
     * this simply adds array markup around the string before parsing.
     */
    RISON['decode_array'] = function (r) {
        return RISON['decode']('!(' + r + ')');
    };

    (function () {
        var l  = [],
            hi = 0,
            lo = 0,
            c  = '';

        for (hi = 0; hi < 16; hi += 1) {
            for (lo = 0; lo < 16; lo += 1) {
                if (hi + lo === 0) {
                    continue;
                }

                c = String.fromCharCode(hi * 16 + lo);
                if (! /\w|[\-_.\/~]/.test(c)) {
                    l.push('\\u00' + hi.toString(16) + lo.toString(16));
                }
            }
        }
        /**
         * characters that are illegal inside ids.
         * <rison> and <reserved> classes are illegal in ids.
         *
         */
        RISON['not_idchar'] = l.join('');
    }());

    RISON['not_idchar'] = " '!:(),*@$";

    (function () {
        var idrx = '[^' + RISON['not_idstart'].replace("-", "\\-") + RISON['not_idchar'] + '][^' + RISON['not_idchar'] + ']*';
        RISON['id_ok'] = new RegExp('^' + idrx + '$');
        // regexp to find the end of an id when parsing
        // g flag on the regexp is necessary for iterative regexp.exec()
        RISON['next_id'] = new RegExp(idrx, 'g');
    }());

    /**
     * construct a new parser object for reuse.
     *
     * @constructor
     * @class A Rison parser class.  You should probably
     *        use RISON.decode instead.
     * @see RISON.decode
     */
    RISON['parser'] = function (errcb) {
        this['errorHandler'] = errcb;
    };

    /**
     * a string containing acceptable whitespace characters.
     * by default the RISON decoder tolerates no whitespace.
     * to accept whitespace set RISON.parser.WHITESPACE = " \t\n\r\f";
     */
    RISON['parser']['WHITESPACE'] = "";

    // expose this as-is?
    RISON['parser'].prototype['setOptions'] = function (options) {
        if (options['errorHandler']) {
            this['errorHandler'] = options['errorHandler'];
        }
    };

    /**
     * parse a RISON string into a javascript structure.
     */
    RISON['parser'].prototype['parse'] = function (str) {
        this['string'] = str;
        this['index'] = 0;
        this['message'] = null;
        var value = this['readValue']();
        if (!this['message'] && this['next']()) {
            value = this['error']("unable to parse string as RISON: '" + RISON['encode'](str) + "'");
        }

        if (this['message'] && this['errorHandler']) {
            this['errorHandler'](this['message'], this['index']);
        }

        return value;
    };

    RISON['parser'].prototype['error'] = function (message) {
        this['message'] = message;
        return throwError("RISON.parser", new Error(message));
    };

    RISON['parser'].prototype['readValue'] = function () {
        var c = this['next'](),
            fn = c && this['table'][c],
            s,
            i,
            m,
            id;

        if (fn) {
            return fn.apply(this);
        }

        // fell through table, parse as an id

        s = this['string'];
        i = this['index'] - 1;

        // Regexp.lastIndex may not work right in IE before 5.5?
        // g flag on the regexp is also necessary
        RISON['next_id'].lastIndex = i;
        m = RISON['next_id'].exec(s);

        // console.log('matched id', i, r.lastIndex);

        if (ui32(m.length) > 0) {
            id = m[0];
            this['index'] = i + ui32(id.length);
            return id;  // a string
        }

        if (c) {
            return this['error']("invalid character: '" + c + "'");
        }

        return this['error']("empty expression");
    };

    RISON['parser']['parse_array'] = function (parser) {
        var ar = [],
            c,
            n;

        while ((c = parser['next']()) !== ')') {
            if (!c) {
                return parser['error']("unmatched '!('");
            }

            if (ui32(ar.length)) {
                if (c !== ',') {
                    parser['error']("missing ','");
                }
            } else if (c === ',') {
                return parser['error']("extra ','");
            } else {
                parser['index'] -= 1;
            }

            n = parser['readValue']();
            if (isUndefined(n)) {
                return undefined;
            }

            ar.push(n);
        }

        return ar;
    };

    RISON['parser']['bangs'] = {
        't': true,
        'f': false,
        'n': null,
        '(': RISON['parser']['parse_array']
    };

    RISON['parser'].prototype['table'] = {
        '!': function () {
            var s = this['string'],
                c = s.charAt(this['index']),
                x;

            this['index'] += 1;
            if (!c) {
                return this['error']('"!" at end of input');
            }

            x = RISON['parser']['bangs'][c];
            if (isFunction(x)) {
                return x.call(null, this);
            } else if (isUndefined(x)) {
                return this['error']('unknown literal: "!' + c + '"');
            }

            return x;
        },
        '(': function () {
            var o = {},
                c,
                count = 0,
                k,
                v;

            while ((c = this['next']()) !== ')') {
                if (count) {
                    if (c !== ',') {
                        this['error']("missing ','");
                    }
                } else if (c === ',') {
                    return this['error']("extra ','");
                } else {
                    this['index'] -= 1;
                }

                k = this['readValue']();
                if (isUndefined(k)) {
                    return undefined;
                }

                if (this['next']() !== ':') {
                    return this['error']("missing ':'");
                }

                v = this['readValue']();
                if (isUndefined(v)) {
                    return undefined;
                }

                o[k] = v;
                count += 1;
            }

            return o;
        },
        "'": function () {
            var s = this['string'],
                i = this['index'],
                start = i,
                segments = [],
                c = s.charAt(i);

            i += 1;
            while (c !== "'") {
                //if (i == s.length) return this['error']('unmatched "\'"');
                if (!c) {
                    return this['error']('unmatched "\'"');
                }

                if (c === '!') {
                    if (start < i - 1) {
                        segments.push(s.slice(start, i - 1));
                    }

                    c = s.charAt(i);
                    i += 1;
                    if ("!'".indexOf(c) >= 0) {
                        segments.push(c);
                    } else {
                        return this['error']('invalid string escape: "!' + c + '"');
                    }

                    start = i;
                }

                c = s.charAt(i);
                i += 1;
            }

            if (start < i - 1) {
                segments.push(s.slice(start, i - 1));
            }

            this['index'] = i;
            return ui32(segments.length) === 1 ? segments[0] : segments.join('');
        },
        // Also any digit.  The statement that follows this table
        // definition fills in the digits.
        '-': function () {
            var s = this['string'],
                i = this['index'],
                start = i - 1,
                state = 'int',
                permittedSigns = '-',
                /**
                 * @const
                 * @type {Object.<string, string>}
                 */
                transitions = {
                    'int+.' : 'frac',
                    'int+e' : 'exp',
                    'frac+e': 'exp'
                },
                c;

            do {
                c = s.charAt(i);
                i += 1;
                if (!c) {
                    break;
                }

                if ('0' <= c && c <= '9') {
                    continue;
                }

                if (permittedSigns.indexOf(c) >= 0) {
                    permittedSigns = '';
                    continue;
                }

                state = transitions[state + '+' + c.toLowerCase()];
                if (state === 'exp') {
                    permittedSigns = '-';
                }
            } while (state);

            i -= 1;
            this['index'] = i;
            s = s.slice(start, i);
            if (s === '-') {
                return this['error']("invalid number");
            }

            return Number(s);
        }
    };

    // copy table['-'] to each of table[i] | i <- '0'..'9':
    (function (table) {
        var i = 0;
        for (i = 0; i <= 9; i += 1) {
            table[String(i)] = table['-'];
        }
    }(RISON['parser'].prototype['table']));

    // return the next non-whitespace character, or undefined
    RISON['parser'].prototype['next'] = function () {
        var s = this['string'],
            i = this['index'],
            c;

        do {
            if (i === ui32(s.length)) {
                return undefined;
            }

            c = s.charAt(i);
            i += 1;
        } while (RISON['parser']['WHITESPACE'].indexOf(c) >= 0);
        this['index'] = i;
        return c;
    };

    // Create a RISON object only if one does not already exist.
    if (!('RISON' in window)) {
        window['RISON'] = RISON;
    }

    ///////////////////////////////////////////////////////////
    //            Communication Helper
    // Shared DOM page access communications
    // Prototype is built with this['function'] so it can be
    // stringified and injected
    ///////////////////////////////////////////////////////////

    function CommunicationHelper(id, reciever, fn) {
        id = id || "communicationDiv";
        reciever = reciever || false;
        var nul = JSON.parse("null"),
            eventName = "communicationEvent",
            fired,
            element,
            customEvent;

        if (reciever && fn && typeof fn !== "function") {
            /*jslint evil: true */
            eval("throw new TypeError(" + fn + "' is not a function');");
            /*jslint evil: false */
        }

        function addEvt(obj, type, fni) {
            if (obj.attachEvent) {
                obj['e' + type + fni] = fni;
                obj[type + fni] = function () {
                    obj['e' + type + fni](window.event);
                };

                obj.attachEvent('on' + type, obj[type + fni]);
            } else {
                obj.addEventListener(type, fni, false);
            }
        }

        function removeEvt(obj, type, fni) {
            if (obj.detachEvent) {
                obj.detachEvent('on' + type, obj[type + fni]);
                obj[type + fni] = nul;
            } else {
                obj.removeEventListener(type, fni, false);
            }
        }

        fired = function (event) {
            if (fn) {
                fn(JSON.parse(event.target.innerText));
            }
        };

        if (reciever) {
            element = document.createElement('div');
            element.setAttribute('id', id);
            element.style.display = "none";
            document.body.appendChild(element);
            addEvt(element, eventName, fired);
        } else {
            customEvent = document.createEvent("Event");
            customEvent.initEvent(eventName, true, true);
            element = document.getElementById(id);
            this['send'] = function (data) {
                element.innerText = JSON.stringify(data);
                element.dispatchEvent(customEvent);
            };
        }

        this['destroy'] = function () {
            if (reciever) {
                removeEvt(element, eventName, fired);
            } else {
                document.body.removeChild(element);
            }

            element = customEvent = nul;
            return nul;
        };
    }

    ///////////////////////////
    //   set some variables
    ///////////////////////////

    if (window.hasOwnProperty('chrome')) {
        (function(){
            var agent = window.navigator.userAgent, ver;
            if ((ver = agent.match(/\bchrome\/(\d+)\b/i))) {
                is_chrome = true;
                chrome_major_version = parseInt(ver[1], 10);
            }
        })();
    }
    (function(){
        var agent = window.navigator.userAgent, ver;
        if ((ver = agent.match(/\bfirefox\/(\d+)\b/i))) {
            is_firefox = true;
            firefox_major_version = parseInt(ver[1], 10);
        }
    })();
    is_opera = 'opera' in window;
    internal = new LogHelper({'log_version': uversion, 'log_level': 1});

    ///////////////////////////
    //       utility
    ///////////////////////////

    /**
     * @type {string}
     */
    utility['version'] = uversion;

    /**
     * @type {Function}
     */
    utility['noConflict'] = noConflict;

    /**
     * @type {boolean}
     */
    utility['is_chrome'] = is_chrome;

    /**
     * @type {boolean}
     */
    utility['is_firefox'] = is_firefox;

    /**
     * @type {boolean}
     */
    utility['is_opera'] = is_opera;

    /**
     * @type {boolean}
     */
    utility['chrome_major_version'] = chrome_major_version;

    /**
     * @type {boolean}
     */
    utility['firefox_major_version'] = firefox_major_version;

    /**
     * @type {Function}
     */
    utility['plural'] = plural;

    /**
     * @type {Function}
     */
    utility['injectScript'] = injectScript;

    /**
     * @type {Function}
     */
    utility['sortBy'] = sortBy;

    /**
     * @type {Function}
     */
    utility['sortObjectBy'] = sortObjectBy;

    /**
     * @type {Function}
     */
    utility['makeTime'] = makeTime;

    /**
     * @type {Function}
     */
    utility['minutes2hours'] = minutes2hours;

    /**
     * @type {Function}
     */
    utility['reload'] = reload;

    /**
     * @type {Object.<string, string>}
     */
    utility['class2type'] = class2type;

    /**
     * @type {Function}
     */
    utility['type'] = typeOf;

    /**
     * @type {Function}
     */
    utility['isWindow'] = isWindow;

    /**
     * @type {Function}
     */
    utility['isNaN'] = isNaN2;

    /**
     * @type {Function}
     */
    utility['isArray'] = isArray;

    /**
     * @type {Function}
     */
    utility['isObject'] = isObject;

    /**
     * @type {Function}
     */
    utility['isBoolean'] = isBoolean;

    /**
     * @type {Function}
     */
    utility['isFunction'] = isFunction;

    /**
     * @type {Function}
     */
    utility['isDate'] = isDate;

    /**
     * @type {Function}
     */
    utility['isRegExp'] = isRegExp;

    /**
     * @type {Function}
     */
    utility['isNumber'] = isNumber;

    /**
     * @type {Function}
     */
    utility['isString'] = isString;

    /**
     * @type {Function}
     */
    utility['isUndefined'] = isUndefined;

    /**
     * @type {Function}
     */
    utility['isNull'] = isNull;

    /**
     * @type {Function}
     */
    utility['isDefined'] = isDefined;

    /**
     * @type {Function}
     */
    utility['isPlainObject'] = isPlainObject;

    /**
     * @type {Function}
     */
    utility['isEmptyObject'] = isEmptyObject;

    /**
     * @type {Function}
     */
    utility['lengthOf'] = lengthOf;

    /**
     * @type {Function}
     */
    utility['compare'] = compare;

    /**
     * @type {Function}
     */
    utility['hasContent'] = hasContent;

    /**
     * @type {Function}
     */
    utility['setContent'] = setContent;

    /**
     * @type {Function}
     */
    utility['extend'] = extend;

    /**
     * @type {Function}
     */
    utility['addEvent'] = addEvent;

    /**
     * @type {Function}
     */
    utility['removeEvent'] = removeEvent;

    /**
     * @type {Function}
     */
    utility['cutSharp'] = cutSharp;

    /**
     * @type {Function}
     */
    utility['addSharp'] = addSharp;

    /**
     * @type {Function}
     */
    utility['hex2rgb'] = hex2rgb;

    /**
     * @type {Function}
     */
    utility['brightness'] = brightness;

    /**
     * @type {Function}
     */
    utility['dec2hex'] = dec2hex;

    /**
     * @type {Function}
     */
    utility['hex2dec'] = hex2dec;

    /**
     * @type {Function}
     */
    utility['bestTextColor'] = bestTextColor;

    /**
     * @type {Function}
     */
    utility['ColorConv'] = ColorConv;

    /**
     * @type {Function}
     */
    utility['owl'] = owl;

    /**
     * @type {Function}
     */
    utility['CommunicationHelper'] = CommunicationHelper;

    /**
     * @type {Function}
     */
    utility['LogHelper'] = LogHelper;

    /**
     * @type {Function}
     */
    utility['LZ77'] = LZ77;

    /**
     * @type {Function}
     */
    utility['IDBHelperAsync'] = IDBHelperAsync;

    /**
     * @type {Function}
     */
    utility['StorageHelper'] = StorageHelper;

    /**
     * @type {Function}
     */
    utility['ScheduleVarsHelper'] = ScheduleVarsHelper;

    /**
     * @type {Function}
     */
    utility['ScheduleStorageHelper'] = ScheduleStorageHelper;

    /**
     * @type {Function}
     */
    utility['VarsHelper'] = VarsHelper;

    /**
     * @type {Function}
     */
    utility['ConfigHelper'] = ConfigHelper;

    /**
     * @type {Function}
     */
    utility['ui32'] = ui32;

    /**
     * @type {Function}
     */
    utility['canCall'] = canCall;

    /**
     * @type {Object}
     */
    utility['inheriting'] = inheriting;

    /**
     * @type {Object.<string, boolean>}
     */
    utility['mutationTypes'] = mutationTypes;

    /**
     * @type {Object.<string, boolean>}
     */
    utility['storageTypes'] = storageTypes;

    /**
     * @type {Object.<string, boolean>}
     */
    utility['inputTypes'] = inputTypes;

    /**
     * @type {Function}
     */
    utility['Aes'] = Aes;

    window['utility'] = window['$u'] = utility;
}());
