import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  geoJson?: GeoJSON.FeatureCollection;
}

interface ChatState {
  messages: Message[];
  sendingStatus: "idle" | "sending" | "sent" | "error";
}

const initialState: ChatState = {
  messages: [],
  sendingStatus: "idle",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendToChatbot: (state, action: PayloadAction<string>) => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: action.payload,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      state.messages = [...state.messages, newMessage];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatbotResponse.pending, (state) => {
      state.sendingStatus = "sending";
    });

    builder.addCase(fetchChatbotResponse.fulfilled, (state, action) => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: action.payload.text,
        role: "assistant",
        timestamp: new Date().toISOString(),
        geoJson: action.payload.geoJson,
      };

      state.messages = [...state.messages, newMessage];
      state.sendingStatus = "sent";
    });

    builder.addCase(fetchChatbotResponse.rejected, (state) => {
      state.sendingStatus = "error";
    });
  },
});

export const { sendToChatbot } = chatSlice.actions;

export default chatSlice.reducer;
