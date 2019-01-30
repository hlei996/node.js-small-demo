const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

let router = require('./router.js');
app.use(router);

app.listen(5001,() => {
    console.log('server running at http://127.0.0.1:5001')
})