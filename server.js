const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 80;
const hostname = undefined;// Allow the server to respond to any hostname or IP
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const redirectHost = req.headers.host;  
	  const redirectHostname = redirectHost.split(':')[0]; 
      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      }else if (pathname === "/login") {
        const protocol = req.connection.encrypted ? 'https' : 'http';  
        const redirectUrl = `https://${redirectHostname}:8443/login`;
        res.writeHead(302, { Location: redirectUrl });
        res.end();
      }  else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, async () => {
      console.log(`> Ready on port ${port}`);
    });
});
