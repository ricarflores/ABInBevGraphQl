'use strict';

const createServer = require("./index");
const port = process.env.port || 3030;
const app= createServer();

app.listen(port, ()=>console.log("server is runing ar port: "+ port));