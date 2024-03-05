const http = require('http');
const app = require("./src/config/express.config");

// express application
const server = http.createServer(app)

server.listen(3000, 'localhost',(err) => {
    if(!err) {
        console.log("Server is running on Port: 3000")
        console.log("Browse http://localhost:3000 for server ")
        console.log("Press CTRL+C to end/disconnect the server ....")
    }
})