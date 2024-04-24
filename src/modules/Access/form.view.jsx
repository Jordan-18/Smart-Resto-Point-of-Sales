import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Setting from '../Setting/index.view.jsx'
import { useNavigate, useParams } from 'react-router-dom';
import { getAccessbyId, createAccess, updateAccess } from './index.service.js'

function Access(){
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { globalData, setglobalData } = useContext(MyContext);
    const navigate = useNavigate()
    const { id } = useParams();
    const [Toolbar, setToolbar] = useState({})
    const [BtnSubmit, setBtnSubmit] = useState('')
    let [accessData, setaccessData] = useState({access_name : '',access_kode : ''})

    async function setBreadcrumb(){
        setToolbar({Access : '/setting/access', Add : '/setting/access/add'})
        setBtnSubmit('Create')
        if(id != undefined){
            setToolbar({Access : '/setting/access', Edit : `/setting/access/update/${id}`})
            setBtnSubmit('Update')

            const result = await getAccessbyId({api: globalData.api, token: globalData.token, id: id})
            setaccessData({
                access_name : result.access_name,
                access_kode : result.access_kode
            })
        }
    }

    async function onSubmit(event){
        setLoadingSubmit(true)
        if(BtnSubmit == 'Create'){
            const status = createAccess({event, api: globalData.api, token: globalData.token, setLoadingSubmit})
            if(status){
                navigate('/setting/access')
            }
        }else if(BtnSubmit == 'Update'){
            const status = updateAccess({event, api: globalData.api, token: globalData.token, id: id, setLoadingSubmit})
            if(status){
                navigate(`/setting/access/update/${id}`)
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
                await setUp()
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
                <Setting event={{title: 'Access', toolbar : Toolbar}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-12">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">Access Form</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar"></div>
                                </div>
                                <div className="card-body p-9 pt-5">
                                    <form className="form w-100" id="access_form" onSubmit={onSubmit}>
                                        <div className='row'>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="access_kode" className="form-label">Kode</label>
                                                <input type="text" className="form-control" id="access_kode" name="access_kode" defaultValue={accessData.access_kode}/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="access_name" className="form-label">Name</label>
                                                <input type="text" className="form-control" id="access_name" name="access_name" defaultValue={accessData.access_name}/>
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

export default Access