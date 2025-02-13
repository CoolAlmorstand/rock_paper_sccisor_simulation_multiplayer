








const ServiceLocator = require("../service-locator.js")

class Game {
    
    constructor( gameId, gameOptions ){
        
        
        //load dependencies
        this.SocketManager = ServiceLocator.getService("SocketManager")
        this.gameStarted = false
        this.ServerData = ServiceLocator.getService("ServerData")
        this.Utils = ServiceLocator.getService("Utils")
        this.Config = ServiceLocator.getService("Config")
        this.Player = ServiceLocator.getService("Player")
        
        this.gameOptions = gameOptions || { 
            startingPoints: 30
        }
        
        this.gameId = gameId
        
        this.players = {
            blue: null, 
            red: null 
        }
        
        this.playerLookup = new Map()
        
        this.gameEngine = new ( ServiceLocator.getService("GameEngine") ) (gameId, gameOptions, this.players)
    }
    
    addPlayer(player){
        
        if(this.players.blue && this.players.red){
            console.warn(`player ${socketId} tried connecting to a full game ${this.gameId}`)
            return 
        }
        
        let team = this.players.blue ? "red" : "blue"
        
        player.setPlayerGameData(this.gameId, team, this.gameOptions.startingPoints)
        
        this.players[team] = player 
        this.playerLookup.set(player.playerId, player)
        
        return player
    }
    
    removePlayer(playerId){
    
        if (!this.playerLookup.has(playerId) ) {
            console.warn(`falied to remove player: ${socketId} on game: ${this.gameId} player is not in game`)
            return 
        }
        
        let playerTeam = this.playerLookup.get(playerId).team
        
        this.players[playerTeam] = null
        this.playerLookup.delete(playerId)
    }
    
    getEmptyPlayerSlots() {
        
        let players = this.players
        let emptyPlayerSlots = 2
        
        for(let player in players){
            if(players[player] ){
                emptyPlayerSlots -= 1
            }
        }
        return emptyPlayerSlots
    }
    
    startGame() {
        this.gameStarted = true
        this.gameEngine.startGame()
    }
    
    checkIfReadyToStart(){
        
        if (this.players.blue && this.players.blue.isReady && this.players.red && this.players.red.isReady) {
            this.SocketManager.io.to(this.gameId).emit("starting-game")
            this.startGame()
        }
        return false
    }
    
}

console.warn("game.js loading")
module.exports = Game