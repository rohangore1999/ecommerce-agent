# Ecommerce Agent - AI-Powered Full Stack Application

A modern, intelligent ecommerce application featuring AI-powered conversational shopping with both voice and text chat capabilities. Built with React frontend, Node.js/Express backend, and Python-based AI agent using advanced language models.

## 🤖 AI Agent Features

### Conversational Shopping Experience

- **Dual Interface**: Both voice and text-based chat interactions
- **Natural Language Processing**: Understands customer queries in natural language
- **Smart Product Recommendations**: AI-powered product suggestions based on cart contents
- **Cart Management**: Add/remove products through conversation
- **Human-in-the-Loop**: Seamless handoff to support agents when needed

### Voice Capabilities

- **Speech-to-Text**: Real-time voice recognition using Web Speech API
- **Text-to-Speech**: AI-generated voice responses using OpenAI TTS
- **Voice Commands**: Complete shopping experience through voice interaction
- **Multi-browser Support**: Works with Chrome, Edge, and other modern browsers

### AI Technologies Used

- **OpenAI GPT-4**: Primary language model for conversation
- **OpenAI TTS**: Text-to-speech synthesis with natural voices
- **LangChain**: Agent framework and tool orchestration
- **Function Calling**: Structured tool execution for ecommerce operations

## 🏗️ Architecture Overview

### Frontend (React + Vite)

- Modern React application with Vite build system
- Tailwind CSS for responsive, beautiful UI
- ShadCN UI components for consistent design
- Real-time chat interface with voice controls
- Session-based cart management
- Product catalog with search and filtering

### Backend (Node.js/Express)

- RESTful API server
- Session-based cart storage
- Product management endpoints
- CORS-enabled for cross-origin requests
- Comprehensive error handling
- Product search and recommendation APIs

### AI Agent (Python)

- Async Python agent using OpenAI Agents framework
- Function tools for ecommerce operations
- SSL-disabled HTTP client for development
- Session-based cart integration
- Support agent handoff capability

## 🚀 Complete Setup Guide

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **OpenAI API Key** (for AI agent and TTS)

### 1. Environment Setup

**Create environment files:**

```bash
# Frontend environment (.env in frontend/)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Agent environment (.env in agent/)
OPEN_API_KEY=your_openai_api_key_here
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3001
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

### 4. AI Agent Setup

```bash
cd agent
pip install -r requirements.txt
python api.py  # Starts Flask server on http://localhost:5001
```

### 5. Quick Start (All Services)

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: AI Agent
cd agent && python api.py
```

## 🔧 AI Agent Implementation Details

### Core Agent Architecture

The AI agent is built using the OpenAI Agents framework with the following components:

#### Function Tools

```python
@function_tool
async def get_cart_items() -> int:
    """Get productIds of items in cart"""

@function_tool
async def recommend_products(cart_item: str) -> int:
    """Recommend products based on cart contents"""

@function_tool
async def add_product_to_cart(product_name: str) -> int:
    """Add product to cart by name"""

@function_tool
async def remove_product_from_cart(product_name: str) -> int:
    """Remove product from cart by name"""

@function_tool
def get_connect_to_support_agent(text: str) -> str:
    """Human-in-the-loop support agent handoff"""
```

#### Agent Configuration

- **Model**: GPT-4.1 for advanced reasoning
- **Instructions**: Structured JSON response format
- **Tools**: Ecommerce-specific function tools
- **Session Management**: Persistent cart state

### Voice Integration

#### Speech-to-Text (Frontend)

```javascript
// Web Speech API implementation
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
recognitionRef.current = new SpeechRecognition();
recognitionRef.current.continuous = false;
recognitionRef.current.interimResults = false;
recognitionRef.current.lang = "en-US";
```

#### Text-to-Speech (AI-Generated)

```javascript
// OpenAI TTS integration
const audio = await generateSpeech({
  model: openai.speech("tts-1"),
  voice: "coral",
  text: responseText,
  instructions: "Speak in a cheerful and positive tone.",
});
```

## 🔌 API Integration & Data Flow

### Frontend ↔ Backend Communication

- **Products API**: GET `/api/products`, `/api/products/:id`, `/api/products/category/:category`
- **Search API**: GET `/api/products/search/:query`
- **Cart API**: GET/POST/PUT/DELETE `/api/cart/:sessionId/*`
- **Recommendations**: GET `/api/products/:id/recommendations`

### Frontend ↔ AI Agent Communication

- **Chat Endpoint**: POST `http://localhost:5001/chat`
- **Payload**: `{ user_input: "user message" }`
- **Response**: JSON with `agent_response_text` and optional `agent_response_productIds`

### AI Agent ↔ Backend Communication

- **Cart Operations**: HTTP requests to backend cart endpoints
- **Product Lookup**: Name-to-ID resolution for cart operations
- **Session Management**: Consistent session ID across requests

## 🎯 Key Features Breakdown

### 1. Intelligent Chat Interface

- **Dual Mode**: Toggle between text and voice agents
- **Real-time Responses**: Immediate AI-powered responses
- **Product Integration**: Display products directly in chat
- **Context Awareness**: Maintains conversation context

### 2. Voice Shopping Experience

- **Voice Commands**: "Add Nike shoes to cart", "Show me my cart items"
- **Natural Responses**: AI speaks back with natural voice
- **Hands-free Shopping**: Complete shopping without typing
- **Error Handling**: Graceful handling of speech recognition errors

### 3. Smart Recommendations

- **Context-Aware**: Based on current cart contents
- **AI-Powered**: Uses GPT-4 for intelligent suggestions
- **Visual Display**: Products shown with images and details
- **One-Click Add**: Easy addition to cart from recommendations

### 4. Session Management

- **Persistent Cart**: Cart survives page refreshes
- **Session-Based**: No user accounts required
- **Real-time Updates**: Cart updates immediately after AI operations


## 🔮 Advanced Features

### Human-in-the-Loop Support

- **Seamless Handoff**: AI can transfer to human agents
- **Context Preservation**: Full conversation history maintained
- **Support Integration**: Real-time support agent responses
- **Fallback Mechanism**: When AI cannot handle requests

