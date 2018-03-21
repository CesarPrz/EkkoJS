const axios = require('axios');
const Summoner = require('./summoner.js');

var apiKey;

function EkkoJS(key) {
    if (typeof (key) != "string") {
        throw (new Error("Invalid key: not String type"));
        return undefined;
    }
    apiKey = key;

    // GET VERSION
    var url = "https://euw1.api.riotgames.com/lol/static-data/v3/versions?api_key=" + apiKey;
    axios.get(url)
    .then(response => {
        this.version = response.data[0];
        return;
    })
    .catch(error => {
        console.log(error);
    });
}

EkkoJS.prototype.getSummoner = function(infos) {
    var newSumm = new Summoner(apiKey);
    return new Promise ((resolve, reject) => {resolve (newSumm.create(infos))})
    // return (newSumm.create(infos));
}

module.exports = EkkoJS;