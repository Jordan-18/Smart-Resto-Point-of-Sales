import React, { useEffect, useState, useContext, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Header from './Materials/Header.js'
import Sidebar from './Materials/Sidebar.js'
import Footer from './Materials/Footer.js'
import { BigSpinner } from './Materials/Loading.js';
import MyContext from './MyContext.js';
import RouteModule from '../Routes/Routes.js';

import { getSession, removeSession } from '../services/session.service.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

function Admin({event}){
    const { globalData, setglobalData } = useContext(MyContext);
    const [privateRoute, setprivateRoute] = useState([])

    async function AuthRoute(){
		try {
			let access = ''
			const token = getSession('token');
			let setRoute = []
			let allRoute = []
            const mainRoute = {
                page: 'Dashboard',
                to: '',
                component: React.lazy(() => import(`../modules/Dashboard/index.view.jsx`))
            }
            setRoute.push({ ...mainRoute });
            allRoute.push({ ...mainRoute });
            function capitalizedText(text){
                return text.charAt(0).toUpperCase() + text.slice(1)
            }
			if(token){
				const data = jwt.decode(token)
				access = data?.access
				const response = await axios.get(`${event.globalAPI}/roleaccess/${access}`)
                const checkedmenus = checkMenus(response.data)
                const responseResult = response.data.concat(checkedmenus)
				response.data.forEach(value => {
                    const name = capitalizedText(value.menu_kode)
                    if(value.menuAccess){
                        setRoute.push({
                            page: value.menu_name,
                            to: value.menu_endpoint,
                            component: React.lazy(() => import(`../modules/${name}/index.view.jsx`)),
                            child : value.menus
                        })
                    }
				});

                responseResult.forEach(value => {
                    const name = capitalizedText(value.menu_kode)
					allRoute.push({
						page: value.menu_name,
						to: value.menu_endpoint,
						component: React.lazy(() => import(`../modules/${name}/index.view.jsx`))
					})
					allRoute.push({
						page: value.menu_name+' Create',
						to: `${value.menu_endpoint}/add`,
						component: React.lazy(() => import(`../modules/${name}/form.view.jsx`))
					})
					allRoute.push({
						page: value.menu_name+' Edit',
						to: `${value.menu_endpoint}/update/:id?`,
						component: React.lazy(() => import(`../modules/${name}/form.view.jsx`))
					})
				});

				setglobalData((prevGlobalData) => ({
					...prevGlobalData,
					token : token,
					privateRoute : setRoute
				}))

			}
			setprivateRoute(allRoute)
			// setprivateRoute(setRoute)
		} catch (error) {
			console.log('Error fetching data:', error);
		}
	}

    function checkMenus(menus){
        return Object.values(menus).flatMap(value => {
            const data = { ...value};
            return [data, ...checkMenus(value.menus)];
        });
    }

    useEffect(() => {
		async function fetchData(){
			try {
                await AuthRoute()
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		fetchData()
	}, []);
    return (
        <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
            <div className="app-page flex-column flex-column-fluid" id="kt_app_page">
                <Header/>
                <div className="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
                    <Sidebar/>
                    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
                        <div className="d-flex flex-column flex-column-fluid">
                            <Routes>
                                {privateRoute.map((pageData, index) =>(
                                    <Route 
                                        key={index}
                                        path={`/${pageData.to.toLowerCase()}`} 
                                        element={
                                            <Suspense fallback={<BigSpinner/>}>
                                                <pageData.component/>
                                            </Suspense>
                                        }
                                    />
                                ))}
                                {/* <Route path="*" element={<Navigate to="/" />} /> */}
                            </Routes>
                        </div>
                        <Footer/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;