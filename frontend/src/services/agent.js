import axios from "axios";
import { experimental_generateSpeech as generateSpeech } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Openai configs
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "<your_key>",
});

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-Type": "application/json",
  },
});

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Get all products
export const chat = async (userInputData) => {
  console.log("user_input_data", userInputData);

  const payload = {
    user_input: userInputData?.text,
  };

  try {
    const response = await api.post("/chat", payload);

    if (isValidJSON(response?.data?.agent_response)) {
      const jsonResponse = JSON.parse(response?.data?.agent_response);

      return jsonResponse;
    }

    return response?.data?.agent_response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Text-to-speech function using OpenAI
export const speak = async (text) => {
  try {
    const audio = await generateSpeech({
      model: openai.speech("tts-1"),
      voice: "nova",
      text: text,
      instructions:
        'Affect/personality: A cheerful guide \n\nTone: Friendly, clear, and reassuring, creating a calm atmosphere and making the listener feel confident and comfortable.\n\nPronunciation: Clear, articulate, and steady, ensuring each instruction is easily understood while maintaining a natural, conversational flow.\n\nPause: Brief, purposeful pauses after key instructions (e.g., "cross the street" and "turn right") to allow time for the listener to process the information and follow along.\n\nEmotion: Warm and supportive, conveying empathy and care, ensuring the listener feels guided and safe throughout the journey.',
    });

    const generatedAudio = audio.audio;

    const audioBlob = new Blob([generatedAudio?.uint8ArrayData], {
      type: "audio/mp3",
    });
    const url = URL.createObjectURL(audioBlob);

    const audioElement = new Audio(url);

    // Play the audio
    audioElement
      .play()
      .then(() => console.log("Audio is playing"))
      .catch((error) => console.error("Error playing audio:", error));

    // Optional: Release the URL when done
    const originalOnended = audioElement.onended;
    audioElement.onended = () => {
      URL.revokeObjectURL(url);
      console.log("Audio playback ended, URL revoked");
      if (originalOnended) {
        originalOnended();
      }
    };

    return audioElement;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
