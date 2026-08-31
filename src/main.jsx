import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './app/queryClient';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
   
    <QueryClientProvider client={queryClient}>
        <Toaster
    position="top-right"
    toastOptions={{
      duration: 5000,
    }}
  />
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  
  </React.StrictMode>
);