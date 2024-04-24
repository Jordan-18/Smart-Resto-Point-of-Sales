import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Setting from '../Setting/index.view.jsx'
import { AgGridReact } from 'ag-grid-react';
import { setAccess } from '../../services/access.service.js';
import { NavLink } from 'react-router-dom';
import { getAccess, deleteAccess, getAccessMenu, updateAccessMenu } from './index.service.js';
import "rc-tree/assets/index.css"
import Tree from 'rc-tree';
import jwt from 'jsonwebtoken';

const actionButton = params => {
    const access = params.access
    const data = params.data
    const handleDelete = async (event) => {
        const status = await deleteAccess({event,api: params.url,id: data.access_id,token: params.token});
    
        if (status) {
            params.handleRefresh();
        }
    };

    const handleTree = async (event) => {
        const response = await getAccessMenu({event,api: params.url,id: data.access_id,token: params.token})
        params.setuptree(response.data)
        params.setSelectedKeys(data.access_id)
    }

    return (
        <div className="btn-group">
            <li className="btn btn-primary btn-sm mt-1" onClick={handleTree}><i className="bi bi-signpost-2-fill"></i></li>
            {access?.delete && <li className="btn btn-danger btn-sm mt-1" onClick={handleDelete}><i className="bi bi-trash-fill"></i></li>}
            {access?.update && <NavLink className="btn btn-info btn-sm mt-1" to={`/setting/access/update/${data.access_id}`}><i className="bi bi-pencil-square"></i></NavLink>}
        </div>
    )
}

function Access(){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);
    const [rowData, setrowData] = useState([]);
    const [access, setaccess] = useState({})
    const [refreshTable, setrefreshTable] = useState(false);
    const [treeData , settreeData] = useState([])
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const columnDefs = [
        { headerName: 'No', field: 'access_id', valueGetter: (params) => params.node.rowIndex + 1, width: 60 },
        { headerName: 'Kode', field: 'access_kode', filter: true , width: 120},
        { headerName: 'Name', field: 'access_name', filter: true , width: 120},
        { headerName: 'Action', field: 'action', 
            cellRenderer: actionButton,
            cellRendererParams: {
                access, 
                url: globalData.api, 
                token: globalData.token, 
                handleRefresh, 
                setuptree, 
                setSelectedKeys
            }
        },
    ];

    async function handleRefresh(){
        setrefreshTable((prevRefresh) => !prevRefresh);
    };

    async function getData(){
        try {
            const data = await getAccess(globalData.api, globalData.token)
            setrowData(data);
        } catch (error) {
            console.log(error);
        }
    }

    async function setUp(){
        try {
            await getData() // get data Access
            const Pathname = window.location.pathname.split('/')
            const findingRoute = (globalData.privateRoute).find(obj => obj.to === Pathname[1])
            const findingChildRoute = findingRoute.child.find(obj => obj.menu_kode === Pathname[2])
            const access = setAccess(findingChildRoute);
            setaccess(access)
        } catch (error) {
            console.log(error);
        }
    }

    async function setuptree(response){
        const {activeId, dataTree} = response
        settreeData(dataTree)
        setCheckedKeys(activeId)
    }

    async function updateaccessMenu(event){
        const response = await updateAccessMenu({event,api: globalData.api,id: selectedKeys,token: globalData.token,data: checkedKeys})
        if (response && selectedKeys == jwt.decode(globalData.token)?.access) {
            window.location.reload();
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
    }, [globalData,refreshTable]);

    return(
        <div>
            {loading ? (
                <div className="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6">
                </div>
            ) : 
                <Setting event={{title: 'Access', toolbar : {Access : '/access'}}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-7">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">Access Table</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar">
                                        {access?.create && <NavLink to="/setting/access/add" className="btn btn-primary btn-sm"><i className="bi bi-plus-circle-dotted"></i></NavLink>}
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
                        <div className="col-lg-5">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">Access Tree</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar">
                                        {access?.update && <button className="btn btn-info btn-sm" onClick={updateaccessMenu}>Update</button>}
                                    </div>
                                </div>
                                <div className="card-body p-9 pt-5">
                                    <Tree
                                        className="myCls"
                                        treeData={treeData}
                                        checkedKeys={checkedKeys}
                                        checkable
                                        defaultExpandAll
                                        showLine
                                        height={800}
                                        onCheck={(keys) => setCheckedKeys(keys)} 
                                    />
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