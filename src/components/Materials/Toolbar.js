import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Toolbar({event}){
    return(
        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-0">
            <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                <div className="page-title d-flex flex-column justify-content-center me-3">
                    <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">{event?.title}</h1>
                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                    {event?.breadcrumb &&
                        Object.entries(event.breadcrumb).map(([key, value], index) => (
                            <React.Fragment key={index}>
                                <li className="breadcrumb-item text-muted">
                                    <NavLink to={value} className="text-muted text-hover-primary">
                                        {key}
                                    </NavLink>
                                </li>

                                {index !== Object.entries(event.breadcrumb).length - 1 && (
                                    <li className="breadcrumb-item">
                                        <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                    </li>
                                )}
                            </React.Fragment>
                        ))
                    }
                    </ul>
                </div>
                {event?.create && (
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                        <a href="#" className="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_create_app">Create</a>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Toolbar