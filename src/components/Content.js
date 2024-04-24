import React, { useState } from 'react';
import Toolbar from './Materials/Toolbar.js'

function Content({event, children}){
    return(
        <>
            <Toolbar event={{
                title: event.title,
                breadcrumb : event.toolbar
            }}/>
            <div id="kt_app_content" className="app-content flex-column-fluid">
                <div id="kt_app_content_container" className="app-container container-xxl">
                    {children}
                </div>
            </div>
        </>
    )
}

export default Content