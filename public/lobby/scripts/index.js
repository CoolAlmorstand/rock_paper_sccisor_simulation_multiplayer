

import { SocketManager } from "./socket-manager.js"
import { Controls } from "./controls.js"


const gameIdLabel = document.getElementById("game-id")
const gameId = sessionStorage.getItem("game-id")

const username = sessionStorage.getItem("username")
const player1Name = document.getElementById("player-1-name")
const player2Name = document.getElementById("player-2-name")


async function checkIfClientHasNeccesaryData(){
    
    if(!gameId || !username || ! await Controls.checkIfGameExist() ){
        console.warn(`cleint has null info`)
        window.location.href = "/home-page/home-page.html"
    }
}

function initializePage() {
    SocketManager.initializeSocketManager()
    Controls.initializeControls()
    gameIdLabel.textContent = `Room Id: ${sessionStorage.getItem("game-id")}`
    
}

checkIfClientHasNeccesaryData()

initializePage()

sessionStorage.setItem("player-id", await SocketManager.waitForPlayerId())

console.warn(sessionStorage.getItem("player-id"))
Controls.joinGame()
