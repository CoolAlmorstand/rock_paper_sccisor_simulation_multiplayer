

import { SocketManager } from "./socket-manager.js"


export class Controls {

    static exitButton = document.getElementById("exit-button")
    static readyButtonBluePlayer = document.getElementById("ready-button-blue-player")
    static readyButtonRedPlayer = document.getElementById("ready-button-red-player")

    static initializeControls(){
        
        this.exitButton.addEventListener("click", this.exitRoom)
        this.readyButtonBluePlayer.addEventListener("click", Controls.updatePlayerReadiness)
        this.readyButtonRedPlayer.addEventListener("click", Controls.updatePlayerReadiness)
    }


    static async checkIfGameExist(){
        let gameId = sessionStorage.getItem("game-id")
        
        try {
            const response = await fetch('/check-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain' 
                },
                body: gameId
            })
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const gameExist = await response.text()
            
            if(gameExist == "true"){
                return true
            }
            
            else{
                return false
            }
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }
   
    
    static async joinGame() {
        
        let gameId = sessionStorage.getItem("game-id")
        let gameExist = await this.checkIfGameExist()
        
        if(gameExist){
            
            let connectionInfo = {
                playerId: sessionStorage.getItem("player-id"),
                gameId: gameId 
            }
            
            console.warn(`playerId: ${connectionInfo.playerId}`)
            SocketManager.socket.emit('connect-to-game', connectionInfo)
        }
        
        else {
            console.warn(`game does not exist ${gameId}`)
        }
    }
    
    static exitRoom(){

        let gameId = sessionStorage.getItem("game-id")
        let playerId = sessionStorage.getItem("player-id")
        SocketManager.socket.emit("leave-game", playerId, gameId)
        window.location.href = "/home-page/home-page.html"
    }
    
    
    static async updatePlayerReadiness(event){
        
        let team = sessionStorage.getItem("team")
        let gameId = sessionStorage.getItem("game-id")
        let playerId = sessionStorage.getItem("player-id")
        
        console.warn(`team ${team}`)
        if(event.target == Controls.readyButtonBluePlayer && team == "blue"){
             
            SocketManager.socket.emit("update-player-readiness", gameId, playerId)
        }
        
        else if(event.target == Controls.readyButtonRedPlayer && team == "red"){
            
            SocketManager.socket.emit("update-player-readiness", gameId, playerId)
        }
    }
        
}