import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './style.css'; 

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signin', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      navigate('/books');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
      <div className="signup-link">
        Don't have an account? <Link to="/">Sign up</Link>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Login;
