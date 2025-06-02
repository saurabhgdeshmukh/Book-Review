import express from 'express';
import pool from '../db/db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { title, author, genre, description } = req.body;
  if (!title || !author) return res.status(400).json({ message: 'Title and author required.' });

  try {
    const result = await pool.query(
      `INSERT INTO books (title, author, genre, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, author, genre, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error adding book.', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT * FROM books
       WHERE ($1::text IS NULL OR author ILIKE '%' || $1 || '%')
         AND ($2::text IS NULL OR genre ILIKE '%' || $2 || '%')
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [author || null, genre || null, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books.', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const bookRes = await pool.query(
      `SELECT b.*, COALESCE(AVG(r.rating), 0)::numeric(2,1) AS avg_rating
       FROM books b
       LEFT JOIN reviews r ON b.id = r.book_id
       WHERE b.id = $1
       GROUP BY b.id`,
      [bookId]
    );
    if (bookRes.rows.length === 0) return res.status(404).json({ message: 'Book not found' });

    const reviewsRes = await pool.query(
      `SELECT r.*, u.name AS reviewer
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.book_id = $1
       ORDER BY r.created_at DESC`,
      [bookId]
    );

    res.json({
      ...bookRes.rows[0],
      reviews: reviewsRes.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book.', error: err.message });
  }
});

export default router;
