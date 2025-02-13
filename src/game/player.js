





const ServiceLocator = require("../service-locator.js")


class Player {
    
    constructor(socket, username){
        
        this.socket = socket
        this.socketId = socket.id
        this.playerId = ServiceLocator.getService("Utils").generateId("playerId")
        this.username = username
        this.lastConnectionTime = null
        this.isReady = false
        this.gameId = null
        this.isConnected = true
    }
    
    setPlayerGameData(gameId, team, points){
        this.gameId = gameId
        this.points = points
        this.team = team
    }
    
    resetPlayerGameData(){
        this.isReady = false
        this.gameId = null
        this.points = null
        this.team = null
    }

}

module.exports = Player