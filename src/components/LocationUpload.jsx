import React, { useState } from 'react';
import axios from 'axios';

const LocationUpload = ({ onKmlIdUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://pcap-backend.onrender.com/api/upload-locations',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onKmlIdUpdate(response.data.kmlId);
      alert('Locations file uploaded and processed successfully');
    } catch (error) {
      console.error('Error uploading locations file:', error);
      setError('Error uploading locations file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-4">
      <h3 className="w-full font-bold">Upload Locations File</h3>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={handleFileChange}
        className="text-sm py-2 px-4 outline-none bg-white-100 border-[1px] border-gray-200 rounded"
      />
      <button
        onClick={handleUpload}
        className="ml-2 bg-gray-500 hover:bg-gray-700 text-sm text-white font-thin py-2 px-6 rounded"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LocationUpload;
