package com.blogcms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Content is required")
    @Size(min = 10, message = "Content must be at least 10 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Column(columnDefinition = "TEXT")
    private String excerpt;
    
    @Column(unique = true)
    private String slug;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"posts", "password", "email"})
    private User author;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "post_categories",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.DRAFT;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "featured_image")
    private String featuredImage;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PostStatus {
        DRAFT, PUBLISHED, ARCHIVED
    }
}
