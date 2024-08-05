import React, { useState } from 'react';

function MapViewer(props) {
    const [showMap,setShowMap] = useState(false)
  return (
    <div>
      <div className="fixed top-0 left-0  bg-gray-200 h-screen w-screen overflow-y-auto z-40 overflow-x-auto flex items-center justify-center">
        <div className="relative bg-white w-[90%] h-[90vh]">
          <button
            className="close border-2 border-mainRed rounded-md px-2 text-mainRed absolute right-4 top-4"
            onClick={() => setShowMap(false)}
          >
            x
          </button>
          Display Map
        </div>
      </div>
    </div>
  );
}

export default MapViewer;
