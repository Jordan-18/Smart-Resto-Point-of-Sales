import React from 'react';
import axios from 'axios';
import { formFormat } from '../../services/form.service';
import Swal from 'sweetalert2'

export async function getMenu(api, token){
    try {
        const response = await axios.get(`${api}/menu`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                menu_id : value.menu_id,
                menu_kode : value.menu_kode,
                menu_name : value.menu_name,
                menu_icon : value.menu_icon,
                menu_endpoint : value.menu_endpoint
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

export async function getMenubyId(event){
    try {
        const response = await axios.get(`${event.api}/menu/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        
        let data = response.data.map(async (value, key) => {
            const response = await axios.get(`${event.api}/menu/${value.menu_parent}`, {
                headers: {Authorization: `${event.token}`}
            });
            return {
                menu_id : value.menu_id,
                menu_kode : value.menu_kode,
                menu_parent : value.menu_parent,
                menu_parent_name: response?.data[0] ? response?.data[0]?.menu_name : null,
                menu_name : value.menu_name,
                menu_icon : value.menu_icon,
                menu_endpoint : value.menu_endpoint
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

export async function createMenu(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        const response = await axios.post(`${event.api}/menu`, formData, {
            headers: {
                Authorization: `${event.token}`,
            }
        })
        event.setLoadingSubmit(false)
        Swal.fire({
            title: 'Success!',
            text: response.statusText,
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

export async function updateMenu(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        await axios.put(`${event.api}/menu/${event.id}`, formData, {
            headers: {
                Authorization: `${event.token}`,
            }
        })
        Swal.fire({
            title: 'Success!',
            text: 'Updated',
            icon: 'success',
        })

        event.setLoadingSubmit(false)

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

export async function deleteMenu(event){
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
            await axios.delete(`${event.api}/menu/${event.id}`, {
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