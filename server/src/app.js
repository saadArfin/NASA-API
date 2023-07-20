const path = require('path');
const express= require('express');
const cors = require('cors');
const api = require('./routes/api');
const morgan = require('morgan');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api);//This allows us to support multiple versions of aur api at the same time.


app.get('/*', (req, res)=>{//* matches everything that follows the slash, our front end application will then handle the routing if it doesn't match

    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;