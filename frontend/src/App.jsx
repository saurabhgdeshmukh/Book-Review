
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import BookList from './pages/BookList.jsx';
import AddBook from './pages/AddBook.jsx';
import BookDetail from './pages/BookDetail.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <BookList />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-book"
          element={
            <PrivateRoute>
              <AddBook />
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <PrivateRoute>
              <BookDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
