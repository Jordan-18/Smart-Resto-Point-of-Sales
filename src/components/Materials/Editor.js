import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Editor({ value, onChange, event }){
    const handleEditorChange = (editor) => {
        const data = editor.getData();
        onChange(data);
    };
    return(
        <div className="App">
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onChange={(event, editor) => handleEditorChange(editor)}
                className={event.className}
            />
        </div>
    )
}

export default Editor