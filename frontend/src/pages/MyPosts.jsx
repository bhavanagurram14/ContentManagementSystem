import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll();
      // Filter posts by current user
      const myPosts = response.data.filter(post => post.authorId === user.id);
      setPosts(myPosts);
    } catch (error) {
      toast.error('Failed to fetch your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        toast.success('Post deleted successfully');
        fetchMyPosts();
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div className="my-posts-container">
      <div className="container">
        <div className="my-posts-header">
          <h1>My Posts</h1>
          <Link to="/create-post" className="btn btn-primary">
            <FaPlus /> New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="no-posts card">
            <p>You haven't created any posts yet.</p>
            <Link to="/create-post" className="btn btn-primary">
              <FaPlus /> Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="posts-table-wrapper">
            <table className="posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="post-title-cell">
                        <Link to={`/posts/${post.id}`} className="post-link">
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="post-excerpt-small">{post.excerpt.substring(0, 60)}...</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${post.status.toLowerCase()}`}>
                        {post.status}
                      </span>
                    </td>
                    <td>{formatDate(post.createdAt)}</td>
                    <td>{post.viewCount || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/posts/${post.id}`}
                          className="btn-icon"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="btn-icon"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="btn-icon btn-icon-danger"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
