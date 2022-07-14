"use strict";
const express = require('express');
const app = express();
const port = 3000;
console.log("started");
app.get('/', (req, res) => {
    res.send("MultiAuth Server");
});
app.post('/login', (req, res) => {
    var headers = req.headers;
    if (headers.UID == undefined) {
        res.send("UID not found");
    }
    else {
        res.send("Username: " + headers.username);
    }
});
app.listen(port, () => console.log(`listening on port ${port}!`));
