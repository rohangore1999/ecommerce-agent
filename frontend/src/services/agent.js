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

    // const response = {
    //   agent_response:
    //     '{\n    "agent_response_text": "Here are list of products from Cart: ",\n    "agent_response_productIds": ["1", "2"]\n}',
    // };

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
      voice: "coral", // or alloy, echo, fable, onyx, nova, shimmer
      text: text,
      instructions: "Speak in a cheerful and positive tone.",
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
    audioElement.onended = () => {
      URL.revokeObjectURL(url);
      console.log("Audio playback ended, URL revoked");
    };

    return audioElement;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};
