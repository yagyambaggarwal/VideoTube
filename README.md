# 🎬 VideoHub - Advanced Backend API

A production-ready, full-featured backend API built with **Node.js and Express** that powers a comprehensive video streaming and social media platform. This project demonstrates advanced backend engineering concepts, scalable architecture, and industry best practices.

---

## ✨ Project Overview

VideoHub is a sophisticated backend system that mimics the architecture of platforms like YouTube. It provides a complete suite of features for video hosting, user management, social interactions, and content discovery. The project showcases enterprise-level code organization, security practices, and database design patterns.

---

## 🚀 Key Features & Achievements

### 🔐 **Advanced Authentication System**
- **JWT-based Authentication** with dual-token system (Access & Refresh tokens)
- **Secure Password Management** using bcrypt hashing with salt rounds
- **Cookie-based Token Storage** with secure HTTP-only flags
- **Bearer Token Support** in Authorization headers
- **Token Refresh Mechanism** for enhanced security and user session management
- **Protected Routes** with custom JWT verification middleware

### 🎥 **Video Management System**
- **Cloud Storage Integration** with Cloudinary for scalable media hosting
- **File Upload Handling** using Multer middleware for multipart form data
- **Video Metadata Management** (title, description, duration, views)
- **Advanced Pagination** using mongoose-aggregate-paginate-v2 for handling large datasets
- **Thumbnail Generation** and optimization
- **View Counter** with real-time updates
- **Publication Control** (draft/published status)
- **Video Ownership Tracking** with user references

### 👥 **User Profile System**
- **Comprehensive User Profiles** with avatar and cover images
- **User Watch History** tracking with video references
- **Profile Customization** (avatar, cover image, full details)
- **Unique Username & Email Validation** with database constraints
- **Token Management** with secure refresh token storage
- **User Indexing** for optimized search queries

### 💬 **Social Engagement Features**
- **Comments System** with pagination support
  - Nested comment structure ready for future implementation
  - Timestamp-based comment threads
  - Comment ownership verification

- **Video Likes** with granular control
  - Like/unlike functionality for videos, comments, and tweets
  - Like tracking with user attribution
  - De-duplication prevention

- **Tweet System** (Social Updates)
  - Short-form content creation
  - Aggregation pipeline support for complex queries
  - Timeline generation ready

- **Playlist Management**
  - Create custom playlists
  - Add/remove videos dynamically
  - Playlist ownership and privacy (ready for implementation)
  - Collaborative playlist support (future-ready)

- **Subscription System**
  - Channel subscription model
  - Subscriber tracking
  - Subscription notifications (ready for expansion)

### 🛡️ **Security & Error Handling**
- **Custom Error Handling** with standardized `ApiError` class
- **Graceful Async Error Management** using custom asyncHandler wrapper
- **CORS Configuration** with credentials support
- **Request Validation** at multiple levels
- **Field-level Constraints** (required, unique, trim, lowercase)
- **Database Indexing** for security and performance
- **Input Sanitization** and validation patterns

### 📊 **Advanced Database Architecture**
- **Complex Schema Design** with References (ObjectId relationships)
- **Pre-save Hooks** for automatic password hashing
- **Custom Methods** for password verification and token generation
- **Timestamp Tracking** (createdAt, updatedAt) on all models
- **Aggregation Pipeline Ready** for complex data queries
- **Relationship Management** (User-Video, User-Comment, User-Like, etc.)
- **Database Optimization** through proper indexing strategies

### 🎯 **API Response Standardization**
- **Unified Response Format** using custom `ApiResponse` class
- **Consistent Error Responses** across all endpoints
- **Status Code Management** for different scenarios
- **Success/Failure Indication** in response body
- **Scalable Data Payload Structure**

### 🔧 **Development & Infrastructure**
- **ES6 Module System** with `import/export` syntax
- **Environment Configuration** using dotenv
- **Hot-reload Functionality** with Nodemon
- **Development Dependencies** (Prettier for code formatting)
- **Static File Serving** for uploads and assets
- **Cookie Parsing** for session management

---

## 🛠️ Technology Stack

### **Backend Framework**
- **Express.js** (v5.2.1) - Fast, lightweight web framework
- **Node.js** - JavaScript runtime with event-driven architecture

### **Database & ODM**
- **MongoDB** - NoSQL document database for flexible schema
- **Mongoose** (v8.22.0) - Object Data Modeling with powerful schema capabilities
- **mongoose-aggregate-paginate-v2** - Advanced pagination for aggregation pipelines

### **Authentication & Security**
- **JWT (jsonwebtoken)** - Stateless authentication with token-based approach
- **bcrypt** (v6.0.0) - Cryptographic password hashing
- **cookie-parser** - Secure cookie handling

### **File Upload & Cloud Storage**
- **Multer** (v2.0.2) - Middleware for multipart/form-data handling
- **Cloudinary** (v2.9.0) - Cloud-based image and video management

### **Networking & CORS**
- **CORS** - Cross-Origin Resource Sharing for API accessibility
- **Express Router** - Modular route management

### **Development Tools**
- **Nodemon** - Automatic server restart during development
- **Dotenv** - Environment variable management
- **Prettier** - Code formatting and consistency

---

## 📁 Project Structure

```
src/
├── app.js                 # Express app configuration and middleware setup
├── index.js               # Server entry point
├── constants.js           # Application constants
│
├── controllers/
│   └── user.controller.js # User business logic and handlers
│
├── models/
│   ├── user.models.js     # User schema with auth methods
│   ├── video.models.js    # Video schema with pagination
│   ├── comment.models.js  # Comment schema with pagination
│   ├── like.models.js     # Like schema for multi-entity support
│   ├── playlist.models.js # Playlist schema with video arrays
│   ├── subscription.models.js # Subscription relationship schema
│   └── tweet.models.js    # Tweet schema with pagination
│
├── routes/
│   └── user.routes.js     # User API endpoints
│
├── middlewares/
│   ├── auth.middleware.js # JWT verification and auth logic
│   └── multer.middleware.js # File upload configuration
│
├── db/
│   └── index.js           # Database connection handler
│
└── utils/
    ├── asyncHandler.js    # Async error handling wrapper
    ├── ApiError.js        # Standardized error class
    ├── ApiResponse.js     # Standardized response class
    └── cloudinary.js      # Cloudinary upload logic
```

---

## 🎓 Advanced Concepts Implemented

### **1. Dual Token Authentication**
- **Access Token**: Short-lived (typically 15 minutes) for API requests
- **Refresh Token**: Long-lived for obtaining new access tokens without re-login
- **Token Rotation**: Secure implementation to prevent token hijacking

### **2. Pre-save Hooks**
- Automatic password hashing before database storage
- Modification checking to avoid unnecessary re-hashing
- Industry-standard bcrypt implementation with configurable salt rounds

### **3. Instance Methods on Schemas**
- `isPasswordCorrect()` - Secure password verification
- `generateAccessToken()` - JWT access token creation
- `generateRefreshToken()` - JWT refresh token creation

### **4. Complex Database Relationships**
- **One-to-Many**: User → Videos, Comments, Tweets
- **Many-to-Many**: User ← → Subscriptions
- **Polymorphic References**: Like model supporting multiple entity types
- **Array References**: Playlists containing multiple videos
- **Watch History**: User watch tracking with video references

### **5. Aggregation Pipeline Ready**
- Support for MongoDB aggregation operations
- Pagination through aggregation with mongoose-aggregate-paginate-v2
- Ready for complex queries like recommendations, trending videos, etc.

### **6. Error Handling Strategy**
- **Centralized Error Handler**: asyncHandler wrapper for consistent error catching
- **Custom Error Class**: ApiError with statusCode, message, and error details
- **Error Propagation**: Proper error bubbling through middleware
- **Validation Errors**: Field-level constraints in schema

### **7. Security Best Practices**
- **Password Hashing**: Bcrypt with configurable iterations
- **Token Verification**: JWT signature validation
- **CORS Protection**: Controlled cross-origin access
- **Input Validation**: Schema-level and route-level validation
- **Secure Cookies**: HTTP-only flag support for token storage

### **8. Scalable Architecture**
- **Modular Design**: Separation of concerns (controllers, models, routes, utils)
- **Reusable Middleware**: Auth and file upload handling
- **Environment Configuration**: Dotenv for environment-specific settings
- **Route Versioning**: API v1 structure for future expansion

---

## 🎬 API Endpoints Overview

### **User Management**
```
POST   /api/v1/users/register        # User registration with avatar upload
POST   /api/v1/users/login           # User login with token generation
POST   /api/v1/users/refresh-token   # Refresh access token
POST   /api/v1/users/logout          # User logout
GET    /api/v1/users/profile         # Get user profile (protected)
PUT    /api/v1/users/profile         # Update user profile (protected)
```

### **Video Management**
```
POST   /api/v1/videos                 # Upload video (protected)
GET    /api/v1/videos                 # Get all videos with pagination
GET    /api/v1/videos/:id             # Get video details
PUT    /api/v1/videos/:id             # Update video (protected)
DELETE /api/v1/videos/:id             # Delete video (protected)
```

### **Interactions**
```
POST   /api/v1/comments               # Create comment (protected)
POST   /api/v1/likes                  # Like a video/comment/tweet (protected)
DELETE /api/v1/likes/:id              # Remove like (protected)
POST   /api/v1/tweets                 # Create tweet (protected)
POST   /api/v1/playlists              # Create playlist (protected)
POST   /api/v1/subscriptions          # Subscribe to channel (protected)
```

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account for media storage
- npm or yarn

### **Steps**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Third lec"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root:
   ```
   # Server
   PORT=8000
   CORS_ORIGIN=http://localhost:3000
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret_key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
   REFRESH_TOKEN_EXPIRY=7d
   
   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8000`

---

## 🧪 Testing the API

### **Register a User**
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: multipart/form-data" \
  -F "username=johndoe" \
  -F "email=john@example.com" \
  -F "fullName=John Doe" \
  -F "password=SecurePass123" \
  -F "avatar=@/path/to/avatar.jpg"
```

### **Login**
```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

### **Access Protected Routes**
```bash
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🔒 Security Highlights

- ✅ **Password Security**: Bcrypt hashing with salt
- ✅ **Token Security**: JWT with expiration and refresh mechanism
- ✅ **CORS Protection**: Restricted origin access
- ✅ **Database Security**: Unique indexes on sensitive fields
- ✅ **Input Validation**: Schema and route-level validation
- ✅ **Error Hiding**: Generic error messages to prevent information leakage
- ✅ **Environment Variables**: Sensitive data not hardcoded

---

## 📈 Performance Optimizations

- **Database Indexing**: Indexed username, email, and fullName for fast queries
- **Pagination**: Aggregate pagination for handling large datasets efficiently
- **Connection Pooling**: Mongoose connection management
- **Hot Reload**: Nodemon for seamless development experience
- **Static File Serving**: Express.static for optimal asset delivery

---

## 🚧 Future Enhancements

- [ ] Recommendation algorithm using aggregation pipelines
- [ ] Video analytics and engagement metrics
- [ ] Notification system for subscriptions and engagements
- [ ] Comment threading and nested replies
- [ ] Advanced search with full-text indexing
- [ ] Content moderation system
- [ ] User roles and permissions (Admin, Creator, User)
- [ ] Rate limiting and API throttling
- [ ] Comprehensive logging system
- [ ] Unit and integration tests with Jest

---

## 🤝 Contributing

This project demonstrates a complete backend implementation. Feel free to extend it with additional features or improvements!

---

## 📄 License

ISC License - See LICENSE file for details

---

## 👨‍💻 Author

**Yagyam** - Backend Architecture & Development

---

## 🔗 Database Model Diagram

[View Database Design](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

---

## 📝 Notes

This backend showcases:
- Production-ready code organization
- Security best practices in authentication
- Modern JavaScript (ES6 modules)
- Advanced database relationships
- Scalable API architecture
- Error handling and validation patterns
- Cloud integration for media storage

