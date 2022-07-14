const express = require('express');
import { PrismaClient } from '@prisma/client'
const app = express();
const port = 3000;
console.log("started")
app.get('/', (req: any, res: any) => {
    res.send("MultiAuth Server");
});
app.post('/login', (req: any, res: any) => {
    var headers = req.headers;
    if (headers.UID == undefined){
        res.send("UID not found");
    }
    else{
        res.send("Username: " + headers.username);
    }
})

app.listen(port, () => console.log(`listening on port ${port}!`));
