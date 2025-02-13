








class ServerData {

    static games = {}
    static players = {}
    
    static deleteGame(gameId){
        
        if(!ServerData.games[gameId]){
            console.warn("error tried to delete non existent game")
            return 
        }
        delete ServerData.games[gameId]
    }
    
    static deletePlayer(playerId){
    
        delete ServerData.players[playerId]
    }
    
    static getGame(gameId){
        
        if(!ServerData.games[gameId] ){
            console.warn(`failed to get game: ${gameId} does not exist`)
            return 
        }
        
        return ServerData.games[gameId]
    }
    
    static getPlayerBySocketId(socketId) {
        
        for(let playerId in ServerData.players){
            
            let player = ServerData.players[playerId]
            
            if (player.socketId == socketId){
                return player
            }
        }
        console.warn(`failed to get player by socketId: "${socketId}" `)
        return null
    }
}

console.warn("server-data.js loaded")
module.exports = ServerData
        