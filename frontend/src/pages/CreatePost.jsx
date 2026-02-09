import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaSave, FaTimes } from 'react-icons/fa';
import './CreatePost.css';

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    categoryIds: [],
    tags: [],
    featuredImage: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getById(id);
      const post = response.data;
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status,
        categoryIds: post.categoryIds || [],
        tags: post.tags || [],
        featuredImage: post.featuredImage || '',
      });
    } catch (error) {
      toast.error('Failed to fetch post');
      navigate('/my-posts');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCategoryChange = (categoryId) => {
    const newCategoryIds = formData.categoryIds.includes(categoryId)
      ? formData.categoryIds.filter(id => id !== categoryId)
      : [...formData.categoryIds, categoryId];
    
    setFormData({ ...formData, categoryIds: newCategoryIds });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      if (isEditMode) {
        await postsAPI.update(id, formData);
        toast.success('Post updated successfully!');
      } else {
        await postsAPI.create(formData);
        toast.success('Post created successfully!');
      }
      navigate('/my-posts');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="container">
        <div className="create-post-header">
          <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form card">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter post title"
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">Excerpt</label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="form-control"
              placeholder="Brief description of your post"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-control"
              rows="12"
              placeholder="Write your post content here..."
            />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="featuredImage" className="form-label">Featured Image URL</label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                className="form-control"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Categories</label>
            <div className="category-checkboxes">
              {categories.map(category => (
                <label key={category.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tag-input-wrapper">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="form-control"
                placeholder="Add a tag and press Enter"
              />
              <button type="button" onClick={handleAddTag} className="btn btn-secondary">
                Add Tag
              </button>
            </div>
            <div className="tags-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag tag-removable">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/my-posts')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
