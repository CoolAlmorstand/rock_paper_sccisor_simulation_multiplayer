








const ServiceLocator = require("../service-locator.js")

class ServerController {

    static loadDependencies(){
        
        this.Config = ServiceLocator.getService("Config")
        this.Utils = ServiceLocator.getService("Utils")
        this.ServerData = ServiceLocator.getService("ServerData")
        this.Game = ServiceLocator.getService("Game")
    }
    
    static createNewGame(gameOptions) {
    
        if(ServerController.ServerData.games.length >= ServerController.Config.maxGames){
        
            return { error: "server busy" }
        }
        
        let gameId = ServerController.Utils.generateId("gameId")
        let game = new ServerController.Game(gameId, gameOptions)
        
        ServerController.ServerData.games[gameId] = game
        console.warn(`new game created ${game.gameId} `)
        return { game }
    }
    
    
    static checkGame(gameId){
        
        if(ServerController.ServerData.games[gameId]){
            return true
        }
        else {
            return false
        }
    }
    
}


module.exports = ServerController