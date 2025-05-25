# Ecommerce App - Full Stack Application

A modern full-stack ecommerce application built with React frontend and Node.js/Express backend.

## 🚀 Features

### Frontend (React)

- Modern responsive UI
- Product catalog with search and filtering
- Shopping cart functionality
- Category-based navigation
- Product details with size/color selection
- Session-based cart persistence

### Backend (Node.js/Express)

- RESTful API endpoints
- Product management
- Shopping cart management
- Session-based storage
- CORS enabled
- Comprehensive error handling

## 📁 Project Structure

```
ecommerce-agent/
├── backend/                 # Node.js/Express API server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md          # Backend documentation
├── frontend/               # React application
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js     # API service (updated for real backend)
│   │   └── data/
│   │       └── mockData.js # Original mock data (now served by backend)
│   └── package.json       # Frontend dependencies
├── start-dev.sh           # Development startup script
└── README.md             # This file
```

## 🛠️ Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone and navigate to the project:**

```bash
cd ecommerce-agent
```

2. **Install backend dependencies:**

```bash
cd backend
npm install
cd ..
```

3. **Install frontend dependencies:**

```bash
cd frontend
npm install
cd ..
```

4. **Start both servers with one command:**

```bash
./start-dev.sh
```

This will start:

- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

### Manual Setup

If you prefer to start servers manually:

**Backend:**

```bash
cd backend
npm run dev  # or npm start for production
```

**Frontend:**

```bash
cd frontend
npm start
```

## 🔌 API Integration

The frontend has been updated to connect to the real backend API instead of using mock data:

### Key Changes Made:

- ✅ Removed mock data and localStorage dependencies from frontend
- ✅ Updated `api.js` to make real HTTP requests
- ✅ Added session-based cart management
- ✅ Implemented proper error handling
- ✅ All CRUD operations now use backend endpoints

### API Endpoints:

**Products:**

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/search/:query` - Search products
- `GET /api/categories` - Get all categories

**Cart:**

- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId/add` - Add to cart
- `PUT /api/cart/:sessionId/update` - Update cart item
- `DELETE /api/cart/:sessionId/remove/:itemId` - Remove from cart
- `DELETE /api/cart/:sessionId/clear` - Clear cart

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm start  # React development server with hot reload
```

## 📊 Data Flow

1. **Frontend** makes API calls to backend endpoints
2. **Backend** processes requests and returns JSON responses
3. **Cart data** is stored on the backend with session-based management
4. **Product data** is served from the backend (moved from frontend mock data)

## 🚀 Production Deployment

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 🔮 Future Enhancements

### Backend

- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Order management system
- Payment processing integration
- Admin panel for product management
- Product reviews and ratings

### Frontend

- User authentication UI
- Order history
- Wishlist functionality
- Advanced filtering options
- Mobile app (React Native)

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**

- Check if port 3001 is available
- Ensure all dependencies are installed: `npm install`
- Check console for error messages

**Frontend can't connect to backend:**

- Ensure backend is running on port 3001
- Check CORS configuration
- Verify API endpoint URLs in `frontend/src/services/api.js`

**Cart not persisting:**

- Cart data is session-based on backend
- Clearing browser data will reset session
- In production, implement user-based cart storage

## 📝 Environment Variables

**Backend:**

- `PORT` - Server port (default: 3001)

**Frontend:**

- API base URL is configured in `src/services/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉**

For more detailed backend documentation, see [`backend/README.md`](backend/README.md)
