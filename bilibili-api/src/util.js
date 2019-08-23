const vm = require("vm");

const getInitialStateFromHTML = (html, index) => {
  const result = html.match(/<script>[\s\S]+?<\/script>/g);
  if (result) {
    const content = result[index].replace(/<script>([\s\S]+)<\/script>/, "$1");

    const context = {
      window: {}
    };
    vm.runInNewContext(content, context);

    const initialState = context.window.__INITIAL_STATE__;
    return initialState;
  }
}

module.exports = {
  getInitialStateFromHTML
}
