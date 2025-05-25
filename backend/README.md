# Ecommerce Backend API

A Node.js Express server that provides REST API endpoints for an ecommerce application.

## Features

- Product management (CRUD operations)
- Category filtering and search
- Shopping cart functionality
- Session-based cart management
- CORS enabled for frontend integration
- Error handling and validation

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:

```bash
cd ecommerce-agent/backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

- **GET** `/api/health` - Check if server is running

### Products

- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get product by ID
- **GET** `/api/products/category/:category` - Get products by category
- **GET** `/api/products/search/:query` - Search products
- **GET** `/api/categories` - Get all categories

### Cart Management

- **GET** `/api/cart/:sessionId` - Get cart for session
- **POST** `/api/cart/:sessionId/add` - Add item to cart
- **PUT** `/api/cart/:sessionId/update` - Update cart item quantity
- **DELETE** `/api/cart/:sessionId/remove/:itemId` - Remove item from cart
- **DELETE** `/api/cart/:sessionId/clear` - Clear entire cart

## API Request/Response Examples

### Get All Products

```bash
GET /api/products
```

Response:

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Classic White T-Shirt",
      "price": 29.99,
      "originalPrice": 39.99,
      "category": "T-Shirts",
      "image": "...",
      "description": "...",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["White", "Black", "Gray"],
      "inStock": true,
      "rating": 4.5,
      "reviews": 128
    }
    // ... more products
  ]
}
```

### Add to Cart

```bash
POST /api/cart/session_123/add
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2,
  "size": "M",
  "color": "White"
}
```

Response:

```json
{
  "success": true,
  "cart": [
    {
      "id": "unique-item-id",
      "productId": 1,
      "quantity": 2,
      "size": "M",
      "color": "White",
      "product": {
        // full product details
      }
    }
  ]
}
```

## Data Storage

Currently, the application uses in-memory storage for:

- Products (static data)
- Shopping carts (session-based)

In a production environment, you would want to replace this with a proper database like:

- MongoDB
- PostgreSQL
- MySQL

## Environment Variables

You can customize the server by setting these environment variables:

- `PORT` - Server port (default: 3001)

## CORS Configuration

The server is configured to accept requests from any origin. In production, you should restrict this to your frontend domain:

```javascript
app.use(
  cors({
    origin: "http://localhost:3000", // or your frontend URL
  })
);
```

## Error Handling

The API includes comprehensive error handling:

- 404 for not found resources
- 500 for server errors
- Validation errors for malformed requests

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Development

To contribute to this project:

1. Make sure to follow the existing code structure
2. Add error handling for new endpoints
3. Update this README if adding new features
4. Test all endpoints before committing

## Future Enhancements

- Database integration
- User authentication
- Order management
- Payment processing
- Inventory management
- Product reviews and ratings
- Admin panel for product management
