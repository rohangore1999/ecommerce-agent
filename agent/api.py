from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from chat import chat
from openai import OpenAI
import ssl
import httpx
import asyncio
from chat import chat

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Create a custom SSL context that doesn't verify certificates
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
# Create a custom HTTP client with SSL verification disabled
http_client = httpx.Client(verify=False)

@app.route("/chat", methods=["POST"])
def get_details():
    if not os.getenv("OPEN_API_KEY"):
        return jsonify({"error": "OPEN_API_KEY not found in environment variables."}), 400
    
    data = request.get_json()
    
    if not data or "user_input" not in data:
        return jsonify({"error": "Missing 'user_input' in request body."}), 400
    
    try:
        # to wait for the result
        result = asyncio.run(chat(data["user_input"]))
        print("result", result)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True) 