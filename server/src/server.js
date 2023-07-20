const http = require('http');

require('dotenv').config();//It populates our process.env object with the values in our .env file.
//The reason why we call this function above any of our local imports here because we want the environment to not just be populated in our server.js but also in all of the other files when we import them as below.

const app = require('./app');
const {loadPlanetsData} = require('./models/planets.module');
const mongoose = require('mongoose');
const {mongoConnect} = require('./services/mongo');
const {loadLaunchesData} = require('./models/launches.model');



const PORT = process.env.PORT || 8000;
//VrTFCmxbncbT9sHT
//const MONGO_URL = 'mongodb+srv://nasa-api:VrTFCmxbncbT9sHT@nasacluster.myznxku.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

// mongoose.connection.once('open', () =>{//An event handler which gets triggered when we connect with mongoDB for the first time
//     console.log('MongoDB connection ready!');
// });

// mongoose.connection.on('error', (err) =>{//An event handler which throws error when connecting to mongoDB.
//     console.log(err);
// });

async function startServer(){
    // await mongoose.connect(MONGO_URL, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // });
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();
    server.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}...`);
});
}

startServer();
