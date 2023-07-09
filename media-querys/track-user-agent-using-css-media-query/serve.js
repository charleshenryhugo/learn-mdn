const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  const queryString = req.url.split('?')[1];
  const queries = new URLSearchParams(queryString);
  const minWidth = queries.get('min-width');
  const maxWidth = queries.get('max-width');
  
  console.log(new Date().toISOString(), `, media sizes, minWidth: ${minWidth}, maxWidth: ${maxWidth}`)

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(JSON.stringify({ ['media size']: `media sizes, minWidth: ${minWidth}, maxWidth: ${maxWidth}` }, null, 3));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});