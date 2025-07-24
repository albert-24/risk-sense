import { createAsyncThunk } from "@reduxjs/toolkit";
import { generateResponse } from "../../services/geminiService";

export const fetchChatbotResponse = createAsyncThunk(
  "chat/fetchChatbotResponse",
  async (message: string) => {
    const response = await generateResponse(message);
    return response;
  }
);
