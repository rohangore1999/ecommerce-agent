import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { chat } from "@/services/agent";
import ChatProductList from "./ChatProductList";
import { useCart } from "../context/CartContext";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);

  // Add cart context
  const { loadCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to refresh cart data
  const refreshCart = async () => {
    try {
      await loadCart();
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  };

  const handleAgentSelect = (agentType) => {
    setActiveAgent(agentType);
    setShowOptions(false);
    setMessages([
      {
        sender: "system",
        text: `Hello! I'm your ClothingStore 🤖. How can I help you today?\n\n`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");

    // call to AI Agent - Python
    const agentResponse = await chat(userMessage);

    refreshCart();

    debugger;
    // Check if response contains product IDs
    if (
      agentResponse &&
      agentResponse.agent_response_productIds &&
      Array.isArray(agentResponse.agent_response_productIds)
    ) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: agentResponse.agent_response_text,
          productIds: agentResponse.agent_response_productIds,
          timestamp: new Date(),
        },
      ]);
    } else {
      // Handle regular text response
      const responseText =
        typeof agentResponse === "object"
          ? agentResponse.agent_response_text
          : agentResponse;

      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: responseText,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleVoiceToggle = () => {
    if (activeAgent !== "voice agent") return;

    setIsListening(!isListening);

    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage("This is a voice message simulation");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setShowOptions(true);
    setActiveAgent(null);
    setMessages([]);
    setInputMessage("");
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 bg-gray-800 hover:bg-gray-700 shadow-lg"
          >
            💬
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96">
          <Card className="h-full flex flex-col shadow-xl">
            {/* Chat Header */}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {activeAgent
                    ? `${
                        activeAgent.charAt(0).toUpperCase() +
                        activeAgent.slice(1)
                      }`
                    : "Choose Agent"}
                </CardTitle>
                <div className="flex space-x-2">
                  {activeAgent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetChat}
                      className="h-6 w-6 p-0"
                    >
                      ↺
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Chat Content */}
            <CardContent className="flex-1 flex flex-col p-4 overflow-scroll">
              {showOptions ? (
                // Agent Selection
                <div className="flex flex-col space-y-3 justify-center h-full">
                  <Button
                    onClick={() => handleAgentSelect("voice agent")}
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <span>🎤</span>
                    <span>Voice Agent</span>
                  </Button>
                  <Button
                    onClick={() => handleAgentSelect("chat agent")}
                    variant="outline"
                    className="flex items-center justify-center space-x-2 h-12"
                  >
                    <span>💬</span>
                    <span>Chat Agent</span>
                  </Button>
                </div>
              ) : (
                // Chat Interface
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                    {messages.map((message, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.sender === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>

                        {/* Render product list if productIds exist */}
                        {message.productIds &&
                          message.productIds.length > 0 && (
                            <div className="flex justify-start">
                              <div className="w-full">
                                <ChatProductList
                                  productIds={message.productIds}
                                />
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="1"
                      />
                    </div>

                    {activeAgent === "voice agent" && (
                      <Button
                        onClick={handleVoiceToggle}
                        variant={isListening ? "default" : "outline"}
                        size="sm"
                        className={`px-3 ${
                          isListening ? "bg-red-600 hover:bg-red-700" : ""
                        }`}
                      >
                        {isListening ? "🔴" : "🎤"}
                      </Button>
                    )}

                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="px-3"
                      disabled={!inputMessage.trim()}
                    >
                      ➤
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
