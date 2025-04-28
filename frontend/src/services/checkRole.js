export const checkRole = (user) => {
    const allowedRoutes = ['event_organizer','admin']
    
    if(!user || !allowedRoutes.includes(user.role)){
         return false
    }

    return true

}

export const isAdmin = (user) => {
    const allowedRoutes = ['admin']
    
    if(!user || !allowedRoutes.includes(user.role)){
         return false
    }

    return true

}