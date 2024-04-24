import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Master from '../Master/index.view.jsx'

import { AgGridReact } from 'ag-grid-react';
// import { useGridApi } from 'ag-grid-react/hooks';
import { setAccess } from '../../services/access.service.js';
import { NavLink } from 'react-router-dom';
import { getDish, deleteDish } from './index.service.js'

const actionButton = params => {
    const access = params.access
    const data = params.data

    const handleDelete = async (event) => {
        const status = await deleteDish({event,api: params.url,id: data.dish_id,token: params.token});
    
        if (status) {
            params.handleRefresh();
        }
    };

    return (
        <div className="btn-group">
            {access?.delete && <li className="btn btn-danger btn-sm mt-1" onClick={handleDelete}><i className="bi bi-trash-fill"></i></li>}
            {access?.update && <NavLink className="btn btn-info btn-sm mt-1" to={`/master/food/update/${data.dish_id}`}><i className="bi bi-pencil-square"></i></NavLink>}
        </div>
    )
}

function Masterfood(){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);
    const [rowData, setrowData] = useState([]);
    const [access, setaccess] = useState({})
    const [refreshTable, setrefreshTable] = useState(false);
    const columnDefs = [
        { headerName: 'No', field: 'dish_id', valueGetter: (params) => params.node.rowIndex + 1, width: 60 },
        { headerName: 'Name', field: 'dish_name', filter: true },
        { headerName: 'Price', field: 'dish_price', filter: true },
        { headerName: 'Description', field: 'dish_description', filter: true },
        { headerName: 'Status', field: 'dish_status', filter: true },
        { headerName: 'Galleries', field: 'dish_galleries', filter: true },
        { headerName: 'Tags', field: 'tag_items', filter: true },
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
            const data = await getDish(globalData.api, globalData.token)
            setrowData(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function setUp(){
        try {
            await getData() // get data Masterfood
            const Pathname = window.location.pathname.split('/')
            const findingRoute = (globalData.privateRoute).find(obj => obj.to === Pathname[1])
            const findingChildRoute = findingRoute.child.find(obj => obj.menu_kode === `master${Pathname[2]}`)
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
                <Master event={{title: 'Foods', toolbar : {Food : '/master/food'}}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-12">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">Dish Table</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar">
                                        {access?.create && <NavLink to="/master/food/add" className="btn btn-primary btn-sm"><i className="bi bi-plus-circle-dotted"></i></NavLink>}
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
                </Master>
            }
        </div>
    )
}

export default Masterfood