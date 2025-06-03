// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import MapView from "./features/map/components/MapView";
import { MapLayerProvider } from "./features/map/contexts/MapLayerContext";
import ChatInput from "./features/chat/components/ChatInput";
import ChatPanel from "./features/chat/components/ChatPanel";
import { ChatProvider } from "./features/chat/contexts/ChatContext";
import { MapProvider } from "react-map-gl/mapbox-legacy";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <ChatProvider>
      <MapLayerProvider>
        <div className="relative overflow-clip">
          <MapProvider>
            <MapView />
          </MapProvider>
          <ChatInput />
          <ChatPanel />
        </div>
      </MapLayerProvider>
    </ChatProvider>
  );
}

export default App;
