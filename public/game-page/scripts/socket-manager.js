



import { Renderer } from "./renderer.js"


const pointsLabel = document.getElementById("points")

const redPaperCounter = document.getElementById("red-paper-counter")
const redRockCounter = document.getElementById("red-rock-counter")
const redScissorsCounter = document.getElementById("red-scissors-counter")

const bluePaperCounter = document.getElementById("blue-paper-counter")
const blueRockCounter = document.getElementById("blue-rock-counter")
const blueScissorsCounter = document.getElementById("blue-scissors-counter")

const gameOverScreen = document.getElementById("game-over-screen")
const winnerLabel = document.getElementById("winner-text")


export class SocketManager{
    
    
    static initializeSocketManager(){
        this.socket = io(`${window.location.origin}`, { 
            auth: { 
                connectionType: "reconnection", 
                playerId: sessionStorage.getItem("player-id"), 
                gameId: sessionStorage.getItem("game-id")
            }
        })
        this.socket.on("send-game-engine-info", (playersInfo, entities)  => SocketManager.updateGameState(playersInfo, entities) )
        this.socket.on("send-winner", (winner) => SocketManager.showGameOverScreen(winner) )
    }
    
    static startGame(){
        this.socket.emit("start-game")
    }
    
    static showGameOverScreen(winner){
        console.warn(winner)
        gameOverScreen.style.display = "flex"
        winnerLabel.textContent = `winner: ${winner}`
    }
    
    static addEntity(entityType){
        
        let gameId = sessionStorage.getItem("game-id")
        let playerId = sessionStorage.getItem("player-id")
        this.socket.emit("add-entity", gameId, playerId, entityType)
    }
    
    static updateCounters(entities){
    
        redPaperCounter.textContent = `📜 ${entities["red"]["paper"].length}`
        redRockCounter.textContent = `🪨 ${entities["red"]["rock"].length}`
        redScissorsCounter.textContent = `✂️ ${entities["red"]["scissors"].length}`
        
        bluePaperCounter.textContent = `📜 ${entities["blue"]["paper"].length}`
        blueRockCounter.textContent = `🪨 ${entities["blue"]["rock"].length}`
        blueScissorsCounter.querySelector("span").textContent = entities["blue"]["scissors"].length
    }
    
    static updateGameState(playersInfo, entities) {
        
        let playerTeam = sessionStorage.getItem("team")
        pointsLabel.textContent = `Points: ${playersInfo[playerTeam].points}`
        SocketManager.updateCounters(entities)
        
        Renderer.drawEntities(entities)
    }
}