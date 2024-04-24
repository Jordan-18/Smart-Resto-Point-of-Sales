import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';

function Page400(){
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
                <div className="row g-5 g-xl-10">
                    <h1>400</h1>
                </div>
            }
        </div>
    )
}

export default Page400