import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCalendar, FaUser, FaArrowLeft } from 'react-icons/fa';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      setPost(response.data);
    } catch (error) {
      toast.error('Failed to fetch post');
    } finally {
      setLoading(false);
    }
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
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Post not found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="container">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Posts
        </Link>

        <article className="post-detail card">
          {post.featuredImage && (
            <div className="post-detail-image">
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          <div className="post-detail-header">
            <div className="post-detail-meta">
              <span className={`badge badge-${post.status.toLowerCase()}`}>
                {post.status}
              </span>
            </div>

            <h1 className="post-detail-title">{post.title}</h1>

            {post.excerpt && (
              <p className="post-detail-excerpt">{post.excerpt}</p>
            )}

            <div className="post-detail-info">
              <span className="post-author">
                <FaUser /> {post.authorUsername}
              </span>
              <span className="post-date">
                <FaCalendar /> {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="post-detail-tags">
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="post-detail-content">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
