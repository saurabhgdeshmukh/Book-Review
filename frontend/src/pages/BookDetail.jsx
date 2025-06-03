import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import { useParams } from 'react-router-dom';
import './style.css';

const BookDetail = () => {
  const { id } = useParams();
  const formRef = useRef();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState({ rating: '', comment: '' });
  const [currentUserId, setCurrentUserId] = useState(null);

  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/books/${id}`);
        setBook(res.data);
        console.log(res.data)
        setReviews(res.data.reviews);
      } catch (err) {
        console.error('Error fetching book details:', err);
      } finally {
        setLoadingBook(false);
      }
    };

    const getCurrentUser = async () => {
      try {
        const res = await API.get('/auth/me');
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error('Error fetching current user:', err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchDetails();
    getCurrentUser();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating < 1 || newReview.rating > 5) {
      return alert('Rating must be between 1 and 5');
    }

    setLoadingReview(true);
    try {
      await API.post(`/books/${id}/reviews`, newReview);
      const updated = await API.get(`/books/${id}`);
      setReviews(updated.data.reviews);
      setNewReview({ rating: '', comment: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoadingReview(false);
    }
  };

  const handleEditStart = (review) => {
    setEditingReviewId(review.id);
    setEditContent({ rating: review.rating, comment: review.comment });
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editContent.rating < 1 || editContent.rating > 5) {
      return alert('Rating must be between 1 and 5');
    }

    try {
      await API.put(`/reviews/${editingReviewId}`, editContent);
      const updated = await API.get(`/books/${id}`);
      setReviews(updated.data.reviews);
      setEditingReviewId(null);
    } catch (err) {
      alert('Failed to update review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loadingBook || loadingUser) return <div>Loading...</div>;
  if (!book) return <div>Book not found.</div>;

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
            <li key={r.id}>
              {editingReviewId === r.id ? (
                <form onSubmit={handleEditSubmit} ref={formRef}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editContent.rating}
                    onChange={e => setEditContent({ ...editContent, rating: e.target.value })}
                    required
                  />
                  <textarea
                    value={editContent.comment}
                    onChange={e => setEditContent({ ...editContent, comment: e.target.value })}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingReviewId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <strong>{r.rating}⭐</strong>: {r.comment}
                  {r.user_id === currentUserId && (
                    <>
                      <button onClick={() => handleEditStart(r)}>Edit</button>
                      <button onClick={() => handleDelete(r.id)}>Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
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
        <button type="submit" disabled={loadingReview}>Submit Review</button>
      </form>
    </div>
  );
};

export default BookDetail;
