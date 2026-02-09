package com.blogcms.service;

import com.blogcms.dto.PostDTO;
import com.blogcms.model.Category;
import com.blogcms.model.Post;
import com.blogcms.model.User;
import com.blogcms.repository.CategoryRepository;
import com.blogcms.repository.PostRepository;
import com.blogcms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPublishedPosts() {
        return postRepository.findAllPublishedPosts().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return convertToDTO(post);
    }
    
    @Transactional(readOnly = true)
    public PostDTO getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        return convertToDTO(post);
    }
    
    @Transactional(readOnly = true)
    public List<PostDTO> searchPosts(String search) {
        return postRepository.searchPublishedPosts(search).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByCategory(Long categoryId) {
        return postRepository.findPublishedPostsByCategory(categoryId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<PostDTO> getPostsByTag(String tag) {
        return postRepository.findPublishedPostsByTag(tag).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<String> getAllTags() {
        return postRepository.findAllTags();
    }
    
    @Transactional
    public PostDTO createPost(PostDTO postDTO, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = new Post();
        updatePostFromDTO(post, postDTO);
        post.setAuthor(author);
        post.setSlug(generateSlug(postDTO.getTitle()));
        
        if (postDTO.getStatus() == Post.PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        
        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }
    
    @Transactional
    public PostDTO updatePost(Long id, PostDTO postDTO, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own posts");
        }
        
        updatePostFromDTO(post, postDTO);
        
        if (postDTO.getStatus() == Post.PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }
        
        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }
    
    @Transactional
    public void deletePost(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own posts");
        }
        
        postRepository.delete(post);
    }
    
    private void updatePostFromDTO(Post post, PostDTO dto) {
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setExcerpt(dto.getExcerpt());
        post.setStatus(dto.getStatus() != null ? dto.getStatus() : Post.PostStatus.DRAFT);
        post.setFeaturedImage(dto.getFeaturedImage());
        
        if (dto.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long categoryId : dto.getCategoryIds()) {
                categoryRepository.findById(categoryId).ifPresent(categories::add);
            }
            post.setCategories(categories);
        }
        
        if (dto.getTags() != null) {
            post.setTags(dto.getTags());
        }
    }
    
    private PostDTO convertToDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setExcerpt(post.getExcerpt());
        dto.setSlug(post.getSlug());
        dto.setAuthorUsername(post.getAuthor().getUsername());
        dto.setAuthorId(post.getAuthor().getId());
        dto.setCategoryIds(post.getCategories().stream().map(Category::getId).collect(Collectors.toSet()));
        dto.setTags(post.getTags());
        dto.setStatus(post.getStatus());
        dto.setPublishedAt(post.getPublishedAt());
        dto.setViewCount(post.getViewCount());
        dto.setFeaturedImage(post.getFeaturedImage());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
    
    private String generateSlug(String title) {
        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        
        String baseSlug = slug;
        int counter = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        
        return slug;
    }
}
