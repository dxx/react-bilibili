const autoprefixer = require("autoprefixer");
const postcssFlexbugsFixes = require("postcss-flexbugs-fixes");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: "css-loader",
    options: !options.modules ? {
      sourceMap: options.sourceMap
    } : {
      sourceMap: options.sourceMap,
      camelCase: true,
      modules: true,
      localIdentName: "[name]_[local]-[hash:base64:5]"
    }
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      sourceMap: options.sourceMap,
      ident: "postcss",
      plugins: () => [
        autoprefixer({
          flexbox: "no-2009"
        }),
        postcssFlexbugsFixes
      ]
    }
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      loaders.push({
        loader: loader + "-loader",
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return ["style-loader"].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders("less"),
    sass: generateLoaders("sass", { indentedSyntax: true }),
    scss: generateLoaders("sass"),
    stylus: generateLoaders("stylus"),
    styl: generateLoaders("stylus")
  }
}

module.exports.styleLoaders = function (options) {
  const output = [];
  const loaders = cssLoaders(options);

  options.modules = true;
  const cssModuleLoaders = cssLoaders(options);
  
  for (const extension in loaders) {
    const loader = loaders[extension];
    const cssModuleLoader = cssModuleLoaders[extension];
    output.push({
      test: new RegExp("\\." + extension + "$"),
      oneOf: [
        {
          resourceQuery: /css-modules/,
          use: cssModuleLoader,
        },
        {
          use: loader
        }
      ]
    });
  }
  
  return output;
}
