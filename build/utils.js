const path = require("path")
const postcssPxtorem = require('postcss-pxtorem');
const postcssPresetEnv = require('postcss-preset-env');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const modifyVars = require("../src/less/modifyVars")

const isServer = process.env.NODE_TYPE === 'server'


exports.assetsPath = function (_path) {
    return path.posix.join("static", _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            importLoaders: 1
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap,
            ident: 'postcss',
            plugins: () => [
                postcssPresetEnv({
                    browsers: 'last 3 versions'
                }),
                postcssPxtorem({
                    rootValue: 16,
                    propList: ['*'],
                    mediaQuery: true,
                    replace: true
                })
            ]
        }
    }

    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        if (options.extract) {
            /*  return ExtractTextPlugin.extract({
                  use: loaders,
                  fallback: 'vue-style-loader'
              })*/
            return [isServer ? "null-loader" : MiniCssExtractPlugin.loader].concat(loaders)
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less', {
            javascriptEnabled: true,
            modifyVars: modifyVars
        }),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

exports.styleLoaders = function (options) {
    const output = []
    const loaders = exports.cssLoaders(options)
    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}