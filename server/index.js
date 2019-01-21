const express = require("express");
const fs = require("fs");
const path = require("path");
const ServerRenderer = require("./renderer");
const app = express();

const isProd = process.env.NODE_ENV === "production";

let renderer;
let readyPromise;
let template = fs.readFileSync("./templates/index.html", "utf-8");
if (isProd) {
  // 静态资源映射到dist路径下
  app.use("/dist", express.static(path.join(__dirname, "../dist")));

  let bundle = require("../dist/server-bundle.json");
  let clientManifest = require("../dist/client-manifest.json");
  renderer = new ServerRenderer(bundle, template, clientManifest);
} else {
  readyPromise = require("./dev-server")(app, (
    bundle, clientManifest) => {
      renderer = new ServerRenderer(bundle, template, clientManifest);
  });
}

app.use("/public", express.static(path.join(__dirname, "../public")));

const render = (req, res) => {
  console.log("======enter server======");
  console.log("visit url: " + req.url);

  renderer.renderToString(req).then(({error, html}) => {
    if (error) {
      if (error.url) {
        res.redirect(error.url);
      } else if (error.code) {
        if (error.code === 404) {
          const html = fs.readFileSync("./templates/404.html", "utf-8");
          res.status(404).send(html);
        } else {
          res.status(error.code).send("error code：" + error.code);
        }
      }
    }
    res.send(html);
  }).catch(error => {
    console.log(error);
    const html = fs.readFileSync("./templates/500.html", "utf-8");
    res.status(500).send(html);
  });
}

app.get("*", isProd ? render : (req, res) => {
  // 等待客户端和服务端打包完成后进行render
  readyPromise.then(() => render(req, res));
});

app.listen(3010, () => {
  console.log("Your app is running");
});
