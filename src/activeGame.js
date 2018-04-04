const axios = require('axios');
const Summoner = require('./summoner.js');

var apiKey;

function getSumonner(options) {
    var newSumm = new Summoner(this.apiKey);
    return new Promise ((resolve, reject) => {resolve (newSumm.create(options))});
}

function getRanks() {
    return new Promise ((resolve, reject) => {
        axios.get("https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + this.id + "?api_key=" + apiKey)
        .then(response => {
            this.leaguePosition = response.data;
            resolve (this);
        });
    });
}

class GameParticipant {
    constructor(participant) {
        this.teamId = participant.teamId;
        this.spell1Id = participant.spell1Id;
        this.spell2Id = participant.spell2Id;
        this.championId = participant.championId;
        this.profileIconId = participant.profileIconId;
        this.summonerName = participant.summonerName;
        this.bot = participant.bot;
        this.summonerId = participant.summonerId;
        this.gameCustomisationObjects = participant.gameCustomisationObjects;
        this.perks = participant.perks;
        this.getSumonner = getSumonner;
        this.getRanks = getRanks;
    }
}

class ActiveGame
{
    constructor(key) {
        if (key) apiKey = key;
    }

    create(summonerId) {
        return new Promise ((resolve, reject) => {
            axios.get("https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/" + summonerId + "?api_key=" + apiKey)
            .then(response => {
                var data = response.data;
                this.gameId = data.gameId;
                this.startTime = new Date(data.gameStartTime);
                this.regionId = data.platformId;
                this.bannedChampions = data.bannedChampions;
                this.gameLength = data.gameLength;
                this.observers = data.observers;
                this.mapId = data.mapId;
                this.gameMode = data.gameMode;
                this.gameType = data.gameType;
                this.gameQueueConfigId = data.gameQueueConfigId;
                this.players = data.participants.map(participant => participant = new GameParticipant(participant));
                resolve (this);
            }).catch(error => {
                resolve({status: error.response.status, message: error.response.statusText});
            });
        });
    }
}

module.exports = ActiveGame;
