import { createRoot } from 'react-dom/client';
import { RootRouter } from './RootRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <RootRouter />
  </ErrorBoundary>
);
