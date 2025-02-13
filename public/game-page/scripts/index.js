
import { Controls } from "./controls.js"
import { SocketManager } from "./socket-manager.js"
import { Renderer } from "./renderer.js"

async function initializePage(){
    
    Controls.initializeControls()
    await Renderer.initializeRenderer()
    SocketManager.initializeSocketManager()
    
}
    

initializePage()