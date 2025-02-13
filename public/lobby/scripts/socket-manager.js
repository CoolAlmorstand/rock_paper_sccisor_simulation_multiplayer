
const player1Name = document.getElementById("player-1-name")
const player2Name = document.getElementById("player-2-name")
const readyButtonBluePlayer = document.getElementById("ready-button-blue-player")
const readyButtonRedPlayer = document.getElementById("ready-button-red-player")


export class SocketManager {
    
    static initializeSocketManager(){
        
        this.socket = io(`${window.location.origin}`, { auth: { connectionType: "initial", username: sessionStorage.getItem("username") } } )
        
        this.socket.on("reconnect_attempt", () => SocketManager.reconnect)
        this.socket.on("starting-game", SocketManager.startGame)
        this.socket.on("update-lobby-information", (playersInfo) => SocketManager.updateLobbyInformation(playersInfo) )
        this.socket.on("send-player-team", (team) => SocketManager.setPlayerTeam(team))
    }
    
    
    static startGame(){
        
        window.location.href = "/game-page/game-page.html"
    }
    
    
    static updateLobbyInformation(playersInfo) {
        
        console.warn(playersInfo)
        
        if (playersInfo.blue){
            player1Name.textContent = playersInfo.blue.username
            readyButtonBluePlayer.style.backgroundColor = playersInfo.blue.isReady ? "#4CAF50" : "grey"
        }
        
        else {
            player1Name.textContent = "waiting"
            readyButtonBluePlayer.style.backgroundColor = "grey"
        }
        
        if (playersInfo.red){
            player2Name.textContent = playersInfo.red.username
            readyButtonRedPlayer.style.backgroundColor = playersInfo.red.isReady ? "#4CAF50" : "grey"
        }
        
        else{
            player2Name.textContent = "waiting"
            readyButtonRedPlayer.style.backgroundColor = "grey"
        }
    }
    
    
    
    static waitForPlayerId(){
    
        return new Promise((resolve) => {
            SocketManager.socket.once("get-player-id", resolve)
        })
    }
    
    
    static reconnect(){
        
        let playerId = sessionStorage.getItem("player-id")
        let username = sessionStorage.getItem("username")
        
        if (!playerId){
            console.warn(`no player id failed to reconnect`)
            return 
        }
        
        SocketManager.socket.auth = {
            connectionType: "reconnection",
            playerId: playerId
        }
    }
    
    static setPlayerTeam(team){
        sessionStorage.setItem("team", team)
    }
}