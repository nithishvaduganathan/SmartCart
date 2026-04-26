import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.detail || 'Registration failed');
        } finally { setSubmitting(false); }
    };

    return (
        <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
            <div style={{ display: 'flex', maxWidth: '750px', width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', minHeight: '520px' }}>
                {/* Left Blue Panel */}
                <div style={{
                    width: '280px', flexShrink: 0,
                    background: '#2874f0', padding: '40px 32px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    color: '#fff',
                }}>
                    <div>
                        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Looks like you're new here!</h2>
                        <p style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1.5, opacity: 0.9 }}>
                            Sign up with your details to get started.
                        </p>
                    </div>
                    <div style={{ opacity: 0.8, fontSize: '60px', textAlign: 'center' }}>🎉</div>
                </div>

                {/* Right White Form */}
                <div style={{ flex: 1, background: '#fff', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {error && (
                        <div style={{ background: '#fce4ec', color: '#c62828', padding: '10px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input
                            type="text" placeholder="Enter Username" value={username}
                            onChange={(e) => setUsername(e.target.value)} required
                            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '2px solid #e0e0e0', fontSize: '14px', color: '#212121', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderBottomColor = '#2874f0'}
                            onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                        />
                        <input
                            type="email" placeholder="Enter Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '2px solid #e0e0e0', fontSize: '14px', color: '#212121', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderBottomColor = '#2874f0'}
                            onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                        />
                        <input
                            type="password" placeholder="Enter Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} required
                            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '2px solid #e0e0e0', fontSize: '14px', color: '#212121', outline: 'none' }}
                            onFocus={(e) => e.target.style.borderBottomColor = '#2874f0'}
                            onBlur={(e) => e.target.style.borderBottomColor = '#e0e0e0'}
                        />

                        <p style={{ fontSize: '12px', color: '#878787' }}>
                            By continuing, you agree to SmartCart's <a href="#" style={{ color: '#2874f0' }}>Terms of Use</a> and <a href="#" style={{ color: '#2874f0' }}>Privacy Policy</a>.
                        </p>

                        <button type="submit" disabled={submitting} style={{
                            background: '#fb641b', color: '#fff', padding: '14px', border: 'none',
                            borderRadius: '3px', fontSize: '15px', fontWeight: 600,
                            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                            boxShadow: '0 1px 4px rgba(251,100,27,0.4)',
                        }}>
                            {submitting ? 'Creating account...' : 'CONTINUE'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Link to="/login" style={{ color: '#2874f0', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
                            Existing User? Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
