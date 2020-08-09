import http from 'http';
import fs from 'fs';
import url from 'url';

const hostname = '127.0.0.1';
const port = 3000;
let files = new Map();
files.set('/built/zoomwall.js', 'text/javascript');
files.set('/zoomwall.css', 'text/css');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const queryObject = parsedUrl.query;
  if (parsedUrl.pathname == '/') {
    fs.readFile(`./src/__tests__/${queryObject['type'] == 'nested' ? 'nested' : 'flat'}.html`, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data, 'utf-8');
    });
  } else if (files.has(req.url)) {
    fs.readFile(`.${req.url}`, (err, data) => {
      res.writeHead(200, { 'Content-Type': files.get(req.url) });
      res.end(data, 'utf-8');
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});