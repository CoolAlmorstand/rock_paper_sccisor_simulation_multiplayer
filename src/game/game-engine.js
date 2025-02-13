




const ServiceLocator = require("../service-locator.js")

class GameEngine {
    
    constructor(gameId, gameOptions, players) {
    
        // depencies
        this.Config = ServiceLocator.getService("Config")
        this.Utils = ServiceLocator.getService("Utils")
        this.SocketManager = ServiceLocator.getService("SocketManager")
        this.Entity = ServiceLocator.getService("Entity")
        this.ServerData = ServiceLocator.getService("ServerData")
        
        this.gameId = gameId
        this.gameOptions = gameOptions
        this.players = players
        this.entities = {
            paper: [],
            rock: [],
            scissors: []
        }
        this.teamBlueEntities = {
            paper: [],
            rock: [],
            scissors: []
        }
        this.teamRedEntities = {
            paper: [],
            rock: [],
            scissors: []
        }
        
        this.EngineUpdateRate = ServiceLocator.getService("Config").engineUpdateRate
    }
    
    
    addEntity(team, type){
        
        let entity = new this.Entity(team, type)
        
        this.entities[type].push(entity)

        if(team == "blue"){
            this.teamBlueEntities[type].push(entity)
        }
        
        else if(team == "red"){
            this.teamRedEntities[type].push(entity)
        }
    }
    
    moveEntities(){
        for(let type in this.entities){
            for(let entity of this.entities[type]){
                
                if(entity.x + entity.xVelocity > 1 && entity.xVelocity > 0){
                    entity.xVelocity *= -1
                }
                    
                else if(entity.x + entity.xVelocity < 0 && entity.xVelocity < 0){
                    entity.xVelocity *= -1
                }
                
                if(entity.y + entity.yVelocity > 1 && entity.yVelocity > 0){
                    entity.yVelocity *= -1
                }
                
                else if(entity.y + entity.yVelocity < 0 && entity.yVelocity < 0){
                    entity.yVelocity *= -1 
                }
                
                entity.x += entity.xVelocity
                entity.y += entity.yVelocity
            }
        }
    }
    
    getDistanceOfTwoEntities(entity1, entity2){
        
        let xDistance = Math.max( (entity1.x - entity2.x), (entity2.x - entity1.x) )
        let yDistance = Math.max( (entity1.y - entity2.y), (entity2.y - entity1.y) )
        
        let distance = Math.sqrt( ( xDistance**2 ) + (yDistance**2) )
        
        return distance
    }
    
    getCollisions(){
        
        let collisions = []
        
        for(let type in this.teamRedEntities){
            for(let entity of this.teamRedEntities[type]){
                for(let enemyType in this.teamBlueEntities){
                
                    if(enemyType == entity.type) { continue }
                    
                    for(let enemyEntity of this.teamBlueEntities[enemyType]){
                        
                        let distance = this.getDistanceOfTwoEntities(entity, enemyEntity)
                        
                        if ( distance <= ( entity.hitBoxRadius + enemyEntity.hitBoxRadius) ){
                            collisions.push( {entity1: entity, entity2: enemyEntity} )
                        }
                    }
                }
            } 
        }
        return collisions
    }
    
    
    deleteEntity(entity){
        
        this.Utils.deleteElementFromArray(this.entities[entity.type], entity)
        
        if(entity.team == "blue"){
            this.Utils.deleteElementFromArray(this.teamBlueEntities[entity.type], entity)
        }
        
        else{
            this.Utils.deleteElementFromArray(this.teamRedEntities[entity.type], entity)
        }
    }
    
    
    resolveCollisions(){
        
        let collisions = this.getCollisions()
        
        for(let collision of collisions){
            
            let { entity1, entity2 } = collision
            
            if(entity1.type == entity2.type){
                continue
            }
            
            if(entity1.type == "rock" && entity2.type == "paper"){
                this.deleteEntity(entity1)
            }
            
            if(entity1.type == "rock" && entity2.type == "scissors"){
                this.deleteEntity(entity2)
                
            }
            
            
            if(entity1.type == "paper" && entity2.type == "rock"){
                this.deleteEntity(entity2)
                
            }
            
            if(entity1.type == "paper" && entity2.type == "scissors"){
                this.deleteEntity(entity1)
            }
            
            if(entity1.type == "scissors" && entity2.type == "rock"){
                this.deleteEntity(entity1)
            }
            
            if(entity1.type == "scissors" && entity2.type == "paper"){
                this.deleteEntity(entity2)
            }
        }
    }
    
    getTotalTeamEntities(team){
        
        if(team == "blue"){
            return this.teamBlueEntities.paper.length + this.teamBlueEntities.rock.length + this.teamBlueEntities.scissors.length
        }
        else {
            return this.teamRedEntities.paper.length + this.teamRedEntities.rock.length + this.teamRedEntities.scissors.length
        }
    }
    
    checkForWinner(){
        
        if(this.players.blue.points == 0 && this.getTotalTeamEntities("blue") == 0 ){
            return "red"
        }
        
        else if(this.players.red.points == 0 && this.getTotalTeamEntities("red") == 0 ){
            return "blue"
        }
        
        else{
            return null
        }
    }
        

    simulateFrame() {
        
        let winner = this.checkForWinner()
        if ( winner ) {
            console.log(`team: ${winner} won`)
            this.stopGame()
            this.SocketManager.sendWinner(this.players[winner].username, this.gameId)
            this.ServerData.deleteGame(this.gameId)
            return 
        }
        
        this.moveEntities()
        this.resolveCollisions()
        this.SocketManager.sendGameEngineInfo(this.gameId)
    }
    
    stopGame() {
        clearInterval(this.engine)
    }
    
    startGame(){
        this.engine = setInterval( () => this.simulateFrame(), this.EngineUpdateRate)
        return false
    }
}


module.exports = GameEngine