// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import ChatPanel from "./features/chat/components/ChatPanel";
import MapLayerButton from "./features/map/components/MapLayerButton";
import MapView from "./features/map/components/MapView";

function App() {
  return (
    <div className="absolute inset-0">
      <div className="fixed flex max-md:flex-col-reverse flex-row max-md:h-80 max-md:w-full md:left-4 bottom-4 md:top-4 rounded-lg z-50">
        <div className="flex flex-col grow max-md:w-full max-lg:w-80 w-96 bg-white shadow-lg">
          <ChatPanel />
        </div>
        <div className="max-md:py-4 px-4">
          <MapLayerButton active />
        </div>
      </div>
      <MapView />
    </div>
  );
}

export default App;
