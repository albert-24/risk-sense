// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import ChatPanel from "./features/chat/components/ChatPanel";
import MapView from "./features/map/components/MapView";

function App() {
  return (
    <div className="relative overflow-clip">
      <MapView />
      <ChatPanel />
    </div>
  );
}

export default App;
