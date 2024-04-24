import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
// import ReactApexChart from 'react-apexcharts';
import Content from '../../components/Content.js'

function Dashboard(){
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
                <Content event={{title: 'Dashboard', toolbar : {Dashboard : '/'}}}>
                    <h1>Dashboard</h1>
                </Content>
            }
        </div>
    )
}

export default Dashboard