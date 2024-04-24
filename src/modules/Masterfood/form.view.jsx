import React, { useState,useEffect,useContext}  from 'react';
import MyContext from '../../components/MyContext.js';
import Master from '../Master/index.view.jsx'
import { useNavigate,useParams } from 'react-router-dom';
import { getDish, getDishbyId, createDish, updateDish } from './index.service.js'
import { getTag } from '../Tag/index.service.js'
import Select from 'react-select';
import Editor from '../../components/Materials/Editor.js'
import FileUpload from '../../components/Materials/FileUpload.js'
  
function Masterfood(){
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const { globalData, setglobalData } = useContext(MyContext);
    const { id } = useParams();
    const [Toolbar, setToolbar] = useState({})
    const [BtnSubmit, setBtnSubmit] = useState('')
    const navigate = useNavigate()
    let [foodData, setfoodData] = useState({dish_name : '',dish_dishname : '',dish_email : ''})
    const [description, setDescription] = useState('');
    const [tagOption, settagOption] = useState([]);
    const [tagOptionSelected, settagOptionSelected] = useState([]);
    const [Status, setStatus] = useState([]);
    const [StatusSelected, setStatusSelected] = useState([]);
    
    async function setBreadcrumb(){
        setToolbar({Food : '/master/food', Add : '/master/food/add'})
        setBtnSubmit('Create')
        if(id != undefined){
            setToolbar({Food : '/master/food', Edit : `/master/food/update/${id}`})
            setBtnSubmit('Update')

            const result = await getDishbyId({api: globalData.api, token: globalData.token, id: id})
            setfoodData({
                dish_id : result.dish_id,
                dish_name : result.dish_name,
                dish_price : result.dish_price,
                dish_description : result.dish_description,
                dish_status : result.dish_status,
                dish_galleries : result.dish_galleries,
                tag_items : result.tag_items,
            })

            if(result.tag_items != null){
                setStatusSelected({
                    'value' : result.dish_status,
                    'label' : result.dish_status
                })
                settagOptionSelected(result.tag_items.map((value, key) => ({
                    'value' : value?.tag?.tag_id,
                    'label' : value?.tag?.tag_name?.toUpperCase()
                })))
            }
        }
    }

    async function onSubmit(event){
        setLoadingSubmit(true)
        if(BtnSubmit == 'Create'){
            const status = createDish({event, api: globalData.api, token: globalData.token, description: description, setLoadingSubmit})
            if(status){
                navigate('/master/food')
            }
        }else if(BtnSubmit == 'Update'){
            const status = updateDish({event, api: globalData.api, token: globalData.token, id: id, description: description, setLoadingSubmit})
            if(status){
                navigate(`/master/food/update/${id}`)
            }
        }
    }

    async function setOption(){
        const data = await getTag(globalData.api, globalData.token)
        const options = data.map((value, key) => ({
            'value' : value?.tag_id,
            'label' : value?.tag_name?.toUpperCase()
        }))
        settagOption(options)
        setStatus([
            {value : `ACTIVE`,label : 'ACTIVE'},
            {value : `NONACTIVE`,label : 'NON ACTIVE'},
        ])
    }
    async function setUp(){
        try {
            await setOption()
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
                <Master event={{title: 'Dish', toolbar : Toolbar}}>
                    <div className="row g-6 g-xl-9">
                        <div className="col-lg-12">
                            <div className="card card-flush h-lg-100">
                                <div className="card-header mt-6">
                                    <div className="card-title flex-column">
                                        <h3 className="fw-bold mb-1">Food Form</h3>
                                        <div className="fs-6 fw-semibold text-gray-400"></div>
                                    </div>
                                    <div className="card-toolbar"></div>
                                </div>
                                <div className="card-body p-9 pt-5">
                                    <form className="form w-100" id="dish_form" onSubmit={onSubmit}>
                                        <div className='row'>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="dish_name" className="form-label">Name</label>
                                                <input type="text" className="form-control" id="dish_name" name="dish_name" defaultValue={foodData.dish_name}/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="dish_price" className="form-label">Price</label>
                                                <input type="number" className="form-control" id="dish_price" name="dish_price" defaultValue={foodData.dish_price}/>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="dish_description" className="form-label">Description</label>
                                                <Editor 
                                                    className='dish_description' 
                                                    onChange={(data) => {setDescription(data)}}
                                                    event={{id: 'dish_description', className: 'dish_description'}}
                                                    value={foodData.dish_description}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="dish_status" className="form-label">Status</label>
                                                <Select
                                                    value={StatusSelected}
                                                    onChange={setStatusSelected}
                                                    options={Status}
                                                    name="dish_status" 
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="tag_items" className="form-label">Tag</label>
                                                <Select
                                                    isMulti
                                                    value={tagOptionSelected}
                                                    onChange={settagOptionSelected}
                                                    options={tagOption}
                                                    name="tag_items[]" 
                                                />
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="dish_galleries" className="form-label">Galleries</label>
                                                <FileUpload 
                                                    event={{id: 'dish_galleries', name: 'dish_galleries'}}
                                                    value={foodData.dish_galleries}
                                                />
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
                </Master>
            }
        </div>
    )
}

export default Masterfood