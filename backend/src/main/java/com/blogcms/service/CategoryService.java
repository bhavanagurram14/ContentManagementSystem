package com.blogcms.service;

import com.blogcms.model.Category;
import com.blogcms.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
    
    @Transactional(readOnly = true)
    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found with slug: " + slug));
    }
    
    @Transactional(readOnly = true)
    public List<Category> searchCategories(String search) {
        return categoryRepository.searchCategories(search);
    }
    
    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }
        
        category.setSlug(generateSlug(category.getName()));
        return categoryRepository.save(category);
    }
    
    @Transactional
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        
        if (!category.getName().equals(categoryDetails.getName()) && 
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setSlug(generateSlug(categoryDetails.getName()));
        
        return categoryRepository.save(category);
    }
    
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
    
    private String generateSlug(String name) {
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        
        String baseSlug = slug;
        int counter = 1;
        while (categoryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }
        
        return slug;
    }
}
