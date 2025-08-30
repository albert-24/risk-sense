import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";
import type { ChatClassifierResponse } from "@/services/mordorService";

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
      function formatToMarkdown(aiResponseText: String, classificationResponse: ChatClassifierResponse) {
        var redirectionUrl = null;
        try {
          redirectionUrl = new URL(classificationResponse.url)
        } catch {}

        console.log("Redirection URL:", redirectionUrl);
        
        var redirectionName = 'this website';
        if (classificationResponse.target == "analytics") {
          redirectionName = 'GATES Analytics Dashboard';
        } else {
          redirectionName = `${classificationResponse.target} website`;
        }
        const redirectionMessage = redirectionUrl ? `<br /><br />For more detailed information, please visit the <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="${redirectionUrl.href}" target="_blank">${redirectionName}</a>` : '';
        return `${aiResponseText}${redirectionMessage}`;
      }
      
      const { aiResponse, classificationResponse } = action.payload;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: formatToMarkdown(aiResponse.text, classificationResponse),
        role: "assistant",
        timestamp: new Date().toISOString(),
        geoJson: aiResponse.geoJson,
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
