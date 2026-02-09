package com.blogcms.dto;

import com.blogcms.model.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;
    
    private String excerpt;
    private String slug;
    private String authorUsername;
    private Long authorId;
    private Set<Long> categoryIds;
    private Set<String> tags;
    private Post.PostStatus status;
    private LocalDateTime publishedAt;
    private Long viewCount;
    private String featuredImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
