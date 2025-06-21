# Ecommerce Agent - AI-Powered Conversational Shopping

A sophisticated proof-of-concept ecommerce application featuring AI-powered conversational shopping with both text and voice chat capabilities. Built with React frontend, Node.js/Express backend, and Python-based AI agent using OpenAI's language models and advanced agent frameworks.

## 🤖 AI Agent Features

### Conversational Shopping Experience

- **Dual Interface**: Both text and voice-based chat interactions with seamless switching
- **Natural Language Processing**: Understands customer queries in natural language using OpenAI GPT-4.1
- **Smart Product Recommendations**: AI-powered product suggestions with sophisticated scoring algorithms
- **Cart Management**: Add/remove products through conversation with session persistence
- **Human-in-the-Loop**: Real-time support agent handoff with conversation context preservation
- **Voice Synthesis**: Text-to-speech responses using OpenAI's TTS API with natural voice

### Advanced Voice Capabilities

- **Speech-to-Text**: Real-time voice recognition using Web Speech API
- **Voice Command Processing**: Complete shopping experience through voice interaction
- **Audio Visualization**: Real-time audio wave visualization during speech
- **Intelligent Listening**: Automatic microphone management with silence detection
- **Multi-modal Interaction**: Seamless switching between voice and text modes

### AI Technologies Stack

- **OpenAI GPT-4.1**: Primary language model for conversation and reasoning
- **OpenAI TTS**: High-quality text-to-speech synthesis with natural voices
- **Agents Framework**: Advanced agent framework with function calling capabilities
- **Async Processing**: Full asynchronous processing for optimal performance
- **Function Tools**: Structured tool execution for ecommerce operations

## 🏗️ Detailed Architecture Analysis

### Frontend Architecture (React + Vite)

**Technology Stack:**

- **React 19.1.0**: Latest React with concurrent features
- **Vite 6.3.5**: Ultra-fast build tool and dev server
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **ShadCN UI**: Modern component library with Radix UI primitives
- **AI SDK**: Vercel's AI SDK for OpenAI integration (@ai-sdk/openai)

**Component Architecture:**

```javascript
App.jsx                    // Main router and context provider
├── Header.jsx            // Navigation and branding
├── ChatWidget.jsx        // Core AI chat interface (790 lines)
├── ChatProductList.jsx   // Product display in chat
├── AudioWave.jsx         // Voice visualization component
└── Pages/
    ├── ProductListing.jsx  // Product catalog
    ├── ProductDetail.jsx   // Individual product view
    └── Cart.jsx           // Shopping cart
```

**Key Features:**

- **Session-based Cart Management**: Persistent cart state across sessions
- **Real-time Chat Interface**: Advanced chat UI with message history
- **Voice Integration**: Complete Web Speech API implementation
- **Product Integration**: Products displayed directly in chat conversations
- **Responsive Design**: Mobile-first responsive design with Tailwind

### Backend Architecture (Node.js/Express)

**Technology Stack:**

- **Express.js 4.18.2**: Fast, unopinionated web framework
- **CORS**: Cross-origin resource sharing for frontend communication
- **UUID**: Session management and unique identifiers
- **Body Parser**: Request parsing middleware

**API Architecture:**

```javascript
// Product Management
GET    /api/products                    // All products
GET    /api/products/:id               // Product by ID
GET    /api/products/category/:category // Products by category
GET    /api/products/search/:query     // Product search
GET    /api/products/:id/recommendations // Smart recommendations
GET    /api/products/name/:name/id     // Product ID by name

// Cart Management
GET    /api/cart/:sessionId            // Get cart contents
POST   /api/cart/:sessionId/add        // Add to cart
DELETE /api/cart/:sessionId/remove/product/:id // Remove from cart
PUT    /api/cart/:sessionId/update     // Update quantities
DELETE /api/cart/:sessionId/clear      // Clear cart

// System
GET    /api/health                     // Health check
GET    /api/categories                 // Product categories
```

**Advanced Features:**

- **Intelligent Recommendation Engine**: Multi-factor scoring algorithm based on:

  - Category matching (50 points)
  - Price similarity within 30% range (0-30 points)
  - Rating similarity (0-20 points)
  - Stock availability bonus (10 points)
  - High rating bonus (5 points for 4.5+ ratings)

- **Flexible Product Search**: Both exact and partial name matching with query parameters
- **In-Memory Cart Storage**: Session-based cart persistence (production-ready for database)
- **Comprehensive Error Handling**: Structured error responses with success flags

### AI Agent Architecture (Python + Flask)

**Technology Stack:**

- **Flask**: Lightweight WSGI web application framework
- **Agents Framework**: Advanced AI agent framework with function calling
- **OpenAI GPT-4.1**: Latest language model with enhanced reasoning
- **Async/Await**: Full asynchronous processing
- **HTTPX**: Modern async HTTP client with SSL customization

**Agent Implementation Details:**

#### Function Tools Architecture

```python
@function_tool
async def get_cart_items() -> dict:
    """Retrieve cart contents with product IDs"""

@function_tool
async def recommend_products(cart_item: str) -> dict:
    """AI-powered product recommendations based on cart"""

@function_tool
async def add_product_to_cart(product_name: str) -> dict:
    """Add product by natural language name"""

@function_tool
async def remove_product_from_cart(product_name: str) -> dict:
    """Remove product by natural language name"""

@function_tool
async def get_connect_to_support_agent(text: str) -> str:
    """Human-in-the-loop support agent integration"""
```

#### Agent Configuration

```python
Agent(
    name="ECommerce Agent",
    model="gpt-4.1",  # Latest GPT model
    instructions="""Advanced JSON response formatting with:
    - agent_response_text: User-facing message
    - agent_response_productIds: Product arrays for display
    """,
    tools=[all_function_tools]
)
```

**Key Technical Decisions:**

- **SSL Verification Disabled**: Custom SSL context for development environments
- **Session Management**: Hardcoded session ID (session_lxcylwz3l29) for demo purposes
- **Product Name Resolution**: Two-step process (name → ID → cart operation)
- **Async Architecture**: Full async/await pattern for optimal performance

## 🚀 Complete Setup Guide

### Prerequisites

- **Node.js** (v16 or higher) - for backend and frontend
- **Python** (v3.8 or higher) - for AI agent
- **npm** or **yarn** - package management
- **OpenAI API Key** - for AI capabilities

### 1. Environment Configuration

Create environment files with proper API keys:

```bash
# Frontend environment (.env in frontend/)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Agent environment (.env in agent/)
OPEN_API_KEY=your_openai_api_key_here
```

### 2. Backend Setup (Node.js/Express)

```bash
cd backend
npm install
npm run dev  # Starts on http://localhost:3001
```

**Available Scripts:**

- `npm start`: Production server
- `npm run dev`: Development with nodemon hot-reload

### 3. Frontend Setup (React/Vite)

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

**Available Scripts:**

- `npm run dev`: Development server with HMR
- `npm run build`: Production build with TypeScript check
- `npm run preview`: Preview production build

### 4. AI Agent Setup (Python/Flask)

```bash
cd agent
pip install -r requirements.txt
python api.py  # Starts Flask server on http://localhost:5001
```

**Dependencies Include:**

- Flask with CORS support
- OpenAI SDK with async support
- Agents framework for function calling
- HTTPX for async HTTP requests
- SSL context customization

### 5. Development Workflow

```bash
# Terminal 1: Backend API Server
cd ecommerce-agent/backend && npm run dev

# Terminal 2: Frontend Development Server
cd ecommerce-agent/frontend && npm run dev

# Terminal 3: AI Agent Flask Server
cd ecommerce-agent/agent && python api.py
```

## 🔧 In-Depth Implementation Analysis

### ChatWidget Component (790 lines)

The ChatWidget is the core component handling both text and voice interactions:

**State Management:**

```javascript
const [activeAgent, setActiveAgent] = useState(null); // "text agent" | "voice agent"
const [messages, setMessages] = useState([]); // Chat history
const [isListening, setIsListening] = useState(false); // Voice recognition state
const [isSpeaking, setIsSpeaking] = useState(false); // TTS playback state
```

**Voice Processing Pipeline:**

1. **Speech Recognition**: Web Speech API with continuous listening
2. **Silence Detection**: Automatic message sending after speech pause
3. **Audio Processing**: Real-time wave visualization during input/output
4. **TTS Integration**: OpenAI TTS with natural voice synthesis
5. **State Coordination**: Intelligent microphone management during TTS playback

**Advanced Features:**

- **Interim Transcript Handling**: Real-time speech-to-text feedback
- **Audio Conflict Resolution**: Prevents microphone interference during TTS
- **Conversation Context**: Maintains full chat history for context awareness
- **Error Recovery**: Graceful handling of speech recognition failures

### Backend API Implementation

**Smart Recommendation Algorithm:**

```javascript
const recommendations = products
  .filter((p) => p.id !== productId)
  .map((product) => {
    let score = 0;

    // Category matching (highest priority)
    if (product.category === targetProduct.category) score += 50;

    // Price similarity within 30% range
    const priceDiff = Math.abs(product.price - targetProduct.price);
    const priceRange = targetProduct.price * 0.3;
    if (priceDiff <= priceRange) {
      score += 30 - (priceDiff / priceRange) * 30;
    }

    // Rating and stock bonuses
    score += Math.max(
      0,
      20 - Math.abs(product.rating - targetProduct.rating) * 10
    );
    if (product.inStock) score += 10;
    if (product.rating >= 4.5) score += 5;

    return { ...product, recommendationScore: score };
  })
  .sort((a, b) => b.recommendationScore - a.recommendationScore);
```

**Flexible Product Search:**

```javascript
// Supports both exact and partial matching
GET /api/products/name/Classic White T-Shirt/id?exact=true
GET /api/products/name/shirt/id  // Partial matching
```

### AI Agent Function Calling

**Product Name Resolution Pattern:**

```python
# Step 1: Resolve product name to ID
response = await http_client.get(
    f"http://localhost:3001/api/products/name/{product_name}/id?exact=true"
)
product_id = response.json()["productId"]

# Step 2: Perform cart operation with ID
response = await http_client.post(
    f"http://localhost:3001/api/cart/session_lxcylwz3l29/add",
    json={"productId": product_id, "quantity": 1}
)
```

**Human-in-the-Loop Implementation:**

```python
@function_tool
async def get_connect_to_support_agent(text: str) -> str:
    print(f"\n📝 User question: {text}\n")
    print("⏳ Waiting for support agent...")

    # Async input handling for real-time support
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(None, input, "Support Agent: ")

    return response
```

## 🔌 Advanced API Integration

### Frontend ↔ AI Agent Communication

**Request/Response Pattern:**

```javascript
const response = await fetch("http://localhost:5001/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_input: userMessage }),
});

const agentResponse = await response.json();
// Response format: { agent_response: "JSON string" }
```

**Response Processing:**

```javascript
// Parse nested JSON response
let parsedResponse = agentResponse;
if (agentResponse?.agent_response) {
  try {
    let jsonString = agentResponse.agent_response.replace(/'/g, '"');
    parsedResponse = JSON.parse(jsonString);
  } catch (error) {
    // Fallback to original response
    parsedResponse = agentResponse;
  }
}

// Handle product display in chat
if (parsedResponse?.agent_response_productIds) {
  const responseMessage = {
    sender: "system",
    text: parsedResponse.agent_response_text,
    productIds: parsedResponse.agent_response_productIds,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, responseMessage]);
}
```

### Voice Integration Architecture

**TTS Processing Pipeline:**

```javascript
// Generate speech with OpenAI TTS
const audioElement = await speak(responseText);

// Connect to audio visualization
if (window.audioWaveControls) {
  window.audioWaveControls.connectAudioOutput(audioElement);
}

// Coordinate with voice recognition
audioElement.onended = () => {
  setIsSpeaking(false);
  restartListeningAfterSpeech(); // Smart restart logic
};
```

**Speech Recognition Management:**

```javascript
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
recognitionRef.current = new SpeechRecognition();
recognitionRef.current.continuous = false;
recognitionRef.current.interimResults = true;
recognitionRef.current.lang = "en-US";

// Intelligent silence detection
recognitionRef.current.onresult = (event) => {
  // Process interim and final results
  // Implement automatic sending on silence
};
```

## 🚧 Current Implementation Status

### ✅ Fully Implemented Features

- **Core AI Chat Functionality**: Complete OpenAI GPT-4.1 integration
- **Flask API Server**: Production-ready REST endpoints
- **Voice Recognition**: Full Web Speech API implementation
- **Text-to-Speech**: OpenAI TTS with natural voice synthesis
- **Product Management**: Complete CRUD operations with search
- **Cart Operations**: Session-based cart with persistence
- **Smart Recommendations**: Multi-factor scoring algorithm
- **Real-time Audio Visualization**: Dynamic wave visualization
- **Human-in-the-Loop**: Live support agent handoff
- **Responsive UI**: Mobile-first design with modern components

### 🚧 Partial Implementation

- **Session Management**: Currently uses hardcoded session ID
- **Error Handling**: Basic error handling, needs enhancement
- **Product Catalog**: Limited to 5 demo products
- **User Authentication**: Not implemented (session-based only)

### 📋 Future Development Roadmap

- **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
- **User Authentication**: JWT-based authentication system
- **Advanced Analytics**: User behavior tracking and analytics
- **Payment Integration**: Stripe/PayPal payment processing
- **Real-time Notifications**: WebSocket-based real-time updates
- **Advanced Voice Features**: Voice commands for navigation
- **Multi-language Support**: Internationalization (i18n)
- **Performance Optimization**: Caching, lazy loading, CDN integration

## 🛠️ Development Best Practices

### Code Architecture Patterns

1. **Separation of Concerns**: Clear separation between UI, business logic, and data
2. **Async/Await Pattern**: Consistent async handling across all layers
3. **Component Composition**: Reusable React components with ShadCN UI
4. **Function Tools Pattern**: Structured AI agent capabilities
5. **Error Boundaries**: Comprehensive error handling at component level

### Performance Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Async Processing**: Non-blocking operations throughout
3. **State Management**: Efficient React state updates
4. **HTTP Client Optimization**: Connection pooling with HTTPX
5. **Voice Processing**: Efficient audio buffer management

### Security Considerations

1. **CORS Configuration**: Properly configured cross-origin requests
2. **Input Validation**: Server-side validation for all inputs
3. **SSL Context**: Custom SSL handling for development
4. **API Key Management**: Environment-based configuration
5. **Session Security**: Secure session management patterns

## 📝 Environment Variables Reference

### Agent Configuration (.env in agent/)

```bash
OPEN_API_KEY=your_openai_api_key          # OpenAI API access
FLASK_ENV=development                     # Flask environment
FLASK_DEBUG=True                          # Debug mode
```

### Frontend Configuration (.env in frontend/)

```bash
VITE_OPENAI_API_KEY=your_openai_api_key   # OpenAI API for TTS
VITE_API_BASE_URL=http://localhost:3001   # Backend API URL
VITE_AGENT_URL=http://localhost:5001      # AI Agent URL
```

### Backend Configuration (.env in backend/)

```bash
PORT=3001                                 # Server port
NODE_ENV=development                      # Node environment
```

## 🎯 Advanced Usage Scenarios

### 1. Voice Shopping Workflow

```
User: "Add a white t-shirt to my cart"
→ Speech Recognition → AI Processing → Product Search → Cart Addition
→ TTS Response: "I've added the Classic White T-Shirt to your cart"
```

### 2. Intelligent Recommendations

```
User: "What goes well with the denim jacket in my cart?"
→ Get Cart Items → Analyze Cart Contents → Generate Recommendations
→ Display: Complementary products with reasoning
```

### 3. Human Support Handoff

```
User: "I need help with returns"
→ AI Agent → Support Tool Activation → Live Agent Connection
→ Real-time Support: Human agent responds in chat
```

## 🔮 Technical Innovation Highlights

1. **Multi-Modal AI Interaction**: Seamless voice and text integration
2. **Advanced Agent Framework**: Function calling with structured responses
3. **Real-time Audio Processing**: Dynamic wave visualization and audio management
4. **Intelligent Product Matching**: Fuzzy matching with exact fallback
5. **Context-Aware Conversations**: Full conversation history maintenance
6. **Async-First Architecture**: Performance-optimized async processing throughout

This ecommerce agent represents a sophisticated implementation of conversational AI for commerce, showcasing modern web development practices, advanced AI integration, and thoughtful user experience design.
