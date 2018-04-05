const axios = require('axios');

var apiKey;

function getMatch() {
    console.log("getMatch");
}

function getLeaguePosition() {
    return new Promise ((resolve, reject) => {
        axios.get("https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + this.id + "?api_key=" + apiKey)
        .then(response => {
            this.leaguePosition = response.data;
            resolve (this);
        });
    });
}

class Summoner {
    /* ------------CONSTRUCTOR---------- */
    constructor(key) {
        if (key) apiKey = key;
    }

    create(infos) {
            if (infos.summonerId == undefined && infos.summonerName == undefined && infos.accountId == undefined)
            throw (new Error("Wrong parameters while creating summoner."));

            return new Promise ((resolve, reject) => {
                if (infos.summonerId) {
                    axios.get("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/" + infos.summonerId + "?api_key=" + apiKey)
                    .then(response => {
                        resolve (this.fillData(response.data, infos))})
                    .catch(error => {throw (new Error(error));});
                } else if (infos.summonerName) {
                    axios.get("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + infos.summonerName + "?api_key=" + apiKey)
                    .then(response => {resolve (this.fillData(response.data, infos))})
                    .catch(error => {console.log(error);});
                } else if (infos.accountId) {
                    axios.get("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-account/" + infos.accountId + "?api_key=" + apiKey)
                    .then(response => {resolve (this.fillData(response.data, infos))})
                    .catch(error => {throw (new Error(error));});
                } else {
                    return {error: "Wrong parameters"};
                }
            })
    }

    fillData(data, infos) {
        return new Promise((resolve, reject) => {
            this.profileIconId = data.profileIconId;
            this.name = data.name;
            this.id = data.id;
            this.accountId = data.accountId;
            this.level = data.summonerLevel;
            this.lastEdit = data.revisionDate;
            this.getMatch = getMatch;
            this.getLeaguePosition = getLeaguePosition;
            if (infos.leaguePosition == true) {
                axios.get("https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + data.id + "?api_key=" + apiKey)
                .then(response => {
                    this.leaguePosition = response.data;
                    resolve (this);
                });
            } else {
                resolve (this);
            }
        });
    }
}
module.exports = Summoner;
