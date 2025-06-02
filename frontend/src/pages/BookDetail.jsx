import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import './style.css'; 

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await API.get(`/books/${id}`);
      console.log(res.data)
      setBook(res.data);
      setReviews(res.data.reviews);
    };
    fetchDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/books/${id}/reviews`, newReview);
      const updated = await API.get(`/books/${id}`);
      setReviews(updated.data.reviews);
      setNewReview({ rating: '', comment: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-detail-container">
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p>{book.description}</p>
      <p><strong>Average Rating:</strong> {book.avg_rating || "Not rated yet"}</p>

      <h3>Reviews</h3>
      {reviews.length ? (
        <ul>
          {reviews.map((r) => (
            <li key={r.id}><strong>{r.rating}⭐</strong>: {r.comment}</li>
          ))}
        </ul>
      ) : <p>No reviews yet.</p>}

      <form onSubmit={handleReviewSubmit}>
        <h4>Submit a Review</h4>
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
          required
        />
        <textarea
          name="comment"
          placeholder="Comment"
          value={newReview.comment}
          onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default BookDetail;
