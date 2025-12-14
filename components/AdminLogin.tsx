import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default Credentials for Admin Access
    // In a production environment, this should be replaced with a real backend authentication service.
    if (username === 'admin' && password === 'Gita@108') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 max-w-md w-full transition-colors duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-500">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-100">Secure Access</h2>
          <p className="text-stone-500 dark:text-stone-400 mt-2">Enter your credentials to proceed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <User size={18} className="absolute left-3 top-3.5 text-stone-400 dark:text-stone-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-stone-400 dark:text-stone-500" />
            </div>
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-stone-900 dark:bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-stone-800 dark:hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
          >
            Authenticate <ArrowRight size={18} />
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-stone-500 dark:text-stone-400 text-sm hover:text-stone-800 dark:hover:text-stone-200"
          >
            Return to Home
          </button>
        </form>
      </div>
    </div>
  );
};