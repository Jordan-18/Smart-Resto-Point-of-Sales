import React from 'react';
import {formFormat} from '../../services/form.service.js'
import { setSession } from '../../services/session.service.js';
import axios from 'axios';
import Swal from 'sweetalert2'

export async function onLogin(event) {
    (event.event).preventDefault();
    try {
        const formData = formFormat('sign_in_form')
        const response = await axios.post(event.globalData.api+'/login', formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.status == 200){
            event.setglobalData((prevGlobalData) => ({
                ...prevGlobalData,
                token : response.data.token,
            }))
            setSession('token', response.data.token);
            event.setIsAuthenticated(true);
            Swal.fire({
                title: 'Success!',
                text: response.data.msg,
                icon: 'success',
            })
            return
        }

        console.log(response);
    } catch (error) {
        
        Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.msg,
            icon: 'error',
        })
        console.error('Error login:', error);
        return {
            'success' : false,
            'msg' : error
        }
    }
}