import React from 'react';
import axios from 'axios';
import { formFormat } from '../../services/form.service';
import Swal from 'sweetalert2'

export async function getUser(api, token){
    try {
        const response = await axios.get(`${api}/user`, {
            headers: {
                Authorization: `${token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                user_id : value.user_id,
                user_name : value.user_name,
                user_username : value.user_username,
                user_email : value.user_email,
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

export async function getUserbyId(event){
    try {
        const response = await axios.get(`${event.api}/user/${event.id}`, {
            headers: {
                Authorization: `${event.token}`,
            }
        });
        let data = response.data.map((value, key) => {
            return {
                user_id : value.user_id,
                user_name : value.user_name,
                user_username : value.user_username,
                user_email : value.user_email,
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

export async function createUser(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        const response = await axios.post(`${event.api}/user`, formData, {
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

export async function updateeUser(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('user_form')
        await axios.put(`${event.api}/user/${event.id}`, formData, {
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

export async function deleteUser(event){
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
            await axios.delete(`${event.api}/user/${event.id}`, {
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