const axios = require('axios');
const Summoner = require('./summoner.js');
const EventEmitter = require('events');
var apiKey;
var index = 0;

function loop(timeout, playerId, gameWatcher) {
    var game = new ActiveGame(apiKey);
    game.create(playerId).then(activeGame => {
        gameWatcher.emit('refresh', activeGame, index);
    })

    index = index + 1;
    setTimeout(loop, timeout, timeout, playerId, gameWatcher);
}

class GameWatcher extends EventEmitter {
    constructor(game, timeout) {
        super();
        this.game = game;
        this.options = {timeout: timeout};
        console.log("Not undefined")
    }
    start() {
        loop(this.options.timeout, this.game.requestedPlayerId, this, index);
    }

};

function getSummoner(options) {
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

function watchGame(timeout) {
    const gameWatcher = new GameWatcher(this, timeout);

    return (gameWatcher);
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
        this.getSummoner = getSummoner;
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
                this.watch = watchGame;
                this.requestedPlayerId = summonerId;
                resolve (this);
            }).catch(error => {
                reject({status: error.response.status, message: error.response.statusText});
            });
        });
    }
}

module.exports = ActiveGame;
