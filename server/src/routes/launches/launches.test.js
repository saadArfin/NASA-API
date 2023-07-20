const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');


describe('Launches API', () =>{
    beforeAll(async () =>{//This is crucial bcz we have to first connect with mongoDB as api is communicating with mongoDB for data.
        await mongoConnect();
    });

    afterAll(async () =>{//We did this bcz we thought this is the cause of error while testing and also it's a good practice to disconnect from a database after we have run through our tests.
        await mongoDisconnect();
    });

    describe('Test GET /launches', () =>{
        test('It should respond with 200 success', async () =>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);
            
        });
    });
    
    describe('Test POST /launch', () =>{
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028',
            
        };
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170D',
            target: 'Kepler-62 f',
    
        };
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 170D',
            target: 'Kepler-62 f',
            launchDate: 'zoot',
        }
    
        test('It should respond with 201 created', async () =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201);
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);//toMatchObject is used for partial matching
        });
        test('It should catch missing required properties', async () =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            
            expect(response.body).toStrictEqual({//toStrictEqual is used for complete matching
                error: 'Missing required launch property!'
            });
        });
        test('It should catch invalid dates', async () =>{
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400);
    
            
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            });
    
        });
    });

});

//.expect comes from supertest
//While expect comes from jest

//Note --> While using mongoose don't use jsdom test environment for testing, checkout package.json and also docs.

//NOTE --> It's a good practice to check our test codes by creating a test database so that by mistake we don't mess with our production database.