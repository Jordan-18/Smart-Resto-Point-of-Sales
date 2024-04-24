import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import { NavLink } from 'react-router-dom';
import { onLogin } from './login.service.js';
import { Navigate } from 'react-router-dom';

function Login({event}){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);
    const IsAuthenticated = event.IsAuthenticated
    const setIsAuthenticated = event.setIsAuthenticated

    useEffect(() => {
        async function fetchData(){
			try {
                setLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		}
        fetchData()
    }, [globalData]);

    return(
        <div>
            {loading ? (
                <div className="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6">
                </div>
            ) : 
                <form className="form w-100" id="sign_in_form" data-kt-redirect-url="" 
                    onSubmit={(event) => 
                        onLogin({ event,globalData,setglobalData,setLoading, IsAuthenticated, setIsAuthenticated })
                    }
                >
                    <div className="text-center mb-11">
                        <h1 className="text-dark fw-bolder mb-3">Sign In</h1>
                        <div className="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>
                    </div>
                    <div className="fv-row mb-8">
                        <input type="text" placeholder="Username" name="user_username" className="form-control bg-transparent" />
                    </div>
                    <div className="fv-row mb-3">
                        <input type="password" placeholder="Password" name="user_password" className="form-control bg-transparent" />
                    </div>
                    <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                        <div></div>
                        <NavLink to={'/forgot'}  className="link-primary">Forgot Password ?</NavLink>
                    </div>
                    <div className="d-grid mb-10">
                        <button type="submit" id="kt_sign_in_submit" className="btn btn-primary">
                            <span className="indicator-label">Sign In</span>
                            <span className="indicator-progress">Please wait...
                            <span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                        </button>
                    </div>
                    <div className="text-gray-500 text-center fw-semibold fs-6">Not a Member yet?
                        <NavLink to={'/register'} className="link-primary">Sign up</NavLink>
                    </div>
                </form>
            }
        </div>
    )
}

export default Login