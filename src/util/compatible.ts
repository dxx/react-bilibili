function getTransitionEndName(dom) {
  const cssTransition = ["transition", "webkitTransition"];
  const transitionEnd = {
    transition: "transitionend",
    webkitTransition: "webkitTransitionEnd"
  };
  for (const key of cssTransition) {
    if (dom.style[key] !== undefined) {
      return transitionEnd[key];
    }
  }
  return undefined;
}

export { getTransitionEndName };
