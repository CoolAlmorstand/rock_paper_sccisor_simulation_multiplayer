



console.warn("lofed")


export class Controls {
    
    static gameIdInputField = document.getElementById("game-id-input-field")
    static joinButton = document.getElementById("join-game-button")
    static submitUsernameButton = document.getElementById("submit-username-button")
    static usernameInputField = document.getElementById("username-input-field")
    static userNamePopup = document.getElementById("pop-up-container")
    static createGameButton = document.getElementById("create-game-button")
    
    static initializeControls(){
        
        this.gameIdInputField.addEventListener("input", this.inputFieldChanged)
        this.joinButton.addEventListener("click", this.joinGame)
        this.submitUsernameButton.addEventListener("click", this.submitUserName)
        this.usernameInputField.addEventListener("input", this.usernameInputFieldChange)
        this.createGameButton.addEventListener("click", this.createGame)
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


    static async getEmptyPlayerSlots(gameId){
    
        try {
            const response = await fetch('/get-empty-player-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: gameId
            })
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json()
            if (result.error){
                console.warn(`error on getting empty player slots: ${response.error} `)
                return 0
            }
            const { emptyPlayerSlots } = result
            
            return parseInt(emptyPlayerSlots)
        } 
        catch (error) {
            console.error('Error:', error);
        }
    }


    static inputFieldChanged(){
        
        let length = Controls.gameIdInputField.value.length
        
        if(length < 1){
            Controls.joinButton.style.backgroundColor = "gray"
            Controls.joinButton.style.padding = "8px 20px"
        }
        
        else{
            Controls.joinButton.style.backgroundColor = "#4CAF50"
            Controls.joinButton.style.padding = "10px 20px"
        }
    }
    
    
    static async joinGame() {
        
        let gameId = Controls.gameIdInputField.value
        sessionStorage.setItem("game-id", gameId)
        let gameExist = await Controls.checkIfGameExist()
        if(gameId.length != 8 || !gameExist){
            alert("cannot findGame")
            return
        }
        
        let EmptyPlayerSlots = await Controls.getEmptyPlayerSlots(gameId)
        console.warn(`getEmptyPlayerSlots: ${EmptyPlayerSlots}`)
        if(EmptyPlayerSlots == 0){
            alert("game is full")
            return
        }
        sessionStorage.setItem("game-id", gameId)
        window.location.href = "/lobby/lobby.html"
    }
    
    
    static usernameInputFieldChange(){
        
        let length = Controls.usernameInputField.value.length
        
        if(length < 1){
            Controls.submitUsernameButton.style.backgroundColor = "gray"
            Controls.submitUsernameButton.style.width = "80%"
            Controls.submitUsernameButton.style.height = "20%"
        }
        
        else{
            Controls.submitUsernameButton.style.backgroundColor = "#4CAF50"
            Controls.submitUsernameButton.style.width = "85%"
            Controls.submitUsernameButton.style.height = "25%"
        }
    }


    static submitUserName(){
        
        let username = Controls.usernameInputField.value

        if(username.length < 1){
            return
        }
        
        Controls.userNamePopup.style.display = "none"
        
        sessionStorage.setItem("username", username)
    }
    
    
    static async createGame(){
        let gameConfig = {
            startingPoints: 30
        }
        try {
            const response = await fetch('/create-game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameConfig)
            })
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json()
            
            if(result.error){
                console.warn(result.error)
            }
            
            const gameId = result.gameId
            
            console.warn(result)
            sessionStorage.setItem("game-id", gameId)
            window.location.href = "/lobby/lobby.html"
            
            
        } 
        catch (error) {
            console.error('Error:', error);
        }
   }
}