import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ event, value }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    updateFileInput(newFiles);
  }, [selectedFiles])
  const updateFileInput = (files) => {
      const input = fileInputRef.current;
      if (input) {
        const fileList = new DataTransfer();
    
        files.forEach((file, index) => {
          fileList.items.add(file);
        });
    
        input.files = fileList.files;
      }
  };
  const deleteFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    updateFileInput(updatedFiles);
  };
  return (
    <input 
      id={`${event.name}`}
      type="file" 
      className="form-control" 
      multiple 
      name={`${event.name}[]`}
    />
  )
}

export default FileUpload;