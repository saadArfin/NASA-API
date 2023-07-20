const {getAllPlanets} = require('../../models/planets.module');

async function httpGetAllPlanets(req, res) {
    return res.status(200).json(await  getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,

};
