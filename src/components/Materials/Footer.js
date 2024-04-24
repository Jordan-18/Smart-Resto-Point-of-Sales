import React, { useState } from 'react';

function Footer(){
    const Year = new Date().getFullYear()
    return(
        <div id="kt_app_footer" className="app-footer">
            <div className="app-container container-xxl d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
                <div className="text-dark order-2 order-md-1">
                    <span className="text-muted fw-semibold me-1">{Year} &copy;</span>
                    <a className="text-gray-800 text-hover-primary" href='https://project.keifproject.com' target="_blank">
                        <strong>SR.POS</strong> by <u>Keifproject</u>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer