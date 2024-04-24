export const setAccess = (Routing) => {
    try {
        const response = {
            'create': Routing.menuAccess.menuaccess_create == 1 ? true : false,
            'read'  : Routing.menuAccess.menuaccess_read == 1 ? true : false,
            'update': Routing.menuAccess.menuaccess_update == 1 ? true : false,
            'delete': Routing.menuAccess.menuaccess_delete == 1 ? true : false
        }
        return response
    } catch (error) {
        return error
    }
}