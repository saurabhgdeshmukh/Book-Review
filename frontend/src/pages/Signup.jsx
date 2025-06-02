
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      setMessage('Signup successful. Please log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
      <button className="secondary-btn" onClick={() => navigate('/login')}>
        Already have an account? Log In
      </button>
    </div>
  );
};

export default Signup;
