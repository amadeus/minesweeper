import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import DraggableWindowsProvider from '@/DraggableWindowsProvider';
import Minesweeper from '@/Minesweeper';

import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DraggableWindowsProvider>
      <Minesweeper />
    </DraggableWindowsProvider>
  </StrictMode>
);
