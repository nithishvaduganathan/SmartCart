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
            navigate(location.state?.from || '/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid username or password');
        } finally { setSubmitting(false); }
    };

    return (
        <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
            <div className="auth-card-layout">
                {/* Left Blue Panel */}
                <div className="auth-left-panel" style={{
                    background: '#2874f0', padding: '40px 32px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    color: '#fff',
                }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Login</h2>
                        <p style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1.5, opacity: 0.9 }}>
                            Get access to your Orders, Wishlist and Recommendations.
                        </p>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '60px', textAlign: 'center' }}>🛒</div>
                </div>

                {/* Right White Form */}
                <div style={{ flex: 1, background: '#fff', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {location.state?.message && (
                        <div style={{ background: '#fff3cd', color: '#856404', padding: '10px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                            {location.state.message}
                        </div>
                    )}

                    {error && (
                        <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '10px 0', border: 'none',
                                    borderBottom: '2px solid #e0e0e0', fontSize: '14px',
                                    color: '#212121', outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#2874f0'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '10px 0', border: 'none',
                                    borderBottom: '2px solid #e0e0e0', fontSize: '14px',
                                    color: '#212121', outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderBottomColor = '#2874f0'}
                                onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                            />
                        </div>

                        <p style={{ fontSize: '12px', color: '#878787' }}>
                            By continuing, you agree to SmartCart's <a href="#" style={{ color: '#2874f0' }}>Terms of Use</a> and <a href="#" style={{ color: '#2874f0' }}>Privacy Policy</a>.
                        </p>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                background: '#fb641b', color: '#fff', padding: '14px',
                                border: 'none', borderRadius: '3px', fontSize: '15px', fontWeight: 600,
                                cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                                boxShadow: '0 1px 4px rgba(251,100,27,0.4)',
                            }}
                        >
                            {submitting ? 'Signing in...' : 'Login'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#878787' }}>OR</span>
                        </div>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Link to="/register" style={{
                            color: '#2874f0', fontSize: '14px', fontWeight: 500,
                            textDecoration: 'none',
                        }}>
                            New to SmartCart? Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
