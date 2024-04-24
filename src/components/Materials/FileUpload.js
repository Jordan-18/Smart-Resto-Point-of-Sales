import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ event, value }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (value && value.length > 0) {
      const newSelectedFiles = value.map(url => ({
        name : url.dish_gallery_url.substring(url.dish_gallery_url.lastIndexOf('/') + 1),
        url : url.dish_gallery_url
      }))
  
      setSelectedFiles(newSelectedFiles)
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = [...selectedFiles, ...acceptedFiles];
    setSelectedFiles(newFiles);
    updateFileInput(newFiles);
  }, [selectedFiles]);

  const updateFileInput = (files) => {
    const input = fileInputRef.current;
    if (input) {
      const fileList = new DataTransfer();
  
      files.forEach((file, index) => {
        // fileList.items.add(file);
        fileList.items.add(new File([file], file.name, { type: file.type }));
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

  const acceptedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedImageTypes,
  });

  return (
    <div style={styles.container}>
      <div {...getRootProps()} style={isDragActive ? styles.dropzoneActive : styles.dropzone}>
        <input type="file" className="form-control" multiple {...getInputProps({ multiple: true })} />
        {selectedFiles.length === 0 ? (
          <p>Drag 'n' drop some files here, or click to select files</p>
        ) : (
          <div style={styles.selectedFilesContainer}>
            {selectedFiles.map((file, index) => (
              <div key={index} style={styles.selectedFileContainer}>
                <img src={file.url ? file.url : URL.createObjectURL(file)} alt={file.name} style={styles.previewImage} />
                <button onClick={() => deleteFile(index)} style={styles.deleteButton}>
                  Delete
                </button>
                <p>{file.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <input
        id={`${event.name}`}
        type="file"
        className="form-control"
        name={`${event.name}[]`}
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  dropzone: {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    minHeight: '200px', // Set a minimum height for the dropzone
    position: 'relative',
  },
  dropzoneActive: {
    borderColor: '#2196F3',
  },
  selectedFilesContainer: {
    display: 'flex',
    marginTop: '10px',
    flexWrap: 'wrap', // Allows images to wrap onto the next line if needed
  },
  selectedFileContainer: {
    marginRight: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '4px',
    position: 'relative',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '100px',
    marginBottom: '5px',
  },
  deleteButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    padding: '5px',
    background: '#ff0000',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default FileUpload;
