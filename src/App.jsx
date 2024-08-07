

import React, { useState } from 'react';
import axios from 'axios';
import PacketTable from './components/PacketTable';

function App() {
  const [selectedTab, setSelectedTab] = useState('Location Update');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadForm = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('Uploading...');
      const response = await axios.post(
        ' http://localhost:3000/api/upload-subscriber-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUploadStatus('File uploaded successfully!');
      // Optionally, you can refresh the data or update the UI here
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="h-[100vh] bg-[#f8f8f8] overflow-y-auto pb-2">
      {/* header section */}
      <header className="w-full bg-white border-b-2 border-gray-700">
        <button
          type="submit"
          className={`w-max text-sm px-6 py-2 font-medium border-l-[1px] border-gray-700 hover:bg-gray-700 hover:text-white ${
            selectedTab === 'Location Update'
              ? 'text-white bg-gray-700'
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedTab('Location Update')}
        >
          Location Update
        </button>
        <button
          type="submit"
          className={`w-max text-sm px-6 py-2 font-medium border-l-[1px] border-gray-700 hover:bg-gray-700 hover:text-white ${
            selectedTab === 'Call Setup'
              ? 'text-white bg-gray-700'
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedTab('Call Setup')}
        >
          Call Setup
        </button>
        <button
          type="submit"
          className={`w-max text-sm px-6 py-2 font-medium border-l-[1px] border-gray-700 hover:bg-gray-700 hover:text-white ${
            selectedTab === 'Other Voice'
              ? 'text-white bg-gray-700'
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedTab('Other Voice')}
        >
          Other Voice
        </button>
        <button
          type="button"
          className={`w-max text-sm px-6 py-2 font-medium border-l-[1px] border-gray-700 hover:bg-gray-700 hover:text-white ${
            selectedTab === 'Upload File'
              ? 'text-white bg-gray-700'
              : 'bg-white text-gray-700'
          }`}
          onClick={() => setSelectedTab('Upload File')}
        >
          Upload File
        </button>
      </header>

      {/* main content */}
      {selectedTab === 'Location Update' && <PacketTable />}
      {selectedTab === 'Call Setup' && (
        <div>
          <h1 className="text-2xl font-bold mb-3 p-2">Call Setup</h1>
        </div>
      )}
      {selectedTab === 'Other Voice' && (
        <div>
          <h1 className="text-2xl font-bold mb-3 p-2">Other Voice</h1>
        </div>
      )}
      {selectedTab === 'Upload File' && (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-3">Upload File</h1>
          <form onSubmit={handleUploadForm} className="space-y-4">
            <div>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-300 file:text-gray-700
                  hover:file:bg-gray-400 hover:file:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-max text-sm px-6 py-2 font-medium border-[1px] border-gray-700 hover:bg-gray-700 hover:text-white bg-white text-gray-700"
            >
              Upload File
            </button>
          </form>
          {uploadStatus && (
            <p className="mt-4 text-sm font-medium text-gray-700">
              {uploadStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
