/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * template.js v0.6.1 (https://github.com/yanhaijing/template.js)
 * API https://github.com/yanhaijing/template.js/blob/master/doc/api.md
 * Copyright 2015 yanhaijing. All Rights Reserved
 * Licensed under MIT (https://github.com/yanhaijing/template.js/blob/master/MIT-LICENSE.txt)
 */
;(function(root, factory) {
    var template = factory(root);
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
            return template;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = template;
    } else {
        // Browser globals
        var _template = root.template;

        template.noConflict = function() {
            if (root.template === template) {
                root.template = _template;
            }

            return template;
        };
        root.template = template;
    }
}(this, function(root) {
    'use strict';
    var o = {
        sTag: '<%',//开始标签
        eTag: '%>',//结束标签
        compress: false,//是否压缩html
        escape: true, //默认输出是否进行HTML转义
        error: function (e) {}//错误回调
    };
    var toString = {}.toString;

    function getType(x) {
        if(x === null){
            return 'null';
        }

        var t= typeof x;

        if(t !== 'object'){
            return t;
        }

        var c = toString.call(x).slice(8, -1).toLowerCase();
        if(c !== 'object'){
            return c;
        }

        if(x.constructor==Object){
            return c;
        }

        return 'unkonw';
    }

    function isObject(obj) {
        return getType(obj) === 'object';
    }
    function extend() {
        var target = arguments[0] || {};
        var arrs = Array.prototype.slice.call(arguments, 1);
        var len = arrs.length;
     
        for (var i = 0; i < len; i++) {
            var arr = arrs[i];
            for (var name in arr) {
                target[name] = arr[name];
            }
     
        }
        return target;
    }
    function encodeHTML(source) {
        return String(source)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/\\/g,'&#92;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;');
    };
    function compress(html) {
        return html.replace(/\s+/g, ' ').replace(/<!--[\w\W]*?-->/g, '');
    }
    function handelError(e) {
        var message = 'template.js error\n\n';

        for (var key in e) {
            message += '<' + key + '>\n' + e[key] + '\n\n';
        }
        message += '<message>\n' + e.message + '\n\n';
        typeof console !== 'undefined' && console.error && console.error(message);

        o.error(e);
        function error() {
            return 'template.js error';
        }
        error.toString = function () {
            return '__code__ = "template.js error"';
        }
        return error;
    }
    function parse(tpl, opt) {
        var code = '';
        var sTag = opt.sTag;
        var eTag = opt.eTag;
        var escape = opt.escape;
        function parsehtml(line) {
            // 单双引号转义，换行符替换为空格
            line = line.replace(/('|")/g, '\\$1').replace(/\n/g, ' ');
            return ';__code__ += ("' + line + '")\n';
        }
        function parsejs(line) {              
            var html;
            if (line.search(/^=/) !== -1) {
                //默认输出
                html = line.slice(1);
                html = escape ? ('__encodeHTML__(typeof (' + html + ') === "undefined" ? "" : ' + html + ')') : html;
                return ';__code__ += (' + html + ')\n';
            }

            if (line.search(/^:h=/) !== -1) {
                //HTML转义输出
                html = line.slice(3);
                return ';__code__ += (__encodeHTML__(typeof (' + html + ') === "undefined" ? "" : ' + html + '))\n';
            }

            if (line.search(/^:=/) !== -1) {
                //不转义
                html = line.slice(2);
                return ';__code__ += (typeof (' + html + ') === "undefined" ? "" : ' + html + ')\n';
            }

            if (line.search(/^:u=/) !== -1) {
                //URL转义
                html = line.slice(3);
                return ';__code__ += (typeof (' + html + ') === "undefined" ? "" : encodeURI(' + html + '))\n';
            }

            //原生js
            return ';' + line + '\n';
        }

        var tokens = tpl.split(sTag);

        for (var i = 0, len = tokens.length; i < len; i++) {
            var token = tokens[i].split(eTag);

            if (token.length === 1) {
                code += parsehtml(token[0]);
            } else {
                code += parsejs(token[0], true);
                if (token[1]) {
                    code += parsehtml(token[1]);
                }
            }
        }

        return code;
    }
    function compiler(tpl, opt) {
        var mainCode = parse(tpl, opt);

        var headerCode = '\n' + 
        '    var html = (function (__data__, __encodeHTML__) {\n' + 
        '        var __str__ = "", __code__ = "";\n' + 
        '        for(var key in __data__) {\n' + 
        '            __str__+=("var " + key + "=__data__[\'" + key + "\'];");\n' + 
        '        }\n' + 
        '        eval(__str__);\n\n';

        var footerCode = '\n' + 
        '        ;return __code__;\n' + 
        '    }(__data__, __encodeHTML__));\n' + 
        '    return html;\n';

        var code = headerCode + mainCode + footerCode;
        code = code.replace(/[\r]/g, ' '); // ie 7 8 会报错，不知道为什么
        try {
            var Render = new Function('__data__', '__encodeHTML__', code); 
            Render.toString = function () {
                return mainCode;
            }
            return Render;
        } catch(e) {
            e.temp = 'function anonymous(__data__, __encodeHTML__) {' + code + '}';
            throw e;
        }  
    }
    function compile(tpl, opt) {
        opt = extend({}, o, opt);

        try {
            var Render = compiler(tpl, opt);
        } catch(e) {
            e.name = 'CompileError';
            e.tpl = tpl;
            e.render = e.temp;
            delete e.temp;
            return handelError(e);
        }

        function render(data) {
            try {
                var html = Render(data, encodeHTML);
                html = opt.compress ? compress(html) : html;
                return html;
            } catch(e) {
                e.name = 'RenderError';
                e.tpl = tpl;
                e.render = Render.toString();
                return handelError(e);
            }            
        }

        render.toString = function () {
            return Render.toString();
        };
        return render;
    }
    function template(tpl, data) {
        if (typeof tpl !== 'string') {
            return '';
        }

        var fn = compile(tpl);
        if (!isObject(data)) {
            return fn;
        }

        return fn(data);
    }

    template.config = function (option) {
        if (isObject(option)) {
            o = extend(o, option);
        }
        
        return extend({}, o);
    };

    template.__encodeHTML = encodeHTML;
    template.__compress = compress;
    template.__handelError = handelError;
    template.__compile = compile;
    template.version = '0.6.1';
    return template;
}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function render(data) {
        'use strict';
        var keyArr = [], valArr = [];
        data = data || {};
        data.__encodeHTML__ = __webpack_require__(0).__encodeHTML;
        for(var key in data) {
            keyArr.push('"' + key + '"');
            valArr.push(data[key]);
        }
        var source = 'new Function(' + keyArr.join(',') + ', "\\"use strict\\";var __code__ = \\"\\";;__code__ += (\\"<div>     \\");__code__ += (__encodeHTML__(typeof (abc) === \\"undefined\\" ? \\"\\" : abc));__code__ += (\\" </div> \\");return __code__")';
        try {
            var fn = eval(source);
            var html = fn.apply(null, valArr);
        } catch (e) {
            e.name = 'RenderError';
            e.tpl = 'demo.tmpl';
            __webpack_require__(0).__handelError(e);
            return 'template.js error';
        }
        
        return html;
    }

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var tpl = __webpack_require__(1);

document.getElementById('test').innerHTML = tpl({abc: 'yanhaijing'});


/***/ })
/******/ ]);