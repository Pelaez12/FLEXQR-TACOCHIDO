import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import TableLinksPage from './pages/TableLinksPage';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { readOrderRoute } from './lib/order-route';

const path = window.location.pathname.replace(/\/$/, '') || '/';
const content = ['/mesas.html', '/mesas', '/generadordequerys', '/generadordequerys/index.html'].includes(path) ? <TableLinksPage />
  : ['/error', '/error.html', '/500', '/500.html'].includes(path) ? <ErrorPage code={500} />
  : !['/', '/index.html'].includes(path) ? <ErrorPage code={404} />
  : readOrderRoute(window.location.search).error ? <ErrorPage code={400} /> : <App />;
createRoot(document.getElementById('root')!).render(<React.StrictMode><AppErrorBoundary>{content}</AppErrorBoundary></React.StrictMode>);
