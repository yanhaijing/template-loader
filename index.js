/**
 * template loader
 * 
 */

var loaderUtils = require("loader-utils");
var assign = require("object-assign");

var template = require('template_js');

function getLoaderConfig(loaderContext) {
  var config = loaderUtils.getOptions(loaderContext) || {};
  return assign({}, config);
}

module.exports = function(source) {
    console.log(this.context)
    console.log(this.resourcePath)
    var config = getLoaderConfig(this);

    template.config(config);
    var expression = config.expression || 'template';
    var compress = config.compress || false;

    // 获取编译源码
    var code = template.__compile(source).toString();

    code = '"use strict";var __code__ = "";' + code + ';return __code__';

    // __##1##__ 单引号 js语句中的单引号
    // __##2##__ 转义单引号 html语句中的双引号
    // __##3##__ 双引号 js语句中的双引号
    // __##4##__ 转义双引号 html语句中的双引号
    code = code
        .replace(/\\\'/g, "__##2##__")
        .replace(/\\\"/g, '__##4##__')
        .replace(/\'/g, '__##1##__')
        .replace(/\"/g, '__##3##__')
        // \r 针对windows换行符(cr lf) \n 针对unix换行符(lf)
        .replace(/[\n\r]/g, '');

    var render = function render(data) {
        'use strict';
        var keyArr = [], valArr = [];
        data = data || {};
        data.__encodeHTML__ = __expression__.__encodeHTML;
        for(var key in data) {
            keyArr.push('"' + key + '"');
            valArr.push(data[key]);
        }
        var source = 'new Function(' + keyArr.join(',') + ', "__placeholder__")';
        try {
            var fn = eval(source);
            var html = fn.apply(null, valArr);
        } catch (e) {
            e.name = 'RenderError';
            e.tpl = '__tpl__';
            __expression__.__handelError(e);
            return 'template.js error';
        }
        __compress__
        return html;
    }

    var source = render.toString();

    source = source.replace('__compress__', compress ? 'html = __expression__.__compress(html);' : '');
    source = source.replace('__placeholder__', code);
    source = source.replace('__tpl__', this.resourcePath.split('/').pop());
    source = source.replace(/__expression__/g, expression);

    // 将引号替换回来，不要问我为什么知道，试出来的
    source = source
        .replace(/__##1##__/g, "\\'")
        .replace(/__##3##__/g, '\\\\"')
        .replace(/__##2##__/g, "\\\\\\'")
        .replace(/__##4##__/g, '\\\\\\\\\\\\\\"');

    source = 'module.exports = ' + source;
    return source;
}
