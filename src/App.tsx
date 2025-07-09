// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import ChatPanel from "./features/chat/components/ChatPanel";
import { ChatProvider } from "./features/chat/contexts/ChatContext";
import MapView from "./features/map/components/MapView";
import { MapLayerProvider } from "./features/map/contexts/MapLayerContext";
import { MapProvider } from "react-map-gl/mapbox-legacy";

function App() {
  return (
    <MapLayerProvider>
      <div className="relative overflow-clip">
        <MapProvider>
          <MapView />
        </MapProvider>
        <ChatProvider>
          <ChatPanel />
        </ChatProvider>
      </div>
    </MapLayerProvider>
  );
}

export default App;
