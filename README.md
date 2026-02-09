# Blog CMS - Full Stack Application
A modern, production-ready Blog Content Management System built with **Java Spring Boot**, **React**, and **MySQL**.

## Features

### Backend (Spring Boot)
- **JWT Authentication** - Secure user registration and login
- **RESTful API** - Clean, well-structured endpoints
- **JPA/Hibernate** - Efficient database operations
- **Spring Security** - Role-based access control
- **Input Validation** - Real-time validation with Bean Validation
- **Layered Architecture** - Controller → Service → Repository pattern

### Frontend (React)
- **Modern React** - Hooks, Context API, functional components
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors
- **Real-time Validation** - Form validation with error handling
- **Responsive Design** - Mobile-friendly UI
- **Toast Notifications** - User feedback with react-toastify

### Features
- ✅ **User Authentication** - Register, login, logout with JWT
- ✅ **CRUD Operations** - Create, read, update, delete posts
- ✅ **Search & Filter** - Search posts by title/content, filter by category/tag
- ✅ **Categories** - Organize posts into categories
- ✅ **Tags** - Add multiple tags to posts
- ✅ **Post Status** - Draft, Published, Archived
- ✅ **User Dashboard** - Manage your own posts
- ✅ **Responsive UI** - Works on all devices

##  Quick Start
#### 1. Database Setup

```bash
# Start MySQL and create database
mysql -u root -p
CREATE DATABASE blog_cms;
exit;
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Update application.properties if needed
# src/main/resources/application.properties
# Change MySQL username/password if different

# Build and run
mvn clean install
mvn spring-boot:run

# Backend will start on http://localhost:8080
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:3000
```

## 📁 Project Structure

```
blog-cms/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/blogcms/
│   │   ├── config/            # Security, CORS configuration
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # JPA Repositories
│   │   ├── security/          # JWT, UserDetails implementation
│   │   ├── service/           # Business Logic
│   │   └── BlogCmsApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context (Auth)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml         # Docker orchestration
└── README.md                  # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts?search={term}` - Search posts
- `GET /api/posts?categoryId={id}` - Filter by category
- `GET /api/posts?tag={tag}` - Filter by tag
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/{id}` - Update post (authenticated)
- `DELETE /api/posts/{id}` - Delete post (authenticated)
- `GET /api/posts/tags` - Get all tags

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category (authenticated)
- `PUT /api/categories/{id}` - Update category (authenticated)
- `DELETE /api/categories/{id}` - Delete category (authenticated)

## Usage Guide

### 1. Register & Login
1. Navigate to http://localhost:3000
2. Click "Register" and create an account
3. Login with your credentials

### 2. Create a Post
1. Click "New Post" button
2. Fill in title, content, excerpt
3. Select categories and add tags
4. Choose status (Draft/Published)
5. Click "Create Post"

### 3. Manage Posts
1. Go to "My Posts"
2. View, edit, or delete your posts
3. Click edit icon to modify
4. Click delete icon to remove

### 4. Browse Posts
1. Home page shows all published posts
2. Use search bar to find posts
3. Click on categories to filter
4. Click on a post to view details

##  Security Features

- **JWT Authentication** - Stateless authentication
- **Password Encryption** - BCrypt hashing
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side validation
- **Protected Routes** - Frontend route guards
- **SQL Injection Prevention** - JPA/Hibernate protection

## 🎨 UI Features

- **Responsive Design** - Works on mobile, tablet, desktop
- **Modern Styling** - Clean, professional interface
- **Loading States** - Spinners for async operations
- **Toast Notifications** - Success/error messages
- **Form Validation** - Real-time error feedback
- **Protected Routes** - Redirect to login if not authenticated

<img width="959" height="421" alt="image" src="https://github.com/user-attachments/assets/495448f8-7b7c-4cef-a6e8-6dc8dc0fd164" />
