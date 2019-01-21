const { red } = require("chalk");

const isJS = (file) => /\.js(\?[^.]+)?$/.test(file);

const onEmit = (compiler, name, hook) => {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.emit.tapAsync(name, hook)
  } else {
    // Webpack < 4.0.0
    compiler.plugin("emit", hook)
  }
}

const validateConfig = (compiler) => {
  const prefix = "ssr-server-plugin";
  if (compiler.options.target !== "node") {
    let msg = 'webpack config `target` should be "node".';
    console.error(red(`${prefix} ${msg}\n`));
  }

  if (compiler.options.output && compiler.options.output.libraryTarget !== "commonjs2") {
    let msg = 'webpack config `output.libraryTarget` should be "commonjs2".';
    console.error(red(`${prefix} ${msg}\n`));
  }

  if (!compiler.options.externals) {
    let msg = 'You should use `output.externals` to externalize dependencies in the server build'
    console.error(red(`${prefix} ${msg}\n`));
  }
}

module.exports = {
  isJS,
  onEmit,
  validateConfig
}
