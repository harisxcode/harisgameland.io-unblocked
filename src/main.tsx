import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initChromebookOptimizations } from './utils/chromebook';

initChromebookOptimizations();

createRoot(document.getElementById('root')!).render(<App />);
