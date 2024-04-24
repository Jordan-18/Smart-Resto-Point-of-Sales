import React from 'react';
import axios from 'axios';
import { formFormat } from '../../services/form.service';
import Swal from 'sweetalert2'

export async function getDish(api, token){
    try {
        const response = await axios.get(`${api}/dish`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                dish_id : value.dish_id,
                dish_name : value.dish_name,
                dish_price : value.dish_price,
                dish_description : value.dish_description,
                dish_status : value.dish_status,
                dish_galleries : value.dish_galleries,
                tag_items : value.tag_items,
            }
        })

        return data
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
    }
}

export async function getDishbyId(event){
    try {
        const response = await axios.get(`${event.api}/dish/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        
        let data = response.data.map(async (value, key) => {
            // const response = await axios.get(`${event.api}/dish/${value.dish_parent}`, {
            //     headers: {Authorization: `${event.token}`}
            // });
            return {
                dish_id : value.dish_id,
                dish_name : value.dish_name,
                dish_price : value.dish_price,
                dish_description : value.dish_description,
                dish_status : value.dish_status,
                dish_galleries : value.dish_galleries,
                tag_items : value.tag_items,
            }
        })

        return data[0]
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
    }
}

export async function createDish(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('dish_form')
        const newData = {...formData,dish_description : event.description}
        delete newData.dish_galleries

        const response = await axios.post(`${event.api}/dish`, newData, {
            headers: {
                Authorization: `${event.token}`,
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            const dataGallery = new FormData();
            dataGallery.append('dish_gallery_dish', res.data.dish_id);
            formData.dish_galleries.forEach((gallery, index) => {
            dataGallery.append('dish_gallery_url', gallery);
            });
            await axios.post(`${event.api}/dish-gallery`, dataGallery, {
                headers: {
                    Authorization: `${event.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            event.setLoadingSubmit(false)
        })
        Swal.fire({
            title: 'Success!',
            text: response?.statusText,
            icon: 'success',
        })

        return true
    } catch (error){
        console.log(error);
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        return false
    }
}

export async function updateDish(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        const newData = {
            ...formData,
            description : event.description
        }
        delete newData.dish_galleries
        await axios.put(`${event.api}/dish/${event.id}`, newData, {
            headers: {
                Authorization: `${event.token}`,
            }
        }).then(async (res) => {
            const dataGallery = new FormData();
            dataGallery.append('dish_gallery_dish', res.data.dish_id);
            formData.dish_galleries.forEach((gallery, index) => {
            dataGallery.append('dish_gallery_url', gallery);
            });
            await axios.post(`${event.api}/dish-gallery`, dataGallery, {
                headers: {
                    Authorization: `${event.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            event.setLoadingSubmit(false)
        })
        Swal.fire({
            title: 'Success!',
            text: 'Updated',
            icon: 'success',
        })

        return true
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        return false
    }
}

export async function deleteDish(event){
    try {

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (confirmation.isConfirmed) {
            await axios.delete(`${event.api}/dish/${event.id}`, {
                headers: {
                    Authorization: `${event.token}`,
                }
            })
            Swal.fire({
                title: 'Success!',
                text: 'Deleted',
                icon: 'success',
            })
            return true
        }
        return false
    }catch(error){
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        return false
    }
}