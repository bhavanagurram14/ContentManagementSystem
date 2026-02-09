package com.blogcms.repository;

import com.blogcms.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findBySlug(String slug);
    
    Optional<Category> findByName(String name);
    
    Boolean existsBySlug(String slug);
    
    Boolean existsByName(String name);
    
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Category> searchCategories(String search);
}
