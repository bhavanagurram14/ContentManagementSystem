package com.blogcms.controller;

import com.blogcms.dto.PostDTO;
import com.blogcms.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts(@RequestParam(required = false) String search,
                                                      @RequestParam(required = false) Long categoryId,
                                                      @RequestParam(required = false) String tag) {
        List<PostDTO> posts;
        
        if (search != null && !search.isEmpty()) {
            posts = postService.searchPosts(search);
        } else if (categoryId != null) {
            posts = postService.getPostsByCategory(categoryId);
        } else if (tag != null && !tag.isEmpty()) {
            posts = postService.getPostsByTag(tag);
        } else {
            posts = postService.getAllPublishedPosts();
        }
        
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        try {
            PostDTO post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostDTO> getPostBySlug(@PathVariable String slug) {
        try {
            PostDTO post = postService.getPostBySlug(slug);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(postService.getAllTags());
    }
    
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody PostDTO postDTO, Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("User not authenticated"));
            }
            
            String username = authentication.getName();
            PostDTO createdPost = postService.createPost(postDTO, username);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, 
                                        @Valid @RequestBody PostDTO postDTO,
                                        Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("User not authenticated"));
            }
            
            String username = authentication.getName();
            PostDTO updatedPost = postService.updatePost(id, postDTO, username);
            return ResponseEntity.ok(updatedPost);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("User not authenticated"));
            }
            
            String username = authentication.getName();
            postService.deletePost(id, username);
            return ResponseEntity.ok(createSuccessResponse("Post deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        return response;
    }
    
    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return response;
    }
}
