'use client';
import React, { useState } from 'react';
import { login, register } from '@/services/apiService';
import { useUserStore } from '@/state/userStore';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const action = isRegisterView ? register : login;
      const { success, user, error } = isRegisterView
        ? await register(email, password, displayName)
        : await login(email, password);

      if (success && user) {
        setUser(user);
        router.push('/exam/01');
      } else {
        setError(error || (isRegisterView ? 'Registration failed' : 'Login failed'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">{isRegisterView ? 'Register' : 'Login'}</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
              required
            />
          </div>
          {isRegisterView && (
            <div>
              <label className="block text-sm font-medium">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegisterView ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsRegisterView(!isRegisterView)}
            className="text-sm text-blue-600 hover:underline"
          >
            {isRegisterView ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
