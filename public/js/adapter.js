var init = function () {
  var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  if (clientWidth >= 640) {
    clientWidth = 640;
  }
  var fontSize = 20 / 375 * clientWidth;
  document.documentElement.style.fontSize = fontSize + "px";
}

init();

window.addEventListener("resize", init);
