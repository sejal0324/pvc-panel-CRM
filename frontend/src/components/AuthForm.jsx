import React, { useState } from 'react';
import '../App.css';
import * as authServices from '../services/authServices';
import logo from '../assets/kalpvruksh.jpeg';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function AuthForm() {
  const [view, setView] = useState('login'); // 'login' or 'signup'
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUserName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const roles = [
    { id: 'admin', label: 'Admin', icon: '👤' },
    { id: 'warehouse', label: 'Warehouse', icon: '📦' },
    { id: 'investor', label: 'Investor', icon: '💰' }
  ];

  const toggleView = () => {
    setView(view === 'login' ? 'signup' : 'login');
    // Clear fields when switching
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUserName('');
    setRole('');
  };
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await authServices.login({ email, password, role });
      console.log(response);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate("/clientDashboard"), 1000);
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await authServices.signup({ username, email, password, role });
      console.log(response);
      setSuccess('Registration successful! You can now log in.');
      setView('login'); // Redirect to login page view
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data.message || 'Registration failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <span className="logo-icon">
              <img src={logo} alt="Kalpavruksh Logo" className="logo-img" />
            </span>
            <h1>KALPAVRUKSH <span>ERP + CRM SUITE</span></h1>
          </div>
          <p className="subtitle">WISDOM | ABUNDANCE | HARMONY</p>
        </div>

        <div className="login-body">
          {success && (
            <div className="success-message">
              <CheckCircle2 size={16} /> {success}
            </div>
          )}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {view === 'signup' && (
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. user@kalpavruksh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder={view === 'login' ? "Enter your security credentials" : "Create a strong password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {view === 'signup' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Access Role</label>
            <div className="role-selector">
              {roles.map((r) => (
                <div
                  key={r.id}
                  className={`role-box ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="login-button" onClick={view === 'login'
            ? handleLogin : handleSignUp}>
            {view === 'login' ? 'LOGIN' : 'REGISTER'}
          </button>

          <div className="view-switch">
            <p>
              {view === 'login' ? "New to the platform?" : "Already have an account?"}{' '}
              <span onClick={toggleView} className="switch-link">
                {view === 'login' ? 'Create a new account' : 'Sign in to your portal'}
              </span>
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2026 Kalpavruksh Unified Systems | B2B Operations Portal</p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
