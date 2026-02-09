import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaSearch, FaCalendar, FaUser, FaEye } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await postsAPI.getAll(params);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <h1>Latest Blog Posts</h1>
          <p>Discover amazing stories and insights from our community</p>
        </div>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts found. {searchTerm && 'Try a different search term.'}</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card card">
                {post.featuredImage && (
                  <div className="post-image">
                    <img src={post.featuredImage} alt={post.title} />
                  </div>
                )}
                
                <div className="post-content">
                  <div className="post-meta">
                    <span className={`badge badge-${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                  </div>
                  
                  <Link to={`/posts/${post.id}`}>
                    <h3 className="post-title">{post.title}</h3>
                  </Link>
                  
                  <p className="post-excerpt">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="post-tags">
                    {post.tags && post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-footer">
                    <div className="post-author">
                      <FaUser /> {post.authorUsername}
                    </div>
                    <div className="post-info">
                      <span><FaCalendar /> {formatDate(post.createdAt)}</span>
                      {post.viewCount > 0 && (
                        <span><FaEye /> {post.viewCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
