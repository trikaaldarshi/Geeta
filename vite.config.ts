import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' ensures we load all env vars, not just VITE_*
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // 1. Expose the API_KEY to the client bundle
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || ''),
      
      // 2. Prevent "ReferenceError: process is not defined" by defining it as an empty object
      'process.env': {},
    },
    server: {
      host: '0.0.0.0',
    }
  };
});