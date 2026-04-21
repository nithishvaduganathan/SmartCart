import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        try {
            await register(form.username, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            const data = err.response?.data;
            setError(data?.error || data?.username?.[0] || 'Unable to create your account.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-zinc-800"
            >
                <p className="text-sm uppercase tracking-wide text-emerald-300 text-center mb-3">
                    Create account
                </p>
                <h2 className="text-3xl font-bold text-center text-white mb-6">
                    Join SmartCart
                </h2>

                {error && (
                    <p className="bg-red-500/10 text-red-200 border border-red-500/30 rounded-md p-3 mb-4">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.username}
                    onChange={(event) => updateField('username', event.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.password}
                    onChange={(event) => updateField('password', event.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-3 mb-4 bg-zinc-950 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={form.confirmPassword}
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-emerald-600 text-white p-3 rounded-md hover:bg-emerald-500 transition disabled:opacity-60"
                >
                    {submitting ? 'Creating account...' : 'Register'}
                </button>

                <p className="text-sm text-center mt-4 text-zinc-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-300 hover:text-emerald-200">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
