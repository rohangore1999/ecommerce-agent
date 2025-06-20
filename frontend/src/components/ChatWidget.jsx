import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { chat, speak } from "@/services/agent";
import ChatProductList from "./ChatProductList";
import { useCart } from "../context/CartContext";
import AudioWave from "./AudioWave";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const interimTranscriptRef = useRef("");
  const currentAudioRef = useRef(null);
  const restartListeningTimeoutRef = useRef(null);

  // Add cart context
  const { loadCart } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to start speaking and ensure listening is stopped
  const startSpeaking = () => {
    if (isListening) {
      stopVoiceRecognition();
    }

    // Clear any pending restart timeouts
    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
    }

    setIsSpeaking(true);
  };

  // Helper function to safely restart listening after TTS
  const restartListeningAfterSpeech = () => {
    // Clear any existing timeout
    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
    }

    // Set a longer delay to ensure audio has completely finished
    restartListeningTimeoutRef.current = setTimeout(() => {
      if (activeAgent === "voice agent" && !isSpeaking) {
        // Double check that we're not still speaking
        if (currentAudioRef.current && !currentAudioRef.current.ended) {
          // Audio is still playing, wait a bit more
          restartListeningAfterSpeech();
          return;
        }

        // Reconnect microphone for listening
        if (window.audioWaveControls) {
          window.audioWaveControls.connectMicrophoneInput();
        }

        // Start voice recognition
        startVoiceRecognition();
      }
      restartListeningTimeoutRef.current = null;
    }, 1500); // Increased delay to 1.5 seconds
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

  const handleAgentSelect = async (agentType) => {
    setActiveAgent(agentType);
    setShowOptions(false);
    const welcomeMessage = `Hello! Welcome to ClothingStore 🤖. How can I help you today?`;

    setMessages([
      {
        sender: "system",
        text: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    // For voice agent, speak the welcome message first, then start listening
    if (agentType === "voice agent") {
      try {
        startSpeaking();
        const audioElement = await speak(welcomeMessage);
        currentAudioRef.current = audioElement;

        // Connect audio output to wave visualization
        if (window.audioWaveControls && audioElement) {
          window.audioWaveControls.connectAudioOutput(audioElement);
        }

        // Start listening after TTS finishes
        audioElement.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          restartListeningAfterSpeech();
        };

        // Also handle error cases
        audioElement.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          restartListeningAfterSpeech();
        };
      } catch (error) {
        console.error("Error with welcome speech:", error);
        setIsSpeaking(false);
        currentAudioRef.current = null;
        // Fallback to just start listening if TTS fails
        restartListeningAfterSpeech();
      }
    }
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

    // Stop listening during API call for voice agent
    if (activeAgent === "voice agent" && isListening) {
      stopVoiceRecognition();
    }

    // call to AI Agent - Python
    const agentResponse = await chat(userMessage);

    refreshCart();

    // Parse the agent response if it's a nested JSON string
    let parsedResponse = agentResponse;
    if (agentResponse && agentResponse.agent_response) {
      try {
        // Try to parse the nested JSON string
        // First, try to fix common JSON formatting issues (single quotes to double quotes)
        let jsonString = agentResponse.agent_response;
        jsonString = jsonString.replace(/'/g, '"'); // Replace single quotes with double quotes

        parsedResponse = JSON.parse(jsonString);
        console.log("Successfully parsed agent response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing agent_response:", error);
        console.log("Raw agent_response:", agentResponse.agent_response);
        // Fallback to original response if parsing fails
        parsedResponse = agentResponse;
      }
    }

    // Check if response contains product IDs
    if (
      parsedResponse &&
      parsedResponse.agent_response_productIds &&
      Array.isArray(parsedResponse.agent_response_productIds)
    ) {
      const responseMessage = {
        sender: "system",
        text: parsedResponse.agent_response_text,
        productIds: parsedResponse.agent_response_productIds,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);

      // Speak the response if it's voice agent
      if (activeAgent === "voice agent") {
        try {
          startSpeaking();
          const audioElement = await speak(parsedResponse.agent_response_text);
          currentAudioRef.current = audioElement;

          // Connect audio output to wave visualization
          if (window.audioWaveControls && audioElement) {
            window.audioWaveControls.connectAudioOutput(audioElement);
          }

          // Listen for audio end to reset speaking state
          audioElement.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };

          // Also handle error cases
          audioElement.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };
        } catch (error) {
          console.error("Error with text-to-speech:", error);
          setIsSpeaking(false);
          currentAudioRef.current = null;
        }
      }
    } else {
      // Handle regular text response
      const responseText =
        typeof parsedResponse === "object"
          ? parsedResponse.agent_response_text
          : parsedResponse;

      const responseMessage = {
        sender: "system",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);

      // Speak the response if it's voice agent
      if (activeAgent === "voice agent") {
        try {
          startSpeaking();
          const audioElement = await speak(responseText);
          currentAudioRef.current = audioElement;

          // Connect audio output to wave visualization
          if (window.audioWaveControls && audioElement) {
            window.audioWaveControls.connectAudioOutput(audioElement);
          }

          // Listen for audio end to reset speaking state
          audioElement.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };

          // Also handle error cases
          audioElement.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };
        } catch (error) {
          console.error("Error with text-to-speech:", error);
          setIsSpeaking(false);
          currentAudioRef.current = null;
        }
      }
    }
  };

  const handleVoiceToggle = () => {
    if (activeAgent !== "voice agent") return;

    // Don't allow toggling while speaking
    if (isSpeaking) return;

    if (!isListening) {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // Don't start recognition if currently speaking
    if (isSpeaking) {
      return;
    }

    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      interimTranscriptRef.current = "";
      console.log("Voice recognition started");
    };

    recognitionRef.current.onresult = (event) => {
      // Don't process results if we're currently speaking
      if (isSpeaking) {
        return;
      }

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update display with current transcript
      const currentTranscript = finalTranscript || interimTranscript;
      setInputMessage(currentTranscript);
      interimTranscriptRef.current = currentTranscript;

      // Clear existing silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // If we have a final result or substantial interim result, set up auto-send timer
      if (finalTranscript.trim() || interimTranscript.trim().length > 3) {
        silenceTimerRef.current = setTimeout(() => {
          const textToSend = interimTranscriptRef.current.trim();
          if (textToSend && !isSpeaking) {
            sendTranscribedMessage(textToSend);
            setInputMessage("");
            interimTranscriptRef.current = "";

            // Don't restart listening here - let the TTS response handle it
          }
        }, 2000); // 2 second delay after speech stops
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        alert(
          "Microphone access denied. Please allow microphone access and try again."
        );
        setIsListening(false);
      } else if (event.error === "no-speech") {
        // Only restart if not speaking
        if (!isSpeaking) {
          setTimeout(() => {
            if (activeAgent === "voice agent" && isListening && !isSpeaking) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      } else {
        console.log("Speech recognition error, restarting...");
        if (!isSpeaking) {
          setTimeout(() => {
            if (activeAgent === "voice agent" && isListening && !isSpeaking) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      }
    };

    recognitionRef.current.onend = () => {
      console.log("Voice recognition ended");
      // Only auto-restart if not speaking and still supposed to be listening
      if (activeAgent === "voice agent" && isListening && !isSpeaking) {
        setTimeout(() => {
          if (!isSpeaking) {
            // Double check before restarting
            recognitionRef.current.start();
          }
        }, 100);
      }
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
    }
    setIsListening(false);
    setInputMessage("");
    interimTranscriptRef.current = "";
    console.log("Voice recognition stopped");
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (restartListeningTimeoutRef.current) {
        clearTimeout(restartListeningTimeoutRef.current);
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
    };
  }, []);

  // Helper function to send transcribed message
  const sendTranscribedMessage = async (transcript) => {
    if (!transcript.trim() || isSpeaking) return;

    const userMessage = {
      sender: "user",
      text: transcript,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Stop listening during API call
    if (isListening) {
      stopVoiceRecognition();
    }

    // call to AI Agent - Python
    const agentResponse = await chat(userMessage);

    refreshCart();

    // Parse the agent response if it's a nested JSON string
    let parsedResponse = agentResponse;
    if (agentResponse && agentResponse.agent_response) {
      try {
        // Try to parse the nested JSON string
        // First, try to fix common JSON formatting issues (single quotes to double quotes)
        let jsonString = agentResponse.agent_response;
        jsonString = jsonString.replace(/'/g, '"'); // Replace single quotes with double quotes

        parsedResponse = JSON.parse(jsonString);
        console.log("Successfully parsed agent response:", parsedResponse);
      } catch (error) {
        console.error("Error parsing agent_response:", error);
        console.log("Raw agent_response:", agentResponse.agent_response);
        // Fallback to original response if parsing fails
        parsedResponse = agentResponse;
      }
    }

    // Check if response contains product IDs
    if (
      parsedResponse &&
      parsedResponse.agent_response_productIds &&
      Array.isArray(parsedResponse.agent_response_productIds)
    ) {
      const responseMessage = {
        sender: "system",
        text: parsedResponse.agent_response_text,
        productIds: parsedResponse.agent_response_productIds,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);

      // Speak the response if it's voice agent
      if (activeAgent === "voice agent") {
        try {
          startSpeaking();
          const audioElement = await speak(parsedResponse.agent_response_text);
          currentAudioRef.current = audioElement;

          // Connect audio output to wave visualization
          if (window.audioWaveControls && audioElement) {
            window.audioWaveControls.connectAudioOutput(audioElement);
          }

          // Listen for audio end to reset speaking state
          audioElement.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };

          // Also handle error cases
          audioElement.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };
        } catch (error) {
          console.error("Error with text-to-speech:", error);
          setIsSpeaking(false);
          currentAudioRef.current = null;
        }
      }
    } else {
      // Handle regular text response
      const responseText =
        typeof parsedResponse === "object"
          ? parsedResponse.agent_response_text
          : parsedResponse;

      const responseMessage = {
        sender: "system",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, responseMessage]);

      // Speak the response if it's voice agent
      if (activeAgent === "voice agent") {
        try {
          startSpeaking();
          const audioElement = await speak(responseText);
          currentAudioRef.current = audioElement;

          // Connect audio output to wave visualization
          if (window.audioWaveControls && audioElement) {
            window.audioWaveControls.connectAudioOutput(audioElement);
          }

          // Listen for audio end to reset speaking state
          audioElement.onended = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };

          // Also handle error cases
          audioElement.onerror = () => {
            setIsSpeaking(false);
            currentAudioRef.current = null;
            restartListeningAfterSpeech();
          };
        } catch (error) {
          console.error("Error with text-to-speech:", error);
          setIsSpeaking(false);
          currentAudioRef.current = null;
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    // Clean up any ongoing operations
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (restartListeningTimeoutRef.current) {
      clearTimeout(restartListeningTimeoutRef.current);
      restartListeningTimeoutRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    setShowOptions(true);
    setActiveAgent(null);
    setMessages([]);
    setInputMessage("");
    setIsListening(false);
    setIsSpeaking(false);
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
        <div className="fixed bottom-6 right-6 z-50 bg-white w-[400px] h-[600px]">
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

                  {/* Audio Wave for Voice Agent */}
                  {activeAgent === "voice agent" && (
                    <div className="mb-3">
                      <AudioWave
                        isActive={activeAgent === "voice agent"}
                        isListening={isListening}
                        isSpeaking={isSpeaking}
                      />
                    </div>
                  )}

                  {/* Input */}
                  {activeAgent === "voice agent" ? (
                    // Voice Agent - Only show voice button
                    <div className="flex justify-center">
                      <Button
                        onClick={handleVoiceToggle}
                        disabled={isSpeaking}
                        variant={isListening ? "default" : "outline"}
                        size="lg"
                        className={`px-6 py-3 ${
                          isListening ? "bg-red-600 hover:bg-red-700" : ""
                        } ${isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isSpeaking
                          ? "🔊 Speaking..."
                          : isListening
                          ? "🔴 Stop"
                          : "🎤 Start"}
                      </Button>
                    </div>
                  ) : (
                    // Chat Agent - Show text input and send button
                    <div className="flex items-center justify-center space-x-2">
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

                      <div className="flex items-center mb-2">
                        <Button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim()}
                        >
                          ➤
                        </Button>
                      </div>
                    </div>
                  )}
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
