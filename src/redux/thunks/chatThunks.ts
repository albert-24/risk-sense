import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateResponse } from "../../services/geminiService";
import { classifyChat } from "@/services/mordorService";

export const fetchChatbotResponse = createAsyncThunk(
  "chat/fetchChatbotResponse",
  async (message: string) => {
     const promises = await Promise.allSettled([generateResponse(message), classifyChat({
      query: message,
      page: "GIS WebApp"
    })]);

    const aiResponse = promises[0];
    const classificationResponse = promises[1];

    console.log("AI Response:", aiResponse);
    console.log("Classification Response:", classificationResponse);

    return {
      aiResponse, classificationResponse,
    }
  }
);

// export const classifyChatResponse = createAsyncThunk(
//   "chat/classifyChatResponse",
//   async (message: string) => {
//     const response = await classifyChat({
//       query: message,
//       page: "GIS WebApp"
//     });
//     return response;
//   }
// );
