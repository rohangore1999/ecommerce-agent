#!/bin/bash

# Development startup script for Ecommerce App
# This script starts both backend and frontend in development mode

echo "🚀 Starting Ecommerce App in Development Mode..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap to call cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📦 Starting backend server on port 3001..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting frontend server on port 3000..."
cd ../frontend && npm start &
FRONTEND_PID=$!

echo "✅ Both servers are starting up..."
echo "📦 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait 