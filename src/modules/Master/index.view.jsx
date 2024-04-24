import React, { useState,useEffect,useContext, Suspense}  from 'react';
import MyContext from '../../components/MyContext.js';
import Content from '../../components/Content.js'
import { NavLink } from 'react-router-dom';

function Master({event, children}){
    const [loading, setLoading] = useState(true);
    const { globalData, setglobalData } = useContext(MyContext);
    const [routeChild , setrouteChild] = useState([])
    const [toolbar, settoolbar] = useState({})

    async function setBreadcrumb(){
        let toolbarDefault = {title: 'Master', toolbar : {Master : '/master'}}
        settoolbar(toolbarDefault)
        if(event){
            let toolSet = {...toolbarDefault.toolbar,...event.toolbar}
            settoolbar({title: event.title, toolbar : toolSet})
        }
    }
    async function subMenuRoute(){
        try {
            const Pathname = window.location.pathname.split('/')[1]
            const findingRoute = (globalData.privateRoute).find(obj => obj.to === Pathname)
            const setupRoute = findingRoute.child.map((value, key) => {
                return {
                    ...value,
                    component: React.lazy(() => import(`../${value.menu_name}/index.view.js`)),
                }
            })
            setrouteChild(setupRoute)
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    }
    useEffect(() => {
        async function fetchData(){
			try {
                setLoading(false);
                await setBreadcrumb()
                await subMenuRoute()
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
                <Content event={toolbar}>
                    <div className="card mb-6 mb-xl-9">
                        <div className="card-body pt-0 pb-0">
                            <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold">
                                {routeChild && Object.entries(routeChild).map(([key, value], index) => (
                                    <React.Fragment key={index}>
                                        <li className="nav-item" id="home-tab" data-bs-toggle="tab" data-bs-target={`#home-${index}`} type="button" role="tab" aria-controls="home">
                                            <NavLink  
                                                className="nav-link py-5 me-6"
                                                to={`/${value.menu_endpoint}`}
                                            >
                                                    {value.menu_name}
                                            </NavLink>
                                        </li>
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="tab-content">
                        {children}
                    </div>
                </Content>
            }
        </div>
    )
}

export default Master