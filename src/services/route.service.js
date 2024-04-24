// const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:5871/roleaccess/cb8681f61b7740299b4a2c644abb35d2');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       throw error;
//     }
//   };
  
// export const RouteModule = (async () => {
//     try {
//       const data = await fetchData();
  
//       const routes = [
//         { page: 'Dashboard', to: '', component: React.lazy(() => import('../modules/Dashboard/index.view.js')) },
//         { page: 'Login Page', to: 'login', middleware:false,component: React.lazy(() => import('../modules/Auth/login.view.js')) },
//         { page: 'Register Page', to: 'register', middleware:false,component: React.lazy(() => import('../modules/Auth/register.view.js')) },
//         { page: 'Forgot Page', to: 'forgot', middleware:false,component: React.lazy(() => import('../modules/Auth/register.view.js')) },
//       ];
  
//       data.forEach((value) => {
//         routes.push({
//           page: value.menu_name,
//           to: value.menu_endpoint,
//           component: React.lazy(() => import(`../modules/${value.menu_name}/index.view.js`)),
//         });
//       });
  
//       return routes;
//     } catch (error) {
//       console.error('Error populating routes:', error);
//       return [];
//     }
// })();