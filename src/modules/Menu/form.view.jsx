import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Setting from '../Setting/index.view.jsx'
import { useNavigate,useParams } from 'react-router-dom';
import { getMenu, getMenubyId, createMenu, updateMenu } from './index.service.js'
import Select from 'react-select';

function User(){
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { globalData, setglobalData } = useContext(MyContext);
    const { id } = useParams();
    const [Toolbar, setToolbar] = useState({})
    const [BtnSubmit, setBtnSubmit] = useState('')
    const [Parent, setParent] = useState([])
    const [ParentSelected, setParentSelected] = useState(null);
    const navigate = useNavigate()
    let [menuData, setmenuData] = useState({user_name : '',user_username : '',user_email : ''})
    
    async function setBreadcrumb(){
        setToolbar({User : '/setting/user', Add : '/setting/user/add'})
        setBtnSubmit('Create')
        if(id != undefined){
            setToolbar({user : '/setting/user', Edit : `/setting/user/update/${id}`})
            setBtnSubmit('Update')

            const result = await getMenubyId({api: globalData.api, token: globalData.token, id: id})
            setmenuData({
                menu_id : result.menu_id,
                menu_kode : result.menu_kode,
                menu_name : result.menu_name,
                menu_icon : result.menu_icon,
                menu_endpoint : result.menu_endpoint
            })
            if(result.menu_parent != null){
                setParentSelected({value: result.menu_parent, label: result?.menu_parent_name ? result?.menu_parent_name?.toUpperCase() : ''})
            }
        }
    }

    async function onSubmit(event){
        setLoadingSubmit(true)
        if(BtnSubmit == 'Create'){
            const status = createMenu({event, api: globalData.api, token: globalData.token, setLoadingSubmit})
            if(status){
                navigate('/setting/menu')
            }
        }else if(BtnSubmit == 'Update'){
            const status = updateMenu({event, api: globalData.api, token: globalData.token, id: id, setLoadingSubmit})
            if(status){
                navigate(`/setting/menu/update/${id}`)
            }
        }
    }

    async function getParent(){
        const data = await getMenu(globalData.api, globalData.token)
        const options = data.map((value, key) => ({
            'value' : value.menu_id,
            'label' : value.menu_name.toUpperCase()
        }))
        setParent(options)
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
                await getParent()
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
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="menu_parent" className="form-label">Parent</label>
                                                <Select
                                                    value={ParentSelected}
                                                    onChange={setParentSelected}
                                                    options={Parent}
                                                    name="menu_parent" 
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="menu_kode" className="form-label">Kode</label>
                                                <input type="text" className="form-control" id="menu_kode" name="menu_kode" defaultValue={menuData.menu_kode}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="menu_name" className="form-label">Name</label>
                                                <input type="text" className="form-control" id="menu_name" name="menu_name" defaultValue={menuData.menu_name}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="menu_icon" className="form-label">Icon</label>
                                                <input type="text" className="form-control" id="menu_icon" name="menu_icon" defaultValue={menuData.menu_icon}/>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="menu_endpoint" className="form-label">Endpoint</label>
                                                <input type="text" className="form-control" id="menu_endpoint" name="menu_endpoint" defaultValue={menuData.menu_endpoint}/>
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