const ServiceLocator = require("../service-locator.js")




class Routes {
    
    static loadDependencies() {
    
        this.ServerController = ServiceLocator.getService("ServerController")
        this.ServerData = ServiceLocator.getService("ServerData")
    }
    
    
    static registerRoutes(express, app){
        
        app.post("/create-game", express.json(), Routes.createGame)
        app.post("/check-game", express.text(), Routes.checkIfGameExist)
        app.post("/get-empty-player-slots", express.text(), Routes.getEmptyPlayerSlots)
    }
    
    
    static createGame(req, res){
        
        let gameOptions = req.body
        let result = Routes.ServerController.createNewGame(gameOptions)
        
        if(result.error){
            res.send( { error: result.error } )
        }
        
        else {
            res.send( { gameId: result.game.gameId } )
        }
    }
    
    static getEmptyPlayerSlots(req, res){
        
        let gameId = req.body
        let game = Routes.ServerData.games[gameId]
        
        if(!game){
            res.send( { error: "game doesn't exist" } )
        }
        
        let emptyPlayerSlots = String( game.getEmptyPlayerSlots() )
        
        res.send( { emptyPlayerSlots } )
    }
    
    static checkIfGameExist(req, res){
        
        let gameId = req.body
        
        res.send(String(Routes.ServerController.checkGame(gameId) ) )
    }
}



console.warn("Routes loaded")
module.exports = Routes