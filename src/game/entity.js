



const ServiceLocator = require("../service-locator.js")


class Entity {
    
    constructor(team, type){
        this.x = ServiceLocator.getService("Utils").getRandomFloat(0, 1)
        this.y = ServiceLocator.getService("Utils").getRandomFloat(0, 1)
        this.xVelocity = ServiceLocator.getService("Utils").getRandomFloat(0, 0.05)
        this.yVelocity = ServiceLocator.getService("Utils").getRandomFloat(0, 0.05)
        this.team = team 
        this.type = type
        this.hitBoxRadius = ServiceLocator.getService("Config").defaultHitBoxRadius
    }
}

module.exports = Entity
