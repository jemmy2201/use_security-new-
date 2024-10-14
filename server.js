const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const env = process.env.NODE_ENV || "development";
const dev = env === "development";
const port = process.env.PORT || 80; 
const hostname = undefined; 
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const redirectHost = req.headers.host;
      const redirectHostname = redirectHost.split(":")[0];

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else if (pathname === "/login") {
        // Use https for UAT and PROD, http for development
        const protocol = (env === "uat" || env === "production") ? "https" : "http";
        const redirectUrl = `${protocol}://${redirectHostname}:8443/login`;
        res.writeHead(302, { Location: redirectUrl });
        res.end();
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on port ${port} in ${env} mode`);
    });
});
