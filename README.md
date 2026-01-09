# MediEase - Smart Medicine Management Platform

<div align="center">

![MediEase](https://img.shields.io/badge/Version-0.0.1-blue?style=flat-square)
![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen?style=flat-square&logo=spring)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**A modern, full-stack Generic medicine recommendation platform for pharmacy medicine management with intelligent search and inventory features.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

MediEase is a comprehensive, intelligent medicine e-commerce and inventory management platform designed to revolutionize how patients discover, compare, and purchase medications. Built with modern technologies and user-centric design principles, MediEase bridges the gap between healthcare providers and patients by providing a seamless, secure, and transparent platform for medicine procurement.

The platform combines a **Spring Boot** backend with a modern **React** frontend, powered by **MongoDB** for scalable data management.

---

## ✨ Features

### 🔍 Smart Search & Discovery
- **Advanced Medicine Search** - Search by medicine name, composition, or brand
- **Generic Medicine Finder** - Find alternative generic medicines with similar compositions
- **Salt Composition Search** - Detailed search by active ingredients
- **Category Browsing** - Explore medicines by therapeutic categories

### 🛍️ E-Commerce Features
- **Product Catalog** - Browse featured and categorized medicines
- **Shopping Cart** - Add/remove items with real-time updates using Redux
- **Checkout System** - Secure order processing
- **Order History** - Track past and current orders

### 👤 User Management
- **User Authentication** - Secure login and registration
- **Password Recovery** - Forgot password functionality
- **User Profile** - Manage account information

### 📱 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Newsletter Subscription** - Stay updated with offers
- **Testimonials & Reviews** - Customer feedback showcase
- **FAQ Section** - Common questions answered
- **Support Portal** - Customer assistance

### 📊 Data Management
- **Multi-source Medicine Data** - Import from Jan Aushadhi, Dava India, Zeelabs
- **Inventory Management** - Track medicine availability
- **CSV Import/Export** - Bulk data operations

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Database**: MongoDB 7.0
- **ORM**: Spring Data JPA & MongoDB
- **Build Tool**: Maven
- **Security**: Spring Security
- **API**: RESTful APIs

### Frontend
- **Framework**: React 18.2.0
- **State Management**: Redux Toolkit 2.10.1
- **Styling**: Tailwind CSS 3.4.13
- **Routing**: React Router DOM 7.10.1
- **HTTP Client**: Axios 1.13.2
- **Data Parsing**: PapaParse 5.5.3
- **Testing**: Jest with React Testing Library
- **Build Tool**: Create React App

**architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (3000)                    │
│  • Responsive UI with Tailwind CSS                          │
│  • Redux for state management                               │
│  • Real-time cart & order updates                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ (API Calls via Axios)
┌──────────────────────▼──────────────────────────────────────┐
│              Spring Boot Backend (8080)                     │
│  • RESTful APIs with Spring MVC                             │
│  • JWT Authentication & Spring Security                     │
│  • Business Logic & Data Processing                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ (Data Persistence)
┌──────────────────────▼──────────────────────────────────────┐
│             MongoDB Database (Cloud/Local)                  │
│  • Document-based storage for flexibility                   │
│  • Scalable horizontal architecture                         │
│  • Real-time data synchronization                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** - [Download](https://www.oracle.com/java/technologies/downloads/#java17)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **MongoDB 7.0+** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MediEase.git
cd MediEase
```

#### 2. Backend Setup

Navigate to the backend directory and configure the database:

```bash
cd backend
```

**Configure MongoDB Connection:**

Create a `.env` file in the backend root (or set environment variables):

```properties
# Local MongoDB (development)
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/pharmacydb

# MongoDB Atlas (production)
SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmacydb?retryWrites=true&w=majority

# Server Port
PORT=8080
```

**Build and Run:**

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend will be available at `http://localhost:8080`

#### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd front
```

Install dependencies:

```bash
npm install
```

**Configure API Endpoint:**

The frontend is already configured with a proxy in `setupProxy.js` that routes API calls to the backend.

**Run the Development Server:**

```bash
npm start
```

The frontend will open at `http://localhost:3000`

#### 4. Root Directory Setup (Optional)

For the root-level MongoDB imports:

```bash
cd <MediEase-root>
npm install
```

---

## 📁 Project Structure

```
MediEase/
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/backend/
│   │   │   │   ├── controller/       # REST API Controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── model/            # Database Models/Entities
│   │   │   │   ├── repository/       # MongoDB Repositories
│   │   │   │   ├── security/         # Security Configuration
│   │   │   │   └── service/          # Business Logic
│   │   │   └── resources/
│   │   │       ├── application.properties  # App Configuration
│   │   │       ├── import_medicines.js    # Data Import Script
│   │   │       └── import_medicines.json  # Medicine Data
│   │   └── test/                    # Unit & Integration Tests
│   ├── pom.xml                      # Maven Configuration
│   ├── Dockerfile                   # Docker Configuration
│   └── README.md                    # Backend Documentation
│
├── front/                            # React Frontend
│   ├── public/
│   │   ├── index.html               # HTML Entry Point
│   │   ├── Category/                # CSV Data Files
│   │   │   ├── Jan Aushadhi.csv
│   │   │   ├── Dava India.csv
│   │   │   └── Zeelabs.csv
│   │   └── images/                  # Image Assets
│   ├── src/
│   │   ├── components/              # React Components
│   │   │   ├── AppDownload.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── GenericFinder.jsx
│   │   │   ├── GenericMedicineInfo.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MedicineDetailPage.jsx
│   │   │   ├── MedicineSearch.jsx
│   │   │   ├── MedicinesPage.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── ...
│   │   ├── App.js                   # Root Component
│   │   ├── api.js                   # API Service Configuration
│   │   ├── store.js                 # Redux Store Setup
│   │   ├── cartSlice.js             # Redux - Cart State
│   │   ├── categoriesSlice.js       # Redux - Categories State
│   │   ├── productsSlice.js         # Redux - Products State
│   │   ├── searchSlice.js           # Redux - Search State
│   │   └── index.js                 # Entry Point
│   ├── package.json                 # npm Dependencies
│   ├── tailwind.config.js           # Tailwind Configuration
│   ├── postcss.config.js            # PostCSS Configuration
│   └── babel.config.js              # Babel Configuration
│
├── package.json                      # Root npm Configuration
├── render.yaml                       # Render Deployment Configuration
└── README.md                         # Project Documentation
```

---

## 🔧 Configuration

### Backend Environment Variables

```env
# MongoDB Connection (Required)
SPRING_DATA_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pharmacydb?retryWrites=true&w=majority

# Server Configuration
PORT=8080
SPRING_APPLICATION_NAME=backend

# Spring Boot Profiles
SPRING_PROFILES_ACTIVE=production
```

### Frontend Environment Variables

Create a `.env` file in the `front` directory:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 📚 Available Scripts

### Backend

```bash
# Clean build
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn package

# View dependency tree
mvn dependency:tree
```

### Frontend

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (Warning: irreversible)
npm run eject
```

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd backend
docker build -t MediEase-backend:latest .
```

### Run Docker Container

```bash
docker run -d \
  --name MediEase \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/pharmacydb \
  MediEase-backend:latest
```

### Docker Compose (for local development with MongoDB)

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/pharmacydb
    depends_on:
      - mongodb

  frontend:
    build: ./front
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

---

## 🌐 Deployment

### Render Deployment

The project is configured for deployment on [Render](https://render.com). Configuration is specified in `render.yaml`:

```bash
# Environment variables required on Render:
- SPRING_DATA_MONGODB_URI: Your MongoDB Atlas connection string
- PORT: Automatically provided by Render (default: 10000)
```

**Deploy:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables in the Render dashboard
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/MediEase.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Your Changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Link relevant issues

### Development Guidelines

- **Code Style**: Follow Google Java Style Guide for backend, Airbnb JavaScript Style Guide for frontend
- **Testing**: Write tests for new features (minimum 80% coverage)
- **Documentation**: Update README and inline comments for significant changes
- **Commits**: Use meaningful commit messages

---

## 📝 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Key Endpoints

#### Medicines
- `GET /medicines` - Get all medicines
- `GET /medicines/{id}` - Get medicine by ID
- `GET /medicines/search?q=query` - Search medicines
- `POST /medicines` - Create new medicine
- `PUT /medicines/{id}` - Update medicine
- `DELETE /medicines/{id}` - Delete medicine

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/forgot-password` - Password recovery

#### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order details

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/{id}/medicines` - Get medicines in category

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Solution: Verify SPRING_DATA_MONGODB_URI is correctly set and MongoDB is running
```

**Port Already in Use**
```bash
# Change port in application.properties or use:
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Frontend Issues

**Module Not Found**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Error**
```
Solution: Ensure backend is running on http://localhost:8080
Check setupProxy.js configuration
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Support & Contact

For questions or issues:

- 📧 **Email**: support@MediEase.dev
- 🐛 **Issues**: [GitHub Issues](https://github.com/imvaibhav100/MediEase/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/imvaibhav100/MediEase/discussions)

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React community for wonderful tools and libraries
- MongoDB for reliable database solutions
- All contributors who have helped with pull requests and feedback

---

<div align="center">

**Made with ❤️ by the MediEase Team**

[⬆ back to top](#MediEase---smart-medicine-management-platform)

</div>
