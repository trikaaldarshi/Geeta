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
    // Simple hardcoded auth for demonstration
    if (username === 'admin' && password === 'password') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">HR / Admin Login</h2>
          <p className="text-stone-500 mt-2">Enter your credentials to publish shlokas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="admin"
              />
              <User size={18} className="absolute left-3 top-3.5 text-stone-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="••••••••"
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-stone-400" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-stone-500 text-sm hover:text-stone-800"
          >
            Cancel and Return Home
          </button>
        </form>
      </div>
    </div>
  );
};
