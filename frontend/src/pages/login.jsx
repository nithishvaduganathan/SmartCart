import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(username, password);
      navigate(location.state?.from || '/dashboard');
    } catch (err) {
      const message = err.response?.data?.detail || 'Unable to sign in with those credentials.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-zinc-800"
      >
        <p className="text-sm uppercase tracking-wide text-emerald-300 text-center mb-3">
          Welcome back
        </p>
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login to SmartCart
        </h2>

        {location.state?.message && (
          <p className="bg-amber-500/10 text-amber-200 border border-amber-500/30 rounded-md p-3 mb-4">
            {location.state.message}
          </p>
        )}

        {error && (
          <p className="bg-red-500/10 text-red-200 border border-red-500/30 rounded-md p-3 mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-emerald-600 text-white p-3 rounded-md hover:bg-emerald-500 transition disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="text-sm text-center mt-4 text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-300 hover:text-emerald-200">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
