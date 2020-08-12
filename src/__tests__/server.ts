import * as http from "http";
import * as fs from "fs";
import * as url from "url";

const hostname = "127.0.0.1";
const port = 3000;
const files = new Map<string, string>();
files.set("/lib/zoomwall.js", "text/javascript");
files.set("/lib/zoomwall.js.map", "application/json");
files.set("/src/zoomwall.css", "text/css");
files.set("/src/zoomwall.ts", "application/x-typescript");

const pages = ["flat", "nested", "multi"];

const server = http.createServer((req, res) => {
  if (req.url) {
    const reqUrl: string = req.url;
    const parsedUrl = url.parse(req.url, true);
    const pageType = parsedUrl.query["type"];

    if (parsedUrl.pathname == "/") {
      fs.readFile(
        `./src/__tests__/${
          pages.includes(pageType as string) ? (pageType as string) : "flat"
        }.html`,
        (err, data) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data, "utf-8");
        }
      );
    } else if (files.has(reqUrl)) {
      fs.readFile(`.${req.url}`, (err, data) => {
        res.writeHead(200, { "Content-Type": files.get(reqUrl) });
        res.end(data, "utf-8");
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end();
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
