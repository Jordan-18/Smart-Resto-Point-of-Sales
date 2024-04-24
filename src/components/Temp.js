import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import Auth from './Auth.js';
import Admin from './Admin.js';

import MyContext from './MyContext';
import RouteModule from '../Routes/Routes.js';
import { getSession, removeSession } from '../services/session.service.js';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import axios from 'axios';

function Temp(){
	const [globalAPI, setGlobalAPI] = useState('http://localhost:5871');
	const [globalData, setglobalData] = useState([])
	const [isAuthenticated, setIsAuthenticated] = useState(true);
	const [authRoute, setauthRoute] = useState([])

	async function checkAuth(){
		try {
			const token = getSession('token');
			if(!token){ setIsAuthenticated(false) }

			// await axios.get(`${globalAPI}`, {
			// 	headers: {
			// 		Authorization: `${token}`,
			// 	}
			// })
		} catch (error) {
			console.log(error);
			// if(error.response.status == 403){
			// 	removeSession('token')
			// 	setIsAuthenticated(false)
			// }
		}
	}
	async function getData(){
		try {
			setglobalData({
				api : globalAPI
			});
		} catch (error) {
			console.log('Error fetching data:', error);
		}
	}

	async function AuthRoute(){
		try {
			const token = getSession('token');
			if(!token){ setIsAuthenticated(false) }
			const authRoute = RouteModule.filter((pageData) => pageData?.middleware === false)
			setauthRoute(authRoute)
		} catch (error) {
			console.log('Error fetching data:', error);
		}
	}

	useEffect(() => {
		async function fetchData(){
			try {
				await checkAuth()
				await getData()
				await AuthRoute()
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}

		fetchData()
	}, []);

	// if (!isAuthenticated) {
	// 	return <Navigate to="/login" />;
	// }

	return(
		<MyContext.Provider value={{ globalData, setglobalData }}>
			<BrowserRouter>
				{ isAuthenticated ? (
					<Admin event={{
						RouteModule,
						globalAPI,
					}}/>
				) : (
					<>
						<Auth event={{
							authRoute, 
							isAuthenticated, 
							setIsAuthenticated
						}}/>
					</>
				)}
			</BrowserRouter>
		</MyContext.Provider>
	)
}

export default Temp;