# template-loader [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yanhaijing/template-loader/blob/master/MIT-LICENSE)

[template.js](https://github.com/yanhaijing/template.js)的webpakc编译loader——一款javascript模板引擎。

## 安装

    $ npm install --save template-loader

## 配置
配置参数同[template.js](https://github.com/yanhaijing/template.js/blob/master/doc/api.md#templateconfig)参数一样，其中expression参数会作为获取template的表达式。

    loaders: [
        {
            test: /\.tmpl/,
            loader: __dirname + "/../",
            query: {
                sTag: '<#',
                eTag: '#>',
                expression: 'require("template_js")'
            }
        }
    ]

[demo](example)

## 报告问题

- [Issues](https://github.com/yanhaijing/template-loader/issues "report question")

## 作者

**yanhaijing**

- [Weibo](http://weibo.com/yanhaijing1234 "yanhaijing's Weibo")
- [Email](mailto:yanhaijing@yeah.net "yanhaijing's Email")
- [Blog](http://yanhaijing.com "yanhaijing's Blog")

## 更新日志

[更新日志](CHANGELOG.md)

## 相关链接

- [webpack](http://webpack.github.io/)
