import axios from "axios";

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
