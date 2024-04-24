import React from 'react';
import {formFormat} from '../../services/form.service.js'
import Swal from 'sweetalert2'

export function onRegister(event){
    event.event.preventDefault();
    try {
        const formData = formFormat('sign_up_form')

        event.setglobalData((prevGlobalData) => ({
            ...prevGlobalData,
            ...formData,
        }))
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        console.error('Error Register:', error);
        return {
            'success' : false,
            'msg' : error
        }
    }
}