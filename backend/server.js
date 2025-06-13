// Description: A simple Node.js server that listens on a specified port and responds with a message.
// Usage: Run this script using Node.js to start the server.

//console.log("This is my node app!");

const http = require("http");
const server = http.createServer((req, res) => {
  res.end("This is my server 3rd response!");
});
server.listen(process.env.PORT || 3000);
