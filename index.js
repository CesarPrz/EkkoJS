const axios = require('axios');
function test() {
    axios.get(url).then(response => {
        this.champions = response.data;
        console.log(this.champions);
        return;
    })
    .catch(error => {
        console.log(error);
    })
}

function riotGameApi(key) {
    if (typeof (key) != "string") {
        throw (new Error("Invalid key: not String type"));
        return undefined;
    }
    this.key = key;
    
    // GET VERSION
    var url = "https://euw1.api.riotgames.com/lol/static-data/v3/versions?api_key=" + this.key;
    axios.get(url)
    .then(response => {
        this.version = response.data[0];
        
        // GET CHAMPIONS
        var url = "https://euw1.api.riotgames.com/lol/static-data/v3/champions?locale=fr_FR&tags=keys&dataById=true&api_key=" + this.key;
        axios.get(url)
        .then(response => {
            this.champions = response.data;
            // console.log(this.champions);
        })
        return;
        
    })
    .catch(error => {
        console.log(error);
    });
}

//------------------------------------------------------------//
//------------------------UTILITY-----------------------------//
//------------------------------------------------------------//

riotGameApi.prototype.getProfilePicture = function getProfilePicture(id) {
    return ("http://ddragon.leagueoflegends.com/cdn/" + this.version + "/img/profileicon/" + id + ".png");
}

riotGameApi.prototype.getChampionSquare = function getChampionSquare(id) {
    console.log(typeof(id));
    console.log(this.champions.keys[5]);
    return ("http://ddragon.leagueoflegends.com/cdn/" + this.version + "/img/champion/" + this.champions.keys[parseInt(id)] + ".png");
}

riotGameApi.prototype.getProfile = function getProfile(name) {
    return new Promise((resolve, reject) => {
        
        this.getSummonerByName(name).then(response => {
            this.getRankedInfos(response.id).then(res => {
                response.ranked = res;
                return resolve(response);                
            })
            
        })
    })
}

//------------------------------------------------------------//
//----------------------SUMMONER-V3---------------------------//
//------------------------------------------------------------//

riotGameApi.prototype.getSummonerByName = function getSummonerByName(id) {
    var url = "https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/" + id + "?api_key=" + this.key;
    
    return new Promise((resolve, reject) => {
        
        axios.get(url)
        .then(response => {
            response.data.profileIcon = this.getProfilePicture(response.data.profileIconId);
            return resolve(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    })
}

riotGameApi.prototype.getSummonerByAccount = function getSummonerByAccount(name) {
    var url = "https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-account/" + name.replace(/ /g, "%20") + "?api_key=" + this.key;
    
    return new Promise((resolve, reject) => {
        
        axios.get(url)
        .then(response => {
            return resolve(response.data);
        })
        .catch(error => {
            return reject(error);
            console.log(error);
        });
    })
}

riotGameApi.prototype.getSummonerById = function getSummonerByAccount(id) {
    var url = "https://euw1.api.riotgames.com/lol/summoner/v3/summoners/" + id + "?api_key=" + this.key;
    
    return new Promise((resolve, reject) => {
        
        axios.get(url)
        .then(response => {
            return resolve(response.data);
        })
        .catch(error => {
            return reject(error);
            console.log(error);
        });
    })
}

//------------------------------------------------------------//
//------------------------LEAGUE-V3---------------------------//
//------------------------------------------------------------//

riotGameApi.prototype.getRankedInfos = function getRankedInfos(id) {
    var url = "https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/" + id + "?api_key=" + this.key;
    
    return new Promise((resolve, reject) => {
        
        axios.get(url)
        .then(response => {
            return resolve(response.data);
        })
        .catch(error => {
            return reject(error);
            console.log(error);
        });
    })
}

module.exports = riotGameApi;