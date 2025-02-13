







export class Renderer {

    static canvas = document.getElementById("game-canvas")
    static canvasContext = Renderer.canvas.getContext("2d")
    static resolution = {width: null, height: null }
    static defaultEntitySize = 32
    static textures = {
        red: {
            paper: null,
            scissors: null,
            rock: null
        },
        blue: {
            paper: null,
            scissors: null,
            rock: null
        }
    }
    
    
    static loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = path
            img.onload = () => resolve(img)
            img.onerror = reject
        })
    }
    
    static async loadTextures(){
        
        Renderer.textures.blue.paper = await Renderer.loadImage("/game-page/images/blue-paper-texture.png")
        Renderer.textures.red.paper = await Renderer.loadImage("/game-page/images/red-paper-texture.png")
        
        Renderer.textures.blue.scissors  = await Renderer.loadImage("/game-page/images/blue-scissors-texture.png")
        Renderer.textures.red.scissors = await Renderer.loadImage("/game-page/images/red-scissors-texture.png")
        
        Renderer.textures.blue.rock = await Renderer.loadImage("/game-page/images/blue-rock-texture.png")
        Renderer.textures.red.rock = await Renderer.loadImage("/game-page/images/red-rock-texture.png")
    }
    
    
    static setCanvasResolution() {
        
        let rect = Renderer.canvas.getBoundingClientRect()
        let width = rect.width * 2
        let height = rect.height * 2
        
        Renderer.canvas.width = width
        Renderer.canvas.height = height
        
        Renderer.resolution.width = width
        Renderer.resolution.height = height
    }
    
    
    static async initializeRenderer() {
        
        Renderer.setCanvasResolution()
        await Renderer.loadTextures()
    }
    
    
    static drawEntities(entities) {
        
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for(let team in entities) {
            let teamEntities = entities[team]
            for(let entityType in teamEntities){
                for(let entity of teamEntities[entityType]){
                    
                    let texture = Renderer.textures[entity.team][entityType]
                    let x = Math.round( entity.x * Renderer.resolution.width )
                    let y = Math.round( entity.y * Renderer.resolution.height )
                    let size = Renderer.defaultEntitySize
                    
                    Renderer.canvasContext.drawImage(texture, x, y, size, size)
                }
            }
        }
    }
}