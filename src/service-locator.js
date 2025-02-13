








class ServiceLocator {
    
    static services = new Map()
    
    static registerService(serviceId, service){
        
        ServiceLocator.services.set(serviceId, service)
    }
    
    static getService(serviceId){
        
        if (!ServiceLocator.services.has(serviceId) ){
            throw new Error(`service: "${serviceId}" does not exist`)
        }
        
        return ServiceLocator.services.get(serviceId)
    }
    
}


module.exports = ServiceLocator