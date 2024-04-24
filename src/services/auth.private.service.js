// import { getSession, removeSession } from './session.service.js';

// export async function AuthRoute(privateRoute, setprivateRoute){
//     try {
//         const privateRoute = RouteModule.filter((pageData) => pageData?.middleware != false)
//         setprivateRoute(privateRoute)
//     } catch (error) {
//         console.log('Error fetching data:', error);
//     }
// }

// export async function AuthRoute(event){
//     try {
//         let access = ''
//         const token = getSession('token');
//         if(token){
//             setIsAuthenticated(true)
//             const data = jwt.decode(token)
//             access = data?.access	
//         }
//         const authRoute = RouteModule.filter((pageData) => pageData?.middleware == false)
//         event.setauthRoute(authRoute)

//         const privateRoute = RouteModule.filter((pageData) => pageData?.middleware != false)
//         event.setprivateRoute(privateRoute)
//     } catch (error) {
//         console.log('Error fetching data:', error);
//     }
// }