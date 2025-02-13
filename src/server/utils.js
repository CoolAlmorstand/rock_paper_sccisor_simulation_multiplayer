






const ServiceLocator = require("../service-locator.js")

class Utils {
    
    static loadDependencies(){
        
         this.Config = ServiceLocator.getService("Config")
         this.ServerData = ServiceLocator.getService("ServerData")
    } 
    
    
    static getRandomInt(min, max){
        
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    
    
    static getIndexOfElement(element, array){
        
        for(let i = 0; i < array.length; i++){
            if (array[i] === element){
                return i
            }
        }
    }
    
    
    static deleteElementFromArray(array, element){
        
        let index = Utils.getIndexOfElement(element, array)
        
        array.splice(index, 1)
    }
    
    
    static generateRamdomId(length = 8){
        
        let id = ""
        let letters = Utils.Config.idCharacters
        
        for(let x = 0; x < length; x++){
            id += letters[Utils.getRandomInt(0, letters.length - 1) ]
        }
        
        return id 
    }
    
    
    static generateId(type){
        
        if (type == "gameId"){
        
            while (true) {
            
                let id = Utils.generateRamdomId(this.Config.gameIdLength)
                          
                if (!this.ServerData.games[id] ){
                    return id
                }
            }
        }
        
        if(type == "playerId"){
            
            while (true){
                
                let id = Utils.generateRamdomId(this.Config.playerIdLength)
                
                if (!this.ServerData.players[id]){
                    return id
                }
            }
        }
    }
    
    
    static getRandomFloat(min, max){
        return Math.random() * (max - min) + min
    }
    
    //returns player object with necessary infos
    static getPlayersInfo(players){
        
        let bluePlayerInfo = players.blue ? {
            isReady: players.blue.isReady,
            points: players.blue.points,
            team: players.blue.team,
            username: players.blue.username
        } : null

        let redPlayerInfo = players.red ? {
            isReady: players.red.isReady,
            points: players.red.points,
            team: players.red.team,
            username: players.red.username
        } : null
            
        let playersInfo = {
            blue: bluePlayerInfo,
            red: redPlayerInfo
        }
        
        return playersInfo
    }
            
}

console.warn("utils.js loaded")
module.exports = Utils