import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaFolder } from 'react-icons/fa';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="container">
        <div className="categories-header">
          <h1>Categories</h1>
          <p>Browse posts by category</p>
        </div>

        {categories.length === 0 ? (
          <div className="no-categories card">
            <p>No categories available yet.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/?categoryId=${category.id}`}
                className="category-card card"
              >
                <div className="category-icon">
                  <FaFolder />
                </div>
                <h3 className="category-name">{category.name}</h3>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
