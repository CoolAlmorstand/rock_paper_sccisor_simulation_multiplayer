


import { SocketManager } from "./socket-manager.js"



export class Controls {
    
    static addPaperButton = document.getElementById("add-paper")
    static addRockButton = document.getElementById("add-rock")
    static addScissorsButton = document.getElementById("add-scissors")
    static mainMenuButton = document.getElementById("main-menu-button")
    
    static initializeControls(){
        
        Controls.addPaperButton.addEventListener("click", Controls.addPaper)
        Controls.addRockButton.addEventListener("click", Controls.addRock)
        Controls.addScissorsButton.addEventListener("click", Controls.addScissors)
        Controls.mainMenuButton.addEventListener("click", Controls.goToMainMenu)

    }
    
    static goToMainMenu(){
        
        sessionStorage.clear()
        window.location.href = "/home-page/home-page.html"
    }

    static addPaper(){
        
        console.warn(`adding paper`)
        SocketManager.addEntity("paper")
    }
    
    static addRock(){
        
        SocketManager.addEntity("rock")
    }
    
    static addScissors(){
        
        SocketManager.addEntity("scissors")
    }
}

