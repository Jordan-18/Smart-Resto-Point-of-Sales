import React from 'react';

const RouteModule = [
	{ page: 'Login Page', to: 'login', middleware:false,component: React.lazy(() => import('../modules/Auth/login.view.jsx')) },
	{ page: 'Register Page', to: 'register', middleware:false,component: React.lazy(() => import('../modules/Auth/register.view.jsx')) },
	{ page: 'Forgot Page', to: 'forgot', middleware:false,component: React.lazy(() => import('../modules/Auth/register.view.jsx')) },
];

export default RouteModule;