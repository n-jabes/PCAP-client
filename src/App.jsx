import React, { useState } from 'react';
import PacketTable from './components/PacketTable';

function App() {
  const [selectedTab, setSelectedTab] = useState('Location Update');
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
    </div>
  );
}

export default App;
