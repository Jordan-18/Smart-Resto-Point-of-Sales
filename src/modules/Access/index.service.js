import React from 'react';
import axios from 'axios';
import { formFormat } from '../../services/form.service';
import Swal from 'sweetalert2'

export async function getAccess(api, token){
    try {
        const response = await axios.get(`${api}/access`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                access_id : value.access_id,
                access_kode : value.access_kode,
                access_name : value.access_name,
                created_at : new Date(value.created_at).toLocaleString(),
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

export async function getAccessbyId(event){
    try {
        const response = await axios.get(`${event.api}/access/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                access_id : value.access_id,
                access_kode : value.access_kode,
                access_name : value.access_name,
                created_at : new Date(value.created_at).toLocaleString(),
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

export async function createAccess(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('access_form')
        const response = await axios.post(`${event.api}/access`, formData, {
            headers: {
                Authorization: `${event.token}`,
            }
        })
        Swal.fire({
            title: 'Success!',
            text: response.statusText,
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

export async function updateAccess(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('access_form')
        await axios.put(`${event.api}/access/${event.id}`, formData, {
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

export async function deleteAccess(event){
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
            await axios.delete(`${event.api}/Access/${event.id}`, {
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

export async function getAccessMenu(event){
    try {
        const response = await axios.get(`${event.api}/accessmenu/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        return response
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
    }
}

export async function updateAccessMenu(event){
    try {

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will change this role',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Update it!'
        });
        if (confirmation.isConfirmed){
            const response = await axios.put(`${event.api}/menuaccess/${event.id}`, {data: event.data}, {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `${event.token}`,
                }
            });
            Swal.fire({
                title: 'Success!',
                text: 'Updated',
                icon: 'success',
            })
            return response
        }
        return false
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        return false
    }
}