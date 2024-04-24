import React from 'react';
import { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { BigSpinner } from './Materials/Loading.js';

function Auth({event}){
    const isAuthenticated = event.isAuthenticated;
    const setIsAuthenticated = event.setIsAuthenticated;
    
    return (
        <div className="d-flex flex-column flex-root" id="kt_app_root">
            <div className="d-flex flex-column flex-column-fluid flex-lg-row">
                <div className="d-flex flex-center w-lg-50 p-10">
                    <div className="card rounded-3 w-md-550px">
                        <div className="card-body p-10 p-lg-20">
                            <Routes>
                                {event.authRoute.map((pageData, index) =>(
                                    <Route 
                                        key={index}
                                        path={`/${pageData.to.toLowerCase()}`} 
                                        element={
                                            <Suspense fallback={<BigSpinner/>}>
                                                <pageData.component event={{isAuthenticated,setIsAuthenticated}}/>
                                            </Suspense>
                                        }
                                    />
                                ))}
                                {/* <Route path="*" element={<Navigate to="/login" />} /> */}
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth;