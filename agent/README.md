# E-commerce Agent Setup

This is an AI-powered e-commerce agent built with Python and various AI/ML services.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/rohangore1999/ecommerce-agent.git
cd ecommerce-agent/agent
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys and configuration values in the `.env` file:
   - **Database**: MongoDB connection string
   - **LangChain**: API key for LangChain services
   - **AI APIs**: OpenAI, Groq, Gemini API keys
   - **Vector DB**: Astra DB credentials
   - **Graph DB**: Neo4j credentials
   - **Tracing**: LangSmith and Langfuse keys for monitoring

### 4. Required Services

Make sure you have accounts and API keys for:

- OpenAI (for GPT models)
- Groq (for fast inference)
- Google AI (for Gemini)
- DataStax Astra (for vector database)
- Neo4j (for graph database)
- MongoDB (for data storage)
- LangChain/LangSmith (for tracing)
- Langfuse (for observability)

### 5. Run the Application

```bash
python chat.py  # For the chat interface
python api.py   # For the API server
```

## Security Note

- Never commit your `.env` file to version control
- The `.env.example` file is provided as a template
- Keep your API keys secure and rotate them regularly

## Project Structure

- `chat.py` - Main chat interface
- `api.py` - API server
- `requirements.txt` - Python dependencies
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
