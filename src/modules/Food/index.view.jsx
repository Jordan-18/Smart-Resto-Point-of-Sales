import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Setting from '../Setting/index.view.jsx'
import { AgGridReact } from 'ag-grid-react';
// import { useGridApi } from 'ag-grid-react/hooks';
import { setAccess } from '../../services/access.service.js';
import { NavLink } from 'react-router-dom';
import { getUser, deleteUser } from './index.service.js'

const actionButton = params => {
    const access = params.access
    const data = params.data

    const handleDelete = async (event) => {
        const status = await deleteUser({event,api: params.url,id: data.user_id,token: params.token});
    
        if (status) {
            params.handleRefresh();
        }
    };

    return (
        <div className="btn-group">
            {access?.delete && <li className="btn btn-danger btn-sm mt-1" onClick={handleDelete}><i className="bi bi-trash-fill"></i></li>}
            {access?.update && <NavLink className="btn btn-info btn-sm mt-1" to={`/setting/user/update/${data.user_id}`}><i className="bi bi-pencil-square"></i></NavLink>}
        </div>
    )
}

function Food(){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);
    const [rowData, setrowData] = useState([]);
    const [access, setaccess] = useState({})
    const [refreshTable, setrefreshTable] = useState(false);
    const columnDefs = [
        { headerName: 'No', field: 'user_id', valueGetter: (params) => params.node.rowIndex + 1, width: 60 },
        { headerName: 'Name', field: 'user_name', filter: true },
        { headerName: 'username', field: 'user_username', filter: true },
        { headerName: 'Email', field: 'user_email', filter: true },
        { headerName: 'Join', field: 'created_at', filter: true },
        { headerName: 'Action', field: 'action', 
            cellRenderer: actionButton,
            cellRendererParams: {access, url: globalData.api, token: globalData.token, handleRefresh}
        },
    ];
    
    async function handleRefresh(){
        setrefreshTable((prevRefresh) => !prevRefresh);
    };
    async function getData(){
        try {
            const data = await getUser(globalData.api, globalData.token)
            setrowData(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function setUp(){
        try {
            await getData() // get data user
            const Pathname = window.location.pathname.split('/')
            const findingRoute = (globalData.privateRoute).find(obj => obj.to === Pathname[1])
            const findingChildRoute = findingRoute.child.find(obj => obj.menu_kode === Pathname[2])
            const access = setAccess(findingChildRoute);
            setaccess(access)
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
    }, [globalData,refreshTable]);

    return(
        <div>
            {loading ? (
                <div className="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6">
                </div>
            ) : 
                <Setting event={{title: 'User', toolbar : {User : '/setting/user'}}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-12">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">User Table</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar">
                                        {access?.create && <NavLink to="/setting/user/add" className="btn btn-primary btn-sm"><i className="bi bi-plus-circle-dotted"></i></NavLink>}
                                        {/* <button className="btn btn-primary btn-sm" onClick={handleRefresh}>Refresh</button> */}
                                    </div>
                                </div>
                                <div className="card-body p-9 pt-5">
                                    <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
                                        {access?.read && <AgGridReact
                                            columnDefs={columnDefs}
                                            rowData={rowData}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Setting>
            }
        </div>
    )
}

export default Food