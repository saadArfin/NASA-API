const mongoose = require('mongoose');

//VrTFCmxbncbT9sHT
require('dotenv').config();// To ensure that our tests know the URL of our Mongo database

const MONGO_URL = process.env.MONGO_URL;
mongoose.connection.once('open', () =>{//An event handler which gets triggered when we connect with mongoDB for the first time
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) =>{//An event handler which throws error when connecting to mongoDB.
    console.log(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

async function mongoDisconnect(){
    await mongoose.disconnect();//Mongoose knows which database we are connected to.
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}
