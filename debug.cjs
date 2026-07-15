const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const html = fs.readFileSync("index.html", "utf-8");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

dom.window.onerror = function(message, source, lineno, colno, error) {
  console.log("ERROR FOUND:");
  console.log(message);
  console.log("Line:", lineno, "Col:", colno);
  if (error) {
    console.log(error.stack);
  }
};
