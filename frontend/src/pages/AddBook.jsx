import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import './style.css'; 

const AddBook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/books', form);
      navigate('/books');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add book.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="author" placeholder="Author" onChange={handleChange} required />
        <input name="genre" placeholder="Genre" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
