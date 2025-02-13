const express = require('express');
const http = require('http');
const path = require('path');

const ServiceLocator = require("./src/service-locator.js")

const Config = require("./src/server/config.js")
const Utils = require("./src/server/utils.js")
const ServerData = require("./src/server/server-data.js")

const SocketManager = require("./src/networking/socket-manager.js")
const Routes = require("./src/networking/routes.js")
const ServerController = require("./src/server/server-controller.js")

const Game = require("./src/game/game.js")
const Player = require("./src/game/player.js")
const GameEngine = require("./src/game/game-engine.js")
const Entity = require("./src/game/entity.js")



class App {

    constructor(port) {
    
        this.port = process.env.PORT || 3000
        this.app = express()
        this.server = http.createServer(this.app)
        
        this.initializeApp()
        this.initializeDependencies()
    }

    
    initializeApp() {
    
        this.app.use(express.static(path.join(__dirname, 'public')))
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, './public/home-page/home-page.html'));
        })
    }


    initializeDependencies(){
    
        ServiceLocator.registerService("Config", Config)
        ServiceLocator.registerService("Utils", Utils)
        ServiceLocator.registerService("ServerData", ServerData)
        
        ServiceLocator.registerService("SocketManager", SocketManager)
        ServiceLocator.registerService("Routes", Routes)
        ServiceLocator.registerService("ServerController", ServerController)
        
        ServiceLocator.registerService("Game", Game)
        ServiceLocator.registerService("Player", Player)
        ServiceLocator.registerService("GameEngine", GameEngine)
        ServiceLocator.registerService("Entity", Entity)
        
        Routes.loadDependencies()
        SocketManager.loadDependencies()
        Utils.loadDependencies()
        ServerController.loadDependencies()
        
        
        Routes.registerRoutes(express, this.app)
        SocketManager.initializeSocketManager(this.server)
    }
    
    
    start() {
    
        this.server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}


const app = new App()
app.start()