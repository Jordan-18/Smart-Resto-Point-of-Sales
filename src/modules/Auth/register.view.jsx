import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import { NavLink } from 'react-router-dom';
import { onRegister } from './register.service.js';

function Register(){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);

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
                <form className="form w-100" id="sign_up_form" onSubmit={(event) => onRegister({event, setglobalData})}>
                    <div className="text-center mb-11">
                        <h1 className="text-dark fw-bolder mb-3">Sign Up</h1>
                    </div>
                    <div className="fv-row mb-8">
                        <input type="text" placeholder="Full Name" name="user_name" className="form-control bg-transparent" />
                    </div>
                    <div className="fv-row mb-8">
                        <input type="text" placeholder="Username" name="user_username" className="form-control bg-transparent" />
                    </div>
                    <div className="fv-row mb-8">
                        <input type="email" placeholder="Email" name="user_email" className="form-control bg-transparent" />
                    </div>
                    <div className="fv-row mb-8">
                        <input type="password" placeholder="Password" name="user_password" className="form-control bg-transparent" />
                    </div>
                    <div className="fv-row mb-8">
                        <input type="password" placeholder="Password Repeat" name="user_password_repeat" className="form-control bg-transparent" />
                    </div>

                    <div className="d-grid mb-10">
                        <button type="submit" id="kt_sign_in_submit" className="btn btn-primary">
                            <span className="indicator-label">Sign Up</span>
                        </button>
                    </div>
                    <div className="text-gray-500 text-center fw-semibold fs-6">Have an account?
                        <NavLink to={'/login'} className="link-primary">Sign In</NavLink>
                    </div>
                </form>
            }
        </div>
    )
}

export default Register