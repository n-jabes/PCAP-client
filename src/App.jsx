import React from 'react';
import PacketTable from './components/PacketTable';
import PcapDisplay from './components/PcapDisplay';

function App() {
  return (
    <div className="App">
      <h1>PCAP Data Viewer</h1>
      <PacketTable />
      {/* <PcapDisplay/> */}
    </div>
  );
}

export default App;
