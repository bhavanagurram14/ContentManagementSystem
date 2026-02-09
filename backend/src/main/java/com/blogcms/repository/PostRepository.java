package com.blogcms.repository;

import com.blogcms.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Optional<Post> findBySlug(String slug);
    
    Boolean existsBySlug(String slug);
    
    List<Post> findByStatus(Post.PostStatus status);
    
    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    
    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' ORDER BY p.publishedAt DESC")
    List<Post> findAllPublishedPosts();
    
    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY p.publishedAt DESC")
    List<Post> searchPublishedPosts(@Param("search") String search);
    
    @Query("SELECT p FROM Post p JOIN p.categories c WHERE c.id = :categoryId AND p.status = 'PUBLISHED' ORDER BY p.publishedAt DESC")
    List<Post> findPublishedPostsByCategory(@Param("categoryId") Long categoryId);
    
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t = :tag AND p.status = 'PUBLISHED' ORDER BY p.publishedAt DESC")
    List<Post> findPublishedPostsByTag(@Param("tag") String tag);
    
    @Query("SELECT DISTINCT t FROM Post p JOIN p.tags t WHERE p.status = 'PUBLISHED'")
    List<String> findAllTags();
}
