import express from 'express';
import pool from '../db/db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/books/:id/reviews', authenticate, async (req, res) => {
  const { id: bookId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    const exists = await pool.query(
      `SELECT * FROM reviews WHERE user_id = $1 AND book_id = $2`,
      [userId, bookId]
    );
    if (exists.rows.length > 0) return res.status(400).json({ message: 'You already reviewed this book.' });

    const result = await pool.query(
      `INSERT INTO reviews (user_id, book_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, bookId, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error posting review.', error: err.message });
  }
});

router.put('/reviews/:id', authenticate, async (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    const check = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [reviewId]);
    if (check.rows.length === 0 || check.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You can only edit your own review.' });
    }

    const updated = await pool.query(
      `UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3 RETURNING *`,
      [rating, comment, reviewId]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating review.', error: err.message });
  }
});

router.delete('/reviews/:id', authenticate, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.userId;

  try {
    const check = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [reviewId]);
    if (check.rows.length === 0 || check.rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own review.' });
    }

    await pool.query(`DELETE FROM reviews WHERE id = $1`, [reviewId]);
    res.json({ message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review.', error: err.message });
  }
});

export default router;
