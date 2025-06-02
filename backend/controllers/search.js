import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) return res.status(400).json({ message: 'Query parameter is required.' });

  try {
    const result = await pool.query(
      `SELECT * FROM books 
       WHERE title ILIKE '%' || $1 || '%' 
          OR author ILIKE '%' || $1 || '%'
       ORDER BY created_at DESC`,
      [query]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error searching books.', error: err.message });
  }
});

export default router;
