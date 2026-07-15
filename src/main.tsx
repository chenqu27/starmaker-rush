import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MultiMicRoomVisual from './components/MultiMicRoomVisual.tsx';
import './index.css';

const isMultiMicVisual = new URLSearchParams(window.location.search).get('screen') === 'multi-mic';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isMultiMicVisual ? <MultiMicRoomVisual /> : <App />}
  </StrictMode>,
);
