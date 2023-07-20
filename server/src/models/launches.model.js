//const launches = new Map();
const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;



// const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27, 2030'),
//     target: 'Kepler-442 b',
//     customers: ['ZTM', 'NASA'],
//     upcoming: true,
//     success: true,
// };

// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    console.log('Downloading launch data');
    const response = await axios.post(SPACEX_API_URL, {//axios library allows us to send http request and fetch data from API's.
        query: {},
        options: {
            pagination: false,//By doing this we are not limited to a particular page or the limit of launch objects one page would have as our response which is set by that API. When we deal with large information like 
            //in our case pagination is done so that the client could get results faster without waiting for the whole data to be received at the same time. But nonetheless we are making it false in our case.
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select:{
                        'customers': 1
                    }
                }
                
            ]
        }
    });
    if(response.status !== 200){
        console.log('Problem downloading launch data!');
        throw new Error('Launch data download failed!');
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) =>{
            return payload['customers'];
        });
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }
        console.log(`${launch.flightNumber} ${launch.rocket}`);

        await saveLaunch(launch);
    }

}

async function loadLaunchesData(){
    const firstLaunch = await findLaunch({//We did this check so that we don't query the SpaceX API(so that it doesn't gets loaded up by transferring so much data everytime we run our server) if we have this object in our database bcz we are assuming if we have this one launch from that API in our database then we could expect there are all the launches in our database from that respective API.
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if(firstLaunch){
        console.log('Launch data already loaded!');
    }else{
        await populateLaunches();
    }
    
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);

}

async function existsLaunchWithId(launchId){
    return await findLaunch({//Don't get confused findLaunch is a generic function which we will do the same as done by the below code.
        flightNumber: launchId,
    });
    // return await launchesDatabase.findOne({
    //     flightNumber: launchId,
    // });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;

}

async function abortLaunchWithId(launchId)
{
    const aborted =  await launchesDatabase.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });
    return aborted.modifiedCount === 1;
    //We wouldn't do upsert here.Answer why??
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;

}

async function getAllLaunches(skip, limit){
    return await launchesDatabase.find({}, {
        '_id': 0, '__v': 0,
    })
    .sort({//We have to explicitly tell it to sort the returned documents on the basis of flightNumber so that we get from the very beginning.
        flightNumber: 1
    })
    .skip(skip)//as mongoose model don't have page function
    .limit(limit);

}

async function saveLaunch(launch){
    await launchesDatabase.findOneAndUpdate({//UpdateOne would have returned us 'setOnInsert' property which is internally implemented by mongo which we don't want to send in our response.
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if(!planet){
        throw  new Error('No matching planet found');
    } 
    //The above two steps are for referential integrity.

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);

}

// function addNewLaunch(launch){
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', 'NASA'],
//             flightNumber: latestFlightNumber

//         })
//     );
// }

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchWithId,
    loadLaunchesData,

};

