import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import './style.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

 const fetchBooks = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', 10);
    if (author) params.append('author', author);
    if (genre) params.append('genre', genre);

    const res = await API.get(`/books?${params.toString()}`);
    setBooks(res.data.data|| []);
    // console.log(res.data.data)
    // console.log(books)
    setTotalPages(res.data.totalPages || 1);
  } catch (err) {
    console.error('Failed to fetch books:', err);
    setBooks([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBooks();
  }, [page, author, genre]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchBooks();
  };

  return (
    <div className="book-list-container">
      <h2>All Books</h2>
      <Link to="/add-book">
        <button className="primary-button">Add New Book</button>
      </Link>

      <form onSubmit={handleFilter} className="filter-form">
        <input
          type="text"
          placeholder="Filter by Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button type="submit" className="primary-button">Apply Filters</button>
      </form>

      {loading ? (
        <p>Loading books...</p>
      ) : books.length > 0 ? (
        <>
          <ul className="book-list">
            {books.map((book) => (
              <li key={book.id} className="book-list-item">
                <Link to={`/books/${book.id}`}>
                  <strong>{book.title}</strong> by {book.author} ({book.genre})
                </Link>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default BookList;
