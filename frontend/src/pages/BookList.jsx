
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import './style.css'; 

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get('/books');
        console.log('API Response:', res.data);
        const booksData = res.data || [];
        setBooks(booksData);
      } catch (err) {
        console.error('Failed to fetch books:', err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="book-list-container">
      <h2>All Books</h2>

      <Link to="/add-book">
        <button className="primary-button">Add New Book</button>
      </Link>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-list-item">
              <Link to={`/books/${book.id}`}>
                <strong>{book.title}</strong> by {book.author} ({book.genre})
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default BookList;
