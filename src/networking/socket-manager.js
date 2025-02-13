








const ServiceLocator = require("../service-locator.js")

const socketIo = require('socket.io')

class SocketManager {
    
    static loadDependencies() {
        
        this.ServerData = ServiceLocator.getService("ServerData")
        this.Config = ServiceLocator.getService("Config")
        this.Utils = ServiceLocator.getService("Utils")
        this.Player = ServiceLocator.getService("Player")
    }
    
    
    static initializeSocketManager(server) {
    
        this.io = socketIo(server)
        this.io.on('connection', SocketManager.OnConnection)
    }


    static OnConnection(socket) {
        
        socket.on('connect-to-game', (connectionInfo) => SocketManager.connectToGame(socket, connectionInfo))
        socket.on('leave-game', (playerId, gameId) => SocketManager.leaveGame(socket, playerId, gameId))
        socket.on('disconnect', (reason) => SocketManager.disconnect(socket, reason))
        socket.on("start-game", (gameId) => SocketManager.startGame(gameId) )
        socket.on("update-player-readiness", (gameId, playerId) => SocketManager.updatePlayerReadiness(gameId, playerId))
        socket.on("add-entity", (gameId, playerId, entityType) => SocketManager.addEntity(socket, gameId, playerId, entityType) )
        
        if (socket.handshake.auth.connectionType == "initial") {
            SocketManager.newConnection(socket)
        }
        
        else if(socket.handshake.auth.connectionType == "reconnection"){
            SocketManager.reconnectPlayer(socket)
        }
    }
    
    
    static startGame(socket, gameId){
        
        let game = this.ServerData.getGame(gameId)
        
        if (!game){
            console.warn(`failed to start game: ${gameId} game does not exist`)
            return
        }
        
        game.startGame()
    }
    
    
    static newConnection(socket){
        
        console.warn('new userconnected:', socket.id)
        
        let username = socket.handshake.auth.username
        let player = new SocketManager.Player(socket, username)
        
        SocketManager.ServerData.players[player.playerId] = player
        socket.emit("get-player-id", player.playerId)
    }
    
    
    static reconnectPlayer(socket) {
        
        let playerId = socket.handshake.auth.playerId
        let player = SocketManager.ServerData.players[playerId]
        let gameId = socket.handshake.auth.gameId
        
        if (!player){
            console.warn(`reconnection failed player: "${playerId}" not found`)
            socket.emit("failed to reconnect", { reason : "player object not found"} )
            return 
        }
        
        
        if( (Date.now() - player.lastConnectionTime ) > SocketManager.Config.maxDisconnectionTime) {
            console.warn(`recconection failed player: "${playerId}" exceeded max timeout `)
            socket.emit("failed to reconnect", { reason : "exceeded max timeout"} )
            socket.emit("failed to reconnect")
            return 
        }
        
        player.socket = socket
        player.socketId = socket.id
        player.isConneted = true
        
        if(gameId){ socket.join(gameId) }
        console.warn(`player: "${playerId}" successfulness reconnected`)
    }

    
    static disconnect(socket, reason) {
    
        let player = SocketManager.ServerData.getPlayerBySocketId(socket.id)
    
        if(!player){
            console.warn(`socket: ${socket.id} has no player object at disconnection`)
            return 
        }
        
        let game = SocketManager.ServerData.games[player.gameId]
        
        if(game && !game.gameStarted) {
            
            SocketManager.leaveGame(socket, player.playerId, game.gameId)
            return
        }
        
        else if(!game){
            SocketManager.ServerData.deletePlayer(player.id)
        }
        
        player.isConnected = false
        player.lastConnectionTime = Date.now()
    }
    
    
    static updateLobbyInformation(gameId){
        
        let game = SocketManager.ServerData.games[gameId]
        if(!game){
            return
        }
        let players = game.players
        
        let playersInfo = SocketManager.Utils.getPlayersInfo(players)
        
        SocketManager.io.to(gameId).emit("update-lobby-information", playersInfo)
    }
    
    
    static connectToGame(socket, connectionInfo) {
    
        let gameId = connectionInfo.gameId
        let playerId = connectionInfo.playerId
        
        let game = SocketManager.ServerData.games[gameId]
        let player = SocketManager.ServerData.players[playerId]
        
        if (!game){
            console.warn(`player: "${playerId}" failed to join game: "${gameId}" game does not exist`)
            return
        }
        
        if (!player){
            console.warn(`player: "${playerId}" failed to join game: "${gameId}" player does not exist `)
            return 
        }
        
        socket.join(gameId)
        game.addPlayer(player)
        
        socket.emit("send-player-team", player.team)
        
        SocketManager.updateLobbyInformation(gameId)
        
    }


    static leaveGame(socket, playerId, gameId) {
    
    
        console.warn(`player: ${playerId} leaving game: ${gameId}`)
        let game = SocketManager.ServerData.games[gameId]
        
        if(!game){
            console.warn(`player: ${playerId} is trying to leave non existent game: ${gameId}`)
        }
        
        game.removePlayer(playerId)
        SocketManager.ServerData.deletePlayer(playerId)
        socket.leave(gameId)
        
        //delete game if both player leave
        if(game.playerLookup.size == 0){
            SocketManager.ServerData.deleteGame(gameId)
        }
        
        else{
            SocketManager.updateLobbyInformation(gameId)
        }
    }


    static addEntity(socket, gameId, playerId, entityType){
        
        let player = SocketManager.ServerData.players[playerId]
        let game = SocketManager.ServerData.games[gameId]
        
        if(!player){ 
            console.warn(`fialed to add entity player: ${playerId} does not exist`)
            return
        }
        if(!game){
            console.warn(`failed to add entity game: ${gameId} does not exist `)
            return
        }
        
        if(player.points < 1){
            return
        }
        player.points -= 1
        game.gameEngine.addEntity(player.team, entityType)
    }


    static sendGameEngineInfo(gameId){
        
        let game = SocketManager.ServerData.getGame(gameId)
        
        if (!game){
            console.warn(`error trying to send game engine info of nonexistent game ${gameId}`)
            return 
        }
        
        let entities = {
            blue: game.gameEngine.teamBlueEntities,
            red: game.gameEngine.teamRedEntities
        }
        
        let playersInfo = SocketManager.Utils.getPlayersInfo(game.players)
        
        this.io.to(gameId).emit("send-game-engine-info", playersInfo, entities)
    }
    
    
    static updatePlayerReadiness(gameId, playerId){
        
        let game = SocketManager.ServerData.games[gameId]
        
        let player = SocketManager.ServerData.players[playerId]
        
        if(!game || !player || !game.playerLookup.get(playerId)){
            
            console.warn(`attempting to update readiness status of non existent player`)
            return 
        }
        player.isReady = player.isReady ? false : true
        
        SocketManager.updateLobbyInformation(gameId)
        game.checkIfReadyToStart()
    }
    
    
    static sendWinner(winner, gameId){
        
        console.warn("sending winner")
        SocketManager.io.to(gameId).emit("send-winner", winner)
    }
}

module.exports = SocketManager
