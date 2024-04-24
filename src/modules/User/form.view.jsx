import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Setting from '../Setting/index.view.jsx'
import { useNavigate,useParams } from 'react-router-dom';
import { getUserbyId, createUser, updateeUser } from './index.service.js'

function User(){
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { globalData, setglobalData } = useContext(MyContext);
    const { id } = useParams();
    const [Toolbar, setToolbar] = useState({})
    const [BtnSubmit, setBtnSubmit] = useState('')
    const navigate = useNavigate()
    let [userData, setuserData] = useState({user_name : '',user_username : '',user_email : ''})
    
    async function setBreadcrumb(){
        setToolbar({User : '/setting/user', Add : '/setting/user/add'})
        setBtnSubmit('Create')
        if(id != undefined){
            setToolbar({User : '/setting/user', Edit : `/setting/user/update/${id}`})
            setBtnSubmit('Update')

            const result = await getUserbyId({api: globalData.api, token: globalData.token, id: id})
            setuserData({
                user_name : result.user_name,
                user_username : result.user_username,
                user_email : result.user_email
            })
        }
    }

    async function onSubmit(event){
        setLoadingSubmit(true)
        if(BtnSubmit == 'Create'){
            const status = createUser({event, api: globalData.api, token: globalData.token, setLoadingSubmit})
            if(status){
                navigate('/setting/user')
            }
        }else if(BtnSubmit == 'Update'){
            const status = updateeUser({event, api: globalData.api, token: globalData.token, id: id, setLoadingSubmit})
            if(status){
                navigate(`/setting/user/update/${id}`)
            }
        }
    }

    async function setUp(){
        try {
            await setBreadcrumb()
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData(){
			try {
                setLoading(false);
                await setUp();
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
                <Setting event={{title: 'User', toolbar : Toolbar}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-12">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">User Form</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar"></div>
                                </div>
                                <div className="card-body p-9 pt-5">
                                    <form className="form w-100" id="user_form" onSubmit={onSubmit}>
                                        <div className='row'>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="user_name" className="form-label">Name</label>
                                                <input type="text" className="form-control" id="user_name" name="user_name" defaultValue={userData.user_name}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="user_username" className="form-label">Username</label>
                                                <input type="text" className="form-control" id="user_username" name="user_username" defaultValue={userData.user_username}/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="user_email" className="form-label">Email</label>
                                                <input type="email" className="form-control" id="user_email" name="user_email" defaultValue={userData.user_email}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="user_password" className="form-label">Password</label>
                                                <input type="password" className="form-control" id="user_password" name="user_password"/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="user_password_repeat" className="form-label">Password Repeat</label>
                                                <input type="password" className="form-control" id="user_password_repeat" name="user_password_repeat"/>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-md-12 mb-3" style={{textAlign: 'right'}}>
                                            <button 
                                                    type="submit" 
                                                    className={`btn btn-${BtnSubmit === 'Create' ? 'primary' : 'success'}`}
                                                    disabled={loadingSubmit}
                                                >
                                                    {loadingSubmit ? 'Submitting...' : BtnSubmit}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Setting>
            }
        </div>
    )
}

export default User