import React from 'react';
import axios from 'axios';
import { formFormat } from '../../services/form.service';
import Swal from 'sweetalert2'

export async function getTag(api, token){
    try {
        const response = await axios.get(`${api}/tag`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                tag_id : value.tag_id,
                tag_name : value.tag_name
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

export async function getTagbyId(event){
    try {
        const response = await axios.get(`${event.api}/tag/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        
        let data = response.data.map(async (value, key) => {
            // const response = await axios.get(`${event.api}/tag/${value.dish_parent}`, {
            //     headers: {Authorization: `${event.token}`}
            // });
            return {
                tag_id : value.tag_id,
                tag_name : value.tag_name
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

export async function createTag(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('dish_form')
        const newData = {
            ...formData,
            description : event.description
        }
        const response = await axios.post(`${event.api}/tag`, newData, {
            headers: {
                Authorization: `${event.token}`,
            }
        })

        event.setLoadingSubmit(false)

        Swal.fire({
            title: 'Success!',
            text: response?.statusText,
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

export async function updateTag(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        const newData = {
            ...formData,
            description : event.description
        }
        await axios.put(`${event.api}/tag/${event.id}`, newData, {
            headers: {
                Authorization: `${event.token}`,
            }
        })

        event.setLoadingSubmit(false)
        
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

export async function deleteTag(event){
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
        if (confirmation.isConfirmed){
            await axios.delete(`${event.api}/tag/${event.id}`, {
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